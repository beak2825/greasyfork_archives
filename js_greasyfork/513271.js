// ==UserScript==
// @name        115_jump_to_jav
// @namespace   Violentmonkey Scripts
// @match       *://v.anxia.com/*
// @grant       none
// @version     1.0
// @author      y
// @description 2024/10/20 16:59:03
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513271/115_jump_to_jav.user.js
// @updateURL https://update.greasyfork.org/scripts/513271/115_jump_to_jav.meta.js
// ==/UserScript==

(function() {
  'use strict';


  // javdb
  var e_span = document.createElement('span');
  e_span.textContent = '跳转javdb';

  var e_a = document.createElement('a');
  e_a.addEventListener('click', function(event) {
    callJavdb();
  });
  e_a.appendChild(e_span);
  e_a.href = '#';
  e_a.classList.add('vt-btn');

  var e_li = document.createElement('li');
  e_li.appendChild(e_a);

  // javbus
  var e_span2 = document.createElement('span');
  e_span2.textContent = '跳转javbus';

  var e_a2 = document.createElement('a');
  e_a2.addEventListener('click', function(event) {
    callJavbus();
  });
  e_a2.appendChild(e_span2);
  e_a2.href = '#';
  e_a2.classList.add('vt-btn');

  var e_li2 = document.createElement('li');
  e_li2.appendChild(e_a2);




  var vtHandle = document.getElementsByClassName("vt-handle")[0];
  // vtHandle.appendChild(e_li);
  // vtHandle.appendChild(e_li2);
  var vtFirstChild = vtHandle.firstChild
  vtHandle.insertBefore(e_li, vtFirstChild);
  vtHandle.insertBefore(e_li2, vtFirstChild)


  function callJavdb() {
    var title = document.getElementById("js-video_title").textContent;
    const code = getVideoCode(title);
    console.log(code)
    var javUrl = 'https://javdb.com/search?q=' + code + '&f=all';
    console.log(javUrl)
    window.open(javUrl)
  }

  function callJavbus() {
    var title = document.getElementById("js-video_title").textContent;
    const code = getVideoCode(title);
    console.log(code)
    var javUrl = 'https://www.javbus.com/' + code;
    console.log(javUrl)
    window.open(javUrl)
  }



  /**
     * 获取番号
     * @param title         源标题
     * @returns {string}    提取的番号
     */
    function getVideoCode(title) {
        title = title.toUpperCase().replace("SIS001", "")
            .replace("1080P", "")
            .replace("720P", "");

        let t = title.match(/T28[\-_]\d{3,4}/);
        // 一本道
        if (!t) {
            t = title.match(/1PONDO[\-_]\d{6}[\-_]\d{2,4}/);
            if (t) {
                t = t.toString().replace("1PONDO_", "")
                    .replace("1PONDO-", "");
            }
        }
        if (!t) {
            t = title.match(/HEYZO[\-_]?\d{4}/);
        }
        if (!t) {
            // 加勒比
            t = title.match(/CARIB[\-_]\d{6}[\-_]\d{3}/);
            if (t) {
                t = t.toString().replace("CARIB-", "")
                    .replace("CARIB_", "");
            }
        }
        if (!t) {
            // 东京热
            t = title.match(/N[-_]\d{4}/);
        }
        if (!t) {
            // Jukujo-Club | 熟女俱乐部
            t = title.match(/JUKUJO[-_]\d{4}/);
        }
        // 通用
        if (!t) {
            t = title.match(/[A-Z]{2,5}[-_]\d{3,5}/);
        }
        if (!t) {
            t = title.match(/\d{6}[\-_]\d{2,4}/);
        }
        if (!t) {
            t = title.match(/[A-Z]+\d{3,5}/);
        }
        if (!t) {
            t = title.match(/[A-Za-z]+[-_]?\d+/);
        }
        if (!t) {
            t = title.match(/\d+[-_]?\d+/);
        }
        if (!t) {
            t = title;
        }
        if (t) {
            t = t.toString().replace("_", "-");
            console.log("找到番号:" + t);
            return t;
        }
    }

})();