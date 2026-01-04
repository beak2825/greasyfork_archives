// ==UserScript==
// @name         GitHub Gist Copier
// @description  Add copy button to Gist files for easy code copying.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.3
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @run-at       document-end
// @match        https://gist.github.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @connect      api.codetabs.com
// @connect      api.cors.lol
// @connect      api.allorigins.win
// @connect      everyorigin.jwvbremen.nl
// @connect      gist.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/528091/GitHub%20Gist%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/528091/GitHub%20Gist%20Copier.meta.js
// ==/UserScript==

;(() => {
    let isRequestInProgress = false
  
    GM_addStyle(`
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
          
          .gist-copy-spinner {
              animation: spin 0.75s linear infinite;
              transform-origin: center;
          }
      `)
  
    const proxyServices = [
      {
        name: "CodeTabs Proxy",
        url: "https://api.codetabs.com/v1/proxy/?quest=",
      },
      {
        name: "CORS.lol Proxy",
        url: "https://api.cors.lol/?url=",
      },
      {
        name: "AllOrigins Proxy",
        url: "https://api.allorigins.win/get?url=",
        parseResponse: (response) => {
          const parsed = JSON.parse(response)
          return parsed.contents
        },
      },
      {
        name: "EveryOrigin Proxy",
        url: "https://everyorigin.jwvbremen.nl/api/get?url=",
        parseResponse: (response) => {
          const parsed = JSON.parse(response)
          return parsed.html
        },
      },
    ]
  
    function noop() {}
  
    function debounce(f, delay) {
      let timeoutId = null
      return function (...args) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
          f.apply(this, args)
        }, delay)
      }
    }
  
    async function fetchWithProxy(rawUrl, proxyIndex = 0) {
      if (proxyIndex >= proxyServices.length) {
        throw new Error("All proxies failed")
      }
  
      const proxyService = proxyServices[proxyIndex]
      const proxiedUrl = `${proxyService.url}${encodeURIComponent(rawUrl)}`
  
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: proxiedUrl,
          headers: {
            Accept: "text/plain, application/json, */*",
          },
          followRedirect: true,
          onload: (response) => {
            if (response.responseText.includes("limit") && response.responseText.includes("API")) {
              fetchWithProxy(rawUrl, proxyIndex + 1)
                .then(resolve)
                .catch(reject)
              return
            }
  
            if (response.status === 200) {
              try {
                let responseText = response.responseText
  
                if (proxyService.parseResponse) {
                  responseText = proxyService.parseResponse(responseText)
                }
  
                if (responseText.includes("<a href=") && responseText.includes("Moved Permanently")) {
                  const match = responseText.match(/href="([^"]+)"/)
                  if (match && match[1]) {
                    const redirectUrl = match[1].startsWith("/") ? `${new URL(proxiedUrl).origin}${match[1]}` : match[1]
  
                    GM_xmlhttpRequest({
                      method: "GET",
                      url: redirectUrl,
                      headers: {
                        Accept: "text/plain, application/json, */*",
                      },
                      onload: (redirectResponse) => {
                        if (redirectResponse.status === 200) {
                          resolve(redirectResponse.responseText)
                        } else {
                          fetchWithProxy(rawUrl, proxyIndex + 1)
                            .then(resolve)
                            .catch(reject)
                        }
                      },
                      onerror: () => {
                        fetchWithProxy(rawUrl, proxyIndex + 1)
                          .then(resolve)
                          .catch(reject)
                      },
                    })
                  } else {
                    fetchWithProxy(rawUrl, proxyIndex + 1)
                      .then(resolve)
                      .catch(reject)
                  }
                } else {
                  resolve(responseText)
                }
              } catch (e) {
                fetchWithProxy(rawUrl, proxyIndex + 1)
                  .then(resolve)
                  .catch(reject)
              }
            } else {
              fetchWithProxy(rawUrl, proxyIndex + 1)
                .then(resolve)
                .catch(reject)
            }
          },
          onerror: () => {
            fetchWithProxy(rawUrl, proxyIndex + 1)
              .then(resolve)
              .catch(reject)
          },
        })
      })
    }
  
    function createCopyButton(fileElement) {
      const fileActionElement = fileElement.querySelector(".file-actions")
      if (!fileActionElement) {
        return noop
      }
  
      const rawButton = fileActionElement.querySelector('a[href*="/raw/"]')
      if (!rawButton) {
        return noop
      }
  
      const button = document.createElement("button")
      button.className = "btn-octicon gist-copy-button"
      button.style.marginRight = "5px"
  
      button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
              <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
          </svg>
  
          <svg style="display: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="gist-spinner">
              <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/>
              <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="gist-copy-spinner"/>
          </svg>
  
          <svg style="display: none;" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
          </svg>
          `
  
      const copyIcon = button.querySelector(".octicon-copy")
      const spinnerIcon = button.querySelector(".gist-spinner")
      const checkIcon = button.querySelector(".octicon-check")
  
      let timeoutId = null
      const copyHandler = async (e) => {
        if (timeoutId || isRequestInProgress) {
          return
        }
        e.preventDefault()
  
        isRequestInProgress = true
        copyIcon.style.display = "none"
        spinnerIcon.style.display = "inline-block"
  
        try {
          const rawUrl = rawButton.href
          const content = await fetchWithProxy(rawUrl)
  
          GM_setClipboard(content, { type: "text", mimetype: "text/plain" })
  
          spinnerIcon.style.display = "none"
          checkIcon.style.display = "inline-block"
  
          timeoutId = setTimeout(() => {
            checkIcon.style.display = "none"
            copyIcon.style.display = "inline-block"
            timeoutId = null
          }, 500)
        } catch (error) {
          spinnerIcon.style.display = "none"
          copyIcon.style.display = "inline-block"
        } finally {
          isRequestInProgress = false
        }
      }
  
      button.addEventListener("click", copyHandler)
      fileActionElement.insertBefore(button, fileActionElement.firstChild)
  
      return () => {
        button.removeEventListener("click", copyHandler)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        button.remove()
      }
    }
  
    function runGistCopy() {
      let removeAllListeners = noop
  
      function tryCreateCopyButtons() {
        removeAllListeners()
        const fileElements = [...document.querySelectorAll(".file")]
        const removeListeners = fileElements.map(createCopyButton)
        removeAllListeners = () => {
          removeListeners.map((f) => f())
          ;[...document.querySelectorAll(".gist-copy-button")].forEach((el) => {
            el.remove()
          })
        }
      }
  
      setTimeout(tryCreateCopyButtons, 300)
  
      const observer = new MutationObserver(
        debounce(() => {
          if (
            document.querySelectorAll(".file").length > 0 &&
            document.querySelectorAll(".gist-copy-button").length === 0
          ) {
            tryCreateCopyButtons()
          }
        }, 100),
      )
  
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
  
      if (window.onurlchange === null) {
        window.addEventListener("urlchange", debounce(tryCreateCopyButtons, 16))
      }
    }
  
    runGistCopy()
  })()  