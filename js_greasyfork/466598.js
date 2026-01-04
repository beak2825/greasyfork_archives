// ==UserScript==
// @name         国家中小学智慧教育平台教材PDF电子课本链接与下载工具
// @namespace    https://greasyfork.org/zh-CN/scripts/466598
// @version      3.1.1
// @description  教材列表页与预览页添加了PDF按钮，免登录查看或下载电子课本与课外书籍，可批量下载，支持新课标教材
// @match        *://basic.smartedu.cn/*
// @match        *://www.zxx.edu.cn/*
// @match        *.ykt.cbern.com.cn/*
// @match        *://x-edu-pdfjs.ykt.eduyun.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAYAAAAUg66AAAAACXBIWXMAACE4AAAhOAFFljFgAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDAgNzkuMTcxYzI3ZiwgMjAyMi8wOC8xNi0xODowMjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wMy0yOFQyMjowODoxNSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDQtMTZUMTU6MjQ6MDIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDQtMTZUMTU6MjQ6MDIrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEwNGExYWI0LTkzOWMtMDA0Yi05NjE4LTc0OTQ0YjU3ZDAwNSIgeG1wTU06RG9jdW1lbnRJRD0i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
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/466598/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90PDF%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E9%93%BE%E6%8E%A5%E4%B8%8E%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/466598/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90PDF%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E9%93%BE%E6%8E%A5%E4%B8%8E%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const idFromMac = window.location.href.match(/id=%5C%22(.*?)%5C%22,/)?.[1];
    if (idFromMac && idFromMac.length >= 50) {
        GM_setValue("macId", idFromMac);
        console.log("idFromMac:", idFromMac);
    }
    const macId = GM_getValue("macId", "0");
    console.log("macId:", macId);

    if (window.location.pathname === "/pdfjs/2.15/web/viewer.html" && macId.length < 50) {
        alert("登录账号并以网站原有方式查看教材后，重新打开网站即可使用脚本。");
    }

    const errorMessage = document.querySelector("#errorMessage");
    if (errorMessage) {
        const newElement = document.createElement("span");
        newElement.textContent = `登录账号并以网站原有方式查看教材后，重新打开网站或浏览器即可使用脚本功能。`;
        errorMessage.insertAdjacentElement("afterend", newElement);
    }

    const toolbarViewerRight = document.querySelector("#toolbarViewerRight");
    if (toolbarViewerRight) {
        const hiddenElements = toolbarViewerRight.querySelectorAll("[hidden][data-l10n-id='download']");
        hiddenElements.forEach(function(element) {
            element.removeAttribute("hidden");
        });
    }

    // 样式
    const style = document.createElement("style");
    style.innerHTML = `
        /* iframe 全屏按钮样式 */
        .fullscreenMode:before {
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g><path d="M13,13h-2.7v2H14c0.6,0,1-0.4,1-1v-3.7h-2L13,13z"/><path d="M3,10.3H1V14c0,0.6,0.4,1,1,1h3.7v-2H3V10.3z"/><path d="M1,2v3.7h2V3h2.7V1H2C1.4,1,1,1.4,1,2z"/><path d="M14,1h-3.7v2H13v2.7h2V2C15,1.4,14.6,1,14,1z"/></g></svg>');
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g><path d="M13,13h-2.7v2H14c0.6,0,1-0.4,1-1v-3.7h-2L13,13z"/><path d="M3,10.3H1V14c0,0.6,0.4,1,1,1h3.7v-2H3V10.3z"/><path d="M1,2v3.7h2V3h2.7V1H2C1.4,1,1,1.4,1,2z"/><path d="M14,1h-3.7v2H13v2.7h2V2C15,1.4,14.6,1,14,1z"/></g></svg>');
        }
        /* 视频去水印 */
        .vjs-watermark {
            display: none !important;
        }
    `;
    document.head.append(style);

    function fullscreenSwitch() {
        const courseDocument = document.querySelector(".course-document");
        const html = document.querySelector("html");
        if (courseDocument.classList.contains("full-screen")) { // 当前处于"全屏状态"，切换为"非全屏状态"
            courseDocument.classList.remove("full-screen");
            html.style.overflow = "";
            document.querySelector("iframe")?.scrollIntoView({
                block: "nearest"
            });
        } else { // 当前处于"非全屏状态"，切换为"全屏状态"
            courseDocument.classList.add("full-screen");
            html.style.overflow = "hidden";
        }
    }

    // iframe 向主页面发送全屏切换消息
    if (window.self !== window.top) {
        const verticalToolbarSeparator = document.querySelector("#toolbarViewerRight > .verticalToolbarSeparator");
        if (verticalToolbarSeparator) {
            const fullscreenBtn = document.createElement("button");
            fullscreenBtn.className = "toolbarButton fullscreenMode";
            fullscreenBtn.title = "切换全屏模式";
            fullscreenBtn.innerHTML = `<span>全屏模式</span>`;
            verticalToolbarSeparator.insertAdjacentElement("beforebegin", fullscreenBtn);
            fullscreenBtn.addEventListener("click", () => {
                console.log("点击全屏按钮");
                window.parent.postMessage("full-screen mode switches", "*"); // iframe 向主页面发送消息，"*" 表示允许发送到任意源的主页面
            });
        }
    }

    // 主页面等待全屏指令
    window.addEventListener("message", function(event) {
        if (event.data === "full-screen mode switches") {
            console.log("Received message from iframe:", event.data);
            fullscreenSwitch();
        }
    });

    async function downloadFile(fileUrl, element2, progressText, fileName, completeText) {
        try {
            element2.innerText = `${progressText} ...`;
            const response = await fetch(fileUrl, {
                headers: {
                    "x-nd-auth": `MAC id=\"${macId}\",nonce=\"0\",mac=\"0\"`
                },
                // cache: "no-store"
            });
            if (!response.ok) {
                throw new Error("请求失败: " + response.status);
            }
            const contentLength = response.headers.get("Content-Length");
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            const reader = response.body.getReader();
            let received = 0;
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                received += value.length;
                if (total) {
                    const progress = Math.round((received / total) * 100);
                    element2.innerText = `${progressText} (${progress}%)`;
                } else {
                    element2.innerText = `${progressText} (${(received / 1024 / 1024).toFixed(2)} MB)`;
                }
            }
            const blob = new Blob(chunks);
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            downloadLink.click();
            element2.innerText = completeText;
        } catch (err) {
            console.error(err);
            element2.innerText = "下载失败";
        }
    }

    function AddBtnsToListPg(i, title, pdfUrl) {
        const container = document.querySelectorAll("li.index-module_item_GfOnF")[i];
        container?.querySelector(".PDF-btns")?.remove(); // 去除旧按钮
        const PDF_btns = document.createElement("div"); // 创建 PDF_btns
        PDF_btns.setAttribute("class", "PDF-btns");
        PDF_btns.innerHTML = `
            <a type="button" class="fish-btn" style="margin-left: 24px; margin-bottom: 5px;" href="${pdfUrl}?accessToken=${macId}" target="_blank">查看PDF</a>
            <a type="button" class="fish-btn fish-btn-primary" style="margin-left: 24px; margin-bottom: 5px;">下载PDF</a>
        `;
        container.appendChild(PDF_btns); // 将 PDF_btns 添加到父元素中
        document.querySelectorAll(".index-module_content_KmLzG")[i].style.width = "550px"; // 统一 content 宽度
        PDF_btns.addEventListener("click", function(event) { // 停止 PDF_btns 的点击事件向上一层元素传播
            event.stopPropagation();
        });
        const element2 = PDF_btns.querySelector("a.fish-btn.fish-btn-primary");
        const progressText = "下载中";
        const fileName = (title || document.querySelectorAll("div.index-module_line_LgJAC")[i].querySelector("span").getAttribute("title") || "PDF") + ".pdf";
        const completeText = "下载完成";
        element2.addEventListener("click", function() {
            downloadFile(pdfUrl, element2, progressText, fileName, completeText);
        });
    }

    let title, pdfUrl; // 内页 pdfURL
    let pdfUrls = []; // 声明空数组

    // Resources requested via XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // console.log("Intercepted URL:", url);
        if (window.location.pathname === "/tchMaterial" && url.includes("query?res_ids=")) { // 获取列表页各 id
            const ids = url.match(/res_ids=([^&]+)/)[1].split(","); // 多个 id 构成的数组 // 匹配出 url 中“query?res_ids=”之后的内容，并将匹配出来的内容以其中的“,”隔开，形成多个“id”
            console.log(ids);
            const jsonUrls = ids.map(id => `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${id}.json`); // 多个 jsonURL 构成的数组
            console.log(jsonUrls);
            const jsonUrlsThe2nd = ids.map(id => `https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/special_edu/thematic_course/${id}/resources/list.json`); // 多个 jsonURL 构成的数组
            console.log(jsonUrlsThe2nd);
            pdfUrls.length = 0; // 清空 pdfUrls 数组
            for (let i = 0; i < jsonUrls.length; i++) {
                fetch(jsonUrls[i])
                    .then(response => {
                        return response.text();
                    })
                    .then(text => {
                        let title = text.match(/(?<="title":\s*")[^"]+/g)[0];
                        let pdfUrl = text.match(/\bhttps?:\/\/[^"]*pkg[^"]*\.pdf\b/g).slice(-1)[0]; // 不存在则报错
                        pdfUrls.splice(i, 0, pdfUrl);
                        console.log(`pdf${i + 1}:`, title, pdfUrl);
                        AddBtnsToListPg(i, title, pdfUrl);
                    })
                    .catch(error => {
                        // console.log(error);
                        fetch(jsonUrlsThe2nd[i])
                            .then(response => {
                                return response.text();
                            })
                            .then(text => {
                                let pdfUrl = text.match(/\bhttps?:\/\/[^"]*pkg[^"]*\.pdf\b/g).slice(-1)[0]; // 不存在则报错
                                pdfUrls.splice(i, 0, pdfUrl);
                                console.log(`pdf${i + 1}:`, pdfUrl);
                                AddBtnsToListPg(i, undefined, pdfUrl);
                            })
                            .catch(error => {
                                console.log(error);
                                let pdfUrl = `notfound`;
                                pdfUrls.splice(i, 0, pdfUrl);
                                console.log(`pdf${i + 1}:`, pdfUrl);
                            });
                    });
            }
            console.log("pdfURLs:", pdfUrls);
        } else if (window.location.pathname === "/tchMaterial/detail" && (/resources\/tch_material\/details|special_edu\/thematic_course.*list\.json$/).test(url)) { // 内页 pdfUrl
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = () => {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const text = this.responseText;
                        if (url.includes("resources/tch_material/details")) {
                            title = text.match(/(?<="title":\s*")[^"]+/g)[0];
                            pdfUrl = text.match(/\bhttps?:\/\/[^"]*pkg[^"]*\.pdf\b/g).slice(-1)[0]; // 不存在则报错
                            console.log(title, pdfUrl);
                        } else if (url.includes("special_edu/thematic_course") && url.endsWith("list.json")) {
                            const urlList = text.match(/\bhttps?:\/\/(?!r1|r2)[^"]*pkg[^"]*\.(pdf|pptx?)\b/g); // 必须包含 pkg 以排除无效链接
                            console.log(urlList);
                            const errorText = document.querySelector("._error_18kvb_1.index-module_error_310Am > ._text_18kvb_16");
                            if (errorText) {
                                errorText.innerHTML = "哎呀，该内容不需要登录也能查看";
                                const div = document.createElement("div");
                                div.className = "urls";
                                div.style = "display: flex;flex-direction: column";
                                errorText.insertAdjacentElement("afterend", div);
                                for (let i = 0; i < urlList.length; i++) {
                                    if (urlList[i].endsWith("pdf")) {
                                        div.innerHTML += `<a href="${urlList[i]}?accessToken=${macId}" target="_blank" class="fish-btn">${urlList[i]}</a>`;
                                    } else {
                                        div.innerHTML += `<a href="${urlList[i]}" target="_blank" class="fish-btn">${urlList[i]}</a>`;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        } else if (url.endsWith(".mp3") || url.includes(".mp3?")) { // MP3 链接
            console.log("Requested MP3:", url);
            const element1 = document.querySelector("a.mp3"); // 按钮 element1
            if (element1) {
                element1.parentElement.remove();
            }
            const suggestBtn = document.getElementsByClassName("index-module_suggestion-wrap_s+Ii+")[0];
            if (suggestBtn && !document.querySelector(".mp3")) {
                const div = document.createElement("div");
                div.setAttribute("style", "display: flex; align-items: center; margin-left: 30px");
                div.innerHTML = `<a class="mp3" style="color: #888;">📼 下载MP3</a>`;
                suggestBtn.insertAdjacentElement("afterend", div);
                if (!document.querySelector(".index-module_wrapper_ECeCo > .imageList-module_special-edu-image_A7C2c")) { // 非常规界面空间不够
                    suggestBtn.previousElementSibling?.remove();
                }
                const element1 = div.querySelector("a.mp3");
                element1.addEventListener("click", function(event) { // 点击下载
                    var fileUrl = url;
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", fileUrl);
                    xhr.setRequestHeader("x-nd-auth", `MAC id=\"${macId}\",nonce=\"0\",mac=\"0\"`);
                    xhr.responseType = "blob";
                    xhr.onloadstart = function() { // 初始化进度
                        element1.innerText = "📼 下载中 ...";
                    };
                    xhr.onprogress = function(event) {
                        if (event.lengthComputable) {
                            var progress = Math.round((event.loaded / event.total) * 100);
                            element1.innerText = "📼 下载中 (" + progress + "%)";
                        }
                    };
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            var blob = xhr.response;
                            var downloadLink = document.createElement("a");
                            downloadLink.href = URL.createObjectURL(blob);
                            downloadLink.download = document.querySelector(".audioList-module_audio-item_GGkA9.audioList-module_audio-item-active_Xx7f- .audioList-module_center_MjbID").innerText || "MP3"; // 文件名
                            downloadLink.dispatchEvent(new MouseEvent("click"));
                            element1.innerText = "📼 下载MP3"; // 下载完成后恢复按钮文字
                        } else {
                            console.error("请求失败:", xhr.status);
                            element1.innerText = "下载失败";
                        }
                    };
                    xhr.onerror = function() {
                        console.error("请求出错");
                        element1.innerText = "下载出错";
                    };
                    xhr.send(); // 发送请求
                });
            }
        }
        return originalOpen.apply(this, arguments);
    };

    const maxTimeToCheck = 15000; // 最多检查 15000 毫秒，即 15 秒
    let elapsedTime = 0;

    // 免登录内页
    function checkLoginModal() {
        const loginModal = document.querySelector(".fish-modal-root");
        if (loginModal) {
            clearInterval(intervalId1); // 清除定时器
            // 去除阻碍
            loginModal.remove(); // 去除遮罩
            const body = document.querySelector("html > body"); // 去除 body 属性
            body.removeAttribute("class");
            body.removeAttribute("style");
            // 添加阅读器
            const indexModuleWrapperECeCo = document.querySelector(".index-module_wrapper_ECeCo");
            if (indexModuleWrapperECeCo) {
                indexModuleWrapperECeCo.innerHTML = `
<div class="index-module_wrapper_ECeCo">
<div class="imageList-module_special-edu-image_A7C2c">
  <div class="index-module_header_tG-zz">
    <h3 class="index-module_title_bnE9V">${title}</h3>
    <div class="index-module_info_evO1d">
      <span class="index-module_origin_nuihE">
        <svg class="index-module_icon_dwVZ4">
          <use xlink:href="#icon_hotel_fill">
          </use>
        </svg>
        <span class="index-module_department_ewVZW">智慧中小学</span>
      </span>
      <div class="index-module_assesment-detail_jhGLz">
        <div class="index-module_assessment-content_06v6Z">
          <div class="fish-dropdown-trigger index-module_assessment-rate_euPTQ">
            <ul class="fish-rate fish-rate-disabled" tabindex="-1" role="radiogroup">
              <li class="fish-rate-star fish-rate-star-full">
                <div role="radio" aria-checked="true" aria-posinset="1" aria-setsize="5" tabindex="-1">
                  <div class="fish-rate-star-first">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                  <div class="fish-rate-star-second">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="fish-rate-star fish-rate-star-full">
                <div role="radio" aria-checked="true" aria-posinset="2" aria-setsize="5" tabindex="-1">
                  <div class="fish-rate-star-first">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                  <div class="fish-rate-star-second">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="fish-rate-star fish-rate-star-full">
                <div role="radio" aria-checked="true" aria-posinset="3" aria-setsize="5" tabindex="-1">
                  <div class="fish-rate-star-first">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                  <div class="fish-rate-star-second">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="fish-rate-star fish-rate-star-full">
                <div role="radio" aria-checked="true" aria-posinset="4" aria-setsize="5" tabindex="-1">
                  <div class="fish-rate-star-first">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                  <div class="fish-rate-star-second">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="fish-rate-star fish-rate-star-zero">
                <div role="radio" aria-checked="true" aria-posinset="5" aria-setsize="5" tabindex="-1">
                  <div class="fish-rate-star-first">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                  <div class="fish-rate-star-second">
                    <div class="custom-star-wrap" style="width: 100%;">
                      <div class="custom-star">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <span class="index-module_text_rukZW">5.0分</span>
          </div>
        </div>
        <span class="fish-dropdown-trigger index-module_assessment-btn_6imdF ">
          <button type="button" class="fish-btn fish-btn-round">
            <svg class="index-module_rate-icon_YM1Lc">
              <use xlink:href="#icon_evaluate_fill">
              </use>
            </svg>
            <span class="index-module_assessment-btn-text_fw-+Z">评分</span>
          </button>
        </span>
      </div>
      <div class="index-module_extra_tUQog">
        <div class="index-module_like-wrap_NbyLe  ">
          <svg class="index-module_like_qOb9K">
            <use xlink:href="#web_icon_dianzan_fill">
            </use>
          </svg>
          <div class="index-module_like-count_GXOGd">100万+</div>
        </div>
        <div class="index-module_suggestion-wrap_s+Ii+ ">
          <svg class="index-module_suggestion-icon_IrRxU">
            <use xlink:href="#icon_feedback_fill">
            </use>
          </svg>
          <div>建议</div>
        </div>
      </div>
    </div>
  </div>
  <div class="index-module_divider_rI-lg">
  </div>
  <div class="imageList-module_special-edu-image-list-wrapper_18zfs">
    <div class="imageList-module_special-edu-image-list_+ywag" style="max-width: unset;">
      <div class="course-document">
        <div class="document-context" style="overflow: hidden; height: 100%;">
          <iframe id="pdfPlayerFirefox" src='/pdfjs/2.13/web/viewer.html?file=${pdfUrl}&headers=%7B"X-ND-AUTH":"MAC%20id=%5C"${macId}%5C",nonce=%5C"0%5C",mac=%5C"0%5C""%7D#disablestream=true&disableAutoFetch=true&page=1' allowfullscreen="" frameborder="0" height="100%" width="100%"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
                `;
            } else if (!document.querySelector(".main-wrapper")) {
                // 直接跳转
                window.location.href = `${pdfUrl}?accessToken=${macId}`;
            }
            // 重定向至登录页
            const toLogin = [
                document.querySelector(".fish-dropdown-trigger.index-module_assessment-btn_6imdF"),
                document.querySelector(".index-module_like-wrap_NbyLe"),
                document.querySelector(".index-module_suggestion-wrap_s\\+Ii\\+")
            ];
            toLogin.forEach(element => {
                element.addEventListener("click", () => {
                    window.open("https://auth.smartedu.cn/uias/login/");
                });
            });
        } else {
            elapsedTime += 100;
            if (elapsedTime >= maxTimeToCheck) {
                clearInterval(intervalId1); // 清除定时器，停止检查
            }
        }
    }
    const intervalId1 = setInterval(checkLoginModal, 100); // 每隔 100 毫秒检查一次 .fish-modal-root 元素是否存在

    // 内页
    function checkIndexModule() {
        const container = document.querySelector(".index-module_extra_tUQog"); // 找到要添加按钮的容器元素
        if (container && !document.querySelector(".Btns")) {
            clearInterval(intervalId2); // 清除定时器
            const div = document.createElement("div");
            div.className = "Btns";
            div.style = "display: flex";
            div.innerHTML = `<a class="link" href="${pdfUrl}?accessToken=${macId}" target="_blank" style="margin-left: 24px; color: #888;">📓 查看PDF</a><a class="download" style="margin-left: 24px; color: #888;">📓 下载PDF</a>`;
            container.appendChild(div); // 将按钮添加到网页中
            const element1 = div.querySelector("a.link");
            if (element1) {
                element1.addEventListener("mouseover", function() {
                    this.innerHTML = "📘 查看PDF";
                    this.style.color = "#1e62ec"; // 鼠标移入时修改元素的样式
                });
                element1.addEventListener("mouseout", function() {
                    this.innerHTML = "📓 查看PDF";
                    this.style.color = "#888"; // 鼠标移出时恢复原来的样式
                });
            }
            const element2 = div.querySelector("a.download");
            if (element2) {
                const progressText = "📓 下载中";
                const fileName = (title || document.querySelector(".index-module_title_bnE9V").innerText || "PDF") + ".pdf";
                const completeText = "📓 下载完成";
                element2.addEventListener("click", function() {
                    downloadFile(pdfUrl, element2, progressText, fileName, completeText);
                });
            }
            setTimeout(function() { // 等待 iframe 加载；教材内页主文档通过 iframe 获取 URL 以更新链接
                const iframe = document.querySelector("iframe");
                if (iframe) {
                    const iframeSrc = iframe.src;
                    console.log("iframeSrc:", iframeSrc);
                    const iframePDF = new URL(iframeSrc).searchParams.get("file");
                    console.log("iframePDF:", iframePDF);
                    const element1 = div.querySelector("a.link"); // 按钮 element1
                    if (element1) {
                        element1.href = `${iframePDF}?accessToken=${macId}`; // 更新 element1 的 URL
                    }
                    pdfUrl = iframePDF; // 更新 element2 的 URL
                }
            }, 3000);
        } else {
            elapsedTime += 100;
            if (elapsedTime >= maxTimeToCheck) {
                clearInterval(intervalId2); // 清除定时器，停止检查
            }
        }
    }
    const intervalId2 = setInterval(checkIndexModule, 100); // 每隔 100 毫秒检查一次 index-module_extra_tUQog 元素是否存在

    // PDF fetched
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url, options) {
        return originalFetch(url, options) // 调用原始 fetch 函数
            .then(response => {
                if (response.status === 200 && url.endsWith(".pdf")) {
                    const headers = Object.fromEntries(response.headers.entries()); // 响应头
                    console.log("PDF response headers:", headers);
                    console.log("Fetched PDF:", url);
                    if (!url.includes("-private")) { // 课后阅读
                        const element1 = document.querySelector("a.link"); // 按钮 element1
                        if (element1) { // iframe 内部不存在此元素；可在主文档中通过 iframe 获取文件 URL
                            element1.href = url; // 修改 element1 的 URL
                        }
                        pdfUrl = url; // 修改 element2 的 URL
                    } else { // 课程教学
                        const syncClassSuggestion = document.getElementsByClassName("index-module_suggestion-wrap_s+Ii+")[0];
                        if (syncClassSuggestion) {
                            document.querySelector("div > .link")?.parentElement.remove();
                            const div = document.createElement("div");
                            div.setAttribute("style", "display: flex; align-items: center; margin-left: 30px");
                            div.innerHTML = `<a class="link" href="${url}?accessToken=${macId}" target="_blank" style="color: #888;">📓 查看PDF</a>`;
                            syncClassSuggestion.insertAdjacentElement("afterend", div);
                        }
                    }
                }
                return response;
            })
            .catch(error => {
                console.error(error);
            });
    };

})();