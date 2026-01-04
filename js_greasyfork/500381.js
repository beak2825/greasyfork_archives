// ==UserScript==
// @name         G8HH:matter-of-scale
// @namespace    http://tampermonkey.net/
// @version      20240712
// @description  没得介绍!
// @author       没得名字
// @match        https://gityxs.github.io/matter-of-scale/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u77.games
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500381/G8HH%3Amatter-of-scale.user.js
// @updateURL https://update.greasyfork.org/scripts/500381/G8HH%3Amatter-of-scale.meta.js
// ==/UserScript==
(function() {
setTimeout(function(){
    var css1={
	'display': 'inline-block',
	'min-height': '500px',
	'border': '1px solid black',
	'vertical-align': 'top',
	'width': '500px'
};
    var css2={
	'border': '1px solid black',
	'width': '300px',
	'display': 'inline-block',
	'min-height': '500px',
	'vertical-align': 'top'
    };
    $(".place").css(css1);
    $(".upgrades").css(css2);
    $("div[data-reactid='.0.1.6.0']").append(
`
<span class="head-inc" data-reactid=".0.1.6.0.4">边际成本</span>
`);
    $("div[data-reactid='.0.1.6.1']").find(".building-cont").append(
`
<div class="building-income everyprc">0</div>
`);
},1000);
setInterval(function(){
    $("div[data-reactid='.0.1.6.1']").find(".everyprc").each(function(){
    $(this).text(parseInt($(this).siblings(".building-cost")[0].innerText)/parseInt($(this).siblings(".building-income")[0].innerText));
    });
},999);
})();
