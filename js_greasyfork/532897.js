// ==UserScript==
// @name                Jinjiang Chapter Downloader
// @name:zh-CN          晋江章节下载器
// @namespace           http://tampermonkey.net/
// @version             0.7
// @description         Download chapter content from JinJiang (jjwxc.net)
// @description:zh-CN   从晋江下载章节文本
// @author              oovz
// @match               *://www.jjwxc.net/onebook.php?novelid=*&chapterid=*
// @match               *://my.jjwxc.net/onebook_vip.php?novelid=*&chapterid=*
// @grant               none
// @source              https://gist.github.com/oovz/5eaabb8adecadac515d13d261fbb93b5
// @source              https://greasyfork.org/en/scripts/532897-jinjiang-chapter-downloader
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/532897/Jinjiang%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/532897/Jinjiang%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuration ---
  const TITLE_XPATH = '//div[@class="novelbody"]//h2';
  const CONTENT_CONTAINER_SELECTOR =
    '.novelbody > div[style*="font-size: 16px"]'; // Selector for the main content div
  const CONTENT_START_TITLE_DIV_SELECTOR = 'div[align="center"]'; // Title div within the container
  const CONTENT_START_CLEAR_DIV_SELECTOR = 'div[style*="clear:both"]'; // Div marking start of content after title div
  const CONTENT_END_DIV_TAG = "DIV"; // First DIV tag encountered after content starts marks the end
  const CONTENT_END_FALLBACK_SELECTOR_1 = "#favoriteshow_3"; // Fallback end marker
  const CONTENT_END_FALLBACK_SELECTOR_2 = "#note_danmu_wrapper"; // Fallback end marker (author say wrapper)
  const CONTENT_CONTAINER_SELECTOR_VIP = "div[id^=content_]"; // Selector for the main content div
  const AUTHOR_SAY_HIDDEN_XPATH = '//div[@id="note_str"]'; // Hidden div containing raw author say HTML
  const AUTHOR_SAY_CUTOFF_TEXT = "谢谢各位大人的霸王票"; // Text to truncate author say at
  const NEXT_CHAPTER_XPATH =
    '//div[@id="oneboolt"]/div[@class="noveltitle"]/span/a[span][last()]'; // Next chapter link
  const CHAPTER_WRAPPER_XPATH = '//div[@class="novelbody"]'; // Wrapper for MutationObserver

  const AD_1 = "@无限好文，尽在晋江文学城";

  // Additional advertisement texts that might appear in chapters
  const ADVERTISEMENT_TEXTS = [AD_1];

  // --- Internationalization ---
  const isZhCN =
    navigator.language.toLowerCase() === "zh-cn" ||
    document.documentElement.lang.toLowerCase() === "zh-cn";

  const i18n = {
    copyText: isZhCN ? "复制文本" : "Copy Content",
    copiedText: isZhCN ? "已复制!" : "Copied!",
    nextChapter: isZhCN ? "下一章" : "Next Chapter",
    noNextChapter: isZhCN ? "没有下一章" : "No Next Chapter",
    includeAuthorSay: isZhCN ? "包含作话" : "Include Author Say",
    excludeAuthorSay: isZhCN ? "排除作话" : "Exclude Author Say",
    authorSaySeparator: isZhCN ? "--- 作者有话说 ---" : "--- Author Say ---",
  };

  // --- State ---
  let includeAuthorSay = true; // Default to including author say

  // --- Utilities ---

  /**
   * Extracts text content from elements matching an XPath.
   * Special handling for title to trim whitespace.
   */
  function getElementsByXpath(xpath) {
    const results = [];
    const query = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (let i = 0; i < query.snapshotLength; i++) {
      const node = query.snapshotItem(i);
      if (node) {
        let directTextContent = "";
        for (let j = 0; j < node.childNodes.length; j++) {
          const childNode = node.childNodes[j];
          if (childNode.nodeType === Node.TEXT_NODE) {
            directTextContent += childNode.textContent;
          }
        }

        if (xpath === TITLE_XPATH) {
          directTextContent = directTextContent.trim();
        }

        if (directTextContent) {
          results.push(directTextContent);
        }
      }
    }
    return results;
  }
  // --- GUI Creation ---
  const gui = document.createElement("div");
  const style = document.createElement("style");
  const resizeHandle = document.createElement("div");
  const errorMessage = document.createElement("div");
  const output = document.createElement("textarea");
  const buttonContainer = document.createElement("div");
  const copyButton = document.createElement("button");
  const authorSayButton = document.createElement("button");
  const nextChapterButton = document.createElement("button");
  const spinnerOverlay = document.createElement("div");
  const spinner = document.createElement("div");

  function setupGUI() {
    gui.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px;
            border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 9999; resize: both; overflow: visible; min-width: 350px; min-height: 250px;
            max-width: 100vw; max-height: 80vh; resize-origin: top-left; display: flex; flex-direction: column;
        `;
    style.textContent = `
            @keyframes spin { to { transform: rotate(360deg); } }
            .resize-handle {
                position: absolute; width: 14px; height: 14px; top: 0; left: 0; cursor: nwse-resize;
                z-index: 10000; background-color: #888; border-top-left-radius: 5px;
                border-right: 1px solid #ccc; border-bottom: 1px solid #ccc;
            }
            .spinner-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(240, 240, 240, 0.8); display: none; justify-content: center;
                align-items: center; z-index: 10001;
            }
            .font-error-message {
                background-color: #ffeaa7; border: 1px solid #fdcb6e; border-radius: 4px;
                padding: 8px 12px; margin-bottom: 8px; font-size: 0.9em; color: #2d3436;
                display: none; line-height: 1.4;
            }
        `;
    document.head.appendChild(style);

    resizeHandle.className = "resize-handle";

    output.style.cssText = `
            width: 100%; flex: 1; margin-bottom: 8px; resize: none; overflow: auto;
            box-sizing: border-box; min-height: 180px;
        `;
    output.readOnly = true;

    buttonContainer.style.cssText = `display: flex; justify-content: center; gap: 10px; margin-bottom: 2px;`;

    copyButton.textContent = i18n.copyText;
    copyButton.style.cssText = `padding: 4px 12px; cursor: pointer; background-color: #4285f4; color: white; border: none; border-radius: 15px; font-weight: bold; font-size: 0.9em;`;

    authorSayButton.textContent = includeAuthorSay
      ? i18n.excludeAuthorSay
      : i18n.includeAuthorSay;
    authorSayButton.style.cssText = `padding: 4px 12px; cursor: pointer; background-color: #fbbc05; color: white; border: none; border-radius: 15px; font-weight: bold; font-size: 0.9em; margin-right: 5px;`;
    authorSayButton.disabled = true;

    nextChapterButton.textContent = i18n.nextChapter;
    nextChapterButton.style.cssText = `padding: 4px 12px; cursor: pointer; background-color: #34a853; color: white; border: none; border-radius: 15px; font-weight: bold; font-size: 0.9em;`;
    buttonContainer.appendChild(authorSayButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(nextChapterButton);

    errorMessage.className = "font-error-message";
    errorMessage.innerHTML = isZhCN
      ? "⚠️ VIP章节字体解密表未找到，内容可能无法正确解密。"
      : "⚠️ VIP chapter font table not found, content may not be properly decrypted.";

    spinnerOverlay.className = "spinner-overlay";
    spinner.style.cssText = `width: 30px; height: 30px; border: 4px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #333; animation: spin 1s ease-in-out infinite;`;
    spinnerOverlay.appendChild(spinner);

    gui.appendChild(resizeHandle);
    gui.appendChild(errorMessage);
    gui.appendChild(output);
    gui.appendChild(buttonContainer);
    gui.appendChild(spinnerOverlay);
    document.body.appendChild(gui);
  }

  // --- Advertisement Text Removal ---
  /**
   * Removes advertisement text from content
   * @param {string} content - The content to clean
   * @param {string[]} adTexts - Array of advertisement texts to remove
   * @returns {string} Cleaned content
   */ function removeAdvertisementText(content, adTexts = ADVERTISEMENT_TEXTS) {
    if (!content || !adTexts || adTexts.length === 0) {
      return content;
    }

    let cleanedContent = content;
    let removedCount = 0;

    for (const adText of adTexts) {
      if (!adText) continue;

      // Count occurrences before removal
      const beforeLength = cleanedContent.length;

      // Remove exact matches of the advertisement text
      cleanedContent = cleanedContent.replaceAll(adText, "");

      // Also remove the advertisement text with common surrounding punctuation/whitespace
      const adPatterns = [
        new RegExp(`\\s*${escapeRegExp(adText)}\\s*`, "g"),
        new RegExp(`^\\s*${escapeRegExp(adText)}\\s*`, "gm"), // At start of line
        new RegExp(`\\s*${escapeRegExp(adText)}\\s*$`, "gm"), // At end of line
      ];

      for (const pattern of adPatterns) {
        cleanedContent = cleanedContent.replace(pattern, "");
      }

      // Check if any removal occurred
      const afterLength = cleanedContent.length;
      if (afterLength < beforeLength) {
        removedCount++;
        console.log(`[Advertisement Removal] Removed "${adText}" from content`);
      }
    }

    // Clean up any excessive whitespace that might remain after ad removal
    cleanedContent = cleanedContent.replace(/\n{3,}/g, "\n\n"); // Collapse 3+ newlines into 2
    cleanedContent = cleanedContent.replace(/^[ \t\r\n]+/, ""); // Remove leading whitespace
    cleanedContent = cleanedContent.replace(/[\s\r\n]+$/, ""); // Remove trailing whitespace

    if (removedCount > 0) {
      console.log(
        `[Advertisement Removal] Successfully removed ${removedCount} advertisement patterns from content`
      );
    }

    return cleanedContent;
  }

  /**
   * Escapes special regex characters for use in RegExp constructor
   * @param {string} string - String to escape
   * @returns {string} Escaped string
   */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // --- VIP Font Decryption Functions ---

  /** Detect font name and URL from VIP chapter CSS styles */
  function detectVipFont() {
    // Method 1: Check CSS rules in style sheets
    const styles = document.querySelectorAll("body > style");
    for (const style of styles) {
      if (style.sheet && style.sheet.cssRules) {
        try {
          const rules = style.sheet.cssRules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.cssText) {
              const fontNameMatch = rule.cssText.match(/jjwxcfont_[\d\w]+/);
              const cssContentMatch = rule.cssText.match(/{(.*)}/);

              if (fontNameMatch && cssContentMatch) {
                const fontName = fontNameMatch[0];
                const cssContent = cssContentMatch[1];

                // Look for font URL in CSS content
                for (const part of cssContent.split(",")) {
                  if (part.includes('format("woff2")')) {
                    const urlMatch = part.match(/url\("(.*)"\)\s/);
                    if (urlMatch) {
                      const fontUrl = document.location.protocol + urlMatch[1];
                      return { fontName, fontUrl };
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.debug("Error accessing stylesheet:", e);
        }
      }
    }

    // Method 2: Check div.noveltext classes for font name
    const noveltextDiv = document.querySelector("div.noveltext");
    if (noveltextDiv && noveltextDiv.classList) {
      const fontClass = Array.from(noveltextDiv.classList).find((className) =>
        className.startsWith("jjwxcfont_")
      );
      if (fontClass) {
        const fontUrl = `${document.location.protocol}//static.jjwxc.net/tmp/fonts/${fontClass}.woff2?h=my.jjwxc.net`;
        return { fontName: fontClass, fontUrl };
      }
    }

    return null;
  }

  /** Fetch font mapping table from remote repository */
  async function fetchFontTable(fontName) {
    const url = `https://fastly.jsdelivr.net/gh/404-novel-project/jinjiang_font_tables@master/${fontName}.woff2.json`;
    const fontLink = `https://static.jjwxc.net/tmp/fonts/${fontName}.woff2?h=my.jjwxc.net`;

    console.log(`[VIP Font] Fetching font table for ${fontName}`);

    let retryCount = 3;
    while (retryCount > 0) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const fontTable = await response.json();
          console.log(
            `[VIP Font] Successfully loaded font table for ${fontName}`
          );
          return fontTable;
        } else if (response.status === 404) {
          console.warn(
            `[VIP Font] Font table not found for ${fontName}. Please submit font link to https://github.com/404-novel-project/jinjiang_font_tables: ${fontLink}`
          );
          return null;
        }
      } catch (error) {
        console.error(`[VIP Font] Error fetching font table:`, error);
        retryCount--;
        if (retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    console.error(
      `[VIP Font] Failed to fetch font table for ${fontName} after retries`
    );
    return null;
  }

  /** Replace encrypted characters using font mapping table */
  function replaceEncryptedCharacters(text, fontTable) {
    if (!fontTable) return text;

    let output = text;

    // Replace each encrypted character with its normal equivalent
    for (const encryptedChar in fontTable) {
      if (fontTable.hasOwnProperty(encryptedChar)) {
        const normalChar = fontTable[encryptedChar];
        output = output.replaceAll(encryptedChar, normalChar);
      }
    }

    // Remove zero-width non-joiner characters (ZWNJ)
    output = output.replace(/\u200c/g, "");
    output = output.replace(/&zwnj;/g, "");

    return output;
  }

  /** Main function to decrypt VIP chapter content */
  async function decryptVipContent(rawContent) {
    const fontInfo = detectVipFont();
    if (!fontInfo) {
      console.log(
        "[VIP Font] No font encryption detected, returning original content"
      );
      return { content: rawContent, fontTableMissing: false };
    }

    console.log(`[VIP Font] Detected encrypted font: ${fontInfo.fontName}`);

    const fontTable = await fetchFontTable(fontInfo.fontName);
    if (!fontTable) {
      console.warn(
        "[VIP Font] Could not load font table. Replacing encrypted characters (char + ZWNJ) with placeholder."
      );
      let modifiedContent = rawContent;
      // Replace a character followed by &zwnj; with [加密字符]
      modifiedContent = modifiedContent.replace(/.(?:&zwnj;)/g, "[加密字符]");
      // Replace a character followed by \u200c with [加密字符]
      modifiedContent = modifiedContent.replace(/.(?:\u200c)/g, "[加密字符]");
      return {
        content: modifiedContent,
        fontTableMissing: true,
        fontName: fontInfo.fontName,
      };
    }

    const decryptedContent = replaceEncryptedCharacters(rawContent, fontTable);
    console.log(`[VIP Font] Successfully decrypted content using font table`);

    return { content: decryptedContent, fontTableMissing: false };
  }

  // --- Data Extraction ---
  /** Gets the chapter title */
  function updateTitleOutput() {
    const elements = getElementsByXpath(TITLE_XPATH);
    return elements.join("\n");
  }
  /** Extracts the main chapter content */
  async function updateContentOutput() {
    let container = document.querySelector(CONTENT_CONTAINER_SELECTOR);
    let isVipChapter = false;

    // If regular container not found, assume it's a VIP chapter
    if (!container) {
      container = document.querySelector(CONTENT_CONTAINER_SELECTOR_VIP);
      isVipChapter = true;
    }

    if (!container) {
      console.error(
        "Could not find the main content container (neither regular nor VIP)."
      );
      return "[Error: Cannot find content container]";
    }

    const contentParts = [];
    let processingContent = false;
    let foundTitleDiv = false;
    let foundTitleClearDiv = false; // For VIP chapters, use simpler extraction logic
    if (isVipChapter) {
      // For VIP chapters, extract all text content directly
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
              return NodeFilter.FILTER_ACCEPT;
            } else if (node.nodeName === "BR") {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            contentParts.push(text);
          }
        } else if (node.nodeName === "BR") {
          contentParts.push("\n");
        }
      }
    } else {
      // Original logic for regular chapters
      const endMarkerFallback1 = container.querySelector(
        CONTENT_END_FALLBACK_SELECTOR_1
      );
      const endMarkerFallback2 = container.querySelector(
        CONTENT_END_FALLBACK_SELECTOR_2
      );

      for (const childNode of container.childNodes) {
        // --- Fallback End Marker Check ---
        if (
          (endMarkerFallback1 && childNode === endMarkerFallback1) ||
          (endMarkerFallback2 && childNode === endMarkerFallback2)
        ) {
          processingContent = false;
          break;
        }

        // --- State Management for Start ---
        if (
          !foundTitleDiv &&
          childNode.nodeType === Node.ELEMENT_NODE &&
          childNode.matches(CONTENT_START_TITLE_DIV_SELECTOR)
        ) {
          foundTitleDiv = true;
          continue;
        }
        if (
          foundTitleDiv &&
          !foundTitleClearDiv &&
          childNode.nodeType === Node.ELEMENT_NODE &&
          childNode.matches(CONTENT_START_CLEAR_DIV_SELECTOR)
        ) {
          foundTitleClearDiv = true;
          continue;
        }
        // Start processing *after* the clear:both div is found, unless the next node is already the end div
        if (foundTitleClearDiv && !processingContent) {
          if (
            childNode.nodeType === Node.ELEMENT_NODE &&
            childNode.tagName === CONTENT_END_DIV_TAG
          ) {
            break; // No content between clear:both and the first div
          }
          processingContent = true;
        }

        // --- Content Extraction & Primary End Check ---
        if (processingContent) {
          if (childNode.nodeType === Node.TEXT_NODE) {
            contentParts.push(childNode.textContent);
          } else if (childNode.nodeName === "BR") {
            // Handle BR tags, allowing max two consecutive newlines
            if (
              contentParts.length === 0 ||
              !contentParts[contentParts.length - 1].endsWith("\n")
            ) {
              contentParts.push("\n");
            } else if (
              contentParts.length > 0 &&
              contentParts[contentParts.length - 1].endsWith("\n")
            ) {
              const lastPart = contentParts[contentParts.length - 1];
              if (!lastPart.endsWith("\n\n")) {
                contentParts.push("\n");
              }
            }
          } else if (
            childNode.nodeType === Node.ELEMENT_NODE &&
            childNode.tagName === CONTENT_END_DIV_TAG
          ) {
            // Stop processing when the first DIV element is encountered after content starts
            processingContent = false;
            break;
          }
          // Ignore other element types within the content
        }
      }
    } // Join and clean up
    let result = contentParts.join("");
    result = result.replace(/^[ \t\r\n]+/, ""); // Remove leading standard whitespace only
    result = result.replace(/\n{3,}/g, "\n\n"); // Collapse 3+ newlines into 2
    result = result.replace(/[\s\r\n]+$/, ""); // Remove trailing standard whitespace

    // Apply font decryption for VIP chapters
    if (isVipChapter) {
      const decryptResult = await decryptVipContent(result);
      // Apply advertisement removal to decrypted content
      if (decryptResult.content) {
        decryptResult.content = removeAdvertisementText(decryptResult.content);
      }
      return decryptResult;
    }

    // Apply advertisement removal to regular chapter content
    result = removeAdvertisementText(result);
    return { content: result, fontTableMissing: false };
  }

  /** Gets the raw author say HTML from the hidden div */
  function getRawAuthorSayHtml() {
    const authorSayQuery = document.evaluate(
      AUTHOR_SAY_HIDDEN_XPATH,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    const authorSayNode = authorSayQuery.singleNodeValue;
    return authorSayNode ? authorSayNode.innerHTML.trim() : null;
  }
  /** Processes the raw author say HTML (removes cutoff text, converts <br>) */
  function processAuthorSayHtml(html) {
    if (!html) return "";

    let processedHtml = html;
    const cutoffIndex = processedHtml.indexOf(AUTHOR_SAY_CUTOFF_TEXT);
    if (cutoffIndex !== -1) {
      processedHtml = processedHtml.substring(0, cutoffIndex);
    }

    let processedText = processedHtml.replace(/<br\s*\/?>/g, "\n").trim();

    // Apply advertisement removal to author say content
    processedText = removeAdvertisementText(processedText);

    return processedText;
  }
  /** Main function to update the output textarea */
  async function updateOutput() {
    spinnerOverlay.style.display = "flex";
    setTimeout(async () => {
      let finalOutput = "";
      let rawAuthorSayHtml = null;
      let showFontError = false;
      try {
        const title = updateTitleOutput();
        const contentResult = await updateContentOutput();
        const content = contentResult.content || contentResult; // Handle both new and old format
        showFontError = contentResult.fontTableMissing || false;

        rawAuthorSayHtml = getRawAuthorSayHtml(); // Get from hidden div
        const processedAuthorSay = processAuthorSayHtml(rawAuthorSayHtml);

        finalOutput = title ? title + "\n\n" + content : content;

        if (
          includeAuthorSay &&
          processedAuthorSay &&
          processedAuthorSay.length > 0
        ) {
          finalOutput +=
            "\n\n" + i18n.authorSaySeparator + "\n\n" + processedAuthorSay;
        }

        output.value = finalOutput;
      } catch (error) {
        console.error("Error updating output:", error);
        output.value = "Error extracting content: " + error.message;
      } finally {
        // Show/hide font error message
        errorMessage.style.display = showFontError ? "block" : "none";
        // Update Author Say button state
        const authorSayExists = rawAuthorSayHtml && rawAuthorSayHtml.length > 0;
        authorSayButton.disabled = !authorSayExists;
        authorSayButton.style.backgroundColor = authorSayExists
          ? "#fbbc05"
          : "#ccc";
        authorSayButton.style.cursor = authorSayExists
          ? "pointer"
          : "not-allowed";
        authorSayButton.textContent = includeAuthorSay
          ? i18n.excludeAuthorSay
          : i18n.includeAuthorSay;

        spinnerOverlay.style.display = "none";
      }
    }, 0);
  }

  // --- Event Handlers ---

  // Custom resize functionality
  let isResizing = false;
  let originalWidth, originalHeight, originalX, originalY;

  function handleResizeMouseDown(e) {
    e.preventDefault();
    isResizing = true;
    originalWidth = parseFloat(getComputedStyle(gui).width);
    originalHeight = parseFloat(getComputedStyle(gui).height);
    originalX = e.clientX;
    originalY = e.clientY;
    document.addEventListener("mousemove", handleResizeMouseMove);
    document.addEventListener("mouseup", handleResizeMouseUp);
  }

  function handleResizeMouseMove(e) {
    if (!isResizing) return;
    const width = originalWidth - (e.clientX - originalX);
    const height = originalHeight - (e.clientY - originalY);
    if (width > 300 && width < window.innerWidth * 0.8) {
      gui.style.width = width + "px";
      gui.style.right = getComputedStyle(gui).right; // Keep right fixed
    }
    if (height > 250 && height < window.innerHeight * 0.8) {
      gui.style.height = height + "px";
      gui.style.bottom = getComputedStyle(gui).bottom; // Keep bottom fixed
    }
  }

  function handleResizeMouseUp() {
    isResizing = false;
    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  }

  function handleCopyClick() {
    output.select();
    document.execCommand("copy");
    copyButton.textContent = i18n.copiedText;
    setTimeout(() => {
      copyButton.textContent = i18n.copyText;
    }, 1000);
  }

  function handleAuthorSayToggle() {
    if (authorSayButton.disabled) return;
    includeAuthorSay = !includeAuthorSay;
    authorSayButton.textContent = includeAuthorSay
      ? i18n.excludeAuthorSay
      : i18n.includeAuthorSay;
    updateOutput(); // Re-render
  }

  function handleNextChapterClick() {
    const nextChapterQuery = document.evaluate(
      NEXT_CHAPTER_XPATH,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    const nextChapterLink = nextChapterQuery.singleNodeValue;
    if (nextChapterLink && nextChapterLink.href) {
      window.location.href = nextChapterLink.href;
    } else {
      nextChapterButton.textContent = i18n.noNextChapter;
      nextChapterButton.style.backgroundColor = "#ea4335";
      setTimeout(() => {
        nextChapterButton.textContent = i18n.nextChapter;
        nextChapterButton.style.backgroundColor = "#34a853";
      }, 2000);
    }
  }

  // --- Initialization ---

  setupGUI(); // Create and append GUI elements

  // Add event listeners
  resizeHandle.addEventListener("mousedown", handleResizeMouseDown);
  copyButton.addEventListener("click", handleCopyClick);
  authorSayButton.addEventListener("click", handleAuthorSayToggle);
  nextChapterButton.addEventListener("click", handleNextChapterClick);

  // Initial content extraction
  updateOutput();

  // Set up MutationObserver to re-run extraction if chapter content changes dynamically
  const chapterWrapperQuery = document.evaluate(
    CHAPTER_WRAPPER_XPATH,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const chapterWrapper = chapterWrapperQuery.singleNodeValue;
  if (chapterWrapper) {
    const observer = new MutationObserver(() => {
      console.log("Chapter wrapper mutation detected, updating output.");
      updateOutput();
    });
    observer.observe(chapterWrapper, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  } else {
    console.error("Chapter wrapper element not found for MutationObserver.");
  }
})();
