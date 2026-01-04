// ==UserScript==
// @name         iHR quiz tool V2
// @version      2025-12-02
// @description  Don't be a bitch, don't snitch 🤫
// @author       Lee-7723
// @match        http://ihr.hq.cmcc/cs/hrrc/quest/answer?*
// @icon         http://ihr.hq.cmcc/cs/hrrc/static/images/HR-logo.png
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license      MIT

// @namespace http://alist3.lee7723.top/
// @downloadURL https://update.greasyfork.org/scripts/506747/iHR%20quiz%20tool%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/506747/iHR%20quiz%20tool%20V2.meta.js
// ==/UserScript==

(function () {
  //    'use strict';
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  let userAnswerJson;
  const TARGET_PATH = "/cc/hrd/quest/rest/answer/userAnswer";

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._tm_url = url;
    this._tm_method = method;
    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this._tm_url) {
        try {
          const urlObj = new URL(this._tm_url, window.location.origin);
          if (
            urlObj.pathname === TARGET_PATH &&
            this._tm_method.toUpperCase() === "GET"
          ) {
            console.group("📡 [TamperMonkey Hook - XHR]");
            // console.log("URL:", this._tm_url);
            try {
              // 主要逻辑
              userAnswerJson = JSON.parse(this.responseText);
            } catch (e) {
              console.error("[Response is not JSON.]");
            }
          }
        } catch (e) {}

        console.groupEnd();
      }
    });

    return originalSend.call(this, body);
  };

  window.$ = $; // 把 jQuery 注入网页的 window
  window.jQuery = $;

  function addButton() {
    //console.log('userscript');
    let btn = document.createElement("button");
    btn.className = "btn btn-primary btn-sm";
    btn.innerHTML = "<span>答案工具<span>";
    //console.log($('.text-right.btn-area').length);
    // $('.ur_page_title_content').append(btn);
    $(".text-center.btn-area").append(btn);
    // document.body.appendChild(btn)
    btn.onclick = addDiv;
  }

  function addDiv() {
    let popup = document.createElement("div");
    popup.id = "popup";
    let x = visualViewport.width - 30
    popup.style = `
    background-color: #f1f4f9;
    box-shadow: 0.2rem 0.2rem 1rem #0000006b;
    border: solid 1px #00000042;
    top: 2rem;
    left: calc(100% - 32rem);
    width: 30rem;
    min-width: 24rem;
    height: 30rem;
    min-height: 15rem;
    position: fixed;
    z-index: 10;
    resize: both;
    overflow: auto;
    padding: 0.5rem;
    `;
    popup.innerHTML = `
<style>
  .popup-nav {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
  #removeDivBtn,
  #popupMove {
    padding: 0.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #popupMove {
    cursor: grab;
    padding: 0.2rem;
    width: 3rem;
  }
  #popupMove:active {
    cursor: grabbing;
  }

  #functionDiv {
    font-size: 0.8rem;
    height: calc(100% - 2rem);
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 0 0 0.5rem 0;
    border: solid 1px rgb(74 144 229);
    overflow-y: auto;
  }
</style>
<div class="popup-nav">
  <button id="removeDivBtn" class="btn btn-primary">✖</button>
  <div id="popupMove">
    <svg
      class="icon"
      style="
        width: 100%;
        height: 100%;
        vertical-align: middle;
        fill: currentColor;
        overflow: hidden;
      "
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="944"
    >
      <path
        d="M1013.333333 486.4l-153.6-153.6c-10.666667-10.666667-27.733333-2.133333-27.733333 10.666667v132.266666H544V189.866667h132.266667c14.933333 0 21.333333-17.066667 10.666666-27.733334L533.333333 8.533333c-12.8-12.8-32-12.8-44.8 0l-153.6 153.6c-10.666667 10.666667-2.133333 27.733333 10.666667 27.733334h132.266667v285.866666L192 477.866667v-132.266667c0-14.933333-17.066667-21.333333-27.733333-10.666667L10.666667 488.533333c-12.8 12.8-12.8 32 0 44.8l153.6 153.6c10.666667 10.666667 27.733333 2.133333 27.733333-10.666666v-132.266667h285.866667v285.866667h-132.266667c-14.933333 0-21.333333 17.066667-10.666667 27.733333l153.6 153.6c12.8 12.8 32 12.8 44.8 0l153.6-153.6c10.666667-10.666667 2.133333-27.733333-10.666666-27.733333h-132.266667V544H832v132.266667c0 14.933333 17.066667 21.333333 27.733333 10.666666l153.6-153.6c10.666667-12.8 10.666667-34.133333 0-46.933333z"
        fill="#212121"
        p-id="945"
      ></path>
    </svg>
  </div>
</div>

<div id="functionDiv">
  <div id="output">
    <style>
      #output {
        margin: 0.5rem;
      }
      #output > div > div {
        margin-bottom: 1rem;
      }
      .answerDiv {
        gap: 0.5rem;
        margin-left: 1rem;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
      }
      .answerDiv > p {
        margin: 0;
      }
      .answerTitleDiv {
        display: flex;
        flex-direction: row;
        margin-bottom: 0.3rem;
      }
      .answerTitleDiv > div:nth-of-type(1) {
        display: inline-block;
        font-weight: bold;
        /*width: 2rem;*/
      }
      .tf {
        background-color: #cecfd0;
        border-radius: 5px;
        width: 1.6rem;
        height: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    <div>Waiting for packet interception...</div>
  </div>
</div>

    `;
    if ($("#popup").length == 0) {
      document.body.appendChild(popup);
      dragElement(popup, popup.querySelector("#popupMove"));
      let btn = $("#removeDivBtn")[0];
      btn.onclick = removeDiv;

      convert();
    } else {
      let popup = $("#popup");
      popup.show();
    }
  }

  function removeDiv() {
    let popup = $("#popup");
    popup.hide();
  }

  function convert() {
    let outputDiv = $("#output div")[0];
    outputDiv.innerHTML = "";
    let data = JSON.stringify(userAnswerJson);
    //   let data = $("#input textarea")[0].value;
    data = JSON.parse(data);
    for (let item of data.context.allExceptVoteSubjs) {
      //console.log(item);
      let title = `
        <div class='answerTitleDiv'>
          <div><span>${item.title}</span></div>
        </div>`;
      let answer = "";
      if (item.optionList != null)
        for (let asr of item.optionList) {
          if (asr.rightAnswer) {
            let inputHTML = "";
            if (item.typeId == "radio") {
              inputHTML = `<input type="radio" disabled="disabled" checked='checked'>`;
              answer += `
                <div class='answerDiv'>
                  ${inputHTML}
                  <p>${asr.optionContent}</p>
                </div>
                `;
            } else if (item.typeId == "checkBox") {
              inputHTML = `<input type="checkbox" disabled="disabled" checked='checked'>`;
              answer += `
                <div class='answerDiv'>
                  ${inputHTML}
                  <p>${asr.optionContent}</p>
                </div>
                `;
            } else if (item.typeId == "trueOrFalse") {
              answer += `
                <div class='answerDiv'>
                  <div class='tf'>
                  <p>${asr.optionContent}</p>
                  </div>
                </div>
                `;
            }
          }
        }
      outputDiv.innerHTML += `<div>
        ${title}${answer}
        </div>`;
    }
    console.log(data);
  }

  function dragElement(elmnt, mvelmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    mvelmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function waitForElement(querySelector, timeout) {
    return new Promise((resolve, reject) => {
      var timer = false;
      if (document.querySelectorAll(querySelector).length) return resolve();
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(querySelector).length) {
          observer.disconnect();
          console.log("element found");
          if (timer !== false) clearTimeout(timer);
          return resolve();
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
      if (timeout) {
        timer = setTimeout(() => {
          observer.disconnect();
          reject();
        }, timeout);
      }
    });
  }

  waitForElement(".text-center.btn-area", 10000).then(addButton);

  // Your code here...
})();
