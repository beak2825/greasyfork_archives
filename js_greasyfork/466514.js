// ==UserScript==
// @name         GeoGuessr Background Replacer
// @description  Replaces the background of the geoguessr pages with your own images
// @version      2.1.17
// @author       Tyow#3742
// @match        *://*.geoguessr.com/*
// @license      MIT
// @require      https://unpkg.com/@popperjs/core@2.11.5/dist/umd/popper.min.js
// @namespace    https://greasyfork.org/users/1011193
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL https://update.greasyfork.org/scripts/466514/GeoGuessr%20Background%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/466514/GeoGuessr%20Background%20Replacer.meta.js
// ==/UserScript==

// Some code for popup adapted from blink script: https://greasyfork.org/en/scripts/438579-geoguessr-blink-mode

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

const guiHTMLHeader = `
    <div id="backgroundReplacerPopupWrapper">
      <div id="backgroundReplacerSearchWrapper">
          <div id="backgroundReplacerInputWrapper">
            <div id="backgroundReplacerPopup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; border-radius: 10px; max-height: 80vh; overflow-y: auto; width: 28em">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span id="backgroundReplacerLabel1" style="margin: 0; padding-right: 6px;">Add Home Page image</span>
                <input type="url" id="homepageInput" name="homepage" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px">
              </div>
              <span>Home Page Images:</span>
              <div id="homePageImages" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; flex-direction: column"></div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span id="backgroundReplacerLabel2" style="margin: 0; padding-right: 6px;">Add Other Page Image</span>
                <input type="url" id="otherpagesInput" name="otherpages" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px">
              </div>
              <span>Other Pages Images:</span>
              <div id="otherPagesImages" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; flex-direction: column"></div>
            </div>
            <button style="width: 59.19px" id="backgroundReplacerToggle"><picture id="backgroundReplacerTogglePicture" style="justify-content: center"><img src="https://www.svgrepo.com/show/342899/wallpaper.svg" style="width: 15px; filter: brightness(0) invert(1); opacity: 100%;"></picture></button>
        </div>
      </div>
    </div>
    `
let homePageImageList = GM_getValue("homepageImages");
let otherImages = GM_getValue("otherImages");

// Defaults
if (homePageImageList == undefined) {
    homePageImageList = [
        "https://cdn.wallpapersafari.com/6/80/9ZbpYo.jpg",
        "https://cdn.wallpapersafari.com/25/72/dtkc16.jpg",
        "https://i.imgur.com/l9K9IOq.jpg",
    ];
    GM_setValue("homepageImages", homePageImageList);
}
if (otherImages == undefined) {
    otherImages = [
        "https://imgur.com/eK23SeH.jpg",
        "https://i.imgur.com/l9K9IOq.jpg"
    ];
    GM_setValue("otherImages", otherImages);
}

let hide = false;
let styles = GM_getValue("backgroundReplacerStyles");
if (!styles) {
    hide = true;
    styles = {};
}

let homePageImgURL;

//console.log(cn("label_variantWhite__"))

const setHomePageImg = (img = false) => {
    if (img) {
        homePageImgURL = img;
    } else if(homePageImageList.length) {
        homePageImgURL = homePageImageList[Math.floor((Math.random()*homePageImageList.length))];
    } else {
        homePageImgURL = "";
    }
    //    console.log(homePageImgURL);
}

setHomePageImg();

let otherPagesImgURL;

const setOtherImg = (img = false) => {
    if (img) {
        otherPagesImgURL = img;
    } else if(otherImages.length) {
        otherPagesImgURL = otherImages[Math.floor((Math.random()*otherImages.length))];
    } else {
        otherPagesImgURL = "";
    }
}

setOtherImg();

