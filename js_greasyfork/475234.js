// ==UserScript==
// @name         Anilist: Activity-Feed Filter
// @namespace    https://github.com/SeyTi01/
// @version      1.8.5
// @description  Control the content displayed in your activity feeds
// @author       SeyTi01
// @match        https://anilist.co/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475234/Anilist%3A%20Activity-Feed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/475234/Anilist%3A%20Activity-Feed%20Filter.meta.js
// ==/UserScript==

const config = {
    remove: {
        images: false, // Remove activities with images
        gifs: false, // Remove activities with gifs
        videos: false, // Remove activities with videos
        text: false, // Remove activities with only text
        uncommented: false, // Remove activities without comments
        unliked: false, // Remove activities without likes
        containsStrings: [], // Remove activities containing user-defined strings
    },
    options: {
        targetLoadCount: 2, // Minimum number of activities to display per "Load More" button click
        caseSensitive: false, // Use case-sensitive matching for string-based removal
        reverseConditions: false, // Display only posts that meet the specified removal conditions
        linkedConditions: [], // Groups of conditions to be evaluated together
    },
    runOn: {
        home: true, // Run the script on the home feed
        social: true, // Run the script on the 'Recent Activity' of anime/manga entries
        profile: false, // Run the script on user profile feeds
        guestHome: false, // Run the script on the home feed for non-user visitors
    },
};

class MainApp {
    constructor(activityHandler, uiHandler, config) {
        this.ac = activityHandler;
        this.ui = uiHandler;
        this.config = config;
        this.URLS = {
            home: 'https://anilist.co/home',
            social: 'https://anilist.co/*/social',
            profile: 'https://anilist.co/user/*/',
            guestHome: 'https://anilist.co/social',
        };
    }

    initializeObserver() {
        this.observer = new MutationObserver(this._observeMutations.bind(this));
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    _observeMutations(mutations) {
        if (this._isUrlAllowed()) {
            mutations.forEach(mutation => mutation.addedNodes.forEach(node => this._handleAddedNode(node)));
            this._processLoadOrReset();
        }
    }

    _handleAddedNode(node) {
        if (!(node instanceof HTMLElement)) {
            return;
        }

        if (node.matches(SELECTORS.DIV.ACTIVITY)) {
            this.ac.processActivityNode(node);
        } else if (node.matches(SELECTORS.DIV.BUTTON)) {
            this.ui.bindLoadMoreButton(node);
        } else if (node.matches(SELECTORS.DIV.MARKDOWN)) {
            const entry = node.closest(SELECTORS.DIV.ACTIVITY);
            if (entry) this.ac.processActivityNode(entry);
        }
    }

    _processLoadOrReset() {
        if (this.ac.currentLoadCount < this.config.options.targetLoadCount && this.ui.userPressed) {
            this.ui.triggerLoadMore();
        } else {
            this.ac._resetLoadCount();
            this.ui.resetUIState();
        }
    }

    _isUrlAllowed() {
        const allowedPatterns = Object.keys(this.URLS).filter(pattern => this.config.runOn[pattern]);

        return allowedPatterns.some(pattern => {
            const regex = new RegExp(this.URLS[pattern].replace('*', '.*'));
            return regex.test(window.location.href);
        });
    }
}

class ActivityHandler {
    constructor(config) {
        this.currentLoadCount = 0;
        this.config = config;
        this.LINKED = { TRUE: 1, FALSE: 0, NONE: -1 };

        const wrap = method => (node, reverse) => {
            const res = method.call(this, node);
            return reverse ? !res : res;
        };

        const handlers = {
            uncommented: this._evaluateUncommentedRemoval,
            unliked: this._evaluateUnlikedRemoval,
            text: this._evaluateTextRemoval,
            images: this._evaluateImageRemoval,
            gifs: this._evaluateGifRemoval,
            videos: this._evaluateVideoRemoval,
            containsStrings: this._evaluateStringRemoval
        };

        this.CONDITIONS_MAP = new Map(
            Object.entries(handlers).map(
                ([name, method]) => [name, wrap(method)]
            )
        );
    }

    processActivityNode(node) {
        const { options: { reverseConditions, linkedConditions } } = this.config;
        this.linkedConditionsFlat = linkedConditions.flat();

        const linkedResult = this._evaluateLinkedConditions(node);
        const shouldRemove = reverseConditions
            ? this._evaluateReverseConditions(node, linkedResult)
            : this._evaluateNormalConditions(node, linkedResult);

        shouldRemove ? node.remove() : this.currentLoadCount++;
    }

    _evaluateLinkedConditions(node) {
        const { options: { linkedConditions } } = this.config;

        if (this.linkedConditionsFlat.length === 0) {
            return this.LINKED.NONE;
        }

        const lists = this._extractLinkedConditions(linkedConditions);
        const results = lists.map(list => this._evaluateConditionList(node, list));
        const hasTrue = results.some(Boolean);
        const hasFalse = results.some(r => !r);

        return hasTrue && (!this.config.options.reverseConditions || !hasFalse)
            ? this.LINKED.TRUE
            : this.LINKED.FALSE;
    }

