// ==UserScript==
// @name        oogadex
// @match       *://idle-pixel.com/login/play*
// @grant       none
// @version     1.4
// @author      ooga  booga
// @description css bs
// @require     https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/490083/oogadex.user.js
// @updateURL https://update.greasyfork.org/scripts/490083/oogadex.meta.js
// ==/UserScript==

let settings = {
  sortBy: "tcgSortByType",
  showBy: "tcgShowAll",
  collapsed: {
    'ORE': true,
    'BAR': true,
    'SEED': true,
    'WOOD': true,
    'LEAF': true,
    'GEM': false,
    'FISH': true,
    'MONSTER': true,
    'GEAR': true,
    'LEGENDARY': true
  },
  visibility: {
    'ORE': true,
    'BAR': true,
    'SEED': true,
    'WOOD': true,
    'LEAF': true,
    'GEM': true,
    'FISH': true,
    'MONSTER': true,
    'GEAR': true,
    'LEGENDARY': true
  }
};

class OogaDex extends IdlePixelPlusPlugin {
  constructor() {
    super("oogadex", {
      about: {
        name: GM_info.script.name,
        version: GM_info.script.version,
        author: GM_info.script.author,
        description: GM_info.script.description
      }
    });
  }

  onLogin() {
    let css = document.createElement('style');
    css.innerHTML = `
      /* https://stackoverflow.com/a/43965099 */
      .collapsible-wrapper {
        display: flex;
        overflow: hidden;
      }
      .collapsible-wrapper:after {
        content: '';
        height: 280px;
        transition: height 0.2s cubic-bezier(0.5, 0, 0.5, 1), max-height 0s 0.2s cubic-bezier(0.5, 0, 0.5, 1);
        max-height: 0px;
      }
      .collapsible {
        transition: margin-bottom 0.2s cubic-bezier(0.5, 0, 0.5, 1);
        margin-bottom: 0;
        max-height: 1000000px;
        border-radius: 0 0 10pt 10pt;
        margin-bottom: 15px;
        padding-top: 20px;
        width: 100%;
      }
      .collapsed > .collapsible-wrapper > .collapsible {
        margin-bottom: -5000px;
        transition: margin-bottom 0.2s cubic-bezier(0.5, 0, 0.5, 1),
                    visibility 0s 0.2s, max-height 0s 0.2s;
        visibility: hidden;
        max-height: 0;
      }
      .collapsed > .collapsible-wrapper:after {
        height: 0;
        transition: height 0.2s linear;
        max-height: 280px;
      }

      .tcg-card-type-container {
        overflow: hidden;
        transition: 0.5s;
        /* max-height: 5000px; */
        margin-bottom: 0px;
        max-height: 10000000px;
      }

      .tcg-card-container {
        max-width: 250px;
        display: inline-flex;
      }

      .tiny {
        /* max-height: 0px; */
        margin-bottom: -2000px;
        max-height: 0px;
      }

      .tcg-card {
        min-width: 200px;
        transition: 0.5s;
        position: relative;
        z-index: 1;
      }

      .tcg-card:hover {
        translate: 0px -20px;
      }

      .tcg-holo {
        position: relative;
        /* need to offset an entire card backwards */
        translate: calc(-100% - 20px) -20px;
        z-index: 0;
      }

      .tcg-holo:hover {
        translate: calc(-100% - 20px) -60px;
      }

      .tcg-tab {
        height: 40px;
        padding: 20px;
        -webkit-font-smoothing: antialiased;
        color: white;
        text-shadow: black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px;
        display: flex;
        align-items: center;
      }

      .tcg-tab > * {
        margin-right: 15px;
        transition: 0.2s;
      }

      .collapsed > .tcg-tab .tcg-chevron {
        transform: rotate(-90deg);
      }

      .tcg-category-title {
        width: 100px;
      }

      .tcg-normal-count {
        width: 80px;
      }

      .tcg-holo-count {
        color: purple;
      }

      .tcg-complete {
        color: #89ff89;
      }

      .tcg-incomplete {
        color: #ffb9b9;
      }

      .tcg-buttons {
        display: flex;
      }

      .tcg-buttons > * {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        margin: 10px;
        border-radius: 10px;
      }

      .tcg-ghost-visibility {
        width: 20px;
        padding: 0px;
        border: none;
        box-shadow: none;
        background-color: transparent;
      }

      .tcg-no-ghost-cards .eye-open {
        display: none;
      }

      .tcg-no-ghost-cards .eye-closed {
        display: inline;
      }

      .eye-closed {
        display: none;
      }

      .tcg-card-container .tcg-ghost-card {
         filter: contrast(0.05) saturate(0) brightness(1.5);
      }

      .tcg-no-ghost-cards .tcg-ghost-card {
        display: none;
        transition: none;
      }

      .tcg-buttons > div > input[type=radio] {
        display: none;
      }

      .tcg-buttons > div > input[type=radio] + label {
        border: 1px solid black;
        border-radius: 10px;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 50px;
        background-color: buttonface;
      }

      .tcg-buttons > div > input[type=radio]:checked + label {
        background-color: #91ff91;
      }

      /* fixes single holo card behind different normal card */
      .tcg-no-ghost-cards .tcg-ghost-card.tcg-normal:has(+.tcg-holo:not(.tcg-ghost-card)) {
        visibility: hidden;
        display: block;
      }

      .tcg-card-title {
        display: flex;
        justify-content: space-between;
      }

      .tcg-card-title > span + span {
        color: white;
        text-shadow: black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px, black 0px 0px 1px;
        margin-right: 18px;
      }
    `;
    document.head.appendChild(css);

    CToe.loadCards = (raw) => {
      if(raw == "NONE") return;
      let fields = raw.split('~');
      let cards = [];
      for(let i=0; i<fields.length;){
        cards.push({
          id: fields[i++],
          ...CardData.data[fields[i]],
          name: fields[i++],
          isHolo: fields[i++] == 'true',
        });
      }
      console.log(cards);

      if(localStorage[`oogadex~${var_username}~settings`]) settings = JSON.parse(localStorage[`oogadex~${var_username}~settings`]);
      else localStorage.setItem(`oogadex~${var_username}~settings`, JSON.stringify(settings));

      let tcgContext = document.getElementById("tcg-area-context");
      tcgContext.innerHTML = `<div class='tcg-buttons'>
        <button onclick='tcgToggleAllCollapse(false)'>
          <svg style='transform: rotate(-90deg);' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M5.63574 7.75737L7.04996 6.34315L12.7068 12L7.04998 17.6568L5.63577 16.2426L9.87839 12L5.63574 7.75737Z" fill="#000000"></path>
            <path d="M12.7068 6.34315L11.2926 7.75737L15.5352 12L11.2926 16.2426L12.7068 17.6568L18.3637 12L12.7068 6.34315Z" fill="#000000"></path>
          </svg>
        </button>
        <button onclick='tcgToggleAllCollapse(true)'>
          <svg style='transform: rotate(90deg);' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M5.63574 7.75737L7.04996 6.34315L12.7068 12L7.04998 17.6568L5.63577 16.2426L9.87839 12L5.63574 7.75737Z" fill="#000000"></path>
            <path d="M12.7068 6.34315L11.2926 7.75737L15.5352 12L11.2926 16.2426L12.7068 17.6568L18.3637 12L12.7068 6.34315Z" fill="#000000"></path>
          </svg>
        </button>
        <button onclick='tcgToggleAllVisibility(true)'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
        <button onclick='tcgToggleAllVisibility(false)'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
        </button>
        <div class='hover' style='margin-left: 100px;'>
          <input type="radio" name="tcg-category" id='tcgSortByAll' onclick='tcgChangeSetting("sortBy", this.id, true);' ${settings.sortBy == 'tcgSortByAll' ? 'checked' : ''}>
          <label for='tcgSortByAll'>All</label>
        </div>
        <div class='hover'>
          <input type="radio" name="tcg-category" id='tcgSortByType' onclick='tcgChangeSetting("sortBy", this.id, true);' ${settings.sortBy == 'tcgSortByType' ? 'checked' : ''}>
          <label for='tcgSortByType'>Type</label>
        </div>
        <div class='hover'>
          <input type="radio" name="tcg-category" id='tcgSortByRarity' onclick='tcgChangeSetting("sortBy", this.id, true);' ${settings.sortBy == 'tcgSortByRarity' ? 'checked' : ''}>
          <label for='tcgSortByRarity'>Rarity</label>
        </div>
        <div class='hover' style='margin-left: 100px;'>
          <input type="radio" name="tcg-show-by" id='tcgShowAll' onclick='tcgChangeSetting("showBy", this.id, true);' ${settings.showBy == 'tcgShowAll' ? 'checked' : ''}>
          <label for='tcgShowAll'>All</label>
        </div>
        <div class='hover'>
          <input type="radio" name="tcg-show-by" id='tcgShowDuplicates' onclick='tcgChangeSetting("showBy", this.id, true);' ${settings.showBy == 'tcgShowDuplicates' ? 'checked' : ''}>
          <label for='tcgShowDuplicates'>Dupes</label>
        </div>
      </div>`;
      let categories = [...new Set(Object.entries(CardData.data).map(x => x[1].description_title))];
      if(settings.sortBy == 'tcgSortByAll') categories = ['ALL'];
      if(settings.sortBy == 'tcgSortByRarity') categories = [...new Set(Object.entries(CardData.data).map(x => x[1].rarity.toUpperCase()))];;
      for(let category of categories){
        let entries = Object.entries(CardData.data).filter(x => x[1].description_title == category).map(x => x[1]);
        if(settings.sortBy == 'tcgSortByAll') entries = Object.entries(CardData.data).map(x => x[1]);
        if(settings.sortBy == 'tcgSortByRarity') entries = Object.entries(CardData.data).filter(x => x[1].rarity.toUpperCase() == category).map(x => x[1]);
        console.log(entries);

        let box = document.createElement('div');
        box.id = `tcg-type-category-${category}`;
        box.className = `tcg-type-category`;
        if(!settings.visibility[category]) box.classList.add('tcg-no-ghost-cards');
        if(settings.collapsed[category]) box.classList.add('collapsed');
        let tab = document.createElement('div');
        let normalCount = [...new Set(cards.filter(x => !x.isHolo).map(x => x.label))].filter(x => entries.map(x => x.label).includes(x)).length;
        let holoCount = [...new Set(cards.filter(x => x.isHolo).map(x => x.label))].filter(x => entries.map(x => x.label).includes(x)).length;
        tab.innerHTML = `
          <div class='tcg-chevron'>V</div>
          <button class='tcg-ghost-visibility' onclick='tcgToggleGhostCards(this); event.stopPropagation();'>
            <svg class='eye-open' xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg class='eye-closed' xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
          <div class='tcg-category-title'>${category}</div>
          <div class='tcg-normal-count ${normalCount >= entries.length ? 'tcg-complete' : 'tcg-incomplete'}'>(${normalCount}/${entries.length})</div>
          <div class='tcg-holo-count ${holoCount >= entries.length ? 'tcg-complete' : 'tcg-incomplete'}'>(${holoCount}/${entries.length})</div>
        `;
        tab.classList.add('hover');
        tab.classList.add('tcg-tab');
        tab.onclick = function(){
          this.parentElement.classList.toggle('collapsed');
          tcgChangeSetting("collapsed", {...settings.collapsed, [this.parentElement.id.replace(/.*\-/, '')]: [...this.parentElement.classList].includes('collapsed')});
        };
        box.appendChild(tab);
        let wrapper = document.createElement('div');
        wrapper.className = 'collapsible-wrapper';
        let boxEntries = document.createElement('div');
        boxEntries.id = `tcg-${category}-entries`;
        // boxEntries.className = 'tcg-card-type-container';
        boxEntries.className = 'collapsible';
        wrapper.appendChild(boxEntries);
        box.appendChild(wrapper);
        boxEntries.style.backgroundColor = entries[0].background_css.match(/linear-gradient\((.+), [r# ]/)[1];
        if(!boxEntries.style.backgroundColor) boxEntries.style.backgroundColor = '#ffd700';
        if(boxEntries.style.backgroundColor.startsWith('rgb(')){
          tab.style.backgroundColor = 'rgba(' + boxEntries.style.backgroundColor.match(/[\d, ]+/) + ')';
          boxEntries.style.backgroundColor = 'rgba(' + boxEntries.style.backgroundColor.match(/[\d, ]+/) + ', 0.5)';
        }
        for(let entry of entries){
          let cardData = cards.filter(x => x.label == entry.label);
          if(cardData.length) console.log(entry, cardData);
          let name = Object.keys(CardData.data).find(key => CardData.data[key].label == entry.label);
          let threshold = settings.showBy == 'tcgShowAll' ? 1 : 2;
          let cardContainer = document.createElement('div');
          cardContainer.className = 'tcg-card-container';
          boxEntries.appendChild(cardContainer);
          // normal
          let card = document.createElement('div');
          cardContainer.appendChild(card);
          card.outerHTML = CardData.getCardHTML(cardData.find(x => !x.isHolo)?.id, name, false);
          card = cardContainer.children[cardContainer.children.length-1];
          card.classList.add('tcg-normal');
          if(cardData.filter(x => !x.isHolo).length < threshold) card.classList.add('tcg-ghost-card');
          else card.querySelector('.tcg-card-title').innerHTML += `<span>x${cardData.filter(x => !x.isHolo).length}</span>`;
          // holo
          card = document.createElement('div');
          cardContainer.appendChild(card);
          card.outerHTML = CardData.getCardHTML(cardData.find(x => x.isHolo)?.id, name, true);
          card = cardContainer.children[cardContainer.children.length-1];
          card.classList.add('tcg-holo');
          if(cardData.filter(x => x.isHolo).length < threshold) card.classList.add('tcg-ghost-card');
          else card.querySelector('.tcg-card-title').innerHTML += `<span>x${cardData.filter(x => x.isHolo).length}</span>`;
        }
        tcgContext.appendChild(box);
      }
    }
  }
}

window.tcgToggleAllCollapse = (openAll) => {
  let categories = [...document.querySelectorAll('.tcg-type-category')];
  for(let category of categories){
    if(openAll) category.classList.remove('collapsed');
    else category.classList.add('collapsed');
    tcgChangeSetting("collapsed", {...settings.collapsed, [category.id.replace(/.*\-/, '')]: [...category.classList].includes('collapsed')});
  }
}

window.tcgToggleAllVisibility = (visibleAll) => {
  let categories = [...document.querySelectorAll('.tcg-type-category')];
  for(let category of categories){
    if(visibleAll) category.classList.remove('tcg-no-ghost-cards');
    else category.classList.add('tcg-no-ghost-cards');
    tcgChangeSetting("visibility", {...settings.visibility, [category.id.replace(/.*\-/, '')]: ![...category.classList].includes('tcg-no-ghost-cards')});
  }
}

window.tcgToggleGhostCards = (el) => {
  el.parentElement.parentElement.classList.toggle('tcg-no-ghost-cards');
  tcgChangeSetting("visibility", {...settings.visibility, [el.parentElement.parentElement.id.replace(/.*\-/, '')]: ![...el.parentElement.parentElement.classList].includes('tcg-no-ghost-cards')});
}

window.tcgChangeSetting = (key, value, refresh) => {
  settings[key] = value;
  localStorage[`oogadex~${var_username}~settings`] = JSON.stringify(settings);
  if(refresh) websocket.send('RFRESH_TCG_CLIENT');
}

const plugin = new OogaDex();
IdlePixelPlus.registerPlugin(plugin);