// ==UserScript==
// @name         ViewCount Invdious Fix
// @namespace    NLion74/invidious-scripts/ViewCountInvidiousFix.user.js
// @version      0.1
// @description  Show ViewCount for a video on invidious instances, because it didnt work for me even on public instances. https://nlion.nl/
// @author       nlion
// @match        https://*/watch?v=*
// @connect      returnyoutubedislikeapi.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE60lEQVR42q1XQ5glaRCstX1a277ON7Zt27batm3btm3bto1/Mw5vWqra7jLTiOSELP/888/b69ev/3nXrl1bDh48eP7o0aN3ab9H1xfo2dYNGzb88u+//77NLeXy559/vrJ169bfTp48ee/Ro0f+Wlpalfb29j1+fn4joaGh49hx7eDg0KutrV31+PHjwFOnTj2kf/4ggV9dFPNt27b9evHiRS1NTc3asLCw8fLyctbW1sa6u7tZT0/PlB3P8K6iooJFRESMk6D1ly5d0tu+ffsfH3300UuCGK9evfrNI0eOXFBQUCiNi4tjLS0tDAy6urpYZ2fnvDu+wbetra0sISGBKSkpVZCbrqxZs4afazZu3PjRuXPnNGxtbQfq6upATERc8I5/6+vrGbln8MKFC3qbNm36ZF7mFEQfktlMfXx8xtrb2/lozMsiHR0dzN/ff+zKlSvWpODHszJfvnz562fPnlX28vIa5Uu8AwwECEPBOkbW1Vy5cuWbMwSgVDpqbm7ei0Diw1izqJNdzOhkZS38hYBVra2t+w8dOnR6CvPNmzd/JSEhkVlZWcnL7K0dnexQSif7OryTpTaQr7v4u6O6uppJS0vnbdmy5bsXAlCOPw4KCuIdcNC4iDRPaehi7R3CA5NSmp0+fVqSw7J27drPJSUl02trayEhb00a6utYclLi/wpKZIasrGwOVdWvuX379h1xdHTsh2RCtEhKSmJPnz5lVVVVgrMF/7u6ug7u37//DHf+/HkzEBMoAHKbUTAxSlncCxYgLS2NUZW14x48eJBeVlYmSIumpiZmZ2fHbt++zag/MBQsIf/jWwQ89Y18TkpKqqWhoUGQ9Pn5+Sw8PJx5e3szKrMoMoKtACXk5OS6OEVFxYHm5mZBAkRGRrLs7GyGwL137x40EWwF9ApVVdVRwQKgUEFzUZ/w9PRksEJAQADuBQsgxAXQEO0WJp9SWO7evcuePHmC9MIzIS7o5O7fv58mCkK+6ZeYmIjrF8/c3d0ZrBAYGIh7vooggPM4ag4mIMjXfNAewEQkMM6oBXfu3EFd4GUF8EpNTUUa2nJ79+49RDndj594VDD4H/6bQdDNzY3BCsHBwbhfUAAXFxcUolMcIZVPqRGlLlCK8RMiH3AL17PmNerC8+fPGWIKz+ZTREZGJnvdunVfcVhOnDjxUOS/hZpIXl4erucqr+zYsWMsJCRkTlp4TkCWEXAV40QLQaUvxMTE0hEYc0kOrVB+a2pq5q1ut27dmjMWRPFCzS+HIMC3UzDBgQMHDpmZmfVQns/4EZAqOjqaGRsbs5SUlHnjBJZUUVGBpXA/A5BYWlr2UQ85MQMRLVu27DXq0fIeHh6jYDhLAcIOIryQz2w0gDUJ9qmuWLHijblA6fuUGobAhUsJSkHL19d3jACvOYHSDxdCxh+QlCpWVlZ98PdiYTmyCxCf2r4mID/HZ1m1atUbhw8fPk2lsigmJoahVwgdTDDMYKjBcIMhB8MOJ3Sh+e4nklxVTU2tilJrvLS0FEVIxGTKWIZneIeyjnlRQ0OjhoYRTRrvfuEWs/z6668vU8r8RLXiJoEXb3V19VIbG5suqojDBGRHqfKN4prM3E1Myx4+fOhL394h1PvLH3/88Qq3lAsRfJNA7Pc7d+5cT2l7kkx7FTtdn6JnG6iy/UDT9FtCaP4Huc4TMWKLwA0AAAAASUVORK5CYII=
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/459200/ViewCount%20Invdious%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/459200/ViewCount%20Invdious%20Fix.meta.js
// ==/UserScript==

let dislike_api = "https://returnyoutubedislikeapi.com/votes?videoId=";
let video_data = JSON.parse(document.getElementById('video_data').innerHTML);

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
                $views_count.innerHTML = '<p id="views"><i class="icon ion-ios-eye"></i> ' + jsonData.viewCount + '</p>'
            },
            anonymous: true
        });
    }
    let $views_count = document.getElementById("views");

    doRequest(video_data.id);
})();
