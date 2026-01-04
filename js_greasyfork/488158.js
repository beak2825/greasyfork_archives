// ==UserScript==
// @name         Flying mode
// @license      SATA
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  禁用大部分常见的OI题解来源(站内，站外)
// @author       flowing_boat
// @match        https://www.luogu.com.cn/problem/solution/*
// @match        https://www.luogu.com.cn/problem/solution
// @match        https://www.csdn.net/*
// @match        https://www.csdn.net
// @match        https://blog.csdn.net/*
// @match        https://blog.csdn.net
// @match        https://www.cnblogs.com/*
// @match        https://www.cnblogs.com
// @match        https://cloud.tencent.com/developer/*
// @match        https://zhuanlan.zhihu.com/*
// @match        https://zhuanlan.zhihu.com
// @match        https://www.luogu.com.cn/blog/*
// @match        https://*.blog.luogu.org/*
// @match        https://codeforces.com/blog/*
// @match        https://bots.blog.uoj.ac/blog/*
// @match        https://*.github.io/*
// @match        https://www.bilibili.com/read/*
// @match        https://codeleading.com/article/*
// @match        http://www.manongjc.com/detail/*
// @match        https://www.kuazhi.com/post/*
// @match        https://www.jianshu.com/*
// @match        https://blog.51cto.com/*
// @match        https://www.shuzhiduo.com/A/*
// @match        http://blog.leanote.com/post/*/*
// @match        http://blog.leanote.com/post/*
// @match        http://www.js-code.com/*
// @match        https://jingyan.baidu.com/article/*
// @match        https://wenku.baidu.com/view/*
// @match        https://zhidao.baidu.com/question/*
// @match        https://cloud.tencent.com/developer/article/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.xht37.com/*
// @match        https://www.xht37.com
// @match        https://studyingfather.com/*
// @match        https://studyingfather.com
// @icon         data:image/bmp;base64,Qk36DgAAAAAAADYAAAAoAAAAIwAAACMAAAABABgAAAAAAMQOAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////+/v7/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8////AAAA////+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8+/v7+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8tra24ODg+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8fn5+U1NTNzc30dHR/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8mZmZqKiotra2YGBg/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8qKiofn5+/Pz8Nzc34ODg/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz80tLSYWFhp6en/Pz8+/v7xMTEYWFh/Pz8i4uLi4uL+/v7/Pz8/Pz8/Pz8/Pz8+/v7+/v7+/v7/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8tra2YWFhU1NTtra2/Pz84ODgRUVF/Pz87e3tNzc37u7u+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8tra2fn5+0tLSNzc3Nzc3Nzc3KSkp/Pz8/Pz8cHBwNzc3Nzc3Nzc3Nzc3i4uL/Pz8+/v7/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8tra2fX19/Pz87e3t7u7u7u7u+/v7/Pz8+/v77u7u7u7u7u7u7u7u7u7uU1NTtra2+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8tra2fn5++/v77e3t4ODg4ODg4ODg/Pz8/Pz8/Pz839/f4ODg4ODg4ODgRUVF0tLS/Pz8/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8tra2fn5+4ODgGxsbRUVFRUVFNzc3/Pz8/Pz8cHBwNzc3RUVFRUVFYWFhi4uL/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8////AAAA/////Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8tra2YWFhNzc3xMTE+/v77u7uNzc3/Pz87u7uKCgo/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz84ODgcHBwtra2+/v7/Pz8tra2YGBg/Pz8i4uLmZmZ/Pz8+/v7/Pz8+/v7+/v7+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8tra2i4uL/Pz8Nzc34ODg/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8fn5+mZmZp6enb29v/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7+/v7/Pz8+/v7/Pz8i4uLU1NTKSkp4ODg/Pz8/Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz87u7utra24ODg/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8+/v7/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8////AAAA////+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8////AAAA////+/v7/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8+/v7////AAAA////+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8+/v7/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA/////Pz8+/v7/Pz8/Pz8/Pz8+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8////AAAA
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488158/Flying%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/488158/Flying%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML = '';
})();