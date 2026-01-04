// ==UserScript==
// @name        Blindtest sync-tube.de
// @namespace   Violentmonkey Scripts
// @match       https://sync-tube.de/*
// @grant       none
// @version     1.2.1
// @author      Duki
// @description Modifie sync-tube.de pour permettre de réaliser des blind tests
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521211/Blindtest%20sync-tubede.user.js
// @updateURL https://update.greasyfork.org/scripts/521211/Blindtest%20sync-tubede.meta.js
// ==/UserScript==

const playerStyle = document.createElement('STYLE');
playerStyle.innerText = `
  .playlist, .player-wrapper, .player-wrapper .controls, .duki_btn, .duki_btn_wide {
    display: none !important;
  }
`;
const style = document.createElement('STYLE');
style.innerText = `
  .hidden {
    display: none !important;
  }

  .player {
    max-height: 444px;
    aspect-ratio: 16 / 9;
    width: auto !important;
  }

  .scoreboard {
    font-size: 130%;
  }

  .scoreboard li.innactive {
    // opacity: 0.5;
  }

  .scoreboard li {
    margin-bottom: 5px;
  }

  .scoreboard .display {
    padding: 0 15px 0 5px;
  }

  .duki_btn, .duki_btn_wide {
    filter: grayscale(100%);
    transform: scale(1.1);
    cursor: pointer;
    display: inline;
  }
  .duki_btn:hover, .duki_btn_wide:hover {
    filter: grayscale(0%);
  }

  .duki_btn_wide {
    background-color: #5195ec;
    padding: 0px 5px;
    border-radius: 3px;
    margin: 0 4px;
    transform: scale(1.1, 0.9);
    box-shadow: inset 0 0 2px 1px #0004;
    position: relative;
    bottom: 0;
  }
`;
document.querySelector('head').appendChild(playerStyle);
document.querySelector('head').appendChild(style);

const adminColor = "rgb(179, 39, 39)";
let selfGroup = null;
let selfIsAdmin = false;
let admin = "";
let scoreboard = null;

let users = {};

const interval = window.setInterval(() => {
  selfGroup = document.querySelector('.self ~ .group');
  if (selfGroup) {
    clearInterval(interval);
    initialize();
  }
}, 1000);

function initialize() {
  selfIsAdmin = selfGroup.style.backgroundColor === adminColor;
  if(selfIsAdmin) {
    playerStyle.remove();
    const storedUsers = localStorage.getItem(window.location.href);
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
  }

  cleanChat();

  setupDOM();
  setupProxy();
  setupUsers();
  setupUserObserver();
  setupChatObserver();

  sayHello();
}

function cleanChat() {
  const messages = document.querySelectorAll('.message');
  messages.forEach(message => {
    const content = message.querySelector('span:last-of-type').textContent;
    if (content.substring(0, 2) === "##") {
      message.remove();
    }
  });
}

function setupDOM() {
  scoreboard = document.createElement('UL');
  scoreboard.classList.add('scoreboard');
  document.querySelector('.media-wrapper').appendChild(scoreboard);
}

function addToScoreboard(user) {
  const el = document.createElement('LI');
  if (!user.active) {
    el.classList.add('innactive');
  }

  const delBtn = document.createElement('BUTTON');
  delBtn.classList.add('duki_btn');
  delBtn.textContent = "🚮";
  el.appendChild(delBtn);
  delBtn.addEventListener('click', () => {removeUser(user.name)});

  const resetBtn = document.createElement('BUTTON');
  resetBtn.classList.add('duki_btn');
  resetBtn.textContent = "🔄";
  el.appendChild(resetBtn);
  resetBtn.addEventListener('click', () => {shareScore(user.name, 0)})

  const display = document.createElement('SPAN');
  display.classList.add('display');
  display.textContent = `${user.name}: ${user.score}`;
  el.appendChild(display);

  const minusBtn = document.createElement('BUTTON');
  minusBtn.classList.add('duki_btn_wide');
  minusBtn.textContent = "⬇";
  minusBtn.style.backgroundColor = "#ec5151";
  el.appendChild(minusBtn);
  minusBtn.addEventListener('click', () => {shareScore(user.name, --user.score)})

  const plusBtn = document.createElement('BUTTON');
  plusBtn.classList.add('duki_btn_wide');
  plusBtn.textContent = "⬆";
  plusBtn.style.backgroundColor = "#31bc51";
  el.appendChild(plusBtn);
  plusBtn.addEventListener('click', () => {shareScore(user.name, ++user.score)})

  scoreboard.appendChild(el);
  user.element = el;
}

function removeUser(username) {
  const user = users[username.toLowerCase()];
  user.element.remove();
  delete users[username.toLowerCase()];
  localStorage.setItem(window.location.href, JSON.stringify(users));

  const textarea = document.querySelector('.input textarea');
  textarea.value = `##del ${username}`;
  textarea.dispatchEvent(new Event('input'));
  textarea.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
  }));
}

function setupUsers() {
  for (_user in users) {
    const user = users[_user];
    addToScoreboard(user);
    user.active = isActive(user.name);
  }

  const userEls = document.querySelectorAll('.user');
  userEls.forEach(userEl => {
    const username = userEl.querySelector('span').textContent.trim();
    if (!users[username.toLowerCase()]) {
      users[username.toLowerCase()] = {
        'name' : username,
        'role' : isAdmin(username) ? "host" : "player",
        'score' : 0,
        'active' : isActive(username),
      };
    }
  });
}

