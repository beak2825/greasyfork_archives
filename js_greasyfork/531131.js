// ==UserScript==
// @name        EDC Multi-Op
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/EDC/*/Categories
// @version     1.0.0
// @author      Pelagia/IsilinBN
// @description 20/03/2025 18:39:00
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1533476
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     update.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/531131/EDC%20Multi-Op.user.js
// @updateURL https://update.greasyfork.org/scripts/531131/EDC%20Multi-Op.meta.js
// ==/UserScript==

$(() => {
  const allDraft = (enabled) => {
    $('ul#categories > li > ul > li:not(.new_article)').each(function () {
      var checkbox = $('input[type="checkbox"]', this);
      var isChecked = checkbox.length && checkbox[0].checked;

      if (isChecked) {
        var articleId = $(this).find('a').attr('href').match(/.*Article=(\d+)/)[1];
        $.ajax({
          type: 'POST',
          url: 'https://www.dreadcast.net/EDC/Article/Write',
          data: {
              id_article: articleId,
              draft: enabled ? 1 : 0
          },
          success: function(response) {
              console.log('Réponse serveur:', response);
          },
          error: function(xhr, status, error) {
              console.log('Erreur AJAX:', error);
          }
        });
      }
    })
  };

  const setUI = () => {
    $('#page_content > h4').append(`
      <span style="margin-left: 250px; text-transform: none;font-size:12px;">
        Appliquer à la sélection : <a href="#" id="draft_all">Brouillon</a> | <a href="#" id="undraft_all">Pas Brouillon</a>
      </span>
    `);

    $('#draft_all').on('click', function () { allDraft(true); });

    $('#undraft_all').on('click', function () { allDraft(false); });

    $('ul#categories > li > ul > li:not(.new_article)').prepend(`
      <input type="checkbox" />
    `);
  };

  const loadUI = () => {
    const style = `
      ul#categories > li > ul > li {
        display: flex;
        gap: 1rem;
      }
      ul#categories > li > ul > li > a {
        display: contents !important;
      }
    `;

    DC.Style.apply(style);
  }

  $(document).ready(function () {
    if ($('#menu_short').children().length > 3) {
      console.log('MAISON');
      setUI();
      loadUI();
    }
  });
});