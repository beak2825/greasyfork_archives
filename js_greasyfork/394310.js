// ==UserScript==
// @name         粉笔网刷题宝
// @namespace    http://tampermonkey.net/
// @version      0.0.52
// @author       binyellow
// @icon         https://nodestatic.fbstatic.cn/weblts_spa_online/page/assets/fenbi32.ico
// @defaulticon  粉笔网优化布局，清屏快速生成pdf
// @match        *.fenbi.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @description 粉笔网优化布局，清屏快速生成pdf
// @downloadURL https://update.greasyfork.org/scripts/394310/%E7%B2%89%E7%AC%94%E7%BD%91%E5%88%B7%E9%A2%98%E5%AE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/394310/%E7%B2%89%E7%AC%94%E7%BD%91%E5%88%B7%E9%A2%98%E5%AE%9D.meta.js
// ==/UserScript==

(async function ($) {
  'use strict';

  const processCls = `__binyellow__processed__`;
  function processElements(selector, callback) {
    function checkForMatchingNode(nodes) {
      for (const node of nodes) {
        if (node.matches && node.matches(selector)) {
          callback(node);
          return true;
        }
        if (node.querySelectorAll) {
          const matchingDescendant = node.querySelector(selector);
          if (matchingDescendant) {
            callback($(matchingDescendant));
            return true;
          }
        }
      }
      return false;
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          if (checkForMatchingNode(mutation.addedNodes)) {
            observer.disconnect();
            break;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  const mokao = () => {
    processElements(".exam-post-nav", (node) => {
      $(node).css({ left: 0, top: 0 });
      const detailContent = $(".solution-detail.clear-float");
      $(detailContent).css({ width: "100%" });
      const optionsUl = $(detailContent).find(".options.ng-star-inserted");
      $(optionsUl).css({ display: "flex", "justify-content": "space-between", "flex-wrap": "wrap" });
      optionsUl.children().css("margin", "0");
      $(detailContent).find(".exam-main-content.ng-tns-c3-0.ng-star-inserted").css({ width: "calc(100% - 302px)" });
      $(".practice-header").hide();
      $(detailContent).find(".solu-detail.ng-star-inserted").css({ margin: 0, padding: 0 });
      $(detailContent).find(".nav-coll-divider.solu-divider").css({ margin: "6px 0" });
      $(detailContent).find(".question-content > p:nth-child(2) > img").each(function() {
        var img = $(this);
        var width = img.width() || 0;
        var height = img.height() || 0;
        var newWidth = width * 0.6;
        var newHeight = height * 0.6;
        img.width(newWidth);
        img.height(newHeight);
      });
    });
  };
  const caogao = () => {
    processElements(".draft-icon", () => {
      $(".draft-icon").on("click", function() {
        console.log("draft-icon 被点击");
        $(document).on("keydown", function(event) {
          if (event.key === "Escape" || event.keyCode === 27) {
            $(".tool-item.exit").trigger("click");
            $(document).off("keydown");
          }
        });
      });
    });
  };
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const customExamUrlsKey = "__custom-exam-urls-key__";
  const customExamQuestionTypesKey = "__custom-exam-question-types-key__";
  const customExamContentsKey = "__custom-exam-contents-key__";
  const customExamMatchContent = "__custom-exam-match-content__";
  const getLinks = async () => _GM_getValue(customExamUrlsKey, []);
  const setLinks = async (link) => {
    await _GM_setValue(customExamUrlsKey, link);
  };
  const getOptions = async () => await _GM_getValue(customExamQuestionTypesKey);
  const setOptions = async (options) => {
    await _GM_setValue(customExamQuestionTypesKey, options);
  };
  const setContents = async (content) => {
    try {
      const pre = await getContents();
      await _GM_setValue(customExamContentsKey, [...pre, content]);
    } catch (error) {
      console.log(`setContent Error===>`, error);
      clearCustom();
    }
  };
  const getContents = async () => await _GM_getValue(customExamContentsKey);
  const getMatchContent = async () => await _GM_getValue(customExamMatchContent, "");
  const setMatchContent = async (content) => {
    await _GM_setValue(customExamMatchContent, content);
  };
  const clearCustom = async () => {
    await setLinks([]);
    await setOptions([]);
    await _GM_setValue(customExamContentsKey, []);
    await setMatchContent("");
    await _GM_setValue(cacheExamNameFLag, false);
    await _GM_setValue(cacheExamName, void 0);
    await _GM_setValue(pdfExamNameArr, []);
  };
  const xhrInterceptor = (rules, cb, resCb) => {
    const originalXHR = _unsafeWindow.XMLHttpRequest;
    _unsafeWindow.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      xhr.open = function() {
        const method = arguments[0];
        const url = arguments[1];
        const matchedRule = rules.find((rule) => {
          if (typeof rule.url === "string") {
            return rule.url === url && (!rule.method || rule.method === method);
          } else if (rule.url instanceof RegExp) {
            return rule.url.test(url) && (!rule.method || rule.method === method);
          } else {
            return false;
          }
        });
        if (matchedRule) {
          console.log("XHR request: " + method + " " + url);
          this._url = url;
          this._method = method;
        }
        originalOpen.apply(this, arguments);
      };
      const originalSend = xhr.send;
      xhr.send = function() {
        const body = arguments[0];
        if (this._url) {
          console.log(`send===>`, arguments, this._headers);
          this._body = body;
          console.log("XHR request body: " + body, this._url, this._headers);
          cb({
            url: this._url,
            method: this._method,
            body: this._body,
            headers: this._headers
          });
        }
        originalSend.apply(this, arguments);
      };
      const originalSetRequestHeader = xhr.setRequestHeader;
      xhr.setRequestHeader = function(header, value) {
        if (this._url) {
          if (!this._headers) {
            this._headers = {};
          }
          this._headers[header] = value;
        }
        originalSetRequestHeader.apply(this, arguments);
      };
      const originalOnReadyStateChange = xhr.onreadystatechange;
      xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this._url) {
          resCb == null ? void 0 : resCb({
            url: this._url,
            method: this._method,
            body: this._body,
            headers: this._headers,
            status: this.status,
            statusText: this.statusText,
            responseText: this.responseText,
            response: JSON.parse(this.response),
            responseHeaders: this.getAllResponseHeaders()
          });
        }
        originalOnReadyStateChange == null ? void 0 : originalOnReadyStateChange.apply(this, arguments);
      };
      return xhr;
    };
  };
  const kuaiSuShuaTiKey = "__kuaiSuShuaTiKey__";
  const cacheExamNameFLag = "__cache_exam_name_flag__";
  const cacheExamName = "__cache_exam_name__";
  const pdfExamNameArr = "__pdf_exam_name_arr__";
  const setPdfNameArr = async (name) => {
    const preNameArr = await _GM_getValue(pdfExamNameArr, []);
    await _GM_setValue(pdfExamNameArr, [...preNameArr, name]);
  };
  const getPdfNameArr = async () => {
    return await _GM_getValue(pdfExamNameArr, []);
  };
  const genPdfName = async () => {
    var _a, _b;
    const nameArr = await getPdfNameArr();
    let years = [];
    const gmOptions = await getOptions();
    for (let i = 0; i < nameArr.length; i++) {
      let year = (_b = (_a = nameArr == null ? void 0 : nameArr[i]) == null ? void 0 : _a.match(/\d+/)) == null ? void 0 : _b[0];
      years.push(year);
    }
    const optionAddon = gmOptions ? "-" + (gmOptions == null ? void 0 : gmOptions.join("-")) : "";
    let result = years.join("-") + "年" + optionAddon;
    return result;
  };
  const jiankong = async () => {
    jiankongKuaiSuLianXi();
    await jianKongCustomName();
  };
  const jiankongKuaiSuLianXi = () => {
    const rules = [
      {
        url: "https://tiku.fenbi.com/api/xingce/exercises?app=web&kav=100&av=100&hav=100&version=3.0.0.0",
        method: "POST"
      }
    ];
    const callback = (config) => {
      _GM_setValue(kuaiSuShuaTiKey, config);
    };
    xhrInterceptor(rules, callback);
  };
  const jianKongCustomName = async () => {
    const flag = await _GM_getValue(cacheExamNameFLag);
    if (flag) {
      const rules = [
        {
          url: new RegExp("https://tiku.fenbi.com/api/xingce/exercises/*"),
          method: "GET"
        }
      ];
      const callback = (config) => {
        var _a, _b, _c, _d;
        const name = (_b = (_a = config == null ? void 0 : config.response) == null ? void 0 : _a.sheet) == null ? void 0 : _b.name;
        _GM_setValue(cacheExamName, (_d = (_c = config == null ? void 0 : config.response) == null ? void 0 : _c.sheet) == null ? void 0 : _d.name);
        setPdfNameArr(name);
      };
      xhrInterceptor(rules, () => {
      }, callback);
    }
  };
  const request = (props) => {
    const { body, ...rest } = props;
    return new Promise((resolve) => {
      _GM_xmlhttpRequest({
        onload: (data) => {
          resolve(data);
        },
        method: "POST",
        data: typeof body === "object" && !(body instanceof FormData) ? JSON.stringify(body) : body,
        ...rest
      });
    });
  };
  const lianxiUrl = `https://www.fenbi.com/spa/tiku/exam/practice/xingce/xingce`;
  function shenlun() {
    const leftSubject = $(".zhenti-body-left.zhenti-body-part.bg-color-gray-light5");
    leftSubject.find(".materials-container").css({ width: "100%", padding: 12 });
    leftSubject.find(".material-content.ng-tns-c41-0").css({ width: "100%" });
    leftSubject.find(".material-content.ng-tns-c41-0").find("#material").css({ width: "100%" });
    const rightAnser = $(".zhenti-body-right.zhenti-body-part");
    rightAnser.css({ flex: "none" });
    rightAnser.find(".questions-container").css({ "padding-left": "12px" });
  }
  const kuaisu = () => {
    processElements("main.exam-content", () => {
      const css = `
    .solu-list-item.video-item fb-ng-solution-detail-item,
    .bg-color-gray-light2.border-gray-light3.font-color-gray-mid.expend-btn,
    .simple-nav-header.bg-color-gray-bold,
    .nav-coll-divider,
    .solu-answer-text.clear-float {
      display: none
    }
    
    main.exam-content {
      margin: 0 !important
    }
    
    .options.choice-options.font-color-gray-mid {
      display: flex
    }
    
    .solu-list.border-gray-light4 {
      margin-top: 0
    }
    
    .solu-list-item.video-item {
      margin-bottom: 0
    }
    
    .fb-collpase-bottom {
      width: calc(100% - 1024px);
      right: 0;
    }
    
    .fb-collpase-bottom.bg-color-gray-mid {
      margin: 0;
      width: 100% !important
    }
    
    .fixedActions.bg-color-gray-bold {
      right: 0
    }
    `;
      _GM_addStyle(css);
      shenlun();
    });
    processElements(".fb-question-material", () => {
      $(".fb-question-material").css({ margin: 12 });
      $(".material-content").css({ padding: 0 });
      $(".ques-options-dry").css({ padding: 0 });
      $(".options.font-color-gray-mid").css({ display: "flex", "flex-flow": "wrap" });
    });
    processElements(".solution-item.bg-color-gray-bold", (node) => {
      const solution = $(node).find(".solu-list.border-gray-light4");
      $(solution).css({ padding: 8 });
      $(solution).find("fb-ng-solution-detail-answer").hide();
    });
    processElements(
      ".solution-item.bg-color-gray-bold>app-fb-solution>fb-ng-solution > div[_ngcontent-fenbi-web-exams-c75] > div[_ngcontent-fenbi-web-exams-c75]",
      (node) => {
        node.css({ position: "absolute", right: 0 });
      }
    );
    processElements(".options.font-color-gray-mid", (node) => {
      node.css({ display: "flex", "flex-flow": "wrap", "justify-content": "space-between" });
    });
    processElements("app-report-header-test .exam-report", () => {
      $(".fixedActions.bg-color-gray-bold").removeClass(processCls);
      processElements(".fixedActions.bg-color-gray-bold", () => {
        var newButton = $("<button>重刷</button>");
        $(".fixedActions.bg-color-gray-bold").children().first().before(newButton);
        newButton.on("click", async function() {
          const requestConfig = await _GM_getValue(kuaiSuShuaTiKey, null);
          const data = await request(requestConfig);
          const { id } = JSON.parse(data == null ? void 0 : data.response);
          location.href = `${lianxiUrl}/${id}/2`;
        });
      });
    });
  };
  const dealWidth = () => {
    const cssRules = `
@media (max-width: 1000px) {
.exam-content {
  width: calc(100% - 45px) !important;
}
#app-practice {
  min-width: 100% !important;
}
.tools-container {
left: 0;
}
.fb-collpase-bottom {
left: 0;
width: 100% !important;
}
}

@media (min-width: 1700px) {
  main.exam-content {
    width: 1600px !important;
  }

  aside.fb-collpase-bottom {
    width: calc(100% - 1600px) !important;
  }
}

.collapse-content {
}

.collapse-title {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}

.extra-dom {
  position: fixed;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px;
  box-sizing: content-box;
}

.extra-dom input[type=number] {
  width: 100%;
}
`;
    const styleTag = document.createElement("style");
    styleTag.innerHTML = cssRules;
    document.head.appendChild(styleTag);
  };
  function genQuestionTypes() {
    const options = [];
    $(".chapter-control-item").each(function() {
      const label = $(this).find(".font-color-gray-blod").text().slice(0, 2);
      const items = $(this).children("div").children().length;
      const rangeStart = options.length > 0 ? options[options.length - 1].range[1] + 1 : 1;
      const rangeEnd = rangeStart + items - 1;
      options.push({ label, range: [rangeStart, rangeEnd] });
    });
    return options;
  }
  const modalHtml = `
  <div class="modal" tabindex="-1" role="dialog" id="myModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">输入考试链接和选择选项</h3>
          <span type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">
              <svg t="1701174403239" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8094" width="24" height="24"><path d="M557.312 513.248l265.28-263.904c12.544-12.48 12.608-32.704 0.128-45.248-12.512-12.576-32.704-12.608-45.248-0.128l-265.344 263.936-263.04-263.84C236.64 191.584 216.384 191.52 203.84 204 191.328 216.48 191.296 236.736 203.776 249.28l262.976 263.776L201.6 776.8c-12.544 12.48-12.608 32.704-0.128 45.248 6.24 6.272 14.464 9.44 22.688 9.44 8.16 0 16.32-3.104 22.56-9.312l265.216-263.808 265.44 266.24c6.24 6.272 14.432 9.408 22.656 9.408 8.192 0 16.352-3.136 22.592-9.344 12.512-12.48 12.544-32.704 0.064-45.248L557.312 513.248z" p-id="8095" fill="#707070"></path></svg>
            </span>
          </span>
        </div>
        <div class="modal-body">
          <form id="myForm">
            <div class="form-group">
              <label for="examLink" class="sub-title">考试链接</label>
              <div class="input-group">
                <textarea class="form-control" id="examLink" rows="5" placeholder="输入考试链接，多个可回车输入"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="sub-title">题干关键字</label>
              <div class="input-group regex">
                <input class="form-control" id="question-keywords" placeholder="输入题干关键字，可输入正则；如你想排除 aaa 之外的题干，可写入正则 /^(?!.*aaa).*$/"></input>
                <span>/^(?!.*aaa).*$/</span>
              </div>
            </div>
            <div class="form-group">
              <label class="sub-title">是否显示考试name</label>  
              <input type="checkbox" id="option-display-exam-name" name="display-exam-name" value="言语" checked>
            </div>
            <div class="form-group">
              <label class="sub-title">选择选项</label><br>
              <div class="exam-type">
                <div><input type="checkbox" id="option1" name="options" value="言语" checked><label for="option1">言语</label></div>
                <div><input type="checkbox" id="option2" name="options" value="数量" checked><label for="option2">数量</label></div>
                <div><input type="checkbox" id="option3" name="options" value="判断" checked><label for="option3">判断</label></div>
                <div><input type="checkbox" id="option4" name="options" value="资料" checked><label for="option4">资料</label></div>
                <div><input type="checkbox" id="option5" name="options" value="常识"><label for="option5">常识</label></div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="submitForm">确认</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" class="close">关闭</button>
        </div>
      </div>
    </div>
  </div>`;
  const modalCss = `
  <style>
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-title {
      font-size: 18px;
    }
    .sub-title {
      margin-top: 8px;
      display: inline-block;
      font-weight: bold;
      font-size: 17px;
    }
    .modal-content {
      background-color: #fefefe;
      margin: 100px auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      position: relative;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 20px;
      font-weight: bold;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }

    .exam-link-delete {}

    #examLink,#question-keywords {
      width: 100%;
    }

    .exam-type {
      display: flex;
      gap: 18px;
    }

    .regex {
      display: flex;
      gap: 8px;
    }
  </style>`;
  const bodyStyle = (inputValue, fontValue) => `<style>
  .fixedActions.bg-color-gray-bold,.fb-collpase-bottom, app-side-tool,.fb-question > div:last-child[_ngcontent-fenbi-web-exams-c68],div[_ngcontent-fenbi-web-exams-c69] > div[_ngcontent-fenbi-web-exams-c69],.content.font-color-gray-mid>p.ques-type {
  display: none;
  }

  .fb-question-options.fenbi-ng-utils > div[_ngcontent-fenbi-web-exams-c40],div.ques-options-dry {
padding: 16px 0 0 0;
margin-bottom: ${inputValue}px;
  }

  .options.font-color-gray-mid {
display: flex;
justify-content: space-between;
flex-wrap: wrap;
  }

  .options.font-color-gray-mid > li {
margin: 0 !important;
  }
  [_nghost-fenbi-web-exams-c40] p, [_nghost-fenbi-web-exams-c40] .options-material {
  font-weight: normal;
  font-size: ${fontValue}px;
  }

  main.exam-content {
margin-right: 35px !important;
  }
  .material-nav.bg-color-gray-light {
  display: none;
  }
  </style>`;
  function escapeRegExp(string) {
    const [pattern, flags] = string.match(/^\/(.*)\/([a-z]*)$/).slice(1);
    const reg = new RegExp(pattern, flags);
    return reg;
  }
  function matchElement($element, matchContent) {
    if (matchContent instanceof RegExp) {
      if (matchContent.test($element.text())) {
        $element.show();
      } else {
        $element.hide();
      }
    } else if ($element.text().match(matchContent)) {
      $element.show();
    } else {
      $element.hide();
    }
  }
  const isExam = () => {
    const { pathname } = location;
    return pathname.slice(pathname.lastIndexOf("/") + 1) === "3";
  };
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function isImageLoaded(img) {
    if (!img.complete) {
      return false;
    }
    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
      return false;
    }
    return true;
  }
  async function scrollToNextImage() {
    var _a, _b;
    const images = $("#app-practice img").toArray().sort((a, b) => {
      var _a2, _b2;
      const aTop = ((_a2 = $(a).offset()) == null ? void 0 : _a2.top) ?? 0;
      const bTop = ((_b2 = $(b).offset()) == null ? void 0 : _b2.top) ?? 0;
      return aTop - bTop;
    });
    const filteredImages = images.filter((image, index) => {
      var _a2, _b2;
      if (index > 0) {
        const prevImage = images[index - 1];
        return (((_a2 = $(image).offset()) == null ? void 0 : _a2.top) ?? 0) !== (((_b2 = $(prevImage).offset()) == null ? void 0 : _b2.top) ?? 0);
      }
      return true;
    });
    const scrollContainer = $("#fenbi-web-exams");
    for (const image of filteredImages) {
      if (!isImageLoaded(image)) {
        await new Promise((resolve) => {
          $(image).on("load", function() {
            resolve();
          });
        });
      }
      const imagePositionInContainer = (((_a = $(image).offset()) == null ? void 0 : _a.top) ?? 0) - (((_b = scrollContainer.offset()) == null ? void 0 : _b.top) ?? 0) + (scrollContainer.scrollTop() ?? 0);
      await new Promise((resolve) => {
        scrollContainer.animate(
          {
            scrollTop: imagePositionInContainer
          },
          50,
          function() {
            resolve();
          }
        );
      });
      await delay(100);
    }
  }
  const customExamUrls = await( getLinks());
  const fixedActions = () => {
    let options = [];
    processElements(".chapter-control-item > div:nth-child(2) > fb-ng-ans-button", async () => {
      console.timeEnd("答题卡");
      options = genQuestionTypes();
      var clearScreenButton = $("<button>清屏</button>");
      const marginLabel = '<label for="ti-jian-ju">题间距</label>';
      var newInput = $('<input id="ti-jian-ju" type="number" value="180">');
      const fontLabel = '<label for="zi-ti">字体</label>';
      const fontInput = $('<input id="zi-ti" type="number" value="20">');
      const $settingContainer = $(`<div class="collapse">
  <a class="collapse-title">设置></a>
  <div class="collapse-content">
  </div>
</div>`);
      $settingContainer.find(".collapse-content").append(marginLabel, newInput, fontLabel, fontInput);
      const $checkboxContainer = $(`<div class="collapse">
  <a class="collapse-title">题型></a>
  <div class="collapse-content">
  </div>
</div>`);
      await options.forEach(async (option, index) => {
        let isChecked;
        const gmOptions = await getOptions();
        if (gmOptions == null ? void 0 : gmOptions.length) {
          isChecked = gmOptions == null ? void 0 : gmOptions.includes(option.label);
        } else {
          isChecked = option.label !== "常识";
        }
        const $checkbox = $(`<input type="checkbox" id="option-${index}" ${isChecked ? "checked" : ""} />`);
        const $label = $(`<label for="option-${index}">${option.label}</label>`);
        $checkboxContainer.find(".collapse-content").append($checkbox, $label);
      });
      const customBtn = $('<button id="showModal">自定义</button>');
      if (isExam()) {
        $(".fixedActions.bg-color-gray-bold").children().first().before($checkboxContainer);
      }
      const fixedActions2 = $(".fixedActions.bg-color-gray-bold");
      const width = fixedActions2.outerWidth() || 0;
      const extraDom = $("<div>", { class: "extra-dom" });
      extraDom.css({
        right: width + 4,
        top: "10vh",
        width: width + 6
      });
      extraDom.append(clearScreenButton, $settingContainer, $checkboxContainer);
      if (isExam()) {
        extraDom.append(customBtn);
      }
      $("body").append(extraDom);
      addCustomBtn();
      $(".collapse-title").on("click", function() {
        $(this).next(".collapse-content").slideToggle();
      });
      clearScreenButton.on("click", async function() {
        if (isExam()) {
          $(".exam-detail.bg-color-gray-bold > div").hide();
          const matchExamContent = await getMatchContent();
          options.forEach((option, index) => {
            const $checkbox = $(`#option-${index}`);
            if ($checkbox.prop("checked")) {
              const [start, end] = option.range;
              $(".exam-detail.bg-color-gray-bold > div").each(function(i) {
                const $element = $(this);
                if (i >= start - 1 && i < end) {
                  if (matchExamContent) {
                    let regMatchExamContent;
                    try {
                      regMatchExamContent = escapeRegExp(matchExamContent);
                    } catch (error) {
                      console.error(`RegExp error: ${error}`);
                      regMatchExamContent = matchExamContent;
                    }
                    matchElement($element, regMatchExamContent);
                  } else {
                    $element.show();
                  }
                }
              });
            }
          });
        }
        await scrollToNextImage();
        var examContent = $("main.exam-content").html();
        var inputValue = newInput.val();
        var fontValue = fontInput.val();
        const indexOfLink = customExamUrls == null ? void 0 : customExamUrls.indexOf(location.href);
        if (indexOfLink >= 0) {
          customExamUrls.splice(indexOfLink, 1);
          const examName = await _GM_getValue(cacheExamName);
          if (examName) {
            const examLink = $(
              `<a href=${location.href} target="_blank" style="margin-bottom: 8px; text-align: center; font-size: 18px; width: 100%;display: inline-block; ">`
            ).text(examName);
            $("main.exam-content").prepend(examLink);
            examContent = $("main.exam-content").html();
            console.log("examContent===>", examContent);
          }
          $("body").empty();
          await setContents(examContent);
          const newContents = await getContents();
          console.log(`设置content===>`, examContent, newContents);
          if ((customExamUrls == null ? void 0 : customExamUrls.length) > 0) {
            location.href = customExamUrls[0];
          } else {
            const gmContents = await getContents();
            appendExamContent(gmContents, inputValue, fontValue);
          }
          await setLinks(customExamUrls);
        } else {
          $("body").empty();
          appendExamContent(examContent, inputValue, fontValue);
        }
      });
      const link = await getLinks();
      if (link == null ? void 0 : link.length) {
        clearScreenButton.click();
      }
    });
  };
  const addCustomBtn = () => {
    $("head").append(modalCss);
    $("body").append(modalHtml);
    $("#showModal").on("click", function() {
      $("#myModal").show();
    });
    $("#submitForm").on("click", async function() {
      var _a;
      let links = [];
      const selectedOptions = [];
      const examLink = $("#examLink").val();
      if (examLink) {
        const inputLinks = (_a = examLink == null ? void 0 : examLink.split("\n")) == null ? void 0 : _a.filter((en) => en.trim());
        links = inputLinks;
        $("#examLink").val("");
      }
      $("input[name='options']:checked").each(function() {
        selectedOptions.push($(this).val());
      });
      const matchExamContent = $("#question-keywords").val();
      console.log("考试链接:", links);
      await setLinks(links);
      console.log("选中的选项:", selectedOptions);
      await setOptions(selectedOptions);
      await setMatchContent(matchExamContent);
      await _GM_setValue(cacheExamNameFLag, $("#option-display-exam-name").prop("checked"));
      $("#myModal").hide();
      if ((links == null ? void 0 : links.length) > 0)
        location.href = links[0];
    });
    $(".close").on("click", () => {
      $("#myModal").hide();
    });
    $("#myForm").on("submit", function(event) {
      event.preventDefault();
    });
  };
  const appendExamContent = async (content, inputValue, fontValue) => {
    if (Array.isArray(content)) {
      content == null ? void 0 : content.forEach((en, index) => {
        $("body").append(en);
        if (index < content.length - 1) {
          $("body").append("<hr>");
        }
      });
    } else {
      $("body").append(content);
    }
    $("body").append(bodyStyle(inputValue, fontValue));
    $(".nav-coll-divider").hide();
    $(".fb-question>div:last-child > button").hide();
    const pdfName = await genPdfName();
    await _GM_setClipboard(pdfName, "text");
    await clearCustom();
  };
  const isReport = () => {
    var _a;
    return (_a = location.pathname) == null ? void 0 : _a.includes("/report/");
  };
  const isRightNumber = (value) => {
    const transNumber = Number(value);
    return !isNaN(transNumber) && transNumber !== Infinity && typeof transNumber === "number";
  };
  const optimizationResultPage = () => {
    if (isReport()) {
      const parentSelector = "app-report-keypoints .exam-report.bg-color-gray-bold";
      processElements(parentSelector, () => {
        addCollapseButton(parentSelector);
        expandResultTree();
        setCorrectRateColor();
      });
    }
  };
  const expandResultTree = () => {
    clickAll(".keypoint-tree-title");
    clickAll(".pd-sub-category-item");
    clickAll(".pd-item-name");
    addKeyItemClick(".pd-item-name");
  };
  const clickAll = (selector) => {
    var _a;
    const selectorVal = ((_a = $(`${selector},.expand`)) == null ? void 0 : _a.length) ? selector + ":not(.expand)" : selector + ".expand";
    $(selectorVal).each(function() {
      $(this).trigger("click");
    });
  };
  let currentIndex = 0;
  function scrollToMatchingKeyPoint(element) {
    var textToMatch = $(element).text().trim();
    var matchedKeyPoints = $(".keypoint-btn").filter(function() {
      return $(this).text().trim() === textToMatch;
    });
    const { length } = matchedKeyPoints;
    const doScroll = () => {
      var _a, _b, _c;
      const scrollContainer = $("#fenbi-web-exams");
      const index = currentIndex % length;
      const currentDom = (_a = $(matchedKeyPoints == null ? void 0 : matchedKeyPoints[index])) == null ? void 0 : _a.closest(".solution-item");
      var containerTop = ((_b = scrollContainer == null ? void 0 : scrollContainer.offset()) == null ? void 0 : _b.top) || 0;
      var top = getNumber((_c = currentDom == null ? void 0 : currentDom.offset()) == null ? void 0 : _c.top) - containerTop + getNumber(scrollContainer.scrollTop());
      scrollContainer.animate(
        {
          scrollTop: top
        },
        200,
        function() {
          currentIndex++;
        }
      );
    };
    if (length > 0) {
      if (currentIndex <= length - 1) {
        doScroll();
      } else {
        currentIndex = 0;
        doScroll();
      }
    }
  }
  function addKeyItemClick(selector) {
    $(selector).each(function() {
      $(this).on("click", function() {
        currentIndex = 0;
        const clickItem = this;
        scrollToMatchingKeyPoint(this);
        $(document).on("keydown", function(e) {
          if (e.which === 13) {
            scrollToMatchingKeyPoint(clickItem);
          }
        });
        $(this).on("blur", function() {
          $(document).off("keydown");
        });
      });
    });
  }
  const getNumber = (val) => {
    if (typeof val === "number" && !Number.isNaN(val)) {
      return val;
    }
    return 0;
  };
  const addCollapseButton = (parentSelector) => {
    const newElement = $('<button style="margin-left: 12px">展开/折叠</button>');
    newElement.on("click", expandResultTree);
    $(`${parentSelector} .font-color-gray-blod.report-keypoint-header`).append(newElement);
  };
  const setCorrectRateColor = () => {
    _GM_addStyle(`
    .red > span:nth-child(3) {
      color: red !important;
    }
  `);
    $(".pd-item-stat").each(function() {
      var _a, _b;
      const $pdItemStat = $(this);
      const correctRate = Number((_b = (_a = $pdItemStat == null ? void 0 : $pdItemStat.text()) == null ? void 0 : _a.match(/正确率(\d+)%/)) == null ? void 0 : _b[1]);
      if (isRightNumber(correctRate) && correctRate < 50) {
        $pdItemStat.addClass("red");
      }
    });
  };
  console.time("答题卡");
  kuaisu();
  caogao();
  mokao();
  fixedActions();
  optimizationResultPage();
  const initCbs = [];
  initCbs.push(dealWidth);
  initCbs.forEach((cb) => cb());
  jiankong();

})($);