// ==UserScript==
// @name         Master GT Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      25.2.23
// @description  try to take over the world
// @author       ANADIK
// @match        *://*.gotranscript.com/transcription_jobs/*
// @match        *://*.gotranscript.com/merging-jobs/*
// @match        *://*.gotranscript.com/login
// @icon         https://d1tfzqz2829nun.cloudfront.net/apple-touch-icon.png
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/460672/Master%20GT%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/460672/Master%20GT%20Auto%20Clicker.meta.js
// ==/UserScript==

var url = window.location.href;
var count = 0;

// Check if Not logged in then Login
if(url.endsWith("login")){
	window.onload = function(){
		$("input[name='email']").val("faltupangay@gmail.com");
		$("input[name='password']").val("reset@123");
		checkRecaptcha();
	};
};

// Check if its an error page then go back to available page

if(url.endsWith("confirm")){checkRecaptcha();}
if(url.includes("ids")){let n=$(".btn-success");n.length?n.first().click():gotoAvailable()}


$.each(["show", "toggle", "toggleClass", "addClass", "removeClass"], function(){
    var _oldFn = $.fn[this];
    $.fn[this] = function(){
        var hidden = this.find(":hidden").add(this.filter(":hidden"));
        var result = _oldFn.apply(this, arguments);
        hidden.filter(":visible").each(function(){
            $(this).triggerHandler("show"); //No bubbling
        });
        return result;
    };
});

$('.js-job-notification').bind("show", function(){
    notifyMe('Hurry Up', 'There is a new file. Check Now');
    $(".js-view-new-jobs").click();
});


setTimeout(function(){location.reload();},300000);

function notifyMe(a,b){new Notification(a,{body:b,icon:"https://d1tfzqz2829nun.cloudfront.net/favicon-32x32.png"})}
function gotoAvailable() {window.location.href = url.split("/").slice(0, 4).join("/") + "/available";}
function checkRecaptcha(){"undefined"!=typeof grecaptcha?$("#recaptcha").click():count<15?(console.log("Retrying... attempt number: "+(count+1)),setTimeout(checkRecaptcha,900),count++):gotoAvailable()}
