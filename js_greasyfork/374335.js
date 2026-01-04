// ==UserScript==
// @name         chyoa user page fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds a filter to remove stories from chapters tab on chyoa author page
// @author       You
// @match        https://chyoa.com/user/*
// @match        http://chyoa.com/user/*
// @match        https://chyoa.com/index.php/user/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374335/chyoa%20user%20page%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374335/chyoa%20user%20page%20fixer.meta.js
// ==/UserScript==

$("body").append("<div class='storiesRemoved'><input class='storyNameFilter' placeholder='Stories to filter out'></input><br>Stories Removed:</div>");

$(".storiesRemoved").css("position", "fixed");

$(".storiesRemoved").css("background-color", "white");

$(".storiesRemoved").css("bottom", "1%");

$(".storiesRemoved").css("right", "1%");

var storiesRemoved = [];

function filterButtonSetup() {
    $(".filterButton").remove();
    Array.prototype.forEach.call($("#chapters > div.chapter-list > ol").children(), function(el) {
        if (el.className !== "text-center") {
            el.children[0].children[1].children[0].children[1].innerHTML += "<span class='filterButton'>Filter out this story</span>";
        }
    })
    $(".filterButton").css("right", "0%");
    $(".filterButton").css("position", "absolute");
    Array.prototype.forEach.call($(".filterButton"), function(el) {
        console.log("running forEach on buttons");
        el.addEventListener("click", function(e) {
            console.log("event listener ran on button");
            let title = el.parentNode.parentNode.parentNode.children[1].children[0].innerText;
            if (!storiesRemoved.includes(title)) {
                storiesRemoved.push(title);
                $(".storiesRemoved").append("<br>"+title);
            }
            Array.prototype.forEach.call($("#chapters > div.chapter-list > ol").children(), function(el) {
                if (el.className !== "text-center" && el.children[0].children[1].children[1].children[0].innerText === title) {
                    el.remove();
                }
            })
        })
    })
}

filterButtonSetup();

$(".storyNameFilter").on("keydown", function(e) {
    if (e.key === "Enter") {
        let title = $(".storyNameFilter").val();
        $(".storyNameFilter").val("");
        if (!storiesRemoved.includes(title)) {
            storiesRemoved.push(title);
            $(".storiesRemoved").append("<br>"+title);
        }
        Array.prototype.forEach.call($("#chapters > div.chapter-list > ol").children(), function(el) {
            if (el.className !== "text-center" && el.children[0].children[1].children[1].children[0].innerText === title) {
                el.remove();
            }
        })
    }
})

var mutObserver = new MutationObserver(function(mutations) {
    filterButtonSetup();
    storiesRemoved.forEach(function(title) {
        Array.prototype.forEach.call($("#chapters > div.chapter-list > ol").children(), function(el) {
            if (el.className !== "text-center" && el.children[0].children[1].children[1].children[0].innerText === title) {
                el.remove();
            }
        })
    })
})

mutObserver.observe($("#chapters > div.chapter-list > ol")[0], {childList: true});