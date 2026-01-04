// ==UserScript==
// @name         JDNaCore All In One
// @namespace    JDNaCore
// @version      0.1.23
// @description  All JDNaCore Script In One
// @author       ibratabian17
// @match        https://justdancenow.com/
// @match        https://new.justdancenow.com/
// @icon         https://www.google.com/s2/favicons?domain=justdancenow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446776/JDNaCore%20All%20In%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/446776/JDNaCore%20All%20In%20One.meta.js
// ==/UserScript==

//JDNaCore Begining
console.log("JDNaCore - Created By Ibratabian17")
console.log("Use JDNaCore.help() For Get Help")
var JDNaCoreVersion = "0.1.23";
var JDNaCoreType = "Stable";
var JDNState = "jdnacore";
var DebuggingMode = false;
var Script = this;
var InjectCSS = "";
var jdnRegion = {};




//Songdbs
{
    fetch('https://justdancenow.com/query')
        .then((response) => response.json())
        .then((data) => {
            jdnRegion.jdns = data.jdns
            jdnRegion.api = data.jdns.replace('jdns', 'api')
            fetch(`${jdnRegion.api}v1/songs/published`)
                .then((response) => response.json())
                .then((data) => {
                    let cssString = '';
                    jdnRegion.songdb = data
                    data.forEach(item => {
                        const {
                            id,
                            bkg_image
                        } = item;
                        let cssClass = `
                        .song-mapbkg.${id}E {
    background-image: url("${bkg_image}");
  }`;

                        if (/^\d/.test(id)) {
                            // If the id starts with a number, escape the number using \32
                            cssClass = `${cssClass.replace(id, `\\32 ${id}`)}`;
                        }


                        cssString += cssClass;
                    });
                    var albumbkg = document.createElement("style")
                    albumbkg.type = "text/css"
                    albumbkg.innerText = cssString
                    document.documentElement.appendChild(albumbkg);
                })
                .catch((error) => {
                    console.log(error)
                });
            //EOL
        })
        .catch((error) => {
            console.log(error)
        });
}

//HideUI
function HideUI() {
    document.querySelector('.js').classList.add("anucore-hui");
    setInterval(function() {
        var checkTutorialClass = $(".js").hasClass("state-tutorial");
        if (checkTutorialClass) {
            const el = document.querySelector('.hud');
            if (el.classList.contains("beat")) {
                el.classList.remove("beat");
            }
        }
    }, 500); //run this thang every .5 seconds

    InjectCSS = InjectCSS.concat(`
        .state-dance .hud #pictos{
          border-bottom: solid 2px rgba(255, 255, 255, 0);
      box-shadow: 0px 4px 2px -2px rgba(0, 0, 0, 0);
          transition: .2s all !important;
      }
          .state-dance .hud.beat #pictos{
          border-bottom: solid 2px rgba(255,255,255,0.35);
      box-shadow: 0px 4px 2px -2px rgba(0,0,0,0.25);
          transition: .2s all !important;
      }
       .state-dance .hud #racetrack, .state-dance .hud #players{
          opacity: 0!important;
          transition: .2s opacity !important;
      }
       .state-dance .hud.beat #racetrack, .state-dance .hud.beat #players{
              opacity: 1!important;
              transition: .2s opacity !important;
      }
        `)
}

//PictosColor
function PictoBeatColor() {
    document.querySelector('.js').classList.add("anucore-pbc");
    //PB Start
    setInterval(function() {
        var checkExistClass = $(".js").hasClass("state-dance");
        if (checkExistClass) {
            var top_bar = $('.fill')
            var beat = $('#beat')
            var bg = top_bar.css('background-color')
            var bga = beat.css('background-color')
            var color = top_bar.css('color')
            if (typeof color !== 'undefined') {
                if (bga != color) {
                    const root = document.querySelector(":root"); //grabbing the root element
                    root.style.setProperty("--pictobeat-color", color);
                }
            }
        }
    }, 500); //run this thang every .5 seconds
}

