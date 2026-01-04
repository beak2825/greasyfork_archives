// ==UserScript==
// github-stars-tagger
// 需要在页面https://github.com/stars中管理标签, 所以在导航栏上增加了 /stars 的链接
// 代码来自: https://github.com/artisologic/github-stars-tagger
// 存储改为了 localStorage
//
// @name         github-stars-tagger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为github的star增加标签管理功能
// @author       You
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34623/github-stars-tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/34623/github-stars-tagger.meta.js
// ==/UserScript==

// libs/EventEmitter.js
((window) => {

    'use strict';


    /**
     * @class EventEmitter
     */
    class EventEmitter {

        constructor() {
            this._listeners = [];
        }

        on(eventName, callback) {
            this._listeners.push({
                name: eventName,
                callback: callback
            });

            return this;
        }

        off(eventName, callback) {
            this._listeners.forEach((listener, index) => {
                if (listener.name === eventName && listener.callback === callback) {
                    this._listeners.splice(index, 1);
                }
            });

            return this;
        }

        emit(eventName, data) {
            this._listeners
                .filter(listener => listener.name === eventName)
                .forEach(listener => listener.callback(data, this, eventName));

            return this;
        }

    }


    window.GSM = window.GSM || {};
    GSM.EventEmitter = EventEmitter;
})(window);

// libs/Model.js
((window) => {

    'use strict';


    /**
     * @class Model
     */
    class Model extends GSM.EventEmitter {

        constructor(data) {
            super();

            this.data = data;
        }

    }


    window.GSM = window.GSM || {};
    GSM.Model = Model;
})(window);

// libs/TagsStore.js
((window) => {

    'use strict';

    const KEY = 'github-stars-tagger';

    /**
     * @class TagsStore
     */
    class TagsStore {

        constructor() {

        }

        get(key) {
            // console.log('get', key);
            const promise = new Promise((resolve, reject) => {
                var items = localStorage.getItem(KEY);
                var data = {};
                if (items) {
                    data = JSON.parse(items);
                }
                if (key === undefined) {
                    resolve(data);
                } else if (typeof data[key] !== 'undefined') {
                    resolve(data[key]);
                } else {
                    reject('TagsStore.get('+key+')获取失败');
                }
            });

            promise.catch(error => {
                GSM.utils.track('Sync', 'get', 'error', error);
            });

            return promise;
        }

        set(key, value) {
            // console.log('set', key, value);
            var items = localStorage.getItem(KEY);
            var data = {};
            if (items) {
                data = JSON.parse(items);
            }
            data[key] = value;
            const promise = new Promise((resolve, reject) => {
                if (localStorage.setItem(KEY, JSON.stringify(data))) {
                    resolve();
                } else {
                    reject();
                }
            });

            promise.catch(error => {
                GSM.utils.track('Sync', 'set', 'error', error);
            });

            return promise;
        }

        remove(key) {
            // console.log('remove', key);
            const promise = new Promise((resolve, reject) => {
                if (localStorage.setItem(key, null)) {
                    resolve();
                } else {
                    reject('remove error');
                }
            });

            promise.catch(error => {
                GSM.utils.track('Sync', 'remove', 'error', error);
            });

            return promise;
        }

        clear() {
            // console.log('clear');
            const promise = new Promise((resolve, reject) => {
            });

            promise.catch(error => {
                GSM.utils.track('Sync', 'clear', 'error', error);
            });

            return promise;
        }

    }


    window.GSM = window.GSM || {};
    GSM.TagsStore = TagsStore;
})(window);

// libs/utils.js
((window) => {

    'use strict';


    const utils = {

        insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },

        unique(array) {
            const hash = {};
            const res = [];

            for (let i = 0; i < array.length; i++) {
                const item = array[i];

                if (!hash[item]) {
                    hash[item] = true;
                    res.push(item);
                }
            }

            return res;
        },

        message(command, data) {
            // chrome.runtime.sendMessage({ command, data });
        },

        track(category, action, label, value) {
            utils.message('trackEvent', { category, action, label, value });
        }

    };


    window.GSM = window.GSM || {};
    GSM.utils = utils;
})(window);

