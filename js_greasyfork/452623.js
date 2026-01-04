// ==UserScript==
// @name         Revivable
// @namespace    hotdog.hotdog.hotdog.revivable
// @version      1.0
// @description  Check revivability on faction page
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452623/Revivable.user.js
// @updateURL https://update.greasyfork.org/scripts/452623/Revivable.meta.js
// ==/UserScript==
const apikey = ""; //input api key here , public access should be fine


GM_addStyle(`
.wb_revivable {
 background-color: #deb471;
}
.wb_revivable:hover {
 background-color: #edd0a1 !important;
}

.wb_div {
 margin-top: 10px;
 display: flex;
 justify-content: center;
}

.wb_torn_button {
    background: transparent linear-gradient(180deg ,#CCCCCC 0%,#999999 60%,#666666 100%) 0 0 no-repeat;
    border-radius: 5px;
    font-family: Arial,sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    color: #333;
    text-shadow: 0 1px 0 #ffffff66;
    text-decoration: none;
    text-transform: uppercase;
    margin: 0;
    border: none;
    outline: none;
    overflow: visible;
    box-sizing: border-box;
    line-height: 16px;
    padding: 4px 8px;
    height: auto;
    white-space: nowrap;
    cursor: pointer;
}
.wb_torn_button+.wb_torn_button {
 margin-left: 10px;
}

.wb_torn_button:hover, .wb_torn_button:focus {
    background: transparent linear-gradient(180deg,#E5E5E5 0%,#BBBBBB 60%,#999999 100%) 0 0 no-repeat;
    color: #333
}

.wb_torn_button.disabled,.wb_torn_button:disabled,.wb_torn_button:hover.disabled,.wb_torn_button:hover:disabled {
    color: #777;
    color: var(--btn-disabled-color);
    box-shadow: 0 1px 0 #ffffffa6;
    box-shadow: var(--btn-disabled-box-shadow);
    text-shadow: 0 -1px 0 #ffffff66;
    text-shadow: var(--btn-disabled-text-shadow);
    background: transparent linear-gradient(180deg,#999999 0%,#CCCCCC 100%) 0 0 no-repeat;
    background: var(--btn-disabled-background);
    cursor: default
}
`);

(function() {
    'use strict';
//check for userlist wrapper and if jail header exists already
var startupObserver = new MutationObserver(function(mutations) {
  if ($(".faction-info-wrap.another-faction .members-list").length == 1 && $('div.wb_div #wb_check_revives').length == 0) {
    insertButton();
    startupObserver.disconnect();
  }
});

    startupObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

function insertButton() {
 $('.faction-info-wrap.another-faction .members-list').parent().after(`<div class="wb_div"><button class="wb_torn_button" id="wb_check_revives">Check revivable</button><button class="wb_torn_button" id="wb_toggle_revivable" data-wb-show="0">Show revivable only</button></div><div class="wb_div" id="wb_message" style="display: none;"></div>`);

 $('#wb_check_revives').click(function() {
     this.disabled = true;
     $(this).prop('disabled', true);
     $(this).attr('disabled','disabled');
     let userIDs = [];
     const users = $('.faction-info-wrap.another-faction .members-list ul.table-body > li');

     users.each(function() {
         const a = $(this).find('.member > div > div[class*="userWrap_"] a')
         const id = a.attr('href').replace('/profiles.php?XID=', '');

         a.attr('data-wb-id', id);

         userIDs.push(id);
     });

     $('#wb_message').text(`This will take some time. Check back in ${parseInt(userIDs.length) * 3} seconds.`).show();

     userIDs.push(1);


     for (let i = 0; i < userIDs.length; i++) {
         setTimeout(function timer() {
             if (userIDs[i] == 1) {
                 alert('Revive check complete.');
                 $('#wb_message').hide();
                 return;
             }
             const request_url = `https://api.torn.com/user/${userIDs[i]}?selections=&key=${apikey}`;

             $.ajax({
                 url: request_url,
                 type: "GET",
                 processData: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.error) {
                         console.log(request_url, " - API error code " + data.error.code + " - " + data.error.error);
                     } else {
                         console.log(data);
                         if (data?.revivable) {
                             $('.faction-info-wrap.another-faction .members-list ul.table-body > li a[data-wb-id="'+userIDs[i]+'"]').closest('li').addClass('wb_revivable');
                         }
                     }
                 }
             });
         }, i * 3000);
     }

 });

 $('#wb_toggle_revivable').click(function() {
     if ($(this).attr('data-wb-show') == "0") {
         $('.faction-info-wrap.another-faction .members-list ul.table-body > li:not(.wb_revivable)').hide();
         $(this).attr('data-wb-show', '1');
     } else {
         $('.faction-info-wrap.another-faction .members-list ul.table-body > li').show();
         $(this).attr('data-wb-show', '0');
     }
 });
}


    
})();