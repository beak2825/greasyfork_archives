// ==UserScript==
// @name         Steam Friends Group Marker
// @version      2024-07-02
// @description  Mark logged-in user's friends with logos of specified steam groups
// @author       lyzlyslyc
// @match        http*://steamcommunity.com/profiles/*/friends
// @match        http*://steamcommunity.com/id/*/friends
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/739980
// @downloadURL https://update.greasyfork.org/scripts/499532/Steam%20Friends%20Group%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/499532/Steam%20Friends%20Group%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
     * 在此处添加Steam群组链接列表
     * Add Steam Group URLs Here
     */
    let group_urls = [
        "https://steamcommunity.com/groups/keylol-player-club",
        "https://steamcommunity.com/groups/SteamCN"
    ];

    // No Friends to show, skip fetching
    if(document.querySelectorAll(".friend_block_v2").length==0){
        return;
    }

    group_urls.forEach((group_url)=>{
        group_url = group_url.trim();
        if(!group_url.endsWith("/")){
            group_url+="/";
        }
        console.log(`Checking group members of ${group_url} ...`);
        fetch_group_members(group_url,1);
    })

    function fetch_group_members(group_url,page,logo_url){
        let request_url = group_url + "members?friends=1";
        // We need only contents when extra requests are made
        if(page>1){
            request_url += `&content_only=true&p=${page}`;
        }
        GM_xmlhttpRequest({
            url: request_url,
            onload: (res)=>{
                if(res.finalUrl!=request_url){
                    console.error(`Group member check failed! Please login or check the Steam Group Url! ${group_url}`);
                    return;
                }
                let doc = res.responseXML;
                let links = [];

                // Get Steam Group Logo
                if(page==1){
                    logo_url = doc.querySelector(".grouppage_logo > img").src;
                }

                doc.querySelectorAll(".linkFriend").forEach((ele)=>{links.push(ele.href)});
                document.querySelectorAll(".friend_block_v2").forEach((friend)=>{
                    if(links.indexOf(friend.querySelector("a.selectable_overlay").href)!=-1){
                        let content = friend.querySelector(".friend_block_content");
                        content.innerHTML = `<img width="16" height="16" src="${logo_url}" style="vertical-align: middle;">`+content.innerHTML;
                    }
                });

                // Check whether more requests are needed
                // paging - numbers of paging string
                // 1 - 51 of 112,900 Members => [1,51,112900]
                let paging = doc.querySelector(".group_paging").childNodes[2].textContent.replace(/(,|\.)/g,"").match(/\d+/g);
                if(paging.length==3){
                    if(paging[1]<paging[2]){
                        console.log(`Checking group members of ${group_url}, page ${page+1} ...`);
                        fetch_group_members(group_url,page+1,logo_url);
                    }
                }
            },
            onerror: ()=>{
                console.error("Group member check failed!");
            }
        });
    }
})();