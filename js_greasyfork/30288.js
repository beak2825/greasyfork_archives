// ==UserScript==
// @name         Open Google Image in New Tab
// @version      0.02
// @namespace    https://orbitalzero.ovh/scripts/
// @description  Open image in new tab by alt+shift+clicking them
// @author       NeutronNoir
// @include      *
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/30288/Open%20Google%20Image%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/30288/Open%20Google%20Image%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    
    var mo = new MutationObserver( function (mutRecords) {
        var images = [];
        
        Promise.all(mutRecords.map(function (record) {
            return Promise.all(Array.from(record.addedNodes).map(function(node) {
                if (!node.getElementsByTagName) return;
                images = images.concat(Array.from(node.getElementsByTagName("img")));
            }));
        })).then(function () {
            images.forEach(function (image) {
                image.addEventListener('click', open_tab.bind(undefined, image), true);
            });
        });
    });
    
    if (document.getElementById("rg_s")) mo.observe(document.getElementById("rg_s"), {childList: true});
    
    var images = document.getElementsByTagName('img');
    Array.from(images).forEach(function (image) {
        image.addEventListener('click', open_tab.bind(undefined, image), true);
    });
    
    
})();

function open_tab(image, event) {
    if(event.shiftKey && event.ctrlKey){
        event.preventDefault();
        var re = /imgurl=([^&]*)/;
        GM_openInTab(unescape(re.exec(image.parentElement.href)[1]));
        event.stopPropagation();
    }
}