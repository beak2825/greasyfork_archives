// ==UserScript==
// @id             github.com-ff599db1-47d8-b14f-83b4-3e345f6d67e3@http://efcl.info/
// @name           Github-time-format-changer
// @version        1.1
// @namespace      http://efcl.info/
// @author         azu
// @license        MIT
// @description    Change Github time format.
// @include        https://github.com/*
// @run-at         document-end
// @grant          none
// @require        https://cdn.jsdelivr.net/momentjs/2.6.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/1130/Github-time-format-changer.user.js
// @updateURL https://update.greasyfork.org/scripts/1130/Github-time-format-changer.meta.js
// ==/UserScript==

var $ = unsafeWindow.$;
var toArray = Function.prototype.call.bind(Array.prototype.slice);
var relative = /ago/i;
function _update(body) {
    var times = body.getElementsByTagName("time");
    toArray(times).forEach(function (timeElement) {
        if (!relative.test(timeElement.textContent)) {
            timeElement.textContent = moment(timeElement.getAttribute("datetime")).fromNow();
        }
    });
}
function update(body) {
    requestAnimationFrame(function () {
        _update(body);
    });
}
(function () {
    // pjax
    $(document).on('pjax:popstate pjax:end', function pjaxEnd() {
        update(document.body);
    });
    // AutoPagerize
    var addFilterHandler = function (evt) {
        var node = evt.target;
        update(node);
    };
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', addFilterHandler, false);
    // mutation chane update
    var target = document.querySelector('body');
    var config = {
        childList: true,
        subtree: true
    };

    var observer = new MutationObserver(function (mutations, self) {
        mutations.some(function (mutation) {
            if (mutation.type === 'childList' && mutation.target.nodeName === "TIME") {
                update(document.body);
                return true;
            }
        });
    });

    observer.observe(target, config);
})();
// MAIN =
update(document.body);