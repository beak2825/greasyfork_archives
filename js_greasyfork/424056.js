// ==UserScript==
// @name         OMC Rated-only button
// @namespace    https://twitter.com/rusa6111
// @version      0.1
// @description  Make Rated-only button.
// @author       rusa6111
// @match        https://onlinemathcontest.com/contests/*/standings
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424056/OMC%20Rated-only%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/424056/OMC%20Rated-only%20button.meta.js
// ==/UserScript==

$(function() {
    var f = function(){
        var flagStandings  = $('.table').find('tbody').find("tr")[0];
        if(flagStandings == undefined){
            window.setTimeout(f, 100);
            return;
        }
        ($(".form-inline")[0]) && ($(".form-inline")[0].outerHTML = "");
        $('head')[0].innerHTML += "<style type='text/css'>\
.before-rank {\
  color: darkgray;\
  font-size: 10px;\
}";
        var contestName = $("h4")[0].innerHTML;
        var rated_Llimit, rated_Ulimit;

        //rating color  black:0 gray:1 brown:2 green:3 cyan:4 blue:5 yellow:6 orange:7 red:8
        //rated limit = [rated_Llimit, ratedUlimit)

        if(contestName.slice(-8) == "ginners)"){
            rated_Llimit = 0;
            rated_Ulimit = 4;
        }else if(contestName.slice(-8) == "experts)"){
            rated_Llimit = 0;
            rated_Ulimit = 9;
        }else if(contestName[3] == "B" || contestName[3] == "E" || Number(contestName.slice(3, 6)) <= 20){
            rated_Llimit = 0;
            rated_Ulimit = 9;
        }else{
            rated_Llimit = 0;
            rated_Ulimit = 6;
        }
        var normalizeColor = function(c){
            if(c == "black" ) return 0;
            else if(c == "gray"  ) return 1;
            else if(c == "brown" ) return 2;
            else if(c == "green" ) return 3;
            else if(c == "cyan"  ) return 4;
            else if(c == "blue"  ) return 5;
            else if(c == "yellow") return 6;
            else if(c == "orange") return 7;
            else if(c == "red"   ) return 8;
        };

        var allTable = $(".table")[0].innerHTML;

        $(".table").find("tbody").find("tr").each(function(elm_cnt, element){
            var ratingColor = $(element).find("a")[0].getAttribute("class").split("-").slice(-1)[0];
            var ratingColorNum = normalizeColor(ratingColor);
            if(!((rated_Llimit <= ratingColorNum) && (ratingColorNum < rated_Ulimit))) element.outerHTML = "";
        });
        $(".table").find("tbody").find("tr").each(function(elm_cnt, element){
            var rank = $(element).find("th")[0].innerHTML;
            if(rank != "-") $(element).find("th")[0].innerHTML = "" + (elm_cnt + 1) + "<span class='before-rank'>(" + rank + ")</span>";
        });
        var ratedTable = $(".table")[0].innerHTML;
        $(".table")[0].innerHTML = allTable;
        $("#standings")[0].outerHTML = "<input type='checkbox' id='rated-only'><label for='rated-only' style='padding: 5px;'>Rated Only</label>" + $("#standings")[0].outerHTML;
        $("#rated-only")[0].onclick = function(){
            if(this.checked){
                $(".table")[0].innerHTML = ratedTable;
            }else{
                $(".table")[0].innerHTML = allTable;
            }
        };
    };
    f();
});