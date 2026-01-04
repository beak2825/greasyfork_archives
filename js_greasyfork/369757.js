// ==UserScript==
// @name              iLearner auto-done
// @name:zh-TW        iLearner 自動做
// @description       It can do most of the types of iLearner exercises. Press F7 to open up the work panel.
// @description:zh-TW 可完成大部分iLearner練習。請按F7鍵開啓工作台。
// @namespace         AnsonUserscripts
// @version           3262
// @author            Anson and Modified By UD1954
// @match             http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?*
// @grant             GM_getValue
// @grant             GM_setValue
// @supportURL        ud1954@outlook.com
// @downloadURL https://update.greasyfork.org/scripts/369757/iLearner%20auto-done.user.js
// @updateURL https://update.greasyfork.org/scripts/369757/iLearner%20auto-done.meta.js
// ==/UserScript==

/*****************

 Test urls:
Pull down: http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=11626&seq=4&subpage=1&part=0&ic=1
Matching: http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=4062&seq=8&subpage=2&part=1&ic=4
Two Answer Choice: http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=4063&seq=4&subpage=1&part=0&ic=1
Check Table (the iLearner itself is very buggy): http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=12752&seq=4&subpage=1&part=&ic=2
Match Drag Drop (not working yet...): http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=12598&seq=8&subpage=2&part=1&ic=3
 TODOS:
Proofreading: http://reading.tanghin.edu.hk/htmlexercise/TangHin_exercise_page.php?page=4&aid=12002&seq=4&subpage=1&part=0&ic=1

*****************/

