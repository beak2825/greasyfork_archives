// ==UserScript==
// @name         Torn Poker Scout · Chen Formula Edition
// @namespace    swervelord
// @version      1.0
// @description  Poker assistant that uses the Chen formula for pre-flop guidance plus full post-flop odds, outs, and professional advice.
// @author       Swervelord [3637232]
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541090/Torn%20Poker%20Scout%20%C2%B7%20Chen%20Formula%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/541090/Torn%20Poker%20Scout%20%C2%B7%20Chen%20Formula%20Edition.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ───────────────────────────── 1 · PANEL STYLE ───────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
#tps-panel{
    position:fixed;top:70px;right:20px;width:340px;background:#1a1a1a;
    color:#fff;border:2px solid #fff;border-radius:12px;padding:16px;
    font-family:'Inter',sans-serif;box-shadow:0 0 12px rgba(0,0,0,.5);
    z-index:99999
}
#tps-panel h2{margin:0 0 10px;font-size:20px;font-weight:900;color:#00e0ff}
#tps-panel .row{display:flex;justify-content:space-between;margin-bottom:6px}
#tps-panel .adv{margin-top:12px;padding:8px;border-radius:8px;text-align:center;
                font-weight:bold;background:#111;color:#00e0ff}
`;
    document.head.appendChild(style);

    /* ───────────────────────────── 2 · PANEL HTML ────────────────────────────── */
    const panel = document.createElement('div');
    panel.id = 'tps-panel';
    panel.innerHTML = `
