// ==UserScript==
// @name         channel pocket button injection
// @namespace    http://ch.nicovideo.jp/
// @version      0.1
// @description  sonomannma
// @author       iguu
// @include        http://ch.nicovideo.jp/*
// @include        http://sp.ch.nicovideo.jp/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12705/channel%20pocket%20button%20injection.user.js
// @updateURL https://update.greasyfork.org/scripts/12705/channel%20pocket%20button%20injection.meta.js
// ==/UserScript==

var code = $('<a data-pocket-label="pocket" data-pocket-count="horizontal" class="pocket-btn" data-lang="en"></a><script type="text/javascript">!function(d,i){if(!d.getElementById(i)){var j=d.createElement("script");j.id=i;j.src="https://widgets.getpocket.com/v1/j/btn.js?v=1";var w=d.getElementById(i);d.body.appendChild(j);}}(document,"pocket-btn-js");</script>');
var li = $("<li>");
li.append(code);
$(".sns_count_area_btn").append(li);
