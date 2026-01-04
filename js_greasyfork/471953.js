// ==UserScript==
// @name   Bypass DiffChecker Limit
// @match   *://stage.zymoresearch.com/*
// @match   *://stage.zymoresearch.com/*
// @match        https://stage.zymoresearch.com/*
// @match /^https:\/\/stage.zymoresearch\.com\/(1|2|3|4|5|6|7|8|9)/
// @description   Automatically input stage password
// @version 0.0.1.20230314171527
// @namespace https://greasyfork.org/users/1019668
// @downloadURL https://update.greasyfork.org/scripts/471953/Bypass%20DiffChecker%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/471953/Bypass%20DiffChecker%20Limit.meta.js
// ==/UserScript==
 
 const passwordField = document.getElementById('Password');
 const enterButton = document.querySelector('button[type="submit"]');
 
 passwordField.value = 'zymostage2021';
 enterButton.click();