//Racetrack+
{
    function TrashColor() {
        const hud = document.querySelector(arguments[0]);
        if (arguments[1] == 'blue') {
            hud.classList.remove("red", "green", "purple", "aqua", "pink");
        } else if (arguments[1] == 'red') {
            hud.classList.remove("blue", "green", "purple", "aqua", "pink");
        } else if (arguments[1] == 'green') {
            hud.classList.remove("blue", "red", "purple", "aqua", "pink");
        } else if (arguments[1] == 'purple') {
            hud.classList.remove("blue", "red", "green", "aqua", "pink");
        } else if (arguments[1] == 'aqua') {
            hud.classList.remove("blue", "red", "green", "purple", "pink");
        } else if (arguments[1] == 'pink') {
            hud.classList.remove("blue", "red", "green", "purple", "aqua");
        }
    }

    function PatchColor() {
        var rpc = document.querySelector(arguments[0])
        var rcpc = document.querySelector(arguments[0]).style.backgroundColor;
        var zT = rpc.style.transform.match(/translate\((.*)px, (.*)%\)/);
        var translateY = zT[2].concat("%")
        rpc.style.setProperty("--ReducerPst", "".concat(translateY));
        rpc.style.setProperty("--ReducedPst", "calc(".concat('100% - ', translateY, ')'));
        var rpcc = $(arguments[0]).attr('class').split(' ')[2];
        //blue
        if (rcpc == "rgb(55, 132, 249)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("blue");
            TrashColor(arguments[0], 'blue');
        }
        //red
        if (rcpc == "rgb(236, 36, 67)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("red");
            TrashColor(arguments[0], 'red');
        }
        //green
        if (rcpc == "rgb(125, 228, 0)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("green");
            TrashColor(arguments[0], 'green');
        }
        //purple
        if (rcpc == "rgb(136, 2, 201)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("purple");
            TrashColor(arguments[0], 'purple');
        }
        //aqua
        if (rcpc == "rgb(3, 222, 214)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("aqua");
            TrashColor(arguments[0], 'aqua');
        }
        //pink
        if (rcpc == "rgb(216, 32, 201)") {
            const hud = document.querySelector(arguments[0]);
            hud.classList.add("pink");
            TrashColor(arguments[0], 'pink');
        }
    }

    function ApplyRTColor() {
        setInterval(function() {
            var IsDance = $(".js").hasClass("state-dance");
            if (IsDance) {
                try {
                    PatchColor('#racetrack-fill-p1')
                } catch (err) {}
                try {
                    PatchColor('#racetrack-fill-p2')
                } catch (err) {}
                try {
                    PatchColor('#racetrack-fill-p3')
                } catch (err) {}
                try {
                    PatchColor('#racetrack-fill-p4')
                } catch (err) {}
            }
        }, 1); //run this thang every .001 seconds
    }
}

function RCTrackPlus() {
    document.querySelector('.js').classList.add("anucore-rcplus");
    ApplyRTColor()
}

