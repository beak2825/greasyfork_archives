// ==UserScript==
// @name         江西工业学院校园网
// @version      1.02.1
// @description  登录太费神;快把js学
// @author       李某
// @match        http://172.16.3.1/*
// @icon         http://172.16.3.1:801/eportal/extern/test/ip/2/c2dd2df86917aa7b3ae3864f3c269a8a.jpg
// @namespace jxgzyNet
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454647/%E6%B1%9F%E8%A5%BF%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/454647/%E6%B1%9F%E8%A5%BF%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==
function quit()
{
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0){
            window.opener = null; window.close();
        }
        else{
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';//火狐默认状态非window.open的页面window.close是无效的
        //window.history.go(-2);
    }
    else{
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}


(function() {
    'use strict';
//启用严格模式
    window.onload=setInterval(function()
   {
        /*定义全局变量 */
        var edits=document.getElementsByClassName('edit_lobo_cell');

            //示例
            //填充账号和密码
            //edits[1].value='520211985';
            //填充账号
            //edits[2].value='123456';


        //新代码
        if((edits[1].name='DDDDD')&&(edits[2].name='upass')){
            //填充账号和密码
            edits[1].value='编辑脚本填入你的账号在此';
            //填充账号
            edits[2].value='to fill in here with your password';
            //填充密码
            var btns=document.getElementsByName('network');
            btns[2].checked=true;
            //选择中国移动,如果是电信上面的2改为3,其他1
            edits[0].click();
            //点击登录
        }
    },900);//window.onload结束处

    //每隔2600毫秒判断是不是为登录页面,为假时关闭当前窗口
    setTimeout(function()
               {
        var edits=document.getElementsByClassName('edit_lobo_cell');
        if(edits[1].type='button'){
            setInterval(quit(),100)//退出函数
        }
      //如果觉得登录后页面太久没关闭可以适当调小数值,但是太小会导致登录不成功
    },2600);
})();

