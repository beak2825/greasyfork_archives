// ==UserScript==
// @name         YNOproject Collective Unconscious Kalimba Performer
// @name:zh-CN   YNOproject Collective Unconscious 卡林巴演奏家
// @namespace    https://github.com/Exsper/
// @version      0.1.8
// @description  Music can be played automatically based on the given score.
// @description:zh-CN  可以根据给定乐谱自动演奏乐曲。
// @author       Exsper
// @homepage     https://github.com/Exsper/yno-unconscious-performer#readme
// @supportURL   https://github.com/Exsper/yno-unconscious-performer/issues
// @match        https://ynoproject.net/unconscious/
// @require      https://cdn.staticfile.org/jquery/2.1.3/jquery.min.js
// @license      MIT License
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498090/YNOproject%20Collective%20Unconscious%20Kalimba%20Performer.user.js
// @updateURL https://update.greasyfork.org/scripts/498090/YNOproject%20Collective%20Unconscious%20Kalimba%20Performer.meta.js
// ==/UserScript==

// 自定义设置，可以修改
// 同时音符之间演奏最短延迟，设置过小可能无法及时切换音调导致弹错音符
const Same_Time_Interval = 40;
// 在低于最低音调（C3）多少半音的音符用最低音调弹奏，再低则忽略该音符
const Allow_Exceed_Range_low = 2;
// 在高于最高音调（B5）多少半音的音符用最高音调弹奏，再高则忽略该音符
const Allow_Exceed_Range_high = 2;

// 全局变量，不能修改
let nowGroup = "";
let isLoop = false;
let stopped = true;
let midiData = null;

function getKeyData(code) {
    switch (code) {
        case "1":
        case "C3": return { group: "left", key: "Digit1", keyCode: 49 };
        case "2":
        case "Db3":
        case "C#3": return { group: "left", key: "Digit2", keyCode: 50 };
        case "3":
        case "D3": return { group: "left", key: "Digit3", keyCode: 51 };
        case "4":
        case "Eb3":
        case "D#3": return { group: "left", key: "Digit4", keyCode: 52 };
        case "5":
        case "E3": return { group: "left", key: "Digit5", keyCode: 53 };
        case "6":
        case "F3": return { group: "left", key: "Digit6", keyCode: 54 };
        case "7":
        case "Gb3":
        case "F#3": return { group: "left", key: "Digit7", keyCode: 55 };
        case "8":
        case "G3": return { group: "left", key: "Digit8", keyCode: 56 };
        case "9":
        case "Ab3":
        case "G#3": return { group: "left", key: "Digit9", keyCode: 57 };
        case "10":
        case "A3": return { group: "left", key: "Digit0", keyCode: 48 };
        case "11":
        case "Bb3":
        case "A#3": return { group: "left", key: "BracketLeft", keyCode: 219 };
        case "12":
        case "B3": return { group: "left", key: "BracketRight", keyCode: 221 };

        case "13":
        case "C4": return { group: "down", key: "Digit1", keyCode: 49 };
        case "14":
        case "Db4":
        case "C#4": return { group: "down", key: "Digit2", keyCode: 50 };
        case "15":
        case "D4": return { group: "down", key: "Digit3", keyCode: 51 };
        case "16":
        case "Eb4":
        case "D#4": return { group: "down", key: "Digit4", keyCode: 52 };
        case "17":
        case "E4": return { group: "down", key: "Digit5", keyCode: 53 };
        case "18":
        case "F4": return { group: "down", key: "Digit6", keyCode: 54 };
        case "19":
        case "Gb4":
        case "F#4": return { group: "down", key: "Digit7", keyCode: 55 };
        case "20":
        case "G4": return { group: "down", key: "Digit8", keyCode: 56 };
        case "21":
        case "Ab4":
        case "G#4": return { group: "down", key: "Digit9", keyCode: 57 };
        case "22":
        case "A4": return { group: "down", key: "Digit0", keyCode: 48 };
        case "23":
        case "Bb4":
        case "A#4": return { group: "down", key: "BracketLeft", keyCode: 219 };
        case "24":
        case "B4": return { group: "down", key: "BracketRight", keyCode: 221 };

        case "25":
        case "C5": return { group: "right", key: "Digit1", keyCode: 49 };
        case "26":
        case "Db5":
        case "C#5": return { group: "right", key: "Digit2", keyCode: 50 };
        case "27":
        case "D5": return { group: "right", key: "Digit3", keyCode: 51 };
        case "28":
        case "Eb5":
        case "D#5": return { group: "right", key: "Digit4", keyCode: 52 };
        case "29":
        case "E5": return { group: "right", key: "Digit5", keyCode: 53 };
        case "30":
        case "F5": return { group: "right", key: "Digit6", keyCode: 54 };
        case "31":
        case "Gb5":
        case "F#5": return { group: "right", key: "Digit7", keyCode: 55 };
        case "32":
        case "G5": return { group: "right", key: "Digit8", keyCode: 56 };
        case "33":
        case "Ab5":
        case "G#5": return { group: "right", key: "Digit9", keyCode: 57 };
        case "34":
        case "A5": return { group: "right", key: "Digit0", keyCode: 48 };
        case "35":
        case "Bb5":
        case "A#5": return { group: "right", key: "BracketLeft", keyCode: 219 };
        case "36":
        case "B5": return { group: "right", key: "BracketRight", keyCode: 221 };

        case "0": return null;
        default: return null;
    }
}

