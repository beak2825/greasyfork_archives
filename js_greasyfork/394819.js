// ==UserScript==
// @name         知网CNKI小助手
// @version      0.3
// @description  CNKI tools.
// @author       leftjie
// @match        *://kns.cnki.net/KXReader/Detail?*
// @match        *://new.oversea.cnki.net/KXReader/Detail?*
// @match        *://new.big5.oversea.cnki.net/KXReader/Detail?*
// @match        *://new.gb.oversea.cnki.net/KXReader/Detail?*
// @match        *://*/KXReader/Detail?*
// @grant        none
// @namespace https://greasyfork.org/users/244539
// @downloadURL https://update.greasyfork.org/scripts/394819/%E7%9F%A5%E7%BD%91CNKI%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394819/%E7%9F%A5%E7%BD%91CNKI%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){

        function add_size(){
            var c_size = document.getElementsByClassName('main')[0];
            var cur_size = window.getComputedStyle(c_size).fontSize.replace("px","")-0;
            var main = document.getElementsByClassName('main')[0];
            main.style.fontSize=(cur_size+1)+"px";
            var ps = main.getElementsByClassName('p1');
            for(var i=0;i<ps.length;i++){
                ps[i].style.fontSize=(cur_size+1)+"px";
            }
        }
        function redu_size(){
            var c_size = document.getElementsByClassName('main')[0];
            var cur_size = window.getComputedStyle(c_size).fontSize.replace("px","")-0;
            var main = document.getElementsByClassName('main')[0];
            main.style.fontSize=(cur_size-1)+"px";
            var ps = main.getElementsByClassName('p1');
            for(var i=0;i<ps.length;i++){
                ps[i].style.fontSize=(cur_size-1)+"px";
            }
        }
         function change_mode(color){
            localStorage.bgc=color;
            var c_bgc = document.getElementsByTagName('body')[0];
            var c_main = document.getElementsByClassName('main')[0];
            var c_dl = document.getElementsByTagName('dl');
            var c_p = document.getElementsByTagName('p');
            var c_nav = document.getElementsByClassName('ecp_top-nav')[0];
            var c_con = document.getElementsByClassName('content')[0];
            var c_tips = document.getElementsByClassName('tips')[0];
            var c_refer = document.getElementsByClassName('refer')[0];
            var c_h4 = document.getElementsByClassName('refer')[0].getElementsByTagName('h4')[0];
            var c_briefs = document.getElementsByClassName('brief');
            c_bgc.style.backgroundColor = localStorage.bgc;
            c_nav.style.backgroundColor = localStorage.bgc;
            c_con.style.backgroundColor = localStorage.bgc;
            c_tips.style.backgroundColor = localStorage.bgc;
            c_main.style.background = localStorage.bgc;
            c_refer.style.background = localStorage.bgc;
            c_h4.style.background = localStorage.bgc;
            for(var i=0;i<c_briefs.length;i++){
                c_briefs[i].style.background = localStorage.bgc;
            }
            for(var j=0;j<c_dl.length;j++){
                c_dl[j].style.backgroundColor = localStorage.bgc;
            }
            for(var m=0;m<c_p.length;m++){
                c_p[m].style.backgroundColor = localStorage.bgc;
            }

        }
        function change_mode_auto(){
            change_mode(localStorage.bgc);
            var select_default = document.getElementById("protect_eyes_select");
            for(var i=0; i<select_default.options.length; i++){
                if(select_default.options[i].value == localStorage.bgc){
                    select_default.options[i].selected = true;
                    break;
                }
}
        }



        var font_size_button_plus = document.createElement('span');
        font_size_button_plus.title = "增大字体"
        font_size_button_plus.id = "font_size_button_plus";
        font_size_button_plus.innerText = "字✚";
        font_size_button_plus.style.fontSize="14px";
        font_size_button_plus.style.display="block";
        font_size_button_plus.style.lineHeight="18px";
        font_size_button_plus.style.border="1px solid #e2e2e2";
        font_size_button_plus.style.borderRadius="2px";
        font_size_button_plus.style.backgroundColor="#f5f5f5";
        font_size_button_plus.style.color="#504f4f";
        font_size_button_plus.style.float="left";
        font_size_button_plus.style.padding="3px";
        font_size_button_plus.style.position = "absolute";
        font_size_button_plus.style.right = "0";
        font_size_button_plus.style.bottom = "-60px";
        font_size_button_plus.style.width = "28px";

        var font_size_button_redu = document.createElement('span');
        font_size_button_redu.title = "减小字体"
        font_size_button_redu.innerText = "字 ━";
        font_size_button_redu.id = "font_size_button_redu";
        font_size_button_redu.style.fontSize="14px";
        font_size_button_redu.style.display="block";
        font_size_button_redu.style.lineHeight="18px";
        font_size_button_redu.style.border="1px solid #e2e2e2";
        font_size_button_redu.style.borderRadius="2px";
        font_size_button_redu.style.backgroundColor="#f5f5f5";
        font_size_button_redu.style.color="#504f4f";
        font_size_button_redu.style.float="left";
        font_size_button_redu.style.padding="3px";
        font_size_button_redu.style.position = "absolute";
        font_size_button_redu.style.right = "0";
        font_size_button_redu.style.bottom = "-30px";
        font_size_button_redu.style.width = "28px";


        var protect_eyes = document.createElement('select');
        protect_eyes.insertAdjacentHTML("beforeend",'<option value="none" selected>护眼模式</option><option value="#FFFFFF">银河白</option><option value="#FAF9DE">杏仁黄</option><option value="#FFF2E2">秋叶褐</option><option value="#FDE6E0">胭脂红</option><option value="#E3EDCD">青草绿</option><option value="#DCE2F1">海天蓝</option><option value="#E9EBFE">葛巾紫</option><option value="#EAEAEF">极光灰</option>');
        protect_eyes.style.width="36px";
        protect_eyes.id="protect_eyes_select";
        protect_eyes.style.fontSize="12px";
        document.getElementsByClassName('backtop')[0].appendChild(protect_eyes);
        document.getElementsByClassName('backtop')[0].appendChild(font_size_button_plus);
        document.getElementsByClassName('backtop')[0].appendChild(font_size_button_redu);

        document.getElementById("font_size_button_redu").addEventListener("click", redu_size);
        document.getElementById("font_size_button_plus").addEventListener("click", add_size);
        document.getElementById("protect_eyes_select").addEventListener("change", function(){change_mode(this.value)});


        change_mode_auto()
    };
})();