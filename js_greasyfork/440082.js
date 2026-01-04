// ==UserScript==
// @name         快捷登录账号
// @namespace    http://tampermonkey.net/
// @version      3.9.5
// @description  存储一些常用的账号密码，方便进行快捷登录
// @author       You
// @match        https://passport.eteams.cn/*
// @icon         https://www.google.com/s2/favicons?domain=eteams.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440082/%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440082/%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本开始执行");

    var info = '{"info":['+
        '{"name":"justforpersonal@163.com","pwd":"justforpersonal@163.com","display_name":"张子凡(普通用户)"},'+
        '{"name":"1907026996@qq.com","pwd":"1907026996@qq.com","display_name":"吴邦I企微扫码登录"},'+
        '{"name":"13029662962@163.com","pwd":"13029662962@163.com","display_name":"李星云"},'+
        '{"name":"justhodeit@163.com","pwd":"justhodeit@163.com","display_name":"管理员"},'+
        '{"name":"2815752150@qq.com","pwd":"2815752150@qq.com","display_name":"刘新东"},'+
        '{"name":"15026063990","pwd":"123456.","display_name":"沈飞(手机号绑定)"},'+
        '{"name":"zhangsan","pwd":"qazwsxedc123","display_name":"刘新东(鲲鹏正式团队)"}'+
        ']}';




    const observer = new MutationObserver((mutationsList, observer) => {
        // 每次检测到 DOM 变化时，重置计时器
        resetTimer();
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察目标节点
    observer.observe(document.body, config);

    let timer = null;
    const delay = 2000; // 设置一个合适的延迟时间（毫秒）

    function resetTimer() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            // 停止观察
            observer.disconnect();
            console.log("定时器执行了一次！！！！！！！！！");
            executeCoreLogic();
            
        }, delay);
    }

    function executeCoreLogic() {
        console.log("执行了核心业务逻辑！！！！！！！！！");
        // 这里是你的核心业务逻辑
        if(document.querySelector("h1") != null){
            console.log("找到了！！！！！！！！！");
            inputEventChangeLinstener()//插入一个input，实现输入账号后自动登录功能
            var h1 = document.querySelector("h1");
            h1.onmouseover = function(){this.style.textDecoration="underline";this.style.color="red";};
            h1.onmouseleave = function(){this.style.textDecoration="";this.style.color="black";};
            h1.onclick = function(){
                var shed = document.createElement("div");
                shed.id = "shed17699059661";
                shed.style.cssText = "width: 100%; height: 100%; background-color: white; position: absolute; left: 0px; top: 0px; z-index: 998; opacity: 1;";
                document.body.appendChild(shed);
                shed.onclick = function(){
                    document.querySelector(" #shed17699059661").remove()
                    document.querySelector(" #root17699059661").remove();
                };
                createView()//创建布局
            }
        }
        // 允许隐私协议
        if(!document.querySelector(".ui-checkbox-input").checked){
            document.querySelector(".ui-checkbox-input").click();
        }
        console.log("DOM is stable, executing core logic.");
    }



    function createView(){
        var root = document.createElement("div");
        root.id = "root17699059661";
        root.style.cssText = "position: absolute; z-index: 999; left: 50%; top: 50%; border: 1px solid gray; border-radius: 10px; padding: 10px; overflow: auto";

        document.body.appendChild(root);

        var obj = JSON.parse(info);
        for(var i in obj.info){
            log("进入循环");
            var item = document.createElement("div");
            item.style.cssText = "float: left; display: inline-block; width: 100%; font-size: 30px; background-color: rgb(93, 156, 236); "+
                "color: white; padding: 5px 30px; margin: 10px 0px; border: 0px solid gray; border-radius: 5px;";

            item.innerText = obj.info[i].display_name;
            item.setAttribute("name",obj.info[i].name);
            item.setAttribute("pwd",obj.info[i].pwd);
            item.title = obj.info[i].name;
            item.onmouseover = function(){this.style.opacity="0.8"};
            item.onmouseleave = function(){this.style.opacity="1"};
            item.oncontextmenu = function(e){
                // 单击了鼠标右键

                var theValue = this.getAttribute("pwd");
                var aux = document.createElement("input");
                aux.setAttribute("value",theValue);
                document.body.appendChild(aux);
                aux.select();
                document.execCommand("copy");
                document.body.removeChild(aux);

                toast("复制成功",1,1000);

                return false;
            }
            item.onclick = function(){
                var input_name = this.getAttribute("name");
                var input_pwd = this.getAttribute("pwd");

                var username = document.querySelectorAll("input")[0];
                //var lastValue = input.value;
                username.value = input_name;
                var usernameevent = new Event('input', { bubbles: true });
                var usernametracker = username._valueTracker;
                if (usernametracker) {
                    usernametracker.setValue('');
                }
                username.dispatchEvent(usernameevent);

                var pwd = document.querySelectorAll("input")[1];
                //var lastValue = input.value;
                pwd.value = input_pwd;
                var pwdevent = new Event('input', { bubbles: true });
                var pwdtracker = pwd._valueTracker;
                if (pwdtracker) {
                    pwdtracker.setValue('');
                }
                pwd.dispatchEvent(pwdevent);

                setTimeout(function (){document.querySelector("button").click();},200);

                removeAll();
            }

            var enmpty = document.createElement("div");
            enmpty.style.clear="both";
            root.append(enmpty);

            root.appendChild(item);

        }

        root.style.marginTop = "-" + root.offsetHeight/2 +"px";
        root.style.marginLeft = "-" + root.offsetWidth/2 +"px";

        function removeAll(){
            document.querySelector(" #shed17699059661").remove()
            document.querySelector(" #root17699059661").remove();
        }

    }

    function inputEventChangeLinstener(){
        var page = document.querySelector("#root > div.ui-layout.weapp-passport-layout.ui-layout > div > div > div.ui-layout.ui-layout-has-side.ui-layout-children > div > div > div");
        var input = document.createElement("input");
        input.id = "input17699059661";

        // 使用 cssText 一次性设置样式
        input.style.cssText = `
  color: white; /* 字体颜色 */
  width: 80%; /* 宽度为父元素的 80% */
  height: 5%; /* 高度为父元素的 80% */
  border: 2px solid #ebebeb; /* 边框颜色和样式 */
  outline: none; /* 去掉聚焦时的默认外边框 */
  /*background-color: rgba(0, 0, 0, 0.5);  背景色 */
  box-sizing: border-box; /* 宽高包含内边距和边框 */
  border-radius: 8px; /* 边角圆滑 */
  padding: 10px; /* 内边距 */
  position: absolute; /* 使其可以相对父元素定位 */
  bottom: 5%;
  /*top: 10%; /* 距离父容器顶部 50% */
  left: 50%; /* 距离父容器左侧 10% */
  transform: translate(-50%, 0); /* 使用 transform 居中 */
`;


        // 增加到父元素内
        page.style.position = "relative"; // 基础定位
        page.appendChild(input); // 将 input 添加到父元素中


        input.oninput=function(){//粘贴文本后触发
            var localName = document.getElementById("input17699059661").value;

            var username = document.querySelectorAll("input")[0];
            //var lastValue = input.value;
            username.value = localName.split("[")[2].split("]")[0];//提取账号
            var usernameevent = new Event('input', { bubbles: true });
            var usernametracker = username._valueTracker;
            if (usernametracker) {
                usernametracker.setValue('');
            }
            username.dispatchEvent(usernameevent);

            var pwd = document.querySelectorAll("input")[1];
            //var lastValue = input.value;
            pwd.value = localName.split("[")[3].split("]")[0];//提取密码
            var pwdevent = new Event('input', { bubbles: true });
            var pwdtracker = pwd._valueTracker;
            if (pwdtracker) {
                pwdtracker.setValue('');
            }
            pwd.dispatchEvent(pwdevent);

            //输入账号密码以后要做的事情
            setTimeout(function (){
                document.querySelector("button").click();//点击登录按钮
                document.querySelector("#input17699059661").value="";//清空input输入框
            },500);

        }
    }

    function log(msg){
        console.log("快捷登录---"+msg);
    }


    //     在屏幕顶端显示一个toast提示
    //     arg:
    //     msg---要显示的信息内容
    //     typ---toast的颜色，1是绿色，0是红色，分别表示成功和警告
    //     time---显示时长，单位ms

    function toast(msg,type,time){
        var div = document.createElement("div");
        div.id="toast17699059661";
        div.style.cssText="width: 300px; height: 40px; text-align: center; color: rgb(255, 255, 255); position: fixed; left: 43%; top: 10%; line-height: 40px; border-radius: 5px; z-index: 9999;";
        div.innerText=msg;
        if(type){
            div.style.backgroundColor="rgb(5,107,0,0.8)";
        }else{
            div.style.backgroundColor="rgb(255,42,76,0.8)"
        }
        document.body.append(div);
        setTimeout(function(){document.getElementById("toast17699059661").remove()},time);
    }




})();