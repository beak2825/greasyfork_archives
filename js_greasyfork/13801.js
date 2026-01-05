// ==UserScript==
// @name         Roger Graham 1 
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.1
// @description  Roger Graham - Get data from two pages		
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit*
// @include      http://newyork.craigslist.org/reply*
// @include      http://newyork.craigslist.org/fb*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/13801/Roger%20Graham%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13801/Roger%20Graham%201.meta.js
// ==/UserScript==



var url = $('#DataCollection > div > table > tbody > tr > td:nth-child(2)').text();
var url2 = $('#DataCollection > div > div.row.col-xs-12.col-md-12 > table > tbody > tr > td:nth-child(2)').text();

if (window.location.toString().indexOf('mturkcontent') != -1){
    //if (window.location.toString().indexOf('Graham_files/hit.html') != -1){
    $(document).keyup(function(e){
    if(e.keyCode === 27){
        $('#submitButton').click();
       
    }
});

    var gf= window.open(url); 
    var gf2= window.open(url2); 
    
    window.addEventListener('message',function(event) {
        console.log(event.data);
        a = event.data;
     if (a.A === "fb"){
         
         $('#description_url').val(a.B);
     }
      if (a.A === "reply"){
         $('#web_url').val(a.B);
          //setTimeout(function(){  $('#submitButton').click(); }, 1000);
     }
        
     
    },false);

}

if (window.location.toString().toLowerCase().indexOf("http://newyork.craigslist.org/reply") != -1){
    var email = $('#webmailinks > ul:nth-child(4) > li > div').text();
    window.opener.postMessage({A: "reply", B: email},'*');
    //window.close();
}
if (window.location.toString().toLowerCase().indexOf("http://newyork.craigslist.org/fb") != -1){
    var disc = $('body').text()
    window.opener.postMessage({A: "fb", B: disc},'*');
    //window.close();
}