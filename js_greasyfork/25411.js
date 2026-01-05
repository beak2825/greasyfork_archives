// ==UserScript==
// @name        自动下载"成为小说家"网站的小说
// @namespace   wu67
// @description 在小说家txt章节下载页(里区同样生效)，自动从(列表的)第一话开始下载所有小说txt档
// @include     /^http:\/\/\w+\.syosetu\.com\/txtdownload\/top\/ncode\/\S+/
// @author      wu67
// @icon        http://himg.baidu.com/sys/portraitl/item/da35115e?t=1460692207
// @license     MIT
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25411/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%22%E6%88%90%E4%B8%BA%E5%B0%8F%E8%AF%B4%E5%AE%B6%22%E7%BD%91%E7%AB%99%E7%9A%84%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/25411/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%22%E6%88%90%E4%B8%BA%E5%B0%8F%E8%AF%B4%E5%AE%B6%22%E7%BD%91%E7%AB%99%E7%9A%84%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

(function() {

    let optionList = document.getElementsByTagName('select')[0].getElementsByTagName('option')
    let listLength = optionList.length
    let form = document.getElementsByTagName('form')[0]

    for (let i = 0; i < listLength; i++) {

        setTimeout(function(j) {

            return function() {
                optionList[j].selected = true
                form.submit()
                console.log('第 ' + j + ' 部分下载完成')
            }

            // 这个下载时间间隔应该是最小的了，再快就会被当做恶意下载封IP了
        }(i), 6000 * i)
    }
})()
