// ==UserScript==
// @name         Mydealz Kategorienfilter
// @description  blendet auf Übersichtsseiten Deals aus vom User festgelegten Kategorien aus
// @namespace    Tampermonkey Scripts
// @match        https://www.mydealz.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/525925/Mydealz%20Kategorienfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/525925/Mydealz%20Kategorienfilter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let kategorien = [];

    // Popup Template mit Overlay
    const popupTemplate = `
    <div class="modal-backdrop" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 9998;"></div>

    <section role="dialog" class="popover popover--default zIndex--modal popover--layout-modal popover--visible"
             style="
             position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
             width: 600px; z-index: 9999;">
      <div class="popover-content flex--inline popover-content--expand">
        <div class="flex flex--dir-col height--min-100 width--all-12">
          <header class="popover-space flex boxAlign-ai--all-fs color--text-TranslucentPrimary">
            <strong class="size--all-l text--b">Auszublendende Kategorien</strong>
            <button type="button" class="space--ml-a button button--shape-circle button--type-tertiary button--mode-default button--size-s button--square" id="closeBtn">
              <span class="flex--inline boxAlign-ai--all-c">
                <svg width="16" height="16" class="icon icon--cross">
                  <use xlink:href="/assets/img/ico_707ed.svg#cross"></use>
                </svg>
              </span>
            </button>
          </header>

          <div class="popover-body overflow--scrollY overscroll--containY color--text-TranslucentPrimary popover-space">
            <form id="categoryForm">
              <!-- Kategorien werden dynamisch eingefügt -->
            </form>
          </div>

          <footer class="popover-space flex boxAlign-jc--all-fe">
            <button type="submit" class="button button--type-primary button--mode-brand" id="saveBtn">
              Auswahl speichern
            </button>
          </footer>
        </div>
      </div>
    </section>`;

    async function fetchKategorien() {
        const query = `
            query siteNavigationMenu {
                groups: groups(default: {is: true}) {
                    threadGroupId
                    threadGroupName
                    threadGroupUrlName
                }
            }`;

        try {
            const response = await fetch('https://www.mydealz.de/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            const categories = data.data.groups.map(group => ({
                id: group.threadGroupId,
                name: group.threadGroupName,
                url: group.threadGroupUrlName
            }));

            // Pseudo-Kategorien hinzufügen
            categories.push(
                { id: "800001", name: "NSFW Deals", url: "nsfw" },
                { id: "800002", name: "Gepushte Deals", url: "isPushed" }
            );

            return categories;

        } catch (error) {
            console.error('Fehler beim Laden der Kategorien:', error);
            return [];
        }
    }

    function addFilterMenuItem() {
    const savedDealsLink = document.querySelector('a[href*="saved-deals"]');
    if (!savedDealsLink) return;

    const existingFilterLink = document.querySelector('.navDropDown-link.filterLink');
    if (existingFilterLink) return; // Verhindert Duplikate

    const filterLink = document.createElement('a');
    filterLink.className = 'navDropDown-link lbox--v-8 lbox--f text--b filterLink';
    filterLink.style.cursor = 'pointer';
    filterLink.innerHTML = `
        <span class="lbox--h-1 space--mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666666"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
        </span>
        Meine Filter
    `

    savedDealsLink.parentNode.insertBefore(filterLink, savedDealsLink.nextSibling);
    filterLink.addEventListener('click', showFilterDialog);
}

    function renderCategories(categories) {
        const normalCats = categories
            .filter(cat => cat.name !== 'Freebies' &&
                          categories.indexOf(cat) < categories.findIndex(c => c.name === 'Freebies') &&
                          parseInt(cat.id) < 800000)
            .sort((a, b) => a.name.localeCompare(b.name));

        const pseudoCats = categories
            .filter(cat => parseInt(cat.id) >= 800000)
            .sort((a, b) => a.name.localeCompare(b.name));

        const totalNormalCats = normalCats.length;
        const half = Math.ceil(totalNormalCats / 2);

        const leftColumn = normalCats.slice(0, half);
        const rightColumn = normalCats.slice(half);

        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 10px;">
                <div>
                    ${leftColumn.map(cat => renderItem(cat)).join('')}
                    ${pseudoCats.length > 0 ? '<div style="margin: 20px 0"></div>' : ''}
                    ${pseudoCats.map(cat => renderItem(cat)).join('')}
                </div>
                <div>
                    ${rightColumn.map(cat => renderItem(cat)).join('')}
                </div>
            </div>
        `;
    }

    function renderItem(cat) {
        return `
            <div class="category-item" style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center;">
                    <input type="checkbox"
                        style="margin-right: 8px; width: 16px; height: 16px;"
                        name="category"
                        value="${cat.id}"
                        data-name="${cat.name}"
                        data-url="${cat.url}">
                    <span>${cat.name}</span>
                </label>
            </div>`;
    }

    function saveSelection(form) {
        const selected = [...form.querySelectorAll('input:checked')].map(input => ({
            threadGroupId: input.value,
            threadGroupName: input.dataset.name,
            threadGroupUrl: input.dataset.url
        }));

        localStorage.setItem('hiddenCategories', JSON.stringify(selected));
    }

    function hideUnwantedCategories() {
        const hiddenCategories = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');
        const articles = document.querySelectorAll('article.thread');

        articles.forEach(article => {
            const vueData = article.querySelector('.js-vue2')?.dataset?.vue2;
            if (vueData) {
                const threadData = JSON.parse(vueData);
                const thread = threadData?.props?.thread;

                if (hiddenCategories.some(cat => cat.threadGroupId === "800001") && thread.nsfw === true) {
                    article.style.display = 'none';
                    return;
                }

                if (hiddenCategories.some(cat => cat.threadGroupId === "800002") && thread.isPushed === true) {
                    article.style.display = 'none';
                    return;
                }

                if (thread.mainGroup && hiddenCategories.some(cat =>
                    cat.threadGroupId === thread.mainGroup.threadGroupId.toString())) {
                    article.style.display = 'none';
                }
            }
        });
    }

function closePopup() {
    const popup = document.querySelector('.popover');
    if (popup) popup.remove();

    const overlay = document.querySelector('.modal-backdrop');
    if (overlay) overlay.remove();

    // Sicherstellen, dass das Menü nicht geöffnet ist
    const navDropdown = document.querySelector('.navDropDown.dropdown.isActive');
    if (navDropdown) {
        navDropdown.classList.remove('isActive');
    }

    // Unerwünschte Kategorien ausblenden
    hideUnwantedCategories();

    // Menüpunkt "Meine Filter" neu hinzufügen
    addFilterMenuItem();
}

init();

    function showFilterDialog(event) {
        event.preventDefault();
        event.stopPropagation();

        // Vorhandenes Popup entfernen, um Duplikate zu vermeiden
        const existingPopup = document.querySelector('.popover');
        if (existingPopup) {
            existingPopup.remove();
            const existingOverlay = document.querySelector('.modal-backdrop');
            if (existingOverlay) existingOverlay.remove();
        }

        // Menü schließen durch simulierten Klick auf den Schließen-Button
        const closeButton = document.querySelector('.navDropDown-head .button--shape-circle');
        if (closeButton) {
            closeButton.click();
            // Warte kurz, damit das Menü vollständig schließen kann
            setTimeout(() => {
                document.body.insertAdjacentHTML('beforeend', popupTemplate);
                initializePopup();
            }, 100);
        } else {
            document.body.insertAdjacentHTML('beforeend', popupTemplate);
            initializePopup();
        }
    }

    function initializePopup() {
        const form = document.getElementById('categoryForm');

        fetchKategorien().then(categories => {
            form.innerHTML = renderCategories(categories);

            // Setze gespeicherte Auswahl
            const saved = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');
            saved.forEach(item => {
                const checkbox = form.querySelector(`input[value="${item.threadGroupId}"]`);
                if (checkbox) checkbox.checked = true;
            });
        });

        // Event Listener zurücksetzen und erneut hinzufügen
        const closeBtnOld = document.getElementById('closeBtn');
        const closeBtn = closeBtnOld.cloneNode(true);
        closeBtnOld.parentNode.replaceChild(closeBtn, closeBtnOld);

        const saveBtnOld = document.getElementById('saveBtn');
        const saveBtn = saveBtnOld.cloneNode(true);
        saveBtnOld.parentNode.replaceChild(saveBtn, saveBtnOld);

        closeBtn.addEventListener('click', () => closePopup());
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveSelection(form);
            closePopup();
        });
    }

    function init() {
        // Filter-Menü auf allen Seiten hinzufügen
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector('.navDropDown-link')) {
                addFilterMenuItem();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // hideUnwantedCategories nur auf Übersichtsseiten ausführen
        if (window.location.href.startsWith('https://www.mydealz.de/deals') &&
            !/\/deals\/.*[0-9]/.test(window.location.href)) {

            hideUnwantedCategories();

            // Observer für dynamische Inhalte
            const contentObserver = new MutationObserver(hideUnwantedCategories);
            contentObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    init();

})();
