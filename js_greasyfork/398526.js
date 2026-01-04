// ==UserScript==
// @name         Give me AV not BV
// @namespace    https://xsky123.com
// @version      1.4
// @description  F**king Bilibili, give my av number back!
// @author       XSky123
// @supportURL   https://greasyfork.org/zh-CN/scripts/398526
// @license      WTFPL
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/s/video/*
// @match        https://acg.tv/*
// @match        https://b23.tv/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398526/Give%20me%20AV%20not%20BV.user.js
// @updateURL https://update.greasyfork.org/scripts/398526/Give%20me%20AV%20not%20BV.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* Basic Arguments for func BVtoAV_Formula
      Python to JavaScript：Mannix_Wu
      QQ:3068758340
      E-mail:Steveandjobs3068758340@gmail.com
      如果要使用这段代码请保留这两个注释
    */
    var bv_table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
    var bv_tr = {};
    for (let i = 0; i < 58; i++) {
        bv_tr[bv_table[i]] = i;
    }
    var bv_s = [11, 10, 3, 8, 4, 6];
    var bv_xor = 177451812,
        bv_add = 8728348608;
    /**
     * @method DetectURLType
     * @return {number} type_num, 1 for normal, 2 for watchlater, 0 for error
     * @description: get url type
     */
    let DetectURLType = function () {
        if(window.location.href.match(/.*\/video\/(BV|bv).*/)){
            console.log("[AVnoBV] Detected BV Number");
            return 1;
        }else{
            console.log("[AVnoBV] Failed to detected BV Number");
            return 0;
        }
    };


    /**
     * @method URLReplace
     * @param {number} aid - av number
     * @param {number} page - which p
     * @param {string} hashtag - if has hashtag(for comment), only when mode 1
     * @description: perform page url change
     */
    let URLReplace = function(aid, page=1, hashtag=""){
        var _url;
        if (!aid){
            console.warn("[AVnoBV] Failed to replace bv number, prehaps it's a bangumi page.");
            return;
        }
        switch (AVnoBV_MODE) {
            case 1:
                _url = `https://www.bilibili.com/video/av${aid}`;
                if (page > 1) {
                    _url += `?p=${page}`;
                }
                if (hashtag !== ""){
                    _url += hashtag;
                }
                break;

          /*  case 2:
                _url = `https://www.bilibili.com/medialist/play/watchlater/av${aid}`;
                if (page > 1) {
                    _url += `/p${page}`;
                }
                break;*/
        }
        history.replaceState(null, null, _url);
        console.log("[AVnoBV] F**k You BV Number!");
    };


    /**
     * @method WriteAVNumber
     * @description: Parent function for av number element writing
     */
    let WriteAVNumber = function () {
        var MutationObserver = window.MutationObserver;
        var PageBodyElement = document.querySelector("body");
        var DocumentObserverConfig = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        var DetectAndWriteAVNumber = function () {

        };

        switch (AVnoBV_MODE) {
            case 1:
                DetectAndWriteAVNumber = DetectAndWriteAVNumber_Normal;
                window.RanderFinishObserver = new MutationObserver(DetectAndWriteAVNumber);
                window.RanderFinishObserver.observe(PageBodyElement, DocumentObserverConfig);
                break;



        }

    };

    /**
     * @method DetectAndWriteAVNumber_Normal
     * @description: Observer for normal situation.
     */
    let DetectAndWriteAVNumber_Normal = function(mutationsList) {
        if(document.querySelector('.bilibili-player-danmaku, .player-auxiliary-danmaku-wrap')){
            WriteAVNumberElement();
            window.RanderFinishObserver.disconnect();
        }
    };




    /**
     * @method WriteAVNumberElement
     */
    let WriteAVNumberElement = function () {
        switch (AVnoBV_MODE) {
            case 1:
                WriteAVNumberElementNormal();
                break;
           /* case 2:
                WriteAVNumberElementWatchlater();
                break;*/
        }
        console.log("[AVnoBV] Add av number successfully!");
    };


    let WriteAVNumberElementNormal = function () {
        var video_info_element = document.getElementsByClassName("video-data")[0];
        var aid_span = document.createElement("span");
        var aid_link = document.createElement("a");
        aid_span.className = "a-crumbs";
        aid_span.style.marginLeft = "16px";
        aid_link.href = window.location.href;
        aid_link.innerText = `av${window.__INITIAL_STATE__.aid}`;
        aid_link.style.color = "#9499A0";
        aid_span.appendChild(aid_link);
        video_info_element.appendChild(aid_span);
    };

    /**
     * @method ChangeURL
     * @description: Parent function for URL changing
     */
    let ChangeURL = function () {
        switch (AVnoBV_MODE) {
            case 1:
                ChangeURL_Normal();
                break;
          /* case 2:
                ChangeURL_Watchlater();
                break; */
        }
    };

    /**
     * @method ChangeURL_Normal
     * @description: URL changing directly when normal situation
     */
    let ChangeURL_Normal = function () {
        var p_match = window.location.href.match(/\?p\=(\d+)/); // Detect P, though a little ugly : P
        var comment_match = window.location.hash.substr('#', 6) === '#reply'; // Detect Comment Hash Mark
        var aid;
        if(!window.__INITIAL_STATE__){ // SEO Page
            var bvid = window.location.href.match(/\/video\/(.*)/)[1];
            aid = BVtoAV_Formula(bvid);
            URLReplace(aid, p_match?p_match[1]:1, comment_match?window.location.hash:"");
            location.reload(); // refresh
        }else{
            aid = window.__INITIAL_STATE__.aid;
            URLReplace(aid, p_match?p_match[1]:1, comment_match?window.location.hash:"");
        }
    };

    /**
     * @method BVtoAV_Formula
     * @description: Formula method to convert bv number,
     * thanks to Mannix_Wu and mcfx.
     *
     * @param {string} bvid - bvid as string, should include "BV" itself
     * @return {number} avid - avid as integer
     */
     function BVtoAV_Formula(bvid) {
         var r = 0;
         for (let i = 0; i < 6; i++) {
             r += bv_tr[bvid[bv_s[i]]] * Math.pow(58, i);
         }
         return (r - bv_add) ^ bv_xor;
     }


    /**
     *  SCRIPT RUNS FROM HERE
     */
    var AVnoBV_MODE = DetectURLType();
    ChangeURL();
    WriteAVNumber();


})();