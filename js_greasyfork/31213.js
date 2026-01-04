// ==UserScript==
// @name         MSDN Table of Contents
// @namespace    https://github.com/arkeet/userscripts
// @version      0.1
// @description  Add a table of contents to MSDN documentation pages.
// @match        *://msdn.microsoft.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @copyright    2017, Adrian Keet
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/31213/MSDN%20Table%20of%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/31213/MSDN%20Table%20of%20Contents.meta.js
// ==/UserScript==

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function main() {
    'use strict';

    if ($('div#indoc_toc:visible').length > 0) {
        console.info('Found existing TOC - quitting.');
        return;
    }

    var $mainSection = $('div#mainSection, div#nstext').first();
    if (!$mainSection.length) {
        console.warn('Missing mainSection - quitting.');
        return;
    }

    var $headers = $mainSection.find(':header');
    console.info('Found ' + $headers.length + ' headers.');
    if (!$headers.length) {
        console.info('Nothing to do.');
        return;
    }

    var infos = [];
    var levels = new Set();
    console.groupCollapsed('Headers');
    $headers.each(function(i, e) {
        var h = {
            element: e,
            level: parseInt(e.nodeName.substring(1), 10),
            text: $(e).text(),
        };
        infos.push(h);
        levels.add(h.level);
        console.info('<h' + h.level + '>', h.text, h.element);
    });
    console.groupEnd();

    levels = Array.from(levels).sort();
    infos.forEach(function(h) {
        h.level = levels.indexOf(h.level);
    });

    var $toc = $('<div/>', {
        css: {
            float: 'right',
            border: '1px solid #000',
            padding: '0.5em 0.75em',
            margin: '0em 0em 0.5em 0.75em',
            maxWidth: '50%',
            fontSize: '10pt',
        },
    });

    var $toc_ul = $('<ul/>', {
        css: {
            margin: '0px',
            padding: '0px',
            listStyleType: 'none',
        }
    }).appendTo($toc);

    infos.forEach(function(h, i) {
        var anchor_id = '_' + i + '_' +
            h.text.replace(/[^0-9a-z_]/gi, '_').toLowerCase();

        $('<a/>', { id: anchor_id }).prependTo(h.element);

        var $entry = $('<li/>', {
            css: {
                margin: '0px 0px 3px ' + (h.level * 12).toString() + 'px',
                padding: '0px',
                fontSize: (100 - h.level * 10).toString() + '%',
                background: 'transparent',
            }
        });
        $('<a/>', {
            text: h.text,
            href: '#' + anchor_id,
        }).appendTo($entry);
        $entry.appendTo($toc_ul);
    });

    $toc.prependTo($mainSection);
}

setTimeout(function() {
    console.group('MSDN Table of Contents');
    try {
        main();
    } finally {
        console.groupEnd();
    }
}, 0);
