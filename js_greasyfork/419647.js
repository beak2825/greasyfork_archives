// ==UserScript==
// @name         Google Docs - Word Count with Options
// @namespace    https://zachhardesty.com
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  adds a word counter with options to Google Docs (NOTE: Unfortunately, this is currently broken. Fortunately, they basically implemented this: in the top menu click Tools > Word count > check "Display word count while typing". This UserScript never worked that well, especially with longer document and Google has changed their code again to make this even more difficult to fix (aggressive lazy-loading pages). I likely won't fix this, but I'm leaving it up for now.)
// @copyright    2019, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.0.1

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/google-docs-word-count.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Google_Docs_-_Word_Count_(With_Options)
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://docs.google.com/document/*
// @downloadURL https://update.greasyfork.org/scripts/419647/Google%20Docs%20-%20Word%20Count%20with%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/419647/Google%20Docs%20-%20Word%20Count%20with%20Options.meta.js
// ==/UserScript==
// heavy inspiration from:
// https://greasyfork.org/en/scripts/22057-google-docs-wordcount/code
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

// strikingly complex (uses DOM bounding boxes) to get currently selected text:
// may implement only necessary functions to save space, library size: (15.4 KB)
// https://github.com/JensPLarsen/ChromeExtension-GoogleDocsUtil

const displayCount = () => {
  // words not counted between these when true
  const BRACKETS = true
  const PARENTHESIS = true
  const QUOTES = true
  const MISC = true // skips works cited, personal titles

  const SELECTED = true // if selected text present, word count only counts it

  const display = document.createElement("div")
  display.id = "zh-display"
  display.setAttribute(
    "style",
    `
      position: fixed;
      width: 100%;
      left: 0px;
      bottom: 0px;
      color: rgba(0,0,0,.7);
      height: 15px;
      background-color: #ededee;
      z-index: 100;
      font-family: Arial;
      font-size: 12px;
      padding-top: 5px;
      padding-left: 5px;
      border-top: 1px solid #d9d9d9;
    `
  )
  document.querySelector("body").append(display)

  /**
   * update the word count
   */
  async function setCount() {
    const doc = getGoogleDocument()
    let selected = doc.selectedText
    console.log("selected", selected)

    const pages = document.querySelector(".kix-paginateddocumentplugin")
      .children[1].children
    let body = ""
    for (const page of pages) {
      // pages that are unloaded will appear to have no text
      // add a marker to the cumulative body to indicate that
      // a word count should not be displayed
      if (page.textContent === "") body += " ~~ "
      body += page.textContent
    }

    // clean extra spaces
    body = body.replace(/\u00A0/g, " ").trim()

    // generate regex from settings
    // must escape \'s in JS
    // in standard regex form:
    //   /(“(.(?!“))+”)|(\((.(?!\())+\)|\[(.(?!\[))+\])
    //     |Works Cited(\n.*)*|(Unit \d (Primary Source Analysis|Exam: Part \d - #\d+))/g
    const regex = []
    if (BRACKETS) regex.push("\\[(.(?!\\[))+\\]")
    if (PARENTHESIS) regex.push("\\((.(?!\\())+\\)")
    if (QUOTES)
      regex.push(
        "Works Cited(.|\\n.*)*|(Unit \\d (Primary Source Analysis|Exam: Part \\d( - #\\d+)*))"
      )
    if (MISC) regex.push("(“(.(?!“))+”)")

    // apply regex filtering to body
    for (const reg of regex) {
      selected = selected.replace(new RegExp(reg, "g"), " ")
    }

    // apply regex filtering to selected text if necessary
    let filtered = body
    for (const reg of regex) {
      filtered = filtered.replace(new RegExp(reg, "g"), " ")
    }

    // remove extra spaces and line breaks and get counts
    const words = filtered
      .trim()
      .replace(/\u00A0/g, " ")
      .replace(/ {2,}/g, " ")
      .split(" ")
    if (words.includes("~~")) {
      // empty or unloaded pages present
      document.querySelector(
        "#zh-display"
      ).textContent = `Word Count: (scroll to bottom & remove empty pages) | Pages: ${pages.length}`
    } else if (selected.length > 0 && SELECTED) {
      selected = selected
        .trim()
        .replace(/\u00A0/g, " ")
        .replace(/ {2,}/g, " ")
      console.log("selected", selected)
      document.querySelector("#zh-display").textContent = `Word Count: ${
        selected.split(" ").length
      } of ${words.length} (selected) | Pages: ${pages.length}`
    } else {
      document.querySelector(
        "#zh-display"
      ).textContent = `Word Count: ${words.length} | Pages: ${pages.length}`
    }
  }

  setInterval(setCount, 1000)
}

