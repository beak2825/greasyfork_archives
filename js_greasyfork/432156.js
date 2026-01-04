// ==UserScript==
// @name         Diva Quiz Instant Next
// @version      1.1
// @description  Next
// @author       BobTheZealot
// @namespace    BobTheZealot
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://quizdiva.net/*
// @downloadURL https://update.greasyfork.org/scripts/432156/Diva%20Quiz%20Instant%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/432156/Diva%20Quiz%20Instant%20Next.meta.js
// ==/UserScript==

var answers = {"ultimate-spelling-quiz" : {"https://quizdiva.net/asserts/admin/questionimages/1603909150-5f99b61e21909.jpg": "Separate",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603909266-5f99b692e544c.jpg": "Maneuver",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603909331-5f99b6d38b44a.jpg": "Embarrass",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603909805-5f99b8ad92839.jpg": "Column",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603910150-5f99ba065fe51.jpg": "Charcuterie",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603912500-5f99c33466763.jpg": "Entrepreneur",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603914679-5f99cbb78e98b.jpg": "Controllable",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603914877-5f99cc7dd568c.jpg": "Difference",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603915889-5f99d071372aa.jpg": "pneumonia",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603916045-5f99d10d2a893.jpg": "Hierarchy",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603916300-5f99d20c9f489.jpg": "Argument",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603916421-5f99d285cc89c.jpg": "A lot",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603916542-5f99d2fe7fef7.jpg": "Questionnaire",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603916929-5f99d4818a768.jpg": "Particularly",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603917116-5f99d53c18a3f.jpg": "Conscience",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603917311-5f99d5ff0fe05.jpg": "Parallel",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603917684-5f99d7748dc52.jpg": "Bureaucracy",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603917814-5f99d7f6e9b77.jpg": "Accommodate",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603917941-5f99d8756d0de.jpg": "Commitment",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918076-5f99d8fcc068a.jpg": "Liaison",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918231-5f99d997bba59.jpg": "Surveillance",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918333-5f99d9fde9670.jpg": "Chauffeur",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918455-5f99da771ac95.jpg": "Minuscule",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918597-5f99db05795fe.jpg": "Changeable",
                                          "https://quizdiva.net/asserts/admin/questionimages/1603918764-5f99dbac4bbc3.jpg": "Hors d'oeuvres"}};

$(document).ready(function(){
    var interval = setInterval(function(){
        if($("#nextbutton").length > 0){
            console.log("found nextbutton");
            $("#nextbutton").css("display", "block");
            $("#nextbutton").click();
            clearInterval(interval);
        }
        else if($("a:contains('Continue')").length > 0){
            console.log("found Continue");
            $("a:contains('Continue')")[0].click();
            clearInterval(interval);
        }
        else if($("a:contains('Start Quiz')").length > 0){
            console.log("found Start Quiz");
            $("a:contains('Start Quiz')")[0].click();
            clearInterval(interval);
        }
        else if($(".middle-img-main").length > 0){
            var quizId = window.location.pathname.split("/")[2];
            var imageUrl = $(".middle-img-main").first().children().first().attr("src");
            var answer = answers[quizId][imageUrl];
            console.log("found middle-img-main answer = " + answer + " quizId = " + quizId + " imageUrl = " + imageUrl);
            $("button:contains(" + answer + ")").click();
            clearInterval(interval);
        }
    }, 200);
});