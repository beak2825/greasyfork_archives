// ==UserScript==
// @name         图片爬虫 V9 修正版
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  收集/下载图片，缩略图预览，大图查看，全选/反选，原文件名压缩下载
// @author       YourName
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/547359/%E5%9B%BE%E7%89%87%E7%88%AC%E8%99%AB%20V9%20%E4%BF%AE%E6%AD%A3%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/547359/%E5%9B%BE%E7%89%87%E7%88%AC%E8%99%AB%20V9%20%E4%BF%AE%E6%AD%A3%E7%89%88.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const TIMEOUT = 30000;
    const MAX_RETRIES = 5;
    const downloadedUrls = new Set(JSON.parse(localStorage.getItem('downloadedImages')||'[]'));

    let imageUrls = [];

    // ---------------- UI ----------------
    const container = document.createElement('div');
    container.style.position='fixed';
    container.style.top='50px';
    container.style.right='50px';
    container.style.width='280px';
    container.style.backgroundColor='#fff';
    container.style.border='1px solid #ccc';
    container.style.padding='10px';
    container.style.zIndex='99999';
    container.style.fontSize='12px';
    container.style.borderRadius='6px';
    container.style.boxShadow='0 0 10px rgba(0,0,0,0.3)';
    container.style.overflow='hidden';
    document.body.appendChild(container);

    // 下拉格式
    const formatFilter = document.createElement('select');
    formatFilter.style.width='100%';
    formatFilter.style.marginBottom='5px';
    formatFilter.innerHTML = [
        '<option value="">全部格式</option>',
        '<option value="jpg">JPG</option>',
        '<option value="png">PNG</option>',
        '<option value="gif">GIF</option>',
        '<option value="webp">WEBP</option>',
        '<option value="bmp">BMP</option>'
    ].join('');
    container.appendChild(formatFilter);

    // 收集按钮
    const collectBtn = document.createElement('button');
    collectBtn.innerText='收集图片';
    collectBtn.style.width='100%';
    collectBtn.style.marginBottom='5px';
    container.appendChild(collectBtn);

    // 全选 / 反选
    const selectAllBtn = document.createElement('button');
    selectAllBtn.innerText='全选/反选';
    selectAllBtn.style.width='100%';
    selectAllBtn.style.marginBottom='5px';
    container.appendChild(selectAllBtn);

    // 下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText='全部下载';
    downloadBtn.style.width='100%';
    downloadBtn.style.marginBottom='5px';
    container.appendChild(downloadBtn);

    // 清空记录
    const clearBtn = document.createElement('button');
    clearBtn.innerText='清空已下载记录';
    clearBtn.style.width='100%';
    clearBtn.style.marginBottom='5px';
    container.appendChild(clearBtn);

    // 下载进度
    const progressText = document.createElement('div');
    progressText.style.textAlign='center';
    progressText.style.marginBottom='5px';
    container.appendChild(progressText);

    // 图片列表
    const imgListDiv = document.createElement('div');
    imgListDiv.style.maxHeight='300px';
    imgListDiv.style.overflowY='auto';
    imgListDiv.style.borderTop='1px dashed #ddd';
    imgListDiv.style.marginTop='5px';
    container.appendChild(imgListDiv);

    // ---------------- 工具函数 ----------------
    function extFromUrl(url){
        try{
            const clean=url.split('#')[0].split('?')[0];
            const part=clean.split('/').pop()||'';
            const ext=(part.includes('.')?part.split('.').pop():'').toLowerCase();
            return ext||'jpg';
        }catch(e){ return 'jpg'; }
    }

    function getFileName(url){
        try{ return url.split('/').pop().split('?')[0].split('#')[0]; }catch(e){ return 'image.jpg'; }
    }

    function getCandidateSrcs(img){
        const srcs=[];
        if(img.src) srcs.push(img.src);
        if(img.dataset){
            for(const key of ['src','srcset','original','lazy','lazySrc','lazyLoad','image','bg']){
                const k='data-'+key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
                if(img.getAttribute&&img.getAttribute(k)) srcs.push(img.getAttribute(k));
            }
            if(img.dataset.src) srcs.push(img.dataset.src);
            if(img.dataset.original) srcs.push(img.dataset.original);
        }
        if(img.srcset){
            img.srcset.split(',').forEach(u=>srcs.push(u.trim().split(' ')[0]));
        }
        return srcs.filter(Boolean);
    }

    async function fetchImageWithRetry(url){
        for(let i=0;i<MAX_RETRIES;i++){
            try{
                const blob=await new Promise((resolve,reject)=>{
                    const timer=setTimeout(()=>reject('timeout'),TIMEOUT);
                    GM_xmlhttpRequest({
                        method:'GET',
                        url,
                        responseType:'blob',
                        onload:res=>{ clearTimeout(timer); resolve(res.response); },
                        onerror:e=>{ clearTimeout(timer); reject(e); }
                    });
                });
                if(blob && blob.size>0) return blob;
            }catch(e){ if(i===MAX_RETRIES-1) return null; }
        }
        return null;
    }

    // ---------------- 收集 & 渲染 ----------------
    function collectImages(){
        imageUrls=[];
        const filter=(formatFilter.value||'').toLowerCase();
        document.querySelectorAll('img').forEach(img=>{
            getCandidateSrcs(img).forEach(url=>{
                const ext=extFromUrl(url);
                if((!filter || ext===filter) && !imageUrls.includes(url)) imageUrls.push(url);
            });
        });
        renderImageList();
        progressText.innerText=`已收集图片: ${imageUrls.length}`;
    }

    function renderImageList(){
        imgListDiv.innerHTML='';
        imageUrls.forEach(url=>{
            const row=document.createElement('div');
            row.style.display='flex';
            row.style.alignItems='center';
            row.style.padding='4px 0';

            const checkbox=document.createElement('input');
            checkbox.type='checkbox';
            const isDownloaded=downloadedUrls.has(url);
            checkbox.checked=!isDownloaded;
            checkbox.style.marginRight='6px';
            checkbox.addEventListener('change', e=>{
                if(e.target.checked) downloadedUrls.delete(url);
                else downloadedUrls.add(url);
                thumb.style.opacity = downloadedUrls.has(url) ? '0.45' : '1';
            });
            row.appendChild(checkbox);

            const thumb=document.createElement('img');
            thumb.src=url;
            thumb.style.width='50px';
            thumb.style.height='50px';
            thumb.style.objectFit='cover';
            thumb.style.marginRight='6px';
            thumb.style.borderRadius='4px';
            thumb.style.cursor='pointer';
            thumb.style.transition='opacity .15s ease';
            if(isDownloaded) thumb.style.opacity='0.45';
            thumb.addEventListener('click',()=>window.open(url));
            row.appendChild(thumb);

            const link=document.createElement('a');
            link.href=url;
            link.target='_blank';
            link.textContent=getFileName(url);
            link.style.fontSize='11px';
            link.style.marginLeft='2px';
            row.appendChild(link);

            imgListDiv.appendChild(row);
        });
    }

    // ---------------- 下载 ----------------
    async function downloadAll(){
        const pendingUrls=imageUrls.filter(url=>!downloadedUrls.has(url));
        if(pendingUrls.length===0){ alert('没有可下载的图片'); return; }

        const zip=new JSZip();
        progressText.innerText='开始下载...';
        for(let i=0;i<pendingUrls.length;i++){
            const url=pendingUrls[i];
            const blob=await fetchImageWithRetry(url);
            if(blob) zip.file(getFileName(url), blob);
            else console.warn('下载失败:', url);
            progressText.innerText=`下载进度: ${i+1}/${pendingUrls.length}`;
        }
        const content=await zip.generateAsync({type:'blob'});
        const a=document.createElement('a');
        a.href=URL.createObjectURL(content);
        a.download=`images_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        pendingUrls.forEach(u=>downloadedUrls.add(u));
        localStorage.setItem('downloadedImages', JSON.stringify(Array.from(downloadedUrls)));
        progressText.innerText='下载完成';
        renderImageList();
        alert('下载完成');
    }

    // ---------------- 事件 ----------------
    collectBtn.addEventListener('click',collectImages);
    selectAllBtn.addEventListener('click',()=>{
        const checkboxes=imgListDiv.querySelectorAll('input[type=checkbox]');
        const allChecked=Array.from(checkboxes).every(cb=>cb.checked);
        checkboxes.forEach(cb=>cb.checked=!allChecked);
        const thumbs=imgListDiv.querySelectorAll('img');
        thumbs.forEach((img,i)=>{
            const url=imageUrls[i];
            const cb=checkboxes[i];
            if(cb && url){
                if(cb.checked) downloadedUrls.delete(url);
                else downloadedUrls.add(url);
                img.style.opacity=downloadedUrls.has(url)?'0.45':'1';
            }
        });
    });
    downloadBtn.addEventListener('click',downloadAll);
    clearBtn.addEventListener('click',()=>{
        downloadedUrls.clear();
        localStorage.removeItem('downloadedImages');
        renderImageList();
        alert('已清空已下载记录');
    });
    formatFilter.addEventListener('change',collectImages);

})();// ==UserScript==
// @name         New Userscript
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();