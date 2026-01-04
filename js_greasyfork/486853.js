// ==UserScript==
// @name         Add to radarr from mdblist
// @namespace    http://tampermonkey.net/
// @version      2024-02-07
// @description  Adds buttons to mdblist that interact with radarr
// @author       alfablac
// @match        https://mdblist.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdblist.com
// @grant        GM.xmlHttpRequest
// @grant        GM.notification
// @grant        GM.openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486853/Add%20to%20radarr%20from%20mdblist.user.js
// @updateURL https://update.greasyfork.org/scripts/486853/Add%20to%20radarr%20from%20mdblist.meta.js
// ==/UserScript==

let RADARR_URL = ""
let RADARR_APIKEY = ""
let RADARR_ROOTF = ""
let RADARR_DEFAULTPROF = 0
let RADARR_MONITORED = false
let RADARR_AVAIL = "inCinemas" // "announced", "inCinemas", "released"


const linkStyle = "\
display: block;\
background-color: rgb(255, 255, 255);\
color: white;\
border: none;\
border-radius: 5px;\
cursor: pointer;\
font-size: 16px;\
float: right;\
width: 24px;\
heigth: 24px;\
"
;
const addButtonStyle = "\
display: block;\
background-color: rgb(76, 175, 80);\
color: white;\
border: none;\
border-radius: 5px;\
cursor: pointer;\
font-size: 16px;\
float: right;\
width: 24px;\
heigth: 24px;\
"
;
const plusIconUrl = "https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/plus.svg"; 



function get_radarr_movies() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: RADARR_URL.concat("/api/v3/movie"),
                headers: {
                    "X-Api-Key": RADARR_APIKEY,
                    "Accept": "application/json"
                },
                onload: function(response) {
                    if (response.status == 200) {
                        const responseJSON = JSON.parse(response.responseText);
                        resolve(responseJSON)
                    } else if (response.status == 401) {
                        GM.notification("Error: Invalid Radarr API Key.", "MDB To Radarr");
                    } else {
                        GM.notification("Error: Status " + response.status, "MDB To Radarr");
                    }
                },
                onerror: function() {
                    GM.notification("Request Error.\nCheck Radarr URL!", "MDB To Radarr");
                    reject("Request Aborted");
                },
                onabort: function() {
                    GM.notification("Request is aborted.", "MDB To Radarr");
                    reject("Request Aborted");
                }
            });
        });
}

function checkMovieInRadarr(movieId) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: RADARR_URL.concat("/api/v3/movie/lookup/imdb?imdbId=", movieId),
            headers: {
                "X-Api-Key": RADARR_APIKEY,
                "Accept": "application/json"
            },
            onload: function(response) {
                let responseJSON = null;
                if (!response.responseJSON) {
                    if (response.status == 401) {
                        GM.notification("Error: Invalid Radarr API Key.", "MDB To Radarr");
                        reject("Invalid Radarr API Key");
                    } else if (!response.responseText) {
                        GM.notification("No results found.", "MDB To Radarr");
                        reject("No results found");
                    }
                    responseJSON = JSON.parse(response.responseText);
                    resolve(responseJSON);
                }
            },
            onerror: function() {
                GM.notification("Request Error.\nCheck Radarr URL!", "MDB To Radarr");
                reject("Request Error");
            },
            onabort: function() {
                GM.notification("Request is aborted.", "MDB To Radarr");
                reject("Request Aborted");
            }
        });
    });
}

