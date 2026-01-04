// ==UserScript==
// @name        DayZ Map Improvement
// @namespace   https://azzurite.tv
// @match       https://dayz.xam.nu/*
// @run-at      document-start
// @grant       none
// @version     1.4.0
// @author      Azzurite
// @license     GPLv3
// @description 6/11/2024, 1:26:23 AM
// @downloadURL https://update.greasyfork.org/scripts/497911/DayZ%20Map%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/497911/DayZ%20Map%20Improvement.meta.js
// ==/UserScript==

(() => {
    const highlighters = {};

    function makeHuntingMoreVisible() {
        if (this.options.iconUrl === `https://dayz.xam.nu/js/../images/b8fe30b7.webp`) {
            this.options.iconUrl = `https://images.azzurite.tv/uploads/original/d3/0f/6a50614db7df56f32d5aa2840268.webp`;
        } else if (this.options?.iconUrl === `https://dayz.xam.nu/js/../images/a92e2f53.webp`) {
            this.options.iconUrl = `https://images.azzurite.tv/uploads/original/92/8b/e706a502ab0931c2338883333633.webp`;
        }
    }

    Object.defineProperty(window, `L`, {
        set(obj) {
            this.storedL = obj;
            obj.Map.addInitHook(function() { // addInitHook binds `this`
                window.map = this;
            });
            obj.Icon.addInitHook(makeHuntingMoreVisible);
        },
        get() {
            return this.storedL;
        }
    })

    function getMarkers() {
        return window.map.modules.filters.markers;
    }

    function getFilters() {
        return window.map.modules.filters.filters;
    }

    function setFilters(filters) {
        window.map.modules.filters.filters = filters;
    }

    function filtersContain(filters, key, subKey) {
        return filters[key] === true || filters[key]?.includes(subKey);
    }

    function areExactlyTheseFiltersActive(filters) {
        return Object.entries(getFilters()).every(([filterKey, filterValue]) => {
            return Object.keys(filterValue).every(subFilterKey => {
                if (filterKey === `tier`) return true;
                if (filtersContain(filters, filterKey, subFilterKey)) {
                    return filterValue[subFilterKey] === 1;
                } else {
                    return filterValue[subFilterKey] === 0;
                }
            });
        });
    }

    function updateButtonsState() {
        document.querySelector(`.azzu-all > button`).dataset.active = anyMarkerActive() ? 1 : 0;
        for (let highlighter of Object.values(highlighters)) {
            if (highlighter.isActive) {
                highlighter.button.dataset.active = highlighter.isActive() ? 1 : 0;
            }
        }
    }

    function updateDisplay() {
        window.map.modules.filters._check();
        map.modules.filters._updateStorage();
        updateButtonsState();
    }

    function anyMarkerActive() {
        return Object.entries(getFilters()).some(([subFilterKey, subFilterValue]) => {
            if (subFilterKey === `tier`) return false;
            return Object.values(subFilterValue).some(state => state === 1)
        });
    }

    function forAllFiltersExceptTiers(callback) {
        Object.entries(getFilters()).forEach(([subFilterKey, subFilterValue]) => {
            if (subFilterKey !== `tier`) {
                callback(subFilterKey, subFilterValue);
            }
        })
    }

    function getButtonList() {
        return document.querySelector(`.filters`).parentNode;
    }

    function setAllFiltersTo(state) {
        forAllFiltersExceptTiers((_, val) => {
            for (let key of Object.keys(val)) {
                val[key] = state;
            }
        });
    }

    function setFiltersTo(filters, state) {
        forAllFiltersExceptTiers((key, val) => {
            if (Object.keys(filters).includes(key)) {
                const toChange = filters[key] === true ? Object.keys(getFilters()[key]) : filters[key];
                for (let toDisable of toChange) {
                    val[toDisable] = state;
                }
            }
        });
    }

    function setMarkersTo(filterFn, value) {
        for (let e of getMarkers()) {
            if (filterFn(e)) {
                e.options.visible = value;
                e.options.interactive = value;
            }
        }
        map.modules.filters.layer._redraw()
    }

    function nicerToggleAll() {
        if (anyMarkerActive()) {
            setAllFiltersTo(0);
            updateDisplay();
        } else {
            const unwanted = {
                food: [`pear`, `apple`, `plum`],
                animal: true,
                area: [`dynamiccontamination`],
                misc: [`infected`, `playerspawnhop`, `playerspawnsafe`, `playerspawntravel`],
                vehicle: [`playerspawnhop`, `playerspawnsafe`, `playerspawntravel`]
            }
            setAllFiltersTo(1);
            setFiltersTo(unwanted, 0);

            updateDisplay();

            setMarkersTo((marker) => marker.data.m[0] === `land_mil_tower_small`, 0);
            setMarkersTo((marker) => marker.data.t.includes(`no loot`), 0);
        }
    }

    function replaceFilterAllButton() {
        const li = document.createElement(`li`);
        li.classList.add(`azzu-all`);
        const btn = document.querySelector(`[data-type="all"][data-weight="all"]`).cloneNode(true);
        li.append(btn);
        btn.addEventListener(`click`, () => {
            stopHighlighters();
            nicerToggleAll();
        });
        getButtonList().prepend(li);
        document.querySelector(`.filters`).style.display = `none`;
    }

    function createTextButton(text) {
        const li = document.createElement(`li`);
        li.classList.add(`azzu-highlight`);
        const btn = document.createElement(`button`);
        btn.style.padding = `0 10px`;
        btn.style.width = `inherit`;
        btn.innerHTML = text;
        li.append(btn);
        getButtonList().prepend(li);
        return btn;
    }

    function stopHighlighters() {
        for (const [key, {timeout}] of Object.entries(highlighters)) {
            if (timeout) {
                clearTimeout(timeout);
                highlighters[key].timeout = false;
            }
        }
    }

    function isHighlighterRunning(id) {
        return !!highlighters[id]?.timeout;
    }

    function addBlinkingBehavior(btn, id, highlight, isEnabled = () => btn.dataset.active == `1`) {
        highlighters[id] = { button: btn, timeout: false, };

        btn.addEventListener(`contextmenu`, (ev) => {
            ev.preventDefault();

            doBlinkingBehavior(id, highlight, isEnabled);
        });
        btn.addEventListener(`click`, (ev) => {
            if (!ev.isTrusted) {
                return;
            }
            const running = isHighlighterRunning(id);
            stopHighlighters();
        })
    }

    function doBlinkingBehavior(id, highlight, isEnabled) {
        if (!highlighters[id]) highlighters[id] = { timeout: false };

        const running = isHighlighterRunning(id);
        stopHighlighters();
        if (running) {
            if (!isEnabled()) highlight();
            return;
        }

        const doHighlight = () => {
            if (isEnabled()) {
                highlight();
                highlighters[id].timeout = setTimeout(doHighlight, 100);
            } else {
                highlight();
                highlighters[id].timeout = setTimeout(doHighlight, 600);
            }
        }
        highlighters[id].timeout = setTimeout(doHighlight, 0);
    }

    function areTheseFiltersActive(filters) {
        return Object.entries(getFilters()).every(([filterKey, filterValue]) => {
            return Object.keys(filterValue).every(subFilterKey => {
                if (filterKey === `tier`) return true;
                if (filtersContain(filters, filterKey, subFilterKey)) {
                    return filterValue[subFilterKey] === 1;
                } else {
                    return true;
                }
            });
        });
    }

    function createHighlightButton(text, toHighlight, isActive = () => areTheseFiltersActive(toHighlight)) {
        const btn = createTextButton(text);
        btn.classList.add(`highlighter`);
        btn.classList.add(text);

        const toggle = (newState) => {
            if (typeof toHighlight === `function`) {
                toHighlight(btn, newState);
            } else {
                setFiltersTo(toHighlight, newState);
                updateDisplay();
            }
        };

        btn.addEventListener(`click`, (ev) => {
            if (btn.dataset.active === `1`) {
                toggle(0);
            } else {
                toggle(1);
            }
        });

        addBlinkingBehavior(btn, text,
                            () => {
                                toggle(isActive() ? 0 : 1);
                            },
                            isActive
        );
        highlighters[text].isActive = isActive;
        updateDisplay();

        return btn;
    }

    function addWeaponAmmoHighlight() {
        createCustomHighlightButton(`HighValue`, (marker) => {
            const subType = marker.data.w;
            const lootTypes = marker.data.t;
            return ((lootTypes.includes(`military`) && subType !== `helicrash`) ||
                lootTypes.includes(`police`) ||
                lootTypes.includes(`medic`)  ||
                (lootTypes.includes(`hunting`) && subType !== `deerstand` && subType !== `feedshack`));
        });
    }

    function addShowCarSpawns() {
        createHighlightButton(`Vehicles`, {vehicle: [`vehicleoffroadhatchback`, `vehiclehatchback02`, `vehicleoffroad02`, `vehicletruck01`, `vehicleciviliansedan`, `vehiclesedan02`]});
    }

    function addBlinkingToAllButtons() {
        for (const btn of [...document.querySelectorAll(`[data-weight][data-type]:not([data-type="all"])`)]) {
            const {type, weight} = btn.dataset;
            const id = `${type}-${weight}`;
            btn.classList.add(`highlighter`);
            btn.classList.add(id);
            addBlinkingBehavior(btn, id, () => btn.click());
        }
    }


    function createCustomHighlightButton(text, filterFn) {
        createHighlightButton(text, (btn, newState) => {
            setMarkersTo(filterFn, newState);
            updateButtonsState();
        }, () => getMarkers().some(marker => filterFn(marker) && marker.options.visible === 1));

    }

    function addCoastal() {
        createCustomHighlightButton(`Coastal`, (marker) => marker.data.t.includes(`coast`))
    }

    function addModelBlinkingButton() {
        setInterval(() => {
            const panel = document.querySelector(`#economy`);
            if (!panel) return;

            const buttonClassName = `azzu-blink-button`;
            if (panel.querySelector(`.${buttonClassName}`)) return;

            const button = document.createElement(`button`);
            button.classList.add(buttonClassName);
            button.dataset.tooltip = `Blink`;
            button.dataset.tooltippos = `left`;
            button.innerHTML = `<?xml version="1.0" encoding="iso-8859-1"?><svg height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M250.826,386.309c-9.235,0-16.722,7.487-16.722,16.722v91.874c0,9.235,7.487,16.722,16.722,16.722 c9.235,0,16.722-7.487,16.722-16.722v-91.874C267.547,393.796,260.061,386.309,250.826,386.309z"/></g></g><g><g><path d="M250.826,9.975c-9.235,0-16.722,7.487-16.722,16.722v66.887c0,9.235,7.487,16.722,16.722,16.722 c9.235,0,16.722-7.487,16.722-16.722V26.697C267.547,17.462,260.061,9.975,250.826,9.975z"/></g></g><g><g><path d="M60.721,131.736l-35.023-20.221c-7.999-4.62-18.226-1.877-22.842,6.12c-4.619,7.999-1.878,18.226,6.12,22.842 l35.023,20.221c7.997,4.619,18.223,1.878,22.842-6.12C71.46,146.579,68.72,136.352,60.721,131.736z"/></g></g><g><g><path d="M503.636,387.452l-70.673-40.803c-7.999-4.621-18.226-1.877-22.842,6.12c-4.619,7.999-1.878,18.226,6.12,22.842 l70.673,40.803c7.997,4.619,18.223,1.878,22.842-6.12C514.375,402.297,511.634,392.07,503.636,387.452z"/></g></g><g><g><path d="M165.794,408.082c-8-4.62-18.224-1.88-22.842,6.12l-23.659,40.977c-4.619,7.997-1.878,18.224,6.12,22.842 c7.997,4.619,18.224,1.878,22.842-6.12l23.659-40.977C176.531,422.928,173.791,412.701,165.794,408.082z"/></g></g><g><g><path d="M391.587,16.998c-7.999-4.62-18.226-1.88-22.842,6.12l-32.07,55.545c-4.619,7.997-1.878,18.224,6.12,22.842 c7.997,4.619,18.224,1.878,22.842-6.12l32.07-55.545C402.326,31.842,399.586,21.615,391.587,16.998z"/></g></g><g><g><path d="M484.93,244.079h-66.887c-9.235,0-16.722,7.487-16.722,16.722c0,9.235,7.487,16.722,16.722,16.722h66.887 c9.235,0,16.722-7.487,16.722-16.722C501.651,251.566,494.165,244.079,484.93,244.079z"/></g></g><g><g><path d="M83.609,244.079H16.722C7.487,244.079,0,251.566,0,260.801c0,9.235,7.487,16.722,16.722,16.722h66.887 c9.235,0,16.722-7.487,16.722-16.722C100.33,251.566,92.843,244.079,83.609,244.079z"/></g></g><g><g><path d="M400.589,486.644l-41.403-71.628c-4.622-7.995-14.847-10.73-22.845-6.108c-7.995,4.622-10.731,14.849-6.108,22.845 l41.403,71.628c4.62,7.993,14.843,10.732,22.845,6.108C402.476,504.868,405.212,494.641,400.589,486.644z"/></g></g><g><g><path d="M198.415,136.552L148.25,49.765c-4.622-7.995-14.851-10.731-22.845-6.108c-7.995,4.622-10.731,14.849-6.108,22.845 l50.165,86.787c4.621,7.995,14.848,10.732,22.845,6.108C200.303,154.775,203.038,144.548,198.415,136.552z"/></g></g><g><g><path d="M494.351,120.132c-4.621-7.995-14.85-10.73-22.845-6.108l-88.868,51.368c-7.995,4.622-10.731,14.849-6.108,22.845 c4.621,7.995,14.848,10.732,22.845,6.108l88.868-51.368C496.238,138.355,498.974,128.128,494.351,120.132z"/></g></g><g><g><path d="M140.221,324.638c-4.622-7.997-14.85-10.729-22.845-6.108L39.79,363.376c-7.995,4.622-10.731,14.849-6.108,22.845 c4.619,7.99,14.841,10.734,22.845,6.108l77.585-44.847C142.108,342.861,144.844,332.634,140.221,324.638z"/></g></g><g><g><path d="M494.643,40.631l11.824-11.824c6.53-6.529,6.53-17.117,0-23.648c-6.529-6.529-17.117-6.529-23.648,0l-11.824,11.826 L459.172,5.16c-6.529-6.529-17.117-6.529-23.648,0c-6.53,6.529-6.53,17.117,0,23.648l11.824,11.824l-11.824,11.825 c-6.531,6.529-6.531,17.117,0,23.647c6.53,6.53,17.117,6.53,23.648,0l11.823-11.824l11.824,11.824c6.53,6.53,17.117,6.53,23.648,0 c6.53-6.529,6.53-17.117,0-23.648L494.643,40.631z"/></g></g><g><g><path d="M65.452,469.822l11.824-11.824c6.531-6.529,6.531-17.117,0-23.647c-6.529-6.529-17.117-6.529-23.648,0l-11.824,11.824 L29.98,434.351c-6.529-6.529-17.117-6.529-23.648,0c-6.53,6.529-6.53,17.117,0,23.648l11.824,11.825L6.333,481.647 c-6.53,6.529-6.53,17.117,0,23.648s17.117,6.53,23.648,0l11.823-11.824l11.824,11.824c6.53,6.53,17.117,6.53,23.648,0 c6.53-6.529,6.53-17.117,0-23.648L65.452,469.822z"/></g></g><g><g><circle cx="72.461" cy="82.436" r="16.722"/></g></g><g><g><circle cx="27.87" cy="37.844" r="16.722"/></g></g><g><g><circle cx="473.782" cy="483.759" r="16.722"/></g></g><g><g><circle cx="429.191" cy="439.168" r="16.722"/></g></g><g><g><path d="M359.955,221.513l-65.045-9.452l-29.09-58.942c-6.124-12.405-23.865-12.407-29.99,0l-29.089,58.942l-65.046,9.452 c-13.686,1.987-19.178,18.862-9.267,28.522l47.067,45.88l-11.111,64.782c-2.337,13.628,12.007,24.066,24.263,17.628l58.179-30.589 l58.178,30.587c12.244,6.435,26.602-3.984,24.263-17.628l-11.112-64.782l47.067-45.879 C379.128,240.379,373.648,223.5,359.955,221.513z M292.515,278.101c-3.941,3.842-5.739,9.376-4.808,14.801l6.87,40.052 c-39.141-20.578-38.257-20.832-43.752-20.832c-5.506,0-4.791,0.348-43.751,20.832l6.869-40.053 c0.931-5.423-0.867-10.958-4.808-14.8l-29.1-28.366l40.216-5.844c5.447-0.792,10.155-4.212,12.59-9.147l17.984-36.442 l17.986,36.441c2.437,4.935,7.143,8.355,12.59,9.147l40.215,5.844L292.515,278.101z"/></g></g><g><g><circle cx="108.691" cy="182.211" r="16.722"/></g></g><g><g><circle cx="317.713" cy="143.751" r="16.722"/></g></g><g><g><circle cx="376.239" cy="327.69" r="16.722"/></g></g></svg>`;
            panel.querySelector(`.controls`).append(button);
            button.addEventListener(`click`, () => {
                const modelName = panel.querySelector(`h2`).textContent;
                const filter = (marker) => marker.data.m[0] === modelName;
                const running = isHighlighterRunning(modelName);
                if (!running) {
                    doBlinkingBehavior(
                        modelName,
                        () => {
                            const setTo = button.dataset.active === `1` ? 0 : 1;
                            setMarkersTo(filter, setTo);
                            button.dataset.active = setTo;
                        },
                        () => button.dataset.active === `1`
                    );
                } else {
                    if (button.dataset.active === `0`) {
                        setMarkersTo(filter, 1);
                    }
                    stopHighlighters();
                }

            });
        }, 420);
    }

    function init() {
        if (!document.querySelector(`.filters`)) {
            setTimeout(init, 100);
            return;
        }

        replaceFilterAllButton();
        addBlinkingToAllButtons();
        addModelBlinkingButton();
        addWeaponAmmoHighlight();
        addShowCarSpawns();
        addCoastal();
    }

    setTimeout(init, 100);
})();

