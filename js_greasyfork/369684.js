// ==UserScript==
// @name         Train your employees!
// @namespace    LordBusiness.TRAIN
// @version      2.2
// @description  Makes sure you stay benevolent and keep your employees trained ;)
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/preferences.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify.js/3.0.0/notify.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/369684/Train%20your%20employees%21.user.js
// @updateURL https://update.greasyfork.org/scripts/369684/Train%20your%20employees%21.meta.js
// ==/UserScript==

GM_addStyle("@keyframes trainFlash{0%,100%{color:#000}50%{color:#d83500}60%{color:#b3382c}}");
// Minute of each notification:
var minutes = [0, 15, 30, 45]; // 15 mins per notification

// Minimum number of trains to be present for the notification to appear:
var mintrains = 10;


var notifytimeOut = 7;
var refreshSecs = 20;
// DO NOT EDIT BELOW THIS POINT
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function aMinplzz() {
  await sleep(60000);
}

// :acp - A Class Prefix is a jQuery library for adding a class prefix selector.
$(function(){
    $.expr[":"].acp = function(elem, index, m){
          var regString = '\\b' + m[3];
          var reg = new RegExp(regString, "g");
          return elem.className.match(reg);
    }
});

(function ( $ ) {
$.fn.alterClass = function ( removals, additions ) {
	var self = this;
	if ( removals.indexOf( '*' ) === -1 ) {
		// Use native jQuery methods if there is no wildcard matching
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}

	var patt = new RegExp( '\\s' +
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) +
			'\\s', 'g' );

	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = $.trim( cn );
	});

	return !additions ? self : self.addClass( additions );
};

})( jQuery );

var APIkey = GM_getValue ("APIkey", "");

function getAPIKey() {
    $.ajax({
        url: "/preferences.php",
        xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function(name, value) {
                if (name == 'X-Requested-With') return;
                setRequestHeader.call(this, name, value);
            }
            return xhr;
        },

        success: function(data, textStatus, jqXHR) {
            var tornKey = String($("#newapi",data).val());
            GM_setValue ("APIkey", tornKey);
            APIkey = tornKey;
        }
    });
}

if ( ! APIkey) {
    getAPIKey();
}

function notifyNOW() {
    function onShowNotification () {
        console.log('notification is shown!');
    }

    function onCloseNotification () {
        console.log('notification is closed!');
    }

    function onClickNotification () {
        location.href = "https://www.torn.com/companies.php";
    }

    function onErrorNotification () {
        console.error('Error showing notification. You may need to request permission.');
    }

    function onPermissionGranted () {
        console.log('Permission has been granted by the user');
        doNotification();
    }

    function onPermissionDenied () {
        console.warn('Permission has been denied by the user');
    }

    function doNotification () {
        var myNotification = new Notify('Train employees!', {
            body: 'A wise master never leaves his employees untrained!',
            tag: 'Train emp id',
            notifyClick: onClickNotification,
            notifyError: onErrorNotification,
            timeout: notifytimeOut
        });

        myNotification.show();
    }

    if (!Notify.needsPermission) {
        doNotification();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }


}
var companyURL = "https://api.torn.com/company/?selections=detailed&key=" + APIkey;
var myURL = "https://api.torn.com/user/?selections=basic&key=" + APIkey;
function checkNow() {
    $.getJSON(myURL).done(function(data) {
        try {
            var pStatus = data.status[0];
            if(pStatus.startsWith("Okay")) {
                $.getJSON(companyURL).done(function(data) {
                    try {
                        var trains = data.company_detailed.trains_available;
                        console.info("Checked if trains are up. Trains available:", trains);
                        if(trains >= localStorage.mintrains) {
                            notifyNOW();
                        }
                    } catch(ex) {
                        console.log(ex);
                    }
                });
            }
        } catch(ex) {
            try {
                var errorcode = data.error.code;
                if(errorcode == 1 || errorcode == 2 || errorcode == 12) {
                    getAPIKey();
                }
                console.log(ex,errorcode,data.error.error);
            } catch(exex) {
                console.log(ex, exex);
            }
        }
    });
}