function clickswap (imdbid, titleSlug) {
    let radarr_url = RADARR_URL;
    let button = document.getElementById("radarr-" + imdbid)
    button.firstChild.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACTFBMVEUAAAD//////////////vu1t7j/zFCGiYz////+/v4xNjs7QEUpLjP////7+/smKzBHS09VWV1obG/////////////Z2tv/////////////////////yUdQVFg/Q0imqKp2enz19va2t7n///+XmZyTlZj/4JOOkJOEh4n/8tTY2trV1tf/9+L////r7Oz///////84PEEuMjdLT1RCRkv/zlmMj5FaXWGVl5plaGzq6+yYmpx0d3rU1dZ8f4L8/f3v7/C+wMG6u72bnaD/5qmgo6WsrrD/67mxs7XOz9H//PT///////////////////////////////////////////////82Oj//xDX/xj3/zE2JjI9SVlr/0mVdYWV4e3//1nLn5+jg4eKGiYttcHSAg4b/2XzMzc+wsrTGx8ijpqj/5KCdn6H/7cC9vsC6vL2+wMH////Q0dL/8c3k5eX/+evp6en19fXy8vL9/f3////l5ubz8/T///////////////////////////////////////////////////9YXGD/z1r/13b////c3d7HyMmqrK7s7O2Ii43/24X4+Pjy8/Opq63/7sT4+PjExcf9/f3R0tP/89bf4OHl5ubl5ebk5ebj4+Tt7u7/////////////////////////////////////////////////////wjAkKS4XHCEaHyT/wCkiJywYHiMfJSobICYhJiv/vyQeIygcIicVGh//wSz/vyctMTYSGB0KDxUSFx1vUO58AAAAsHRSTlMA5eTH5u77+uPx/fz+8uX++/r31Xkg9drSOhIJ/Pv79vb19fPz8/Pz8+vq6uno57yj/f38+/r5+fj49/f39vb19fT09PDw7+7u6+bOybimlHFgWCkeGAb+/v38+vn4+Pf39vb29vX19PTz8/Hw7e3t7Ovr6+jn5+bm5d3Y18G0sZuPi4J9ZF5EDwz5+fb19fX19PT08/Pv7ezs6+vq6ejo6Ojn3suvl5GHbFRQSjECARZmqHoAAAO5SURBVEjHjZXle9NQFMbblEFSN9Yic0UmbGMbc2FjbsBwd3d3d3d3t+ZG2yTrgH+MJPfmCQ8k3c6Hfjq/5n3Pvee9Fq0uDZw8Fg509XwabxlVDdhcqzObq2/W1h8OThy5/WKxq7HCSQHAMt7mjM7+wRH6J3Y3+HkqSsrF8KBso6voQsL+H8UZKRJDaiVSFbW7ihNZ6XfVSXJjlKV4llO+Qnlurwr1TTQVFM5kGfmPneltO/IcIKqwoKT6bvj8d2PgK+Gj5H7HbhzD8MJ8j0KTHChtdJ2YYAicTiYZMuqcilnlwrBpyzlescILa5OtH42snEgDJMnW4HI7RB6lANUK66lreBOc9B9gW6IArZjarCLurXZkxbGZsH35DxgnA1SS0jtlukpY8Zfp0IoALm8giueaAWMWR3I7cGTFz4uKFYqblYy9H28CjI3FFs/BkPskB7LizM4I9A8aA3SEpldOQcjBPDuAIy7bSHRfMAEikVhk/T70kf01UQreFt8GImgGRIZii7aMQUh7BRDU2xLNyzptDEBk5h6k61CLg+XUEWdnnTMCUMWHlk3B4UEeaHYqVhiQdnieKaBaye1AyFS/IH9EsFedMQOQrsmzNStJw/KhSJWdZgAqOnblAbSCt5dwJJ8SMAc0K/TK6ZBopUhuxlFzQLeycDaU5eOjw0dGAcTjufATbdRoAFo5EDQqUliQUJI+JwjsLWFLzU0j+bkdaKwKMPyzPJwIiNNXpyM1r/OeyZI4z+pec4Cmx2qL4U5y/NqMYfd/VeJzjQAkfo52yNtLeQHk425H+rWg2eWLRe7sQ2qep4s8Q0rZeM6s+p5BLTUkHVDFL3uKLsTBHHXnGOHJi0yiVwscWyarA8oqbEPira2pcKt/risgwuf1FX3oBRoQ/2vZdvsoUV02cQ1RcGa+RQcet8+QfrcpwOSh9dooX+V7KEZZZzGlseAdClkEbMIK81O3K43btMA4kDMMs09KbXIdg+06UD4Nxw65oQ74u8OrRdKahlDfv+l6vNKPWWGh0FvL81roWXvnWf6tD7UgG9f7C1eQMFbZpZuInm8Gcf+Z8EpbMQymt7tlBgpue0t914DFqOaH0iRq+c5Ct9W9f6ePFaD4ulWhs2avXF+WH/CC3bvUaxfg48P7kwtOQfFGNam7ygEYTuRFDr4JZU2uIjhKkxpvu+5jRfhSc2BBzr235/RRGtsoykpLFQBgAWVfdws/e9EyUl0KhjJuVK+oKW+q2nVSf6ESygoe7woEOotOTUjc9weXiUPgDnteIQAAAABJRU5ErkJggg==";
    button.firstChild.style.cssText = linkStyle;
    button.style.cssText = linkStyle;
    button.href = `${RADARR_URL}/movie/${titleSlug}`;
    button.target = `_blank`;
    button.onclick = () => {
        event.preventDefault();
        GM.openInTab(radarr_url.concat("/movie/", titleSlug), "active");
    };
}

