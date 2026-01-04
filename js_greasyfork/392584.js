// ==UserScript==
// @name GithubGoTop
// @name:CN-zh_cn Github一键返回顶部
// @version 0.5
// @description scroll top
// @author gaojr
// @namespace https://github.com/gaojr/scripts-styles
// @license MIT
// @match https://*github.com/*
// @grant none
// @connect github.com
// @icon https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/392584/GithubGoTop.user.js
// @updateURL https://update.greasyfork.org/scripts/392584/GithubGoTop.meta.js
// ==/UserScript==

(function () {
  var body = document.querySelector('body');
  var goTop = document.createElement('div');
  var imgBox = document.createElement('img');
  goTop.style.position = 'fixed';
  goTop.style.right = '0%';
  goTop.style.bottom = '0%';
  goTop.style.cursor = 'pointer';
  imgBox.src =
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB5PSIwIiB4PSIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0id2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kLXNpemU6aW5pdGlhbDtiYWNrZ3JvdW5kLXJlcGVhdC15OmluaXRpYWw7YmFja2dyb3VuZC1yZXBlYXQteDppbml0aWFsO2JhY2tncm91bmQtcG9zaXRpb24teTppbml0aWFsO2JhY2tncm91bmQtcG9zaXRpb24teDppbml0aWFsO2JhY2tncm91bmQtb3JpZ2luOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjppbml0aWFsO2JhY2tncm91bmQtY2xpcDppbml0aWFsO2JhY2tncm91bmQtYXR0YWNobWVudDppbml0aWFsO2FuaW1hdGlvbi1wbGF5LXN0YXRlOnBhdXNlZCIgPjxnIGNsYXNzPSJsZGwtc2NhbGUiIHN0eWxlPSJ0cmFuc2Zvcm0tb3JpZ2luOjUwJSA1MCU7dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKSBzY2FsZSgxLCAxKTthbmltYXRpb24tcGxheS1zdGF0ZTpwYXVzZWQiID48cGF0aCBkPSJNMjQuODA0IDQ4LjUzbDUuMDM5IDUuMDQgMTYuNTk0LTE2LjU5NHYzOS42OTFoNy4xMjZWMzYuOTc2TDcwLjE1NyA1My41N2w1LjAzOS01LjA0TDUwIDIzLjMzNHoiIGZpbGw9IiNjY2NjY2IiIHN0eWxlPSJmaWxsOnJnYigyMjEsIDIyMSwgMjIxKTthbmltYXRpb24tcGxheS1zdGF0ZTpwYXVzZWQiID48L3BhdGg+CjxwYXRoIGZpbGw9IiMzMjMyMzIiIGQ9Ik01MCAxMC4wMDFjLTIyLjA5MSAwLTQwIDE3LjkwOS00MCA0MHMxNy45MDkgNDAgNDAgNDAgNDAtMTcuOTA5IDQwLTQwYzAtMjIuMDkyLTE3LjkwOS00MC00MC00MHpNNzAuMTU3IDUzLjU3TDUzLjU2MyAzNi45NzZ2MzkuNjkxaC03LjEyN1YzNi45NzZMMjkuODQzIDUzLjU3bC01LjAzOS01LjAzOUw1MCAyMy4zMzQgNzUuMTk2IDQ4LjUzbC01LjAzOSA1LjA0eiIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOnBhdXNlZCIgPjwvcGF0aD4KPG1ldGFkYXRhIHhtbG5zOmQ9Imh0dHBzOi8vbG9hZGluZy5pby9zdG9jay8iIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTpwYXVzZWQiID48ZDpuYW1lIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTpwYXVzZWQiID51cDwvZDpuYW1lPgoKCjxkOnRhZ3Mgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOnBhdXNlZCIgPm5vcnRoLHVwbG9hZCx0b3AsZGlyZWN0aW9uLHdheSxjaXJjbGUsdXAsYXJyb3c8L2Q6dGFncz4KCgo8ZDpsaWNlbnNlIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTpwYXVzZWQiID5ieTwvZDpsaWNlbnNlPgoKCjxkOnNsdWcgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOnBhdXNlZCIgPmhhOWxqejwvZDpzbHVnPjwvbWV0YWRhdGE+PC9nPjwhLS0gZ2VuZXJhdGVkIGJ5IGh0dHBzOi8vbG9hZGluZy5pby8gLS0+PC9zdmc+';
  imgBox.style.height = '48px';
  imgBox.style.width = '48px';
  goTop.appendChild(imgBox);
  body.appendChild(goTop);
  goTop.onclick = function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };
  // theme mode
  var html = document.querySelector('html');
  html.onchange = function () {
    var github_mode = html.getAttribute('data-color-mode');
    var system_dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    imgBox.style.filter = "light" === github_mode ? "" : "dark" === github_mode || system_dark ? "invert(100%)" : "";
  };
  window.matchMedia && (window.matchMedia('(prefers-color-scheme: dark)').onchange = html.onchange);
  html.onchange();
})();
