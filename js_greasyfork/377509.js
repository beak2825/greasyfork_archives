// ==UserScript==
// @name         Bootleggers R9.75 Master Script
// @namespace    Bootleggers
// @version      0.33
// @description  try to take over the world!
// @author       BD
// @include      https://www.bootleggers.us/*
// @update       https://greasyfork.org/scripts/377509-bootleggers-r9-75-master-script/code/Bootleggers%20R975%20Master%20Script.user.js
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://greasyfork.org/scripts/377563-jqueryresize/code/jQueryResize.js?version=669077
// @downloadURL https://update.greasyfork.org/scripts/377509/Bootleggers%20R975%20Master%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/377509/Bootleggers%20R975%20Master%20Script.meta.js
// ==/UserScript==

/*
/ajax/gift-box.php?action=delete-messages-gift

65.249.163.50:10000:alexandre4:alexandre4
65.249.163.67:10000:alexandre4:alexandre4
65.249.163.70:10000:alexandre4:alexandre4
65.249.163.75:10000:alexandre4:alexandre4
65.249.163.95:10000:alexandre4:alexandre4

65.249.168.85:10000:alexandre039:alexandre039
65.249.168.86:10000:alexandre039:alexandre039
65.249.168.87:10000:alexandre039:alexandre039
65.249.168.88:10000:alexandre039:alexandre039
65.249.168.89:10000:alexandre039:alexandre039

$("form").submit(function(e) {
	e.preventDefault();
	var options = $(this).serialize();
	$.post("/crimes.php", options, function(data) {
		if ($("#recovering")[0]) {
			$("#recovering").replaceWith($(data).find("#recovering"));
        } else {
			$(data).find("#recovering").insertBefore($(".insideTables").children("table"));
        }
$("tr:contains('Chance')").last().nextAll().each(function(i) {
	$(this).replaceWith($(data).find("tr:contains('Chance')").last().nextAll()[i]);
        })
    });
})
*/

var LoginName = "Tinnitus";
var LoginPass = "tinnitus1234";
var CheckMods = false;
var $ = window.jQuery;
var yourName = document.cookie.split("username[")[1].split("]")[0];
var curState = $($(window.top)[0].document).find("#1")[0] ? $($(window.top)[0].document).find("#1")[0].innerText : false;
var yourRank = $("#8 > a")[0] ? $("#8 > a").text() : false;
var travelReady = $("#timer-tra")[0] ? $("#timer-tra").data().seconds <= 0 : false;
var scriptCheck = $(".g-recaptcha")[0];
var inJail = $("td.header:contains('You are in jail!')")[0];
var HomeFrame = $($(window.top)[0].document).find('[background="//www.blimg.us/images/game/template/innerbg_85.png"]')[0] || $($(window.top)[0].document).find("#HomeFrame")[0];
var actionCountdownTimer;

