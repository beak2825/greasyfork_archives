// ==UserScript==
// @name         Phrase.com Display Special Characters under TextArea
// @namespace    https://github.com/AndreasMattsson
// @version      0.2
// @description  Show characters in textareas on app.phrase.com
// @author       Andreas Mattsson
// @include      /^https?\:\/\/app\.phrase\.com\/editor/v4\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439516/Phrasecom%20Display%20Special%20Characters%20under%20TextArea.user.js
// @updateURL https://update.greasyfork.org/scripts/439516/Phrasecom%20Display%20Special%20Characters%20under%20TextArea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let head = document.getElementsByTagName('head')[0];
    if (head) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        ul.textareaChars {
            display: block;
            list-style: none;
            padding-left: 0;
            margin-top: 0.2em;
            margin-bottom: 0.2em;
            user-select: none;
        }
        li.textareaChar {
            display: inline-block;
            font-family: monospace;
            font-size: 0.75em;
            padding: 0em 0.25em 0em 0.25em;
            margin-right: 0.1em;
            border: 1px solid #d0d0d0;
            border-radius: 1em;
            background: #efefef;
        }
        li.textareaCharNotBasic {
            font-weight: bold;
        }
        li.textareaCharIsSpace {
            background: #d0d0d0;
        }
        li.textareaCharIsSpace.textareaCharSelected {
            background: #00619a;
        }
        li.textareaCharSelected {
            background: #0091eb;
            border: 1px solid #0091eb;
            color: #fff;
        }
`;
        head.appendChild(style);
    }


let idCounter = 0;
const getId = (element, setId) => {
  let id = element.id || (element.dataset && element.dataset.autoId);
  if (!id && setId) {
    id = "phrase-special-chars-text-area-" + idCounter++;
    element.dataset.autoId = id;
  }
  return id;
};

let NAMES = [];
let dontObserve = false;
const checkTextarea = (targetElement, removed) => {
    let id = getId(targetElement);
    dontObserve = true;
	let element = targetElement && targetElement.tagName && targetElement.tagName.toUpperCase() == "TEXTAREA" && targetElement;
    if (!element) {
        element = document.activeElement && document.activeElement.tagName.toUpperCase() == "TEXTAREA" && document.activeElement;
    }
	if (element && element.tagName.toUpperCase() == "TEXTAREA" && id) {
		const text = element.value;
		const companionId = `${id}-companion`;
		let companion = document.getElementById(companionId);
		if (!companion && !removed) {
			companion = document.createElement("ul");
            companion.classList.add("textareaChars");
			companion.id = companionId;
            if (element.parentNode && element.parentNode.parentNode) {
                if (element.parentNode.parentNode.nextSibling) {
                    element.parentNode.parentNode.parentNode.insertBefore(companion, element.parentNode.parentNode.nextSibling);
                } else {
                    element.parentNode.parentNode.parentNode.appendChild(companion);
                }
            }
		} else if (removed && companion.parentNode) {
            companion.parentNode.removeChild(companion);
        }
        const selection = `${element.selectionStart}-${element.selectionEnd}`;
        if (!removed && (element.getAttribute('data-lasttext') != text || element.getAttribute('data-lastselection') != selection)) {
            element.setAttribute('data-lasttext', text);
            element.setAttribute('data-lastselection', selection);
            companion.textContent = '';
            for (let i = 0; i < text.length; i++) {
                const char = text.charAt(i);
                let code = ('0000' + char.charCodeAt(0).toString(16).toUpperCase()).slice(-4);
                const isNormalSpace = code == "0020";
                const isNormalReturn = code == "000A";
                const isBasic = char.match(/[A-Za-z0-9]/g) || isNormalSpace;
                const node = document.createElement("li");
                node.textContent = isNormalSpace ? "\xa0" : (isNormalReturn ? "\xb6" : (isBasic ? char : code));
                node.classList.add("textareaChar");
                if (i >= element.selectionStart && i < element.selectionEnd) {
                    node.classList.add("textareaCharSelected");
                }
                if (!isBasic) {
                    node.classList.add("textareaCharNotBasic");
                    if (NAMES[code] != undefined) {
                        node.setAttribute("title", `${code}: ${NAMES[code]}`);
                    } else {
                        node.setAttribute("title", `${code}: "${char}"`);
                    }
                }
                if (char.match(/\s|[\u200B-\u200D\uFEFF]/g)) {
                    node.classList.add("textareaCharIsSpace");
                }
                companion.appendChild(node);
            }
        }
	}
    dontObserve = false;
};
document.addEventListener("selectionchange", () => {
    document.querySelectorAll("textarea").forEach((element) => checkTextarea(element));
});
document.querySelectorAll("textarea").forEach((x) => x.addEventListener("input", checkTextarea));
fetch("https://cdn.jsdelivr.net/npm/readable-glyph-names@1.1.0/dist/names.json").then(res => res.json()).then(value => { NAMES = value; checkTextarea(); });

const observer = new MutationObserver((mutations, observer) => {
  if (dontObserve) {
      return;
  }
  document.querySelectorAll("textarea").forEach((element) => {
      let id = getId(element, true);
      const changed = element.getAttribute('data-lasttext') != element.value;
      const companionId = `${id}-companion`;
      const isNew = !document.getElementById(companionId);
      if (isNew) {
          element.addEventListener("selectionchange", checkTextarea);
          element.addEventListener("input", checkTextarea);
          const observer = new MutationObserver((mutations) => {
              for (let m = 0; m < mutations.length; m++) {
                  const mutation = mutations[m];
                  const nodes = Array.from(mutation.removedNodes);
                  const directMatch = nodes.indexOf(element) > -1;
                  const parentMatch = nodes.some(parent => parent.contains(element));
                  if (directMatch || parentMatch) {
                      observer.disconnect();
                      checkTextarea(element, true);
                  }
              }
          });

          observer.observe(document.body, {subtree: true, childList: true});
      }
      if (changed) {
          checkTextarea(element);
          setTimeout(() => checkTextarea(element), 500);
          setTimeout(() => checkTextarea(element), 1000);
          setTimeout(() => checkTextarea(element), 2000);
      }
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

})();