// ==UserScript==
// @name            notion-word-count
// @namespace       https://greasyfork.org/scripts/413663-notion-word-count
// @author          starrybouquet
// @match           https://www.notion.so/*
// @version         0.0.1
// @description     Get word count of Notion document
// @downloadURL https://update.greasyfork.org/scripts/413663/notion-word-count.user.js
// @updateURL https://update.greasyfork.org/scripts/413663/notion-word-count.meta.js
// ==/UserScript==

window.onload = function (){
    // add button
    var moreButton = document.getElementsByClassName('notion-topbar-more-button')[0];
    var countButton = document.createElement('button');
    countButton.textContent = 'Word Count';
    countButton.id = 'wordcount-userscript-button'
    countButton.setAttribute('style', 'element {user-select: none;transition: background 20ms ease-in 0s;cursor: pointer;display: inline-flex;align-items: center;flex-shrink: 0;white-space: nowrap;height: 28px;border-radius: 3px;font-size: 14px;line-height: 1.2;min-width: 0px;padding-left: 8px;padding-right: 8px;color: rgb(55, 53, 47);');
    countButton.onclick = getWordCount;
    moreButton.before(countButton);

    // get current wordcount on click (NOT automatically updated)
    function getWordCount(e) {
        var input = document.getElementsByClassName('notion-page-content')[0];
        // regex gratefully based on https://stackoverflow.com/questions/38102141/how-to-make-a-word-count-that-contains-html-tags-using-javascript
        // console.log(input.innerText);
        cont = input.innerText.replace(/<[^>]*>/g," ");
        cont = cont.replace(/\s+/g, ' ');
        cont = cont.replace('—', ' ');
        cont = cont.trim();
        var words = cont.split(" ").length;
        countButton.textContent = 'Word Count: ' + String(words);
    }
}