// ==UserScript==
// @name         HomePageChanger
// @namespace    https://greasyfork.org/ru/scripts/410653-homepagechanger
// @version      1.6
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/home\.php/
// @exclude     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/home\.php\?info/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/410653/HomePageChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/410653/HomePageChanger.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    if (!unsafeWindow.TutGoNext) {
        unsafeWindow.TutGoNext = TutGoNext;
    }
    if (!unsafeWindow.TutBack) {
        unsafeWindow.TutBack = TutBack;
    }
    if (!unsafeWindow.TutPress) {
        unsafeWindow.TutPress = TutPress;
    }
    if (!unsafeWindow.prepare_area) {
        unsafeWindow.prepare_area = prepare_area;
    }

    let gold = document.querySelector("#top_res_table > tbody > tr > td:nth-child(2)").innerHTML;
    let wood = document.querySelector("#top_res_table > tbody > tr > td:nth-child(4)").innerHTML;
    let ore = document.querySelector("#top_res_table > tbody > tr > td:nth-child(6)").innerHTML;
    let mercury = document.querySelector("#top_res_table > tbody > tr > td:nth-child(8)").innerHTML;
    let sulfur = document.querySelector("#top_res_table > tbody > tr > td:nth-child(10)").innerHTML;
    let crystals = document.querySelector("#top_res_table > tbody > tr > td:nth-child(12)").innerHTML;
    let gems = document.querySelector("#top_res_table > tbody > tr > td:nth-child(14)").innerHTML;
    let diamonds = document.querySelector("#top_res_table > tbody > tr > td:nth-child(16)");

    let change = `
    
    <center>
<table border=0 cellspacing=0 cellpadding=0><tr><td height="6px"></td></tr></table><table cellpadding=0 border=0 cellspacing=0 width=970><tr><td>
<style>
.area_div {
  user-drag: none; 
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
   overflow: hidden;
}

.area_img{
user-drag: none; 
user-select: none;
-moz-user-select: none;
-webkit-user-drag: none;
-webkit-user-select: none;
-ms-user-select: none;
}

.area_header{
position: absolute;
bottom: 0;
left: 0;
background: url("i/home_im/bg_header.png") no-repeat center center;
background-size: contain;
padding: 0.3em 0.7em 0.9em 0.9em;
font-family: verdana,geneva,arial cyr;
font-size: 32px;
}



.building:hover {
    -webkit-filter: brightness(150%) drop-shadow(0 0 5px #ffe4b3);
    filter: brightness(150%) drop-shadow(0 0 5px #ffe4b3);
     -webkit-transition-duration: .3s;
    -moz-transition-duration: .3s;
    -o-transition-duration: .3s;
    -ms-transition-duration: .3s;
}

.building {
cursor: pointer;
}

@keyframes ArrowTutorialHG {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-moz-keyframes ArrowTutorialHG {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-webkit-keyframes ArrowTutorialHG {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-ms-keyframes ArrowTutorialHG {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-o-keyframes ArrowTutorialHG {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}


.ArrowTutorialHG{
width: 100%;
max-width: 75px;
z-index: 900;
background: url('i/mobile_view/ArrowTutorial.png') no-repeat top center;
background-size: contain;
position: absolute;
animation: ArrowTutorialHG 1s infinite;
-webkit-animation: ArrowTutorialHG 1s infinite;
-moz-animation: ArrowTutorialHG 1s infinite;
-o-animation: ArrowTutorialHG 1s infinite;
animation: ArrowTutorialHG 1s infinite;
}

.ArrowTutorialHG:before{
content: "";
padding-top: 120%;
float: left; 
}

.ArrowTutorialHG_army{
width: 100%;
max-width: 75px;
z-index: 900;
background: url('i/mobile_view/ArrowTutorialHG.png') no-repeat top center;
background-size: contain;
position: absolute;
animation: ArrowTutorialHG 1s infinite;
-webkit-animation: ArrowTutorialHG 1s infinite;
-moz-animation: ArrowTutorialHG 1s infinite;
-o-animation: ArrowTutorialHG 1s infinite;
animation: ArrowTutorialHG 1s infinite;
}

.ArrowTutorialHG_army:before{
content: "";
padding-top: 120%;
float: left; 
}

.ArrowTutorialHGToUP{
    top: 50%;
left: 0%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(180deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(180deg);        /* FF */
    -o-transform: rotate(180deg);          /* Opera */
    -ms-transform: rotate(180deg);         /* IE9 */
    transform: rotate(180deg);             /* W3C compliant browsers */
}

.ArrowTutorialHGToLeft{
    top: -10%;
left: 60%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(90deg);        /* FF */
    -o-transform: rotate(90deg);          /* Opera */
    -ms-transform: rotate(90deg);         /* IE9 */
    transform: rotate(90deg);             /* W3C compliant browsers */
}

.ArrowTutorialHGToDown2{
    top: 5%;
    left: 50%;
    z-index: 200;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.ArrowTutorialHGToLeft2{
    top: 55%;
left: 70%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(90deg);        /* FF */
    -o-transform: rotate(90deg);          /* Opera */
    -ms-transform: rotate(90deg);         /* IE9 */
    transform: rotate(90deg);             /* W3C compliant browsers */
}

.ArrowTutorialHGToRight2{
    top: 55%;
left: -70%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(-90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(-90deg);        /* FF */
    -o-transform: rotate(-90deg);          /* Opera */
    -ms-transform: rotate(-90deg);         /* IE9 */
    transform: rotate(-90deg);             /* W3C compliant browsers */
}

</style>

<div id="area" class="area_div" style="width:100%;height:100%;position:absolute;">

<div id="tutorial" style="position: relative;z-index: 20;">
<style type="text/css">
                .arrow100       {width: 30px; height: 30px; margin-left: 285px; margin-top: 160px; background-image: url(i/arrows_down.png); display: none; position: absolute;}
                .arrow100.active{display: none;}
        </style><div class="arrow100 active" id="arrows_down100" style="z-index: 900;"></div>

<style type="text/css">
                .arrow200       {width: 30px; height: 30px; margin-left: 210px; margin-top: 160px; background-image: url(i/arrows_down.png); display: none; position: absolute;}
                .arrow200.active{display: none;}
        </style>
        
        <div class="arrow200 active" id="arrows_down200" style="z-index: 900;"></div>




</td></tr></table></center>
    
    `

    function tutorial_arrow_hide_show100() {
        document.getElementById("arrows_down100").style.display = (document.getElementById("arrows_down100").style.display == "block") ? "none" : "block";
    }

    function tutorial_arrow_Refresh100() {
        tutorial_arrow_hide_show100();
        if (ATimer100 >= 0) clearTimeout(ATimer100);
        ATimer100 = setTimeout("tutorial_arrow_Refresh100()", 500);
    }

    var ATimer100 = 0;

    function show_arrow_by_flash100() {
        tutorial_arrow_hide_show100();
        if (ATimer100 >= 0) clearTimeout(ATimer100);
        ATimer100 = setTimeout("tutorial_arrow_Refresh100()", 500);
    }

    function hide_arrow_by_flash100() {
        if (ATimer100 >= 0) clearTimeout(ATimer100);
        document.getElementById("arrows_down100").style.display = "none";
    }

    function tutorial_arrow_hide_show200() {
        document.getElementById("arrows_down200").style.display = (document.getElementById("arrows_down200").style.display == "block") ? "none" : "block";
    }

    function tutorial_arrow_Refresh200() {
        tutorial_arrow_hide_show200();
        if (ATimer200 >= 0) clearTimeout(ATimer200);
        ATimer200 = setTimeout("tutorial_arrow_Refresh200()", 500);
    }

    var ATimer200 = 0;

    function show_arrow_by_flash200() {
        tutorial_arrow_hide_show200();
        if (ATimer200 >= 0) clearTimeout(ATimer200);
        ATimer200 = setTimeout("tutorial_arrow_Refresh200()", 500);
    }

    function hide_arrow_by_flash200() {
        if (ATimer200 >= 0) clearTimeout(ATimer200);
        document.getElementById("arrows_down200").style.display = "none";
    }

    var main_pcnt = 1;
    var main_cur = 1;
    var main_pages_data = [];
    main_pages_data[1] = "";

    var task_pcnt = 3;
    var task_cur = 1;
    var task_pages_data = [];
    task_pages_data[1] = "Будь осторожен! Местность за городом небезопасна. Однако, если ты храбр, то ты можешь испытать свою удачу в бою с исконными обитателями этих земель. ";
    task_pages_data[2] = "Собирай золото и ресурсы, выкапывая клады, разоряя могильники или же просто отбирая его по своей прихоти у слабых. ";
    task_pages_data[3] = "Для того, чтобы выйти за черту города, открой карту мира и хорошенько оглядись.";

    function createXMLHttpReq() {
        var objXMLHttpReq;

        if (window.XMLHttpRequest) {
// Real browsers ;)
//
            objXMLHttpReq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
// IE
//
            objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return objXMLHttpReq;
    }

    var pages = [];
    var tasks = "<P ALIGN='CENTER'><b>Победить на охоте</b></p><BR>- Перейти на <a href='map.php'><font color=black><b>Карту</b></font></a>;<br>- Напаcть на монстра.<br>";
    var ReqSend = createXMLHttpReq();


    function print_tut_page() {
        var p = cur;

        document.getElementById("r_arrow").style.display = "none";
        document.getElementById("l_arrow").style.display = "none";
        document.getElementById("button").style.display = "none";

        hide_arrow_by_flash100();
        hide_arrow_by_flash200();

        if (p < pcnt) {
            document.getElementById("r_arrow").style.display = "";
            show_arrow_by_flash100();
        }
        if (p > 1) document.getElementById("l_arrow").style.display = "";
        if (p === pcnt) {
            document.getElementById("button").style.display = "";
            show_arrow_by_flash200();
        }

        document.getElementById("tut_text").innerHTML = "<center><font color=black>" + pages[p] + "</font></center>";
    }

    function TutGoNext(a) {
        cur += a;
        print_tut_page();
    }

    function TutPress() {
        if (part == 1) {
            part = 2;
            cur = 1;
            pcnt = task_pcnt;
            pages = task_pages_data;
            print_tut_page();

            ReqSend.open("GET", "home.php?update_tut=0", true);
            ReqSend.onreadystatechange = null;
            ReqSend.send(null);

        } else {
            TutShowTasks();
        }
    }

    function TutShowTasks() {
        hide_arrow_by_flash100();
        hide_arrow_by_flash200();
        if (typeof show_arrow_by_flash1010 == 'function') show_arrow_by_flash1010();
        part = 3;
        cur = 1;
        pcnt = task_pcnt;
        pages = task_pages_data;

        document.getElementById("tut_first_screen").style.display = "none";
        document.getElementById("tut_second_screen").style.display = "";

        document.getElementById("tut_text2").innerHTML = "<font color=black>" + tasks + "</font>";
    }

    function TutBack() {
        if (typeof hide_arrow_by_flash1010 == 'function') hide_arrow_by_flash1010();
        part = 2;
        cur = 1;
        document.getElementById("tut_second_screen").style.display = "none";
        document.getElementById("tut_first_screen").style.display = "";
        print_tut_page();
    }

    function show_arrow_by_flash1010() {
        document.getElementById("arrows_up1010").style.display = "block";
    }

    function hide_arrow_by_flash1010() {
        document.getElementById("arrows_up1010").style.display = "none";
    }

    var no_android_scaling = true;
    var img_ver = '';

    var cur_view = 1;

    var fon_name = Array("https://dcdn.heroeswm.ru/i/home_im/bg.jpg" + img_ver, "https://dcdn1.heroeswm.ru/i/home_im/bg2.jpg" + img_ver);

    var area_width = Array();
    var area_height = Array();
    var area_max_width = Array();
    var area_max_height = Array();
    var area_offset_top = Array();
    var area_offset_left = Array();
    var area_view_width = Array();
    var area_view_height = Array();
    var area_view_height_d = Array();

    area_width[0] = 3440;
    area_height[0] = 1440;
    area_max_width[0] = 3440;
    area_max_height[0] = 1320;
    area_offset_top[0] = 0;
    area_offset_left[0] = 0;
    area_view_width[0] = 1566;
    area_view_height_d[0] = 632;

    var area_build_width = 256;
    var area_build_height = 256;

    var area_buildings = Array();


    area_width[1] = 1440;
    area_height[1] = 3440;
    area_max_width[1] = 1320;
    area_max_height[1] = 3440;
    area_offset_top[1] = 0;
    area_offset_left[1] = 0;
    area_view_width[1] = 632;
    area_view_height[1] = 1866;

    is_tutorial = 1;

    var tutor_width = 320;
    var tutor_height = 160;

    function scale_home_area() {
        area_view_height[0] = area_view_height_d[0];
        area_offset_top[0] = 0;
        area_offset_left[0] = -30;
        if (window.innerHeight > window.innerWidth) {
            cur_view = 1;
        } else {
            cur_view = 0;
            area_offset_left[0] = -30;
            if (is_tutorial) area_offset_top[0] = 170;
            area_view_height[0] += area_offset_top[0];
        }
        ;


        var area_div = document.getElementById('area');
        if ((typeof mobile_data !== 'undefined') && (mobile_data.width)) {
            area_div.style.width = (mobile_data.width - mobile_data.margin_left) + 'px';
            area_div.style.height = (mobile_data.height - mobile_data.margin_top) + 'px';
            var area_mobile = true;
        } else {
            var area_mobile = false;
            area_div.style.width = '100%';
            area_div.style.left = '0';
            area_div.style.height = (window.innerHeight - area_div.offsetTop) + 'px';
        }
        ;

        var width = area_div.offsetWidth;
        var rwidth = width;
        if (!area_mobile) {
            width = Math.min(width, 970);
        }
        var height = area_div.offsetHeight;
        var cur_tutor_height = 0;
        if (is_tutorial) {
            var area_cur_width = width;

            var div_tutor = document.getElementById('tutorial');
            if ((cur_view == 1) && (area_mobile)) {
                var tutor_scale = area_cur_width / tutor_width;
            } else {
                var tutor_scale = area_cur_width / tutor_width * 0.45;
            }
            ;
            var tr = 'scaleX( ' + tutor_scale + ' ) scaleY(' + tutor_scale + ')';
            if (div_tutor) {
                div_tutor.style['-moz-transform'] = tr;
                div_tutor.style['-o-transform'] = tr;
                div_tutor.style['-ms-transform'] = tr;
                div_tutor.style['-webkit-transform'] = tr;
                div_tutor.style['transform'] = tr;
                div_tutor.style['transform-origin'] = '0 0';
            }

            if ((cur_view == 1) && (area_mobile)) {
                cur_tutor_height = tutor_height * tutor_scale;
                height -= cur_tutor_height;
            }
            ;
            var sc0 = Math.min(height / area_view_height[0], width / area_view_width[0]);
            var sc1 = Math.min(height / area_view_height[1], width / area_view_width[1]);
            if (sc0 > sc1) {
                cur_view = 0;
            }
            ;
//  area_offset_top[cur_view] = 160;
//  if (cur_view == 1)&&
        }
        ;

        area_background_img.src = fon_name[cur_view];

        var wd = width / area_view_width[cur_view];
        var hd = height / area_view_height[cur_view];
        if (wd < hd) {
            var scale = wd;
        } else {
            var scale = hd;
        }
        ;

        var area_bg = document.getElementById('area_bg');
        var bg_width = area_width[cur_view] * scale;
        area_bg.width = Math.round(bg_width);
        var bg_height = area_height[cur_view] * scale;
        area_bg.height = Math.round(bg_height);

        var offset_div = document.getElementById('area_offset');
        var bg_top = height / 2 - bg_height / 2 + cur_tutor_height + area_offset_top[cur_view] * scale;
        if ((bg_top > 0) && (!area_mobile)) bg_top = 0;
        var bg_left = rwidth / 2 - bg_width / 2 - area_offset_left[cur_view] * scale;

        offset_div.style.top = bg_top;
        offset_div.style.left = bg_left;

        if (div_tutor) {
            if (!area_mobile) div_tutor.style.left = bg_left + Math.floor(area_build_width * scale * 3) + 'px'; else div_tutor.style.left = 0;
        }


        for (i in area_buildings) {

            var div = document.getElementById('area_building_id' + i)

            var div_img = document.getElementById('area_building_div_img' + i)
            var img = document.getElementById('area_building_img' + i)
            var img_width = Math.round(area_build_width * scale);
            var img_height = Math.round(area_build_height * scale);
            let isMapBut = area_buildings[i].map_button;
            img.width = isMapBut ? img_width / 2 : img_width;
            img.height = isMapBut ? img_height / 2 : img_height;
            var div_hint = document.getElementById('area_hint' + i);
            if (!isMapBut) {
                var div_header = document.getElementById('area_header' + i);
                var tr = 'scaleX( ' + scale + ' ) scaleY(' + scale + ')';
                div_hint.style['-moz-transform'] = tr;
                div_hint.style['-o-transform'] = tr;
                div_hint.style['-ms-transform'] = tr;
                div_hint.style['-webkit-transform'] = tr;
                div_hint.style['transform'] = tr;
                div_hint.style.left = Math.round(img_width / 2 - div_header.offsetWidth / 2 * scale) + 'px';
                div_hint.style.top = Math.round(img_height);
            }

            var x = area_width[cur_view] / 2 * scale + area_build_width * area_buildings[i]['x' + cur_view] * scale / 100;
            var y = area_height[cur_view] / 2 * scale + area_build_height * area_buildings[i]['y' + cur_view] * scale / 100;
            div.style.left = x + 'px';
            div.style.top = y + 'px';
            if (area_buildings[i]['xp']) {
                div_img.style.left = area_buildings[i]['xp'] * scale;
            }


        }
        ;

        div_top = document.getElementById('area_top_gradient');
        div_bottom = document.getElementById('area_bottom_gradient');
        if ((bg_top > 0) && (document.getElementById('android_container')) && (cur_view == 0)) {
            var gr_height = 200 * scale;
            div_top.style.height = gr_height + 'px';
            div_top.style.top = Math.floor(bg_top) + 'px';
            div_bottom.style.height = gr_height + 'px';
            div_bottom.style.top = Math.ceil(bg_top + bg_height - gr_height) + 'px';
            div_top.style.display = '';
            div_bottom.style.display = '';
        } else {
            div_top.style.display = 'none';
            div_bottom.style.display = 'none';
        }
        ;

        div_left = document.getElementById('area_left_gradient');
        if ((bg_left > 0) && (document.getElementById('android_container')) && (cur_view == 1)) {
            var gr_width = 200 * scale;
            div_left.style.width = Math.ceil(bg_width + 1) + 'px';
            div_left.style.left = Math.floor(bg_left) + 'px';
            div_left.style.display = '';
        } else {
            div_left.style.display = 'none';
        }
        ;

    };

    function prepare_area() {
        document.querySelector("body > center").parentNode.removeChild(document.querySelector("body > center"));
        document.querySelector("#main_top_table").parentNode.removeChild(document.querySelector("#main_top_table"));
        document.querySelector("body").insertAdjacentHTML("afterbegin", getToolBar());
        document.querySelector("body").insertAdjacentHTML("beforeend", change);
        var area_div = document.getElementById('area');
        var width = area_div.offsetWidth;
        var height = area_div.offsetHeight;
        var wd = width / area_view_width[cur_view];
        var hd = height / area_view_height[cur_view];
        if (wd < hd) {
            var scale = wd;
        } else {
            var scale = hd;
        }
        ;
        scale = Math.min(scale, 1);
        if (document.getElementById('android_container')) document.body.style.backgroundColor = "black";

        var offset_div = document.createElement("div");
        offset_div.id = "area_offset";
        offset_div.style.position = "absolute";
        area_div.appendChild(offset_div);

        var div = document.createElement("div");
        offset_div.appendChild(div);

        area_background_img = document.createElement("img");
        area_background_img.src = fon_name[cur_view];
        area_background_img.id = "area_bg";
        area_background_img.className = 'area_img';

        div.appendChild(area_background_img);

        div.style['z-index'] = 0;
        div.style.position = "absolute";
        div.style.left = 0;
        div.style.top = 0;

        for (i in area_buildings) {
            let div = document.createElement("div");
            div.id = 'area_building_id' + i;
            offset_div.appendChild(div);
            let isMapBut = area_buildings[i].map_button;

            var div_img = document.createElement("div");
            div_img.id = 'area_building_div_img' + i;
            div_img.link = area_buildings[i].link;
            div.appendChild(div_img);
            var img = document.createElement("img");
            img.className = 'area_img';
            img.src = area_buildings[i]['image'] + "?ver=" + img_ver;
            img.id = "area_building_img" + i;
            if (!isMapBut) {
                var div_hint = document.createElement("div");
                var div_hint2 = document.createElement("div");
                div_hint2.className = 'area_header';
                div_hint2.id = 'area_header' + i;
                div_hint.style.position = 'absolute';
                div.appendChild(div_hint);
                div_hint.appendChild(div_hint2);
                div_hint2.innerHTML = area_buildings[i].header;
                div_hint.id = "area_hint" + i;
                div_hint.link = area_buildings[i].link;
                div_hint.addEventListener("mouseup", g_home_goto_link);
                div_hint.addEventListener("touchdown", g_home_goto_link);
            }

            div_img.addEventListener("mouseup", g_home_goto_link);
            div_img.addEventListener("touchdown", g_home_goto_link);




            div_img.style.position = "absolute";
            div_img.appendChild(img);
            div.style['z-index'] = i + 1;
            div.style.position = "absolute";

            div.className = 'building';

            if (area_buildings[i]['arrow_code']) {
                var div_arrow = document.createElement("div");
                div_arrow.innerHTML = area_buildings[i]['arrow_code'];
                div_img.appendChild(div_arrow);
            }

        }

        var div2 = document.createElement("div");
        div2.style.width = '100%';
        div2.style.position = 'absolute';
        div2.style['background-image'] = "linear-gradient(to top, rgba(1, 1, 1, 0), rgba(0, 0, 0, 1))";
        div2.id = "area_top_gradient";
        div2.style.display = 'none';
        area_div.appendChild(div2);


        var div2 = document.createElement("div");
        div2.style.width = '100%';
        div2.style.display = 'none';
        div2.style.position = 'absolute';
        div2.style['background-image'] = "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(1, 1, 1, 0))";
        div2.id = "area_bottom_gradient";
        area_div.appendChild(div2);


        var div2 = document.createElement("div");
        div2.style.height = '100%';
        div2.style.position = 'absolute';
        div2.style['background-image'] = "linear-gradient(to right,rgba(0, 0, 0, 1), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))";
        div2.id = "area_left_gradient";
        div2.style.display = 'none';
        area_div.appendChild(div2);


        scale_home_area();
    }

    function g_home_goto_link() {
        if (this.link) {
            window.open(this.link, "_self");
        }
    }

    if (typeof window.onresize !== 'function') {
        window.onresize = function () {
            if (!document.getElementById('android_container')) scale_home_area();
        };
    }

    let gender = JSON.parse(localStorage.getItem('gender'));
    if (gender == null) {
        getGender()
    } else {
        let kukla = "kukla" + document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td > center > img").src.match(/r(\d{1,3})/)[1] + gender;
        setAreaBuildings(kukla);
        prepare_area();
    }

    function getGender() {
        doGet(`https://${location.host}/pl_info.php?id=${getCookie("pl_id")}`, processPlInfoResponse);
    }

    function doGet(url, callback) {
        let http = new XMLHttpRequest();
        http.open("GET", url, true); // false for synchronous request
        http.overrideMimeType("text/xml; charset=windows-1251");
        http.onreadystatechange = function () {//Call a function when the state changes
            if (http.readyState === 4 && http.status === 200) {
                return callback(new DOMParser().parseFromString(http.responseText, "text/html"));
            }
        };
        http.send(null);

    }

    function processPlInfoResponse(docc) {
        let gender = /male/.test(docc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > img").src) ? "" : "w";
        localStorage.setItem('gender', JSON.stringify(gender));
        let kukla = "kukla" + document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td > center > img").src.match(/r(\d{1,3})/)[1] + gender;
        setAreaBuildings(kukla);
        prepare_area();
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setAreaBuildings(kukla) {
        area_buildings = Array(
            {
                id: 'castle',
                link: 'castle.php',
                image: 'https://dcdn1.heroeswm.ru/i/home_im/castle.png',
                x0: '-33',
                y0: '-166',
                header: 'Замок',
                x1: '-29',
                y1: '-235',
            },
            {
                id: 'army',
                link: 'army.php',
                image: 'https://dcdn2.heroeswm.ru/i/home_im/army.png',
                x0: '-99',
                y0: '-100',
                header: 'Армия',
                x1: '-182',
                y1: '-183',
            },
            {
                id: 'arena',
                link: 'bselect.php',
                image: 'https://dcdn3.heroeswm.ru/i/home_im/arena.png',
                x0: '-167',
                y0: '-55',
                header: 'Битвы',
                x1: '-181',
                y1: '-28',
            },
            {
                id: 'inventory',
                link: 'inventory.php',
                image: 'https://dcdn1.heroeswm.ru/i/home_im/inventory.png',
                x0: '198',
                y0: '-97',
                header: 'Инвентарь',
                x1: '39',
                y1: '245',
            },
            {
                id: 'home',
                link: 'home.php?info',
                image: `https://dcdn.heroeswm.ru/i/kukla_png/${kukla}.png`,
                x0: '4',
                y0: '-73',
                header: 'Персонаж',
                xp: '30',
                x1: '-51',
                y1: '-78',
            },
            {
                id: 'map',
                link: 'map.php',
                image: 'https://dcdn1.heroeswm.ru/i/home_im/map.png',
                x0: '-9',
                y0: '2',
                header: 'Карта',
                x1: '57',
                y1: '50',
                arrow_code: '<div class="ArrowTutorialHG ArrowTutorialHGToDown2" id="arrows_up1010" style="display:none;"></div>',
            },
            {
                id: 'market',
                link: 'auction.php',
                image: 'https://dcdn1.heroeswm.ru/i/home_im/market.png',
                x0: '110',
                y0: '-10',
                header: 'Рынок',
                x1: '-122',
                y1: '147',
            },
            {
                id: 'tavern',
                link: 'tavern.php',
                image: 'https://dcdn.heroeswm.ru/i/home_im/tavern.png',
                x0: '-303',
                y0: '-51',
                header: 'Таверна',
                x1: '-45',
                y1: '-371',
            },
            {
                id: 'shop',
                link: 'shop.php',
                image: 'https://dcdn2.heroeswm.ru/i/home_im/shop.png',
                x0: '79',
                y0: '-110',
                header: 'Магазин',
                x1: '77',
                y1: '-88',
            },
            {
                id: 'task_button',
                link: 'task_guild.php',
                map_button: true,
                image: 'https://dcdn.heroeswm.ru/i/combat/map/btn_guildGuard.png?ver=6',
                x0: '-400',
                y0: '-230',
                header: 'ГС',
                x1: '77',
                y1: '-88',
            },
            {
                id: 'leader_button',
                link: 'leader_guild.php',
                map_button: true,
                image: 'https://dcdn.heroeswm.ru/i/combat/map/btn_leader.png?ver=6',
                x0: '-400',
                y0: '-170',
                header: 'ГС',
                x1: '77',
                y1: '-88',
            },
            {
                id: 'camp_button',
                link: 'campaign_list.php',
                map_button: true,
                image: 'https://dcdn2.heroeswm.ru/i/combat/map/btn_campaigns.png?ver=6',
                x0: '-400',
                y0: '-110',
                header: 'ГС',
                x1: '77',
                y1: '-88',
            }
        );
    }

    function getToolBar() {
        return `<style>
.txt{FONT-SIZE:1em;COLOR:#592C08;FONT-FAMILY:verdana,geneva,arial cyr}.table{font-size:1em;}.txtr{FONT-SIZE:1em;COLOR:#592C08;FONT-FAMILY:verdana,geneva,arial cyr}a{COLOR:#592C08;FONT-FAMILY:verdana,geneva,arial cyr;text-decoration-skip-ink: none;}.pi{FONT-SIZE:1em;COLOR:#592C08;FONT-FAMILY:verdana,geneva,arial cyr;text-decoration:none}td{FONT-SIZE:1em;COLOR:#592C08;FONT-FAMILY:verdana,geneva,arial cyr}.wb{border-collapse:collapse;border:1px #5D413A solid;font-size:1em;}.wb2{border-collapse:collapse;border:1px #5D413A solid;BACKGROUND-COLOR:#E1E2FF;font-size:1em;}.wbcapt{border-collapse:collapse;border:1px #5D413A solid;BACKGROUND-COLOR:#E3BFBF;font-size:1em;}.wblight2{border-collapse:collapse;border:1px #5D413A solid;BACKGROUND-COLOR:#FFFFFF}.wblight{border-collapse:collapse;border:1px #5D413A solid;BACKGROUND-COLOR:#F5F3EA;font-size:1em;}.wbwhite{border-collapse:collapse;border:1px #5D413A solid;BACKGROUND-COLOR:#FFFFFF;font-size:1em;}.exs{border-collapse:collapse;border:1px #000000 dashed}.cxs{border-collapse:separate;border:1px #000099 dashed}.rb{border-collapse:collapse;border:1px #CDCD00 solid}.btn{FONT-SIZE:1em;COLOR:#000000;FONT-FAMILY:Verdana,Arial,Helvetica,sans-serif;font-weight:bold;BACKGROUND-COLOR:#e0eee0;border:1px double #000000}.wbtn{FONT-SIZE:1em;COLOR:#000000;FONT-FAMILY:Verdana,Arial,Helvetica,sans-serif;font-weight:bold;BACKGROUND-COLOR:#FFFCF4;border:1px double #000000;HEIGHT:22px}.cbtn{FONT-SIZE:1em;COLOR:#000000;FONT-FAMILY:Verdana,Arial,Helvetica,sans-serif;font-weight:bold;BACKGROUND-COLOR:#E3BFBF;border:1px double #000000;HEIGHT:22px}.btkey{display:block;text-align:center;PADDING-RIGHT:1px;PADDING-LEFT:1px;FONT-SIZE:1em;FONT-FAMILY:verdana,sans-serif,arial;font-weight:bold;width:20;CURSOR:hand;border:1px solid #000000;COLOR:#000000;BACKGROUND-COLOR:#FFFCF4}table.table3{border:1px solid #658087;border-collapse:collapse;background-color:#E4EBEC;font-size:1em;}table.table3 th{padding:1px 5px 1px 2px;text-align:left;background-color:#7FA0A9;border-bottom:1px solid #658087;color:#FFFFFF;font-family:Tahoma;font-size:1em}table.table3 td{padding:1px 2px 1px 2px;font-size:1em;}table.table3 tr.second,table.table3 td.second{background-color:#FFFFFF}table.table3 td.third{background-color:#FAFCFC}table.table3 th a:link,table.table3 th a:visited{color:#FFFFFF;text-decoration:underline}table.table3 th.checkbox,table.table3 td.checkbox{width:30px;padding-left:2px;padding-right:2px}table.forum td{background-image:url('../i/white.gif');background-position:right top;background-repeat:repeat-y}table.forum th{border-top:1px solid #658087}table.forum.medium_padding th{padding:2px 1px 1px 4px!important;padding-left:2px!important}table.forum.medium_padding td{padding:1px 2px 2px 4px!important;padding-left:2px!important}table.forum td{vertical-align:top}table.forum td.message{color:#000000;padding:2px;font-size:1em}table td.tavern{background-image:url('../i/taverna_bkg.jpg');background-position:center center;background-repeat:no-repeat}table td.twhite{border-collapse:collapse;border:1px #5D413A solid;background-image:url('../i/twhite.png');background-position:center center;background-repeat:repeat}table td.tlight{border-collapse:collapse;border:1px #5D413A solid;background-image:url('../i/tlight.png');background-position:center center;background-repeat:repeat}table.forum tr.second{background-color:#F3F6F6}table.forum tr.message_footer td{padding:2px 2px 2px 2px;background-color:#D1DDDE;color:#8F9FA2;border-top:1px solid #FFFFFF}table.forum tr.message_footer td.second{background-color:#DCE5E6;color:#94A3A6}table.c_darker td,table.c_darker td a:link,table.c_darker td a:visited{color:#344346;font-size:1em}table.c_darker td,table.c_darkers td a:link,table.c_darkers td a:visited{color:#344346;font-size:1em}.smsmark a:link{color:#CF5D60;text-decoration:underline}.smsmark a:visited{color:#CF5D60;text-decoration:underline}.smsmark a:hover{color:#CF5D60;text-decoration:underline}.fft{font-family:Tahoma,Verdana,Arial,Verdana,Arial,Helvetica,Tahoma,Verdana,sans-serif;font-size:1em;text-decoration:none;color:#716E44}.forumt{font-family:Tahoma,Verdana,Arial,Helvetica,Tahoma,Verdana,sans-serif;text-decoration:underline;color:#333333;font-size:1em;FONT-WEIGHT:bold}.fsm{font-family:Tahoma,Verdana,Arial,Helvetica,Tahoma,Verdana,sans-serif;text-decoration:none;color:#222222;font-size:1em} #breadcrumbs{margin-left:0px;margin-top:0px;margin-bottom:0px;text-align:left} #breadcrumbs ul{margin:0px;padding:0px;list-style-type:none}#breadcrumbs a{color:#592C08}#breadcrumbs hr{margin:2px;border:none;border-top:1px solid #FFFFFF;border-bottom:1px solid #000000} #breadcrumbs>ul>li{float:left;margin-right:2px;padding-bottom:1px} #breadcrumbs li.sep{color:inherit;padding-left:1px;padding-right:1px} #breadcrumbs li.subnav:hover ul{text-decoration:none;color:#990099;display:block;z-index: 100;} #breadcrumbs li.subnav:a{display:block;z-index: 100;} #breadcrumbs li.subnav:hover>a{text-decoration:none;color:#592C08;display:block;z-index: 100;} #breadcrumbs li ul{display:none;position:absolute;margin-top:1px;border:0px solid black;background:#6b6c6a}#breadcrumbs li ul li a.active:before{content:"> "}#breadcrumbs li ul li a.active{color:#ffd871}#breadcrumbs li ul li a{color:#ffd871;display:block;min-width:170px;width:170px;padding:1px 2px 1px 2px;text-decoration:none}#breadcrumbs li ul li a:hover{background-color:#757575;color:#FFFFFF}


.android_buttons_inside{
background:url('../i/mobile_view/bg_quickPanel.jpg');
}

.logo_lng0{
width: 100%;
min-height: 5em;
text-align: center;
background:url('../i/mobile_view/logo_lng0.png') no-repeat top center;
background-size: contain;
}

.logo_lng1{
width: 100%;
min-height: 5em;
text-align: center;
background:url('../i/mobile_view/logo_lng1.png') no-repeat top center;
background-size: contain;
}


.logo_lng_13_0{
width: 100%;
min-height: 5em;
text-align: center;
background:url('../i/top_13bd/mobile_view/logo_lng0.png') no-repeat top center;
background-size: contain;
}

.logo_lng_13_1{
width: 100%;
min-height: 5em;
text-align: center;
background:url('../i/top_13bd/mobile_view/logo_lng1.png') no-repeat top center;
background-size: contain;
}


.minus_btn_em{
width: -webkit-calc(100% - 3.3em);
width: calc(100% - 3.3em);
}

.menuBlockArea{
width: 100%!important;
height: 100%!important;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(255,255,255,.75);
display: none;
}

.menu {
width: 13em;
position: fixed;
top: 0;
left: -13em;
background:url('../i/mobile_view/bg_win_info_dark.png') #2c2a29;
padding: 0!important;
}

.menu_opened {
left: 0px;
transition: all .3s;

}

.menu_btns_container{
display: inline-block;
position: relative;
width: 95%;
height: -webkit-100%;
height: 100vh;
overflow-y: scroll;
margin: 0 auto;
}

.menu a{
width: 100%;
background:
url('../i/mobile_view/formFieldCorner_lt.png') no-repeat top left,
url('../i/mobile_view/formFieldCorner_rt.png') no-repeat top right,
url('../i/mobile_view/formFieldCorner_lb.png') no-repeat bottom left,
url('../i/mobile_view/formFieldCorner_rb.png') no-repeat bottom right,
#91682e;
background-size: contain;
display: block;
position: relative;
    margin: .2em 0;
    text-align: center;
    padding: .5em 0;
font-family: verdana,geneva,arial cyr;
font-size: 90%;
text-shadow: 0px 0px 3px rgba(0,0,0,.5);
color: #f0cf88;
    text-decoration: none;
}

.menuSeparator{
width: 100%;
padding-top: 1em;
}

.btn_menu{
width: 10vw;
height: 10vw;
position: absolute;
top: 0;
right: -10vw;
background:url('../i/mobile_view/btn_menu2.png') no-repeat;
background-size: contain;
}

.seal{
width: 100%;
height: 10em;
max-height: 100px;
background:url('../i/mobile_view/seal.png') no-repeat top center;
background-size: contain;
}

.copy{
width: 100%;
font-family: verdana,geneva,arial cyr, sans-serif;
font-weight: 400;
font-size: .7em;
color: #635b4d;
margin-bottom: 1em;
}

.PanelResources {
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
height: 5vh;
font-size: 4vh;
font-family: verdana,geneva,arial cyr;
font-weight: 400;
position: fixed;

color: #333;
background-color: rgba(255,255,255,.9);
overflow: auto;
overflow-y: hidden;
white-space: nowrap;

top: 0;
left: 0;
text-align: center;
display: inline-block;
}

.PanelResourcesDark {
border-top: 1px solid #aa8b56;
border-bottom: 1px solid #aa8b56;
background-color: #3e2318;
color: #f2e1b8;
}



.PanelsForScrollHiding{
    position: fixed;
    transition-duration: .5s;
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
    -o-transition-duration: .5s;
    -ms-transition-duration:  .5s;
}

.PanelsForScrollHiding.hidden{
    top: -60px;
}





.PanelBottomBlockArea_h{
width: 10vh;
position: fixed;
top: 0;
height: 100%;
left: 0;
background-color: rgba(255,255,255,.9);
display: block;
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
}



.android_panel_height_limit{
height: -webkit-calc((100% - 3.3em) / 6)!important;
height: calc((100% - 3.3em) / 6)!important;
width: auto;
}

.android_panel_width_limit{
width: -webkit-calc((100% - 3.3em) / 6)!important;
width: calc((100% - 3.3em) / 6)!important;
height: auto;
}



.PanelBottomBlockArea_v{
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
width: 100%;
position: fixed;
top: 0;
height: 10vw;
left: 0;
background-color: rgba(255,255,255,.9);
white-space: nowrap;
display: inline-block;
}


.PanelBottomNotification{
text-align: center;
position: absolute;
font-family: Arial,Helvetica Neue,Helvetica,sans-serif; 
font-weight: bold;
color: white;
z-index: 1;
border: 1px solid #000000;
box-shadow: 0 2px 2px 1px rgba(255,255,255,.6);
-webkit-box-shadow: 0px 2px 2px 1px rgba(255,255,255,.6);
-moz-box-shadow: 0px 2px 2px 1px rgba(255,255,255,.6);
box-shadow: 0px 2px 2px 1px rgba(255,255,255,.6);

background-color: #3e2318;
border: 1px solid #aa8b56;
color: #f2e1b8;
}

.PanelNot1{
right: 0;
top: 0;
}
.PanelNot2{
right: 0;
bottom: 10%;
}
.PanelNot3{
left: 0;
bottom: 10%;
}
.PanelNot4{
left: 0;
top: 0;
}


.PanelNotPic{
top: 50%!important;
left: 50%!important;
width: 70%!important;
height: 70%!important;

position: absolute;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
transform: translate(-50%, -50%);
}


.PanelBottomNotification_h{
border-radius: 4vh;
-webkit-border-radius: 4vh;
-moz-border-radius: 4vh;
width: 4vh;
height: 4vh;
font-size: 3vh;
line-height: 4vh;

}

.PanelBottomNotification_v{
border-radius: 4vw;
-webkit-border-radius: 4vw;
-moz-border-radius: 4vw;
width: 4vw;
height: 4vw;
font-size: 3vw;
line-height: 4vw;

}


@keyframes ArrowTutorial {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-moz-keyframes ArrowTutorial {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-webkit-keyframes ArrowTutorial {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-ms-keyframes ArrowTutorial {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}
@-o-keyframes ArrowTutorial {
    0% { background-position: 0 0; }
    50% { background-position: 0 75%; }
    100% { background-position: 0 0; }
}





.panel_img_link {
position: relative;
display: inherit;
width: 12.5%;
height: 12.5vw;
}

.panel_img_link_h img {
width: 100%;
height: auto;
}

.panel_img_link_v img {
width: auto;
height: 100%;
}

.panel_block{
display: block;
}

.panel_res_link {
position: relative;
display: inline-block;
width: auto;
height: 6.25vw;
}

.panel_res{
    display: inline-block;
    margin-left: 0.2em;
    top:-0.3em;
position: relative;
}

.panel_res_link img {
width: auto;
height: 100%;
}

.android_horiz_center img{
left: 50%;
-moz-transform: translate(-50%, 0);
-o-transform: translate(-50%, 0);
-ms-transform: translate(-50%, 0);
-webkit-transform: translate(-50%, 0);
transform: translate(-50%, 0);
}

.android_vert_center img{
top: 50%;
-moz-transform: translate(0, -50%);
-o-transform: translate(0, -50%);
-ms-transform: translate(0, -50%);
-webkit-transform: translate(0, -50%);
transform: translate(0, -50%);
}

.ArrowTutorial{
width: 100%;
max-width: 75px;
z-index: 900;
background: url('../i/mobile_view/ArrowTutorial.png') no-repeat top center;
background-size: contain;
position: absolute;
animation: ArrowTutorial 1s infinite;
-webkit-animation: ArrowTutorial 1s infinite;
-moz-animation: ArrowTutorial 1s infinite;
-o-animation: ArrowTutorial 1s infinite;
animation: ArrowTutorial 1s infinite;
}

.ArrowTutorial:before{
content: "";
padding-top: 120%;
float: left; 
}

.ArrowTutorial_army{
width: 100%;
max-width: 75px;
z-index: 900;
background: url('../i/mobile_view/ArrowTutorial.png') no-repeat top center;
background-size: contain;
position: absolute;
animation: ArrowTutorial 1s infinite;
-webkit-animation: ArrowTutorial 1s infinite;
-moz-animation: ArrowTutorial 1s infinite;
-o-animation: ArrowTutorial 1s infinite;
animation: ArrowTutorial 1s infinite;
}

.ArrowTutorial_army:before{
content: "";
padding-top: 120%;
float: left; 
}

.ArrowTutorialToUP{
    top: 50%;
left: 0%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(180deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(180deg);        /* FF */
    -o-transform: rotate(180deg);          /* Opera */
    -ms-transform: rotate(180deg);         /* IE9 */
    transform: rotate(180deg);             /* W3C compliant browsers */
}

.ArrowTutorialToLeft{
    top: -10%;
left: 60%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(90deg);        /* FF */
    -o-transform: rotate(90deg);          /* Opera */
    -ms-transform: rotate(90deg);         /* IE9 */
    transform: rotate(90deg);             /* W3C compliant browsers */
}

.ArrowTutorialToDown2{
    top: -80%;
left: 50%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.ArrowTutorialToLeft2{
    top: 55%;
left: 70%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(90deg);        /* FF */
    -o-transform: rotate(90deg);          /* Opera */
    -ms-transform: rotate(90deg);         /* IE9 */
    transform: rotate(90deg);             /* W3C compliant browsers */
}

.ArrowTutorialToRight2{
    top: 55%;
left: -70%;

-moz-transform: translate(-50%, -50%);
-o-transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
-webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: rotate(-90deg);     /* Chrome and other webkit browsers */
    -moz-transform: rotate(-90deg);        /* FF */
    -o-transform: rotate(-90deg);          /* Opera */
    -ms-transform: rotate(-90deg);         /* IE9 */
    transform: rotate(-90deg);             /* W3C compliant browsers */
}

.mobile_nav_links
{
font-size:1em;
color: black;
font-family: verdana,geneva,arial cyr!important;
}

.mobile_nav_links_a
{
 text-decoration:none;
}

.rs{margin-right:2px;}

.art_durability_hidden
{
   position: absolute; 
   top: 0px; 
   left: 0px; 
   background-color:rgba(255, 255, 255, 0.5); 
   color: black; 
   font-weight: bold; 
   z-index: 1;
   font-size: 90%;
   webkit-user-select: none; 
   -moz-user-select: none; 
   -ms-user-select: none; 
   user-select: none; 
   pointer-events: none;
}
</style>
<div class="PanelResources PanelResourcesDark" style="z-index: 1; position: absolute; width: 100%; top: 46.875px; height: 18.5423px; font-size: 14.8339px; left: 0px; margin-left: 0px; border-top: 1px solid rgb(170, 139, 86);" id="panel_resourses">

<div class="panel_res_link" style="height: 18.5423px;"><canvas id="heart" width="64" height="64" style="height: 18.5423px;"></canvas>
<script type="text/javascript">
var heart=100;
var max_heart=100;
var time_heart=900;
var heart_image1path = "https://dcdn.heroeswm.ru/i/heart_back.png";
var heart_image2path = "https://dcdn.heroeswm.ru/i/heart_in.png";
</script>
<script src="https://dcdn.heroeswm.ru/js/heart_mobile.js?v=1"></script>
</div>

<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn2.heroeswm.ru/i/r/gold.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res" id="res_gold">${gold}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn.heroeswm.ru/i/r/wood.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${wood}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn.heroeswm.ru/i/r/ore.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${ore}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn1.heroeswm.ru/i/r/mercury.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${mercury}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn1.heroeswm.ru/i/r/sulfur.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${sulfur}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn2.heroeswm.ru/i/r/crystals.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${crystals}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn1.heroeswm.ru/i/r/gems.png?v=3.23de65" draggable="false" border="0" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${gems}</div></div>
<div class="panel_res_link building" style="height: 18.5423px;"><img src="https://dcdn1.heroeswm.ru/i/r/diamonds.png?v=3.23de65" draggable="false" border="0" onclick="window.location.href='hwm_donate_page_new.php';" style="width: 18.5423px; height: 18.5423px;"><div class="panel_res">${diamonds ? diamonds.innerHTML : 0 }</div></div>


</div>



<div class="PanelBottomBlockArea_v" style="text-align: center; z-index: 2; width: 100%; height: 46.875px;" id="android_buttons_panel">
<div id="android_buttons_inside" class="android_buttons_inside" style="height: 100%;">
<div class="panel_img_link panel_img_link_v building" style="float: left; margin-left: 10%; width: 46.875px; height: 46.875px;">

<img src="https://dcdn3.heroeswm.ru/i/top/logo_ru_100.jpg?1" style="" draggable="false" border="0">


</div>

<div class="panel_img_link panel_img_link_v building" id="link_home" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://${location.host}/pl_info.php?id=${getCookie("pl_id")}">
<img src="https://dcdn1.heroeswm.ru/i/mobile_view/icons/_panelCharacter.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
<div class="panel_img_link panel_img_link_v building" id="link_map" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/map.php">
<img src="https://dcdn3.heroeswm.ru/i/mobile_view/icons/_panelMap.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
<div class="panel_img_link panel_img_link_v building" id="link_inventory" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/inventory.php">
<img src="https://dcdn2.heroeswm.ru/i/mobile_view/icons/_panelInventory.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
<div class="panel_img_link panel_img_link_v building" id="link_bselect" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/bselect.php">
<img src="https://dcdn2.heroeswm.ru/i/mobile_view/icons/_panelBattles.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
<div class="panel_img_link panel_img_link_v building" id="link_tavern" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/tavern.php">
<img src="https://dcdn2.heroeswm.ru/i/mobile_view/icons/_panelTavern.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
<div class="panel_img_link panel_img_link_v building" id="link_roulette" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/roulette.php">
<img src="https://dcdn3.heroeswm.ru/i/mobile_view/icons/_panelRoulette.png?v=3.23de65" draggable="false" border="0">
</div>
<div class="panel_img_link panel_img_link_v building" id="link_forum" style="display: inline-block; width: 46.875px; height: 46.875px;">
<a href="https://www.heroeswm.ru/forum.php">
<img src="https://dcdn3.heroeswm.ru/i/mobile_view/icons/_panelForum.png?v=3.23de65" draggable="false" border="0">
</a>
</div>
</div>
</div>`
    }
})(window);