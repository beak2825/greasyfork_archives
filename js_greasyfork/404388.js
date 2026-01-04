// ==UserScript==
// @name         View User's Watched Repos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  View Watched Repos of the user from the url(#!zh 查看某人watched repos)
// @author       You
// @match        http://*/*
// @include     https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404388/View%20User%27s%20Watched%20Repos.user.js
// @updateURL https://update.greasyfork.org/scripts/404388/View%20User%27s%20Watched%20Repos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var username = window.location.pathname.split('/')[1]

    function loadWatchedRepos() {
        var btn = getBtn()
        btn.innerText += '...'
        return fetch(`https://api.github.com/users/${username}/subscriptions?per_page=100`, {
            headers: {
                Authorization: "token 5b78c08117c10dc24c885665a6794e621b037d30"
            }
        })
            .then(res => res.json())
    }


    function renderList(items) {
        function renderCard(item) {
            return `
        <div class="">
          <a href="${'https://github.com/' + item.full_name}" target="_blank"><h4>${item.full_name} -> 外链</h4></a>
          <div>${item.description}</div>
          <div>stars: ${item.stargazers_count}
<br>语言:${item.language}</div>
        </div>`
    }
      var id = 'watched-repo-list'
      var ul = document.getElementById(id)
      if (!ul) {
          ul = document.createElement('ul')
          ul.id = id
          ul.classList.add('Box')
          ul.style.cssText = 'position: absolute; top: 120px; right: 0; width: 400px; height: 500px;overflow: scroll'

          // add Action
          var actionLi = document.createElement('li')
          actionLi.innerHTML = `<button>折叠/收起</button>`
        actionLi.addEventListener('click', () => {
            ul.style.height = ul.style.height === '500px' ? '50px' : '500px'
        })
        ul.appendChild(actionLi)

    }

      items.forEach(item => {
          var li = document.createElement('li')
          li.innerHTML = renderCard(item)
          li.classList.add('Box-row')
          ul.appendChild(li)
      })
      document.body.appendChild(ul)
  }

    function getBtn () {
        var id = 'watched-repo-btn'
        var btn = document.getElementById(id)
        if (!btn) {
            btn = document.createElement('span')
            btn.classList.add('btn' , 'btn-sm', 'btn-primary')
            btn.innerText = `${username} Watched Repos`
            btn.style.cssText += 'position: absolute; right: 160px; top: 20px'
            document.body.appendChild(btn)

        }
        return btn

    }

    function addBtn() {
        var btn = getBtn()
        btn.addEventListener('click', () => {
            loadWatchedRepos().then(renderList)
        })
        document.body.appendChild(btn)
    }

    addBtn()
})();