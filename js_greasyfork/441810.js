// ==UserScript==
// @name           Empornium coalesce variations
// @author         ephraim
// @namespace      empornium.sx
// @version        7.6
// @description    Combines torrents of different variations to one row
// @match          https://www.empornium.sx/torrents.php*
// @match          https://www.empornium.sx/user.php*
// @exclude        https://www.empornium.sx/torrents.php?action=notify
// @exclude        https://www\empornium.sx/torrents.php?id=
// @match          https://www.emparadise.rs/torrents.php*
// @match          https://www.emparadise.rs/user.php*
// @exclude        https://www.emparadise.rs/torrents.php?action=notify
// @exclude        https://www.emparadise.rs/torrents.php?id=
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/441810/Empornium%20coalesce%20variations.user.js
// @updateURL https://update.greasyfork.org/scripts/441810/Empornium%20coalesce%20variations.meta.js
// ==/UserScript==


const variationRegexes = [
  // VR
  /(?:desktop|gearvr|gear|smartphone|mobile|oculus\/?(?:vive)(?: rift)?|oculus\/?(?: ?go)?|go \dk|vive|PlayStationVR PS4|playstation|psvr)(?: ?vr)?/ig,
  // resolutions
  /\d+ ?px|\d+p(?:\d+)?|\bsd\b|\bhd\b|\[hd\]|4kuhd| 4k|uhd|fullhd|fhd|ultrahd|standard|\b[1-9]{1}k(?!\w)|\d+p?\s?x\s?\d+p?\s?(?:px)?|480lp|480|360|720|1080|2160|(?:\d+ ?MP)/ig,
  // bitrate
  /(?:\d+(?:\.\d+)?\s?(?:k|m)?bps)|mobile-(?:high|medium|low)|mobile|(?:low|medium|high|higher) ?bitrate/ig,
  // extras
  /bts|(hq )*image *set|images|(?:with )?picset|\+?pictures|\+?photoset|pics|pic set|\bx\d+|uhq|\d+\s?pics|(first|second) (camera|cam)|best cut|split scenes/ig,
  // framerate
  //\d+(?:\.\d+)?\s?fps/ig,
  // encoding
  /h\.?265|x\.?265|hevc|hvec|avc|h\.?264|x\.?264|SVT-AV1|AV1|reencoded|rencoded|reencode|re-encode|lower bitrate|lq|hq|original|10bit/ig,
  // filetype
  /mpeg4|3gp|mp4|wmv|mkv|blu-ray/ig,
  // reported torrents
  / \/ Reported/i
];

const soupCache = new Map();
const multipleTorrents = groupVariations();
const combinedTorrents = combineTorrents(multipleTorrents);
combinedTorrents.forEach(combined => combined.old.parentElement.insertBefore(combined.tableRow, combined.old));
multipleTorrents.forEach(t => t.tableRows.forEach(r => r.remove()));
document.querySelectorAll('.torrent').forEach(everyOtherRowAB);