//Hud Costumizer
function HudPlus() {
    document.querySelector('.js').classList.add("anucore-hudplus");
    //PB Start
    var odon = false;
    var prefbeatdur;
    var beatdur;
    var oldpictoslength;
    var oldpictostexture;
    let oddiseven = 1;
    let beatisfour = 1;
    InjectCSS = InjectCSS.concat("", `
    .picto .texture {
        display: block;
        width: 100%;
        height: 100%;
        position: relative
    }
    .picto:has(.texture) {
        background-image: none!important;
    }
    `)

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            var IsTutorial = $(".js").hasClass("state-tutorial");
            if (IsTutorial) {
                odon = false;
                const hud = document.querySelector('.hud');
                hud.classList.add("odd");
                hud.classList.remove("even");

            }
            var checkExistClass = $(".js").hasClass("state-dance");
            if (checkExistClass) {
                //GetPictosState
                const pictos = document.querySelectorAll('#pictos .picto');
                if (!pictos[0].children.length > 0) {
                    setTimeout(CheckPictosState(), 2000);
                }

                //OddOrEven

                fixedbeat = $('#beat')
                const hud = document.querySelector('.hud');
                const root = document.querySelector(":root"); //grabbing the root element
                if (odon) {
                    odon = false;
                    hud.classList.add("odd");
                    hud.classList.remove("even");
                    if (oddiseven == 2) beatisfour++;
                    oddiseven++;
                } else {
                    odon = true;
                    hud.classList.add("even");
                    hud.classList.remove("odd");
                    //oddiseven++;
                }

                if (beatisfour == 3) beatisfour = 1
                if (oddiseven == 3) oddiseven = 1;
                hud.setAttribute("oddiseven", oddiseven);
                hud.setAttribute("beatisfour", beatisfour);

                //LyricHider
                const line = document.getElementsByClassName('line');
                if (!line.length > 0) {
                    const lyrics = document.querySelector('#lyrics');
                    lyrics.style.opacity = '0';
                }
            }
        });
    }); //run this thang every animationDuration Change
    var PictosObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            if (mutationRecord.target.style.transition == "opacity 0.3s ease 0s, transform ease") {
                mutationRecord.target.classList.add("hiding")
                if (DebuggingMode == true) console.log('Assigning Pictos As Hiding')
            } else {
                mutationRecord.target.classList.remove("hiding")
            }
            //create texture inside pictos
            if (!mutationRecord.target.hasChildNodes()) {
                const texturetemp = document.createElement("div");
                texturetemp.classList.add("texture");
                mutationRecord.target.appendChild(texturetemp)
            }
            const texture = mutationRecord.target.querySelector(".texture");
            texture.style.backgroundImage = mutationRecord.target.style.backgroundImage;
            texture.style.backgroundSize = mutationRecord.target.style.backgroundSize;
            texture.style.backgroundPosition = mutationRecord.target.style.backgroundPosition;
        });
    }); //run this thang every animationDuration Change
    function HudPlusCheckBeat() {
        var target = document.getElementById('beat');
        if (!target) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(HudPlusCheckBeat, 500);
            return;
        }
        try {
            observer.observe(target, {
                attributes: true,
                attributeFilter: ['style']
            });
        } catch (err) {}
    }

    function CheckPictosState() {
        var target = document.querySelectorAll('#pictos .picto');
        if (!target) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(CheckPictosState, 500);
            return;
        }
        try {
            PictosObserver.observe(target[0], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[1], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[2], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[3], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[4], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[5], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[7], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[8], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[9], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[10], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[11], {
                attributes: true,
                attributeFilter: ['style']
            });
            PictosObserver.observe(target[12], {
                attributes: true,
                attributeFilter: ['style']
            });
            pictostate = true
        } catch (err) {
            if (DebuggingMode) console.log('PictosObserver: Ignoring '.concat(err))
        }
    }

    HudPlusCheckBeat();
}
//FeedbackPlus
{
    function FeedbackPlus() {

    }
}
//PreviewPlus
{
    function PreviewPlus() {
        var odon = false;
        var beatisfour = false
        const preview = document.querySelector('#preview');
        const root = document.querySelector(":root");
        var currentSong;
        var nextSong; //grabbing the root element
        InjectCSS = InjectCSS.concat("", `
        .song-jdversion {
        font-size: 0.14em;
    }
    `)
        var PrevObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {

                //oddiseven
                const preview = document.querySelector('#preview')
                currentSong = preview.querySelector('.song-cover--hi-res').classList[2]
                if (currentSong != nextSong) {
                    odon = false

                    const selectedObject = jdnRegion.songdb.find(obj => obj.id === currentSong);
                    preview.querySelector('.song-jdversion .version').innerText = `${selectedObject.jdversion}`;
                    preview.querySelector('.song-mapbkg').classList.remove(`${nextSong}E`)
                    preview.querySelector('.song-mapbkg').classList.add(`${currentSong}E`)
                    preview.querySelector('.song-albumcoach').classList.remove(`${nextSong}AC`)
                    preview.querySelector('.song-albumcoach').classList.add(`${currentSong}AC`)
                }
                if (preview.classList.contains('even')) {
                    if (odon) {
                        odon = false;
                        preview.setAttribute("oddiseven", "false");

                    } else {
                        odon = true;
                        preview.setAttribute("oddiseven", "true");
                        //oddiseven++;
                        if (beatisfour) {
                            beatisfour = false
                            preview.setAttribute("beatisfour", "false");
                        } else {
                            beatisfour = true
                            preview.setAttribute("beatisfour", "true");
                        }
                    }
                }
                nextSong = currentSong;
            });
        }); //run this thang every animationDuration Change
        function PatchPreview() {
            var target = document.getElementById('preview');
            if (!target) {
                //The node we need does not exist yet.
                //Wait 500ms and try again
                window.setTimeout(PatchPreview, 500);
                return;
            }
            try {
                //Add Some Needed Element For JDN
                target.querySelector('.song-preview').insertAdjacentHTML('beforeend', `
          <div class="song-mapbkg"></div>
          <div class="song-albumcoach"></div>
          <div class="song-jdversion">
            <span class="just-dance">Just Dance </span>
            <span class="version">403</span>
          </div>
          `)
                PrevObserver.observe(target, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            } catch (err) {}
        }
        PatchPreview()
    }
}

//StopMyPreview!
function StopMyPreview() {
    setInterval(function() {
        if ($(".js").hasClass("state-tutorial") || $(".js").hasClass("state-dance") || $(".js").hasClass("state-afterdance")) {
            try {
                var myPlayer = document.querySelector(".video-preview__video");
                myPlayer.pause();
            } catch (err) {}
        }
    }, 500);
}

