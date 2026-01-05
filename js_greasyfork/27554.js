// ==UserScript==
// @name         Facebook Filter Fork
// @namespace    thetom.facebook
// @version      1.7.7b
// @description  Minimizes all posts your friends didn't post (friend liked, friend commented, friend attends...)
// @author       TheTomCZ <hejl.tomas@gmail.com> (Original Author)
// @author       <nazgand@gmail.com> (Maintainer of this fork)
// @match        https://www.facebook.com/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/27554-facebook-filter-fork
// @downloadURL https://update.greasyfork.org/scripts/27554/Facebook%20Filter%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/27554/Facebook%20Filter%20Fork.meta.js
// ==/UserScript==

$(function() {
    'use strict';
console.log('FFF test');
	const timesToFilter=5, timeoutBetweenFilters=250;
    const keywords = [
		// comment out anything you want to not be filtered
        " was tagged in ",
        " was mentioned in ",
        " is with ",
        " followed ",
        " likes ",
        " liked ",
        " replied to a ",
        " commented on ",
        " now friends",
        " is interested in an event",
        " going to an event",
        " others wrote on ",
        "'s Birthday",
        " reacted to this",

        //*Change the '//' to '/' if you want to not filter Czech
        " se líbí ",
        " se líbí uživateli ",
        " tady odpověděl",
        " okomentovali uživatelé",
        " okomentovali příspěvek ",
        " to okomentoval",
        " is now friends with ",
        " má zájem o událost",
        " má narozeniny",
        " na to zareagoval(a)",
        " se zúčastní události",//*/
    ];
    const badHtml = [
		//these will have an unhide option
        "Trump",
        "Obama",
        "Biden",
        "Clinton",
        "Sanders",
    ];
    const adHtml = [
		//these will not have an unhide option
        ">Suggested Post</span>",
        ">Suggested Page</div>",
        ">People you may know</span>",
    ];
	//customize variables above

    prepare();
    filterAll();
    $(document).on("scroll",filterAll);

    function prepare(){
        String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
        /*jshint multistr: true */
        $("head").append("\
            <style>\
            .filteredOut .userContentWrapper > div:first-child > .userContent + div, .filteredOut ul{       \
                display: none!important;          \
            }                                        \
            .filteredOut {                            \
                padding: 0px!important;                                             \
                margin: 3px 0!important;                                             \
                opacity: 0.7;   \
            }                                                    \
            .filteredOut h5 {\
                font-size: 12px!important;                    \
                margin-top: -2px!important;                           \
                padding: 3px!important;                           \
            }\
            .filteredOut .commentableItem, .filteredOut img, .filteredOut .userContentWrapper form, .filteredOut h5 + div{\
                display: none!important;                         \
            }\
            .filteredOut .fbUserContent > div, .filteredOut .fbUserContent button{               \
               display: none;    \
            }                   \
            .filteredOut ._1dwg{\
                display: block!important;\
            }\
            .filteredOut .userContent+div{  \
                display: none!important; \
             }   \
            .filteredOut .stat_elem, .filteredOut .userContent, .filteredOut.ad h5 span{\
                display: none!important;\
            }\
            .filteredOut *{\
                height: auto!important;\
                padding: 0!important;\
                margin: 0!important;\
                background-color: #e9ebee;                        \
            }                       \
            .fbFilterBtn {\
                position: absolute;\
                right: 35px;\
                top: 5px;\
            }                       \
            .filteredOut .fbFilterBtn {\
                right: 10px;   \
                top: 1px; \
            }                       \
            </style>"
       );
    }

    function minimize($elem, extraClass){
        var id = $elem.attr("id");
        if(extraClass){
            $elem.addClass(extraClass);
        }
        $elem.find("h5").append(" <a id='showStory_"+id+"' class='fbFilterBtn'>unhide</a><a id='rehideStory_"+id+"' style='display:none' class='fbFilterBtn'>rehide</a>");
        hideStory(id);
        $("#showStory_"+id).click(function(){showStory(id);});
        $("#rehideStory_"+id).click(function(){hideStory(id);});
    }

    function showStory(id){
        $("#rehideStory_"+id).show();
        $("#showStory_"+id).hide();
        $("#"+id).removeClass("filteredOut");
    }

    function hideStory(id){
        $("#rehideStory_"+id).hide();
        $("#showStory_"+id).show();
        $("#"+id).addClass("filteredOut").addClass("fbSpam");
    }

    function filter(index,elem){
        if(!$(elem).attr){
            return;
        }
        var $elem = $(elem);
        if($elem.hasClass("fbFiltered") || !$elem.attr("id")){
            return;
        }
        if($elem.attr("id").substring(0,16)!=="hyperfeed_story_"){
            return;
        }
        setTimeout(function(){_filter($elem,timesToFilter);},0);
    }
    function _filter($elem,times){
        if($elem.hasClass("fbSpam")){
            return;
        }
        $elem.addClass("fbFiltered");

        var title = $elem.find("h5").text();
        for(var i in keywords){
            if(title.contains(keywords[i])){
                minimize($elem);
                return;
            }
        }
        /*
        title = $elem.find("div._5g-l").text();
        for(i in keywords){
            if(title.contains(keywords[i])){
                minimize($elem);
                return;
            }
        }//*/

        const elemInnerHTML=$elem.context.innerHTML;
        for(var j in badHtml){
            if(elemInnerHTML.indexOf(badHtml[j])>-1){
                minimize($elem);
                return;
            }
        }
        for(var k in adHtml){
            if(elemInnerHTML.indexOf(adHtml[k])>-1){
                minimize($elem, "ad");
                return;
            }
        }
        if(times>1){
            setTimeout(function(){_filter($elem,times-1);},timeoutBetweenFilters);
        }
    }
    function filterAll(){
        setTimeout(_filterAll,300);
    }
    function _filterAll(){
        $("[data-testid='fbfeed_story']").map(filter);
    }
});