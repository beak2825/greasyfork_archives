// ==UserScript==
// @name         巴哈貼標籤
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=qwert535286
// @version      0.0.7
// @description  這麼想貼標籤那就一次貼個夠
// @author       You
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448795/%E5%B7%B4%E5%93%88%E8%B2%BC%E6%A8%99%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/448795/%E5%B7%B4%E5%93%88%E8%B2%BC%E6%A8%99%E7%B1%A4.meta.js
// ==/UserScript==

(async () => {
    const tags = await GM_getValue('__bahaHotTags', '')
    const accounts = await GM_getValue('__bahaHotAccs', '')

    const styles = tags
        .split('\n')
        .map(line => line.split(','))
        .map(([tag, bg = '#009cac', color = '#fff']) => `.comment_hot-tag[aria-label="${tag}"] { background: ${bg}; color: ${color}; }`)
        .join('\n')

    GM_addStyle(`
        ${styles}

        .quicktool.__open-dialog { color: var(--quaternary-text); }
        .quicktool.__open-dialog:hover { color: var(--purewhite); }
    `)

    function generate($target = document) {
        accounts
            .split('\n')
            .map(line => line.split(','))
            .forEach(([acc, ...tags]) =>
                $target
                    .querySelectorAll(`.c-reply__item .reply-avatar[href="//home.gamer.com.tw/${acc}"] + .reply-content .reply-content__article`)
                    .forEach($article => {
                        $article
                            .querySelectorAll('.comment_hot-tag')
                            .forEach($tag => ($tag.innerText.trim() !== 'HOT' && $tag.remove()))

                        $article
                            .querySelector('.comment_content')
                            .insertAdjacentHTML('beforebegin', tags.map(t => `<span class="comment_hot-tag" aria-label="${t}">${t}</span>`).join('\n'))
                    })
            )
    }

    setTimeout(generate, 3000) // 等留言跟 HOT 載入完畢

    document
        .querySelectorAll('.more-reply')
        .forEach($more => $more.addEventListener('click', ({ target }) => setTimeout(() => generate(target.closest('.c-post__footer')), 3000)))

    document
        .querySelector('.baha_quicktool > .quicktool')
        .insertAdjacentHTML('beforebegin', '<div class="quicktool iconbtn __open-dialog">編輯<br>標籤</div>')

    document.body.insertAdjacentHTML('beforeend', `
        <dialog id="bahaTagsConfig" class="dialogify">
            <div class="dialogify__content dialogify__autowidth">
                <div>
                    <div class="dialogify__body">
                        <h5 class="dialogify_title"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iJiN4NTcxNjsmI3g1QzY0O18xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEyIDEwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMiAxMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxyZWN0IHk9IjEiIHN0eWxlPSJmaWxsOiM4RDhEOEQ7IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIi8+PHJlY3QgeT0iNyIgc3R5bGU9ImZpbGw6IzhEOEQ4RDsiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiLz48cmVjdCB4PSIzIiB5PSI0IiBzdHlsZT0iZmlsbDojOEQ4RDhEOyIgd2lkdGg9IjMiIGhlaWdodD0iMyIvPjwvZz48L3N2Zz4=">輸入標籤</h5>
                        <textarea class="form-control" name="__bahaHotTags" rows="5" cols="33" placeholder="標籤名稱,背景顏色,字體顏色（新標籤換下一行）">${tags}</textarea>
                        <h5 class="dialogify_title" style="margin-top: 24px;"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iJiN4NTcxNjsmI3g1QzY0O18xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEyIDEwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMiAxMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxyZWN0IHk9IjEiIHN0eWxlPSJmaWxsOiM4RDhEOEQ7IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIi8+PHJlY3QgeT0iNyIgc3R5bGU9ImZpbGw6IzhEOEQ4RDsiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiLz48cmVjdCB4PSIzIiB5PSI0IiBzdHlsZT0iZmlsbDojOEQ4RDhEOyIgd2lkdGg9IjMiIGhlaWdodD0iMyIvPjwvZz48L3N2Zz4=">輸入巴哈帳號及標籤名稱</h5>
                        <textarea class="form-control" name="__bahaHotAccs" rows="5" cols="33" placeholder="巴哈帳號,標籤一,標籤二,....（新帳號換下一行）">${accounts}</textarea>
                    </div>
                    <div class="btn-box text-right">
                        <span class="post__text-small float-left">按下確定後重新整理</span>
                        <button type="button" class="btn btn-insert btn-primary __confirm">確定</button>
                    </div>
                </div>
            </div>
        </dialog>
    `)

    const $dialog = document.querySelector('#bahaTagsConfig')

    document
        .querySelector('.quicktool.__open-dialog')
        .addEventListener('click', () => $dialog.showModal())

    $dialog
        .querySelector('button')
        .addEventListener('click', () => {
            GM_setValue('__bahaHotTags', $dialog.querySelector('[name="__bahaHotTags"]').value)
            GM_setValue('__bahaHotAccs', $dialog.querySelector('[name="__bahaHotAccs"]').value)
            $dialog.close()
        })
})()