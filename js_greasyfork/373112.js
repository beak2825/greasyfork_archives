// ==UserScript==
// @name         UI SHOW/HIDE
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  presh U in game to hide fully UI
//@require       https://code.jquery.com/jquery-3.3.1.slim.min.js
// @author       John Taxmi&FlareZ
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373112/UI%20SHOWHIDE.user.js
// @updateURL https://update.greasyfork.org/scripts/373112/UI%20SHOWHIDE.meta.js
// ==/UserScript==

var SomethingElse = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#mapDisplay').css('visibility', 'visible');
                                    } else {
                                        $("#mapDisplay").css('visibility', 'hidden');
                                    }
                                        SomethingElse = !SomethingElse
                                    //document.getElementById("leaderboard")
                                    }
                            });

var SomethingElse2 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse2 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#actionBar').css('visibility', 'visible');
                                    } else {
                                        $("#actionBar").css('visibility', 'hidden');
                                    }
                                        SomethingElse2 = !SomethingElse2
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse3 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse3 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#topInfoHolder').css('visibility', 'visible');
                                    } else {
                                        $("#topInfoHolder").css('visibility', 'hidden');
                                    }
                                        SomethingElse3 = !SomethingElse3
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse4 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse4 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#ageBarContainer').css('visibility', 'visible');
                                    } else {
                                        $("#ageBarContainer").css('visibility', 'hidden');
                                    }
                                        SomethingElse4 = !SomethingElse4
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse5 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse5 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#ageText').css('visibility', 'visible');
                                    } else {
                                        $("#ageText").css('visibility', 'hidden');
                                    }
                                        SomethingElse5 = !SomethingElse5
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse6 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse6 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#storeButton').css('visibility', 'visible');
                                    } else {
                                        $("#storeButton").css('visibility', 'hidden');
                                    }
                                        SomethingElse6 = !SomethingElse6
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse7 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse7 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#allianceButton').css('visibility', 'visible');
                                    } else {
                                        $("#allianceButton").css('visibility', 'hidden');
                                    }
                                        SomethingElse7 = !SomethingElse7
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse8 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse8 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#chatButton').css('visibility', 'visible');
                                    } else {
                                        $("#chatButton").css('visibility', 'hidden');
                                    }
                                        SomethingElse8 = !SomethingElse8
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse9 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse9 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#foodDisplay').css('visibility', 'visible');
                                    } else {
                                        $("#foodDisplay").css('visibility', 'hidden');
                                    }
                                        SomethingElse9 = !SomethingElse9
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse10 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse10 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#woodDisplay').css('visibility', 'visible');
                                    } else {
                                        $("#woodDisplay").css('visibility', 'hidden');
                                    }
                                        SomethingElse10 = !SomethingElse10
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse11 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse11 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#stoneDisplay').css('visibility', 'visible');
                                    } else {
                                        $("#stoneDisplay").css('visibility', 'hidden');
                                    }
                                        SomethingElse11 =  !SomethingElse11
                                    //document.getElementById("leaderboard")
                                    }
                            });
var SomethingElse12 = true;
                            document.addEventListener('keydown', function (something) {
                                if (something.keyCode == 85) {
                                    if (SomethingElse12 == true && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                        $('#scoreDisplay').css('visibility', 'visible');
                                    } else {
                                        $("#scoreDisplay").css('visibility', 'hidden');
                                    }
                                        SomethingElse12 =  !SomethingElse12
                                    //document.getElementById("leaderboard")
                                    }
                            });
