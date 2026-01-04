// ==UserScript==
// @name         YouTube auto draft2public-with-movable-panel
// @namespace    https://github.com/dexzhou/YouTube-draft2public-js/blob/main/v2.js
// @version      0.4
// @description  If you have a lot of videos in draft form in your YouTube Studio and you don't need to edit each description and title individually, and you'd like to be able to publish them in bulk with just a few clicks, then this tool is worth trying, and it's completely free. You can even customize the number of videos you want to publish at a time, including Shorts. Note: Before using this tool, you must manually apply the filter and select "Draft" for visibility. 
// @author       Dex Zhou
// @match        https://studio.youtube.com/*
// @grant        none
// @license AGPL-3.0-or-later
// @name:zh-CN    油管草稿视频批量发布
// @description:zh-CN    假设您的 YouTube 工作室中有很多处于草稿状态的视频,而且你不需要逐个编辑每个描述和标题，你希望只需点击几下即可批量发布，那么这个工具值得你去尝试，它是完全免费的。您甚至可以自定义每次发布的视频数量，也包括Shorts。注意：使用此工具之前，您必须手动使用过滤条件，并在公开范围内选择“草稿”。
// @downloadURL https://update.greasyfork.org/scripts/546862/YouTube%20auto%20draft2public-with-movable-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/546862/YouTube%20auto%20draft2public-with-movable-panel.meta.js
// ==/UserScript==
(() => {
    // 多语言支持 - 语言包定义
    const translations = {
        'English': {
            title: 'YouTube auto draft2publish',
            publishCount: 'Publish count:',
            allDrafts: 'All drafts',
            customNumber: 'Custom number:',
            publishStatus: 'Publish status:',
            public: 'Public',
            unlisted: 'Unlisted',
            private: 'Private',
            startPublishing: 'Start Publishing',
            language: 'Language:',
            publishing: 'Publishing...',
            publishedSuccess: 'Successfully published',
            videos: 'videos',
            errorOccurred: 'An error occurred',
            pleaseWait: 'Please wait...'
        },
        '简体中文': {
            title: 'YouTube 草稿批量发布工具',
            publishCount: '发布数量:',
            allDrafts: '所有草稿',
            customNumber: '指定数量:',
            publishStatus: '发布状态:',
            public: '公开',
            unlisted: '不公开',
            private: '私有',
            startPublishing: '开始发布',
            language: '语言:',
            publishing: '发布中...',
            publishedSuccess: '已成功发布',
            videos: '个视频',
            errorOccurred: '发生错误',
            pleaseWait: '请稍候...'
        },
        'Español': {
            title: 'Herramienta de publicación de borradores de YouTube',
            publishCount: 'Recuento de publicación:',
            allDrafts: 'Todos los borradores',
            customNumber: 'Número personalizado:',
            publishStatus: 'Estado de publicación:',
            public: 'Público',
            unlisted: 'No listado',
            private: 'Privado',
            startPublishing: 'Iniciar publicación',
            language: 'Idioma:',
            publishing: 'Publicando...',
            publishedSuccess: 'Publicado con éxito',
            videos: 'vídeos',
            errorOccurred: 'Ocurrió un error',
            pleaseWait: 'Por favor, espere...'
        },
        'Français': {
            title: 'Outil de publication de brouillons YouTube',
            publishCount: 'Nombre de publications:',
            allDrafts: 'Tous les brouillons',
            customNumber: 'Nombre personnalisé:',
            publishStatus: 'Statut de publication:',
            public: 'Public',
            unlisted: 'Non listé',
            private: 'Privé',
            startPublishing: 'Démarrer la publication',
            language: 'Langue:',
            publishing: 'Publication en cours...',
            publishedSuccess: 'Publié avec succès',
            videos: 'vidéos',
            errorOccurred: 'Une erreur est survenue',
            pleaseWait: 'Veuillez patienter...'
        },
        'Русский': {
            title: 'Инструмент для публикации черновиков YouTube',
            publishCount: 'Количество публикаций:',
            allDrafts: 'Все черновики',
            customNumber: 'Пользовательское количество:',
            publishStatus: 'Статус публикации:',
            public: 'Публичный',
            unlisted: 'Не перечисленный',
            private: 'Частный',
            startPublishing: 'Начать публикацию',
            language: 'Язык:',
            publishing: 'Публикация...',
            publishedSuccess: 'Успешно опубликовано',
            videos: 'видео',
            errorOccurred: 'Произошла ошибка',
            pleaseWait: 'Пожалуйста, подождите...'
        }
    };

    // 当前选中的语言
    let currentLanguage = '简体中文';

    // 获取翻译文本的函数
    function t(key) {
        return translations[currentLanguage][key] || translations['English'][key] || key;
    }

    // 配置项
    const MODE = 'publish_drafts';
    const DEBUG_MODE = true;
    const MADE_FOR_KIDS = false;
    const SORTING_KEY = (one, other) => {
        const numberRegex = /\d+/;
        const number = (name) => name.match(numberRegex)[0];
        if (number(one.name) === undefined || number(other.name) === undefined) {
            return one.name.localeCompare(other.name);
        }
        return number(one.name) - number(other.name);
    };

    // 通用工具函数
    const TIMEOUT_STEP_MS = 20;
    const DEFAULT_ELEMENT_TIMEOUT_MS = 10000;
    function debugLog(...args) {
        if (!DEBUG_MODE) return;
        console.debug(...args);
    }
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function waitForElement(selector, baseEl, timeoutMs) {
        if (timeoutMs === undefined) timeoutMs = DEFAULT_ELEMENT_TIMEOUT_MS;
        if (baseEl === undefined) baseEl = document;
        let timeout = timeoutMs;
        while (timeout > 0) {
            let element = baseEl.querySelector(selector);
            if (element !== null) return element;
            await sleep(TIMEOUT_STEP_MS);
            timeout -= TIMEOUT_STEP_MS;
        }
        debugLog(`could not find ${selector} inside`, baseEl);
        return null;
    }

    function click(element) {
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('mousedown', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        element.dispatchEvent(event);
        element.click();
        debugLog(element, 'clicked');
    }

    // 添加用户界面元素
    function createUserInterface() {
        // 设置body默认字体大小为14px
        document.body.style.fontSize = '14px';
        
        // 检查是否已有界面，防止重复创建
        const existingUI = document.getElementById('youtube-publish-tool');
        if (existingUI) return;

        // 创建容器
        const container = document.createElement('div');
        container.id = 'youtube-publish-tool';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = 'white';
        container.style.opacity = '0.9';
        container.style.padding = '15px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.minWidth = '300px';
        container.style.cursor = 'move';
        container.style.userSelect = 'none';

        // 拖动逻辑
        let isDragging = false;
        let startX, startY;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = container.getBoundingClientRect();
            offsetX = startX - rect.left;
            offsetY = startY - rect.top;
            container.style.zIndex = '10000';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            container.style.left = `${newLeft}px`;
            container.style.top = `${newTop}px`;
            container.style.bottom = 'auto';
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.zIndex = '9999';
            }
        });

        document.addEventListener('mouseleave', () => {
            isDragging = false;
            container.style.zIndex = '9999';
        });

        // 状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'publish-status-indicator';
        statusIndicator.style.color = '#666';
        statusIndicator.style.fontSize = '12px';
        statusIndicator.style.marginBottom = '10px';
        statusIndicator.style.minHeight = '16px';
        container.appendChild(statusIndicator);

        // 语言选择
        const languageContainer = document.createElement('div');
        languageContainer.style.marginBottom = '15px';

        const languageLabel = document.createElement('label');
        languageLabel.textContent = t('language');
        languageLabel.style.marginRight = '8px';
        languageContainer.appendChild(languageLabel);

        const languageSelect = document.createElement('select');
        languageSelect.id = 'language-select';
        languageSelect.style.padding = '4px';
        languageSelect.style.borderRadius = '4px';

        const languages = [
            {code: 'English', name: 'English'},
            {code: '简体中文', name: '简体中文'},
            {code: 'Español', name: 'Español'},
            {code: 'Français', name: 'Français'},
            {code: 'Русский', name: 'Русский'}
        ];

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === currentLanguage) option.selected = true;
            languageSelect.appendChild(option);
        });

        languageContainer.appendChild(languageSelect);
        container.appendChild(languageContainer);

        // 标题
        const title = document.createElement('h3');
        title.id = 'tool-title';
        title.textContent = t('title');
        title.style.marginTop = '0';
        title.style.color = '#333';
        container.appendChild(title);

        // 发布数量选择
        const countContainer = document.createElement('div');
        countContainer.style.marginBottom = '10px';

        const countLabel = document.createElement('label');
        countLabel.id = 'count-label';
        countLabel.textContent = t('publishCount');
        countLabel.style.display = 'block';
        countLabel.style.marginBottom = '5px';
        countContainer.appendChild(countLabel);

        const allRadio = document.createElement('input');
        allRadio.type = 'radio';
        allRadio.name = 'publishCount';
        allRadio.id = 'publishAll';
        allRadio.value = 'all';
        allRadio.checked = true;
        countContainer.appendChild(allRadio);

        const allLabel = document.createElement('label');
        allLabel.id = 'all-label';
        allLabel.htmlFor = 'publishAll';
        allLabel.textContent = t('allDrafts');
        allLabel.style.marginRight = '15px';
        countContainer.appendChild(allLabel);

        const customCountContainer = document.createElement('span');

        const customRadio = document.createElement('input');
        customRadio.type = 'radio';
        customRadio.name = 'publishCount';
        customRadio.id = 'publishCustom';
        customRadio.value = 'custom';
        customCountContainer.appendChild(customRadio);

        const customLabel = document.createElement('label');
        customLabel.id = 'custom-label';
        customLabel.htmlFor = 'publishCustom';
        customLabel.textContent = t('customNumber');
        customCountContainer.appendChild(customLabel);

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.id = 'publishNumber';
        countInput.min = '1';
        countInput.value = '1';
        countInput.disabled = true;
        countInput.style.width = '50px';
        customCountContainer.appendChild(countInput);

        countContainer.appendChild(customCountContainer);
        container.appendChild(countContainer);

        // 可见性选择
        const visibilityContainer = document.createElement('div');
        visibilityContainer.style.marginBottom = '15px';

        const visibilityLabel = document.createElement('label');
        visibilityLabel.id = 'visibility-label';
        visibilityLabel.textContent = t('publishStatus');
        visibilityLabel.style.display = 'block';
        visibilityLabel.style.marginBottom = '5px';
        visibilityContainer.appendChild(visibilityLabel);

        const visibilityOptions = [
            { id: 'public', label: t('public'), value: 'Public' },
            { id: 'unlisted', label: t('unlisted'), value: 'Unlisted' },
            { id: 'private', label: t('private'), value: 'Private' }
        ];

        visibilityOptions.forEach(option => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'visibility';
            radio.id = option.id;
            radio.value = option.value;
            radio.checked = option.value === 'Public';
            visibilityContainer.appendChild(radio);

            const label = document.createElement('label');
            label.id = `${option.id}-label`;
            label.htmlFor = option.id;
            label.textContent = option.label;
            label.style.marginRight = '15px';
            visibilityContainer.appendChild(label);
        });

        container.appendChild(visibilityContainer);

        // 开始按钮
        const startButton = document.createElement('button');
        startButton.id = 'start-button';
        startButton.textContent = t('startPublishing');
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.padding = '8px 16px';
        startButton.style.borderRadius = '4px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontSize = '14px';
        startButton.style.width = '100%';
        container.appendChild(startButton);

        // 添加到页面
        document.body.appendChild(container);

        // 事件监听
        customRadio.addEventListener('change', () => {
            countInput.disabled = !customRadio.checked;
        });

        allRadio.addEventListener('change', () => {
            countInput.disabled = !customRadio.checked;
        });

        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            updateInterfaceLanguage();
        });

        return {
            getPublishCount: () => {
                return allRadio.checked ? 'all' : (parseInt(countInput.value, 10) || 1);
            },
            getVisibility: () => {
                const selected = document.querySelector('input[name="visibility"]:checked');
                return selected ? selected.value : 'Public';
            },
            startButton,
            setStatus: (text) => {
                statusIndicator.textContent = text;
            },
            disableControls: () => {
                startButton.disabled = true;
                startButton.style.opacity = '0.7';
                allRadio.disabled = true;
                customRadio.disabled = true;
                countInput.disabled = true;
                document.querySelectorAll('input[name="visibility"]').forEach(radio => {
                    radio.disabled = true;
                });
                languageSelect.disabled = true;
            },
            enableControls: () => {
                startButton.disabled = false;
                startButton.style.opacity = '1';
                allRadio.disabled = false;
                customRadio.disabled = false;
                countInput.disabled = !customRadio.checked;
                document.querySelectorAll('input[name="visibility"]').forEach(radio => {
                    radio.disabled = false;
                });
                languageSelect.disabled = false;
            }
        };
    }

    // 更新界面语言
    function updateInterfaceLanguage() {
        document.getElementById('tool-title').textContent = t('title');
        document.getElementById('count-label').textContent = t('publishCount');
        document.getElementById('all-label').textContent = t('allDrafts');
        document.getElementById('custom-label').textContent = t('customNumber');
        document.getElementById('visibility-label').textContent = t('publishStatus');
        document.getElementById('public-label').textContent = t('public');
        document.getElementById('unlisted-label').textContent = t('unlisted');
        document.getElementById('private-label').textContent = t('private');
        document.getElementById('start-button').textContent = t('startPublishing');
    }

    // 发布相关逻辑
    const VISIBILITY_PUBLISH_ORDER = {
        'Private': 0,
        'Unlisted': 1,
        'Public': 2,
    };

    const VIDEO_ROW_SELECTOR = 'ytcp-video-row';
    const DRAFT_MODAL_SELECTOR = '.style-scope.ytcp-uploads-dialog';
    const DRAFT_BUTTON_SELECTOR = '.edit-draft-button';
    const MADE_FOR_KIDS_SELECTOR = '#made-for-kids-group';
    const RADIO_BUTTON_SELECTOR = 'tp-yt-paper-radio-button';
    const VISIBILITY_STEPPER_SELECTOR = '#step-badge-3';
    const VISIBILITY_PAPER_BUTTONS_SELECTOR = 'tp-yt-paper-radio-group';
    const SAVE_BUTTON_SELECTOR = '#done-button';
    const SUCCESS_ELEMENT_SELECTOR = 'ytcp-video-thumbnail-with-info';
    const DIALOG_SELECTOR = 'ytcp-dialog.ytcp-video-share-dialog > tp-yt-paper-dialog:nth-child(1)';
    const DIALOG_CLOSE_BUTTON_SELECTOR = 'tp-yt-iron-icon';

    class SuccessDialog {
        constructor(raw) {
            this.raw = raw;
        }

        async closeDialogButton() {
            return await waitForElement(DIALOG_CLOSE_BUTTON_SELECTOR, this.raw);
        }

        async close() {
            click(await this.closeDialogButton());
            await sleep(50);
            debugLog('closed');
        }
    }

    class VisibilityModal {
        constructor(raw, visibility) {
            this.raw = raw;
            this.visibility = visibility;
        }

        async radioButtonGroup() {
            return await waitForElement(VISIBILITY_PAPER_BUTTONS_SELECTOR, this.raw);
        }

        async visibilityRadioButton() {
            const group = await this.radioButtonGroup();
            const value = VISIBILITY_PUBLISH_ORDER[this.visibility];
            return [...group.querySelectorAll(RADIO_BUTTON_SELECTOR)][value];
        }

        async setVisibility() {
            click(await this.visibilityRadioButton());
            debugLog(`visibility set to ${this.visibility}`);
            await sleep(50);
        }

        async saveButton() {
            return await waitForElement(SAVE_BUTTON_SELECTOR, this.raw);
        }
        async isSaved() {
            await waitForElement(SUCCESS_ELEMENT_SELECTOR, document);
        }
        async dialog() {
            return await waitForElement(DIALOG_SELECTOR);
        }
        async save() {
            click(await this.saveButton());
            await this.isSaved();
            debugLog('saved');
            const dialogElement = await this.dialog();
            const success = new SuccessDialog(dialogElement);
            return success;
        }
    }

    class DraftModal {
        constructor(raw, visibility) {
            this.raw = raw;
            this.visibility = visibility;
        }

        async madeForKidsToggle() {
            return await waitForElement(MADE_FOR_KIDS_SELECTOR, this.raw);
        }

        async madeForKidsPaperButton() {
            const nthChild = MADE_FOR_KIDS ? 1 : 2;
            return await waitForElement(`${RADIO_BUTTON_SELECTOR}:nth-child(${nthChild})`, this.raw);
        }

        async selectMadeForKids() {
            click(await this.madeForKidsPaperButton());
            await sleep(50);
            debugLog(`"Made for kids" set as ${MADE_FOR_KIDS}`);
        }

        async visibilityStepper() {
            return await waitForElement(VISIBILITY_STEPPER_SELECTOR, this.raw);
        }

        async goToVisibility() {
            debugLog('going to Visibility');
            await sleep(50);
            click(await this.visibilityStepper());
            const visibility = new VisibilityModal(this.raw, this.visibility);
            await sleep(50);
            await waitForElement(VISIBILITY_PAPER_BUTTONS_SELECTOR, visibility.raw);
            return visibility;
        }
    }

    class VideoRow {
        constructor(raw) {
            this.raw = raw;
        }

        get editDraftButton() {
            return waitForElement(DRAFT_BUTTON_SELECTOR, this.raw, 20);
        }

        async openDraft(visibility) {
            debugLog('focusing draft button');
            click(await this.editDraftButton);
            return new DraftModal(await waitForElement(DRAFT_MODAL_SELECTOR), visibility);
        }
    }


    function allVideos() {
        return [...document.querySelectorAll(VIDEO_ROW_SELECTOR)].map((el) => new VideoRow(el));
    }

    async function editableVideos() {
        let editable = [];
        for (let video of allVideos()) {
            if ((await video.editDraftButton) !== null) {
                editable = [...editable, video];
            }
        }
        return editable;
    }

    async function publishDrafts(config) {
        try {
            config.disableControls();
            config.setStatus(t('pleaseWait'));

            const videos = await editableVideos();
            const publishCount = config.getPublishCount();
            const visibility = config.getVisibility();

            const videosToPublish = publishCount === 'all'
                ? videos
                : videos.slice(0, Math.min(publishCount, videos.length));

            debugLog(`found ${videos.length} videos, will publish ${videosToPublish.length}`);

            if (videosToPublish.length === 0) {
                config.setStatus(t('errorOccurred') + ': ' + 'No videos to publish');
                config.enableControls();
                return;
            }

            for (let i = 0; i < videosToPublish.length; i++) {
                config.setStatus(`${t('publishing')} (${i+1}/${videosToPublish.length})`);
                const video = videosToPublish[i];
                try {
                    const draft = await video.openDraft(visibility);
                    await draft.selectMadeForKids();
                    const visibilityModal = await draft.goToVisibility();
                    await visibilityModal.setVisibility();
                    const dialog = await visibilityModal.save();
                    await dialog.close();
                    await sleep(100);
                } catch (error) {
                    debugLog(`Error publishing video ${i+1}:`, error);
                    config.setStatus(`${t('errorOccurred')} (${i+1}/${videosToPublish.length})`);
                    await sleep(1000);
                }
            }

            config.setStatus(`${t('publishedSuccess')}: ${videosToPublish.length} ${t('videos')}`);
        } catch (error) {
            debugLog('General error:', error);
            config.setStatus(t('errorOccurred'));
        } finally {
            config.enableControls();
        }
    }

    // 排序相关逻辑
    const SORTING_MENU_BUTTON_SELECTOR = 'button';
    const SORTING_ITEM_MENU_SELECTOR = 'paper-listbox#items';
    const SORTING_ITEM_MENU_ITEM_SELECTOR = 'ytd-menu-service-item-renderer';
    const MOVE_TO_TOP_INDEX = 4;
    const MOVE_TO_BOTTOM_INDEX = 5;

    class SortingDialog {
        constructor(raw) {
            this.raw = raw;
        }

        async anyMenuItem() {
            const item =  await waitForElement(SORTING_ITEM_MENU_ITEM_SELECTOR, this.raw);
            if (item === null) {
                throw new Error("could not locate any menu item");
            }
            return item;
        }

        menuItems() {
            return [...this.raw.querySelectorAll(SORTING_ITEM_MENU_ITEM_SELECTOR)];
        }

        async moveToTop() {
            click(this.menuItems()[MOVE_TO_TOP_INDEX]);
        }

        async moveToBottom() {
            click(this.menuItems()[MOVE_TO_BOTTOM_INDEX]);
        }
    }
    class PlaylistVideo {
        constructor(raw) {
            this.raw = raw;
        }
        get name() {
            return this.raw.querySelector('#video-title').textContent;
        }
        async dialog() {
            return this.raw.querySelector(SORTING_MENU_BUTTON_SELECTOR);
        }

        async openDialog() {
            click(await this.dialog());
            const dialog = new SortingDialog(await waitForElement(SORTING_ITEM_MENU_SELECTOR));
            await dialog.anyMenuItem();
            return dialog;
        }

    }
    async function playlistVideos() {
        return [...document.querySelectorAll('ytd-playlist-video-renderer')]
            .map((el) => new PlaylistVideo(el));
    }
    async function sortPlaylist() {
        debugLog('sorting playlist');
        const videos = await playlistVideos();
        debugLog(`found ${videos.length} videos`);
        videos.sort(SORTING_KEY);
        const videoNames = videos.map((v) => v.name);

        let index = 1;
        for (let name of videoNames) {
            debugLog({index, name});
            const video = videos.find((v) => v.name === name);
            const dialog = await video.openDialog();
            await dialog.moveToBottom();
            await sleep(1000);
            index += 1;
        }

    }


    // 入口点
    if (MODE === 'publish_drafts') {
        const ui = createUserInterface();
        if (ui) {
            ui.startButton.addEventListener('click', () => {
                publishDrafts(ui);
            });
        }
    } else if (MODE === 'sort_playlist') {
        sortPlaylist();
    }
})();
