// ==UserScript==
// @name            Shiki Links Comparator
// @name:ru         Shiki Links Comparator
// @namespace       https://shikimori.one/
// @version         1.0.2
// @description     Compares and highlights links.
// @description:ru  Сравнивает и подсвечивает ссылки в правках.
// @author          Virous
// @match           http://shikimori.org/*
// @match           https://shikimori.org/*
// @match           http://shikimori.one/*
// @match           https://shikimori.one/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/445617/Shiki%20Links%20Comparator.user.js
// @updateURL https://update.greasyfork.org/scripts/445617/Shiki%20Links%20Comparator.meta.js
// ==/UserScript==


// Возвращает массив ссылок из элемента .change
function getLinks(block) {
  let links = Array.from( block.getElementsByClassName('b-external_link') );
  return links.map(link => {
    let url = new URL( link.getElementsByTagName('a')[0].href );
    return {
      url: url.href,
      host: url.host,
      path: url.href.replace(url.origin, ''),
      kind: link.classList[1],
      node: link.getElementsByClassName('url')[0]
    }
  });
}

// Возвращает массив уникальных элементов main_arr, при сравнении с add_arr
function getUniqueElements(main_arr, add_arr) {
  return main_arr.filter(el1 => !add_arr.find(el2 => el1.url === el2.url && el1.kind === el2.kind));
}

// Возвращает похожую на link ссылку из array
function getSimilarLink(link, array) {
  return array.find(l => {
    // Если отличается только kind
    if (link.url === l.url) return true;

    // Если совпадает host или kind и при этом pathname одной ссылки содержит pathname другой
    // P.S. Сомнительное решение, возможно, стоит подумать над другим
    if (link.host === l.host || link.kind === l.kind) {
      if ( link.path.includes(l.path) ) return true;
      if ( l.path.includes(link.path) ) return true;
    }

    return false;
  });
}

// Возвращает массив main_arr со state, определённым как add, mod или del
function organizeLinks(main_arr, add_arr, alt_state) {
  return main_arr.map(link => {
    if ( link.url.includes('/NONE') ?? alt_state === 'add' ) {
      link.state = 'del';
      return link;
    }

    let similar_link = getSimilarLink(link, add_arr);
    link.state = similar_link ? 'mod' : alt_state;
    return link;
  });
}

function prepareLinks(changes_block) {
  let links_container = changes_block.getElementsByClassName('change');
  let before = getLinks(links_container[0]);
  let after = getLinks(links_container[1]);

  let before_unique = getUniqueElements(before, after);
  let after_unique = getUniqueElements(after, before);

  let before_prepared = organizeLinks(before_unique, after_unique, 'del');
  let after_prepared = organizeLinks(after_unique, before_unique, 'add');

  return before_prepared.concat(after_prepared);
}



const colors = {
  add: '#2ecc40',
  mod: '#ff851b',
  del: '#ff4136'
};

let func = function() {
  'use strict';

  let changes = document.querySelectorAll('.field-changes.external_links:not(.slc-tagged)');
  Array.from(changes).forEach(changes_block => {
    changes_block.classList.add('slc-tagged');
    let links = prepareLinks(changes_block);
    links.forEach(link => {
      link.node.style.color = colors[link.state];
    });
  });
};

$(document).ready(func);
$(document).on('page:load', func);
$(document).on('turbolinks:load', func);
$(document).on('postloader:success', func);