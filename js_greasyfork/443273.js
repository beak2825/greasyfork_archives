// ==UserScript==
// @name         auto373input
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto fill 373 order input with config info
// @author       knightli
// @match        https://order.dd373.com/default/buy_form.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dd373.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443273/auto373input.user.js
// @updateURL https://update.greasyfork.org/scripts/443273/auto373input.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
.input-heler-container{
  position: fixed;
  top: 150px;
  left: 0px;
  background: white;
  border: gray 3px solid;
  z-index: 9999999999;
  font-size: 15px;
}
.input-heler-container button{
  display: block;
  min-width: 50px;
  margin: 20px 5px;
}
#configBtn{
  border: none;
  color: red;
  background: transparent;
}
#configBtn:hover{
  color: blue;
}
`);
    GM_config.init({
        'id': 'autoFillFormConfig_373',
        'title': '设置373下单页自动填充的信息',
        'fields': {
            'tag':{
                'label': '角色名',
                'type': 'text',
                'default': 'yourtag#1234'
            },
            'room':{
                'label': '房间名',
                'type': 'text',
                'default': 'mygameroom'
            },
            'pwd':{
                'label': '房间密码',
                'type': 'text',
                'default': 'roompwd'
            },
            'player':{
                'label': '人物昵称',
                'type': 'text',
                'default': 'playername'
            },
            'qq':{
                'label': 'QQ',
                'type': 'text',
                'default': '12345678'
            },
            'rooms':{
                'label': '预设一组房间',
                'type': 'textarea',
'default': `[
['thegame1','pwd1'],
['thegame2','pwd2'],
['thegame3','pwd3'],
['thegame3','pwd4']
]`
            }
        }
    });
    //try get rooms from GM_config
    var _rooms = [];
    try{
        _rooms = eval(GM_config.get('rooms'))
    }catch(e){
        console.log('GM_config.get rooms error');
        console.log(GM_config.get('rooms'));
    }
    //set config from GM_config
    var CONFIG = {
        tag: GM_config.get('tag'),
        room: GM_config.get('room'),
        pwd: GM_config.get('pwd'),
        player: GM_config.get('player'),
        qq: GM_config.get('qq'),
        rooms: _rooms
    }
    function setInput(room, pwd){
        // groupA: 0角色 1角色 2房间 3密码 4昵称
        var groupA = document.querySelectorAll('.fill-account-info input');
        if(groupA.length!=5) return;
        groupA[0].value = CONFIG.tag;
        groupA[1].value = CONFIG.tag;
        groupA[2].value = room ? room : CONFIG.room;
        groupA[3].value = pwd ? pwd : CONFIG.pwd;
        groupA[4].value = CONFIG.player;
        // groupB: 0 电话 1 QQ
        var groupB = document.querySelectorAll('.call-from input');
        if(groupB.length!=2) return;
        groupB[1].value = CONFIG.qq;
    }
    function initContainer(){
        var container = document.getElementById('input-heler-container');
        if(!container){
            container = document.body.appendChild(document.createElement('div'))
            container.setAttribute('id', 'input-heler-container');
            container.setAttribute('class', 'input-heler-container');
            var buttons = '';
            for(var i=0,len=CONFIG.rooms.length;i<len;i++){
                buttons += `
                <button data-n="${CONFIG.rooms[i].join('/')}">${CONFIG.rooms[i][0]}</button>
                `
            }
            container.innerHTML = `
            <div id="input-helper-buttons">
              ${buttons}
              <button data-n="${CONFIG.room+'/'+CONFIG.pwd}">${CONFIG.room}</button>
              <button id="configBtn">配置</a>
            </div>
            `
        }
        var btnContainer = document.getElementById('input-helper-buttons');
        btnContainer.addEventListener('click',function(e){
            var target = e.target;
            if(target.tagName.toLowerCase()=='button'){
                var n = target.dataset.n;
                console.log(n);
                if(!n){
                    if(target.id=='configBtn'){
                        GM_config.open();
                    }
                    return;
                };
                var arr = n.split('/');
                var room = arr[0];
                var pwd = arr[1];
                setInput(room,pwd);
            }
        });
        var configBtn = document.getElementById('configBtn');
        configBtn.addEventListener('click',function(e){
            GM_config.open();
        });
    }
    initContainer();
    let id=GM_registerMenuCommand ("设置", function(){
        GM_config.open();
    },null);
})();