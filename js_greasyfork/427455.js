// ==UserScript==
// @name         hkc_一键教评
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  一学期一次最烦的教评，这个脚本可以很爽的一键完成教评，只需要点到教评的界面，点一下“/”，输入要评价科目的数量，就可以全自动完成。
// @author       唐玮龙、途深
// @match        https://jw.hitushen.cn/*
// @match        http://jw.hkc.edu.cn/*
// @icon         https://cdn.jsdelivr.net/gh/hitushen/blog_imges/imges/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427455/hkc_%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/427455/hkc_%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.setAttribute('type','text/javascript');
script.setAttribute('src',"https://api.hitushen.cn/lib/js/hkc_jp.js");
document.getElementsByTagName('head')[0].appendChild(script);
