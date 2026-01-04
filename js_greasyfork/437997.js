// ==UserScript==
// @name               IMDb display RottenTomatoes info: redux 0203 MOD5
// @namespace          -
// @version            0.2.0.3
// @description        Display RottenTomatoes Tomatometer rating info on IMDb pages
// @author             -
// @match              *://*.imdb.com/title/*
// @connect            rottentomatoes.com
// @require            https://greasyfork.org/scripts/389810-rottentomatoes-utility-library-custom-api/code/RottenTomatoes%20Utility%20Library%20(custom%20API).js?version=959077
// @grant              GM_addStyle
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_info
// @grant              GM_listValues
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @inject-into        page
// @downloadURL https://update.greasyfork.org/scripts/437997/IMDb%20display%20RottenTomatoes%20info%3A%20redux%200203%20MOD5.user.js
// @updateURL https://update.greasyfork.org/scripts/437997/IMDb%20display%20RottenTomatoes%20info%3A%20redux%200203%20MOD5.meta.js
// ==/UserScript==

/* ------------ MOD CHANGE ----------------
15   // @run-at        document-start  (or document-body)
109  RT Rating -> TOMATOMETER
119  + target="_blank" (new row after the href=)
161  insAt.appendChild(wrapper) -> insAt.prepend(wrapper)
177  font-size: 1em -> 90%
180  color: #c2c2c2
     + letter-spacing: 0;
225  window.setTimeout(check, 1000   (orig: 50)

mod4
42,71-76  age check removed

mod5
186-  function insertRating(node) {...  remove some 
---------------------------------------- */


