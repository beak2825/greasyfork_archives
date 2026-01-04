// ==UserScript==
// @name         EHentai Auto Loader
// @namespace    https://e-hentai.org
// @version      1.2
// @description  Help you read comics smoothly with auto loading more pages
// @author       Neal
// @match        https://e-hentai.org/s/*
// @match        https://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32715/EHentai%20Auto%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/32715/EHentai%20Auto%20Loader.meta.js
// ==/UserScript==

function AddGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) return;
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var index = document.location.href;
var all = document.getElementsByTagName('a');
var next = all[2].href;
var last = all[3].href;
var src = all[4].children[0].src;
var srcarray = [src];
var fail = index.indexOf('exhentai.org') > -1 ? index + '?nl=' + String(all[11].onclick).match('[0-9].*[0-9]')[0] : index + '?nl=' + String(all[12].onclick).match('[0-9].*[0-9]')[0];
var failarray = [fail];

var current = 1;
var img = new Image();
var span = document.createElement('span');
var link = document.createElement('a');

function LoadManga() {
    AddGlobalStyle('body {background: black}');
    AddGlobalStyle('img {max-width: 1280px; margin: 0 auto; display: block}');
    AddGlobalStyle('span {color: white; text-align: center; font-size: 15px; font-weight: bold; margin: 10px auto; display: block}');
    AddGlobalStyle('a {color: white; text-decoration: none; text-align: center; font-size:15px; font-weight: bold; margin: 10px auto; display: block} a:hover {color: white; text-decoration: underline}');

    img.src = src;
    img.onload = function () { window.scrollTo(0, 0); };
    document.body.innerHTML = '';
    document.body.appendChild(img);

    span.innerHTML = 'Press Ctrl to Toggle between Auto Mode and Native Mode. Load Status: < 1 / 1 >.';
    document.body.appendChild(span);

    link.href = fail;
    link.innerHTML = 'Press Enter or Click Here to Reload Current Image.';
    document.body.appendChild(link);
}

function LoadStatus() {
    span.innerHTML = 'Press Ctrl to Toggle between Auto Mode and Native Mode. ' + 'Load Status: < ' + current + ' / ' + srcarray.length + ' >.';
}

function LoadImage(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        callback.call(img);
        return;
    }
    img.onload = function() {
        callback.call(img);
    };
}

var end = 0;
var count = 10;
function PreloadImage() {
    var htm = document.implementation.createHTMLDocument('temp');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            htm.documentElement.innerHTML = xhr.responseText;
            all = htm.getElementsByTagName('a');
            src = all[4].children[0].src;
            LoadImage(src, LoadStatus);
            srcarray.push(src);
            var failstart = xhr.responseText.indexOf('nl') + 4;
            var failend = xhr.responseText.substr(failstart, 30).indexOf('\'');
            fail = next + '?nl=' + xhr.responseText.substr(failstart, failend);
            failarray.push(fail);
            next = all[2].href;
            if (next == last) {
                if (!end) {
                    end = 1;
                    PreloadImage();
                }
            }
            else {
                if (count > 0) PreloadImage(); else count = 10;
            }
        }
    };
    xhr.open('GET', next, true);
    xhr.send();
    count--;
}

var reload = 0;
function ReloadImage() {
    if (!reload) {
        var htm = document.implementation.createHTMLDocument('temp');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200){
                htm.documentElement.innerHTML = xhr.responseText;
                srcarray[current - 1] = htm.getElementsByTagName('a')[4].children[0].src;
                img.src = srcarray[current - 1];
                var failstart = xhr.responseText.indexOf('nl') + 4;
                var failend = xhr.responseText.substr(failstart, 30).indexOf('\'');
                failarray[current - 1] = failarray[current - 1] + '&nl=' + xhr.responseText.substr(failstart, failend);
                link.href = failarray[current - 1];
                reload = 0;
            }
        };
        xhr.open('GET', failarray[current - 1], true);
        xhr.send();
        reload = 1;
    }
}

function PrevImage() {
    if (current > 1) {
        img.src = srcarray[current-- - 2];
        link.href = failarray[current - 1];
        LoadStatus();
    }
}

function NextImage() {
    if (current < srcarray.length) {
        img.src = srcarray[current++];
        link.href = failarray[current - 1];
        LoadStatus();
    }
    if (count == 10 && current == srcarray.length) PreloadImage();
}

var preload = 0;
document.onkeydown = function (event) {
    switch (event.which) {
        case 37:
            event.preventDefault();
            if (preload !== 0) PrevImage();
            break;
        case 38:
            event.preventDefault();
            window.scrollBy(0, -100);
            break;
        case 39:
            event.preventDefault();
            if (preload !== 0) NextImage();
            break;
        case 40:
            event.preventDefault();
            window.scrollBy(0, +100);
            break;
        case 13:
            event.preventDefault();
            if (preload !== 0) ReloadImage();
            break;
        case 17:
            event.preventDefault();
            if (preload === 0) {
                preload = 1;
                LoadManga();
                LoadStatus();
                PreloadImage();
                img.onclick = function (event) {
                    event.preventDefault();
                    if (event.clientX <= document.body.clientWidth / 2)
                        PrevImage();
                    else
                        NextImage();
                };
                link.onclick = function (event) {
                    event.preventDefault();
                    ReloadImage();
                };
            }
            else {
                preload = 0;
                document.location.reload();
            }
            break;
    }
};