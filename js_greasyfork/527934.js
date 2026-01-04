// ==UserScript==
// @name        GitHub: Undiscovered Trending
// @namespace   shiftgeist
// @icon	https://github.com/fluidicon.png
// @match       https://github.com/trending*
// @grant       none
// @version     20251110
// @author      shiftgeist
// @description Hide starred repos in trending and remove slob
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527934/GitHub%3A%20Undiscovered%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/527934/GitHub%3A%20Undiscovered%20Trending.meta.js
// ==/UserScript==

const ignoreKeywordsInText = [
  ' ai ',
  'ai assistant',
  'ai chat',
  'ai models',
  'ai-powered',
  'crypto',
  'deepseek',
  'defi',
  'gemini',
  'gpt',
  'llm',
  'mcp',
  'ollama',
  'openai',
  'qwenlm',
  'deep learning',
]

function log(...params) {
  if (localStorage.getItem('undiscovered-debug') === 'true') {
    console.log('[undiscovered]', ...params)
  }
}

function createIgnoreButton(ignoredRepos, urlToIgnore, onclick) {
  const button = document.createElement('button')
  button.className = 'Button--secondary Button--small Button ml-2 ignore-button'
  button.innerText = 'Ignore'
  button.onclick = () => {
    ignoredRepos.push(urlToIgnore)
    onclick()
    localStorage.setItem('undiscovered-ignored', JSON.stringify(ignoredRepos))
  }
  return button
}

function main() {
  log('start of main')

  setTimeout(() => {
    log('delay done')

    const ignoredRepos = JSON.parse(localStorage.getItem('undiscovered-ignored') || '[]')

    const articles = document.querySelectorAll('article')
    const parent = document.querySelector('[data-hpc=""]')

    for (const article of articles) {
      const url = article.querySelector('h2 a').getAttribute('href')
      const hasButton = article.querySelector('.ignore-button')
      const buttonsContainer = article.querySelector('.float-right.d-flex')

      if (!hasButton) {
        function onclick() {
          article.remove()
          main()
        }

        const button = createIgnoreButton(ignoredRepos, url, onclick)
        buttonsContainer.append(button)
      }

      if (
        // Already starred
        article.querySelector('.starred-button-icon').getClientRects().length > 0 ||
        // Ignored
        ignoredRepos.includes(url) ||
        // Contains AI
        ignoreKeywordsInText.findIndex(e => article.innerText.toLowerCase().includes(e)) >= 0
      ) {
        article.remove()
      }
    }

    // no repos dispalyed
    if (parent.childElementCount === 0) {
      const empty = document.createElement('article')
      empty.className = 'Box-row'
      empty.innerText = 'Nothing to discover'
      parent.append(empty)
    }
  }, 100)
}

log('init')

let previousUrl = ''
const observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href
    main()
  }
})
const config = { subtree: true, childList: true }
observer.observe(document, config)
