// ==UserScript==
// @name         Realtime Damage
// @description  Realtime Damage~
// @namespace    https://screeps.com/
// @version      0.0.4
// @author       Jason_2070
// @match        https://screeps.com/a/*
// @match        https://screeps.com/season/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463494/Realtime%20Damage.user.js
// @updateURL https://update.greasyfork.org/scripts/463494/Realtime%20Damage.meta.js
// ==/UserScript==

$(function () {
  setInterval(() => {
      if(!$('section.game').length) return;
      if(!$('section.room').length) return;
      let gameEl = angular.element($('section.game'));
      let roomElem = angular.element($('section.room'));
      let roomScope = roomElem.scope();
      let room = roomScope.Room;
      let canvas = $('canvas.visual')[0];
      if (!canvas) {
          canvas = createCanvas();
      }
      addShowToggle();
      addChangeToggle();
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);

      let changeRole = roomScope.changeRole;
      let isEquals = (a, b) => changeRole ? a !== b : a === b;
      // 玩家ID
      let playerId = gameEl.scope().Game.player;
      let ownerId = null;
      let controller = room.roomController;
      if (controller) ownerId = controller.user; // 防守方优先为控制器所有者
      if (!ownerId) ownerId = (_.find(room.objects, e => e.type === 'tower') || {}).user; // 再次为塔的所有者 (bunker)
      if (!ownerId) ownerId = playerId; // 最后选自己为防守方
      let gameTime = room.gameTime;

      ctx.save();
      // 房间坐标集
      let roomMap = new RoomArray().init();
      // 塔算伤
      let towers = room.objects.filter(e => isEquals(e.user, ownerId) && e.type === 'tower' && e.store.energy >= 10 && e._isDisabled === false);
      towers.forEach(e => {
          let effect = 1;
          if (e.effects) {
              effect *= 1 + 0.1 * ((_.find(e.effects, e => e.power === 3 && e.endTime > gameTime) && _.find(e.effects, e => e.power === 3).level) || 0);
              effect *= 1 - 0.1 * ((_.find(e.effects, e => e.power === 10 && e.endTime > gameTime) && _.find(e.effects, e => e.power === 10).level) || 0);
          }
          e.effect = effect;
      });
      roomMap.forEach((x, y) => {
          let hits = _.sum(towers.map(e => e.effect * calTowerDamage(Math.max(Math.abs(e.x-x),Math.abs(e.y-y)))));
          roomMap.set(x, y, hits);
      });
      // 房间主防爬算伤
      let creeps = room.objects.filter(e => isEquals(e.user, ownerId) && e.type === 'creep' && !e.spawning && e._isDisabled === false);
      creeps.forEach(e => {
          let attackHits = _.sum(_.values(e.body).filter(e => e.type === 'attack' && e.hits > 0).map(e => (boost_power[e.boost] || 1) * 30));
          attackHits > 0 && nearPos(e.x, e.y, 1).forEach(pos => {
              roomMap.set(pos.x, pos.y, roomMap.get(pos.x, pos.y) + attackHits);
          });
          let rangedAttackHits = _.sum(_.values(e.body).filter(e => e.type === 'ranged_attack' && e.hits > 0).map(e => (boost_power[e.boost] || 1) * 10));
          rangedAttackHits > 0 && nearPos(e.x, e.y, 3).forEach(pos => {
              roomMap.set(pos.x, pos.y, roomMap.get(pos.x, pos.y) + rangedAttackHits);
          });
          // 可能还有红球攻击红球的反伤伤害
      });
      roomMap.forEach((x, y) => {
          let hits = roomMap.get(x, y);
          if (hits > 0) writeHit(ctx, hits, x, y, getHitColor(hits));
      });

      // 房间所有爬的治疗
      let healCreeps = room.objects.filter(e => e.type === 'creep' && !e.spawning && e._isDisabled === false);
      healCreeps.forEach(e => {
          let healHits = _.sum(_.values(e.body).filter(e => e.type === 'heal' && e.hits > 0).map(e => (boost_power[e.boost] || 1) * 12));
          if (healHits > 0) writeHeal(ctx, healHits, e.x, e.y, 'lime');
          // TODO 小队回血预测? 计算最大治疗量
      });

      // 房间敌对爬的减伤 (计算真实伤害)
      let toughCreeps = room.objects.filter(e => !isEquals(e.user, ownerId) && e.type === 'creep' && !e.spawning && e._isDisabled === false);
      toughCreeps.forEach(e => {
          let fullHits = roomMap.get(e.x, e.y); // 未减伤前最大伤害
          if (!fullHits) return; // 无伤害
          let realHits = 0;
          _.values(e.body).forEach(part => {
              if (part.hits < 0) return;
              if (fullHits < 0) return;  // 已经算完伤害了
              if (part.type != 'tough' || !part.boost) { // 无减伤效果
                  fullHits -= part.hits;
                  realHits += part.hits;
                  if (fullHits < 0) realHits += fullHits; // 伤害补正
              } else {
                  fullHits -= part.hits / boost_power[part.boost];
                  realHits += part.hits;
                  if (fullHits < 0) realHits += fullHits * boost_power[part.boost]; // 伤害补正
              }
          });
          // fullhits 没归0的话, 计入真实伤害, 爬血量会变负数 (如果自己治疗自己或旁边有爬治疗自己, 可以把负数血回成正数)
          if (fullHits > 0) realHits += fullHits;
          if (realHits > 0) writeTough(ctx, Math.floor(realHits), e.x, e.y, 'white');
      });
      ctx.restore();
  }, 1000);
});

