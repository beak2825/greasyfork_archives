// ==UserScript==
// @name         Shared Project Viewer
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Adds a page at scratch.mit.edu/shared to see projects people you follow have shared.
// @author       Mrcoat
// @match        *://scratch.mit.edu/shared
// @match        *://scratch.mit.edu/shared/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scratch.mit.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455063/Shared%20Project%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/455063/Shared%20Project%20Viewer.meta.js
// ==/UserScript==

let session;
let current = 0;

(function() {
    'use strict';
    // Your code here...
    main();
})();

async function getToken() {
    const response = await fetch("https://scratch.mit.edu/session/", {"headers": {"X-Requested-With":"XMLHttpRequest"}});
    session = await response.json();
    return [session.user.token, session.user.username];
}

function start(token,user,offset) {
    const response = fetch("https://api.scratch.mit.edu/users/"+user+"/following/users/activity?limit=40&offset="+offset+"&x-token="+token, {"headers": {"X-Requested-With":"XMLHttpRequest"}})
        .then((response) => response.json()).then((data) => readData(data));
}

function readData(data) {
    console.log(session.user.token);
    const list = document.getElementById("list");
    for (let i=0;i<data.length;i++) {
        // console.log(data[i].type)
        if (data[i].type=="shareproject") {
            list.innerHTML = list.innerHTML + '<li class="activity-li"><a href=/projects/'+data[i].project_id+'/><img src="//cdn2.scratch.mit.edu/get_image/project/'+data[i].project_id+'_300x300.png"><a href="/users/'+data[i].actor_username+'/"><img alt="" class="activity-img" src="//uploads.scratch.mit.edu/users/avatars/'+data[i].actor_id+'.png"></a><div class="social-message mod-love-favorite"><div class="flex-row mod-social-message"><div class="social-message-content"><div><span><a href="/users/'+data[i].actor_username+'">'+data[i].actor_username+'</a> shared <a href="/projects/'+data[i].project_id+'">'+data[i].title+'</a></span></div></div><span class="social-message-date"><span>'+data[i].datetime_created+'</span></span></div></div></li>';
        }
    }
}

function more(){
    current += 40;
    start(session.user.token,session.user.username,current);
}

function main(){
    getToken().then(
            (value) => {
                start(value[0],value[1],0);
            }
        );
        const content = document.getElementById("content");
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://scratch.mit.edu/splash.css');
        document.head.appendChild(link);
        content.innerHTML = '<div class="box activity"><div class="box-header"><h4>Who shared what?</h4><h5></h5><p><a></a></p></div><div class="box-content"><ul id="list" class="activity-ul"></div><button id="myBtn">Load More</button></div></li></ul></div></div>';
        const element = document.getElementById("myBtn");
        element.addEventListener("click", more);
}