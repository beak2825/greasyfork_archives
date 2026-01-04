// ==UserScript==
// @name         Rustdoc Redesign
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  Applies a modern look to rust documentation.
// @author       exa04
// @match        *://*/*
// @icon         https://rustacean.net/assets/rustacean-orig-noshadow.png
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520324/Rustdoc%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/520324/Rustdoc%20Redesign.meta.js
// ==/UserScript==

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

:root {
  --gray-950: #09090b;
  --gray-900: #18181b;
  --gray-800: #27272a;
  --gray-700: #3f3f46;
  --gray-600: #52525b;
  --gray-500: #71717a;
  --gray-400: #a1a1aa;
  --gray-300: #d4d4d8;
  --gray-200: #e4e4e7;
  --gray-100: #f4f4f5;
  --gray-50:  #fafafa;

  --accent-darkened: #451a03;
  --accent-lightened: #fde68a;
}
:root[data-theme="dark"] {
  --accent: #f59e0b;

  --body-background-color: var(--gray-950);
  --sidebar-background-color: var(--gray-950);
  --main-background-color: var(--gray-900);
  --code-block-background-color: var(--gray-800);
  --link-color: var(--accent);
  --sidebar-link-color: var(--gray-400);
  --accent-bg: var(--accent-darkened);
  --text-color: var(--gray-200);
  --main-color: var(--gray-200);
  --text-faded: var(--gray-400);
  --text-muted: var(--gray-500);
  --border: var(--gray-700);
  --search-shadow: 0 24px 64px 0 black;
  --search-btn-background-color: var(--gray-800);

  --code-highlight-comment-color: var(--gray-500);
}
:root[data-theme="light"] {
  --accent: #b45309;

  --body-background-color: var(--gray-200);
  --sidebar-background-color: var(--gray-100);
  --main-background-color: var(--gray-50);
  --code-block-background-color: var(--gray-100);
  --link-color: var(--accent);
  --sidebar-link-color: var(--gray-600);
  --accent-bg: var(--accent-lightened);
  --text-color: var(--gray-900);
  --main-color: var(--gray-900);
  --text-faded: var(--gray-600);
  --text-muted: var(--gray-500);
  --border: var(--gray-300);
  --search-shadow: 0 24px 64px 0 rgba(0,0,0,0.2);
  --search-btn-background-color: var(--gray-300);

  --code-highlight-comment-color: var(--gray-500);
}
.rustdoc, .rustdoc-page {
  max-width: 1440px;
  margin: auto;
}
main {
  background-color: var(--main-background-color);
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 1rem;
}
body {
  background-color: var(--body-background-color);
}
.width-limiter {
  margin: auto;
  max-width: 780px;
}
.rustdoc, .rustdoc-page, #crate-search, h1, h2, h3, h4, h5, h6, .sidebar, .mobile-topbar, .search-input, .search-results, .result-name, .item-name > a, .out-of-band, .sub-heading, span.since, a.src, rustdoc-toolbar, summary.hideme, .scraped-example-list, .rustdoc-breadcrumbs, ul.all-items {
  font-family: "Inter", "Helvetica", Arial, sans-serif;
}

.toc {
  width: 192px;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 0.875rem;
  height: 100vh;
  position: sticky;
  top: 0;
  padding-top: 1rem;
  padding-right: 0.5rem;
  overflow-y: auto;
  background-color: var(--sidebar-background-color);
}
.toc .heading {
  padding-left: var(--sidebar-elems-left-padding);
  margin-bottom: 0.5rem;
}
.toc h3 {
  padding: 0;
  margin: 0;
}
.toc h3 a{
  color: var(--text-color);
}
.toc .block {
  padding-left: 0.5rem;
}
.toc a {
  color: var(--text-faded);
}
.sidebar .rustdoc-breadcrumbs {
  font-size: 1rem;
  font-weight: bold;
  padding-left: var(--sidebar-elems-left-padding);
  color: var(--text-faded);
  margin-bottom: 1rem;
}
.sidebar > .version {
  color: var(--text-faded);
  font-ssize: 0.875rem;
  margin: 1rem 0;
}
.sidebar .search {
  background-color: var(--search-btn-background-color);
  color: var(--text-faded);
  width: calc(100% - 2.5rem);
  border: 0 none black;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: sticky;
  top: 8px;
  box-shadow: var(--search-shadow);
}
.sidebar .search .key {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid var(--text-muted);
}
.sidebar .rustdoc-breadcrumbs a:last-child {
  color: var(--text-color);
}
.sidebar .rustdoc-breadcrumbs a:hover {
  background-color: transparent !important;
  text-decoration: underline;
}
.sidebar-elems h3 {
  font-size: 0.875rem;
}
.sidebar-elems a, .sidebar > h2 a {
  padding: 0.125rem 0;
  margin-left: 0;
}
.sidebar-elems {
  padding-left: 0;
}
.sidebar-elems .block {
  margin-bottom: 1.5rem;
}
.sidebar .block a {
  padding-left: 1rem;
}
.sidebar .current,
.sidebar .current a,
.sidebar-crate a.logo-container:hover + h2 a,
.sidebar a:hover:not(.logo-container) {
  color: var(--text-color);
  background: var(--accent-bg);
}
.sidebar-elems h2 {
  display: none;
}
.sidebar-crate {
  border-bottom: 2px solid var(--border);
  margin: 1rem;
  margin-left: var(--sidebar-elems-left-padding);
  padding-bottom: 1rem;
}
.sidebar-crate h2 {
  margin: 0;
}
.sidebar-crate h2 .version {
  color: var(--text-faded);
  font-size: 0.875rem;
}
.sidebar-crate h2 a {
  font-size: 1.25rem;
}
.section-header:not(.structfield) {
  font-size: 1.5rem;
  font-weight: bold;
  border-top: 2px solid var(--border);
  margin-top: 2rem;
  border-top: 2px solid var(--border);
  padding-top: 2.5rem;
}
.item-decl {
  margin-bottom: 2.5rem;
}