let css = `.customBackground { bottom: 0;
    display: block;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    position: fixed;
    right: 0;
    transition: .2s ease-in-out;
    width: 100%;
    z-index: -1;
    }
    .zindex {
      z-index: -1;
    }
    .deleteIcon {
        width: 25px;
        filter: brightness(0) invert(1);
        opacity: 60%;
    }
    .backgroundImage {
        width: 20em;
    }
    .deleteButton {
        width: 59.19px;
        margin-bottom: 8em;
    }
    .backgroundImageWrapper {
        display: flex;
        padding: .5em;
    }
    .backgroundImageWrapper {
        position: relative;
        display: flex; /* To lay out the imageContainer and button side by side */
        align-items: center; /* Vertically center align the contents */
    }

    .imageContainer {
        position: relative;
        width: /* e.g., 300px; */;
        height: /* e.g., 200px; */;
        overflow: hidden;
        cursor: pointer; /* This line changes the cursor */
    }

    .backgroundImage {
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease;
        vertical-align: bottom;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .imageContainer:hover .backgroundImage {
        opacity: 0.3;
    }

    .imageContainer:hover .overlay {
        opacity: 1;
    }

    .overlay span {
        color: white;
        font-size: 18px;
    }

    /* Add some margin if you want space between the image and the button */
    .backgroundImageWrapper button {
        margin-left: 10px; /* adjust as needed */
    }


    /* You can style the text within the overlay here */
    .overlay span {
        color: white;
        font-size: 18px;
        text-align: center;
    }
    .deleteIconPicture {
       justifyContent:center;
    }

    #disableBackground {
       background: none !important
    }

    .removeBackground {
       display: none
    }

    .shadow {
       box-shadow: 0 .25rem 2.75rem rgba(32,17,46,.2),0 1.125rem 2.25rem -1.125rem rgba(0,0,0,.24),0 1.875rem 3.75rem -.625rem rgba(0,0,0,.16);
       background: rgba(0, 0, 0, 0.35);
    }

    .blurBefore::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.35);
      filter: blur(10px);
      z-index: -1;
    }

    .highscoreModification {
      border-radius: .5rem;
      background: var(--ds-color-white-10);
      backdrop-filter: blur(11px);
      padding: .5rem;
    }

    .mapInfoModification {
      padding: 1rem;
      border-radius: .5rem;
      background: var(--ds-color-white-10);
      backdrop-filter: blur(12px);
    }

    .textShadow {
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    }
    .cardModification {
        backdrop-filter: blur(12px);
    }
    .mapSelectorModification {
      background: var(--ds-color-white-10);
      backdrop-filter: blur(12px);
    }
    .highScoreTitleModification {
      background: var(--ds-color-white-10);
      backdrop-filter: blur(12px);
      border-radius: .5rem;
      padding: .5rem;
    }
    `;
GM_addStyle(css);


const showPopup = (showButton, popup) => {
    popup.style.display = 'block';
    Popper.createPopper(showButton, popup, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10],
                },
            },
        ],
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const iterativeSetTimeout = async (func, initDelay, cond) => {
    while (!cond()) {
        await delay(initDelay);
        await func();
        initDelay *= 2;
        stylesUsed.forEach(style => {
            styles[style] = cn(style);
        });
    }
};

// Caching system for styles
// Basically, we have a browser stored styles object,
// which contains the most recent classNames found by scanStyles()
// This is what the script will immediately use upon loading,
// so that there's no pause in delivering the UI to the user
// But the script will also fire off this function
// which will use the above iterativeSetTimeout function to call scanStyles
// This is so there aren't a thousand calls in quick succession.
// Once all the classNames we're looking for are found,
// it will update the local storage and the ui with the (possibly) new classnames
const stylesUsed = [
    "quick-search_wrapper__",
    "quick-search_searchInputWrapper__",
    "quick-search_searchInputButton__",
    "quick-search_iconSection__",
];

const uploadDownloadStyles = async () => {
    stylesUsed.forEach(style => {
        //        styles[style] = cn(style);
        //        console.log(style);
        //      console.log(cn(style));
    });
    await iterativeSetTimeout(scanStyles, 0.1, () => checkAllStylesFound(stylesUsed) !== undefined);
    if (hide) {
        document.querySelector("#backgroundReplacerPopupWrapper").hidden = "";
    }
    stylesUsed.forEach(style => {
        styles[style] = cn(style);
        //        console.log(style);
        //      console.log(cn(style));
    });
    setStyles();
    GM_setValue("backgroundReplacerStyles", styles);
}

const getStyle = style => {
    return styles[style];
}

