// ==UserScript==
// @name         弹窗组件脚本引入
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  没有具体功能 体验下这个插件流程
// @author       jiasheng
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478929/%E5%BC%B9%E7%AA%97%E7%BB%84%E4%BB%B6%E8%84%9A%E6%9C%AC%E5%BC%95%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/478929/%E5%BC%B9%E7%AA%97%E7%BB%84%E4%BB%B6%E8%84%9A%E6%9C%AC%E5%BC%95%E5%85%A5.meta.js
// ==/UserScript==
(function(window){
       //加载外部CSS，资源已在上方resource中
       var newCSS = GM_getResourceText ("customCSS");
       GM_addStyle (newCSS);

       window.onerror = (err) => {
          console.log(err,'custom-modal')
       }

       function createModal({ title, content }) {
           const html = `<button type="button" class="btn btn-primary" onclick="onOpenModal()">open</button>
            <!-- 弹窗 -->
            <div class="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">${title}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="onCloseModal()"></button>
                  </div>
                  <div class="modal-body">
                    ${content}
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="onCloseModal()">取消</button>
                    <button type="button" class="btn btn-primary" onclick={onOkModal()}>确定</button>
                  </div>
                </div>
              </div>
            </div>
          <code id="code"></code>`
           document.body.insertAdjacentHTML('afterbegin', html)
       }

    createModal({
        title: '标题',
        content: '内容'
    })

    function modalEvent() {
        const modal = document.querySelector('#exampleModal')
        const code = document.querySelector('#code')

        window.onOpenModal = function onOpenModal() {
            modal.style.display = 'block'
            code.insertAdjacentHTML(
                'afterend',
                `<div class="modal-backdrop fade show"></div>`
            )
        }

        window.onCloseModal = function onCloseModal() {
            modal.style.display = 'none'
            document.querySelector('.modal-backdrop').remove()
        }

        window.onOkModal = function onOkModal() {
            const isconfrim = window.confirm('是否确认');
            if (isconfrim) {
                window.onCloseModal()
            }
        }
    }
    modalEvent()
})(unsafeWindow)