if (LoginName == "" || LoginPass == "") {
    alert("Please set username and password in the script source");
} else {
if ((window.location.href == "https://www.bootleggers.us/") || (window.location.href.includes("logout"))) {
    $(document.head).append($("<script src='https://code.jquery.com/jquery-1.12.4.min.js'></script>"));
    if (CheckMods) {
        CheckForMods(false);
    }
}

if (window.location.href == "https://www.bootleggers.us/news.php?scripts=1") {
    document.title = yourName + " Scripts | Bootleggers";
    if (CheckMods) {
        CheckForMods(true);
    }
    SetupHomeFrame();
}

if ((window.top.location.href == "https://www.bootleggers.us/news.php?scripts=1") && (window.location.href != "https://www.bootleggers.us/news.php?scripts=1")) {
    if (!scriptCheck) {
        SetupSubFrames();
    } else {
        SolveScriptCheck();
    }
}

if ((window.top.location.href == "https://www.bootleggers.us/news.php?scripts=1") && (window.location.href == "https://www.bootleggers.us/crimes.php")) {
    if (!scriptCheck) {
        RunCrimesScript();
    }
}

if ((window.top.location.href == "https://www.bootleggers.us/news.php?scripts=1") && (window.location.href == "https://www.bootleggers.us/autoburglary.php")) {
    if (!scriptCheck) {
        RunAutoBurglaryScript();
    }
}

if ((window.top.location.href == "https://www.bootleggers.us/news.php?scripts=1") && (window.location.href == "https://www.bootleggers.us/rackets.php")) {
    if (!scriptCheck) {
        RunRacketsScript();
    }
}

if ((window.top.location.href == "https://www.bootleggers.us/news.php?scripts=1") && (window.location.href == "https://www.bootleggers.us/bootleg.php")) {
    if (!scriptCheck) {
        RunBootlegScript();
    }
}

if (window.location.href == "https://www.bootleggers.us/jail.php?checkJail=1") {
    CheckJailStatus();
}

if (window.location.href == "https://www.bootleggers.us/user/" + yourName + "?solveCaptcha=1") {
    if (!scriptCheck) {
        window.location.href = "/news.php?scripts=1";
    }
}

//ALL PAGES
(function AddScriptsButtonToBL() {
    $('[background="//www.blimg.us/images/game/template/heading/m.gif"]').append(
        '<div class="featureBox featureBoxScripts" style="padding:0 !important; margin-left:3px; float:right; position:absolute; right:260px"><div style="background-color: rgb(255,0,0); border-top-left-radius:2px; border-top-right-radius:2px;">Bootleggers Scripts</div><span style="font-size:14px">Ready for action!</span><br><span>Click to get started</span></div><style>.featureBoxScripts {background-color: rgba(255,0,0,0.3);border: 1px solid #e62323;}</style>'
    );
    $(".featureBoxScripts").click(function() {
        window.location.href = "/news.php?scripts=1";
    });
})();

function SetupHomeFrame() {
    $(HomeFrame).attr("id", "HomeFrame");
    $(HomeFrame).removeAttr("background");
    $(HomeFrame).css({ "position":"relative" });
    $(HomeFrame).children("table, br").remove();
    $(HomeFrame).children("div").hide();
    let extraHeight = $(window).height() - $("body").height();
    if (extraHeight > 0) {
        $(HomeFrame).css({
            "height":$(HomeFrame).css("height").match(/\d+/)*1 + extraHeight + "px"
        });
    }
    let frameWidth = $(HomeFrame).width() / 2 - 2;
    let frameHeight = ($(HomeFrame).height() - $(HomeFrame).children("div").height()) / 2 ;
    $(HomeFrame).resize(ResizeSubFrames);
    let crimesFrame = "  <iframe id='crimesFrame'   class='frame' src = '/crimes.php'            style='width:" + frameWidth + "px; height:" + frameHeight + "px; position:absolute; left:0%;   top:calc(0% + 15px);   border:1px white solid; overflow-x:hidden' />"
    let gtaFrame = "     <iframe id='gtaFrame'      class='frame' src = '/autoburglary.php'      style='width:" + frameWidth + "px; height:" + frameHeight + "px; position:absolute; left:50%;  top:calc(0% + 15px);   border:1px white solid; overflow-x:hidden' />";
    let racketsFrame = " <iframe id='racketsFrame'  class='frame' src = '/rackets.php'           style='width:" + frameWidth + "px; height:" + frameHeight + "px; position:absolute; left:0%;   top:calc(50% + 8.5px); border:1px white solid; overflow-x:hidden' />";
    let blTravelFrame = "<iframe id='blTravelFrame' class='frame' src = '/bootleg.php'           style='width:" + frameWidth + "px; height:" + frameHeight + "px; position:absolute; left:50%;  top:calc(50% + 8.5px); border:1px white solid; overflow-x:hidden' />";
    //let jailMailFrame = "<iframe id='jailMailFrame' class='frame' src = '/mailbox.php?scripts=1' style='width:" + frameWidth + "px; height:" + frameHeight + "px; position:absolute; left:0%;   top:calc(100% + 3px);  border:1px white solid; overflow-x:hidden' />";
    $(HomeFrame).append(crimesFrame, gtaFrame, racketsFrame, blTravelFrame);
    $(window).resize(ResizeSubFrames);
}

function SetupSubFrames() {
    $('[type="submit"]').on("click", function() {
        $(this).trigger("mouseout");
        console.log("Moused out");
    });
    let subMainFrame = $('[background="//www.blimg.us/images/game/template/innerbg_85.png"]')[0];
    $(subMainFrame).attr("id", "subMainFrame");
    $(subMainFrame).removeAttr("background");
    let action = window.location.href.split("bootleggers.us/")[1].split(".php")[0];
    action = action.replace(action.charAt(0), action.charAt(0).toUpperCase());
    let newTimer = $(subMainFrame).children("div").addClass("globalTimer")[0].outerHTML;
    if ($(HomeFrame).find(".globalTimer")[0]) {
        $(HomeFrame).find(".globalTimer").replaceWith(newTimer);
    } else {
        $(HomeFrame).prepend(newTimer);
    }
    $("*").not(":has('#subMainFrame'), #subMainFrame, #subMainFrame *").hide();
    $(subMainFrame).children("div").hide();
    $(subMainFrame).children("table").find("td").first().css({ "padding":"0" });
    $(subMainFrame).children("table").css({ "width":"auto" });



    $("body").css({
        "background-image":"url('https://www.blimg.us/images/game/template/innerbg_85.png')",
        "background-repeat":"repeat"
    });
    let frameWidth = $(HomeFrame).find(".frame").width();

    if ((inJail) && (action != "Mailbox")) {
        if ((frameWidth - 20)/$("#subMainFrame > table").width() < 1) {
            $("#subMainFrame > table").css({
                "transform":"scale(" + (frameWidth - 20)/$("#subMainFrame > table").width() + ")",
                "transform-origin": "0px 0px",
                "margin-left":"10px"
            });
        }
    } else if (action == "Mailbox") {
        $("#subMainFrame > table").css({
            "width": frameWidth - 20,
            "margin-left": "auto",
            "margin-right": "auto"
        });
        $("form > table").css({ "margin":"0" });
        $("form > table").find("td").css({
            "width":(frameWidth - 20)/2 + "px"
        });
    } else {
        if (action == "Crimes") {
            $(".insideTables > table, #timeBlock > table, form > table, .errorMsg").each(function() {
                $(this).css({
                    "width": frameWidth - 20,
                    "margin-left": "auto",
                    "margin-right": "auto",
                });
            });
        }
        if (action == "Autoburglary") {
            $(".insideTables > table, #timeBlock > table, form > table, .errorMsg").not('#autoShipTable, [name="shipCarFrm"] *').each(function() {
                $(this).css({
                    "width": frameWidth - 20,
                    "margin-left": "auto",
                    "margin-right": "auto",
                });
            });
        }
        if (action == "Rackets") {
            $("#subMainFrame > table").width(frameWidth - 20);
        }
        if (action == "Bootleg") {
            if ((frameWidth - 20)/$(".insideTables > table").width() < 1) {
                $(".insideTables > table").css({
                    "transform":"scale(" + (frameWidth - 20)/$(".insideTables > table").width() + ")",
                    "transform-origin":"0px 0px"
                });
            }
            $(".insideTables").css({
                "width": frameWidth - 20,
            });
        }
    }

    $("body").prepend("<div style='position:absolute; top:3px; left:10px; z-index:5;'><font width='130px'><b>" + action + " enabled?</b></font><input class='frameEnabled' type='checkbox' /></div><div style='position:absolute; top:3px; right:10px; z-index:5;'><font><b>" + (action != "Bootleg" ? action : "Travel") + " delay (secs): </b></font><input class='delayFrom' type='text' autocomplete='off' style='width:16px; text-align:center' /> to <input class='delayTo' type='text' autocomplete='off' style='width:" + (action != "Bootleg" ? 16 : 22) + "px; text-align:center' /></div>");

    let framesEnabled = localStorage.getItem("framesEnabled") ? localStorage.getItem("framesEnabled") : "Crimes=1&Autoburglary=1&Rackets=1&Bootleg=0";
    !localStorage.getItem("framesEnabled") ? localStorage.setItem("framesEnabled", framesEnabled) : false;
    framesEnabled.split(action + "=")[1].split("&")[0]*1 == 1 ? $(".frameEnabled")[0].checked = true : false;
    $(".frameEnabled").change(function() {
        ToggleFrameEnabled(this, action);
    });

    let delayTimes = localStorage.getItem("delayTimes") ? localStorage.getItem("delayTimes") : "Crimes=0:60&Autoburglary=0:60&Rackets=0:60&Bootleg=0:600";
    !localStorage.getItem("delayTimes") ? localStorage.setItem("delayTimes", delayTimes) : false;
    $(".delayFrom").val(delayTimes.split(action + "=")[1].split(":")[0]);
    $(".delayTo").val(delayTimes.split(action)[1].split(/=\d+:/)[1].split("&")[0]);
    $(".delayFrom, .delayTo").focusin(function() {
        $(this).val("");
    }).focusout(function() {
        if ($(this).hasClass("delayFrom")) {
            if ($(this).val() == "") {
                $(".delayFrom").val(localStorage.getItem("delayTimes").split(action + "=")[1].split(":")[0]);
            } else {
                localStorage.setItem("delayTimes", delayTimes.replace(delayTimes.split(action + "=")[1].split(":")[0], $(this).val()));
            }
        } else {
            if ($(this).val() == "") {
                $(".delayTo").val(localStorage.getItem("delayTimes").split(action)[1].split(/=\d+:/)[1].split("&")[0]);
            } else {
                localStorage.setItem("delayTimes", delayTimes.replace(delayTimes.split(action)[1].split(/=\d+:/)[1].split("&")[0], $(this).val()));
            }
        }
    }).keyup(function() {
        this.value = onlyNumbers(this);
    });

    $("body").css("background-repeat", "repeat");
}

function ResizeSubFrames() {
    let inJail = $("#timer-jai").text() != "Free";
    let extraHeight = $(window).height() - $("body").height();
    if (extraHeight > 0) {
        $(HomeFrame).css({
            "height":$(HomeFrame).css("height").match(/\d+/)*1 + extraHeight + "px"
        });
    }

    let frameWidth = $(HomeFrame).width() / 2 - 2;
    let frameHeight = ($(HomeFrame).height() - $(HomeFrame).children("div").height()) / 2 ;
    $(".frame").width(frameWidth);
    $(".frame").height(frameHeight);

    if ((frameWidth - 20)/$("#subMainFrame > table").width() < 1) {
                $("#subMainFrame > table").css({
                    "transform":"scale(" + (frameWidth - 20)/$("#subMainFrame > table").width() + ")",
                    "transform-origin": "0px 0px",
                    "margin-left":"10px"
                });
            } else {
        $("#crimesFrame").contents().find(".insideTables > table, #timeBlock > table, form > table, .errorMsg").each(function() {
            $(this).css({
                "width": frameWidth - 20,
                "margin-left": "auto",
                "margin-right": "auto",
            });
        });
        $("#gtaFrame").contents().find(".insideTables > table, #timeBlock > table, form > table, .errorMsg").not('#autoShipTable, [name="shipCarFrm"] *').each(function() {
            $(this).css({
                "width": frameWidth - 20,
                "margin-left": "auto",
                "margin-right": "auto",
            });
        });
        $("#racketsFrame").contents().find("#subMainFrame > table").width(frameWidth - 20);
        if ((frameWidth - 20)/$("#blTravelFrame").contents().find(".insideTables > table").width() < 1) {
            $("#blTravelFrame").contents().find(".insideTables > table").css({
                "transform":"scale(" + (frameWidth - 20)/$(".insideTables > table").width() + ")",
                "transform-origin":"0px 0px"
            });
        } else {
            $("#blTravelFrame").contents().find(".insideTables").css({
                "width": frameWidth - 20,
            });
        }
    }
}

function ToggleFrameEnabled(self, action) {
    if (!self.checked) {
            localStorage.setItem("framesEnabled", localStorage.getItem("framesEnabled").replace(action + "=1", action + "=0"));
    } else {
        localStorage.setItem("framesEnabled", localStorage.getItem("framesEnabled").replace(action + "=0", action + "=1"));
        if (action == "Crimes") {
            RunCrimesScript();
        } else if (action == "Autoburglary") {
            RunAutoBurglaryScript();
        } else if (action == "Rackets") {
            RunRacketsScript();
        } else if (action == "Bootleg") {
            RunBootlegScript();
        }
    }
}

function RunCrimesScript() {
    let enabled = $(".frameEnabled")[0].checked;
    let delayTimes = localStorage.getItem("delayTimes");
    let delay = [delayTimes.split("Crimes=")[1].split(":")[0], delayTimes.split(/Crimes=\d+:/)[1].split("&")[0]];
    let crimesMaxed = $("#timer-cri")[0].innerText == "Maxed";
    let inJail = $("#timer-jai")[0].innerText == "Free" ? 0 : $("#timer-jai")[0].dataset.seconds;
    let evading = $('[name="evade"]')[0];
    var crimeID = $("input:radio").length -1;
    var crimeCD = $("#timer-cri")[0].innerText == "Ready" ? 0 : $("#timer-cri")[0].dataset.seconds;
    var crimeCity = { "Scum":1, "Pee Wee":2, "Thug":3, "Gangster":4, "Hitman":5, "Assassin":6, "Boss":7 }
    crimeCity = typeof crimeCity[yourRank] === "undefined" ? 8 : crimeCity[yourRank];
    var commitCrimeTime = localStorage.getItem("commitCrimeTime") ? localStorage.getItem("commitCrimeTime") : false;
    let arrested = $("div:contains('You failed the crime and were arrested by police')")[0];

    $('[value="Commit!"]').click(function() {
        let d = new Date();
        localStorage.setItem("lastActionTime", d.getTime());
        localStorage.removeItem("commitCrimeTime");
    });

    function loadCrimes() {
        window.location.href = "/crimes.php";
    }

    if (evading) {
        $(evading).trigger("mousedown");
        $(evading).trigger("mouseup");
        evading.click();
    } else if (arrested) {
        loadCrimes();
    } else if (inJail) {
        window.top.location.href = "/jail.php?checkJail=1";
    } else if ((!enabled) || (crimesMaxed)) {
        //Do nothing
    } else if (crimeCD) {
        let d = new Date();
        delay = Math.round(Math.random() * (delay[1] - delay[0]) + delay[0]) * 1000;
        if (commitCrimeTime) {
            let curCityIndex = $('[name="toCity"]').val();
            if (($("input:radio").length == 8) && (curCityIndex < crimeCity)){
                //CheckCities(1);
                $('[name="toCity"]').val(crimeCity);
                $('[name="toCity"]').trigger("change");
            } else {
                setTimeout(RunCrimesScript, commitCrimeTime - d.getTime());
                console.log("Commiting next crime in city " + curCityIndex + " in: " + Math.round((commitCrimeTime - d.getTime())/1000));
            }
        } else {
            localStorage.setItem("commitCrimeTime", d.getTime() + (crimeCD * 1000) + delay);
            console.log("Added a " + delay/1000 + " second delay to commiting the next crime.");
            RunCrimesScript();
        }
    } else {
        CommitCrime();
    }

    function CommitCrime() {
        let d = new Date();
        let lastActionTime = localStorage.getItem("lastActionTime")*1;
        if (d.getTime() > lastActionTime + 5000) {
            /*localStorage.setItem("lastActionTime", d.getTime());
            localStorage.removeItem("commitCrimeTime");*/
            $($("input:radio")[crimeID]).trigger("mousedown");
            $($("input:radio")[crimeID]).trigger("mouseup");
            $("input:radio")[crimeID].click();
            $('[value="Commit!"]').trigger("mousedown");
            $('[value="Commit!"]').trigger("mouseup");
            $('[value="Commit!"]').click();
        } else {
            setTimeout(CommitCrime, lastActionTime + 5000 - d.getTime());
            console.log("Last action commited within 5 seconds ago, commiting crime in " + Math.round(((lastActionTime + 5000) - d.getTime())/1000) + " seconds");
        }
    }

    function CheckCities(i) {
        $.post("/crimes.php", "toCity=" + i, function(data) {
            if ($(data).find("input:radio").length < 8) {
                if ($(data).find("input:radio").length == 0) {
                    $.post("/crimes.php", "toCity=" + (i - 1), function() {
                        let d = new Date();
                        setTimeout(loadCrimes, commitCrimeTime - d.getTime());
                        console.log("Not enough influence for the next city. Commiting next crime in city " + (i - 1) + " in: " + Math.round((commitCrimeTime - d.getTime())/1000));
                    });
                } else {
                    if (i != $('[name="toCity"]').val()) {
                        $('[name="toCity"]').val(i);
                        $('[name="toCity"]').trigger("change");
                    } else {
                        setTimeout(RunCrimesScript, commitCrimeTime - d.getTime());
                        console.log("Commiting next crime in city " + i + " in: " + Math.round((commitCrimeTime - d.getTime())/1000));
                        //setTimeout(loadCrimes, crimeCD * 1000);
                        //console.log("Commiting next crime in city " + i + " in: " + crimeCD);
                    }
                }
            } else {
                if (i <= 7) {
                    CheckCities(i+1);
                }
            }
        });
    }
}

function RunAutoBurglaryScript() {
    let enabled = $(".frameEnabled")[0].checked;
    let delayTimes = localStorage.getItem("delayTimes");
    let delay = [delayTimes.split("Autoburglary=")[1].split(":")[0], delayTimes.split(/Autoburglary=\d+:/)[1].split("&")[0]];
    let curState = $("#1")[0].innerText;
    var commitID = 3;
    let inJail = $("td.header:contains('You are in jail!')")[0];
    var sub25Crimes = $("font:contains('not good enough')")[0];
    var recoveryTimer = $($("#timeBlock")[0]).find(".countdown")[0] ? $($("#timeBlock")[0]).find(".countdown")[0].innerText : 0;
    var gtaCD = FormatTime(recoveryTimer);
    var commitGTATime = localStorage.getItem("commitGTATime") ? localStorage.getItem("commitGTATime") : false;
    var successful = $("#carNum0")[0] ? $("#carNum0").closest("tr")[0].cells[4].innerText == $("#carNum0").closest("tr")[0].cells[5].innerText ? true : false : false;

    function loadGTA() {
        window.location.href = "/autoburglary.php"
    }

    if (!inJail) {
        SetupAutoShipCars();
        if (!enabled) {
        } else if (sub25Crimes) {
            setTimeout(loadGTA, 60000);
            console.log("Haven't completed 25 crimes yet, reloading GTA in: 60");
        } else if (successful) {
            ShipCar();
        } else if (gtaCD > 0) {
            let d = new Date();
            delay = Math.round(Math.random() * (delay[1] - delay[0]) + delay[0]) * 1000;
            if (commitGTATime) {
                setTimeout(RunAutoBurglaryScript, commitGTATime - d.getTime());
                console.log("Commiting next auto burglary in: " + Math.round((commitGTATime - d.getTime())/1000));
            } else {
                localStorage.setItem("commitGTATime", d.getTime() + (gtaCD * 1000) + delay);
                console.log("Added a " + delay/1000 + " second delay to commiting the next auto burglary.");
                RepairDueseys();
            }
        } else {
            StealCar();
        }
    } else {
        window.top.location.href = "/jail.php?checkJail=1";
    }

    function SetupAutoShipCars() {
        if (!$('[name="autoShipPrefs"]')[0]) {
            var autoShipPrefs = localStorage.getItem("autoShipPrefs") ? localStorage.getItem("autoShipPrefs") : localStorage.setItem("autoShipPrefs", "california=8&nevada=3&illinois=2&michigan=1&new-york=9&new-jersey=4");
            $('<br><form name="autoShipPrefs"><table id="autoShipTable" border="1" cellspacing="0" cellpadding="2" class="sub2 centered" bordercolor="black"><tbody><tr><td align="center" class="header" colspan="3">Auto-Ship Car</td></tr><tr><td><b>California:</b></td><td><select name="california"><option value="8" data-state="nevada">Nevada</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="4" data-state="new-york">New York</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>Nevada:</b></td><td><select name="nevada"><option value="3" data-state="california">California</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="4" data-state="new-york">New York</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>Illinois:</b></td><td><select name="illinois"><option value="2" data-state="michigan">Michigan</option><option value="0">---------------</option><option value="3" data-state="california">California</option><option value="4" data-state="new-york">New York</option><option value="8" data-state="nevada">Nevada</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>Michigan:</b></td><td><select name="michigan"><option value="1" data-state="illinois">Illinois</option><option value="0">---------------</option><option value="3" data-state="california">California</option><option value="4" data-state="new-york">New York</option><option value="8" data-state="nevada">Nevada</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>New York:</b></td><td><select name="new-york"><option value="9" data-state="new-jersey">New Jersey</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="3" data-state="california">California</option><option value="8" data-state="nevada">Nevada</option></select></td></tr><tr><td><b>New Jersey:</b></td><td><select name="new-jersey"><option value="4" data-state="new-york">New York</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="3" data-state="california">California</option><option value="8" data-state="nevada">Nevada</option></select></td></tr></tbody></table></form><br>').insertBefore($(".insideTables")[0].children[0]);
            $('[name="autoShipPrefs"]').find("select").change(function() {
                localStorage.setItem("autoShipPrefs", $('[name="autoShipPrefs"]').serialize());
            });
            if (autoShipPrefs) {
                var prefs = autoShipPrefs.split("&");
                $(prefs).each(function(i, val) {
                    $('[name="' + val.split("=")[0] + '"]')[0].value = val.split("=")[1];
                });
            }
        }
    }

    function ShipCar() {
        var sendStateID = localStorage.getItem("autoShipPrefs").split(curState.toLowerCase().replace(" ", "-") + "=")[1].split("&")[0];
        if ($("[name='carPlate[0]']").closest("tr").children()[5].textContent == curState) {
            $("[name='carPlate[0]']").trigger("mousedown");
            $("[name='carPlate[0]']").trigger("mouseup");
            $("[name='carPlate[0]']")[0].click();
            $('#goState [value="' + sendStateID + '"]')[0].selected = true;
            $("[name='shipcar']").trigger("mousedown");
            $("[name='shipcar']").trigger("mouseup");
            $("[name='shipcar']")[0].click();
        }
        /*let postOptions = $('[value="Ship!"]').closest("form").serialize();
        $.post("/autoburglary.php", postOptions, function(data) {
            $("#carNum0").closest("tr").replaceWith($(data).find("#carNum0").closest("tr"));
            $("td.header:contains('Stolen car')").closest("table").replaceWith("<center><b><font color='orange'>Car shipped to " + $("select [value=" + localStorage.getItem("autoShipPrefs").split(curState.toLowerCase().replace(" ", "-") + "=")[1].split("&")[0] + "]")[0].innerText + "!</font></b></center>");
            SetupSubFrames();
            RunAutoBurglaryScript();
        });*/
    }

    function StealCar() {
        let d = new Date();
        let lastActionTime = localStorage.getItem("lastActionTime")*1;
        if (d.getTime() > lastActionTime + 5000) {
            localStorage.setItem("lastActionTime", d.getTime());
            localStorage.removeItem("commitGTATime");
            $($("[type='radio']")[commitID]).trigger("mousedown");
            $($("[type='radio']")[commitID]).trigger("mouseup");
            $("[type='radio']")[commitID].click();
            $('[value="Steal!"]').trigger("mousedown");
            $('[value="Steal!"]').trigger("mouseup");
            $('[value="Steal!"]').click();
        } else {
            console.log("Last action commited within 5 seconds ago, attempting auto burglary in " + Math.round(((lastActionTime + 5000) - d.getTime())/1000) + " seconds");
            setTimeout(StealCar, lastActionTime + 5000 - d.getTime());
        }
    }

    function RepairDueseys() {
        var carCount = $(".selCar")[0] ? $(".selCar").length : 0;
        var repairCount = 0;
        var heatCount = 0;
        for (let i = 0; i <= carCount -1; i++) {
            var carName = $("#carNum" + i).closest("tr")[0].cells[2].innerText;
            var carDmg = $("#carNum" + i).closest("tr")[0].cells[3].innerText.match(/\d+/g)[0]*1 + "%";
            var carOrigin = $("#carNum" + i).closest("tr")[0].cells[4].innerText;
            var carLocation = $("#carNum" + i).closest("tr")[0].cells[5].innerText;
            if ((carName.includes("Duesenberg")) && (!carOrigin.includes(carLocation)) && (carLocation.includes(curState)) && (carDmg != "0%")) {
                repairCount++;
                $(".selCar").trigger("mousedown");
                $(".selCar").trigger("mouseup");
                $(".selCar")[i].click();
            }
        }
        if (repairCount > 0) {
            $("[value='Repair!']").trigger("mousedown");
            $("[value='Repair!']").trigger("mouseup");
            $("[value='Repair!']")[0].click();
        } else {
            for (let i = 0; i <= carCount -1; i++) {
                var carHeat = $("#carNum" + i).closest("tr")[0].cells[7].children[0].src.match(/\d+/g)[0]*1;
                if (carHeat > 0) {
                    heatCount++;
                    $($(".selCar")[i]).trigger("mousedown");
                    $($(".selCar")[i]).trigger("mouseup");
                    $(".selCar")[i].click();
                }
            }
            if (heatCount > 0) {
                $($("[value='Change plate!']")[0]).trigger("mousedown");
                $($("[value='Change plate!']")[0]).trigger("mouseup");
                $("[value='Change plate!']")[0].click();
            } else {
                RunAutoBurglaryScript();
            }
        }
    }
}

function RunRacketsScript() {
    let enabled = $(".frameEnabled")[0].checked;
    var lockedIndex = document.querySelector("[data-status='locked']") != null ? document.querySelector("[data-status='locked']").dataset.id -1 : false;
    let inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
    var racketsCD = [];
    $(".running").each(function(i) {
        if ($(".running")[i].innerText.match(/[0-9]/)) {
            racketsCD.push(FormatTime(this.innerText));
        }
    });
    var reloadTime = Math.min.apply(null, racketsCD) == "Infinity" ? 0 : Math.min.apply(null, racketsCD);
    var rank = $("#8 > a")[0].innerText;
    var runningCount = 0;

    function loadRackets() {
        window.location.href = "/rackets.php";
    }

    if (inJail) {
        CheckJailStatus();
    } else if ((!enabled) || (rank == "Scum")) {
        //Do nothing
    } else {
        for (let i = 0; i <= $(".crime").length -1; i++) {
            if ($(".idle")[i].clientHeight) {
                $($(".idle > input")[i]).trigger("mouseover");
                $(".idle > input")[i].click();
            } else if ($(".collectable")[i].clientHeight) {
                $($(".collectable > input")[i]).trigger("mouseover");
                $(".collectable > input")[i].click();
            } else if ($(".running")[i].clientHeight) {
                runningCount++;
            }
        }
        if ((runningCount == lockedIndex) || (runningCount == $(".crime").length)) {
            setTimeout(loadRackets, reloadTime * 1000);
            console.log("Reloading rackets in: " + reloadTime);
        } else {
            runningCount = 0;
            setTimeout(loadRackets, 3000);
        }
    }
}

function RunBootlegScript() {
    let enabled = $(".frameEnabled")[0].checked;
    var carryingBooze = $('[style="background-image:url(\'//www.blimg.us/images/game/template/bar_green.gif\'); width:100%;"]')[0] ? $('[style="background-image:url(\'//www.blimg.us/images/game/template/bar_green.gif\'); width:100%;"]').text().match(/\d+/)[0] : false;
    var boozePairs = {"Michigan Illinois":"Cognac", "Michigan California":"Gin", "Michigan New York":"Cognac", "Michigan Nevada":"Cognac", "Michigan New Jersey":"Vodka", "Illinois Michigan":"Wine", "Illinois California":"Gin", "Illinois New York":"Rum", "Illinois Nevada":"Rum", "Illinois New Jersey":"Rum", "California Michigan":"Tequila", "California Illinois":"Cognac", "California New York":"Cognac", "California Nevada":"Cognac", "California New Jersey":"Tequila", "New York Michigan":"Vodka", "New York Illinois":"Cognac", "New York California":"Vodka", "New York Nevada":"Cognac", "New York New Jersey":"Vodka", "Nevada Michigan":"Tequila", "Nevada Illinois":"Tequila", "Nevada California":"Gin", "Nevada New York":"Rum", "Nevada New Jersey":"Tequila", "New Jersey Michigan":"Wine", "New Jersey Illinois":"Cognac", "New Jersey California":"Cognac", "New Jersey New York":"Cognac", "New Jersey Nevada":"Cognac"};
    var buySuccess = $("div.centered:contains('You bought ')")[0];
    var negSuccess = $("div.centered:contains('You successfully ')")[0];
    var recoveryTimer = $("#timeleft")[0] ? $("#timeleft")[0].innerText : 0;
    var negCD = FormatTime(recoveryTimer);
    var negotiateBooze = localStorage.getItem("negotiateBooze") ? localStorage.getItem("negotiateBooze") : "lower=0&higher=0&flown=0";
    !localStorage.getItem("negotiateBooze") ? localStorage.setItem("negotiateBooze", negotiateBooze) : false;
    var lowered = negotiateBooze.split(/\D+/)[1];
    var raised = negotiateBooze.split(/\D+/)[2];
    var flown = negotiateBooze.split(/\D+/)[3];

    function loadBL() {
        window.location.href = "/bootleg.php"
    }

    if (!inJail) {
        SetupAutoTravelAndBuySellNow();
        if (!enabled) {
            //Do nothing
        } else if (travelReady) {
            if ((flown == 0) && (lowered < 2)) {
                BuyBooze();
            } else if ((flown == 0) && (lowered == 2)) {
                Travel();
            } else if (flown == 1) {
                SellBooze();
            }
        } else if (negSuccess) {
            let negDir = negSuccess.innerText.split("negotiated ")[1].split(" booze")[0];
            let negCurVal = negotiateBooze.split(negDir + "=")[1].split("&")[0] *1;
            localStorage.setItem("negotiateBooze", negotiateBooze.replace(negDir + "=" + negCurVal, negDir + "=" + (negCurVal +1)));
            if (localStorage.getItem("negotiateBooze") == "lower=2&higher=0&flown=0") {
                BuyBooze();
            }
            if (localStorage.getItem("negotiateBooze") == "lower=2&higher=2&flown=1") {
                SellBooze();
            }
        } else if ((negCD == 0) || (buySuccess)) {
            NegotiateBoozePrices();
        } else {
            setTimeout(loadBL, negCD * 1000);
            console.log("Reloading bootleg in: " + negCD);
        }
    } else {
        CheckJailStatus();
    }

    function NegotiateBoozePrices() {
        if (lowered < 2) {
            let d = new Date();
            let lastActionTime = localStorage.getItem("lastActionTime")*1;
            if (d.getTime() > lastActionTime + 5000) {
                localStorage.setItem("lastActionTime", d.getTime());
                $("#neg_l").trigger("mouseover");
                $("#neg_l").click();
                $('[value="Do it!"]').trigger("mouseover");
                $('[value="Do it!"]').click();
            } else {
                console.log("Waiting " + (lastActionTime + 5000 - d.getTime())/1000);
                setTimeout(NegotiateBoozePrices, lastActionTime + 5000 - d.getTime());
            }
        } else if (lowered == 2) {
            if (flown == 0) {
                if (travelReady) {
                    Travel();
                } else {
                    setTimeout(loadBL, $("#timer-tra").data().seconds * 1000);
                }
            } else {
                if (travelReady) {
                    SellBooze();
                } else {
                    let d = new Date();
                    let lastActionTime = localStorage.getItem("lastActionTime")*1;
                    if (d.getTime() > lastActionTime + 5000) {
                        localStorage.setItem("lastActionTime", d.getTime());
                        $("#neg_h").trigger("mouseover");
                        $("#neg_h").click();
                        $('[value="Do it!"]').trigger("mouseover");
                        $('[value="Do it!"]').click();
                    } else {
                        setTimeout(NegotiateBoozePrices, lastActionTime + 5000 - d.getTime());
                    }
                }
            }
        }
    }

    function BuyBooze() {
        var carryCapacity = $("td:contains('carry capacity')").last().text().match(/\d+/)[0];
        let nextState = $('[name=' + curState.toLowerCase().replace(" ", "-") + ']').children().first().text();
        var buyBooze = boozePairs[curState + " " + nextState];
        var boozePrice = $("b:contains(" + buyBooze + ")").siblings("span").text().match(/\d+/)[0] *1;
        var boozeID = {"Moonshine":1, "Beer":2, "Gin":3, "Whisky":4, "Rum":5, "Vodka":6, "Tequila":7, "Wine":8, "Cognac":9};
        var yourCash = $('[data-player-stat="cash"]').text().replace(/[$,]/g, "") *1;
        var buyAmt = (yourCash - 200)/boozePrice > carryCapacity ? carryCapacity : Math.floor((yourCash - 200)/boozePrice);
        let callback = function() {
            let d = new Date();
            let lastActionTime = localStorage.getItem("lastActionTime")*1;
            if (d.getTime() > lastActionTime + 5000) {
                localStorage.setItem("lastActionTime", d.getTime());
                localStorage.setItem("negotiateBooze", localStorage.getItem("negotiateBooze").replace(/lower=\d/, "lower=2"));
                $('[value="Complete transaction!"]').click();
            } else {
                setTimeout(callback, lastActionTime + 5000 - d.getTime());
            }
        }

        $('[name="purch[' + boozeID[buyBooze] + ']"]')[0].value = buyAmt;
        if (!$(".actionCountdown")[0]) {
            $(".insideTables").parent().prepend(ActionCountdown('Buying ' + buyAmt + ' ' + buyBooze + ' in: ', 5));
            StartActionCountdownTimer(callback);
        }
    }

    function SellBooze() {
        let callback = function() {
            let d = new Date();
            let lastActionTime = localStorage.getItem("lastActionTime")*1;
            if (d.getTime() > lastActionTime + 5000) {
                localStorage.setItem("lastActionTime", d.getTime());
                localStorage.setItem("negotiateBooze", "lower=0&higher=0&flown=0");
                $('[name="sellAll"]').trigger("mouseover");
                $('[name="sellAll"]').click();
                $('[value="Complete transaction!"]').trigger("mouseover");
                $('[value="Complete transaction!"]').click();
            } else {
                setTimeout(callback, lastActionTime + 5000 - d.getTime());
            }
        }
        if (!$(".actionCountdown")[0]) {
            $(".insideTables").parent().prepend(ActionCountdown('Selling all booze in: ', 5));
            StartActionCountdownTimer(callback);
        }
    }

    function Travel() {
        let curState = $("#1")[0].innerText;
        let nextState = $('[name=' + curState.toLowerCase().replace(" ", "-") + ']').children("option:selected");
        let postOptions = "travelto=" + nextState.val();
        let callback = function() {
            let d = new Date();
            let lastActionTime = localStorage.getItem("lastActionTime")*1;
            if (d.getTime() > lastActionTime + 5000) {
                $.post("/trainstation.php", postOptions, function(data) {
                    if ($(data).find("#1").text() == nextState.text()) {
                        localStorage.setItem("lastActionTime", d.getTime());
                        localStorage.setItem("negotiateBooze", "lower=2&higher=0&flown=1");
                        $(HomeFrame).closest("body").find("#1").text(nextState.text());
                        $(HomeFrame).closest("body").find("#2").find("img")[0].src = "//www.blimg.us/images/game/mini-maps/" + nextState.text().toLowerCase().replace(" ", "-") + "_dark.gif";
                    }
                    loadBL();
                });
            } else {
                setTimeout(callback, lastActionTime + 5000 - d.getTime());
            }
        }

        if (!$(".actionCountdown")[0]) {
            $(".insideTables").parent().prepend(ActionCountdown('Flying to ' + nextState.text() + ' in: ', 5));
            StartActionCountdownTimer(callback);
        }
    }

    function SetupAutoTravelAndBuySellNow() {
        if (!$('[name="autoTravelPrefs"]')[0]) {
            var autoTravelPrefs = localStorage.getItem("autoTravelPrefs") ? localStorage.getItem("autoTravelPrefs") : "california=9&nevada=3&illinois=4&michigan=8&new-york=2&new-jersey=1";
            !localStorage.getItem("autoTravelPrefs") ? localStorage.setItem("autoTravelPrefs", autoTravelPrefs) : false;
            $('<form name="autoTravelPrefs"><table id="autoTravelTable" border="1" cellspacing="0" cellpadding="2" class="sub2 centered" bordercolor="black"><tbody><tr><td align="center" class="header" colspan="3">Auto-Travel</td></tr><tr><td><b>California:</b></td><td><select name="california"><option value="9" data-state="new-jersey">New Jersey</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="4" data-state="new-york">New York</option><option value="8" data-state="nevada">Nevada</option></select></td></tr><tr><td><b>Nevada:</b></td><td><select name="nevada"><option value="3" data-state="california">California</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="2" data-state="michigan">Michigan</option><option value="4" data-state="new-york">New York</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>Illinois:</b></td><td><select name="illinois"><option value="4" data-state="new-york">New York</option><option value="0">---------------</option><option value="3" data-state="california">California</option><option value="2" data-state="michigan">Michigan</option><option value="8" data-state="nevada">Nevada</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>Michigan:</b></td><td><select name="michigan"><option value="8" data-state="nevada">Nevada</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="3" data-state="california">California</option><option value="4" data-state="new-york">New York</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>New York:</b></td><td><select name="new-york"><option value="2" data-state="michigan">Michigan</option><option value="0">---------------</option><option value="1" data-state="illinois">Illinois</option><option value="3" data-state="california">California</option><option value="8" data-state="nevada">Nevada</option><option value="9" data-state="new-jersey">New Jersey</option></select></td></tr><tr><td><b>New Jersey:</b></td><td><select name="new-jersey"><option value="1" data-state="illinois">Illinois</option><option value="0">---------------</option><option value="2" data-state="michigan">Michigan</option><option value="3" data-state="california">California</option><option value="4" data-state="new-york">New York</option><option value="8" data-state="nevada">Nevada</option></select></td></tr></tbody></table></form><br>').insertBefore($(".insideTables")[0].children[0]);
            $('[name="autoTravelPrefs"]').find("select").change(function() {
                localStorage.setItem("autoTravelPrefs", $('[name="autoTravelPrefs"]').serialize());
            });
            if (autoTravelPrefs) {
                var prefs = autoTravelPrefs.split("&");
                $(prefs).each(function(i, val) {
                    $('[name="' + val.split("=")[0] + '"]')[0].value = val.split("=")[1];
                });
            }
        }
        if (!$(".buySellNow")[0]) {
            var buySellNow = "<br><center><input class='buySellNow' name='buy' type='button' value='Buy Booze Now!' /><input class='buySellNow' name='sell' type='button' value='Sell Booze Now!' /></center>"
            $(buySellNow).insertBefore($(".insideTables")[0].children[1]);
            $('[name="buy"]').click(function() {
                localStorage.setItem("negotiateBooze", localStorage.getItem("negotiateBooze").replace(/flown=\d/, "flown=1"));
                BuyBooze();
            });
            $('[name="sell"]').click(SellBooze);
        }
    }
}

function ActionCountdown(str, count) {
    return '<div class="centered" style="background-color: rgb(200, 107, 38); border: 1px solid rgb(255, 107, 0); text-align: center; padding: 5px;">' + str + '<span class="actionCountdown">' + count + '</span></div><br><center><input id="cancelAction" type="button" style="margin:auto" value="Cancel!" /></center>';
}

function StartActionCountdownTimer(func) {
    actionCountdownTimer = setInterval(function() {
        let count = $(".actionCountdown").text() *1;
        $(".actionCountdown").text(count - 1);
        if (count - 1 == 0) {
            if ($(".frameEnabled")[0].checked) {
                func();
            }
            ClearCountdown();
        }
    }, 1000);

    $("#cancelAction").click(function() {
        ClearCountdown();
    });

    function ClearCountdown() {
        $(".actionCountdown").parent().siblings("br, center").remove();
        $(".actionCountdown").parent().remove();
        clearInterval(actionCountdownTimer);
    }
}

function CheckJailStatus() {
    let delay = Math.round(Math.random() * 10);
    let inJail = $("a:contains(" + yourName + ")")[0];
    if (inJail) {
        setTimeout(function() {
            window.location.href = window.location.href;
        }, delay * 1000);
    } else {
        window.location.href = "/news.php?scripts=1";
    }
    /*let arrested = $("div:contains('You failed the crime and were arrested by police')")[0];
    let delay = Math.round(Math.random() * 10);
    inJail = $("#timer-jai")[0].innerText == "Free" ? 0 : $("#timer-jai")[0].dataset.seconds;
    $.get("/jail.php", function(data) {
        if (!data.includes("jailRow" + yourName)) {
            window.location.href = "/news.php?scripts=1";
        } else {
            if ((arrested) && (!$("#jailCD")[0])) {
                if (!$("#jailStatus")[0]) {
                    $(arrested).parent().append("<center id='jailStatus'><b><font color='red'>*Master Script* Checking if you're in jail in: <span id='jailCD'>" + delay + "</span></font></b></center>");
                }
            } else if (inJail) {
                if (!$("#jailStatus")[0]) {
                    $("<center id='jailStatus'><b><font color='red'>*Master Script* Checking if you're still in jail in: <span id='jailCD'>" + delay + "</span></font></b></center>").insertBefore($("center > .insideTables"));
                }
            } else if (!inJail) {
                window.location.href = "/news.php?scripts=1";
            }
            var reloadTimer = setInterval(function() {
                if ($("#jailCD")[0].innerText == "0") {
                    clearInterval(reloadTimer);
                    $("#jailStatus").remove();
                    CheckJailStatus();
                } else {
                    $("#jailCD")[0].innerText = $("#jailCD")[0].innerText*1 - 1;
                }
            }, 1000);
        }
    });*/
}

function FormatTime(time) {
    if ((time == 0) || (time == "Time has Expired!")) {
        return 0;
    } else if (time.toString().includes(":")) {
        return time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    } else {
        var hrs = Math.floor(time/3600) >= 10 ? Math.floor(time/3600) : "0" + Math.floor(time/3600);
        var mins = (time - Math.floor(time/3600)*3600)/60 >= 10 ? Math.floor((time - Math.floor(time/3600)*3600)/60) : "0" + Math.floor((time - Math.floor(time/3600)*3600)/60);
        var secs = time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60 >= 10 ? Math.floor(time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60) : "0" + Math.floor(time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60);
        return hrs + ":" + mins + ":" + secs;
    }
}

function onlyNumbers(src){
    return src.value.replace(/[^0-9]/g, '');
}

function SolveScriptCheck() {
    window.top.location.href = "https://www.bootleggers.us/user/" + yourName + "?solveCaptcha=1";
}

function CheckForMods(loggedIn) {
    var modOnline = 0;
    if (loggedIn) {
        $.get("/usersonline.php", function(data) {
            $(data).find("#usersOnline > a").each(function() {
                if ($(this).text() == "FlameS" || $(this).text() == "Riot") {
                    modOnline = 1;
                }
            });

            if (modOnline == 0) {
                console.log("There are no mods online, checking again in 10secs.");
            } else {
                console.log("There is a mod online, logging out.");
                window.location.href = $("a:contains('LOGOUT')")[0].href;
            }

            $.post("https://storebldata.000webhostapp.com/modstatus.php", "online=" + modOnline);

            setTimeout(function() {
                CheckForMods(true);
            }, 10000);
        });
    } else {
        $.get("https://storebldata.000webhostapp.com/modstatus.php", function(data) {
            if (data) {
                modOnline = data.split("Mod online: ")[1] ? data.split("Mod online: ")[1].split("<div")[0] == "TRUE" ? true : false : false;
                if (!modOnline) {
                    console.log("There are no mods online, logging in.");
                    $.post("/checkuser.php", "username=" + LoginName + "&password=" + LoginPass, function() {
                        window.location.href = "https://www.bootleggers.us/news.php?scripts=1";
                    });
                } else {
                    console.log("There is a mod online, checking again in 60secs.");
                    setTimeout(function() {
                        CheckForMods(false);
                    }, 60000);
                }
            } else {
                console.log("There was an error checking for mods, trying again in 60secs");
                setTimeout(function() {
                    CheckForMods(false);
                }, 60000);
            }
        }).fail(function(e) {
            console.log("There was an error speaking with the server, trying again in 60secs");
            setTimeout(function() {
                CheckForMods(false);
            }, 60000);
        });
    }
}

/*
var postOptions = $("form").serialize();
$.post("/crimes.php", postOptions, function(data) {
	$("head")[0].outerHTML = "<head>" + data.split("<head>")[1].split("</head>")[0] + "</head>";
	$("body")[0].outerHTML = "<body " + data.split("<body ")[1].split("</body>")[0] + "</body>";
	$("body")[1].remove();
});
*/
//'<div id="dhtmltooltip"></div>' + $("body")[0].outerHTML.split('<div id="dhtmltooltip"></div>')[1].split("<br>")[0];
//'<div id="dhtmltooltip"></div>' + data.split('<div id="dhtmltooltip"></div>')[1].split("<br>")[0];

/*
var postOptions = $("form").serialize();
$.post("/crimes.php", postOptions, function(data) {
	$("body")[0].outerHTML = $("body")[0].outerHTML.replace('<div id="dhtmltooltip"></div>' + $("body")[0].outerHTML.split('<div id="dhtmltooltip"></div>')[1].split("<br>")[0], '<div id="dhtmltooltip"></div>' + data.split('<div id="dhtmltooltip"></div>')[1].split("<br>")[0]);
$("table").first().replaceWith($(data).find('[background="//www.blimg.us/images/game/template/innerbg_85.png"]'));
$("head")[1].remove();
});
*/
}