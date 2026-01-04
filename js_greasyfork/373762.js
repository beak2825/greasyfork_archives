// ==UserScript==
// @name         fix zhihu imagepreview 知乎图片查看
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  知乎图片查看
// @author       You
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @require      https://cdn.bootcss.com/document-register-element/1.11.1/document-register-element.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373762/fix%20zhihu%20imagepreview%20%E7%9F%A5%E4%B9%8E%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373762/fix%20zhihu%20imagepreview%20%E7%9F%A5%E4%B9%8E%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cssprop = function createCss({rotate}) {
return {
    transform: `translate(-50%) rotate(${rotate})`,
    position: 'relative',
left: '50%',
    top: '20px',
    cursor: 'default',
}
}

function Ztest(value = 0) {
let img = document.querySelector('.ImageView  img')
img.parentNode.style.overflow = "auto"
let pro = cssprop({
rotate: value + 'deg'
})
for (let key in pro) {
img.style[key] = pro[key]
}
}

class MyControl extends HTMLElement {
  constructor() {
      super()
  // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
        :host {  display: block; position: fixed; right: 20px; top: 50%; width: 120px; transform: translate(0, -50%); z-index: 10000; color: #fff; }
        :host img { max-width: 50px }
        :host input { width: 30px }
      </style>
      <div>
      <input type="range" value="0" step="5" min="0" max="360" style="width: 120px"/>
      <div>度</div>
      </div>
      <div>
      <input type="range" value="20" step="1" min="0" max="1000" style="width: 120px"/>
      <div>top</div>
      </div>
      <div>
      <input type="range" value="1" step="0.1" min="0" max="3" style="width: 120px"/>
      <div>放大</div>
      </div>
    `;
    shadowRoot.children[1].children[0].addEventListener('input', (e) => {
      let _value = Number.parseFloat(e.target.value)
       if (!Number.isNaN(_value)) {
          shadowRoot.children[1].children[1].textContent = '角度: ' +_value + '度'
           let _transform = this.img.style.transform
           this.img.style.transform = _transform.replace(/rotate\(\w+\)/g, 'rotate('+_value+'deg)')
       }
    })

    shadowRoot.children[2].children[0].addEventListener('input', (e) => {
      let _value = Number.parseFloat(e.target.value)
      shadowRoot.children[2].children[1].textContent = 'top: ' +_value + '高'
      this.img.style.top = _value + 'px'
    })
          shadowRoot.children[3].children[0].addEventListener('input', (e) => {
      let _value = Number.parseFloat(e.target.value)
      shadowRoot.children[3].children[1].textContent = '倍数: ' + _value + '倍'
      this.img.style.width = (this.imgWidth * _value) + 'px'
    })
      this._shadowRoot = shadowRoot
  }

  show() {
      let degree = 0
      let top = 20
      let bei = 2
      this.img = document.querySelector('.ImageView  img')
      this.imgWidth = this.img.clientWidth
      this._shadowRoot.children[1].style.display = null
      this._shadowRoot.children[2].style.display = null
      this._shadowRoot.children[3].style.display = null
                        Ztest(0)
       this._shadowRoot.children[1].children[0].value = degree
       this._shadowRoot.children[1].children[1].textContent = '角度: ' + degree + '度'
       this._shadowRoot.children[2].children[0].value = top
       this._shadowRoot.children[2].children[1].textContent =  'top: ' + top + '高'
       this._shadowRoot.children[3].children[0].value = bei
       this._shadowRoot.children[3].children[1].textContent = '倍数: ' + bei + '倍'

      this.img.style.width = (this.imgWidth * bei) + 'px'
  }

  hide() {
      this._shadowRoot.children[1].style.display = 'none'
      this._shadowRoot.children[2].style.display = 'none'
      this._shadowRoot.children[3].style.display = 'none'
  }
}

customElements.define('my-control', MyControl)

        let mycontrol = new MyControl()


    var targetNode = document.body
          var config = { attributes: false, childList: true, subtree: true };

        var callback = function(mutationsList) {
            for(var mutation of mutationsList) {
//                console.log(mutation
                if (mutation.addedNodes && mutation.addedNodes[0] && mutation.addedNodes[0].innerHTML.indexOf('ImageView') > -1 ) {
                    console.log("bang")
                    setTimeout(function() {
                        mycontrol.show()
                    Ztest()
                    }, 0)
                }

                                if (mutation.removedNodes && mutation.removedNodes[0] && mutation.removedNodes[0].innerHTML.indexOf('ImageView') > -1 ) {
                    setTimeout(function() {
                        mycontrol.hide()

                    }, 0)
                }
            }
        };

        var observer = new MutationObserver(callback);

        observer.observe(targetNode, config);


    document.body.appendChild(mycontrol)
       mycontrol.hide()
})();