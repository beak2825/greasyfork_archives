// ==UserScript==
// @name         HaxBall Map Picker
// @namespace    https://greasyfork.org/en/users/165127-hydrosaur
// @version      3.0
// @icon         https://www.haxball.com/favicon.ico
// @description  Load and Save maps from haxmaps just using an ID.
// @author       -Electron-
// @include      https://www.haxball.com/FFuuq69i/__cache_static__/g/game.html
// @supportURL   https://www.reddit.com/message/compose/?to=-Electron-
// @website      https://redd.it/no-post-yet
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379006/HaxBall%20Map%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/379006/HaxBall%20Map%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pickerPopupIsShown = false;
    let gamePageIsShown = false;

    let haxMap = 0;

    let favoritesListShown = false;

    if(!localStorage.getItem("saved_maps")){
        localStorage.setItem("saved_maps", "{}");
    }

    setInterval(function(){
        if($(".dialog.pick-stadium-view").length){
            if(!pickerPopupIsShown) showPicker();
            pickerPopupIsShown = true;
        } else {
            if(pickerPopupIsShown) hidePicker();
            pickerPopupIsShown = false;
        }

        if($("button[data-hook='leave-btn']").length){
            if(!gamePageIsShown) gamePageShown();
            gamePageIsShown = true;
        } else {
            if(gamePageIsShown) gamePageHidden();
            gamePageIsShown = false;
        }
    }, 250);

    function showPicker(){
        $(".dialog.pick-stadium-view h1").eq(0).append("<img class='loader' style='display: none' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAIqSURBVDhPdVM9rCFRFB4FeaJQ0ChVEiT7si0iopBotbQUgqh0FKIVPxlvRSEhEXpR7q4NkQiVzXuLRCK6jUTjvWXunTt7zuyY4L39ki8zc+45537nZ7gP8Nnn8/HZbPalVCq9FYvFUygUegH7FzyTPf4DPbAeDocJY0y6RzweF3ieF91u95PiewM0/ABKcKugxMiAZGy5XNJarSbbD4cDA0VfwfcBAy+oA6VAIEC73S6Fm874zGQy1Gq1inhms9nYfr+XpWESl8uFSmRgXSyRSFCAqr1QKAhgl67p9/vFi0+v1zuD7ZHzer18Op0W7uuu1+v0PgEyGo2Sfr9Pm80mge8nDrtdrVb/KHEqOp3OOwUajUaaTCZ0t9tRSIQXLDkc1UcJyuUyNZvNcv0XRiIRqhxL6/UaEwhyglgsRsbjMcUyRFFE+WQ2m4mEEDYcDin2x26300sTEdgLvV5/5uDwp06nY3iDw+GgyWRS2G63ouKnApNiQuVTOp1OzGAwPHNarZa/lgmdVmVeYzQa0cVioSZuNBqv4F8CwihgjBiMNBqNTBCE25EAVqsVTaVSZD6f0+l0SoLB4G/w/wSUgXuuqoAxESVOxmazEWGR1IZaLJY3WKQavKvAVf7udDpJLpejMEJSqVSEdrtNW60WMZlMqkKF34A3q4x4wPUcDAb4M8klHI9HEZp6vVC4PKj23c90jUePx8ODkmcccT6ff4UF+gV2lKzW/A8c9xdfxQlApF7TUgAAAABJRU5ErkJggg==' />");

        rotateForEver($(".dialog.pick-stadium-view h1 .loader"));

        $(`<button data-hook="favorites">Favorites</button>`).insertAfter(".dialog.pick-stadium-view .buttons .file-btn");
        $(`<button data-hook="haxmapid">HaxMapID</button>`).insertAfter(".dialog.pick-stadium-view .buttons .file-btn");
        $(`<button data-hook="searchmaps">Search</button>`).insertAfter(".dialog.pick-stadium-view .buttons .file-btn");
        $("button[data-hook='haxmapid']").click(function(){
            let mapID = prompt("Map ID:");

            if(!isNaN(Number(mapID)) && mapID){

                changeStadium(mapID);
            } else {
                alert("Invalid Map ID")
            }
        });

        $("button[data-hook='searchmaps']").click(function(){
            let mapSearch = prompt("Map Search:");

            if(mapSearch){
                $(".dialog.pick-stadium-view .loader").css("display", "inline");
                fetch("https://streamlyne.stream:88/haxmaps/" + encodeURIComponent(mapSearch)).then(a => a.json()).then(json => {
                    favoritesListShown = true;

                    $(".dialog.pick-stadium-view .list.ps").empty();

                    let savedMaps = json.maps;

                    savedMaps.forEach((item, idx) => {
                        $(".dialog.pick-stadium-view .list.ps").append(`<div class="elem" data-id="${item.id}">DLS:<b>${item.downloads}</b>|${item.name}</div>`);
                    });

                    $(".dialog.pick-stadium-view .list.ps .elem").click(function(){
                        $(".selected").removeClass("selected");
                        $(this).addClass("selected");
                        $("button[data-hook='pick']").prop("disabled", false);
                    });

                    $("button[data-hook='pick']").click(function(){
                        console.log("cliq");
                        if($(".dialog.pick-stadium-view .list.ps .selected").length){
                            if(!isNaN(Number($(".dialog.pick-stadium-view .list.ps .selected").attr("data-id")))){
                                changeStadium($(".dialog.pick-stadium-view .list.ps .selected").attr("data-id"));
                            }
                        }
                    });

                    $(".dialog.pick-stadium-view .loader").hide();
                }).catch(function(){
                    $(".dialog.pick-stadium-view .loader").hide();
                });
            }
        });

        $("button[data-hook='favorites']").click(function(){
            favoritesListShown = true;

            $(".dialog.pick-stadium-view .list.ps").empty();

            let savedMaps = JSON.parse(localStorage.getItem("saved_maps"));

            Object.keys(savedMaps).forEach((item, idx) => {
                $(".dialog.pick-stadium-view .list.ps").append(`<div class="elem" data-id="${savedMaps[item]}">${item}</div>`);
            });

            $(".dialog.pick-stadium-view .list.ps .elem").click(function(){
                $(".selected").removeClass("selected");
                $(this).addClass("selected");
                $("button[data-hook='pick']").prop("disabled", false);
            });

            $("button[data-hook='pick']").click(function(){
                console.log("cliq");
                if($(".dialog.pick-stadium-view .list.ps .selected").length){
                    if(!isNaN(Number($(".dialog.pick-stadium-view .list.ps .selected").attr("data-id")))){
                        changeStadium($(".dialog.pick-stadium-view .list.ps .selected").attr("data-id"));
                    }
                }
            });
        });
    }

    function hidePicker(){
        favoritesListShown = false;
    }

    function gamePageShown(){
        if(!$("button[data-hook='addfavorites']").length){
            $(".settings").append("<button class='admin-only' data-hook='addfavorites' style='width: 100%'>Add Map To Favorites</button>");

            $("button[data-hook='addfavorites']").click(function(){
                if(haxMap){
                    let saved_maps = JSON.parse(localStorage.getItem("saved_maps"));
                    let savedMapIDs = Object.values(saved_maps);

                    if(savedMapIDs.includes(Number(haxMap))){
                        alert("You have already saved this map.");
                    } else {
                        saved_maps[$("label[data-hook='stadium-name']").text()] = Number(haxMap);
                        localStorage.setItem("saved_maps", JSON.stringify(saved_maps));
                        alert("Saved " + $("label[data-hook='stadium-name']").text());
                    }
                } else {
                    alert("You can only favorite maps that are uploaded to haxmaps.com");
                }
            });
        }
    }

    function gamePageHidden(){

    }

    $("button[data-hook='pick']").click(function(){
        haxMap = 0;
    })

    function searchForMaps(query){
        fetch("https://streamlyne.stream:88/proxy?link=http://haxmaps.com/hb/rpc").then(a => a.text()).then(text => {
            let listElems = $(text);

            console.log(Array.from(listElems))
        });
    }

    function linkToBlob(link){
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", link);
            xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
            xhr.onload = function(){
                resolve(xhr.response);
            }
            xhr.send();
        });
    }

    function getHaxBallMapText(id){
        return new Promise(function(resolve, reject) {
            fetch("https://streamlyne.stream:88/proxy?link=http://haxmaps.com/dl/" + id).then(a => a.text()).then(function(text){
                resolve(text);
            });
        });
    }

    function changeStadium(id){
        getHaxBallMapText(id).then(text => {
            if(text.length > 2){
                changeStadiumFromText(text);
                haxMap = Number(id);
            } else {
                alert("Map ID out of range");
            }
        });
    }

    function rotateForEver($elem, rotator) {
        if (rotator === void(0)) {
            rotator = $({deg: 0});
        } else {
            rotator.get(0).deg = 0;
        }

        return rotator.animate(
            {deg: 360},
            {
                duration: 5000,
                easing: 'linear',
                step: function(now){
                    $elem.css({transform: 'rotate(' + now + 'deg)'});
                },
                complete: function(){
                    rotateForEver($elem, rotator);
                },
            }
        );
    }

    function changeStadiumFromText(text){
        const dT = new ClipboardEvent('').clipboardData || // Firefox < 62 workaround exploiting https://bugzilla.mozilla.org/show_bug.cgi?id=1422655
              new DataTransfer(); // specs compliant (as of March 2018 only Chrome)
        dT.items.add(new File([text], 'programmatically_created.hbs'));
        console.log(text);
        document.getElementById("stadfile").files = dT.files;
    }

    // Your code here...
})();