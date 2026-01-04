// ==UserScript==
// @name         B站视频自定义倍速（支持换P，记忆倍速，突破倍速上限）🔥🔥🔥
// @namespace    http://tampermonkey.net/
// @namespace    https://greasyfork.org/zh-CN/scripts/459284-b%E7%AB%99%E5%80%8D%E9%80%9F
// @version      1.51
// @description  bilibili 视频自定义倍速，支持突破上限，视频换P，倍速记忆功能
// @author       m2on
// @match        https://www.bilibili.com/video/*
// @icon         https://ts1.cn.mm.bing.net/th/id/R-C.316eaefa4ab6f6ed26f46fb6b48a8b31?rik=u1ftBfSndhg9ig&riu=http%3a%2f%2fweixin.qingyy.net%2fPublic%2fattached%2f2020%2f04%2f26%2f5ea4e87a4c0f2.png&ehk=xh4GECMbQkBBG66ZuQPbcMG4eA1oCUDaGNk3MV3raq0%3d&risl=&pid=ImgRaw&r=0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459284/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%EF%BC%88%E6%94%AF%E6%8C%81%E6%8D%A2P%EF%BC%8C%E8%AE%B0%E5%BF%86%E5%80%8D%E9%80%9F%EF%BC%8C%E7%AA%81%E7%A0%B4%E5%80%8D%E9%80%9F%E4%B8%8A%E9%99%90%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459284/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%EF%BC%88%E6%94%AF%E6%8C%81%E6%8D%A2P%EF%BC%8C%E8%AE%B0%E5%BF%86%E5%80%8D%E9%80%9F%EF%BC%8C%E7%AA%81%E7%A0%B4%E5%80%8D%E9%80%9F%E4%B8%8A%E9%99%90%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==



var mmap = null;
var loc_url = window.location.href;
var uuid = "";
var mySpeed = new Number(1.0);
var nowSpeed = new Number(1.0);
//弹窗
function displayAlert(type, data, time){

    var lunbo=document.createElement("div");

    if(type == "success") {
        lunbo.style.backgroundColor = "#20c997";
    }

    lunbo.id="lunbo";
    lunbo.style.position = "absolute";
    lunbo.style.width = "300px";
    lunbo.style.height = "30px";
    lunbo.style.left = "50%";
    lunbo.style.top = "10%";
    lunbo.style.color = "white";
    lunbo.style.fontSize = "15px";
    lunbo.style.borderRadius = "30px";
    lunbo.style.textAlign="center";
    lunbo.style.lineHeight="30px";

    if(document.getElementById("lunbo")==null){
        document.body.appendChild(lunbo);
        lunbo.innerHTML=data;
        setTimeout(function(){
            document.body.removeChild(lunbo);
        } ,time);
    }

}
function deleteUserCache(){
    GM_deleteValue(uuid);
}


// 获取监听换 P 元素
const targetImg = document.getElementById('wxwork-share-pic');

// 创建 MutationObserver 实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.type === 'attributes' &&
      mutation.attributeName === 'src'
    ) {
      setSpeed();
    }
  });
});

// 配置观察选项：监听属性变化（包括 src）
const config = {
  attributes: true, // 监听属性变化
  attributeFilter: ['src'], // 只监听 src 属性
  subtree: false // 不监听子节点
};

// 同一视频切换 P 重新设置倍速
observer.observe(targetImg, config);



function setSpeed() {
  initial();
  // 新增条件判断：当右键按下时不执行速度同步
  if(nowSpeed.toFixed(1) != mySpeed.toFixed(1)){
    const videoElement = document.querySelector('bwp-video') || document.querySelector('video');
    if (videoElement) {
      videoElement.playbackRate = Number(mySpeed.toFixed(1));
      nowSpeed = mySpeed;
      displayAlert("success", `当前倍速已同步: ${mySpeed.toFixed(1)}x`, 2000);
    }
  }
}


function initial() {
    nowSpeed = (document.querySelector('video') != null) ? document.querySelector('video').playbackRate : document.querySelector('bwp-video').playbackRate ;
    // 已经调节倍速
    console.log(nowSpeed);
    if(nowSpeed != 1) return ;
        //获取uuid
    var aCookie = document.cookie.split(";");

    //获取BV号
    var tempStr = loc_url.indexOf("/video/")+7;
    loc_url = loc_url.substring(tempStr,loc_url.indexOf("/",tempStr));

    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        let index = aCookie[i].indexOf("=")
        if (aCookie[i].substring(0, index).trim() === "DedeUserID") {
            uuid = aCookie[i].substring(index + 1);
            break;
        }
    }
    //deleteUserCache();
    if(uuid == "") return;//????用户
    //获取用户历史信息
    mmap = new Map("");
    mmap = GM_getValue(uuid.toString(),new Map(""));
    //alert(GM_getValue(uuid, new Map()).mmap.toString());
    if(JSON.stringify(mmap).length == 2) {
        displayAlert("success", "null", 200);
    }else{
        var arr = JSON.parse( mmap );
        var tempMap = new Map();
        for(var j = 0;j<arr.length;j++){
            tempMap.set(arr[j][0],arr[j][1]);
        }
        mmap = new Map(tempMap);
        if(mmap.get(loc_url) != null){
            mySpeed = Number(mmap.get(loc_url.toString()));
        }
    }

}

(function() {
    setSpeed();
    document.onkeydown = function(event){
        if(event.keyCode==67 ){
            mySpeed = mySpeed+0.1;
            displayAlert("success", "加速0.1倍，当前："+Number(mySpeed.toFixed(1)).toString(), 200);
            mmap.set(loc_url,mySpeed);
            if(uuid != "") {
                GM_setValue(uuid.toString(),JSON.stringify(mmap));
            }
            setSpeed();
        }
        if(event.keyCode==88){
            mySpeed = mySpeed-0.1;
            displayAlert("success", "减速0.1倍，当前："+Number(mySpeed.toFixed(1)).toString(), 200);
            mmap.set(loc_url,mySpeed);
            if(uuid != "") {
                GM_setValue(uuid.toString(),JSON.stringify(mmap));
            }
            setSpeed();
        }

    }


})();