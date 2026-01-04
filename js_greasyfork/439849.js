// ==UserScript==
// @name         osu!backgrounddl
// @namespace    http://osu.ppy.sh
// @version      0.12
// @description  downloader for the backgrounds in osu beatmaps
// @author       aisuneko
// @match        https://osu.ppy.sh/*
// @icon         https://osu.ppy.sh/favicon.ico
// @run-at document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439849/osu%21backgrounddl.user.js
// @updateURL https://update.greasyfork.org/scripts/439849/osu%21backgrounddl.meta.js
// ==/UserScript==
const bodyList = document;
const config = {
    childList: true,
    subtree: true
};
function main(){
    let container = document.getElementsByClassName("beatmapset-header__buttons")[0];
    if (container != undefined){
        let i = container.firstChild;
        let btn = i.cloneNode(true);
        btn.setAttribute('title', 'Get background image for this diff');
        btn.innerHTML = "<span class=\"btn-osu-big__content btn-osu-big__content--center\"><span class=\"btn-osu-big__icon\"><span class=\"fa fa-fw\"><span class=\"far fa-image\"></span></span></span></span>";
        //i.parentNode.replaceChild(clm, i);
        if(container.lastChild.getAttribute("class") != btn.getAttribute("class")){
            container.append(btn);
            btn.addEventListener('click', function(){
                let re = new RegExp('\\d+', 'g');
                let res_arr = window.location.href.match(re);
                let dest = "https://beatconnect.io/bg/"+res_arr[0]+"/"+res_arr[1];
                window.open(dest);
            });
        }
    }
    return;
}
function observe(){
    let oldHref = document.location.href;
    window.onload = function() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    main();
                }
            });
        });
        observer.observe(bodyList, config);
    };
}
(function(){
    observe();
})();
