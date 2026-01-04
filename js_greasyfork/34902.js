// ==UserScript==
// @name         Neopets: Safety Deposit Box Enhancement
// @namespace    http://clraik.com/forum/member.php?17452
// @version      0.1
// @description  Adds extra useful buttons to the Safety Deposit Box.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/safetydeposit.phtml*
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34902/Neopets%3A%20Safety%20Deposit%20Box%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/34902/Neopets%3A%20Safety%20Deposit%20Box%20Enhancement.meta.js
// ==/UserScript==

var SBDbuttons = document.createElement("p");
document.getElementsByClassName("content")[0].getElementsByTagName("table")[3].appendChild(SBDbuttons);
SBDbuttons.innerHTML = '<div align="right" style="position: absolute;width: 805px;"><input type="button" id="removeall" value="Remove all"> <input type="button" id="removeone" value="Remove one"> <input type="button" id="leaveone" value="Leave one"></div><br>';
$.fn.focusWithoutScrolling = function(){
  var x = window.scrollX, y = window.scrollY;
  this.focus();
  window.scrollTo(x, y);
};
$("#leaveone").click(function(){
    $(".remove_safety_deposit").each(function(){
        $(this).focusWithoutScrolling();
        var removeInput = $(this).attr("data-total_count");
        $(this).val(removeInput - 1);
    });
});
$("#removeall").click(function(){
    $(".remove_safety_deposit").each(function(){
        $(this).focusWithoutScrolling();
        var removeInput = $(this).attr("data-total_count");
        $(this).val(removeInput);
    });
});
$("#removeone").click(function(){
    $(".remove_safety_deposit").each(function(){
        $(this).focusWithoutScrolling();
        $(this).val(1);
    });
});