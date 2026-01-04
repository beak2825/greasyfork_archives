// ==UserScript==
// @name        Pixiv 小说下载/小说系列打包下载
// @name:en     Pixiv Novel download/Novel series batch download
// @name:zh-cn  Pixiv 小说下载/小说系列打包下载
// @name:zh-tw  Pixiv 小說下載/小說系列打包下載
// @namespace   https://pixiv.net/
// @version     1.1
// @author      huyaoi
// @description Pixiv 下载小说/小说系列打包下载
// @description:en Pixiv Novel download/Novel series download
// @description:zh-cn Pixiv 下载小说/小说系列
// @description:zh-tw Pixiv 下載小說/小說系列
// @match       https://www.pixiv.net/*
// @icon        data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-end
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/jszip@2.6.0/dist/jszip.min.js
// @require     https://scriptcat.org/lib/513/2.0.0/ElementGetter.js#sha256=KbLWud5OMbbXZHRoU/GLVgvIgeosObRYkDEbE/YanRU=
// @downloadURL https://update.greasyfork.org/scripts/502043/Pixiv%20Novel%20downloadNovel%20series%20batch%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/502043/Pixiv%20Novel%20downloadNovel%20series%20batch%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.self !== window.top) {
        return;
    }
    const apiEndpoint = "https://www.pixiv.net/ajax";

    const translations = {
        en: {
            dlSeries:"Download this novel series",
            dlSeriesWithInfo:"Download this novel series (With information)",
            dlSeriesNotID:"The current page is not a novel series page!",
            dlNovel:"Download this novel",
            dlNovelWithInfo:"Download this novel (With information)",
            dlNovelNotID:"The current page is not a novel page!",
            dlSeriesMerge:"Download this series (combined into one file without any information)",
            dlSeriesMergeWithInfo:"Download this series (combined into one file)",
            panel: 'File Naming Convention'
        },
        zh: {
            dlSeries:"打包下载这个小说系列 (仅内容)",
            dlSeriesWithInfo:"打包下载这个小说系列 (带信息)",
            dlSeriesNotID:"当前页面不是小说系列页面！",
            dlNovel:"下载此小说 (仅内容)",
            dlNovelWithInfo:"下载此小说 (带信息)",
            dlNovelNotID:"当前页面不是小说页面!",
            dlSeriesMerge:"下载这个小说系列（合并为一个文件并且不带任何信息）",
            dlSeriesMergeWithInfo:"下载这个小说系列（合并为一个文件）",
            panel: '文件名设定'
        }
    };

    function translate(key) {
        if(navigator.language.startsWith("zh")){
            return translations['zh'][key];
        }else{
            return translations['en'][key];
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
.btn-style {
    color: var(--charcoal-text5-hover);
    background-color: var(--charcoal-brand-hover);
    font-size: 14px;
    line-height: 1;
    font-weight: bold;
    border-radius: 20px;
    -moz-box-pack: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    border-style: none;
    margin-left: 8px;
    padding: 0 24px;
}

.btn-style-novel {
    color: var(--charcoal-text5-hover);
    background-color: var(--charcoal-brand-hover);
    font-size: 14px;
    line-height: 30px;
    font-weight: bold;
    border-radius: 20px;
    -moz-box-pack: center;
    cursor: pointer;
    user-select: none;
    border-style: none;
    margin-left: 8px;
    padding: 0 24px;
    display: flex;
}

.novel-dl-panel {
    position: fixed;
    top: 80px;
    right: 40px;
    width: 280px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 99999;
    padding: 12px;
    font-family: "Segoe UI", sans-serif;
}
.novel-dl-panel input {
    width: 100%;
    box-sizing: border-box;
    margin-top: 5px;
    margin-bottom: 8px;
    padding: 4px;
    border: 1px solid #aaa;
    border-radius: 5px;
}

`;
    document.head.appendChild(style);

    window.onhashchange=function(event){
        if(GetURLQueryValue("id",event.newURL) == null && event.newURL.split('/series/').length != 2){
            return;
        }
        elmGetter.each('section>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)', document, ele => {
            let element = ele.lastChild;
            let btn = document.createElement('button');
            btn.setAttribute('class', 'btn-style');
            btn.addEventListener('mouseup',function(){
                DownloadSeries(false);
            });
            btn.innerText = translate('dlSeries');
            element.appendChild(btn);
        });

        elmGetter.each('section>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)', document, ele => {
            let element = ele.lastChild;
            let btn = document.createElement('button');
            btn.setAttribute('class', 'btn-style-novel');
            btn.addEventListener('mouseup',function(){
                DownloadNovel(false);
            });
            btn.innerText = translate('dlNovel');
            element.appendChild(btn);
        });
    }

    if(GetQueryValue("id") != null || window.location.href.split('/series/').length == 2){
        elmGetter.each('section>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)', document, ele => {
            let element = ele.lastChild;
            let btn = document.createElement('button');
            btn.setAttribute('class', 'btn-style');
            btn.addEventListener('mouseup',function(){
                DownloadSeries(false);
            });
            btn.innerText = translate('dlSeries');
            element.appendChild(btn);
        });

        elmGetter.each('section>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)', document, ele => {
            let element = ele.lastChild;
            let btn = document.createElement('button');
            btn.setAttribute('class', 'btn-style-novel');
            btn.addEventListener('mouseup',function(){
                DownloadNovel(false);
            });
            btn.innerText = translate('dlNovel');
            element.appendChild(btn);
        });
    }

    async function fetchJson(url) {
        return await fetch(url).then(result => result.json());
    }

    function GetQueryValue(queryName) {
        let query = decodeURI(window.location.search.substring(1));
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] === queryName) { return pair[1]; }
        }
        return null;
    }

    function GetURLQueryValue(queryName,url) {
        if(url.lastIndexOf('?') == -1){
            return;
        }
        let query = decodeURI(url.substring(url.lastIndexOf('?') + 1,url.length));
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] === queryName) { return pair[1]; }
        }
        return null;
    }

    function CreateHeader(data){
        //替换掉"，"和"/"
        let tags = data.tags.tags.map(tag => tag.tag).join(", ");
        tags = tags.replaceAll("，",", ");
        tags = tags.replaceAll("/",", ");
        return `id: ${data.id}
user: ${data.userName} [${data.userId}]
title: ${data.title}
lang: ${data.language}
tags: ${tags}
count: ${data.characterCount}
description: ${data.description}
create: ${data.createDate}
update: ${data.uploadDate}
content:
${data.content}
`
    }

    function CreateSeriesHeader(data){
        //替换掉"，"和"/"
        let tags = data.tags.map(tag => tag.tag).join(", ");
        tags = tags.replaceAll("，",", ");
        tags = tags.replaceAll("/",", ");
        return `id: ${data.id}
user: ${data.userName} [${data.userId}]
title: ${data.title}
lang: ${data.language}
tags: ${tags}
count: ${data.characterCount}
caption: ${data.caption}
create: ${data.createDate}
update: ${data.uploadDate}
content:

`
    }

    function CreateSeriesNovelHeader(index,data){
        return `---
#${index} ${data.title}
---
`
    }

    function DownloadFile(content,filename){
        const blob = new Blob([content]);
        const t = document.createElement('a');
        const href = URL.createObjectURL(blob);
        t.setAttribute('href', href);
        t.setAttribute('download', filename);
        t.click();
        window.URL.revokeObjectURL(href);
    }

    async function DownloadNovel(withInfo){
        if(GetQueryValue("id") == null){
            alert(translate('dlNovelNotID'));
            return;
        }
        let novelID = GetQueryValue("id");

        const data = await GetNovel(novelID);
        if(data != null){
            let Content = "";
            if(withInfo){
                Content = CreateHeader(data);
            }else{
                Content = data.content;
            }
            let template = GM_getValue('novelname', '%novelID%_%novelTitle%');
            let name = renderTemplate(template, {
                            novelID: data.id,
                            novelUserID: data.userId,
                            novelTitle: data.title,
                            novelUserName: data.userName,
                        });
            DownloadFile(Content,`${name}.txt`);
        }
    }

    async function GetNovel(novelID){
        let url = apiEndpoint + `/novel/${novelID}`;

        return await fetchJson(url).then(data => {
            return data.body;
        })
        .catch(err => {
            console.log("获取失败");
            console.log(err);
            return null;
        });
    }

    async function GetSeriesContent(id,last){
        let contentUrl = apiEndpoint + `/novel/series_content/${id}?limit=30&last_order=${last}&order_by=asc`;
        return await fetchJson(contentUrl).then(data => {
            return data.body;
        })
        .catch(err => {
            console.log("获取失败");
            console.log(err);
            return null;
        });
    }

    async function DownloadSeries(withInfo){
        let tmp = window.location.href.split('/series/');
        if(tmp.length != 2){
            alert(translate('dlSeriesNotID'));
            return;
        }
        let seriesID = tmp[1];

        let novelInfoUrl = apiEndpoint + `/novel/series/${seriesID}`;
        let displaySeriesContentCount = 0;
        let title = "";

        await fetchJson(novelInfoUrl).then(data => {
            displaySeriesContentCount = data.body.displaySeriesContentCount || 0;
            title = data.body.title;
        })
        .catch(err => {
            console.log("获取失败");
            console.log(err);
            return;
        });

        console.log(displaySeriesContentCount);
        if(displaySeriesContentCount == 0){
            return;
        }

        let zip = new JSZip();
        let index = 0;
        let template = GM_getValue('seriesname', '%seriesID%_%seriesIndex%_%novelID%_%novelTitle%');

        let maxPage = Math.ceil(displaySeriesContentCount/30);
        for(let o = 0;o < maxPage;o++){
            let data = await GetSeriesContent(seriesID,o * 30);
            if(data!=null){
                for(let i = 0;i <data.page.seriesContents.length;i ++){
                    let novel = await GetNovel(data.page.seriesContents[i].id);
                    if(novel != null){
                        let Content = "";
                        if(withInfo){
                            Content = CreateHeader(novel);
                        }else{
                            Content = novel.content;
                        }
                        let name = renderTemplate(template, {
                            seriesID: seriesID,
                            seriesName: title,
                            seriesIndex: index,
                            novelID: novel.id,
                            novelUserID: novel.userId,
                            novelTitle: novel.title,
                            novelUserName: novel.userName,
                        });
                        await zip.file(`${name}.txt`, Content);
                        index++;
                        if(index >= displaySeriesContentCount){
                            console.log("Start");
                            DownloadFile(zip.generate({type:"blob"}), `${seriesID}_${title}.zip`);
                        }
                    }
                }
            }
        }
    }

    async function DownloadSeriesMarge(withInfo){
        let tmp = window.location.href.split('/series/');
        if(tmp.length != 2){
            alert(translate('dlSeriesNotID'));
            return;
        }
        let seriesID = tmp[1];

        let novelInfoUrl = apiEndpoint + `/novel/series/${seriesID}`;
        let displaySeriesContentCount = 0;
        let title = "";
        let seriesHeader = "";

        await fetchJson(novelInfoUrl).then(data => {
            displaySeriesContentCount = data.body.displaySeriesContentCount || 0;
            title = data.body.title;
            seriesHeader = CreateSeriesHeader(data.body);
        })
        .catch(err => {
            console.log("获取失败");
            console.log(err);
            return;
        });

        console.log(displaySeriesContentCount);
        if(displaySeriesContentCount == 0){
            return;
        }

        let novelContent = "";

        let index = 0;

        let maxPage = Math.ceil(displaySeriesContentCount/30);
        for(let o = 0;o < maxPage;o++){
            let data = await GetSeriesContent(seriesID,o * 30);
            if(data!=null){
                for(let i = 0;i <data.page.seriesContents.length;i ++){
                    let novel = await GetNovel(data.page.seriesContents[i].id);
                    if(novel != null){
                        if(withInfo && index == 0){
                            novelContent += seriesHeader;
                        }
                        if(withInfo){
                            novelContent += CreateSeriesNovelHeader(index+1,novel.body);
                        }
                        novelContent += novel.content;
                        index++;
                        if(index >= displaySeriesContentCount){
                            console.log("Start");
                            DownloadFile(novelContent, `${seriesID}_${title}.txt`);
                        }
                    }
                }
            }
        }
    }

    const validseriesVars = ["novelID", "novelUserID", "novelTitle", "novelUserName", "seriesID", "seriesName", "seriesIndex"];
    const validnovelVars = ["novelID", "novelUserID", "novelTitle", "novelUserName"];

    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'novel-dl-panel';
        panel.innerHTML = `
        <h3>文件命名设置</h3>
            <label>模板：</label>
            <br />
            <div>%novelID% 小说ID</div>
            <div>%novelUserID% 小说作者ID</div>
            <div>%novelTitle% 小说名称</div>
            <div>%novelUserName% 小说作者ID</div>
            <div>%seriesID% 小说合集ID</div>
            <div>%seriesName% 小说合集名称</div>
            <div>%seriesIndex% 小说在合集中的顺序</div>
            <br />
            <div>单独下载的小说文件名（无需.txt后缀）</div>
            <input type="text" id="dlnovel-filename" placeholder="%novelID%_%novelTitle%" />
            <div>下载合集时的小说文件名（无需.txt后缀）</div>
            <input type="text" id="dlseries-filename" placeholder="%seriesID%_%seriesIndex%_%novelID%_%novelTitle%" />
        <div style="text-align:right;">
            <button class="btn-style" id="save-template">保存</button>
            <button class="btn-style" id="close-panel">关闭</button>
        </div>
        `;
        document.body.appendChild(panel);

        const novelinput = panel.querySelector('#dlnovel-filename');
        novelinput.value = GM_getValue('novelname', '%novelID%_%novelTitle%');
        const seriesinput = panel.querySelector('#dlseries-filename');
        seriesinput.value = GM_getValue('seriesname', '%seriesID%_%seriesIndex%_%novelID%_%novelTitle%');

        // 保存
        panel.querySelector('#save-template').addEventListener('click', () => {
            let t1 = ["novelID"];
            let t2 = ["seriesID", "seriesIndex"];
            let r1 = validateTemplate(novelinput.value, validnovelVars,t1);
            let r2 = validateTemplate(seriesinput.value,validseriesVars,t2);
            if(!r1.ok){
                alert(r1.message);
                return;
            }
            if(!r2.ok){
                alert(r2.message);
            }
            GM_setValue('novelname', novelinput.value);
            GM_setValue('seriesname', seriesinput.value);
            alert('已保存模板');
        });

        // 关闭
        panel.querySelector('#close-panel').addEventListener('click', () => {
            panel.remove();
        });
    }

    function renderTemplate(template, context) {
        return template.replace(/%(\w+)%/g, (_, key) => context[key] || '');
    }

    function validateTemplate(template, validVars, requiredVars = []) {
        // 只把形如 %name%（变量名由字母数字下划线组成）当作完整变量
        const varRegex = /%([A-Za-z0-9_]+)%/g;
        const matches = [];
        const matchRanges = [];
        let m;

        while ((m = varRegex.exec(template)) !== null) {
            matches.push(m[1]);
            // m.index 是匹配起始位置，varRegex.lastIndex 是匹配结束后的索引
            matchRanges.push({ start: m.index, end: varRegex.lastIndex - 1 });
        }

        // 标记被完整匹配覆盖的字符范围
        const covered = new Array(template.length).fill(false);
        for (const r of matchRanges) {
            for (let i = r.start; i <= r.end; i++) covered[i] = true;
        }

        // 查找不在完整匹配范围内的孤立 '%'（即未配对的 %）
        const unmatchedSnippets = [];
        for (let i = 0; i < template.length; i++) {
            if (template[i] === '%' && !covered[i]) {
            // 截取示例片段便于提示（前后各最多 10 个字符）
            const s = Math.max(0, i - 10);
            const e = Math.min(template.length, i + 11);
            unmatchedSnippets.push(template.slice(s, e));
            }
        }
        if (unmatchedSnippets.length > 0) {
            // 去重示例并返回错误
            const uniq = [...new Set(unmatchedSnippets)];
            return {
            ok: false,
            message: `检测到未配对的 '%' 或不完整变量边界（示例）：${uniq.join('，')}`
            };
        }

        // 检查非法变量（完整形式但是变量名未在允许列表中）
        const invalids = [...new Set(matches.filter(v => !validVars.includes(v)))];
        if (invalids.length > 0) {
            return {
            ok: false,
            message: `发现无效变量：${invalids.map(v => '%' + v + '%').join(', ')}；允许的有：${validVars.map(v => '%' + v + '%').join(', ')}`
            };
        }

        // 检查必需变量是否存在
        const missing = requiredVars.filter(v => !matches.includes(v));
        if (missing.length > 0) {
            return {
            ok: false,
            message: `缺少必需变量：${missing.map(v => '%' + v + '%').join(', ')}`
            };
        }

        return { ok: true, message: '模板合法', matches: [...new Set(matches)] };
    }

    GM_registerMenuCommand(translate('dlNovel'), () => DownloadNovel(false));
    GM_registerMenuCommand(translate('dlSeries'), () => DownloadSeries(false));
    GM_registerMenuCommand(translate('dlNovelWithInfo'), () => DownloadNovel(true));
    GM_registerMenuCommand(translate('dlSeriesWithInfo'), () => DownloadSeries(true));
    GM_registerMenuCommand(translate('dlSeriesMerge'), () => DownloadSeriesMarge(false));
    GM_registerMenuCommand(translate('dlSeriesMergeWithInfo'), () => DownloadSeriesMarge(true));
    GM_registerMenuCommand(translate('panel'), () => createPanel());
})();