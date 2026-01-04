// ==UserScript==
// @name          Komica thread collapse
// @version       1.0.7
// @description   Let you collapse/expand threads on Komica
// @author        peng-devs
// @match         https://*.komica.org/*/*.htm*
// @match         https://*.komica1.org/*/*.htm*
// @match         https://*.komica2.net/*/*.htm*
// @match         https://*.komica2.cc/*/*.htm*
// @exclude-match https://2cat.komica.org/*
// @icon          https://komica1.org/favicon.ico
// @grant         none
// @allFrames     true
// @license MIT
// @namespace https://greasyfork.org/users/57176
// @downloadURL https://update.greasyfork.org/scripts/439496/Komica%20thread%20collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/439496/Komica%20thread%20collapse.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const NAME = 'Komica thread collapse';


  function main() {
    console.log(`[${NAME}] Initializing...`);

    inject_custom_style(`
      .collapsed_thread {
        opacity: 0.5;
      }
      .thread-collapse-button {
        float: left;
        margin-right: 5px;
      }
      .thread.collapsed {
        display: none !important;
      }
      .thread.ngid-ngthread > .thread-collapse-button {
        display: none;
      }
    `);

    const storage = get_storage();
    const threads = document.querySelectorAll('div.thread');
    [...threads].forEach(thread => {
      const thread_collapse_button = create_thread_collapse_button(thread);
      thread.prepend(thread_collapse_button);

      const data_no = thread.getAttribute('data-no');
      if (storage.includes(data_no)) {
        thread_collapse(thread);
      }
    });

    console.log(`[${NAME}] Loaded`);
  }

  /// private

  function inject_custom_style(css) {
    const style = document.createElement("style");
    document.head.append(style);
    style.dataset.source = NAME;
    style.innerHTML = css;
  }

  function get_storage() {
    return window.localStorage.getItem('collapsed_threads') || '';
  }

  function save_to_storage(data_no) {
    let storage = get_storage();

    if (storage.includes(data_no)) return;

    if ((storage.match(/,/g) || []).length > 100) {
      storage = storage.slice(storage.indexOf(',') + 1);
    }

    window.localStorage.setItem('collapsed_threads', `${storage}${data_no},`);
  }

  function remove_from_storage(data_no) {
    const storage = get_storage();
    window.localStorage.setItem('collapsed_threads', storage.replaceAll(`${data_no},`, ''));
  }

  function get_thread(data_no, collapsed = false) {
    return document.querySelector(`div.${collapsed ? 'collapsed_thread' : 'thread'}[data-no="${data_no}"`);
  }

  function create_collapsed_thread(thread) {
    const data_no = thread.getAttribute('data-no');
    const thread_collapse_button = create_thread_collapse_button(thread, true);
    const head = thread.querySelector('div.post-head').cloneNode(true);
    const hr = document.createElement('hr');

    const collapsed_thread = document.createElement('div');
    collapsed_thread.className = 'collapsed_thread';
    collapsed_thread.setAttribute('data-no', data_no);
    collapsed_thread.appendChild(thread_collapse_button);
    collapsed_thread.appendChild(head);
    collapsed_thread.appendChild(hr);

    return collapsed_thread;
  }

  function thread_collapse(thread) {
    thread.classList.add('collapsed');

    const collapsed_thread = create_collapsed_thread(thread);
    thread.before(collapsed_thread);

    const data_no = thread.getAttribute('data-no');
    save_to_storage(data_no);

    console.log(`[${NAME}] thread ${data_no} collapsed`);
  }

  function thread_expand(thread) {
    thread.classList.remove('collapsed');

    const collapsed_thread = thread.previousElementSibling;
    if (collapsed_thread?.classList.contains('collapsed_thread')) {
      collapsed_thread.remove();
    }

    const data_no = thread.getAttribute('data-no');
    remove_from_storage(data_no);
    console.log(`[${NAME}] thread ${data_no} expanded`);
  }

  function create_thread_collapse_button(thread, collapsed = false) {
    const thread_collapse_button = document.createElement('a');
    thread_collapse_button.className = 'thread-collapse-button';
    thread_collapse_button.innerText = `[${collapsed ? '+' : '–'}]`;
    thread_collapse_button.addEventListener(
      'click',
      collapsed
        ? () => thread_expand(thread)
        : () => thread_collapse(thread)
    );

    return thread_collapse_button;
  }

  main();

})();