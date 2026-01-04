// ==UserScript==
// @name           Speedownload
// @namespace      tamp.catboxhub.com
// @version        5.2.0
// @author         初音·未来
// @antifeature    membership
// @description    支持浏览器下载、批量下载、文件夹下载、Aria2、IDM下载。配合加速链接可不限速
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAABBVBMVEUAAAB0rNJ2s9R0stJ2tNV3s9R5s9l2s9R2stJ3s9R2s9R3stR2s9N2stN2s9N3s9R2stR3stJ3s9R2s9R1sNN3s9R2s9R2stN3s9R2stR2s9R3s9R2stN3stR0sdV2s9R2s9R2s9N3s9N3stN2s9N2s9R2s9R3s9J3stV4stR2stN3s9T///9mlbD8/f58ttZomrbf7fX5/P3q8/jN4/CGvNmy1Oer0OSgy+KPwdxtoL2BudhwqMb1+fzZ6vPE3+2Kvtp0rMzt9frv9vre6O6Vw910rs/k8PfQ3+eax+COs8iCqb9vm7VpmLLm7fLT5vJ3obm82erC1eC80dy0zNmausykwNAwUSvcAAAAK3RSTlMABewNNvYIix/m4pNwYfnwTxTXyyef3cS5roN4QvMa0r+0p5pnWkk7LizQzqkA9AAABFhJREFUaN61mdlW4kAQhisbJGEH2RkFBQSrE1kEBRXGfcZldNb3f5Q5Os7pEOjO1n533PCd6r+rOumAX6ReMtEs4Ttys1hTFRCHtK12EgUN10jni+19PQbRyXXjFQOZyOVER4+o2K7nZfQgU4r3whtiW3Fq4KLthgxIaiSowocmmwvu2NozMRByVQ1aRsrAwKTjShBFv4qhKDR8b2ilXcKQyDXdZx2JDIZGa235ao08RsL0tkiNAkZE7ngFs3+AkTFSEteRzaAAtDq3DuqIRpZdS+MABSGnWLnkCigMs8vYWHkUiJnb2OcJFEplg0VqZ1AsifVY+iUUTCa1Vojn3D08nU2fx+SNy8X3m8mh50x2D5gU8jk9WQ7JCuOj48/IJ+46Bw1+FcfDc7LG6O77BHl8UlcWq4g8JkPC4PIr8sgrzlY3eSs1HREm9pK7ZknqiPFa5PPRiPAY8oop6zQRmVPH0CZ8xjecVOg2jnPiuCOejGbIpPU/lW2ZvVYLwoHG773B6uyte2QTPwzZtRTfJzx7+h4TnyzZ7b/9JukyV2s28iuxT/i7WGLGfvhMfDNm9n4h9hp7BRmcnBP/LJGB8Rq9ajBTJwG4YnW+9rpeHWRwcxVEMpoigz0JgDlSpiQQz6e4maYOUGBJhsEkY1avmCpI2uZAJjMSENYuTneht3FiHS/pKRV5f7UhuekAuaMG/wyZyW/I/XBBQnHJklSh6VZ8vSIhYUl2oORu80siWmKA+wAZE+ESBAF5UK6OTiaHnpIpiYh9Nz31kEwuSWRGixlfMrWJAMYznuR0QYSw+MyRzMZiJPaSIaFHYQQYRz7IroeTCLDmWAaaHyIZ3ayMleKHSOwpUipQEymhHCFlF1Rn8PaHSJKgpF3PJ+IlWYA8/TW5FiqhT3fO5C++iJXQt622Q/J7JGp3HTteHhSAfdqOt3NR63V+T5+I6gCgl6l0fi9Icj2nV18N16vvmfXTFtLw92e039/eGjsZahm8iMje/mlduO4+9JKzlIdhdMmXlwH9y/76G/bceryOumLfHiy6Wi34R0+jktuB9fhrHEVz/uXBorGns/DOLlIuBtbTw69voeO4/vNoDW5pJ+bgHVXDlVqsp5ffP8J4xj/uH5+swQUthN7gKLvoZP5kRcDpwIO+4/ZcRidn80F4xRk6qAElV8VVLsJ5BvOzW3Rg6tRBUxFMlhporwimCqsoBfGOkgouGrJoh1aX3BKplhYsqSiwht4S68j3YANbpkiHvM/43CsiFnqNyqBjCAud/Rk4lhLVkzUFmEh1MY69GPDICshFq8W8PsSbkTOnebCIdSNa5JQC3uQqkXqQ9gffEv6DvFbpgU9iqULIuVtXwD9b8TDFVFUJAqHmgyrMLARGSZY/BVAc1HQIg55q+dSky8m+BCFR1KIfRyubg0hsJwuGxqlB3on3IToxNbnXNNO4jlEu1hsKCELS1W57r7pj4DuZncpuMqvq/gx/AWOzQlgCEoTLAAAAAElFTkSuQmCC
// @run-at         document-end
// @require        https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @resource       ElementPlusCSS https://lib.baomitu.com/element-plus/2.2.2/index.min.css
// @connect        *
// @connect        127.0.0.1
// @connect        localhost
// @connect        baidu.com
// @connect        baidupcs.com
// @connect        pandownload.net
// @connect        bdjs.lol
// @connect        d.baiduyunpcs.xyz
// @grant          GM_openInTab
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @grant          GM_getResourceText
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @match          *://pan.baidu.com/disk/main*
// @match          *://yun.baidu.com/disk/main*
// @match          *://wangpan.baidu.com/disk/main*
// @match          *://pan.baidu.com/disk/home*
// @match          *://yun.baidu.com/disk/home*
// @match          *://wangpan.baidu.com/disk/home*
// @match          *://pan.baidu.com/s/*
// @match          *://yun.baidu.com/s/*
// @match          *://pan.baidu.com/share/link?*
// @match          *://yun.baidu.com/share/link?*
// @match          *://pan.baidu.com/play/video*
// @match          *://yun.baidu.com/play/video*
// @match          *://pan.baidu.com/share/init*
// @match          *://yun.baidu.com/share/init*
// @downloadURL https://update.greasyfork.org/scripts/450167/Speedownload.user.js
// @updateURL https://update.greasyfork.org/scripts/450167/Speedownload.meta.js
// ==/UserScript==
(function () {

  (() => {
    var i;
    var j;
    var t;
    var table = [];

    for (i = 0; i < 256; i++) {
      t = i;

      for (j = 0; j < 8; j++) {
        t = t & 1 ? t >>> 1 ^ 0xEDB88320 : t >>> 1;
      }

      table[i] = t;
    }

    return table;
  })();

  function isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  var tools = {
    isJSON: isJSON,
    getFinalUrl: function (url) {
      return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: "HEAD",
          url,
          onload: function (response) {
            resolve(response.finalUrl);
          },
          onerror: function (err) {
            reject(new Error(err));
          }
        });
      });
    },
    getAccelerate: function (url) {
      return new Promise(function (resolve, reject) {
        const ElementPlus = unsafeWindow.ElementPlus;
        const accelerateURL = GM_getValue("accelerateURL", "");
        GM_xmlhttpRequest({
          method: "HEAD",
          url,
          onload: function (response) {
            let responseHeaders = response.responseHeaders.toLowerCase();
            let finalUrl = response.finalUrl;
            console.log(finalUrl);
            let filename = finalUrl.match(/&fn=(.*)&rtype=/)[1];
            let decodeFilename = decodeURIComponent(filename.replaceAll('+','%20'));

            if (response.status != 200) {
              let result = {};
              result.code = -1;
              result.errMsg = "无法获取文件的详细信息";
              result.title = decodeFilename;
              return resolve(result);
            }

            let Notification = ElementPlus.ElNotification({
              title: decodeFilename,
              message: '正在请求加速链接,请耐心等待...',
              duration: 0,
              type: 'warning'
            });

              if(responseHeaders.match(/content-md5: (.*)/).length == 0){
                let result = {};
                result.code = -1;
                result.errMsg = "无法获取文件MD5";
                result.title = decodeFilename;
                return resolve(result);
              }

            let contentMD5 = responseHeaders.match(/content-md5: (.*)/)[1];
            let contentLength = responseHeaders.match(/content-length: (.*)/)[1];
            let data = {};
            data.dlink = url;
            data.md5 = contentMD5;
            data.size = contentLength;
            data.name = filename;
            GM_xmlhttpRequest({
              method: "POST",
              url: accelerateURL,
              data: JSON.stringify(data),
              onload: function (response) {
                if (response.status != 200) {
                  Notification.close();
                  let result = {};
                  result.code = -10;
                  result.errMsg = "请求加速链接失败";
                  result.title = decodeFilename;
                  return resolve(result);
                }

                if (response.responseText.length == 0) {
                  Notification.close();
                  let result = {};
                  result.code = -7;
                  result.errMsg = "加速链接未返回任何内容";
                  result.title = decodeFilename;
                  return resolve(result);
                }

                if (!isJSON(response.responseText)) {
                  Notification.close();
                  let result = {};
                  result.code = -2;
                  result.errMsg = "无效的加速链接";
                  result.title = decodeFilename;
                  return resolve(result);
                }

                let ret = JSON.parse(response.responseText);

                if (ret.code != 0) {
                  Notification.close();
                  let result = {};
                  result.code = -3;
                  result.errMsg = ret.message == undefined || ret.message == "" ? "服务器未返回任何有效信息" : ret.message;
                  result.title = decodeFilename;
                  return resolve(result);
                }

                let dlink = ret.data.urls[0].url;

                if (dlink == undefined || dlink == "") {
                  Notification.close();
                  let result = {};
                  result.code = -6;
                  result.errMsg = "该加速链接未返回有效的下载链接";
                  result.title = decodeFilename;
                  return resolve(result);
                }

                Notification.close();
                let result = {};
                result.code = ret.code;
                result.message = ret.message;
                result.url = dlink;
                result.ua = ret.data.ua;
                result.split = ret.data.split;
                result.name = decodeFilename;
                return resolve(result);
              },
              onerror: function (err) {
                Notification.close();
                let result = {};
                result.code = -10;
                result.errMsg = "请求加速链接失败";
                result.title = decodeFilename;
                return resolve(result);
              }
            });
          }
        });
      });
    },
    getCookie: function (name) {
      const strCookie = document.cookie;
      const cookieList = strCookie.split(';');

      for (let i = 0; i < cookieList.length; i++) {
        const arr = cookieList[i].split('=');

        if (name === arr[0].trim()) {
          return arr[1];
        }
      }

      return null;
    },
    browserDownload: function (url) {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url.replace("http://", "https://");
      document.body.appendChild(iframe);
      setTimeout(() => {
        iframe.remove();
      }, 2 * 60 * 1000);
    },
    aria2Download: function (aria2) {
      unsafeWindow.ElementPlus;
      const RpcUrl = "http://" + GM_getValue("RpcHost", "localhost") + ":" + GM_getValue("RpcPort", "6800") + GM_getValue("RpcPath", "/jsonrpc");
      const token = GM_getValue("RpcToken", "");
      const downDir = GM_getValue("Aria2DownloadDir", "C:/Downloads");
      const userAgent = navigator.userAgent;
      let ariaData = {
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'aria2.addUri',
        params: [`token:${token}`, [aria2.url], {
          'dir': downDir.replaceAll("\\", "/") + aria2.dir,
          'out': decodeURIComponent(aria2.fileName),
          'max-connection-per-server': aria2.split,
          'header': [`User-Agent: ${userAgent}`, `Cookie:${aria2.cookie}`]
        }]
      };
      GM_xmlhttpRequest({
        method: "POST",
        url: RpcUrl,
        data: JSON.stringify(ariaData),
        onload: function () {
          unsafeWindow.ElementPlus.ElNotification({
            type: 'success',
            title: decodeURIComponent(aria2.fileName),
            message: '文件已加入 Aria2 下载队列',
            duration: 3000
          });
          aria2.notify.close();
        },
        onerror: function () {
          unsafeWindow.ElementPlus.ElNotification({
            type: 'error',
            title: decodeURIComponent(aria2.fileName),
            message: '推送至 Aria2 时发生错误，请检查配置',
            duration: 3000
          });
          aria2.notify.close();
        }
      });
    }
  };

  // 初始化 Jquery
  var $$1 = window.$;
  var Adblock = {
    init: function () {
      $$1('.wp-s-header-cert__ee-cert-tilte.u-popover__reference').remove();
      $$1('.nd-cus-btn.wp-s-disk-header__right-item').remove();
      $$1('.ad-platform-tips.ad-multi-tips').remove();
      $$1('.init-docs .phone-banner').remove();
      $$1('.gOIbzPb').remove();
      $$1('#web-right-view').remove();
    }
  };

  var scriptName = "Speedownload";
  var title = scriptName + " v0.3.4"; // 初始化库

  var $ = window.$; //var PonyfillCDN = "https://fastly.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js";
  //var StreamSaverCDN = "https://fastly.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js";

  var VueCDN = "https://lib.baomitu.com/vue/3.2.36/vue.global.prod.min.js";
  var ElementPlusCDN = "https://lib.baomitu.com/element-plus/2.2.2/index.full.min.js"; // 过滤广告

  Adblock.init(); // 新版Vue 路由Hook - 备用

  if (unsafeWindow.globalVue != undefined) {
    var ElementUI = unsafeWindow.globalVue.$options._base.prototype;

    unsafeWindow.globalVue._router.afterHooks.push(router => {
      console.log(router);
    });
  } // 判断当前页面


  const URL_HREF = unsafeWindow.location.href;
  const MATCHS = {
    'https?://(pan|yun).baidu.com/disk/main.*': 'pan',
    'https?://(pan|yun).baidu.com/disk/home.*': 'old',
    'https?://(pan|yun).baidu.com/s/.*': 'share',
    'https?://(pan|yun).baidu.com/share/link/?.*': 'share',
    'https?://(pan|yun).baidu.com/play/video/.*': 'video'
  };
  let currentPage = 'pan';

  for (let match in MATCHS) {
    if (new RegExp(match).test(URL_HREF)) {
      currentPage = MATCHS[match];
      break;
    }
  } // 初始化打包下载

  /*
  $.getScript(PonyfillCDN, function () {
    $.getScript(StreamSaverCDN, function () {

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "https://qdall01.baidupcs.com";
      iframe.onload = function () {
        console.log("IFrame加载成功")

        unsafeWindow.downloadSingle = function (url, filename, filesize) {
          const fileStream = unsafeWindow.streamSaver.createWriteStream(filename, {
            size: filesize
          })

          fetch(url)
            .then(response => {
              if (response.status != 200) {
                response.json().then(json => console.log(json));
                return;
              }
              const readableStream = response.body

              unsafeWindow.writer = fileStream.getWriter()

              const reader = response.body.getReader()
              const pump = () => reader.read()
                .then(response => response.done ?
                  unsafeWindow.writer.close() :
                  unsafeWindow.writer.write(response.value).then(pump))

              pump()

            });
        }
        unsafeWindow.downloadBatch = function (downloadList) {
          console.log("Batch Download", downloadList)
          const firstFile = downloadList.metaList[downloadList.dlinkList[0].fs_id]

          let totalSize = 0;
          for (let index in downloadList.dlinkList) {
            let fileList = downloadList.dlinkList[index];
            let meta = downloadList.metaList[fileList.fs_id];
            totalSize += meta.size;
          }

          console.log(totalSize)

          const fileStream = unsafeWindow.streamSaver.createWriteStream(firstFile.server_filename + "等其他(" + (downloadList.dlinkList.length - 1) + ")个文件.zip", {
            size: totalSize
          })

          const readableZipStream = new ZIP({
            async pull(ctrl) {

              for (let index in downloadList.dlinkList) {
                let fileList = downloadList.dlinkList[index];
                let metaList = downloadList.metaList[fileList.fs_id];
                let dlink = fileList.dlink.replace("http://", "https://") + "&origin=dlna";
                let finalUrl = await Tools.getFinalUrl(dlink)

                console.log(finalUrl)

                const res = await fetch(finalUrl)
                const stream = () => res.body
                const name = metaList.path

                ctrl.enqueue({
                  name,
                  stream
                })
              }
              ctrl.close()
            }
          })
          // console.log(readableZipStream)
          // more optimized


          // less optimized
          const writer = fileStream.getWriter()
          const reader = readableZipStream.getReader()
          const pump = () => reader.read()
            .then(res => res.done ? writer.close() : writer.write(res.value).then(pump))

          pump()
        }
      }
      document.body.appendChild(iframe);
    })
  })
  */


  function createApp(className, html) {
    var ElementPlus = unsafeWindow.ElementPlus;
    var Vue = unsafeWindow.Vue;
    var render = html + `
<el-dialog v-model="dialogVisible" title="` + title + `" width="50%" :append-to-body="true">
<el-tabs style="user-select:none;" tab-position="left" v-model="Setting.activeName">
<el-tab-pane label="主设置" name="TabSetting">
  <el-form :model="Setting">
    <el-form-item label="加速链接">
      <el-input v-model="Setting.accelerateInput" placeholder="请在此填入加速链接">
      </el-input>
    </el-form-item>
    <el-form-item label="下载工具" >
      <el-select v-model="Setting.downType" placeholder="选择文件下载方式" >
        <el-option label="浏览器" value="browser">
        </el-option>
        <el-option label="Aria2" value="aria2">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="不使用加速链接">
      <el-checkbox v-model="Setting.disableAccelerate" style="">
      </el-checkbox>
    </el-form-item>
  </el-form>
</el-tab-pane>
<el-tab-pane label="Aria2" name="TabConfig">
      <el-form-item label="主机">
        <el-input v-model="Setting.RpcHostInput" placeholder="输入 Aria2 RPC 所在服务器的 IP 或域名（默认：localhost）">
          <template #prepend>http://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="Setting.RpcPortInput" placeholder="输入 Aria2 RPC 端口号（默认：6800）">
        </el-input>
      </el-form-item>
      <el-form-item label="RPC路径">
        <el-input v-model="Setting.RpcPathInput" placeholder="输入 Aria2 RPC 路径（默认：/jsonrpc）">
        </el-input>
      </el-form-item>
      <el-form-item label="密码令牌（可选）">
        <el-input v-model="Setting.RpcTokenInput" placeholder="输入 Aria2 RPC 密码令牌（如果未启用则留空）">
        </el-input>
      </el-form-item>

      <el-divider>
      </el-divider>
      <el-form-item label="下载路径">
        <el-input v-model="Setting.Aria2DownloadDir" placeholder="输入文件下载路径">
        </el-input>
      </el-form-item>
      <el-form-item label="下载线程数">
        <el-input v-model="Setting.Aria2MaxConnection" placeholder="输入 Aria2 文件下载时的线程数">
        </el-input>
      </el-form-item>

          <span class="dialog-footer">
    <el-button style="float:right" @click="CheckAria2">检查跟 Aria2 的连通性</el-button>
  </span>
</el-tab-pane>
<el-tab-pane label="实验性功能" name="test">
  <el-alert :closable="false" title="以下功能仅供测试使用，不保证随时有效" type="error">
  </el-alert>
</el-tab-pane>

</el-tabs>
<template #footer>
  <span class="dialog-footer">
    <el-button @click="CloseDialog">关闭</el-button>
    <el-button type="primary" @click="SaveAccelerateURL">应用</el-button>
  </span>
</template>
</el-dialog>
</div>`;
    $(className).append(render);
    const App = {
      setup() {
        return {
          dialogVisible: Vue.ref(false),
          Setting: Vue.reactive({
            downType: GM_getValue("downType", "browser"),
            disableAccelerate: Vue.ref(false),
            accelerateInput: Vue.ref(GM_getValue("accelerateURL", "")),
            RpcPathInput: Vue.ref(GM_getValue("RpcPath", "/jsonrpc")),
            RpcHostInput: Vue.ref(GM_getValue("RpcHost", "localhost")),
            RpcPortInput: Vue.ref(GM_getValue("RpcPort", "6800")),
            RpcTokenInput: Vue.ref(GM_getValue("RpcToken", "")),
            Aria2DownloadDir: Vue.ref(GM_getValue("Aria2DownloadDir", "C:/Downloads")),
            Aria2MaxConnection: Vue.ref(GM_getValue("Aria2MaxConnection", "16")),
            activeName: Vue.ref('TabSetting')
          })
        };
      },

      methods: {
        OpenDialog() {
          this.dialogVisible = true;
          this.Setting.disableAccelerate = GM_getValue("disableAccelerate", false);
          this.Setting.accelerateInput = GM_getValue("accelerateURL", "");
          this.Setting.downType = GM_getValue("downType", "browser");
          this.Setting.RpcPathInput = GM_getValue("RpcPath", "/jsonrpc");
          this.Setting.RpcHostInput = GM_getValue("RpcHost", "localhost");
          this.Setting.RpcPortInput = GM_getValue("RpcPort", "6800");
          this.Setting.RpcTokenInput = GM_getValue("RpcToken", "");
          this.Setting.Aria2DownloadDir = GM_getValue("Aria2DownloadDir", "C:/Downloads");
          this.Setting.Aria2MaxConnection = GM_getValue("Aria2MaxConnection", "16");
        },

        CloseDialog() {
          this.dialogVisible = false;
        },
        CheckAria2(){

         const msg = ElementPlus.ElMessage({
        type: 'info',
        message: `正在尝试连接Aria2中...`,
      })

           const RpcUrl = "http://" + this.Setting.RpcHostInput + ":" + this.Setting.RpcPortInput + this.Setting.RpcPathInput;
           const token = this.Setting.RpcTokenInput;

                  let ariaData = {
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'aria2.getVersion',
        params: [`token:${token}`, [RpcUrl], {
        }]
      };
      GM_xmlhttpRequest({
        method: "POST",
        url: RpcUrl,
        data: JSON.stringify(ariaData),
        onload: function () {
            msg.close()
                  ElementPlus.ElMessage({
        type: 'success',
        message: `已成功连接 Aria2`,
      })
        },
        onerror: function () {
            msg.close()
                  ElementPlus.ElMessage({
        type: 'error',
        message: `无法连接至 Aria2`,
      })
        }
      });

        },
        SaveAccelerateURL() {
          this.dialogVisible = false;
          GM_setValue("disableAccelerate", this.Setting.disableAccelerate);
          GM_setValue("accelerateURL", this.Setting.accelerateInput);
          GM_setValue("downType", this.Setting.downType);
          GM_setValue("RpcPath", this.Setting.RpcPathInput);
          GM_setValue("RpcHost", this.Setting.RpcHostInput);
          GM_setValue("RpcPort", this.Setting.RpcPortInput);
          GM_setValue("RpcToken", this.Setting.RpcTokenInput);
          GM_setValue("Aria2DownloadDir", this.Setting.Aria2DownloadDir);
          GM_setValue("Aria2MaxConnection", this.Setting.Aria2MaxConnection);
          ElementPlus.ElMessage({
            message: '已保存该设置',
            type: 'success'
          });
        }

      }
    };
    const app = Vue.createApp(App);
    app.use(ElementPlus);
    app.mount("#app");
  } // 加载 Vue3 + ElementPlus


  GM_addStyle(GM_getResourceText("ElementPlusCSS"));
  $.getScript(VueCDN, function () {
    console.log("[" + scriptName + "] Vue 加载成功");
    $.getScript(ElementPlusCDN, function () {
      console.log("[" + scriptName + "] ElementPlus 加载成功");

      if (currentPage == 'pan') {
        createApp('.wp-s-aside-nav__main-top', `
    <div id="app" class="u-tooltip item wp-aside-nav__main-item wp-aside-nav__main-item">
      <a href="javascript:;" @click="OpenDialog">
    <div class="wp-aside-nav__main-item-wrap">
      <img src="data:image/png;base64,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"
      alt="" class="wp-aside-nav__main-item-img">
      <p class="wp-aside-nav__main-item-text text-ellip">下载设置</p>
    </div>
  </a>
  `);
      }

      if (currentPage == 'old') {
        createApp('.ww8XMe', `
    <div id="app" class="u-tooltip item wp-aside-nav__main-item wp-aside-nav__main-item">
    <a class="g-button " data-button-id="b7" data-button-index="11" href="javascript:;" @click="OpenDialog" title="下载设置" node-type="transfer"><span class="g-button-right"><em class="icon icon-setting" title="下载设置"></em><span class="text" style="width: auto;">下载设置</span></span></a>
  `);
      }

      if (currentPage == 'share') {
        createApp('.bar .x-button-box', `
    <div id="app" class="u-tooltip item wp-aside-nav__main-item wp-aside-nav__main-item" style="display: inline-block;">
    <a class="g-button " data-button-id="b7" data-button-index="11" href="javascript:;" @click="OpenDialog" title="下载设置" node-type="transfer"><span class="g-button-right"><em class="icon icon-setting" title="下载设置"></em><span class="text" style="width: auto;">下载设置</span></span></a>
  `);
      }
    });
  });

  async function GlobalDownload(params) {
    const ElementPlus = unsafeWindow.ElementPlus;
    const accelerateURL = GM_getValue("accelerateURL", "");
    const disableAccelerate = GM_getValue("disableAccelerate", false);
    const downType = GM_getValue("downType", "browser");
    const maxConnection = GM_getValue("Aria2MaxConnection", "16");
    let baiduyunPlugin_BDUSS = JSON.parse(unsafeWindow.localStorage.baiduyunPlugin_BDUSS ? unsafeWindow.localStorage.baiduyunPlugin_BDUSS : '{"baiduyunPlugin_BDUSS":""}');
    let BDUSS = baiduyunPlugin_BDUSS.BDUSS; // 单文件下载

    if (params.type == 0) {
      // 无加速链接
      if (accelerateURL == "" || disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件',
              duration: 1000
            });
          }

          for (let dlink of params.dlinkList) {
            let finalUrl = await tools.getFinalUrl(dlink);
            tools.browserDownload(finalUrl);
          }
        }

        if (downType == "aria2") {
          // Aria2下载
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件',
              duration: 1000
            });
          }

          for (let dlink of params.dlinkList) {
            let finalUrl = await tools.getFinalUrl(dlink);
            tools.aria2Download({
              cookie: `BDUSS=${BDUSS}`,
              url: finalUrl,
              fileName: finalUrl.match(/&fn=(.*)&rtype=/)[1],
              dir: '/',
              split: maxConnection
            });
          }
        }
      } // 有加速链接


      if (accelerateURL != "" && !disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件',
              duration: 1000
            });
          }

          for (let dlink of params.dlinkList) {

            tools.getAccelerate(dlink).then(function (result) {
              if (result.code != 0) {

                // 请求加速链接失败的话，就重试一次
                if (result.code == -10) {
                  console.log("重试")
                  tools.getAccelerate(dlink).then(function (result) {
                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: result.message,
                        duration: 1500,
                        type: 'success'
                      });
                      tools.browserDownload(result.url);
                    }
                  });
                } else {
                  ElementPlus.ElNotification({
                    title: result.title,
                    message: result.errMsg,
                    duration: 5000,
                    type: 'error'
                  });
                }

              } else {
                ElementPlus.ElNotification({
                  title: result.name,
                  message: result.message,
                  duration: 1500,
                  type: 'success'
                });
                tools.browserDownload(result.url);
              }
            });

          } // 遍历urls开始下载文件

        }

        if (downType == "aria2") {
          // Aria2下载
          let urls = [];

          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件',
              duration: 1000
            });
          }

          for (let dlink of params.dlinkList) {
            tools.getAccelerate(dlink).then(function (result) {

              if (result.code != 0) {
                // 请求加速链接失败的话，就重试一次
                if (result.code == -10) {
                  console.log("重试")
                  tools.getAccelerate(dlink).then(function (result) {
                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: result.message,
                        duration: 1500,
                        type: 'success'
                      });
                      let meta = {};
                      meta.url = result.url;
                      meta.name = result.name;

                      tools.aria2Download({
                        url: meta.url,
                        fileName: meta.name,
                        dir: '/',
                        split: result.split
                      });
                    }
                  });
                } else {
                  ElementPlus.ElNotification({
                    title: result.title,
                    message: result.errMsg,
                    duration: 5000,
                    type: 'error'
                  });
                }
              } else {
                ElementPlus.ElNotification({
                  title: result.name,
                  message: result.message,
                  duration: 1500,
                  type: 'success'
                });
                let meta = {};
                meta.url = result.url;
                meta.name = result.name;

                tools.aria2Download({
                  url: meta.url,
                  fileName: meta.name,
                  dir: '/',
                  split: result.split
                });
              }
            });
          }
        }
      }
    } //  盘内文件夹下载


    if (params.type == 1) {
      // 无加速链接
      if (accelerateURL == "" || disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=[" + file.fs_id + "]&type=dlink&vip=2&sign=" + params.sign + "&timestamp=" + params.timestamp,
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  let dlinkList = [];

                  for (let list of data.dlink) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  GlobalDownload({
                    type: 0,
                    dlinkList: dlinkList,
                    notification: false
                  });
                }
              });
            }

            if (file.isdir == 1) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=1&dir=" + encodeURIComponent(file.path) + "&num=100000&page=1",
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 1,
                    sign: params.sign,
                    timestamp: params.timestamp,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }

        if (downType == "aria2") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=[" + file.fs_id + "]&type=dlink&vip=2&sign=" + params.sign + "&timestamp=" + params.timestamp,
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  let dlinkList = [];

                  for (let list of data.dlink) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  for (let dlink of dlinkList) {
                    let finalUrl = await tools.getFinalUrl(dlink);
                    tools.aria2Download({
                      cookie: `BDUSS=${BDUSS}`,
                      url: finalUrl,
                      fileName: finalUrl.match(/&fn=(.*)&rtype=/)[1],
                      dir: params.dir,
                      split: maxConnection
                    });
                  }
                }
              });
            }

            if (file.isdir == 1) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=1&dir=" + encodeURIComponent(file.path) + "&num=100000&page=1",
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 1,
                    sign: params.sign,
                    timestamp: params.timestamp,
                    fileList: list.list,
                    notification: false,
                    dir: params.dir + file.server_filename + '/'
                  });
                }
              });
            }
          }
        }
      } // 有加速链接


      if (accelerateURL != "" && !disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=[" + file.fs_id + "]&type=dlink&vip=2&sign=" + params.sign + "&timestamp=" + params.timestamp,
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  let urls = [];

                  for (let dlinks of data.dlink) {
                    let dlink = dlinks.dlink.replace("http://", "https://") + "&origin=dlna";
                    let result = await tools.getAccelerate(dlink);

                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: result.message,
                        duration: 1500,
                        type: 'success'
                      });
                      urls.push(result.url);
                    }
                  } // 遍历urls开始下载文件


                  for (let url of urls) {
                    tools.browserDownload(url);
                  }
                }
              });
            }

            if (file.isdir == 1) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=1&dir=" + encodeURIComponent(file.path) + "&num=100000&page=1",
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 1,
                    sign: params.sign,
                    timestamp: params.timestamp,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }

        if (downType == "aria2") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=[" + file.fs_id + "]&type=dlink&vip=2&sign=" + params.sign + "&timestamp=" + params.timestamp,
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  let urls = [];
                  let dlinkList = [];

                  for (let list of data.dlink) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  for (let dlink of dlinkList) {
                    var result = await tools.getAccelerate(dlink);

                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: result.message,
                        duration: 1500,
                        type: 'success'
                      });
                      let meta = {};
                      meta.url = result.url;
                      meta.name = result.name;
                      urls.push(meta);
                    }

                    for (let meta of urls) {
                      tools.aria2Download({
                        url: meta.url,
                        fileName: meta.name,
                        dir: params.dir,
                        split: result.split
                      });
                    }
                  }
                }
              });
            }

            if (file.isdir == 1) {
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=1&dir=" + encodeURIComponent(file.path) + "&num=100000&page=1",
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 1,
                    sign: params.sign,
                    timestamp: params.timestamp,
                    fileList: list.list,
                    notification: false,
                    dir: params.dir + file.server_filename + '/'
                  });
                }
              });
            }
          }
        }
      }
    } // 分享文件夹下载


    if (params.type == 2) {
      // 无加速链接
      if (accelerateURL == "" || disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "POST",
                url: params.url,
                data: params.data.replace('[fid_list]', '[' + file.fs_id + ']'),
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return params.doError(data.errno);
                  }

                  let dlinkList = [];

                  for (let list of data.list) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  GlobalDownload({
                    type: 0,
                    dlinkList: dlinkList,
                    notification: false
                  });
                }
              });
            }

            if (file.isdir == 1) {
              let share_uk = unsafeWindow.locals.get("share_uk");
              let primaryid = unsafeWindow.locals.get("shareid");
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/share/list?uk=" + share_uk + "&shareid=" + primaryid + "&order=name&desc=1&showempty=0&web=1&page=1&num=10000&dir=" + encodeURIComponent(file.path),
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 2,
                    dir: params.dir + file.server_filename + '/',
                    url: params.url,
                    data: params.data,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }

        if (downType == "aria2") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "POST",
                url: params.url,
                data: params.data.replace('[fid_list]', '[' + file.fs_id + ']'),
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return params.doError(data.errno);
                  }

                  let dlinkList = [];

                  for (let list of data.list) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  for (let dlink of dlinkList) {
                    let finalUrl = await tools.getFinalUrl(dlink);
                    tools.aria2Download({
                      cookie: `BDUSS=${BDUSS}`,
                      url: finalUrl,
                      fileName: finalUrl.match(/&fn=(.*)&rtype=/)[1],
                      dir: params.dir,
                      split: maxConnection
                    });
                  }
                }
              });
            }

            if (file.isdir == 1) {
              let share_uk = unsafeWindow.locals.get("share_uk");
              let primaryid = unsafeWindow.locals.get("shareid");
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/share/list?uk=" + share_uk + "&shareid=" + primaryid + "&order=name&desc=1&showempty=0&web=1&page=1&num=10000&dir=" + encodeURIComponent(file.path),
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 2,
                    dir: params.dir + file.server_filename + '/',
                    url: params.url,
                    data: params.data,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }
      } // 有加速链接


      if (accelerateURL != "" && !disableAccelerate) {
        if (downType == "browser") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 浏览器 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "POST",
                url: params.url,
                data: params.data.replace('[fid_list]', '[' + file.fs_id + ']'),
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return params.doError(data.errno);
                  }

                  for (let dlinks of data.list) {
                    let dlink = dlinks.dlink.replace("http://", "https://") + "&origin=dlna";
                    let result = await tools.getAccelerate(dlink);

                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: "加速链接已获取，正在加入下载列表...",
                        duration: 1500,
                        type: 'success'
                      });
                      tools.browserDownload(result.url);
                    }
                  }
                }
              });
            }

            if (file.isdir == 1) {
              let share_uk = unsafeWindow.locals.get("share_uk");
              let primaryid = unsafeWindow.locals.get("shareid");

              console.log(file.path)

              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/share/list?uk=" + share_uk + "&shareid=" + primaryid + "&order=name&desc=1&showempty=0&web=1&page=1&num=10000&dir=" + encodeURIComponent(file.path),
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 2,
                    dir: params.dir + file.server_filename + '/',
                    url: params.url,
                    data: params.data,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }

        if (downType == "aria2") {
          if (params.notification == undefined) {
            ElementPlus.ElNotification({
              title: title,
              message: '正在使用 Aria2 下载文件夹',
              duration: 1000
            });
          }

          for (let file of params.fileList) {
            if (file.isdir == 0) {
              GM_xmlhttpRequest({
                method: "POST",
                url: params.url,
                data: params.data.replace('[fid_list]', '[' + file.fs_id + ']'),
                onload: async function (res) {
                  let data = JSON.parse(res.responseText);

                  if (data.errno !== 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "下载文件时出错，错误代码：" + data.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return params.doError(data.errno);
                  }

                  let urls = [];
                  let dlinkList = [];

                  for (let list of data.list) {
                    let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                    dlinkList.push(dlink);
                  }

                  for (let dlink of dlinkList) {
                    var result = await tools.getAccelerate(dlink);

                    if (result.code != 0) {
                      ElementPlus.ElNotification({
                        title: result.title,
                        message: result.errMsg,
                        duration: 5000,
                        type: 'error'
                      });
                    } else {
                      ElementPlus.ElNotification({
                        title: result.name,
                        message: result.message,
                        duration: 1500,
                        type: 'success'
                      });
                      let meta = {};
                      meta.url = result.url;
                      meta.name = result.name;
                      urls.push(meta);
                    }

                    for (let meta of urls) {
                      tools.aria2Download({
                        url: meta.url,
                        fileName: meta.name,
                        dir: params.dir,
                        split: result.split
                      });
                    }
                  }
                }
              });
            }

            if (file.isdir == 1) {
              let share_uk = unsafeWindow.locals.get("share_uk");
              let primaryid = unsafeWindow.locals.get("shareid");
              GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/share/list?uk=" + share_uk + "&shareid=" + primaryid + "&order=name&desc=1&showempty=0&web=1&page=1&num=10000&dir=" + encodeURIComponent(file.path),
                onload: function (response) {
                  let list = JSON.parse(response.responseText);

                  if (list.errno != 0) {
                    ElementPlus.ElNotification({
                      title: file.server_filename,
                      message: "尝试获取文件夹列表时失败，错误代码：" + list.errno,
                      duration: 3000,
                      type: 'error'
                    });
                    return -1;
                  }

                  GlobalDownload({
                    type: 2,
                    dir: params.dir + file.server_filename + '/',
                    url: params.url,
                    data: params.data,
                    fileList: list.list,
                    notification: false
                  });
                }
              });
            }
          }
        }
      }
    }
  }

  function NewPageDownload() {
    const nd_download = unsafeWindow.nd_download;
    nd_download.canShowFail = false;
    nd_download.dlinkIns.getSign().then(function () {
      let dlinkIns = nd_download.dlinkIns;
      let currentFileMetas = nd_download.currentFileMetas;

      if (!currentFileMetas.length) {
        return console.error("[Plugin][download] 需要选中至少一个文件!");
      }

      let sign = dlinkIns.sign,
        timestamp = dlinkIns.timestamp,
        userInfo = dlinkIns.ctx.userInfo,
        vipType = userInfo.vipType,
        vip = void 0 === vipType ? 0 : vipType;
      let fileList = {};
      let fidList = currentFileMetas.map(function (File) {
        fileList[File.fs_id] = File;
        return File.fs_id;
      });
      currentFileMetas.map(function (File) {
        return File.path;
      });
      let includeFolder = currentFileMetas.some(function (File) {
        return File.isdir;
      });

      if (includeFolder) {
        let fileList = [];

        for (let FileMetas of currentFileMetas) {
          let meta = {};
          meta.fs_id = FileMetas.fs_id;
          meta.isdir = FileMetas.isdir;
          meta.path = FileMetas.path;
          meta.server_filename = FileMetas.server_filename;
          fileList.push(meta);
        }

        GlobalDownload({
          type: 1,
          dir: '/',
          sign: encodeURIComponent(sign),
          timestamp: timestamp,
          fileList: fileList
        }); //downloadFolder(currentFileMetas, sign, timestamp, vip);

        return console.log("[Plugin][download] 跳转至文件夹下载函数");
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=" + JSON.stringify(fidList) + "&type=dlink&vip=" + vip + "&sign=" + encodeURIComponent(sign) + "&timestamp=" + timestamp,
        onload: async function (res) {
          let data = JSON.parse(res.responseText);

          if (data.errno !== 0) {
            ElementUI.$Message({
              'dangerouslyUseHTMLString': true,
              'type': 'error',
              'message': dlinkIns.setResData(data).show_msg
            });
            return -1;
          }

          let dlinkList = [];

          for (let list of data.dlink) {
            let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
            dlinkList.push(dlink);
          }

          GlobalDownload({
            type: 0,
            dlinkList: dlinkList
          });
        }
      });
    });
  } // 旧版页面


  if (unsafeWindow.require != undefined) {
    let ctx = unsafeWindow.require("system-core:context/context.js").instanceForSystem;

    let tip = ctx.ui.tip;
    ctx.ui.tip = function (e) {
      return -1 != e.msg.indexOf("下载失败") && (e.msg = ""), -1 != e.msg.indexOf("正在启动网盘客户端") && (e.msg = ""), tip.call(this, e);
    }, unsafeWindow.require.async("function-widget-1:download/service/guanjiaServerProxy.js", guanjiaServerProxy => {
      guanjiaServerProxy.sendServer = function () {
        console.log("[" + scriptName + "] 已禁止调用客户端");
      };
    });

    unsafeWindow.require.async('function-widget-1:download/config.js', config => {
      [].push.apply(config.directDownloadkeysConfig, config.guanjiaDownloadkeysConig);
      config.guanjiaDownloadkeysConig = [];
    });

    unsafeWindow.require.async('function-widget-1:download/service/dlinkService.js', dlinkService => {
      console.log(dlinkService);

      dlinkService.getDlinkShare = function (data, callback) {
        this.arguments = arguments;
        var p = this;
        let fidList = [];
        let currentFileMetas = data.list;
        let shareUrl = dlinkService.URL_DLINK_SHARE + "?sign=" + data.sign + "&timestamp=" + data.timestamp + "&channel=chunlei&web=1&app_id=250528&clienttype=12&jsToken=" + unsafeWindow.jsToken;
        let postData = "encrypt=0&product=share&uk=" + data.share_uk + "&primaryid=" + data.share_id + "&extra=" + encodeURIComponent(JSON.stringify({
          sekey: decodeURIComponent(tools.getCookie("BDCLND"))
        })) + "&fid_list=[fid_list]&vip=2" + "&vcode_input=" + (data.vcode_input == undefined ? "" : data.vcode_input) + "&vcode_str=" + (data.vcode_str == undefined ? "" : data.vcode_str);
        let includeFolder = currentFileMetas.some(function (File) {
          return File.isdir;
        });

        if (includeFolder) {
          let fileList = [];

          for (let FileMetas of currentFileMetas) {
            let meta = {};
            meta.fs_id = FileMetas.fs_id;
            meta.isdir = FileMetas.isdir;
            meta.path = FileMetas.path;
            meta.server_filename = FileMetas.server_filename;
            fileList.push(meta);
          }

          GlobalDownload({
            type: 2,
            dir: '/',
            url: shareUrl,
            data: postData,
            fileList: fileList,
            doError: p._doError
          });
          return console.log("[Plugin][download] 跳转至文件夹下载函数");
        }

        for (let meta of currentFileMetas) {
          let fs_id = meta.fs_id;
          fidList.push(fs_id);
        }

        GM_xmlhttpRequest({
          method: "POST",
          url: shareUrl,
          data: postData.replace('[fid_list]', JSON.stringify(fidList)),
          onload: async function (res) {
            res = JSON.parse(res.responseText);

            if (res.errno != 0) {
              return p._doError(res.errno);
            }

            let dlinkList = [];

            for (let list of res.list) {
              let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
              dlinkList.push(dlink);
            }

            GlobalDownload({
              type: 0,
              dlinkList: dlinkList
            });
          },
          error: function () {
            p._doError();
          }
        });
      };

      dlinkService.getDlinkPan = function (fsidList, downType) {
        this.arguments = arguments;
        var p = this;
        unsafeWindow.locals.get("sign1", "sign2", "sign3", "timestamp", function (l, g, f, h) {

          if (null === p.sign) {
            var m = "";

            try {
              m = new Function("return " + g)();
            } catch (_) {
              throw new Error(_.message);
            }

            if ("function" != typeof m) return void p._doError();
            p.sign = encodeURIComponent(p.base64Encode(m(f, l)));
          }

          let currentFileMetas = ctx.list.getSelected();
          let includeFolder = currentFileMetas.some(function (File) {
            return File.isdir;
          });

          if (includeFolder) {
            let fileList = [];

            for (let FileMetas of currentFileMetas) {
              let meta = {};
              meta.fs_id = FileMetas.fs_id;
              meta.isdir = FileMetas.isdir;
              meta.path = FileMetas.path;
              meta.server_filename = FileMetas.server_filename;
              fileList.push(meta);
            }

            GlobalDownload({
              type: 1,
              dir: '/',
              sign: p.sign,
              timestamp: h,
              fileList: fileList
            }); //downloadFolder(currentFileMetas, sign, timestamp, vip);

            return console.log("[Plugin][download] 跳转至文件夹下载函数");
          }

          GM_xmlhttpRequest({
            method: "POST",
            url: dlinkService.URL_DLINK_PAN,
            data: "app_id=250528&clienttype=8&type=dlink&fidlist=" + fsidList + "&sign=" + p.sign + "&timestamp=" + h,
            onload: async function (res) {
              res = JSON.parse(res.responseText);

              if (res.errno != 0) {
                p._doError(res.errno);

                return;
              }

              let dlinkList = [];

              for (let list of res.dlink) {
                let dlink = list.dlink.replace("http://", "https://") + "&origin=dlna";
                dlinkList.push(dlink);
              }

              GlobalDownload({
                type: 0,
                dlinkList: dlinkList
              });
            },
            onerror: function (err) {
              p._doError();
            }
          });
        });
      };
    });
  } // 盘内Hook


  let HookBaiduNetdisk = new MutationObserver(mutationRecords => {
    for (let mr of mutationRecords) {
      for (let node of mr.addedNodes) {
        if (node.__vue__ !== undefined && node.__vue__ !== null) {
          var Vue = node.__vue__;

          if (Vue.$el.className == "nd-download") {
            unsafeWindow.nd_download = Vue; // 重写下载方法

            Vue.download = NewPageDownload;
          } // 过滤广告


          if (Vue.$el.className == "web-header-ad-item wp-s-header__right-item") {
            Vue.conf.text = "";
          }

          if (Vue.$el.className == "nd-unzip") {
            unsafeWindow.unzip = Vue;
            console.log(Vue);
          }
        }
      }
    }
  });
  HookBaiduNetdisk.observe(document, {
    childList: true,
    subtree: true
  });

})();