// #region - Google Docs Utils
// - - - - - - - - - - - - - - - - - - - -
// General
// - - - - - - - - - - - - - - - - - - - -

const classNames = {
  paragraph: ".kix-paragraphrenderer",
  line: ".kix-lineview",
  selectionOverlay: ".kix-selection-overlay",
  wordNode: ".kix-wordhtmlgenerator-word-node",
  cursor: ".kix-cursor",
  cursorName: ".kix-cursor-name",
  cursorCaret: ".kix-cursor-caret",
}

/**
 * Google Docs like to add \u200B, \u200C (&zwnj) and non breaking spaces to make sure
 * the browser shows the text correct. When getting the text, we would prefer to get
 * clean text.
 *
 * @param {string} text - ?
 * @returns {string} clean text
 */
function cleanDocumentText(text) {
  let cleanedText = text.replace(/[\u200B\u200C]/g, "")
  const nonBreakingSpaces = String.fromCharCode(160)
  const regex = new RegExp(nonBreakingSpaces, "g")
  cleanedText = cleanedText.replace(regex, " ")
  return cleanedText
}

// - - - - - - - - - - - - - - - - - - - -
// Get Google Document
// - - - - - - - - - - - - - - - - - - - -

/**
 * Finds all the text and the caret position in the .
 *
 * @returns {GoogleDoc} google docs document
 */
function getGoogleDocument() {
  let caret, caretRect
  let caretIndex = 0
  let caretLineIndex = 0
  let caretLine = 0
  const text = []
  const nodes = []
  let lineCount = 0
  let globalIndex = 0
  let selectedText = ""
  let exportedSelectionRect
  const paragraphRenderers = document.querySelectorAll(classNames.paragraph)

  if (containsUserCaretDom()) {
    caret = getUserCaretDom()
    caretRect = caret.getBoundingClientRect()
  }

  for (const paragraphRenderer of paragraphRenderers) {
    const lineViews = paragraphRenderer.querySelectorAll(classNames.line)
    for (const lineView of lineViews) {
      let lineText = ""
      const selectionOverlays = lineView.querySelectorAll(
        classNames.selectionOverlay
      )
      const wordhtmlgeneratorWordNodes = lineView.querySelectorAll(
        classNames.wordNode
      )
      for (const wordhtmlgeneratorWordNode of wordhtmlgeneratorWordNodes) {
        const wordhtmlgeneratorWordNodeRect =
          wordhtmlgeneratorWordNode.getBoundingClientRect()
        if (
          caretRect &&
          doesRectsOverlap(wordhtmlgeneratorWordNodeRect, caretRect)
        ) {
          const caretXStart =
            caretRect.left - wordhtmlgeneratorWordNodeRect.left
          const localCaretIndex = getLocalCaretIndex(
            caretXStart,
            wordhtmlgeneratorWordNode,
            lineView
          )
          caretIndex = globalIndex + localCaretIndex
          caretLineIndex = lineText.length + localCaretIndex
          caretLine = lineCount
        }
        const nodeText = cleanDocumentText(
          wordhtmlgeneratorWordNode.textContent
        )
        nodes.push({
          index: globalIndex,
          line: lineCount,
          lineIndex: lineText.length,
          node: wordhtmlgeneratorWordNode,
          lineElement: lineView,
          text: nodeText,
        })

        for (const selectionOverlay of selectionOverlays) {
          const selectionRect = selectionOverlay.getBoundingClientRect()

          if (selectionRect) exportedSelectionRect = selectionRect

          if (
            doesRectsOverlap(
              wordhtmlgeneratorWordNodeRect,
              selectionOverlay.getBoundingClientRect()
            )
          ) {
            const selectionStartIndex = getLocalCaretIndex(
              selectionRect.left - wordhtmlgeneratorWordNodeRect.left,
              wordhtmlgeneratorWordNode,
              lineView
            )
            const selectionEndIndex = getLocalCaretIndex(
              selectionRect.left +
                selectionRect.width -
                wordhtmlgeneratorWordNodeRect.left,
              wordhtmlgeneratorWordNode,
              lineView
            )
            selectedText += nodeText.slice(
              selectionStartIndex,
              selectionEndIndex
            )
          }
        }

        globalIndex += nodeText.length
        lineText += nodeText
      }
      text.push(lineText)
      lineCount += 1
    }
  }
  return {
    nodes,
    text,
    selectedText,
    caret: {
      index: caretIndex,
      lineIndex: caretLineIndex,
      line: caretLine,
    },
    selectionRect: exportedSelectionRect,
  }
}

