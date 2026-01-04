// ==UserScript==
// @name         copytoon (云端存储)
// @namespace    http://copytoon.com/
// @version      1.0.1
// @description  copytoon
// @author       copytoon 

// @icon         https://www.google.com/s2/favicons?sz=64&domain=copytoon246.com
// @grant        none
// @include      https://copytoon*.com/*.html
// @downloadURL https://update.greasyfork.org/scripts/440032/copytoon%20%28%E4%BA%91%E7%AB%AF%E5%AD%98%E5%82%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440032/copytoon%20%28%E4%BA%91%E7%AB%AF%E5%AD%98%E5%82%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const _$ = function (el) {
        return document.querySelectorAll(el);
    };


    const elImgSwapper = _$("#bo_v_con")[0];
    let newCloneNode = elImgSwapper.cloneNode(true);
    _$(".contents.view-head.no-attach")[0].appendChild(newCloneNode);
    let newCloneNode2 = elImgSwapper.cloneNode(true);
    _$(".contents.view-head.no-attach")[0].appendChild(newCloneNode2);
    let newCloneNode3 = elImgSwapper.cloneNode(true);
    _$(".contents.view-head.no-attach")[0].appendChild(newCloneNode3);
    _$(".contents.view-head.no-attach")[0].onclick = function () {
        _$(".at-menu")[0].style.opacity =
            _$(".at-menu")[0].style.opacity === "0" ? 1 : 0;
    };
    _$('.contents.view-head.no-attach')[0].dispatchEvent(new CustomEvent('click'))

    document.documentElement.addEventListener("keydown", function (event) {
        if (event.isComposing || event.keyCode === 65) {
            _$(".btn-prev a")[0].click();
        }
        if (event.isComposing || event.keyCode === 70) {
            _$(".btn-next a")[0].click();
        }
        if (event.isComposing || event.keyCode === 83) {
            window.scrollTo({
                top:
                document.documentElement.scrollTop -
                4 * document.documentElement.clientHeight +
                120,
                // behavior: "smooth",
            });
            event.preventDefault();
        }
        if (event.isComposing || event.keyCode === 68) {
            window.scrollTo({
                top:
                document.documentElement.scrollTop +
                4 * document.documentElement.clientHeight -
                120,
                // behavior: "smooth",
            });
            event.preventDefault();
        }
        if (event.isComposing || event.keyCode === 32) {
            window.scrollTo({
                top:
                document.documentElement.scrollTop +
                4 * document.documentElement.clientHeight -
                120,
                // behavior: "smooth",
            });
            event.preventDefault();
        }
    });

    try {
        var linkzh = document.createElement("link");
        linkzh.setAttribute("rel", "prerender");
        linkzh.setAttribute("href", _$(".btn-next a")?_$(".btn-next a")[0].href:'');
        document.head.appendChild(linkzh);
    } catch {}



    var stylee = document.createElement("style");
    stylee.type = "text/css";
    var sHtml = `
        .at-body {
          margin-top: -50px;
        }
        .at-body .at-container {
          box-sizing: border-box;
          overflow: hidden;
          max-width: 98vw;
          width: 98vw;
        }
        .at-body .at-content {
          box-sizing: border-box;
          width: 98vw;
        }
        .btn-next {
          margin-left: 0;
          right: 0;
        }
        .pc-menu .nav-top {
          left: 50%;
          transform: translateX(-50%);
        }
        .view-head.no-attach {
          display: flex;
          justify-content:center;
        }
        #bo_v_con{
        width:unset !important;
        }
        #bo_v_con+#bo_v_con{
        margin-left:8px;
        }
        #bo_v .contents img {
          width: calc(20vw) !important;
          margin:0;
        }

        #bo_v_con:nth-child(2) {
          margin-top: calc(-100vh + 20px);
        }
        #bo_v_con:nth-child(3) {
          margin-top: calc(-200vh + 40px);
        }
        #bo_v_con:nth-child(4) {
          margin-top: calc(-300vh + 60px);
        }
        `;
    stylee.innerHTML = sHtml;
    document.getElementsByTagName("head").item(0).appendChild(stylee);

    document.querySelector('#mb_id').value = 'xcvb2345'
    document.querySelector('#mb_password').value = '0b8mfR%6J@D2'
})();