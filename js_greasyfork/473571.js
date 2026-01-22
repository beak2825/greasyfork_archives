// ==UserScript==
// @name         网址本地笔记备份(Douban Bilibili URL backup)
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  网址信息本地笔记备份小助手，支持豆瓣、B站、STEAM、网易云音乐, 知乎，备份链接信息并提供搜索功能
// @author       Lepturus
// @match        *://*.douban.com/*
// @match        *://music.163.com/*
// @match        *://*.bilibili.com/video/*
// @match        *://store.steampowered.com/sale/*
// @match        *://store.steampowered.com/app/*
// @match        *://*.zhihu.com/*
// @icon         https://img1.doubanio.com/favicon.ico
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473571/%E7%BD%91%E5%9D%80%E6%9C%AC%E5%9C%B0%E7%AC%94%E8%AE%B0%E5%A4%87%E4%BB%BD%28Douban%20Bilibili%20URL%20backup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473571/%E7%BD%91%E5%9D%80%E6%9C%AC%E5%9C%B0%E7%AC%94%E8%AE%B0%E5%A4%87%E4%BB%BD%28Douban%20Bilibili%20URL%20backup%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    GM_addStyle(`
        :root {
          --primary-color: #00a1d6; /* B站蓝 */
          --secondary-color: #f25d8e; /* 豆瓣粉 */
          --text-color: #333;
          --bg-color: rgba(255, 255, 255, 0.9);
          --border-radius: 6px;
          --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .copyTEXT, .custom-backup-element {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-color);
          transition: all 0.2s ease;
        }
        
        .copyTEXT:hover {
          background-color: rgba(0, 161, 214, 0.05);
          border-radius: 4px;
        }
        
        .search-link-container a {
          display: inline-block;
          margin: 2px 5px 2px 0;
          padding: 4px 8px;
          background: var(--bg-color);
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          text-decoration: none;
          color: #666;
          font-size: 12px;
          transition: all 0.2s ease;
        }
        
        .search-link-container a:hover {
          background: #f5f5f5;
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: var(--shadow);
        }
        
        .copyTEXT[data-copied="true"] {
          background-color: #e8f5e9 !important;
          color: #2e7d32 !important;
          transform: scale(1.02);
        }
        #download-subs-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 4px 12px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: background-color 0.2s ease, transform 0.2s ease;
          }
  
          #download-subs-btn:hover {
            background-color: #007bb5; /* A slightly darker blue */
            transform: translateY(-1px);
          }`);

    function copy(e, isHTML = true) {
        let obj = document.createElement('textarea'); 
        document.body.appendChild(obj);
        obj.value = isHTML ? e.innerText : e.innerHTML;
        obj.select();
        document.execCommand('copy', false);
        obj.remove();
    }

    function searche(title,query,text=title,query2=""){
        let search_urle = document.createElement("a");
        let search_url = query + title+query2;
        search_urle.setAttribute("href", search_url);
        search_urle.innerHTML = text;
        search_urle.setAttribute("target", "_blank");
        return search_urle
    }

    function Douban() {
        let douban_title = document.querySelector('h1').textContent;
        let douban_infos = document.querySelector('#info') || document.querySelector('.item-subject-info');
        let dratings = document.querySelector('.rating_self');
        let dimdb = document.evaluate("//div[@id='info']//span[contains(., 'IMDb')]", document).iterateNext() // <span class="pl">IMDb:</span>

        if(dimdb != null){
            if (!dimdb.nextSibling.textContent.match("→")) {
                let imdb_link = `https://www.imdb.com/title/${dimdb.nextSibling.textContent.trim()}/`;
                // dimdb.nextSibling.replaceWith(`<a href="${imdb_link}" target="_blank">→${dimdb.nextSibling.textContent}</a>`); NOT PARSED
                const imdb_a = document.createElement("a");
                imdb_a.setAttribute("href", imdb_link);
                imdb_a.setAttribute("target", "_blank");
                imdb_a.innerHTML = `→${dimdb.nextSibling.textContent}`
          dimdb.nextSibling.replaceWith(imdb_a);
             }
        }
        console.log("searcdvfsdhp")
        let txt="";
        if (douban_infos) {
            let douban_url = document.createElement("span");
            let douban_rating = document.createElement("span");
            let searchp = document.createElement("div");
            searchp.className = "search-link-container"; 
            console.log("searchp")
            console.log(searchp)

            let url_parse = new URL(window.location.href);
            douban_url.innerHTML = '豆瓣链接：' + url_parse.protocol + "//" + url_parse.hostname  + url_parse.pathname + '</br>' ;
            if (/music\.douban/.test(document.URL)) {
                douban_rating.innerHTML = '豆瓣评分：' + dratings.querySelector('.rating_num').innerText + '(' + dratings.querySelector('.rating_sum').innerText+ ')</br>' + '试听链接：' ;
                searchp.appendChild(searche(douban_title,"https://music.163.com/#/search/m/?s=","网易云搜索","&type=10"));
                searchp.appendChild(searche(douban_title,"https://y.qq.com/n/ryqq/search?w=","QQ音乐搜索","&t=album"));
                searchp.appendChild(searche(douban_title,"https://open.spotify.com/search/","Spotify搜索","/albums"));

            }else if (/\/game\//.test(document.URL)){
                douban_rating.innerHTML = '豆瓣评分：' + dratings.querySelector('.rating_num').innerText + '(' + dratings.querySelector('.rating_sum').innerText+ ')</br>' + '游戏链接：' ;
                searchp.appendChild(searche(douban_title,"https://www.taptap.cn/search/","Taptap搜索"));
                searchp.appendChild(searche(douban_title,"https://store.steampowered.com/search/?term=","STEAM搜索"));
                searchp.appendChild(searche(douban_title," https://indienova.com/search/novas/","Indienova搜索"));
            }
            else{
                douban_rating.innerHTML = '豆瓣评分：' + dratings.querySelector('.rating_num').innerText + '(' + dratings.querySelector('.rating_sum').innerText+ ')</br>';
            }
            searchp.appendChild(document.createElement("br"));
            searchp.appendChild(searche(douban_title,"https://www.baidu.com/s?ie=UTF-8&wd=","百度搜索"));
            searchp.appendChild(searche(douban_title,"https://www.google.com.hk/search?q=","谷歌搜索"));
            searchp.appendChild(searche(douban_title,"https://search.bilibili.com/all?keyword=","B站搜索"));
            searchp.appendChild(searche(douban_title,"https://www.youtube.com/results?search_query=","Youtube搜索"));
            if (!douban_infos.textContent.match("豆瓣链接")) {
                douban_infos.appendChild(douban_url);
                douban_infos.appendChild(douban_rating);
                douban_infos.appendChild(searchp);
            }
        }

    }
