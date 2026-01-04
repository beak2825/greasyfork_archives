// ==UserScript==
// @name         Lair Checker Adjusted 2.0 -- HTTPS+
// @description  Now with colours added by Alana!
// @author       Tiff Zhang (derivative from bookmarklet at http://aywaslairchecker.mygamesonline.org/ ) -- with small modifications by Alana, #70812 on Aywas
// @match        https://www.aywas.com/*
// @license MIT
// @version 0.0.1.20240405182420
// @namespace https://greasyfork.org/users/1284383
// @downloadURL https://update.greasyfork.org/scripts/491742/Lair%20Checker%20Adjusted%2020%20--%20HTTPS%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/491742/Lair%20Checker%20Adjusted%2020%20--%20HTTPS%2B.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var alwaysHighlight = false;

// Lair Checker script taken from http://aywaslairchecker.mygamesonline.org/
function lair_check() {

    // <Species Name> <Genus Name> : <image url>
    var process = function() {
        var page = 1,
            petsTable = [],
            petImages = {},
            resultsTable = {},
            userID, version = "0.10",
            phoneHome = true,
            remoteVersion, versionCheckComplete = false,
            versionAnswer;

        function versionCheck() {
            $.ajax("http://aywaslairchecker.net/bookmarklets/lite/version.js", {
                dataType: "text",
                cache: false,
                error: function() {
                    versionCheckComplete = true;
                },
                success: function(text) {
                    var data = $.parseJSON(text);
                    remoteVersion = data.currentVersionNew;
                    if (remoteVersion !== version) {
                        var ref = "http://aywaslairchecker.net/bookmarklets/lite/lite-";
                        if (phoneHome) ref = ref + "checkin-";
                        ref = ref + "min.bm.js";
                        $.ajax(ref, {
                            dataType: "text",
                            cache: false,
                            error: function() {
                                versionCheckComplete = true;
                            },
                            success: function(text) {
                                versionAnswer = $('<div></div>');
                                versionAnswer.append($('<p class="keep">This version is out of date.  The current version is V' + remoteVersion + '</p>'));
                                versionAnswer.append($('<p class="keep">' + data.updateMessage + '</p>'));
                                var a = $('<a href="' + text + '">Aywas Lair Checker V' + remoteVersion + '</a>');
                                versionAnswer.append(a);
                                versionCheckComplete = true;
                            }
                        });
                    } else {
                        versionCheckComplete = true;
                    }
                }
            });
        }

        function generateOutput() {
            if (!versionCheckComplete) {
                window.setTimeout(generateOutput, 10000);
                return;
            }
            if (phoneHome) {
                $.get("http://aywaslairchecker.net/checkin.php", {
                    id: userID,
                    version: 0.6,
                    lite: true
                });
            }
            var output = document.createElement('div'),
                k, ul, li, a, i;
            for (k in resultsTable) {
                if (resultsTable.hasOwnProperty(k)) {
                    if (resultsTable[k].length > 1) {
                        i = 0;
                        ul = document.createElement('ul');
                        $(ul).text(k);
                        for (i = 0; i < resultsTable[k].length; i += 1) {
                            li = document.createElement('li');
                            a = document.createElement('a');
                            $(a).text(resultsTable[k][i].name);
                            $(a).attr("href", "https://www.aywas.com/pp/view/" + resultsTable[k][i].id + "/");
                            $(li).append(a);
                            $(ul).append(li);
                        }
                    }
                    $(output).append(ul);
                }
            }
            $('title').text("Aywas Lair Checker - Results");
            if (versionAnswer) $('body').append(versionAnswer);
            $('body').append($(output));
            $('p:not(".keep")').hide().queue(function(next) {
                $(this).remove();
                next();
            });
        }

        function addTable(element) {
            var breed, id, name;
            breed = $(element).find(".gen-small > a > strong").text().split(' the ');
            breed = breed[breed.length - 1];
            breed = breed.trim().split('(')[0].trim().replace(/^\s*\S*(Male|Female|Androgynous|Hermaphrodite|Undecided|Robot|Genderless|Agender|Bigender|Genderqueer|Neutrois|Pangender|Genderfluid|Non-Binary|Intersex|Other)/i, "").trim();
            id = $(element).find(".gen-small > a > strong").text().split('(')[1].match(/\d+/ig);
            if (id) {
                id = Number(id[0]);
            }
            name = $(element).find(".gen-small > a > strong").text();
            if (!breed.match(/Custom/ig)) {
                if (!resultsTable[breed]) {
                    resultsTable[breed] = [];
                }
                resultsTable[breed].push({
                    id: id,
                    name: name
                });
            }
        }

        function addTables() {
            var i;
            for (i = 0; i < petsTable.length; i += 1) {
                addTable(petsTable[i]);
            }

            localStorage.setItem("petImages", JSON.stringify(petImages));

            localStorage.setItem("petsList", JSON.stringify(resultsTable));
            generateOutput();
        }

        function fetchPage() {
            $('body').append($("<p>Loading page " + page + ".  Pets loaded so far: " + petsTable.length + "</p>"));
            $('title').text("Aywas Lair Checker: Loading page " + page + ".  Pets loaded so far: " + petsTable.length);
            var listUrl = "https://www.aywas.com/lair/group/" + userID + "/all/?p=" + page + "&l=240",
                pageResult = [],
                i;
            $.ajax(listUrl, {
                dataType: "text",
                success: function(xml) {
                    //xml = xml.replace(/<[^\/]*img[^>]*>([^<]*<[^\/\w]*\/img[^>]*>)*/gi, "");
                    pageResult = $(xml).find('div#lair-sort-pets > div');
                    for (i = 0; i < pageResult.length; i += 1) {

                        pageResult[i].innerHTML = pageResult[i].innerHTML.replace(/src\s*=\s*"https:\/\/www\.aywas\.com\/+images(\/+images)?\/pets\/([^"]+)"/gi, function (match, $i, identifier) {
                            if (petImages[identifier]) {
                                petImages[identifier]++;
                            } else {
                                petImages[identifier] = 1;
                            }
                            return "";
                        });
                        petsTable.push(pageResult[i]);
                    }
                    page = page + 1;
                    if (pageResult.length) {
                        //If your lair checker gets stuck and won't continue, increase the number below by 1000 and try again until it makes it all the way through!
                        setTimeout(fetchPage,1000);
                    } else {
                        $('body').append($("<p>Load complete.  Loaded " + petsTable.length + " pets.</p>"));
                        addTables();
                    }
                }
            });
        }

        function getUserID() {
            userID = $("div#side > h3 > a");
            if (userID && userID.length) {
                userID = Number(userID.attr('href').match(/\d+/i)[0]);
            }
        }
        var scripts = document.getElementsByTagName('script');
        while (scripts.length) {
            scripts[0].parentElement.removeChild(scripts[0]);
        }
        scripts = document.getElementsByTagName('link');
        while (scripts.length) {
            scripts[0].parentElement.removeChild(scripts[0]);
        }
        var script = document.createElement('script');
        script.src = "//code.jquery.com/jquery-1.10.2.min.js";
        script.type = "text/javascript";
        script.onload = function() {
            getUserID();
            $('body').remove();
            $('html').append($('<body></body>'));
            $('body').append($('<h1>Aywas Lair Checker V' + version + '</h1>'));
            window.setTimeout(versionCheck, 1);
            fetchPage();

        };
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    if (!(location.host.match(/.*aywas.*/ig) && location.host.match(/.*aywas.*/ig).length) && !(location.hostname.match(/.*aywas.*/ig) && location.hostname.match(/.*aywas.*/ig).length)) {
        alert("Please re-run this bookmarklet from Aywas.com!");
        location.href = "https://www.aywas.com/";
    } else {
        process();
    }
};

