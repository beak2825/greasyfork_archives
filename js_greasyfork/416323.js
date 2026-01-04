// ==UserScript==
// @name        知乎 PPT
// @namespace   Violentmonkey Scripts
// @match       https://zhuanlan.zhihu.com/p/*
// @grant       none
// @version     1.0.1
// @author      -
// @description 2020/11/18 下午2:03:00
// @downloadURL https://update.greasyfork.org/scripts/416323/%E7%9F%A5%E4%B9%8E%20PPT.user.js
// @updateURL https://update.greasyfork.org/scripts/416323/%E7%9F%A5%E4%B9%8E%20PPT.meta.js
// ==/UserScript==

// document.addEventListener('DOMContentLoaded', () => {
(() => {
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
    const ops = document.querySelector('.ColumnPageHeader-Button')
    const btn = document.createElement('button')
    btn.className = 'Button Button--blue'
    btn.style.marginRight = '10px'
    btn.textContent = 'PPT演示'
    btn.title = 'PPT 演示'
    btn.onclick = () => {
      const slider = window.SliderDoc(
        {
          title: {
            selector: '.Post-Title',
            global: true,
            type: 'css'
          },
          author: {
            selector: '.AuthorInfo-name .UserLink-link',
            global: true,
            type: 'css'
          },
          lvl0: '.Post-RichText h1',
          lvl1: '.Post-RichText h2',
          lvl2: '.Post-RichText h3',
          lvl3: '.Post-RichText h4',
          lvl4: '.Post-RichText h5',
          lvl5: '.Post-RichText h6',
          code: '.Post-RichText pre',
          image: '.Post-RichText figure, .Post-RichText img',
          text:
            '.Post-RichText table, .Post-RichText p, .Post-RichText > a, .Post-RichText img, .Post-RichText ul, .Post-RichText ol, .Post-RichText li'
        },
        {
          excludes: [
            
          ],
          parseElementTreeConfig: {
            transformNode: node => {
              return node
            }
          },
          renderers: [
            (vNode, ctx, render) => {
              if (vNode.type === 'lvl') {
                return `${ctx.renderSection(
                  `<h${vNode.level + 1}>${htmlEscape(vNode.value)}</h${vNode.level + 1}>`,
                  vNode,
                  ctx
                )}${render(vNode.children)}`
              }
              return render()
            }
          ]
        }
      );
      console.log(slider)
    }
    ops.prepend(btn)
  }, 100)
  
  

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

    await loadScript('https://unpkg.zhihu.com/slider-doc@1/dist/slider-doc.js')
    loadStyle('https://unpkg.zhihu.com/slider-doc@1/dist/style.css')
    

    // await loadScript('http://localhost:8080/slider-doc.js')
    // loadStyle('http://localhost:8080/style.css')
    
    loadStyle('https://unpkg.zhihu.com/reveal.js/dist/theme/solarized.css')
    loadStyle('https://unpkg.zhihu.com/highlight.js@10/styles/zenburn.css')


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
})()
// })
