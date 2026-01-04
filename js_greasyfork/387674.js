// ==UserScript==
// @name        IMDb Actor Age redux
// @namespace   driver8.net
// @description Display the actor's age next to movie credits.
// @match       *://*.imdb.com/name/nm*
// @match       *://*.imdb.com/title/tt*/
// @match       *://*.imdb.com/title/tt*/fullcredits*
// @version     0.1.1
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/387674/IMDb%20Actor%20Age%20redux.user.js
// @updateURL https://update.greasyfork.org/scripts/387674/IMDb%20Actor%20Age%20redux.meta.js
// ==/UserScript==
console.log('hi imdb actor age');

(function() {
    'use strict';

    var LOGGING = false;
    function log(...msg) {
        LOGGING && console.log(...msg);
    }

    /// ACTOR PAGES ///
    if (window.location.href.match(/\/name\/nm\d+\/(reference|\?|$)/)) {
        let actorNum = window.location.href.match(/\/name\/nm(\d+)/)[1];
        let birthday = document.querySelector('#name-born-info time');
        let birthTime = (birthday && birthday.textContent.trim()) || GM_getValue(actorNum);
        let birthMoment = moment(birthTime);
        log('birthTime', birthTime, 'mom', birthMoment);

        if (birthTime) {
            GM_setValue(actorNum, birthMoment.format('YYYY-MM-DD'));
            if (birthday) {
                let ageSpan = getAgeSpan(birthMoment, moment());
                birthday.appendChild(ageSpan);
            }
            let yearCols = document.querySelectorAll('#filmography .year_column');
            yearCols.forEach((yc) => {
                log('yc', yc);
                let br = yc.parentNode.querySelector('br');
                let years = yc.textContent.trim();
                log('years', years);
                log('br', br)
                if (years && years.length > 3 && br)  {
                    let ageSpan = getAgeSpan(birthMoment, years);
                    br.parentNode.insertBefore(ageSpan, br);
                }
            });
        }

    /// MOVIE PAGES ///
    } else if (window.location.href.match(/\/title\/tt\d+\/(reference|fullcredits)?/)) {
        let rows = document.querySelectorAll('.StyledComponents__CastItemWrapper-y9ygcu-7, table.cast tr.odd, table.cast tr.even, table.cast_list tr.odd, table.cast_list tr.even');
        let m = document.title.match(/\((?:TV\s+(?:Series|Episode|Movie)\s*)?(\d{4}\s*(?:–|-)?\s*(?:\d{4})?)\s*\)/);
        if (m) {
            let titleYears = m[1];
            rows.forEach((el) => {
                log(el);
                let actorLink = el.querySelector('a');
                console.log(actorLink);
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
        ageString = '(age ' + ageString + ')';
        let ageSpan = document.createElement('span');
        ageSpan.classList.add('ageSpan');
        ageSpan.textContent = ageString;
        return ageSpan;
    }

    function getFamousBirthday(name) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.famousbirthdays.com/search?q=' + encodeURIComponent(name),
            onload: function(response) {
                var parser = new DOMParser();
                var h = parser.parseFromString(response.responseText, "text/html");
                var age = h.querySelector('').lastElementChild;
                var html = ``;
                var new_div = document.createElement('div');
                new_div.innerHTML = html;
                new_div = new_div.firstElementChild;
                document.querySelector('').insertBefore(new_div, document.querySelector(''));
            }
        });
    }

    let s = document.createElement('style');
    s.textContent = `
.ageSpan {
  font-size: 11px !important;
  font-weight: bold;
}
`;
    document.body.appendChild(s);
})();