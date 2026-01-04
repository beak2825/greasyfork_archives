// ==UserScript==
// @name         BGM 角色图廊
// @namespace    https://github.com/stay206
// @version      1.0
// @description  在角色主页面插入“图廊”；在上传图片页显示图廊画廊
// @match        https://bgm.tv/character/*
// @match        https://bangumi.tv/character/*
// @match        https://chii.in/character/*
// @match        https://bgm.tv/character/*/upload_img
// @match        https://bangumi.tv/character/*/upload_img
// @match        https://chii.in/character/*/upload_img
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542309/BGM%20%E8%A7%92%E8%89%B2%E5%9B%BE%E5%BB%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/542309/BGM%20%E8%A7%92%E8%89%B2%E5%9B%BE%E5%BB%8A.meta.js
// ==/UserScript==

;(async function() {
  'use strict';
  console.log('【BGM 图廊脚本】启动，路径：', location.pathname);

  const path = location.pathname;

  // —— 主页面：插入“图廊”Tab ——
  const mainMatch = path.match(/^\/character\/(\d+)(?:\/?)$/);
  if (mainMatch) {
    const charId = mainMatch[1];
    const nav = document.querySelector('ul.navTabs');
    if (nav && !nav.querySelector(`a[href="/character/${charId}/upload_img"]`)) {
      console.log('主页面：插入 图廊 Tab，角色ID=', charId);
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href        = `/character/${charId}/upload_img`;
      a.textContent = '图廊';
      a.classList.add('bve-processed');
      if (path.endsWith('/upload_img')) a.classList.add('focus');
      li.appendChild(a);
      const relateLi = nav.querySelector('li.relate-button');
      if (relateLi) relateLi.insertAdjacentElement('afterend', li);
      else nav.appendChild(li);
    }
  }

  // —— 上传页：渲染图廊 ——
  const upMatch = path.match(/^\/character\/(\d+)\/upload_img/);
  if (!upMatch) return;
  const charId = upMatch[1];
  console.log('上传页：渲染图廊，角色ID=', charId);

  // 在左侧插入外壳
  const container = document.getElementById('columnInSubjectA');
  if (!container) {
    console.error('上传页：未找到 columnInSubjectA');
    return;
  }
  container.insertAdjacentHTML('afterbegin', `
<br>
<h2>已经提供的图片</h2>
<div class="clearit">
  <ul class="photoList"></ul>
</div>`);
  const listEl = container.querySelector('ul.photoList');
  if (!listEl) {
    console.error('上传页：未找到 photoList');
    return;
  }

  // 角色主页面，解析封面
  async function fetchCover() {
    try {
      const res  = await fetch(`${location.origin}/character/${charId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        console.warn('fetchCover：HTTP', res.status);
        return null;
      }
      const html = await res.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const src  = doc.querySelector('div[align="center"] img.cover')?.src || null;
      console.log('fetchCover：封面URL=', src);
      return src;
    } catch (e) {
      console.error('fetchCover：出错', e);
      return null;
    }
  }
  const coverUrl = await fetchCover();

  // 寻找条目肖像贡献者
  let groupHref = '', groupName = '';
  const allLi = Array.from(document.querySelectorAll('ul.groupsLine li'));
  let entryLi = allLi.find(li =>
    li.querySelector('span.comment.tip')?.textContent.trim() === '新肖像'
  );
  if (!entryLi) {
    entryLi = allLi.find(li =>
      li.querySelector('span.comment.tip')?.textContent.trim() === '新条目'
    );
  }
  if (entryLi) {
    const a = entryLi.querySelector('a.l.bve-processed');
    if (a && a.href) {
      groupHref = a.href;
      groupName = a.textContent.trim();
    }
  }
  console.log('贡献者解析：', { entryLi, groupHref, groupName });

  // 插入条目本身图片
  if (coverUrl) {
    console.log('插入封面条目', coverUrl);
    const li = document.createElement('li');
    let html = `
  <a href="${coverUrl}" class="grid thickbox bve-processed" target="_blank">
    <img src="${coverUrl}" width="100" class="grid">`;
    if (groupHref && groupName) {
      console.log('包含贡献者信息');
      html += `
    <p>
      <span class="tip_j">
        by <a href="${groupHref}" class="l bve-processed" target="_blank">${groupName}</a>
      </span>
    </p>`;
    }
    html += `</a>`;
    li.innerHTML = html;
    listEl.insertAdjacentElement('afterbegin', li);
  } else {
    console.info('未获取到封面，跳过首项插入');
  }

  // 列出仓库图片
  async function listFiles() {
    console.log('listFiles：尝试 GitHub API');
    try {
      const apiUrl =
        `https://api.github.com/repos/stay206/bangumi-character/contents/${charId}?ref=main`;
      const res = await fetch(apiUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (res.ok) {
        const js = await res.json();
        if (Array.isArray(js)) {
          const names = js
            .filter(f => f.type === 'file' && /\.(?:jpe?g|png|gif)$/i.test(f.name))
            .map(f => f.name);
          console.log('listFiles：API 结果', names);
          if (names.length) return names;
        }
        console.info('listFiles：API 无图片');
      } else {
        console.warn('listFiles：API 状态', res.status);
      }
    } catch (e) {
      console.warn('listFiles：API 调用失败', e);
    }

    console.log('listFiles：回退 HTML 目录解析');
    try {
      const url = `https://github.com/stay206/bangumi-character/tree/main/${charId}`;
      const res = await fetch(url);
      if (res.ok) {
        const txt  = await res.text();
        const re   = /<a[^>]+class="js-navigation-open"[^>]+title="([^"]+\.(?:jpe?g|png|gif))"/gi;
        const names = [];
        let m;
        while ((m = re.exec(txt))) names.push(m[1]);
        console.log('listFiles：HTML 结果', names);
        if (names.length) return names;
      } else {
        console.warn('listFiles：HTML 状态', res.status);
      }
    } catch (e) {
      console.error('listFiles：HTML 解析失败', e);
    }
    console.info('listFiles：没有可用图片');
    return [];
  }

  // 获取图片提交作者
  async function fetchAuthor(fileName) {
    console.log('fetchAuthor：', fileName);
    try {
      const commitsApi =
        `https://api.github.com/repos/stay206/bangumi-character/commits`
        + `?path=${encodeURIComponent(`${charId}/${fileName}`)}&per_page=1`;
      const res = await fetch(commitsApi);
      if (!res.ok) throw new Error(res.status);
      const js = await res.json();
      const c  = Array.isArray(js) ? js[0] : js;
      const real = c?.commit?.author?.name || '';
      const usr  = c?.author;
      const url  = usr?.html_url || (usr?.login ? `https://github.com/${usr.login}` : '#');
      console.log('fetchAuthor：', fileName, real || usr?.login, url);
      return { name: real || usr?.login || 'unknown', url };
    } catch (e) {
      console.warn('fetchAuthor 失败，使用 unknown', fileName, e);
      return { name: 'unknown', url: '#' };
    }
  }

  // 渲染仓库图片
  const files = await listFiles();
  console.log('准备渲染仓库图片，共', files.length, '项');
  for (const name of files) {
    const author = await fetchAuthor(name);
    const cdnUrls = [
      `https://cdn.jsdelivr.net/gh/stay206/bangumi-character@main/${charId}/${encodeURIComponent(name)}`,
      `https://raw.fastgit.org/stay206/bangumi-character/main/${charId}/${encodeURIComponent(name)}`,
      `https://raw.githubusercontent.com/stay206/bangumi-character/main/${charId}/${encodeURIComponent(name)}`,
      `https://ghproxy.com/https://raw.githubusercontent.com/stay206/bangumi-character/main/${charId}/${encodeURIComponent(name)}`
    ];
    console.log('渲染图片', name, author, cdnUrls);

    let idx = 0;
    const img = document.createElement('img');
    img.width     = 100;
    img.className = 'grid';
    img.src       = cdnUrls[idx];
    img.onerror   = () => {
      idx++;
      if (idx < cdnUrls.length) {
        console.warn('切换 CDN 到', cdnUrls[idx]);
        img.src = cdnUrls[idx];
      }
    };

    const a = document.createElement('a');
    a.href        = cdnUrls[0];
    a.className   = 'grid thickbox bve-processed';
    a.target      = '_blank';
    a.appendChild(img);

    const p = document.createElement('p');
    p.innerHTML = `
      <span class="tip_j">
        by <a href="${author.url}" class="l bve-processed" target="_blank">${author.name}</a>
      </span>`;
    a.appendChild(p);

    const li = document.createElement('li');
    li.appendChild(a);
    listEl.appendChild(li);
  }

  console.log('【BGM 图廊脚本】渲染完成');
})();
