// ==UserScript==
// @name         能不能好好说话？（手机端）
// @namespace    https://lab.magiconch.com/nbnhhsh
// @version      0.17
// @description  首字母缩写划词翻译工具，适配手机端浏览器
// @author       itorr
// @license      MIT
// @icon         https://lab.magiconch.com/favicon.ico
// @match        *://weibo.com/*
// @match        *://*.weibo.com/*
// @match        *://*.weibo.cn/*
// @match        *://tieba.baidu.com/*
// @match        *://*.bilibili.com/
// @match        *://*.bilibili.com/*
// @match        *://*.douban.com/group/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js
// @inject-into  content
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533292/%E8%83%BD%E4%B8%8D%E8%83%BD%E5%A5%BD%E5%A5%BD%E8%AF%B4%E8%AF%9D%EF%BC%9F%EF%BC%88%E6%89%8B%E6%9C%BA%E7%AB%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533292/%E8%83%BD%E4%B8%8D%E8%83%BD%E5%A5%BD%E5%A5%BD%E8%AF%B4%E8%AF%9D%EF%BC%9F%EF%BC%88%E6%89%8B%E6%9C%BA%E7%AB%AF%EF%BC%89.meta.js
// ==/UserScript==

let Nbnhhsh = ((htmlText, cssText) => {
    const API_URL = 'https://lab.magiconch.com/api/nbnhhsh/';

    const request = (method, url, data, onOver) => {
        let x = new XMLHttpRequest();
        x.open(method, url);
        x.setRequestHeader('content-type', 'application/json');
        x.withCredentials = true;
        x.onload = () => onOver(x.responseText ? JSON.parse(x.responseText) : null);
        x.send(JSON.stringify(data));
        return x;
    };

    const Guess = {};
    const guess = (text, onOver) => {
        text = text.match(/[a-z0-9]{2,}/ig)?.join(',');

        if (!text) {
            app.show = false;
            return;
        }

        if (Guess[text]) {
            return onOver(Guess[text]);
        }

        if (guess._request) {
            guess._request.abort();
        }

        app.loading = true;
        guess._request = request('POST', API_URL + 'guess', { text }, data => {
            Guess[text] = data;
            onOver(data);
            app.loading = false;
        });
    };

    const submitTran = name => {
        let text = prompt('输入缩写对应文字 末尾可通过括号包裹（简略注明来源）', '');

        if (!text || !text.trim()) {
            return;
        }

        request('POST', API_URL + 'translation/' + name, { text }, () => {
            alert('感谢对好好说话项目的支持！审核通过后这条对应将会生效');
        });
    };

    const transArrange = trans => {
        return trans.map(tran => {
            const match = tran.match(/^(.+?)([（\(](.+?)[）\)])?$/);
            if (match && match.length === 4) {
                return {
                    text: match[1],
                    sub: match[3]
                };
            }
            return { text: tran };
        });
    };

    const getSelectionText = () => {
        let text = window.getSelection().toString().trim();
        if (text && /[a-z0-9]/i.test(text)) {
            return text;
        }
        return null;
    };

    const fixPosition = () => {
        let selection = window.getSelection();
        if (!selection.rangeCount) {
            app.show = false;
            return;
        }

        let rect = selection.getRangeAt(0).getBoundingClientRect();
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let viewportHeight = window.innerHeight;
        let viewportWidth = window.innerWidth;

        let top = scrollTop + rect.bottom + 20; // 增加20px余量以避免被光标遮挡
        let left = rect.left;

        // 确保弹窗不超出屏幕
        if (top + 200 > scrollTop + viewportHeight) {
            top = scrollTop + rect.top - 200; // 显示在选中文字上方
        }
        if (left + 300 > viewportWidth) {
            left = viewportWidth - 300; // 防止水平溢出
        }
        if (left < 10) {
            left = 10; // 左边距
        }

        if (top <= 0 || left <= 0) {
            app.show = false;
            return;
        }

        app.top = Math.floor(top);
        app.left = Math.floor(left);
    };

    const timer = () => {
        if (getSelectionText()) {
            setTimeout(timer, 300);
        } else {
            app.show = false;
        }
    };

    const nbnhhsh = () => {
        let text = getSelectionText();
        app.show = !!text && /[a-z0-9]/i.test(text);

        if (!app.show) {
            return;
        }

        fixPosition();

        guess(text, data => {
            if (!data || !data.length) {
                app.show = false;
            } else {
                app.tags = data;
            }
        });

        setTimeout(timer, 300);
    };

    // 触摸事件处理
    let touchTimeout;
    let isProcessing = false;
    const handleTouchEnd = (e) => {
        if (isProcessing) return;
        isProcessing = true;

        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            if (getSelectionText()) {
                nbnhhsh();
            }
            isProcessing = false;
        }, 100); // 减少延迟到100ms以提高响应速度
    };

    document.body.addEventListener('touchend', handleTouchEnd);
    // 防止触摸滑动时误触发
    document.body.addEventListener('touchmove', () => clearTimeout(touchTimeout));
    // 触摸开始时重置处理状态
    document.body.addEventListener('touchstart', () => {
        isProcessing = false;
    });

    const createEl = html => {
        createEl._el.innerHTML = html;
        let el = createEl._el.children[0];
        document.body.appendChild(el);
        return el;
    };
    createEl._el = document.createElement('div');

    createEl(`<style>${cssText}</style>`);

    const el = createEl(htmlText);

    const app = new Vue({
        el,
        data: {
            tags: [],
            show: false,
            loading: false,
            top: 0,
            left: 0,
        },
        methods: {
            submitTran,
            transArrange,
        }
    });

    return {
        guess,
        submitTran,
        transArrange,
    };
})(`
<div class="nbnhhsh-box nbnhhsh-box-pop" v-if="show" :style="{top:top+'px',left:left+'px'}" @mousedown.prevent @touchstart.prevent>
    <div class="nbnhhsh-loading" v-if="loading">
        加载中…
    </div>
    <div class="nbnhhsh-tag-list" v-else-if="tags.length">
        <div class="nbnhhsh-tag-item" v-for="tag in tags">
            <h4>{{tag.name}}</h4>
            <div class="nbnhhsh-tran-list" v-if="tag.trans">
                <span class="nbnhhsh-tran-item" v-for="tran in transArrange(tag.trans)">
                    {{tran.text}}<sub v-if="tran.sub">{{tran.sub}}</sub>
                </span>
            </div>
            <div class="nbnhhsh-notran-box" v-else-if="tag.trans===null">
                无对应文字
            </div>
            <div v-else-if="tag.inputting && tag.inputting.length !==0">
                <div class="nbnhhsh-inputting-list">
                    <h5>有可能是</h5>
                    <span class="nbnhhsh-inputting-item" v-for="input in tag.inputting">{{input}}</span>
                </div>
            </div>
            <div class="nbnhhsh-notran-box" v-else @click.prevent="submitTran(tag.name)">
                尚未录入，我来提交对应文字
            </div>
            <a v-if="tag.trans!==null" @click.prevent="submitTran(tag.name)" class="nbnhhsh-add-btn" title="我来提交对应文字"></a>
        </div>
    </div>
</div>
`, `
.nbnhhsh-box {
    font: 400 16px/1.5 sans-serif;
    color: #333;
    -webkit-user-select: none;
    user-select: none;
}
.nbnhhsh-box-pop {
    position: absolute;
    z-index: 99999999999;
    width: 90vw;
    max-width: 300px;
    background: #FFF;
    box-shadow: 0 3px 20px -4px rgba(0,0,0,0.3);
    margin: 10px 0;
    border-radius: 8px;
}
.nbnhhsh-box-pop::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 12px;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-bottom-color: #FFF;
}
.nbnhhsh-box sub {
    background: rgba(0,0,0,0.1);
    color: #777;
    font-size: 12px;
    line-height: 16px;
    display: inline-block;
    padding: 0 4px;
    margin: 0 0 0 4px;
    border-radius: 3px;
}
.nbnhhsh-tag-list {
    max-height: 60vh;
    overflow-y: auto;
}
.nbnhhsh-tag-item {
    padding: 8px 12px;
    position: relative;
}
.nbnhhsh-tag-item:nth-child(even) {
    background: rgba(0, 99, 255, 0.06);
}
.nbnhhsh-tag-item h4 {
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    margin: 0;
}
.nbnhhsh-tran-list {
    color: #444;
    padding: 4px 0;
    line-height: 20px;
}
.nbnhhsh-tran-item {
    display: inline-block;
    padding: 2px 10px 2px 0;
}
.nbnhhsh-inputting-list {
    color: #222;
    padding: 4px 0;
}
.nbnhhsh-inputting-list h5 {
    font-size: 12px;
    line-height: 20px;
    color: #999;
    margin: 0;
}
.nbnhhsh-inputting-item {
    margin-right: 10px;
    display: inline-block;
}
.nbnhhsh-notran-box {
    padding: 6px 0;
    color: #999;
    cursor: pointer;
}
.nbnhhsh-add-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #0059ff;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}
.nbnhhsh-add-btn:after {
    content: '+';
}
.nbnhhsh-loading {
    text-align: center;
    color: #999;
    padding: 15px 0;
}
`);