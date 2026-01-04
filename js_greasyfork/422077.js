// ==UserScript==
// @name         IMDb Info On Netflix
// @description  Detailed IMDB info to Netflix titles
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Atakan
// @include      https://www.netflix.com/browse*
// @include      https://www.netflix.com/title/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422077/IMDb%20Info%20On%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/422077/IMDb%20Info%20On%20Netflix.meta.js
// ==/UserScript==

(function() {
    $('head').append(`<style>
                a.slnk {margin-left: 10px; margin-top:5px;}
                a.slnk img {width: 25px; height: 25px;}
                </style>`);
    //Check if clicked the title
    var waitUp = false;

    //main loop
    var refreshId = setInterval(function() {
        if($('div.PlayerControlsNeo__button-control-row').length){
            //video is playing so stop the script
            clearInterval(refreshId);
        }
        else if($('div.previewModal--detailsMetadata-right').length && !waitUp){
            //clicked on title details so load the imdb score
            loadImdbScore();
            waitUp = true;
        }
        else if($('div.previewModal--detailsMetadata-right').length == 0) //title details is closed so don't try to load imdb score again by changing waitUp
            waitUp = false;
    }, 1000);

    function loadImdbScore() {
        var a = document.getElementsByClassName("playerModel--player__storyArt detail-modal");
        var x = document.getElementsByClassName("videoMetadata--second-line");
        if(a.length > 0 && x.length > 0){
            var title = a[0].alt;
            var yearArray = x[0].innerText.split('\n');
            var year = parseInt(yearArray[0]);
            var seasonArray = yearArray[2].split("Season");
            var season;
            if(seasonArray.length > 1)
                season = parseInt(seasonArray[0].trim());
            if(season)
                year = year - season + 1;
            console.log(title);
            console.log(year);
            var z;
            main();
            async function main() {
                $('<img>').attr('src', "https://i.imgur.com/1Aatim3.gif").attr('width', 20).attr('id', "imdbInfoLoading")
                    .appendTo('.videoMetadata--container:first');
                z = await getImdbInfoFromTitle(title, year);
                console.log(z);
                document.getElementById("imdbInfoLoading").remove();
                var color;
                if(z.rating < 6)
                    color = "orangered";
                else if(z.rating >= 6 && z.rating < 7.0)
                    color = "gold";
                else if (z.rating >= 7)
                    color = "lime";
                var imdb = 'https://www.imdb.com/title/' + z.id;
                $('<a>').attr('href', imdb).attr('target', '_blank').addClass('slnk')
                    .html('<img src="https://i.imgur.com/uKZrahf.png"> ')
                    .appendTo('.videoMetadata--container:first');
                $('<b>').attr('span', imdb).attr("style","line-height:25px; margin-left: 5px; color:" + color).html(z.rating)
                    .appendTo('.videoMetadata--container:first');
                if(z.yourRating !== ""){
                    $('<img src="https://i.imgur.com/vc5GCnu.png" title="Rated">').attr("style","width: 25px; height: 25px; margin-left: 5px;")
                    .appendTo('.videoMetadata--container:first');
                }
            }
        }
    }


    //IMDB LIBRARY MODIFIED
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
                    console.log(links);
                    //links = links.filter((el) => el.outerText == title); //aggressive imdb search filter for the titles that are not exactly same as the netflix title
                    let a = links[0];

                    //Sort for year
                    /*
                    if (year) {
                        //console.log('year', year);
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
                    */

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
                        yourRating: parse('.star-rating-value'),
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
})();