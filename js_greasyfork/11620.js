// ==UserScript==
// @name        Goodreads - Sort lists by rating or votes
// @namespace   goodreads
// @description Sort lists
// @include     https://www.goodreads.com/list/show/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11620/Goodreads%20-%20Sort%20lists%20by%20rating%20or%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/11620/Goodreads%20-%20Sort%20lists%20by%20rating%20or%20votes.meta.js
// ==/UserScript==

function isNumeric(num){
    return !isNaN(num)
}

function parseNumber(str) {
    var out = "";
    for(var i = 0; i < str.length; ++i) {
        if(isNumeric(str[i])) {
            out += str[i];
        }
    }
    return parseInt(out);
}

var App = {
    order: "desc",
    loadPage: 2,
    sort: function(cmp) {
        var elems = jQuery(".tableList").find("tr").get();
        elems.sort(cmp);
        if(App.order === "asc") {
            App.order = "desc";
        }
        else {
            App.order = "asc";
            elems.reverse();
        }
        for(var i = 0; i < elems.length; ++i) {
            elems[i].parentNode.appendChild(elems[i]);
        }
    },
    init: function() {
        $sortByRating = jQuery("<a></a>").attr("id", "sortByRating")
                                         .attr("href", "#")
                                         .text("sort by rating")
                                         .addClass("tab");
        $sortByVotes = jQuery("<a></a>").attr("id", "sortByVotes")
                                        .attr("href", "#")
                                        .text("sort by votes")
                                        .addClass("tab");
                                        
        jQuery(".bigTabs > div:nth-child(1)", ".leftContainer").append($sortByRating)
                                                               .append($sortByVotes);
                                                          
        jQuery("#sortByRating").on("click", function(){
            App.sort(function(lhs, rhs){
                var lhsRating = jQuery(lhs).find(".minirating").text().match(/[0-9]{1}\.[0-9]{2}/)[0];
                var rhsRating = jQuery(rhs).find(".minirating").text().match(/[0-9]{1}\.[0-9]{2}/)[0];
                return parseFloat(lhsRating) - parseFloat(rhsRating); 
            });
        });
        
        jQuery("#sortByVotes").on("click", function(){
            App.sort(function(lhs, rhs){
                var lhsVotes = parseNumber(jQuery(lhs).find(".minirating").text().match(/\d{1,3}(?:[,]\d{3})* rating/)[0]);
                var rhsVotes = parseNumber(jQuery(rhs).find(".minirating").text().match(/\d{1,3}(?:[,]\d{3})* rating/)[0]);
                if(lhsVotes < rhsVotes) { return -1; }
                if(lhsVotes > rhsVotes) { return 1; }
                return 0; 
            });
        });
        
        var hasPages = jQuery("#all_votes > .pagination").length > 0;
        if(hasPages) {
            $pagination = jQuery("#all_votes > .pagination > a");
            var numPages = parseInt($pagination.get(-2).innerHTML);
            $loadPage = jQuery("<a></a>").attr("id", "loadNextPage")
                                       .attr("href", "#")
                                       .text("load page #2")
                                       .addClass("tab");
            jQuery(".bigTabs > div:nth-child(1)", ".leftContainer").append($loadPage);
            
            var nextPageUrl = "https://www.goodreads.com" + $pagination.last().attr("href");
            jQuery("#loadNextPage").on("click", function(){
                jQuery("#loadNextPage").text("loading page #" + App.loadPage);
                jQuery.get(nextPageUrl, function(data){
                    $html = jQuery(data);
                    $html.find(".tableList tr").appendTo(jQuery(".tableList tbody"));
                    nextPageUrl = "https://www.goodreads.com" + $html.find(".pagination a").last().attr("href");
                    App.loadPage++;
                    if(App.loadPage > numPages) {
                        // Remove load link if loaded last page
                        jQuery("#loadNextPage").remove();
                    }
                    else {                
                        jQuery("#loadNextPage").text("load page #" + App.loadPage);
                    }
                });            
            });
        }
    }    
};

jQuery(document).ready(App.init);