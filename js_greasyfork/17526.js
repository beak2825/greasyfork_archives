// ==UserScript==
// @name         Sergey Schmidt - Labels YT (Unlisted)
// @namespace    https://gist.github.com/Kadauchi/
// @version      1.2
// @description  Hides instuctions, chooses off topic.
// @author       Kadauchi
// @include      *s3.amazonaws.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/17526/Sergey%20Schmidt%20-%20Labels%20YT%20%28Unlisted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17526/Sergey%20Schmidt%20-%20Labels%20YT%20%28Unlisted%29.meta.js
// ==/UserScript==

$("#instructions, #sample-task, #delete-history, #target_video_player").hide();
$("input[value='OFF_TOPIC']").click().focus();

var SRC = $("#target_video_player").prop("src");
var NewEmbed = document.createElement("iframe");
NewEmbed.src =  SRC+"?autoplay=1";
NewEmbed.width= "560";
NewEmbed.height= "315";
$("#task-fail").before(NewEmbed);
