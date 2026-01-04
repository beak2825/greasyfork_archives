// ==UserScript==
// @name         BlockSomeAD
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       aweleey
// @run-at       document-end
// @match        https://ip.cn/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/393801/BlockSomeAD.user.js
// @updateURL https://update.greasyfork.org/scripts/393801/BlockSomeAD.meta.js
// ==/UserScript==

jQuery.noConflict();
(function(jq) {
    // ip.cn
    (function() {
        var moveToHide = createClassName(
            {
                position: 'absolute',
                left: '-100%',
                top: '-100%'
            },
            'hide',
            false
        );
        jq('#result')
            .next()
            .addClass(moveToHide);
    })();

    function createClassName(style, suffix, random = true) {
        var r8 = Math.random()
            .toString(36)
            .slice(-8);
        r8 = random ? `-${r8}` : '';
        suffix = suffix ? `-${suffix}` : '';
        var className = `aweleey${r8}${suffix}`;
        let styleSheet;
        for (let i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].CSSInJS) {
                styleSheet = document.styleSheets[i];
                break;
            }
        }
        if (!styleSheet) {
            const style = document.createElement('style');
            document.head.appendChild(style);
            styleSheet = style.sheet;
            styleSheet.CSSInJS = true;
        }
        styleSheet.insertRule(`.${className}${phraseStyle(style)}`);
        return className;
    }

    function phraseStyle(style) {
        var type = Object.prototype.toString.call(style).slice(8, -1);
        var styleText = '';
        if ('Object' === type) {
            const keys = Object.keys(style);
            const keyValue = keys.map(key => {
                const kebabCaseKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                const value = `${style[key]}${typeof style[key] === 'number' ? 'px' : ''}`;
                return `${kebabCaseKey}:${value};`;
            });
            styleText = `{${keyValue.join('')}}`;
        } else {
            styleText = `{${style}}`;
        }
        return styleText;
    }
})(jQuery);
