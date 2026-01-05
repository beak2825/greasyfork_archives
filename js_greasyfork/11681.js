// ==UserScript==
// @name      Auto Deny-All Group Leadership Userscript
// @version      1.1
// @description  enter something useful
// @author      Roger Waters
// @include      *hackforums.net/managegroup.php?action=joinrequests&gid=*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant      none
// @namespace Roger Waters
// @downloadURL https://update.greasyfork.org/scripts/11681/Auto%20Deny-All%20Group%20Leadership%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/11681/Auto%20Deny-All%20Group%20Leadership%20Userscript.meta.js
// ==/UserScript==

$(".thead").append('<a href="javascript:void(0);" style="float: right; padding-right: 10px;" id="removeAll" class="smalltext bitButton">Deny All</a>');
$("#removeAll").on("click", function() {
    $("input.radio[value='decline']").each(function() {
      $(this).attr("checked", "checked");
    });
});

$(".thead").append('<a href="javascript:void(0);" style="float: right; padding-right: 10px;" id="ignoreAll" class="smalltext bitButton">Ignore All</a>');
$("#ignoreAll").on("click", function() {
    $("input.radio[value='ignore']").each(function() {
      $(this).attr("checked", "checked");
    });
});

$(".thead").append('<a href="javascript:void(0);" style="float: right; padding-right: 10px;" id="acceptAll" class="smalltext bitButton">Accept All</a>');
$("#acceptAll").on("click", function() {
    $("input.radio[value='accept']").each(function() {
      $(this).attr("checked", "checked");
    });
});
