// ==UserScript==
// @name         Crystall Texture v3.1 Sploop.io 
// @version     v3.1
// @description  texturerelease pack for sploop WORKS ON MOBILE!!
// @namespace   none
// @author       Oneway and Frozen Cat
// @match        https://sploop.io/
// @icon         https://sploop.io/img/ui/favicon.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448374/Crystall%20Texture%20v31%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/448374/Crystall%20Texture%20v31%20Sploopio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const [config] = [
	{
		"enabled": true,
		"id": "54760342-0298-4efa-9dd9-0ae0853ca468",
		"name": "Crystall texture v3",
		"filter": {
			"key": "page-url",
			"condition": "contains",
			"value": "sploop.io"
		},
		"rules": [
			{

				"enabled": true,
				"id": "26943b38-2c48-4079-acba-afec1063525c",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_1.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/963088950182948884/bull.io.png"
						}
					}
				]
			},
            			{
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_2.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/961002006456197140/Medicinehat.webp"//jungle gear
						}
					}
				]
			},
			{
                "enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/teleporter.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/1000002663267717190/unknown.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "616f7e00-0a9e-43d9-a56c-bd3bd6326401",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_3.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/960992157076955226/cyrstal.io.png"//soldier
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "c3f5db14-5741-483f-8f8a-dd7df4372e5a",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_4.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/963089283969855559/spike.io.png"//spike gear
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "520fb136-afa6-40e8-897b-c8b5c0bbec35",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_5.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/963089515730337802/immunity.io.png"//immunity gear
						}
					}
				]
			},
			{
                				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "img/items/pearl.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/1000004850005839892/unknown.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"id": "96069f8f-59f7-4e7c-ac83-a7cf79dd422a",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_6.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/961000887084539944/unknown.png"//boost hat
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_9.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/961001314047913984/Thief27s_Hat_1.webp"//hood gear
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_8.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/960999830702923856/15_Vampire27s_Hat.webp"
						}
					}
				]
			},
			{
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hammer.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/954090905005080576/ci5zKrt.png"//hammer
						}
					}
				]
			},
           {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/shield.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/987611878408745041/1002112011846570065/unknown.png?width=188&height=404"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/xbow.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958171910066278420/unknown.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/bow.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958171910066278420/unknown.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/s_musket.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958171488979157003/unknown.png"//musket currently none
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/katana.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958182293053263892/stone_katana.png"//stone kattana
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "img/items/g_katana.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958183242618519632/g_katana.png"//gold kattana
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/d_katana.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958183596387086376/d_katana.png"//diamond kattana
						}
					}
				]
			},
                        {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/c_katana.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/958184370122924032/Emerald_katana.png"//ruby katana
	}
					}
				]
			},
                        {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/skins/body17.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/999935175490289664/unknown.png"
					}
					}
				]
			},
                        {
            	"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/stone_toolhammer.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/951523489809072198/956208756256022588/R.png"//
						}
					}
				]
			},
            {"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/bed.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/999999940984062023/unknown.png"//
						}
					}
				]
			},
            {

				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/stone_sword.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/987611878408745041/1001655160570921082/unknown.png?width=74&height=404"
						}
					}
				]
			},
            {
                "enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/lootbox.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/999991311056773180/unknown.png"//
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/cut_spear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/386994737090920450/698151330933637240/Spear_1_c.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/g_cutspear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/927514120121618463/1019973157236510760/unknown.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/d_cutspear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/927514120121618463/1019974483349614694/unknown.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/bat.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/983280898915069982/1001658643357372546/unknown.png"
						}
					}
				]
			},
            {

				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/g_spear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://images-ext-1.discordapp.net/external/XE_BUYuNwnTzaEEzm2fugMMi8zimewjqFn1Gokow6aA/https/media.discordapp.net/attachments/386994737090920450/698151330933637240/Spear_1_c.png"
						}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/stone_spear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://images-ext-1.discordapp.net/external/XE_BUYuNwnTzaEEzm2fugMMi8zimewjqFn1Gokow6aA/https/media.discordapp.net/attachments/386994737090920450/698151330933637240/Spear_1_c.png"
				}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hat_11.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/999317627270856755/999674408820035604/Beter_Tank_Head.png"
	}
					}
				]
			},
            {
                "enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/hard_spike.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://cdn.discordapp.com/attachments/970942496672743444/999948593274306640/unknown.png"
							}
					}
				]
			},
             {
                "enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/hard_spike.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/983280898915069982/1001661076624130221/unknown.png"
							}
					}
				]
			},
            {
                 "enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/skid_had.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/987611878408745041/1001662247388594247/unknown.png"
							}
					}
				]
			},
            {
				"enabled": true,
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/stone_spear.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://images-ext-1.discordapp.net/external/XE_BUYuNwnTzaEEzm2fugMMi8zimewjqFn1Gokow6aA/https/media.discordapp.net/attachments/386994737090920450/698151330933637240/Spear_1_c.png"
						}
					}
				]
			}
		],
		"description": "Oneways and Frozen Cats texture pack"
	}
];//stop here


    const remaps = new Map();

    const colorRemaps = {
        "#788F57": "#768f5a",
        "#fcefbb": "#8f815a",
        "#2a8b9b": "#5e74a7"
    };

   //shh

    const rules = config.rules;
    rules.forEach(rule => {

        const {actions, criteria } = rule;
        const [action] = actions;
        const toUrl = action.details.value;
        const fromUrl = criteria.value;
        remaps.set(fromUrl, {

            src: toUrl,
            scale: 1,
        });

    })

    const sfs = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle").set;
    Object.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {
        set(f){
            if(colorRemaps[f]) f = colorRemaps[f];
            return sfs.call(this, f);
        }
    })

    const origImage = Image;
    window.Image = class extends Image {
        set onload(fn){
            this._onloadFn = fn;
            super.onload = function(){
                this.width = this.width * this._scale;
                this.height = this.height * this._scale;
                return fn.apply(this, arguments);
            }
        }

        set src(_src){
            const [path] = _src.split("?v=");
            if(remaps.has(path)) {
                const that_ = this;
                const {src, scale} = remaps.get(path);
                _src = src;
                this._scale = scale;
            } else this._scale = 1;
            super.src = _src;
       }
    }
})();

//visual affects