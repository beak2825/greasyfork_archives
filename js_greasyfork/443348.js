// ==UserScript==
// @name         app.porndb.me Minor Improvments
// @namespace    app.porndb.me
// @version      1.0
// @description  Auto show thumbnails when clicking on video
// @author       You
// @match        app.porndb.me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=porndb.me
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443348/appporndbme%20Minor%20Improvments.user.js
// @updateURL https://update.greasyfork.org/scripts/443348/appporndbme%20Minor%20Improvments.meta.js
// ==/UserScript==

/* global $ */






(function() {
    'use strict';

    //window.$ = $;

    //$(".v-tabs__container").on("click", function(){
    //    console.log("clicked");
    //    let links = document.querySelectorAll('a');

     //   for (var i=links.length-1; i>=0; i--) {
     //       links[i].setAttribute("target", "thumbnailIframe");
     //   }
    //});


    // Create an observer instance linked to the callback function
    window.myObserver = new MutationObserver(check);

    // Start observing the target node for configured mutations
    window.myObserver.observe(document, {childList: true, subtree: true});

    //(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        if(document.querySelector('.v-content__wrap .flex.lg4.md4.pa-2.sm6.xl4.xs12')) {
            //observer.disconnect();
            // code

            $(".v-content__wrap .flex.lg4.md4.pa-2.sm6.xl4.xs12").off();

            $(".v-content__wrap .flex.lg4.md4.pa-2.sm6.xl4.xs12").on("click", function(){
               //alert("click");
                //setTimeout(() => {
                //    $("#thumbnailIframe").remove();
                //    $('<iframe id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%;"></iframe>').insertAfter($(".v-dialog--active .v-tabs__bar"))
                //}, 2000);

               //document.querySelector(".v-dialog--active .v-tabs__bar").insertAdjacentHTML("afterend", '<iframe id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%;"></iframe>');
            });
        }

        if(document.querySelector('.v-dialog--active') && $(".v-dialog--active #thumbnailIframe").length == 0) {
            //observer.disconnect();
            //alert("Prompt Open");
            setTimeout(() => {
                $("#thumbnailIframe").remove();
                //$('<iframe id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%;"></iframe>').insertAfter($(".v-dialog--active .v-tabs__bar"));
                //$('<img id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%;"></img>').insertAfter($(".v-dialog--active .v-tabs__bar"));
                //$('<img id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%;"></img>').prepend($(".v-dialog--active [role='list']")[0]);
                $($(".v-dialog--active [role='list']")[0]).prepend($('<img id="thumbnailIframe" name="thumbnailIframe" src="target.html" style="background:#ffffff; width:100%; display:none;"></img>'));
            }, 200);
        }

        if(document.querySelector('.v-dialog--active')){
           console.log("clicked");
           let regex = new RegExp('\.(jpg|png)$');
           //let links = document.querySelectorAll('a');

           //for (var i=links.length-1; i>=0; i--) {
           //    links[i].setAttribute("target", "thumbnailIframe");
           //}



           for(let i=0; i<$(".v-dialog--active .pa-2").length; i++){
               console.log($(".v-dialog--active .pa-2")[i]);
               console.log(regex.test($(".v-dialog--active .pa-2")[i]))
               if(regex.test($(".v-dialog--active .pa-2")[i]) == true){
                   // Use this URL as Thumbnail URL
                   console.log("setting thumbnail");
                   $("#thumbnailIframe").attr("src", $(".v-dialog--active .pa-2")[i])
                   $("#thumbnailIframe").show();
               }
           }

        }
    }

     //(new MutationObserver(checkPromptOpen)).observe(document, {childList: true, subtree: true});

     //function checkPromptOpen(changes, observer) {

     //}



    //$(".v-content__wrap .flex.lg4.md4.pa-2.sm6.xl4.xs12").on("click", function(){
    //   alert("click");
    //});

    //.v-content__wrap .flex.lg4.md4.pa-2.sm6.xl4.xs12
})();