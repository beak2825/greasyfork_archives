// ==UserScript==
// @namespace    https://github.com/smac89

// @name         Code HiliteMe
// @name:en      Code HiliteMe

// @description  Beautiful code everywhere!

// @author       smac89
// @version      0.1.3
// @license      GPLv3

// @supportURL   https://github.com/smac89/userscripts/issues
// @homepageURL  https://github.com/smac89/userscripts/tree/master/codehiliteme

// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://greasyfork.org/scripts/26342-highlight-js/code/Highlightjs.js?version=167883

// @resource     hljs.css    https://raw.githubusercontent.com/smac89/userscripts/master/codehiliteme/highlight.js/build/styles/default.min.css
// @resource     langs.json  https://raw.githubusercontent.com/smac89/userscripts/master/codehiliteme/supported_langs.json
// @resource     ovride.css  https://raw.githubusercontent.com/smac89/userscripts/master/codehiliteme/override.css

// @include      */*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-start

// @compatible   firefox(50.1.0)+greasemonkey
// @compatible   chrome(55.0.2883.87)+tampermonkey
// @compatible   opera(43.0.2442.7)+violentmonkey
// @compatible   yandex(17.1.1.266 beta)+violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/26343/Code%20HiliteMe.user.js
// @updateURL https://update.greasyfork.org/scripts/26343/Code%20HiliteMe.meta.js
// ==/UserScript==


// Give the option of customizing the output to use the browser's built-in pretty printer
var OPT =  {
    style: "None",
    linenos: true
};


var CodeHiliteMe = (function() {
    const _private = this;
    const extension_map = $.parseJSON(GM_getResourceText("langs.json"));

    function layout() {
        var $code = $('body > pre code'), elem = $code.get(0);

        if (elem.offsetWidth < elem.scrollWidth) {
            $('body > pre').css('display', 'inline-block');
        } else {
            $('body > pre').css('display', 'block');
        }
    }

    function drawLines(block) {
        var $code = $(block);

        $("<div></div>", {
            html: $.parseHTML($code.text().split(/\n|\r\n?/).map(function(line, index, array) {
                if (index + 1 === array.length && !line) {
                    return "";
                }
                return (index + 1) + "<br>";
            }).join("")),

            css: {
                'float': 'left',
                'font-weight': 'bold'
            },

            addClass: 'hljs',
            insertBefore: $code.css('display', 'inline-block'), // inline-block is used to avoid having to have two scrollbars when the window is shrunk
            id: "code-lines"
        });
    }

    return {
        hiliteIt: function() {
            var $codes = $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
                if (OPT.linenos) {
                    drawLines(block);
                }
            });

            if (OPT.linenos) {
                $codes.parent().css('background', $('.hljs').css('background'));
            }

            layout();
            $(window).resize(layout);
        },

        isHilitable: function() {
            var $code = $("body > pre:first-child");
            var filename = window.location.pathname.split("/").pop().toLowerCase();

            if ($code.exists() && filename) {

                var ext = filename.substr(filename.lastIndexOf('.')).toLowerCase();
                var language = '';

                // if the extension is not found, then attempt to treat the file as a special file
                if (ext in extension_map) {
                    language = extension_map[ext];
                } else if (filename in extension_map) {
                    language = extension_map[filename];
                } else {
                    return false;
                }

                var text = $code.text();
                $code.replaceWith(`<pre><code class="${language}"></code></pre>`);
                $('code').text(text);

                return true;
            }
            return false;
        }
    };
}());

$(function() {
    'use strict';

    if (CodeHiliteMe.isHilitable()) {
        // Add the highlight js stylesheet
        GM_addStyle(GM_getResourceText('hljs.css'));
        GM_addStyle(GM_getResourceText('ovride.css'));

        // highlight the code
        CodeHiliteMe.hiliteIt();
    }
});

$.fn.extend({
    exists: function() {
        return this.length !== 0;
    }
});


// GM_xmlhttpRequest({
//     url: window.location.href,
//     method: "HEAD",
//     // headers: {
//     //     "Accept-Charset": "utf-8",
//     //     "Accept": "text/html",
//     //     "Content-Type": "application/x-www-form-urlencoded"
//     // },
//     onload: function(resp) {
//         console.log(resp.responseHeaders);
//         alert(resp.responseHeaders.match(/^content-type:\W+(.+)/gim));
//         // $code.replaceWith(resp.responseText);
//     },
//     onerror: function(resp) {
//         alert(resp.responseText);
//     }
// });

// GM_xmlhttpRequest({
//     url: "http://hilite.me/api",
//     method: "POST",
//     data: {
//         code: escape($code.text()),
//         lexer: "python",
//         style: STYLES[STYLE_OPTIONS[file_ext] || STYLE_OPTIONS['default']],
//         // style: 'fruity',
//         linenos: true,
//         options: ['stripnl'] //http://pygments.org/docs/lexers/
//     },
//     headers: {
//         "Accept-Charset": "utf-8",
//         "Accept": "text/html",
//         "Content-Type": "application/x-www-form-urlencoded"
//     },
//     onload: function(resp) {
//         alert(resp.statusText);
//         $code.replaceWith(resp.responseText);
//     },
//     onerror: function(resp) {
//         alert("Request failed!" + resp.responseText);
//     }
// });

// var blob = new Blob([$.parseHTML(`<pre><div class="${language}">${$code.text()}</div></pre>`).join("")], {
//     type: 'text/html',
//     endings: 'native'
// });

// var reader = new FileReader();
// reader.onload = function(evt) {
//     console.log(evt.target.result);
//     $code.replaceWith(evt.target.result);
// };

// reader.readAsText(blob);
