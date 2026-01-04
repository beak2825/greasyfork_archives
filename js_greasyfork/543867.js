// ==UserScript==
// @name        Ygg research Helper
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://www.yggtorrent.*/engine/search*
// @match       https://www.yggtorrent.*/torrent/filmvideo/film/*
// @match       https://www.yggtorrent.*/torrent/filmvideo/serie-tv/*
// @match       https://www.yggtorrent.*/torrent/filmvideo/animation/*
// @match       https://www.yggtorrent.*/torrent/filmvid%C3%A9o/s%C3%A9rie-tv/*
// @match       https://www.yggtorrent.*/torrent/filmvid%C3%A9o/film/*
// @match       https://www.yggtorrent.*/torrent/filmvid%C3%A9o/animation/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      Hoax017
// @description 17/04/2025 11:55:41
// @downloadURL https://update.greasyfork.org/scripts/543867/Ygg%20research%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543867/Ygg%20research%20Helper.meta.js
// ==/UserScript==

// Création d'un bouton
const createLink = (name, color) => {
  switch (color) {
    case "green":
      color = '#3eeb69'
      break;
    case "blue":
    default:
      color = '#007BFF'
      break;
  }
  const buttonLink = document.createElement('a');
  buttonLink.textContent = name; // Texte du bouton

  // Applique le style directement via JavaScript
  buttonLink.style.display = 'inline-block';
  buttonLink.style.float = 'right';
  buttonLink.style.backgroundColor = color;
  buttonLink.style.maxWidth = '90%';
  buttonLink.style.margin = '15px auto';
  buttonLink.style.display = 'block';
  buttonLink.style.borderRadius = '25px';
  buttonLink.style.padding = '15px';
  buttonLink.style.textTransform = 'uppercase';
  buttonLink.style.color = '#fff';
  buttonLink.style.fontSize = '13px';
  buttonLink.style.fontWeight = '700'
  // Ajoute un effet hover
  buttonLink.addEventListener('mouseover', () => {
      buttonLink.style.backgroundColor = '#0056b3';
  });
  buttonLink.addEventListener('mouseout', () => {
      buttonLink.style.backgroundColor = color;
  });
  return buttonLink
}

function getNameFromTorrent(name) {
  if (!name) return null
	const regex = /(.*)[(. ](\d{4}|S\d{2}(E\d{2,})?|COMPLETE|iNTEGRALE)[. )]/igm;
	return regex.exec(name)?.[1].replaceAll(".", " ")
}

function getSeason(name) {
  if (!name) return false
  regex2 = /[. ](S(\d{2})(E(\d{2,}))?)|(COMPLETE)|(iNTEGRALE)[. ]/i;
  const result = regex2.exec(name)?.map(e => e?.toLowerCase() === "complete" || e?.toLowerCase() === "integrale" ? true : parseInt(e)) || []
  console.log(result)
  const [,,season,, episode,complete, integrale] = result
  return isNaN(season) && !complete && !integrale ? false : {complete: complete || integrale, season, episode}
}


const arrayNonEmpty = (arr) => arr?.length ? arr : undefined

const params = new URLSearchParams(document.location.search);
// Liste des paramètres de requête à ajouter

const quality_1080 = [8, 12, 17, 21]
const quality_2160 = [2, 9, 13,  18,  22]

const torrentName = document.querySelector("#title > h1:nth-child(1)")?.innerText
const seasonInfo = getSeason(torrentName);
console.info("Info season", seasonInfo)
const queryParams = {
    name: params.get("name") || getNameFromTorrent(torrentName),
    do: "search",
    category: params.get("category") || 2145,
    sub_category: params.get("sub_category") || (seasonInfo ? 2184 : (torrentName ? 2183 : 'all')),
    'option_langue:multiple[]': [4, 2, 6, 5],
    'option_qualite[]': [2, 8, 9, 12, 13, 17, 18, 21, 22],
    'option_saison[]': arrayNonEmpty(params.getAll("option_saison[]")) || (seasonInfo ? seasonInfo.complete ?  1 : (seasonInfo.season === 0 ? 2 : seasonInfo.season + 3 ): null),
    'option_episode[]': arrayNonEmpty(params.getAll("option_episode[]")) || (seasonInfo ? seasonInfo.episode + 1 : null),
    order: "asc",
    sort: "size"
}
if (!queryParams['option_saison[]']) delete queryParams['option_saison[]']
if (!queryParams['option_episode[]']) delete queryParams['option_episode[]']
console.log({queryParams})

const url = new URL(window.location.origin + '/engine/search');

const ref = document.querySelector("tr td.alone") || document.querySelector("a.butt").parentElement

const buttonLink = createLink("1080")
buttonLink.href = url + `?${new URLSearchParams({...queryParams, 'option_qualite[]': quality_1080 })}`
ref.appendChild(buttonLink);

const buttonLink2 = createLink("2160")
buttonLink2.href = url + `?${new URLSearchParams({...queryParams, 'option_qualite[]': quality_2160 })}`
ref.appendChild(buttonLink2);

const buttonLink3 = createLink("HD")
buttonLink3.href = url + `?${new URLSearchParams(queryParams)}`
ref.appendChild(buttonLink3);

if (seasonInfo?.episode){
  const button = createLink(`EP ${seasonInfo.episode + 1}`, "green")
  button.href = url + `?${new URLSearchParams({...queryParams, 'option_episode[]': seasonInfo.episode + 2 })}`
  ref.appendChild(button);
}
if (seasonInfo.season) {
  const button = createLink("Other EP" , "green")
  tmp = {...queryParams }
  delete tmp['option_episode[]']
  button.href = url + `?${new URLSearchParams(tmp)}`
  ref.appendChild(button);
  const button2 = createLink("Saison" , "green")
  button2.href = url + `?${new URLSearchParams({...queryParams, 'option_episode[]': 1 })}`
  ref.appendChild(button2);
}
if (seasonInfo.complete) {
  const button = createLink("Serie" , "green")
  button.href = url + `?${new URLSearchParams({...queryParams, 'option_saison[]': 1 })}`
  ref.appendChild(button);
}
if (seasonInfo?.episode){
  const button = createLink(`EP ${seasonInfo.episode - 1}`, "green")
  button.href = url + `?${new URLSearchParams({...queryParams, 'option_episode[]': seasonInfo.episode })}`
  ref.appendChild(button);

}

