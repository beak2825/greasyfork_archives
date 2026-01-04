// ==UserScript==
// @name         youtube subscriptions elderly mode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ''
// @author       cw2k13
// @match        https://www.youtube.com/feed/subscriptions
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/452667/youtube%20subscriptions%20elderly%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/452667/youtube%20subscriptions%20elderly%20mode.meta.js
// ==/UserScript==
 
(function(document) {
    window.addEventListener("load",function(){
        let styleNode = document.createElement("style");
        styleNode.setAttribute("type","text/css");
        styleNode.innerHTML = `
 #items.ytd-grid-renderer {
 justify-content: center;
}
#items.ytd-grid-renderer>ytd-grid-video-renderer.ytd-grid-renderer{
width: 360px;
}
ytd-two-column-browse-results-renderer.ytd-browse.grid {
    width: auto!important;
    max-width: none!important;
}
ytd-thumbnail.ytd-grid-video-renderer {
height: 203px;
width: auto;
}
ytd-thumbnail.ytd-grid-video-renderer img{
width:97%!important;
}
`
        let headNode = document.querySelector('head');
        headNode.appendChild(styleNode);
        (()=>{
            const el= document.querySelector('ytd-two-column-browse-results-renderer')
            if (!el) return setTimeout(()=>arguments.callee(),1000)
            const className=el.className.replace(/grid\-\d\-columns/g,'')
            const setClass=()=>{el.className=`${className}grid-${Math.floor((document.querySelector('ytd-browse').clientWidth)/360)}-columns`}
            setClass()
            window.onresize=(e)=>{
                setTimeout(setClass,500)
            }
        })()
 
    })
})(document);