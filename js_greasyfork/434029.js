// ==UserScript==
// @name         Animevost_view_update
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adding amenities for viewing anime only on AnimeVost.org
// @author       Klastor
// @match        https://animevost.org/tip/tv/*
// @match        *://*.agorov.org/tip/tv*
// @match        *://*.vost.pw/tip/tv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434029/Animevost_view_update.user.js
// @updateURL https://update.greasyfork.org/scripts/434029/Animevost_view_update.meta.js
// ==/UserScript==

(function() {
    
    function delet(){document.querySelector("#comment").remove()};

    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', delet);
    } else {
        delet();
    };

    document.onreadystatechange = function(){
        let panel = document.querySelector('.functionPanel');
        document.querySelector(".shortstoryContent").prepend(panel);
        panel.style.marginBottom = "75px";
        document.querySelector(".shortstoryContent").prepend(document.querySelector('#playerbox'));
        let select = document.querySelector('.active').getAttribute('id');
        document.getElementById(select).style.background = 'purple';
        let wrapper = document.querySelector(".shortstory");
        wrapper.insertBefore(wrapper.children[2], wrapper.children[1]);
        [].forEach.call(document.querySelector('#items').children, function (item){
            item.addEventListener('click', () => {
                 item.style.background = 'purple';
                 document.getElementById(select).style.cssText = 'rgba(0, 0, 0, 0) linear-gradient(to bottom, #fcc983 0%, #ffd598 100%) repeat scroll 0 0';
                 select = item.getAttribute('id');
                 document.querySelector('#knpki').remove();
            });
        });
    };
})();