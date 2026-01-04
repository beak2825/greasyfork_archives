// ==UserScript==
// @name         YouTube Live: Highlight Moderator Comments
// @namespace    https://twitter.com/aryn_ra
// @version      1.0.1
// @description  YouTube Live のチャットでチャンネルの所有者・モデレータの発言を目立たせ、自動で上部に固定する
// @author       Aryn
// @match        https://www.youtube.com/live_chat?*
// @match        https://www.youtube.com/live_chat_replay?*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/427130/YouTube%20Live%3A%20Highlight%20Moderator%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/427130/YouTube%20Live%3A%20Highlight%20Moderator%20Comments.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
  'use strict';

  const HIGHLIGHT_BACKGROUND_COLOR_LIGHT = 'lavender';
  const HIGHLIGHT_BACKGROUND_COLOR_DARK = 'black';
  const PIN_LIMIT = 5;
  const BANNER_OFFSET = 66;
  const css = `
html {
  /* light theme */
  --highlight-background-color: ${HIGHLIGHT_BACKGROUND_COLOR_LIGHT};
}

html[dark] {
  /* dark theme */
  --highlight-background-color: ${HIGHLIGHT_BACKGROUND_COLOR_DARK};
}

#item-offset {
  overflow: visible !important;
}

#items {
  transform: none !important;
}

yt-live-chat-text-message-renderer[author-type=owner].hmc-highlight,
yt-live-chat-text-message-renderer[author-type=moderator].hmc-highlight {
  position: sticky;
  z-index: 1;
  transition: top ease-in-out .1s;
  background-color: var(--highlight-background-color);
}

#live-chat-banner {
  z-index: 2;
}

#hmc-config {
  position: absolute;
  right: 84px;
  width: 24px;
  height: 24px;
  margin: 8px;
  cursor: pointer;
  user-select: none;
  opacity: .8;
}

#hmc-config:hover {
  opacity: 1;
}

#hmc-config-popover {
  position: absolute;
  top: 48px;
  left: 0;
  display: none;
  width: 400px;
  height: 400px;
  padding: 8px;
  color: var(--yt-spec-text-primary);
  background-color: var(--yt-spec-general-background-b);
}

#hmc-config-popover.hmc-show {
  display: block;
}

#hmc-config-popover h1 {
  font-size: 18px;
  font-weight: normal;
  line-height: 18px;
  margin-bottom: 8px;
}

#hmc-config-popover p {
  font-size: 12px;
  line-height: 12px;
  width: 384px;
}

#hmc-config-popover textarea {
  font-size: 15px;
  box-sizing: border-box;
  width: 384px;
  height: 322px;
  margin: 8px 0;
  color: var(--ytd-searchbox-text-color);
  border: 1px solid var(--ytd-searchbox-legacy-border-color);
  background-color: var(--ytd-searchbox-background);
}

#hmc-config-popover input[type='button'],
#hmc-config-popover input[type='reset'] {
  font-size: 12px;
  box-sizing: border-box;
  height: 24px;
}
`;

  const exclusionList = GM_getValue('exclusion-list', []);
  const itemsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      function isModerator(node) {
        const authorType = node.getAttribute('author-type');
        return authorType === 'owner' || authorType === 'moderator';
      }

      function isExcluded(node) {
        const channelName = node.querySelector('#author-name').textContent.trim();
        return exclusionList.includes(channelName)
      }

      function isHighlightTarget(node) {
        return isModerator(node) && !isExcluded(node);
      }

      const nodes = [...mutation.target.children].filter(isHighlightTarget);
      for (const node of nodes) {
        node.classList.add('hmc-highlight');
      }
      const unpinNodes = nodes.slice(0, -PIN_LIMIT);
      for (const node of unpinNodes) {
        node.style.transition = '';
        node.style.top = '';
      }
      const pinNodes = nodes.slice(-PIN_LIMIT);
      const existsActiveBanner = document.getElementById('live-chat-banner').hasAttribute('has-active-banner');
      let offset = existsActiveBanner ? BANNER_OFFSET : 0;
      for (const node of pinNodes) {
        node.style.top = `${offset}px`;
        offset += node.clientHeight;
      }
    });
  });

  const items = document.querySelector('#item-offset #items');
  itemsObserver.observe(items, {
    childList: true
  });

  const itemListObserver = new MutationObserver(() => {
    const items = document.querySelector('#item-offset #items');
    itemsObserver.observe(items, {
      childList: true
    });
  });

  const itemList = document.querySelector('#item-list');
  itemListObserver.observe(itemList, {
    childList: true
  });

  const configButton = document.createElement('div');
  configButton.id = 'hmc-config';
  configButton.textContent = '🔧';
  configButton.addEventListener('click', () => {
    document.querySelector('#hmc-config-popover').classList.toggle('hmc-show');
  });
  const chatHeader = document.querySelector('yt-live-chat-header-renderer');
  chatHeader.appendChild(configButton);
  const configPopover = document.createElement('div');
  configPopover.id = 'hmc-config-popover';
  configPopover.innerHTML = `
<h1>強調除外設定</h1>
<p>1行に1つずつ、除外したいチャンネル名 (表示ユーザー名) を入力</p>
<form name="exclusion-config">
  <div><textarea id="hmc-exclusion-text">${exclusionList.join('\n')}</textarea></div>
  <div><input type="reset" value="キャンセル" id="hmc-cancel" /> <input type="button" value="保存" id="hmc-save" /></div>
</form>
`;
  document.body.appendChild(configPopover);

  const save = document.querySelector('#hmc-save');
  save.addEventListener('click', () => {
    const exclusionText = document.querySelector('#hmc-exclusion-text');
    GM_setValue('exclusion-list', exclusionText.value.trim().split('\n').map((s) => s.trim()));
    location.reload();
  });

  const cancel = document.querySelector('#hmc-cancel');
  cancel.addEventListener('click', () => {
    document.querySelector('#hmc-config-popover').classList.toggle('hmc-show');
  });

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
})();