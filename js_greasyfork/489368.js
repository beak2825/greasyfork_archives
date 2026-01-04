
// ==UserScript==
// @name         Kanka Atomic Entity Editor (dev)
// @namespace    https://greasyfork.org/en/users/1029479-infinitegeek
// @version      0.9.7-6
// @description  Provides keyboard shortcuts for simple edits from the entity view page on Kanka.
// @author       InfiniteGeek
// @supportURL   Infinite @ https://discord.gg/rhsyZJ4
// @license      MIT
// @match        https://app.kanka.io/w/*/entities/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @keywords     kanka,keybind,keyboard,shortcut,hotkey,tag,location,entity,edit
// @run-at       document-idle
// @grant        none
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @downloadURL https://update.greasyfork.org/scripts/489368/Kanka%20Atomic%20Entity%20Editor%20%28dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489368/Kanka%20Atomic%20Entity%20Editor%20%28dev%29.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 519:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*  ====================================
        You can change these keybinds
    ====================================
*/
const keybinds = {
    LABEL: 'l',
    TAG: 't',
    MOVE: 'm',
    HELP: '?',
};
/*

## Combination of keys - generic mod helper sets cross platform shortcuts
    'mod+s' => command+s / ctrl+s

## Sequence of keys - keys separated by a space will be considered a sequence
    'g i'

## Shift key - handled magically
    '?' instead of 'shift+/'

## Text fields - keyboard events will not fire in textarea, input, or select
    enable on an element with [class='mousetrap']

*/
/*  =======================================================
        You probably shouldn't edit below... probably.
        Here there be `Dragons : Reptile<Mythical>[]`
    ======================================================= */
const mousetrap_1 = __importDefault(__webpack_require__(802));
// import tippy from 'tippy';
const emit_debug = console.log;
const keybind_descriptions = {
    LABEL: 'Apply a tag/label to the entity with my custom modal.',
    TAG: 'Apply a tag/label to the entity with the default modal.',
    MOVE: 'Change the location of the entity, i.e. move it.',
    HELP: 'Show this help dialog.',
};
// this is a jQuery 'plugin' to make an element blink
$.prototype.blink = function (times, duration) {
    for (let i = 0; i < times; i++) {
        this.animate({ opacity: 0 }, duration)
            .animate({ opacity: 1 }, duration);
    }
    return this;
};
/**
 * Extract metadata from the classes on the <body>
 */
function parseBodyClasses(body) {
    const classes = Array.from(body.classList);
    const entity = { id: '', entityType: 'default', type: '' };
    const tags = [];
    const regex = /^kanka-(\w+)-(\w+)$/;
    let tempTag = null;
    classes.forEach(className => {
        const match = className.match(regex);
        if (match) {
            const [, key, value] = match;
            const isValueNumeric = !isNaN(Number(value));
            switch (key) {
                case 'entity':
                    entity[isValueNumeric ? 'id' : 'entityType'] = value;
                    break;
                case 'type':
                    entity.type = value;
                    break;
                case 'tag':
                    if (isValueNumeric) {
                        tempTag = value;
                    }
                    else {
                        tags.push({
                            id: tempTag,
                            entityType: value,
                        });
                        tempTag = null;
                    }
                    break;
                default:
                    emit_debug("what's this?", match);
                    break;
            }
        }
    });
    return { entity, tags };
}
const route = window.location.pathname;
// using the edit button is necessary to get the typedID and the plural :\
const editButtonLink = (_a = $('div#entity-submenu a[href$="edit"]').attr('href')) !== null && _a !== void 0 ? _a : $('div.header-buttons a[href$="edit"]').attr('href');
/**
 * This contains "all" the Kanka-specific data
 */
