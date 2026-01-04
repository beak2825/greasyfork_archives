// ==UserScript==
// @name         Fannstar Getpoints
// @namespace    http://tampermonkey.net/
// @description  only for kd
// @author       Wang
// @version    0.1.2


// @match        http://en.fannstar.tf.co.kr/news/view/*
// @match        http://fannstar.tf.co.kr/news/view/*
// @match        http://jp.fannstar.tf.co.kr/news/view/*
// @match        http://cn.fannstar.tf.co.kr/news/view/*
// @match        http://vn.fannstar.tf.co.kr/news/view/*

// @grant window.close
// @grant window.focus

// @downloadURL https://update.greasyfork.org/scripts/395465/Fannstar%20Getpoints.user.js
// @updateURL https://update.greasyfork.org/scripts/395465/Fannstar%20Getpoints.meta.js
// ==/UserScript==


document.getElementsByClassName('in_button3').onclick(getPoint()).click();
