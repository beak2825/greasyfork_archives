// ==UserScript==
// @name        [AO3 Wrangling] More mass bin buttons
// @description add all the buttons on mass bin pages
// @version     0.1
// @author      Rhine
// @namespace   https://github.com/RhineCloud
// @match       http*://*archiveofourown.org/tags/*/wrangle*
// @match       http*://*archiveofourown.org/tag_wranglings?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/446211/%5BAO3%20Wrangling%5D%20More%20mass%20bin%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/446211/%5BAO3%20Wrangling%5D%20More%20mass%20bin%20buttons.meta.js
// ==/UserScript==

// based on dusty's iconify script
// https://greasyfork.org/en/scripts/30563-ao3-wrangling-tag-comments-button-iconify

// SETTINGS
// set each to true or false
const ICONIFY = true;
const COMMENT_BUTTON = true;
const TAGS_LANDING_BUTTON = true;

// load FontAwesome for icons
if (ICONIFY) {
    let font_awesome_icons = document.createElement('script');
    font_awesome_icons.setAttribute('src', 'https://use.fontawesome.com/ed555db3cc.js');
    document.getElementsByTagName('head')[0].appendChild(font_awesome_icons);

    let fa_icons_css = document.createElement('style');
    fa_icons_css.setAttribute('text', 'text/css');
    fa_icons_css.innerHTML = `tbody td ul.actions {
                                font-family: FontAwesome, sans-serif;
                              }
                              tbody td .actions input[type="checkbox"] {
                                margin: auto auto auto .5em;
                                vertical-align: -.35em;
                              }`;
    document.getElementsByTagName('head')[0].appendChild(fa_icons_css);
}

(function ($) {
    let buttons = document.querySelectorAll('table tbody ul.actions li');

    buttons.forEach((value, key, parent) => {
        let content = value.innerHTML;
        let url = content.match(/=".*">/)[0].slice(2, -2);
        let type = content.match(/>\s*[A-Z]\w*/)[0].slice(1).trim();

        if (ICONIFY) {
            switch (type) {
                case 'Remove':
                    let tag_remove_checkbox = value.querySelector('input');
                    value.querySelector('label').innerHTML = '&#xf00d;';
                    value.querySelector('label').appendChild(tag_remove_checkbox);
                    break;
                case 'Edit':
                    value.querySelector('a').innerHTML = '&#xf044;';
                    break;
                case 'Wrangle':
                    value.querySelector('a').innerHTML = '&#xf00b;';
                    break;
                case 'Works':
                    value.querySelector('a').innerHTML = '&#xf02d;';
                    break;
            }
        }

        if (type === 'Remove') {
            value.querySelector('input').setAttribute('style', 'margin: auto auto auto .5em; vertical-align: -.35em');
        }
        value.setAttribute('title', type);

        if (type === 'Edit') {
            if (TAGS_LANDING_BUTTON) {
                let tags_button = value.cloneNode(true);
                tags_button.querySelector('a').innerHTML = ICONIFY ? '&#xf036;' : 'Tags Landing';
                tags_button.querySelector('a').setAttribute('href', url.slice(0, -5));
                tags_button.setAttribute('title', 'Tags Landing');
                tags_button.setAttribute('style', 'margin-left: .25em');
                value.parentNode.insertBefore(tags_button, value.nextSibling);
            }
            if (COMMENT_BUTTON) {
                let comment_button = value.cloneNode(true);
                comment_button.querySelector('a').innerHTML = ICONIFY ? '&#xf086;' : 'Comments';
                comment_button.querySelector('a').setAttribute('href', url.slice(0, -4) + 'comments');
                comment_button.setAttribute('title', 'Comments');
                comment_button.setAttribute('style', 'margin-left: .25em');
                value.parentNode.insertBefore(comment_button, value.nextSibling);
            }
        }
    });
})();