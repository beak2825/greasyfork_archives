// ==UserScript==
// @name         VacsatiCMS
// @namespace    https://cms.vacsati.hu/
// @version      0.2
// @description  Gyorsgomb a tartalom szerkesztőhöz
// @author       vacsati
// @match        https://www.prosec.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409931/VacsatiCMS.user.js
// @updateURL https://update.greasyfork.org/scripts/409931/VacsatiCMS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('hashchange', hash_Check, false);
    window.addEventListener("load", hash_Check, false);
    function hash_Check(){
        if(window.self === window.top)button_Creator();
    }
    function button_Creator() {
        var timer, max=20;
        check_side_exist_timer();
        function check_side_exist(){
            if(document.getElementsByTagName("BODY")[0]){
                clearTimeout(timer);
                create_copy_button();
            }else{
                check_side_exist_timer();
            }
        }
        function check_side_exist_timer(){
            max--;
            if(max>0){
                timer = setTimeout(function(){check_side_exist();}, 1000);
            }
        }
        function check_copy_button(){
            if(document.getElementById('copy_container')){
            }else{
                clearTimeout(timer);
                max=20;
                check_side_exist_timer();
            }
        }
        function create_copy_button(){
            var sidebar = document.getElementsByTagName("BODY")[0];
            var gomb = '<button type="button" onclick="var uri = window.location.href.split(\'://\');window.location=\'https://cms.vacsati.hu/\'+uri[1];" style="font-size:24px;width: 35px;height: 35px;border:none;background:black;border-radius:4px;display:block;padding: 0;cursor: pointer;">✏️</button>';
            if(document.getElementById('copy_container')){
                var copy_container = document.getElementById('copy_container');
                copy_container.innerHTML+= '<br>' + gomb;
            }else{
                var copy_container = document.createElement('div');
                copy_container.id = 'copy_container';
                copy_container.style.cssText = 'position: fixed;top: 4px;right: 4px;z-index:99999';
                copy_container.innerHTML = gomb;
                sidebar.appendChild(copy_container, sidebar.firstChild);
                setTimeout(function(){check_copy_button();}, 1000);
            }
        }
    }
})();