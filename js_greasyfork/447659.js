// ==UserScript==
// @name         自动妖王
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动进妖王
// @author       Izhen
// @match        http://119.91.99.233:8088/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447659/%E8%87%AA%E5%8A%A8%E5%A6%96%E7%8E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447659/%E8%87%AA%E5%8A%A8%E5%A6%96%E7%8E%8B.meta.js
// ==/UserScript==

(function () {


    function MoveToGuard() {
        var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
        var btn = btns[btns.length - 1];

        if (btn.innerText == "停止挂机") {
            btn.click();
        }
        SetGotoPos(48, 50);
    }




    function GetNowPos() {
        //获取当前的坐标
        return document.getElementsByClassName("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText
            .split("：")[1].split(",");


    }

    function CheckIsAutoMovie() {
        //判断是否在移动中
        var btns = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
        var text = btns[btns.length - 1].innerText;

        if (text.indexOf("停下") > -1) {
            return true;
        } else {
            return false;
        }

    }

    function CheckIsAutoKill() {
        //判断是否自动挂机中
        var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
        var btn = btns[btns.length - 1];
        if (btn.innerText == "停止挂机") {
            return true;
        }
        return false;
    }

    function ClickAutoKillBtn() {
        var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
        var btn = btns[btns.length - 1];
        btn.click();
    }

    function GetNowMapType() {
        var map = GetNowMapNameAndPos();
        if (map.indexOf("妖王塔") == 0) return "妖王塔";
        if (map.indexOf("镇妖塔") == 0) return "镇妖塔";
    }

    function GetNowMapNameAndPos() {
        return document.getElementsByClassName("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText;
    }

    function SetGotoPos(x, y) {
        var pos = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("input");
        pos[0].value = x;
        pos[0].dispatchEvent(new Event('input'));
        pos[1].value = y;
        pos[1].dispatchEvent(new Event('input'));
        setTimeout(function () {
            var btn = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
            btn[btn.length - 1].click();
        }, 500);
    }

    function Hey(){
        var tempBtn;
        var item = document.getElementsByClassName("ant-card-body")[3].getElementsByClassName("ant-list-item");
        for(var i = 0 ; i< item.length;i++){
            if(item[i].innerText.indexOf("镇妖塔守卫")>-1){
                tempBtn = item[i];
                break;
            }
        }



    NeedClick(tempBtn);


    }

    function NeedClick(btn){
        var a = document.getElementsByClassName("ant-modal-content");
        if(a  && a.length == 0 ){
            btn.getElementsByTagName("a")[1].click();
            return;
        }


        var b = document.getElementsByClassName("ant-modal-content");
        if(b && b.length >0){
        document.getElementsByClassName("ant-modal-content")[0].getElementsByTagName("button")[1].click();
            return;
        }
    }





    function AutoAction() {
        var mapType = GetNowMapType();

        if (mapType == "妖王塔") {
            //判断是否在自动妖王中
            if (CheckIsAutoKill()) {
                return;
            } else {
                ClickAutoKillBtn();
                return;
            }
            return;
        }

        if (mapType == "镇妖塔") {
            //判断是否在挂机
            if (CheckIsAutoKill()) {
                //停止挂机
                ClickAutoKillBtn();
                return;
            }

            //如果在移动中，返回，等待移动结束
            if (CheckIsAutoMovie()) {
                return;
            }

            //判断是否在目标地点
            var nowPos = GetNowPos();
            if (nowPos[0] == "48" && nowPos[1] == "50") {
                Hey();
                 return;

            } else {
                MoveToGuard();
                return;
            }

 return;
        }

    }



    setTimeout(()=>{
setInterval(()=>AutoAction(),5000);},3000
        );

})();