function switchToGroup(group) {
    if (nowGroup !== group) {
        nowGroup = group;
        switch (group) {
            case "left": return simulateKeyboardInput("ArrowLeft", 37);
            case "down": return simulateKeyboardInput("ArrowDown", 40);
            case "right": return simulateKeyboardInput("ArrowRight", 39);
            // case "up": return simulateKeyboardInput("ArrowUp",38);
            default: return;
        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playSong(song, bpm) {
    nowGroup = "";
    let bpmnum = parseFloat(bpm);
    if (bpmnum <= 10 || bpmnum > 1200) bpmnum = 60;
    let interval = 60 / bpmnum * 1000;
    let keys = song.split(" ");
    stopped = false;
    for (let i = 0; i < keys.length; i++) {
        let keyData = getKeyData(keys[i]);
        if (keyData !== null) {
            if (nowGroup === "") switchToGroup(keyData.group);
            simulateKeyboardInput(keyData.key, keyData.keyCode);
        }

        if (stopped) break;

        await wait(interval / 2);

        if (stopped) break;

        let nextKey = "";
        if (i < keys.length - 1) nextKey = getKeyData(keys[i + 1]);
        else nextKey = getKeyData(keys[0]);
        if (nextKey !== null) switchToGroup(nextKey.group);

        await wait(interval / 2);
    }
    if (stopped) {
        $("#rs-play").text("开始演奏");
        return;
    }
    if (isLoop) await playSong(song, bpm);
    else {
        stopped = true;
        $("#rs-play").text("开始演奏");
    }
}

// ---------------------------------------------------------------------------------------
// refer to https://madderscientist.github.io/je_score_operator
function JE2Song(text) {
    let n = 0;
    let pitch = 13;
    let song = [];
    const note = ["1", "#1", "2", "#2", "3", "4", "#4", "5", "#5", "6", "#6", "7"];
    while (n < text.length) {
        while (n < text.length) {
            for (; n < text.length; n++) {              //音高
                if (text[n] === '[' || text[n] === ')') pitch += 12;
                else if (text[n] === ']' || text[n] === '(') pitch -= 12;
                else break;
            }
            if (text[n] === '\n' || text[n] === ' ') {    //空格换行停顿
                n++;
                song.push(0);
                break;
            } else {
                let up = 0;
                if (n < text.length) {                  //升降
                    if (text[n] === '#') up = 1;
                    else if (text[n] === 'b') up = -1;
                }
                if (n + Math.abs(up) < text.length) {
                    let noteid = note.indexOf(text[n + Math.abs(up)]);
                    if (noteid > -1) {
                        song.push(noteid + pitch + up);
                        n = n + Math.abs(up) + 1;
                        break;
                    } else {        //没找到，说明不是音符，不结束，找音符
                        n++;
                    }
                } else {
                    break;
                }
            }
        }
    }
    return song.join(" ");
}

// midi.js
// 封装二进制事件
class midiEvent {
    // 若tisks == -1, 在addEvent时会自动使用last_tick; 若<-1, 则last_tick - this.ticks
    static note(at, duration, note, intensity) {
        return [{
            ticks: at,
            code: 0x9,
            value: [note, intensity]
        }, {
            ticks: at >= 0 ? at + duration : -duration,
            code: 0x9,
            value: [note, 0]
        }];
    }
    static instrument(at, instrument) {
        return {
            ticks: at,
            code: 0xc,
            value: [instrument]
        };
    }
    static control(at, id, Value) {
        return {
            ticks: at,
            code: 0xb,
            value: [id, Value]
        };
    }
    static tempo(at, bpm) {
        bpm = Math.round(60000000 / bpm);
        return {
            ticks: at,
            code: 0xff,
            type: 0x51,
            value: mtrk.number_hex(bpm, 3)
        };
    }
    static time_signature(at, numerator, denominator) {
        return {
            ticks: at,
            code: 0xff,
            type: 0x58,
            value: [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x8]
        };
    }
}
// 一个音轨
class mtrk {
    /**
     * 将tick数转换为midi的时间格式
     * @param {number} ticknum int
     * @returns midi tick array
     * @example mtrk.tick_hex(555555) // [0x08, 0x7A, 0x23]
     */
    static tick_hex(ticknum) {
        ticknum = ticknum.toString(2);
        let i = ticknum.length, j = Math.ceil(i / 7) * 7;
        for (; i < j; i++) ticknum = '0' + ticknum;
        let t = Array();
        for (i = 0; i + 7 < j; i = i + 7) t.push('1' + ticknum.substring(i, i + 7));
        t.push('0' + ticknum.substr(-7, 7));
        for (i = 0; i < t.length; i++) t[i] = parseInt(t[i], 2);
        return t;
    }
    /**
     * 将字符串转换为ascii数组
     * @param {string} name string
     * @param {number} x array's length (default:self-adaption)
     * @returns array
     * @example mtrk.string_hex("example",3) // [101,120,97]
     */
    static string_hex(str, x = -1) {
        let Buffer = Array(x > 0 ? x : str.length).fill(0);
        let len = Math.min(Buffer.length, str.length);
        for (let i = 0; i < len; i++) Buffer[i] = str[i].charCodeAt();
        return Buffer;
    }
    /**
     * 将一个正整数按16进制拆分成各个位放在数组中, 最地位在数组最高位
     * @param {number} num int
     * @param {number} x array's length (default:self-adaption)
     * @returns array
     * @example mtrk.number_hex(257,5) // [0,0,0,1,1]
     */
    static number_hex(num, x = -1) {
        if (x > 0) {
            let Buffer = Array(x).fill(0);
            for (--x; x >= 0 && num != 0; x--) {
                Buffer[x] = num & 0xff;
                num = num >> 8;
            }
            return Buffer;
        } else {
            let len = 0;
            let num2 = num;
            while (num2 != 0) {
                num2 = num2 >> 8;
                len++;
            }
            let Buffer = Array(len);
            for (--len; len >= 0; len--) {
                Buffer[len] = num & 0xff;
                num = num >> 8;
            }
            return Buffer;
        }
    }
    constructor(name = "untitled", event_list = Array()) {
        this.name = name;
        this.events = event_list;
        this.last_tick = 0; // 最后一个事件的时间
    }
    /**
     * 向mtrk添加事件
     * @param {object} event {ticks,code,*[type],value}
     * @returns event (or event list, or event list nesting)
     * @example m.addEvent({ticks:0,code:0x9,value:[40,100]}); m.addEvent(midiEvent.tempo(0,120));
     */
    addEvent(event) {
        const addevent = (e) => {
            if (e.ticks < 0) {
                if (e.ticks == -1)
                    e.ticks = this.last_tick;
                else
                    e.ticks = this.last_tick - e.ticks;
            }
            this.events.push(e);
            if (e.ticks > this.last_tick)
                this.last_tick = e.ticks;
        }
        const parseEvents = (el) => {
            if (Array.isArray(el)) {
                for (let i = 0; i < el.length; i++)
                    parseEvents(el[i]);
            } else addevent(el);
        }
        parseEvents(event);
        return event;
    }
    /**
     * 对齐事件
     * @param {number} tick 一个四分音符的tick数
     * @param {number} accuracy int, 精度, 越大允许的最短时长越小
     */
    align(tick, accuracy = 4) {
        accuracy = tick / parseInt(accuracy);
        for (let i = 0; i < this.events.length; i++) {
            this.events[i].ticks = Math.round(this.events[i].ticks / accuracy) * accuracy;
        }
    }
    /**
     * 事件按时间排序，同时间的音符事件则按力度排序
     */
    sort() {
        this.events.sort((a, b) => {
            if (a.ticks == b.ticks) {
                if (a.code == b.code && a.code == 9) return a.value[1] - b.value[1];
                return b.code - a.code;
            } return a.ticks - b.ticks;
        });
    }
    /**
     * 将mtrk转换为track_id音轨上的midi数据
     * @param {number} track_id int, [0, 15]
     * @returns Array
     */
    export(track_id) {
        this.sort();
        // 音轨名
        let data = mtrk.string_hex(this.name);
        data = [0, 255, 3, data.length, ...data];
        // 事件解析
        let current = 0;
        for (let i = 0; i < this.events.length; i++) {
            let temp = this.events[i];
            let d = null;
            if (temp.code >= 0xf0) {
                if (temp.code == 0xf0) d = [0xf0, temp.value.length];
                else d = [0xff, temp.type, temp.value.length];
            } else d = (temp.code << 4) + track_id;
            data = data.concat(mtrk.tick_hex(temp.ticks - current), d, temp.value);
            current = temp.ticks;
        }
        return [77, 84, 114, 107,
            ...mtrk.number_hex(data.length + 4, 4),
            ...data,
            0, 255, 47, 0];
    }

    /**
     * 将音轨转为可JSON对象
     * @param {number} track_id 音轨所属轨道id (从0开始)
     * @returns json object
     */
    JSON(track_id) {
        this.sort();
        let Notes = [],
            controls = [],
            Instruments = [],
            Tempos = [],
            TimeSignatures = [];
        for (let i = 0; i < this.events.length; i++) {
            let temp = this.events[i];
            switch (temp.code) {
                case 0x9:
                    if (temp.value[1] > 0) {    // 力度不为0表示按下
                        let overat = temp.ticks;
                        for (let j = i + 1; j < this.events.length; j++) {
                            let over = this.events[j];
                            if (over.code == 0x9 && over.value[0] == temp.value[0]) {
                                overat = over.ticks;
                                if (overat > temp.ticks) {
                                    Notes.push({
                                        ticks: temp.ticks,
                                        durationTicks: overat - temp.ticks,
                                        midi: temp.value[0],
                                        intensity: temp.value[1]
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    break;
                case 0xb:
                    controls.push({
                        ticks: temp.ticks,
                        controller: temp.value[0],
                        value: temp.value[1]
                    })
                    break;
                case 0xc:
                    Instruments.push({
                        ticks: temp.ticks,
                        number: temp.value[0]
                    });
                    break;
                case 0xff:
                    switch (temp.type) {
                        case 0x51:  // 速度
                            Tempos.push({
                                ticks: temp.ticks,
                                bpm: Math.round(60000000 / ((temp.value[0] << 16) + (temp.value[1] << 8) + temp.value[2]))
                            });
                            break;
                        case 0x58:  // 节拍
                            TimeSignatures.push({
                                ticks: temp.ticks,
                                timeSignature: [temp.value[0], 2 << temp.value[1]]
                            });
                            break;
                    }
                    break;
            }
        }
        return {
            channel: track_id,
            name: this.name,
            tempos: Tempos,
            controlChanges: controls,
            instruments: Instruments,
            notes: Notes,
            timeSignatures: TimeSignatures
        }
    }
    toJSON(track_id) {
        return this.JSON(track_id);
    }
}
// midi文件，组织多音轨
class midi {
    constructor(bpm = 120, time_signature = [4, 4], tick = 480, Mtrk = [], Name = 'untitled') {
        this.bpm = bpm;
        this.Mtrk = Mtrk;   // Array<mtrk>
        this.tick = tick;   // 一个四分音符的tick数
        this.time_signature = time_signature;
        this.name = Name;
    }
    /**
     * 添加音轨，如果无参则创建并返回
     * @param {mtrk} newtrack
     * @returns mtrk
     * @example track = m.addTrack(); m2.addTrack(new mtrk("test"))
     */
    addTrack(newtrack = null) {
        if (newtrack == null)
            newtrack = new mtrk(String(this.Mtrk.length));
        this.Mtrk.push(newtrack);
        return newtrack;
    }
    /**
     * 对齐所有音轨 修改自身
     * @param {number} accuracy 对齐精度
     */
    align(accuracy = 4) {
        for (let i = 0; i < this.Mtrk.length; i++)
            this.Mtrk[i].align(this.tick, accuracy);
    }
    /**
     * 解析midi文件，返回新的midi对象
     * @param {Uint8Array} midi_file midi数据
     * @returns new midi object
     */
    static import(midi_file) {
        // 判断是否为midi文件
        if (midi_file.length < 14) return null;
        if (midi_file[0] != 77 || midi_file[1] != 84 || midi_file[2] != 104 || midi_file[3] != 100) return null;
        let newmidi = new midi(120, [4, 4], 480, Array.from({ length: 16 }, (_, i) => new mtrk(String(i))), '');
        // 读取文件头
        newmidi.tick = midi_file[13] + (midi_file[12] << 8);
        let mtrkNum = midi_file[11] + (midi_file[10] << 8);
        let midtype = midi_file[9];
        // 读mtrk音轨
        for (let n = 0, i = 14; n < mtrkNum; n++) {
            // 判断是否为MTrk音轨
            if (midi_file[i++] != 77 || midi_file[i++] != 84 || midi_file[i++] != 114 || midi_file[i++] != 107) { n--; i -= 3; continue; }
            let timeline = 0;       // 时间线
            let lastType = 0xC0;	// 上一个midi事件类型
            let lastChaneel = n - 1;  // 上一个midi事件通道
            let mtrklen = (midi_file[i++] << 24) + (midi_file[i++] << 16) + (midi_file[i++] << 8) + midi_file[i++] + i;
            // 读取事件
            for (; i < mtrklen; i++) {
                // 时间间隔(tick)
                let flag = 0;
                while (midi_file[i] > 127)
                    flag = (flag << 7) + midi_file[i++] - 128;
                timeline += (flag << 7) + midi_file[i++];
                // 事件类型
                let type = midi_file[i] & 0xf0;
                let channel = midi_file[i++] - type;
                let ichannel = midtype ? n : channel;
                do {
                    flag = false;
                    switch (type) { //结束后指向事件的最后一个字节
                        case 0x90:	// 按下音符
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0x9,
                                value: [midi_file[i++], midi_file[i]]
                            });
                            break;
                        case 0x80:	// 松开音符
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0x9,
                                value: [midi_file[i++], 0]
                            });
                            break;
                        case 0xF0:	// 系统码和其他格式
                            if (channel == 0xF) {
                                switch (midi_file[i++]) {
                                    case 0x2f:
                                        break;
                                    case 0x03:
                                        // 给当前mtrk块同序号的音轨改名
                                        // newmidi.Mtrk[n].name = '';
                                        // for (let q = 1; q <= midi_file[i]; q++)
                                        //     newmidi.Mtrk[n].name += String.fromCharCode(midi_file[i + q]);
                                        break;
                                    case 0x58:
                                        if (timeline == 0) {
                                            newmidi.time_signature = [midi_file[i + 1], 1 << midi_file[i + 2]];
                                            break;
                                        }
                                    case 0x51:
                                        if (timeline == 0) {
                                            newmidi.bpm = Math.round(60000000 / ((midi_file[i + 1] << 16) + (midi_file[i + 2] << 8) + midi_file[i + 3]));
                                            break;
                                        }
                                    default:
                                        newmidi.Mtrk[0].addEvent({
                                            ticks: timeline,
                                            code: 0xff,
                                            type: midi_file[i - 1],
                                            value: Array.from(midi_file.slice(i + 1, i + 1 + midi_file[i]))
                                        });
                                        break;
                                }
                            } else {	// 系统码
                                newmidi.Mtrk[0].addEvent({
                                    ticks: timeline,
                                    code: 0xf0,
                                    value: Array.from(midi_file.slice(i + 1, i + 1 + midi_file[i]))
                                });
                            }
                            i += midi_file[i];
                            break;
                        case 0xB0:	// 控制器
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0xb,
                                value: [midi_file[i++], midi_file[i]]
                            });
                            break;
                        case 0xC0:	// 改变乐器
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0xc,
                                value: [midi_file[i]]
                            });
                            break;
                        case 0xD0:	// 触后通道
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0xd,
                                value: [midi_file[i]]
                            });
                            break;
                        case 0xE0:	// 滑音
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0xe,
                                value: [midi_file[i++], midi_file[i]]
                            });
                            break;
                        case 0xA0:	// 触后音符
                            newmidi.Mtrk[ichannel].addEvent({
                                ticks: timeline,
                                code: 0xa,
                                value: [midi_file[i++], midi_file[i]]
                            });
                            break;
                        default:
                            type = lastType;
                            channel = lastChaneel
                            flag = true;
                            i--;
                            break;
                    }
                } while (flag);
                lastType = type;
                lastChaneel = channel;
            }
        }
        newmidi.name = newmidi.Mtrk[0].name;
        // 找到第一个有音符的音轨
        mtrkNum = 0;
        for (let i = 1; i < newmidi.Mtrk.length; i++) {
            let temp = newmidi.Mtrk[i].events;
            for (let j = 0; j < temp.length; j++) {
                if (temp[j].code == 0x9) {
                    mtrkNum = i;
                    temp = null;
                    break;
                }
            }
            if (!temp) break;
        }
        // 把没有音符的音轨事件移到第一个有音符的音轨
        for (let i = 0; i < newmidi.Mtrk.length; i++) {
            let temp = newmidi.Mtrk[i].events;
            for (let j = 0; j < temp.length; j++) {
                if (temp[j].code == 0x9) {
                    temp = null;
                    break;
                }
            }
            if (temp) {
                newmidi.Mtrk[mtrkNum].events = newmidi.Mtrk[mtrkNum].events.concat(temp);
                newmidi.Mtrk[i] = null;
            }
        }
        // 删去空的音轨
        for (let i = 0; i < newmidi.Mtrk.length; i++)
            if (!newmidi.Mtrk[i] || newmidi.Mtrk[i].events.length == 0) newmidi.Mtrk.splice(i--, 1);
        return newmidi;
    }
    /**
     * 转换为midi数据
     * @param {*} type midi file type [0 or 1(default)]
     * @returns Uint8Array
     */
    export(type = 1) {
        if (type == 0) {    // midi0创建 由于事件不记录音轨，需要归并排序输出
            let Mtrks = Array(this.Mtrk.length + 1);
            for (let i = 0; i < this.Mtrk.length; i++) {
                this.Mtrk[i].sort();
                Mtrks[i] = this.Mtrk[i].events;
            }
            Mtrks[this.Mtrk.length] = new mtrk("head", [
                midiEvent.tempo(0, this.bpm),
                midiEvent.time_signature(0, this.time_signature[0], this.time_signature[1])
            ]);
            let current = 0;
            let index = Array(Mtrks.length).fill(0);
            let data = [];
            while (true) {
                // 找到ticks最小项
                let min = -1;
                let minticks = 0;
                for (let i = 0; i < index.length; i++) {
                    if (index[i] < Mtrks[i].length) {
                        if (min == -1 || Mtrks[i][index[i]].ticks < minticks) {
                            min = i;
                            minticks = Mtrks[i][index[i]].ticks;
                        }
                    }
                }
                if (min == -1) break;
                // 转为midi数据
                let d = null;
                let temp = Mtrks[min][index[min]];
                if (temp.code >= 0xf0) {
                    if (temp.code == 0xf0) d = [0xf0, temp.value.length];
                    else d = [0xff, temp.type, temp.value.length];
                } else d = (temp.code << 4) + min;
                data = data.concat(mtrk.tick_hex(temp.ticks - current), d, temp.value);
                // 善后
                current = minticks;
                index[min]++;
            }
            data = [0, 255, 3, 5, 109, 105, 100, 105, 48, ...data, 0, 255, 47, 0];  // 加了音轨名和结尾
            return new Uint8Array([
                77, 84, 104, 100, 0, 0, 0, 6, 0, 0, 0, 1, ...mtrk.number_hex(this.tick, 2),
                77, 84, 114, 107,
                ...mtrk.number_hex(data.length, 4),
                ...data
            ]);
        } else {    // 除了初始速度、初始节拍，其余ff事件全放0音轨。头音轨不在Mtrk中，export时生成
            // MThd创建
            let data = [77, 84, 104, 100, 0, 0, 0, 6, 0, 1, ...mtrk.number_hex(1 + this.Mtrk.length, 2), ...mtrk.number_hex(this.tick, 2)];
            // 加入全局音轨
            let headMtrk = new mtrk("head", [
                midiEvent.tempo(0, this.bpm),
                midiEvent.time_signature(0, this.time_signature[0], this.time_signature[1])
            ])
            data = data.concat(headMtrk.export(0));
            // 加入其余音轨
            for (let i = 0; i < this.Mtrk.length; i++)
                data = data.concat(this.Mtrk[i].export(i));
            return new Uint8Array(data);
        }
    }

    /**
     * 将midi转换为json对象。原理：每个音轨转换为json对象并对事件进行合并
     * @returns json object
     */
    JSON() {
        let j = {
            header: {
                name: this.name,
                tick: this.tick,
                tempos: [{
                    ticks: 0,
                    bpm: this.bpm
                }],
                timeSignatures: [{
                    ticks: 0,
                    timeSignature: this.time_signature
                }]
            },
            tracks: []
        }
        for (let i = 0; i < this.Mtrk.length; i++) {
            let t = this.Mtrk[i].JSON(i);
            j.header.tempos = j.header.tempos.concat(t.tempos);
            j.header.timeSignatures = j.header.timeSignatures.concat(t.timeSignatures);
            j.tracks.push({
                channel: t.channel,
                name: t.name,
                controlChanges: t.controlChanges,
                instruments: t.instruments,
                notes: t.notes
            });
        }
        return j;
    }
    toJSON() {
        return this.JSON();
    }
}

