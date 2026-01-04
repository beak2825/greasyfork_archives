// ==UserScript==
// @name         Kemono.Party - User Filter
// @description  Block specified user in artists page and posts page.
// @version      1.12
// @match        https://*.kemono.su/posts*
// @match        https://*.kemono.su/artists*
// @match        https://*.kemono.su/*/user/*
// @exclude      /\/post\//
// @namespace    none
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471723/KemonoParty%20-%20User%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471723/KemonoParty%20-%20User%20Filter.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

let blacklists = GM_getValue('blacklists', []);
let filter_enabled = GM_getValue('filter_enabled', true);
let is_user_page = location.pathname.indexOf('/user/') >= 0;
let is_posts_page = location.pathname.indexOf('/posts') == 0;
let is_artists_page = location.pathname.indexOf('/artists') == 0;

addStyle();
addFilterButton();
addBlockButton();

function addFilterButton() {
  let ptop = document.querySelector('#paginator-top');
  if (is_posts_page) {
    let menu = ptop.querySelector('menu');
    if (menu) addFilterButtonTo(menu);
  } else if (is_artists_page) {
    new MutationObserver(() => {
      let menu = ptop.querySelector('menu');
      if (menu) addFilterButtonTo(menu);
    }).observe(ptop, {childList: true, subtree: false});
  }
}

function addFilterButtonTo(menu) {
  let btn_switch = document.createElement('a');
  btn_switch.classList.add('filter-switch');
  btn_switch.innerHTML = '<b>Filter</b>';
  if (filter_enabled) menu.closest('section').classList.add('filter-enabled');
  else btn_switch.classList.add('pagination-button-disabled');
  menu.insertBefore(btn_switch, menu.firstChild);
  btn_switch.onclick = () => {
    filter_enabled = !filter_enabled;
    menu.closest('section').classList.toggle('filter-enabled');
    btn_switch.classList.toggle('pagination-button-disabled');
    GM_setValue('filter_enabled', filter_enabled);
  };
}

function addBlockButton() {
  if (is_posts_page) document.querySelectorAll('article.post-card').forEach(card => addBlockButtonTo(card, true));
  let items = document.querySelector('.card-list__items');
  if (items) {
    new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(card => {
      if (card.classList.contains('post-card') || card.classList.contains('user-card')) addBlockButtonTo(card);
    }))).observe(items, {childList: true, subtree: false});
  }
  if (is_user_page) addBlockButtonToUserPage();
}

function addBlockButtonTo(card) {
  let service = card.dataset.service || card.href.split('/')[3];
  let user = card.dataset.user || card.href.split('/').pop();
  let is_blocked = blacklists.indexOf(service + '_' + user) >= 0;
  if (is_blocked) card.dataset.blocked = true;
  let btn_block = document.createElement('label');
  btn_block.classList.add('btn-block');
  btn_block.innerHTML = `<b></b>`;
  (card.querySelector('footer') || card).appendChild(btn_block);
  btn_block.onclick = e => {
    e.preventDefault();
    btn_block.closest('a').blur();
    updateCards(service, user, card.dataset.blocked, is_artists_page && card);
    blockUser(service, user);
  };
  if (is_posts_page) {
    btn_block.onmouseover = () => hintUser(service, user, card.dataset.blocked, true);
    btn_block.onmouseout = () => hintUser(service, user);
  }
}

function addBlockButtonToUserPage() {
  let [service, user] = location.pathname.slice(1).split('/user/');
  let is_blocked = blacklists.indexOf(service + '_' + user) >= 0;
  updateCards(service, user, !is_blocked);
  let header_actions = document.querySelector('.user-header__actions');
  let btn_block = document.createElement('a');
  btn_block.classList.add('btn-block-user');
  if (is_blocked) btn_block.classList.add('blocked');
  header_actions.appendChild(btn_block);
  btn_block.onclick = () => {
    btn_block.classList.toggle('blocked');
    updateCards(service, user, is_blocked);
    blockUser(service, user, is_blocked);
    is_blocked = !is_blocked;
  };
}

function blockUser(service, user, is_blocked, user_card) {
  let user_id = service + '_' + user;
  if (is_blocked) {
    blacklists = blacklists.filter(id => id !== user_id);
  } else {
    blacklists.push(user_id);
  }
  GM_setValue('blacklists', blacklists);
}

function updateCards(service, user, is_blocked, user_card) {
  if (user_card) updateCard(user_card, is_blocked);
  else {
    let post_cards = document.querySelectorAll(`article.post-card[data-service="${service}"][data-user="${user}"]`);
    post_cards.forEach(post_card => updateCard(post_card, is_blocked));
  }
}

function updateCard(card, is_blocked) {
  if (is_blocked) card.removeAttribute('data-blocked');
  else card.setAttribute('data-blocked', true);
}

function hintUser(service, user, is_blocked, onmouseover) {
  let post_cards = document.querySelectorAll(`article.post-card[data-service="${service}"][data-user="${user}"]`);
  post_cards.forEach(post_card => {
    if (onmouseover) {
      post_card.setAttribute(is_blocked ? 'data-hint-unblock' : 'data-hint-block', true);
    } else {
      post_card.removeAttribute('data-hint-block');
      post_card.removeAttribute('data-hint-unblock');
    }
  });
}

function addStyle() {
  let css = `
menu > a.filter-switch {color: orange;}
.filter-enabled [data-blocked] {display: none;}
/* card glow */
.user-card, .post-card > a {transition: box-shadow .25s ease, opacity .25s ease;}
.user-card[data-blocked], .post-card[data-blocked] > a {opacity: 0.75; box-shadow: 0 0 4px 2px orangered;}
.post-card[data-hint-block] > a {opacity: 1; box-shadow: 0 0 4px 2px orange;}
.post-card[data-hint-unblock][data-blocked] > a {opacity: 1; box-shadow: 0 0 4px 2px yellowgreen;}
/* block button */
:not([data-blocked]) .btn-block:not(:hover) b {visibility: hidden;}
.btn-block {padding: 10px; position: absolute; right: -5px; bottom: -5px;}
.btn-block > b {color: white; background-color: orangered; border: 1px solid black; border-radius: 4px; padding: 0 4px;}
.btn-block > b::before {content: 'Block User'}
[data-blocked] .btn-block > b::before {content: 'Blocked';}
[data-blocked] .btn-block:hover > b {background-color: yellowgreen;}
[data-blocked] .btn-block:hover > b::before {content: 'Unblock';}
/* block button (user page) */
.btn-block-user {color: grey;}
.btn-block-user::before {content: 'Block'}
.btn-block-user.blocked {color: orangered;}
.btn-block-user.blocked::before {content: 'Blocked'}
/* UI fix for AutoPagerize */
.autopagerize_page_separator, .autopagerize_page_info {flex: unset; width: 100%;}
`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
}
