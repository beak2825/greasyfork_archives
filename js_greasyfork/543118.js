// ==UserScript==
// @name         CZZYMovie 全量提取 & 上传（分类页+详情页）
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  在分类列表页给每个影片项添加“提取 & 上传”按钮，详情页保持原有的提取按钮和弹窗，封面走代理，总/当前集数、原始/真实地址一并提取，完成后可一键上传。
// @match        https://www.czzymovie.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.czzymovie.com
// @connect      czzymovie.com
// @connect      api.zicc.cc
// @connect      ccj.nssc.cc
// @connect      www.kdj.one
// @connect      kdj.one
// @downloadURL https://update.greasyfork.org/scripts/543118/CZZYMovie%20%E5%85%A8%E9%87%8F%E6%8F%90%E5%8F%96%20%20%E4%B8%8A%E4%BC%A0%EF%BC%88%E5%88%86%E7%B1%BB%E9%A1%B5%2B%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543118/CZZYMovie%20%E5%85%A8%E9%87%8F%E6%8F%90%E5%8F%96%20%20%E4%B8%8A%E4%BC%A0%EF%BC%88%E5%88%86%E7%B1%BB%E9%A1%B5%2B%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uploadUrl      = 'https://www.kdj.one/up.php';              // ← 根据实际修改
    const coverProxyBase = 'https://ccj.nssc.cc/fqts/img.php?image_url=';

    //—— 创建公共弹窗 UI —————————————————————————
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position:'fixed', top:'50px', right:'10px',
        width:'500px', height:'580px', background:'#fff',
        border:'1px solid #ccc', borderRadius:'4px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
        padding:'10px', overflow:'auto',
        zIndex:9999, display:'none'
    });
    document.body.appendChild(overlay);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, { position:'absolute', top:'5px', right:'5px', fontSize:'16px', cursor:'pointer' });
    closeBtn.onclick = () => overlay.style.display = 'none';
    overlay.appendChild(closeBtn);

    const sel = document.createElement('select');
    ['电影','国剧','美剧','韩剧','日剧'].forEach(cat => {
        const o = document.createElement('option');
        o.value = cat; o.textContent = cat;
        sel.appendChild(o);
    });
    overlay.appendChild(sel);

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = '上传到数据库';
    Object.assign(uploadBtn.style, { marginLeft:'10px', padding:'4px 8px', cursor:'pointer' });
    overlay.appendChild(uploadBtn);

    const ta = document.createElement('textarea');
    ta.readOnly = true;
    Object.assign(ta.style, {
        width:'100%', height:'calc(100% - 100px)', marginTop:'10px',
        boxSizing:'border-box', fontFamily:'monospace', resize:'none'
    });
    overlay.appendChild(ta);

    let movieData = {};

    //—— 判断页面类型 ——列表页 or 详情页 —————————
    if (/^\/movie\/\d+\.html$/.test(location.pathname)) {
        // 详情页：在右上角挂主提取按钮
        const btn = document.createElement('button');
        btn.textContent = '提取 & 上传';
        Object.assign(btn.style, {
            position:'fixed', top:'10px', right:'10px',
            padding:'6px 12px', background:'#28BE81',
            color:'#fff', border:'none', borderRadius:'4px',
            cursor:'pointer', zIndex:9999
        });
        document.body.appendChild(btn);
        btn.addEventListener('click', () => extractFromUrl(location.href));
    } else {
        // 分类列表页：给每个<li>添加提取按钮
        const items = document.querySelectorAll('.bt_img ul li');
        items.forEach(item => {
            const a = item.querySelector('a[href*="/movie/"]');
            if (!a) return;
            const b = document.createElement('button');
            b.textContent = '提取 & 上传';
            Object.assign(b.style, {
                display:'block', margin:'6px auto',
                padding:'4px 8px', background:'#28BE81',
                color:'#fff', border:'none',
                borderRadius:'3px', cursor:'pointer'
            });
            b.addEventListener('click', () => extractFromUrl(a.href));
            item.appendChild(b);
        });
    }

    //—— 核心：从任意详情页 URL 拉取并解析 —————————
    function extractFromUrl(url) {
        overlay.style.display = 'block';
        ta.value = `正在请求：${url}`;
        GM_xmlhttpRequest({
            method: 'GET', url,
            onerror() {
                ta.value = '❌ 请求详情页失败';
            },
            onload(res) {
                parseDetailHtml(res.responseText);
            }
        });
    }

    function parseDetailHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        movieData = {}; // 重置

        // 基础字段
        movieData.name = (doc.querySelector('.moviedteail_tt h1')||{}).textContent.trim();
        const yearLi = Array.from(doc.querySelectorAll('.moviedteail_list li'))
                              .find(li=>/年份[：:]/.test(li.textContent));
        movieData.release_date = yearLi?(yearLi.querySelector('a')||{}).textContent.trim():'';
        // 豆瓣ID
        let did = '';
        const l1 = doc.querySelector('a[href*="/doubanapp/dispatch?uri=/tv/"]');
        const l2 = doc.querySelector('a.dbpingfen[href*="movie.douban.com/subject/"]');
        if (l1) did = (l1.href.match(/\/tv\/(\d+)/)||[])[1]||'';
        else if (l2) did = (l2.href.match(/subject\/(\d+)/)||[])[1]||'';
        movieData.douban_id = did;
        // 简介
        movieData.vod_content = (doc.querySelector('.yp_context')||{}).innerText
                                  .trim().replace(/\r?\n\s*/g,'\n');

        // 封面：先拿原始URL，再走代理
        let raw = (doc.querySelector('.dyimg.fl img')||{}).src||'';
        let part = raw.includes('src=')? raw.split('src=')[1] : raw;
        if (!/^https?:\/\//.test(part)) part = 'https://'+part;

        ta.value = '正在获取封面代理地址…';
        GM_xmlhttpRequest({
            method:'GET',
            url: coverProxyBase + encodeURIComponent(part),
            onerror() {
                movieData.cover_image = part;
                continueExtraction(doc);
            },
            onload(res) {
                try { movieData.cover_image = JSON.parse(res.responseText).url; }
                catch { movieData.cover_image = part; }
                continueExtraction(doc);
            }
        });
    }

    function continueExtraction(doc) {
        // 播放数据 & 当前集数
        const anchors = Array.from(doc.querySelectorAll('.paly_list_btn a'));
        movieData.current_episodes = anchors.length;
        const nums = anchors.map((a,i)=> String((a.textContent.match(/\d+/)||[i+1])[0]).padStart(2,'0'));
        const origText = anchors.map((a,i)=>`第${nums[i]}集$${a.href}`).join('#');
        movieData.video_data = origText;

        // 初始化弹窗内容
        const baseInfo = [
            `封面: ${movieData.cover_image}`,
            `名称: ${movieData.name}`,
            `年份: ${movieData.release_date}`,
            `豆瓣ID: ${movieData.douban_id}`,
            '介绍:',
            movieData.vod_content,
            '',
            `当前集数: ${movieData.current_episodes}`,
            '总集数: 查询中…'
        ];
        ta.value = baseInfo.join('\n');

        // 去豆瓣 API 拿总集数
        GM_xmlhttpRequest({
            method:'GET',
            url: `https://api.zicc.cc/douban/?id=${movieData.douban_id}&key=demo123123`,
            onerror() {
                baseInfo[8] = '总集数: 0 （查询失败）';
                ta.value = baseInfo.join('\n');
                fetchRealAddresses(anchors, nums, origText, baseInfo);
            },
            onload(res) {
                try { movieData.total_episodes = parseInt(JSON.parse(res.responseText).data.vod_jisu)||0; }
                catch { movieData.total_episodes = 0; }
                baseInfo[8] = `总集数: ${movieData.total_episodes}`;
                ta.value = baseInfo.join('\n') + '\n\n开始提取真实地址…';
                fetchRealAddresses(anchors, nums, origText, baseInfo);
            }
        });
    }

    function fetchRealAddresses(anchors, nums, origText, baseInfo) {
        const realList = [];
        anchors.forEach((a, idx) => {
            GM_xmlhttpRequest({
                method:'GET',
                url: a.href,
                onload(resp) {
                    let src = '';
                    try {
                        const d2 = new DOMParser().parseFromString(resp.responseText, 'text/html');
                        src = (d2.querySelector('iframe.viframe')||{}).src || '';
                    } catch {}
                    realList[idx] = `第${nums[idx]}集$${src}`;
                    // 全部拿到后更新弹窗
                    if (realList.filter(x=>x).length === anchors.length) {
                        ta.value = baseInfo.join('\n')
                                  + '\n\n原始地址\n' + origText
                                  + '\n\n真实地址\n' + realList.join('#');
                    }
                }
            });
        });
    }

    //—— 上传按钮逻辑 —————————————————————————
    uploadBtn.addEventListener('click', () => {
        const payload = {
            category:         sel.value,
            name:             movieData.name,
            total_episodes:   movieData.total_episodes||0,
            current_episodes: movieData.current_episodes||0,
            release_date:     movieData.release_date,
            cover_image:      movieData.cover_image,
            video_data:       movieData.video_data,
            douban_id:        movieData.douban_id,
            vod_content:      movieData.vod_content
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url:    uploadUrl,
            data:   JSON.stringify(payload),
            headers: { 'Content-Type':'application/json' },
            onerror() {
                alert('🚫 上传失败，请检查网络或接口地址');
            },
            onload(res) {
                let msg = res.responseText;
                try { msg = JSON.parse(res.responseText).msg; } catch {}
                alert(msg);
                ta.value += '\n\n【上传结果】 ' + msg;
            }
        });
    });

})();
