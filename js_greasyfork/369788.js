// ==UserScript==
// @name         Xam Sign(XamSign)
// @namespace    https://greasyfork.org/scripts/29721-Xam-Sign-Xamsign
// @version      1.100
// @description  Thêm nút chèn Signcode vào Xam
// @match        https://xamvn.com/*
// @grant 	 GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369788/Xam%20Sign%28XamSign%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369788/Xam%20Sign%28XamSign%29.meta.js
// ==/UserScript==


function themSign(){
    var str = document.getElementById("vB_Editor_QR_textarea").value;
    document.getElementById("vB_Editor_QR_textarea" ).value = str;
    document.getElementById("vB_Editor_QR_textarea" ).value += "\n__________________\n[I][SIZE=2]Phụ nữ có 70 sở thích: shopping và [IMG]http://linkgon.com/185/l-xv151.png[/IMG][IMG]http://linkgon.com/185/s-xv151.png[/IMG]. =))[/SIZE][/I]\n[QUOTE][URL='http://linkgon.com/a/vaytien3s/xv'][B][I][SIZE=2][U][COLOR='RoyalBlue']Vay tiền trong 3 giây - Đăng ký FREE để hưởng lãi suất ưu đãi:[/COLOR][/U] [U][COLOR='Magenta']CLICK HERE.[/COLOR][/U][/SIZE][/I][/B][/URL][/QUOTE]";
}

function addBtn() {
    $("#vB_Editor_QR_controls").each(
        function () {
            $(this).after("<input type='button' value='Sign' id='Sign'>");
            $('div[style="padding:3px"]').last().after("<input style='position: relative; left: 3px' type='checkbox'  id='autoSign'>  Auto thêm Sign</input>");
            $('#Sign').click( function(){
                themSign();
            });
            $('#qr_submit').click(function(){
                if ($('#autoSign').is(':checked')){
                    GM_setValue("tudong", "true");
                    themSign();
                }  else {
                    GM_setValue("tudong", "");
                }
            });
        }
    );
}
addBtn();

function themSignAdv(){
    var str = document.getElementById("vB_Editor_001_textarea").value;
    document.getElementById("vB_Editor_001_textarea").value = str;
    document.getElementById("vB_Editor_001_textarea").value += "\n__________________\n[I][SIZE=2]Phụ nữ có 70 sở thích: shopping và [IMG]http://linkgon.com/185/l-xv151.png[/IMG][IMG]http://linkgon.com/185/s-xv151.png[/IMG]. =))[/SIZE][/I]\n[QUOTE][URL='http://linkgon.com/a/vaytien3s/xv'][B][I][SIZE=2][U][COLOR='RoyalBlue']Vay tiền trong 3 giây - Đăng ký FREE để hưởng lãi suất ưu đãi:[/COLOR][/U] [U][COLOR='Magenta']CLICK HERE.[/COLOR][/U][/SIZE][/I][/B][/URL][/QUOTE]";
}

function addBtnAdv() {
    $("#vB_Editor_001_controls").each(
        function () {
            $(this).after("<input type='button' value='Sign' id='Sign'>");
            $('div[style="padding:3px"]').first().after("<input style='position: relative; left: 3px' type='checkbox'  id='autoSign'>  Auto thêm Sign</input>");
            $('#Sign').click(function(){
                themSignAdv();
            });
            $('#vB_Editor_001_save').first().click(function(){
                if ($('#autoSign').is(':checked')){
                    GM_setValue("tudong", "true");
                    themSignAdv();
                }  else {
                    GM_setValue("tudong", "");
                }

            });
        }
    );
}
addBtnAdv();

if (GM_getValue("tudong")==="true") {  //kiểm tra checkbox
    $("#autoSign").prop("checked", true);
}
