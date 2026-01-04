// ==UserScript==
// @name        学城 PPT
// @namespace   Violentmonkey Scripts
// @match       https://km.sankuai.com/page/*
// @grant       none
// @version     1.2.1
// @author      -
// @description 2020/11/17 上午2:14:37
// @downloadURL https://update.greasyfork.org/scripts/416220/%E5%AD%A6%E5%9F%8E%20PPT.user.js
// @updateURL https://update.greasyfork.org/scripts/416220/%E5%AD%A6%E5%9F%8E%20PPT.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  const htmlEscape = string => string
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
  
  function debounce(fn, delay) {
    // 定时器，用来 setTimeout
    var timer
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {
      // 保存函数调用时的上下文和参数，传递给 fn
      var context = this
      var args = arguments
      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer)
      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
      // 再过 delay 毫秒就执行 fn
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }

  
  const start = debounce(() => {
    const ops = document.querySelector('.doc-ops')
    const btn = document.createElement('button')
    btn.className = 'ops-item ops-icon-wrapper'
    btn.textContent = 'PPT'
    btn.title = 'PPT 演示'
    btn.onclick = () => {
      const slider = window.SliderDoc(
        {
          title: {
            selector: '.ct-editor-wrapper .ct-title-wrapper .ct-title-p',
            global: true,
            type: 'css'
          },
          author: {
            selector: '.ct-editor-wrapper .ct-doc-info .ct-user-name',
            global: true,
            type: 'css'
          },
          lvl0: '.ct-editor-wrapper .pm-body-wrapper h1',
          lvl1: '.ct-editor-wrapper .pm-body-wrapper h2',
          lvl2: '.ct-editor-wrapper .pm-body-wrapper h3',
          lvl3: '.ct-editor-wrapper .pm-body-wrapper h4',
          lvl4: '.ct-editor-wrapper .pm-body-wrapper h5',
          image: '.ct-editor-wrapper .pm-body-wrapper img',
          text:
            '.ct-editor-wrapper .pm-body-wrapper table, .ct-editor-wrapper .pm-body-wrapper .ct-darwio, .ct-editor-wrapper .pm-body-wrapper p, .ct-editor-wrapper .pm-body-wrapper .ct-code .CodeMirror-code, .ct-editor-wrapper .pm-body-wrapper ul, .ct-editor-wrapper .pm-body-wrapper ol, .ct-editor-wrapper .pm-body-wrapper li'
        },
        {
          parseElementTreeConfig: {
            transformNode: (node) => {
              if (node.type === 'text') {
                if (!node.domNode.textContent.trim() && node.domNode.querySelector('img')) {
                  node.type = 'image'
                  node.value = 'image placeholder'
                  node.domNode = node.domNode.querySelector('img')
                }
              }
              return node
            }
          },
          excludes: [
            '.ct-editor-wrapper .pm-body-wrapper .ct-edit-catalog',
            '.ct-editor-wrapper .pm-body-wrapper .block-wrapper-toolbar',
            '.ct-editor-wrapper .pm-body-wrapper .cloneHeaderBody',
            '.ct-editor-wrapper .pm-body-wrapper .ct-code .header'
          ],
          renderers: [
            (vNode, ctx, render) => {
              const domNode = vNode.domNode
              if (domNode && domNode.querySelectorAll) {
                domNode.querySelectorAll('.ct-code').forEach((node) => {
                  const codeBase = node.querySelector('.CodeMirror-code')
                  const container = document.createElement('section')
                  container.innerHTML = `<pre><code data-trim data-noescape>${htmlEscape(vNode.value)}</code></pre>`
                  node.replaceWith(container)
                })
              }

              return render()
            },
            (vNode, ctx, render) => {
              const domNode = vNode.domNode
              if (domNode && domNode.classList.contains('CodeMirror-code')) {

                return `<pre><code data-trim data-noescape>${htmlEscape(vNode.value)}</code></pre>`
              }

              return render()
            }
          ]
          // renderSectionAttrs: (node, ctx) => {
          //   return ''
          // }
        }
      );
      console.log(slider)
    }
    ops.prepend(btn)
  }, 1000)
  
  

  ;(async () => {

    // console.log(window)
  // window.addEventListener('load', async () => {
    const loadScript = (src) => {
      const s = document.createElement('script')
      s.src = src
      s.async = 'async'
      s.defer = 'defer'

      document.head.appendChild(s)

      return new Promise(resolve => {
        s.onload = resolve
      })
    }
    const loadStyle = (src) => {
      const s = document.createElement('link')
      s.rel = 'stylesheet'
      s.type = 'text/css'
      s.href = src

      document.head.appendChild(s)

      return new Promise(resolve => {
        s.onload = resolve
      })
    }
    
    const addStyle = (css) => {
      const s = document.createElement('style')
      s.type = 'text/css'
      s.textContent = css

      document.head.appendChild(s)
    }

    await loadScript('https://unpkg.sankuai.com/package/slider-doc@1/dist/slider-doc.min.js')
    loadStyle('https://unpkg.sankuai.com/package/slider-doc@1/dist/style.css')
    

    // await loadScript('http://localhost:8080/slider-doc.js')
    // loadStyle('http://localhost:8080/style.css')
    
    loadStyle('https://unpkg.sankuai.com/package/reveal.js/dist/theme/solarized.css')
    loadStyle('https://unpkg.sankuai.com/package/highlight.js@10/styles/zenburn.css')


    if (typeof window.SliderDoc === 'function') {
      var _wr = function(type) {
          var orig = history[type];
          return function() {
              var rv = orig.apply(this, arguments);
              var e = new Event('SliderDoc:' + type);
              e.arguments = arguments;
              window.dispatchEvent(e);
              return rv;
          };
      };
      history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

      // Use it like this:
      window.addEventListener('SliderDoc:replaceState', function(e) {
          
      });
      window.addEventListener('SliderDoc:pushState', function(e) {
        console.log('start')
          start()
      });

      addStyle(
        `.slider-doc-container section li p { display: inline; }
         .slider-doc-container section p * { vertical-align: top; }
         
        .slider-doc-container .ct-task-list .ct-task-li:before, .slider-doc-container .ct-task-list .ct-task-li-checked:before {
          height: 53px;
          left: -27px;
        }
        .slider-doc-container font[data-size] {
          zoom: 2.7;
          line-height: inherit!important;
        }
        .slider-doc-container .ct-mention-view {
          zoom: 2.4;
          // line-height: inherit!important;
        }
        .slider-doc-container .ct-status {
          zoom: 1.5;
          vertical-align: middle;
        }
        .slider-doc-container table * {
          font-size: 20px !important;
          zoom: 1 !important;
        }
        .slider-doc-container table p {
          text-shadow: none;
          font-weight: 500;
          color: #333;
        }
        .slider-doc-container table th p {
          font-size: 22px !important;
          font-weight: 700;
          color: #111;
        }
        
`
      )
      start()
    }

  })()
})
