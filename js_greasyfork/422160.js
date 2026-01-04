// ==UserScript==
// @name         MiniCRM Térkép Gomb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ProSec · Értékesítés > Térkép
// @author       Vacsati
// @match        https://r3.minicrm.hu/20941/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422160/MiniCRM%20T%C3%A9rk%C3%A9p%20Gomb.user.js
// @updateURL https://update.greasyfork.org/scripts/422160/MiniCRM%20T%C3%A9rk%C3%A9p%20Gomb.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('hashchange', hash_Check, false);
    window.addEventListener("load", hash_Check, false);
    function hash_Check(){
        //console.log('hash_Check');
        var uri = window.location.href.split('/');
        if(uri[4]=='#Project-23' || uri[4]=='#Project-39')button_Creator();
    }
    function button_Creator() {
        //https://r3.minicrm.hu/20941/#Project-23/28863 @match felold a #-nél
        //console.log('Project-23');
        var uri = window.location.href.split('/');
        var timer, max=20;
        var copy_Url = "https://www.prosec.hu/php/minicrm_terkep.php?q=form&pid="+uri[5];
        check_side_exist_timer();
        function check_side_exist(){
            if(document.getElementById('SidebarSimple')){
                //console.log('check_side_exist: ok');
                clearTimeout(timer);
                //console.log('check_side_exist_timer: stop');
                create_copy_button();
            }else{
                //console.log('check_side_exist: false');
                check_side_exist_timer();
            }
        }
        function check_side_exist_timer(){
            max--;
            //console.log('check_side_exist_timer', max);
            if(max>0){
                //console.log('check_side_exist_timer: start');
                timer = setTimeout(function(){check_side_exist();}, 1000);
            }
        }
        function check_copy_button(){
            if(document.getElementById('copy_container')){
                //console.log('check_copy_button: true');
            }else{
                //console.log('check_copy_button: false');
                clearTimeout(timer);
                max=20;
                check_side_exist_timer();
            }
        }
        function create_copy_button(){
            var sidebar = document.getElementById('SidebarSimple');
            var gomb = '<a href="'+copy_Url+'" target="_blank"><button type="button" class="btn btn-default btn-success btn-sm" style="min-width: 80px;;margin-bottom:4px;">Térképre</button></a>';
			//var gomb = '<a href="'+copy_Url+'" target="_blank"><button type="button" class="btn btn-default btn-success btn-sm material-icons" style="margin: 0 4px 4px 0;padding:2px;line-height:14px;font-size:14px;">map</button></a>';
            //console.log('create_copy_button', sidebar);
            if(document.getElementById('copy_container')){
                var copy_container = document.getElementById('copy_container');
                copy_container.innerHTML+= '<br>' + gomb;
            }else{
                var copy_container = document.createElement('div');
                copy_container.id = 'copy_container';
                copy_container.style.cssText = 'position:absolute;top:66px;right:5px;z-index:1000';
                copy_container.innerHTML = gomb;
                sidebar.insertBefore(copy_container, sidebar.firstChild);
                //console.log('copy_container', copy_container);
                setTimeout(function(){check_copy_button();}, 1000);
            }
        }
        //console.log('Ready');
    }
})();