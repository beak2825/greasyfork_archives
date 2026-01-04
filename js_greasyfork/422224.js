// ==UserScript==
// @name         SmoothRoll
// @namespace    https://bengrant.dev
// @version      0.7
// @description  Clean crunchyroll viewing experience
// @author       Ben Grant
// @match        https://www.crunchyroll.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=crunchyroll.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/422224/SmoothRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/422224/SmoothRoll.meta.js
// ==/UserScript==

const styles = `
:root {
  --bg-color: #f2f2f2;
  --main-color: #FFF;
  --text-color: #000;
  --link-color: #0676d6;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #222;
    --main-color: #000;
    --text-color: #DDD;
    --link-color: #55b0ff;
  }

  .collection-carousel-arrow {
    filter: invert(1);
  }
}

body.smoothroll_light {
  --bg-color: #f2f2f2;
  --main-color: #FFF;
  --text-color: #000;
  --link-color: #0676d6;
}
body.smoothroll_light .collection-carousel-arrow {
  filter: invert(0);
}
body.smoothroll_dark {
  --bg-color: #222;
  --main-color: #000;
  --text-color: #DDD;
  --link-color: #55b0ff;
}
body.smoothroll_dark .collection-carousel-arrow {
  filter: invert(1);
}

body.main-page {
  background-color: var(--bg-color);
}
.site-header {
  background: var(--main-color);
  box-shadow: none;
}
.header-menubar li a {
  color: var(--text-color);
}
.games, .store, .try-free-header-menu-item {
  display: none !important;
}
#template_container.template-container {
  background: none;
}
#marketing_banner {
  display: none;
}
#message_box {
  display: none;
}
#showmedia_video_player {
  border-radius: 8px;
  overflow: hidden;
}
.showmedia-submenu {
  display: none;
}
#main_content_white, .white-wrapper {
  border-radius: 8px;
  background: var(--main-color);
}
.guestbook {
  display: none;
}
body.smoothroll_comments .guestbook {
  display: block;
}
.guestbook textarea {
  color: inherit;
  background: var(--main-color);
  border: 1px solid var(--text-color);
  border-radius: 5px;
}
.comments .boxtitle {
  border-bottom: 0;
}
.guestbook-spoiler-checkbox {
  color: inherit;
}
.guestbook-list {
  border-top: 0;
}
.comments .more-replies {
  background-color: var(--bg-color);
  border: 1px solid var(--link-color);
  display: inline-block;
  padding: 0 5px;
  border-radius: 3px;
  margin-bottom: 10px;
}
.new-template-body {
  color: var(--text-color);
}
.new-template-body h3 {
  display: none;
}
.new-template-body a.block-link, .old-template-body a.block-link, a.block-link {
  color: var(--text-color);
}
.showmedia-related {
  display: none;
}
#footer {
  display: none;
}
#showmedia_about_info .rating {
  display: none;
}
body.smoothroll_info #showmedia_about_info .rating {
  display: block;
}
.new-template-body .block-link:hover, .new-template-body .pagination a, .new-template-body .para-div a, .new-template-body .sub-tabs .selectors a.text-link, .new-template-body .text-link, .new-template-body .wrapper a:hover a, .new-template-body a:hover h4, .new-template-body li a, .new-template-body p a, .new-template-body span a {
  color: var(--link-color);
}
img {
  border: none;
}
.episode-progress-bar {
  background: var(--bg-color);
}
#showmedia_about_info_details span {
  color: inherit;
}
.header-search-form {
  border: 0;
}
.header-search-form .header-searchbox {
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 4px;
}
.description .more {
  display: inline !important;
}
.description .more-dots {
  display: none;
}
.description a[href="#"] {
  display: none;
}
#showmedia_about_info_details > div:first-child,
#showmedia_about_info_details > div:last-child {
  display: none;
}
body.smoothroll_info #showmedia_about_info_details > div:first-child,
body.smoothroll_info #showmedia_about_info_details > div:last-child {
  display: block;
}
.game-banner-wrapper {
  display: none;
}
#showmedia_about_info_avail {
  display: none;
}
#showmedia_free_trial_signup {
  display: none;
}
#main_content > div.white-wrapper.container-shadow.large-margin-bottom::-webkit-scrollbar,
#main_content > div.white-wrapper.container-shadow.large-margin-bottom::-webkit-scrollbar-track,
#main_content > div.white-wrapper.container-shadow.large-margin-bottom::-webkit-scrollbar-thumb {
  width: 0;
  height: 0;
  background: transparent;
  display: none;
}

#smoothroll_settings_button {
  border: 0;
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  margin: 0;
  padding: 0;
  font: inherit;
}

#smoothroll_settings_modal {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  max-height: 90vh;
  max-width: 90vw;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 0 0 200vw rgba(0,0,0,.5);
  box-sizing: border-box;
  padding: 20px;
  color: var(--text-color);
  min-width: 300px;
}
body.smoothroll_settings_open #smoothroll_settings_modal {
  display: block;
}
#smoothroll_settings_modal h2 {
  margin: 0;
  padding: 0 0 4px;
  font-size: 1.2em;
}
#smoothroll_settings_modal label {
  display: block;
  padding: 14px 0 2px;
}
#smoothroll_settings_modal button,
#smoothroll_settings_modal select {
  font: inherit;
  background: inherit;
  color: inherit;
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid currentColor;
  box-sizing: border-box;
}
#smoothroll_settings_modal input[type=checkbox] {
  vertical-align: middle;
  margin-right: .5em;
}
#smoothroll_settings_close {
  margin-top: 20px;
  display: block;
  color: var(--link-color) !important;
  width: 100%;
  cursor: pointer;
}
`;

