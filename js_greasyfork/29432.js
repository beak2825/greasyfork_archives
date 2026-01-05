// ==UserScript==
// @name         Bootleggers Bot
// @version      2.0.7
// @description  Bootleggers.us/eu Bot
// @include      /^https?:\/\/(www\.)?bootleggers\.(eu|us)\/./
// @grant        none
// @namespace https://greasyfork.org/users/121065
// @downloadURL https://update.greasyfork.org/scripts/29432/Bootleggers%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/29432/Bootleggers%20Bot.meta.js
// ==/UserScript==


$(document).ready(function () {

        //$.getScript('http://cdn.blimg.us/old/js/timers.js?b=3551', function () {

        if ($('[id=timer-fed]').length === 0) {
            console.log('No timers; adding own');
            $.getScript('http://cdn.blimg.us/old/js/timers.js?b=3551');
            var someHtml = '<style type="text/css"> .timer { border-bottom: 1px solid #B0A8AE !important; text-align: center; width: 12.5%; background-position: center; white-space: nowrap; } .ready { background-image: url(\'http://cdn.blimg.us/old/game-new/site/tablebg_green.gif\'); } .notReady { background-image: url(\'http://cdn.blimg.us/old/game-new/site/tablebg_red.gif\'); } .timer a, .timer a:hover { padding: 1px 10px; text-decoration: none; display: block; } .timer span { font-weight: bold; } .borderRight { border-right: 1px solid #B0A8AE !important; } </style> <div align="center" class=noBorder style=height:15px> <table border="0" cellspacing="0" cellpadding="0" width="100%" style="height: 15px; border-width: 0px" id="countdownTimers"> <tr id="userTimers"> <td class="timer ready" style="border-right: 1px solid #8C867E"> <a href="/autoburglary.php" target="_top"> Auto Burglary: <span id="timer-aut" data-seconds="60" style="color: #8EF393">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/crimes.php" target="_top"> Crime: <span id="timer-cri" data-seconds="60" style="">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/gym.php" target="_top"> Gym: <span id="timer-gym" data-seconds="60" style="">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/jail.php" target="_top"> Jail: <span id="timer-jai" data-seconds="60" style="">Checking...</span> </a> </td> </tr> </table> </div>';
            $("table.cat > tbody > tr:eq(2) > td:eq(1)").prepend(someHtml);
        }


        function getTimeLeft(data) {
            var users = ["California", "Tears", "Dream", "Undertaker", "shimmy"];
            var inJail = false,
                jailTime = 0;
            for (var i = 0; i < users.length; i++) {
                if ($(data).find("#jailRow" + users[i]).length) {
                    inJail = true;
                    jailTime = parseInt($(data).find("#jailRow" + users[i] + " #countdown").text());
                }
            }


            if (inJail) {
                return jailTime;
            } else if ($(data).find("tr > td > .countdown-timeleft").length) {
                var time = $(data).find("tr > td > .countdown-timeleft").text();
                if (time.indexOf(":") == -1 || time.toLowerCase().indexOf("expired") > -1) {
                    return 0;
                } else {
                    time = time.split(":");
                    for (var i = 0; i < time.length; i++) {
                        time[i] = (parseInt(time[i]));
                    }
                    return (time[0] * 360) + (time[1] * 60) + time[2];
                }
            } else {
                return 0;
            }
        }

        var crimeLimitReached;
        $.ajax({
            type: "GET",
            url: "news.php",
            async: false
        }).done(function (data) {
            var crimesToday = parseInt(($(data).find(":contains('Crimes (Today):')").next()).last().text());
            crimeLimitReached = (crimesToday >= 400);
            if (crimeLimitReached)
                console.log("Crime limit reached, won't go to crime");
        });

        $.get("/crimes.php", function (data) {
            startNewTimerLoad(getTimeLeft(data), "cri");
        });
        $.get("/autoburglary.php", function (data) {
            startNewTimerLoad(getTimeLeft(data), "aut");
        });
        $.get("/gym.php", function (data) {
            startNewTimerLoad(getTimeLeft(data), "gym");
        });
        $.get("/jail.php", function (data) {
            startNewTimerLoad(getTimeLeft(data), "jai");
        });
        //});//*/

        jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function (arg) {
            return function (elem) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });

        var times = 0;
        var checker = setInterval(bot, 1000);
        var saver = setInterval(save, 1000);


        function save() {
            if (times > 15) {
                console.log("It's been a bit and nothing happened... Refreshing...");
                location.href = location.href;
                clearInterval(saver);
            } else {
                times++;
            }

            if ($("*:contains(arrested by police)").length || $(".jailMsg").length) {
                console.log("you in jail, REFRESHING");
                setTimeout(function () {
                    location.href = location.href;
                }, 6000);
                clearInterval(saver);
            }
        }

        function notifyMe() {
            if (!Notification) {
                alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.');
                return;
            }

            if (Notification.permission !== "granted")
                Notification.requestPermission();

            var notification = new Notification('Captcha', {
                icon: 'http://www.pandasecurity.com/mediacenter/src/uploads/2014/09/avoid-captcha.jpg',
                body: "A captcha has been detected!",
            });

            notification.onclick = function () {
                window.focus();
            };
        }

        function bot() {
            var notInJail = ($("#timer-jai").text().indexOf("Free") > -1);
            if ($("td[align='center'][class='header']:contains(prevention)").length || $("td[align='center'][class='header']:contains(protection)").length ||
                $("td[align='center'][class='header']:contains(bot)").length || $("td[align='center'][class='header']:contains(script)").length ||
                $("td[align='center'][class='header']:contains(check)").length || $(".insideTables > form:contains(captcha)").length) {
                notifyMe();
                clearInterval(checker);
                clearInterval(saver);
            } else {
                var go = true;

                var gymReady = ($("#timer-gym").text().indexOf("Ready") > -1);
                var gymUrl = "/gym.php";

                var crimeReady = ($("#timer-cri").text().indexOf("Ready") > -1 && !crimeLimitReached);
                var crimeUrl = "/crimes.php";

                var burgReady = ($("#timer-aut").text().indexOf("Ready") > -1);
                var burgUrl = "/autoburglary.php";


                if (document.location.href.indexOf(burgUrl) > -1) {
                    if ($(".header:contains(Stolen car)").length) {
                        clearInterval(checker);
                        go = false;
                        console.log("We stole a car!");
                        var dropCars = ["phaeton", "chevrolet", "stutz", "comet", "essex", "starpegasus"];
                        var carCheckbox = $("input[type='checkbox'][class='selCar']").first();
                        var carStolen = carCheckbox.parent().parent().parent().children("td:eq(2)").text().toLowerCase();
                        var dropped = false;
                        carCheckbox.prop('checked', true);
                        if (carStolen != "duesenberg" || carStolen.indexOf(dropCars) > -1) {
                            console.log("The car sucked so we threw it out...");
                            $("[name='dropCars']").click();
                        } else {
                            console.log("We will send the car to another state...");


                            // Function randomizes state order
                            $.fn.randomize = function (tree, childElem) {
                                return this.each(function () {
                                    var $this = $(this);
                                    if (tree) $this = $(this).find(tree);
                                    var unsortedElems = $this.children(childElem);
                                    var elems = unsortedElems.clone();

                                    elems.sort(function () {
                                        return (Math.round(Math.random()) - 0.5);
                                    });

                                    for (var i = 0; i < elems.length; i++)
                                        unsortedElems.eq(i).replaceWith(elems[i]);
                                });
                            };

                            $("[name='shipCarFrm']").randomize("#goState", "option");

                            $("#shipPlate").val(carCheckbox.parent().parent().parent().children("td:eq(1)").text());
                            $("#goState").children().each(function () {
                                if (parseInt($(this).attr("data-miles")) > 0 && $('#1').text() !== $(this).attr('data-state')) {
                                    $(this).parent().val($(this).val()).change();
                                    $("[name=shipcar]").click();
                                    console.log("We sent the car to another state!");
                                    return false;
                                }
                            });
                        }
                    }
                }

                if (go) {
                    if (gymReady) {
                        if (document.location.href.indexOf(gymUrl) > -1) {
                            console.log("Gym is ready, clicking.");
                            var stats = [{
                                value: 11
                            }, {
                                value: 21
                            }, {
                                value: 31
                            }];

                            for (var x = 0; x < 3; x++) {
                                stats[x].level = parseInt($("td.sub3:contains('Level'):eq(" + x + ")").text().replace(/[a-z]/gi, ''));
                                stats[x].current = parseInt($("tr.sub3 > td:contains(/):eq(" + x + ")").text().split(" / ")[0]);
                                stats[x].need = parseInt($("tr.sub3 > td:contains(/):eq(" + x + ")").text().split(" / ")[1]);
                            }


                            if (stats[1].level < 40) {
                                $("input[type=radio][value=" + stats[1].value + "]").click();
                            } else {
                                if (stats[0].level < stats[2].level) {
                                    $("input[type=radio][value=" + stats[0].value + "]").click();
                                } else {
                                    $("input[type=radio][value=" + stats[2].value + "]").click();
                                }
                            }

                            $("input[value='Work out!']").click();
                        } else {
                            console.log("Gym is ready, going to Gym.");
                            $("#timer-gym").click();
                        }
                        clearInterval(checker);
                        go = false;
                    } else {
                        console.log("Gym still waiting: " + $("#timer-gym").text());
                    }
                }

                if (notInJail) {
                    if (go) {
                        if (crimeReady) {
                            if (document.location.href.indexOf(crimeUrl) > -1) {
                                console.log("Crime is ready, clicking.");

                                crtCity = parseInt($('select[name=toCity]').val());
                                nextCity = (crtCity + 1).toString();

                                var nextCityCrime = true;
                                $.ajax({
                                    type: "POST",
                                    url: "crimes.php",
                                    data: {toCity: nextCity},
                                    async: false
                                }).done(function (data) {
                                    //console.log(data);
                                    nextCityCrime = $(data).find(":contains('do not have enough influence')").length === 0;
                                });

                                if (nextCityCrime && nextCity !== '9') {
                                    console.log('Next city has crimes, heading there');
                                    crtCity = parseInt($('select[name=toCity]').val());
                                    nextCity = (crtCity + 1).toString();
                                    $("select[name=toCity]").val(nextCity).change();
                                }
                                if (!nextCityCrime || nextCity === '9') {
                                    console.log("Next city doesn't have crimes, clicking on current city");
                                    $.ajax({
                                        type: "POST",
                                        url: "crimes.php",
                                        data: {toCity: crtCity},
                                    }).done(function (data) {
                                        clicked = false;
                                        $("table.cat > tbody > tr > td > div.insideTables > table > tbody > tr:contains('%')").each(function () {
                                            if (parseInt($(this).children("td:eq(4)").text()) >= 75 && !clicked) {
                                                console.log(parseInt($(this).children("td:eq(4)").text()));
                                                $(this).find("input[type=radio]").click();
                                                $("input[value='Commit!']").click();
                                                clicked = true;
                                            }
                                        });
                                        console.log(clicked);
                                        if (!clicked) {
                                            console.log('lul');
                                            $("input[type=radio]").last().click();
                                            $("input[value='Commit!']").click();
                                        }
                                    });
                                    clicked = false;

                                }

                            } else {
                                console.log("Crime is ready, going to Crime.");
                                $("#timer-cri").click();
                            }
                            clearInterval(checker);
                            go = false;
                        } else {
                            console.log("Crime still waiting: " + $("#timer-cri").text());
                        }
                    }

                    //*/
                    if (go) {
                        if (burgReady) {
                            if (document.location.href.indexOf(burgUrl) > -1) {
                                $(".insideTables tr:contains('crew')").remove();
                                console.log("Auto burglary is ready, clicking.");
                                var top = 0;
                                var topE = $("table.cat > tbody > tr > td div.insideTables > form > table > tbody > tr:contains('%'):eq(2)");
                                $("table.cat > tbody > tr > td div.insideTables > form > table > tbody > tr:contains('%')").each(function () {
                                    if (parseInt($(this).children().last().text().replace(/[a-z %]/gi, '')) > top) {
                                        top = parseInt($(this).children().last().text().replace(/[a-z %]/gi, ''));
                                        topE = $(this);
                                    }
                                });
                                //$("[name=steal_crew]").val("2");
                                topE.find("input[type=radio]").click();
                                $("input[value='Steal!']").click();
                            } else {
                                console.log("Auto burglary is ready, going to auto burglary.");
                                $("#timer-aut").click();
                            }
                            clearInterval(checker);
                            go = false;
                        } else {
                            console.log("Auto burglary still waiting: " + $("#timer-aut").text());
                        }
                    }//*/

                } else {
                    console.log("In jail: " + $("#timer-jai").text());
                }
            }
        }
    }
);
