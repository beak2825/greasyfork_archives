// ==UserScript==
// @name         63bot tools
// @description  63bot tools~
// @namespace    https://screeps.com/
// @version      0.1.3
// @author       Jason_2070
// @match        https://screeps.com/a/*
// @match        https://screeps.com/season/*
// @match        http://127.0.0.1/a/*
// @match        http://121.5.170.187/a/*
// @match        http://47.108.81.76/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464091/63bot%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/464091/63bot%20tools.meta.js
// ==/UserScript==
 
let playerId = '1';
let lastSelectObj = null;
let shareToken = {
    // 用于快速切号和跨号手操
    // 格式 'id': 'token'
}
$(function () {
    // 1. 显示角色, 显示任务
    // 2. 显示任务旗帜名字, 点击修改旗帜位置
    // 3. store 排序
    // 4. 可点击方向进行微手操
    // 5. 小队 flag 手操面板
    let _any = null;
    // 修改地图玩家颜色
    window.hsl2rgbArr = function() {
        return [Math.floor(64 + Math.random() * 192),Math.floor(64 + Math.random() * 192),Math.floor(64 + Math.random() * 192)]
    }
 
    // 跳过教程
    localStorage.setItem('tutorialVisited', 'true');
    // 清除 memory.watches 缓解卡顿
    localStorage.setItem('memory.watches', '[]');

    let _cloneDeep = null;
    if (!_cloneDeep && _ && _.cloneDeep) {
        _cloneDeep = _.cloneDeep;
        _.cloneDeep = function(...obj) {
            if (obj[0]?.objects?.nuke?.processors) {
                // obj[0].objects.nuke.processors = [obj[0].objects.nuke.processors[6]];
                obj[0].objects.nuke.calculations[0].func = ()=>{return 0}
            }
            return _cloneDeep(...obj);
        }
    }

    // 监听键盘输入
    // listenKeyPress();

    // 监听429请求码
    // hookXHRStatus();

    setInterval(() => {
        // 去除 re 按钮
        $('.dropdown-menu .profile-options .respawn').hide();
 
        // 修改地图玩家颜色
        if (!_any && _ && _.any) {
            _any = _.any;
            _.any = function(...obj) {
                if (obj[0] && obj[0].pb && obj[0].m && obj[0].s && obj[0].c) {
                    obj[0]['589f5265d25357e8253e3ee8'] = [255, 0, 0]; // tigga
                }
                return _any(...obj);
            }
        }
 
        // 快速切号
        if (window.location.hash.startsWith('#!/profile/')) {
            try {
                let userid = JSON.parse($('app2-profile-seasonal-world').attr('user'))._id;
                if (!$('#profile-id').length) $('.profile-title')[0].appendChild($(`<div id="profile-id">${userid}</div>`)[0]);
                if (playerId != userid) {
                    playerId = userid;
                    let token = shareToken[playerId];
                    if (token) {
                        if (window.localStorage.getItem('auth') != `"${token}"`) {
                            if (confirm('确认切换账号?')) {
                                setTimeout(() => {
                                    window.localStorage.setItem('auth', `"${token}"`);
                                    window.open('https://screeps.com/a/#!/account/auth-tokens/noratelimit?token=' + token, '_blank');
                                    window.location.reload();
                                }, 1000);
                            }
                        }
                    }
                }
            } catch(e) {}
            return;
        }
 
        if(!$('section.game').length) return;
        if(!$('section.room').length) return;
        let gameEl = angular.element($('section.game'));
        let roomElem = angular.element($('section.room'));
        let roomScope = roomElem.scope();
        let room = roomScope.Room;
        playerId = gameEl.scope().Game.player;
        // 选择 creep 时
        selectCreep(room);
        // 选择 store 时
        selectStore(room);
        // 选择 flag 时
        selectFlag(room);
 
        let selectObj = room.selectedObject;
        if (selectObj) {
            try {
                //navigator.clipboard.writeText(selectObj._id).then(() => console.log("复制成功！"));
            }catch(e){
                console.log(e);
            }
            lastSelectObj = selectObj.name;
        } else {
            lastSelectObj = null;
        }
  }, 500);
});
 