function combineTorrents(multiTorrent) {
  const combinedTorrents = [];
  for (const torrent of multiTorrent) {
    const tcells = [];
    for (let i = 0; i < 10; i++) {
      var td = document.createElement('td');
      td.className = 'data-cell-' + i;
      tcells.push(td);
    }
    const mt = extractData(torrent);
    const nameDataCell = tcells[1];
    if (mt.script)
      nameDataCell.appendChild(mt.script);
    const title = mt.title;
    title.textContent = mt.cleanHeading;
    nameDataCell.appendChild(title);

    const infoUl = document.createElement('ul');
    infoUl.className = 'infoList';
    for (let i = 0; i < mt.variations.length; i++) {
      const li = document.createElement('li');
      if (mt.newTorrent[i]) {
        mt.newTorrent[i].classList.add('variation_newtorrent');
        li.appendChild(mt.newTorrent[i]);
      }
      const variationName = document.createElement('a');
      variationName.textContent = mt.variations[i];
      variationName.href = mt.hrefs[i];
      //variationName.title = mt.headings[i];
      variationName.className = 'variationLink';
      let torrentId = new URL(mt.hrefs[i]).searchParams.get('id');
      variationName.setAttribute('onmouseover', `return overlib(overlay${torrentId}, FULLHTML);`);
      variationName.setAttribute('onmouseout', 'return nd();');
      li.appendChild(variationName);
      li.appendChild(mt.info[i]);
      li.className = 'torrent_variations';
      infoUl.appendChild(li);
    }
    nameDataCell.appendChild(infoUl);
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    for (const t of mt.tags) {
      tagsDiv.appendChild(t);
      tagsDiv.appendChild(document.createTextNode(' '));
    }
    nameDataCell.appendChild(tagsDiv);

    tcells[0] = mt.category;
    tcells[2].appendChild(makeList(mt.files));
    tcells[3].appendChild(makeList(mt.comments));
    tcells[4].appendChild(makeList(mt.times));
    tcells[5].appendChild(makeList(mt.sizes));
    tcells[6].appendChild(makeList(mt.snatches));
    tcells[7].appendChild(makeList(mt.seeders));
    tcells[8].appendChild(makeList(mt.leechers));
    if (isUnique(mt.uploaders)) mt.uploaders = mt.uploaders.slice(0, 1);
    tcells[9].appendChild(makeList(mt.uploaders));
    tcells[2].className = 'center';
    tcells[3].className = 'center';
    tcells[9].classList.add('user');
    for (const seed of tcells[7].querySelectorAll('li')) {
      if (seed.textContent === '0') seed.classList.add('r00');
    }

    const tr = document.createElement('tr');
    tr.className = 'torrent multi-torrent';
    tcells.forEach(c => tr.appendChild(c));
    combinedTorrents.push({ old: torrent.tableRows[0], tableRow: tr });
  }
  return combinedTorrents;
}

function heading(t) {
  return t.querySelector('td:nth-child(2) a[href*="torrents.php?id="]').textContent;
}

function extractVariation(title) {
  let cleanTitle = title;
  const variations = [];
  for (const re of variationRegexes) {
    const matches = cleanTitle.match(re);
    if (!matches) continue;
    const token = matches.join(' ');
    variations.push(token);
    for (const match of matches) {
      cleanTitle = cleanTitle.replace(match, '');
    }
  }

  const replacementRegs = [
    /\!+|\/$|\[[\s\W]*\]|\([\s\W]*\)/g, // extra !, /, whitespace and non-word characters in [], empty ()
    /[\(\{\[]+(?:\s*|.)[\)\]\}]+/g, // brackets with one character or only whitespace, can be nested [[]]
    /\s(?=\s)/g, // more than one whitespace in a row
    /(?:[\.\- ]*|( \-|in|freeleech|\[req\]))$/i // trailing dot and dash and some words
  ]
  replacementRegs.forEach(re => {
    cleanTitle = cleanTitle.replace(re, '').trim();
  })
  if (variations.length < 1) variations.push('other');
  return { variation: '[' + variations.join(', ') + ']', cleanTitle: cleanTitle };
}

function groupVariations() {
  const torrents = [...document.querySelectorAll('tr.torrent')];
  const first = torrents.shift();
  const firstVariation = extractVariation(heading(first));
  const torrentTable = [{ cleanHeading: firstVariation.cleanTitle, tableRows: [first], variations: [firstVariation] }];
  for (const torrent of torrents) {
    const variation = extractVariation(heading(torrent));
    const cleanHeading = variation.cleanTitle;
    let found = false;
    if (cleanHeading.length < 1) {
      console.error('Heading is empty', torrent);
      continue;
    }
    for (const t of torrentTable) {
      if (charSoup(t.cleanHeading) === charSoup(cleanHeading)) {
        found = true;
        t.tableRows.push(torrent);
        t.variations.push(variation);
        break;
      }
    }
    if (!found) {
      torrentTable.push({ cleanHeading: cleanHeading, tableRows: [torrent], variations: [variation] });
    }
  }
  return torrentTable.filter(t => t.tableRows.length > 1);
}

