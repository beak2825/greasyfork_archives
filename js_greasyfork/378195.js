// ==UserScript==
// @name         jstris.jezevec10.com Online Sounds Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Changes online sound engine to register a new source
// @author       pc31754
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378195/jstrisjezevec10com%20Online%20Sounds%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/378195/jstrisjezevec10com%20Online%20Sounds%20Modifier.meta.js
// ==/UserScript==

var scriptCode = new Array(); // this is where we are going to build our new script

// here's the build of the new script, one line at a time
scriptCode.push('function BaseSFXset(){');
scriptCode.push('    this.getSoundUrl = function(id){');
scriptCode.push('        var sound=this[id];');
scriptCode.push('        if(sound===null)sound=this.blank;');
scriptCode.push('        if(sound.abs) return sound.url;');
scriptCode.push('        else return "/res/se"+sound.set+"/"+sound.url;');
scriptCode.push('    };');
scriptCode.push('    this.getComboSFX = function(combo){');
scriptCode.push('        if(!this.comboTones)return "linefall";');
scriptCode.push('        else return "c" + Math.min(this.comboTones.cnt-1, combo);');
scriptCode.push('    };');
scriptCode.push('    this.hold={url:"hold.wav",abs:0,set:0};');
scriptCode.push('    this.linefall={url:"linefall.wav",abs:0,set:0};');
scriptCode.push('    this.lock={url:"http://k007.kiwi6.com/hotlink/o0hnrgnffe/harddrop.wav",abs:0,set:0};');
scriptCode.push('    this.move={url:"http://k007.kiwi6.com/hotlink/5szaxkihjl/move.wav",abs:0,set:0};');
scriptCode.push('    this.died={url:"topout.wav",abs:0,set:0};');
scriptCode.push('    this.ready={url:"ready.wav",abs:0,set:0};');
scriptCode.push('    this.go={url:"go.wav",abs:0,set:0};');
scriptCode.push('    this.ding={url:"ding.wav",abs:0,set:0};');
scriptCode.push('    this.fault={url:"fault.wav",abs:0,set:0};');
scriptCode.push('    this.blank={url:"null.wav",abs:0,set:0};');
scriptCode.push('};');
scriptCode.push('function YotipoSFXset(){');
scriptCode.push('    this.volume=1;');
scriptCode.push('    this.hold=null;');
scriptCode.push('    this.linefall={url:"linefall.wav",abs:0,set:1};');
scriptCode.push('    this.lock={url:"lock.wav",abs:0,set:1};');
scriptCode.push('    this.move=null;');
scriptCode.push('    this.died={url:"topout.wav",abs:0,set:1};');
scriptCode.push('    this.ready={url:"ready.wav",abs:0,set:1};');
scriptCode.push('    this.go={url:"go.wav",abs:0,set:1};');
scriptCode.push('};');
scriptCode.push('function RainforestSFXset(){');
scriptCode.push('    this.volume=0.40;');
scriptCode.push('    this.move={url:"http://k007.kiwi6.com/hotlink/5szaxkihjl/move.wav",abs:0,set:2};');
scriptCode.push('    this.hold={url:"https://cdn.discordapp.com/attachments/549008926931419147/549019498724720641/hold.wav",abs:0,set:2};');
scriptCode.push('    this.lock={url:"http://k007.kiwi6.com/hotlink/o0hnrgnffe/harddrop.wav",abs:0,set:2};');
scriptCode.push('    this.died={url:"https://cdn.discordapp.com/attachments/549008926931419147/549019901822763018/died.wav",abs:0,set:2};');
scriptCode.push('    this.comboTones={url:"comboTones.mp3",abs:0,set:2,duration:1000,spacing:500,cnt:15};');
scriptCode.push('};');
scriptCode.push('RainforestSFXset.prototype = new BaseSFXset;');
scriptCode.push('var SFXsets = [');
scriptCode.push('    {id:0,name:"Nullpomino", data: BaseSFXset},');
scriptCode.push('    {id:1,name:"Yotipo", data: YotipoSFXset},');
scriptCode.push('    {id:2,name:"Custom", data: RainforestSFXset}');
scriptCode.push('];');


var script = document.createElement('script'); // create the script element
script.innerHTML = scriptCode.join('\n'); // add the script code to HTML script
scriptCode.length = 0; // recover the memory we used to build the script

document.getElementsByTagName('head')[0].appendChild(script);