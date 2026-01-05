// ==UserScript==
// @name        DotInstallHidePremium
// @namespace   sei0o.dotinstall.hidepremium
// @description ドットインストールのプレミアム専用レッスンを表示しないようにします。
// @include     http://dotinstall.com/lessons
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10609/DotInstallHidePremium.user.js
// @updateURL https://update.greasyfork.org/scripts/10609/DotInstallHidePremium.meta.js
// ==/UserScript==

$("tr, li").has("img[alt='PREMIUM']").css("display", "none");