function setupProxy() {
  const handler = {
    set(target, property, value) {
      if (typeof value === 'object' && value !== null && !(value instanceof HTMLElement)) {
        // new user
        addToScoreboard(value);

        value = new Proxy(value, handler);
        target[property] = value;
      }
      else {
        // existing user
        target[property] = value;
        switch(property) {
          case 'name':
          case 'score':

            target.element.querySelector('.display').textContent = `${target.name}: ${target.score}`;
            break;
          case 'active':
            if (value) {
              target.element.classList.remove('innactive');
            } else {
              target.element.classList.add('innactive');
            }
            break;
        }
      }

      if(selfIsAdmin) {
        localStorage.setItem(window.location.href, JSON.stringify(users));
      }

      return true;
    },

    get(target, property) {
      if (typeof target[property] === 'object' && target[property] !== null && !(target[property] instanceof HTMLElement)) {
        return new Proxy(target[property], handler);
      }
      return property in target ? target[property] : undefined;
    }
  };

  users = new Proxy(users, handler);
}


function setupChatObserver() {
  const chatContainer = document.querySelector('.chat');

  const chatObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.classList && node.classList.contains('message') && !node.classList.contains('log-move')) {
          const author = node.querySelector('.name').textContent;
          let message = node.querySelector('span:last-of-type').textContent.trim();

          if (selfIsAdmin && message === "##hello") {
            users[author.trim().toLowerCase()].saidHello = true;
            setupScore();
          }

          if(isAdmin(author)) {
            if (message.substring(0, 5) === "##del") {
              node.remove();
              const username = message.replace("##del", '').trim();
              users[username.toLowerCase()].element.remove();
              return;
            }

            if (message.substring(0, 2) === "##") {
              node.remove();
              message = message.substring(2);
            }

            const regex = /([+-]\d+)/; // Match "+x" or "-x" where x is a number
            const match = message.match(regex);

            if (match) {
              const score = match[0];
              const username = message.replace(score, '').trim();

              if (!users[username.toLowerCase()]) {
                users[username.toLowerCase()] = {
                  'name' : username,
                  'role' : isAdmin(username) ? "host" : "player",
                  'active' : isActive(username),
                };
              }
              users[username.toLowerCase()].score = parseInt(score);
            }
          }
        }
      });
    });
  });

  chatObserver.observe(chatContainer, {
    childList: true,
    subtree: true
  });
}


function setupUserObserver() {
  const userObserver = new MutationObserver(mutations => {
    let newName = "";

    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {

        if (node.nodeType === Node.TEXT_NODE) {
          newName = node.nodeValue;
        }

        if (node.classList && node.classList.contains('user') && !node.classList.contains('list-move')) {
          const username = node.querySelector('span').textContent;
          if(!users[username.toLowerCase()]) {
             users[username.toLowerCase()] = {
              'name' : username,
              'role' : isAdmin(username) ? "host" : "player",
              'score' : 0,
              'active' : isActive(username),
            };
          } else {
            users[username.toLowerCase()].active = true;
          }

          setTimeout(() => {
            if(users[username.toLowerCase()].active && !users[username.toLowerCase()].saidHello) {
                const textarea = document.querySelector('.input textarea');
                textarea.value = `Oh non, ${username} n'a pas le plugin :(`;
                textarea.dispatchEvent(new Event('input'));
                textarea.dispatchEvent(new KeyboardEvent('keydown', {
                  key: 'Enter',
                  code: 'Enter',
                }));
            }
          }, 2000);
        }
      });


      mutation.removedNodes.forEach(node => {
        if(node.nodeType === Node.TEXT_NODE) {
          let oldName = node.nodeValue;

          if (oldName !== newName) {
            oldName = oldName.trim();
            newName = newName.trim();

            const oldUser = users[oldName.toLowerCase()];
            oldUser.element.remove();

            users[newName.toLowerCase()] = oldUser;
            users[newName.toLowerCase()].name = newName;
            delete oldUser;
          }
        }

        if (node.classList && node.classList.contains('user') && !node.classList.contains('list-move')) {
          const username = node.querySelector('span').textContent;
          users[username.toLowerCase()].active = false;
          users[username.toLowerCase()].saidHello = false;
        }
      });
    });
  });

  const userList = document.querySelector('.user-list');
  userObserver.observe(userList, {
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: true
  });
}

function shareScore(user, score) {
  const textarea = document.querySelector('.input textarea');
  textarea.value = `##${user} ${score >= 0 ? '+' + score : score}`;
  textarea.dispatchEvent(new Event('input'));
  textarea.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
  }));
}

function setupScore() {
  for (_user in users) {
    const user = users[_user];
    shareScore(user.name, user.score);
  }
}

function sayHello() {
    const textarea = document.querySelector('.input textarea');
    textarea.value = "##hello";
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
    }));
}

function isAdmin(username) {
  if (username === admin) {
    return true;
  }

  let result = false;
  const groups = document.querySelectorAll('.group');
  groups.forEach(group => {
    if (group.style.backgroundColor === adminColor) {
      const user = group.parentElement.querySelector('span').textContent;
      if (user === username) {
        result = true;
        admin = username;
        return;
      }
    }
  });
  return result;
}

function isActive(username) {
  let result = false;
  const userEls = document.querySelectorAll('.user');
  userEls.forEach(userEl => {
    if (userEl.querySelector('span').textContent === username) {
      result = true;
      return;
    }
  });
  return result;
}