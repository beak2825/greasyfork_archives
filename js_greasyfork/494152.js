// ==UserScript==
// @name         fast split and auto unban ip
// @version      0.1
// @match        *://agma.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        unsafeWindow
// @author       Anonymous Agma
// @run-at       document-start
// @description  fast_split + auto unban
// @namespace https://greasyfork.org/users/1238627
// @downloadURL https://update.greasyfork.org/scripts/494152/fast%20split%20and%20auto%20unban%20ip.user.js
// @updateURL https://update.greasyfork.org/scripts/494152/fast%20split%20and%20auto%20unban%20ip.meta.js
// ==/UserScript==
// change the keybind here, please do not change longfs because it is not changable and will lead to errors.
let keybind = {
onefs: 't',
doublefs: 'r',
longfs:'z'// cant change!
}
unsafeWindow.Writer = class{
	constructor(e) {
		(this.buffer = new DataView(new ArrayBuffer(e))), (this.position = 0), (this.littleEndian = !0);
	}
	setString(e) {
		for (let t = 0; t < e.length; t++) this.setUint16(e.charCodeAt(t));
		return this;
	}
	setInt8(e) {
		return this.buffer.setInt8(this.position++, e), this;
	}
	setUint8(e) {
		return this.buffer.setUint8(this.position++, e), this;
	}
	setInt16(e) {
		return this.buffer.setInt16((this.position += 2) - 2, e, this.littleEndian), this;
	}
	setUint16(e) {
		return this.buffer.setUint16((this.position += 2) - 2, e, this.littleEndian), this;
	}
	setInt32(e) {
		return this.buffer.setInt32((this.position += 4) - 4, e, this.littleEndian), this;
	}
	setUint32(e) {
		return e % 1 != 0 && 88 == e.toString().slice(-2) && (e += 2), this.buffer.setUint32((this.position += 4) - 4, e, this.littleEndian), this;
	}
	setFloat32(e) {
		return this.buffer.setFloat32((this.position += 4) - 4, e, this.littleEndian), this;
	}
	setFloat64(e) {
		return this.buffer.setFloat64((this.position += 8) - 8, e, this.littleEndian), this;
	}
	send() {
		return send(this.buffer);
	}
}
let send,
    curserTimeout,
    enabled = false;
const osend = WebSocket.prototype.send;
(WebSocket.prototype.send = function () {
    return (send = (...e) => osend.call(this, ...e)), osend.apply(this, arguments);
});
  const wsend = (e) => send(new Uint8Array([e]));
unsafeWindow.send=(e)=>{send(e)}
window.addEventListener("DOMContentLoaded",()=>{

unsafeWindow.addEventListener("keydown",async e=>{
if (!$("input, textarea").is(":focus")) {
e.key == keybind.onefs&& onefs()
e.key == keybind.doublefs&& doublefs()
e.key == 'Shift' &&!e.repeat&&(enabled = !enabled,curserMsg(`Long Split: ${enabled?'ON':'OFF'} `,'green',500))
e.key == 'z'&& (enabled?(cursorlock(1),await delay(80),onefs(),await delay(750),cursorlock(0)):undefined);
}})
unsafeWindow.curserMsg = (e, t, r) => {
    "green" == t && (t = "rgb(0, 192, 0)"),
    "red" == t && (t = "rgb(255, 0, 0)"),
    "gray" == t && (t = "rgb(153, 153, 153)"),
    clearTimeout(curserTimeout),
    $("#curser").text(e).show().css("color", t),
    0 !== r && (curserTimeout = setTimeout(() => $("#curser").fadeOut(400), r ?? 4e3));
}
const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
const onefs = async (ms1,ms2) =>{
wsend(17)
    await delay(0);
    wsend(35);
    await delay(60);
    wsend(35);
}
const doublefs = async (ms1,ms2) =>{
wsend(17);
await delay(50);
onefs()
}
const cursorlock = (t) => {
unsafeWindow[`onkey${t? 'down':'up'}`]({ keyCode: JSON.parse(localStorage.getItem("hotkeys")).C?.c||67});
};
    setInterval(()=>{
    if(localStorage.getItem('cdbi')){
    localStorage.removeItem('cdbi')
    }
            if(localStorage.getItem('cdbi1')){
    localStorage.removeItem('cdbi1')
    }
            if(localStorage.getItem('cdbi2')){
    localStorage.removeItem('cdbi2')
    }
            if(localStorage.getItem('cdbi3')){
    localStorage.removeItem('cdbi3')
    }
            if(localStorage.getItem('cdbi4')){
    localStorage.removeItem('cdbi4')
                curserMsg('Unbanned, use new ip')
    }
    })
})