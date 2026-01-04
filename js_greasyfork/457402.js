// ==UserScript==
// @name         旧5ch 画像&動画etc
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  画像 & YouTube動画読込表示 / 画像レス & 板リンク抽出 / jump(リンク中継ページ)無効 / 規制回避リンク認識 / シンプルな見た目
// @author       匿名Cat
// @match        https://*.5ch.net/test/read.cgi/*/*
// @match        http://*.5ch.net/test/read.cgi/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @resource     bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css
// @icon         https://www.google.com/s2/favicons?domain=5ch.net
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457402/%E6%97%A75ch%20%E7%94%BB%E5%83%8F%E5%8B%95%E7%94%BBetc.user.js
// @updateURL https://update.greasyfork.org/scripts/457402/%E6%97%A75ch%20%E7%94%BB%E5%83%8F%E5%8B%95%E7%94%BBetc.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('5ch 画像&動画')
  $?.noConflict()

  // 設定開始================
  'jpg png webp jpeg gif'
  const settings = {
    imgExts: 'jpg png webp jpeg gif'.split(' '),
    keys: { download: ['d'], removePreview: ['c', 'Escape']}
  }

  // 直接生成型画像 サイズ
  const size = '8rem'
  const userScriptId = "ch_im_and_video__"
  // 設定終了==============

  // bootstrap style読み込み
  GM_addStyle(GM_getResourceText("bootstrap.min.css"))

  // util
  const d = document
  const isImageUrl = url => new RegExp(`\\.${settings.imgExts.join('|')}$`, 'g').test(url)
  const utilUnion = arr => [...new Set(arr)]
  const optionalHttps = hrefStr => /^https?:\/\//.test(hrefStr) ? hrefStr : 'https://' + hrefStr
  const remove5chJump = url => {
    const mtc = url.match(/(?:https?:\/\/jump\.5ch\.net\/\?)(.+)/)
    return mtc?.[1] ?? url
  }

  const style = `html { font-size: 1rem; }

  /* 画像プレビュー周り */
  .container.container_body { width: 100%; max-width: 100%; margin: 0; padding: 0; display: flex; position: relative; }
  .container.container_body>.contents { width: 60vw; padding-left: 4vw; height: 100vh; overflow: auto; resize: horizontal; }
  .side-container { flex: 1; position: relative; }
  .settings-win { position: absolute; top: 0; }
  .preview-img-box:before { content: ""; display: block; padding-top: 75%; }
  .preview-img-box>img { position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; max-height: 100vh; object-fit: contain; z-index: 3;}
  a.image { font-size: 0; }

  /* ナビゲーションバー */
  #${userScriptId} { position: sticky; top: 0; background-color: #fff; }
  #${userScriptId} .title { margin-top: 0; padding-top: 20px; }
  #${userScriptId}extract_im { cursor: pointer; }
  #${userScriptId} .related-thread { display: inline-block; }
  #${userScriptId}relations { font-size: inherit; }

  /* 5ch公式のGUI */
  .topmenu.centered,.bottommenu.centered,.input-group { display: none; }
  .submitbtn.btn { font-size: inherit; }
  .rBtn { border: none; }
  .post_hover { z-index: 3; }
  .menujust { margin:0; padding-left: 0; }

  /* お絵かき */
  .wPaint-canvas { box-shadow: 0 0 2rem rgba(0, 0, 0, .2); }`

  jQuery(d).ready($ => {
    const $body = $(d.body)

    // スタイルをあてる
    $body.append($('<style>').addClass(userScriptId).text(style))

    const urlObj = new URL(location.href)
    const imageExtSelectors = settings.imgExts.map(ext => `a[href$=".${ext}"]`).join(',')
    const imageStyle = {height: size, width: size, objectFit: 'contain'}
    const posts = $('.post,dd').get()

    // ボード名など抽出
    const urlMtc = location.href.match(/https?:\/\/(.+\.5ch\.net)\/test\/read.cgi\/(\w+)\/.*/)
    const boardName = urlMtc?.[2]
    const boardTopHref = urlMtc ? `//${urlMtc[1]}/${urlMtc[2]}` : ''

    // 以下、独自ナビバー関連機能
    $('.container.container_body').arrive('.contents', contents => {
      const $nav = $('<nav>', {id: `${userScriptId}`})
      const $contents = $(contents)
      $contents.prepend($nav)
      $nav.html(`
      <a href="${boardTopHref}">板Top</a>
      <a href="/${boardName}/subback.html">スレッド一覧<a>
      <a id="${userScriptId}extract_im" class="link">画像スレ抽出</a>
      <div class="related-thread">
        <a class="dropdown-toggle" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">関連スレ</a>
        <ul id="${userScriptId}relations" class="dropdown-menu" aria-labelledby="dropdownMenuLink"></ul>
      </div>
      `)
      $nav.prepend($contents.children('.title'))
      // 公式ナビバーを削除
      $('nav.search-header').remove()

      // 画像スレだけ抽出機能
      posts.forEach(post => /* 改行削除、正規化 */$(post).css({display: 'block'}).next('br').remove())
      const $notImgPosts = $(posts.filter(post => {
        const $post = $(post)
        return !$post.find('.image,img')[0] && !$post.find('a').get().some(a => isImageUrl($(a).attr('href')))
      }))
      let flag = false
      const showImgPost = bool => $notImgPosts.css({display: bool ? 'block' : 'none'})
      $(`#${userScriptId}extract_im`).click(() => {
        showImgPost(flag)
        flag = !flag
      })

      // 関連スレURL候補 抽出
      const regMain = /(https:.+?)\/(\d+)(\/[\d-]+)?/
      const mainLocationHref = location.href.match(regMain)?.[1]
      if (mainLocationHref) {
        const relationHrefs = posts.flatMap(post => {
          return $(post).find('.escaped').find('a').get().map(a => {
            const href = a.getAttribute('href')
            const idx = href.indexOf(mainLocationHref)
            return idx < 0 ? undefined : href
          }).filter(Boolean)
        })
        utilUnion(relationHrefs).forEach(relationHref => {
          let url
          try { url = new URL(relationHref) } catch (e) { console.warn(e) }
          const txt = relationHref.match(regMain)?.[2] ?? url.pathname ?? relationHref
          const $li = $('<li>').addClass('dropdown-item')
          const a = $('<a>').attr({ href: relationHref, target: '_blank' }).text(txt)
          $li.append(a).appendTo(`#${userScriptId}relations`)
        })
      }
    })// 以上、独自ナビバー関連機能

    // 書き込みボタンを強調表示
    $(".submitbtn.btn").addClass('btn btn-primary')

    // プレビュー画面を用意
    const $thread = $('.container.container_body')
    $thread.wrapInner($('<div>').addClass('contents'))
    const $sideContainer = $('<div>').addClass('side-container')
    const $settingsWin = $('<div>').addClass('settings-win').appendTo($sideContainer).html(`画像プレビュー`)
    const $previewImgBox = $('<div>').addClass('preview-img-box').appendTo($sideContainer)
    $thread.append($sideContainer)
    // プレビュー関数
    const addPreview = imgUrl => $previewImgBox.append($('<img>', {src: imgUrl}))
    const removePreview = () => $previewImgBox.empty()
    $(d).on('keydown', e => { if (settings.keys.removePreview.includes(e.key)) removePreview() })

    // 曖昧リンクを認識
    $('.post .escaped,dd').get().forEach(txtField => {
      const nodes = $(txtField).contents().get().filter(node => node.nodeType === 3).forEach(txtNode => {
        const $txtNode = $(txtNode)
        const txt = $txtNode.text()
        const mt = txt.match(/(\S*?)(\/\/\S+)/)
        if (!mt) return
        const isHttp = mt[1].lastIndexOf('p:') == mt[1].length - 2
        $txtNode.after($('<a>', {href: `http${isHttp ? '' : 's'}:${mt[2]}`, target: '_blank'}).text(txt))
        $txtNode.remove()
      })
    })

    const $links = $('.escaped a,dd a')
    const $imageLinks = $(`a.image,${imageExtSelectors}`)

    // リンク描画時
    $links.get().forEach(link => {
      const $link = $(link)
      const href = optionalHttps(remove5chJump($link.attr('href')))
      if (typeof href !== 'string') return
      const patterns = [/^.+:\/\/(?:www|m)\.youtube\.com.*?v=([\w-=]+).*$/, /^.+:\/\/youtu\.be\/([\w-=]+).*$/, /^.+:\/\/www\.youtube\.com\/embed\/([\w-=]+).*$/]
      let match
      for (const pattern of patterns) {
        const mt = href.match(pattern)
        if (mt) { match = mt; break }
      }
      if (!match) {
        // 5ch外部サイト中継ページ無効化
        if (!isImageUrl(href)) $link.attr('href', href)
        return
      }
      // 以降 YouTube iframe 生成
      $link.text('')
      $link.after(
        $('<iframe>', {src: `https://www.youtube.com/embed/${match?.[1]}?controls=1`})
        .attr({frameborder: 0, allowfullscreen: ''})
        .css({width: '40rem', height: '22.5rem'})
      )
    })
    // 小サイズ画像の見た目の処理
    const previewImgByHover = $img => {
      $img.on('mouseover', ({target}) => {removePreview(); addPreview($(target).attr('src'))})
    }
    $imageLinks.get().forEach(imageLink => {
      const $imageLink = $(imageLink)
      setTimeout(() => {
        if ($imageLink.children('[div="thumb5ch"]')[0]) return
        // 小サイズ画像が生成されてなかったら
        const imgUrl = optionalHttps(remove5chJump($imageLink.attr('href')))
        if (!imgUrl) return
        const $addImg = $('<img>', {src: imgUrl, loading: 'lazy'}).css(imageStyle)
        $imageLink.after($addImg)
        previewImgByHover($addImg)
      }, 2000)
      $imageLink.children('div').css({display: 'inline', width: 'initial'})
        // 改行を削除
      $imageLink.next('br').remove()
    })

    // マウスホバーしたら画像をプレビュー
    let previewImgUrl
    $imageLinks.on('click', e => e.preventDefault())
    $imageLinks.on('mouseover', ({currentTarget}) => {
      removePreview()
      const imgUrl = optionalHttps(remove5chJump($(currentTarget).attr('href')))
      if (!imgUrl) return
      previewImgUrl = imgUrl
      addPreview(imgUrl)
    })

    // リプライレスに画像プレビューを適応
    $body.arrive('[id^="reply"]', el => previewImgByHover($(el).find('img')))

    // Dキー押下でプレビュー画像ダウンロード
    $(d).on('keydown', e => {
      if (!settings.keys.download.includes(e.key) || !previewImgUrl) return
      GM_download({url: previewImgUrl, name: previewImgUrl.replace(/^.+\//, ''), onerror: console.warn})
    })
  })
})();