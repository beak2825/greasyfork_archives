// ==UserScript==
// @name         文泉学堂JPG下载
// @namespace    https://52pojie.cn
// @version      0.60
// @description  文泉学堂JPG下载,在Culaccino脚本基础上修改
// @author       keku
// @match        https://*.wqxuetang.com/read/pdf/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396354/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82JPG%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/396354/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82JPG%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var downloadNum = 0
    var imgBox, nowPage, allPage, doc, size, name, startNum = 1, isStart = false, pageList = [],beginTime = new Date()
    const baseURL = `https://${window.location.host}/`
    if(baseURL.indexOf("www") > -1){window.location.href=window.location.href.replace("www","lib-nuanxin")}
  
  
    const bid = window.location.href.replace(baseURL + "read/pdf/", "")
    const headers = {
        "headers": {
            "User-Agent": navigator.userAgent,
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Cache-Control": "max-age=0"
        },
        "referrer": window.location.href,
        "method": "GET"
    }
  
    function getInfo(url) {
        const data = fetch(url, headers).then(function (res) {
            if (res.status >= 200 && res.status < 300) return res.json();
            else throw new Error(res.statusText)
        })
        data.then(v => {name = v.data.name;print(name)})
    }
  
    Array.prototype.remove = function(val) {
        const index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
    function print(){console.log(...arguments)}

    function createList(now){
        let arr = []
        for(let i = now || nowPage;i < Math.min((now || nowPage) + downloadNum, allPage + 1); i++) arr.push(i)
        startNum = arr[0]
        return arr
    }

    async function autoScroll(num){
        if (pageList.length === 0) {
            console.log('下载完成')
            isStart = false
            return
        }
        print('正在下载第' + pageList[num] + '页','还剩' + (pageList.length - 1) + '页')
        document.documentElement.scrollTop = imgBox[pageList[num]].offsetTop
        var ys = setInterval(function(){
          var h = imgBox[pageList[num]].style.height;
          if(h=='auto'){
            let src = imgBox[pageList[num]].firstChild.getAttribute("src")
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = name + '_' + bid + '_' + pageList[num] + ".jpg"
            a.href = src
            a.dispatchEvent(event)
            pageList.remove(pageList[num])
            clearInterval(ys);
            autoScroll(num);
          }
        },3000)
    }

    window.onload = function(){
        document.getElementById("pagebox").onclick = function(){
            if(!isStart){
                const numBox = document.getElementsByClassName("page-head-tol")[0].innerHTML
                getInfo("https://lib-nuanxin.wqxuetang.com/v1/read/initread?bid=" + bid)
                imgBox = document.getElementsByClassName("page-img-box")
                nowPage = parseInt(numBox.slice(0, numBox.indexOf("/") - 1))
                allPage = imgBox.length - 1
                downloadNum = allPage
                isStart = !isStart
                pageList = createList()
                autoScroll(0)
            }else{
                return
            }
        }
    }
})();