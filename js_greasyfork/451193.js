// ==UserScript==
// @name         媒体流捕获
// @namespace    https://github.com/Momo707577045/media-source-extract
// @version      0.2.7
// @description  捕获HTML视频流，并下载的实现。理论上可以捕获任意在线视频或直播的媒体流
// @license      AGPL-3.0
// @author       Momo707577045
// @match        *://*/*
// @exclude      http://blog.luckly-mjw.cn/tool-show/media-source-extract/player/player.html
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451193/%E5%AA%92%E4%BD%93%E6%B5%81%E6%8D%95%E8%8E%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/451193/%E5%AA%92%E4%BD%93%E6%B5%81%E6%8D%95%E8%8E%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (function () {
        if (document.getElementById('media-source-extract')) {
            return;
        }

        // 轮询监听 iframe 的加载
        setInterval(() => {
            try {
                Array.prototype.forEach.call(document.getElementsByTagName('iframe'), (iframe) => {
                    // 若 iframe 使用了 sandbox 进行操作约束，删除原有 iframe，拷贝其备份，删除 sandbox 属性，重新载入
                    // 若 iframe 已载入，再修改 sandbox 属性，将修改无效。故通过新建 iframe 的方式绕过
                    if (iframe.hasAttribute('sandbox')) {
                        const parentNode = iframe.parentNode;
                        const tempIframe = iframe.cloneNode();
                        tempIframe.removeAttribute("sandbox");
                        iframe.remove();
                        parentNode.appendChild(tempIframe);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }, 1000);


        let downloadDate = new Date(); // 流下载时间标识
        let isClose = false, isEndOfStream = false; // 是否关闭
        let isStreamDownload = false; // 是否使用流式下载
        let _sourceBufferList = []; // 媒体轨道
        const $showBtn = document.createElement('div'); // 展示按钮
        const $btnDownload = document.createElement('div'); // 下载按钮
        const $btnStreamDownload = document.createElement('div'); // 流式下载按钮
        const $downloadNum = document.createElement('div'); // 已捕获视频片段数
        const $tenRate = document.createElement('div'); // 十倍速播放
        const $closeBtn = document.createElement('div'); // 关闭
        const $container = document.createElement('div'); // 容器
        $closeBtn.innerHTML = `
    <img style="
      padding-top: 4px;
      width: 24px;
      display: inline-block;
      cursor: pointer;
    " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAk1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ROyVeAAAAMHRSTlMA1Sq7gPribxkJx6Ey8onMsq+GTe10QF8kqJl5WEcvIBDc0sHAkkk1FgO2ZZ+dj1FHfPqwAAACNElEQVRIx6VW6ZqqMAwtFlEW2Rm3EXEfdZa+/9PdBEvbIVXu9835oW1yjiQlTWQE/iYPuTObOTzMNz4bQFRlY2FgnFXRC/o01mytiafP+BPvQZk56bcLSOXem1jpCy4QgXvRtlEVCARfUP65RM/hp29/+0R7eSbhoHlnffZ8h76e6x1tyw9mxXaJ3nfTVLd89hQr9NfGceJxfLIXmONh6eNNYftNSESRmgkHlEOjmhgBbYcEW08FFQN/ro6dvAczjhgXEdQP76xHEYxM+igQq259gLrCSlwbD3iDtTMy+A4Yuk0B6zV8c+BcO2OgFIp/UvJdG4o/Rp1JQYXeZFflPEFMfvugiFGFXN587YtgX7C8lRGFXPCGGYCCzlkoxJ4xqmi/jrIcdYYh5pwxiwI/gt7lDDFrcLiMKhBJ//W78ENsJgVUsV8wKpjZBXshM6cCW0jbRAilICFxIpgGMmmiWGHSIR6ViY+DPFaqSJCbQ5mbxoZLIlU0Al/cBj6N1uXfFI0okLppi69StmumSFQRP6oIKDedFi3vRDn3j6KozCZlu0DdJb3AupJXNLmqkk9+X9FEHLt1Jq8oi1H5n01AtRlvwQZQl9hmtPY4JEjMDs5ftWJN4Xr4lLrV2OHiUDHCPgvA/Tn/hP4zGUBfjZ3eLJ+NIOfHxi8CMoAQtYfmw93v01O0e7VlqqcCsXML3Vsu94cxnb4c7ML5chG8JIP9b38dENGaj3+x+TpiA/AL/fen8In7H8l3ZjdJQt2TAAAAAElFTkSuQmCC">`;
        $showBtn.innerHTML = `
    <img style="
      padding-top: 4px;
      width: 24px;
      display: inline-block;
      cursor: pointer;
    " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAElBMVEUAAAD///////////////////8+Uq06AAAABXRSTlMA2kCAv5tF5NoAAAErSURBVHja7dzNasJAFIbhz8Tu7R0Eq/vQNHuxzL6YnPu/ldYpAUckxJ8zSnjfdTIPzHrOUawJdqmDJre1S/X7avigbM08kMgMSmt+iPWKbcwTsb3+KswXseOFLb2RnaTgjXTxtpwRq7XMgWz9kZ8cSKcwE6SX+SMGAgICAvJCyHdz2ud0pEx+/BpFaj2kEgQEBAQEBAQEBOT1kXWSkhbvk1vptOLs1LEWNrmVRgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBeTayTqpufogxduqM3q2AgICAgICAgICA3IOko4ZXkB/pqOHzhyZBQEBAQLIieVahtDNBDnrLgZT+yC4HUkmtN9JnWUiVZbVWliVhseCJdPqvCH5IV2tQNl4r6Bod+wWq9eeDik+xFQAAAABJRU5ErkJggg=="?`;

        // 16倍速播放
        function _tenRatePlay(rate) {
            setTimeout(() => {
                let $domList = document.querySelectorAll('*');
                for (const $dom of $domList) {
                    try {
                        $dom.playbackRate = rate;
                        $dom.muted = rate !== 1;
                    } catch (e) {
                        // console.error(e.message);
                    }
                }
            });
        }

        // 获取顶部 window title，因可能存在跨域问题，故使用 try catch 进行保护
        function getDocumentTitle() {
            let title = document.title;
            try {
                title = window.top.document.title;
            } catch (error) {
                console.log(error);
            }
            return title;
        }


        var _htm = _htm || {};
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?1f12b0865d866ae1b93514870d93ce89";
            var s = document.querySelector("script");
            s.parentNode.insertBefore(hm, s);
        })();

        // 流式下载
        function _streamDownload() {
            // 对应状态未下载结束的媒体轨道
            const remainSourceBufferList = [];
            for (const target of _sourceBufferList) {
                // 对应的 MSE 状态为已下载完成状态
                if (target.MSEInstance.readyState === 'ended') {
                    target.streamWriter.close();
                } else {
                    remainSourceBufferList.push(target);
                }
            }
            // 流式下载，释放已下载完成的媒体轨道，回收内存
            _sourceBufferList = remainSourceBufferList;
            showTip('视频已下载');
            // 重置状态
            downloadDate = new Date();
            isStreamDownload = false;
            $btnDownload.style.display = $btnStreamDownload.style.display = 'block';
            $downloadNum.innerHTML = `已捕获 0 个片段`;
            isEndOfStream = false;
        }

        // 普通下载
        function _download() {
            const date = new Date();
            for (const target of _sourceBufferList) {
                const mime = target.mime.split(';')[0];
                const type = mime.split("/");
                const fileBlob = new Blob(target.bufferList, {type: mime}); // 创建一个Blob对象，并设置文件的 MIME 类型
                const a = document.createElement('a');
                a.download = `${type[0]}_${date.getFullYear().toString().padStart(4, '0')}${date.getMonth().toString().padStart(2, '0')}${date.getDay().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.${type[1]}`;
                a.href = URL.createObjectURL(fileBlob);
                a.style.display = 'none';
                document.body.appendChild(a);
                // 禁止 click 事件冒泡，避免全局拦截
                a.onclick = function (e) {
                    e.stopPropagation();
                }
                a.click();
                a.remove();
                if (isEndOfStream === true) {
                    _sourceBufferList = [];
                    $downloadNum.innerHTML = `已捕获 0 个片段`;
                    isEndOfStream = false;
                    showTip('视频已下载');
                }
            }
        }

        for (const property of Object.getOwnPropertyNames(window)) {
            if (typeof window[property] === "function" && Boolean(window[property].prototype) && typeof window[property].prototype.addSourceBuffer === "function" && typeof window[property].prototype.endOfStream === "function") {
                doMediaSource(window[property]);
            }
        }

        // 监听资源全部录取成功
        function doMediaSource(MediaSource) {
            let _endOfStream = MediaSource.prototype.endOfStream;
            MediaSource.prototype.endOfStream = function () {
                isEndOfStream = true;
                $downloadNum.innerHTML = `已捕获到终点，请下载`;
                showTip('已捕获到终点，请下载');
                if (isStreamDownload) {
                    setTimeout(_streamDownload); // 等待 MediaSource 状态变更
                    _endOfStream.call(this);
                    return;
                }
                _endOfStream.call(this);
            };

            // 录取资源
            let _addSourceBuffer = MediaSource.prototype.addSourceBuffer;
            MediaSource.prototype.addSourceBuffer = function (mime) {
                if (!isClose) {
                    if (isEndOfStream && _sourceBufferList.length > 0) {
                        if (confirm('检测到新的视频流，是否下载已捕获？\n点击“确定”下载已捕获\n点击“取消”重新捕获')) {
                            _download();
                        }
                    }
                    if (document.getElementById('media-source-capture') === null) {
                        _appendDom();
                    }
                    let sourceBuffer = _addSourceBuffer.call(this, mime);
                    let _append = sourceBuffer.appendBuffer;
                    let bufferList = [];
                    const _sourceBuffer = {
                        mime,
                        bufferList,
                        MSEInstance: this,
                    };

                    // 如果 streamSaver 已提前加载完成，则初始化对应的 streamWriter
                    try {
                        if (window.streamSaver) {
                            const type = mime.split(';')[0].split('/')[1];
                            _sourceBuffer.streamWriter = streamSaver.createWriteStream(`${type[0]}_${downloadDate.getFullYear().toString().padStart(4, '0')}${downloadDate.getMonth().toString().padStart(2, '0')}${downloadDate.getDay().toString().padStart(2, '0')}_${downloadDate.getHours().toString().padStart(2, '0')}${downloadDate.getMinutes().toString().padStart(2, '0')}${downloadDate.getSeconds().toString().padStart(2, '0')}.${type[1]}`).getWriter()
                        }
                    } catch (error) {
                        console.error(error);
                    }

                    _sourceBufferList.push(_sourceBuffer);
                    sourceBuffer.appendBuffer = function (buffer) {
                        $downloadNum.innerHTML = `已捕获 ${_sourceBufferList.length} 个片段`;

                        if (isStreamDownload && _sourceBuffer.streamWriter) { // 流式下载
                            _sourceBuffer.streamWriter.write(new Uint8Array(buffer));
                        } else { // 普通 blob 下载
                            bufferList.push(buffer);
                        }
                        _append.call(this, buffer);
                    }
                    return sourceBuffer;
                }
            };
            MediaSource.prototype.addSourceBuffer.toString = function () {
                return 'function addSourceBuffer() { [native code] }';
            };
        }

        // 添加操作的 dom
        function _appendDom() {
            if (document.getElementById('media-source-extract')) {
                return;
            }
            $container.setAttribute("style", 'position: fixed; top: 50px; right: 50px; text-align: right; z-index: 9999;');
            const baseStyle = 'float:right; clear:both; margin-top: 10px; padding: 0 20px; color: white; cursor: pointer; font-size: 16px; font-weight: bold; line-height: 40px; text-align: center; border-radius: 4px; background-color: #3498db; box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);';
            $tenRate.innerHTML = '16倍速捕获(静音)';
            $downloadNum.innerHTML = '已捕获 0 个片段';
            $btnStreamDownload.innerHTML = '特大视频下载，边下载边保存';
            $btnDownload.innerHTML = '下载已捕获片段';
            $btnDownload.id = 'media-source-extract';
            $tenRate.setAttribute("style", baseStyle);
            $downloadNum.setAttribute("style", baseStyle);
            $btnDownload.setAttribute("style", baseStyle);
            $btnStreamDownload.setAttribute("style", baseStyle);
            $btnStreamDownload.style.display = 'none';
            $showBtn.setAttribute("style", 'float:right; clear:both; display: none; margin-top: 4px; height: 34px; width: 34px; line-height: 34px; text-align: center; border-radius: 4px; background-color: rgba(0, 0, 0, 0.5);');
            $closeBtn.setAttribute("style", 'float:right; clear:both; margin-top: 10px; height: 34px; width: 34px; line-height: 34px; text-align: center; display: inline-block; border-radius: 50%; background-color: rgba(0, 0, 0, 0.5);');

            $btnDownload.addEventListener('click', _download);
            $tenRate.addEventListener('click', function () {
                if ($tenRate.innerHTML === '16倍速捕获(静音)') {
                    _tenRatePlay(16);
                    $tenRate.innerHTML = '恢复正常倍速音量';
                } else {
                    _tenRatePlay(1);
                    $tenRate.innerHTML = '16倍速捕获(静音)';
                }
            });

            // 关闭控制面板
            $closeBtn.addEventListener('click', function () {
                $downloadNum.style.display = 'none';
                $btnStreamDownload.style.display = 'none';
                $btnDownload.style.display = 'none';
                $closeBtn.style.display = 'none';
                $tenRate.style.display = 'none';
                $showBtn.style.display = 'inline-block';
                _sourceBufferList = [];
                isClose = true;
            });

            // 显示控制面板
            $showBtn.addEventListener('click', function () {
                if (!isStreamDownload) {
                    $btnDownload.style.display = 'inline-block';
                    $btnStreamDownload.style.display = 'inline-block';
                }
                $downloadNum.style.display = 'inline-block';
                $closeBtn.style.display = 'inline-block';
                $tenRate.style.display = 'inline-block';
                $showBtn.style.display = 'none';
                isClose = false;
            });

            // 启动流式下载
            $btnStreamDownload.addEventListener('click', function () {
                isStreamDownload = true;
                $btnDownload.style.display = $btnStreamDownload.style.display = 'none';
                for (let sourceBuffer of _sourceBufferList) {
                    if (!sourceBuffer.streamWriter) {
                        const type = sourceBuffer.mime.split(';')[0].split('/');
                        sourceBuffer.streamWriter = streamSaver.createWriteStream(`${type[0]}_${downloadDate.getFullYear().toString().padStart(4, '0')}${downloadDate.getMonth().toString().padStart(2, '0')}${downloadDate.getDay().toString().padStart(2, '0')}_${downloadDate.getHours().toString().padStart(2, '0')}${downloadDate.getMinutes().toString().padStart(2, '0')}${downloadDate.getSeconds().toString().padStart(2, '0')}.${type[1]}`).getWriter();
                        sourceBuffer.bufferList.forEach(buffer => {
                            sourceBuffer.streamWriter.write(new Uint8Array(buffer));
                        });
                        sourceBuffer.bufferList = [];
                    }
                }
            })

            document.getElementsByTagName('html')[0].insertBefore($container, document.getElementsByTagName('head')[0]);
            $container.appendChild($btnStreamDownload);
            $container.appendChild($downloadNum);
            $container.appendChild($btnDownload);
            $container.appendChild($tenRate);
            $container.appendChild($closeBtn);
            $container.appendChild($showBtn);

            // 加载 stream 流式下载器
            try {
                let $streamSaver = document.createElement('script');
                $streamSaver.src = 'https://upyun.luckly-mjw.cn/lib/stream-saver.js';
                document.body.appendChild($streamSaver);
                $streamSaver.addEventListener('load', () => {
                    $btnStreamDownload.style.display = 'inline-block';
                });
            } catch (error) {
                console.error(error);
            }
        }
    })();

    if (window === top) {
        window.addEventListener("message", event => {
            if (event.source !== window) {
                try {
                    let sql = event.data.split("\x00");
                    if (sql[0] === "showTip" && sql[1].constructor === String) {
                        if (sql[2]) showTip(sql[1], sql[2]);
                    }
                } catch (e) {
                    // 排除 下标越界错误 及 指令处理错误
                }
            }
        });
    }

    function showTip(msg, style = ``) {
        // 该函数需要在top内运行，否则可能显示异常
        let root = document.querySelector(`:root`);
        if (window === top) {
            let tip = document.querySelector(":root>tip");
            if (tip && tip.nodeType === 1) {
                // 防止中途新的showTip事件创建多个tip造成卡顿
                tip.remove();
            }
            tip = document.createElement("tip");
            // pointer-events: none; 禁用鼠标事件，input标签使用 disabled='disabled' 禁用input标签
            tip.setAttribute("style", style + "pointer-events: none; opacity: 0; background-color: #222a; color: #fff; font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 20px; text-align: center; padding: 6px; border-radius: 16px; position: fixed; transform: translate(-50%, -50%); left: 50%; bottom: 15%; z-index: 2147483647;");
            tip.innerHTML = "<style>@keyframes showTip {0%{opacity: 0;} 33.34%{opacity: 1;} 66.67%{opacity: 1;} 100%{opacity: 0;}}</style>\n" + msg;
            let time = msg.replace(new RegExp("\\s"), "").length / 2;   // TODO 2个字/秒
            // cubic-bezier(起始点, 起始点偏移量, 结束点偏移量, 结束点)，这里的 cubic-bezier函数 表示动画速度的变化规律
            tip.style.animation = "showTip " + (time > 2 ? time : 2) + "s cubic-bezier(0," + ((time - 1) > 0 ? (time - 1) / time : 0) + "," + (1 - ((time - 1) > 0 ? (time - 1) / time : 0)) + ",1) 1 normal";
            root.appendChild(tip);
            setTimeout(function () {
                try {
                    tip.remove();
                } catch (e) {
                    // 排除root没有找到tip
                }
            }, time * 1000);
        } else {
            top.postMessage("showTip\x00" + msg + "\x00" + style, "*");
        }
    }
})();