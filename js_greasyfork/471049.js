// ==UserScript==
// @name         Forum Filter
// @namespace    zero.forumfilter.torn
// @version      0.2
// @description  Hides Forum POsts
// @author       -zero [2669774]
// @match        https://www.torn.com/forums.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471049/Forum%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471049/Forum%20Filter.meta.js
// ==/UserScript==

const url = window.location.href;

function run(){
    if (url.includes("p=forums")){
        hideForums();
    }
    else if (url.includes("p=threads")){
        insert();
    }
}


function insert(){
    console.log("Inserting forum");
    if ($(".thread-list > li").length > 0){
        const tempBtn = `<button id="tempBtn" class ="torn-btn">Hide 24hrs</button>`;
        const fBtn = `<button id="fBtn" class ="torn-btn">Hide</button>`;

        $(".content-title").append(tempBtn);
        $(".content-title").append(fBtn);

        $("#tempBtn").on("click", function(){
            hide("temp");
        });
        $("#fBtn").on("click", function(){
            hide("for");
        });
    }
    else{
        setTimeout(insert, 300);
    }
}

function hideForums(){
    console.log("Hiding forum");
    var ids = localStorage.forumfilter || "{}";
    ids = JSON.parse(ids);
    console.log(ids);

    if ($(".threads-list > li").length > 0){
        $(".threads-list > li").each(function(){
            var idThread = $(".thread-name",$(this)).attr("href").split("&t=")[1].split("&")[0];

            if (ids[idThread]){
                if (ids[idThread] != "-1" && (Math.round(Date.now()/1000) - ids[idThread] >= 86400)){
                    delete ids[idThread];
                }
                else{
                    $(this).remove();
                }
            }
        });
    }
    else{
        setTimeout(hideForums, 300);
    }

}



function hide(d){
    var ids = localStorage.forumfilter || "{}";
    ids = JSON.parse(ids);
    var forumid = url.split("&t=")[1].split("&")[0];

    if (d=="temp"){
        ids[forumid] = Math.round(Date.now()/1000);

    }
    else{
        ids[forumid] = "-1";
    }

    localStorage.forumfilter = JSON.stringify(ids);
}

run();

$(window).on('hashchange', function(e){
    run();



});