// ==UserScript==
// @name         BililiveStatusShow
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  动态直播状态增强
// @author       Xinrea
// @include      https://t.bilibili.com/*
// @exclude      https://t.bilibili.com/h5/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/415618/BililiveStatusShow.user.js
// @updateURL https://update.greasyfork.org/scripts/415618/BililiveStatusShow.meta.js
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
    // https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=
    var liveStatus = {}
    $.ajax({
        url:'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=128',
        xhrFields: {
　　　　　　withCredentials: true
　　　　},
        success : function(liveData) {
            for(var index in liveData["data"]["items"]){
                var i = liveData["data"]["items"][index]
                liveStatus[i["uid"]] = { "title":i["title"], "link":i["link"]}
            }
    }})
    waitForKeyElements('.user-name',insertLiveRoom)
    function insertLiveRoom(jNode) {
        var link = jNode.eq(0).children('a').attr('href')
        if (link == null) return
        var uid = link.replace(/[^0-9]/ig,"")
        if (liveStatus.hasOwnProperty(uid)){
            jNode.eq(0).append('<a title='+liveStatus[uid]["title"]+' href='+liveStatus[uid]["link"]+' style="display: inline-block;font-size: 10px;border: 1px solid #23ade5;border-radius: 3px;padding-left: 7px;padding-right: 7px;color: #23ade5; margin-left: 10px;">直播中</a>')
        }
    }

})();