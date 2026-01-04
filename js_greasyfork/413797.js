// ==UserScript==
// @name          Fancy text script
// @version        clipboard.js v2.0.0
// @description  Fancy text script Editor
// @include        *://*.facebook.com/*
// @author       unknown (https://zenorocha.github.io/clipboard.js)
// @namespace https://greasyfork.org/users/307290
// @downloadURL https://update.greasyfork.org/scripts/413797/Fancy%20text%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/413797/Fancy%20text%20script.meta.js
// ==/UserScript==

 
$(function(){
var intv = setInterval(function(){ $(".copybutton").html('Copy'); }, 2000);
  $("body").on('click',".copybutton",function() { 
$(".copybutton").html('Copy');
$(this).html('Copied'); 
clearInterval(intv);
});
});

    var clipboard = new ClipboardJS('.copybutton');
    clipboard.on('success', function(e) {
        //console.log(e);
    });
    clipboard.on('error', function(e) {
        //console.log(e);
    });
