// ==UserScript==
// @name         GitHub Repo Size
// @description  Displays repository size.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.1
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.codetabs.com
// @connect      api.cors.lol
// @connect      api.allorigins.win
// @connect      everyorigin.jwvbremen.nl
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/535927/GitHub%20Repo%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/535927/GitHub%20Repo%20Size.meta.js
// ==/UserScript==

;(() => {
  let isRequestInProgress = false
  let debounceTimer = null
  const CACHE_DURATION = 10 * 60 * 1000

  const databaseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" class="octicon mr-2" fill="currentColor" aria-hidden="true" style="vertical-align: text-bottom;">
    <path d="M400 86l0 88.7c-13.3 7.2-31.6 14.2-54.8 19.9C311.3 203 269.5 208 224 208s-87.3-5-121.2-13.4C79.6 188.9 61.3 182 48 174.7L48 86l.6-.5C53.9 81 64.5 74.8 81.8 68.6C115.9 56.5 166.2 48 224 48s108.1 8.5 142.2 20.6c17.3 6.2 27.8 12.4 33.2 16.9l.6 .5zm0 141.5l0 75.2c-13.3 7.2-31.6 14.2-54.8 19.9C311.3 331 269.5 336 224 336s-87.3-5-121.2-13.4C79.6 316.9 61.3 310 48 302.7l0-75.2c13.3 5.3 27.9 9.9 43.3 13.7C129.5 250.6 175.2 256 224 256s94.5-5.4 132.7-14.8c15.4-3.8 30-8.3 43.3-13.7zM48 426l0-70.4c13.3 5.3 27.9 9.9 43.3 13.7C129.5 378.6 175.2 384 224 384s94.5-5.4 132.7-14.8c15.4-3.8 30-8.3 43.3-13.7l0 70.4-.6 .5c-5.3 4.5-15.9 10.7-33.2 16.9C332.1 455.5 281.8 464 224 464s-108.1-8.5-142.2-20.6c-17.3-6.2-27.8-12.4-33.2-16.9L48 426z"/>
</svg>`

  const proxyServices = [
    {
      name: "Direct GitHub API",
      url: "https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CodeTabs Proxy",
      url: "https://api.codetabs.com/v1/proxy/?quest=https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CORS.lol Proxy",
      url: "https://api.cors.lol/?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "AllOrigins Proxy",
      url: "https://api.allorigins.win/get?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.contents)
      },
    },
    {
      name: "EveryOrigin Proxy",
      url: "https://everyorigin.jwvbremen.nl/api/get?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.html)
      },
    },
  ]

  function extractRepoInfo() {
    const match = window.location.pathname.match(/^\/([^/]+)\/([^/]+)(\/|$)/)
    if (!match) return null

    return {
      owner: match[1],
      repo: match[2],
    }
  }

  function formatSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"]
    let i = 0
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024
      i++
    }
    return {
      value: bytes.toFixed(1),
      unit: units[i],
    }
  }

  function injectSize({ value, unit }, downloadURL) {
    const existingSizeDivs = document.querySelectorAll(".gh-repo-size-display")
    existingSizeDivs.forEach(div => div.remove())

    injectSizeDesktop({ value, unit }, downloadURL)
    
    injectSizeMobile({ value, unit }, downloadURL)
  }

  function injectSizeDesktop({ value, unit }, downloadURL) {
    if (document.querySelector(".gh-repo-size-display")) {
      return
    }

    const forksHeader = Array.from(document.querySelectorAll("h3.sr-only")).find(
      (el) => el.textContent.trim() === "Forks",
    )
    if (!forksHeader) return

    const forksContainer = forksHeader.nextElementSibling
    if (!forksContainer || !forksContainer.classList.contains("mt-2")) return

    const existingLink = document.querySelector(".Link--muted .octicon-repo-forked")
    if (existingLink) {
      const parentLinkElement = existingLink.closest("a")

      const sizeDiv = document.createElement("div")
      sizeDiv.className = "mt-2 gh-repo-size-display"

      const downloadLink = document.createElement("a")
      downloadLink.className = parentLinkElement.className
      downloadLink.href = downloadURL
      downloadLink.style.cursor = "pointer"

      downloadLink.innerHTML = `
  ${databaseIcon}
  <strong>${value}</strong> ${unit}`

      sizeDiv.appendChild(downloadLink)

      forksContainer.insertAdjacentElement("afterend", sizeDiv)
    } else {
      const sizeDiv = document.createElement("div")
      sizeDiv.className = "mt-2 gh-repo-size-display"

      sizeDiv.innerHTML = `
<a class="Link Link--muted" href="${downloadURL}" style="cursor: pointer;">
  ${databaseIcon}
  <strong>${value}</strong> ${unit}
</a>`

      forksContainer.insertAdjacentElement("afterend", sizeDiv)
    }
  }

  function injectSizeMobile({ value, unit }, downloadURL) {
    if (document.querySelector(".d-block.d-md-none .gh-repo-size-display")) {
      return
    }

    const mobileContainer = document.querySelector(".d-block.d-md-none.mb-2")
    if (!mobileContainer) return
    
    let targetContainer = null
    
    const publicRepoElement = Array.from(mobileContainer.querySelectorAll('.color-fg-muted span')).find(
      (el) => el.textContent.trim() === "Public repository"
    )
    
    if (publicRepoElement) {
      targetContainer = publicRepoElement.closest('.mb-2.d-flex')
    }
    
    if (!targetContainer) {
      const forkedElement = mobileContainer.querySelector('.color-fg-muted span a[href*="/"]')
      if (forkedElement) {
        targetContainer = forkedElement.closest('.mb-2.d-flex')
      }
    }
    
    if (!targetContainer) {
      targetContainer = mobileContainer.querySelector('.mb-2.d-flex')
    }
    
    if (!targetContainer) return
    
    const sizeDivMobile = document.createElement("div")
    sizeDivMobile.className = "mb-2 d-flex color-fg-muted gh-repo-size-display"
    
    sizeDivMobile.innerHTML = `
    <div class="d-flex flex-items-center" style="height: 21px">
      ${databaseIcon}
    </div>
    <a href="${downloadURL}" class="flex-auto min-width-0 width-fit" style="color:inherit">
      <strong>${value}</strong> ${unit}
    </a>`
    
    targetContainer.insertAdjacentElement("afterend", sizeDivMobile)
  }

  function getCacheKey(owner, repo) {
    return `gh_repo_size_${owner}_${repo}`
  }

  function getFromCache(owner, repo) {
    try {
      const cacheKey = getCacheKey(owner, repo)
      const cachedData = GM_getValue(cacheKey)
      
      if (!cachedData) return null
      
      const { data, timestamp } = cachedData
      const now = Date.now()
      
      if (now - timestamp < CACHE_DURATION) {
        return data
      }
      
      return null
    } catch (error) {
      console.error('Error getting from cache:', error)
      return null
    }
  }

  function saveToCache(owner, repo, data) {
    try {
      const cacheKey = getCacheKey(owner, repo)
      GM_setValue(cacheKey, {
        data,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('Error saving to cache:', error)
    }
  }

  async function fetchFromApi(proxyService, owner, repo) {
    const apiUrl = `${proxyService.url}${owner}/${repo}`

    return new Promise((resolve) => {
      if (typeof GM_xmlhttpRequest === "undefined") {
        resolve({ success: false, error: "GM_xmlhttpRequest is not defined" })
        return
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        onload: (response) => {
          if (response.responseText.includes("limit") && response.responseText.includes("API")) {
            resolve({
              success: false,
              error: "Rate limit exceeded",
              isRateLimit: true,
            })
            return
          }

          if (response.status >= 200 && response.status < 300) {
            try {
              const data = proxyService.parseResponse(response.responseText)
              resolve({ success: true, data: data })
            } catch (e) {
              resolve({ success: false, error: "JSON parse error" })
            }
          } else {
            resolve({
              success: false,
              error: `Status ${response.status}`,
            })
          }
        },
        onerror: () => {
          resolve({ success: false, error: "Network error" })
        },
        ontimeout: () => {
          resolve({ success: false, error: "Timeout" })
        },
      })
    })
  }

  async function fetchRepoInfo(owner, repo) {
    if (isRequestInProgress) {
      return
    }
    
    const cachedData = getFromCache(owner, repo)
    if (cachedData) {
      processRepoData(cachedData)
      return
    }

    isRequestInProgress = true
    let fetchSuccessful = false

    try {
      for (let i = 0; i < proxyServices.length; i++) {
        const proxyService = proxyServices[i]
        const result = await fetchFromApi(proxyService, owner, repo)

        if (result.success) {
          saveToCache(owner, repo, result.data)
          processRepoData(result.data)
          fetchSuccessful = true
          break
        }
      }
      
      if (!fetchSuccessful) {
        console.warn('All proxy attempts failed for', owner, repo)
      }
    } finally {
      isRequestInProgress = false
    }
  }

  function processRepoData(data) {
    if (data && data.size != null) {
      const repoInfo = extractRepoInfo()
      if (!repoInfo) return

      const formatted = formatSize(data.size * 1024)

      let defaultBranch = "master"
      if (data.default_branch) {
        defaultBranch = data.default_branch
      }

      const downloadURL = `https://github.com/${repoInfo.owner}/${repoInfo.repo}/archive/refs/heads/${defaultBranch}.zip`
      injectSize(formatted, downloadURL)
    }
  }

  let lastProcessedRepo = ''

  function checkAndInsertWithRetry(retryCount = 0, maxRetries = 5) {
    const repoInfo = extractRepoInfo()
    if (!repoInfo) return

    const currentRepo = `${repoInfo.owner}/${repoInfo.repo}`
    
    if (currentRepo === lastProcessedRepo && document.querySelector(".gh-repo-size-display")) {
      return
    }
    
    lastProcessedRepo = currentRepo
    
    fetchRepoInfo(repoInfo.owner, repoInfo.repo).catch(() => {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 500
        setTimeout(() => checkAndInsertWithRetry(retryCount + 1, maxRetries), delay)
      }
    })
  }

  let isHandlingRouteChange = false

  function handleRouteChange() {
    if (isHandlingRouteChange) return
    isHandlingRouteChange = true
    
    const repoInfo = extractRepoInfo()
    if (!repoInfo) {
      isHandlingRouteChange = false
      return
    }

    const pathParts = window.location.pathname.split("/").filter(Boolean)
    if (pathParts.length !== 2) {
      isHandlingRouteChange = false
      return
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      checkAndInsertWithRetry()
      isHandlingRouteChange = false
    }, 300)
  }

  let lastUrl = location.href
  
  const observer = new MutationObserver(() => {
    if (lastUrl !== location.href) {
      lastUrl = location.href
      handleRouteChange()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
  
  ;(() => {
    const origPushState = history.pushState
    const origReplaceState = history.replaceState
    let lastPath = location.pathname

    function checkPathChange() {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname
        setTimeout(handleRouteChange, 300)
      }
    }

    history.pushState = function (...args) {
      origPushState.apply(this, args)
      checkPathChange()
    }

    history.replaceState = function (...args) {
      origReplaceState.apply(this, args)
      checkPathChange()
    }

    window.addEventListener("popstate", checkPathChange)
  })()

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleRouteChange)
  } else {
    handleRouteChange()
  }
})()