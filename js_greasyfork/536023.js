// ==UserScript==
// @name         Turbowarp web svg search
// @namespace    https://powerpaint.pages.dev/scratch.js
// @version      1.0
// @description  Makes the costume search also include images from the web
// @author       pooiod7
// @match        https://turbowarp.org/*
// @match        https://mirror.turbowarp.xyz/*
// @match        https://studio.penguinmod.com/*
// @match        https://librekitten.org/*
// @match        https://alpha.unsandboxed.org/*
// @match        https://snail-ide.js.org/*
// @match        https://ampmod.codeberg.page/*
// @icon         https://cdn0.iconfinder.com/data/icons/seo-and-internet-marketing/70/SEO_and_Internet_Marketing-73-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536023/Turbowarp%20web%20svg%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/536023/Turbowarp%20web%20svg%20search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setupSearch(textbox, renderframe) {
        const input = textbox;
        const results = renderframe;

        let currentPage = 0;
        let totalPages = 1;
        let currentQuery = '';
        let loading = false;

        function importSVG(TEXT, NAME) {
            fetch(TEXT)
                .then((r) => r.arrayBuffer())
                .then((arrayBuffer) => {
                    const storage = vm.runtime.storage;
                    const asset = new storage.Asset(
                        storage.AssetType.ImageVector,
                        null,
                        storage.DataFormat.SVG,
                        new Uint8Array(arrayBuffer),
                        true
                    );
                    const newCostumeObject = {
                        md5: asset.assetId + '.' + asset.dataFormat,
                        asset: asset,
                        name: NAME
                    };
                    vm.addCostume(newCostumeObject.md5, newCostumeObject);
                    document.querySelector('span.button_outlined-button_1bS__.modal_back-button_2ej6v[role="button"]').click();
                });
        }

        function createCard(svgText, title = 'Untitled') {
            const outerDiv = document.createElement('div');
            outerDiv.className = 'library-item_library-item_1DcMO box_box_2jjDp';
            outerDiv.setAttribute('role', 'button');
            outerDiv.setAttribute('tabindex', '0');

            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'library-item_library-item-image-container-wrapper_x4EWB box_box_2jjDp';

            const imageContainer = document.createElement('div');
            imageContainer.className = 'library-item_library-item-image-container_3dqjX box_box_2jjDp';

            const img = document.createElement('img');
            img.className = 'library-item_library-item-image_2bORn';
            img.setAttribute('draggable', 'false');
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));

            imageContainer.appendChild(img);
            wrapperDiv.appendChild(imageContainer);
            outerDiv.appendChild(wrapperDiv);

            const span = document.createElement('span');
            span.className = 'library-item_library-item-name_2qMXu';
            span.textContent = title;

            outerDiv.appendChild(span);

            outerDiv.onclick = () => {
                const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
                importSVG(dataUri, title);
            };

            return outerDiv;
        }

        async function fetchSVGs(page, query) {
            loading = true;
            let url = `https://www.svgviewer.dev/api/svg?page=${page}&limit=50`;
            if (query) url += `&search=${encodeURIComponent(query)}`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

            const res = await fetch(proxyUrl);
            if (!res.ok) {
                loading = false;
                return;
            }

            const data = await res.json();
            totalPages = data.pages || 1;

            if (page === 0) {
                results.innerHTML = '';
            }

            data.data.forEach(item => {
                const card = createCard(item.text, item.title);
                results.appendChild(card);
            });

            loading = false;
        }

        function startSearch(query) {
            currentPage = 0;
            totalPages = 1;
            currentQuery = query;
            results.innerHTML = '';
            if (query && query != "") {
                fetchSVGs(currentPage, currentQuery);
            }
        }

        let timeout;
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                clearTimeout(timeout);
                startSearch(input.value.trim());
            }
        });

        input.addEventListener('input', () => {
            clearTimeout(timeout);
            results.innerHTML = '';
            timeout = setTimeout(() => {
                startSearch(input.value.trim());
            }, 1000);
        });

        window.addEventListener('scroll', () => {
            if (loading) return;
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                if (currentPage + 1 < totalPages) {
                    currentPage++;
                    fetchSVGs(currentPage, currentQuery);
                }
            }
        });
    }

    let lastSeenCostumeLib = false;
    setInterval(async () => {
        const target = document.querySelector('.library_library-scroll-grid_1jyXm');
        const input = document.querySelector('.library_filter-input_6w2X2');
        const currentlyVisible = !!target;

        if (document.querySelector('.modal_header-item_2zQTd.modal_header-item-title_tLOU5')?.textContent.includes('Extension') || false) return;

        if (currentlyVisible && !lastSeenCostumeLib && input) {
            const element = document.createElement("div");
            element.className = "library_library-scroll-grid_1jyXm";
            element.style.width = "100%";
            element.style.height = "auto";
            element.style.minHeight = "fit-content";
            element.style.margin = "0px";
            element.style.padding = "0px";
            element.id = "iconSearch";

            await new Promise(resolve => {
                const check = () => {
                    if (target.firstChild) resolve(target.firstChild);
                    else requestAnimationFrame(check);
                };
                check();
            });

            target.insertBefore(element, target.firstChild);

            setupSearch(input, element);
        }

        lastSeenCostumeLib = currentlyVisible;
    }, 500);
})();
