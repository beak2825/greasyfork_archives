// ==UserScript==
// @name         TU Vienna CurriculumMarker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Marks the subjects you already passed in your curriculum, based on your favourites
// @author       AgX-1
// @match        https://tiss.tuwien.ac.at/curriculum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38061/TU%20Vienna%20CurriculumMarker.user.js
// @updateURL https://update.greasyfork.org/scripts/38061/TU%20Vienna%20CurriculumMarker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var frameId = "ownFavorites";    //choose something that's unique on the page
    //window.setTimeout(loadFavorites, 1500);
    loadFavorites();
    setHeadingClickable();

    function loadFavorites() {

        var iframe = document.createElement('iframe');
        //var timer = setInterval(createButton(), 1000);
        //var markButton = document.createElement('button');

        iframe.id = frameId;

        //temporary, favorites will be invisible when in 'production'
        //iframe.width = "1200px";
        //iframe.height = "1000px";

        iframe.src = "https://tiss.tuwien.ac.at/education/favorites.xhtml";

        // Make frame invisible

        iframe.height = '1px';
        iframe.width = '1px';
        iframe.position = 'fixed';
        iframe.top = '-9px';
        iframe.left = '-9px';

        //console.log(iframe);

        document.body.appendChild(iframe);
        //markButton.appendChild(document.createTextNode("Mark Curriculum"));
        //markButton.onclick = markCompletedJs();
        //document.body.insertBefore(markButton, document.getElementById("contentInner"));
    }

    function markCompletedJQuery() {
        var favLvaNrs = $("#" + frameId).contents().find("span[title='LVA Nr.']");
        favLvaNrs.each(
            function() {
                var favLvaNr = $(this).text();
                var nodeFavLvaNr = $(this);
                console.log("favLvaNr: " + favLvaNr);
                $(".courseKey").each(
                    function() {
                        var currLvaNr = $(this).text().substring(0,7);

                        var thumbsUp = nodeFavLvaNr.parent().parent().parent().find("#certificateHint").html();
                        if (favLvaNr === currLvaNr && thumbsUp !== undefined){
                            console.log("ThumbsUp: " + thumbsUp);
                            console.log("currLvaNr: " + currLvaNr);
                            $(this).parent().attr("style", "background-color: #00FF00 !important");
                            $(this).parent().parent().parent().css("background-color", "#00FF00");
                            return false;
                        }
                    }
                );
            }
        );
    }

    function markCompletedJs() {
        var favLvaNrSpans = document.getElementById(frameId).contentWindow.document
                                .querySelectorAll("span[title='LVA Nr.']");
        if (favLvaNrSpans.length === 0) {
            console.log("Switching to English");
            favLvaNrSpans = document.getElementById(frameId).contentWindow.document
                .querySelectorAll("span[title='Course Nr.']");
        }
        var favLvaNr;
        var favLvaName, favLvaType; //new
        var curriculumCourseKeys = document.querySelectorAll(".courseKey");
        var curriculumLvaNr;
        var curriculumLvaName, curriculumLvaType; //new
        var thumbsUp;

        for (let i = 0; i < favLvaNrSpans.length; i++) {
            favLvaNr = favLvaNrSpans[i].innerHTML;
            favLvaName = favLvaNrSpans[i].parentNode.parentNode.firstChild.innerHTML; //new
            favLvaType = favLvaNrSpans[i].nextSibling.innerHTML.slice(2, -2); //truncate " ," and ","

            //console.log("AParent: " + favLvaNrSpans[i].parentNode);
            thumbsUp = favLvaNrSpans[i].parentNode.parentNode.parentNode.querySelectorAll("#certificateHint").length;
            //console.log("favLvaNr: " + favLvaNr);
            //console.log("ThumbsUp: " + thumbsUp);

            if (thumbsUp !== 0) {
                for (let j = 0; j < curriculumCourseKeys.length; j++) {
                    curriculumLvaNr = curriculumCourseKeys[j].innerHTML.substring(0,7);
                    curriculumLvaName = curriculumCourseKeys[j].parentNode.lastChild.firstChild.innerHTML; //new

                    //console.log("CurrLvaNr" + curriculumLvaNr);
                    if (favLvaNr === curriculumLvaNr) {
                        //console.log("found matching Nr");
                        curriculumCourseKeys[j].style.cssText = "background-color: #00FF00 !important";
                        curriculumCourseKeys[j].parentNode.className += " completedCourseByNr";
                        //curriculumCourseKeys[j].parentNode.parentNode.parentNode.style.backgroundColor = "#00FF00";
                        //break;
                    } else if (favLvaName === curriculumLvaName && curriculumCourseKeys[j].innerHTML.indexOf(favLvaType) !== -1) {
                        //console.log("found matching name and type");
                        curriculumCourseKeys[j].nextSibling.nextSibling.firstChild.style.cssText = "background-color: #00FFFF !important";
                        curriculumCourseKeys[j].parentNode.classname += " completedCourseByName";
                        //curriculumCourseKeys[j].parentNode.parentNode.parentNode.style.backgroundColor = "#00FFFF";
                    }

                }
            }
        }
    }

    function setHeadingClickable() {
        var heading = document.getElementsByTagName("h1")[1];
        heading.onclick = markCompletedJs;
        console.log("Clickable heading is " + heading.innerHTML);
    }

    function createButton() {

    }
})();