function recurringCheck() {
    var currentdate = new Date();
    var currentMin = currentdate.getMinutes();
    if($.inArray(currentMin, minutes) != -1) {
        checkNow();
        aMinplzz();
    }
}

var recurmsecs = refreshSecs * 1000;
var recur = setInterval(recurringCheck, recurmsecs);
var checkTrains;

function howManyTrains() {
    $.getJSON(companyURL).done(function(data) {
        try {
            var trains = data.company_detailed.trains_available;
            partrain.children(':acp("point-block")').last().children(':acp("value")').html(trains);
            localStorage.setItem("trains", String(trains));
            /*if(trains >= mintrains) {
                notifyNOW();
            }*/
        } catch(ex) {
            try {
                var errorcode = data.error.code;
                if(errorcode == 1 || errorcode == 2 || errorcode == 12) {
                    getAPIKey();
                }
                console.log(ex,errorcode,data.error.error);
            } catch(exex) {
                console.log(ex, exex);
            }
        }
    });
}
if($(':acp("content") > :acp("points")').length == 1) {
    var partrain = $(':acp("content") > :acp("points")');
    partrain.append(partrain.children(':acp("point-block")').first().clone());
    partrain.children(':acp("point-block")').last().children(':acp("name")').html("Trains:");
    if (localStorage.getItem("trains") === null) {
        localStorage.setItem("trains", "-");
        howManyTrains();
    } else {
        checkTrains = setTimeout(howManyTrains, 10000);
    }
    var currentTrains = localStorage.getItem("trains");
    partrain.children(':acp("point-block")').last().children(':acp("value")').html(currentTrains);
    partrain.children(':acp("point-block")').last().children(':acp("value")').alterClass("money*", "");
    if(currentTrains == "-") {
        currentTrains = "0";
    }
    if(parseInt(currentTrains) >= localStorage.mintrains) {
        partrain.children(':acp("point-block")').last().css("animation", "trainFlash 1.5s infinite");
    }
}


var hid = "visible";

(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            hid = evtMap[evt.type];
        else
            hid = this[hidden] ? "hidden" : "visible";

        if(hid == "visible") {
            recur = setInterval(recurringCheck, recurmsecs);
        }
        else {
            clearInterval(recur);
            clearTimeout(checkTrains);
        }
    }
})();

if(window.location.href == "https://www.torn.com/companies.php") {
    $('div.content-title').after(`
        <div id='scbox' class="m-top10">
            <div class="title-gray top-round" role="heading" aria-level="5">
            <i class="issue-attention-icon"></i>
            <span id="title">Minimum number of Trains to alert for</span>
            </div>
            <div class="bottom-round cont-gray p10" id="msg">
                <fieldset class="submit-wrap">
                    <div class="cont-quantity left">
                        <div class="input-money-group"><span id="dailyTrain" title="Fill with the trains you get daily." class="input-money-symbol">DAILY</span><input id="min-trains" class="quantity price input-money" type="text" value=""  placeholder="Enter minimum trains..."></div>
                    </div>
                    <div class="cont-button left" id="saveTrainCount" style="margin-left: 10px;">
                        <span class="btn-wrap silver">
                            <span class="btn c-pointer bold" style="padding: 0 15px 0 10px;"><span>SAVE</span></span>
                        </span>
                    </div>
                    <div id="tindr" class="t-green bold right" style="line-height: 26px; pointer-events: none">Saved</div>
                    <div class="clear"></div>
                </fieldset>
            </div>
            <!--div class="clear"></div-->
            <hr class="page-head-delimiter m-top10">
        </div>`);
    $("#tindr").hide();
    if (localStorage.getItem("mintrains") === null) {
        localStorage.setItem("mintrains", "10");
    }
    $("#min-trains").val(localStorage.mintrains);
    $("#dailyTrain").click(function() {
        $("#min-trains").val($(".company-rating").first().children("li.active").length);
    });
    $("#saveTrainCount").click(function() {
        localStorage.mintrains = String($("#min-trains").val());
        $("#tindr").fadeIn().delay(500).fadeOut();
    });
}