const setStyles = () => {
    try {
        document.querySelector("#backgroundReplacerSearchWrapper").className = getStyle("quick-search_wrapper__");
        document.querySelector("#backgroundReplacerInputWrapper").className = getStyle("quick-search_searchInputWrapper__");
        document.querySelector("#backgroundReplacerToggle").className = getStyle("quick-search_searchInputButton__");
        document.querySelector("#backgroundReplacerLabel1").className = getStyle("label_sizeXSmall__") + getStyle("label_variantWhite__");
        document.querySelector("#backgroundReplacerLabel2").className = getStyle("label_sizeXSmall__") + getStyle("label_variantWhite__");
        document.querySelector("#backgroundReplacerTogglePicture").className = getStyle("quick-search_iconSection__");
        document.querySelectorAll(".deleteButton").forEach(el => el.className = el.className + " " + getStyle("quick-search_searchInputButton__"));
    } catch (err) {
        console.error(err);
    }
}


const insertHeaderGui = async (header, gui) => {

    header.insertAdjacentHTML('afterbegin', gui);

    // Resolve class names
    if (hide) {
        document.querySelector("#backgroundReplacerPopupWrapper").hidden = "true"
    }

    scanStyles().then(() => uploadDownloadStyles());
    setStyles();



    const showButton = document.querySelector('#backgroundReplacerToggle');
    const popup = document.querySelector('#backgroundReplacerPopup');
    popup.style.display = 'none';

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target == popup || popup.contains(target) || !document.contains(target)) return;
        if (target.matches('#backgroundReplacerToggle, #backgroundReplacerToggle *')) {
            e.preventDefault();
            showPopup(showButton, popup);
        } else {
            popup.style.display = 'none';
        }
    });
}

// Global to track whether the most recent image insertion was done on homepage
let isHomePage = location.pathname == "/";

const addShadows = () => {
    const mapSelector = document.querySelector("[class^='map-selector_selector__'")
    if (mapSelector && !mapSelector.classList.contains("mapSelectorModification")) {
        mapSelector.classList.add("mapSelectorModification")
        // mapSelector.classList.add("blurBefore")
    }
    const highscoreRoot = document.querySelector("[class^='map-highscore_root__'")
    if (highscoreRoot && !highscoreRoot.classList.contains("highscoreModification")) {
        highscoreRoot.classList.add("highscoreModification")
    }
    const mapStatsText = document.querySelectorAll("[class^='map-stats_mapStatMetricValue__'")
    if (mapStatsText) {
        for (const el of mapStatsText) {
            if (!el.classList.contains("textShadow")) {
                el.classList.add("textShadow")
            }
        }
    }
    const mapInfo = document.querySelector("[class^='map-block_mapInfo__'")
    if (mapInfo && !mapInfo.classList.contains("mapInfoModification")) {
        mapInfo.classList.add("mapInfoModification")
    }
    const howItWorks = document.querySelector("[class^='ranked-system-how-it-works-page_root__'")
    if (howItWorks && !howItWorks.classList.contains("mapInfoModification")) {
        howItWorks.classList.add("mapInfoModification")
    }
    const userStatsCards = document.querySelectorAll("[class^='user-stats-overview_card__'")
    if (userStatsCards) {
        for (const el of userStatsCards) {
            if (!el.classList.contains("cardModification")) {
                el.classList.add("cardModification")
            }
        }
    }
    const mapStats = document.querySelectorAll("[class^='map-stats_mapStat__'")
    if (mapStats) {
        for (const el of mapStats) {
            if (!el.classList.contains("cardModification")) {
                el.classList.add("cardModification")
            }
        }
    }
    const cards = document.querySelectorAll("[class^='card_card__'")
    if (cards) {
        for (const el of cards) {
            if (!el.classList.contains("cardModification")) {
                el.classList.add("cardModification")
            }
        }
    }
    // const highScoreTitle = document.querySelectorAll("[class^='headline_heading__'")
    // for (const el of highScoreTitle) {
    //     if (el.textContent == "Highscore" && !el.classList.contains("highScoreTitleModification")) {
    //         el.classList.add("highScoreTitleModification")
    //     }
    // }
    const mapsCenter = document.querySelector("[class^='maps_center__'")
    if (mapsCenter && !mapsCenter.classList.contains("mapsCenterMoved")) {
        const mapsSwitch = document.querySelector("[class^='map-highscore_switchContainer__'")
        highscoreRoot.insertBefore(mapsCenter, mapsSwitch);
        mapsCenter.classList.add("mapsCenterMoved")
    }
}

// , [class^="version4_headerWrapper__oyraB"], [class^="version4_sidebar__YO8X8"] {

