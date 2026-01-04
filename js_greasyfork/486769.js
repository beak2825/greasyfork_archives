// ==UserScript==
// @name         UPDATED SKIN CHANGER SCRIPT
// @version      1.0
// @match        *://agma.io/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        unsafeWindow
// @run-at       document-start
// @description no
// @namespace https://greasyfork.org/users/1238627
// @downloadURL https://update.greasyfork.org/scripts/486769/UPDATED%20SKIN%20CHANGER%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486769/UPDATED%20SKIN%20CHANGER%20SCRIPT.meta.js
// ==/UserScript==
const userkey = '0'; //change to anykey u want like 'a','b','SHIFT',...
let skinid = [1304, 159, 10139, 1120];
let wearableid = [8,0];
let send;
const osend = WebSocket.prototype.send;
(WebSocket.prototype.send = function () {
    return (send = (...e) => osend.call(this, ...e)), osend.apply(this, arguments);
});
class Writer {
    constructor(n) {
        this.buffer = new DataView(new ArrayBuffer(n));
        this.position = 0;
        this.littleEndian = true;
    }
    ["setString"](n) {
        for (let r = 0; r < n.length; r++) {
            this.setUint16(n.charCodeAt(r));
        }
        return this;
    }
    ["setInt8"](n) {
        this.buffer.setInt8(this.position++, n);
        return this;
    }
    ["setUint8"](n) {
        this.buffer.setUint8(this.position++, n);
        return this;
    }
    ["setInt16"](n) {
        this.buffer.setInt16((this.position += 2) - 2, n, this.littleEndian);
        return this;
    }
    ["setUint16"](n) {
        this.buffer.setUint16((this.position += 2) - 2, n, this.littleEndian);
        return this;
    }
    ["setInt32"](n) {
        this.buffer.setInt32((this.position += 4) - 4, n, this.littleEndian);
        return this;
    }
    ["setUint32"](n) {
        if ((n % 1 !== 0) && (88 === n.toString().slice(-2))) {
            n += 4;
        }
        this.buffer.setUint32((this.position += 4) - 4, n, this.littleEndian);
        return this;
    }
    ["setFloat32"](n) {
        this.buffer.setFloat32((this.position += 4) - 4, n, this.littleEndian);
        return this;
    }
    ["setFloat64"](n) {
        this.buffer.setFloat64((this.position += 8) - 8, n, this.littleEndian);
        return this;
    }
    ["send"](n) {
        return send(this.buffer);
    }
}

let delay = 5100;
let currentSkinIndex = 0,currentWearIndex=0, interval,interval1, enabled = false;

unsafeWindow.changeskin = (id,wear) => {
    if(!$("input, textarea").is(":focus") && "block" != $("#advert").css("display") && "block" != $("#overlays").css("display")){
    let es = [""],
        rs = "";
    let packet = new Writer(4 + 2 * es.length + 2 * rs.length);
    packet.setUint8(1).setUint16(id).setUint8(es.length).setUint16(wear);
    packet.setString(rs).send();}
};

function rotateskin() {
    unsafeWindow.changeskin(skinid[currentSkinIndex],wearableid[currentWearIndex]);
    currentSkinIndex = (currentSkinIndex + 1) % skinid.length;
}
function rotatewear() {
    unsafeWindow.changeskin(skinid[currentSkinIndex],wearableid[currentWearIndex]);
    currentWearIndex = (currentWearIndex + 1) % wearableid.length;
}
function toggleRotation() {
    enabled = !enabled;
    if (enabled) {
        rotateskin()
        interval = setInterval(rotateskin, delay);
        interval1 = setInterval(rotatewear, delay*0);
    } else {
        clearInterval(interval);
        clearInterval(interval1);
    }
}

    unsafeWindow.addEventListener('keydown', (event) => {
        if (event.key === userkey&&!$("input, textarea").is(":focus")) {
            toggleRotation();
        }
    });