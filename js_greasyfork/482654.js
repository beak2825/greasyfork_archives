// ==UserScript==
// @name         Deal aanmaken tools & fixes van Lukas BETA
// @namespace    https://www.socialdeal.nl/
// @version      1.7.9
// @description  UnStable version
// @author       Me
// @match        https://*.socialdeal.nl/bureaublad/deal_aanmaken.php*
// @match        https://*.socialdeal.be/bureaublad/deal_aanmaken.php*
// @match        https://*.socialdeal.de/bureaublad/deal_aanmaken.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=socialdeal.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482654/Deal%20aanmaken%20tools%20%20fixes%20van%20Lukas%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/482654/Deal%20aanmaken%20tools%20%20fixes%20van%20Lukas%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //START TIMER TO MEASURE CODE DURATION
    console.time("timer");

    //ADD SPELLING CHECK
    window.addEventListener('load', function() {

        const interval = setInterval(replaceEditors, 200);

        function replaceEditors() {

            const bedrijfstekstiframe = CKEDITOR.instances.bedrijfstekst.loaded;

            if (!bedrijfstekstiframe) return;

            clearInterval(interval);

            const inputBottom = document.querySelector('#cke_opmerking.cke_8');
            const inputTop = document.querySelector('#cke_opmerking.cke_1');
            const addReactieOndernemer = document.querySelectorAll('form[action*="&action=add_reactie_ondernemer"]');

            if (inputBottom !== null) {
                inputTop.parentElement.removeChild(inputTop)
            }

            for (const key in CKEDITOR.instances) {
                if (key !== 'feedback') {
                    try {
                        const instance = CKEDITOR.instances[key];
                        instance.destroy();
                        CKEDITOR.replace(key, {
                            disableNativeSpellChecker: false
                        });
                        CKEDITOR.instances[key].setKeystroke(CKEDITOR.CTRL + 32, 'bulletedlist');
                    } catch {
                        console.error("Mij (Daan) nie belle");
                    }
                }
            }
        }
        setTimeout(addListnenerToTextiframes, 1500);
    }, false);

    //PAGE ELEMENTS
    const annulaties = document.querySelector('iframe[src*="annulaties.php"]');
    const jaarplanning = document.querySelector('iframe[src*="jaarplanning.php"]');
    const financieel = document.querySelector('iframe[src*="profiel_bankgegevens.php"]');
    const uploadtool = document.querySelector('iframe[id="pdf"]');
    const reactieOndernemer = document.querySelector('img[src="img/color_wheel.png"]');
    const planner = document.querySelector('iframe[name="planner"]');
    const statistieken = document.querySelector('iframe[src*="redactie_stats.php"]');
    const vlaggen = document.querySelector('form[action*="to_do_vlaggen.php"]');
    const redTable = document.querySelector('#content > div > table[border="0"][width="100%"][cellspacing="0"][cellpadding="10"]');
    const iframeAdressen = document.querySelector('#vesteging');
    const iframeMultideal = document.querySelector('#voorbeeld5');
    const ressysframe = document.querySelector('#voorbeeld4');
    const ressysselect = document.querySelector('#reserveerappmenu');
    const dealoverzicht = document.querySelector('iframe[src*="profiel_incl_deal_iframe.php"]');

    //HIDE ELEMENTS

    if (redTable.querySelector('td[bgcolor="#FF9999"]') !== null) {
        redTable.style.display = "none";
    }

    const elementsToHide = [annulaties, jaarplanning, financieel, uploadtool, reactieOndernemer, vlaggen];

    function hideElements(elements) {
        elements.forEach(function(element) {

            if (element == null) {
                return
            }

            const elementTable = element.closest('table').parentElement.closest('table');
            elementTable.style.display = "none";
        })
    }

    hideElements(elementsToHide);

    const deal_emailonderwerp = document.querySelector('iframe[src*="deal_5"]');
    const deal_tooltip = document.querySelector('iframe[src*="deal_6"]');
    let deal_fb = document.querySelector('iframe[src*="deal_7"]');
    if (deal_fb !== null) {deal_fb = deal_fb.closest('table')}
    const highlights_standaardlink = document.querySelector('#displayText8');
    const highlights_standaardvoorwaarden = document.querySelector('#displayText7');
    if (highlights_standaardvoorwaarden !== null) {highlights_standaardvoorwaarden.style.display = "none";}
    const logistiek_extra = document.querySelector('iframe[src*="logistiek_4"]');
    const bedrijf_coordinaten = document.querySelector('iframe[src*="bedrijf_7"]');

    const rowsDelete = [deal_emailonderwerp, deal_tooltip, highlights_standaardlink, logistiek_extra, bedrijf_coordinaten, deal_fb];

    rowsDelete.forEach(row => {
        if (row == null) return

        const tr = row.closest('tr');
        tr.style.display = "none";
    });

    //STYLE DEALOVERZICHT BETA
    dealoverzicht.addEventListener("load", styleDealoverzicht);

    //HIDE VOORBEELD BLOCK

    const closebutton = '<span id="close-button-voorbeeld" style="display: flex; background-color: rgb(105, 105, 105); width: 25px; height: 25px; align-items: center; justify-content: center; position: absolute; right: 0px; top: -25px; font-size: 30px; line-height: 0px; color: white; opacity: 0.75; cursor: pointer;">×</span>'

    const voorbeeldiframe = document.querySelector('#voorbeeld');

    hideVoorbeeld();

    voorbeeldiframe.parentElement.insertAdjacentHTML('afterbegin', closebutton);
    document.querySelector('#close-button-voorbeeld').addEventListener("click", hideVoorbeeld);

    document.querySelectorAll('form[target="voorbeeld"]').forEach(form => {

        let section;

        if (form.action.indexOf("voorbeeld") > 0) {
            section = "dealtekst";
        } else if (form.action.indexOf("voorwaarde") > 0) {
            section = "highlights";
        } else if (form.action.indexOf("logistiek") > 0) {
            section = "logistiek";
        } else if (form.action.indexOf("bedrijf") > 0) {
            section = "bedrijfstekst";
        } else {
            section = "unknown";
        }

        let colspan = '';

        if (section === "highlights") {
            colspan = 'colspan="3"'
        }
        let HTMLsaveConfirm = `<tr><td align="center" ${colspan}><div id="safeconfirm-${section}" style="display: block; visibility: hidden; background-color: rgb(43, 199, 43); width: 350px; padding: 5px 0px; border-radius: 10px;"><span style="font-size:16px; font-weight: 500; line-height: 1.2;">Opgeslagen</span><br><span id="${section}-textTimeSaved" style="font-style: italic;"></span></div></td></tr>`;
        const tbody = form.closest('tbody');
        const button = tbody.querySelector('.blue');
        tbody.insertAdjacentHTML('beforeend', HTMLsaveConfirm);
        button.classList.add("savebutton");
        button.id = `savebutton-${section}`;
        button.dataset.saved = "false";
        button.addEventListener("click", function() {
            if (button.dataset.saved == "true") {
                button.dataset.saved = "false";
            }
            showVoorbeeld(button, section)
        });
    });

    function showVoorbeeld(button, section) {

        let saveconfirm = document.querySelector(`#safeconfirm-${section}`);
        saveconfirm.style.visibility = "hidden";

        voorbeeldiframe.onload = (event) => {

            let textContent = voorbeeldiframe.contentWindow.document.body.textContent;

            if (textContent == '') {
                return
            }

            if (textContent.indexOf("Aantal gangen is te lang") >= 0) {
                voorbeeldiframe.parentElement.style.display = "block";
                return
            }

            if (textContent.indexOf("FOUT, geef in of de deal in deze periode te gebruiken is") >= 0) {
                voorbeeldiframe.parentElement.style.display = "block";
                return
            }

            voorbeeldiframe.parentElement.style.display = "block";
            saveconfirm.style.visibility = "visible";
            showTimeSaved(section)
            button.dataset.saved = "true";

        }

    }

    function hideVoorbeeld() {

        voorbeeldiframe.parentElement.style.display = "none";

    }

    function showTimeSaved(section) {

        let text = document.querySelector(`#${section}-textTimeSaved`);
        let timeatsave = new Date().getTime();
        if (text.dataset.interval == undefined) {
            text.dataset.interval = setInterval(updateText, 1000);
        } else {
            clearInterval(text.dataset.interval);
            text.dataset.interval = setInterval(updateText, 1000);
        }
        text.innerText = "< 1 minuut geleden";

        function updateText() {
            let currenttime = Date.now();
            let timedifference = currenttime - timeatsave;
            let minutes = Math.floor((timedifference / 1000) / 60);

            if (minutes < 1) {
                return;
            } else if (minutes === 1) {
                text.innerText = "1 minuut geleden";
            } else if (minutes <= 60) {
                text.innerText = `${minutes} minuten geleden`;
            } else {
                text.innerText = "meer dan een uur geleden";
                clearInterval(text.dataset.interval);
            }

        }
    }

    //ADD KNOP DEAL VLAGGEN

    const dealtable = document.querySelector('form[action*="voorbeeld_deal.php"]').closest('table').parentElement.closest('table');

    const HTMLvlagbutton = '<div style="text-align:left"><a id="flagDealBtn" href="javascript:void(0)" style="margin-left: 10px; padding: 5px 10px; background-color: #444; border: 1px solid #111111; border-radius: 5px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: white; font-weight: bold; text-decoration: none;">Vlag deal</a></div>';

    dealtable.insertAdjacentHTML("beforebegin", HTMLvlagbutton);

    document.querySelector( '#flagDealBtn' ).addEventListener("click", flagDeal);

    const flags = document.querySelectorAll('iframe[src*="deal_aanmaken_check.php"]');
    const flagsArr = Array.from(flags);
    const flagsFiltered = flagsArr.filter(checkFlag)

    function checkFlag(flag) {
        const skipFlags = ["c=reserveer_1", "c=financieel_1"];
        let i = 0;
        let include = true;
        while (i < skipFlags.length && include) {
            if (flag.src.endsWith(skipFlags[i])) {
                include = false;
            }
            i++
        }
        return include;
    }

    function flagDeal() {
        flagsFiltered.forEach(flag => {
            const img = flag.contentDocument.querySelector('img[src*="flag_red"]');
            if (img !== null) {
                img.click();
            }
        })
    }

    //TEMPLATE CHECKBOXES

    const templateModule = document.querySelector('form[action*="addtemplate"]');

    let flags_checked = [];

    if (templateModule !== null) {
        templateModule.addEventListener("dblclick", function(e) {
            const src = e.target.src;
            let country;
            let checked;
            if (src == null) {
                return;
            }
            if (src.includes('nl.gif')) {
                country = "nl";
            } else if (src.includes('be.gif')) {
                country = "be";
            } else if (src.includes('fr.gif') || src.includes('fr_FR.gif')) {
                country = "fr";
            } else if (src.includes('de.gif') || src.includes('de_AT.gif')) {
                country = "de";
            }

            // Check both 'fr.gif' and 'fr_FR.gif' when either is clicked
           if (country === "fr" || country === "fr_FR") {
                activateCountry("fr");
                activateCountry("fr_FR");
           } else if (country === "de" || country === "de_AT") {
               activateCountry("de");
               activateCountry("de_AT");
            } else {
                activateCountry(country); // Activating the clicked country
                checked = true; // Setting checked to true

                check(country, checked); // Checking the checkboxes associated with the country
            }
        });
    }

    function activateCountry(activatedCountry) {
        if (!flags_checked.includes(activatedCountry)) {
            flags_checked.push(activatedCountry);
            check(activatedCountry, true);
        }
    }

    function check(country, checked) {
        const flags = templateModule.querySelectorAll(`img[src*="${country}.gif"]`);
        flags.forEach(flag => {
            const checkbox = flag.previousElementSibling;
            if (checkbox == null || checkbox.type !== "checkbox") {
                return;
            }
            checkbox.checked = checked;
        });
    }

    //BESCHIKBAARKHEID HIGHLIGHTS CHECKBOXES
    $(function() {
        var checkboxDays = $("#ma, #di, #wo, #don, #vr, #za, #zo");
        checkboxDays.dblclick(function() {
            var iteration = $(this).data('iteration') || 1
            switch (iteration) {
                case 1:
                    checkboxDays.prop("checked", true);
                    break;
                case 2:
                    checkboxDays.prop("checked", false);
                    break;
            }
            iteration++;
            if (iteration > 2) iteration = 1
            $(this).data('iteration', iteration)
        })
    });

    //FIX WIDTH & WORD-BREAK
    $(function() {
        $('#content').find('form[action*="action=add_beoordeling"]').parent().css({
            "min-width": "250px",
            "max-width": "350px",
            "word-break": "break-word"
        });
    });

    (function() {

        const menublock = document.querySelector('table[border="1"][width="400"][cellpadding="15"][bordercolor="#808080"][style]');
        const dealedit = menublock.nextElementSibling;

        dealedit.style.wordBreak = "break-word";

    })();

    const reactieOndernemerForms = document.querySelectorAll('form[action*="add_reactie_ondernemer"]');
    reactieOndernemerForms.forEach(form => {
        const tbody = form.closest('tbody');
        tbody.style.wordBreak = "break-word";
    });

    //WHEN NOT IN USE: CHANGE HEIGHT RES. SYS. & RECENSIES + STATISTIEKEN & HIDE PLANNER
    (function() {

        if (ressysselect.options[ressysselect.selectedIndex].value === '') {

            ressysframe.removeAttribute('height');

        }

        const iframeRecensies = document.querySelector('iframe[src*="profiel_recensies.php"]');
        if (iframeRecensies !== null) {
            iframeRecensies.onload = function() {
                const content = iframeRecensies.contentDocument.querySelector('table').textContent;
                if (content == ' ') {
                    iframeRecensies.removeAttribute('height');
                }
            }
        }

    })();

    hidePlanner();

    function hidePlanner() {
        if (planner == null) return

        planner.onload = function() {
            const content = planner.contentWindow.document.body.textContent;
            if (content.includes("Er is nog geen URL aangemaakt (0)")) {
                const elementTable = planner.closest('table').parentElement.closest('table');
                elementTable.style.display = "none";
            }
        }
    }

    //TOGGLE TABLE WITH REDACTIE STATS
    const parentTable = statistieken.closest('tbody');
    const HTMLtogglebutton = '<tr><td align="center" style="padding-top: 5px;"><a id="stats-toggle" href="javascript:void(0)">Meer weergeven</a></td></tr>';
    parentTable.insertAdjacentHTML('beforeend', HTMLtogglebutton);
    statistieken.removeAttribute('height');
    statistieken.scrolling = "no";
    const toggleButton = document.querySelector('#stats-toggle');
    toggleButton.addEventListener('click', toggleStatistieken);

    function toggleStatistieken() {

        if (statistieken.style.height === "") {
            statistieken.style.height = "400px";
            statistieken.scrolling = "yes";
            toggleButton.textContent = "Minder weergeven";
        } else {
            statistieken.style.height = "";
            statistieken.contentWindow.scrollTo(0, 0);
            statistieken.scrolling = "no";
            toggleButton.textContent = "Meer weergeven";
        }
    }

    //LOGISTIEK

    const reserveerselect = document.querySelector('#reserveer');
    const reserveerlink = document.querySelector('#reserveer_url_extern');
    const wijnarr = document.querySelector('#reserveer_extra');
    const vestigingenInsluiten = document.querySelector('#in_vesteging');

    vestigingenInsluiten.closest('tr').style.display = "none";

    logistiekToggleInputs();

    reserveerselect.addEventListener('input', logistiekToggleInputs);

    document.querySelector('#reserveer_url_extern').insertAdjacentHTML('afterend', '<a href="https://bblink.socialdeal.nl/bureaublad/shorter.php" target="_blank" style="margin-left: 5px;">URL shortner</a>');

    function logistiekToggleInputs() {

        const selectedVal = reserveerselect.value;
        const website = selectedVal == "4" || selectedVal == "8" || selectedVal == "9" || selectedVal == "10";
        const systeem = selectedVal == "5";
        const ressystable = ressysframe.closest('table').parentElement.closest('table');

        if (!website) {
            reserveerlink.closest('tr').style.display = "none";
        } else {
            reserveerlink.closest('tr').style.display = "";
        }

        if (!systeem) {
            wijnarr.closest('tr').style.display = "none";
            ressystable.style.display = "none";
        } else {
            wijnarr.closest('tr').style.display = "";
            ressystable.style.display = "";
        }
    }

    $("#recensieweergeven").closest('form').find('> table > tbody > tr:not(:nth-child(3),:nth-child(4),:nth-child(8))').dblclick(function() {
        $("#recensieweergeven").val("1").change();
        $("#altplaats").val("1").change();
        $("#nu_te_gebruiken").val("1").change();
    });

    //ADD REACTIE ONDERNEMER

    const buttonReactieOndernemer = document.querySelector('form[action*="add_reactie_ondernemer"]').closest('table').querySelector('button.blue.medium');

    buttonReactieOndernemer.insertAdjacentHTML("beforebegin", '<div id="add_reply" style="margin: -10px 0px 10px 0px;"><a id="standard" href="javascript:void(0)">Standaard reactie</a> | <a id="short" href="javascript:void(0)">Korte reactie</a> | <a id="aanhef" href="javascript:void(0)">Aanhef</a> | <a id="greeting" href="javascript:void(0)">Groet</a></div>');

    document.querySelector('#add_reply').addEventListener('click', function(e) {
        addReply(e);
    });

    function addReply(e) {

        let naamSchrijver = "[EIGEN NAAM]";
        const menubalk = document.querySelector('#menu');
        if (menubalk !== null) {
            const naam = menubalk.querySelector('a[href*="personeel_management_profiel.php?ak_leden_id"]').textContent;
            if (naam !== null) {
                naamSchrijver = naam;
            }
        }

        let naamPartner = getPartnerFirstName();

        const standaardReactie = `Beste ${naamPartner},<br><br>Bedankt voor je bericht! Ik heb de tekst aangepast. Als de presentatie op deze manier naar wens is, vergeet dan niet op ‘goedgekeurd’ te klikken. Alvast veel succes met de deal!<br><br>Met vriendelijke groet,<br><br>${naamSchrijver}<br><em>Tekstredactie</em>`;
        const korteReactie = `Hopelijk is de presentatie op deze manier naar wens! Vergeet dan niet op ‘goedgekeurd’ te klikken. Alvast veel succes met de deal!<br><br>Met vriendelijke groet,<br><br>${naamSchrijver}<br><em>Tekstredactie</em>`;
        const groet = `Met vriendelijke groet,<br><br>${naamSchrijver}<br><em>Tekstredactie</em>`;
        const aanhef = `Beste ${naamPartner},<br><br>`;

        let reply;
        if (e.target.id === "standard") {
            reply = standaardReactie;
        } else if (e.target.id === "short") {
            reply = korteReactie;
        } else if (e.target.id === "greeting") {
            reply = groet;
        } else if (e.target.id === "aanhef") {
            reply = aanhef;
        }
        CKEDITOR.instances.opmerking.insertHtml(reply);
    }

    //FUNCTIE GET PARTNER NAME

    function getPartnerFirstName() {

        const menublock = document.querySelector('table[border="1"][width="400"][cellpadding="15"][bordercolor="#808080"][style]');
        const dealedit = menublock.nextElementSibling;
        const firstblock = dealedit.querySelector('font[color="#333333"][face="Arial"] > table table');
        const tableRows = firstblock.querySelectorAll('tr');
        const trArr = Array.from(tableRows);

        let i = 0;
        let found = false;
        let partnername;
        let firstname;

        while (i < trArr.length && !found) {
            if (trArr[i].textContent.includes("Contactpersoon:")) {
                partnername = trArr[i].querySelectorAll('td')[1].textContent;
                found = true;
            }
            i++
        }

        if (partnername.indexOf(' ') <= 0) {
            firstname = partnername;
        } else if (partnername.includes(" en ") || partnername.includes("&")) {
            firstname = partnername;
        } else {
            firstname = partnername.substring(0, partnername.indexOf(' '));
        }

        return firstname.trim();
    }

    //FEEDBACK ONDERNEMER DOORZETTEN DEFAULT SELECTION 'NIET VAN TOEPASSING'

    const form_FBondernemer = document.querySelector('form[action*="feedback_ondernemer_revisie"]');

    if (form_FBondernemer !== null) {
        form_FBondernemer.querySelector('#salesS_fb').value = 2;
        form_FBondernemer.querySelector('#partnerS_fb').value = 2;
    }

    //FUNCTIE URL AUTOMATISCH INVULLEN

    autoInputURL();

    function autoInputURL() {
        const titel = document.querySelector("#titel");
        const titelURL = document.querySelector("#url");

        if (titelURL.hasAttribute('disabled')) return

        const monthYear = getMonthYear();

        titel.addEventListener("input", function() {
            titelURL.value = titel.value + monthYear;
            if (titel.value === "") {titelURL.value = "";}
        });
    }

    //ADD BUTTONS ABOVE HIGHLIGHTS AND VOORWAARDEN TO INPUT TEXT

    const highlightsTextarea = document.querySelector('#highlights');
    const voorwaardenTextarea = document.querySelector('#voorwaarde');

    if (highlightsTextarea !== null) {
        highlightsTextarea.insertAdjacentHTML('beforebegin','<div style="margin-bottom: 5px;"><a href="javascript:void(0)" id="linkMultidealToevoegen">Multideal toevoegen</a></div>');
        document.querySelector('#linkMultidealToevoegen').addEventListener("click", insertMultiToHighlights);
    }

    if (voorwaardenTextarea !== null) {
        voorwaardenTextarea.insertAdjacentHTML('beforebegin','<div style="margin-bottom: 5px;"><a href="javascript:void(0)" id="linkReserverenToevoegen">Reserveervoorwaarde toevoegen</a></div>');
        document.querySelector('#linkReserverenToevoegen').addEventListener("click", insertReserveerTextVoorwaarden);
    }

    document.querySelector('input[id="ma"]').closest('td').style = "padding-top: 20px;";

    //FUNCTIE GET STRING MONTH + YEAR

    function getMonthYear() {

        const date = new Date();
        const month = date.getMonth();
        const monthNames = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
        const m = monthNames[month];
        const y = date.getFullYear();

        return ` ${m} ${y}`;

    }

    //FUNCTION GET MULTIDEAL TEXT

    function getHtmlMultidealText() {
        const multideal = document.querySelector('#voorbeeld5');
        const multidealiframe = multideal ? multideal.contentDocument.querySelector('#multidealiframe') : null;
        const places = multidealiframe ? multidealiframe.contentDocument.querySelectorAll('a[id*="place"]') : null;

        if (!multideal || !multidealiframe || !places) return;

        let arr_multi_items = [];

        places.forEach(place => {
            const multi = place.closest('tr');
            const beschrijving = multi.querySelector('textarea[id*="beschrijving"]').value;
            let text = beschrijving;
            const isEarlyBirdNotFirst = beschrijving.includes("5711.API_multidealTitleEarlyBirdSecond") || beschrijving.includes("5712.API_multidealTitleEarlyBirdThird") || beschrijving.includes("6837.API_multidealTitleEarlyBirdFourth");
            if (isEarlyBirdNotFirst) return;
            const isEarlyBirdFirst = beschrijving.includes("5710.API_multidealTitleEarlyBirdFirst");
            const isVertaald = beschrijving.includes("{{");
            const forprice = multi.querySelector('input[id*="aanbieding"]').value;

            if (isVertaald) {
                const translation = multi.querySelector('a[href*="translation"]');
                if (translation !== null) {
                    text = translation.textContent.trim();
                } else {
                    text = multi.querySelector('td:has(a[id*="place"]) > p').textContent.trim();
                }
            }

            if (isEarlyBirdFirst) {
                const multiText = '- Early bird (snelle kopers)';
                text = text.replace(multiText, ' vanaf');
            }

            const price_parts = forprice.split('.');
            const tientallen = price_parts[0];
            let honderdsten;

            if (price_parts[1] === "00") {
                honderdsten = "";
            } else {
                honderdsten = "," + price_parts[1];
            }

            const multi_item = `<li>${text} €${tientallen}${honderdsten}</li>`;
            arr_multi_items.push(multi_item);

        });

        const str_multi_items = arr_multi_items.join('');
        const finalHTML = `<li><strong>Multideal:</strong><ul>${str_multi_items}</ul></li>`

        return finalHTML;
    }

    //FUNCTION INSERT MULTIDEAL TEXT TO HIGHLIGHTS

    function insertMultiToHighlights() {
        const html = getHtmlMultidealText();
        if (!html) return;
        CKEDITOR.instances.highlights.insertHtml(html);
    }

    //FUNCTION CHECK MULTI PRICES

    iframeMultideal.addEventListener("load", function(e) {
        checkMultidealPrices();
        const innerframe = e.target.contentDocument.querySelector('#multidealiframe');
        if (!innerframe) return;
        innerframe.addEventListener("load", checkMultidealPrices);
    });

    function checkMultidealPrices() {

        const multidealInnerIframe = iframeMultideal ? iframeMultideal.contentDocument.querySelector('#multidealiframe') : null;
        const places = multidealInnerIframe ? multidealInnerIframe.contentDocument.querySelectorAll('a[id*="place"]') : null;

        if (!multidealInnerIframe || !places) return;

        const dealPrijsOrigineelInput = document.querySelector('#van');
        const dealPrijsAanbiedingInput = document.querySelector('#voor');
        const dealPrijsOrigineel = dealPrijsOrigineelInput.value;
        const dealPrijsAanbieding = dealPrijsAanbiedingInput.value;

        places.forEach(place => {
            const multi = place.closest('tr');
            const multiPrijsOrigineelInput = multi.querySelector('[id*="origineleprijs"]');
            const multiPrijsAanbiedingInput = multi.querySelector('[id*="aanbieding"]');
            const multiPrijsOrigineel = multiPrijsOrigineelInput.value;
            const multiPrijsAanbieding = multiPrijsAanbiedingInput.value;
            const match = dealPrijsOrigineel == multiPrijsOrigineel && dealPrijsAanbieding == multiPrijsAanbieding;

            if (match) {
                multiPrijsOrigineelInput.style.backgroundColor = "#C6EFCE";
                multiPrijsAanbiedingInput.style.backgroundColor = "#C6EFCE";
            }
        });

    }

    //FUNCTION GET HTML RESERVEERTEXT

    function getHtmlReserveerText() {

        const reserveren = document.querySelector('#reserveer').value;
        let reserveertext;

        switch (reserveren) {
            case "1":
                reserveertext = "geen reservering nodig";
                break;
            case "2":
                reserveertext = "na aankoop telefonisch reserveren (onder vermelding van Social Deal)";
                break;
            case "3":
                reserveertext = "na aankoop reserveren via e-mail (onder vermelding van Social Deal)";
                break;
            case "4":
                reserveertext = "na aankoop via website reserveren (onder vermelding van Social Deal)";
                break;
            case "5":
                reserveertext = "na aankoop online reserveren met 'Social Deal Reserveren' (te vinden onder het overzicht: <strong>mijn vouchers</strong>)";
                break;
            case "6":
                reserveertext = "na aankoop telefonisch of via e-mail reserveren (onder vermelding van Social Deal)";
                break;
            case "7":
                reserveertext = "na aankoop telefonisch reserveren";
                break;
            case "8":
                reserveertext = "na aankoop via website reserveren";
                break;
            case "9":
                reserveertext = "na aankoop telefonisch of via website reserveren (onder vermelding van Social Deal)";
                break;
            case "10":
                reserveertext = "na aankoop via e-mail of website reserveren (onder vermelding van Social Deal)";
                break;
            case "11":
                reserveertext = "na aankoop via WhatsApp reserveren (onder vermelding van Social Deal)";
                break;
            case "12":
                reserveertext = "na aankoop via WhatsApp of e-mail reserveren (onder vermelding van Social Deal)";
                break;
            case "13":
                reserveertext = "na aankoop telefonisch of via WhatsApp reserveren (onder vermelding van Social Deal)";
                break;
            default:
                reserveertext = "";
        }

        return `<li><strong>Reserveren:</strong> ${reserveertext}</li>`;

    }

    //FUNCTION INSERT RESERVEERTEXT VOORWAARDEN

    function insertReserveerTextVoorwaarden() {
        const html = getHtmlReserveerText();
        if (!html) return;
        CKEDITOR.instances.voorwaarde.insertHtml(html);
    }

    //FUNCTIE DEALADRESSEN MAKEN

    iframeAdressen.addEventListener("load", addressInterface);

    function addressInterface() {

        const adressen = iframeAdressen.contentDocument.querySelectorAll('table[border="1"][width="300"] > tbody > tr');
        if (adressen.length <= 1) return;

        const uitgeslotenAdressenInput = document.querySelector('#blok_vesteging');

        let uitgeslotenAdressen = [];
        if (uitgeslotenAdressenInput.value !== "") {
            uitgeslotenAdressen = [...new Set(uitgeslotenAdressenInput.value.replace(/\s+/g, '').split(","))];
        }

        adressen.forEach(adres => {
            const idElement = adres.querySelector('font[color="#008000"]');
            if (idElement == null) return;
            const id = idElement.textContent.trim();
            const HTMLcheckbox = `<td><input type="checkbox" data-addressCheckbox data-addressId="${id}"></td>`
            adres.insertAdjacentHTML("afterbegin", HTMLcheckbox);
            const checkbox = adres.querySelector('input[data-addressCheckbox]');

            if (uitgeslotenAdressen.includes(id) == false) {
                checkbox.checked = true;
                checkbox.parentElement.style.backgroundColor = "#90e1a1";
            }

            checkbox.addEventListener("click", function() {
                if (checkbox.checked) {
                    includeAddress()
                    checkbox.parentElement.style.backgroundColor = "#90e1a1";
                } else {
                    excludeAddress()
                    checkbox.parentElement.style.removeProperty("background-color");
                }
                updateStats()
            });

            function excludeAddress() {
                uitgeslotenAdressen.push(id);
                const addressIdString = uitgeslotenAdressen.join(",");
                uitgeslotenAdressenInput.value = addressIdString;
            }

            function includeAddress() {
                uitgeslotenAdressen = uitgeslotenAdressen.filter(addressId => addressId !== id);
                const addressIdString = uitgeslotenAdressen.join(",");
                uitgeslotenAdressenInput.value = addressIdString;
            }

        });

        const numTotal = adressen.length;

        if (numTotal > 2) {
            const adressenTable = iframeAdressen.contentDocument.querySelector('table[border="1"][width="300"]');
            const HTMLstats = `<div><ul><li data-stats-total>${numTotal} adressen</li><li data-stats-indeal></li><li data-stats-excluded></li></ul></div>`;
            adressenTable.insertAdjacentHTML("afterend", HTMLstats);
            updateStats();
        }

        function updateStats() {
            if (numTotal <= 2) return;
            const numExcluded = uitgeslotenAdressen.length;
            const inDeal = numTotal - numExcluded;
            iframeAdressen.contentDocument.querySelector('[data-stats-indeal]').innerText = `${inDeal} adressen in de deal`;
            iframeAdressen.contentDocument.querySelector('[data-stats-excluded]').innerText = `${numExcluded} adressen uitgesloten`;
        }

    }

    //ADD EVENTLISTENER KEYDOWN & KEYUP TO BODY

    let ctrlPressed = false;

    addKeydownListener(document.querySelector('body'))

    function addListnenerToTextiframes() {

        const iframes = document.querySelectorAll('iframe[title*="tekst"],iframe[title*="highlights"],iframe[title*="voorwaarde"]');
        iframes.forEach(iframe => {
            const body = iframe.contentDocument.querySelector('body');
            addKeydownListener(body);
        });

    }

    // FUNCTION TO GET ACTIVE ELEMENT ON PAGE (ALSO WITHIN IFRAMES)

    function getActiveElement(element = document.activeElement) {
        const shadowRoot = element.shadowRoot;
        const contentDocument = element.contentDocument;

        if (shadowRoot && shadowRoot.activeElement) {
            return getActiveElement(shadowRoot.activeElement);
        }

        if (contentDocument && contentDocument.activeElement) {
            return getActiveElement(contentDocument.activeElement);
        }

        return element;
    }

    //ADD EVENTLISTENER KEYDOWN ESC & CTRL + C & KEYUP

    function addKeydownListener(element) {

        element.addEventListener("keydown", function(e) {

            if (e.keyCode == 27) {
                e.preventDefault();
                hideVoorbeeld();
            }

            if (e.keyCode == 17) {
                e.preventDefault();
                ctrlPressed = true;
            }

            if (e.keyCode == 83 && ctrlPressed) {
                e.preventDefault();
                saveText();
            }
        });

        element.addEventListener("keyup", function(e) {
            e.preventDefault();
            ctrlPressed = false;
        });
    }

    //FUNCTION SAVE TEXT

    function saveText() {

        const elementInFocus = getActiveElement();
        const parentForm = elementInFocus.closest('form');
        const savebutton_deal = document.querySelector('#savebutton-dealtekst');
        const savebutton_highlights = document.querySelector('#savebutton-highlights');
        const savebutton_logistiek = document.querySelector('#savebutton-logistiek');
        const savebutton_bedrijfstekst = document.querySelector('#savebutton-bedrijfstekst');
        let target;

        if (parentForm !== null) {

            if (parentForm.action.includes('voorbeeld_deal')) {
                target = savebutton_deal;
            } else if (parentForm.action.includes('logistiek')) {
                target = savebutton_logistiek;
            } else if (parentForm.action.includes('post_bedrijf')) {
                target = savebutton_bedrijfstekst;
            }

        } else if (elementInFocus.classList.contains('cke_editable')) {

            const headtitle = elementInFocus.closest('html').querySelector('title').textContent;

            if (headtitle.includes(', tekst')) {
                target = savebutton_deal;
            } else if (headtitle.includes('highlights') || headtitle.includes('voorwaarde')) {
                target = savebutton_highlights;
            } else if (headtitle.includes(', bedrijfstekst')) {
                target = savebutton_bedrijfstekst;
            }

        }

        if (target == null) return;

        target.click();

    }

    function styleDealoverzicht() {

        const head = dealoverzicht.contentDocument.head;

        const styleCSS = `
<style>

.row{
  border-bottom: 1px solid grey;
  background-color: rgb(255, 255, 255);
}

.row:has(font[color="#0000FF"]){
  background-color: rgb(236, 243, 248);
}

.row:not(:has(a[title])){
  color: rgb(128 128 128);
  background-color: rgb(211,211,211);
}

.row span[style*="background-color: #"] {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: 700;
}

</style>
`;

        head.insertAdjacentHTML('beforeEnd', styleCSS);

        dealoverzicht.contentDocument.querySelectorAll('table[cellpadding="9"]').forEach(table => {
            table.classList.add('row')
            const td = table.querySelectorAll('tbody > tr > td');
            td.forEach(td => {
                td.removeAttribute('background');
            });
        });

        dealoverzicht.contentDocument.querySelectorAll('.row:not(:has(a[title])) font[color]').forEach(font => {font.removeAttribute('color')});

    }

    //END TIMER TO MEASURE CODE DURATION
    console.timeEnd("timer");

})();