const homepageModification = () => {
    const startPageWrapper = document.querySelector("[class^='version4_main__']")
    if (startPageWrapper && startPageWrapper.id !== "disableBackground") {
        startPageWrapper.id = ('disableBackground');
    }
    const startPageNewWrapper = document.querySelector("[class^=startpage_newWrapper__")
    if (startPageNewWrapper && startPageNewWrapper.style.background != "none") {
        startPageNewWrapper.style.background = "none"
    };
    const startPageStarBackground = document.querySelector("[class^='star-background_starBackgroundRotating__']")
    if (startPageStarBackground && !startPageStarBackground.classList.contains("removeBackground")) {
        startPageStarBackground.classList.add('removeBackground');
    }
}

const otherPageModification = () => {
    const backgroundWrapper = document.querySelector("[class^=background_background__")
    if (backgroundWrapper && !backgroundWrapper.classList.contains("removeBackground")) {
        backgroundWrapper.classList.add('removeBackground');
    }
}

const extraStyling = () => {
    addShadows()
    homepageModification()
    otherPageModification()
}

const insertBackground = (refresh=false) => {
    let inGame = false;
    let el = document.querySelector("[class^='background_wrapper']");
    if (!el) {
        inGame = true;
        el = document.querySelector("#__next");
        if (!el) return;
        // Because this element has multiple classes, we need to use a different selector
        const def = document.querySelector("[class*=in-game_backgroundDefault__]");
        let reg = /^in-game_backgroundDefault__/;
        if (def) {
            def.classList = Array.from(def.classList).filter(cl => !cl.match(reg));
        }
        const partyRoot = document.querySelector("[class^=party_root__]");
        if (partyRoot) {
            partyRoot.style.background = "none";
        }
        // Without this, you can see the background behind the map in a game summary

        // Purple color used by geoguessr, with .9 alpha
        const purple9 = "rgba(12 12 46 / .9)";
        // .7 alpha
        const purple7 = "rgba(12 12 46 / .7)";
        const gameSummary = document.querySelector("[class^=game-summary_container__");
        if (gameSummary) {
            gameSummary.style.opacity = "1";
            gameSummary.style.backgroundColor = purple9;
        }
        const header = document.querySelector("[class^=game-summary_playedRoundsHeader__");
        if (header) {
            header.style.backgroundColor = purple7;
        }

    }
    // We only want the zindex = -1 to exist in game settings, on other pages it's detrimental
    let img = document.querySelector('.customBackground');
    if (refresh) {
        img.remove();
        img = document.querySelector('.customBackground');
    }
    if (img) {
        if (!inGame) {
            img.classList = Array.from(img.classList).filter(cl => cl != 'zindex');
        }
        // Return if most recent insertion was in same area (homepage vs not)
        if (isHomePage == (location.pathname == "/")) {
            return;
        }
        img.remove();
        // Update isHomePage
    }
    if (!img) {
        img = document.createElement("img")
        img.classList.add("customBackground");
        if (inGame) {
            img.classList.add("zindex");
        } else {
            img.classList = Array.from(img.classList).filter(cl => cl != 'zindex');
        }
    }
    isHomePage = location.pathname == "/";
    if (isHomePage && homePageImgURL) {
        img.src = homePageImgURL;
    } else if (!isHomePage && otherPagesImgURL) {
        img.src = otherPagesImgURL;
    } else {
        return
    }
    el.appendChild(img);
}

const updateStorage = (listName, newList) => {
    GM_setValue(listName, newList);
}

const validate = (e, homepage) => {
    const patt = new RegExp(".*.(jpg|png|gif|jpeg|webp|svg|avif)","i");
    if (e.key == "Enter") {
        if (patt.test(e.target.value)) {
            if (homepage) {
                let homepageImages = GM_getValue("homepageImages");
                homepageImages.push(e.target.value);
                if (homepageImages.length == 1) {
                    homePageImgURL = homepageImages[0];
                }
                GM_setValue("homepageImages", homepageImages);
                homePageImageList = homepageImages
            } else {
                let otherImagesNew = GM_getValue("otherImages");
                otherImagesNew.push(e.target.value);
                if (otherImagesNew.length == 1) {
                    otherPagesImgURL = otherImagesNew[0];
                }
                GM_setValue("otherImages", otherImagesNew);
                otherImages = otherImagesNew;
            }
            refreshPopup();
            e.target.value = "";
        } else {
            window.alert("This link doesn't seem to be to an image file, it should end in .jpg, .jpeg, .png, .gif, .webp, .avif, or .svg");
        }
    }
}

