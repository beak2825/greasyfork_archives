// ==UserScript==
// @name         CZZYMovie 自动分类批量+单页提取 & 上传（按页面+豆瓣ID回退+全选）
// @namespace    http://tampermonkey.net/
// @version      1.48
// @description  自动分类、批量&单页提取&上传；电影分类固定1080P；无豆瓣ID时按名称查询；列表增加全选功能。
// @match        https://www.czzymovie.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.czzymovie.com
// @connect      api.zicc.cc
// @connect      ccj.nssc.cc
// @connect      kdj.one
// @downloadURL https://update.greasyfork.org/scripts/543105/CZZYMovie%20%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB%E6%89%B9%E9%87%8F%2B%E5%8D%95%E9%A1%B5%E6%8F%90%E5%8F%96%20%20%E4%B8%8A%E4%BC%A0%EF%BC%88%E6%8C%89%E9%A1%B5%E9%9D%A2%2B%E8%B1%86%E7%93%A3ID%E5%9B%9E%E9%80%80%2B%E5%85%A8%E9%80%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543105/CZZYMovie%20%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB%E6%89%B9%E9%87%8F%2B%E5%8D%95%E9%A1%B5%E6%8F%90%E5%8F%96%20%20%E4%B8%8A%E4%BC%A0%EF%BC%88%E6%8C%89%E9%A1%B5%E9%9D%A2%2B%E8%B1%86%E7%93%A3ID%E5%9B%9E%E9%80%80%2B%E5%85%A8%E9%80%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uploadUrl      = 'https://www.kdj.one/up.php';    // ← 修改为你的上传接口
    const coverProxyBase = 'https://ccj.nssc.cc/fqts/img.php?image_url=';

    // 自动分类
    const path = location.pathname.toLowerCase();
    let pageCategory = '电影';
    if (/^\/zuixindianying/.test(path)) pageCategory = '电影';
    else if (/^\/gcj/.test(path))       pageCategory = '国剧';
    else if (/^\/meijutt/.test(path))   pageCategory = '美剧';
    else if (/^\/hanjutv/.test(path))   pageCategory = '韩剧';
    else if (/^\/riju/.test(path))      pageCategory = '日剧';
    const isMovieCategory = pageCategory === '电影';

    // overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position:'fixed', top:'50px', right:'10px',
        width:'620px', height:'600px', background:'#fff',
        border:'1px solid #ccc', borderRadius:'4px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
        padding:'10px', overflow:'auto',
        zIndex:9999, display:'none'
    });
    document.body.appendChild(overlay);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position:'absolute', top:'5px', right:'5px',
        padding:'2px 6px', fontSize:'14px', cursor:'pointer'
    });
    closeBtn.onclick = () => overlay.style.display = 'none';
    overlay.appendChild(closeBtn);

    // 批量提取按钮
    const batchBtn = document.createElement('button');
    batchBtn.textContent = '批量提取';
    Object.assign(batchBtn.style, {
        position:'fixed', top:'10px', right:'10px',
        padding:'6px 12px', background:'#ff6600',
        color:'#fff', border:'none',
        borderRadius:'4px', cursor:'pointer', zIndex:9999
    });
    document.body.appendChild(batchBtn);

    // 详情页提取按钮
    if (/^\/movie\/\d+\.html$/.test(path)) {
        const detailBtn = document.createElement('button');
        detailBtn.textContent = '提取 & 上传';
        Object.assign(detailBtn.style, {
            position:'fixed', top:'10px', right:'100px',
            padding:'6px 12px', background:'#28BE81',
            color:'#fff', border:'none',
            borderRadius:'4px', cursor:'pointer', zIndex:9999
        });
        document.body.appendChild(detailBtn);
        detailBtn.addEventListener('click', () => extractSingle(location.href));
    }

    let bulkData = [], movieData = {};

    // 批量提取主逻辑
    batchBtn.addEventListener('click', () => {
        const anchors = Array.from(document.querySelectorAll('a[href^="https://www.czzymovie.com/movie/"]'));
        const links = [...new Set(anchors.map(a => a.href))]
            .filter(u => /\/movie\/\d+\.html$/.test(new URL(u).pathname));
        if (!links.length) {
            alert('未发现任何影片链接');
            return;
        }
        bulkData = [];
        overlay.innerHTML = '';
        overlay.appendChild(closeBtn);
        overlay.style.display = 'block';
        const status = document.createElement('div');
        status.textContent = `批量提取 ${links.length} 条数据…`;
        overlay.appendChild(status);
        links.forEach(fetchDetailBatch);
    });

    function fetchDetailBatch(url) {
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            const doc = new DOMParser().parseFromString(res.responseText,'text/html');
            const data = parseDoc(doc);
            data.detailUrl = url;
            GM_xmlhttpRequest({
                method:'GET',
                url: coverProxyBase + encodeURIComponent(data.coverRaw),
                onload(r2) {
                    data.cover_image = (tryParseJSON(r2.responseText).url || data.coverRaw);
                    ensureDoubanIdThenFetchEpisodes(data);
                },
                onerror() {
                    data.cover_image = data.coverRaw;
                    ensureDoubanIdThenFetchEpisodes(data);
                }
            });
        }});
    }

    function ensureDoubanIdThenFetchEpisodes(data) {
        if (!data.douban_id) {
            const api = `https://ccj.nssc.cc/360/douban.php?q=${encodeURIComponent(data.name)}`;
            GM_xmlhttpRequest({ method:'GET', url: api, onload(res) {
                const body = tryParseJSON(res.responseText);
                if (body.code===200 && Array.isArray(body.data) && body.data.length>0) {
                    data.douban_id = body.data[0].id;
                }
                fetchTotalEpisodes(data);
            }, onerror() {
                fetchTotalEpisodes(data);
            }});
        } else {
            fetchTotalEpisodes(data);
        }
    }

    function fetchTotalEpisodes(data) {
        if (!data.douban_id) {
            data.total_episodes = 0;
            bulkData.push(data);
            renderListBatch();
            return;
        }
        const url = `https://api.zicc.cc/douban/?id=${data.douban_id}&key=demo123123`;
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            data.total_episodes = parseInt(tryParseJSON(res.responseText).data?.vod_jisu) || 0;
            bulkData.push(data);
            renderListBatch();
        }, onerror() {
            data.total_episodes = 0;
            bulkData.push(data);
            renderListBatch();
        }});
    }

    function parseDoc(doc) {
        const name = (doc.querySelector('.moviedteail_tt h1')||{}).textContent.trim();
        const yearLi = Array.from(doc.querySelectorAll('.moviedteail_list li'))
            .find(li=>/年份[:：]/.test(li.textContent));
        const release_date = yearLi?(yearLi.querySelector('a')||{}).textContent.trim():'';
        let douban_id = '';
        const l1 = doc.querySelector('a[href*="/doubanapp/dispatch?uri=/tv/"]');
        const l2 = doc.querySelector('a.dbpingfen[href*="movie.douban.com/subject/"]');
        if (l1) douban_id = (l1.href.match(/\/tv\/(\d+)/)||[])[1]||'';
        else if (l2) douban_id = (l2.href.match(/subject\/(\d+)/)||[])[1]||'';
        const vod_content = (doc.querySelector('.yp_context')||{}).innerText.trim();
        const raw = (doc.querySelector('.dyimg.fl img')||{}).src||'';
        const part = raw.includes('src=')? raw.split('src=')[1] : raw;
        const coverRaw = /^https?:\/\//.test(part)? part : ('https://'+part);

        const anchors = Array.from(doc.querySelectorAll('.paly_list_btn a'));
        let current_episodes, video_data;
        if (isMovieCategory) {
            current_episodes = 0;
            video_data = anchors.map(a => `1080P$${a.href}`).join('#');
        } else {
            current_episodes = anchors.length;
            const nums = anchors.map((a,i)=>String((a.textContent.match(/\d+/)||[i+1])[0]).padStart(2,'0'));
            video_data = anchors.map((a,i)=>`第${nums[i]}集$${a.href}`).join('#');
        }

        return { name, release_date, douban_id, vod_content, coverRaw, current_episodes, video_data };
    }

    // 渲染列表 + 全选
    function renderListBatch() {
        overlay.innerHTML = '';
        overlay.appendChild(closeBtn);

        const batchUploadBtn = document.createElement('button');
        batchUploadBtn.textContent = '批量上传选中';
        Object.assign(batchUploadBtn.style, { margin:'0 0 10px 0', padding:'4px 8px', cursor:'pointer' });
        overlay.appendChild(batchUploadBtn);

        const table = document.createElement('table');
        table.style.width='100%';
        table.style.borderCollapse='collapse';

        const hdr = [
            `<th style="border:1px solid #ccc;padding:4px;text-align:center">
                <input type="checkbox" id="select_all">
             </th>`,
            `<th style="border:1px solid #ccc;padding:4px">名称</th>`,
            `<th style="border:1px solid #ccc;padding:4px">分类</th>`,
            `<th style="border:1px solid #ccc;padding:4px">进度</th>`,
            `<th style="border:1px solid #ccc;padding:4px">操作</th>`
        ].join('');
        table.innerHTML = `<tr>${hdr}</tr>`;

        bulkData.forEach((d,i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
<td style="border:1px solid #ccc;padding:4px;text-align:center">
  <input type="checkbox" data-index="${i}">
</td>
<td style="border:1px solid #ccc;padding:4px">${d.name}</td>
<td style="border:1px solid #ccc;padding:4px">
  <select data-index="${i}">
    <option ${pageCategory==='电影'?'selected':''}>电影</option>
    <option ${pageCategory==='国剧'?'selected':''}>国剧</option>
    <option ${pageCategory==='美剧'?'selected':''}>美剧</option>
    <option ${pageCategory==='韩剧'?'selected':''}>韩剧</option>
    <option ${pageCategory==='日剧'?'selected':''}>日剧</option>
  </select>
</td>
<td style="border:1px solid #ccc;padding:4px">${d.current_episodes}/${d.total_episodes}</td>
<td style="border:1px solid #ccc;padding:4px">
  <button data-index="${i}">上传</button>
  <span data-index-status="${i}" style="margin-left:6px;color:#28BE81"></span>
</td>`;
            table.appendChild(tr);
        });

        overlay.appendChild(table);
        overlay.style.display = 'block';

        // 全选逻辑
        const selectAll = overlay.querySelector('#select_all');
        selectAll.addEventListener('change', () => {
            const checked = selectAll.checked;
            overlay.querySelectorAll('input[type="checkbox"][data-index]')
              .forEach(ch => ch.checked = checked);
        });

        // 单条上传
        overlay.querySelectorAll('button[data-index]').forEach(btn => {
            btn.onclick = () => {
                const idx = +btn.getAttribute('data-index');
                const sel = overlay.querySelector(`select[data-index="${idx}"]`);
                const statusSpan = overlay.querySelector(`span[data-index-status="${idx}"]`);
                statusSpan.textContent = '上传中…';
                uploadSingle(bulkData[idx], sel.value, statusSpan);
            };
        });

        // 批量上传
        batchUploadBtn.onclick = () => {
            const idxs = Array.from(overlay.querySelectorAll('input[data-index]'))
                .filter(ch => ch.checked)
                .map(ch => +ch.getAttribute('data-index'));
            (function next(i){
                if (i >= idxs.length) return;
                const idx = idxs[i];
                const sel = overlay.querySelector(`select[data-index="${idx}"]`);
                const statusSpan = overlay.querySelector(`span[data-index-status="${idx}"]`);
                statusSpan.textContent = '上传中…';
                uploadSingle(bulkData[idx], sel.value, statusSpan, () => next(i+1));
            })(0);
        };
    }

    // 通用上传
    function uploadSingle(data, category, statusSpan, cb) {
        const payload = {
            category, name: data.name,
            total_episodes: data.total_episodes,
            current_episodes: data.current_episodes,
            release_date: data.release_date,
            cover_image: data.cover_image,
            video_data: data.video_data,
            douban_id: data.douban_id,
            vod_content: data.vod_content
        };
        GM_xmlhttpRequest({
            method:'POST',
            url: uploadUrl,
            data: JSON.stringify(payload),
            headers:{ 'Content-Type':'application/json' },
            onload(res) {
                const msg = tryParseJSON(res.responseText).msg || 'OK';
                statusSpan.textContent = msg;
                if (cb) cb();
            },
            onerror() {
                statusSpan.textContent = '失败';
                if (cb) cb();
            }
        });
    }

    // 详情页提取
    function extractSingle(url) {
        overlay.innerHTML = '';
        overlay.appendChild(closeBtn);
        const status = document.createElement('div');
        status.textContent = '详情页提取中…';
        overlay.appendChild(status);
        overlay.style.display = 'block';
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            parseDetailHtml(res.responseText);
        }});
    }

    function parseDetailHtml(html) {
        const doc = new DOMParser().parseFromString(html,'text/html');
        overlay.innerHTML = ''; overlay.appendChild(closeBtn);

        movieData.name = (doc.querySelector('.moviedteail_tt h1')||{}).textContent.trim();
        const yearLi = Array.from(doc.querySelectorAll('.moviedteail_list li'))
            .find(li=>/年份[:：]/.test(li.textContent));
        movieData.release_date = yearLi?(yearLi.querySelector('a')||{}).textContent.trim():'';
        const l1 = doc.querySelector('a[href*="/doubanapp/dispatch?uri=/tv/"]');
        const l2 = doc.querySelector('a.dbpingfen[href*="subject/"]');
        movieData.douban_id = l1? (l1.href.match(/\/tv\/(\d+)/)||[])[1]
                             : (l2? (l2.href.match(/subject\/(\d+)/)||[])[1] : '');
        movieData.vod_content = (doc.querySelector('.yp_context')||{}).innerText.trim().replace(/\r?\n\s*/g,'\n');
        const raw = (doc.querySelector('.dyimg.fl img')||{}).src||'';
        const part = raw.includes('src=')? raw.split('src=')[1]: raw;
        movieData.coverRaw = /^https?:\/\//.test(part)? part : ('https://'+part);

        GM_xmlhttpRequest({ method:'GET',
            url: coverProxyBase + encodeURIComponent(movieData.coverRaw),
            onload(r) {
                movieData.cover_image = tryParseJSON(r.responseText).url || movieData.coverRaw;
                continueDetail(doc);
            },
            onerror() {
                movieData.cover_image = movieData.coverRaw;
                continueDetail(doc);
            }
        });
    }

    function continueDetail(doc) {
        const anchors = Array.from(doc.querySelectorAll('.paly_list_btn a'));
        if (isMovieCategory) {
            movieData.current_episodes = 0;
            movieData.video_data = anchors.map(a=>`1080P$${a.href}`).join('#');
        } else {
            movieData.current_episodes = anchors.length;
            const nums = anchors.map((a,i)=>String((a.textContent.match(/\d+/)||[i+1])[0]).padStart(2,'0'));
            movieData.video_data = anchors.map((a,i)=>`第${nums[i]}集$${a.href}`).join('#');
        }

        const sel = document.createElement('select');
        ['电影','国剧','美剧','韩剧','日剧'].forEach(cat=>{
            const o = document.createElement('option'); o.value=cat; o.textContent=cat;
            if(cat===pageCategory) o.selected = true;
            sel.appendChild(o);
        });
        const uploadBtn2 = document.createElement('button');
        uploadBtn2.textContent = '上传'; uploadBtn2.style.margin='0 10px';
        const statusSpan2 = document.createElement('span');
        statusSpan2.style.color='#28BE81';
        const ta = document.createElement('textarea');
        ta.readOnly = true; Object.assign(ta.style,{width:'100%',height:'200px',marginTop:'10px',fontFamily:'monospace'});
        overlay.appendChild(sel); overlay.appendChild(uploadBtn2);
        overlay.appendChild(statusSpan2); overlay.appendChild(ta);

        const info = [
            `封面: ${movieData.cover_image}`,
            `名称: ${movieData.name}`,
            `年份: ${movieData.release_date}`,
            `豆瓣ID: ${movieData.douban_id}`,
            '介绍:', movieData.vod_content,
            `当前集数: ${movieData.current_episodes}`,
            '总集数: 查询中…'
        ];
        ta.value = info.join('\n');

        ensureDoubanIdThenFetchEpisodes({
            ...movieData,
            afterIdFetch: () => GM_xmlhttpRequest({
                method:'GET',
                url:`https://api.zicc.cc/douban/?id=${movieData.douban_id}&key=demo123123`,
                onload(r2){
                    movieData.total_episodes = parseInt(tryParseJSON(r2.responseText).data?.vod_jisu)||0;
                    info[7] = `总集数: ${movieData.total_episodes}`;
                    ta.value = info.join('\n');
                },
                onerror(){
                    movieData.total_episodes = 0;
                    info[7] = '总集数: 0';
                    ta.value = info.join('\n');
                }
            })
        });

        uploadBtn2.onclick = () => {
            statusSpan2.textContent = '上传中…';
            uploadSingle(movieData, sel.value, statusSpan2);
        };
    }

    function tryParseJSON(str) {
        try { return JSON.parse(str); }
        catch { return {}; }
    }

})();
