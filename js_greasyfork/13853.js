// ==UserScript==
// @name         Hit to TM
// @version      1.0
// @description  Send hit to TM
// @author       saqfish
// @include 	       https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @grant        none
// @grant        GM_log
// @grant       GM_getValue
// @grant       GM_setValue
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @namespace https://greasyfork.org/users/13769
// @downloadURL https://update.greasyfork.org/scripts/13853/Hit%20to%20TM.user.js
// @updateURL https://update.greasyfork.org/scripts/13853/Hit%20to%20TM.meta.js
// ==/UserScript==

var delay = 1000; // Set your delay from here. It is in milliseconds.

var link = "";
var parentSpan;
var a = 0;

var reqnames = [];
$('span.requesterIdentity').each(function(){
    reqnames.push($(this).text());
});
var hittitles = [];
$('a[id^=capsule]').each(function(){
    hittitles.push($(this).text());
});

$('a[href^="/mturk/preview?"]').parent().each(function(z){
    $(this).find('a[href^="/mturk/preview?"]').each(function(f){
    link = $(this).attr('href'); 
        var oldlink = link.split('?');
        //oldlink[0] = "/mturk/previewandaccept";
        oldlink[0] = "";
        var newlink = oldlink.join('?');
        var tmlink = document.createElement("a");            
        tmlink.className = newlink;
        tmlink.setAttribute('id', 'tmlink' + a);
        tmlink.setAttribute('href', "javascript:void(0);");
        tmlink.setAttribute('style', 'padding-left: 20px;'); 
        tmlink.innerHTML = "TM";
        $(this).parent().append(tmlink);
        a++;
        console.log(newlink);
       
   }); 
     
});
$("a[id^='tmlink']").on("click", function(b) {
    var link =  $(this).attr('class');
    var idd = $(this).attr('id').substring(6);
    console.log($(this).closest('span').find('.requesterIdentity'));
    sendTM(reqnames[idd]+"--"+hittitles[idd],link,"nrm");
    });

function sendTM(name,link,mode){
    tmlink = link.split("=");
    if (mode == "nrm"){
        var watcher = {
            id          : tmlink[1],
            duration    : delay,
            type        : 'hit',
            name        : name,
            auto        : true,
            alert       : true,
            stopOnCatch : false
        };
    };

    sendMessage({
        header    : 'add_watcher',
        content   : watcher,
        timestamp : true
    });
    
};

function sendMessage(message) {
    var header    = message.header;
    var content   = message.content || new Date().getTime();	
    var timestamp = message.timestamp && new Date().getTime();
    localStorage.setItem('notifier_msg_' + header, JSON.stringify({ content: content, timestamp: timestamp}));
    //GM_setValue('notifier_msg_' + header, JSON.stringify({ content: content, timestamp: timestamp}));
    console.log("--Sent to TM--");
}
