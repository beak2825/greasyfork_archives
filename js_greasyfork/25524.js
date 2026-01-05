// ==UserScript==
// @name         Prospect Smarter - map URL
// @namespace    https://greasyfork.org/en/scripts/25524-prospect-smarter-map-url/code
// @version      0.2
// @description  Open link, place button on the google map (https://www.mturkcontent.com/dynamic/hit?assignmentId=38YMOXR4MU0IE4M2QHJYVBHWRT4W6X&hitId=3YZ7A3YHR5UQ1Z7LBRURIW4NWYO5SJ&workerId=A1UI059YV3XH73&turkSubmitTo=https%3A%2F%2Fwww.mturk.com)
// @author       IcKingAlpha
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        https://www.mturkcontent.com/dynamic/*
// @match        https://www.google.com/search?q=*
// @match        https://s3.amazonaws.com/*
// @grant        GM_LOG
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @include      file:///*
// @hitsave      https://www.mturkcontent.com/dynamic/hit?assignmentId=30JNVC0OR9LTRWAXARBW0DO0FCQHQH&hitId=3FK4G712NX1R715WNN7ZB7EFB8YSSR
// @downloadURL https://update.greasyfork.org/scripts/25524/Prospect%20Smarter%20-%20map%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/25524/Prospect%20Smarter%20-%20map%20URL.meta.js
// ==/UserScript==


if($('li:contains("CLICK THE STREETVIEW IMAGE")').length > 0) {

var mturk_iframe = document.querySelector("iframe");
var mturk_form = document.querySelector("form");

if (mturk_iframe || mturk_form){window.open($("a:contains('')")[0].href,'toolbar=1,location=1,menubar=1,scrollbars=1');}


$("input[type='text']").before("<input type='button' id='Yes' class='mybutton' value='Yes'></input>");
$("input[type='text']").before("<input type='button' id='No' class='mybutton' value='No'></input>");
$("input[type='text']").before("<input type='button' id='NA' class='mybutton' value='NA'></input>");

//Insert Variable on click
var Yes = "Yes";
$("#Yes").click(function(){
$("input[type='text']").val(Yes);
});

var No = "No";
$("#No").click(function(){
$("input[type='text']").val(No);
});

var NA = "N/A";
$("#NA").click(function(){
$("input[type='text']").val(NA);
});

}

(function() {
//Copy google Map
$('#rso > div:nth-child(1) > div > div > div > div.dirs > div.lu_map_section > a').before("<input type='button' id='googlebutton' class='mybutton' value='Google Map Button'></input>");
$("#googlebutton").click(function(){
   (function () {
    var map = $('#rso > div:nth-child(1) > div > div > div > div.dirs > div.lu_map_section > a').attr("href");
  //     console.log(map);
          var temp=document.createElement('input');
              document.body.appendChild(temp);
              temp.value=["https://www.google.com" +map];
              temp.select();
              document.execCommand('copy');
    temp.remove();
             })
      ();

});
})();


//Event listener for the input
if($('li:contains("CLICK THE STREETVIEW IMAGE")').length > 0) {
    console.log('ok ...');
    GM_addValueChangeListener('link', (a, b, c, d) => { $('input[name="web_url"]').val(c); });
}



///If the URL contains google run this command
if(document.URL.indexOf('google')>= 0) {
   var existID = document.querySelector('#rso > div:nth-child(1) > div > div > div > div.dirs > div.lu_map_section > a');
    if (existID !== null) {
   newLink();
   getLinks();

   }
else {
    GM_setValue('link', 'N/A');
 console.log('stop');
      }
}


// Set the URL of the map into local storage
 function newLink() {
    var myNewLink = document.querySelector('#rso > div:nth-child(1) > div > div > div > div.dirs > div.lu_map_section > a').href;
    GM_setValue('link', myNewLink);
     //localStorage.setItem('link', myNewLink);
        }

// Get the URL from the local storage
function getLinks(){
    var all_links = GM_getValue('link');
    //var all_links = localStorage.getItem('link');
    console.log(all_links + ' ok ');
   // close(window);

}