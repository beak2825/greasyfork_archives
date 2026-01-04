// ==UserScript==
// @name Discord救援
// @namespace Script Runner Pro
// @description Discord救援用
// @match http://game.granbluefantasy.jp/
// @grant none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/425830/Discord%E6%95%91%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/425830/Discord%E6%95%91%E6%8F%B4.meta.js
// ==/UserScript==

const Status = {
    NORMAL: 0,
    IRAI: 1,
};

let id = '';
let status = Status.NORMAL;

const oc = async () => {
    const questName = document.querySelector('.prt-stage-area > .btn-targeting.enemy-1 > .enemy-info > .name')?.textContent;
    console.info(`Discordで救援を依頼しました！\n> ${document.querySelector('.player > .txt-name')?.textContent || 'user: unknown'}\n> ${questName || 'quest: unknown'}\n> ${id || 'id: unknown'}`);
    post({ content: `> ${document.querySelector('.player > .txt-name')?.textContent || 'user: unknown'}\n> ${questName || 'quest: unknown'}\n> ${id || 'id: unknown'}` });
    notif('Discordで救援を依頼しました！', { backgroundColor: '#7fbfff' });
};

function tick() {
    const pop = getKyuenPop();
    if (pop && status === Status.NORMAL) {
        status = Status.IRAI;
        if (
            pop.querySelector('.txt-popup-body')
                && pop.querySelector('.prt-select-assist')
                && !pop.querySelector('#discord-kyuen-select')
        ) {
            const prtDiscordAssist = document.createElement('div');
            prtDiscordAssist.id = 'prt-discord-assist';
            prtDiscordAssist.classList.add('prt-twitter-assist');
            prtDiscordAssist.style.boxSizing = 'border-box';
            prtDiscordAssist.style.display = '-webkit-box';
            prtDiscordAssist.style['-webkit-box-pack'] = 'justify';
            prtDiscordAssist.style.paddingTop = '15px';
            prtDiscordAssist.style.marginLeft = '-15px';
            prtDiscordAssist.style.width = '280px';
            prtDiscordAssist.innerHTML = `
<div class="prt-box prt-twitter-txt">
    <div class="txt-twitter">
        <div class="txt-twitter-attention">Discordに参戦IDを投稿</div><br>
        ※救援依頼対象は選択できません
    </div>
</div>
<div class="prt-box prt-twitter-btn">
    <div id="btn-discord" style="background: url('https://i.imgur.com/Lh2bbCv.png') no-repeat 0px 0px; background-size: 75px 23px; width: 75px; height: 23px;"></div>
</div>
`;
            pop.querySelector('.txt-popup-body')?.insertBefore(prtDiscordAssist, pop.querySelector('.prt-twitter-assist'));
            pop.querySelector('#btn-discord')?.addEventListener('click', oc);
        } else {
            pop.querySelector('#btn-discord')?.addEventListener('click', oc);
        }
        id = pop.querySelector('.prt-battle-id')?.textContent;
    } else if (!pop && status !== Status.NORMAL) {
        status = Status.NORMAL;
    }
}

function getKyuenPop() {
    const pops = document.querySelectorAll('#pop');
    for (let i = 0; i < pops.length; i++) {
        if (pops[i]?.querySelector('.pop-start-assist > .prt-popup-header')?.textContent === '救援依頼') {
            return pops[i];
        }
    }
}

function post(data = {}) {
    return postData('https://discord.com/api/webhooks/838393276797026324/lfxzrvJrprmxu7JheUTkHqlYDkPJWQeWX3ZfHcrOL12Ih0UYq6erz7rdB35iWL995rcl', data);
}
 
function postData(url = ``, data = {}) {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
  
function notif(message, options = {}) {
    const o = { color: 'white', backgroundColor: 'red', duration: 3000 }
    Object.assign(o, options);
    const toast = document.createElement('div');
    toast.style.zIndex = '99999';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '20px';
    toast.style.backgroundColor = o.backgroundColor;
    toast.style.borderRadius = '5px';
    toast.style.padding = '5px';
    toast.style.color = o.color;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), o.duration);
}

setInterval(tick, 100);
