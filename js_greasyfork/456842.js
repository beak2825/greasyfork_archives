// ==UserScript==
// @name         gamepop
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  game customization script for gpop.io
// @author       osuGamer93843
// @match        https://gpop.io/play/*
// @match        https://gpop.io/create/
// @match        https://gpop.io/room/*
// @match        https://gpop.io/
// @require      https://code.jquery.com/jquery-3.6.0.js
// @icon         https://www.google.com/s2/favicons?domain=gpop.io
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456842/gamepop.user.js
// @updateURL https://update.greasyfork.org/scripts/456842/gamepop.meta.js
// ==/UserScript==



//mapinfo
function genmapinfo (serverData) {

    let gamemode = '4k'

    if (/"j"/.test(serverData)) { gamemode = '6k' }

    let startTime = Date.now() / 1000

    let notedata = (serverData.split("}},")[1]).split("]")[0]

    let notes = notedata.split(',')

    let streak = 0
    let score = 0

    let LN = []
    let N = []

    if (gamemode == '4k') {
        LN = [1,3,5,7]
        N = [0,2,4,6]
    }
    else {
        LN = [1,3,5,7,9,11]
        N = [0,2,4,6,8,10]
    }

    let LNamount = 0
    let Namount = 0

    for (let i = 0; i<notes.length; i++)
    {
        let note = notes[i] * 1

        if (N.includes(note)) {

            let multiplier = Math.min(1.005**streak, 3000)

            score += 10*multiplier

            streak++
            Namount++

        }

        if (LN.includes(note)) {

            let multiplier = Math.min(1.005**streak, 3000)

            let noteLength = notes[i+2] * 1
            let LNscore = (noteLength*40)

            LNscore *= multiplier

            score += (10*multiplier)+(LNscore)

            streak++
            LNamount++
        }
    }

    let totalTime = ((Date.now() / 1000)-startTime).toFixed(3)


    return [Namount, LNamount, streak, score, totalTime]
}

//dim
let darken = new GM_configStruct(
    {
        'events':
        {
            'open': function()
            {
                $("#darken").contents().find("#darken").css("background","rgba(0,0,0,0.5)");
                $("#darken").css("max-height","999%");
                $("#darken").css("max-width","999%");
                $("#darken").css("height","999%");
                $("#darken").css("width","999%");
                $("#darken").css("inset","0");
                $("#darken").css("z-index","9998");
            },
        },
        'id': 'darken',
        'fields':
        {
            'nothing':
            {
                'label': '',
                'type': 'hidden',
                'default': ''
            }
        }

    });