// ---------------------------------------------------------------------------------------

// 把序号转换为音符，越界为0
function indexToKey(index) {
    index = index - 60;
    if (index <= -12) return 0;
    if (index >= 25) return 0;
    return index + 12;
}

function getTrackPlayableNoteCount(track) {
    let playableCount = 0;
    for (let i = 0; i < track.notes.length; i++) {
        if (indexToKey(track.notes[i].midi) !== 0) playableCount += 1;
    }
    return playableCount;
}

function getTrackPlayableNoteLength(track) {
    let playableLength = 0;
    for (let i = 0; i < track.notes.length; i++) {
        if (indexToKey(track.notes[i].midi) !== 0) playableLength += track.notes[i].durationTicks;
    }
    return playableLength;
}

// 检查轨道内音符可弹奏数，有大于20%的音符无法弹奏则舍弃掉该轨道
function checkTrackPlayable(track) {
    let noteCount = track.notes.length;
    if (noteCount <= 0) return false;
    let playableCount = getTrackPlayableNoteCount(track);
    if ((playableCount / noteCount) < 0.8) return false;
    return true;
}

// 检查是否在相同音阶
function checkKeyInSameScale(key1, key2) {
    let scale1 = parseInt((key1 - 1) / 12);
    let scale2 = parseInt((key2 - 1) / 12);
    return scale1 === scale2;
}