.rustdoc-breadcrumbs {
  display: flex;
  gap: 0.25rem;
  color: var(--text-muted);
}
.rustdoc-breadcrumbs wbr {
  display: none;
}
.rustdoc-breadcrumbs a {
  color: var(--text-muted);
}
.main-heading {
  padding-bottom: 0;
  margin: 0;
}
.main-heading h1 {
  font-size: 1.125rem;
  margin-top: 1rem;
  color: var(--text-faded);
}
.main-heading h1 > span {
  font-size: 2rem;
  display: block;
  font-weight: bold;
}
.docblock>*:first-child {
  margin-top: 0 !important;
}
.content h2, .top-doc .docblock > h3, .top-doc .docblock > h4 {
  border-bottom: none;
}
.top-doc .docblock h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 2rem;
  padding: 0;
}
.top-doc .docblock h3 {
  line-height: 1.25rem;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  padding-bottom: 0;
  font-weight: bold;
}
.example-wrap {
  margin: 1rem 0;
}
main p {
  margin: 0.75rem 0;
}
.docblock code, .docblock-short code {
  background: none;
}
main .top-doc {
  margin-left: -24px;
}
.code-header {
  color: var(--text-muted);
}
.code-header > *:not(.fn) {
  color: var(--text-faded);
}
.code-header .fn {
  color: var(--accent);
}
.impl > .code-header .trait {
  color: var(--trait-link-color);
}
main p.leading {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}
.impl-items {
  padding-left: 2rem;
}
#trait-implementations-list .impl-items > .toggle:not(:last-child), #synthetic-implementations-list .impl-items > .toggle:not(:last-child), #blanket-implementations-list .impl-items > .toggle:not(:last-child){
  margin: 1.5rem 0;
}
#main-content.hidden {
  display: block !important;
}

#alternative-display rustdoc-toolbar {
  display: none;
}
#alternative-display {
  position: fixed;
  z-index: 100;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  max-width: 800px;
  background: var(--sidebar-background-color);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0 1rem;
  box-shadow: var(--search-shadow);
}
#alternative-display #search {
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 720px;
  max-height: 70vh;
}
#alternative-display #search #results {
  flex-shrink: 1;
  height: 0;
  flex-grow: 1;
  overflow-y: scroll;
}
#search #search-tabs {
  margin-bottom: 0;
}
#search .search-results-title {
  margin-top: 0;
}

.width-limiter:has(#alternative-display.hidden) rustdoc-search,
.width-limiter:not(:has(#alternative-display)) rustdoc-search {
}

.width-limiter:has(#alternative-display:not(.hidden)) rustdoc-search,
rustdoc-search:has(:focus) {
  pointer-events: auto !important;
  opacity: 1.0 !important;
}

rustdoc-search {
  position: fixed;
  z-index: 100;
  top: calc(20vh - 3.5rem);
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  max-width: 800px;
  pointer-events: none;
  opacity: 0;
}
rustdoc-search .search-input {
  background: var(--main-background-color);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 1.25rem;
  padding: 0 1rem;
  height: 3rem;
}
nav.sub {
  margin-top: 0;
}

/* TODO */

.code-header .where {
  display: none;
}
#copy-path {
  display: none;
}
.sidebar-resizer {
  display: none;
}
`;

(function() {
    'use strict';

    if(!document.body.classList.contains('rustdoc')
      && !document.body.classList.contains('rustdoc-page')) {
        return;
    }

    GM_addStyle(STYLE);

    const mainContent = document.querySelector("#main-content");
    const title = document.querySelector("#main-content > .main-heading");
    const docblock = document.querySelector(".docblock");

    if(title && docblock) {
        let leading = docblock.firstChild;

        if(leading) {
            if(leading.nodeName == "#text") {
                const leading_text = leading;
                leading = document.createElement("p");
                leading.append(leading_text);
            }

            leading.classList.add("leading");
            mainContent.insertBefore(leading, title.nextSibling);

            if(docblock.children.length == 0) {
                document.querySelector(".top-doc").remove();
            }
        }
    }

    const breadcrumbs = document.querySelector(".rustdoc-breadcrumbs");

    if(breadcrumbs) {
        const path = breadcrumbs.cloneNode(true);

        Array.from(path.childNodes)
            .filter(node => node.nodeName == "WBR")
            .forEach(node => path.removeChild(node));

        const sidebar = document.querySelector(".sidebar");
        const sidebarElems = document.querySelector(".sidebar > .sidebar-elems");
        sidebar.insertBefore(path, sidebarElems);
    }

    const toc_content = document.querySelector("#rustdoc-toc");

    if(toc_content) {
        const rustdoc = document.querySelector(".rustdoc");
        let toc = document.createElement("aside");
        toc.append(toc_content);

        rustdoc.append(toc);
        toc.classList.add("toc");
        toc_content.classList.add("sidebar-elems");
    }

    const sidebarCrate = document.querySelector(".sidebar");
    const h2 = document.querySelector(".sidebar-crate");

    if(sidebarCrate && h2) {
        const search = document.createElement("button");
        search.classList.add("search");

        search.onclick = () => document.querySelector("rustdoc-search .search-input").focus();

        const key = document.createElement("span");
        key.classList.add("key");
        key.append(document.createTextNode("/"));

        search.append(key);
        search.append(document.createTextNode("Search"));
        sidebarCrate.insertBefore(search, h2.nextSibling);
    }
})();