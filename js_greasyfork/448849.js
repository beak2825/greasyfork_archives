// ==UserScript==
// @name         B站动态按关注分类分组
// @namespace    https://zhufn.fun/
// @version      0.1
// @description  本地存储关注分类信息，然后对着信息流一个一个筛
// @author       zfn
// @match        *://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license gpl-3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448849/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%B1%BB%E5%88%86%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/448849/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%B1%BB%E5%88%86%E7%BB%84.meta.js
// ==/UserScript==
console.log("bilifilter!")
var lst = 0

function filter(name) {
    var list = $(".bili-dyn-title__text")
    var fo = JSON.parse(localStorage.bf_follows)
    var tags = JSON.parse(localStorage.bf_tags)
    var mp = {}
    var fomp = {}
    for (var v in tags.data) {
        mp[tags.data[v].name] = tags.data[v].tagid
    }
    for (v in fo) {
        fomp[fo[v].uname] = fo[v].tag
    }
    console.log(mp)
    console.log(fomp)
    for (v = 0;v < list.length; ++v) {
        var cutag = fomp[list[v].innerText]
        var flag = false
        for (var u in cutag) {
            if (cutag[u] == mp[name]) {
                flag = true
                break
            }
        }
        console.log(v)
        if (flag) {
            list[v].parentElement.parentElement.parentElement.parentElement.style="display:block"
        } else {
            list[v].parentElement.parentElement.parentElement.parentElement.style="display:none"
        }
    }
}
window.filter = filter
function addbut(){
    console.log("addbut")
    var a=$(".bili-dyn-up-list")
    var b=document.createElement("button")
    b.innerText="更新列表"
    b.onclick=async function() {
        console.log("updating tags")
        localStorage.setItem("bf_tags", await (await fetch("https://api.bilibili.com/x/relation/tags",{ credentials: 'include'})).text())
        var follow = []
        var i = 1
        while (true) {
            var res = await (await fetch("https://api.bilibili.com/x/relation/followings?vmid=39100231&pn=" + i,{ credentials: 'include'})).json()
            i++
            console.log(res)
            var nw = res.data.list
            if (nw.length == 0) break
            follow = follow.concat( nw)
            console.log(follow)
        }
        localStorage.setItem("bf_follows",JSON.stringify(follow))
    }
    a.append("使用前请先<br>")
    a.append(b)
    var c=$(".bili-dyn-list-tabs__list")
    var d = document.createElement("input")
    d.type="text"
    var e=document.createElement("button")
    e.innerText="确定"
    e.onclick = function() {
            filter(d.value)
    }

    c.append(d)
    c.append(e)
    $(window).scroll(function(){
        //console.log("gun")
        var list = $(".bili-dyn-list__items")[0]
        console.log(list.children.length)
        if (list.children.length > lst) {
            console.log("update")
            filter(d.value)
            lst = list.children.length
        }
    })
}
waitForKeyElements ('[class="bili-dyn-up-list"]', addbut);
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