function ReadMIDIInfo() {
    if (!midiData) return null;

    let midiJson = midiData.JSON();
    let midiInfo = [];
    for (let i = 0; i < midiJson.tracks.length; i++) {
        let playableNoteCount = getTrackPlayableNoteCount(midiJson.tracks[i]);
        let playableNoteLength = getTrackPlayableNoteLength(midiJson.tracks[i]);
        let isPlayable = checkTrackPlayable(midiJson.tracks[i])
        midiInfo.push({ index: i, playableNoteCount, playableNoteLength, isPlayable });
    }
    midiInfo = midiInfo.filter((a) => a.isPlayable === true);
    midiInfo.sort((a, b) => b.playableNoteLength - a.playableNoteLength);
    return midiInfo;
}

function MIDI2Song(trackIndexs, keyConflictMethod = "all") {
    function approximateIndexToKey(index) {
        index = index - 59;
        if (index <= -12 - Allow_Exceed_Range_low) return 0;
        if (index >= 25 + Allow_Exceed_Range_high) return 0;
        if (index <= -12) return 1;
        if (index >= 25) return 36;
        return index + 12;
    }

    if (!midiData) return null;

    let midiJson = midiData.JSON();

    let mix = [];

    for (let i = 0; i < midiJson.tracks.length; i++) {
        if (trackIndexs.includes(i)) mix = mix.concat(midiJson.tracks[i].notes);
    }
    if (mix.length <= 0) return null;

    mix.sort((a, b) => (a.ticks === b.ticks ? a.midi - b.midi : a.ticks - b.ticks));

    let intervalList = [];
    let lastKey = 0;
    let keyList = [];
    let totalInterval = 0;
    let sameTimeOffsetSum = 0;

    let bpm = midiJson.header.tempos.pop().bpm;
    let realTimePerTick = 60000 / bpm / midiJson.header.tick;

    for (let i = 0; i < mix.length; i++) {
        // 音符演奏长度一致，故不用考虑durationTicks
        let interval = mix[i].ticks * realTimePerTick + sameTimeOffsetSum - totalInterval;
        let key = approximateIndexToKey(mix[i].midi);
        if (key === 0) continue;
        if ((lastKey !== 0) && (interval < Same_Time_Interval)) {
            // 如果同时间、同音符，则舍弃
            if (key === lastKey) {
                continue;
            }
            else if (checkKeyInSameScale(key, lastKey)) {
                // 相同音阶，不用考虑短时切换音阶造成的错误弹奏
            }
            else {
                if (keyConflictMethod === "all") {
                    // 全部弹奏
                    interval = Same_Time_Interval;
                    sameTimeOffsetSum += Same_Time_Interval - interval;
                }
                else {
                    if (keyConflictMethod === "high") {
                        // 取高音
                        if (key <= lastKey) continue;
                    }
                    else if (keyConflictMethod === "low") {
                        // 取低音
                        if (key >= lastKey) continue;
                    }
                    else if (keyConflictMethod === "middle") {
                        // 取靠近F4的音
                        if (Math.abs(key - 18) >= Math.abs(lastKey - 18)) continue;
                    }
                    // 删除上一个key
                    let _lastInterval = intervalList.pop();
                    let _lastKey = keyList.pop();
                    if (keyList.length <= 0) lastKey = 0;
                    else lastKey = keyList[keyList.length - 1];
                    totalInterval -= _lastInterval;
                    // 重复该次循环，重新判断
                    i -= 1;
                    continue;
                }
            }
        }
        intervalList.push(interval);
        keyList.push(key);
        lastKey = key;
        totalInterval += interval;
    }

    let lastnote = mix.pop();
    let endWaitTime = lastnote.durationTicks;
    if (bpm && bpm > 0) {
        let itv = 60 * 1000 / bpm * 4;
        let toEnd = itv - lastnote.ticks % itv;
        if (toEnd > endWaitTime) endWaitTime = toEnd;
    }
    endWaitTime *= realTimePerTick;

    return { intervalList, keyList, endWaitTime };
}

