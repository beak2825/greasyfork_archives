// ==UserScript==
// @name 广西基层医疗Web心跳包
// @namespace https://mlluu.com
// @description  简单的实现心跳包发送(定时访问API接口)
// @match *://117.141.138.86:8463/csps_4509/login/login_initmain.action*
// @grant none
// @version   1.0
// @downloadURL https://update.greasyfork.org/scripts/394571/%E5%B9%BF%E8%A5%BF%E5%9F%BA%E5%B1%82%E5%8C%BB%E7%96%97Web%E5%BF%83%E8%B7%B3%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/394571/%E5%B9%BF%E8%A5%BF%E5%9F%BA%E5%B1%82%E5%8C%BB%E7%96%97Web%E5%BF%83%E8%B7%B3%E5%8C%85.meta.js
// ==/UserScript==


(function(){
setInterval(function(){
   Ajax({
        method: 'POST',
        url: '//117.141.138.86:8463/csps_4509/jkda/jkda_total.action',
            data: {
            ssbz: 1
            },
          success: function(response) {
            console.log(response);
        }
    });
},180000); /*每3分钟发送一次请求*/

  function Ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function() {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
        xmlHttp.setRequestHeader('SOAPAction','');
        xmlHttp.send(opt.data);
    } else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData + '&random=' + Math.random(), opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}
})();