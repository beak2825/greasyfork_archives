// ==UserScript==
// @name         Return YouTube Dislike for Invidious
// @namespace    Invidious
// @version      0.4
// @description  Show dislikes for a video on all invidious instances. https://nlion.nl/
// @author       NLion74, ccuser44
// @license      MIT
// @match        https://*/watch?v=*
// @connect      returnyoutubedislikeapi.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE60lEQVR42q1XQ5glaRCstX1a277ON7Zt27batm3btm3bto1/Mw5vWqra7jLTiOSELP/888/b69ev/3nXrl1bDh48eP7o0aN3ab9H1xfo2dYNGzb88u+//77NLeXy559/vrJ169bfTp48ee/Ro0f+Wlpalfb29j1+fn4joaGh49hx7eDg0KutrV31+PHjwFOnTj2kf/4ggV9dFPNt27b9evHiRS1NTc3asLCw8fLyctbW1sa6u7tZT0/PlB3P8K6iooJFRESMk6D1ly5d0tu+ffsfH3300UuCGK9evfrNI0eOXFBQUCiNi4tjLS0tDAy6urpYZ2fnvDu+wbetra0sISGBKSkpVZCbrqxZs4afazZu3PjRuXPnNGxtbQfq6upATERc8I5/6+vrGbln8MKFC3qbNm36ZF7mFEQfktlMfXx8xtrb2/lozMsiHR0dzN/ff+zKlSvWpODHszJfvnz562fPnlX28vIa5Uu8AwwECEPBOkbW1Vy5cuWbMwSgVDpqbm7ei0Diw1izqJNdzOhkZS38hYBVra2t+w8dOnR6CvPNmzd/JSEhkVlZWcnL7K0dnexQSif7OryTpTaQr7v4u6O6uppJS0vnbdmy5bsXAlCOPw4KCuIdcNC4iDRPaehi7R3CA5NSmp0+fVqSw7J27drPJSUl02trayEhb00a6utYclLi/wpKZIasrGwOVdWvuX379h1xdHTsh2RCtEhKSmJPnz5lVVVVgrMF/7u6ug7u37//DHf+/HkzEBMoAHKbUTAxSlncCxYgLS2NUZW14x48eJBeVlYmSIumpiZmZ2fHbt++zag/MBQsIf/jWwQ89Y18TkpKqqWhoUGQ9Pn5+Sw8PJx5e3szKrMoMoKtACXk5OS6OEVFxYHm5mZBAkRGRrLs7GyGwL137x40EWwF9ApVVdVRwQKgUEFzUZ/w9PRksEJAQADuBQsgxAXQEO0WJp9SWO7evcuePHmC9MIzIS7o5O7fv58mCkK+6ZeYmIjrF8/c3d0ZrBAYGIh7vooggPM4ag4mIMjXfNAewEQkMM6oBXfu3EFd4GUF8EpNTUUa2nJ79+49RDndj594VDD4H/6bQdDNzY3BCsHBwbhfUAAXFxcUolMcIZVPqRGlLlCK8RMiH3AL17PmNerC8+fPGWIKz+ZTREZGJnvdunVfcVhOnDjxUOS/hZpIXl4erucqr+zYsWMsJCRkTlp4TkCWEXAV40QLQaUvxMTE0hEYc0kOrVB+a2pq5q1ut27dmjMWRPFCzS+HIMC3UzDBgQMHDpmZmfVQns/4EZAqOjqaGRsbs5SUlHnjBJZUUVGBpXA/A5BYWlr2UQ85MQMRLVu27DXq0fIeHh6jYDhLAcIOIryQz2w0gDUJ9qmuWLHijblA6fuUGobAhUsJSkHL19d3jACvOYHSDxdCxh+QlCpWVlZ98PdiYTmyCxCf2r4mID/HZ1m1atUbhw8fPk2lsigmJoahVwgdTDDMYKjBcIMhB8MOJ3Sh+e4nklxVTU2tilJrvLS0FEVIxGTKWIZneIeyjnlRQ0OjhoYRTRrvfuEWs/z6668vU8r8RLXiJoEXb3V19VIbG5suqojDBGRHqfKN4prM3E1Myx4+fOhL394h1PvLH3/88Qq3lAsRfJNA7Pc7d+5cT2l7kkx7FTtdn6JnG6iy/UDT9FtCaP4Huc4TMWKLwA0AAAAASUVORK5CYII=
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/479297/Return%20YouTube%20Dislike%20for%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/479297/Return%20YouTube%20Dislike%20for%20Invidious.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2022 Niko
Copyright (c) 2023 ccuser44

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let dislike_api = "https://returnyoutubedislikeapi.com/votes?videoId=";
let video_data = JSON.parse(document.getElementById('video_data').innerHTML);
let user_language = navigator.language || navigator.userLanguage || "en";

(function() {
    'use strict';

    function doRequest(videoId) {
        let response = GM_xmlhttpRequest({
            method: 'GET',
            url: dislike_api + videoId,
            responseType: 'json',
            timeout: 10000,
            onload: function(data) {
                let jsonData = {};
                jsonData = JSON.parse(data.responseText);
                $dislike_count.innerHTML = '<p id="dislikes"><i class="icon ion-ios-thumbs-down"></i> ' + (jsonData.dislikes - 0).toLocaleString(user_language) + '</p>';
                $rating.innerHTML = 'Rating: ' + (Math.round( jsonData.rating * 100 + Number.EPSILON ) / 100).toLocaleString(user_language) + ' / 5';
				console.log(Number.EPSILON);

				if ((/^\s*0\s*$/).test($like_count.textContent)) {
					console.log("Video dislikes are 0. API count is: " + jsonData.likes);
					$like_count.innerHTML = '<p id="likes"><i class="icon ion-ios-thumbs-up"></i> ' + (jsonData.likes - 0).toLocaleString(user_language) + '🔁</p>';
				};
            },
            anonymous: true
        });
    }
    let $dislike_count = document.getElementById("dislikes");
    $dislike_count.style.display = null;
    $dislike_count.style.visibility = null;

	let $like_count = document.getElementById("likes")

    let $rating = document.getElementById("rating");
    $rating.style.display = null;
    $rating.style.visibility = null;

    doRequest(video_data.id);
})();
