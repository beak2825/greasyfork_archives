// ==UserScript==
// @name         广东轻工职业技术学院校园网自动登录
// @namespace    zhong
// @version      0.2
// @description  广东轻工职业技术学院南海校区的WiFi自动登录脚本，维护联系QQ；1274998818
// @author       zhong
// @match        http://10.0.5.112/*
// @icon         https://i.postimg.cc/cLWtTw7B/20221011204532.jpg
// @grant        none



// @downloadURL https://update.greasyfork.org/scripts/452882/%E5%B9%BF%E4%B8%9C%E8%BD%BB%E5%B7%A5%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/452882/%E5%B9%BF%E4%B8%9C%E8%BD%BB%E5%B7%A5%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//==========================用户配置填写======================================
const name =""
const passworld=""
//================================================================================
let pass = false;
log();
ero();
setimg();






function log() {
    setTimeout
        (function () {
            if (document.querySelector("[type=text]")) {
                document.querySelector("[type=text]").value = name//自动填写账号
                //  console.log(document.querySelector("[type=text]"))
                document.querySelector("[type=password]").value = passworld//自动填写密码
                //  console.log(document.querySelector("[type=password]"))
                document.querySelector("[type=button]").click();//点击登录
            }
        }, 2000);
}

function ero() {
    setTimeout(() => {
        let re;
        if (re = document.querySelector("[name=GobackButton]")) {
            re.click();
            console.log(re)
        }

    }, 1000)
}//检测是否弹出异常返回

function setimg() {
    setTimeout(() => {
        setInterval(() => {
            let png = document.querySelectorAll("img")
            png[1].src = "https://i.postimg.cc/MK2kW8yG/20221011211035.jpg";
            // png[1].src="https://i.postimg.cc/TYZv7TWJ/20221011223137.jpg";
            png[1].style.height = "30%"
            png[1].style.width = "30%";
            let dvv= document.getElementsByClassName("edit_cell edit_image ui-resizable-autohide")
            dvv[1].style.height="1200px"
            dvv[1].style.width="1200px"
        }
            , 500)


    }, 5000)
}
