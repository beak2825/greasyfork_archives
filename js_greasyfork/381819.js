// ==UserScript==
// @name         Jxnu 教务在线绕过验证码
// @namespace    http://tampermonkey.net/
// @version      20.10.29
// @description  强制匹配并自动填充验证码
// @author       You
// @match        https://jwc.jxnu.edu.cn/Portal/LoginAccount.aspx?t=account
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381819/Jxnu%20%E6%95%99%E5%8A%A1%E5%9C%A8%E7%BA%BF%E7%BB%95%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/381819/Jxnu%20%E6%95%99%E5%8A%A1%E5%9C%A8%E7%BA%BF%E7%BB%95%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    document.getElementById('__VIEWSTATE').value = '/wEPDwUJNjA5MzAzMTcwD2QWAmYPZBYCAgMPZBYGZg8WAh4EVGV4dAUgMjAxOeW5tDnmnIgyOOaXpSDmmJ/mnJ/lha0mbmJzcDtkAgIPZBYCAgEPFgIfAAUS6LSm5Y+35a+G56CB55m75b2VZAIDD2QWBAIBDw8WAh4HVmlzaWJsZWdkFgoCAQ8QZGQWAWZkAgMPZBYCAgEPFgIfAAUG5a2m5Y+3ZAIFDw8WAh8BaGQWAgIBDxAPFgYeDURhdGFUZXh0RmllbGQFDOWNleS9jeWQjeensB4ORGF0YVZhbHVlRmllbGQFCeWNleS9jeWPtx4LXyFEYXRhQm91bmRnZBAVGxLotKLmlL/ph5Hono3lrabpmaIS5Z+O5biC5bu66K6+5a2m6ZmiEuWIneetieaVmeiCsuWtpumZohXlnLDnkIbkuI7njq/looPlrabpmaIS5Zu96ZmF5pWZ6IKy5a2m6ZmiEuWMluWtpuWMluW3peWtpumZohvorqHnrpfmnLrkv6Hmga/lt6XnqIvlrabpmaIS57un57ut5pWZ6IKy5a2m6ZmiDOaVmeiCsuWtpumZoh7lhpvkuovmlZnnoJTpg6jvvIjmraboo4Xpg6jvvIkS56eR5a2m5oqA5pyv5a2m6ZmiG+WOhuWPsuaWh+WMluS4juaXhea4uOWtpumZohXpqazlhYvmgJ3kuLvkuYnlrabpmaIM576O5pyv5a2m6ZmiEuWFjei0ueW4iOiMg+eUn+mZogzova/ku7blrabpmaIJ5ZWG5a2m6ZmiEueUn+WRveenkeWtpuWtpumZohvmlbDlrabkuI7kv6Hmga/np5HlrablrabpmaIM5L2T6IKy5a2m6ZmiD+WkluWbveivreWtpumZognmloflrabpmaIb54mp55CG5LiO6YCa5L+h55S15a2Q5a2m6ZmiDOW/g+eQhuWtpumZohXmlrDpl7vkuI7kvKDmkq3lrabpmaIM6Z+z5LmQ5a2m6ZmiDOaUv+azleWtpumZohUbCDY4MDAwICAgCDYzMDAwICAgCDgyMDAwICAgCDQ4MDAwICAgCDY5MDAwICAgCDYxMDAwICAgCDYyMDAwICAgCDQ1MCAgICAgCDUwMDAwICAgCDM3MDAwICAgCDgxMDAwICAgCDU4MDAwICAgCDQ2MDAwICAgCDY1MDAwICAgCDU3MDAwICAgCDY3MDAwICAgCDU0MDAwICAgCDY2MDAwICAgCDU1MDAwICAgCDU2MDAwICAgCDUyMDAwICAgCDUxMDAwICAgCDYwMDAwICAgCDQ5MDAwICAgCDY0MDAwICAgCDUzMDAwICAgCDU5MDAwICAgFCsDG2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZxYBZmQCCw8PFgIeCEltYWdlVXJsBSRjaGVja2NvZGUuYXNweD9jb2RlPTM5QkI5NEEyOTI1RkRFNTFkZAINDxYCHwAFEDM5QkI5NEEyOTI1RkRFNTFkAgMPDxYCHwFoZGRkFGDbgkAceklCr+FZOXBtSJe5Pn7HSIcttMuyCvXofCQ=';
    document.getElementById('__EVENTVALIDATION').value = '/wEWCgLgz7WxAQKFsp/HCgL+44ewDwKiwZ6GAgKWuv6KDwLj3Z22BgL6up5fAv/WopgDAqbyykwC68zH9ga6ejVCNDnWxpMNAkqDTDSgihIuIiFsiaJtkc67MT+fJA==';
    //document.getElementById('_ctl0_cphContent_imgPasscode').src = 'checkcode.aspx?code=6BEE7185C54920BC';
    document.getElementsByClassName("form-group")[3].setAttribute("hidden",true);
    document.getElementById('_ctl0_cphContent_txtCheckCode').value = '8ZYT';
})();