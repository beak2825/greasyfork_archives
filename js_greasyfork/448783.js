// MIT License

// Copyright (c) 2022 Sharad Raj Singh Maurya

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// ==UserScript==
// @name        Reddit Image Grid
// @namespace   https://sharadcodes.github.io
// @author      sharadcodes
// @description Shows the images in grid format
// @match       https://old.reddit.com/*
// @supportURL  https://github.com/sharadcodes/UserScripts/issues
// @version     1.0.2
// @license     MIT
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448783/Reddit%20Image%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/448783/Reddit%20Image%20Grid.meta.js
// ==/UserScript==

GM_addStyle(`
body.modal-open {
  overflow: hidden;
}
.modal {
  display: none;
  position: absolute;
  z-index: 10000;
  inset: 0;
  width: 100%;
  height: 100%;
  padding-top: 50px;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  text-align: center;
}

/* Modal Content */
#modal-images {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  width: 80%;
  height: 600px;
  overflow: auto;
  display: grid!important;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))!important;
  column-gap: .2rem!important;
  row-gap: .2rem!important;
}
.modal button {
  padding: 10px 25px;
  border-radius: 10px;
  border: none;
  margin-top: 5px;
  font-family: monospace;
  background: #89ff89;
}
.modal button:active{
  filter: brightness(80%);
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
`);

let images = [];
let next_page_url = "";
const modal_div = document.createElement("div");
modal_div.innerHTML = `
      <!-- The Modal -->
      <div id="myModal" class="modal">
        <div id="modal-images"></div>  
        <button id="load">Load more</button>
      </div>
        `;
const modal = modal_div.querySelector(".modal");
const image_grid = modal.querySelector("#modal-images");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
};
const load_btn = modal.querySelector("#load");
load_btn.addEventListener("click", async () => {
    console.log("Loading next page", next_page_url);
    await getImages();
});

GM_registerMenuCommand("Show Grid", async () => {
    document.body.appendChild(modal);
    document.body.classList.toggle("modal-open");
    modal.style.display = "block";
    next_page_url = document.location.href;
    window.scrollTo(0, 0);
    reset();
    await getImages();
});

async function getImages() {
    try {
        if (!next_page_url) {
            throw "No next page";
        }
        load_btn.innerHTML = "Loading...";
        const res = await fetch(next_page_url);
        const html_txt = await res.text();
        const doc = document.createElement("html");
        doc.innerHTML = html_txt;
        next_page_url = doc.querySelector(
            "#siteTable > div.nav-buttons .next-button a:last-child"
        )?.href;
        //
        console.log(next_page_url);
        //
        const posts = doc.querySelectorAll(
            'div.content[role="main"] div#siteTable .thing:not(.promotedlink)'
        );
        posts.forEach((post) => {
            const url = post.querySelector("a.thumbnail")?.href;
            if (url.includes("/gallery/")) {
                console.log("<RIG> Gallery found");
                const html = document.createElement("html");
                html.innerHTML = post
                    .querySelector(".expando")
                    .getAttribute("data-cachedhtml");
                html.querySelectorAll("a.gallery-item-thumbnail-link").forEach(
                    (i) => {
                        addImage(i?.href);
                    }
                );
            } else {
                addImage(url);
            }
        });
        load_btn.innerHTML = "Next Page";
    } catch (err) {
        console.log(err);
        load_btn.innerHTML = err;
    }
}

function addImage(url) {
    images.push(url);
    const img = document.createElement("img");
    img.src = url;
    if (
        url.includes(".jpg") ||
        url.includes(".jpeg") ||
        url.includes(".jfif") ||
        url.includes(".png") ||
        url.includes(".webp")
    ) {
        img.style.width = "160px";
        image_grid.append(img);
    }
}

function reset() {
    next_page_url = document.location.href;
    modal.querySelector("#modal-images").innerHTML = null;
}
