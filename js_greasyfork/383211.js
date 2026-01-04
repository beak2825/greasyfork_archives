// ==UserScript==
// @name           百度经验大图查看
// @version        0.1
// @author         cooper1x
// @description    点击图片即可查看大图，移除了分步阅读功能
// @include        *//jingyan.baidu.com/*
// @run-at         document-end
// @namespace https://greasyfork.org/users/179487
// @downloadURL https://update.greasyfork.org/scripts/383211/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E5%A4%A7%E5%9B%BE%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383211/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E5%A4%A7%E5%9B%BE%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

window.onload = function () {
    // 移除步骤阅读栏目
    var parentDom = document.querySelector(".exp-article");
    var childDom = document.querySelector(".wgt-thumbs");
    parentDom.removeChild(childDom);
    // 彻底隐藏图片悬停分布阅读按钮
    document.querySelectorAll(".enter-step-btn").forEach(element => {
        element.style.display = "none";
    });
    // 样式美化
    // 删除下面间距
    document.querySelector(".wgt-feeds-video").style.paddingBottom = 0;

    // 添加点击图片查看大图功能
    var picDom = document.createElement("img");
    picDom.style.cssText = "display:none;max-width:100%;height:auto;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2019;"
    picDom.src = "https://imgsa.baidu.com/exp/pic/item/42e89c26cffc1e17b347265b4190f603728de9a5.jpg"
    document.body.appendChild(picDom)
    // 点击空白处关闭大图
    document.addEventListener("click", event => {
        console.log(picDom.style.display)
        var cDom = picDom
        var tDom = event.target;
        if (cDom.style.display == "block" && cDom != tDom) {
            cDom.style.display = "none"
            console.log('11166611')

        }
    });

    // 移除所有图片点击跳转链接,防止跳转到分步阅读页面,包括头图
    document.querySelectorAll(".exp-image-wraper").forEach(element => {
        element.href = "javascript:void(0)"
    });

    // 创建iframe
    var iframe = document.createElement("iframe");
    iframe.style.display = "none"
    iframe.src = window.location.href.replace("article", "album")

    // 获取步骤里面的大图
    var imgArr = []
    var baseUrl = "https://imgsa.baidu.com/exp/pic/item/"

    iframe.onload = function () {
        imgArr = []
        iframe.contentWindow.document.querySelectorAll(".step-img-container .img-cover").forEach(element => {
            var filename = element.querySelector(".inner-img-cover").dataset.src
            var thumbUrl = element.querySelector("img").src
            var ext = thumbUrl.substr(thumbUrl.lastIndexOf("."))
            imgArr.push(baseUrl + filename + ext);
            document.querySelectorAll(".exp-image-wraper").forEach((element, idx) => {
                if (idx == 0) {
                    console.log('000')
                } else {
                    element.onclick = function (e) {
                        e.stopPropagation()
                        var idx = [].indexOf.call(document.querySelectorAll(".exp-image-wraper"), this) - 1
                        console.log(idx)
                        picDom.src = imgArr[idx]
                        picDom.style.display = "block"
                    }
                }
            });
            // 头图
            document.querySelector(".exp-image-wraper").onclick = function (e) {
                e.stopPropagation()
                var element = iframe.contentWindow.document.querySelector(".brief-info .inner-img-cover")
                var parent = iframe.contentWindow.document.querySelector(".brief-info .inner-img-cover").parentNode
                console.log(element)
                var filename = element.dataset.src
                var thumbUrl = parent.querySelector("img").src
                var ext = thumbUrl.substr(thumbUrl.lastIndexOf("."))
                picDom.src = baseUrl + filename + ext
                console.log(picDom.src)
                picDom.style.display = "block"
            }
        })
    }
    document.body.appendChild(iframe)
}