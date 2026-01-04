// ==UserScript==
// @name         全民k歌下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://kg3.qq.com/node/play?s=WQVBcbWjJNHaNWcr&shareuid=64989f852028378e35&topsource=a0_pn201001006_z1_u652055051_l1_t1578575070__
// @grant        none
// @include      https://kg3.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/394876/%E5%85%A8%E6%B0%91k%E6%AD%8C%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/394876/%E5%85%A8%E6%B0%91k%E6%AD%8C%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
      function loader() {
        $("body").append($('<script type="text/javascript" src="//lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>'));
    }
    loader()
     window.addEventListener('load', () => {
    addButton('下载歌曲', download)
    })

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }
    function download(){
        let t = $("body").text()
        let ms = t.split('m4a')
        let m4a1 = ms[0]
        let hs = m4a1.split('http://')
        let h1 = hs[hs.length-1]
        let url = 'http://'+h1+'m4a'
        window.open(url,'_blank')
    }

})();