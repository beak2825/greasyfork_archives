/* jshint esversion: 10, multistr: true */
/* globals waitForKeyElements, OLCore, olGUI, olTransferList, olOverlayWindow, GM_addStyle, unsafeWindow, OLi18n, GM_deleteValue, GM_setValue, GM_getValue, GM_listValues, GM_setClipboard */

// ==UserScript==
// @name           OnlineligaTransferHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.3.1
// @license        LGPLv3
// @description    Helfer für Transfers bei www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/425296/OnlineligaTransferHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/425296/OnlineligaTransferHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 20.04.2021 Release
 * 0.1.1 29.04.2021 + Transferdetails from Tais Helper
 * 0.1.2 03.06.2021 + reoffer Trades
 * 0.1.3 28.07.2021 Hotfix
 * 0.1.4 04.08.2021 mobile support for renew offers
 * 0.1.5 27.10.2021 add salary for offers
 * 0.1.6 06.01.2021 support all hosts for playerDetails
 * 0.2.0 24.01.2022 i18n support
                    save filter for each domain separately
 * 0.2.1 09.06.2022 Bugfix renew Offer
 * 0.2.2 10.06.2022 open transfer in new Tab
 * 0.2.3 10.08.2022 Copy transfer data to clipboard
 * 0.2.4 03.10.2022 Bugfix load saved values
 * 0.2.5 29.10.2022 Add Matchday/Week for Offer form
                    Copy transfer data on Watchlist and Offerlist
 * 0.3.0 26.11.2024 OL 2.0
 * 0.3.1 15.12.2024 Fix: Copy transfer data
 *********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const api = OLCore.Api;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    /***
     * Transferfilter
     ***/

    const Filter = {};
    const Offer = {};
    const List = {};
    const Details = {};

    // CSS Styles
    Filter.setCSS = function (){
        GM_addStyle('#tlmanager_controls { vertical-align:middle; padding:2px; font-family: Roboto,sans-serif; font-size: 13pt; border: 3px solid #000; border-radius: 4px; display: ' + Filter.ctrlPanelDisplay + '; width:100%}');
        GM_addStyle('#tlmanager_controls span { margin-left:6px; margin-right:6px;}');
        GM_addStyle('#tlmanager_controls > div.tlmanager_div { vertical-align:middle; display:inline-block;margin-left:6px; margin-right:6px;}');
        GM_addStyle('.tlmanager-button { margin-left:5px; margin-bottom:2px; padding:0; display: inline-block; width:32px; height:32px; vertical-align:middle; text-align:center;}');
        GM_addStyle('.tlmanager-button span { background-color: #000 }');
        GM_addStyle('.tlmanager-prompt {background: #fff}');
        GM_addStyle('.tlmanager-about { float:right; line-height:2; margin-right:2px; }');
        GM_addStyle('.tlmanager-about > span { vertical-align:middle;}');
        //CSS for Selects
        GM_addStyle("#tlmanager_controls select { -moz-appearance: none; -webkit-appearance: none; appearance: none; border: 1px solid #000; border-radius: 4px; padding-left: 5px; width: 355px; height: 100%; color: #000;}");
        GM_addStyle('div.tlmanager_select-wrapper { display: inline-block; position:relative; width: 350px; height: 35px;}');
        GM_addStyle("div.tlmanager_select-wrapper::before { content:''; display: inline-block; width: 35px; height: 35px; position: absolute; background-color: black; border-radius: 2px; top: -0px; right: -4px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; pointer-events: none; }");
        GM_addStyle("div.tlmanager_select-wrapper::after { content:''; display: inline-block; border-top: 8px dashed; border-top: 8px solid; border-right: 8px solid transparent; border-left: 8px solid transparent; position: absolute; color: white; left: 328px; top: 14px; pointer-events: none; }");
    };

    // Steuerelemente erzeugen
    Filter.createControls = function(){

        function getAttributeSelector() {
            return olGUI.getBootstrapDeviceSize() == 'ol-xs' ? '#dropdownTransferListPlayerAttributes2' : '#dropdownTransferListPlayerAttributes';
        }

        //Transferfee-Filter erzeugen
        function setTransferFeeFilter(valueFrom, valueTo){
            const ended = $('button.ol-tab-button.active').attr("data-sub-url") === "endedAuctions" ? true : false;
            const filterBase = $("#playerAttributeFiltertransferFee");
            const tfInput = filterBase.find(".ol-double-slider");
            const tfTo = ended ? tfInput.attr("data-slider-max-ended") : tfInput.attr("data-slider-max");
            const tfFrom = ended ? tfInput.attr("data-slider-min-ended") : tfInput.attr("data-slider-min");
            tfInput.bootstrapSlider('destroy');

            const tfInputClone = tfInput.clone();
            
            tfInput.remove();
            filterBase.find(".ol-player-attribute-filter-from").after(tfInputClone);

            tfInputClone.attr("data-slider-step", 1);
            tfInputClone.attr("data-slider-value", ("[" + (valueFrom || tfFrom) + "," + (valueTo || tfTo) + "]"));
            tfInputClone.attr("data-value", ("[" + tfFrom + "," +  tfTo + "]"));
            tfInputClone.attr("value", ("[" + tfFrom + "," +  tfTo + "]"));
            tfInputClone.attr("data-slider-max", tfTo);

            tfInputClone.bootstrapSlider( {} );
            tfInputClone.bootstrapSlider().on("slideStop", function(ev){
                olTransferList.search();
            });

            tfInputClone.bootstrapSlider('refresh');
            tfInputClone.trigger("change");

            const tfToInput = $('#playerAttributeFiltertransferFee').find(".ol-double-slider-input-to");
            $(tfToInput).val(olGUI.numberWithPoints(valueTo || tfTo));
            $(tfToInput).attr("data-target", "#transferFeeSlider");
            $(tfToInput).attr("data-min", tfFrom);
            $(tfToInput).attr("data-max", tfTo);
            const tfFromInput = $('#playerAttributeFiltertransferFee').find(".ol-double-slider-input-from");
            $(tfFromInput).val(olGUI.numberWithPoints(valueFrom || tfFrom));
            $(tfFromInput).attr("data-target", "#transferFeeSlider");
            $(tfFromInput).attr("data-min", tfFrom);
            $(tfFromInput).attr("data-max", tfTo);
            return;
        }

        // Filter zurücksetzen
        function resetFilter(){
            setTransferFeeFilter();
            $("#olTransferListFilterList").find(".ol-tranfer-list-filter").each(
                (index,filter) => {
                    if (filter.id === "playerAttributeFilterpreferredFoot"){
                        olTransferList.updateDropdown();
                        $('#playerAttributeFilterpreferredFoot').insertAfter('#olTransferListFilterList').hide();
                    } else {
                        filter.remove();
                    }
                    olTransferList.updateDropdown();
                }
            );
        }

        // Filter erzeugen
        function buildFilter(attrId, value){
            if(attrId == -1)
            {
                return;
            }

            

            //++currentFilterCount;
            const li = $("#attrFilterId" + attrId);
            const name = li.text();

            const from = li.attr("data-from");
            const to = li.attr("data-to");
            const unit = li.attr("data-unit");

            let valueFrom;
            let valueTo;

            if (/^\d+,\d+$/.test(value)){
                valueFrom = value.split(",")[0];
                valueTo = value.split(",")[1];
            }

            // Fußfilter (Rechter Fuß/Linker Fuß/beidfüßig)
            if(attrId === "preferredFoot")
            {
                const filterBase = $('#playerAttributeFilterpreferredFoot');
                const input = filterBase.find(".ol-slider");
                input.bootstrapSlider('destroy');
                const inputClone = input.clone();
                input.remove();
                filterBase.find(".ol-player-attribute-filter-from").after(inputClone);

                if (value){
                    inputClone.attr("data-slider-value", (value));
                    inputClone.attr("value", value);
                    inputClone.attr("data-value", value);
                    inputClone.val(value);
                }
                inputClone.bootstrapSlider({ scale: 'linear' });
                inputClone.bootstrapSlider().on("change", function(ev)
                                                {
                    const val = parseInt(inputClone.val());
                    const labels = inputClone.attr('data-labels').split(',');
                    $('#preferredFootLabel').html(labels[val + 1]);
                    olTransferList.search();
                });
                $('#playerAttributeFilterpreferredFoot').appendTo('#olTransferListFilterList').show();
                if (value) {
                    const labels = inputClone.attr('data-labels').split(',');
                    const valueText = labels[parseInt(value,10) + 1];
                    $('#preferredFootLabel').html(valueText);
                }
                olTransferList.updateDropdown();
                return;
            }

            // Transferfee Filter
            if(attrId === "transferFee"){
                setTransferFeeFilter(valueFrom, valueTo);
                return;
            }

            // bestehender Attributfilter
            if($("#playerAttributeFilter" + attrId).length > 0){
                const filterBase = $("#playerAttributeFilter" + attrId);
                const input = filterBase.find(".ol-slider");
                input.attr("data-slider-value", ("[" + (valueFrom || from) + "," + (valueTo || to) + "]"));
                if (value){
                    input.attr("value", value);
                    input.attr("data-value", value);
                    input.val(value);
                }
                if (valueTo){
                    const toInput = $("#playerAttributeFilter" + attrId).find(".ol-double-slider-input-to");
                    $(toInput).val(olGUI.numberWithPoints(valueTo));
                }
                if (valueFrom){
                    const fromInput = $("#playerAttributeFilter" + attrId).find(".ol-double-slider-input-from");
                    $(fromInput).val(olGUI.numberWithPoints(valueFrom));
                }
                const sliderMin = filterBase.find(".min-slider-handle");
                let valueMax = 0;
                if (sliderMin){
                    valueMax = parseInt(sliderMin.attr("aria-valuemax"),10);
                    const minPercent = (valueFrom/(valueMax*100)).toFixed(4);
                    sliderMin.css("left", minPercent+"%");
                    sliderMin.attr("aria-valuenow", valueFrom);
                }
                const sliderMax = filterBase.find(".max-slider-handle");
                if (sliderMax){
                    valueMax = sliderMax.attr("aria-valuemax");
                    const maxPercent = (valueTo/(valueMax*100)).toFixed(4);
                    sliderMax.css("left", maxPercent+"%");
                    sliderMax.attr("aria-valuenow", valueTo);
                }
                olTransferList.updateDropdown();
                return;
            }

            // neuer Attributfilter
            const inputId = attrId + "slider";
            $("#playerAttributeFilterTemplate").show();
            const clone = $("#playerAttributeFilterTemplate").clone();
            $("#playerAttributeFilterTemplate").hide();
            clone.attr("id", "playerAttributeFilter" + attrId);
            clone.attr("data-attr-id", attrId);
            clone.find(".ol-player-attribute-filter-name").text(name);
            clone.find(".ol-double-slider-label-unit").text(unit);
            $("#olTransferListFilterList").append(clone);

            const input = clone.find(".ol-double-slider");
            input.attr("id", inputId);
            input.attr("data-slider-min", from);
            input.attr('data-attribute-id', attrId);
            input.attr("data-slider-max", to);
            input.attr("data-slider-step", 1);
            input.attr("data-slider-value", ("[" + (valueFrom || from) + "," + (valueTo || to) + "]"));
            if (value){
                input.attr("value", value);
                input.attr("data-value", value);
            }
            input.bootstrapSlider( (Math.abs(to) > 1000) ? { scale: 'logarithmic' } : {} );
            input.bootstrapSlider().on("slideStop", function(ev)
                                       {
                olTransferList.search();
            });
            input.trigger("change");

            const toInput = $("#playerAttributeFilter" + attrId).find(".ol-double-slider-input-to");
            $(toInput).val(olGUI.numberWithPoints(valueTo || to));
            $(toInput).attr("data-target", "#" + inputId);
            $(toInput).attr("data-min", from);
            $(toInput).attr("data-max", to);
            const fromInput = $("#playerAttributeFilter" + attrId).find(".ol-double-slider-input-from");
            $(fromInput).val(olGUI.numberWithPoints(valueFrom || from));
            $(fromInput).attr("data-target", "#" + inputId);
            $(fromInput).attr("data-min", from);
            $(fromInput).attr("data-max", to);
            const sliderMin = $("#playerAttributeFilter" + attrId).find(".min-slider-handle");
            if (sliderMin){
                sliderMin.attr("aria-valuenow", valueFrom);
            }
            const sliderMax = $("#playerAttributeFilter" + attrId).find(".max-slider-handle");
            if (sliderMax){
                sliderMax.attr("aria-valuenow", valueTo);
            }
            olTransferList.updateDropdown();
            // Weiteres Anlegen von Filtern verhindern
            const filterCount = $("div.player-attribute-filter-container div.ol-tranfer-list-filter[data-attr-id]:visible").length;
            if (!olGUI.isPremiumUser() && filterCount > 0){
                $('.transfer-filter-content-click-area').addClass('disabled').parent().addClass('premium-locked');
            } else if (filterCount > 2){
                $('.transfer-filter-content-click-area').addClass('disabled').parent().addClass('premium-locked');
            }
        }

        function evt_clickSave(){

            const actEntry = $('#tlmanager_selSaved').val() !== '' ? $('#tlmanager_selSaved option:selected').text() : '';
            const newEntry = prompt("Speichern unter", actEntry);
            if (newEntry){
                const filterPosition = $("#dropdownPlayerPosition").dropdown().value();
                const freeAgents = $("input#checkboxFreeAgents").is(':checked') ? 1 : 0; //TODO: not needed?
                const offersEnded = $("input#checkboxOffersEnded").is(':checked') ? 1 : 0; //TOOD: not needed?
                const liquidity = $("input#checkboxLiquidity").is(':checked') ? 1 : 0;

                const filterValues = [];
                $(".ol-tranfer-list-filter[data-attr-id]").each(function(index, element){
                    element = $(element);
                    if(element.css("display") !== "none") {
                        const data_attr_id = element.attr("data-attr-id");
                        let value;
                        if(element.find(".ol-double-slider").length > 0){
                            value = element.find(".ol-double-slider").val().split(",");
                        } else {
                            value = element.find(".ol-slider").val();
                        }
                        filterValues.push(`${data_attr_id}:${value}`);
                    }
                });

                let sortValue = "";
                let sortToggle = "";

                const sortElem = $("div.olTableHeaderColumnToggle").filter((i,c) => $(c).is(":visible") && ($(c).attr("data-toggle") === "asc" || $(c).attr("data-toggle") === "desc"))[0];

                if(sortElem){
                    sortValue = $(sortElem).attr("data-value");
                    sortToggle = $(sortElem).attr("data-toggle");
                }

                const sortAttr = $(getAttributeSelector()).dropdown().value();

                const filterValueString = `${filterPosition}:${freeAgents}:${offersEnded}:${liquidity}:${sortValue}:${sortToggle}:${sortAttr}#${filterValues.join("#")}`;
                const entryVal = `ListManagerEntry|${OLi18n.tld}|${newEntry.replace("|","_")}`;

                const matchingOption = $('#tlmanager_selSaved option').filter(function () {
                    let oldVal = this.value;
                    const newVal = entryVal;
                    if (!oldVal.startsWith(`ListManagerEntry|${OLi18n.tld}|`)){
                        oldVal = oldVal.replace("ListManagerEntry|",`ListManagerEntry|${OLi18n.tld}|`);
                    }
                    return oldVal.toLowerCase() === newVal.toLowerCase();
                } );

                if (matchingOption.length){
                    let matchingValue = matchingOption.attr("value");
                    if (!matchingValue.startsWith(`ListManagerEntry|${OLi18n.tld}|`)){
                        GM_deleteValue(matchingValue);
                        matchingValue = matchingValue.replace("ListManagerEntry|",`ListManagerEntry|${OLi18n.tld}|`);
                        matchingOption.attr("value",matchingValue);
                    }
                    GM_setValue(matchingValue, filterValueString);
                    $("#tlmanager_selSaved option[value='" + matchingValue + "']").text(newEntry);
                } else {
                    GM_setValue(entryVal, filterValueString);
                    $('#tlmanager_selSaved')
                        .append($("<option />")
                                .attr("value", entryVal)
                                .text(newEntry));
                }
                $('#tlmanager_selSaved').val(entryVal);
            } else if (newEntry === ''){
                alert("Name darf nicht leer sein");
            }
        }

        function evt_clickDel(){
            if (confirm("Eintrag löschen?")){
                const selectedValue = $('#tlmanager_selSaved').val();
                $("#tlmanager_selSaved option[value='" + selectedValue + "']").remove();
                GM_deleteValue(selectedValue);
                $('#tlmanager_selSaved').val('');
                $("#dropdownPlayerPosition").dropdown().selectByValue(0);
                $('#tlmanager_selSaved').trigger('change');
            }
        }

        function evt_clickDelAll(){
            if (confirm("Alle Einträge löschen?") && confirm("Wirklich ALLE ALLE Einträge löschen?")){
                for (const v of GM_listValues().filter(l => l.startsWith('ListManagerEntry|'))){
                    if (v.startsWith(`ListManagerEntry|${OLi18n.tld}|`) || v.replace(/[^|]/g,'').length === 1){
                        $("#tlmanager_selSaved option[value='" + v + "']").remove();
                        GM_deleteValue(v);
                    }
                }
                $('#tlmanager_selSaved').val('');
                $("#dropdownPlayerPosition").dropdown().selectByValue(0);
                $('#tlmanager_selSaved').trigger('change');
            }
        }

        function evt_loadFilter(){
            const selectedValue = $('#tlmanager_selSaved').val();
            resetFilter();
            if (selectedValue === "") {
                $("#dropdownPlayerPosition").dropdown().selectByValue(0);
                olTransferList.updateDropdown();
                olTransferList.search();
                return;
            }
            const storedFilter = GM_getValue(selectedValue);
            if (!storedFilter){
                alert(`Konnte Filter ${selectedValue} nicht laden`);
                return;
            }
            const filterValues = storedFilter.split("#");
            const subFilters = filterValues[0].split(":");

            const playerPosition = parseInt(subFilters[0],10);
            const freeAgents = parseInt(subFilters[1],10);
            const offersEnded = parseInt(subFilters[2],10);
            const liquidity = parseInt(subFilters[3],10);

            $("#dropdownPlayerPosition").dropdown().selectByValue(playerPosition);
            $("input#checkboxFreeAgents").prop('checked', freeAgents === 1);
            $("input#checkboxOffersEnded").prop('checked', offersEnded === 1);
            $("input#checkboxLiquidity").prop('checked', liquidity === 1);

            if (subFilters[4].length > 0){
                olTransferList.sort.by = subFilters[4];
            }

            if (subFilters[5].length > 0){
                olTransferList.sort.sorting = subFilters[5];
                $(".olTableHeaderColumnToggle").attr("data-toggle", "none");
                $(".olTableHeaderColumnToggle[data-value='" + subFilters[4] + "']").attr("data-toggle", subFilters[5]);
            }

            $(getAttributeSelector()).dropdown().selectByValue(subFilters[6]);

            const maxFilterNum = olGUI.isPremiumUser() ? 3 : 1;
            let actFilterNum = 0;

            for (let i = 1; i < filterValues.length; i++){
                const v = filterValues[i];
                const attrId = v.split(":")[0];
                const value = v.split(":")[1];
                buildFilter(attrId, value);
                if (attrId !== "transferFee"){
                    actFilterNum++;
                }
                if (actFilterNum === maxFilterNum){
                    break;
                }
            }
            olTransferList.search();
        }

        if ($('#tlmanager_controls').length > 0) {
            return;
        }
        const ctrlTLManager = $(`<div class="tlmanager_div" id="tlmanager_controls"><span id="spnTLManagerLabel">${tt("Transferlisten-Manager")} </span></div>`);
        //$("div#transferListContent").prepend(ctrlTLManager);
        ctrlTLManager.insertBefore("div#transferListContent");
        const selSaved = $('<select id="tlmanager_selSaved"></select>');
        const selSavedWrapper = $('<div class="tlmanager_select-wrapper"></div>');
        selSavedWrapper.append(selSaved);
        ctrlTLManager.append(selSavedWrapper);
        const divAbout = $(`<div class="tlmanager-about"> &copy; <div style="display:inline" class="ol-user-name " onclick="messageSystem.openChatWithUser(${OLi18n.KnutEdelbertId});"> KnutEdelbert <div class=" msg-icon-class"><span class="icon-ol-speechbubble-icon liveticker-contact"></span></div></div></div>`);
        const btnDel = $(`<button title="${tt("Aktuellen Eintrag löschen")}" class="ol-button ol-button-rectangle tlmanager-button" id="btnTlmanagerDel" style="background:red"><span id="tlmanager_IconDel" class="fa fa-trash-o" style="background:red"></span></button>`);
        const btnDelAll = $(`<button title="${tt("Alle Einträge löschen")}" class="ol-button ol-button-rectangle tlmanager-button" id="btnTlmanagerDelAll" style="background:darkred"><span id="tlmanager_IconDelAll" class="fa fa-trash" style="background:darkred"></span></button>`);
        const btnLoad = $(`<button title="${tt("Filter neu laden")}" class="ol-button ol-button-rectangle tlmanager-button" id="btnTlmanagerLoad" style="margin-left:10px;"><span id="tlmanager_IconLoad" class="fa fa-refresh"></span></button>`);
        const btnSave = $(`<button title="${tt("Filter speichern")}" class="ol-button ol-button-rectangle tlmanager-button" id="btnTlmanagerSave"><span id="tlmanager_IconSave" class="fa fa-floppy-o"></span></button>`);
        ctrlTLManager.append(btnLoad);
        ctrlTLManager.append(btnSave);
        ctrlTLManager.append(btnDel);
        ctrlTLManager.append(btnDelAll);
        ctrlTLManager.append(divAbout);
        btnSave.click(evt_clickSave);
        btnDel.click(evt_clickDel);
        btnDelAll.click(evt_clickDelAll);
        btnLoad.click(evt_loadFilter);
        const savedValues = GM_listValues().filter(v => !!GM_getValue(v)).filter(v => v.startsWith('ListManagerEntry|')).filter(v => v.startsWith(`ListManagerEntry|${OLi18n.tld}|`) || v.replace(/[^|]/g,'').length === 1);
        $('#tlmanager_selSaved')
            .append($("<option />")
                    .attr("value", "")
                    .text(` -- ${tt("Auswahl")} -- `));
        for (const val of savedValues){
            const selValue = val.split("|").pop();
            $('#tlmanager_selSaved')
                .append($("<option />")
                        .attr("value", val)
                        .text(selValue));
        }
        $('#tlmanager_selSaved').change(evt_loadFilter);
    };

    Filter.startTLM = function (){
        Filter.createControls();
    };

    /***
     * Einkaufspreis
     ***/

    Offer.setCSS = function(){
        GM_addStyle(".ToolboxOfferRenew:hover { background: #DDDDFF; }");
    };

    //TODO: not working as of now, needs transferhistory in OLCore API
    Offer.showPlayerInvest = async function (){
        $("div#purchasePrice").remove();
        $("div#currentSalary").remove();

        async function fetchSalary(){
            function showSalary(salary, selector) {
                if ($(selector).length) {
                    $("div#currentSalary").html(`<span class="uppercase" title="${tt("Jahresgehalt")}">${tt("Gehalt")}:</span> <span id="annualSalary">${salary}</span>`);
                }
            }
            const pi = OLCore.UI.progressIndicator("#currentSalary", {clear:true});
            const player = await api.getPlayerOverview(playerId);
            const formattedSalary = OLCore.num2Cur(player.salary);
            pi.end();
            showSalary(formattedSalary, "div.player-transfer-market-value.text-left");
        }

        let playerId = Offer.tmpPlayerId;
        playerId = playerId || parseInt($("div#dropdownPlayerIds").attr("data-value"), 10);
        const hist = await api.getTransferHistory(playerId);
        if (hist.length){
            const lastHist = hist[0];
            const pPrice = lastHist.transferFeeText ? lastHist.transferFeeText : " n/a ";
            const ekSpan = lastHist.transferFeeText? `<span title="Saison ${lastHist.season} Spieltag ${lastHist.matchDay}">(${lastHist.season}/${lastHist.matchDay})</span>` : "";
            $(`<div id="purchasePrice" class="player-transfer-market-value text-left" style="margin-top:5px;"><span class="uppercase" title="${tt("Einkaufspreis")}">${tt("EK-Preis")}:</span> <span id="wholesalePrice">${pPrice}${ekSpan}</span></div>`).insertAfter("div.player-transfer-market-value.text-left");
        }
        const salaryLink = $('<div id="currentSalary" class="player-transfer-market-value text-left" style= "margin-top: 5px"><span style="cursor:pointer;text-decoration:underline">Gehalt anzeigen</span></div>').insertAfter("#purchasePrice");
        salaryLink.on("click", fetchSalary);
        Offer.tmpPlayerId = undefined;
    };

    Offer.createRenewOffer = function(offer){

        const offerClick = offer.attr("onclick");
        const offerId = offerClick ? parseInt(offerClick.match(/showPlayerView\s*\((\d+)\s*,/)[1],10) : 0;
        if (offerId === 0){
            return;
        }

        function renewOffer(event){
            event.preventDefault();
            event.stopPropagation();
            async function showOffer(){
                const offerData = await OLCore.Api.getOffer(offerId);
                Offer.tmpPlayerId = offerData.playerId;
                const li = $(`#player${offerData.playerId}`);
                if (li.length === 0){
                    alert(`${tt("Spieler nicht auswählbar (schon angeboten/nicht mehr im Kader)")}`);
                    return;
                }
                const dataOfferPlayer = JSON.parse(li.attr("data-offer-player"));
                const marketValue = dataOfferPlayer.marketValue;
                dataOfferPlayer.marketValue = offerData.minFee;
                li.attr("data-offer-player", JSON.stringify(dataOfferPlayer));
                olTransferList.onClickCreateOfferOverviewPlayer(offerData.playerId);
                $("div#dropdownPlayerIds > button > span.ol-dropdown-text").html(li.find("span.contract-player-lineup.team-overview-player-lineup-mark").parent().html());
                $('#marketValue').html(olGUI.numberWithPoints(marketValue));
                dataOfferPlayer.marketValue = marketValue;
                li.attr("data-offer-player", JSON.stringify(dataOfferPlayer));
                //await Offer.showPurchasePrice(offerData.playerId);
            }
            olOverlayWindow.load('/transferlist/getcreateofferoverlayview', null, showOffer);
        }

        const renewButton = $(`<div style="float:left;margin-top:-3px;margin-right:-5px;" title="${tt("Spieler erneut anbieten")}" class="ToolboxOfferRenew" id="renew${offerId}"><span id="tlmanager_IconLoad" class="fa fa-refresh fa-lg"></span></div>`);
        offer.find(`div.icon-red_cross`).before(renewButton);
        const renewButtonMobile = $(`<div style="display:inline-block;position:absolute;left:-20px;" title="${tt("Spieler erneut anbieten")}" class="ToolboxOfferRenew" id="renewMobile${offerId}"><span id="tlmanager_IconLoad" class="fa fa-refresh fa-lg"></span></div>`);
        offer.next().next().find(`div.icon-red_cross`).before(renewButtonMobile);
        renewButton.click(renewOffer);
        renewButtonMobile.click(renewOffer);
    };

    //TODO: still needed? OL has this now
    Offer.showTransferInNewWindow = function(row){
        const el = $(row).children("div.transfer-player-name-column").eq(0);
        const offerId = $(row).attr("id").replace("transferListItem","");

        function openTransferInNewWindow(e){
            if (e.which !== 2) return;
            window.open(`/#url=transferlist/gettransferlistview?offerId=${offerId}`,"_blank");
        }

        el.on('mouseup', openTransferInNewWindow);
    };

    Offer.showMatchDay = function(){

        function displayMatchDay(){
            const ed = $("span#endingDate").text();
            const shortDate = ed.substring(0,16).replace(/(\d{2})\.(\d{2})$/,'$1:$2').replace(/\/?\d{4}/,'');
            const durDays = parseInt($("input#sliderDuration").attr("data-value"),10);
            let dt = new OLCore.OLDate();
            dt = dt.addDays(durDays);
            $("span#endingDate").html(`<span>${shortDate} (${dt.toMdWString()})</span>`);
        }

        function updateMatchDay(records){
            const an = records.find(r => r.addedNodes.length);
            if (!an) {
                return;
            }
            if (($("span#endingDate").children().length === 0)){
                displayMatchDay();
            }
        }

        if ($('span#endingDate').length) {
        const mo = new MutationObserver(updateMatchDay);
        mo.observe($('span#endingDate')[0],{childList: true});
        }
        displayMatchDay();
    };

    /***
     * Zusatzdaten für Trades
     ***/

    Details.showPlayerSpecificDataOnTrades = async function()
    {
        var playerId = OLCore.convertNumber($("#playerView button.ol-transferlist-player-profile-button").attr("onclick"), true);
        var userId = OLCore.convertNumber($('.ol-transferlist-offer-teamname .ol-team-name[onclick]').attr("onclick") || $('ol-transferlist-playerview-offer-player-details .ol-transferlist-manager .pointer[onclick]').attr("onclick"),true);
        var buyerUserID = OLCore.convertNumber($('.manager-decision .transfer-player-bought span:nth-child(2) span[onclick]').attr("onclick"),true);
        userId = buyerUserID ?? userId;

        var field = $(".ol-player-overview-info-wrapper").first();
        var statsField = field.children().eq(3).clone();
        var cardsField = field.children().eq(4).clone();

        if(playerId && userId)
        {
            const squadData = await OLCore.Api.getSquad(userId);
            
            if(squadData && squadData.playerArr.find(p => p.id==playerId)){
                //stats update
                field.children().eq(3).find(".ol-player-overview-info-block div").eq(0).append("/Assists").prepend(tt("Saison") +"<br />");
                field.children().eq(3).find(".ol-player-overview-info-block div").eq(1).append(" / " + squadData.playerArr.find(p => p.id==playerId).assi);

                //TODO: cards update not possible as of now as data is in /team/squad/cards (only own team)
                // field.children().eq(4).find(".ol-player-overview-info-block div").eq(0).append("/Assists");
                field.children().eq(4).find(".ol-player-overview-info-block div").eq(0).prepend(tt("Saison") +"<br />");
            }


            const data = await OLCore.Api.getPlayerOverview(playerId);
                if(data){
                var oldBirthdate = parseInt(OLCore.convertNumber(data.attributes[t("Geburtstag")]),10);
                
                statsField.find(".ol-player-overview-info-block div").eq(0).append("/Assists").prepend(tt("Gesamt") +"<br />");
                statsField.find(".ol-player-overview-info-block div").eq(1).text(data.stats);
                
                cardsField.find(".ol-player-overview-info-block div").eq(0).html(tt("Gesamt") +"<br />"+  tt("Gelb") + "/" + tt("Gelb-Rot") + "/" + tt("Rot"));
                cardsField.find(".ol-player-overview-info-block div").eq(1).text(data.cards);

                var copyDataField = field.children().eq(0).clone();
                copyDataField.find(".ol-player-overview-info-block div").eq(0).text(tt("Geburtstag"));
                copyDataField.find(".ol-player-overview-info-block div").eq(1).text(tt("Woche ") + (oldBirthdate - 1 || 44));

                statsField.insertAfter(field.children().eq(3))
                cardsField.insertAfter(field.children().eq(5))
                copyDataField.insertAfter(field.children().eq(2));
                }
        }
    };

    //TODO: not working as of now (not implemented)
    Details.showWeekOnEnddate = function(){
        const endDate = $(".transfer-auction-end-date").eq(0).text();
        const dateMatch = endDate.match(/\s+(\d{2}).(\d{2}).(\d{2})\s+(\d{2})/);
        if (dateMatch){
            let old = new OLCore.OLDate(parseInt(dateMatch[3],10)+2000,parseInt(dateMatch[2],10)-1,parseInt(dateMatch[1],10));
            if (parseInt(dateMatch[4],10) < 5) {
                old = old.addDays(-1);
                }
            $(".transfer-auction-end-date").each(function(i,el){
                $(el).text($(el).text() + `(W${old.week})`);
            });
        }
    };

    Details.showTradeDetails = function (){
        Details.showPlayerSpecificDataOnTrades();
        //Details.showWeekOnEnddate();
    };

    List.addControls = function(row){
        async function copyData(event){
            event.preventDefault();
            event.stopPropagation();
            const bBids = event.ctrlKey;
            const bHeadlines = event.shiftKey;
            const offerId = $(row).attr("id").replace("transferListItem","");
            const offerData = await OLCore.Api.getOffer(offerId);
            if (!bBids) {

                let endDate;
                const endDateDiv = $(row).find("div.ol-offer-ended-date");
                if (endDateDiv.length) {
                    endDate = endDateDiv.eq(0).text().trim().replace(/\s+/g,' ').replace(/ \w[^\s]+$/,'');
                }

                const headlines = [
                    tt("Angebots-ID"),
                    tt("Spieler-ID"),
                    tt("Spielername"),
                    tt("Nationalität"),
                    tt("Mindestablöse"),
                    tt("Marktwert"),
                    tt("Gehaltsempfehlung"),
                    tt("Aktuelles Gehalt"),
                    tt("Gebote"),
                    tt("Enddatum"),
                    tt("Alter"),
                    tt("Gesamtstärke"),
                    tt("Talent"),
                    tt("Talent ermittelt"),
                    tt("Position 1"),
                    tt("Position 2"),
                    tt("Position 3"),
                    tt("Ablösesumme"),
                    tt("neues Gehalt")
                ];
                const acceptedBid = offerData.bids.find(b => b.accepted);
                const data = [
                    offerId,
                    offerData.playerId,
                    offerData.playerName,
                    offerData.nation,
                    offerData.minFee,
                    offerData.marketvalue,
                    offerData.salarySuggestion,
                    offerData.salary,
                    offerData.bidCount,
                    endDate || offerData.endDate,
                    offerData.age,
                    offerData.avg,
                    offerData.talent || '',
                    offerData.talentDetermined ? 'Ja' : 'Nein',
                    offerData.pos[0],
                    offerData.pos[1] || '',
                    offerData.pos[2] || '',
                    acceptedBid ? OLCore.getNum(acceptedBid.fee) : '',
                    acceptedBid ? OLCore.getNum(acceptedBid.salary) : ''
                ];
                const output = (bHeadlines ? (headlines.join("\t") + "\r\n") : "") + data.join("\t");
                GM_setClipboard(output);
                OLCore.info(tt("Daten in die Zwischenablage kopiert"));
            } else {
                const bids = [];
                if (bHeadlines) {
                    bids.push([
                        tt("Angebots-ID"),
                        tt("Datum"),
                        tt("Ablösesumme"),
                        tt("Gehalt"),
                        tt("Vertrag"),
                        tt("Mannschaft"),
                        tt("Ligastufe"),
                        tt("Liga"),
                        tt("Status")
                    ].join("\t"));
                }
                for (const bid of offerData.bids){
                    bids.push([
                        offerId,
                        bid.date,
                        OLCore.getNum(bid.fee),
                        OLCore.getNum(bid.salary),
                        bid.contract,
                        bid.team,
                        bid.leagueLevel,
                        bid.league,
                        bid.state
                    ].join("\t"));
                }
                GM_setClipboard(bids.join("\r\n"));
                OLCore.info(tt("Daten in die Zwischenablage kopiert"));
            }
        }
        const ctrlDiv = $(`<div class="TB_transfer-player-ui-column" style="display:inline; float:right">
        <span class="fa fa-clipboard" style="cursor:pointer" title="${tt('Angebotsdetails in Zwischenablage kopieren&#010;Strg halten für Gebotsdetails&#010;Shift halten für Überschriften')}"></span>
        </div>`);
        ctrlDiv.insertAfter($(row).find("div.transfer-list-player-name"));
        ctrlDiv.children("span.fa-clipboard").on("click", copyData);
    };

    List.setCSS = function(){
        GM_addStyle(`
        #transferListWrappertransferList div.transfer-player-flag-column {width: 3%;}
        /* #transferListWrappertransferList div.transfer-player-price-column {width: 8%;} */
        /* #transferListWrappertransferList div.transfer-player-highestbid-column {width: 10%;} */
        #transferListWrappertransferList div.transfer-player-price-column {width: 10.5%;}
        #transferListWrappertransferList div.transfer-player-highestbid-column {width: 13%;}
        #transferListWrappertransferList div.transfer-player-bids-column {width: 6.5%;}
        #transferListWrappertransferList .ol-sm .transfer-player-remainingtime-column{width: 28%;}
        /* #transferListWrappertransferList .TB_transfer-player-ui-column{width: 7%;} */
        #transferListWrappertransferList .TB_transfer-player-ui-column{width: 1.5%;}
        `);
        GM_addStyle(`
        #transferListWrapperwatchList div.watch-list-league-level-column {width: 3%;}
        #transferListWrapperwatchList div.watch-list-checkbox-column {width: 4%;}
        `);
        GM_addStyle(`
        #transferListoffersOverview div.transfer-player-status-columnn {width: 5%;}
        #transferListoffersOverview div.transfer-player-flag-column {width: 3%;}
        `);


    };

    function init(){
        Offer.setCSS();
        Filter.ctrlPanelDisplay = GM_getValue('tlmanager_ctrlPanelDisplay') || 'inline-block';
        Filter.setCSS();
        List.setCSS();

        function WFKE_Details_showTradeDetails(){
            Details.showTradeDetails();
        }

        function WFKE_Offer_offer_showPlayerInvest(){
            Offer.showPlayerInvest();
            Offer.showMatchDay();
        }

        function addRowData(row){
            Offer.showTransferInNewWindow(row);
            List.addControls(row);
        }

        OLCore.waitForKeyElements(
            //"div#transferListCreateOfferOverlayPlayerDetailContainer > div.ol-player-details.ol-player-details-selected",
            "div#overlayWindow .create-offer-overlay-content-wrapper",
            WFKE_Offer_offer_showPlayerInvest
        );

        OLCore.waitForKeyElements (
            "div.transferlist-headline",
            Filter.startTLM
        );

        OLCore.waitForKeyElements(
            "div#playerViewContent",
            WFKE_Details_showTradeDetails
        );

        OLCore.waitForKeyElements(
            "div.ol-offer-ended.ol-offer-not-accepted",
            Offer.createRenewOffer
        );

        function preventMiddleClick(el){
            OLCore.UI.preventMiddleClick(el);
        }

        OLCore.waitForKeyElements (
            "div#transferListContent",
            preventMiddleClick
        );

        OLCore.waitForKeyElements (
            "#transferListWrappertransferList div.ol-transferlist-item-row[id]",
            addRowData
        );

        OLCore.waitForKeyElements (
            "#transferListWrapperwatchList div.ol-transferlist-item-row[id]",
            addRowData
        );

        OLCore.waitForKeyElements (
            "#transferListoffersOverview div.ol-transferlist-item-row[id]",
            addRowData
        );

        OLCore.waitForKeyElements (
            "#transferListWrapperbidsOverview div.ol-transferlist-item-row[id]",
            addRowData
        );

    }

    init();

})();