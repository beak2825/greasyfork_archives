// ==UserScript==
// @name         ThanhLau Sign(ThanhLauSign)
// @namespace    https://greasyfork.org/scripts/29721-ThanhLau-Sign-ThanhLausign
// @version      1.100
// @description  Thêm nút chèn Signcode vào ThanhLau
// @match        https://thanhlau.com/*
// @grant 	 GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369796/ThanhLau%20Sign%28ThanhLauSign%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369796/ThanhLau%20Sign%28ThanhLauSign%29.meta.js
// ==/UserScript==


function themSign(){
    var iframe = document.getElementById('QuickReply');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var str = innerDoc.getElementByClassName("redactor_textCtrl.redactor_MessageEditor.redactor_BbCodeWysiwygEditor.redactor_").value;
    document.getElementByClassName("redactor_textCtrl.redactor_MessageEditor.redactor_BbCodeWysiwygEditor.redactor_" ).value = str;
    document.getElementByClassName("redactor_textCtrl.redactor_MessageEditor.redactor_BbCodeWysiwygEditor.redactor_" ).value += "\n\n[quote][I][SIZE=3]Phụ nữ có 70 sở thích: shopping và [IMG]http://linkgon.com/185/l-td102.png[/IMG][IMG]http://linkgon.com/185/s-td102.png[/IMG]. =))[/SIZE][/I][/quote]";
}

function addBtn() {
    $("ctrl_watch_thread_Disabler").each(function () {
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

if (GM_getValue("tudong")==="true") {  //kiểm tra checkbox
    $("#autoSign").prop("checked", true);
}