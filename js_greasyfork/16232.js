// ==UserScript==
// @name         Facebook Filter
// @namespace    thetom.facebook
// @version      1.7.8
// @description  Minimizes all posts your friends didn't post (friend liked, friend commented, friend attends...)
// @author       TheTomCZ <hejl.tomas@gmail.com>
// @match        https://www.facebook.com/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/16232-facebook-filter
// @downloadURL https://update.greasyfork.org/scripts/16232/Facebook%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/16232/Facebook%20Filter.meta.js
// ==/UserScript==

$(function() {
    'use strict';
console.log('test');
    var keywords = [
        " likes ",
        " liked ",
        " replied to a ",
        " commented on ",
        " is now friends with ",
        " is interested in an event",
        " going to an event",
        " others wrote on ",
        "'s Birthday",
        " reacted to this",

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
        " se zúčastní události",
    ];

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
            .filteredOut .stat_elem, .filteredOut .userContent, .filteredOut.ad h5 span, .filteredOut .fbUserPost > div:not([class]), .filteredOut .fbUserPost .userContent, .filteredOut .fbUserPost .uiLikePageButton{\
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
        $("#"+id).addClass("filteredOut").addClass("fbFiltered");
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
        setTimeout(function(){_filter($elem);},300);
    }
    function _filter($elem){
        if($elem.hasClass("fbFiltered")){
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
        if($elem.html().indexOf('>Suggested Post</span>')>1){
            minimize($elem, "ad");
        }
    }
    function filterAll(){
        setTimeout(_filterAll,300);
    }
    function _filterAll(){
        $("[data-testid='fbfeed_story']").map(filter);
    }
});