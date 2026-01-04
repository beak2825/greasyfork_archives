// ==UserScript==
// @name         Sound Limiter for Weibo & Douyin Video Clips
// @name:zh-CN   微博抖音视频音量限制器
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Limit the default sound volume of video clips on weibo.com to 10%.
// @description:zh-cn  限制微博和抖音视频的默认音量为10%
// @icon         https://raw.githubusercontent.com/hbliu104/weibo-volume-limiter/main/vol_down.png
// @author       https://github.com/hbliu104/weibo-volume-limiter
// @match        https://f.video.weibocdn.com/*
// @match        https://video.h5.weibo.cn/*
// @match        https://*.weibo.com/*
// @match        https://*.douyin.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/427217/Sound%20Limiter%20for%20Weibo%20%20Douyin%20Video%20Clips.user.js
// @updateURL https://update.greasyfork.org/scripts/427217/Sound%20Limiter%20for%20Weibo%20%20Douyin%20Video%20Clips.meta.js
// ==/UserScript==

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

    if (typeof iframeSelector == "undefined"){
        targetNodes = $(selectorTxt);}
    else{
        targetNodes = $(iframeSelector).contents ().find (selectorTxt);}

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (jThis);
                if (cancelFound){
                    btargetsFound = false;}
                else{
                    jThis.data ('alreadyFound', true);}
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (selectorTxt,
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
    waitForKeyElements.controlObj = controlObj;
}

let flag = 0;

waitForKeyElements ("video", volume_down);

function volume_down () {
    let videos = document.querySelectorAll('video');
    for (let idx = 0; idx < videos.length; idx++)
    {
        if (videos[idx].hasAttribute('autoplay')){
            videos[idx].removeAttribute('autoplay');}

        videos[idx].volume = 0.1;
        flag++;
    }
    if (flag < 2){
        return true;}
}
