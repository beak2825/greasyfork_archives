// ==UserScript==
// @name        F95 Quick Game Templates
// @namespace   1330126-edexal
// @match       *://f95zone.to/forums/game-requests.3/post-thread*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.5
// @author      Edexal
// @license     Unlicense
// @description Adds more action buttons to the toolbar when making a game request on f95.
// @homepageURL https://sleazyfork.org/en/scripts/500283-f95-quick-game-templates
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/game-request-templates.js
// @downloadURL https://update.greasyfork.org/scripts/500283/F95%20Quick%20Game%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/500283/F95%20Quick%20Game%20Templates.meta.js
// ==/UserScript==
(() => {
  Edexal.addCSS(`
    .edexal-btn{
        color:yellow !important;
    }
    `);
  const NEW_STANDARD_TEMPLATE = getNewStandardTempl();
  const NEW_VNDB_TEMPLATE = getNewVNDBTempl();
  const REQ_TEMPLATE = getRequestTempl();
  const UPDATE_TEMPLATE = getUpdateTempl();

  function addButton() {
    let toolbarEl = document.querySelector('.fr-toolbar');
    toolbarEl.insertAdjacentHTML('beforeend', `<div class="fr-separator fr-vs" role="separator" aria-orientation="vertical"></div>
      <button aria-controls="dropdown-menu-xfTemp-1" aria-expanded="false" aria-haspopup="false" class="fr-command fr-btn fr-dropdown fr-btn-font_awesome edexal-btn" data-cmd="xfTemp"
              id="xfTemp-1" role="button" tabindex="-1"
              type="button" title="Templates">
          <i aria-hidden="true" class="fas fa-file-word"></i>
          <span class="fr-sr-only">Templates</span>
      </button>
      <div aria-hidden="true" aria-labelledby="xfTemp-1" class="fr-dropdown-menu" id="dropdown-menu-xfTemp-1" role="listbox">
          <div class="fr-dropdown-wrapper" role="presentation">
              <div class="fr-dropdown-content" role="presentation">
                  <ul class="fr-dropdown-list" role="presentation">
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempStandard" role="option"
                                                 tabindex="-1" title="${NEW_STANDARD_TEMPLATE.label}">${NEW_STANDARD_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempVNDB" role="option"
                                                 tabindex="-1" title="${NEW_VNDB_TEMPLATE.label}">${NEW_VNDB_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempRequest" role="option"
                                                 tabindex="-1" title="${REQ_TEMPLATE.label}">${REQ_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempUpdate" role="option"
                                                 tabindex="-1" title="${UPDATE_TEMPLATE.label}">${UPDATE_TEMPLATE.label}</a></li>
                  </ul>
              </div>
          </div>
      </div>
      <button id="xfTagList-1" title="Go To Tag List" type="button" tabindex="-1" role="button" class="fr-command fr-btn fr-btn-xf_font_awesome_5 edexal-btn" data-cmd="xfTagList"><i class="far fa-tags" aria-hidden="true"></i><span class="fr-sr-only">Go To Tag List</span></button>`);
  }

  function refreshTextArea() {
    let textAreaEl = document.querySelector(".fr-element") //Text Area Element
    textAreaEl.replaceChildren();//Text Area Element
    let preEl = Edexal.newEl({element:"pre"});
    textAreaEl.append(preEl); //Text Area Element
  }

  function displayTextClick(e, template) {
    refreshTextArea();
    let txt = document.createTextNode(template.body);
    document.querySelector(".fr-element").firstElementChild.append(txt); //Text Area Element
    document.querySelector('#xfTemp-1').classList.remove('fr-active', 'fr-selected');
    e.target.classList.remove('fr-selected');
    document.querySelector('[placeholder~=title]').value = template.title; //Thread title Element
  }
  function setBtnEvent(templateObj) {
    document.querySelector(`[title="${templateObj.label}"]`).addEventListener('click', (e) => displayTextClick(e, templateObj));
  }

  function goToTagListClick(e) {
    window.open("https://f95zone.to/threads/tags-rules-and-list-updated-2024-01-29.10394");
  }

  function displayPrefixPlaceholder() {
    const prefixField = document.querySelector('.select2-search__field');
    prefixField.placeholder = "*DON'T FORGET TO SELECT THE PREFIX TAG HERE!!!";
  }

  function run() {
    addButton();
    displayPrefixPlaceholder();

    setBtnEvent(NEW_STANDARD_TEMPLATE);
    setBtnEvent(NEW_VNDB_TEMPLATE);
    setBtnEvent(REQ_TEMPLATE);
    setBtnEvent(UPDATE_TEMPLATE);
    document.querySelector('#xfTagList-1').addEventListener('click', (e) => goToTagListClick(e));
  }

  function startOnTime() {
    const observer = new MutationObserver(() => {
      const toolbar = document.querySelector('.fr-toolbar');
      if (toolbar) {
        run();
        observer.disconnect();
      }
    });
    observer.observe(document.body, {subtree: true, childList: true});
  }

  startOnTime();
})();
