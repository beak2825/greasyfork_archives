class GSEnhancedUI {
    constructor() {
        if (window.GSEnhancedUIInstance) {
            return window.GSEnhancedUIInstance;
        }

        window.GSEnhancedUIInstance = this;

        this.cache = {};
        this.currentTheme = GM_getValue('theme', 'default');

        const styles = `
            :root {
                --gs-primary: #e61515;
                --gs-secondary: #353534;
                --gs-background: #272726;
                --gs-text: #ffffff;
                --gs-border: #454545;
                --gs-hover: #404040;
            }

            .subscribelink {
                display: none !important;
            }

            .blocktable h2 {
                transition: background-color 0.3s ease;
                cursor: pointer;
            }

            .fa-magnet {
                margin-right: 8px;
                font-size: 14px;
                opacity: 0.7;
                transition: all 0.3s ease;
            }

            .blocktable h2:hover .fa-magnet {
                opacity: 1;
            }

            .fa-eye, .fa-eye-slash, .fa-desktop {
                font-size: 14px;
                padding: 2px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            .fa-eye:hover, .fa-eye-slash:hover, .fa-desktop:hover {
                opacity: 1;
            }

            .blockform table td .button {
                padding: 3px 10px;
                font-size: 0.9em;
                white-space: nowrap;
            }

            .blockform table td a:not(.button) {
                text-decoration: none;
                color: var(--gs-primary);
            }

            .blockform table td a:not(.button):hover {
                text-decoration: underline;
            }

            .section-header {
                user-select: none;
            }

            .section-header .fa-magnet {
                opacity: 0.7;
                font-size: 14px;
            }

            .section-header:hover .fa-magnet {
                opacity: 1;
            }

            [data-theme="light-red"] .pun a:link,
            [data-theme="light-red"] .pun a:visited,
            [data-theme="light-red"] .pun .tcl h3 a,
            [data-theme="light-red"] #brdmenu a:link,
            [data-theme="light-red"] #brdmenu a:visited {
                color: #ff4444 !important;
            }

            [data-theme="light-red"] .pun a:hover,
            [data-theme="light-red"] .pun a:active,
            [data-theme="light-red"] .pun .tcl h3 a:hover,
            [data-theme="light-red"] #brdmenu a:hover {
                color: #ff6666 !important;
            }

            [data-theme="light-orange"] .pun a:link,
            [data-theme="light-orange"] .pun a:visited,
            [data-theme="light-orange"] .pun .tcl h3 a,
            [data-theme="light-orange"] #brdmenu a:link,
            [data-theme="light-orange"] #brdmenu a:visited {
                color: #ffa500 !important;
            }

            [data-theme="light-orange"] .pun a:hover,
            [data-theme="light-orange"] .pun a:active,
            [data-theme="light-orange"] .pun .tcl h3 a:hover,
            [data-theme="light-orange"] #brdmenu a:hover {
                color: #ffc04d !important;
            }

            .inform {
                margin-bottom: 12px;
            }

            .infldset {
                padding: 12px;
            }

            .button-group {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .button-group .button {
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }

            .button-group .button i {
                font-size: 12px;
            }

            .input-with-button {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .input-with-button input {
                flex: 1;
            }

            .contains-error {
                border-color: #ff4444 !important;
            }

            .status-text {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 8px;
            }

            .status-text i {
                color: var(--gs-primary);
                font-size: 14px;
            }

            .chat-export-btn {
                cursor: pointer;
                margin-right: 5px;
                font-size: 16px;
                display: inline-block;
                vertical-align: middle;
                padding: 0 5px;
                transition: opacity 0.2s;
            }

            .chat-export-btn:hover {
                opacity: 0.7;
            }

            .export-status {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--gs-secondary);
                color: var(--gs-text);
                padding: 10px 15px;
                border-radius: 5px;
                border: 1px solid var(--gs-border);
                z-index: 10000;
                display: none;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }

            .export-status.show {
                display: block;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            .config-download-btn {
                display: inline-block;
                padding: 3px 10px;
                font-size: 0.9em;
                white-space: nowrap;
                text-decoration: none;
                border: none;
                cursor: pointer;
                background: inherit;
                color: inherit;
            }

            .config-download-btn:hover {
                text-decoration: underline;
            }

            .config-replaced {
                background: var(--gs-secondary);
                border: 1px dashed var(--gs-border);
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin: 10px 0;
            }

            .config-info {
                color: #888;
                font-size: 0.9em;
                margin-top: 5px;
            }

            .privacy-censored {
                background: #333 !important;
                color: #666 !important;
                border-radius: 3px;
                padding: 0 5px;
                font-family: monospace;
            }

            .privacy-censored::before {
                content: "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••";
                font-size: 0.8em;
            }

            .mention-suggestions {
                position: absolute;
                background: var(--gs-secondary);
                border: 1px solid var(--gs-border);
                border-radius: 3px;
                max-height: 120px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: none;
                font-size: 0.85em;
            }

            .mention-suggestion {
                padding: 4px 8px;
                cursor: pointer;
                border-bottom: 1px solid var(--gs-border);
                transition: background-color 0.2s;
            }

            .mention-suggestion:last-child {
                border-bottom: none;
            }

            .mention-suggestion:hover,
            .mention-suggestion.selected {
                background: var(--gs-hover);
            }

            .mention-suggestion .username {
                font-weight: bold;
                color: var(--gs-primary);
                font-size: 0.9em;
            }

            .mention-suggestion .user-info {
                font-size: 0.75em;
                color: #888;
                margin-top: 1px;
            }
        `;

        if (!document.getElementById('gs-enhanced-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'gs-enhanced-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        if (!window.GSEnhancedUIInitialized) {
            this.init();
            window.GSEnhancedUIInitialized = true;
        }
    }

    init() {
        this.addThemeToggle();
        this.addCollapsibleCategories();
        this.removeSubscribeLink();
        this.addRollButton();
        this.addChatExportButton();
        this.setupConfigDownloads();
        this.setupUndercoverMode();
        this.setupPrivacyMode();
        this.setupAutoMentionCompletion();
        this.setupResellerList();
        this.setupPremiumUI();
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    removeSubscribeLink() {
        const subscribeLink = document.querySelector('.subscribelink');
        if (subscribeLink) {
            subscribeLink.remove();
        }
    }

    addThemeToggle() {
        if (document.getElementById('theme-toggle')) return;

        const logoutLink = document.querySelector('#navlogout');
        if (!logoutLink) return;

        const themeToggle = document.createElement('li');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = this.getThemeIcon(this.currentTheme);

        themeToggle.addEventListener('click', () => {
            this.cycleTheme();
            themeToggle.innerHTML = this.getThemeIcon(this.currentTheme);
        });

        logoutLink.parentNode.insertBefore(themeToggle, logoutLink.nextSibling);
    }

    getThemeIcon(theme) {
        const icons = {
            'default': 'fa-adjust',
            'light-red': 'fa-fire',
            'light-orange': 'fa-sun-o'
        };
        return `<i class="fa ${icons[theme]} theme-icon"></i>`;
    }

    cycleTheme() {
        const themes = ['default', 'light-red', 'light-orange'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const newTheme = themes[(currentIndex + 1) % themes.length];
        this.currentTheme = newTheme;
        GM_setValue('theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
    }

    addRollButton() {
        if (document.querySelector('.chat-roll')) return;

        const emojiSelector = document.querySelector('#emojiselector');
        if (emojiSelector) {
            const rollButton = document.createElement('div');
            rollButton.className = 'chat-roll';
            rollButton.innerHTML = '🎲';
            rollButton.style.cssText = `
                cursor: pointer;
                margin-right: 5px;
                font-size: 16px;
                display: inline-block;
                vertical-align: middle;
                padding: 0 5px;
            `;

            rollButton.addEventListener('click', () => {
                const chatInput = document.querySelector('#shouttext');
                if (chatInput) {
                    chatInput.value = '/roll';
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    chatInput.dispatchEvent(event);
                }
            });

            emojiSelector.parentNode.insertBefore(rollButton, emojiSelector);
        }
    }

    addChatExportButton() {
        if (document.querySelector('.chat-export-btn')) return;

        const emojiSelector = document.querySelector('#emojiselector');
        if (emojiSelector) {
            const exportButton = document.createElement('div');
            exportButton.className = 'chat-export-btn';
            exportButton.innerHTML = '💾';
            exportButton.title = 'Export chat messages to JSON';

            exportButton.addEventListener('click', () => {
                this.exportChatMessages();
            });

            emojiSelector.parentNode.insertBefore(exportButton, emojiSelector);
        }
    }

    exportChatMessages() {
        const chatContainer = document.querySelector('#shout > div');
        if (!chatContainer) {
            this.showExportStatus('No chat messages found!', 'error');
            return;
        }

        const messages = [];
        const messageElements = chatContainer.querySelectorAll('p');

        messageElements.forEach((element, index) => {
            const timeElement = element.querySelector('.dateTime');
            const userLink = element.querySelector('a[href*="profile.php"]');

            if (timeElement && userLink) {
                const timestamp = timeElement.textContent.trim();
                const username = userLink.textContent.trim();
                const userClass = userLink.className;
                const userId = userLink.href.match(/id=(\d+)/)?.[1] || null;

                const fullText = element.textContent;
                const messageStart = fullText.indexOf(': ') + 2;
                const messageContent = messageStart > 1 ? fullText.substring(messageStart) : '';

                messages.push({
                    id: index + 1,
                    timestamp: timestamp,
                    username: username,
                    userId: userId,
                    userClass: userClass,
                    message: messageContent,
                    rawHTML: element.innerHTML,
                    exportedAt: new Date().toISOString()
                });
            }
        });

        if (messages.length === 0) {
            this.showExportStatus('No valid chat messages found!', 'error');
            return;
        }

        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                totalMessages: messages.length,
                source: 'GameSense Chat',
                url: window.location.href,
                userAgent: navigator.userAgent
            },
            messages: messages
        };

        try {
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `gamesense_chat_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showExportStatus(`Successfully exported ${messages.length} messages!`, 'success');
        } catch (error) {
            console.error('Export failed:', error);
            this.showExportStatus('Export failed! Check console for details.', 'error');
        }
    }

    setupConfigDownloads() {

        const posts = document.querySelectorAll('.postmsg p');

        posts.forEach(post => {
            const text = post.textContent.trim();

            if (this.isConfigCode(text)) {
                this.replaceConfigWithButton(post, text);
            }
        });
    }

    isConfigCode(text) {

        if (text.length < 500) return false;

        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        const hasMinimalSpaces = (text.split(' ').length - 1) < (text.length * 0.02); 
        const containsConfigPatterns = /[A-Za-z0-9]{50,}/.test(text);

        return (base64Pattern.test(text.replace(/\s/g, '')) || hasMinimalSpaces) && containsConfigPatterns;
    }

    replaceConfigWithButton(postElement, configData) {

        const postContainer = postElement.closest('.blockpost');
        const authorElement = postContainer.querySelector('.postleft dt strong a');
        const timestampElement = postContainer.querySelector('h2 a');

        const author = authorElement ? authorElement.textContent.trim() : 'Unknown';
        const timestamp = timestampElement ? timestampElement.textContent.trim() : 'Unknown';
        const postId = postContainer.id || 'unknown';

        const configContainer = document.createElement('div');
        configContainer.className = 'config-replaced';
        configContainer.innerHTML = `
            <div>
                <a class="config-download-btn button" onclick="this.nextElementSibling.click()">
                    Download Config
                </a>
                <a style="display: none;" download="gamesense_config_${author}_${postId}.txt" href="data:text/plain;charset=utf-8,${encodeURIComponent(configData)}"></a>
                <div class="config-info">
                    <i class="fa fa-user"></i> ${author} • 
                    <i class="fa fa-clock-o"></i> ${timestamp} • 
                    <i class="fa fa-file-text-o"></i> ${Math.round(configData.length / 1024)}KB
                </div>
            </div>
        `;

        postElement.innerHTML = '';
        postElement.appendChild(configContainer);

        const downloadBtn = configContainer.querySelector('.config-download-btn');
        downloadBtn.addEventListener('click', () => {
            this.showExportStatus(`Config downloaded from ${author}!`, 'success');
        });
    }

    showExportStatus(message, type = 'info') {

        const existingStatus = document.querySelector('.export-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusDiv = document.createElement('div');
        statusDiv.className = 'export-status';
        statusDiv.innerHTML = `
            <i class="fa ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info'}"></i>
            ${message}
        `;

        if (type === 'success') {
            statusDiv.style.borderColor = '#4CAF50';
            statusDiv.style.color = '#4CAF50';
        } else if (type === 'error') {
            statusDiv.style.borderColor = '#f44336';
            statusDiv.style.color = '#f44336';
        }

        document.body.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.classList.add('show');
        }, 10);

        setTimeout(() => {
            statusDiv.classList.remove('show');
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 300);
        }, 3000);
    }

    setupUndercoverMode() {
        const loggedInSpan = document.querySelector('#brdwelcome .conl li:first-child span');
        if (!loggedInSpan || loggedInSpan.querySelector('.fa-eye')) return;

        const usernameElement = loggedInSpan.querySelector('strong');
        if (usernameElement) {
            GM_setValue('username', usernameElement.textContent.trim());
        }

        const eyeButton = document.createElement('i');
        eyeButton.className = 'fa fa-eye';
        eyeButton.style.cssText = `
            cursor: pointer;
            margin-left: 5px;
            opacity: 0.7;
        `;
        eyeButton.title = 'Toggle Undercover Mode';

        const isUndercover = GM_getValue('undercover', false);
        if (isUndercover) {
            this.enableUndercoverMode();
            eyeButton.className = 'fa fa-eye-slash';
        }

        eyeButton.addEventListener('click', () => {
            const currentState = GM_getValue('undercover', false);
            GM_setValue('undercover', !currentState);

            if (!currentState) {
                this.enableUndercoverMode();
                eyeButton.className = 'fa fa-eye-slash';
            } else {
                this.disableUndercoverMode();
                eyeButton.className = 'fa fa-eye';
            }
        });

        loggedInSpan.appendChild(eyeButton);
    }

    setupPrivacyMode() {
        const loggedInSpan = document.querySelector('#brdwelcome .conl li:first-child span');
        if (!loggedInSpan || loggedInSpan.querySelector('.fa-desktop')) return;

        const privacyButton = document.createElement('i');
        privacyButton.className = 'fa fa-desktop';
        privacyButton.style.cssText = `
            cursor: pointer;
            margin-left: 5px;
            opacity: 0.7;
        `;
        privacyButton.title = 'Toggle Privacy Mode (Screen Share Safe)';

        const isPrivacyMode = GM_getValue('privacyMode', false);
        if (isPrivacyMode) {
            this.enablePrivacyMode();
            privacyButton.style.color = '#4CAF50';
        }

        privacyButton.addEventListener('click', () => {
            const currentState = GM_getValue('privacyMode', false);
            GM_setValue('privacyMode', !currentState);

            if (!currentState) {
                this.enablePrivacyMode();
                privacyButton.style.color = '#4CAF50';
                this.showExportStatus('Privacy Mode enabled - sensitive data hidden', 'success');
            } else {
                this.disablePrivacyMode();
                privacyButton.style.color = '';
                this.showExportStatus('Privacy Mode disabled', 'info');
            }
        });

        loggedInSpan.appendChild(privacyButton);
    }

    enableUndercoverMode() {
        const username = GM_getValue('username');
        if (!username) return;

        const selectors = [
            'a[href*="profile.php"]',
            '#brdwelcome .conl li:first-child strong',
            '.username',
            '.user-name',
            '.author'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(element => {
            if (element.textContent.trim() === username) {
                element.setAttribute('data-original', element.textContent);
                element.textContent = '<HIDDEN>';
            }
        });
    }

    disableUndercoverMode() {
        document.querySelectorAll('[data-original]').forEach(element => {
            if (element.getAttribute('data-original')) {
                element.textContent = element.getAttribute('data-original');
                element.removeAttribute('data-original');
            }
        });
    }

    enablePrivacyMode() {

        const sensitiveSelectors = [

            'input[name="req_email"]',
            'input[type="email"]',

            'input[name*="2fa"]',
            'input[name*="recovery"]',
            'input[name*="backup"]',
            'input[name*="secret"]',
            'input[name*="token"]',

            '*'
        ];

        document.querySelectorAll('input[name="req_email"], input[type="email"]').forEach(element => {
            if (!element.hasAttribute('data-original-value') && element.value) {
                element.setAttribute('data-original-value', element.value);
                element.value = element.value.replace(/^.+@/, '••••••••@');
            }
        });

        document.querySelectorAll('p').forEach(element => {
            const text = element.textContent;

            if (text.includes('Recovery code:') || text.includes('recovery code:')) {
                const codeMatch = text.match(/[a-f0-9]{32,}/i);
                if (codeMatch && !element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', element.textContent);
                    element.innerHTML = element.innerHTML.replace(codeMatch[0], 
                        `<span class="privacy-censored" data-sensitive="true"></span>`);
                }
            }

            const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                element.innerHTML = element.innerHTML.replace(emailMatch[0], 
                    '••••••••@••••••••.•••');
            }

            if (text.match(/Registered:\s*\d{4}-\d{2}-\d{2}/) && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                element.textContent = element.textContent.replace(/Registered:\s*\d{4}-\d{2}-\d{2}/, 'Registered: ••••-••-••');
            }

            if (text.match(/Last post:\s*.+\d{2}:\d{2}:\d{2}/) && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                element.textContent = element.textContent.replace(/Last post:\s*.+\d{2}:\d{2}:\d{2}/, 'Last post: •••••• ••:••:••');
            }

            if (text.match(/Last visit:\s*.+\d{2}:\d{2}:\d{2}/) && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                element.textContent = element.textContent.replace(/Last visit:\s*.+\d{2}:\d{2}:\d{2}/, 'Last visit: •••••• ••:••:••');
            }

            if (text.match(/Posts:\s*\d+/) && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                element.textContent = element.textContent.replace(/Posts:\s*\d+/, 'Posts: •••');
            }

            const keyMatch = text.match(/[A-Za-z0-9]{20,}/);
            if (keyMatch && !element.hasAttribute('data-original-text') && 
                !text.includes('http') && !text.includes('www') &&
                !text.includes('Registered:') && !text.includes('Last post:') && 
                !text.includes('Last visit:') && !text.includes('Posts:')) {
                element.setAttribute('data-original-text', element.textContent);
                element.innerHTML = element.innerHTML.replace(keyMatch[0], 
                    `<span class="privacy-censored" data-sensitive="true"></span>`);
            }
        });

        document.querySelectorAll('p').forEach(element => {
            if (element.textContent.includes('Invited by') && !element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
                const inviterLink = element.querySelector('a');
                if (inviterLink) {
                    inviterLink.textContent = '••••••••';
                    inviterLink.href = '#';
                }
            }
        });

        document.querySelectorAll('input[type="text"], input[type="password"]').forEach(element => {
            if (element.value && element.value.length > 15 && 
                !element.hasAttribute('data-original-value')) {
                element.setAttribute('data-original-value', element.value);
                element.value = '••••••••••••••••••••••••••••••••';
            }
        });
    }

    disablePrivacyMode() {

        document.querySelectorAll('input[data-original-value]').forEach(element => {
            element.value = element.getAttribute('data-original-value');
            element.removeAttribute('data-original-value');
        });

        document.querySelectorAll('[data-original-text]').forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
            element.removeAttribute('data-original-text');
        });

        document.querySelectorAll('.privacy-censored').forEach(element => {
            element.remove();
        });
    }

    setupAutoMentionCompletion() {
        const chatInput = document.querySelector('#shouttext');
        if (!chatInput) return;

        let suggestions = [];
        let selectedIndex = -1;
        let suggestionsContainer = null;

        this.collectUsersFromPage();

        const createSuggestionsContainer = () => {
            if (suggestionsContainer) return;

            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'mention-suggestions';
            document.body.appendChild(suggestionsContainer);
        };

        const positionSuggestions = () => {
            if (!suggestionsContainer) return;

            const rect = chatInput.getBoundingClientRect();
            suggestionsContainer.style.left = rect.left + 'px';
            suggestionsContainer.style.top = (rect.top - suggestionsContainer.offsetHeight - 5) + 'px';
            suggestionsContainer.style.width = rect.width + 'px';
        };

        const showSuggestions = (suggestionList) => {
            if (suggestionList.length === 0) {
                this.hideMentionSuggestions();
                return;
            }

            createSuggestionsContainer();

            suggestionsContainer.innerHTML = '';
            suggestionList.forEach((user, index) => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.className = 'mention-suggestion';
                suggestionDiv.innerHTML = `
                    <div class="username">${user.username}</div>
                    <div class="user-info">${user.source}</div>
                `;

                suggestionDiv.addEventListener('click', () => {
                    this.completeMention(chatInput, user.username);
                    this.hideMentionSuggestions();
                });

                suggestionsContainer.appendChild(suggestionDiv);
            });

            suggestionsContainer.style.display = 'block';
            positionSuggestions();
            this.highlightSuggestion(0);
        };

        chatInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const cursorPos = e.target.selectionStart;
            const textBeforeCursor = value.substring(0, cursorPos);
            const atIndex = textBeforeCursor.lastIndexOf('@');

            if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
                const query = textBeforeCursor.substring(atIndex + 1);
                if (query.length > 0) {
                    suggestions = this.getUserSuggestions(query);
                    selectedIndex = 0;
                    showSuggestions(suggestions);
                } else {
                    this.hideMentionSuggestions();
                }
            } else {
                this.hideMentionSuggestions();
            }
        });

        chatInput.addEventListener('keydown', (e) => {
            if (suggestions.length > 0 && suggestionsContainer && suggestionsContainer.style.display === 'block') {
                if (e.key === 'ArrowDown') {
                    selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                    this.highlightSuggestion(selectedIndex);
                    e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                    selectedIndex = Math.max(selectedIndex - 1, 0);
                    this.highlightSuggestion(selectedIndex);
                    e.preventDefault();
                } else if (e.key === 'Tab' || e.key === 'Enter') {
                    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                        this.completeMention(chatInput, suggestions[selectedIndex].username);
                        this.hideMentionSuggestions();
                        e.preventDefault();
                    }
                } else if (e.key === 'Escape') {
                    this.hideMentionSuggestions();
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!chatInput.contains(e.target) && (!suggestionsContainer || !suggestionsContainer.contains(e.target))) {
                this.hideMentionSuggestions();
            }
        });
    }

    collectUsersFromPage() {
        const users = new Set();

        document.querySelectorAll('a[href*="profile.php?id="]').forEach(link => {
            const username = link.textContent.trim();
            if (username && username.length > 0 && username !== 'PM') {
                users.add(username);
            }
        });

        let userCache = JSON.parse(GM_getValue('userCache', '[]'));
        users.forEach(user => {
            if (!userCache.some(cached => cached.username === user)) {
                userCache.push({
                    username: user,
                    lastSeen: Date.now(),
                    source: 'page'
                });
            }
        });

        userCache.sort((a, b) => b.lastSeen - a.lastSeen);
        userCache = userCache.slice(0, 200);

        GM_setValue('userCache', JSON.stringify(userCache));
    }

    getUserSuggestions(query) {
        const suggestions = [];
        const seenUsers = new Set();
        const queryLower = query.toLowerCase();

        document.querySelectorAll('#shout a[href*="profile.php"]').forEach(link => {
            const username = link.textContent.trim();
            if (username && username.toLowerCase().includes(queryLower) && !seenUsers.has(username)) {
                seenUsers.add(username);
                suggestions.push({
                    username: username,
                    source: '💬 In chat',
                    priority: 1
                });
            }
        });

        document.querySelectorAll('.postleft dt strong a, .postright h3 a').forEach(link => {
            const username = link.textContent.trim();
            if (username && username.toLowerCase().includes(queryLower) && !seenUsers.has(username)) {
                seenUsers.add(username);
                suggestions.push({
                    username: username,
                    source: '📝 In topic',
                    priority: 2
                });
            }
        });

        const userCache = JSON.parse(GM_getValue('userCache', '[]'));
        userCache.forEach(user => {
            if (user.username.toLowerCase().includes(queryLower) && !seenUsers.has(user.username)) {
                seenUsers.add(user.username);
                const timeAgo = Math.floor((Date.now() - user.lastSeen) / (1000 * 60 * 60 * 24));
                suggestions.push({
                    username: user.username,
                    source: timeAgo === 0 ? '👁️ Today' : `👁️ ${timeAgo}d ago`,
                    priority: 3
                });
            }
        });

        return suggestions
            .sort((a, b) => a.priority - b.priority)
            .slice(0, 5);
    }

    completeMention(inputElement, username) {
        const value = inputElement.value;
        const cursorPos = inputElement.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const textAfterCursor = value.substring(cursorPos);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1) {
            const beforeAt = value.substring(0, atIndex);
            const newValue = beforeAt + '@' + username + ' ' + textAfterCursor;
            inputElement.value = newValue;

            const newCursorPos = atIndex + username.length + 2;
            inputElement.setSelectionRange(newCursorPos, newCursorPos);
            inputElement.focus();
        }
    }

    highlightSuggestion(index) {
        const suggestions = document.querySelectorAll('.mention-suggestion');
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('selected', i === index);
        });
    }

    hideMentionSuggestions() {
        const suggestionsContainer = document.querySelector('.mention-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    setupResellerList() {
        if (!window.location.href.includes('payment.php') || document.querySelector('.reseller-section')) return;

        const extendGameSense = document.querySelector('.blockform');
        if (!extendGameSense) return;

        const resellerSection = document.createElement('div');
        resellerSection.className = 'blockform reseller-section';
        resellerSection.innerHTML = `
            <h2>
                <span>
                    <div style="display: flex; align-items: center; cursor: pointer;" class="section-header">
                        <i class="fa fa-magnet" style="margin-right: 8px; transition: transform 0.3s ease"></i>
                        Verified Resellers
                    </div>
                </span>
            </h2>
            <div class="box">
                <div class="fakeform">
                    <div class="inform">
                        <fieldset>
                            <legend>Alternative Payment Methods</legend>
                            <div class="fakeform">
                                <p>Below is a list of verified resellers. Please be careful and only deal with listed resellers to avoid scams.</p>
                                <table>
                                    <tr>
                                        <th class="tcl">Reseller</th>
                                        <th class="tcl">Payment Methods</th>
                                        <th class="tcl">Price</th>
                                        <th class="tcl">Action</th>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=985">Sigma</a></td>
                                        <td>Crypto, PayPal, CashApp</td>
                                        <td>24 USD</td>
                                        <td><a href="viewtopic.php?id=23385" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=2933">death1989</a></td>
                                        <td>花呗，微信，支付宝，QQ红包</td>
                                        <td>135 RMB</td>
                                        <td><a href="viewtopic.php?id=17427" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=3031">484481617</a></td>
                                        <td>支付宝/微信/QQ/QIWI/淘宝/PayPal</td>
                                        <td>135 RMB</td>
                                        <td><a href="viewtopic.php?id=17435" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=1699">tiagovski</a></td>
                                        <td>PayPal, Bank, Card, Crypto, PSC, Alipay, Pix</td>
                                        <td>21 EUR</td>
                                        <td><a href="viewtopic.php?id=25671" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=10043">Margele</a></td>
                                        <td>支付宝，微信</td>
                                        <td>148.88 CNY</td>
                                        <td><a href="viewtopic.php?id=45009" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=12434">Samo</a></td>
                                        <td>PayPal, Giropay, TF2, Crypto, Skrill</td>
                                        <td>21 EUR</td>
                                        <td><a href="viewtopic.php?id=43045" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=16166">Cahira</a></td>
                                        <td>QQ, PayPal, Card, WeChat, Alipay, Crypto</td>
                                        <td>160 CNY</td>
                                        <td><a href="viewtopic.php?id=45499" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=16243">pguest</a></td>
                                        <td>QQ, PayPal, Card, WeChat, Alipay</td>
                                        <td>?? RMB</td>
                                        <td><a href="viewtopic.php?id=45179" class="button">Purchase</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="profile.php?id=9060">VKVKF</a></td>
                                        <td>Cards RU/EU/KZ/UA/ASIA, All Crypto</td>
                                        <td>30 USD</td>
                                        <td><a href="viewtopic.php?id=27735" class="button">Purchase</a></td>
                                    </tr>
                                </table>
                                <p>⚠️ Always verify the reseller's profile and reputation before making any payments. Be aware of scammers impersonating verified resellers.</p>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        `;

        const firstBlockform = document.querySelector('.blockform');
        firstBlockform.parentNode.insertBefore(resellerSection, firstBlockform.nextSibling);

        this.addCollapseFunctionToSection(resellerSection);
    }

    addCollapseFunctionToSection(section) {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.box');
        const icon = header.querySelector('.fa-magnet');

        const isSectionCollapsed = GM_getValue(`section_${header.textContent.trim()}_collapsed`, false);
        if (isSectionCollapsed) {
            content.style.display = 'none';
            icon.style.transform = 'rotate(180deg)';
        }

        header.addEventListener('click', () => {
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? '' : 'none';
            icon.style.transform = isCollapsed ? '' : 'rotate(180deg)';
            GM_setValue(`section_${header.textContent.trim()}_collapsed`, !isCollapsed);
        });
    }

    addCollapsibleCategories() {
        const categories = document.querySelectorAll('.blocktable h2');

        categories.forEach(category => {
            if (category.querySelector('.fa-magnet')) return;

            const magnetIcon = document.createElement('i');
            magnetIcon.className = 'fa fa-magnet';
            magnetIcon.style.cssText = `
                margin-right: 8px;
                transition: transform 0.3s ease;
            `;

            const headerWrapper = document.createElement('div');
            headerWrapper.style.cssText = `
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
            `;

            const span = category.querySelector('span');
            if (!span) return;

            const content = span.cloneNode(true);

            headerWrapper.appendChild(magnetIcon);
            headerWrapper.appendChild(content);

            category.innerHTML = '';
            category.appendChild(headerWrapper);

            const categoryContent = category.closest('.blocktable');
            const contentBox = categoryContent.querySelector('.box');

            headerWrapper.addEventListener('click', () => {
                const isCollapsed = contentBox.style.display === 'none';
                contentBox.style.display = isCollapsed ? '' : 'none';
                magnetIcon.style.transform = isCollapsed ? '' : 'rotate(180deg)';

                const categoryText = content.textContent.trim();
                GM_setValue(`category_${categoryText}_collapsed`, !isCollapsed);
            });

            const savedState = GM_getValue(`category_${content.textContent.trim()}_collapsed`, false);
            if (savedState) {
                contentBox.style.display = 'none';
                magnetIcon.style.transform = 'rotate(180deg)';
            }
        });
    }

    setupPremiumUI() {
        if (!window.location.href.includes('profile.php') || 
            !window.location.href.includes('section=premium') || 
            document.querySelector('#gs-premium-ui')) return;

        const container = document.querySelector('.blockform .box');
        if (!container) return;

        const userId = window.location.href.match(/id=(\d+)/) ? 
                      window.location.href.match(/id=(\d+)/)[1] : 
                      document.querySelector('#brdwelcome .conl a[href*="profile.php"]')?.href.match(/id=(\d+)/)?.[1];

        if (!userId) return;

        const existingStatus = container.querySelector('.infldset p')?.textContent || 'No active subscription';

        container.id = 'gs-premium-ui';
        container.innerHTML = `
            <form id="profile8" method="post" action="profile.php?section=premium&id=${userId}">
                <input type="hidden" name="form_sent" value="1" />

                <div class="inform">
                    <fieldset>
                        <legend>Subscription Status</legend>
                        <div class="infldset">
                            <div class="status-text">
                                <i class="fa fa-clock-o"></i>
                                <span>${existingStatus}</span>
                            </div>
                            <div class="button-group">
                                <a href="payment.php?game=csgo" class="button">
                                    <i class="fa fa-refresh"></i>
                                    ${existingStatus.includes('No active') ? 'Purchase Subscription' : 'Extend Subscription'}
                                </a>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div class="inform">
                    <fieldset>
                        <legend>Game Clients</legend>
                        <div class="infldset">
                            <div class="button-group">
                                ${existingStatus.includes('No active') ? `
                                    <button type="button" disabled class="button">
                                        <i class="fa fa-download"></i>
                                        CS2 Client
                                    </button>
                                    <button type="button" disabled class="button">
                                        <i class="fa fa-download"></i>
                                        CS:GO Client
                                    </button>
                                ` : `
                                    <button type="submit" name="download_client" class="button">
                                        <i class="fa fa-download"></i>
                                        CS2 Client
                                    </button>
                                    <button type="submit" name="download_client_csgo" class="button">
                                        <i class="fa fa-download"></i>
                                        CS:GO Client
                                    </button>
                                `}
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div class="inform">
                    <fieldset>
                        <legend>Discord Management</legend>
                        <div class="infldset">
                            <div class="input-with-button">
                                <input id="discord_reset_reason" type="text" 
                                       name="discord_reset_reason" 
                                       placeholder="Enter reason for Discord ID reset" 
                                       maxlength="40" 
                                       ${existingStatus.includes('No active') ? 'disabled' : ''} />
                                <button type="submit" name="reset_discord" class="button" 
                                        ${existingStatus.includes('No active') ? 'disabled' : ''}>
                                    <i class="fa fa-refresh"></i>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div class="inform">
                    <fieldset>
                        <legend>Invite Codes</legend>
                        <div class="infldset">
                            <p>You have no unused invitation codes.</p>
                        </div>
                    </fieldset>
                </div>
            </form>
        `;

        const form = container.querySelector('form');
        form.querySelectorAll(':submit').forEach(button => {
            button.addEventListener('click', function(e) {
                const discordReason = document.getElementById('discord_reset_reason');

                if (this.name === 'reset_discord' && discordReason.value.trim() === '') {
                    discordReason.classList.add('contains-error');
                    e.preventDefault();
                    return;
                }

                this.disabled = true;
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = this.name;
                hiddenInput.value = this.value;
                form.appendChild(hiddenInput);
            });
        });
    }
}

new GSEnhancedUI();