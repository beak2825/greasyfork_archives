// ==UserScript==
// @name         epic信息提取
// @version      0.1.1
// @description  复制epic游戏的发行商开发商发行日期
// @author       zzy
// @match        https://store.epicgames.com/zh-CN/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epicgames.com
// @grant        unsafeWindow
// @license      MIT
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @namespace https://greasyfork.org/users/769762
// @downloadURL https://update.greasyfork.org/scripts/449202/epic%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449202/epic%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
var _self = unsafeWindow,
    $ = _self.jQuery || top.jQuery;

(function () {
    waitForKeyElements("time", showButton);
})();
function showButton() {
    var shortButton, bodyBase;
    shortButton = document.createElement("div");
    bodyBase = document.querySelector("body");
    bodyBase.appendChild(shortButton);
    shortButton.innerHTML = "复制";
    shortButton.style = "position:fixed;top:100px;left:30px;width:60px;height:60px;background:red;opacity:0.8;color:white;text-align:center;line-height:60px;cursor:pointer;";
    shortButton.onclick = function () {
        var intro = isCopying();
        if (intro != "") {
            toClip(intro);
            shortButton.innerHTML = "复制成功";
        } else {
            shortButton.innerHTML = "复制失败";
        }
        var i = 0;
        var t = setInterval(function () {
            shortButton.innerHTML = "复制";
            i++;
            if (i == 2) clearInterval(t);
        }, 1000);
    };

}

function isCopying() {
    var allInfo = "";
    var d = document.evaluate('//*[@id="dieselReactWrapper"]/div/div[4]/main/div[2]/div/div/div/div[2]/div[3]/div/aside/div/div/div[7]/div/div[1]/div/div/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var p = document.evaluate('//*[@id="dieselReactWrapper"]/div/div[4]/main/div[2]/div/div/div/div[2]/div[3]/div/aside/div/div/div[7]/div/div[2]/div/div/span', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var r = document.evaluate('//*[@id="dieselReactWrapper"]/div/div[4]/main/div[2]/div/div/div/div[2]/div[3]/div/aside/div/div/div[7]/div/div[3]/div/div/span/time', document, null, XPathResult.ANY_TYPE, null).iterateNext();

    var developer = "developer: " + d.innerHTML + "\n";
    var publisher = "publisher: " + p.innerHTML + "\n";
    var rdate = "releasedate: " + r.innerHTML;
    allInfo = developer + publisher + rdate;
    return allInfo;
}

function toClip(info) {
    try {
        navigator.clipboard.writeText(info);
    } catch (error) {
        console.log(error);
    }

}

function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") { targetNodes = $(selectorTxt); }
    else { targetNodes = $(iframeSelector).contents().find(selectorTxt); }

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound) { btargetsFound = false; }
                else { jThis.data('alreadyFound', true); }
            }
        });
    }
    else {
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
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                    actionFunction,
                    bWaitOnce,
                    iframeSelector
                );
            },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}