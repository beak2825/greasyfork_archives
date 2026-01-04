// ==UserScript==
// @name         Alphaxiv Assistant Enhancer
// @namespace    https://github.com/kagani
// @version      1.0
// @description  Copy and download buttons for Alphaxiv Assistant.
// @author       Kagan Ilbak
// @match        https://www.alphaxiv.org/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MTguNDEgNTA0LjQ3IiB3aWR0aD0iNzE4LjQxIiBoZWlnaHQ9IjUwNC40NyIgY2xhc3M9InRleHQtY3VzdG9tLXJlZCBzaXplLThoIGRhcms6dGV4dC13aGl0ZSIgZGF0YS1zZW50cnktZWxlbWVudD0ic3ZnIiBkYXRhLXNlbnRyeS1zb3VyY2UtZmlsZT0iQWxwaFhpdkxvZ28udHN4IiBkYXRhLXNlbnRyeS1jb21wb25lbnQ9IkFscGhhWGl2TG9nbyI+PHBvbHlnb24gZmlsbD0iY3VycmVudENvbG9yIiBwb2ludHM9IjU5MS4xNSAgMjU4LjU0IDcxOC40MSAzODUuNzMgNjYzLjcyIDQ0MC4yOCA1MzYuNTcgMzEzLjYyIDU5MS4xNSAyNTguNTQiIGRhdGEtc2VudHlyLWVsZW1lbnQ9InBvbHlnb24iIGRhdGEtc2VudHktc291cmNlLWZpbGU9IkFscGhhWGl2TG9nby50c3giPjwvcG9seWdvbj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yNzMuODYuM2MzNC41Ni0yLjQxLDY3LjY2LDkuNzMsOTIuNTEsMzMuNTRsOTQuNjQsOTQuNjMtNTUuMTEsNTQuNTUtOTYuNzYtOTYuNTVjLTE2LjAyLTEyLjctMzcuNjctMTIuMS01My4xOSwxLjExTDU0LjYyLDI4OC44MiwwLDIzNC4yMywyMDQuNzYsMjkuNTdDMjIzLjEyLDEzLjMxLDI0OS4yNywyLjAyLDI3My44Ni4zWiIgZGF0YS1zZW50cnktZWxlbWVudD0icGF0aCIgZGF0YS1zZW50cnktc291cmNlLWZpbGU9IkFscGhhWGl2TG9nby50c3giPjwvcGF0aD48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik02NjMuNzksMS4yOWw1NC42Miw1NC41OC00MTguMTEsNDE3LjljLTExNC40Myw5NS45NC0yNjMuNTctNTMuNDktMTY3LjA1LTE2Ny41MmwxNjAuNDYtMTYwLjMzLDU0LjYyLDU0LjU4LTE1Ny44OCwxNTcuNzdjLTMzLjE3LDQwLjMyLDE4LjkzLDkxLjQxLDU4LjY2LDU3LjQ4TDY2My43OSwxLjI5WiIgZGF0YS1zZW50cnktZWxlbWVudD0icGF0aCIgZGF0YS1zZW50cnktc291cmNlLWZpbGU9IkFscGhhWGl2TG9nby50c3giPjwvcGF0aD48L3N2Zz4=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538221/Alphaxiv%20Assistant%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538221/Alphaxiv%20Assistant%20Enhancer.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
  style.textContent = `
    .__msg-wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.75em;
    }
    .__msg-btn-container {
      display: flex;
      gap: 8px;
      align-self: flex-start;
      margin-top: 4px;
    }
    .__msg-copy-btn,
    .__msg-download-btn {
      background: transparent;
      border: none;
      padding: 4px;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }
    .__msg-copy-btn:hover,
    .__msg-download-btn:hover {
      opacity: 1;
    }
    .__msg-copy-btn svg,
    .__msg-download-btn svg {
      width: 1rem;
      height: 1rem;
      fill: currentColor;
    }
    .__msg-copied-indicator {
      align-self: flex-start;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      font-size: 0.75rem;
      padding: 2px 6px;
      border-radius: 3px;
      opacity: 0;
      transition: opacity 0.2s ease;
      margin-top: 4px;
    }
    .__msg-copied-indicator.show {
      opacity: 1;
    }

    .__code-wrapper {
      position: relative;
      margin-bottom: 1em;
    }
    .__copy-container {
      position: sticky;
      top: 0.25rem;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      background: inherit;
    }
    .__code-wrapper > pre {
      margin-top: -2.5rem;
      padding-top: 1rem;
      overflow: auto;
    }
    .__copy-btn {
      margin-right: 0.5rem;
      margin-bottom: 0.25rem;
      background: #444;
      color: #fff;
      border: none;
      border-radius: 3px;
      padding: 0.25em 0.6em;
      font-size: 0.8em;
      cursor: pointer;
      opacity: 0.75;
      transition: opacity 0.2s ease;
    }
    .__copy-btn:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  const copyIconSVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z"/>
    </svg>`;
  const downloadIconSVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 2a1 1 0 011 1v8.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a.997.997 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 11.586V3a1 1 0 011-1zM5 16a1 1 0 011 1v3a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 112 0v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3a1 1 0 011-1z"/>
    </svg>`;
  const checkmarkSVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M18.0633 5.67387C18.5196 5.98499 18.6374 6.60712 18.3262 7.06343L10.8262 18.0634C10.6585 18.3095 10.3898 18.4679 10.0934 18.4957C9.79688 18.5235 9.50345 18.4178 9.29289 18.2072L4.79289 13.7072C4.40237 13.3167 4.40237 12.6835 4.79289 12.293C5.18342 11.9025 5.81658 11.9025 6.20711 12.293L9.85368 15.9396L16.6738 5.93676C16.9849 5.48045 17.607 5.36275 18.0633 5.67387Z"
            fill="currentColor"/>
    </svg>`;

  function wrapMessage(el) {
    if (el.parentElement.classList.contains('__msg-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('__msg-wrapper');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    const markdownContainer = el.querySelector('.markdown-content');
    const textContent = markdownContainer ? null : el.innerText;

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('__msg-btn-container');
    wrapper.appendChild(btnContainer);

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('__msg-copy-btn');
    copyBtn.innerHTML = copyIconSVG;
    btnContainer.appendChild(copyBtn);

    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('__msg-download-btn');
    downloadBtn.innerHTML = downloadIconSVG;
    btnContainer.appendChild(downloadBtn);

    const originalCopyHTML = copyIconSVG;
    const originalDownloadHTML = downloadIconSVG;

    copyBtn.addEventListener('click', async () => {
      try {
        const toCopy = markdownContainer
          ? markdownContainer.innerText
          : textContent;
        await navigator.clipboard.writeText(toCopy);
        copyBtn.innerHTML = checkmarkSVG;
        setTimeout(() => {
          copyBtn.innerHTML = originalCopyHTML;
        }, 1200);
      } catch {
      }
    });

    downloadBtn.addEventListener('click', () => {
      const toDownload = markdownContainer
        ? markdownContainer.innerText
        : textContent;
      const blob = new Blob([toDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = Date.now();
      a.download = `message_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      downloadBtn.innerHTML = checkmarkSVG;
      setTimeout(() => {
        downloadBtn.innerHTML = originalDownloadHTML;
      }, 1200);
    });
  }

  function processMessages() {
    document.querySelectorAll('[data-sentry-component="ChatMessage"]').forEach(wrapMessage);
  }

  function addStickyCopyButtons() {
    document.querySelectorAll('pre > code').forEach((codeEl) => {
      if (codeEl.closest('.__code-wrapper')) return;
      const preEl = codeEl.parentElement;
      const wrapper = document.createElement('div');
      wrapper.classList.add('__code-wrapper');
      preEl.parentNode.insertBefore(wrapper, preEl);
      const copyContainer = document.createElement('div');
      copyContainer.classList.add('__copy-container');
      const btn = document.createElement('button');
      btn.classList.add('__copy-btn');
      btn.innerText = 'Copy';
      copyContainer.appendChild(btn);
      wrapper.appendChild(copyContainer);
      wrapper.appendChild(preEl);
      btn.addEventListener('click', async () => {
        const text = codeEl.innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.innerText = 'Copied!';
          setTimeout(() => { btn.innerText = 'Copy'; }, 1200);
        } catch {
          btn.innerText = 'Error';
          setTimeout(() => { btn.innerText = 'Copy'; }, 1200);
        }
      });
    });
  }

  processMessages();
  addStickyCopyButtons();

  const observer = new MutationObserver(() => {
    processMessages();
    addStickyCopyButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
