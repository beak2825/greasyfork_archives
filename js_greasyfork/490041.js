// ==UserScript==
// @name        ENTHUB image preview
// @description Превью картинок и гифок
// @version     1.4
// @author      Millium, REIONE
// @match       https://enthub.it/*
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/1275459
// @downloadURL https://update.greasyfork.org/scripts/490041/ENTHUB%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/490041/ENTHUB%20image%20preview.meta.js
// ==/UserScript==

GM_addStyle(`
  .hover-img-preview {
    position: absolute;
    display: none;
    max-width: 300px;
    z-index: 999999;
  }

  .img-block {
    max-height: 30rem;
    height: auto;
    -o-object-fit: cover;
    object-fit: contain;
    border-radius: .5rem;
    margin: 1rem 0;
    max-width: 50%;
  }
`);

const observeDOM = (fn, e = document.documentElement, config = { attributes: false, childList: true, subtree: true }) => {
    const observer = new MutationObserver(fn);
    observer.observe(e, config);
    return () => observer.disconnect();
};

observeDOM(() => addImages(), document.querySelector('#comments'));

addImages();

function addImages() {
    const imgLinks = document.querySelectorAll('a.comment-body[href][target]');

    imgLinks.forEach(imgLink => {
        if (imgLink.href.match(/\.(jpeg|jpg|gif|png|webp)$/) && imgLink.href.match(/[^/]+$/)) {
            const postContainer = imgLink.parentElement;
            if (postContainer.querySelector(`img[src="${imgLink.href}"]`) === null) {
                const imgBlock = document.createElement('img');
                imgBlock.className = 'img-block';
                imgBlock.src = imgLink.href;
                postContainer.appendChild(imgBlock);
                imgLink.style.display = 'none';
            }
        }
    });
}