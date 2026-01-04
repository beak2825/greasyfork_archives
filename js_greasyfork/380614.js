// ==UserScript==
// @name         E-Hentai - Color Results By Tags
// @description  Highlights galleries with tag flags using the color(s) of their own tag flags.
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @run-at       document-end
// @version      0.0.12
// @namespace    https://greasyfork.org/users/2168
// @downloadURL https://update.greasyfork.org/scripts/380614/E-Hentai%20-%20Color%20Results%20By%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/380614/E-Hentai%20-%20Color%20Results%20By%20Tags.meta.js
// ==/UserScript==

var SETTINGS = {

    REORDERING: {
        key: 'eh.reordering',
        default: true,
        label: 'Reordering',
        description: [ 'Move highlighted galleries on top.' ]
    },

    TAGS_ON_THUMBS: {
        key: 'eh.tags.on.thumbs',
        default: false,
        label: 'Tags on Thumbs',
        description: [ 'Move tags on top of thumbnails (thumbnail mode only).' ]
    },

    COLOR_PREDOMINANCE: {
        key: 'eh.tags.predominance',
        default: true,
        label: 'Color Predominance',
        description: [
            'When enabled, items will be highlighted using the predominant tag color (the color that shows up the most).',
            'When disabled, the left-most tag will decide the coloring.',
            'Note that weights control the ordering of tags.'
        ]
    },

    COLORS_ENABLED: {
        key: 'eh.colors.enabled',
        default: true,
        label: 'Coloring',
        description: [ 'When enabled, the background color of galleries will be changed to reflect the color of their tags.' ]
    }

};

function process() {

    var shouldReorder = getSetting(SETTINGS.REORDERING);
    var shouldColor = getSetting(SETTINGS.COLORS_ENABLED);

    extractTargets().forEach(function(target,n) {
        if (shouldColor) {
            if (target.colors.length > 0) {
                target.item.style.backgroundColor = applyOpacity(chooseColor(target.colors));
                target.item.classList.add('eh-highlighted');
            } else {
                target.item.style.backgroundColor = null;
                target.item.classList.remove('eh-highlighted');
            }
        }
        if (shouldReorder) {
            if (target.item.nodeName !== 'TR') target.item.style.order = n;
            else target.item.parentNode.appendChild(target.item);
        }
    });

    // Reposition header row if necessary (only needed for compact mode)
    var header = document.querySelector('.eh-highlighted + tr > th');
    if (header) header.parentNode.parentNode.insertBefore(header.parentNode, header.parentNode.parentNode.firstChild);

}

function extractTargets() {
    var targets = qSA('.itg > tbody > tr, .itg > .gl1t');
    var highlighted = [ ], ignored = [ ];
    targets.forEach(function(target) {
        var tags = qSA('.gt[style*="color"]', target);
        if (tags.length === 0) ignored.push({ item: target, colors: [ ] });
        else {
            var colors = [ ];
            tags.forEach(function(tag) { colors.push(extractColor(tag)); });
            highlighted.push({ item: target, colors: colors });
        }
    });
    return highlighted.concat(ignored);
}

/*------------------
  Color Manipulation
  ------------------*/

