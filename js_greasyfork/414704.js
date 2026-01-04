// ==UserScript==
// @name     激战2 SC网站插件语言切换
// @version  1
// @include  /^https?://(www\.)?snowcrows\.com/.*$/
// @include  /^https?://(www\.)?metabattle\.com/.*$/
// @description   Snowcrows(SC)团队BUILD页面插件语言切换，edit by 冰空丶末夜.3879, https://scruffy.wishingstarmoye.com/sc-build-script/
// @grant    none
// @run-at   document-end
// @namespace https://greasyfork.org/users/11433
// @downloadURL https://update.greasyfork.org/scripts/414704/%E6%BF%80%E6%88%982%20SC%E7%BD%91%E7%AB%99%E6%8F%92%E4%BB%B6%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/414704/%E6%BF%80%E6%88%982%20SC%E7%BD%91%E7%AB%99%E6%8F%92%E4%BB%B6%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
var script = document.createElement("script");
script.text = "document.GW2A_EMBED_OPTIONS = {lang:'zh',persistToLocalStorage:true,forceCacheClearOnNextRun:'1'};";
document.body.appendChild(script);
console.log('------语言切换已执行------');