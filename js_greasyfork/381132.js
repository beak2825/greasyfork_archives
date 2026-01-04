// ==UserScript==
// @name            FriendsKit
// @namespace       https://github.com/yuzulabo
// @version         1.3.2
// @description     friends.nico の独自機能を再現するユーザスクリプト
// @author          nzws
// @match           https://knzk.me/*
// @match           https://best-friends.chat/*
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_notification
// @grant           unsafeWindow
// @connect         friendskit.nzws.me
// @connect         media.knzk.me
// @connect         media.best-friends.chat
// @require         https://unpkg.com/blob-util/dist/blob-util.min.js
// @downloadURL https://update.greasyfork.org/scripts/381132/FriendsKit.user.js
// @updateURL https://update.greasyfork.org/scripts/381132/FriendsKit.meta.js
// ==/UserScript==

const version = '1.3.2';
const s = localStorage.friendskit;
const F = {
    conf: s ? JSON.parse(s) : {
        keyword: []
    },
    imgcache: {},
    iconcache: {}
};
const api = F.conf.api_server ? F.conf.api_server : 'https://friendskit.nzws.me/api/';
const user_emoji_regexp = new RegExp(':(_|@)([A-Za-z0-9_@.]+):', 'gm');
const nico_ms_shorten_regexp = new RegExp('(sm|nm|im|sg|mg|bk|lv|co|ch|ar|ap|jk|nw|so|l\/|dic\/|user\/|mylist\/)([0-9]+)', 'gmi');
const nico_ms_watch_regexp = new RegExp('(watch\/)([0-9]+)', 'gmi');

const keyword_escaped = [];
F.conf.keyword.forEach(value => {
    ['\\', '^', '$', '*', '+', '?', '.', '(', ')', '|', '{', '}', '[', ']'].forEach(meta => {
        value = value.replace(meta, '\\' + meta);
    });
    keyword_escaped.push(value);
});
const keyword_regexp = new RegExp(`(${keyword_escaped.join('|')})`, 'gim');

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(node => runner(node));
    });
});

function watcher() {
    const p = location.pathname;
    if (F.path !== p) {
        runner(document.querySelector('.column:last-child'));

        if (p === '/web/getting-started' && !document.querySelector('.friendskit-cp-btn')) {
            const settingLi = document.createElement('li');
            settingLi.innerHTML = ` · <a href="#" class="friendskit-cp-btn">FriendsKit CP (v${version})</a>`;

            document.querySelector('.getting-started__footer ul').appendChild(settingLi);
            settingLi.addEventListener('click', openCP);
        }
    }
    F.path = p;
}

function runner(node) {
    if (!node.tagName) return;
    const statusAll = node.querySelectorAll('.status__content');
    if (!statusAll[0]) return;

    for (let status of statusAll) {
        const display_name_account = status.parentNode.querySelector('.display-name__account');
        const status_display_name = status.parentNode.querySelector('.status__display-name');
        const origin_acct = display_name_account ? display_name_account.textContent.slice(1) : status_display_name.title;
        const origin_domain = '@' + (origin_acct.indexOf('@') !== -1 ? origin_acct.split('@')[1] : location.hostname);

        replaceTool(status, origin_domain);
    }
}

function replaceTool(status, domain) {
    if (status.hasChildNodes()) {
        for (let node of status.childNodes) {
            replaceTool(node, domain);
        }
    } else {
        if (status.nodeName !== '#text') return;

        let is_replaced = false;
        const html = document.createElement('span');
        html.innerHTML = status.data;

        if (F.conf.keyword.length > 0 && F.conf.keyword[0]) {
            html.innerHTML = html.innerHTML.replace(keyword_regexp, `<span style='color: orange'>$1</span>`);
        }

        if (!findParentByTagName(status, 'A')) {
            html.innerHTML = html.innerHTML.replace(nico_ms_shorten_regexp, `<a href="http://nico.ms/$1$2" target="_blank" rel=”nofollow”>$1$2</a>`)
            .replace(nico_ms_watch_regexp, `<a href="http://nico.ms/$2" target="_blank" rel=”nofollow”>$1$2</a>`);
        }

        if (html.innerHTML !== status.data) {
            status.parentNode.replaceChild(html, status);
            is_replaced = true;
        }

        const ue_found = html.innerHTML.match(user_emoji_regexp);
        if (ue_found) {
            ue_found.forEach(async data => {
                let acct = data.slice(2).slice(0, -1);
                if (acct.indexOf('@') === -1) acct += domain;

                const image = await getIconUrl(acct);
                html.innerHTML = html.innerHTML.replace(new RegExp(data, 'gm'), `<img draggable="false" class="emojione" alt=":_${acct}:" title="${acct}" src="${image}"/>`);
            });

            if (!is_replaced) {
                status.parentNode.replaceChild(html, status);
            }
        }
    }
}