// http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
/**
 * @param {DOMRect} RectA - ?
 * @param {DOMRect} RectB - ?
 * @returns {boolean} overlapping?
 */
function doesRectsOverlap(RectA, RectB) {
  return (
    RectA.left <= RectB.right &&
    RectA.right >= RectB.left &&
    RectA.top <= RectB.bottom &&
    RectA.bottom >= RectB.top
  )
}

// The kix-cursor contain a kix-cursor-name dom, which is only set when it is not the users cursor
/**
 * @returns {boolean} does the kix-cursor contain a kix-cursor-name dom
 */
function containsUserCaretDom() {
  const carets = document.querySelectorAll(classNames.cursor)

  for (const caret of carets) {
    const nameDom = caret.querySelectorAll(classNames.cursorName)
    const name = nameDom[0].textContent
    if (!name) return true
  }

  return false
}

// The kix-cursor contain a kix-cursor-name dom, which is only set when it is not the users cursor
/**
 * @returns {Element} user caret
 */
function getUserCaretDom() {
  const carets = document.querySelectorAll(classNames.cursor)
  for (const caret of carets) {
    const nameDom = caret.querySelectorAll(classNames.cursorName)
    const name = nameDom[0].textContent
    if (!name) return caret.querySelectorAll(classNames.cursorCaret)[0]
  }

  throw new Error("Could not find the users cursor")
}

/**
 * @param {number} caretX - The x coordinate on where the element the caret is located
 * @param {Element} element - The element on which contains the text where in the caret position is
 * @param {Element} simulateElement - ?Doing the calculation of the caret position, we need to create a temporary DOM, the DOM will be created as a child to the simulatedElement.
 * @returns {number} caret index on the innerText of the element
 */
function getLocalCaretIndex(caretX, element, simulateElement) {
  // Creates a span DOM for each letter
  const text = cleanDocumentText(element.textContent)
  const container = document.createElement("div")
  const letterSpans = []
  for (const ch of text) {
    const textNode = document.createElement("span")
    textNode.textContent = ch
    textNode.style.cssText = element.style.cssText
    // "pre" = if there are multiple white spaces, they will all be rendered. Default behavior is for them to be collapsed
    textNode.style.whiteSpace = "pre"
    letterSpans.push(textNode)
    container.append(textNode)
  }
  container.style.whiteSpace = "nowrap"
  simulateElement.append(container)

  // The caret is usually at the edge of the letter, we find the edge we are closest to.
  let index = 0
  let currentMinimumDistance = -1
  const containerRect = container.getBoundingClientRect()

  for (const [i, letterSpan] of letterSpans.entries()) {
    const rect = letterSpan.getBoundingClientRect()
    const left = rect.left - containerRect.left
    const right = left + rect.width
    if (currentMinimumDistance === -1) {
      currentMinimumDistance = Math.abs(caretX - left)
    }
    const leftDistance = Math.abs(caretX - left)
    const rightDistance = Math.abs(caretX - right)

    if (leftDistance <= currentMinimumDistance) {
      index = i
      currentMinimumDistance = leftDistance
    }

    if (rightDistance <= currentMinimumDistance) {
      index = i + 1
      currentMinimumDistance = rightDistance
    }
  }

  // Clean up
  container.remove()
  return index
}

displayCount()
