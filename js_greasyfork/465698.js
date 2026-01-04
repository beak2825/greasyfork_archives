// ==UserScript==
// @name         Piano Pedal Scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll webpages using piano pedals
// @author       YC白白
// @match        *://*/*
// @icon         https://zxjzqbojhkxfxcbdkh5xdw.on.drv.tw/yaohtml/chord/03/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465698/Piano%20Pedal%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/465698/Piano%20Pedal%20Scroll.meta.js
// ==/UserScript==

/*
// 控制器事件 左踏板 176 67 XX
// 控制器事件 中踏板 176 66 XX
// 控制器事件 右踏板 176 64 XX
*/

(async () => {
    if (!navigator.requestMIDIAccess) {
        console.log('Web MIDI API not supported.');
        return;
    }

    let lastMidiMessage = null;
    const scrollAmount = 500; // 滾動的量

    try {
        const midiAccess = await navigator.requestMIDIAccess({sysex: false});
        midiAccess.inputs.forEach(input => {
            input.onmidimessage = handleMidiMessage;
        });
    } catch (error) {
        console.error('Error accessing MIDI devices:', error);
    }

    function handleMidiMessage(event) {
        // 先判斷midi訊號是否與上次相同，若是，則不重複觸發
        if (lastMidiMessage && event.data[0] === lastMidiMessage[0] && event.data[1] === lastMidiMessage[1] && event.data[2] === lastMidiMessage[2]) {
            return;
        }

        // Yamaha的電鋼琴不做任何事時，會一直送出254
        if (event.data[0] === 254) {
            // 直接return略過
            return
        }

        lastMidiMessage = event.data;

        // Replace the following CC values with those corresponding to your piano pedals
        const leftPedalCC = 64; // 67
        const middlePedalCC = 66;
        console.log(`event.data = [${event.data[0]}, ${event.data[1]}, ${event.data[2]}]`); // event.data = [176, 64, 127]

        if (event.data[0] === 0xB0) { // MIDI Control Change message
            if (event.data[1] === leftPedalCC && event.data[2] === 127) { // 左踏板踩下
                console.log('左踏板踩下');
                window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            } else if (event.data[1] === middlePedalCC && event.data[2] === 127) { // 中踏板踩下
                console.log('中踏板踩下');
                window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }
        }
    }
})();