// ==UserScript==
// @name         Startpage Direct Image URL
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Allow direct linking to images from Startpage, without a proxy
// @author       YXXXXNN
// @license      GPL
// @match        https://startpage.com/sp/search*
// @match        https://startpage.com/do/dsearch*
// @match        https://www.startpage.com/sp/search*
// @match        https://www.startpage.com/do/dsearch*
// @match        https://eu.startpage.com/sp/search*
// @match        https://eu.startpage.com/do/dsearch*
// @match        https://us.startpage.com/sp/search*
// @match        https://us.startpage.com/do/dsearch*
// @match        https://*.startpage.com/sp/search*
// @match        https://*.startpage.com/do/dsearch*
// @icon         https://www.google.com/s2/favicons?domain=startpage.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/435136/Startpage%20Direct%20Image%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/435136/Startpage%20Direct%20Image%20URL.meta.js
// ==/UserScript==

const dirImgClassName = "css-dirimg451";
window.addEventListener('load', () => {
    // Link element
    var a = document.createElement("a");
    a.rel = "noopener nofollow noreferrer";
    a.target = "_blank";
    a.ariaLabel = "link";
    a.className = dirImgClassName;
    a.innerHTML = "View direct image";
    a.style = "color: #7f869f; font-size: 13px; text-decoration: none; margin-top: 15px;"
    document.getElementsByClassName("expanded-details-link")[0].append(a);
    // Add functionality
    var imgbtn = document.getElementsByClassName('image-links')[0].children[0];
    var observer = new MutationObserver((mutations) => {
        let url = imgbtn.href;
        url = url.substring(52);
        url = url.substring(0, url.indexOf('&'));
        url = decodeURIComponent(url);
        document.getElementsByClassName(dirImgClassName)[0].href = url;
    });
    observer.observe(imgbtn, {
        attributes: true,
        attributeFilter: ['href'] });
    imgbtn.dataset.selectContentVal = 1;
}, false);