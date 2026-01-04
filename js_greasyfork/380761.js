// ==UserScript==
// @name         xiami album
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给虾米歌单添加歌曲封面(新版本)
// @description:en insert album for xiami music(for new version)
// @author       Beats0
// @match        https://www.xiami.com/favorite/*
// @match        https://www.xiami.com/collect/*
// @grant        none
// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/380761/xiami%20album.user.js
// @updateURL https://update.greasyfork.org/scripts/380761/xiami%20album.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let href = window.location.href
  let flag = false
  const n = document.cookie.match(/(?:^|;\s*)xm_sg_tk=([^;]*)/); const a = n && n[1]
  if (!a) return

    const showFavoriteAlbum = () => {
    const hasPage = document.querySelector('.rc-pagination-item-active')
    const page = hasPage ? Number(document.querySelector('.rc-pagination-item-active').getAttribute('title')) : 1
    const userId = href.match(/\d+/)[0]
    const params = {
      type: 1,
      pagingVO: {
        page,
        pageSize: 100
      },
      userId
    }

    const r = a.split('_')[0] + '_xmMain_' + '/api/favorite/getFavorites' + '_' + JSON.stringify(params)
    const _s = md5(r)
    const trs = document.querySelectorAll('.table-container table tbody tr')
    if(trs[0].childElementCount !== 5) return
    fetch(`https://www.xiami.com/api/favorite/getFavorites?_q=%7B%22type%22:1,%22pagingVO%22:%7B%22page%22:${page},%22pageSize%22:${params.pagingVO.pageSize}%7D,%22userId%22:%22${userId}%22%7D&_s=${_s}`, {
      method: 'GET'
    }).then(response => response.json())
      .then((data) => {
        if (data.code !== 'SUCCESS') {
          window.alert('请求失败!')
          return
        }
        const { songs } = data.result.data
        songs.forEach((song, index) => {
          const albumEl = document.createElement('td')
          albumEl.innerHTML = `
            <div style="
              display: flex;
              width: 100px;
              height: 100px;
              margin-left: -10px;
          ">
        	<img src="${song.albumLogoS}" style="width: 100%;">
        </div>`
          trs[index].insertBefore(albumEl, trs[index].childNodes[0])
        })
      })
  }
  const showCollectAlbum = () => {
    const hasPage = document.querySelector('.rc-pagination-item-active')
    const page = hasPage ? Number(document.querySelector('.rc-pagination-item-active').getAttribute('title')) : 1
    const listId = Number(href.match(/\d+/)[0])
    const params = {
      listId,
      pagingVO: {
        page,
        pageSize: 30
      }
    }

    const r = a.split('_')[0] + '_xmMain_' + '/api/collect/getCollectSongs' + '_' + JSON.stringify(params)
    const _s = md5(r)
    const trs = document.querySelectorAll('.table-container table tbody tr')
    if(trs[0].childElementCount !== 5) return
    fetch(`https://www.xiami.com/api/collect/getCollectSongs?_q=%7B%22listId%22:${listId},%22pagingVO%22:%7B%22page%22:${page},%22pageSize%22:${params.pagingVO.pageSize}%7D%7D&_s=${_s}`, {
      method: 'GET'
    }).then(response => response.json())
      .then((data) => {
        if (data.code !== 'SUCCESS') {
          window.alert('请求失败!')
          return
        }
        const { songs } = data.result.data
        songs.forEach((song, index) => {
          const albumEl = document.createElement('td')
          albumEl.innerHTML = `
            <div style="
              display: flex;
              width: 100px;
              height: 100px;
              margin-left: -10px;
          ">
        	<img src="${song.albumLogoS}" style="width: 100%;">
        </div>`
          trs[index].insertBefore(albumEl, trs[index].childNodes[0])
        })
      })
  }

  const switchAlbum = () => {
    const collectRe = /ollect/
    const favoriteRe = /favorite/
    if (collectRe.test(href)) {
      showCollectAlbum()
    } else if (favoriteRe.test(href)) {
      showFavoriteAlbum()
    }
  }

  const clickListener = () => {
    const pagers = document.querySelectorAll('.rc-pagination li')
    for (let i = 0; i < pagers.length; i++) {
      pagers[i].addEventListener('click', () => {
        setTimeout(switchAlbum, 2000)
      }, false)
    }
  }

  const injected = () => {
    setTimeout(function () {
      switchAlbum()
      clickListener()
    }, 3000)
  }

  if(!flag) {
    injected()
    flag = true
  }

  document.addEventListener('click', () => {
    const newHref = window.location.href
    if(flag && href !== newHref) {
      injected()
      href = newHref
      console.log(href)
    }
  })
})()