const kanka = {
    rootUri: 'https://app.kanka.io',
    getUri: (...segments) => [kanka.rootUri, 'w', kanka.campaignID, ...segments].join('/'),
    /**
     * Ye olde CSRF token
     */
    csrfToken: (_b = document.head.querySelector('meta[name="csrf-token"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content'),
    route,
    campaignID: ((_c = route.match(/w\/(\d+)\//)) !== null && _c !== void 0 ? _c : [null, '0'])[1],
    /**
     *  this is the plural, not values from EntityType
     */
    entityType: ((_d = editButtonLink === null || editButtonLink === void 0 ? void 0 : editButtonLink.match(/\/(\w+)\/\d+\/edit$/)) !== null && _d !== void 0 ? _d : [null, '0'])[1],
    /**
     *  this is the 'larger' ID: entities/__[5328807]__ === characters/1357612
     */
    entityID: ((_e = route.match(/w\/\d+\/entities\/(\d+)/)) !== null && _e !== void 0 ? _e : [null, '0'])[1],
    /**
     * this is the 'smaller' ID: entities/5328807 === characters/__[1357612]__
     */
    typedID: ((_f = editButtonLink === null || editButtonLink === void 0 ? void 0 : editButtonLink.match(/\/(\d+)\/edit$/)) !== null && _f !== void 0 ? _f : [null, '0'])[1],
    meta: parseBodyClasses(document.body),
    /**
     * this encapsulates the definitions from the system
     * - some entities have a location, some don't
     * - some entities have a link in the header, some use the sidebar
     * - some entities can have multiple locations, some can't
     */
    entityTypeHasLocation: ({
        default: {},
        character: { headerLink: true },
        location: { headerLink: true },
        map: { headerLink: true },
        organisation: { sidebarLink: true },
        family: { headerLink: true },
        creature: { sidebarLink: true, multiple: true },
        race: { sidebarLink: true, multiple: true },
        event: { sidebarLink: true },
        journal: { sidebarLink: true },
        item: { sidebarLink: true },
        tag: {},
        note: {},
        quest: {},
    }),
};
const identifiers = {
    Sidebar: {
        Class: '.entity-sidebar',
        ProfileClass: '.sidebar-section-profile',
        ProfileElementsID: '#sidebar-profile-elements',
    },
};
const templates = {
    SIDEBAR_PROFILE: () => `
<div class="sidebar-section-box ${identifiers.Sidebar.ProfileClass.slice(1)} overflow-hidden flex flex-col gap-2">
    <div class="sidebar-section-title cursor-pointer text-lg user-select border-b element-toggle" data-animate="collapse" data-target="#sidebar-profile-elements">
        <i class="fa-solid fa-chevron-up icon-show"></i>
        <i class="fa-solid fa-chevron-down icon-hide"></i>
        Profile
    </div>

    <div class="sidebar-elements grid overflow-hidden" id="${identifiers.Sidebar.ProfileElementsID.slice(1)}">
    </div>
</div>`.trim(),
    SELECT_ELEMENT: (dataUrl, placeholder) => `
<select class="form-tags select2"
    style="width: 100%"
    data-url="${dataUrl}"
    data-allow-new="false"
    data-allow-clear="true"
    data-placeholder="${placeholder}"
    data-dropdown-parent="#app"
</select>`.trim(),
    SELECT_ITEM: (text, image) => {
        if (!!image) {
            return $(`
<span class="flex gap-2 items-center text-left">
    <img src="${image}" class="rounded-full flex-none w-6 h-6" />
    <span class="grow">${text}</span>
</span>`.trim());
        }
        return $(`<span>${text}</span>`);
    },
    TAG_SELECT: () => templates.SELECT_ELEMENT(kanka.getUri('search/tags'), 'Apply Tag'),
    TAG_URL: (tagID) => kanka.getUri('tags', tagID),
    TAG_LINK: (tagID, text) => `
<a href="${templates.TAG_URL(tagID)}" title="Refresh to get full tooltip functionality">
    <span class="badge color-tag rounded-sm px-2 py-1">${text}</span>
</a>`.trim(),
    LOCATION_SELECT: () => templates.SELECT_ELEMENT(kanka.getUri('search/locations'), 'Move to...'),
    LOCATION_URL: (locationID) => kanka.getUri('entities', locationID),
    LOCATION_LINK: (locationID, text) => `<a class="name" href="${templates.LOCATION_URL(locationID)}" title="Refresh to get full tooltip functionality">${text}</a>`,
    // TODO - get popper/tippy working to enable preview tooltips 
    // data-toggle="tooltip-ajax" data-id="${locationID}" data-url="${templates.LOCATION_URL(locationID)}/tooltip">
    HELP: () => `<table style="background-color: #ccc4; border: 1px solid silver; border-radius: 8px; width: 100%;">
    <colgroup><col width="20%"><col><col width="100%"></colgroup>`
        + Object.entries(keybinds)
            .map(([key, value], index) => `
        <tr>
        <td><div style="margin: 10px">${key}</span></td>
        <td><kbd style="font-size: x-large">${value}</kbd></td>
        <td><small>${keybind_descriptions[key]}</small></td>
        </tr>`)
            .join('\n')
        + "</table>",
};
/// making my own container for the select to avoid any interference
function createFloatingElement(template, styles = {}) {
    const divID = 'infinite-select2';
    let floatingDiv = document.getElementById(divID)
        || document.createElement('div');
    if (!floatingDiv.id) {
        floatingDiv.id = divID;
        // Add styles to make it float and position it as needed
        floatingDiv.style.position = 'absolute';
        floatingDiv.style.top = '5%';
        floatingDiv.style.left = '41%';
        floatingDiv.style.minWidth = '200px';
        floatingDiv.style.width = '18%';
        floatingDiv.style.maxWidth = '400px';
        Object.assign(floatingDiv.style, styles);
    }
    floatingDiv.innerHTML = '';
    $(template()).appendTo(floatingDiv);
    document.body.appendChild(floatingDiv);
    return floatingDiv;
}
function createPostParams() {
    const params = new URLSearchParams();
    params.append('_token', kanka.csrfToken);
    params.append('datagrid-action', 'batch');
    // this needs the plural
    params.append('entity', kanka.entityType);
    params.append('mode', 'table');
    // typedID is different from entityID
    params.append('models', kanka.typedID);
    params.append('undefined', '');
    return params;
}
async function fetch_success(response) {
    var _a;
    emit_debug('Success:', response);
    return { ok: response.ok, document: (_a = $.parseHTML(await response.text())) !== null && _a !== void 0 ? _a : [] };
}
function post(url, body) {
    return fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    })
        .then(fetch_success)
        .catch((error) => {
        console.error('Error:', error);
        return { ok: false, document: [], error };
    });
}
async function edit(body) {
    // wat da faq
    emit_debug({ edit_data: [...body.entries()] });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', kanka.getUri(kanka.entityType, kanka.typedID), false);
    xhr.setRequestHeader('x-csrf-token', kanka.csrfToken);
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.send(body);
    emit_debug({ req: xhr });
    return {
        ok: xhr.status == 200,
        document: $.parseHTML(xhr.responseText),
    };
    return fetch(kanka.getUri(kanka.entityType, kanka.typedID), {
        method: 'POST',
        headers: {
            "x-csrf-token": kanka.csrfToken,
            "x-requested-with": "XMLHttpRequest"
        },
        redirect: 'follow',
        body,
    })
        .then(fetch_success)
        .catch((error) => {
        console.error('Error:', error);
        return { ok: false, document: [], error };
    });
}
/**
 * Reacts when Location is selected via floaty dropdown. Sets the Location of the entity.
 *
 * @param event - The Select2 event object.
 * @returns A promise that resolves to a boolean indicating whether the processing was successful.
 */
async function processLocationSelection(event) {
    const { id: locationID, text } = event.params.data;
    const thisEntityTypeHasLocation = kanka.entityTypeHasLocation[kanka.meta.entity.entityType];
    if (thisEntityTypeHasLocation.multiple) {
        alert('This entity type can have multiple locations. This feature is not yet implemented.');
        /**
         * For the curious, it's because the edit endpoint needs:
         * - the list of typed IDs (which we don't have)
         * - some weird voodoo with XHR that I can't replicate (I get a 405 Method Not Allowed)
         */
        return false;
        const data = new FormData();
        data.append('_token', kanka.csrfToken);
        // this is kinda BS, but it's the cleanest way to get 
        // - the list of typed IDs
        // - the other stuff
        const editable = await fetch(kanka.getUri('creatures', kanka.typedID, 'edit'), {
            method: 'GET',
            headers: { 'Content-Type': 'text/html' }
        })
            .then(fetch_success);
        if (!editable.ok) {
            emit_debug('Error:', editable);
            return false;
        }
        $(editable.document)
            .find('form#entity-form')
            .serializeArray()
            // .filter(kvp => {
            //     if (kvp.value == '') return false;
            //     if (kvp.value == '0') return false;
            //     if (kvp.value == 'inherit') return false;
            // })
            .forEach(kvp => data.append(kvp.name, kvp.value));
        data.append('locations[]', locationID);
        const response = await edit(data);
        if (response.ok) {
            const doc = $(response.document);
            emit_debug({
                header: doc.find('.entity-header'),
                sidebar: doc.find('#sidebar-profile-elements'),
            });
        }
        return response.ok;
    }
    const params = createPostParams();
    params.append('location_id', locationID);
    const response = await post(kanka.getUri('bulk/process'), params);
    if (!response.ok) {
        emit_debug('Error:', response);
        return false;
    }
    const sub = (selector) => {
        $(selector).replaceWith($(response.document).find(selector));
        return $(selector);
    };
    const ensure = (parent, selector, defaultValue) => {
        if ($(selector).length == 0) {
            emit_debug(`adding ${selector} to ${parent}`);
            parent.append(defaultValue);
        }
    };
    if (thisEntityTypeHasLocation.headerLink) {
        // TODO [2024-03-06] - reduce the replacement scope to keep more functionality
        sub('.entity-header')
            .find('.entity-header-sub')
            .blink(3, 125);
    }
    if (thisEntityTypeHasLocation.sidebarLink) {
        const sidebar = $(identifiers.Sidebar.Class);
        // make sure the sidebar has the relevant childrens
        ensure(sidebar, identifiers.Sidebar.ProfileClass, templates.SIDEBAR_PROFILE());
        // an entity might have the sidebar, but not the Profile block
        ensure(sidebar, identifiers.Sidebar.ProfileElementsID, `<div id="${identifiers.Sidebar.ProfileElementsID.slice(1)}"></div>`);
        // and the Profile block may or may not have the Location
        ensure(sidebar.find(identifiers.Sidebar.ProfileElementsID), '.profile-location', `<div class="profile-location"></div>`);
        sub(identifiers.Sidebar.ProfileElementsID)
            .find('.profile-location')
            .blink(3, 125);
    }
    return true;
}
/**
 * Reacts when a Tag is selected via floaty dropdown. Toggles the presence of the tag on the entity.
 *
 * @param event - The Select2 event object.
 * @returns A promise that resolves to a boolean indicating whether the processing was successful.
 */
async function processTagSelection(event) {
    const { id: tagID, text } = event.params.data;
    const params = createPostParams();
    params.append('save-tags', '1');
    params.append('tags[]', tagID);
    const header = $('.entity-header .entity-header-text');
    if (header.has('.entity-tags').length == 0) {
        $('<div class="entity-tags entity-header-line text-xs flex flex-wrap gap-2"></div>')
            .insertBefore(header.find('.header-buttons'));
    }
    const hasTag = !!kanka.meta.tags.find(tag => tag.id == tagID);
    params.append('bulk-tagging', hasTag ? 'remove' : 'add');
    const result = await post(`/w/${kanka.campaignID}/bulk/process`, params);
    const tagBar = header.find('.entity-tags');
    if (result.ok) {
        (hasTag
            ? tagBar.children().remove(`[href="${templates.TAG_URL(tagID)}"]`)
            : tagBar.append($(templates.TAG_LINK(tagID, text))))
            .blink(3, 125);
    }
    return result.ok;
    /*
        // was doing it using the simple 'add entity under tag' API
        // but why not consolidate?
        params.append('entities[]', kanka.meta.entity.id);
        params.append('tag_id', tagID);
    
        post(kanka.getUri('tags', tagID, 'entity-add'), params)
            .then((ok) => ok && tagBar.append($(templates.TAG_LINK(tagID, text))));
    */
}
function initSelector(template, processSelection) {
    const floatingDiv = createFloatingElement(template);
    $(floatingDiv).find('select.select2')
        .each(function () {
        const me = $(this);
        me.select2({
            tags: false,
            placeholder: me.data('placeholder'),
            allowClear: me.data('allowClear') || true,
            language: me.data('language'),
            minimumInputLength: 0,
            dropdownParent: $(me.data('dropdownParent')) || '',
            width: '100%',
            sorter: (data) => {
                const term = $('input.select2-search__field').val().toLowerCase();
                return data.sort(byMatchiness(term));
            },
            ajax: {
                delay: 500, // quiet ms
                url: me.data('url'),
                dataType: 'json',
                data: (params) => { var _a; return ({ q: (_a = params.term) === null || _a === void 0 ? void 0 : _a.trim() }); },
                processResults: (data) => ({ results: data }),
                error: function (jqXHR, textStatus, errorThrown) {
                    if (textStatus === 'abort') {
                        // it does this for the empty field, I think?
                        return;
                    }
                    if (jqXHR.status === 503) {
                        window.showToast(jqXHR.responseJSON.message, 'error');
                    }
                    emit_debug('error', jqXHR, textStatus, errorThrown);
                    return { results: [] };
                },
                cache: true
            },
            templateResult: (item) => templates.SELECT_ITEM(item.text, item.image),
        })
            .on('select2:select', processSelection)
            .on('select2:close', () => {
            setTimeout(() => { $(floatingDiv).remove(); }, 100);
        });
        setTimeout(() => { me.select2('open'); }, 0);
    });
}
function byMatchiness(term) {
    return (a, b) => {
        const textA = a.text.toLowerCase();
        const textB = b.text.toLowerCase();
        // Assign a score based on how well the option matches the search term
        const scoreA = textA === term ? 3 : textA.startsWith(term) ? 2 : textA.includes(term) ? 1 : 0;
        const scoreB = textB === term ? 3 : textB.startsWith(term) ? 2 : textB.includes(term) ? 1 : 0;
        // Sort by score. If the scores are equal, sort alphabetically
        return scoreB - scoreA || textA.localeCompare(textB);
    };
}
/**
 * Map the keybinds to the handlers
 */
const handlers = {
    [keybinds.LABEL]: function (evt, combo) {
        initSelector(templates.TAG_SELECT, processTagSelection);
    },
    [keybinds.TAG]: function (evt, combo) {
        var _a, _b;
        // it's built-in now :\
        (_b = (((_a = document.querySelector('span[role=button].entity-tags-icon')) !== null && _a !== void 0 ? _a : document.querySelector('span[role=button].entity-privacy-icon.text-xl')))) === null || _b === void 0 ? void 0 : _b.click();
    },
    [keybinds.MOVE]: function (evt, combo) {
        initSelector(templates.LOCATION_SELECT, processLocationSelection);
    },
    [keybinds.HELP]: function (evt, combo) {
        const modal = $(createFloatingElement(templates.HELP, {
            width: '25%',
            maxWidth: '600px',
        }));
        $(document).on('click', () => modal.remove());
    },
};
(function () {
    if (!document.body.className.includes('kanka-entity-')) {
        return;
    }
    for (const key in handlers) {
        mousetrap_1.default.bind(key, handlers[key]);
    }
    emit_debug({ kanka });
})();


/***/ }),

/***/ 802:
/***/ ((module) => {

module.exports = Mousetrap;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(519);
/******/ 	
/******/ })()
;