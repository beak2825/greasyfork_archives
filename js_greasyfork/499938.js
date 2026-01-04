// ==UserScript==
// @name                Search Switcher - SearXNG
// @description         Add links to each other in search engines. Including multiple search modes.
// @license             GPL-3.0
// @include             https://jrem.org/*
// @include             *.bing.com/*
// @include             *.duckduckgo.com/*
// @include             *duckduckgo.com/*
// @include             /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @grant               none
// @run-at              document_body
// @version             1
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @downloadURL https://update.greasyfork.org/scripts/499938/Search%20Switcher%20-%20SearXNG.user.js
// @updateURL https://update.greasyfork.org/scripts/499938/Search%20Switcher%20-%20SearXNG.meta.js
// ==/UserScript==

{
  const sites = [
    {
      name: "SearXNG jrem.org",
      host: "jrem.org",
      link: "https://jrem.org/search",
      key: "q",
      hide: false,
    },
    {
      name: "Bing",
      host: "bing.com",
      link: "https://bing.com/search",
      key: "q",
      hide: false,
    },
    {
      name: "Google",
      host: "google.com",
      link: "https://www.google.com/search",
      key: "q",
      hide: false,
    },
    {
      name: "DuckDuckGo",
      host: "duckduckgo.com",
      link: "https://duckduckgo.com/",
      key: "q",
      hide: false,
    },
  ];

  const css = `
      .search-warpper {
        position: fixed;
        left: 0;
        top: 0;
      }

      .search-switcher {
        position: fixed;
        opacity: 0.2;
        top: 80px;
        right: calc(100% - 10px);
        z-index: 9999999;
        transition: all 400ms;
      }

      .search-switcher:hover {
        top: 80px;
        left: 0px;
        right:auto;
        opacity: 1;
        border-radius: 0 20px;
      }

      .search-switcher .search-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing:border-box;
        background-color: #000;
        border-radius: 0px 10px 10px 0px;
        color: #fff;
        padding: 10px;
        box-shadow: 5px 5px 5px #777;
      }

      .search-switcher .search-list a {
        color: #0cf;
        height: 25px;
        line-height: 25px;
      }

      .search-switcher .search-list a.mirror {
        font-weight: bold;
      }
      `;

  function setup() {
    console.log("location:", location.href);
    let curSite;
    let isMirror;
    for (let site of sites) {
      if (location.host.includes(site.host)) {
        curSite = site;
      }
    }
    let siteList = sites.filter(
      ({ host, hide }) => !location.hostname.includes(host) && !hide
    );
    console.log("siteList:", siteList);
    let query = new URLSearchParams(location.search).get(curSite.key || "q");
    console.log("site:", curSite, ",query:", query);
    if (query == null) {
      return;
    }
    let body = document.body;
    if (body == undefined) {
      return;
    }
    let switcherParentId = "search-switcher-parent";
    let switcherParent = document.getElementById(switcherParentId);
    if (switcherParent == undefined) {
      // 样式
      const style = document.createElement("style");
      style.innerHTML = css;
      body.appendChild(style);
      // 生成切换框
      switcherParent = document.createElement("div");
      switcherParent.setAttribute("id", switcherParentId);
      console.log("body.appendChild:", switcherParent);
      body.appendChild(switcherParent);
    }
    const siteTag = ({ link, name, host, mirror, key }) => {
      let className = "";
      let text = name;
      let href = `${link}?${key}=${query}`;
      console.log("href:", href);
      return `<a href='${href}' target='_blank' >${text}</a>`;
    };
    const tags = siteList
      .filter(({ hidden }) => !hidden)
      .map(siteTag)
      .join("");

    switcherParent.innerHTML = `
            <div id='search-switcher' class='search-switcher'>
                <div id='search-list' class="search-list">${tags}</div>
            </div>
        `;
    console.log("switcherParent:", switcherParent);
  }

  let _href = "";
  !(function init() {
    var current_href = location.href;
    if (_href != current_href) {
      setup();
      _href = current_href;
    }
    setTimeout(init, 2000);
  })();
}
// end userScript
