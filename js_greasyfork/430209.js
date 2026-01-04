// ==UserScript==
// @name         巴哈 Vtuber 八卦串 tag 工具欄
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=qwert535286
// @version      0.8.2
// @description  將文章加入 tag 以方便整理，詳情請看該串一樓說明
// @author       笑翠鳥
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @match        https://forum.gamer.com.tw/C.php?*bsn=60076*snA=6367604*
// @match        https://forum.gamer.com.tw/post1.php?*bsn=60076*snA=6367604*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430209/%E5%B7%B4%E5%93%88%20Vtuber%20%E5%85%AB%E5%8D%A6%E4%B8%B2%20tag%20%E5%B7%A5%E5%85%B7%E6%AC%84.user.js
// @updateURL https://update.greasyfork.org/scripts/430209/%E5%B7%B4%E5%93%88%20Vtuber%20%E5%85%AB%E5%8D%A6%E4%B8%B2%20tag%20%E5%B7%A5%E5%85%B7%E6%AC%84.meta.js
// ==/UserScript==

(async style => {
  GM_addStyle(style)

  async function process() {
    const customTags = new Set(await GM_getValue('customTags', []))
    let $iframeEditor
    let $customGroup

    return {
      init() {
        $iframeEditor = document.getElementById('editor').contentWindow.document.body

        const groups = [
          ['直播、預告、發推、新衣、活動、炎上、剪輯翻譯等新情報', ['Holo', '彩虹', 'VSPO', 'VShojo', 'VT箱', '個人勢', '歌勢', '中之人', '炎上', '集中串']],
          ['一般使用', ['創作', '梗圖', '油圖', '性癖', '拜票', '推廣文']],
          ['任何教學文、整理文等串內生態文', ['八卦串']],
          ['客製化標籤，輸入文字新增，用 , 隔開，再輸入一次刪除（不含 # 號）', [...customTags]]
        ]
        const isPost1 = location.href.includes('post1.php')
        const $target = document.querySelector(isPost1 ? '.postset_sign' : '.c-editor .option')

        $target.insertAdjacentHTML('beforeend', `
          <div class="__vtuber-tags">
            ${groups.map(([title, list]) => `
              <div class="__title">${title}</div>
              <div class="__group">${this.getTagTmpls(list)}</div>
            `).join('\n')}
            <input type="${isPost1 ? 'hidden' : 'text'}" placeholder="按 Enter 送出" />
          </div>
        `)

        const $panel = $target.querySelector('.__vtuber-tags')
        $customGroup = [...$panel.querySelectorAll('.__group')].at(-1)

        return [$iframeEditor, $panel]
      },
      getTagTmpls(list) {
        const ctx = $iframeEditor.innerHTML
        return list.map(t => `<button type="button" aria-pressed="${ctx.includes(`<div>#${t}</div>`)}"><span>#</span>${t}</button>`).join('')
      },
      togglePressed($tag) {
        $tag.setAttribute('aria-pressed', $tag.getAttribute('aria-pressed') !== 'true')
      },
      updateCustom(values) {
        values
          .split(',')
          .reduce((acc, tag) => tag.trim() ? [...acc, tag.trim()] : acc, [])
          .forEach(tag => customTags.has(tag) ? customTags.delete(tag) : customTags.add(tag))

        GM_setValue('customTags', [...customTags])

        $customGroup.replaceChildren()
        $customGroup.insertAdjacentHTML('afterbegin', this.getTagTmpls([...customTags]))
      }
    }
  }

  const proc = await process()

  function send(e) {
    if (e.key !== 'Enter') return

    e.preventDefault()

    proc.updateCustom(e.target.value)
    e.target.value = ''
  }

  window.addEventListener('load', async () => {
    const [$iframeEditor, $panel] = proc.init()
    const $input = $panel.querySelector('input')

    $panel.addEventListener('click', ({ target }) => {
      if (target.tagName.toLowerCase() !== 'button') return

      const regexTag = new RegExp(`<(div|p)>${target.innerText}</(div|p)>`, 'g')
      const ctx = $iframeEditor.innerHTML

      regexTag.test(ctx)
        ? $iframeEditor.innerHTML = ctx.replace(regexTag, '')
        : $iframeEditor.insertAdjacentHTML('afterbegin', `<p>${target.innerText}</p>`)

      proc.togglePressed(target)
    })

    $input.addEventListener('keydown', send)
    $input.addEventListener('compositionstart', () => $input.removeEventListener('keydown', send))
    $input.addEventListener('compositionend', () => $input.addEventListener('keydown', send))
  })
})(`
  .__vtuber-tags {
    margin-top: 16px;
    border-top: 2px solid #ececec;
    padding: 8px 0;
    text-align: left;
    font-size: 14px;
  }

  .__vtuber-tags > .__title {
    margin: 16px 0 8px;
  }

  .__vtuber-tags > .__group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .__vtuber-tags button {
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 4px 8px;
    color: #464646;
    background: #d2d2d2;
  }

  .__vtuber-tags button:is(:hover, [aria-pressed="true"]) { color: white; }
  .__vtuber-tags button:hover { background: #11aac1; }
  .__vtuber-tags button[aria-pressed="true"] { background: #148aa4; }

  .__vtuber-tags button > span {
    padding-right: 2px;
    pointer-events: none;
  }

  .__vtuber-tags > input {
    box-sizing: border-box;
    margin-top: 8px;
    width: 100%;
    height: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 8px;
  }

  [data-theme="dark"] .__vtuber-tags {
    border-color: #444;
  }

  [data-theme="dark"] .__vtuber-tags > input {
    border-color: #444;
    color: #c6ccd2;
    background: #1C1C1C;
  }

  [data-theme="dark"] .__vtuber-tags button:not(:is(:hover, [aria-pressed="true"])) {
    border-color: #595959;
    color: #c6ccd2;
    background: #1C1C1C;
  }
`)