// ==UserScript==
// @name        Séparation sujets
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Forum
// @match       https://www.dreadcast.net/Forum#
// @match       https://www.dreadcast.net/FAQ
// @match       https://www.dreadcast.net/FAQ#
// @match       https://www.dreadcast.net/Forum/*
// @match       https://www.dreadcast.net/FAQ/*
// @version     2.2.5
// @author      Aversiste, MockingJay, Odul, Pelagia
// @description Separe le RP du HRP dans la section 'Derniers Sujets'.
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/508226/S%C3%A9paration%20sujets.user.js
// @updateURL https://update.greasyfork.org/scripts/508226/S%C3%A9paration%20sujets.meta.js
// ==/UserScript==

(() => {
  const DATA_TAG = 'ss_data';
  let data;

  const initPersistence = () => {
    // Init persistent memory if needed.
    DC.LocalMemory.init(DATA_TAG, {
      hrp: 'on',
      rp: 'on',
      ecoreb: 'on',
      polreb: 'on',
      ecoimp: 'on',
      polimp: 'on',
      annonces: 'on',
    });

    // Load the current settings.
    data = DC.LocalMemory.get(DATA_TAG);
  };

  const isOnOrOff = (node, id) => {
    if (data[id] === 'on') {
      $('span.symbol:first', node).css('display', 'inline');
      $('span.symbol:last', node).css('display', 'none');
      $('ul', node).css('display', 'block');
    } else {
      $('span.symbol:first', node).css('display', 'none');
      $('span.symbol:last', node).css('display', 'inline');
      $('ul', node).css('display', 'none');
    }
  };

  const addClickEvent = (node, id) => {
    $('h3', node).bind('click', () => {
      data[id] =
        $('.symbol:first', node).css('display') === 'none' ? 'off' : 'on';
      DC.LocalMemory.set(DATA_TAG, data);
    });
  };

  const sortSection = (node, filter) => {
    $('li', node).each((i, el) => {
      var category = parseInt(
        $('a', el).attr('class').split(' ')[0].substring(2),
        10,
      ); //En déduit la catégorie forum
      if (!filter.includes(category)) {
        el.remove();
      }
    });
  };

  const createSectionNode = (orig, id, name, filter) => {
    var $node = orig.clone(true);
    $node.attr('id', id);
    sortSection($node, filter);
    $('h3.link span:last-child', $node).text(
      name + ` (${$('li', $node).length})`,
    );
    isOnOrOff($node, id);
    $('#menu_droite').prepend($node);
    addClickEvent($node, id);
  };

  //****************
  //***DEBUT MAIN***
  //****************
  $(document).ready(() => {
    initPersistence();

    var origList = $('#list_derniers_sujets'); // Récupération du div des derniers sujets

    const sections = [
      {
        id: 'hrp',
        name: 'Derniers Sujets HRP',
        categories: [3, 4, 7, 8, 9, 10],
      },
      { id: 'rp', name: 'Derniers Sujets RP', categories: [12, 13, 14, 15] },
      { id: 'ecoreb', name: 'Matrice Rebelle', categories: [20] },
      { id: 'polreb', name: 'Politique Rebelle', categories: [19] },
      { id: 'ecoimp', name: 'Matrice Impériale', categories: [18] },
      { id: 'polimp', name: 'Politique Impériale', categories: [17] },
      { id: 'annonces', name: 'Annonces Officielles', categories: [2, 5] },
    ];

    //Clonage et tri des nouvelles catégories. Dans l'ordre inversé, car utilisation de prepend.
    sections.forEach(($section) => {
      createSectionNode(
        origList,
        $section.id,
        $section.name,
        $section.categories,
      );
    });

    origList.remove(); //Enlever la liste originale une fois le tri effectué.

    //Ne pas afficher une catégorie si elle est vide
    $('#menu_droite > div > ul').each(function () {
      if ($(this).text().trim() === '') {
        $(this).parent().css('display', 'none');
      }
    });
  });
})();
