// ==UserScript==
// @name         Calm Vk Comment Loader
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Calmly load comments from vk post, not forgetting to clear memory on the way
// @author       You
// @match        https://vk.com/onlinevologda
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415685/Calm%20Vk%20Comment%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/415685/Calm%20Vk%20Comment%20Loader.meta.js
// ==/UserScript==

var total_text = "";

var parsed_post_ids = [];
function Is_Parsed_Post(post_id)
{
    return parsed_post_ids.includes(post_id)
}

function Get_Current_Posts()
{
    var posts = document.querySelectorAll(".post")
    var to_ret = []
    for(var x = 0; x < posts.length; x += 1) {

        if(posts[x].getAttribute("data-ad") == null &&
           document.querySelectorAll("#"+posts[x].getAttribute("id")+" .wall_marked_as_ads").length == 0)
        { to_ret.push(posts[x].getAttribute("id")); }
        else { posts[x].innerHTML = " "; }
    }
    return to_ret
}

var tolerance = 1.0;
var last_post_id = "";
var trials_on_last_post = 0;
var last_download = 0;
function Read_Posts()
{
    //console.log(trials_on_last_post)
    var ids = Get_Current_Posts();
    //console.log(ids.length)
    var prs = 0;
    for(var z = 0; z < ids.length; z+=1)
    {
        if(Is_Parsed_Post(ids[z])) { prs += 1; }
    }
    if(ids.length - prs < 2) { document.getElementById("wall_more_link").click(); last_download = Date.now() }
    else {
        var curtime = Date.now();
        if((curtime-last_download)/1000.0 > 20.0)
        {
            var top_post_index = 0;
            for(var p = 0; p < ids.length; p += 1)
            {
                if(!Is_Parsed_Post(ids[p])) { top_post_index = p; break; }
            }
            console.log("Top post is either: ")
            console.log(document.getElementById(ids[p]))
            document.getElementById(ids[p]).innerHTML = ""; parsed_post_ids.push(ids[p]); window.localStorage.setItem("parsed_post_ids", JSON.stringify(parsed_post_ids));
            last_download = Date.now();
            return;
        }
    }
    //console.log("Out of them parsed: ", prs)
    for(var x=0;x<ids.length;x+=1)
    {
        if(!Is_Parsed_Post(ids[x])){
            if(last_post_id == ids[x] && trials_on_last_post > 100) { document.getElementById(ids[x]).innerHTML = ""; parsed_post_ids.push(ids[x]); }
            else if(last_post_id != ids[x]) { last_post_id = ids[x] }
            var comment_count = document.querySelectorAll("#"+ids[x]+" .like_button_count")[1]
            if(typeof comment_count === "undefined") { trials_on_last_post = 0; document.getElementById(ids[x]).innerHTML = ""; parsed_post_ids.push(ids[x]); return;}
            comment_count = parseInt(comment_count.innerText)
            if(isNaN(comment_count)) { trials_on_last_post = 0; document.getElementById(ids[x]).innerHTML=""; parsed_post_ids.push(ids[x]); return; }

            var actual_comments = document.querySelectorAll("#"+ids[x]+" .reply_content")
            // console.log("Comment count (" + comment_count + ") vs actual (" + actual_comments.length + ")")
            if(comment_count * tolerance > actual_comments.length) {
                tolerance -= 0.0025;
                var replies_short = document.querySelectorAll("#"+ids[x] + " .replies_short_deep")
                for(var i = 0; i < replies_short.length; i += 1) { if(!replies_short[i].className.includes("pre_deleted")) replies_short[i].click(); }
                var replies_long = document.querySelectorAll("#"+ids[x] + " .replies_next_main")
                for(i = 0; i < replies_long.length; i += 1) { if(!replies_long[i].className.includes("pre_deleted")) replies_long[i].click(); }
                var replies_response_deep = document.querySelectorAll("#"+ids[x] + " .replies_next_deep")
                for(i = 0; i < replies_response_deep.length; i += 1) { if(!replies_response_deep[i].className.includes("pre_deleted")) replies_response_deep[i].click(); }
                //last_post_id = ids[x];
                trials_on_last_post += 1
                return;
            } else {
                tolerance = 1.0;
                trials_on_last_post = 0;
                var text_repls = document.querySelectorAll("#"+ids[x]+" .wall_reply_text")
                if(text_repls.length > 0) {
                    //if(comment_count != 0) console.log("Fetching ratio = ", text_repls.length / comment_count)
                    //console.log("Fetching " + text_repls.length + " comments. (Total comment count = " + actual_comments.length);
                    for(var b=0;b<text_repls.length;b+=1){total_text+=text_repls[b].innerText.replaceAll("\n", " ").trim() + "\n"}
                    //console.log("Post fetched");
                    parsed_post_ids.push(ids[x]);
                    document.getElementById(ids[x]).innerHTML = " "
                    window.localStorage.setItem("parsed_post_ids", JSON.stringify(parsed_post_ids))
                }
            }
        } else { document.getElementById(ids[x]).innerHTML = ""; }
    }
}

(function() {
    'use strict';
    window.localStorage.setItem("parsed_post_ids", null)
    last_download = Date.now()
    parsed_post_ids = JSON.parse(window.localStorage.getItem("parsed_post_ids", parsed_post_ids))
    if(parsed_post_ids == null) { parsed_post_ids = []; window.localStorage.setItem("parsed_post_ids", JSON.stringify(parsed_post_ids)) }
    console.log(parsed_post_ids)
    setInterval(Read_Posts, 50)
    setInterval(function(){ console.log("Len: ", total_text.length); navigator.clipboard.writeText(total_text) }, 6000)
    //document.querySelectorAll('.post')[0].remove()
    //Expand_Or_Read_Post()
    // Your code here...
})();