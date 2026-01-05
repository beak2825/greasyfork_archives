// ==UserScript==
// @name         Voxed NSFW
// @namespace    voxed.nsfw
// @version      1.5
// @description  Difumina las portadas de los vox que son NSFW.
// @author       Voxero
// @match        http*://*.voxed.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25038/Voxed%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/25038/Voxed%20NSFW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nsfw = ["XXX", "GOR", "UFF", "HOT", "GTB"];
    var voxList = document.getElementsByClassName('vox-list')[0];
    if(typeof voxList != 'undefined')
    {
        var voxs = document.getElementsByClassName('vox');
        for(var i = 0; i < voxs.length; i++) {
            var category = voxs[i].getElementsByClassName('category')[0];

            if(typeof category != 'undefined')
            {
                var cat = category.innerHTML;

                if(nsfw.indexOf(cat) != -1)
                {
                    voxs[i].getElementsByTagName('img')[0].style.filter = ((cat == "HOT" || cat == "UFF") ? 'blur(10px)' : 'blur(25px)');
                    voxs[i].getElementsByClassName('tags')[0].style.zIndex = "1";
                    category.style.zIndex = "1";
                }
            }
        }
    }
})();