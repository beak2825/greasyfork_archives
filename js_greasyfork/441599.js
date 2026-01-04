// ==UserScript==
// @name         ステークのリロード自動回収スクリプト
// @description  リロードを自動で受け取るスクリプトです
// @author       aaaaaaaaaaaaa
// @version      1.1
// @license      apache
// @match        https://stake.bz/?tab=reload&modal=vip&currency=xrp
// @match        https://stake.bz/*
// @match        https://stake.com/?tab=reload&modal=vip&currency=xrp
// @namespace https://greasyfork.org/users/888170
// @downloadURL https://update.greasyfork.org/scripts/441599/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%AF%E3%81%AE%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E5%9B%9E%E5%8F%8E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/441599/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%AF%E3%81%AE%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E5%9B%9E%E5%8F%8E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
setInterval(function(){window.location.replace("https://stake.bz/?tab=reload&modal=vip&currency=xrp");},100000)
setInterval(function(){document.getElementsByClassName("variant-success lineHeight-base size-medium spacing-mega weight-semibold align-center min-width fullWidth square svelte-gf9xjq")[0].click();},20000)