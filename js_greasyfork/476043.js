// ==UserScript==
// @name         自动保存微信公众号页面内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动保存微信公众号页面内容，断网情况下仍可以正常访问页面上所有的图片
// @author       Zep
// @match        https://mp.weixin.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476043/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A1%B5%E9%9D%A2%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/476043/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A1%B5%E9%9D%A2%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    function downloadPage(stringData, filename) {
        // dada 表示要转换的字符串数据，type 表示要转换的数据格式
        const blob = new Blob([stringData], {
            type: "text/plain;charset=utf-8"
        })
        // 根据 blob生成 url链接
        const objectURL = URL.createObjectURL(blob)
        // 创建一个 a 标签Tag
        const aTag = document.createElement('a')
        // 将a标签添加到文档中
        document.body.append(aTag)
        // 设置文件的下载地址
        aTag.href = objectURL
        // 设置保存后的文件名称
        aTag.download = filename
        // 给 a 标签添加点击事件
        aTag.click()
        // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
        // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
        URL.revokeObjectURL(objectURL)
    }


    function urlToBase64(url, item) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
            image.setAttribute("crossOrigin", 'Anonymous');
            image.src = url;
            image.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                // 将图片插入画布并开始绘制
                canvas.getContext('2d').drawImage(image, 0, 0);
                // result
                let result = canvas.toDataURL('image/png')
                // console.log('base64Url', result)
                $(item).attr('src', result)
                resolve(result);
            };
            // 图片加载失败的错误处理
            image.onerror = () => {
                reject(new Error('urlToBase64 error'));
            };
        })
    }

    window.onload = function () {
        document.documentElement.scrollTop = 0
        let promiseArr = []
        $('html').animate({scrollTop: document.documentElement.offsetHeight}, 5000, 'swing', function(){
            console.log('===滚动到底部成功， 开始解析图片url， 转为base64===')
            const imgs = $('img')
            console.log('===页面存在图片张数为：', imgs.length + '===')
            for(let i = 0 ; i< imgs.length; i++) {
                const src = $(imgs[i]).attr('src')
                // console.log('src', src)
                if(src && src.includes('http')) {
                    promiseArr.push(urlToBase64(src, imgs[i]))
                }
            }
            //  console.log('promiseArr', promiseArr)
            Promise.all(promiseArr).then((res) => {
                console.log('===页面所有图片解析成功，开始下载保存页面内容===')
                // 要保存的字符串
                // const stringData = '<h2>一段文本.</h2>'
                const stringData = $('body').html()
                const filename = ($('#activity-name').text() || document.title).trim() + '.html'
                // console.log(stringData)
                downloadPage(stringData, filename)
                console.log('===下载保存页面内容成功！===')

            }, (err) =>{
                console.log('===图片解析失败，请刷新页面重试！===')
            })
        });
    }
})();