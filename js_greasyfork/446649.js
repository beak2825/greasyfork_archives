// ==UserScript==
// @name         BKeL(old) Improve Courses Display In Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add ability to collapse/expand each courses section. Automatically expand the first section while collapsing everything else. Also sort courses in each section by name.
// @author       ntpt7921
// @match        http://e-learning.hcmut.edu.vn/my/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446649/BKeL%28old%29%20Improve%20Courses%20Display%20In%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/446649/BKeL%28old%29%20Improve%20Courses%20Display%20In%20Dashboard.meta.js
// ==/UserScript==

/* I create this script for my personnal use.
 * Javascript is not my forte. So not sure if this script is optimized.
 * Anyone may use it freely.
 * No warranty, may break, use with caution
 */

(function() {
    'use strict';

/*
 * This script will attempt to add section visibility tooggle, performing:
 * 1. Read section header (<li> elements) and its content (<ul> of courses)
 * 2. Add display='block' to each section content, also change bottom-margin=1.8em
 * 3. Add event for each section header so that clicking it toggles its content visibility
 * 4. It will by default show the first section and hide the rest
 * 5. It will also sort the course by name for each section
 */

    function generate_section_objects() {
        let sectionHeaderList = document.getElementsByClassName('category-course')
        let dict = { sectionHeader: [],
                    sectionContent: [] }
        for (let sectionHeader of sectionHeaderList) {
            let sectionContent = sectionHeader.nextElementSibling
            dict['sectionHeader'].push(sectionHeader)
            dict['sectionContent'].push(sectionContent)
        }

        return dict
    }

    function modify_sections(sectionMap) {
        let sectionNumber = sectionMap['sectionHeader'].length
        for (let i = 0; i < sectionNumber; i++) {
            let sectionHeader = sectionMap['sectionHeader'][i]
            let sectionContent = sectionMap['sectionContent'][i]
            set_section_content_style(sectionContent)
            add_event_toggle_visibility(sectionHeader, sectionContent)
        }
    }

    function display_first_section_only(sectionMap) {
        let sectionNumber = sectionMap['sectionHeader'].length
        if (sectionNumber > 0) {
            // show the first section
            sectionMap['sectionContent'][0].style.display = 'block'
            // hide all other section
            for (let i = 1; i < sectionNumber; i++)
                sectionMap['sectionContent'][i].style.display = 'none'
        }
    }

    function set_section_content_style(sectionCont) {
        sectionCont.style.display = 'block'
        sectionCont.style.marginBottom = '1.8em'
    }

    function add_event_toggle_visibility(sectHeader, sectContent) {
        function toggle_visibility(sectionContent) {
            if (sectionContent.style.display === 'block')
                sectionContent.style.display = 'none'
            else
                sectionContent.style.display = 'block'
        }

        sectHeader.onclick = function () { toggle_visibility(sectContent) }
        sectHeader.onmouseover = function () { sectHeader.style.color = '#111111' }
        sectHeader.onmouseout = function () { sectHeader.style.color = '#545353' }
        sectHeader.style.cursor = 'pointer'
    }

    function sort_section_courses(sectMap) {
        function extractText(liElem) {
            let target = liElem.querySelector('.aalink.coursename')
            return target.innerText
                .replace(/[\s\n]+/gm, ' ')
                .trim()
        }

        for (let section of sectMap['sectionContent']) {
            const frag = document.createDocumentFragment()
            const items = section.querySelectorAll('li')
            const sortedItems = Array.from(items).sort(function(a, b){
                const aData = extractText(a), bData = extractText(b)
                return (aData < bData) ?
                    -1 : (aData > bData) ?
                    1 : 0
            })

            for (let item of sortedItems) {
                frag.appendChild(item)
            }
            section.appendChild(frag)
        }
    }

/*
 * The part below will refresh (rerun the command incase of content of section changes)
 * It uses MutationObserver (https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
 * See also https://stackoverflow.com/questions/12897446/userscript-to-wait-for-page-to-load-before-executing-code-techniques
 */

    (new MutationObserver(check)).observe(document.getElementById('region-main'),
                                          {childList: true, subtree: true}
                                         );

    function check(changes, observer) {
        if (document.getElementById('page-container-2')) {
            // disconect since we also change the content, which will trigger observer again recursively
            observer.disconnect()

            // the magic happens here
            let sectList = generate_section_objects()
            modify_sections(sectList)
            display_first_section_only(sectList)
            sort_section_courses(sectList)

            // reconnect observer
            observer.observe(document.getElementById('region-main'),
                             {childList: true, subtree: true}
                            );
        }
    }


})();