// libs/View.js
((window) => {

    'use strict';


    /**
     * @class View
     */
    class View extends GSM.EventEmitter {

        constructor() {
            super();

            this.refs = {
                root: this.createRootElement()
            };

            this.handlers = {};
        }

        static getRootClass() {
            // override this method
            return '';
        }

        createRootElement() {
            const rootElem = document.createElement('div');
            rootElem.classList.add(this.constructor.getRootClass());

            return rootElem;
        }

        render() {
            // override this method
        }

        getElement(selector) {
            if (typeof selector === 'undefined') {
                return this.refs.root;
            } else {
                return this.refs.root.querySelector(selector);
            }
        }

        injectInto(parentElem) {
            parentElem.appendChild(this.getElement());
        }

        injectAfter(siblingElem) {
            GSM.utils.insertAfter(this.getElement(), siblingElem);
        }
    }


    window.GSM = window.GSM || {};
    GSM.View = View;
})(window);

// models/Tags.js
((window) => {

    'use strict';


    /**
     * @class Tags
     */
    class Tags extends GSM.Model {

        constructor(data) {
            super(data);
        }

        getTagsForRepo(repoId) {
            return this.data[repoId] || [];
        }

        setTagsForRepo(repoId, unserializedTags) {
            const serializedTags = unserializedTags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');

            const hasNoTags = serializedTags.length === 0;
            const repoChangeEventName = 'change:' + repoId;

            if (hasNoTags) {
                delete this.data[repoId];
                const changeData = { key: repoId, deleted: true };
                this.emit('change', changeData);
                this.emit(repoChangeEventName, changeData);
            } else {
                const newTags = GSM.utils.unique(serializedTags);
                const changeData = { key: repoId, value: newTags };
                this.data[repoId] = newTags;
                this.emit('change', changeData);
                this.emit(repoChangeEventName, changeData);
            }
        }

        getDeserializedTagsForRepo(repoId) {
            return this.getTagsForRepo(repoId).join(', ');
        }

        byTag() {
            const pivotedData = {};

            for (const repoId in this.data) {
                const tags = this.getTagsForRepo(repoId);
                tags.forEach(tag => {
                    if (!(tag in pivotedData)) { pivotedData[tag] = []; }
                    pivotedData[tag].push(repoId);
                });
            }

            return pivotedData;
        }

        byTagSortedByUse() {
            const modelByTag = this.byTag();

            return Object.keys(modelByTag)
                .map(tag => createTagObject(tag))
                .sort(byMostUsed);


            function createTagObject(tag) {
                return {
                    name: tag,
                    repos: modelByTag[tag]
                };
            }

            function byMostUsed(tagObject1, tagObject2) {
                const diff = tagObject2.repos.length - tagObject1.repos.length;
                // default to alphanumerical sort
                if (diff === 0) { return tagObject2.name < tagObject1.name ? 1 : -1; }
                return diff;
            }
        }

    }


    window.GSM = window.GSM || {};
    GSM.Tags = Tags;
})(window);

