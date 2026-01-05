// ==UserScript==
// @name         Something Awful True Ignore
// @version      0.1.1
// @description  Hide posts from ignored users and their quotes
// @match        *://forums.somethingawful.com/showthread.php*
// @match        *://forums.somethingawful.com/member2.php?action=viewlist&userlist=ignore*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    http://github.com/Chunjee
// @author       Chunjee
// @downloadURL https://update.greasyfork.org/scripts/25604/Something%20Awful%20True%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/25604/Something%20Awful%20True%20Ignore.meta.js
// ==/UserScript==

var ignored_array = [];

//try to hide ignored posts before page is done loading
$(".post.ignored").hide();

$(document).ready((function() {
    'use strict';
    var location = "" + document.location;
    var ignored_array = [];


    // Scrape ignore list if user looks at their ignore page
    if (location.match(/member2\.php\?action=viewlist&userlist=ignore/)) {
        var fields = $( "form" ).serializeArray();
        $.each( fields, function( i, field ) {
            ignored_array.push(field.value);
        });
        //Save values to long term storage
        GM_setValue("ignored_list", ignored_array);
        //Log the save
        var alf = $(".standard").prepend("<h2>Ignored Users added to memory</h2>");
    } else {
        //hide post via text first, save to var
        var jerkposts = $(".post.ignored").hide();
        //add any ignored users to long term storage if any were found
        if (jerkposts.length !== 0) {
            Sb_FindJerkstoIgnore(jerkposts);
        }

        //hide any quotes by users on ignore list
        var arrowgraphic = {
            right:'data:image/gif;base64,R0lGODlhDQANAIABALu6t////yH5BAEAAAEALAAAAAANAA0AAAIfDI4JFu1vFoTHISrbtVlXP20fl41RN27chLHPosRBAQA7',
            down:'data:image/gif;base64,R0lGODlhDQANAKECAAAAAAEBAP///////yH5BAEAAAIALAAAAAANAA0AAAIkVI4ZJu1vFoRnUikd3poLUB1AUzWg2D3A+pTO2GZWNGuRkggFADs='
        };
        ignored_array = GM_getValue("ignored_list", []);
        //for each quote
        $(".bbc-block").each( function () {
            //grab the quoted poster's name
            var poster = /([ \.a-z0-9!]+)\sposted:/gi.exec(this.innerHTML);
            //if that poster is anywhere in the ignored users array and regex was successful
            if(poster && ignored_array.indexOf(poster[1]) != -1) {
                //hide the quoted user and blockquote by default
                $("h4", this).hide().next().hide();
                //Add arrow image and text
                $("h4", this).parent().prepend('<div style="display:flex; align-items: center;"><span style="color:gray">Ignored user quote&nbsp;</span><img src="' + arrowgraphic.right + '"></div>');
                //select the image and set a click event
                $(this).on("click",Sb_HideToggle);
            }
        });
    }
}));

function Sb_HideToggle() {
    $("h4",this).toggle("slow").next().toggle("slow");

    var className = $("img",this).attr('class');
    if (className == "expanded") {
        $("img",this).addClass("collapsed").removeClass("expanded").css({
            "-webkit-transform": "rotate(0deg)",
            "-moz-transform": "rotate(0deg)",
            "transform": "rotate(0deg)"
        });
    } else {
        $("img",this).addClass("expanded").removeClass("collapsed").css({
            "-webkit-transform": "rotate(90deg)",
            "-moz-transform": "rotate(90deg)",
            "transform": "rotate(90deg)"
        });
    }
}

function Sb_FindJerkstoIgnore(para_Obj) {
    ignored_array = GM_getValue("ignored_list", []);
    //go through each bad post and see if theres any new posters to add
    $.each(para_Obj, function (key,value) {
        var author = $("dt.author", this);
        author = author[0].innerHTML;
        if ($.inArray(author, ignored_array) == -1) {
            ignored_array.push(author);
            console.log("added " + author + " to ignore memory");
        }
    });
    GM_setValue("ignored_list", ignored_array);
}