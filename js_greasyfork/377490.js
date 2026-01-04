// ==UserScript==
// @name         Shikimori Userpage lists tooltip
// @namespace    http://shikimori.org/
// @version      1.7
// @description  Show list in tooltip when mouseover links. Used tippy.js lib - https://atomiks.github.io/tippyjs/
// @author       XENKing
// @license      MIT
// @match        https://shikimori.org/*
// @match        http://shikimori.org/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://unpkg.com/popper.js@1/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@4
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/377490/Shikimori%20Userpage%20lists%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/377490/Shikimori%20Userpage%20lists%20tooltip.meta.js
// ==/UserScript==
// BUG: profile-head set state hover while tooltip hover

// base64 cat-loading pic

const INITIAL_CONTENT = '<img src="https://www.dropbox.com/s/7zf7nedbr0imw7q/tooltip_load.gif?raw=1" width=150px style="overflow: hidden !important; margin:5px 0;"></img>';

let fetch_counter = 1;
let item_size = null;
let showTooltip = false;

function appendStyle() {
  let head = document.getElementsByTagName('head')[0];

  let style = document.createElement('link');
  style.href = "https://unpkg.com/tippy.js@4/themes/light-border.css"
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
}

function checkPath() {
  if (/^\w+:\/{2}[\w.]+\/\w+$/.test(location.href)) {
    showTooltip = true;
    return true;
  }
  return false;
}

let resizeTooltip = function (div, tip) {
  const {
    popper
  } = tip;
  const {
    tooltip,
    content
  } = tip.popperChildren;
  tip.state.isFetching = false;
  if (!tip.state.isVisible) {
    return;
  }

  if (!tip._transitionEndListener) {
    tip._transitionEndListener = event => {
      if (event.target === event.currentTarget) {
        content.style.opacity = '1';
        tip.setContent(div);
      }
    };
  }
  tooltip.addEventListener('transitionend', tip._transitionEndListener);

  if (!tip._baseHeight) {
    tip._baseHeight = tooltip.clientHeight;
  }
  if (!tip._baseHeight) {
    tip._baseWidth = tooltip.clientWidth;
  }

  //content.style.opacity = '0';
  tip.setContent(div);
  const height = tooltip.clientHeight;
  popper.style.height = height + 'px';
  tooltip.style.height = tip._baseHeight + 'px';
  // Cause reflow so we can start the height transition.
  void tooltip.offsetHeight;
  void tooltip.offsetWidth;
  // Start the transition.
  tooltip.style.height = height + 'px';
  if (height > 550) {
    tooltip.style.maxHeight = "27em";
    tooltip.style.overflowY = "auto";
  }
  // Remove the Loading... content and wait until the
  // transition finishes.
};

let fetchAll = function (url, div, tip) {
  let is_full = true;
  let header = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
    'X-Requested-With': 'XMLHttpRequest',
  });

  let sentData = {
    method: 'GET',
    mode: 'cors',
    header: header,
    cache: 'default',
  };
  fetch(url + "/page/" + fetch_counter, sentData)
    .then(response => response.text())
    .then(html => {

      let parser = new DOMParser();
      // Parse the text
      let doc = parser.parseFromString(html, "text/html");
      if (item_size === null) {
        item_size = doc.querySelector(".always-active.selected span").innerText;
        // try to add searchbox
        //$(doc).find('.b-collection_search input').clone(true).appendTo(div);
      }
      if (item_size > 400) {
        is_full = false;
        item_size -= 400;
        fetch_counter++;
      }
      // debug
      //console.log("item_size" + item_size);
      //console.log("fetch_counter" + fetch_counter);
      doc.querySelectorAll(".user_rate").forEach((el, i) => {
        let tr = document.createElement("tr");
        let td_name = document.createElement("td");
        td_name.className = "name";
        let link = el.querySelector(".entries .name a");
        let index = el.querySelector(".index");
        index.style.color = "#9da2a8";
        index.style.paddingRight = "5px";
        index.style.width = "20px";
        index.style.textAlign = "center";

        link.style.whiteSpace = "pre";
        td_name.appendChild(link);
        tr.appendChild(index);
        tr.appendChild(td_name);
        div.appendChild(tr);
      });
    }).catch(error => {
      console.log("fetch error: " + error);
      tip.state.isFetching = false;
      return;
    }).finally(() => {
      if (is_full) {
        resizeTooltip(div, tip);
        return;
      }
      fetchAll(url, div, tip);
    });
};

function createTip() {
  if (!checkPath() || !showTooltip) {
    return;
  }
  appendStyle();
  tippy.group(tippy('.stat_name a', {
    content: INITIAL_CONTENT,
    interactive: true,
    theme: 'light-border',
    boundary: 'window',
    maxWidth: '800px',
    animation: 'fade',
    duration: 100,
    delay: 200,
    followCursor: 'initial',
    flip: true,
    hideOnClick: 'toggle',
    placement: "bottom-start",
    flipBehavior: ["top", "bottom"],
    onShow(tip) {
      fetch_counter = 1;
      item_size = null;
      if (tip.state.isFetching === true || tip.state.canFetch === false) {
        return;
      }
      tip.state.isFetching = true;
      tip.state.canFetch = false;
      let url = tip.reference.href;
      let div = document.createElement("table");
      div.style.textAlign = "left";
      // fetch first, count size, split in 400, fetch all, show tooltip
      fetchAll(url, div, tip);
    },
    onHidden(tip) {
      tip.state.canFetch = true;
      tip.setContent(INITIAL_CONTENT);
      const {
        tooltip
      } = tip.popperChildren;
      tooltip.style.height = null;
      tooltip.removeEventListener('transitionend', tip._transitionEndListener);
      tip._transitionEndListener = null;
    }
  }));
}
// Using ImoutoChan loading function
function ready(fn) {
  document.addEventListener('page:load', fn);
  document.addEventListener('turbolinks:load', fn);

  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  }
  else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(createTip);
