// ==UserScript==
// @name         Download Link Skipper (9Clacks2, suprafiles, zippyshare, filemack)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Skips the extra clicking needed when downloading stuff
// @author       spyruf
// @include      http://*9clacks2.com/*
// @include      http://*suprafiles.*/*
// @include      https://*filemack.com/*
// @include      http://*zippyshare.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/27851/Download%20Link%20Skipper%20%289Clacks2%2C%20suprafiles%2C%20zippyshare%2C%20filemack%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27851/Download%20Link%20Skipper%20%289Clacks2%2C%20suprafiles%2C%20zippyshare%2C%20filemack%29.meta.js
// ==/UserScript==

if (window.top != window.self)  //-- Don't run on frames or iframes
    return;


function getLink(type){
    console.log("Called getLink(type) with type: " + type);

    //selects the element that has the link -- jquery obj version
    var a = $('a:contains('+type+')').filter(function(index)
                                             {
        if ($(this).text() === type){
            return true;
        }
    });

    //a is an array! first 4 (maybe more) elements are the links (a's)... sort of an array
    console.log(a);


    //var hrefArray;

    //var test = [1,2,3,4,5,6];
    //console.log(test);
    //console.log(hrefArray);

    //a.atte(); // used to break program

    addressValue = a.attr("href");

    return addressValue;

}

(function() {
    'use strict';

    console.log("window.location.href is: " + window.location.href);
    console.log("9Clacks2 Link Skipper is running!");


    if (localStorage.getItem("download") === null) {

        //console.log("settinglocalstorage");

        localStorage.setItem('download', 'null');
    }

    console.log("localstorage Value of 'Download' is: " + localStorage.getItem("download"));


    if (window.location.href === "http://9clacks2.com/"){ // sometimes this statement has issues if the site changes domains

        console.log("I am on 9clacks2 homepage");

        $(".read-more-box").click(function(){

            console.log("Download clicked aka .read-more-box");

            localStorage.setItem('download', 'true');

            download = localStorage.getItem("download");


        });


    }

    else if (window.location.href.indexOf("9clacks2") != -1 && localStorage.getItem("download") == 'true'){

        var addressValue = getLink("iTunes");

        if(addressValue === undefined){

            addressValue = getLink("M4A");


            if(addressValue !== undefined){
                //console.log("Link Address: " + addressValue);

                localStorage.setItem('download', 'false');
                window.history.back();
                window.open(addressValue,"_blank");

                //console.log("Still running: " + addressValue);
            }


        }
        else{

            console.log("Link Address: " + addressValue);

            localStorage.setItem('download', 'false');

            window.open(addressValue,"_blank");

            //console.log("Still running: " + addressValue);
        }


    }

    else if (window.location.href.indexOf("zs_") != -1 ){


        var s = $(':submit').each(function() {
            (this).click();
        });

        //console.log("you're on submit");

    }

    else if (window.location.href.indexOf("filemack") != -1 ){

        //selects the element that has the link -- jquery obj version
        var f = $('a.truncate[href*="zs_"]').each(function() {

        });


        //f.css( "text-decoration", "bold" );

        var fValue = f.attr("href");

        //console.log("Link Address filemack : " + fValue);

        window.open(fValue,"_self");

        //console.log("Still running filemack : " + fValue);


    }

    else if (window.location.href.indexOf("zippyshare") != -1 ){

        //console.log("boutta cop");

        $('#dlbutton')[0].click();


        localStorage.setItem('download', 'false');


    }

    else if (window.location.href.indexOf("suprafiles") != -1 ){

        var supraSubmit = $(':submit').each(function() {
            (this).click();
        });

        $('a:contains("fs")')[0].click();

    }

})();
