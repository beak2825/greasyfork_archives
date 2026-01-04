// ==UserScript==
// @name         LINE StickerShop Copy
// @namespace    http://danemiller.me/
// @version      0.1
// @description  Script adds a copy button to the stickers from the LINE StickerShop to paste the link to them in any application.
// @author       unfaiyted
// @oujs:author  unfaiyted
// @match        https://store.line.me/stickershop/product/**
// @homepageURL  https://github.com/unfaiyted/line-stickershop-copier
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375345/LINE%20StickerShop%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/375345/LINE%20StickerShop%20Copy.meta.js
// ==/UserScript==

GM_addStyle(`

.stickerADD {
margin-top: 15px;
border: 1px solid #ccc;
color: #fff;
background-color: #00b84f;
padding: 10px 30px;
position: relative;
}

.stickerADD:hover {
transform: scale(1.03);
font-weight: bold;
}

.stickerADD:active {
transform: translateY(3px)
}

.stickerADD:before {
    content: 'Copied Link!';
    position: absolute;
    top: 115%;
    left: 6%;
    z-index: 10;
    border: 1px solid #000;
    width: 100px;
    height: 20px;
    background: #454545;
    border-radius: 3px;
    display: none;
    text-align: center;
    padding-left: 20px;
    padding-top: 5px;
}

.stickerADD:active:before {
   display: flex;
}


`);


(function() {
   window.addEventListener('load', function() {
    'use strict';

    // Here You can type your custom JavaScript...
    const body = document.getElementsByTagName('body')[0];
    const images = document.querySelectorAll('.mdCMN09LiInner');
    //mdCMN09LiInner
    //mdCMN09Image

    images.forEach((image) => {

        const sticker = image.querySelector('.mdCMN09Image')
        .style.backgroundImage;

        const copyText = sticker
        .replace('url("','')
        .replace('")','');

        const btn = document.createElement("button");

        btn.setAttribute("data-clipboard-action", "copy");
        btn.setAttribute("data-clipboard-text", copyText);
        btn.setAttribute("class", "stickerADD")
        btn.innerText = "Copy Sticker"

        image.appendChild(btn);

        btn.addEventListener("click", (e) => {
            const copyText = e.target.getAttribute('data-clipboard-text');
            console.log("copy clicked");

            //  GM_setClipboard(copyText);

            navigator.clipboard.writeText(copyText).then(function() {
                console.log('Async: Copying to clipboard was successful!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });

        });

    });




    // Your code here...










}, false);

})();
