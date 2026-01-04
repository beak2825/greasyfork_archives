// ==UserScript==
// @name         星凰·星球-B龄
// @version      1.4
// @author       风风轮舞
// @namespace		https://space.bilibili.com/379335206
// @match			*://www.bilibili.com
// @description		这是你来到bilibili星球的...
// @supportURL		https://jq.qq.com/?_wv=1027&k=IMqY916N
// @run-at			document-idle
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @grant			GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/429246/%E6%98%9F%E5%87%B0%C2%B7%E6%98%9F%E7%90%83-B%E9%BE%84.user.js
// @updateURL https://update.greasyfork.org/scripts/429246/%E6%98%9F%E5%87%B0%C2%B7%E6%98%9F%E7%90%83-B%E9%BE%84.meta.js
// ==/UserScript==

const [me, you, pos] = ["JOIN_TIME", "JT_HAN_LANG", "RE_POS"]
const world = {
	draw: GM_addStyle,
	rise: GM_setValue,
	take: GM_getValue,
	execute: GM_deleteValue,
	require: GM_xmlhttpRequest,
	set: GM_registerMenuCommand,
	log(l) {
		console.log(`%c TriLingvo %c ${l}`, 'color:#fff;background-color:#fa7298;border-radius:8px', '')
	},
	wait(t, f) {
		setTimeout(f, t * 1000)
	},
	repeat: {
		engage(t, f) {
			return setInterval(f, t * 1000)
		},
		execute(f) {
			clearInterval(f)
		}
	},
	remind(u) {
		let m = document.createElement('div');
		m.className = "trireminder";
		m.title = "双击改变位置(BE兼容性调整)";
		m.innerHTML = `今天是你在bilibili星球的第 <span title="注册于 ${world.take(you)}"><strong id="bdays">${Math.round(((new Date()).getTime() / 1000 - u) / 86400)}</strong></span> 天`;
		document.getElementById('i_cecream').appendChild(m)
		m.addEventListener("dblclick", () => {
			world.rise(pos, !world.take(pos, false))
			world.draw(`.trireminder {top: ${world.take(pos) ? 52 : 114}px !important}`)
		})
	}
}


world.draw(`.@keyframes fadeout {from {opacity: 0.85}to {opacity: 0}}.fadeout {animation: fadeout 0.5s forwards}.trireminder {user-select: none;min-width: 60px;color: black; background-color: rgba(255, 255, 255, .7); background-filter: blur(3px); border-radius: 5px; /*  background-image: linear-gradient(-45deg, transparent 5px, #fff 0, #fff calc(100% - 5px), transparent 0); *//* opacity: 0.85; */width: 300px;height: auto;font-size: 16px;min-height: 30px;line-height: 30px;text-align: center;position: absolute !important;top: ${world.take(pos, false) ? 52 : 114}px !important;left: unset !important; right: 10px; visibility: visible !important;z-index: 998}.trireminder strong {color: #fa7298;}.trireminder span {font-size: large}`);
let her = world.take(me, 0);
if (!her) {
	world.log(`初次启动`)
	world.require({
		method: "GET",
		url: "https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0",
		onload: r => {
			let re = JSON.parse(r.responseText).data.pfs;
			if (re) her = re.profile.jointime;
			world.rise(me, her);
			let d = new Date(her * 1000);
			world.rise(you, `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`)
			world.wait(3, () => { world.remind(world.take(me)) })
		}
	})
} else {
	world.remind(her);
	world.log(`[星凰·星球]正在工作`)
}
world.set('重置', () => {
	world.execute(you);
	world.execute(me);
})