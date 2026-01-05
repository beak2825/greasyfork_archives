// ==UserScript==
// @name         VOZ SKY(Voskyize)
// @namespace    https://greasyfork.org/scripts/29721-voz-sky-voskyize
// @version      1.110
// @description  Thêm nút chèn Skycode(Sếp'ss code) vào Voz
// @match        https://vozforums.com/*
// @grant 	     GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29721/VOZ%20SKY%28Voskyize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29721/VOZ%20SKY%28Voskyize%29.meta.js
// ==/UserScript==


function themsky(){
    var str = document.getElementById("vB_Editor_QR_textarea").value;
    var ptn = /file.daivietgroup.net/g;
    var test = ptn.test(str);
    if (test===false){
        var sky = "s";
        var res = str.replace(/(?!\S*\])(?!\S*:)\S+/g, function(x){return x  + "'" + sky.repeat(Math.floor((Math.random() * 3) + 1));}); //số đơn vị sky('s) random từ 1-3
        document.getElementById("vB_Editor_QR_textarea" ).value = res;
        document.getElementById("vB_Editor_QR_textarea" ).value += "\n[I]Sent from my[IMG]http://file.daivietgroup.net/crop/50x50/2016/02/01/f45b63f103f4e1440399303-abba.jpg[/IMG][/I]";
    }
}

function addBtn() {
    $("#vB_Editor_QR_controls").each(
        function () {
            $(this).after("<input type='button' value='SKY' id='sky'>");
            $('div[style="padding:3px"]').last().after("<input style='position: relative; left: 3px' type='checkbox'  id='autosky'>  Auto thêm sky</input>");
            $('#sky').click( function(){
                themsky();
            });
            $('#qr_submit').click(function(){
                if ($('#autosky').is(':checked')){
                    GM_setValue("tudong", "true");
                    themsky();
                }  else {
                    GM_setValue("tudong", "");
                }
            });
        }
    );
}
addBtn();

function themskyAdv(){
    var str = document.getElementById("vB_Editor_001_textarea").value;
    var sky = "s";
    var ptn = /file.daivietgroup.net/g;
    var test = ptn.test(str);
    if (test===false){
        var res = str.replace(/(?!\S*\])(?!\S*:)\S+/g, function(x){return x  + "'" + sky.repeat(Math.floor((Math.random() * 3) + 1));}); //số đơn vị sky('s) random từ 1-3
        document.getElementById("vB_Editor_001_textarea").value = res;
        document.getElementById("vB_Editor_001_textarea").value += "\n[I]Sent from my[IMG]http://file.daivietgroup.net/crop/50x50/2016/02/01/f45b63f103f4e1440399303-abba.jpg[/IMG][/I]";
    }
}

function addBtnAdv() {
    $("#vB_Editor_001_controls").each(
        function () {
            $(this).after("<input type='button' value='SKY' id='sky'>");
            $('div[style="padding:3px"]').first().after("<input style='position: relative; left: 3px' type='checkbox'  id='autosky'>  Auto thêm sky</input>");
            $('#sky').click(function(){
                themskyAdv();
            });
            $('#vB_Editor_001_save').first().click(function(){
                if ($('#autosky').is(':checked')){
                    GM_setValue("tudong", "true");
                    themskyAdv();
                }  else {
                    GM_setValue("tudong", "");
                }

            });
        }
    );
}
addBtnAdv();

if (GM_getValue("tudong")==="true") {  //kiểm tra checkbox
    $("#autosky").prop("checked", true);
}