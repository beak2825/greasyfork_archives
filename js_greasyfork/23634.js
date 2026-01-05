// ==UserScript==
// @name        Wanikani Override
// @namespace   wkoverride
// @description Allows you to ignore wrong answers, and add them back to the queue.
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     2.0.0
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23634/Wanikani%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/23634/Wanikani%20Override.meta.js
// ==/UserScript==

// Original concept by Rui Pinheiro.

window.wkoverride = {};

(function(gobj) {

    var dlog_level = 0;

    //-------------------------------------------------------------------
    // Debug logger
    //-------------------------------------------------------------------
    function dlog(level) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        if ((level <= dlog_level) && (console) && (typeof console.log === 'function'))
            console.log.apply(console,args);
        gobj.dlog.push({level:level, msg:args.join()});
    }
    gobj.dlog = [];

    //-------------------------------------------------------------------
    // Toggle answer between Wrong and Ignored (or leave alone if correct)
    //-------------------------------------------------------------------
    function toggle_wrong() {
        dlog(1,'wko: toggle_wrong()');

        var is_wrong = $('.incorrect').length > 0;
        var is_ignored = $('.WKO_ignore').length > 0;

        if (!is_wrong && !is_ignored) return;

        /* Grab information about current question */
        var curItem, questionType;
        if (window.location.pathname == '/lesson/session') {
            curItem = $.jStorage.get('l/currentQuizItem');
            questionType = $.jStorage.get('l/questionType');
        } else {
            curItem = $.jStorage.get('currentItem');
            questionType = $.jStorage.get('questionType');
        }

        /* Build item name */
        var itemName = '';
        if (window.location.pathname == '/lesson/session') itemName += 'l/stats/';
        if(curItem.rad)
            itemName += 'r';
        else if(curItem.kan)
            itemName += 'k';
        else
            itemName += 'v';

        itemName += curItem.id;

        // Grab item from jStorage.
        // item.rc and item.mc => Reading/Meaning Completed (if answered the item correctly)
        // item.ri and item.mi => Reading/Meaning Invalid (number of mistakes before answering correctly)
        var item = $.jStorage.get(itemName) || {};

        /* Update the item data */
        if(questionType === 'meaning') {
            if (!('mi' in item)) item.mi = 0;
            if (is_wrong) {
                if (item.mi <= 0) return false;
                item.mi--;
            } else {
                item.mi++;
            }
            delete item.mc;
        } else {
            if (!('ri' in item)) item.ri = 0;
            if (is_wrong) {
                if (item.ri <= 0) return false;
                item.ri--;
            } else {
                item.ri++;
            }
            delete item.rc;
        }

        /* Save the new state back into jStorage */
        $.jStorage.set(itemName, item);

        /* Modify the questions counter and wrong counter and change the style of the answer field */
        var wrongCount, questionCount;
        if (window.location.pathname != '/lesson/session' ) {
            wrongCount = $.jStorage.get('wrongCount');
            questionCount = $.jStorage.get('questionCount');

            var inc = (is_wrong ? -1 : 1);
            $.jStorage.set('wrongCount', wrongCount+inc);
            $.jStorage.set('questionCount', questionCount+inc);
        }
        $('#answer-form fieldset').toggleClass('incorrect').toggleClass('WKO_ignore');
    }
    gobj.toggle_wrong = toggle_wrong;

    //-------------------------------------------------------------------
    // Hotkey handler
    //-------------------------------------------------------------------
    function hotkey_pressed(e) {
        if ($('#reviews').is(':visible') && $('#user-response:focus').length <= 0) {
            if (e.keyCode == 192 /* Chrome */ || e.keyCode == 172 /* Firefox */) {
                dlog(1,'wko: "~" detected');
                e.stopPropagation();
                e.preventDefault();
                toggle_wrong();
            }
        }
    }

    //-------------------------------------------------------------------
    // Startup.  Runs at document 'load' event.
    //-------------------------------------------------------------------
    function startup() {
        var html = '<div id="WKO_button" title="Ignore Answer">Ignore Answer</div>';
        var css =
            '#answer-form fieldset.WKO_ignore button,'+
            '#answer-form fieldset.WKO_ignore input[type=text],'+
            '#answer-form fieldset.WKO_ignore input[type=text]:disabled {'+
            '  background-color:#ff8800 !important;'+
            '  color:#ffffff !important'+
            '}'+
            '#WKO_button {'+
            '  background-color: #CC0000;'+
            '  color: #FFFFFF;'+
            '  cursor: pointer;'+
            '  display: inline-block;'+
            '  font-size: 0.8125em;'+
            '  padding: 10px;'+
            '  vertical-align: bottom;'+
            '}';

        // Install CSS styling
        $('head').append('<style type="text/css">'+css+'</style>');

        // Install button
        $('footer').prepend(html);

        // Install button handler
        $('#WKO_button').on('click',toggle_wrong);

        // Start monitoring for hotkeys
        $(document).on('keydown.wko', hotkey_pressed);
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener('load', startup, false);

})(window.wkoverride);
