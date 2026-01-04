// ==UserScript==
// @name         ImDantuiMan
// @namespace    https://www.joi-club.cn/
// @version      0.2
// @description  单推man的觉悟
// @author       Xinrea
// @include      https://t.bilibili.com/*
// @include      https://space.bilibili.com/*/dynamic
// @exclude      https://t.bilibili.com/h5/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/415622/ImDantuiMan.user.js
// @updateURL https://update.greasyfork.org/scripts/415622/ImDantuiMan.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // waitForKeyElements.js: https://gist.github.com/BrockA/2625891
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
    let d = $.ajax({
        url:'https://api.bilibili.com/x/relation/tag?tagid=-10&pn=1&ps=1&jsonp=jsonp',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success : function(liveData) {
            for(var index in liveData["data"]["items"]){
                var i = liveData["data"]["items"][index]
                liveStatus[i["uid"]] = { "title":i["title"], "link":i["link"]}
            }
    }})
    let DaisukiMid = (d.responseJSON.data)[0]["mid"]
    let Self = getCookie("DedeUserID")
    waitForKeyElements('.button-bar',banInteract,false)
    waitForKeyElements('.comment-send',banComment,false)
    function banInteract(jNode) {
        var link = jNode.eq(0).parents(".card").children('a').attr('href')
        if (link == null) return
        var uid = link.replace(/[^0-9]/ig,"")
        if (uid == Self) return
        var bangumi = link.indexOf("bangumi")
        if (uid == DaisukiMid || bangumi != -1){
        } else {
            jNode.eq(0).find(".text-bar").children().remove()
        }
    }
    function banComment(jNode) {
        var link = jNode.eq(0).parents(".card").children('a').attr('href')
        if (link == null) return
        var uid = link.replace(/[^0-9]/ig,"")
        if (uid == Self) return
        if (uid == DaisukiMid){
        } else {
            jNode.eq(0).remove()
        }
    }
    function getCookie(name) {
        var prefix = name + "="
        var start = document.cookie.indexOf(prefix)

        if (start == -1) {
            return null;
        }

        var end = document.cookie.indexOf(";", start + prefix.length)
        if (end == -1) {
            end = document.cookie.length;
        }

        var value = document.cookie.substring(start + prefix.length, end)
        return unescape(value);
    }
})();