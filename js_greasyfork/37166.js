// ==UserScript==
// @name         Add Site Search Links To Google Search Result
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.21
// @license      AGPL v3
// @author       jcunews
// @description  Add a "Site Results" and "Cached Page" links onto each Google search result entries to search from that site. The link will be added either in the search result entry's popup menu, or after the green URL below the entry's title.
// @include      *://www.google.*/search*
// @include      *://www.google.*.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37166/Add%20Site%20Search%20Links%20To%20Google%20Search%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/37166/Add%20Site%20Search%20Links%20To%20Google%20Search%20Result.meta.js
// ==/UserScript==

(function(a, t, next) {
  function dropdownClick(a) {
    this.setAttribute("aria-expanded", a = this.classList.toggle("selected"));
    this.parentNode.querySelector(".action-menu-panel").style.visibility = a ? "inherit" : "";
  }
  function process(m) {
    location.search.substring(1).split("&").some(function(v) {
      if (v.indexOf("q=") === 0) {
        if (a = decodeURIComponent(v.substr(2).trim().replace(/\+/g, " ")).match(/(?:^|\s)site:([^\s]+)/)) {
          a = a[1];
        } else a = "";
        return true;
      }
    });
    document.querySelectorAll(
      '#ires :is(.g,.MjjYud),#search :is(.g,.MjjYud),#rso>.hlcw0c>:is(.g,.MjjYud),#rso>div:not([class])>.nChh6e,#rso>div:not(:has(>[class])),#kp-wp-tab-overview>div[data-ved]'
    ).forEach(function(entry, menu, point, e, p) {
      if (
        !(point = entry.querySelector('.r>a,.yuRUbf>a:last-of-type,.yuRUbf>div>a:last-of-type,.dbsr>a,[jsaction]>a[jsname],div[id] div[jsslot] span>span')) ||
        entry.querySelector('a.fl.sr')
      ) return;
      if (menu = entry.querySelector(".action-menu-item")) { //v2: has menu
        if ((/:\/\/webcache/).test(menu.firstElementChild.href)) {
          e = menu.nextElementSibling;
        } else if ((/=related:http/).test(menu.firstElementChild.href)) {
          e = menu;
        } else e = null;
        menu = menu.parentNode.insertBefore(menu.cloneNode(true), e).firstElementChild;
        menu.classList.add("sr")
      } else if (menu = entry.querySelector(".f+span") || entry.querySelector(".f")) { //v1
        menu.insertAdjacentHTML("beforeend", ' - <a class="fl sr"></a> <a class="fl cp"></a>');
        menu = menu.lastElementChild.previousElementSibling;
      } else { //v2: no menu
        if (p = point.querySelector(".XTjFC")) { //news
          p.appendChild(menu = document.createElement("SPAN"));
        } else if (p = point.parentNode.querySelector(".eFM0qc")) { //video
          p.appendChild(menu = document.createElement("SPAN"));
        } else { //others
          if (m = entry.closest('#kp-wp-tab-overview')) point = entry.querySelector('a');
          point.parentNode.insertBefore(menu = document.createElement("SPAN"), point.nextSibling);
          if (point.closest('div[jsslot]')) {
            point = entry.querySelector('a');
            if (m) {
              menu.style.cssText = "display:inline-block;position:absolute;right:1em;bottom:1em"
            } else menu.style.cssText = "display:inline-block;margin-top:1.8em"
          }
        }
        menu.innerHTML = `${
  next ? '' : `<style>
  .V9tjod, .V9tjod .LC20lb, .V9tjod .ESMNde {
    transform: none;
  }
  .cvP2Ce {
    overflow: revert!important;
    contain: revert!important;
  }
  .action-menu {
    display: inline;
    margin: 0 3px;
    position: relative;
    user-select: none;
    margin-top: 1px;
    vertical-align: middle;
  }
  .GHDvEf, .GHDvEf:hover, .GHDvEf.selected, .GHDvEf.selected:hover {
    display: inline-block;
    background-color: #fff;
    height: 12px;
    margin-top: 1px;
    user-select: none;
    width: 13px;
  }
  .mn-dwn-arw {
    border-color: #70757a transparent;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    width: 0;
    height: 0;
    margin-left: -2px;
    top: 50%;
    margin-top: -2px;
    position: absolute;
  }
  .action-menu .mn-dwn-arw {
    border-color: #202124 transparent;
    margin-top: -3px;
    margin-left: 3px;
    left: 0;
    border-color: #70757a transparent;
  }
  .action-menu-panel {
    padding: 6px 0;
    position: absolute;
    left: 0;
    padding: 0;
    top: 12px;
    visibility: hidden;
    background: #fff;
    border: 1px solid #dadce0;
    border: 1px solid rgba(0,0,0,.20);
    font-size: 13px;
    white-space: nowrap;
    z-index: 3;
    transition: opacity 0.218s;
    box-shadow: 0 2px 4px rgba(0,0,0,.20);
  }
  div#gsr .action-menu-panel {
    left: auto;
    right: 0;
  }
  .action-menu-item {
    cursor: pointer;
    user-select: none;
  }
  .action-menu-item {
    margin: 0;
    padding: 0;
    -moz-user-select: none;
  }
  .action-menu-item:hover {
    background-color: #f8f9fa;
  }
  #rcnt .action-menu-item a.fl, .action-menu-item a.fl {
    color: #3c4043;
    display: block;
    padding: 7px 18px;
    text-decoration: none;
    outline: 0;
  }
  .XTjFC,.cvP2Ce{contain:revert;overflow:revert}
  </style>`
  }<div class="action-menu ac_ctl">
    <a class="GHDvEf ab_button" href="#" aria-label="Result Options" aria-expanded="false" aria-haspopup="true" role="button" jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe"><span class="mn-dwn-arw"></span></a>
    <div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1" jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue" style="visibility:hidden">
      <ol>
        <li class="action-menu-item ab_dropdownitem" role="menuitem"><a class="fl sr"></a></li>
        <li class="action-menu-item ab_dropdownitem" role="menuitem"><a class="fl cp"></a></li>
      </ol>
    </div>
  </div>`;
        menu.querySelector("a").onclick = dropdownClick;
        menu = menu.querySelector(".sr");
      }
      menu.textContent = "Site Results";
      if (point.pathname === "/url") {
        point = unescape(point.search.match(/&url=([^&]+)/)[1]).match(/:\/\/([^:/]+)/)[1];
      } else point = point.hostname;
      menu.href = location.href.replace(/&start=\d+/, "").replace(/([&?]q=)([^&]+)/, "$1site:" + encodeURIComponent(point) + "+$2");
      menu.onmousedown = null;
      menu.addEventListener("click", ev => { ev.stopImmediatePropagation(); ev.stopPropagation() }, true);
      if (a) menu.style.display = "none";
      if ((menu = menu.nextElementSibling || menu.parentNode.nextElementSibling?.firstElementChild) && menu.classList.contains("cp")) {
        menu.textContent = "Cached Page";
        if (point = menu.closest('[jscontroller]')?.querySelector('a[jsname]')?.href || entry.querySelector('a')?.href) {
          menu.href = location.href.replace(/&start=\d+/, "").replace(/([&?]q=)([^&]+)/, "$1cache:" + encodeURIComponent(point));
          menu.onmousedown = null;
          menu.addEventListener("click", ev => { ev.stopImmediatePropagation(); ev.stopPropagation() }, true);
        } else menu.style.display = "none"
      }
    })
  }
  (new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(process, 100)
  })).observe(document.body, {childList: true, subtree: true});
  process()
})();
