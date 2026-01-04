// ==UserScript==
// @name         [private]上传淘宝联盟推广位到服务器
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2
// @description  上传一下
// @author       windeng
// @match        https://pub.alimama.com/third/manage/record/adzone.htm
// @icon         https://www.google.com/s2/favicons?domain=alimama.com
// @grant        GM_xmlhttpRequest
// @connect      119.29.141.28
// @require      https://greasyfork.org/scripts/433877-%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0-%E5%8B%BF%E5%AE%89%E8%A3%85/code/%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8B%BF%E5%AE%89%E8%A3%85.js?version=978987
// @downloadURL https://update.greasyfork.org/scripts/433878/%5Bprivate%5D%E4%B8%8A%E4%BC%A0%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F%E6%8E%A8%E5%B9%BF%E4%BD%8D%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/433878/%5Bprivate%5D%E4%B8%8A%E4%BC%A0%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F%E6%8E%A8%E5%B9%BF%E4%BD%8D%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

function getCookie(name) {
    var cookies = document.cookie;
    var list = cookies.split("; ") // 解析出名/值对列表

    for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=") // 解析出名和值
        if (arr[0] == name)
            return decodeURIComponent(arr[1]) // 对cookie值解码
    }
    return ""
}

async function GetAdzoneList(page, pageSize) {
    page = page || 1
    pageSize = pageSize || 50
    const t = parseInt(new Date().getTime())
    const tbToken = getCookie('_tb_token_')
    const url = `https://pub.alimama.com/openapi/param2/1/gateway.unionpub/record.adzone.listQuery.json?t=${t}&_tb_token_=${tbToken}&queryKey=&pageNo=${page}&pageSize=${pageSize}&siteSceneCode=&siteId=`
    return Get(url)
}

async function PostData(data) {
    const url = `http://119.29.141.28:30000/api/Tblm/UpdateAdzoneList`
    return Post(url, {
        data: JSON.stringify(data)
    })
}

async function main() {
    await WaitUntil(() => {
        return !!document.querySelector('.btn-brand')
    })
    const btn = document.querySelector('.btn-brand')
    const newBtn = document.createElement('button')
    newBtn.setAttribute('class', 'btn btn-brand')
    newBtn.setAttribute('style', 'margin-right: 10px')
    newBtn.innerText = '上传推广位'
    newBtn.onclick = async () => {
        GetAdzoneList(1, 200).then(resp => {
            console.log('GetAdzoneList', resp)
            PostData(resp.data.result).then(res => {
                showToast(`上传 ${resp.data.result.length} 个推广位成功`)
            }, err => {
                showToast(`上传推广位失败`)
            })
        }, err => {
            showToast(`获取推广位失败，不妨刷新一下页面再试`)
        })
        const resp = await GetAdzoneList(1, 200)
    }
    btn.parentNode.insertBefore(newBtn, btn)
}

(async function() {
    'use strict';

    // Your code here...
    main()
})();