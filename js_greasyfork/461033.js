// ==UserScript==
// @name         手机端简单调试窗口
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  移动端打开JavaScript运行窗口
// @author       啦A多梦
// @license      MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/461033/%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%AE%80%E5%8D%95%E8%B0%83%E8%AF%95%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/461033/%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%AE%80%E5%8D%95%E8%B0%83%E8%AF%95%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if(self != top){return false}
   // 简易调试工具窗口
    var div = document.createElement("div");
    var divtitle = document.createElement("div");
    var dptextarea = document.createElement("textarea");
    var codetextarea = document.createElement("textarea");
    var launch = document.createElement("button");
    var count = 0;
    divtitle.innerText = "JS Test";
    divtitle.style.display = "none";
    divtitle.style.height = "30px";
    divtitle.style.marginTop = "10px";
    divtitle.style.color = "red";
    div.id = "console";
    div.style.zIndex = 99999;
    div.style.position = "fixed";
    div.style.top = "100px";
    div.style.borderRadius = "15px";
    div.style.background = "#141414";
    div.style.opacity = 0.5;
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.left = "5px";
    div.style.overflow = "auto";
    div.style.textAlign = "center";
    div.style.boxShadow = "0px 0px 0px 5px #d7d7d7";
    document.body.appendChild(div);
    dptextarea.style.width = "90%";
    dptextarea.id = "dptextarea";
    dptextarea.style.height = "60%";
    dptextarea.style.borderRadius = "10px";
    dptextarea.readOnly = true;
    dptextarea.style.margin = "5px auto";
    dptextarea.style.padding = "10px";
    dptextarea.style.display = "none";
    dptextarea.style.overflow = "hidden";
    codetextarea.style.width = "90%";
    codetextarea.id = "codetextarea";
    codetextarea.style.height = "10%";
    codetextarea.style.borderRadius = "10px";
    codetextarea.style.margin = "5px auto";
    codetextarea.style.padding = "10px";
    codetextarea.style.display = "none";
    launch.innerText = "执行代码";
    launch.id = "gogogo";
    launch.style.display = "none";
    launch.style.margin = "0 auto";
    document.getElementById("console").appendChild(divtitle);
    document.getElementById("console").appendChild(dptextarea);
    document.getElementById("console").appendChild(codetextarea);
    document.getElementById("console").appendChild(launch);
    var offsetX = 0;
    var offsetY = 0;
    var divofsy = 0;
    var divofsx = 0;
    var active = 0;
    var scrollY = 0;
    var scroll = 0;
    div.addEventListener("touchstart", function (e) {
        e.stopPropagation();
        offsetX = e.targetTouches[0].pageX;
        offsetY = e.targetTouches[0].pageY;
        divofsy = div.offsetTop;
        divofsx = div.offsetLeft;
        count = 0;
        setTimeout(function(){
            count++;
        },100)
    })
    div.addEventListener("touchmove", function(e){
        e.preventDefault();
        if (div.style.width == "30px") {
            count = 1;
            let x = e.targetTouches[0].pageX - offsetX;
            let y = e.targetTouches[0].pageY - offsetY;
            div.style.top = divofsy + y + "px";
            div.style.left = divofsx + x + "px";
        }
    })
    div.addEventListener("touchend", function (e) {
        if (count == 1 && div.style.width == "30px") {
            if(div.offsetLeft < window.innerWidth / 2){
                div.style.right = "";
                div.style.left = "5px";
            }else{
                div.style.left = "";
                div.style.right = "5px";
            }
            if(div.offsetTop > window.innerHeight - 30){
                div.style.top = window.innerHeight - 35 + "px";
            }
            if(div.offsetTop <= 5){
                div.style.top = "5px";
            }
        } else if(count == 0 && div.style.width == "30px"){
            setTimeout(function () {
                div.style.width = "80%";
                div.style.height = "70%";
                div.style.top = "100px";
                div.style.opacity = 0.5;
                div.style.background = "gray";
                div.style.opacity = 1;
                dptextarea.style.display = "block";
                divtitle.style.display = "block";
                codetextarea.style.display = "block";
                launch.style.display = "block";
                div.style.left = (window.innerWidth / 2 - div.clientWidth / 2) + "px";
                div.style.boxShadow = "";
            }, 100);            
        } else {
            setTimeout(function () {
                div.style.width = "80%";
                div.style.height = "70%";
                div.style.opacity = 0.5;
                div.style.background = "gray";
                div.style.opacity = 1;
                dptextarea.style.display = "block";
                divtitle.style.display = "block";
                codetextarea.style.display = "block";
                launch.style.display = "block";
                div.style.left = (window.innerWidth / 2 - div.clientWidth / 2) + "px";
                div.style.boxShadow = "";
            }, 100);
        }
        count = 0;
    })
    divtitle.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        offsetX = e.targetTouches[0].pageX;
        offsetY = e.targetTouches[0].pageY;
        divofsy = div.offsetTop;
        divofsx = div.offsetLeft;
    }, true);
    divtitle.addEventListener("touchmove", function (e) {
        active = 1;
        let x = e.targetTouches[0].pageX - offsetX;
        let y = e.targetTouches[0].pageY - offsetY;
        if (divofsy + y <= 0) {
            div.style.top = "0px";
            div.style.left = divofsx + x + "px";
        } else if (divofsy + y > window.innerHeight - 50) {
            div.style.top = window.innerHeight - 50 + "px";
            div.style.left = divofsx + x + "px";
        }
        else {
            div.style.top = divofsy + y + "px";
            div.style.left = divofsx + x + "px";
        }
    })
    divtitle.addEventListener("touchend", function (e) {
        e.stopPropagation();
        if (active != 1) {
            setTimeout(function () {
                div.style.width = "30px";
                div.style.height = "30px";
                dptextarea.style.display = "none";
                divtitle.style.display = "none";
                codetextarea.style.display = "none";
                launch.style.display = "none";
                div.style.boxShadow = "0px 0px 0px 5px #d7d7d7";
                div.style.left = "";
            }, 100);
        }
        active = 0;
    })

    dptextarea.addEventListener('touchstart', (e) => {
        scrollY = e.targetTouches[0].pageY;
        scroll = document.querySelector("#dptextarea").scrollTop;
    });
    dptextarea.addEventListener('touchmove', (e) => {
        let y = e.targetTouches[0].pageY - scrollY;
        // document.querySelector("#dptextarea").scrollTo(0, offsetX - y);
        document.querySelector("#dptextarea").scrollTop = scroll - y;
    });
    var vConsole;
    function vcs(){
        vConsole = new unsafeWindow.VConsole();
        vConsole.compInstance.$$.root.lastElementChild.firstChild.innerText = "V";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.background = "gray";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.boxShadow = "0px 0px 0px 5px #e3e3e3;";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.width = "40px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.height = "40px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.borderRadius = "20px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.textAlign = "center";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.padding = '0';
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.fontSize = "42px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.opacity = 0.5;
    }

    // 按钮事件
    launch.addEventListener("touchend", function () {
        if (document.querySelector("#codetextarea").value == "cls") {
            document.querySelector("#dptextarea").value = document.querySelector("#codetextarea").value = "";
        } else if(document.querySelector("#codetextarea").value != '') {
                try{
                    document.querySelector("#dptextarea").value += eval(document.querySelector("#codetextarea").value).toString() + "\n----------------------\n";
                    document.querySelector("#codetextarea").value = "";
                    document.querySelector("#dptextarea").scrollTo(0, document.querySelector("#dptextarea").scrollHeight)
                } catch(err){
                    document.querySelector("#dptextarea").value += "\n" + err + "\n";
                    document.querySelector("#dptextarea").scrollTo(0, document.querySelector("#dptextarea").scrollHeight)
                }
            }else{
                alert("不能为空");
            }
    })

    // 键盘回车事件
    codetextarea.addEventListener("keydown", (e)=>{
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.preventDefault();
            if (document.querySelector("#codetextarea").value == "cls") {
                document.querySelector("#dptextarea").value = document.querySelector("#codetextarea").value = "";
            } else if(document.querySelector("#codetextarea").value != ''){
                        try{
                            document.querySelector("#dptextarea").value += eval(document.querySelector("#codetextarea").value).toString() + "\n----------------------\n";
                            // document.querySelector("#codetextarea").value = "";
                            document.querySelector("#dptextarea").scrollTo(0, document.querySelector("#dptextarea").scrollHeight)
                        } catch(err){
                            document.querySelector("#dptextarea").value += "\n" + err + "\n";
                            document.querySelector("#dptextarea").scrollTo(0, document.querySelector("#dptextarea").scrollHeight)
                        }
            }else{
                alert("不能为空");
            }
        }
    })
})();