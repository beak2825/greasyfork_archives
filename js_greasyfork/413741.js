// ==UserScript==
// @name         苏宁实名
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://msinode.suning.com/m/threeElement.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413741/%E8%8B%8F%E5%AE%81%E5%AE%9E%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/413741/%E8%8B%8F%E5%AE%81%E5%AE%9E%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var text_box_html = '<div class="form-content radius3">' ;
    text_box_html += '<label class="" for="name">注册号码</label>';
    text_box_html += '<div class="form-input">';
    text_box_html += '<input type="text" id="mobile" class="infoMobile2" name="mobile" maxlength="11" placeholder="请输入您的手机号">';
    text_box_html += '</div>';
    text_box_html += '</div>';
    $(".radius2").after(text_box_html);
    add.saveData = function(code2) {
    var _custNum = $.cookie('custno') || '';
    var _partyName = $.trim($('.form-input .infoName').val());
    var _mobileNum = $.trim($('.form-input .infoMobile2').val())
    var _cardId = $.trim($('.form-input .infoIdentity').val())
    if (code2 == 2) {
        var certfySource = '282000000040'
    } else {
        var certfySource = '282000000020'
    }
    var _encryptedData = cc.JSEncryptFun(_custNum + ',' + _partyName + ',131000000010,' + _cardId + ',' + certfySource + ',' + _mobileNum, true);
    var url = '/proxy/myApi/api/quick/member/setMemberCertInfo.do';
    var _url = cc.getUrlParams('url') || '';
    var _adCode = cc.getUrlParams('adCode') || '';
    var _adUrl = cc.getUrlParams('adUrl') || '';
    cc.post(url, {
        encryptedData: _encryptedData
    }).done(function(res) {
        if (code2 == 2) {
            if (res) {
                if (res.status === 'COMPLETE') {
                    window.location.href = '/m/threeElementSuccess.html?adCode=' + _adCode + '&adUrl=' + _adUrl + '&url=' + _url
                } else if (res.status === 'UNKNOWN' && res.idsIntercepted) {
                    location.reload();
                } else {
                    var _errormsg = {
                        'E4700045': '字符串长度错误',
                        'E4700237': '会员编号格式不正确',
                        'E4700T01': '{某某参数}必须输入',
                        'E4700202': '会员不存在',
                        'E4700000': '系统错误',
                        'E4700046': '姓名与身份证不匹配',
                        'E4700053': '业务处理过程中数据发生变化',
                        'E4700N87': '实名认证失败',
                        'E4700A64': '身份证格式不正确',
                        'E4700A09': '手机格式不正确',
                        'E4700A21': '姓名格式不正确，必须为2-32位字母数字汉字',
                        'WRONG_CUSTNUM': '会员编号不正确',
                        'WRONG_PARAM': '参数不正确',
                        'COMMON_ERROR': '系统异常',
                        'have_bind': '您已实名'
                    };
                    if (_errormsg[res.code]) {
                        cc.tost(_errormsg[res.code]);
                    } else {
                        cc.tost(res.msg || '系统开小差，请稍后再试..');
                    }
                }
            } else {
                cc.tost('系统开小差，请稍后再试');
            }
        } else {
            add.saveData_callback(res)
        }
    })
}

    // Your code here...
})();