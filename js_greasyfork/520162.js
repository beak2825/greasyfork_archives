// ==UserScript==
// @name         GGn Cover Helper
// @namespace    none
// @version      1.4.2
// @description  Show cover size and find replacements
// @author       tesnonwan
// @match        https://gazellegames.net/torrents.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/520162/GGn%20Cover%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520162/GGn%20Cover%20Helper.meta.js
// ==/UserScript==

const coverContainer = document.querySelector('#group_cover');
const coverImg = document.querySelector('#group_cover p img');
const title = encodeURIComponent(/(?:[^-]+ - )?(.+) ::/.exec(document.querySelector('title').text)[1]);

function isOstGroup() {
    return document.querySelector('#group_nofo_bigdiv .head')?.textContent?.startsWith('OST Information');
}

async function addCoverDetails() {
    const label = document.createElement('div');
    const size = document.createElement('span');
    label.appendChild(size);
    label.style.width = '100%';
    label.style.display = 'flex';
    label.style.marginTop = '5px';
    if (!coverImg.complete) {
        await new Promise((resolve) => {
            coverImg.addEventListener('load', resolve);
        });
    }
    const isOst = isOstGroup();
    const goalRatio = isOst ? '1.00' : '1.50';
    const minSize = isOst ? 1000 : 900;
    const ratio = (coverImg.naturalHeight / coverImg.naturalWidth).toFixed(2);
    const ratioColor = ratio === goalRatio ? 'LimeGreen' : 'red';
    const ratioSpan = `<span style="font-size: smaller; font-weight: bold; margin-left: 5px; color: ${ratioColor}">(${ratio})</span>`;
    const sizeColor = coverImg.naturalHeight >= minSize ? 'white' : 'red';
    size.innerHTML = `<span style="color: ${sizeColor}">${coverImg.naturalWidth}x${coverImg.naturalHeight}</span>` + ratioSpan;
    const replaceLink = document.createElement('a');
    replaceLink.href = `https://yandex.eu/images/search?text=${title}+cover&isize=large&iorient=vertical`;
    replaceLink.target = '_blank';
    replaceLink.appendChild(document.createTextNode('Search Replacement'));
    replaceLink.style.textAlign = 'right';
    replaceLink.style.flexGrow = 1;
    label.appendChild(replaceLink);
    coverContainer.parentElement.insertBefore(label, coverContainer.nextElementSibling);
}

async function addScreenshotDetails() {
    const firstScreenshot = document.querySelectorAll('.screenshots img')?.[0];
    if (!firstScreenshot) { return; }
    if (!firstScreenshot.complete) {
        await new Promise((resolve) => {
            firstScreenshot.addEventListener('load', resolve);
        });
    }
    const screenshotsHeader = document.querySelector('.screenshots_div .head');
    const screenshotTitle = document.querySelector('.screenshots_div strong');
    const width = firstScreenshot.naturalWidth;
    const height = firstScreenshot.naturalHeight;
    screenshotTitle.innerHTML =
        `Screenshots <span style="font-size: 0.8em">(${width}x${height}) <a target="_blank" style="font-size: 0.8em; margin-left: 0" href="https://yandex.eu/images/search?isize=eq&text=${title + '%20screenshots'}&iw=${width}&ih=${height}">[replace]</a></span>`;
}

addCoverDetails();
addScreenshotDetails();