// ==UserScript==
// @name       Hybrid - Rainbrid
// @version    2.0
// @author	   jawz
// @description  Eric Chizzle
// @grant       GM_getValue
// @grant       GM_setValue
// @match      https://www.gethybrid.io/workers/tasks/*
// @match      http://tinychat.com/*
// @match      https://www.gethybrid.io/workers/projects*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23837/Hybrid%20-%20Rainbrid.user.js
// @updateURL https://update.greasyfork.org/scripts/23837/Hybrid%20-%20Rainbrid.meta.js
// ==/UserScript==

//$('div[class^="item-response order-"]').width('100%');
//$('div[class^="item-response order-"]').css('z-index', 100);
//$('.fields-text').css('z-index', 100);

////Amount of snowflakes for low and blizzard////
var slowMode = 200;
var blizzMode = 1500;

var colors = ['#d42426', '#71e873', '#ffffff'];
var colorCount = colors.length;
var tick;
var snow_no;

var div = $('div[class^="item-response order-"]');
var mode = GM_getValue('mode',false);

var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Blizzard Mode';
    btn.type = "button";
    btn.class = "btn btn-success";
    btn.onclick = function() { flop(); };
    $('ol[class="breadcrumb"]').after (btn);

if (mode===false) {
    snow_no = slowMode;
    changeColor();
} else {
    btn.innerHTML = 'Safe for work';
    snow_no = blizzMode;
    changeColor();
}

function flop() {
    mode = !mode;
    if (mode===true) {
        snow_no = blizzMode;
        buildSnow();
        GM_setValue('mode',true);
        btn.innerHTML = 'Safe for work';
    } else {
        snow_no = slowMode;
        buildSnow();
        GM_setValue('mode',false);
        btn.innerHTML = 'Blizzard Mode';
    }
}

function changeColor() {
    $.each(div,function(index,elem){
        //var pick = Math.floor((Math.random() * colorCount));
        if ($('.instructions').length)
            $('.instructions')[0].style.backgroundColor = colors[2];
        if ($('.fields-text').length)
            $('.fields-text')[0].style.backgroundColor = colors[2];
        if ($('.task-response-submission').length)
            $('.task-response-submission')[0].style.backgroundColor = colors[0];

        div.eq(index)[0].style.backgroundColor = colors[1];
    });
}


snow_img = "https://s11.postimg.org/dyg5tf5df/snowflakes_PNG7582.png";

snow_browser_width = document.body.scrollWidth;
snow_browser_height = document.body.scrollHeight;

snow_dx = [];
snow_xp = [];
snow_yp = [];
snow_am = [];
snow_stx = [];
snow_sty = [];
buildSnow();

function buildSnow() {
    $('[id^="snow_flake"]').remove();
    for (i = 0; i < snow_no; i++) {
        snow_dx[i] = 0;
        snow_xp[i] = Math.random()*(snow_browser_width-50);
        snow_yp[i] = Math.random()*snow_browser_height;
        snow_am[i] = Math.random()*20;
        snow_stx[i] = 0.02 + Math.random()/10;
        snow_sty[i] = 0.7 + Math.random();
        if (i > 0) $(document.body).append("<\div id=\"snow_flake"+ i +"\" style=\"position:absolute;z-index:"+i+"\"><\img src=\""+snow_img+"\" border=\"0\"><\/div>"); else $(document.body).append("<\div id=\"snow_flake0\" style=\"position:absolute;z-index:0\"><a href=\"http://peters1.dk/tools/snow.php\" target=\"_blank\"><\img src=\""+snow_img+"\" border=\"0\"></a><\/div>");
        $('#snow_flake'+i+'').css({
            'height':'0px',
            'overflow':'visible',
            'pointer-events':'none',
            'background':'none !important'
        });
    }
}

function SnowStart() {
	for (i = 0; i < snow_no; i++) {
		snow_yp[i] += snow_sty[i];
		if (snow_yp[i] > snow_browser_height-50) {
			snow_xp[i] = Math.random()*(snow_browser_width-snow_am[i]-30);
			snow_yp[i] = 0;
			snow_stx[i] = 0.02 + Math.random()/10;
			snow_sty[i] = 0.7 + Math.random();
		}
		snow_dx[i] += snow_stx[i];
		document.getElementById("snow_flake"+i).style.top=snow_yp[i]+"px";
		document.getElementById("snow_flake"+i).style.left=snow_xp[i] + snow_am[i]*Math.sin(snow_dx[i])+"px";
	}
	setTimeout(function(){ SnowStart(); }, 25);
}
SnowStart();

$(window).resize(function(){
    snow_browser_width = document.body.scrollWidth;
    snow_browser_height = document.body.scrollHeight;
    buildSnow();
});
