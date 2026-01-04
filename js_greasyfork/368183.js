// ==UserScript==
// @name            Greasy Fork tweaks
// @namespace       almaceleste
// @version         0.6.3
// @description     various tweaks for greasyfork.org site for enhanced usability and additional features
// @description:ru  различные твики для сайта greasyfork.org для повышения удобства использования и дополнительных функций
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @icon64          https://greasyfork.org/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           https://greasyfork.org/*/users/*
// @match           https://greasyfork.org/*/scripts*
// @downloadURL https://update.greasyfork.org/scripts/368183/Greasy%20Fork%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/368183/Greasy%20Fork%20tweaks.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const route = {};
route.userpage = /^\/.*\/users\/.*/;
route.scriptpage = /^\/.*\/scripts\/[^\/]*$/; //(?!\/)*/; //.*/;
route.searchpage = /^\/.*\/scripts$/;

const maincontainer = 'body > .width-constraint';
const listitem = '.script-list > li';
const separator = '.name-description-separator';
const scriptversion = 'data-script-version';
const scriptrating = 'dd.script-list-ratings';
const scriptstats = '.inline-script-stats';
const dailyinstalls = '.script-list-daily-installs';
const totalinstalls = '.script-list-total-installs';
const createddate = '.script-list-created-date';
const updateddate = '.script-list-updated-date';

const scripturl = 'article h2 a';

const userprofile = {};
userprofile.path = '#user-profile';
userprofile.header = 'body > div.width-constraint > section:first-of-type > h2:first-of-type';

const sections = {};
sections.controlpanel = '#control-panel';
sections.discussions = '#user-discussions-on-scripts-written';
sections.scriptsets = 'section:has(h3:contains("Script Sets"))';

const configId = 'greasyforktweaksCfg';
const iconUrl = GM_info.script.icon64;
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

