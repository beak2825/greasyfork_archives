// ==UserScript==
// @name        chatgpt-rtl-toggle
// @namespace   Violentmonkey Scripts
// @match       *://*.chatgpt.com/*
// @match       *://*.openai.com/*
// @grant       none
// @version     1.1
// @author      -
// @description enabling RTL (Right-To-Left) text direction toggle 
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528005/chatgpt-rtl-toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/528005/chatgpt-rtl-toggle.meta.js
// ==/UserScript==
//
// chrome extention: https://chromewebstore.google.com/detail/chatgpt-rtl/cnhikhicflgjbfnllpmbbdpjcfmfnkii

if (!document.getElementById("RTL")) {
  const style = document.createElement("style");
  style.id = "RTL";
  style.innerHTML = `
            #rtlButton {
                transition: .15s;
                cursor: pointer;
            }
            main.rtl #rtlButton {
                transform: rotateY(180deg);
            }
            code, pre {
                direction: ltr;
                text-align: left;
            }
            main form textarea#prompt-textarea {
                padding-right: 96px;
            }
            [class^="react-scroll-to-bottom--css-"] {
                height: 100%;
                overflow-y: auto;
            }
            main.rtl p,
            main.rtl textarea {
                direction: rtl;
            }
            main.rtl .overflow-x-auto {
                overflow-x: unset;
                direction: rtl;
            }
            main.rtl .markdown ul,
            main.rtl .markdown ol {
                padding-left: unset;
                padding-right: 0;
                direction: rtl;
            }
            main.rtl .prose :where(ul):not(:where([class~="not-prose"] *)),
            main.rtl .prose :where(ol):not(:where([class~="not-prose"] *)) {
                padding-left: unset;
                padding-right: 1.625em;
            }
            main.rtl .markdown ul>li::before,
            main.rtl .markdown ol>li::before {
                --tw-translate-x: 100%;
                padding-right: unset;
                padding-left: .5rem;
            }
            main.rtl .prose :where(ul > li):not(:where([class~="not-prose"] *)),
            main.rtl .prose :where(ol > li):not(:where([class~="not-prose"] *)) {
                padding-right: .375em;
                padding-left: unset;
            }
        `;
  document.head.appendChild(style);
}

function addRTLButton(textarea) {
  if (!document.getElementById("rtlButton")) {
    document.querySelector("main").classList.add("rtl");
    const rtlButton = document.createElement("div");
    rtlButton.id = "rtlButton";
    rtlButton.className = "mb-1 me-1";
    rtlButton.innerHTML = `
                <div class="relative">
                    <div class="relative">
                        <div class="flex flex-col">
                            <span class="flex" data-state="closed">
                                <div aria-disabled="false" aria-label="Attach files" class="flex items-center justify-center h-8 w-8 rounded-lg rounded-bl-xl text-token-text-primary dark:text-white focus-visible:outline-black dark:focus-visible:outline-white hover:bg-black/10">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 6H17 M7 10H13 M7 14H17 M7 18H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            `;
    textarea.parentElement.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.appendChild(
      rtlButton
    );
    rtlButton.addEventListener("click", () =>
      document.querySelector("main").classList.toggle("rtl")
    );
  }
}

const observer = new MutationObserver(() => {
  const textarea = document.querySelector("main form textarea");
  if (textarea) {
    addRTLButton(textarea);
    // observer.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});



//chrome extention: https://chromewebstore.google.com/detail/chatgpt-rtl/cnhikhicflgjbfnllpmbbdpjcfmfnkii
