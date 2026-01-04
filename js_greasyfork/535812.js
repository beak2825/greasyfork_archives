// ==UserScript==
// @name          IMDb-Lists-Highlighter
// @author        tronix42
// @copyright     2025, tronix42
// @copyright     2008-2024, Ricardo Mendonca Ferreira (original script - IMDb 'My Movies' enhancer)
// @namespace     http://example.com/
// @version       1.2
// @description   highlights movie titles, series titles, and people from your lists
// @include       *://*.imdb.com/*
// @grant         none
// @run-at        document-idle
// @license       GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/535812/IMDb-Lists-Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/535812/IMDb-Lists-Highlighter.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------
//
// Thanks to AltoRetrato and his work with the great "IMDb 'My Movies' enhancer" Userscript.
// https://openuserjs.org/scripts/AltoRetrato/IMDb_My_Movies_enhancer
//
// This userscript highlights movie titles, series titles, and people from your lists. This way, you can immediately see which
// movies or series you've already seen or have on your watchlist while browsing IMDb. If you have lists of your
// favorite actors/actresses, you can see them highlighted in the calendar when they appear in a new film.
//
// This all works so far, with a small limitation. Custom lists and watchlist working fine. Unfortunately,
// the ratings list and check-in list don't work via automatic import. You have to take a detour for that.
// You can either manually import the ratings CSV file (which you downloaded previously) or create a custom list
// and add all rated films to it, which you then import via the script.
//
// A "Configure List" button will appear on the list page. All recognized lists will then be in the configuration,
// where you can assign each list a unique color. If you simply check the box next to the list WITHOUT uploading
// a CSV file, the lists will be imported automatically (as mentioned, this unfortunately doesn't work for
// ratings or check-ins). If you check the box AND upload a CSV file, the import will be done manually.
//
// As soon as you click Start Import, all lists to be imported will be displayed, along with a progress circle.
// When the import of a list is complete, the number of imported entries will be displayed next to it.
// After the import is finished, reload the page, and all imported entries should be highlighted.

// All custom colors will be saved. You don't have to import all lists at once. Nothing will be lost if you import
// another list later. Clear Data deletes all data!
//
//
// History:
// --------
// 2025.05.26  [1.2] Added Tooltip, couple other changes
// 2025.05.19  [1.1] Added Fallback for GM_addStyle (Greasemonkey)
// 2025.05.12  [1.0] Public Release
// --------------------------------------------------------------------

