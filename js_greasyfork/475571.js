// ==UserScript==
// @name         Jenkins任务自动配置
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Jenkins任务自动配置，初始化安装，安装默认插件等
// @author       You
// @match        http://**/*
// @match        https://**/*
// @icon         https://tse4-mm.cn.bing.net/th/id/OIP-C.Nfu6mairEIb5fSYUwuNCTAHaHa?pid=ImgDet&rs=1
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475571/Jenkins%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/475571/Jenkins%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

/**
 * 1、用户拷贝密码进来 执行初始化
 * 2、修改插件更新地址 安装插件
 * 3、创建新任务 执行
 */

(function () {
  "use strict";
  if (self !== top) return;
  if (!isInitPage() && !isIntoJenkins()) return;
  const globalPrefix = "jks-";
  function isInitPage() {
    return (
      document.body.getAttribute("data-model-type") ==
      "jenkins.install.SetupWizard"
    );
  }
  function isIntoJenkins() {
    return document.getElementById("jenkins-name-icon");
  }
  function createRoot() {
    const root = document.createElement("div");
    document.body.appendChild(root);
    return root;
  }
  function setStorage(name, value) {
    setTimeout(() => {
      GM_setValue(
        `${location.host}:${name}`.replace(/:/g, "_"),
        typeof value == "string" ? value : JSON.stringify(value)
      );
    });
  }
  function getStorage(name, value = "") {
    return GM_getValue(`${location.host}:${name}`.replace(/:/g, "_"), value);
  }
  var PanelInitUser = {
    template: `
    <div v-if="isShow">
      <div>初始化密码：<input style="width:300px;" v-model.trim="pwd"/><br/>这里已自动从jenkins读取初始化密码，如果未空请手动拷贝过来</div>
      <div>设置登录root密码：<input v-model.trim="rootpwd"/>后续登录密码</div>
      <div><button @click="submit">执行</button></div>
    </div>
    `,
    data() {
      return {
        isShow: true,
        pwd: "",
        rootpwd: "Jenkins12345",
      };
    },
    created() {
      const p = getStorage("jenkins_root_pwd");
      if (p) {
        this.rootpwd = p;
      }
      const that = this;
      fetch(`http://${location.hostname}:30600/read/log.jenkins.txt`).then(
        (res) => {
          res.text().then((content) => {
            that.pwd = content;
          });
        }
      );
    },
    mounted() {
      if (document.querySelector(".set-security-key")) {
        document.querySelector(".set-security-key").style.display = "none";
      }
    },
    methods: {
      submit() {
        if (!isInitPage()) {
          alert("当前不是初始化页面，已退出");
          return;
        }
        if (!this.pwd || !this.rootpwd) {
          alert("都必填，root密码要6位及以上，已退出");
          return;
        }
        if (!document.querySelector(".set-security-key")) return;
        const rootpwd = this.rootpwd;
        // if (confirm("是否确认执行初始化Jenkins？") == true) {
        document.getElementById("security-token").value = this.pwd;
        setStorage("jenkins_root_pwd", rootpwd);
        setStorage("jenkins_step", "1_2");
        document.querySelector(".set-security-key").click();
        // }
      },
    },
  };

  var PanelInstallPlugin = {
    template: `
    <div>
      <div>请输入要安装的插件名称，每行一个</div>
      <div><textarea rows="8" cols="33" v-model.trim="txt"/></div>
      <div><button @click="submit">执行</button></div>
    </div>
    `,
    data() {
      return {
        txt: "",
      };
    },
    created() {
      this.txt = "Git Parameter\nSSH Agent";
    },
    methods: {
      submit() {
        const txtArr = this.txt
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean);
        if (!txtArr.length) {
          alert("请输入插件名称");
          return;
        }
        // if (confirm("是否确认要安装插件？") == true) {
        setStorage("jenkins_want_plugin", txtArr.join("\n"));
        setStorage("jenkins_step", "2_1");
        // window.location.href = "/manage/pluginManager/available";
        // }
      },
    },
  };

  var PanelCreateCredential = {
    template: `
    <div>
      <div>依次创建gitlabt，harbor的全局凭据</div>
      <div>
        Gitlab账号<input v-model.trim="gitaccount"/><br/>
        Gitlab密码<input v-model.trim="gitpwd"/><br/>
        <div><button @click="submitGitlab">执行</button></div>
      </div>
      <div>
        Harbor账号<input v-model.trim="harboraccount"/><br/>
        Harbor密码<input v-model.trim="harborpwd"/>
        <div><button @click="submitHarbor">执行</button></div>
      </div>
      <div>
        ssh发布服务器，秘钥登录自行配置，在流水线中注释代码可用。
      </div>
    </div>
    `,
    data() {
      return {
        gitaccount: "root",
        gitpwd: "Gitlab12345",
        harboraccount: "admin",
        harborpwd: "Harbor12345",
      };
    },
    created() {
      const olddata = JSON.parse(getStorage("credential_data", "{}"));
      for (let key in this.$data) {
        this[key] = olddata[key] || this[key];
      }
    },
    methods: {
      submit() {
        setStorage("credential_data", JSON.stringify(this.$data));
      },
      submitGitlab() {
        if (!this.gitaccount || !this.gitpwd) {
          alert(
            "请输入Gitlab账号密码，如果还没登录Gitlab，请先用默认密码登录后，修改root密码之后再输入"
          );
        }
        this.submit();
        setStorage("jenkins_step", "3_1");
        location.href =
          "/manage/credentials/store/system/domain/_/newCredentials";
      },
      submitHarbor() {
        if (!this.harboraccount || !this.harborpwd) {
          alert("请输入Harbor账号密码");
        }
        this.submit();
        setStorage("jenkins_step", "3_2");
        location.href =
          "/manage/credentials/store/system/domain/_/newCredentials";
      },
    },
  };

  var PanelCreateTask = {
    template: `
    <div>
    <div>将创建自由任务，并设置流水线代码</div>
    <div>Git项目地址:<input v-model.trim="cloneurl"  placeholder="必填" style="width:300px;"/></div>
    <div style="display:none;">Harbor地址:<input v-model.trim="harborurl"/>Harbor分组:<input v-model.trim="harborgroup"/></div>
    <div>后端接口地址:<input style="width:300px;" v-model.trim="apiurl"/></div>
    <div>前端页面端口:<input v-model.trim="httpport"/></div>
    <div><button @click="submit">执行</button></div>
    </div>
    `,
    data() {
      return {
        cloneurl: `http://${location.hostname}:30300/root/vuetest.git`,
        harborurl: location.hostname + ":30200",
        harborgroup: "library",
        apiurl: `http://${location.hostname}:8088`,
        httpport: "50090",
      };
    },
    created() {
      const olddata = JSON.parse(getStorage("task_data", "{}"));
      for (let key in this.$data) {
        this[key] = `${olddata[key] || this[key]}`;
      }
      const that = this;
      fetch(`http://${location.hostname}:30600/read/log.ip.txt`).then((res) => {
        res.text().then((content) => {
          that.cloneurl = `http://${content}:30300/root/vuetest.git`;
          that.harborurl = content + ":30200";
          that.apiurl = `http://${content}:8088`;
        });
      });
    },
    methods: {
      submit() {
        if (
          !this.cloneurl ||
          // !this.harborurl ||
          // !this.harborgroup ||
          !this.apiurl ||
          !this.httpport
        ) {
          alert("请输入前五项，只有ssh服务器ip可不填");
        }
        setStorage("task_data", JSON.stringify(this.$data));
        setStorage("jenkins_step", "4_1");
        location.href = "/view/all/newJob";
      },
    },
  };

  var App = {
    template: `<div class="${globalPrefix}root">
      <div><button @click="toggleIfShow">控制台（显示/折叠）</button></div>
      <div v-if="ifShow" class="${globalPrefix}group">
        <div style="margin-bottom: 10px;">选择要执行的操作：</div>
        <div v-if="isShowStep1" class="${globalPrefix}panel">
          <div class="${globalPrefix}panel-title" @click="chooseStep=1">- 初始化安装Jenkins</div>
          <PanelInitUser class="${globalPrefix}panel-body" v-if="chooseStep==1"/>
        </div>
        <div v-if="isShowStep2" class="${globalPrefix}panel">
          <div class="${globalPrefix}panel-title" @click="chooseStep=2">- 安装插件</div>
          <PanelInstallPlugin class="${globalPrefix}panel-body" v-if="chooseStep==2"/>
        </div>
        <div v-if="isShowStep2" class="${globalPrefix}panel">
          <div class="${globalPrefix}panel-title" @click="chooseStep=3">- 新建凭据</div>
          <PanelCreateCredential class="${globalPrefix}panel-body" v-if="chooseStep==3"/>
        </div>
        <div v-if="isShowStep2" class="${globalPrefix}panel">
          <div class="${globalPrefix}panel-title" @click="chooseStep=4">- 新建任务</div>
          <PanelCreateTask class="${globalPrefix}panel-body" v-if="chooseStep==4"/>
        </div>
      </div>
    </div>`,
    data() {
      return {
        ifShow: true,
        chooseStep: 1,
        isShowStep1: !!isInitPage(),
        isShowStep2: !!isIntoJenkins(),
      };
    },
    components: {
      PanelInitUser,
      PanelInstallPlugin,
      PanelCreateCredential,
      PanelCreateTask,
    },
    created() {
      console.log(123);
    },
    methods: {
      toggleIfShow() {
        this.ifShow = !this.ifShow;
        this.chooseStep = -1;
      },
    },
  };

  async function runLoop() {
    const currentStep = getStorage("jenkins_step");
    if (currentStep == "-1") return;
    const newtxt = getStorage("jenkins_want_plugin");
    const credentialJson = JSON.parse(getStorage("credential_data", "{}"));
    const taskJson = JSON.parse(getStorage("task_data", "{}"));
    for (let key in taskJson) {
      taskJson[key] = taskJson[key].replace(/\n/g, "");
    }
    const txtArr = newtxt
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    switch (currentStep) {
      case "1_2":
        // 选择默认安装插件
        if (!document.querySelector(".install-recommended")) return;
        setStorage("jenkins_step", "1_3");
        document.querySelector(".install-recommended").click();
        break;
      case "1_3":
        // 填写root账号密码
        const setupIframe = document.getElementById("setup-first-user");
        if (
          !setupIframe ||
          !setupIframe.contentWindow.document.querySelector(
            "input[name=username]"
          )
        )
          return;
        setStorage("jenkins_step", "1_4");
        setupIframe.contentWindow.document.querySelector(
          "input[name=username]"
        ).value = "root";
        const rootpwd = getStorage("jenkins_root_pwd");

        setupIframe.contentWindow.document.querySelector(
          "input[name=password1]"
        ).value = rootpwd;
        setupIframe.contentWindow.document.querySelector(
          "input[name=password2]"
        ).value = rootpwd;
        setupIframe.contentWindow.document.querySelector(
          "input[name=email]"
        ).value = "root@q.c";
        document.querySelector(".save-first-user").click();
        break;
      case "1_4":
        // 实例配置
        if (!document.querySelector(".save-configure-instance")) return;
        setStorage("jenkins_step", "1_5");
        document.querySelector(".save-configure-instance").click();
        break;
      case "1_5":
        // Jenkins已就绪
        if (!document.querySelector(".install-done")) return;
        setStorage("jenkins_step", "-1");
        document.querySelector(".install-done").click();
        break;
      case "2_1":
        // 读取剩余插件，在搜索框输入，模拟键盘斜杠和输入事件
        if (location.pathname != "/manage/pluginManager/available") {
          window.location.href = "/manage/pluginManager/available";
          return;
        }
        if (!document.querySelector(".jenkins-search__input")) return;
        if (txtArr.length == 0) {
          setStorage("jenkins_step", "-1");
          return;
        }
        const pluginName = txtArr.shift();
        // 模拟键盘斜杠
        const ke = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 191,
        });
        document.body.dispatchEvent(ke);
        // 输入插件名
        var objInput = document.querySelector(".jenkins-search__input");
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        objInput.value = pluginName;
        objInput.dispatchEvent(event);
        setStorage("jenkins_want_plugin", txtArr.join("\n"));
        setStorage("jenkins_step", "2_2");
        break;
      case "2_2":
        if (!document.querySelector(".jenkins-search__input")) return;
        // 精确勾选插件
        const pluginName2 = document.querySelector(
          ".jenkins-search__input"
        ).value;
        if (!pluginName2.trim()) return;
        const lowerName = pluginName2.toLowerCase().trim().replace(/ +/g, "-"); // 把空格缓存短线
        const dom = document.getElementById(`plugin.${lowerName}.default`);
        if (!dom) {
          if (txtArr.length == 0) {
            setStorage("jenkins_step", "2_4");
            document.location.href = "/manage/pluginManager/updates/";
          } else {
            setStorage("jenkins_step", "2_1");
          }
          return;
        }
        setStorage("jenkins_step", "2_3");
        dom.click();
        break;
      case "2_3":
        if (!document.querySelector(".jenkins-search__input")) return;
        // 勾选插件后，点击install按钮
        setStorage("jenkins_step", "2_4");
        const pluginName3 = document.querySelector(
          ".jenkins-search__input"
        ).value;
        const allPlugins = getStorage("jenkins_installed_plugins")
          .split("\n")
          .filter(Boolean);
        allPlugins.push(pluginName3);
        setStorage("jenkins_installed_plugins", allPlugins.join("\n"));
        document.querySelector("#button-install").click();
        break;
      case "2_4":
        if (!document.querySelector(".attach-previous")) return;
        // 检查如果安装完了，可能应该自动重启
        if (txtArr.length == 0) {
          setStorage("jenkins_step", "-1");
          document.querySelector(".attach-previous").click();
          window.scrollTo(0, 100000000);
          setTimeout(() => {
            window.location.reload();
          }, 8000);
        } else {
          setStorage("jenkins_step", "2_1");
        }
        break;
      case "3_1":
        if (
          location.pathname !=
          "/manage/credentials/store/system/domain/_/newCredentials"
        ) {
          location.href =
            "/manage/credentials/store/system/domain/_/newCredentials";
          return;
        }
        if (!document.querySelector('input[name="_.username"]')) return;
        document.querySelector('input[name="_.username"]').value =
          credentialJson.gitaccount;
        document.querySelector('input[name="_.password"]').value =
          credentialJson.gitpwd;
        document.querySelector('input[name="_.id"]').value = "gitlabroot";
        document.querySelector("button[name=Submit]").click();
        setStorage("jenkins_step", "-1");
        break;
      case "3_2":
        if (
          location.pathname !=
          "/manage/credentials/store/system/domain/_/newCredentials"
        ) {
          location.href =
            "/manage/credentials/store/system/domain/_/newCredentials";
          return;
        }
        if (!document.querySelector('input[name="_.username"]')) return;
        document.querySelector('input[name="_.username"]').value =
          credentialJson.harboraccount;
        document.querySelector('input[name="_.password"]').value =
          credentialJson.harborpwd;
        document.querySelector('input[name="_.id"]').value = "harbor";
        document.querySelector("button[name=Submit]").click();
        setStorage("jenkins_step", "-1");
        break;
      case "4_1":
        if (location.pathname != "/view/all/newJob") {
          location.href = "/view/all/newJob";
          return;
        }
        if (
          !document.querySelector(
            ".org_jenkinsci_plugins_workflow_job_WorkflowJob"
          )
        )
          return;
        let taskJsonURL = new URL(taskJson.cloneurl);
        let paths = taskJsonURL.pathname.split("/").filter(Boolean);
        // document.getElementById("name").value = paths[1].replace(/\.git$/, "");
        document
          .querySelector(".org_jenkinsci_plugins_workflow_job_WorkflowJob")
          .click();
        const objInput1 = document.getElementById("name");
        const event1 = new Event("input", { bubbles: true });
        event1.simulated = true;
        objInput1.value = paths[1].replace(/\.git$/, "");
        objInput1.dispatchEvent(event1);
        setStorage("jenkins_step", "4_2");
        break;
      case "4_2":
        if (!document.querySelector(".btn-decorator button")) return;
        document.querySelector(".btn-decorator button").click();
        setStorage("jenkins_step", "4_3");
        break;
      case "4_3":
        if (!document.querySelectorAll(".attach-previous")) return;
        [...document.querySelectorAll(".attach-previous")]
          .find((dom) => dom.innerHTML == "不允许并发构建")
          .click();
        fetch(`http://${location.hostname}:30600/read/pipeline.groovy`).then(
          (res) => {
            res.text().then((content) => {
              // const content = /blob\_raw.*\>([\s\S]*?)<\/textarea\>/g.exec(
              //   txt
              // )[1];

              const taskJsonURL = new URL(taskJson.cloneurl);
              const paths = taskJsonURL.pathname.split("/").filter(Boolean);
              document.querySelector('textarea[name="_.script"]').value =
                content
                  // .replace(/&#x000A;/g, "\n") // 替换换行
                  // .replace(/&#39;/g, "'") // 替换单引号
                  // .replace(/&quot;/g, '"') // 替换双引号
                  // .replace(
                  //   /harborServer = '(.*)'/g,
                  //   `harborServer = '${taskJson.harborurl}'`
                  // ) // 替换harbor地址
                  // .replace(
                  //   /harborLibrary = '(.*)'/g,
                  //   `harborLibrary = '${taskJson.harborgroup}'`
                  // ) // 替换harbor分组
                  .replace(
                    /gitServer = '(.*)'/g,
                    `gitServer = '${taskJsonURL.host}'`
                  ) // 替换Gitserver
                  .replace(/gitGroup = '(.*)'/g, `gitGroup = '${paths[0]}'`) // 替换gitGroup分组
                  .replace(
                    /gitProjectName = '(.*)'/g,
                    `gitProjectName = '${paths[1].replace(/\.git$/, "")}'`
                  ) // 替换gitGroup分组
                  .replace(
                    /testApiServer = '(.*)'/g,
                    `testApiServer = '${taskJson.apiurl}'`
                  ) // 替换testApiServer
                  // .replace(
                  //   /webHtmlServer = '(.*)'/g,
                  //   `webHtmlServer = '${taskJson.harborurl.split(":")[0]}'`
                  // ) // 替换testApiServer
                  .replace(
                    /webHtmlPort = '(.*)'/g,
                    `webHtmlPort = '${taskJson.httpport}'`
                  ); // 替换 webHtmlPort
              document
                .querySelector("#bottom-sticker button[name='Submit']")
                .click();
            });
          }
        );
        setStorage("jenkins_step", "5_1");
        break;
      case "5_1":
        const allB2 = [...document.querySelectorAll(".task-link-wrapper a")];
        const buildB = allB2.find((a) => a.href.includes("build"));
        if (buildB) {
          setStorage("jenkins_step", "-1");
          buildB.click();
        }
        break;
      // case "5_2":
      //   if (document.querySelector(".jenkins-button--primary")) {
      //     setStorage("jenkins_step", "-1");
      //     document.querySelector(".jenkins-button--primary").click();
      //   }
      //   break;
    }
  }

  function createStyle() {
    var style = document.createElement("style");
    document.body.appendChild(style);
    style.innerHTML = `
      .${globalPrefix}root{
        position: absolute;
        top : 200px;
        right: 10px;
        // transform: translate(50%, 10px);
        z-index: 99999;
      }
      .${globalPrefix}group{
        background: #82c1f7;
        padding: 10px;
      }
      .${globalPrefix}panel{
        margin-top: 10px;
      }
      .${globalPrefix}panel-title{
        background: #ff9800;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .${globalPrefix}panel-body{
        background: #090;
        padding: 10px;
      }
      .${globalPrefix}panel:first-child{
        cursor: pointer;
      }
    `;
  }
  createStyle();
  var intervalTimer = setInterval(() => {
    try {
      runLoop();
    } catch {
      clearInterval(intervalTimer);
    }
  }, 1000);
  new Vue({
    render: (h) => h(App),
  }).$mount(createRoot());
})();
