// ==UserScript==
// @name         Summarize with AI
// @namespace    https://github.com/insign/userscripts
// @version      2025.12.24.0100
// @description  Single-button AI summarization (OpenAI/Gemini) with chat follow-up feature. Uses Alt+S shortcut. Long press 'S' (or tap-and-hold on mobile) to select model. Supports custom models. Dark mode auto-detection. Click chat icon to continue conversation about the article.
// @author       Hélio <open@helio.me>
// @license      WTFPL
// @match        *://*/*
// @grant        GM.addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      api.openai.com
// @connect      generativelanguage.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/readability/0.6.0/Readability.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/readability/0.6.0/Readability-readerable.min.js
// @downloadURL https://update.greasyfork.org/scripts/509192/Summarize%20with%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/509192/Summarize%20with%20AI.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // --- Constants ---
  // UI Element IDs
  const BUTTON_ID            = 'summarize-button'
  const DROPDOWN_ID          = 'model-dropdown'
  const OVERLAY_ID           = 'summarize-overlay'
  const CLOSE_BUTTON_ID      = 'summarize-close'
  const CONTENT_ID           = 'summarize-content'
  const ERROR_ID             = 'summarize-error'
  const ADD_MODEL_ITEM_ID    = 'add-custom-model'
  const RETRY_BUTTON_ID      = 'summarize-retry-button'
  const CHAT_TOGGLE_ID       = 'summarize-chat-toggle'
  const CHAT_CONTAINER_ID    = 'summarize-chat-container'
  const CHAT_MESSAGES_ID     = 'summarize-chat-messages'
  const CHAT_INPUT_ID        = 'summarize-chat-input'
  const CHAT_SEND_ID         = 'summarize-chat-send'

  // GM Storage Key for custom models
  const CUSTOM_MODELS_KEY = 'custom_ai_models'

  // Token Limits
  const DEFAULT_MAX_TOKENS  = 1000
  const HIGH_MAX_TOKENS     = 1500
  // Long press duration (ms)
  const LONG_PRESS_DURATION = 500
  // Request timeouts (ms)
  const DEFAULT_TIMEOUT     = 60000   // 60 seconds for non-thinking models
  const THINKING_TIMEOUT    = 300000  // 300 seconds (5 min) for thinking models (Pro, o3, o4)

  // Default AI model configurations
  const MODEL_GROUPS = {
    openai: {
      name         : 'OpenAI',
      baseUrl      : 'https://api.openai.com/v1/chat/completions',
      models       : [
        { id: 'o4-mini', name: 'o4 mini (better)', params: { max_completion_tokens: HIGH_MAX_TOKENS, reasoning_effort: 'low' } },
        { id: 'o3-mini', name: 'o3 mini', params: { max_completion_tokens: HIGH_MAX_TOKENS, reasoning_effort: 'low' } },
        { id: 'gpt-4.1', name: 'GPT-4.1' },
        { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini' },
        { id: 'gpt-4.1-nano', name: 'GPT-4.1 nano (faster)' },
      ],
      defaultParams: { max_completion_tokens: DEFAULT_MAX_TOKENS }
    },
    gemini: {
      name         : 'Gemini',
      baseUrl      : 'https://generativelanguage.googleapis.com/v1beta/models/',
      models       : [
        {
          id    : 'gemini-flash-lite-latest',
          name  : 'Gemini Flash Lite (faster)',
          params: { maxOutputTokens: HIGH_MAX_TOKENS, thinkingConfig: { thinkingBudget: 0 } } // Thinking explicitly disabled
        },
        {
          id    : 'gemini-flash-latest',
          name  : 'Gemini Flash',
          params: { maxOutputTokens: HIGH_MAX_TOKENS, thinkingConfig: { thinkingBudget: 0 } } // Thinking explicitly disabled
        },
        {
          id    : 'gemini-pro-latest',
          name  : 'Gemini Pro (better)',
          params: { maxOutputTokens: HIGH_MAX_TOKENS } // No thinkingConfig, Gemini API default (thinking enabled) will be used
        },
      ],
      defaultParams: { maxOutputTokens: DEFAULT_MAX_TOKENS } // No default thinkingConfig; handled by model params or custom logic
    },
  }

  // AI Prompt Template
  const PROMPT_TEMPLATE = (title, content, lang) => `You are a summarizer bot that provides clear and affirmative explanations of content.
		Generate a concise summary that includes:
		- **CRITICAL - First paragraph (Direct Answer):** The first paragraph MUST directly and succinctly answer the main question implied by the article's title. Article titles are often clickbait or attention-grabbing hooks designed to make readers curious. Your job is to immediately satisfy that curiosity in 1-2 sentences. Ask yourself: "What does the reader most want to know after reading this title?" and answer that directly. This paragraph should be the TL;DR that gives the reader the core answer they came looking for.
		- Relevant emojis as bullet points with key supporting details
		- No section headers
		- Use HTML formatting, never use \`\`\` code blocks, never use markdown.
		- **CRITICAL - Opinion paragraph:** After the bullet points, add a conclusion paragraph starting with "<strong>Opinion:</strong> " that presents YOUR informed, skeptical but honest perspective. This opinion should:
			* Be like advice from a knowledgeable friend who has expertise in the subject - direct, simple, clear, and confident
			* Be genuinely skeptical when warranted, but NOT contrarian just for the sake of it - if the article is correct, acknowledge it
			* Point out what the article may have omitted, exaggerated, or gotten wrong - but only if truly applicable
			* Provide broader context that helps the reader understand the real significance (or lack thereof)
			* Be stated with conviction and authority, as someone who truly understands the topic would speak
			* Avoid hedging language like "it seems", "perhaps", "one might argue" - be direct and own your opinion
			* Never say "I agree" or "I disagree" - just state your view as fact
		- User language to be used in the entire summary: ${lang}
		- Before everything, add quality of the article, like "<strong>Article Quality:</strong> <span class=article-good>8/10</span>", where 1 is bad and 10 is excellent.
		- For the quality class use:
			<span class=article-excellent>9/10</span> (or 10)
			<span class=article-good>8/10</span>
			<span class=article-average>7/10</span>
			<span class=article-bad>6/10</span>
			<span class=article-very-bad>5/10</span> (or less)
		- "Opinion:", "Article Quality:" should be in user language, e.g. "Opinião:", "Qualidade do artigo:" for Português.
		- **Guidelines for Article Quality Assessment (Score 1-10):**
			*   **Clarity and Coherence:** Is the text easy to understand? Is the argumentation logical and does it flow well?
			*   **Depth and Information:** Does the article explore the topic with adequate depth? Does it provide relevant and sufficient information, or is it superficial?
			*   **Structure and Organization:** Is the article well-structured (e.g., clear introduction, developed body, logical conclusion)? Are paragraphs and sections well-organized?
			*   **Engagement and Interest:** Is the article interesting and capable of holding the reader's attention?
			*   **Language and Grammar:** Is the text well-written and free of significant grammatical errors or typos?
		Consider these points comprehensively to form an overall score reflecting the article's quality. Strive for consistency in your assessment regardless of your own advanced reasoning capabilities.

		Example output format:
		<p><strong>Article Quality:</strong> <span class="article-good">8/10</span></p>
		<p>[DIRECT ANSWER to what the title promises/implies - what the reader most wants to know, answered immediately and concisely]</p>
		<ul>
		<li>emoji_here Key supporting detail or evidence from the article.</li>
		<li>emoji_here Another important point that adds context.</li>
		<li>emoji_here Additional relevant information.</li>
		<li>emoji_here Final key takeaway from the article.</li>
		</ul>
		<p><strong>Opinion:</strong> [Your direct, authoritative take on this topic. Speak with the confidence of an expert giving their honest assessment. Be skeptical where warranted but fair. Point out what matters and what doesn't. No hedging - own your perspective.]</p>

		Here is the content to summarize:
		Article Title: ${title}
		Article Content: ${content}`

  // --- State Variables ---
  let activeModel     = 'gemini-flash-lite-latest'
  let articleData     = null
  let customModels    = [] // Stores {id, service, supportsThinking?: boolean}
  let longPressTimer  = null
  let isLongPress     = false
  let modelPressTimer = null
  let chatHistory     = [] // Stores conversation history for chat feature
  let lastSummary     = '' // Stores the last generated summary for chat context

  // --- Main Functions ---

  /**
   * Initializes the script.
   */
  async function initialize() {
    customModels = await getCustomModels()
    document.addEventListener('keydown', handleKeyPress)
    articleData = getArticleData()
    if (articleData) {
      addSummarizeButton()
      showElement(BUTTON_ID)
      setupFocusListeners()
      activeModel = await GM.getValue('last_used_model', activeModel)
    }
  }

  /**
   * Extracts article data using Readability.js.
   * @returns {object|null} Article data or null.
   */
  function getArticleData() {
    try {
      const docClone = document.cloneNode(true)
      docClone.querySelectorAll('script, style, noscript, iframe, figure, img, svg, header, footer, nav').forEach(el => el.remove())
      // eslint-disable-next-line no-undef
      if (!isProbablyReaderable(docClone)) {
        console.log('Summarize with AI: Page not detected as readerable.')
        return null
      }
      // eslint-disable-next-line no-undef
      const reader  = new Readability(docClone)
      const article = reader.parse()
      return (article?.content && article.textContent?.trim())
        ? { title: article.title, content: article.textContent.trim() }
        : null
    }
    catch (error) {
      console.error('Summarize with AI: Article parsing failed:', error)
      return null
    }
  }

  /**
   * Adds the summarize button and dropdown to the DOM.
   */
  function addSummarizeButton() {
    if (document.getElementById(BUTTON_ID)) return

    const button       = document.createElement('div')
    button.id          = BUTTON_ID
    button.textContent = 'S'
    button.title       = 'Summarize (Alt+S) / Long Press or Tap & Hold to Select Model'
    document.body.appendChild(button)

    const dropdown = createDropdownElement()
    document.body.appendChild(dropdown)
    populateDropdown(dropdown)

    button.addEventListener('click', () => {
      if (!isLongPress) {
        processSummarization()
      }
      isLongPress = false
    })

    const startLongPressTimer = (event) => {
      isLongPress = false
      clearTimeout(longPressTimer)
      longPressTimer = setTimeout(() => {
        isLongPress = true
        toggleDropdown(event)
      }, LONG_PRESS_DURATION)
    }

    const cancelLongPressTimer = () => {
      clearTimeout(longPressTimer)
    }

    button.addEventListener('mousedown', startLongPressTimer)
    button.addEventListener('mouseup', cancelLongPressTimer)
    button.addEventListener('mouseleave', cancelLongPressTimer)
    button.addEventListener('touchstart', startLongPressTimer, { passive: true })
    button.addEventListener('touchend', cancelLongPressTimer)
    button.addEventListener('touchmove', cancelLongPressTimer)
    button.addEventListener('touchcancel', cancelLongPressTimer)

    document.addEventListener('click', handleOutsideClick)
    injectStyles()
  }


  // --- UI Functions (Dropdown, Overlay, Notifications) ---

  /**
   * Creates the base dropdown element.
   * @returns {HTMLElement}
   */
  function createDropdownElement() {
    const dropdown         = document.createElement('div')
    dropdown.id            = DROPDOWN_ID
    dropdown.style.display = 'none'
    return dropdown
  }

  /**
   * Populates the dropdown with models.
   * @param {HTMLElement} dropdownElement
   */
  function populateDropdown(dropdownElement) {
    dropdownElement.innerHTML = ''

    Object.entries(MODEL_GROUPS).forEach(([ service, group ]) => {
      const standardModels      = group.models || []
      const serviceCustomModels = customModels
        .filter(m => m.service === service)
        .map(m => ({ id: m.id, supportsThinking: m.supportsThinking }))

      const allModelObjects = [ ...standardModels, ...serviceCustomModels ]
        .reduce((acc, model) => {
          if (!acc.some(existing => existing.id.toLowerCase() === model.id.toLowerCase())) {
            acc.push(model)
          }
          return acc
        }, [])
        .sort((a, b) => a.id.localeCompare(b.id))

      if (allModelObjects.length > 0) {
        const groupDiv     = document.createElement('div')
        groupDiv.className = 'model-group'
        groupDiv.appendChild(createHeader(group.name, service))
        allModelObjects.forEach(modelObj => groupDiv.appendChild(createModelItem(modelObj, service)))
        dropdownElement.appendChild(groupDiv)
      }
    })

    const separator           = document.createElement('hr')
    separator.style.margin    = '8px 0'
    separator.style.border    = 'none'
    separator.style.borderTop = '1px solid #eee'
    dropdownElement.appendChild(separator)
    dropdownElement.appendChild(createAddModelItem())
  }

  /**
   * Creates a header for a model group.
   * @param {string} text
   * @param {string} service
   * @returns {HTMLElement}
   */
  function createHeader(text, service) {
    const headerContainer     = document.createElement('div')
    headerContainer.className = 'group-header-container'

    const headerText       = document.createElement('span')
    headerText.className   = 'group-header-text'
    headerText.textContent = text

    const resetLink       = document.createElement('a')
    resetLink.href        = '#'
    resetLink.textContent = 'Reset Key'
    resetLink.className   = 'reset-key-link'
    resetLink.title       = `Reset ${text} API Key`
    resetLink.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      handleApiKeyReset(service)
    })

    headerContainer.appendChild(headerText)
    headerContainer.appendChild(resetLink)
    return headerContainer
  }

  /**
   * Creates a model item for the dropdown.
   * @param {object} modelObj
   * @param {string} service
   * @returns {HTMLElement}
   */
  function createModelItem(modelObj, service) {
    const item       = document.createElement('div')
    item.className   = 'model-item'
    item.textContent = modelObj.name || modelObj.id
    let isModelPress = false

    if (modelObj.id === activeModel) {
      item.style.fontWeight = 'bold'
      item.style.color      = '#1A73E8'
    }

    item.addEventListener('click', () => {
      if (!isModelPress) {
        activeModel = modelObj.id
        GM.setValue('last_used_model', activeModel)
        hideElement(DROPDOWN_ID)
        processSummarization()
      }
      isModelPress = false
    })

    const isCustom = !MODEL_GROUPS[service]?.models.some(m => m.id === modelObj.id)

    if (isCustom) {
      item.title = 'Click to use. Long press to delete.'

      const startModelPressTimer = (e) => {
        e.stopPropagation()
        isModelPress = false
        clearTimeout(modelPressTimer)
        modelPressTimer = setTimeout(() => {
          isModelPress = true
          handleModelRemoval(modelObj.id, service)
        }, LONG_PRESS_DURATION)
      }

      const cancelModelPressTimer = (e) => {
        e.stopPropagation()
        clearTimeout(modelPressTimer)
      }

      item.addEventListener('mousedown', startModelPressTimer)
      item.addEventListener('mouseup', cancelModelPressTimer)
      item.addEventListener('mouseleave', cancelModelPressTimer)
      item.addEventListener('touchstart', startModelPressTimer, { passive: true })
      item.addEventListener('touchend', cancelModelPressTimer)
      item.addEventListener('touchmove', cancelModelPressTimer)
      item.addEventListener('touchcancel', cancelModelPressTimer)
    }
    else {
      item.title = 'Click to use this model.'
    }
    return item
  }


  /**
   * Creates the "Add Custom Model" item.
   * @returns {HTMLElement}
   */
  function createAddModelItem() {
    const item       = document.createElement('div')
    item.id          = ADD_MODEL_ITEM_ID
    item.className   = 'model-item add-model-item'
    item.textContent = '+ Add Custom Model'
    item.addEventListener('click', async (e) => {
      e.stopPropagation()
      hideElement(DROPDOWN_ID)
      await handleAddModel()
    })
    return item
  }

  /**
   * Toggles dropdown visibility.
   * @param {Event} [e]
   */
  function toggleDropdown(e) {
    if (e) e.stopPropagation()
    const dropdown = document.getElementById(DROPDOWN_ID)
    if (dropdown) {
      const isHidden = dropdown.style.display === 'none'
      if (isHidden) {
        populateDropdown(dropdown)
        showElement(DROPDOWN_ID)
      }
      else {
        hideElement(DROPDOWN_ID)
      }
    }
  }

  /**
   * Handles clicks outside the dropdown to close it.
   * @param {Event} event
   */
  function handleOutsideClick(event) {
    const dropdown = document.getElementById(DROPDOWN_ID)
    const button   = document.getElementById(BUTTON_ID)
    if (dropdown && dropdown.style.display !== 'none' &&
      !dropdown.contains(event.target) &&
      !button?.contains(event.target)) {
      hideElement(DROPDOWN_ID)
    }
  }

  /**
   * Builds the header buttons HTML (chat toggle + close).
   * @param {boolean} showChat - Whether to show the chat button.
   * @returns {string}
   */
  function buildHeaderButtonsHTML(showChat = false) {
    const chatBtn = showChat
      ? `<button type="button" id="${CHAT_TOGGLE_ID}" class="summarize-header-btn summarize-chat-btn" title="Continue conversation">💬</button>`
      : ''
    return `<div class="summarize-header-buttons">
      ${chatBtn}
      <button type="button" id="${CLOSE_BUTTON_ID}" class="summarize-header-btn summarize-close-btn" title="Close (Esc)">✕</button>
    </div>`
  }

  /**
   * Builds the chat interface HTML.
   * @returns {string}
   */
  function buildChatHTML() {
    return `<div id="${CHAT_CONTAINER_ID}">
      <div id="${CHAT_MESSAGES_ID}"></div>
      <div id="summarize-chat-input-container">
        <input type="text" id="${CHAT_INPUT_ID}" placeholder="Follow up with this article..." />
        <button type="button" id="${CHAT_SEND_ID}">Send</button>
      </div>
    </div>`
  }

  /**
   * Shows the summary overlay.
   * @param {string} contentHTML
   * @param {boolean} [isError=false]
   */
  function showSummaryOverlay(contentHTML, isError = false) {
    if (document.getElementById(OVERLAY_ID)) {
      updateSummaryOverlay(contentHTML, isError)
      return
    }

    // Reset chat history when showing new summary
    chatHistory = []

    const overlay = document.createElement('div')
    overlay.id    = OVERLAY_ID

    const showChatButton   = !isError && !contentHTML.includes('class="glow"')
    let finalContentHTML   = buildHeaderButtonsHTML(showChatButton)
    finalContentHTML      += `<div class="summarize-body">${contentHTML}</div>`

    if (isError) {
      finalContentHTML += `<button id="${RETRY_BUTTON_ID}" class="retry-button">Try Again</button>`
    }
    else if (showChatButton) {
      finalContentHTML += buildChatHTML()
    }

    overlay.innerHTML = `<div id="${CONTENT_ID}">${finalContentHTML}</div>`

    document.body.appendChild(overlay)
    document.body.style.overflow = 'hidden'

    document.getElementById(CLOSE_BUTTON_ID)?.addEventListener('click', closeOverlay)
    overlay.addEventListener('click', e => e.target === overlay && closeOverlay())
    document.getElementById(RETRY_BUTTON_ID)?.addEventListener('click', processSummarization)

    // Setup chat if available
    if (showChatButton) {
      setupChatListeners()
    }
  }

  /**
   * Closes the summary overlay.
   */
  function closeOverlay() {
    const overlay = document.getElementById(OVERLAY_ID)
    if (overlay) {
      overlay.remove()
      document.body.style.overflow = ''
    }
  }

  /**
   * Updates existing summary overlay content.
   * @param {string} contentHTML
   * @param {boolean} [isError=false]
   */
  function updateSummaryOverlay(contentHTML, isError = false) {
    const contentDiv = document.getElementById(CONTENT_ID)
    if (contentDiv) {
      const showChatButton   = !isError && !contentHTML.includes('class="glow"')
      let finalContentHTML   = buildHeaderButtonsHTML(showChatButton)
      finalContentHTML      += `<div class="summarize-body">${contentHTML}</div>`

      if (isError) {
        finalContentHTML += `<button id="${RETRY_BUTTON_ID}" class="retry-button">Try Again</button>`
      }
      else if (showChatButton) {
        finalContentHTML += buildChatHTML()
        // Store summary for chat context
        lastSummary = contentHTML
      }

      contentDiv.innerHTML = finalContentHTML

      document.getElementById(CLOSE_BUTTON_ID)?.addEventListener('click', closeOverlay)
      document.getElementById(RETRY_BUTTON_ID)?.addEventListener('click', processSummarization)

      // Setup chat if available
      if (showChatButton) {
        setupChatListeners()
      }
    }
  }

  /**
   * Shows a temporary error notification.
   * @param {string} message
   */
  function showErrorNotification(message) {
    document.getElementById(ERROR_ID)?.remove()

    const errorDiv     = document.createElement('div')
    errorDiv.id        = ERROR_ID
    errorDiv.innerText = message
    document.body.appendChild(errorDiv)

    setTimeout(() => errorDiv.remove(), 4000)
  }

  /**
   * Hides an element.
   * @param {string} id
   */
  function hideElement(id) {
    const el = document.getElementById(id)
    if (el) el.style.setProperty('display', 'none', 'important')
  }

  /**
   * Shows an element.
   * @param {string} id
   */
  function showElement(id) {
    const el = document.getElementById(id)
    if (el) {
      const displayValue = (id === BUTTON_ID) ? 'flex' : 'block'
      el.style.setProperty('display', displayValue, 'important')
    }
  }

  // --- Chat Functions ---

  /**
   * Sets up event listeners for the chat interface.
   */
  function setupChatListeners() {
    const chatToggle = document.getElementById(CHAT_TOGGLE_ID)
    const chatInput  = document.getElementById(CHAT_INPUT_ID)
    const chatSend   = document.getElementById(CHAT_SEND_ID)

    chatToggle?.addEventListener('click', toggleChat)

    chatSend?.addEventListener('click', () => sendChatMessage())

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendChatMessage()
      }
      // Stop escape from closing overlay when typing
      if (e.key === 'Escape') {
        e.stopPropagation()
        chatInput.blur()
      }
    })
  }

  /**
   * Scrolls to and focuses the chat input.
   */
  function toggleChat() {
    const chatInput = document.getElementById(CHAT_INPUT_ID)
    if (chatInput) {
      chatInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      chatInput.focus()
    }
  }

  /**
   * Adds a message to the chat display.
   * @param {string} text
   * @param {string} role - 'user' or 'assistant'
   */
  function addChatMessage(text, role) {
    const messagesDiv = document.getElementById(CHAT_MESSAGES_ID)
    if (!messagesDiv) return

    const msgDiv       = document.createElement('div')
    msgDiv.className   = `chat-message ${role}`
    msgDiv.innerHTML   = role === 'assistant' ? text : escapeHtml(text)
    messagesDiv.appendChild(msgDiv)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
  }

  /**
   * Escapes HTML special characters.
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div       = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Sends a chat message and gets AI response.
   */
  async function sendChatMessage() {
    const chatInput = document.getElementById(CHAT_INPUT_ID)
    const chatSend  = document.getElementById(CHAT_SEND_ID)
    const message   = chatInput?.value?.trim()

    if (!message || !articleData) return

    // Disable input while processing
    chatInput.disabled = true
    chatSend.disabled  = true
    chatInput.value    = ''

    // Add user message to display
    addChatMessage(message, 'user')

    // Add to history
    chatHistory.push({ role: 'user', content: message })

    try {
      const modelConfig = getActiveModelConfig()
      if (!modelConfig) {
        throw new Error('Model configuration not found')
      }

      const apiKey = await getApiKey(modelConfig.service)
      if (!apiKey) {
        throw new Error('API key not found')
      }

      // Add loading indicator
      const loadingDiv     = document.createElement('div')
      loadingDiv.className = 'chat-message assistant'
      loadingDiv.innerHTML = '<span class="glow" style="padding: 0; font-size: 1em;">Thinking...</span>'
      loadingDiv.id        = 'chat-loading'
      document.getElementById(CHAT_MESSAGES_ID)?.appendChild(loadingDiv)

      const response = await sendChatRequest(modelConfig.service, apiKey, modelConfig)

      // Remove loading indicator
      document.getElementById('chat-loading')?.remove()

      // Parse and display response
      const assistantMessage = parseChatResponse(response, modelConfig.service)
      chatHistory.push({ role: 'assistant', content: assistantMessage })
      addChatMessage(assistantMessage, 'assistant')

    }
    catch (error) {
      document.getElementById('chat-loading')?.remove()
      addChatMessage(`Error: ${error.message}`, 'assistant')
    }
    finally {
      chatInput.disabled = false
      chatSend.disabled  = false
      chatInput.focus()
    }
  }

  /**
   * Sends a chat request to the AI API.
   * @param {string} service
   * @param {string} apiKey
   * @param {object} modelConfig
   * @returns {Promise<object>}
   */
  async function sendChatRequest(service, apiKey, modelConfig) {
    const group = MODEL_GROUPS[service]
    const url   = service === 'openai'
      ? group.baseUrl
      : `${group.baseUrl}${modelConfig.id}:generateContent?key=${apiKey}`

    const body    = buildChatRequestBody(service, modelConfig)
    const timeout = getRequestTimeout(modelConfig)

    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method      : 'POST',
        url         : url,
        headers     : getHeaders(service, apiKey),
        data        : JSON.stringify(body),
        responseType: 'json',
        timeout     : timeout,
        onload      : response => {
          const responseData = response.response || response.responseText
          if (response.status < 200 || response.status >= 300) {
            const errorData = typeof responseData === 'object' ? responseData : JSON.parse(responseData || '{}')
            reject(new Error(errorData?.error?.message || `API Error ${response.status}`))
          }
          else {
            resolve({
              status: response.status,
              data  : typeof responseData === 'object' ? responseData : JSON.parse(responseData || '{}')
            })
          }
        },
        onerror  : () => reject(new Error('Network error')),
        onabort  : () => reject(new Error('Request aborted')),
        ontimeout: () => reject(new Error('Request timed out')),
      })
    })
  }

  /**
   * Builds the chat request body.
   * @param {string} service
   * @param {object} modelConfig
   * @returns {object}
   */
  function buildChatRequestBody(service, modelConfig) {
    const lang          = navigator.language || 'en-US'
    const systemContext = `You are a helpful assistant discussing an article. Here's the context:

Article Title: ${articleData.title}
Article Summary: ${lastSummary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}

Respond helpfully to questions about this article. Use ${lang} language. Use HTML formatting for responses (no markdown, no code blocks). Keep responses concise but informative.`

    if (service === 'openai') {
      const messages = [
        { role: 'system', content: systemContext },
        ...chatHistory.map(m => ({ role: m.role, content: m.content }))
      ]

      const serviceDefaults     = MODEL_GROUPS.openai.defaultParams || {}
      const modelSpecificParams = modelConfig.params || {}
      const finalParams         = { ...serviceDefaults, ...modelSpecificParams }

      return {
        model: modelConfig.id,
        messages,
        ...finalParams
      }
    }
    else { // gemini
      const contents = []

      // Add system context as first user message
      contents.push({ role: 'user', parts: [ { text: systemContext } ] })
      contents.push({ role: 'model', parts: [ { text: 'I understand. I will help answer questions about this article.' } ] })

      // Add chat history
      chatHistory.forEach(m => {
        contents.push({
          role : m.role === 'user' ? 'user' : 'model',
          parts: [ { text: m.content } ]
        })
      })

      const geminiDefaults        = MODEL_GROUPS.gemini.defaultParams || {}
      const modelParamsFromConfig = modelConfig.params || {}
      let finalGenerationConfig   = { ...geminiDefaults, ...modelParamsFromConfig }

      if (modelConfig.isCustom) {
        if (modelConfig.supportsThinking === true) {
          delete finalGenerationConfig.thinkingConfig
        }
        else {
          finalGenerationConfig.thinkingConfig = { thinkingBudget: 0 }
        }
      }

      return {
        contents,
        generationConfig: finalGenerationConfig
      }
    }
  }

  /**
   * Parses chat response from API.
   * @param {object} response
   * @param {string} service
   * @returns {string}
   */
  function parseChatResponse(response, service) {
    if (service === 'openai') {
      return response.data?.choices?.[0]?.message?.content || 'No response received'
    }
    else {
      const candidate = response.data?.candidates?.[0]
      if (candidate?.content?.parts?.length > 0) {
        return candidate.content.parts[0].text || 'No response received'
      }
      return 'No response received'
    }
  }

  /**
   * Gets the appropriate timeout for a model.
   * @param {object} modelConfig
   * @returns {number}
   */
  function getRequestTimeout(modelConfig) {
    // Check if model has thinking enabled
    const hasThinking = modelConfig.params && !modelConfig.params.thinkingConfig
    const isProModel  = modelConfig.id.toLowerCase().includes('pro')
    const isO3orO4    = /^o[34]/i.test(modelConfig.id)

    // Custom models with thinking support
    const customWithThinking = modelConfig.isCustom && modelConfig.supportsThinking === true

    if (hasThinking || isProModel || isO3orO4 || customWithThinking) {
      return THINKING_TIMEOUT
    }

    return DEFAULT_TIMEOUT
  }

  // --- Logic Functions (Summarization, API, Models) ---

  /**
   * Gets the active model's configuration.
   * @returns {object|null}
   */
  function getActiveModelConfig() {
    for (const serviceKey in MODEL_GROUPS) {
      const group       = MODEL_GROUPS[serviceKey]
      const modelConfig = group.models.find(m => m.id === activeModel)
      if (modelConfig) {
        return { ...modelConfig, service: serviceKey, isCustom: false }
      }
    }
    // For custom models, `service` and `supportsThinking` are part of the customConfig object itself
    const customConfig = customModels.find(m => m.id === activeModel)
    if (customConfig) {
      return { ...customConfig, isCustom: true } // `params` will be undefined for custom models for now
    }
    console.error(`Summarize with AI: Active model configuration not found for ID: ${activeModel}`)
    return null
  }


  /**
   * Orchestrates the summarization process.
   */
  async function processSummarization() {
    try {
      if (!articleData) {
        showErrorNotification('Article content not found or not readable.')
        return
      }

      const modelConfig = getActiveModelConfig()
      if (!modelConfig) {
        showErrorNotification(`Configuration for model "${activeModel}" not found. Please select another model.`)
        return
      }

      const modelDisplayName = modelConfig.name || modelConfig.id
      const service          = modelConfig.service

      const apiKey = await getApiKey(service)
      if (!apiKey) {
        const errorMsg = `API key for ${service.toUpperCase()} is required. Click the 'Reset Key' link in the model selection menu (long-press 'S' button).`
        if (document.getElementById(OVERLAY_ID)) {
          updateSummaryOverlay(`<p style="color: red;">${errorMsg}</p>`, false)
        }
        else {
          showErrorNotification(errorMsg)
        }
        return
      }

      const loadingMessage = `<p class="glow">Summarizing with ${modelDisplayName}... </p>`
      if (document.getElementById(OVERLAY_ID)) {
        updateSummaryOverlay(loadingMessage)
      }
      else {
        showSummaryOverlay(loadingMessage)
      }

      const payload  = { title: articleData.title, content: articleData.content, lang: navigator.language || 'en-US' }
      const response = await sendApiRequest(service, apiKey, payload, modelConfig)

      handleApiResponse(response, service)

    }
    catch (error) {
      const errorMsg = `Error: ${error.message}`
      console.error('Summarize with AI:', errorMsg, error)
      showSummaryOverlay(`<p style="color: red;">${errorMsg}</p>`, true)
      hideElement(DROPDOWN_ID)
    }
  }

  /**
   * Sends API request.
   * @param {string} service
   * @param {string} apiKey
   * @param {object} payload
   * @param {object} modelConfig
   * @returns {Promise<object>}
   */
  async function sendApiRequest(service, apiKey, payload, modelConfig) {
    const group   = MODEL_GROUPS[service]
    const url     = service === 'openai'
      ? group.baseUrl
      : `${group.baseUrl}${modelConfig.id}:generateContent?key=${apiKey}`
    const timeout = getRequestTimeout(modelConfig)

    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method      : 'POST',
        url         : url,
        headers     : getHeaders(service, apiKey),
        data        : JSON.stringify(buildRequestBody(service, payload, modelConfig)),
        responseType: 'json',
        timeout     : timeout,
        onload      : response => {
          const responseData = response.response || response.responseText
          resolve({
            status    : response.status,
            data      : typeof responseData === 'object' ? responseData : JSON.parse(responseData || '{}'),
            statusText: response.statusText,
          })
        },
        onerror     : error => reject(new Error(`Network error: ${error.statusText || 'Failed to connect'}`)),
        onabort     : () => reject(new Error('Request aborted')),
        ontimeout   : () => reject(new Error(`Request timed out after ${timeout / 1000} seconds`)),
      })
    })
  }

  /**
   * Handles API response.
   * @param {object} response
   * @param {string} service
   * @throws {Error}
   */
  function handleApiResponse(response, service) {
    const { status, data, statusText } = response

    if (status < 200 || status >= 300) {
      const errorDetails = data?.error?.message || data?.message || statusText || 'Unknown API error'
      throw new Error(`API Error (${status}): ${errorDetails}`)
    }

    let rawSummary = ''
    if (service === 'openai') {
      const choice       = data?.choices?.[0]
      rawSummary         = choice?.message?.content
      const finishReason = choice?.finish_reason
      console.log(`Summarize with AI: OpenAI Finish Reason: ${finishReason} (Model: ${activeModel})`)
      if (finishReason === 'length') {
        console.warn('Summarize with AI: Summary may be incomplete because the max token limit was reached.')
      }

    }
    else if (service === 'gemini') {
      const candidate    = data?.candidates?.[0]
      const finishReason = candidate?.finishReason
      console.log(`Summarize with AI: Gemini Finish Reason: ${finishReason} (Model: ${activeModel})`)

      if (finishReason === 'SAFETY') {
        const safetyRatings = candidate.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ')
        throw new Error(`Content blocked due to safety concerns (${safetyRatings || 'No details'}).`)
      }
      if (finishReason === 'MAX_TOKENS') {
        console.warn('Summarize with AI: Summary may be incomplete because the max token limit was reached.')
      }

      if (candidate?.content?.parts?.length > 0 && candidate.content.parts[0].text) {
        rawSummary = candidate.content.parts[0].text
      }
      else if (finishReason && ![ 'STOP', 'SAFETY', 'MAX_TOKENS' ].includes(finishReason)) {
        console.warn(`Summarize with AI: Gemini response structure missing expected text content or unusual finish reason: ${finishReason}`, candidate)
      }
      else if (!rawSummary && !data?.error) {
        console.warn('Summarize with AI: Gemini response structure missing expected text content.', candidate)
      }
    }

    if (!rawSummary && !data?.error) {
      console.error('Summarize with AI: API Response Data:', data)
      throw new Error('API response did not contain a valid summary.')
    }

    const cleanedSummary = rawSummary.replace(/\n/g, ' ').replace(/ {2,}/g, ' ').trim()
    updateSummaryOverlay(cleanedSummary, false)
  }

  /**
   * Builds the request body for API call.
   * @param {string} service
   * @param {object} payload
   * @param {object} modelConfig
   * @returns {object}
   */
  function buildRequestBody(service, { title, content, lang }, modelConfig) {
    const systemPrompt = PROMPT_TEMPLATE(title, content, lang)

    if (service === 'openai') {
      const serviceDefaults     = MODEL_GROUPS.openai.defaultParams || {}
      const modelSpecificParams = modelConfig.params || {} // For custom models, this will be undefined/empty from getActiveModelConfig
      const finalParams         = { ...serviceDefaults, ...modelSpecificParams }

      return {
        model   : modelConfig.id,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate the summary as requested.' }
        ],
        ...finalParams
      }
    }
    else { // gemini
      const geminiDefaults        = MODEL_GROUPS.gemini.defaultParams || {}
      const modelParamsFromConfig = modelConfig.params || {} // For standard models from MODEL_GROUPS
      // For custom models, modelConfig.params is undefined from getActiveModelConfig
      let finalGenerationConfig = { ...geminiDefaults, ...modelParamsFromConfig }

      if (modelConfig.isCustom) {
        // For custom Gemini models, modelConfig.params from getActiveModelConfig is undefined.
        // We rely on modelConfig.supportsThinking.
        if (modelConfig.supportsThinking === true) {
          // If user indicated it supports thinking, we want Gemini API's default behavior for thinking.
          // So, remove any thinkingConfig that might have been inherited (e.g., if geminiDefaults had one, which it shouldn't).
          delete finalGenerationConfig.thinkingConfig
        }
        else { // supportsThinking is false or undefined (treat undefined as false for safety for older custom models)
          // Explicitly disable thinking if not supported or unknown for custom model.
          finalGenerationConfig.thinkingConfig = { thinkingBudget: 0 }
        }
      }
      // For standard Gemini models, their 'params' in MODEL_GROUPS (already merged into finalGenerationConfig via modelParamsFromConfig)
      // will dictate thinkingConfig. If a standard model has no thinkingConfig in its params,
      // and geminiDefaults also has no thinkingConfig (which is the new setup),
      // then no thinkingConfig is sent, and Gemini API uses its own default (thinking enabled for 2.5 Pro, potentially others).

      return {
        contents        : [ { parts: [ { text: systemPrompt } ] } ],
        generationConfig: finalGenerationConfig
      }
    }
  }

  /**
   * Returns HTTP headers.
   * @param {string} service
   * @param {string} apiKey
   * @returns {object}
   */
  function getHeaders(service, apiKey) {
    const headers = { 'Content-Type': 'application/json' }
    if (service === 'openai') {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    return headers
  }

  /**
   * Retrieves API key for a service.
   * @param {string} service
   * @returns {Promise<string|null>}
   */
  async function getApiKey(service) {
    const storageKey = `${service}_api_key`
    let apiKey       = await GM.getValue(storageKey)
    return apiKey?.trim() || null
  }

  /**
   * Handles API key reset for a service.
   * @param {string} service
   */
  async function handleApiKeyReset(service) {
    if (!service || !MODEL_GROUPS[service]) {
      console.error('Invalid service provided for API key reset:', service)
      alert('Internal error: Invalid service provided.')
      return
    }
    const storageKey = `${service}_api_key`
    const newKey     = prompt(`Enter the new ${service.toUpperCase()} API key (leave blank to clear):`)

    if (newKey !== null) {
      const keyToSave = newKey.trim()
      await GM.setValue(storageKey, keyToSave)
      if (keyToSave) {
        alert(`${service.toUpperCase()} API key updated!`)
      }
      else {
        alert(`${service.toUpperCase()} API key cleared!`)
      }
    }
  }

  /**
   * Handles adding a new custom model.
   */
  async function handleAddModel() {
    const service = prompt('Enter the service for the custom model (openai / gemini):')?.toLowerCase()?.trim()
    if (!service || !MODEL_GROUPS[service]) {
      if (service !== null) alert('Invalid service. Please enter "openai" or "gemini".')
      return
    }

    const modelId = prompt(`Enter the exact ID of the ${service.toUpperCase()} model:`)?.trim()
    if (!modelId) {
      if (modelId !== null) alert('Model ID cannot be empty.')
      return
    }

    let supportsThinking = undefined // Stays undefined for OpenAI or if user cancels for Gemini
    if (service === 'gemini') {
      const thinkingInput = prompt(`Does this custom Gemini model ("${modelId}") support 'thinking' (e.g., gemini-2.5-pro)? (yes/no):`)?.toLowerCase()?.trim()
      if (thinkingInput === null) return // User cancelled prompt
      if (![ 'yes', 'no' ].includes(thinkingInput)) {
        alert('Invalid input for thinking support. Please enter "yes" or "no".')
        return
      }
      supportsThinking = (thinkingInput === 'yes')
    }

    await addCustomModel(service, modelId, supportsThinking)
  }

  /**
   * Adds a custom model.
   * @param {string} service
   * @param {string} modelId
   * @param {boolean|undefined} supportsThinking - Undefined if not Gemini or if not applicable.
   */
  async function addCustomModel(service, modelId, supportsThinking) {
    const existsInCustom   = customModels.some(m => m.service === service && m.id.toLowerCase() === modelId.toLowerCase())
    const existsInStandard = MODEL_GROUPS[service]?.models.some(m => m.id.toLowerCase() === modelId.toLowerCase())

    if (existsInCustom || existsInStandard) {
      alert(`Model ID "${modelId}" already exists for ${service.toUpperCase()}.`)
      return
    }

    const newModel = { id: modelId, service }
    if (service === 'gemini' && typeof supportsThinking === 'boolean') {
      newModel.supportsThinking = supportsThinking
    }

    customModels.push(newModel)
    await GM.setValue(CUSTOM_MODELS_KEY, JSON.stringify(customModels))
    alert(`Custom model "${modelId}" (${service.toUpperCase()}) added!`)
  }

  /**
   * Handles removal of a custom model.
   * @param {string} modelId
   * @param {string} service
   */
  async function handleModelRemoval(modelId, service) {
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm(`Are you sure you want to delete the custom model "${modelId}"?`)
    if (confirmed) {
      customModels = customModels.filter(m => !(m.id.toLowerCase() === modelId.toLowerCase() && m.service === service))
      await GM.setValue(CUSTOM_MODELS_KEY, JSON.stringify(customModels))

      if (activeModel === modelId) {
        activeModel = 'gemini-flash-lite-latest'
        await GM.setValue('last_used_model', activeModel)
      }

      const dropdown = document.getElementById(DROPDOWN_ID)
      if (dropdown && dropdown.style.display !== 'none') {
        populateDropdown(dropdown)
      }
      alert(`Model "${modelId}" has been removed.`)
    }
  }


  /**
   * Loads custom models from storage.
   * @returns {Promise<Array<object>>}
   */
  async function getCustomModels() {
    try {
      const storedModels = await GM.getValue(CUSTOM_MODELS_KEY, '[]')
      const parsedModels = JSON.parse(storedModels)
      if (Array.isArray(parsedModels) && parsedModels.every(m =>
        typeof m === 'object' && m.id && m.service &&
        (m.service !== 'gemini' || typeof m.supportsThinking === 'boolean' || typeof m.supportsThinking === 'undefined') // Check supportsThinking validity
      )) {
        return parsedModels
      }
      else {
        console.warn('Summarize with AI: Invalid custom model format found in storage. Resetting.', parsedModels)
        await GM.setValue(CUSTOM_MODELS_KEY, '[]')
        return []
      }
    }
    catch (error) {
      console.error('Summarize with AI: Failed to load/parse custom models:', error)
      await GM.setValue(CUSTOM_MODELS_KEY, '[]')
      return []
    }
  }

  // --- Event Handlers & Utilities ---

  /**
   * Handles key press events.
   * @param {KeyboardEvent} e
   */
  function handleKeyPress(e) {
    if (e.altKey && e.code === 'KeyS' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const button = document.getElementById(BUTTON_ID)
      if (button) {
        if (!document.activeElement?.closest('input, textarea, select, [contenteditable="true"]')) {
          processSummarization()
        }
      }
    }
    if (e.key === 'Escape') {
      if (document.getElementById(OVERLAY_ID)) {
        e.preventDefault()
        closeOverlay()
      }
      else if (document.getElementById(DROPDOWN_ID)?.style.display !== 'none') {
        e.preventDefault()
        hideElement(DROPDOWN_ID)
      }
    }
  }

  /**
   * Sets up focus listeners to hide/show button.
   */
  function setupFocusListeners() {
    document.addEventListener('focusin', (event) => {
      if (event.target?.closest('input, textarea, select, [contenteditable="true"]')) {
        hideElement(BUTTON_ID)
        hideElement(DROPDOWN_ID)
      }
    })

    document.addEventListener('focusout', (event) => {
      const isLeavingInput  = event.target?.closest('input, textarea, select, [contenteditable="true"]')
      const isEnteringInput = event.relatedTarget?.closest('input, textarea, select, [contenteditable="true"]')

      if (isLeavingInput && !isEnteringInput && articleData) {
        setTimeout(() => {
          if (!document.activeElement?.closest('input, textarea, select, [contenteditable="true"]')) {
            showElement(BUTTON_ID)
          }
        }, 50)
      }
    }, true)
  }

  /**
   * Injects CSS styles.
   */
  function injectStyles() {
    GM.addStyle(`
      /* --- Main Summarize Button --- */
      #${BUTTON_ID} {
        all: initial !important;
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 50px !important;
        height: 50px !important;
        background: linear-gradient(145deg, #3a7bd5, #00d2ff) !important;
        color: white !important;
        font-size: 24px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        z-index: 2147483640 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out !important;
        line-height: 1 !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
        border: none !important;
      }
      #${BUTTON_ID}:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
      }

      /* --- Dropdown Menu --- */
      #${DROPDOWN_ID} {
        all: initial !important;
        position: fixed !important;
        bottom: 80px !important;
        right: 20px !important;
        background: #ffffff !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18) !important;
        z-index: 2147483641 !important;
        max-height: 70vh !important;
        overflow-y: auto !important;
        padding: 10px !important;
        width: 300px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        display: none !important;
        box-sizing: border-box !important;
      }

      #${DROPDOWN_ID} * {
        box-sizing: border-box !important;
        font-family: inherit !important;
      }

      #${DROPDOWN_ID} .model-group { margin-bottom: 10px !important; }
      #${DROPDOWN_ID} .group-header-container {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 14px !important;
        background: #f5f5f5 !important;
        border-radius: 8px !important;
        margin-bottom: 6px !important;
      }
      #${DROPDOWN_ID} .group-header-text {
        font-weight: 700 !important;
        color: #333 !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.8px !important;
      }
      #${DROPDOWN_ID} .reset-key-link {
        font-size: 11px !important;
        color: #888 !important;
        text-decoration: none !important;
        cursor: pointer !important;
      }
      #${DROPDOWN_ID} .reset-key-link:hover { color: #3a7bd5 !important; }
      #${DROPDOWN_ID} .model-item {
        padding: 11px 14px !important;
        margin: 3px 0 !important;
        border-radius: 8px !important;
        font-size: 14px !important;
        cursor: pointer !important;
        color: #444 !important;
        display: block !important;
        background: transparent !important;
      }
      #${DROPDOWN_ID} .model-item:hover {
        background-color: rgba(58, 123, 213, 0.1) !important;
        color: #3a7bd5 !important;
      }
      #${DROPDOWN_ID} .add-model-item { color: #888 !important; font-style: italic !important; }
      #${DROPDOWN_ID} hr { margin: 10px 0 !important; border: none !important; border-top: 1px solid #e5e5e5 !important; }

      /* --- Overlay --- */
      #${OVERLAY_ID} {
        all: initial !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(0, 0, 0, 0.75) !important;
        z-index: 2147483645 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        padding: 20px !important;
        box-sizing: border-box !important;
        backdrop-filter: blur(4px) !important;
      }

      /* --- Content Panel --- */
      #${CONTENT_ID} {
        all: initial !important;
        display: block !important;
        background-color: #fefefe !important;
        color: #2d2d2d !important;
        padding: 28px 36px 36px !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        max-width: 720px !important;
        width: 100% !important;
        max-height: 85vh !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        position: relative !important;
        font-family: 'Georgia', 'Times New Roman', serif !important;
        font-size: 18px !important;
        line-height: 1.75 !important;
        box-sizing: border-box !important;
        -webkit-font-smoothing: antialiased !important;
      }

      #${CONTENT_ID} * {
        box-sizing: border-box !important;
      }

      /* --- Header Buttons --- */
      #${CONTENT_ID} .summarize-header-buttons {
        position: sticky !important;
        top: 0 !important;
        float: right !important;
        display: flex !important;
        gap: 8px !important;
        margin: -8px -8px 12px 12px !important;
        z-index: 100 !important;
      }

      #${CONTENT_ID} .summarize-header-btn {
        all: initial !important;
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 16px !important;
        line-height: 1 !important;
        transition: all 0.15s ease !important;
        box-sizing: border-box !important;
      }

      #${CONTENT_ID} .summarize-close-btn {
        background: #f0f0f0 !important;
        color: #666 !important;
        font-family: Arial, sans-serif !important;
        font-weight: 300 !important;
      }
      #${CONTENT_ID} .summarize-close-btn:hover {
        background: #e0e0e0 !important;
        color: #333 !important;
      }

      #${CONTENT_ID} .summarize-chat-btn {
        background: linear-gradient(145deg, #3a7bd5, #00d2ff) !important;
        color: white !important;
        font-size: 14px !important;
      }
      #${CONTENT_ID} .summarize-chat-btn:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 2px 8px rgba(58, 123, 213, 0.4) !important;
      }

      /* --- Summary Body --- */
      #${CONTENT_ID} .summarize-body {
        clear: right !important;
      }

      #${CONTENT_ID} .summarize-body p {
        margin: 0 0 1.2em 0 !important;
        font-family: 'Georgia', 'Times New Roman', serif !important;
        font-size: 18px !important;
        line-height: 1.75 !important;
        color: #2d2d2d !important;
      }

      #${CONTENT_ID} .summarize-body ul {
        margin: 1.2em 0 !important;
        padding-left: 0.5em !important;
        list-style: none !important;
      }

      #${CONTENT_ID} .summarize-body li {
        list-style-type: none !important;
        margin-bottom: 0.8em !important;
        font-family: 'Georgia', 'Times New Roman', serif !important;
        font-size: 17px !important;
        line-height: 1.7 !important;
        color: #3d3d3d !important;
      }

      #${CONTENT_ID} .summarize-body strong {
        font-weight: 700 !important;
        color: #1a1a1a !important;
      }

      /* --- Loading Glow --- */
      #${CONTENT_ID} .glow {
        display: block !important;
        font-size: 1.4em !important;
        text-align: center !important;
        padding: 60px 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-weight: 500 !important;
        color: #3a7bd5 !important;
        animation: summarize-glow 2.5s ease-in-out infinite !important;
      }

      /* --- Article Quality Colors --- */
      #${CONTENT_ID} span.article-excellent { color: #059669 !important; font-weight: 700 !important; }
      #${CONTENT_ID} span.article-good { color: #2563eb !important; font-weight: 700 !important; }
      #${CONTENT_ID} span.article-average { color: #d97706 !important; font-weight: 700 !important; }
      #${CONTENT_ID} span.article-bad { color: #dc2626 !important; font-weight: 700 !important; }
      #${CONTENT_ID} span.article-very-bad { color: #991b1b !important; font-weight: 700 !important; }

      /* --- Chat Container (inline, no separate scroll) --- */
      #${CONTENT_ID} #summarize-chat-container {
        display: block !important;
        margin-top: 28px !important;
        padding-top: 24px !important;
        border-top: 2px solid rgba(58, 123, 213, 0.15) !important;
      }

      /* --- Chat Messages (no separate scroll, flows with content) --- */
      #${CONTENT_ID} #summarize-chat-messages {
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        margin-bottom: 20px !important;
        padding: 0 !important;
      }

      /* --- iMessage Style Chat Bubbles --- */
      #${CONTENT_ID} .chat-message {
        max-width: 80% !important;
        padding: 12px 16px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 15px !important;
        line-height: 1.5 !important;
        word-wrap: break-word !important;
        position: relative !important;
      }

      /* User messages - green/teal on right (like iMessage sender) */
      #${CONTENT_ID} .chat-message.user {
        align-self: flex-end !important;
        background: linear-gradient(135deg, #34c759, #30d158) !important;
        color: white !important;
        border-radius: 18px 18px 4px 18px !important;
        margin-left: auto !important;
      }

      /* Assistant messages - gray on left (like iMessage receiver) */
      #${CONTENT_ID} .chat-message.assistant {
        align-self: flex-start !important;
        background: #e9e9eb !important;
        color: #1c1c1e !important;
        border-radius: 18px 18px 18px 4px !important;
        margin-right: auto !important;
      }

      /* --- Chat Input --- */
      #${CONTENT_ID} #summarize-chat-input-container {
        display: flex !important;
        gap: 10px !important;
        align-items: center !important;
        background: #f5f5f5 !important;
        padding: 8px !important;
        border-radius: 24px !important;
        margin-top: 8px !important;
      }

      #${CONTENT_ID} #summarize-chat-input {
        all: initial !important;
        flex: 1 !important;
        padding: 10px 16px !important;
        border: none !important;
        background: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 15px !important;
        color: #2d2d2d !important;
        outline: none !important;
        box-sizing: border-box !important;
      }

      #${CONTENT_ID} #summarize-chat-input::placeholder {
        color: #999 !important;
      }

      #${CONTENT_ID} #summarize-chat-send {
        all: initial !important;
        padding: 10px 20px !important;
        background: linear-gradient(145deg, #3a7bd5, #00d2ff) !important;
        color: white !important;
        border: none !important;
        border-radius: 20px !important;
        cursor: pointer !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        transition: all 0.2s !important;
        box-sizing: border-box !important;
      }

      #${CONTENT_ID} #summarize-chat-send:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(58, 123, 213, 0.4) !important;
      }

      #${CONTENT_ID} #summarize-chat-send:disabled {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
        transform: none !important;
      }

      /* --- Retry Button --- */
      #${CONTENT_ID} .retry-button {
        all: initial !important;
        display: block !important;
        margin: 24px auto 0 !important;
        padding: 12px 24px !important;
        background: linear-gradient(145deg, #3a7bd5, #00d2ff) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        box-sizing: border-box !important;
      }
      #${CONTENT_ID} .retry-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(58, 123, 213, 0.4) !important;
      }

      /* --- Error Notification --- */
      #${ERROR_ID} {
        all: initial !important;
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-color: #dc2626 !important;
        color: white !important;
        padding: 14px 24px !important;
        border-radius: 10px !important;
        z-index: 2147483646 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        box-sizing: border-box !important;
      }

      /* --- Scrollbar Styling --- */
      #${CONTENT_ID}::-webkit-scrollbar,
      #${DROPDOWN_ID}::-webkit-scrollbar {
        width: 8px !important;
      }
      #${CONTENT_ID}::-webkit-scrollbar-track,
      #${DROPDOWN_ID}::-webkit-scrollbar-track {
        background: transparent !important;
      }
      #${CONTENT_ID}::-webkit-scrollbar-thumb,
      #${DROPDOWN_ID}::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.15) !important;
        border-radius: 4px !important;
      }
      #${CONTENT_ID}::-webkit-scrollbar-thumb:hover,
      #${DROPDOWN_ID}::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.25) !important;
      }

      /* --- Animations --- */
      @keyframes summarize-glow {
        0%, 100% { color: #3a7bd5; text-shadow: 0 0 12px rgba(58, 123, 213, 0.6), 0 0 24px rgba(58, 123, 213, 0.4); }
        33%      { color: #8b5cf6; text-shadow: 0 0 14px rgba(139, 92, 246, 0.7), 0 0 28px rgba(139, 92, 246, 0.5); }
        66%      { color: #ec4899; text-shadow: 0 0 14px rgba(236, 72, 153, 0.7), 0 0 28px rgba(236, 72, 153, 0.5); }
      }

      /* --- Dark Mode --- */
      @media (prefers-color-scheme: dark) {
        #${OVERLAY_ID} {
          background-color: rgba(0, 0, 0, 0.85) !important;
        }

        #${CONTENT_ID} {
          background-color: #1c1c1e !important;
          color: #e5e5e5 !important;
        }

        #${CONTENT_ID} .summarize-body p,
        #${CONTENT_ID} .summarize-body li {
          color: #e5e5e5 !important;
        }

        #${CONTENT_ID} .summarize-body strong {
          color: #ffffff !important;
        }

        #${CONTENT_ID} .summarize-close-btn {
          background: #3a3a3c !important;
          color: #999 !important;
        }
        #${CONTENT_ID} .summarize-close-btn:hover {
          background: #4a4a4c !important;
          color: #fff !important;
        }

        #${CONTENT_ID} .chat-message.assistant {
          background: #3a3a3c !important;
          color: #e5e5e5 !important;
        }

        #${CONTENT_ID} #summarize-chat-input-container {
          background: #2c2c2e !important;
        }

        #${CONTENT_ID} #summarize-chat-input {
          color: #e5e5e5 !important;
        }
        #${CONTENT_ID} #summarize-chat-input::placeholder {
          color: #666 !important;
        }

        #${CONTENT_ID} #summarize-chat-container {
          border-top-color: rgba(96, 165, 250, 0.2) !important;
        }

        #${DROPDOWN_ID} {
          background: #2c2c2e !important;
          border-color: #3a3a3c !important;
        }
        #${DROPDOWN_ID} .model-item { color: #e5e5e5 !important; }
        #${DROPDOWN_ID} .model-item:hover { background-color: rgba(58, 123, 213, 0.2) !important; color: #60a5fa !important; }
        #${DROPDOWN_ID} .group-header-container { background: #3a3a3c !important; }
        #${DROPDOWN_ID} .group-header-text { color: #e5e5e5 !important; }
        #${DROPDOWN_ID} hr { border-top-color: #3a3a3c !important; }

        #${CONTENT_ID}::-webkit-scrollbar-thumb,
        #${DROPDOWN_ID}::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15) !important;
        }
        #${CONTENT_ID}::-webkit-scrollbar-thumb:hover,
        #${DROPDOWN_ID}::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25) !important;
        }

        #${CONTENT_ID} span.article-excellent { color: #34d399 !important; }
        #${CONTENT_ID} span.article-good { color: #60a5fa !important; }
        #${CONTENT_ID} span.article-average { color: #fbbf24 !important; }
        #${CONTENT_ID} span.article-bad { color: #f87171 !important; }
        #${CONTENT_ID} span.article-very-bad { color: #ef4444 !important; }
      }

      /* --- Mobile Responsiveness --- */
      @media (max-width: 600px) {
        #${OVERLAY_ID} {
          padding: 0 !important;
        }

        #${CONTENT_ID} {
          max-width: none !important;
          max-height: none !important;
          height: 100% !important;
          border-radius: 0 !important;
          padding: 20px 20px 120px 20px !important;
        }

        #${CONTENT_ID} .summarize-header-buttons {
          margin: 0 0 16px 12px !important;
        }

        #${CONTENT_ID} .summarize-header-btn {
          width: 36px !important;
          height: 36px !important;
          font-size: 18px !important;
        }

        #${CONTENT_ID} .summarize-body p,
        #${CONTENT_ID} .summarize-body li {
          font-size: 16px !important;
        }

        #${CONTENT_ID} #summarize-chat-input-container {
          flex-direction: column !important;
          border-radius: 16px !important;
          padding: 12px !important;
        }

        #${CONTENT_ID} #summarize-chat-send {
          width: 100% !important;
          padding: 12px !important;
        }

        #${OVERLAY_ID} ~ #${BUTTON_ID},
        #${OVERLAY_ID} ~ #${DROPDOWN_ID} {
          display: none !important;
        }
      }
    `)
  }

  // --- Initialization ---
  // noinspection JSIgnoredPromiseFromCall
  initialize()

})()