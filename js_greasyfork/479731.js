// ==UserScript==
// @name         标注平台辅助标注
// @namespace    https://fengwenhua.top
// @version      2.0.14
// @description  借助曾经的标注内容进行标注
// @author       Panghoo
// @match        https://qgpt-mark.skyeye.qianxin-inc.cn/data-management/mark-data/*
// @connect      127.0.0.1
// @connect      *
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js
// @require      https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/index.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @nocompat     Chrome
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479731/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479731/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

class MarkTool {
  searchInput;
  whoMarkInput;
  suggestions;
  detailsContainer;
  detailsSuggestion;
  detailsAnalysis;
  suggestionsContainer;
  detailsTitle;
  attackIp;
  victimIp;
  alertName;
  dport;
  ioc;
  url;
  login_token;
  vue_flag;
  dns_count;
  tcp_count;
  udp_count;
  ioc_res; // ioc查询结果：安全、未知、可疑、恶意
  is_asset;
  asset_type;
  ioc_confidence;
  ioc_desc;
  host;

  constructor() {
    console.log("这是构造函数");
  }

  run() {
    var that = this;
    // 设置定时器，定时添加各种按钮
    window.setInterval(function () {
      if (window.location.href.indexOf("/mark-data/list/check/") != -1) {
        that.addSearchInput();
        // 模版提交
        that.addSubmitBtn();
        // 告警介绍
        that.addAttackIntroduceBtn();
        that.addAttackSuccessConclusionBtn();
        that.addAttackFailedConclusionBtn();
        that.addVulnIntroduceBtn();
        that.addVulnConclusionBtn();
        that.addVerifyIntroduceBtn();
        that.addVerifyConclusionBtn();
        that.addBusinessIntroduceBtn();
        that.addBusinessConclusionBtn();
        // that.addIOCIntroduceBtn()
        that.addIOCAnalysisBtn();
        that.addLOLConclusionBtn();

        that.addRemoveEmptyLineBtn();
        that.addWhoMarkBtn();
        // that.addVertifySuggestionBtn()
        // that.addWhiteSuggestionBtn()
        // that.addVertifyAssetsSuggestionBtn()
        that.addSuggestionSelect();
        that.addSelectAllRightBtn();
      }
    }, 1000);
    // window.setInterval(function () {
    //   if (window.location.href.indexOf("/mark-data/list/calibrate/") != -1) {
    //     // 校准的保存并返回
    //     that.addAdjustInput();
    //   }
    // }, 1000);
  }

  trim(s) {
    //去左右空格
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }

  isInnerIPFn(ipAddress) {
    var that = this;
    // 判断是否是内网IP
    var isInnerIp = false; //默认给定IP不是内网IP
    var ipNum = that.getIpNum(ipAddress);
    /**
     * 私有IP：A类  10.0.0.0    -10.255.255.255
     *       B类  172.16.0.0  -172.31.255.255
     *       C类  192.168.0.0 -192.168.255.255
     *       D类   127.0.0.0   -127.255.255.255(环回地址)
     **/
    var aBegin = that.getIpNum("10.0.0.0");
    var aEnd = that.getIpNum("10.255.255.255");
    var bBegin = that.getIpNum("172.16.0.0");
    var bEnd = that.getIpNum("172.31.255.255");
    var cBegin = that.getIpNum("192.168.0.0");
    var cEnd = that.getIpNum("192.168.255.255");
    var dBegin = that.getIpNum("127.0.0.0");
    var dEnd = that.getIpNum("127.255.255.255");
    var eBegin = that.getIpNum("169.254.0.0");
    var eEnd = that.getIpNum("169.254.255.255");
    isInnerIp =
      that.isInner(ipNum, aBegin, aEnd) ||
      that.isInner(ipNum, bBegin, bEnd) ||
      that.isInner(ipNum, cBegin, cEnd) ||
      that.isInner(ipNum, dBegin, dEnd) ||
      that.isInner(ipNum, eBegin, eEnd);
    console.log("是否是内网:" + isInnerIp);
    return isInnerIp;
  }

  getIpNum(ipAddress) {
    // 获取IP数
    var ip = ipAddress.split(".");
    var a = parseInt(ip[0]);
    var b = parseInt(ip[1]);
    var c = parseInt(ip[2]);
    var d = parseInt(ip[3]);
    var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
    return ipNum;
  }

  isInner(userIp, begin, end) {
    return userIp >= begin && userIp <= end;
  }

  // addSubmitBtn () {
  //   //提交模版按钮
  //   if (!document.querySelector('.my-submit-btn')) {
  //     var header = document.querySelector(
  //       '#pane-first-instance > div > div.header'
  //     )
  //     if (header) {
  //       var that = this
  //       //var div = document.createElement('div')
  //       let submitBtn = document.createElement('button')
  //       submitBtn.type = 'button'
  //       submitBtn.onclick = function () {
  //         //this.preventDefault();
  //         console.log('点击了提交模版')
  //         // that.doIntroduceBtn('attack')
  //         that.createForm()
  //       }
  //       submitBtn.className =
  //         'q-button q-button--primary q-button--mini my-submit-btn'
  //       let span = document.createElement('span')
  //       span.textContent = '模版提交'
  //       submitBtn.appendChild(span)
  //       header.append(submitBtn)
  //     }
  //   }
  // }

