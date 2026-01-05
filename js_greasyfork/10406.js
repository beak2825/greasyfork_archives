// ==UserScript==
// @name         Proxer-Kinomodus
// @namespace
// @version      1.5 Theater-Modus-Ansicht zum Advent weniger weihnachtlich gemacht
// @history      1.3
// @description  Dieses Script fügt Proxer einen Kino-Modus-Button hinzu, der einen Kino-Modus startet
// @author       Dominik Bissinger alias Nihongasuki
// @include      https://proxer.me/*
// @include      https://www.proxer.me/*
// @include      https://stream.proxer.me/embed*
// @run-at       document-start
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/10406/Proxer-Kinomodus.user.js
// @updateURL https://update.greasyfork.org/scripts/10406/Proxer-Kinomodus.meta.js
// ==/UserScript==

//Starte die Funktion "addButton" beim Laden der Seite oder bearbeite das Player-Element, wenn es im Embed ausgeführt wird
document.addEventListener('DOMContentLoaded', function(event) {
	if( window.location.href.indexOf( 'embed' ) > -1 ) {
		var style = document.getElementsByTagName( "style" )[0];
		var styleNormal = style.textContent;

		window.addEventListener( "message", function( event ) {
			if( event.data.type === "TheaterOn" ) {
				var styleTheater = ".flowplayer { width: 100%; height: 100%; } #player_code { width: 100%; height: 100%; } .flowplayer video { height:"+event.data.height+"px !important;  background-color: #000; }";
				style.textContent = styleTheater;

				//Controls ausblenden
				document.getElementById( "psplayercontrols" ).style.display = "none";

				//Curser ausblenden, wenn nicht bewegt wird
				var timeout;
				var hidden = false;
				document.addEventListener( "mousemove", function(event) {
					if( hidden ) {
						style.textContent = styleTheater;
					}
					clearTimeout(timeout);
					timeout = setTimeout(function(){
						style.textContent = styleTheater + " * { cursor: none; }";
						hidden = true;
					}, 2000);
				});
			} else {
				style.textContent = styleNormal;
				document.getElementById( "psplayercontrols" ).style.display = "";
			}
		});

		return;
	}

    $(document).ajaxComplete (function () {
        if (window.location.href.indexOf('watch') === -1 && window.location.href.indexOf('read') === -1) {
            document.getElementById('kinoButton').style.display = "none";
            document.getElementById('theaterButton').style.display = "none";
            document.getElementById('kinoDimmer').style.display = "none";
            document.getElementById('kinoDimmerBar').style.display = "none";
            document.getElementById('kinoStyle2').innerHTML = "";
        }else{
            document.getElementById('kinoButton').style.display = "block";
        };
    });
    addButton();
});

