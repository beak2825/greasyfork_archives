// ==UserScript==
// @name         esa on Google
// @namespace    https://github.com/matzkoh
// @version      1.1.0
// @description  show esa search result on google search
// @author       matzkoh
// @include      https://www.google.tld/search?*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.esa.io
// @downloadURL https://update.greasyfork.org/scripts/377210/esa%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/377210/esa%20on%20Google.meta.js
// ==/UserScript==

function $cd30fec69003d10b$export$f22da7240b7add18(queryString) {
  const organization = GM_getValue('esa_organization')
  const container = document.querySelector('#rhs') ?? document.querySelector('#center_col')
  const content = document.createElement('div')
  content.className = 'eog-content'
  content.innerHTML = `
    <style>
      .eog-content { width: 457px; }
      #center_col > .eog-content { position: absolute; left: 105%; top: 0; }
      .eog-mx-1 { margin-left: 0.5rem; margin-right: 0.5rem; }
      .eog-my-1 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
      .eog-mt-1 { margin-top: 0.5rem; }
      .eog-mb-2 { margin-bottom: 1rem; }
      .eog-mr-1 { margin-right: 0.5rem; }
      .eog-flex { display: flex; }
      .eog-row { flex-direction: row; }
      .eog-column { flex-direction: column; }
      .eog-spacer { flex-grow: 1; }
      .eog-pre { white-space: pre-wrap; }
      .eog-weak { opacity: 0.5; }
      .eog-hidden { display: none; }
      .eog-no-post:not(:only-child) { display: none; }
      .eog-post-author-icon { width: 3rem; height: 3rem; border-radius: 50%; }
      .eog-post-updater-icon { width: 1.5rem; height: 1.5rem; border-radius: 50%; align-self: flex-end; }
      .eog-post-wip, .eog-post-name { font-size: 1.25rem; }
      .eog-post-body { word-break: break-word; }
    </style>
    <div class="eog-posts">
      <div class="eog-no-post eog-my-1">Organization を設定してください</div>
    </div>
    <div class="eog-flex">
      <button class="eog-btn-organization">Organization 設定/変更</button>
      <div class="eog-spacer"></div>
      <button class="eog-btn-token">esa トークン 登録/変更</button>
    </div>
  `
  if (organization)
    content.querySelector('.eog-no-post').textContent = `${queryString} にマッチする esa 記事は見つかりませんでした`
  content.querySelector('.eog-btn-organization').addEventListener('click', () => {
    const org = prompt('https://{{この部分を入力}}.esa.io', organization ?? '')
    if (org) {
      GM_setValue('esa_organization', org)
      location.reload()
    }
  })
  content.querySelector('.eog-btn-token').addEventListener('click', () => {
    const token = prompt('/user/applications で発行した Personal access token', '')
    if (token) {
      GM_setValue('esa_token', token)
      location.reload()
    }
  })
  container.appendChild(content)
  if (organization)
    GM_xmlhttpRequest({
      method: 'get',
      url: `https://api.esa.io/v1/teams/${organization}/posts?sort=best_match&per_page=10&q=${queryString}`,
      headers: {
        Authorization: `Bearer ${GM_getValue('esa_token')}`,
      },
      responseType: 'json',
      onerror: renderError,
      onload(res) {
        if (200 <= res.status && res.status < 300) renderContent(res.response)
        else renderError(res.response)
      },
    })
  function renderError(error) {
    const el = document.createElement('div')
    el.className = 'eog-pre'
    el.textContent = `検索に失敗しました：\n${JSON.stringify(error, null, 2)}`
    content.appendChild(el)
  }
  function renderContent(data) {
    const postContainer = content.querySelector('.eog-posts')
    data.posts.forEach(post => {
      const el = document.createElement('div')
      el.className = 'eog-flex eog-post eog-mb-2'
      el.innerHTML = `
        <div class="eog-flex eog-column eog-mr-1">
          <a href="${new URL(`/members/${post.created_by.screen_name}`, post.url)}" class="eog-flex eog-column">
            <img class="eog-post-author-icon eog-flex">
          </a>
          <a href="${new URL(`/members/${post.updated_by.screen_name}`, post.url)}" class="eog-flex eog-column">
            <img class="eog-post-updater-icon eog-flex">
          </a>
        </div>
        <div class="eog-flex eog-column">
          <div class="eog-flex">
            <div class="eog-post-category eog-weak eog-mr-1"></div>
            <div class="eog-post-tags eog-weak"></div>
          </div>
          <div class="eog-my-1">
            <span class="eog-post-wip eog-weak mr-1">WIP</span>
            <a class="eog-post-name"></a>
          </div>
          <div class="eog-flex">
            <div>
              ⭐<span class="eog-post-stargazers-count"></span>
              <span class="eog-weak">/</span>
              👁<span class="eog-post-watchers-count"></span>
              <span class="eog-weak">/</span>
              💬<span class="eog-post-comments-count"></span>
            </div>
            <div class="eog-spacer"></div>
            <div class="eog-post-updated"></div>
          </div>
          <div class="eog-post-body eog-mt-1"></div>
        </div>
      `
      const date = new Date(1 < post.revision_number ? post.updated_at : post.created_at).toLocaleString()
      const isSameUpdater = post.created_by.screen_name === post.updated_by.screen_name
      el.querySelector('.eog-post-author-icon').src = post.created_by.icon
      el.querySelector('.eog-post-author-icon').title = `${post.created_by.screen_name}\n${post.created_by.name}`
      el.querySelector('.eog-post-updater-icon').src = post.updated_by.icon
      el.querySelector('.eog-post-updater-icon').title = `${post.updated_by.screen_name}\n${post.updated_by.name}`
      el.querySelector('.eog-post-updater-icon').classList.toggle('eog-hidden', isSameUpdater)
      el.querySelector('.eog-post-category').textContent = post.category?.replace(/\//g, ' $& ') || ''
      el.querySelector('.eog-post-tags').textContent = post.tags.map(t => `#${t}`).join(' ')
      el.querySelector('.eog-post-wip').classList.toggle('eog-hidden', !post.wip)
      el.querySelector('.eog-post-name').href = post.url
      el.querySelector('.eog-post-name').textContent = post.name
      el.querySelector('.eog-post-stargazers-count').textContent = post.stargazers_count
      el.querySelector('.eog-post-watchers-count').textContent = post.watchers_count
      el.querySelector('.eog-post-comments-count').textContent = post.comments_count
      el.querySelector('.eog-post-updated').textContent = `${1 < post.revision_number ? '更新' : '公開'}：${date}`
      el.querySelector('.eog-post-body').textContent = post.body_md.replace(/^#+\s*|```/gm, '').slice(0, 200)
      postContainer.appendChild(el)
    })
  }
}

const $3c4b2b695963bd2f$var$queryString = new URL(location).searchParams.get('q')
if ($3c4b2b695963bd2f$var$queryString) (0, $cd30fec69003d10b$export$f22da7240b7add18)($3c4b2b695963bd2f$var$queryString)
