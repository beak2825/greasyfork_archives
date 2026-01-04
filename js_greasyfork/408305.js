// ==UserScript==
// @name            Jeff Basil Mods
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         4
// @description     Tweaking internal team site
// @author          Dan Overlander
// @include         https://jeffbasil.com/standup
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=836747
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408305/Jeff%20Basil%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/408305/Jeff%20Basil%20Mods.meta.js
// ==/UserScript==

// Since v03: Background size: cover.  Adapting to HTML changes.
// Since v02: Updated Tamperlibrary. Switch to YouTube; Dailymotion sometimes has terrible vid recommendations. moved totalCount position. Added Ctrl-Alt-P for "Parking lot" animation shortcut.
// Since v01: Updated library url.  Added video background.  Added ability to remove / substract names from list (if added, then injected randomly).  Shows list count for a few seconds at startup.
// Since v00: initial script following aria assistant template

(function() {
    'use strict';

    var global =
        {
            constants: {
                TIMEOUT: 750,
                initalizeOnElements: ['#p1']
            },
            ids: {
                scriptName: 'JeffBasil',
                prefsName: 'JeffBasilPrefs',
                memsName: 'JeffBasilMems'
            },
            states: {
                isMouseMoved: false,
                areButtonsAdded: false,
                areKeysAdded: false,
                areClassesAdded: false
            },
            prefs: {},
            mems: {}
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.addClasses();
                    page.addClasses();
                    page.addVideo();
                    page.makeNamesButtons();
                    page.addKeys();
                }, global.constants.TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null) global.prefs.debugMode = false;
                        if (global.prefs.peopleRemove == null) global.prefs.peopleRemove = [];
                        if (global.prefs.peopleAdd == null) global.prefs.peopleAdd = [];
                        if (global.prefs.video == null) global.prefs.video = 'eKFTSSKCzWA';
                    };
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {};
                    setDefaultPrefs();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                    setDefaultPrefs();
                    for (var key in global.prefs) {
                        try {
                            if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                                global.prefs[key] = (global.prefs[key] == 'true')
                            } else {
                                global.prefs[key] = JSON.parse(global.prefs[key]);
                            }
                        } catch (e) {
                            global.prefs[key] = global.prefs[key];
                        }
                    }
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    // global.mems.ariaMuteElements = [];
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                var fontSize = '1rem;';
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;
                    tm.addGlobalStyle('body {color: white; font-family: sans-serif; font-size: ' + fontSize + ' padding-top: 20%; text-shadow: 5px 5px 5px #000;}');
                    tm.addGlobalStyle('html { background-color: #d8ffd6; background-size:cover; background-image: url("https://www.almanac.com/sites/default/files/image_nodes/basil-leaves-herb.jpg"); }');
                    tm.addGlobalStyle(".activated {color:gray;}");
                    tm.addGlobalStyle(".fingery {margin:0;}");
                    tm.addGlobalStyle("#bkVideo { position: absolute; z-index:0; right: 0; bottom: 0; }");
                    tm.addGlobalStyle("#p1 { position:absolute; z-index:2; margin:0 !important; }");
                    tm.addGlobalStyle('#p2 { display: none; }');
                    tm.addGlobalStyle('#totalCount { position:absolute; font-size: ' + fontSize + ' font-weight:bold; top:50px; left:200px; }');
                    tm.addGlobalStyle('#coverVideo { width:100%; height:100%; background:rgb(0,0,0,0); position:absolute; top:0; left:0; z-index: 1; }');
                    document.querySelectorAll('h1')[0].style.display = 'none';
                    document.querySelectorAll('h1')[2].style.display = 'none';
                }
            },
            addKeys: function () {
                if (!global.states.areKeysAdded) {
                    global.states.areKeysAdded = true;

                    $(document).unbind('keyup');
                    $(document).keyup(function(e) {
//                         if (e.keyCode == 70 && e.ctrlKey && e.altKey) { utils.keys.muteElement(); } // Ctrl-Alt-F
//                         if (e.keyCode == 71 && e.ctrlKey && e.altKey) { utils.keys.muteElement('parent'); } // Ctrl-Alt-G
//                         if (e.keyCode == 35 && e.ctrlKey && e.altKey) { utils.keys.muteElement('hide'); } // Ctrl-Alt-End
//                         if (e.keyCode == 74 && e.ctrlKey && e.altKey) { utils.keys.manageMutes(); } // Ctrl-Alt-J
//                         if (e.keyCode == 85 && e.ctrlKey && e.altKey) { utils.keys.manageMutes('hide'); } // Ctrl-Alt-U
//                         if (e.keyCode == 38 && e.ctrlKey && e.altKey) { utils.keys.selectParent(); } // Ctrl-Alt-Up
//                         if (e.keyCode == 40 && e.ctrlKey && e.altKey) { utils.keys.selectChild(); } // Ctrl-Alt-Down
//                         if (e.keyCode == 37 && e.ctrlKey && e.altKey) { utils.keys.selectPrevSibling(); } // Ctrl-Alt-Left
//                         if (e.keyCode == 39 && e.ctrlKey && e.altKey) { utils.keys.selectNextSibling(); } // Ctrl-Alt-Right
//                         if (e.keyCode == 36 && e.ctrlKey && e.altKey) {
//                             global.states.selectElementMode = !global.states.selectElementMode;
//                             utils.announce('HIDE mode: ' + global.states.selectElementMode);
//                         } // Ctrl-Alt-Home
                        if (e.keyCode == 80 && e.ctrlKey && e.altKey) { utils.keys.showParkingLot(); } // Ctrl-Alt-P
                    });
                }
            },
            addVideo: function() {
                if (!document.getElementById('bkVideo') && global.prefs.video != '') {
                    $('body').append('<div id="bkVideo"><iframe id="bkVideoEmbed" src="https://www.youtube.com/embed/' + global.prefs.video + '?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
                    function fitvid () {
                        $('#bkVideo').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
                        $('#bkVideoEmbed').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
                    }
                    $(window).resize(function(){
                        fitvid();
                    });
                    fitvid();
                    $('#p1').after('<div id="coverVideo"></div>');
                }
            },
            makeNamesButtons: function() {
                if (global.states.areButtonsAdded) {
                    return;
                }
                global.states.areButtonsAdded = true;
                var names = document.getElementById('p1').textContent.split(', ');
                var newNames = '',
                    nameLinks,
                    toggleName = function(me) {
                        var linky = me.target;
                        if (linky.classList.contains('activated')) {
                            linky.classList.remove('activated');
                        } else {
                            linky.classList.add('activated');
                        }
                        $('#totalCount').text(names.length - $('.activated').length);
                    },
                    removeName = function(name) {
                        var index = names.indexOf(name);
                        names.splice(index, 1)
                        return names;
                    };
                _.each(global.prefs.peopleRemove, (removeThis) => {
                    removeName(removeThis);
                });
                while (global.prefs.peopleAdd.length) {
                    names.splice(Math.floor(Math.random() * (names.length + 1)), 0, global.prefs.peopleAdd.pop());
                }
                _.each(names, (name) => {
                    var filtName = name.replace(/( |\.)+/g, '');
                    newNames += '<a class="fingery nameLinky" id="' + filtName + '">' + filtName + '</a>, ';
                });
                newNames = newNames.substr(0, newNames.length-2) + '.';
                document.getElementById('p1').innerHTML = newNames;
                nameLinks = document.getElementById('p1').querySelectorAll('a');
                _.each(nameLinks, (nameLink) => {
                    nameLink.addEventListener('click', toggleName);
                });
                $('body').append('<div id="totalCount">' + names.length + '</div>');
//                 setTimeout(function() {
//                     $('#totalCount').hide();
//                 }, 3000);
            }
        },
        utils = {
            initScript: function () {
                _.each(global.constants.initalizeOnElements, (trigger) => {
                    tm.getContainer({
                        'el': trigger,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        page.initialize();
                    });
                });
            },
            getUrl: function() {
                var pathArray = document.URL.split( '/' );
                var protocol = pathArray[0];
                var host = pathArray[2];
                var url = protocol + '//' + host;
                return url;
            },
            addEvent: function(el, ev, func) {
                if (el.addEventListener) {
                    el.addEventListener(ev, func, false);
                } else if (el.attachEvent) {
                    el.attachEvent("on" + ev, func);
                } else {
                    el["on"+ev] = func; // Note that this line does not stack events. You must write you own stacker if you don't want overwrite the last event added of the same type. Btw, if you are going to have only one function for each event this is perfectly fine.
                }
            },
            rnd: () => {
                return Math.floor(Math.random() * 999999999) + 1;
            },
            flickerElement: ($el) => {
                setTimeout(() => {
                    if ($el != null) {
                        $el.addClass('iClicked');
                        setTimeout(() => {
                            $el.removeClass('iClicked');
                        }, 150);
                    }
                }, 150);
            },
            announce: function (theMessage) {
                if (global.prefs.debugMode) tm.log(theMessage);
                var randomNum = utils.rnd();
                $('body').prepend('<span style="position:absolute; left:-1000px; width:0;" role="alert" id="ariaRemoved' + randomNum + '">' + theMessage + '</span>');
                $.growl.notice({
                    message: theMessage,
                    size: 'medium'
                });
                window.setTimeout(() => {
                    $('#ariaRemoved' + randomNum).remove();
                }, 5000);
            },
            keys: {
                showParkingLot: function () {
                    if (global.states.parkingLotAdded) {
                        return;
                    }
                    global.states.parkingLotAdded = true;
                    tm.addGlobalStyle(`
body{
	margin:0;
	color:#444;
	background:#00c380;
	font:300 18px/18px Roboto, sans-serif;
}
*,:after,:before{box-sizing:border-box}
.pull-left{float:left}
.pull-right{float:right}
.clearfix:after,.clearfix:before{content:'';display:table}
.clearfix:after{clear:both;display:block}

body{text-align:center;padding:80px;overflow:hidden}

.car .mirror-wrap:before,
.car .mirror-wrap:after,
.car .mirror-inner:before,
.car .mirror-inner:after,
.car .middle .top:before,
.car .middle .top:after,
.car .lights:before,
.car .lights:after,
.car .bumper .top:before,
.car .bumper .top:after,
.car .bumper .middle:before,
.car .tyres .tyre:before,
.car .tyres .tyre:after
{
	content:'';
	position:absolute;
}
.car{
	z-index:1;
	margin:0 auto;
	position:relative;
	display:inline-block;
}
.car .body{
	z-index:1;
	position:relative;
	animation:suspension 4s linear infinite;
}
.car .mirror-wrap{
	width:88px;
	height:30px;
	margin:auto;
	position:relative;
	background-color:#fff;
	border-top-left-radius:45px 10px;
	border-top-right-radius:45px 10px;
}
.car .mirror-wrap:before,
.car .mirror-wrap:after{
	top:8px;
	border:5px solid #1a1c20;
	border-top:15px solid transparent;
}
.car .mirror-wrap:before{
	left:-5px;
	border-left:0 solid transparent;
}
.car .mirror-wrap:after{
	right:-5px;
	border-right:0 solid transparent;
}
.car .mirror-inner{
	top:2px;
	width:inherit;
	height:inherit;
	margin:inherit;
	position:inherit;
	background-color:#1a1c20;
	border-top-left-radius:50px 8px;
	border-top-right-radius:50px 8px;
}
.car .mirror-inner:before,
.car .mirror-inner:after{
	bottom:0;
	width:10px;
	height:8px;
	background-color:#252525;
}
.car .mirror-inner:before{
	left:-12px;
	border-radius:2px 0 0 5px;
}
.car .mirror-inner:after{
	right:-12px;
	border-radius:0 2px 5px 0;
}
.car .mirror{
	width:100%;
	z-index:10;
	height:25px;;
	overflow:hidden;
	position:relative;
	border-top-left-radius:45px 10px;
	border-top-right-radius:45px 10px;
}
.car .mirror .shine{
	left:50%;
	width:5px;
	z-index:-1;
	height:40px;
	position:absolute;
	margin-left:-2.5px;
	background-color:#3d3e3e;
	animation:shine 4s linear infinite;
}
.car .middle{
	z-index:1;
	margin-top:-2px;
}
.car .middle .top{
	width:98px;
	height:14px;
	margin:auto;
	position:relative;
	background-color:#f7f7f7;
}
.car .middle .top:before,
.car .middle .top:after{
	top:0;
	border:5px solid #f7f7f7;
	border-top:9px solid transparent;
}
.car .middle .top:before{
	left:-7px;
	border-left:2px solid transparent;
}
.car .middle .top:after{
	right:-7px;
	border-right:2px solid transparent;
}
.car .middle .top .line{
	top:2px;
	height:1px;
	width:44px;
	margin:auto;
	position:relative;
	background-color:#bebebe;
}
.car .middle .bottom{
	margin:auto;
	width:115px;
	height:20px;
	margin-top:-2px;
	background-color:#dfdfdf;
	border-top-left-radius:4px 5px;
	border-top-right-radius:4px 5px;
}
.car .lights{
	top:5px;
	width:111px;
	height:12px;
	margin:auto;
	position:relative;
	border-radius:2px;
	background-color:#6a6a6a;
}
.car .lights:before,
.car .lights:after{
	top:50%;
	width:16px;
	height:16px;
	margin-top:-8px;
	border-radius:50%;
	background-color:#fff;
	border:1px solid #777;
}
.car .lights:before{left:3px}
.car .lights:after{right:3px}
.car .lights .line{
	top:50%;
	left:50%;
	width:50%;
	height:1px;
	background:#fff;
	position:absolute;
	transform:translateX(-50%);
}
.car .bumper .top{
	width:110px;
	height:10px;
	margin:auto;
	position:relative;
	background-color:#202428;
	border-radius:0 0 6px 6px;
	border-top:1px solid #474949;
	border-bottom:1px solid #474949;
}
.car .bumper .top:before,
.car .bumper .top:after{
	top:50%;
	width:10px;
	height:4px;
	margin-top:-2px;
	border-radius:1px;
	background-color:#FB8C00;
}
.car .bumper .top:before{left:5px}
.car .bumper .top:after{right:5px}
.car .bumper .middle{
	height:8px;
	width:102px;
	margin:auto;
	position:relative;
	background-color:#cfcfcf;
	border-radius:0 0 6px 6px;
}
.car .bumper .middle:before{
	top:50%;
	left:50%;
	color:#fff;
	height:12px;
	font-size:8px;
	padding:1px 4px;
	font-weight:500;
	margin-top:-6px;
	line-height:10px;
	text-align:center;
	white-space:nowrap;
	content:attr(data-numb);
	background-color:#E9573F;
	transform:translateX(-50%);
}
.car .bumper .bottom{
	height:6px;
	width:85px;
	margin:auto;
	position:relative;
	background-color:#202428;
	border-radius:0 0 6px 6px;
	box-shadow:0 1px 11px rgba(0,0,0,.75);
}
.car .tyres{
	margin:auto;
	width:110px;
	position:relative;
}
.car .tyres .tyre{
	width:100%;
	height:40px;
	bottom:-6.5px;
	position:absolute;
}
.car .tyres .tyre:before{
	left:-5px;
	box-shadow:-2px 2px 0 #b7b7b8 inset;
}
.car .tyres .tyre:after{
	right:-5px;
	box-shadow:2px 2px 0 #b7b7b8 inset;
}
.car .tyres .tyre:before,
.car .tyres .tyre:after{
	width:18px;
	height:40px;
	border-radius:6px;
	background-color:#1a1c20;
	background:linear-gradient(to right,#333 50%,#555 50%);
	background-size:2px;
}
.car .tyres .tyre.back:before,
.car .tyres .tyre.back:after{bottom:3px}
.car .tyres .tyre.back:before{left:12px}
.car .tyres .tyre.back:after{right:12px}

.road-wrap{
	perspective:160px;
}
.road-wrap .road{
	margin-top:-360px;
	transform:rotateX(80deg);
}
.road-wrap .lane-wrap{
	animation:steer 4s linear infinite;
}
.road-wrap .lane{
	width:20px;
	margin:auto;
}
.road-wrap .lane>div{
	width:100%;
	margin:auto;
	margin-top:30px;
	margin-bottom:30px;
	background-color:#fff;
	animation:lane 4s linear infinite;
}
.road-wrap .lane>div:nth-child(1){height:15px}
.road-wrap .lane>div:nth-child(2){height:20px}
.road-wrap .lane>div:nth-child(3){height:30px}
.road-wrap .lane>div:nth-child(4){height:50px}
.road-wrap .lane>div:nth-child(5){height:40px}
.road-wrap .lane>div:nth-child(6){height:50px}
.road-wrap .lane>div:nth-child(7){height:40px}
.road-wrap .lane>div:nth-child(8){height:50px}
.road-wrap .lane>div:nth-child(9){height:30px}
.road-wrap .lane>div:nth-child(10){height:20px}
.road-wrap .lane>div:nth-child(11){height:15px}

@keyframes shine{
	0%,80%,100%{
		transform:translateX(-55px) rotate(24deg);
	}
	5%,15%,25%,35%,45%,55%,65%,75%,85%,95%{background-color:#2d2d2d}
	0%,10%,20%,30%,40%,50%,60%,70%,80%,90%,100%{background-color:#4d4d4d}
	33%,44%{
		transform:translateX(30px) rotate(-14deg);
	}
	66%{
		transform:translateX(0px) rotate(-10deg);
	}
}
@keyframes lane{
	0%{
		transform:translateY(320px);
	}
	100%{
		transform:translateY(-160px);
	}
}
@keyframes steer{
	0%,100%{
		transform:translateX(-15px) rotate(5deg);
	}
	50%{
		transform:translateX(15px) rotate(-5deg)
	}
}
@keyframes suspension{
	0%,75%,100%{
		transform:rotate(3deg)
	}
	10%,30%,50%,70%,90%{top:0}
	20%,40%,60%,80%,100%{top:-1px}
	25%,50%{
		transform:rotate(-3deg)
	}
	20%{transform:rotate(0deg)}
	90%{transform:rotate(-1deg)}
}
                    `);
                    var carHtml = `
<div class="car">
	<div class="body">
		<div class="mirror-wrap">
			<div class="mirror-inner">
				<div class="mirror">
					<div class="shine"></div>
				</div>
			</div>
		</div>
		<div class="middle">
			<div class="top">
				<div class="line"></div>
			</div>
			<div class="bottom">
				<div class="lights">
					<div class="line"></div>
				</div>
			</div>
		</div>
		<div class="bumper">
			<div class="top"></div>
			<div class="middle" data-numb="&#2348;&#2366; &#2415;&#2411; &#2330; &#2415;&#2411;&#2415;&#2411;"></div>
			<div class="bottom"></div>
		</div>
	</div>
	<div class="tyres">
		<div class="tyre back"></div>
		<div class="tyre front"></div>
	</div>
</div>
<div class="road-wrap">
	<div class="road">
		<div class="lane-wrap">
			<div class="lane">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	</div>
</div>
`;
                    $('body').html(carHtml);
                }
            }
        };

    (function() { // Global Functions
        $(document).click(function(event) {
            if (global.states.selectElementMode === false) {
                return;
            }
            global.focusedElement = $(event.target);
            global.focusedElement.focus();
            utils.flickerElement(global.focusedElement);
        });
        document.onmousemove = function(){
            if (global.states.parkingLotAdded) {
                return;
            }
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, global.constants.TIMEOUT * 2);
                utils.initScript();
            }
        };
    })(); // Global Functions
})();
