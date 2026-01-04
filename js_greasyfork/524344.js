// ==UserScript==
// @name         GGn Track Platform Tags
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  Show tags list for platform, including diffs since last view.
// @author       tesnonwan
// @match        https://gazellegames.net/artist.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/524344/GGn%20Track%20Platform%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/524344/GGn%20Track%20Platform%20Tags.meta.js
// ==/UserScript==

document.title = `${document.querySelector('.thin h2 a').textContent} Tags`;
const platform = document.querySelector('#content .thin a').textContent;
const pageKey = `${platform.toLowerCase()}_tags`;

function compareTags(oldTags, newTags) {
    const diff = {
        added: [],
        removed: [],
        changed: [],
    };
    for (const tag in oldTags) {
        const oldCount = oldTags[tag];
        const newCount = newTags[tag];
        if (newCount == null) {
            diff.removed.push({tagName: tag, count: oldCount});
        } else if (oldCount !== newCount) {
            diff.changed.push({tagName: tag, count: newCount - oldCount});
        }
    }
    for (const tag in newTags) {
        const newCount = newTags[tag];
        if (oldTags[tag] == null) {
            diff.added.push({tagName: tag, count: newCount});
        }
    }
    return diff;
}

function makeDiffSpan(count) {
    const diffSpan = document.createElement('span');
    diffSpan.style.color = count < 0 ? 'red' : 'limegreen';
    diffSpan.appendChild(document.createTextNode(` (${count < 0 ? '' : '+'}${count})`));
    return diffSpan;
}

(function() {
    'use strict';
    const tagList = document.querySelector('#tag_list');
    tagList.style.display = 'block';
    const anchor = document.querySelector('.flright');
    anchor.innerHTML = '(hide)';
    const tags = {};
    const tagItems = {};
    Array.from(document.querySelectorAll('#tag_list li')).forEach((li) => {
        const m = /([0-9a-z.]+).*\(([0-9]+)\)/s.exec(li.textContent);
        tags[m[1]] = Number.parseInt(m[2]);
        tagItems[m[1]] = li;
    });
    const oldTags = GM_getValue(pageKey, null);
    if (oldTags) {
        console.log('Found old tags');
        const diff = compareTags(oldTags, tags);
        const countDiff = oldTags ? (tags.length - oldTags.length) : 0;
        if (countDiff) {
            const diffSpan = makeDiffSpan(countDiff);
            anchor.parentElement.insertBefore(diffSpan, anchor);
        }
        if (diff.changed.length) {
            for (const change of diff.changed) {
                const tagItem = tagItems[change.tagName];
                const diffSpan = makeDiffSpan(change.count);
                tagItem.appendChild(diffSpan);
            }
        }
        if (diff.added.length) {
            const addedLi = document.createElement('li');
            const addedStr = diff.added.map((r) => `<i>${r.tagName}</i>`).join(', ');
            addedLi.innerHTML = `<span style="color: limegreen">Added</span> ${addedStr}`;
            tagList.insertBefore(addedLi, tagList.children[0]);
        }
        if (diff.removed.length) {
            const removedLi = document.createElement('li');
            const removedStr = diff.removed.map((r) => `<i>${r.tagName}</i>`).join(', ');
            removedLi.innerHTML = `<span style="color: red">Removed</span> ${removedStr}`;
            tagList.insertBefore(removedLi, tagList.children[0]);
        }
    }
    GM_setValue(pageKey, tags);
    console.log(tags);
})();