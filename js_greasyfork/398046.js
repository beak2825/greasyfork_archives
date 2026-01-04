// ==UserScript==
// @author      Deathwing
// @name        Anime Website (Custom) Buttons Plus
// @include     https://www.anime-planet.com/anime/*
// @include     http://myanimelist.net/anime/*
// @include     https://myanimelist.net/anime/*
// @include     http://myanimelist.net/manga/*
// @include     https://myanimelist.net/manga/*
// @include     https://anilist.co/*
// @include     https://kitsu.io/*
// @include     https://anidb.net/anime/*
// @exclude     https://www.anime-planet.com/anime/
// @exclude     https://www.anime-planet.com/anime/all?name=*
// @exclude     https://www.anime-planet.com/anime/recommendations/*
// @exclude     https://myanimelist.net/anime/producer*
// @description A script that adds buttons on Anime Planet, MAL, Kitsu, Anilist and aniDB for searching various sites.
// @version     2.820
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       window.onurlchange
// @namespace   https://greasyfork.org/users/18375
// @downloadURL https://update.greasyfork.org/scripts/398046/Anime%20Website%20%28Custom%29%20Buttons%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/398046/Anime%20Website%20%28Custom%29%20Buttons%20Plus.meta.js
// ==/UserScript==


var header;
var headerQueryString = '';
var outerButtonsDiv;
var host = document.location.host;
var malHost = 'myanimelist.net';
var apHost = 'www.anime-planet.com';
var alHost = 'anilist.co';
var kHost = 'kitsu.io';
var adHost = 'anidb.net';

var hideList = [];

var buttDivLeft = 0;
var autoHide = GM_getValue('setting:autoHide', false);

if (host === apHost) {
    headerQueryString = '#siteContainer h1';
    header = getElement(headerQueryString);
    main();
}
else if (host === malHost) {
    if (location.pathname.includes('/anime/')) {
        headerQueryString = 'h1.title-name strong';
    }
    else {
        headerQueryString = '.h1-title span';
    }

    header = getElement(headerQueryString);
    main();
}
else if (host === alHost) {
    headerQueryString = 'div.content h1';
    getSPAHeader(headerQueryString);
}
else if (host === kHost) {
    headerQueryString = '.media--title';
    getSPAHeader(headerQueryString);
}
else if (host === adHost) {
    headerQueryString = 'h1.anime';
    header = getElement(headerQueryString);
    main();
}

function getSPAHeader(queryString) {
    header = getElement(queryString);

    if (header) {
        main();
    }
    else {
        setTimeout(getSPAHeader, 300, queryString);
    }
}

function getElement(atr) {
    return document.querySelector(atr);
}

function addHeaderEventListeners() {
    header.addEventListener('mouseover', showEditButton);
    header.addEventListener('mouseout', hideEditButton);
}