function addMovieToRadarr (movie, imdbid) {
    movie.qualityProfileId = RADARR_DEFAULTPROF;
    movie.rootFolderPath = RADARR_ROOTF;
    movie.monitored = RADARR_MONITORED;
    movie.minimumAvailability = RADARR_AVAIL;
    movie.addOptions = {searchForMovie: false};
    GM.xmlHttpRequest({
        method: "POST",
        url: RADARR_URL.concat("/api/v3/movie"),
        headers: {
            "X-Api-Key": RADARR_APIKEY,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(movie),
        onload: function(response) {
            const responseJSON = JSON.parse(response.responseText);
            if (response.status == 201) {
                clickswap(imdbid, responseJSON.titleSlug);
            } else {
                console.log("Error: " + responseJSON[0].errorMessage, "MDB To Radarr");
            }
        },
        onerror: function() {
          GM.notification("Request Error.\nCheck Radarr URL!", "MDB To Radarr");
        },
        onabort: function() {
          GM.notification("Request is aborted.", "MDB To Radarr");
        }
    });
}



async function handleMovies(ALL_MOVIES) {
    let movies = document.querySelectorAll(".card > .content");

    for (let movie of movies) {
        let link = movie.querySelector('[href*="tt"]');
        let href = link.getAttribute("href");
        let movieId = 'tt' + href.match(/tt(\d+)/)[1];

        try {
            let existingMovie = ALL_MOVIES.find(movie => movie.imdbId === movieId);

            if (existingMovie) {
                let radarrLink = document.createElement("a");
                radarrLink.onclick = () => {
                    event.preventDefault();
                    GM.openInTab(`${RADARR_URL}/movie/${existingMovie.tmdbId}`, "active");
                };
                let radarrIcon = document.createElement("img");
                radarrIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACTFBMVEUAAAD//////////////vu1t7j/zFCGiYz////+/v4xNjs7QEUpLjP////7+/smKzBHS09VWV1obG/////////////Z2tv/////////////////////yUdQVFg/Q0imqKp2enz19va2t7n///+XmZyTlZj/4JOOkJOEh4n/8tTY2trV1tf/9+L////r7Oz///////84PEEuMjdLT1RCRkv/zlmMj5FaXWGVl5plaGzq6+yYmpx0d3rU1dZ8f4L8/f3v7/C+wMG6u72bnaD/5qmgo6WsrrD/67mxs7XOz9H//PT///////////////////////////////////////////////82Oj//xDX/xj3/zE2JjI9SVlr/0mVdYWV4e3//1nLn5+jg4eKGiYttcHSAg4b/2XzMzc+wsrTGx8ijpqj/5KCdn6H/7cC9vsC6vL2+wMH////Q0dL/8c3k5eX/+evp6en19fXy8vL9/f3////l5ubz8/T///////////////////////////////////////////////////9YXGD/z1r/13b////c3d7HyMmqrK7s7O2Ii43/24X4+Pjy8/Opq63/7sT4+PjExcf9/f3R0tP/89bf4OHl5ubl5ebk5ebj4+Tt7u7/////////////////////////////////////////////////////wjAkKS4XHCEaHyT/wCkiJywYHiMfJSobICYhJiv/vyQeIygcIicVGh//wSz/vyctMTYSGB0KDxUSFx1vUO58AAAAsHRSTlMA5eTH5u77+uPx/fz+8uX++/r31Xkg9drSOhIJ/Pv79vb19fPz8/Pz8+vq6uno57yj/f38+/r5+fj49/f39vb19fT09PDw7+7u6+bOybimlHFgWCkeGAb+/v38+vn4+Pf39vb29vX19PTz8/Hw7e3t7Ovr6+jn5+bm5d3Y18G0sZuPi4J9ZF5EDwz5+fb19fX19PT08/Pv7ezs6+vq6ejo6Ojn3suvl5GHbFRQSjECARZmqHoAAAO5SURBVEjHjZXle9NQFMbblEFSN9Yic0UmbGMbc2FjbsBwd3d3d3d3t+ZG2yTrgH+MJPfmCQ8k3c6Hfjq/5n3Pvee9Fq0uDZw8Fg509XwabxlVDdhcqzObq2/W1h8OThy5/WKxq7HCSQHAMt7mjM7+wRH6J3Y3+HkqSsrF8KBso6voQsL+H8UZKRJDaiVSFbW7ihNZ6XfVSXJjlKV4llO+Qnlurwr1TTQVFM5kGfmPneltO/IcIKqwoKT6bvj8d2PgK+Gj5H7HbhzD8MJ8j0KTHChtdJ2YYAicTiYZMuqcilnlwrBpyzlescILa5OtH42snEgDJMnW4HI7RB6lANUK66lreBOc9B9gW6IArZjarCLurXZkxbGZsH35DxgnA1SS0jtlukpY8Zfp0IoALm8giueaAWMWR3I7cGTFz4uKFYqblYy9H28CjI3FFs/BkPskB7LizM4I9A8aA3SEpldOQcjBPDuAIy7bSHRfMAEikVhk/T70kf01UQreFt8GImgGRIZii7aMQUh7BRDU2xLNyzptDEBk5h6k61CLg+XUEWdnnTMCUMWHlk3B4UEeaHYqVhiQdnieKaBaye1AyFS/IH9EsFedMQOQrsmzNStJw/KhSJWdZgAqOnblAbSCt5dwJJ8SMAc0K/TK6ZBopUhuxlFzQLeycDaU5eOjw0dGAcTjufATbdRoAFo5EDQqUliQUJI+JwjsLWFLzU0j+bkdaKwKMPyzPJwIiNNXpyM1r/OeyZI4z+pec4Cmx2qL4U5y/NqMYfd/VeJzjQAkfo52yNtLeQHk425H+rWg2eWLRe7sQ2qep4s8Q0rZeM6s+p5BLTUkHVDFL3uKLsTBHHXnGOHJi0yiVwscWyarA8oqbEPira2pcKt/risgwuf1FX3oBRoQ/2vZdvsoUV02cQ1RcGa+RQcet8+QfrcpwOSh9dooX+V7KEZZZzGlseAdClkEbMIK81O3K43btMA4kDMMs09KbXIdg+06UD4Nxw65oQ74u8OrRdKahlDfv+l6vNKPWWGh0FvL81roWXvnWf6tD7UgG9f7C1eQMFbZpZuInm8Gcf+Z8EpbMQymt7tlBgpue0t914DFqOaH0iRq+c5Ct9W9f6ePFaD4ulWhs2avXF+WH/CC3bvUaxfg48P7kwtOQfFGNam7ygEYTuRFDr4JZU2uIjhKkxpvu+5jRfhSc2BBzr235/RRGtsoykpLFQBgAWVfdws/e9EyUl0KhjJuVK+oKW+q2nVSf6ESygoe7woEOotOTUjc9weXiUPgDnteIQAAAABJRU5ErkJggg==";

                radarrIcon.alt = "Radarr";
                radarrIcon.style.cssText = linkStyle;
                radarrLink.appendChild(radarrIcon);
                radarrLink.style.cssText = linkStyle;
                movie.appendChild(radarrLink);
            } else {
                let addButton = document.createElement("button");
                addButton.id = 'radarr-' + movieId;
                addButton.innerHTML = `<img src="${plusIconUrl}" alt="Add">`;
                let j = await checkMovieInRadarr(movieId);
                addButton.onclick = () => {
                    event.preventDefault();
                    addMovieToRadarr(j, movieId);
                };
                addButton.style.cssText = addButtonStyle;
                movie.appendChild(addButton);
            }
        } catch (error) {
            console.error("Error occurred while checking movie in Radarr:", error);
        }
    }
}


let ALL_MOVIES = get_radarr_movies();
handleMovies(ALL_MOVIES);



