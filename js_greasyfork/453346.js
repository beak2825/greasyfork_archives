// ==UserScript==
// @name        Jellyfin 播放速度
// @namespace    http://tampermonkey.net/
// @license           AGPL
// @description  jellyfin player fast scroll settings
// @description:zh-cn jellyfin播放速度继承上次的设置
// @match        *://192.168.31.4:8920/*
// @match        *://192.168.31.4:8096/*
// @version     0.0.2
// @author      zhouyuguang
// @description 2022/10/19 13:56:45
// @downloadURL https://update.greasyfork.org/scripts/453346/Jellyfin%20%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/453346/Jellyfin%20%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let delay = 1000;
    let timer;

    function ckeck()
    {
        return $("video").length > 0;
    }

    function getLocalStorage(item)
    {
        var strItems = localStorage.getItem(item);
        var items = JSON.parse(strItems);
        if (items === null) {
            items = {};
        }
        return items;
    }

    function setLocalStorage(item,value)
    {
        var strItems = JSON.stringify(value);
        localStorage.setItem(item, strItems);
    }

    function getPlaybackRate()
    {
        let playbackRate = parseFloat($("video")[0].playbackRate);
        return playbackRate;
    }

    function setPlaybackRate(rate)
    {
        $("video")[0].addEventListener('playing', function () { //播放开始执行的函数
             $("video")[0].playbackRate = rate
        });
    }

    function JellyfinMain()
    {
        if(ckeck())
        {
            $("[is=emby-button].actionSheetMenuItem[data-id]").bind("click",function(){
                let value = parseFloat($(this).attr("data-id"));
                if(!isNaN(value) && value>0 && value<=16)
                {
                    setLocalStorage("jellyfinScript",{"rate":value});
                }

            })
            let rateValue = getLocalStorage("jellyfinScript")
            if(Object.keys(rateValue).length != 0)
            {
                if(rateValue.rate != getPlaybackRate())
                {
                    setPlaybackRate(rateValue.rate)
                }
            }
        }
        clearTimeout(timer);
        timer = setTimeout(() => JellyfinMain(), delay);
    }

    JellyfinMain();
    window.addEventListener("load", () => {
        clearTimeout(timer);
        setTimeout(() => JellyfinMain(), delay);
    });
})();