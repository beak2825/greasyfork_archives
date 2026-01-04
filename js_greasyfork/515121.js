// ==UserScript==
// @name             Curse detector
// @namespace        mz-curse-detector
// @description      Detect curses on MZ forum posts. Works with Spanish words only.
// @description:es   Detectar groserías en los mensajes de los foros de MZ. Solamente detecta palabras en español.
// @homepage         https://github.com/rhonaldomaster/mz-curse-detector
// @icon             https://www.managerzone.com/favicon.ico?v2
// @include          https://*managerzone.*p=forum&sub=topic*
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_xmlhttpRequest
// @version          0.4
// @copyright        GNU/GPL v3
// @author           rhonaldomaster
// @license          GPL-3.0-or-later
// @compatible       chrome
// @compatible       firefox
// @compatible       opera
// @compatible       safari
// @compatible       edge
// @downloadURL https://update.greasyfork.org/scripts/515121/Curse%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/515121/Curse%20detector.meta.js
// ==/UserScript==


// Default words in case the fetch fails
const DEFAULT_CURSE_WORDS = [
  'boba', 'bobo', 'boluda', 'bolu.da', 'boludo', 'bolu.do', 'bosta',
  'bostera', 'bostero', 'burrazo', 'burro', 'cometrava', 'cometraba',
  'concha', ' culo', 'estupida', 'estúpida', 'estupido', 'estúpido',
  'forra', 'forro', 'gil', 'gilipolla', 'gonorrea', 'hdp', 'hipocrita',
  'hipócrita', 'hijo de puta', 'hitler', 'idiota', 'imbecil', 'imbécil',
  'kkk', 'kuka', 'lacra', 'la tenés adentro', 'la tenes adentro',
  'la tenes bien adentro', 'la tenés bien adentro', 'la tenéis bien adentro',
  ' lta', 'malcogida', 'malcogido', 'mal cogida', 'mal cogido', 'malparida',
  'malparido', 'mal parida', 'mal parido', 'marica', 'marmota', 'mediocre',
  'mierda', 'miserable', 'mogolico', 'mogólico', 'montonero', 'mu ',
  'muerde almohada', 'muerdealmohada', 'negro cabeza', 'patetico', 'patético',
  'payasa', 'payaso', 'pelotuda', 'pelotudo', 'pene', 'perra', 'puta',
  'putear', 'puto', 'retrasada', 'retrasado', 'ridicula', 'ridícula',
  'ridiculo', 'ridículo', 'salame', 'sorete', 'sucio', 'subnormal',
  'tarada', 'tarado', 'tonta', 'tontaza', 'tontazo', 'tonto', 'trampa',
  'tramposa', 'tramposo', 'vende ajo', 'vendo ajo', 'verduler'
];

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'curseWordsCache';
const CACHE_TIMESTAMP = 'curseWordsTimestamp';
const CACHE_VERSION = '1.0.0';

// GitHub Pages URL where the JSON is hosted
const WORDS_JSON_URL = 'https://rhonaldomaster.github.io/mz-curse-detector/curse-words.json';

// Store the current list of curse words
let curseWords = [...DEFAULT_CURSE_WORDS];

function searchAndHighlightWord(word, textContainer) {
  const warningColor = 'var(--curseColor)';
  const originalText = textContainer.innerHTML;
  if (originalText.indexOf(`<span style="color:${warningColor};font-weight:bold;text-decoration:underline;">`) > -1) {
    return;
  }

  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  const highlightedText = originalText.replace(
    regex,
    `<span style="color:${warningColor};font-weight:bold;text-decoration:underline;">$&</span>`
  );

  if (highlightedText !== originalText) {
    textContainer.innerHTML = highlightedText;
    const editPostButton = textContainer.parentNode.querySelector('.fa-edit');
    if (editPostButton) {
      editPostButton.style.color = warningColor;
    }
  }
}

async function loadCurseWords() {
  // Try to get cached data first
  try {
    const cachedData = GM_getValue(CACHE_KEY);
    const cachedTime = GM_getValue(CACHE_TIMESTAMP);
    const cachedVersion = GM_getValue('curseWordsVersion');
    
    // If we have valid cached data and it's not expired
    if (cachedData && cachedTime && cachedVersion === CACHE_VERSION) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < CACHE_DURATION) {
        return JSON.parse(cachedData).words;
      }
    }
    
    // Fetch fresh data
    const response = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: WORDS_JSON_URL,
        onload: resolve,
        onerror: reject,
        timeout: 5000 // 5 second timeout
      });
    });
    
    if (response.status >= 200 && response.status < 300) {
      const data = JSON.parse(response.responseText);
      
      // Cache the result
      GM_setValue(CACHE_KEY, JSON.stringify(data));
      GM_setValue(CACHE_TIMESTAMP, Date.now().toString());
      GM_setValue('curseWordsVersion', CACHE_VERSION);
      
      return data.words || DEFAULT_CURSE_WORDS;
    }
  } catch (error) {
    console.error('Failed to load curse words:', error);
  }
  
  // Fallback to default words
  return DEFAULT_CURSE_WORDS;
}

function detectCurses() {
  const messages = document.querySelectorAll('.forum-post-content');

  messages.forEach(message => {
    for (let i = 0; i < curseWords.length; i++) {
      searchAndHighlightWord(curseWords[i], message);
    }
  });
}

function addCSSVariables() {
  const root = document.querySelector(':root');
  root.style.setProperty('--curseColor', '#ff4800');
}

// Initialize the script
async function init() {
  try {
    // Load curse words
    curseWords = await loadCurseWords();
    
    // Set up mutation observer
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('forum-post-content')) {
              detectCurses();
            }
          });
        }
      });
    });

    // Find posts container and start observing
    const postsContainer = document.querySelector('.forum_content');
    if (postsContainer) {
      addCSSVariables();
      observer.observe(postsContainer, { childList: true, subtree: true });
      
      // Initial check
      detectCurses();
      
      // Add a small indicator
      addStatusIndicator();
    } else {
      console.error('Posts container not found.');
    }
  } catch (error) {
    console.error('Error initializing script:', error);
  }
}

// Add a small status indicator
function addStatusIndicator() {
  const indicator = document.createElement('div');
  indicator.style.position = 'fixed';
  indicator.style.bottom = '10px';
  indicator.style.right = '10px';
  indicator.style.padding = '5px 10px';
  indicator.style.background = '#333';
  indicator.style.color = '#fff';
  indicator.style.borderRadius = '4px';
  indicator.style.fontSize = '12px';
  indicator.style.zIndex = '9999';
  indicator.textContent = `MZ Curse Detector v${GM_info.script.version} (${curseWords.length} palabras)`;
  document.body.appendChild(indicator);
}

// Start the script
init();
