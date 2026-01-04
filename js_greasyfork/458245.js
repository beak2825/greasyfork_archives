// ==UserScript==
// @name         巴哈 Vtuber 八卦串 - 集中串整理
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=qwert535286
// @version      0.0.11
// @description  將文章的集中串收集整理
// @author       笑翠鳥
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @match        https://forum.gamer.com.tw/C.php?*bsn=60076*snA=6367604*
// @exclude      https://forum.gamer.com.tw/C.php?*bsn=60076*snA=6367604*s_author=**
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458245/%E5%B7%B4%E5%93%88%20Vtuber%20%E5%85%AB%E5%8D%A6%E4%B8%B2%20-%20%E9%9B%86%E4%B8%AD%E4%B8%B2%E6%95%B4%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458245/%E5%B7%B4%E5%93%88%20Vtuber%20%E5%85%AB%E5%8D%A6%E4%B8%B2%20-%20%E9%9B%86%E4%B8%AD%E4%B8%B2%E6%95%B4%E7%90%86.meta.js
// ==/UserScript==

(async (...mainTags) => {
  const subTagsRegex = /(#[^\d\s-#]{1,15})/gi
  const process = {
    getFloor($floor) {
      return { floor: `#${$floor.dataset.floor}`, link: $floor.href }
    },
    getTags(ctx) {
      const main = mainTags.filter(tag => ctx.includes(tag))[0] || ''
      return { main, sub_tags: ctx.match(subTagsRegex).filter($tag => ![main, '#集中串'].includes($tag)).join(' ') }
    },
    getTwitchId($iframe) {
      return !$iframe ? '' : $iframe.dataset.src.match(/channel=([^&]+)/)[1].toLowerCase()
    },
    getYoutubeId($iframe) {
      return !$iframe ? '' : $iframe.dataset.src.match(/embed\/([^?]+)/)[1]
    },
    getImage(twitch, youtube, $ctx) {
      switch(true) {
        case !!twitch: return 'https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2019/09/3-twitch-is-rebranding-for-the-first-time.jpg'
        case !!youtube: return `https://img.youtube.com/vi/${youtube}/mqdefault.jpg`
        case !!$ctx.querySelector('img'): return $ctx.querySelector('img').dataset.src // lazyload
        case !!$ctx.querySelector('.photoswipe-image'): return $ctx.querySelector('.photoswipe-image').href
        default: return 'https://cdn.discordapp.com/attachments/962944764888637511/1064038516318818364/9721bc5b01f0bb8c.png'
      }
    },
    getLive($ctx) {
      const twitch = this.getTwitchId($ctx.querySelector('.video-twitchvod iframe'))
      const youtube = this.getYoutubeId($ctx.querySelector('.video-youtube iframe'))
      const image = this.getImage(twitch, youtube, $ctx)

      return { twitch, youtube, image }
    },
  }

  const result = [...document.querySelectorAll('.c-post')]
    .filter($post => $post.innerText.includes('#集中串'))
    .map($post => ({
      ...process.getFloor($post.querySelector('.c-post__header__author .floor')),
      ...process.getTags($post.querySelector('.c-article__content').innerText),
      ...process.getLive($post.querySelector('.c-article__content')),
      timestamp: new Date($post.querySelector('.c-post__header__info .edittime').dataset.mtime),
    }))

  result.length && await fetch('https://charming-pasca-93b760.netlify.app/.netlify/functions/write', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  })

  const list = await fetch('https://charming-pasca-93b760.netlify.app/.netlify/functions/read', {
    method: 'GET',
    headers: { Accept: 'application/json' }
  }).then(res => res.json())

  if (!list || !list.length) return

  const focusList = list.map(({ floor, link, main, sub_tags, image }) => `
    <div class="popular__item">
      <a href="${link}">
        <div class="img">
          <div class="tag">${main}</div>
          <img src="${image}">
        </div>
        <p class="name">${[floor, sub_tags].join(' | ')}</p>
      </a>
    </div>
  `).join('\n')

  document.querySelector('.c-section:has(.popular)').insertAdjacentHTML('beforebegin', `
    <section class="c-section">
      <div class="c-section__main popular">
        <h3 class="popular__title">集中串</h3>
        <div class="row">${focusList}</div>
      </div>
    </section>
  `)
})('#Holo', '#彩虹', '#VSPO', '#VShojo', '#VT箱', '#個人勢', '#歌勢', '#中之人', '#炎上')