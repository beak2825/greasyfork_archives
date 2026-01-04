// ==UserScript==
// @name         显示锁帖
// @version      0.0.1
// @match        https://www.mcbbs.net/forum.php?mod=viewthread&tid=*
// @match        https://www.mcbbs.net/thread-*.html
// @author       xmdhs
// @license MIT
// @description  显示锁帖。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/439690/%E6%98%BE%E7%A4%BA%E9%94%81%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439690/%E6%98%BE%E7%A4%BA%E9%94%81%E5%B8%96.meta.js
// ==/UserScript==

myMod()

function myMod() {
    let ct = document.getElementById('ct');
    if (!ct) {
        return
    }
    let warndiv = document.getElementById('messagetext');
    if (!warndiv) {
        return
    }
    let text = warndiv.textContent || '';
    if (!(text.indexOf('过于陈旧') != - 1 && text.indexOf('解锁卡查看') != - 1)) {
        return
    }
    const tid = getTid()
    warndiv.appendChild(document.createElement('p')).innerHTML = '<p class="alert_btnleft"><a href="forum.php?mod=viewthread&action=printable&tid=' + tid + '">[ 查看 ]</a></p>';
    let p = document.createElement('p');
    p.classList.add('alert_btnleft');
    let a = document.createElement('a'), el = a;
    a.textContent = '[ 点击查看被锁帖子内容预览 ]';
    a.href = 'javascript: void(0);';
    a.onclick = () => {
        if (!ct) {
            return
        }
        ct.innerHTML = '';
        fetchPrev(tid, 1);
        styleMe()
    };
    p.appendChild(a);
    warndiv.appendChild(p)


    async function fetchPrev(tid, page = 1) {
        let k = parseInt(tid);
        if (isNaN(k) || k < 1) {
            return
        }
        let f = await fetch('https://www.mcbbs.net/api/mobile/index.php?version=4&module=viewthread&tid=' + tid + '&page=' + page)
        if (!f.ok) {
            console.log('获取失败', f.status);
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchPrev(tid, page)
        }
        let data = await f.json();
        if (!ct) {
            return
        }
        if (page == 1) {
            let adom = document.createElement('a');
            adom.id = 'post_reply';
            adom.href = 'javascript: void(0);';
            adom.title = '回复';
            adom.innerHTML = `<img src="template/mcbbs/image/pn_reply.png" style="margin: 10px 0px 10px 5px;" alt="回复">`
            adom.onclick = () => {
                showWindow('reply', 'forum.php?mod=post&action=reply&extra=&tid=' + tid)
            }
            ct.appendChild(adom)
            let subject = data.Variables.thread.subject;
            let adiv = document.createElement('div');
            adiv.style.fontSize = '1.5rem';
            adiv.textContent = subject;
            ct.appendChild(adiv)
            let t = document.head.querySelector('title');
            if (t) t.textContent = subject + ' - Minecraft(我的世界)中文论坛'
        }
        let position = 1;
        let plist = data.Variables.postlist;
        let lastdiv = null;
        for (let p of plist) {
            let div = document.createElement('div');
            lastdiv = div;
            div.setAttribute('name', `post-${p.position}`);
            p.message = spoiler(p.message);
            p.message = decode(p.message);
            div.innerHTML = `<div class="post-author"><div><a href="https://www.mcbbs.net/?${p.authorid}"><b>${p.author}</b></a><span> 发表于${p.dateline}</span></div><span>${p.number}楼</span></div><div class="post-text">${p.message}</div>`;
            ct.appendChild(div);
            position = isNaN(parseInt(p.position)) ? 1 : parseInt(p.position)
        }
        let lastp = parseInt(data.Variables.thread.maxposition);

        let o = new IntersectionObserver(async e => {
            if (e.length > 0 && e[0].intersectionRatio > 0) {
                if (!isNaN(lastp) && lastp > position) {
                    await fetchPrev(tid, page + 1)
                }
                o.disconnect();
            }
        });
        o.observe(lastdiv)
    }
}

function spoiler(str) {
    let t = Math.min((str.match(/\[spoiler\]/g) || []).length, (str.match(/\[\/spoiler\]/g) || []).length);
    let s = str + '';
    for (let i = 0; i < t; i++) {
        s = s.replace('[spoiler]', '<details><summary>点击展开/收起隐藏内容</summary>').replace('[/spoiler]', '</details>')
    }
    return s
}

function getTid() {
    return (window.location.href.match(/thread-([\d]+)/) || window.location.href.match(/tid\=([\d]+)/) || ['0', '0'])[1]
}

function styleMe() {
    addNewStyle(`#ct>div{border-top:1px solid#ccc;padding:8px}#ct div.post-text{padding:5px;font-size:14px;}#ct div.post-author{position:sticky;top:0;background:#fbf2db;border-bottom:1px dashed#ccc;font-size:1.2em;display:flex;justify-content:space-between}#ct div.reply_wrap{background-color:#f5f5f5;padding:5px}#ct div img{max-width:100%}#ct div summary{background:#fafafa;outline:1px#ccc solid}body.night-style div#ct>div>div.post-author{background-color:#444}body.night-style div#ct>div a{color:#f0f0f0}body.night-style div#ct div.reply_wrap{background-color:#444}body.night-style div#ct div summary{background:#444;outline:1px#999 solid}`)
}

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

function decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}