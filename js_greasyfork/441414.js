// ==UserScript==
// @name         Crystall Pack
// @version      1
// @description  yes
// @namespace     by no name
// @author       ᲼᲼᲼᲼᲼᲼#8948(pack by No Name)
// @match        https://sploop.io/
// @icon         https://media.discordapp.net/attachments/906185437389922355/950270738110238802/cyrstal.ioicon.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441414/Crystall%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/441414/Crystall%20Pack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const [config] = [
	{
		"enabled": true,
		"id": "54760342-0298-4efa-9dd9-0ae0853ca468",
		"name": "Crystall texture v2",
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
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131805012312064/bull.io.png"
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
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131805205254164/cyrstal.io.png"
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
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131805603717140/spike.io.png"
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
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131805402398740/immunity.io.png"
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
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131804739690566/boost.io.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "4861f2cb-e86c-4217-8a1e-026d899ee0d5",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/items/c_katana.png?v=29322399"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/880690143575564339/948131805805035560/unknown.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "1fafcb2c-bd79-4902-baa1-a6dd2862fbd9",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "img/skins/body6.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/934750704604684338/943879698067386388/ping_wings_tester.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "c2db51a3-e71e-40cd-947b-ffabf634cd25",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/windmill_top.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/906185437389922355/943872973784350830/windmill_topyes.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "5b8d580e-9d79-459f-8829-3af95eb51b19",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/inv_c_katana.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/906185437389922355/950275458811957248/inv_c_katana.png"
						}
					}
				]
			},
			{
				"enabled": true,
				"id": "171a0879-b549-4300-9862-b9f157f4f002",
				"criteria": {
					"key": "url",
					"condition": "contains",
					"value": "/img/entity/map.png"
				},
				"actions": [
					{
						"type": "redirect-to",
						"details": {
							"value": "https://media.discordapp.net/attachments/880690143575564339/949261797028945930/mapheheboi.png"
						}
					}
				]
			}
		],
		"description": "Made by No Name and Leprohiko lol"
	}
];


    const remaps = new Map();

    const colorRemaps = {
        "#788F57": "#788F57",
        "#fcefbb": "#fcefbb",
        "#2a8b9b": "#2a8b9b"
    };

    //DO NOT TOUCH THE CODE BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING!

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