// views/TagLineView.js
((window) => {

    'use strict';


    /**
     * @class TagLineView
     */
    class TagLineView extends GSM.View {

        constructor(model, repoId) {
            super();

            this.model = model;
            this.repoId = repoId;
        }

        static getRootClass() {
            return 'GsmTagLine';
        }

        createRootElement() {
            const rootElem = document.createElement('p');
            rootElem.classList.add(TagLineView.getRootClass(), 'f6', 'text-gray', 'mt-2');

            return rootElem;
        }

        render() {
            if (this.rendered) {
                this.removeEvents();
            }

            const tags = this.model.getDeserializedTagsForRepo(this.repoId);
            const noTagsModifierClass = 'GsmTagLine--noTags';

            this.getElement().classList.toggle(noTagsModifierClass, !tags);
            this.getElement().innerHTML = `
                <svg class="octicon octicon-tag GsmTagLine-icon" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path>
                </svg>
                <span class="GsmTagLine-tags">${ tags }</span>
                <span class="GsmTagLine-separator"> — </span>
                <button class="GsmTagLine-editButton" type="button" title="Click to edit">Edit</button>
                <input class="GsmTagLine-tagsInput form-control input-sm" type="text" value="${ tags }" placeholder="Enter comma-separated tags" spellcheck="false" autocomplete="off" />
            `;

            this.refs.editButton = this.getElement('.GsmTagLine-editButton');
            this.refs.tagsInput = this.getElement('.GsmTagLine-tagsInput');

            this.addEvents();
            this.rendered = true;
        }

        addEvents() {
            this.handlers = {
                modelChange: (changeData, target, eventName) => this.onModelChanged(changeData, target, eventName),
                editButtonClick: event => this.onEditButtonClicked(event),
                tagsInputKeydown: event => this.onTagsInputKeydowned(event),
                tagsInputBlur: event => this.onTagsInputBlurred(event)
            };

            this.model.on('change:' + this.repoId, this.handlers.modelChange);
            this.refs.editButton.addEventListener('click', this.handlers.editButtonClick);
            this.refs.tagsInput.addEventListener('keydown', this.handlers.tagsInputKeydown);
            this.refs.tagsInput.addEventListener('blur', this.handlers.tagsInputBlur);
        }

        removeEvents() {
            this.model.off('change:' + this.repoId, this.handlers.modelChange);
            this.refs.editButton.removeEventListener('click', this.handlers.editButtonClick);
            this.refs.tagsInput.removeEventListener('keydown', this.handlers.tagsInputKeydown);
            this.refs.tagsInput.removeEventListener('blur', this.handlers.tagsInputBlur);

            this.handlers = {};
        }

        onModelChanged() {
            this.render();
        }

        onEditButtonClicked() {
            this.enterEditMode();
            GSM.utils.track('TagLine', 'edit');
        }

        onTagsInputKeydowned(event) {
            const ENTER = 13;
            const ESCAPE = 27;

            if (event.keyCode === ESCAPE) {
                this.exitEditMode();
                GSM.utils.track('TagLine', 'escape');
            } else if (event.keyCode === ENTER) {
                const newTags = event.currentTarget.value;
                this.exitEditMode(newTags);
                GSM.utils.track('TagLine', 'save');
            }
        }

        onTagsInputBlurred() {
            this.exitEditMode();
            GSM.utils.track('TagLine', 'blur');
        }

        enterEditMode() {
            this.getElement().classList.add('-is-editing');

            // help entering next tag
            if (this.refs.tagsInput.value !== '') { this.refs.tagsInput.value += ', '; }

            // focus at the end of input
            this.refs.tagsInput.focus();
            const length = this.refs.tagsInput.value.length;
            this.refs.tagsInput.setSelectionRange(length, length);
        }

        exitEditMode(newTags) {
            if (typeof newTags === 'undefined') {
                this.render();
            } else {
                this.model.setTagsForRepo(this.repoId, newTags);
            }

            this.getElement().classList.remove('-is-editing');
        }

    }


    window.GSM = window.GSM || {};
    GSM.TagLineView = TagLineView;
})(window);

