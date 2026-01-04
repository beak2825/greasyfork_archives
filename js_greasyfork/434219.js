// ==UserScript==
// @name         BS Favoriten Modul
// @namespace    http://bs.to/
// @version      1.0.1
// @description  Favoriten Modul auf der Startseite für eine bessere Übersicht.
// @author       Seker61
// @match        https://bs.to/
// @icon         https://www.google.com/s2/favicons?domain=bs.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434219/BS%20Favoriten%20Modul.user.js
// @updateURL https://update.greasyfork.org/scripts/434219/BS%20Favoriten%20Modul.meta.js
// ==/UserScript==

(function () {
  // Insert CSS Block
  const css = document.createElement('style');
  css.innerHTML = `
  /* CSS for BS Favoriten Modul */
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
  #favoritesLinks > li {
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
  #filter > div > label {
    display: inline-block;
    width: auto;
  }
  #filter > div:hover > label,
  #filter > div:hover > input {
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
  const sectionHome = document.getElementsByClassName('home');
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
    sectionHome[0].appendChild(favorites);
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
  });
}());

function loadDataFromLink(url, element, fetchOject, e) {
  (e || window.event).preventDefault();

  return fetch(url, { credentials: 'same-origin' })
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(html, 'text/html');
      const episodes = htmlDocument.querySelectorAll('.episodes > tbody > tr');
      const episodesWatched = htmlDocument.querySelectorAll('.episodes > tbody > tr.watched');
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
        element.getElementsByClassName('s1')[0].classList.add('watched');
      }
    })
    .catch((error) => {
      console.warn(error);
    });
}