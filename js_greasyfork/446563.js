// ==UserScript==
// @name         Halo 5 Guardians Requisitions
// @namespace    https://github.com/zellreid/halo-5-guardians-requisitions-filters
// @version      4.4
// @description  A Tampermonkey userscript to add additional asset filters to the Halo 5 Guardians Requisitions
// @author       ZellReid
// @homepage     https://github.com/zellreid/halo-5-guardians-requisitions-filters
// @supportURL   https://github.com/zellreid/halo-5-guardians-requisitions-filters/issues
// @license      MIT
// @match        https://www.halowaypoint.com/en/halo-5-guardians/requisitions*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-body
// @resource     JSJQuery https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     JSBootstrap https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/js/bootstrap.min.js
// @resource     JSSelect2 https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js
// @resource     CSSSelect2 https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css
// @resource     CSSSelect2 https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css
// @resource     CSSFilter https://raw.githubusercontent.com/zellreid/halo-5-guardians-requisitions-filters/main/halo-5-guardians-requisitions-filters.user.css?ver=4.4
// @resource     IMGFilter https://raw.githubusercontent.com/zellreid/halo-5-guardians-requisitions-filters/dfe2d6891ccc3dadca173bf852e51b721b4f7f06/filter.png
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/446563/Halo%205%20Guardians%20Requisitions.user.js
// @updateURL https://update.greasyfork.org/scripts/446563/Halo%205%20Guardians%20Requisitions.meta.js
// ==/UserScript==