function extractData(bunch) {
  const multiTorrent = {};
  multiTorrent.cleanHeading = bunch.cleanHeading;
  multiTorrent.headings = [];
  multiTorrent.variations = [];
  multiTorrent.hrefs = [];
  multiTorrent.info = [];
  multiTorrent.newTorrent = [];
  multiTorrent.files = [];
  multiTorrent.comments = [];
  multiTorrent.times = [];
  multiTorrent.sizes = [];
  multiTorrent.snatches = [];
  multiTorrent.seeders = [];
  multiTorrent.leechers = [];
  multiTorrent.uploaders = [];
  let tags = [];
  let tds;
  let rowIndex = 0;
  for (const row of bunch.tableRows) {
    const title = heading(row);
    multiTorrent.headings.push(title);
    multiTorrent.variations.push(bunch.variations[rowIndex++].variation);
    tags = tags.concat([...row.querySelector('div.tags').children]);
    multiTorrent.hrefs.push(row.querySelector('a[href*="torrents.php?id="]').href);
    multiTorrent.info.push(row.querySelector('span.torrent_icon_container'));
    multiTorrent.newTorrent.push(row.querySelector('span.newtorrent'));

    tds = row.querySelectorAll('td');
    multiTorrent.files.push(tds[2].innerHTML);
    multiTorrent.comments.push(tds[3].innerHTML);
    multiTorrent.times.push(tds[4].innerHTML);
    multiTorrent.sizes.push(tds[5].innerHTML);
    multiTorrent.snatches.push(tds[6].innerHTML);
    multiTorrent.seeders.push(tds[7].innerHTML);
    multiTorrent.leechers.push(tds[8].innerHTML);
    multiTorrent.uploaders.push(tds[9].innerHTML);
  }
  const uniqueTags = tags.reduce((prev, tag) => {
    for (const t of prev) {
      if (t.textContent === tag.textContent) return prev;
    }
    prev.push(tag);
    return prev;
  }, []);
  multiTorrent.tags = uniqueTags;
  multiTorrent.category = tds[0];
  multiTorrent.script = bunch.tableRows[0].querySelector('script');
  multiTorrent.title = bunch.tableRows[0].querySelector('a[href*="torrents.php?id="]');
  return multiTorrent;
}

function makeList(list) {
  const ul = document.createElement('ul');
  ul.className = 'nobr variation_list';
  for (const el of list) {
    const li = document.createElement('li');
    li.className = 'variation_item';
    li.innerHTML = el;
    ul.appendChild(li);
  }
  ul.children[ul.children.length - 1].style.paddingBottom = '0';
  return ul;
}

function charSoup(_string) {
  const cached = soupCache.get(_string);
  if (cached)
    return cached;

  let string = _string;
  const irrelevant = [
    /Se7enSeas|The Rat Bastards|requested|request|req|untouched/gi, // group names and requests
    /\b(?:in|and)\b/gi, // connecting words
    /\.(?:com|org)/gi, // TLDs
    /\[[\w\s,\.\/-]+\]/g, // anything in brackets, like different websites
    /VivThomas|Mofos|Slayed|anal4k|tiny4k|cum4k|girlcum|jayspov|Vixen/i, // website names
    /\d{2,4}[-\.]\d+[-\.]\d{2,4}|20[12]\d/gi, // dates
    ///\W/gi, // non-word characters
    /(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{2,6}/gi // more dates
  ];
  for (const ex of irrelevant) {
    var shorterString = string.replace(ex, '');
    if (shorterString.length > 10) {
      string = shorterString;
    }
  }
  string = string.replace(/\W/g, ''); // non word characters
  //console.log(_string, '\t', string)
  string = string.toLowerCase();
  string = [...string].sort().join('');
  soupCache.set(_string, string);
  //console.log(_string, '\t', string)
  return string;
}

function isUnique(list) {
  return list.reduce((acc, el) => {
    if (acc.includes(el)) return acc;
    return [el, ...acc];
  }, []).length === 1;
}

function everyOtherRowAB(row) {
  const previousClassList = row.previousElementSibling.classList;
  if (!previousClassList.contains('torrent')) return; // first row
  if (row.classList.contains('redbar')) return; // pending removal
  if (previousClassList.contains('rowa')) {
    row.classList.remove('rowa');
    row.classList.add('rowb');
  } else {
    row.classList.remove('rowb');
    row.classList.add('rowa');
  }
}

var empStyle = document.createElement('style');
empStyle.innerHTML = `
  .variationLink {
    margin-right: 4px;
    display: inline-block;
    overflow: hidden;
    max-width: 20ch;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .torrent_variations {
    margin: 0 0 5px 0;
  }
  .infoList {
    display: inline-flex;
    flex-direction: column;
    float: right;
    list-style: none;
    text-align: right;
  }
  .variation_newtorrent {
    float:none !important;
    margin-right: 4px;
  }
  .variation_list {
    list-style: none;
  }
  .variation_item {
    margin: 0;
    padding: 5px 2px 8px 0;
  }
`;
document.head.appendChild(empStyle);