async function playMIDI(trackIndexs, keyConflictMethod = "all") {
    nowGroup = "";
    let keyInfo = MIDI2Song(trackIndexs, keyConflictMethod);
    if (!keyInfo) {
        alert("不支持演奏该MIDI音乐");
        stopped = true;
        $("#rs-play").text("开始演奏");
        return;
    }
    let intervalList = keyInfo.intervalList;
    let keyList = keyInfo.keyList;
    let endWaitTime = keyInfo.endWaitTime;
    stopped = false;
    for (let i = 0; ;) {
        if (stopped) break;

        await wait(intervalList[i] / 2);

        if (stopped) break;

        let keyData = getKeyData(keyList[i].toString());
        if (keyData !== null) {
            if (nowGroup === "") switchToGroup(keyData.group);
            simulateKeyboardInput(keyData.key, keyData.keyCode);
        }

        if (i < intervalList.length - 1) await wait(intervalList[i + 1] / 2);
        else await wait(intervalList[0] / 2);

        if (stopped) break;

        let nextKey = "";
        if (i < keyList.length - 1) nextKey = getKeyData(keyList[i + 1].toString());
        else nextKey = getKeyData(keyList[0].toString());
        if (nextKey !== null) switchToGroup(nextKey.group);

        i++;
        if (i >= keyList.length) {
            if (isLoop) {
                i = 0;
                nowGroup = "";
                await wait(endWaitTime);
                continue;
            }
            else {
                stopped = true;
                break;
            }
        }
    }
    $("#rs-play").text("开始演奏");
    return;
}



