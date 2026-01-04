// ==UserScript==
// @name         Stalk Arrival v3
// @namespace    Lordbusiness.SA
// @version      4.1
// @description  Attack players that are flying the moment they reach their destination ;)
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/369223/Stalk%20Arrival%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/369223/Stalk%20Arrival%20v3.meta.js
// ==/UserScript==

// SECONDS BETWEEN EACH REQUEST:
var seconds = 1.5;

/*
 * LIBRARIES - DO NOT EDIT ANYTHING BELOW THIS LINE
 */

GM_addStyle(`
#lbsoverlay {
    height: 100%;
    width: 100%;
    opacity: 0.8;
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: black;
}
`);


const showHTML = () => {
    localStorage.setItem("stalkingFlag", "0");
    if($('div.content-title').length == 1) {
        /* Credits to Mafia [610357] for this snippet of code from his excellent library, tornlib. */
        $('div.content-title').after(`
        <div id='scbox' class="m-top10">
            <div class="title-gray top-round" role="heading" aria-level="5">
            <i class="issue-attention-icon"></i>
            <span id="title">API Key required</span>
            </div>
            <div class="bottom-round cont-gray p10" id="msg">
                <fieldset class="submit-wrap">
                    <p>You are currently using <strong>${GM.info.script.name}</strong> that requires your API key. Please fill in your API key to use it.</p><br/>
                    <div class="cont-quantity left">
                        <div class="input-money-group"><span title="Fill with your correct API key" class="input-money-symbol">KEY</span><input id="quantity-price" class="quantity price input-money" type="text" value=""></div>
                    </div>
                    <div class="cont-button left" id="apiSignIn" style="margin-left: 10px;">
                        <span class="btn-wrap silver">
                            <span class="btn c-pointer bold" style="padding: 0 15px 0 10px;"><span>SIGN IN</span></span>
                        </span>
                    </div>
                    <div class="clear"></div>
                </fieldset>
            </div>
            <!--div class="clear"></div-->
            <hr class="page-head-delimiter m-top10">
        </div>`);
        $("div#scbox #apiSignIn").click(function() {
            let testAPIkey = $("div#scbox input").val();
            $.getJSON('https://api.torn.com/user/?selections=profile&key='+testAPIkey, function(data) {
               if(data.error != undefined) {
                   alert(data.error.error);
                   $("div#scbox .input-money-group").addClass("error");
               }
               else {
                   localStorage.stalkingFlag = testAPIkey;
                   $("div#scbox #msg").text("Hi " + data.name +", you have successfully signed in your API key. Thank you. This page will be refreshed in a moment.");
                   setTimeout(() => {
                       location.reload();
                   }, 3000);
               }
            });
        });
    }
};

if (localStorage.getItem("stalkingFlag") === null || localStorage.getItem("stalkingFlag") == "0") {
    showHTML();
}

const stalkingFlag = localStorage.stalkingFlag;

var hid = "visible";
var mseconds = seconds*1000;
var stalking = false;
const currenturl = location.href;
var stPlayerID, stPlayerdir, notyet, checkProfile, hflag = false, stInterval;

const initialize = (varname, varvalue = "none") => {
    if (localStorage.getItem(varname) === null) {
        localStorage.setItem(varname, varvalue);
    }
};

initialize("stPlayerID");
initialize("stPlayerName");
initialize("stPlayerdir", "In ");

const getResponseError = (data) => {
    try {
        var errorcode = data.error.code;
        if(errorcode == 1 || errorcode == 2 || errorcode == 12) {
            showHTML();
        }
        return true;
    } catch(exex) {
        clearInterval(stInterval);
        localStorage.stPlayerID = "none";
        return false;
    }
};

function myStfunc() {
    if(hid == "visible") {
        if(!stalking || hflag) {
            hflag = false;
            stPlayerID = localStorage.stPlayerID;
            stPlayerdir = localStorage.stPlayerdir;

            if(stPlayerID != "none") {
                stalking = (stPlayerdir == "In " || stPlayerdir == "Okay")?true:false;
            } else {
                stalking = false;
            }
        }
        if(stalking) {
            var playerUrl = "https://api.torn.com/user/"+ stPlayerID + "?selections=profile&key=" + stalkingFlag;
            if(!notyet) {
                notyet = true;
                $.getJSON(playerUrl).done(function(data) {
                    try {
                        var pStatus = data.status[0];
                        if(pStatus.startsWith(stPlayerdir)) {
                            localStorage.stPlayerID = "none";
                            console.log("Here2");
                            clearInterval(stInterval);
                            //location.href = "https://www.torn.com/loader.php?sid=attack&user2ID=" + stPlayerID;
                            $("body").append(`<div id='lbsoverlay'>Attack&nbsp;<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${stPlayerID}">${localStorage.stPlayerName}</a>.</div>`);
                            try {
                                var audio = new Audio('https://i.cloudup.com/E021I9zUG3.m4a');
                                audio.play();
                            } catch(ex) {
                                console.log(ex)
                            }
                        }
                        console.info(pStatus);
                    } catch(ex) {
                        getResponseError(data);
                    }
                }).fail(function() {
                    console.log("API request failed to go through. What's wrong?");
                }).always(function() {
                    notyet = false;
                });
            }
        }
    }
}

