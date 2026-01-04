// ==UserScript==
// @name        MyAnimeList friend scores on AniList
// @namespace   https://greasyfork.org/users/412318
// @include     *://anilist.co/*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @version     1.0
// @author      henrik9999
// @run-at      document-idle
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @description This script adds friendscores from MyAnimeList to the AniList page
// @downloadURL https://update.greasyfork.org/scripts/407725/MyAnimeList%20friend%20scores%20on%20AniList.user.js
// @updateURL https://update.greasyfork.org/scripts/407725/MyAnimeList%20friend%20scores%20on%20AniList.meta.js
// ==/UserScript==

//------Options-------
//if it should show only on the social tab (true/false) could be buggy if disabled
const social = true
//--------------------


let url;

fullUrlChangeDetect(async function() {
    $(document).ready(function() {
        url = window.location.href.split(/[?#]/)[0];
        console.log(url)
        const type = url.split("/")[3];
        if (type === "anime" || type === "manga") {
            const aniId = url.split("/")[4]
            if(social && !url.endsWith("social")) return;
            getMalId(aniId, type.toUpperCase())
        }
    });
});

function getMalId(aniId, type) {
    if (sessionStorage.getItem('malId' + type + aniId)) {
        getFriendScores(sessionStorage.getItem('malId' + type + aniId), type);
        return;
    }
    const query = `
    query ($id: Int, $type: MediaType) {
      Media (id: $id, type: $type) {
        idMal
      }
    }`;

    GM.xmlHttpRequest({
        url: 'https://graphql.anilist.co',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json'
        },
        data: JSON.stringify({
            query,
            variables: {
                id: aniId,
                type: type
            }
        }),
        onload: function(res) {
            const {
                data
            } = JSON.parse(res.response);
            if (data.Media && data.Media["idMal"]) {
                console.log("got malId", data.Media["idMal"])
                sessionStorage.setItem('malId' + type + aniId, data.Media["idMal"]);
                getFriendScores(data.Media["idMal"], type)
            } else {
                console.log("could not find malId")
            }
        }
    });
}

function getFriendScores(malId, type) {
    console.log("getting friendscores " + malId)
    if (sessionStorage.getItem('friendScores' + type + malId)) {
        addFriendScores(JSON.parse(sessionStorage.getItem('friendScores' + type + malId)));
        return;
    }
    GM.xmlHttpRequest({
        url: 'https://myanimelist.net/' + type.toLowerCase() + "/" + malId + "/title/stats",
        method: 'GET',
        onload: function(res) {
            const friendTable = $('table.table-recently-updated > tbody > tr', $(res.responseText)).not(":contains('Eps Seen')");
            const array = [];
            if (friendTable && friendTable.length) {
                friendTable.each((index, element) => {
                    const userImage = $(element).find("td.borderClass.di-t.w100 > div.di-tc:not('.pl4') > a").css('background-image');
                    const userName = $(element).find("td.borderClass.di-t.w100 > div.di-tc.pl4 > a").text().trim();
                    const userHref = $(element).find("td.borderClass.di-t.w100 > div.di-tc.pl4 > a").attr("href");
                    const userStatus = $(element).find("td:nth-child(3)").text().trim();
                    const userScore = $(element).find("td:nth-child(2)").text().replace(/\D+/g, '');
                    array.push({
                        userImage,
                        userName,
                        userHref,
                        userStatus,
                        userScore
                    });
                })
                sessionStorage.setItem('friendScores' + type + malId, JSON.stringify(array));
                addFriendScores(array);
            } else {
                console.log("no friendscores found")
            }
        }
    });
}
let interval;

function addFriendScores(data) {
    clearInterval(interval);
    interval = waitUntilTrue(
        function() {
            if ($('.emoji-spinner').length || document.readyState !== 'complete') return false;
            return $("div.following").length;
        },
        function() {
            console.log("adding friendscores ", data)
            GM_addStyle(`
              .followMAL {
                  align-items: center;
                  background: rgb(var(--color-foreground));
                  border-radius: 3px;
                  display: grid;
                  font-size: 1.4rem;
                  grid-template-columns: 30px 2fr 1fr .5fr;
                  margin-bottom: 10px;
                  padding: 10px;
                  border: rgb(var(--color-text)) solid 1px;
              }
              .avatarMAL {
                  background-position: 50%;
                  background-repeat: no-repeat;
                  background-size: cover;
                  border-radius: 3px;
                  height: 30px;
                  width: 30px;
              }

              .nameMAL {
                  padding-left: 15px;
                  font-weight: 500;
              }
            `)
            data.forEach(friend => {
                if (!$("div.following > *:contains(" + friend.userName + ")").length) {
                    let element = $("<a/>").attr("href", friend.userHref).attr("target", "_blank").addClass("followMAL");
                    element.append($("<div/>").addClass("avatarMAL").css("background-image", friend.userImage))
                    element.append($("<div/>").addClass("nameMAL").text(friend.userName));
                    element.append($("<div/>").addClass("statusMAL").text(friend.userStatus));
                    if (friend.userScore) {
                        element.append($("<span/>").text(friend.userScore + "/10"));
                    }
                    if(url.endsWith("social")) {
                      $("div.following").append(element);
                    } else {
                      if (!$("div.following > div.limit").length) $("div.following").append($("<div/>").addClass("limit"))
                      if($("div.following > div.limit > a").length < 4) {
                        $("div.following > div.limit").append(element);
                      }
                    }
                }
            });
        },
    );
}


function waitUntilTrue(condition, callback, interval = 100) {
    const intervalId = setInterval(function() {
        if (condition()) {
            clearInterval(intervalId);
            callback();
        }
    }, interval);

    return intervalId;
}

function fullUrlChangeDetect(callback) {
    let currentPage = '';
    const intervalId = setInterval(function() {
        if (currentPage !== window.location.href) {
            currentPage = window.location.href;
            callback();
        }
    }, 100);

    return Number(intervalId);
}