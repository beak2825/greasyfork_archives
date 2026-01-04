// ==UserScript==
// @name         Dog Tag Hunter
// @namespace    namespace
// @version      1.2
// @description  Shows Attacks won and lost since the start of DogTag Competition 
// @author       Cheb
// @match        https://www.torn.com/profiles.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465917/Dog%20Tag%20Hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/465917/Dog%20Tag%20Hunter.meta.js
// ==/UserScript==
 
 
 
(function() {
    'use strict';
 
    let API = ""
    
    const time_start = 1683720000 // start of the competition 
    const time_end = 1684497600 // end of the competition 
    const unixTime = Math.floor(Date.now() / 1000); // Get Current time
 
    // If the API is empty, inform user and quit
    if(API == "") 
    {
        document.getElementsByClassName("title-black top-round")[1].innerText = `Missing API Key, Please enter it in the code`
        return;
    }
 
    // If the competition didn't started yet, it closes program. No need to waste API calls :)
    if(time_start > unixTime || time_end < unixTime)
    {
        return;
    }
 
    //Gets the profile ID from url 
    let url = window.location.href
    let id = url.slice(url.indexOf("ID=") + 3)
 
 
    var request = new XMLHttpRequest();
    request.open('GET', `https://api.torn.com/user/${id}?selections=personalstats&stat=attackswon,defendslost&key=${API}`)
    request.send();
    request.onload = ()=>
    {
        let data_now = JSON.parse(request.responseText).personalstats;
 
            request.open('GET', `https://api.torn.com/user/${id}?selections=personalstats&stat=attackswon,defendslost&timestamp=${time_start}&key=${API}`);
            request.send()
    
            request.onload = ()=> 
            {
                let data_old = JSON.parse(request.responseText).personalstats
                let attacks = data_now.attackswon - data_old.attackswon
                let defends = data_now.defendslost - data_old.defendslost
    
                // console.log(data_now,data_old) // For Debug
    
                document.getElementsByClassName("title-black top-round")[1].innerText = `Wins: ${attacks} | Defeats: ${defends}`
            }   
}
})();