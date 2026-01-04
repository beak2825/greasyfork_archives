// ==UserScript==
// @name         BS Simply
// @namespace    http://bs.to/
// @version      0.1.2
// @description  BS Simply inklusive Favoriten Modul
// @author       Seker61
// @match        https://bs.to/*
// @icon         https://www.google.com/s2/favicons?domain=bs.to
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473822/BS%20Simply.user.js
// @updateURL https://update.greasyfork.org/scripts/473822/BS%20Simply.meta.js
// ==/UserScript==

(function () {
  // load extra CSS and JS
  insertJSCSS();
  // path
  const path = window.location.pathname;

  if (path === '/' || path === '/serie/') {
    window.location = 'https://www.bs.to/andere-serien';
  }

  if (path === '/andere-serien') {
    removeFunctions();
    loadFavoritenModul();
    addListenerToSearch();
  }

  if (path === '/' || path === '/serie/') {
    window.location = 'https://www.bs.to/andere-serien';
  }

  if (path.split('/')[1] === 'serie') {
    removeFunctions();
    loadSeriesModul();
  }

  function loadDataFromLink(url, element, fetchOject, e) {
    (e || window.event).preventDefault();

    return fetch(url, { credentials: 'same-origin', redirect: 'follow' })
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(html, 'text/html');
        const episodes = htmlDocument.querySelectorAll('.episodes > tbody > tr');
        const episodesWatched = htmlDocument.querySelectorAll('.episodes > tbody > tr.watched');
        const urlOfSeries = htmlDocument.querySelector('meta[property="og:url"]').content.split('/');
        const firstSeason = (urlOfSeries[5] ? `s${urlOfSeries[5]}` : 's1');
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');

        lStorage.prioList.forEach((prioItem) => {
          if (prioItem === element.childNodes[0].href) {
            star.classList.add('prio');
          }
        });

        star.onclick = function () {
          changePrio(this);
        };
        element.appendChild(htmlDocument.querySelector('#seasons'));
        element.insertBefore(star, element.childNodes[0]);
        if (episodes.length === episodesWatched.length) {
          element.getElementsByClassName(firstSeason)[0].classList.add('watched');
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  function insertJSCSS() {
    // Insert CSS Block
    const css = document.createElement('style');
    css.innerHTML = `
    /* CSS for BS Favoriten Modul */
    @media only screen and (max-width: 900px) {

        .andere-serien ul,
        .vorgeschlagene-serien ul {
            -moz-column-count: 1;
            -webkit-column-count: 1;
        }
    }
    .hamburger-container {
        display: none !important;
    }
    .serie .episode .slider {
        float: none;
        max-width: none;
    }

    .unfold {
        height: auto !important;
    }

    .serie .frame {
        overflow: auto;
        height: 27px;
        min-height: 27px;
    }

    .serie .frame ul li {
        margin: 1px;
    }

    body>#root {
        max-width: none;
    }

    ul#menu {
        display: block !important;
    }

    nav {
        display: block !important;
    }
    nav>ul {
        height: 35px !important;
        line-height: 35px !important;
    }
    nav>ul>li{
        width: 135px !important;
    }
    nav>ul>li>a{
        font-size: 16px !important;
    }
    #favoritesLinks>li {
        padding: 2px 2px 2px 8px;
        display: grid;
        grid-template-columns: 25px 1fr 50%;
        align-items: center;
    }

    #filter {
        float: right;
        width: 50%;
        display: flex;
        justify-content: space-between;
    }

    #filter>div>label {
        display: inline-block;
        width: auto;
    }

    #filter>div:hover>label,
    #filter>div:hover>input {
        text-decoration: underline;
        cursor: pointer;
    }

    .hideSpecial,
    .hideWatched {
        display: none;
    }

    #columnFavorites {
        width: 100%;
    }

    .prio {
        color: gold;
    }

    a:focus {
        outline: 2px solid !important;
        outline-color: red !important;
    }

    .banner,
    #other-series-nav {
        display: none !important;
    }

    .navigation {
        top: 4px !important;
    }

    .navigation>a {
        display: none !important;
    }

    .navigation:hover>a {
        display: block !important;
    }
  `;
    document.getElementsByTagName('head')[0].appendChild(css);

    // Insert JS Block
    const js = document.createElement('script');
    js.innerHTML = `
  // JS for BS Favoriten Modul
  let lStorage = JSON.parse(localStorage.getItem('bs_favorite_modul'));
  function unfold() {
    const classFrame = document.getElementsByClassName('frame');
    const classUnfold = document.getElementsByClassName('frame unfold');
    if (classUnfold.length === 0) {
      for (const e of classFrame) {
        e.classList.add('unfold');
      }
      store('unfold', 'checked');
    } else {
      for (const e of classFrame) {
        e.classList.remove('unfold');
      }
      store('unfold', '');
    }
  }

  function hideWatched() {
    const classWatched = document.getElementsByClassName('watched');
    const classHidden = document.getElementsByClassName('watched hideWatched');
    if (classHidden.length === 0) {
      for (const e of classWatched) {
        e.classList.add('hideWatched');
      }
      store('hideWatched', 'checked');
    } else {
      for (const e of classWatched) {
        e.classList.remove('hideWatched');
      }
      store('hideWatched', '');
    }
    setDataToLinks();
  }

  function hideSpecials() {
    const classS0 = document.getElementsByClassName('s0');
    const classS0Hide = document.getElementsByClassName('s0 hideSpecial');
    if (classS0Hide.length === 0) {
      for (const e of classS0) {
        if (e.children[0].innerHTML === 'Specials') {
          e.classList.add('hideSpecial');
        }
      }
      store('hideSpecial', 'checked');
    } else {
      for (const e of classS0) {
        e.classList.remove('hideSpecial');
      }
      store('hideSpecial', '');
    }
    setDataToLinks();
  }

  function setDataToLinks(){


  const dataSetElements = document.querySelectorAll('a[data-row], a[data-column]');
  for(const element of dataSetElements) {
    delete element.dataset.row;
    delete element.dataset.column;
  }

  let menuLinks = document.querySelectorAll('#menu > li > a');
  let row = 1;
  let column = 1;

  for(const link of menuLinks){
    link.dataset.row = "1";
    link.dataset.column = column.toString();
    column = column + 1;
  }

  let favorites = document.querySelectorAll('.episodes tr, #favoritesLinks > li, .seasons > #seasons > ul, #episodes > ul, .hoster-tabs.top');
  //console.log(favorites);
  for (const favorite of favorites){
    let links = favorite.querySelectorAll('li:not(.hideWatched):not(.hideSpecial) > a, td > a');
    column = 1;
    row = row + 1;
    for(const link of links){
      link.dataset.row = row.toString();
      link.dataset.column = column.toString();
      column = column + 1;
    }
  }
}

  function changePrio(element) {
    const link = element.parentElement.querySelector('a').href;
    if (lStorage.prioList.filter((word) => word === link).length > 0) {
      element.classList.remove('prio');
      lStorage.prioList = lStorage.prioList.filter((word) => word !== link);
      save(lStorage);
      movePrios();
      return;
    }
    element.classList.add('prio');
    lStorage.prioList.push(link);
    save(lStorage);
    movePrios();
  }

  function store(key, value) {
    lStorage[key] = value;
    save(lStorage);
  }

  function save(data) {
    localStorage.setItem('bs_favorite_modul', JSON.stringify(data));
  }

  function movePrios() {
    const prios = document.getElementsByClassName('prio');
    const nonPrios = document.querySelectorAll('.fa-star:not(.prio)');
    const favoritesLinks = document.getElementById('favoritesLinks');

    const names = {
      prio: [],
      nonPrio: [],
    };

    if (prios !== 0) {
      for (const element of prios) {
        names.prio.push(element.parentElement.children[1].innerText);
      }
      for (const element of nonPrios) {
        names.nonPrio.push(element.parentElement.children[1].innerText);
      }

      names.prio.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      names.nonPrio.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });

      names.prio.forEach((e) => {
        const parentOfElement = getElementByText(
          '#favoritesLinks > li > a',
          e,
        ).parentElement;
        favoritesLinks.appendChild(parentOfElement);
      });

      names.nonPrio.forEach((e) => {
        const parentOfElement = getElementByText(
          '#favoritesLinks > li > a',
          e,
        ).parentElement;
        favoritesLinks.appendChild(parentOfElement);
      });
    }
  }

  function getElementByText(selector, text) {
    const selectedElements = document.querySelectorAll(selector);

    for (const element of selectedElements) {
      if (element.innerText === text) {
        return element;
      }
    }
  }
  `;
    document.getElementsByTagName('head')[0].appendChild(js);
  }

  function removeFunctions() {
    const removeMenu = document.querySelectorAll('#menu>li>a');
    const removeSort = document.querySelectorAll("a[href='serie-alphabet']");
    const removeList = document.getElementById('seriesContainer');

    Array.from(removeMenu).forEach((element) => {
      if (element.innerHTML === 'Alle Serien') {
        element.innerHTML = 'Home';
      } else {
        element.style.display = 'none';
      }
    });
    if (removeSort.length > 0) { removeSort[0].parentNode.style.display = 'none'; }
    if (removeList !== null) { removeList.style.display = 'none'; }
  }

  function loadFavoritenModul() {
    // read localStorage
    let lStorage = JSON.parse(localStorage.getItem('bs_favorite_modul'));

    // Init localStorage
    if (lStorage === null || lStorage === 'null') {
      lStorage = {
        unfold: '',
        hideWatched: '',
        hideSpecial: '',
        prioList: [],
      };
      save(lStorage);
    }

    // Insert Table Favorite
    const sectionMain = document.getElementsByClassName('andere-serien')[0];
    sectionMain.classList.add('home');
    const sectionContainer = document.getElementById('seriesContainer');
    const listOfFavorite = document.getElementById('other-series-nav').getElementsByTagName('ul');
    const counter = listOfFavorite[0].children.length - 1;
    const favorites = document.createElement('div');
    favorites.id = 'columnFavorites';
    favorites.classList.add('column');
    const favoritesInnerHTML = `
  <section>
    <header>
        <h3>Favoriten (${counter})</h3>
        <div id='filter'>
            <div>
                <input type='checkbox' id='hideSpecials' onclick='hideSpecials()' ${lStorage.hideSpecial}>
                <label for='hideSpecials'> Specials</label>
            </div>
            <div>
                <input type='checkbox' id='hideWatched' onclick='hideWatched()' ${lStorage.hideWatched}>
                <label for='hideWatched'> Watched</label>
            </div>
            <div>
                <input type='checkbox' id='unfold' onclick='unfold()' ${lStorage.unfold}>
                <label for='unfold'> Unfold</label>
            </div>
    </header>
    <div>
        <ul class='serie' id='favoritesLinks'>${listOfFavorite[0].innerHTML}</ul>
    </div>
  </section>
  </div>
  `;
    favorites.innerHTML = favoritesInnerHTML;

    // Delete Serienvorschläge and fetch Data
    const fetchedObjects = [];
    const favoriteListItems = favorites.querySelectorAll('#favoritesLinks')[0].children;

    Array.from(favoriteListItems).forEach((element) => {
      if (element.innerText === 'Serienvorschläge') {
        element.remove();
      } else {
        fetchedObjects.push(loadDataFromLink(element.children[0].href, element));
      }
    });

    Promise.all(fetchedObjects).then((e) => {
      sectionMain.insertBefore(favorites, sectionContainer);
      if (lStorage.unfold === 'checked') {
        unfold();
      }
      if (lStorage.hideWatched === 'checked') {
        hideWatched();
      }
      if (lStorage.hideSpecial === 'checked') {
        hideSpecials();
      }
      movePrios();
      setDataToLinks();
    });
  }

  function loadSeriesModul() {
    // add class
    const gselector = document.getElementsByClassName('selectors')[0];
    const gepisodes = document.getElementsByClassName('episodes')[0];
    const gepisode = document.getElementsByClassName('episode')[0];
    const gimage = document.getElementById('sp_right');
    const gtext = document.getElementById('sp_left');

    gselector.classList.add('gselector');
    if (gepisodes) { gepisodes.classList.add('gepisodes'); }
    if (gepisode) { gepisode.classList.add('gepisodes'); }
    gimage.classList.add('gimage');
    gtext.classList.add('gtext');
  }

  function addListenerToSearch() {
    const searchBox = document.getElementById('serInput');

    searchBox.addEventListener('input', function (event) {
      const container = document.getElementById('seriesContainer');
      const favorites = document.getElementById('columnFavorites');
      if (this.value === '') {
        favorites.style.display = 'block';
        container.style.display = 'none';
      } else {
        favorites.style.display = 'none';
        container.style.display = 'block';
      }
    });
  }

  function addFireTV() {
    let row = 1;
    let column = 1;
    let currentLink = null;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentLink = document.querySelector(`a[data-row="${row + 1}"][data-column="1"]`);
        if (currentLink !== null) {
          column = 1;
          row += 1;
          document.querySelector(`a[data-row="${row}"][data-column="${column}"]`).focus();
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentLink = document.querySelector(`a[data-row="${row - 1}"][data-column="1"]`);
        if (currentLink !== null) {
          column = 1;
          row -= 1;
          document.querySelector(`a[data-row="${row}"][data-column="${column}"]`).focus();
        }
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        currentLink = document.querySelector(`a[data-row="${row}"][data-column="${column + 1}"]`);
        if (currentLink !== null) {
          column += 1;
          document.querySelector(`a[data-row="${row}"][data-column="${column}"]`).focus();
        }
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        currentLink = document.querySelector(`a[data-row="${row}"][data-column="${column - 1}"]`);
        if (currentLink !== null) {
          column -= 1;
          document.querySelector(`a[data-row="${row}"][data-column="${column}"]`).focus();
        }
      }

      console.log(currentLink);
    }, false);
  }

  setDataToLinks();
}());