let setting_theme = undefined;
let setting_comments = undefined;
let setting_info = undefined;

function loadSettings() {
  // Load settings
  try {
    setting_theme = GM_getValue('smoothroll_setting_theme');
    if (setting_theme === undefined) throw new Error('No value set in GM, checking localStorage');
  } catch (e) {
    console.error(e);
    setting_theme = localStorage.getItem('smoothroll_setting_theme');
  }
  if (setting_theme && setting_theme === 'light') {
    document.body.classList.add('smoothroll_light');
    document.body.classList.remove('smoothroll_dark');
  } else if (setting_theme && setting_theme === 'dark') {
    document.body.classList.add('smoothroll_dark');
    document.body.classList.remove('smoothroll_light');
  } else {
    document.body.classList.remove('smoothroll_dark');
    document.body.classList.remove('smoothroll_light');
  }

  try {
    setting_comments = GM_getValue('smoothroll_setting_comments');
    if (setting_comments === undefined) throw new Error('No value set in GM, checking localStorage');
  } catch (e) {
    console.error(e);
    setting_comments = localStorage.getItem('smoothroll_setting_comments');
  }
  if (setting_comments && setting_comments === 'show') {
    document.body.classList.add('smoothroll_comments');
  } else {
    document.body.classList.remove('smoothroll_comments');
  }

  try {
    setting_info = GM_getValue('smoothroll_setting_info');
    if (setting_info === undefined) throw new Error('No value set in GM, checking localStorage');
  } catch (e) {
    console.error(e);
    setting_info = localStorage.getItem('smoothroll_setting_info');
  }
  if (setting_info && setting_info === 'show') {
    document.body.classList.add('smoothroll_info');
  } else {
    document.body.classList.remove('smoothroll_info');
  }
}

const player = document.getElementById('showmedia_video_player');

