// ==UserScript==
// @name        picksky
// @version      1.0
// @description 复制游民星空的游戏评测与游民众评的标签
// @author       yaleiyale
// @match       https://www.gamersky.com/review/*
// @match       https://ku.gamersky.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=gamersky.com
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/769762
// @downloadURL https://update.greasyfork.org/scripts/448276/picksky.user.js
// @updateURL https://update.greasyfork.org/scripts/448276/picksky.meta.js
// ==/UserScript==
var _self = unsafeWindow,
    $ = _self.jQuery || top.jQuery;

(function () {
    var main = {
        init() {
            if (/ku.gamersky.com/.test(location.host)) {
                copyTagInit();
            }
            if (/www.gamersky.com/.test(location.host)) {
                copyArticleInit();
            }
        }
    }
    main.init();
})();

function copyTagInit() {
    $('document').ready(function () {
        waitForKeyElements("body > div.Mid > div.Mid_R > div.WJCYtag > span", showBtnTag);
    });
}

function copyArticleInit() {
    $('document').ready(function () {
        waitForKeyElements("body > div.Mid > div.Mid_L > div.MidLcon", showBtnArticle);
    });
}

function showBtnArticle() {
    var summaryStyle = "position:fixed;top:100px;left:30px;width:60px;height:60px;background:red;opacity:0.8;color:white;text-align:center;line-height:60px;cursor:pointer;";
    CopyButtonFactory("复制概要", document.body, summaryStyle, copySummary);
    var introStyle = "position:fixed;top:180px;left:30px;width:60px;height:60px;background:red;opacity:0.8;color:white;text-align:center;line-height:60px;cursor:pointer;";
    CopyButtonFactory("复制评文", document.body, introStyle, copyArticle);
}

function showBtnTag() {
    var tagStyle = "position:fixed;top:100px;left:30px;width:60px;height:60px;background:red;opacity:0.8;color:white;text-align:center;line-height:60px;cursor:pointer;";
    CopyButtonFactory("复制标签", document.body, tagStyle, copyTags);
}

function CopyButtonFactory(title, host, style, func) {
    var btn = document.createElement("div");
    host.appendChild(btn);
    btn.innerHTML = title;
    btn.style = style;
    btn.onclick = function () {
        var result = func();
        if (result) btn.innerHTML = "复制成功";
        else btn.innerHTML = "复制失败";
        var i = 0;
        var t = setInterval(function () {
            btn.innerHTML = title;
            i++;
            if (i == 2) clearInterval(t);
        }, 1000);
    }
}

function copySummary() {
    var allInfo = "";
    var nameit = "#游戏/简评\n\n" + document.querySelector("body > div.Top > div.Top2 > div > h1").innerHTML + " ~ " + document.querySelector("body > div.Mid > div.Mid_R > div.pingce2 > div > div.pc1 > div > div.txt2").innerHTML;
    var recommendto = getList("body > div.Mid > div.Mid_R > div.pingce2 > div > div.pc2 > div.tuijian", "#游戏/推荐人群").replace("- 推荐人群：<br>", "");
    var advantages = getList("body > div.Mid > div.Mid_R > div.pingce2 > div > div.pc2 > div.like.lk1 > span", "#游戏/优点");
    var disadvantages = getList("body > div.Mid > div.Mid_R > div.pingce2 > div > div.pc2 > div.like.lk2 > span", "#游戏/缺点");
    //var introduction = document.querySelector("body > div.Mid > div.Mid_L > div.MidLcon").innerHTML.replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
    allInfo = allInfo + nameit + "\n" + window.location.href + "\n" + recommendto + advantages + disadvantages + "\n---\n";//+ introduction;
    if (allInfo != "") {
        toClip(allInfo);
        return true;
    } else return false;
}

function copyArticle() {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(document.querySelector("body > div.Mid > div.Mid_L > div.MidLcon"));//需要复制的内容的ID
    selection.addRange(range);
    try {
        document.execCommand("copy");
        return true;
    } catch (error) {
        return false;
    }
}

function copyTags() {
    let list = document.querySelectorAll("body > div.Mid > div.Mid_R > div.WJCYtag > span > a");
    let tags = "";
    for (let i = 0; i < list.length; i++) {
        let oneTag = "游戏/" + list[i].innerHTML;
        tags += oneTag + " ";
    }
    if (tags.replace("游戏/", "").replace(" ", "") != "") {
        toClip(tags);
        return true;
    } else return false;
}

function getList(s, tag) {//获取某项列表
    var listLike = document.querySelectorAll(s);
    var total = listLike.length;
    var string = "\n" + tag + "\n";
    for (var i = 0; i < total; i++) { string = string + "- " + listLike[i].innerHTML + "\n"; }
    return string;
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
