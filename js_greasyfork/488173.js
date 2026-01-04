// ==UserScript==
// @name        Copy word list - vocabulary.com
// @namespace   Violentmonkey Scripts
// @match       https://www.vocabulary.com/lists/*
// @grant       GM_addStyle
// @version     1.0
// @author      skygate2012
// @run-at      document-end
// @description Copy the list of words as plain text
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/488173/Copy%20word%20list%20-%20vocabularycom.user.js
// @updateURL https://update.greasyfork.org/scripts/488173/Copy%20word%20list%20-%20vocabularycom.meta.js
// ==/UserScript==

const wordList = document.querySelector("#wordlist");

const copyButton = document.createElement("button");
copyButton.textContent = "Copy List";

copyButton.addEventListener("click", () => {
    const listItems = Array.from(wordList.children);
    const listString = listItems.reduce((str, el) => str += el.getAttribute("word") + "\n", "");

    navigator.clipboard.writeText(listString)
        .then(() => {
            toast("Word list copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy list: ", err);
        });
});

document.querySelector(".wordlist > .header").appendChild(copyButton);

function toast(message) {
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toastContainer.removeChild(toast);
            if (toastContainer.childElementCount === 0) {
                document.body.removeChild(toastContainer);
            }
        }, 300);
    }, 2000);
}

GM_addStyle(`
  /* Toast container */
  .toast-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
  }

  /* Toast notification */
  .toast {
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  /* Show the toast notification */
  .toast.show {
    opacity: 1;
  }
`);