const removeImage = (image, div, list, listName) => {
    let result = window.confirm("Are you sure you want to remove this image?");
    if (!result) {
        return
    }
    let i = list.indexOf(image);
    if (i != -1) {
        list.splice(i, 1);
        updateStorage(listName, list);
        refreshPopup();
        if (listName == "otherImages" && !list.includes(image)) {
            setOtherImg();
            updateImage(true);
        }
        if (listName == "homepageImages" && !list.includes(image)) {
            setHomePageImg();
            updateImage(true);
        }
    }
};

// displays an image in the popup
const displayImage = (image, imagesDiv, list, listName) => {
    const img = document.createElement("img");
    const div = document.createElement("div");
    div.className = "backgroundImageWrapper";
    const container = document.createElement("div");
    container.className = "imageContainer";

    img.src = image
    img.className = "backgroundImage";
    div.appendChild(container);
    container.appendChild(img);

    const deleteIcon = document.createElement("img");
    deleteIcon.className = "deleteIcon";
    deleteIcon.src = "https://www.svgrepo.com/show/493964/delete-1.svg";

    const deleteButton = document.createElement("button");
    deleteButton.className = getStyle("quick-search_searchInputButton__") + " " + "deleteButton";
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener("click", e => {
        removeImage(image, div, list, listName);
    });

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const span = document.createElement("span");
    isHomePage = location.pathname == "/";
    span.innerText = ((isHomePage && listName == "homepageImages")
                      || (!isHomePage && listName == "otherImages"))
        ? "Make current image" : "You're not on a page where this image will display";
    overlay.appendChild(span);

    container.appendChild(overlay);
    div.appendChild(deleteButton);

    imagesDiv.appendChild(div);
    container.addEventListener('click', function() {
        if (listName == "homepageImages") {
            setHomePageImg(image);
        }
        if (listName == "otherImages") {
            setOtherImg(image);
        }
        insertBackground(true);
    });
}

const refreshPopup = () => {
    if (document.querySelector("#backgroundReplacerPopupWrapper") != null && document.querySelector('[class^=header-tablet-desktop_root__]') != null) {
        let div = document.querySelector("#homePageImages");
        while (div.children.length) {
            div.removeChild(div.children[0]);
        }
        div = document.querySelector("#otherPagesImages");
        while (div.children.length) {
            div.removeChild(div.children[0]);
        }
        addPopup(true);
        const showButton = document.querySelector('#backgroundReplacerToggle');
        const popup = document.querySelector('#backgroundReplacerPopup');
        showPopup(showButton, popup);
    }
}

const addPopup = (refresh=false) => {
    if ((refresh || (document.querySelector('[class^=header-tablet-desktop_root__]') || document.querySelector('[class^=header-desktop_root__]')) && document.querySelector('#backgroundReplacerPopupWrapper') === null)) {
        if (!refresh) {
            let section = document.querySelector('[class^=header-tablet-desktop_desktopSectionRight__]')
            if (!section) section = document.querySelector('[class^=header-desktop_desktopSectionRight__]')
            insertHeaderGui(section, guiHTMLHeader)
            const homepageInput = document.querySelector("#homepageInput");
            homepageInput.addEventListener("keyup", e => {
                validate(e, true);
            });
            const otherpagesInput = document.querySelector("#otherpagesInput");
            otherpagesInput.addEventListener("keyup", e => {
                validate(e, false);
            });
        }
        const homePageImagesDiv = document.querySelector('#homePageImages');
        if (homePageImagesDiv) {
            // Loop through images and display them
            for (let i = 0; i < homePageImageList.length; i++) {
                displayImage(homePageImageList[i], homePageImagesDiv,homePageImageList, "homepageImages");
            }
        }
        const otherPagesImagesDiv = document.querySelector("#otherPagesImages");
        if (otherPagesImagesDiv) {
            // Loop through images and display them
            for (let i = 0; i < otherImages.length; i++) {
                displayImage(otherImages[i], otherPagesImagesDiv, otherImages, "otherImages");
            }
        }
    }
}

const updateImage = (refresh=false) => {
    // Don't do anything while the page is loading
    if (document.querySelector("[class^=page-loading_loading__]")) return;
    addPopup();
    insertBackground(refresh);
    extraStyling()
}



new MutationObserver(async (mutations) => {
    updateImage()
}).observe(document.body, { subtree: true, childList: true });

