// ==UserScript==
// @name           Live Stream Chat Users (Mentions & Search)
// @name:ru        Пользователи в чате стрима (упоминания и поиск)
// @namespace      https://greasyfork.org/en/users/830433-vintprox
// @description    Minimalistic userscript that allows you to mention any user in chat by one click on their name or to search for their channel by double or middle click.
// @description:ru Минималистичный пользовательский скрипт, который позволяет упомянуть пользователя в чате при одном лишь клику по его имени, а также производить поиск канала при двойном клике или колёсиком.
// @version        1.1.1
// @icon           https://i.postimg.cc/mkQB9T7G/youtube-mentions-userscript.png
// @license        MIT
// @author         vintprox
// @match          https://www.youtube.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/437911/Live%20Stream%20Chat%20Users%20%28Mentions%20%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437911/Live%20Stream%20Chat%20Users%20%28Mentions%20%20Search%29.meta.js
// ==/UserScript==

(function() {
  if (location.pathname != "/live_chat") return;

  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(`
    #chat #author-name {
      cursor: pointer;
    }
    #chat #author-name:hover {
      text-decoration: underline;
    }
  `));
  document.head.appendChild(style);

  const chat = document.querySelector("#chat");
  const inputPanel = document.querySelector("#input-panel");
  let input;

  function updateInput() {
    input = inputPanel.querySelector("#input[contenteditable]");
  }
  updateInput();

  const inputPanelObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        updateInput();
      }
    });
  });
  inputPanelObserver.observe(inputPanel, { childList: true });

  function searchChannel(e) {
    if (e.target.id != "author-name") return;

    e.preventDefault();
    window.open(`https://www.youtube.com/results?search_query="${encodeURI(e.target.innerText)}"&sp=CAASAhAC`);
  }

  chat.addEventListener("click", function (e) {
    if (e.detail > 1) return;
    if (e.target.id != "author-name") return;

    const mention = `@${e.target.innerText}\xa0`;
    input.innerText = mention + input.innerText;
    input.dispatchEvent(new Event("input"));
    setTimeout(() => {
      input.click();
      input.focus();
    }, 150);

    const range = document.createRange();
    range.setStart(input, 1);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  chat.addEventListener("dblclick", searchChannel.bind(chat));
  chat.addEventListener("auxclick", searchChannel.bind(chat));
})();
