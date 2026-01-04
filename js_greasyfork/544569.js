// ==UserScript==
// @name         Oxtorrent/Torrent911
// @namespace    https://greasyfork.org/users/PinkyGreasy
// @version      1.0.6
// @description  Ajoute filters, Open All, YouTube trailers, et series recherche pour Oxtorrent/Torrent911.
// @author       Pinky Greasy
// @license      MIT
// @include      /^https:\/\/.*(oxtorrent|torrent9|torrent911|t911|torrent).*\.[a-z]+\/.*(films|series|detail|torrent|recherche)?.*/
// @grant        none
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/544569/OxtorrentTorrent911.user.js
// @updateURL https://update.greasyfork.org/scripts/544569/OxtorrentTorrent911.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function searchTrailerOnYoutube(title) {
        // Clean up title for search (remove language tags, quality, year)
        let cleanTitle = title
        .replace(/\b(FRENCH|TRUEFRENCH|MULTI|ULTRA|VOSTFR|HDTS|CAM|MD|LD|REPACK|HDRip|WEBRIP)\b/gi, '')
        .replace(/\b(720p|1080p|2160p|4K)\b/gi, '')
        .replace(/\b\d{4}\b/g, '') // remove year
        .replace(/\s+/g, ' ')
        .trim();

        let youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + " trailer")}`;
        window.open(youtubeUrl, '_blank');
    }

    function createOpenAllButton() {
        if (document.querySelector('#openAllBtn')) return; // prevent duplicates

        // Container for button + checkbox
        let container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.margin = '10px 0';
        container.style.justifyContent = 'center';

        // Original button
        let btn = document.createElement('button');
        btn.id = 'openAllBtn';
        btn.innerText = 'Open All';
        btn.style.padding = '10px 15px';
        btn.style.background = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

        // Create YouTube checkbox
        let label = document.createElement('label');
        label.style.fontSize = '14px';
        label.style.cursor = 'pointer';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'youtubeTrailer';
        checkbox.style.marginRight = '5px';
        checkbox.checked = true;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode('YouTube trailer'));

        container.appendChild(btn);
        container.appendChild(label);

        document.querySelector('#dernierstorrents #trier')?.insertAdjacentElement("afterbegin", container);


        btn.addEventListener('click', function() {
            let links = [...document.querySelectorAll('.listing-torrent > table tr td:first-child a, .listing-torrent .banner-title a[title]')]
            .filter(link => link.offsetParent !== null);

            let groups = {};
            links.forEach(link => {
                const text = link.title || link.innerText.trim();
                const key = text
                .replace(/\b(FRENCH|TRUEFRENCH|MULTI|ULTRA|VOSTFR|HDTS|CAM|MD|LD|REPACK|HDRip|WEBRIP)\b.*$/gi, '')
                .replace(/\b(720p|1080p|2160p|4K)\b.*$/gi, '')
               // .replace(/\b\d{4}\b/g, '') // remove year
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

                //const quality = link.parentNode.querySelector('.banner-qualite');

                if (!groups[key]) groups[key] = [];
                groups[key].push({ link: link.href, text });
            });

            let selectedItems = [];
            for (let key in groups) {
                let items = groups[key];
                items.sort((a, b) => {
                    let score = (t) => {
                        if (/720p/i.test(t)) return 3;
                        if (/1080p/i.test(t)) return 2;
                        return 1; // fallback
                    };
                    return score(b.text) - score(a.text);
                });
                selectedItems.push(items[0]); // keep the object {link, text}
            }

           // console.log(`Opening ${selectedItems.length} unique items`);
            selectedItems.forEach(item => {
                if (checkbox.checked) {
                    searchTrailerOnYoutube(item.text); // Then open trailer tab
                }
                window.open(item.link, '_blank'); // Open torrent link
            });
        });
    }


    function hideOldMovies() {
        let list = document.querySelectorAll('.listing-torrent > table tr td:first-child, .listing-torrent .banner-title a[title]');
        let re = new RegExp(' (VOSTFR|HDTS|MD|LD|CAM) ');
        const d = new Date();
        if (list.length > 0) {
            list.forEach((el) => {
                const filmName = el.title || el.innerText; //console.log(el);
                if (re.test(filmName)) {
                    el.closest("tr")?.remove();
                    el.closest("li")?.remove();
                } else {
                    const year = filmName.trim().substr(-4);
                    if (parseInt(year) <= d.getFullYear() - 3) {
                        el.closest("tr")?.remove();
                        el.closest("li")?.remove();
                    }
                }
            });
        }
    }

    function openNewBackgroundTab(url) {
        var a = document.createElement("a");
        a.href = url;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
            true, false, false, false, 0, null);
        a.dispatchEvent(evt);
    }

    function tabifyLinks() {
        let links = document.querySelectorAll('.listing-torrent > table tr td:first-child a');
        links.forEach((el) => {
            el.onclick = function (e) {
                e.preventDefault();
                openNewBackgroundTab(el.href);
            }
        });
    }

    function highlightFrSeries() {
        let list = document.querySelectorAll('.listing-torrent > table tr td:first-child');
        let re = new RegExp(' VOSTFR ', 'i');
        if (list.length > 0) {
            list.forEach((el) => {
                const filmName = el.innerText;
                if (re.test(filmName)) {
                    el.closest("tr").style.opacity = "0.3";
                }
            });
        }
    }

    function copyTextToClipboard(element, text) {
        var textArea = document.createElement('textarea');
        textArea.style.position = 'absolute';
        textArea.style.opacity = '0';
        textArea.value = text;
        document.body.appendChild(textArea);

        var execCopy = e => {
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        };
        element.addEventListener('mouseup', execCopy, { once: true });
    }

    function downloadifyPoster() {
        let poster = document.querySelector('img.img-rounded');
        let download = document.querySelector('[class^="download"] a[href^="magnet"]')?.href || document.querySelector('#torrentsimage a[href*="magnet:"]')?.href;

        if (poster) {
            poster.style.cursor = "pointer";
            if (download) {
                let magnet = document.querySelector('[class^="download"] img[alt*="magnet"]') || document.querySelector('#torrentsimage a[href*="magnet:"]');
                if (magnet) {
                    poster.onmousedown = e => magnet.closest('a').click();
                }
            } else {
                poster.onmousedown = e => copyTextToClipboard(poster, download);
            }
        }
    }

    function youtubifyTitle() {
        let name = '';
        let searchUrl = '';
        let titles = document.querySelectorAll('.title > a[title], .block-detail .title:has(i.fa-bars)');
        if (titles.length > 0) {
            titles.forEach(titleEl => {
                name = (titleEl.title || titleEl.innerText).replace(/(MULTI|ULTRA|REPACK|FRENCH|TRUEFRENCH|HDRip).+/, '').trim();
                searchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(name) + " trailer";
                if(!titleEl.href){
                    titleEl.innerHTML = `<a href="${searchUrl}" target="_blank">${titleEl.innerHTML}</a>`;
                }
                titleEl.href = searchUrl;
                titleEl.target = '_blank';
            });
        }
        else {
            name = Array.from(document.querySelectorAll('#torrentsimage tr td:first-child')).find(td => td.textContent.includes("Titre:"))?.nextElementSibling?.innerText.replace(/(MULTI|ULTRA|REPACK|FRENCH|TRUEFRENCH|HDRip).+/, '').trim() || '';
            searchUrl = name ? "https://www.youtube.com/results?search_query=" + encodeURIComponent(name) + " trailer" : searchUrl;
        }

        // add Trailer button
        if(!searchUrl) return;
        const dataURI = 'data:image/png;base64,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';
        // Create <a> link wrapper
        const link = document.createElement('a');
        link.href = searchUrl;
        link.target = "_blank";
        link.style.textDecoration = "none";
        link.style.display = "inline-block";

        // Create container <div>
        const div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.borderRadius = "12px";
        div.style.overflow = "hidden";
        div.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

        // Add hover effects dynamically
        div.addEventListener("mouseenter", () => {
            div.style.transform = "scale(1.05)";
            div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        });
        div.addEventListener("mouseleave", () => {
            div.style.transform = "";
            div.style.boxShadow = "";
        });

        // Create the <button>
        const button = document.createElement('button');
        button.style.width = "130px";
        button.style.height = "50px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.borderRadius = "12px";
        button.style.backgroundImage = `url(${dataURI})`;
        button.style.backgroundPosition = "center";
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundSize = "contain";
        button.style.backgroundColor = "transparent";
        button.style.display = "block";

        // Append everything
        div.appendChild(button);
        link.appendChild(div);
        document.querySelector('#torrentsimage td:nth-child(2)').insertAdjacentElement("afterbegin", link);
        div.closest('td').style.display = "inline-flex";
        div.closest('td').style.width = "auto";
    }

    function cleanSerieName(rawName) {
        // Replace dots with spaces
        let name = rawName.replace(/\./g, ' ');

        // Capture everything up to SxxExx
        let match = name.match(/^(.*?\bS\d{2}E)\d{2}/i) || name.match(/^(.*?)\s+\b(FRENCH|TRUEFRENCH|MULTI|ULTRA|VOSTFR|HDTS|CAM|MD|LD|REPACK|HDRip|WEBRIP)\b/i);
        if (match) {
            return match[1].trim();
        }

        // If no SxxExx found, return cleaned name without extension
        return name.replace(/\.[^.]+$/, '').trim();
    }

    function searchifySerie() {
        const elements = document.querySelectorAll('#torrentsimage .maximums');

        elements.forEach(el => {
            el.style.cursor = "pointer";
            el.addEventListener('click', (e) => {
                e.preventDefault();
                let rawName = el.textContent.trim();
                let cleanedName = cleanSerieName(rawName);
                let searchUrl = `/recherche/${encodeURIComponent(cleanedName)}`;
                window.open(searchUrl, '_blank'); // open in new tab
            });
        });
    }

    function cleanSearchInput(){
        const searchInput = document.querySelector('form input[placeholder="Recherche..."]');

        searchInput.addEventListener('input', function(e) {
            // Replace all dots with spaces
            this.value = this.value.replace(/\./g, ' ');
        });

        searchInput.addEventListener('paste', function(e) {
            // Prevent default paste behavior
            e.preventDefault();

            // Get pasted text and replace dots with spaces
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const cleanedText = pastedText.replace(/\./g, ' ');

            // Insert cleaned text at cursor position
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const currentValue = this.value;

            this.value = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);

            // Set cursor position after inserted text
            const newPosition = start + cleanedText.length;
            this.setSelectionRange(newPosition, newPosition);
        });
    }


    setTimeout(() => {
        const page = location.href;
        console.log("Tampermonkey Script Loaded!", page);

        if (page.match(/(torrent|detail)\/[0-9]+/)) { console.log("page");
            downloadifyPoster();
            youtubifyTitle();
            searchifySerie();
        } else if (page.includes("series")) { console.log("series");
            highlightFrSeries();
            tabifyLinks();
        } else if (page.includes("films")) { console.log("films");
            hideOldMovies();
            tabifyLinks();
            createOpenAllButton();
        }
        cleanSearchInput();
    }, 1000);
})();