//JSInector
function AllowToInjectJS() {
    /* These Things Only Work If You Not using it on greasemonkey*/
    console.log("Be carefull! This gonna execute the code therefore be careful of where/how you got this string. Mind that anyone may try to insert malicious code inside your string.")
    try {
        var JDNaCore = document.querySelector("#JDNaCore")
        var JDNaCoreStyles = window.getComputedStyle(JDNaCore);
        if (JDNaCoreStyles.getPropertyValue("--JSInput")) {
            eval(JDNaCoreStyles.getPropertyValue("--JSInput"));
        } else {
            alert("To use it is required, you need a js script, if you are a style maker, please read our docs")
        }
    } catch (err) {
        console.log("Error: " + err)
        alert(JSInjector + ' Failed To Start! Check Console!')
    }
}


//Script Helper
{

    var CheckJDNState = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            if ($(mutationRecord.target).hasClass("state-tutorial")) JDNState = "tutorial"
            if ($(mutationRecord.target).hasClass("state-songselection")) JDNState = "songselection"
            if ($(mutationRecord.target).hasClass("state-coachselection")) JDNState = "coachselection"
            if ($(mutationRecord.target).hasClass("state-dance")) JDNState = "dance"
            if ($(mutationRecord.target).hasClass("state-afterdance")) JDNState = "afterdance"
            if (DebuggingMode) console.log("JDNaCore: Core: Set State To ".concat(JDNState))
        });
    }); //run this thang every animationDuration Change
    CheckJDNState.observe(document.querySelector("html"), {
        attributes: true,
        attributeFilter: ['class']
    });

    const JDNaCoreCliOptions = {
        getVariable(params) {
            var JDNaCoreVersion = Script.JDNaCoreVersion;
            var DebuggingMode = Script.DebuggingMode;
            var JDNState = Script.JDNState;
            var dev = Script;
            const JDNaCoreStringOptions = {
                isRunning: true,
                Version: JDNaCoreVersion,
                isDebugging: DebuggingMode,
                JDNState: JDNState,
                dev: dev
            }
            return JDNaCoreStringOptions;
        },
        DebuggingMode(params) {
            DebuggingMode = params
        },
        help(params) {
            console.log('Welcome to JDNaCore cli, All command list will appear when typing JDNaCore,\
    To run the add \'()\' function at the end of the letter')
        },
        stopModules(params) {
            console.log(Script)
        }

    }
    window.JDNaCore = JDNaCoreCliOptions;
}
//Run Patcher v2
{
    function StartPatcher(string, p) {
        if (DebuggingMode) console.log('Starting '.concat(string))
        try {
            var JDNaCoreStyles = window.getComputedStyle(JDNaCore);
            if (JDNaCoreStyles.getPropertyValue(string).includes('true')) {
                p()
            }
        } catch (err) {
            console.log("Error: " + err)
            alert(string + ' Failed To Start! Check Console!')
        }
    }
    var JDNaCore = document.createElement("div");
    JDNaCore.setAttribute('id', 'JDNaCore');
    document.documentElement.appendChild(JDNaCore);
    var JDNaCoreString = document.createElement("style");
    JDNaCoreString.type = "text/css";
    JDNaCoreString.innerText = `
   #JDNaCore {
    --HudPlus: true;
    --PictoBeatColor: true;
    --RacetrackPlus: true;
    --HideUi: true;
    --FeedbackPlus: true;
    --AllowToInjectJS: false;
    --StopMyPreview: true;
    --CheckerVersion: true;
    --PreviewPlus: true;
    --FixLyrics: true;}
   `;
    JDNaCore.appendChild(JDNaCoreString);
    setTimeout(function() {
        try {
            console.log(JDNaCoreVersion)
            StartPatcher('--HideUi', HideUI);
            StartPatcher('--HudPlus', HudPlus);
            StartPatcher('--PictoBeatColor', PictoBeatColor);
            StartPatcher('--RacetrackPlus', RCTrackPlus);
            StartPatcher('--StopMyPreview', StopMyPreview);
            StartPatcher('--AllowToInjectJS', AllowToInjectJS);
            StartPatcher('--PreviewPlus', PreviewPlus);
            console.log('Welcome to the JDNaCore era!')
            var nade = document.createElement("style")
            nade.type = "text/css"
            nade.innerText = InjectCSS
            document.documentElement.appendChild(nade);

        } catch (err) {
            console.log("Initial Error: " + err)
            alert('JDNaCore' + ' Failed To Start!')
        }
    }, 3500);
}
