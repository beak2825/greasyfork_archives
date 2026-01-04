// ==UserScript==
// @name         Tools DEV 页面所有超链接
// @description  页面所有超链接

// @include      *
// @exclude      https://util.ssslijian.com/bookmark/*
// @exclude      file:/*
// @exclude      http://localhost*
// @exclude      https://nas.ssslijian.com*
// @exclude      http://wechat.xinletuedu.cn*
// @exclude      http://test.xinletuedu.cn*
// @exclude      https://tool.lu/article*

// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body

// @author       AD
// @version      0.1
// @namespace    aboutdev
// @icon         data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/433174/Tools%20DEV%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/433174/Tools%20DEV%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...

    function isUrl(url) {
        return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
    }

    // 获取页面中所有标签中的 URL
    let jsonHrefs = []

    let nodes = document.all;
    for (let i = 0; i < nodes.length; i++) {
        let o = nodes[i]
        , attributes = o.attributes
        for (let ii = 0; ii < attributes.length; ii++) {
            let temp = attributes[ii]
            if (isUrl(temp.value)) {
                let str = o.innerText
                if (str) {
                    // 过滤 tab
                    str = str.replace(/[\t]/g, "");
                    //     console.log(str)
                    // 过滤 回车换行
                    str = str.replace(/[\r\n]/g, " ");
                    //                 str = str.replace(/[\n]/g, "");

                    // 过滤所有的空格
                    // str = str.replace(/[ ]/g, "")
                    // 过滤 将连续空格换成1个
                    str = str.replace(/\s+/g, ' ');
                }

                let href = temp.value

                let lastchar = href.substr(href.length - 1)
                if (lastchar == '/') {
                    href = href.substr(0, href.length - 1)
                    console.log("狗日的")
                }

                let temp1 = {
                    "href": href,
                    "text": str
                }

                jsonHrefs.push(temp1)
            }
        }
        //     console.log(o)
        //     console.log(o.tagName + ',' + o.nodeType + ',' + o.sourceIndex);
    }

    // console.log(jsonHrefs)

    // 去重
    let hash = {}
    jsonHrefs = jsonHrefs.reduce(function(item, next) {
        hash[next.href] ? '' : hash[next.href] = true && item.push(next);
        return item
    }, [])
    console.log(jsonHrefs,'AD 所有超链接');

/*
    // 收藏
    if(jsonHrefs.length>0)
    for (let i = 0; i < jsonHrefs.length; i++) {
        let temp = jsonHrefs[i]
        , url = new URL(temp.href)
        //     console.log(url)

        let data = 'title=' + (temp.text ? temp.text : '无法获取标题') + '&href=' + temp.href + '&protocol=' + url.protocol + '&host=' + url.host + '&type=1&userId=1'
        //     console.log(data)

        let myurl = 'https://nas.ssslijian.com:8881/bookmark/bookmark/insert'
        , xhr = new XMLHttpRequest();
        xhr.open('post', myurl);
        xhr.setRequestHeader('Content-Security-Policy', 'upgrade-insecure-requests');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                console.log('JIANJIANLEE --- 已保存' ,url,xhr.responseText)
            }
        }

    } */

})();