// 选择 Creep 时
function selectCreep(room) {
    let selectObj = room.selectedObject;
    if (selectObj && (selectObj.user === playerId || shareToken[selectObj.user]) && selectObj.type === 'creep' && selectObj.name != lastSelectObj) {
        lastSelectObj = selectObj.name;
        // 读取内存
        getMemory(`creeps.${selectObj.name}`, room.shardName, shareToken[selectObj.user], data => {
            let creepMemory = JSON.parse(data);
            console.log(selectObj.name, creepMemory);
            let roleName = creepMemory.role;
            let taskList = creepMemory.tasks;
            modifyCreepPanel(room, selectObj.name, roleName, taskList, shareToken[selectObj.user] || '');
        });
    }
}
 
// 修改 Creep 面板
function modifyCreepPanel(room, creepName, roleName, taskList, token) {
    // 隐藏爬皮
    let decoration = $('.object-properties .body .room-decoration');
    if (decoration && decoration.length > 0) decoration.parent().hide();
    // 判断现在是不是选择了 Creep
    let selectType = $('.object-properties .aside-block-header').text().trim();
    if (selectType !== 'Creep') return;
    // 获取爬名
    let selectCreepName = null;
    let creepProp = $('.object-properties .aside-block-container .aside-block-content > .ng-scope > .ng-binding');
    let creepNameProp = null;
    creepProp.each((i,e) => {
        let propText = $(e).text().trim();
        if (propText.startsWith('Name:')) {
            creepNameProp = $(e);
        }
    });
    if (!creepNameProp) return;
    selectCreepName = creepNameProp.text().trim();
    selectCreepName = selectCreepName.slice(selectCreepName.indexOf(':') + 1).trim();
    if (selectCreepName !== creepName) return; // 爬切换走了
 
    let roleNameHtml = `<div class="ng-binding" style="white-space: nowrap;"><label>RoleName:</label>${roleName}</div>`;
    let lastTask = taskList && taskList.at(-1);
    let lastTaskName = lastTask ? lastTask.taskName : 'empty';
    let taskNameHtml = `<div class="ng-binding" style="white-space: nowrap;"><label>LastTask:</label>${lastTaskName}</div>`;
    let flagNameHtml = '';
    let taskFlag = lastTask && !lastTask.roomName ? lastTask.id : null; // 任务目标是旗帜类型
    if (taskFlag) {
        let flag = getFlag(taskFlag); // 如果房间内找不到这个旗帜, 颜色就只能默认变为白色了
        flag.user = playerId;
        let handleClick = flag._id ? `angular.element($('section.room')).scope().Room.selectedObject = ${JSON.stringify(flag).replaceAll('"', '\'')}` :
        `angular.element($('section.room')).scope().Room.selectedAction.changeFlag = {name: '${taskFlag}', color: ${flag.color}, secondaryColor: ${flag.secondaryColor}}`;
        flagNameHtml = taskFlag ? `<div class="ng-binding" style="white-space: nowrap;cursor: pointer;" onclick="${handleClick}"><label>Flag:</label>${taskFlag}</div>` : '';
    }
    creepNameProp.after(roleNameHtml + taskNameHtml + flagNameHtml);
 
    // 移动手操面板
    let moveCommend = `(Creep.prototype.moveSwap || Creep.prototype.move).call(Game.creeps[\\'${selectCreepName}\\'], DIRECTION) == OK ? \\'${selectCreepName} move [DIRECTION] success in \\' + Game.time : \\'${selectCreepName} move [DIRECTION] failed.\\'`;
    $('.object-properties .body .bodypart').parent().after(`<div class="body">
    <label class="body-header">Control</label>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="8" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 8)}', '${room.shardName}', '${token}')">↖</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="1" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 1)}', '${room.shardName}', '${token}')">↑</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="2" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 2)}', '${room.shardName}', '${token}')">↗</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="7" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 7)}', '${room.shardName}', '${token}')">←</button>
    <div style="width: 30px;display: inline-block;">&nbsp;</div>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="3" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 3)}', '${room.shardName}', '${token}')">→</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="6" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 6)}', '${room.shardName}', '${token}')">↙</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="5" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 5)}', '${room.shardName}', '${token}')">↓</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="4" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 4)}', '${room.shardName}', '${token}')">↘</button>
</div>
`);
 
}
 
