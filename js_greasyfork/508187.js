// ==UserScript==
// @name         Jira Server: toggleable checkboxes in issue descriptions
// @description  Renders Markdown style toggleable checkboxes in Jira Server issue descriptions
// @author       Antti Kaihola
// @namespace    https://github.com/akaihola
// @version      0.2
// @license      MIT
// @match        https://*/*/RapidBoard.jspa*
// @match        https://jira.*/browse/*-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508187/Jira%20Server%3A%20toggleable%20checkboxes%20in%20issue%20descriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/508187/Jira%20Server%3A%20toggleable%20checkboxes%20in%20issue%20descriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const slugify = text => text.toLowerCase().replace(/\W+/g, '-').replace(/^-+|-+$/g, '');
    let lastSeenDescription = '';

    function getText(selector) {
      return $(selector).clone().find('a').each(function() {
          const el = $(this);
          if (el.hasClass('user-hover')) el.text(el.attr('rel'));
          else if (el.hasClass('external-link')) el.text(el.text() + '-' + el.attr("href"));
      }).end().text().trim();
    }

    function handleCheckboxes() {
        const description = jQuery('#description-val > div');
        description.off('click').on('click', 'input[type="checkbox"]', function() {
            const checkbox = jQuery(this);
            const li = checkbox.closest('li');
            const checked = checkbox.prop('checked');
            const content = getText(li);

            jQuery('#description-val > span[role="button"]').click();

            const waitForEditor = setInterval(() => {
                const textarea = jQuery('textarea#description');
                if (textarea.length) {
                    clearInterval(waitForEditor);
                    const lines = textarea.val().split('\n');
                    const updatedLines = lines.map(line => {
                        const match = line.match(/^(\s*)-\s*\[([ \u2002xX])\]\s*(.+)/);
                        if (match) console.log(slugify(match[3]), slugify(content));
                        return match && slugify(match[3]) === slugify(content)
                            ? `${match[1]}- [${checked ? 'x' : '\u2002'}] ${match[3]}`
                            : line;
                    });
                    textarea.val(updatedLines.join('\n'));
                    jQuery('#description-form > div.save-options button.submit').click();
                }
            }, 50);
        });

        // In the rendered HTML description, change brackets to checkbox elements.
        description.find('li').each(function() {
            const li = jQuery(this);
            const firstChild = li.children().first();
            let checked;
            const textNode = li.contents().filter(function () {return this.nodeType === 3;}).first();
            if (firstChild.is("span") && firstChild.text().trim().match(/^\[[xX]]/)) {
                firstChild.remove();
                // the space after the brackets is outside the <span>, trim it from the text content
                textNode[0].nodeValue = textNode.text().trimStart();
                checked = " checked";
            } else {
                const match = textNode.text().match(/^\[([ \u2002xX])\]\s*(.*)/);
                if (!match) return;
                textNode[0].nodeValue = match[2];  // remove the [ ] or [x]
                checked = match[1].toLowerCase() === 'x' ? " checked" : "";
            }
            li.css('list-style-type', 'none');
            const checkbox = jQuery(
                `<input type="checkbox" style="margin-left: -1.5em; margin-right: 0.5em"${checked}>`
            );
            li.prepend(checkbox);
        });
    }

    setInterval(() => {
        const description = document.querySelector('#description-val > div');
        if (description) {
            if (description.innerHTML !== lastSeenDescription) {
                handleCheckboxes();
                lastSeenDescription = description.innerHTML;
            }
        }
    }, 200);
})();
