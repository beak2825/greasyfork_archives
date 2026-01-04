// ==UserScript==
// @name         PasteImage
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  全网粘贴图片为图床链接
// @author       Polygon
// @match        *://*/*
// @icon         data:image/png;base64,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
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448244/PasteImage.user.js
// @updateURL https://update.greasyfork.org/scripts/448244/PasteImage.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // 排除无需执行的网站
    const outlier_urls = ['github', 'localhost:8888']
    const href = location.href
    for (let i=0;i<outlier_urls.length;i++) {
        if (href.includes(outlier_urls[i])) return
    }
    let config = {
        upload: 'Uploading image.png...',
        format: 'url',
        text: ''
    }
    const configs = {
        ubb: {
            urls: ['yaohuo', '52pojie.cn'],
            upload: '[Uploading image.png...][/Uploading image.png...]',
            format: '[img]url[/img]',
            text: ''
        },
        markdown: {
            urls: ['gitee.com', 'greasyfork.org'],
            upload: '![Uploading image.png...]()',
            format: '![img](url)',
            text: ''
        }
    }
    Object.keys(configs).forEach((key) => {
        for (let i=0;i<configs[key].urls.length;i++) {
            if (href.includes(configs[key].urls[i])) {
                config = configs[key]
                break
            }
        }
    })
    let insertText = (obj) => {
        obj.focus()
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            _cursorPos = startPos,
            tmpStr = obj.value,
            cursorPos,
            str
        let id = setInterval(() => {
            str = config.text ? config.text : config.upload
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos = _cursorPos + str.length
            obj.selectionStart = obj.selectionEnd = cursorPos;
            if (config.text) {
                clearInterval(id)
                config.text = ''
            }
        }, 233)

    }
    function pasteListener(event) {
        let ele = document.activeElement
        if (ele.tagName.toLowerCase() == 'body') return
        var items = (event.clipboardData && event.clipboardData.items) || []
        console.log(items)
        if (!(items && items.length)) return
        var file = null
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                insertText(ele)
                let fileObj = items[i].getAsFile();
                console.log(fileObj)
                var reader = new FileReader();
                reader.readAsDataURL(fileObj);
                reader.onloadend = function (e) {
                    let imgFile = e.target;
                    let base64 = imgFile.result.split(',')[1]
                    let form = new FormData()
                    form.append('b64_data', base64)
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://picupload.weibo.com/interface/pic_upload.php?ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog',
                        responseType: 'text',
                        data: form,
                        onload: function (res) {
                            console.log(res)
                            let pid = res.responseText.match(/"pid":"(.+)"/)[1]
                            // http://tva1.sinaimg.cn/large/c5826cc9ly1h4fbvh6ndcj209706hq2t.jpg
                            let imgURL = 'http://tva1.sinaimg.cn/large/' + pid + '.jpg'
                            console.log(imgURL)
                            navigator.clipboard.writeText(imgURL)
                            config.text = config.format.replace('url', imgURL)
                        }

                    })
                }
                break;
            }
        }
    }
    document.addEventListener('paste', pasteListener)
})();