function findParentByTagName(element, tagName, max = 3) {
    if (max < 1 || element.tagName === tagName) {
        return element.tagName === tagName;
    } else if (element.parentNode) {
        return findParentByTagName(element.parentNode, tagName, max - 1);
    } else {
        return false;
    }
}

function openCP() {
    const div = document.createElement('div');
    div.className = 'friendskit-cp';
    div.innerHTML = `
<div class="close fcp-clickable" data-fcp="close"><i class="fa fa-times fa-2x" data-fcp="close"></i></div>
<div class="h1">FriendsKit CP</div>

<div class="h2">キーワードハイライト設定</div>
カンマ(,)区切りで指定
<textarea id="friendskit-keyword" rows="5">${F.conf.keyword.join(',')}</textarea>

<div class="h2">お気に入りアイコン設定</div>
<p>
* アイコン設定で複数の設定がされている時、この設定で一番上の物が優先されます。
</p>

<label for="fav_icon_default_force"><input class="check_boxes" type="checkbox" id="fav_icon_default_force" ${F.conf.fav_icon_default_force ? 'checked' : ''}>強制的に星に戻す</label>

文字にする (1~2文字程度):<br>
<input id="fav_icon_char" placeholder="空欄で解除" class="input-text" value="${F.conf.fav_icon_char ? F.conf.fav_icon_char : ''}">

画像にする (画像URLを指定):<br>
<input id="fav_icon" placeholder="アクティブ(明るい方)" class="input-text" value="${F.conf.fav_icon ? F.conf.fav_icon : ''}">
<input id="fav_icon_gray" placeholder="暗い方" class="input-text" value="${F.conf.fav_icon_gray ? F.conf.fav_icon_gray : ''}">

<div class="h2">お気に入りアイコン拡大</div>

<label for="no_fav_icon_big"><input class="check_boxes" type="checkbox" id="no_fav_icon_big" ${F.conf.no_fav_icon_big ? 'checked' : ''}>無効にする</label>

<div class="h2">細かなやつ</div>
<button class="button fcp-clickable" data-fcp="import-settings">設定のインポート</button>
<button class="button fcp-clickable" data-fcp="export-settings">設定のエクスポート</button>
<button class="button danger fcp-clickable" data-fcp="reset-settings">設定のリセット</button>

<button class="button button--block fcp-clickable" style="margin: 20px 0" data-fcp="save">設定を保存</button>

<div class="h3">FriendsKit v${version}</div>
<p>
<a href="https://github.com/yuzulabo/FriendsKit/releases" target="_blank">リリースノート(更新履歴) を見る</a>
</p>

<p style="margin-top: 5px">
GitHub: <a href="https://github.com/yuzulabo/FriendsKit" target="_blank">yuzulabo/FriendsKit</a><br>
Greasy Fork: <a href="https://greasyfork.org/ja/scripts/381132-friendskit" target="_blank">381132-friendskit</a>
</p>
`;
    document.body.appendChild(div);
    document.querySelector('.app-holder').classList.add('friendskit-disable');

    const btns = document.querySelectorAll(".fcp-clickable");
    for (let btn of btns) {
        btn.addEventListener('click', (e) => CPOpr(e));
    }
}

