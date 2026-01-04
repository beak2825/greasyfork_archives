// ==UserScript==
// @name         Chess.com Real-Time AI Analysis with Player Color Indicator
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  실시간으로 FEN을 업로드하고 AI 분석을 받아오며, 마지막 수와 총 수(전체 수), 그리고 탭 플레이어의 색상을 표시하고 업데이트 시 무지개 색 표시기를 변경합니다.
// @author       You
// @match        *://www.chess.com/play/computer*
// @grant        GM_xmlhttpRequest
// @connect      lichess.org
// @downloadURL https://update.greasyfork.org/scripts/533638/Chesscom%20Real-Time%20AI%20Analysis%20with%20Player%20Color%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/533638/Chesscom%20Real-Time%20AI%20Analysis%20with%20Player%20Color%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rainbowColors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8F00FF'];
    let colorIndex = 0;
    let lastFen = '';
    let lastFullMoveCount = 0;
    let lastOutput = '';

    // UI 요소 생성
    const infoBox = document.createElement('div');
    Object.assign(infoBox.style, {
        position: 'fixed', top: '10px', right: '10px',
        padding: '8px 12px', background: 'rgba(0,0,0,0.7)', color: '#fff',
        fontFamily: 'monospace', fontSize: '14px', zIndex: 9999,
        borderRadius: '4px', whiteSpace: 'pre'
    });
    const textNode = document.createTextNode('분석 대기 중...');
    const indicator = document.createElement('div');
    Object.assign(indicator.style, {
        width: '12px', height: '12px', marginTop: '6px', borderRadius: '50%',
        backgroundColor: rainbowColors[0]
    });
    infoBox.append(textNode, document.createElement('br'), indicator);
    document.body.append(infoBox);

    // 보드 말 배치에서 FEN 위치 필드만 추출
    function extractPosition() {
        const board = Array.from({ length: 8 }, () => Array(8).fill(''));
        document.querySelectorAll('.piece').forEach(el => {
            const cls = el.className;
            const sqMatch = cls.match(/square-(\d\d)/);
            if (!sqMatch) return;
            const sq = sqMatch[1];
            const file = parseInt(sq.charAt(0), 10) - 1;
            const rank = parseInt(sq.charAt(1), 10) - 1;
            if (isNaN(file) || isNaN(rank)) return;
            const pCharMatch = cls.match(/piece [wb]([prnbqk])/);
            if (!pCharMatch) return;
            const map = { p:'p', r:'r', n:'n', b:'b', q:'q', k:'k' };
            let p = map[pCharMatch[1]];
            if (cls.includes(' wp ')) p = p.toUpperCase();
            board[7 - rank][file] = p;
        });
        return board.map(row => {
            let empty = 0, str = '';
            row.forEach(cell => {
                if (!cell) empty++; else { if (empty) { str += empty; empty = 0; } str += cell; }
            });
            return str + (empty ? empty : '');
        }).join('/');
    }

    // 수 정보(전체 수, half moves, 마지막 수) 가져오기
    function getMovesInfo() {
        const rows = document.querySelectorAll('.main-line-row.move-list-row');
        let fullCount = 0;
        if (rows.length) {
            fullCount = parseInt(rows[rows.length - 1].getAttribute('data-whole-move-number'), 10) || 0;
        }
        const ply = document.querySelectorAll('.node.main-line-ply');
        const halfCount = ply.length;
        const lastMove = halfCount ? ply[halfCount - 1].textContent.trim() : '';
        return { fullCount, halfCount, lastMove };
    }

    // 전체 FEN 생성
    function makeFEN(pos, turn) {
        return `${pos} ${turn} KQkq - 0 1`;
    }

    // indicator 색상 순환
    function rotateIndicator() {
        colorIndex = (colorIndex + 1) % rainbowColors.length;
        indicator.style.backgroundColor = rainbowColors[colorIndex];
    }

    // AI 분석 요청 및 화면 업데이트
    function updateAnalysis(fen, myColor, lastMove, fullCount) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://lichess.org/api/cloud-eval?fen=' + encodeURIComponent(fen) + '&multiPv=1',
            headers: { 'Accept': 'application/json' },
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    let out = `총 수: ${fullCount}\n내 색상: ${myColor}\n마지막 수: ${lastMove || '-'}\n`;
                    if (data.pvs && data.pvs.length > 0) {
                        const pv = data.pvs[0];
                        const cp = pv.cp, mate = pv.mate;
                        const move = pv.moves.split(' ')[0];
                        const human = move.slice(0,2) + '→' + move.slice(2,4);
                        const ev = mate != null ? `M${mate}` : (cp != null ? (cp/100).toFixed(2) : '?');
                        out += `평가: ${ev}\n추천: ${human}`;
                    } else {
                        out += `분석 정보 없음`;
                    }
                    if (out !== lastOutput) {
                        lastOutput = out;
                        textNode.nodeValue = out;
                        rotateIndicator();
                    }
                } catch (e) {
                    console.error('AI 분석 오류:', e);
                }
            },
            onerror: err => console.error('AI 분석 요청 실패:', err)
        });
    }

    // 메인 루프: 0.1초마다 실행
    setInterval(() => {
        rotateIndicator();
        const pos = extractPosition();
        const { fullCount, halfCount, lastMove } = getMovesInfo();

        // 탭 플레이어 색상 감지 (보드 뒤집힘 상태로 판단)
        const boardEl = document.getElementById('board-play-computer');
        const myColor = boardEl.classList.contains('flipped') ? '흑' : '백';

        const turn = (halfCount % 2 === 0) ? 'w' : 'b';
        const fen = makeFEN(pos, turn);
        if (fen !== lastFen || fullCount !== lastFullMoveCount) {
            lastFen = fen;
            lastFullMoveCount = fullCount;
            updateAnalysis(fen, myColor, lastMove, fullCount);
        }
    }, 100);
})();
