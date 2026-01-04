// ==UserScript==
// @name       LinuxDo VScode style
// @namespace  http://tampermonkey.net/
// @version    0.2.2
// @description  Make LinuxDo Looklike VScode
// @author     Yearly
// @match      https://linux.do/*
// @icon   data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTExLjcgMTguNy02LjkgNS4yLTIuOC0xTDkgMTYgMiA5LjFsMi44LS45IDYuOSA1LjJMMjMuMSAyLjEgMzAgNC45djIyLjJMMjMuMiAzMFptMy42LTIuNyA3LjkgNS45VjEwLjFaIiBzdHlsZT0iZmlsbDojMDA3YWNjIi8+PC9zdmc+
// @license    MIT
// @run-at   document-start
// @grant    GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/504728/LinuxDo%20VScode%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/504728/LinuxDo%20VScode%20style.meta.js
// ==/UserScript==

(function() {

  // thin header
  GM_addStyle(`
     header.d-header  {
        height: 2.6em !important;
     }
     header.d-header .extra-info-wrapper .title-wrapper {
        display: flex;
        flex-direction: row;
     }
     header.d-header div.title-wrapper > h1.header-title {
        width: auto;
        font-size: large;
     }
     header.d-header #site-logo {
        height: 2em !important;
     }
     header.d-header .d-header-icons .icon img.avatar,
     header.d-header a > svg,
     header.d-header button > svg,
     header.d-header a > div.chat-channel-unread-indicator {
        transform: scale(0.85, 0.85);
     }
`);

  // code font
  GM_addStyle(`
body {
  font-family: 'Consolas', 'Courier New', monospace;
}

.d-header {
  background-color: #222 !important;
}


.topic-list .topic-list-item {
  border-bottom: 1px solid #3c3c3c !important;
}

.topic-list .topic-list-item:hover {
  background-color: #2a2d2e !important;
}

#d-sidebar > div.sidebar-footer-wrapper > div.sidebar-footer-container{
  padding: 0em 0.5em;
  background: #0374c7;
}

#d-sidebar > div.sidebar-footer-wrapper > div.sidebar-footer-container button.btn svg{
  --primary: #eee;
  color: #eee;
}

#reply-control {
  background-color: #252526 !important;
}

.d-editor-textarea-wrapper {
  background-color: #1e1e1e !important;
}

.d-editor-preview-wrapper {
  background-color: #252526 !important;
  border-left: 1px solid #3c3c3c !important;
}

.sidebar-wrapper > #d-sidebar > div.sidebar-footer-wrapper .sidebar-footer-container:before {
  border-bottom: solid 1px #8888;
  background:none;
}

#main-outlet-wrapper > div.sidebar-wrapper > #d-sidebar{
  border-right: 1px solid #8888;
}
`);

  /*
  GM_addStyle(`
html,
body,
#main,
#ember3,
#main-outlet-wrapper{
  max-height:100%;
  height:100%;
}
#main-outlet{
  height:calc(100% - 2em);

     overflow-x: visible;
    overflow-y: auto;
}
`);
*/

  GM_addStyle(`
html,
body {
  font-family: 'Consolas', 'Courier New', 'Lucida Console', 'Monaco', 'Source Code Pro', 'Fira Code', 'Ubuntu Mono', 'Menlo', 'DejaVu Sans Mono', monospace !important;
  --d-font-family--monospace: 'Consolas', 'Courier New', 'Lucida Console', 'Monaco', 'Source Code Pro', 'Fira Code', 'Ubuntu Mono', 'Menlo', 'DejaVu Sans Mono', monospace !important;
  --heading-font-family: 'Consolas', 'Courier New', 'Lucida Console', 'Monaco', 'Source Code Pro', 'Fira Code', 'Ubuntu Mono', 'Menlo', 'DejaVu Sans Mono', monospace !important;
  --font-family: 'Consolas', 'Courier New', 'Lucida Console', 'Monaco', 'Source Code Pro', 'Fira Code', 'Ubuntu Mono', 'Menlo', 'DejaVu Sans Mono', monospace !important;
}

:root {
  --secondary: #000 !important;
  --tertiary: #99d6ff !important;
  --tertiary-med-or-tertiary: #0e639c !important;
  --tertiary-low-or-tertiary-high: #0e639c !important;
  --tertiary-low: #0e639c !important;
  --love: #0e639c !important;
  --success: #0e639c !important;
  --quaternary: #0e639c !important;
  --tertiary-hover: #0e639c !important;
  --primary-low: #333 !important;
  --primary: #eee !important;
  --d-max-width: 100% !important;
}

#main-outlet-wrapper {
  font-size: 14px;
}

#main-outlet {
  --primary-low: #000;
}

table.topic-list .topic-excerpt {
  color: #bb7;
}

table.topic-list a.title.raw-link.raw-topic-link {
  color: #39f;
}

table.topic-list tr.topic-list-item {
  border-bottom: none !important;
}

.topic-list td.topic-list-data.posters {
  height: auto;
  padding: 0.33em;
  width: 110px;
  opacity: 0.2;
}

.topic-list td.topic-list-data.posters:hover {
  opacity: 1;
}

body > #d-splash > img.preloader-image {
    filter: invert(75%);
}

ul>li {
  margin-left: 2em;
}

#main-outlet-wrapper {
  max-width: 100% !important;
}

body.has-sidebar-page header.d-header>div.wrap {
  max-width: 100% !important;
}

.topic-body {
  width: 100% !important;
}

article .topic-map.--op {
  max-width: 100%;
}

@media screen and (min-width: 925px) {
  #main-outlet .container.posts {
    grid-template-columns: auto 120px;
  }
}
`);

  var settings = {
    icon_vscode_main: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0yOS4wMSA1LjAzLTUuNzY2LTIuNzc2YTEuNzQgMS43NCAwIDAgMC0xLjk4OS4zMzhMMi4zOCAxOS44YTEuMTY2IDEuMTY2IDAgMCAwLS4wOCAxLjY0N3EuMDM3LjA0LjA3Ny4wNzdsMS41NDEgMS40YTEuMTY1IDEuMTY1IDAgMCAwIDEuNDg5LjA2NkwyOC4xNDIgNS43NUExLjE1OCAxLjE1OCAwIDAgMSAzMCA2LjY3MnYtLjA2N2ExLjc1IDEuNzUgMCAwIDAtLjk5LTEuNTc1IiBzdHlsZT0iZmlsbDojMDA2NWE5Ii8+PHBhdGggZD0ibTI5LjAxIDI2Ljk3LTUuNzY2IDIuNzc3YTEuNzQ1IDEuNzQ1IDAgMCAxLTEuOTg5LS4zMzhMMi4zOCAxMi4yYTEuMTY2IDEuMTY2IDAgMCAxLS4wOC0xLjY0N3EuMDM3LS4wNC4wNzctLjA3N2wxLjU0MS0xLjRBMS4xNjUgMS4xNjUgMCAwIDEgNS40MSA5LjAxbDIyLjczMiAxNy4yNEExLjE1OCAxLjE1OCAwIDAgMCAzMCAyNS4zMjh2LjA3MmExLjc1IDEuNzUgMCAwIDEtLjk5IDEuNTciIHN0eWxlPSJmaWxsOiMwMDdhY2MiLz48cGF0aCBkPSJNMjMuMjQ0IDI5Ljc0N2ExLjc0NSAxLjc0NSAwIDAgMS0xLjk4OS0uMzM4QTEuMDI1IDEuMDI1IDAgMCAwIDIzIDI4LjY4NFYzLjMxNmExLjAyNCAxLjAyNCAwIDAgMC0xLjc0OS0uNzI0IDEuNzQgMS43NCAwIDAgMSAxLjk4OS0uMzM5bDUuNzY1IDIuNzcyQTEuNzUgMS43NSAwIDAgMSAzMCA2LjZ2MTguOGExLjc1IDEuNzUgMCAwIDEtLjk5MSAxLjU3NloiIHN0eWxlPSJmaWxsOiMxZjljZjAiLz48L3N2Zz4=',

    icon_vscode_wide: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTEiIGhlaWdodD0iMzciIHZpZXdCb3g9IjEgLTEgMTAwIDMyIj48dGV4dCB4PSIzNiIgeT0iMjIuNSIgZm9udC1zaXplPSIxNSIgZmlsbD0iI0FBQSIgZm9udC13ZWlnaHQ9IjU1NSI+VlMgQ29kZTwvdGV4dD48cGF0aCBkPSJtMjkgNS01LjgtMi44YTEuNyAxLjcgMCAwIDAtMiAuM0wyLjQgMTkuOGExLjIgMS4yIDAgMCAwLS4xIDEuNmwuMS4xIDEuNSAxLjRhMS4yIDEuMiAwIDAgMCAxLjUuMUwyOC4xIDUuOGExLjIgMS4yIDAgMCAxIDEuOS45di0uMUExLjggMS44IDAgMCAwIDI5IDUiIHN0eWxlPSJmaWxsOiMwNmEiLz48cGF0aCBkPSJtMjkgMjctNS44IDIuOGExLjcgMS43IDAgMCAxLTItLjNMMi40IDEyLjJhMS4yIDEuMiAwIDAgMS0uMS0xLjZsLjEtLjEgMS41LTEuNEExLjIgMS4yIDAgMCAxIDUuNCA5bDIyLjcgMTcuMmExLjIgMS4yIDAgMCAwIDEuOS0uOXYuMWExLjggMS44IDAgMCAxLTEgMS42IiBzdHlsZT0iZmlsbDojMDdjIi8+PHBhdGggZD0iTTIzLjIgMjkuN2ExLjcgMS43IDAgMCAxLTItLjMgMSAxIDAgMCAwIDEuOC0uN1YzLjNhMSAxIDAgMCAwLTEuNy0uNyAxLjcgMS43IDAgMCAxIDItLjNsNS44IDIuOGExLjggMS44IDAgMCAxIC45IDEuNXYxOC44YTEuOCAxLjggMCAwIDEtMSAxLjZaIiBzdHlsZT0iZmlsbDojMTlmIi8+PC9zdmc+',

    icon_excel:' data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iNC40OTQiIHkxPSItMjA5Mi4wODYiIHgyPSIxMy44MzIiIHkyPSItMjA3NS45MTQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyMTAwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzE4NCIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiMxNzQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwNjMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTkuNiAxNS4zIDguNSAxMy40djE0LjRBMS4yIDEuMiAwIDAgMCA5LjcgMjloMTkuMWExLjIgMS4yIDAgMCAwIDEuMi0xLjJ2LTUuM1oiIHN0eWxlPSJmaWxsOiMxNTMiLz48cGF0aCBkPSJNMTkuNiAzSDkuN2ExLjIgMS4yIDAgMCAwLTEuMiAxLjJ2NS4zTDE5LjYgMTZsNiAxLjlMMzAgMTZWOS41WiIgc3R5bGU9ImZpbGw6IzJhNiIvPjxwYXRoIGQ9Ik04LjUgOS41aDExVjE2aC0xMVoiIHN0eWxlPSJmaWxsOiMxNzQiLz48cGF0aCBkPSJNMTYuNCA4LjJIOC41djE2LjNoOGExLjIgMS4yIDAgMCAwIDEuMi0xLjJWOS40YTEuMiAxLjIgMCAwIDAtMS4zLTEuMiIgc3R5bGU9Im9wYWNpdHk6LjEwMDAwMDAwMTQ5MDExNjEyO2lzb2xhdGlvbjppc29sYXRlIi8+PHBhdGggZD0iTTE1LjggOC44SDguNXYxNi4zaDcuM2ExLjIgMS4yIDAgMCAwIDEuMi0xLjJWMTBhMS4yIDEuMiAwIDAgMC0xLjItMS4yIiBzdHlsZT0ib3BhY2l0eTouMjAwMDAwMDAyOTgwMjMyMjQ7aXNvbGF0aW9uOmlzb2xhdGUiLz48cGF0aCBkPSJNMTUuOCA4LjhIOC41djE1aDcuM2ExLjIgMS4yIDAgMCAwIDEuMi0xLjJWMTBhMS4yIDEuMiAwIDAgMC0xLjItMS4yIiBzdHlsZT0ib3BhY2l0eTouMjAwMDAwMDAyOTgwMjMyMjQ7aXNvbGF0aW9uOmlzb2xhdGUiLz48cGF0aCBkPSJNMTUgOC44SDguNHYxNUgxNWExLjIgMS4yIDAgMCAwIDEuMi0xLjJWMTBBMS4yIDEuMiAwIDAgMCAxNSA4LjgiIHN0eWxlPSJvcGFjaXR5Oi4yMDAwMDAwMDI5ODAyMzIyNDtpc29sYXRpb246aXNvbGF0ZSIvPjxwYXRoIGQ9Ik0zLjIgOC44aDEyYTEuMiAxLjIgMCAwIDEgMS4yIDEuMnYxMmExLjIgMS4yIDAgMCAxLTEuMiAxLjJoLTEyQTEuMiAxLjIgMCAwIDEgMiAyMlYxMGExLjIgMS4yIDAgMCAxIDEuMi0xLjIiIHN0eWxlPSJmaWxsOnVybCgjYSkiLz48cGF0aCBkPSJNNS43IDE5LjkgOC4yIDE2bC0yLjMtMy45aDEuOEw5IDE0LjZjLjEuMi4yLjQuMi41cS4xLS4zLjMtLjVsMS4zLTIuNGgxLjdMMTAuMSAxNmwyLjQgMy45aC0xLjhsLTEuNC0yLjdhMi40IDIuNCAwIDAgMS0uMS0uNCAxLjcgMS43IDAgMCAxLS4yLjRsLTEuNSAyLjdaIiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggZD0iTTI4LjggM2gtOS4ydjYuNUgzMFY0LjJBMS4yIDEuMiAwIDAgMCAyOC44IDMiIHN0eWxlPSJmaWxsOiMzYzgiLz48cGF0aCBkPSJNMTkuNiAxNkgzMHY2LjVIMTkuNloiIHN0eWxlPSJmaWxsOiMxNzQiLz48L3N2Zz4='
  };

  GM_addStyle(`
  #site-logo {
  object-fit: scale-down;
  object-position: -999vw;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${settings.icon_vscode_main}');
  opacity: 1;
  transition: opacity 0.5s ease;
  }
  #site-logo.logo-big {
  background-image: url('${settings.icon_vscode_wide}');
  }
  #site-logo.logo-mobile {
  background-image: url('${settings.icon_vscode_wide}');
  }
  #site-logo:hover {
  object-position: unset;
  background-image: none;
  }
  `);

  function replaceIcon() {
    document.querySelector('link[rel="icon"]').href = settings.icon_vscode_main;
    if(!document.title.startsWith("VSCode")){
      document.title = "VSCode | " + document.title;
    }

  }
  const observer = new MutationObserver(replaceIcon);
  observer.observe(document.head, { childList: true, subtree: true });
  replaceIcon();

  document.title = "VSCode | " + document.title;


  function getUsername() {
    const currentUserElement = document.querySelector('#current-user button > img[src]');
    if(!currentUserElement) {
      return null;
    }
    const srcString = currentUserElement.getAttribute('src');
    if(!srcString) {
      return null;
    }
    const regex = /\/user_avatar\/linux\.do\/([^\/]+)\/\d+\//;
    const match = srcString.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  function createFooter() {
    const footer = document.createElement('div');
    footer.style=`
    position: sticky;
    bottom: -2px;
    right: 0px;
    background: #333;
    color: #eee;
    padding: 4px 1.4em 2.42px;
    overflow: hidden;
    font-size: 12.5px;
    z-index: 350;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.8em;
    line-height: 1;
    width: 100%;
    max-width: var(--d-max-width);
    border-top: solid 1px #8888;
    border-left: solid 2px #333;
    margin-top: 50%;
    margin-bottom: 0;
    margin-left: -2.4em;
    margin-right: 0;
    user-select: none;
    `

    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');

    footer.appendChild(leftDiv);
    footer.appendChild(rightDiv);

    rightDiv.style = "text-align: right; color: #ddd; fill: #ddd; display: flex; justify-content: space-around; align-items: center; flex-direction: row; flex-wrap: nowrap; gap:1em;";

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const encoding = document.characterSet;
    const lines = document.body.textContent.split('\n').length;
    const uname = getUsername();

    rightDiv.innerHTML = `
<span>Lines: ${lines}</span>
<span>${windowWidth} x ${windowHeight}</span>
<span>${encoding}</span>
<span>CRLF</span>
<span>HTML</span>
<style>
a.btn-with-svg[href] {
    color: #ddd;
    fill: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:0.3em;
}
a.btn-with-svg[href]:hover {
   background: #111;
   box-shadow: 0 0 0 3px #111;
   border-radius: 4px;
}
</style>
<a class="btn-with-svg" style="padding: 0 5px;" href="/u/${uname}/summary">
${uname}
</a>
<a class="btn-with-svg" href="/u/${uname}/notifications">
<svg width="1.2em" height="1.2em" fill='#ddd' viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M10 3.2a2 2 0 0 1 3.7 0A7 7 0 0 1 19 10v4.7l1.8 2.7A1 1 0 0 1 20 19h-4.5a3.5 3.5 0 0 1-7 0H4a1 1 0 0 1-.8-1.6L5 14.7V10c0-3.2 2.2-6 5-6.8m.6 15.8a1.5 1.5 0 0 0 2.8 0zM12 5a5 5 0 0 0-5 5v5a1 1 0 0 1-.2.6L6 17h12.1l-1-1.4a1 1 0 0 1-.1-.6v-5a5 5 0 0 0-5-5"/></svg>
</a>
`;

    leftDiv.style = "color: #ddd; fill: #ddd; display: flex; justify-content: space-around; align-items: center; flex-direction: row; flex-wrap: nowrap; gap:0.3em; ";

    leftDiv.innerHTML = `
<span></span><span></span>
<a class="btn-with-svg" href="/">
<svg width="1.2em" height="1.2em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><circle cx="188" cy="67.998" r="28" opacity=".2"/><path d="M224 67.998a36 36 0 1 0-44 35.092v.908a16.02 16.02 0 0 1-15.999 16L92 120a31.8 31.8 0 0 0-16 4.294V103.09a36 36 0 1 0-16 0v49.817a36 36 0 1 0 16 0V152a16.02 16.02 0 0 1 16-16l72.001-.002a32.036 32.036 0 0 0 31.999-32v-.908a36.055 36.055 0 0 0 28-35.092m-176 0a20 20 0 1 1 20 20 20.023 20.023 0 0 1-20-20M88 188a20 20 0 1 1-20-20 20.023 20.023 0 0 1 20 20M188 87.998a20 20 0 1 1 20-20 20.023 20.023 0 0 1-20 20"/></svg>
<span>main</span>
</a>
<span></span>
<a class="btn-with-svg" href="" onclick="location.reload();">
<svg width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.006 8.267.78 9.5 0 8.73l2.09-2.07.76.01 2.09 2.12-.76.76-1.167-1.18a5 5 0 0 0 9.4 1.983l.813.597a6 6 0 0 1-11.22-2.683m10.99-.466L11.76 6.55l-.76.76 2.09 2.11.76.01 2.09-2.07-.75-.76-1.194 1.18a6 6 0 0 0-11.11-2.92l.81.594a5 5 0 0 1 9.3 2.346z"/></svg>
</a>
<span></span><span></span>
<svg width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4s-3.2.1-4.6-.7-2.5-2-3.1-3.5S.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1m.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1S2.7 4.9 2.3 6.3c-.4 1.3-.4 2.7.2 4q.9 1.95 2.7 3c1.2.7 2.6.9 3.9.6M7.9 7.5 10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7z"/></svg>
<span>0</span>
<span></span><span></span>
<svg width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26zM8 2.28 2.28 13H13.7zM8.625 12v-1h-1.25v1zm-1.25-2V6h1.25v4z"/></svg>
<span>0</span>
<span></span><span></span>
`;

    return footer;
  }

  function updateFooter() {
    if(!document.querySelector("#main-outlet")) {
      setTimeout(updateFooter, 1000);
      return;
    }

    const footer = createFooter();

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const encoding = document.characterSet;

    const lines = document.body.textContent.split('\n').length;

    document.querySelector("#main-outlet").appendChild(footer);

    document.querySelector("#main-outlet-wrapper > div.sidebar-wrapper").style.zIndex=366;

    document.querySelector("#main-outlet-wrapper").style.overflowX = 'clip';

  }
  updateFooter();


})();
