// ==UserScript==
// @name         CZZYMovie 采集
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动分类、批量&单页提取&上传；电影分类固定1080P；无豆瓣ID时按名称查询；列表增加全选功能。
// @match        https://www.czzymovie.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.czzymovie.com
// @connect      api.zicc.cc
// @connect      ccj.nssc.cc
// @connect      kdj.one
// @connect      movie.douban.com
// @downloadURL https://update.greasyfork.org/scripts/543344/CZZYMovie%20%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543344/CZZYMovie%20%E9%87%87%E9%9B%86.meta.js
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
        width:'320px', height:'600px', background:'#fff',
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

    function processLinksSequentially(links, i = 0) {
        if (i >= links.length) return;
        const cz_id = parseInt((links[i].match(/\/movie\/(\d+)\.html/)||[])[1]) || 0;
        console.log(`开始处理第 ${i+1}/${links.length} 个链接, ID: ${cz_id}`);
        fetchDetailBatch(links[i], cz_id, () => {
            processLinksSequentially(links, i + 1);
        });
    }

    batchBtn.addEventListener('click', () => {
        // 获取所有影片链接
        const movieItems = Array.from(document.querySelectorAll('li'));
        const movieLinks = movieItems
            .filter(item => {
                // 检查是否有PV预告标记
                const furk = item.querySelector('.hdinfo .furk');
                if (furk && furk.textContent.includes('PV预告')) {
                    console.log('跳过PV预告');
                    return false;
                }
                return true;
            })
            .map(item => item.querySelector('a[href*="/movie/"]'))
            .filter(a => a && /\/movie\/\d+\.html$/.test(a.href))
            .map(a => a.href);

        const links = [...new Set(movieLinks)];

        if (!links.length) {
            alert('未发现任何影片链接');
            return;
        }
        console.log('找到影片链接:', links.map(url => {
            const id = parseInt((url.match(/\/movie\/(\d+)\.html/)||[])[1]) || 0;
            return `ID: ${id} - ${url}`;
        }));

        bulkData = [];
        overlay.innerHTML = '';
        overlay.appendChild(closeBtn);
        overlay.style.display = 'block';
        const status = document.createElement('div');
        status.textContent = `批量提取 ${links.length} 条数据…`;
        overlay.appendChild(status);
        if (pageCategory === '电影') {
            // 电影分类，直接并发提取
            links.forEach(link => {
                const cz_id = parseInt((link.match(/\/movie\/(\d+)\.html/)||[])[1]) || 0;
                fetchDetailBatch(link, cz_id);
            });
        } else {
            // 其他分类，顺序处理
            processLinksSequentially(links);
        }
    });

    // fetchDetailBatch 增加 cz_id 参数
    function fetchDetailBatch(url, cz_id, cb) {
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            console.log(`请求成功 [ID: ${cz_id}]:`, url);
            const doc = new DOMParser().parseFromString(res.responseText,'text/html');
            const data = parseDoc(doc);
            if (!data) { // 如果parseDoc返回null，则跳过该链接
                console.log(`跳过无效数据 [ID: ${cz_id}]:`, url);
                if (cb) cb();
                return;
            }
            data.detailUrl = url;
            data.cz_id = cz_id;  // 保存ID
            GM_xmlhttpRequest({
                method:'GET',
                url: coverProxyBase + encodeURIComponent(data.coverRaw),
                onload(r2) {
                    console.log(`封面请求成功 [ID: ${cz_id}]:`, coverProxyBase + encodeURIComponent(data.coverRaw));
                    data.cover_image = (tryParseJSON(r2.responseText).url || data.coverRaw);
                    ensureDoubanIdThenFetchEpisodes(data, cb);
                },
                onerror(e2) {
                    console.log(`封面请求失败 [ID: ${cz_id}]:`, coverProxyBase + encodeURIComponent(data.coverRaw), e2);
                    data.cover_image = data.coverRaw;
                    ensureDoubanIdThenFetchEpisodes(data, cb);
                }
            });
        }, onerror(e) {
            console.log(`请求失败 [ID: ${cz_id}]:`, url, e);
            if (cb) cb();
        }});
    }

    // ensureDoubanIdThenFetchEpisodes 增加回调参数
    function ensureDoubanIdThenFetchEpisodes(data, cb) {
        // 如果是“电影”分类，直接跳过集数查询
        if (pageCategory === '电影') {
            data.total_episodes = 0;
            bulkData.push(data);
            renderListBatch();
            if (cb) cb();
            return;
        }
        if (!data.douban_id) {
            const api = `https://movie.douban.com/j/subject_suggest?q=${encodeURIComponent(data.name)}`;
            GM_xmlhttpRequest({ method:'GET', url: api, onload(res) {
                console.log('豆瓣ID请求成功:', api, res);
                console.log('豆瓣 suggest 接口响应内容:', res.responseText); // 新增日志
                const arr = tryParseJSON(res.responseText);
                if (!Array.isArray(arr)) {
                    // 不是数组，说明接口异常（如返回html等），3秒后重试
                    setTimeout(() => {
                        ensureDoubanIdThenFetchEpisodes(data, cb);
                    }, 3000);
                    return;
                }
                if (arr.length === 0) {
                    // 空数组，3秒后重试
                    setTimeout(() => {
                        ensureDoubanIdThenFetchEpisodes(data, cb);
                    }, 3000);
                    return;
                }
                if (Array.isArray(arr) && arr.length > 0) {
                    // 优先取 episode 字段有数据的那一条
                    let chosen = arr.find(item => item.episode && String(item.episode).trim() !== '');
                    if (!chosen) {
                        // 都没有就取第一条
                        chosen = arr[0];
                    }
                    data.douban_id = chosen.id;
                    // 如需其他字段可继续赋值
                    // data.douban_title = chosen.title;
                    // data.douban_img = chosen.img;
                    // data.douban_year = chosen.year;
                }
                setTimeout(() => {
                    fetchTotalEpisodes(data, cb);
                }, 1200); // 固定1.2秒延迟
            }, onerror(e) {
                console.log('豆瓣ID请求失败:', api, e);
                setTimeout(() => {
                    fetchTotalEpisodes(data, cb);
                }, 1200); // 固定1.2秒延迟
            }});
        } else {
            fetchTotalEpisodes(data, cb);
        }
    }

    // fetchTotalEpisodes 增加回调参数
    function fetchTotalEpisodes(data, cb) {
        if (!data.douban_id) {
            data.total_episodes = 0;
            bulkData.push(data);
            renderListBatch();
            if (cb) cb();
            return;
        }
        const url = `https://api.zicc.cc/douban/?id=${data.douban_id}&key=demo123123`;
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            console.log('总集数请求成功:', url, res);
            console.log('zicc douban 接口响应内容:', res.responseText); // 新增日志
            data.total_episodes = parseInt(tryParseJSON(res.responseText).data?.vod_jisu) || 0;
            bulkData.push(data);
            renderListBatch();
            if (cb) cb();
        }, onerror(e) {
            console.log('总集数请求失败:', url, e);
            data.total_episodes = 0;
            bulkData.push(data);
            renderListBatch();
            if (cb) cb();
        }});
    }

    // 检查链接是否有效（不是PV预告且包含v_play）
    function isValidPlayLink(anchor) {
        // 检查是否是PV预告
        const parent = anchor.closest('li');
        if (parent) {
            const furk = parent.querySelector('.hdinfo .furk');
            if (furk && furk.textContent.includes('PV预告')) {
                console.log('跳过PV预告链接:', anchor.href);
                return false;
            }
        }

        // 检查是否包含v_play
        if (!anchor.href.includes('/v_play/')) {
            console.log('跳过非v_play链接:', anchor.href);
            return false;
        }

        return true;
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

        // 提取 cz_id
        const cz_id = parseInt((location.pathname.match(/\/movie\/(\d+)\.html/)||[])[1]) || 0;

        // 过滤有效的播放链接
        const allAnchors = Array.from(doc.querySelectorAll('.paly_list_btn a'));
        const validAnchors = allAnchors.filter(isValidPlayLink);

        // 如果没有有效链接，返回null
        if (validAnchors.length === 0) {
            console.log('没有找到有效的播放链接，跳过数据');
            return null;
        }

        let current_episodes, video_data;
        if (isMovieCategory) {
            current_episodes = 0;
            video_data = validAnchors.map(a => `1080P$${a.href}`).join('#');
        } else {
            current_episodes = validAnchors.length;
            const nums = validAnchors.map((a,i)=>String((a.textContent.match(/\d+/)||[i+1])[0]).padStart(2,'0'));
            video_data = validAnchors.map((a,i)=>`第${nums[i]}集$${a.href}`).join('#');
        }

        return { name, release_date, douban_id, vod_content, coverRaw, current_episodes, video_data, cz_id };
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
            category,
            name: data.name,
            total_episodes: data.total_episodes,
            current_episodes: data.current_episodes,
            release_date: data.release_date,
            cover_image: data.cover_image,
            video_data: data.video_data,
            douban_id: data.douban_id,
            vod_content: data.vod_content,
            cz_id: data.cz_id  // 添加cz_id到上传数据中
        };
        console.log('准备上传数据:', payload); // 添加日志
        GM_xmlhttpRequest({
            method:'POST',
            url: uploadUrl,
            data: JSON.stringify(payload),
            headers:{ 'Content-Type':'application/json' },
            onload(res) {
                console.log(`上传成功 [ID: ${data.cz_id}]:`, payload, res);
                const msg = tryParseJSON(res.responseText).msg || 'OK';
                statusSpan.textContent = msg;
                if (cb) cb();
            },
            onerror(e) {
                console.log(`上传失败 [ID: ${data.cz_id}]:`, payload, e);
                statusSpan.textContent = '失败';
                if (cb) cb();
            }
        });
    }

    // 详情页提取
    function extractSingle(url) {
        // 提取ID
        const cz_id = parseInt((url.match(/\/movie\/(\d+)\.html/)||[])[1]) || 0;
        console.log('提取到ID:', cz_id, '来自URL:', url);

        overlay.innerHTML = '';
        overlay.appendChild(closeBtn);
        const status = document.createElement('div');
        status.textContent = `详情页提取中...(ID: ${cz_id})`;
        overlay.appendChild(status);
        overlay.style.display = 'block';
        GM_xmlhttpRequest({ method:'GET', url, onload(res) {
            console.log(`详情页请求成功 [ID: ${cz_id}]:`, url);
            parseDetailHtml(res.responseText, cz_id);
        }, onerror(e) {
            console.log(`详情页请求失败 [ID: ${cz_id}]:`, url, e);
        }});
    }

    function parseDetailHtml(html, cz_id) {
        const doc = new DOMParser().parseFromString(html,'text/html');
        overlay.innerHTML = ''; overlay.appendChild(closeBtn);

        movieData = {}; // 重置数据
        movieData.cz_id = cz_id; // 保存ID
        console.log('开始解析详情页数据, ID:', movieData.cz_id);

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
                console.log('封面请求成功:', coverProxyBase + encodeURIComponent(movieData.coverRaw), r);
                movieData.cover_image = tryParseJSON(r.responseText).url || movieData.coverRaw;
                continueDetail(doc);
            },
            onerror(e) {
                console.log('封面请求失败:', coverProxyBase + encodeURIComponent(movieData.coverRaw), e);
                movieData.cover_image = movieData.coverRaw;
                continueDetail(doc);
            }
        });
    }

    function continueDetail(doc) {
        // 过滤有效的播放链接
        const allAnchors = Array.from(doc.querySelectorAll('.paly_list_btn a'));
        const validAnchors = allAnchors.filter(isValidPlayLink);

        // 如果没有有效链接，显示提示并返回
        if (validAnchors.length === 0) {
            overlay.innerHTML = '';
            overlay.appendChild(closeBtn);
            const status = document.createElement('div');
            status.textContent = '没有找到有效的播放链接，跳过数据';
            status.style.color = '#ff0000';
            overlay.appendChild(status);
            return;
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
            `ID: ${movieData.cz_id}`,
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
                    console.log('总集数请求成功:', `https://api.zicc.cc/douban/?id=${movieData.douban_id}&key=demo123123`, r2);
                    movieData.total_episodes = parseInt(tryParseJSON(r2.responseText).data?.vod_jisu)||0;
                    info[7] = `总集数: ${movieData.total_episodes}`;
                    ta.value = info.join('\n');
                },
                onerror(){
                    console.log('总集数请求失败:', `https://api.zicc.cc/douban/?id=${movieData.douban_id}&key=demo123123`);
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
