// ==UserScript==
// @name         papertrailapp - Clearer .NET stack traces
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  If your papertrailapp stream is mostly composed of .NET stack traces, this makes them much more legible by adding line breaks and colour highlighting
// @author       teedyay
// @match        http*://papertrailapp.com/groups/*/events*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29247/papertrailapp%20-%20Clearer%20NET%20stack%20traces.user.js
// @updateURL https://update.greasyfork.org/scripts/29247/papertrailapp%20-%20Clearer%20NET%20stack%20traces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var firstTime = true;
    var rxToFirstAt = new RegExp('^(.*?)   at ');
    var rxException = new RegExp('([^->:\n]*): ([^\n]*)', 'g');
    var rxLineBreaks = new RegExp('   ', 'g');
    var rxErrorIntro = new RegExp(' (---&gt;) ', 'g');
    var rxInnerExceptionDivider = new RegExp('(--- End of inner exception stack trace ---)', 'g');
    var rxOurCode = new RegExp('at (.*) in (.*):(line [0-9]*)', 'g');

    var reformatMessages = function () {
        $('li.event .message:not(.teedyay-done)').each(function () {
            var $message = $(this);
            var html = $message.html();
            if (html.indexOf('   at ') > -1) {
                var fixed = html;
                var colonStart = fixed.substr(0, 2) === ': ';
                if (colonStart)
                    fixed = fixed.substr(2);

                fixed = fixed.replace(rxToFirstAt, function (match, p1) {
                    var p1Fixed = p1;
                    p1Fixed = p1Fixed.replace(rxErrorIntro, '\n&nbsp;<span class="teedyay-lesser">$1</span> ');
                    p1Fixed = p1Fixed.replace(rxException, '<span class="teedyay-exception">$1</span>: <span class="teedyay-error-text">$2</span>');
                    return p1Fixed + '   at ';
                });

                // fixed = fixed.replace(rxToFirstAt, '<span class="teedyay-error-text">$1</span>   at ');
                fixed = fixed.replace(rxLineBreaks, '\n&nbsp;&nbsp;&nbsp;');
                fixed = fixed.replace(rxInnerExceptionDivider, '<span class="teedyay-lesser">$1</span>');
                fixed = fixed.replace(rxOurCode, '<span class="teedyay-has-line">at <span class="teedyay-method">$1</span> in <span class="teedyay-file-path">$2</span>:<span class="teedyay-line-number">$3</span></span>');
                if (colonStart)
                    fixed = '\n&nbsp;' + fixed;
                fixed = fixed.replace('\n', '<br />');
                if (html != fixed) {
                    $message.html(fixed);
                }
                $message.closest('li.event').addClass('teedyay-tweaked');
            }
            $message.addClass('teedyay-done');
        });

        if (firstTime)
            $("body").scrollTop($("body")[0].scrollHeight);
        firstTime = false;

        setTimeout(reformatMessages, 100);
    };

    $('body').append('<style type="text/css">' +
                     'li.event.teedyay-tweaked { color: #aaa; padding-top: 4px; padding-bottom: 4px; border-top: 1px solid #333; }' +
                     'li.event.teedyay-tweaked span.teedyay-lesser { color: #777; }' +
                     'li.event.teedyay-tweaked span.teedyay-error-text { color: #dd4; }' +
                     'li.event.teedyay-tweaked span.teedyay-exception { color: #f66; }' +
                     'li.event.teedyay-tweaked span.teedyay-has-line { }' +
                     'li.event.teedyay-tweaked span.teedyay-method { color: #aaf; }' +
                     'li.event.teedyay-tweaked span.teedyay-file-path { color: #6c6; }' +
                     'li.event.teedyay-tweaked span.teedyay-line-number { color: #fff; }' +
                     '</style>');

    setTimeout(reformatMessages, 100);
})();