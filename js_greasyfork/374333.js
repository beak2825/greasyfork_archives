// ==UserScript==
// @name         Chyoa map page fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds searching capability for story map with wordcount, can also remove authors
// @author       You
// @match        https://chyoa.com/story/*/map*
// @match        http://chyoa.com/story/*/map*
// @match        https://chyoa.com/index.php/story/*/map
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374333/Chyoa%20map%20page%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374333/Chyoa%20map%20page%20fixer.meta.js
// ==/UserScript==

var asyncStatus = true;
$(".story-map-header").append(`<button class='syncStatus'>Asynchronous</button>
                              <input class='searchMap' placeholder='Search chapters and get word counts' size='35'
                              title='Find number of occurences of search term in each chapter.  No special characters.  Will also display word counts.'></input>
                              <button class='removeResults'>Remove Search Results</button>
                              <span class='total'>${$(".story-map-content").children().length} Chapters Total</span>
                              <a class='latest' href='#latest'>Latest Chapter</a>
                              <a class='deepest' href="#deepest">Deepest Chapter</a>`);
$(".syncStatus").on("click", function(e) {
    asyncStatus = !asyncStatus;
    let newStatus = asyncStatus ? "Asynchronous" : "Synchronous";
    $(".syncStatus")[0].innerText = newStatus;
});
$(".removeResults").on("click", function(e) {
    $(".results").remove();
    $(".noResults").remove();
});
$(".searchMap").css("padding-right", "30px");
$(".searchMap").css("margin-right", "30px");
$(".searchMap").css("size", "35");
$(".syncStatus").css("padding-right", "5px");
$(".title-wrapper").css("position", "relative");
var resultsStyle = `<style>
.results {font-size: 13px; padding-left: 25px; padding-right: 25px; color: black;}
.noResults {font-size: 11px; padding-left: 20px; padding-right: 25px; color: red;}
.wordCount {font-size: 13px; color: black; position: absolute; right: 5px}
.authorFilter {font-size: 8px; padding-right: 3px; padding-left: 2px; color: #f93d3d; background-color: white; margin-left: 5px;}
.total {padding-left: 10px; padding-right: 10px;}
.latest {padding-left: 10px; padding-right: 10px;}
.deepest {padding-left: 10px; padding-right: 10px;}
</style>`;
$("head").append(resultsStyle);
Array.prototype.forEach.call($(".story-map-content").children(), function(el) {
    el.children[0].innerHTML += "<span class='authorFilter' title='Filter out this author'>X</span>";
});
var datesObj = {Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec:12};
function latestIdx() {
    var maxIdx = 0;
    var maxNum = 0;
    var nodes = $(".date");
    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].innerText) {continue;}
        let dateStr = nodes[i].innerText.split(" ");
        dateStr[1] = dateStr[1].slice(0, dateStr[1].length - 1);
        let localMax = (Number(dateStr[2]) * 100) + datesObj[dateStr[0]] + (Number(dateStr[1]) / 100);
        if (localMax > maxNum) {
            maxNum = localMax;
            maxIdx = i;
        }
    }
    $(".date")[maxIdx].innerText += "!";
    $(".date")[maxIdx].title = "Latest Chapter";
    $(".date")[maxIdx].style.fontWeight = "bold";
    $(".date")[maxIdx].style.textDecoration = "underline";
    $(".date")[maxIdx].innerHTML += "<a name='latest'></a>";
}
function deepestIdx() {
    var maxIdx = 0;
    var maxNum = 0;
    var nodes = $(".page");
    for (let i = 0; i < nodes.length; i++) {
        let current = Number(nodes[i].innerText);
        if (current > maxNum) {
            maxNum = current;
            maxIdx = i;
        }
    }
    $(".page")[maxIdx].innerText += "!";
    $(".page")[maxIdx].title = "Deepest Chapter";
    $(".page")[maxIdx].style.fontWeight = "bold";
    $(".page")[maxIdx].style.textDecoration = "underline";
    $(".page")[maxIdx].innerHTML += "<a name='deepest'></a>";
}
$(".authorFilter").on("click", function(e) {
    var username = e.target.parentNode.children[3].children[0].innerText;
    Array.prototype.forEach.call($(".story-map-content").children(), function(el) {
        if (el.children[0].children[3].children[0].innerText === username) {
            el.remove();
        }
    });
});
$(".searchMap").on("keydown", function(e) {
    if (e.key === "Enter") {
        var searchTerm = $(".searchMap").val();
        $(".searchMap").val("");
        var reg = new RegExp(searchTerm, "g");
        Array.prototype.forEach.call($(".story-map-content").children(), function(el) {
            var num;
            var wordCount;
            var text;
            $.ajax({
                type: "GET",
                url: el.children[0].children[2].href,
                async: asyncStatus,
                success: function(data) {
                    text = $(data).find(".chapter-content")[0].innerText;
                    num = (text.match(reg) || []).length;
                    wordCount = text.match(/\S\s\S/g).length;
                    if (num) {
                        el.children[0].innerHTML += "<span class='results'>(<b>"+num+"</b> occurences of <i>"+searchTerm+"</i>)</span>";
                    } else {
                        el.children[0].innerHTML += "<span class='noResults'>No results for "+searchTerm+".</span>";
                    }
                    if (el.children[0].children.length < 7) {
                        el.children[0].innerHTML += "<span class='wordCount'><b>Total Word Count: "+wordCount+"</b></span>";
                    }
                }
            });
        });
    }
});
//$(window).on("load", deepestIdx);
//$(window).on("load", latestIdx);
deepestIdx();
latestIdx();
