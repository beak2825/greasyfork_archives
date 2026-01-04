// ==UserScript==
// @name         SkillShare Obsidian Template
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  Script to copy SkillShare course info as YAML & lessons titles with duration
// @author       foysalBn
// @match        https://www.skillshare.com/*/classes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skillshare.com
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500011/SkillShare%20Obsidian%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/500011/SkillShare%20Obsidian%20Template.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Function to copy text to the clipboard
    function copyTitle(){
        const title = document.querySelector('.class-details-header h1').innerText
        GM_setClipboard(title);
    }
    function copyMarkDownlink(){
        const title = document.querySelector('.class-details-header h1').innerText
        const src = document.location.href
        GM_setClipboard(`[${title}](${src})`);
    }

    function copyObsidianTemplate() {
        const src = document.location.href
        const title = document.querySelector('.class-details-header h1').innerText
        const teacher = document.querySelector('.class-details-header-teacher a').innerText;
        const duration = document.querySelector('#total-video-container').innerText;
        let sections = document.querySelectorAll('.session-item-info')
        console.log(sections)
        let lessons=''
        sections.forEach((sec,i)=>{
            lessons +='## '+(i+1)+'. ' + sec.querySelector('.session-item-title h3').innerText
                + " ("+sec.querySelector('.duration h3').innerText+")\n\n\n"
        })

        const textToCopy = `---
src: "${src}"
title: "${title}"
teacher: "${teacher}"
duration: "${duration}"
current lesson: "1"
completed: false
---

${lessons}
`
        GM_setClipboard(textToCopy);
    }

    // Register menu command
    GM_registerMenuCommand('Copy Course Title', copyTitle);
    GM_registerMenuCommand('Copy MarkDown Link [Title](link)', copyMarkDownlink);
    GM_registerMenuCommand('Copy Obsidian Note Template', copyObsidianTemplate);


})();