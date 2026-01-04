// ==UserScript==
// @name         Torn Revive Credibility
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows user voted credibility of other players
// @author       kindly [1956699]
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406100/Torn%20Revive%20Credibility.user.js
// @updateURL https://update.greasyfork.org/scripts/406100/Torn%20Revive%20Credibility.meta.js
// ==/UserScript==


GM_addStyle(`
.vote-bar {
  height: 100%;
  display: flex;
  border-bottom: 1px solid #ccc;
}
.credibility-text-div {
  background-image: linear-gradient(rgb(255, 255, 255) 0%, rgb(221, 221, 221) 100%);
  padding: 15px;
  width: 70%;
  border-right: 1px solid #ccc;
  border-left: 1px solid #fff;
}
.credibility-text {}
.vote-div {
  background-image: linear-gradient(rgb(255, 255, 255) 0%, rgb(221, 221, 221) 100%);
  border-right: 1px solid #ccc;
  border-left: 1px solid #fff;
  padding: 15px;
  width: 15%;
}
.vote-div:hover {
    background-image: linear-gradient( rgb(221, 221, 221) 0%, rgb(255, 255, 255) 100%);
}
.value {
  padding: 5px;
}`);

function rateUser(userID, targetID, vote, action) {
    if (vote == 'positive' && action == "add") {
        postVote(targetID, userID, vote)
        addPositiveUI()
    } else if (vote == 'positive' && action == "remove") {
        postVote(targetID, userID, vote)
        removePositiveUI()
    } else if (vote == 'negative' && action == "add") {
        postVote(targetID, userID, vote)
        addNegativeUI()
    } else if (vote == 'negative' && action == "remove") {
        postVote(targetID, userID, vote)
        removeNegativeUI()
    }
}

function addPositiveUI() {
   $('#upvote').find('i').removeClass("like-icon like-item")
   $('#upvote').find('i').addClass("like-icon like-item voted")
   let value = $('#upvote').find('span')[0].innerHTML
   $('#upvote').find('span')[0].innerHTML = +value + +1
   if ($('#downvote').find('i').attr('class') == "dislike-icon like-item voted") {
       removeNegativeUI()
   }
}

function addNegativeUI() {
    $('#downvote').find('i').removeClass("dislike-icon like-item")
    $('#downvote').find('i').addClass("dislike-icon like-item voted")
    let value = $('#downvote').find('span')[0].innerHTML
    $('#downvote').find('span')[0].innerHTML = +value + +1
   if ($('#upvote').find('i').attr('class') == "like-icon like-item voted") {
       removePositiveUI()
   }
}

function removeNegativeUI() {
    $('#downvote').find('i').removeClass("dislike-icon like-item voted")
    $('#downvote').find('i').addClass("dislike-icon like-item")
    let value = $('#downvote').find('span')[0].innerHTML
    $('#downvote').find('span')[0].innerHTML = +value - +1
}

function removePositiveUI() {
    $('#upvote').find('i').removeClass("like-icon like-item voted")
    $('#upvote').find('i').addClass("like-icon like-item")
    let value = $('#upvote').find('span')[0].innerHTML
    $('#upvote').find('span')[0].innerHTML = +value - +1
}

const getVotes = async (targetID, userID) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://torn-revive-credibility.uc.r.appspot.com/credibility',
            headers: {
                "target_id": targetID,
                "user_id": userID
            },
            onload: (response) => {
                try {
                    const resjson = JSON.parse(response.responseText)
                    resolve(resjson)
                } catch (err) {
                    reject(err)
                }
            },
            onerror: (err) => {
                reject(err)
            }
        })
    })
}

const postVote = async (targetID, userID, vote) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://torn-revive-credibility.uc.r.appspot.com/credibility',
            headers: {
                "target_id": targetID,
                "vote": btoa(userID+';'+vote)
            },
            onload: (response) => {
                try {
                    resolve()
                } catch (err) {
                    reject(err)
                }
            },
            onerror: (err) => {
                reject(err)
            }
        })
    })
}

async function setVotes(targetID, userID) {
    const data = await getVotes(targetID, userID)
    $('#downvote').find('span')[0].innerHTML = data.negatives
    $('#upvote').find('span')[0].innerHTML = data.positives
    if (data.voted == 'Positive') {
        $('#upvote').find('i').removeClass("like-icon like-item")
        $('#upvote').find('i').addClass("like-icon like-item voted")
    } else if (data.voted == 'Negative') {
        $('#downvote').find('i').removeClass("dislike-icon like-item")
        $('#downvote').find('i').addClass("dislike-icon like-item voted")
    }
}

async function waitForEmptyBlock(credibilityBar, userID, targetID) {
    while(!document.querySelector(".empty-block")) {
        await new Promise(r => setTimeout(r, 500));
    }
    $('.empty-block')[0].innerHTML = credibilityBar;
    setVotes(targetID, userID)

    if (userID != targetID) {
        $('#upvote').on('click', function () {
        let upvoteClass = $('#upvote').find('i').attr('class')
        if (upvoteClass == "like-icon like-item") {
            rateUser(userID, targetID, "positive", "add")
        } else if (upvoteClass == "like-icon like-item voted") {
            rateUser(userID, targetID, "positive", "remove")
        }
    });

    $('#downvote').on('click', function () {
        let upvoteClass = $('#downvote').find('i').attr('class')
        if (upvoteClass == "dislike-icon like-item") {
            rateUser(userID, targetID, "negative", "add")
        } else if (upvoteClass == "dislike-icon like-item voted") {
            rateUser(userID, targetID, "negative", "remove")
        }
    });
    }
}

(function() {
    'use strict';

    let targetID;

    const userID = RegExp(/XID=(\d+)/).exec($('.settings-menu').find('a').attr('href'))[1]
    if ($(location).attr('href').includes('profiles.php')) {
        targetID = RegExp(/XID=(\d+)/).exec($(location).attr('href'))[1];
    }
    let credibilityBar =
    `<div class="vote-bar">
        <div class="credibility-text-div">
            <span class="credibility-text">
                Revive Credibility
            </span>
        </div>
        <div id="upvote" class="vote-div">
            <span class="value">0</span><i class="like-icon like-item"></i>
        </div>
        <div id="downvote" class="vote-div">
            <span class="value">0 </span><i class="dislike-icon like-item"></i>
        </div>
    </div>`;

    waitForEmptyBlock(credibilityBar, userID, targetID)

})();



