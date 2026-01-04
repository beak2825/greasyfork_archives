// ==UserScript==
// @name:en         IIROSE NoBet
// @name   蔷薇花园-禁止压注
// @namespace    ckylin-script-iirose-nobet
// @version      0.2
// @description  禁止在输入框中输入押注相关字符
// @description:en  Avoid to input things about bet.
// @author       CKylinMC
// @match        https://iirose.com/messages.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420169/%E8%94%B7%E8%96%87%E8%8A%B1%E5%9B%AD-%E7%A6%81%E6%AD%A2%E5%8E%8B%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420169/%E8%94%B7%E8%96%87%E8%8A%B1%E5%9B%AD-%E7%A6%81%E6%AD%A2%E5%8E%8B%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function registerHook(){
        var mi;
        if(mi=document.getElementById("moveinput")){
            mi.oninput = e => {
                let me = e.target;
                let orgvalue = me.value;
                me.value = me.value.replace(/^.*((压\d+)|(全压)|(压完))/,"");
                if(me.value!==orgvalue){
                    me.placeholder = "请勿押注。";
                    setTimeout(()=>{me.placeholder="说点什么..."},2000);
                }
            };
            return true;
        }else return false;
    }

    function waitForRegister(){
        setTimeout(()=>{
            console.log("Try hooking...");
            if(!registerHook()){
                waitForRegister();
            }else{
                console.log("Hook OK.");
            }
        },200);
    }
    waitForRegister();
})();