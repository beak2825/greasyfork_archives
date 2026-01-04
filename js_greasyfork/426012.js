// ==UserScript==
// @name         2ch-notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Появляется уведомление, когда появился новый ответ на твой пост в треде, где ты отписался
// @author       user661
// @match        https://*/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/426012/2ch-notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/426012/2ch-notifications.meta.js
// ==/UserScript==

(function() {
    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    };

    var getReMyPosts = function() {
        var myPosts = JSON.parse(localStorage['de-myposts']);
        let reMyPosts = {};
        for (const key in myPosts) {
            reMyPosts[key] = {};
        }
        for (const key in myPosts) {
            for (const key2 in myPosts[key]) {
                reMyPosts[key][myPosts[key][key2][1]] = [];
            }
            for (const key2 in myPosts[key]) {
                reMyPosts[key][myPosts[key][key2][1]][reMyPosts[key][myPosts[key][key2][1]].length ? reMyPosts[key][myPosts[key][key2][1]].length : 0] = key2;
            }
        }
        return reMyPosts;
    }

    var timerIds = [];
    if (!GM_getValue("not-first")) {
        GM_setValue("posts-viewed", "");
    }
    GM_setValue("not-first", true);

    if (location.hostname === '2ch.hk') {
        for (var i = 0; i < timerIds.length; i++) {
            clearInterval(timerIds[i]);
        }
        let reMyPosts = getReMyPosts();
        console.log(reMyPosts);
        for (const board in reMyPosts) {
            for (const thread in reMyPosts[board]) {
                var minimum = Infinity;
                for (var val of reMyPosts[board][thread]) {
                    if (val < minimum) {
                        minimum = val;
                    }
                }
                const MINIMUM = minimum;
                timerIds.push(setInterval(function(){
                    getJSON('https://2ch.hk/makaba/mobile.fcgi?task=get_thread&board=' + board + '&thread=' + thread + '&num=' + MINIMUM,
                            function(err, data) {
                        if (err !== null) {
                            console.log('Something went wrong: ' + err);
                        } else {
                            let reMyPosts = getReMyPosts();
                            //console.log(reMyPosts);
                            //console.log(MINIMUM);
                            for (var i = 0; i < data.length; i++) {
                                var regExp = />>>([0-9]+)<\/a>/g;
                                var matches = [];
                                var m = regExp.exec(data[i]["comment"]);
                                while (m !== null) {
                                    matches.push(m[1]);
                                    m = regExp.exec(data[i]["comment"]);
                                }
                                //console.log(matches);
                                //console.log(data[i]);
                                if (matches) {
                                    var hasMatch = false;
                                    for (var k = 0; k < matches.length; k++) {
                                        console.log(reMyPosts[board][thread]);
                                        console.log(matches[k]);
                                        if (reMyPosts[board][thread].includes(matches[k])) {
                                            //console.log("ok");
                                            hasMatch = true;
                                            break;
                                        }
                                    }
                                    //console.log(GM_getValue("posts-viewed"));
                                    if (hasMatch) {
                                        var postsViewed = GM_getValue("posts-viewed").split(",");
                                        //console.log(postsViewed);
                                        //console.log(data[i]["num"]);
                                        if (!postsViewed.includes(data[i]["num"].toString())) {
                                            //console.log(data[i]["num"]);
                                            const j = i;
                                            GM_notification ( {title: 'Новое сообщение!', text: "2ch.hk", onclick: () => {window.open("https://2ch.hk/" + board + "/res/" + thread + ".html#" + data[j]["num"]);}});
                                            GM_setValue("posts-viewed", GM_getValue("posts-viewed") + "," + data[i]["num"]);
                                        }
                                    }
                                }
                            }
                        }
                    });}, 20000));
            }
        }
    }
})();