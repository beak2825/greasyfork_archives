// ==UserScript==
// @name         BTN :: Series to BBCode
// @namespace    broadcasthe.net
// @description  Generates BBCode from series page
// @include      https://broadcasthe.net/series.php?id=*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @version      1.7
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538359/BTN%20%3A%3A%20Series%20to%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/538359/BTN%20%3A%3A%20Series%20to%20BBCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #gmab_bbcode textarea {
            width: 90% !important;
            height: auto !important;
            margin: 0 auto auto;
            display: block;
            overflow: hidden;
            resize: none;
        }
        #gmab_copy_button, #seriesTopicCheckboxBB {
            margin-left: 10px;
            vertical-align: middle;
        }
        label[for="seriesTopicCheckboxBB"] {
            cursor: pointer;
            user-select: none;
            margin-left: 10px;
            vertical-align: middle;
        }
    `);

    let linkbox = document.querySelector('#content > div.thin > div.linkbox');
    if (!linkbox) return;

    const getBBCodeLink = document.createElement('a');
    getBBCodeLink.href = '#';
    getBBCodeLink.className = 'brackets';
    getBBCodeLink.textContent = '[Get BBCode]';
    linkbox.appendChild(getBBCodeLink);

    function selectThis() {
        this.select();
    }

    function onClickToggler(e) {
        e.preventDefault();
        let bbcodeBox = document.getElementById('gmab_bbcode');
        if (!bbcodeBox) {
            bbcodeBox = initBBCodeBox();
        }
        if (bbcodeBox.classList.contains('hidden')) {
            bbcodeBox.classList.remove('hidden');
            updateBBCodeArea();
        } else {
            bbcodeBox.classList.add('hidden');
        }
    }

    function updateBBCodeArea() {
        const bbcodeBox = document.getElementById('gmab_bbcode');
        if (!bbcodeBox) return;

        const textarea = bbcodeBox.querySelector('textarea');
        if (!textarea) return;

        const useBanner = GM_getValue('useSeriesBanner', false);
        const pageUrl = window.location.href;

        let bbcodeTitle = '';
        if (!useBanner) {
            const titleElem = document.querySelector("#content > div.thin > div.sidebar > div:nth-child(1) > div.head > strong");
            const seriesTitle = titleElem ? titleElem.textContent.trim() : 'Series Title';
            bbcodeTitle = `[align=center][b][size=6][url=${pageUrl}]${seriesTitle}[/url][/size][/b][/align]`;
        }

        const coverImgElem = document.querySelector("#content > div.thin > div.sidebar > div:nth-child(1) > div:nth-child(2) > img");
        const bannerImgElem = document.querySelector("img#banner");
        const imgUrl = useBanner ? (bannerImgElem ? bannerImgElem.src : null) : (coverImgElem ? coverImgElem.src : null);
        const bbcodeImage = imgUrl ? `[align=center][url=${pageUrl}][img]${imgUrl}[/img][/url][/align]` : '';


        // Series summary
        const synopsisElem = document.querySelector("#btn_text");
        const synopsisText = synopsisElem ? synopsisElem.textContent.trim() : '';
        const bbcodeSynopsis = synopsisText
        ? `\n[b][size=4]Series Summary[/size][/b]\n${synopsisText}`
            : '';

    // Series info table
    const infoTable = document.querySelector(".stats table");
    const desiredKeys = [
        "# of Seasons",
        "Country",
        "First Aired",
        "Runtime",
        "Network",
        "Classification"
    ];
    let bbcodeInfo = "[b][size=4]Series Info[/size][/b]\n";
    if (infoTable) {
        const rows = infoTable.querySelectorAll("tr");
        rows.forEach(row => {
            const keyCell = row.querySelector("td:nth-child(1)");
            const valueCell = row.querySelector("td:nth-child(2)");
            if (keyCell && valueCell) {
                const key = keyCell.textContent.replace(":", "").trim();
                if (desiredKeys.includes(key)) {
                    let value = '';
                    if (key === 'Network') {
                        const link = valueCell.querySelector('a');
                        if (link) {
                            const href = link.href;
                            const networkName = link.textContent.trim();
                            value = `[url=${href}]${networkName}[/url]`;
                        } else {
                            value = valueCell.textContent.trim();
                        }
                    } else {
                        value = valueCell.textContent.trim();
                    }
                    bbcodeInfo += `[b]${key}:[/b] ${value}\n`;
                }
            }
        });
    }

    // Genres
    let genreList = null;
    const sidebarDivs = document.querySelectorAll("#content > div.thin > div.sidebar > div");
    for (const div of sidebarDivs) {
        const strong = div.querySelector("strong");
        if (strong && strong.textContent.trim() === "Genres") {
            let nextElem = div.nextElementSibling;
            if (nextElem && nextElem.tagName.toLowerCase() === "ul") {
                genreList = nextElem;
            } else {
                genreList = div.querySelector("ul");
            }
            break;
        }
    }
    let bbcodeGenres = '';
    if (genreList) {
        const genres = Array.from(genreList.querySelectorAll("li a"))
        .map(a => `[url=${a.href}]${a.textContent.trim()}[/url]`);
        if (genres.length > 0) {
            bbcodeGenres = `\n[b][size=4]Genres[/size][/b]\n${genres.join(', ')}`;
        }
    }

    // Trailer parsing
    function getYouTubeLink() {
        return document.querySelector("object param[name='movie']")?.value ||
            document.querySelector("object embed[src*='youtube.com']")?.src;
    }
    function extractYouTubeId(url) {
        const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }
    let bbcodeTrailer = '';
    const trailerUrl = getYouTubeLink();
    const videoId = trailerUrl ? extractYouTubeId(trailerUrl) : null;
    if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
        bbcodeTrailer = `\n\n[align=center][b][size=4]Trailer[/size][/b][/align]\n[align=center][url=${videoPageUrl}][img]${thumbnailUrl}[/img][/url][/align]`;
    }


    textarea.value = `${bbcodeTitle}\n${bbcodeImage}${bbcodeSynopsis}\n\n${bbcodeInfo}${bbcodeGenres}\n${bbcodeTrailer}`;

    textarea.focus();
    textarea.select();
}

    function initBBCodeBox() {
        const form = document.createElement('form');
        form.id = 'gmab_bbcode';
        form.className = 'hidden';

        const textarea = document.createElement('textarea');
        textarea.title = 'BBCode';
        textarea.readOnly = true;
        textarea.rows = 5;
        textarea.addEventListener('click', selectThis);

        form.appendChild(document.createElement('br'));
        form.appendChild(textarea);

        // Add Copy button
        const copyBtn = document.createElement('button');
        copyBtn.id = 'gmab_copy_button';
        copyBtn.type = 'button';
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.style.marginBottom = '10px';
        copyBtn.style.marginLeft = '10px';
        copyBtn.addEventListener('click', () => {
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.warn('Failed to copy text: ', err);
            }
        });
        form.appendChild(copyBtn);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'seriesTopicCheckboxBB';
        checkboxLabel.textContent = ' Series Topic';
        checkboxLabel.style.userSelect = 'none';
        checkboxLabel.style.cursor = 'pointer';
        checkboxLabel.style.marginLeft = '10px';
        checkboxLabel.style.verticalAlign = 'middle';

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.id = 'seriesTopicCheckboxBB';
        checkboxInput.checked = GM_getValue('useSeriesBanner', false);
        checkboxInput.style.marginLeft = '6px';
        checkboxInput.style.verticalAlign = 'middle';

        checkboxInput.addEventListener('change', () => {
            GM_setValue('useSeriesBanner', checkboxInput.checked);
            // Refresh BBCode area if visible
            const bbcodeBox = document.getElementById('gmab_bbcode');
            if (bbcodeBox && !bbcodeBox.classList.contains('hidden')) {
                updateBBCodeArea();
            }
        });

        checkboxLabel.insertBefore(checkboxInput, checkboxLabel.firstChild);
        form.appendChild(checkboxLabel);

        linkbox.insertBefore(form, linkbox.firstChild);

        return form;
    }

    getBBCodeLink.addEventListener('click', onClickToggler);

})();
