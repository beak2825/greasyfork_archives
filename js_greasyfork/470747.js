// ==UserScript==
// @name         unlock
// @namespace    https://wa.chatbotclubs.com/web/user
// @version      0.2
// @description  无敌
// @author       rui
// @match        https://wa.chatbotclubs.com/web/user*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470747/unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/470747/unlock.meta.js
// ==/UserScript==

(function() {
    console.log($("#add_coin"));
var html = "<div class=\"modal-dialog\">\
            <div class=\"modal-content\">\
                <div class=\"modal-header\">\
                    <h5 class=\"modal-title\" id=\"exampleModalLabel2\">打钱</h5>\
                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\
                        <span aria-hidden=\"true\">&times;</span>\
                    </button>\
                </div>\
                <div class=\"modal-body\" id='coin_iframe' style=\"width: 100%;height:auto\">\
                    <form>\
                        <fieldset class=\"form-group\">\
                            <div class=\"row\">\
                                <input type=\"hidden\" name=\"display_id\" id=\"jiushiwan_id\">\
                                <legend class=\"col-form-label col-sm-2 pt-0\">金币</legend>\
                                <div class=\"col-sm-10\">\
                                    <div class=\"custom-control custom-radio\">\
                                        <input type=\"radio\" id=\"customRadioCoin1\" name=\"customRadioCoin\" onclick=\"other()\" checked value=\"100\" class=\"custom-control-input\">\
                                        <label class=\"custom-control-label\" for=\"customRadioCoin1\">100</label>\
                                    </div>\
                                    <div class=\"custom-control custom-radio\">\
                                        <input type=\"radio\" id=\"customRadioCoin2\" name=\"customRadioCoin\" onclick=\"other()\" value=\"200\" class=\"custom-control-input\">\
                                        <label class=\"custom-control-label\" for=\"customRadioCoin2\">\
                                            200</label>\
                                    </div>\
                                    <div class=\"custom-control custom-radio\">\
                                        <input type=\"radio\" id=\"customRadioCoin3\" name=\"customRadioCoin\" onclick=\"other()\" value=\"500\" class=\"custom-control-input\">\
                                        <label class=\"custom-control-label\" for=\"customRadioCoin3\">500</label>\
                                    </div>\
                                    <div class=\"custom-control custom-radio\">\
                                        <input type=\"radio\" id=\"customRadioCoin4\" name=\"customRadioCoin\" onclick=\"other()\" value=\"Other\" class=\"custom-control-input\">\
                                        <label class=\"custom-control-label\" for=\"customRadioCoin4\">自定义</label>\
                                    </div>\
                                </div>\
                            </div>\
                        </fieldset>\
                        <div class=\"form-group row\" style=\"display:none\" id=\"other_reason\">\
                            <label for=\"otherCoin\" class=\"col-sm-2 col-form-label\">自定义</label>\
                            <div class=\"col-sm-10\">\
                                <input type=\"number\" max=\"100000000\" min=\"-100000000\" value=\"0\" class=\"form-control\" id=\"otherCoin\" placeholder=\"Other\">\
                            </div>\
                        </div>\
                    </form>\
                </div>\
                <div class=\"modal-footer\">\
                    <button type=\"button\" id=\"close_add_coin\" class=\"btn btn-secondary\" data-dismiss=\"modal\">关闭</button>\
                    <input type=\"button\" class=\"btn btn-primary\" value=\"提交\" onclick=\"add_coin()\">\
                </div>\
            </div>\
        </div>\
"
$("#add_coin").html(html);
})();