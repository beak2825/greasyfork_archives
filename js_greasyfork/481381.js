// ==UserScript==
// @name        SF转写识别插件使用
// @namespace   Violentmonkey Scripts
// @match       http://159.75.194.76/index.php
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_info
// @grant       GM_getValue
// @grant	GM_setValue
// @version     1.1
// @author      -
// @description 11/30/2023, 10:02:12 AM
// @downloadURL https://update.greasyfork.org/scripts/481381/SF%E8%BD%AC%E5%86%99%E8%AF%86%E5%88%AB%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481381/SF%E8%BD%AC%E5%86%99%E8%AF%86%E5%88%AB%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const VERSION = GM_info.script.version; // 脚本@version
    const ADDRESS = 'http://ai.speechocean.com'; // 预识别服务器地址
    const WAVEITEMS = new Array(); // 音频信息集合
    const QUERYTIMESPAN = 1000; // 长音频轮询间隔
    var APIKEY = ""; // 预识别apikey

    /**
     * 添加界面APIKEY输入
     */
    (function () {
        const style = ".__j-container { top: 15%; font-size: 12px; right: 0px; background:violet; padding:5px; position: fixed; z-index: 100000; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}.__j-input { width: 350px; display:none; }.__j-container:hover .__j-input { display:inline; }";
        var html = '<div class="__j-container">\n' +
            '    <label class="__j-label">KEY</label>\n' +
            '    <input class="__j-input" type="text" name="APIKEY"></input>\n' +
            '</div>' +
            '';
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) {// IE
            stylenode.styleSheet.cssText = style;
        } else {// w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);
        APIKEY = GM_getValue(GM_info.script.name + "-APIKEY", "");
        node.getElementsByClassName("__j-input")[0].value = APIKEY;
        node.getElementsByClassName("__j-input")[0].onchange = (e) => {
            APIKEY = e.srcElement.value;
            GM_setValue(GM_info.script.name + "-APIKEY", APIKEY);
        };
        const work_type_node = document.getElementById('worktype');
        if(!work_type_node || typeof(work_type_node) == 'undefined') {
            return;
        }
        const work_type = parseInt(work_type_node.value);
        if(work_type % 2 == 1) {
            // let select_node = document.createElement('select');
            // select_node.setAttribute('id','audio-channel');
            // const channles =new Array("左声道","右声道");
            // for(let i = 0; i < channles.length; i++) {
            //    let option_node = document.createElement('option');
            //    option_node.setAttribute('value',i);
            //    option_node.appendChild(document.createTextNode(channles[i]));
            //    select_node.appendChild(option_node);
            // }
            let btn_node = document.createElement('input');
            btn_node.setAttribute('type','button');
            btn_node.setAttribute('class','btn btn-gray btn-pre-identify');
            btn_node.setAttribute('value','预识别');
            btn_node.onclick = (e) => {
                check();
            };
            let workspace = document.body.getElementsByClassName('workspace-left')[0];
            let btn_wrap = workspace.children[3];
            //btn_wrap.appendChild(select_node)
            btn_wrap.appendChild(btn_node)
        }
    })();

    function addLabel(text) {
        let label = document.getElementById("label-txt");
        if (label.value != text)
           label.value = text;
        if (document.getElementById("AutoFill") == null) {
            let btn = document.getElementById("UpperToLow");
            var nbtn = btn.cloneNode(true);
            nbtn.id = "AutoFill";
            nbtn.value = "自动填充"
            nbtn.onclick = (e) => {
                document.getElementById("trans-text").contentDocument.getElementsByTagName("body")[0].innerText = label.value;
            };
            btn.insertAdjacentElement("afterend", nbtn);
        }
    }

    function audioBufferToWav(buffer, opt) {
        opt = opt || {};
        const numChannels = buffer.numberOfChannels;
        const sampleRate = opt.sampleRate || buffer.sampleRate;
        const format = opt.float32 ? 3 : 1;
        const bitDepth = format === 3 ? 32 : 16;
        let result;
        if (numChannels === 2) {
            result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
        } else {
            result = buffer.getChannelData(0);
        }

        return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
    }

    function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;

        let buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
        let view = new DataView(buffer);

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + samples.length * bytesPerSample, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeString(view, 36, "data");
        view.setUint32(40, samples.length * bytesPerSample, true);
        if (format === 1) {
            floatTo16BitPCM(view, 44, samples);
        } else {
            writeFloat32(view, 44, samples);
        }

        return buffer;
    }

    function interleave(inputL, inputR) {
        let length = inputL.length + inputR.length;
        let result = new Float32Array(length);

        let index = 0;
        let inputIndex = 0;

        while (index < length) {
            result[index++] = inputL[inputIndex];
            result[index++] = inputR[inputIndex];
            inputIndex++;
        }
        return result;
    }

    function writeFloat32(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 4) {
            output.setFloat32(offset, input[i], true);
        }
    }

    function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    function resetSeletorAudio() {
        const annotations = document.getElementById("annotations");
        const selectorArea = annotations.getElementsByClassName("success")[0];
        if(typeof(selectorArea) == 'undefined') {
            const layerCtx = window.unsafeWindow.layer;
            layerCtx.msg("请选择已切分音频段^_^",{time:2000});
            return;
        }
        const selectorComments = selectorArea.getElementsByClassName("wavesurfer-tier-Comments")[0];
        const channelOption = selectorComments.getElementsByTagName('span');
        const channel = channelOption && channelOption.length > 6 ? parseInt(channelOption[6].innerText) - 1 : 0;
        const selectorTimeText = selectorArea.getElementsByClassName("wavesurfer-time")[0].innerText;
        const times = selectorTimeText.split(/–/g);
        const startTime = parseFloat(times[0])
        const endTime = parseFloat(times[1])
        let audioBuffer = window.unsafeWindow.wavesurfer.backend.buffer
        const startOffset = parseInt(startTime * audioBuffer.sampleRate);
        const endOffset = parseInt(endTime * audioBuffer.sampleRate);
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // 创建音频上下文
        // const selectorChannel = document.getElementById("audio-channel");
        // const channel = selectorChannel ? parseInt(selectorChannel[selectorChannel.selectedIndex].value) : 0;
        let newAudioBuffer = audioCtx.createBuffer(1, endOffset - startOffset, audioBuffer.sampleRate);
        newAudioBuffer.getChannelData(0).set(audioBuffer.getChannelData(channel).slice(startOffset, endOffset));
        return newAudioBuffer;
    }

    async function check() {
        let newAudioBuffer = resetSeletorAudio();
        let audio = audioBufferToWav(newAudioBuffer);
        const layerCtx = window.unsafeWindow.layer;
        layerCtx.msg("努力识别中...，请稍安勿躁^_^",{icon:16,time:-1});
        let result = await postWave({
            "address": ADDRESS,
            "authKey": "Bearer " + APIKEY,
            "Authorization": "Bearer "+ APIKEY,
            "blob": new Blob([audio], { "type": "audio/wav" }),
            "type": 2,
            "normal": true,
            queryInterval: QUERYTIMESPAN,
            version: VERSION,
        });
        layerCtx.closeAll();
        if (result.code != 200) {
            alert(result.message);
            return
        }
        const content = result.data.segments.map(_ => _.text).join(" ")
        document.getElementById("trans-text").contentDocument.getElementsByTagName("body")[0].innerText = content;
    }

    //var sid = setInterval(check, 1000);  // 页面轮询

    function queryTaskId(waveInfo, taskId, reslove) {
        let ids = new Array();
        ids.push(taskId);
        GM_xmlhttpRequest({
            url: `${waveInfo.address}/speech/api/v1/asr/task/query`,
            method: "POST",
            headers: {
                "Authorization": waveInfo.authKey,
                "Version": waveInfo.version,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                task_ids: ids
            }),
            onreadystatechange: function (responseDetails) {
                if (responseDetails.readyState === 4) {
                    let queryResponse = JSON.parse(responseDetails.response);
                    if (queryResponse["data"][0]["task_status"].toLowerCase() == "succeed") {
                        queryResponse["data"] = queryResponse["data"][0];
                        reslove(queryResponse);
                    }
                    else {
                        // 根据指定的时间间隔轮询
                        setTimeout(queryTaskId, waveInfo.queryInterval, waveInfo, taskId, reslove);
                    }
                }
            }
        });
    }

    /**
     * 提交音频进行预识别
     * @param {{
     * address:String;
     * authKey:String;
     * blob:Blob;
     * type:Number;
     * normal:Boolean;
     * queryInterval:Number;
     * version:String;
     * }} waveInfo 音频信息
     * @returns {Promise} aa
     */
    function postWave(waveInfo) {
        return new Promise((reslove, reject) => {
            let blob = waveInfo.blob;
            let headerdata = {
                "Authorization": waveInfo.authKey,
                "Version": waveInfo.version,
            };
            if (waveInfo.normal == true)
                headerdata["Knative-Serving-Tag"] = "normal";
            if (waveInfo.type == 2) { // 短音频
                let formdata = new FormData();
                formdata.append("domain", "ct_gz");
                formdata.append("wav_path", blob, "proxy.wav");
                GM_xmlhttpRequest({
                    url: `${waveInfo.address}/speech/api/v2/asr/recognize`,
                    method: "POST",
                    headers: headerdata,
                    data: formdata,
                    onreadystatechange: function (responseDetails) {
                        if (responseDetails.readyState === 4) {
                            reslove(JSON.parse(responseDetails.response));
                        }
                    }
                });
            }
            else if (waveInfo.type == 1) { // 长音频
                let formdata = new FormData();
                formdata.append("domain", "ct_gz");
                formdata.append("file_path", blob, "proxy.wav");
                GM_xmlhttpRequest({
                    url: `${waveInfo.address}/speech/api/v1/asr/task/create`,
                    method: "POST",
                    headers: headerdata,
                    data: formdata,
                    onreadystatechange: function (responseDetails) {
                        if (responseDetails.readyState === 4) {
                            let createResponse = JSON.parse(responseDetails.response);
                            queryTaskId(waveInfo, createResponse["data"]["task_id"], reslove);
                        }
                    }
                });
            } else {
                reject(`audio type error ${waveInfo.type}`);
            }
        });
    }

    /**
     * 提交数据到后端服务
     * @param {{
     * address:String;
     * authKey:String;
     * version:String;
     * data:object;
     * }} postData
     * @param {*} callback
     */
    function postResult(postData) {
        return new Promise((reslove, reject) => {
            try {
                GM_xmlhttpRequest({
                    url: `${postData.address}/speech/api/v1/asr/label_result`,
                    method: "POST",
                    headers: {
                        "Authorization": postData.authKey,
                        "Version": postData.version,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(postData.data),
                    onreadystatechange: function (responseDetails) {
                        if (responseDetails.readyState === 4) {
                            reslove(JSON.parse(responseDetails.response));
                        }
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        })
    }
})();