//settings menu
GM_config.init({
    'events':
    {
        'open': function()
        {
            $("#darken").show();
            //css
            {$("#MyConfig").contents().find('head > style').replaceWith(`<style type="text/css">
             #MyConfig * @font-face {
	font-family: redalert1;
	src: url(https://gpop.io/fonts/redalert1.ttf) format("truetype");
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0,0,0,0);
}
::-webkit-scrollbar-thumb {
  background: rgba(72, 67, 86, 1);
  border-radius: 10px
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(72, 67, 86, 0.9);
}

#MyConfig {
	font-family: Arial
	background: #FFF;
}

#MyConfig input[type='radio'] {
	margin-right: 8px;
}

#MyConfig .indent40 {
	margin-left: 40%;
}

#MyConfig .field_label {
	font-family: Arial;
	color: rgb(192,192,192);
	font-size: 12px;
	font-weight: bold;
	margin-right: 6px;
}

#MyConfig .radio_label {
	font-size: 12px;
}

#MyConfig .block {
	display: block;
}

#MyConfig .saveclose_buttons {
	color: #fff;
	background: rgba(255, 255, 255, 0.2);
	border: 0;
	border-bottom: 3px solid rgba(255, 255, 255, 0.3);
	font-size: 17px;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	/* letter-spacing: 2px; */
	letter-spacing: 1px;
	cursor: pointer;
    border-radius: 2px;
	background-clip: padding-box !important;
}

#MyConfig .reset,
#MyConfig .reset a,
#MyConfig_buttons_holder {
	color: #000;
	text-align: center;
}

#MyConfig .config_header {
	font-size: 20pt;
	margin: 0;
}

#MyConfig .config_desc,
#MyConfig .section_desc,
#MyConfig .reset {
	font-size: 9pt;
}

#MyConfig .center {
	text-align: center;
}

#MyConfig .section_header_holder {
	margin-top: 8px;
}

#MyConfig .config_var {
	margin: 0 0 4px;
}

#MyConfig .section_header {
	background: #414141;
	border: 1px solid #000;
	color: #FFF;
	font-size: 13pt;
	margin: 0;
}

#MyConfig .section_desc {
	background: #EFEFEF;
	border: 1px solid #CCC;
	color: #575757;
	font-size: 9pt;
	margin: 0 0 6px;
}
#MyConfig .rainbowbg {
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(0, 0, 0, 0.2);
  /* Black w/opacity/see-through */
  border: 3px solid;
}

#MyConfig .rainbow {
  text-align: center;
  font-size: 20px;
  font-family: monospace;
  animation: colorRotate 4.5s linear 0s infinite;
}

@keyframes colorRotate {
  from {
    color: #6666ff;
  }
  10% {
    color: #0099ff;
  }
  50% {
    color: #00ff00;
  }
  75% {
    color: #ff3399;
  }
  100% {
    color: #6666ff;
  }
}

iframe#MyConfig {
  --angle: 0deg;
  width: 1vmin;
  height: 1vmin;
  border: 2px solid;
  border-image: conic-gradient(from var(--angle), red, yellow, lime, aqua, blue, magenta, red) 1;

  animation: 100s rotate linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.dimmer {
  /* display: none; */
  background: #000;
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

input:not([type]), input[type="text"] {
  width: 90px;
  border: solid 1px rgb(72 67 86);
  border-radius: 2px;
  background-color: rgb(72 67 86);
  color: rgb(190,200,185);
  text-align: center;
}

             </style>`);
            }
            $("#MyConfig").contents().find("#MyConfig_saveBtn").attr('onClick', 'window.top.location.reload()');
            $("#MyConfig").contents().find("#MyConfig_wrapper").css("margin","30");
            $("#MyConfig").contents().find("#MyConfig_buttons_holder").css("position","relative");
            $("#MyConfig").contents().find("#MyConfig_buttons_holder").css("bottom","-30");
            $("#MyConfig").contents().find("#MyConfig_closeBtn").css("margin","3");
            $("#MyConfig").contents().find("html").css("overflow","overlay");
            $("#MyConfig").contents().find("#MyConfig_resetLink").attr("style","border: rgba(255, 255, 255, 0.2);border-radius: 2px;background-color: #46454a;text-decoration: none;color: rgb(248 255 253 / 81%);font-family: Arial;border-bottom: 3px solid rgba(255, 255, 255, 0.3);text-align: center;padding: 1px 3px;");

            $("#MyConfig").contents().find("#MyConfig_field_note-a-color").css("width","90px");
            $("#MyConfig").contents().find("#MyConfig_field_note-s-color").css("width","90px");
            $("#MyConfig").contents().find("#MyConfig_field_note-d-color").css("width","90px");
            $("#MyConfig").contents().find("#MyConfig_field_note-f-color").css("width","90px");

            $("#MyConfig").contents().find("#MyConfig_note-transparency_var").css("margin-right","6.5px");
            $("#MyConfig").contents().find("#MyConfig_field_circle").attr('style','max-width: 30%; background-color: rgb(72 67 86);border: solid 2px rgb(72 67 86);border-radius: 5px;color: rgb(253 262 231);');
            /*
            $("#MyConfig").contents().find("#MyConfig_borderToggle_var").css("margin-left", "-23px");
            $("#MyConfig").contents().find("#MyConfig_edge_var").css("margin-left", "-16px");
            $("#MyConfig").contents().find("#MyConfig_hideLines_var").css("margin-left", "-32px");
         */
            $("#MyConfig").contents().find("#MyConfig_fpsInfoLabel_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_fpsInfoLabel_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel0_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel0_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel2_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel2_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel3_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_FirstInfoLabel3_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig_RdIntInfoLabel_field_label").css("color", "#767676");
            $("#MyConfig").contents().find("#MyConfig_RdIntInfoLabel_field_label").css("font-size", "9px");

            $("#MyConfig").contents().find("#MyConfig").css("background","rgb(24,22,29)");
            $("#MyConfig").contents().find("#MyConfig").css("text-align", "center");
            $("#MyConfig").contents().find("#MyConfig").css("margin-bottom","40px");

            GM_config.frame.setAttribute('style','left: 40.6%;top: 10%;font-family:monospace;height: 80%;margin: 0px;max-height: 95%;max-width: 95%;opacity: 1;position: fixed;width: 21%;z-index: 9999;display: block;border: solid 6px #18161d;border-radius: 10px;');
            GM_config.frame.setAttribute('class','rainbow-border');

        },
        'close': function()
        {
            $("#darken").hide();
        },
    },
    'id': 'MyConfig',
    'title': ' ',
    'fields':
    {
        'spacing21a':
        {
            'label': '<p class="rainbow rainbowbg"> Settings </p> ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing1a':
        {
            'label': '<p style="text-align:center;color:gray;"> </p> ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        /*
             'hitsound':
            {
                'label': 'Hitsounds:',
                'type': 'checkbox',
                'default': true
            },
            */
        'noteHeight':
        {
            'label': 'Note Height',
            'type': 'float',
            'default': '29.4'
        },
        'noteWidth':
        {
            'label': 'Note Width',
            'type': 'float',
            'default': '25.98'
        },
        'noteRadius':
        {
            'label': 'Note Radius',
            'type': 'float',
            'default': '30'
        },
        'centerpx':
        {
            'label': 'Playfield vertical position',
            'type': 'float',
            'default': '0'
        },
        'FirstInfoLabel0':
        {
            'label': 'negative = right, positive = left, only change if your notes are not centered.',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'FirstInfoLabel':
        {
            'label': '[!] Use periods (.) as decimal points, not commas (,). ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacetoggle':
        {
            'label': 'Hide UI on level start',
            'type': 'checkbox',
            'default': true
        },
        'defaultPpSquare':
        {
            'label': 'Default receptor size',
            'type': 'checkbox',
            'default': true
        },
        'FirstInfoLabel2':
        {
            'label': 'On is recommended if not you are not changing note height/width/radius',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'hideLines':
        {
            'label': 'Hide lines',
            'type': 'checkbox',
            'default': true
        },
        'notehitdisappear':
        {
            'label': 'Notes disappear on hit',
            'type': 'checkbox',
            'default': true
        },
        'staticReceptor':
        {
            'label': 'Static Receptor',
            'type': 'checkbox',
            'default': false
        },
        'fadeInLn':
        {
            'label': 'Fade In LN',
            'type': 'checkbox',
            'default': false
        },
        'noStreakTxt':
        {
            'label': 'Remove streak text',
            'type': 'checkbox',
            'default': false
        },
        'spacing1':
        {
            'label': ' &#8205; ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing2':
        {
            'label': '<p class="rainbow rainbowbg"> Note Colors </p> ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing3':
        {
            'label': `
                         <div style="text-align:center">Color picker: <input type="color" id="colorpicker" value="#0000ff" style="background-color: rgba(0,0,0,0);border: none;width: 40px;margin: 0;height: 27px;padding: 6px;"></div>
                         `,
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'note-a-color':
        {
            'label': 'Note 1',
            'type': 'Text',
            'default': '255, 114, 114'
        },
        'note-s-color':
        {
            'label': 'Note 2',
            'type': 'Text',
            'default': '68, 240, 255'
        },
        'note-d-color':
        {
            'label': 'Note 3',
            'type': 'Text',
            'default': '90, 255, 98'
        },
        'note-f-color':
        {
            'label': 'Note 4',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-transparency':
        {
            'label': 'Opacity',
            'type': 'text',
            'default': '20'
        },
        'spacing1c':
        {
            'label': ' &#8205; ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing2c':
        {
            'label': '<p class="rainbow rainbowbg"> Tokyo Settings </p> ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'tokyozoom':
        {
            'label': 'Playfield zoom',
            'type': 'checkbox',
            'default': false
        },
        'centerpxTk':
        {
            'label': 'Playfield vertical position',
            'type': 'float',
            'default': '0'
        },
        'FirstInfoLabel3':
        {
            'label': 'negative = right, positive = left, only change if your notes are not centered.',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing4':
        {
            'label': `
                         <div style="text-align:center">Color picker: <input type="color" id="colorpicker" value="#0000ff" style="background-color: rgba(0,0,0,0);border: none;width: 40px;margin: 0;height: 27px;padding: 6px;"></div>
                         `,
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'note-a-color-6':
        {
            'label': 'Note 1',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-s-color-6':
        {
            'label': 'Note 2',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-d-color-6':
        {
            'label': 'Note 3',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-j-color':
        {
            'label': 'Note 4',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-k-color':
        {
            'label': 'Note 5',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'note-l-color':
        {
            'label': 'Note 6',
            'type': 'Text',
            'default': '255, 247, 68'
        },
        'spacing1d':
        {
            'label': ' &#8205; ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'spacing2d':
        {
            'label': '<p class="rainbow rainbowbg"> Experimental settings </p> ',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'zoom':
        {
            'label': 'Playfield zoom ',
            'type': 'int',
            'default': '100'
        },
        'fpsInfoLabel':
        {
            'label': 'Needs "Hide UI on level start" on',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
        'fps':
        {
            'label': '240 fps cap',
            'type': 'checkbox',
            'default': false
        },
        'visualOffset':
        {
            'label': 'Visual Offset',
            'type': 'float',
            'default': '0'
        },
        'RdIntInfoLabel':
        {
            'label': 'Changes where the notes are seen in the screen (default 0 recommended).\n Values are in percent (0 = 0%). Negative (0<) = early, positive (>0) = late.',
            'type': 'hidden',
            'options': ['b','a'],
            'default': 'a'
        },
    }
});
let url = window.location.href
window.addEventListener('load', function() {

    var skippednotesObs = new MutationObserver(function(mutations) {
        for (let i=0; i<40; i++) {
            if (/window.GAMEMODE/.test(($(`script:eq(${i})`).text()))) { var serverData = $(`script:eq(${i})`).text() }
        }
        let [Namount, LNamount, streak, score, totalTime] = genmapinfo(serverData)
        let skips = (Namount+LNamount) - document.querySelector('.totalhits').textContent
        document.querySelector(".skips").textContent = skips
    });
    skippednotesObs.observe(document.querySelector('.playpage-over'), {
        attributes: true
    });

    var tokyoMode = false

    try {if (SERVERDATA.leveldata.gamemode == "pp6") { tokyoMode = true } } catch(e) {}
    $(".playpage-over").append("<div class='mapinfoover'></div>");
    $(".createpage-right").append("<div class='mapinfod'></div>")
    $(".mapinfoover").css({"position": "relative", "top": "24%", "width": "15%", "left": "18%", "background": "rgba(255,255,255, 0.1)", "border-radius": "3px", "padding": "10px", "border-color": "gray"})
    $(".mapinfod").css({"background": "rgba(255,255,255, 0.1)", "border-radius": "3px", "padding": "10px", "border-color": "gray"})
    $(".mapinfoover").append(`
        <div class="mapinfocc">
        <div class="perfover" style="display: flex; color: rgb(255, 197, 197); animation: huerotate 1.5s linear infinite;">Perfect: <div class="perfs" style="margin-left: 3px"></div> </div>
        <div class="greatover" style="display: flex; color: rgb(255, 254, 213)">Great: <div class="greats" style="margin-left: 3px"></div> </div>
        <div class="goodover" style="display: flex; color: rgb(236, 185, 255, 0.9)">Good: <div class="goods" style="margin-left: 3px"></div> </div>
        <div class="okover" style="display: flex; color: rgb(213 189 189)">Ok: <div class="oks" style="margin-left: 3px"></div> </div>
        <div class="missover" style="display: flex; color: rgb(255 68 68)">Miss: <div class="misses" style="margin-left: 3px"></div></div>
        <div class="skipover" style="display: flex; color: rgb(255 151 63)">Skipped: <div class="skips" style="margin-left: 3px"></div> </div>
        <div class="totalhitsover" style="display: flex; color: rgba(255 255 255, 0,5)">Notes hit: <div class="totalhits" style="margin-left: 3px"></div> </div>

        </div>
       `)
    if (url == 'https://gpop.io/create/') {

        let fileSelector = document.getElementById('createpage-load-note-input')
        fileSelector.addEventListener('change', function(event) {
            let file = event.target.files[0]
            let reader = new FileReader()
            reader.addEventListener('load', function(event) {
                let mapData = event.target.result
                let [Namount, LNamount, streak, score, totalTime] = genmapinfo(mapData)
                $(".mapinfod").append(`
        <p class="mapinfoc">Total notes: ${Namount+LNamount}
        <br>Notes: ${Namount}
        <br>Long notes: ${LNamount}
        <br>Max score: ${score.toFixed(2)}
        </p>
        <p class="smallinfo">time: ${totalTime}</p>
       `)
            })
            reader.readAsText(file)
        })
    }
    else {
        $('<button class="gbutton" id="mapinfobutton" style="height: 28px;font-family:redalert1;left: 0%;position:relative;font-size:16px;/* margin-top: -3; */line-height: 26px;margin: 10px;">Show map info</button>').appendTo(".mapinfod").click(function() {

            for (let i=0; i<40; i++) {
                if (/window.GAMEMODE/.test(($(`script:eq(${i})`).text()))) { var serverData = $(`script:eq(${i})`).text() }
            }

            let [Namount, LNamount, streak, score, totalTime] = genmapinfo(serverData)


            $(".mapinfod").append(`
        <p class="mapinfoc">Total notes: ${Namount+LNamount}
        <br>Notes: ${Namount}
        <br>Long notes: ${LNamount}
        <br>Max score: ${score.toFixed(2)}
        </p>
        <p class="smallinfo">time: ${totalTime}</p>
       `)

            $("#mapinfobutton").hide()

        })}

    $("#topbar-discord").removeAttr('href')
    $("#topbar").attr("style","background: rgba(11,11,11,0.9);")

    if (url == 'https://gpop.io/create/')
    {
        $('<div class="gamespeed-choice">2.5x</div>').appendTo('.createpage-left-gamespeed')
    }
    if (url == 'https://gpop.io/') {
        $(".topbar2-c").attr("style","background: rgba(11,11,11,0.9); border-radius: 0px 0px 10px 10px;");
        $("#topbar").attr("style","background: rgba(11,11,11,0.9);");
        $(".menu-levels-container").attr("style","background: rgba(11,11,11,0.9); border-radius: 10px;");

    }

    if (url != 'https://gpop.io/')
    {
        $('<button id = "scriptGUI" class="gbutton" style="height: 28px;font-family:redalert1;left: 0%;position:relative;font-size:16px;/* margin-top: -3; */line-height: 26px;margin: 12px 5px 0;">Settings</button>').appendTo(".topbar").click(function() {
            GM_config.open();
            darken.open();

        });
    }

    if (url != 'https://gpop.io/create/') {
        if (GM_config.get('spacetoggle') == true) {
            function a(){
                try {
                    let top = 20
                    tokyoMode ? (this.window.scrollTo(0, screen.height/3.25), top = 50) : this.window.scrollTo(0, screen.height/2.5);
                    if ($( ".pp-container" ).hasClass("pp-showoverlay" ) == false) {
                        if (!tokyoMode) {
                            $('.pp-container').attr("style", "z-index: 2; background:rgba(0,0,0,0.0)")
                            $('#main > div > div').hide()
                            $('.pp-info').hide()
                            $("#topbar").hide()
                            $(".dancer-on").attr("style","zoom:"+GM_config.get('zoom')+"%")
                        }
                        if (GM_config.get('zoom') != 100) {$(".pp-streak").attr("style",`top: ${top}%; position: fixed; opacity: 1; font-size: 15px; font-family: cursive;`)};

                    }
                    else if ($( ".pp-container" ).hasClass( "pp-showoverlay" ) == true)
                    {
                        if (!tokyoMode) {
                            $('.pp-container').attr("style", "z-index: 2; background:rgba(11,11,11,0.6))")
                            $('#main > div > div').show()
                            $('.pp-info').show()
                            $("#main").attr("style","top:0%")
                            $("#topbar").show()
                            $("body").attr("style","zoom:100%")
                        }
                    } } catch (p) {};
            }
            setInterval((function()
                         {a();}),100);
        }
    }

    GM_addStyle(`
    /* Map info */
    .mapinfoc {
    letter-spacing: 0.3px;
    border-radius: 5px;
    background-color: #1a1a1aba;
    font-family: Arial;
    color: rgb(192,192,192);
    font-size: 12px;
    font-weight: bold;
    margin-right: 6px;
    padding: 5px;
    }
    .mapinfocc {
    pointer-events: unset;
    letter-spacing: 0.3px;
    border-radius: 5px;
    background-color: #141212ba;
    color: rgb(192,192,192);
    padding: 5px;
    font-family: "redalert1", monospace;
    font-size: 18px;
    }
    .smallinfo {
    color: #767676;
    font-size: 13px;
    }`)
    if (url != 'https://gpop.io/create/' && url != 'https://gpop.io/') {
        let hide_line = ''
        let pp_square_style = ''
        let notehitdisappear = ''
        let staticReceptor = ''
        let nocombotext = ''
        let fadeInLn = ''
        let a_rgb = ''
        let s_rgb = ''
        let d_rgb = ''
        let f_rgb = ''
        if (!tokyoMode) {
            a_rgb = GM_config.get('note-a-color')
            s_rgb = GM_config.get('note-s-color')
            d_rgb = GM_config.get('note-d-color')
            f_rgb = GM_config.get('note-f-color')
        }
        else {
            a_rgb = GM_config.get('note-a-color-6')
            s_rgb = GM_config.get('note-s-color-6')
            d_rgb = GM_config.get('note-d-color-6')
        }
        let j_rgb = GM_config.get('note-j-color')
        let k_rgb = GM_config.get('note-k-color')
        let l_rgb = GM_config.get('note-l-color')
        let opacity = GM_config.get('note-transparency')/100
        let width = GM_config.get('noteWidth')
        let height = GM_config.get('noteHeight')
        let radius = GM_config.get('noteRadius')
        let offset = GM_config.get('visualOffset')
        let centernotes = GM_config.get('centerpx')
        let playfieldscale = GM_config.get('zoom')




        if (!(GM_config.get('defaultPpSquare'))) { pp_square_style = `
    width:  ${width} !important;
    border-radius: ${radius} !important;
    height: ${height} !important;
    `}
        if (GM_config.get('hideLines')) { hide_line = "display: none !important;" };
        if (GM_config.get('notehitdisappear')) { notehitdisappear = 'display: none !important' }
        if (GM_config.get('staticReceptor')) {staticReceptor = `
.pp-lane-click .pp-square {
    transform: scale(1) !important;
    opacity: 0.4 !important;
}`}
        if (GM_config.get('noStreakTxt')) {nocombotext = `
.pp-streak:not(:empty):before {
    content: "" !important;
}
`}
        if (GM_config.get('fadeInLn')) {fadeInLn = `
.pp-noteextended {background:linear-gradient(black, transparent);}
.createpage-left .ppnolag .pp-noteextended-hitting {background:linear-gradient(0deg, rgba(243, 165, 255, 0.2), transparent) !important}
`}

        if (tokyoMode) {
            centernotes = GM_config.get('centerpxTk')
            let tkz = ''
            if (GM_config.get('tokyozoom')) {
                tkz = `
    .pp6-fullscreenmode {
        transform: scale(2)
    }`
            }
            GM_addStyle(`
    ${tkz}
    .pp-square {
        bottom: calc(30% - 2%) !important;
        display: unset !important;
    }
    .pp-key {display: none !important;}`)
        }

        GM_addStyle ( `
    .playpage-a12-block {display: none !important}
    ${nocombotext}

    /*.playpage-nolag {
    zoom: ${playfieldscale}% !important;
    }*/
    ${staticReceptor}

    .pp-note-hit { ${notehitdisappear} }

    /*background*/

    .pp-notes-container {
    z-index: -1 !important;
    background-color: black !important;
    border: 1px solid #3e3e3e !important;
    border-radius: 10px !important;
    top: ${offset} !important;
    left: ${centernotes}px !important;
    }

    #topbar { z-index: 3 }
    .pp-container {z-index: 2;}

    .pp-square {
    ${pp_square_style}
    }

    .pp-line { ${hide_line} }

    .pp-note {
    min-height: 0px !important;
    left: 8.73px !important;}

    .pp-note-a {
    background-color:  rgba(${a_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }

    .pp-note-s {
    background-color:  rgba(${s_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }

    .pp-note-d {
    background-color:  rgba(${d_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }

    .pp-note-f {
    background-color:  rgba(${f_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }

    .pp-note-j {
    background-color:  rgba(${l_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }
    .pp-note-k {
    background-color:  rgba(${k_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }
    .pp-note-l {
    background-color:  rgba(${j_rgb}, ${opacity}) !important;
    width:  ${width} !important;
    border-radius: ${radius}px !important;
    border: 0px !important;
    font-size: 0px !important;
    }

    /* LNs */
    pp-noteextended-hitting {
   animation: x !important;
   background:  x !important;
}
    .pp-noteextended:before { display:none !important }
    ${fadeInLn}

    .pp-note-a:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-s:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-d:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-f:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-j:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-k:not(.pp-noteextended) {
    height: ${height} !important;
    }
    .pp-note-l:not(.pp-noteextended) {
    height: ${height} !important;
    }
` );
    }


})