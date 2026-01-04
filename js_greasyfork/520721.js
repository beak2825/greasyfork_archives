// ==UserScript==
// @name         XMUM E-Services Tool Pack
// @namespace    http://tampermonkey.net/
// @version      2025-02-01
// @description  Try to take over the library!
// @author       Reality361
// @run-at       document-idle
// @match        https://eservices.xmu.edu.my/space-booking/library-space-booking*
// @icon         https://eservices.xmu.edu.my/assets/commonMedia/logos/xmum-favicon.png
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520721/XMUM%20E-Services%20Tool%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/520721/XMUM%20E-Services%20Tool%20Pack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Modify the original booking date selector
    function modifyDaySelector(){
        // Get Day Element
        var dayElements = document.querySelectorAll('span.flatpickr-day');

        // Go through these and delete their "disabled" class label
        dayElements.forEach(element => {
            element.classList.remove('flatpickr-disabled');
        });
    }

    modifyDaySelector()

    var daySelector = document.getElementById('booking_date')
    daySelector.oninput = function() {
        modifyDaySelector()
    }

    // Get cookie
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="50%"
    Container.style.top="9%"
    Container.style['z-index']="999999"
    Container.innerHTML = `
<div style="padding: 0px; border: 1px solid #aaa; border-radius: 21px; float: right; background: #fff; position: relative; ">
<button id="getCookieBtnId"
 style="background-image:url(https://XXX.jpg);
 padding: 6px;
 width: auto;
 height: auto;
 background-repeat:no-repeat;
 background-size:62px;
 border:0;
 background-color:transparent;
 background:rgb(0,49,83);
 border-radius:21px;
 color:#fff;
 font-size:12px;
 text-align:center;">Get Cookie</button>

</div>
<div style="padding: 0px; border: 1px solid #aaa; border-radius: 21px; float: right; background: #fff; position: relative; ">
<button id="getTokenBtnId"
 style="background-image:url(https://XXX.jpg);
 padding: 6px;
 width: auto;
 height: auto;
 background-repeat:no-repeat;
 background-size:62px;
 border:0;
 background-color:transparent;
 background:rgb(0,49,83);
 border-radius:21px;
 color:#fff;
 font-size:12px;
 text-align:center;">Get "_token"</button>

</div>
<br>
<div style="padding: 0px; border: 1px solid #aaa; border-radius: 21px; float: right; background: #fff; position: relative; ">
<button id="goToDateBtnId"
 style="background-image:url(https://XXX.jpg);
 padding: 6px;
 width: auto;
 height: auto;
 background-repeat:no-repeat;
 background-size:62px;
 border:0;
 background-color:transparent;
 background:rgb(0,49,83);
 border-radius:21px;
 color:#fff;
 font-size:12px;
 text-align:center;">Go to Date</button>

 <input type="date" id="goToDateSelectionId">

</div>


`;

    document.body.appendChild(Container);
    var b;
    var current_cookies;
    b = document.getElementById("getCookieBtnId");
    b.onclick = function () {
        current_cookies = document.cookie;
        GM_setClipboard(current_cookies);

        // alert popup
        window._alert = function(msg1,msg2,callback) {
            var div = document.createElement("div");
            div.innerHTML = "<style type=\"text/css\">"
                + ".alrMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
                + ".alrMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
                + ".alrDialog { position: fixed; z-index: 5000; width: 80%; max-width: 380px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; border-radius: 36px;border: 2px solid #e6e6fa;}"
                + ".alrDialog .alrDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "
                + ".alrDialog .alrDialogHd .alrDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "
                + ".alrDialog .alrDialogBT { padding: 0 .27rem; font-size: 18px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-top: 5%;}                                                                                                                                          "
                + ".alrDialog .alrDialogNR { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-bottom: 5%;max-height: 230px; }                                                                                                                                          "
                + ".alrDialog .alrDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
                + ".alrDialog .alrDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
                + ".alrDialog .alrDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #0183FC; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; border-radius: 36px;}                                                                       "
                + ".alrDialog .alrDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "
                + ".alrDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
                + "</style>"
                + "<div id=\"dialogs2\" style=\"display: none\">"

                + "<div class=\"alrDialog\">"

                + "    <div class=\"alrDialogBT\" id=\"dialog_msg1\" style=\"text-align: center;height: 30px;\">弹窗标题</div>"
                + "    <div class=\"alrDialogHd\">"

                + "    <div class=\"alrDialogNR\" id=\"dialog_msg2\" style=\"text-align: left;height: auto;\">弹窗内容，告知当前状态、信息和解决方法，描述文字</div>"

                + "    <div class=\"alrDialogFt\">"
                + "        <a href=\"javascript:;\" class=\"alrDialogBtn alrDialogBtnPrimary\" id=\"dialog_ok2\" style='background-color: lavender'>OK</a>"
                + "    </div></div></div>";
            document.body.appendChild(div);
            var dialogs2 = document.getElementById("dialogs2");
            dialogs2.style.display = 'block';
            var dialog_msg1 = document.getElementById("dialog_msg1");
            dialog_msg1.innerHTML = msg1;
            var dialog_msg2 = document.getElementById("dialog_msg2");
            dialog_msg2.innerHTML = msg2;
            var dialog_ok2 = document.getElementById("dialog_ok2");
            dialog_ok2.onclick = function() {
                dialogs2.style.display = 'none';
                callback();
            };
        };

        var msg1="Cookie copied!";

        window._alert(msg1,document.cookie);

        //alert(document.cookie);
        return;
    };
    var c;
    var current_token;
    c = document.getElementById("getTokenBtnId");
    c.onclick = function () {
        GM_setClipboard(_token);

        // alert popup
        window._alert = function(msg1,msg2,callback) {
            var div = document.createElement("div");
            div.innerHTML = "<style type=\"text/css\">"
                + ".alrMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
                + ".alrMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
                + ".alrDialog { position: fixed; z-index: 5000; width: 80%; max-width: 380px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; border-radius: 36px;border: 2px solid #e6e6fa;}"
                + ".alrDialog .alrDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "
                + ".alrDialog .alrDialogHd .alrDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "
                + ".alrDialog .alrDialogBT { padding: 0 .27rem; font-size: 18px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-top: 5%;}                                                                                                                                          "
                + ".alrDialog .alrDialogNR { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-bottom: 5%;max-height: 230px; }                                                                                                                                          "
                + ".alrDialog .alrDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
                + ".alrDialog .alrDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
                + ".alrDialog .alrDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #0183FC; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; border-radius: 36px;}                                                                       "
                + ".alrDialog .alrDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "
                + ".alrDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
                + "</style>"
                + "<div id=\"dialogs2\" style=\"display: none\">"

                + "<div class=\"alrDialog\">"

                + "    <div class=\"alrDialogBT\" id=\"dialog_msg1\" style=\"text-align: center;height: 30px;\">弹窗标题</div>"
                + "    <div class=\"alrDialogHd\">"

                + "    <div class=\"alrDialogNR\" id=\"dialog_msg2\" style=\"text-align: left;height: auto;\">弹窗内容，告知当前状态、信息和解决方法，描述文字</div>"

                + "    <div class=\"alrDialogFt\">"
                + "        <a href=\"javascript:;\" class=\"alrDialogBtn alrDialogBtnPrimary\" id=\"dialog_ok2\" style='background-color: lavender'>OK</a>"
                + "    </div></div></div>";
            document.body.appendChild(div);
            var dialogs2 = document.getElementById("dialogs2");
            dialogs2.style.display = 'block';
            var dialog_msg1 = document.getElementById("dialog_msg1");
            dialog_msg1.innerHTML = msg1;
            var dialog_msg2 = document.getElementById("dialog_msg2");
            dialog_msg2.innerHTML = msg2;
            var dialog_ok2 = document.getElementById("dialog_ok2");
            dialog_ok2.onclick = function() {
                dialogs2.style.display = 'none';
                callback();
            };
        };

        var msg1="\"_token\" copied!";

        window._alert(msg1, _token);


        //alert(document.cookie)
        return;
    };
    var d;
    var goToDate;
    d = document.getElementById("goToDateBtnId");
    d.onclick = function () {
        goToDate = document.getElementById("goToDateSelectionId").value
        // Go to whenever you want
        if(goToDate == ""){
            window.location.href = 'https://eservices.xmu.edu.my/space-booking/library-space-booking';
        } else {
            window.location.href = 'https://eservices.xmu.edu.my/space-booking/library-space-booking?bookingDate=' + goToDate;
        }
        return;
    };
})();