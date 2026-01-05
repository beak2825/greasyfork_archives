// ==UserScript==
// @name 163 Music Reviver
// @namespace https://greasyfork.org/users/3115-sait2000
// @version 0.1
// @description music.163.com reviver
// @include http://music.163.com/*
// @exclude http://music.163.com/m/*
// @copyright 2016+, Sait2000
// @run-at document-end
// @grant unsafeWindow
// @require https://greasyfork.org/scripts/15379-installxhook/code/installXHook.js?version=96218
// @downloadURL https://update.greasyfork.org/scripts/15865/163%20Music%20Reviver.user.js
// @updateURL https://update.greasyfork.org/scripts/15865/163%20Music%20Reviver.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if ('GAbroad' in unsafeWindow) {
        unsafeWindow.GAbroad = false;
    }
    function removeClass (class_)  {
        var elList = document.getElementsByClassName(class_);
        elList = Array.prototype.slice.call(elList);
        for (var i = 0, l = elList.length; i < l; i++) {
            elList[i].classList.remove(class_);
        }
    }
    removeClass('js-dis');
    var pt_frame_index = false;
    for (var i = 0, l = document.scripts.length; i < l; i++) {
        var script = document.scripts[i];
        if (script.src && script.src.indexOf('pt_frame_index') >= 0) {
            pt_frame_index = true;
            break;
        }
    }
    if (pt_frame_index) {
        var xhook = installXHook(unsafeWindow);
        xhook.enable();
        xhook.after(function (req, resp, cb) {
            if (req.url !== '/weapi/song/enhance/player/url?csrf_token=') {
                cb();
                return;
            }
            var obj = JSON.parse(resp.text);
            if (!(obj.code == 200 && obj.data && obj.data.length)) {
                cb();
                return;
            }
            var xhr = new xhook.XMLHttpRequest();
            xhr.open('GET', 'http://music.163.com/api/song/detail?ids=[' + obj.data[0].id + ']', true);
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    return;
                }
                var nobj = JSON.parse(xhr.responseText);
                if (nobj.code !== 200) {
                    return;
                }
                var mp3Url = nobj.songs[0].mp3Url;
                mp3Url = mp3Url.replace(/m\d+\.music\.126\.net/, 'm5.music.126.net');
                obj.data[0].url = mp3Url;
                resp.text = JSON.stringify(obj);
            };
            xhr.onloadend = function () {
                cb();
            };
            xhr.send();
        });
    }
})();
