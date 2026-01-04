// ==UserScript==
// @name         Skeb More Data
// @namespace    userscript.wsbmr.skeb.moredata
// @version      0.2.0
// @description  Skeb ヘビーリクエスター向け UserScript
// @match        https://skeb.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447437/Skeb%20More%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/447437/Skeb%20More%20Data.meta.js
// ==/UserScript==

const genres = {
    art: 'イラスト',
    correction: 'アドバイス',
    video: 'ムービー',
    voice: 'ボイス',
    novel: 'テキスト',
    music: 'ミュージック'
};

const instructions = {
    detail: '詳細に',
    unspecified: '指定なし',
    brief: '簡潔に'
};

const formatYen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

const generateHtml = items => `
<div class="is-box">
  <div>
    <table class="table is-fullwidth is-narrow">
      <tbody>
${items.map(item => `
 <tr>
  <td><small>${item.label}</small></td>
  <td><small>${item.value}</small></td>
</tr>
`).join('\n')}
      </tbody>
    </table>
  </div>
</div>
`;

const api = async id => {
    try {
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        return json;
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

const formatSeconds = sec => {
    if (!sec || sec <= 0) {
        return '?時間';
    }
    const hours = Math.round(sec / 60 / 60);
    if (hours > 0) {
        return hours + '時間';
    }

    const minutes = Math.round(sec / 60);
    if (minutes > 0) {
        return minutes + '分';
    }

    return sec + '秒';
}

let lastOpened = '';

const callback = async () => {
    const column = document.querySelector('#root div.columns > div.column.is-3');
    if (!column) {
        return;
    }
    const paths = window.location.pathname.split('/');
    if (paths.length !== 2 || !paths[1].startsWith('@')) {
        lastOpened = '';
        return;
    }
    const id = paths[1].slice(1);
    if (lastOpened === id) {
        return;
    }
    lastOpened = id;

    const data = await api(id);
    if (!data) {
        return;
    }

    const skills = data.skills.map(item => ({
        label: `おまかせ: ${genres[item.genre] || item.genre}`,
        value: formatYen.format(item.default_amount)
    }));


    const items = [
        {
            label: 'クリエイター？',
            value: data.creator ? 'はい' : 'いいえ'
        },
        ...skills,
        {
            label: '本文指示',
            value: instructions[data.instruction] || data.instruction
        },
        {
            label: 'いそがしい？',
            value: data.busy ? 'はい' : '未設定'
        },
        {
            label: '非表示可？',
            value: data.private_acceptable ? 'はい' : 'いいえ'
        },
        {
            label: 'NSFW可？',
            value: data.nsfw_acceptable ? 'はい' : 'いいえ'
        },
        {
            label: '平均応答',
            value: formatSeconds(data.received_requests_average_response_time)
        },
        {
            label: '平均納品',
            value: formatSeconds(data.completing_average_time)
        },
        {
            label: '(送信の)平均キャンセル',
            value: formatSeconds(data.sent_requests_average_cancel_time)
        },
        {
            label: '承認期限',
            value: data.accept_expiration_days + '日'
        },
        {
            label: '納品期限',
            value: data.complete_expiration_days + '日'
        }
    ];

    const div = document.createElement('div');
    div.innerHTML = generateHtml(items);

    column.appendChild(div);
};

(function() {
    'use strict';

    const observer = new MutationObserver(() => void callback());
    observer.observe(document.querySelector('title'), { attributes: true, childList: true, subtree: true });
    setTimeout(() => {
        void callback();
    }, 1000);
})();