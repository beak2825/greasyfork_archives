// ==UserScript==
// @name         Twitch chat cleaner
// @namespace    https://filipesabella.com
// @version      0.40
// @description  Add spam controls and filters to twitch chat.
// @author       Filipe Sabella
// @license      MIT
// @match        https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/406410/Twitch%20chat%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/406410/Twitch%20chat%20cleaner.meta.js
// ==/UserScript==

const defaults = {
  disableAll: false,
  spammy: true,
  emojiOnly: true,
  allCaps: true,
  freeFilters: [
    'lulw',
    'you can use quotes',
    '/.*and regexes.*/i',
  ],
  maxWords: 40,
  minWords: 1,
  tooManyDuplicatesThreshold: 1.7,
  tooManyEmojiThreshold: 3,
  allowWords: [],
};

let options = defaults;
let counter = 0;

function isGarbage(options, s) {
  const trimmed = s.trim();
  const upperCased = trimmed.toUpperCase();
  const words = trimmed.split(' ').filter(s => s !== '');

  const isUpperCase = s => s === upperCased;

  const filteredOut = _ => options
    .freeFilters
    .map(filter => {
      if (filter[0] === '/') {
        const [_, regex, flags] = filter.match(/\/(.*)\/(.*)/);
        return new RegExp(regex, flags);
      } else {
        return new RegExp(`.*${filter}.*`, 'i');
      }
    })
    .find(filter => filter.test(trimmed));

  const isMessageTooLong = _ => words.length > options.maxWords;
  const isMessageTooShort = _ => words.length < options.minWords;
  const isDuplicatedPhrase = words =>
    words.length / new Set(words).size >= options.tooManyDuplicatesThreshold;

  if (options.emojiOnly && trimmed === '') {
    return [true, 'emoji only'];
  } else if (options.allCaps && isUpperCase(trimmed)) {
    return [true, 'all caps'];
  } else if (isMessageTooLong(trimmed)) {
    return [true, 'too long'];
  } else if (isMessageTooShort(trimmed)) {
    return [true, 'too short'];
  } else if (options.spammy && isDuplicatedPhrase(words)) {
    return [true, 'spammy'];
  } else {
    const filter = filteredOut() || false;
    if (filter) {
      return [true, filter.toString()];
    } else {
      return [false, ''];
    }
  }
}

function handler(messageContainer) {
  if (options.disableAll) return false;

  if (messageContainer.className !== 'chat-line__message') return;

  const text = Array.from(messageContainer.querySelectorAll('.text-fragment'))
    .map(e => e.innerHTML).join(' ').trim();

  if (options.allowWords.length > 0) {
    const allowRegex =
      new RegExp('.*(' + options.allowWords.join('|') + ').*', 'i');
    if (allowRegex.test(text)) return false;
  }

  const tooManyEmoji = () => options.spammy && messageContainer
    .querySelectorAll('.chat-line__message--emote-button')
    .length >= options.tooManyEmojiThreshold;

  if (tooManyEmoji()) {
    remove(messageContainer);
    console.log(`Filtered message: "${text}". Reason: too many emoji.`);
  } else {
    const [garbage, reason] = isGarbage(options, text);
    if (garbage) {
      remove(messageContainer);
      console.log(`Filtered message: "${text}". Reason: ${reason}.`);
    }
  }
}

function remove(messageContainer) {
  // removing the node causes issues with other twitch features
  // messageContainer.remove();
  messageContainer.style.display = 'none';
  document.getElementById('counter-container').innerHTML = '🚯 ' + ++counter;
}

function listenToMessages() {
  readOptions();

  document.onkeyup = e => {
    if (e.which === 27) { // escape
      hideOptions();
    }
  }

  const messageContainer = document
    .querySelector('.chat-scrollable-area__message-container');
  if (!messageContainer) {
    return;
  }

  const observer = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
      const node = mutation.addedNodes[0];
      const maybeMessageContainer = node?.querySelector('.chat-line__message');
      if (maybeMessageContainer) {
        handler(maybeMessageContainer);
      }
    }
  });

  observer.observe(messageContainer, {
    attributes: false,
    childList: true,
    subtree: true
  });

  if (!document.getElementById('counter-container')) {
    const container = document.querySelector('.chat-input__buttons-container');
    if (!container) return;

    const counterContainer = document.createElement('div');
    counterContainer.id = 'counter-container';
    counterContainer.style.cursor = 'pointer';
    counterContainer.style.userSelect = 'none';
    counterContainer.style.fontFamily = 'monospace';
    counterContainer.innerHTML = '🚯  ';
    counterContainer.onclick = () => {
      showOptions();
    };
    container.childNodes[1].prepend(counterContainer);
  }
}

