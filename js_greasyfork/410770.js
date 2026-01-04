// ==UserScript==
// @name           Slo-Tech-Blocker
// @namespace      https://greasyfork.org/en/users/240861-erol444
// @description    Block all the annoying Slo-Tech users
// @author         Erol444
// @grant       GM.setValue
// @grant       GM.getValue
// @include        *slo-tech.com/forum/*
// @include        *slo-tech.com/novice/*

// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/410770/Slo-Tech-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/410770/Slo-Tech-Blocker.meta.js
// ==/UserScript==

'use strict';

let blocked = {
    'users': []
};

function start (){
    // Read blocked users
    GM.getValue("Slo-Tech-Blocker").then((data) => {
        if(data){
            try{
                blocked = JSON.parse(data);
            }
            catch(e){
                console.log("Error while parsing GM data",e);
                GM.deleteValue("Slo-Tech-Blocker")
            }
        }
        console.log("BlockedUsers ", blocked);
        blockPosts();
    })
}

function BlockUser(user) {
    console.log("Blocking user ", user);
    if(!blocked.users) blocked.users = [];
    blocked.users.push(user);
    GM.setValue('Slo-Tech-Blocker', JSON.stringify(blocked));
    blockPosts();
  }

function blockPosts (){
    // Read blocked users
    const posts = document.getElementsByClassName("post");

    for(let i = 0; i < posts.length; i++){
        const href = posts[i]
            .getElementsByClassName("avatar")[0]
            .getAttribute("href");

        if(blocked.users && blocked.users.some((x) => x == href)){
            // User is on the blockedUsers array, block the post.
            posts[i].remove();
            i--;
        }
        else{
            if(posts[i].getElementsByClassName("slotech_blocker").length != 0) continue;
             // Add "Mute" button to the post
             const ul = posts[i].getElementsByTagName("UL")[0];
             const li = document.createElement("LI");
             li.setAttribute("class", "slotech_blocker");
             const div = document.createElement("DIV");
             div.innerHTML = generateMute;

            div.addEventListener('click', (event) => BlockUser(href));
            li.appendChild(div);
            ul.appendChild(li);
        }
    }
}


const generateMute = `
<svg style="margin-right:5px;" width="26px" height="26px" enable-background="new 0 0 500 500"  fill='#333' version="1.1" viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" opacity="0.99"/>
<circle cx="50%" cy="50%" r="30%" stroke="#ccc" stroke-width="7%"/>
<line x1="30%" y1="70%" x2="70%" y2="30%" stroke="#ccc"  stroke-width="7%"/>
</svg>
    `;


start();