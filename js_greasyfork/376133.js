// ==UserScript==
// @name ALink
// @namespace Morimasa
// @author Morimasa
// @description Adds AniList links to mangadex manga pages
// @match https://mangadex.org/title/*
// @match https://mangadex.org/manga/*
// @version 0.70
// @downloadURL https://update.greasyfork.org/scripts/376133/ALink.user.js
// @updateURL https://update.greasyfork.org/scripts/376133/ALink.meta.js
// ==/UserScript==

const insertAL = data => {
  const id = data.data.Media.id;
  const rows = document.querySelectorAll("div.row.m-0.py-1.px-0.border-top");
  const infRow = [...rows].filter(e=> e.children[0].innerText==="Information:");
 
  if (infRow.length>0)
    infRow[0].children[1].children[0].prepend(ALel(id));
  else {
    const row = InsertRow(rows);
    row.append(ALel(id))
  }
}

const ALel = id => {
  const li = document.createElement("li");
  li.classList.add("list-inline-item");
  
  const a = document.createElement("a");
  a.rel = "noopener noreferrer";
  a.target = "_blank";
  a.href = `https://anilist.co/manga/${id}`
  a.innerHTML = `
    <img src="https://anilist.co/img/icons/icon.svg" height=16>
    AniList (S)
  `
  li.append(a);
  return li
}

const InsertRow = (rows) => { 
  let main = document.createElement('div');
  main.className = 'row m-0 py-1 px-0 border-top';
  let title = document.createElement('div');
  title.className = 'col-lg-3 col-xl-2 strong';
  title.innerHTML = `Information:`;
  main.append(title)
  ////////////
  let box = document.createElement('div');
  box.className = "col-lg-9 col-xl-10"
  main.append(box)
  let list = document.createElement('ul');
  list.className = "list-inline form-inline"
  list.style.marginBottom = 0
  box.append(list)
  rows[0].parentNode.insertBefore(main, rows[rows.length-2])
  return list;
}

const api = async (query, vars) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({query: query, variables: vars}),
      headers: {
          'Content-Type': 'application/json'
      }
    }
    let res = await fetch('https://graphql.anilist.co', options)
    if (res.ok)
      return await res.json();
    else 
      return Promise.reject(res);
}

const searchMAL = id => {
  const query = 'query($mal:Int){Media(idMal:$mal,type:MANGA){id}}';
  const vars = {"mal": id}
  return api(query, vars);
}

const searchTitle = (title, format, lang) => {
  const query = 'query($title:String,$format:MediaFormat,$lang:CountryCode){Media(search:$title,format:$format,countryOfOrigin:$lang,type:MANGA){id}}';
  const vars = {title, format, lang}
  return api(query, vars);
}

const getCountry = () => {
	return document.getElementsByClassName("card-header")[0].children[2].classList[2].split('-')[1]
}

const getNames = () => {
  const altNamesEL = document.getElementsByClassName('col-xl-9')[0].children[0];
  if(altNamesEL.children[0].innerText==="Alt name(s):")
    return [...altNamesEL.children[1].children[0].children].map(t => t.innerText);
  else
    return [];
}

const searchNative = (names, lang) => {
  const reg = {
    jp: /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f]/g,
    kr: /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/g
  }
  const native = names.filter(t => t.match(reg[lang]))
  if(native.length !== 1) return false;
  else return native[0];
}

const check = err => {
  if (err===undefined || err.status===404) {
    const lang = getCountry();
    if (!["jp", "kr", "cn"].includes(lang)) return;
    const names = getNames();
    const native = searchNative(names, lang);
    const title = native ? native : document.getElementsByClassName("card-header")[0].childNodes[3].textContent;
    const isOneshot = document.querySelector('.badge[href$="/genre/21"]');
    searchTitle(title, isOneshot ? 'ONE_SHOT' : 'MANGA', lang.toUpperCase())
    .then(insertAL)
    .catch(err => console.info(err))
  }
  else
    console.error(err)
}

const malURL = document.querySelector('a[href^="https://myanimelist.net"]');
const alURL = document.querySelector('a[href^="https://anilist.co"]');
if (!alURL) {
  if (malURL) {
    searchMAL(malURL.href.split('/').pop())
    .then(insertAL)
    .catch(check)
  }
  else {
    check();
  }
}