function downloadSubtitles() {
    const videoTitleElement = document.querySelector('h1.video-title');
    const fileName = videoTitleElement 
        ? videoTitleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') + '_字幕.txt' 
        : 'Bilibili_Subtitles.txt';
    let allSubtitlesText = [];
    
    const aiSubtitles = document.querySelectorAll('[class*="_Text_"]');
    aiSubtitles.forEach(sub => allSubtitlesText.push(sub.innerText));

    const liveSubtitles = document.querySelectorAll('[class*="bili-subtitle-x-subtitle-panel-text"]');
    liveSubtitles.forEach(sub => allSubtitlesText.push(sub.innerText));

    if (allSubtitlesText.length === 0) {
        alert('未找到可下载的字幕内容。请确保字幕已加载。');
        return;
    }
    const fullText = allSubtitlesText.join('\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function Bilibili() {
    let b_title = document.querySelector('h1');
    let b_infos = document.querySelector('.tag-panel');
    let b_up = document.querySelector('.up-detail-top');
    const tipsElements = document.querySelector('[class*="_Tips_"]');
    if (tipsElements && !document.getElementById('download-subs-btn')) {
        const parentContainer = tipsElements;
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download-subs-btn';
        downloadBtn.textContent = '下载全部字幕';
        downloadBtn.title = '将当前所有已加载的字幕下载为 .txt 文件';

        downloadBtn.addEventListener('click', downloadSubtitles);
        parentContainer.appendChild(downloadBtn);
    }

    document.getElementsByTagName("img").forEach((ele) => { ele.src = ele.src.replace(/@.*\.avif/g,"")}); //replace avif extension

    // 查找并处理AI生成的内容摘要
    let aiSummaryElements = document.querySelectorAll('[class*="_Summary_"]');
    if (aiSummaryElements.length > 0) {
        aiSummaryElements.forEach((summaryElement) => {
            if (!summaryElement.classList.contains('bli_copyTEXT')) {
                summaryElement.classList.add('bli_copyTEXT');
                summaryElement.style.cursor = 'pointer';
                summaryElement.title = '点击复制内容';
            }
        });
    }

    // 查找并处理字幕文本
    let subtitleElements = document.querySelectorAll('[class*="_Text_"]');
    if (subtitleElements.length > 0) {
        subtitleElements.forEach((subElement) => {
            if (!subElement.classList.contains('bli_copyTEXT')) {
                subElement.classList.add('bli_copyTEXT');
                subElement.style.cursor = 'pointer';
                subElement.title = '点击复制字幕';
            }
        });
    }

    // 查找并处理实时字幕（中文和英文）
    let liveSubtitleElements = document.querySelectorAll('[class*="bili-subtitle-x-subtitle-panel-text"]');
    if (liveSubtitleElements.length > 0) {
        liveSubtitleElements.forEach((liveSubElement) => {
            if (!liveSubElement.classList.contains('bli_copyTEXT')) {
                liveSubElement.classList.add('bli_copyTEXT');
                liveSubElement.style.cursor = 'pointer';

                // 根据data-type设置不同的提示
                let dataType = liveSubElement.getAttribute('data-type');
                if (dataType === '0') {
                    liveSubElement.title = '点击复制中文字幕';
                } else if (dataType === '1') {
                    liveSubElement.title = '点击复制英文字幕';
                } else {
                    liveSubElement.title = '点击复制字幕';
                }
            }
        });
    }

    if (b_infos) {
        let bilibili_url = document.createElement("div");
        let bilibili_title = document.createElement("div");
        bilibili_url.classList.add("bli_copyTEXT", "custom-backup-element");
        bilibili_title.classList.add("bli_copyTEXT", "custom-backup-element");
        bilibili_title.style.cssText = `
            padding: 8px 12px;
            background: var(--bg-color);
            border-radius: var(--border-radius);
            margin-bottom: 8px;
            border-left: 3px solid var(--primary-color);
        `;
        
        bilibili_url.style.cssText = `
            padding: 8px 12px;
            background: var(--bg-color);
            border-radius: var(--border-radius);
            border-left: 3px solid var(--primary-color);
        `;

        bilibili_title.innerHTML = ''+b_title.textContent;
        let bilibili_up = b_up.querySelector('a');
        let url_parse = new URL(window.location.href);
        let bilibili_date;
        if (document.querySelector('.pubdate-text')){
            bilibili_date = document.querySelector('.pubdate-text').innerHTML.trim();
        } else {
            bilibili_date = document.querySelector('.pubdate-ip-text').innerHTML.trim().split(' ')[0];
        }
        console.log(bilibili_date);
        let dt = new Date(bilibili_date);
        bilibili_date = dt.getFullYear() + "." + (dt.getMonth()+1);
        bilibili_url.innerHTML = 'Bilibili链接：' + url_parse.protocol + "//" + url_parse.hostname+ url_parse.pathname + "   BY:" + bilibili_up.outerHTML + "   " + bilibili_date;

        let kws = document.getElementsByClassName("bli_copyTEXT");
        for (let i = 0; i < kws.length; i++) {
            kws[i].onclick = function () {
                let originalHTML = kws[i].innerHTML;
                let originalBG = kws[i].style.backgroundColor;
                
                copy(kws[i]);
                
                kws[i].innerHTML = "✓ 已复制";
                kws[i].style.backgroundColor = "#e8f5e9";
                kws[i].style.color = "#2e7d32";
                
                window.setTimeout(function () {
                    kws[i].innerHTML = originalHTML;
                    kws[i].style.backgroundColor = originalBG;
                    kws[i].style.color = "";
                }, 1000);
            }
        }

        if (!b_infos.lastElementChild.classList.contains('bli_copyTEXT')) {
            b_infos.appendChild(document.createElement("br"));
            b_infos.appendChild(document.createElement("br"));
            b_infos.appendChild(bilibili_title);
            b_infos.appendChild(bilibili_url);
        }
    }
}

    function NetEaseMusic() {
    const linkc = document.querySelector('.cntc')
    linkc.classList.add("search-link-container");
    if (/album/.test(document.URL) && linkc) {
     if (!linkc.textContent.match("豆瓣")) {
    let singer = document.querySelector('p.intr>span').textContent
    let album = document.querySelector('.tit').textContent.replaceAll("\n","")  || document.querySelector('.tit>h2')
    let alum_title = singer + "-" + album


    linkc.appendChild(searche(alum_title,"https://search.douban.com/music/subject_search?search_text=","豆瓣搜索","&cat=1003"));
         linkc.appendChild(searche(alum_title,"https://y.qq.com/n/ryqq/search?w=","QQ搜索","&t=album"));
         linkc.appendChild(searche(alum_title,"https://open.spotify.com/search/","Spotify搜索","/albums"));
         linkc.appendChild(searche(alum_title,"https://www.baidu.com/s?ie=UTF-8&wd=","百度搜索"));
         linkc.appendChild(searche(alum_title,"https://www.google.com.hk/search?q=","谷歌搜索"));
         linkc.appendChild(searche(alum_title,"https://search.bilibili.com/all?keyword=","B站搜索"));
         linkc.appendChild(searche(alum_title,"https://www.youtube.com/results?search_query=","Youtube搜索"));
    }
    }
    }

    function SteamSale() {
        const gameItems = document.querySelectorAll('div.Panel.Focusable div.ItemCount_1');

        if (gameItems.length === 0) {
            return;
        }

        gameItems.forEach((item, index) => {
            if (item.querySelector('.steam-game-name')) {
                return; // 如果已经添加过游戏名显示，跳过
            }

            // 获取游戏名
            const imgElement = item.querySelector('img');
            if (imgElement && imgElement.alt && imgElement.alt.trim()) {
                const gameName = imgElement.alt.trim();

                const saleTagBlock = item.querySelector('div.SaleTagBlockCtn');
                if (saleTagBlock && !item.querySelector('.steam-game-name')) {
                    const gameNameElement = document.createElement('div');
                    gameNameElement.className = 'steam-game-name copyTEXT';
                    gameNameElement.textContent = gameName;
                    gameNameElement.style.cssText = `
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: var(--bg-color);
                    border: 1px solid #e0e0e0;
                    border-radius: var(--border-radius);
                    font-size: 13px;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    word-break: break-word;
                    line-height: 1.4;
                    border-left: 3px solid #1a5d8a;
                `;
                        gameNameElement.addEventListener('mouseenter', function() {
                            this.style.background = 'rgba(42, 120, 170, 0.5)';
                            this.style.borderColor = '#2a78aa';
                        });

                        gameNameElement.addEventListener('mouseleave', function() {
                            this.style.background = 'rgba(26, 93, 138, 0.3)';
                            this.style.borderColor = '#1a5d8a';
                        });

                        saleTagBlock.parentNode.insertBefore(gameNameElement, saleTagBlock.nextSibling);
                        const searchContainer = document.createElement('div');
                        searchContainer.className = "search-link-container";
                        searchContainer.style.cssText = `
                            margin-top: 5px;
                            display: flex;
                            flex-wrap: wrap;
                            gap: 5px;
                            font-size: 11px;
                        `;
                        searchContainer.appendChild(searche(gameName, "https://www.baidu.com/s?ie=UTF-8&wd=", "百度"));
                        searchContainer.appendChild(searche(gameName, "https://www.google.com.hk/search?q=", "谷歌"));
                        searchContainer.appendChild(searche(gameName, "https://search.bilibili.com/all?keyword=", "B站"));
                        searchContainer.appendChild(searche(gameName, "https://www.youtube.com/results?search_query=", "Youtube"));
                        searchContainer.appendChild(searche(gameName, "https://www.xiaoheihe.cn/app/search?q=", "小黑盒"));

                        // 将搜索容器插入到游戏名元素后面
                        gameNameElement.parentNode.insertBefore(searchContainer, gameNameElement.nextSibling);
                        saleTagBlock.parentNode.insertBefore(gameNameElement, saleTagBlock.nextSibling);
                        saleTagBlock.parentNode.insertBefore(searchContainer, gameNameElement.nextSibling);

                        gameNameElement.onclick = function () {
                            let originalText = this.innerHTML;
                            copy(this);
                            this.innerHTML = "Copied";
                            window.setTimeout(function () {
                                this.innerHTML = originalText;
                            }.bind(this), 1500);
                        };
            }}
        });
    }

    function SteamApp() {
        const glance = document.querySelector('.glance_ctn');
        if (!glance || glance.querySelector('.steam-backup-tools')) return;

        let title = document.querySelector('#appHubAppName')?.textContent.trim() || document.querySelector('.apphub_AppName')?.textContent.trim();
        if (!title) return;

        // Create Container
        const toolsDiv = document.createElement('div');
        toolsDiv.className = 'steam-backup-tools';
        toolsDiv.style.marginTop = '15px';

        // 1. Search Buttons
        const searchDiv = document.createElement('div');
        searchDiv.className = 'search-link-container';
        searchDiv.appendChild(searche(title, "https://www.baidu.com/s?ie=UTF-8&wd=", "百度搜索"));
        searchDiv.appendChild(searche(title, "https://www.google.com.hk/search?q=", "谷歌搜索"));
        searchDiv.appendChild(searche(title, "https://www.douban.com/search?source=suggest&q=", "豆瓣搜索"));
        searchDiv.appendChild(searche(title, "https://www.xiaoheihe.cn/app/search?q=", "小黑盒搜索"));
        
        // 2. Action Buttons Container
        const btnsDiv = document.createElement('div');
        btnsDiv.style.marginTop = '8px';

        // Button Style (Matching Bilibili style)
        const btnStyle = `
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 5px 12px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            margin-right: 10px;
            transition: opacity 0.2s;
        `;

        // Copy Tags Button
        const copyTagsBtn = document.createElement('button');
        copyTagsBtn.textContent = "复制热门标签";
        copyTagsBtn.style.cssText = btnStyle;
        copyTagsBtn.onclick = function() {
            let tags = [];
            document.querySelectorAll('.popular_tags .app_tag').forEach(tag => {
                const t = tag.textContent.trim();
                if (t && t !== '+') tags.push(t);
            });
            copy({ innerText: tags.join(' ') });
            
            let original = this.textContent;
            this.textContent = "✓ 已复制";
            setTimeout(() => { this.textContent = original; }, 1000);
        };

        // Copy All Info Button
        const copyInfoBtn = document.createElement('button');
        copyInfoBtn.textContent = "复制游戏信息";
        copyInfoBtn.style.cssText = btnStyle;
        copyInfoBtn.onclick = function() {
            let releaseDate = document.querySelector('.release_date .date')?.textContent.trim() || "";
            let dev = "", pub = "";
            document.querySelectorAll('.dev_row').forEach(row => {
                let sub = row.querySelector('.subtitle')?.textContent;
                let val = row.querySelector('.summary a')?.textContent.trim();
                if (sub && sub.includes("开发")) dev = val;
                if (sub && sub.includes("发行")) pub = val;
            });
            let desc = document.querySelector('.game_description_snippet')?.textContent.trim() || "";
            let appIdMatch = window.location.href.match(/\/app\/(\d+)/);
            let url = appIdMatch ? `https://store.steampowered.com/app/${appIdMatch[1]}` : window.location.href.split('?')[0];
             // 提取封面图并生成Markdown格式
            let headerImg = document.querySelector('img.game_header_image_full');
            let coverMd = headerImg ? `![${title}](${headerImg.src})` : "";            
            let tags = [];
            document.querySelectorAll('.popular_tags .app_tag').forEach(tag => {
                const t = tag.textContent.trim();
                if (t && t !== '+') tags.push(t);
            });

            let info = `${coverMd}\n**游戏名**：${title}\n**发行日期**：${releaseDate}\n**开发者**：${dev}\n**发行商**：${pub}\n**Steam链接**：${url}\n**游戏标签**：${tags.join(' ')}\n**游戏简介**：${desc}`;
            
            copy({ innerText: info });

            let original = this.textContent;
            this.textContent = "✓ 已复制";
            setTimeout(() => { this.textContent = original; }, 1000);
        };
        const copyDescBtn = document.createElement('button');
        copyDescBtn.textContent = "复制简介(MD)";
        copyDescBtn.style.cssText = btnStyle;
        copyDescBtn.onclick = function() {
            const descContainer = document.querySelector('#game_area_description');
            if (!descContainer) {
                alert("未找到游戏简介区域");
                return;
            }

            let clone = descContainer.cloneNode(true);
            let header = clone.querySelector('h2');
            if (header && header.textContent.includes("关于此游戏")) {
                header.remove();
            }
            clone.querySelectorAll('img, video, .bb_img_ctn, .bb_img_icons, script, style').forEach(el => el.remove());
            clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
            clone.querySelectorAll('p, div.bb_paragraph, h3, h4').forEach(el => {
                el.append('\n\n');
            });
            let text = clone.textContent;
            text = text.replace(/\n\s*\n/g, '\n\n').trim();

            copy({ innerText: text });

            let original = this.textContent;
            this.textContent = "✓ 已复制";
            setTimeout(() => { this.textContent = original; }, 1000);
        };

        btnsDiv.appendChild(copyTagsBtn);
        btnsDiv.appendChild(copyInfoBtn);
        btnsDiv.appendChild(copyDescBtn); 
        toolsDiv.appendChild(searchDiv);
        toolsDiv.appendChild(btnsDiv);
        glance.appendChild(toolsDiv);
    }

    if (/douban/.test(document.URL)) {
        setInterval(Douban, 2000);
    }
    if (/music\.163/.test(document.URL)) {
        setInterval(NetEaseMusic, 1500);
    }
    if (/bilibili/.test(document.URL)) {
        let lastUrl = window.location.href; // last URL as Bli collection URL changes
        setInterval(function(){ let currentUrl = window.location.href; // current URL
                               Bilibili();
                               if(currentUrl !== lastUrl){
                                   for (let i = 0; i < 4; i++) {
                                   document.querySelector('.tag-panel').lastElementChild.remove();
                                   }
                                   lastUrl = currentUrl; }
                              },
                    1500);

    }

    if (/store\.steampowered\.com\/sale/.test(document.URL)) {
        setInterval(SteamSale, 2000);
    }
    if (/store\.steampowered\.com\/app/.test(document.URL)) {
        setInterval(SteamApp, 2000);
    }
})();