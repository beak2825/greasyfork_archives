// ==UserScript==
// @name        github outline - github.com
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.05
// @author      TianyiLi-e0991100238@gmail.com
// @description Get Readme file outline at github
// @description:zh-TW Github outline 懸浮視窗
// @downloadURL https://update.greasyfork.org/scripts/393572/github%20outline%20-%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/393572/github%20outline%20-%20githubcom.meta.js
// ==/UserScript==
if (document.querySelector('#readme article')) {
  const styles = /*css*/`
  .outline-reader__ctn {
    position: fixed;
    top: 10vh;
    right: 8vw;
    width: 300px;
    border-radius: 5px;
    background: white;
    border: solid 1px #e0e0e0;
    overflow-y: auto;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    max-height: 60vh;
  }
  .outline-reader__ctn .head {
    cursor: pointer;
    padding: .5rem .7rem;
    font-size: 2rem;
    position: sticky;
    top: 0px;
    background: white;
    border-bottom: solid black 1px;
  }
  .outline-reader__ctn .body {
    padding: .8rem .3rem;
  }
  .outline-reader__ctn a.link {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
  }
  `
  const styleHeads = document.createElement('style')
  styleHeads.innerHTML = styles
  document.querySelector('head').appendChild(styleHeads)
  const canvas = document.createElement('div')
  canvas.classList.add('outline-reader__ctn')
  const markdownDOM = document.querySelector('#readme article')
  function recursiveNodeReader(node) {
    let nodes = [...node.querySelectorAll('h1, h2, h3, h4, h5')]
    let n = nodes.shift()
    let result = []
    do {
      if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(n.tagName.toLowerCase())) {
        result.push({
          text: n.textContent,
          level:
            ['h1', 'h2', 'h3', 'h4', 'h5'].indexOf(n.tagName.toLowerCase()) + 1,
          link: n.querySelector('a').href,
        })
      }
    } while ((n = nodes.shift()))
    return result
  }

  function renderDOM(domTree) {
    return domTree
      .map(
        (node, i) =>
          `<a class="link" style="display:block" title="${node.text}" href="${
            node.link
          }" level="${node.level}">${'│&nbsp;&nbsp;'.repeat(
            node.level - 2 > 0 ? node.level - 2 : 0
          ) +
            (domTree[i + 1]
              ? domTree[i + 1].level < node.level
                ? '└'
                : '├'
              : '└') +
            '─'} ${node.text}</a>`
      )
      .join('')
  }
  const body = document.createElement('div')
  const header = document.createElement('div')
  header.textContent = 'Outline'
  header.classList.add('head')
  body.classList.add('body')

  body.addEventListener('mousedown', e => e.stopPropagation(), {
    capture: true,
  })
  body.addEventListener('click', e => e.stopPropagation(), { capture: true })
  let isMove = false
  let position = {
    x: 0,
    y: 0,
  }
  let target = null
  function eleMove(e) {
    if (!isMove) return
    target.style.top = e.clientY - position.y + 'px'
    target.style.left = e.clientX - position.x + 'px'
    target.style.right = ''
  }
  canvas.addEventListener('mousedown', function(e) {
    isMove = true
    position.x = e.offsetX
    position.y = e.offsetY
    target = this
    window.addEventListener('mousemove', eleMove, true)
  })
  canvas.addEventListener('mouseup', () => {
    isMove = false
    window.removeEventListener('mousemove', eleMove, true)
  })

  body.innerHTML = renderDOM(recursiveNodeReader(markdownDOM))
  canvas.appendChild(header)
  canvas.appendChild(body)

  document.body.appendChild(canvas)
}