//Fügt den Button "Kino" hinzu
var t;
var addButton = function() {
    if (window.location.href.indexOf('watch') > -1 || window.location.href.indexOf('read') > -1) {
        if (window.location.href.indexOf('forum') > -1) {
            return;
        };
        //Create Overall CSS and Additonal CSS; Apply Overall CSS
        var style1 = document.createElement("style");
        var style2 = document.createElement("style");
        style1.setAttribute("id","kinoStyle1");
        style2.setAttribute("id","kinoStyle2");
        document.head.appendChild(style1);
        document.head.appendChild(style2);
        document.getElementById('kinoStyle1').innerHTML = styleText1;

        //Create Button
        var button = document.createElement("div");
        button.setAttribute("id","kinoButton");
        button.setAttribute("style","border-color: #777777; background-color: #5E5E5E; z-index: 2; bottom: 31px;");
        document.body.appendChild(button);

		//Create Button Theatermodus
		var button2 = document.createElement( "div" );
		button2.setAttribute( "id", "theaterButton" );
		button2.setAttribute( "style", "border-color: #777777; background-color: #5E5E5E; z-index: 2;" );
		document.body.appendChild( button2 );

        //Create Slider
        var dimmer = document.createElement("form");
        dimmer.setAttribute("id","kinoDimmerBar");
        dimmer.setAttribute("style","border-color: #777777; background-color: #5E5E5E; z-index: 2; min-width:200px; display:none;");
        document.body.appendChild(dimmer);

        //Apply HTML
        document.getElementById('kinoDimmerBar').innerHTML = "<input type='range' id='opacity' name='opacity' min='0' max='1' step='0.01' value='0.5' style='width:100%; margin: 0; box-sizing: border-box;'>";
        document.getElementById('kinoButton').innerHTML = "<div id='kino' style='cursor: pointer; width: 100%; text-align: center;'>Kinomodus</div>";
        document.getElementById( "theaterButton" ).innerHTML = "<div id='theater' style='cursor: pointer; width: 100%; text-align: center;'>Theatermodus</div>";

        //Get Opacity from local Storage and Set it as Value
        var value = localStorage.getItem('dimmer');
        if (value !== null) {
            document.getElementById('opacity').value = value;
        };

        //Create Event Listeners
        document.getElementById('kinoButton').addEventListener("click",function () {
            trigger();
        });
        document.getElementById('opacity').addEventListener("input",function () {
            controlDimmer();
        });
		document.getElementById( "theaterButton" ).addEventListener( "click", function() {
			triggerTheater();
		});

        //Set Style
        var color = "";
        var setStyle = function () {
            for (var i = 0; i < 4; i++) {
                if (color === "gray") {
                    document.getElementById('kinoButton').style.backgroundColor = "#5E5E5E";
                    document.getElementById('kinoButton').style.borderColor = "#777777";
                    document.getElementById('kinoDimmerBar').style.backgroundColor = "#5E5E5E";
                    document.getElementById('kinoDimmerBar').style.borderColor = "#777777";
                }else if (color === "black") {
                    document.getElementById('kinoButton').style.backgroundColor = "#000";
                    document.getElementById('kinoButton').style.borderColor = "#FFF";
                    document.getElementById('kinoDimmerBar').style.backgroundColor = "#000";
                    document.getElementById('kinoDimmerBar').style.borderColor = "#FFF";
                }else if (color === "old_blue") {
                    document.getElementById('kinoButton').style.backgroundColor = "#F3FBFF";
                    document.getElementById('kinoButton').style.borderColor = "#000";
                    document.getElementById('kinoDimmerBar').style.backgroundColor = "#F3FBFF";
                    document.getElementById('kinoDimmerBar').style.borderColor = "#000";
                }else{
                    document.getElementById('kinoButton').style.backgroundColor = "#F3FBFF";
                    document.getElementById('kinoButton').style.borderColor = "#000";
                    document.getElementById('kinoDimmerBar').style.backgroundColor = "#F3FBFF";
                    document.getElementById('kinoDimmerBar').style.borderColor = "#000";
                };
            };
        };

        //Read Cookie
        var name = "style=";
        var cookieCheck = function () {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") {
                    c = c.substring(1);
                };
                if (c.indexOf(name) == 0) {
                    color = c.substring(name.length,c.length);
                    setStyle();
                };
            };
            if (color === "") {
                cookieCheck();
            };
        };
        cookieCheck();

        //Create Dimming Layer
        var layer = document.createElement("div");
        layer.setAttribute("id","kinoDimmer");
        layer.setAttribute("style","background-color: #000; z-index:1; position: fixed; top: 0; left: 0; height: 100%; width: 100%; opacity: 0.5; display:none;");
        document.body.appendChild(layer);

        //Set Opacity
        var opacity = document.getElementById('opacity');
        document.getElementById('kinoDimmer').style.opacity = opacity.value;
    };
};