if (player) {
  loadSettings();

  // Styles
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Settings button
  const settings_button = document.createElement('button');
  settings_button.type = 'button';
  settings_button.id = 'smoothroll_settings_button';
  settings_button.appendChild(document.createTextNode('Smoothroll settings'));
  settings_button.addEventListener('click', () => {
    document.body.classList.toggle('smoothroll_settings_open');
  });
  document.getElementById('header_container').appendChild(settings_button);

  // Settings modal
  const modal = document.createElement('div');
  modal.id = 'smoothroll_settings_modal';
  const modal_heading = document.createElement('h2');
  modal_heading.appendChild(document.createTextNode('Smoothroll Settings'));
  modal.appendChild(modal_heading);

  // Color theme
  const smoothroll_setting_theme_label = document.createElement('label');
  smoothroll_setting_theme_label.for = 'smoothroll_setting_theme';
  smoothroll_setting_theme_label.appendChild(document.createTextNode('Color theme'));
  modal.appendChild(smoothroll_setting_theme_label);
  const smoothroll_setting_theme_input = document.createElement('select');
  smoothroll_setting_theme_input.id = 'smoothroll_setting_theme';
  ['System', 'Light', 'Dark'].forEach(op => {
    const option = document.createElement('option');
    option.value = op.toLowerCase();
    if (setting_theme && setting_theme === op.toLowerCase()) {
      option.selected = 'selected';
    }
    option.appendChild(document.createTextNode(op));
    smoothroll_setting_theme_input.appendChild(option);
  });
  smoothroll_setting_theme_input.addEventListener('change', () => {
    try {
      GM_setValue('smoothroll_setting_theme', smoothroll_setting_theme_input.value);
    } catch (e) {
      console.error(e);
      localStorage.setItem('smoothroll_setting_theme', smoothroll_setting_theme_input.value);
    }
    loadSettings();
  });
  modal.appendChild(smoothroll_setting_theme_input);

  // Comments
  const smoothroll_setting_comments_label = document.createElement('label');
  smoothroll_setting_comments_label.for = 'smoothroll_setting_comments';
  const smoothroll_setting_comments_input = document.createElement('input');
  smoothroll_setting_comments_input.type = 'checkbox';
  smoothroll_setting_comments_input.id = 'smoothroll_setting_comments';
  smoothroll_setting_comments_input.checked = setting_comments === 'show';
  smoothroll_setting_comments_input.addEventListener('change', () => {
    try {
      GM_setValue('smoothroll_setting_comments', smoothroll_setting_comments_input.checked ? 'show' : 'hide');
    } catch (e) {
      console.error(e);
      localStorage.setItem('smoothroll_setting_comments', smoothroll_setting_comments_input.checked ? 'show' : 'hide');
    }
    loadSettings();
  });
  smoothroll_setting_comments_label.appendChild(smoothroll_setting_comments_input);
  smoothroll_setting_comments_label.appendChild(document.createTextNode('Show comments'));
  modal.appendChild(smoothroll_setting_comments_label);

  // Info
  const smoothroll_setting_info_label = document.createElement('label');
  smoothroll_setting_info_label.for = 'smoothroll_setting_info';
  const smoothroll_setting_info_input = document.createElement('input');
  smoothroll_setting_info_input.type = 'checkbox';
  smoothroll_setting_info_input.id = 'smoothroll_setting_info';
  smoothroll_setting_info_input.checked = setting_info === 'show';
  smoothroll_setting_info_input.addEventListener('change', () => {
    try {
      GM_setValue('smoothroll_setting_info', smoothroll_setting_info_input.checked ? 'show' : 'hide');
    } catch (e) {
      console.error(e);
      localStorage.setItem('smoothroll_setting_info', smoothroll_setting_info_input.checked ? 'show' : 'hide');
    }
    loadSettings();
  });
  smoothroll_setting_info_label.appendChild(smoothroll_setting_info_input);
  smoothroll_setting_info_label.appendChild(document.createTextNode('Show additional info'));
  modal.appendChild(smoothroll_setting_info_label);

  // Modal
  const modal_close_button = document.createElement('button');
  modal_close_button.type = 'button';
  modal_close_button.id = 'smoothroll_settings_close';
  modal_close_button.appendChild(document.createTextNode('Close settings'));
  modal_close_button.addEventListener('click', () => document.body.classList.remove('smoothroll_settings_open'));
  modal.appendChild(modal_close_button);
  document.body.appendChild(modal);
}