let css = GM_getResourceText('css');
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
const iframecss = `
    height: 590px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        width: {
            section: ['', 'All pages options'],
            label: 'page width',
            labelPos: 'left',
            type: 'text',
            default: '70%',
        },
        version: {
            label: 'add script version number',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        ratingscore: {
            label: 'display script rating score',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        updates: {
            label: 'display update checks information',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        updatesperiods: {
            type: 'multiselect',
            options: {
                daily: 1,
                weekly: 7,
                monthly: 30,
                total: 0
            },
            default: {daily: 1, weekly: 7, monthly: 30, total: 0},
        },
        installs: {
            label: 'display alternative installs information',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        installsperiods: {
            type: 'multiselect',
            options: {
                daily: 1,
                weekly: 7,
                monthly: 30,
                total: 0
            },
            default: {daily: 1, weekly: 7, monthly: 30, total: 0},
        },
        compact: {
            label: 'compact script information',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        userprofile: {
            section: ['', 'User page options (own page and other users`)'],
            label: 'collapse user profile info on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        controlpanel: {
            label: 'collapse control panel on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        discussions: {
            label: 'collapse discussions on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        scriptsets: {
            label: 'collapse script sets on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        displayimage: {
            label: 'display script image (experimental)',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        newtab: {
            section: ['', 'Other options'],
            label: 'open script page in new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        background: {
            label: 'open new tab in background',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        insert: {
            label: 'insert new tab next to the current instead of the right end',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        setParent: {
            label: 'return to the current tab after new tab closed',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        support: {
            section: ['', 'Support'],
            label: 'almaceleste.github.io',
            title: 'more info on almaceleste.github.io',
            type: 'button',
            click: () => {
                GM_openInTab('https://almaceleste.github.io', {
                    active: true,
                    insert: true,
                    setParent: true
                });
            }
        },
    },
    types: {
        multiselect: {
            default: {},
            toNode: function() {
                let field = this.settings,
                    value = this.value,
                    options = field.options,
                    id = this.id,
                    configId = this.configId,
                    labelPos = field.labelPos,
                    create = this.create;

                // console.log('toNode:', field, value, options);
                function addLabel(pos, labelEl, parentNode, beforeEl) {
                    if (!beforeEl) beforeEl = parentNode.firstChild;
                    switch (pos) {
                        case 'right': case 'below':
                            if (pos == 'below')
                                parentNode.appendChild(create('br', {}));
                            parentNode.appendChild(labelEl);
                            break;
                        default:
                            if (pos == 'above')
                                parentNode.insertBefore(create('br', {}), beforeEl);
                            parentNode.insertBefore(labelEl, beforeEl);
                    }
                }

                let retNode = create('div', { 
                        className: 'config_var multiselect',
                        id: `${configId}_${id}_var`,
                        title: field.title || ''
                    }),
                    firstProp;
            
                // Retrieve the first prop
                for (let i in field) { firstProp = i; break; }
            
                let label = field.label ? create('label', {
                        className: 'field_label',
                        id: `${configId}_${id}_field_label`,
                        for: `${configId}_field_${id}`,
                    }, field.label) : null;
      
                let wrap = create('ul', {
                    id: `${configId}_field_${id}`
                });
                this.node = wrap;

                for (const key in options) {
                    // console.log('toNode:', key);
                    const inputId = `${configId}_${id}_${key}_checkbox`;
                    const li = wrap.appendChild(create('li', {
                    }));
                    li.appendChild(create('input', {
                        checked: value.hasOwnProperty(key),
                        id: inputId,
                        type: 'checkbox',
                        value: options[key],
                    }));
                    li.appendChild(create('label', {
                        className: 'option_label',
                        for: inputId,
                    }, key));
                }

                retNode.appendChild(wrap);

                if (label) {
                    // If the label is passed first, insert it before the field
                    // else insert it after
                    if (!labelPos)
                        labelPos = firstProp == "label" ? "left" : "right";
              
                    addLabel(labelPos, label, retNode);
                }
                
                return retNode;
            },
            toValue: function() {
                let node = this.node,
                    id = node.id,
                    options = this.settings.options,
                    rval = {};

                // console.log('toValue:', node, options, this);

                if (!node) return rval;

                let nodelist = node.querySelectorAll(`#${id} input:checked`);
                // console.log('nodelist:', document.querySelectorAll(`#${id} input:checked`), nodelist);
                nodelist.forEach((input) => {
                    // console.log('toValue:', input);
                    const value = input.value;
                    const key = Object.keys(options).find((key) => options[key] == value);
                    rval[key] = value;
                });

                // console.log('toValue:', rval);
                return rval;
            },
            reset: function() {
                let node = this.node,
                    values = this.default;

                // console.log('reset:', node, values, Object.values(values));
                const inputs = node.getElementsByTagName('input');
                for (const index in inputs) {
                    const input = inputs[index];
                    // console.log('reset:', input.value, Object.values(values).includes(input.value) || Object.values(values).includes(+input.value));
                    if (Object.values(values).includes(input.value) || Object.values(values).includes(+input.value)) {
                        if (!input.checked) input.click();
                    }
                    else {
                        if (input.checked) input.click();
                    }
                }
            }
        }
    },
    css: windowcss,
    events: {
        save: function() {
            GM_config.close();
        }
    },
});

function arrow(element){
    const arrow = $(`
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <style>
                .collapsed {
                    transform: rotate(0deg);
                }
                .expanded {
                    transform: rotate(180deg);
                }
            </style>
            <text x='0' y='18'>▼</text>
        </svg>
    `).css({
        fill: 'whitesmoke',
        height: '20px',
        width: '30px',
    });
    $(element).append(arrow);
}

function collapse(element, header){
    $(element).css({
        cursor: 'pointer',
    });
    arrow($(element).find(header));
    $(element).accordion({
        collapsible: true,
        active: false,
        beforeActivate: () => {
            rotate($(element).find('svg'));
        }
    });
}

function rotate(element){
    if ($(element).hasClass('expanded')) {
        $(element).animate({
            transform: 'rotate(0deg)',
        });
    }
    else {
        $(element).animate({
            transform: 'rotate(180deg)',
        });
    }
    $(element).toggleClass('expanded');
}

function compact(first, second){
    $('dt' + first).each(function(){
        $(this).css('display','none');
        $(this).siblings('dt' + second).find('span').append(' (' + $(this).find('span').text() + ')');
    });
    $('dd' + first).each(function(){
        $(this).css('display','none');
        $(this).siblings('dd' + second).find('span').append(' (' + $(this).find('span').text() + ')');
    });
}

function newtaber(e){
    const options = {active: !GM_config.get('background'), insert: GM_config.get('insert'), setParent: GM_config.get('setParent')};
    e.preventDefault();
    e.stopPropagation();
    GM_openInTab(e.target.href, options);
}

function getjson(url){
    fetch(url).then((response) => {
        // console.log('getjson:', response);
        response.json().then((json) => {
            console.log('getjson:', json);
        });
    });
}

