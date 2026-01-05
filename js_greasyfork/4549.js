// ==UserScript==
// @name       Github Compare view
// @namespace  http://gmatheu.github.io/
// @version    0.1
// @description Increases Github width on compare view
// @match      https://github.com/**/compare/*
// @copyright  2014, Gonzalo Matheu
// @downloadURL https://update.greasyfork.org/scripts/4549/Github%20Compare%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/4549/Github%20Compare%20view.meta.js
// ==/UserScript==

$(".container").width("95%");
$("#js-repo-pjax-container").width("95%");
$(".meta").css("padding","0px 10px");
$(".file").css("margin-bottom","3px");
