// ==UserScript==
// @name         Pooper donkey script
// @namespace    saqfish.com
// @version      0.1
// @description  poop
// @author       saqfish
// @match        https://www.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=30EMX9PEVJIFMMS0V23TU1O1QZVKS2
// @include      https://www.linkedin.com/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380382/Pooper%20donkey%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/380382/Pooper%20donkey%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.toString().toLowerCase().indexOf('www.mturkcontent.com') != -1){
        let companyLinks = $('b:contains("Company")');
        let tings = [];
        $.each(companyLinks, a => {
            let box;
            let link;
            link = $(companyLinks[a].parentElement).attr('href');
            box = $(`#Q${a+1}Url`);
            let win;
            win = window.open(link);
            tings.push({link:link,box:box, opener:win});

            console.log("-------");


        });
        window.addEventListener('message',function(event) {
            $.each(tings,a=>{
                let rlink = event.data.B;
                let rData = event.data.C;
                if(tings[a].link.includes(rlink.split('/')[2])){
                  //  console.log(tings[a].link + "--" + rlink);
                    tings[a].box.val(rData);
                }
                //tings[a].
            });
            console.log(event.data);
        });
    }

    if (window.location.toString().toLowerCase().indexOf('linkedin') != -1){
        let a = window.location.pathname;
        console.log(a);
        window.onload = function () {
            console.log("Running on LinkedIN");
            let el = $('[data-control-name=topcard_see_all_employees] > span');
            let stringie = el.html().replace(/(See all |employees on LinkedIn)/g,'');
            window.opener.postMessage({A: "linkedin", B: a, C: stringie},'*');

        };
    }
})();