function CPOpr(e) {
    const mode = e.target.dataset.fcp;
    if (!mode) return;
    if (mode === 'save') {
        const keyword = document.getElementById('friendskit-keyword').value;
        const keywords = keyword ? Array.from(new Set(keyword.split(','))) : [];

        const newConf = {
            keyword: keywords,
            fav_icon_default_force: document.getElementById('fav_icon_default_force').checked,
            fav_icon_char: document.getElementById('fav_icon_char').value,
            fav_icon: document.getElementById('fav_icon').value,
            fav_icon_gray: document.getElementById('fav_icon_gray').value,
            no_fav_icon_big: document.getElementById('no_fav_icon_big').checked,
        };
        Object.assign(F.conf, newConf);
        save();

        alert('保存しました。再読み込みします...');
        location.reload();
    } else if (mode === 'close') {
        if (!confirm('変更は破棄されますがよろしいですか？')) return;

        const element = document.querySelector('.friendskit-cp');
        element.parentNode.removeChild(element);
        document.querySelector('.app-holder').classList.remove('friendskit-disable');
    } else if (mode === 'import-settings') {
        const code = prompt('エクスポート時に出力したコードを入力してください:');
        if (!code) return;

        if (friendskit.importSettings(code)) {
            alert('インポートしました。再読み込みします...');
            location.reload();
        } else {
            alert('このコードは壊れています。インポートできません。');
        }
    } else if (mode === 'export-settings') {
        friendskit.exportSettings('CP');
        alert('設定のエクスポートをクリップボードにコピーしました。');
    } else if (mode === 'reset-settings') {
        if (!confirm('設定をリセットします！よろしいですか？')) return;
        if (!confirm('まじで？')) return;
        if (!confirm('まじか...')) return;

        if (friendskit.resetSettings()) {
            location.reload();
        }
    }
}

const friendskit = {
    keyword: {
        add: (word) => {
            const key = F.conf.keyword.indexOf(word);
            if (key !== -1) {
                console.warn('[FriendsKit]', 'このワードは追加済みです');
                return;
            }

            F.conf.keyword.push(word);
            save();
            console.log('[FriendsKit]', 'Done✨');
        },
        remove: (word) => {
            const key = F.conf.keyword.indexOf(word);
            if (key === -1) {
                console.warn('[FriendsKit]', 'このワードは存在しません');
                return;
            }

            delete F.conf.keyword[key];
            save();
            console.log('[FriendsKit]', 'Done✨');
        },
        list: () => {
            console.log('[FriendsKit]', F.conf.keyword);
        },
        reset: () => {
            F.conf.keyword = [];
            save();
            console.log('[FriendsKit]', 'Done✨');
        }
    },
    changeSettings: (name, value) => {
        F.conf[name] = value ? value : null;
        save();
        console.log('[FriendsKit]', 'Done✨');
    },
    exportSettings: (type) => {
        if (type === 'CP') {
            GM_setClipboard(localStorage.friendskit);
        } else {
            GM_setClipboard('friendskit.importSettings(`' + localStorage.friendskit + '`)');
            console.log('[FriendsKit]', 'Done✨\nクリップボードにコピーしたコードをインポートしたいページの Console にそのまま打ち込んでください。');
        }
    },
    resetSettings: () => {
        delete localStorage.friendskit;
        return !localStorage.friendskit;
    },
    importSettings: (data) => {
        try {
            JSON.parse(data);
        } catch(e) {
            console.warn('[FriendsKit]', 'このデータは壊れています', e);
            return false;
        }
        localStorage.friendskit = data;
        console.log('[FriendsKit]', 'Done✨');
        return true;
    }
};
exportFunction(friendskit, unsafeWindow, {defineAs: 'friendskit' });

async function getImage(url) {
    return new Promise(resolve => {
        if (F.imgcache[url]) {
            resolve(F.imgcache[url]);
            return;
        }
        blobUtil.imgSrcToDataURL(url, 'image/png', 'Anonymous').then(function (dataurl) {
            F.imgcache[url] = dataurl;
            resolve(F.imgcache[url]);
        }).catch(function (err) {
            console.warn('[FriendsKit]', '画像取得に失敗', url);
        });
    });
}

async function getIconUrl(acct) {
    return new Promise(resolve => {
        if (F.iconcache[acct]) {
            resolve(F.iconcache[acct]);
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            responseType: 'json',
            url: api + 'get_icon.php?acct=' + acct + '&domain=' + location.hostname,
            onerror: () => {
                console.warn('[FriendsKit]', 'json取得に失敗', acct);
                return;
            },
            onload: (response) => {
                if (response.status !== 200) {
                    console.warn('[FriendsKit]', `json取得に失敗 ${response.status}`, acct);
                    return;
                }

                if (response.response.error) {
                    console.warn('[FriendsKit]', response.response.error, acct);
                    return;
                }

                F.iconcache[acct] = response.response.url;
                resolve(F.iconcache[acct]);
            }
        });
    });
}

