// ==UserScript==
// @name         TypeShower
// @namespace    https://www.7gugu.com/
// @version      1.1.1
// @description  动态弹幕实时显示按下的按键
// @author       7gugu <gz7gugu@qq.com>
// @match        https://tampermonkey.net/documentation.php?version=4.8.5847&ext=fire&updated=true
// @grant        none
// @include *
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375905/TypeShower.user.js
// @updateURL https://update.greasyfork.org/scripts/375905/TypeShower.meta.js
// ==/UserScript==

(function() {
    'use strict';
var id=1;
var key_array=new Array(500);
key_array[65]='a';
key_array[66]='b';
key_array[67]='c';
key_array[68]='d';
key_array[69]='e';
key_array[70]='f';
key_array[71]='g';
key_array[72]='h';
key_array[73]='i';
key_array[74]='j';
key_array[75]='k';
key_array[76]='l';
key_array[77]='m';
key_array[78]='n';
key_array[79]='o';
key_array[80]='p';
key_array[81]='q';
key_array[82]='r';
key_array[83]='s';
key_array[84]='t';
key_array[85]='u';
key_array[86]='v';
key_array[87]='w';
key_array[88]='x';
key_array[89]='y';
key_array[90]='z';
key_array[112]='F1';
key_array[113]='F2';
key_array[114]='F3';
key_array[115]='F4';
key_array[116]='F5';
key_array[117]='F6';
key_array[118]='F7';
key_array[119]='F8';
key_array[120]='F9';
key_array[121]='F10';
key_array[122]='F11';
key_array[123]='F12';
key_array[136]='Num_Lock';
key_array[137]='Scorll_Lock';
key_array[8]='BackSpace';
key_array[9]='Tab';
key_array[32]='Space';
key_array[13]='Enter';
key_array[16]='Shift';
key_array[17]='Ctrl';
key_array[18]='Alt';
key_array[20]='Caps';
key_array[27]='Esc';
key_array[37]='←';
key_array[38]='↑';
key_array[39]='→';
key_array[40]='↓';
key_array[45]='Ins';
key_array[46]='Del';
key_array[48]='0';
key_array[49]='1';
key_array[50]='2';
key_array[51]='3';
key_array[52]='4';
key_array[53]='5';
key_array[54]='6';
key_array[55]='7';
key_array[56]='8';
key_array[57]='9';
key_array[192]='`';
key_array[173]='-';
key_array[61]='+';
key_array[219]='[';
key_array[221]=']';
key_array[220]='\\';
key_array[59]=';';
key_array[222]='\'';
key_array[188]=',';
key_array[190]='.';
key_array[191]='/';
key_array[229]='输入法';
var key_shift=0;
var key_ctrl=0;
console.log("Typeshower已启用");
$("body").append("<style type='text/css'>type{padding: 5px 10px;font-size: 87.5%;color: #fff;background-color: #212529;border-radius: 5px;font-family:SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;line-height: 1.5;}.key_list{padding:10px;position:fixed;right:20px;top:20px;width:60px;height:50px;z-index:999;}</style>");
$("body").append("<div class='key_list'></div>");
    document.onkeydown=function(event){
            id++;
        console.log("Typeshower 监听中");
			var key_template="";
            var e = event || window.event ;
            if(e && e.keyCode){
			if(key_shift==1){key_template="Shift+";}
			if(key_ctrl==1){key_template="Ctrl+";}
				key_template=key_template+key_array[e.keyCode];
				$("div.key_list").append("<type id='"+id+"'>"+key_template+"</type><br><br>");
              if(e.keyCode==16){key_shift=1;}
			if(e.keyCode==17){key_ctrl=1;}
			  }

				$("type[id='"+id+"']").fadeOut(2500);
				$("br").fadeOut(2500);

        }
		document.onkeyup=function(event){
			var e = event || window.event ;
            if(e && e.keyCode){
			if(e.keyCode==16){key_shift=0;}
			if(e.keyCode==17){key_ctrl=0;}
			}
		}
})();