// ==UserScript==
// @name         Terabox Fun ShortLink
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  asas
// @author       You
// @match        https://hotmediahub.com/*
// @match        https://fansonlinehub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotmediahub.com
// @connect      terabox.fun
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481333/Terabox%20Fun%20ShortLink.user.js
// @updateURL https://update.greasyfork.org/scripts/481333/Terabox%20Fun%20ShortLink.meta.js
// ==/UserScript==


function initBypassFromServer() {
  const url = document.location.href;

  const requestBypassEl = document.createElement("button")
  requestBypassEl.innerText = "Request Bypass Server"

  // style
  requestBypassEl.style.position = "fixed";
  requestBypassEl.style.padding = "8px 12px";
  requestBypassEl.style.background = "#2e7dfe";
  requestBypassEl.style.borderRadius = "8px";
  requestBypassEl.style.outline = "none";
  requestBypassEl.style.border = "unset";
  requestBypassEl.style.bottom = "20px";
  requestBypassEl.style.right = "20px";
  requestBypassEl.style.zIndex = 9999;

  requestBypassEl.addEventListener("click", () => {
    fetch("https://by-link.glitch.me/?url=" + url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.status) {
			  	const linkSplit = data.link.split("/");
					GM_xmlhttpRequest({
		        method: "GET",
		        url: "https://terabox.fun/api/shortlink/getoriginurl?web=1&encrypt_surl_key=" + linkSplit[linkSplit.length - 1],
		        onload: function (response) {
		          const json = JSON.parse(response.responseText);
		          window.location.href = json.data.origin_url;
		        },
		        onerror: function (error) {
		        	console.log(error)
		          window.location.href = data.link;
		        }
		      });
        } else {
          requestBypassEl.innerText = "Gagal bypass";
        }
      })
      .catch((err) => {
        requestBypassEl.innerText = "Server Error"
      })
  })

  document.body.appendChild(requestBypassEl);
}

async function initBypassLocal() {
  const url = document.location.href;

  const requestBypassEl = document.createElement("button")
  requestBypassEl.innerText = "Request Bypass Local"

  // style
  requestBypassEl.style.position = "fixed";
  requestBypassEl.style.bottom = "20px";
  requestBypassEl.style.left = "10px";
  requestBypassEl.style.zIndex = 9999;

  requestBypassEl.addEventListener("click", () => {
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          "Cookie": "ptimes=KspIOWM6WmApIL5JfDyKng%3D%3D"
        },
        onload: function (response) {
          console.log(response.status)
        },
        onerror: function (error) {
          alert(error)
        }
      });
    } catch (err) {
      alert("Error")
    }
  })

  document.body.appendChild(requestBypassEl);
}

const clearAllCookies = () => {
  // retrieve all cookies
  var Cookies = document.cookie.split(';');
  // set past expiry to all cookies
  for (var i = 0; i < Cookies.length; i++) {
    document.cookie = Cookies[i] + "=; expires=" + new Date(0).toUTCString();
  }
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

async function initBypass() {
  const url = document.location.href;
  setCookie("ptimes", "KspIOWM6WmApIL5JfDyKng%3D%3D", 1)
  alert("Set Cookie")

  fetch(url, {
      method: "GET",
    })
    .then((resp) => console.log(resp.status))
    .catch((err) => console.log(err))
}

(function () {
  'use strict';

  let id = null;
  const timeSkipApp = 10000;

  initBypassFromServer()
  // initBypass()
  initBypassLocal()

  id = setInterval(() => {
    const fullbox = document.querySelectorAll(".full-box");
    for (const item of fullbox) {
      if (item.style.display !== "none") {
        item.style.display = "none"
        document.body.style.height = "auto";
        document.body.style.overflow = "visible";
      }
    }

    const buttonSkip = document.querySelector("[data-v-7dde887c].btn.active")
    if (buttonSkip) {
      buttonSkip.click();
    }
  }, timeSkipApp)
})();