function sumlast(array, number, prop){
    if (number != 0) {
        array = array.slice(-number);
    }
    let result = array.reduce((sum, next) => {
        return sum + next[prop];
    }, 0);
    return result;
}

function getjsondata(url, prop, periods, target){
    fetch(url).then((response) => {
        response.json().then((json) => {
            const data = Object.values(json);

            for (const period in periods) {
                const result = sumlast(data, periods[period], prop);
                $('<span></span>', {
                    title: period,
                }).text(result).appendTo(target);
            }
        });
    });
}

function doCompact(){
    if (GM_config.get('compact')){
        $(scriptstats).children().css('width','auto');
        compact(totalinstalls, dailyinstalls);
        compact(updateddate, createddate);
    }
}

function doRating(page){
    switch (page) {
        case 'user':
        case 'search':
            $(scriptrating).each(function(){
                let rating = $(this).attr('data-rating-score');
                $(this).children('span').after(` - ${rating}`);
            });
            break;
        case 'script':
            $(scriptrating).each(function(){
                const author = '#script-stats > .script-show-author > span > a';
                const url = `${window.location.origin}${$(author).attr('href')}`;
                const scriptId = '#script-content > .script-in-sets > input[name="script_id"]';
                const id = $(scriptId).val();

                fetch(url).then((response) => {
                    response.text().then((data) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data, 'text/html');
                        const el = doc.querySelector(`#user-script-list li[data-script-id="${id}"]`);

                        $(this).children('span').after(` - ${el.dataset.scriptRatingScore}`);
                    });
                });
            });
            break;
        default:
            break;
    }
}

function doCollapse(){
    Object.keys(sections).forEach((section) => {
        if (GM_config.get(section)) {
            collapse(sections[section], 'header h3');
        }
    });
}

function doProfile(){
    $(userprofile.path).slideUp();
    arrow($(userprofile.header));
    $(userprofile.header).css({
        cursor: 'pointer',
    })
    .click(function(){
        $(userprofile.path).slideToggle();
        rotate($(this).find('svg'));
    });
}

function doList(){
    const version = GM_config.get('version');
    const newtab = GM_config.get('newtab');
    $(listitem).each(function(){
        if (version){
            $(this).find(separator).before(` ${$(this).attr(scriptversion)}`);
        }
        if (newtab){
            $(this).find(separator).prev('a').click(newtaber);
        }
    });
}

function doUpdates(page){
    let parent, target, url;
    switch (page) {
        case 'user':
        case 'search':
            parent = listitem;
            target = scriptstats;
            break;        
        case 'script':
            parent = `#script-meta`;
            target = `#script-stats`;
            url = `${window.location.href}/stats.json`;
            break;
        default:
            break;
    }
    $(parent).each((index, item) => {
        $(item).css({
            maxWidth: 'unset',
        });
        const stats = $(item).find(target);
        if (page != 'script') url = `${$(item).find(scripturl).attr('href')}/stats.json`;

        const updatesperiods = GM_config.get('updatesperiods');
        if (Object.keys(updatesperiods).length > 0) {
            const dt = $('<dt></dt>', {
                class: 'script-list-update-checks',
                style: 'cursor: default',
                width: 'auto',
            });
            
            let text = 'Updates (';
            let title = 'Update checks (';
            for (const period in updatesperiods) {
                text += `${period.charAt(0)}|`;
                title +=`${period}|`;
            };
            text = text.replace(/\|$/, '):');
            title = title.replace(/\|$/, ')');
            dt.text(text).attr('title', title).append(`
            <style>
                .inline-script-stats dt,
                .inline-script-stats dd,
                .inline-script-stats span {
                    cursor: default;
                    width: auto !important;
                }
                .script-list-update-checks span {
                    padding: 0 5px;
                }
                .script-list-update-checks span:not(:last-child) {
                    border-right: 1px dotted whitesmoke;
                }
            </style>`).appendTo($(stats));

            const updatechecks = $('<dd></dd>', {
                class: 'script-list-update-checks',
            });
            $(stats).append(updatechecks);

            getjsondata(url, 'update_checks', updatesperiods, $(updatechecks));
        }
    });
}

