// ==UserScript==
// @name         es6.ruanyifeng.com 优化
// @version      1.2.2
// @description  个人向
// @author       李志林
// @include      https://es6.ruanyifeng.com/*
// @match        https://es6.ruanyifeng.com/*
// @run-at       document-start
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @grant        unsafeWindow
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/85311-%E6%9D%8E%E5%BF%97%E6%9E%97
// @downloadURL https://update.greasyfork.org/scripts/26322/es6ruanyifengcom%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/26322/es6ruanyifengcom%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = '*:not([class*="icon"]):not([class*="stonefont"]):not(i){font-family:Consolas,Microsoft YaHei !important;}'
  document.documentElement.appendChild(style)
  console.log('开始索引')
  // 索引
  let n = 1
  let ROOT
  let selector = []
  while (n < 10) {
    selector.push(`#content h${n}`)
    n++
  }
  let allDom
  let vDoms

  class SplitAndInsert {
    constructor(vDoms, n) {
    }

    split(vDoms, n) {
      let _splitArray = []
      // 找到的标签
      let finds = vDoms.filter(v => v.tag === `H${n}`)
      // 从当前 vDoms 分割找到的标签，push 到 splitArray
      finds.reduce((lastIndex, cur, index, arr) => {
        // 找到的标签对应的 index
        let findIndex = vDoms.indexOf(cur)
        _splitArray.push(vDoms.slice(lastIndex, findIndex)) // 截取 findIndex 之前
        if (index === finds.length - 1) {
          _splitArray.push(vDoms.slice(findIndex)) // 最后一个
        }
        return findIndex
      }, 0)
      _splitArray = _splitArray.filter(v => v.length)
      return _splitArray
    }

    tableTree(_splitArray) {
      return _splitArray.map(v => {
        let item = v[0]
        item.child = v.slice(1)
        return item
      })
    }

    output(vDoms, n) {
      let _splitArray = this.split(vDoms, n)
      return this.tableTree(_splitArray)
    }

    run(vDoms, n) {
      return this.output(vDoms, n).map(v => {
        if (v.child.length) {
          v.child = this.run(v.child, n + 1)
        }
        return v
      })
    }
  }


  class Render {
    constructor(vDom) {
      this.reder(vDom)
      this.lastHash = ''
    }

    createElement(name) {
      return document.createElement(name.toLocaleLowerCase())
    }

    createDom(vDom) {
      let ul = this.createElement('ul')
      vDom.forEach(v => {
        let li = this.createElement('li')
        let title = this.createElement(v.tag)
        title.innerText = Array(Number(v.tag.replace('H', ''))).fill(null).join(' ') + v.text
        title.id = v.id
        li.appendChild(title)
        v.child.forEach(w => {
          let child = this.createElement(w.tag)
          child.innerText = Array(Number(w.tag.replace('H', ''))).fill(null).join(' ') + w.text
          child.id = w.id
          li.appendChild(child)
          if (w.child.length) {
            li.appendChild(this.createDom(w.child))
          }
        })
        ul.appendChild(li)
      })
      return ul
    }

    reder(vDoms) {
      let div = this.createElement('div')
      div.className = 'myIndex'
      div.appendChild(this.createDom(vDoms))
      document.body.appendChild(div)
      document.body.appendChild(this.style())
      setTimeout(() => {
        function getRegHash() {
          try {
            return window.location.hash.match(/^#(\S*)#/)[1]
          } catch (e) {
            return window.location.hash.replace('#', '')
          }
        }

        this.lastHash = getRegHash()
        div.addEventListener('click', (e) => {
          if (e.target.tagName.toLocaleLowerCase().includes('h')) {
            console.log(e)
            let hash = getRegHash()
            if (hash) {
              if (this.lastHash !== hash) {
                document.querySelector('.myIndex').remove()
                init()
              }
              // window.location.hash = `#${hash}#${e.target.id}`
              let target = $(`#content #${e.target.id}`)
              $('html, body').animate({
                scrollTop: target.offset().top,
              }, 200) // 手动跳
              let original_color = target.css('color')
              target.animate({ color: '#ED1C24' }, 500, () => {
                // revert back to orig color
                $(this).animate({ color: original_color }, 2500)
              })
              window.history.pushState(null, null, `#${hash}#${e.target.id}`)
            } else {
              // window.location.hash = `#${e.target.id}`
              window.history.pushState(null, null, `#${e.target.id}`)
            }
          }
        })
      }, 100)
    }

    style() {
      let style = document.createElement('style')
      style.innerText = `      
        .myIndex {
          list-style: none;
          position: fixed;
          right: 0;
          top: 0;
          background: #fff;
          height: auto;
          overflow: hidden;
          line-height: initial;
          opacity: 0.7;
          transition: all .3s;
        }
        .myIndex:hover {
          opacity: 1;
        }
        .myIndex * {
          font-size: 10px;
          cursor: pointer;
        }
      `
      return style
    }
  }

  function init() {
    allDom = document.querySelectorAll(selector.join())
    vDoms = Array.from(allDom).map(v => ({
      tag: v.tagName,
      id: v.id,
      text: v.innerText,
      child: [],
    }))
    console.log(vDoms)
    const splitAndInsert = new SplitAndInsert()
    ROOT = splitAndInsert.run(vDoms, 1)
    new Render(ROOT)
  }

  setTimeout(() => {
    init()
    document.querySelector('#sidebar ol').addEventListener('click', () => {
      document.querySelector('.myIndex').remove()
      n = 1
      selector = []
      while (n < 10) {
        selector.push(`#content h${n}`)
        n++
      }
      setTimeout(init, 1500)
    })
    document.querySelector('#sidebar h1 a').innerHTML = 'ECMAScript 6 指北'
  }, 1500)

})()