  addSubmitBtn() {
    const template = `
        <div id="submit-template">
        <el-button type="primary" @click="visible = true" class="my-submit-btn">模版提交</el-button>
        <el-dialog
          :visible.sync="visible"
          :modal="false"
          title="提交建议"
          :before-close="handleClose"
        >
        <el-button type="primary" @click="getJudgementAndSuggention">获取分析和建议</el-button>
          <span
            >如果告警分析和建议为空，就重新点两下《获取分析和建议》。里面的内容需要动态替换，请用三个波浪号扩起来，比如~~~attackIp~~~，现在支持attackIp、victimIp、alertName、dport、ioc、url。告警名称可以把关键点写上</span
          >
          <el-form label-position="left" label-width="80px"  :model="templateData">
            <el-form-item label="告警分析">
              <el-input
                type="textarea"
                v-model="templateData.alert_analysis"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警建议">
              <el-input
                type="textarea"
                v-model="templateData.alert_suggestion"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>

            <el-row>
    <el-col :span="10">
      <el-form-item label="标记ID">
        <el-input v-model="templateData.mark_id"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="14">
      <el-form-item label="规则ID">
        <el-input v-model="templateData.rule_id"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
            <el-form-item label="告警ID">
              <el-input v-model="templateData.alert_id"></el-input>
            </el-form-item>
            <el-form-item label="告警名称">
              <el-input v-model="templateData.alert_name"></el-input>
            </el-form-item>
            <el-form-item label="Payload">
              <el-input
                type="textarea"
                v-model="templateData.pay_load"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
             <el-form-item label="请求头">
              <el-input
                type="textarea"
                v-model="templateData.req_headers"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
             <el-form-item label="请求体">
              <el-input
                type="textarea"
                v-model="templateData.req_body"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
             <el-form-item label="响应头">
              <el-input
                type="textarea"
                v-model="templateData.res_headers"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
             <el-form-item label="响应体">
              <el-input
                type="textarea"
                v-model="templateData.res_body"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
            </el-form-item>
          </el-form>
          <span>处置建议必须是形如“1. **测试建议**：”，两星号后面是中文的冒号</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit" :loading="sumbitLoading">提交</el-button>
            <el-button @click="visible = false">取消</el-button>
          </span>
        </el-dialog>
      </div>

    `;
    //提交模版按钮
    if (!document.querySelector(".my-submit-btn")) {
      var header = document.querySelector(
        "#pane-first-instance > div > div.header"
      );
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        const div = document.createElement("div");
        div.innerHTML = template;

        header.append(div);
      }
    }
  }

  // 创建编辑框
  createForm() {
    var that = this;
    that.setBasicInfo();

    var formContainer = document.createElement("div");
    formContainer.style.position = "fixed";
    formContainer.style.top = "50%";
    formContainer.style.left = "50%";
    formContainer.style.transform = "translate(-50%, -50%)";
    formContainer.style.backgroundColor = "#fff";
    formContainer.style.padding = "20px";
    formContainer.style.border = "1px solid #ccc";
    formContainer.style.zIndex = "9999";
    formContainer.style.width = "1200px"; // 调整编辑框宽度

    let hint = document.createElement("p");
    hint.textContent =
      "如果告警分析和建议为空，就重新点一下《模版提交》。里面的内容需要动态替换，请用三个波浪号扩起来，比如~~~attackIp~~~，现在支持attackIp、victimIp、alertName、dport、ioc、url。告警名称可以把关键点写上";
    formContainer.append(hint);
    var inputPairs = [
      { label: "告警名称:", rows: 2 },
      { label: "告警分析:", rows: 8 },
      { label: "告警建议:", rows: 8 },
    ];

    inputPairs.forEach(function (inputPair) {
      var rowContainer = document.createElement("div");
      rowContainer.style.display = "flex";
      rowContainer.style.marginBottom = "10px";

      var labelElement = document.createElement("label");
      labelElement.textContent = inputPair.label;
      labelElement.style.flex = "0 0 150px"; // 调整左侧标签的宽度
      labelElement.style.textAlign = "right";

      var inputElement = document.createElement("textarea");
      inputElement.setAttribute("rows", inputPair.rows);
      inputElement.style.flex = "1";
      inputElement.style.marginLeft = "10px"; // 调整输入框的间距
      if (inputPair.label === "告警名称:") {
        inputElement.className = "my-alert-name";
        inputElement.value = that.alertName;
      } else if (inputPair.label === "告警分析:") {
        inputElement.className = "my-alert-analysis";
        inputElement.value = that.get_judgement();
      } else {
        inputElement.className = "my-alert-suggestion";
        inputElement.value = that.get_suggestion();
      }

      rowContainer.appendChild(labelElement);
      rowContainer.appendChild(inputElement);

      formContainer.appendChild(rowContainer);
    });
    let suggestion_hint = document.createElement("p");
    suggestion_hint.textContent =
      "处置建议必须是形如“1. **测试建议**：”，两星号后面是中文的冒号";
    formContainer.append(suggestion_hint);

    var cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.addEventListener("click", function () {
      formContainer.remove();
    });

    var submitButton = document.createElement("button");
    submitButton.textContent = "确定";
    submitButton.addEventListener("click", function () {
      let alertName = document.querySelector(".my-alert-name").value;
      let alertAnalysis = document.querySelector(".my-alert-analysis").value;
      let alertSuggestion = document.querySelector(
        ".my-alert-suggestion"
      ).value;

      let user = document
        .querySelector(
          "body > div.qp-hostapp > div.qp-layout.layout-hybrid > header > div.qp-layout__toolbar > div > div > div > div > div > div > span"
        )
        .textContent.trim();
      let data = {
        user: user,
        alert_name: alertName,
        alert_analysis: alertAnalysis,
        alert_suggestion: alertSuggestion,
        from_js: 1,
      };
      that.checkToken();

      // 调用 Flask 接口，提交数据
      fetch(BACKURL + "/alert/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": that.login_token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // 处理成功响应，例如提示用户或者其他操作
          console.log("数据已提交:", data);
          that.toastSubmitSuccess();
          // 成功才remove页面
          formContainer.remove();
        })
        .catch((error) => {
          // 处理错误
          console.error("提交出错:", error);
          that.toastSubmitFailed();
        });
    });

    formContainer.appendChild(cancelButton);
    formContainer.appendChild(submitButton);

    document.body.appendChild(formContainer);
  }

  doSelectAllRight() {
    // 一键全部正确
    let all = document.querySelectorAll("span.q-radio__label");
    all.forEach(function (element) {
      if (element.innerText === "正确") {
        element.click();
      }
    });

    // // 点击 告警分析 全部正确的按钮
    // let a = document.querySelectorAll(
    //   '#pane-first-instance > div > div.ai-judgment > div.ai-judgment-analyze > form > div > div> div > label > span.q-radio__label'
    // )
    // a.forEach(function (element) {
    //   if (element.innerText === '正确') {
    //     element.click()
    //   }
    // })
    // // 攻击结果和是否业务触发
    // let b = document.querySelectorAll(
    //   '#pane-first-instance > div > div.result > form > div > div > div > div > label > span.q-radio__label'
    // )

    // b.forEach(function (element) {
    //   if (element.innerText === '正确') {
    //     element.click()
    //   }
    // })
  }

  addSelectAllRightBtn() {
    // 添加勾选全部按钮
    var that = this;
    if (!document.querySelector(".my-select-all-right")) {
      let header = document.querySelector(
        ".ai-judgment-analyze .judgment-title"
      );
      if (header) {
        //var div = document.createElement('div')
        let selectAllRightBtn = document.createElement("button");
        selectAllRightBtn.type = "button";
        selectAllRightBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了勾选全部按钮");
          that.doSelectAllRight(that);
        };
        selectAllRightBtn.className =
          "q-button q-button--primary q-button--mini my-select-all-right";
        let span = document.createElement("span");
        span.textContent = "一键全部正确";
        selectAllRightBtn.appendChild(span);
        header.append(selectAllRightBtn);
      }
    }
  }

  // 增加去除空行按钮
  addRemoveEmptyLineBtn() {
    var that = this;
    if (!document.querySelector(".my-remove-empty-line")) {
      let header = document.querySelector(
        "#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-left"
      );
      if (header) {
        //var div = document.createElement('div')
        let removeEmptyLineBtn = document.createElement("button");
        removeEmptyLineBtn.type = "button";
        removeEmptyLineBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了去除空行");
          that.del_suggestion_empty_line();
        };
        removeEmptyLineBtn.className =
          "q-button q-button--primary q-button--mini my-remove-empty-line";
        let span = document.createElement("span");
        span.textContent = "删除空行&序号重排";
        removeEmptyLineBtn.appendChild(span);
        header.append(removeEmptyLineBtn);
      }
    }
  }

  addWhoMarkBtn() {
    if (!document.querySelector(".my-who-mark-btn")) {
      let header = document.querySelector("#pane-first-instance > div > div.header > div.reviewer");
      if (header) {
        let whoMarkBtn = document.createElement("button");
        whoMarkBtn.type = "button";
        whoMarkBtn.className = "q-button q-button--primary q-button--mini my-who-mark-btn";
        let span = document.createElement("span");
        span.textContent = "谁标的";
        whoMarkBtn.appendChild(span);

        // 创建打回原因输入框
        let whommarkinputDiv = document.createElement("div");
        whommarkinputDiv.style.display = 'inline-block'; // 使输入框与按钮并排
        whommarkinputDiv.style.verticalAlign = 'middle'; // 垂直居中
        whommarkinputDiv.style.marginRight = '10px'; // 左边距

        let whoMarkInput = document.createElement("input");
        whoMarkInput.type = "text";
        whoMarkInput.id = "whoMarkInput";
        whoMarkInput.placeholder = "输入打回原因";

        // 添加样式到输入框
        whoMarkInput.style.padding = '8px 12px'; // 内边距
        whoMarkInput.style.fontSize = '14px'; // 字体大小
        whoMarkInput.style.border = '1px solid #ccc '; // 边框
        whoMarkInput.style.borderRadius = '4px'; // 边框圆角

        whommarkinputDiv.appendChild(whoMarkInput);

        // 先添加输入框的容器，再添加按钮
        header.append(whommarkinputDiv);
        header.append(whoMarkBtn);

        whoMarkBtn.onclick = function () {
          console.log("点击了找叼毛按钮");
          whoMarkBtn.disabled = true;
          let loadingText = document.createElement("span");
          loadingText.textContent = "加载中...";
          whoMarkBtn.appendChild(loadingText);
          this.deal_who_mark(whoMarkInput.value)
            .then((data) => {
              whoMarkBtn.removeChild(loadingText);
              whoMarkBtn.disabled = false;
              if (data.code !== 20000) {
                console.log("请求错误");
              }
            })
            .catch((error) => {
              whoMarkBtn.removeChild(loadingText);
              whoMarkBtn.disabled = false;
              console.error("处理错误:", error);
            });
        }.bind(this); // 使用bind确保this指向正确
      }
    }
  }
  deal_who_mark(markReason) {
    return new Promise((resolve, reject) => {
      const mark_id = document.querySelector("#pane-first-instance > div > div.header > div.reviewer > span:nth-child(2)").textContent;

      // 构造URL，并将markReason作为查询参数添加
      let who_mark_url = `${BACKURL}/mark/diaomao/${mark_id}?reason=${encodeURIComponent(markReason)}`;

      this.checkToken(); // 确保这个函数是同步的或者你已经处理了异步逻辑

      fetch(who_mark_url, {
        method: "GET",
        headers: {
          "X-Token": this.login_token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log("返回的数据:", data);
          // 假设有toast函数显示消息
          this.toast("找人", data.message, "info");
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  // // 加白建议按钮
  // addWhiteSuggestionBtn () {
  //   var that = this
  //   if (!document.querySelector('.my-white-suggestion')) {
  //     let header = document.querySelector(
  //       '#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-left'
  //     )
  //     if (header) {
  //       //var div = document.createElement('div')
  //       let vertifySuggestionBtn = document.createElement('button')
  //       vertifySuggestionBtn.type = 'button'
  //       vertifySuggestionBtn.onclick = function () {
  //         //this.preventDefault();
  //         console.log('点击了加白建议')
  //         that.doWhiteSuggestionBtn(that)
  //       }
  //       vertifySuggestionBtn.className =
  //         'q-button q-button--primary q-button--mini my-white-suggestion'
  //       let span = document.createElement('span')
  //       span.textContent = '加白建议'
  //       vertifySuggestionBtn.appendChild(span)
  //       header.append(vertifySuggestionBtn)
  //     }
  //   }
  // }
  // 添加核实资产建议按钮
  // addVertifyAssetsSuggestionBtn () {
  //   var that = this
  //   if (!document.querySelector('.my-verify-assets-suggestion')) {
  //     let header = document.querySelector(
  //       '#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-left'
  //     )
  //     if (header) {
  //       //var div = document.createElement('div')
  //       let vertifySuggestionBtn = document.createElement('button')
  //       vertifySuggestionBtn.type = 'button'
  //       vertifySuggestionBtn.onclick = function () {
  //         //this.preventDefault();
  //         console.log('点击了处理建议')
  //         that.doVertifyAssetsSuggestionBtn(that)
  //       }
  //       vertifySuggestionBtn.className =
  //         'q-button q-button--primary q-button--mini my-verify-assets-suggestion'
  //       let span = document.createElement('span')
  //       span.textContent = '增加核实资产建议'
  //       vertifySuggestionBtn.appendChild(span)
  //       header.append(vertifySuggestionBtn)
  //     }
  //   }
  // }

  // addVertifySuggestionBtn () {
  //   // 添加核实攻击建议按钮
  //   var that = this
  //   if (!document.querySelector('.my-deal-suggestion')) {
  //     let header = document.querySelector(
  //       '#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-left'
  //     )
  //     if (header) {
  //       //var div = document.createElement('div')
  //       let vertifySuggestionBtn = document.createElement('button')
  //       vertifySuggestionBtn.type = 'button'
  //       vertifySuggestionBtn.onclick = function () {
  //         //this.preventDefault();
  //         console.log('点击了处理建议')
  //         that.doVertifySuggestionBtn(that)
  //       }
  //       vertifySuggestionBtn.className =
  //         'q-button q-button--primary q-button--mini my-deal-suggestion'
  //       let span = document.createElement('span')
  //       span.textContent = '增加核实攻击建议'
  //       vertifySuggestionBtn.appendChild(span)
  //       header.append(vertifySuggestionBtn)
  //     }
  //   }
  // }

  addSuggestionSelect() {
    // 级联选择器
    const template = `
    <div class="suggestion-select">
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ expandTrigger: 'hover' }"
      @change="handleChange"
      clearable></el-cascader>
  </div>
    `;
    if (!document.querySelector(".suggestion-select")) {
      var header = document.querySelector(
        "#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-left"
      );
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        const div = document.createElement("div");
        div.innerHTML = template;

        header.append(div);
      }
    }
  }

  // // 核实资产建议处理
  // doVertifyAssetsSuggestionBtn () {
  //   var that = this
  //   // that.attackIp = document.querySelectorAll('#copy_id')[1].textContent
  //   that.setBasicInfo()
  //   console.log('去空行')
  //   that.del_suggestion_empty_line()
  //   console.log('增加核实资产的意见')
  //   let verifyAssetsAdvice = `**核实资产**：本次告警的受害IP ${that.victimIp} 为外网IP，建议首先核实该IP是否为内部资产。`
  //   let new_items = [verifyAssetsAdvice]
  //   let suggestionValue = that.get_suggestion()
  //   if (suggestionValue.length == 0) {
  //     console.log('需要再点一下')
  //   } else {
  //     if (suggestionValue.indexOf('核实资产') != -1) {
  //       console.log('已经有核实资产建议啦')
  //     } else {
  //       let result = that.insertOrderedListItems(suggestionValue, new_items)
  //       console.log(result)
  //       that.setSuggestion(result)
  //       console.log('新建议增加完成')
  //     }
  //   }
  // }
  // // 告警加白处理
  // doWhiteSuggestionBtn () {
  //   var that = this
  //   // that.attackIp = document.querySelectorAll('#copy_id')[1].textContent
  //   that.setBasicInfo()
  //   console.log('去空行')
  //   that.del_suggestion_empty_line()
  //   console.log('增加加白的意见')
  //   let whiteAdvice = `**告警加白**：在天眼告警中如果确认属于正常业务，建议根据规则ID：${that.ioc}、目的IP: ${that.victimIp}、URL：${that.url}、目的端口：${that.dport}，对告警进行加白处理。`
  //   let new_items = [whiteAdvice]
  //   let suggestionValue = that.get_suggestion()
  //   if (suggestionValue.length == 0) {
  //     console.log('需要再点一下')
  //   } else {
  //     if (suggestionValue.indexOf('告警加白') != -1) {
  //       console.log('已经有加白建议啦')
  //     } else {
  //       let result = that.insertOrderedListItems(suggestionValue, new_items)
  //       console.log(result)
  //       that.setSuggestion(result)
  //       console.log('新建议增加完成')
  //     }
  //   }
  // }
  // doVertifySuggestionBtn () {
  //   // 现在的功能就是去空行，增加 核实行为的 建议
  //   // 后面加入替换、在前面加入
  //   var that = this
  //   // that.attackIp = document.querySelectorAll('#copy_id')[1].textContent
  //   that.setBasicInfo()
  //   console.log('攻击者IP：' + that.attackIp)
  //   console.log('去空行')
  //   that.del_suggestion_empty_line()
  //   console.log('增加核实行为的意见')
  //   let verifyAdvice = ''
  //   if (that.isInnerIPFn(that.attackIp)) {
  //     // 内网ip 上机排查
  //     verifyAdvice =
  //       '**核实行为**：核实是否是授权渗透测试工作，否则建议上机排查该攻击IP：' +
  //       that.attackIp +
  //       '。'
  //   } else {
  //     // 外网ip 防火墙封禁
  //     verifyAdvice =
  //       '**核实行为**：核实是否是授权渗透测试工作，否则建议在防火墙封禁该攻击IP：' +
  //       that.attackIp +
  //       '。'
  //   }
  //   let new_items = [verifyAdvice]
  //   let suggestionValue = that.get_suggestion()
  //   if (suggestionValue.length == 0) {
  //     console.log('需要再点一下')
  //   } else {
  //     if (suggestionValue.indexOf('核实是否是授权渗透测试工作') != -1) {
  //       console.log('已经有核实建议啦')
  //     } else {
  //       let result = that.insertOrderedListItems(suggestionValue, new_items)
  //       console.log(result)
  //       that.setSuggestion(result)
  //       console.log('新建议增加完成')
  //     }
  //   }
  // }

  replacePlaceholder(text) {
    var that = this;
    that.setBasicInfo();
    // 定义需要替换的变量名
    const placeholderNames = [
      "attackIp",
      "victimIp",
      "alertName",
      "dport",
      "url",
      "ioc",
    ];

    console.log("replacePlaceholder(): victimIp: " + that.victimIp);

    // 遍历所有变量名
    for (const placeholderName of placeholderNames) {
      // 使用正则表达式匹配变量
      const placeholderRegex = new RegExp(`~~~${placeholderName}~~~`, "g");

      // 使用变量值替换匹配到的字符串
      text = text.replace(placeholderRegex, that[placeholderName]);
    }

    // 返回替换后的字符串
    return text;
  }

  doJudge(action) {
    // 处理研判添加到顶部和替换
    var that = this;
    that.setBasicInfo();
    // console.log(that.detailsTitle.textContent)
    console.log(that.detailsAnalysis.textContent);
    // console.log(that.detailsSuggestion.textContent);
    let source_judgement = that.get_judgement();
    let replace_content = that.replacePlaceholder(
      that.detailsAnalysis.textContent
    );
    console.log("替换后的内容:");
    console.log(replace_content);

    let target_judgement;
    if (action === "add_below") {
      console.log("添加到顶部");
      target_judgement =
        replace_content +
        "\n########################################\n" +
        source_judgement;
    } else {
      console.log("替换");
      target_judgement = replace_content;
    }
    that.set_judgement(target_judgement);
    console.log("添加完成");
  }

  doSuggestion(action) {
    // 处理研判添加到顶部和替换
    var that = this;
    that.setBasicInfo();
    // console.log(that.detailsTitle.textContent)
    // console.log(that.detailsAnalysis.textContent);
    console.log(that.detailsSuggestion.textContent);
    let source_suggestion = that.get_suggestion();
    let replace_content = that.replacePlaceholder(
      that.detailsSuggestion.textContent
    );
    let replace_content_array = that.splitStringIntoArray(replace_content);
    console.log("替换后的内容:");
    console.log(replace_content);

    let target_suggestion;
    // 这里需要把模版的建议，按照**拆分成数组，然后赋值给new_items才行
    if (action === "add_below") {
      console.log("添加到顶部");
      target_suggestion = that.insertOrderedListItems(
        source_suggestion,
        replace_content_array
      );
    } else {
      console.log("替换");
      target_suggestion = that.formatArrayToNumberedString(
        replace_content_array
      );
    }

    that.setSuggestion(target_suggestion);
    console.log("添加完成");
    console.log("点击了建议“添加到顶部按钮“");
  }

  // 增加ioc类分析按钮
  addIOCAnalysisBtn() {
    if (!document.querySelector(".my-ioc-analysis-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let analysisBtn = document.createElement("button");
        analysisBtn.type = "button";
        analysisBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了ioc类分析按钮");
          that.doIOCAnalysisBtn();
        };
        analysisBtn.className =
          "q-button q-button--primary q-button--mini my-ioc-analysis-btn";
        let span = document.createElement("span");
        span.textContent = "ioc类分析";
        analysisBtn.append(span);
        header.append(analysisBtn);
      }
    }
  }

  // 增加ioc类介绍按钮
  addIOCIntroduceBtn() {
    if (!document.querySelector(".my-ioc-introduce-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加ioc类介绍");
          that.doIntroduceBtn("ioc");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-ioc-introduce-btn";
        let span = document.createElement("span");
        span.textContent = "ioc类介绍";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }

  checkIPOrDomain(input) {
    // IP 或 IP:Port 格式的正则表达式
    const ipRegex = /^\d+\.\d+\.\d+\.\d+(:\d+)?$/;

    // 域名 或 *域名 格式的正则表达式
    const domainRegex =
      /^(\*\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(:\d+)?$/;

    if (ipRegex.test(input)) {
      // IP 或 IP:Port
      return 1;
    } else if (domainRegex.test(input)) {
      // 域名 或 *域名
      return 2;
    } else {
      // 其他情况
      return 0;
    }
  }

  // ioc类分析
  doIOCAnalysisBtn() {
    // 增加攻击介绍
    var that = this;
    that.setBasicInfo();

    console.log("增加IOC类分析");

    that.tcp_count = parseInt(that.tcp_count);
    that.udp_count = parseInt(that.udp_count);
    that.dns_count = parseInt(that.dns_count);
    let sum_tcp_udp = that.tcp_count + that.udp_count;

    let analysisValue = that.get_judgement();
    let suggestionValue = that.get_suggestion();
    let new_suggestion_array = [];
    if (analysisValue.length === 0 || suggestionValue.length === 0) {
      console.log("需要再点一次");
    } else {
      let new_analysis = "";
      let new_suggestion = "";

      console.log("要检测的ioc: ", that.ioc);
      let type = that.checkIPOrDomain(that.ioc);
      console.log(type);
      // 判断ioc是不是ip类
      if (type == 1) {
        console.log("IP类");
        // ip类，先按照:分割
        that.ioc = that.ioc.split(":")[0];
        console.log("此时的ioc: ", that.ioc);

        // 如果是的话，判断受害IP是不是公网IP，攻击IP是不是内网IP，如果是，归为扫描
        console.log("开始分析攻击者和受害者来判断是不是扫描");
        console.log(that.attackIp);
        console.log(that.victimIp);
        if (
          that.attackIp &&
          that.victimIp &&
          that.isInnerIPFn(that.attackIp) &&
          !that.isInnerIPFn(that.victimIp)
        ) {
          // 扫描
          console.log("本次ioc告警为公网扫描");
          if (that.ioc_res == "恶意") {
            console.log("封禁任务-受害IP");
            new_analysis = `  公网扫描器 ${that.victimIp} 对 ${that.attackIp} 发起扫描探测，触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}。然而，在本次请求中，受害IP是公网IP，而攻击IP是内网IP，符合扫描探测的特征，${that.attackIp} 上并没有存在恶意软件，在防火墙上对 ${that.victimIp} 进行封禁即可。
  综上所述，这是一次扫描探测行为，不需要处置 ${that.attackIp} 机器，在防火墙上对 ${that.victimIp} 进行封禁即可。`;
            new_suggestion_array = [
              `**封禁任务**：该告警属于公网扫描器的扫描探测，在防火墙封禁该公网IP：${that.victimIp} 即可，建议封禁时间为30天。`,
            ];
          } else {
            console.log("忽略");
            new_analysis = `  公网扫描器 ${that.victimIp} 对 ${that.attackIp} 发起扫描探测，触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}。在本次请求中，受害IP是公网IP，而攻击IP是内网IP，符合扫描探测的特征，${that.attackIp} 上并没有存在恶意软件，由于IOC已经失效，因此无需处置扫描器 ${that.victimIp} 。
  综上所述，这是一次扫描探测行为，由于IOC已经失效，因此无需处置 ${that.victimIp}，更新情报版本即可。`;
            new_suggestion_array = [
              `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
            ];
          }
          console.log("无效告警");
        } else {
          // tcp_count和udp_count之和是否大于0，小于0属于日志缺失类（可以暂时不管，弹框提示）
          console.log("接下来看tcp和udp的和");
          console.log(that.tcp_count);
          console.log(that.udp_count);
          console.log(sum_tcp_udp);
          if (sum_tcp_udp < 0) {
            // 日志缺失
            console.log("本次ioc告警为日志缺失");
          } else {
            // tcp_count和udp_count之和是否小于5，是的话，归为人工误触
            if (sum_tcp_udp < 5) {
              // 人工误触
              console.log("本次ioc告警为 ip类人工误触");
              switch (that.ioc_res) {
                case "恶意":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量可疑数据交互行为，可能为人工访问误触发，需要与该机器负责人确认行为，并且对该机器进行病毒查杀处理，同时在防火墙封禁该攻击IP ${that.attackIp}。
  综上所述，这是一次有效的恶意软件类告警，由于存在少量可疑数据交互的行为，因此建议与该机器负责人确认行为，并且对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现存在可疑数据交互行为，所以需要在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                    `**确认行为**：需要与机器：${this.victimIp} 的负责人确认其与恶意服务器：${that.attackIp} 的通信是否为本人所为。如果不是，则说明该机器上应该存在恶意样本，并且成功外联，建议尽快上机排查，清除影响，如后门、账号、计划任务等。如果是本人所为，则忽略本次告警即可。`,
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 与恶意服务器：${that.attackIp} 有少量的可疑的数据交互，建议尽快上对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];
                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量可疑数据交互行为，可能为人工访问误触发，由于IOC已经失效，并且无持续交互行为，及时更新威胁情报版本，并对该机器进行病毒查杀处理即可。
  综上所述，这是一次无效的恶意软件类告警，由于只有少量可疑数据交互，建议对该机器进行病毒查杀即可。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在少量通信行为，为防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量通信行为，可能为人工访问误触发，虽然该IOC已经失效，但是被标记为\`${that.ioc_res}\`，对该机器进行病毒查杀处理，以及更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，但是由于存在少量通信行为，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在少量通信行为，为防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                default:
                  break;
              }
            } else if (sum_tcp_udp >= 5) {
              // tcp_count和udp_count之和是否大于5，是的话，归为外联成功
              // 外联成功
              console.log("本次ioc告警为 ip类外联成功");
              switch (that.ioc_res) {
                case "恶意":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在大量可疑数据交互行为，证明恶意样本外连成功，并且说明机器上存在恶意样本，而且该样本仍然处于活跃状态，建议尽快对该机器进行病毒查杀处理，并且上机排查清除影响，如后门、账号、计划任务等，同时在防火墙封禁该攻击IP ${that.attackIp}。
  综上所述，这是一次有效的恶意软件类告警，由于存在大量可疑数据交互，建议尽快处理该机器。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现存在大量可疑数据交互行为，所以需要在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                    `**上机排查**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 正在持续的与恶意服务器：${that.attackIp} 进行大量可疑的数据交互，建议尽快上机排查，清除影响，如后门、账号、计划任务等，以及对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];
                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在大量可疑数据交互行为，虽然该IOC已经失效，但是大量的可疑数据交互，说明机器上可能仍然残留恶意样本，建议对该机器进行病毒查杀处理。。
  综上所述，这是一次无效的恶意软件类告警，由于存在大量可疑数据交互，建议尽快处理该机器。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在大量通信行为，为防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在大量活跃通信行为，虽然该IOC已经失效，但是被标记为\`${that.ioc_res}\`，可以持续观察该机器，并对该机器进行病毒查杀处理。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，但是由于存在大量活跃的通信行为，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现存在大量可疑数据交互行为，所以建议在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为7天。`,
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在大量活跃的通信行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                default:
                  break;
              }
            } else {
              // 未知情况
              console.log("本次ioc告警出现异常！！！！");
            }
          }
        }
      } else if (type == 2) {
        console.log("DNS类");
        // 判断ioc是不是dns类
        // 如果是，判断受害IP是不是客户资产，以及是不是DNS
        if (that.is_asset == "是" && that.asset_type.indexOf("DNS") != -1) {
          // 根据ioc_res 走不通的分支
          if (that.ioc_res == "恶意") {
            console.log("受害者是DNS、ioc是恶意");
            console.log("人工排查追踪");
            console.log("有效告警");

            new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}。从资产属性可知，该受害IP ${that.victimIp} 是一台DNS服务器，通常情况下，针对恶意软件的告警中，当受害IP是DNS服务器时，并非表示该DNS服务器本身受到感染，而是因为其转发DNS流量时触发了告警，实际受感染或存在问题的机器是其他设备。由于该IOC被标记为恶意，因此需要通过IOC和时间等信息，去追踪和定位真正受影响的机器，处置真正受影响的机器。
  综上所述，这是一次有效的恶意软件类告警，由于受害IP是一台DNS服务器，因此需要定位真实受影响机器进行处理。`;
            if (that.attackIp) {
              new_suggestion_array = [
                `**封禁任务**：根据威胁情报库信息进行分析，并且发现IOC解析成功，所以需要在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                `**人工核实**：本次告警中受害IP：${that.victimIp} 是一台DNS服务器，因此需要人工通过IOC和时间等信息，去追踪和定位真正受影响的机器，对该机器进行处理。`,
              ];
            } else {
              new_suggestion_array = [
                `**人工核实**：本次告警中受害IP：${that.victimIp} 是一台DNS服务器，因此需要人工通过IOC和时间等信息，去追踪和定位真正受影响的机器，对该机器进行处理。`,
              ];
            }
          } else {
            console.log("受害者是DNS、ioc是其他的");
            console.log("情报更新、忽略");
            console.log("无效告警");
            new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}。从资产属性可知，该受害IP ${that.victimIp} 是一台DNS服务器，通常情况下，针对恶意软件的告警中，当受害IP是DNS服务器时，并非表示该DNS服务器本身受到感染，而是因为其转发DNS流量时触发了告警，实际受感染或存在问题的机器是其他设备。由于IOC已经失效，因此无需追踪定位真正触发该IOC告警的机器。
  综上所述，因为IOC已经失效，因此这是一次无效的恶意软件类告警，建议及时更新威胁情报。`;
            new_suggestion_array = [
              `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
            ];
          }
        } else {
          if (that.attackIp) {
            // 解析成功，看tcp_count和udp_count的和，小于5的话，归为人工误触
            // 解析成功，看tcp_count和udp_count的和，大于5的话，归为外联成功
            console.log("dns类，解析成功");
            console.log("接下来看tcp和udp的和");
            console.log(that.tcp_count);
            console.log(that.udp_count);
            console.log(sum_tcp_udp);
            if (sum_tcp_udp < 5) {
              // 人工误触
              console.log("本次ioc告警为 dns类，人工误触");
              switch (that.ioc_res) {
                case "恶意":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量可疑数据交互行为，解析次数较少，可能为人工访问误触发，需要与该机器负责人确认行为，并且对该机器进行病毒查杀处理，同时在防火墙封禁该攻击IP ${that.attackIp}。
  综上所述，这是一次有效的恶意软件类告警，受害机器 ${that.victimIp} 解析恶意域名 ${that.ioc} 成功，由于存在少量可疑数据交互的行为，因此建议与该机器负责人确认行为，并且对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现IOC解析成功，存在可疑数据交互行为，所以需要在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                    `**确认行为**：需要与机器：${this.victimIp} 的负责人确认其针对恶意域名：\`${that.ioc}\` 发起的请求解析是否为本人所为。如果不是，则说明该机器上应该存在恶意样本，并且成功外联，建议尽快上机排查，清除影响，如后门、账号、计划任务等。如果是本人所为，则忽略本次告警即可。`,
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 与恶意服务器：${that.attackIp} 有少量的可疑的数据交互，建议尽快上对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];

                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量可疑数据交互行为，可能为人工访问误触发，由于IOC已经失效，并且无持续解析与交互行为，及时更新威胁情报版本，并对该机器进行病毒查杀处理即可。
  综上所述，这是一次无效的恶意软件类告警，IOC已经失效，也无持续解析与交互行为，对该机器进行杀毒与更新情报版本即可。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在少量通信行为，为防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功。由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在少量通信行为，可能为人工访问误触发，虽然该IOC已经失效，但是被标记为\`${that.ioc_res}\`，可以持续观察该机器，并对该机器进行病毒查杀处理。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，但是由于存在少量通信行为，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在少量通信行为，为防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                default:
                  break;
              }
            } else if (sum_tcp_udp >= 5) {
              // 外联成功
              console.log("本次ioc告警为 dns类，外联成功");
              switch (that.ioc_res) {
                case "恶意":
                  // 域名解析出的ip要查ioc吗？？一期先不弄 “且解析得到的{attackIP}的IOC同样有效，”
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在大量可疑数据交互行为，证明恶意样本外联成功，机器上的恶意样本仍然存在并且处于活跃状态，建议尽快对该机器进行病毒查杀处理，并且上机排查清除影响，如后门、账号、计划任务等，同时在防火墙封禁该攻击IP ${that.attackIp}。
  综上所述，这是一次有效的恶意软件类告警，受害机器 ${that.victimIp} 解析恶意域名 ${that.ioc} 成功，由于存在大量可疑数据交互，建议尽快处理。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现IOC解析成功，存在大量可疑数据交互行为，所以需要在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                    `**上机排查**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 正在持续的与恶意服务器：${that.attackIp} 进行大量可疑的数据交互，建议尽快上机排查，清除影响，如后门、账号、计划任务等，以及对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];

                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在大量可疑数据交互行为，虽然该IOC已经失效，但是大量的可疑数据交互，说明机器上可能仍然残留恶意样本，建议对该机器进行病毒查杀处理。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，但由于存在大量可疑数据交互，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于还有大量的可疑数据交互，为了防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功。由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析成功，受害机器 ${that.victimIp} 和 ${that.attackIp} 机器之间存在活跃通信行为，虽然该IOC已经失效，但是被标记为\`${that.ioc_res}\`，可以持续观察该机器，并对该机器进行病毒查杀处理。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，但是由于存在大量活跃的通信行为，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**封禁任务**：根据威胁情报库信息进行分析，并且发现IOC解析成功，存在大量可疑数据交互行为，所以建议在防火墙对攻击IP：${that.attackIp} 进行封禁处理，建议封禁时间为7天。`,
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，由于存在大量活跃的通信行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                default:
                  break;
              }
            } else {
              // 未知情况
              console.log("本次ioc告警出现异常！！！！!!!");
            }
          } else {
            // 解析失败看dns_count
            console.log("dns类，解析失败，没有攻击IP");
            console.log("ioc的值: ", that.ioc_res);
            console.log("接下来看dns_count");
            console.log(that.dns_count);
            if (that.dns_count < 5) {
              console.log("不持续");
              switch (that.ioc_res) {
                case "恶意":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，未发现持续解析行为。恶意解析次数较少，且当前并没有持续解析，可能为人工访问误触发，危害程度低，对该机器进行病毒查杀即可。
  综上所述，这是一次有效的恶意软件类告警，但危害程度较低，对该机器进行病毒查杀即可。`;
                  new_suggestion_array = [
                    `**确认行为**：需要与机器：${this.victimIp} 的负责人确认其针对恶意域名：${that.ioc} 发起的请求解析是否为本人所为。如果不是，则说明该机器上应该存在恶意样本，建议尽快上机排查恶意样本，清除后门。如果是本人所为，则忽略本次告警即可。`,
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 有少量该IOC：\`${that.ioc}\`的解析行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];
                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，未发现持续解析行为。解析次数较少，且当前并没有持续解析，可能为人工访问误触发，危害程度低，由于该IOC被标记为可疑，因此对该机器进行病毒查杀，以及情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，由于IOC被标记为可疑，无持续解析行为，对该机器进行病毒查杀，升级情报版本即可。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 有少量该IOC：\`${that.ioc}\`的解析行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];

                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，未发现持续解析行为。解析次数较少，且当前并没有持续解析，可能为人工访问误触发，危害程度低，更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经失效，无持续解析行为，无需处置该机器，升级情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败。由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                default:
                  break;
              }
            } else if (that.dns_count >= 5) {
              console.log("持续");
              switch (that.ioc_res) {
                case "恶意":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，但存在持续解析行为，说明机器上仍然存在活跃的恶意样本，建议尽快对该机器进行病毒查杀处理。
  综上所述，这是一次有效的恶意软件类告警，机器上仍然存在活跃的恶意样本，建议尽快对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**上机排查**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 正在持续的解析该IOC：\`${that.ioc}\`，建议尽快上机排查恶意样本，清除后门，以及对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                  ];
                  break;
                case "可疑":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，但存在持续解析行为，由于该IOC被标记为可疑，因此该机器上可能存在恶意样本，建议对该机器进行病毒查杀处理，以及更新情报版本。
  综上所述，这是一次无效的恶意软件类告警，由于IOC被标记为可疑，并且有持续解析行为，建议对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 有大量该IOC：\`${that.ioc}\`的解析行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "未知":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败，但存在持续解析行为，虽然该IOC已经失效，但持续解析的行为意味着机器上可能残留着恶意样本，对该机器进行病毒查杀即可。
  综上所述，这是一次无效的恶意软件类告警，虽然IOC已经失效，仍在持续解析，需要对该机器进行病毒查杀处理。`;
                  new_suggestion_array = [
                    `**病毒查杀**：该IOC：\`${that.ioc}\` 在TI情报中心被标记为\`${that.ioc_res}\`，并且受害机器：${that.victimIp} 有大量该IOC：\`${that.ioc}\`的解析行为，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                case "安全":
                  new_analysis = `  机器 ${that.victimIp} 触发了IOC告警--${that.alertName}，IOC为\`${that.ioc}\`。${that.ioc_desc}
  通过查询威胁情报可知，该IOC已经被标记为\`${that.ioc_res}\`，可信度${that.ioc_confidence}，解析失败。由于该IOC已经被标记为安全，因此这并非一次恶意软件类告警，及时更新情报版本即可。
  综上所述，这是一次无效的恶意软件类告警，该IOC已经被TI情报中心标记为安全，无需处置机器 ${that.victimIp}，及时更新情报版本即可。`;
                  new_suggestion_array = [
                    `**情报更新**：该IOC：\`${that.ioc}\` 在TI情报中心已经失效，建议及时更新情报版本。`,
                  ];
                  break;
                default:
                  break;
              }
            } else {
              console.log("没有dns_count??");
            }
          }
        }
      } else {
        if (that.ioc.length == 32) {
          console.log("md5类型，先不管");
          new_analysis = "md5类型，先不管";
        } else {
          console.log("规则类告警，瞎几把点？");
          new_analysis = "规则类告警，瞎几把点？";
        }
      }

      that.set_judgement(
        analysisValue + "\n=====================\n" + new_analysis
      );
      // 建议要弄成序号
      new_suggestion = that.insertOrderedListItems(
        suggestionValue,
        new_suggestion_array
      );
      that.setSuggestion(new_suggestion);
      console.log("IOC类分析增加完成");
    }
  }

  // 增加业务/误报类介绍按钮
  addBusinessIntroduceBtn() {
    if (!document.querySelector(".my-business-introduce-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加业务/误报类介绍");
          that.doIntroduceBtn("business");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-business-introduce-btn";
        let span = document.createElement("span");
        span.textContent = "业务/误报类介绍";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }
  // 增加核实类介绍按钮
  addVerifyIntroduceBtn() {
    if (!document.querySelector(".my-verify-introduce-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加核实类介绍");
          that.doIntroduceBtn("verify");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-verify-introduce-btn";
        let span = document.createElement("span");
        span.textContent = "核实类介绍";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }

  // 校准的保存并返回，加上输入框
  addAdjustInput() {
    if (!document.querySelector(".my-adjust-problem-input")) {
      var header = document.querySelector(
        "#pane-model > div > div:nth-child(3)"
      );
      if (header) {
        var that = this;
        let problemInputDiv = document.createElement("div");
        let problemInput = document.createElement("input");
        problemInput.type = "text";
        problemInput.id = "problemInput";
        problemInput.className = "q-textarea__inner my-adjust-problem-input";
        problemInput.placeholder = "输入问题";
        problemInput.style = "min-height: 98px; height: 98px;";
        problemInput.oninput = function () {
          // 在这里编写 input 的 oninput 方法的逻辑
          // that.search()
        };
        problemInputDiv.append(problemInput);
        header.append(problemInputDiv);

        var button = document.querySelector("#pane-model > div > button");

        if (button) {
          var originalOnClick = button.onclick || function () { };

          button.onclick = function (event) {
            // Your custom method here
            console.log("Button was clicked!");

            // Call the original method
            originalOnClick.call(button, event);
          };
        }
      }
    }
  }

  // 增加脆弱性类介绍按钮
  addVulnIntroduceBtn() {
    if (!document.querySelector(".my-vuln-introduce-btn")) {
      var header = document.querySelector(".ai-judgment .item-header");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加脆弱性介绍");
          that.doIntroduceBtn("vuln");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-vuln-introduce-btn";
        let span = document.createElement("span");
        span.textContent = "脆弱性类介绍";
        introduceBtn.appendChild(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加信息不足结论按钮
  addLOLConclusionBtn() {
    if (!document.querySelector(".my-lol-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加信息不足结论");
          that.doConclusionBtn("LOL");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-lol-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "信息不足结论";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加业务结论按钮
  addBusinessConclusionBtn() {
    if (!document.querySelector(".my-business-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加业务结论");
          that.doConclusionBtn("business");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-business-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "业务结论";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加核实结论按钮
  addVerifyConclusionBtn() {
    if (!document.querySelector(".my-verify-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment-title");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加需要核实结论");
          that.doConclusionBtn("verify");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-verify-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "核实结论";
        introduceBtn.append(span);
        header.append(introduceBtn);
      }
    }
  }
  // 增加脆弱性结论按钮
  addVulnConclusionBtn() {
    if (!document.querySelector(".my-vuln-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment .item-header");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加脆弱性结论");
          that.doConclusionBtn("vuln");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-vuln-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "脆弱性结论";
        introduceBtn.appendChild(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加攻击类成功结论按钮
  addAttackSuccessConclusionBtn() {
    if (!document.querySelector(".my-attack-success-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment .item-header");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加攻击成功结论");
          that.doConclusionBtn("success");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-attack-success-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "攻击类成功结论";
        introduceBtn.appendChild(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加攻击类失败结论按钮
  addAttackFailedConclusionBtn() {
    if (!document.querySelector(".my-attack-failed-conclusion-btn")) {
      var header = document.querySelector(".ai-judgment .item-header");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加攻击失败结论");
          that.doConclusionBtn("failed");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-attack-failed-conclusion-btn";
        let span = document.createElement("span");
        span.textContent = "攻击类失败结论";
        introduceBtn.appendChild(span);
        header.append(introduceBtn);
      }
    }
  }

  // 增加攻击类介绍按钮
  addAttackIntroduceBtn() {
    if (!document.querySelector(".my-attack-introduce-btn")) {
      var header = document.querySelector(".ai-judgment .item-header");
      if (header) {
        var that = this;
        //var div = document.createElement('div')
        let introduceBtn = document.createElement("button");
        introduceBtn.type = "button";
        introduceBtn.onclick = function () {
          //this.preventDefault();
          console.log("点击了增加攻击介绍");
          that.doIntroduceBtn("attack");
        };
        introduceBtn.className =
          "q-button q-button--primary q-button--mini my-attack-introduce-btn";
        let span = document.createElement("span");
        span.textContent = "攻击类介绍";
        introduceBtn.appendChild(span);
        header.append(introduceBtn);
      }
    }
  }

  setBasicInfo() {
    // 点击按钮的事件，都要调用这个方法
    // 后面得加入校验才行
    var that = this;

    that.attackIp = document.querySelectorAll("#copy_id")[1].textContent;

    that.victimIp = document.querySelectorAll("#copy_id")[2].textContent;

    that.alertName = document.querySelectorAll("#copy_id")[4].textContent;

    that.dport = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(2) > table > tr:nth-child(2) > td:nth-child(4)"
    ).textContent;

    that.ioc = document.querySelectorAll("#copy_id")[6].textContent;

    that.url = document.querySelector(
      "#pane-base > div > div > div > table > tr:nth-child(10) > td:nth-child(2)"
    )?.textContent;

    // 下面就是ioc类的
    let dns_count = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(2) > td:nth-child(2)"
    );
    if (dns_count) {
      that.dns_count = dns_count.textContent;
    }
    let tcp_count = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(3) > td:nth-child(2)"
    );
    if (tcp_count) {
      that.tcp_count = tcp_count.textContent;
    }
    let udp_count = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(4) > td:nth-child(2)"
    );
    if (udp_count) {
      that.udp_count = udp_count.textContent;
    }

    let ioc_res = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(5) > table > tr:nth-child(2) > td:nth-child(2)"
    );
    if (ioc_res) {
      that.ioc_res = ioc_res.textContent;
    }

    let is_asset = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(6) > table > tr:nth-child(2) > td:nth-child(2)"
    );
    if (is_asset) {
      that.is_asset = is_asset.textContent;
    }

    let asset_type = document.querySelector(
      "#pane-base > div > div > div > div:nth-child(6) > table > tr:nth-child(3) > td:nth-child(2)"
    );
    if (asset_type) {
      that.asset_type = asset_type.textContent;
    }

    let ioc_desc = document.querySelector(
      "#pane-base > div > div > div > table > tr:nth-child(11) > td:nth-child(2)"
    );
    if (ioc_desc) {
      that.ioc_desc = ioc_desc.textContent;
      // 去掉换行
      that.ioc_desc = that.ioc_desc.replace(/\n/g, "");
    }

    // ???
    let ioc_confidence = "";
    if (ioc_confidence) {
      that.ioc_confidence = ioc_confidence.textContent;
    }

    // let host = ''
    // if (host) {
    //   that.host = host.textContent
    // }
  }

  doConclusionBtn(judgeType) {
    // 增加结论
    var that = this;
    that.setBasicInfo();
    // that.attackIp = document.querySelectorAll('#copy_id')[1].textContent
    // console.log("攻击者IP：" + that.attackIp);
    // console.log("受害者IP：" + that.victimIp);
    // console.log("威胁名称：" + that.alertName);
    // console.log("端口：" + that.dport);
    console.log("增加告警结论");
    let analysisValue = that.get_judgement();
    if (analysisValue.length === 0) {
      console.log("需要再点一次");
    } else {
      let conclusion;
      // 使用 `===` 运算符
      if (judgeType === "failed") {
        console.log("攻击失败");
        if (that.isInnerIPFn(that.attackIp)) {
          conclusion = `\n  综上所述，这是一次失败的${that.alertName}攻击尝试，建议核实是否为授权渗透测试工作，否则建议上机排查该攻击IP ${that.attackIp}。`;
        } else {
          conclusion = `\n  综上所述，这是一次失败的${that.alertName}攻击尝试，建议核实是否为授权渗透测试工作，否则建议在防火墙封禁该攻击IP ${that.attackIp}。`;
        }
      } else if (judgeType === "verify") {
        console.log("需要核实");
        conclusion = `\n  综上所述，机器${that.victimIp}确实存在${that.alertName}，需要与机器相关人员核实是否是正常的业务。`;
      } else if (judgeType === "success") {
        console.log("攻击成功");
        if (that.isInnerIPFn(that.attackIp)) {
          conclusion = `\n  综上所述，本次攻击已经成功，攻击者${that.attackIp}成功利用了${this.alertName}，建议核实是否是授权渗透行为，否则立刻修复漏洞，上机排查该攻击IP ${that.attackIp}。`;
        } else {
          conclusion = `\n  综上所述，本次攻击已经成功，攻击者${that.attackIp}成功利用了${this.alertName}，建议核实是否是授权渗透行为，否则立刻修复漏洞，防火墙封禁该攻击IP ${that.attackIp}。`;
        }
      } else if (judgeType === "vuln") {
        console.log("错弱性，弱口令之类的");
        conclusion = `\n  综上所述，机器${that.victimIp}确实存在${that.alertName}，建议及时整改。`;
      } else if (judgeType === "business") {
        console.log("业务/误报");
        conclusion = `\n  综上所述，本次告警为正常业务触发，并非恶意攻击，建议对告警进行加白处理。`;
      } else if (judgeType === "LOL") {
        console.log("judgeType 的值为信息不足");
        conclusion = `\n  综上所述，当前信息不足，无法研判是否攻击成功，需要结合xx日志进行关联分析。`;
      } else {
        console.log("judgeType 的值不为 attack、vuln、verify、business 或 ioc");
        console.log("请联系开发人员修改代码");
        console.log(judgeType);
      }
      console.log("结论是:" + conclusion);
      that.set_judgement(analysisValue + conclusion);
      console.log("告警结论增加完成");
    }
  }
  doIntroduceBtn(judgeType) {
    // 增加攻击介绍
    var that = this;
    that.setBasicInfo();
    // that.attackIp = document.querySelectorAll('#copy_id')[1].textContent
    // console.log("攻击者IP：" + that.attackIp);
    // console.log("受害者IP：" + that.victimIp);
    // console.log("威胁名称：" + that.alertName);
    // console.log("端口：" + that.dport);
    console.log("增加告警介绍");
    let analysisValue = that.get_judgement();
    if (analysisValue.length === 0) {
      console.log("需要再点一次");
    } else {
      let introduce;
      // 使用 `===` 运算符
      if (judgeType === "attack") {
        console.log("攻击");
        introduce = `  攻击者（源IP：${that.attackIp}）对目标服务器（目的IP：${that.victimIp}）${that.dport}端口的 \`${that.url}\` 路径进行了${that.alertName}攻击。\n`;
      } else if (judgeType === "vuln") {
        console.log("脆弱性");
        introduce = `  服务器（目的IP：${that.victimIp}）${that.dport}端口的 \`${that.url}\` 路径存在${that.alertName}。\n`;
      } else if (judgeType === "verify") {
        console.log("需要核实");
        introduce = `  机器（目的IP：${that.victimIp}）存在${that.alertName}。\n`;
      } else if (judgeType === "business") {
        console.log("业务/误报");
        introduce = `  机器（源IP：${that.attackIp}）在请求访问服务器（目的IP：${that.victimIp}）${that.dport}端口的 \`${that.url}\` 路径触发了${that.alertName}告警。\n`;
      } else if (judgeType === "ioc") {
        console.log("judgeType 的值为 ioc");
        introduce = `  机器（目的IP：${that.victimIp}）触发了IOC告警-${that.alertName}，IOC是${that.ioc}。\n`;
      } else {
        console.log("judgeType 的值不为 attack、vuln、verify、business 或 ioc");
        console.log("请联系开发人员修改代码");
        console.log(judgeType);
      }
      console.log("介绍是:" + introduce);
      that.set_judgement(introduce + analysisValue);
      console.log("告警介绍增加完成");
    }
  }

  addSearchInput() {
    // 添加搜索相关的各种控件
    if (!document.querySelector(".my-search-input")) {
      //     <div>
      //         <input type="text" id="searchInput" oninput="search()" class="q-input__inner" placeholder="输入关键词">
      //     </div>
      //     <div>
      //         <ul id="suggestions"></ul>
      //         <div class="details" id="detailsContainer">
      //             <h2 id="detailsTitle"></h2>
      //             <p id="detailsAnalysis"></p>
      //             <p id="detailsSuggestion"></p>
      //         </div>
      //     </div>

      // 在点击编辑之后，在markdown编辑框之前出现
      var header = document.querySelector(
        "#__qiankun_microapp_wrapper_for_qgpt_mp_data_management__ > div > div > div:nth-child(3) > div > div.q-tabs__header.is-top"
      );
      if (header) {
        var that = this;
        // 输入框的div
        var inputDiv = document.createElement("div");
        var input = document.createElement("input");
        input.type = "text";
        input.id = "searchInput";
        input.className = "q-input__inner my-search-input";
        input.placeholder = "输入关键词";
        input.oninput = function () {
          // 在这里编写 input 的 oninput 方法的逻辑
          that.search();
        };
        inputDiv.append(input);

        var alertNameDiv = document.createElement("div");
        var alertNameList = document.createElement("ul");
        alertNameList.id = "suggestions";
        alertNameList.style.cssText = "list-style: none;padding: 0;";
        alertNameDiv.append(alertNameList);

        // 告警名称和对应的研判细节的div
        var detailsDiv = document.createElement("div");
        detailsDiv.className = "details";
        detailsDiv.id = "detailsContainer";
        detailsDiv.style.cssText =
          "margin-top: 10px;border: 1px solid #ccc;padding: 10px;";

        // 建议的div
        var suggestionDiv = document.createElement("div");
        suggestionDiv.className = "details";
        suggestionDiv.id = "suggestionsContainer";
        suggestionDiv.style.cssText =
          "margin-top: 10px;border: 1px solid #ccc;padding: 10px;";

        // 研判 预期结果添加到原来结果的顶部
        var judgeAddBelowBtn = document.createElement("button");
        judgeAddBelowBtn.type = "button";
        judgeAddBelowBtn.onclick = function () {
          that.doJudge("add_below");
        };
        judgeAddBelowBtn.className =
          "q-button edit-btn q-button--primary q-button--mini";
        let judgeAddBelowBtnSpan = document.createElement("span");
        judgeAddBelowBtnSpan.textContent = "添加到顶部";
        judgeAddBelowBtn.appendChild(judgeAddBelowBtnSpan);

        // 研判 预期结果直接替换原来的结果
        var judgeReplaceBtn = document.createElement("button");
        judgeReplaceBtn.type = "button";
        judgeReplaceBtn.onclick = function () {
          that.doJudge("replace");
        };
        judgeReplaceBtn.className =
          "q-button edit-btn q-button--primary q-button--mini";
        let judgeReplaceBtnSpan = document.createElement("span");
        judgeReplaceBtnSpan.textContent = "替换";
        judgeReplaceBtn.appendChild(judgeReplaceBtnSpan);

        // 建议 预期结果添加到原来结果的顶部
        var suggestionAddBelowBtn = document.createElement("button");
        suggestionAddBelowBtn.type = "button";
        suggestionAddBelowBtn.onclick = function () {
          that.doSuggestion("add_below");
        };
        suggestionAddBelowBtn.className =
          "q-button edit-btn q-button--primary q-button--mini";
        let suggestionAddBelowBtnSpan = document.createElement("span");
        suggestionAddBelowBtnSpan.textContent = "添加到顶部";
        suggestionAddBelowBtn.appendChild(suggestionAddBelowBtnSpan);

        // 建议 预期结果直接替换原来的结果
        var suggestionReplaceBtn = document.createElement("button");
        suggestionReplaceBtn.type = "button";
        suggestionReplaceBtn.onclick = function () {
          that.doSuggestion("replace");
        };
        suggestionReplaceBtn.className =
          "q-button edit-btn q-button--primary q-button--mini";
        let suggestionReplaceBtnSpan = document.createElement("span");
        suggestionReplaceBtnSpan.textContent = "替换";
        suggestionReplaceBtn.appendChild(suggestionReplaceBtnSpan);

        that.detailsTitle = document.createElement("h2");
        that.detailsTitle.id = "detailsTitle";

        that.detailsAnalysis = document.createElement("pre");
        // 过长自动换行+自动识别换行符
        that.detailsAnalysis.style.cssText =
          "word-wrap: break-word;white-space: pre-wrap;";
        that.detailsAnalysis.id = "detailsAnalysis";
        that.detailsSuggestion = document.createElement("pre");
        that.detailsSuggestion.style.cssText =
          "word-wrap: break-word;white-space: pre-wrap;";
        that.detailsSuggestion.id = "detailsSuggestion";
        //detailsDiv.append(detailsTitle, detailsAnalysis, detailsSuggestion);
        detailsDiv.append(
          judgeAddBelowBtn,
          judgeReplaceBtn,
          that.detailsTitle,
          that.detailsAnalysis
        );

        suggestionDiv.append(
          suggestionAddBelowBtn,
          suggestionReplaceBtn,
          that.detailsSuggestion
        );

        let suggestionHeader = document.querySelector(
          "#pane-first-instance > div > div.suggestion > div.suggestion-header"
        );
        suggestionHeader.append(suggestionDiv);

        header.append(inputDiv, alertNameDiv);

        // 研判标题后面插入细节
        var judgmentTitleDiv = document.querySelector(".ai-judgment-content");
        judgmentTitleDiv.insertAdjacentElement("afterend", detailsDiv);

        // 变量赋值
        that.searchInput = document.getElementById("searchInput");
        that.suggestions = document.getElementById("suggestions");
        that.detailsContainer = document.getElementById("detailsContainer");
        that.suggestionsContainer = document.getElementById(
          "suggestionsContainer"
        );

        // 先空着
        that.suggestions.innerHTML = "";
        that.detailsSuggestion.innerHTML = "";
        that.detailsContainer.style.display = "none";
        that.suggestionsContainer.style.display = "none";

        // that.attackIp = document.querySelectorAll("#copy_id")[1].textContent;
        // that.victimIp = document.querySelectorAll("#copy_id")[2].textContent;
      }
    }
  }

  // search() {
  //   var that = this;
  //   var keyword = that.searchInput.value;
  //   var matchedItems = data.filter(function(item) {
  //     // 后面需要加入标签，直接就在告警名称后面追加完事
  //     return item["告警名称"].toLowerCase().includes(keyword.toLowerCase());
  //   });

  //   that.suggestions.innerHTML = "";
  //   that.detailsSuggestion.innerHTML = "";
  //   // let detailsContainer = document.getElementById('detailsContainer')
  //   // let suggestionsContainer = document.getElementById('suggestionsContainer')
  //   that.detailsContainer.style.display = "none";
  //   that.suggestionsContainer.style.display = "none";

  //   if (keyword.trim() === "") {
  //     return;
  //   }

  //   matchedItems.forEach(function(item) {
  //     var listItem = document.createElement("li");
  //     listItem.textContent = item["告警名称"];
  //     listItem.addEventListener("click", function() {
  //       that.displayDetails(item);
  //     });
  //     that.suggestions.appendChild(listItem);
  //   });
  // }

  search() {
    var that = this;
    var keyword = that.searchInput.value;

    that.suggestions.innerHTML = "";
    that.detailsSuggestion.innerHTML = "";
    that.detailsContainer.style.display = "none";
    that.suggestionsContainer.style.display = "none";

    if (keyword.trim() === "") {
      return;
    }
    let search_alert_url =
      BACKURL +
      "/alert/list?page=1&limit=100&alert_name=" +
      encodeURIComponent(keyword) +
      "&status=" +
      encodeURIComponent("已审核");

    that.checkToken();
    fetch(search_alert_url, {
      method: "GET",
      headers: {
        "X-Token": that.login_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("返回的数据:");
        console.log(data);
        if (data.code === 20000) {
          data.data.items.forEach(function (item) {
            var listItem = document.createElement("li");
            listItem.textContent = item.alert_name;
            listItem.addEventListener("click", function () {
              that.displayDetails(item);
            });
            that.suggestions.appendChild(listItem);
          });
        } else {
          console.log("search() 返回有问题：", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  toastSubmitSuccess() {
    var that = this;
    let a = document.querySelector(
      "body > div.qp-hostapp > div.qp-layout.layout-hybrid > header > div.qp-layout__logo > img"
    ).__vue__;
    a.$notify({ type: "success", message: "模版提交成功", title: "模版" });
  }
  toastSubmitFailed() {
    var that = this;
    let a = document.querySelector(
      "body > div.qp-hostapp > div.qp-layout.layout-hybrid > header > div.qp-layout__logo > img"
    ).__vue__;
    a.$notify({ type: "error", message: "模版提交失败", title: "模版" });
  }

  toast(title, message, type) {
    var that = this;
    let a = document.querySelector(
      "body > div.qp-hostapp > div.qp-layout.layout-hybrid > header > div.qp-layout__logo > img"
    ).__vue__;
    a.$notify({ type: type, message: message, title: title });
  }

  get_judgement() {
    let judgementMarkdownEle = document.querySelector(
      "#pane-first-instance > div > div.ai-judgment > div.ai-judgment-content > div.markdown-editor"
    );
    if (judgementMarkdownEle) {
      judgementMarkdownEle = judgementMarkdownEle.__vue__;
      let value = judgementMarkdownEle.$attrs.value;
      return value;
    } else {
    }
    // 先点一下编辑
    document
      .querySelector(
        "#pane-first-instance > div > div.ai-judgment > div.ai-judgment-title > div > div:nth-child(2) > button"
      )
      .click();
    return "";
  }

  set_judgement(new_judgement) {
    let judgementMarkdownEle = document.querySelector(
      "#pane-first-instance > div > div.ai-judgment > div.ai-judgment-content > div.markdown-editor"
    ).__vue__;

    judgementMarkdownEle.$attrs.value = new_judgement;
    judgementMarkdownEle.$forceUpdate();
  }

  get_suggestion() {
    let suggestionMarkdownEle = document.querySelector(
      "div.suggestion-content > div.markdown-editor"
    );
    if (suggestionMarkdownEle) {
      suggestionMarkdownEle = suggestionMarkdownEle.__vue__;

      let value = suggestionMarkdownEle.$attrs.value;
      return value;
    } else {
      // 先点一下错误
      document
        .querySelector(
          "#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-right > div > label:nth-child(2)"
        )
        .click();
      return "";
    }
  }

  setSuggestion(new_suggestion) {
    let suggestionMarkdownEle = document.querySelector(
      "div.suggestion-content > div.markdown-editor"
    ).__vue__;

    suggestionMarkdownEle.$attrs.value = new_suggestion;
    suggestionMarkdownEle.$forceUpdate();
  }

  del_suggestion_empty_line() {
    var that = this;
    let value = that.get_suggestion();
    if (value.length == 0) {
    } else {
      // 去掉开头的空格
      value = value.trim();

      // 将连续的多个换行符替换为一个换行符
      value = value.replace(/\n+/g, "\n");

      // 重新计算编号
      let n = 1;
      value = value.replace(/^\d{1,2}\.\s/gm, () => {
        return `${n++}. `;
      });

      that.setSuggestion(value);
    }
  }

  formatArrayToNumberedString(array) {
    // 数组变成序号字符串
    let numberedString = "";
    for (let i = 0; i < array.length; i++) {
      numberedString += `${i + 1}. ${array[i]}\n`;
    }
    return numberedString.trim(); // 去掉末尾可能存在的多余换行符
  }

  insertOrderedListItems(str, newItems) {
    // 调用方法如下：
    //     let str = `以下是对于此类攻击的一些详细的处置建议和措施:
    // 1. 更新和修复:若依RuoYi CMS后台应尽快更新到最新版本,修复已知的任意文件下载漏洞。
    // 2. 访问控制:限制未授权的IP访问后台管理系统,只允许信任的IP地址访问。
    // 3. 文件权限管理:对敏感文件进行权限管理,禁止非法用户下载。
    // 4. 入侵检测系统:部署入侵检测系统(IDS),能够检测并阻止此类攻击。
    // 5. 日志审计:定期审计系统和网络日志,检测是否有异常访问行为。
    // 6. 安全培训:对员工进行网络安全意识培训,提高防范能力。
    // 以上措施可以有效防止此类攻击,保护系统安全。`;

    // let newItems = ['新增项1', '新增项2'];
    // let result = insertOrderedListItems(str, newItems);
    // console.log(result);

    // 找到有序列表的开始位置
    let start = str.indexOf("1.");

    // 拼接要插入的新项
    let newListItems = newItems.map((item, index) => `${index + 1}. ${item}\n`);

    // 插入新项
    str = [str.slice(0, start), ...newListItems, str.slice(start)].join("");

    // 重新计算编号
    let n = 1;
    str = str.replace(/^\d\.\s/gm, () => {
      return `${n++}. `;
    });

    return str;
  }

  // displayDetails(item) {
  //   var that = this;
  //   // let detailsContainer = document.getElementById('detailsContainer')
  //   that.detailsContainer.style.display = "block";
  //   // let suggestions_container = document.getElementById('suggestionsContainer')
  //   that.suggestionsContainer.style.display = "block";
  //   console.log(item['id'])
  //   that.detailsTitle.textContent = item["告警名称"];
  //   that.detailsAnalysis.textContent = item["告警分析"];
  //   console.log(item["告警分析"])
  //   that.detailsSuggestion.textContent = item["建议"];
  // }

  checkToken() {
    var that = this;
    var retryCount = 0;
    var maxRetry = 5;

    function checkValidity() {
      that.login_token = localStorage.getItem("login-token");
      console.log("check token: ", that.login_token);
      fetch(BACKURL + "/user/check", {
        method: "GET",
        headers: {
          "X-Token": that.login_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("check 返回的数据:");
          console.log(data);
          if (data.code === 20000) {
            console.log("Token没有问题");
          } else {
            console.log("Token有问题，比如超时了");
            retryCount++;
            if (retryCount < maxRetry) {
              that.toast(
                "Token",
                "Token过期了重新获取中。。请等待2s后重新输入",
                "info"
              );
              loginAndGetToken(
                GM_getValue("username"),
                GM_getValue("password")
              );
              setTimeout(checkValidity, 1000); // 等待1秒后重试
            } else {
              console.log("重试次数超过限制");
              that.toast(
                "Token",
                "未知原因，Token过期，重试无法更新，试一下重新输入密码",
                "error"
              );

              username = prompt("Please enter your username:", "");
              GM_setValue("username", username);

              password = prompt("Please enter your password:", "");
              GM_setValue("password", password);

              // 输出已存储的 username 和 password
              console.log("Stored Username:", username);
              console.log("Stored Password:", password);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    if (!that.login_token) {
      that.login_token = localStorage.getItem("login-token");
      if (!that.login_token) {
        console.log("loginAndGetToken() call");
        loginAndGetToken(GM_getValue("username"), GM_getValue("password"));
        that.login_token = localStorage.getItem("login-token");
        console.log("that.login_token: " + that.login_token);
        checkValidity();
      } else {
        checkValidity();
      }
    } else {
      checkValidity();
    }
  }

  displayDetails(item) {
    var that = this;
    var alertId = item.id; // 获取列表项的 ID
    let get_alert_url = BACKURL + "/alert/detail/" + alertId;

    that.checkToken();
    // 请求 Flask 后端接口
    fetch(get_alert_url, {
      method: "GET",
      headers: {
        "X-Token": that.login_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("返回的数据:");
        console.log(data);
        data = data.data;
        // 设置显示详细信息的容器
        that.detailsContainer.style.display = "block";
        that.suggestionsContainer.style.display = "block";

        // 将返回的数据赋值给详细信息的元素
        that.detailsTitle.textContent = data.alert_name;
        that.detailsAnalysis.textContent = data.alert_analysis;
        that.detailsSuggestion.textContent = data.alert_suggestion;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  splitStringIntoArray(inputString) {
    const regex = /\*\*.*?\*\*：[^]*?(?=\*\*|$)/g; // 正则表达式匹配 "**xx**：" 格式的内容
    const matches = inputString.match(regex) || [];
    // console.log(matches)

    const cleanedMatches = matches.map((match) => {
      if (match.endsWith("\n")) {
        return match.slice(0, -1); // 去掉最后的换行符
      } else if (match.endsWith(". ")) {
        return match.slice(0, -4); // 去掉最后的换行符加数字
      }
      return match;
    });

    return cleanedMatches;
  }
}

// 检查是否存在存储的 username 和 password
var username = GM_getValue("username");
var password = GM_getValue("password");

// 如果没有存储的值，则提示用户输入
if (!username || !password) {
  username = prompt("Please enter your username:", "");
  GM_setValue("username", username);
  password = prompt("Please enter your password:", "");
  GM_setValue("password", password);
}

// 输出已存储的 username 和 password
console.log("Stored Username:", username);
console.log("Stored Password:", password);

var BACKURL = "https://10.57.144.187:9527/api";
// var BACKURL = "http://127.0.0.1:5000";
// 开发用发布记得注释
//BACKURL = 'https://192.168.127.129:9527/api'
// 从localStorage获取token
var login_token = localStorage.getItem("login-token");

// 检查token是否存在
if (!login_token) {
  // 如果token不存在，则调用loginAndGetToken方法获取
  loginAndGetToken(username, password);
} else {
  // 如果token存在，则可以在这里使用它进行后续的操作
  console.log("Token from localStorage:", login_token);
  // 这里可以使用token进行后续的操作
}

// 发送登录请求以获取token
function loginAndGetToken(username, password) {
  console.log("登录获取token");
  var apiUrl = BACKURL + "/user/login";
  var userData = {
    username: username,
    password: password,
  };

  // 发送POST请求
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("loginAndGetToken() 返回数据: ", data);
      let token = data.data.token; // 获取返回的token
      // 这里可以使用token进行后续的操作，比如存储在本地以备将来使用
      console.log("登录获取到的Token:", token);
      // 你可以将token存储在本地，如localStorage，以备将来使用
      localStorage.setItem("login-token", token);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
function addElementUICSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/theme-chalk/index.min.css";
  document.head.appendChild(link);
}

function findSuggestionSelectElement() {
  // 建议选择器的vue渲染
  const element = document.querySelector(".suggestion-select");
  const vue_element = document.querySelector(".el-input.el-input--suffix");
  const decode_btn = document.querySelector(
    "#__qiankun_microapp_wrapper_for_qgpt_mp_data_management__ > div > span > button"
  );
  if (decode_btn && element && !vue_element) {
    console.log("渲染建议选择");
    var Main = {
      data() {
        return {
          showLoading: false,
          value: [],
          options: [
            {
              value: "attack",
              label: "攻击",
              children: [
                {
                  value: "inattackin",
                  label: "内打内",
                  children: [
                    {
                      value: "inattackin-success",
                      label: "成功",
                    },
                    {
                      value: "inattackin-failed",
                      label: "失败",
                    },
                    {
                      value: "inattackin-try",
                      label: "企图",
                    },
                  ],
                },
                {
                  value: "inattackout",
                  label: "内打外",
                  children: [
                    {
                      value: "inattackout-success",
                      label: "成功",
                    },
                    {
                      value: "inattackout-failed",
                      label: "失败",
                    },
                    {
                      value: "inattackout-try",
                      label: "企图",
                    },
                  ],
                },
                {
                  value: "outattackin",
                  label: "外打内",
                  children: [
                    {
                      value: "outattackin-success",
                      label: "成功",
                    },
                    {
                      value: "outattackin-failed",
                      label: "失败",
                    },
                    {
                      value: "outattackin-try",
                      label: "企图",
                    },
                  ],
                },
                {
                  value: "outattackout",
                  label: "外打外",
                  children: [
                    {
                      value: "outattackout-success",
                      label: "成功",
                    },
                    {
                      value: "outattackout-failed",
                      label: "失败",
                    },
                    {
                      value: "outattackout-try",
                      label: "企图",
                    },
                  ],
                },
              ],
            },
            {
              value: "ioc",
              label: "情报",
              children: [
                {
                  value: "scan",
                  label: "扫描探测类",
                },
                // {
                //   value: 'ioc',
                //   label: 'ioc告警',
                //   children: [
                //     {
                //       value: 'valid',
                //       label: 'ioc有效'
                //     },
                //     {
                //       value: 'invalid',
                //       label: 'ioc无效'
                //     }
                //   ]
                // }
                {
                  value: "apt",
                  label: "apt告警",
                  children: [
                    {
                      value: "apt-dns",
                      label: "DNS类",
                    },
                    {
                      value: "apt-email",
                      label: "邮件网关类",
                    },
                    {
                      value: "apt-client",
                      label: "终端类",
                    },
                    {
                      value: "apt-server",
                      label: "服务器类",
                    },
                  ],
                },
              ],
            },
            {
              value: "vuln",
              label: "脆弱性",
              children: [
                {
                  value: "weak",
                  label: "弱口令",
                  children: [
                    {
                      value: "weak-success",
                      label: "成功",
                    },
                    {
                      value: "weak-failed",
                      label: "失败",
                    },
                  ],
                },
                {
                  value: "unauth",
                  label: "未授权",
                },
                {
                  value: "apperror",
                  label: "应用程序报错",
                },
              ],
            },
            {
              value: "needvertify",
              label: "需要核实",
            },
            {
              value: "business",
              label: "业务/误报",
            },
          ],
          attackIp: "",
          victimIp: "",
          alertName: "",
          dport: "",
          ioc: "",
          url: "",
          domain: "",
          xff: "",
          dns_count: "",
          tcp_count: "",
          udp_count: "",
          ioc_res: "", // ioc查询结果：安全、未知、可疑、恶意
          is_asset: "",
          asset_type: "",
        };
      },
      methods: {
        isInnerIPFn(ipAddress) {
          // 判断是否是内网IP
          let isInnerIp = false; //默认给定IP不是内网IP
          let ipNum = this.getIpNum(ipAddress);
          /**
           * 私有IP：A类  10.0.0.0    -10.255.255.255
           *       B类  172.16.0.0  -172.31.255.255
           *       C类  192.168.0.0 -192.168.255.255
           *       D类   127.0.0.0   -127.255.255.255(环回地址)
           **/
          let aBegin = this.getIpNum("10.0.0.0");
          let aEnd = this.getIpNum("10.255.255.255");
          let bBegin = this.getIpNum("172.16.0.0");
          let bEnd = this.getIpNum("172.31.255.255");
          let cBegin = this.getIpNum("192.168.0.0");
          let cEnd = this.getIpNum("192.168.255.255");
          let dBegin = this.getIpNum("127.0.0.0");
          let dEnd = this.getIpNum("127.255.255.255");
          let eBegin = this.getIpNum("169.254.0.0");
          let eEnd = this.getIpNum("169.254.255.255");
          isInnerIp =
            this.isInner(ipNum, aBegin, aEnd) ||
            this.isInner(ipNum, bBegin, bEnd) ||
            this.isInner(ipNum, cBegin, cEnd) ||
            this.isInner(ipNum, dBegin, dEnd) ||
            this.isInner(ipNum, eBegin, eEnd);
          console.log("是否是内网:" + isInnerIp);
          return isInnerIp;
        },

        getIpNum(ipAddress) {
          // 获取IP数
          let ip = ipAddress.split(".");
          let a = parseInt(ip[0]);
          let b = parseInt(ip[1]);
          let c = parseInt(ip[2]);
          let d = parseInt(ip[3]);
          let ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
          return ipNum;
        },
        isInner(userIp, begin, end) {
          return userIp >= begin && userIp <= end;
        },
        handleChange(value) {
          let option = value[value.length - 1];
          // 设置值
          this.setBasicInfo();
          this.del_suggestion_empty_line();

          let new_items = [];
          // console.log(option)
          console.log("测试是否获取到各种值：");
          console.log("attackIp: ", this.attackIp);
          console.log("victimIp:", this.victimIp);
          console.log("ioc:", this.ioc);
          console.log("url:", this.url);
          console.log("dport:", this.dport);
          console.log("domain:", this.domain);
          console.log("xff: ", this.xff);

          console.log("dns_count: ", this.dns_count);
          console.log("tcp_count: ", this.tcp_count);
          console.log("udp_count: ", this.udp_count);
          console.log("ioc_res: ", this.ioc_res);
          console.log("is_asset: ", this.is_asset);
          console.log("asset_type: ", this.asset_type);

          // 内打X 确认行为
          let inner_attack_confirm = "";
          // 内打X 是否有封禁任务
          // let is_inner_attack_banned = false;
          // 内打X 封禁行为
          let inner_attack_banned = "";
          let mul_xff_flag = false;
          if (this.xff) {
            if (this.xff.indexOf(",") != -1) {
              console.log("多个xff，取第一个");
              mul_xff_flag = true;
              this.xff = this.xff.split(",")[0].trim();
            }
            if (this.isInnerIPFn(this.xff)) {
              // xff是内网
              inner_attack_confirm = `**确认行为**：首先确认攻击IP：${this.attackIp} 是否有流量转发功能，如果有，因为请求头中的XFF（X-Forwarded-For）：${this.xff} 也为内网IP，所以需要根据规则ID、告警时间和攻击负载找到原始告警，对原始告警进行分析处理。一般来说，没有流量转发功能，则当前告警的攻击IP即为真实攻击IP；有流量转发功能，则需要通过XFF或者其他方法找出真实的攻击IP。找到告警中的真实攻击IP之后，下一步则需要确认攻击IP：${this.attackIp}（XFF：${this.xff}） 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是授权的渗透测试行为，则需要根据真实攻击IP是否为外网IP做进一步处理。`;
            } else {
              // xff是外网
              // is_inner_attack_banned = true;
              if (mul_xff_flag) {
                inner_attack_confirm = `**确认行为**：首先确认攻击IP：${this.attackIp} 是否有流量转发功能，如果有，取请求头中的XFF（X-Forwarded-For）中的第一个IP：${this.xff} 作为真实攻击IP。一般来说，没有流量转发功能，则当前告警的攻击IP即为真实攻击IP；有流量转发功能，则需要通过XFF或者其他方法找出真实的攻击IP。找到告警中的真实攻击IP之后，下一步则需要确认攻击IP：${this.attackIp}（XFF：${this.xff}）对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是授权的渗透测试行为，则需要根据真实攻击IP是否为外网IP做进一步处理。`;
              } else {
                inner_attack_confirm = `**确认行为**：首先确认攻击IP：${this.attackIp} 是否有流量转发功能，如果有，取请求头中的XFF（X-Forwarded-For）：${this.xff} 作为真实攻击IP。一般来说，没有流量转发功能，则当前告警的攻击IP即为真实攻击IP；有流量转发功能，则需要通过XFF或者其他方法找出真实的攻击IP。找到告警中的真实攻击IP之后，下一步则需要确认攻击IP：${this.attackIp}（XFF：${this.xff}）对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是授权的渗透测试行为，则需要根据真实攻击IP是否为外网IP做进一步处理。`;
              }
              inner_attack_banned = `**封禁任务**：如果攻击IP：${this.attackIp} 有流量转发功能，因为此时的XFF（X-Forwarded-For）：${this.xff} 为外网IP，所以需要在防火墙对XFF：${this.xff} 进行封禁处理，建议封禁时间为30天。`;
            }
          } else {
            // 没有xff
            inner_attack_confirm = `**确认行为**：首先确认攻击IP：${this.attackIp} 是否有流量转发功能，如果有，因为请求头中没有XFF（X-Forwarded-For），所以需要根据规则ID、告警时间和攻击负载找到原始告警，对原始告警进行分析处理。一般来说，没有流量转发功能，则当前告警的攻击IP即为真实攻击IP；有流量转发功能，则需要通过XFF或者其他方法找出真实的攻击IP。找到告警中的真实攻击IP之后，下一步则需要确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是授权的渗透测试行为，则需要根据真实攻击IP是否为外网IP做进一步处理。`;
          }

          switch (option) {
            case "inattackin-success":
              console.log("内打内 - 成功");
              if (inner_attack_banned) {
                new_items = [
                  inner_attack_confirm,
                  inner_attack_banned,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对受害机器：${this.victimIp}，~~需要特别关注机器上是否存在normal.exe文件或者进程，以及是否有hacker.com的域名解析日志与TCP日志。~~。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                  `**漏洞修复**：机器：${this.victimIp}:${this.dport} 存在 ~~xxxxx~~ 漏洞，需要及时升级打补丁修复漏洞，目前官方已发布漏洞修复版本，建议用户升级到安全版本 ~~xxxxx~~。`,
                ];
              } else {
                new_items = [
                  inner_attack_confirm,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对受害机器：${this.victimIp}，~~需要特别关注机器上是否存在normal.exe文件或者进程，以及是否有hacker.com的域名解析日志与TCP日志。~~。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                  `**漏洞修复**：机器：${this.victimIp}:${this.dport} 存在 ~~xxxxx~~ 漏洞，需要及时升级打补丁修复漏洞，目前官方已发布漏洞修复版本，建议用户升级到安全版本 ~~xxxxx~~。`,
                ];
              }

              break;
            case "inattackin-failed":
              console.log("内打内 - 失败");
              if (inner_attack_banned) {
                new_items = [
                  inner_attack_confirm,
                  inner_attack_banned,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                ];
              } else {
                new_items = [
                  inner_attack_confirm,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                ];
              }

              break;
            case "inattackin-try":
              console.log("内打内 - 企图");
              if (inner_attack_banned) {
                new_items = [
                  `**漏洞验证**：当前信息不足，无法判断本次攻击是否成功，但确定有恶意Payload。可以在全流量设备上分析其他相关的告警来确认是否攻击成功，也可以在经过授权后，根据此漏洞的Payload，主动测试目标服务器是否存在对应漏洞。`,
                  inner_attack_confirm,
                  inner_attack_banned,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                ];
              } else {
                new_items = [
                  `**漏洞验证**：当前信息不足，无法判断本次攻击是否成功，但确定有恶意Payload。可以在全流量设备上分析其他相关的告警来确认是否攻击成功，也可以在经过授权后，根据此漏洞的Payload，主动测试目标服务器是否存在对应漏洞。`,
                  inner_attack_confirm,
                  `**上机排查**：如果攻击IP：${this.attackIp} 没有流量转发功能，因为其为内网IP，说明该机器可能已经失陷，需要全面排查攻击IP：${this.attackIp} 和受害IP：${this.victimIp}。可以根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。针对攻击IP：${this.attackIp}，需要查询该攻击IP受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                ];
              }

              break;
            case "inattackout-success":
              console.log("内打外 - 成功");
              new_items = [
                `**确认行为**：确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
                `**上机排查**：上机排查攻击IP：${this.attackIp}，根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。如果发现异常，则需要进行病毒查杀，清除影响。此外，需要上机排查攻击IP：${this.attackIp} 攻击成功的机器。根据告警信息，打相应的漏洞补丁，查杀病毒，消除影响。`,
              ];
              break;
            case "inattackout-failed":
              console.log("内打外 - 失败");
              new_items = [
                `**确认行为**：确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
                `**上机排查**：上机排查攻击IP：${this.attackIp}，根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。如果发现异常，则需要进行病毒查杀，清除影响。此外，需要上机排查攻击IP：${this.attackIp} 攻击成功的机器。如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
              ];
              break;
            case "inattackout-try":
              console.log("内打外 - 企图");
              new_items = [
                `**确认行为**：确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
                `**上机排查**：上机排查攻击IP：${this.attackIp}，根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。如果发现异常，则需要进行病毒查杀，清除影响。此外，需要上机排查攻击IP：${this.attackIp} 攻击成功的机器。如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
              ];
              break;
            case "outattackin-success":
              console.log("外打内 - 成功");
              new_items = [
                `**封禁任务**：需要在防火墙对攻击IP：${this.attackIp} 进行封禁处理，建议封禁时间为30天。`,
                `**上机排查**：上机排查受害IP：${this.victimIp}，根据终端安全设备的日志排查异常进程、计划任务、异常账号等等。 对受害机器：${this.victimIp}，~~需要特别关注机器上是否存在normal.exe文件或者进程，以及是否有hacker.com的域名解析日志与TCP日志。~~针对攻击IP：${this.attackIp}，需要查询该攻击IP还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。总之，如果发现异常，则需要及时进行病毒查杀，打相应的漏洞补丁，清除影响。`,
                `**漏洞修复**：机器：${this.victimIp}:${this.dport} 存在 ~~xxxxx~~  漏洞，需要及时升级打补丁修复漏洞，目前官方已发布漏洞修复版本，建议用户升级到安全版本~~xxxxx~~。`,
              ];
              break;
            case "outattackin-failed":
              console.log("外打内 - 失败");
              new_items = [
                `**封禁任务**：需要在防火墙对攻击IP：${this.attackIp} 进行封禁处理，建议封禁时间为7天。`,
              ];
              break;
            case "outattackin-try":
              console.log("外打内 - 企图");
              new_items = [
                `**漏洞验证**：当前信息不足，无法判断本次攻击是否成功，但确定有恶意Payload。可以在全流量设备上分析其他相关的告警来确认是否攻击成功。也可以在经过授权后，根据此漏洞的Payload，主动测试目标服务器是否存在对应漏洞。又或者在机器上排查网络服务、登录、进程等日志以确定该机器是否受影响。`,
                `**封禁任务**：需要在防火墙对攻击IP：${this.attackIp} 进行封禁处理，建议封禁时间为7天。`,
              ];
              break;
            case "outattackout-success":
              console.log("外打外 - 成功");
              new_items = [
                `**封禁任务**：确认攻击IP：${this.attackIp} 是否为贵单位资产，如果不是则需要在防火墙对该IP进行封禁处理，建议封禁时间为7天。`,
                `**确认行为**：如果攻击IP：${this.attackIp} 是贵单位资产，则需要确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
                `**漏洞修复**：确认机器：${this.victimIp}:${this.dport} 是否为贵单位资产，如果是，因为该机器存在  ~~xxxxx~~ 漏洞，需要及时升级打补丁修复漏洞，目前官方已发布漏洞修复版本，建议用户升级到安全版本~~xxxxx~~。`,
              ];
              break;
            case "outattackout-failed":
              console.log("外打外 - 失败");
              new_items = [
                `**封禁任务**：确认攻击IP：${this.attackIp} 是否为贵单位资产，如果不是则需要在防火墙对该IP进行封禁处理，建议封禁时间为7天。`,
                `**确认行为**：如果攻击IP：${this.attackIp} 是贵单位资产，需要确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
              ];
              break;
            case "outattackout-try":
              console.log("外打外 - 企图");
              new_items = [
                `**漏洞验证**：确认受害IP：${this.victimIp} 是否为贵单位资产，如果是，因为当前信息不足，无法判断本次攻击是否成功，但确定有恶意Payload。可以在全流量设备上分析其他相关的告警来确认是否攻击成功。也可以在经过授权后，根据此漏洞的Payload，主动测试目标服务器是否存在对应漏洞。又或者在机器上排查网络服务、登录、进程等日志以确定该机器是否受影响。`,
                `**封禁任务**：确认攻击IP：${this.attackIp} 是否为贵单位资产，如果不是则需要在防火墙对该IP进行封禁处理，建议封禁时间为7天。`,
                `**确认行为**：如果攻击IP：${this.attackIp} 是贵单位资产，需要确认攻击IP：${this.attackIp} 对受害IP：${this.victimIp} 发起的恶意攻击是否是授权的渗透测试行为。如果不是，则该机器可能已经失陷，需要在全流量设备上查询该攻击IP：${this.attackIp} 受到了哪些攻击，以及还攻击了哪些设备，如果攻击成功了其他的内网设备，这些设备都需要进行上机排查。`,
              ];
              break;
            case "scan":
              console.log("情报 - 扫描探测类");
              new_items = [
                `**封禁任务**：该告警属于公网扫描器的扫描探测，在防火墙封禁该公网IP：${this.victimIp} 即可，建议封禁时间为30天。`,
              ];
              break;
            case "valid":
              console.log("情报 - ioc告警 - ioc有效");
              new_items = [
                `**告警加白**：需要确认受害资产：${this.victimIp} 是否有流量转发功能，比如DNS、负载均衡之类的，如果有，则需要根据ioc、时间等信息查询真实告警，并根据IOC：${this.ioc} 和受害IP：${this.victimIp}，对当前告警进行加白处理。`,
                `**上机排查**：该IOC：${this.ioc} 在TI情报中心仍有效，属于 ~~xxxxx~~ ，建议上机排查，清除影响，如后门、账号、计划任务等，以及对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
              ];
              break;
            case "invalid":
              console.log("情报 - ioc告警 - ioc无效");
              new_items = [
                `**告警加白**：需要确认受害资产：${this.victimIp} 是否有流量转发功能，比如DNS、负载均衡之类的，如果有，则需要根据ioc、时间等信息查询真实告警，并根据IOC：${this.ioc} 和受害IP：${this.victimIp}，对当前告警进行加白处理。`,
                `**病毒查杀**：该IOC：${this.ioc} 在TI情报中心已经失效，但曾经属于~~xxxxx~~，为了防止机器上残留恶意样本，建议对该受害机器：${this.victimIp} 进行病毒查杀处理。`,
                `**情报更新**：该IOC：${this.ioc} 在TI情报中心已经失效，建议及时更新情报版本。`,
              ];
              break;
            case "apt-dns":
              console.log("情报 - apt类 - dns");
              new_items = [
                `**资产确认**：需要确认DNS服务器：${this.victimIp} 是否对公网映射，如果映射了，则存在公网解析误报的可能。如果没有映射，则需要根据IOC：\`${this.ioc}\`、时间等信息查询真实告警，对真实告警进行分析处理。`,
              ];
              break;
            case "apt-email":
              console.log("情报 - apt类 - email");
              new_items = [
                `**人工核实**：当受害IP为邮件网关时，需要用\`${this.ioc}\`作为关键词检索邮件流量，定位到具体邮件。如果邮件正文内容有该恶意域名，邮件服务器会对该域名做一个正向的域名解析，从而产生APT告警。这种情况下，防火墙封禁解析出来的IP，删除该邮件即可。`,
              ];
              break;
            case "apt-client":
              console.log("情报 - apt类 - 终端");
              new_items = [
                `**人工核实**：需要在全流量设备上，根据\`${this.ioc}\`和${this.victimIp}等信息作为条件，查询触发本次告警的前后一小时内的网络日志流量（包括域名解析日志、Web访问日志、文件传输日志、TCP流量等等）以及其他的告警，以确认本次APT告警的触发原因，是钓鱼邮件投递触发、运行恶意样本触发、人工访问误触发，还是说是遭受到了APT定向攻击。`,
              ];
              break;
            case "apt-server":
              console.log("情报 - apt类 - 服务器");
              new_items = [
                `**人工核实**：受害IP：${this.victimIp} 为服务器，说明该服务器可能已经失陷，需要对该服务器进行溯源分析。筛选条件为根据\`${this.ioc}\`和${this.victimIp}等信息，目标是全流量设备上，该服务器触发的各种告警以及各种网络日志流量，以确认是否遭受了APT定向攻击。`,
              ];
              break;
            case "weak-success":
              console.log("脆弱性 - 弱口令 - 成功");
              if (this.domain) {
                new_items = [
                  `**资产确认**：需要确认受影响IP：${this.victimIp} 是否为贵单位资产。`,
                  `**强化口令**：域名为 ${this.domain} 的服务器（${this.victimIp}:${this.dport}）的\`${this.url}\`登录入口的 ~~xxxxx~~ 账号为弱口令，建议强化口令复杂度，口令应该是足够长（建议至少12个字符）且包含混合字符（大写字母、小写字母、数字和特殊符号）以增强安全性。`,
                ];
              } else {
                new_items = [
                  `**资产确认**：需要确认受影响IP：${this.victimIp} 是否为贵单位资产。`,
                  `**强化口令**：服务器（${this.victimIp}:${this.dport}）的\`${this.url}\`登录入口的 ~~xxxxx~~ 账号为弱口令，建议强化口令复杂度，口令应该是足够长（建议至少12个字符）且包含混合字符（大写字母、小写字母、数字和特殊符号）以增强安全性。`,
                ];
              }

              break;
            case "weak-failed":
              console.log("脆弱性 - 弱口令 - 失败");
              new_items = [
                `**确认行为**：需要确认本次告警中的攻击IP：${this.attackIp} 是否为内部人员所使用，核实登录失败是否为本人所为。同时，进一步在日志中检索攻击IP：${this.attackIp} 对目标服务器：${this.victimIp} 是否产生了口令暴破的行为。如果该IP非内部人员或者有暴破行为，建议封禁攻击IP：${this.attackIp}。`,
              ];
              break;
            case "unauth":
              console.log("脆弱性 - 未授权");
              new_items = [
                `**资产确认**：需要确认受影响IP：${this.victimIp} 是否为贵单位资产。`,
                `**加入认证**：目标服务器：${this.victimIp} 的 ${this.dport} 端口的 ~~xxxxx~~ 服务需要增加相关授权认证。`,
                `**绑定固定IP**：如因为业务原因无法增加授权认证，建议限制IP访问，绑定固定IP。`,
              ];
              break;
            case "apperror":
              console.log("脆弱性 - 应用程序报错");
              new_items = [
                `**资产确认**：需要确认受影响IP：${this.victimIp} 是否为贵单位资产。`,
                `**优化安全配置**：建议修改目标IP：${this.victimIp} 上的Web服务配置，定制应用程序的错误信息提示页面，取代向用户暴露出来的详细的异常列表。`,
              ];
              break;
            case "needvertify":
              console.log("需要核实");
              new_items = [
                `**确认行为**：需要确认受影响机器：${this.victimIp} 是否为贵单位资产，如果是，则需要确认该机器上 ~~xxxxx~~ 软件的使用是否是合规业务。`,
                `**封禁任务**：受影响机器：${this.victimIp} 是否非贵单位资产，如果是则证明这是一次公网的扫描探测，建议在防火墙封禁该公网IP：${this.victimIp} ，建议封禁时间为30天。`,
              ];
              break;
            case "business":
              console.log("业务/误报");
              new_items = [
                `**告警加白**：在安全设备上，根据规则ID：${this.ioc}，源IP：${this.attackIp}、目的IP：${this.victimIp}、目的端口：${this.dport}、Host：${this.domain} 和URL：\`${this.url}\`进行告警加白处理，建议有效时间为30天。`,
              ];
              break;
            default:
              console.log("未知选项");
          }
          if (new_items.length > 0) {
            let suggestionValue = this.get_suggestion();
            if (suggestionValue.indexOf('==没有数据==') != -1) {
              let result = this.insertOrderedListItems(
                "",
                new_items
              );
              console.log(result);
              this.setSuggestion(result);
              console.log("新建议增加完成");
            }
            else if (suggestionValue.length == 0) {
              console.log("需要再点一下");
            } else {
              let result = this.insertOrderedListItems(
                suggestionValue,
                new_items
              );
              console.log(result);
              this.setSuggestion(result);
              console.log("新建议增加完成");
            }
          }
        },

        insertOrderedListItems(str, newItems) {
          // 调用方法如下：
          //     let str = `以下是对于此类攻击的一些详细的处置建议和措施:
          // 1. 更新和修复:若依RuoYi CMS后台应尽快更新到最新版本,修复已知的任意文件下载漏洞。
          // 2. 访问控制:限制未授权的IP访问后台管理系统,只允许信任的IP地址访问。
          // 3. 文件权限管理:对敏感文件进行权限管理,禁止非法用户下载。
          // 4. 入侵检测系统:部署入侵检测系统(IDS),能够检测并阻止此类攻击。
          // 5. 日志审计:定期审计系统和网络日志,检测是否有异常访问行为。
          // 6. 安全培训:对员工进行网络安全意识培训,提高防范能力。
          // 以上措施可以有效防止此类攻击,保护系统安全。`;

          // let newItems = ['新增项1', '新增项2'];
          // let result = insertOrderedListItems(str, newItems);
          // console.log(result);

          // 找到有序列表的开始位置
          let start = str.indexOf("1.");

          // 拼接要插入的新项
          let newListItems = newItems.map(
            (item, index) => `${index + 1}. ${item}\n`
          );

          // 插入新项
          str = [str.slice(0, start), ...newListItems, str.slice(start)].join(
            ""
          );

          // 重新计算编号
          let n = 1;
          str = str.replace(/^\d\.\s/gm, () => {
            return `${n++}. `;
          });

          return str;
        },
        setBasicInfo() {
          // 点击按钮的事件，都要调用这个方法
          // 后面得加入校验才行
          console.log("setBasicInfo()");
          console.log(typeof this.attackIp);
          console.log(this.attackIp);

          this.attackIp = document.querySelectorAll("#copy_id")[1].textContent;

          this.victimIp = document.querySelectorAll("#copy_id")[2].textContent;

          this.alertName = document.querySelectorAll("#copy_id")[4].textContent;

          this.dport = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(2) > table > tr:nth-child(2) > td:nth-child(4)"
          ).textContent;

          this.ioc = document.querySelectorAll("#copy_id")[6].textContent;

          this.url = document.querySelector(
            "#pane-base > div > div > div > table > tr:nth-child(10) > td:nth-child(2)"
          )?.textContent;

          let xff = document.querySelectorAll("#copy_id")[8].textContent;
          // 正则表达式匹配 x-forwarded-for 的格式
          const xffRegex =
            /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(,\s*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})*$/;

          // 检查 xff 是否符合 x-forwarded-for 的格式
          if (xffRegex.test(xff)) {
            console.log("xff 符合 x-forwarded-for 的格式");
            this.xff = xff;
          } else {
            console.log("xff 不符合 x-forwarded-for 的格式");
            this.xff = "";
          }

          let req_head = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(3) > div:nth-child(2) > pre"
          );
          if (req_head) {
            // 有请求头
            let req_head_text = req_head.textContent;
            const hostRegex = /Host:\s*([a-zA-Z.-]+(?:\.[a-zA-Z.-]+)+)(?::\d+)?/;
            const match = req_head_text.match(hostRegex);

            if (match) {
              const domain = match[1];
              console.log(`提取到的域名是: ${domain}`);
              this.domain = domain;
            } else {
              console.log("未匹配到域名");
            }
          }

          // 下面就是ioc类的
          let dns_count = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(2) > td:nth-child(2)"
          );
          if (dns_count) {
            this.dns_count = dns_count.textContent;
          }
          let tcp_count = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(3) > td:nth-child(2)"
          );
          if (tcp_count) {
            this.tcp_count = tcp_count.textContent;
          }
          let udp_count = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(4) > table > tr:nth-child(4) > td:nth-child(2)"
          );
          if (udp_count) {
            this.udp_count = udp_count.textContent;
          }

          let ioc_res = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(5) > table > tr:nth-child(2) > td:nth-child(2)"
          );
          if (ioc_res) {
            this.ioc_res = ioc_res.textContent;
          }

          let is_asset = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(6) > table > tr:nth-child(2) > td:nth-child(2)"
          );
          if (is_asset) {
            this.is_asset = is_asset.textContent;
          }

          let asset_type = document.querySelector(
            "#pane-base > div > div > div > div:nth-child(6) > table > tr:nth-child(3) > td:nth-child(2)"
          );
          if (asset_type) {
            this.asset_type = asset_type.textContent;
          }
        },
        get_suggestion() {
          let suggestionMarkdownEle = document.querySelector(
            "div.suggestion-content > div.markdown-editor"
          );
          if (suggestionMarkdownEle) {
            suggestionMarkdownEle = suggestionMarkdownEle.__vue__;

            let value = suggestionMarkdownEle.$attrs.value;
            if (value.length == 0) {
              return "==没有数据=="
            }
            return value;
          } else {
            // 先点一下错误
            document
              .querySelector(
                "#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-right > div > label:nth-child(2)"
              )
              .click();
            return "";
          }
        },
        setSuggestion(new_suggestion) {
          let suggestionMarkdownEle = document.querySelector(
            "div.suggestion-content > div.markdown-editor"
          ).__vue__;

          suggestionMarkdownEle.$attrs.value = new_suggestion;
          suggestionMarkdownEle.$forceUpdate();
        },
        del_suggestion_empty_line() {
          let value = this.get_suggestion();
          if (value.length == 0) {
          } else {
            // 去掉开头的空格
            value = value.trim();

            // 将连续的多个换行符替换为一个换行符
            value = value.replace(/\n+/g, "\n");
            this.setSuggestion(value);
          }
        },
      },
    };
    var Ctor = Vue.extend(Main);
    new Ctor().$mount(".suggestion-select");
  }
}

function findSubmitTemplateElement() {
  // 定义函数以查找元素
  const element = document.querySelectorAll(".my-submit-btn");
  const dialog_header = document.querySelector(".el-dialog__header");
  const decode_btn = document.querySelector(
    "#__qiankun_microapp_wrapper_for_qgpt_mp_data_management__ > div > span > button"
  );
  if (decode_btn && element && !dialog_header) {
    console.log("渲染模版提交按钮");
    new Vue({
      el: "#submit-template", // 挂载点
      data: function () {
        return {
          visible: false,
          sumbitLoading: false,
          templateData: {
            mark_id: "",
            rule_id: "",
            alert_id: "",
            req_headers: "",
            req_body: "",
            res_headers: "",
            res_body: "",
            pay_load: "",
            alert_name: document.querySelectorAll("#copy_id")[4]?.textContent,
            alert_analysis: "",
            alert_suggestion: "",
          },
          login_token: login_token,
          BACKURL: BACKURL, // 服务端地址
          username: username,
          password: password,
        };
      },
      methods: {
        getJudgementAndSuggention() {
          this.templateData.mark_id = this.get_mark_id();
          this.templateData.rule_id = this.get_rule_id();
          this.templateData.alert_id = this.get_alert_id();
          try {
            this.templateData.req_headers = this.get_req_headers();
          } catch (err) {
            console.error("Error in get_req_headers:", err);
            this.templateData.req_headers = "不存在请求头~"
          }
          try {
            this.templateData.req_body = this.get_req_body();
          } catch (err) {
            console.error("Error in get_req_body:", err);
            this.templateData.req_body = "不存在请求体~"
          }
          try {
            this.templateData.res_headers = this.get_res_headers();
          } catch (err) {
            console.error("Error in get_res_headers:", err);
            this.templateData.res_headers = "不存在响应头~"
          }
          try {
            this.templateData.res_body = this.get_res_body();
          } catch (err) {
            console.error("Error in get_res_body:", err);
            this.templateData.res_body = "不存在响应体"
          }
          try {
            this.templateData.pay_load = this.get_pay_load();
          } catch (err) {
            console.error("Error in pay_load:", err);
            this.templateData.pay_load = "不存在载荷~";
          }

          this.templateData.alert_name =
            document.querySelectorAll("#copy_id")[4]?.textContent;
          this.templateData.alert_analysis = this.get_judgement();

          this.templateData.alert_suggestion = this.get_suggestion();
          //console.log(this.templateData);
        },
        onSubmit() {
          console.log(this.templateData.alert_name);
          this.sumbitLoading = true;
          let user = document
            .querySelector(
              "body > div.qp-hostapp > div.qp-layout.layout-hybrid > header > div.qp-layout__toolbar > div > div > div > div > div > div > span"
            )
            .textContent.trim();
          let template_data = {
            user: user,
            pay_load: this.templateData.pay_load,
            mark_id: this.templateData.mark_id,
            rule_id: this.templateData.rule_id,
            alert_id: this.templateData.alert_id,
            req_headers: this.templateData.req_headers,
            req_body: this.templateData.req_body,
            res_headers: this.templateData.res_headers,
            res_body: this.templateData.res_body,
            alert_name: this.templateData.alert_name,
            alert_analysis: this.templateData.alert_analysis,
            alert_suggestion: this.templateData.alert_suggestion,
            from_js: 1,
          };
          // this.checkToken()
          console.log("准备提交的数据：", template_data);
          console.log("登录获取token");
          var apiUrl = this.BACKURL + "/user/login";
          console.log("用户名和密码: ");

          var userData = {
            username: this.username,
            password: this.password,
          };
          console.log(userData);

          // 发送POST请求
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              let token = data.data.token; // 获取返回的token
              // 这里可以使用token进行后续的操作，比如存储在本地以备将来使用
              console.log("登录获取到的Token:", token);
              // 你可以将token存储在本地，如localStorage，以备将来使用
              localStorage.setItem("login-token", token);
              this.login_token = token;
            })
            .then(() => {
              // 调用 Flask 接口，提交数据
              console.log("模版提交的token：", this.login_token);
              fetch(this.BACKURL + "/alert/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Token": this.login_token,
                },
                body: JSON.stringify(template_data),
              })

                .then((response) => response.json())
                .then((data) => {
                  // 处理成功响应，例如提示用户或者其他操作
                  console.log("数据已提交:", data);
                  this.$message.success({
                    message: "模版提交成功",
                  });
                  this.sumbitLoading = false;
                  this.visible = false;
                })
                .catch((error) => {
                  // 处理错误
                  console.error("提交出错:", error);
                  this.$message.error({
                    message: "模版提交失败：" + error,
                  });
                });
            })
            .catch((error) => {
              console.error(
                "There has been a problem with your fetch operation:",
                error
              );
            });
        },
        handleClose(done) {
          this.$confirm("确认关闭？")
            .then((_) => {
              done();
            })
            .catch((_) => { });
        },
        get_judgement() {
          let judgementMarkdownEle = document.querySelector(
            "#pane-first-instance > div > div.ai-judgment > div.ai-judgment-content > div.markdown-editor"
          );
          console.log("获取到的分析元素: ", judgementMarkdownEle);
          if (judgementMarkdownEle) {
            judgementMarkdownEle = judgementMarkdownEle.__vue__;
            let value = judgementMarkdownEle.$attrs.value;
            console.log("获取到的分析: ", value);
            return value;
          } else {
          }
          // 先点一下编辑
          document
            .querySelector(
              "#pane-first-instance > div > div.ai-judgment > div.ai-judgment-title > div > div:nth-child(2) > button"
            )
            .click();
          return "";
        },
        get_mark_id() {
          let markidEle = document.querySelector(
            ".reviewer"
          );
          console.log("获取到的markid元素: ", markidEle);
          let value = markidEle.querySelector("span:nth-child(2)").innerText;
          console.log("获取到的markid: ", value);
          return value
        },
        get_rule_id() {
          let ruleidEle = document.querySelector(
            ".base-main table tr:nth-child(6) td div#copy_id span"
          );
          console.log("获取到的ruleid元素: ", ruleidEle);
          let value = ruleidEle.innerText;
          console.log("获取到的ruleid: ", value);
          return value;
        },
        get_alert_id() {
          let alertidEle = document.querySelector(
            ".base-main table tr td div#copy_id span"
          );
          console.log("获取到的alertid元素: ", alertidEle);
          let value = alertidEle.innerText;;
          console.log("获取到的alertid: ", value);
          return value;
        },
        get_req_headers() {
          let req_hEle = document.querySelector(
            ".base-main div:nth-child(3) .detail-raw:nth-child(2) pre"
          );
          console.log("获取到的req_h元素: ", req_hEle);
          let value = req_hEle.innerText;
          console.log("获取到的req_h: ", value);
          return value;
        },
        get_req_body() {
          let res_bEle = document.querySelector(
            ".base-main div:nth-child(3) div.detail-raw:nth-of-type(2) pre"
          );
          console.log("获取到的req_b元素: ", res_bEle);
          let value = res_bEle.innerText;
          console.log("获取到的req_b: ", value);
          return value;
        },

        get_pay_load() {
          // 获取所有的span标签
          const spanElements = document.querySelectorAll("span.packet-col-num");
          let result = "";
          let count = 0;
          // 遍历每个span标签
          spanElements.forEach(span => {
            const data = span.textContent; // 获取span标签内的数据
            result += data; // 拼接数据
            count++;
            if (count === 8) {
              count = 0;
            }
          });
          console.log("十六进制数据：", result); // 输出结果
          const spans = document.getElementsByClassName("packet-col-cell");
          // 创建一个空字符串来存储拼接后的数据
          let data1 = "";
          // 遍历所有的span元素并将其内容拼接到data字符串中
          for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            data1 += span.textContent; // 将span元素的文本内容拼接到data字符串中
          }
          console.log("ASCII数据：", data1); // 打印获取到的数据
          let value = "";
          let dataIndex = 0;
          let resultIndex = 0;
          // 按照每8个result数据再显示8个data1数据的方式拼接数据
          while (resultIndex < result.length) {
            let resultGroup = "";
            let dataGroup = "";
            for (let i = 0; i < 16; i++) {
              if (resultIndex < result.length) {
                resultGroup += result[resultIndex++];
                if (i % 2 !== 0) {
                  resultGroup = resultGroup + " ";
                }
              } else {
                resultGroup += " ";
              }
            }
            let resultCount = resultGroup.trim().split(" ").length;
            let spaceCount = 8 - resultCount;
            resultGroup += " ".repeat(3 * spaceCount);
            for (let i = 0; i < 8; i++) {
              if (dataIndex < data1.length) {
                dataGroup += data1[dataIndex++];
                dataGroup = dataGroup + " ";
              } else {
                dataGroup += " ";
              }
            }
            value += resultGroup + "              " + dataGroup + "\n";
          }
          if (value === "") {
            value = "不存在载荷~"
          }
          return value;
        },
        get_res_headers() {
          let res_hEle = document.querySelector(
            ".base-main div:nth-child(3) div.detail-raw:nth-of-type(3) pre"
          );
          console.log("获取到的res_h元素: ", res_hEle);
          let value = res_hEle.innerText;
          console.log("获取到的res_h: ", value);
          return value;
        },
        get_res_body() {
          let res_bEle = document.querySelector(
            ".base-main div:nth-child(3) div.detail-raw:nth-of-type(4) pre"
          );
          console.log('获取到的res_b元素: ', res_bEle);
          let value = res_bEle.innerText;
          console.log('获取到的res_b: ', value);
          return value;
        },
        get_suggestion() {
          let suggestionMarkdownEle = document.querySelector(
            "div.suggestion-content > div.markdown-editor"
          );
          if (suggestionMarkdownEle) {
            suggestionMarkdownEle = suggestionMarkdownEle.__vue__;

            let value = suggestionMarkdownEle.$attrs.value;
            //console.log("获取到的建议: ", value);
            return value;
          } else {
            // 先点一下错误
            document
              .querySelector(
                "#pane-first-instance > div > div.suggestion > div.suggestion-header > div > div.item-header-right > div > label:nth-child(2)"
              )
              .click();
            return "";
          }
        },
      },
    });
  }
}

var markTool = new MarkTool();

(function () {
  "use strict";
  addElementUICSS();
  markTool.run();
  //调用函数开始查找
  window.setInterval(function () {
    if (window.location.href.indexOf("/mark-data/list/check/") != -1) {
      findSubmitTemplateElement();
      findSuggestionSelectElement();
    }
  }, 1000);
})();
