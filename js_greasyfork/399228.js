// ==UserScript==
// @name         划词翻译
// @namespace    https://greasyfork.org/zh-CN/scripts/382768
// @version      1.0
// @description  划词翻译修改版(有道)
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/rangy/1.3.0/rangy-core.min.js
// @author       xianmua
// @match        http://*/*
// @include      *://*/*
// @run-at document-end
// @connect      dict.youdao.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/399228/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/399228/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

//修改后可以翻译本地文件的单词，并且去掉了连接失败的提示
//参考自：https://greasyfork.org/en/scripts/41076-%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91/discussions/116890
'use strict';
// const youdaoUrl = 'http://dict.youdao.com/jsonapi?xmlVersion=5.1&dicts={"count":99,"dicts":[["ec"]]}&jsonversion=2&q=';
const youdaoUrl = 'http://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&dicts=%7B%22count%22%3A99%2C%22dicts%22%3A%5B%5B%22ec%22%2C%22ce%22%2C%22newcj%22%2C%22newjc%22%2C%22kc%22%2C%22ck%22%2C%22fc%22%2C%22cf%22%2C%22multle%22%2C%22jtj%22%2C%22pic_dict%22%2C%22tc%22%2C%22ct%22%2C%22typos%22%2C%22special%22%2C%22tcb%22%2C%22baike%22%2C%22lang%22%2C%22simple%22%2C%22wordform%22%2C%22exam_dict%22%2C%22ctc%22%2C%22web_search%22%2C%22auth_sents_part%22%2C%22ec21%22%2C%22phrs%22%2C%22input%22%2C%22wikipedia_digest%22%2C%22ee%22%2C%22collins%22%2C%22ugc%22%2C%22media_sents_part%22%2C%22syno%22%2C%22rel_word%22%2C%22longman%22%2C%22ce_new%22%2C%22le%22%2C%22newcj_sents%22%2C%22blng_sents_part%22%2C%22hh%22%5D%2C%5B%22ugc%22%5D%2C%5B%22longman%22%5D%2C%5B%22newjc%22%5D%2C%5B%22newcj%22%5D%2C%5B%22web_trans%22%5D%2C%5B%22fanyi%22%5D%5D%7D&keyfrom=mdict.7.2.0.android&model=honor&mid=5.6.1&imei=659135764921685&vendor=wandoujia&screen=1080x1800&ssid=superman&network=wifi&abtest=2&xmlVersion=5.1&q='
const googleUrl = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=';
const reHZ = /^[\u4E00-\u9FA5\uFF00-\uFF20\u3000-\u301C]/;

const countOfWord = s => s ? s.split(/\s+/).length : 0;
const isChina = s => reHZ.test(s);
// 翻译结果面板
class TranslateTip {
    constructor() {
        const div = document.createElement('div');
        div.hidden = true;
        div.setAttribute('style',
`position:absolute!important;
font-size:13px!important;
overflow:auto!important;
background:#fff!important;
font-family:sans-serif,Arial!important;
font-weight:normal!important;
text-align:left!important;
color:#000!important;
padding:0.5em 1em!important;
line-height:1.5em!important;
border-radius:5px!important;
border:1px solid #ccc!important;
box-shadow:4px 4px 8px #888!important;
max-width:350px!important;
max-height:216px!important;
z-index:2147483647!important;`
        );
        document.documentElement.appendChild(div);
        //点击了翻译内容面板，不再创建翻译图标
        div.addEventListener('mouseup', e => e.stopPropagation());
        this._tip = div;
    }
    showText(text) { //显示翻译文本
        this._tip.innerHTML = text;
        this._tip.hidden = !1;
    }
    hide() {
        this._tip.innerHTML = '';
        this._tip.hidden = true;
    }
    pop(ev) {
        this._tip.style.top = ev.pageY + 'px';
        //面板最大宽度为350px
        this._tip.style.left = (ev.pageX + 350 <= document.body.clientWidth ?
            ev.pageX : document.body.clientWidth - 350) + 'px';
    }
}
const tip = new TranslateTip();

