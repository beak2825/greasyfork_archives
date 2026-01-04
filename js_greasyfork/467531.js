// ==UserScript==
// @name         MouseHunt Cached Location Preview HUD
// @description  Keep track of what state you left an area in, because travelling just to check is jank
// @author       Unel
// @version      0.0.2
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.5.2/mousehunt-utils.js
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/94058-lyoniel
// @downloadURL https://update.greasyfork.org/scripts/467531/MouseHunt%20Cached%20Location%20Preview%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/467531/MouseHunt%20Cached%20Location%20Preview%20HUD.meta.js
// ==/UserScript==

(async function () {
  const STORAGE_TAG = `location-hud-cache/${user.user_id}`;

  const MAIN_ID = "hudPreview-main";
  const PREVIEW_ID = "hudPreview";

  const LG_COMPLEX = ["desert_oasis", "sand_dunes", "lost_city"];
  const TWISTED = "_twisted";
  const LABYKOR = ["labyrinth", "ancient_city"];

  var areaHuds = { display: true };

  function initFirebase() {
    return $.when(
      $.getScript("https://www.gstatic.com/firebasejs/4.4.0/firebase.js")
    );
  }

  const firebaseInit = await initFirebase();

  const config = {
    apiKey: "AIzaSyBP7ngIrYVBAWo9xfzM5oktUS2rVTmJmNA",
    authDomain: "mousehunthelper.firebaseapp.com",
    databaseURL: "https://mousehunthelper.firebaseio.com",
    projectId: "mousehunthelper",
    storageBucket: "mousehunthelper.appspot.com",
    messagingSenderId: "80938111604",
  };

  firebase.initializeApp(config);

  // mhh_global.firebase = firebase;
  // mhh_global.user = user;

  /**
   * Convert a template string into HTML DOM nodes
   * @param  {String} str The template string
   * @return {Node}       The template HTML
   */
  const stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body;
  };

  /**
   * Add styles to the page.
   *
   * @param {string} styles The styles to add.
   */
  const addStyles = (styles) => {
    const existingStyles = document.getElementById(
      "mh-mouseplace-custom-styles"
    );

    if (existingStyles) {
      existingStyles.innerHTML += styles;
    } else {
      const style = document.createElement("style");
      style.id = "mh-mouseplace-custom-styles";

      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  };

  addStyles(`

    .mousehuntHeaderView .menuItem.preview .dropdownContent {
        width: 757px;

        /* 10px padding + 180px scoreboard + 5px gap + 180px scoreboard + 10px padding */
        /*padding: 10px;*/

        line-height: normal;
    }

    .mousehuntHeaderView .menuItem.preview .dropdownContent a {
        display: unset;
        height: auto;
        padding: 0;
        font-variant: none;
        border-bottom: none;
    }

    .mousehuntHeaderView .menuItem.preview .dropdownContent a:hover,
    .mousehuntHeaderView .menuItem.preview .dropdownContent a:focus {
        text-decoration: underline;
        background-color: unset;
    }

    .mousehuntHeaderView .menuItem.preview .dropdownContent .hide,
    .mousehuntHeaderView .menuItem.preview .dropdownContent .hidden {
    display: none !important;
}


    /* rift_furoma */
    .mousehuntHeaderView .menuItem.preview .dropdownContent a.riftFuromaHUD-battery {
        display: inline-block;
        vertical-align: top;
        position: relative;
        height: 66px;
        padding-left: 2px;
        padding-right: 2px;
    }

.mousehuntHeaderView .menuItem.preview .dropdownContent a.valourRiftHUD-powerUp {
 height:50px !important;
 background:url(https://www.mousehuntgame.com/images/ui/hud/rift_valour/powerup.png?asset_cache_version=2) 0 0 no-repeat!important;
 -webkit-box-sizing:border-box !important;
 -moz-box-sizing:border-box !important;
 box-sizing:border-box !important;
 padding-left:50px !important;
 padding-top:10px !important;
 display:block !important;
 position:relative;
 cursor:default;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .valourRiftHUD-powerUp-level span {
    width: auto !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .valourRiftHUD-bait-image {
    display: inline-block !important;
    vertical-align: top;
    width: 34px;
    height: 34px !important;
    margin-top: 4px;
    margin-left: 3px;
    margin-right: 3px;
    border-radius: 5px;
    background-size: contain;
    position: relative !important;
    background-position: unset !important
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .valourRiftHUD-gauntletBait-image {
    position: absolute !important;
    left: 16px;
    top: 40px;
    width: 40px;
    height: 40px !important;
    border-radius: 3px;
    background-size: contain;
    background-position: unset !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .mousehuntActionButton.tiny {
    padding: 3px 5px !important;
    font-weight: 100;
    line-height: initial;
    font-size: 10px !important;
    background-position: unset !important;

}

.mousehuntHeaderView .menuItem.preview .dropdownContent .mousehuntActionButton span {
width: auto !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .riftBristleWoodsHUD-portal {
    display: inline-block !important;
    vertical-align: top;
    text-align: center;
}

/* forbidden_grove */

.mousehuntHeaderView .menuItem.preview .dropdownContent .forbiddenGroveHUD-item.rune_craft_item {
    width: 50px;
    margin: 0 15px 0 10px;
    background: url(https://www.mousehuntgame.com/images/ui/hud/forbidden_grove/rune_craft_item.png?asset_cache_version=2) no-repeat center !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .forbiddenGroveHUD-item.runic_cheese {
    width: 50px;
    background: url(https://www.mousehuntgame.com/images/ui/hud/forbidden_grove/runic_cheese.png?asset_cache_version=2) no-repeat center !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .forbiddenGroveHUD-item {
    display: block !important;
    float: left;
    height: auto !important;
    text-align: center;
    color: #111 !important;
    font-weight: 700;
    padding: 30px 0 0 !important;
}

/* sunken_city */
.mousehuntHeaderView .menuItem.preview .dropdownContent .sunkenCityHud .leftSidebar .craftingItems a {
    display: block !important;
    line-height: 32px;
    padding: 0 5px !important;
    border-radius: 1px !important;
    position: relative;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .sunkenCityHud .leftSidebar .craftingItems a span {
    display: inline !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .sunkenCityHud.in_dive .sunkenBait {
    display: none!important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .sunkenCityHud .sunkenCharms a {
    background: #333;
        background-position-x: 0%;
        background-position-y: 0%;
        background-repeat: repeat;
    border-radius: 10px 0 0 10px;
    display: block !important;
    padding: 5px 5px 3px;
    margin-bottom: 2px;
    margin-left: 5px;
    position: relative;
}

/* mousoleum */
.mousehuntHeaderView .menuItem.preview .dropdownContent .mousoleumHUD-warning {
    position: absolute !important;
    z-index: 10;
    top: 37px;
    left: 207px;
    width: 300px;
    font-size: 10px;
    padding: 5px 20px;
    border: 1px solid red;
        border-bottom-color: red;
        border-bottom-style: solid;
        border-bottom-width: 1px;
    background: #eee;
        background-position-x: 0%;
        background-position-y: 0%;
        background-repeat: repeat;
    border-radius: 5px;
    -webkit-box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
    box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
    color: #000 !important;
    text-align: center;
    display: none !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .mousoleumArmNowButton {
    width: 68px;
    height: 20px !important;
    background: url(https://www.mousehuntgame.com/images/ui/hud/mousoleum/arm_big.png?asset_cache_version=2) 0 1px no-repeat !important;
    display: block !important;
    cursor: pointer;
    position: relative;
    margin-top: 7px;
}

/* floating_islands */
.mousehuntHeaderView .menuItem.preview .dropdownContent .floatingIslandsHUD-bait-image {
    position: absolute !important;
    left: 2px;
    top: 3px;
    width: 35px;
    height: 35px !important;
    border-radius: 50%;
    background-position: 50% 50% !important;
    background-color: #fff;
    background-size: contain;
    -webkit-box-shadow: 1px 1px 1px #333 inset;
    box-shadow: 1px 1px 1px #333 inset;
    z-index: 11;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .floatingIslandsHUD-bait-craftingItem-image {
    position: absolute !important;
    left: 26px;
    top: 28px;
    width: 23px;
    height: 23px !important;
    border-radius: 50%;
    background-color: #fff;
    background-size: contain;
    -webkit-box-shadow: 1px 1px 1px #333 inset;
    box-shadow: 1px 1px 1px #333 inset;
    z-index: 12;
    background-position: 50% 50% !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .floatingIslandsHUD-inventoryBagButton {
    position: absolute !important;
    right: 127px;
    bottom: 11px;
    width: 48px;
    height: 55px !important;
    background: url(https://www.mousehuntgame.com/images/ui/hud/floating_islands/inventory_bag.png?asset_cache_version=2) 0 0 no-repeat !important;
        background-position-y: 0px;
    background-position-y: 100% !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .floatingIslandsHUD-skyMapButton {
    display: inline-block !important;
    width: 114px;
    height: 42px !important;
    background: url(https://www.mousehuntgame.com/images/ui/hud/floating_islands/launch_pad/sky_map_button_large.png?asset_cache_version=2) 0 0 no-repeat !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .floatingIslandsHUD-workshopButton {
    position: absolute !important;
    left: 50px;
    top: 24px;
    display: block !important;
    width: 160px;
    height: 145px !important;
    background: url(https://www.mousehuntgame.com/images/ui/hud/floating_islands/launch_pad/workshop_button.png?asset_cache_version=2) 0 0 no-repeat !important;
    background-size: 100%;
    -webkit-transform: scale(.9);
    -ms-transform: scale(.9);
    transform: scale(.9);
}

/* mountain */
.mousehuntHeaderView .menuItem.preview .dropdownContent .mountainHUD-phaseContainer.boulder .mountainHUD-phase-item .mousehuntArmNowButton {
    display: block !important;
    margin: 4px auto;
    background-position-x: 0 !important;
    width: 53px !important;
    height: 15px !important;
    border-radius: 5px;
    -webkit-box-shadow: 0 0 1px #000 !important;
    box-shadow: 0 0 1px #000 !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .mountainHUD-phaseContainer .mousehuntArmNowButton {
    margin-top: 4px !important;
    margin-bottom: 0 !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .mousehuntArmNowButton {
    width: 53px !important;
    height: 17px !important;
    background: url(https://www.mousehuntgame.com/images/ui/hud/train_station/phasetab_button.png?asset_cache_version=2) 0 0 no-repeat !important;
        background-position-x: 0px;
    display: inline-block !important;
    cursor: pointer;
    position: relative !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent #hudPreview-mountain .mousehuntActionButton {
    position: relative !important;
    display: inline-block !important;
    vertical-align: top;
    background: #f4e830;
        background-color: rgb(244, 232, 48);
        background-position-x: 0%;
        background-position-y: 0%;
        background-repeat: repeat;
    -webkit-box-shadow: 1px 1px 1px #eee;
    box-shadow: 1px 1px 1px #eee;
    padding: 0 20px;
    border: 1px solid #000;
        border-bottom-color: rgb(0, 0, 0);
        border-bottom-style: solid;
        border-bottom-width: 1px;
    border-radius: 5px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    text-align: center;
    color: #000 !important;
    line-height: 30px !important;
}

/* fort_rox */

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-retreat {
  position: absolute !important;
  right: 10px;
  top: 25px;
  font-size: 10px !important;
  padding: 3px 6px !important;
  color: #000 !important;
  display: none !important;
  border-radius: 3px;
  background: #ccc;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
  -webkit-box-shadow: 0 1px 20px #000 inset;
  box-shadow: 0 1px 20px #000 inset;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-lairBaitWarning {
  position: absolute !important;
  z-index: 10;
  top: 70px;
  left: 40px;
  width: 150px;
  font-size: 10px !important;
  padding: 5px 20px !important;
  border: 1px solid red;
    border-bottom-color: red;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  background: #eee;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
  border-radius: 5px;
  -webkit-box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
  box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
  color: #000 !important;
  text-align: center;
  display: none !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-powerTypeWarning {
  position: absolute !important;
  z-index: 10;
  top: 70px;
  right: 40px;
  width: 150px;
  font-size: 10px !important;
  padding: 5px 20px !important;
  border: 1px solid red;
    border-bottom-color: red;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  background: #eee;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
  border-radius: 5px;
  -webkit-box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
  box-shadow: 1px 1px 3px #333,0 0 5px #922400,0 0 30px #f8684c;
  color: #000 !important;
  text-align: center;
  display: none !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-spellTowerButton {
  display: inline-block !important;
  vertical-align: top;
  background: url(https://www.mousehuntgame.com/images/ui/hud/fort_rox/activate_tower.png?asset_cache_version=2) 0 0 no-repeat;
    background-position-x: 0px;
    background-position-y: 0px;
    background-repeat: no-repeat;
  width: 82px;
  height: 29px !important;
  margin-left: 67px;
  position: relative !important;
  z-index: 10;
  background-position: unset !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-spellContainer .mousehuntActionButton {
  position: absolute !important;
  right: 5px;
  top: 7px;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-upgradeButton {
  width: 89px;
  height: 32px !important;
  margin-top: 3px;
  display: inline-block !important;
  vertical-align: middle;
  background: url(https://www.mousehuntgame.com/images/ui/hud/fort_rox/upgradefort.png?asset_cache_version=2) 0 0 no-repeat;
    background-position-x: 0px;
    background-position-y: 0px;
    background-repeat: no-repeat;
  background-position: 0 0 !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .fortRoxHUD-enterLairButton {
  position: absolute !important;
  right: 90px;
  top: 55px;
  width: 68px;
  height: 77px !important;
  display: none;
}

/* labyrinth */
.mousehuntHeaderView .menuItem.preview .dropdownContent .labyrinthHUD-toggleLantern {
  position: absolute !important;
  right: 10px;
  top: 123px;
  width: 116px;
  height: 30px;
  background: url(https://www.mousehuntgame.com/images/ui/hud/labyrinth/lantern_states.png?asset_cache_version=2) 0 0 no-repeat;
    background-position-x: 0px;
    background-position-y: 0px;
    background-repeat: no-repeat;
  background-position: -500px -500px !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .labyrinthHUD-powerTypeWarning {
  position: absolute !important;
  z-index: 15;
  left: 185px;
  top: 50px;
  padding: 5px 50px !important;
  border: 1px solid red;
    border-bottom-color: red;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  background: #eee;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
  border-radius: 5px;
  -webkit-box-shadow: 1px 1px 3px #333,0 0 5px red;
  box-shadow: 1px 1px 3px #333,0 0 5px red;
  color: #000 !important;
  display: none !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .labyrinthHUD-itemContainer {
  left: unset !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .labyrinthHUD-toggleLantern-quantity {
  color: #fff;
}

/* iceberg */
.mousehuntHeaderView .menuItem.preview .dropdownContent .icebergHud .cutaway .drill a.buy {
  height: 33px !important;
  padding: 4px 0 0 46px !important;
  display: none !important;
}

.mousehuntHeaderView .menuItem.preview .dropdownContent .icebergHud .timeline .resetIceberg {
  display: none !important;
}

    `);

  const renderPreviewHUD = () => {
    previewTabMenuExists = document.querySelector(
      "div.menuItem.dropdown.preview.last"
    );
    if (previewTabMenuExists) {
      previewTabMenuExists.remove();
    }

    // Create menu tab.
    const menuTab = document.createElement("div");
    menuTab.classList.add("menuItem");
    menuTab.classList.add("dropdown");
    menuTab.classList.add("preview");
    menuTab.classList.add("last");

    // Register click event listener.
    menuTab.addEventListener("click", () => {
      menuTab.classList.toggle("expanded");
    });

    // Make title span.
    const menuTabTitle = document.createElement("span");
    menuTabTitle.innerText = "Preview";

    // Make arrow div.
    const menuTabArrow = document.createElement("div");
    menuTabArrow.classList.add("arrow");

    // Create menu tab dropdown.
    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdownContent");
    dropdownContent.classList.add("dropdownContent-lg");

    //Populate
    for (var each in areaHuds) {
      if (each == "display") continue;
      if (each == user.environment_type) continue;

      // dropdownContent.appendChild(stringToHTML(areaHuds[each]));

      let mainDiv = getMainDiv(each);
      let previewElem = mainDiv.querySelector(`#${PREVIEW_ID}-${each}`);
      previewElem.innerHTML = areaHuds[each].hud;

      dropdownContent.appendChild(mainDiv);

      //console.log(areaHuds[each].name, areaHuds[each].hud);
    }

    // Append menu tab title and arrow to menu tab.
    menuTab.appendChild(menuTabTitle);
    menuTab.appendChild(menuTabArrow);

    // Append menu tab dropdown to menu tab.
    menuTab.appendChild(dropdownContent);

    const tabsContainer = document.querySelector(
      ".mousehuntHeaderView-dropdownContainer"
    );
    if (!tabsContainer) {
      return;
    }

    // Append as the second to last tab.
    tabsContainer.appendChild(menuTab);
  };

  // == local storage ==
  function initPreviewHUD() {
    // var cacheJson = window.localStorage.getItem(STORAGE_TAG);
    // if (cacheJson) {
    //   try {
    //     if (!cacheJson.startsWith("{")) {
    //       // compressed data
    //       cacheJson = LZString.decompressFromUTF16(cacheJson);
    //     }
    //     areaHuds = JSON.parse(cacheJson);

    //     console.log(areaHuds);
    //   } catch (err) {
    //     console.log("Cache parse error: " + err);
    //   }
    // }

    firebase
      .database()
      .ref(STORAGE_TAG)
      .once("value", function (cacheJson) {
        areaHuds = JSON.parse(LZString.decompressFromUTF16(cacheJson.val()));
        initHooks();
        storeHud();
        renderPreviewHUD();
      });

    // STORAGE_TAG
  }

  function saveCache() {
    var jsonString = LZString.compressToUTF16(JSON.stringify(areaHuds));
    // window.localStorage.setItem(STORAGE_TAG, jsonString);
    // console.log('Saved cache: ' + jsonString);
    if (!!user.user_id) {
      firebase
        .database()
        .ref(STORAGE_TAG)
        .set(jsonString, (error) => {
          if (error) {
            console.log("Data could not be saved." + error);
          } else {
            console.log("Data saved successfully.");
          }
        });

      renderPreviewHUD();
    }
  }

  // == init hooks ==
  function initHooks() {
    // hook showEnv
    const _parentShowEnv = app.pages.TravelPage.showEnvironment;
    app.pages.TravelPage.showEnvironment = function (envType, instant) {
      updatePreview(envType);
      _parentShowEnv(envType, instant);
    };
    // hook toggleQuickMap
    const _parentToggleQuick = app.pages.TravelPage.toggleQuickMap;
    app.pages.TravelPage.toggleQuickMap = function () {
      _parentToggleQuick();
      updateVisibility();
    };
    // hook page.php
    const pageUrl = "managers/ajax/pages/page.php";
    const travelPageUrl = "travel.php";
    const travelUrl = "managers/ajax/users/changeenvironment.php";

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener("load", function () {
        if (this.responseURL.indexOf(pageUrl) != -1) {
          // page is called basically when you do anything in MH
          storeHud();
        } else if (this.responseURL.indexOf(travelUrl) != -1) {
          // travelling to new location
          storeHud();
          updatePreview(user.environment_type);
        }
      });
      originalOpen.apply(this, arguments);
    };
    // in case the window is refreshed in travel.php
    if (window.location.href.includes("travel.php")) {
      updatePreview(user.environment_type);
    }
  }

  // UI, my one love in life
  function updatePreview(envType) {
    var mainDiv = document.getElementById(MAIN_ID);
    if (!mainDiv) {
      // create the main div if it doesn't exist
      var mapContainer = document.querySelector(
        ".travelPage-mapContainer.full"
      );
      if (!mapContainer) return; // idk just return
      mainDiv = getMainDiv();
      mapContainer.parentNode.insertBefore(mainDiv, mapContainer);
    }
    const previewElem = mainDiv.querySelector(`#${PREVIEW_ID}`);
    // load cached HUD or handle based on exceptions
    const cachedHud = areaHuds[envType];
    if (LG_COMPLEX.includes(envType)) {
      previewElem.innerHTML = renderLgComplex(envType);
    } else if (user.environment_type == envType) {
      previewElem.innerHTML = getTextDiv("You are currently hunting here.");
    } else if (cachedHud) {
      previewElem.innerHTML = cachedHud.hud;
      // the frox HUD specifically sets margin-bottom to display correctly, don't override it
      previewElem.querySelector(" div").style.marginBottom =
        envType == "fort_rox" ? "" : "0px";
    } else if (cachedHud != undefined) {
      previewElem.innerHTML = getTextDiv("This location does not have a HUD.");
    } else {
      previewElem.innerHTML = getTextDiv(
        "There is no saved data for this location, travel here at least once to save the HUD."
      );
    }
  }

  // it's called LG complex, not LG simple, amirite
  function renderLgComplex(envType) {
    if (user.environment_type == envType) {
      // current location, display the inverse version
      if (document.querySelector("#hudLocationContent .corrupted")) {
        // at twisted
        return (
          areaHuds[envType].hud ||
          getTextDiv(
            "There is no saved data for the normal version of this location."
          )
        );
      } else {
        // at normal
        return (
          areaHuds[envType + TWISTED].hud ||
          getTextDiv(
            "There is no saved data for the twisted version of this location."
          )
        );
      }
    } else {
      // not at location, display both (if available)
      const normal = areaHuds[envType] || "";
      const twisted = areaHuds[envType + TWISTED] || "";
      const noData = getTextDiv(
        "There is no saved data for this location, travel here at least once to save the HUD."
      );
      return normal + twisted ? normal.hud + twisted.hud : noData;
    }
  }

  // hide the whole thing when Quick Travel is selected
  function updateVisibility() {
    const mapTab = document.querySelector(".mousehuntHud-page-tabContent.map");
    if (!mapTab) return; // idk just return
    const mainDiv = document.getElementById(MAIN_ID);
    if (!mapTab) return; // idk just return again
    // hide mainDiv if it's quick travel, and vice versa
    mainDiv.style.display = mapTab.classList.contains("quick") ? "none" : "";
  }

  function getMainDiv(environment_type) {
    environment_type = environment_type || null;

    const mainDiv = document.createElement("div");
    mainDiv.style.color = "#FFF";
    mainDiv.style.background =
      "url(https://www.mousehuntgame.com/images/ui/backgrounds/hud_bg_blue_repeating.png?asset_cache_version=2) repeat-y bottom center";
    mainDiv.style.borderRadius = "12px";
    mainDiv.style.paddingTop = "10px";
    mainDiv.style.paddingBottom = "10px";
    mainDiv.style.marginBottom = "10px";
    mainDiv.style.boxShadow = "-1px -1px 1px #ccc inset";
    mainDiv.id = MAIN_ID + (environment_type ? "-" + environment_type : "");
    // title div
    const titleDiv = document.createElement("div");
    titleDiv.style.height = "20px";
    titleDiv.style.paddingLeft = "10px";
    titleDiv.style.paddingRight = "10px";
    titleDiv.style.display = "flex";
    titleDiv.style.justifyContent = "space-between";
    titleDiv.style.alignItems = "center";
    const titleText = document.createElement("div");
    titleText.innerHTML = `<b>${
      environment_type
        ? areaHuds[environment_type].name
        : "Location HUD Preview"
    }</b>`;
    titleDiv.appendChild(titleText);
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = environment_type
      ? "Travel"
      : areaHuds.display
      ? "-"
      : "+";
    toggleBtn.style.padding = "0";
    toggleBtn.style.height = "18px";
    toggleBtn.style.width = environment_type ? "45px" : "18px";
    toggleBtn.style.borderRadius = "5px";
    toggleBtn.style.background = "#ccc";
    toggleBtn.style.border = "1px solid #999";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.addEventListener("click", (e) => {
      if (environment_type) {
        app.pages.TravelPage.travel(environment_type);
        eventRegistry.addEventListener(
          "travel_complete",
          () => {
            app.pages.TravelPage.returnToCamp();
          },
          this,
          true
        );
      } else toggleDisplay(e.target);
    });
    titleDiv.appendChild(toggleBtn);
    mainDiv.appendChild(titleDiv);
    // preview elem
    const previewElem = document.createElement("div");
    previewElem.style.paddingTop = "10px";
    previewElem.id =
      PREVIEW_ID + (environment_type ? "-" + environment_type : "");
    previewElem.style.display = areaHuds.display ? "" : "none";
    mainDiv.appendChild(previewElem);
    return mainDiv;
  }

  function getTextDiv(text) {
    return `<div style="padding-left:10px;">${text}</div>`;
  }

  // button onclicks
  function toggleDisplay(element) {
    const previewElem = document.getElementById(PREVIEW_ID);
    if (!previewElem) return;
    areaHuds.display = !areaHuds.display;
    previewElem.style.display = areaHuds.display ? "" : "none";
    element.innerHTML = areaHuds.display ? "-" : "+";
    //saveCache();
  }

  // process and store the current location HUD
  function storeHud() {
    var hudElem = document.getElementById("hudLocationContent");
    if (!hudElem) {
      console.log("failed to get HUD element");
      return;
    }
    const envType = user.environment_type;
    var hudName = envType;
    var cloneHud = hudElem.cloneNode(true);
    // disable all warning elements (wrong powertype etc)
    var activeList = cloneHud.querySelectorAll(".active");
    activeList.forEach((elem) => {
      if (elem.className.toLowerCase().indexOf("warning") != -1) {
        elem.classList.remove("active");
      }
    });
    // location-based processing
    if (LG_COMPLEX.includes(envType)) {
      cloneHud
        .querySelectorAll(".baitWarning")
        .forEach((elem) => elem.remove());
      if (cloneHud.querySelector(".corrupted")) {
        // is twisted version
        hudName = envType + TWISTED;
      }
    } else if (LABYKOR.includes(envType)) {
      // remove zokor hud if in laby, and vice versa - both areas can't coexist
      const pairEnv = LABYKOR[(LABYKOR.indexOf(envType) + 1) % 2]; // fancy mirror math that returns the counterpart
      delete areaHuds[pairEnv];
    }

    fixHud(envType, cloneHud);
    // strip mouse events and href from the cached HUD to disable clicks
    const cloneInnerHtml = cloneHud.innerHTML
      .replace(/on[a-z]+?=".+?"/g, "")
      .replace(/ href="#"/g, "");
    areaHuds[hudName] = {
      hud: cloneInnerHtml,
      name: user.environment_name,
    };
    saveCache();
  }

  // fix HUD elements that don't display properly as preview
  function fixHud(envType, hudElem) {
    var colorSelector = [];
    switch (envType) {
      case "zugzwang_tower":
        // I could fix floating elements, but I will delete them instead
        // do not try me
        hudElem
          .querySelectorAll(".zugzwangsTowerHUD-retreatButton")
          .forEach((elem) => elem.remove());
        break;
      case "sunken_city":
        colorSelector.push(".item.quantity");
        break;
      case "rift_gnawnia":
        colorSelector.push(".riftGnawniaHud-label");
        break;
      case "rift_valour":
        colorSelector.push(".valourRiftHUD-fuelContainer-armButton");
        colorSelector.push(".valourRiftHUD-powerUp-title");
        break;
      case "rift_bristle_woods":
        colorSelector.push(".riftBristleWoodsHUD-chamberSpecificTextContainer");
        break;
      case "rift_whisker_woods":
        hudElem
          .querySelectorAll(".riftWhiskerWoodsHUD-bossBaitWarning")
          .forEach((elem) => elem.remove());
        hudElem
          .querySelectorAll(".riftWhiskerWoodsHUD-baitWarning")
          .forEach((elem) => elem.remove());
        break;
    }
    colorSelector.forEach((selector) => {
      hudElem.querySelectorAll(selector).forEach((elem) => {
        elem.style.color = "white";
      });
    });
  }

  // init
  initPreviewHUD();

})();
