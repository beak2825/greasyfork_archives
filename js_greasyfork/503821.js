// ==UserScript==
// @name         GitHub Repo Size Display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Display repository size on GitHub repo pages
// @license      MIT
// @author       Lainbo
// @match        https://github.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTQgMTQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHdpZHRoPSIxMSIgaGVpZ2h0PSIxMyIgeD0iMS41IiB5PSIuNSIgcng9IjEiLz48cGF0aCBkPSJtNC41IDEwLjVsMS43NS0yLjc1TTQuMDkgN0EyLjkzIDIuOTMgMCAwIDEgNCA1LjE2YTMgMyAwIDEgMSA0LjY3IDMuMjdNNy41IDExSDEwIi8+PC9nPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/503821/GitHub%20Repo%20Size%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/503821/GitHub%20Repo%20Size%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict'

  GM_addStyle(`
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .modal-content {
        background-color: #f6f8fa;
        padding: 24px;
        border-radius: 6px;
        width: 340px;
        box-shadow: 0 8px 24px rgba(140,149,159,0.2);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .modal-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #24292f;
    }
    .modal-description {
        font-size: 14px;
        color: #57606a;
        margin-bottom: 16px;
        line-height: 1.5;
    }
    .modal-content input {
        width: 100%;
        margin-bottom: 16px;
        padding: 5px 12px;
        font-size: 14px;
        line-height: 20px;
        color: #24292f;
        vertical-align: middle;
        background-color: #ffffff;
        background-repeat: no-repeat;
        background-position: right 8px center;
        border: 1px solid #d0d7de;
        border-radius: 6px;
        box-shadow: inset 0 1px 0 rgba(208,215,222,0.2);
    }
    .modal-content button {
        color: #ffffff;
        background-color: #2da44e;
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        border: 1px solid;
        border-radius: 6px;
        appearance: none;
        user-select: none;
        margin-right: 8px;
    }
    .modal-content button.cancel {
        color: #24292f;
        background-color: #f6f8fa;
        border-color: rgba(27,31,36,0.15);
    }
    .modal-content button:hover {
        background-color: #2c974b;
    }
    .modal-content button.cancel:hover {
        background-color: #f3f4f6;
    }
    .repo-size-label.error {
        background-color: #ffdce0;
        color: #cf222e;
    }
`)

  let observer
  let repoTitleComponent

  function formatSize(sizeInKB) {
    if (sizeInKB >= 1024 * 1024) {
      return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`
    }
    else if (sizeInKB >= 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`
    }
    else {
      return `${sizeInKB} KB`
    }
  }

  function updateRepoSize(content, isError = false) {
    if (!repoTitleComponent) {
      repoTitleComponent = document.querySelector('#repo-title-component')
      if (!repoTitleComponent) {
        return
      }
    }

    let sizeElement = repoTitleComponent.querySelector('.repo-size-label')
    if (!sizeElement) {
      sizeElement = document.createElement('span')
      sizeElement.className = 'Label Label--secondary v-align-middle ml-1 repo-size-label'
      repoTitleComponent.appendChild(sizeElement)
    }

    sizeElement.textContent = content
    sizeElement.classList.toggle('error', isError)
  }

  function fetchRepoSize() {
    const repoRegex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/
    const match = location.href.match(repoRegex)

    if (!match) { return }

    const [, owner, repo] = match
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
    const token = GM_getValue('github_token', '')

    if (!token) {
      updateRepoSize('Token not set', true)
      return
    }

    fetch(apiUrl, {
      headers: { Authorization: `token ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.size !== undefined) {
          updateRepoSize(formatSize(data.size))
        }
        else {
          throw new Error('Size information not available')
        }
      })
      .catch((error) => {
        console.error('Error fetching repo size:', error)
        updateRepoSize('Size fetch failed', true)
      })
  }

  function createModal() {
    const tokenCreationUrl = new URL('https://github.com/settings/tokens/new')
    tokenCreationUrl.searchParams.append('description', 'GitHub Repo Size Display')
    tokenCreationUrl.searchParams.append('scopes', 'repo')

    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">Set GitHub Token</h2>
                <p class="modal-description">
                    Enter your GitHub personal access token with "repo" scope.
                    <a href="${tokenCreationUrl.toString()}" target="_blank" rel="noopener noreferrer">
                        Click here to create a new token
                    </a>
                </p>
                <input type="text" id="github-token-input" placeholder="Enter your GitHub personal access token">
                <button id="save-token">Save</button>
                <button id="cancel-token" class="cancel">Cancel</button>
            </div>
        </div>
    `

    const modalContainer = document.createElement('div')
    modalContainer.innerHTML = modalHTML
    document.body.appendChild(modalContainer)

    const input = document.getElementById('github-token-input')
    input.value = GM_getValue('github_token', '')

    document.getElementById('save-token').addEventListener('click', () => {
      const token = input.value.trim()
      if (token) {
        GM_setValue('github_token', token)
        modalContainer.remove()
        location.reload()
      }
    })

    document.getElementById('cancel-token').addEventListener('click', () => modalContainer.remove())
  }

  function observePageChanges() {
    const targetNode = document.body
    const config = { childList: true, subtree: true }

    observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const newRepoTitleComponent = document.querySelector('#repo-title-component')
          if (newRepoTitleComponent && newRepoTitleComponent !== repoTitleComponent) {
            repoTitleComponent = newRepoTitleComponent
            fetchRepoSize()
            break
          }
        }
      }
    })

    observer.observe(targetNode, config)
  }

  function init() {
    observePageChanges()
  }

  // Register the menu command to set the GitHub token
  GM_registerMenuCommand('Set GitHub Token', createModal)

  init()
})()