function init() {
    let $openButton = $('<button>', { text: "+", id: "rs-open", style: "float:left;top:30%;position:absolute;left:0%;", title: "显示窗口" }).appendTo($("body"));
    $openButton.click(() => {
        $("#rs-div").show();
        $("#rs-open").hide();
    });
    let $mainDiv = $("<div>", { id: "rs-div", class: "container", style: "top:40%;left:0%;transform: translate(0, -50%);width:200px;position:absolute;text-align:center;z-index:999;height:auto;max-height:70vh;min-height:160px;overflow:hidden;border-top: 24px double #000000 !important;padding-top: 0px !important;" });
    $mainDiv.hide();
    let $statLabel = $("<span>", { id: "rs-stat", text: "请在使用卡林巴效果并打开钢琴窗后点击“开始演奏”", style: "display: block; padding: 6px;" }).appendTo($mainDiv);
    let $textTypeSelect = $("<select>", { id: "rs-select-type" }).appendTo($mainDiv);
    $textTypeSelect.append($('<option></option>').attr('value', '0').text('标准音符'));
    $textTypeSelect.append($('<option></option>').attr('value', 'je').text('JE谱'));
    $textTypeSelect.append($('<option></option>').attr('value', 'midi').text('MIDI'));
    $textTypeSelect.val("0");
    let $file = $("<input>", { type: "file", id: "rs-file", style: "font-size: 10px; align-self: center; display: inline-block;" }).appendTo($mainDiv);
    $file.on("change", () => {
        let rawdata;
        let reader = new FileReader();
        try {
            reader.readAsArrayBuffer($file[0].files[0]);
            reader.onload = function () {
                rawdata = new Uint8Array(this.result);
                midiData = midi.import(rawdata);

                let $mainTable = $("#rs-table");
                $mainTable.empty();
                let midiInfo = ReadMIDIInfo();
                if (!midiInfo || midiInfo.length <= 0) {
                    alert("不支持演奏该MIDI音乐");
                    return;
                }
                let $ltr = $("<tr>", { style: "width:100%;" });
                let $ltd = $("<td>", { style: "width:30%" }).appendTo($ltr);
                $("<span>", { text: "演奏音轨" }).appendTo($ltd);
                $ltd = $("<td>", { style: "width:35%" }).appendTo($ltr);
                $("<span>", { text: "可演奏音符数" }).appendTo($ltd);
                $ltd = $("<td>", { style: "width:35%" }).appendTo($ltr);
                $("<span>", { text: "可演奏长度" }).appendTo($ltd);
                $ltr.appendTo($mainTable);
                midiInfo.map((trackInfo, index) => {
                    $ltr = $("<tr>");
                    $ltd = $("<td>").appendTo($ltr);
                    let $trackCheckbox = $("<input>", { type: "checkbox", class: "rs-track", track: trackInfo.index }).appendTo($ltd);
                    if (index === 0) $trackCheckbox.prop("checked", true);
                    $ltd = $("<td>").appendTo($ltr);
                    $("<span>", { text: trackInfo.playableNoteCount }).appendTo($ltd);
                    $ltd = $("<td>").appendTo($ltr);
                    $("<span>", { text: trackInfo.playableNoteLength }).appendTo($ltd);
                    $ltr.appendTo($mainTable);
                });
            };
        }
        catch (err) {
            midiData = null;
        }
    });
    $file.hide();
    let $songText = $("<textarea>", { id: "rs-song", style: "min-height: 80px;" }).appendTo($mainDiv);
    $("<span>", { id: "rs-bpm-label", text: "BPM: " }).appendTo($mainDiv);
    let $numBox = $("<input>", { type: "text", id: "rs-bpm", val: "120", style: "width:30px;align-self:center;" }).appendTo($mainDiv);
    $textTypeSelect.on("change", () => {
        if ($textTypeSelect.val() === "midi") {
            $("#rs-file").show();
            $("#rs-table").show();
            $("#rs-select-conflict-label").show();
            $("#rs-select-conflict").show();
            $("#rs-song").hide();
            $("#rs-bpm-label").hide();
            $("#rs-bpm").hide();
        }
        else {
            $("#rs-file").hide();
            $("#rs-table").hide();
            $("#rs-select-conflict-label").hide();
            $("#rs-select-conflict").hide();
            $("#rs-song").show();
            $("#rs-bpm-label").show();
            $("#rs-bpm").show();
        }
    });
    let $checkButton = $('<button>', { type: "button", text: "开始演奏", id: "rs-play", style: "width:fit-content;align-self:center;" }).appendTo($mainDiv);
    $checkButton.click(async () => {
        if (stopped) {
            stopped = false;
            $checkButton.text("停止演奏");
            if ($("#rs-select-type").val() === "midi") {
                let tracks = [];
                let $checkedTrack = $(".rs-track:checked");
                let keyConflictMethod = $("#rs-select-conflict").val();
                $checkedTrack.each((i, e) => {
                    tracks.push(parseInt(e.attributes["track"].value));
                })
                await playMIDI(tracks, keyConflictMethod);
            }
            else {
                let song = $songText.val();
                if ($("#rs-select-type").val() === "je") song = JE2Song(song);
                await playSong(song, $numBox.val());
            }
        }
        else {
            stopped = true;
            $checkButton.text("开始演奏");
        }
    });
    let $titleDiv = $("<div>", { id: "rs-title", style: "width: 100%; display: flex;" }).prependTo($mainDiv);
    let $rightDiv = $("<div>", { id: "rs-title-right", style: "display: flex; justify-content: right;" }).prependTo($titleDiv);
    let $leftDiv = $("<div>", { id: "rs-title-left", style: "width: 100%; display: flex; justify-content: left;" }).prependTo($titleDiv);
    let $loopCheckBox = $("<input>", { type: "checkbox", id: "rs-loop" }).appendTo($leftDiv);
    $("<label>").attr({ for: "rs-loop" }).text("循环演奏").appendTo($leftDiv);
    $loopCheckBox.change(() => {
        if ($loopCheckBox.prop("checked")) {
            isLoop = true;
        } else {
            isLoop = false;
        }
    });
    let $closeButton = $('<button>', { text: "-", id: "rs-close", title: "隐藏窗口" }).appendTo($rightDiv);
    $closeButton.click(() => {
        $("#rs-div").hide();
        $("#rs-open").show();
    });
    let $mainTable = $("<table>", { id: "rs-table", style: "table-layout:fixed; width:100%; word-wrap: break-word;" }).appendTo($mainDiv);
    $mainTable.hide();
    let $keyConflictMethodLabel = $("<span>", { id: "rs-select-conflict-label", text: "音符冲突处理：" }).appendTo($mainDiv);
    $keyConflictMethodLabel.hide();
    let $keyConflictMethodSelect = $("<select>", { id: "rs-select-conflict" }).appendTo($mainDiv);
    $keyConflictMethodSelect.append($('<option></option>').attr('value', 'all').text('全部弹奏'));
    $keyConflictMethodSelect.append($('<option></option>').attr('value', 'high').text('取高音'));
    $keyConflictMethodSelect.append($('<option></option>').attr('value', 'low').text('取低音'));
    $keyConflictMethodSelect.append($('<option></option>').attr('value', 'middle').text('取接近F4的音'));
    $keyConflictMethodSelect.val("all");
    $keyConflictMethodSelect.hide();

    $mainDiv.appendTo($("body"));
}



function check() {
    let $loaded = $("#loadingOverlay.loaded");
    if ($loaded.length > 0) {
        init();
    }
    else setTimeout(function () { check() }, 2000);
}

$(document).ready(() => {
    check();
});