function showOptions() {
  readOptions();

  let optionsContainer = document.getElementById('options-container');
  if (!optionsContainer) {
    addStyle(`
      #options-container {
        display: grid;
        grid-template-areas: "area";
        position: absolute;
        width: fit-content;
        min-width: 30em;
        z-index: 99999;
        background-color: #171717;
        color: #f0f0f0;
        border: 1px solid #f0f0f0;
        border-radius: 0 7px 7px 7px;
      }

      #options-container.hidden {
        display: none;
      }

      #options-container .resize-handle {
        grid-area: area;
        width: 100%;
        height: 100%;
        background-color: transparent;
        resize: both;
        overflow: auto;
        direction: rtl;
        transform: scaleY(-1);
        z-index: 99999;
      }

      #options-container .overlay {
        position: fixed;
        inset: 0;
        z-index: 99998;
      }

      #options-container .content {
        grid-area: area;
        display: flex;
        flex-direction: column;
        margin: 1.5em;
        gap: 1em;
        z-index: 99999;
      }

      #options-container label {
        display: inline-block;
        width: 15em;
      }

      #options-container label span,
      #options-container p span {
        cursor: help;
        text-decoration: underline;
      }

      #options-container input, #options-container textarea {
        background-color: #f0f0f0;
        color: #171717;
        border: 1px solid #171717;
        padding: .3em .5em;
        outline: 1px solid #f0f0f0;
        transition: all .15s;
      }

      #options-container input:focus, #options-container textarea:focus {
        outline: 1px solid #1f69ff;
      }

      #options-container input[type=number] {
        width: 6em;
      }

      #options-container .textarea-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 15em;
      }

      #options-container textarea {
        width: 100%;
        flex: 1;
        font-family: inherit;
        line-height: 1.5em;
      }
    `);

    const freeFilters = options.freeFilters.join(' ');

    document.body.insertAdjacentHTML('beforeend', `
      <div id="options-container">
        <div class="overlay"></div>
        <div class="resize-handle"></div>
        <div class="content">
          <div>
            <label>Block
              <span title="Overall spam with duplicated text or too many emoji">
                spammy messages
              </span>
            </label>
            <input class="input" type="checkbox" name="spammy"
              ${options.spammy && 'checked'}></input>
          </div>
          <div>
            <label>Block emoji only</label>
            <input class="input" type="checkbox" name="emojiOnly"
              ${options.emojiOnly && 'checked'}></input>
          </div>
          <div>
            <label>Block all caps</label>
            <input class="input" type="checkbox" name="allCaps"
              ${options.allCaps && 'checked'}></input>
          </div>
          <div>
            <label>Max words per message</label>
            <input class="input" type="number" name="maxWords"
              value="${options.maxWords}"></input>
          </div>
          <div>
            <label>Min words per message</label>
            <input class="input" type="number" name="minWords"
              value="${options.minWords}"></input>
          </div>
          <div class="textarea-container">
            <p>
              Block messages that match the
              <span class="help" title="You can:
    - Add words, it simply blocks messages that contain them, case insensitive
    - Add phrases by enclosing them in double-quotes, same as above
    - Add regular expressions by surrounding your expression with '/'">
                following
              </span>
            </p>
            <textarea
              class="input"
              name="freeFilters">${freeFilters}</textarea>
          </div>
          <div>
            <label>
              ALLOW messages
              <span class="help" title="Useful for adding your name, for example.
  Precedes *all* other filters, case insensitive.">
                containing
              </span>
            </label>
            <input class="input" type="text" name="allowWords"
              value="${options.allowWords.join(' ')}"></input>
          </div>
          <div>
            <label>Disable all filters</label>
            <input class="input" type="checkbox" name="disableAll"
              ${options.disableAll && 'checked'}></input>
          </div>
        </div>
      </div>
    `);

    optionsContainer = document.getElementById('options-container');

    const {
      top,
      right,
    } = document.getElementById('counter-container').getBoundingClientRect();

    optionsContainer.style.right = window.innerWidth - right + 'px';
    optionsContainer.style.bottom = window.innerHeight - top + 'px';

    document.querySelectorAll('#options-container .input').forEach(e => {
      e.onkeyup = e.onkeypress = e.onchange = () => {
        const opts = Array.from(
          document.querySelectorAll('#options-container .input')
        ).reduce((acc, e) => {
          const name = e.name;
          acc[name] = e.type === 'checkbox' ?
            e.checked :
            e.value;
          return acc;
        }, {});

        storeOptions(opts);
        readOptions();
      };
    });

    document.querySelector('#options-container .overlay').onclick = hideOptions;
  } else {
    optionsContainer.classList.toggle('hidden');
  }
}

function hideOptions() {
  document.getElementById('options-container').classList.add('hidden');
}

window.setInterval(() => {
  if (!document.getElementById('counter-container')) {
    listenToMessages();
  }
}, 1000);

function addStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.appendChild(style);
}

function readOptions() {
  try {
    const s = localStorage.getItem('twitch-cleaner-options');
    const opt = s ? JSON.parse(s) : defaults;
    const merged = {
      ...defaults,
      ...opt,
    };

    // puts quotes back into multi-word items. e.g., the array:
    // ['aaa', 'hello there', 'bbb', '/a regex/']
    // returns the string:
    // aaa "hello there" bbb /a regex/
    merged.freeFilters = merged.freeFilters
      .map(w => w.includes(' ') && w[0] !== '/' ? `"${w}"` : w);

    options = merged;
  } catch (e) {
    console.error(e);
    options = defaults;
  }
}

function storeOptions(options) {
  // split into array and remove possible double-quotes. e.g., the string:
  // aaa "hello there" bbb /a regex/
  // returns the array:
  // ['aaa', 'hello there', 'bbb', '/a regex/']
  options.freeFilters = options.freeFilters
    .match(/\w+|"[^"]+"|\/[^\/]+\/[a-z]*/g)
    .map(s => s.replace(/"/g, ''));

  options.allowWords = options.allowWords.split(' ')
    .map(s => s.trim())
    .filter(s => s);

  localStorage.setItem(
    'twitch-cleaner-options',
    JSON.stringify(options));
}