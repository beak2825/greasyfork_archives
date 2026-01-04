// ==UserScript==
// @name         HBUT net
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  Free your hands, connect your network automatically！！！
// @author       Huang
// @match        http://202.114.177.246/srun_portal_pc?ac_id=1&theme=pro
// @match        https://202.114.177.246/srun_portal_pc?ac_id=1&theme=pro
// @match        *202.114.177.246/*
// @license      myself
// @icon         https://tse2-mm.cn.bing.net/th/id/OIP-C.MvkZ23M8xQitxsRcgCsFmwHaHa?w=160&h=180&c=7&r=0&o=5&pid=1.7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445568/HBUT%20net.user.js
// @updateURL https://update.greasyfork.org/scripts/445568/HBUT%20net.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
setTimeout(function(){
    var buttonValue = document.getElementById('login-account');
    var count = 500;
    while(document.getElementById('logout') == null){
       // console.log("登陆界面的 --> "+ buttonValue);
        buttonValue.onclick = function(){};
        buttonValue.click();
        if(count<0){
            break;
        }
        count -=1;
    }
}, 3000);
    console.log('登录成功');
setTimeout(function(){
    var count = 50;
    while(document.getElementById('logout') != null){
        closeWindows();
        if(count--<0){
            break;
        }
    }
}, 5000);
alert('爱你,凡凡子♥');

function closeWindows() {
         var browserName = navigator.appName;
         var browserVer = parseInt(navigator.appVersion);
         //alert(browserName + " : "+browserVer);

         //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";

         if(browserName == "Microsoft Internet Explorer"){
             var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;
             if (ie7)
             {
               //This method is required to close a window without any prompt for IE7 & greater versions.
               window.open('','_parent','');
               window.close();
             }
            else
             {
               //This method is required to close a window without any prompt for IE6
               this.focus();
               self.opener = this;
               self.close();
             }
        }else{
            //For NON-IE Browsers except Firefox which doesnt support Auto Close
            try{
                this.focus();
                self.opener = this;
                self.close();
            }
            catch(e){

            }

            try{
                window.open('','_self','');
                window.close();
            }
            catch(e){

            }
        }
    }
})();