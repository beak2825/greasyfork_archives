// ==UserScript==
// @name            GitHub Russian Localization
// @name:ru         Русская локализация GitHub
// @author          Deflecat
// @contributionURL https://boosty.to/rushanm
// @description     Localizes GitHub websites into Russian
// @description:ru  Локализует сайты GitHub на русский язык
// @grant           none
// @homepageURL     https://github.com/RushanM/GitHub-Russian-Localization
// @icon            https://github.githubassets.com/favicons/favicon.png
// @license         MIT
// @match           https://*.github.com/*
// @match           https://education.github.com/*
// @match           https://github.blog/*
// @match           https://github.com/*
// @run-at          document-end
// @namespace       githubrussianlocalization
// @supportURL      https://github.com/RushanM/GitHub-Russian-Localization/issues
// @version         P35
// @downloadURL https://update.greasyfork.org/scripts/515487/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/515487/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ссылка на локализационный файл формата FTL l10n/ru.ftl в репозитории
    const FTL_URL = 'https://raw.githubusercontent.com/RushanM/GitHub-Russian-Localization/master/l10n/ru.ftl';
    const LOG_PREFIX = '[GHRL10N]';
    
    /**
     * синтаксический анализатор FTL
     * считывает сообщения в формате «ключ = значение»
     */
    class SimpleFTLParser {
        constructor(ftlContent) {
            this.messages = new Map();
            this.parse(ftlContent);
        }

        parse(content) {
            const lines = content.split('\n');
            
            for (let line of lines) {
                line = line.trim();
                
                // пропуск комментариев и пустых строк
                if (!line || line.startsWith('#') || line.startsWith('##')) {
                    continue;
                }
                
                // считывание сообщений формата «ключ = значение»
                const match = line.match(/^([a-zA-Z0-9-_]+)\s*=\s*(.+)$/);
                if (match) {
                    const [, key, value] = match;
                    this.messages.set(key, value);
                }
            }
        }

        getMessage(key) {
            return this.messages.get(key) || null;
        }

        hasMessage(key) {
            return this.messages.has(key);
        }
    }

    /**
     * локализация Гитхаба
     */
    class GitHubLocalizer {
        constructor(ftlContent) {
            this.parser = new SimpleFTLParser(ftlContent);
            this.observer = null;
            this.protectedElements = new Map(); // элементы под защитой от изменений
            console.info(`${LOG_PREFIX} Localizer initialized with ${this.parser.messages.size} messages.`);
        }

        getTranslation(key, fallback = null) {
            const message = this.parser.getMessage(key);
            return message != null ? message : fallback;
        }

        /**
         * локализация элемента по его текстовому содержимому
         */
        localizeByText(element, originalText, messageKey) {
            if (!element || !element.textContent) return false;
            
            const currentText = element.textContent.trim();
            
            // получение локализации
            const translation = this.getTranslation(messageKey);
            if (!translation) return false;
            
            // если текст уже переведён, добавляем защиту и пропускаем
            if (currentText === translation) {
                this.protectElement(element, translation);
                return false;
            }
            
            // если текст не совпадает с оригиналом, пропускаем
            if (currentText !== originalText) return false;
            
            // переводим
            element.textContent = translation;
            element.setAttribute('data-ru-localized', 'true');
            
            // защищаем элемент от изменений
            this.protectElement(element, translation);
            return true;
        }

        /**
         * защита элемента от изменения текста обратно на английский
         */
        protectElement(element, translatedText) {
            // если элемент уже под защитой, пропускаем
            if (this.protectedElements.has(element)) return;

            // создание наблюдателя для этого элемента
            const protectionObserver = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        const currentText = element.textContent.trim();
                        // если текст изменился с перевода на что-то другое
                        if (currentText !== translatedText) {
                            // немедленно восстанавливаем перевод
                            element.textContent = translatedText;
                        }
                    }
                }
            });
            
            // наблюдение за изменениями текста и дочерних элементов
            protectionObserver.observe(element, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            // сохранение наблюдателя
            this.protectedElements.set(element, {
                observer: protectionObserver,
                translation: translatedText
            });
        }

        /**
         * локализация хлебной крошки Dashboard
         */
        localizeDashboard() {
            const dashboardElements = document.querySelectorAll('.AppHeader-context-item-label');
            dashboardElements.forEach(el => {
                this.localizeByText(el, 'Dashboard', 'dashboard');
            });
        }

        normalizeSearchPlaceholderText(translation) {
            if (typeof translation !== 'string') {
                return null;
            }

            if (!translation.includes('{{kbd}}')) {
                return translation.replace(/\s+/g, ' ').trim();
            }

            const normalized = translation.replace('{{kbd}}', '/');
            return normalized.replace(/\s+/g, ' ').trim();
        }

        renderSearchPlaceholder(target, translation) {
            if (!target || typeof translation !== 'string') {
                return;
            }

            if (!translation.includes('{{kbd}}')) {
                target.textContent = translation;
                return;
            }

            const [beforeKbd, afterKbd] = translation.split('{{kbd}}');
            const existingKbd = target.querySelector('kbd');
            const kbdElement = existingKbd ?? (() => {
                const newKbd = document.createElement('kbd');
                newKbd.className = 'AppHeader-search-kbd';
                newKbd.textContent = '/';
                return newKbd;
            })();

            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(beforeKbd ?? ''));
            fragment.appendChild(kbdElement);
            fragment.appendChild(document.createTextNode(typeof afterKbd === 'string' ? afterKbd : ''));

            target.replaceChildren(fragment);
        }

        resolveKbdElement(identifier, kbdMap) {
            if (!(kbdMap instanceof Map) || kbdMap.size === 0) {
                return null;
            }

            const normalized = (identifier ?? '').trim();
            if (!normalized) {
                const firstEntry = kbdMap.entries().next();
                if (!firstEntry.done) {
                    const [firstKey, element] = firstEntry.value;
                    kbdMap.delete(firstKey);
                    return element;
                }
                return null;
            }

            if (kbdMap.has(normalized)) {
                const element = kbdMap.get(normalized);
                kbdMap.delete(normalized);
                return element;
            }

            const lower = normalized.toLowerCase();
            for (const [key, element] of kbdMap.entries()) {
                if (key.trim().toLowerCase() === lower) {
                    kbdMap.delete(key);
                    return element;
                }
            }

            const fallback = kbdMap.entries().next();
            if (!fallback.done) {
                const [fallbackKey, element] = fallback.value;
                kbdMap.delete(fallbackKey);
                return element;
            }

            return null;
        }

        createFragmentFromKbdTranslation(translation, kbdElements) {
            if (typeof translation !== 'string') {
                return null;
            }

            const fragment = document.createDocumentFragment();
            const map = kbdElements instanceof Map
                ? new Map(kbdElements)
                : new Map(Array.isArray(kbdElements) ? kbdElements : []);
            const regex = /\[kbd\](.*?)\[\/kbd\]/g;
            let lastIndex = 0;
            let match;
            let hasPlaceholders = false;

            while ((match = regex.exec(translation)) !== null) {
                hasPlaceholders = true;
                const textPart = translation.slice(lastIndex, match.index);
                if (textPart) {
                    fragment.appendChild(document.createTextNode(textPart));
                }

                const placeholderContent = match[1] ?? '';
                const kbdElement = this.resolveKbdElement(placeholderContent, map);
                if (kbdElement) {
                    const displayText = placeholderContent.trim();
                    if (displayText) {
                        kbdElement.textContent = displayText;
                    }
                    fragment.appendChild(kbdElement);
                } else if (placeholderContent) {
                    fragment.appendChild(document.createTextNode(placeholderContent));
                }

                lastIndex = regex.lastIndex;
            }

            if (!hasPlaceholders) {
                fragment.appendChild(document.createTextNode(translation));
                return fragment;
            }

            const remainder = translation.slice(lastIndex);
            if (remainder) {
                fragment.appendChild(document.createTextNode(remainder));
            }

            return fragment;
        }

        replaceContentWithKbdTranslation(target, translationKey, kbdElements) {
            if (!target) {
                return false;
            }

            const translation = this.getTranslation(translationKey);
            if (!translation) {
                return false;
            }

            const fragment = this.createFragmentFromKbdTranslation(translation, kbdElements);
            if (!fragment) {
                return false;
            }

            target.replaceChildren(fragment);
            target.setAttribute('data-ru-localized', 'true');
            return true;
        }

        /**
         * локализация поисковой строки «Type / to search»
         */
        localizeSearchPlaceholder() {
            const searchInput = document.querySelector('#qb-input-query');
            if (!searchInput) return;
            
            const translation = this.getTranslation('type-slash-to-search');
            if (!translation) return;

            const normalizedTranslation = this.normalizeSearchPlaceholderText(translation);
            if (!normalizedTranslation) {
                return;
            }
            
            const currentText = searchInput.textContent.replace(/\s+/g, ' ').trim();
            const hasOriginalText = currentText.includes('Type') && currentText.includes('to search');

            if (searchInput.getAttribute('data-ru-localized') === 'true') {
                if (!currentText || currentText !== normalizedTranslation || (translation.includes('{{kbd}}') && !searchInput.querySelector('kbd'))) {
                    this.renderSearchPlaceholder(searchInput, translation);
                }
                this.protectSearchElement(searchInput, translation, normalizedTranslation);
                return;
            }

            if (!hasOriginalText) {
                return;
            }

            this.renderSearchPlaceholder(searchInput, translation);
            searchInput.setAttribute('data-ru-localized', 'true');
            this.protectSearchElement(searchInput, translation, normalizedTranslation);
        }

        /**
         * защита поискового элемента
         */
        protectSearchElement(element, translation, normalizedTranslation = null) {
            if (this.protectedElements.has(element)) return;

            const expectedText = normalizedTranslation ?? this.normalizeSearchPlaceholderText(translation) ?? '';

            const protectionObserver = new MutationObserver(() => {
                const currentText = element.textContent.replace(/\s+/g, ' ').trim();
                const hasOriginalText = currentText.includes('Type') && currentText.includes('to search');
                const hasKbd = Boolean(element.querySelector('kbd'));

                if (!hasOriginalText && currentText === expectedText && (!translation.includes('{{kbd}}') || hasKbd)) {
                    return;
                }

                this.renderSearchPlaceholder(element, translation);
                element.setAttribute('data-ru-localized', 'true');
            });
            
            protectionObserver.observe(element, {
                characterData: true,
                childList: true,
                subtree: true
            });
            
            this.protectedElements.set(element, {
                observer: protectionObserver,
                translation: translation
            });
        }

        /**
         * локализация всплывающих подсказок (tooltips)
         */
        localizeTooltips() {
            // «Command palette»
            const commandPaletteTooltips = document.querySelectorAll('tool-tip[for="AppHeader-commandPalette-button"]');
            commandPaletteTooltips.forEach(tooltip => {
                this.localizeByText(tooltip, 'Command palette', 'command-palette');
            });

            // «Chat with Copilot»
            const copilotTooltips = document.querySelectorAll('tool-tip[for="copilot-chat-header-button"]');
            copilotTooltips.forEach(tooltip => {
                this.localizeByText(tooltip, 'Chat with Copilot', 'chat-with-copilot');
            });
        }

        /**
         * метод для локализации элементов ActionListItem-label
         */
        localizeActionListItems() {
            const translationMap = new Map([
                ['Home', 'home'],
                ['Feed', 'feed'],
                ['Issues', 'issues'],
                ['Pull requests', 'pull-requests'],
                ['Projects', 'projects'],
                ['Discussions', 'discussions'],
                ['Codespaces', 'codespaces'],
                ['Copilot', 'copilot'],
                ['Explore', 'explore'],
                ['Marketplace', 'marketplace'],
                ['MCP registry', 'mcp-registry'],
                ['New issue', 'new-issue'],
                ['New repository', 'new-repository'],
                ['Import repository', 'import-repository'],
                ['New agent task', 'new-agent-task'],
                ['New codespace', 'new-codespace'],
                ['New gist', 'new-gist'],
                ['New organization', 'new-organization'],
                ['New project', 'new-project'],
                ['Profile', 'profile'],
                ['Repositories', 'repositories'],
                ['Stars', 'stars'],
                ['Gists', 'gists'],
                ['Organizations', 'organizations'],
                ['Enterprises', 'enterprises'],
                ['Sponsors', 'sponsors'],
                ['Settings', 'settings'],
                ['Copilot settings', 'copilot-settings'],
                ['Feature preview', 'feature-preview'],
                ['Appearance', 'appearance'],
                ['Accessibility', 'accessibility'],
                ['Try Enterprise', 'try-enterprise'],
                ['Sign out', 'sign-out'],
                ['Open', 'open'],
                ['Closed', 'closed'],
                ['Authored', 'authored'],
                ['Mentioned', 'mentioned'],
                ['Review requested', 'review-requested'],
                ['Reviewed', 'reviewed'],
                ['Assigned to me', 'assigned-to-me'],
                ['Involves me', 'involves-me'],
                ['Repositories…', 'copilot-repositories'],
                ['Files and folders…', 'files-and-folders'],
                ['Spaces…', 'spaces'],
                ['Upload from computer', 'upload-from-computer'],
                ['Extensions…', 'extensions'],
                ['New agent session', 'new-agent-session'],
                ['Basic Git commands', 'basic-git-commands'],
                ['Git branching', 'git-branching'],
                ['Advanced Git commands', 'advanced-git-commands']
            ]);

            const selectors = ['.ActionListItem-label', '.prc-ActionList-ItemLabel-TmBhn'];
            const items = document.querySelectorAll(selectors.join(', '));
            items.forEach(item => {
                const text = item.textContent.trim();
                if (!translationMap.has(text)) {
                    return;
                }

                const key = translationMap.get(text);
                this.localizeByText(item, text, key);
            });

            const headingTranslationMap = new Map([
                ['Agent sessions to include', 'agent-sessions-to-include'],
                ['Number of results', 'number-of-results'],
                ['Pull requests to include', 'pull-requests-to-include'],
                ['Issues to include', 'issues-to-include'],
                ['Models', 'models'],
                ['Fast and cost-efficient', 'fast-and-cost-efficient'],
                ['Versatile and highly intelligent', 'versatile-and-highly-intelligent'],
                ['Most powerful at complex tasks', 'most-powerful-at-complex']
            ]);

            const headingSelectors = ['.prc-ActionList-GroupHeading-eahp0', '.ModelPicker-module__menuHeading--PBTLv'];
            const headings = document.querySelectorAll(headingSelectors.join(', '));
            headings.forEach(heading => {
                const text = heading.textContent.trim();
                if (!headingTranslationMap.has(text)) {
                    return;
                }

                const key = headingTranslationMap.get(text);
                this.localizeByText(heading, text, key);
            });
        }

        /**
         * метод для локализации всплывающих подсказок (tooltips)
         */
        localizeAllTooltips() {
            const tooltipTranslations = [
                { selector: 'tool-tip[for="global-copilot-agent-button"]', text: 'Open agents panel', key: 'open-agents-panel' },
                { selector: 'tool-tip[for="global-create-menu-anchor"]', text: 'Create new…', key: 'create-new' },
                { selector: 'tool-tip#notification-indicator-tooltip', text: 'You have no unread notifications', key: 'you-have-no-notifications' }
            ];

            tooltipTranslations.forEach(({ selector, text, key }) => {
                const tooltips = document.querySelectorAll(selector);
                tooltips.forEach(tooltip => {
                    this.localizeByText(tooltip, text, key);
                });
            });

            // динамические подсказки с изменяемыми идентификаторами
            this.localizeDynamicTooltips();
        }

        /**
         * локализация подсказок с динамическими идентификаторами
         */
        localizeDynamicTooltips() {
            const dynamicTranslations = [
                { text: 'Your issues', key: 'your-issues' },
                { text: 'Your pull requests', key: 'your-pull-requests' },
                { text: 'Account switcher', key: 'account-switcher' },
                { text: 'Repositories', key: 'repositories' }
            ];

            const allTooltips = document.querySelectorAll('tool-tip, .prc-TooltipV2-Tooltip-cYMVY');
            allTooltips.forEach(tooltip => {
                const text = tooltip.textContent.trim();
                const translation = dynamicTranslations.find(t => t.text === text);
                if (translation) {
                    this.localizeByText(tooltip, translation.text, translation.key);
                }
            });
        }

        /**
         * локализация приветствия с учётом времени суток
         */
        localizeGreeting() {
            const greetingElements = document.querySelectorAll('.h2.prc-Heading-Heading-6CmGO');
            
            greetingElements.forEach(el => {
                const text = el.textContent.trim();
                
                // установки для разных приветствий
                const patterns = [
                    { regex: /^Good night,\s*(.+)!$/, key: 'good-night' },
                    { regex: /^Good morning,\s*(.+)!$/, key: 'good-morning' },
                    { regex: /^Good afternoon,\s*(.+)!$/, key: 'good-afternoon' },
                    { regex: /^Good evening,\s*(.+)!$/, key: 'good-evening' }
                ];

                const alreadyLocalized = patterns.some(pattern => {
                    const translation = this.getTranslation(pattern.key);
                    return translation ? text.startsWith(translation) : false;
                });

                if (alreadyLocalized) {
                    return;
                }

                for (const pattern of patterns) {
                    const match = text.match(pattern.regex);
                    if (match) {
                        const username = match[1];
                        const translation = this.getTranslation(pattern.key);
                        if (translation) {
                            el.textContent = `${translation}, ${username}!`;
                            el.setAttribute('data-ru-localized', 'true');
                            break;
                        }
                    }
                }
            });
        }

        /**
         * локализация элементов «GitHub Education»
         */
        localizeGitHubEducation() {
            // заголовок
            const taglines = document.querySelectorAll('.h4');
            taglines.forEach(el => {
                this.localizeByText(el, 'Learn. Collaborate. Grow.', 'learn-collaborate-grow');
            });

            // описание
            const descriptions = document.querySelectorAll('p.my-3.text-small');
            descriptions.forEach(el => {
                const text = el.textContent.trim().replace(/\s+/g, ' ');
                const translation = this.getTranslation('github-education-gives-here');
                if (!translation) return;

                if (text === translation) {
                    el.setAttribute('data-ru-localized', 'true');
                    return;
                }

                if (text.includes('GitHub Education gives you the tools')) {
                    el.textContent = translation;
                    el.setAttribute('data-ru-localized', 'true');
                }
            });

            // кнопка
            const buttons = document.querySelectorAll('.Button-label');
            buttons.forEach(button => {
                this.localizeByText(button, 'Go to GitHub Education', 'go-to-github-education');
            });
        }

        /**
         * локализация элементов Копайлота и части левой боковой панели
         */
        localizeCopilotChatAndLeftBarPart() {
            // textarea placeholder и aria-label
            const chatTextarea = document.querySelector('#copilot-chat-textarea');
            if (chatTextarea) {
                const translation = this.getTranslation('ask-anything');
                if (translation) {
                    const currentPlaceholder = chatTextarea.getAttribute('placeholder');
                    if (currentPlaceholder !== translation) {
                        chatTextarea.setAttribute('placeholder', translation);
                        chatTextarea.setAttribute('aria-label', translation);
                        chatTextarea.setAttribute('data-ru-localized', 'true');
                    }
                }
            }

            // «Top repositories»
            const topReposElements = document.querySelectorAll('div');
            topReposElements.forEach(el => {
                if (el.textContent.trim() === 'Top repositories') {
                    this.localizeByText(el, 'Top repositories', 'top-repositories');
                }
            });

            // поле ввода «Search for repositories»
            const repoSearchInputs = document.querySelectorAll('input[aria-label="Search for repositories"], input[placeholder="Search for repositories"]');
            if (repoSearchInputs.length) {
                const placeholderTranslation = this.getTranslation('search-for-repositories');
                if (placeholderTranslation) {
                    repoSearchInputs.forEach(input => {
                        if (input.getAttribute('placeholder') !== placeholderTranslation) {
                            input.setAttribute('placeholder', placeholderTranslation);
                        }
                        if (input.getAttribute('aria-label') !== placeholderTranslation) {
                            input.setAttribute('aria-label', placeholderTranslation);
                        }
                        input.setAttribute('data-ru-localized', 'true');
                    });
                }
            }

            // «Add repositories, files, and spaces»
            const attachmentButtons = document.querySelectorAll('.ChatInput-module__attachmentButtonText--fVuEs');
            attachmentButtons.forEach(button => {
                this.localizeByText(button, 'Add repositories, files, and spaces', 'add-repositories-files-spaces');
            });
        }

        /**
         * локализация меток и статусов
         */
        localizeLabelsStatusesAndLinks() {
            // метка о предварительной версии
            const previewLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="success"]');
            previewLabels.forEach(label => {
                this.localizeByText(label, 'Preview', 'preview');
            });

            const modelPreviewLabels = document.querySelectorAll('.ModelPicker-module__modelMetaLabel--zMick');
            modelPreviewLabels.forEach(label => {
                this.localizeByText(label, 'Preview', 'preview');
            });

            // метка New («Новинка»)
            const newLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="accent"]');
            newLabels.forEach(label => {
                this.localizeByText(label, 'New', 'new');
            });

            // метка Free («Бесплатно»)
            const freeLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="primary"]');
            freeLabels.forEach(label => {
                this.localizeByText(label, 'Free', 'free');
            });

            // ссылка обратной связи
            const feedbackLinks = document.querySelectorAll('a.CopilotHeaderBase-module__feedbackLink--fnf2R');
            feedbackLinks.forEach(link => {
                this.localizeByText(link, 'Feedback', 'feedback');
            });

            const linkButtons = document.querySelectorAll('button.prc-Link-Link-85e08');
            linkButtons.forEach(button => {
                this.localizeByText(button, 'Give feedback', 'give-feedback');
                this.localizeByText(button, 'Switch back', 'switch-back');
            });

            const autoButtons = document.querySelectorAll('.ModelPicker-module__buttonName--Iid1H');
            autoButtons.forEach(button => {
                this.localizeByText(button, 'Auto', 'auto');
            });

            // уведомление о лимите премиум-запросов
            const footerElements = document.querySelectorAll('.ModelPicker-module__footer--yCNLJ');
            footerElements.forEach(footer => {
                if (footer.hasAttribute('data-ru-localized')) return;
                
                const text = footer.textContent.trim();
                if (text.includes('You have used 80%') && text.includes('premium requests')) {
                    const translation = this.getTranslation('you-have-used-eighty');
                    if (!translation) return;
                    
                    const link = footer.querySelector('a');
                    if (!link) return;
                    
                    const parts = translation.split(/\[link\]|\[\/link\]/);
                    if (parts.length >= 3) {
                        const prefix = parts[0] ?? '';
                        const linkText = parts[1] ?? '';
                        const suffix = parts.slice(2).join('');
                        
                        const fragment = document.createDocumentFragment();
                        if (prefix) fragment.appendChild(document.createTextNode(prefix));
                        link.textContent = linkText;
                        fragment.appendChild(link);
                        if (suffix) fragment.appendChild(document.createTextNode(suffix));
                        
                        footer.replaceChildren(fragment);
                        footer.setAttribute('data-ru-localized', 'true');
                    }
                }
            });
        }

        /**
         * локализация элементов CommandPill (команды)
         */
        localizeCommandPills() {
            const commandTranslations = [
                { text: 'Task', key: 'task' },
                { text: 'Create issue', key: 'create-issue' },
                { text: 'Spark', key: 'spark' }
            ];

            const commandPills = document.querySelectorAll('.CommandPill-module__text--ggGhT');
            commandPills.forEach(pill => {
                commandTranslations.forEach(({ text, key }) => {
                    this.localizeByText(pill, text, key);
                });
            });
        }

        /**
         * локализация заголовков и элементов панели управления
         */
        localizeDashboardElements() {
            // «Latest from our changelog»
            const changelogTitles = document.querySelectorAll('.dashboard-changelog__title');
            changelogTitles.forEach(title => {
                this.localizeByText(title, 'Latest from our changelog', 'latest-from-our-changelog');
            });

            // «Agent sessions», «Pull requests», «Issues»
            const stackLabels = document.querySelectorAll('.prc-Stack-Stack-WJVsK[data-gap="condensed"]');
            stackLabels.forEach(label => {
                const text = label.textContent.trim();
                if (text === 'Agent sessions') {
                    this.localizeByText(label, 'Agent sessions', 'agent-sessions');
                } else if (text === 'Pull requests') {
                    this.localizeByText(label, 'Pull requests', 'pull-requests');
                } else if (text === 'Issues') {
                    this.localizeByText(label, 'Issues', 'issues');
                }
            });

            // «View all»
            const viewAllLinks = document.querySelectorAll('a.prc-Link-Link-85e08');
            viewAllLinks.forEach(link => {
                this.localizeByText(link, 'View all', 'view-all');
            });
            
            // «Show more»
            const showMoreSpans = document.querySelectorAll('span.color-fg-muted.f6');
            showMoreSpans.forEach(span => {
                this.localizeByText(span, 'Show more', 'show-more');
            });
            
            // «View changelog →»
            const changelogLinks = document.querySelectorAll('a.text-small.mt-2.Link--muted[href*="changelog"]');
            changelogLinks.forEach(link => {
                this.localizeByText(link, 'View changelog →', 'view-changelog');
            });

            // кнопка «Pull requests»
            const starterTitles = document.querySelectorAll('.StarterPill-module__title--Nsp36');
            starterTitles.forEach(title => {
                this.localizeByText(title, 'Pull requests', 'pull-requests');
            });
        }

        /**
         * локализация подсказок панели управления и прочих динамических вариаций
         */
        localizeDashboardTooltips() {
            const tooltipTranslations = [
                { text: 'Agent sessions options', key: 'agent-sessions-options' },
                { text: 'Pull request options', key: 'pull-request-options' },
                { text: 'Issue options', key: 'issue-options' },
                { text: 'Search for repositories', key: 'search-for-repositories' },
                { text: 'Open in Copilot Chat', key: 'open-in-copilot-chat' },
                { text: 'Assign to Copilot', key: 'assign-to-copilot' },
                { text: 'Send now', key: 'send-now' },
                { text: 'Close menu', key: 'close-menu' },
                { text: 'Select a custom agent', key: 'select-custom-agent' },
                { text: 'Start task', key: 'start-task' }
            ];

            const tooltips = document.querySelectorAll('.prc-TooltipV2-Tooltip-cYMVY');
            tooltips.forEach(tooltip => {
                // проверяем, не был ли элемент уже локализован
                if (tooltip.hasAttribute('data-ru-localized')) return;
                
                // пытаемся найти span с id (для сложных tooltips типа «Send now»)
                const firstSpan = tooltip.querySelector('span[id]');
                
                let visibleText;
                let targetElement;
                
                if (firstSpan) {
                    // сложная структура: извлекаем текст без скрытых элементов
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = firstSpan.innerHTML;
                    tempDiv.querySelectorAll('.prc-src-InternalVisuallyHidden-nlR9R').forEach(el => el.remove());
                    visibleText = tempDiv.textContent.trim();
                    targetElement = firstSpan;
                } else {
                    // простая структура: используем весь текст tooltip
                    visibleText = tooltip.textContent.trim();
                    targetElement = tooltip;
                }
                
                const translation = tooltipTranslations.find(t => t.text === visibleText);
                if (translation) {
                    const ftlTranslation = this.getTranslation(translation.key);
                    if (ftlTranslation) {
                        if (firstSpan) {
                            // для сложных подсказок: заменяем текст в span, сохраняя скрытые элементы
                            const hiddenSpan = firstSpan.querySelector('.prc-src-InternalVisuallyHidden-nlR9R');
                            firstSpan.textContent = ftlTranslation;
                            if (hiddenSpan) {
                                firstSpan.appendChild(hiddenSpan);
                            }
                        } else {
                            // для простых подсказок: используем localizeByText
                            this.localizeByText(targetElement, visibleText, translation.key);
                        }
                        tooltip.setAttribute('data-ru-localized', 'true');
                    }
                }
            });
        }

        /**
         * локализация элементов поиска («Search syntax tips», «Give feedback»)
         */
        localizeSearchElements() {
            // «Search syntax tips»
            const syntaxLinks = document.querySelectorAll('a.Link.color-fg-accent.text-normal[href*="understanding-github-code-search-syntax"]');
            syntaxLinks.forEach(link => {
                this.localizeByText(link, 'Search syntax tips', 'search-syntax-tips');
            });

            // «Give feedback»
            const feedbackButtons = document.querySelectorAll('button.Button--link .Button-label');
            feedbackButtons.forEach(label => {
                this.localizeByText(label, 'Give feedback', 'give-feedback');
            });
        }

        /**
         * локализация элементов в поиске и меню
         */
        localizeCopilotSearchElements() {
            // заголовки разделов
            const sectionTranslations = new Map([
                ['Copilot', 'copilot'],
                ['Owners', 'owners'],
                ['Repositories', 'repositories'],
                ['Agents', 'agents']
            ]);

            const sectionTitles = document.querySelectorAll('.ActionList-sectionDivider-title');
            sectionTitles.forEach(title => {
                const text = title.textContent.trim();
                const translationKey = sectionTranslations.get(text);
                if (translationKey) {
                    this.localizeByText(title, text, translationKey);
                }
            });

            // «Chat with Copilot»
            const copilotLabels = document.querySelectorAll('.ActionListItem-label');
            copilotLabels.forEach(label => {
                this.localizeByText(label, 'Chat with Copilot', 'chat-with-copilot');
            });

            // «Start a new Copilot thread»
            const copilotDescriptions = document.querySelectorAll('.ActionListItem-description.QueryBuilder-ListItem-trailing');
            copilotDescriptions.forEach(desc => {
                this.localizeByText(desc, 'Start a new Copilot thread', 'start-copilot-thread');
            });

            // «Jump to»
            const jumpToDescriptions = document.querySelectorAll('.ActionListItem-description.QueryBuilder-ListItem-trailing');
            jumpToDescriptions.forEach(desc => {
                this.localizeByText(desc, 'Jump to', 'jump-to');
            });
        }

        /**
         * локализация подсказок с шаблоном «Branch: <name>»
         */
        localizeBranchTooltips() {
            const tooltips = document.querySelectorAll('.prc-TooltipV2-Tooltip-cYMVY');
            tooltips.forEach(tooltip => {
                const text = tooltip.textContent.trim();
                const branchMatch = text.match(/^Branch:\s+(.+)$/);
                if (branchMatch) {
                    const branchName = branchMatch[1];
                    const translation = this.getTranslation('branch');
                    if (translation) {
                        tooltip.textContent = `${translation}: ${branchName}`;
                        console.log(`${LOG_PREFIX} Translated: "Branch: ${branchName}" → "${translation}: ${branchName}"`);
                    }
                }
            });
        }

        /**
         * локализация заголовка «Agents» в панели
         */
        localizeAgentsHeader() {
            const headers = document.querySelectorAll('.GlobalCopilotOverlay-module__header--mBq7d h2.f5');
            headers.forEach(h2 => {
                this.localizeByText(h2, 'Agents', 'agents');
            });
        }

        /**
         * локализация палитры команд (Command Palette)
         */
        localizeCommandPalette() {
            // «Search or jump to...» в placeholder и input
            const searchInputs = document.querySelectorAll('input.typeahead-input[placeholder="Search or jump to..."]');
            searchInputs.forEach(input => {
                const translation = this.getTranslation('search-or-jump');
                if (translation) {
                    input.setAttribute('placeholder', translation);
                    console.log(`${LOG_PREFIX} Translated placeholder: "Search or jump to..." → "${translation}"`);
                }
            });

            // также проверяем placeholder атрибуты в command-palette-mode
            const paletteInputs = document.querySelectorAll('command-palette-input[placeholder="Search or jump to..."]');
            paletteInputs.forEach(input => {
                const translation = this.getTranslation('search-or-jump');
                if (translation) {
                    input.setAttribute('placeholder', translation);
                    console.log(`${LOG_PREFIX} Translated command palette placeholder: "Search or jump to..." → "${translation}"`);
                }
            });

            // placeholder в command-palette-mode элементах
            const paletteModes = document.querySelectorAll('command-palette-mode[data-placeholder="Search or jump to..."]');
            paletteModes.forEach(mode => {
                const translation = this.getTranslation('search-or-jump');
                if (translation) {
                    mode.setAttribute('data-placeholder', translation);
                    console.log(`${LOG_PREFIX} Translated data-placeholder: "Search or jump to..." → "${translation}"`);
                }
            });

            // «Tip:»
            const tipLabels = document.querySelectorAll('span.text-bold');
            tipLabels.forEach(label => {
                this.localizeByText(label, 'Tip:', 'tip');
            });

            const hintConfigs = [
                {
                    tokens: ['Type', '@', 'to search people and organizations'],
                    translationKey: 'type-at-to-search',
                    identifier: '@',
                    logMessage: 'Type @ to search people...'
                },
                {
                    tokens: ['Type', '?', 'for help and tips'],
                    translationKey: 'type-question-for-help',
                    identifier: '?',
                    logMessage: 'Type ? for help...'
                },
                {
                    tokens: ['Type', '#', 'to search issues'],
                    translationKey: 'type-hash-to-issues',
                    identifier: '#',
                    logMessage: 'Type # to search issues'
                },
                {
                    tokens: ['Type', '>', 'to activate command mode'],
                    translationKey: 'type-gt-to-command',
                    identifier: '>',
                    logMessage: 'Type > to activate command mode'
                },
                {
                    tokens: ['Type', '#', 'to search pull requests'],
                    translationKey: 'type-hash-to-prs',
                    identifier: '#',
                    logMessage: 'Type # to search pull requests'
                }
            ];

            const localizeHintElement = (element, options = {}) => {
                if (!element || element.getAttribute('data-ru-localized') === 'true') {
                    return null;
                }

                const text = element.textContent;
                if (!text) {
                    return null;
                }

                for (const config of hintConfigs) {
                    if (!config.tokens.every(token => text.includes(token))) {
                        continue;
                    }

                    const kbdElement = element.querySelector('kbd.hx_kbd');
                    if (!kbdElement || kbdElement.textContent.trim() !== config.identifier) {
                        continue;
                    }

                    if (options.leadingNodes && options.leadingNodes.length > 0) {
                        const translation = this.getTranslation(config.translationKey);
                        if (!translation) {
                            continue;
                        }

                        const fragment = this.createFragmentFromKbdTranslation(
                            translation,
                            new Map([[config.identifier, kbdElement]])
                        );
                        if (!fragment) {
                            continue;
                        }

                        const nodes = [...options.leadingNodes];
                        if (options.insertSpaceAfterLeading !== false) {
                            nodes.push(document.createTextNode(options.spaceText ?? ' '));
                        }
                        nodes.push(fragment);

                        element.replaceChildren(...nodes);
                        element.setAttribute('data-ru-localized', 'true');
                    } else {
                        const replaced = this.replaceContentWithKbdTranslation(
                            element,
                            config.translationKey,
                            new Map([[config.identifier, kbdElement]])
                        );
                        if (!replaced) {
                            continue;
                        }
                    }

                    return config.logMessage;
                }

                return null;
            };

            const helpHintDivs = document.querySelectorAll('command-palette-help div');
            helpHintDivs.forEach(div => {
                const message = localizeHintElement(div);
                if (message) {
                    console.log(`${LOG_PREFIX} Translated: "${message}"`);
                }
            });

            // подсказки в элементах command-palette-tip
            const paletteTips = document.querySelectorAll('command-palette-tip');
            paletteTips.forEach(tip => {
                // обработка структуры: два div внутри гибкого контейнера
                const flexContainer = tip.querySelector('.d-flex.flex-items-start.flex-justify-between');
                if (!flexContainer) return;

                const leftDiv = flexContainer.children[0]; // левая часть
                const rightDiv = flexContainer.children[1]; // правая часть «Type ? for help»

                if (rightDiv) {
                    const message = localizeHintElement(rightDiv);
                    if (message) {
                        console.log(`${LOG_PREFIX} Translated trailing part: "${message}"`);
                    }
                }

                // Локализация левой части
                if (!leftDiv) return;
                const text = leftDiv.textContent;
                const boldSpan = leftDiv.querySelector('span.text-bold');

                // «Go to your accessibility settings to change your keyboard shortcuts»
                if (text && text.includes('Go to your accessibility settings')) {
                    const translation = this.getTranslation('go-to-accessibility-settings');
                    if (translation && boldSpan) {
                        leftDiv.innerHTML = '';
                        leftDiv.appendChild(boldSpan);
                        leftDiv.appendChild(document.createTextNode(' ' + translation));
                        console.log(`${LOG_PREFIX} Translated: "Go to your accessibility settings..."`);
                    }
                }
                else {
                    const options = boldSpan ? { leadingNodes: [boldSpan] } : undefined;
                    const message = localizeHintElement(leftDiv, options);
                    if (message) {
                        console.log(`${LOG_PREFIX} Translated: "${message}"`);
                    }
                }
            });

            // заголовки групп: Pages, Repositories, Users
            const groupHeaders = document.querySelectorAll('[data-target="command-palette-item-group.header"]');
            groupHeaders.forEach(header => {
                const text = header.textContent.trim();
                if (text === 'Pages') {
                    this.localizeByText(header, 'Pages', 'pages');
                } else if (text === 'Repositories') {
                    this.localizeByText(header, 'Repositories', 'repositories');
                } else if (text === 'Users') {
                    this.localizeByText(header, 'Users', 'users');
                }
            });

            // заголовки элементов палитры команд
            const itemTitles = document.querySelectorAll('[data-target="command-palette-item.titleElement"]');
            itemTitles.forEach(title => {
                const text = title.textContent.trim();
                if (text === 'Copilot') {
                    this.localizeByText(title, 'Copilot', 'copilot');
                } else if (text === 'Dashboard') {
                    this.localizeByText(title, 'Dashboard', 'dashboard');
                } else if (text === 'Notifications') {
                    this.localizeByText(title, 'Notifications', 'notifications');
                } else if (text === 'Issues') {
                    this.localizeByText(title, 'Issues', 'issues');
                } else if (text === 'Pull requests') {
                    this.localizeByText(title, 'Pull requests', 'pull-requests');
                }
            });

            // «Jump to»
            const hintTexts = document.querySelectorAll('[data-target="command-palette-item.hintText"]');
            hintTexts.forEach(hint => {
                const text = hint.textContent.trim();
                if (text === 'Jump to') {
                    this.localizeByText(hint, 'Jump to', 'jump-to');
                }
            });

            // «Enter to jump to Tab to search» с сохранением элементов kbd
            const enterTabHints = document.querySelectorAll('[data-target="command-palette-item.hintText"]');
            enterTabHints.forEach(hint => {
                const text = hint.textContent;
                if (text && text.includes('Enter') && text.includes('to jump to') && text.includes('Tab') && text.includes('to search')) {
                    // ищем div внутри hint
                    const innerDiv = hint.querySelector('.hide-sm');
                    if (innerDiv) {
                        const kbds = innerDiv.querySelectorAll('kbd.hx_kbd');
                        if (kbds.length >= 2) {
                            const enterKbd = kbds[0];
                            const tabKbd = kbds[1];

                            const translation = this.getTranslation('enter-to-jump-tab-to-search');
                            if (translation) {
                                const enterClone = enterKbd.cloneNode(true);
                                const tabClone = tabKbd.cloneNode(true);
                                const fragment = this.createFragmentFromKbdTranslation(
                                    translation,
                                    new Map([
                                        [enterClone.textContent.trim(), enterClone],
                                        [tabClone.textContent.trim(), tabClone]
                                    ])
                                );

                                if (fragment) {
                                    innerDiv.replaceChildren(fragment);
                                    innerDiv.setAttribute('data-ru-localized', 'true');
                                    console.log(`${LOG_PREFIX} Translated: "Enter to jump to Tab to search" with preserved kbd`);
                                }
                            }
                        }
                    }
                }
            });
        }

        /**
         * локализация агентской панели
         */
        localizeCopilotTaskScreen() {
            // «Start a new task with Copilot»
            const taskHeadings = document.querySelectorAll('.GlobalCopilotOverlay-module__messageStateHeading--F5_1N');
            const taskErrorVariants = [
                'Tasks couldn\'t be loaded',
                'Tasks couldn’t be loaded'
            ];

            taskHeadings.forEach(heading => {
                this.localizeByText(heading, 'Start a new task with Copilot', 'start-new-task-copilot');
                taskErrorVariants.some(variant => this.localizeByText(heading, variant, 'tasks-couldnt-be-loaded'));
            });

            // описание
            const taskDescriptions = document.querySelectorAll('.GlobalCopilotOverlay-module__messageStateDescription--IWyBI');
            taskDescriptions.forEach(desc => {
                this.localizeByText(desc, 'Describe your task in natural language. Copilot will work in the background and open a pull request for your review.', 'copilot-task-description');
                this.localizeByText(desc, 'Try again or, if the problem persists, contact support.', 'try-again-or');
            });

            // ссылка «Learn more about Copilot coding agent»
            const learnMoreLinks = document.querySelectorAll('.GlobalCopilotOverlay-module__messageState--ORDxQ a.prc-Link-Link-85e08');
            learnMoreLinks.forEach(link => {
                this.localizeByText(link, 'Learn more about Copilot coding agent', 'learn-more-copilot-agent');
                this.localizeByText(link, 'GitHub status', 'github-status');
            });

            // уведомление «Copilot uses AI. Check for mistakes.» с сохранением ссылки
            const disclosureParagraphs = document.querySelectorAll('.GlobalCopilotOverlay-module__copilotDisclosureText--hPU0b');
            const disclosureTranslation = this.getTranslation('copilot-uses-ai');

            if (disclosureTranslation) {
                const disclosureParts = disclosureTranslation.split(/\[link\]|\[\/link\]/);
                const normalizedDisclosure = disclosureParts.join('').replace(/\s+/g, ' ').trim();
                const englishDisclosure = 'Copilot uses AI. Check for mistakes.'.replace(/\s+/g, ' ').trim();

                disclosureParagraphs.forEach(paragraph => {
                    const link = paragraph.querySelector('a');
                    if (!link) {
                        return;
                    }

                    const currentText = paragraph.textContent.replace(/\s+/g, ' ').trim();
                    if (currentText === normalizedDisclosure) {
                        if (paragraph.getAttribute('data-ru-localized') !== 'true') {
                            paragraph.setAttribute('data-ru-localized', 'true');
                        }
                        return;
                    }

                    if (currentText !== englishDisclosure && paragraph.getAttribute('data-ru-localized') === 'true') {
                        return;
                    }

                    if (disclosureParts.length < 3) {
                        return;
                    }

                    const prefix = disclosureParts[0] ?? '';
                    const linkText = disclosureParts[1] ?? '';
                    const suffix = disclosureParts.slice(2).join('');

                    const fragment = document.createDocumentFragment();
                    if (prefix) {
                        fragment.appendChild(document.createTextNode(prefix));
                    }
                    link.textContent = linkText;
                    fragment.appendChild(link);
                    if (suffix) {
                        fragment.appendChild(document.createTextNode(suffix));
                    }

                    paragraph.replaceChildren(fragment);
                    paragraph.setAttribute('data-ru-localized', 'true');
                });
            }
        }

        /**
         * локализация сообщения об отсутствии сессий
         */
        localizeNoResultsMessages() {
            const noSessionsTranslation = this.getTranslation('no-sessions-found');
            const noSessionsParts = noSessionsTranslation ? noSessionsTranslation.split(/\[link\]|\[\/link\]/) : [];
            const noSessionsPrefix = noSessionsParts[0] ?? '';
            const noSessionsLinkText = noSessionsParts[1] ?? '';
            const noSessionsSuffix = noSessionsParts.slice(2).join('');
            const expectedTextNormalized = (noSessionsPrefix + noSessionsLinkText + noSessionsSuffix).replace(/\s+/g, ' ').trim();
            const expectedLinkTextNormalized = noSessionsLinkText.replace(/\s+/g, ' ').trim();
            const englishNormalized = 'No sessions found. Try a different filter, or start a session.'.replace(/\s+/g, ' ').trim();
            const englishLinkTextCandidates = [
                'start a session',
                'start a session.'
            ].map(text => text.replace(/\s+/g, ' ').trim());
            const unableToLoadTranslation = this.getTranslation('unable-to-load-agent');
            const unableEnglish = 'Unable to load agent tasks, try again later.'.replace(/\s+/g, ' ').trim();

            const titles = document.querySelectorAll('.Title-module__title--YTYH_');
            titles.forEach(title => {
                const link = title.querySelector('a');
                const currentTextNormalized = title.textContent.replace(/\s+/g, ' ').trim();

                if (!link) {
                    if (!unableToLoadTranslation) {
                        return;
                    }

                    const isAlreadyLocalized = currentTextNormalized === unableToLoadTranslation;
                    if (isAlreadyLocalized) {
                        if (title.getAttribute('data-ru-localized') !== 'true') {
                            title.setAttribute('data-ru-localized', 'true');
                        }
                        return;
                    }

                    const matchesEnglish = currentTextNormalized === unableEnglish;
                    if (!matchesEnglish) {
                        return;
                    }

                    title.textContent = unableToLoadTranslation;
                    title.setAttribute('data-ru-localized', 'true');
                    return;
                }

                if (!noSessionsTranslation || noSessionsParts.length < 3) {
                    return;
                }

                const currentLinkTextNormalized = link.textContent.replace(/\s+/g, ' ').trim();

                const alreadyLocalized = currentTextNormalized === expectedTextNormalized && currentLinkTextNormalized === expectedLinkTextNormalized;
                if (alreadyLocalized) {
                    if (title.getAttribute('data-ru-localized') !== 'true') {
                        title.setAttribute('data-ru-localized', 'true');
                    }
                    return;
                }

                const matchesEnglish = currentTextNormalized === englishNormalized
                    && englishLinkTextCandidates.includes(currentLinkTextNormalized);
                if (!matchesEnglish) {
                    return;
                }

                const fragment = document.createDocumentFragment();
                fragment.appendChild(document.createTextNode(noSessionsPrefix));
                link.textContent = noSessionsLinkText;
                fragment.appendChild(link);
                fragment.appendChild(document.createTextNode(noSessionsSuffix));

                title.replaceChildren(fragment);
                title.setAttribute('data-ru-localized', 'true');
            });
        }

        /**
         * перевод абсолютного времени в title (всплывающая подсказка)
         */
        translateAbsoluteTime(text) {
            if (typeof text !== 'string' || !text.trim()) {
                return text;
            }

            // формат: «Nov 5, 2025, 11:25 PM GMT+3»
            const regex = /^([A-Z][a-z]{2,8})\s+(\d{1,2}),\s+(\d{4}),\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s+GMT([+-]\d+)$/;
            const match = text.match(regex);
            
            if (match) {
                const [, month, day, year, hours, minutes, ampm, gmt] = match;
                const monthKey = month.length <= 3 ? `month-short-${month.toLowerCase()}` : `month-long-${month.toLowerCase()}`;
                const translatedMonth = this.getTranslation(monthKey, month);
                
                if (translatedMonth) {
                    // конвертация AM/PM в 24-часовой формат
                    let hour = parseInt(hours);
                    if (ampm === 'PM' && hour !== 12) hour += 12;
                    if (ampm === 'AM' && hour === 12) hour = 0;
                    
                    // формат: «5 нояб. 2025, 23:25 по МСК»
                    const timezone = gmt === '+3'
                        ? this.getTranslation('timezone-msk', 'GMT+3')
                        : `GMT${gmt}`;
                    const normalizedHour = String(hour).padStart(2, '0');
                    return `${day} ${translatedMonth} ${year}, ${normalizedHour}:${minutes} ${timezone}`;
                }
            }
            
            return text;
        }

        /**
         * локализация относительного времени
         */
        localizeRelativeTime() {
            const relativeTimes = document.querySelectorAll('relative-time');

            if (!relativeTimes.length) {
                return;
            }

            relativeTimes.forEach(timeElement => {
                const needsLangUpdate = timeElement.getAttribute('lang') !== 'ru';
                const prefixAttr = timeElement.getAttribute('prefix');
                const prefixPropValue = typeof timeElement.prefix === 'string' ? timeElement.prefix : null;
                const hasEnglishPrefixAttr = typeof prefixAttr === 'string' && prefixAttr.trim().toLowerCase() === 'on';
                const hasEnglishPrefixProp = typeof prefixPropValue === 'string' && prefixPropValue.trim().toLowerCase() === 'on';
                const wasTranslated = timeElement.getAttribute('data-ru-translated') === 'true';

                // переводим всплывающую подсказку через FTL
                if (timeElement.hasAttribute('title')) {
                    const originalTitle = timeElement.getAttribute('title');
                    const translatedTitle = this.translateAbsoluteTime(originalTitle);
                    if (translatedTitle !== originalTitle) {
                        timeElement.setAttribute('title', translatedTitle);
                    }
                }

                if (!needsLangUpdate && !hasEnglishPrefixAttr && !hasEnglishPrefixProp && wasTranslated) {
                    this.cleanRelativeTimeShadow(timeElement);
                    return;
                }

                if (needsLangUpdate) {
                    try {
                        timeElement.setAttribute('lang', 'ru');
                        if (typeof timeElement.update === 'function') {
                            timeElement.update();
                        }
                    } catch (error) {
                        console.warn(`${LOG_PREFIX} Unable to apply lang="ru" to relative-time:`, error);
                    }
                }

                if (hasEnglishPrefixAttr || hasEnglishPrefixProp) {
                    // удаляем префикс «on», чтобы не было «on 17 окт.» после перевода
                    timeElement.removeAttribute('prefix');
                    if (typeof timeElement.prefix === 'string') {
                        try {
                            timeElement.prefix = '';
                        } catch (error) {
                            console.warn(`${LOG_PREFIX} Unable to clear prefix property on relative-time:`, error);
                        }
                    }
                    if (typeof timeElement.update === 'function') {
                        timeElement.update();
                    }
                }

                this.cleanRelativeTimeShadow(timeElement);
                timeElement.setAttribute('data-ru-translated', 'true');
            });

            // локализация текстов «Created on», «Opened by», Updated в описаниях элементов
            const numberSignTranslation = this.getTranslation('number-sign');
            const descriptions = document.querySelectorAll('.Description-module__container--Ks2Eo');
            descriptions.forEach(desc => {
                const text = desc.textContent || '';
                const container = desc.closest('.ItemContainer-module__contents--EBVbu');
                
                // определяем, тема это или запрос на слияние
                const isIssue = container && container.querySelector('.octicon-issue-opened');
                const isPR = container && container.querySelector('.octicon-git-pull-request, .octicon-git-pull-request-draft');
                
                // «Opened by»
                if (text.includes('Opened by')) {
                    let translationKey = null;
                    let logMessage = null;
                    
                    if (isIssue) {
                        // для тем: «Opened by» → «Открыта»
                        translationKey = 'issue-opened-by';
                        logMessage = '"Opened by" (Issue)';
                    } else if (isPR || !text.includes('Created')) {
                        // для запросов на слияние: «Opened by» → «Подан»
                        translationKey = 'opened-by';
                        logMessage = '"Opened by" (PR)';
                    }
                    
                    if (translationKey) {
                        const translation = this.getTranslation(translationKey);
                        if (translation) {
                            const originalHTML = desc.innerHTML;
                            const replacedHTML = originalHTML.replace(/Opened by/g, translation);

                            if (replacedHTML !== originalHTML) {
                                desc.innerHTML = replacedHTML;
                                desc.setAttribute('data-ru-localized', 'true');
                            }
                        }
                    }
                }
                
                // Updated
                if (text.includes('Updated')) {
                    let translationKey = null;
                    let logMessage = null;
                    
                    if (isIssue) {
                        // для тем: Updated → «Отредактирована»
                        translationKey = 'issue-updated';
                        logMessage = '"Updated" (Issue)';
                    } else if (isPR) {
                        // для запросов на слияние: Updated → «Отредактирован»
                        translationKey = 'pr-updated';
                        logMessage = '"Updated" (PR)';
                    }
                    
                    if (translationKey) {
                        const translation = this.getTranslation(translationKey);
                        if (translation) {
                            const originalHTML = desc.innerHTML;
                            const updatedOnPattern = /Updated(?:\s|&nbsp;)+on(?=(?:\s|&nbsp;|<))/g;
                            const updatedPattern = /Updated/g;
                            let html = originalHTML;
                            html = html.replace(updatedOnPattern, translation);
                            html = html.replace(updatedPattern, translation);

                            if (html !== originalHTML) {
                                desc.innerHTML = html;
                                desc.setAttribute('data-updated-localized', 'true');
                            }
                        }
                    }
                }
                
                // «Created on»
                if (text.includes('Created')) {
                    const defaultCreated = this.getTranslation('created-on', 'Created');
                    const translation = isIssue
                        ? this.getTranslation('issue-created-on', defaultCreated)
                        : defaultCreated;

                    if (translation) {
                        const originalHTML = desc.innerHTML;
                        const createdOnPattern = /Created(?:\s|&nbsp;)+on(?=(?:\s|&nbsp;|<))/g;
                        const createdPattern = /Created/g;
                        let html = originalHTML;
                        html = html.replace(createdOnPattern, translation);
                        html = html.replace(createdPattern, translation);

                        if (html !== originalHTML) {
                            desc.innerHTML = html;
                            desc.setAttribute('data-created-localized', 'true');
                        }
                    }
                }

                if (numberSignTranslation && text.includes('#')) {
                    const numberWalker = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT, null);
                    let numberNode;
                    while ((numberNode = numberWalker.nextNode())) {
                        if (!numberNode.textContent || !numberNode.textContent.includes('#')) {
                            continue;
                        }

                        const updated = numberNode.textContent.replace(/#(?=\d)/g, numberSignTranslation);
                        if (updated !== numberNode.textContent) {
                            numberNode.textContent = updated;
                        }
                    }
                }

                // удаляем on, который остаётся перед датами/relative-time
                const walker = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT, null);
                const textNodesToClean = [];
                let textNode;

                while (textNode = walker.nextNode()) {
                    if (!textNode.textContent) {
                        continue;
                    }
                    if (/\bon\b/i.test(textNode.textContent)) {
                        textNodesToClean.push(textNode);
                    }
                }

                textNodesToClean.forEach(node => {
                    let content = node.textContent;

                    // убираем on сразу после переведённых глаголов
                    content = content.replace(/(Отредактирован(?:а)?|Создан(?:а)?)(?:[\s\u00a0]+)on\b(?:[\s\u00a0]*)/gi, '$1 ');

                    // убираем самостоятельные on и лишние пробелы вокруг них
                    content = content.replace(/[\s\u00a0]*\bon\b[\s\u00a0]*/gi, ' ');

                    // нормализуем множественные пробелы, но не удаляем ведущие, если они нужны
                    content = content.replace(/\s{2,}/g, ' ');

                    node.textContent = content;
                });
            });
        }

        cleanRelativeTimeShadow(timeElement) {
            if (!timeElement || typeof timeElement !== 'object') {
                return;
            }

            const shadowRoot = timeElement.shadowRoot;
            if (!shadowRoot) {
                return;
            }

            const ownerDocument = timeElement.ownerDocument;
            const nodeFilter = typeof NodeFilter !== 'undefined'
                ? NodeFilter
                : ownerDocument?.defaultView?.NodeFilter;

            if (!ownerDocument || typeof ownerDocument.createTreeWalker !== 'function' || !nodeFilter) {
                return;
            }

            const walker = ownerDocument.createTreeWalker(shadowRoot, nodeFilter.SHOW_TEXT, null);
            let node;

            while ((node = walker.nextNode())) {
                if (!node.textContent) {
                    continue;
                }

                const original = node.textContent;
                let updated = original.replace(/(^|\s)on\s+/gi, '$1');
                updated = updated.replace(/(?:\s|\u00a0)+г\.$/gi, '');
                updated = updated.replace(/\s{2,}/g, ' ');
                updated = updated.trimStart();
                updated = updated.trimEnd();

                if (updated !== original) {
                    node.textContent = updated;
                }
            }
        }

        /**
         * локализует текстовые узлы с Updated
         */
        localizeUpdatedText() {
            // ищем все текстовые узлы, которые содержат Updated
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // пропускаем пустые узлы и узлы внутри script/style
                        if (!node.textContent.trim() || 
                            node.parentElement?.tagName === 'SCRIPT' || 
                            node.parentElement?.tagName === 'STYLE') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        
                        const text = node.textContent.trim();
                        
                        // принимаем только узлы с Updated (не переведённые)
                        // проверяем И с пробелом, И без пробела
                        if (text === 'Updated' || text === 'Updated ') {
                            // проверяем, не помечен ли родитель как переведённый
                            if (node.parentElement?.getAttribute('data-updated-localized') === 'true') {
                                return NodeFilter.FILTER_REJECT;
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            const nodesToUpdate = []; // собираем узлы перед обновлением
            
            while (node = walker.nextNode()) {
                const trimmedText = node.textContent.trim();
                
                // двойная проверка: что это действительно Updated или «Updated »
                if (trimmedText === 'Updated' || trimmedText === 'Updated ') {
                    // проверяем, не помечен ли родитель (дополнительная проверка)
                    if (node.parentElement?.getAttribute('data-updated-localized') === 'true') {
                        continue;
                    }
                    
                    nodesToUpdate.push(node);
                }
            }
            
            const resolveUpdatedTranslation = (parentElement) => {
                const fallback = this.getTranslation('pr-updated', 'Updated');
                if (!parentElement) {
                    return fallback;
                }

                const container = parentElement.closest('.ItemContainer-module__contents--EBVbu');
                if (container) {
                    if (container.querySelector('.octicon-issue-opened')) {
                        return this.getTranslation('issue-updated', fallback);
                    }
                    if (container.querySelector('.octicon-git-pull-request, .octicon-git-pull-request-draft')) {
                        return this.getTranslation('pr-updated', fallback);
                    }
                }

                return this.getTranslation('pr-updated', fallback);
            };

            // обновляем все найденные узлы с ЗАЩИТОЙ через MutationObserver
            nodesToUpdate.forEach(node => {
                const oldText = node.textContent;
                const parent = node.parentElement;
                
                if (!parent) {
                    const translationText = resolveUpdatedTranslation(null);
                    node.textContent = `${translationText} `;
                    return;
                }
                
                // СНАЧАЛА устанавливаем MutationObserver, ПОТОМ переводим
                const protectObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'characterData' || mutation.type === 'childList') {
                            // проверяем, не восстановил ли Гитхаб оригинальный текст
                            const walker = document.createTreeWalker(
                                parent,
                                NodeFilter.SHOW_TEXT,
                                null
                            );
                            let textNode;
                            while (textNode = walker.nextNode()) {
                                const text = textNode.textContent.trim();
                                if (text === 'Updated' || text === 'Updated ') {
                                    const translationText = resolveUpdatedTranslation(parent);
                                    console.warn(`${LOG_PREFIX} Restored English "Updated" text detected. Reapplying translation.`);
                                    textNode.textContent = `${translationText} `;
                                }
                            }
                        }
                    });
                });
                
                // наблюдаем за изменениями В РОДИТЕЛЕ (ПЕРЕД переводом)
                protectObserver.observe(parent, {
                    characterData: true,
                    childList: true,
                    subtree: true
                });
                
                // ТЕПЕРЬ применяем перевод (при активном observer)
                const translationText = resolveUpdatedTranslation(parent);

                node.textContent = `${translationText} `;
                parent.setAttribute('data-updated-localized', 'true');
            });
        }

        /**
         * локализация страницы настройки предпочтений куки
         */
        localizeCookiePreferencesPage() {
            const cookieHeadingTranslation = this.getTranslation('manage-cookie-preferences');
            const cookieHeadingEnglish = 'Manage cookie preferences';

            if (cookieHeadingTranslation) {
                const headingElements = document.querySelectorAll('h1');
                headingElements.forEach(heading => {
                    if (heading.textContent.trim() === cookieHeadingEnglish) {
                        this.localizeByText(heading, cookieHeadingEnglish, 'manage-cookie-preferences');
                    }
                });
            }

            // локализация заголовков категорий куки
            const cookieCategoryTranslations = [
                { text: 'Required', key: 'required' },
                { text: 'Analytics', key: 'analytics' },
                { text: 'Social media', key: 'social-media' },
                { text: 'Advertising', key: 'advertising' }
            ];
            
            const categoryHeadings = document.querySelectorAll('h2');
            categoryHeadings.forEach(heading => {
                const text = heading.textContent.trim();
                const translation = cookieCategoryTranslations.find(t => t.text === text);
                if (translation) {
                    this.localizeByText(heading, translation.text, translation.key);
                }
            });

            // локализация описания «Required»
            const requiredDescriptionEnglish = 'GitHub uses required cookies to perform essential website functions and to provide the services. For example, cookies are used to log you in, save your language preferences, provide a shopping cart experience, improve performance, route traffic between web servers, detect the size of your screen, determine page load times, improve user experience, and for audience measurement. These cookies are necessary for our websites to work.';
            const requiredDescriptionTranslation = this.getTranslation('github-uses-required-work');
            
            if (requiredDescriptionTranslation) {
                const paragraphs = document.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const normalizedText = p.textContent.replace(/\s+/g, ' ').trim();
                    if (normalizedText === requiredDescriptionEnglish.replace(/\s+/g, ' ').trim()) {
                        this.localizeByText(p, requiredDescriptionEnglish, 'github-uses-required-work');
                    }
                });
            }

            const cookieDescriptionTranslation = this.getTranslation('most-github-websites-use-cookies');
            const cookieDescriptionEnglish = 'Most GitHub websites use cookies. Cookies are small text files placed on your device to store data so web servers can use it later. GitHub and our third-party partners use cookies to remember your preferences and settings, help you sign in, show you personalized ads, and analyze how well our websites are working. For more info, see the Cookies and similar technologies section of the Privacy Statement.';

            if (!cookieDescriptionTranslation) {
                return;
            }

            const parts = cookieDescriptionTranslation.split(/\[link\]|\[\/link\]/);
            const hasLink = parts.length >= 3;

            const paragraphs = document.querySelectorAll('form p');
            const englishNormalized = cookieDescriptionEnglish.replace(/\s+/g, ' ').trim();

            paragraphs.forEach(paragraph => {
                const normalizedText = paragraph.textContent.replace(/\s+/g, ' ').trim();
                const alreadyLocalized = paragraph.getAttribute('data-ru-localized') === 'true';
                const matchesEnglish = normalizedText === englishNormalized;

                if (!matchesEnglish && !alreadyLocalized) {
                    return;
                }

                if (hasLink) {
                    const link = paragraph.querySelector('a');
                    if (!link) {
                        this.localizeByText(paragraph, cookieDescriptionEnglish, 'most-github-websites-use-cookies');
                        return;
                    }

                    const prefix = parts[0] ?? '';
                    const linkText = parts[1] ?? '';
                    const suffix = parts.slice(2).join('');

                    const fragment = document.createDocumentFragment();
                    if (prefix) {
                        fragment.appendChild(document.createTextNode(prefix));
                    }
                    link.textContent = linkText;
                    fragment.appendChild(link);
                    if (suffix) {
                        fragment.appendChild(document.createTextNode(suffix));
                    }

                    paragraph.replaceChildren(fragment);
                    paragraph.setAttribute('data-ru-localized', 'true');
                } else {
                    this.localizeByText(paragraph, cookieDescriptionEnglish, 'most-github-websites-use-cookies');
                }
            });
        }

        /**
         * локализует подвал (footer)
         */
        localizeFooter() {
            // «© 2025 GitHub, Inc.»
            const copyrightSpans = document.querySelectorAll('span');
            copyrightSpans.forEach(span => {
                const text = span.textContent.trim();
                if (text.includes('© 2025 GitHub,') && text.includes('Inc.')) {
                    this.localizeByText(span, '© 2025 GitHub,\u00A0Inc.', 'copyright-2025');
                }
            });
            
            // ссылки подвала
            const footerLinks = document.querySelectorAll('.Link--secondary.Link');
            const linkTranslations = [
                { text: 'Terms', key: 'terms' },
                { text: 'Privacy', key: 'privacy' },
                { text: 'Security', key: 'security' },
                { text: 'Status', key: 'status' },
                { text: 'Community', key: 'community' },
                { text: 'Docs', key: 'docs' },
                { text: 'Contact', key: 'contact' }
            ];
            
            footerLinks.forEach(link => {
                const text = link.textContent.trim();
                const translation = linkTranslations.find(t => t.text === text);
                if (translation) {
                    this.localizeByText(link, translation.text, translation.key);
                }
            });
            
            // кнопки управления куки в подвале
            const cookieButtons = document.querySelectorAll('cookie-consent-link > button.Link--secondary.underline-on-hover');
            const cookieTranslations = [
                { text: 'Manage cookies', key: 'manage-cookies' },
                { text: 'Do not share my personal information', key: 'do-not-share-info' }
            ];
            
            cookieButtons.forEach(button => {
                const text = button.textContent.trim();
                const translation = cookieTranslations.find(t => t.text === text);
                if (translation) {
                    this.localizeByText(button, translation.text, translation.key);
                }
            });
        }

        /**
         * запуск локализации всех поддерживаемых элементов
         */
        localize() {
            this.localizeDashboard();
            this.localizeSearchPlaceholder();
            this.localizeTooltips();
            this.localizeAllTooltips();
            this.localizeActionListItems();
            this.localizeGreeting();
            this.localizeGitHubEducation();
            this.localizeCopilotChatAndLeftBarPart();
            this.localizeLabelsStatusesAndLinks();
            this.localizeCommandPills();
            this.localizeDashboardElements();
            this.localizeDashboardTooltips();
            this.localizeSearchElements();
            this.localizeCopilotSearchElements();
            this.localizeBranchTooltips();
            this.localizeAgentsHeader();
            this.localizeCommandPalette();
            this.localizeCopilotTaskScreen();
            this.localizeNoResultsMessages();
            this.localizeUpdatedText();
            this.localizeRelativeTime();
            this.localizeCookiePreferencesPage();
            this.localizeFooter();
        }

        /**
         * устанавливка наблюдателя за изменениями DOM
         */
        observeChanges() {
            this.observer = new MutationObserver((mutations) => {
                let shouldRelocalize = false;
                
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldRelocalize = true;
                        break;
                    }
                }
                
                if (shouldRelocalize) {
                    // debounce: локализуем только через 100 мс после последнего изменения
                    clearTimeout(this.relocalizeTimeout);
                    this.relocalizeTimeout = setTimeout(() => {
                        this.localize();
                    }, 100);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * останавливает наблюдатель
         */
        stopObserving() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    /**
     * загрузка файла формата FTL из репозитория
     */
    async function loadFTL(url) {
        try {
            console.info(`${LOG_PREFIX} Fetching FTL file from ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const content = await response.text();
            console.info(`${LOG_PREFIX} FTL file downloaded successfully.`);
            return content;
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to download FTL file:`, error);
            throw error;
        }
    }

    // инициализация
    console.info(`${LOG_PREFIX} Userscript loaded.`);
    
    // ждём полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        console.info(`${LOG_PREFIX} DOM ready, initializing localizer...`);
        
        try {
            // загружаем файл формата FTL из репозитория
            const ftlContent = await loadFTL(FTL_URL);
            
            // создаём локализатор с загруженным содержимым
            const localizer = new GitHubLocalizer(ftlContent);
            
            // первоначальная локализация
            localizer.localize();
            
            // наблюдаем за изменениями для динамически загружаемого контента
            localizer.observeChanges();
            
            // сохраняем в глобальном объекте для отладки
            window.GitHubLocalizer = localizer;
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to initialize localizer:`, error);
        }
    }
})();