(function (exports, $, undefined) {

    if (!GM_getValue("config")) {
        GM_setValue("config", {});
    }

    var storageVersion = 1;

    var subpage = location.search.split("&subpage=")[1].split("&")[0];

    var iLearner = {};

    $.extend(iLearner, {
        FORMS: $("form"),
        VERSION: 23.1,
        SPEED: GM_getValue("config", {speed: 0}).speed,
        CONSOLE_PREFIX: "iLearner auto-done: ",
        PANEL: $("<aside style='position:fixed;bottom:0;right:0;background-color:white;padding:10px;border:1px solid;max-width:400px;'><h2>iLearner auto-done work panel</h2><p><small>Press F7 to hide/show this panel.</small></p></div>"),
    });

    iLearner.PANEL.appendTo("body");

    iLearner.log = function (text) {
        console.log(this.CONSOLE_PREFIX, text);
    };

    iLearner.error = function (error) {
        console.error(this.CONSOLE_PREFIX, error);
    };

    iLearner.message = function (msg) {
        $("<p>" + msg + "</p>").appendTo(this.PANEL).delay(3000).hide("slow", function () {this.remove();});
    };

    iLearner.report = function (err) {
        $("<iframe style='width:1px;height:1px;position:absolute;left:-9999px;'></iframe>").one("load", function () {this.remove();}).attr("src", "http://student.tanghin.edu.hk/~S151204/iLearner" + location.search + "&_err=" + err).appendTo(iLearner.PANEL);
        iLearner.message("This page is reported to the creator due to some error");
    };

    iLearner.config = function () {
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            GM_setValue(
                "config",
                $.extend(
                    GM_getValue("config", {}),
                    arguments[0]
                )
            );
        } else if (arguments.length === 1) {
            return GM_getValue("config")[arguments[0]];
        } else if (arguments.length === 2) {
            var temp = GM_getValue("config", {});
            temp[arguments[0]] = arguments[1];
            GM_setValue("config", temp);
        }
    };

    iLearner.setSpeed = function () {
        var speed;
        while (speed === null || isNaN(speed) || speed < 0) {
            speed = prompt("You can init this again with F4.\n\nAdvise:\nSet to 1500ms if you use school computer\nAt home, you may try 500ms or even 0ms.\nIf you use a pretty-good computer, you are advised to set to 1000ms.\n\nEnter the network speed: (just click OK if you don't know what to do)", iLearner.config("speed"));
        }
        speed = +speed;
        iLearner.config("speed", speed);
        iLearner.SPEED = speed;
    };

    iLearner.check = (function () {
        var checkAnswer = $("#submit_btn,.submit_btn,#check_ans>img").attr("onclick");
        if (subpage === "0" || subpage === "5") {
            return function () {
                iLearner.message("This is not a exercise page but the check program was launched.");
            };
        } else if (checkAnswer) {
            return checkAnswer;
        } else {
            return function () {
                iLearner.error("Submit button not found!!");
                iLearner.report("submit-btn-not-found");
            };
        }
    })();

    iLearner.timeout = (function () {
        var _queue = [],
            _timeout = function (time) {
                return function () {
                    if (iLearner.TIME === time) {
                        while (_queue.length !== 0) {
                            try {
                                _queue[0]();
                                _queue.shift();
                            } catch (e) {
                                iLearner.error(e);
                                _queue.shift();
                            }
                        }
                    }
                };
            };
        return function (callback) {
            _queue.push(callback);
            iLearner.TIME = new Date().getTime();
            setTimeout(_timeout(this.TIME), this.SPEED);
        };
    })();

    iLearner.togglePanel = (function () {
        var show = iLearner.config("panel");
        if (!show) {
            iLearner.PANEL.hide();
        }
        return function () {
            show = !show;
            console.log(show);
            iLearner.config("panel", show);
            if (show) {
                iLearner.PANEL.show();
            } else {
                iLearner.PANEL.hide();
            }
        };
    })();

    iLearner.main = (function () {
        var _queue = [],
            _cleanQueue = function (id) {
                _queue.splice(_queue.indexOf(id), 1);
                if (_queue.length === 0) {
                    iLearner.check();
                    $(window).scrollTop(0);
                }
            };
        return function () {
            if (subpage === "0" || subpage === "5") {
                iLearner.message("This is not a exercise page but the hack program was launched.");
                return;
            }
            iLearner.FORMS.each(function (index) {
                _queue.push(this.id);
                xajax_get_ticket();
                switch (this.id) {
                    case "frm_review":
                        break;
                    case "frm_ex_exercise_mc":
                    case "frm_ex_exercise_mc2":
                        this.checkers.value = "pass";
                        xajax_check_answer_mc(xajax.getFormValues(this.id));
                        iLearner.timeout($.proxy(function () {
                            this.checkers.value = "";
                            if ($(this).find("[style=color:red]").each(function () {
                                $("[for^=question" + $(this).closest("[id^=answer]").attr("id").substr(6) + "]").each((function (ans) {
                                    return function () {
                                        if (ans === this.innerText.replace(/[ \n]/g, "")) this.click();
                                    };
                                })(this.innerText.replace(/[ \n]/g, "")));
                            }).length === 0) iLearner.message("Answers can't be found.");
                            else xajax_check_answer_mc(xajax.getFormValues(this.id), 1);
                            _cleanQueue(this.id);
                        }, this));
                        break;
                    case "frm_ex_exercise_fillinblank2":
                    case "frm_ex_exercise_fillinblank":
                        $(this).find("[name^=question]").each(function () {
                            this.value = $("#ans_" + this.id).val().split("/")[0];
                        });
                        _cleanQueue(this.id);
                        break;
                    case "dictation":
                        xajax_check_dictation("", +location.search.split("&aid=")[1].split("&")[0], document.cookie.split("; reading_id=")[1]);
                        iLearner.timeout($.proxy(function () {
                            if ($(this).find("[id^=ans_]").each(function () {
                                $("#q_" + this.id.substr(4)).val($.trim(this.innerText));
                            }).length === 0) iLearner.message("Answers can't be found.");
                            else xajax_check_dictation(xajax.getFormValues(this.id), +location.search.split("&aid=")[1].split("&")[0], document.cookie.split("; reading_id=")[1]);
                            _cleanQueue(this.id);
                        }, this));
                        break;
                    case "frm_ex_exercise_pulldown":
                    case "frm_ex_exercise_pulldown2":
                        var combine = !!this.combine;
                        if (this.combine) {
                            this.combine.remove();
                        }
                        $("<input type='hidden' name='checkers' value='pass'>").appendTo(this);
                        xajax_check_answer_mc(xajax.getFormValues(this.id), undefined, 1);
                        iLearner.timeout($.proxy(function () {
                            if ($(this).find("[style=color:red]").each(function () {
                                $("#question" + $(this).closest("[id^=answer]").attr("id").substr(6)).val(this.innerText);
                            }).length === 0) iLearner.message("Answers can't be found");
                            else if (combine) $("<input type='hidden' name='combine' value='yes'>").appendTo(this);
                            _cleanQueue(this.id);
                        }, this));
                        break;
                    case "frm_ex_exercise_twoanswerchoice":
                        this.checkers.value = "pass";
                        xajax_check_answer_twoanswerchoice(xajax.getFormValues('frm_ex_exercise_twoanswerchoice'), 1);
                        iLearner.timeout($.proxy(function () {
                            if ($(this).find("[style=color:red]").each(function () {
                                $("[id^=question" + $(this).closest("[id^=answer]").attr("id").substr(6) + "]").each((function (ans) {
                                    return function () {
                                        if (ans === this.value) {
                                            this.click();
                                        }
                                    };
                                })(this.innerText));
                            }).length === 0) iLearner.message("Answers can't be found");
                            else xajax_check_answer_twoanswerchoice(xajax.getFormValues('frm_ex_exercise_twoanswerchoice'), 1);
                            _cleanQueue(this.id);
                        }, this));
                        break;
                    case "frm_ex_exercise_proofreading":
                        xajax_check_answer_proofreading(xajax.getFormValues('frm_ex_exercise_proofreading'));
                        iLearner.message("The developer is currently working on this page.");
                        break;
                    case "frm_ex_exercise_checktable":
                        this.checkers.value = "pass";
                        iLearner.message("The Check Table question type is already known but the exercise is very buggy, the developer will not develop on it in a short period of time.<br><font color='green'><b>Try navigating to the next page to see whether it is done!</b></font>");
                        break;
                    case "frm_ex_exercise_matchdragdrop":
                        iLearner.message("The Match Drag Drop question type is already known but the exercise is very buggy, the developer will not develop on it in a short period of time.<br><font color='green'><b>Try navigating to the next page to see whether it is done!</b></font>");
                        break;
                    default:
                        $("<iframe style='width:1px;height:1px;position:absolute;left:-9999px;'></iframe>").attr("src", "http://student.tanghin.edu.hk/~S151204/iLearner" + location.search + "&_err=form-id-not-identify:" + this.id).appendTo(iLearner.PANEL);
                        iLearner.message("There is a unknown ex type: " + this.id);
                        _cleanQueue(this.id);
                }
            });
            // if a matching div is detected, tell the server that the exercise is completed.
            if ($("#matchingdiv").length !== 0) {
                $.ajax({
                    type: "POST",
                    url: "save_matching_record_TangHin.php",
                    data: "qid="+qid+"&qs="+questions+"&as="+questions+"&this_ex_type="+this_ex_type+"&TangHin_aid="+TangHin_aid,
                    success: function (data) {
                        if (data === "under_50") {
                            iLearner.message("Matching submit failed");
                        } else {
                            $("#matchingdiv").text("Matching successfully done! :)");
                        }
                    }
                });
            }
        };
    })();

    var _iLearner = unsafeWindow.iLearner;

    iLearner.noConflict = function () {
        unsafeWindow.iLearner = _iLearner;
        return iLearner;
    };

    exports.iLearner = iLearner;

    if (GM_getValue("version") !== storageVersion) {
        if (GM_getValue("Not first time", false)) {
            // storage version 0
            iLearner.config("firstTime", false);
            iLearner.config("speed", GM_getValue("speed", 0));
            iLearner.config("panel", true);
            iLearner.SPEED = iLearner.config("speed");
            GM_setValue("Not first time");
            GM_setValue("speed");
            GM_setValue("version", storageVersion);
        } else {
            // not setup yet
            iLearner.setSpeed();
            iLearner.config("firstTime", false);
            iLearner.config("panel", true);
            GM_setValue("version", storageVersion);
        }
    }

    $("<button>Run Hack (F2)</button>").click(iLearner.main).appendTo(iLearner.PANEL);
    $("<button>Set Speed (F4)</button>").click(iLearner.setSpeed).appendTo(iLearner.PANEL);
    $("<button>Check Answer (ENTER)</button>").click(iLearner.check).appendTo(iLearner.PANEL);
    $("<button>If iLearner auto-done don't work on this page, press here to report to the creator</button>").click(function () {
        iLearner.report("human-report");
    }).appendTo(iLearner.PANEL);
    $("<a href='http://student.tanghin.edu.hk/~S151204/iLearner?view' target='_blank'>View all submitted urls in new tab</a>").appendTo(iLearner.PANEL);

    addEventListener("keydown", function (event) {
        switch (event.keyCode) {
            case 113:                       //113 refers F2
                iLearner.main();
                break;
            case 115:                       //115 refers F4
                iLearner.setSpeed();
                break;
            case 118:                       //118 refers F7
                iLearner.togglePanel();
                break;
            case 13:                        //13 refers ENTER
                iLearner.check();
                break;
        }
    });

    if (subpage !== "0" && subpage !== "5") {
        if (document.readyState !== "complete") {
            $(window).one("load", iLearner.main);
        } else {
            iLearner.main();
        }
    }
})(unsafeWindow, jQuery);