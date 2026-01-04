// ==UserScript==
// @name         Bilibili DASH Audio Geter
// @namespace    Bilibili DASH Audio Geter
// @version      0.1
// @description  get dash audio on Bilibili!
// @author       qjzcj2008
// @include      *://www.bilibili.com/video/av*
// @grant        none
// @supportURL   https://github.com/qjzcj2008/Bilibili-DASH-Audio-Geter/issues
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/375420/Bilibili%20DASH%20Audio%20Geter.user.js
// @updateURL https://update.greasyfork.org/scripts/375420/Bilibili%20DASH%20Audio%20Geter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
    var page = document.getElementsByTagName('html')[0].innerHTML;
    var info_rule = "<script>window\.__playinfo__=.*}</script>";
    var playinfo = page.match(info_rule)[0];
    var json_rule = "(?=\{).*(?<=\})";
    var playurl = playinfo.match(json_rule)["0"];
    var jsondata = JSON.parse(playurl);
    var dashaudio = jsondata.data.dash.audio[0].baseUrl;
    var audio_rule = "http[\\S]*m4s";
    var audio_url = dashaudio.match(audio_rule)["0"];
    console.log(audio_url);
    var url = window.location.href;
    var loc;
    var URI="";
    var element,element2,para,childpara,node;
   element = document.getElementsByClassName("a-crumbs")[0];
			para = document.createElement("a");
            para.innerText = " 获取音频";
			para.setAttribute("class","charge-appeal-init");
			para.href = audio_url;
            element.appendChild(para);
    }, 5000);
})();
