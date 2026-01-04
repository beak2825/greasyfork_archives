// ==UserScript==
// @name         谷歌翻译换行
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413066/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%8D%A2%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/413066/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%8D%A2%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    String.prototype.toLine = function(sp) {
        let str = this;
        let _str = "";
        str.split('\n').map(_ => _.trim()).forEach(l => {
            _str += l ? l : '\r\n';
            _str += sp ? ' ' : '';
        });
        return _str;
    }
    function addAction() {
        (() => {
            let div = document.createElement('div');
            div.innerText = "去除换行（行末加空格）";
            'tlid-input-button input-button header-button'.split(' ').forEach(cl => {
                div.classList.add(cl);
            });
            div.style.paddingLeft = "16px";
            div.style.marginLeft = "20px";
            div.style.lineHeight = "34px";
            $('div[aria-label="Main menu"]').parent().append(div);
            $('div[aria-label="主菜单"]').parent().append(div);
            div.onclick = function() {
                let src = $($('textarea')[0]);
                src.val(src.val().toLine(true));
            }
        })();
        (() => {
            let div = document.createElement('div');
            div.innerText = "去除换行（不管）";
            'tlid-input-button input-button header-button'.split(' ').forEach(cl => {
                div.classList.add(cl);
            });
            div.style.paddingLeft = "16px";
            div.style.marginLeft = "20px";
            div.style.lineHeight = "34px";
            $('div[aria-label="Main menu"]').parent().append(div);
            $('div[aria-label="主菜单"]').parent().append(div);
            div.onclick = function() {
                let src = $($('textarea')[0]);
                src.val(src.val().toLine(false));
            }
        })();
        (() => {
            let div = document.createElement('div');
            div.innerText = "去除pdf复制的乱码";
            'tlid-input-button input-button header-button'.split(' ').forEach(cl => {
                div.classList.add(cl);
            });
            div.style.paddingLeft = "16px";
            div.style.marginLeft = "20px";
            div.style.lineHeight = "34px";
            $('div[aria-label="Main menu"]').parent().append(div);
            $('div[aria-label="主菜单"]').parent().append(div);
            div.onclick = function() {
                let src = $($('textarea')[0]);
                src.val(src.val().replace(/\x02/g,''));
            }
        })();
    }
    window.onload = function() {
        let host = location.href.substring(0,location.href.length - location.search.length);
        if (host === 'https://translate.google.com/') {
            setTimeout(() => {
                addAction();
            },5000);
        }
    };
    // Your code here...
})();