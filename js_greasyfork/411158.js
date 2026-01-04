// ==UserScript==
// @name         点晴免费OA办公系统自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  点晴免费OA办公系统 首次需正常输入登录用户及密码，下次打开则自动使用上次登录账户
// @author       2020-9-10 By Ethan riuice@vip.qq.com
// @match        http://*/login_out.asp*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/411158/%E7%82%B9%E6%99%B4%E5%85%8D%E8%B4%B9OA%E5%8A%9E%E5%85%AC%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/411158/%E7%82%B9%E6%99%B4%E5%85%8D%E8%B4%B9OA%E5%8A%9E%E5%85%AC%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var etKtimer, etKtime = 0,
        n1 = GM_getValue('oaname') || '',
        pw = GM_getValue('oapassword') || '';//获取本地存储的账户信息
    try {
        document.getElementById('ID_Card').value = n1;//初始化赋值
        document.getElementById('Mac_Card').value = n1;
    } catch (ex) {}

    try {
        document.getElementById('username').value = n1;//初始化赋值
        document.getElementById('password').value = pw;
    } catch (ex) {}

    (document.getElementsByTagName("img")[1]).setAttribute('onclick', 'javascript:void(0)'); //去除已有按钮注册事件
    if (document.getElementById('Mac_Card') != null && document.getElementById('Mac_Card').id == 'Mac_Card') {

        function PressMyEnterMac() {
            var nm = document.getElementById('Mac_Card').value || '';
            document.getElementById('ID_Card').value = nm;
            GM_setValue('oaname', nm);
            if (nm == '') return;
            document.form1.submit();
        }

        etKtimer = setInterval(function() {
            n1 = document.getElementById('Mac_Card').value || '';
            if (n1 != '') {
                setTimeInfo();
                if (etKtime == 9) {
                    cancelLogin();
                    PressMyEnterMac();
                    return;
                }
                etKtime++;
                return;
            }
            cancelLogin();
        }, 1000);

        document.getElementsByTagName("img")[1].onclick = function() {
            PressMyEnterMac()
        }

        document.getElementById('Mac_Card').onkeypress = function(e) {
            if (e.keyCode == 13) PressMyEnterMac();
        }
    } else {

        function PressMyEnterLogin() {
            var nm = document.getElementById('username').value || '',
                pp = document.getElementById('password').value || '';

            if(pp.length>31){
                if(!confirm("密码长度超过31位，是否继续登录!")){
                    cancelLogin();
                    return;
                }
            }
            GM_setValue('oapassword', pp);
            document.getElementById('password').value = hex_md5(pp);
            if (nm == '' || pp == '') return;
            document.form1.submit();
        }

        document.getElementById('password').onkeypress = function(e) {
            if (e.keyCode == 13) PressMyEnterLogin();
        }

        etKtimer = setInterval(function() {
            pw = document.getElementById('password').value || '';
            if (pw != '') {
                setTimeInfo();
                if (etKtime == 9) {
                    cancelLogin();
                    PressMyEnterLogin();
                    return;
                }
                etKtime++;
                return;
            }
            cancelLogin()
        }, 1000);

        document.getElementsByTagName("img")[1].onclick = function() {
            PressMyEnterLogin()
        }

    }

    function setTimeInfo() {//倒计时信息
        var oldForm, newDiv = document.createElement('div');

        if (document.getElementById('etEtimeInfo') != null) {
            document.getElementById('etEtimeInfo').innerHTML = '系统将在' + (9 - etKtime) + '秒后自动登录  <div style="cursor:pointer;padding:3px 8px;background:#F00;color:#fff;font-size:.8em;display:inline-block;box-shadow:1px 2px 8px #ccc;border-radius:3px;vertical-align: text-bottom;" id="etEcancel">取消</div><br/><br/>';
            document.getElementById('etEcancel').onclick = cancelLogin;
            return;
        }
        oldForm = document.getElementById('hidden_iframe');
        newDiv.setAttribute('id', 'etEtimeInfo');
        newDiv.setAttribute('style', 'text-align:center;color:#F00;');
        oldForm.parentNode.insertBefore(newDiv, oldForm);
    }

    function cancelLogin() {//取消登录
        if (etKtimer) clearInterval(etKtimer);
        if (document.getElementById('etEtimeInfo'))document.getElementById('etEtimeInfo').remove();
    }
})();