(function() {
    'use strict';

    console.log('hi imdb rt');

    const MAX_RESULT_AGE = 1; //in days

    function parse(query, regex, doc) {
        doc = doc || document;
        try {
            let text = doc.querySelector(query).textContent.trim();
            if (regex) {
                text = text.match(regex)[1];
            }
            return text.trim();
        } catch (e) {
            console.log('error', e);
            return '';
        }
    };

    function start() {
        let m = document.title.match(/\((?:TV\s+(?:Series|Mini.?Series|Episode|Movie)\s*)?(\d{4})\s*(?:–|-)?\s*(?:\d{4})?\s*\)/);
        if (m) {
            let year = parseInt(m[1]);
            // Skip TV episodes
            if (!document.title.match(/\(TV\s+Episode/)) {
                let title = parse('.TitleHeader__TitleText-sc-1wu6n3d-0, .title_wrapper > h1', /([^()]+)/);
                let tv = document.title.match(/\(TV\s+(?:Mini.?)?Series/) ? true : false;
                console.log(title, year, tv);
                let id = title + year + (tv ? 'tv' : 'movie');
                let data = GM_getValue(id, false);
                let age_check = true;
                try {
                    age_check = new Date().getFullYear() - parseInt(data.year) > 1; // If movie is older than 2 years, we prob don't need to update the data
                    age_check = age_check || (Date.now() - new Date(data.fetched).getTime() < MAX_RESULT_AGE * 24 * 60 * 60 * 1000); // Update data for results older than X days
                } catch (e) {
                    age_check = false;
                }
                
                if (data instanceof Object && age_check) {
                    console.log('Data EXISTS', data);
                    displayData(data);
                } else {
                    // Create spinner gif
                    let spinnerDiv = document.createElement('div');
                    spinnerDiv.innerHTML = `<img src="${spinnerGif}">`;
                    spinnerDiv.id = 'spinner-div';
                    spinnerDiv.classList.add('imdbRating');
                    insertRating(spinnerDiv);

                    getRtInfoFromTitle(title, tv, year).then((freshData) => {
                        GM_setValue(id, freshData);
                        spinnerDiv.parentNode.removeChild(spinnerDiv);
                        displayData(freshData);
                    }).catch((error) => {
                        console.log('Error getting data:', error);
                        spinnerDiv.parentNode.removeChild(spinnerDiv);
                    });
                }
            }
        }
    }

    function displayData(data) {
        let score = data.score > -1 ? data.score : 'TBD',
            scoreColor = data?.state?.match(/fresh/) ? '#BBFF88' : 'gray',
            rating = data.rating > -1 ? data.rating : 'N/A',
            votes = data.votes || 0,
            consensus = data.consensus || '',
            bg = '',
            icons = {
            'certified': 'url(https://www.rottentomatoes.com/assets/pizza-pie/images/icons/global/cf-lg.3c29eff04f2.png) no-repeat',
            'fresh': 'url(https://www.rottentomatoes.com/assets/pizza-pie/images/icons/global/new-fresh-lg.12e316e31d2.png) no-repeat',
            'rotten': 'url(https://www.rottentomatoes.com/assets/pizza-pie/images/icons/global/new-rotten-lg.ecdfcf9596f.png) no-repeat',
            'question': 'url(https://www.rottentomatoes.com/assets/pizza-pie/images/poster_default.c8c896e70c3.gif) no-repeat' // not used
            };
        for (let status in icons) {
            let regex = new RegExp(status);
            if (regex.test(data.state)) {
                bg = icons[status];
                break;
            }
        }
        let rtDiv = document.createElement('div');
        if (document.querySelector('.RatingBar__RatingContainer-sc-85l9wd-0')) {
            rtDiv.innerHTML = `
              <div class="RatingBarButtonBase__ContentWrap-sc-15v8ssr-0 jQXoLQ rating-bar__base-button">
                <div class="RatingBarButtonBase__Header-sc-15v8ssr-1 bufoWn">
                  TOMATOMETER
                </div>
                <a
                    class="ipc-button ipc-button--single-padding ipc-button--center-align-content ipc-button--default-height ipc-button--core-baseAlt ipc-button--theme-baseAlt ipc-button--on-textPrimary ipc-text-button RatingBarButtonBase__Button-sc-15v8ssr-2 jjcqHZ"
                    role="button"
                    tabindex="0"
                    aria-label="${consensus.replace(/"/g, "'")}"
                    aria-disabled="false"
                    href="https://www.rottentomatoes.com${data.id}"
                    target="_blank"
                >
                <div class="ipc-button__text">
                  <div class="RatingBarButtonBase__ButtonContentWrap-sc-15v8ssr-3 jodtvN">
                    <div class="RatingBarButtonBase__IconWrapper-sc-15v8ssr-4 dwhzFZ" style="background: rgba(0, 0, 0, 0) ${bg} scroll 0% 0% / 28px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star AggregateRatingButton__RatingIcon-sc-1ll29m0-4 iAOIoP" viewBox="0 0 24 24" fill="currentColor" role="presentation">
                      </svg>
                    </div>
                    <div class="AggregateRatingButton__ContentWrap-sc-1ll29m0-0 hmJkIS">
                      <div class="AggregateRatingButton__Rating-sc-1ll29m0-2 bmbYRW">
                        <span class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV gfstID" itemprop="ratingValue" style="padding-right: 0;">${score}</span>
                        <span style="color: white; padding-right: 0.15em;">%</span>
                        <span class="grey jkCVKJ" itemprop="bestRating"><!-- --> (${rating})</span>
                      </div>
                      <div class="AggregateRatingButton__TotalRatingAmount-sc-1ll29m0-3 jkCVKJ">${votes}</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            `;
        } else {
            rtDiv.innerHTML = `
              <div class="imdbRating" itemtype="http://schema.org/AggregateRating" itemscope="" itemprop="aggregateRating" style="background: rgba(0, 0, 0, 0) ${bg} scroll 0% 0% / 28px;" title="${consensus.replace(/"/g, "'")}">
                <div class="ratingValue">
                  <strong><span itemprop="ratingValue" style="font-size: 21px; line-height: 21px; color: ${scoreColor};">${score}</span></strong>
                  <span class="grey" style="color: ${scoreColor};">%</span>
                  <span class="grey" itemprop="bestRating">(${votes})</span>
                </div>
                <a href="https://www.rottentomatoes.com${data.id}">
                  <span class="small" itemprop="ratingCount">${rating}</span>
                </a>
              </div>
            `;
        }
        rtDiv = rtDiv.firstElementChild;

        insertRating(rtDiv);

        if (data.consensus) {
            let titleBlock = document.querySelector('.GenresAndPlot__Plot-cum89p-6');   // .GenresAndPlot__Plot-cum89p-6
            let consDiv = document.createElement('div');
            consDiv.classList.add('consensus-div');
            consDiv.innerHTML = '<p>' + data.consensus + '</p>';
            titleBlock.after(consDiv);
        }
    }

    function insertRating(node) {
        let wrapper = document.querySelector('.ratings_wrapper');
//        if (wrapper) {
//            wrapper.appendChild(node);
//        } else {
            wrapper = document.createElement('div');
            wrapper.classList.add('ratings_wrapper');
            wrapper.appendChild(node);
            let insAt = document.querySelector('.title_bar_wrapper');
//            if (insAt) {
//                insAt.insertBefore(wrapper, insAt.firstElementChild);
//            } else {
                insAt = document.querySelector('.RatingBar__ButtonContainer-sc-85l9wd-1');
                 insAt.prepend(wrapper);
//            }
//        }
    }

    GM_addStyle(`

      .consensus-div {
        margin: 10px 0px 0px 0px;
      }

      .consensus-div p {
        color: #c2c2c2;
        font-size: 90%;
        letter-spacing: 0;
        line-height: 1.4rem !important;
      }

      #spinner-div {
        background: none;
      }

      .heroic-overview .title_block {
        padding-bottom: 0px;
      }

      .jkCVKJ {
      	font-family: var(--ipt-font-family);
      	font-size: var(--ipt-type-copyright-size,.75rem);
      	font-weight: var(--ipt-type-copyright-weight,400);
      	letter-spacing: var(--ipt-type-copyright-letterSpacing,.03333em);
      	line-height: var(--ipt-type-copyright-lineHeight,1rem);
      	text-transform: var(--ipt-type-copyright-textTransform,none);
      	color: var(--ipt-on-baseAlt-textSecondary-color,rgba(255,255,255,0.7));
      }

      .bmbYRW {
      	display: flex;
      	-moz-box-align: center;
      	align-items: center;
      	font-family: var(--ipt-font-family);
      	font-size: var(--ipt-type-body-size,1rem);
      	font-weight: var(--ipt-type-body-weight,400);
      	letter-spacing: var(--ipt-type-body-letterSpacing,.03125em);
      	text-transform: var(--ipt-type-body-textTransform,none);
      	color: var(--ipt-on-baseAlt-textSecondary-color,rgba(255,255,255,0.7));
      	line-height: 1.5rem;
      	margin-bottom: -0.125rem;
      }
    `);

    var spinnerGif = `data:image/gif;base64,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`;
  
    (function check() {
        if (document.querySelector('.RatingBar__RatingContainer-sc-85l9wd-0')) {      // .TitleBlock__Container-sc-1nlhx7j-0
            start();
        } else{
            window.setTimeout(check, 5000);
        }
    })();
  
})()
