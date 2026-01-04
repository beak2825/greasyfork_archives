// ==UserScript==
// @name               Quick Copy YouTube Subtitles
// @name:zh-TW         YouTube 字幕快速複製
// @namespace          wellstsai.com
// @version            v20251211
// @license            BSD
// @description        Quickly copy subtitles from YouTube and write them to the clipboard for easy analysis on GPT.
// @description:zh-TW  快速複製 YouTube 字幕並將其寫入剪貼簿，以便在GPT上進行分析。
// @author             WellsTsai
// @match              https://*.youtube.com/*
// @icon               data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/500083/Quick%20Copy%20YouTube%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/500083/Quick%20Copy%20YouTube%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const GPT_PROMPT = '請使用**$臺灣繁體中文（正體中文）$，$詳細消化$以下影片$轉錄稿$的$所有資訊與內容$，並將消化後的重點轉換為一篇詳細描述影片核心內容的文章。在轉換過程中，請務必使用$臺灣當地的詞彙和語法$**，嚴格避免使用非 $臺灣$ 慣用語（例如：避免使用『信息』，應使用『訊息』）'
    const COPY_NOTIFICATION_TEXT = '已複製'
    const TARGET_COMMENT_COUNT = 200

    // --- UI Styles ---
    const addStyles = () => {
        const style = document.createElement('style')
        style.textContent = `
            #yt-copy-panel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(20, 20, 40, 0.75) 100%);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            #yt-copy-panel-overlay.active {
                opacity: 1;
            }
            
            #yt-copy-panel {
                background: linear-gradient(145deg, rgba(30, 30, 45, 0.95) 0%, rgba(20, 20, 35, 0.98) 100%);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 32px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                    0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                gap: 20px;
                min-width: 420px;
                max-width: 480px;
                transform: scale(0.9) translateY(-20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            #yt-copy-panel::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #FF0844 0%, #FFB199 50%, #3ea6ff 100%);
                opacity: 0.8;
            }
            
            #yt-copy-panel.active {
                transform: scale(1) translateY(0);
            }
            
            #yt-copy-panel h2 {
                color: #fff;
                margin: 0 0 12px 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                letter-spacing: -0.5px;
                background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
            }
            
            .yt-copy-btn {
                background: linear-gradient(135deg, #3ea6ff 0%, #5eb8ff 100%);
                color: #000;
                border: none;
                padding: 16px 24px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(62, 166, 255, 0.3);
                letter-spacing: 0.3px;
            }
            
            .yt-copy-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s;
            }
            
            .yt-copy-btn:hover {
                background: linear-gradient(135deg, #5eb8ff 0%, #7ec8ff 100%);
                box-shadow: 0 6px 25px rgba(62, 166, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .yt-copy-btn:hover::before {
                left: 100%;
            }
            
            .yt-copy-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 10px rgba(62, 166, 255, 0.4);
            }
            
            .yt-copy-btn:disabled {
                background: linear-gradient(135deg, #2a2a3a 0%, #1f1f2e 100%);
                color: #666;
                cursor: not-allowed;
                box-shadow: none;
                transform: none;
            }
            
            .yt-copy-btn:disabled::before {
                display: none;
            }
            
            .yt-copy-btn:nth-child(2) {
                background: linear-gradient(135deg, #FF0844 0%, #FF5478 100%);
                box-shadow: 0 4px 15px rgba(255, 8, 68, 0.3);
            }
            
            .yt-copy-btn:nth-child(2):hover {
                background: linear-gradient(135deg, #FF5478 0%, #FF7392 100%);
                box-shadow: 0 6px 25px rgba(255, 8, 68, 0.5);
            }
            
            #yt-copy-status {
                color: #b8b8c8;
                font-size: 13px;
                text-align: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                min-height: 24px;
                font-weight: 500;
                padding: 8px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                line-height: 1.5;
            }
            
            #yt-copy-notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 16px 28px;
                background: linear-gradient(135deg, rgba(30, 30, 45, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: #fff;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                font-size: 15px;
                font-weight: 600;
                animation: slideInOut 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            #yt-copy-notification::before {
                content: '✓';
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #00D084 0%, #00F5A0 100%);
                border-radius: 50%;
                font-size: 14px;
                color: #000;
                font-weight: 700;
            }
            
            @keyframes slideInOut {
                0% { 
                    opacity: 0; 
                    transform: translateX(100px) scale(0.8);
                }
                15% { 
                    opacity: 1; 
                    transform: translateX(0) scale(1);
                }
                85% { 
                    opacity: 1; 
                    transform: translateX(0) scale(1);
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(100px) scale(0.8);
                }
            }
            
            /* Smooth scrollbar styling */
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #3ea6ff 0%, #5eb8ff 100%);
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #5eb8ff 0%, #7ec8ff 100%);
            }
        `
        document.head.appendChild(style)
    }

    // --- Helpers ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const updateStatus = (text) => {
        const statusEl = document.querySelector('#yt-copy-status')
        if (statusEl) statusEl.innerText = text
    }

    // --- Data Extraction & Navigation ---

    const smoothScrollToBottom = async () => {
        const scrollHeight = document.documentElement.scrollHeight
        const currentScroll = window.scrollY
        const targetScroll = scrollHeight
        const step = 600 // Pixels per step
        
        if (currentScroll >= targetScroll) return

        let pos = currentScroll
        while (pos < targetScroll) {
            pos += step
            if (pos > targetScroll) pos = targetScroll
            window.scrollTo(0, pos)
            await sleep(100) // Simulate human scroll speed
            
            // Update target in case new content loaded during scroll
            if (document.documentElement.scrollHeight > scrollHeight) {
                return // Content expanded, let the main loop handle the new height
            }
        }
    }

    const getDisplayedCommentCount = () => {
        // Extract the displayed comment count from YouTube's header
        // HTML structure: <h2 id="count"><yt-formatted-string><span>32</span><span> 則留言</span></yt-formatted-string></h2>
        const countElement = document.querySelector('#comments #count yt-formatted-string span:first-child')
        if (countElement) {
            const count = parseInt(countElement.textContent.trim())
            if (!isNaN(count) && count > 0) {
                return count
            }
        }
        return null // Return null if unable to extract
    }

    const scrollToLoadComments = async () => {
        // Try to get the actual displayed count first
        const displayedCount = getDisplayedCommentCount()
        const targetCount = displayedCount || TARGET_COMMENT_COUNT
        
        if (displayedCount) {
            updateStatus(`YouTube 顯示共 ${displayedCount} 則留言，開始載入...`)
        } else {
            updateStatus(`無法讀取留言數，使用預設目標 ${TARGET_COMMENT_COUNT} 則`)
        }

        let currentCount = document.querySelectorAll('ytd-comment-thread-renderer').length
        let noNewCommentsCount = 0
        const maxNoNewCommentsAttempts = 1 // Stop if no new comments after 3 consecutive scrolls

        // Ensure we are at the comments section first
        const commentsSection = document.querySelector('#comments')
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            await sleep(1000)
        }

        while (currentCount < targetCount && noNewCommentsCount < maxNoNewCommentsAttempts) {
            updateStatus(`正在載入留言... (${currentCount}/${targetCount})`)
            
            // Use smooth scroll instead of jump
            await smoothScrollToBottom()
            
            await sleep(1500) 

            const newCount = document.querySelectorAll('ytd-comment-thread-renderer').length
            if (newCount === currentCount) {
                // No new comments loaded, increment counter
                noNewCommentsCount++
                // Try a small nudge to trigger lazy loading
                window.scrollBy(0, -100)
                await sleep(300)
                window.scrollTo(0, document.documentElement.scrollHeight)
                await sleep(1000)
            } else {
                // New comments loaded, reset counter and update count
                currentCount = newCount
                noNewCommentsCount = 0
            }
        }

        // Final status message
        const reason = noNewCommentsCount >= maxNoNewCommentsAttempts ? '已載入所有可用留言' : '達到目標數量'
        if (displayedCount && currentCount < displayedCount) {
            updateStatus(`留言載入完成 (${reason})。顯示 ${displayedCount} 則，實際載入 ${currentCount} 則（YouTube 可能隱藏了部分留言）`)
        } else {
            updateStatus(`留言載入完成 (${reason})。共 ${currentCount} 則主留言。`)
        }
    }


    const extractComments = () => {
        const comments = []
        const threadElements = document.querySelectorAll('ytd-comment-thread-renderer')

        const getText = (el, selectors) => {
            for (const sel of selectors) {
                const found = el.querySelector(sel)
                if (found && found.innerText.trim()) return found.innerText.trim()
            }
            return ''
        }

        threadElements.forEach(thread => {
            // Main comment
            // Try to find the main comment element. It could be #comment or ytd-comment-view-model
            const mainComment = thread.querySelector('#comment') || thread.querySelector('ytd-comment-view-model')
            if (!mainComment) return

            const author = getText(mainComment, ['#author-text', '.ytd-channel-name', 'h3.ytd-comment-view-model']) || 'Unknown'
            const content = getText(mainComment, ['#content-text', '.yt-core-attributed-string', '#content']) || ''
            const time = getText(mainComment, ['.published-time-text', '#published-time-text a', '#published-time-text']) || ''
            
            let threadText = `[${author} - ${time}]\n${content}`

            // Replies
            // Use a broad selector to catch nested replies in the new structure
            const replies = thread.querySelectorAll('#replies ytd-comment-view-model')
            if (replies.length > 0) {
                replies.forEach(reply => {
                    const rAuthor = getText(reply, ['#author-text', '.ytd-channel-name', 'h3.ytd-comment-view-model']) || 'Unknown'
                    const rContent = getText(reply, ['#content-text', '.yt-core-attributed-string', '#content']) || ''
                    const rTime = getText(reply, ['.published-time-text', '#published-time-text a', '#published-time-text']) || ''
                    threadText += `\n\n\t> [${rAuthor} - ${rTime}]\n\t> ${rContent.replace(/\n/g, '\n\t> ')}`
                })
            }

            if (content) {
                comments.push(threadText)
            }
        })

        if (comments.length === 0) {
            return "No comments loaded. Please scroll down to load comments first."
        }

        return comments.join('\n\n---\n\n')
    }

    const getTranscript = () => {
        const segmentsContainer = document.querySelector('#segments-container')
        if (segmentsContainer) {
            return segmentsContainer.innerText
        }
        return null
    }

    const removeTimestamps = (text) => {
        // Remove timestamps in format like "4:43" or "1:23:45" at the beginning of lines
        // Pattern matches: optional digits for hours, required minutes:seconds
        return text.replace(/^\d+:\d+(:\d+)?\s*/gm, '')
    }

    // --- Actions ---

    const copyToClipboard = (text, isTranscript = false, removeTime = false) => {
        let finalContent = text
        
        // Remove timestamps if requested
        if (removeTime) {
            finalContent = removeTimestamps(finalContent)
        }
        
        if (isTranscript) {
             finalContent = finalContent + "\n\n" + GPT_PROMPT
        }
        
        navigator.clipboard.writeText(finalContent).then(() => {
            showNotification(COPY_NOTIFICATION_TEXT)
            closePanel()
        })
    }

    const showNotification = (text) => {
        const notification = document.createElement('div')
        notification.id = 'yt-copy-notification'
        notification.innerText = text
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 2000)
    }

    const openTranscriptAndCopy = (removeTime = false) => {
        const existingTranscript = getTranscript()
        if (existingTranscript) {
            copyToClipboard(existingTranscript, true, removeTime)
            return
        }

        const transcriptButton = document.querySelector('ytd-video-description-transcript-section-renderer button')
        if (transcriptButton) {
            transcriptButton.click()
            updateStatus('正在開啟字幕...')
            let attempts = 0
            const checkInterval = setInterval(() => {
                const text = getTranscript()
                if (text) {
                    clearInterval(checkInterval)
                    copyToClipboard(text, true, removeTime)
                } else if (attempts > 10) {
                    clearInterval(checkInterval)
                    updateStatus('無法讀取字幕')
                    showNotification('無法讀取字幕')
                }
                attempts++
            }, 500)
        } else {
            showNotification('找不到字幕按鈕')
        }
    }

    const handleCopyComments = async () => {
        const btn = document.querySelector('#yt-copy-btn-comments')
        if (btn) btn.disabled = true
        
        try {
            await scrollToLoadComments()
            // await expandReplies() // User requested to skip reply expansion
            const comments = extractComments()
            copyToClipboard(comments, false)
        } catch (e) {
            console.error(e)
            updateStatus('發生錯誤')
        } finally {
            if (btn) btn.disabled = false
        }
    }

    // --- UI Logic ---

    let panelOverlay = null

    const closePanel = () => {
        if (panelOverlay) {
            panelOverlay.classList.remove('active')
            const panel = panelOverlay.querySelector('#yt-copy-panel')
            if (panel) panel.classList.remove('active')
            setTimeout(() => {
                if (panelOverlay && panelOverlay.parentNode) {
                    panelOverlay.parentNode.removeChild(panelOverlay)
                }
                panelOverlay = null
            }, 300)
        }
    }

    const createSelectionPanel = () => {
        if (panelOverlay) return

        panelOverlay = document.createElement('div')
        panelOverlay.id = 'yt-copy-panel-overlay'
        
        const panel = document.createElement('div')
        panel.id = 'yt-copy-panel'
        
        const title = document.createElement('h2')
        title.innerText = '複製內容'
        
        const status = document.createElement('div')
        status.id = 'yt-copy-status'
        
        const btnTranscriptWithTime = document.createElement('button')
        btnTranscriptWithTime.className = 'yt-copy-btn'
        btnTranscriptWithTime.innerText = '複製字幕 (有時間)'
        btnTranscriptWithTime.onclick = (e) => {
            e.stopPropagation()
            openTranscriptAndCopy(false)
        }

        const btnTranscriptNoTime = document.createElement('button')
        btnTranscriptNoTime.className = 'yt-copy-btn'
        btnTranscriptNoTime.innerText = '複製字幕 (無時間)'
        btnTranscriptNoTime.onclick = (e) => {
            e.stopPropagation()
            openTranscriptAndCopy(true)
        }

        const btnComments = document.createElement('button')
        btnComments.id = 'yt-copy-btn-comments'
        btnComments.className = 'yt-copy-btn'
        btnComments.innerText = `複製留言 (Comments) - 目標 ${TARGET_COMMENT_COUNT} 則`
        btnComments.onclick = (e) => {
            e.stopPropagation()
            handleCopyComments()
        }

        panel.appendChild(title)
        panel.appendChild(btnTranscriptWithTime)
        panel.appendChild(btnTranscriptNoTime)
        panel.appendChild(btnComments)
        panel.appendChild(status)
        panelOverlay.appendChild(panel)

        // Close on click outside
        panelOverlay.onclick = (e) => {
            if (e.target === panelOverlay) closePanel()
        }

        document.body.appendChild(panelOverlay)

        // Animation with active class
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                panelOverlay.classList.add('active')
                panel.classList.add('active')
            })
        })
    }

    // --- Initialization ---

    addStyles()

    document.addEventListener('keydown', e => {
        // Detect Ctrl + C and ensure no text is currently selected
        if (e.ctrlKey && e.key.toLowerCase() === 'c' && !window.getSelection().toString()) {
            e.preventDefault()
            createSelectionPanel()
        }
        
        // Close on Esc
        if (e.key === 'Escape' && panelOverlay) {
            closePanel()
        }
    })

})()
