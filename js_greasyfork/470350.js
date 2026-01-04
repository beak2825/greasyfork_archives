// ==UserScript==
// @name        Misskey time fix
// @namespace   notoiro
// @match       https://misskey.niri.la/*
// @grant       none
// @version     1.0
// @author      notoiro
// @description N分前って言われてもわかんない
// @run-at      document-idle
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/470350/Misskey%20time%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/470350/Misskey%20time%20fix.meta.js
// ==/UserScript==

// settings
const smart_date = true; // 今日なら時間だけ、そうじゃないなら日付も。
const load_wait = 2; // タイムラインロードされるまで何秒待つか。

const is_today = (date) => {
  if(!smart_date) return false;

  const now = new Date();

  const date_zero = new Date(date.toDateString()).getTime();
  const now_zero = new Date(now.toDateString()).getTime();

  return date_zero == now_zero;
}

const parse_date = (date) => {
  const abs_date = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
  const abs_time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;

  return (!is_today(date)) ? `${abs_date} ${abs_time}` : abs_time;
}

const apply_time = (elements) => {
  for(const el of elements){
    el.innerText = parse_date(new Date(el.title));
  }
}

const callback = (mutations) => {
  for(const mut of mutations){
    const els = mut.target.querySelectorAll('header > div > a > time, div > button > time');

    apply_time(els);
  }
}

const start_apply = () => {
  const els = document.body.querySelectorAll('header > div > a > time, div > button > time');

  apply_time(els);
}

const main = () => {
  const obs_target = document.querySelector("main");
  const opt = {
    childList: true,
    attributes: true,
    subtree: true,
  }

  const observer = new MutationObserver(callback);
  observer.observe(obs_target, opt);

  start_apply();
}

setTimeout(main, load_wait * 1000);
