// ==UserScript==
// @name         HacPai红包小助手
// @namespace    https://github.com/proxygit
// @version      2.1.1
var version = "1.0.0";
// @description  https://hacpai.com/cr 红包小助手and title伪装成学♂习网站
// @author       czx.me
// @connect      hacpai.com/cr
// @include      https://hacpai.com/cr*
// @note         19-07-04 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/404241/HacPai%E7%BA%A2%E5%8C%85%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404241/HacPai%E7%BA%A2%E5%8C%85%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    realhongbao()
    //修改标题
    document.getElementsByTagName("title")[0].innerText = 'Java 高级教程 | 菜鸟教程';

    //修改图标
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://static.runoob.com/images/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
    setInterval(function () {

            realhongbao();


    }, 3000);


})();
function realhongbao(){
    console.log("红包助手启动v2v～～～～～～～～～～～～～")
    var ylq=new RegExp('领');
    var hongbaos=document.getElementsByClassName('hongbao__item fn__flex-inline')
    for(var i=0,len=hongbaos.length;i<len; i++){
        if(!ylq.test(hongbaos[i].getElementsByClassName('ft__smaller ft__fade')[0].innerText)){
            hongbaos[i].click();
             try {
                 var laoban=laobanname(hongbaos[i]);
                 if (laoban!=='233333'){
                     xiexielaoban(laoban);
                 }
             }
            catch (error) {

            console.error(error);
        }finally {
            window.location.reload();
        }
        }
    }
}
function laobanname(hb){
    return hb.parentElement.parentElement.parentElement.getElementsByClassName('avatar tooltipped__user')[0].getAttribute('aria-name');
}
function xiexielaoban(lb){
    var xiexie = document.getElementsByClassName('vditor-textarea')[0];
    var xxlblbdq= "//api.heycmm.cn/speak/蟹蟹"+lb+"老板，老板大气!";
    xiexie.textContent=`@${lb} <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=280 height=58 src="${xxlblbdq}"></iframe>`;
    document.getElementById('chatRoomBtn').click()
}