// views/TagSidebarView.js
((window) => {

    'use strict';


    /**
     * @class TagSidebarView
     */
    class TagSidebarView extends GSM.View {

        constructor(model) {
            super();

            this.model = model;
        }

        static getRootClass() {
            return 'GsmTagSidebar';
        }

        render() {
            if (this.rendered) {
                this.removeEvents();
            }

            const sortedTags = this.model.byTagSortedByUse();
            const tagsCount = sortedTags.length;
            const tagsCountIndicator = tagsCount ? `<span class="count">${ tagsCount }</span>` : '';

            this.getElement().innerHTML = `
                <h3 class="h4 mb-2">
                    Filter by tags
                    ${ tagsCountIndicator }
                </h3>
                <ul class="filter-list small GsmTagSidebar-tagList">
                    ${ this.renderTags(sortedTags) }
                </ul>
                <hr />
            `;

            this.addEvents();
            this.rendered = true;
        }

        renderTags(sortedTags) {
            if (sortedTags.length === 0) {
                return `<span class="filter-item GsmTagSidebar-noTagsMessage">No tags</span>`;
            }
            return sortedTags.map(tagModel => this.renderTag(tagModel)).join('');
        }

        renderTag(tagModel) {
            return `
                <li>
                    <label class="GsmTagSidebar-label">
                        <span class="filter-item">
                            ${ tagModel.name }
                            <span class="count">${ tagModel.repos.length }</span>
                        </span>
                        <input class="GsmTagSidebar-checkbox" type="checkbox" />
                        <ul class="GsmRepoList">
                            ${ this.renderTagRepos(tagModel) }
                        </ul>
                    </label>
                </li>
            `;
        }

        renderTagRepos(tagModel) {
            return tagModel.repos.map(tagModel => this.renderTagRepo(tagModel)).join('');
        }

        renderTagRepo(repoId) {
            return `
                <li class="GsmRepoList-item css-truncate">
                    <a class="css-truncate-target" href="/${ repoId }">${ repoId }</a>
                </li>
            `;
        }

        addEvents() {
            this.handlers = {
                modelChange: (changeData, target, eventName) => this.onModelChanged(changeData, target, eventName),
                click: (event) => this.onClicked(event)
            };

            this.model.on('change', this.handlers.modelChange);
            this.getElement().addEventListener('click', this.handlers.click, false);
        }

        removeEvents() {
            this.model.off('change', this.handlers.modelChange);
            this.getElement().removeEventListener('click', this.handlers.click, false);

            this.handlers = {};
        }

        onModelChanged() {
            this.render();
        }

        onClicked(event) {
            if (event.target && event.target.classList.contains('filter-item')) {
                GSM.utils.track('TagSidebar', 'click', 'tag');
            }
        }

    }


    window.GSM = window.GSM || {};
    GSM.TagSidebarView = TagSidebarView;
})(window);

githubStarsTaggerInit();

// main.js

