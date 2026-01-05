// ==UserScript==
// @name           Taste of the World Matching Task
// @version        0.9
// @description  A is Yes S is No D is unsure  
// @author         Cristo
// @include        https://s3.amazonaws.com/Taste-of-the-World*
// @copyright      2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3750/Taste%20of%20the%20World%20Matching%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/3750/Taste%20of%20the%20World%20Matching%20Task.meta.js
// ==/UserScript==


var contain = document.getElementById("mturk_form")[0];
contain.tabIndex = "0";
contain.focus();

var yes = document.getElementsByTagName("label")[0];
var no = document.getElementsByTagName("label")[1];
var sure = document.getElementsByTagName("label")[2];
var sub = document.getElementsByClassName("btn btn-primary btn-block btn-large")[0];
document.addEventListener("keydown",function(i) {
    if (i.keyCode == 65) {
        yes.focus();
        yes.click();
        sub.click();
    }
    if (i.keyCode == 83) {
        no.focus();
        no.click();
        sub.click();
    }
    if (i.keyCode == 68) {
        sure.focus();
        sure.click();
        sub.click();
    }}, false);