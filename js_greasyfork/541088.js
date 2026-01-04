// ==UserScript==
// @name         Torn Poker Scout
// @version      1.0
// @description  Fixed‑position poker assistant: TAG pre‑flop ranges, post‑flop hand strength, win odds & concise advice. Right edge UI. Created custom for HyperFox25
// @author       Swervelord [3637232]
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @namespace https://greasyfork.org/users/1479805
// @downloadURL https://update.greasyfork.org/scripts/541088/Torn%20Poker%20Scout.user.js
// @updateURL https://update.greasyfork.org/scripts/541088/Torn%20Poker%20Scout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
        #tps-panel {
            font-family: 'Inter', sans-serif;
            position: fixed;
            top: 70px;
            right: 20px;
            width: 340px;
            background: #1a1a1a;
            color: white;
            border: 2px solid white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 0 12px rgba(0,0,0,0.5);
            z-index: 9999;
        }
        #tps-panel h2 {
            color: #00e0ff;
            font-size: 20px;
            margin-bottom: 10px;
            font-weight: 900;
        }
        #tps-panel .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }
        #tps-panel .adv {
            margin-top: 12px;
            padding: 8px;
            background: #111;
            border-radius: 8px;
            text-align: center;
            color: #00e0ff;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    const PANEL = document.createElement('div');
    PANEL.id = 'tps-panel';
    PANEL.innerHTML = `
        <h2>Poker Scout</h2>
        <div class="row"><span>Hole</span><span id="tps-hole">–</span></div>
        <div class="row"><span>Board</span><span id="tps-board">–</span></div>
        <div class="row"><span>Hand</span><span id="tps-hand">–</span></div>
        <div class="row"><span>Win Odds</span><span id="tps-odds">–</span></div>
        <div class="row"><span>Players</span><span id="tps-pl">–</span></div>
        <div class="adv" id="tps-adv">Waiting for cards…</div>
    `;
    document.body.appendChild(PANEL);

    const RANKS = '23456789TJQKA'.split('');
    const SUITS = ['♣', '♦', '♥', '♠'];
    const TAG_RANGES = new Set([
        'AA','KK','QQ','JJ','TT','99','88','77','66','55',
        'AKs','AQs','AJs','ATs','KQs','KJs','QJs','JTs',
        'AK','AQ','KQ','T9s','98s','87s','76s','J9s','T8s'
    ]);
    const rankIdx = ch => RANKS.indexOf(ch);
    const fixRank = ch => ch === '1' ? 'T' : ch.toUpperCase();
    const suitMap = { clubs: '♣', spades: '♠', hearts: '♥', diamonds: '♦' };
    const parseCardClass = cls => {
        const m = /(clubs|spades|hearts|diamonds)-([0-9tjqka])/i.exec(cls);
        return m ? fixRank(m[2]) + suitMap[m[1]] : null;
    };
    const $all = sel => Array.from(document.querySelectorAll(sel));
    const getHole = () => $all('.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div').map(n => parseCardClass(n.className)).filter(Boolean);
    const getBoard = () => $all('.communityCards___cGHD3 .front___osz1p > div').map(n => parseCardClass(n.className)).filter(Boolean);
    const activePlayers = () => {
        const nodes = $all('[class*="opponent___"],[id*="player-"]');
        if (!nodes.length) return 2;
        const live = nodes.filter(n => !/fold|waiting|sitting out/i.test(n.textContent)).length + 1;
        return Math.max(live, 2);
    };

    const keyFor = h => {
        const [a,b] = [...h].sort((x,y) => rankIdx(y[0]) - rankIdx(x[0]));
        return a[0] === b[0] ? a[0]+b[0] : a[0]+b[0]+(a[1] === b[1] ? 's' : '');
    };

    const preflopAdvice = h => TAG_RANGES.has(keyFor(h)) ?
        (['AA','KK','QQ','JJ','AKs','AK'].includes(keyFor(h)) ? 'Raise (big)' :
         ['TT','99','AQs','AQ','KQs','AJs'].includes(keyFor(h)) ? 'Raise' : 'Call') : 'Fold';

    const postflopAdvice = (rank, pct) => rank >= 7 ? 'All-in' :
        rank >= 5 || pct >= 0.8 ? 'Raise (big)' :
        rank >= 3 || pct >= 0.55 ? 'Raise' :
        rank >= 1 || pct >= 0.35 ? 'Call' : 'Fold';

    const cmp = (a, b) => a.rank !== b.rank ? a.rank - b.rank : a.kickers.find((k, i) => k !== (b.kickers[i] || -1)) || 0;

    function eval5(cards) {
        const suits = { '♣': [], '♦': [], '♥': [], '♠': [] };
        const counts = {};
        cards.forEach(c => {
            const v = c[0], s = c[1];
            suits[s].push(v);
            counts[v] = (counts[v] || 0) + 1;
        });
        const vals = Object.keys(counts).map(rankIdx).sort((a, b) => b - a);
        const flush = Object.values(suits).some(arr => arr.length === 5);
        const uniq = [...new Set(vals)].sort((a, b) => a - b);
        let strHi = -1;
        for (let i = 0; i <= uniq.length - 5; i++)
            if (uniq[i + 4] - uniq[i] === 4) { strHi = uniq[i + 4]; break; }
        if (strHi === -1 && [12, 0, 1, 2, 3].every(r => uniq.includes(r))) strHi = 3;
        const straight = strHi !== -1;
        const four = Object.entries(counts).find(([, c]) => c === 4);
        const three = Object.entries(counts).find(([, c]) => c === 3);
        const pairs = Object.entries(counts).filter(([, c]) => c === 2).map(([v]) => rankIdx(v)).sort((a, b) => b - a);
        let rank = 0, name = 'High Card', kickers = [];
        if (straight && flush && strHi === 12) { rank = 9; name = 'Royal Flush'; }
        else if (straight && flush) { rank = 8; name = 'Straight Flush'; }
        else if (four) { rank = 7; name = 'Four of a Kind'; kickers = vals.filter(v => v !== rankIdx(four[0])); }
        else if (three && pairs.length) { rank = 6; name = 'Full House'; }
        else if (flush) { rank = 5; name = 'Flush'; kickers = vals.slice(1, 5); }
        else if (straight) { rank = 4; name = 'Straight'; }
        else if (three) { rank = 3; name = 'Three of a Kind'; kickers = vals.filter(v => v !== rankIdx(three[0])).slice(0, 2); }
        else if (pairs.length >= 2) { rank = 2; name = 'Two Pair'; kickers = vals.filter(v => !pairs.includes(v)).slice(0, 1); }
        else if (pairs.length === 1) { rank = 1; name = 'One Pair'; kickers = vals.filter(v => v !== pairs[0]).slice(0, 3); }
        return { rank, name, kickers };
    }

    const bestOf = cards => {
        if (cards.length < 5) return null;
        let best = null;
        const n = cards.length;
        for (let a = 0; a < n - 4; a++)
            for (let b = a + 1; b < n - 3; b++)
                for (let c = b + 1; c < n - 2; c++)
                    for (let d = c + 1; d < n - 1; d++)
                        for (let e = d + 1; e < n; e++) {
                            const hand = eval5([cards[a], cards[b], cards[c], cards[d], cards[e]]);
                            if (!best || cmp(hand, best) > 0) best = hand;
                        }
        return best;
    };

    const shuffle = a => { for (let i = a.length - 1; i; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } };

    const winPct = (hole, board, players, iters = 1000) => {
        const deck = RANKS.flatMap(r => SUITS.map(s => r + s));
        const dead = new Set([...hole, ...board]);
        const live = deck.filter(c => !dead.has(c));
        let wins = 0;
        for (let k = 0; k < iters; k++) {
            shuffle(live);
            const need = 5 - board.length;
            const community = [...board, ...live.slice(0, need)];
            let idx = need;
            const our = bestOf([...hole, ...community]);
            let ahead = true;
            for (let p = 1; p < players; p++) {
                const opp = [live[idx++], live[idx++]];
                if (cmp(bestOf([...opp, ...community]), our) > 0) { ahead = false; break; }
            }
            if (ahead) wins++;
        }
        return wins / iters;
    };

    const calcOuts = (hole, board) => {
        const used = new Set([...hole, ...board]);
        const outs = new Set();
        SUITS.forEach(s => {
            if ([...hole, ...board].filter(c => c[1] === s).length === 4)
                RANKS.forEach(r => !used.has(r + s) && outs.add(r + s));
        });
        const rp = [...new Set([...hole, ...board].map(c => rankIdx(c[0])))];
        for (let st = 0; st <= 8; st++) {
            const seq = [0, 1, 2, 3, 4].map(x => st + x);
            const miss = seq.filter(r => !rp.includes(r));
            if (miss.length === 1) SUITS.forEach(s => !used.has(RANKS[miss[0]] + s) && outs.add(RANKS[miss[0]] + s));
        }
        return { outs: outs.size, pct: outs.size ? outs.size * 2 + 1 : 0 };
    };

    let last = '';
    setInterval(() => {
        const hole = getHole();
        const board = getBoard();
        const key = hole.join('-') + '|' + board.join('-');
        if (key === last) return;
        last = key;

        document.getElementById('tps-hole').textContent = hole.join(' ') || '–';
        document.getElementById('tps-board').textContent = board.join(' ') || '–';
        document.getElementById('tps-pl').textContent = activePlayers();

        if (hole.length < 2) {
            document.getElementById('tps-hand').textContent = '–';
            document.getElementById('tps-odds').textContent = '–';
            document.getElementById('tps-adv').textContent = 'Waiting for cards…';
            return;
        }

        if (board.length === 0) {
            const adv = preflopAdvice(hole);
            document.getElementById('tps-hand').textContent = '–';
            document.getElementById('tps-odds').textContent = '–';
            document.getElementById('tps-adv').textContent = adv;
            return;
        }

        const best = bestOf([...hole, ...board]);
        const odds = winPct(hole, board, activePlayers(), 1000);
        const outs = calcOuts(hole, board);

        document.getElementById('tps-hand').textContent = best?.name || '–';
        document.getElementById('tps-odds').textContent = Math.round(odds * 100) + ' %';

        let advice = postflopAdvice(best.rank, odds);
        if (outs.outs) advice += `  •  ${outs.outs} outs (~${outs.pct}%)`;
        document.getElementById('tps-adv').textContent = advice;
    }, 1000);
})();
