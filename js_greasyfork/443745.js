// ==UserScript==
// @name         MiniCRM Vállalkozási szerződés kitöltő
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ProSec · Értékesítés > Vállalkozási szerződés
// @author       Vacsati
// @match        https://r3.minicrm.hu/20941/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443745/MiniCRM%20V%C3%A1llalkoz%C3%A1si%20szerz%C5%91d%C3%A9s%20kit%C3%B6lt%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/443745/MiniCRM%20V%C3%A1llalkoz%C3%A1si%20szerz%C5%91d%C3%A9s%20kit%C3%B6lt%C5%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('hashchange', hash_Check, false);
    window.addEventListener("load", hash_Check, false);
    function hash_Check(){
        //console.log('hash_Check');
        var uri = window.location.href.split('/');
        if(uri[4]=='#Project-23')button_Creator();
    }
    function button_Creator() {
        //https://r3.minicrm.hu/20941/#Project-23/28863 @match felold a #-nél
        //console.log('Project-23');
        var uri = window.location.href.split('/');
        var timer, max=20;
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
            var gomb = '<button id="vallalkoz" type="button" class="btn btn-default btn-success btn-sm" style="min-width: 80px;margin-bottom:4px;">VállSzerz</button>';
			var copy_container=null;
            if(document.getElementById('copy_container')){
                copy_container = document.getElementById('copy_container');
                copy_container.innerHTML+= '<br>' + gomb;
            }else{
                copy_container = document.createElement('div');
                copy_container.id = 'copy_container';
                copy_container.style.cssText = 'position:absolute;top:66px;right:5px;z-index:1000';
                copy_container.innerHTML = gomb;
                sidebar.insertBefore(copy_container, sidebar.firstChild);
                //console.log('copy_container', copy_container);
                setTimeout(function(){check_copy_button();}, 1000);
            }
			$('#vallalkoz').click(function(){
				var pid = window.location.href.split('/')[5];
				var prosecurl = "https://www.prosec.hu/php/minicrm_vallalkozasi.php?q=import&pid="+pid;
				window.location=prosecurl;
				/*
				$('body').css({'overflow':'hidden','max-height':'100vh'}).append('<div id="vallakozasi"></div>');
				$('#vallakozasi').css({position:'fixed',top:0,left:0,bottom:0,right:0,display:'flex',background:'rgba(0,0,0,0.9)','z-index':1000}).append('<iframe id="prosec"></iframe>').append('<div id="close">X</div>');
				$('#close').css({position:'absolute',top:'10px',right:'10px',cursor:'pointer',display:'flex',background:'rgba(200,0,0,0.9)',color:'white',padding:'3px 6px','border-radius':'6px'}).click(function(){
					$('#vallakozasi').remove();$('body').css({'overflow-y':'scroll','max-height':'unset'})
				});
				$('#prosec').css({margin:'auto',border:'none','border-radius': '10px',width:'700px',height:'500px',background:'rgba(255,255,255,.6)'}).attr('src', prosecurl);
				*/
			});
        }
        //console.log('Ready');
    }
})();