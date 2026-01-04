// ==UserScript==
// @name         AgarPaper.io mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Settings, animation, macro
// @author       InvisibleRain
// @match        http://agarpaper.io/*
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411614/AgarPaperio%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/411614/AgarPaperio%20mod.meta.js
// ==/UserScript==


var rdd = {
    w_timeout: 10,
    shift: false,
    dev: false, //dev mod for debugging
    feed: false,
    zoom: false,
    shotgun: false,
    log: function (text) {
        console.log("%cBPDMod:", 'background: #F64747; color: #fff; padding: 4px;', text);
    },
    set: function (value, message) {
        console.log("%c%s ", 'background: #7aa1bd; color: #fff;margin: 0; padding: 3px;', value.toUpperCase(), message);
    }
};


var key = [81, 88, 113, 115, 120, 69];


rdd.log('script started!');
Agar.gameIsOver=true; //Bugfix, don't remove!
//setInterval(displayID, 1000);
//setInterval(displayXY, 1000);
//window.Agar.game_start();


function settingsInit() {
    //Initializes unsafeWindow functions and sets settings according to cookies
    //In order to work properly it shall be called in the end of the script
    unsafeWindow.setIsEnableFoodAnimation = setIsEnableFoodAnimation;
    unsafeWindow.enableExpandedNames = enableExpandedNames;
    unsafeWindow.enableCookieNames = enableCookieNames;
    unsafeWindow.saveNameInCookie = saveNameInCookie;

    var cookie;
    cookie = readCookie('IsEnableFoodAnimation');
    if (cookie != null) {
        cookie = (cookie == 'true'); //Convert the string to bool
        rdd.log(cookie);
        setIsEnableFoodAnimation(cookie);
        document.getElementById("foodAnimation").checked = cookie;
        cookie = null;
    }

    cookie = readCookie('enableExpandedNames');
    if (cookie != null) {
        cookie = (cookie == 'true')
        rdd.log(cookie);
        enableExpandedNames(cookie);
        document.getElementById("expandedNames").checked = cookie;
        cookie = null;
    }

    cookie = readCookie('enableCookieNames');
    if (cookie != null) {
        cookie = (cookie == 'true')
        rdd.log(cookie);
        enableCookieNames(cookie);
        document.getElementById("cookieName").checked = cookie;
        cookie = null;
    }

    cookie = readCookie('enableCookieNames');
    if (cookie != null) {
        if (cookie == 'true')
            setNameFromCookie();
        cookie = null;
    }
}


function setIsEnableFoodAnimation(value) {
    //Really an annoying thing. Don't turn it on
    if (typeof(value) == 'boolean') {
        isDisableFoodAnimation=!value;
        createCookie('IsEnableFoodAnimation',value, 1000);
    }
    else
        throw 'The value should be of boolean type!';
}


function enableExpandedNames(value) {
    //set max name lenght to 15 instead of 12
    //setting the name to more than 15 chars will crash ur game
    if (typeof(value) == 'boolean') {
        if (value)
            $('#paperio_p1').attr("maxlength","15");
        else
            $('#paperio_p1').attr("maxlength","12");
        createCookie('enableExpandedNames',value, 1000);
    }
    else
        throw 'The value should be of boolean type!';
}


function setName(name) {
    //bug: works only when starting game, not restarting. Need to reload the page for the changes to take effect
    //fix: steal the socket variable through debugger, so you can change ur nick while in game just by sp(0);

    if (typeof(name) == 'string')
        $('#paperio_p1').val(name);
    else
        throw 'The name should be of stirng type!';
}


function enableCookieNames(value) {
    if (typeof(value) == 'boolean') {
        if (!value) {
            eraseCookie('agarpaper_username');
            $(".button").attr("onclick","ads.show()");
            $("#paperio_p1").attr("onchange","");
        }
        else {
            if ($('#paperio_p1').val() != "")
                saveNameInCookie($('#paperio_p1').val());
            $(".button").attr("onclick","ads.show();saveNameInCookie($('#paperio_p1').val())");
            $("#paperio_p1").attr("onchange","saveNameInCookie($('#paperio_p1').val())");
        }
        createCookie('enableCookieNames',value, 1000); //Cookie for settings
    }
    else
        throw 'The value should be of boolean type!';
}


function saveNameInCookie(name) {
    //bug: works only when starting game, not restarting. Need to reload the page for the changes to take effect

    if (typeof(name) == 'string') {
        createCookie('agarpaper_username', name ,1000);
        rdd.log('the name \"' + name +'\" has been succesfully cookied');
    }
    else
        throw 'The name should be of stirng type!';
}


function setNameFromCookie() {
    //bug(?): works only when starting game, not restarting. Need to reload the page for the changes to take effect

    var cookie = readCookie('agarpaper_username');
    if (cookie != null) {
        setName(cookie);
        rdd.log('the name \"' + cookie +'\" has been succesfully retrieved from cookies!');
    }

}

function displayID() {
    if (!Agar.gameIsOver) {
        var playerID=shars[0].id;
        rdd.log('playerID: ' + playerID);
    }
}


function displayXY() {
    if (!Agar.gameIsOver) {
        var playerX=Math.round(shars[0].x);
        var playerY=Math.round(shars[0].y);
        rdd.log('x: ' + playerX + ' y: ' + playerY);
    }
}


window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);


function keydown(event) {
    if (rdd.dev)
        rdd.log('Click = ' + event.keyCode);
    if (event.keyCode === 16 && !rdd.shift) {
        rdd.shift = true;
    }
    if (event.keyCode == key[0] && !rdd.feed) {
        rdd.feed = true;
        feed();
    }
    if (event.keyCode === key[1] && !isSpectating) {
        rdd.zoom = true;
        setUnlimitedZoom(true);
        setSpectate(true);
    }
    if (event.keyCode == key[5] && !rdd.shotgun) {
        rdd.shotgun = true;
        foodShotgun();
    }
}