// 获取旗帜信息
function getFlag(flagName) {
    let flagList = angular.element($('section.room')).scope().Room.flags;
    let flags = flagList.filter(e => e.name === flagName);
    if (flags && flags.length === 1) return flags[0];
    return { name:flagName, color:10, secondaryColor:10, type:"flag", x:0, y:0 };
}
 
let storeSort = ['energy','power','ops','battery','H','O','U','L','K','Z','X','G','reductant','oxidant','utrium_bar','lemergium_bar','keanium_bar','zynthium_bar','ghodium_melt','purifier','OH','ZK','UL','UH','KH','LH','ZH','GH','UO','KO','LO','ZO','GO','UH2O','KH2O','LH2O','ZH2O','GH2O','UHO2','KHO2','LHO2','ZHO2','GHO2','XUH2O','XKH2O','XLH2O','XZH2O','XGH2O','XUHO2','XKHO2','XLHO2','XZHO2','XGHO2','silicon','metal','biomass','mist','composite','crystal','liquid','wire','switch','transistor','microchip','circuit','device','cell','phlegm','tissue','muscle','organoid','organism','alloy','tube','fixtures','frame','hydraulics','machine','condensate','concentrate','extract','spirit','emanation','essence'];
let storeSort2 = ['energy','power','ops','battery','hydrogen','oxygen','utrium','lemergium','keanium','zynthium','catalyst','ghodium','reductant','oxidant','utrium bar','lemergium bar','keanium bar','zynthium bar','ghodium melt','purifier','hydroxide','zynthium keanite','utrium lemergite','utrium hydride','keanium hydride','lemergium hydride','zynthium hydride','ghodium hydride','utrium oxide','keanium oxide','lemergium oxide','zynthium oxide','ghodium oxide','utrium acid','keanium acid','lemergium acid','zynthium acid','ghodium acid','utrium alkalide','keanium alkalide','lemergium alkalide','zynthium alkalide','ghodium alkalide','catalyzed utrium acid','catalyzed keanium acid','catalyzed lemergium acid','catalyzed zynthium acid','catalyzed ghodium acid','catalyzed utrium alkalide','catalyzed keanium alkalide','catalyzed lemergium alkalide','catalyzed zynthium alkalide','catalyzed ghodium alkalide','silicon','metal','biomass','mist','composite','crystal','liquid','wire','switch','transistor','microchip','circuit','device','cell','phlegm','tissue','muscle','organoid','organism','alloy','tube','fixtures','frame','hydraulics','machine','condensate','concentrate','extract','spirit','emanation','essence'];
// 选择 store 时
function selectStore(room) {
    let selectObj = room.selectedObject;
    if (selectObj && selectObj.store && !selectObj.isModify) {
        // 对缓存对象排序
        selectObj.isModify = true;
        let newStore = {};
        _.keys(selectObj.store).sort((a, b) => storeSort.indexOf(a) - storeSort.indexOf(b)).forEach(e => {
            newStore[e] = selectObj.store[e];
        });
        selectObj.store = newStore;
        // 对 html 元素排序
        let resourceList = $('.aside-block-content .body table.carry-resource tbody tr');
        resourceList.sort((a, b) => storeSort2.indexOf($(a).find('img.resource-type')[0].getAttribute('uib-tooltip')) -
            storeSort2.indexOf($(b).find('img.resource-type')[0].getAttribute('uib-tooltip')));
        resourceList.detach().appendTo('.aside-block-content .body table.carry-resource tbody');
    }
}
 
