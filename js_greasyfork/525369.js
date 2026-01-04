// ==UserScript==
// @name         资源嗅探
// @namespace    https://staybrowser.com/
// @version      1.1.2
// @description  资源嗅探工具，支持 M3U8 解析下载，优化 UI，增强交互体验
// @author       GaryIndex
// @license      telegram @GaryIndex
// @match        *://*/*
// @grant        none
// @icon         https://raw.githubusercontent.com/GaryIndex/GaryIndex/refs/heads/main/GaryIndex.JPG
// @downloadURL https://update.greasyfork.org/scripts/525369/%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/525369/%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.meta.js
// ==/UserScript==
(() => {
    'use strict';
    const snifferBtn = document.createElement('button');
    snifferBtn.innerText = '资源嗅探';
    Object.assign(snifferBtn.style, { position: 'fixed', bottom: '20px', right: '20px', zIndex: '10000', padding: '12px 20px', fontSize: '16px', border: 'none', borderRadius: '25px', backgroundColor: '#007aff', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontWeight: 'bold' });
    const modal = document.createElement('div');
    Object.assign(modal.style, { position: 'fixed', width: '90%', height: '50vh', left: '5%', top: '25vh', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'none', flexDirection: 'column', zIndex: '10001', overflow: 'hidden', fontFamily: 'Arial, sans-serif', fontSize: '14px' });
    const modalHeader = document.createElement('div');
    Object.assign(modalHeader.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontSize: '16px', fontWeight: 'bold', color: '#000' });
    const headerImage = document.createElement('img');
    headerImage.src = 'https://raw.githubusercontent.com/GaryIndex/GaryIndex/refs/heads/main/GaryIndex.JPG';
    headerImage.alt = '资源图标';
    Object.assign(headerImage.style, { width: '30px', height: '30px', marginRight: '10px', objectFit: 'cover', borderRadius: '5px' });
    const headerText = document.createElement('span');
    headerText.innerText = '选择要下载的资源';
    Object.assign(headerText.style, { display: 'inline-block', lineHeight: '30px' });
    const closeBtn = document.createElement('span');
    closeBtn.innerText = '关闭';
    Object.assign(closeBtn.style, { cursor: 'pointer', fontWeight: 'bold', color: '#007aff' });
    closeBtn.onclick = () => { modal.style.display = 'none'; snifferBtn.style.display = 'block'; };
    const leftContent = document.createElement('div');
    leftContent.style.display = 'flex'; leftContent.style.alignItems = 'center';
    leftContent.appendChild(headerImage);
    leftContent.appendChild(headerText);
    modalHeader.appendChild(leftContent);
    modalHeader.appendChild(closeBtn);
    const categories = ['全部', '视频', '音频', '图片', '文档', '扩展', '其他'];
    let activeCategoryIndex = 0;
    const categoryBar = document.createElement('div');
    Object.assign(categoryBar.style, { display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px', marginBottom: '10px' });
    const style = document.createElement('style');
    style.innerHTML = `
        .category-bar { display: flex; flex-wrap: nowrap; overflow-x: scroll !important; overflow-y: hidden !important; white-space: nowrap; width: 100%; }
        .category-bar::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
        html, body { height: 100%; margin: 0; padding: 0; overflow: auto !important; }
        video, audio { overflow: hidden !important; }
    `;
    document.head.appendChild(style);
    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.dataset.index = index;
        Object.assign(btn.style, { padding: '8px 12px', border: 'none', borderRadius: '20px', backgroundColor: index === 0 ? '#007aff' : '#f0f0f0', color: index === 0 ? '#fff' : '#000', cursor: 'pointer', fontSize: '14px', fontWeight: 'normal', whiteSpace: 'nowrap', minWidth: '70px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' });
        btn.onclick = (e) => { activeCategoryIndex = parseInt(e.target.dataset.index); filterResources(cat); };
        categoryBar.appendChild(btn);
    });
    const resourceList = document.createElement('div');
    Object.assign(resourceList.style, { flex: 1, overflowY: 'auto', padding: '10px' });
    modal.appendChild(modalHeader);
    modal.appendChild(categoryBar);
    modal.appendChild(resourceList);
    document.body.appendChild(snifferBtn);
    document.body.appendChild(modal);
    snifferBtn.onclick = () => { updateResourceList(); modal.style.display = 'flex'; snifferBtn.style.display = 'none'; };
    let allResources = [];
    function updateResourceList() {
        allResources = [];
        document.querySelectorAll('a, source, link, video, audio').forEach(el => {
            const url = el.href || el.src;
            if (url) {
                let type = '其他';
                if (url.match(/\.(mp4|avi|mov|mkv|webm|flv|wmv|mpeg|mpg|3gp|ts|rm|rmvb|ogv|asf|vob|f4v|m4v|qt|h264|hevc|mpeg-2|mpeg-4|divx|xvid|mov|mts|tp|dat|yuv|m3u8|mkv|webm|hls|mpd|dash|ts|f4v)$/)) type = '视频';
                else if (url.match(/\.(mp3|wav|aac|flac|ogg|wma|m4a|opus|alac|ape|dsd|pcm|aiff|au|mid|midi|amr|caf|voc|ra|rm|mpc|tta)$/)) type = '音频';
                else if (url.match(/\.(jpeg|jpg|png|gif|bmp|tiff|tif|webp|heif|heic|jpeg 2000|jp2|j2k|apng|tga|tpic|dds|exr|hdr|raw|svg|ai|eps|pdf|cdr|fig|skp|psd|xcf|ico|icns|stl|obj|ply|dicom|shp|pcx|pict|pct|iff|jbig|jbg|sgi)$/)) type = '图片';
                else if (url.match(/\.(.py|.js|.java|.c|.cpp|.cc|.cxx|.cs|.go|.rb|.php|.swift|.kt|.kts|.ts|.html|.htm|.css|.json|.xml|.sql|.r|.m|.sh|.bash|.ps1|.rs|.lua|.hs|.scala|.tex|.md|.vhd|.vhdl|.asm|.pl|.dart|.el|.erl|.ex|.exs|.jl|.lisp|.ml|.nim|.pas|.pde|.psm1|.rpy|.sml|.tcl|.v|.vbs|.wsf|.yml|.yaml|.coffee|.graphql|.sh|.sql|.scss|.rmd|.styl|.pug|.vue|.handlebars|.twig|.hbs|.asp|.aspx|.cgi|.pl|.psd|.ai|.indd|.abap|.actionscript|.ada|.awk|.batch|.bc|.bh|.bzl|.capnp|.clj|.cljc|.cobol|.coffee|.cql|.cshtml|.cu|.d|.dats|.db|.dcm|.dif|.dtd|.dylib|.f|.f90|.fd|.fxml|.glsl|.h|.hxx|.hpp|.hx|.idl|.inl|.install|.java|.jl|.l|.lisp|.liquid|.lua|.m4|.makefile|.map|.maven|.ml|.mli|.nim|.ninja|.nvm|.objc|.pl|.pm|.ps|.puml|.py|.q|.r|.rexx|.rst|.rs|.scala|.scm|.sh|.shtml|.sml|.sol|.ss|.svg|.tcl|.tex|.ts|.tsx|.v|.vhdl|.vim|.xhtml|.xml|.xsl|.yaml|.yml)$/)) type = '扩展';
                else if (url.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|odt|ods|odp|epub|mobi|azw3|chm|djvu|tex|md|html|xps|pages|key|numbers|csv|tsv|epub3|fb2|azw|abw)$/)) type = '文档';
                allResources.push({ name: formatName(url), url, type });
            }
        });
        filterResources(categories[activeCategoryIndex]);
    }
    function filterResources(category) {
        resourceList.innerHTML = '';
        const filtered = category === '全部' ? allResources : allResources.filter(res => res.type === category);
        if (filtered.length === 0) { resourceList.innerHTML = `<p style="color:#666; text-align:center;">暂无资源可供下载</p>`; } else {
            filtered.forEach(res => {
                if (!res.name) return;
                const item = document.createElement('div');
                Object.assign(item.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', fontWeight: 'normal' });
                const name = document.createElement('span');
                name.innerText = res.name;
                name.style.flex = '1';
                name.style.textAlign = 'left';
                name.style.color = '#000';
                name.style.fontWeight = 'normal';
                const downloadBtn = document.createElement('button');
                downloadBtn.innerText = '下载';
                Object.assign(downloadBtn.style, { padding: '6px 12px', border: 'none', borderRadius: '15px', backgroundColor: '#007aff', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', width: '70px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' });
                downloadBtn.onclick = () => downloadResource(res.url, res.name);
                item.appendChild(name);
                item.appendChild(downloadBtn);
                resourceList.appendChild(item);
            });
        }
        categoryBar.querySelectorAll('button').forEach((btn, index) => {
            btn.style.backgroundColor = index === activeCategoryIndex ? '#007aff' : '#f0f0f0';
            btn.style.color = index === activeCategoryIndex ? '#fff' : '#000';
            btn.style.fontSize = '14px';
        });
        setTimeout(() => { categoryBar.scrollLeft = categoryBar.children[activeCategoryIndex].offsetLeft - 20; }, 0);
    }
    function downloadResource(url, filename) {
        if (url.endsWith('.m3u8')) { downloadM3U8(url, filename); return; }
        fetch(url).then(response => { const contentType = response.headers.get('content-type') || ''; return response.blob().then(blob => ({ blob, contentType })); })
            .then(({ blob, contentType }) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                const forcedExtensions = ['.md', '.json', '.xml', '.csv', '.yaml', '.yml', '.sql', '.sh', '.py', '.js', '.ts', '.html', '.css', '.jsx', '.tsx', '.c', '.cpp', '.java', '.go', '.rb', '.php', '.swift', '.kt', '.r', '.lua', '.pl', '.dart', '.scala', '.vhd', '.asm', '.ps1'];
                const extIndex = filename.lastIndexOf('.');
                let ext = extIndex !== -1 ? filename.slice(extIndex).toLowerCase() : '';
                const randomNum = Math.floor(100 + Math.random() * 900);
                if (!ext) { ext = '.txt'; filename += ext; }
                if (!filename.trim()) { filename = `downloaded_file${randomNum}.txt`; }
                if (forcedExtensions.includes(ext) || contentType.startsWith('text/')) { a.download = filename; } else { a.download = filename; }
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(() => alert('资源下载失败'));
    }
    function downloadM3U8(url, filename) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const contentType = xhr.getResponseHeader('Content-Type') || '';
            if (xhr.status === 200 && contentType.includes('application/vnd.apple.mpegurl')) {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(xhr.response);
                a.download = filename.endsWith('.m3u8') ? filename : `${filename}.m3u8`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('M3U8 文件下载失败');
            }
        };
        xhr.send();
    }
    function formatName(url) {
        const parts = url.split('/');
        return parts.length > 0 ? decodeURIComponent(parts[parts.length - 1]) : '';
    }
})();