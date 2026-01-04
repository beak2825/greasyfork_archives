// ==UserScript==
// @name         MIRU
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @include     http://*.*
// @include     https://*.*
// @namespace https://greasyfork.org/users/205309
// @downloadURL https://update.greasyfork.org/scripts/371238/MIRU.user.js
// @updateURL https://update.greasyfork.org/scripts/371238/MIRU.meta.js
// ==/UserScript==

(function(){

    function UIScript(fn) {
        var script = document.createElement('script');
        script.setAttribute("type", "application/javascript");
        script.textContent = '(' + fn + ')();';
        document.body.appendChild(script);
        //document.body.removeChild(script);
    }

    UIScript(function () {
        // RIGHT MENU START
        console.log('START');
        var ui_menubar = document.getElementsByTagName('body')[0];
        ui_menubar.style.position ='relative';
        ui_menubar.style.maxWidth ='500px';
        ui_menubar.style.margin ='0 auto';

        var UI_CONTROLS = document.createElement('div');

        UI_CONTROLS.className = 'ui_menucontainer';
        UI_CONTROLS.style.width = '42px';
        UI_CONTROLS.style.minHeight = '42px';
        UI_CONTROLS.style.position = 'absolute';
        UI_CONTROLS.style.top = '45px';
        UI_CONTROLS.style.right = '-50px';
        UI_CONTROLS.style.zIndex = '1';
        var icon = 'https://bn1305files.storage.live.com/y4mHPS1AOb6Ob80kHH1Aj4kP1cmwO9WF1Ro-_EPX6ZQL99N4gdoqxBRgDE-mgCoRfWrr-W0xDoDkc5-AM9dayGcYMhNWXMeyLxltOvUfzhJiBFUAmNIhMO5zGnEJqFXldZvX2PH4X7npU1iRB77aisePRpXZj79ZEnCza9YAF504J3VZSLEquenNxNxlgk0NsTdzGoA8ucGz0uuRWsIdcWHag/ongoing_entry_border.png?psid=1&width=44&height=88';
        UI_CONTROLS.style.backgroundImage = 'url(' + icon + ')';
        UI_CONTROLS.style.backgroundPosition = '0 0';
        UI_CONTROLS.style.backgroundSize = '44px';
        ui_menubar.appendChild(UI_CONTROLS);

        var url = window.location.href;
        if(url == 'http://miru.mobi/new_okrestnosti.php?'){
            var new_okrestnosti = document.getElementsByTagName('a');

            var MOBS_LIST = [];
            new_okrestnosti = [].slice.call(new_okrestnosti); //I have converted the HTML Collection an array
            new_okrestnosti.forEach(function(v,i,a) {
                if(v.innerHTML == "Атаковать"){
                    MOBS_LIST.push(v);
                }else{
                    window.location.href = 'http://miru.mobi/new_okrestnosti.php?';
                }
            });
            console.log(MOBS_LIST[0].href);
            window.location.href = MOBS_LIST[0].href;
        }

        if(url == 'http://miru.mobi/new_ataka.php'){

        }

        if(url == 'http://miru.mobi/new_win.php'){
            window.location.href = 'http://miru.mobi/new_okrestnosti.php?';
        }


        console.log('END');
    });

    (function(){


        var new_ataka = document.getElementsByTagName('a');
        var SKILS_LIST = [];
        new_ataka = [].slice.call(new_ataka); //I have converted the HTML Collection an array
        new_ataka.forEach(function(v,i,a) {

            var MP = document.getElementsByTagName('img');

            var IMG_LIST = [];
            MP = [].slice.call(MP); //I have converted the HTML Collection an array
            MP.forEach(function(v,i,a) {
                if(v.currentSrc == "http://miru.mobi/mp.php?"){
                    var MP_STRING = v.alt;
                    var MP_STRINGs = MP_STRING.split('MP: ')[1];
                    var MP_REAL = MP_STRINGs.split('/')[0];
                    var MP_Number = Number(MP_REAL);
                    localStorage.setItem('MP', MP_Number);
                }
            });

            var MP_Number = localStorage.getItem('MP');
            if(MP_Number < 40){
                if(v.innerHTML == "Ударить оружием"){
                    SKILS_LIST.push(v);
                    //Power Strike
                    //;window.location.href = 'http://miru.mobi/new_okrestnosti.php?';
                }
            }else{
                if(v.innerHTML == "Power Strike"){
                    SKILS_LIST.push(v);
                }
            }
        });

        window.location.href = SKILS_LIST[0].href;
        //console.log(SKILS_LIST);
        //window.location.href = 'http://miru.mobi/new_ataka.php';
    })(); 
})(); 