// 选择 flag 时
function selectFlag(room) {
    let selectObj = room.selectedObject;
    if (selectObj && selectObj.type === 'flag' && selectObj.name != lastSelectObj) {
        lastSelectObj = selectObj.name;
        if (selectObj.name.startsWith('team_')) {
            getMemory(`flags.${selectObj.name}`, room.shardName, null, data => {
                let flagMemory = JSON.parse(data);
                // team_* moveOnly stopMove attackMode
                modifyFlagPanel(room, selectObj.name, flagMemory);
            });
        }
        if (selectObj.name.startsWith('teamL')) {
            getMemory(`flags.${selectObj.name}`, room.shardName, null, data => {
                let flagMemory = JSON.parse(data);
                // teamL_* attackMode
                modifyTeamFlagPanel(room, selectObj.name, flagMemory);
            });
        }
    }
}
 
// 修改 Flag 面板
function modifyFlagPanel(room, flagName, flagMemory) {
    // 判断现在是不是选择了 Creep
    let selectType = $('.object-properties .aside-block-header').text().trim();
    if (selectType !== 'Flag') return;
    // 获取 Flag 名
    let selectFlagName = null;
    let flagProp = $('.object-properties .aside-block-container .aside-block-content > .ng-scope > .ng-binding');
    let flagNameProp = null;
    flagProp.each((i,e) => {
        let propText = $(e).text().trim();
        if (propText.startsWith('Name:')) {
            flagNameProp = $(e);
        }
    });
    if (!flagNameProp) return;
    selectFlagName = flagNameProp.text().trim();
    selectFlagName = selectFlagName.slice(selectFlagName.indexOf(':') + 1).trim();
    if (selectFlagName !== flagName) return; // flag 切换走了
 
    let roomScope = angular.element($('section.room')).scope();
    roomScope.moveOnly = flagMemory.moveOnly || false;
    roomScope.stopMove = flagMemory.stopMove || false;
    roomScope.forceStructs = flagMemory.forceStructs || false;
    roomScope.attackMode = flagMemory.attackMode || 'delete';
    roomScope.changeMemory = (flagName, key, shardName) => {
        if (roomScope[key] !== 'delete') {
            let value = typeof roomScope[key] === 'string' ? `'${roomScope[key]}'` : roomScope[key];
            window.sendConsoleCommand(`Memory.flags['${flagName}']['${key}'] = ${value}; "Change ${flagName} - ${key} to ${value}!"`, shardName);
        } else {
            window.sendConsoleCommand(`delete Memory.flags['${flagName}']['${key}']; "Delete ${flagName} - ${key}!"`, shardName);
        }
    }
    // 手操面板
    let moveCommend = `\\'Team move [DIRECTION] success in: \\' + (Game.flags[\\'${flagName}\\']._creeps && !Game.flags[\\'${flagName}\\']._creeps.find(e => e.fatigue > 0) ? Game.flags[\\'${flagName}\\']._creeps : []).filter(e => e.move(DIRECTION) == OK).length`;
    let elem = $(`<div class="body">
    <label class="body-header">Control</label>
    <div class="ng-binding"><label>Attack mode</label></div>
    <md-radio-group style="display: grid;grid-template-columns: 50% 50%;" ng-model="attackMode" ng-change="changeMemory('${flagName}', 'attackMode', '${room.shardName}')">
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="delete">auto</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="attack">attack</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="line">line</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="flee">flee</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="rash">rash</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="tank">tank</md-radio-button>
    </md-radio-group>
    <md-checkbox class="md-primary changeToggle" style="margin: 5px 0;" ng-model="moveOnly" ng-change="changeMemory('${flagName}', 'moveOnly', '${room.shardName}')">moveOnly</md-checkbox><br/>
    <md-checkbox class="md-primary changeToggle" style="margin: 5px 0;" ng-model="stopMove" ng-change="changeMemory('${flagName}', 'stopMove', '${room.shardName}')">stopMove</md-checkbox><br/>
    <md-checkbox class="md-primary changeToggle" style="margin: 5px 0;" ng-model="forceStructs" ng-change="changeMemory('${flagName}', 'forceStructs', '${room.shardName}')">forceStructs</md-checkbox><br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="8" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 8)}', '${room.shardName}')">↖</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="1" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 1)}', '${room.shardName}')">↑</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="2" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 2)}', '${room.shardName}')">↗</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="7" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 7)}', '${room.shardName}')">←</button>
    <div style="width: 30px;display: inline-block;">&nbsp;</div>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="3" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 3)}', '${room.shardName}')">→</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="6" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 6)}', '${room.shardName}')">↙</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="5" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 5)}', '${room.shardName}')">↓</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="4" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 4)}', '${room.shardName}')">↘</button>
</div>
`);
    let $compile = angular.element(flagNameProp).injector().get('$compile');
    $compile(elem)(roomScope);
    flagNameProp.after(elem);
}
 