class Icon {
    constructor() {
        const icon = document.createElement('span');
        icon.hidden = true;
        icon.innerHTML = `<svg style="margin:4px !important;" "width="24" height="24" viewBox="0 0 768 768">
            <path d="M672 640.5v-417c0-18-13.5-31.5-31.5-31.5h-282l37.5 129h61.5v-33h34.5v33h115.5v33h-40.5c-10.5 40.5-33 79.5-61.5 112.5l87 85.5-22.5 24-87-85.5-28.5 28.5 25.5 88.5-64.5 64.5h225c18 0 31.5-13.5 31.5-31.5zM447 388.5c7.5 15 19.5 34.5 36 54 39-46.5 49.5-88.5 49.5-88.5h-127.5l10.5 34.5h31.5zM423 412.5l19.5 70.5 18-16.5c-15-16.5-27-34.5-37.5-54zM355.5 339c0-7.381-0.211-16.921-3-22.5h-126v49.5h70.5c-4.5 19.5-24 48-67.5 48-42 0-76.5-36-76.5-78s34.5-78 76.5-78c24 0 39 10.5 48 19.5l3 1.5 39-37.5-3-1.5c-24-22.5-54-34.5-87-34.5-72 0-130.5 58.5-130.5 130.5s58.5 130.5 130.5 130.5c73.5 0 126-52.5 126-127.5zM640.5 160.5c34.5 0 63 28.5 63 63v417c0 34.5-28.5 63-63 63h-256.5l-31.5-96h-225c-34.5 0-63-28.5-63-63v-417c0-34.5 28.5-63 63-63h192l28.5 96h292.5z" style="fill:#3e84f4;"></svg>`;
        icon.setAttribute('style',
        `width:32px!important;
        height:32px!important;
        background:#fff!important;
        border-radius:50%!important;
        box-shadow:4px 4px 8px #888!important;
        position:absolute!important;
        z-index:2147483647!important;`
        );
        document.documentElement.appendChild(icon);
        //拦截二个鼠标事件，以防止选中的文本消失
        icon.addEventListener('mousedown', e => e.preventDefault(), true);
        icon.addEventListener('mouseup', ev => ev.preventDefault(), true);
        icon.addEventListener('click', ev => {
            if (ev.ctrlKey) navigator.clipboard.readText()
                .then(text => {
                    this.queryText(text.trim(),ev);
                })
                .catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                });
            else {
                const text = window.getSelection().toString().trim().replace(/\s{2,}/g, ' ');
                this.queryText(text,ev);
            }
        });
        this._icon = icon;
    }
    pop(ev) {
        const icon = this._icon;
        icon.style.top = ev.pageY + 12 + 'px';
        icon.style.left = ev.pageX + 'px';
        icon.hidden = !1;
        icon.click();//弹出后自动点击
        setTimeout(this.hide.bind(this), 2e3);
    }
    hide() {
        this._icon.hidden = true;
    }
    queryText(text,ev) {
        if (text) {
            this._icon.hidden = true;
            tip.pop(ev);
            //const url = isChina(text) ? googleUrl +'en&q=' : countOfWord(text) == 1 ? youdaoUrl : googleUrl +'zh-CN&q=';
            const url = youdaoUrl;
            ajax(url, text);
        }
    }
}
const icon = new Icon();

document.addEventListener('mouseup', function(e) {
    var text = window.getSelection().toString().trim();
    if (!text) {
        icon.hide();
        tip.hide();
    }
    else icon.pop(e);
});

function ajax(url, text) {
    const isYd = url.includes('//dict.youdao.');
    url += encodeURIComponent(text);
    console.log(url + "\n" + text);
    GM_xmlhttpRequest({
        method: 'GET',
        responseType: 'json',
        url: url,
        onload: function(res) {
            //isYd ? youdao(res.response, text) : google(res.response);
            youdao(res.response, text);
        },
        onerror: function(res) {
        console.log(res);
            //tip.showText("连接失败\nURL: "+ url);
        }
    });
}

function youdao(rst, text) {
    if (!rst) {
        //ajax(googleUrl + 'zh-CN&q=', text);
        return;
    }
    let html = '';
    if(!!rst.fanyi){
        html += rst.fanyi.tran;
    tip.showText(html);
    return;
    }
    if(!!rst.ce){
        let trsce = rst.ce.word[0].trs;
        html += trsce.map(el => el.tr[0].l.i.map(w => w["#text"]).join(' ')).join('<br />');
    tip.showText(html);
    return;
    }
    if(!!rst.ec){
        const { trs, ukphone, usphone, phone } = rst.ec.word[0];
        if (!!ukphone && ukphone.length > 0) {
            html = `<span style="color:#9E9E9E !important;">英[${ukphone}]</span>`;
        }
        if (!!usphone && usphone.length > 0) {
            html += `<span style="color:#9E9E9E !important;">美[${usphone}]</span>`;
        }
        if (html.length > 0) {
            html += '<br />';
        } else if (!!phone && phone.length > 0) {
            html += `<span style="color:#9E9E9E !important;">[${phone}]</span>`;
        }
        html += trs.map(el => el.tr[0].l.i[0]).join('<br />');
        tip.showText(html);
        return;
    }
    tip.showText(text);
}

function google(rst) {
    console.log(rst)
    let k, html = '';
    for (k of rst.sentences) html += k.trans;
    tip.showText(html);
}