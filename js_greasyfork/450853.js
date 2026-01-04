// ==UserScript==
// @name         Auto Register
// @version      1.0
// @license      MIT
// @description  Auto Register CSP
// @author       Charlie
// @match        https://cspsj.noi.cn/page/register/studentReg.php
// @grant        GM.addStyle
// @namespace https://greasyfork.org/users/890174
// @downloadURL https://update.greasyfork.org/scripts/450853/Auto%20Register.user.js
// @updateURL https://update.greasyfork.org/scripts/450853/Auto%20Register.meta.js
// ==/UserScript==

const your_data_here = {
    用户名前缀: 'YOURNAME',
    密码: '',
    昵称_也就是姓名: 'qwq',
    手机号: '',
    邮箱: '',
}

(function() {
    'use strict';
    GM.addStyle(`form {
        display: flex;
    flex-direction: column-reverse;
    }`)
    const id = prompt('用户名后缀')
    $('input')[1].value = your_data_here.用户名前缀 + id
    $('input')[2].value = $('input')[3].value = your_data_here.密码
    $('input')[4].value = your_data_here.昵称_也就是姓名 + "qwertyuioewrbaertverteeffxxplkjhgfdsazxcvbnm".substr(id, 3)
    $('input')[5].click()
    $('input')[7].click()
    $('input')[9].click()
    $('input')[10].value = id + '-' + ~~(Math.random() * 1000000)
    $('input')[12].value = '2005-05-23'
    $('input')[15].value = your_data_here.手机号
    $('input')[16].value = your_data_here.邮箱
    $('#citySelect').html("<option value='' text='\u8bf7\u9009\u62e9\u6ce8\u518c\u5730\u533a'>\u8bf7\u9009\u62e9\u6ce8\u518c\u5730\u533a<\/option><option value='377' text='\u978d\u5c71\u5e02'>\u978d\u5c71\u5e02<\/option><option value='381' text='\u672c\u6eaa\u5e02'>\u672c\u6eaa\u5e02<\/option><option value='375' text='\u671d\u9633\u5e02'>\u671d\u9633\u5e02<\/option><option value='369' text='\u5927\u8fde\u5e02'>\u5927\u8fde\u5e02<\/option><option value='371' text='\u4e39\u4e1c\u5e02'>\u4e39\u4e1c\u5e02<\/option><option value='378' text='\u629a\u987a\u5e02'>\u629a\u987a\u5e02<\/option><option value='379' text='\u961c\u65b0\u5e02'>\u961c\u65b0\u5e02<\/option><option value='373' text='\u846b\u82a6\u5c9b\u5e02'>\u846b\u82a6\u5c9b\u5e02<\/option><option value='374' text='\u9526\u5dde\u5e02'>\u9526\u5dde\u5e02<\/option><option value='372' text='\u8fbd\u9633\u5e02'>\u8fbd\u9633\u5e02<\/option><option value='380' text='\u76d8\u9526\u5e02'>\u76d8\u9526\u5e02<\/option><option value='370' text='\u6c88\u9633\u5e02'>\u6c88\u9633\u5e02<\/option><option value='382' text='\u94c1\u5cad\u5e02'>\u94c1\u5cad\u5e02<\/option><option value='376' text='\u8425\u53e3\u5e02'>\u8425\u53e3\u5e02<\/option>")
    $('#schoolSelect').html("<option value=''>\u2015\u8bf7\u9009\u62e9\u6ce8\u518c\u5b66\u6821\u2015<\/option><option value='7874' text='\u4e1c\u5317\u80b2\u624d\u5b66\u6821'>\u4e1c\u5317\u80b2\u624d\u5b66\u6821<\/option><option value='8235' text='\u4e2a\u4eba\u62a5\u540d\uff08\u6c88\u9633\u8003\u70b9\uff09'>\u4e2a\u4eba\u62a5\u540d\uff08\u6c88\u9633\u8003\u70b9\uff09<\/option><option value='13085' text='\u8fbd\u5b81\u5f00\u653e\u5927\u5b66'>\u8fbd\u5b81\u5f00\u653e\u5927\u5b66<\/option><option value='11615' text='\u8fbd\u5b81\u7701\u5b9e\u9a8c\u5b66\u6821'>\u8fbd\u5b81\u7701\u5b9e\u9a8c\u5b66\u6821<\/option><option value='11613' text='\u8fbd\u5b81\u7701\u5b9e\u9a8c\u4e2d\u5b66'>\u8fbd\u5b81\u7701\u5b9e\u9a8c\u4e2d\u5b66<\/option><option value='11614' text='\u8fbd\u5b81\u7701\u5b9e\u9a8c\u4e2d\u5b66\u5206\u6821'>\u8fbd\u5b81\u7701\u5b9e\u9a8c\u4e2d\u5b66\u5206\u6821<\/option><option value='10738' text='\u6c88\u629a\u80b2\u624d\u5b9e\u9a8c\u5b66\u6821'>\u6c88\u629a\u80b2\u624d\u5b9e\u9a8c\u5b66\u6821<\/option><option value='10445' text='\u6c88\u9633\u6c47\u7f6e\u80b2\u90a6\u5b9e\u9a8c\u5b66\u6821'>\u6c88\u9633\u6c47\u7f6e\u80b2\u90a6\u5b9e\u9a8c\u5b66\u6821<\/option><option value='13591' text='\u6c88\u9633\u5e08\u8303\u5927\u5b66\u7b2c\u4e8c\u9644\u5c5e\u5b66\u6821'>\u6c88\u9633\u5e08\u8303\u5927\u5b66\u7b2c\u4e8c\u9644\u5c5e\u5b66\u6821<\/option><option value='16671' text='\u6c88\u9633\u5e02\u5927\u4e1c\u533a\u674f\u575b\u5c0f\u5b66'>\u6c88\u9633\u5e02\u5927\u4e1c\u533a\u674f\u575b\u5c0f\u5b66<\/option><option value='11977' text='\u6c88\u9633\u5e02\u7b2c134\u4e2d\u5b66'>\u6c88\u9633\u5e02\u7b2c134\u4e2d\u5b66<\/option><option value='7782' text='\u6c88\u9633\u5e02\u7b2c\u56db\u5341\u4e09\u4e2d\u5b66'>\u6c88\u9633\u5e02\u7b2c\u56db\u5341\u4e09\u4e2d\u5b66<\/option><option value='14145' text='\u6c88\u9633\u5e02\u7b2c\u56db\u5341\u4e2d\u5b66'>\u6c88\u9633\u5e02\u7b2c\u56db\u5341\u4e2d\u5b66<\/option><option value='12432' text='\u6c88\u9633\u5e02\u7b2c\u4e00\u4e8c\u516d\u4e2d\u5b66'>\u6c88\u9633\u5e02\u7b2c\u4e00\u4e8c\u516d\u4e2d\u5b66<\/option><option value='15304' text='\u6c88\u9633\u5e02\u5149\u660e\u521d\u7ea7\u4e2d\u5b66'>\u6c88\u9633\u5e02\u5149\u660e\u521d\u7ea7\u4e2d\u5b66<\/option><option value='11911' text='\u6c88\u9633\u5e02\u548c\u5e73\u533a\u6559\u80b2\u7814\u7a76\u4e2d\u5fc3'>\u6c88\u9633\u5e02\u548c\u5e73\u533a\u6559\u80b2\u7814\u7a76\u4e2d\u5fc3<\/option><option value='14462' text='\u6c88\u9633\u5e02\u548c\u5e73\u533a\u5357\u4eac\u8857\u7b2c\u4e5d\u5c0f\u5b66'>\u6c88\u9633\u5e02\u548c\u5e73\u533a\u5357\u4eac\u8857\u7b2c\u4e5d\u5c0f\u5b66<\/option><option value='12267' text='\u6c88\u9633\u5e02\u5357\u660c\u65b0\u4e16\u754c\u5b66\u6821'>\u6c88\u9633\u5e02\u5357\u660c\u65b0\u4e16\u754c\u5b66\u6821<\/option><option value='14795' text='\u6c88\u9633\u5e02\u5357\u660c\u4e2d\u5b66'>\u6c88\u9633\u5e02\u5357\u660c\u4e2d\u5b66<\/option><option value='12891' text='\u6c88\u9633\u5e02\u6c88\u6cb3\u533a\u6587\u5316\u8def\u5c0f\u5b66'>\u6c88\u9633\u5e02\u6c88\u6cb3\u533a\u6587\u5316\u8def\u5c0f\u5b66<\/option><option value='13576' text='\u6c88\u9633\u5e02\u94c1\u897f\u533a\u96cf\u9e70\u5b9e\u9a8c\u5c0f\u5b66'>\u6c88\u9633\u5e02\u94c1\u897f\u533a\u96cf\u9e70\u5b9e\u9a8c\u5c0f\u5b66<\/option><option value='10771' text='\u6c88\u9633\u5c0f\u536f\u6559\u80b2\u79d1\u6280\u6709\u9650\u516c\u53f8'>\u6c88\u9633\u5c0f\u536f\u6559\u80b2\u79d1\u6280\u6709\u9650\u516c\u53f8<\/option>")
    $('#teacherSelect').html("<option value='' text='\u8bf7\u9009\u62e9\u6307\u5bfc\u6559\u5e08'>\u8bf7\u9009\u62e9\u6307\u5bfc\u6559\u5e08<\/option><option value='115950' text='\u56fd\u5b81'>\u56fd\u5b81<\/option><option value='132648' text='\u90b1\u6842\u9999'>\u90b1\u6842\u9999<\/option>")
    $('select')[0].selectedIndex = 18
    $('select')[1].selectedIndex = 12
    $('select')[2].selectedIndex = 1
    $('select')[3].selectedIndex = 1
    $('select')[4].selectedIndex = 2
    $('input')[18].onchange = () => $('button#submitform').click()
    $('button#submitform').click()
})();