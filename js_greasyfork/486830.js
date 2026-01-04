// ==UserScript==
// @name         X.com (Twitter) - Auto Show More
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  X.com (Twitter) Auto Show More Replies(Included Probable Spam), Show Entire Long Tweets/Replies. 推特自动显示所有回复(包括可能的垃圾信息)，并且展开完整的长推文和长回复。
// @author       Martin______X
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486830/Xcom%20%28Twitter%29%20-%20Auto%20Show%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/486830/Xcom%20%28Twitter%29%20-%20Auto%20Show%20More.meta.js
// ==/UserScript==

/* Tweet Thread Replies */
let $button1 = "css-175oi2r r-1777fci r-1pl7oy7 r-13qz1uu r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l";
/* Tweet Priority Replies*/
let $button2 = "css-175oi2r r-16y2uox r-1cwvpvk r-1noe1sz r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l";
/* Long Tweet & Reply - More */
let $button3 = "css-146c3p1 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-fdjqy7";
/**/
let $gork = "css-175oi2r r-9aw3ui r-1s2bzr4";
let $post = "css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu";

const simpleClick = (async (button) => {
    button.click();
});
const moreRepliesInterval = setInterval(() => {
    try{
        if(url_check(document.URL)){
            //
            let buttons;
            //
            if (document.URL.includes("status")) {
                buttons = document.getElementsByClassName($button1);
                for (let i = 0; i < buttons.length; i++) {
                    simpleClick(buttons[i]);
                }
                buttons = document.getElementsByClassName($button2);
                for (let i = 0; i < buttons.length; i++) {
                    simpleClick(buttons[i]);
                }
            }
            buttons = document.getElementsByClassName($button3);
            for (let i = 0; i < buttons.length; i++) {
                if(normal_post(buttons[i])){
                    simpleClick(buttons[i]);
                }
            }
        }
    }catch(error){
        //console.error(error)
    }
}, 1);

const url_check = (url) => {
    let ex_urls = ["/settings/", "/notifications", "/messages", "/i/", "/compose/"];
    let in_urls = ["/i/bookmarks"];
    if(included_one_of(url, ex_urls) && !included_one_of(url, in_urls)){
        return false;
    }
    return true;
}

const normal_post = (button) =>{
    let gorks = document.getElementsByClassName($gork);
    let posts = document.getElementsByClassName($post);
    for (let i=0; i<gorks.length; i++){
        if(gorks[i].hasAttribute("aria-labelledby") && gorks[i].contains(button)){
            return false;
        }
    }
    for (let i=0; i<posts.length; i++){
        if(posts[i].contains(button)){
            return true;
        }
    }
}

const included_one_of = (url, array) => {
    let result = false;
    for(let i=0; i<array.length; i++){
        if(url.includes(array[i])){
            result = true;
        }
    }
    return result;
}