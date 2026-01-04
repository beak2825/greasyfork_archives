// ==UserScript==
// @name        View StackOverflow code snippet
// @description Open code snippet on Stack Exchange in CodePen / JSFiddle
// @namespace   https://github.com/tiansh/
// @include     https://stackoverflow.com/*
// @include     https://codegolf.stackexchange.com/*
// @include     https://codereview.stackexchange.com/*
// @include     https://gamedev.stackexchange.com/*
// @include     https://es.stackoverflow.com/*
// @include     https://ja.stackoverflow.com/*
// @include     https://pt.stackoverflow.com/*
// @include     https://ru.stackoverflow.com/*
// @homepageURL https://github.com/tiansh/vsocs
// @supportURL  https://github.com/tiansh/vsocs/issues
// @version     1.0
// @license     MPL 2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32592/View%20StackOverflow%20code%20snippet.user.js
// @updateURL https://update.greasyfork.org/scripts/32592/View%20StackOverflow%20code%20snippet.meta.js
// ==/UserScript==

// This file is modified from a file of kuma project of Mozilla
// https://github.com/mozilla/kuma/blob/00fc05b101658f863f58d7fc2b1aefecbcf71cf8/kuma/static/js/wiki-samples.js
// The original file is created by Mozilla Foundation and its contributors, and is licensed under MPL 2.0

(function(win, doc, $) {
    "use strict";

    var sites = ['codepen', 'jsfiddle'];

    var sourceURL = win.location.href.split('#')[0];
    var plug = '<!-- Content from the Stack Exchange network: ' + sourceURL + ' \n' +
        '     User contributions of Stack Exchange licensed under cc by-sa 3.0 with attribution required -->\n\n';

    var handleSnippet = function () {
        $('.snippet-ctas').each(function() {
            var $this = $(this);
            if ($this.find('.open-in-host-container').length) return;
            var $snippet = $this.closest('.snippet');
            createSampleButtons($snippet);
        });
    };
  
    var observer = new MutationObserver(handleSnippet);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    handleSnippet();

    function openJSFiddle(title, htmlCode, cssCode, jsCode) {
        var $form = $(
            '<form target="_blank" method="post" action="https://jsfiddle.net/api/post/library/pure/" style="display:none!important">' +
                '<input type="hidden" name="html" />' +
                '<input type="hidden" name="css" />' +
                '<input type="hidden" name="js" />' +
                '<input type="hidden" name="title" />' +
                '<input type="hidden" name="wrap" value="b" />' +
                '<input type="submit" />' +
            '</form>'
        ).appendTo(doc.body);

        $form.find('input[name=html]').val(plug + htmlCode);
        $form.find('input[name=css]').val(cssCode);
        $form.find('input[name=js]').val(jsCode);
        $form.find('input[name=title]').val(title);
        $form.get(0).submit();
    }

    function openCodepen(title, htmlCode, cssCode, jsCode) {
        var $form = $(
            '<form target="_blank" method="post" action="https://codepen.io/pen/define" style="display:none!important">' +
                '<input type="hidden" name="data">' +
                '<input type="submit" />' +
            '</form>'
        ).appendTo(doc.body);

        var data = {
            'title': title,
            'html': plug + htmlCode,
            'css': cssCode,
            'js': jsCode
        };
        $form.find('input[name=data]').val(JSON.stringify(data));
        $form.get(0).submit();
    }

    function openSample(sampleCodeHost, title, htmlCode, cssCode, jsCode) {
        var cssCleanCode = cssCode.replace(/\xA0/g, " ");

        if (sampleCodeHost === 'jsfiddle') {
            openJSFiddle(title, htmlCode, cssCleanCode, jsCode);
        } else if (sampleCodeHost === 'codepen') {
            openCodepen(title, htmlCode, cssCleanCode, jsCode);
        }
    }
    
    var getButtonText = (function () {
        var lang = 'en';
        if (location.host === 'es.stackoverflow.com') lang = 'es';
        if (location.host === 'ja.stackoverflow.com') lang = 'ja';
        if (location.host === 'pt.stackoverflow.com') lang = 'pt';
        if (location.host === 'ru.stackoverflow.com') lang = 'ru';
        return ({
           en: function (host) { return 'Open in ' + host; },
           es: function (host) { return 'Abrir en ' + host; },
           ja: function (host) { return host + ' で開く'; },
           pt: function (host) { return 'Abrir em ' + host; },
           ru: function (host) { return 'Открыть на ' + host; },
        })[lang];
    }());
    
    function createSampleButtons($snippet) {

        var htmlCode = $snippet.find('.snippet-code-html').text();
        var cssCode = $snippet.find('.snippet-code-css').text();
        var jsCode = $snippet.find('.snippet-code-js').text();
        var title = document.title;

        var $sampleFrame = $snippet.find('.snippet-ctas');

        if (htmlCode + cssCode + jsCode === '') return;

        // add buttons if we have good data
        var $buttonContainer = $('<div class="open-in-host-container" />');
        $.each(sites, function() {
            // convert sitename to lowercase for icon name and host identifier
            var sampleCodeHost = this.toLowerCase();
            // create button
            var $button = $('<button />', { 'class': 'open-in-host' });
            // create text
            var $text = $('<span />').text(getButtonText(sampleCodeHost));

            // add button icon and text to DOM
            $button.append($text).appendTo($buttonContainer);

            // add listener for button interactions
            $button.on('click', function() {
                openSample(sampleCodeHost, title, htmlCode, cssCode, jsCode);
            });
        });
        $buttonContainer.appendTo($sampleFrame);
    }
  
    $('<style>').text(
        '.open-in-host-container { text-align: right; }' +
        '.open-in-host-container > button:not(:last-child) { margin-right: 6px; }' +
        '.snippet-code .popout { top: -80px; }'
    ).appendTo($('head'));

})(window, document, jQuery);
