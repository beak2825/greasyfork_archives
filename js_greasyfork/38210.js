// ==UserScript==
// @name         Darling in the iqiyi
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  爱奇艺国家队 720p 观看脚本
// @author       REK
// @include      http://www.iqiyi.com/*
// @include      https://www.iqiyi.com/*
// @include      http://so.iqiyi.com/*
// @include      https://so.iqiyi.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/38210/Darling%20in%20the%20iqiyi.user.js
// @updateURL https://update.greasyfork.org/scripts/38210/Darling%20in%20the%20iqiyi.meta.js
// ==/UserScript==

function start() {
    var str1 = 'http://so.iqiyi.com/so/q_darling';
    var str2 = 'https://so.iqiyi.com/so/q_darling';
    var flag1 = window.location.href.toLowerCase().indexOf(str1);
    var flag2 = window.location.href.toLowerCase().indexOf(str2);
    if (flag1 > -1 || flag2 > -1) {
        fetchAnimeList();
    }
}
function fetchAnimeList() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                removeVideoCannotAutoplayTips(xhr.responseText);
            } else {
                alert('获取列表失败');
            }
        }
    };
    xhr.open('GET', 'https://so.tw.iqiyi.com/so/q_DARLING%20in%20the%20FRANXX', true);
    xhr.send(null);
}

function removeVideoCannotAutoplayTips(sourceCode) {
    var baseHtml = document.createElement( 'html' );
    baseHtml.innerHTML = sourceCode;
    fetchArrs = baseHtml.getElementsByClassName('album_link');
    var len = (fetchArrs.length - 1)/2;
    var animeArr = new Array(len);
    for (var i=0; i<len; i++) {
        animeArr[i] = fetchArrs[i];
    }
    createButtonWithAnimeArr(animeArr);
}

function createButtonWithAnimeArr(animeArr) {
    for (var i=0; i<animeArr.length;i++) {
        var btn = document.createElement("BUTTON");
        if (i%2 == 0) {
            btn.style.backgroundColor = '#1BA8DE';
        } else {
            btn.style.backgroundColor = '#FC4129';
        }
        btn.style.color = '#FFFFFF';
        btn.style.height = '50px';
        btn.style.width = '150px';
        btn.style.position = 'absolute';
        var left = (window.screen.width/2 + (i%5 - animeArr.length/2) *200 - 150) + 'px';
        btn.style.left = left;
        var top = window.screen.height/2 - 50 + Math.floor(i/5) *60 + 'px';
        btn.style.top = top;
        var name = '第'+ (i+1) +'集';
        var t = document.createTextNode(name);
        btn.appendChild(t);
        let url = animeArr[i].href;
        btn.addEventListener ("click", function() {
            darlingUrl = 'http://api.baiyug.cn/vip/index.php?url=' + url;
            window.location.href = darlingUrl;
        });
        document.body.appendChild(btn);
    }
}

start();