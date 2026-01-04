// ==UserScript==
// @name         AO3 Fix Paragraph Spacing
// @namespace    ao3-remove-double-spacing
// @version      1.7
// @description  Removes excessive spacing between paragraphs on AO3.
// @author       yuube
// @match        http*://*.archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389365/AO3%20Fix%20Paragraph%20Spacing.user.js
// @updateURL https://update.greasyfork.org/scripts/389365/AO3%20Fix%20Paragraph%20Spacing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hasMedia (el) {
        var mediaWhitelist = [
            'IMG',
            'EMBED',
            'IFRAME',
            'VIDEO'
        ];

        var whitelisted = false;

        mediaWhitelist.forEach(item => {
            if (el.tagName === item || el.querySelector(item)) {
                whitelisted = true;
            };
        });

        return whitelisted
    };

    function naturallyEmpty (el) {
        var emptyWhitelist = [
          'HR'
        ];

        var whitelisted = false;
        var tagName = el.tagName;

        if (tagName === 'BR') {
          return true
        }

        emptyWhitelist.forEach(item => {
          if (tagName === item || el.querySelector(item)) {
              whitelisted = true;
          };
        });

        return whitelisted
    };

    /** Reduce trailing &nbsp;'s */
    function removeWhitespace (el) {
      const iterator = document.createNodeIterator(el, window.NodeFilter.SHOW_TEXT);
      var textNode;

      while (textNode = iterator.nextNode()) {
        textNode.textContent = textNode.textContent.replace(/(\u00A0){2,}$/, '\u00A0');
      }
    }

    function removeEmptyElement (el) {
      const content = el.textContent && el.textContent.replace(/\u00A0/g, '').trim();

      if (!content) {
          if (hasMedia(el) || naturallyEmpty(el)) {
              return
          }

          el.remove();
          return
      }

      removeWhitespace(el);
    };

    function reduceBrs (userstuff) {
      var el = userstuff.querySelector('br + br + br');

      while (el) {
        el.remove();
        el = userstuff.querySelector('br + br + br');
      }
    }

    function stripTrailingBrs (el) {
      while (el.lastChild && el.lastChild.tagName === 'BR') {
        el.lastChild.remove();
      }
    }

    function stripLeadingBrs (el) {
      while (el.firstChild && el.firstChild.tagName === 'BR') {
        el.firstChild.remove();
      }
    }

    const parent = document.querySelectorAll('.userstuff');

    parent.forEach(userstuff => {
        const allowedTags = [
          'a',
          'abbr',
          'acronym',
          'address',
          'b',
          'big',
          'blockquote',
          'caption',
          'center',
          'cite',
          'code',
          'col',
          'colgroup',
          'dd',
          'del',
          'details',
          'dfn',
          'div',
          'dl',
          'dt',
          'em',
          'figcaption',
          'figure',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'i',
          'img',
          'ins',
          'kbd',
          'li',
          'ol',
          'p',
          'pre',
          'q',
          'rp',
          'rt',
          'ruby',
          's',
          'samp',
          'small',
          'span',
          'strike',
          'strong',
          'sub',
          'summary',
          'sup',
          'table',
          'tbody',
          'td',
          'tfoot',
          'th',
          'thead',
          'tr',
          'tt',
          'u',
          'ul',
          'var',
          ':empty'
        ]

        allowedTags.forEach(el => {
          userstuff.querySelectorAll(el).forEach((child) => {
            stripLeadingBrs(child);
            stripTrailingBrs(child);
            removeEmptyElement(child);
          })
        });

        reduceBrs(userstuff);
      });
})();