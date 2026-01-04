// ==UserScript==
// @name        language searcher - nhentai.net
// @namespace   Violentmonkey Scripts
// @match       https://nhentai.net/*
// @grant       none
// @version     1.1
// @author      retiym
// @license MIT
// @description 2023/12/5 下午10:54:48
// @downloadURL https://update.greasyfork.org/scripts/481466/language%20searcher%20-%20nhentainet.user.js
// @updateURL https://update.greasyfork.org/scripts/481466/language%20searcher%20-%20nhentainet.meta.js
// ==/UserScript==

const language = {
  "ch": "chinese",
  "en": "english",
  "jp": "japanese"
}

const title_row = document.getElementsByTagName('h1')[0];

const style = document.createElement("style");

style.innerHTML = `
  .searcher_btn {
    width: 40px;
    height: 40px;
    user-select: none;
    background-color: #595959;
    border-radius: 4px;
    font-size: 20px;
    line-height: 40px;
  }
`
document.head.appendChild(style)

const getSearchTarget = () => {
  const url = window.location.pathname.split('/').filter((item) => item);
  const [category, name] = url

  if (category == 'g') return

  Object.entries(language).map(([key, value]) => {
    const destination = `/search/?q=${category}%3A${name}+%26%26+language%3A${value}`
    const btn = document.createElement("a")
    btn.appendChild(document.createTextNode(key));
    btn.classList.add('searcher_btn');
    btn.classList.add("tag");
    btn.setAttribute("href", destination);

    title_row.appendChild(btn);
  })
}

getSearchTarget();