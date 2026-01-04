// ==UserScript==
// @name        Autovote on wargm.ru
// @namespace   Violentmonkey Scripts
// @match       https://wargm.ru/server/*/*
// @grant       none
// @version     1.2
// @author      Xevin
// @license     MIT
// @description 25.04.2023, 02:21:50
// @downloadURL https://update.greasyfork.org/scripts/465361/Autovote%20on%20wargmru.user.js
// @updateURL https://update.greasyfork.org/scripts/465361/Autovote%20on%20wargmru.meta.js
// ==/UserScript==


const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

const $voteBtn = $("#main .card-footer .btn.btn-blue")

$$("#aside .card-body[role=button] a").forEach((el) => {
  const votePath = el.getAttribute("href") + "/votes"
  const linkToVote = document.createElement("a")
  linkToVote.setAttribute("href", votePath);
  linkToVote.innerHTML = "vote"
  linkToVote.classList.add("btn", "btn-blue", "btn-micro", "cl-2")

  if (window.location.pathname === votePath) {
    linkToVote.classList.remove("btn-blue")
    linkToVote.classList.add("btn-green")
  }

  const parent = el.parentElement
  parent.classList.add("cl-flex")
  el.classList.add("cl-10")
  el.parentElement.appendChild(linkToVote)
})

function DOMObserver(el, config, cb) {
  let observer = new MutationObserver(cb);

  observer.observe(el, config);
}

function watchChilds(el, cb) {
  DOMObserver(el, { childList: true, subtree: true }, cb);
}


watchChilds($voteBtn, (data) => {
  const isEnabled = $voteBtn.getAttribute("disabled") === null;

  if (isEnabled) {
    $voteBtn.click()
  }
});


const $ajaxResponse = $("#ajax_response")
watchChilds($ajaxResponse, (data) => {
  if ($ajaxResponse.querySelector("#ajaxmsgcaptcha") === null) {
    $voteBtn.click()
  }
})
