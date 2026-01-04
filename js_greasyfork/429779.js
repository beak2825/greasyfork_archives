// ==UserScript==
// @name         AutoHeal
// @namespace    -
// @version      -
// @description  autoheal
// @author       broken4
// @match        *://*.moomoo.io/*
// @match        *://*moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429779/AutoHeal.user.js
// @updateURL https://update.greasyfork.org/scripts/429779/AutoHeal.meta.js
// ==/UserScript==
(function(){
    'use strict';
    function send(data){
        const pow32 = 0x100000000;
        let floatBuffer,
            floatView,
            array = new Uint8Array(128),
            length = 0;
        append(data);
        return array.subarray(0, length);
        function append(data){
            switch(typeof data){
                case "undefined":
                    appendNull(data);
                    break;
                case "boolean":
                    appendBoolean(data);
                    break;
                case "number":
                    appendNumber(data);
                    break;
                case "string":
                    appendString(data);
                    break;
                case "object":
                    if(data === null){
                        appendNull(data);
                    }else if(data instanceof Date){
                        appendDate(data);
                    }else if(Array.isArray(data)){
                        appendArray(data);
                    }else if(data instanceof Uint8Array || data instanceof Uint8ClampedArray){
                        appendBinArray(data);
                    }else if(data instanceof Int8Array || data instanceof Int16Array || data instanceof Uint16Array ||
                               data instanceof Int32Array || data instanceof Uint32Array ||
                               data instanceof Float32Array || data instanceof Float64Array){
                        appendArray(data);
                    }else{
                        appendObject(data);
                    }
                    break;
            }
        }
        function appendNull(data){
            appendByte(0xc0);
        }
        function appendBoolean(data){
            appendByte(data ? 0xc3 : 0xc2);
        }
        function appendNumber(data){
            if(isFinite(data) && Math.floor(data) === data){
                if(data >= 0 && data <= 0x7f){
                    appendByte(data);
                }else if(data < 0 && data >= -0x20){
                    appendByte(data);
                }else if(data > 0 && data <= 0xff){
                    appendBytes([0xcc, data]);
                }else if(data >= -0x80 && data <= 0x7f){
                    appendBytes([0xd0, data]);
                }else if(data > 0 && data <= 0xffff){
                    appendBytes([0xcd, data >>> 8, data]);
                }else if(data >= -0x8000 && data <= 0x7fff){
                    appendBytes([0xd1, data >>> 8, data]);
                }else if(data > 0 && data <= 0xffffffff){
                    appendBytes([0xce, data >>> 24, data >>> 16, data >>> 8, data]);
                }else if(data >= -0x80000000 && data <= 0x7fffffff){
                    appendBytes([0xd2, data >>> 24, data >>> 16, data >>> 8, data]);
                }else if(data > 0 && data <= 0xffffffffffffffff){
                    let hi = data / pow32;
                    let lo = data % pow32;
                    appendBytes([0xd3, hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
                }else if(data >= -0x8000000000000000 && data <= 0x7fffffffffffffff){
                    appendByte(0xd3);
                    appendInt64(data);
                }else if(data < 0){
                    appendBytes([0xd3, 0x80, 0, 0, 0, 0, 0, 0, 0]);
                }else{
                    appendBytes([0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
                }
            }else{
                if(!floatView){
                    floatBuffer = new ArrayBuffer(8);
                    floatView = new DataView(floatBuffer);
                }
                floatView.setFloat64(0, data);
                appendByte(0xcb);
                appendBytes(new Uint8Array(floatBuffer));
            }
        }
        function appendString(data){
            let bytes = sendUtf8(data),
                length = bytes.length;

            if(length <= 0x1f){
                appendByte(0xa0 + length);
            }else if(length <= 0xff){
                appendBytes([0xd9, length]);
            }else if(length <= 0xffff){
                appendBytes([0xda, length >>> 8, length]);
            }else{
                appendBytes([0xdb, length >>> 24, length >>> 16, length >>> 8, length]);
            }
            appendBytes(bytes);
        }
        function appendArray(data){
            let length = data.length;
            if(length <= 0xf){
                appendByte(0x90 + length);
            }else if(length <= 0xffff){
                appendBytes([0xdc, length >>> 8, length]);
            }else{
                appendBytes([0xdd, length >>> 24, length >>> 16, length >>> 8, length]);
            }
            for (let index = 0; index < length; index++){
                append(data[index]);
            }
        }
        function appendBinArray(data){
            let length = data.length;
            if(length <= 0xf){
                appendBytes([0xc4, length]);
            }else if(length <= 0xffff){
                appendBytes([0xc5, length >>> 8, length]);
            }else{
                appendBytes([0xc6, length >>> 24, length >>> 16, length >>> 8, length]);
            }
            appendBytes(data);
        }
        function appendObject(data){
            let length = 0;
            for (let key in data) length++;
            if(length <= 0xf){
                appendByte(0x80 + length);
            }else if(length <= 0xffff){
                appendBytes([0xde, length >>> 8, length]);
            }else{
                appendBytes([0xdf, length >>> 24, length >>> 16, length >>> 8, length]);
            }
            for (let key in data){
                append(key);
                append(data[key]);
            }
        }
        function appendDate(data){
            let sec = data.getTime() / 1000;
            if(data.getMilliseconds() === 0 && sec >= 0 && sec < 0x100000000){
                appendBytes([0xd6, 0xff, sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else if(sec >= 0 && sec < 0x400000000){
                let ns = data.getMilliseconds() * 1000000;
                appendBytes([0xd7, 0xff, ns >>> 22, ns >>> 14, ns >>> 6, ((ns << 2) >>> 0) | (sec / pow32), sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else{
                let ns = data.getMilliseconds() * 1000000;
                appendBytes([0xc7, 12, 0xff, ns >>> 24, ns >>> 16, ns >>> 8, ns]);
                appendInt64(sec);
            }
        }
        function appendByte(byte){
            if(array.length < length + 1){
                let newLength = array.length * 2;
                while(newLength < length + 1)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array[length] = byte;
            length++;
        }
        function appendBytes(bytes){
            if(array.length < length + bytes.length){
                let newLength = array.length * 2;
                while(newLength < length + bytes.length)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array.set(bytes, length);
            length += bytes.length;
        }
        function appendInt64(value){
            let hi, lo;
            if(value >= 0){
                hi = value / pow32;
                lo = value % pow32;
            }
            else{
                value++;
                hi = Math.abs(value) / pow32;
                lo = Math.abs(value) % pow32;
                hi = ~hi;
                lo = ~lo;
            }
            appendBytes([hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
        }
    }
    function receive(array){
        const pow32 = 0x100000000;
        let pos = 0;
        if(array instanceof ArrayBuffer){
            array = new Uint8Array(array);
        }
        if(typeof array !== "object" || typeof array.length === "undefined"){
            throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
        }
        if(!array.length){
            throw new Error("Invalid argument: The byte array to deserialize is empty.");
        }
        if(!(array instanceof Uint8Array)){
            array = new Uint8Array(array);
        }
        let data = read();
        if(pos < array.length){
        }
        return data;
        function read(){
            const byte = array[pos++];
            if(byte >= 0x00 && byte <= 0x7f) return byte;
            if(byte >= 0x80 && byte <= 0x8f) return readMap(byte - 0x80);
            if(byte >= 0x90 && byte <= 0x9f) return readArray(byte - 0x90);
            if(byte >= 0xa0 && byte <= 0xbf) return readStr(byte - 0xa0);
            if(byte === 0xc0) return null;
            if(byte === 0xc1) throw new Error("Invalid byte code 0xc1 found.");
            if(byte === 0xc2) return false;
            if(byte === 0xc3) return true;
            if(byte === 0xc4) return readBin(-1, 1);
            if(byte === 0xc5) return readBin(-1, 2);
            if(byte === 0xc6) return readBin(-1, 4);
            if(byte === 0xc7) return readExt(-1, 1);
            if(byte === 0xc8) return readExt(-1, 2);
            if(byte === 0xc9) return readExt(-1, 4);
            if(byte === 0xca) return readFloat(4);
            if(byte === 0xcb) return readFloat(8);
            if(byte === 0xcc) return readUInt(1);
            if(byte === 0xcd) return readUInt(2);
            if(byte === 0xce) return readUInt(4);
            if(byte === 0xcf) return readUInt(8);
            if(byte === 0xd0) return readInt(1);
            if(byte === 0xd1) return readInt(2);
            if(byte === 0xd2) return readInt(4);
            if(byte === 0xd3) return readInt(8);
            if(byte === 0xd4) return readExt(1);
            if(byte === 0xd5) return readExt(2);
            if(byte === 0xd6) return readExt(4);
            if(byte === 0xd7) return readExt(8);
            if(byte === 0xd8) return readExt(16);
            if(byte === 0xd9) return readStr(-1, 1);
            if(byte === 0xda) return readStr(-1, 2);
            if(byte === 0xdb) return readStr(-1, 4);
            if(byte === 0xdc) return readArray(-1, 2);
            if(byte === 0xdd) return readArray(-1, 4);
            if(byte === 0xde) return readMap(-1, 2);
            if(byte === 0xdf) return readMap(-1, 4);
            if(byte >= 0xe0 && byte <= 0xff) return byte - 256;
            console.debug("msgpack array:", array);
            throw new Error("Invalid byte value '" + byte + "' at index " + (pos - 1) + " in the MessagePack binary data (length " + array.length + "): Expecting a range of 0 to 255. This is not a byte array.");
        }
        function readInt(size){
            let value = 0;
            let first = true;
            while(size-- > 0){
                if(first){
                    let byte = array[pos++];
                    value += byte & 0x7f;
                    if(byte & 0x80){
                        value -= 0x80;
                    }
                    first = false;
                }
                else{
                    value *= 256;
                    value += array[pos++];
                }
            }
            return value;
        }
        function readUInt(size){
            let value = 0;
            while(size-- > 0){
                value *= 256;
                value += array[pos++];
            }
            return value;
        }
        function readFloat(size){
            let view = new DataView(array.buffer, pos, size);
            pos += size;
            if(size === 4){
                return view.getFloat32(0, false);
            }
            if(size === 8){
                return view.getFloat64(0, false);
            }
        }
        function readBin(size, lengthSize){
            if(size < 0) size = readUInt(lengthSize);
            let data = array.subarray(pos, pos + size);
            pos += size;
            return data;
        }
        function readMap(size, lengthSize){
            if(size < 0) size = readUInt(lengthSize);
            let data = {};
            while(size-- > 0){
                let key = read();
                data[key] = read();
            }
            return data;
        }
        function readArray(size, lengthSize){
            if(size < 0) size = readUInt(lengthSize);
            let data = [];
            while(size-- > 0){
                data.push(read());
            }
            return data;
        }
        function readStr(size, lengthSize){
            if(size < 0) size = readUInt(lengthSize);
            let start = pos;
            pos += size;
            return receiveUtf8(array, start, size);
        }
        function readExt(size, lengthSize){
            if(size < 0) size = readUInt(lengthSize);
            let type = readUInt(1);
            let data = readBin(size);
            switch(type){
                case 255:
                    return readExtDate(data);
            }
            return{type: type, data: data};
        }
        function readExtDate(data){
            if(data.length === 4){
                let sec = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                return new Date(sec * 1000);
            }
            if(data.length === 8){
                let ns = ((data[0] << 22) >>> 0) +
                    ((data[1] << 14) >>> 0) +
                    ((data[2] << 6) >>> 0) +
                    (data[3] >>> 2);
                let sec = ((data[3] & 0x3) * pow32) +
                    ((data[4] << 24) >>> 0) +
                    ((data[5] << 16) >>> 0) +
                    ((data[6] << 8) >>> 0) +
                    data[7];
                return new Date(sec * 1000 + ns / 1000000);
            }
            if(data.length === 12){
                let ns = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                pos -= 8;
                let sec = readInt(8);
                return new Date(sec * 1000 + ns / 1000000);
            }
            throw new Error("Invalid data length for a date value.");
        }
    }
    function sendUtf8(str){
        let ascii = true, length = str.length;
        for (let x = 0; x < length; x++){
            if(str.charCodeAt(x) > 127){
                ascii = false;
                break;
            }
        }
        let i = 0, bytes = new Uint8Array(str.length * (ascii ? 1 : 4));
        for (let ci = 0; ci !== length; ci++){
            let c = str.charCodeAt(ci);
            if(c < 128){
                bytes[i++] = c;
                continue;
            }
            if(c < 2048){
                bytes[i++] = c >> 6 | 192;
            }
            else{
                if(c > 0xd7ff && c < 0xdc00){
                    if(++ci >= length)
                        throw new Error("UTF-8 encode: incomplete surrogate pair");
                    let c2 = str.charCodeAt(ci);
                    if(c2 < 0xdc00 || c2 > 0xdfff)
                        throw new Error("UTF-8 encode: second surrogate character 0x" + c2.toString(16) + " at index " + ci + " out of range");
                    c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                    bytes[i++] = c >> 18 | 240;
                    bytes[i++] = c >> 12 & 63 | 128;
                }
                else bytes[i++] = c >> 12 | 224;
                bytes[i++] = c >> 6 & 63 | 128;
            }
            bytes[i++] = c & 63 | 128;
        }
        return ascii ? bytes : bytes.subarray(0, i);
    }
    function receiveUtf8(bytes, start, length){
        let i = start, str = "";
        length += start;
        while(i < length){
            let c = bytes[i++];
            if(c > 127){
                if(c > 191 && c < 224){
                    if(i >= length)
                        throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                    c = (c & 31) << 6 | bytes[i++] & 63;
                }
                else if(c > 223 && c < 240){
                    if(i + 1 >= length)
                        throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                    c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else if(c > 239 && c < 248){
                    if(i + 2 >= length)
                        throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                    c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else throw new Error("UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1));
            }
            if(c <= 0xffff) str += String.fromCharCode(c);
            else if(c <= 0x10ffff){
                c -= 0x10000;
                str += String.fromCharCode(c >> 10 | 0xd800)
                str += String.fromCharCode(c & 0x3FF | 0xdc00)
            }
            else throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
        }
        return str;
    }
    let msgpack = {
        serialize: send,
        deserialize: receive,
        encode: send,
        decode: receive,
        send: send,
        receive: receive
    };
    if(typeof module === "object" && module && typeof module.exports === "object"){
        module.exports = msgpack;
    }
    else{
        window[window.msgpackJsName || "msgpack"] = msgpack;
    }
})();
function get(e){
    return document.getElementById(e);
}
setInterval(console.clear());
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png%27)%7D')`});
document.querySelector("#pre-content-container").remove();
localStorage.moofoll = !0;
setInterval(()=>{
    get('adCard').remove();
    $("#moomooio_728x90_home").parent().css({display: "none"});
    window.location.native_resolution = true
}, 1000)
setInterval(()=>{
    document.querySelector("#pre-content-container") !== null && (
        document.querySelector("#pre-content-container").remove(),
        $("#pre-content-container").remove(),
        get("#pre-content-container").remove()
    );
});
setInterval(()=>{
    get("ot-sdk-btn-floating").style.display = "none";
});
function ee(e){
    return(e.offsetParent !== null);
};
var ws,
    msgpack5 = msgpack
document.msgpack = msgpack;
function n(){
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if(!ws){
        document.ws = this;
        this.addEventListener("close", function(){
            reloadModule.loadState = "Disconnected";
        });
        ws = this;
        socketFound(this);
    };
    this.oldSend(m);
};
function socketFound(socket){
    socket.addEventListener('message', function(msg){
        handleMessage(msg)
    });
}
let myPlayer = {
    id: null,
    weapon: null
},
    mouseX,
    mouseY,
    width,
    height

function heal(){
    ae(["5", [foodType, true]]);
    ae(["c", [1, null]]);
    ae(["c", [0, null]]);
    ae(["5", [myPlayer.weapon, true]]);
};

function handleMessage(m){
    let raw = m.data,
        temp = msgpack5.receive(new Uint8Array(raw)),
        data;
    if(temp.length > 1){
        data = [temp[0], ...temp[1]];
        if(data[1] instanceof Array){
            data = data;
        }
    }else{
      data = temp;
    }
    let item = data[0];
    if(!data) return;
    if(item === "io-init"){
        let cvs = get("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function(){
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", (e)=>{
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    };
    if(item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    };
    if(item == "h" && data[1] == myPlayer.id){
        if(data[2] < 94){
            setTimeout(()=>{
                heal();
            }, 130);
        };
        if(data[2] < 34){
            heal();
            heal();
            heal();
        };
    };
    for(let i=0;i<data[1].length/13;i++){
        let playerInfo = data[1].slice(13*i, 13*i+13);
        if(playerInfo[0] == myPlayer.id){
            myPlayer.weapon = playerInfo[5];
        };
    };
};
function ae(e){
    ws.send(new Uint8Array(Array.from(msgpack5.send(e))));
};
function ea(e, t, n){
    let y = false;
    let b = undefined;
    return{
        start(r){
            if(r == e && document.activeElement.id.toLowerCase() !== 'chatbox'){
                y = true;
                if(b === undefined){
                    b = setInterval(()=>{
                        t();
                        if(!y){
                            clearInterval(b);
                            b = undefined;
                        };
                    }, n);
                };
            };
        },
        stop(r){
            if(r == e && document.activeElement.id.toLowerCase() !== 'chatbox'){
                y = false;
            };
        }
    };
};
var heal1key = "q",
    heal2key = "3",
    heal1 = ea(heal1key, ()=>{heal();heal()}, 55),
    heal2 = ea(heal2key, ()=>{heal();heal()}, 55);
document.addEventListener('keydown', (e)=>{
    heal1.start(e.key);
    heal2.start(e.key);
});
document.addEventListener('keyup', (e)=>{
    heal1.stop(e.key);
    heal2.stop(e.key);
});