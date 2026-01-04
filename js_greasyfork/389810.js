// ==UserScript==
// @name         RottenTomatoes Utility Library (custom API)
// @namespace    driver8.net
// @version      0.1.11
// @description  Utility library for Rotten Tomatoes. Provides an API for grabbing info from rottentomatoes.com
// @author       driver8
// @grant        GM_xmlhttpRequest
// @connect      rottentomatoes.com
// ==/UserScript==

console.log('hi rt api lib');

const MAX_YEAR_DIFF = 2;
const MAX_RESULTS = 100;

function _parse(query, regex, doc) {
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

function jsonParse(j) {
    try {
        let result = JSON.parse(j);
        return result;
    } catch(e) {
        //console.log('RT error', e);
        return null;
    }
}

function getRtIdFromTitle(title, tv, year) {
    tv = tv || false;
    year = parseInt(year) || 1800;
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'json',
            url: `https://www.rottentomatoes.com/api/private/v2.0/search/?limit=${MAX_RESULTS}&q=${title}`,
            onload: (resp) => {
                let movies = tv ? resp.response.tvSeries : resp.response.movies;
                if (!Array.isArray(movies) || movies.length < 1) {
                    console.log('no search results');
                    reject('no results');
                    return;
                }

                let sorted = movies.concat();
                if (year && sorted) {
                    sorted.sort((a, b) => {
                        if (Math.abs(a.year - year) !== Math.abs(b.year - year)) {
                            // Prefer closest year to the given one
                            return Math.abs(a.year - year) - Math.abs(b.year - year);
                        } else {
                            return b.year - a.year; // In a tie, later year should come first
                        }
                    });
                }
                //console.log('sorted', sorted);

                // Search for matches with exact title in order of proximity by year
                let bestMatch, closeMatch;
                for (let m of sorted) {
                    m.title = m.title || m.name;
                    if (m.title.toLowerCase() === title.toLowerCase()) {
                        bestMatch = bestMatch || m;
                        console.log('bestMatch', bestMatch);
                    // RT often includes original titles in parentheses for foreign films, so only check if they start the same
                    } else if (m.title.toLowerCase().startsWith(title.toLowerCase())) {
                        closeMatch = closeMatch || m;
                        console.log('closeMatch', closeMatch);
                    }
                    if (bestMatch && closeMatch) {
                        break;
                    }
                }
                //console.log('sorted', sorted, 'bestMatch', bestMatch, 'closeMatch', closeMatch, movies);

                // Fall back on closest year match if within 2 years, or whatever the first result was.
                // RT years are often one year later than imdb, or even two
                function yearComp(imdb, rt) {
                    return rt - imdb <= MAX_YEAR_DIFF && imdb - rt < MAX_YEAR_DIFF;
                }
                if (year && (!bestMatch || !yearComp(year, bestMatch.year))) {
                    if (closeMatch && yearComp(year, closeMatch.year)) {
                        bestMatch = closeMatch;
                    } else if (yearComp(year, sorted[0].year)) {
                        bestMatch = sorted[0];
                    }
                }
                bestMatch = bestMatch || closeMatch || movies[0];

                if (bestMatch) {
                    let id = bestMatch && bestMatch.url.replace(/\/s\d{2}\/?$/, ''); // remove season suffix from tv matches
                    console.log('found id', id);
                    resolve(id);
                } else {
                    console.log('no match found on rt');
                    reject('no suitable match');
                }
            }
        });
    });
}

function getRtInfoFromId(id) {
    return new Promise(function(resolve, reject) {
        if (!id || typeof id !== 'string' || id.length < 3) {
            console.log('invalid id');
            reject('invalid id');
        }
        let url = 'https://www.rottentomatoes.com' + id + (id.startsWith('/tv/') ? '/s01' : ''); // Look up season 1 for TV shows
        //console.log('url', url);
        GM_xmlhttpRequest({
            method: 'GET',
            //responseType: 'document',
            url: url,
            onload: (resp) => {
                //console.log('resp', resp);
                let text = resp.responseText;
                //console.log('text', text);

                // Create DOM from responseText
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = text;
                //console.log('doc', doc);
                let year = parseInt(_parse('.h3.year, .movie_title .h3.subtle, .meta-row .meta-value time', /(\d{4})/, doc));

                // Find the javascript snippet storing the tomatometer/score info.
                // Everything is named different for TV shows for some stupid reason.
                let m = text.match(/root\.RottenTomatoes\.context\.scoreInfo = ({.+});/);
                m = m || text.match(/root\.RottenTomatoes\.context\.scoreboardCriticInfo = ({.+});/);
                let dataString = m?.[1];
                let scoreInfo = dataString && jsonParse(dataString);
                let scorescript = doc.querySelector('#score-details-json');
                let sb = scorescript && JSON.parse(scorescript.innerHTML);
                let scoreboard = sb?.scoreboard;
                let all = scoreInfo?.tomatometerAllCritics ?? scoreInfo?.all ?? sb?.modal.tomatometerScoreAll ?? {},
                    top = scoreInfo?.tomatometerTopCritics ?? scoreInfo?.top ?? sb?.modal.tomatometerScoreTop ?? {};
                //console.log('scoreInfo', scoreInfo);
                //console.log('scoreboard', scoreboard);

                // TV consensus is stored in a totally different object :/
                m = text.match(/root\.RottenTomatoes\.context\.result =\s+({.+});\n/);
                //console.log('m[1]', m?.[1]);
                let fixedJson = m?.[1].replace(/:undefined/g, ':null');
                //console.log('fixedJson', fixedJson);
                let contextResult = m && jsonParse(fixedJson);
                //console.log('contextResult', contextResult);
                let sd = contextResult?.seasonData;

                if (all) {
                    // Try field names used for movie data, then TV show data.
                    const data = {
                        id: id,
                        score: parseInt(all?.score ?? all?.tomatometer ?? scoreboard?.tomatometerScore ?? sd?.tomatometerScoreAll?.score ?? -1),
                        rating: parseFloat(all?.avgScore ?? all?.averageRating ?? sd?.tomatometerScoreAll?.averageRating ?? -1),
                        votes: parseInt(all?.numberOfReviews ?? all?.totalCount ?? all?.ratingCount ?? all?.reviewCount ?? scoreboard?.tomatometerCount ?? sd?.tomatometerScoreAll?.reviewCount ?? 0),
                        consensus: all?.consensus ?? sd?.tomatometerScoreAll?.consensus ?? doc.querySelector('.what-to-know__section-body > span, .mop-ratings-wrap__text--concensus')?.innerHTML, // TV consensus is stored in a totally different object :/
                        state: all?.tomatometerState ?? all?.state ?? scoreboard?.tomatometerState ?? sd?.tomatometerScoreAll?.state,
                        topScore: parseInt(top?.score ?? top?.tomatometer ?? sd?.tomatometerScoreTop?.score ?? -1),
                        topRating: parseFloat(top?.avgScore ?? top?.averageRating ?? sd?.tomatometerScoreAll?.averageRating ?? -1),
                        topVotes: parseInt(top?.numberOfReviews ?? top?.totalCount ?? top?.ratingCount ?? top?.reviewCount ?? sd?.tomatometerScoreAll?.reviewCount ?? 0),
                        year: year,
                        fetched: new Date()
                    };

                    console.log('found data', data);
                    resolve(data);
                } else {
                    reject('error getting rt info for id ' + id);
                }
            }
        });
    });
}

function getRtInfoFromTitle(title, tv, year) {
    return getRtIdFromTitle(title, tv, year).then((id) => {
        return getRtInfoFromId(id);
    })
}