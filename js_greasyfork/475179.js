// ==UserScript==
// @name         禅道退出登录
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动退出禅道
// @author       lm
// @match        http://192.168.3.117/zentao/my/
// @icon         https://api.94speed.com/img/bitbug_favicon.ico
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475179/%E7%A6%85%E9%81%93%E9%80%80%E5%87%BA%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/475179/%E7%A6%85%E9%81%93%E9%80%80%E5%87%BA%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
function onGetTimeFrameToTime(starTime, endTime) {
    let m = new Date(starTime);
    let mt = m.getTime();
    let n = new Date(endTime);
    let nt = n.getTime();
    let s = nt - mt;
    let sm = Math.floor(Math.random() * s);
    return new Date(mt + sm).getTime();
}
(function() {
    const date = new Date();
    const loginDate = localStorage.loginDate*1;
    const dataStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    const loginOut = onGetTimeFrameToTime(date,`${dataStr} 18:40`)
    let time = setTimeout(loginOutFun,3000)
    function loginOutFun(){
        const newDate = new Date();
        clearTimeout(time)
        time = null;
        console.log(loginOut - newDate.getTime())
        if(loginOut - newDate.getTime()<=10000&&localStorage.dataStr1!==dataStr){
            clearInterval(time);
            localStorage.dataStr1=dataStr;
            const cc = document.getElementsByClassName("dropdown-toggle")[0];
            cc.click();
            setTimeout(() => {
                const cc1 = document.getElementsByClassName("dropdown-menu")[1].children[12].children[0];
                cc1.click();
            }, 1000);
        }else{
            console.log("退出时间：",new Date(loginOut))
            console.log("登录日期：",dataStr)
            console.log("当前时间：",newDate)
            time = setTimeout(loginOutFun,60000)
        }
    }

})();