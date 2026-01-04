// ==UserScript==
// @name         DesignKit Export Tool and Request Interceptor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add export functionality to DesignKit and intercept specific requests
// @match        https://www.designkit.com/design/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      webapi.designkit.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @require      https://cdn.tailwindcss.com
// @downloadURL https://update.greasyfork.org/scripts/541520/DesignKit%20Export%20Tool%20and%20Request%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/541520/DesignKit%20Export%20Tool%20and%20Request%20Interceptor.meta.js
// ==/UserScript==

!function() {
  "use strict";
  GM_addStyle("\n        #exportToolbar {\n            position: fixed;\n            top: 50px;\n            right: 20px;\n            background-color: white;\n            border: 1px solid #ccc;\n            padding: 10px;\n            z-index: 9999;\n            cursor: move;\n        }\n        #exportButton {\n            background-color: #4CAF50;\n            border: none;\n            color: white;\n            padding: 10px 20px;\n            text-align: center;\n            text-decoration: none;\n            display: inline-block;\n            font-size: 16px;\n            margin: 4px 10px 4px 2px;\n            cursor: pointer;\n        }\n\n        #settingButton {\n            background-color: #4CAF50;\n            border: none;\n            color: white;\n            padding: 10px 20px;\n            text-align: center;\n            text-decoration: none;\n            display: inline-block;\n            font-size: 16px;\n            margin: 4px 10px 4px 10px;\n            cursor: pointer;\n        }\n    ");
  const toolbar = $('<div id="exportToolbar"></div>'), settingButton = $('<button id="settingButton">设置</button>'), exportButton = $('<button id="exportButton">导出</button>');
  let backgroundConfig;
  toolbar.append(settingButton), toolbar.append(exportButton), $("body").append(toolbar), 
  localStorage.getItem("backgroundConfig") && (backgroundConfig = JSON.parse(localStorage.getItem("backgroundConfig")));
  let apiKey = localStorage.getItem("apiKey") || "";
  function showLoading(text = "加载中...") {
    const loadingHTML = `\n            <div id="loadingOverlay" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style="z-index:90000;">\n                <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>\n                <p class="text-white text-xl ml-3">${text}</p>\n            </div>\n        `, loadingOverlay = document.getElementById("loadingOverlay");
    if (null === loadingOverlay) {
      const div = document.createElement("div");
      div.innerHTML = loadingHTML, document.body.appendChild(div);
    } else loadingOverlay.querySelector("p").textContent = text;
  }
  function hideLoading() {
    $("#loadingOverlay").remove();
  }
  $("body").append('\n    <div id="settingDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">\n        <div class="bg-white p-8 rounded-lg w-1/2 shadow-lg">\n            <input id="apiKeyInput" type="text" placeholder="请输入 API Key" class="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />\n            <textarea id="configInput" class="w-full h-96 p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"></textarea>\n            <div class="flex justify-end space-x-4">\n                <button id="saveConfig" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">保存</button>\n                <button id="cancelConfig" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">取消</button>\n            </div>\n        </div>\n    </div>\n    ');
  let startX, startY, startLeft, startTop, isDragging = !1;
  toolbar.mousedown(function(e) {
    isDragging = !0, startX = e.clientX, startY = e.clientY, startLeft = parseInt(toolbar.css("left")), 
    startTop = parseInt(toolbar.css("top")), e.preventDefault();
  }), $(document).mousemove(function(e) {
    if (isDragging) {
      let newLeft = startLeft + e.clientX - startX, newTop = startTop + e.clientY - startY;
      toolbar.css({
        left: newLeft + "px",
        top: newTop + "px",
        right: "auto"
      });
    }
  }), $(document).mouseup(function() {
    isDragging = !1;
  });
  let currentDocumentId = function getUrlParam(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const results = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)").exec(url);
    return results ? results[2] ? decodeURIComponent(results[2].replace(/\+/g)) : "" : null;
  }("id");
  var backgroundConfigDemo = [ {
    name: "火哥",
    firstUrl: "https://xiuxiu-pro.meitudata.com/posters/48c2c86787135c8eb2362f72cf8859a4.jpg",
    url: "https://material-center.meitudata.com/material/image/63c4ecfda34e56790.jpg",
    prompt: '- Role: 创意写作大师 - Background: 用户希望对一段文字进行词汇上的微调，以适应小红书的口语化风格，同时保持原意不变。 - Profile: 你是一位语言专家，擅长语言变换和创意表达的写作高手，能够巧妙地替换词汇，让内容更接地气。 - Skills: 词汇替换技巧、创意思维、小红书风格把握。 - Goals: 设计一个流程，帮助用户在不改变原意的前提下，通过替换10%的词汇，使文本更加口语化，符合小红书的社区特色。 - Constrains: 替换的词汇需保持原句意思，字数相差不超过5%，风格需贴近小红书的轻松、亲切的社交氛围，类似“服装人”、“服装老板”、“服装老板娘”、“服装店主”这类的称呼不要换成其他的，就在这几个中随机替换。 - OutputFormat: 提供替换后的文本版本。特别注意，只回复替换后的文本,不要有其他内容或解释。 - Workflow: 1. 阅读并理解原始文本的内容和风格。 2. 确定需要替换的词汇，考虑小红书用户的喜好和常用表达。 3. 替换词汇，同时确保文本的流畅性和原意的传达，不要增加额外的意见，字数相差不超过5%。 - Examples: 原始文本："把这段话变得更加口语化，但不要改变意思。" 替换后的文本："让这句话听起来更接地气，同时保持原意哦。" - Initialization: 欢迎来到创意写作工坊！发送你想要变换的文本，让我们一起把它变得更加吸引人吧！'
  }, {
    name: "盯老师",
    url: "https://material-center.meitudata.com/material/image/63c4ecfda34e56790.jpg"
  } ];
  exportButton.click(function() {
    apiKey ? backgroundConfig ? (localStorage.setItem(`inspectorConfig_${currentDocumentId}`, JSON.stringify(backgroundConfig)), 
    localStorage.removeItem(`AIhandled_${currentDocumentId}`), localStorage.removeItem(`lastFormula_${currentDocumentId}`), 
    location.reload()) : alert("未设置批量替换的背景配置信息，请先设置！") : alert("未设置API Key，请先在设置中配置！");
  }), settingButton.click(function() {
    !function showSettingDialog() {
      $("#settingDialog").show(), $("#configInput").attr("placeholder", JSON.stringify(backgroundConfigDemo, "", 2)), 
      $("#configInput").val(JSON.stringify(backgroundConfig, "", 2)), $("#apiKeyInput").val(apiKey);
    }();
  }), $("#saveConfig").click(function saveBackgroundConfig() {
    try {
      let content = $("#configInput").val();
      backgroundConfig = JSON.parse(content), localStorage.setItem("backgroundConfig", JSON.stringify(backgroundConfig)), 
      apiKey = $("#apiKeyInput").val().trim(), localStorage.setItem("apiKey", apiKey), 
      chatGPT.setApikey(apiKey), $("#settingDialog").hide(), alert("设置已保存！");
    } catch (error) {
      alert("配置解析错误，请检查输入的JSON格式是否正确！");
    }
  }), $("#cancelConfig").click(function cancelSettingDialog() {
    $("#settingDialog").hide();
  });
  let interceptHandling = !1;
  function waitForElement(selector, maxWaitTime = 1e4) {
    return new Promise((resolve, reject) => {
      let startTime = Date.now(), interval = setInterval(() => {
        let element = document.querySelector(selector);
        element ? (clearInterval(interval), resolve(element)) : Date.now() - startTime > maxWaitTime && reject(new Error("元素未找到"));
      });
    });
  }
  async function post(url, data, headers = {}) {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify(data)
    };
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) throw new Error(`请求失败，状态码：${response.status}`);
      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error("网络请求出错");
    }
  }
  const AIChatBot = function createBot(apiType) {
    let apikey;
    return {
      chat: function chat(prompt) {
        switch (apiType) {
         case "kimi":
          return async function chatWithKimi(prompt) {
            const url = "https://api.moonshot.cn/v1/chat/completions", data = {
              model: "moonshot-v1-128k",
              messages: [ {
                role: "user",
                content: prompt
              } ]
            }, headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apikey}`
            }, resultObject = await post(url, data, headers).catch(error => (console.error("Error:", error), 
            alert("请求AI接口失败，请重试！"), hideLoading(), null));
            if (resultObject && resultObject.choices && resultObject.choices.length > 0) return resultObject.choices[0].message.content;
          }(prompt);

         case "deepseek":
          return async function chatWithDeepseek(prompt) {
            const url = "https://api.deepseek.com/chat/completions", data = {
              model: "deepseek-chat",
              messages: [ {
                role: "user",
                content: prompt
              } ],
              stream: !1
            }, headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apikey}`
            }, resultObject = await post(url, data, headers).catch(error => (console.error("Error:", error), 
            alert("请求AI接口失败，请重试！"), hideLoading(), null));
            if (resultObject && resultObject.choices && resultObject.choices.length > 0) return resultObject.choices[0].message.content;
          }(prompt);

         case "chatgpt":
          return async function chatWithChatgpt(prompt) {
            const jumpUrl = `https://cdn.qinsilk.com/res/app/meitu/loginToDesignkitDotCom.html?jump=${encodeURIComponent(window.location.href)}`, loginUrl = `https://web.qinsilk.com/is/admin/loginPage.ac?fw=${encodeURIComponent(jumpUrl)}`;
            apikey || (alert("您还未登录秦丝进销存，请先登录！"), window.open(loginUrl, "_blanket"));
            const resultObject = await post("https://chatgptapi.app.qinsilk.com/chat-process", {
              prompt: prompt,
              options: {
                max_tokens: 2048
              },
              streaming: !1
            }, {
              Authorization: `Bearer ${apikey}`
            }).catch(error => (console.error("Error:", error), alert("请求AI接口失败，请重试！"), hideLoading(), 
            null));
            return "Unauthorized" == resultObject.status ? (alert("您还未登录秦丝进销存，请先登录！"), void window.open(loginUrl, "_blanket")) : resultObject.data ? resultObject.data.text : (alert("请求AI接口失败，请重试！"), 
            void hideLoading());
          }(prompt);

         default:
          throw new Error("Unsupported API selected.");
        }
      },
      setApikey: function(newApiKey) {
        apikey = newApiKey;
      }
    };
  }, chatGPT = {
    kimi: AIChatBot("kimi"),
    chatgpt: AIChatBot("chatgpt"),
    deepseek: AIChatBot("deepseek")
  }.deepseek;
  let lastFormula;
  apiKey && chatGPT.setApikey(apiKey), localStorage.getItem(`lastFormula_${currentDocumentId}`) && (lastFormula = JSON.parse(localStorage.getItem(`lastFormula_${currentDocumentId}`)));
  let AIhandled = "handling";
  localStorage.getItem(`AIhandled_${currentDocumentId}`) && (AIhandled = localStorage.getItem(`AIhandled_${currentDocumentId}`));
  const originalXHROpen = XMLHttpRequest.prototype.open, originalXHRSend = XMLHttpRequest.prototype.send;
  let timerId;
  XMLHttpRequest.prototype.open = function() {
    return this._url = arguments[1], originalXHROpen.apply(this, arguments);
  }, XMLHttpRequest.prototype.send = function() {
    if (arguments[0] = function modifyRequestBody(url, requestBody) {
      let resultBody = requestBody;
      url && -1 != url.indexOf("https://webapi.designkit.com/v1/poster_record/save") && (resultBody = requestBody);
      return resultBody;
    }(this._url, arguments[0]), interceptHandling && -1 != this._url.indexOf("https://webapi.designkit.com/v1/poster_record/save")) return void this.simulateResponse(200, {}, "{}");
    const originalOnReadyStateChange = this.onreadystatechange;
    return this.onreadystatechange = function() {
      if (4 === this.readyState && ("" === this.responseType || "text" === this.responseType)) {
        const originalResponse = this.responseText;
        (async function modifyResponseBody(url, responseBody) {
          let resultBody = responseBody, inspectorConfig = localStorage.getItem(`inspectorConfig_${currentDocumentId}`) && JSON.parse(localStorage.getItem(`inspectorConfig_${currentDocumentId}`));
          if (inspectorConfig.length > 0 && url && -1 != url.indexOf("https://webapi.designkit.com/v1/poster_record/detail")) {
            let config = inspectorConfig[0];
            const originalBody = responseBody;
            let bodyJson = JSON.parse(originalBody);
            if (bodyJson && bodyJson.data.formula) {
              let formula = JSON.parse(bodyJson.data.formula), name = formula.name;
              formula.name = config.name + "_" + name, showLoading(`正在处理"${formula.name}"背景..`);
              let firstUrl = config.firstUrl || config.url, firstTemplate = formula.templateConf[0];
              for (let i = 0; i < firstTemplate.layers.length; i++) {
                let layer = firstTemplate.layers[i];
                if ("bg" === layer.layerType) {
                  layer.url = firstUrl, layer.imageTransform && (layer.imageTransform = {
                    flipH: !1,
                    flipV: !1,
                    heightRatio: 1,
                    offsetX: 0,
                    offsetY: 0,
                    rotate: 0,
                    scale: 1,
                    widthRatio: 1
                  });
                  break;
                }
              }
              for (let i = 1; i < formula.templateConf.length; i++) {
                let template = formula.templateConf[i];
                for (let j = 0; j < template.layers.length; j++) {
                  let layer = template.layers[j];
                  if ("bg" === layer.layerType) {
                    layer.url = config.url;
                    break;
                  }
                }
              }
              let prompt = config.prompt;
              const minHandleLength = config.minHandleLength || 15;
              if (prompt) if ("handling" === AIhandled) {
                for (let i = 0; i < formula.templateConf.length; i++) {
                  let template = formula.templateConf[i];
                  for (let j = 0; j < template.layers.length; j++) {
                    let layer = template.layers[j];
                    if ("text" === layer.layerType && layer.textContents && layer.textContents.length > 0) {
                      let newTextCombined = [];
                      for (let k = 0; k < layer.textContents.length; k++) {
                        let textContent = layer.textContents[k];
                        if (textContent.text) {
                          let newText = textContent.text, suffix = newText.match(/\n*$/);
                          newText = newText.replace(/\n*$/, "");
                          let prefix = newText.match(/^\n*/);
                          newText = newText.replace(/^\n*/, ""), newText && newText.length > minHandleLength && (showLoading(`AI正在处理文案：${newText.substring(0, 20)}..`), 
                          newText = await chatGPT.chat(`${prompt}\n${newText}`), console.log(`原文本：\n${textContent.text}\n\nAI处理后文本：\n${newText}`)), 
                          prefix && prefix[0] && (newText = `${prefix[0]}${newText}`), suffix && suffix[0] && (newText = `${newText}${suffix[0]}`), 
                          layer.textContents[k].text = newText;
                        }
                        newTextCombined.push(textContent.text);
                      }
                      layer.text = newTextCombined.join("");
                    } else if ("text" === layer.layerType && layer.text && layer.text.length > minHandleLength) {
                      showLoading(`AI正在处理文案：${layer.text.substring(0, 20)}..`);
                      const newText = await chatGPT.chat(`${prompt}\n${layer.text}`);
                      console.log(`原文本：\n${layer.text}\n\nAI处理后文本：\n${newText}`), layer.text = newText;
                    }
                  }
                }
                lastFormula = formula, AIhandled = "handled", localStorage.setItem(`lastFormula_${currentDocumentId}`, JSON.stringify(formula)), 
                localStorage.setItem(`AIhandled_${currentDocumentId}`, AIhandled), window.location.reload();
              } else "handled" === AIhandled && (formula = lastFormula); else AIhandled = "handled";
              bodyJson.data.formula = JSON.stringify(formula), resultBody = JSON.stringify(bodyJson), 
              interceptHandling = !0;
            }
          }
          return resultBody;
        })(this._url, originalResponse).then(modifiedResponse => {
          Object.defineProperty(this, "responseText", {
            writable: !0
          }), this.responseText = modifiedResponse;
        }).catch(error => {
          console.error("Error modifying response body:", error);
        });
      }
      originalOnReadyStateChange && originalOnReadyStateChange.apply(this, arguments);
    }, originalXHRSend.apply(this, arguments);
  }, XMLHttpRequest.prototype.simulateResponse = function(status, headers, body) {
    const xhr = this;
    xhr.readyState = 4, xhr.status = status, xhr.statusText = "OK", xhr.responseHeaders = headers, 
    xhr.responseText = body, setTimeout(() => {
      xhr.onreadystatechange();
    }, 0);
  }, function startChecking() {
    timerId = setTimeout(async () => {
      await async function handleIntercept() {
        if (interceptHandling && "handled" === AIhandled) {
          if (!await waitForElement(".c-quick-operate", 15e3).catch(() => !1)) return localStorage.removeItem(`inspectorConfig_${currentDocumentId}`), 
          localStorage.removeItem(`AIhandled_${currentDocumentId}`), localStorage.removeItem(`lastFormula_${currentDocumentId}`), 
          alert("数据加载失败，请重新点导出！"), window.location.reload(), !0;
          if ((await waitForElement("#root > div.p-editor > div.p-editor__header > div > div.p-header__right .download-btn")).click(), 
          (await waitForElement("div.m-download-wrap__btn")).click(), await waitForElement("div.download-success-header__title")) {
            let inspectorConfig = JSON.parse(localStorage.getItem(`inspectorConfig_${currentDocumentId}`));
            return inspectorConfig.shift(), localStorage.setItem(`inspectorConfig_${currentDocumentId}`, JSON.stringify(inspectorConfig)), 
            showLoading("已成功处理并下载成功！"), localStorage.removeItem(`AIhandled_${currentDocumentId}`), 
            localStorage.removeItem(`lastFormula_${currentDocumentId}`), inspectorConfig.length > 0 ? location.reload() : (localStorage.removeItem(`inspectorConfig_${currentDocumentId}`), 
            hideLoading()), interceptHandling = !1, !0;
          }
        }
        return !1;
      }() ? clearTimeout(timerId) : startChecking();
    }, 1e3);
  }();
}();