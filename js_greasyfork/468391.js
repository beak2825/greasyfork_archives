// ==UserScript==
// @name         Anilist Emoji Bar
// @namespace    https://gnir.xyz
// @version      1.0
// @description  Add an emoji bar under comment editors on AniList
// @license      MIT
// @author       gnir
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468391/Anilist%20Emoji%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/468391/Anilist%20Emoji%20Bar.meta.js
// ==/UserScript==

String.prototype.toHtmlEntities = function() {
// https://stackoverflow.com/questions/71169227/how-can-i-convert-every-special-character-and-emoji-into-its-html-entity-using-j
  return this.replace(/[^a-z0-9\s]/ugm, s => "&#" + s.codePointAt(0) + ";");
};

let emojis = ["🙂", "😊", "😂", "😅", "😶", "🥲","😥","😭", "😮", "🫠", "😢", "😧", "❤️", "🔥", "🚩","🏳️‍🌈", "🏳️‍⚧️"];
const bar = `<div class="emojibar">${emojis.join(" ")}</div>`

function check_path_match() {
    const path = window.location.pathname;
    const pat = /^\/(home|user|forum)(?:\/thread)?/i;
    const match = pat.exec(path);
    if(match === null) {
        return false;
    }
    return match[1];
}

function insert_emoji(e) {
    e.preventDefault();
    const textarea = e.target.parentElement.previousElementSibling.querySelector('textarea');
    const emojiData = e.target.getAttribute('data-emoji');
    const newValueBefore = textarea.value.slice(0, textarea.selectionStart) + emojiData;
    const newValueAfter = textarea.value.slice(textarea.selectionEnd);
    textarea.value = newValueBefore + newValueAfter;
    textarea.focus();
    textarea.selectionEnd = newValueBefore.length;
    textarea.dispatchEvent(new Event('input', {cancelable: false, composed: true}))
}

function inject_emojibar(target) {
    const el = document.createElement('div');
    el.classList.add('emojibar');
    el.innerHTML = emojis.map((x, i) => `<a href="#" class="emoji_button" data-emoji="${x.toHtmlEntities().toHtmlEntities()}" id="emoji_button-${i}">${x}</a>`).join(" ");
    el.style.marginBottom = '1em';
    target.after(el);
    const emojiButtons = document.querySelectorAll('.emojibar .emoji_button');
    for(const button of emojiButtons) {
        button.addEventListener('click', insert_emoji);
    }
}

function remove_emojibar(textarea){
    const emojibar = textarea.nextElementSibling;
    if(emojibar.classList.contains('emojibar')) {
        emojibar.remove();
    }
}

function get_textarea(target, matchType) {
    if(matchType === 'forum') {
        return target.querySelector('.el-textarea')
    } else {
        const targetParent = target.parentElement;
        return targetParent.querySelector('.el-textarea')
    }
}

let observer = new MutationObserver((mutations, obs) => {
  const matchType = check_path_match();
  if(['user', 'home'].includes(matchType)) {
      for(const mutation of mutations) {
          if(mutation.type == 'attributes' && mutation.target.classList.contains('markdown-editor')) {
              if(mutation.attributeName == 'style') {
                  const textarea = get_textarea(mutation.target, matchType);
                  if(mutation.target.style.display !== 'none') {
                      inject_emojibar(textarea);
                  } else {
                      remove_emojibar(textarea);
                  }
                  break;
              }
         }
      }
  } else if(matchType == 'forum') {
      for(const mutation of mutations) {
          if(mutation.type == 'childList' &&
             mutation.target.classList.contains('comment-editor') &&
            mutation.addedNodes.length > 0) {
              const textarea = get_textarea(mutation.target, matchType);
              inject_emojibar(textarea);
          }
      }
  }
});

observer.observe(document.getElementById('app'), {childList: true, subtree: true, attributes: true});
