// ==UserScript==
// @name       Transifex Translation Panel Improver
// @namespace  https://wwwtransifex.com/
// @version    0.0.5
// @description  This script adds two small panels around the string being translated in the translation panel. this panels contain the previous and next string, in order to improve the flow of translation
// @match      https://www.transifex.com/projects/p/**/translate*
// @copyright  2014+, ericol
// @downloadURL https://update.greasyfork.org/scripts/1602/Transifex%20Translation%20Panel%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/1602/Transifex%20Translation%20Panel%20Improver.meta.js
// ==/UserScript==
(function() {
    var refresh = 250;
    var intval= window.setInterval(function($refresh) {
        var source = $('#source-string');
        if(source.length) {
            window.clearInterval(intval);
            var oldSource = source.text();
            var stringList = $('#string-list');
            var panel = $('#source-string-area');
            var divHTML = '<div class="boxsizingBorder string-context" style="color: #888;background-color: #eef2f5;min-height: 40px;"></div>'
            intval = window.setInterval(function(oldText, translatingElm, translationList) {
                var newSource = source.text();
                if(newSource == '') {
                    panel.find('.string-context').remove();
                    return;
                }
                if(newSource == oldSource) {
                    return;
                }
                oldSource = newSource;
                panel.find('.string-context').remove();
                $(divHTML)
                	.insertBefore(source)
                	.html(stringList.find('.string-selected')
                          .prev('li')
                          .find('.default-source-text')
                          .html());
                $(divHTML)
                	.insertAfter(source)
                	.html(stringList.find('.string-selected')
                          .next('li')
                          .find('.default-source-text')
                          .html());
            }, $refresh);
        }
    }, refresh, refresh);
})();