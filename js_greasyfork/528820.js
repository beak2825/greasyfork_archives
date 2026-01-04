// ==UserScript==
// @name         full all iframe
// @namespace    ttjz_full_all_iframe
// @version      1.1
// @description  所有iframe 设为宽高100%
// @author       tongtianjiaozhu
// @license       MIT
// @match        *://*/*
// @run-at document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/528820/full%20all%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/528820/full%20all%20iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listenerId
    var resetListenerId
    let originWidth
    let originHeight
    function addValueChangeListener() {
        listenerId = GM_addValueChangeListener("currentFrame", function(key, oldValue, newValue, remote) {
            if(newValue===window.location.href) fullIframeApi()
        });
    }
    function addResetValueChangeListener() {
        resetListenerId = GM_addValueChangeListener("currentResetFrame", function(key, oldValue, newValue, remote) {
            if(newValue===window.location.href) resetframeApi()
        });
    }
    function completeSrc(src) {
        let mySrc = src
        if(mySrc.search(/^[^\?]+:\/\//)===-1) {
            let arr = window.location.href.split('://')
            mySrc = arr[0]+'://'+arr[1].split('/')[0]+(mySrc[0]==='/'?'':'/')+mySrc
        }
        return src
    }
    let fullIframeApi = () => {
        let myFrames = document.getElementsByTagName('iframe')
        for(let i =0;i<myFrames.length;i++){
            let myFrame = myFrames[i]
            originWidth = myFrame.width
            originHeight = myFrame.height
            myFrame.width = '100%'
            myFrame.height = '100%'
            let mySrc = myFrame.src
            mySrc = completeSrc(mySrc)
            GM_setValue('currentFrame', mySrc)
        }
        if(myFrames.length<=0) {
            GM_setValue('currentFrame', '')
        }
    }
    let resetframeApi = () => {
        let myFrames = document.getElementsByTagName('iframe')
        for(let i =0;i<myFrames.length;i++){
            let myFrame = myFrames[i]
            if(originWidth) myFrame.width = originWidth
            if(originHeight) myFrame.height = originHeight
            let mySrc = myFrame.src
            mySrc = completeSrc(mySrc)
            GM_setValue('currentResetFrame', mySrc)
        }
        if(myFrames.length<=0) {
            GM_setValue('currentResetFrame', '')
        }
    }
    unsafeWindow.fullIframeApi = fullIframeApi
    unsafeWindow.resetframeApi = resetframeApi
    addValueChangeListener()
    addResetValueChangeListener()
})();