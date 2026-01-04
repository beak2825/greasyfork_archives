// ==UserScript==
// @name         nastoolNameTest
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  NasTools名称测试划词版
// @author       yubanmeiqin9048
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @match        https://bangumi.moe/*
// @match        https://*.acgnx.se/*
// @match        https://*.dmhy.org/*
// @match        https://nyaa.si/*
// @match        https://mikanani.me/*
// @match        https://*.skyey2.com/*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463905/nastoolNameTest.user.js
// @updateURL https://update.greasyfork.org/scripts/463905/nastoolNameTest.meta.js
// ==/UserScript==


(function () {
    'use strict';
    //nastool地址
    const nastoolUrl = 'http://localhost:3000';
    // 结果面板
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
            //点击了内容面板，不再创建图标
            div.addEventListener('mouseup', e => e.stopPropagation());
            this._tip = div;
        }
        showText(text) { //显示测试结果
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
            icon.innerHTML = `<svg style="margin:4px !important;" width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 2L22 12L12 22L2 12Z" style="fill:none;stroke:#3e84f4;stroke-width:2;"></path></svg>`;
            icon.setAttribute('style',
                `width:24px!important;
		height:24px!important;
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
                        this.queryText(text.trim(), ev);
                    })
                    .catch(err => {
                        console.error('Failed to read contents: ', err);
                    });
                else {
                    const text = window.getSelection().toString().trim().replace(/\s{2,}/g, ' ');
                    this.queryText(text, ev);
                }
            });
            this._icon = icon;
        }
        pop(ev) {
            const icon = this._icon;
            icon.style.top = ev.pageY + 9 + 'px';
            icon.style.left = ev.pageX + -18 + 'px';
            icon.hidden = !1;
            setTimeout(this.hide.bind(this), 2e3);
        }
        hide() {
            this._icon.hidden = true;
        }
        queryText(text, ev) {
            if (text) {
                this._icon.hidden = true;
                tip.pop(ev);
                nastool(text);
            }
        }
    }
    const icon = new Icon();

    document.addEventListener('mouseup', function (e) {
        var text = window.getSelection().toString().trim();
        GM_log(text);
        if (!text) {
            icon.hide();
            tip.hide();
        }
        else icon.pop(e);
    });

    function nastool(text) {
        tip.showText(`识别中`);
        GM_log(text);
        GM_xmlhttpRequest({
            url: nastoolUrl + "/do?random=" + Math.random(),
            method: "POST",
            responseType: 'json',
            data: `{"cmd":"name_test","data":{"name":"${text}"}}`,
            headers: {
                "user-agent": navigator.userAgent,
                "content-type": "application/json; charset=UTF-8"
            },
            onload: (res) => {
                if (res.status === 200) {
                    GM_log(res.response.data);
                    let html = '';
                    html += res.response.data.type ? `类型：${res.response.data.type}<br>` : '';
                    html += res.response.data.category ? `分类：${res.response.data.category}<br>` : '';
                    html += res.response.data.name ? `名称：${res.response.data.name}<br>` : '';
                    html += res.response.data.title ? `标题：${res.response.data.title}<br>` : '';
                    html += res.response.data.season_episode ? `季集：${res.response.data.season_episode}<br>` : '';
                    html += res.response.data.year ? `年份：${res.response.data.year}<br>` : '';
                    html += res.response.data.team ? `制作：${res.response.data.team}<br>` : '';
                    html += res.response.data.tmdbid ? 'tmdb：<a href="' + res.response.data.tmdblink + '" target="_blank">' + res.response.data.tmdbid + '</a>' : 'tmdb：未识别';
                    tip.showText(html);
                } else {
                    GM_log(res);
                    tip.showText("连接失败");
                }
            }
        });
    }
})();

