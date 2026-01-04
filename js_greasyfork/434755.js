// ==UserScript==
// @name         Hordes GGGG
// @version      0.2
// @description  Autoloot + AntiAfk + ItemUniting.
// @author       0vC4
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?domain=hordes.io
// @grant        none
// @namespace https://greasyfork.org/users/670183
// @downloadURL https://update.greasyfork.org/scripts/434755/Hordes%20GGGG.user.js
// @updateURL https://update.greasyfork.org/scripts/434755/Hordes%20GGGG.meta.js
// ==/UserScript==




// WorkerTimer
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).WorkerTimer=e()}}(function(){return function o(i,s,l){function u(r,e){if(!s[r]){if(!i[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(f)return f(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var a=s[r]={exports:{}};i[r][0].call(a.exports,function(e){var t=i[r][1][e];return u(t||e)},a,a.exports,o,i,s,l)}return s[r].exports}for(var f="function"==typeof require&&require,e=0;e<l.length;e++)u(l[e]);return u}({1:[function(e,r,t){(function(e){"use strict";var t,n,a,o;e===e.window&&e.URL&&e.Blob&&e.Worker?r.exports=(t=["var timerIds = {}, _ = {};","_.setInterval = function(args) {","  timerIds[args.timerId] = setInterval(function() { postMessage(args.timerId); }, args.delay);","};","_.clearInterval = function(args) {","  clearInterval(timerIds[args.timerId]);","};","_.setTimeout = function(args) {","  timerIds[args.timerId] = setTimeout(function() { postMessage(args.timerId); }, args.delay);","};","_.clearTimeout = function(args) {","  clearTimeout(timerIds[args.timerId]);","};","onmessage = function(e) { _[e.data.type](e.data) };"].join(""),n=0,a={},(o=new e.Worker(e.URL.createObjectURL(new e.Blob([t],{type:"text/javascript"})))).onmessage=function(e){a[e.data]&&a[e.data].callback.apply(null,a[e.data].params)},{setInterval:function(e,t){var r=Array.prototype.slice.call(arguments,2);return n+=1,o.postMessage({type:"setInterval",timerId:n,delay:t}),a[n]={callback:e,params:r},n},setTimeout:function(e,t){var r=Array.prototype.slice.call(arguments,2);return n+=1,o.postMessage({type:"setTimeout",timerId:n,delay:t}),a[n]={callback:e,params:r},n},clearInterval:function(e){o.postMessage({type:"clearInterval",timerId:e}),a[e]=null},clearTimeout:function(e){o.postMessage({type:"clearTimeout",timerId:e}),a[e]=null}}):r.exports=e}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});
setInterval = WorkerTimer.setInterval;
setTimeout = WorkerTimer.setTimeout;
clearInterval = WorkerTimer.clearInterval;
clearTimeout = WorkerTimer.clearTimeout;



const getChoiceByTitle = title => [...document.getElementsByClassName('choice')].find(c=>c.textContent.includes(title))
fetch('https://hordes.io/play')
.then(d=>d.text())
.then(async html => {
    const name = 'ha';
    const pickedMarker = 'inProcessPick';
    
    
    
    // hotkeys
    document.addEventListener('keydown', e => e.code == 'ShiftRight' && vr.looting());
    document.addEventListener('keydown', e => e.code == 'ControlRight' && vr.concatItems());
    
    
    
    const vr = {
        intersReady: {
            antiAfk: true,
            looting: true,
            uiextra: true,
        },
        antiAfk: ()=>vr.intersReady.antiAfk=!vr.intersReady.antiAfk,
        looting: ()=>vr.intersReady.looting=!vr.intersReady.looting,
        uiextra: ()=>vr.intersReady.uiextra=!vr.intersReady.uiextra,
        rules: { // edit your rules here, or you can do it in console "ha.loot2 = false"
            gold: true,

            rune: true,
            misc: false,

            book1: false,
            book2: false,
            book3: true,
            book4: true,
            book5: true,

            loot1: false,
            loot2: true,
            loot3: true,
            loot4: true
        },

        command (name, str) { vr.send(vr.coder.clientCommand.packData({command: name, string: str+''})) },
        drop (slotID) {vr.command("itemdrop", slotID); },
        pick (item) {if(item[pickedMarker])return; item[pickedMarker]=true; vr.send(vr.coder.clientPlayerChangeTarget.encode({_header:1,target:item.id}))},
        invFull () {
            if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return true;
            return [...vr.me.inventory.slots.keys()].filter(i=>i<101).length === vr.me.inventory.size;
        },
        concatItems () {
            if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return;

            const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101);
            const stackable = (item, item2) => item.type==item2.type&&item.tier==item2.tier&&item.stacks>0&&item.stacks<50;

            inventoryItems.map(item => {
                const withItem = inventoryItems.find(item2 => item[0] > item2[0] && stackable(item[1], item2[1]) )
                if (withItem) vr.command('itemmove', item[0]+' '+withItem[0])
            });
        },


        inters: {
            antiAfk: setInterval(() => vr.intersReady.antiAfk&&vr.world&&vr.world.tick(Math.random()/1e3), 1e3/60),
            uiextra: setInterval(() => {
                if (!vr.intersReady.uiextra) return;

                if (getChoiceByTitle('Yes, show me the items for sale.')) getChoiceByTitle('Yes, show me the items for sale.').click()
                if (getChoiceByTitle('Yes, open my Stash.')) getChoiceByTitle('Yes, open my Stash.').click()
                if (getChoiceByTitle('Show me your wares.')) getChoiceByTitle('Show me your wares.').click()
                if (getChoiceByTitle('Yes, I have some items.')) getChoiceByTitle('Yes, I have some items.').click()
            }),
            looting: setInterval(() => {
                if (!vr.intersReady.looting) return;

                if (!vr.me) return;
                if (!vr.world.entities.type[3].length) return;
                const full = vr.invFull();


                const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101).map(a=>a[1]);
                const stackable = item => inventoryItems.find(i=>i.type==item.droptype&&i.tier==item.tier&&i.stacks>0&&i.stacks<50)

                const loot = vr.world.entities.type[3]
                .map(i=>((i[pickedMarker]=false),i))
                .filter(i => {
                    if (i.droptype == 'gold') return vr.me.stats.alive && vr.rules.gold;
                    if (stackable(i)) return true;
                    if (full) return false;

                    if (i.droptype == 'book') {
                        return vr.rules.book1 && i.name.endsWith('Lv. 1') ||
                            vr.rules.book2 && i.name.endsWith('Lv. 2') ||
                            vr.rules.book3 && i.name.endsWith('Lv. 3') ||
                            vr.rules.book4 && i.name.endsWith('Lv. 4') ||
                            vr.rules.book5 && i.name.endsWith('Lv. 5')
                    } else if (i.droptype == 'misc') {
                        return vr.rules.misc;
                    } else if (i.droptype == 'rune') {
                        return vr.rules.rune;
                    } else {
                        return vr.rules.loot3 && i.color == 'rare' ||
                            vr.rules.loot4 && i.color == 'epic'
                    }
                    return false;
                })
                .filter(i => i.canBePickedUpBy(vr.me))
                .map(vr.pick);

            }),
        },
    };
    window[name] = vr;

    {
      const element = html.match(/<script.*?client\.js.*?><\/script>/)[0]
      const url = element.match(/src="(.*?)"/)[1]
      html = html.replace(element,`<script async="">let _t=origin;delete origin;eval(_t)</script>`)

      let origin = await (fetch(url).then(d=>d.text()))
      origin = origin.replace(/document\.hidden/g, 'false')

      let world = origin.match(/=>([_a-zA-Z0-9]*?)\.entities\.map\.has/)[1]
      let coder = origin.match(/\,([_a-zA-Z0-9]*?)=\{clientPlayerInput:\{/)[1]
      let ws = origin.match(/\(([_a-zA-Z0-9]*?)=new WebSocket/)[1]
      let send = origin.match(/([_a-zA-Z0-9]*?)=[_a-zA-Z0-9]*?=>\{void 0!==[_a-zA-Z0-9]*?&&1===[_a-zA-Z0-9]*?&&[_a-zA-Z0-9]*?\.send\(.*?\)\}/)[1]

      origin = origin.replace('this.player=t', 'Object.assign(window.'+name+
                              ',{world:'+world+
                              ',me:t'+
                              ',coder:'+coder+
                              ',ws:'+ws+
                              ',send:'+send+
                              '}),this.player=t')

      window.origin = origin
      document.open().write(html)
      document.close()
    }
})