function keyup(event) {
    if (rdd.dev)
        rdd.log('UP = ' + event.keyCode);
    if (event.keyCode === 16)
        setTimeout(rdd.shift = false, 1000);
    if (event.keyCode == key[0])
        rdd.feed = false;
    if (event.keyCode === key[1] && rdd.zoom) {
        rdd.zoom = false;
        setUnlimitedZoom(false);
        setSpectate(false);
    }
    if (event.keyCode == key[5])
        rdd.shotgun = false;
}


//Feed continiously
function feed() {
    rdd.log('feed() was called');
    if (rdd.feed) {
        dropFood();
        setTimeout(feed, rdd.w_timeout);
    }
}


//Drop one food
function dropFood() {
    //rdd.log('dropFood() was called');
    $("body").trigger($.Event("keydown", {
        keyCode: 87
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 87
    }));
}


//Shoot seven pieces of food at one time to blow up a virus. Needs a bit of fixing
var global_i = 0;
function foodShotgun() {
    rdd.log('foodShotgun() was called');
        if (global_i < 7) {
                global_i++;
                sp(21); //send a packet responsible for the W key
                setTimeout(foodShotgun, 170); //170 is a magic, experimentally selected delay. You will misfire some food, if you will try to set it lower.
        }
        else
            global_i = 0;
}


/*-----------------------------------------------------------------START OF SETTINGS SECTION-------------------------------------------------------------------------------------------------------*/


/*------------------------Pretty blue button---------------------------------------*/
$(".grow").append("<div onclick='settingsHideShow()' id=\"button_settings\">⚙️</div>");

$(".grow").append("<style id='settings_button_style'>\n\
#pre_game #button_settings, #contact .button {\n\
    position: absolute;\n\
    right: -83px;\n\
    top: 2px;\n\
    padding: 15px 5px;\n\
    text-align: center;\n\
    cursor: pointer;\n\
    height: 30px;\n\
    width: 63px;\n\
}\n\
#pre_game #button_settings, #contact .button {\n\
    background: #1877f2;\n\
    border-bottom: 6px solid #4267b2;\n\
    margin-top: -2px;\n\
    color: #4267b2;\n\
    line-height: 32px;\n\
    font-size: 34px;\n\
}\n\
#pre_game #button_settings:hover,#contact .button:hover {\n\
	background: #4080ff;\n\
}\n\
#pre_game #button_settings:active,#contact .button:active {\n\
	border: none;\n\
	border-bottom:2px solid #4267b2;\n\
	border-top: 4px solid #333;\n\
}\n\
#pre_game .grow { position: absolute; left: 50%; margin-left: -225px; width: 336px; top: 250px; }\n\
</style>");


/*----------------------------Settings Menu-----------------------------------*/
$(".grow").append('<div id="settings">\n\
      <input onchange="setIsEnableFoodAnimation(this.checked)" type="checkbox" id="foodAnimation" class="settingsCheckbox">\n\
      <label for="foodAnimation"> Food Animation</label><br>\n\
\n\
      <input onchange="enableExpandedNames(this.checked)" type="checkbox" id="expandedNames" class="settingsCheckbox">\n\
      <label for="expandedNames"> Longer Name</label><br>\n\
\n\
      <input onchange="enableCookieNames(this.checked)" type="checkbox" id="cookieName" class="settingsCheckbox">\n\
      <label for="cookieName"> Save Name</label><br>\n\
</div>');

$(".grow").append('<style id="settings_style">\n\
	#settings {\n\
		display: none;\n\
		position: relative;\n\
		top: 70px;\n\
		margin-left: 22.5%;\n\
		margin-right: 0;\n\
		color: #ededd1;\n\
		font-size: 25px\n\
	}\n\
</style>');

$(".grow").append("<script id='settingshideshow'>\n\
function settingsHideShow() {\n\
    	if ($('#settings').css('display') == 'none' || $('#settings').css('visibility') == 'hidden')\n\
    		$('#settings').show();\n\
        else\n\
        	$('#settings').hide();\n\
}\n\
</script>");


/*----------------------Overwrite a css rule to fix a bug-------------------------*/
//The default css rule applies the style of #paperio_p1 (name input box) for all the input tags inside of the #pre_game element.
//The following lines overwrite the rule and apply it only to #paperio_p1
$("#pre_game input,#contact .button").css({ "position": "unset", "padding": "unset", "text-indent": "unset", "border": "unset", "height": "unset", "width": "unset", "line-height": "unset", "font-size": "unset", "background": "unset", "border-bottom": "unset", "outline": "unset" });
$("#pre_game #paperio_p1,#contact .button").css({ "position": "absolute", "left": "0px", "top": "0px", "padding": "15px 5px", "text-indent": "10px", "border": "0", "height": "30px", "width": "216px", "line-height": "30px", "font-size": "25px", "background": "#ededd1", "border-bottom": "6px solid #a1a18d", "outline": "none", });


/*----------------------Expand the .grow's width-------------------------*/
//This is required in order to allow long names in settings w/o a line break
$("#pre_game .button").css({"right": "unset", "left": "236px"});
$("#button_settings").css({"right": "unset", "left": "346px"})
$(".grow").css({"width": "500px"});


/*----------------------Yet another bug fix-------------------------*/
//The #bottom element is rudimentary, while also disallowing to set the lower checkboxes in the settings. Fuck yeah, remove it!
$("#bottom").remove();



settingsInit(); //Check the inside of the function for info