// 修改 TeamFlag 面板
function modifyTeamFlagPanel(room, flagName, flagMemory) {
    // 判断现在是不是选择了 Creep
    let selectType = $('.object-properties .aside-block-header').text().trim();
    if (selectType !== 'Flag') return;
    // 获取 Flag 名
    let selectFlagName = null;
    let flagProp = $('.object-properties .aside-block-container .aside-block-content > .ng-scope > .ng-binding');
    let flagNameProp = null;
    flagProp.each((i,e) => {
        let propText = $(e).text().trim();
        if (propText.startsWith('Name:')) {
            flagNameProp = $(e);
        }
    });
    if (!flagNameProp) return;
    selectFlagName = flagNameProp.text().trim();
    selectFlagName = selectFlagName.slice(selectFlagName.indexOf(':') + 1).trim();
    if (selectFlagName !== flagName) return; // flag 切换走了
 
    let roomScope = angular.element($('section.room')).scope();
    roomScope.attackMode = flagMemory.attackMode || 'delete';
    roomScope.changeMemory = (flagName, key, shardName) => {
        if (roomScope[key] !== 'delete') {
            let value = typeof roomScope[key] === 'string' ? `'${roomScope[key]}'` : roomScope[key];
            window.sendConsoleCommand(`Memory.flags['${flagName}']['${key}'] = ${value}; "Change ${flagName} - ${key} to ${value}!"`, shardName);
        } else {
            window.sendConsoleCommand(`delete Memory.flags['${flagName}']['${key}']; "Delete ${flagName} - ${key}!"`, shardName);
        }
    }
    // 手操面板  && e.room.name == flag.pos.roomName
    let moveCommend = `let flag = Game.flags[\\'${flagName}\\'];let creeps = _.flatten((Game.flags[\\'${flagName}\\'].memory.teamFlags || []).map(e => Game.flags[e]).filter(e => e && e.memory.stopMove).map(e => e._creeps)).filter(e => e);\\'TeamL move [DIRECTION] success in: \\' + (!creeps.find(e => e.fatigue > 0) ? creeps : []).filter(e => e.move(DIRECTION) == OK).length`;
    let elem = $(`<div class="body">
    <label class="body-header">Control</label>
    <div class="ng-binding"><label>Attack mode</label></div>
    <md-radio-group style="display: grid;grid-template-columns: 50% 50%;" ng-model="attackMode" ng-change="changeMemory('${flagName}', 'attackMode', '${room.shardName}')">
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="delete">auto</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="attack">attack</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="line">line</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="flee">flee</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="rash">rash</md-radio-button>
        <md-radio-button class="md-primary md-hue-1" style="margin: 5px 0;" value="tank">tank</md-radio-button>
    </md-radio-group>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="8" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 8)}', '${room.shardName}')">↖</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="1" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 1)}', '${room.shardName}')">↑</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="2" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 2)}', '${room.shardName}')">↗</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="7" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 7)}', '${room.shardName}')">←</button>
    <div style="width: 30px;display: inline-block;">&nbsp;</div>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="3" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 3)}', '${room.shardName}')">→</button>
    <br/>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="6" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 6)}', '${room.shardName}')">↙</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="5" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 5)}', '${room.shardName}')">↓</button>
    <button class="md-primary md-hue-1 md-button md-raised" style="width: 30px;height: 30px;" type="button" arrow="4" onclick="window.sendConsoleCommand('${moveCommend.replaceAll('DIRECTION', 4)}', '${room.shardName}')">↘</button>
</div>
`);
    let $compile = angular.element(flagNameProp).injector().get('$compile');
    $compile(elem)(roomScope);
    flagNameProp.after(elem);
}
 
