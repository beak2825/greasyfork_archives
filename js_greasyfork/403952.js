// ==UserScript==
// @name         汉典划词查询
// @namespace    https://hlelf.com/
// @version      0.1
// @description  汉典划词查询，code from https://github.com/Ovilia/handian-chrome-extension
// @author       lelf
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403952/%E6%B1%89%E5%85%B8%E5%88%92%E8%AF%8D%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/403952/%E6%B1%89%E5%85%B8%E5%88%92%E8%AF%8D%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var gb = {
    searchTxt: null,
    enabled: false
};

function loadHandian() {
    // init panel
    closeHandian();
    var panel = initPanel();

    // remove previous handian
    var previousContent = document.getElementById('handian-content');
    if (previousContent) {
        panel.removeChild(previousContent);
    }

    // add new content
    var content = document.createElement('iframe');
    content.frameBorder = '0';
	content.src = 'https://www.zdic.net/hans/' + gb.searchTxt;
    content.id = 'handian_content';
    content.style['display'] = 'none';
    content.style['width'] = '100%';
    content.style['height'] = (window.innerHeight - 40) + 'px';
    content.addEventListener('load', function() {
        var loading = document.getElementById('handian-loading');
        if (loading) {
            panel.removeChild(loading);
        }
        content.style.removeProperty('display');
    });
    panel.appendChild(content);
}

function closeHandian() {
    var panel = document.getElementById('handian');
    if (panel) {
        document.body.removeChild(panel);
    }

    var button = document.getElementById('handian-btn');
    if (button) {
        button.style['display'] = 'none';
    }
}

function initPanel() {
    var panel = document.createElement('div');
    panel.id = 'handian';
    panel.style['width'] = '400px';
    panel.style['position'] = 'fixed';
    panel.style['left'] = '0';
    panel.style['top'] = '0';
    panel.style['background-color'] = '#EEF3F0';
    panel.style['max-height'] = '100%';
    panel.style['z-index'] = '999999';
    panel.style['text-align'] = 'left';
    panel.style['padding'] = '20px';
    panel.style['overflow'] = 'auto';

    var loading = document.createElement('p');
    loading.innerHTML = '查询中，请稍候……';
    loading.id = 'handian-loading';
    panel.appendChild(loading);

    document.body.appendChild(panel);
    return panel;
}

document.addEventListener('mouseup', function(event) {
    if (event.target === document.getElementById('handian-btn')) {
        loadHandian();
        return;
    }

            var sel = window.getSelection();
            var pos = sel.getRangeAt(0).getBoundingClientRect();

            // add button
            var button = document.getElementById('handian-btn');
            if (!button) {
                button = document.createElement('img');
                button.id = 'handian-btn';
                button.src = 'https://cdn.jsdelivr.net/gh/lelf2005/cdn/images/handian32.png';
                button.style['position'] = 'absolute';
                button.style['cursor'] = 'pointer';
                button.style['z-index'] = '1000';

                document.body.appendChild(button);
            } else {
                button.style['display'] = 'block';
            }
            button.style['left'] = pos.left + window.pageXOffset + 'px';
            button.style['top'] = pos.bottom + window.pageYOffset + 10 + 'px';

            var reg = /[^\u0000-\u00FF]/;
            var selText = sel.toString();
            if (selText && reg.test(selText)) {
                gb.searchTxt = (selText);
            } else {
                closeHandian();
            }

   // });
});
    // Your code here...
})();