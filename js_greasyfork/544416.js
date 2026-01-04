// ==UserScript==
// @name         vamvideo
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  作者标记，作者列表折叠
// @author       ssnangua
// @match        https://www.vamvideo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vamvideo.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544416/vamvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/544416/vamvideo.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  function h(tagName, attrs, children) {
    const el = document.createElement(tagName);

    const args = arguments.length;
    if (args === 1) return el;
    else if (args === 2) [children, attrs] = [attrs, {}];

    for (let key in attrs) {
      const value = attrs[key];
      if (key === "style") {
        if (typeof value === "string") el.style.cssText = value;
        else {
          for (let name in value) el.style[name] = value[name];
        }
      } else if (key === "className") el.className = value;
      else if (/^on[^a-z]/.test(key) && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
      else el.setAttribute(key, value);
    }

    if (typeof children === "string") el.innerHTML = children;
    else children.forEach((child) => el.appendChild(h(child)));

    return el;
  }

  // 作者标记
  const pinCache = {
    data: localStorage.pin ? JSON.parse(localStorage.pin) : {},
    get(author) {
      return this.data[author];
    },
    set(author, item) {
      this.data[author] = item;
      localStorage.pin = JSON.stringify(this.data);
    },
  };

  const list = $$(".post").map(($post) => {
    const $img = $("img", $post);
    const $author = $(".cat", $post);
    const $title = $("h3", $post);

    const date = $img.dataset.src.match(/\d{4}\/\d{2}\/\d{2}/)?.[0];
    const item = {
      author: $author.textContent.trim(),
      title: $title.textContent.trim(),
      date,
      dateValue: date ? +new Date(date) : 0,
    };

    const $pin = h(
      "span",
      {
        className: "pin",
        onClick() {
          pinCache.set(item.author, item);
          updatePinState();
        },
      },
      '<i class="icon icon-pin"></i>'
    );
    $author.appendChild($pin);

    return { $post, $pin, ...item };
  });

  function updatePinState() {
    list.forEach((item) => {
      const pin = pinCache.get(item.author);
      if (!pin) return;
      item.$post.classList.toggle("old", item.dateValue <= pin.dateValue);
      item.$pin.classList.toggle("cur", item.title === pin.title);
    });
  }
  updatePinState();

  // 列表页作者列表折叠
  const $authors = document.querySelector(".filters>.filter-item>.filter");
  if ($authors) {
    let isExpand = localStorage.is_expand === "1";
    $authors.classList.toggle("is-expand", isExpand);

    const $expand = h(
      "span",
      {
        className: "expand-btn",
        onClick() {
          isExpand = !isExpand;
          $authors.classList.toggle("is-expand", isExpand);
          localStorage.is_expand = isExpand ? "1" : "0";
        },
      },
      '<i class="icon icon-more"></i>'
    );
    $authors.appendChild($expand);
  }

  GM_addStyle(`
    .header > .container {
      display: flex;

      & .nav-main {
        flex: auto;
        display: flex;
        width: 0;

        & li {
          white-space: nowrap;
        }
      }

      & .nav-right {
        flex-shrink: 0;

        & li {
          background: #fff;
        }
      }
    }

    .pin, .expand-btn {
      float: right;
      line-height: 16px;
      background: #f4f4f5;
      padding: 0px 3px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.1s;

      &:hover, &.cur {
        background: var(--theme-color);
        color: #fff;
      }
    }

    .post.old {
      opacity: 0.3;
      &:hover { opacity: 1; }
    }

    .expand-btn {
      float: none;
      display: inline-block;
      line-height: 1;
      padding: 6px 10px 7px;
      border-radius: 4px;
    }

    .filters>.filter-item:nth-child(1)>.filter {
      & a {
        display: none;
      }
      & a.active, &.is-expand a {
        display: inline-block;
      }
    }
  `);
})();
