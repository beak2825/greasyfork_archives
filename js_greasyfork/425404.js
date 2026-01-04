// ==UserScript==
// @name         The Tree Enchanted
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Custom enchancements to TMT
// @author       Dimava
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425404/The%20Tree%20Enchanted.user.js
// @updateURL https://update.greasyfork.org/scripts/425404/The%20Tree%20Enchanted.meta.js
// ==/UserScript==



if (globalThis.TREE_LAYERS) void function() {
	function __init__() {
		q = s => document.querySelector(s);
		qq = s => [...document.querySelectorAll(s)];
		elm = function elm(sel = '', ...children) {
			let el = document.createElement('div');
			sel.replace(/([\w-]+)|#([\w-]+)|\.([\w-]+)|\[([^\]=]+)(?:=([^\]]*))\]/g, (s, tag, id, cls, attr, val) => {
				if (tag) el = document.createElement(tag);
				if (id) el.id = id;
				if (cls) el.classList.add(cls);
				if (attr) el.setAttribute(attr, val ?? true);
			});
			for (let f of children.filter(e => typeof e == 'function')) {
				let name = f.name || (f + '').match(/\w+/);
				if (!name.startsWith('on')) name = 'on' + name;
				el[name] = f;
			}
			el.append(...children.filter(e => typeof e != 'function'));
			return el;
		}
		Object.defineValue = function defineValue(o, p, value) {
			if (typeof p == 'function') {
				[p, value] = [p.name, p];
			}
			return Object.defineProperty(o, p, {
				value,
				configurable: true,
				enumerable: false,
				writable: true,
			});
		};
		Object.defineValue(Element.prototype, function q(sel) {
			return this.querySelector(sel);
		});
		Object.defineValue(Element.prototype, function qq(sel) {
			return [...this.querySelectorAll(sel)];
		});
		Object.map = function(o, mapper) {
			return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mapper(v, k, o)]));
		}
		Array.map = function map(length, mapper = i => i) {
			return Array(length).fill(0).map((e, i, a) => mapper(i));
		}
	}
	window.__init__ || __init__();



	let loopReset = false;
	let keyzloop = 0;

	let keysdown = {};
	function onraf() {
		if (keysdown.x) {

		}
	}
	void async function() {
		while(true) {
			await Promise.frame();
			onraf();
		}
	}

	addEventListener('keydown', async event=>{
		// console.log(event)
		if (event.key == 'z' || event.key == 'X') {
			q('.reset.can')?.click();
		}
		if (event.key == 'x' || event.key == 'X') {
			for (let e of qq(`
						.upg.can:not(.reset), .buyable.can:not(.reset),
						.canComplete .longUpg
					`).reverse()) {
				e.click();
			}
		}
		// if (event.key == 'c') {
		// 	if (loopReset) return;
		// 	loopReset = true;
		// 	while (loopReset) {
		// 		await bestReset();
		// 	}
		// }
		let treeNode = qq('.treeNode.can:not(.ghost)').find(e=>e.innerText.startsWith(event.key))
		treeNode?.click();

		if (event.key == 'Tab') {
			let tabs = qq('.tabButton');
			let i = tabs.findIndex(e=>e.innerText.includes(player.subtabs[player.tab].mainTabs)) + 1;
            if (event.shiftKey) i += tabs.length - 2;
			tabs[i % tabs.length].click();
			event.preventDefault();
		}

        switch(event.key) {
            case 'ArrowUp': ArrowLayerMove.moveUp(); break;
            case 'ArrowLeft': ArrowLayerMove.moveLeft(); break;
            case 'ArrowDown': ArrowLayerMove.moveDown(); break;
            case 'ArrowRight': ArrowLayerMove.moveRight(); break;
        }

	});

	onkeyup = event => {
		if (event.key == 'c') {
			loopReset = false;
		}
	}




	Layer = class {
		static hasAllUpgrades(layer) {
			return Object.values(tmp[layer].upgrades).every(e => !hasUpgrade(layer, e.id));
		}
		static status(layerId) {
			let layer = tmp[layerId];
			let ups = Object.values(layer.upgrades || {}).filter(e => e.id);
			let ms = Object.values(layer.milestones || {}).filter(e => e.id);
			let cha = Object.values(layer.challenges || {}).filter(e => e.id);
// 			player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit
			return {
				upgrades: {
					total: ups.length,
					unlocked: ups.filter(e => e.unlocked || hasUpgrade(layerId, e.id)).length,
					done: ups.filter(e => hasUpgrade(layerId, e.id)).length,
					available: ups.filter(e => e.unlocked && !hasUpgrade(layerId, e.id) && canAffordUpgrade(layerId, e.id)).length,
				},
				milestones: {
					total: ms.length,
					unlocked: ms.filter(e => e.unlocked).length,
					done: ms.filter(e => e.done).length,
				},
				challenges: {
					total: cha.length,
					unlocked: cha.filter(e => e.unlocked).length,
					done: cha.filter(e => player[layerId].challenges[e.id] >= e.completionLimit).length,
					active: !!player[layerId].activeChallenge,
					canComplete: player[layerId].activeChallenge && canCompleteChallenge(layerId, player[layerId].activeChallenge),
				},
			}
		}
		static shortStatus(layerId) {
			let s = this.status(layerId);
			return {
				upgrades: `${s.upgrades.bought}/${s.upgrades.unlocked}/${s.upgrades.total}`,
			}
		}
		static showStars(layerId) {
			function star(color, empty) {
				return elm(`.statusStar[style=color:${color};]`, typeof empty == 'string' ? empty : empty ? '☆' : '★')
			}
			let node = q(`.treeNode.${layerId}`);
			if (!node) return //console.error(`bode not found: ${layerId}`)

			let s = this.status(layerId);
			let ups = s.upgrades;
			let ms = s.milestones;
			let cha = s.challenges;

			ups = ups.total && star(ups.available ? 'yellowgreen' : ups.unlocked < ups.total ? 'silver' : 'gold', ups.done < ups.unlocked);
			ms = ms.total && star(ms.unlocked < ms.total ? 'silver' : 'gold', ms.done < ms.unlocked);
			cha = cha.total && star(cha.active ? 'red' : cha.unlocked < cha.total ? 'silver' : 'gold', cha.done < cha.unlocked && !cha.canComplete);

			let sel = player.tab == layerId && star('white', '\xa0\xa0^');

			let container = elm('.sscon',...[sel, cha, ms, ups].filter(Boolean));


			let oldContainer = node.q('.sscon');
			if (!oldContainer) {
				node.append(container);
			} else if (oldContainer.outerHTML != container.outerHTML) {
				oldContainer.replaceWith(container);
			}
		}
		static showAllStars() {
			Object.values(tmp).filter(e=>e.layerShown==true)
			.map(e=>this.showStars(e.layer));
		}
	}

	window.layInt && clearInterval(layInt)
	layInt=setInterval(()=>Layer.showAllStars(), 200)


	q('head').append(elm('style', `
		.sscon {
			position:absolute;
			font-size: 33.333%;
			font-family: initial;
			text-shadow: 0 0 4px gray, 0 0 3px black;
			display: flex;
			flex-direction: row-reverse;
		}
		.statusStar {
			display: inline-block;
			transform: scale(3);
		}
		.tabButton {
			position: relative;
		}
		.tscon {
			position: relative;
			display: inline-block;
			left: 9px;
		}
		.tabStar {
			display: inline-block;
		}
	`))

    ArrowLayerMove = class ArrowLayerMove {
    	static get tree() {
    		if (this._tree) return this._tree;
    		if (typeof Object.values(TREE_LAYERS)[0][0] == 'object') {
    			return this._tree = TREE_LAYERS;
    		}
    		return this._tree = Object.fromEntries(Object.entries(TREE_LAYERS)
    			.map(([k,r]) => {
    				return [k, r.map((layer, position) => ({layer, position}))]
    			}));
    	}
        static get y() {
            return +Object.entries(this.tree).find(([k, r]) => r.find(e=>e.layer==player.tab))[0];
        }
        static get x() {
            return Object.values(this.tree).map(r=>r.find(e=>e.layer==player.tab)).find(Boolean).position;
        }
        static changeLayer(layer) {
            q(`.treeNode.can.${layer}`)?.click();
        }
        static best(a, f) {
            return a.map((e,i,a)=>({e,v:f(e,i,a)})).sort((a,b)=>a.v-b.v)[0].e;
        }
        static moveUp() {
            let row = this.tree[this.y-1];
            if (!row) return;
            let layer = this.best(row, e => Math.abs(this.x - e.position) + 1000*!tmp[e.layer].layerShown).layer;
            console.log(layer)
            this.changeLayer(layer);
        }
        static moveLeft() {
            let row = this.tree[this.y];
            let layer = row.filter(e => e.position < this.x).pop().layer;
            if (!layer) return;
            console.log(layer)
            this.changeLayer(layer);
        }
        static moveDown() {
            let row = this.tree[this.y+1];
            if (!row) return;
            let layer = this.best(row, e => Math.abs(this.y - e.position) + 1000*!tmp[e.layer].layerShown).layer;
            console.log(layer)
            this.changeLayer(layer);
        }
        static moveRight() {
            let row = this.tree[this.y];
            let layer = row.filter(e => e.position > this.x)[0].layer;
            if (!layer) return;
            console.log(layer)
            this.changeLayer(layer);
        }
    }


	TabStarrer = class {
		static layerContent(layerId) {
			if (!layers[layerId].tabFormat) {
				return {};
			}
			let _tab = player.tab;
			player.tab = layerId;
			let data = Object.fromEntries(Object.entries(layers[layerId].tabFormat).map(([k,v])=>[k, parseTab(k, v)]))
			player.tab = _tab;
			return data;

			function parseTab(id, tab) {
				let _mainTabs = player.subtabs.e.mainTabs;
				player.subtabs.e.mainTabs = id;
				let data = {};
				function parseItem(e) {
					if (typeof e == 'function')
						return parseItem(e());
					if (Array.isArray(e)){
						if (e[0] == 'row' || e[0] == 'column') {
							return e.slice(1).flat().map(parseItem);
						}
						data[e[0]] ??= [];
						if (typeof e[1] != 'object') {
							data[e[0]].push(e[1]);
						} else if (e[0] == 'upgrades') {
							let ups = e[1].flatMap(e => Array.map(10, i => e*10+i)).filter(e => layers[layerId].upgrades[e])
							data.upgrade ??= [];
							data.upgrade.push(...ups);
						} else {
							debugger;
						}
						return;
					}
					data[e] = true;
				}
				tab.content.map(parseItem);
				player.subtabs.e.mainTabs = _mainTabs;
				return data;
			}
		}
		static layerTabStatus(layerId) {
			let content = this.layerContent(layerId);
			return Object.map(content, (tabContent, k) => {
				let layer = tmp[layerId];
				let ups = tabContent.upgrades != true ? (tabContent.upgrade || []).map(e => layer.upgrades[e]) : Object.values(layer.upgrades || {}).filter(e => e.id);
				let ms = !tabContent.milestones ? [] : Object.values(layer.milestones || {}).filter(e => e.id);
				let cha = !tabContent.challenges ? [] : Object.values(layer.challenges || {}).filter(e => e.id);
				return {
					upgrades: {
						total: ups.length,
						unlocked: ups.filter(e => e.unlocked || hasUpgrade(layerId, e.id)).length,
						done: ups.filter(e => hasUpgrade(layerId, e.id)).length,
						available: ups.filter(e => e.unlocked && !hasUpgrade(layerId, e.id) && canAffordUpgrade(layerId, e.id)).length,
					},
					milestones: {
						total: ms.length,
						unlocked: ms.filter(e => e.unlocked).length,
						done: ms.filter(e => e.done).length,
					},
					challenges: {
						total: cha.length,
						unlocked: cha.filter(e => e.unlocked).length,
						done: cha.filter(e => player[layerId].challenges[e.id] >= e.completionLimit).length,
						active: !!player[layerId].activeChallenge,
						canComplete: player[layerId].activeChallenge && canCompleteChallenge(layerId, player[layerId].activeChallenge),
					},
				}
			});
		}
		static starsElement(status) {
			function star(color, empty) {
				return elm(`.tabStar[style=color:${color};]`, typeof empty == 'string' ? empty : empty ? '☆' : '★')
			}
			let ups = status.upgrades;
			let ms = status.milestones;
			let cha = status.challenges;

			ups = ups.total && star(ups.available ? 'yellowgreen' : ups.unlocked < ups.total ? 'silver' : 'gold', ups.done < ups.unlocked);
			ms = ms.total && star(ms.unlocked < ms.total ? 'silver' : 'gold', ms.done < ms.unlocked);
			cha = cha.total && star(cha.active ? 'red' : cha.unlocked < cha.total ? 'silver' : 'gold', cha.done < cha.unlocked && !cha.canComplete);

			return elm('.tscon',...[cha, ms, ups].filter(Boolean));
		}
		static makeTabStars() {
			let layerId = player.tab;
			let layerTabStatus = this.layerTabStatus(layerId);

			qq('.tabButton').map(e => {
				if (!e.q('.tscon')) e.append(elm('.tscon'));
				let tabId = e.childNodes[0].nodeValue;
				let old = e.q('.tscon');
				let con = this.starsElement(layerTabStatus[tabId]);
				if (con.outerHTML != old.outerHTML) {
					old.replaceWith(con);
				}
			});
		}
	}



	if(window._tsint) clearInterval(_tsint);
	_tsint = setInterval(() => TabStarrer.makeTabStars(), 200);


}();