// ==UserScript==
// @name          Douban unblock mobile verification
// @copyright      Author
// @version        0.1.5
// @description   海外用户跳过手机验证 给傻逼豆瓣续一秒
// @run-at         document-start
// @match          *
// @namespace     http://douban.com
// @include        /^https?://
// @downloadURL https://update.greasyfork.org/scripts/443408/Douban%20unblock%20mobile%20verification.user.js
// @updateURL https://update.greasyfork.org/scripts/443408/Douban%20unblock%20mobile%20verification.meta.js
// ==/UserScript==

window._USER_ABNORMAL=false;

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#isay-submit')) {
        observer.disconnect();
        // code
    }
}

var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 3000, observer); // wait for the page to stay still for 3 seconds
observer.observe(document, {childList: true, subtree: true});

// reset timer every time something changes
function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 3000, observer);
}

function action(observer) {
    observer.disconnect();
    var sp=document.getElementsByClassName("bn-submit bn-flat js-verify-account")[0]
    sp.removeAttribute("data-is-verified")
    sp.removeAttribute("data-verify-url")
    sp.className='bn-submit'


    var ele = document.getElementById("isay-submit");
    sp.removeAttribute("disabled")
    sp.removeAttribute("disabled")

    sp.removeAttribute("disabled")

    sp.removeAttribute("disabled")


}


