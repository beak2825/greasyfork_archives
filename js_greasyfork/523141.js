// ==UserScript==
// @name        F95 Latest Update Saver
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     2.2.1
// @author      Edexal
// @description Save your filters from the Latest Update Page & load them when you need it!
// @homepageURL https://sleazyfork.org/en/scripts/523141-f95-latest-update-saver
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @downloadURL https://update.greasyfork.org/scripts/523141/F95%20Latest%20Update%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/523141/F95%20Latest%20Update%20Saver.meta.js
// ==/UserScript==
(async function () {
  /*NOTE: F95 uses FontAwesome v5.15.4*/
  const storageKeys = {
    A: "Slot A",
    B: "Slot B",
    C: "Slot C",
    D: "Slot D",
    LastSlot: "LastSlot",
    CanAutoLoad: "CanAutoLoad"
  };

  Edexal.addCSS(`
        @keyframes notice {
          0% {opacity:0;}
          30% {opacity:1;}
          60% {opacity:1;}
          100% {opacity:0;};
        }
          #save-notice {
            position: fixed;
            z-index: 8;
            top: 33%;
            left: 40vw;
            background-color:#2d2d2d;
            color: yellow;
            border-radius: 10px;
            border: 2pt outset #6ce65b;
            box-shadow: -1px 0px 5px #cece92;
            width: 120px;
            padding-top:15px;
            padding-bottom:15px;
            font-size: 18px;
            font-weight:bold;
            text-align:center;
            opacity: 0;
          }
          .save-anim {
            animation: 3s notice ease-in-out;
          }
          .save-bg {
            opacity: 0.6;
          }
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotA a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotB a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotC a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotD a::before
          {
            color: orange !important;
          }

          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotA a.filter-selected::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotB a.filter-selected::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotC a.filter-selected::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotD a.filter-selected::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Load a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Save a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Delete a::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Auto-Load a::before{
            color: yellow !important;
          }
          
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotA a.has-save::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotB a.has-save::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotC a.has-save::before,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_SlotD a.has-save::before {
            color: #8cf048 !important;
          }


          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver a.filter-selected::before,
          #btn-saver_Delete a:active,
          #btn-saver_Load a:active,
          #btn-saver_Save a:active,
          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver a.auto-selected::before
          {
            background-color: #641c1c !important;
          }

          #btn-saver_Delete a:active,
          #btn-saver_Load a:active,
          #btn-saver_Save a:active {
            opacity: 0.6;
          }

          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Save a {
            border-right: 2px solid #ffe722;
          }

          #latest-page_filter-wrap #latest-page_filter-wrap_inner #filter-block_saver #btn-saver_Auto-Load a {
            border-left: 2px solid #ffe722;
          }

          div#filter-block_saver h4 {
            color: #fc9b46 !important;
          }
        `);

  function addSaveNotice() {
    let notice = Edexal.newEl({element: 'div', id: 'save-notice', text: 'Saved!'});
    document.body.append(notice);
  }

  function createSection() {
    return Edexal.newEl({element: 'div', id: 'filter-block_saver', class: ['filter-block']});
  }

  function createHeader() {
    return Edexal.newEl({element: 'h4', class: ['filter-block_title'], text: 'Saver'});
  }

  function createSectWrap() {
    return Edexal.newEl({element: 'div', class: ['filter-block_content', 'filter-block_h']});
  }

  //Utility function for creating buttons
  function createBtn(name, eventFunc, classNames) {
    let innerContainer = Edexal.newEl({
      element: 'div',
      id: `btn-saver_${name.replace(/ /, "")}`,
      class: ['filter-block_button-wrap']
    });
    let a = Edexal.newEl({element: 'a', href: "#", 'data-saver': name, class: ['filter-block_button']});
    if (!!classNames) {
      a.classList.add(...classNames);
    }
    Edexal.onEv(a, 'click', eventFunc);

    let label = Edexal.newEl({
      element: 'div',
      class: ['filter-block_button-label'],
      text: `${name[0].toUpperCase()}${name.substring(1)}`
    });

    innerContainer.append(a, label);
    return innerContainer;
  }

  function getSelectedSlot() {
    return document.querySelector("#filter-block_saver a.filter-selected");
  }

  function getSlotByName(name) {
    return document.querySelector(`[data-saver="${name}"]`);
  }

  function addHasSaveStyle(slot) {
    slot.classList.add('has-save');
  }

  function addAutoLoadStyle() {
    const autoBtn = document.querySelector('#btn-saver_Auto-Load a');
    autoBtn.classList.add('auto-selected');
  }

  function removeHasSaveStyle(slot) {
    slot.classList.remove('has-save');
  }

  function removeAutoLoadStyle() {
    const autoBtn = document.querySelector('#btn-saver_Auto-Load a');
    autoBtn.classList.remove('auto-selected');
  }

  function saveEvent(e) {
    e.preventDefault();
    let chosenSlot = getSelectedSlot();
    if (!!!chosenSlot) {
      return;
    }
    GM.setValue(chosenSlot.dataset.saver, location.href);
    addHasSaveStyle(chosenSlot);
    let saveNotice = document.querySelector('#save-notice');
    let saveNoticeBG = document.querySelector('#top');
    if (!!!saveNotice.classList.contains('save-anim')) {
      saveNotice.classList.add('save-anim');
      saveNoticeBG.classList.add('save-bg');
      setTimeout(() => {
        saveNotice.classList.remove('save-anim');
        saveNoticeBG.classList.remove('save-bg');
      }, 3000)
    }
  }

  async function loadAsyncEvent(e) {
    e.preventDefault();
    try {
      let chosenSlot = getSelectedSlot();
      if (!!chosenSlot) {
        let url = await GM.getValue(chosenSlot.dataset.saver);
        if (!!url) {
          location.href = url;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  function slotSelectEvent(e) {
    e.preventDefault();
    const classAtrribute = 'filter-selected';
    const currentSlot = getSelectedSlot();
    if (!!currentSlot && currentSlot.dataset.saver !== e.target.dataset.saver) {
      currentSlot.classList.remove(classAtrribute);
    }
    e.target.classList.add(classAtrribute);
    GM.setValue(storageKeys.LastSlot, e.target.dataset.saver);
  }

  function deleteEvent(e) {
    e.preventDefault();
    const slot = getSelectedSlot();
    if (!!slot) {
      GM.deleteValue(slot.dataset.saver);
      removeHasSaveStyle(slot);
    }
  }

  async function autoLoadEvent(e) {
    e.preventDefault();
    const canAutoLoad = await GM.getValue(storageKeys.CanAutoLoad);
    GM.setValue(storageKeys.CanAutoLoad, !!!canAutoLoad);
    if (canAutoLoad) {
      removeAutoLoadStyle();
    } else {
      addAutoLoadStyle();
    }
  }

  function createBtns(names, eventFunc, classNames) {
    let buttons = [];
    for (let i = 0; i < names.length; i++) {
      buttons.push(createBtn(names[i], eventFunc, classNames));
    }
    return buttons;
  }

  async function initHasSave() {
    let saveSlotNames = await GM.listValues();
    const excludeList = Object.keys(storageKeys).slice(4);
    saveSlotNames = saveSlotNames.filter(name => !excludeList.includes(name));
    for (const slotName of saveSlotNames) {
      let saveSlot = getSlotByName(slotName);
      addHasSaveStyle(saveSlot);
    }
  }

  async function initAutoLoad() {
    const canAutoLoad = await GM.getValue(storageKeys.CanAutoLoad);
    if (!!!canAutoLoad) {
      return;
    }
    const lastSlotName = await GM.getValue(storageKeys.LastSlot);
    if (!!lastSlotName) {
      const slot = getSlotByName(lastSlotName);
      slot.click();
      const loadBtn = document.querySelector('#btn-saver_Load a');
      loadBtn.click();
    }
    addAutoLoadStyle();

  }

  function getSaverSect() {
    let saverSect = createSection();
    let header = createHeader();
    let contentWrap = createSectWrap();
    let btnList = [createBtn('Load', loadAsyncEvent, ['fas', 'fa-upload']),
      createBtn('Save', saveEvent, ['fas', 'fa-save'])];
    btnList.push(...createBtns([storageKeys.A, storageKeys.B, storageKeys.C, storageKeys.D], slotSelectEvent, ['fas', 'fa-hdd']));
    btnList.push(createBtn('Auto-Load', autoLoadEvent, ['fas', 'fa-magic']));
    btnList.push(createBtn('Delete', deleteEvent, ['fas', 'fa-trash-alt']));
    contentWrap.append(...btnList);
    saverSect.append(header, contentWrap);

    return saverSect;
  }

  function addSaverSect() {
    let titleEl = document.querySelector('.content-block_filter-title');
    titleEl.after(getSaverSect());

    addSaveNotice();
  }

  addSaverSect();
  await initHasSave();
  await initAutoLoad();

})().catch(err => console.error(err));

