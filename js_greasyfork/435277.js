/* global jQuery */
// ==UserScript==
// @name         WIzard101 - Filter Quizzes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter quiz list to favorite quizzes for easier browsing
// @author       Zalatos
// @include        /^https:\/\/www\.wizard101\.com\/(quiz|game)\/trivia.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435277/WIzard101%20-%20Filter%20Quizzes.user.js
// @updateURL https://update.greasyfork.org/scripts/435277/WIzard101%20-%20Filter%20Quizzes.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.debug("Wizard101 quiz list will be filtered");
    let page = "sub";
    //checks if quiz select main page is active
    if(typeof jQuery(".quiz-hub-header").get(0) !== "undefined")
        page = "main";
    else if (jQuery(".quizQuestion").length > 0){
        page = "";
    }


    //hide header for easier scrolling and hide non favourited quiz categories
    var mainPageStuff = () => {
        jQuery(".quiz-hub-header").hide();//hide header block
        jQuery(".content-cell")[1].hide();//hide instructions block

    };

    //filter specific quizes
    var subPageStuff = () => {
        //create filter text and set default
        var t = document.createElement("div");
        var search = document.createElement("input");
        search.classList.add("filterText");
        search.addEventListener("input", subPageFilter);
        
        t.appendChild(search);
        jQuery(".content-cell").first().append(t);
        if(jQuery("h1").text().trim().toLowerCase()=="KingsIsle Trivia".toLowerCase()){
            jQuery(".filterText").val("wizard101");
        }
    };

    if(page == "main"){
        mainPageStuff();
    }
    else if (page =="sub"){
        subPageStuff();
        subPageFilter();
    }
})();

function subPageFilter(){
    //get list of quiz elements
    var quizzes = jQuery(".contentbox");
    let filterText = jQuery(".filterText").val();
    for (let i = quizzes.length;--i>1;){//exclude first 2 as they are the outer content box containing all quizzes
        //get heading
        let heading = quizzes[i].querySelector("h2");
        if( heading !== null){
            //get containing list item element
            let li = quizzes[i].parentNode.parentNode;
            //check if the filter word exists in the heading
            console.debug("check if '"+heading.innerHTML+"' contains '"+filterText+"'. result: "+heading.innerHTML.toLowerCase().indexOf(filterText.toLowerCase()));
            if (heading.innerHTML.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            {
                //show the block
                li.show();
            }
            else{
                //hide the block
                console.debug("hiding");
                console.debug(quizzes[i]);
                li.hide();
            }
        }
    }
}