function githubStarsTaggerInit() {
    'use strict';

    addStarPageBtn();
    const tagsStore = new GSM.TagsStore();
    if (isStarPage(location.href)) {
        addStyle();
        tagsStore.get()
            .then(createModel)
            .then(initViews)
            .then(initSync);
    }

    function addStarPageBtn() {
        var navs = document.querySelector('ul.flex-items-center.text-bold');
        if (navs) {
            navs.innerHTML += '<li><a href="/stars" class="js-selected-navigation-item HeaderNavlink px-2">Stars</a></li>';
        }
    }

    function isStarPage(path) {
        return path === '/stars' || path === '/stars/' || Boolean(path.match(/\/stars/));
    }

    function createModel(data) {
        return new GSM.Tags(data);
    }

    function initViews(tagsModel) {
        initTagLines(tagsModel);
        initTagSidebar(tagsModel);

        return tagsModel;


        function initTagLines(model) {
            const repoItemSelector = '.repo-list > li';

            // on page load
            addTagLines();

            // when sorting, filtering, paginating was used
            addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


            function onAjaxPageRefreshed(newPath) {
                removeTagLines();
                const shouldAddTagLines = isCurrentPathSupported(newPath);
                if (shouldAddTagLines) {
                    addTagLines();
                }
            }

            function addTagLines() {
                const starredRepoElems = document.querySelectorAll(repoItemSelector);
                Array.from(starredRepoElems).forEach(starredRepoElem => addTagLine(starredRepoElem));

                function addTagLine(starredRepoElem) {
                    const repoId = starredRepoElem.querySelector('h3 a').getAttribute('href').substring(1);
                    const view = new GSM.TagLineView(model, repoId);
                    view.render();
                    view.injectInto(starredRepoElem);
                }
            }

            function removeTagLines() {
                const starredRepoElems = document.querySelectorAll(repoItemSelector);
                Array.from(starredRepoElems).forEach(starredRepoElem => removeTagLine(starredRepoElem));

                function removeTagLine(starredRepoElem) {
                    const oldTagLineElem = starredRepoElem.querySelector('.' + GSM.TagLineView.getRootClass());
                    if (oldTagLineElem) { oldTagLineElem.remove(); }
                }
            }

            function isCurrentPathSupported(path) {
                return path === '/stars' || path === '/stars/' || Boolean(path.match(/\/stars\/?\?.+/));
            }
        }

        function initTagSidebar(model) {
            const ajaxContentElem = document.querySelector('.explore-pjax-container');

            // on page load
            addSidebar();

            // when sorting, filtering, paginating was used
            addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


            function onAjaxPageRefreshed(newPath) {
                removeSidebar();
                const shouldAddSidebar = isCurrentPathSupported(newPath);
                if (shouldAddSidebar) {
                    addSidebar();
                }
            }

            function addSidebar() {
                const firstSidebarSeparatorElem = ajaxContentElem.querySelector('.col-md-3.float-md-left.mt-3 hr:first-of-type');
                const view = new GSM.TagSidebarView(model);
                view.render();
                view.injectAfter(firstSidebarSeparatorElem);
            }

            function removeSidebar() {
                const oldTagSidebarElem = ajaxContentElem.querySelector('.' + GSM.TagSidebarView.getRootClass());
                if (oldTagSidebarElem) { oldTagSidebarElem.remove(); }
            }
        }

        function addAjaxPageRefreshEventListener(callback) {
            const ajaxContentElem = document.querySelector('.explore-pjax-container');

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0) {
                        callback(document.location.pathname);
                    }
                });
            });

            const config = { childList: true };
            observer.observe(ajaxContentElem, config);
        }

    }

    function initSync(tagsModel) {
        tagsModel.on('change', onModelChanged);


        function onModelChanged(changeData) {
            if (changeData.deleted) {
                tagsStore.remove(changeData.key);
            } else {
                tagsStore.set(changeData.key, changeData.value);
            }
        }
    }

    function addStyle() {
        var cssText = '<style>.GsmTagLine{position:relative}.GsmTagLine-icon{color:currentColor}.GsmTagLine--noTags .GsmTagLine-icon{opacity:.35}.GsmTagLine.-is-editing .GsmTagLine-icon{position:absolute;top:7px;left:7px}.GsmTagLine.-is-editing .GsmTagLine-tags{display:none}.GsmTagLine--noTags .GsmTagLine-tags{opacity:.35}.GsmTagLine-separator{opacity:.35}.GsmTagLine.-is-editing .GsmTagLine-separator{display:none}.GsmTagLine-editButton{padding:.5em;position:relative;margin:-0.5em;background-color:transparent;border:0;opacity:.35;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.GsmTagLine-editButton:hover,.GsmTagLine-editButton:focus{opacity:1}.GsmTagLine.-is-editing .GsmTagLine-editButton{display:none}.GsmTagLine-tagsInput{display:none;width:400px;padding-left:25px !important}.GsmTagLine.-is-editing .GsmTagLine-tagsInput{display:inline-block} .GsmTagSidebar h3 .count{float:right;margin-right:10px}.GsmTagSidebar-noTagsMessage{margin-bottom:15px !important}.GsmTagSidebar-noTagsMessage:hover{background-color:transparent !important;cursor:auto}.GsmTagSidebar-tagList{max-height:19.2em;overflow:auto}.GsmTagSidebar-tagList>li:last-child{margin-bottom:15px}.GsmTagSidebar-tagList+hr{margin-top:0}.GsmTagSidebar-label{font-size:inherit;font-weight:inherit}.GsmTagSidebar-checkbox{display:none}.GsmRepoList{display:none;list-style:none}.GsmRepoList-item{display:block;padding:4px 10px;margin:0 0 2px;font-size:12px}.GsmRepoList-item a{display:block;max-width:210px !important}.GsmTagSidebar-checkbox:checked+.GsmRepoList{display:block}</style>';
        document.body.innerHTML += cssText;
    }
}
