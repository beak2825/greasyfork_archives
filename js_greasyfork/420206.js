// ==UserScript==
// @name        Wanikani Disable Review Submission
// @namespace   wk_disable_reviews
// @description Disable submission of reviews, for debugging purposes
// @include     https://preview.wanikani.com/review/session*
// @version     1.0.0
// @author      Robin Findley
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/420206/Wanikani%20Disable%20Review%20Submission.user.js
// @updateURL https://update.greasyfork.org/scripts/420206/Wanikani%20Disable%20Review%20Submission.meta.js
// ==/UserScript==

window.disable_reviews = {};

(function(gobj) {

    /* globals $ */

    var is_on = false;
    var old_ajax, old_setkey, stack = [];

    function deletePartials() {
        var keys = $.jStorage.index().filter(function(key){
            return key.match(/^(r|k|v)\d+$/)
        });
        keys.forEach(function(key) {
            $.jStorage.deleteKey(key);
        });
    }

    function disable() {
        if (!is_on) return;
        is_on = false;
        $.ajax = old_ajax;
    }

    function enable() {
        if (is_on) return;
        is_on = true;
        old_ajax = $.ajax;
        $.ajax = new_handler;
//        old_setkey = $.jStorage.set;
//        $.jStorage.set = new_setkey_handler;
    }

    function new_handler(e) {
        stack.push(e);
        if (e.url === '/json/progress') {
            console.log('Blocking submission');
            return $.Deferred().resolve();
        } else if (e.url.match(/^\/json\/(radical|kanji|vocabulary)\/\d+$/) !== null) {
            return old_ajax.apply(this, arguments);
        } else {
            console.log('Unknown ajax: "'+e.url+'"');
            return $.Deferred().resolve();
        }
    }

//    function new_setkey_handler(key) {
//        if (key.match(/^[rjv]\d+$/)) return;
//        return old_setkey.apply(this, arguments);
//    }

    gobj.disable = disable;
    gobj.enable = enable;
    gobj.stack = stack;

    enable();
    deletePartials();

})(window.disable_reviews);
