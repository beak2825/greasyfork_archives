// ==UserScript==
// @name        xivpf auto search on load and autorefresh feature
// @namespace   Violentmonkey Scripts
// @match       https://xivpf.com/listings*
// @grant       none
// @license MIT
// @version     1.0
// @author      Ricardo Constantino
// @description 2/23/2024, 1:04:35 AM
// @downloadURL https://update.greasyfork.org/scripts/488172/xivpf%20auto%20search%20on%20load%20and%20autorefresh%20feature.user.js
// @updateURL https://update.greasyfork.org/scripts/488172/xivpf%20auto%20search%20on%20load%20and%20autorefresh%20feature.meta.js
// ==/UserScript==
(function() {
  const searchEle = document.querySelector('.search');
  searchEle.dispatchEvent(new KeyboardEvent('keyup', {ctrlKey: true, target: searchEle}));
  const clockElement = document.createElement('li');
  const refreshseconds = 30;
  const cookie = "autorefreshenabled";
  let refreshEnabled = localStorage.getItem(cookie) == "true";
  let refreshtimeoutid;

  let css = document.createElement('style');
  css.innerHTML = `
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}@keyframes fill{0%{opacity:0}50%,100%{opacity:1}}@keyframes mask{0%{opacity:1}50%,100%{opacity:0}}
.loader{background:#1095c1;border-radius:50%;font-size:1rem;height:1em;width:1em;display:none;overflow:hidden;position:relative}
.loader::before,.loader::after{background:#000;content:" ";display:block;height:1em;position:absolute;width:0.5em}
.loader::before{animation:spin ${refreshseconds}s linear normal;border-radius:999px 0 0 999px;transform-origin:0.5em 0.5em}
.loader::after{animation:fill ${refreshseconds}s steps(1, end) normal;border-radius:0 999px 999px 0;opacity:0;right:0;top:0}
.fill{background:#000;border-radius:50%;height:calc($load-border-size / $load-size) em;width:calc($load-border-size / $load-size) em;position:absolute;left:50%;top:50%;transform:translate3d(-50%, -50%, 0);z-index:3}
.mask{animation:mask ${refreshseconds}s steps(1, end) normal;background:inherit;border-radius:999px 0 0 999px;position:absolute;height:1em;width:0.5em}
`;

  clockElement.innerHTML = `<input id="autorefresh" type="checkbox" ${refreshEnabled?'checked':''}>${css.outerHTML}<div class="loader"><div class="fill"></div><div class="mask"></div></input>`;
  document.querySelector('nav > ul:last-child > li:first-child').insertAdjacentElement('beforebegin', clockElement);
  document.querySelector('#autorefresh').addEventListener('change', (event) => {
    setAutoRefresh(event.target.checked);
  });
  setAutoRefresh(refreshEnabled);
  function setAutoRefresh(force) {
    if (force) {
      refreshtimeoutid = setTimeout(()=>window.location.reload(), refreshseconds * 1000)
      document.querySelector('.loader').style.display = 'inline-block';
      localStorage.setItem(cookie, "true");
    } else if (refreshtimeoutid != null) {
      clearTimeout(refreshtimeoutid)
      document.querySelector('.loader').style.display = 'none';
      localStorage.setItem(cookie, "false");
    }
  }
})()