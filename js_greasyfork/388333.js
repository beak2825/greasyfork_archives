// ==UserScript==
// @name         Select by Match size (for Inventables' Easel)
// @namespace    http://easel.inventables.com/
// @version      0.1.2
// @description  Helper for Easel
// @author       eried
// @match        *://easel.inventables.com/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388333/Select%20by%20Match%20size%20%28for%20Inventables%27%20Easel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388333/Select%20by%20Match%20size%20%28for%20Inventables%27%20Easel%29.meta.js
// ==/UserScript==

var timeout;

function addMenu()
{
    var v = $("*[data-action='select-all']").parent();
    if(v.length >= 1)
    {
        var c = `
EASEL.editorActions.select.apply(null, function() {
    var d = [];
    var s = EASEL.volumeHelper.getSelectedVolumes();
    if (s.length <= 0) {
        alert("Select shapes to match size");
    } else {
        var i;
        for (i = 0; i < s.length; i++) {
            var selected = s[i];
            var a = EASEL.volumeStore.getVolumes();
            var b;
            var c;
            var e = 0;
            for (c = a.length; e < c; e++) {
                b = a[e];
                if (Math.abs(b.shape.width - selected.shape.width) < 0.001 && Math.abs(b.shape.height - selected.shape.height) < 0.001)
                    d.push(b.id);
            }
        }
    }
    return d;
}())
`;

        v.after("<li><a href=\"#\" onclick='"+c+"'>Select by Match Size</a></li>");
    }
    else
        timeout = setTimeout(addMenu, 1000);
}


// Add option to menu
//alert("aading");
addMenu();