<h2>Poker Scout</h2>
<div class="row"><span>Hole</span><span id="tps-hole">–</span></div>
<div class="row"><span>Board</span><span id="tps-board">–</span></div>
<div class="row"><span>Hand</span><span id="tps-hand">–</span></div>
<div class="row"><span>Win Odds</span><span id="tps-odds">–</span></div>
<div class="row"><span>Players</span><span id="tps-pl">–</span></div>
<div class="adv" id="tps-adv">Waiting for cards…</div>`;
    document.body.appendChild(panel);

    /* ───────────────────────────── 3 · CONSTANTS & HELPERS ──────────────────── */
    const RANKS = '23456789TJQKA'.split('');
    const SUITS = ['♣', '♦', '♥', '♠'];
    const rankIdx = r => RANKS.indexOf(r);
    const suitGlyph = { clubs: '♣', spades: '♠', hearts: '♥', diamonds: '♦' };
    const fixRank  = r => (r === '1' ? 'T' : r.toUpperCase());

    const parseCard = cls => {
        const m = /(clubs|spades|hearts|diamonds)-([0-9tjqka])/i.exec(cls);
        return m ? fixRank(m[2]) + suitGlyph[m[1]] : null;
    };
    const $$ = sel => Array.from(document.querySelectorAll(sel));

    const getHole = () =>
        $$('.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div')
            .map(n => parseCard(n.className)).filter(Boolean);

    const getBoard = () =>
        $$('.communityCards___cGHD3 .front___osz1p > div')
            .map(n => parseCard(n.className)).filter(Boolean);

    const livePlayers = () => {
        const n = $$('[class*="opponent___"],[id*="player-"]');
        if (!n.length) return 2;
        return Math.max(n.filter(x => !/fold|waiting|sitting out/i.test(x.textContent)).length + 1, 2);
    };

    /* ───────────────────────────── 4 · CHEN FORMULA (PRE-FLOP) ───────────────── */
    function chenScore(hole) {
        if (hole.length !== 2) return 0;
        const [a, b] = hole.sort((x, y) => rankIdx(y[0]) - rankIdx(x[0]));
        const vA = rankIdx(a[0]), vB = rankIdx(b[0]);
        const base = [10,9,8,7,6,5,4,3,2,1,0,0,0][vA];          // A→10 … 2→0
        let s = base;
        if (vA === vB) s = Math.max(5, base * 2);               // pair bonus
        if (a[1] === b[1]) s += 2;                              // suited bonus
        const gap = vA - vB - 1;                                // gaps
        if (gap === 0) s += 1;
        else if (gap === 2) s -= 1;
        else if (gap === 3) s -= 2;
        else if (gap > 3)  s -= 4;
        if (gap <= 1 && vA < 12 && vA > 3) s += 1;              // straight potential
        return s;
    }

    const advicePre = hole => {
        const s = chenScore(hole);
        if (s >= 10) return 'Raise (big)';
        if (s >=  8) return 'Raise';
        if (s >=  6) return 'Call';
        return 'Fold';
    };

    /* ───────────────────────────── 5 · POST-FLOP EVALUATION ─────────────────── */
    const cmp = (a, b) =>
        a.rank !== b.rank
            ? a.rank - b.rank
            : a.kickers.find((k, i) => k !== (b.kickers[i] || -1)) || 0;

    function eval5(cards) {
        const suits = { '♣': [], '♦': [], '♥': [], '♠': [] };
        const counts = {};
        cards.forEach(c => {
            const v = c[0], s = c[1];
            suits[s].push(v);
            counts[v] = (counts[v] || 0) + 1;
        });

        const vals = Object.keys(counts).map(rankIdx).sort((a, b) => b - a);
        const flush = Object.values(suits).some(a => a.length === 5);
        const uniq = [...new Set(vals)].sort((a, b) => a - b);

        let hi = -1;
        for (let i = 0; i <= uniq.length - 5; i++)
            if (uniq[i + 4] - uniq[i] === 4) { hi = uniq[i + 4]; break; }
        if (hi === -1 && [12, 0, 1, 2, 3].every(r => uniq.includes(r))) hi = 3;

        const straight = hi !== -1;
        const four  = Object.entries(counts).find(([, c]) => c === 4);
        const three = Object.entries(counts).find(([, c]) => c === 3);
        const pairs = Object.entries(counts)
                       .filter(([, c]) => c === 2)
                       .map(([v]) => rankIdx(v)).sort((a, b) => b - a);

        let rank = 0, name = 'High Card', kickers = [];

        if (straight && flush && hi === 12)            { rank = 9; name = 'Royal Flush'; }
        else if (straight && flush)                    { rank = 8; name = 'Straight Flush'; }
        else if (four)                                 { rank = 7; name = 'Four of a Kind'; kickers = vals.filter(v => v !== rankIdx(four[0])); }
        else if (three && pairs.length)                { rank = 6; name = 'Full House'; }
        else if (flush)                                { rank = 5; name = 'Flush'; kickers = vals.slice(1, 5); }
        else if (straight)                             { rank = 4; name = 'Straight'; }
        else if (three)                                { rank = 3; name = 'Three of a Kind'; kickers = vals.filter(v => v !== rankIdx(three[0])).slice(0,2); }
        else if (pairs.length >= 2)                    { rank = 2; name = 'Two Pair'; kickers = vals.filter(v => !pairs.includes(v)).slice(0,1); }
        else if (pairs.length === 1)                   { rank = 1; name = 'One Pair'; kickers = vals.filter(v => v !== pairs[0]).slice(0,3); }

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

    const shuffle = a => { for (let i = a.length - 1; i; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }};

    const winPct = (hole, board, players, iters = 1000) => {
        if (hole.length < 2) return 0;
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

        /* flush outs */
        SUITS.forEach(s => {
            if ([...hole, ...board].filter(c => c[1] === s).length === 4)
                RANKS.forEach(r => !used.has(r + s) && outs.add(r + s));
        });

        /* straight outs */
        const present = [...new Set([...hole, ...board].map(c => rankIdx(c[0])))];
        for (let st = 0; st <= 8; st++) {
            const seq = [0,1,2,3,4].map(x => st + x);
            const miss = seq.filter(r => !present.includes(r));
            if (miss.length === 1) SUITS.forEach(s => {
                const card = RANKS[miss[0]] + s;
                if (!used.has(card)) outs.add(card);
            });
        }

        return { outs: outs.size, pct: outs.size ? outs.size * 2 + 1 : 0 };
    };

    const advicePost = (rank, pct) =>
        rank >= 7 ? 'All-in'
      : rank >= 5 || pct >= 0.80 ? 'Raise (big)'
      : rank >= 3 || pct >= 0.55 ? 'Raise'
      : rank >= 1 || pct >= 0.35 ? 'Call'
      : 'Fold';

    /* ───────────────────────────── 6 · MAIN LOOP ─────────────────────────────── */
    let last = '';
    setInterval(() => {
        const hole  = getHole();
        const board = getBoard();
        const key = hole.join('-') + '|' + board.join('-');
        if (key === last) return;
        last = key;

        panel.querySelector('#tps-hole').textContent  = hole.join(' ')  || '–';
        panel.querySelector('#tps-board').textContent = board.join(' ') || '–';
        panel.querySelector('#tps-pl').textContent    = livePlayers();

        /* Pre-deal */
        if (hole.length < 2) {
            panel.querySelector('#tps-hand').textContent = '–';
            panel.querySelector('#tps-odds').textContent = '–';
            panel.querySelector('#tps-adv').textContent  = 'Waiting for cards…';
            return;
        }

        /* Pre-flop */
        if (board.length === 0) {
            panel.querySelector('#tps-hand').textContent = '–';
            panel.querySelector('#tps-odds').textContent = '–';
            panel.querySelector('#tps-adv').textContent  = advicePre(hole);
            return;
        }

        /* Post-flop / turn / river */
        const best = bestOf([...hole, ...board]);
        const pct  = winPct(hole, board, livePlayers(), 1000);
        const outs = calcOuts(hole, board);

        panel.querySelector('#tps-hand').textContent = best ? best.name : '–';
        panel.querySelector('#tps-odds').textContent = (pct * 100).toFixed(0) + ' %';

        let advice = advicePost(best.rank, pct);
        if (outs.outs) advice += ` • ${outs.outs} outs (~${outs.pct}%)`;
        panel.querySelector('#tps-adv').textContent = advice;
    }, 1000);
})();