// 读取内存
function getMemory(path, shardName, token, callback) {
    let url = `${window.location.origin}${shardName == 'shardSeason' ? '/season':''}/api/user/memory?path=${path.replace(/&/g, '%26')}&shard=${shardName}`;
    token = token || (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
                let gzipStr = data.data.replace('gz:','');
                let gzipData = new Uint8Array(atob(gzipStr).split('').map(char => char.charCodeAt(0)));
                let uncompressedData = pako.inflate(gzipData, { to: 'string' });
                if (uncompressedData) callback && callback(uncompressedData);
            }
        }
    });
}

function listenKeyPress() {
    let press = new Set();
    let arrowWhich = [37,38,39,40];
    let pressArrow = false;
    $(document).keydown(function(event){
        try {
            if (arrowWhich.includes(event.which)) {
                press.add(((event.which - 37) * 2 + 7) % 8);
                setTimeout(() => {
                    pressArrow = true;
                }, 500);
            }
        } catch(e) {}
    });
    $(document).keyup(function(event){
        try {
            if (event.which == 189) {
                // -
                angular.element($('section.room')).scope() && angular.element($('section.room')).scope().Room.zoomOut();
                angular.element($('section.world-map')).scope() && angular.element($('section.world-map')).scope().WorldMap.zoomChange(-1)
            } else if (event.which == 187) {
                // +
                angular.element($('section.room')).scope() && angular.element($('section.room')).scope().Room.zoomIn();
                angular.element($('section.world-map')).scope() && angular.element($('section.world-map')).scope().WorldMap.zoomChange(1)
            }
            if (arrowWhich.includes(event.which)) {
                press.delete(((event.which - 37) * 2 + 7) % 8);
            }
        } catch(e) {}
    });
    setInterval(() => {
        if (pressArrow) {
            if (press.size > 0) {
                let result = null;
                if (press.size == 1) {
                    result = [...press][0];
                } else if (press.size == 2) {
                    let arrowList = [...press].sort((a, b) => a - b);
                    if (arrowList[0] == 1 && arrowList[1] == 3) result = 2;
                    else if (arrowList[0] == 3 && arrowList[1] == 5) result = 4;
                    else if (arrowList[0] == 5 && arrowList[1] == 7) result = 6;
                    else if (arrowList[0] == 1 && arrowList[1] == 7) result = 8;
                }
                if (result) {
                    console.log('move', result);
                    let btn = $(`button[arrow=${result}]`);
                    if (btn) {
                        btn.css('background-color', '#ff7378')
                        btn.click();
                        setTimeout(() => btn.css('background-color', 'rgb(121,134,203)'), 200);
                    }
                }
            } else {
                pressArrow = false;
            }
        }
    }, 1000);
}

let lastOpen = 0;
function hookXHRStatus() {
    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "status"
        ).get;
        Object.defineProperty(xhr, "status", {
            get: () => {
                let result = getter.call(xhr);
                if (document.visibilityState == 'visible' && result == 429 && lastOpen < Date.now() - 60000) {
                    lastOpen = Date.now();
                    let token = (localStorage.getItem('auth') || '').replaceAll('"', '');
                    window.open('https://screeps.com/a/#!/account/auth-tokens/noratelimit?token=' + token, '_blank');
                }
                return result;
            },
        });
        return xhrOpen.apply(xhr, arguments);
    };
}

// 发送控制台指令
window.sendConsoleCommand = (command, shardName, token) => {
    let url = `${window.location.origin}${shardName == 'shardSeason' ? '/season':''}/api/user/console`;
    token = token || (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({"expression":command,"shard":shardName}),
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
                console.log(data)
            }
        }
    });
}