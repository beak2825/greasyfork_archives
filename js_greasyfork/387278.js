// ==UserScript==
// @name        Dev.to Image Lightbox
// @version     1.0
// @description Add image lightbox to dev.to
// @license     MIT
// @author      Parsa Kafi
// @namespace   https://github.com/parsakafi
// @include     https://dev.to/*
// @run-at      document-idle
// @grant       none
// @icon        https://dev.to/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/387278/Devto%20Image%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/387278/Devto%20Image%20Lightbox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var bodyElement = document.getElementsByTagName('body')[0],
     bodyImages = document.getElementsByClassName('article-body-image-wrapper');

    var imageModalStyleSheet = document.createElement('style')
    imageModalStyleSheet.innerHTML = "body.active-modal-image{overflow-y:hidden;height: 100%;}#image-modal{display:none;overflow:auto;position:fixed;width:100%;height:100vh;background-color:#fff;z-index:2000;top:0;left:0}#image-modal.display-modal{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:center}#image-modal>img{max-width:100%;height:auto;margin:10px;display:block;-webkit-animation-name:zoom;-webkit-animation-duration:.6s;animation-name:zoom;animation-duration:.6s}@-webkit-keyframes zoom{from{-webkit-transform:scale(0)}to{-webkit-transform:scale(1)}}@keyframes zoom{from{transform:scale(0)}to{transform:scale(1)}}#image-modal>button{border:1px solid #0d1219;color:#fff;background-color:#141f2d;position:absolute;right:30px;top:30px;font-size:1.2em;padding:0 10px 5px;cursor:pointer;z-index:5}body.night-theme #image-modal{background-color:#0d1219}";
    document.body.appendChild(imageModalStyleSheet);

    var imageModalElement = createModalElement('<div id="image-modal"><img src="" /><button id="hide-image-modal">x</button></div>');
    document.body.insertBefore(imageModalElement, document.body.childNodes[0]);
    var imageModal = document.getElementById('image-modal');

    document.getElementById('hide-image-modal').addEventListener("click", function () {
        toggleImageModal();
    });

    for (var i = 0; i < bodyImages.length; i++) {
        (function (index) {
            bodyImages[index].addEventListener("click", function (event) {
                event.preventDefault();
                imageModal.children[0].setAttribute("src", bodyImages[index].getAttribute('href'));
                toggleImageModal();
            })
        })(i);
    }

    function toggleImageModal(){
        bodyElement.classList.toggle("active-modal-image");
        imageModal.classList.toggle("display-modal");
    }

    function createModalElement(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }
})();