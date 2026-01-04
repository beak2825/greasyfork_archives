// ==UserScript==
// @name         LAction
// @namespace    zero.la.torn
// @version      0.3
// @description  Last Action
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/482246/LAction.user.js
// @updateURL https://update.greasyfork.org/scripts/482246/LAction.meta.js
// ==/UserScript==

// Made for Phillip_J_Fry [2184575].
// DO NOT EDIT.


const {fetch: origFetch} = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */

    if (response.url.includes('page.php?sid=UserMiniProfile')){
      //  console.log("REsponseL : "+response);

        response
            .clone()
            .json()
            .then(function(body){
            var time = body.user.lastAction.seconds;
            insert(time);


        })
            .catch(err => console.error(err))
        ;
    }



    return response;
};

function convert(t){
  //  console.log(t);
    var days = Math.floor(t/86400);
    t = t- 86400 * days;
    var hrs = Math.floor(t/3600);
    t = t - hrs*3600;
    var minutes = Math.floor(t/60);
    t = t - minutes *60;

    var result = '';
    if (days){
        result += `${days} days `;
    }
    if (hrs){
        result += `${hrs} hours `;
    }
    if (minutes){
        result += `${minutes} minutes `;
    }
    result += `${t} seconds`;
   // console.log(result);

    return result;

}
function insert(t){
   // console.log(t);
    if ($('.icons',$('#profile-mini-root')).length > 0){
        if ($('.laction',$('#profile-mini-root')).length == 0){
            var tt = convert(t);
            var ldata = `<p class='laction' style='float:"right";'>Last Action: ${tt}</p>`;
           // console.log(ldata);

            $('.icons',$('#profile-mini-root')).append(ldata);
        }

    }

    else{
        setTimeout(insert,300, t);
    }
}