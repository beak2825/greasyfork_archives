// ==UserScript==
// @name         [Rews] Panel Dodatków
// @namespace    https://www.margonem.pl/profile/view,9871878
// @description  Zbiór wszystkich dodatków autorstwa itsRews oraz ich ustawienia.
// @version      U23.8.17
// @author       itsRews
// @match        *://*.margonem.pl/
// @exclude      *://www.margonem.pl/*
// @exclude      *://forum.margonem.pl/*
// @exclude      *://addons2.margonem.pl/
// @icon         https://www.google.com/s2/favicons?domain=margonem.pl
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472672/%5BRews%5D%20Panel%20Dodatk%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/472672/%5BRews%5D%20Panel%20Dodatk%C3%B3w.meta.js
// ==/UserScript==

async function waitForAllInit() {
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (typeof Engine !== 'undefined' && typeof Engine.hero !== 'undefined') {
                if (Engine.allInit === true) {
                    clearInterval(intervalId);
                    resolve();
                }
            }
            else {
                if (g.init === 5) {
                    setInterval(() => {
                        clearInterval(intervalId);
                        resolve();
                    }, 100);
                }
            }
        }, 100); // Check every 100 milliseconds
    });
}

(async function() {
    await waitForAllInit();
    'use strict';
    let changingSettings = false;

    const REWSMain = document.createElement('div');
    if (localStorage.getItem('REWS_MAIN.x') && localStorage.getItem('REWS_MAIN.y')) {
        REWSMain.style.left = localStorage.getItem('REWS_MAIN.x');
        REWSMain.style.top = localStorage.getItem('REWS_MAIN.y');
    } else {
        REWSMain.style.left = '50px';
        REWSMain.style.top = '50px';
    }
    REWSMain.style.position = 'fixed';
    REWSMain.style.width = '750px';
    REWSMain.style.border = '1px solid silver';
    REWSMain.style.display = 'flex';
    REWSMain.style.flexDirection = 'row';
    REWSMain.style.background = '#363945';
    REWSMain.style.zIndex = '9999';
    REWSMain.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/1.png?v-1691053381869), auto';
    REWSMain.style.color = 'white';
    REWSMain.style.fontFamily = 'Arimo, sans-serif';
    REWSMain.style.fontSize = '13px';

    const REWSTop = document.createElement('div');
    REWSTop.style.height = '15px';
    REWSTop.style.width = '740px';
    REWSTop.style.border = '0px solid silver';
    REWSTop.style.position = 'absolute';
    REWSTop.style.background = '#4f5364';
    REWSTop.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    REWSTop.style.padding = '5px';
    REWSTop.textContent = '[REWS] Panel Dodatków';
    REWSTop.style.textAlign = 'left';
    REWSTop.style.fontWeight = 'bold';


    const REWSCol1 = document.createElement('div');
    REWSCol1.style.height = '50%';
    REWSCol1.style.width = '250px';
    REWSCol1.style.display = 'flex';
    REWSCol1.style.verticalAlign = 'top';
    REWSCol1.style.flexDirection = 'column';
    REWSCol1.style.alignItems = 'center';
    REWSCol1.style.marginTop = '32px';
    REWSCol1.style.marginBottom = '7px';

    const CREDITSMain = document.createElement('div');
    CREDITSMain.style.display = 'flex';
    CREDITSMain.style.flexDirection = 'column';
    CREDITSMain.style.alignItems = 'center';

    const CREDITSAuthor = document.createElement('span');
    CREDITSAuthor.textContent = 'Dodatki autorstwa: ';
    CREDITSAuthor.style.fontWeight = 'bold';
    CREDITSAuthor.style.display = 'flex';
    CREDITSAuthor.style.flexDirection = 'row';

    const CREDITSItsRewsLink = document.createElement('a');
    CREDITSItsRewsLink.href = 'https://www.margonem.pl/profile/view,9871878#char_11863,nubes';
    CREDITSItsRewsLink.textContent = 'itsRews';
    CREDITSItsRewsLink.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    CREDITSItsRewsLink.target = '_blank';
    CREDITSItsRewsLink.style.color = 'silver';

    const CREDITSHelpers = document.createElement('span');
    CREDITSHelpers.textContent = 'Dodatkowe podziękowania dla: ';
    CREDITSHelpers.style.fontWeight = 'bold';
    CREDITSHelpers.style.display = 'flex';
    CREDITSHelpers.style.flexDirection = 'row';

    const CREDITSReikuLink = document.createElement('a');
    CREDITSReikuLink.href = 'https://www.margonem.pl/profile/view,3911756#char_11536,nubes';
    CREDITSReikuLink.textContent = 'Reiku';
    CREDITSReikuLink.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    CREDITSReikuLink.target = '_blank';
    CREDITSReikuLink.style.color = 'silver';


    const CREDITSLozuLink = document.createElement('a');
    CREDITSLozuLink.href = 'https://www.margonem.pl/profile/view,7411461#char_10097,nubes';
    CREDITSLozuLink.textContent = 'Lozu';
    CREDITSLozuLink.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    CREDITSLozuLink.target = '_blank';
    CREDITSLozuLink.style.color = 'silver';

    const CREDITSKotletLink = document.createElement('a');
    CREDITSKotletLink.href = 'https://www.margonem.pl/profile/view,9167917#char_8619,nubes';
    CREDITSKotletLink.textContent = '(afczący) Kotlet';
    CREDITSKotletLink.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    CREDITSKotletLink.target = '_blank';
    CREDITSKotletLink.style.color = 'silver';


    const CONFIRMSETTINGSMain = document.createElement('div');
    CONFIRMSETTINGSMain.style.display = 'flex';
    CONFIRMSETTINGSMain.style.flexDirection = 'column';
    CONFIRMSETTINGSMain.style.alignItems = 'center';

    const CONFIRMSETTINGSButton = document.createElement('input');
    CONFIRMSETTINGSButton.value = 'Zapisz ustawienia';
    CONFIRMSETTINGSButton.type = 'button';
    CONFIRMSETTINGSButton.style.width = '125px';
    CONFIRMSETTINGSButton.style.height = '25px';
    CONFIRMSETTINGSButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const CONFIRMSETTINGSText = document.createElement('span');
    CONFIRMSETTINGSText.textContent = '!!ZAPISZ USTAWIENIA!!';
    CONFIRMSETTINGSText.style.color = '#bb2a40';
    CONFIRMSETTINGSText.style.fontWeight = 'bold';
    CONFIRMSETTINGSText.style.display = 'none';
    CONFIRMSETTINGSText.style.flexDirection = 'row';


    const GROUPMANAGERMain = document.createElement('div');
    GROUPMANAGERMain.style.display = 'flex';
    GROUPMANAGERMain.style.flexDirection = 'column';
    GROUPMANAGERMain.style.alignItems = 'center';

    const GROUPMANAGERTitle = document.createElement('span');
    GROUPMANAGERTitle.textContent = '[Group Manager]';
    GROUPMANAGERTitle.style.display = 'flex';
    GROUPMANAGERTitle.style.fontWeight = 'bold';
    GROUPMANAGERTitle.style.fontSize = '13px';
    GROUPMANAGERTitle.style.padding = '5px';

    const GROUPMANAGERWarriorText = document.createElement('span');
    GROUPMANAGERWarriorText.textContent = 'W: 0 -';
    GROUPMANAGERWarriorText.style.display = 'flex';
    GROUPMANAGERWarriorText.style.flexDirection = 'row';
    GROUPMANAGERWarriorText.style.marginBottom = '5px';

    const GROUPMANAGERWarriorButton = document.createElement('input');
    GROUPMANAGERWarriorButton.value = 'Zaproś Wojownika';
    GROUPMANAGERWarriorButton.type = 'button';
    GROUPMANAGERWarriorButton.style.width = '120px';
    GROUPMANAGERWarriorButton.style.height = '20px';
    GROUPMANAGERWarriorButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const GROUPMANAGERPaladinText = document.createElement('span');
    GROUPMANAGERPaladinText.textContent = 'P: 0 -';
    GROUPMANAGERPaladinText.style.display = 'flex';
    GROUPMANAGERPaladinText.style.flexDirection = 'row';
    GROUPMANAGERPaladinText.style.marginBottom = '5px';

    const GROUPMANAGERPaladinButton = document.createElement('input');
    GROUPMANAGERPaladinButton.value = 'Zaproś Paladyna';
    GROUPMANAGERPaladinButton.type = 'button';
    GROUPMANAGERPaladinButton.style.width = '120px';
    GROUPMANAGERPaladinButton.style.height = '20px';
    GROUPMANAGERPaladinButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const GROUPMANAGERBladeDancerText = document.createElement('span');
    GROUPMANAGERBladeDancerText.textContent = 'B: 0 -';
    GROUPMANAGERBladeDancerText.style.display = 'flex';
    GROUPMANAGERBladeDancerText.style.flexDirection = 'row';
    GROUPMANAGERBladeDancerText.style.marginBottom = '5px';

    const GROUPMANAGERBladeDancerButton = document.createElement('input');
    GROUPMANAGERBladeDancerButton.value = 'Zaproś Tancerza';
    GROUPMANAGERBladeDancerButton.type = 'button';
    GROUPMANAGERBladeDancerButton.style.width = '120px';
    GROUPMANAGERBladeDancerButton.style.height = '20px';
    GROUPMANAGERBladeDancerButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const GROUPMANAGERMageText = document.createElement('span');
    GROUPMANAGERMageText.textContent = 'M: 0 -';
    GROUPMANAGERMageText.style.display = 'flex';
    GROUPMANAGERMageText.style.flexDirection = 'row';
    GROUPMANAGERMageText.style.marginBottom = '5px';

    const GROUPMANAGERMageButton = document.createElement('input');
    GROUPMANAGERMageButton.value = 'Zaproś Maga';
    GROUPMANAGERMageButton.type = 'button';
    GROUPMANAGERMageButton.style.width = '120px';
    GROUPMANAGERMageButton.style.height = '20px';
    GROUPMANAGERMageButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const GROUPMANAGERHunterText = document.createElement('span');
    GROUPMANAGERHunterText.textContent = 'H: 0 -';
    GROUPMANAGERHunterText.style.display = 'flex';
    GROUPMANAGERHunterText.style.flexDirection = 'row';
    GROUPMANAGERHunterText.style.marginBottom = '5px';

    const GROUPMANAGERHunterButton = document.createElement('input');
    GROUPMANAGERHunterButton.value = 'Zaproś Łowce';
    GROUPMANAGERHunterButton.type = 'button';
    GROUPMANAGERHunterButton.style.width = '120px';
    GROUPMANAGERHunterButton.style.height = '20px';
    GROUPMANAGERHunterButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';

    const GROUPMANAGERTrackerText = document.createElement('span');
    GROUPMANAGERTrackerText.textContent = 'T: 0 -';
    GROUPMANAGERTrackerText.style.display = 'flex';
    GROUPMANAGERTrackerText.style.flexDirection = 'row';
    GROUPMANAGERTrackerText.style.marginBottom = '5px';

    const GROUPMANAGERTrackerButton = document.createElement('input');
    GROUPMANAGERTrackerButton.value = 'Zaproś Tropiciela';
    GROUPMANAGERTrackerButton.type = 'button';
    GROUPMANAGERTrackerButton.style.width = '120px';
    GROUPMANAGERTrackerButton.style.height = '20px';
    GROUPMANAGERTrackerButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';



    const REWSCol2 = document.createElement('div');
    REWSCol2.style.height = '50%';
    REWSCol2.style.width = '250px';
    REWSCol2.style.display = 'flex';
    REWSCol2.style.verticalAlign = 'top';
    REWSCol2.style.flexDirection = 'column';
    REWSCol2.style.alignItems = 'center';
    REWSCol2.style.marginTop = '32px';
    REWSCol2.style.marginBottom = '7px';

    const SAFEATTACKMain = document.createElement('div');
    SAFEATTACKMain.style.display = 'flex';
    SAFEATTACKMain.style.flexDirection = 'column';
    SAFEATTACKMain.style.alignItems = 'center';

    const SAFEATTACKTitle = document.createElement('span');
    SAFEATTACKTitle.textContent = '[Safe Attack]';
    SAFEATTACKTitle.style.display = 'flex';
    SAFEATTACKTitle.style.fontWeight = 'bold';
    SAFEATTACKTitle.style.fontSize = '13px';
    SAFEATTACKTitle.style.padding = '5px';

    const SAFEATTACKEnabledText = document.createElement('span');
    SAFEATTACKEnabledText.textContent = 'Włącz: ';
    SAFEATTACKEnabledText.style.display = 'flex';
    SAFEATTACKEnabledText.style.flexDirection = 'row';

    const SAFEATTACKEnabledCheck = document.createElement('input');
    SAFEATTACKEnabledCheck.type = 'checkbox';
    SAFEATTACKEnabledCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_SAFEATTACK.check') === 'ON') {
        SAFEATTACKEnabledCheck.checked = true;
    }
    else {
        SAFEATTACKEnabledCheck.checked = false;
    }

    const SAFEATTACKKeyText = document.createElement('span');
    SAFEATTACKKeyText.textContent = 'Atakuj na: ';
    SAFEATTACKKeyText.style.display = 'flex';
    SAFEATTACKKeyText.style.flexDirection = 'row';

    const SAFEATTACKKeyBind = document.createElement('input');
    SAFEATTACKKeyBind.type = 'textbox';
    SAFEATTACKKeyBind.style.width = '15px';
    SAFEATTACKKeyBind.style.height = '15px';
    if (localStorage.getItem('REWS_SAFEATTACK.key') !== null) {
        SAFEATTACKKeyBind.value = localStorage.getItem('REWS_SAFEATTACK.key');
    }
    else {
        SAFEATTACKKeyBind.value = 'x';
    }
    SAFEATTACKKeyBind.maxLength = '1';

    const SAFEATTACKMessageText = document.createElement('span');
    SAFEATTACKMessageText.textContent = 'Wyświetlaj komunikaty: ';
    SAFEATTACKMessageText.style.display = 'flex';
    SAFEATTACKMessageText.style.flexDirection = 'row';

    const SAFEATTACKMessageCheck = document.createElement('input');
    SAFEATTACKMessageCheck.type = 'checkbox';
    SAFEATTACKMessageCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_SAFEATTACK.messageCheck') === 'ON') {
        SAFEATTACKMessageCheck.checked = true;
    }
    else {
        SAFEATTACKMessageCheck.checked = false;
    }

    const AUTOFIGHTMain = document.createElement('div');
    AUTOFIGHTMain.style.display = 'flex';
    AUTOFIGHTMain.style.flexDirection = 'column';
    AUTOFIGHTMain.style.alignItems = 'center';

    const AUTOFIGHTTitle = document.createElement('span');
    AUTOFIGHTTitle.textContent = '[Auto Fight]';
    AUTOFIGHTTitle.style.display = 'flex';
    AUTOFIGHTTitle.style.fontWeight = 'bold';
    AUTOFIGHTTitle.style.fontSize = '13px';
    AUTOFIGHTTitle.style.padding = '5px';

    const AUTOFIGHTEnabledText = document.createElement('span');
    AUTOFIGHTEnabledText.textContent = 'Włącz: ';
    AUTOFIGHTEnabledText.style.display = 'flex';
    AUTOFIGHTEnabledText.style.flexDirection = 'row';

    const AUTOFIGHTEnabledCheck = document.createElement('input');
    AUTOFIGHTEnabledCheck.type = 'checkbox';
    AUTOFIGHTEnabledCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_AUTOFIGHT.check') === 'ON') {
        AUTOFIGHTEnabledCheck.checked = true;
    }
    else {
        AUTOFIGHTEnabledCheck.checked = false;
    }

    const AUTOFIGHTSpecialMobsText = document.createElement('span');
    AUTOFIGHTSpecialMobsText.textContent = 'AutoFight Kolos/Tytan/E3: ';
    AUTOFIGHTSpecialMobsText.style.display = 'flex';
    AUTOFIGHTSpecialMobsText.style.flexDirection = 'row';

    const AUTOFIGHTSpecialMobsCheck = document.createElement('input');
    AUTOFIGHTSpecialMobsCheck.type = 'checkbox';
    AUTOFIGHTSpecialMobsCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_AUTOFIGHT.specialMobsCheck') === 'ON') {
        AUTOFIGHTSpecialMobsCheck.checked = true;
    }
    else {
        AUTOFIGHTSpecialMobsCheck.checked = false;
    }

    const AUTOFIGHTPvpText = document.createElement('span');
    AUTOFIGHTPvpText.textContent = 'AutoFight w PvP: ';
    AUTOFIGHTPvpText.style.display = 'flex';
    AUTOFIGHTPvpText.style.flexDirection = 'row';

    const AUTOFIGHTPvpCheck = document.createElement('input');
    AUTOFIGHTPvpCheck.type = 'checkbox';
    AUTOFIGHTPvpCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_AUTOFIGHT.pvpCheck') === 'ON') {
        AUTOFIGHTPvpCheck.checked = true;
    }
    else {
        AUTOFIGHTPvpCheck.checked = false;
    }

    const AUTOFIGHTGroupAdvantageText = document.createElement('span');
    AUTOFIGHTGroupAdvantageText.textContent = 'F z przewagą osób (PvP): ';
    AUTOFIGHTGroupAdvantageText.style.display = 'flex';
    AUTOFIGHTGroupAdvantageText.style.flexDirection = 'row';

    const AUTOFIGHTGroupAdvantage = document.createElement('input');
    AUTOFIGHTGroupAdvantage.type = 'text';
    AUTOFIGHTGroupAdvantage.style.width = '30px';
    AUTOFIGHTGroupAdvantage.style.height = '15px';
    if (localStorage.getItem('REWS_AUTOFIGHT.groupAdvantage') !== null) {
        AUTOFIGHTGroupAdvantage.value = localStorage.getItem('REWS_AUTOFIGHT.groupAdvantage');
    }
    else {
        AUTOFIGHTGroupAdvantage.value = '';
    }


    const REWSCol3 = document.createElement('div');
    REWSCol3.style.height = '50%';
    REWSCol3.style.width = '250px';
    REWSCol3.style.display = 'flex';
    REWSCol3.style.verticalAlign = 'top';
    REWSCol3.style.flexDirection = 'column';
    REWSCol3.style.alignItems = 'center';
    REWSCol3.style.marginTop = '32px';
    REWSCol3.style.marginBottom = '7px';

    const EASYGROUPMain = document.createElement('div');
    EASYGROUPMain.style.display = 'flex';
    EASYGROUPMain.style.flexDirection = 'column';
    EASYGROUPMain.style.alignItems = 'center';

    const EASYGROUPTitle = document.createElement('span');
    EASYGROUPTitle.textContent = '[Easy Group]';
    EASYGROUPTitle.style.display = 'flex';
    EASYGROUPTitle.style.fontWeight = 'bold';
    EASYGROUPTitle.style.fontSize = '13px';
    EASYGROUPTitle.style.padding = '5px';

    const EASYGROUPEnabledText = document.createElement('span');
    EASYGROUPEnabledText.textContent = 'Włącz: ';
    EASYGROUPEnabledText.style.display = 'flex';
    EASYGROUPEnabledText.style.flexDirection = 'row';

    const EASYGROUPEnabledCheck = document.createElement('input');
    EASYGROUPEnabledCheck.type = 'checkbox';
    EASYGROUPEnabledCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_EASYGROUP.check') === 'ON') {
        EASYGROUPEnabledCheck.checked = true;
    }
    else {
        EASYGROUPEnabledCheck.checked = false;
    }

    const EASYGROUPKeyText = document.createElement('span');
    EASYGROUPKeyText.textContent = 'Zapraszaj na: ';
    EASYGROUPKeyText.style.display = 'flex';
    EASYGROUPKeyText.style.flexDirection = 'row';

    const EASYGROUPKeyBind = document.createElement('input');
    EASYGROUPKeyBind.type = 'textbox';
    EASYGROUPKeyBind.style.width = '15px';
    EASYGROUPKeyBind.style.height = '15px';
    if (localStorage.getItem('REWS_EASYGROUP.key') !== null) {
        EASYGROUPKeyBind.value = localStorage.getItem('REWS_EASYGROUP.key');
    }
    else {
        EASYGROUPKeyBind.value = 'v';
    }
    EASYGROUPKeyBind.maxLength = '1';

    const EASYGROUPAcceptText = document.createElement('span');
    EASYGROUPAcceptText.textContent = 'Akceptuj zaproszenia (SI): ';
    EASYGROUPAcceptText.style.display = 'flex';
    EASYGROUPAcceptText.style.flexDirection = 'row';

    const EASYGROUPAcceptCheck = document.createElement('input');
    EASYGROUPAcceptCheck.type = 'checkbox';
    EASYGROUPAcceptCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_EASYGROUP.acceptCheck') === 'ON') {
        EASYGROUPAcceptCheck.checked = true;
    }
    else {
        EASYGROUPAcceptCheck.checked = false;
    }

    const EASYGROUPInviteRandomsText = document.createElement('span');
    EASYGROUPInviteRandomsText.textContent = 'Dodawaj obcych: ';
    EASYGROUPInviteRandomsText.style.display = 'flex';
    EASYGROUPInviteRandomsText.style.flexDirection = 'row';

    const EASYGROUPInviteRandomsCheck = document.createElement('input');
    EASYGROUPInviteRandomsCheck.type = 'checkbox';
    EASYGROUPInviteRandomsCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_EASYGROUP.inviteRandomsCheck') === 'ON') {
        EASYGROUPInviteRandomsCheck.checked = true;
    }
    else {
        EASYGROUPInviteRandomsCheck.checked = false;
    }

    const EASYGROUPInviteEnemiesText = document.createElement('span');
    EASYGROUPInviteEnemiesText.textContent = 'Dodawaj wrogów klanu: ';
    EASYGROUPInviteEnemiesText.style.display = 'flex';
    EASYGROUPInviteEnemiesText.style.flexDirection = 'row';

    const EASYGROUPInviteEnemiesCheck = document.createElement('input');
    EASYGROUPInviteEnemiesCheck.type = 'checkbox';
    EASYGROUPInviteEnemiesCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_EASYGROUP.inviteEnemiesCheck') === 'ON') {
        EASYGROUPInviteEnemiesCheck.checked = true;
    }
    else {
        EASYGROUPInviteEnemiesCheck.checked = false;
    }

    const EASYGROUPMessageText = document.createElement('span');
    EASYGROUPMessageText.textContent = 'Wyświetlaj komunikaty: ';
    EASYGROUPMessageText.style.display = 'flex';
    EASYGROUPMessageText.style.flexDirection = 'row';

    const EASYGROUPMessageCheck = document.createElement('input');
    EASYGROUPMessageCheck.type = 'checkbox';
    EASYGROUPMessageCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_EASYGROUP.messageCheck') === 'ON') {
        EASYGROUPMessageCheck.checked = true;
    }
    else {
        EASYGROUPMessageCheck.checked = false;
    }


    const ITEMENHANCERMain = document.createElement('div');
    ITEMENHANCERMain.style.display = 'flex';
    ITEMENHANCERMain.style.flexDirection = 'column';
    ITEMENHANCERMain.style.alignItems = 'center';

    const ITEMENHANCERTitle = document.createElement('span');
    ITEMENHANCERTitle.textContent = '[Item Enhancer]';
    ITEMENHANCERTitle.style.display = 'flex';
    ITEMENHANCERTitle.style.fontWeight = 'bold';
    ITEMENHANCERTitle.style.fontSize = '13px';
    ITEMENHANCERTitle.style.padding = '5px';

    const ITEMENHANCEREnabledText = document.createElement('span');
    ITEMENHANCEREnabledText.textContent = 'Włącz: ';
    ITEMENHANCEREnabledText.style.display = 'flex';
    ITEMENHANCEREnabledText.style.flexDirection = 'row';

    const ITEMENHANCEREnabledCheck = document.createElement('input');
    ITEMENHANCEREnabledCheck.type = 'checkbox';
    ITEMENHANCEREnabledCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_ITEMENHANCER.check') === 'ON') {
        ITEMENHANCEREnabledCheck.checked = true;
    }
    else {
        ITEMENHANCEREnabledCheck.checked = false;
    }

    const ITEMENHANCERItemNameText = document.createElement('span');
    ITEMENHANCERItemNameText.textContent = '-';
    ITEMENHANCERItemNameText.style.display = 'flex';
    ITEMENHANCERItemNameText.style.flexDirection = 'row';
    ITEMENHANCERItemNameText.style.fontWeight = 'bold';

    const ITEMENHANCERItemNumberText = document.createElement('span');
    ITEMENHANCERItemNumberText.textContent = 'Item: ';
    ITEMENHANCERItemNumberText.style.display = 'flex';
    ITEMENHANCERItemNumberText.style.flexDirection = 'row';

    let ITEMENHANCERItemName;
    let ITEMENHANCERItemHid;
    let ITEMENHANCERItemId;
    const ITEMENHANCERItemNumber = document.createElement('input');
    ITEMENHANCERItemNumber.type = 'text';
    ITEMENHANCERItemNumber.style.width = '125px';
    ITEMENHANCERItemNumber.style.height = '15px';
    ITEMENHANCERItemNumber.placeholder = 'ITEM#xxxxxx.świat';
    if (localStorage.getItem('REWS_ITEMENHANCER.itemNumber') !== null) {
        ITEMENHANCERItemNumber.value = localStorage.getItem('REWS_ITEMENHANCER.itemNumber');
    }
    else {
        ITEMENHANCERItemNumber.value = '';
    }

    const ITEMENHANCERUseUniqueItemsText = document.createElement('span');
    ITEMENHANCERUseUniqueItemsText.textContent = 'Spalaj unikaty: ';
    ITEMENHANCERUseUniqueItemsText.style.display = 'flex';
    ITEMENHANCERUseUniqueItemsText.style.flexDirection = 'row';

    const ITEMENHANCERUseUniqueItemsCheck = document.createElement('input');
    ITEMENHANCERUseUniqueItemsCheck.type = 'checkbox';
    ITEMENHANCERUseUniqueItemsCheck.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';
    if (localStorage.getItem('REWS_ITEMENHANCER.uniqueCheck') === 'ON') {
        ITEMENHANCERUseUniqueItemsCheck.checked = true;
    }
    else {
        ITEMENHANCERUseUniqueItemsCheck.checked = false;
    }

    const ITEMENHANCEREmptySpaceText = document.createElement('span');
    ITEMENHANCEREmptySpaceText.textContent = 'Ulepszaj przy wolnych slotach: ';
    ITEMENHANCEREmptySpaceText.style.display = 'flex';
    ITEMENHANCEREmptySpaceText.style.flexDirection = 'row';

    const ITEMENHANCEREmptySpaceInput = document.createElement('input');
    ITEMENHANCEREmptySpaceInput.type = 'text';
    ITEMENHANCEREmptySpaceInput.style.width = '30px';
    ITEMENHANCEREmptySpaceInput.style.height = '15px';
    ITEMENHANCEREmptySpaceInput.placeholder = '1-9';
    if (localStorage.getItem('REWS_ITEMENHANCER.emptySpace') !== null) {
        ITEMENHANCEREmptySpaceInput.value = localStorage.getItem('REWS_ITEMENHANCER.emptySpace');
    }
    else {
        ITEMENHANCEREmptySpaceInput.value = '';
    }

    const ITEMENHANCERItemsUsedText = document.createElement('span');
    ITEMENHANCERItemsUsedText.textContent = 'Dodatek spalił 0 przedmiotów';
    ITEMENHANCERItemsUsedText.style.display = 'flex';
    ITEMENHANCERItemsUsedText.style.flexDirection = 'row';

    const ITEMENHANCERItemsUsedButton = document.createElement('input');
    ITEMENHANCERItemsUsedButton.value = 'Zresetuj licznik';
    ITEMENHANCERItemsUsedButton.type = 'button';
    ITEMENHANCERItemsUsedButton.style.width = '125px';
    ITEMENHANCERItemsUsedButton.style.height = '25px';
    ITEMENHANCERItemsUsedButton.style.cursor = 'url(https://nubes.margonem.pl/img/gui/cursor/5.png?v=1691053381869), auto';



    const separators = [];
    for (let separatorIndex = 0; separatorIndex < 8; separatorIndex++) {
        const separator = document.createElement('div');
        separator.textContent = '⸻⸻⸻⸻';
        separator.style.color = 'silver';
        separator.style.marginTop = '-2px';
        separator.style.marginBottom = '-2px';
        separators.push(separator);
    }




    //
    function REWSConstructor() {
        document.body.appendChild(REWSMain);
        REWSMain.appendChild(REWSTop);

        REWSMain.appendChild(REWSCol1);

        REWSCol1.appendChild(CREDITSAuthor);
        REWSCol1.appendChild(CREDITSItsRewsLink);
        REWSCol1.appendChild(CREDITSHelpers);
        REWSCol1.appendChild(CREDITSReikuLink);
        REWSCol1.appendChild(CREDITSLozuLink);
        REWSCol1.appendChild(CREDITSKotletLink);

        REWSCol1.appendChild(separators[1]);

        REWSCol1.appendChild(CONFIRMSETTINGSMain);
        CONFIRMSETTINGSMain.appendChild(CONFIRMSETTINGSText);
        CONFIRMSETTINGSMain.appendChild(CONFIRMSETTINGSButton);

        REWSCol1.appendChild(separators[2]);

        REWSCol1.appendChild(GROUPMANAGERMain);
        GROUPMANAGERMain.appendChild(GROUPMANAGERTitle);
        GROUPMANAGERMain.appendChild(GROUPMANAGERWarriorText);
        GROUPMANAGERWarriorText.appendChild(GROUPMANAGERWarriorButton);
        GROUPMANAGERMain.appendChild(GROUPMANAGERPaladinText);
        GROUPMANAGERPaladinText.appendChild(GROUPMANAGERPaladinButton);
        GROUPMANAGERMain.appendChild(GROUPMANAGERBladeDancerText);
        GROUPMANAGERBladeDancerText.appendChild(GROUPMANAGERBladeDancerButton);
        GROUPMANAGERMain.appendChild(GROUPMANAGERMageText);
        GROUPMANAGERMageText.appendChild(GROUPMANAGERMageButton);
        GROUPMANAGERMain.appendChild(GROUPMANAGERHunterText);
        GROUPMANAGERHunterText.appendChild(GROUPMANAGERHunterButton);
        GROUPMANAGERMain.appendChild(GROUPMANAGERTrackerText);
        GROUPMANAGERTrackerText.appendChild(GROUPMANAGERTrackerButton);

        REWSCol1.appendChild(separators[3]);


        REWSMain.appendChild(REWSCol2);

        REWSCol2.appendChild(SAFEATTACKMain);
        SAFEATTACKMain.appendChild(SAFEATTACKTitle);
        SAFEATTACKMain.appendChild(SAFEATTACKEnabledText);
        SAFEATTACKEnabledText.appendChild(SAFEATTACKEnabledCheck);
        SAFEATTACKMain.appendChild(SAFEATTACKKeyText);
        SAFEATTACKKeyText.appendChild(SAFEATTACKKeyBind);
        SAFEATTACKMain.appendChild(SAFEATTACKMessageText);
        SAFEATTACKMessageText.appendChild(SAFEATTACKMessageCheck);

        REWSCol2.appendChild(separators[4]);

        REWSCol2.appendChild(AUTOFIGHTMain);
        AUTOFIGHTMain.appendChild(AUTOFIGHTTitle);
        AUTOFIGHTMain.appendChild(AUTOFIGHTEnabledText);
        AUTOFIGHTEnabledText.appendChild(AUTOFIGHTEnabledCheck);
        AUTOFIGHTMain.appendChild(AUTOFIGHTSpecialMobsText);
        AUTOFIGHTSpecialMobsText.appendChild(AUTOFIGHTSpecialMobsCheck);
        AUTOFIGHTMain.appendChild(AUTOFIGHTPvpText);
        AUTOFIGHTPvpText.appendChild(AUTOFIGHTPvpCheck);
        AUTOFIGHTMain.appendChild(AUTOFIGHTGroupAdvantageText);
        AUTOFIGHTGroupAdvantageText.appendChild(AUTOFIGHTGroupAdvantage);

        REWSCol2.appendChild(separators[5]);


        REWSMain.appendChild(REWSCol3);

        REWSCol3.appendChild(EASYGROUPMain);
        EASYGROUPMain.appendChild(EASYGROUPTitle);
        EASYGROUPMain.appendChild(EASYGROUPEnabledText);
        EASYGROUPEnabledText.appendChild(EASYGROUPEnabledCheck);
        EASYGROUPMain.appendChild(EASYGROUPKeyText);
        EASYGROUPKeyText.appendChild(EASYGROUPKeyBind);
        EASYGROUPMain.appendChild(EASYGROUPAcceptText);
        EASYGROUPAcceptText.appendChild(EASYGROUPAcceptCheck);
        EASYGROUPMain.appendChild(EASYGROUPInviteRandomsText);
        EASYGROUPInviteRandomsText.appendChild(EASYGROUPInviteRandomsCheck);
        EASYGROUPMain.appendChild(EASYGROUPInviteEnemiesText);
        EASYGROUPInviteEnemiesText.appendChild(EASYGROUPInviteEnemiesCheck);
        EASYGROUPMain.appendChild(EASYGROUPMessageText);
        EASYGROUPMessageText.appendChild(EASYGROUPMessageCheck);

        REWSCol3.appendChild(separators[6]);

        REWSCol3.appendChild(ITEMENHANCERMain);
        ITEMENHANCERMain.appendChild(ITEMENHANCERTitle);
        ITEMENHANCERMain.appendChild(ITEMENHANCEREnabledText);
        ITEMENHANCEREnabledText.appendChild(ITEMENHANCEREnabledCheck);
        ITEMENHANCERMain.appendChild(ITEMENHANCERItemNameText);
        ITEMENHANCERMain.appendChild(ITEMENHANCERItemNumberText);
        ITEMENHANCERItemNumberText.appendChild(ITEMENHANCERItemNumber);
        ITEMENHANCERMain.appendChild(ITEMENHANCERUseUniqueItemsText);
        ITEMENHANCERUseUniqueItemsText.appendChild(ITEMENHANCERUseUniqueItemsCheck);
        ITEMENHANCERMain.appendChild(ITEMENHANCEREmptySpaceText);
        ITEMENHANCEREmptySpaceText.appendChild(ITEMENHANCEREmptySpaceInput);
        ITEMENHANCERMain.appendChild(ITEMENHANCERItemsUsedText);
        ITEMENHANCERMain.appendChild(ITEMENHANCERItemsUsedButton);

        REWSCol3.appendChild(separators[7]);
    }
    REWSConstructor();


    let hasMoved = false;
    function handleDrag(event) {
        event.preventDefault();
        let initialX = event.clientX;
        let initialY = event.clientY;

        function moveBox(event) {
            let deltaX = event.clientX - initialX;
            let deltaY = event.clientY - initialY;
            REWSMain.style.left = `${REWSMain.offsetLeft + deltaX}px`;
            REWSMain.style.top = `${REWSMain.offsetTop + deltaY}px`;

            if (initialX !== event.clientX || initialY !== event.clientY) {
                hasMoved = true;
            }

            initialX = event.clientX;
            initialY = event.clientY;
        }

        function stopDrag() {
            document.removeEventListener('mousemove', moveBox);
            document.removeEventListener('mouseup', stopDrag);

            localStorage.setItem('REWS_MAIN.x', REWSMain.style.left);
            localStorage.setItem('REWS_MAIN.y', REWSMain.style.top);
        }

        document.addEventListener('mousemove', moveBox);
        document.addEventListener('mouseup', stopDrag);

    }
    REWSTop.addEventListener('mousedown', handleDrag);



    let REWSVisible = localStorage.getItem('REWS_VISIBILITY');
    if (REWSVisible === 'visible') {
        REWSCol1.style.display = 'flex';
        REWSCol2.style.display = 'flex';
        REWSCol3.style.display = 'flex';
        REWSTop.style.width = '740px';
        REWSTop.style.border = '0px solid silver';
        REWSMain.style.width = '750px';
        REWSMain.style.border = '1px solid silver';
    }
    else {
        REWSCol1.style.display = 'none';
        REWSCol2.style.display = 'none';
        REWSCol3.style.display = 'none';
        REWSTop.style.width = '160px';
        REWSTop.style.border = '1px solid silver';
        REWSMain.style.width = '170px';
        REWSMain.style.border = '0px solid silver';
    }
    function REWSToggleVisibility() {
        if (!hasMoved) {
            if (REWSVisible === 'visible') {
                REWSCol1.style.display = 'none';
                REWSCol2.style.display = 'none';
                REWSCol3.style.display = 'none';
                REWSTop.style.width = '160px';
                REWSTop.style.border = '1px solid silver';
                REWSMain.style.width = '170px';
                REWSMain.style.border = '0px solid silver';
                REWSVisible = 'hidden';
            }
            else {
                REWSCol1.style.display = 'flex';
                REWSCol2.style.display = 'flex';
                REWSCol3.style.display = 'flex';
                REWSTop.style.width = '740px';
                REWSTop.style.border = '0px solid silver';
                REWSMain.style.width = '750px';
                REWSMain.style.border = '1px solid silver';
                REWSVisible = 'visible';
            }
            localStorage.setItem('REWS_VISIBILITY', REWSVisible);
        }
        else {
            hasMoved = false;
        }
    }
    REWSTop.addEventListener('click', REWSToggleVisibility);


    function SAFEATTACKToggleEnabled() {
        if (SAFEATTACKEnabledCheck.checked) {
            localStorage.setItem('REWS_SAFEATTACK.check', 'ON');
        }
        else {
            localStorage.setItem('REWS_SAFEATTACK.check', 'OFF');
        }
        this.blur();
    }
    SAFEATTACKEnabledCheck.addEventListener('change', SAFEATTACKToggleEnabled);

    function SAFEATTACKToggleMessage() {
        if (SAFEATTACKMessageCheck.checked) {
            localStorage.setItem('REWS_SAFEATTACK.messageCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_SAFEATTACK.messageCheck', 'OFF');
        }
        this.blur();
    }
    SAFEATTACKMessageCheck.addEventListener('change', SAFEATTACKToggleMessage);

    let SAFEATTACKKey = SAFEATTACKKeyBind.value;
    SAFEATTACKKeyBind.addEventListener('input', function() {
        changingSettings = true;
        if (SAFEATTACKKeyBind.value.length === 0) {
            SAFEATTACKKeyBind.placeholder = SAFEATTACKKey;
            return;
        }
        else {
            if (SAFEATTACKKeyBind.value.length === 0) {
                SAFEATTACKKeyBind.value = localStorage.getItem('REWS_SAFEATTACK.key')
            }
            else{
                SAFEATTACKKey = SAFEATTACKKeyBind.value;
                localStorage.setItem('REWS_SAFEATTACK.key', SAFEATTACKKey);
            }
            this.blur();
        }
    });


    function AUTOFIGHTToggleEnabled() {
        if (AUTOFIGHTEnabledCheck.checked) {
            localStorage.setItem('REWS_AUTOFIGHT.check', 'ON');
        }
        else {
            localStorage.setItem('REWS_AUTOFIGHT.check', 'OFF');
        }
        this.blur();
    }
    AUTOFIGHTEnabledCheck.addEventListener('change', AUTOFIGHTToggleEnabled);

    function AUTOFIGHTToggleSpecialMobs() {
        if (AUTOFIGHTSpecialMobsCheck.checked) {
            localStorage.setItem('REWS_AUTOFIGHT.specialMobsCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_AUTOFIGHT.specialMobsCheck', 'OFF');
        }
        this.blur();
    }
    AUTOFIGHTSpecialMobsCheck.addEventListener('change', AUTOFIGHTToggleSpecialMobs);

    function AUTOFIGHTTogglePvp() {
        if (AUTOFIGHTPvpCheck.checked) {
            localStorage.setItem('REWS_AUTOFIGHT.pvpCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_AUTOFIGHT.pvpCheck', 'OFF');
        }
        this.blur();
    }
    AUTOFIGHTPvpCheck.addEventListener('change', AUTOFIGHTTogglePvp);

    AUTOFIGHTGroupAdvantage.addEventListener('input', function() {
        AUTOFIGHTGroupAdvantage.value = AUTOFIGHTGroupAdvantage.value.replace(/[^0-9]/g, '');
        changingSettings = true;
        if (AUTOFIGHTGroupAdvantage.value.length === 0) {
            AUTOFIGHTGroupAdvantage.placeholder = AUTOFIGHTGroupAdvantage.value;
            return;
        }
        else {
            if (AUTOFIGHTGroupAdvantage.value.length === 0) {
                AUTOFIGHTGroupAdvantage.value = localStorage.getItem('REWS_AUTOFIGHT.groupAdvantage')
            }
            else{
                if (AUTOFIGHTGroupAdvantage.value > 10) {
                    AUTOFIGHTGroupAdvantage.value = 9;
                }
                else if (AUTOFIGHTGroupAdvantage.value < 0) {
                    AUTOFIGHTGroupAdvantage.value = 1;
                }
                localStorage.setItem('REWS_AUTOFIGHT.groupAdvantage', AUTOFIGHTGroupAdvantage.value);
            }
            this.blur();
        }
    });
    AUTOFIGHTGroupAdvantage.addEventListener('focus', function() {
        AUTOFIGHTGroupAdvantage.value = "";
    });


    function EASYGROUPToggleEnabled() {
        if (EASYGROUPEnabledCheck.checked) {
            localStorage.setItem('REWS_EASYGROUP.check', 'ON');
        }
        else {
            localStorage.setItem('REWS_EASYGROUP.check', 'OFF');
        }
        this.blur();
    }
    EASYGROUPEnabledCheck.addEventListener('change', EASYGROUPToggleEnabled);

    function EASYGROUPToggleAutoAccept() {
        if (EASYGROUPAcceptCheck.checked) {
            localStorage.setItem('REWS_EASYGROUP.acceptCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_EASYGROUP.acceptCheck', 'OFF');
        }
        this.blur();
    }
    EASYGROUPAcceptCheck.addEventListener('change', EASYGROUPToggleAutoAccept);

    function EASYGROUPToggleInviteRandoms() {
        if (EASYGROUPInviteRandomsCheck.checked) {
            localStorage.setItem('REWS_EASYGROUP.inviteRandomsCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_EASYGROUP.inviteRandomsCheck', 'OFF');
        }
        this.blur();
    }
    EASYGROUPInviteRandomsCheck.addEventListener('change', EASYGROUPToggleInviteRandoms);

    function EASYGROUPToggleInviteEnemies() {
        if (EASYGROUPInviteEnemiesCheck.checked) {
            localStorage.setItem('REWS_EASYGROUP.inviteEnemiesCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_EASYGROUP.inviteEnemiesCheck', 'OFF');
        }
        this.blur();
    }
    EASYGROUPInviteEnemiesCheck.addEventListener('change', EASYGROUPToggleInviteEnemies);

    function EASYGROUPToggleMessage() {
        if (EASYGROUPMessageCheck.checked) {
            localStorage.setItem('REWS_EASYGROUP.messageCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_EASYGROUP.messageCheck', 'OFF');
        }
        this.blur();
    }
    EASYGROUPMessageCheck.addEventListener('change', EASYGROUPToggleMessage);


    let EASYGROUPKey = EASYGROUPKeyBind.value;
    EASYGROUPKeyBind.addEventListener('input', function() {
        changingSettings = true;
        if (EASYGROUPKeyBind.value.length === 0) {
            EASYGROUPKeyBind.placeholder = EASYGROUPKey;
            return;
        }
        else {
            if (EASYGROUPKeyBind.value.length === 0) {
                EASYGROUPKeyBind.value = localStorage.getItem('REWS_EASYGROUP.key')
            }
            else{
                EASYGROUPKey = EASYGROUPKeyBind.value;
                localStorage.setItem('REWS_EASYGROUP.key', EASYGROUPKey);
            }
            this.blur();
        }
    });


    function ITEMENHANCERToggleEnabled() {
        if (ITEMENHANCEREnabledCheck.checked) {
            localStorage.setItem('REWS_ITEMENHANCER.check', 'ON');
            ITEMENHANCERFindItemDataFromInput();
        }
        else {
            localStorage.setItem('REWS_ITEMENHANCER.check', 'OFF');
        }
        this.blur();
    }
    ITEMENHANCEREnabledCheck.addEventListener('change', ITEMENHANCERToggleEnabled);

    ITEMENHANCERItemNumber.addEventListener('input', function() {
        changingSettings = true;
        if (ITEMENHANCERItemNumber.value.length === 0) {
            return;
        }
        else {
            if (ITEMENHANCERItemNumber.value.length === 0) {
                ITEMENHANCERItemNumber.value = localStorage.getItem('REWS_ITEMENHANCER.itemNumber')
            }
            else{
                localStorage.setItem('REWS_ITEMENHANCER.itemNumber', ITEMENHANCERItemNumber.value);
            }
            this.blur();
        }
    });

    function ITEMENHANCERToggleUseUniqueItems() {
        if (ITEMENHANCERUseUniqueItemsCheck.checked) {
            localStorage.setItem('REWS_ITEMENHANCER.uniqueCheck', 'ON');
        }
        else {
            localStorage.setItem('REWS_ITEMENHANCER.uniqueCheck', 'OFF');
        }
        this.blur();
    }
    ITEMENHANCERUseUniqueItemsCheck.addEventListener('change', ITEMENHANCERToggleUseUniqueItems);

    ITEMENHANCEREmptySpaceInput.addEventListener('input', function() {
        ITEMENHANCEREmptySpaceInput.value = ITEMENHANCEREmptySpaceInput.value.replace(/[^0-9]/g, '');
        changingSettings = true;
        if (ITEMENHANCEREmptySpaceInput.value.length === 0) {
            ITEMENHANCEREmptySpaceInput.placeholder = ITEMENHANCEREmptySpaceInput.value;
            return;
        }
        else {
            if (ITEMENHANCEREmptySpaceInput.value.length === 0) {
                ITEMENHANCEREmptySpaceInput.value = localStorage.getItem('REWS_ITEMENHANCER.emptySpace')
            }
            else{
                if (ITEMENHANCEREmptySpaceInput.value > 10) {
                    ITEMENHANCEREmptySpaceInput.value = 9;
                }
                else if (ITEMENHANCEREmptySpaceInput.value < 0) {
                    ITEMENHANCEREmptySpaceInput.value = 1;
                }
                localStorage.setItem('REWS_ITEMENHANCER.emptySpace', ITEMENHANCEREmptySpaceInput.value);
            }
            this.blur();
        }
    });
    ITEMENHANCEREmptySpaceInput.addEventListener('focus', function() {
        ITEMENHANCEREmptySpaceInput.value = "";
    });

    function ITEMENHANCERItemsUsedResetClick() {
        ITEMENHANCERItemsUsed = 0;
        localStorage.setItem("REWS_ITEMENHANCER.itemsUsed", ITEMENHANCERItemsUsed);
        ITEMENHANCERItemsUsedText.textContent = `Dodatek spalił ${ITEMENHANCERItemsUsed} przedmiotów`;
        this.blur();
    }
    ITEMENHANCERItemsUsedButton.addEventListener('click', ITEMENHANCERItemsUsedResetClick);

    function GROUPMANAGERWarriorInvite() {
        GROUPMANAGERInviteProfession("w");
        this.blur();
    }
    GROUPMANAGERWarriorButton.addEventListener('click', GROUPMANAGERWarriorInvite);

    function GROUPMANAGERPaladinInvite() {
        GROUPMANAGERInviteProfession("p");
        this.blur();
    }
    GROUPMANAGERPaladinButton.addEventListener('click', GROUPMANAGERPaladinInvite);

    function GROUPMANAGERBladeDancerInvite() {
        GROUPMANAGERInviteProfession("b");
        this.blur();
    }
    GROUPMANAGERBladeDancerButton.addEventListener('click', GROUPMANAGERBladeDancerInvite);

    function GROUPMANAGERMageInvite() {
        GROUPMANAGERInviteProfession("m");
        this.blur();
    }
    GROUPMANAGERMageButton.addEventListener('click', GROUPMANAGERMageInvite);

    function GROUPMANAGERHunterInvite() {
        GROUPMANAGERInviteProfession("h");
        this.blur();
    }
    GROUPMANAGERHunterButton.addEventListener('click', GROUPMANAGERHunterInvite);

    function GROUPMANAGERTrackerInvite() {
        GROUPMANAGERInviteProfession("t");
        this.blur();
    }
    GROUPMANAGERTrackerButton.addEventListener('click', GROUPMANAGERTrackerInvite);


    //CHANGING BINDS
    function REWS_ChangingBindsClick() {
        changingSettings = true;
        CONFIRMSETTINGSText.style.display = 'flex';
    }
    SAFEATTACKKeyBind.addEventListener('focus', REWS_ChangingBindsClick);
    EASYGROUPKeyBind.addEventListener('focus', REWS_ChangingBindsClick);
    AUTOFIGHTGroupAdvantage.addEventListener('focus', REWS_ChangingBindsClick);
    ITEMENHANCERItemNumber.addEventListener('focus', REWS_ChangingBindsClick);
    ITEMENHANCEREmptySpaceInput.addEventListener('focus', REWS_ChangingBindsClick);

    function REWS_ChangingBindsButton() {
        changingSettings = false;
        CONFIRMSETTINGSText.style.display = 'none';
        if (ITEMENHANCEREnabledCheck.checked) {
            ITEMENHANCERFindItemDataFromInput();
        }
        this.blur();
    }
    CONFIRMSETTINGSButton.addEventListener('click', REWS_ChangingBindsButton);



    //!!!!!VERSION.MD!!!!! NIE RUSZAĆ!
    function verifyVersion() {
        const CURRENT_REWS_VERSION = 'U23.8.17';
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/itsRews/itsRewsAddons/main/%5BRews%5D/VERSION.md',
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                console.log(latestVersion);
                if (latestVersion !== CURRENT_REWS_VERSION) {
                    message('Stara wersja panelu [REWS]. Zaktualizuj wersję.');
                    if (typeof Engine !== 'undefined' && typeof Engine.hero !== 'undefined') {
                        Engine.console.log('[REWS] Panel Dodatków: Wykryto starą wersję Panelu Dodatków". Sprawdź discord albo skontaktuj się z "itsrews" na discordzie.');
                    }
                    else {
                        log('[REWS] Panel Dodatków: Wykryto starą wersję Panelu Dodatków". Sprawdź discord albo skontaktuj się z "itsrews" na discordzie.');
                    }
                }
            }
        });
    }
    verifyVersion();




    //DODATKI
    const InterfaceNI = typeof Engine !== 'undefined' && typeof Engine.hero !== 'undefined';
    //PONIZEJ

    document.addEventListener("keyup", ev => {
        if(ev.key === SAFEATTACKKey && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(ev.target.tagName)) {
            if (changingSettings === false) {
                if (SAFEATTACKEnabledCheck.checked) {
                    const attackedPlayers = [];
                    if (InterfaceNI) {
                        Engine.others.getDrawableList().forEach((playerData) => {
                            if (playerData instanceof Object && typeof playerData === 'object') {
                                let playerDistance = Math.abs(Engine.hero.d.x - playerData.d.x) + Math.abs(Engine.hero.d.y - playerData.d.y);
                                if (playerDistance < 4) {
                                    if (Array.isArray(Engine.others.getById(playerData.d.id).onSelfEmoList) && Engine.others.getById(playerData.d.id).onSelfEmoList.length > 0) {
                                        Object.values(Engine.others.getById(playerData.d.id).onSelfEmoList).forEach((emotion) => {
                                            if (emotion.name !== 'battle' && emotion.name !== 'pvpprotected') {
                                                if (playerData.d.relation === 1 || playerData.d.relation === 3 || playerData.d.relation === 6) {
                                                    if (playerData.d.hasOwnProperty('id')) {
                                                        attackedPlayers.push({
                                                            playerNick: playerData.d.nick,
                                                            playerID: playerData.d.id,
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else {

                                        if (playerData.d.relation === 1 || playerData.d.relation === 3 || playerData.d.relation === 6) {
                                            if (playerData.d.hasOwnProperty('id')) {
                                                attackedPlayers.push({
                                                    playerNick: playerData.d.nick,
                                                    playerID: playerData.d.id,
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });

                    }
                    else {
                        Object.values(g.other).forEach((playerData) => {
                            if (playerData instanceof Object && typeof playerData === 'object') {
                                let isFightingID = playerData.id;
                                let isFightingEmoBattle = 'battle';
                                let isFightingEmoProtected = 'pvpprotected';
                                let isFightingBattle = !!$(`#other${isFightingID}`).find(`.emo-${isFightingEmoBattle}`).length;
                                let isFightingProtected = !!$(`#other${isFightingID}`).find(`.emo-${isFightingEmoProtected}`).length;
                                if (isFightingBattle === false && isFightingProtected === false) {
                                    let playerDistance = Math.abs(hero.x - playerData.x) + Math.abs(hero.y - playerData.y);
                                    if (playerDistance < 4) {
                                        if (playerData.relation === 1 || playerData.relation === 3 || playerData.relation === 6) {
                                            if (playerData.hasOwnProperty('id') && playerData.hasOwnProperty('x') && playerData.hasOwnProperty('y')) {
                                                attackedPlayers.push({
                                                    playerNick: playerData.nick,
                                                    playerID: playerData.id,
                                                });
                                            }
                                        }
                                    }
                                }

                            }
                        });
                    }

                    if (attackedPlayers.length === 0) {
                        if (SAFEATTACKMessageCheck.checked) {
                            message("Nie wykryto wrogich graczy.");
                        }
                    }
                    else {
                        if (SAFEATTACKMessageCheck.checked) {
                            message('Atakowanie wrogów w pobliżu.');
                        }
                        for (let i = 0; i < attackedPlayers.length; i++) {
                            _g(`fight&a=attack&id=${attackedPlayers[i].playerID}`);
                        }
                    }
                }
            }
        } else if(ev.key === EASYGROUPKey && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(ev.target.tagName)) {
            if (changingSettings === false) {
                if (EASYGROUPEnabledCheck.checked) {
                    let EASYGROUPPlayersAdded = 0;
                    if (InterfaceNI) {

                        if ((Engine.party && Engine.party.valueOf()) && Engine.hero.getId() !== Engine.party.getLeaderId()) {
                            if (EASYGROUPMessageCheck.checked) {
                                message("Nie jesteś dowódcą grupy.");
                            }
                        }
                        else if ((Engine.party && Engine.party.valueOf()) && Engine.party.countPartyPlayers() === 10) {
                            if (EASYGROUPMessageCheck.checked) {
                                message("Grupa posiada 10 członków.");
                            }
                        }
                        else {
                            Object.values(Engine.whoIsHere.getList()).forEach((playerData) => {
                                if (playerData instanceof Object && typeof playerData === 'object') {
                                    if (Array.isArray(Engine.others.getById(playerData.id).onSelfEmoList) && Engine.others.getById(playerData.id).onSelfEmoList.length > 0) {
                                        Object.values(Engine.others.getById(playerData.id).onSelfEmoList).forEach((emotion) => {
                                            if (emotion.name !== "battle" && emotion.name !== "stasis") {
                                                if (playerData.relation === "clan-members" || playerData.relation === "friends" || playerData.relation === "clan-friends") {
                                                    _g(`party&a=inv&id=${playerData.id}`);
                                                    EASYGROUPPlayersAdded++;
                                                }
                                                else if (EASYGROUPInviteRandomsCheck.checked && playerData.relation === "normal_players") {
                                                    let playerDistance = (Math.abs(hero.x - playerData.d.x) + Math.abs(hero.y - playerData.d.y));
                                                    if (playerDistance < 3) {
                                                        _g(`party&a=inv&id=${playerData.id}`);
                                                        EASYGROUPPlayersAdded++;
                                                    }
                                                }
                                                else if (EASYGROUPInviteEnemiesCheck.checked && playerData.relation === "clan-enemies") {
                                                    let playerDistance = (Math.abs(hero.x - playerData.d.x) + Math.abs(hero.y - playerData.d.y));
                                                    if (playerDistance < 3) {
                                                        _g(`party&a=inv&id=${playerData.id}`);
                                                        EASYGROUPPlayersAdded++;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if (playerData.relation === "clan-members" || playerData.relation === "friends" || playerData.relation === "clan-friends") {
                                            _g(`party&a=inv&id=${playerData.id}`);
                                            EASYGROUPPlayersAdded++;
                                        }
                                        else if (EASYGROUPInviteRandomsCheck.checked && playerData.relation === "normal_players") {
                                            let playerDistance = (Math.abs(hero.x - playerData.d.x) + Math.abs(hero.y - playerData.d.y));
                                            if (playerDistance < 3) {
                                                _g(`party&a=inv&id=${playerData.id}`);
                                                EASYGROUPPlayersAdded++;
                                            }
                                        }
                                        else if (EASYGROUPInviteEnemiesCheck.checked && playerData.relation === "clan-enemies") {
                                            let playerDistance = (Math.abs(hero.x - playerData.d.x) + Math.abs(hero.y - playerData.d.y));
                                            if (playerDistance < 3) {
                                                _g(`party&a=inv&id=${playerData.id}`);
                                                EASYGROUPPlayersAdded++;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                    else {
                        let EASYGROUPAllowInvite = false;
                        let EASYGROUPMembers = [];
                        if (g.party !== 0 && g.party !== false) {
                            Object.values(g.party).forEach((groupData) => {
                                if (groupData instanceof Object && typeof groupData === 'object') {
                                    EASYGROUPMembers.push(groupData.n);
                                    if (groupData.r === 1 && groupData.n === hero.nick) {
                                        EASYGROUPAllowInvite = true;
                                    }
                                }
                            });
                            if (EASYGROUPMessageCheck.checked && !EASYGROUPAllowInvite) {
                                message("Nie jesteś dowódcą grupy.");
                            }
                        }
                        else {
                            EASYGROUPAllowInvite = true;
                        }
                        if (EASYGROUPAllowInvite === true && EASYGROUPMembers.length < 10) {
                            Object.values(g.other).forEach((playerData) => {
                                if (playerData instanceof Object && typeof playerData === 'object') {
                                    let EASYGROUPnotGroupMember = true;
                                    for ( let i = 0; i < EASYGROUPMembers.length; i++) {
                                        if ( EASYGROUPMembers[i] === playerData.nick ) {
                                            EASYGROUPnotGroupMember = false;
                                        }
                                    }
                                    if (EASYGROUPnotGroupMember === true) {
                                        if (playerData.relation === 2 || playerData.relation === 4 || playerData.relation === 5) {
                                            _g(`party&a=inv&id=${playerData.id}`);
                                            EASYGROUPPlayersAdded++;
                                        }
                                        else if (EASYGROUPInviteRandomsCheck.checked && (playerData.relation === 1 || playerData.relation === 7)) {
                                            let playerDistance = (Math.abs(hero.x - playerData.x) + Math.abs(hero.y - playerData.y));
                                            if (playerDistance < 3) {
                                                _g(`party&a=inv&id=${playerData.id}`);
                                                EASYGROUPPlayersAdded++;
                                            }
                                        }
                                        else if (EASYGROUPInviteEnemiesCheck.checked && (playerData.relation === 6 || playerData.relation === 8)) {
                                            let playerDistance = (Math.abs(hero.x - playerData.x) + Math.abs(hero.y - playerData.y));
                                            if (playerDistance < 3) {
                                                _g(`party&a=inv&id=${playerData.id}`);
                                                EASYGROUPPlayersAdded++;
                                            }
                                        }
                                    }
                                }

                            });
                        }
                    }
                    if (EASYGROUPPlayersAdded === 0) {
                        if (EASYGROUPMessageCheck.checked) {
                            message(`Nie znaleziono graczy do dodania.`);
                        }
                    }
                    else {
                        if (EASYGROUPMessageCheck.checked) {
                            message(`Zaproszono graczy na mapie.`);
                        }
                    }
                }
            }
        }
    });

    if (!InterfaceNI) {
        let MAlert = mAlert;
        mAlert = function (a, b, c, d) {
            if (EASYGROUPAcceptCheck.checked) {
                if (a.includes("Czy chcesz dołączyć do drużyny gracza")) {
                    _g('party&a=accept&answer=1');
                }
                else {
                    MAlert(a, b, c, d)
                }
            }
            else {
                MAlert(a, b, c, d)
            }
        };
    }


    if (InterfaceNI) {
        API.addCallbackToEvent("open_battle_window", AUTOFIGHTFunction);
    }
    else {
        webSocket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.f && message.f.init === "1") {
                AUTOFIGHTFunction();
            }
        });
    }

    function AUTOFIGHTFunction() {
        if (AUTOFIGHTEnabledCheck.checked) {
            setTimeout(() => {
                let AUTOFIGHTAllowFight = true;
                let AUTOFIGHTEnemyWt;
                let AUTOFIGHTBothTeams;
                let AUTOFIGHTTeamOne;
                let AUTOFIGHTTeamTwo;
                try {
                    if (InterfaceNI) {
                        AUTOFIGHTEnemyWt = Object.values(Engine.battle.warriorsList).find(it => it.id < 0).wt;
                    }
                    else {
                        AUTOFIGHTEnemyWt = Object.values(g.battle.f).find(it => it.id < 0).wt;
                    }
                }
                catch {
                    if (Engine.battle.canLeaveBattle === true) {
                        return;
                    }
                }
                if (!AUTOFIGHTSpecialMobsCheck.checked) {
                    if ((AUTOFIGHTEnemyWt >= 30 && AUTOFIGHTEnemyWt < 40) || AUTOFIGHTEnemyWt >= 100) {
                        AUTOFIGHTAllowFight = false;
                    }
                }

                if (!AUTOFIGHTPvpCheck.checked) {
                    if (AUTOFIGHTEnemyWt === undefined) {
                        AUTOFIGHTAllowFight = false;
                    }
                }
                else {
                    if (InterfaceNI) {
                        AUTOFIGHTBothTeams = Engine.battle.getTeamIDs();
                    }
                    else {
                        Object.values(g.battle.f).forEach((fighterData) => {
                            if (fighterData instanceof Object && typeof fighterData === 'object') {
                                if (fighterData.team === 1) {
                                    AUTOFIGHTTeamOne++;
                                }
                                else {
                                    AUTOFIGHTTeamOne++;
                                }
                            }
                        });
                    }
                    if (((AUTOFIGHTBothTeams[1].length - AUTOFIGHTBothTeams[2].length) < AUTOFIGHTGroupAdvantage.value) || ((AUTOFIGHTTeamOne - AUTOFIGHTTeamTwo) < AUTOFIGHTGroupAdvantage.value)) {
                        AUTOFIGHTAllowFight = false;
                    }
                }
                if (AUTOFIGHTAllowFight) {
                    _g('fight&a=f');
                }
            }, 150);
        }
    }


    let ITEMENHANCERCommonItemList = [];
    if (localStorage.getItem('REWS_ITEMENHANCER.itemsArray') !== null) {
        try {
            ITEMENHANCERCommonItemList = JSON.parse(localStorage.getItem('REWS_ITEMENHANCER.itemsArray'));
        }
        catch {
            localStorage.setItem('REWS_ITEMENHANCER.itemsArray', "");
        }
    }
    let ITEMENHANCERCommonItemIdList = [];
    let ITEMENHANCERItemWasEnhanced = false;
    let ITEMENHANCERMessageWasShown = false;
    let ITEMENHANCERItemsUsed = 0;
    if (localStorage.getItem('REWS_ITEMENHANCER.itemsUsed') !== null) {
        ITEMENHANCERItemsUsed = localStorage.getItem('REWS_ITEMENHANCER.itemsUsed');
        ITEMENHANCERItemsUsedText.textContent = `Dodatek spalił ${ITEMENHANCERItemsUsed} przedmiotów`;
    }
    function ITEMENHANCERFindItemDataFromInput() {
        if (ITEMENHANCEREnabledCheck.checked) {
            const ITEMENHANCERFindMiddle = /#(.*?)\./;
            let ITEMENHANCERItemNumberValue = (ITEMENHANCERItemNumber.value).match(ITEMENHANCERFindMiddle);
            try {
                ITEMENHANCERItemHid = ITEMENHANCERItemNumberValue[1];
            }
            catch {
                message('Item Enhancer: Nieodpowiedni numer przedmiotu.');
            }
            let ITEMENHANCERFoundItem = false;
            if (InterfaceNI) {
                Engine.items.fetchLocationItems('g').forEach((foundItems) => {
                    if (foundItems instanceof Object && typeof foundItems === 'object') {
                        if (foundItems.hid === ITEMENHANCERItemHid) {
                            ITEMENHANCERItemName = foundItems.name;
                            ITEMENHANCERItemId = foundItems.id;
                            ITEMENHANCERFoundItem = true;
                        }
                    }
                });
            }
            else {
                Object.values(g.hItems).forEach((foundItems) => {
                    if (foundItems.hid === ITEMENHANCERItemHid) {
                        ITEMENHANCERItemName = foundItems.name;
                        ITEMENHANCERItemId = foundItems.id;
                        ITEMENHANCERFoundItem = true;
                    }
                });
            }
            if (ITEMENHANCERFoundItem === false) {
                ITEMENHANCERItemNameText.textContent = 'Nie znaleziono przedmiotu';
            }
            else {
                ITEMENHANCERItemNameText.textContent = ITEMENHANCERItemName;
            }
        }
    }

    if (InterfaceNI) {
        let ITEMENHANCERServerMessage = Engine.communication.onMessageWebSocket;
        Engine.communication.onMessageWebSocket = function(event) {
            ITEMENHANCERServerMessage.apply(this, arguments);
            if (ITEMENHANCEREnabledCheck.checked) {
                if (Engine.heroEquipment.getFreeSlots() > ITEMENHANCEREmptySpaceInput.value) {
                        const ITEMENHANCERMessageData = JSON.parse(event.data);
                        if (ITEMENHANCERMessageData.loot && ITEMENHANCERMessageData.item) {
                            const ITEMENHANCERItemKeys = Object.keys(ITEMENHANCERMessageData.item);
                            ITEMENHANCERItemKeys.forEach(itemKey => {
                                const item = ITEMENHANCERMessageData.item[itemKey];
                                if (ITEMENHANCERUseUniqueItemsCheck.checked) {
                                    if (item.hid && item.stat && (item.stat.includes("common") || item.stat.includes("unique")) && (item.cl === 1 || item.cl === 2 || item.cl === 3 || item.cl === 4 || item.cl === 5 ||
                                                                                                  item.cl === 6 || item.cl === 7 || item.cl === 8 || item.cl === 9 || item.cl === 10 ||
                                                                                                  item.cl === 11 || item.cl === 12 || item.cl === 13 || item.cl === 14 || item.cl === 29)) {
                                        if (!ITEMENHANCERCommonItemList.includes(item.hid)) {
                                            ITEMENHANCERMessageWasShown = false;
                                            ITEMENHANCERCommonItemList.push(item.hid);
                                            localStorage.setItem("REWS_ITEMENHANCER.itemsArray", JSON.stringify(ITEMENHANCERCommonItemList));
                                        }
                                    }
                                }
                                else {
                                    if (item.hid && item.stat && item.stat.includes("common") && (item.cl === 1 || item.cl === 2 || item.cl === 3 || item.cl === 4 || item.cl === 5 ||
                                                                                                  item.cl === 6 || item.cl === 7 || item.cl === 8 || item.cl === 9 || item.cl === 10 ||
                                                                                                  item.cl === 11 || item.cl === 12 || item.cl === 13 || item.cl === 14 || item.cl === 29)) {
                                        if (!ITEMENHANCERCommonItemList.includes(item.hid)) {
                                            ITEMENHANCERMessageWasShown = false;
                                            ITEMENHANCERCommonItemList.push(item.hid);
                                            localStorage.setItem("REWS_ITEMENHANCER.itemsArray", JSON.stringify(ITEMENHANCERCommonItemList));
                                        }
                                    }
                                }
                            });
                        }
                }
                else {
                    if (ITEMENHANCERCommonItemList.length === 0) {
                        if (ITEMENHANCERMessageWasShown === false) {
                            message(`Item Enhancer: Wymagane jest minimum ${ITEMENHANCEREmptySpaceInput.value} miejsc w torbie`);
                        }
                        ITEMENHANCERMessageWasShown = true;
                    }
                    else {
                        Engine.items.fetchLocationItems('g').forEach((foundItems) => {
                            if(foundItems instanceof Object && typeof foundItems === 'object') {
                                if (ITEMENHANCERCommonItemList.includes(foundItems.hid)) {
                                    ITEMENHANCERCommonItemIdList.push(foundItems.id);
                                    ITEMENHANCERItemsUsed++;
                                    localStorage.setItem("REWS_ITEMENHANCER.itemsUsed", ITEMENHANCERItemsUsed);
                                }
                            }
                        });
                        ITEMENHANCERCommonItemList = [];
                        localStorage.setItem("REWS_ITEMENHANCER.itemsArray", "");
                        if (ITEMENHANCERCommonItemIdList.length !== 0) {
                            _g('artisanship&action=open');
                            const n = ITEMENHANCERCommonItemIdList.join(',');
                            _g(`enhancement&action=progress&item=${ITEMENHANCERItemId}&ingredients=${n}`);
                            ITEMENHANCERItemWasEnhanced = true;
                        }
                        ITEMENHANCERCommonItemIdList = [];
                        setTimeout(() => {
                            Engine.crafting.triggerClose();
                        }, 500);
                        ITEMENHANCERItemsUsedText.textContent = `Dodatek przepalił ${ITEMENHANCERItemsUsed} przedmiotów.`;
                    }
                }
            }
        };
    }
    else {
        webSocket.addEventListener("message", (event) => {
            if (ITEMENHANCEREnabledCheck.checked) {
                if (g.freeSlots > ITEMENHANCEREmptySpaceInput.value) {
                    const ITEMENHANCERMessageData = JSON.parse(event.data);
                    if (ITEMENHANCERMessageData.loot && ITEMENHANCERMessageData.item) {
                        const ITEMENHANCERItemKeys = Object.keys(ITEMENHANCERMessageData.item);
                        ITEMENHANCERItemKeys.forEach(itemKey => {
                            const item = ITEMENHANCERMessageData.item[itemKey];
                            if (ITEMENHANCERUseUniqueItemsCheck.checked) {
                                if (item.hid && item.stat && (item.stat.includes("common") || item.stat.includes("unique")) && (item.cl === 1 || item.cl === 2 || item.cl === 3 || item.cl === 4 || item.cl === 5 ||
                                                                                                                                item.cl === 6 || item.cl === 7 || item.cl === 8 || item.cl === 9 || item.cl === 10 ||
                                                                                                                                item.cl === 11 || item.cl === 12 || item.cl === 13 || item.cl === 14 || item.cl === 29)) {
                                    if (!ITEMENHANCERCommonItemList.includes(item.hid)) {
                                        ITEMENHANCERMessageWasShown = false;
                                        ITEMENHANCERCommonItemList.push(item.hid);
                                        localStorage.setItem("REWS_ITEMENHANCER.itemsArray", JSON.stringify(ITEMENHANCERCommonItemList));
                                    }
                                }
                            }
                            else {
                                if (item.hid && item.stat && item.stat.includes("common") && (item.cl === 1 || item.cl === 2 || item.cl === 3 || item.cl === 4 || item.cl === 5 ||
                                                                                              item.cl === 6 || item.cl === 7 || item.cl === 8 || item.cl === 9 || item.cl === 10 ||
                                                                                              item.cl === 11 || item.cl === 12 || item.cl === 13 || item.cl === 14 || item.cl === 29)) {
                                    if (!ITEMENHANCERCommonItemList.includes(item.hid)) {
                                        ITEMENHANCERMessageWasShown = false;
                                        ITEMENHANCERCommonItemList.push(item.hid);
                                        localStorage.setItem("REWS_ITEMENHANCER.itemsArray", JSON.stringify(ITEMENHANCERCommonItemList));
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    if (ITEMENHANCERCommonItemList.length === 0) {
                        if (ITEMENHANCERMessageWasShown === false) {
                            message(`Item Enhancer: Wymagane jest minimum ${ITEMENHANCEREmptySpaceInput.value} miejsc w torbie`);
                        }
                        ITEMENHANCERMessageWasShown = true;
                    }
                    else {
                        Object.values(g.hItems).forEach((foundItems) => {
                            if (ITEMENHANCERCommonItemList.includes(foundItems.hid)) {
                                ITEMENHANCERCommonItemIdList.push(foundItems.id);
                                ITEMENHANCERItemsUsed++;
                                localStorage.setItem("REWS_ITEMENHANCER.itemsUsed", ITEMENHANCERItemsUsed);
                            }
                        });
                        ITEMENHANCERCommonItemList = [];
                        localStorage.setItem("REWS_ITEMENHANCER.itemsArray", "");
                        if (ITEMENHANCERCommonItemIdList.length !== 0) {
                            _g('artisanship&action=open');
                            const n = ITEMENHANCERCommonItemIdList.join(',');
                            setTimeout(() => { }, 100);
                            _g(`enhancement&action=progress&item=${ITEMENHANCERItemId}&ingredients=${n}`);
                            ITEMENHANCERItemWasEnhanced = true;
                            setTimeout(() => { }, 100);
                        }
                        ITEMENHANCERCommonItemIdList = [];
                        setTimeout(() => {
                            g.crafting.triggerClose();
                        }, 500);
                        ITEMENHANCERItemsUsedText.textContent = `Dodatek przepalił ${ITEMENHANCERItemsUsed} przedmiotów.`;
                    }
                }
            }
        });
    }
    ITEMENHANCERFindItemDataFromInput();

    if (InterfaceNI) {
        function GROUPMANAGERRefreshProfessions() {
            if (REWSCol1.style.display === 'flex') {
                let GROUPMANAGERWarriorCount = 0;
                let GROUPMANAGERPaladinCount = 0;
                let GROUPMANAGERBladeDancerCount = 0;
                let GROUPMANAGERMageCount = 0;
                let GROUPMANAGERHunterCount = 0;
                let GROUPMANAGERTrackerCount = 0;
                Object.values(Engine.whoIsHere.getList()).forEach((playerData) => {
                    if (playerData instanceof Object && typeof playerData === 'object') {
                        if (playerData.relation === "friends" || playerData.relation === "clan-members" || playerData.relation === "clan-friends" || playerData.relation === "groups") {
                            if (playerData.prof === "w") {
                                GROUPMANAGERWarriorCount++;
                            }
                            else if (playerData.prof === "p") {
                                GROUPMANAGERPaladinCount++;
                            }
                            else if (playerData.prof === "b") {
                                GROUPMANAGERBladeDancerCount++;
                            }
                            else if (playerData.prof === "m") {
                                GROUPMANAGERMageCount++;
                            }
                            else if (playerData.prof === "h") {
                                GROUPMANAGERHunterCount++;
                            }
                            else if (playerData.prof === "t") {
                                GROUPMANAGERTrackerCount++;
                            }
                        }
                    }
                });
                GROUPMANAGERWarriorText.textContent = `W: ${GROUPMANAGERWarriorCount} -`;
                GROUPMANAGERWarriorText.appendChild(GROUPMANAGERWarriorButton);
                GROUPMANAGERPaladinText.textContent = `P: ${GROUPMANAGERPaladinCount} -`;
                GROUPMANAGERPaladinText.appendChild(GROUPMANAGERPaladinButton);
                GROUPMANAGERBladeDancerText.textContent = `B: ${GROUPMANAGERBladeDancerCount} -`;
                GROUPMANAGERBladeDancerText.appendChild(GROUPMANAGERBladeDancerButton);
                GROUPMANAGERMageText.textContent = `M: ${GROUPMANAGERMageCount} -`;
                GROUPMANAGERMageText.appendChild(GROUPMANAGERMageButton);
                GROUPMANAGERHunterText.textContent = `H: ${GROUPMANAGERHunterCount} -`;
                GROUPMANAGERHunterText.appendChild(GROUPMANAGERHunterButton);
                GROUPMANAGERTrackerText.textContent = `T: ${GROUPMANAGERTrackerCount} -`;
                GROUPMANAGERTrackerText.appendChild(GROUPMANAGERTrackerButton);
            }
        }
        setInterval(() => GROUPMANAGERRefreshProfessions, 2500);
    }
    else {
        function GROUPMANAGERRefreshProfessions() {
            if (REWSCol1.style.display === 'flex') {
                let GROUPMANAGERWarriorCount = 0;
                let GROUPMANAGERPaladinCount = 0;
                let GROUPMANAGERBladeDancerCount = 0;
                let GROUPMANAGERMageCount = 0;
                let GROUPMANAGERHunterCount = 0;
                let GROUPMANAGERTrackerCount = 0;
                Object.values(g.other).forEach((playerData) => {
                    if (playerData instanceof Object && typeof playerData === 'object') {
                        if (playerData.relation === 2 || playerData.relation === 4 || playerData.relation === 5) {
                            if (playerData.prof === "w") {
                                GROUPMANAGERWarriorCount++;
                            }
                            else if (playerData.prof === "p") {
                                GROUPMANAGERPaladinCount++;
                            }
                            else if (playerData.prof === "b") {
                                GROUPMANAGERBladeDancerCount++;
                            }
                            else if (playerData.prof === "m") {
                                GROUPMANAGERMageCount++;
                            }
                            else if (playerData.prof === "h") {
                                GROUPMANAGERHunterCount++;
                            }
                            else if (playerData.prof === "t") {
                                GROUPMANAGERTrackerCount++;
                            }
                        }
                    }
                });
                GROUPMANAGERWarriorText.textContent = `W: ${GROUPMANAGERWarriorCount} -`;
                GROUPMANAGERWarriorText.appendChild(GROUPMANAGERWarriorButton);
                GROUPMANAGERPaladinText.textContent = `P: ${GROUPMANAGERPaladinCount} -`;
                GROUPMANAGERPaladinText.appendChild(GROUPMANAGERPaladinButton);
                GROUPMANAGERBladeDancerText.textContent = `B: ${GROUPMANAGERBladeDancerCount} -`;
                GROUPMANAGERBladeDancerText.appendChild(GROUPMANAGERBladeDancerButton);
                GROUPMANAGERMageText.textContent = `M: ${GROUPMANAGERMageCount} -`;
                GROUPMANAGERMageText.appendChild(GROUPMANAGERMageButton);
                GROUPMANAGERHunterText.textContent = `H: ${GROUPMANAGERHunterCount} -`;
                GROUPMANAGERHunterText.appendChild(GROUPMANAGERHunterButton);
                GROUPMANAGERTrackerText.textContent = `T: ${GROUPMANAGERTrackerCount} -`;
                GROUPMANAGERTrackerText.appendChild(GROUPMANAGERTrackerButton);
            }
        }
        setInterval(() => GROUPMANAGERRefreshProfessions, 2500);
    }

    function GROUPMANAGERInviteProfession(profession) {
        let GROUPMANAGERPlayerWasInvited = false;
        Object.values(Engine.whoIsHere.getList()).forEach((playerData) => {
            if (playerData instanceof Object && typeof playerData === 'object') {
                if (playerData.relation === "friends" || playerData.relation === "clan-members" || playerData.relation === "clan-friends") {
                    if ((profession && playerData.prof) === "w") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                    else if ((profession && playerData.prof) === "p") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                    else if ((profession && playerData.prof) === "b") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                    else if ((profession && playerData.prof) === "m") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                    else if ((profession && playerData.prof) === "h") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                    else if ((profession && playerData.prof) === "t") {
                        _g(`party&a=inv&id=${playerData.id}`);
                        return;
                    }
                }
            }
        });
    }
})();