(function() {
    'use strict';
    // === Tooltip-CSS ===
    addStyle(`
    .imdb-tooltip {
      position: absolute;
      background: rgba(0,0,0,0.8);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 10000;
      white-space: normal;
  line-height: 1.4;
  font-family: system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;

    }
    `);

    // === Tooltip-Config ===
    let showTooltips = true;
    try {
        const v = localStorage.getItem('showTooltips');
        if (v !== null) showTooltips = JSON.parse(v);
    } catch (e) {}

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Persistent People-Map
    let namesToColor = {};
    try {
        namesToColor = JSON.parse(localStorage.getItem('namesToColor') || '{}');
    } catch (e) {
        namesToColor = {};
    }

    let myLists = [],
        listOrder = [];
    let progressModal = null;
    let progressItems = [];

    function getCurrentUser() {
        const el = document.querySelector('[data-testid="user-menu-toggle-name"]') ||
            document.querySelector('.navbar__user-menu-toggle__name') ||
            document.querySelector('#nbpersonalize strong');
        return el ? el.textContent.trim() : null;
    }

    function getStorageUser() {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k.startsWith('myMovies-')) return k.slice(9);
        }
        return null;
    }

    function getUserId() {
        const link = document.querySelector('a[href*="/user/ur"]');
        if (link) {
            const m = link.href.match(/\/user\/(ur\d+)\//);
            if (m) return m[1];
        }
        return null;
    }

    const user = getCurrentUser() || getStorageUser();
    // Check language Regex
    const pathParts = window.location.pathname.split('/');
    const langSegment = pathParts[1];
    const langRegex = /^[a-z]{2}(?:-[A-Z]{2})?$/i;
    const countryPath = langRegex.test(langSegment) ? `/${langSegment}` : '';
    if (!user) return;

    // 1) Load lists from LocalStorage
    const listsLoaded = loadLists();

    // 2) Config-Button (Lists URL)
    if (/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?user\/ur\d+\/lists/i.test(location.pathname)) {
        // (a) Load Database
        let savedListsMap = {};
        if (listsLoaded) {
            myLists.forEach(l => {
                savedListsMap[l.id] = {
                    ids: JSON.parse(JSON.stringify(l.ids)),
                    names: l.names ? JSON.parse(JSON.stringify(l.names)) : {},
                    color: l.color,
                    selected: l.selected
                };
            });
        }

        // (b) Show all Lists
        collectLists();
        addConfigButton();

        // (c) Overwrite Data
        Object.entries(savedListsMap).forEach(([id, data]) => {
            const lst = myLists.find(x => x.id === id);
            if (lst) {
                lst.ids = data.ids;
                lst.names = data.names;
                lst.color = data.color;
                lst.selected = data.selected;
            }
        });

        // Stylesheet Lists
        if (/^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?user\/ur\d+\/lists/.test(location.pathname)) {
            const cssRules = [];
            myLists.forEach(list => {
                const color = list.color;
                Object.keys(list.ids).forEach(code36 => {
                    const num = parseInt(code36, 36);
                    cssRules.push(
                        `a[href*="/title/tt${num}/?ref_"] {` +
                        ` color: ${color} !important; font-weight: bold !important; }`
                    );
                });
            });
            addStyle(cssRules.join('\n'));
            highlightLinks();
        }
    }

    // 3) CSS and Search-Highlight

    const isHome = location.pathname === '/';
    const isCalendar = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?calendar/i.test(location.pathname);

    // A) Stylesheet on all sites beside calendar
    if (!isCalendar) {
        let css = '';
        myLists.forEach(list => {
            const color = list.color;
            Object.keys(list.ids).forEach(code36 => {
                const num = parseInt(code36, 36);
                const idPadded = String(num).padStart(7, '0');
                // Title-Links
                css += `
a[href^="/title/tt${num}/?ref_="],
a[href^="https://www.imdb.com/title/tt${num}/?ref_="] {
  color: ${color} !important;
  font-weight: bold !important;
}
`;
                // People-Links
                css += `
a[href^="/name/nm${idPadded}/?ref_="],
a[href^="https://www.imdb.com/name/nm${idPadded}/?ref_="] {
  color: ${color} !important;
  font-weight: bold !important;
}
`;
            });
        });
        addStyle(css);
    }

    // B) JS-Highlight
    highlightTitle();
    highlightLinks();

    // C) Observer & Autocomplete-Dropdowns
    let moTimeout;
    const linkObserver = new MutationObserver(() => {
        clearTimeout(moTimeout);
        moTimeout = setTimeout(() => {
            highlightTitle();
            highlightLinks();
        }, 100);
    });

    linkObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('beforeunload', () => {
        linkObserver.disconnect();
    });

    // D) Calendar Highlighting
    if (isCalendar) {
        highlightTitle();
        highlightLinks();
        highlightCalendarPeople();
        let calTimeout;
        const calObserver = new MutationObserver(() => {
            clearTimeout(calTimeout);
            calTimeout = setTimeout(() => {
                highlightCalendarPeople();
            }, 100);
        });
        calObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('beforeunload', () => calObserver.disconnect());
    }

    function collectLists() {
        let savedColors = {};
        if (listsLoaded) {
            savedColors = myLists.reduce((map, l) => {
                map[l.id] = l.color;
                return map;
            }, {});
        }
        const customColors = {
            "Your Watchlist": "DarkGoldenRod",
            "Your Ratings": "Green"
        };
        const defaultColor = 'Red';
        myLists = [];
        listOrder = [];
        const seen = new Set();
        [
            ["Your Watchlist", "watchlist"],
            ["Your Ratings", "ratings"],
            ["Your check-ins", "checkins"]
        ].forEach(([name, id], i) => {
            myLists.push({
                name,
                id,
                color: savedColors[id] || customColors[name] || defaultColor,
                ids: {},
                names: {},
                selected: false,
                csvFile: null,
                importMode: 'auto'
            });
            listOrder.push(i);
            seen.add(id);
        });
        document.querySelectorAll('a[href*="/list/ls"]').forEach(a => {
            const m = a.href.match(/\/list\/(ls\d+)/);
            if (!m) return;
            const id = m[1];
            if (seen.has(id)) return;
            seen.add(id);
            const raw = a.getAttribute('aria-label') || a.title || a.textContent.trim();
            const name = raw
                // remove all Prefix-Keywords for list names
                .replace(/^.*\b(?:for|für|para|pour|per|de)\b\s*/i, '')
                .replace(/\s*(?:के लिए सूची का पेज देखें)$/i, '')
                .trim();
            myLists.push({
                name,
                id,
                color: savedColors[id] || defaultColor,
                ids: {},
                names: {},
                selected: false,
                csvFile: null,
                importMode: 'auto'
            });
            listOrder.push(myLists.length - 1);
        });
    }

    function addConfigButton() {
        const h1 = document.querySelector('h1');
        if (!h1) return;
        const btn = document.createElement('button');
        btn.textContent = 'Configure lists';
        btn.style.margin = '0 10px';
        btn.onclick = openConfig;
        h1.parentNode.insertBefore(btn, h1.nextSibling);
    }

    function openConfig() {
        // 1) Toggle-Switch CSS
        if (!document.getElementById('imdb-toggle-style')) {
            const style = document.createElement('style');
            style.id = 'imdb-toggle-style';
            style.textContent = `
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin: 0 8px;
  vertical-align: middle;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: #4CAF50;
}
.switch input:checked + .slider:before {
  transform: translateX(26px);
}
        `;
            document.head.appendChild(style);
        }

        // 2) load saved settings
        let savedListsMap = {};
        if (listsLoaded) {
            myLists.forEach(l => {
                savedListsMap[l.id] = {
                    ids: JSON.parse(JSON.stringify(l.ids)),
                    color: l.color,
                    selected: l.selected,
                    importMode: l.importMode || 'auto'
                };
            });
        }

        // 3) load lists
        collectLists();

        // 3) Modal & Box
        const modal = document.createElement('div');
        modal.id = 'imdb-config-modal';
        modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.5);display:flex;' +
            'align-items:center;justify-content:center;';
        const box = document.createElement('div');
        box.style = 'background:#fff;padding:20px;max-height:80%;overflow:auto;' +
            'min-width:600px;';

        // 4) Header
        const header = document.createElement('div');
        header.style = 'display:flex;align-items:center;justify-content:flex-start;margin-bottom:8px;font-weight:bold;';
        const hChk = document.createElement('span');
        hChk.style = 'width:1px;';
        const hLists = document.createElement('span');
        hLists.textContent = 'Select List(s):';
        hLists.style = 'margin-right:80px;';
        const hColor = document.createElement('span');
        hColor.textContent = 'Color - HEX/Name:';
        hColor.style = 'margin-right:40px;';
        const hMode = document.createElement('span');
        hMode.textContent = 'Import Mode:';
        hMode.style = 'margin-right:130px;';
        const hStatus = document.createElement('span');
        hStatus.textContent = 'Status:';
        hStatus.style = 'margin-right:8px;';
        header.append(hChk, hLists, hColor, hMode, hStatus);
        box.appendChild(header);

        // 5) Header-Content
        myLists.forEach((lst, i) => {
            // use saved data
            const sav = savedListsMap[lst.id];
            if (sav) {
                lst.ids = sav.ids;
                lst.color = sav.color;
                lst.selected = sav.selected;
                lst.importMode = sav.importMode;
            }

            // load importMode-Persistence
            const savedModes = JSON.parse(localStorage.getItem('imdbListsImportModes') || '[]');
            const modesMap = savedModes.reduce((m, o) => (m[o.id] = o.importMode, m), {});
            myLists.forEach(lst => {
                if (modesMap[lst.id] != null) {
                    lst.importMode = modesMap[lst.id];
                }
            });
            // —–
            const row = document.createElement('div');
            row.style = 'margin:5px 0; display:flex; align-items:center;';

            // a) Lists checkboxes
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'list-select';
            chk.style = 'margin-right:8px;';
            chk.checked = lst.selected;
            chk.defaultChecked = lst.selected;
            chk.onchange = e => {
                lst.selected = e.target.checked;
                if (!lst.selected) lst.csvFile = null;
            };

            // b) Lists label
            const lbl = document.createElement('span');
            lbl.textContent = ' ' + lst.name + ' ';
            lbl.style = 'display:inline-block;width:145px;line-height:20px;margin-right:8px;cursor:default;font-weight:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

            if (Object.keys(lst.ids).length > 0) {
                lbl.style.color = lst.color;
                lbl.style.fontWeight = 'bold';
            }

            // c) Hidden File-Input for CSV import
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv';
            fileInput.style.display = 'none';
            fileInput.onchange = e => {
                lst.csvFile = e.target.files[0];
                chooseBtn.textContent = 'Ready!';
            };

            // d) CSV-Button
            const chooseBtn = document.createElement('button');
            chooseBtn.type = 'button';
            chooseBtn.textContent = 'Select CSV';
            chooseBtn.style = 'width:90px;height:24px;margin-left:8px;margin-right:15px;background-color:#ffcc00;';
            chooseBtn.addEventListener('click', () => fileInput.click());

            // e) Color-Picker
            const col = document.createElement('input');
            col.type = 'color';

            col.value = nameToHex(lst.color);
            col.style = 'width:35px;height:25px;margin-left:2px;margin-right:20px;';
            col.oninput = e => {
                lst.color = e.target.value;
                txt.value = e.target.value;
                if (Object.keys(lst.ids).length > 0) {
                    lbl.style.color = lst.color;
                    lbl.style.fontWeight = 'bold';
                }
            };

            // f) Text-Input for HEX/String
            const txt = document.createElement('input');
            txt.type = 'text';
            txt.value = lst.color.toLowerCase();
            txt.placeholder = '#Hex or Name';
            txt.style = 'width:100px;margin-left:auto;margin-right:8px;';
            txt.oninput = e => {
                const v = e.target.value.trim().toLowerCase();
                lst.color = v;
                if (/^#([0-9A-Fa-f]{6})$/.test(v)) {
                    col.value = v;
                } else {
                    try { col.value = nameToHex(v); } catch {}
                }
                if (Object.keys(lst.ids).length > 0) {
                    lbl.style.color = lst.color;
                    lbl.style.fontWeight = 'bold';
                }
            };

            // g) Toggle-Switch for all List (not Ratings & Check-ins)
            const switchLabel = document.createElement('label');
            switchLabel.className = 'switch';
            switchLabel.style.marginLeft = '10px';
            const switchInput = document.createElement('input');
            switchInput.type = 'checkbox';
            // Ratings & Check-ins only manual
            if (lst.id === 'ratings' || lst.id === 'checkins') {
                switchInput.checked = false;
            } else {
                switchInput.checked = lst.importMode === 'auto';
            }
            const slider = document.createElement('span');
            slider.className = 'slider';
            switchLabel.append(switchInput, slider);

            const modeText = document.createElement('span');
            modeText.textContent = switchInput.checked ? 'Auto' : 'Manual';
            modeText.style = 'margin-right:8px;';
            modeText.style.display = 'inline-block';
            modeText.style.width = '50px';
            modeText.style.minWidth = '50px';
            modeText.style.maxWidth = '50px';
            modeText.style.overflow = 'hidden';
            modeText.style.whiteSpace = 'nowrap';

            // show CSV-Button on Manual-Mode & for Ratings/Check-ins
            if (lst.id === 'ratings' || lst.id === 'checkins') {
                chooseBtn.style.visibility = 'visible';
            } else {
                chooseBtn.style.visibility = lst.importMode === 'manual' ? 'visible' : 'hidden';
            }

            // Special-Handler for Ratings & Check-ins
            if (lst.id === 'ratings' || lst.id === 'checkins') {
                switchInput.addEventListener('click', e => {
                    e.preventDefault();
                    alert('Only CSV Import possible for Your Ratings-List and Check-Ins-List!');
                    // take care Toggle is only on manual
                    switchInput.checked = false;
                    modeText.textContent = 'Manual';
                });
            } else {
                // Toggle behaviour for all other lists
                switchInput.onchange = () => {
                    lst.importMode = switchInput.checked ? 'auto' : 'manual';
                    modeText.textContent = switchInput.checked ? 'Auto' : 'Manual';
                    modeText.style.display = 'inline-block';
                    modeText.style.width = '50px';
                    modeText.style.minWidth = '50px';
                    modeText.style.maxWidth = '50px';
                    modeText.style.overflow = 'hidden';
                    modeText.style.whiteSpace = 'nowrap';
                    chooseBtn.style.visibility = lst.importMode === 'manual' ? 'visible' : 'hidden';

                };
            }

            // h) Import-Count
            const countInput = document.createElement('input');
            countInput.type = 'text';
            countInput.readOnly = true;
            const count = lst.ids ? Object.keys(lst.ids).length : 0;
            countInput.value = count;
            countInput.dataset.listIdx = i;
            countInput.style = 'width:60px; box-sizing:border-box; text-align:right;';
            const wrapper = document.createElement('div');
            wrapper.style = 'position:relative; width:60px; margin-left:auto; box-sizing:border-box;';
            wrapper.appendChild(countInput);

            row.append(chk, lbl, txt, col, switchLabel, modeText, fileInput, chooseBtn, wrapper);
            box.appendChild(row);

        });

        // 6) Button Start Import, Clear Data, Close, Tooltip
        const imp = document.createElement('button');
        imp.id = 'start-import-btn';
        imp.type = 'button';
        imp.textContent = 'Start Import';
        imp.style = 'margin:10px;';
        imp.onclick = (e) => {
            e.preventDefault();
            // deactivate Buttons Start import, Clear Data during Import
            document.getElementById('start-import-btn').disabled = true;
            document.getElementById('start-import-btn').style.opacity = '0.5';
            document.getElementById('start-import-btn').style.pointerEvents = 'none';
            document.getElementById('clear-data-btn').disabled = true;
            document.getElementById('clear-data-btn').style.opacity = '0.5';
            document.getElementById('clear-data-btn').style.pointerEvents = 'none';

            // --- deactivate Lists checkboxes during Import
            document.querySelectorAll('input.list-select[type="checkbox"]').forEach(cb => {
                cb.disabled = true;
                cb.style.opacity = '0.5';
                cb.style.pointerEvents = 'none';
            });

            // --- deactivate color pocker during Import
            document.querySelectorAll('input[type="color"]').forEach(cp => {
                cp.disabled = true;
                cp.style.opacity = '0.5';
                cp.style.pointerEvents = 'none';
            });

            // --- deactivate toggle switch during Import
            document.querySelectorAll('.switch input[type="checkbox"]').forEach(sw => {
                sw.disabled = true;
                sw.style.opacity = '0.5';
                sw.style.pointerEvents = 'none';
            });

            // --- deactivate fileinput during Import
            document.querySelectorAll('input[type="file"]').forEach(fi => {
                fi.disabled = true;
                fi.style.opacity = '0.5';
                fi.style.pointerEvents = 'none';
            });

            // start Import & show progress circle
            startImport();
        };

        const clr = document.createElement('button');
        clr.textContent = 'Clear Data';
        clr.id = 'clear-data-btn';
        clr.style = 'margin:10px;';
        clr.onclick = () => {
            // deactive Buttons
            document.getElementById('start-import-btn').disabled = true;
            document.getElementById('start-import-btn').style.opacity = '0.5';
            document.getElementById('start-import-btn').style.pointerEvents = 'none';
            document.getElementById('clear-data-btn').disabled = true;
            document.getElementById('clear-data-btn').style.opacity = '0.5';
            document.getElementById('clear-data-btn').style.pointerEvents = 'none';

            eraseData();
            alert('Data cleared');
            document.body.removeChild(modal);
        };

        const cxl = document.createElement('button');
        cxl.textContent = 'Close';
        cxl.style = 'margin:10px;';
        cxl.onclick = () => {
            // 1) UI: unmarkd all lists checkboxes
            document
                .querySelectorAll('#imdb-config-modal input.list-select[type="checkbox"]')
                .forEach(cb => cb.checked = false);

            // 2) reset Lists-Data
            myLists.forEach(lst => {
                lst.selected = false;
                lst.csvFile = null;
            });

            // 3) close config-lists-menu
            if (modal && modal.parentNode) {
                document.body.removeChild(modal);
            }
        };

        const btnRow = document.createElement('div');
        btnRow.style = 'margin:4px 0; display:flex; align-items:center;';

        // Bottom left button "Start Import", "Clear Data", "Close" order
        btnRow.append(imp, clr, cxl);

        // Bottom right Tooltip-Checkbox
        const tooltipRow = document.createElement('div');
        tooltipRow.style = 'display:flex; align-items:center; margin-left:auto;';

        const tooltipChk = document.createElement('input');
        tooltipChk.type = 'checkbox';
        tooltipChk.checked = showTooltips;
        tooltipChk.onchange = e => {
            showTooltips = e.target.checked;
            saveTooltipSetting(e.target.checked);
        };

        const tooltipLbl = document.createElement('label');
        tooltipLbl.textContent = 'Show Tooltips';
        tooltipLbl.style = 'margin-left:6px;';

        tooltipRow.append(tooltipChk, tooltipLbl);
        btnRow.appendChild(tooltipRow);

        box.appendChild(btnRow);
        modal.appendChild(box);
        document.body.appendChild(modal);
    }


    // startImport: CSV import vs. automatic import
    function startImport() {
        if (!document.getElementById('spinStyleInline')) {
            const spinStyle = document.createElement('style');
            spinStyle.id = 'spinStyleInline';
            spinStyle.textContent = `
    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
            document.head.appendChild(spinStyle);
        }
        const tasks = [];
        for (let i = 0; i < myLists.length; i++) {
            const l = myLists[i];
            if (!l.selected) continue;

            // Ratings & Check-ins: only Manual-Import via CSV
            if (l.id === 'ratings' || l.id === 'checkins') {
                if (l.csvFile) {
                    tasks.push({ type: 'csv', idx: i });
                } else {
                    alert('No CSV-File selected!');
                    // === re-enable UI after alert===
                    ['start-import-btn', 'clear-data-btn'].forEach(id => {
                        const btn = document.getElementById(id);
                        if (btn) {
                            btn.disabled = false;
                            btn.style.opacity = '';
                            btn.style.pointerEvents = '';
                        }
                    });
                    document.querySelectorAll('input.list-select[type="checkbox"]').forEach(cb => {
                        cb.disabled = false;
                        cb.style.opacity = '';
                        cb.style.pointerEvents = '';
                    });
                    document.querySelectorAll('input[type="color"]').forEach(cp => {
                        cp.disabled = false;
                        cp.style.opacity = '';
                        cp.style.pointerEvents = '';
                    });
                    document.querySelectorAll('.switch input[type="checkbox"]').forEach(sw => {
                        sw.disabled = false;
                        sw.style.opacity = '';
                        sw.style.pointerEvents = '';
                    });
                    document.querySelectorAll('input[type="file"]').forEach(fi => {
                        fi.disabled = false;
                        fi.style.opacity = '';
                        fi.style.pointerEvents = '';
                    });
                    return false;
                }
                continue;
            }

            // all other lists
            if (l.importMode === 'manual') {
                if (l.csvFile) {
                    tasks.push({ type: 'csv', idx: i });
                } else {
                    alert('No CSV-File selected!');
                    // === re-enable UI after alert===
                    ['start-import-btn', 'clear-data-btn'].forEach(id => {
                        const btn = document.getElementById(id);
                        if (btn) {
                            btn.disabled = false;
                            btn.style.opacity = '';
                            btn.style.pointerEvents = '';
                        }
                    });
                    document.querySelectorAll('input.list-select[type="checkbox"]').forEach(cb => {
                        cb.disabled = false;
                        cb.style.opacity = '';
                        cb.style.pointerEvents = '';
                    });
                    document.querySelectorAll('input[type="color"]').forEach(cp => {
                        cp.disabled = false;
                        cp.style.opacity = '';
                        cp.style.pointerEvents = '';
                    });
                    document.querySelectorAll('.switch input[type="checkbox"]').forEach(sw => {
                        sw.disabled = false;
                        sw.style.opacity = '';
                        sw.style.pointerEvents = '';
                    });
                    document.querySelectorAll('input[type="file"]').forEach(fi => {
                        fi.disabled = false;
                        fi.style.opacity = '';
                        fi.style.pointerEvents = '';
                    });
                    return false;
                }
            } else {
                tasks.push({ type: 'auto', idx: i });
            }
        }

        if (!tasks.length) {
            alert('No List(s) selected!');
            // === re-enable UI after alert===
            // Buttons
            ['start-import-btn', 'clear-data-btn'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.pointerEvents = '';
                }
            });
            // Lists-Checkboxes
            document.querySelectorAll('input.list-select[type="checkbox"]').forEach(cb => {
                cb.disabled = false;
                cb.style.opacity = '';
                cb.style.pointerEvents = '';
            });
            // Color-Picker
            document.querySelectorAll('input[type="color"]').forEach(cp => {
                cp.disabled = false;
                cp.style.opacity = '';
                cp.style.pointerEvents = '';
            });
            // Toggle-Switches
            document.querySelectorAll('.switch input[type="checkbox"]').forEach(sw => {
                sw.disabled = false;
                sw.style.opacity = '';
                sw.style.pointerEvents = '';
            });
            // CSV-File-Inputs
            document.querySelectorAll('input[type="file"]').forEach(fi => {
                fi.disabled = false;
                fi.style.opacity = '';
                fi.style.pointerEvents = '';
            });
            return false;

        }

        // === clear all old data bevor import list
        tasks.forEach(({ idx }) => {
            myLists[idx].ids = {};
            updateListProgress(idx, 0);
        });

        // === progress circle
        tasks.forEach(({ idx }) => {
            const input = document.querySelector(`input[data-list-idx="${idx}"]`);
            if (input) {
                input.value = '';
                const wrapper = input.parentNode;

                // create circle
                const spinner = document.createElement('div');
                spinner.className = 'item-spinner-inline';
                spinner.dataset.listIdx = idx;
                spinner.style = [
                    'position:absolute',
                    'top:0',
                    'bottom:0',
                    'left:0',
                    'right:0',
                    'margin:auto',
                    'pointer-events:none',
                    'width:16px',
                    'height:16px',
                    'border:4px solid #ccc',
                    'border-top:4px solid #3498db',
                    'border-radius:50%',
                    'animation:spin 1s linear infinite'
                ].join(';');

                wrapper.appendChild(spinner);
            }
        });

        let rem = tasks.length;
        tasks.forEach(({ type, idx }) => {
            if (type === 'csv') {
                importCsv(idx, () => {
                    updateListProgress(idx, Object.keys(myLists[idx].ids).length);
                    if (--rem === 0) {
                        myLists.forEach(l => l.selected = false);
                        saveLists();
                        finishProgress();
                    }
                });
            } else {
                downloadList(idx, () => {
                    const cnt = Object.keys(myLists[idx].ids).length;
                    updateListProgress(idx, cnt);
                    if (--rem === 0) {
                        myLists.forEach(l => l.selected = false);
                        saveLists();
                        finishProgress();
                    }
                });
            }
        });
        return true;
    }


    function importCsv(idx, cb) {
        const lst = myLists[idx];
        lst.ids = {};
        lst.names = {};

        const reader = new FileReader();
        reader.onload = e => {
            const lines = e.target.result.split(/\r?\n/);

            for (const line of lines) {
                if (!line.trim()) continue;

                let m;

                // 1a) extrac movies-IDs (tt1234567)
                m = line.match(/tt(\d+)/i);
                if (m) {
                    const code36 = parseInt(m[1], 10).toString(36);
                    lst.ids[code36] = {};
                }

                // 1b) extrac people-IDs (nm1234567) + Name
                m = line.match(/nm(\d+).*?,\s*"([^"]+)"/i);
                if (m) {
                    const code36 = parseInt(m[1], 10).toString(36);
                    const personName = m[2].trim();

                    lst.ids[code36] = {};
                    lst.names[personName] = code36;

                    // put in localStorage.namesToColor
                    let ntc = {};
                    try {
                        ntc = JSON.parse(localStorage.getItem('namesToColor') || '{}');
                    } catch (_) {}
                    ntc[personName] = lst.color;
                    localStorage.setItem('namesToColor', JSON.stringify(ntc));
                }
            }

            saveLists();

            try {
                namesToColor = JSON.parse(localStorage.getItem('namesToColor') || '{}');
            } catch (_) {}

            cb();
        };

        reader.onerror = () => {
            console.error("CSV-Import-Error:", reader.error);
            cb();
        };

        reader.readAsText(lst.csvFile);
    }


    function downloadList(idx, cb) {
        const lst = myLists[idx];
        lst.ids = lst.ids || {};
        lst.names = lst.names || {};
        // Watchlist-Auto-import
        if (lst.id === 'watchlist') {
            // Basis-URL + language regex
            const BASE = `${window.location.origin}${countryPath}/user/${getUserId()}/watchlist/`;
            let page = 1,
                seen = new Set();
            (async function fetchPage() {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                // Detail-View + Pageing
                iframe.src = `${BASE}?view=detail&page=${page}`;
                document.body.appendChild(iframe);

                await new Promise(r => iframe.onload = r);
                await new Promise(r => setTimeout(r, 2000)); // wait to load all entries

                const doc = iframe.contentDocument;
                const sel1 = Array.from(doc.querySelectorAll('a.ipc-title-link-wrapper[href*="/title/tt"]'));
                const sel2 = Array.from(doc.querySelectorAll('.lister-item-header a[href*="/title/tt"]'));
                const anchors = sel1.length ? sel1 : sel2;
                let newFound = false;
                anchors.forEach(a => {
                    const m = a.href.match(/tt(\d+)\//);
                    if (!m) return;
                    const code36 = parseInt(m[1], 10).toString(36);
                    if (!seen.has(code36)) {
                        seen.add(code36);
                        lst.ids[code36] = {};
                        newFound = true;
                    }
                });

                document.body.removeChild(iframe);
                // load next page if at least one new item found
                if (newFound) {
                    page++;
                    fetchPage();
                } else {
                    cb();
                }
            })();
            return;
        }

        // Custom-lists-Auto-import
        (async () => {
            const base = `https://www.imdb.com/list/${lst.id}/?mode=detail`;
            let page = 1;
            let isPeople = null;

            while (true) {
                const resp = await fetch(`${base}&page=${page}`, { credentials: 'same-origin' });
                const html = await resp.text();
                const d = new DOMParser().parseFromString(html, 'text/html');
                const sc = d.querySelector('script[type="application/ld+json"]');
                if (!sc) break;

                let data;
                try { data = JSON.parse(sc.textContent); } catch (err) { break; }

                if (page === 1) {
                    const first = data.itemListElement[0];
                    isPeople = (first['@type'] === 'Person') ||
                        (first.item && first.item['@type'] === 'Person');
                }

                const items = data.itemListElement || [];
                if (!items.length) break;

                items.forEach(e => {
                    const l = e.url || e['@id'] || (e.item && (e.item.url || e.item['@id'])) || '';
                    const re = isPeople ? /name\/nm(\d+)\// : /tt(\d+)\//;
                    const m = l.match(re);
                    if (!m) return;
                    const code36 = parseInt(m[1], 10).toString(36);
                    lst.ids[code36] = {};
                    if (e.item && e.item.name) {
                        const name = e.item.name.trim();
                        lst.names[name] = code36;
                        let namesToColor = {};
                        try {
                            namesToColor = JSON.parse(localStorage.getItem('namesToColor') || '{}');
                        } catch (e) {}
                        namesToColor[name] = lst.color;
                        localStorage.setItem('namesToColor', JSON.stringify(namesToColor));
                    }
                });

                if (items.length < 250) break;
                page++;
            }

            cb();
        })();
    }


    function updateListProgress(listIdx, count) {
        const spinner = document.querySelector(`.item-spinner-inline[data-list-idx="${listIdx}"]`);
        if (spinner) {
            spinner.remove();
        } else {}

        const countInput = document.querySelector(`input[data-list-idx="${listIdx}"]`);
        if (countInput) {
            countInput.value = count;
        } else {
            console.error(`Count-Input fÃƒÆ’Ã‚Â¼r listIdx=${listIdx} nicht gefunden!`);
        }
    }


    function finishProgress() {
        // 1) close Progress-circle
        if (progressModal && progressModal.parentNode) {
            document.body.removeChild(progressModal);
        }

        // 2) UI: unmark all Lists-Checkboxes
        const cfg = document.getElementById('imdb-config-modal');
        if (cfg) {
            cfg
                .querySelectorAll('input.list-select[type="checkbox"]')
                .forEach(cb => cb.checked = false);
            // 3) UI: default CSV-Button
            cfg.querySelectorAll('input[type="file"]').forEach(fileInput => {
                fileInput.value = null;
                const chooseBtn = fileInput.nextSibling;
                if (chooseBtn && chooseBtn.tagName === 'BUTTON') {
                    chooseBtn.textContent = 'Select CSV';
                }

            });
        }

        // 4) reset-lists
        myLists.forEach(lst => {
            lst.selected = false;
            lst.csvFile = null;
        });

        // 5) activate Button "Start import", "Clear Data"
        ['start-import-btn', 'clear-data-btn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.pointerEvents = '';
            }
        });
        // 6) unmark all Lists-Checkboxes
        document.querySelectorAll('input.list-select[type="checkbox"]').forEach(cb => {
            cb.checked = false;
            cb.disabled = false;
            cb.style.opacity = '';
            cb.style.pointerEvents = '';
        });

        // 7) activate Color-Picke<<<<<r
        document.querySelectorAll('input[type="color"]').forEach(cp => {
            cp.disabled = false;
            cp.style.opacity = '';
            cp.style.pointerEvents = '';
        });

        // 8) activate Toggle-Switch
        document.querySelectorAll('.switch input[type="checkbox"]').forEach(sw => {
            sw.disabled = false;
            sw.style.opacity = '';
            sw.style.pointerEvents = '';
        });

        // 9) activate File-Inputs
        document.querySelectorAll('input[type="file"]').forEach(fi => {
            fi.disabled = false;
            fi.style.opacity = '';
            fi.style.pointerEvents = '';
        });
        // 10) save importMode
        const modesToSave = myLists.map(lst => ({
            id: lst.id,
            importMode: lst.importMode
        }));
        localStorage.setItem(
            'imdbListsImportModes',
            JSON.stringify(modesToSave)
        );
        alert('Import Done!');
    }


    function eraseData() {
        localStorage.removeItem('myMovies-' + user);
        localStorage.removeItem('namesToColor');
        localStorage.removeItem('imdbListsImportModes');
        namesToColor = {};
        window.location.reload();
    }

    function saveLists() {
        localStorage.setItem('myMovies-' + user, JSON.stringify({
            myLists,
            listOrder
        }));
    }

    function loadLists() {
        const d = localStorage.getItem('myMovies-' + user);
        if (!d) return false;
        const o = JSON.parse(d);
        myLists = o.myLists;
        listOrder = o.listOrder;
        return true;
    }

    function highlightTitle() {
        let m = location.href.match(/tt(\d+)\//);
        if (m) {
            const c = movieColor(parseInt(m[1], 10).toString(36));
            if (c) document.querySelectorAll('h1').forEach(h => h.style.color = c);
        }
        m = location.href.match(/name\/nm(\d+)\//);
        if (m) {
            const c = movieColor(parseInt(m[1], 10).toString(36));
            if (c) document.querySelectorAll('h1').forEach(h => h.style.color = c);
        }
    }

    function highlightLinks() {
        document.querySelectorAll('a[href*="/title/tt"]').forEach(a => {
            const m = a.href.match(
                /^https?:\/\/(?:www\.)?imdb\.com\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?title\/tt(\d+)\/\?ref_=[^/]+/i
            );
            if (!m) return;
            const code36 = parseInt(m[1], 10).toString(36);
            const c = movieColor(code36);
            if (c) {
                a.style.color = c;
                a.style.fontWeight = 'bold';
            }
        });
        const peopleLinkRe = /^https:\/\/www\.imdb\.com\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?name\/nm(\d+)\/\?ref_=[^&#]+$/i;

        document.querySelectorAll('a[href]').forEach(a => {
            const href = a.href;
            const m = peopleLinkRe.exec(href);
            if (!m) return;
            const code36 = parseInt(m[1], 10).toString(36);
            const c = movieColor(code36);
            if (c) {
                a.style.color = c;
                a.style.fontWeight = 'bold';
            }
        });

        document
            .querySelectorAll('li[id^="react-autowhatever-navSuggestionSearch"]')
            .forEach(li => {
                let link = li.querySelector('a[href*="/title/tt"]');
                if (!link) link = li.querySelector('[data-testid="search-result--link"]');
                if (!link || !link.href) return;
                const m = link.href.match(
                    /^https?:\/\/(?:www\.)?imdb\.com\/title\/tt(\d+)\/\?ref_=[^/]+/i
                );
                if (!m) return;
                const code36 = parseInt(m[1], 10).toString(36);
                const c = movieColor(code36);
                if (!c) return;
                const titleSpan =
                    li.querySelector('.searchResult__constTitle') ||
                    li.querySelector('span');
                if (titleSpan) {
                    titleSpan.style.color = c;
                    titleSpan.style.fontWeight = 'bold';
                }
            });
        document
            .querySelectorAll('li[id^="react-autowhatever-navSuggestionSearch"]')
            .forEach(li => {
                let link = li.querySelector('a[href*="/name/nm"]');
                if (!link) link = li.querySelector('[data-testid="search-result--link"]');
                if (!link || !link.href) return;
                const m = link.href.match(
                    /^https?:\/\/(?:www\.)?imdb\.com\/name\/nm(\d+)\/\?ref_=[^/]+/i
                );
                if (!m) return;
                const code36 = parseInt(m[1], 10).toString(36);
                const c = movieColor(code36);
                if (!c) return;
                const nameSpan =
                    li.querySelector('.searchResult__actorName') ||
                    li.querySelector('.searchResult__constTitle') ||
                    li.querySelector('span');
                if (nameSpan) {
                    nameSpan.style.color = c;
                    nameSpan.style.fontWeight = 'bold';
                }
            });
        if (/^\/([a-z]{2}(-[a-z]{2})?)?\/?$/i.test(location.pathname)) {
            document.querySelectorAll('a[href*="/name/nm"]').forEach(link => {
                const match = link.href.match(/\/name\/nm(\d+)\//);
                if (match) {
                    const code36 = parseInt(match[1], 10).toString(36);
                    const color = movieColor(code36);
                    if (color) {
                        link.style.color = color;
                        link.style.fontWeight = 'bold';
                        if (link.parentElement) {
                            link.parentElement.style.color = color;
                            link.parentElement.style.fontWeight = 'bold';
                        }
                    }
                }
            });
            document.querySelectorAll('div').forEach(div => {
                const name = div.textContent.trim();
                if (!/^[A-Za-zÄÖÜäöüß\-'. ]{2,}$/.test(name)) return;
                if (namesToColor[name]) {
                    div.style.color = namesToColor[name];
                    div.style.fontWeight = 'bold';
                }
            });
        }
        // === Tooltip-Listener
        if (showTooltips) {
            document
                .querySelectorAll('a[href*="/title/tt"], a[href*="/name/nm"]')
                .forEach(a => {
                    const m = a.href.match(/tt(\d+)\//) || a.href.match(/name\/nm(\d+)\//);
                    if (!m) return;
                    const code36 = parseInt(m[1], 10).toString(36);
                    if (!movieColor(code36)) return;

                    if (!a.dataset.tooltipListener) {
                        a.dataset.tooltipListener = '1';
                        a.addEventListener('mouseenter', () => showTooltip(a, code36));
                        a.addEventListener('mouseleave', hideTooltip);
                    }

                });

        }
    }

    function highlightCalendarPeople() {
        document
            .querySelectorAll('.ipc-inline-list__item span.ipc-metadata-list-summary-item__li')
            .forEach(span => {
                const name = span.textContent.trim();
                const color = namesToColor[name];
                if (color) {
                    span.style.color = color;
                    span.style.fontWeight = 'bold';
                }
            });
    }

    function movieColor(code) {
        for (const i of listOrder)
            if (myLists[i].ids[code]) return myLists[i].color;
        return '';
    }

    function nameToHex(name) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = name;
        return ctx.fillStyle;
    }

    // === Tooltip-function ===
    let currentTooltip = null;

    function showTooltip(elem, code36) {
        const lists = myLists
            .filter(l => l.ids[code36])
            .map(l => l.name);
        if (!lists.length) return;

        const tip = document.createElement('div');
        tip.className = 'imdb-tooltip';
        tip.innerHTML = '<strong>In List(s):</strong><br>' +
            lists.map(l => `&bull; ${l}`).join('<br>');
        document.body.appendChild(tip);

        const rect = elem.getBoundingClientRect();
        tip.style.top = (window.scrollY + rect.bottom + 4) + 'px';
        tip.style.left = (window.scrollX + rect.left) + 'px';

        currentTooltip = tip;
    }

    function hideTooltip() {
        if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
        }
    }

})();