(function() {
    `use strict`;

    window.injected = {
        info: GM_info,
        scripts: [],
        styles: [],
        ui: {
            floatReq: false,
            btnFilter: false,
            divFilter: false,
            divFilterShow: false
        },
        filters: {
            owned: {
                owned: true,
                notOwned: true,
                multi: false,
                addMulti: true
            },
            rarity: {
                common: true,
                uncommon: true,
                rare: true,
                ultraRare: true,
                legendary: true
            }
        }
    };

    addScript(GM_getResourceURL (`JSJQuery`));
    addScript(GM_getResourceURL (`JSBootstrap`));
    //addScript(GM_getResourceURL (`JSSelect2`));

    //addStyle(GM_getResourceURL (`CSSSelect2`));
    addStyle(GM_getResourceURL (`CSSFilter`));

    function addScript(src){
        return new Promise(function (resolve, reject) {
            var loadScript = !isScriptAdded(src);

            if (loadScript) {
                let script = document.createElement(`script`);
                script.type = `text/javascript`;
                script.src = src;

                script.onload = () => resolve({ success: true });
                script.onerror = () => reject(new Error(`Script load error: ` + src));

                document.head.appendChild(script);
                window.injected.scripts.push(script);
            } else {
                resolve({ success: true });
            }
        });
    }

    function isScriptAdded(src) {
        var added = false;

        window.injected.scripts.forEach(
            function (script) {
                if (script.src == src) {
                    added = true;
                }
            });

        return added;
    };

    function addStyle(href){
        return new Promise(function (resolve, reject) {
            var loadStyle = !isStyleAdded(href);

            if (loadStyle) {
                let style = document.createElement(`link`);
                style.rel = `stylesheet`;
                style.type = `text/css`;
                style.href = href;
                document.head.appendChild(style);
                window.injected.styles.push(style);
                resolve({ success: true });
            } else {
                resolve({ success: true });
            }
        });
    }

    function isStyleAdded(href) {
        var added = false;

        window.injected.styles.forEach(
            function (style) {
                if (style.href == href) {
                    added = true;
                }
            });

        return added;
    };

    function doControlsExist(container, controlQuery) {
        return container.querySelector(controlQuery);
    }

    function uiInjections() {
        floatReqPoints();
    }

    function floatReqPoints() {
        var target = `.halo-5-req-points_points__1_U4l`;

        if ((!window.injected.ui.floatReq)
        && (doControlsExist(document.body, target))) {
            var container = document.querySelector(target);
            container.style.position = `fixed`;
            container.style.top = `100px`;
            container.style.right = `100px`;
            container.style.zIndex = `10000`;
            window.injected.ui.floatReq = true;
        }
    }

    function addFilterControls() {
        addFilterButton();
        addFilterContainer();
        addFilterContainerOwned();
        addFilterContainerRarity();
    }

    function addFilterButton() {
        if (!window.injected.ui.btnFilter) {
            var imgContainer = createImageLink(`btn_ifcFilter`, GM_getResourceURL (`IMGFilter`), `Filter`);
            document.body.appendChild(imgContainer);
            window.injected.ui.btnFilter = true;
        }
    }

    function addFilterContainer() {
        if ((!window.injected.ui.divFilter)
        && (!doControlsExist(document.body, `#injectedFilterControls`))) {
            var mainDivContainer = document.createElement(`div`);
            mainDivContainer.id = `injectedFilterControls`;
            mainDivContainer.className = `filter-section`;
            mainDivContainer.style.display = `none`;

            var articleContainer = document.createElement(`article`);

            var divContainer = document.createElement(`div`);
            divContainer.className = `filter-dropdown`;

            articleContainer.appendChild(divContainer);
            mainDivContainer.appendChild(articleContainer);
            document.body.appendChild(mainDivContainer);
            window.injected.ui.divFilter = true;

            var imgContainer = document.querySelector(`#btn_ifcFilter`);
            imgContainer.addEventListener(`click`, toggleFilterContainer);
        }
    }

    function addFilterContainerOwned() {
        if (window.injected.ui.divFilter) {
            if (!doControlsExist(document.body, `#ifcOwned`)) {
                var mainContainer = document.querySelector(`#injectedFilterControls .filter-dropdown`);
                var divContainer = createFilterBlock(`ifcOwned`, `Owned`);
                mainContainer.appendChild(divContainer);

                //Owned
                var checkboxOwned = createCheckbox(`ifcOwned`, `Owned`, window.injected.filters.owned.owned, toggleOwned);
                addFilterOption(document.getElementById(`ifcOwned`), checkboxOwned);

                var checkboxNotOwned = createCheckbox(null, `Not Owned`, window.injected.filters.owned.notOwned, toggleNotOwned, null);
                addFilterOption(document.getElementById(`ifcOwned`), checkboxNotOwned);
            }

            if ((window.injected.filters.owned.addMulti) && (doControlsExist(document, `.reqCard`)) && (!doControlsExist(document.body, `#cbx_ifcMulti`))) {
                try {
                    if (hasContainerCount(document.querySelector(`.reqCard`))) {
                        var checkboxMulti = createCheckbox(`ifcMulti`, `> 1`, window.injected.filters.owned.multi, toggleMulti);
                        addFilterOption(document.getElementById(`ifcOwned`), checkboxMulti);
                    }
                } catch {
                    window.injected.filters.owned.addMulti = false;
                }
            }
        }
    }

    function addFilterContainerRarity() {
        if ((window.injected.ui.divFilter)
        && (!doControlsExist(document.body, `#ifcRarity`))) {
            var mainContainer = document.querySelector(`#injectedFilterControls .filter-dropdown`);
            var divContainer = createFilterBlock(`ifcRarity`, `Rarity`);
            mainContainer.appendChild(divContainer);

            //Rarity
            var checkboxCommon = createCheckbox(null, `Common`, window.injected.filters.rarity.common, toggleCommon);
            addFilterOption(document.getElementById(`ifcRarity`), checkboxCommon);

            var checkboxUncommon = createCheckbox(null, `Uncommon`, window.injected.filters.rarity.uncommon, toggleUncommon);
            addFilterOption(document.getElementById(`ifcRarity`), checkboxUncommon);

            var checkboxRare = createCheckbox(null, `Rare`, window.injected.filters.rarity.rare, toggleRare);
            addFilterOption(document.getElementById(`ifcRarity`), checkboxRare);

            var checkboxUltraRare = createCheckbox(null, `Ultra Rare`, window.injected.filters.rarity.ultraRare, toggleUltraRare);
            addFilterOption(document.getElementById(`ifcRarity`), checkboxUltraRare);

            var checkboxLegendary = createCheckbox(null, `Legendary`, window.injected.filters.rarity.legendary, toggleLegendary);
            addFilterOption(document.getElementById(`ifcRarity`), checkboxLegendary);
        }
    }

    function createFilterBlock(id, text) {
        var container = document.createElement(`div`);
        if (id != null) {
            container.id = id;
        }

        container.className = `filter-block`;

        var pContainer = document.createElement(`p`);
        container.className = `title`;

        var spanContainer = document.createElement(`span`);

        if (id != null) {
            var textContainer = document.createTextNode(text);
            spanContainer.appendChild(textContainer);
        }

        pContainer.appendChild(spanContainer);
        container.appendChild(pContainer);

        var ulContainer = document.createElement(`ul`);
        ulContainer.className = `filter-options`;

        container.appendChild(pContainer);
        container.appendChild(ulContainer);
        return container;
    }

    function addFilterOption(container, control) {
        var optionsContainer = container.querySelector(`.filter-options`);
        var liContainer = document.createElement(`li`);
        liContainer.appendChild(control);
        optionsContainer.appendChild(liContainer);
    }

    function createImageLink(id, src, text) {
        var aContainer = document.createElement(`a`);

        if (id != null) {
            aContainer.id = id;
        }

        var imgContainer = document.createElement(`img`);
        imgContainer.src = src;
        imgContainer.alt = text;
        imgContainer.title = text;

        aContainer.appendChild(imgContainer);
        return aContainer;
    }

    function createCheckbox(id, text, initial, onChange) {
        var labelContainer = document.createElement(`label`);
        labelContainer.style.marginLeft = `5px`;
        labelContainer.style.marginRight = `5px`;

        var checkboxContainer = document.createElement(`input`);
        checkboxContainer.type = `checkbox`;
        checkboxContainer.checked = initial;
        checkboxContainer.style.marginRight = `3px`;
        checkboxContainer.addEventListener(`change`, onChange);

        if (id != null) {
            labelContainer.id = `lbl_` + id;
            checkboxContainer.id = `cbx_` + id;
        }

        labelContainer.appendChild(checkboxContainer);

        var textContainer = document.createTextNode(text);
        labelContainer.appendChild(textContainer);

        return labelContainer;
    }

    function toggleFilterContainer(event) {
        window.injected.ui.divFilterShow = !window.injected.ui.divFilterShow;
        var mainContainer = document.querySelector(`#injectedFilterControls`);

        if (!window.injected.ui.divFilterShow) {
            mainContainer.style.display = `none`;
        } else {
            mainContainer.style.display = null;
        }

        onBodyChange();
    }

    function toggleOwned(event) {
        window.injected.filters.owned.owned = event.target.checked;

        if ((!window.injected.filters.owned.owned)
        && (window.injected.filters.owned.multi)) {
            window.injected.filters.owned.multi = event.target.checked;
            document.getElementById(`cbx_ifcMulti`).checked = event.target.checked;
        }

        onBodyChange();
    }

    function toggleNotOwned(event) {
        window.injected.filters.owned.notOwned = event.target.checked;
        onBodyChange();
    }

    function toggleMulti(event) {
        window.injected.filters.owned.multi = event.target.checked;

        if ((window.injected.filters.owned.multi)
        && (!window.injected.filters.owned.owned)) {
            window.injected.filters.owned.owned = event.target.checked;
            document.getElementById(`cbx_ifcOwned`).checked = event.target.checked;
        }

        onBodyChange();
    }

    function toggleCommon(event) {
        window.injected.filters.rarity.common = event.target.checked;
        onBodyChange();
    }

    function toggleUncommon(event) {
        window.injected.filters.rarity.uncommon = event.target.checked;
        onBodyChange();
    }

    function toggleRare(event) {
        window.injected.filters.rarity.rare = event.target.checked;
        onBodyChange();
    }

    function toggleUltraRare(event) {
        window.injected.filters.rarity.ultraRare = event.target.checked;
        onBodyChange();
    }

    function toggleLegendary(event) {
        window.injected.filters.rarity.legendary = event.target.checked;
        onBodyChange();
    }

    function isContainerLocked(container) {
        return container.classList.contains(`locked`);
    }

    function hasContainerCount(container) {
        return container.querySelector(`.count`) != null ? true : false;
    }

    function getContainerCount(container) {
        if (hasContainerCount(container)) {
            return container.querySelector(`.count`).innerText.substring(1);
        } else {
            return 0;
        }
    }

    function getContainerRarity(container) {
        return container.querySelector(`.rarity`).innerText.toUpperCase();
    }

    function isContainerOwned(container) {
        var isOwned = true;

        if (isContainerLocked(container)) {
            isOwned = false;
        } else {
            if (hasContainerCount(container)) {
                if (getContainerCount(container) == 0) {
                    isOwned = false;
                }
            }
        }

        return isOwned;
    }

    function isContainerMulti(container) {
        var isMulti = false;

        if (hasContainerCount(container)) {
            if (getContainerCount(container) > 1) {
                isMulti = true;
            }
        }

        return isMulti;
    }

    function validateOwned(container, showContainer) {
        var isOwned = isContainerOwned(container);
        var isNotOwned = !isContainerOwned(container);

        if ((!window.injected.filters.owned.owned && isOwned)
        || (!window.injected.filters.owned.notOwned && isNotOwned)) {
            showContainer = false;
        }

        if (hasContainerCount(container)) {
            var isMulti = isContainerMulti(container);

            if (window.injected.filters.owned.multi && !isMulti) {
                showContainer = false;
            }
        }

        return showContainer;
    }

    function validateRarity(container, showContainer) {
        switch(getContainerRarity(container)) {
            case `COMMON`:
                if (!window.injected.filters.rarity.common) {
                    showContainer = false;
                }
                break;
            case `UNCOMMON`:
                if (!window.injected.filters.rarity.uncommon) {
                    showContainer = false;
                }
                break;
            case `RARE`:
                if (!window.injected.filters.rarity.rare) {
                    showContainer = false;
                }
                break;
            case `ULTRARARE`:
                if (!window.injected.filters.rarity.ultraRare) {
                    showContainer = false;
                }
                break;
            case `LEGENDARY`:
                if (!window.injected.filters.rarity.legendary) {
                    showContainer = false;
                }
                break;
        }

        return showContainer;
    }

    function toggleContainers(containerClassQuery) {
        var containers = document.getElementsByClassName(containerClassQuery);

        for (let container of containers) {
            var showContainer = true;
            showContainer = validateOwned(container, showContainer);
            showContainer = validateRarity(container, showContainer);

            if (!showContainer) {
                container.style.display = `none`;
            } else {
                container.style.display = null;
            }
        }
    }

    function onBodyChange(mut) {
        uiInjections();

        if (doControlsExist(document, `.reqCard`)) {
            addFilterControls();
            toggleContainers(`reqCard`);
        }
    }

    var mo = new MutationObserver(onBodyChange);
    mo.observe(document.body, {childList: true, subtree: true});
})();
