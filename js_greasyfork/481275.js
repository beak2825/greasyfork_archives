// ==UserScript==
// @name         豆沙绿护眼模式Plus
// @version      4.2
// @description  改网页背景色为豆沙绿
// @author       ChatGPT
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/481275/%E8%B1%86%E6%B2%99%E7%BB%BF%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/481275/%E8%B1%86%E6%B2%99%E7%BB%BF%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FPlus.meta.js
// ==/UserScript==
 
function addStyle(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}
 
addStyle(`
    * {
        transition: background-color .3s ease-out, color .3s ease-out;
    }
    body, div#gb, div#main, 
    div.url.clearfix, div.nav-bar-v2-fixed > * > *:not(div.nav-bar-bottom), 
    div.se-page-hd-content {
        background-color: #D3E2D0 !important;
    }
    a[href^='http']:not(.button) {
        color: #40933C !important;
        text-decoration: none !important;
    }
`);
 
function background() {
    let elementList = document.querySelectorAll('*');
    for(let i = 0; i< elementList.length; i++){   
        if(!(elementList[i].matches('[class*="player"] > *') || 
             elementList[i].matches('.video > *'))){
            let srcBgColor = window.getComputedStyle(elementList[i]).backgroundColor;
            let splitArray = srcBgColor.match(/[\d\.]+/g);
            let r = parseInt(splitArray[0], 10),
                g = parseInt(splitArray[1], 10),
                b = parseInt(splitArray[2], 10);
            if(r > 150 && g > 150 && b > 150) {
                //elementList[i].style.backgroundColor='#C7EDCC';
                elementList[i].style.backgroundColor='#D3E2D0';
            }
        }
    }
}
 
background();
 
window.onload = function() {
    background();
};
 
    let observer = new MutationObserver(function(mutations) {
        background();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });