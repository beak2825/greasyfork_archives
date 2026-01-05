// ==UserScript==
// @name         MyAnimeList(MAL) - Random Anime/Manga/People & Characters
// @version      1.3.13
// @description  Search for a random anime, manga, person or character
// @author       Cpt_mathix
// @match        *://myanimelist.net/*
// @exclude      *://myanimelist.net/animelist*
// @exclude      *://myanimelist.net/mangalist*
// @license      GPL-2.0+; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @noframes
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/12782/MyAnimeList%28MAL%29%20-%20Random%20AnimeMangaPeople%20%20Characters.user.js
// @updateURL https://update.greasyfork.org/scripts/12782/MyAnimeList%28MAL%29%20-%20Random%20AnimeMangaPeople%20%20Characters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cancelling = false;
    initScript();
    initSearchPopup();
    injectCSS();

    function initScript() {
        if (document.location.href.indexOf('hideLayout') == -1) {
            if (!document.getElementById('randAnime')) {
                anime();
            }
            if (!document.getElementById('randManga')) {
                manga();
            }
            if (!document.getElementById('randPerson')) {
                person();
            }
            if (!document.getElementById('randCharacter')) {
                character();
            }
        }

        if (getInfoFromUrl(document.location.href, "random") === "true") {
            var header_right = document.getElementsByClassName("header-right")[0];
            header_right.insertAdjacentHTML("afterbegin", '<a href="javascript:void(0);" id="new_random" class="js-anime-edit-info-button">New Random</a> - ');
            header_right.addEventListener("click", function() {
                initSearching();
                var type = getInfoFromUrl(document.location.href, "randomType");
                switch(type) {
                    case "anime":
                        getRandomAnime();
                        break;
                    case "manga":
                        getRandomManga();
                        break;
                    case "people":
                        getRandomPeople();
                        break;
                    case "character":
                        getRandomCharacter();
                        break;
                    default:
                        alert("Something went wrong, sorry for the inconvenience");
                        break;
                }
            });
        }
    }

    function getInfoFromUrl(url, info) {
        if (url.indexOf('?') === -1) {
            return null;
        }

        var urlVariables = url.split('?')[1].split('&'),
            varName;

        for (var i = 0; i < urlVariables.length; i++) {
            varName = urlVariables[i].split('=');

            if (varName[0] === info) {
                return varName[1] === undefined ? null : varName[1];
            }
        }
    }

    // ** DROPDOWN ** //

    function anime() {
        var animeDropmenu = document.querySelector('#nav > li:nth-child(1) > ul');
        var newli1 = document.createElement('li');
        var html1 = "<a id=\"randAnime\" href=\"javascript:void(0)\">Random Anime</a>";
        newli1.innerHTML = html1;
        animeDropmenu.insertBefore(newli1, document.querySelector('#nav > li:nth-child(1) > ul > li:nth-child(3)').nextSibling);
        newli1.addEventListener('click', function() {
            initSearching();
            getRandomAnime();
        });
    }

    function manga() {
        var mangaDropmenu = document.querySelector('#nav > li:nth-child(2) > ul');
        var newli2 = document.createElement('li');
        var html2 = "<a id=\"randManga\" href=\"javascript:void(0)\">Random Manga</a>";
        newli2.innerHTML = html2;
        mangaDropmenu.insertBefore(newli2, document.querySelector('#nav > li:nth-child(2) > ul > li:nth-child(2)').nextSibling);
        newli2.addEventListener('click', function() {
            initSearching();
            getRandomManga();
        });
    }

    function person() {
        var industryDropmenu = document.querySelector('#nav > li:nth-child(4) > ul');
        var newli3 = document.createElement('li');
        var html3 = "<a id=\"randPerson\" href=\"javascript:void(0)\">Random Person</a>";
        newli3.innerHTML = html3;
        industryDropmenu.insertBefore(newli3, document.querySelector('#nav > li:nth-child(4) > ul > li:nth-child(3)').nextSibling);
        newli3.addEventListener('click', function() {
            initSearching();
            getRandomPeople();
        });
    }

    function character() {
        var industryDropmenu = document.querySelector('#nav > li:nth-child(4) > ul');
        var newli4 = document.createElement('li');
        var html4 = '<a id="randCharacter" href="javascript:void(0)">Random Character</a>';
        newli4.innerHTML = html4;
        industryDropmenu.insertBefore(newli4, document.querySelector('#nav > li:nth-child(4) > ul > li:nth-child(5)').nextSibling);
        newli4.addEventListener('click', function() {
            initSearching();
            getRandomCharacter();
        });
    }

    // ** FIND RANDOM ** //

    function getRandomAnime() {
        updateSearching();

        var r = Math.floor(Math.random() * 63000);
        $.get('/includes/ajax.inc.php?t=64&id=' + r, function(result) {
            if (result.length > 29) {
                searchSuccess("Found random anime, redirecting...");
                document.location.href = '/anime/' + r + '?random=true&randomType=anime';
            } else {
                getRandomAnime();
            }
        }).fail( function() {
            getRandomAnime();
        });
    }

    function getRandomManga() {
        updateSearching();

        var r = Math.floor(Math.random() * 185000);
        $.get('/includes/ajax.inc.php?t=65&id=' + r, function(result) {
            if (result.length > 0) {
                searchSuccess("Found random manga, redirecting...");
                document.location.href = '/manga/' + r + '?random=true&randomType=manga';
            } else {
                getRandomManga();
            }
        }).fail( function() {
            getRandomManga();
        });
    }

    function getRandomPeople() {
        updateSearching();

        var r = Math.floor(Math.random() * 85000);
        $.get('/people/' + r, function(result) {
            searchSuccess("Found random person, redirecting...");
            document.location.href = '/people/' + r + '?random=true&randomType=people';
        }).fail( function() {
            getRandomPeople();
        });
    }

    function getRandomCharacter() {
        updateSearching();

        var r = Math.floor(Math.random() * 270000);
        $.get('/character/' + r, function(result) {
            if(!$(result).find('#content > div.badresult').length) {
                searchSuccess("Found random character, redirecting...");
                document.location.href = '/character/' + r + '?random=true&randomType=character';
            } else {
                getRandomCharacter();
            }
        }).fail( function() {
            getRandomCharacter();
        });
    }

    // ** SEARCHING ** //

    function initSearching() {
        cancelling = false;
        $("#searchGrid").html('Searching: <span id="searchCounter">0</span>');
        $("#gmSearchContainer").show();
    }

    function updateSearching() {
        var counter = document.getElementById("searchCounter");
        if (counter) {
            var count = parseInt(counter.innerHTML);
            if (count > 200) {
                cancelSearching("Limit reached (Too Many Requests)! Please change your settings to be less specific...");
            } else {
                $(counter).html(count + 1);
            }
        }
    }

    function searchSuccess(text) {
        $("#searchGrid").html(text);
        $("#gmCancelSearchingButton").hide();
    }

    function cancelSearching(text) {
        cancelling = true;
        $("#searchGrid").html(text);
        $("#gmCancelSearchingButton").hide();
        $("#gmCloseSearchPopupButton").show();
    }

    function initSearchPopup() {
        var popup_html = '';

        popup_html += '<div id="gmSearchContainer" class="popup-container">';
        popup_html += '    <div id="searchGrid"></div>';
        popup_html += '    <div id="buttonsGrid">';
        popup_html += '        <button id="gmCloseSearchPopupButton" type="button" style="display:none">Ok</button>';
        popup_html += '        <button id="gmCancelSearchingButton" type="button">Cancel</button>';
        popup_html += '    </div>';
        popup_html += '</div>';

        $("body").append(popup_html);

        $("#gmCloseSearchPopupButton").click(function() {
            $("#gmSearchContainer").hide();
            $("#gmCloseSearchPopupButton").hide();
            $("#gmCancelSearchingButton").show();
        });

        $("#gmCancelSearchingButton").click(function() {
            cancelSearching("User cancelled searching");
            $("#gmCancelSearchingButton").hide();
            $("#gmCloseSearchPopupButton").show();
        });
    }

    // *** CSS *** //

    function injectCSS() {
        var css = `
.popup-container {
display:                none;
text-align:             left;
position:               fixed;
top:                    50%;
left:                   50%;
padding:                20px;
background:             white;
border:                 3px double black;
border-radius:          1ex;
z-index:                777;
-ms-transform:           translate(-50%,-50%);
-moz-transform:          translate(-50%,-50%);
-webkit-transform:       translate(-50%,-50%);
transform:              translate(-50%,-50%);
}
#buttonsGrid {
display:                flex;
justify-content:        center;
}
#buttonsGrid button {
margin:                 1em 1.5em 0 1.5em;
}
#searchGrid {
text-align:             center;
font-size:              13px;
}
`;

        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.documentElement.appendChild(style);
    }
})();
