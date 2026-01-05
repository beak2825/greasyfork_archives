// ==UserScript==
// @name            WME Bookmarks
// @description     Bookmark, share your favourite places
// @version         2025.12.19.005
// @icon            data:image/png;base64,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
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @namespace       https://greasyfork.org/fr/scripts/4515-wme-bookmarks
// @connect         waze-france.fr
// @grant           GM_xmlhttpRequest
// @author          Sebiseba
// @copyright       Sebiseba 2014-2023
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/4515/WME%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/4515/WME%20Bookmarks.meta.js
// ==/UserScript==

/* global $ */
/* global WazeWrap */
/* global I18n */

(function() {
    //'use strict';
    const scriptName = GM_info.script.name;
    var BKMversion = GM_info.script.version, noSynch, link={}, bookmarks_Layer=null, bookmarkList=[], countries=[], checkData=true, debug = 0;
    var lang, tset, text1, text2, text3; // Language variables
    var BKMusername, BKMcountryActive; // DOM variables
    var di = 'data:image/png;base64,';
    const BKM_UPDATE_NOTES = `<b>NEW:</b><br> <b>FIXES:</b><br> - Update for new WME<br><br>`;
    const layerMapping = [
        { Idx: 1, id: "group_issues_tracker" },
        { Idx: 11, id: "group_places" }, { Idx: 12, id: "item_venues" }, { Idx: 35, id: "item_venues_labels" }, { Idx: 13, id: "item_residential_places" }, { Idx: 14, id: "item_parking_places" }, { Idx: 36, id: "item_venues_parking_labels" }, { Idx: 45, id: "item_natural_features" }, { Idx: 46, id: "item_venues_natural_features_labels" }, { Idx: 47, id: "item_my_saved_places" },
        { Idx: 15, id: "group_road" }, { Idx: 16, id: "item_road" }, { Idx: 38, id: "item_paths" }, { Idx: 17, id: "item_junction_boxes" }, { Idx: 18, id: "item_closures" }, { Idx: 31, id: "item_house_numbers" },
        { Idx: 64, id: "group_permanent_hazards" }, { Idx: 65, id: "item_permanent_hazard_camera" }, { Idx: 69, id: "item_permanent_hazard_railroad_crossing" }, { Idx: 72, id: "item_permanent_hazard_school_zone" }, { Idx: 66, id: "item_permanent_hazard_dangerous_curve" }, { Idx: 67, id: "item_permanent_hazard_dangerous_intersection" }, { Idx: 68, id: "item_permanent_hazard_dangerous_merge" }, { Idx: 70, id: "item_permanent_hazard_speed_bump" }, { Idx: 71, id: "item_permanent_hazard_toll_booth" },
        { Idx: 20, id: "group_display" }, { Idx: 21, id: "item_satellite_imagery" }, { Idx: 22, id: "item_area_managers" }, { Idx: 23, id: "item_gps_points" }, { Idx: 25, id: "item_editable_areas" }, { Idx: 43, id: "item_online_editors" }, { Idx: 29, id: "item_disallowed_turns" }, { Idx: 26, id: "item_map_comments" }, { Idx: 27, id: "group_cities" }, { Idx: 28, id: "item_city_names" }, { Idx: 32, id: "group_restricted_driving_areas" }, { Idx: 33, id: "item_restricted_driving_areas_names" },
        { Idx: 48, id: "item_group_imagery" }, { Idx: 54, id: "item_ee_merged_collection_by_latest_no_candid" }, { Idx: 56, id: "item_ee_merged_collection_by_quality_no_candid" }, { Idx: 58, id: "item_ee_satellite_pleiades_ortho_rgb" }, { Idx: 61, id: "item_ee_satellite_worldview2_ortho_rgb" }, { Idx: 62, id: "item_ee_satellite_worldview3_ortho_rgb" }, { Idx: 57, id: "item_ee_satellite_geoeye1_ortho_rgb" }, { Idx: 60, id: "item_ee_satellite_skysat_ortho_rgb" }, { Idx: 59, id: "item_ee_satellite_pneo_ortho_rgb" }
    ];

    // ***********
    // ** START **
    // ***********

    let wmeSDK;
    // Ensure SDK_INITIALIZED is available
    if (unsafeWindow.SDK_INITIALIZED) {
        unsafeWindow.SDK_INITIALIZED.then(bootstrap).catch((err) => {
            console.error(`${scriptName}: SDK initialization failed`, err);
        });
    }
    else {
        console.warn(`${scriptName}: SDK_INITIALIZED is undefined`);
    }
    function bootstrap() {
        wmeSDK = unsafeWindow.getWmeSdk({
            scriptId: scriptName.replaceAll(' ', ''),
            scriptName: scriptName,
        });

        // Use Promise.all to check readiness of all dependencies
        Promise.all([isWmeReady(), isWazeWrapReady()])
            .then(() => {
            console.log(`${scriptName}: All dependencies are ready.`);
            BKMinit();
            console.log(`${scriptName}: Initialized`);
        })
            .catch((error) => {
            console.error(`${scriptName}: Error during bootstrap -`, error);
        });
    }
    function isWmeReady() {
        return new Promise((resolve, reject) => {
            if (wmeSDK && wmeSDK.State.isReady() && wmeSDK.Sidebar && wmeSDK.LayerSwitcher && wmeSDK.Shortcuts && wmeSDK.Events) {
                console.log(`${scriptName}: WME is already ready.`);
                resolve();
            } else {
                wmeSDK.Events.once({ eventName: 'wme-ready' })
                    .then(() => {
                    if (wmeSDK.Sidebar && wmeSDK.LayerSwitcher && wmeSDK.Shortcuts && wmeSDK.Events) {
                        console.log(`${scriptName}: WME is fully ready now.`);
                        resolve();
                    } else {
                        reject(`${scriptName}: Some SDK components are not loaded.`);
                    }
                })
                    .catch((error) => {
                    console.error(`${scriptName}: Error while waiting for WME to be ready:`, error);
                    reject(error);
                });
            }
        });
    }
    function isWazeWrapReady() {
        return new Promise((resolve, reject) => {
            const maxTries = 1000;
            const checkInterval = 500;

            (function check(tries = 0) {
                if (unsafeWindow.WazeWrap && unsafeWindow.WazeWrap.Ready) {
                    console.log(`${scriptName}: WazeWrap is successfully loaded.`);
                    resolve();
                } else if (tries < maxTries) {
                    setTimeout(() => check(++tries), checkInterval);
                } else {
                    reject(`${scriptName}: WazeWrap took too long to load.`);
                }
            })();
        });
    }

    // ********************
    // **  CHECK SERVER  **
    // ********************

    const timeoutMs = 3000;
    const maxRetries = 4;
    function updateIcon($icon, state) {
        switch(state) {
            case 'ok':
                $('#pingAttempt').html('');
                $('#bkmServer').css("opacity","1");
                if (noSynch != 1) {
                    $('#transmit').show();
                    $('#notransmit').hide();
                    $('#noStable').hide();
                    $('#noSynch').hide();
                }
                $icon.html('<img src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_256.gif" style="height:16px;"/>');
                setTimeout(function() {
                    $icon.html('✔️').attr('title', 'Serveur OK');
                }, 1000);
                if ($('#chkSynchro').prop('checked')) { getBookmarks(''); }
                break;
            case 'instable':
                $icon.html('✖️').attr('title', 'Serveur instable');
                if (noSynch != 1) {
                    $('#transmit').hide();
                    $('#notransmit').hide();
                    $('#noStable').show();
                    $('#noSynch').hide();
                }
                break;
            case 'indisponible':
                $icon.html('❌').attr('title', 'Serveur indisponible');
                $('#pingAttempt').html(' Echec');
                if ($('#chkSynchro').prop('checked')) { $('#chkSynchro').prop('checked', false); }
                $('#bkmServer').css("opacity","0.3");
                if (noSynch != 1) {
                    $('#transmit').hide();
                    $('#notransmit').show();
                    $('#noStable').hide();
                    $('#noSynch').hide();
                }
                break;
        }
    }
    function pingServer(attempt = 1) {
        const $icon = $('#iconSynchro');
        const BKMusername = wmeSDK.State.getUserInfo()?.userName;
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://waze-france.fr/script/ping.htm`,
            timeout: timeoutMs,
            onload: function(response) {
                if (response.status === 200) {
                    updateIcon($icon, 'ok');
                } else {
                    console.warn(`Réponse HTTP inattendue: ${response.status}`);
                    handleRetry(attempt, $icon);
                }
            },
            onerror: function(err) {
                console.warn('Erreur réseau', err);
                handleRetry(attempt, $icon);
            },
            ontimeout: function() {
                console.warn('Timeout serveur');
                handleRetry(attempt, $icon);
            }
        });
    }
    function handleRetry(attempt, $icon) {
        if (attempt < maxRetries) {
            console.log(`${scriptName}: Nouvelle tentative dans 10s (tentative ${attempt + 1})`);
            updateIcon($icon, 'instable');
            setTimeout(() => pingServer(attempt + 1), 10000);
            $('#pingAttempt').html(' Tentative n°'+attempt);
        } else {
            console.error(`${scriptName}: Serveur considéré comme indisponible après ${maxRetries} tentatives`);
            updateIcon($icon, 'indisponible');

        }
    }

    // ************
    // **  MISC  **
    // ************

    function isJsonString(str) {
        try { JSON.parse(str); }
        catch (e) { return false; }
        return true;
    }
    function diffJSON(obj1, obj2, path = '') {
        const differences = {};
        const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

        keys.forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            const val1 = obj1 ? obj1[key] : undefined;
            const val2 = obj2 ? obj2[key] : undefined;

            if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
                const nested = diffJSON(val1, val2, fullPath);
                if (Object.keys(nested).length > 0) {
                    Object.assign(differences, nested);
                }
            } else if (val1 !== val2) {
                differences[fullPath] = { from: val1, to: val2 };
            }
        });
        return differences;
    }
    function BKMtableCountries() {
        var waitFordivHistoContent = setInterval(function() {
            if ($('#divHistoContent').length && wmeSDK.DataModel.Cities.getTopCity()) {
                $('#histoButtonDiv').show();
                $('#histoPrev').css('color', 'black');
                link={}; getLink(wmeSDK.Map.getPermalink({ includeLayers: true }));
                const d=new Date();
                const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }; //hour12: true
                let histoDate;
                if ($('#chkHistoDate').prop('checked')) {
                    histoDate = new Date().toLocaleString("en-US", options);
                } else {
                    histoDate = new Date().toLocaleString("fr-FR", options);
                }
                const encodedBookmark = {
                    country: BKMcountryActive,
                    name: getName(),
                    perma: link,
                    hour: histoDate
                };
                const jsonData = JSON.parse(localStorage.WMEHistoric);
                const result = jsonData.filter(item => item.perma.lon === link.lon && item.perma.lat === link.lat);
                if (result.length === 0) { // No double
                    $('#bkmHisto').append(makeLiShort(encodedBookmark,"Histo"));
                    jsonData.push(encodedBookmark);
                    if (jsonData.length > JSON.parse(localStorage.WMEBookmarksSettings).histolength) {
                        jsonData.shift();
                    }
                    localStorage.setItem('WMEHistoric', JSON.stringify(jsonData));
                    $('#bkmHisto').empty();
                    jsonData.slice().reverse().forEach(item => {
                        $('#bkmHisto').append(makeLiShort(item,"Histo"));
                    });
                }
                clearInterval(waitFordivHistoContent);
            }
        }, 200);

        const currentTopCountry = wmeSDK.DataModel.Countries.getTopCountry()?.name;
        const selectedCountry = $('#selectCountry').val();
        try {
            const a = JSON.parse(localStorage.WMEBookmarks);
            for (const item of a) {
                const pays = item.country;
                if (pays && pays.length > 0 && !countries.includes(pays)) {
                    countries.push(pays);
                }
            }
            if (!selectedCountry || selectedCountry === null) {
                if (debug) console.log(`${scriptName}: Main Countries listed`, countries);
                select(countries, 'selectCountry');
            }
        } catch (err) {
            console.error(`${scriptName}: Erreur parsing WMEBookmarks :`, err);
        }

        if (selectedCountry && currentTopCountry && selectedCountry !== currentTopCountry) {
            if (debug) console.log(`${scriptName}: Country changed :`, selectedCountry, currentTopCountry);

            const jsonData = JSON.parse(localStorage.WMEBookmarks);
            $('#bkmList').empty();

            jsonData.forEach(item => {
                if (item.country === selectedCountry) {
                    $('#bkmList').append(makeLi(item));
                }
            });
        }
    }
    function select(cArray, selectlist) {
        const BKMcountryActive = wmeSDK.DataModel.Countries.getTopCountry()?.name;
        const $CSelect = $('#' + selectlist);
        $CSelect.empty();
        for (const c of cArray) {
            const $option = $('<option></option>')
            .val(c)
            .text(c);
            if (c === BKMcountryActive) {
                $option.prop('selected', true);
            }
            $CSelect.append($option);
        }

        //If country not listed
        if (!cArray.includes(BKMcountryActive)) {
            const $missingOption = $('<option></option>')
            .val(BKMcountryActive)
            .text(BKMcountryActive)
            .prop('selected', true);
            $CSelect.append($missingOption);
        }
        giveResults("");
    }
    function giveResults(source) {
        $('#bkmList').empty();
        const jsonData = JSON.parse(localStorage.WMEBookmarks);

        if (source === "BKMSearch") {
            const query = $('#BKMSearch').val();
            const nq = normalizeText(query);

            if (query.length > 2) {
                const results = jsonData.filter(item => {
                    const ctry = item.country ? normalizeText(item.country) : "";
                    const name = item.name ? normalizeText(item.name) : "";
                    const comm = item.comm ? normalizeText(item.comm) : "";

                    return ctry.includes(nq) ||
                        name.includes(nq) ||
                        comm.includes(nq);
                });

                if (results.length !== 0) {
                    results.forEach(item => $('#bkmList').append(makeLi(item)));
                }
            }
        } else {
            jsonData
                .filter(item => item.country === $('#selectCountry').val())
                .sort((a, b) => {
                const sortA = Number(a.sort);
                const sortB = Number(b.sort);

                if (isNaN(sortA) && isNaN(sortB)) return 0;
                if (isNaN(sortA)) return 1;
                if (isNaN(sortB)) return -1;
                return sortA - sortB;
            })
                .forEach(item => $('#bkmList').append(makeLi(item)));
        }
        updateLayer();
    }
    function normalizeText(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }
    function normalizeSort(sortBy = "sort") {
        const topCountry = wmeSDK.DataModel.Countries.getTopCountry().name;
        const data = JSON.parse(localStorage.WMEBookmarks || "[]");
        const filtered = data.filter(item => item.country === topCountry);

        switch(sortBy) {
            case "name-asc":
                filtered.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
                break;
            case "name-desc":
                filtered.sort((a, b) => b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' }));
                break;
            case "sort":
            default:
                filtered.sort((a, b) => Number(a.sort) - Number(b.sort));
        }
        filtered.forEach((item, index) => {
            item.sort = index.toString();
        });
        const newData = data.map(item => {
            if (item.country === topCountry) {
                return filtered.find(f => f.name === item.name && f.perma.lon === item.perma.lon && f.perma.lat === item.perma.lat);
            } else {
                return item;
            }
        });
        localStorage.WMEBookmarks = JSON.stringify(newData);
        giveResults();
        BKMpostBookmarks();
    }
    function makeLi(item) {
        const liColor = item.color ? item.color : 'rgb(255, 255, 255)';
        const commText = item.comm ? item.comm.replace('\n','<br>') : ' ';
        const reminderIcon = item.reminder ? `<span class="bkm-btn bkm-reminder-icon">⏰</span>` : '';
        const shareIcon = item.share ? `<span class="bkm-btn bkm-share-icon">🔗</span>` : '';
        const $li = $(`<li class="bkm-item"
                data-reminder="${item.reminder || ''}"
                data-lonlat="${item.perma.lon}*${item.perma.lat}"
                data-zoom="${item.perma.zoom || ''}"
                data-layers="${item.perma.layers || ''}"
                data-share="${item.share || ''}"
                data-color="${liColor}"
                data-type_obj="${item.perma.type_obj || ''}"
                data-id_obj="${item.perma.id_obj || ''}">
                <span class="bkm-name">${item.name}</span>
                <span class="bkm-comment">${commText}</span>
                <div class="bkm-actions">${shareIcon}${reminderIcon}${checkObjIcon(item.perma.type_obj)}
                    <button class="bkm-btn bkm-editBtn" title="${lang[16]}">✏️</button>
                    <button class="bkm-btn bkm-deleteBtn" title="${lang[11]}">🗑️</button>
                    <button class="bkm-btn bkm-relocBtn" title="${lang[12]}">📌</button>
                </div></li> `)
        .attr('draggable', 'true')
        .css('background-color', liColor);
        return $li;
    }
    function makeLiShort(item,source) {
        let detail = (source === "Histo") ? item.hour : item.owner;
        const $li = $(`<li class="bkm-item" style="display:flex; justify-content:space-between; align-items:center; flex-direction:row;"
                data-lonlat="${item.perma.lon}*${item.perma.lat}"
                data-zoom="${item.perma.zoom}"
                data-layers="${item.perma.layers || ''}"
                data-type_obj="${item.perma.type_obj || ''}"
                data-id_obj="${item.perma.id_obj || ''}">
            <div class="bkm-name" style="text-align:left;">${item.name}</div>
            <div style="font-size:10px; text-align:right;">${detail}</div></li> `)
        .attr('draggable', 'false')
        .css('background-color', 'rgb(255, 255, 255)');
        return $li;
    }
    function makeListSortable() {
        const list = document.getElementById('bkmList');
        let draggedItem = null;

        list.addEventListener('dragstart', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            draggedItem = li;
            li.style.opacity = 0.5;
        });

        list.addEventListener('dragend', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            li.style.opacity = '';
            draggedItem = null;
            logListOrder();
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const li = e.target.closest('li');
            if (!li || li === draggedItem) return;

            const rect = li.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            list.insertBefore(draggedItem, next ? li.nextSibling : li);
        });
    }
    function logListOrder() {
        const listItems = document.querySelectorAll('#bkmList li');
        const jsonData = JSON.parse(localStorage.WMEBookmarks);

        listItems.forEach((li, index) => {
            const name = $(li).find('.bkm-name').text().trim();
            const comm = $(li).find('.bkm-comment').text().trim();

            const item = jsonData.find(obj => obj.name === name && obj.comm === comm);
            if (item) {
                item.sort = index.toString();
            } else {
                console.warn(`${scriptName}: No matches found for : name="${name}", comm="${comm}"`);
            }
        });
        localStorage.WMEBookmarks = JSON.stringify(jsonData);
        if ($('#chkSynchro').prop('checked')) {
            initBookmarks();
            setTimeout(BKMpostBookmarks, 500);
        }
    }
    function openEditForm($li){
        $('#divSelectCountry').hide();
        const currentName = $li.find('.bkm-name').text();
        const currentCoord = $li.data('lonlat');
        const currentComm = $li.find('.bkm-comment').html().replace(/<br\s*\/?>/gi, '\n');
        const currentShare = $li.data('share') || '';
        const currentReminder = $li.data('reminder') || '';
        const currentObjet = $li.data('type_obj') || '';
        const currentColor = $li.data('color') || $li.css('background-color');
        const $form = $(`
            <div class="bkm-edit-form-container" data-type_obj="${currentObjet}">
                <label>${lang[6]}:<input type="text" id="tmnEditName" value="${currentName}"></label>
                <label>${lang[17]}:</label>
                <div id="tmnColorPicker">
                    <div class="bkm-color-swatch" data-color="rgb(255, 255, 255)" style="background:rgb(255,255,255);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(255, 255, 204)" style="background:rgb(255,255,204);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(255, 204, 204)" style="background:rgb(255,204,204);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(204, 204, 204)" style="background:rgb(204,204,204);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(204, 255, 255)" style="background:rgb(204,255,255);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(204, 204, 255)" style="background:rgb(204,204,255);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(204, 255, 204)" style="background:rgb(204,255,204);"></div>
                    <div class="bkm-color-swatch" data-color="rgb(255, 204, 255)" style="background:rgb(255,204,255);"></div>
                </div>
                <label>${lang[14]}:<input type="datetime-local" id="tmnEditDate" value="${currentReminder}"/></label>
                <label>${lang[13]}:<textarea id="tmnEditComm" style="resize:vertical; min-height:100px;">${currentComm}</textarea></label>
                <label>${lang[2]}:<input type="text" id="tmnEditShare" value="${currentShare}"/></label>
                <div style="text-align:center;">
                    <button id="tmnEditCancel" style="margin:0 5px;">${lang[9]}</button>
                    <button id="tmnEditSave" style="margin:0 5px;">${lang[8]}</button>
                </div>
            </div>`);
        $form.find(`.bkm-color-swatch[data-color="${currentColor}"]`).addClass("selected");
        $('#BKMedit').empty().append($form);

        const $colorPicker = $form.find('#tmnColorPicker');
        const $inputName = $form.find('#tmnEditName');
        const $inputComm = $form.find('#tmnEditComm');
        const $inputDate = $form.find('#tmnEditDate');
        const $inputShare = $form.find('#tmnEditShare');
        const $btnSave = $form.find('#tmnEditSave');
        const $btnCancel = $form.find('#tmnEditCancel');

        let selectedColor = currentColor;

        $colorPicker.on('click', '.bkm-color-swatch', function() {
            $colorPicker.find('.bkm-color-swatch').removeClass('selected');
            $(this).addClass('selected');
            selectedColor = $(this).data('color');
        });
        $btnSave.on('click', function() {
            const newName = $inputName.val().trim();
            let newComm = $inputComm.val();
            newComm = newComm.replace(/\r?\n/g, '<br />');
            const newReminder = $inputDate.val();
            const newShare = $inputShare.val().trim();

            if (newName) { $li.find('.bkm-name').text(newName); }
            $li.find('.bkm-share').val(newShare);

            $li.css('background-color', selectedColor)
                .data('color', selectedColor)
                .attr('data-color', selectedColor)
                .data('share', newShare)
                .attr('data-share', newShare)
                .data('reminder', newReminder)
                .attr('data-reminder', newReminder);

            const $actions = $li.find('.bkm-actions');
            $actions.find('.bkm-share-icon').remove();
            $actions.find('.bkm-reminder-icon').remove();
            if (currentObjet) { $actions.prepend(checkObjIcon(currentObjet)); }
            if (newShare) { $actions.prepend('<span class="bkm-btn bkm-share-icon">🔗</span>'); }
            if (newReminder) { $actions.prepend('<span class="bkm-btn bkm-reminder-icon">⏰</span>'); }

            const [lon, lat] = currentCoord.split('*');
            const jsonData=JSON.parse(localStorage.WMEBookmarks);
            const bkmToChange = jsonData.find(item => item.perma.lon === lon && item.perma.lat === lat);
            selectedColor = (selectedColor === "rgb(255, 255, 255)") ? "" : selectedColor;
            if (bkmToChange) {
                bkmToChange.name = newName;
                bkmToChange.comm = newComm;
                bkmToChange.share = newShare;
                bkmToChange.reminder = newReminder;
                bkmToChange.color = selectedColor;
                localStorage.setItem('WMEBookmarks', JSON.stringify(jsonData));

                if ($('#chkSynchro').prop('checked')) {
                    if (debug) console.log(`${scriptName}: UPDATE: `, BKMusername, bkmToChange);
                    BKMupdateBookmarks('UPDATE',BKMusername, bkmToChange);
                }
            }
            $('#BKMedit').empty();
            $('#divSelectCountry').show();
            giveResults();
        });
        $btnCancel.on('click', function() {
            $('#BKMedit').empty();
            $('#divSelectCountry').show();
        });
    }
    function BKMconvertPermalink(data) { //Redo permalink
        if (data) {
            var l=data.split("|"), link = {};
            link.env=l[5];
            link.lat=l[1];
            link.lon=l[0];
            link.zoom=l[2];
            link.layers=l[3];
            if (l[4]) {
                switch (l[4].substring(0, 1)) {
                    case 's': link.segments = l[4].substring(2); break;
                    case 'n': link.nodes = l[4].substring(2); break;
                    case 'v': link.venues = l[4].substring(2); break;
                }
            }
            Object.keys(link).sort();
            return link;
        }
    }
    function getLink(pl) {
        const url = new URL(pl);
        const params = url.searchParams;
        const simpleKeys = { env: "env", lat: "lat", lon: "lon", zoomLevel: "zoom", s: "layers" };
        const objectKeys = [ "segments", "nodes", "venues", "bigJunctions", "mapProblems", "mapUpdateRequests", "permanentHazards", "mapComments", "editSuggestion", "segmentSuggestion" ];
        for (const key in simpleKeys) {
            if (params.has(key)) link[simpleKeys[key]] = params.get(key);
        }
        for (const objKey of objectKeys) {
            if (params.has(objKey)) {
                link.type_obj = objKey;
                link.id_obj = params.get(objKey);
                break;
            }
        }
    }
    function getName() {
        const city = wmeSDK.DataModel.Cities.getTopCity();
        if (city) {
            return city.name;
        } else {
            return lang[15];
        }
    }
    function checkObjIcon(typeobj) {
        let ObjIcon, withObj;
        switch (typeobj) {
            case "nodes":
                ObjIcon = di+"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";
                break;
            case "segments":
                ObjIcon= di+"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";
                break;
            case "venues":
                ObjIcon = di+"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";
                break;
            default:
                ObjIcon = '';
                break;
        }
        if (ObjIcon != '') { withObj = `<span class="bkm-btn bkm-share-icon"><img src="${ObjIcon}" style="height:12px;"></span>`; } else { withObj = ''; }
        return withObj;
    }
    function normalizeJSON(obj) {
        if (Array.isArray(obj)) return obj.map(normalizeJSON);
        if (obj !== null && typeof obj === 'object') {
            const sortedKeys = Object.keys(obj).sort();
            const res = {};
            for (const key of sortedKeys) {
                res[key] = normalizeJSON(obj[key]);
            }
            return res;
        }
        return obj;
    }
    function checkDatas() {
        if (checkData === false) return;
        const listFav = JSON.parse(localStorage.WMEBookmarks);
        if (listFav.length === 0) {
            $('#local2serv').css({ 'pointer-events': 'none', 'opacity': '0.3' });
            $('#razButton1').css({ 'pointer-events': 'none', 'opacity': '0.3' });
        } else {
            $('#local2serv').css({ 'pointer-events': 'auto', 'opacity': '1' });
            $('#razButton1').css({ 'pointer-events': 'auto', 'opacity': '1' });
        }
        if ($('#chkSynchro').prop('checked')) {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://waze-france.fr/script/bkm.php?getbookmarks2=' + BKMusername,
                headers:{"Content-Type": "application/x-www-form-urlencoded"},
                onload: function(data) {
                    const serverData = JSON.parse(data.responseText);
                    const serverJSON = normalizeJSON(serverData);
                    const localJSON = normalizeJSON(listFav);
                    localJSON.forEach(function(item) {
                        if (!item.reminder || item.reminder === null) { item.reminder = ""; }
                        if (!item.sort || item.sort === null) { item.sort = ""; }
                        if (!item.color || item.color === null) { item.color = ""; }
                        if (!item.perma.type_obj || item.perma.type_obj === null) { item.perma.type_obj = ""; }
                        if (!item.perma.id_obj || item.perma.id_obj === null) { item.perma.id_obj = ""; }
                    });
                    const syncEnabled = $('#chkSynchro').prop('checked') === true;
                    if (debug) { console.log('Diff: ', diffJSON(serverJSON, localJSON), Object.keys(diffJSON(serverJSON, localJSON)).length); }
                    if (Object.keys(diffJSON(serverJSON, localJSON)).length != 0 && syncEnabled) { $('#iconServer').click(); checkData=false; }
                    if (serverData.length === 0) {
                        $('#serv2local').css({ 'pointer-events': 'none', 'opacity': '0.3' });
                        $('#razButton2').css({ 'pointer-events': 'none', 'opacity': '0.3' });
                    } else {
                        $('#serv2local').css({ 'pointer-events': 'auto', 'opacity': '1' });
                        $('#razButton2').css({ 'pointer-events': 'auto', 'opacity': '1' });
                    }
                }
            });
        }
        pingServer();
    }
    function checkReminder() {
        const a = JSON.parse(localStorage.WMEBookmarks);
        const toSave = [];

        $.each(a, function(_, bookmark) {
            const encodedBookmark = { ...bookmark };
            const reminder = bookmark.reminder;

            if (reminder && !isNaN(Date.parse(reminder))) {
                const reminderDate = new Date(reminder);

                if (reminderDate <= new Date()) {
                    if (debug) console.log(`${scriptName}: Check Reminder`, reminder);
                    WazeWrap.Alerts.info("WME Bookmarks", `${bookmark.name}\n${bookmark.comm}`, true, false);
                    encodedBookmark.reminder = "";
                    if ($('#chkSynchro').prop('checked')) {
                        if (debug) console.log(`${scriptName}: UPDATE: `, BKMusername, encodedBookmark);
                        BKMupdateBookmarks('UPDATE',BKMusername, encodedBookmark);
                    }
                }
            }
            toSave.push(encodedBookmark);
            setTimeout(giveResults, 500);
        });
        localStorage.setItem('WMEBookmarks', JSON.stringify(toSave));
    }
    function toggleLayer(id, shouldBeChecked) {
        const el = document.getElementById(`layer-switcher-${id}`);
        if (!el) return;
        const input = el.shadowRoot ? el.shadowRoot.querySelector('input') : el;
        if (input.checked !== shouldBeChecked) { el.click(); }
    }
    function applyLayers(layers) {
        const bin = BigInt(layers).toString(2);
        layerMapping
            .filter(({ id }) => id.startsWith("group_"))
            .forEach(({ Idx, id }) => {
            const bit = bin[bin.length - 1 - Idx] || '0';
            toggleLayer(id, bit === '1');
            if (debug) console.log("GROUP", id, bit);
        });
        setTimeout(() => {
            layerMapping
                .filter(({ id }) => id.startsWith("item_"))
                .forEach(({ Idx, id }) => {
                const bit = bin[bin.length - 1 - Idx] || '0';
                toggleLayer(id, bit === '1');
                if (debug) console.log("ITEM", id, bit);
            });
        }, 200);
    }

    // ****************
    // ** MAIN HTML  **
    // ****************

    async function BKMinit() {
        console.log(`${scriptName} ${BKMversion} starting`);
        BKMusername = wmeSDK.State.getUserInfo()?.userName;
        BKMcountryActive = wmeSDK.DataModel.Countries.getTopCountry()?.name;

        // Verify localStorages
        if ('undefined' === typeof localStorage.WMEBookmarks || !isJsonString(localStorage.WMEBookmarks)) { localStorage.setItem('WMEBookmarks', '[]'); }
        if ('undefined' === typeof localStorage.WMEBookmarksShared || !isJsonString(localStorage.WMEBookmarksShared)) { localStorage.setItem('WMEBookmarksShared', '[]'); }
        if ('undefined' === typeof localStorage.WMEHistoric || !isJsonString(localStorage.WMEHistoric)) { localStorage.setItem('WMEHistoric', '[]'); }
        if ('undefined' === typeof localStorage.WMECopyPastePOI || !isJsonString(localStorage.WMECopyPastePOI)) { localStorage.setItem('WMECopyPastePOI', '[]'); }
        if ('undefined' === typeof localStorage.WMEBookmarksSettings || !isJsonString(localStorage.WMEBookmarksSettings)) {
            const settings = {
                version: BKMversion,
                zoom: true,
                layers: true,
                chkLastClic: true,
                server: false,
                synchro: true,
                histonav: true,
                histodate: false,
                histolength:"100"
            };
            localStorage.setItem('WMEBookmarksSettings', JSON.stringify(settings));
        }
        if ('undefined' === typeof localStorage.WMEPrevNext || !isJsonString(localStorage.WMEPrevNext)) { localStorage.setItem('WMEPrevNext', '{"prev":[],"next":[]}'); }

        // Convert to new format
        let arr = JSON.parse(localStorage.WMEBookmarks);
        const typeMap = { MC: "mapComments", MP: "mapProblems", UR: "mapUpdateRequests" };
        arr.forEach(item => {
            if (!item.perma) return;
            for (let k of ["MC", "MP", "UR"]) {
                if (item.perma[k] && item.perma[k] !== "0") {
                    item.perma.type_obj = typeMap[k];
                    item.perma.id_obj = item.perma[k];
                    break;
                }
            }
            delete item.perma.MC;
            delete item.perma.MP;
            delete item.perma.UR;
        });
        localStorage.WMEBookmarks = JSON.stringify(arr);

        // Translation
        var BKMLang = I18n.locale;
        if (BKMLang == 'fr') {
            lang = new Array('Favoris', 'Partage des amis', 'Partage ', 'Historique', 'Sauvegarde / Restauration', 'Synchronisation', 'Nom', 'Copier / Restaurer POI', 'Valider', 'Annuler', 'Ajouter', 'Supprimer', 'Relocaliser', 'Commentaire', 'Alarme', 'Sans Nom', 'Modifier', 'Couleur', 'Paramètres', 'Cliquez pour la recherche', 'Cliquez pour la sélection de pays', 'Écrivez pour rechercher', 'Êtes-vous sûr de remplacer vos données ?', 'Êtes-vous sûr d\'ajouter à vos données ?');
            tset = new Array('Appliquer le zoom', 'Appliquer les calques', 'Changement auto de serveur (usa/intl)', 'Synchroniser avec le serveur', 'Effacer les données locales', 'Effacer les données serveur du script', 'Va supprimer votre tri personnalisé, toujours d\'accord ?', 'Effacer l\'historique', 'Nouveau', 'Fusionner', 'Surligner le dernier lien visité', 'Activer l\'historique de navigation', 'Nombre max de l\'historique', 'Date de l\'historique au format US', 'Données non synchronisées', 'Données synchronisées', 'Etat du serveur');
            text1 = ' Copiez ces données dans un fichier TXT pour les conserver.<br/>Collez vos données pour les restaurer.';
            text2 = ' Écrivez les pseudos avec qui vous souhaitez partager le favoris. Le séparateur se mettra automatiquement.';
            text3 = ' Lorsque vous êtes synchronisé avec le serveur, le script envoie des données à celui-ci.<br>Les données sont: Pseudo, coordonnées, pays, nom du favoris, commentaires et pseudo des partages.<br>Effacer les données serveur du script supprime toutes traces de votre profil.';
        }
        else if (BKMLang == 'de') {
            lang = new Array('Favoriten', 'Freunde teilen', 'Teilen', 'Verlauf', 'Sichern/Wiederherstellen', 'Synchronisieren', 'Name', 'POI kopieren/wiederherstellen', 'Bestätigen', 'Abbrechen', 'Hinzufügen', 'Löschen', 'Verschieben', 'Kommentar', 'Alarm', 'Unbenannt', 'Bearbeiten', 'Farbe', 'Einstellungen', 'Zum Suchen klicken', 'Zum Auswählen von Ländern klicken', 'Eingabe zum Suchen', 'Möchten Sie Ihre Daten wirklich ersetzen?', 'Möchten Sie Ihre Daten wirklich ergänzen?');
            tset = new Array('Zoomstufe sichern', 'Ebenen sichern', 'Server automatisch wechseln (US/ROW)', 'Mit Server synchronisieren', 'Lokale Daten löschen', 'Serverdaten aus Skript löschen', 'Benutzerdefinierte Sortierung wird gelöscht, ist das in Ordnung?', 'Verlauf löschen', 'Neu', 'Zusammenführen', 'Zuletzt besuchten Link hervorheben', 'Browserverlauf aktivieren', 'Maximale Verlaufsgröße', 'Verlaufsdatum im US-Format', 'Daten nicht synchronisiert', 'Daten synchronisiert', 'Serverstatus');
            text1 = ' Daten zur Sicherung in eine TXT-Datei sichern.<br/>Zur Wiederherstellung Daten hier einfügen.';
            text2 = ' Usernamen des Users eintragen, mit dem du den Favoriten teilen willst. Trennzeichen werden automatisch eingefügt.';
            text3 = ' Beim Synchronisieren mit dem Server werden folgende Daten übermittelt:<br>Username, Koordinaten, Land, Name des Favoriten, Kommentare und Usernamen, mit denen geteilt wurde.<br>Server-Daten löschen entfernt alle deiner Spuren auf dem Server.';
        }
        else {
            lang = new Array('Bookmarks', 'Friend Sharing', 'Share', 'History', 'Backup/Restore', 'Sync', 'Name', 'Copy/Restore POI', 'Confirm', 'Cancel', 'Add', 'Delete', 'Relocate', 'Comment', 'Alarm', 'Unnamed', 'Edit', 'Color', 'Settings', 'Click to Search', 'Click to Select Countries', 'Type to Search', 'Are you sure you want to replace your data?', 'Are you sure you want to add to your data?');
            tset = new Array('Apply zoom', 'Apply layers', 'Auto switch server (usa/intl)', 'Synchronize with server', 'Clear local data', 'Clear server data from script', 'Will delete your custom sort, still okay?', 'Clear history', 'New', 'Merge', 'Highlight last visited link', 'Enable browsing history', 'Max history size', 'History date in US format', 'Data not synchronized', 'Data synchronized', 'Server status');
            text1 = ' Copy data into a TXT file to preserve them.<br/>Paste your data to restore them.';
            text2 = ' Write the nick you want to share the bookmark. The separator will be inserted automatically';
            text3 = ' When you are synchronized with the server, the script sends data to it <br>Data is: Nickname, coordinates, country, name of bookmarks, comments and nicknames shares <br> Clear script data server deletes all traces of your profile.';
        }
        mainPart();
    }
    function mainPart() {
        var $section = $('<div>', { id: 'WMEBookmarks' });

        // Function to inject custom CSS
        function addCustomStyles() {
            const style = document.createElement('style');
            style.textContent = `
            #addNodeButton { float:left; margin:2px 5px 0 0; cursor:pointer; font-size:16px; width:26px; height:26px; border-radius:50%; text-align:center; background-color:white; color:#000; transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; line-height:26px; box-shadow:0 2px 4px rgba(0,0,0,0.2); }
            #addNodeButton:hover { background-color:#09f; color:white; transform:scale(1.1); box-shadow:0 4px 8px rgba(0,0,0,0.3); }

            .toolbarBKM { width:100%; margin-top:10px; }
            .toolbarBKM-list { display:flex; justify-content:flex-start; align-items:center; padding:0; border-bottom:1px solid #ddd; padding-bottom:8px; }
            .toolbarBKM-list li { display:flex; align-items:center; justify-content:center; font-size:20px; margin:5px; cursor:pointer; transition: color 0.2s ease; }
            .toolbarBKM-list li span { font-size:20px; color:#bbb; transition: color 0.2s ease; }
            .toolbarBKM-list li.active span { color: #0099ff; }

            .toolbarBKM-content > div { display:none; }
            .toolbarBKM-content > div.active { display:block; }
            #divContent, #divShareContent, #divHistoContent, .divContainer { position:relative; background:#f2f4f7; border-radius:6px; box-shadow:0 0 0 1px #d5d7db; padding:5px; min-height:30px; overflow-y:auto; }
            #selectCountry, #BKMSearch, #bkmSortMode { border:0; width:90%; margin:5px 3px 0 0; }
            #divSelectCountry span { cursor:pointer; }
            #BKMSearch { display:none; }
            #sortAZ, #sortZA { margin:5px; height:20px; font-size:10px; }

            .bkm-list-container { margin:1px auto; }
            .bkm-list { list-style:none; padding:0; margin:0; }
            .bkm-item { position:relative; display:flex; flex-direction:column; align-items:flex-start; padding:3px 8px; min-height:45px; border-radius:8px; margin-bottom:5px; cursor:pointer; background-color:rgb(255, 255, 255); transition: background-color 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
            .bkm-item:hover { background-color:#e5f6ff !important; }
            .bkm-item.bkm-selected { background-color:#e8f2ff; }
            .bkm-name { font-weight:500; font-size:13px; }
            .bkm-comment { font-size:10px; color:#0099ff; cursor:text; }

            .bkm-actions { position:absolute; top:8px; right:2px; display:flex; }
            .bkm-actions:hover { background-color:#e5f6ff; }
            .bkm-item .bkm-actions button { display:none; }
            .bkm-item:hover .bkm-actions button { display:inline-block; }
            .bkm-item:not(:hover) .bkm-actions .bkm-reminder-icon, .bkm-item:not(:hover) .bkm-actions .bkm-share-icon { display:inline-block; }
            .bkm-item:hover .bkm-actions .bkm-reminder-icon, .bkm-item:hover .bkm-actions .bkm-share-icon { display:none; }

            .bkm-btn { background:none; border:0; cursor:pointer; padding:4px 6px; border-radius:6px; transition: background-color 0.2s ease, color 0.2s ease; }
            .bkm-btn:hover { background:#0585dc; color:white; }

            .bkm-edit-form-container { background:#f2f4f7; border-radius:12px; box-shadow:0 0 0 1px #d5d7db; padding:16px 16px 5px; margin:0 auto 10px; transition: all 0.2s ease; }
            .bkm-edit-form-container label { display:block; margin-bottom:8px; font-size:12px; color:#111; }
            .bkm-edit-form-container input[type="text"], .bkm-edit-form-container input[type="datetime-local"] , .bkm-edit-form-container textarea { padding:6px 8px; border-radius:6px; border:1px solid #e6e9ee; font-size:12px; width:100%; box-sizing:border-box; margin-top:4px; transition: border-color 0.2s ease, background-color 0.2s ease; }
            .bkm-edit-form-container button { border-radius:100px; font-size:15px; height:var(--wz-button-height, var(--space-button-medium, 40px)); padding:0 calc(var(--space-always-xxs, 4px) + var(--space-always-m, 16px)); background-color:var(--wz-button-background-color, var(--primary, #0099ff)); color:var(--on_primary, #ffffff); border:0; font-size:13px; transition: background-color 0.2s ease, color 0.2s ease; }
            .bkm-edit-form-container button:hover { background:#095cb5; }

            .bkm-color-swatch { width:24px; height:24px; display:inline-block; cursor:pointer; border:1px solid #ccc; margin-right:4px; border-radius:4px; transition: border-color 0.2s ease; }
            .bkm-color-swatch.selected { border:2px solid #0b74de; }
            .bkm-color-swatch:hover { border-color:#0b74de; }

            .subtitle-bkm {padding:10px; margin-bottom:10px; letter-spacing:var(--wz-letter-spacing, 1.5px); font-weight:var(--wz-font-weight, 500); font-size:12px; color:var(--content_p1, #3c4043); border-bottom:1px solid #ddd;}
            .subtitle-bkm .fa { font-size: 16px; margin-right:5px; color:var(--leading_icon, #90959c); }
            .subtitle-bkm span { text-transform:uppercase; position:relative; top:-2px; }

            #iconSynchro { margin-left:10px; cursor:default; }
            .synchButton { margin:10px; padding:5px; background-color:#09f; transition:background-color 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius:8px; }
            .synchButton span { font-size:20px; }
            .synchButton:hover { background-color:#095CB5; transform:scale(1.1); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
            `;
            document.head.appendChild(style);
        }

        // Append the HTML content to the section
        var settings = JSON.parse(localStorage.WMEBookmarksSettings);
        const separator = '<hr style="margin:0px 0 15px; border-top:1px solid #aaa;" />';
        $section.append(`
        <div style="float:left;margin-left:5px;"><b><a href="https://greasyfork.org/scripts/4515-wme-bookmarks" target="_blank"><u>WME Bookmarks</u></a></b> v${GM_info.script.version}</div>
        <div style="clear:both;"></div>
        <div class="toolbarBKM">
            <ul class="toolbarBKM-list">
                <li id="iconBookmarks"><span class="fa fa-star" title="${lang[0]}"></span></li>
                <li id="iconShare"><span class="fa fa-share-alt-square" title="${lang[1]}"></span></li>
                <li id="iconHisto"><span class="fa fa-history" title="${lang[3]}"></span></li>
                <li id="iconCopy"><span class="fa fa-copy" title="${lang[7]}"></span></li>
                <li id="iconBackup"><span class="fa fa-cube" title="${lang[4]}"></span></li>
                <li id="iconSettings"><span class="fa fa-sliders" title="${lang[18]}"></span></li>
                <li id="iconServer"><span class="fa fa-sitemap" title="${lang[5]}"></span></li>
                <li id="iconSynchLive" style="pointer-events:none; margin-left:auto; display:none;"><span class="fa fa-cloud" style="color:#09f;"></span></li>
            </ul>
            <div class="toolbarBKM-content">
                <div id="divBookmarks" style="display:none;">
                    <div id="divSelectCountry" class="bkm-edit-form-container">
                        <select type="text" name="Country" id="selectCountry"></select>
                        <input type="text" name="Country" id="BKMSearch" title="${lang[21]}">
                        <span id="goToSearch" title="${lang[19]}">🔍</span><span id="goToSelect" style="display:none;" title="${lang[20]}">📜</span>
                        <div id="sortOptions" style="padding-top:10px; text-align:center;"><button id="sortAZ" type="button">A-Z</button><button id="sortZA" type="button">Z-A</button></div>

                    </div>
                    <div id="BKMedit"></div>
                    <div id="divContent" style="max-height:60vh;"></div>
                </div>

                <div id="divShare" style="display:none;">
                    <div class="subtitle-bkm"><div class="fa fa-share-alt-square"></div><span>${lang[1]}</span></div>
                    <div id="divShareContent"></div>
                </div>

                <div id="divHisto" style="display:none;">
                    <div class="subtitle-bkm"><div class="fa fa-history"></div><span>${lang[3]}</span></div>
                    <div id="divHistoContent"></div>
                    <div class="bkm-edit-form-container" id="histoButtonDiv"><button id="razButton3" type="button" style="margin-top:5px;">${tset[7]}</button></div>
                </div>

                <div id="divCopy" style="display:none;"><div id="divCopyContent"></div></div>
                <div id="divBackup" style="display:none;">
                    <div class="subtitle-bkm"><div class="fa fa-cube"></div><span>${lang[4]}</span></div>
                     <div class="bkm-edit-form-container">
                        <b>JSON</b> <textarea id="divBackupJSON" style="width:100%; min-height:200px;"></textarea>
                        <div style="text-align:center;">
                            <wz-button class="button--_PLJB" id="tmnBackupAdd" disabled="" color="primary" size="md" type="button" name="" value=""><template shadowrootmode="open"><button class="wz-button primary md" disabled="" type="button" name="" value=""><span class="color-layer"></span><slot name="left-icon"></slot><span class="button-text"><slot></slot></span><slot name="right-icon"></slot></button></template>${tset[9]}</wz-button>
                            <wz-button class="button--_PLJB" id="tmnBackupNew" disabled="" color="primary" size="md" type="button" name="" value=""><template shadowrootmode="open"><button class="wz-button primary md" disabled="" type="button" name="" value=""><span class="color-layer"></span><slot name="left-icon"></slot><span class="button-text"><slot></slot></span><slot name="right-icon"></slot></button></template>${tset[8]}</wz-button>
                            <img id="spinnerBackup" src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_256.gif" style="height:26px;display:none;"/>
                            <img id="validBackup" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Check_mark_%28blue%29.svg" style="height:20px;display:none;"/>
                        </div>
                    </div>
                    <p style="margin:25px 0 0;"><span class="fa fa-info-circle" style="padding:0;color:#36c;"></span><span style="font-size:12px;">${text1}</span></p>
                </div>

                <div id="divSettings" style="display:none;">
                    <div class="subtitle-bkm"><div class="fa fa-sliders"></div><span>${lang[18]}</span></div>
                    <div class="bkm-edit-form-container">
                        <wz-label html-for=""><template shadowrootmode="open"><label for=""><wz-subhead5><template shadowrootmode="open"><slot></slot></template><slot></slot></wz-subhead5></label></template>${lang[0]}</wz-label>
                        <wz-toggle-switch name="chkZoom" id="chkZoom" checked="${settings.zoom ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[0]}
                            <input type="checkbox" name="chkZoom" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br style="margin:10px;"/>
                        <wz-toggle-switch name="chkLayers" id="chkLayers" checked="${settings.layers ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[1]}
                            <input type="checkbox" name="chkLayers" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br/>
                        <wz-toggle-switch name="chkLastClic" id="chkLastClic" checked="${settings.chkLastClic ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[10]}
                            <input type="checkbox" name="chkLastClic" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br/>
                        <wz-toggle-switch name="chkServer" id="chkServer" checked="${settings.server ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[2]}
                            <input type="checkbox" name="chkServer" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br/>
                        ${separator}
                        <wz-label html-for=""><template shadowrootmode="open"><label for=""><wz-subhead5><template shadowrootmode="open"><slot></slot></template><slot></slot></wz-subhead5></label></template>${lang[3]}</wz-label>
                        <wz-toggle-switch name="chkHistoNav" id="chkHistoNav" checked="${settings.histonav ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[11]}
                            <input type="checkbox" name="chkHistoNav" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br/>
                        <wz-toggle-switch name="chkHistoDate" id="chkHistoDate" checked="${settings.histodate ? 'checked' : 'false'}" value="" style="margin-bottom: 15px;">${tset[13]}
                            <input type="checkbox" name="chkHistoDate" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch><br/>
                        <div style="margin-bottom:15px;">${tset[12]} <select type="text" name="HistoLimit" id="HistoLimit"><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="200">200</option></select></div>
                    </div>
                </div>

                <div id="divServer" style="display:none;">
                    <div class="subtitle-bkm"><div class="fa fa-sitemap"></div><span>${lang[5]}</span></div>
                    <div class="toolbarBKM-list" style="margin:15px 0; border:0;">
                        <span>${tset[16]}: </span><span id="iconSynchro" style="font-size:15px;" title="${tset[3]}"></span><span id="pingAttempt" style="font-size:11px; padding-left:5px;"</span>
                    </div>
                    <div class="divContainer">
                        <wz-toggle-switch name="chkSynchro" id="chkSynchro" checked="${settings.synchro ? 'checked' : 'false'}" class="alert-settings-visibility-toggle" tabindex="0" value="">${tset[3]}
                        <input type="checkbox" name="chkSynchro" value="" style="display: none; visibility: hidden;">
                        </wz-toggle-switch>
                        <center><table style="text-align:center;margin-top:15px; border:0;">
                            <tr>
                                <td style="font-size:40px;"><span id="bkmServer">📟</span></td>
                                <td style="width:40px; height:40px;">
                                <img id="transmit" style="width:30px;" src="https://waze-france.fr/script/crossing_circles.gif" title="Connected" />
                                <span id="notransmit" style="width:30px; display:none;" title="Not connected">❌</span>
                                <span id="noStable" style="width:30px;display:none;" title="Not stable">✖️</span>
                                <span id="noSynch" style="width:30px;display:none;" title="Not synch">➰</span></td>
                                <td style="font-size:40px;">💻</td>
                            </tr>
                            <tr style="height:30px;"><td style="font-size:10px;">Server</td><td></td><td style="font-size:10px;">Local</td></tr>
                            <tr>
                                <td><div class="bkm-edit-form-container" style="box-shadow:none; text-align:center; padding:0;"><button id="razButton2" type="button" style="margin:0 10px;" title="${tset[5]}">Clear</button></div></td><td></td>
                                <td><div class="bkm-edit-form-container" style="box-shadow:none; text-align:center; padding:0;"><button id="razButton1" type="button" style="margin:0 10px;" title="${tset[4]}">Clear</button></div></td>
                            </tr>
                            <tr class="synchOptions" style="display:none;"><td colspan="3" style="height:50px;">➰ ${tset[14]}</td></tr>
                            <tr class="synchDone" style="display:none;"><td colspan="3" style="height:50px;">✅ ${tset[15]}</td></tr>
                            <tr class="synchOptions" style="display:none;">
                                <td><div id="serv2local" class="synchButton" title="Server to local"><span>📟</span><br>⏬<br><span>💻</span></div><img id="spinnerS2C" src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_256.gif" style="height:26px;display:none;"/></td><td></td>
                                <td><div id="local2serv" class="synchButton" title="Local to server"><span>💻</span><br>⏬<br><span>📟</span></div><img id="spinnerC2S" src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_256.gif" style="height:26px;display:none;"/></td>
                            </tr>
                        </table></center>
                    </div>
                    <p style="margin:25px 0 0;"><span class="fa fa-info-circle" style="padding:0;color:#36c;"></span><span style="font-size:12px;">${text3}</span></p>
                </div>
            </div>
        </div>`);
        addCustomStyles();

        if (!settings.histolength || settings.histolength === "") {
            settings.histolength = 100;
            localStorage.setItem('WMEBookmarksSettings', JSON.stringify(settings));
        }

        // Register the script tab with the sidebar
        wmeSDK.Sidebar.registerScriptTab()
            .then(({ tabLabel, tabPane }) => {
            // Set the tab label and title
            tabLabel.textContent = '⭐';
            tabLabel.title = GM_info.script.name;

            // Append the section to the tab pane
            tabPane.appendChild($section.get(0));

            if ($('#chkSynchro').prop('checked') === false) {
                $('#iconShare').hide();
                $('#transmit').hide();
                $('#notransmit').show();
                $('#bkmServer').css("opacity","0.3");
                $('#shareButton').animate({ width: '0' }, 250);
            }
            if ($('#chkCopyPaste').prop('checked') === false) {
                $('#iconCopy').hide();
            }

            $(document).on('click', '.toolbarBKM-list li', function() {
                const $clickedLi = $(this);
                const iconId = $clickedLi.attr('id');
                const targetDiv = '#div' + iconId.replace('icon', '');
                const icons = ['#iconBookmarks', '#iconShare', '#iconHisto', '#iconCopy', '#iconBackup', '#iconSettings', '#iconServer'];
                const divs = ['#divBookmarks', '#divShare', '#divHisto', '#divCopy', '#divBackup', '#divSettings', '#divServer'];
                const iconActions = {
                    '#iconBookmarks': () => {
                        checkData = true;
                        checkDatas();
                    },
                    '#iconShare': () => loadShareData(),
                    '#iconCopy': () => initCopyFeature(),
                    '#iconBackup': () => BKMloadBackup(),
                    '#iconServer': () => checkDatas()
                };
                divs.forEach((id, i) => {
                    if (id === targetDiv) {
                        $(id).stop(true, true).slideDown(200);
                    } else {
                        $(id).stop(true, true).slideUp(200);
                    }
                });
                $('.toolbarBKM-list li').removeClass('active');
                $clickedLi.addClass('active')

                const clickedIcon = `#${iconId}`;
                if (typeof iconActions[clickedIcon] === 'function') { iconActions[clickedIcon](); }
            });
            $('#divBookmarks').show();
            $('#iconBookmarks').addClass('active');
            $('#selectCountry').on('change', function() {
                giveResults("");
            });
            $('#goToSearch').click(function() {
                $(this).hide();
                $('#goToSelect').show();
                $('#selectCountry').hide();
                $('#sortOptions').hide();
                $('#BKMSearch').show();
                $('#divSelectCountry').css('padding','16px');
                giveResults("BKMSearch");
            });
            $('#goToSelect').click(function() {
                $(this).hide();
                $('#goToSearch').show();
                $('#BKMSearch').hide();
                $('#selectCountry').show();
                $('#sortOptions').show();
                $('#divSelectCountry').css('padding','16px 16px 5px');
                giveResults("");
            });
            $('#sortAZ').click(function () {
                const answer = window.confirm(tset[6]);
                if (!answer) return;
                normalizeSort("name-asc");
            });
            $('#sortZA').click(function () {
                const answer = window.confirm(tset[6]);
                if (!answer) return;
                normalizeSort("name-desc");
            });
            $('#BKMSearch').on('keyup', function() {
                giveResults("BKMSearch");
            });
            $('#chkSynchro').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                if ($('#chkSynchro').prop('checked')) {
                    a.synchro=true;
                    $('#iconShare').show();
                    $('#transmit').show();
                    $('#notransmit').hide();
                    $('#noStable').hide();
                    $('#noSynch').hide();
                    $('#bkmServer').css("opacity","1");
                    $('#shareButton').animate({ width: '34px' }, 250);
                    pingServer();
                } else {
                    a.synchro=false;
                    $('#iconShare').hide();
                    $('#transmit').hide();
                    $('#notransmit').show();
                    $('#noStable').hide();
                    $('#noSynch').hide();
                    $('.synchDone').hide();
                    $('#bkmServer').css("opacity","0.3");
                    $('#shareButton').animate({ width: '0' }, 250);
                }
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#chkZoom').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                ($('#chkZoom').prop('checked') ? a.zoom=true : a.zoom=false)
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#chkLayers').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                ($('#chkLayers').prop('checked') ? a.layers=true : a.layers=false)
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#HistoLimit').val(settings.histolength);
            $('#HistoLimit').on('change', function() {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                a.histolength=$('#HistoLimit').val();
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#tmnBackupAdd').click(function () {
                backup('add');
            });
            $('#tmnBackupNew').click(function () {
                backup('new');
            });
            $('#divBackupJSON').on('paste', function() {
                $('#tmnBackupAdd').prop( "disabled", false );
                $('#tmnBackupNew').prop( "disabled", false );
            });
            $('#chkServer').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                ($('#chkServer').prop('checked') ? a.server=true : a.server=false)
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#chkCopyPaste').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                if ($('#chkCopyPaste').prop('checked')) {
                    a.lcopy=true;
                    $('#iconCopy').fadeIn(400);
                } else {
                    a.lcopy=false;
                    $('#iconCopy').fadeOut(400);
                }
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#razButton1').click(function () {
                var answer = window.confirm(tset[4] + ' ?');
                if (answer) {
                    localStorage.setItem('WMEBookmarks', '[]');
                    BKMtableCountries();
                    select(countries, 'selectCountry');
                    giveResults("");
                    $('#iconBookmarks').click();
                }
            });
            $('#razButton2').click(function () {
                var answer = window.confirm(tset[5] + ' ?');
                if (answer) {
                    initBookmarks();
                    checkDatas();
                }
            });
            $('#razButton3').click(function () {
                var answer = window.confirm(tset[7] + ' ?');
                if (answer) {
                    localStorage.setItem('WMEHistoric', '[]');
                    $('#bkmHisto').empty();
                    $('#histoButtonDiv').hide();
                }
            });
            $('#chkHistoNav').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                if ($('#chkHistoNav').prop('checked')) {
                    a.histonav=true;
                    $('#iconHisto').fadeIn(400);
                } else {
                    a.histonav=false;
                    $('#iconHisto').fadeOut(400);
                }
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#chkHistoDate').click(function () {
                var a=JSON.parse(localStorage.WMEBookmarksSettings);
                if ($('#chkHistoDate').prop('checked')) {
                    a.histodate=true;
                } else {
                    a.histodate=false;
                }
                localStorage.setItem('WMEBookmarksSettings', JSON.stringify(a));
            });
            $('#serv2local').click(function () { getBookmarks('serv2local'); });
            $('#local2serv').click(function () {
                $('#local2serv').hide();
                $('#spinnerC2S').show();
                BKMpostBookmarks();
                setTimeout(function() {
                    $('#spinnerC2S').hide();
                    $('#local2serv').show();
                    $('#iconServer').click();
                    setTimeout(function() { $('#iconBookmarks').click(); }, 1500);
                }, 1500);
            });

            $('#iconCopy').hide();
            const auto = document.querySelector('#search-autocomplete');
            const input = auto.shadowRoot
            .querySelector('wz-text-input')
            .shadowRoot
            .querySelector('input');
            input.addEventListener('paste', (e) => {
                const pasted = e.clipboardData.getData('text');
                let lat, lon, zoom, objKeyRaw, layers, objKey, objId;
                if (/google/i.test(pasted)) {
                    const match = pasted.match(/@(-?\d+\.\d+),(-?\d+\.\d+),([\d.]+)z/);
                    if (!match) return null;
                    lat = parseFloat(match[1]);
                    lon = parseFloat(match[2]);
                    zoom = parseInt(match[3]);
                } else if (/waze/i.test(pasted)) {
                    const params = new URL(pasted).searchParams;
                    if (!params.has("lat") || !params.has("lon") || !params.has("zoomLevel")) return null;
                    lat = parseFloat(params.get("lat"));
                    lon = parseFloat(params.get("lon"));
                    zoom = parseFloat(params.get("zoomLevel"));
                    layers = parseFloat(params.get("s"));
                    objKeyRaw = ["venues", "segments", "nodes"].find(k => params.has(k));
                    objKey = objKeyRaw ? objKeyRaw : '';
                    objId = objKeyRaw ? params.get(objKeyRaw).toString() : '';
                } else {
                    return null;
                }
                BKMjump(`${lon}*${lat}`,zoom, layers, objKey, objId);
            });

            initBookmarksLayer();
            checkDatas();
        }).catch((error) => {
            console.error(`${scriptName}: Error registering the script tab: `, error);
        });

        const $containerBKM = $('<div></div>')
        .addClass('bkm-list-container')
        .html(`<ul class="bkm-list" id="bkmList"></ul>`);

        const $containerShare = $('<div></div>')
        .addClass('bkm-list-container')
        .html(`<ul class="bkm-list" id="bkmShare"></ul>`);

        const $containerHisto = $('<div></div>')
        .addClass('bkm-list-container')
        .html(`<ul class="bkm-list" id="bkmHisto"></ul>`);

        var waitFordivContent = setInterval(function() {
            if ($('#divContent').length) {
                BKMtableCountries();
                $('#divContent').append($containerBKM);
                $('#divShareContent').append($containerShare);
                $('#divHistoContent').append($containerHisto);

                const $list = $('#bkmList');
                const $listSh = $('#divShareContent');
                const $listHi = $('#divHistoContent');
                $list.empty();
                var waitFordivCountry = setInterval(function() {
                    if ($('#selectCountry').length) {
                        giveResults("");
                        clearInterval(waitFordivCountry);
                    }
                }, 200);

                // --- Interactions ---
                $list.on('click', '.bkm-item', function(e){
                    if($(e.target).closest('.bkm-actions').length || $(e.target).is('input')) return;
                    const $li = $(this);
                    BKMjump($li.data('lonlat'),$li.data('zoom'),$li.data('layers'),$li.data('type_obj'),$li.data('id_obj').toString());
                    $('#bkmList .bkm-item').css('border', '');
                    if ($('#chkLastClic').prop('checked')) { $(this).css('border', '1px solid #0099ff'); }
                });
                $list.on('click', '.bkm-deleteBtn', function(e){
                    e.stopPropagation();
                    const $li = $(this).closest('.bkm-item');
                    const $bkmName = $li.find('.bkm-name').text();

                    if (confirm(lang[11] + ' « ' + $bkmName + ' » ?')) {
                        $li.remove();

                        const id = $li.data('lonlat');
                        if (!id) return;

                        const [lon, lat] = id.split('*');
                        let jsonData = JSON.parse(localStorage.WMEBookmarks);
                        jsonData = jsonData.filter(item => !(item.perma?.lon === lon && item.perma?.lat === lat));
                        localStorage.WMEBookmarks = JSON.stringify(jsonData);
                        normalizeSort();

                        console.log(`${scriptName}: Deleted: `, $bkmName);
                        if ($('#chkSynchro').prop('checked')) {
                            BKMupdateBookmarks('DELETE', BKMusername, { perma: { lon, lat } });
                        }
                    }
                });
                $list.on('click', '.bkm-relocBtn', function(e){
                    e.stopPropagation();
                    const $li = $(this).closest('.bkm-item');
                    if(confirm(lang[12] + ' « ' + $li.find('.bkm-name').text()+' » ?')) {
                        const selectObjet = wmeSDK.Editing.getSelection();
                        console.log("Objet", selectObjet ?? "pas de sélection");
                        const [lon, lat] = $li.data('lonlat').split('*');
                        const jsonData=JSON.parse(localStorage.WMEBookmarks);
                        const bkmToChange = jsonData.find(item => item.perma.lon === lon && item.perma.lat === lat);
                        console.log('bkmToChange', bkmToChange);
                        if (bkmToChange) {
                            link={}; getLink(wmeSDK.Map.getPermalink({ includeLayers: true }));
                            bkmToChange.perma.lon = link.lon;
                            bkmToChange.perma.lat = link.lat;
                            bkmToChange.perma.zoom = link.zoom;
                            bkmToChange.perma.layers = link.layers;
                            if (selectObjet) {
                                bkmToChange.perma.type_obj = selectObjet.objectType+"s";
                                bkmToChange.perma.id_obj = selectObjet.ids.join(',').toString();
                            } else {
                                bkmToChange.perma.type_obj = "";
                                bkmToChange.perma.id_obj = "";
                            }
                            localStorage.setItem('WMEBookmarks', JSON.stringify(jsonData));
                            bkmToChange.oldPerma = $li.data('lonlat');
                            $li.data('lonlat', link.lon + "*" + link.lat);
                            $li.data('zoom', link.zoom);
                            $li.data('layers', link.layers);
                            console.log(lang[12], $li.find('.bkm-name').text(), bkmToChange);
                            if ($('#chkSynchro').prop('checked')) {
                                BKMupdateBookmarks('RELOCATE',BKMusername, bkmToChange);
                            }
                            giveResults("");
                        }
                    }
                });
                $list.off('click', '.bkm-editBtn');
                $list.on('click', '.bkm-editBtn', function(e){
                    e.stopPropagation();
                    const $li = $(this).closest('.bkm-item');
                    openEditForm($li);
                    $('#divBookmarks').animate({ scrollTop: $('#BKMedit').position().top }, 400);
                });
                $listSh.on('click', '.bkm-item', function(e){
                    const $li = $(this);
                    const coord = $li.data('lonlat');
                    const [lon, lat] = coord.split('*');
                    wmeSDK.Map.setMapCenter({ lonLat: { lon: parseFloat(lon), lat: parseFloat(lat) } });
                    wmeSDK.Map.setZoomLevel({ zoomLevel: $li.data('zoom') });
                    applyLayers($li.data('layers'));
                });
                $listHi.on('click', '.bkm-item', function(e){
                    const $li = $(this);
                    const coord = $li.data('lonlat');
                    const [lon, lat] = coord.split('*');
                    wmeSDK.Map.setMapCenter({ lonLat: { lon: parseFloat(lon), lat: parseFloat(lat) } });
                    wmeSDK.Map.setZoomLevel({ zoomLevel: $li.data('zoom') });
                });
                const jsonData = JSON.parse(localStorage.WMEHistoric);
                $('#bkmHisto').empty();
                jsonData.slice().reverse().forEach(item => {
                    $('#bkmHisto').append(makeLiShort(item,"Histo"));
                });
                clearInterval(waitFordivContent);
            }

            // Button on the map
            const $addNodeButton = $('<div></div>')
            .attr('id', 'addNodeButton')
            .addClass('fa fa-thumb-tack')
            .on('click', BKMinsertPermalink);
            const $location = $('.topbar').eq(0).find('.location-info-region').eq(0);
            if ($location.length) {
                $('.topbar').eq(0).css('padding', '0 10px');
                $location.before($addNodeButton);
            }
            wmeSDK.Events.on({ eventName: "wme-map-data-loaded", eventHandler: BKMtableCountries });
            makeListSortable();
            getBookmarks('');
            checkReminder();
            window.setInterval(checkReminder, 60000);
        }, 200);
    }

    function BKMinsertPermalink() { // Action when you add a new permalink (DB)
        const jsonData = JSON.parse(localStorage.WMEBookmarks);
        link={}; getLink(wmeSDK.Map.getPermalink({ includeLayers: true }));
        const result = jsonData.filter(item => item.perma.lon === link.lon && item.perma.lat === link.lat);
        if (result.length === 1) return;

        $('ul.nav-tabs li a span:contains("⭐")').parent('a').click();
        const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
        const BKMcountryActive = topCountry ? topCountry.name : 'Unknown';
        const countLi = jsonData.filter(item => item.country === BKMcountryActive).length;

        //JSON for new permalink
        const encodedBookmark = {
            country: BKMcountryActive,
            name: getName(),
            perma: link,
            comm: '',
            share: '',
            reminder: '',
            color: '',
            sort: '-1',
        };

        jsonData.push(encodedBookmark);
        localStorage.WMEBookmarks = JSON.stringify(jsonData);
        normalizeSort;

        if ($('#chkSynchro').prop('checked') === true) {
            if (debug) { console.log('WME Bookmarks: ADD', BKMusername, encodedBookmark); }
            BKMupdateBookmarks('ADD', BKMusername, encodedBookmark);
        }

        const $li = makeLi(encodedBookmark);
        $('#bkmList').append($li);
        openEditForm($li);
        W.selectionManager.unselectAll();
        $('#divBookmarks').animate({ scrollTop: $('#BKMedit').position().top }, 400);
        giveResults("");
        BKMpostBookmarks();
    }
    function getBookmarks(source) {
        $("#iconSynchLive").fadeIn(100).delay(600).fadeOut(100);
        $("#addNodeButton").fadeOut(100).delay(1000).fadeIn(100);
        const listFav = localStorage.WMEBookmarks;

        const url = 'https://waze-france.fr/script/bkm.php?getbookmarks2=' + BKMusername;

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers:{"Content-Type": "application/x-www-form-urlencoded"},
            onload: function(data) {
                const serverData = data.responseText;
                if (isJsonString(serverData)) {
                    const serverJSON = normalizeJSON(JSON.parse(serverData));
                    const localJSON = normalizeJSON(JSON.parse(listFav));
                    localJSON.forEach(function(item) {
                        if (!item.reminder || item.reminder === null) { item.reminder = ""; }
                        if (!item.sort || item.sort === null) { item.sort = ""; }
                        if (!item.color || item.color === null) { item.color = ""; }
                        if (!item.perma.type_obj || item.perma.type_obj === null) { item.perma.type_obj = ""; }
                        if (!item.perma.id_obj || item.perma.id_obj === null) { item.perma.id_obj = ""; }
                    });
                    if (debug) {
                        console.log('WME Bookmarks: From BKM Server: ', serverJSON);
                        console.log('WME Bookmarks: From BKM local : ', localJSON);
                    }
                    console.log('Diff: ', diffJSON(serverJSON, localJSON), Object.keys(diffJSON(serverJSON, localJSON)).length);
                    if (source === 'serv2local') {
                        $('#serv2local').hide();
                        $('#spinnerS2C').show();
                        localStorage.setItem('WMEBookmarks', serverData);
                        giveResults("");
                        setTimeout(function() {
                            $('#spinnerS2C').hide();
                            $('#serv2local').show();
                            setTimeout(function() { $('#iconBookmarks').click(); }, 1500);
                        }, 1000);
                    } else {
                        const syncEnabled = $('#chkSynchro').prop('checked') === true;
                        if (Object.keys(diffJSON(serverJSON, localJSON)).length != 0 && syncEnabled) {
                            noSynch = 1;
                            $('.synchOptions').show();
                            $('#transmit').hide();
                            $('#notransmit').hide();
                            $('#noStable').hide();
                            $('#noSynch').show();
                            $('.synchDone').hide();
                        } else {
                            $('.synchOptions').hide();
                            $('.synchDone').show();
                            if (debug) { console.log('WME Bookmarks: Bookmarks Sync !'); console.log(localJSON); }
                        }
                        if (serverJSON.length === 0 && localJSON.length === 0) {
                            $('#transmit').hide();
                            $('#notransmit').show();
                            $('#noSynch').hide();
                        }
                    }
                }
            }
        });
        BKMtableCountries();
    }
    function initBookmarks() {
        if (debug) { console.log('WME Bookmarks: Send: ' + BKMusername + ' to init'); }
        var url = 'https://waze-france.fr/script/bkm.php?initbookmarks=' + BKMusername

        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            headers:{ "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(data) {
                if (debug) { console.log('WME Bookmarks: Server Response: ', data.responseText); }
                if (data.responseText === 'Check') { getBookmarks(); }
            }
        });
    }
    function BKMpostBookmarks() {
        $("#iconSynchLive").fadeIn(100).delay(600).fadeOut(100);
        $("#addNodeButton").fadeOut(100).delay(1000).fadeIn(100);
        const a = JSON.parse(localStorage.WMEBookmarks);
        const toSave=[];
        $.each(a, function (p, item) {
            if (!a.hasOwnProperty(p)) return;
            (item.sort === "" ? item.sort = "0": item.sort)
            const encodedBookmark = {
                country: encodeURIComponent(item.country),
                name: encodeURIComponent(item.name),
                perma: item.perma,
                comm: encodeURIComponent(item.comm),
                share: item.share,
                reminder: item.reminder,
                color: item.color,
                sort: item.sort
            };
            toSave.push(encodedBookmark);
        });

        if (debug) { console.log('WME Bookmarks: Send Data: ', BKMusername, toSave); }
        const url = "https://waze-france.fr/script/bkm.php";
        const datas = "nickname=" + BKMusername + "&postbookmarks2=" + JSON.stringify(toSave);

        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            data: datas,
            headers:{ "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(data) {
                if (debug) { console.log('WME Bookmarks: Server Response: ', data.responseText); }
                if (data.responseText === 'Check') {
                    $("#iconSynchLive").fadeIn(100).delay(600).fadeOut(100);
                    $("#addNodeButton").fadeOut(100).delay(1000).fadeIn(100);
                    getBookmarks('');
                }
            },
            onerror: function (err) {
                console.error('Erreur GM.xmlHttpRequest:', err);
            }
        });
    }
    function BKMupdateBookmarks(action, owner, data) {
        if (debug) { console.log('WME Bookmarks: BKMupdateBookmarks ',action, owner, data); }
        $("#iconSynchLive").fadeIn(100).delay(600).fadeOut(100);
        $("#addNodeButton").fadeOut(100).delay(1000).fadeIn(100);
        var bNew = {};
        bNew.action=action;
        bNew.owner=owner;
        bNew.data=data;
        var url = "https://waze-france.fr/script/bkm.php"
        var datas = "addbookmark2=" + JSON.stringify(bNew)
        var method = 'POST'

        GM.xmlHttpRequest({
            method: method,
            url: url,
            data: datas,
            headers:{ "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(data) {
                if (debug) { console.log('WME Bookmarks: Server Response: ', data.responseText); }
                if (data.responseText != 'Check') {
                    giveResults('');
                }
            }
        });
    }

    // ***************************
    // ** ACTIONS WITH BOOKMARK **
    // ****************************

    function BKMjump(id,zoom,layers,objectType,objectId) { // Action when you click a link
        //console.log(id,zoom,layers,layers.length,isNaN(layers),objectType,objectId);
        const [lon, lat] = id.split('*');
        const jsonData=JSON.parse(localStorage.WMEBookmarks);
        const result = jsonData.filter(item => item.perma?.lon === lon && item.perma?.lat === lat);

        wmeSDK.Map.setMapCenter({ lonLat: { lon: parseFloat(lon), lat: parseFloat(lat) } });
        if ($('#chkZoom').prop('checked')) {
            if (zoom != "") {
                wmeSDK.Map.setZoomLevel({ zoomLevel: zoom });
            }
            else if (result[0].perma.zoom) {
                wmeSDK.Map.setZoomLevel({ zoomLevel: result[0].perma.zoom });
            }
        }
        if ($('#chkLayers').prop('checked') && layers && layers.length != 0 && !isNaN(layers))  {
            applyLayers(layers);
        }
        setTimeout(function() {
            if (objectType && objectId != null) {
                let objectIds = [];
                switch (objectType) {
                    case 'segments':
                        objectIds = objectId
                            .split(',')
                            .map(id => Number(id.trim()))
                            .filter(id => !isNaN(id));
                        break;

                    case 'nodes':
                        objectIds = [Number(objectId)];
                        break;
                    case 'venues':
                        objectIds = [objectId];
                        break;
                    default:
                        console.warn("Unsupported objectType:", objectType);
                        return;
                }
                let objects = [];
                switch (objectType) { // mapComment, city, restrictedDrivingArea, permanentHazard, venue, node, segmentSuggestion, bigJunction, segment
                    case 'segments':
                        objectType = 'segment';
                        objects = objectIds.map(id => wmeSDK.DataModel.Segments.getById({ segmentId: id })).filter(Boolean);
                        break;
                    case 'nodes':
                        objectType = 'node';
                        objects = objectIds.map(id => wmeSDK.DataModel.Nodes.getById({ nodeId: id })).filter(Boolean);
                        break;
                    case 'venues':
                        objectType = 'venue';
                        objects = objectIds.map(id => wmeSDK.DataModel.Venues.getById({ venueId: id })).filter(Boolean);
                        break;
                }
                if (objects.length === 0) {
                    console.warn("No object found for the given IDs");
                    return;
                }
                wmeSDK.Editing.setSelection({
                    selection: {
                        objectType: objectType,
                        ids: objectIds
                    }
                });
                console.log(`Selected ${objectType}(s) with IDs:`, objectIds);
            }
        }, 1000);
        var waitForCountry = setInterval(function() { // test if newcountry
            if (wmeSDK.DataModel.Countries.getTopCountry()) {
                BKMtableCountries();
                clearInterval(waitForCountry);
            }
        }, 200);
    }
    function loadShareData() {
        var listFav = localStorage.WMEBookmarksShared;
        var url = 'https://waze-france.fr/script/bkm.php?getshared2=' + BKMusername;

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                try {
                    var serverData = JSON.parse(response.responseText);
                    var localData = listFav ? JSON.parse(listFav) : {};

                    var s1 = JSON.stringify(serverData, Object.keys(serverData).sort());
                    var s2 = JSON.stringify(localData, Object.keys(localData).sort());

                    if ((s1 !== s2) && serverData && $('#chkSynchro').prop('checked') === true) {
                        if (debug) console.log('WME Bookmarks: From Share Server: ', serverData);
                        if (debug) console.log('WME Bookmarks: From Share local: ', localData);

                        localStorage.setItem('WMEBookmarksShared', JSON.stringify(serverData));
                        const jsonData = JSON.parse(localStorage.WMEBookmarksShared);
                        $('#divShareContent').empty();
                        jsonData.slice().reverse().forEach(item => {
                            $('#divShareContent').append(makeLiShort(item,"Share"));
                        });
                    } else {
                        const jsonData = JSON.parse(localStorage.WMEBookmarksShared);
                        $('#divShareContent').empty();
                        jsonData.slice().reverse().forEach(item => {
                            $('#divShareContent').append(makeLiShort(item,"Share"));
                        });
                        if (debug) console.log('WME Bookmarks: Shared Sync !');
                    }
                } catch (e) {
                    console.error('Erreur parsing JSON:', e);
                }
            },
            onerror: function(err) {
                console.error('Erreur requête GM.xmlHttpRequest:', err);
            }
        });
    }

    // ***************
    // **  BACKUP   **
    // ***************

    function BKMloadBackup() {
        const data = localStorage.WMEBookmarks;
        if (data) {
            const bookmarks = JSON.parse(data);
            $('#divBackupJSON').val(JSON.stringify(bookmarks));
            $('#divBackupJSON').off('click').on('click', function () {
                $(this).focus().select();
            });
        }
    }
    function backup(action) {
        const jsonContent = $('#divBackupJSON').val().trim();
        const isNew = action === "new";
        const isAdd = action === "add";

        if ((isNew && confirm(lang[22])) ||
            (isAdd && confirm(lang[23]))) {
            $('#spinnerBackup').show();
            setTimeout(function() {
                $('#spinnerBackup').hide();
                $('#validBackup').show();
                setTimeout(function() {
                    $('#validBackup').hide();
                    giveResults("");
                    $('#iconBookmarks').click();
                }, 1000);
            }, 1000);

            if (isNew) localStorage.setItem('WMEBookmarks', '[]');
            if (jsonContent) importJSONtoWMEBookmarks(jsonContent);
        }
    }
    function importJSONtoWMEBookmarks(jsonContent) {
        const json1 = JSON.parse(localStorage.WMEBookmarks);
        const json2 = JSON.parse(jsonContent);

        const normalize = obj =>
        Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {});

        const convertItem = item => {
            const newItem = { ...item };

            if (typeof newItem.comm === "string") {
                newItem.comm = newItem.comm.replace(/\n+/g, " ").trim();
            }

            if (newItem.perma) {
                const p = { ...newItem.perma };

                ["segments", "nodes", "venues"].forEach(key => {
                    if (p[key] !== undefined) {
                        p.id_obj = key;
                        p.type_obj = p[key];
                        delete p[key];
                    }
                });

                newItem.perma = p;
            }
            newItem.sort = newItem.sort || "0";

            return newItem;
        };

        const converted2 = json2.map(convertItem);
        const merged = [...json1, ...converted2].filter(
            (item, index, self) =>
            index === self.findIndex(
                t => JSON.stringify(normalize(t)) === JSON.stringify(normalize(item))
            )
        );
        localStorage.setItem("WMEBookmarks", JSON.stringify(merged));
        console.log("Bookmarks fusionnés :", merged);
        BKMpostBookmarks();
    }

    // ********************
    // **  MENU & LAYER  **
    // ********************

    function layerToggled() {
        const isVisible = JSON.parse(localStorage.WMEBookmarksSettings);
        isVisible.showBookmark = !isVisible.showBookmark;
        wmeSDK.Map.setLayerVisibility({ layerName: "__WME_Bookmarks", visibility: isVisible.showBookmark });
        wmeSDK.LayerSwitcher.setLayerCheckboxChecked({ name: 'Bookmarks', isChecked: isVisible.showBookmark });
        localStorage.WMEBookmarksSettings = JSON.stringify(isVisible);
    }
    const bookmarkStyleConfig = {
        styleContext: {
            bookmarkLabel: (context) => {
                return context?.feature?.properties?.name ?? "";
            },
        },
        styleRules: [
            {
                predicate: () => true,
                style: {
                    externalGraphic: "data:image/svg+xml;base64," + btoa(`
                    <svg width="32" height="44" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2 C8.268 2 2 8.268 2 16 C2 28 16 44 16 44 C16 44 30 28 30 16 C30 8.268 23.732 2 16 2Z"
                        fill="#e5f6ff" stroke="#0099ff" stroke-width="4" stroke-linejoin="round"/>
                    </svg>`),
                    graphicWidth: 24,
                    graphicHeight: 32,
                    graphicYOffset: -32,
                    graphicOpacity: 1,
                    label: "${bookmarkLabel}",
                    labelText: "${bookmarkLabel}",
                    labelColor: "white",
                    fontColor: "white",
                    labelOutlineColor: "#0099ff",
                    labelOutlineWidth: "5",
                    fontFamily: "Open Sans, Alef, helvetica, sans-serif, monospace",
                    fontSize: "14",
                    labelYOffset: 14,
                    labelXOffset: 18,
                    labelAlign: "lm"
                },
            },
        ],
    };
    function initBookmarksLayer() {
        const isVisible = JSON.parse(localStorage.WMEBookmarksSettings || '{}');

        try {
            wmeSDK.Map.addLayer({
                layerName: "__WME_Bookmarks",
                styleRules: bookmarkStyleConfig.styleRules,
                styleContext: bookmarkStyleConfig.styleContext,
                zIndexing: true
            });
        } catch (e) {
            console.log("Layer already existing :", e);
        }

        wmeSDK.Map.setLayerVisibility({
            layerName: "__WME_Bookmarks",
            visibility: isVisible.showBookmark ?? true
        });

        wmeSDK.LayerSwitcher.addLayerCheckbox({ name: "Bookmarks" });
        wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
            name: "Bookmarks",
            isChecked: isVisible.showBookmark ?? true
        });
        updateLayer();
    }
    function updateLayer() {
        const bookmarkList = [];
        const data = JSON.parse(localStorage.getItem('WMEBookmarks') || '[]');

        data.forEach(item => {
            if (!item || !item.perma) return;
            bookmarkList.push({
                name: item.name,
                lon: parseFloat(item.perma.lon),
                lat: parseFloat(item.perma.lat)
            });
        });

        if (!bookmarkList.length) return;
        wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: "__WME_Bookmarks" });

        const features = bookmarkList.map((b, index) => ({
            type: "Feature",
            id: `bookmark_${index}`,
            geometry: {
                type: "Point",
                coordinates: [b.lon, b.lat]
            },
            properties: {
                name: b.name
            }
        }));
        wmeSDK.Map.addFeaturesToLayer({
            layerName: "__WME_Bookmarks",
            features: features
        });
        wmeSDK.Events.on({
            eventName: 'wme-layer-checkbox-toggled',
            eventHandler: layerToggled
        });
    }
})();