// ==UserScript==
// @name         Input to Output
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Copies 'copy' button to output
// @author       SuperJava
// @match        http://codeforces.com/*/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40297/Input%20to%20Output.user.js
// @updateURL https://update.greasyfork.org/scripts/40297/Input%20to%20Output.meta.js
// ==/UserScript==

document.querySelector('body').addEventListener('click', function(event) {
    if (event.target.className.toLowerCase() === 'jgrowl-closer default') {
        document.getElementById('jGrowl').outerHTML = '<div id="jGrowl" class="bottom-right jGrowl"><div class="jGrowl-notification"></div></div>';
    }
});

$("body").bind("DOMNodeInserted",function(event){
    if(event.target.className.toLowerCase() === 'jgrowl-notification default'){
        setTimeout(function() {
            $(event.target).fadeOut(500, function(){$(this).remove();});
        }, 5000);
    }
});

$("body").bind("DOMNodeInserted",function(event){
    if(event.target.className.toLowerCase() === 'jgrowl-closer default'){
        setTimeout(function() {
            $(event.target).fadeOut(500, function(){$(this).remove();});
        }, 5500);
    }
});

var nof = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(nof);
nof.outerHTML = '<div id="jGrowl" class="bottom-right jGrowl"><div class="jGrowl-notification"></div></div>';

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

var x = document.getElementsByClassName('output');

var len = x.length;
for (var i = 0; i < len; ++i) {
    x[i].getElementsByClassName('title')[0].outerHTML = '<div class="title"> Output<div title="Copy" class="input-copier">Copy</div></div>';
}

x = document.getElementsByClassName('output');

len = x.length;
for (var i = 0; i < len; ++i) {
    x[i].getElementsByClassName('title')[0].getElementsByClassName('input-copier')[0].onclick = function(event){miracle(event);};
}



function miracle(event) {
    var eea = event.currentTarget;
    var testx = eea.parentElement.parentElement.getElementsByTagName("PRE")[0];
    var nsq = testx.innerHTML.replace(/<br>/gi,"\n");
    copyToClipboard(nsq);
    var not = '<div class="jGrowl-notification default" style="display: block;"><div class="close notif">×</div><div class="header"></div><div class="message">The example has been copied into the clipboard</div></div>';
//    document.getElementById('jGrowl').appendChild(not);
    var er = document.getElementsByClassName('jGrowl-closer');
    if(er.length===0)
        $(not).hide().appendTo("#jGrowl").fadeIn(500);
    else{
        $(not).hide().insertBefore('.jGrowl-closer.default').fadeIn(500);
    }
    //$('.jGrowl-notification.default').mouseleave(function(){$(this).fadeOut(500, function(){$(this).remove();});});
    $('.close.notif').click(function(){
        $(this).parent().fadeOut(500, function(){$(this).remove();});
    });
}