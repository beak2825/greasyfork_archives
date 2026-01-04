// ==UserScript==
// @name         Twitter Arab Blocklist
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Block all Arab users ads
// @author       Crow Sama
// @match        https://twitter.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500528/Twitter%20Arab%20Blocklist.user.js
// @updateURL https://update.greasyfork.org/scripts/500528/Twitter%20Arab%20Blocklist.meta.js
// ==/UserScript==

let blockList = [
  {
    "blk" : {
      "userLink" : "https://twitter.com/___gll"
    }
  },
  
];

//window.addEventListener('load', function() {
//(function() {
//    'use strict';

// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
if(window.location.href.toString().includes('twitter.com'))
   {
   setTimeout(function(){
       let userIndex = GM_getValue('userIndex', -1);
        if(typeof userIndex === 'undefined' || userIndex == 'NaN' || typeof userIndex == 'NaN' || userIndex == NaN)
        {
            let userIndex = -1;
        }

        if(userIndex >= 0 && $("[data-testid='userActions']") !== null && $("[data-testid='userActions']").length > 0){
            if($("[data-testid='confirmationSheetDialog']") !== null && typeof $("[data-testid='confirmationSheetDialog']") !== 'undefined' && typeof $("[data-testid='confirmationSheetDialog']") !== null)
            {
                $("[data-testid='confirmationSheetCancel']").click();
            }

            $("[data-testid='userActions']").click();

            if($("[data-testid='block']") !== null && $("[data-testid='block']").find("span") !== null && $("[data-testid='block']").find("span")[0].innerText.includes("Unblock"))
            {}
            else{
                $("[data-testid='block']").click();
                $("[data-testid='confirmationSheetConfirm']").click();
            }
        }
userIndex++;
GM_setValue('userIndex', userIndex);

        let redirectUrl = blockList[userIndex].blk.userLink;

        window.location.href = redirectUrl;
    }, 10000);}