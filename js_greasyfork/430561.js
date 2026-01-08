// ==UserScript==
// @name         BiliDynamicTop
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  Set top dynamic on detail page, for old page
// @author       You
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/430561/BiliDynamicTop.user.js
// @updateURL https://update.greasyfork.org/scripts/430561/BiliDynamicTop.meta.js
// ==/UserScript==

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

(function() {
    'use strict';
    let url_text = window.location.href;
    let dynamicID = "";
    let typeOpus = url_text.includes("opus");
    if (typeOpus) {
    let m = url_text.slice(url_text.indexOf(".com/opus/") + 10);
    let q = m.indexOf("?");
    dynamicID = m.slice(0, q);
    if (q == -1) {
        dynamicID = m
    }
    } else {
     let m = url_text.slice(url_text.indexOf(".com/") + 5);
    let q = m.indexOf("?");
    dynamicID = m.slice(0, q);
    if (q == -1) {
        dynamicID = m
    }
 }
    console.log(dynamicID);
    if (dynamicID == "") {
        console.log("not dynamic page");
        return;
    }
    let selector = "#app > div.content > div.card > div.bili-dyn-item > div > div.bili-dyn-item__header > div.bili-dyn-item__more > div > div > div > div > div";
    if (typeOpus) {
        selector = "#app > div.opus-detail > div.bili-opus-view > div.opus-module-author > div.opus-module-author__right > div.opus-module-author__more > div > div > div > div > div";
    }
    waitForKeyElements(selector ,(e)=>{
        let topButton = $(`<div class="bili-cascader-options__item"><div class="bili-cascader-options__item-custom"><div><div class="bili-cascader-options__item-label">置顶</div></div></div></div>`).click((self)=>{
            let csrf = getCookie("bili_jct");
            $.ajax({
                url:"https://api.bilibili.com/x/dynamic/feed/space/set_top?csrf=" + csrf,
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify({
                dyn_str: dynamicID,
                }),
                xhrFields: {
                    withCredentials: true
                },
            });
            topButton.remove();
        });
        console.log(e);
        e.append(topButton[0]);
    })
})();



function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}