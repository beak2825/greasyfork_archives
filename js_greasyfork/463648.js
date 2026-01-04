// ==UserScript==
// @name Discord Enhancements
// @description Enhance your Discord experience
// @version 5.0
// @namespace https://example.com/
// @match https://*.discord.com/*
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463648/Discord%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/463648/Discord%20Enhancements.meta.js
// ==/UserScript==

// Add 3D background
GM_addStyle(`
body {
  background: linear-gradient(45deg, #555, #000);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`);

// Add custom styles to elements
GM_addStyle(`
/* Remove top banner */
.headerWrapper-1RvfRv {
  display: none;
}

/* Make user list and chat take up full height */
.container-3baos1 {
  height: 100%;
}

.contentRegion-3nDuYy {
  height: calc(100% - 64px);
}

/* Hide server list and channels */
.sidebar-2K8pFh {
  display: none;
}
`);

// Add translation button to messages
GM_addStyle(`
.message-2qnXI6:hover .translationButton {
  display: inline-block;
}

.translationButton {
  display: none;
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: #7289da;
  border-radius: 4px;
  cursor: pointer;
}
`);

// Get API key from user
const apiKey = prompt('API Key:');

// Translate message
function translateMessage(message, callback) {
  const sourceLang = 'auto';
  const targetLang = 'en';
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${message}&source=${sourceLang}&target=${targetLang}`;
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function(response) {
      const data = JSON.parse(response.responseText);
      const translation = data.data.translations[0].translatedText;
      callback(translation);
    }
  });
}

// Add translation button to each message
const messages = document.querySelectorAll('.markup-2BOw-j');
messages.forEach(function(message) {
  const button = document.createElement('div');
  button.textContent = 'Translate';
  button.classList.add('translationButton');
  button.addEventListener('click', function() {
    const originalMessage = message.textContent;
    translateMessage(originalMessage, function(translation) {
      alert(`Translation: ${translation}`);
    });
  });
  message.appendChild(button);
});
