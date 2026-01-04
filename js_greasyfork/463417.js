// ==UserScript==
// @name         LH51
// @namespace    https://lanhuapp.com
// @version      0.2
// @description  配合 vite 的插件使用
// @author       illuz
// @match        https://lanhuapp.com/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463417/LH51.user.js
// @updateURL https://update.greasyfork.org/scripts/463417/LH51.meta.js
// ==/UserScript==

function getQueryParams() {
  const queryString = window.location.hash;
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {};
  let match;
  while ((match = regex.exec(queryString))) {
    const key = decodeURIComponent(match[1].replace(/\+/g, ' '));
    const value = decodeURIComponent(match[2].replace(/\+/g, ' '));
    if (key in params) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  return params;
}

(function() {
    'use strict';
    console.debug('=========蓝湖51 启动')

    let currentImageId = '';

    // 更新 _51_index

    const work = () => {
        console.debug('======== loop')
        // 删除
        const imageId = getImageId(false);
        if (imageId !== currentImageId) {
            let element = document.getElementById("_51_input_wrap");
            element?.remove();
            element = document.getElementById("_51_btn_wrap");
            element?.remove();
            currentImageId = imageId;
        }
        // 增加下载按钮
        tryAddDownloadBtn()
    }

    const getImageId = (throwError = true) => {
        let url = ''
        if (document.querySelector('.annotation_item img')) {
            url = document.querySelector('.annotation_item img').src
            if (url) {
                console.debug('========获取 imageId', url.replace(/.*\//, ''))
                return url.replace(/.*\//, '')
            }
        }
        if (throwError) {
            throw Error('=========没找到 preview image')
        }
    }

    const getPageTitle = () => {
        let title = ''
        if (document.querySelector('.desc-name')) {
            title = document.querySelector('.desc-name').textContent
            if (title) {
                console.debug('========获取 title', title)
                return title
            }
        }
        throw Error('=========没找到 title')
    }

    // 增加下载按钮
    const tryAddDownloadBtn = () => {
        const muRaisedButtonLabel = document.querySelector('.open .down_btn .mu-raised-button-label');
        if (!muRaisedButtonLabel) {
            return;
        }
        // console.debug('=========111')

        const input51 = document.querySelector('#_51_field');
        if (!input51) {
            const input = document.createElement('div');
            input.setAttribute('id', '_51_input_wrap');
            input.innerHTML = 'imageName: <input id="_51_field" style="background: yellow" value="' + document.querySelector('.slice_name').textContent + '"></input>';
            const sliceBtnWrap = document.querySelector('.open .slice_btn_wrap');
            sliceBtnWrap.parentNode.insertBefore(input, sliceBtnWrap);

            const btn = document.createElement('div')
            btn.setAttribute('id', '_51_btn_wrap');
            btn.innerHTML = '<button class="mu-raised-button down_btn mu-raised-button-primary mu-raised-button-inverse mu-raised-button-full" id="_51_btn" type="button" tabindex="0" style="user-select: none; outline: none; cursor: pointer; appearance: none;"><div class="mu-raised-button-wrapper"><div class="mu-ripple-wrapper"></div> <span class="mu-raised-button-label">Copy to project</span></div></button>'
            sliceBtnWrap.parentNode.insertBefore(btn, sliceBtnWrap);

            // 添加点击事件
            btn.addEventListener('click', () => {
                // 获取输入框元素
                var input = document.getElementById("_51_field");
                // 获取输入框的值
                var imageName = input.value;
                if (!imageName) {
                    window.alert('未填写 imageName')
                    input.focus()
                    return
                }
                // 发送 GET 请求
                var xhr = new XMLHttpRequest();
                const urlObj = getQueryParams();
                // console.debug('=========', urlObj);
                const projectId = urlObj['project_id'];
                const pageId = urlObj['pid'];
                const imageId = getImageId();
                const pageName = getPageTitle();
                const width = document.querySelector('.annotation_item li:nth-child(3) div:nth-child(2)').textContent
                const height = document.querySelector('.annotation_item li:nth-child(3) div:nth-child(3)').textContent
                xhr.open("GET", "http://localhost:9719/save_lh_image?imageName=" + imageName
                         + "&projectId=" + projectId
                         + "&pageId=" + pageId
                         + "&pageName=" + pageName
                         + "&imageId=" + imageId
                         + "&width=" + width
                         + "&height=" + height
                        );
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const data = xhr.response;
                        console.debug('==========', data);
                        navigator.clipboard.writeText(data)
                            .then(() => {
                            console.log('Text copied to clipboard');
                            document.querySelector('#_51_btn').textContent = 'Copy OK ~'
                        })
                            .catch((error) => {
                            console.error('Failed to copy text: ', error);
                        });
                    } else {
                        console.error('Request failed. Status code:', xhr.status);
                    }
                };
                xhr.send();
            });
        }
    }

    // 一键复制位置信息
    const util1_copyPosition = () => {
        window.addEventListener('keydown',function(event){
            console.log(event);
            if (event.shiftKey && (event.key == 'a' || event.key == 'A')) {
                const left = document.querySelector('.layer_margin .line_l .layer_margin_info').attributes['data-info'].value || '0px'
                const top = document.querySelector('.layer_margin .line_t .layer_margin_info').attributes['data-info'].value || '0px'
                const width = document.querySelector('.annotation_item li:nth-child(3) div:nth-child(2)').textContent || '0px'
                const height = document.querySelector('.annotation_item li:nth-child(3) div:nth-child(3)').textContent || '0px'
                const data = `
position: absolute;
top: ${top.trim()};
left: ${left.trim()};
width: ${width.trim()};
height: ${height.trim()};
`
                navigator.clipboard.writeText(data)
                    .then(() => {
                    console.log('Text copied to clipboard');
                })
                    .catch((error) => {
                    console.error('Failed to copy text: ', error);
                });
            }
        })
    }

    work()
    setInterval(work, 500)
    util1_copyPosition()
})();
    var $ = window.jQuery;