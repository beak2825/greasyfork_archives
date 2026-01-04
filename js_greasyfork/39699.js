// ==UserScript==
// @name         BTS2 - Tooltipy (UserScript+Tippy.js)
// @namespace    BTS2, amazon, tooltip, barcode, kod
// @version      0.2
// @description  Zobrazuje čiarové kódy v pravom dolnom rohu, ideálne na rýchle naskenovanie bez nutnosti jeho vytlačenia
// @author       AA z BTS2
// @require      https://cdn.jsdelivr.net/npm/io-barcode@1.3.0/build/browser/io-barcode.min.js
// @require      https://unpkg.com/tippy.js@2.3.0/dist/tippy.all.min.js
// @match        file:///*/LPN*.htm
// @match        http://*/index.html
// @include      http://fcresearch-eu.aka.amazon.com/*/results?*
// @include      https://fcresearch-eu.aka.amazon.com/*/results?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39699/BTS2%20-%20Tooltipy%20%28UserScript%2BTippyjs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39699/BTS2%20-%20Tooltipy%20%28UserScript%2BTippyjs%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var findThese = [ 'LPN', 'csX', 'ts', 'spl00', 'ZZ', 'P-1-' ];  // case-sensitive!

    var style_text =
        '.tippy-tooltip.mytooltip-theme {-webkit-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); -moz-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6)}\n'+
        '.tippy-tooltip.mytooltip-theme {border: 1px solid orange; background: #FDD6AE; padding: 10px 0 5px 0; border-radius: 16px}';

    function ready(fn){
        if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function appendStyle(styles){
        var css = document.createElement('style');
        css.type = 'text/css';
        if (css.styleSheet) css.styleSheet.cssText = styles;
        else css.appendChild(document.createTextNode(styles));
        document.body.appendChild(css);
    }

    function generateCode(text){
        var canvas,
            img = new Image(),
            options = {width: 1, height: 40, quite: 15, displayValue: true, font: 'monospace', fontSize: 16, fontWeight: 'bold', textAlign: 'center'};
        canvas = ioBarcode.CODE128B(text, options);
        img.src = canvas.toDataURL('image/png');
        return "<img src=\'"+img.src+"\'>";
    }

    function makeLiveLinks(id, column){
        var destElm = document.getElementById(id);
        if (destElm){
            //var base_link = 'http://fcresearch-eu.aka.amazon.com/BTS2/results?s=';
            var base_link = window.location.protocol + '//' + window.location.hostname + window.location.pathname + '?s=';
            var noLinksArray = [].slice.call(destElm.querySelectorAll('td[data-type=\"'+column+'\"]'));
            noLinksArray.forEach(function(elm){
                var text = elm.textContent;
                elm.innerHTML = '<a href=\"'+base_link+text+'\">'+text+'</a>';
            });
        }
    }

    function findLinks(){
        makeLiveLinks('inventory', 'lpn');
        var linksArray = [].slice.call(document.querySelectorAll('a'));
        var goodLinksArray = linksArray.filter(function(elm){
            var linkText = elm.textContent;
            for (var i = 0, length = findThese.length; i < length; i++){
                if (linkText.match('^'+findThese[i])) return elm;
            }
        });
        console.log(goodLinksArray);
        goodLinksArray.forEach(function(elm){
            elm.title = generateCode(elm.textContent);
        });
    }

    ready(function(){
        appendStyle(style_text);
        findLinks();
        tippy('a[title]', {theme: 'mytooltip', animation: 'fade', performance: true, animateFill: false});
    });

})();