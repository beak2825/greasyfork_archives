// ==UserScript==
// @name         BetterYouTubeStreams
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Improves the chat widget among other things.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421390/BetterYouTubeStreams.user.js
// @updateURL https://update.greasyfork.org/scripts/421390/BetterYouTubeStreams.meta.js
// ==/UserScript==

(function() {
  // **********************
  // Whatever modifications we want to do to the chat frame go here.
  // **********************
  function init_chat_frame() {
    // Global style overrides for chat frame.
    let frame_border = is_dark_mode ? '#353535' : '#E0E0E0',
        input_border = is_dark_mode ? '#4e4e4e' : '#ECECEC',
        input_bkg    = is_dark_mode ? '#313131' : '#f3f3f3'
    add_global_style(`
      yt-emoji-picker-renderer {
        max-height: 350px !important;
        height: 350px !important;
      }
      #author-name {
        font-weight: bold !important;
      }
      label#label {
        left: 9px !important;
        top: unset !important;
      }
      #input-panel.yt-live-chat-renderer::after {
        content: none;
      }
      yt-live-chat-message-input-renderer {
        border-top: 1px solid ${frame_border};
      }
      yt-live-chat-text-input-field-renderer {
        border: 2px solid ${input_border};
        padding: 8px;
        border-radius: 4px;
        background-color: ${input_bkg};
      }
      span#message {
        pointer-events:none;
      }
      span#message:after {
        content: " Translate";
        font-size: 9px;
        color: cyan;
        pointer-events:auto;
      }
      #underline, #avatar, yt-live-chat-viewer-engagement-message-renderer,
      #input-container yt-live-chat-author-chip {
        display: none;
      }
    `
    );
    // so we can modify new chat entries as they are being added.
    install_dom_observer();
    // remove useless DOM crap.
// i think this fucks something up and your own chat message sometimes appears twice
/*
    let selectors = [
      'yt-live-chat-viewer-engagement-message-renderer',
      '#input-container yt-live-chat-author-chip',
      '#avatar', '#underline'
    ];
    for (let s of selectors) {
      let elem = document.querySelector(s);
      if (elem)
        elem.parentNode.removeChild(elem);
    }
*/
    install_translation_handler();
    _log("chat frame initialized");
  }

  // **********************
  // Whatever modifications we want to do to the main window go here.
  // **********************
  function init_main_frame() {
    // Global style overrides for main document.
    add_global_style(`
      #secondary-inner {
        height: 90% !important;
      }
      #chat {
        height: 90vh !important
      }
      #menu-container ytd-button-renderer {
        display: none;
      }
    `
    );
    // Remove as much unnecessary crap from DOM as possible, please.
    remove_useless_crap();
    _log("main window initialized");
  }

  function remove_useless_crap() {
    let crap = [
      '#related',
      '#show-hide-button',
      'ytd-metadata-row-container-renderer'
    ];
    for (let c of crap) {
      let elem = document.querySelector(c);
      if (elem)
        elem.parentNode.removeChild(elem);
    }
    let btns = document.querySelectorAll('#menu-container ytd-button-renderer');
    for (let b of btns)
        b.parentNode.removeChild(b);
  }

  function install_dom_observer() {
    let targetNode = document.getElementById('contents');
    if (!targetNode) {
      _fatal('Could not locate "contents" node in chat frame');
    } else {
      new MutationObserver(on_dom_modified).observe(
        targetNode, {
          childList: true,
          subtree: true 
        }
      );
    }
  }

  function install_translation_handler() {
    let chat = document.getElementById('chat');
    if (!chat) {
      console.error('Could not locate "chat" node in chat frame');
    } else {
      chat.addEventListener('click', function(ev) {
        let t = ev.target;
        if (t && t.tagName == 'SPAN' && t.id == 'message') {
          let text = encodeURIComponent( t.innerText.replace(/\//, '') );
          let url = `https://translate.google.com/#auto/en/${text}`;
          window.open(url,'_translate');
        }
      });
    }
  }

  // callback that is invoked when a new HTML node is being added
  // to the chat.
  function on_dom_modified(mutationsList) {
    // We use this to change the color of the username, replace
    // .svg images with their .png equivalents etc.
    for(const mutation of mutationsList) {
      if (mutation.type != 'childList')
        continue;
      // so we don't end up in an endless loop when modifying
      // the src attribute.
      if (mutation.addedNodes.length == 0)
        continue;
      for(const node of mutation.addedNodes) {
        // replace sluggish SVGs images with PNG equivalents.
        if (node.src != null && node.src.endsWith('svg')) {
          node.src = node.src.replace(/svg$/, 'png');
        } else if (node.id == 'author-name') {
          // colorize usernames
          node.style.color = color_for_string(node.innerText);
        }
      }
    }
  }

  function _fatal(msg) {
    alert(msg);
    console.error(msg);
  }

  function _log(msg) {
    console.log(`Better YouTube Streams: ${msg}`);
  }

  function add_global_style(css) {
    let head = document.getElementsByTagName('head')[0];
    if (!head)
      return;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  function _ctor() {
    window.setTimeout(function() {
      if (is_chat_frame()) {
        init_chat_frame();
      } else if (is_live_stream_v2()) {
        init_main_frame();
      }
    }, 5000);
  }

  function is_live_stream_v2() {
    let cache = [];
    let blob = JSON.stringify(window, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value))
          return;
        cache.push(value);
      }
      return value;
    });
    let ret = blob.match(/"isLiveContent":true/);
    cache = null;
    blob  = null;
    return ret != null;
  }

  /*
  function is_live_stream() {
    return document.querySelector('ytd-live-chat-frame') != null;
  }
  */

  function is_chat_frame() {
    return location.pathname == '/live_chat';
  }

  const is_dark_mode = document.cookie.match(/f6=[4|1]/);

  function color_for_string(s) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    let shortened = hash % 360;
    return `hsl(${shortened}, 100%, 70%)`;
  }

  // init code
  if (document.readyState != 'loading')
    _ctor();
  else
    document.addEventListener('DOMContentLoaded', _ctor);
})();
