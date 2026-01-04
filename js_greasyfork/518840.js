// ==UserScript==
// @name         JVC DDB Tracker
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Tracks the status of reported messages on Jeuxvideo.com.
// @author       HulkDu92
// @match        https://www.jeuxvideo.com/forums/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @connect      jeuxvideo.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518840/JVC%20DDB%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/518840/JVC%20DDB%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const style = document.createElement('style');
style.innerHTML = `
    :root {
        --moderated-color: #90ee90;
        --in-progress-color: #e64d4d;
    }
    /* ... other styles ... */
`;

    class MessageTracker {
      constructor() {
          this.trackedMessages = new Map();

          this.svgModerated = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 .44l10 3.5V12c0 4.127-2.534 7.012-4.896 8.803a19.744 19.744 0 0 1-4.65 2.595a6.99 6.99 0 0 1-.087.033l-.025.009l-.007.002l-.003.001c-.001 0-.002 0-.332-.943l-.331.944h-.001l-.003-.002l-.007-.002l-.025-.01a12.165 12.165 0 0 1-.398-.155a19.749 19.749 0 0 1-4.34-2.473C4.535 19.013 2 16.128 2 12.001V3.94l10-3.5Zm0 22.06l-.331.944l.331.116l.331-.116L12 22.5Zm0-1.072l.009-.004a17.755 17.755 0 0 0 3.887-2.215C18.034 17.59 20 15.223 20 12V5.36l-8-2.8l-8 2.8V12c0 3.223 1.966 5.588 4.104 7.21A17.75 17.75 0 0 0 12 21.427Zm6.072-13.085l-7.071 7.071l-4.243-4.242l1.415-1.415L11 12.586l5.657-5.657l1.414 1.414Z"/>
          </svg>`;
          this.svgInProgress = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><ellipse cx="8.828" cy="18" fill="#F5F8FA" rx="7.953" ry="13.281"/><path fill="#E1E8ED" d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969S17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18S12.8 5.469 8.828 5.469z"/><circle cx="6.594" cy="18" r="4.96" fill="#8899A6"/><circle cx="6.594" cy="18" r="3.565" fill="#292F33"/><circle cx="7.911" cy="15.443" r="1.426" fill="#F5F8FA"/><ellipse cx="27.234" cy="18" rx="7.953" ry="13.281" fill="#F5F8FA"/><path fill="#E1E8ED" d="M27.234 32.031c-4.88 0-8.703-6.163-8.703-14.031s3.823-14.031 8.703-14.031S35.938 10.132 35.938 18s-3.824 14.031-8.704 14.031zm0-26.562c-3.972 0-7.203 5.622-7.203 12.531c0 6.91 3.231 12.531 7.203 12.531S34.438 24.91 34.438 18S31.206 5.469 27.234 5.469z"/><circle cx="25" cy="18" r="4.96" fill="#8899A6"/><circle cx="25" cy="18" r="3.565" fill="#292F33"/><circle cx="26.317" cy="15.443" r="1.426" fill="#F5F8FA"/></svg>`;

          this.initStyles();
          this.processMessages();
      }

      initStyles() {
          const style = document.createElement('style');
          style.innerHTML = `
              .bloc-options-msg {
                  display: flex;
                  align-items: top; /* Alignement centré */
                  justify-content: flex-start;
              }

              .signalement-tag {
                  display: flex; /* Flexbox pour l'alignement */
                  align-items: center; /* Aligne verticalement comme les autres boutons */
                  justify-content: center;
                  width: 18px; /* Taille ajustée selon les autres boutons */
                  height: 18px;
                  cursor: pointer; /* Pour un comportement similaire aux autres boutons */
              }

              .signalement-tag svg {
                  width: 100%; /* Pour que le SVG occupe tout l'espace du conteneur */
                  height: 100%;
              }
          `;
          document.head.appendChild(style);
      }


      updateMessageStatus(messageId, status) {
          this.trackedMessages.set(messageId, status);
          this.updateMessageTag(messageId);
      }

    updateMessageTag(messageId) {
      const messageDiv = document.querySelector(`.bloc-message-forum[data-id="${messageId}"]`);
      if (!messageDiv) return;

      let tag = messageDiv.querySelector('.signalement-tag');
      const optionsBlock = messageDiv.querySelector('.bloc-options-msg');

      if (!tag) {
          tag = document.createElement('span');
          tag.classList.add('signalement-tag');
          optionsBlock.insertBefore(tag, optionsBlock.firstChild);
      }

      switch (this.trackedMessages.get(messageId)) {
          case 'inProgress':
              tag.innerHTML = this.svgInProgress;
              tag.title = "Message en cours d'examination";
              // messageDiv.style.border = "2px solid var(--in-progress-color)";
              messageDiv.style.borderLeft = "1.5px solid rgba(230, 77, 77, 0.5)";
              break;
          case 'moderated':
              tag.innerHTML = this.svgModerated;
              tag.title = "Message modéré";
              // messageDiv.style.border = "2px solid var(--moderated-color)";
              break;
          default:
              tag.remove();
      }
  }


    checkMessageStatusDesktop(messageId, signalUrl) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", signalUrl);
        xhr.onload = function () {
            const status = self.getStatusFromResponse(this); // 'this' refers to the XMLHttpRequest object
            self.updateMessageStatus(messageId, status);
        };
        xhr.onerror = function () {
            console.error("Error checking message status (desktop):", this.status, this.statusText);
            self.updateMessageStatus(messageId, 'unknown');
        };
        xhr.send();
    }

    checkOwnMessage(messageId) {
        const self = this;
        const currentUrl = window.location.href;
        const mobileUrl = currentUrl.replace("www.", "m.");

        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(mobileUrl);

        const xhr = new XMLHttpRequest();

        xhr.open("GET", proxyUrl);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {  // Check for successful response
                const parser = new DOMParser();
                console.log(xhr.response);
                //console.log(this.responseText);
                const htmlDoc = parser.parseFromString(this.responseText, 'text/html');
                const mobileMessageId = `post_${messageId}`;
                const mobileMessageDiv = htmlDoc.querySelector(`.post[id="${mobileMessageId}"]`);

                if (mobileMessageDiv) {
                    const reportLink = mobileMessageDiv.querySelector('.bloc-opt a');
                    if (reportLink) {
                        const reportUrl = "https://m.jeuxvideo.com" + reportLink.pathname + reportLink.search;
                        self.checkMessageStatusMobile(messageId, reportUrl);
                    } else {
                        self.updateMessageStatus(messageId, 'unknown');
                    }
                } else {
                    self.updateMessageStatus(messageId, 'unknown');
                }
            } else {
                console.error("Error checking own message status:", this.status, this.statusText);
                self.updateMessageStatus(messageId, 'unknown');
            }
        };
        xhr.onerror = function() {
            console.error("Error checking own message status:", this.status, this.statusText);
            self.updateMessageStatus(messageId, 'unknown');
        };
        xhr.send();
    }


    checkMessageStatusMobile(messageId, reportUrl) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", reportUrl);
        xhr.onload = function () {
            let status;
            if (this.responseText.includes('déjà été modéré par un administrateur')) {
                status = 'moderated';
            } else if (this.responseText.includes('Ce contenu a déjà été signalé')) {
                status = 'inProgress';
            } else if (this.responseText.includes('Lien incorrect')) {
                status = 'pending';
            }
            self.updateMessageStatus(messageId, status);
        };
        xhr.onerror = function () {
            console.error("Error checking message status (mobile):", this.status, this.statusText);
            self.updateMessageStatus(messageId, 'unknown');
        };
        xhr.send();
    }

    getStatusFromResponse(response) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(response.responseText, 'text/html');
        const content = htmlDoc.querySelector('.modal-generic-content');

        if (content) {
            if (content.textContent.includes('déjà été modéré')) {
                return 'moderated';
            } else if (content.textContent.includes('déjà signalé') || content.textContent.includes('déjà été signalé')) {
                return 'inProgress';
            }
        }
        return null; // ou un autre statut par défaut si nécessaire
    }


    processMessages() {
        const messages = document.querySelectorAll('.bloc-message-forum');
        const observerOptions = {
            root: null, // Observe par rapport à la fenêtre
            rootMargin: '0px',
            threshold: 0.1 // Déclenche quand 10% de l'élément est visible
        };

        // Crée un observateur pour surveiller les messages visibles
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const messageId = entry.target.dataset.id;

                    if (!this.trackedMessages.has(messageId)) { // Check if already tracked
                        this.trackedMessages.set(messageId, 'pending'); // Set initial status

                        const signalButton = entry.target.querySelector('.picto-msg-exclam');

                        if (signalButton) {
                            this.checkMessageStatusDesktop(messageId, signalButton.dataset.selector); // Desktop modal check
                        } else {
                            console.log("check ownmessage");
                            this.checkOwnMessage(messageId); // Mobile page check

                        }
                     }


                }
            });
        }, observerOptions);

        // Observe chaque message
        messages.forEach(message => this.observer.observe(message));
    }
  }


  // Instancie la classe pour démarrer le script
  new MessageTracker();


})();