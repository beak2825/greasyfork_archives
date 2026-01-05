// ==UserScript==
// @name        Basecamp Keyword Highlighter
// @description Highlights predefined list of keywords in the Basecamp task list at the beginning of task description
// @include     https://*.basecamphq.com/projects/*/todo_lists
// @grant       none
// @version     0.5.3
// @namespace https://greasyfork.org/users/32141
// @downloadURL https://update.greasyfork.org/scripts/22220/Basecamp%20Keyword%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/22220/Basecamp%20Keyword%20Highlighter.meta.js
// ==/UserScript==

// Here you can add your own keywords:
var keywordsColors = {
    // red
    'bf0303': ['error', 'bug'],

    // green
    '008c00': ['todo', 'feature'],

    // purple
    '5a00b3': ['postponed'],

    // pink
    'cc00ba': ['high']
};

function createKeywordStyles() {
    var color,
        style = document.createElement('style'),
        innerHtml = '.keyword {color: #fff; border-radius: 3px; padding: 0px 2px 0px 2px; }\n';

    for (color in keywordsColors) {
        innerHtml += '.keyword-' + color + ' { background-color: #' + color + '; }\n';
    }

    style.type = 'text/css';
    style.innerHTML = innerHtml;

    document.getElementsByTagName('head')[0].appendChild(style);
}

function processTodoLists(rootEl) {
    var el,
        child,
        color,
        regexps = {},
        keywords,
        tasksContent;

    function getType(obj) {
        return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase();
    }

    function findElements(rootEl, tagName, param) {
        var result = [],
            elements = rootEl.getElementsByTagName(tagName),
            paramType = getType(param);

        for (var i = 0; i < elements.length; i++) {
            if (paramType == 'string' && elements[i].id.indexOf(param) === 0) {
                result.push(elements[i]);
            } else if (paramType == 'regexp' && param.test(elements[i].id)) {
                result.push(elements[i]);
            }
        }

        return result;
    }

    function formatTask(el, color, word) {
        el.innerHTML = el.innerHTML.replace(word, '<span class="keyword keyword-' + color + '">' + word + '</span>');
    }

    tasksContent = findElements(rootEl, 'span', /^item_wrap_/);
    for (var i = 0; i < tasksContent.length; i++) {
        el = tasksContent[i];
        child = el.firstChild;

        if (child.nodeName && child.nodeName.toLowerCase() == 'span' &&
            child.classList && child.classList.contains('keyword')) {
            continue;
        }

        var text = tasksContent[i].textContent;
        for (color in keywordsColors) {
            if (!keywordsColors.hasOwnProperty(color)) {
                continue;
            }

            keywords = keywordsColors[color];
            if (!regexps[color]) {
                regexps[color] = new RegExp('^((?:' + keywords.join('|') + ')[^:^\s]*).*', 'i');
            }

            var regexp = regexps[color];
            if (regexp.test(text)) {
                formatTask(tasksContent[i], color, regexp.exec(text)[1]);
                break;
            }
        }
    }
}

createKeywordStyles();

document.observe("dom:modified", function(ev) {
    processTodoLists(ev.target);
});
processTodoLists(document);
