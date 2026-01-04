// ==UserScript==
// @name         MAL Show AniDB Staff
// @namespace    malanidbstaff
// @version      2
// @description  Add staff table from anidb to any anime on mal
// @author       elpo
// @match        https://myanimelist.net/anime/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @include      https://myanimelist.net/anime.php*
// @icon         http://i.imgur.com/b7Fw8oH.png
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant GM.log
// @license  GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/466809/MAL%20Show%20AniDB%20Staff.user.js
// @updateURL https://update.greasyfork.org/scripts/466809/MAL%20Show%20AniDB%20Staff.meta.js
// ==/UserScript==
GM_addStyle(".credit { border: solid 1px rgba(255,255,255,.1); }");
GM_addStyle(".staff-entry { display: grid; grid-template-columns: 1fr 1fr; border-bottom: solid 1px rgba(255,255,255,.1); }");
GM_addStyle(".staff-entry > * { font-size: 12px; padding: 5px; }");
GM_addStyle(".collapsible {background-color: #121212; color: #e0e0e0; cursor: pointer; padding: 18px;width: 100%; border: solid 1px rgba(255,255,255,.1); text-align: left; outline: none; font-size: 15px;}");
GM_addStyle(".active, .collapsible:hover { background-color:  #181818;} ");
GM_addStyle(".content { display: none;}");

(function() {
    'use strict';
    // Your code here...
    const url = location.pathname; //Create a new global variable to detect the url
    function hide_children(element) {
        let children = element.children;
        for (let i = 0; i < children.length; ++i) {
            children[i].style.display = 'none';
        }
    }
    function show_children(element) {
        let children = element.children;
        for (let i = 0; i < children.length; ++i) {
            children[i].style.display = 'grid';
        }
    }
    function create_episode_view(stafflist, number_of_episodes){
        var episode_view_div = document.createElement('div');

        let ep_divs = []
        for(let i = 0; i < number_of_episodes; i++){
            let episode = document.createElement('button');
            episode.classList.add("collapsible");
            episode.addEventListener("click", function() {
                if (this.classList.contains("active")) {
                    hide_children(this)
                } else {
                    show_children(this)
                }
                this.classList.toggle("active");

            });
            episode.innerHTML = "Episode: " + (i+1);
            ep_divs.push(episode);

        }

        let current_credit = "non-overwritten";
        Array.from(stafflist.getElementsByClassName("eprange")).forEach(ep_range => {
            let ep_num = ep_range.innerHTML.split(",").map(ep_num => Number(ep_num));
            ep_num = ep_num.map( (ep_entry, index) => {
                if(!ep_entry){
                    let range_nums = [];
                    let range_txt = ep_range.textContent.split(",")[index]
                    let lower_bound = Number(range_txt.split("-")[0])
                    let upper_bound = Number(range_txt.split("-")[1])
                    for(let i = lower_bound; i <= upper_bound; i++){
                        range_nums.push(i);
                    }
                    return range_nums;
                }
                else{
                    return ep_entry;
                }

            });
            ep_num = ep_num.flat().filter(e => !isNaN(e))

            if(ep_range.parentElement){

                if(ep_range.parentElement.id.length > 1){
                    current_credit = ep_range.parentElement.firstChild.nextSibling.innerHTML;

                }

                ep_num.forEach(num => {
                    let e = document.createElement('div');
                    e.classList.add("content");
                    e.classList.add("staff-entry");

                    let role = document.createElement('div');
                    let person = document.createElement('div');

                    role.innerHTML = current_credit
                    person.innerHTML = ep_range.previousElementSibling.innerHTML;
                    e.appendChild(role);
                    e.appendChild(person);

                    ep_divs[num-1].appendChild(e);

                });
            }
        });

        ep_divs.forEach(div => episode_view_div.appendChild(div));
        return episode_view_div;
    }

    function getAnime(animeid){
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://anidb.net/anime/" + animeid,
            onload: function(response) {
                //want <div class="g_section g_bubble staff">
                // Create a new parser instance and pass our html string.
                const parser = new DOMParser();
                const html = parser.parseFromString(response.responseText, 'text/html');
                let links = html.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                    links[i].href = 'https://anidb.net/creator/' + links[i].href.split('/').slice(-1)[0];
                }

                let number_of_episodes = 0;
                if(html.querySelector('[itemprop=numberOfEpisodes]')){
                    number_of_episodes = Number( html.querySelector('[itemprop=numberOfEpisodes]').textContent );
                }
                const stafflist = html.getElementById('stafflist').innerHTML;

                const epView = create_episode_view(html.getElementById('stafflist'), number_of_episodes);
                epView.id = "ep-view-div";
                epView.style.display = "none";


                let anidbstaffDiv = document.createElement('div');
                anidbstaffDiv.innerHTML = stafflist;
                anidbstaffDiv.setAttribute("id", "anidbstaff");
                anidbstaffDiv.style.display = "none";



                let btn1 = document.createElement("BUTTON");
                btn1.innerHTML = "Toggle AniDB Staff";
                btn1.style = "width: 200px; height:35px; background-color: #121212; color: #e0e0e0; margin: 10px; border: solid 1px rgba(255,255,255,.1);";
                btn1.setAttribute('content', 'Hide anidb staff');
                btn1.onclick = () => {
                    let elem = document.getElementById("anidbstaff");
                    if (elem.style.display === "none") { elem.style.display = "block"; } else { elem.style.display = "none"; }
                };
                let btn2 = document.createElement("BUTTON");
                btn2.innerHTML = "Toggle Episode Staff";
                btn2.style = "width: 200px; height:35px; background-color: #121212; color: #e0e0e0; margin: 10px; border: solid 1px rgba(255,255,255,.1);";
                btn2.setAttribute('content', 'Toggle Episode Staff');
                btn2.onclick = () => {
                    let elem = document.getElementById("ep-view-div");
                    if (elem.style.display === "none") { elem.style.display = "block"; } else { elem.style.display = "none"; }
                };

                document.getElementsByClassName("detail-characters-list")[1].appendChild(btn1);
                document.getElementsByClassName("detail-characters-list")[1].appendChild(btn2);
                document.getElementsByClassName("detail-characters-list")[1].appendChild(document.createElement("div"));
                document.getElementsByClassName("detail-characters-list")[1].appendChild(anidbstaffDiv);
                document.getElementsByClassName("detail-characters-list")[1].appendChild(epView);


            }
        });
    }

    function get_history(mal_id){
        GM.xmlHttpRequest({
            method: "GET",
            url: "http://www.example.com/",
            onload: function(response) {
                alert(response.responseText);
            }
        });
    }

    window.onload = function() { //When the page finishes loading
        const links = document.getElementsByClassName("external_links");

        let id;
        for(let i = 0; i < links.length; i++){
            let link = links[i].childNodes[0].href;
            if(link.toString().includes("anidb")){
                id = link.substring(link.indexOf("id="));
                id = id.split("=")[1];
            }
        }

        if(id && document.getElementsByClassName("detail-characters-list").length > 1){
            getAnime(id);
            GM.log("AniDB staff added to page.")
        }

    };
})();