// ==UserScript==
// @name         Milkywayidle market item watcher
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  This script does not work without mooket
// @match        https://*.milkywayidle.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540516/Milkywayidle%20market%20item%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/540516/Milkywayidle%20market%20item%20watcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // mwi 객체가 로드될 때까지 대기
    function waitForMwi() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (window.mwi !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    waitForMwi().then(init);

    function init() {
        const refreshTime = 5000;
        let hoveredItem = null;

        // PiP 관련 캔버스/비디오
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const stream = canvas.captureStream();
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;

        // 효과음
        const soundUp = new Audio('https://cdn.pixabay.com/download/audio/2022/03/19/audio_b1e725b098.mp3?filename=beep-6-96243.mp3');
        const soundDown = new Audio('https://cdn.pixabay.com/download/audio/2024/11/29/audio_04f3a2096b.mp3?filename=ui-sound-off-270300.mp3');
        const soundAppear = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_17cba0354b.mp3?filename=ping-82822.mp3');
        const soundDisappear = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_dbb9bd8504.mp3?filename=pop-39222.mp3');

        // 각 효과음별 볼륨 비율 (0~1 사이 값, 필요에 따라 조절)
        const VOLUME_UP = 0.3;        // 상승음
        const VOLUME_DOWN = 0.9;      // 하락음
        const VOLUME_APPEAR = 0.5;    // 등장음
        const VOLUME_DISAPPEAR = 0.4; // 사라짐음

        // 볼륨 조절 함수
        function setVolume(masterVol) {
            soundUp.volume = masterVol * VOLUME_UP;
            soundDown.volume = masterVol * VOLUME_DOWN;
            soundAppear.volume = masterVol * VOLUME_APPEAR;
            soundDisappear.volume = masterVol * VOLUME_DISAPPEAR;
        }
        setVolume(1);

        // 패널 생성
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '350px',
            maxHeight: '1000px',
            overflowY: 'auto',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            fontSize: '12px',
            zIndex: 9999,
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none'
        });

        // 헤더
        const header = document.createElement('div');
        header.textContent = '📈 Market Watch List (refresh ' + refreshTime / 1000 + 's)';
        Object.assign(header.style, {
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '6px 10px',
            fontWeight: 'bold',
            fontSize: '13px',
            textAlign: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
        });

        // 버튼 바
        const buttonBar = document.createElement('div');
        Object.assign(buttonBar.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start', // 좌측 정렬
            gap: '8px',
            padding: '6px 10px 2px 10px',
            background: 'rgba(0,0,0,0.8)',
            border: 'none',
            boxShadow: 'none',
            marginLeft: '40px' // 좌측에서 살짝 띄워 중앙 쪽으로 이동
        });

        // 버튼 스타일 공통
        const buttonStyle = {
            padding: '2px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            boxShadow: 'none',
            transition: 'background 0.15s'
        };

        // PiP 버튼
        const pipBtn = document.createElement('button');
        pipBtn.textContent = 'PiP';
        Object.assign(pipBtn.style, buttonStyle);
        pipBtn.addEventListener('mouseenter', () => {
            pipBtn.style.backgroundColor = 'rgba(255,255,255,0.18)';
        });
        pipBtn.addEventListener('mouseleave', () => {
            pipBtn.style.backgroundColor = 'rgba(255,255,255,0.08)';
        });
        buttonBar.appendChild(pipBtn);

        // 숨기기/보이기 버튼
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Hide';
        Object.assign(toggleButton.style, buttonStyle);
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.backgroundColor = 'rgba(255,255,255,0.18)';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.backgroundColor = 'rgba(255,255,255,0.08)';
        });
        buttonBar.appendChild(toggleButton);

        // Reset 버튼
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '⟳';
        Object.assign(resetBtn.style, buttonStyle, {
            backgroundColor: '#b22222', // 진한 빨강
            color: 'white'
        });
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.backgroundColor = '#d9534f'; // hover시 밝은 빨강
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.backgroundColor = '#b22222';
        });

        buttonBar.appendChild(resetBtn);

        // 소리 온/오프 버튼
        let soundEnabled = true;
        const soundToggleBtn = document.createElement('button');
        soundToggleBtn.textContent = '🔊';
        Object.assign(soundToggleBtn.style, buttonStyle);
        soundToggleBtn.addEventListener('mouseenter', () => {
            soundToggleBtn.style.backgroundColor = 'rgba(255,255,255,0.18)';
        });
        soundToggleBtn.addEventListener('mouseleave', () => {
            soundToggleBtn.style.backgroundColor = 'rgba(255,255,255,0.08)';
        });
        buttonBar.appendChild(soundToggleBtn);

        // 볼륨 슬라이더
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 1;
        volumeSlider.step = 0.01;
        volumeSlider.value = 1;
        Object.assign(volumeSlider.style, {
            width: '60px',
            verticalAlign: 'middle',
            marginLeft: '4px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none'
        });
        buttonBar.appendChild(volumeSlider);

        // Reset 버튼 기능: 이전 가격/색상 데이터 초기화
        resetBtn.addEventListener('click', () => {
            for (const key in prevPrices) {
                delete prevPrices[key];
            }
            updateCount = 0;
            printMarketPrices();
        });

        // 컬럼 헤더
        const columnHeader = document.createElement('div');
        columnHeader.innerHTML = `
            <div style="flex: 2; text-align: center;">아이템</div>
            <div style="flex: 1; text-align: center;">판매</div>
            <div style="flex: 1; text-align: center;">구매</div>
        `;
        Object.assign(columnHeader.style, {
            display: 'flex',
            padding: '4px 10px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
        });

        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '4px 10px';

        const info = document.createElement('div');
        info.textContent = '* Item hover > regist(z), remove(c), click(go to market)';
        Object.assign(info.style, {
            textAlign: 'right',
            fontSize: '11px',
            color: '#ccc',
            marginTop: '4px'
        });

        panel.append(header, buttonBar, columnHeader, contentDiv, info);
        document.body.appendChild(panel);

        toggleButton.addEventListener('click', () => {
            if (contentDiv.style.display === 'none') {
                contentDiv.style.display = '';
                info.style.display = '';
                columnHeader.style.display = 'flex';
                toggleButton.textContent = 'Hide';
            } else {
                contentDiv.style.display = 'none';
                info.style.display = 'none';
                columnHeader.style.display = 'none';
                toggleButton.textContent = 'Show';
            }
        });

        // 드래그 앤 드롭 기능 (헤더를 드래그)
        let isDragging = false, offsetX = 0, offsetY = 0;
        header.style.cursor = 'move';
        header.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
                panel.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // 아이템 아이콘 스프라이트 관련
        let iconSprite = null;
        const spriteUrl = "/static/media/items_sprite.6d12eb9d.svg";
        let iconSpriteText = null;
        let iconSpriteDoc = null;

        // 스프라이트 SVG fetch 및 파싱
        fetch(spriteUrl).then(res => res.text()).then(svgText => {
            iconSpriteText = svgText;
            const parser = new DOMParser();
            iconSpriteDoc = parser.parseFromString(svgText, "image/svg+xml");
        });

        // PiP 버튼 이벤트
        pipBtn.addEventListener('click', async () => {
            await video.play();
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        });

        // Watch List 로드/저장
        function loadWatchList() {
            const raw = localStorage.getItem("marketWatchList");
            if (!raw) return [];
            try {
                return JSON.parse(raw).map(parseNameWithEnhancement);
            } catch (e) {
                console.error("marketWatchList 파싱 오류:", e);
                return [];
            }
        }

        function saveWatchList(list) {
            list.sort((a, b) => {
                if (a.name === b.name) {
                    return a.enhancement - b.enhancement;
                }
                return a.name.localeCompare(b.name);
            });

            localStorage.setItem("marketWatchList", JSON.stringify(
                list.map(({ name, enhancement }) => enhancement === 0 ? name : `${name} +${enhancement}`)
            ));
        }

        function parseNameWithEnhancement(str) {
            const match = str.match(/(.+?)\s*\+\s*(\d+)/);
            return match ? { name: match[1].trim(), enhancement: +match[2] } : { name: str.trim(), enhancement: 0 };
        }

        // 가격 표시 포맷
        function formatPrice(value) {
            if (value <= 0) return "-";
            if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
            if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
            if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
            if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
            return value.toString();
        }

        // 이전 가격/색상 저장
        const prevPrices = {};
        let updateCount = 0;

        // 마켓 가격 출력 및 PiP/패널 갱신
        function printMarketPrices() {
            const items = loadWatchList();
            if (items.length === 0) {
                contentDiv.innerHTML = '<div style="text-align:center;">(No registered items)</div>';
                canvas.height = 50;
                drawEmptyPiP();
                return;
            }

            const lines = items.map(({ name, enhancement }) => {
                const hrid = window.mwi?.itemNameToHridDict?.[name];
                const price = hrid ? window.mwi?.marketJson?.marketData?.[hrid]?.[enhancement] : null;
                const key = hrid ? `${hrid}|${enhancement}` : name;

                // prev에 사라짐 상태와 이전값도 저장
                const prev = prevPrices[key] || { ask: null, bid: null, askColor: 'white', bidColor: 'white', askGone: false, bidGone: false, askPrevValue: null, bidPrevValue: null };
                let askColor = 'white', bidColor = 'white';
                let askGone = prev.askGone, bidGone = prev.bidGone;
                let askPrevValue = prev.askPrevValue, bidPrevValue = prev.bidPrevValue;

                // 효과음 재생 플래그
                let playUp = false, playDown = false, playAppear = false, playDisappear = false;

                // 처음 추가된 경우: 이전 가격 정보가 없으면 색상만 흰색, 소리 없음
                if (updateCount < 2 || (prev.ask == null && prev.bid == null)) {
                    askColor = 'white';
                    bidColor = 'white';
                    askGone = false;
                    bidGone = false;
                    askPrevValue = null;
                    bidPrevValue = null;
                    // 소리 플래그는 모두 false
                } else {
                    // 기존의 가격 변화 감지 로직 (updateCount >= 2)
                    // ASK
                    if (price && typeof price.a === 'number' && price.a > 0) {
                        if (prev.ask == null || prev.ask <= 0) {
                            askColor = '#00ff00';
                            playAppear = true;
                        } else if (price.a > prev.ask) {
                            askColor = '#d5443d';
                            playUp = true;
                        } else if (price.a < prev.ask) {
                            askColor = '#0ff';
                            playDown = true;
                        } else {
                            askColor = prev.askColor || 'white';
                        }
                        askGone = false;
                        askPrevValue = null;
                    } else if (prev.ask != null && prev.ask > 0 && (!price || price.a <= 0)) {
                        askColor = '#ffb300';
                        askGone = true;
                        askPrevValue = prev.ask;
                        playDisappear = true;
                    } else if (prev.askGone && prev.askPrevValue) {
                        askColor = '#ffb300';
                        askGone = true;
                        askPrevValue = prev.askPrevValue;
                    } else {
                        askColor = 'white';
                        askGone = false;
                        askPrevValue = null;
                    }
                    // BID
                    if (price && typeof price.b === 'number' && price.b > 0) {
                        if (prev.bid == null || prev.bid <= 0) {
                            bidColor = '#00ff00';
                            playAppear = true;
                        } else if (price.b > prev.bid) {
                            bidColor = '#d5443d';
                            playUp = true;
                        } else if (price.b < prev.bid) {
                            bidColor = '#0ff';
                            playDown = true;
                        } else {
                            bidColor = prev.bidColor || 'white';
                        }
                        bidGone = false;
                        bidPrevValue = null;
                    } else if (prev.bid != null && prev.bid > 0 && (!price || price.b <= 0)) {
                        bidColor = '#ffb300';
                        bidGone = true;
                        bidPrevValue = prev.bid;
                        playDisappear = true;
                    } else if (prev.bidGone && prev.bidPrevValue) {
                        bidColor = '#ffb300';
                        bidGone = true;
                        bidPrevValue = prev.bidPrevValue;
                    } else {
                        bidColor = 'white';
                        bidGone = false;
                        bidPrevValue = null;
                    }
                }

                // 효과음 재생 (한 번만)
                if (soundEnabled) {
                    if (playUp) soundUp.play();
                    if (playDown) soundDown.play();
                    if (playAppear) soundAppear.play();
                    if (playDisappear) soundDisappear.play();
                }

                // 사라진 상태와 이전값을 prevPrices에 저장
                prevPrices[key] = {
                    ask: price && typeof price.a === 'number' ? price.a : null,
                    bid: price && typeof price.b === 'number' ? price.b : null,
                    askColor,
                    bidColor,
                    askGone,
                    bidGone,
                    askPrevValue,
                    bidPrevValue
                };

                return {
                    hrid, name, enhancement,
                    ask: askGone ? `<span style="color:#ffb300;text-decoration:line-through">${formatPrice(askPrevValue)}</span>` : (price ? formatPrice(price.a) : '❌'),
                    bid: bidGone ? `<span style="color:#ffb300;text-decoration:line-through">${formatPrice(bidPrevValue)}</span>` : (price ? formatPrice(price.b) : '❌'),
                    askColor,
                    bidColor,
                    askGone,
                    bidGone
                };
            });

            updateCount++;

            updatePanel(lines);
            updatePiPCanvas(lines);
        }

        // 패널 UI 갱신
        function updatePanel(lines) {
            contentDiv.innerHTML = '';
            lines.forEach(({ hrid, name, enhancement, ask, bid, askColor, bidColor, askGone, bidGone }) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.padding = '2px 0';
                row.style.cursor = 'pointer';
                let iconName = hrid ? hrid.split("/")[2] : '';
                row.innerHTML = `
                    <svg width="15px" height="15px" style="display:inline-block; margin-right: 2px">
                    <use href="/static/media/items_sprite.6d12eb9d.svg#${iconName}"></use></svg>
                    <div style="flex:2;">${name}${enhancement > 0 ? ' +' + enhancement : ''}</div>
                    <div style="flex:1; text-align:right; color:${askColor}">${askGone ? ask : ask}</div>
                    <div style="flex:1; text-align:right; color:${bidColor}">${bidGone ? bid : bid}</div>`;
                row.addEventListener('mouseenter', () => {
                    row.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    hoveredItem = { name, enhancement };
                });
                row.addEventListener('mouseleave', () => {
                    row.style.backgroundColor = 'transparent';
                    hoveredItem = null;
                });
                row.addEventListener('click', () => {
                    window.mwi?.game?.handleGoToMarketplace(hrid, enhancement);
                });
                contentDiv.appendChild(row);
            });
        }

        // PiP 캔버스 갱신
        function updatePiPCanvas(lines) {
            const rowHeight = 20;
            canvas.width = 350;
            canvas.height = rowHeight * lines.length + 10;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px sans-serif';

            lines.forEach((line, index) => {
                const y = 20 + index * rowHeight;

                // 아이템명 + 강화
                ctx.textAlign = 'left';
                ctx.fillStyle = 'white';
                ctx.fillText(`${line.name}${line.enhancement > 0 ? ' +' + line.enhancement : ''}`, 30, y);

                // 판매가 (ask)
                ctx.textAlign = 'center';
                if (line.askGone) {
                    ctx.fillStyle = '#ffb300';
                    const priceText = formatPrice(prevPrices[`${line.hrid}|${line.enhancement}`]?.askPrevValue);
                    ctx.fillText(priceText, 250, y);
                    // 취소선 그리기
                    const textWidth = ctx.measureText(priceText).width;
                    ctx.save();
                    ctx.strokeStyle = '#ffb300';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(250 - textWidth / 2, y - 6);
                    ctx.lineTo(250 + textWidth / 2, y - 6);
                    ctx.stroke();
                    ctx.restore();
                } else {
                    ctx.fillStyle = line.askColor || 'white';
                    ctx.fillText(line.ask, 250, y);
                }

                // 구매가 (bid)
                ctx.textAlign = 'right';
                if (line.bidGone) {
                    ctx.fillStyle = '#ffb300';
                    const priceText = formatPrice(prevPrices[`${line.hrid}|${line.enhancement}`]?.bidPrevValue);
                    ctx.fillText(priceText, canvas.width - 10, y);
                    // 취소선 그리기
                    const textWidth = ctx.measureText(priceText).width;
                    ctx.save();
                    ctx.strokeStyle = '#ffb300';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(canvas.width - 10 - textWidth, y - 6);
                    ctx.lineTo(canvas.width - 10, y - 6);
                    ctx.stroke();
                    ctx.restore();
                } else {
                    ctx.fillStyle = line.bidColor || 'white';
                    ctx.fillText(line.bid, canvas.width - 10, y);
                }

                // 아이콘
                ctx.fillStyle = 'white';
                const iconName = line.hrid ? line.hrid.split("/")[2] : '';
                const img = getIconImage(iconName);
                if (img.complete) {
                    ctx.drawImage(img, 7, y - 12, 14, 14);
                } else {
                    img.onload = () => {
                        ctx.drawImage(img, 7, y - 12, 14, 14);
                    };
                }
            });
        }

        // 아이콘 SVG 추출 및 변환
        const iconCache = {};
        function getIconImage(iconName) {
            if (iconCache[iconName]) return iconCache[iconName];
            if (!iconSpriteDoc) return new Image(); // 아직 로드 안됨
            const symbol = iconSpriteDoc.getElementById(iconName);
            if (!symbol) return new Image();
            const svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElem.setAttribute("width", "15");
            svgElem.setAttribute("height", "15");
            if (symbol.hasAttribute("viewBox")) {
                svgElem.setAttribute("viewBox", symbol.getAttribute("viewBox"));
            } else {
                svgElem.setAttribute("viewBox", "0 0 15 15");
            }
            for (const child of symbol.children) {
                svgElem.appendChild(child.cloneNode(true));
            }
            const svgString = new XMLSerializer().serializeToString(svgElem);
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            iconCache[iconName] = img;
            return img;
        }

        // PiP에 아이템 없음 표시
        function drawEmptyPiP() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '14px sans-serif';
            ctx.fillText('(등록된 아이템 없음)', 10, 25);
        }

        // 온오프 버튼 이벤트
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
            volumeSlider.style.display = soundEnabled ? 'inline-block' : 'none';
        });

        // 볼륨 슬라이더 이벤트
        volumeSlider.addEventListener('input', () => {
            setVolume(Number(volumeSlider.value));
        });

        // 슬라이더는 소리 꺼짐일 때 숨김
        if (!soundEnabled) volumeSlider.style.display = 'none';

        // 단축키: z(등록), c(제거)
        document.addEventListener('keydown', e => {
            const itemKey = getItemKey();
            const list = loadWatchList();
            const keySet = list.map(i => i.enhancement === 0 ? i.name : `${i.name} +${i.enhancement}`);

            if (e.key === 'z' && itemKey) {
                if (!keySet.includes(itemKey)) {
                    const parsed = parseNameWithEnhancement(itemKey);
                    list.push(parsed);
                    saveWatchList(list);
                    printMarketPrices();
                }
            }

            if (e.key === 'c') {
                let targetKey = itemKey;
                if (!targetKey && hoveredItem) {
                    targetKey = hoveredItem.enhancement === 0 ? hoveredItem.name : `${hoveredItem.name} +${hoveredItem.enhancement}`;
                }
                if (!targetKey) return;

                if (keySet.includes(targetKey)) {
                    const updated = list.filter(i => (i.enhancement === 0 ? i.name : `${i.name} +${i.enhancement}`) !== targetKey);
                    saveWatchList(updated);
                    printMarketPrices();
                }
            }
        });

        // 주기적 갱신
        setInterval(printMarketPrices, refreshTime);
    }

    // 아이템 키 추출
    function getItemKey() {
        const modal = document.querySelector('.MuiPopper-root');
        if (!modal) return null;
        const nameEl = modal.querySelector('.ItemTooltipText_name__2JAHA');
        const detail = modal.querySelector('.ItemTooltipText_equipmentDetail__3sIHT');
        const name = nameEl ? nameEl.textContent.trim() : null;
        if (!name) return null;

        if (detail) {
            const enhance = [...detail.querySelectorAll('span')]
                .map(e => e.textContent.trim())
                .find(t => /^\+\d+$/.test(t));
            const enhancement = enhance ? +enhance.replace('+', '') : 0;
            return enhancement === 0 ? name : `${name} +${enhancement}`;
        } else {
            return name;
        }
    }
})();