function doInstalls(page){
    let daily, parent, target, total, url;
    switch (page) {
        case 'user':
        case 'search':
            daily = dailyinstalls;
            parent = listitem;
            target = scriptstats;
            total = totalinstalls;
            break;        
        case 'script':
            daily = '.script-show-daily-installs';
            parent = `#script-meta`;
            target = `#script-stats`;
            total = '.script-show-total-installs';
            url = `${window.location.href}/stats.json`;
            break;
        default:
            break;
    }
    $(daily).css({
        display: 'none',
    });
    $(total).css({
        display: 'none',
    });

    $(parent).each((index, item) => {
        $(item).css({
            maxWidth: 'unset',
        });
        const stats = $(item).find(target);
        if (page != 'script') url = `${$(item).find(scripturl).attr('href')}/stats.json`;

        const installsperiods = GM_config.get('installsperiods');
        if (Object.keys(installsperiods).length > 0) {
            const dt = $('<dt></dt>', {
                class: 'script-list-installs',
                style: 'cursor: default',
                width: 'auto',
            });
            
            let text = 'Installs (';
            let title = 'Installs (';
            for (const period in installsperiods) {
                text += `${period.charAt(0)}|`;
                title +=`${period}|`;
            };
            text = text.replace(/\|$/, '):');
            title = title.replace(/\|$/, ')');
            dt.text(text).attr('title', title).append(`
            <style>
                .inline-script-stats dt,
                .inline-script-stats dd,
                .inline-script-stats span {
                    cursor: default;
                    width: auto !important;
                }
                .script-list-installs span {
                    padding: 0 5px;
                }
                .script-list-installs span:not(:last-child) {
                    border-right: 1px dotted whitesmoke;
                }
            </style>`).appendTo($(stats));

            const installs = $('<dd></dd>', {
                class: 'script-list-installs',
            });
            $(stats).append(installs);

            getjsondata(url, 'installs', installsperiods, $(installs));
        }
    });
}

function isImage(url){
    const types = ['apng', 'bmp', 'gif', 'ico', 'jfi', 'jfif', 'jif', 'jpe', 'jpeg', 'jpg', 'pjp', 'pjpeg', 'png', 'psd', 'svg', 'tif', 'tiff', 'webp'];
    const ext = url.split('/').pop().split('#').shift().split('?').shift().split('.').pop();
    return types.includes(ext);
}

function displayImage(){
    $(listitem).each((index, item) => {
        const url = `${$(item).find(scripturl).attr('href')}`;
        const height = $(item).height();

        $(item).children('article').css({
            display: 'inline-block',
            margin: '0',
            width: '75%',
        });
        const div = $('<div></div>').appendTo($(item)).css({
            display: 'inline-block',
            height: `${height}px`,
            float: 'right',
            margin: '0',
            overflow: 'hidden',
            padding: '5px',
            width: '20%',
        });
        fetch(url).then((response) => {
            response.text().then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const el = doc.querySelector(`#additional-info img:first-child`);
                let src = el.getAttribute('src');

                if (el.parentElement.hasAttribute('href')) {
                    const href = el.parentElement.getAttribute('href');
                    if (isImage(href)) src = href;
                }

                const width = $(div).width();
                const img = $('<img/>', {
                    src: src,
                    width: `${width}px`,
                });
                $(div).append(`
                    <style>
                        ${listitem}::after {
                            clear: both;
                        }
                    </style>
                `).append(img);
            });
        });
    });
}

function router(path){
    const ratingscore = GM_config.get('ratingscore');
    const displayimage = GM_config.get('displayimage');
    const installs = GM_config.get('installs');
    const updates = GM_config.get('updates');
    const userprofile = GM_config.get('userprofile');

    switch (true) {
        case route.userpage.test(path):
            console.log('router:', 'user', path);
            if (userprofile) doProfile();
            doCollapse();
            doCompact();
            if (ratingscore) doRating('user');
            doList();
            if (installs) doInstalls('user');
            if (updates) doUpdates('user');
            if (displayimage) displayImage();
            break;
        case route.searchpage.test(path):
            console.log('router:', 'search', path);
            if (ratingscore) doRating('search');
            doCompact();
            doList();
            if (installs) doInstalls('search');
            if (updates) doUpdates('search');
            if (displayimage) displayImage();
            break;
        case route.scriptpage.test(path):
            console.log('router:', 'script', path);
            if (ratingscore) doRating('script');
            if (installs) doInstalls('script');
            if (updates) doUpdates('script');
            break;
        default:
            console.log('router:', 'default', path);
            break;
    }
}

(function() {
    'use strict';

    $(document).ready(() => {
        const width = GM_config.get('width');
        $(maincontainer).css({
            maxWidth: width,
        });

        router(window.location.pathname);
    });
})();
