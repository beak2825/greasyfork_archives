// ==UserScript==
// @name         AbemaTVでショートカットキーで再生速度を変更する
// @namespace    https://armedpatriot.blog.fc2.com/
// @version      1.0.0
// @description  AbemaTVの動画の再生速度を、ショートカットキー(デフォルト:Shift+,/.)で変更できるようにするスクリプトです。
// @author       Patriot
// @homepageURL  https://armedpatriot.blog.fc2.com/
// @run-at       document-idle
// @match        https://abema.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377645/AbemaTV%E3%81%A7%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC%E3%81%A7%E5%86%8D%E7%94%9F%E9%80%9F%E5%BA%A6%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377645/AbemaTV%E3%81%A7%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC%E3%81%A7%E5%86%8D%E7%94%9F%E9%80%9F%E5%BA%A6%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showPlaybackRateSecond=500,// 再生速度を表示する時間[ms]
          textContainerClassName="patriot_playbackRateTextContainer",
          textID="patriot_playbackRateText",
          textClassNameVisible="patriot_playbackRateText_visible",
          videoElementSelector=`video[src^="blob:"]`;

    let videoElement=document.querySelector(videoElementSelector),
        visibleCount=0;

    const showPlaybackRateTemporarily=(nextPlaybackRate)=>{
        nextPlaybackRate=parseFloat(nextPlaybackRate.toFixed(1));// 浮動小数点演算の誤差を消す
        videoElement.playbackRate=nextPlaybackRate;
        videoElement.defaultPlaybackRate=nextPlaybackRate;

        let textElement=document.getElementById(textID);
        textElement.textContent=videoElement.playbackRate.toFixed(1);
        textElement.className=textClassNameVisible;
        ++visibleCount;

        setTimeout(
            ()=>{
                --visibleCount;
                if(visibleCount===0){
                    textElement.className="";
                }
            },
            showPlaybackRateSecond
        );
    };

    document.addEventListener("keydown", (e) => {
        let currentPlaybackRate=videoElement.playbackRate;

        switch(e.key){
            case "<":
                showPlaybackRateTemporarily(currentPlaybackRate>0.1 ? currentPlaybackRate-0.1 : currentPlaybackRate);
                break;
            case ">":
                showPlaybackRateTemporarily(currentPlaybackRate<16.0 ? currentPlaybackRate+0.1 : currentPlaybackRate);
                break;
        }
    });

    let styleElement = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleElement);

    let css = styleElement.sheet;
    css.insertRule(`.${textContainerClassName}{position:absolute;left:0;right:0;text-align:center;z-index:9;}`, css.cssRules.length);
    css.insertRule(`#${textID}, .${textClassNameVisible}{display:inline-block;margin-top:1em;padding:0.2em 0.5em;font-size:1.5em;color:#ffffff9c;background-color:#00000057;user-select:none;visibility:hidden;}`, css.cssRules.length);
    css.insertRule(`#${textID}.${textClassNameVisible}{visibility:visible;}`, css.cssRules.length);

    let textContainerElement = document.createElement("div"),
        textElement = document.createElement("div");
    textElement.textContent=1.0;
    textContainerElement.className=textContainerClassName;
    textElement.id=textID;
    textContainerElement.appendChild(textElement);

    let loopID=setInterval(
        ()=>{
            if(!videoElement){
                videoElement=document.querySelector(videoElementSelector);
            }
            if(videoElement){
                clearInterval(loopID);
                document.getElementsByClassName("com-a-Video__video")[0].appendChild(textContainerElement);
            }
        },
        500
    );
})();