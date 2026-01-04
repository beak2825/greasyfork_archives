// ==UserScript==
// @name         netflix-unogs-google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.co.in/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390308/netflix-unogs-google.user.js
// @updateURL https://update.greasyfork.org/scripts/390308/netflix-unogs-google.meta.js
// ==/UserScript==

(function() {
    let reg = /.*netflix.com.*title\/([\d]*)/g;
Array.from(document.querySelectorAll('div[class="r"] > a')).filter(link => (reg.test(link))).map(link => {
    return {
        'cite': link.querySelector('cite'),
        'href': 'http://unogs.com/video/?v=' + reg.exec(link.getAttribute('href'))[1]
    };
}).forEach(item => {
    let a = document.createElement('a')
    a.href = item.href
    a.target = '_blank'

    let img = document.createElement('img')
    img.src = 'http://unogs.com/favicon.ico'
    img.title = item.href
    img.style.width = '12px'
    img.style.marginLeft = '5px'
    a.appendChild(img)

    item.cite.parentNode.insertBefore(a, item.cite.nextSibling)
})

})();