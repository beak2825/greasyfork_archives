// ==UserScript==
// @name         IMDb Utility Library (API)
// @namespace    driver8.net
// @version      0.1.1
// @description  Utility library for the Internet Movie Database. Provides an API for grabbing info from IMDb.com
// @author       driver8
// @match        *://*.imdb.com/*
// @grant        GM_xmlhttpRequest
// @connect      imdb.com
// ==/UserScript==

function getImdbIdFromTitle(title, year) {
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: 'https://www.imdb.com/find?s=tt&q=' + title,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;

                let links = Array.from(doc.querySelectorAll('.result_text > a'));

                // Filter out TV episodes, shorts, and video games
                links = links.filter((el) => !el.parentNode.textContent.trim().match(/\((?:TV Episode|Short|Video Game|Video)\)/));
                let a = links[0];
                if (year) {
                    console.log('year', year);
                    let sorted = links.map((el) => {
                        let m = el.parentNode.textContent.match(/\((\d{4})\)/);
                        let year = new Date().getFullYear();
                        if (m) {
                            year = parseInt(m[1]);
                        }
                        return { el: el, year: year };
                    });
                    sorted = sorted.sort((a, b) => Math.abs(year - a.year) - Math.abs(year - b.year));
                    a = sorted[0].el;
                }

                let id = a && a.href.match(/title\/(tt\d+)/)[1];
                if (id) {
                    resolve(id);
                } else {
                    reject(`Error getting IMDb id for ${title} ${year}`);
                }
            }
        });
    });
}

function getImdbInfoFromId(id) {
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: `https://www.imdb.com/title/${id}/`,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                const parse = function(query, regex) {
                    try {
                        let el = doc.querySelector(query);
                        let text = (el.textContent || el.content).trim();
                        if (regex) {
                            text = text.match(regex)[1];
                        }
                        return text.trim();
                    } catch (e) {
                        //console.log('error', e);
                        return '';
                    }
                };
                let data = {
                    id: id,
                    title: parse('head meta[property="og:title"], .title_wrapper > h1', /([^()]+)/),
                    year: parse('head meta[property="og:title"], .title_wrapper > h1', /\((?:TV\s+(?:Series|Mini-Series|Episode|Movie)\s*)?(\d{4})/),
                    description: parse('.plot_summary > .summary_text').replace(/\s+See full summary\s*»/, ''),
                    rating: parse('.ratingValue > strong > span'),
                    votes: parse('.imdbRating > a > span'),
                    metascore: parse('.metacriticScore > span'),
                    popularity: parse('.titleReviewBarItem:last-of-type > .titleReviewBarSubItem > div > span', /^([0-9,]+)/),
                    dateFetched: new Date()
                };
                if (data && data.id && data.title) {
                    resolve(data);
                } else {
                    reject('Error getting IMDb data for id ' + id);
                }
            }
        });
    });
}

function getImdbInfoFromTitle(title, year) {
    return getImdbIdFromTitle(title, year).then((id) => {
        return getImdbInfoFromId(id);
    });
}
