// ==UserScript==
// @name         BTS2 - Tooltipy (Internal+Tippy.js)
// @namespace    BTS2, amazon, tooltip, barcode, kod
// @version      0.2
// @description  Zobrazuje čiarové kódy v pravom dolnom rohu, ideálne na rýchle naskenovanie bez nutnosti jeho vytlačenia
// @author       AA z BTS2
// @match        http://*/index.html
// @include      http://fcresearch-eu.aka.amazon.com/*/results?*
// @include      https://fcresearch-eu.aka.amazon.com/*/results?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39701/BTS2%20-%20Tooltipy%20%28Internal%2BTippyjs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39701/BTS2%20-%20Tooltipy%20%28Internal%2BTippyjs%29.meta.js
// ==/UserScript==

function appendScript(id, fn){
    var newScript = document.createElement('script');
    newScript.setAttribute('type', 'text/javascript');
    newScript.setAttribute('id', id);
    newScript.textContent = fn;
    document.body.appendChild(newScript);
}

function ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
}
// ----------------------------------------------------------

ready(function(){
    var myTooltipJS =
        "var findThese = ['LPN', 'csX', 'ts', 'spl00', 'ZZ', 'P-1-']; // case-sensitive!\n\n"+
        "var style_text =\n"+
        "'.tippy-tooltip.mytooltip-theme {border: 1px solid orange; background: #FDD6AE; padding: 10px 0 5px 0; border-radius: 16px; -webkit-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); -moz-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6)}';"+

        "var appendStyle= function(styles){\n"+
        "var css = document.createElement('style'); css.type = 'text/css';\n"+
        "if (css.styleSheet) css.styleSheet.cssText = styles;\n"+
        "else css.appendChild(document.createTextNode(styles)); document.body.appendChild(css);\n"+
        "};\n\n"+

        "var loadJS = function(url, implementationCode){\n"+
        "var scriptTag = document.createElement('script');\n"+
        "scriptTag.src = url;\n"+
        "scriptTag.onload = implementationCode;\n"+
        "scriptTag.onreadystatechange = implementationCode;\n"+
        "document.body.appendChild(scriptTag);\n"+
        "};\n\n"+

        "var ready = function(fn){\n"+
        "if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){fn();}\n"+
        "else {document.addEventListener('DOMContentLoaded', fn);}\n"+
        "};\n\n"+

        "var makeLiveLinks = function(id, column){\n"+
        "var destElm = document.getElementById(id);\n"+
        "if (destElm){\n"+
        "//var base_link = 'http://fcresearch-eu.aka.amazon.com/BTS2/results?s=';\n"+
        "var base_link = window.location.protocol + '//' + window.location.hostname + window.location.pathname + '?s=';\n"+
        "var noLinksArray = [].slice.call(destElm.querySelectorAll('td[data-type=\"' + column + '\"]'));\n"+
        "noLinksArray.forEach(function(elm){\n"+
        "var text = elm.textContent;\n"+
        "elm.innerHTML = '<a href=\"' + base_link + text + '\">' + text + '</a>';\n"+
        "});\n"+
        "}\n"+
        "};\n\n"+

        "var generateCode = function(text){\n"+
        "var canvas, img = new Image(), options = {width: 1, height: 40, quite: 15, displayValue: true, font: 'monospace', fontSize: 16, fontWeight: 'bold', textAlign: 'center'};\n"+
        "canvas = ioBarcode.CODE128B(text, options);\n"+
        "img.src = canvas.toDataURL('image/png'); return '<img src=\"'+img.src+'\">';\n"+
        "};\n\n"+

        "var findLinks = function(){\n"+
        "makeLiveLinks('inventory', 'lpn');\n"+
        "var linksArray = [].slice.call(document.querySelectorAll('a'));\n"+
        "var goodLinksArray = linksArray.filter(function(elm){\n"+
        "var linkText = elm.textContent;\n"+
        "for (var i = 0, length = findThese.length; i < length; i++){\n"+
        "if (linkText.match('^'+findThese[i])) return elm;\n"+
        "}\n"+
        "});\n"+
        "console.log(goodLinksArray);\n"+
        "goodLinksArray.forEach(function(elm){\n"+
        "elm.title = generateCode(elm.textContent);\n"+
        "});\n"+
        "};\n\n"+

        "var activateTippy = function(){tippy('a[title]', {theme: 'mytooltip', animation: 'fade', performance: true, animateFill: false});}\n\n"+

        "ready(function(){\n"+
        "appendStyle(style_text);\n"+
        "loadJS('https://cdn.jsdelivr.net/npm/io-barcode@1.3.0/build/browser/io-barcode.min.js', findLinks);\n"+
        "loadJS('https://unpkg.com/tippy.js@2.3.0/dist/tippy.all.min.js', activateTippy);\n"+
        "});";

    appendScript('barcodeTips', myTooltipJS);
}); // ready
