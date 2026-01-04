// ==UserScript==
// @name        喧嚣小镇--自动刷木材和陷阱
// @namespace   Violentmonkey Scripts
// @match       http://adarkroom.doublespeakgames.com/
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     4.0
// @author      -
// @description 2019/11/13 下午7:24:57
// @downloadURL https://update.greasyfork.org/scripts/392364/%E5%96%A7%E5%9A%A3%E5%B0%8F%E9%95%87--%E8%87%AA%E5%8A%A8%E5%88%B7%E6%9C%A8%E6%9D%90%E5%92%8C%E9%99%B7%E9%98%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/392364/%E5%96%A7%E5%9A%A3%E5%B0%8F%E9%95%87--%E8%87%AA%E5%8A%A8%E5%88%B7%E6%9C%A8%E6%9D%90%E5%92%8C%E9%99%B7%E9%98%B1.meta.js
// ==/UserScript==


//自动刷材料
var refresh_material_trigger = 0
var refresh_material_intervalID = 0
function refresh_material(){
  refresh_material_intervalID = setInterval(function () {
    document.getElementById("trapsButton").click()
    document.getElementById("gatherButton").click()
    document.getElementById("trapsButton").classList.remove("disabled")
    document.getElementById("gatherButton").classList.remove("disabled")
  }, 1)
}

GM_registerMenuCommand("自动刷材料开关", function(){
  if(refresh_material_trigger==1){
    refresh_material_trigger=0
    clearInterval(refresh_material_intervalID)
  }else{
    refresh_material_trigger=1
    refresh_material()
  }
})

//刷新出发
GM_registerMenuCommand("刷新出发", function(){
  document.getElementById("embarkButton").classList.remove("disabled")
})

//战斗0cd开关
var refresh_attack_trigger = 0
var refresh_attack_intervalID = 0
function refresh_attack(){
  refresh_attack_intervalID = setInterval(function () {
    document.getElementById("attack_bone-spear").click()
    document.getElementById("attack_bone-spear").classList.remove("disabled")
    document.getElementById("eat").classList.remove("disabled")
  }, 1);
}

GM_registerMenuCommand("战斗0cd开关", function(){
  if(refresh_attack_trigger==1){
    refresh_attack_trigger=0
    clearInterval(refresh_attack_intervalID)
  }else{
    refresh_attack_trigger=1
    refresh_attack()
  }
})





