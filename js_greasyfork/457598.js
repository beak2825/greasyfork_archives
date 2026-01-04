// ==UserScript==
// @name         Weebpocalypse list linking
// @namespace    jwfiredragon
// @version      1.1
// @description  Allows linking user anime lists in Weebpocalypse
// @author       jwfiredragon
// @match        https://jwfiredragon.github.io/weebpocalypse/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/457598/Weebpocalypse%20list%20linking.user.js
// @updateURL https://update.greasyfork.org/scripts/457598/Weebpocalypse%20list%20linking.meta.js
// ==/UserScript==

var description = document.getElementById("description");
description.innerHTML = '<p>Currently using: Default list</p>';

var username = prompt("Enter your MAL username, or leave blank to use the default list:", "");

if(username != "" && username != null) {
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.myanimelist.net/v2/users/${username}/animelist?status=completed&limit=1000&fields=alternative_titles`,
        headers: {
            "X-MAL-CLIENT-ID": "865edc428f4197b494945019f50eb1b5"
        },
        onload: function(response) {
            if(response.readyState === 4 && response.status === 200) {
                var animes = JSON.parse(response.responseText);
                var u_anime_list = [];
                Object.values(animes.data).forEach(val => {
                    var title = val.node.title;
                    var title_en = val.node.alternative_titles.en;
                    if(title_en === title || title_en === "") {
                        u_anime_list.push(title.replace("\"", "'"));
                    }
                    else {
                        u_anime_list.push((`${title} / ${title_en}`).replace("\"", "'"));
                    }
                });
                unsafeWindow.anime_list = u_anime_list;
                description.innerHTML = `<p>Currently using: ${username}'s list</p>`;
            }
            else {
                alert(`Error: ${response.status} ${response.statusText}`);
            }
        }
    });
}