function save() {
    const data = JSON.stringify(F.conf);
    localStorage.friendskit = data;
}

function at_pizza() {
    const textarea = document.querySelector('.autosuggest-textarea__textarea');
    if (!textarea) return;

    if (textarea.value.match(/[@|＠]ピザ/)) {
        window.open('https://www.google.com/search?q=近くのピザ屋さん');
    }

    if (textarea.value.match(/[@|＠]ハローワーク/)) {
        window.open('https://www.hellowork.go.jp/');
    }
}

const mainElem = document.getElementById('mastodon');
if (!mainElem) return;

observer.observe(mainElem, { childList: true, subtree: true });

let css = `
.friendskit-cp {
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: #e6ebf0;
color: #000;
padding: 20px;
border-radius: 5px;
min-width: 55%;
max-width: 95%;
min-height: 50%;
max-height: 65%;
overflow-y: scroll;
}

.friendskit-disable {
filter: blur(4px);
pointer-events: none;
}

.friendskit-cp textarea, .friendskit-cp .input-text, .friendskit-cp label {
display: block;
width: 100%;
margin: 10px 0;
}

.fcp-clickable {
cursor: pointer;
}

.h1 {
font-size: 2.4rem;
}

.h2 {
font-size: 1.7rem;
}

.h3 {
font-size: 1.3rem;
}

.h1, .h2, .h3 {
margin: 1rem 0;
padding-bottom: 0.3rem;
font-weight: 500;
line-height: 1.2;
border-bottom: 1px solid #c0cdd9;
}

.close {
float: right;
color: #000;
text-shadow: 0 1px 0 #fff;
opacity: .5;
}

.button.danger {
background: #df405a;
}
`;

window.onload = async () => {
    setInterval(watcher, 1000);

    document.querySelector('.compose-form__publish-button-wrapper button').addEventListener('click', at_pizza, false);
    document.querySelector('.autosuggest-textarea__textarea').onkeydown = (e) => {
        if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) at_pizza();
    };

    if (!F.conf.fav_icon_default_force) {
        const i = await getImage(F.conf.fav_icon ? F.conf.fav_icon : 'https://i.imgur.com/iZQJgSW.png');
        const ig = await getImage(F.conf.fav_icon_gray ? F.conf.fav_icon_gray : 'https://i.imgur.com/ninYNIi.png');

        const char = F.conf.fav_icon_char ? F.conf.fav_icon_char : null;

        css += `
.fa-star {
background-image: ${char || !ig ? `none` : `url('${ig}')`};
width: 16px;
height: 16px;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
}

.fa-star:before {
content: '${char ? char : (ig ? '' : '\\f005')}';
}

.active .fa-star, .notification__message .fa-star {
background-image: ${char || !i ? `none` : `url('${i}')`};
}

.active .fa-star:before, .notification__message .fa-star:before {
content: '${char ? char : (i ? '' : '\\f005')}';
}
`;

        if (i && !char) {
            css += `
.active .fa-star, .notification__message .fa-star {
background-image: url('${i}');
}
`;
        }
    }

    if (!F.conf.no_fav_icon_big) {
        css += `
.status__info, .status__content {
margin-right: 40px;
}

.status button.star-icon {
position: absolute;
top: 20px;
right: 10px;
z-index: 999999;
}

.status .fa-star {
width: 40px;
height: 40px;
font-size: 2em;
}
`;
    }

    GM_addStyle(css);

    console.log(`%c..: FriendsKit v${version} :..`, '    background: black;font-size: large;color: orange');
    if (localStorage.friendskit_version !== version) {
        GM_notification({
            title: `FriendsKit v${version}にアップデートしました。`,
            text: `クリックしてリリースノート(更新履歴)を表示`,
            highlight: true,
            onclick: () => {
                window.open('https://github.com/yuzulabo/FriendsKit/releases');
            }
        });
    }
    localStorage.friendskit_version = version;
};