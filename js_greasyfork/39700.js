// ==UserScript==
// @name         BTS2 - Tooltipy (Internal)
// @namespace    BTS2, amazon, tooltip, barcode, kod
// @version      0.2
// @description  Zobrazuje čiarové kódy v pravom dolnom rohu, ideálne na rýchle naskenovanie bez nutnosti jeho vytlačenia
// @author       AA z BTS2
// @match        http://*/index.html
// @include      http://fcresearch-eu.aka.amazon.com/*/results?*
// @include      https://fcresearch-eu.aka.amazon.com/*/results?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39700/BTS2%20-%20Tooltipy%20%28Internal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39700/BTS2%20-%20Tooltipy%20%28Internal%29.meta.js
// ==/UserScript==

function appendScript(id, fn){
    var newScript = document.createElement('script');
    newScript.setAttribute('type', 'text/javascript');
    newScript.setAttribute('id', id);
    newScript.textContent = fn;
    document.body.appendChild(newScript);
}

function appendExternalLib(src, id = ''){
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.charset = 'utf-8';
    newScript.id = id;
    newScript.src = src;
    document.body.appendChild(newScript);
}

function ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
// ----------------------------------------------------------

ready(function(){
    appendExternalLib('https://cdn.jsdelivr.net/npm/io-barcode@1.3.0/build/browser/io-barcode.min.js', 'myBarcode');
    var myTooltipJS =
        "var findThese = ['LPN', 'csX', 'ts', 'spl00', 'ZZ', 'P-1-']; // case-sensitive!\n\n"+
        "var style_text =\n"+
        "'#barcode_wrap {display: none; position: fixed; right: 10px; bottom: 10px; z-index: 2000; border-radius: 16px}'+\n"+
        "'#barcode_wrap {-webkit-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); -moz-box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6); box-shadow: 0px 0px 14px 4px rgba(0,0,0,0.6)}'+\n"+
        "'#barcode {border: 1px solid orange; background: #FDD6AE; padding: 10px 0 5px 0; border-radius: 16px}';\n\n"+

        "function appendStyle(styles){\n"+
        "var css = document.createElement('style'); css.type = 'text/css';\n"+
        "if (css.styleSheet) css.styleSheet.cssText = styles;\n"+
        "else css.appendChild(document.createTextNode(styles)); document.body.appendChild(css);\n"+
        "}\n\n"+

        "function appendWrapper(id){\n"+
        "var div = document.createElement('div'); div.id = id; document.body.appendChild(div);\n"+
        "}\n\n"+

        "function ready(fn){\n"+
        "    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){fn();}\n"+
        "    else {document.addEventListener('DOMContentLoaded', fn);}\n"+
        "}\n\n"+

        "function generateCode(elm, text, type){\n"+
        "	var canvas,	img = new Image(), options = {width: 1, height: 40, quite: 15, displayValue: true, font: 'monospace', fontSize: 16, fontWeight: 'bold', textAlign: 'center'};\n"+
        "	    if (type == 'CODE128B'){canvas = ioBarcode.CODE128B(text, options);}\n"+
        "   else if (type == 'CODE128C'){canvas = ioBarcode.CODE128C(text, options);}\n"+
        "   else if (type == 'EAN'){canvas = ioBarcode.EAN(text, options);}\n"+
        "   else if (type == 'UPC'){canvas = ioBarcode.UPC(text, options);}\n"+
        "   else if (type == 'CODE39'){canvas = ioBarcode.CODE39(text, options);}\n"+
        "   else if (type == 'ITF'){canvas = ioBarcode.ITF(text, options);}\n"+
        "   else if (type == 'ITF14'){canvas = ioBarcode.ITF14(text, options);}\n"+
        "   else if (type == 'Pharmacode'){ canvas = ioBarcode.Pharmacode(text, options);}\n"+
        "	img.src = canvas.toDataURL('image/png'); img.id = 'barcode'; document.getElementById(elm).appendChild(img);\n"+
        "}\n\n"+

        "function destroyCode(elm){var el = document.getElementById(elm); el.style.opacity = 0; el.style.display = 'none'; el.innerHTML = '';}\n\n"+

        "// fade out, credits: Chris Buttery @ chrisbuttery.com\n"+
        "function fadeOut(el){\n"+
        "el.style.opacity = 1;\n"+
        "(function fade(){\n"+
        "    if ((el.style.opacity -= 0.1) < 0){el.style.display = 'none';} else {requestAnimationFrame(fade);}\n"+
        "})();\n"+
        "}\n\n"+

        "// fade in, credits: Chris Buttery @ chrisbuttery.com\n"+
        "function fadeIn(el, display){\n"+
        "el.style.opacity = 0; el.style.display = display || 'block';\n"+
        "(function fade(){\n"+
        "    var val = parseFloat(el.style.opacity);\n"+
        "    if (!((val += 0.1) > 1)){el.style.opacity = val; requestAnimationFrame(fade);}\n"+
        "})();\n"+
        "}\n\n"+

        "function makeLiveLinks(id, column){\n"+
        "    var destElm = document.getElementById(id);\n"+
        "    if (destElm){\n"+
        "        var base_link = 'http://fcresearch-eu.aka.amazon.com/BTS2/results?s=';\n"+
        "        var noLinksArray = [].slice.call(destElm.querySelectorAll('td[data-type=\"' + column + '\"]'));\n"+
        "        noLinksArray.forEach(function(elm){\n"+
        "            var text = elm.textContent;\n"+
        "            elm.innerHTML = '<a href=\"' + base_link + text + '\">' + text + '</a>';\n"+
        "        });\n"+
        "    }\n"+
        "}\n\n"+

        "function findLinks(){\n"+
        "makeLiveLinks('inventory', 'lpn');\n"+
        "var linksArray = [].slice.call(document.querySelectorAll('a'));\n"+
        "var goodLinksArray = linksArray.filter(function(elm){\n"+
        "    var linkText = elm.textContent;\n"+
        "    for (var i = 0, length = findThese.length; i < length; i++){\n"+
        "        if (linkText.match('^' + findThese[i] + '')){return elm;}\n"+
        "    }\n"+
        "});"+
        "var barcodeWrapElm = document.getElementById('barcode_wrap');\n"+
        "console.log(goodLinksArray);\n"+
        "goodLinksArray.forEach(function(elm){\n"+
        "    elm.addEventListener('mouseenter', function(){\n"+
        "        generateCode('barcode_wrap', elm.textContent, 'CODE128B');\n"+
        "        fadeIn(barcodeWrapElm);\n"+
        "        console.log('MouseEnter: ' + elm.textContent);\n"+
        "    });\n"+
        "    elm.addEventListener('mouseleave', function(){\n"+
        "        destroyCode('barcode_wrap');\n"+
        "     });\n"+
        "});\n"+
        "}\n\n"+

        "ready(function(){\n"+
        "    appendStyle(style_text);\n"+
        "    appendWrapper('barcode_wrap');\n"+
        "    findLinks();\n"+
        "});";

        appendScript('barcodeTips', myTooltipJS);
}); // ready
