// ==UserScript==
// @name     JAVLibrary -> Offkab integration
// @include  https://sukebei.nyaa.si/user/offkab*
// @version  1
// @grant    none
// @author 	 Angelium
// @description    javlibrary metadata to offkab nyaa page
// @namespace https://greasyfork.org/users/191354
// @downloadURL https://update.greasyfork.org/scripts/369546/JAVLibrary%20-%3E%20Offkab%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/369546/JAVLibrary%20-%3E%20Offkab%20integration.meta.js
// ==/UserScript==

/********** Actress Map *********************
 * Add another person below using the format: { actress: 'John Doe', query: 'asdsad' },
 * actress is whatever you want to name it as
 * query string value is taken from javlibrary actress page url (after the ?s=), 
 * e.g. http://www.javlibrary.com/en/vl_star.php?s=azjsa
********************************************/

const STARS_MAP = {
  stars: [
    { actress: 'Shiina Sora', query: 'azec6' },
    { actress: 'Momonogi Kana', query: 'azjsc' },
    { actress: 'RION', query: 'azjsa' },
    { actress: 'Matsunaga Sana', query: 'aeydc' },
  ],
};

/********** CSS rules *********************/

const sheet = window.document.styleSheets[0];

sheet.insertRule(`td {
	padding: 0.5em!important; white-space: unset!important; vertical-align: top!important;
}`, sheet.cssRules.length);

sheet.insertRule(`.video-link {
	font-size: 1.15em; display: inline-block; max-width: 600px; color: #666666; text-decoration:underline;
}`, sheet.cssRules.length);

sheet.insertRule(`.meta-text {
	padding-top: 1em; font-size: 0.75em; color: #666666;
}`, sheet.cssRules.length);

/****************************************/

async function fetchAll({stars}) {
  const libraryPromises = stars.map(star => fetchFromLibrary(star));
  return Promise.all(libraryPromises);
}

async function fetchFromLibrary(star) {
  const response = await fetch(`http://www.javlibrary.com/en/vl_star.php?s=${star.query}`);
  const text = await response.text();
  const html = new DOMParser().parseFromString(text, 'text/html');
  const videoList = [...html.querySelectorAll('.videos .video > a')];
  return createFromLibrary(videoList, star);
}

function createFromLibrary(videoList, star) {
  return videoList.map(node => {
    const href = node.search;
    const [code, image, title] = [...node.children];
    return {
      actress: star.actress,
      code: code.innerText,
      title: title.innerText,
      image: image.src,
      source: `http://www.javlibrary.com/en/${href}`,
    };
  });
}

async function getLibrary() {
  if (sessionStorage.getItem('uniqueLibrary')) {
    const uniqueLibrary = sessionStorage.getItem('uniqueLibrary');
    return JSON.parse(uniqueLibrary);
  } else {
    const library = await fetchAll(STARS_MAP);
    const mergedLibrary = library.reduce((acc, value) => acc.concat(...value));
    const uniqueLibrary = removeDuplication(mergedLibrary);
    sessionStorage.setItem('uniqueLibrary', JSON.stringify(uniqueLibrary));
    return uniqueLibrary;
  }
}

function removeDuplication(data) {
  return data.reduce((acc, value) => {
    const index = acc.map(e => e.code).indexOf(value.code);
    
    if (index !== -1) {
      const regex = new RegExp(value.actress);
      if (acc[index].actress.search(regex) === -1) {
        acc[index].actress += `, ${value.actress}`;
      }
    } else {
      acc.push(value);
    }
    
    return acc;
  },[]);
}

function writeToDocument(uniqueLibrary) {
  const libraryCodes = uniqueLibrary.map(each => each.code);
  const EXTRACT_CODE = /\b[\w\d]{0,5}-?[\w\d]+-[\w\d]+[\w\d]{0,5}\b/gi;
  const torrents = [
    ...document.querySelectorAll('a[href^="/view/"]:not(.comments)')
  ];
  
  for (const torrent of torrents) {
    const [code] = torrent.innerText.trim().match(EXTRACT_CODE);

    if (libraryCodes.indexOf(code) === -1) {
      torrent.parentNode.parentNode.remove();
    } else {
    	const match = uniqueLibrary.find(video => video.code === code);
      setImageSource(torrent, match);
			setTextContent(torrent, match);
    }
  }
}

function setTextContent(torrent, match) {
  const resolution = torrent.text.search(/\B\[HD\]\B/) !== -1 ? 'High definition' : 'Standard definition';
  const div = document.createElement('div');
  div.classList.add('meta-text');
  div.innerHTML = `
    <strong>Code:</strong> ${match.code}<br>
    <strong>Starring:</strong> ${match.actress}<br>
    <strong>Resolution:</strong> ${resolution}`;
  torrent.after(div);
  torrent.innerHTML = match.title;
  torrent.classList.add('video-link');
}

function setImageSource(torrent, match) {
	const parent = torrent.parentNode.parentNode;
  const [image] = parent.getElementsByTagName('img');
  image.parentNode.href = match.source;
  image.parentNode.title = `Go to ${match.code} at JAVLibrary.com`;
  image.src = match.image;
  image.setAttribute('alt', `Poster of ${match.code}`);
}

function setupHeader() {
  const header = document.querySelector('.hdr-category > div');
  header.innerText = 'Poster'
}

async function startScript() {
  setupHeader();
  const uniqueLibrary = await getLibrary();
  writeToDocument(uniqueLibrary);
}

startScript();