// ==UserScript==
// @name            automooc
// @description     null
// @match           http://csxk.traingo.cn/course/*
// @grant           none
// @license         MIT
// @version 0.0.1.20230720063744
// @namespace https://greasyfork.org/users/1052991
// @downloadURL https://update.greasyfork.org/scripts/471244/automooc.user.js
// @updateURL https://update.greasyfork.org/scripts/471244/automooc.meta.js
// ==/UserScript==
setInterval(function(){
    let find = document.getElementById("timedDown").outerText
    if(find == "1秒")document.getElementById("toNextSection").click()
},10000);