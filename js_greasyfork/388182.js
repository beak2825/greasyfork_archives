// ==UserScript==
// @name        IMDb Actor Age/IMDBAge
// @description Display the actor's age next to movie credits / Adds the age and other various info onto IMDB pages
// @match       *://*.imdb.com/name/nm*
// @match       *://*.imdb.com/title/tt*
// @version     10.0.3
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @namespace http://www.stewarts.org.uk
// @downloadURL https://update.greasyfork.org/scripts/388182/IMDb%20Actor%20AgeIMDBAge.user.js
// @updateURL https://update.greasyfork.org/scripts/388182/IMDb%20Actor%20AgeIMDBAge.meta.js
// ==/UserScript==

var LOGGING = false;
function log(...msg) {
  LOGGING && console.log(...msg);
}

(function() {
  'use strict';

  /// ACTOR PAGES ///
  if (window.location.href.match(/\/name\/nm\d+\/(reference|\?|$)/)) {
    let actorNum = window.location.href.match(/\/name\/nm(\d+)/)[1];
    let birthday = document.querySelectorAll("[data-testid='birth-and-death-birthdate'] span:nth-of-type(2)");
    let birthTime = (birthday && birthday[1].textContent.trim()) || GM_getValue(actorNum);
    let birthMoment = moment(birthTime);
    log('birthTime', birthTime, 'mom', birthMoment);

    if (birthTime) {
      GM_setValue(actorNum, birthMoment.format('YYYY-MM-DD'));
      if (birthday) {
        let ageSpan = getAgeSpan(birthMoment, moment());
        birthday.forEach((item) => {
          item.appendChild(ageSpan);
        });
      }
      let yearCols = document.querySelectorAll('div.ipc-metadata-list-summary-item__cc ul li span.ipc-metadata-list-summary-item__li');
      yearCols.forEach((yc) => {
        log('yc', yc);
        let br = yc.parentNode.querySelector('span');
        let years = yc.textContent.trim();
        log('years', years);
        log('br', br)
        if (years && years.length > 3 && br) {
          let ageSpan = getAgeSpan(birthMoment, years);
          br.parentNode.appendChild(ageSpan);
        }
      });
      (new MutationObserver(updateActor)).observe(document.querySelector("[data-testid='Filmography']"), { attributes: false, characterData: false, childList: true, subtree: true, attributeOldValue: false, characterDataOldValue: false });
      function updateActor(changes) {
        log(changes)
        changes.forEach(mutation => {
          const newNodes = mutation.addedNodes;
          newNodes.forEach(node => {
            if (node.classList && node.classList.contains('ipc-metadata-list-summary-item')) {
              let yc = node.querySelector('div.ipc-metadata-list-summary-item__cc ul li span.ipc-metadata-list-summary-item__li');
              log('yc', yc);
              let br = yc.parentNode.querySelector('span');
              let years = yc.textContent.trim();
              log('years', years);
              log('br', br)
              if (years && years.length > 3 && br) {
                let ageSpan = getAgeSpan(birthMoment, years);
                br.parentNode.appendChild(ageSpan);
              }
            }
          });
        });
      }
    }

    /// MOVIE PAGES ///
  } else if (window.location.href.match(/\/title\/tt\d+\/(reference|fullcredits)?/)) {
    let rows = document.querySelectorAll("[data-testid='title-cast-item'], .cast_list tr.odd, .cast_list tr.even");
    let m = document.title.match(/\((?:TV\s+(?:(?:Mini\s)?Series|Episode|Movie)\s*)?(\d{4}\s*(?:–|-)?\s*(?:\d{4})?)\s*\)/);
    if (m) {
      let titleYears = m[1];
      addFilmAge(titleYears);
      rows.forEach((el) => {
        log(el);
        let actorLink = el.querySelector('a');
        log(actorLink);
        let m = actorLink && actorLink.href.match(/\/name\/nm(\d+)/);
        if (m) {
          let actorNum = m[1];
          log(actorNum);
          let birthTime = GM_getValue(actorNum);
          log(birthTime);
          if (birthTime) {
            let ageSpan = getAgeSpan(moment(birthTime), titleYears);
            log(ageSpan);
            el.querySelectorAll('td > a, div > a')[1].after(ageSpan);//.appendChild(ageSpan);
          }
        }
      });
    }
  }

  function getAgeSpan(birth, years) {
    log('getAgeSpan', birth, years);
    if (typeof years == "string") {
      var m = years.match(/(\d{4})(?:–|-)?(\d{4})?/);
    } else {
      m = [ years.format('YYYY-MM-dd') ];
    }
    log('match m', m, 'moment', moment(m[1]));
    let ageString = moment(m[1]).diff(birth, 'years');
    if (m[2]) {
      ageString += '-' + moment(m[2]).diff(birth, 'years');
    }
    ageString = '(Age ' + ageString + ')';
    let ageSpan = document.createElement('div');
    ageSpan.classList.add('ageSpan');
    ageSpan.textContent = ageString;
    return ageSpan;
  }

  function addFilmAge(years) {
    let m = years.match(/(\d{4})(?:–|-)?(\d{4})?/);
    let year = new Date();
    year.setFullYear(m[1]);
    let age = new Date().getFullYear() - year.getFullYear();

    if (m[2]) {
      let year2 = new Date();
      year2.setFullYear(m[2]);
      var age2 = new Date().getFullYear() - year2.getFullYear();
    }

    let container;
    if (age >= 1) { container = ("" + age + " year" + (age == 1 ? '' : 's') + " ago"); }
    if (age == 0) { container = ("This year"); }
    if (age <= -1) { container = ("in " + Math.abs(age) + " year" + (Math.abs(age) == 1 ? '' : 's')); }

    if(age2) {
      container += " to ";
      if (age2 >= 1) { container += ("" + age2 + " year" + (age2 == 1 ? '' : 's') + " ago"); }
      if (age2 == 0) { container += ("This year"); }
      if (age2 <= -1) { container += ("in " + Math.abs(age2) + " year" + (Math.abs(age2) == 1 ? '' : 's')); }
    }

    let ageSpan = document.createElement('li');
    ageSpan.classList.add('ipc-inline-list__item');
    ageSpan.textContent = container;
    if(document.querySelector("[data-testid='hero__pageTitle']") && document.querySelector("[data-testid='hero__pageTitle']").nextSibling.querySelector("li")) {
      document.querySelector("[data-testid='hero__pageTitle']").nextSibling.querySelector("li").after(ageSpan);
    } else if(document.querySelector("[data-testid='hero__pageTitle']") && document.querySelector("[data-testid='hero__pageTitle']").nextSibling.nextSibling.querySelector("li")) {
      document.querySelector("[data-testid='hero__pageTitle']").nextSibling.nextSibling.querySelector("li").after(ageSpan);
    }
  }

  let s = document.createElement('style');
  s.textContent = `
.ageSpan {
  font-size: 9px !important;
  font-weight: bold;
}
`;
  document.body.appendChild(s);
})();