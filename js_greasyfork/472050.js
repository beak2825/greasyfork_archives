// ==UserScript==
// @name         Arcaea Score Update
// @namespace    arcaea-score-update
// @version      1.2.3
// @icon         https://chinosk.top/g.jpg
// @description  Upload your Arcaea score to bot.
// @author       Chinosk
// @match        https://arcaea.lowiro.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/472050/Arcaea%20Score%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/472050/Arcaea%20Score%20Update.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "30px";
    div.style.right = "30px";
    div.style.backgroundColor = "#ccc";
    div.style.padding = "3px"
    div.style.maxWidth = "250px"

    let fromRankRatio = document.createElement("input");
    fromRankRatio.type = "radio";
    fromRankRatio.name = "inputType";
    fromRankRatio.id = "inputFromRankRatio";
    fromRankRatio.checked = true;
    let fromRankLabel = document.createElement("label");
    fromRankLabel.htmlFor = "inputFromRankRatio";
    fromRankLabel.textContent = "From Rank";
    fromRankLabel.style.marginRight = "2px";

    let fromPaidRatio = document.createElement("input");
    fromPaidRatio.type = "radio";
    fromPaidRatio.name = "inputType";
    fromPaidRatio.id = "inputFromPaid";
    let fromPaidLabel = document.createElement("label")
    fromPaidLabel.htmlFor = "inputFromPaid";
    fromPaidLabel.textContent = "From Purchase";

    let syncCookieCheck = document.createElement("input");
    syncCookieCheck.type = "checkbox";
    syncCookieCheck.id = "syncCookieCheck";
    syncCookieCheck.checked = true;
    let syncCookieLabel = document.createElement("label")
    syncCookieLabel.htmlFor = "syncCookieCheck";
    syncCookieLabel.textContent = "Upload Cookie";

    let buttonUpdateMe = document.createElement("button");
    buttonUpdateMe.innerHTML = "Update Me";
    buttonUpdateMe.style.width = "100%";
    buttonUpdateMe.style.height = "40px";
    buttonUpdateMe.style.marginBottom = "2px";

    let buttonDefaultText = "Update Bests";
    let button = document.createElement("button");
    button.innerHTML = buttonDefaultText;
    button.style.width = "100%";
    button.style.height = "40px";
    button.style.marginBottom = "2px";

    let buttonStop = document.createElement("button");
    buttonStop.innerHTML = "Stop";
    buttonStop.style.width = "100%";
    buttonStop.style.height = "40px";
    buttonStop.style.marginBottom = "2px";
    buttonStop.style.display = "none";

    let buttonClose = document.createElement("button");
    buttonClose.innerHTML = "Close";
    buttonClose.style.width = "100%";
    buttonClose.style.height = "40px";
    buttonClose.style.marginBottom = "2px";

    let querySelfRatio = document.createElement("input");
    querySelfRatio.type = "radio";
    querySelfRatio.name = "queryType";
    querySelfRatio.id = "queryTypeSelf";
    querySelfRatio.checked = true;
    let querySelfLabel = document.createElement("label")
    querySelfLabel.htmlFor = "queryTypeSelf";
    querySelfLabel.textContent = "Update Self Bests";

    let queryOthersRatio = document.createElement("input");
    queryOthersRatio.type = "radio";
    queryOthersRatio.name = "queryType";
    queryOthersRatio.id = "queryTypeOthers";
    let queryOthersLabel = document.createElement("label")
    queryOthersLabel.htmlFor = "queryTypeOthers";
    queryOthersLabel.textContent = "Update Others Bests";

    let queryOtherInput = document.createElement("select");
    queryOtherInput.style.width = "100%"
    queryOtherInput.style.display = "none"

    div.appendChild(fromRankRatio);
    div.appendChild(fromRankLabel);
    div.appendChild(fromPaidRatio);
    div.appendChild(fromPaidLabel);
    div.appendChild(document.createElement("br"));
    div.appendChild(syncCookieCheck);
    div.appendChild(syncCookieLabel);
    let syncCookieBr = document.createElement("br");
    div.appendChild(syncCookieBr);

    div.appendChild(querySelfRatio)
    div.appendChild(querySelfLabel)
    div.appendChild(document.createElement("br"));
    div.appendChild(queryOthersRatio)
    div.appendChild(queryOthersLabel)
    let queryOthersBr = document.createElement("br");
    div.appendChild(queryOthersBr);
    div.appendChild(queryOtherInput)

    div.appendChild(buttonUpdateMe);
    div.appendChild(button);
    div.appendChild(buttonStop);
    div.appendChild(buttonClose);
    let powerLabel = document.createElement("label");
    powerLabel.innerHTML = "Powered By @Chinosk";
    powerLabel.style.fontSize = "10px";
    div.appendChild(powerLabel);
    document.body.appendChild(div);

    let stopQueryFlag = false;

    buttonClose.addEventListener("click", () => {
        div.style.display = "none";
    })

    buttonStop.addEventListener("click", () => {
        stopQueryFlag = true;
    })

    querySelfRatio.addEventListener("change", onQueryRatioChange);
    queryOthersRatio.addEventListener("change", onQueryRatioChange);
    fromPaidRatio.addEventListener("change", () => {
        if (fromPaidRatio.checked) {
            querySelfRatio.checked = true;
            onQueryRatioChange();
            queryOthersRatio.style.display = "none";
            queryOthersLabel.style.display = "none";
            queryOthersBr.style.display = "none";
        }
    })
    fromRankRatio.addEventListener("change", () => {
        if (fromRankRatio.checked) {
            queryOthersRatio.style.display = "";
            queryOthersLabel.style.display = "";
            queryOthersBr.style.display = "";
        }
    })

    function GM_Fetch(details) {
        let saveResp = null;
        let det = {
            method: details.method,
            redirect: 'follow',
            credentials: "include"
        };
        if (details.headers) {
            det.headers = details.headers;
        }
        if (details.data) {
            det.body = details.data;
        }
        fetch(details.url, det)
            .then(response => {
                saveResp = response;
                return response.text();
            })
            .then(result => {
                let newResp = {};
                newResp.responseText = result;
                newResp.responseHeaders = saveResp.headers;
                newResp.status = saveResp.status;
                details.onload(newResp);
            })
            .catch(error => {
                if (!details.onerror) {
                    console.log("Request error", error);
                    alert("Request error: " + error);
                }
                details.onerror(error);
            });
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const notSupportReq = typeof GM_xmlhttpRequest !== 'function';
    let RequestFunc;
    if (isIOS || notSupportReq) {
        console.log("isIOS", isIOS, "notSupportReq", notSupportReq);
        syncCookieCheck.checked = false;
        syncCookieCheck.setAttribute("disabled", "true");
        syncCookieLabel.textContent += "(系统限制, 无法同步 Cookie)";
        RequestFunc = GM_Fetch;
    }
    else {
        RequestFunc = GM_xmlhttpRequest;
    }

    function onQueryRatioChange() {
        if (queryOthersRatio.checked) {
            fromRankRatio.checked = true;
            queryOtherInput.style.display = "";
            queryOtherInput.innerHTML = "";
            syncCookieCheck.style.display = "none";
            syncCookieLabel.style.display = "none";
            syncCookieBr.style.display = "none";
            RequestFunc({
                method: "GET",
                url: "https://webapi.lowiro.com/webapi/user/me",
                withCredentials: true,
                onload: (response) => {
                    let user_me_json = JSON.parse(response.responseText);
                    if (user_me_json.success) {
                        for (const friends of user_me_json.value.friends) {
                            let optionElem = document.createElement('option');
                            optionElem.value = friends.user_id;
                            optionElem.text = friends.name;
                            queryOtherInput.appendChild(optionElem)
                        }
                    }
                },
                onerror: (response) => {
                    alert("Get friend list failed. " + response.status + " " + response.responseText)
                }
            });
        }
        else {
            queryOtherInput.style.display = "none";
            syncCookieCheck.style.display = ""
            syncCookieLabel.style.display = ""
            syncCookieBr.style.display = ""
        }

    }

    buttonUpdateMe.addEventListener("click", () => {
        RequestFunc({
            method: "GET",
            url: "https://webapi.lowiro.com/webapi/user/me",
            withCredentials: true,
            onload: (response) => {
                let user_me_json = JSON.parse(response.responseText);
                if (user_me_json.success) {
                    uploadUserMeDataToServer(JSON.parse(response.responseText), getSetCookieFromStr(response.responseHeaders));
                    alert("success.");
                }
            },
            onerror: (response) => {
                alert("Get friend list failed. " + response.status + " " + response.responseText)
            }
        });
    })

    button.addEventListener("click", () => {
        try {
            button.setAttribute("disabled", "true")
            RequestFunc({
                method: "GET",
                url: "https://webapi.lowiro.com/webapi/user/me",
                withCredentials: true,
                onload: (response) => {
                    let user_me_json = JSON.parse(response.responseText);
                    if (!user_me_json.success) {
                        endQuery();
                        alert("Get user info failed!");
                        return;
                    }
                    if (querySelfRatio.checked) {
                        uploadUserMeDataToServer(JSON.parse(response.responseText), getSetCookieFromStr(response.responseHeaders));
                        if (fromRankRatio.checked) {
                            updateData(user_me_json);
                        }
                        else if (fromPaidRatio.checked) {
                            updateDataFromPurchase(user_me_json);
                        }
                    }
                    else if (queryOthersRatio.checked) {
                        let queryUserId = parseInt(queryOtherInput.value);
                        let friendData = null;
                        for (const friends of user_me_json.value.friends) {
                            if (friends.user_id === queryUserId) {
                                friendData = friends;
                                break;
                            }
                        }
                        if (friendData !== null) {
                            user_me_json.value.rating = friendData.rating;
                            user_me_json.value.user_id = friendData.user_id;
                            user_me_json.value.is_skill_sealed = friendData.is_skill_sealed;
                            user_me_json.value.join_date = friendData.join_date;
                            user_me_json.value.character = friendData.character;
                            user_me_json.value.recent_score = friendData.recent_score;
                            user_me_json.value.name = friendData.name;
                            user_me_json.value.display_name = friendData.name;
                            user_me_json.value.user_id = friendData.user_id;
                            user_me_json.value.user_code = "000000000";
                            updateData(user_me_json);
                        }
                        else {
                            endQuery();
                        }
                    }

                },
                onerror: (response) => {
                    endQuery();
                }
            });
        }
        catch (e) {
            endQuery();
            alert(`Error: ${e}`);
            throw e
        }
    });

    window.onerror = (message, source, line, column, error) => {
        endQuery();
        const errorMessage = error ? error.message : message;
        alert(`Error: ${errorMessage}`);
        console.log(error);
    };

    function endQuery() {
        button.removeAttribute("disabled");
        button.innerHTML = buttonDefaultText;
        buttonStop.style.display = "none";
    }

    function uploadUserMeDataToServer(user_me_json, cookieSid) {
        if (!user_me_json.success) {
            return;
        }
        let reqHeaders = {
            "Content-Type": "application/json"
        };
        if (syncCookieCheck.checked) {
            reqHeaders["Sync-Sid"] = cookieSid;
        }

        RequestFunc({
            method: "POST",
            url: "https://www.chinosk6.cn/arcscore/update/me",
            headers: reqHeaders,
            data: JSON.stringify(user_me_json),
            onload: (response) => {
                if (response.status !== 200) {
                    throw Error("Upload user info failed.");
                }
            }
        });
    }

    function uploadBestDataToServer(data_json) {
        console.log("Upload Data", data_json);
        RequestFunc({
            method: "POST",
            url: "https://www.chinosk6.cn/arcscore/update/bests",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data_json),
            onload: (response) => {
                if (response.status !== 200) {
                    throw Error("Upload bests failed.");
                }
                else {
                    alert("Upload Success!");
                }
            }
        });
    }

    function updateDataFromPurchase(user_me_json) {
        let user_id = user_me_json["value"]["user_id"];
        let user_name = user_me_json["value"]["name"];
        let user_character = user_me_json["value"]["character"];
        let user_is_skill_sealed = user_me_json["value"]["is_skill_sealed"];
        // let user_rating = user_me_json["value"]["rating"]

        RequestFunc({
            method: "GET",
            url: "https://webapi.lowiro.com/webapi/score/rating/me",
            onload: (response) => {
                let data = JSON.parse(response.responseText)
                if ((response.status === 200) && data.success) {
                    let postData = []
                    for (let i of data["value"]["best_rated_scores"]) {
                        postData.push({
                            "user_id": user_id,
                            "song_id": i.song_id,
                            "difficulty": i.difficulty,
                            "score": i.score,
                            "shiny_perfect_count": 0,
                            "perfect_count": 0,
                            "near_count": 0,
                            "miss_count": 0,
                            "health": 100,
                            "modifier": i.modifier,
                            "time_played": Math.round(new Date().getTime()),
                            "best_clear_type": i.clear_type,
                            "clear_type": i.clear_type,
                            "name": user_name,
                            "character": user_character,
                            "is_skill_sealed": user_is_skill_sealed,
                            "is_char_uncapped": true,
                            "rank": 1
                        })
                    }
                    uploadBestDataToServer(postData);
                }
                else {
                    alert(`Get rating failed (${response.status}).\n${response.responseText}`);
                }
                endQuery();
            },
            onerror: (response) => {
                endQuery();
            }
        });
    }

    function updateData(user_me_json) {
        let user_id = user_me_json.value.user_id;
        let user_rating = user_me_json.value.rating;

        RequestFunc({
            method: "GET",
            url: "https://www.chinosk6.cn/arcscore/get_slst",
            onload: (response) => {
                if (response.status !== 200) {
                    throw Error("Get song list failed.");
                }

                let songs = JSON.parse(response.responseText)
                songs.sort((a, b) => b.rating - a.rating);
                startCalcB30(songs, user_rating / 100, user_id)
                    .then((results) => {
                        if (results !== null) {
                            if (results.length > 0) {
                                button.innerHTML = "Uploading...";
                                uploadBestDataToServer(results);
                            }
                        }
                        endQuery();
                    })
            }
        });
    }

    async function startCalcB30(songs, user_rating, user_id) {
        function calcSongRating(sid, difficultyIndex, score) {
            let result = 0;
            for (const songsKey in songs) {
                if ((songs[songsKey].sid === sid) && (songs[songsKey].difficulty === difficultyIndex)) {
                    const rating = songs[songsKey].rating / 10;
                    if (score < 9800000) {
                        result = rating + (score - 9500000) / 300000
                    }
                    else if (9800000 <= score <= 10000000) {
                        result = rating + 1 + (score - 9800000) / 200000
                    }
                    else if (score <= 10020000) {
                        result = rating + 2
                    }
                    else {
                        result = rating + 1 + (score - 9800000) / 200000
                    }
                    break;
                }
            }
            if (result < 0) result = 0;
            return result;
        }

        let retData = []
        function getRetMinRating (maxCount=40) {
            retData.sort((a, b) => {return b.rating - a.rating;});
            retData = retData.slice(0, maxCount);
            return retData[retData.length - 1].rating;
        }

        let querySongs = []
        for (let n in songs) {
            if (songs[n].rating <= 0) {
                continue;
            }
            querySongs.push(songs[n]);
        }
        querySongs.sort((a, b) => {return b.rating - a.rating;})

        button.innerHTML = `Query song (0)`;
        buttonStop.style.display = ""
        let endPoint = "https://webapi.lowiro.com/webapi/score/song/friend"
        if (querySelfRatio.checked) {
            endPoint = "https://webapi.lowiro.com/webapi/score/song/me"
        }

        for (let n in querySongs) {
            let songId = songs[n].sid;
            let songDifficulty = songs[n].difficulty;
            if (stopQueryFlag) {
                buttonStop.style.display = "none";
                stopQueryFlag = false;
                return null;
            }
            button.innerHTML = `Query song (${parseInt(n) + 1})...`
            const response = await new Promise((resolve, reject) => {
                RequestFunc({
                    method: "GET",
                    url: `${endPoint}?song_id=${songId}&difficulty=${songDifficulty}&start=0&limit=30`,
                    onload: (response) => {
                        resolve(response);
                    },
                    onerror: (error) => reject(error),
                });
            });
            let currData = getScoreFromFriendRank(response.responseText, user_id);
            if (currData !== null) {
                currData.rating = calcSongRating(currData.song_id, currData.difficulty, currData.score)
                console.log(currData)
                if (retData.length >= 40) {
                    let minRt = getRetMinRating();
                    if (querySongs[n].rating / 10 + 2 < minRt) {
                        break;
                    }
                }
                retData.push(currData);
            }
        }
        buttonStop.style.display = "none"
        return retData;
    }

    function getScoreFromFriendRank(responseText, user_id) {
        let data = JSON.parse(responseText);
        if (data.success) {
            if (data.value && (data.value.length > 0)) {
                for (const i of data.value) {
                    if (i.user_id.toString() === user_id.toString()) {
                        return i;
                    }
                }
            }
        } else {
            console.log("Query bests failed: ", responseText);
            if (data.error_code === 1) {
                responseText += "\n访问被拒绝，可能需要订阅 Arcaea Online."
            }
            alert(`Query bests failed:\n${responseText}`);
            stopQueryFlag = true;
        }
        return null;
    }

    function getSetCookieFromStr(cookieStr) {
        if (!(typeof cookieStr === "string")) {
            return null;
        }
        let setCookie = cookieStr.match(/set-cookie\s*:\s*([\s\S]+?)\n/i);
        if (setCookie) {
            for (let spData of setCookie[1].split(";")) {
                spData = spData.trim();
                if (spData.startsWith("sid=")) {
                    return spData.trim();
                }
            }
        }
        return null;
    }
})();
