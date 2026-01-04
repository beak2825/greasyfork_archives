// ==UserScript==
// @name         Search Bar on Palettes Panel
// @namespace    Vholran.SearchBarOnPalettesPanel
// @version      1.0.2
// @description  Adds a search bar to the palettes panel.
// @author       Vholran (https://greasyfork.org/en/users/841616)
// @match        https://*.drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459714/Search%20Bar%20on%20Palettes%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/459714/Search%20Bar%20on%20Palettes%20Panel.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {
        $('#palettechooser').find('.modal-body').before(`
  <div style="display: flex; flex-wrap: wrap;">
    <input id="searchPalettes" class="form-control" placeholder="Search Palettes" style="flex-grow: 1; font-size: calc(100% + 0.15rem); margin: 0.95rem; padding: 1.3rem 1rem; width: 0;" type="text">
  </div>
`);

        $('body').on('input', '#searchPalettes', e => {
            const searchValue = e.target.value.toLowerCase();
            $('#palettechooser-list').children().hide();
            $('.palettechooser-rowname').filter((index, element) => {
                return $(element).text().toLowerCase().includes(searchValue);
            }).parent().show();
        });
        $('body').on('click', '.palettechooser-row', () => {
            if($('.selmode-palettechooser-list').length){
                $('.drawcontrols-button.drawcontrols-color.drawcontrols-arrow').click();
                $('.pcr-app').removeClass('visible');
            }
        });
    });
})(window.jQuery.noConflict(true));