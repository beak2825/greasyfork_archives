// ==UserScript==
// @name         아카라이브 댓글 복사
// @namespace    https://arca.live
// @version      1.0.4
// @author       배배배
// @description  댓글 전체 스크랩, 챈 내 작성글 15개 미만인 경우 버튼으로 확인
// @match        https://arca.live/b/browndust2/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/545682/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%93%EA%B8%80%20%EB%B3%B5%EC%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545682/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%93%EA%B8%80%20%EB%B3%B5%EC%82%AC.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    //var writer = document.querySelectorAll('div[class="member-info"]')[0].innerText.trim()
    const url = 'https://arca.live/b/browndust2?target=nickname&keyword=';
    const comments = document.querySelector('.article-comment .title');
    const bottomC = document.querySelector('.list-area');
    function setupNickButtons() {
        document
            .querySelectorAll('.list-area > .comment-wrapper > .comment-item .info-row')
            .forEach((row, l) => {
            const userInfo = row.querySelector('.user-info');
            if (userInfo && !userInfo.id) {
                userInfo.id = 'reComment' + l;
            }
        });
        document
            .querySelectorAll('div[class="info-row clearfix"]')
            .forEach((v, l) => {
            const userInfo = v.querySelector('.user-info');
            /*if (!v.querySelector('.user-info').id){
                $(v.querySelector('.user-info')).append('<div class="fCom" style="display: none;">');
            } else {
                $(v.querySelector('.user-info')).append('<div class="fCom" style="display: inline;">');
            };*/
            if (!userInfo) return;
            if (userInfo.querySelector('.fCom')) return;
            const usrNameC = userInfo.textContent.replace(/.$/, '').trim();
            const $userInfo = $(userInfo);
            $userInfo.append('<div class="fCom" style="display: inline;"></div>');
            const fCom = userInfo.querySelector('.fCom');

            $(fCom)
                .append('<span class="sep"></span>')
                .append('<button class="nButtonAuto" href="" name="can" style="border: none;padding: 0px 0px;">깡?</button>')
                .append('<span class="sep"></span>')
                .append('<input type="checkbox" value="' + usrNameC + '" name="num" checked="true">');
            const inputEl = fCom.querySelector('input[name="num"]');
            if (usrNameC === 'ㅇㅇ' || usrNameC.length === 1) {
                if (inputEl) inputEl.checked = false;
                fCom.append('(직접 확인)');
            }
            const button = fCom.querySelector('button[name="can"]');
            if (!button) return;
            if (button.dataset.nickBound === '1') return;
            button.dataset.nickBound = '1';
            button.dataset.username = usrNameC;
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const buttonEl = this;
                const usrName = this.dataset.username;
                const rowEl =
                      buttonEl.closest('div[class="info-row clearfix"]') ||
                      buttonEl.closest('.info-row');
                if (!rowEl) return;
                const userInfoEl = rowEl.querySelector('.user-info');
                const fComEl = userInfoEl ? userInfoEl.querySelector('.fCom') : null;
                const checkEl = fComEl ? fComEl.querySelector('input[name="num"]') : null;
                const linkEl = userInfoEl ? userInfoEl.querySelector('.user-info a, a') : null;
                fetch(url + usrName)
                    .then(response => response.text())
                    .then(data => {
                    var html_dom = new DOMParser().parseFromString(data, 'text/html');
                    var cnt, dt, post = 0, dtdif, dtfstdif, plus;
                    try {
                        cnt = html_dom
                            .querySelector('a[class="vrow column"] span[class="vcol col-id"]')
                            .innerText.trim();
                        dt = html_dom
                            .querySelector('a[class="vrow column"] span[class="vcol col-time"]')
                            .innerText.trim();
                        html_dom
                            .querySelectorAll('a[class="vrow column"] .user-info')
                            .forEach(ptname => {
                            if(ptname.innerText.trim() === usrName) { post++; }
                        });
                        var today = new Date().getTime();
                        dtdif = Math.floor((today - new Date(dt)) / 86400000);
                        if(cnt < 45) {
                            var dtfst = html_dom
                            .querySelectorAll('a[class="vrow column"] span[class="vcol col-time"]')
                            [cnt - 1].innerText.trim();
                            dtfstdif = Math.floor((today - new Date(dtfst)) / 86400000);
                            plus = '';
                        }else {
                            dtfstdif = 8;
                            plus = '+';
                        }
                    } catch (err) {
                        cnt = 0;
                        dtdif = 0;
                        dtfstdif = 0;
                    }
                    if (cnt < 15 || dtdif > 30 || dtfstdif < 7) {
                        buttonEl.innerText = '깡!(' + cnt + ')';
                        buttonEl.disabled = true;
                        if (checkEl) checkEl.checked = false;
                        if (linkEl) linkEl.style.color = '#CE0018';
                        if (fComEl) { $(fComEl).append('<span>(마지막 글 ' + dtdif + '일 전, 첫 활동 글 ' + dtfstdif + plus + '일 전)</span>'); }
                    }else {
                        buttonEl.innerText = '굿!(' + cnt + ')';
                        buttonEl.disabled = true;
                        if (linkEl) {linkEl.style.color = '#446CCF';}
                        if (fComEl) {
                            $(fComEl).append('<span>(최신 글:' + dt + ')</span>');
                            if (post < 15) {$(fComEl).append('<span style="color: #CE0018;">(닉네임 겹침)</span>');}
                        }
                    }
                }).catch(error => {
                    buttonEl.innerText = '에러';
                    buttonEl.style.color = '#CE0018';
                    if (fComEl) {$(fComEl).append('<span>캡챠확인</span>');}
                });});
        });
    }
    function copyCheck() {
        var comlist = [];
        $('.fCom[style="display: inline;"] input:checkbox[name=num]:checked').each(
            function () {
                var checkVal = $(this).val();
                comlist.push(checkVal);
            }
        );
        comlist = [...new Set(comlist)];
        return comlist;
    }
    function initNickChecker() {
        setupNickButtons();
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    setupNickButtons();
                    break;
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNickChecker);
    } else {
        initNickChecker();
    }



    let cpButton = v => {
        const newButton = document.createElement('button');
        v.appendChild(newButton);
        newButton.textContent = '❏작성자 복사';
        newButton.className = 'btn btn-arca btn-sm btn-arca-article-write';
        newButton.addEventListener('click', () => {
            /*var comlist = [];
            $('.fCom[style="display: inline;"] input:checkbox[name=num]:checked').each(function() {
                var checkVal = $(this).val();
                comlist.push(checkVal);
            });
            comlist = [...new Set(comlist)];
            GM_setClipboard(comlist);*/
            GM_setClipboard(copyCheck());
        });
    };
    let remButton = v => {
        const newButton2 = document.createElement('button');
        var visReply = true;
        v.appendChild(newButton2);
        newButton2.textContent = '☑답글 포함';
        newButton2.name = 'remButton';
        newButton2.className = 'btn btn-arca btn-sm btn-arca-article-write';
        newButton2.addEventListener('click', function() {
            if (visReply) {
                $('button[name=remButton]').text('☐답글 미포함');
                visReply = false;
                $('.user-info:not([id*=reComment]) .fCom').css('display', 'none');
            } else {
                $('button[name=remButton]').text('☑답글 포함');
                visReply = true;
                $('.fCom').css('display', 'inline');
            }
        });
    };
    cpButton(comments);
    remButton(comments);
    cpButton(bottomC);
    remButton(bottomC);

    let rouButton = v => {
        const newButton3 = document.createElement('button');
        v.appendChild(newButton3);
        newButton3.textContent = '룰렛';
        newButton3.className = 'btn btn-arca btn-sm btn-arca-article-write';

        let isRecording = false;
        let recorder, recordedChunks = [];

        newButton3.addEventListener("click", () => {
            document.getElementById("roulettePopup")?.remove();
            const popup = document.createElement("div");
            popup.id = "roulettePopup";
            Object.assign(popup.style, {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                height: "500px",
                background: "rgba(255,255,255,0.97)",
                border: "2px solid #333",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                zIndex: "999999",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "15px"
            });
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "✖";
            Object.assign(closeBtn.style, {
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer"
            });
            closeBtn.onclick = () => popup.remove();
            popup.appendChild(closeBtn);
            const title = document.createElement("h3");
            title.textContent = "랜덤 추첨기";
            Object.assign(title.style, {
                margin: "5px 0",
                textAlign: "center"
            });
            popup.appendChild(title);
            const slotWrap = document.createElement("div");
            Object.assign(slotWrap.style, {
                overflow: "hidden",
                height: "60px",
                width: "200px",
                border: "1px solid #333",
                borderRadius: "10px",
                background: "white",
                position: "relative",
                marginTop: "5px"
            });
            const slotCanvas = document.createElement("canvas");
            slotCanvas.width = 200;
            slotCanvas.height = 60;
            slotWrap.appendChild(slotCanvas);
            popup.appendChild(slotWrap);
            const ctx = slotCanvas.getContext("2d");
            const btnWrap = document.createElement("div");
            Object.assign(btnWrap.style, {
                marginTop: "15px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "10px"
            });
            popup.appendChild(btnWrap);

            const recordBtn = document.createElement("button");
            recordBtn.textContent = "녹화";
            Object.assign(recordBtn.style, {
                padding: "8px 16px",
                fontSize: "16px",
                border: "none",
                background: "#222",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer"
            });
            btnWrap.appendChild(recordBtn);

            const drawBtn = document.createElement("button");
            drawBtn.textContent = "추첨";
            Object.assign(drawBtn.style, {
                padding: "8px 16px",
                fontSize: "16px",
                border: "none",
                background: "#333",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer"
            });
            btnWrap.appendChild(drawBtn);
            const resultBox = document.createElement("div");
            Object.assign(resultBox.style, {
                marginTop: "15px",
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                height: "28px"
            });
            popup.appendChild(resultBox);
            const editorLabel = document.createElement("label");
            editorLabel.textContent = "추첨 목록";
            editorLabel.style.marginTop = "10px";
            popup.appendChild(editorLabel);

            const editor = document.createElement("textarea");
            Object.assign(editor.style, {
                width: "200px",
                height: "200px",
                fontSize: "14px",
                fontFamily: "monospace",
                padding: "8px",
                border: "2px solid #333",
                borderRadius: "8px",
                resize: "none",
                marginTop: "5px"
            });
            popup.appendChild(editor);
            document.body.appendChild(popup);
            let items = copyCheck();
            if (!Array.isArray(items) || items.length === 0) items = ["항목1", "항목2"];
            editor.value = items.join("\n");

            editor.addEventListener("input", () => {
                items = editor.value.split("\n").map(v => v.trim()).filter(v => v);
                if (items.length === 0) items = ["항목1"];
            });

            const itemHeight = 60;
            let currentPos = 0;

            function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
            function trueRandom(){
                const arr = new Uint32Array(1);
                crypto.getRandomValues(arr);
                return arr[0] / (0xffffffff + 1);
            }
            function drawSlot(pos, blur=0){
                ctx.clearRect(0,0,slotCanvas.width,slotCanvas.height);
                ctx.save();
                if (blur > 0) ctx.filter = `blur(${blur}px)`;

                const base = Math.floor(pos);
                const frac = pos - base;

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "22px sans-serif";

                const centerX = 100;
                const centerY = 30;

                for (let k=-2; k<=2; k++){
                    let idx = base + k;
                    idx = ((idx % items.length) + items.length) % items.length;
                    const text = items[idx];

                    const y = centerY + (k - frac) * itemHeight;

                    let alpha = 1 - Math.min(Math.abs(k-frac)*0.5, 0.8);
                    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
                    ctx.fillText(text, centerX, y);
                }

                ctx.restore();
            }

            drawSlot(0);

            function spin(){
                const total = items.length;
                const baseDur = 12000;
                const off = (0.3 + trueRandom()*2.0) * total;
                const totalRot = 10*total + off;
                const start = performance.now();
                const dur = baseDur + off * 150;

                resultBox.textContent = "";

                function frame(now){
                    const t = Math.min((now-start)/dur,1);
                    const eased = easeOutCubic(t);
                    const pos = totalRot * eased;
                    drawSlot(pos, 1.5 * (1-eased));

                    if (t < 1){
                        requestAnimationFrame(frame);
                    } else {
                        const final = Math.round(totalRot) % total;
                        currentPos = final;
                        drawSlot(final, 0);
                        resultBox.textContent = `당첨 : ${items[final]}`;
                    }
                }

                requestAnimationFrame(frame);
            }

            drawBtn.onclick = spin;

            const recordCanvas = document.createElement("canvas");
            recordCanvas.width = 400;
            recordCanvas.height = 500;
            const rctx = recordCanvas.getContext("2d");

            let forceCanvasText = false;

            function drawFullCanvas(){
                rctx.clearRect(0,0,400,500);
                rctx.fillStyle = "rgba(255,255,255,0.97)";
                rctx.fillRect(0,0,400,500);
                rctx.strokeStyle = "#333";
                rctx.lineWidth = 2;
                rctx.strokeRect(0,0,400,500);
                rctx.fillStyle = "#000";
                rctx.font = "24px sans-serif";
                rctx.textAlign = "center";
                rctx.fillText("랜덤 추첨기", 200, 40);
                rctx.drawImage(slotCanvas, 100, 60);
                rctx.font = "20px sans-serif";
                rctx.fillText(resultBox.textContent || "", 200, 210);
                rctx.fillStyle = "#333";
                rctx.fillRect(110, 130, 80, 35);
                rctx.fillRect(210, 130, 80, 35);
                rctx.fillStyle = "#fff";
                rctx.font = "16px sans-serif";
                rctx.fillText("녹화중", 150, 155);
                rctx.fillText("추첨", 250, 155);

                const list = editor.value.split("\n").filter(v => v.trim());
                const itemCount = list.length;

                rctx.font = `12px monospace`;
                rctx.fillStyle = "#000";
                rctx.textAlign = "left";
                rctx.fillText("목록:", 20, 250);
                const colX = [30, 130, 230, 330];
                const startY = 280;
                const lineHeight = 18;

                for (let i = 0; i < itemCount; i++) {
                    const col = i % 4;
                    const row = Math.floor(i / 4);

                    const x = colX[col];
                    const y = startY + row * lineHeight;
                    rctx.fillText(list[i], x, y);
                }
                if (forceCanvasText)
                    requestAnimationFrame(drawFullCanvas);
            }

            function toggleRecording(){
                if (!isRecording){
                    editor.style.display = "none";
                    forceCanvasText = true;
                    drawFullCanvas();

                    const stream = recordCanvas.captureStream(30);
                    recorder = new MediaRecorder(stream, { mimeType:"video/webm;codecs=vp9" });
                    recordedChunks = [];

                    recorder.ondataavailable = e => {
                        if (e.data && e.data.size > 0) recordedChunks.push(e.data);
                    };

                    recorder.onstop = () => {
                        forceCanvasText = false;
                        editor.style.display = "block";

                        const webmBlob = new Blob(recordedChunks, { type: "video/webm" });
                        recordedChunks = [];

                        const url = URL.createObjectURL(webmBlob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `roulette_${Date.now()}.webm`;
                        a.click();
                        URL.revokeObjectURL(url);

                        recordBtn.textContent = "녹화";
                        recordBtn.style.background = "#222";
                    };

                    recorder.start();
                    isRecording = true;
                    recordBtn.textContent = "녹화중";
                    recordBtn.style.background = "#b22";

                } else {
                    isRecording = false;
                    recorder.stop();
                }
            }
            recordBtn.onclick = toggleRecording;
        });
    };
    rouButton(comments);
    rouButton(bottomC);
    let convButton = v => {
        const newButton4 = document.createElement('button');
        v.appendChild(newButton4);
        newButton4.textContent = '.mp4 변환';
        newButton4.className = 'btn btn-arca btn-sm btn-arca-article-write';
        newButton4.onclick = () => { window.open('https://www.freeconvert.com/webm-to-mp4')};
    };
    convButton(comments);
    convButton(bottomC);
});