// ==UserScript==
// @name         SkipperScript
// @version      0.8
// @match        ://stream.proxer.me/*
// @description  It should be able to skip and autoskip intos
// @author       Schlauewurst
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://www.gstatic.com/firebasejs/6.2.3/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/6.2.3/firebase-firestore.js
// @namespace    https://greasyfork.org/users/312840
// @downloadURL https://update.greasyfork.org/scripts/386772/SkipperScript.user.js
// @updateURL https://update.greasyfork.org/scripts/386772/SkipperScript.meta.js
// ==/UserScript==

/*TODO
Add visualy ->  Intro(red) outro(red) filler(blue)
Icons
Add compatibly to other players
Skip Flashbacks
Skip Filler
Parse all the Info from somewhere
*/

(function() {
    'use strict';
    var whatskip = "intro",
        database,
        currentdata,
        IntroStart,
        IntroEnd,
        OutroStart,
        url = new URL(window.location.href).searchParams.get("ref").split("/"),
        thisepisode = parseInt(url[3]),
        thisanime = parseInt(url[2]);

    function initDatabase() {
        firebase.initializeApp({
            apiKey: "AIzaSyB9s0n2m60SQQdbVTnN6UICAkBrC4svfwg",
            authDomain: "proxerinfobase.firebaseapp.com",
            projectId: "proxerinfobase"
        });
        return firebase.firestore();
    }

    function displayTime(sek) {
        const time = new Date(null);
        time.setSeconds(sek);
        return time.getMinutes() + ":" + ('0' + time.getSeconds()).slice(-2);
    }

    function getSekonds(time) {
        time = time.split(":");
        return parseInt(time[0] * 60) + parseInt(time[1])
    }

    function createCookie(name, value, days = 365) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    function loadSettings(data = false) {

        "true" == getCookie("autoplay") && $("#autoplay").prop("checked", !0);
        "true" == getCookie("skipintro") && $("#skipintro").prop("checked", !0);
        "true" == getCookie("skipoutro") && $("#skipoutro").prop("checked", !0);
        "true" == getCookie("checkskip") && $("#checkskip").prop("checked", !0);


        if (data) {
            OutroStart = currentdata.StartOutro;
            IntroEnd = currentdata.EndIntro;
            IntroStart = currentdata.StartIntro;
            $("#getOutroStart").val(displayTime(OutroStart));
            $("#getIntroStart").val(displayTime(IntroStart));
            $("#getIntroEnd").val(displayTime(IntroEnd));
            $("#infobox").text("Match: " + currentdata.match);
            $("#fillerbox").text("Filler: " + currentdata.Filler);
        }

        if (player.ready && $("#autoplay").is(":checked")) {
            player.play()
        }else{
            player.play()
            player.pause()
        }
    }

    function makeButtons() {
        $("#psplayercontrols").append(" | <button id='hidebtn'>Show</button>")
        $("#player_code").find("div").first().prepend("<span style='border-radius:10px;display:none;padding:10px;margin:5% 0px 0px 10%;position:fixed;z-index:10;background:rgba(100,100,100,0.8);color:white;width:80%;height:80%;' id='buttonlist'>");
        $("#buttonlist").append("<div style='margin-top:5px' id='infobox'>Match: None</div>");
        $("#buttonlist").append("<div style='margin-top:5px' id='fillerbox'>Filler: None</div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label for='autoplay'>Autoplay</label><input id='autoplay' name='autoplay' type='checkbox'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label for='skipintro'>Skip Intro</label><input id='skipintro' name='skipintro' type='checkbox'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label for='skipoutro'>Skip Outro</label><input id='skipoutro' name='skipoutro' type='checkbox'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label for='checkskip'>Try to fill the Data</label><input id='checkskip' name='checkskip' type='checkbox'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label>Intro Start:</label><input style='width:40px' id='getIntroStart' value='0:00'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label>Intro End:</label><input style='width:40px' id='getIntroEnd' value='1:40'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label>Outro Start:</label><input style='width:40px' id='getOutroStart' value='22:00'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><label>Mark Episode as Filler</label><input type='checkbox' id='getFiller'></input></div>");
        $("#buttonlist").append("<div style='margin-top:5px'><button id='updatedata'>Update Data</button></div>");
        $("#player_code").find("div").first().append("</span>");
        $("#player_code").find("div").first().prepend("<button style='z-index:10;position:fixed;bottom:50px;left:20px;display:none' id='skipbtn'>Skip</button>")
    }

    function startNextEpisode() {
        window.top.location.href = "https://proxer.me/watch/" + thisanime + "/" + (parseInt(thisepisode) + 1) + "/" + url[4]
    }

    function workWithData() {
        let checkskip = ("true" == getCookie("checkskip"))
        if (currentdata == undefined) {
            loadSettings();
        } else {
            if(checkskip || currentdata.match=="same Episode"){
                loadSettings(true);
            }else{
                loadSettings();
            }
        }
    }

    function getCurrentData() {
        database.collection("Anime").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let info = doc.data();
                if (info.Anime == thisanime) {
                    if (currentdata == undefined) {
                        currentdata = info;
                        currentdata.match = "same Anime";
                    }
                    if (info.Episode == thisepisode) {
                        currentdata = info;
                        currentdata.match = "same Episode";
                    }
                }
            });
            workWithData()
        });
    }

    function displayProgressbar(){
        if(IntroStart != undefined){
            let pis = IntroStart/player.duration,
                pie = (IntroEnd/player.duration)-pis,
                pos = OutroStart/player.duration,
                poe = 1-pos,
                m = $(".plyr__progress").find("input").width();
            $(".plyr__progress").append("<div id='introbar' style='top:-12px;position:relative;pointer-events: none;background:red;height:5px;'></div>");
            $(".plyr__progress").append("<div id='outrobar' style='top:-17px;position:relative;pointer-events: none;background:red;height:5px;'></div>");
            $("#introbar").css("left",pis*m+"px")
            $("#introbar").css("width",pie*m+"px")
            $("#outrobar").css("left",pos*m+"px")
            $("#outrobar").css("width",poe*m+"px")
        }else{
            setTimeout(function(){
                displayProgressbar();
            }, 500);
        }
    }

    player.on("loadedmetadata",function(){
        displayProgressbar()
    })

    function startTimer(data = false) {
        setInterval(function() {
            let skip1 = $("#skipintro").is(":checked"),
                skip2 = $("#skipoutro").is(":checked");
            $("#skipbtn").hide();
            if (skip1 && player.currentTime > IntroStart && player.currentTime < IntroEnd) {
                player.currentTime = IntroEnd;
            } else if (player.currentTime > IntroStart && player.currentTime < IntroEnd) {
                $("#skipbtn").show();
                whatskip = "intro"
            }

            if (skip2 && player.currentTime > OutroStart) {
                startNextEpisode()
            } else if (player.currentTime > OutroStart) {
                $("#skipbtn").show();
                whatskip = "outro"
            }
        }, 1000);
    }



    $(document).ready(function() {
        database = initDatabase();
        getCurrentData();
        makeButtons();
        startTimer();

        $(document).on("click", "#hidebtn", function() {
            if ($(this).text() == "Hide") {
                $(this).text("Show");
                $("#buttonlist").hide();
            } else {
                $(this).text("Hide");
                $("#buttonlist").show();
            }
        })

        $(document).on("click", "#autoplay", function() {
            let autoplay = $(this).is(":checked")
            createCookie("autoplay", autoplay);
        })

        $(document).on("click", "#skipoutro", function() {
            let skipoutro = $(this).is(":checked")
            createCookie("skipoutro", skipoutro);
        })

        $(document).on("click", "#skipintro", function() {
            let skipintro = $(this).is(":checked")
            createCookie("skipintro", skipintro);
        })

        $(document).on("click", "#checkskip", function() {
            let checkskip = $(this).is(":checked")
            createCookie("checkskip", checkskip);
            workWithData();
        })

        $(document).on("click", "#updatedata", function() {
            database.collection("Anime").doc(thisanime + "-" + thisepisode).set({
                StartOutro: getSekonds($("#getOutroStart").val()),
                EndIntro: getSekonds($("#getIntroEnd").val()),
                StartIntro: getSekonds($("#getIntroStart").val()),
                Anime: thisanime,
                Episode: thisepisode,
                Filler: $("#getFiller").is(":checked")
            }, {
                merge: true
            }).then(function(docRef) {
                $("#updatedata").text("Data Updated");
                OutroStart = getSekonds($("#getOutroStart").val());
                IntroStart = getSekonds($("#getIntroStart").val());
                IntroEnd = getSekonds($("#getIntroEnd").val());
            }).catch(function(error) {
                console.error("Error adding document: ", error);
            });
        })



        $(document).on("click", "#skipbtn", function() {
            if (whatskip == "intro") {
                player.currentTime = IntroEnd;
            } else if (whatskip == "outro") {
                startNextEpisode()
            }
            $("#skipbtn").hide();
        })

    })

})();