// ==UserScript==
// @name         V2EX Used Code Striker++
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  在 V2EX 送码帖中，根据评论和配置，自动划掉主楼/附言中被提及的 Code，并可选显示领取者。正则和关键词均可配置。
// @author       与Gemini协作完成
// @match        https://www.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533694/V2EX%20Used%20Code%20Striker%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/533694/V2EX%20Used%20Code%20Striker%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_CODE_REGEX = 'v2ex_striker_code_regex';
    const STORAGE_KEY_TITLE_KEYWORDS = 'v2ex_striker_title_keywords';
    const STORAGE_KEY_COMMENT_KEYWORDS = 'v2ex_striker_comment_keywords';
    const STORAGE_KEY_SHOW_USER = 'v2ex_striker_show_user';
    const MODAL_ID = 'v2ex-striker-settings-modal';
    const OVERLAY_ID = 'v2ex-striker-settings-overlay';

    // --- Default Settings ---
    const defaultCodeRegexString = '/(?:[A-Z0-9][-_]?){6,}/gi';
    const defaultTitleKeywords = ['送', '发', '福利', '邀请码', '激活码', '码', 'giveaway', 'invite', 'code'];
    const defaultCommentKeywords = ['用', 'used', 'taken', '领', 'redeem', 'thx', '感谢'];
    const defaultShowUserInfo = true;

    // --- Helper: Parse Regex String ---
    const defaultCodeRegexObject = new RegExp(defaultCodeRegexString.match(/^\/(.+)\/([gimyus]*)$/)[1], defaultCodeRegexString.match(/^\/(.+)\/([gimyus]*)$/)[2]);

    function parseRegexString(regexString) {
        try {
            const match = regexString.match(/^\/(.+)\/([gimyus]*)$/);
            if (match && match[1]) { // Ensure pattern part exists
                return new RegExp(match[1], match[2] || ''); // Use flags or empty string if none
            } else {
                console.warn('V2EX Striker: Invalid regex format in storage ("' + regexString + '"). Using default.');
                return defaultCodeRegexObject;
            }
        } catch (e) {
            console.error('V2EX Striker: Error parsing stored regex ("' + regexString + '"). Using default.', e);
            return defaultCodeRegexObject;
        }
    }

    // --- Load Settings ---
    const codeRegexString = GM_getValue(STORAGE_KEY_CODE_REGEX, defaultCodeRegexString);
    const titleKeywordsString = GM_getValue(STORAGE_KEY_TITLE_KEYWORDS, defaultTitleKeywords.join(','));
    const commentKeywordsString = GM_getValue(STORAGE_KEY_COMMENT_KEYWORDS, defaultCommentKeywords.join(','));
    const showUserInfoEnabled = GM_getValue(STORAGE_KEY_SHOW_USER, defaultShowUserInfo);

    // Parse loaded regex
    const activeCodeRegex = parseRegexString(codeRegexString); // This is the RegExp object to use

    let activeTitleKeywords = [];
    if (titleKeywordsString && titleKeywordsString.trim() !== '') {
        activeTitleKeywords = titleKeywordsString.split(',').map(kw => kw.trim().toLowerCase()).filter(Boolean);
    }

    let activeCommentKeywords = [];
    if (commentKeywordsString && commentKeywordsString.trim() !== '') {
        activeCommentKeywords = commentKeywordsString.split(',').map(kw => kw.trim()).filter(Boolean);
    }

    console.log('V2EX Striker: Active Code Regex:', activeCodeRegex);
    console.log('V2EX Striker: Title Keywords:', activeTitleKeywords.length > 0 ? activeTitleKeywords : '(Inactive - No keywords configured)');
    console.log('V2EX Striker: Comment Keywords:', activeCommentKeywords.length > 0 ? activeCommentKeywords : '(None - All comment codes considered used)');
    console.log('V2EX Striker: Show Username:', showUserInfoEnabled);


    // --- Settings Modal Functions (Define early) ---
    function buildSettingsModal() {
        document.getElementById(MODAL_ID)?.remove();
        document.getElementById(OVERLAY_ID)?.remove();

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.onclick = closeSettingsModal;

        const modal = document.createElement('div');
        modal.id = MODAL_ID;

        const title = document.createElement('h2');
        title.textContent = 'V2EX Used Code Striker 设置';
        modal.appendChild(title);

        // 1. Code Regex
        const regexDiv = document.createElement('div');
        regexDiv.className = 'setting-item';
        const regexLabel = document.createElement('label');
        regexLabel.textContent = 'Code 正则表达式 (格式: /pattern/flags):';
        regexLabel.htmlFor = 'v2ex-striker-regex-input';
        const regexInput = document.createElement('input'); // Use text input for regex
        regexInput.type = 'text';
        regexInput.id = 'v2ex-striker-regex-input';
        regexInput.value = GM_getValue(STORAGE_KEY_CODE_REGEX, defaultCodeRegexString); // Load string value
        regexDiv.appendChild(regexLabel);
        regexDiv.appendChild(regexInput);
        modal.appendChild(regexDiv);
        const regexDesc = document.createElement('p');
        regexDesc.className = 'setting-desc';
        regexDesc.textContent = '用于匹配主楼和评论中 Code 的正则表达式。';
        modal.appendChild(regexDesc);


        // 2. Title Keywords
        const titleDiv = document.createElement('div');
        titleDiv.className = 'setting-item';
        const titleLabel = document.createElement('label');
        titleLabel.textContent = '帖子标题关键词 (英文逗号分隔):';
        titleLabel.htmlFor = 'v2ex-striker-title-keywords-input';
        const titleInput = document.createElement('textarea');
        titleInput.id = 'v2ex-striker-title-keywords-input';
        titleInput.value = GM_getValue(STORAGE_KEY_TITLE_KEYWORDS, defaultTitleKeywords.join(','));
        titleInput.rows = 2;
        titleDiv.appendChild(titleLabel);
        titleDiv.appendChild(titleInput);
        modal.appendChild(titleDiv);
        const titleDesc = document.createElement('p');
        titleDesc.className = 'setting-desc';
        titleDesc.textContent = '包含这些词的帖子标题才会激活脚本。留空（不推荐）则不根据标题判断，所有帖子都会执行脚本。';
        modal.appendChild(titleDesc);

        // 3. Comment Keywords
        const commentDiv = document.createElement('div');
        commentDiv.className = 'setting-item';
        const commentLabel = document.createElement('label');
        commentLabel.textContent = '评论区关键词 (英文逗号分隔):';
        commentLabel.htmlFor = 'v2ex-striker-comment-keywords-input';
        const commentInput = document.createElement('textarea');
        commentInput.id = 'v2ex-striker-comment-keywords-input';
        commentInput.value = GM_getValue(STORAGE_KEY_COMMENT_KEYWORDS, defaultCommentKeywords.join(','));
        commentInput.rows = 3;
        commentDiv.appendChild(commentLabel);
        commentDiv.appendChild(commentInput);
        modal.appendChild(commentDiv);
        const commentDesc = document.createElement('p');
        commentDesc.className = 'setting-desc';
        commentDesc.textContent = '评论需包含这些词才会标记对应 Code。留空则评论中提到的所有 Code 都被标记。';
        modal.appendChild(commentDesc);

        // 4. Show User Info
        const showUserDiv = document.createElement('div');
        showUserDiv.className = 'setting-item setting-item-checkbox';
        const showUserInput = document.createElement('input');
        showUserInput.type = 'checkbox';
        showUserInput.id = 'v2ex-striker-show-user-input';
        showUserInput.checked = GM_getValue(STORAGE_KEY_SHOW_USER, defaultShowUserInfo);
        const showUserLabel = document.createElement('label');
        showUserLabel.textContent = '在划掉的 Code 旁显示使用者信息';
        showUserLabel.htmlFor = 'v2ex-striker-show-user-input';
        showUserDiv.appendChild(showUserInput);
        showUserDiv.appendChild(showUserLabel);
        modal.appendChild(showUserDiv);

        // --- Action Buttons ---
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'setting-actions-container'; // Container for alignment

        const resetButton = document.createElement('button');
        resetButton.textContent = '重置为默认';
        resetButton.className = 'reset-button';
        resetButton.onclick = resetSettingsToDefaults;

        const actionButtonsDiv = document.createElement('div');
        actionButtonsDiv.className = 'setting-actions'; // Right-aligned buttons

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.className = 'cancel-button';
        cancelButton.onclick = closeSettingsModal;

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.className = 'save-button';
        saveButton.onclick = saveSettings;

        actionButtonsDiv.appendChild(cancelButton);
        actionButtonsDiv.appendChild(saveButton);

        buttonContainer.appendChild(resetButton); // Reset on the left
        buttonContainer.appendChild(actionButtonsDiv); // Save/Cancel group on the right
        modal.appendChild(buttonContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    function closeSettingsModal() {
        document.getElementById(MODAL_ID)?.remove();
        document.getElementById(OVERLAY_ID)?.remove();
    }

    function saveSettings() {
        const regexValue = document.getElementById('v2ex-striker-regex-input').value.trim();
        const titleKeywords = document.getElementById('v2ex-striker-title-keywords-input').value.trim();
        const commentKeywords = document.getElementById('v2ex-striker-comment-keywords-input').value.trim();
        const showUser = document.getElementById('v2ex-striker-show-user-input').checked;

        // Basic validation for regex format (optional but good practice)
        if (!/^\/.+\/[gimyus]*$/.test(regexValue) && regexValue !== '') {
             if (!confirm(`输入的正则表达式 "${regexValue}" 格式可能不正确 (应为 /pattern/flags)，确定要保存吗？`)) {
                 return; // Don't save if user cancels
             }
        }

        GM_setValue(STORAGE_KEY_CODE_REGEX, regexValue);
        GM_setValue(STORAGE_KEY_TITLE_KEYWORDS, titleKeywords);
        GM_setValue(STORAGE_KEY_COMMENT_KEYWORDS, commentKeywords);
        GM_setValue(STORAGE_KEY_SHOW_USER, showUser);

        closeSettingsModal();
        alert('设置已保存！\n请刷新页面以应用新的设置。');
    }

    function resetSettingsToDefaults() {
        if (confirm("确定要将正则、标题关键词和评论区关键词重置为默认设置吗？")) {
            // Set storage back to defaults
            GM_setValue(STORAGE_KEY_CODE_REGEX, defaultCodeRegexString);
            GM_setValue(STORAGE_KEY_TITLE_KEYWORDS, defaultTitleKeywords.join(','));
            GM_setValue(STORAGE_KEY_COMMENT_KEYWORDS, defaultCommentKeywords.join(','));
            GM_setValue(STORAGE_KEY_SHOW_USER, defaultShowUserInfo);

            // Update fields in the current modal immediately
            const modal = document.getElementById(MODAL_ID);
            if (modal) {
                modal.querySelector('#v2ex-striker-regex-input').value = defaultCodeRegexString;
                modal.querySelector('#v2ex-striker-title-keywords-input').value = defaultTitleKeywords.join(',');
                modal.querySelector('#v2ex-striker-comment-keywords-input').value = defaultCommentKeywords.join(',');
                modal.querySelector('#v2ex-striker-show-user-input').checked = defaultShowUserInfo;
                // Show user checkbox remains as it was
            }
            // No need for alert here, immediate update is feedback enough
            console.log("V2EX Striker: Settings reset to defaults (excluding Show User).");
        }
    }

    // --- Add Modal Styles (Always add styles) ---
    // Added styles for input[type=text] and adjusted button layout
    GM_addStyle(`
        #${OVERLAY_ID} { /* Styles remain the same */
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important;
            background-color: rgba(0, 0, 0, 0.4) !important; z-index: 99998 !important; backdrop-filter: blur(3px);
            display: block !important; margin: 0 !important; padding: 0 !important; border: none !important;
        }
        #${MODAL_ID} { /* Styles remain the same */
            position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important;
            width: clamp(300px, 90%, 500px) !important; max-width: 500px !important; background-color: #f9f9f9 !important; border-radius: 12px !important;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15) !important; padding: 25px 30px !important; z-index: 99999 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
            color: #333 !important; box-sizing: border-box !important; display: block !important; margin: 0 !important; border: none !important;
            max-height: 95vh !important; overflow-y: auto !important; /* Allow scrolling */
        }
        #${MODAL_ID} h2 { margin-top: 0 !important; margin-bottom: 25px !important; font-size: 1.4em !important; font-weight: 600 !important; text-align: center !important; color: #1d1d1f !important; }
        #${MODAL_ID} .setting-item { margin-bottom: 10px !important; }
        #${MODAL_ID} .setting-desc { font-size: 0.8em !important; color: #6e6e73 !important; margin-top: 0px !important; margin-bottom: 15px !important; }
        #${MODAL_ID} label { display: block !important; margin-bottom: 5px !important; font-weight: 500 !important; font-size: 0.95em !important; color: #333 !important; }
        #${MODAL_ID} input[type="text"],
        #${MODAL_ID} textarea {
            width: 100% !important; padding: 10px !important; border: 1px solid #d2d2d7 !important; border-radius: 6px !important;
            font-size: 0.9em !important; box-sizing: border-box !important; font-family: inherit !important; background-color: #fff !important; color: #333 !important;
        }
        #${MODAL_ID} textarea { resize: vertical !important; min-height: 40px !important; }
        #${MODAL_ID} input[type="text"]:focus,
        #${MODAL_ID} textarea:focus {
            border-color: #007aff !important; outline: none !important; box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2) !important;
         }
        #${MODAL_ID} .setting-item-checkbox { display: flex !important; align-items: center !important; margin-top: 20px !important; margin-bottom: 25px !important; }
        #${MODAL_ID} .setting-item-checkbox input[type="checkbox"] { margin-right: 10px !important; width: 16px !important; height: 16px !important; accent-color: #007aff !important; vertical-align: middle !important; }
        #${MODAL_ID} .setting-item-checkbox label { margin-bottom: 0 !important; font-weight: normal !important; display: inline-block !important; vertical-align: middle !important; }
        #${MODAL_ID} .setting-actions-container { /* New container for button layout */
            margin-top: 25px !important;
            display: flex !important;
            justify-content: space-between !important; /* Space between reset and save/cancel */
            align-items: center !important;
        }
        #${MODAL_ID} .setting-actions { /* Group for save/cancel */
            display: flex !important;
            gap: 10px !important;
        }
        #${MODAL_ID} button {
            padding: 10px 20px !important; border: none !important; border-radius: 6px !important;
            font-size: 0.95em !important; font-weight: 500 !important; cursor: pointer !important; transition: background-color 0.2s ease !important;
        }
        #${MODAL_ID} button.reset-button {
             background-color: #f5f5f7; /* Lighter gray for reset */
             color: #555;
             padding: 10px 15px !important; /* Slightly smaller padding maybe */
        }
         #${MODAL_ID} button.reset-button:hover {
             background-color: #e9e9ed;
         }
        #${MODAL_ID} button.save-button { 
            background-color: #007aff !important; color: white !important;
        }
        #${MODAL_ID} button.save-button:hover { background-color: #005ecf !important; }
        #${MODAL_ID} button.cancel-button { background-color: #e5e5ea !important; color: #1d1d1f !important; }
        #${MODAL_ID} button.cancel-button:hover { background-color: #dcdce0 !important; }
    `);

    // --- Menu Command Registration (Always register) ---
    function registerSettingsMenu() {
        GM_registerMenuCommand('⚙️ V2EX Striker 设置', buildSettingsModal);
    }
    registerSettingsMenu();

    // --- Initial Title Check ---
    const postTitle = document.title.toLowerCase();
    let isGiveawayPost = false;
    if (activeTitleKeywords.length > 0) {
        isGiveawayPost = activeTitleKeywords.some(keyword => postTitle.includes(keyword));
    } else {
        console.log('V2EX Striker: Title keyword list is empty, skipping title check.');
        isGiveawayPost = true; // Assume run always if title keywords are empty
    }

    if (!isGiveawayPost) {
        console.log('V2EX Striker: Post title does not match configured keywords. Script inactive for marking codes on this page.');
        return; // Stop script execution for marking codes
    }

    // --- IF TITLE CHECK PASSES, CONTINUE WITH THE REST OF THE LOGIC ---

    console.log('V2EX Striker: Post title matched. Running main script logic...');

    // --- Regex, Styles, Classes (Define constants used below) ---
    // Use activeCodeRegex parsed earlier
    const usedStyle = 'text-decoration: line-through; color: grey;';
    const userInfoStyle = 'font-size: smaller; margin-left: 5px; color: #999; text-decoration: none;';
    const markedClass = 'v2ex-used-code-marked';
    const userInfoClass = 'v2ex-code-claimant';

    // --- Keyword Regex Building (Comment Keywords) ---
    let keywordRegexCombinedTest = (text) => false; // Default test function
    if (activeCommentKeywords.length > 0) {
        const wordCharRegex = /^[a-zA-Z0-9_]+$/;
        const englishKeywords = activeCommentKeywords.filter(kw => wordCharRegex.test(kw));
        const nonWordBoundaryKeywords = activeCommentKeywords.filter(kw => !wordCharRegex.test(kw));
        const regexParts = [];

        if (englishKeywords.length > 0) {
            const englishPattern = `\\b(${englishKeywords.join('|')})\\b`;
            const englishRegex = new RegExp(englishPattern, 'i');
            regexParts.push((text) => englishRegex.test(text));
        }
        if (nonWordBoundaryKeywords.length > 0) {
            const escapedNonWordKeywords = nonWordBoundaryKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const nonWordPattern = `(${escapedNonWordKeywords.join('|')})`;
            const nonWordRegex = new RegExp(nonWordPattern, 'i');
            regexParts.push((text) => nonWordRegex.test(text));
        }
        if (regexParts.length > 0) {
            keywordRegexCombinedTest = (text) => regexParts.some(testFn => testFn(text));
        }
    }


    // --- Helper Function: findTextNodes (Unchanged) ---
    function findTextNodes(element, textNodes) {
        if (!element) return;
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim().length > 0) {
                    textNodes.push(node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (!(node.tagName === 'SPAN' && node.classList.contains(markedClass)) &&
                    !(node.tagName === 'A' && node.classList.contains(userInfoClass)))
                {
                   if (node.tagName !== 'A' && node.tagName !== 'CODE') {
                       findTextNodes(node, textNodes);
                   } else {
                       findTextNodes(node, textNodes);
                   }
                }
            }
        }
    }

    // --- Main Logic (Extraction and Marking) ---
    console.log('V2EX Striker: Starting code extraction and marking...');

    // 1. Extract used Codes and Claimant Info from comments
    const claimedCodeInfo = new Map();
    const commentElements = document.querySelectorAll('div.cell[id^="r_"]');
    // console.log(`V2EX Striker: Found ${commentElements.length} comment cells.`); // Less verbose

    const commentKeywordsAreActive = activeCommentKeywords.length > 0;

    commentElements.forEach((commentCell) => {
        const replyContentEl = commentCell.querySelector('.reply_content');
        const userLinkEl = commentCell.querySelector('strong > a[href^="/member/"]');
        if (!replyContentEl || !userLinkEl) return;

        const commentText = replyContentEl.textContent;
        const username = userLinkEl.textContent;
        const profileUrl = userLinkEl.href;

        // Use the globally loaded activeCodeRegex here
        const potentialCodes = commentText.match(activeCodeRegex); // Apply active regex

        if (potentialCodes) {
            let commentMatchesCriteria = false;
            if (!commentKeywordsAreActive) {
                commentMatchesCriteria = true;
            } else if (keywordRegexCombinedTest(commentText)) {
                commentMatchesCriteria = true;
            }

            if (commentMatchesCriteria) {
                potentialCodes.forEach(code => {
                    const codeUpper = code.toUpperCase();
                    if (!claimedCodeInfo.has(codeUpper)) {
                        claimedCodeInfo.set(codeUpper, { username, profileUrl });
                    }
                });
            }
        }
    });

    // console.log(`V2EX Striker: Extracted info for ${claimedCodeInfo.size} unique potential used codes.`); // Less verbose

    if (claimedCodeInfo.size === 0) {
        console.log('V2EX Striker: No potential used codes found in comments matching criteria. Exiting marking phase.');
        return;
    }

    // 2. Find and mark Codes in main post and supplements
    const contentAreas = [
        document.querySelector('.topic_content'),
        ...document.querySelectorAll('.subtle .topic_content') // Corrected selector
    ].filter(Boolean);

    // console.log(`V2EX Striker: Found ${contentAreas.length} content areas to scan for marking.`); // Less verbose

    contentAreas.forEach((area) => {
        const textNodes = [];
        findTextNodes(area, textNodes);

        textNodes.forEach(node => {
            if (node.parentNode && (node.parentNode.classList.contains(markedClass) || node.parentNode.classList.contains(userInfoClass))) {
                return;
            }

            const nodeText = node.nodeValue;
            let match;
            let lastIndex = 0;
            const newNodeContainer = document.createDocumentFragment();
            // Create a new RegExp instance based on the active one for stateful matching (lastIndex)
            const regex = new RegExp(activeCodeRegex.source, activeCodeRegex.flags);
            regex.lastIndex = 0; // Reset

            while ((match = regex.exec(nodeText)) !== null) {
                const matchedCode = match[0];
                const matchedCodeUpper = matchedCode.toUpperCase();

                if (claimedCodeInfo.has(matchedCodeUpper)) {
                    const claimInfo = claimedCodeInfo.get(matchedCodeUpper);
                    if (match.index > lastIndex) {
                        newNodeContainer.appendChild(document.createTextNode(nodeText.substring(lastIndex, match.index)));
                    }
                    const span = document.createElement('span');
                    span.textContent = matchedCode;
                    span.style.cssText = usedStyle;
                    span.title = `Code "${matchedCode}" likely used by ${claimInfo.username}`;
                    span.classList.add(markedClass);
                    newNodeContainer.appendChild(span);

                    if (showUserInfoEnabled && claimInfo) {
                        const userLink = document.createElement('a');
                        userLink.href = claimInfo.profileUrl;
                        userLink.textContent = ` (@${claimInfo.username})`;
                        userLink.style.cssText = userInfoStyle;
                        userLink.classList.add(userInfoClass);
                        userLink.target = '_blank';
                        userLink.title = `View profile of ${claimInfo.username}`;
                        newNodeContainer.appendChild(userLink);
                    }
                    lastIndex = regex.lastIndex;
                     // Prevent infinite loops for zero-length matches (shouldn't happen with current regex, but good practice)
                    if (lastIndex === match.index) {
                       regex.lastIndex++;
                    }
                }
                 // Ensure progress even if no match is found in claimedCodeInfo
                 if (regex.lastIndex === match.index) {
                    regex.lastIndex++;
                }
            }

            if (lastIndex < nodeText.length) {
                newNodeContainer.appendChild(document.createTextNode(nodeText.substring(lastIndex)));
            }

            if (newNodeContainer.hasChildNodes() && lastIndex > 0) {
                node.parentNode.replaceChild(newNodeContainer, node);
            }
        });
    });

    console.log('V2EX Striker: Script finished.');

})();