$(document).ready(function() {

    var map = [];

    $("#side-mail").prepend('<p><a href="javascript:;" id="owned-pets-button" class="ctabtn normal"><span>Owned Pets</span></a></p>');
    $("#side-mail").prepend('<p><a href="#" id="lair-check-button" class="ctabtn normal"><span>Check Lair</span></a></p>');
    $("#lair-check-button").click(function() {
        lair_check();
    });

    function highlightPets() {
        var petsList = JSON.parse(localStorage.getItem("petsList"));
        var petImages = JSON.parse(localStorage.getItem("petImages"));

        var imageRegex = /https?:\/\/www\.aywas\.com\/+images(\/+images)?\/pets\/([^"]+)/i;
        $("#content img").each(function () {
            var res = $(this).attr('src').match(imageRegex);
            if (res) {
                var ident = res[2];
                if (petImages[ident]) {
                    if (petImages[ident] > 1) {
                        $(this).css("background-color", "blue");
                    } else {
                        $(this).css("background-color", "green");
                    }
                } else {
                    $(this).css("background-color", "red");
                }
            }
        });

        $("#lair-pets .item-thumb").each(function () {
            const nameElement = $(this).find(".gen-small > a > strong");
            const name = nameElement.text();
            let breed = name.split(' the ');
            breed = breed[breed.length - 1];
            breed = breed.trim().split('(')[0].trim().replace(/^\s*\S*(Male|Female|Androgynous|Hermaphrodite|Undecided|Robot|Genderless|Agender|Bigender|Genderqueer|Neutrois|Pangender|Genderfluid|Non-Binary|Intersex|Other)/i, "").trim();
            let id = name.split('(')[1].match(/\d+/ig);
            if (id) {
                id = Number(id[0]);
            }
            let list = petsList[breed];
            if (list) {
                list.forEach(function (pet, i) {
                    if (pet.id === id && i >= 1) {
                        nameElement.css("background-color", "purple");
                    }
                });
            }
        });

        $("select").each(function () {
            if ($(this).attr("name") == "species_id") {
                $(this).find("option").each(function () {
                    var pet = $(this).html();
                    if (resultsTable[pet]) {
                        $(this).html(pet + " (OWNED)");
                    }
                });
            }
        });
    }

    $("#owned-pets-button").click(highlightPets);

    // From http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';

        if (map[17] && map[81]) {
            highlightPets();
        }
    }

    if (alwaysHighlight) {
        highlightPets();
    }

});
