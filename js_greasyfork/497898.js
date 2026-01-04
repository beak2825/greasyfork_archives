// ==UserScript==
// @name         ニコニコ動画(Re:仮) コメントNG
// @namespace    https://twitter.com/@7vU6jrZRuX2ffkY
// @version      1.5
// @description  ニコニコ動画(Re:仮)でコメントNGを設定します
// @author       @7vU6jrZRuX2ffkY
// @match        https://www.nicovideo.jp/watch_tmp/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497898/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88NG.user.js
// @updateURL https://update.greasyfork.org/scripts/497898/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88NG.meta.js
// ==/UserScript==

(()=>{

const EMOJI_NG = true; // ← 絵文字をまとめてNGしたい場合はtrue、したくない場合はfalse

// ↓にNG指定したいワードを1行ずつ入力 (空白は無視されます)
const NG_LIST = `

んん～まか
にょ、にょまれ

` // ===== ↑NG指定範囲ここまで =====
.split("\n").map(w => w.replace(/\s+/g, "")).filter(w => w.length > 0);

// ↓正規表現での指定もできます。正規表現を理解している場合のみ、コメントアウトを解除して記述してください
//const NG_EXP_LIST = [ /\w+/ ];

const script=unsafeWindow.document.createElement("script");
script.textContent=`
(() => {
    const NG_LIST = [${NG_LIST.map(w => w.includes('"') ? `'${w}'` : `"${w}"`).join(",")}];
    const NG_EXP_LIST = [${typeof NG_EXP_LIST == "undefined" ? "" : NG_EXP_LIST.map(r => `/${r.source}/`).join(",")}];
    const EMOJI_EXP = /[\\u2700-\\u27BF]|[\\uE000-\\uF8FF]|\\uD83C[\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|[\\u2011-\\u26FF]|\\uD83E[\\uDD10-\\uDDFF]/;
    const EMOJI_NG = ${EMOJI_NG ? true : false};

    const origFetch = fetch;
    window.fetch = async (...args) => {
        const response = await origFetch(...args);
        if (!args[0].includes("/comments/")) return response;
        if (args[1]?.method == "POST") return response;
        console.log("コメント取得を検知: " + args[0]);
        const data = await response.json();
        const oldLength = data.data.comments.length;
        data.data.comments = data.data.comments.filter(c => {
            const comment = c.message.replace(/\\s+/g, "");
            if (EMOJI_NG && EMOJI_EXP.test(comment)) return false;
            if (NG_LIST.some(w => comment.includes(w))) return false;
            if (NG_EXP_LIST.some(r => r.test(comment))) return false;
            return true;
        });
        console.log(\`コメント \${oldLength} 件のうち \${oldLength - data.data.comments.length} 件をフィルターしました\`);
        return new Response(JSON.stringify(data));
    };
})()`;
unsafeWindow.document.documentElement.appendChild(script);

})();

// 絵文字を検出する正規表現の出典: https://corycory.hateblo.jp/entry/javascript/javascrip-reg-emoji/