    _evaluateReverseConditions(node, linkedResult) {
        const { options: { reverseConditions } } = this.config;

        const results = this._getActiveConditionFunctions().map(fn => fn(node, reverseConditions));

        return linkedResult !== this.LINKED.FALSE
            && !results.includes(false)
            && (linkedResult === this.LINKED.TRUE || results.includes(true));
    }

    _evaluateNormalConditions(node, linkedResult) {
        const { options: { reverseConditions } } = this.config;

        const anyMatch = this._getActiveConditionFunctions().some(fn => fn(node, reverseConditions));

        return linkedResult === this.LINKED.TRUE || anyMatch;
    }

    _getActiveConditionFunctions() {
        const { remove } = this.config;

        return [...this.CONDITIONS_MAP]
            .filter(([name]) => {
                if (this.linkedConditionsFlat.includes(name)) return false;
                const cfg = remove[name];
                return cfg === true || (Array.isArray(cfg) && cfg.flat().length > 0);
            })
            .map(([, fn]) => fn);
    }

    _evaluateConditionList(node, list) {
        const { options: { reverseConditions } } = this.config;

        return reverseConditions
            ? list.some(cond => this.CONDITIONS_MAP.get(cond)(node, reverseConditions))
            : list.every(cond => this.CONDITIONS_MAP.get(cond)(node, reverseConditions));
    }

    _extractLinkedConditions(linkedConditions) {
        const isNested = linkedConditions.some(Array.isArray);

        return isNested
            ? linkedConditions.map(c => Array.isArray(c) ? c : [c])
            : [linkedConditions];
    }

    _evaluateStringRemoval(node) {
        const { remove: { containsStrings }, options: { caseSensitive } } = this.config;

        const matches = substr => {
            const text = node.textContent;

            return caseSensitive
                ? text.includes(substr)
                : text.toLowerCase().includes(substr.toLowerCase());
        };

        return containsStrings.some(group =>
            Array.isArray(group)
                ? group.every(matches)
                : matches(group)
        );
    }

    _evaluateTextRemoval(node) {
        const hasTextClass =
            node.classList.contains(SELECTORS.ACTIVITY.TEXT) || node.classList.contains(SELECTORS.ACTIVITY.MESSAGE);

        return hasTextClass && !(
            this._evaluateImageRemoval(node) ||
            this._evaluateGifRemoval(node) ||
            this._evaluateVideoRemoval(node)
        );
    }

    _evaluateVideoRemoval(node) {
        return node.querySelector(SELECTORS.CLASS.VIDEO) || node.querySelector(SELECTORS.SPAN.YOUTUBE);
    }

    _evaluateImageRemoval(node) {
        const img = node.querySelector(SELECTORS.CLASS.IMAGE);

        return img && !img.src.includes('.gif');
    }

    _evaluateGifRemoval(node) {
        const img = node.querySelector(SELECTORS.CLASS.IMAGE);

        return img && img.src.includes('.gif');
    }

    _evaluateUncommentedRemoval(node) {
        const replies = node.querySelector(SELECTORS.DIV.REPLIES);

        return !replies || !replies.querySelector(SELECTORS.SPAN.COUNT);
    }

    _evaluateUnlikedRemoval(node) {
        const likes = node.querySelector(SELECTORS.DIV.LIKES);

        return !likes || !likes.querySelector(SELECTORS.SPAN.COUNT);
    }

    _resetLoadCount() {
        this.currentLoadCount = 0;
    }
}

class UIHandler {
    constructor() {
        this.userPressed = true;
        this.loadMoreButton = null;
        this.cancelButton = null;
    }

    bindLoadMoreButton(button) {
        this.loadMoreButton = button;
        button.addEventListener('click', () => {
            this.userPressed = true;
            this._startScrollTrigger();
            this._showCancelButton();
        });
    }

    triggerLoadMore() {
        this.loadMoreButton?.click();
    }

    resetUIState() {
        this.userPressed = false;
        this._hideCancelButton();
    }

    displayErrorMessage(message) {
        if (!this.errorContainer) {
            const style =
                `position: fixed;` +
                `bottom: 10px;` +
                `right: 10px;` +
                `z-index: 10000;` +
                `background-color: rgba(255,0,0,0.85);` +
                `color: #fff;` +
                `padding: 12px 20px;` +
                `border-radius: 4px;` +
                `font: 1.4rem Roboto, sans-serif;` +
                `box-shadow: 0 2px 6px rgba(0,0,0,0.3);`;

            this.errorContainer = Object.assign(
                document.createElement('div'),
                {
                    textContent: message,
                    className: 'config-error-message',
                }
            );

            this.errorContainer.setAttribute('style', style);
            document.body.appendChild(this.errorContainer);
        } else {
            this.errorContainer.textContent = message;
            this.errorContainer.style.display = 'block';
        }

        setTimeout(() => {
            if (this.errorContainer) {
                this.errorContainer.style.display = 'none';
            }
        }, 5000);
    }

