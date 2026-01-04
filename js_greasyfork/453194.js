// ==UserScript==
// @name         DLSite Toolbox
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Add some extra functionalities for DLSite
// @author       Yukiteru
// @match        https://www.dlsite.com/*
// @icon         https://www.dlsite.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453194/DLSite%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/453194/DLSite%20Toolbox.meta.js
// ==/UserScript==

function getProductCode() {
  const regex = /.J\d+/;
  const match = location.href.match(regex);
  const code = match[0];
  return code;
}

function getWorkGenre() {
  const genre = document.querySelectorAll('.work_genre')[1];
  const text = genre.childNodes[1].textContent;
  if (text === 'マンガ') {
    return 'manga';
  } else if (text.includes('CG')) {
    return 'cg';
  } else if (text.includes('ボイス')) {
    return 'voice';
  } else if (text === '動画') {
    return 'video';
  } else {
    return 'game';
  }
}

function getCopyButton(title) {
  const code = getProductCode();
  const circle = $('.maker_name:first-child > a').text();
  const workName = `[${circle}] ${title} (${code})`;

  const copyButton = $("<button/>").text("📋");
  copyButton.css({ all: 'unset', cursor: 'pointer' });
  copyButton.on('click', () => GM_setClipboard (workName));
  return copyButton
}

function addSearchLink(genre) {
  // allow user to select the work's title
  const titleElement = $('h1#work_name');
  const titleText = $.text(titleElement);

  titleElement.css({
    display: 'flex',
    userSelect: 'text'
  })
  titleElement.text('');
  const copyButton = getCopyButton(titleText);
  const titleContent = $("<span/>").text(titleText);
  titleElement.append(copyButton, titleContent);

  const query = genre === 'voice' ? getProductCode() : titleText;
  const links = getLinks(genre, query);

  $(links).each((index, el) => {
    el.attr('target', '_blank');
    el.css({
      width: 'auto',
      fontSize: '12px',
      alignSelf: 'center',
      marginLeft: '12px',
      color: '#337ab7'
    });
    el.appendTo(titleElement);
  });
}


function getLinks(genre, query) {
  const queries = {
    nyaa: $('<a>', {
      href: `https://sukebei.nyaa.si/?f=0&c=1_0&q=${query}`,
      text: 'Nyaa',
    }),
    exhentai: $('<a>', {
      href: `https://exhentai.org/?f_search=${query}`,
      text: 'ExHentai',
    }),
    nhentai: $('<a>', {
      href: `https://nhentai.net/search/?q=${query}`,
      text: 'nhentai',
    }),
    hitomi: $('<a>', {
      href: `https://hitomi.la/search.html?${query}`,
      text: 'Hitomi',
    }),
    animeSharing: $('<a>', {
      href: `https://www.anime-sharing.com/search?q=${query}`,
      text: 'AnimeSharing',
    }),
    asmr: $('<a>', { href: `https://asmr.one/work/${query}`, text: 'Kikoeru' }),
    south: $('<a>', { href: `https://south-plus.net/search.php?search=${query}`, text: 'South-Plus' })
  };

  let links = [];
  switch (genre) {
    case 'manga':
      links = [queries.exhentai, queries.nhentai, queries.hitomi];
      break;
    case 'cg':
      links = [queries.exhentai, queries.hitomi, queries.nyaa];
      break;
    case 'voice':
      links = [queries.asmr, queries.south];
      break;
    case 'video':
    case 'game':
      links = [queries.nyaa, queries.south, queries.animeSharing];
      break;
  }
  return links;
}

function removeAdultCheck() {
  // check if dlsite is asking for adult check
  const hasAdultCheck = $('.type_adultcheck').length;
  if (!hasAdultCheck) return false;
  $.cookie('adultchecked', '1', {
      "expires": 365,
      "path": "/",
      "domain": ".dlsite.com"
  });
  window.location.reload();
}

function searchGroupName() {
  // if you entered the followlist by clicking a group name,
  // than search that group name in the followlist
  const pathList = window.location.pathname.split('/');
  let groupId
  if (pathList.includes('followlist') && pathList.includes('maker_id')) {
    groupId = pathList.find(item => item.includes('RG'));
  }
  if (!groupId) return false;
  $('#searchword').val(groupId);
  $('#submit_sort').click();
}

$(document).ready(() => {
  const genre = getWorkGenre();
  addSearchLink(genre)
  removeAdultCheck();
  searchGroupName();
});