const checkParams = (currentStatus, shouldBe, willBe = "Okay") => {
    if(currentStatus.startsWith(shouldBe)) {
        localStorage.stPlayerdir = willBe;
        return true;
    }
    return false;
};

function yesProfile() {
    var currentUrl = new URL(currenturl);
    const profileID = String(currentUrl.searchParams.get("XID"));

    var Stext = "Stalk this player.";
    if(localStorage.stPlayerID == profileID) {
        Stext = "Stop stalking this player.";
    } else if(localStorage.stPlayerID != "none") {
        Stext = "You are current stalking " + localStorage.stPlayerName +". Stalk this player instead?";
        $(".facebook-iframe-wrap").hide();
    }
    if($(".like-this-player").length === 0) {
        $(".facebook-cont").html('<div class="like-this-player" style="line-height:'+ $(".facebook-cont").css("height") +';cursor:pointer;">'+ Stext +'</div>');
    } else {
        $(".like-this-player").text(Stext);
        $(".like-this-player").css("cursor", "pointer");
    }
    $(".like-this-player").one('click', function() {
        $(".like-this-player").css("cursor", "default");
        $(".like-this-player").text("Processing...");
        if(Stext == "Stop stalking this player.") {
            clearInterval(stInterval);
            localStorage.stPlayerID = "none";
            stalking = false;
            setTimeout(yesProfile, 2000);
        } else {
            var verdict, playerUrl = "https://api.torn.com/user/"+ profileID + "?selections=profile&key=" + stalkingFlag;
            $.getJSON(playerUrl).done(function(data) {
                try {
                    var pStatus = data.status[0];
                    if(checkParams(pStatus, "Traveling to ", "In") || checkParams(pStatus, "Returning to Torn") || checkParams(pStatus, "In hospital")) {
                        localStorage.stPlayerID = String(profileID);
                        localStorage.stPlayerName = data.name;
                        verdict = "Stalking commenced";
                        stalking = true;
                        hflag = true;
                    } else {
                        localStorage.stPlayerID = "none";
                        stalking = false;
                        verdict = "Failed. Not flying or in hospital?";
                    }
                } catch(ex) {
                    verdict = (getResponseError(data))?"Try again?":"Failed. API Error.";
                }
            }).fail(function() {
                verdict = "Failed. Slow Internet?";
            }).always(function() {
                $(".like-this-player").text(verdict);
                setTimeout(yesProfile, 2000);
            });
        }
    });
}


const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if(node.classList !== undefined && node.classList.contains('profile-container')) {
                yesProfile();
                return;
            }
        }
    }
});

if(stalkingFlag != "0") {
    stInterval = setInterval(myStfunc, mseconds);
    if(currenturl.startsWith("https://www.torn.com/profiles.php?XID=") && stalkingFlag != "0") {
        const wrapper = document.querySelector('.content-wrapper');
        observer.observe(wrapper, { subtree: true, childList: true });
    }


    (function() {
        var hidden = "hidden";

        if (hidden in document) {
            document.addEventListener("visibilitychange", onchange);
        } else if ((hidden = "mozHidden") in document) {
            document.addEventListener("mozvisibilitychange", onchange);
        } else if ((hidden = "webkitHidden") in document) {
            document.addEventListener("webkitvisibilitychange", onchange);
        } else if ((hidden = "msHidden") in document) {
            document.addEventListener("msvisibilitychange", onchange);
        } else if ('onfocusin' in document) {
            document.onfocusin = document.onfocusout = onchange;
        } else {
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
        }

        function onchange (evt) {
            var v = 'visible', h = 'hidden',
                evtMap = {
                    focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
                };

            evt = evt || window.event;
            if (evt.type in evtMap) {
                hid = evtMap[evt.type];
            } else {
                hid = this[hidden] ? "hidden" : "visible";
            }

            if(hid == "visible") {
                if(localStorage.stPlayerID != "none") {
                    stInterval = setInterval(myStfunc, mseconds);
                    hflag = true;
                }
            } else {
                clearInterval(stInterval);
            }
        }
    })();
}