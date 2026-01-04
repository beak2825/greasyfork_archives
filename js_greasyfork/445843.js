// ==UserScript==
// @name        染·钟楼谜团魔典-添加座位
// @namespace   name.mrzc.clocktower
// @match       http*://www.imdodo.com/tools/clocktower/
// @match       http*://clocktower.gstonegames.com/grimoire/
// @match       http*://clocktower.haoshuo.com/
// @match       http*://app.gamersky.com/db/clocktower/
// @match       http*://clock-tower.imdodo.com/
// @match       http*://clocktower.top/game/
// @match       http*://clocktower.online/
// @match       http*://www.gudutrpg.com/home/
// @grant       GM.registerMenuCommand
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js 
// @version     1.2
// @author      mrzc
// @description 2022/6/3 16:18:06
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/445843/%E6%9F%93%C2%B7%E9%92%9F%E6%A5%BC%E8%B0%9C%E5%9B%A2%E9%AD%94%E5%85%B8-%E6%B7%BB%E5%8A%A0%E5%BA%A7%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445843/%E6%9F%93%C2%B7%E9%92%9F%E6%A5%BC%E8%B0%9C%E5%9B%A2%E9%AD%94%E5%85%B8-%E6%B7%BB%E5%8A%A0%E5%BA%A7%E4%BD%8D.meta.js
// ==/UserScript==


const noNameHosts = [
  // "app.gamersky.com",
  "clocktower.top",
  "clocktower.online",
  "clock-tower.imdodo.com",
  "www.gudutrpg.com"
]

const hostname = location.hostname
const noNameFlag = noNameHosts.some(item => item == hostname)



function getNames(length, _names) {
  const names = _names || new Array(length)
  for(let i = 0; i< length; i++) {
    const oldName = names[i] || ' '
    names[i] = oldName
    if(noNameFlag) {
      names[i] = (i + 1) + '  '+ oldName
    }
  }
  return names
}

function _addPlayers(value) {

  let num = 0;
  let names = []
  if(isNaN(value)) {
    names = value.split(/[,.，。;；]/)
    num = names.length
  } else {
    num =  parseInt(value)
  }
  names = getNames(num, names)
  const that = app.__vue__
  const players = that.players
  if(players) {
    if (players.length >= 20) return;
    if (that.session.isSpectator) return;
    if(num + players.length > 20) num = 20 - players.length;
  } else if(num > 20) num = 20;

  const addPlayer = (name)=> {
    that.$store.commit("players/add", name);
  }

  for(let i = 0; i< num; i++) {
    addPlayer(names[i])
  }
}

function _clearPlayers() {
  const that = app.__vue__
  const players = that.players
  if(players) {
    if (that.session.isSpectator) return;
    if (that.session.nomination) {
      that.$store.commit("session/nomination");
    }
  }
  that.$store.commit("players/clear");
}

function addPlayers() {
  const value = prompt("新加玩家，请输入数量，或者姓名")
  if(!value) {
    return
  }
  _addPlayers(value)
}

function clearPlayers() {
  if(!confirm("是否清空")) {
    return false
  }
  _clearPlayers()
}

function resetPlayers() {
  const value = prompt("清空现有并重新添加，请输入数量，或者姓名")
  if(!value) {
    return
  }
  _clearPlayers()
  _addPlayers(value)
}

function isPc() {
   var userAgentInfo = navigator.userAgent;
   var Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
   for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
         return false;
      }
   }
   return true;
}

GM.registerMenuCommand('清空', clearPlayers)
GM.registerMenuCommand('添加', addPlayers)
GM.registerMenuCommand('重置', resetPlayers)

function registerKey() {
  $(document).keydown(function(event){
    if(!event.shiftKey){
        return
    }
    event.preventDefault()
    if(['a', 'A'].includes(event.key)) {
      addPlayers()
    }
    if(['c', 'C'].includes(event.key)) {
      clearPlayers()
    }
    if(['r', 'R'].includes(event.key)) {
      resetPlayers()
    }
  });
}




if(isPc()) {
  console.log("PC 不添加 特别丑的 按钮，注册快捷键，添加 Shift+A；清空 Shift+C；重置 Shift+R")
  registerKey()
  return
}

setTimeout(()=> {

  $("body").append("<div id ='myApp' style='right: 10px;bottom: 10px;color: #ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 5px;text-align: center;width: 50px;height: 110px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'/>");  const clearButton = $("<button class='button'>清空</button>")
  clearButton.click(clearPlayers)
  $("#myApp").append(clearButton)
  const addButton = $("<button class='button'>添加</button>")
  addButton.click(addPlayers)
  $("#myApp").append(addButton)
  const resetButton = $("<button class='button'>重置</button>")
  resetButton.click(resetPlayers)
  $("#myApp").append(resetButton)
  
}, 150);

