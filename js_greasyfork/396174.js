// ==UserScript==
// @name         gitlab jobs links highliter
// @namespace    mailto:griddic@mail.ru
// @version      0.0.1
// @description  Highlite all links in gitlab-ci jobs logs.
// @author       griddic
// @include      /^.*gitlab.*\/jobs\/\d+$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396174/gitlab%20jobs%20links%20highliter.user.js
// @updateURL https://update.greasyfork.org/scripts/396174/gitlab%20jobs%20links%20highliter.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // console.log('im alive');
    function urlifySpan(el) {
        if (el.getElementsByTagName('a').length > 0) {
            // element already contains links
            return;
        }
        const text = el.innerText;
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        el.innerHTML = text.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        })
    }
    function urlifyLogs() {
        // console.log('urlifing');
        // console.log(document.querySelectorAll("code span").length)
        document.querySelectorAll("code span").forEach(function (el) {urlifySpan(el)});
    }
    const observer = new MutationObserver(urlifyLogs);
    const config = { attributes: false, childList: true, subtree: false }
    function setObserverAfterLoad() {
        if (document.querySelectorAll("code").length === 0) {
            // console.log('Logs have not been loaded. I have to wait before setting observer.');
            setTimeout(setObserverAfterLoad, 500);
        } else {
            // console.log('Logs have been loaded. I am going to set observer.');
            urlifyLogs();
            observer.observe(document.querySelector("code"), config);
        }
    }
    setObserverAfterLoad();
})();