// Extracts the background color of a given tag (always picks the lighter color in the gradient)
function extractColor(element) {
    try {
        var background = element.style.background.replace(/\s/g, '');
        var colors = background.match(/rgb\(\d+,\d+,\d+\)/g)
            .concat(background.match(/rgba\(\d+,\d+,\d+,\d+\)/g))
            .concat(background.match(/#[0-9a-f]{2,8}/));
        if (colors.length < 2) return parseColor(element.style.borderColor);
        var parsed = [ parseColor(colors[0]), parseColor(colors[1]) ];
        var distance1 = distance(parsed[0], [ 255, 255, 255 ]);
        var distance2 = distance(parsed[1], [ 255, 255, 255 ]);
        return (distance1 < distance2 ? parsed[0] : parsed[1]);
    } catch (e) {
        return parseColor(element.style.borderColor);
    }
}

// Chooses which color to assign to the item/row (based on color weights)
function chooseColor(colors) {

    if (!getSetting(SETTINGS.COLOR_PREDOMINANCE)) {
        return colors[0];
    }

    var map = { };
    var max = 0;
    colors.forEach(function(color) {
        var key = color.join(',');
        if (!map.hasOwnProperty(key)) map[key] = [ color, 1 ];
        else ++map[key][1];
        max = Math.max(max, map[key][1]);
    });
    var result = Object.keys(map)
        .filter(function(key) { return map[key][1] === max; })[0];
    return map[result][0];

}

// Parses a color into a numeric list of 3 elements from 0 to 255
function parseColor(color) {
    try {
        color = color.replace(/\s/g, '').trim();
        var tokens = color.match(/^rgba?\((\d+),(\d+),(\d+)(?:,[\d.]+)?\)/i);
        if (tokens) return [ parseInt(tokens[1], 10), parseInt(tokens[2], 10), parseInt(tokens[3], 10) ];
        if (/^#[0-9a-f]{3,3}$/.test(color)) color = color + color.slice(1);
        var hex = color.match(/^#([0-9a-f]{2,2})([0-9a-f]{2,2})([0-9a-f]{2,2})/i);
        if (hex) return [ parseInt(tokens[1], 16), parseInt(tokens[2], 16), parseInt(tokens[3], 16) || 255 ];
    } catch (e) {
        return [ 255, 255, 255 ];
    }
}

// Calculates the Euclidean distance between two colors
function distance(from, to) {
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2) + Math.pow(from[2] - to[2], 2));
}

// Applies opacity to a given background color
function applyOpacity(color) {
    var opacity = 0.6;
    var result = color.map(function(c) { return Math.round(c + (255 - c) * (1 - opacity)); });
    return 'rgb(' + result.join(',') + ')';
}

/*---------------------------
  In-gallery Tag Highlighting
  ---------------------------*/

function onMouseDownDetected(e) {
    if (e.which !== 1 && e.which !== 2) return;
    var parent = e.target.closest('.itg > tbody > tr, .itg > .gl1t');
    if (!parent) return;
    var link = parent.querySelector('a[href*="/g/"]');
    var galleryID = link.href.match(/\/g\/(\d+)/)[1];
    var tags = { };
    qSA('.gt', parent).map(function(t) {
        var name = t.getAttribute('title');
        if (name.indexOf(':') === 0) name = 'misc' + name;
        var style = { color: t.style.color, background: t.style.background };
        if (style.color || style.background) tags[name] = style;
    });
    cacheGallery(galleryID, tags);
}

function cacheGallery(id, tags) {
    var cache = JSON.parse(localStorage.getItem('eh.tags.igcache')) || [ ];
    cache.unshift({ id: id, tags: tags });
    cache = cache.slice(0, 5);
    localStorage.setItem('eh.tags.igcache', JSON.stringify(cache));
}

function loadGalleryFromCache(id) {
    // localStorage as the primary source, sessionStorage as the fallback
    var cache = JSON.parse(localStorage.getItem('eh.tags.igcache')) || [ ];
    for (var i=0; i<cache.length; ++i) {
        if (cache[i].id === id)
            return cache[i];
    }
    var key = 'eh.cache.' + id;
    if (sessionStorage.hasOwnProperty(key))
        return JSON.parse(sessionStorage.getItem(key));
    return null;
}

function highlightGalleryTags() {
    var galleryID = window.location.href.match(/\/g\/(\d+)/)[1];
    var cacheData = loadGalleryFromCache(galleryID);
    if (!cacheData) return;
    sessionStorage.setItem('eh.cache.' + galleryID, JSON.stringify(cacheData));
    qSA('.gt, .gtl, .gtw').forEach(function(t) {
        var name = t.firstElementChild.id.slice(3).replace(/_/g, ' ');
        if (name.indexOf(':') === -1) name = 'misc:' + name;
        if (cacheData.tags[name]) {
            t.setAttribute('eh-highlighted', true);
            t.style.background = (cacheData.tags[name].background || t.style.color);
            t.style.color = (cacheData.tags[name].color || t.style.color);
        }
    });
}

/*---------
  Utilities
  ---------*/

function qSA(query, parent) {
    if (!parent) parent = document;
    return [].slice.call(parent.querySelectorAll(query));
}

function getSetting(setting) {
    if (!localStorage.hasOwnProperty(setting.key)) return setting.default;
    else return !!JSON.parse(localStorage.getItem(setting.key));
}

function toggleSetting(setting) {
    localStorage.setItem(setting.key, JSON.stringify(!getSetting(setting)));
}

function createSettings() {
    var fileSearchButton = document.querySelector('[onclick*="toggle_filesearch_pane"]');
    if (!fileSearchButton) return;
    var settings = createSettingsContainer();
    createSettingsToggle(fileSearchButton.parentNode, settings);
}

function createSettingsContainer() {
    var container = document.createElement('div');
    container.id = 'eh-settings'
    createSettingsButton(container, SETTINGS.REORDERING);
    createSettingsButton(container, SETTINGS.TAGS_ON_THUMBS);
    createSettingsButton(container, SETTINGS.COLORS_ENABLED);
    createSettingsButton(container, SETTINGS.COLOR_PREDOMINANCE);
    return container;
}

function createSettingsButton(container, setting) {
    var button = document.createElement('a');
    button.className = 'eh-setting';
    button.title = setting.description.join('\n');
    button.innerHTML = setting.label + ': ' + (getSetting(setting) ? 'on' : 'off');
    button.addEventListener('click', function() {
        toggleSetting(setting);
        button.innerHTML = setting.label + ': ' + (getSetting(setting) ? 'on' : 'off');
        if (!/Reload the page/.test(container.innerHTML)) {
            var div = container.appendChild(document.createElement('div'));
            div.innerHTML = 'Reload the page to apply the changes.';
        }
    });
    container.appendChild(button);
}

function createSettingsToggle(container, settings) {

    var button = document.createElement('a');
    button.className = 'eh-toggle';
    button.title = 'E-Hentai - Color Results by Tag Settings';
    button.innerHTML = 'Show Settings';
    button.addEventListener('click', function() {
        if (settings.parentNode) settings.parentNode.removeChild(settings);
        else container.appendChild(settings);
    });

    container.appendChild(button);

}

/*--------------
  Initialization
  --------------*/

var isInsideGallery = (/\/g\//.test(window.location.href));

if (isInsideGallery) {
    var style = document.createElement('style');
    style.innerHTML = '[eh-highlighted] > a { color: inherit !important; }';
    document.head.appendChild(style);
    highlightGalleryTags();
} else {

    var style = document.createElement('style');
    style.innerHTML = '#eh-settings { margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; padding: 5px; display: inline-block; }' +
        '.eh-toggle { white-space: nowrap; cursor: pointer; margin-left: 10px; }' +
        '.eh-setting { white-space: nowrap; cursor: pointer; }' +
        '.eh-setting + .eh-setting:before { content: " / "; }' +
        '.eh-highlighted .glname > a, .eh-highlighted > a, .eh-highlighted > a > div { color: black !important; }' +
        '.eh-highlighted .glname a:hover { color: black !important; }' +
        '.gt > a { color: inherit !important; }';
    if (getSetting(SETTINGS.TAGS_ON_THUMBS)) {
        style.innerHTML += '.gl1t { position: relative; }' +
            '.gl6t { position: absolute; top: 39px; left: 7px; display: flex; flex-direction: column; }' +
            '.gl6t .gt { margin-bottom: 1px; }';
    }
    document.head.appendChild(style);

    createSettings();
    process();

    // Used for in-gallery tag highlighting
    document.body.addEventListener('mousedown', onMouseDownDetected, false);

}