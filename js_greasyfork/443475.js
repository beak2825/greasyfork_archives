// ==UserScript==
// @name         vlr.gg user blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Block user posts on vlr.gg through the settings page
// @author       You
// @match        https://www.vlr.gg/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443475/vlrgg%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/443475/vlrgg%20user%20blocker.meta.js
// ==/UserScript==
//
(function() {
    'use strict';

    /*
    Adds the ability to block user messages on vlr.gg. Block and unblock users from the settings page of your vlr.gg profile.
    */


    function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}
    if(document.URL == "https://www.vlr.gg/settings"){
        // Creates unblock and block entry forms and buttons.
        let blocklist_div = document.createElement("div")
        blocklist_div.className = "wf-card mod-form mod-dark";
        let blocklist_blockedusers_label = htmlToElement("<div class=\"form-label\">Blocked Users</div>");
        let blocklist_blockedusers_p = document.createElement("p")
        let blocklist_block_label = htmlToElement("<div class=\"form-label\">Block a User</div>")
        let blocklist_unblock_label = htmlToElement("<div class=\"form-label\">Unblock a User</div>")
        let blocklist_block_entry = document.createElement("input")
        let blocklist_block_button = document.createElement("button")
        let blocklist_unblock_entry = document.createElement("input")
        let blocklist_unblock_button = document.createElement("button")

        let blocked_users_string = localStorage.getItem("saved_blocked_users")
        let blocked_users_array = blocked_users_string.split(",")
        // the blocked users list is stored as a string delimited by commas

        blocklist_blockedusers_p.innerText = (blocked_users_array)



        blocklist_block_button.innerText = "Block"
        blocklist_block_button.type = "button"
        blocklist_block_button.className = "btn"
        blocklist_block_button.onclick = function alertfromtestentry(){alert("Blocked " + blocklist_block_entry.value)
                                                                       blocked_users_array.push(blocklist_block_entry.value)
                                                                       localStorage.setItem("saved_blocked_users",blocked_users_array)
                                                                       blocklist_block_entry.value = ""
                                                                       blocklist_blockedusers_p.innerText = (blocked_users_array)
                                                                      }
        //Block users button creates alert, adjusts array and stored array, resets entry box and list

        blocklist_block_entry.type = "text"



        blocklist_unblock_button.innerText = "Unblock"
        blocklist_unblock_button.type = "button"
        blocklist_unblock_button.className = "btn"
        blocklist_unblock_button.onclick = function alertfromtestentry2(){alert("Unblocked " + blocklist_unblock_entry.value)
                                                                         let remove_index = (blocked_users_array.findIndex(element => element === blocklist_unblock_entry.value))
                                                                         if (remove_index >0){
                                                                             // findIndex() returns -1 if the element is not in the array.
                                                                             blocked_users_array.splice(remove_index,1)
                                                                         }
                                                                         localStorage.setItem("saved_blocked_users",blocked_users_array)
                                                                         blocklist_unblock_entry.value = ""
                                                                         blocklist_blockedusers_p.innerText = (blocked_users_array)
                                                                        }

        blocklist_unblock_entry.type = "text"

        let forms = document.getElementsByTagName("form");
        let form = forms[1];
        // all the grey blocks in the settings page are children of this form
        form.appendChild(blocklist_div);
        blocklist_div.appendChild(blocklist_blockedusers_label);
        blocklist_div.appendChild(blocklist_blockedusers_p);
        blocklist_div.appendChild(blocklist_block_label);
        blocklist_div.appendChild(blocklist_block_entry);
        blocklist_div.appendChild(blocklist_block_button);
        blocklist_div.appendChild(blocklist_unblock_label);
        blocklist_div.appendChild(blocklist_unblock_entry);
        blocklist_div.appendChild(blocklist_unblock_button);
    }




    let blocked_users_string = localStorage.getItem("saved_blocked_users")
    let blocked_users_array = blocked_users_string.split(",")
    let elemlist = document.getElementsByClassName("post-header-author mod-vlr"); //class for any post or reply on a thread page
    let blocklist = new Set(blocked_users_array);
    let deletelist = [];

    if(document.URL == "https://www.vlr.gg/threads"){
       let descs = document.getElementsByClassName("description") // class that contains the author of the post
       for(let i=0;i<descs.length;i++){
           try{
               let a_tag = descs[i].getElementsByTagName("a")
               a_tag = a_tag[0] // gets the <a> element that contains the author
               let post_author = a_tag.innerText
               if (blocklist.has(post_author)){
                   let parent_post = descs[i].parentElement;
                   parent_post = parent_post.parentElement; // selects whole post
                   deletelist.push(parent_post);

               }
           }
           catch (TypeError){ // in case of authorless posts
           }
       }
    }

    for (let index = 0; index < elemlist.length; index++) {
        console.log(elemlist[index].innerText)
    if(blocklist.has(elemlist[index].innerText)){

        let parent = elemlist[index].parentElement;
        parent = parent.parentElement; //to remove the entire post and not just the header
        deletelist.push(parent);
    }

}
    for (let index = 0; index<deletelist.length; index++){
        deletelist[index].remove()
    }

})();