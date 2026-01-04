// ==UserScript==
// @name         橙光无限鲜花
// @version      1.0.6.0
// @namespace    http://tampermonkey.net/
// @description  使用说明：进入游戏后左上角启用
// @author       希尔顿
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match        https://*.66rpg.com/h5/*
// @downloadURL https://update.greasyfork.org/scripts/495531/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/495531/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.meta.js
// ==/UserScript==
(function (a) {
	let b = false;
	const c = window.requestAnimationFrame;
	window.requestAnimationFrame = function (a) {
		if (a.name == 'f') {
			return;
		}
		return c(a);
	};
	const d = {
		get: function () {
			return window.hxsj;
		},
		set: function (a) {
			window.hxsj = a;
			if (!a) {
				return;
			}
		},
	};
	Object.defineProperty(Object.prototype, 'scene', d);
	window.buyItem = function (a) {
		const b = prompt('请输入购买数量(1-99):', '');
		if (Number.isInteger(b) && b >= 1 && b <= 99) {
			alert('只可以输入1-99随意整数!');
			return;
		}
		const c = a.value;
		window.hxsj.successPurchase(c, b);
	};
	async function e() {
		if (document.querySelector('canvas')) {
			async function a() {
				window.listVisible = false;
				const a = document.createElement('style');
				a.textContent = `
          #base-btn {
            background: #ffd700;
            color: #333;
            border: 1px solid #d4af37;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            padding: 6px 12px;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            font-weight: bold;
            font-size: 14px;
          }
          
          #base-btn:hover {
            background: #ffdf40;
          }
          
          .menu-container {
            position: absolute;
            display: none;
            flex-direction: column;
            gap: 3px;
            background: white;
            border: 1px solid #d4af37;
            border-radius: 4px;
            padding: 8px 6px;
            z-index: 999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          
          .menu-btn {
            background: #fff8e1;
            color: #333;
            border: 1px solid #ffd700;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
            padding: 4px 8px;
            min-width: 90px;
            text-align: center;
            font-size: 13px;
            white-space: nowrap;
          }
          
          .menu-btn:hover {
            background: #ffecb3;
          }
        `;
				document.head.appendChild(a);
				const c = document.createElement('button');
				c.id = 'base-btn';
				c.textContent = '菜单';
				c.onclick = function (a) {
					{
						a.stopPropagation();
						const b = this.getBoundingClientRect();
						d.style.left = b.left - 11 + 'px';
						d.style.top = b.bottom + 5 + 'px';
						if (d.style.display === 'flex') {
							d.style.display = 'none';
						} else {
							d.style.display = 'flex';
						}
						e.style.display = 'none';
					}
				};
				document.body.appendChild(c);
				const d = document.createElement('div');
				d.id = 'level1';
				d.className = 'menu-container';
				document.body.appendChild(d);
				const e = document.createElement('div');
				e.id = 'level2';
				e.className = 'menu-container';
				document.body.appendChild(e);
				const f = (a, b, c) => {
					{
						const d = document.createElement('button');
						d.className = 'menu-btn';
						d.textContent = a;
						d.onclick = b;
						c.appendChild(d);
						return d;
					}
				};
				f(
					'商城开启',
					(a) => {
						{
							a.stopPropagation();
							if (window.hxsj && window.hxsj.successPurchase && window.hxsj.mallItems) {
								e.innerHTML = '';
								window.hxsj.mallItems.map((a) => {
									let b = a.itemData.itemName;
									let c = a.itemData.itemId;
									f(
										b,
										function () {
											buyItem(this);
										},
										e,
									).value = c;
								});
							} else {
								alert('请先在游戏内打开商城页');
								return;
							}
							const b = g.getBoundingClientRect();
							e.style.left = b.right + 8 + 'px';
							e.style.top = b.top - 4 + 'px';
							e.style.display = e.style.display === 'flex' ? 'none' : 'flex';
						}
					},
					d,
				);
				f(
					'修改累充',
					() => {
						{
							const a = prompt('请输入累充数:', '');
							const b = parseInt(a) || 0;
							const c = window.getUserData?.() || {};
							[
								'totalFlower',
								'freshFlower',
								'wildFlower',
								'tempFlower',
								'realFlower',
								'haveFlower',
							].forEach((a) => {
								Object.defineProperty(c, a, {
									value: b,
									writable: true,
								});
							});
							alert('累充已修改为：' + b);
						}
					},
					d,
				);
				f(
					'全屏开关',
					() => {
						b = !b;
						if (!document.fullscreenElement) {
							document.documentElement.requestFullscreen();
						} else {
							document.exitFullscreen();
						}
					},
					d,
				);
				f(
					'隐藏菜单',
					() => {
						c.style.display = 'none';
						d.style.display = 'none';
						e.style.display = 'none';
					},
					d,
				);
				f(
					'关闭菜单',
					() => {
						d.style.display = 'none';
						e.style.display = 'none';
					},
					d,
				);
				f(
					'显示菜单',
					() => {
						c.style.display = 'block';
					},
					d,
				);
				const g = d.querySelector('button');
			}
			function c() {
				if (document.cookie) {
					a();
				} else {
					window.requestAnimationFrame(c);
				}
			}
			c();
		} else {
			setTimeout(e, 100);
		}
	}
	setTimeout(e, 100);
})(GM);
