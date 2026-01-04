// ==UserScript==
// @name         谁是股批？
// @namespace    http://43.133.22.125/
// @version      2023-12-19
// @description  到底谁在玩狒狒食肆炒股啊？---> 在石之家角色信息下面添加一个TA的LOGS标签点击可以跳转logs页面
// @author       坏迷你船员
// @match        https://ff14risingstones.web.sdo.com/*
// @match        https://apiff14risingstones.web.sdo.com/*
// @icon         https://ff14risingstones.web.sdo.com/pc/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482595/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/482595/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    var username="";
    var userarea="";
    var logsurl="";
    //请求拦截
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(){
        var self = this;
        this.onreadystatechange = function(){
            //console.log(self);
            if(self.readyState === 4){
                if(self.responseURL.indexOf("userInfo/getUserInfo?uuid=")>-1){
                    var json=JSON.parse(self.response);
                    username=json.data.character_name
                    userarea=json.data.group_name
                    //console.log("角色名: "+username+" 所在区服: "+userarea);
                    logsurl="https://cn.fflogs.com/character/cn/"+userarea+"/"+username;
                    console.log(logsurl);
                    //console.log(json);
                }
            }
        };
        originalSend.apply(this, arguments);
    };
    //等待页面渲染完后再处理添加logs菜单拦截点击事件
    setTimeout(function (){
        var listbox = document.getElementsByClassName("el-menu el-menu--vertical");
        var li_box = document.createElement('li');
        var span_box = document.createElement('span');
        li_box.className = "el-menu-item gpbtn";
        span_box.className = "ft16";
        span_box.innerText = "TA的LOGS"
        li_box.appendChild(span_box);
        listbox.item(0).appendChild(li_box);
        document.querySelectorAll(".gpbtn").forEach(element => {
            //console.log(element)
            element.addEventListener('click',(e)=>{
                window.open(logsurl);
                e.preventDefault();
            })
        });
    },3000);

})();