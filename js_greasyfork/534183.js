// ==UserScript==
// @name         Pollinations.ai Enhancer
// @namespace    https://greasyfork.org/en/users/1462897-fisventurous
// @version      1.9.4
// @description  Enhanced markdown formatting for pollinations.ai with better readability, and smoother viewing
// @author       fisventurous
// @match        *://*.pollinations.ai/*
// @connect      *
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534183/Pollinationsai%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/534183/Pollinationsai%20Enhancer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const THEME_KEY = "pollinations_enhancer_theme";
    const FONT_SIZE_KEY = "pollinations_enhancer_fontsize";

    let observer = null;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        const hostname = window.location.hostname;
    
        if (!hostname.startsWith('text.pollinations.ai') && !hostname.startsWith('image.pollinations.ai')) {
            console.log("Pollinations Enhancer: Skipping execution on unsupported domain:", hostname);
            if (document.readyState === "loading") {
                document.removeEventListener("DOMContentLoaded", init);
            }
            return;
        }
    
        addStyles();
        applyTheme();
        applyFontSize();
    
        const pageType = detectPageType();
        setupLinkPreviews();
    
        if (pageType.isText) enhanceTextPage();
        else if (pageType.isImage) enhanceImagePage();
        else if (pageType.isAudio) enhanceAudioPage();
        else createCommonButtons(extractUrlParameters(), "unknown");
    
        if (pageType.isText)
            updateThemeToggleButton(
                document.body.classList.contains("theme-dark"),
            );
    
        startObserver(pageType);
    }

    function detectPageType() {
        const url = window.location.href.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);

        let isImage = false;
        let isAudio = false;
        let isText = false;

        if (
            url.includes("image.pollinations.ai") ||
            url.includes("/image/")
        ) {
            isImage = true;
        } else if (
            url.includes("audio") ||
            url.match(/\.(mp3|wav|ogg|m4a)(\?|$)/i)
        ) {
            isAudio = true;
        } else if (url.includes("text.pollinations.ai")) {
            isText = true;
        }

        if (!isImage && !isAudio && !isText) {
            const model = urlParams.get("model") || "";
            const hasVoice = urlParams.has("voice");

            if (model.includes("audio") || hasVoice) {
                isAudio = true;
            } else if (model.includes("image")) {
                isImage = true;
            }
        }

        if (!isImage && !isAudio && !isText) {
            if (document.querySelector('img:not([width="16"][height="16"])')) {
                isImage = true;
            } else if (
                document.querySelector('audio, video, [type*="audio"]')
            ) {
                isAudio = true;
            } else {
                isText = true;
            }
        }

        return { isText, isImage, isAudio };
    }

    function startObserver(pageType) {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (
                    mutation.type === "childList" &&
                    mutation.addedNodes.length
                ) {
                    if (
                        pageType.isImage &&
                        !document.getElementById("save-image-btn")
                    ) {
                        const newImages = Array.from(mutation.addedNodes).filter(
                            (node) =>
                                node.tagName === "IMG" ||
                                (node.querySelectorAll &&
                                    node.querySelectorAll("img").length),
                        );

                        if (newImages.length) {
                            setTimeout(enhanceImagePage, 100);
                        }
                    }

                    if (
                        pageType.isAudio &&
                        !document.getElementById("save-audio-btn")
                    ) {
                        const newAudio = Array.from(mutation.addedNodes).filter(
                            (node) =>
                                node.tagName === "AUDIO" ||
                                node.tagName === "VIDEO" ||
                                (node.querySelectorAll &&
                                    (node.querySelectorAll("audio").length ||
                                        node.querySelectorAll("video")
                                            .length ||
                                        node.querySelectorAll(
                                            'source[type*="audio"]',
                                        ).length)),
                        );

                        if (newAudio.length) {
                            setTimeout(enhanceAudioPage, 100);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function applyTheme() {
        const savedTheme = GM_getValue(THEME_KEY, "theme-dark");
        document.body.classList.remove("theme-dark", "theme-light");
        document.body.classList.add(savedTheme);
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains("theme-dark");
        const newTheme = isDark ? "theme-light" : "theme-dark";
        document.body.classList.remove("theme-dark", "theme-light");
        document.body.classList.add(newTheme);
        GM_setValue(THEME_KEY, newTheme);
        updateThemeToggleButton(newTheme === "theme-dark");
    }

    function updateThemeToggleButton(isDark) {
        const btn = document.getElementById("theme-toggle-btn");
        if (btn) {
            btn.innerHTML = isDark
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    }

    function setupLinkPreviews() {
        const preview = document.createElement("div");
        preview.className = "preview";
        document.body.appendChild(preview);
        let showTimeout = null,
            hideTimeout = null,
            currentLink = null;

        document.body.addEventListener("mouseover", (e) => {
            const link = e.target.closest("a");
            if (link && link.href) {
                clearTimeout(hideTimeout);
                if (currentLink !== link) {
                    currentLink = link;
                    clearTimeout(showTimeout);
                    showTimeout = setTimeout(
                        () => showPreview(link, preview),
                        200,
                    );
                }
            }
        });

        document.body.addEventListener("mouseout", (e) => {
            if (e.target.closest("a")) {
                clearTimeout(showTimeout);
                hideTimeout = setTimeout(() => {
                    preview.style.opacity = "0";
                    setTimeout(() => {
                        preview.style.display = "none";
                        currentLink = null;
                    }, 150);
                }, 200);
            }
        });

        preview.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
        preview.addEventListener("mouseleave", () => {
            hideTimeout = setTimeout(() => {
                preview.style.opacity = "0";
                setTimeout(() => {
                    preview.style.display = "none";
                    currentLink = null;
                }, 150);
            }, 200);
        });
    }

    function showPreview(link, preview) {
        try {
            const url = link.href;
            const rect = link.getBoundingClientRect();
            let sourceName = "Source",
                faviconUrl = "";
            try {
                const urlObj = new URL(url);
                sourceName = urlObj.hostname.replace(/^www\./, "");
                faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
            } catch (err) {}
            let contentHTML = link.textContent?.trim() || url;
            if (link.closest("pre, code"))
                contentHTML = `<code class="inline-code">${contentHTML}</code>`;
            preview.innerHTML = `<div class="preview-header"><div class="preview-icon">${faviconUrl ? `<img src="${faviconUrl}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${sourceName.charAt(0).toUpperCase()}';" />` : sourceName.charAt(0).toUpperCase()}</div><div>${sourceName}</div></div><div class="preview-content">${contentHTML}</div><div class="preview-url">${url}</div>`;
            preview.style.opacity = 0;
            preview.style.display = "block";
            requestAnimationFrame(() => {
                const previewRect = preview.getBoundingClientRect();
                const winWidth = window.innerWidth,
                    winHeight = window.innerHeight;
                let top = rect.bottom + window.scrollY + 5,
                    left = rect.left + window.scrollX;
                if (left + previewRect.width > winWidth - 10)
                    left = winWidth - previewRect.width - 10;
                if (left < 10) left = 10;
                if (top + previewRect.height > winHeight + window.scrollY - 10)
                    top = rect.top + window.scrollY - previewRect.height - 5;
                if (top < window.scrollY + 10) top = window.scrollY + 10;
                preview.style.top = `${top}px`;
                preview.style.left = `${left}px`;
                preview.classList.add("active");
                preview.style.opacity = 1;
            });
        } catch (e) {
            console.error("Pollinations Enhancer: Error showing preview", e);
            preview.classList.remove("active");
        }
    }

    function enhanceTextPage() {
        document.body.classList.add("text-enhanced");
        const params = extractUrlParameters();
        let contentContainer = null;
        let originalContent = "";

        try {
            contentContainer = document.querySelector(
                "main:not(:empty), article:not(:empty), .content:not(:empty), #content:not(:empty), .main-content:not(:empty), .post-content:not(:empty)",
            );

            if (
                !contentContainer &&
                document.body.children.length === 1 &&
                document.body.firstElementChild?.tagName === "PRE"
            ) {
                contentContainer = document.body.firstElementChild;
            }

            if (
                !contentContainer &&
                (document.body.innerText || document.body.textContent || "")
                    .trim().length > 50
            ) {
                contentContainer = document.createElement("div");
                contentContainer.className = "content-container-generated";
                while (
                    document.body.firstChild &&
                    (!document.body.firstChild.matches ||
                        !document.body.firstChild.matches(
                            "#pollinations-enhancer-buttons, .preview, script, style, #metadata-box",
                        ))
                ) {
                    contentContainer.appendChild(document.body.firstChild);
                }
                document.body.appendChild(contentContainer);
            }

            if (contentContainer) {
                contentContainer.classList.add("content-container");
                originalContent =
                    contentContainer.innerText ||
                    contentContainer.textContent ||
                    "";

                if (params.json === "true") {
                    const jsonText = originalContent;
                    contentContainer.innerHTML = "";

                    const pre = document.createElement("pre");
                    pre.className = "code-block-container";

                    const header = document.createElement("div");
                    header.className = "code-header";

                    const langSpan = document.createElement("span");
                    langSpan.className = "code-language";
                    langSpan.textContent = "json";

                    const copyBtn = document.createElement("button");
                    copyBtn.className = "code-copy-btn";
                    copyBtn.title = "Copy code";
                    copyBtn.textContent = "Copy";
                    copyBtn.addEventListener("click", () => {
                        navigator.clipboard
                            .writeText(jsonText)
                            .then(() => {
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = "Copied!";
                                setTimeout(() => {
                                    copyBtn.textContent = originalText;
                                }, 1500);
                            })
                            .catch((err) => {
                                console.error("Failed to copy JSON:", err);
                            });
                    });

                    header.appendChild(langSpan);
                    header.appendChild(copyBtn);

                    const code = document.createElement("code");
                    code.className = "language-json";
                    code.textContent = jsonText;

                    pre.appendChild(header);
                    pre.appendChild(code);
                    contentContainer.appendChild(pre);
                } else {
                    if (contentContainer.tagName !== "PRE") {
                        processMarkdown(contentContainer);
                    } else {
                        const preContent = contentContainer.textContent || "";
                        contentContainer.innerHTML = "";

                        const preWrapper = document.createElement("pre");
                        preWrapper.className = "code-block-container";

                        const header = document.createElement("div");
                        header.className = "code-header";
                        const langSpan = document.createElement("span");
                        langSpan.className = "code-language";
                        langSpan.textContent = "text";
                        const copyBtn = document.createElement("button");
                        copyBtn.className = "code-copy-btn";
                        copyBtn.title = "Copy code";
                        copyBtn.textContent = "Copy";
                        copyBtn.addEventListener("click", () => {
                            navigator.clipboard
                                .writeText(preContent)
                                .then(() => {
                                    const originalText = copyBtn.textContent;
                                    copyBtn.textContent = "Copied!";
                                    setTimeout(() => {
                                        copyBtn.textContent = originalText;
                                    }, 1500);
                                })
                                .catch((err) => {
                                    console.error(
                                        "Failed to copy preformatted text:",
                                        err,
                                    );
                                });
                        });

                        header.appendChild(langSpan);
                        header.appendChild(copyBtn);

                        const code = document.createElement("code");
                        code.className = "language-text";
                        code.textContent = preContent;

                        preWrapper.appendChild(header);
                        preWrapper.appendChild(code);
                        contentContainer.appendChild(preWrapper);
                    }
                }
            } else {
                console.warn(
                    "Pollinations Enhancer: Could not find suitable content container.",
                );
            }
        } catch (error) {
            console.error(
                "Pollinations Enhancer: Error enhancing text page:",
                error,
            );
        }

        createCommonButtons(params, "text", contentContainer, originalContent);
    }

    function processMarkdown(container) {
        if (!container) return;

        container.innerHTML = container.innerHTML
            .replace(/<span class="[^"]*">/g, "")
            .replace(/<\/span>/g, "");

        const codeBlocks = [];
        let codeBlockCount = 0;

        container.innerHTML = container.innerHTML.replace(
            /```(\w*)\n([\s\S]*?)```/g,
            (match, lang, code) => {
                const placeholder = `<!--CODEBLOCK_${codeBlockCount}-->`;
                codeBlocks.push({
                    placeholder,
                    language: lang || "text",
                    code: code.replace(/`/g, "`"),
                });
                codeBlockCount++;
                return placeholder;
            },
        );

        const originalHtml = container.innerHTML;

        const content = container.textContent;

        const blockquoteHtml = processBlockquotes(content);

        if (blockquoteHtml !== content) {
            const processedWithCodeBlocksPreserved = restoreCodeBlocks(
                blockquoteHtml,
                originalHtml,
            );
            container.innerHTML = processedWithCodeBlocksPreserved;
        }

        container.innerHTML = container.innerHTML.replace(
            /^(#{1,6})\s+(.+)$/gm,
            function (match, hashes, content) {
                const level = hashes.length;
                return `<h${level}>${content}</h${level}>`;
            },
        );

        container.innerHTML = container.innerHTML.replace(
            /^---+$/gm,
            '<hr class="markdown-hr">',
        );

        container.innerHTML = processLists(container.innerHTML);

        container.innerHTML = container.innerHTML
            .replace(/\*\*(.*?)\*\*|__(.*?)__/g, "<strong>$1$2</strong>")
            .replace(/\*(.*?)\*|_(.*?)_/g, "<em>$1$2</em>")
            .replace(/~~(.*?)~~/g, "<del>$1</del>")
            .replace(
                /\[([^\]]+?)\]\((https?:\/\/[^)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
            )
            .replace(/`([^`]+?)`/g, '<code class="inline-code">$1</code>');

        for (let i = 0; i < codeBlocks.length; i++) {
            const block = codeBlocks[i];
            const html = `<pre class="code-block-container"><div class="code-header"><span class="code-language">${block.language}</span><button class="code-copy-btn" title="Copy code">Copy</button></div><code class="language-${block.language}">${block.code}</code></pre>`;
            container.innerHTML = container.innerHTML.replace(
                block.placeholder,
                html,
            );
        }

        const copyButtons = container.querySelectorAll(".code-copy-btn");
        copyButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const codeBlock = btn.parentElement.nextElementSibling;
                const textToCopy = codeBlock.textContent;
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = "Copied!";
                        setTimeout(() => {
                            btn.textContent = originalText;
                        }, 1500);
                    })
                    .catch((err) => {
                        console.error("Failed to copy code:", err);
                    });
            });
        });
    }

    function processBlockquotes(text) {
        const lines = text.split("\n");
        let result = [];
        let inMultiBlockquote = false;
        let blockquoteContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith(">>>")) {
                if (inMultiBlockquote) {
                    result.push(
                        `<blockquote class="blockquote-multi">${blockquoteContent.join(" ")}</blockquote>`,
                    );
                }
                inMultiBlockquote = true;
                const initial = trimmedLine.substring(3).trim();
                blockquoteContent = initial ? [initial] : [];
                continue;
            }

            if (inMultiBlockquote) {
                if (trimmedLine === "" || trimmedLine.startsWith(">")) {
                    result.push(
                        `<blockquote class="blockquote-multi">${blockquoteContent.join(" ")}</blockquote>`,
                    );
                    inMultiBlockquote = false;
                    blockquoteContent = [];
                    if (trimmedLine === "") {
                        result.push("");
                        continue;
                    }
                } else {
                    blockquoteContent.push(trimmedLine);
                    continue;
                }
            }

            if (trimmedLine === ">") {
                result.push("");
                continue;
            }

            if (trimmedLine.startsWith("> ")) {
                const content = trimmedLine.substring(2);
                if (content) {
                    result.push(
                        `<blockquote class="blockquote-single">${content}</blockquote>`,
                    );
                } else {
                    result.push("");
                }
                continue;
            }

            result.push(line);
        }

        if (inMultiBlockquote) {
            result.push(
                `<blockquote class="blockquote-multi">${blockquoteContent.join(" ")}</blockquote>`,
            );
        }

        return result.join("\n");
    }

    function restoreCodeBlocks(blockquoteHtml, originalHtml) {
        const placeholders = [];
        const regex = /<!--CODEBLOCK_\d+-->/g;
        let match;
        while ((match = regex.exec(originalHtml)) !== null) {
            placeholders.push(match[0]);
        }

        if (placeholders.length === 0) {
            return blockquoteHtml;
        }

        const blockquoteLines = blockquoteHtml.split("\n");
        const originalLines = originalHtml.split("\n");

        let placeholderIndex = 0;
        for (let i = 0; i < originalLines.length; i++) {
            if (
                originalLines[i].includes("<!--CODEBLOCK_") &&
                placeholderIndex < placeholders.length
            ) {
                const placeholder = placeholders[placeholderIndex];

                const insertPosition = Math.min(i, blockquoteLines.length);
                blockquoteLines.splice(insertPosition, 0, placeholder);

                placeholderIndex++;
            }
        }

        return blockquoteLines.join("\n");
    }

    function processLists(text) {
        const lines = text.split("\n");
        let result = [];
        let lastWasNumbered = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);

            const dashMatch = line.match(/^[-*]\s+(.*)/);

            if (numberedMatch) {
                const num = numberedMatch[1];
                const content = numberedMatch[2];
                result.push(
                    `<div class="numbered-item">${num}. ${content}</div>`,
                );
                lastWasNumbered = true;
            } else if (dashMatch && lastWasNumbered) {
                const content = dashMatch[1];
                result.push(
                    `<div class="nested-bullet-item">${content}</div>`,
                );
            } else if (dashMatch) {
                const content = dashMatch[1];
                result.push(`<div class="bullet-item">${content}</div>`);
            } else if (line.trim() === "") {
                result.push(line);
                lastWasNumbered = false;
            } else {
                result.push(line);
                lastWasNumbered = false;
            }
        }

        return result.join("\n");
    }

    function enhanceImagePage() {
        let mainImage = null;
        removeExistingButtons();

        try {
            const directImages = document.querySelectorAll("body > img");
            if (directImages.length > 0) {
                let largestArea = 0;
                directImages.forEach((img) => {
                    if (img.complete) {
                        const area = img.naturalWidth * img.naturalHeight;
                        if (area > largestArea) {
                            largestArea = area;
                            mainImage = img;
                        }
                    } else {
                        img.addEventListener("load", () => {
                            setTimeout(enhanceImagePage, 100);
                        });
                    }
                });
            }

            if (!mainImage) {
                const allImages = document.querySelectorAll("img");
                let largestArea = 0;

                allImages.forEach((img) => {
                    if (img.width < 30 || img.height < 30) return;

                    const area =
                        img.naturalWidth * img.naturalHeight ||
                        img.width * img.height;
                    if (area > largestArea) {
                        largestArea = area;
                        mainImage = img;
                    }
                });
            }
        } catch (error) {
            console.error(
                "Pollinations Enhancer: Error finding image element:",
                error,
            );
        }

        const params = extractUrlParameters();
        if (mainImage) {
            params.width = mainImage.naturalWidth || mainImage.width || 0;
            params.height = mainImage.naturalHeight || mainImage.height || 0;
            createCommonButtons(params, "image", mainImage);
        } else {
            setTimeout(enhanceImagePage, 500);
        }
    }

    function enhanceAudioPage() {
        removeExistingButtons();
        const params = extractUrlParameters();
        let audioSrc = findAudioSource();

        if (!audioSrc) {
            audioSrc = window.location.href;
        }

        createCommonButtons(params, "audio", null, "", audioSrc);
    }

    function removeExistingButtons() {
        const existingContainer = document.getElementById(
            "pollinations-enhancer-buttons",
        );
        if (existingContainer) existingContainer.remove();

        const existingMetadata = document.getElementById("metadata-box");
        if (existingMetadata) existingMetadata.remove();
    }

    function findAudioSource() {
        const audioExtRegex = /\.(mp3|wav|ogg|m4a|flac|aac)(\?|$)/i;

        const audioElements = document.querySelectorAll("audio, video");
        for (const el of audioElements) {
            if (el.src && el.src.length > 10) {
                return el.src;
            }

            for (const source of el.querySelectorAll("source")) {
                if (source.src && source.src.length > 10) {
                    return source.src;
                }
            }
        }

        for (const link of document.querySelectorAll("a[href]")) {
            try {
                const url = new URL(
                    link.getAttribute("href"),
                    window.location.href,
                );
                if (
                    audioExtRegex.test(url.pathname) ||
                    url.pathname.includes("/audio/")
                ) {
                    return url.href;
                }
            } catch (e) {}
        }

        for (const el of document.querySelectorAll(
            '[type*="audio"], [src*=".mp3"], [src*="/audio/"]',
        )) {
            const src = el.getAttribute("src") || el.getAttribute("data-src");
            if (src && src.length > 10) {
                return new URL(src, window.location.href).href;
            }
        }

        const metaOgAudio = document.querySelector(
            'meta[property="og:audio"], meta[property="og:audio:url"]',
        );
        if (metaOgAudio && metaOgAudio.content) {
            return metaOgAudio.content;
        }

        const htmlContent = document.documentElement.outerHTML;
        const audioUrlMatches = htmlContent.match(
            /https?:\/\/[^"'\s]+\.(mp3|wav|ogg|m4a)(\?[^"'\s]*)?/gi,
        );
        if (audioUrlMatches && audioUrlMatches.length) {
            return audioUrlMatches[0];
        }

        return null;
    }

    function createCommonButtons(
        params,
        type,
        targetElement = null,
        originalContent = "",
        resourceUrl = "",
    ) {
        try {
            removeExistingButtons();

            const buttonContainer = document.createElement("div");
            buttonContainer.id = "pollinations-enhancer-buttons";
            buttonContainer.style.cssText =
                "position: fixed; top: 10px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;";

            if (type === "text") {
                const themeToggleBtn = createButton(
                    "theme-toggle-btn",
                    "Toggle theme (Light/Dark)",
                    "",
                    toggleTheme,
                );
                buttonContainer.appendChild(themeToggleBtn);
            }
            if (type === "text" && targetElement) {
                const copyContentBtn = createButton(
                    "copy-content-btn",
                    "Copy text content",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
                    () => {
                        navigator.clipboard
                            .writeText(
                                originalContent ||
                                    (targetElement.innerText ||
                                        targetElement.textContent ||
                                        ""),
                            )
                            .then(
                                () => flashButton(copyContentBtn, true),
                                () => flashButton(copyContentBtn, false),
                            );
                    },
                );
                buttonContainer.appendChild(copyContentBtn);

                const fontSizeContainer = document.createElement("div");
                fontSizeContainer.className = "font-size-controls";
                fontSizeContainer.style.cssText =
                    "position: relative; right: 41px; display: flex; gap: 5px;";

                const increaseFontBtn = createButton(
                    "increase-font-btn",
                    "Increase text size",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
                    increaseFontSize,
                );
                const decreaseFontBtn = createButton(
                    "decrease-font-btn",
                    "Decrease text size",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
                    decreaseFontSize,
                );

                fontSizeContainer.appendChild(increaseFontBtn);
                fontSizeContainer.appendChild(decreaseFontBtn);
                buttonContainer.appendChild(fontSizeContainer);
            }
            if (type === "image" && targetElement?.src) {
                const saveImageBtn = createButton(
                    "save-image-btn",
                    "Save image (Stripped EXIF)",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
                    () =>
                        downloadResource(
                            targetElement.src,
                            `pollinations-image-${Date.now()}.jpg`,
                            saveImageBtn,
                            "image",
                        ),
                );
                buttonContainer.appendChild(saveImageBtn);
            }
            if (type === "audio" && resourceUrl) {
                const saveAudioBtn = createButton(
                    "save-audio-btn",
                    "Save audio",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
                    () =>
                        downloadResource(
                            resourceUrl,
                            `pollinations-audio-${Date.now()}.mp3`,
                            saveAudioBtn,
                            "audio",
                        ),
                );
                buttonContainer.appendChild(saveAudioBtn);
            }
            const hasMetadata =
                params.model ||
                params.prompt ||
                params.seed ||
                params.voice ||
                params.width ||
                params.system ||
                params.private ||
                params.nologo;
            if (hasMetadata) {
                const metadataBtn = createButton(
                    "metadata-btn",
                    "View metadata",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
                    () => {
                        const box = document.getElementById("metadata-box");
                        if (box) {
                            box.classList.toggle("visible");
                            if (box.classList.contains("visible"))
                                box.classList.remove("collapsed");
                            updateMetadataToggleIcon(box);
                        }
                    },
                );
                buttonContainer.appendChild(metadataBtn);
                createMetadataBox(params, type);
            }
            if (buttonContainer.hasChildNodes())
                document.body.appendChild(buttonContainer);
        } catch (error) {
            console.error(
                "Pollinations Enhancer: Error creating common buttons:",
                error,
            );
        }
    }

    function increaseFontSize() {
        const currentScale = parseFloat(GM_getValue(FONT_SIZE_KEY, "1")) || 1;
        const newScale = Math.min(currentScale + 0.1, 2.0).toFixed(1);
        GM_setValue(FONT_SIZE_KEY, newScale);
        applyFontSize();
    }

    function decreaseFontSize() {
        const currentScale = parseFloat(GM_getValue(FONT_SIZE_KEY, "1")) || 1;
        const newScale = Math.max(currentScale - 0.1, 0.7).toFixed(1);
        GM_setValue(FONT_SIZE_KEY, newScale);
        applyFontSize();
    }

    function applyFontSize() {
        const scale = GM_getValue(FONT_SIZE_KEY, "1") || "1";
        const existingStyle = document.getElementById("font-size-style");
        if (existingStyle) existingStyle.remove();

        const styleEl = document.createElement("style");
        styleEl.id = "font-size-style";
        styleEl.textContent = `
            .content-container {
                font-size: calc(17px * ${scale}) !important;
                line-height: 1.5 !important;
                transform: scale(1) !important;
            }
        `;
        document.head.appendChild(styleEl);
    }

    function createButton(id, title, innerHTML, onClick) {
        const btn = document.createElement("div");
        btn.id = id;
        btn.className = "p-btn";
        btn.title = title;
        btn.innerHTML = innerHTML;
        btn.addEventListener("click", onClick);
        btn.style.position = "relative";
        btn.style.margin = "0";
        return btn;
    }

    function flashButton(button, success) {
        if (!button) return;
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = success
            ? "var(--success-color)"
            : "var(--error-color)";
        button.style.transform = "scale(1.1)";
        setTimeout(() => {
            if (button) {
                button.style.backgroundColor = originalColor;
                button.style.transform = "scale(1)";
            }
        }, 1000);
    }

    function downloadResource(
        url,
        filename,
        buttonToFlash,
        resourceType = "unknown",
    ) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function (response) {
                if (response.status === 200 && response.response) {
                    const originalBlob = response.response;

                    if (
                        resourceType === "image" &&
                        originalBlob.type.startsWith("image/")
                    ) {
                        const img = document.createElement("img");
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        const objectURL = URL.createObjectURL(originalBlob);

                        img.onload = () => {
                            try {
                                canvas.width = img.naturalWidth;
                                canvas.height = img.naturalHeight;
                                ctx.drawImage(img, 0, 0);

                                let mimeType = originalBlob.type;
                                if (
                                    ![
                                        "image/jpeg",
                                        "image/png",
                                        "image/webp",
                                    ].includes(mimeType)
                                ) {
                                    mimeType = "image/jpeg";
                                    filename = filename.replace(
                                        /\.[^.]+$/,
                                        ".jpg",
                                    );
                                }

                                canvas.toBlob(
                                    (processedBlob) => {
                                        if (processedBlob) {
                                            triggerDownload(
                                                processedBlob,
                                                filename,
                                                buttonToFlash,
                                                true,
                                            );
                                        } else {
                                            triggerDownload(
                                                originalBlob,
                                                filename,
                                                buttonToFlash,
                                                false,
                                            );
                                        }
                                        URL.revokeObjectURL(objectURL);
                                    },
                                    mimeType,
                                    0.92,
                                );
                            } catch (e) {
                                URL.revokeObjectURL(objectURL);
                                triggerDownload(
                                    originalBlob,
                                    filename,
                                    buttonToFlash,
                                    false,
                                );
                            }
                        };

                        img.onerror = () => {
                            URL.revokeObjectURL(objectURL);
                            triggerDownload(
                                originalBlob,
                                filename,
                                buttonToFlash,
                                false,
                            );
                        };

                        img.src = objectURL;
                    } else {
                        triggerDownload(
                            originalBlob,
                            filename,
                            buttonToFlash,
                            true,
                        );
                    }
                } else {
                    if (buttonToFlash) flashButton(buttonToFlash, false);
                    tryDirectDownload(url, filename, buttonToFlash);
                }
            },
            onerror: function (response) {
                if (buttonToFlash) flashButton(buttonToFlash, false);
                tryDirectDownload(url, filename, buttonToFlash);
            },
        });
    }

    function triggerDownload(blob, filename, buttonToFlash, successStatus) {
        try {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            if (buttonToFlash) flashButton(buttonToFlash, successStatus);
        } catch (e) {
            if (buttonToFlash) flashButton(buttonToFlash, false);
        }
    }

    function tryDirectDownload(url, filename, buttonToFlash) {
        try {
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            if (buttonToFlash) flashButton(buttonToFlash, false);
        }
    }

    function createMetadataBox(params, type) {
        const existingBox = document.getElementById("metadata-box");
        if (existingBox) existingBox.remove();

        const metadataBox = document.createElement("div");
        metadataBox.id = "metadata-box";
        metadataBox.className = "meta-box";

        let contentHTML = "";

        if (params.model) contentHTML += createMetaRow("Model", params.model);
        if (params.prompt)
            contentHTML += createMetaRow("Prompt", params.prompt, true);
        if (params.seed) contentHTML += createMetaRow("Seed", params.seed);
        if (params.private)
            contentHTML += createMetaRow("Private", params.private);
        if (params.json) contentHTML += createMetaRow("JSON Mode", params.json);

        if (type === "image") {
            if (params.width && params.height)
                contentHTML += createMetaRow(
                    "Size",
                    `${params.width} × ${params.height}`,
                );
            if (params.guidance_scale)
                contentHTML += createMetaRow(
                    "Guidance Scale",
                    params.guidance_scale,
                );
            if (params.negative_prompt)
                contentHTML += createMetaRow(
                    "Negative Prompt",
                    params.negative_prompt,
                    true,
                );
            if (params.strength)
                contentHTML += createMetaRow("Strength", params.strength);
            if (params.steps)
                contentHTML += createMetaRow("Steps", params.steps);
            if (params.nologo)
                contentHTML += createMetaRow("No Logo", params.nologo);
        }

        if (type === "audio") {
            if (params.voice)
                contentHTML += createMetaRow("Voice", params.voice);
            if (params.format)
                contentHTML += createMetaRow("Format", params.format);
        }

        if (type === "text") {
            if (params.system)
                contentHTML += createMetaRow("System", params.system, true);
            if (params.language)
                contentHTML += createMetaRow("Language", params.language);
            if (params.modalities)
                contentHTML += createMetaRow("Modalities", params.modalities);
        }

        if (!contentHTML.trim()) return;

        metadataBox.innerHTML = `
            <div class="meta-header" title="Click to toggle details">
                <span>${type.charAt(0).toUpperCase() + type.slice(1)} Parameters</span>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="meta-content">${contentHTML}</div>
        `;

        document.body.appendChild(metadataBox);

        metadataBox.querySelector(".meta-header").addEventListener("click", () => {
            if (metadataBox.classList.contains("visible")) {
                metadataBox.classList.toggle("collapsed");
            } else {
                metadataBox.classList.add("visible");
                metadataBox.classList.remove("collapsed");
            }
            updateMetadataToggleIcon(metadataBox);
        });

        metadataBox
            .querySelectorAll(".copy-btn[data-copy-target]")
            .forEach((copyBtn) => {
                const targetLabel = copyBtn.getAttribute("data-copy-target");
                const paramKey = targetLabel.toLowerCase().replace(" ", "_");
                const textToCopy = params[paramKey];
                if (textToCopy) {
                    copyBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        navigator.clipboard
                            .writeText(textToCopy)
                            .then(() => {
                                copyBtn.textContent = "✓";
                                setTimeout(() => {
                                    copyBtn.textContent = "📋";
                                }, 1200);
                            })
                            .catch((err) =>
                                console.error(
                                    `Failed to copy ${targetLabel}:`,
                                    err,
                                ),
                            );
                    });
                } else {
                    copyBtn.style.display = "none";
                }
            });

        updateMetadataToggleIcon(metadataBox);
    }

    function updateMetadataToggleIcon(box) {
        const icon = box?.querySelector(".toggle-icon");
        if (icon)
            icon.textContent = box.classList.contains("collapsed") ? "▼" : "▲";
    }

    function createMetaRow(label, value, addCopyButton = false) {
        if (!value) return "";
        const cleanValue = String(value)
            .replace(/</g, "<")
            .replace(/>/g, ">");
        const copyBtnHTML = addCopyButton
            ? `<span class="copy-btn" title="Copy ${label}" data-copy-target="${label}">📋</span>`
            : "";
        return `<div class="meta-row"><div class="meta-label">${label}:</div><div class="meta-value">${cleanValue}${copyBtnHTML}</div></div>`;
    }

    function sanitizePrompt(text) {
        if (!text) return "";
        try {
            let decoded = text;
            for (let i = 0; i < 3; i++) {
                if (decoded.includes("%")) decoded = decodeURIComponent(decoded);
                else break;
            }
            return decoded.replace(/\+/g, " ").replace(/\uFFFD/gu, "").trim();
        } catch (e) {
            return text.replace(/\+/g, " ").replace(/%20/g, " ").trim();
        }
    }

    function extractUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const path = window.location.pathname;
        let rawPrompt = "";
        if (urlParams.has("prompt")) {
            rawPrompt = urlParams.get("prompt");
        } else {
            const promptFromPath = decodeURIComponent(path)
                .split("/")
                .filter(Boolean)
                .pop();
            if (promptFromPath) rawPrompt = promptFromPath;
        }

        return {
            prompt: sanitizePrompt(rawPrompt),
            model: urlParams.get("model") || "",
            seed: urlParams.get("seed") || "",
            voice: urlParams.get("voice") || "",
            width: urlParams.get("width") || "",
            height: urlParams.get("height") || "",
            system: sanitizePrompt(urlParams.get("system") || ""),
            private: urlParams.get("private") || "",
            format: urlParams.get("format") || "",
            modalities: urlParams.get("modalities") || "",
            guidance_scale: urlParams.get("guidance_scale") || "",
            negative_prompt: sanitizePrompt(
                urlParams.get("negative_prompt") || "",
            ),
            strength: urlParams.get("strength") || "",
            steps: urlParams.get("steps") || "",
            language: urlParams.get("language") || "",
            json: urlParams.get("json") || "",
            nologo: urlParams.get("nologo") || "",
        };
    }

    function addStyles() {
        GM_addStyle(`
            :root { --text-color: #f0f0f0; --bg-color: #1a1a1a; --accent: #3498db; --accent-hover: #2980b9; --light-bg: #f2f2f2; --light-text: #333333; --light-content-bg: #ffffff; --dark-content-bg: #2d2d2d; --border-color-dark: #444; --border-color-light: #ddd; --button-bg: #333; --button-hover-bg: #444; --success-color: #27ae60; --error-color: #e74c3c; }
            body.theme-light { background-color: var(--light-bg) !important; color: var(--light-text) !important; }
            body.theme-dark { background-color: var(--bg-color) !important; color: var(--text-color) !important; }
            body { transition: background-color 0.3s, color 0.3s; }
            .p-btn { background-color: var(--accent); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 5px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.2); flex-shrink: 0; }
            .p-btn:hover { background-color: var(--accent-hover); transform: scale(1.05); }
            .p-btn svg { pointer-events: none; }
            .font-size-controls { display: flex; gap: 5px; justify-content: center; }
            .meta-box { position: fixed; bottom: 20px; right: 20px; background-color: rgba(45, 45, 45, 0.9); color: var(--text-color); border-radius: 8px; padding: 12px; max-width: 320px; width: auto; font-size: 13px; line-height: 1.5; z-index: 9998; transition: opacity 0.3s, transform 0.3s, height 0.3s ease-out; box-shadow: 0 4px 15px rgba(0,0,0,0.3); opacity: 0; transform: translateY(10px); pointer-events: none; overflow: hidden; backdrop-filter: blur(3px); }
            body.theme-light .meta-box { background-color: rgba(255, 255, 255, 0.9); color: var(--light-text); }
            .meta-box.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
            .meta-box.collapsed { height: 24px; padding-top: 5px; padding-bottom: 5px; min-height: 24px; }
            .meta-box.collapsed .meta-content { display: none; }
            .meta-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; cursor: pointer; user-select: none; font-weight: bold; }
            .meta-box.collapsed .meta-header { margin-bottom: 0; }
            .meta-header .toggle-icon { font-size: 16px; padding: 0 5px; }
            .meta-content { margin-top: 5px; }
            .meta-row { display: flex; margin-bottom: 5px; }
            .meta-label { font-weight: 600; width: 70px; color: #aaa; flex-shrink: 0; }
            body.theme-light .meta-label { color: #555; }
            .meta-value { flex: 1; word-break: break-word; }
            .copy-btn { display: inline-block; cursor: pointer; margin-left: 8px; font-size: 14px; opacity: 0.7; transition: opacity 0.2s; }
            .copy-btn:hover { opacity: 1; }
            .preview { position: absolute; display: none; max-width: 350px; background-color: #383838; color: #eee; border-radius: 6px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4); padding: 10px 12px; font-size: 13px; z-index: 10001; pointer-events: none; transition: opacity 0.15s ease-in-out; opacity: 0; border: 1px solid rgba(255, 255, 255, 0.1); }
            body.theme-light .preview { background-color: white; color: #333; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); border: 1px solid #eee; }
            .preview.active { opacity: 1; pointer-events: auto; display: block; }
            .preview-header { display: flex; align-items: center; margin-bottom: 6px; font-weight: 600; color: #f5f5f5; }
            body.theme-light .preview-header { color: #444; }
            .preview-icon { width: 16px; height: 16px; margin-right: 7px; border-radius: 3px; background-color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; overflow: hidden; flex-shrink: 0; }
            .preview-icon img { width: 100%; height: 100%; object-fit: cover; }
            .preview-content { line-height: 1.4; max-height: 100px; overflow: hidden; text-overflow: ellipsis; }
            .preview-url { font-size: 11px; color: #aaa; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            body.theme-light .preview-url { color: #777; }
            body.text-enhanced { font-family: Arial, sans-serif !important; font-size: 17px !important; line-height: 1.5 !important; }
            .content-container { max-width: 850px !important; margin: 20px auto !important; padding: 20px 30px !important; border-radius: 8px !important; }
            body.theme-dark .content-container { background-color: var(--dark-content-bg) !important; box-shadow: 0 3px 10px rgba(0,0,0,0.2); }
            body.theme-light .content-container { background-color: var(--light-content-bg) !important; box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important; }
            .content-container h1, .content-container h2, .content-container h3, .content-container h4, .content-container h5, .content-container h6 { margin-top: 0.8em !important; margin-bottom: 0.3em !important; font-weight: 600; line-height: 1.1; }
            body.theme-dark .content-container h1, body.theme-dark .content-container h2, body.theme-dark .content-container h3 { color: #eee !important; }
            body.theme-light .content-container h1, body.theme-light .content-container h2, body.theme-light .content-container h3 { color: #222 !important; }
            .content-container h3 + .code-block-container { margin-top: 0.25em !important; }
            .content-container h3:has(+ .code-block-container) { margin-bottom: 0.25em !important; }
            .content-container h1 { font-size: 2.0em !important; border-bottom: 1px solid var(--border-color-dark); padding-bottom: 0.2em; }
            .content-container h2 { font-size: 1.6em !important; border-bottom: 1px solid var(--border-color-dark); padding-bottom: 0.2em;}
            .content-container h3 { font-size: 1.3em !important; }
            body.theme-light .content-container h1, body.theme-light .content-container h2 { border-bottom-color: var(--border-color-light); }
            .content-container a { color: var(--accent) !important; text-decoration: none !important; transition: color 0.2s; }
            .content-container a:hover { color: var(--accent-hover) !important; text-decoration: underline !important; }
            .content-container blockquote,
            .content-container .blockquote-single,
            .content-container .blockquote-multi {
                border-left: 4px solid var(--accent) !important;
                padding: 8px 15px !important;
                margin: 0.8em 0 !important;
                background-color: rgba(128,128,128,0.08);
                border-radius: 0 4px 4px 0;
            }
            body.theme-dark .content-container blockquote,
            body.theme-dark .content-container .blockquote-single,
            body.theme-dark .content-container .blockquote-multi {
                color: #ccc !important;
                background-color: rgba(255,255,255,0.05);
            }
            body.theme-light .content-container blockquote,
            body.theme-light .content-container .blockquote-single,
            body.theme-light .content-container .blockquote-multi {
                color: #555 !important;
                background-color: rgba(0,0,0,0.03);
            }
            .content-container ul, .content-container ol { list-style: disc; margin: 0; padding-left: 20px; }
            .content-container ul li, .content-container ol li { margin: 0; padding: 0; line-height: 0.05; }
            .content-container ul ul, .content-container ol ol, .content-container ul ol, .content-container ol ul { margin: 0.1em 0; }
            .code-block-container ul { list-style: none; margin: 0; padding: 0; }
            .code-block-container ul li { margin: 0; }
            .content-container code:not(pre code) { font-family: 'Consolas', 'Monaco', monospace !important; background-color: rgba(128, 128, 128, 0.15) !important; padding: 2px 5px !important; border-radius: 4px !important; font-size: 0.9em; }
            .content-container pre { background-color: #262626 !important; border: 1px solid var(--border-color-dark); border-radius: 6px !important; padding: 15px !important; overflow-x: auto !important; margin: 1em 0 !important; font-family: 'Consolas', 'Monaco', monospace !important; font-size: 0.9em; line-height: 1.45; color: #eee; }
            body.theme-light .content-container pre { background-color: #f8f8f8 !important; border-color: var(--border-color-light); color: #333 !important; }
            .content-container pre code { background-color: transparent !important; padding: 0 !important; border-radius: 0 !important; font-size: inherit; }
            .content-container strong, .content-container b { font-weight: 600 !important; }
            .content-container em, .content-container i { font-style: italic !important; }
            .code-block-container {
                position: relative;
                background-color: #1e1e1e !important;
                border: 1px solid var(--border-color-dark);
                border-radius: 6px !important;
                margin: 0.50em 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            body.theme-light .code-block-container {
                background-color: #ffffff !important;
                border-color: var(--border-color-light);
            }
            .code-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: linear-gradient(90deg, rgba(30,30,30,1) 0%, rgba(45,45,45,1) 100%);
                border-bottom: 1px solid #444;
                font-family: 'Consolas', 'Monaco', monospace !important;
                font-size: 12px;
            }
            body.theme-light .code-header {
                background: linear-gradient(90deg, rgba(245,245,245,1) 0%, rgba(235,235,235,1) 100%);
                border-bottom: 1px solid #ddd;
            }
            .code-language {
                color: #aaa;
                text-transform: lowercase;
                font-weight: bold;
            }
            body.theme-light .code-language {
                color: #666;
            }
            .code-copy-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                color: #fff;
                font-size: 11px;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            body.theme-light .code-copy-btn {
                background: rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.2);
                color: #333;
            }
            .code-copy-btn:hover {
                background-color: rgba(255,255,255,0.2);
                transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            body.theme-light .code-copy-btn:hover {
                background-color: rgba(0,0,0,0.1);
                color: black;
            }
            .code-block-container code {
                display: block;
                padding: 15px !important;
                overflow-x: auto !important;
                font-family: 'Consolas', 'Monaco', monospace !important;
                font-size: 0.9em;
                line-height: 1.45;
                color: #e9e9e9;
            }
            body.theme-light .code-block-container code {
                color: #2d2d2d !important;
            }
            .inline-code {
                font-family: 'Consolas', 'Monaco', monospace !important;
                background-color: rgba(128, 128, 128, 0.15) !important;
                padding: 2px 5px !important;
                border-radius: 4px !important;
                font-size: 0.9em;
            }
            .content-container .numbered-item {
                font-weight: bold;
                margin: 0 0 0.1em 0;
                line-height: 1.1;
            }
            .content-container .nested-bullet-item {
                margin: 0 0 0.1em 0;
                line-height: 1.1;
                padding-left: 2em;
            }
            .content-container .nested-bullet-item:before {
                content: "◦ ";
                margin-right: 3px;
            }
            .content-container .bullet-item {
                margin: 0 0 0.1em 0;
                line-height: 1.1;
                padding-left: 1em;
            }
            .content-container .bullet-item:before {
                content: "• ";
                margin-right: 3px;
            }
            .content-container hr.markdown-hr {
                border: 0;
                height: 1px;
                background: var(--border-color-dark);
                margin: 0.6em 0;
            }
            body.theme-light .content-container hr.markdown-hr {
                background: var(--border-color-light);
            }
        `);
    }
})();