function createCanvas(){
  let roomScope = angular.element($('section.room')).scope();
  let $compile = angular.element($('section.game')).injector().get('$compile');
  let canvas = $('<canvas ng-show="showVisual"></canvas>')[0];
  canvas.className = 'visual';
  canvas.width = 2500;
  canvas.height = 2500;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  $compile($(canvas))(roomScope);
  $('div.pixijs-renderer__stage').append(canvas);
  return canvas;
}

function addShowToggle(){
  if($('.visualToggle').length) return;
  let roomScope = angular.element($('section.room')).scope();
  roomScope.showVisual = false;
  let room = roomScope.Room;
  let cont = $('.invasion .aside-block-container .aside-block-content');
  if (!cont.length) return;
  let $compile = angular.element(cont).injector().get('$compile');
  let elem = $('<md-checkbox class="md-primary visualToggle" ng-model="showVisual">实时算伤</md-checkbox>');
  $compile(elem)(roomScope);
  elem.appendTo(cont);
}
function addChangeToggle(){
  if($('.changeToggle').length) return;
  let roomScope = angular.element($('section.room')).scope();
  roomScope.changeRole = false;
  let room = roomScope.Room;
  let cont = $('.invasion .aside-block-container .aside-block-content');
  if (!cont.length) return;
  let $compile = angular.element(cont).injector().get('$compile');
  let elem = $('<br/><md-checkbox class="md-primary changeToggle" ng-show="showVisual" ng-model="changeRole">攻防角色对调</md-checkbox>');
  $compile(elem)(roomScope);
  elem.appendTo(cont);
}

function getHitColor(hits) {
    if(hits >= 3600) return "fuchsia";
    else if(hits >= 3000) return "cyan";
    else if(hits >= 2400) return "pink";
    else if(hits >= 1800) return "red";
    else if(hits >= 1200) return "BlueViolet";
    else return "black";
}

function writeHit(ctx, hit, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "18px Arial";
    ctx.fillText(hit.toFixed(0), x * 50 + 5, y * 50 + 30);
}
function writeHeal(ctx, hit, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "18px Arial";
    ctx.fillText(hit.toFixed(0), x * 50 + 5, y * 50 + 47);
}
function writeTough(ctx, hit, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "18px Arial";
    ctx.fillText(hit.toFixed(0), x * 50 + 5, y * 50 + 16);
}

function calTowerDamage(dist) {
    if (dist <= 5) return 600;
    else if (dist <= 20) return 600 - (dist - 5) * 30;
    else return 150;
}
let boost_power = {"UH":2,"UH2O":3,"XUH2O":4,"KO":2,"KHO2":3,"XKHO2":4,"LO":2,"LHO2":3,"XLHO2":4,"LO":2,"LHO2":3,"XLHO2":4,"GO":0.7,"GHO2":0.5,"XGHO2":0.3};

function nearPos(x, y, range=1) {
    let arr = [];
    for(let i = -range; i <= range; i++){
        for(let j = -range; j <= range; j++){
            if(x + i >= 0 && y + j >= 0 && x + i <= 49 && y + j <= 49) arr.push({x: x + i, y: y + j});
        }
    }
    return arr;
}

let RoomArray_proto= {
    get(x,y){
        return this.arr[x*50+y];
    },
    set(x,y,value){
        this.arr[x*50+y]=value;
    },
    init(){
        if(!this.arr)
            this.arr = new Array(50*50)
        for(let i=0;i<2500;i++){
            this.arr[i]=0;
        }
        return this;
    },
    forEach(func){
        for(let y = 0; y < 50; y++) {
            for(let x = 0; x < 50; x++) {
                func(x,y,this.get(x,y))
            }
        }
    }
}
class RoomArray {
    constructor(){
        this.__proto__ = RoomArray_proto
    }
}