function main() {
    var animeName;
    var reff;

    if (host === malHost) {
        if (location.pathname.includes('/anime/')) {
            animeName = getAnimeName();
        }
        else {
            animeName = getAnimeName(header.firstChild);
        }
    }
    else if (host === apHost) {
        animeName = getAnimeName();
    }
    else if (host === adHost) {
        animeName = getAnimeName().replace('Anime: ', '');
    }
    else if (host === kHost) {
        animeName = getAnimeName(header.firstElementChild);
        reff = header.firstElementChild;
        extractNameOnChange();
    }
    else if (host === alHost) {
        animeName = getAnimeName(header.firstChild);
        extractNameOnChange();
    }

    function extractNameOnChange() {
        window.addEventListener('urlchange', (el) => {
            var animeButtonsDiv = document.querySelector('.animeButtons');
            if (el.url.includes('/anime/')) {
                if (animeButtonsDiv == null) {
                    header = document.querySelector(headerQueryString);
                    header.appendChild(outerButtonsDiv);
                    addHeaderEventListeners();
                }
                else {
                    animeButtonsDiv.style.display = 'block';
                }
                if (host === kHost) {
                    reff = header.firstElementChild;
                }
                if (getAnimeName(reff) !== animeName) {
                    animeName = getAnimeName(reff);
                    var urlsObjs = setSearchURLs();
                    var animeButtons = document.querySelectorAll('.animeButton');
                    var customButtonsObjs = getAnimeButtonsFromStorage();

                    animeButtons.forEach(b => {
                        if (b.className.includes('stockButton')) {
                            b.href = urlsObjs.find(o => o.name === b.title).url;
                        }
                        else {
                            b.href = customButtonsObjs.find(o => o.title === b.title).url
                                .replace('ANIMENAME', animeName);
                        }
                    });
                }
            }
            else {
                if (animeButtonsDiv != null) {
                    animeButtonsDiv.style.display = 'none';
                }
            }
        });
    }

    function getAnimeName(ref = header) {
        return ref.textContent.replace('(TV)', '').trim();
    }

    function creteButton(icon, searchUrl, title, isStock) {
        var buttImg = createHTMLElement("img", null, null,
            [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;' }]);

        if (icon) {
            buttImg.src = icon;
        }
        else {
            buttImg.src = getIconUrl(searchUrl);
        }

        var button = createHTMLElement("a", null, 'animeButton', [{ n: 'id', v: `animeButton${makeButtonId(title)}` },
        { n: 'href', v: searchUrl }, { n: 'target', v: "_blank" }, { n: 'title', v: title }]);

        if (isStock) {
            button.className += ' stockButton';
        }

        button.appendChild(buttImg);
        return button;
    }

    //Set buttons with information
    var malSearchUrl;
    var alSearchUrl;
    var apSearchUrl;
    var kSearchUrl;
    var adSearchUrl;
    var ytSearchUrl;
    var gSearchUrl;
    var nySearchUrl;
    var ampSearchUrl;

    function setSearchURLs() {
        malSearchUrl = `http://myanimelist.net/anime.php?q=${animeName}`;
        alSearchUrl = `https://anilist.co/search/anime?search=${animeName}&sort=SEARCH_MATCH`;
        apSearchUrl = `https://www.anime-planet.com/anime/all?name=${animeName}`;
        kSearchUrl = `https://kitsu.io/anime?text=${animeName}`;
        adSearchUrl = `https://anidb.net/anime/?adb.search=${animeName}&do.search=1`;
        ytSearchUrl = `https://www.youtube.com/results?search_query=${animeName} trailer`;
        gSearchUrl = `https://google.com/search?tbm=isch&biw=&bih=&gbv=2&q=${animeName}`;
        nySearchUrl = `https://nyaa.si/?f=0&c=1_2&q=${animeName}`;
        if (host === malHost && location.pathname.includes('/anime/')) {
            ampSearchUrl = `https://animixplay.to${location.pathname}`;
        }
        else {
            ampSearchUrl = `https://animixplay.to/?q=${animeName}&sengine=mal`;
        }

        return [
            { name: malTitle, url: malSearchUrl },
            { name: alTitle, url: alSearchUrl },
            { name: apTitle, url: apSearchUrl },
            { name: kTitle, url: kSearchUrl },
            { name: adTitle, url: adSearchUrl },
            { name: ytTitle, url: ytSearchUrl },
            { name: gTitle, url: gSearchUrl },
            { name: nyTitle, url: nySearchUrl },
            { name: ampTitle, url: ampSearchUrl }
        ];
    }

    setSearchURLs();

    //MAL Button
    var icon = null;
    var malTitle = "Search MyAnimeList";

    var malButton = creteButton(icon, malSearchUrl, malTitle, true);


    //Anilist Button
    var alTitle = "Search Anilist";

    var alButton = creteButton(icon, alSearchUrl, alTitle, true);


    //Anime-Planet Button
    var apTitle = "Search Anime-Planet";

    var apButton = creteButton(icon, apSearchUrl, apTitle, true);

    //Kitsu Button
    var kTitle = "Search Kitsu";

    var kButton = creteButton(icon, kSearchUrl, kTitle, true);

    //aniDB Button
    var adTitle = "Search aniDB";

    var adButton = creteButton(icon, adSearchUrl, adTitle, true);


    //YouTube Button
    var ytTitle = 'YouTube Trailer';

    var ytButton = creteButton(icon, ytSearchUrl, ytTitle, true);


    //Google Images button
    var gTitle = "Search with Google Images";

    var giButton = creteButton(icon, gSearchUrl, gTitle, true);


    //Nyaa button
    var nyTitle = "Search Nyaa";

    var nyButton = creteButton(icon, nySearchUrl, nyTitle, true);


    //AniMixPlay button
    var ampTitle;
    if (host === malHost && location.pathname.includes('/anime/')) {
        ampTitle = "Go to AniMixPlay";
    }
    else {
        ampTitle = "Search AniMixPlay";
    }

    var ampButton = creteButton(icon, ampSearchUrl, ampTitle, true);


    //Edit button
    var ebTitle = "Edit Custom Buttons";

    var arrowButtonIcon = createHTMLElement('i', null, 'arrowButton fa fa-angle-right',
        [{ n: 'title', v: ebTitle },
        { n: 'style', v: 'font-size:16px;vertical-align: text-top;transition: all 0.3s linear 0s;left:-18px;position: relative;' }]);

    var editButtonIcon = createHTMLElement('i', null, 'editButton fa fa-edit',
        [{ n: 'title', v: ebTitle },
        { n: 'style', v: 'font-size:16px;vertical-align: text-top;transition: all 0.3s linear 0s;opacity:0;' }]);

    var editButton = createHTMLElement('div', null, null,
        [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;display:inline;' }]);

    if (!autoHide) {
        editButtonIcon.style.opacity = '1';
        arrowButtonIcon.style.opacity = '0';
    }

    addHeaderEventListeners();

    editButton.append(editButtonIcon, arrowButtonIcon);
    editButton.addEventListener('click', () => { togglePopup(true); });

    var customButtons = [];
    var customButtonsObj = [];

    if (!(GM_listValues()).includes('setting:buttonsNames')) {
        var values = GM_listValues();

        for (var i = 0; i < values.length; i++) {
            if (!values[i].includes('setting:')) {
                customButtonsObj.push(JSON.parse(GM_getValue(values[i], '{}')));
                GM_deleteValue(values[i]);
            }
        }

        setAnimeButtonsToStorage(customButtonsObj);
    }
    else {
        customButtonsObj = getAnimeButtonsFromStorage();
    }

    customButtonsObj.forEach((b) => {
        customButtons.push(creteButton(b.icon, b.url.replace('ANIMENAME', animeName), b.title));
    });

    //Add Website Buttons
    if (host === apHost) {
        appendButtons([malButton, alButton, kButton, adButton]);
        outerButtonsDiv.style.top = '6px';
        arrowButtonIcon.style.verticalAlign = '';
        editButtonIcon.style.verticalAlign = '';
    }
    else if (host === alHost) {
        appendButtons([malButton, apButton, kButton, adButton]);
        outerButtonsDiv.style.top = '8px';
    }
    else if (host === malHost) {
        appendButtons([apButton, alButton, kButton, adButton]);
        outerButtonsDiv.style.top = '2px';
    }
    else if (host === kHost) {
        appendButtons([malButton, apButton, alButton, adButton]);
        outerButtonsDiv.style.top = '2px';
        arrowButtonIcon.style.verticalAlign = '';
        editButtonIcon.style.verticalAlign = '';
    }
    else if (host === adHost) {
        appendButtons([malButton, apButton, alButton, kButton]);
        outerButtonsDiv.style.top = '9px';
    }

    function appendButtons(mainButtonsArray) {
        header.appendChild(document.createTextNode(" "));

        var allButtonsArray = mainButtonsArray.concat([ytButton, giButton, nyButton, ampButton], customButtons, editButton);
        var buttonsDiv = createHTMLElement('div', null, 'animeButtons',
            [{ n: 'style', v: 'position:relative;transition: all 0.4s cubic-bezier(0.79, 0.88, 0.16, 0.98) 0s;' }]);
        outerButtonsDiv = createHTMLElement('div', null, null,
            [{ n: 'style', v: 'display:inline-block;position:relative;overflow:hidden;' }]);

        // buttonsDiv.appendChild(allButtonsArray);
        outerButtonsDiv.appendChild(buttonsDiv);

        allButtonsArray.forEach((b) => {
            buttonsDiv.appendChild(b);
            if (b.id !== '') {
                hideList.push({
                    bId: b.id,
                    h: 'show'
                });
            }
        });

        header.appendChild(outerButtonsDiv);

        getHideList();
        hideButtons();
        addButtonPopup();
        hideEditButton();
    }

    var fontAwesome = '@import url("https://use.fontawesome.com/releases/v5.15.2/css/all.css");';
    GM_addStyle(fontAwesome);
}


function getHideList() {
    var hideListNew;

    if ((GM_listValues()).includes('hideList')) {
        hideListNew = GM_getValue('hideList', '[]');
        GM_deleteValue('hideList');
    }
    else {
        hideListNew = GM_getValue('setting:hideList', '[]');
    }

    if (!hideListNew || hideListNew === undefined || hideListNew === 'undefined') {
        hideListNew = '[]';
    }

    concatHideList(JSON.parse(hideListNew));
}

function concatHideList(v) {
    v.forEach(b => {
        var item = hideList.find(n => n.bId === b.bId);

        if (item) {
            return Object.assign(item, b);
        }

        hideList.push(b);
    });
}

function hideButtons() {
    buttDivLeft = 0;

    hideList.forEach((o) => {
        var button = getElement(`#${o.bId}`);

        if (button) {
            if (o.h === 'show') {
                button.style.display = '';
                buttDivLeft++;
            }
            else if (o.h === 'hide') {
                button.style.display = 'none';
            }
        }
    });
}

function makeButtonId(buttonName) {
    var result = 0;

    for (var i = 0; i < buttonName.length; i++) {
        result += buttonName.charCodeAt(i);
    }

    return result * buttonName.charCodeAt(buttonName.length - 1);
}


function getPopup() {
    return getElement('.buttonPopup');
}

function showEditButton() {
    var editButton = getElement('.editButton');

    if (autoHide) {
        var arrowButton = getElement('.arrowButton');
        var buttonsDiv = getElement('.animeButtons');
        buttonsDiv.style.left = '0%';
        arrowButton.style.opacity = '0';
    }

    editButton.style.opacity = '1';
}

function hideEditButton() {
    var editButton = getElement('.editButton');

    if (autoHide) {
        var buttonsDiv = getElement('.animeButtons');
        var arrowButton = getElement('.arrowButton');
        hideButtons();
        buttonsDiv.style.left = `-${buttDivLeft * 18}px`;
        arrowButton.style.opacity = '1';
    }

    editButton.style.opacity = '0';
}

function addAndCancelButtonsHandler(e) {
    var targetEl = e.target;

    if (targetEl.className === 'addButton') {
        addButtonLogic(GM_listValues());
    }
    else if (targetEl.className === 'cancelButton') {
        togglePopup(false);
    }
}

function addAndEditTabButtonsHandler(e) {
    var target = e.target;

    if (target.className.includes('Text')) {
        target = e.target.parentElement;
    }

    if (target.className === 'addTab' && target.style.color === 'white') {
        var editTab = target.parentElement.children[1];
        hideTabSection(editTab, target);
    }
    else if (target.className === 'editTab' && target.style.color === 'white') {
        var addTab = target.parentElement.firstElementChild;
        hideTabSection(addTab, target);
    }
}

function hideTabSection(toHide, toShow) {
    toHide.style.color = 'white';
    toHide.style.backgroundColor = '#d8d8d8';
    toShow.style.color = 'black';
    toShow.style.backgroundColor = 'white';

    var sectionToHide;
    var sectionToShow;

    if (toHide.className === 'addTab') {
        sectionToHide = getElement('.addSection');
        sectionToShow = getElement('.editSection');
    }
    else {
        sectionToHide = getElement('.editSection');
        sectionToShow = getElement('.addSection');
    }

    sectionToHide.style.opacity = '0';

    setTimeout(() => {
        sectionToHide.style.display = 'none';
        sectionToShow.style.display = 'flex';
        setTimeout(() => sectionToShow.style.opacity = '1', 50);
    }, 200);
}

function togglePopup(show) {
    var popUp = getPopup();

    if (show) {
        header.removeEventListener('mouseout', hideEditButton);
        popUp.style.opacity = '1';
        popUp.style.top = '50%';
    }
    else {
        header.addEventListener('mouseout', hideEditButton);
        hideEditButton();
        popUp.style.opacity = '0';
        popUp.style.top = '-100%';
    }
}

function getAnimeButtonsFromStorage() {
    return JSON.parse(GM_getValue('setting:buttonsNames', '[]'));
}

function setAnimeButtonsToStorage(buttonsNames) {
    GM_setValue('setting:buttonsNames', JSON.stringify(buttonsNames));
}

function addButtonLogic() {
    var titleField = getElement('.titleInput');
    var searchField = getElement('.URLInput');
    var iconField = getElement('.iconInput');

    var buttons = getAnimeButtonsFromStorage();

    if (titleField.value === '') {
        toggleMsgBox(true, 'Title cannot be empty!');
    }
    else if (searchField.value === '') {
        toggleMsgBox(true, 'Search URL cannot be empty!');
    }
    else if (!searchField.value.includes('ANIMENAME')) {
        toggleMsgBox(true, 'Search URL must contain ANIMENAME!');
    }
    else if (buttons.find((o) => o.title === titleField.value)) {
        toggleMsgBox(true, 'Button with the same name already exists!');
    }
    else {
        if (iconField.value === '') {
            iconField.value = getIconUrl(searchField.value);
        }

        var newButton = {
            title: titleField.value,
            url: searchField.value,
            icon: iconField.value
        };

        buttons.push(newButton);

        setAnimeButtonsToStorage(buttons);

        hideList.push({ bId: `animeButton${makeButtonId(titleField.value)}`, h: 'show' });
        GM_setValue('setting:hideList', JSON.stringify(hideList));

        toggleMsgBox(true, `Button ${titleField.value} added succsessfully! Reload to see it!`, true);

        titleField.value = '';
        searchField.value = '';
        iconField.value = '';
    }
}

function getIconUrl(fromUrl) {
    var regex = /(?:https?:\/\/)(w{0,3}\.?[\s\S]+?\.\w+)\//;
    var result = '';

    if (regex.test(fromUrl)) {
        result = `https://www.google.com/s2/favicons?domain=${fromUrl.match(regex)[1]}`;
    }

    return result;
}

function toggleMsgBox(toggle, msg, showReload) {
    var msgBox = getElement('.addMsgBox');

    if (msg) {
        msgBox.firstElementChild.textContent = msg;
    }

    if (showReload) {
        msgBox.children[1].style.display = 'inline';
    }
    else {
        msgBox.children[1].style.display = 'none';
    }

    if (toggle) {
        msgBox.style.opacity = '1';
        msgBox.style.bottom = '15%';
    }
    else {
        msgBox.style.opacity = '0';
        setTimeout(() => { msgBox.style.bottom = '150%'; }, 250);
    }
}

function hideAndDeleteHandler(e) {
    var target = e.target;
    var buttParent = target.parentElement;
    var button = getElement(`#${buttParent.className}`);

    if (target.classList.contains('removeButton') && !target.classList.contains('disabled')) {
        button.remove();
        target.parentElement.remove();
        var buttonsObjs = getAnimeButtonsFromStorage();
        buttonsObjs = buttonsObjs.filter((o) => buttParent.textContent !== o.title);
        setAnimeButtonsToStorage(buttonsObjs);
        hideList = hideList.filter(obj => obj.bId !== button.id);

        GM_setValue('setting:hideList', JSON.stringify(hideList));
    }
    else if (target.classList.contains('hideButton')) {
        if (button.style.display === 'none') {
            button.style.display = '';
            concatHideList([{ bId: button.id, h: 'show' }]);
            target.classList.replace('fa-eye-slash', 'fa-eye');
            // target.setAttribute('src', iconVisible);
        }
        else {
            button.style.display = 'none';
            concatHideList([{ bId: button.id, h: 'hide' }]);
            target.classList.replace('fa-eye', 'fa-eye-slash');
            // target.setAttribute('src', iconInvisible);
        }

        GM_setValue('setting:hideList', JSON.stringify(hideList));

        hideButtons();
    }
}

function msgButtonsHandler(e) {
    var target = e.target;

    if (target.className === 'reloadButton') {
        location.reload();
    }
    else if (target.className === 'closeButton') {
        toggleMsgBox(false);
    }
}

function settingsHandler(e) {
    var target = e.target;

    if (target.className === 'editCheckbox') {
        autoHide = target.checked;
        GM_setValue('setting:autoHide', autoHide);
    }
}

function popupClickHandler(e) {
    if (!e.target.className.includes('infoBox')) {
        var infoBoxes = document.querySelectorAll('.infoBox');
        infoBoxes.forEach(b => {
            if (b.style.opacity === '1') {
                hideInfoBox(b);
            }
        });
    }
}

function URLQuestionmarkHandler(e) {
    showInfoBox(e.target.parentElement.lastElementChild);
    var iconInfoBox = getElement('.iconInfoBox');
    hideInfoBox(iconInfoBox);
}

function iconQuestionmarkHandler(e) {
    showInfoBox(e.target.parentElement.lastElementChild);
    var URLInfoBox = getElement('.URLInfoBox');
    hideInfoBox(URLInfoBox);
}

function hideInfoBox(infoBox) {
    infoBox.style.opacity = '0';
    setTimeout(() => infoBox.style.display = 'none', 300);
}

function showInfoBox(infoBox) {
    infoBox.style.display = 'inline-block';
    setTimeout(() => infoBox.style.opacity = '1', 10);
}

function addButtonPopup() {
    var style = 'margin:auto;text-align: center;display:block;margin-bottom: 5px;';
    var popUp = createHTMLElement('div', null, 'buttonPopup',
        [{ n: 'style', v: 'position:fixed;top:-100%;left:50%;transform: translate(-50%, -50%);background-color:white;width:400px;height:560px;box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);border-radius: 8px;font-size:medium;z-index:9999;opacity:0;transition: all 0.7s cubic-bezier(0.45, -0.24, 0.43, 1.14) 0s;' }]);

    var tabs = createHTMLElement('div', null, 'popupTabs',
        [{ n: 'style', v: 'width: 100%;height: 40px;cursor: default;' }]);
    var addTab = createHTMLElement('div', null, 'addTab',
        [{ n: 'style', v: 'height: 100%;width: 50%;background-color: white;left: 50%;border-top-left-radius: 8px;text-align: center;transition: all 0.2s linear 0s;' }]);
    var textTabsStyle = 'position: relative;top: 11px;font-weight: bold;';
    var addTabText = createHTMLElement('div', 'ADD', 'addTabText',
        [{ n: 'style', v: textTabsStyle }]);
    addTab.appendChild(addTabText);

    var editTab = createHTMLElement('div', null, 'editTab',
        [{ n: 'style', v: 'top: -40px;height: 100%;width: 50%;background-color: #d8d8d8;left: 50%;position: relative;border-top-right-radius: 8px;text-align: center;color: white;transition: all 0.2s linear 0s;' }]);
    var editTabText = createHTMLElement('div', 'EDIT', 'editTabText',
        [{ n: 'style', v: textTabsStyle }]);
    editTab.appendChild(editTabText);

    tabs.append(addTab, editTab);

    var addSection = createHTMLElement('div', null, 'addSection',
        [{ n: 'style', v: 'height: calc(100% - 40px);width:100%;transition: all 0.2s linear 0s;display:flex; flex-direction: column;' }]);
    var addSectionContents = createHTMLElement('div');
    var addSectionTitle = createHTMLElement('h2', 'ADD CUSTOM BUTTON', null,
        [{ n: 'style', v: style + 'margin-top: 25px' }]);
    var title = createHTMLElement('h3', 'Title', null,
        [{ n: 'style', v: style + 'margin-top: 20px' }]);
    var titleInput = createHTMLElement('input', null, 'titleInput',
        [{ n: 'placeholder', v: 'Button title' }, { n: 'style', v: style + 'width:80%' }]);
    var URLTitle = createHTMLElement('h3', 'Search URL', null,
        [{ n: 'style', v: style + 'margin-top: 20px' }]);
    var URLQm = createHTMLElement('i', null, 'URLQuestionmark questionmark fa fa-question-circle',
        [{ n: 'style', v: 'font-size:16px;margin-left:5px;' }]);
    var infoBoxStyle = 'width: 90%;display: inline-block;position: absolute;margin-left: 10px;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.3) 0px 0px 10px;transition: opacity 0.3s linear;opacity: 0;padding: 10px;font-weight: normal;font-size: medium;';
    var URLInfoBox = createHTMLElement('div', 'To get the search URL first go the site you want to add and search the term "ANIMENAME" in the search field. Then copy the full URL (including http://) in the field below. (exaple: https://myanimelist.net/search/all?q=ANIMENAME)', 'URLInfoBox infoBox',
        [{ n: 'style', v: infoBoxStyle }]);
    URLTitle.append(URLQm, URLInfoBox);
    var URLInput = createHTMLElement('input', null, 'URLInput',
        [{ n: 'placeholder', v: 'Search URL' }, { n: 'style', v: style + 'width:80%' }]);
    var iconTitle = createHTMLElement('h3', 'Icon URL', null,
        [{ n: 'style', v: style + 'margin-top: 20px' }]);
    var iconQm = createHTMLElement('i', null, 'iconQuestionmark questionmark fa fa-question-circle',
        [{ n: 'style', v: 'font-size:16px;margin-left:5px;' }]);
    var iconInfoBox = createHTMLElement('div', null, 'iconInfoBox infoBox',
        [{ n: 'style', v: infoBoxStyle }]);
    iconInfoBox.innerHTML = '(<b>Leave empty for automatic icon parse</b>)<br />Link to icon for the button. <br />The easiest way to get it is to copy this link "https://www.google.com/s2/favicons?domain=" and place the website url at the end (example: https://www.google.com/s2/favicons?domain=myanimelist.net).';
    iconTitle.append(iconQm, iconInfoBox);
    var iconInput = createHTMLElement('input', null, 'iconInput',
        [{ n: 'placeholder', v: 'Icon URL' }, { n: 'style', v: style + 'width:80%' }]);

    var msgBoxDiv = createHTMLElement('div', null, 'addMsgBox',
        [{ n: 'style', v: 'width: 86%;position: absolute;margin-left: 7%;bottom: 150%;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.4) 0px 0px 15px;text-align: center;transition: opacity 0.2s linear;opacity:0' }]);
    var msgText = createHTMLElement('div', 'Button added succsessfully! Reload to see it!', 'addMgsText',
        [{ n: 'style', v: 'margin: 10px;' }]);
    var reloadButton = createHTMLElement('button', 'RELOAD', 'reloadButton',
        [{ n: 'style', v: 'margin: 10px;margin-right:0px;width:90px;' }]);
    var closeButton = createHTMLElement('button', 'CLOSE', 'closeButton',
        [{ n: 'style', v: 'margin: 10px;width:90px;' }]);
    msgBoxDiv.append(msgText, reloadButton, closeButton);

    var buttonsDiv = createHTMLElement('div', null, 'addAndCancelButtons',
        [{ n: 'style', v: style + 'margin-bottom: 10px;' }]);
    var addButton = createHTMLElement('button', 'ADD', 'addButton',
        [{ n: 'style', v: 'width:90px;margin:5px' }]);
    var cancelButton = createHTMLElement('button', 'CANCEL', 'cancelButton',
        [{ n: 'style', v: 'width:90px;margin:5px' }]);

    var editSection = createHTMLElement('div', null, 'editSection',
        [{ n: 'style', v: 'display: flex;flex-direction: column;height: calc(100% - 40px);width:100%;display:none;transition: all 0.2s linear 0s;' }]);
    var editSectionTitle = createHTMLElement('h2', 'EDIT CUSTOM BUTTONS', null,
        [{ n: 'style', v: style + 'margin-top: 25px' }]);
    var animeButtonsList = createHTMLElement('ul', null, 'buttonsList',
        [{ n: 'style', v: 'list-style: none;margin-top: 25px;padding-left: 40px;overflow: hidden;overflow-y: auto;flex: 1 1 auto;' }]);
    var animeButtons = document.querySelectorAll('.animeButton');

    var settingsDiv = createHTMLElement('div', null, 'settingsDiv',
        [{ n: 'style', v: 'padding: 0px 30px;' }]);
    var hideEditCheckbox = createHTMLElement('input', null, 'editCheckbox',
        [{ n: 'id', v: 'editCheckbox' }, { n: 'type', v: 'checkbox' }, { n: 'value', v: 'editCheckbox' }]);

    if (autoHide) {
        hideEditCheckbox.setAttribute('checked', true);
    }

    var hideEditCheckboxLabel = createHTMLElement('label', 'Auto hide buttons (show on mouseover)', null,
        [{ n: 'for', v: 'editCheckbox' }, { n: 'style', v: 'padding-left:5px;' }]);
    var exportButton = createHTMLElement('button', 'Export custom buttons.', null,
        [{ n: 'style', v: 'padding: 4px;' }]);
    exportButton.addEventListener('click', exportCustomButtons);

    var imortExportDiv = createHTMLElement('div', null, null,
        [{ n: 'style', v: 'display: flex;justify-content: space-evenly;margin: 7px 0;' }]);
    var importInput = createHTMLElement('input', null, null,
        [{ n: 'type', v: 'file' }, { n: 'accept', v: 'application/json' }, { n: 'style', v: 'display: none;' }]);
    importInput.addEventListener('change', onImportChange);
    var importButton = createHTMLElement('button', 'Import custom buttons.', null,
        [{ n: 'style', v: 'padding: 4px;' }]);
    importButton.addEventListener('click', () => { importInput.click(); });
    imortExportDiv.append(exportButton, importButton, importInput);

    settingsDiv.append(hideEditCheckbox, hideEditCheckboxLabel, imortExportDiv);

    var editButtonsDiv = createHTMLElement('div', null, 'addAndCancelButtons',
        [{ n: 'style', v: style + 'margin-bottom: 10px;' }]);
    var cancelButtonEdit = createHTMLElement('button', 'CLOSE', 'cancelButton',
        [{ n: 'style', v: 'width:90px;margin:5px' }]);
    editButtonsDiv.appendChild(cancelButtonEdit);

    createAndAppendEditListEntry(animeButtonsList, animeButtons);

    buttonsDiv.append(addButton, cancelButton);
    addSectionContents.append(addSectionTitle, title, titleInput, URLTitle, URLInput, iconTitle, iconInput);
    addSection.append(addSectionContents, buttonsDiv);

    editSection.append(editSectionTitle, animeButtonsList, settingsDiv, editButtonsDiv);

    popUp.append(tabs, addSection, editSection, msgBoxDiv);
    var html = getElement('html');
    html.appendChild(popUp);

    buttonsDiv.addEventListener('click', addAndCancelButtonsHandler);
    editButtonsDiv.addEventListener('click', addAndCancelButtonsHandler);
    tabs.addEventListener('click', addAndEditTabButtonsHandler);
    animeButtonsList.addEventListener('click', hideAndDeleteHandler);
    msgBoxDiv.addEventListener('click', msgButtonsHandler);
    settingsDiv.addEventListener('click', settingsHandler);
    URLQm.addEventListener('mouseover', URLQuestionmarkHandler);
    iconQm.addEventListener('mouseover', iconQuestionmarkHandler);
    popUp.addEventListener('click', popupClickHandler);
}

function createAndAppendEditListEntry(animeButtonsList, animeButtons) {
    animeButtons.forEach((b) => {
        var listEl = createHTMLElement('li', null, b.id,
            [{ n: 'style', v: 'width:90%;margin-top:5px;border-bottom-style: inset;border-bottom-width: thin;display:flex;' }]);
        var imgUrl = b.firstElementChild.getAttribute('src');
        var img = createHTMLElement('img', null, null,
            [{ n: 'src', v: imgUrl }, { n: 'style', v: 'width: 16px;height: 16px;' }]);
        var span = createHTMLElement('span', b.getAttribute('title'), null,
            [{ n: 'style', v: 'margin-left:5px;bottom: 2px;position: relative;flex: 1 1 0;' }]);
        var hideIcon = createHTMLElement('i', null, 'hideButton fa fa-eye',
            [{ n: 'title', v: 'Toggle Hide' }, { n: 'style', v: 'font-size:16px;position: relative;margin: 0 10px;' }]);
        var removeIcon = createHTMLElement('i', null, 'removeButton fa fa-trash-alt',
            [{ n: 'title', v: 'DELETE' }, { n: 'style', v: 'font-size:16px;position: relative;' }]);

        if (b.style.display === 'none') {
            hideIcon.classList.replace('fa-eye', 'fa-eye-slash');
        }

        listEl.append(img, span, hideIcon, removeIcon);

        if (b.className.includes('stockButton')) {
            removeIcon.style.color = 'lightgray';
            removeIcon.classList.add('disabled');
        }

        animeButtonsList.appendChild(listEl);
    });
}

function onImportChange(e) {
    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (e) => {
        importCustomButtons(e.target.result);
    };
}

function importCustomButtons(buttons) {
    GM_setValue('setting:buttonsNames', buttons);
    toggleMsgBox(true, 'Import successful, reload the page for it to take effect.', true);
}

function exportCustomButtons() {
    var customButtonsStr = GM_getValue('setting:buttonsNames', '[]');
    downloadJson(`custom-buttons-plus-export-${new Date().toISOString()}`, customButtonsStr);
}

function downloadJson(filename, jsonString) {
    var element = createHTMLElement('a', null, null,
        [{ n: 'href', v: 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString) },
        { n: 'download', v: `${filename}.json` }]);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function createHTMLElement(tag, textContent, className, attributes) {
    var element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    if (attributes) {
        attributes.forEach((a) => {
            element.setAttribute(a.n, a.v);
        });
    }

    return element;
}
