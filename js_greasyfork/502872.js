// ==UserScript==
// @name         ReverseMarshMallows
// @namespace    https://github.com/aplysia56108/ReverseMarshMallows
// @version      1.1
// @description  マシュマロを逆順にするボタンを追加。また、クリックしたときに別windowでマシュマロを開くボタンを追加する。
// @author       aplysia56108
// @license      MIT
// @match        https://marshmallow-qa.com/messages*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502872/ReverseMarshMallows.user.js
// @updateURL https://update.greasyfork.org/scripts/502872/ReverseMarshMallows.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const putLinkBtn = () => {
    const messages = document.getElementById("messages");

    const tmpList = [];
    while (messages.firstChild) {
      const child = messages.firstChild;
      if (child.tagName == "LI") tmpList.push(child);
      messages.removeChild(child);
    }
    for (let i = 0; i < tmpList.length; i++) {
      const child = tmpList[i];
      messages.appendChild(child);
    }

    const linkList = messages.getElementsByClassName("text-zinc-900");

    for (let i = 0; i < tmpList.length; i++) {
      if (messages.children[i].firstChild.id == "linkBtn") continue;

      const LinkBtn = document.createElement("a");
      LinkBtn.id = "linkBtn";
      LinkBtn.innerHTML = "<br>別タブで開く</br>";
      LinkBtn.style.width = "100px";
      LinkBtn.style.height = "30px";
      LinkBtn.style.zIndex = "99824433";
      LinkBtn.href = linkList[i].href;
      LinkBtn.target = "_blank";
      messages.children[i].prepend(LinkBtn);
    }
  };

  putLinkBtn();

  const reverseBtn = document.createElement("button");
  document.querySelector("main").prepend(reverseBtn);
  const BtnMessages = ["正順", "逆順"];
  let isReversed = 0;
  reverseBtn.textContent = BtnMessages[isReversed];
  reverseBtn.type = "button";
  reverseBtn.style.width = "100px";
  reverseBtn.style.height = "30px";
  reverseBtn.style.zIndex = "99824433";
  reverseBtn.style.backgroundColor = "white";

  reverseBtn.addEventListener("click", () => {
    isReversed ^= 1;
    reverseBtn.textContent = BtnMessages[isReversed];

    const messages = document.getElementById("messages");

    const tmpList = [];
    while (messages.firstChild) {
      const child = messages.firstChild;
      if (child.tagName == "LI") tmpList.push(child);
      messages.removeChild(child);
    }

    tmpList.reverse();
    for (let i = 0; i < tmpList.length; i++) {
      const child = tmpList[i];
      messages.appendChild(child);
    }

    putLinkBtn();
  });
})();