    _createCancelButton() {
        if (this.cancelButton) {
            this.cancelButton.style.display = 'block';
            return;
        }

        const style =
            `position: fixed;` +
            `bottom: 10px;` +
            `right: 10px;` +
            `z-index: 9999;` +
            `line-height: 1.3;` +
            `background-color: rgb(var(--color-background-blue-dark));` +
            `color: rgb(var(--color-text-bright));` +
            `font: 1.6rem Roboto, sans-serif;` +
            `box-sizing: border-box;`;

        this.cancelButton = document.createElement('button');
        this.cancelButton.textContent = 'Cancel';
        this.cancelButton.className = 'cancel-button';
        this.cancelButton.setAttribute('style', style);
        this.cancelButton.addEventListener('click', () => {
            this.userPressed = false;
            this.cancelButton.style.display = 'none';
        });

        document.body.appendChild(this.cancelButton);
    }

    _showCancelButton() {
        if (this.cancelButton) {
            this.cancelButton.style.display = 'block';
        } else {
            this._createCancelButton();
        }
    }

    _hideCancelButton() {
        if (this.cancelButton) {
            this.cancelButton.style.display = 'none';
        }
    }

    _startScrollTrigger() {
        const event = new Event('scroll', { bubbles: true });
        const interval = setInterval(() => {
            this.userPressed
                ? window.dispatchEvent(event)
                : clearInterval(interval);
        }, 100);
    }
}

class ConfigValidator {
    constructor(config) {
        this.config = config;
        this.errors = [];
    }

    validateConfig() {
        this._validatePositiveInteger('options.targetLoadCount');
        this._validateStringArray('remove.containsStrings');
        this._validateStringArray('options.linkedConditions');
        this._validateLinkedConditions();
        this._validateBooleanSettings([
            'remove.uncommented',
            'remove.unliked',
            'remove.text',
            'remove.images',
            'remove.gifs',
            'remove.videos',
            'options.caseSensitive',
            'options.reverseConditions',
            'runOn.home',
            'runOn.social',
            'runOn.profile',
            'runOn.guestHome'
        ]);

        if (this.errors.length) {
            throw new Error(`Anilist Activity Feed Filter: Script disabled due to configuration errors: ${this.errors.join(', ')}`);
        }
    }

    _validateLinkedConditions() {
        const linked = this._flattenArray(this._getConfigValue('options.linkedConditions'));
        const allowed = ['uncommented', 'unliked', 'text', 'images', 'gifs', 'videos', 'containsStrings'];
        if (linked.some(cond => !allowed.includes(cond))) {
            this.errors.push(`options.linkedConditions should only contain: ${allowed.join(', ')}`);
        }
    }

    _validateBooleanSettings(paths) {
        paths.forEach(path => {
            if (typeof this._getConfigValue(path) !== 'boolean') {
                this.errors.push(`${path} should be a boolean`);
            }
        });
    }

    _validateStringArray(path) {
        const value = this._getConfigValue(path);
        if (!Array.isArray(value)) {
            this.errors.push(`${path} should be an array`);
        } else if (!this._flattenArray(value).every(item => typeof item === 'string')) {
            this.errors.push(`${path} should only contain strings`);
        }
    }

    _validatePositiveInteger(path) {
        const value = this._getConfigValue(path);
        if (!Number.isInteger(value) || value <= 0) {
            this.errors.push(`${path} should be a positive non-zero integer`);
        }
    }

    _getConfigValue(path) {
        return path.split('.').reduce((obj, key) => obj[key], this.config);
    }

    _flattenArray(arr) {
        return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this._flattenArray(val) : val), []);
    }
}

const SELECTORS = {
    DIV: {
        BUTTON: 'div.load-more',
        ACTIVITY: 'div.activity-entry',
        REPLIES: 'div.action.replies',
        LIKES: 'div.action.likes',
        MARKDOWN: 'div.markdown'
    },
    SPAN: {
        COUNT: 'span.count',
        YOUTUBE: 'span.youtube',
    },
    ACTIVITY: {
        TEXT: 'activity-text',
        MESSAGE: 'activity-message',
    },
    CLASS: {
        IMAGE: 'img',
        VIDEO: 'video',
    },
};

function initializeApp() {
    const uiHandler = new UIHandler();
    try {
        new ConfigValidator(config).validateConfig();
    } catch (error) {
        uiHandler.displayErrorMessage(error.message);
        return;
    }

    const activityHandler = new ActivityHandler(config);
    const mainApp = new MainApp(activityHandler, uiHandler, config);

    mainApp.initializeObserver();
}

initializeApp();