//Toggle Dimming on/off
var trigger = function ( forceOff = false ) {
    var layer = document.getElementById('kinoDimmer');
    var bar = document.getElementById('kinoDimmerBar');

	if( forceOff && layer.style.display === "none" ) {
		return;
	}

    //Apply/Remove Additional CSS
    if (document.getElementById('kinoStyle2').innerHTML === styleText2) {
        document.getElementById('kinoStyle2').innerHTML = "";
    }else{
        document.getElementById('kinoStyle2').innerHTML = styleText2;
    };

    //Enable/Disable Dimming by setting "display" style
    if (layer.style.display === "none") {
        bar.style.display = "inline";
        layer.style.display = "block";
    }else{
        layer.style.display = "none";
        bar.style.display = "none";
    };
};

//Set Dimmer Opacity on input and save to local Storage
var controlDimmer = function (event) {
    var opacity = document.getElementById('opacity');
    var dimmer = opacity.value;
    document.getElementById('kinoDimmer').style.opacity = dimmer;
    localStorage.setItem('dimmer', dimmer);
};

//Start or end theater mode
var triggerTheater = function() {
	if( window.location.href.indexOf('watch') === -1 ) {
		return;
	}

	var btn = document.getElementById( "theaterButton" );
	var iframe = document.getElementsByTagName( "iframe" )[0];
	var ctn = iframe.contentWindow;

	var navigation = document.getElementById("nav");
	var iframeStyle = "position: fixed; top:"+ navigation.offsetHeight +"px; left: 0px; z-index: 2;";

	//Overkill HasClass xD
	if ( (" " + btn.className + " ").replace(/[\n\t]/g, " ").indexOf(" active ") > -1 ) {
		//Turn off
		iframe.height = 504;
		iframe.width = 720;

		iframe.style = "";

		var social = document.getElementsByClassName('shariff')[0];
		social.style.display = "";

		var c1 = document.getElementById( "chatapp_toggle" );
		if( c1 !== null ) { c1.style.display = ""; }
		var c2 = document.getElementById( "chatapp_sidebar" );
		if( c2 !== null ) { c2.style.display = ""; }

		document.getElementById( "kinoButton" ).style.display = "";

		ctn.postMessage( { type: "TheaterOff" } , "*" );
		btn.className = "";
	} else {
		//Turn on
		iframe.height = window.innerHeight - navigation.offsetHeight;
		iframe.width = window.innerWidth;

		iframe.style = iframeStyle;

		var social = document.getElementsByClassName('shariff')[0];
		social.style.display = "none";

		var c1 = document.getElementById( "chatapp_toggle" );
		if( c1 !== null ) { c1.style.display = "none"; }
		var c2 = document.getElementById( "chatapp_sidebar" );
		if( c2 !== null ) { c2.style.display = "none"; }

		//Kinomodus ausschalten
		trigger( true );

		document.getElementById( "kinoButton" ).style.display = "none";

		ctn.postMessage( { type: "TheaterOn", height: iframe.height } , "*" );
		btn.className = "active";
	}
}

//Overall CSS
var styleText1 = "\
#kinoButton, #theaterButton {\
height: 20px; \
width: 105px; \
display: inline; \
position: fixed; \
bottom: 0px; \
left: 0px; \
border-right: 1px solid; \
border-top: 1px solid; \
padding: 5px; \
}\
\
#kinoDimmerBar {\
height: 20px; \
display: inline; \
position: fixed; \
bottom: 0px;\
margin: auto 40%;\
left: 0;\
right: 0;\
border-right: 1px solid;\
border-left: 1px solid\
border-top: 1px solid; \
padding: 5px; \
border-radius: 10px 10px  0 0;\
}\
#theaterButton.active {\
top: 50px; left: 5px; width: auto !important; background-color: #333 !important; border: 0;\
}\
";

//Additional CSS
var styleText2 = "\
.wStream {\
z-index: 2;\
position: relative;\
}\
\
.wMirror {\
z-index: 2;\
position: relative;\
}\
\
.menu {\
z-index: 2;\
position: relative;\
}\
\
#reader {\
z-index: 2;\
position: relative;\
}\
\
#breadcrumb {\
z-index: 2;\
position: relative;\
}\
\
#navigation {\
z-index: 2;\
position: relative;\
}\
";