// ==UserScript==
// @name         Streamline Asuracomic with Search
// @namespace    Violentmonkey Scripts
// @match        https://asuracomic.net/*
// @grant        none
// @version      1.3
// @author       -
// @license      MIT
// @description  Removes ads and redundant UI, and adds a button to search for the latest chapter of a series.
// @downloadURL https://update.greasyfork.org/scripts/543137/Streamline%20Asuracomic%20with%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543137/Streamline%20Asuracomic%20with%20Search.meta.js
// ==/UserScript==
;(function () {
  "use strict"

  // --- Add CSS selectors for any elements you want to remove here ---
  const selectorsToRemove = [
    "body > div.relative.w-full.overflow-hidden.transition-all.duration-300 > div", // Header ad
    "body > div.bottom-\\[-40px\\].sm\\:bottom-0", // Footer
    "body > div.fixed.inset-0.z-50.flex.items-center.justify-center.p-4.bg-black\\/60.backdrop-blur-sm", // Full page ad
    "body > div.max-w-\\[1220px\\].pt-2 > div > div > div > div.flex.items-center.justify-center.gap-1.py-2", // Social media buttons under chapter names
    "body > div.max-w-\\[1220px\\].pt-2 > div > div > div > h2.text-center.md\\:text-center.py-4.text-sm.text-\\[\\#999999\\]", // Random paragraph ad
    "body > div.max-w-\\[1220px\\].pt-2 > div > div > div > div.space-y-4 > div.bg-\\[\\#222222\\].px-5.py-4.flex.items-center.md\\:text-start.justify-center.gap-x-2.w-full", // Tags section
  ]

  const applySelectorsToNode = (targetNode) => {
    if (!targetNode || typeof targetNode.querySelectorAll !== "function") {
      return
    }
    for (const selector of selectorsToRemove) {
      try {
        targetNode.querySelectorAll(selector).forEach((el) => el.remove())
        if (targetNode.matches && targetNode.matches(selector)) {
          targetNode.remove()
        }
      } catch (e) {
        console.error(`Failed on selector: ${selector}`, e)
      }
    }
  }

  /**
   * Finds series containers and adds a search button for the latest chapter.
   * @param {Node} targetNode - The node to search within for series containers.
   */
  const addSearchButtons = (targetNode) => {
    if (!targetNode || typeof targetNode.querySelectorAll !== "function") {
      return
    }

    const seriesContainers = targetNode.querySelectorAll("div.col-span-9.space-y-1\\.5")

    seriesContainers.forEach((container) => {
      const titleElement = container.querySelector("span.text-\\[15px\\] a")
      const latestChapterElement = container.querySelector("div.list-disc a p")

      if (!titleElement || !latestChapterElement || container.querySelector(".latest-chapter-search-btn")) {
        return
      }

      const title = titleElement.textContent.trim()
      const chapterText = latestChapterElement.textContent.trim()
      const chapterNumberMatch = chapterText.match(/(\d+(\.\d+)?)/)

      if (title && chapterNumberMatch) {
        const chapterNumber = chapterNumberMatch[0]
        const searchButton = document.createElement("button")
        searchButton.textContent = "🔍"
        searchButton.title = "Search for latest chapter"
        searchButton.className = "latest-chapter-search-btn"

        Object.assign(searchButton.style, {
          backgroundColor: "#222222",
          color: "#e2e8f0",
          border: "1px solid #5a1f78",
          padding: "2px 7px",
          margin: "0 6px 0 2px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
          verticalAlign: "middle",
        })

        searchButton.onmouseover = () => (searchButton.style.backgroundColor = "#913FE2")
        searchButton.onmouseout = () => (searchButton.style.backgroundColor = "#222222")

        searchButton.addEventListener("click", (e) => {
          e.preventDefault()
          const searchQuery = `${title} chapter ${chapterNumber}`
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
          window.open(searchUrl, "_blank")
        })

        titleElement.parentElement.insertAdjacentElement("beforebegin", searchButton)
      }
    })
  }

  // --- Main observer logic ---
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applySelectorsToNode(node)
          addSearchButtons(node)
        }
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // --- Initial run on page load ---
  applySelectorsToNode(document)
  addSearchButtons(document)
})()
