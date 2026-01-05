// ==UserScript==
// @name JKFORUM
// @namespace http://your.homepage/
// @version 0.5
// @description enter something useful
// @author You
// @match https://www.jkforum.net/forum-*.html
// @match https://www.jkforum.net/thread-*.html
// @match https://www.jkforum.net/forum.php?mod=viewthread&*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16521/JKFORUM.user.js
// @updateURL https://update.greasyfork.org/scripts/16521/JKFORUM.meta.js
// ==/UserScript==

function forEach(elems, func) {
for (var i = 0; i < elems.length; i++) {
func(elems[i]);
}
return elems.length > 0;
}

function automate() {
forEach(document.querySelectorAll('p'), 
function(i) { if (i.textContent.trim()=='已經感謝過此篇文章') location.reload(); });
forEach(document.querySelectorAll('#fwin_k_thankauthor'), 
function(i) { hideWindow('k_thankauthor'); });
forEach(document.querySelectorAll('#fwin_dialog #periodaggre18'), 
function(i) { i.checked=true; });
forEach(document.querySelectorAll('#fwin_dialog #fwin_dialog_submit'), function(i) { i.click(); });
if (document.querySelectorAll('.status_loginned').length) {
forEach(document.querySelectorAll('.like_locked #k_thankauthor'), function(i) {
if (i.offsetHeight) i.click();
});
}
}

var func = function() {
automate();
setTimeout(func, 1000);
};

setTimeout(func, 1000);

(function(){
    var e = document.createElement('div');
    e.setAttribute('style','padding:5px;border:1px solid black;background:white;position:fixed;right:5px;bottom:5px;');
    var b = document.createElement('button');
    b.innerHTML='Open all thread';
    b.onclick = function() {
        var i = 0;
        var list = [];
forEach(document.querySelectorAll('#threadlist a'), function(a) {
var href = a.href;
    if (href.match(/thread.*html$/) && list.indexOf(href) == -1) {
        list.push(href);
        window.open(href,'_blank');
        i++;
    }
});
        console.log(i);
    };
    e.appendChild(b);
    document.body.appendChild(e);
})();