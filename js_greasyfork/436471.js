// ==UserScript==
// @name         Dailymotion flip video back to "normal"
// @namespace    https://openuserjs.org/users/burn
// @version      0.1.8
// @copyright    2019, burn (https://openuserjs.org//users/burn)
// @description  Adds a button to flip back video when mirrored
// @author       Burn
// @match        https://www.dailymotion.com/video/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436471/Dailymotion%20flip%20video%20back%20to%20%22normal%22.user.js
// @updateURL https://update.greasyfork.org/scripts/436471/Dailymotion%20flip%20video%20back%20to%20%22normal%22.meta.js
// ==/UserScript==

(function (w) {
  'use strict';
  var targetNode = document.body,
    observerConfig = {
      attributes: false,
      childList: true,
      subtree: true
    },
    qS = function (el, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelector(el) || false;
    },
    qSall = function (els, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelectorAll(els) || false;
    },
    getClassSuffix = function () {
      let elm = qS('[class*=""]');
    },
    isFound = false,
    callback = function (mutationsList, observer) {
      mutationsList.forEach(function (mutation) {
        var entry = {
          mutation: mutation,
          el: mutation.target,
          value: mutation.target.textContent,
          oldValue: mutation.oldValue
        };
        //console.log(entry.el);
        if (!isFound && entry.el.classList.value.indexOf("RankViewsAndPubDate__videoStats___") > -1) {
          //console.log("found element, adding button and range slider");
          isFound = true;
          var newBtn = document.createElement("button");
          newBtn.innerText = "Flip video";
          newBtn.style.cssText = `
    display: inline-flex;
    padding: 8px 16px 8px 8px;
    border: 1px solid;
    border-radius: 3px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-family: Retina,Arial,Helvetica,sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    text-align: center;
    -webkit-transition: .2s;
    transition: .2s;
    cursor: pointer;
    outline: none;
    border-color: #232323;
    color: #232323;
    background: transparent;
    min-height: 24px;
    padding: 1px 8px;
    margin-left: 8px;
    margin-right: 8px;
                 `;
          newBtn.onclick = function (e) {
            let videoEl = qS("video[id$='_Video']");
			if (videoEl.style.cssText.indexOf("180deg") > -1) {
				videoEl.style.cssText = "transform: rotateY(0) !important;";
			} else {
				videoEl.style.cssText = "transform: rotateY(180deg) !important;";
			}
          };
          entry.el.appendChild(newBtn);

          var sliderHtml = new DOMParser().parseFromString(`<div id="range_wrapper" class="range-outer"><div class="range-wrapper">Speed
  <button onclick="return decrement(document.getElementById('input_range'))">-</button>
  <input id="input_range" value="1.0" type="range" name="points" min="0.1" max="2.0" step="0.1">
  <button onclick="return increment(document.getElementById('input_range'))">+</button>
  <div id="playbackRate">1</div>
</div>
<style>
.range-outer {
    display: inline-flex;
}
.range-wrapper {
    display: flex;
    margin: 4px 0;
    align-items: center;
}
.range-wrapper button {
    padding: 0 4px;
    font-family: monospace;
    margin: 0 10px;
}
#playbackRate {
    display:inline-flex;
}
</style>
</div>
`, "text/html");
          entry.el.appendChild(qS("#range_wrapper", sliderHtml));
          observer.disconnect(targetNode, observerConfig);
        } // end if found
      }); // end foreach
    };

  w.showValue = function (el) {
    qS("#playbackRate").innerHTML = el.value;
    qS("video[id$='_Video']").playbackRate = el.value;
  };
  w.increment = function (el) {
    el.value = parseFloat(el.value) + parseFloat(el.getAttribute("step"));
    w.showValue(el);
    return false;
  };
  w.decrement = function (el) {
    el.value = parseFloat(el.value) - parseFloat(el.getAttribute("step"));
    w.showValue(el);
    return false;
  };
  var observer = new MutationObserver(callback);
  observer.observe(targetNode, observerConfig);
})(window || unsafeWindow);
