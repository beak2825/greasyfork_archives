// ==UserScript==
// @name         MangaDex Search Page Enhancements
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @description  Adds follow buttons to the search page
// @author       You
// @match        https://mangadex.com/?page=search&title=**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38177/MangaDex%20Search%20Page%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/38177/MangaDex%20Search%20Page%20Enhancements.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let d = document,
      th = d.createElement('th'),
      tableHead = d.querySelector('.table > thead > tr'),
      tableItems = d.querySelectorAll('.table > tbody > tr')

  getFollowedSeries().then(seriesFollowed => {
    insertAfter(th, tableHead.children[1])

    tableItems.forEach(item => {
      let id = item.children[1].firstElementChild.getAttribute('href').split('/')[2],
          td = d.createElement('td'),
          button = d.createElement('button')

      button.classList.add('btn', 'btn-xs')
      button.type = 'button'
      button.dataset.id = id
      button.addEventListener('click', e => toggleFollow(e))

      if (!seriesFollowed.includes(id)) {
        btnFollow(button)
        button.dataset.followed = false
      } else {
        btnUnfollow(button)
        button.dataset.followed = true
      }

      td.appendChild(button)
      insertAfter(td, item.children[1])
    })
  })

  let xhrRequest = url => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: 'GET',
        success: data => resolve(data),
        error: data => reject(data),
        contentType: false,
        processData: false

      });
    })
  }

  function toggleFollow(e) {
    let btn = e.target

    if (btn.dataset.followed === 'false') {
      btn.innerText = 'Following...'

      xhrRequest('/ajax/actions.ajax.php?function=manga_follow&id=' + btn.dataset.id)
        .then(data => {
          $("#message_container").html(data).show().delay(1500).fadeOut()
          btnUnfollow(btn)
        })
        .catch(e => {throw Error(e)})
    } else {
      btn.innerText = 'Unfolowing...'

      xhrRequest('/ajax/actions.ajax.php?function=manga_unfollow&id=' + btn.dataset.id)
        .then(data => {
          $("#message_container").html(data).show().delay(1500).fadeOut()
          btnFollow(btn)
        })
        .catch(e => {throw Error(e)})
    }
  }

  function btnFollow (btn) {
    btn.dataset.followed = false
    btn.innerText = 'Follow'
    btn.classList.add('btn-success')
    btn.classList.remove('btn-danger')
  }

  function btnUnfollow (btn) {
    btn.dataset.followed = true
    btn.innerText = 'Unfollow'
    btn.classList.add('btn-danger')
    btn.classList.remove('btn-success')
  }

  function getPage(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
        } else {
          reject(xhr.statusText)
        }
      }
      xhr.onerror = () => reject(xhr.statusText)
      xhr.responseType = 'document'
      xhr.send()
    })
  }

  function getFollowedSeries() {
    return getPage('https://mangadex.com/follows')
      .then(data => {
      let followedItems = data.querySelectorAll('#manga_followed .table > tbody > tr'),
          listOfFollows = []

      followedItems.forEach(item => {
        listOfFollows.push(item.children[1].firstElementChild.getAttribute('href').split('/')[2])
      })

      return listOfFollows
    })
  }

  function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }
})()