// ==UserScript==
// @license MIT
// @name         Mlwbd Direct download link by annomsDev
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get direct download link on any movie page in mlwbd
// @author       github.com/foysalBN
// @match
// @include      https://mlwbd.*
// @icon         https://www.google.com/s2/favicons?domain=mlwbd.one
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437741/Mlwbd%20Direct%20download%20link%20by%20annomsDev.user.js
// @updateURL https://update.greasyfork.org/scripts/437741/Mlwbd%20Direct%20download%20link%20by%20annomsDev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!location.pathname.includes('/movie/')) return
//    alert('Annomd script: Movie links found')
    let link= document.querySelectorAll('input[name=FU]')[0].getAttribute('value')

    let info =document.getElementById('info')
    let a = document.createElement('a')
    a.setAttribute('href', link)
    a.setAttribute('target','_blank')
    a.style='padding: 2px 10px; color: white; background-color: rgb(221, 0, 0); border-radius: 2px;font-size:12px;box-shadow: 0px 0px 10px 3px #e91e1e;'
    a.innerText='Download: '+link
    info.appendChild(a)

    //<iframe src="https://songslyric.site/links/40232/" width="662px" height="500px"></iframe>
    let linkBox = document.getElementsByClassName('box_links')[0]
    let iframe =document.createElement('iframe')
    iframe.src=link;
    iframe.id='annomsIframe'
    iframe.width='50%';
    iframe.height='300px'
    iframe.style='margin:0 25%'
    linkBox.appendChild(iframe)



})();