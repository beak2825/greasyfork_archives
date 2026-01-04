// ==UserScript==
// @name         pornolab.net Full Size Images
// @version      0.1
// @description  Auto-expanded and full size images on pornolab.net
// @author       plabfan
// @match        https://pornolab.net/*
// @include      http://pornolab.net/*
// @license      WTFPL
// @grant        none
// @icon         http://static.pornolab.net/favicon.ico
// @run-at document-idle
// @namespace https://greasyfork.org/users/150864
// @downloadURL https://update.greasyfork.org/scripts/32681/pornolabnet%20Full%20Size%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/32681/pornolabnet%20Full%20Size%20Images.meta.js
// ==/UserScript==

function replace() {
    var as = document.querySelectorAll('a.postLink');
    var imgs = document.querySelectorAll('img.postImg');

    var i;
    for(i = 0; i < as.length; ++i) {
        var a = as[i];
        var ext = 'jpg';
        if (a.href.includes('jpeg')) {
            ext = 'jpeg';
        } else if (a.href.includes('png')) {
            ext = 'png';
        }
        var img = a.querySelectorAll('img.postImg');
        if (img) {
            img = img[0];
            if (img.src.includes('fastpic')) {
                var src = img.src.replace('thumb', 'big').replace('jpeg', ext);
                if (!src.endsWith('?noht=1')) {
                    src = src + '?noht=1';
                }
                img.src = src;
            }
        }
    }
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    if (mutations[0].target.toString() == '[object HTMLDivElement]') {
        replace();
    }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

(function() {
    'use strict';


    function expandAll()
    {
        var array = document.getElementsByClassName("sp-head");
        for(var key in array)
        {
            var elem = array[key];
            if(typeof elem.dispatchEvent === "function")
            {
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                elem.dispatchEvent(evt);
            }
        }
    }

    expandAll();
})();