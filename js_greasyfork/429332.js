// ==UserScript==
// @name         b站番剧播放页内跳转樱花搜索
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  打开播放页面发现没会员？点击页面右侧的樱花图标跳转至樱花动漫观看
// @author       kakasearch
// @match        https://www.bilibili.com/bangumi/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB3aWR0aD0iODAwcHQiIGhlaWdodD0iODAwcHQiIHZpZXdCb3g9IjAgMCA4MDAgODAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8ZyBpZD0iI2ZmN2YwMmZmIj4NCjxwYXRoIGZpbGw9IiNmZjdmMDIiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUzNi42OCAxNTYuMDYgQyA1MzYuODQgMTQ2Ljk3IDU0Mi4yNyAxMzguMTIgNTUwLjkyIDEzNC44NiBDIDU1Mi44NSAxNDMuODYgNTU0LjcyIDE1Mi44NyA1NTYuNjAgMTYxLjg3IEMgNTU3LjA2IDE2NS4yOSA1NTkuNTcgMTY3LjgxIDU2MS4zNiAxNzAuNTkgQyA1NzMuNjcgMTY5LjYzIDU4Ni41NCAxNzEuMzUgNTk3LjM0IDE3Ny42NSBDIDYwOC41MyAxODQuMDUgNjE2Ljk0IDE5NC44MSA2MjEuMjIgMjA2LjkwIEMgNjI2LjEyIDIxNy4wOCA2MzcuMjAgMjIzLjUyIDYzOS41NiAyMzUuMDUgQyA2MzcuNjIgMjQ3LjIzIDYzNS40OCAyNTkuOTggNjI4LjUyIDI3MC40NSBDIDYyMi40NCAyNzkuNjMgNjEyLjA3IDI4NC45NyA2MDEuNTMgMjg3LjIxIEMgNTkwLjgxIDI4OS4zOCA1NzkuMzIgMjg5LjkwIDU2OS43MiAyOTUuNjkgQyA1NjUuODYgMjk3Ljk3IDU2Mi4wOCAzMDIuMjYgNTYzLjQ2IDMwNy4wOCBDIDU3MS44NiAzNDMuNDcgNTc0LjU5IDM4MS42NiA1NjcuMjkgNDE4LjQ3IEMgNTYyLjI2IDQ0My4zNSA1NTIuODUgNDY3Ljc4IDUzNy4yMCA0ODcuOTYgQyA1MzMuMzcgNDkzLjE2IDUyOC4wNSA0OTcuMTYgNTI0LjgyIDUwMi44MiBDIDUxOS42MyA1MTEuNTEgNTE4LjE0IDUyMi4wMyA1MTkuNTIgNTMxLjk2IEMgNTIwLjAwIDU0OC4zMCA1MjUuNzcgNTYzLjgyIDUzMC45OSA1NzkuMTIgQyA1MzkuOTUgNjA0LjA5IDU1MC41NSA2MjguNDMgNTYxLjU2IDY1Mi41NiBDIDU2NS45MyA2NTMuNzUgNTcwLjg1IDY1My42MCA1NzQuNjcgNjU2LjMyIEMgNTc5LjA3IDY1OS4xOSA1ODMuNjcgNjYyLjc0IDU4NS4yMyA2NjguMDAgQyA1ODYuNzAgNjcyLjk3IDU4My43OSA2NzcuOTQgNTgwLjIxIDY4MS4yMCBDIDU3Ny40OSA2ODQuMDAgNTczLjU2IDY4NC44MyA1NzAuMDAgNjg2LjAyIEMgNTYwLjY5IDY4OC44MCA1NTAuMjQgNjg5Ljk1IDU0MS4xMSA2ODUuOTIgQyA1MzMuOTIgNjgyLjgzIDUyOC41OSA2NzYuNDAgNTI1Ljk1IDY2OS4xMyBDIDUxNC4zMiA2NjcuOTIgNTAzLjcwIDY2MS4zMyA0OTYuODUgNjUxLjk1IEMgNDg1Ljc5IDYzNy4xMiA0ODEuMjUgNjE4LjcyIDQ3Ny41NyA2MDAuOTAgQyA0NzUuMjkgNTkwLjU0IDQ3NC42NSA1NzkuMzggNDY4LjgxIDU3MC4xOSBDIDQ2Ni4xMCA1NjUuNzcgNDYxLjc0IDU2Mi4yNiA0NTYuNTEgNTYxLjQ2IEMgNDU1Ljk0IDU3Ny42MSA0NDkuNzAgNTkyLjk1IDQ0Mi4wMiA2MDYuOTUgQyA0MzcuMjYgNjE1Ljg2IDQzMC4zOCA2MjMuODcgNDI4LjA4IDYzMy45MyBDIDQyNi45NSA2MzguMzQgNDI3LjU2IDY0My43NSA0MzEuNDMgNjQ2LjY2IEMgNDM1Ljg3IDY1MC4xNiA0NDEuODAgNjQ5LjcxIDQ0Ny4xMSA2NTAuMjcgQyA0NTYuNDYgNjUxLjE0IDQ2NS44NyA2NTEuNjUgNDc1LjIwIDY1Mi43NiBDIDQ4Mi44NSA2NTQuOTMgNDkxLjI1IDY1OC4yNiA0OTUuMzggNjY1LjUzIEMgNDk4Ljg0IDY3MS45MyA0OTUuOTUgNjc5LjUzIDQ5MS44MSA2ODQuODUgQyA0NjUuMTggNjg1LjAyIDQzOC41NSA2ODUuODkgNDExLjk2IDY4Ny40MCBDIDM5NS45NiA2ODguMjggMzc5LjkzIDY4OS43NSAzNjMuOTAgNjg4Ljc2IEMgMzU0LjM5IDY4OC4xMyAzNDQuNjMgNjg2LjU4IDMzNi4yNSA2ODEuODEgQyAzMzAuNTggNjc4LjY2IDMyNS45MCA2NzQuMTIgMzIxLjMzIDY2OS41OSBDIDMxNC42OCA2NjMuMDUgMzA1LjA0IDY2MC43MyAyOTUuOTYgNjYwLjU3IEMgMjgyLjE0IDY2MC4zNyAyNjguNDcgNjYzLjk3IDI1NS45MSA2NjkuNTcgQyAyNDQuMzggNjc1LjIwIDIzMi4yMCA2NzkuMzUgMjE5Ljk4IDY4My4xOSBDIDE5NS4yNiA2OTAuNzMgMTY5Ljg1IDY5Ni41OCAxNDQuMDEgNjk4LjMzIEMgMTI4Ljg4IDY5OS4xNSAxMTMuMjAgNjk4Ljg2IDk4Ljg3IDY5My40MCBDIDg4LjkwIDY4OS42NCA3OS44MSA2ODIuMDEgNzYuNTkgNjcxLjU4IEMgNzQuMjAgNjYzLjg3IDc2LjcyIDY1NS41NiA4MS4xOSA2NDkuMTMgQyA4Ny43MCA2MzkuNzIgOTYuOTMgNjMyLjYyIDEwNi4zOSA2MjYuMzcgQyAxMjIuMjggNjE1Ljk1IDEzOS45MCA2MDguNjQgMTU3LjQxIDYwMS40MyBDIDE2NS40MSA1OTguMzEgMTczLjQzIDU5NS4wNSAxODEuODUgNTkzLjIzIEMgMTg0LjE5IDU5Mi42MiAxODYuNjMgNTkyLjYyIDE4OC45OCA1OTMuMjQgQyAxODkuMDEgNTk2Ljg4IDE4Ni42MSA1OTkuNzkgMTg0LjM5IDYwMi40MiBDIDE3OS41NiA2MDcuOTMgMTczLjk0IDYxMi42OCAxNjguMzEgNjE3LjM0IEMgMTY2LjI3IDYxOC45OCAxNjQuMjcgNjIwLjczIDE2MS44OCA2MjEuODQgQyAxNTEuMTEgNjI2LjgwIDE0MC40MiA2MzIuMDEgMTMwLjQ1IDYzOC40NiBDIDEyNi41NCA2NDEuMTAgMTIyLjUxIDY0My43OSAxMTkuNTkgNjQ3LjU2IEMgMTE4LjM5IDY0OS4xMyAxMTcuMjggNjUxLjUwIDExOC42OSA2NTMuMzEgQyAxMjAuODQgNjU2LjIxIDEyNC43MSA2NTYuOTMgMTI4LjA4IDY1Ny4zMCBDIDEzNS4xNSA2NTcuODMgMTQyLjIzIDY1Ni44MyAxNDkuMTkgNjU1LjY4IEMgMTY3LjM3IDY1Mi40MyAxODUuMTYgNjQ3LjM3IDIwMi45NyA2NDIuNTYgQyAyMTUuODQgNjM5LjA3IDIyNy4zOCA2MzAuMTMgMjMyLjc3IDYxNy43OCBDIDIzNC4zOCA2MTQuMTggMjM1LjYxIDYxMC40MSAyMzYuMzUgNjA2LjU0IEMgMjM4Ljk3IDU4NS4wOSAyNDMuMjUgNTYzLjg1IDI0OC4zOSA1NDIuODYgQyAyNTcuODMgNTA1LjA0IDI3MS4zMCA0NjcuOTQgMjkxLjI3IDQzNC4zNCBDIDMwNy43NiA0MDYuNTMgMzI5LjAyIDM4MS4zMyAzNTQuOTQgMzYxLjg3IEMgMzY5LjU0IDM1MC43OCAzODUuNjQgMzQxLjg2IDQwMi4xNSAzMzMuOTQgQyA0MDcuNDUgMzMxLjE1IDQxMy4zNiAzMjguOTggNDE3LjQ3IDMyNC40NCBDIDQyOC40MSAzMTIuODggNDQzLjc1IDMwNi4zNiA0NTMuNzggMjkzLjgxIEMgNDU4LjI3IDI4OC4zNiA0NjEuNTkgMjgxLjk1IDQ2My4zOSAyNzUuMTIgQyA0NjcuMTQgMjU5LjcyIDQ3NC4xOCAyNDUuNDAgNDgxLjQ0IDIzMS40MSBDIDQ4OC4yMiAyMTguNDQgNDk1Ljg1IDIwNS45MiA1MDMuNTAgMTkzLjQ2IEMgNTA0LjQ2IDE4MS40OCA1MDYuNTcgMTY5LjIzIDUxMi43MSAxNTguNzAgQyA1MTYuMjkgMTUyLjMyIDUyMS4xMiAxNDYuNTkgNTI3LjE1IDE0Mi40MSBDIDUzMC4zMyAxNDYuOTUgNTMzLjU1IDE1MS40NyA1MzYuNjggMTU2LjA2IFoiIC8+DQo8L2c+DQo8ZyBpZD0iIzJjMmMyY2ZmIj4NCjxwYXRoIGZpbGw9IiMyYzJjMmMiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDEyMi40NiAzNTQuNDUgQyAxMjUuMDUgMzUyLjQ1IDEyNy40MiAzNDkuNDUgMTMwLjk5IDM0OS40NiBDIDEzNS4yNyAzNDkuNDMgMTQwLjgzIDM0OC4zNyAxNDMuNzMgMzUyLjQxIEMgMTQ2LjI2IDM1NS4zNiAxNDUuNDggMzYwLjEwIDE0Mi40MyAzNjIuMzggQyAxMDYuNTUgMzkyLjM3IDcwLjU5IDQyMi4yNyAzNC42OCA0NTIuMjIgQyA3MC40OCA0ODIuMTAgMTA2LjM0IDUxMS45MiAxNDIuMTQgNTQxLjgwIEMgMTQ0LjYwIDU0My42NiAxNDYuMDQgNTQ2Ljk4IDE0NC44OCA1NDkuOTkgQyAxNDMuMjMgNTU0LjI0IDEzOC4yMiA1NTYuNDQgMTMzLjg3IDU1NS43NyBDIDEyOS45MCA1NTUuMjkgMTI3LjEzIDU1Mi4xNCAxMjQuMTcgNTQ5Ljc4IEMgODYuNTMgNTE4LjQzIDQ4LjkyIDQ4Ny4wMiAxMS4yNSA0NTUuNzAgQyA5LjIzIDQ1My4wMSA5LjE5IDQ0OC4yMyAxMi4yOCA0NDYuMjcgQyA0OS4wMyA0MTUuNjkgODUuNzMgMzg1LjA1IDEyMi40NiAzNTQuNDUgWiIgLz4NCjxwYXRoIGZpbGw9IiMyYzJjMmMiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDY1Ni40MSAzNTQuMzMgQyA2NTkuMDggMzQ5LjE0IDY2Ni41MCAzNDcuNTggNjcxLjI2IDM1MC43NyBDIDY3My44MSAzNTIuNDggNjc2LjA0IDM1NC42MyA2NzguNDMgMzU2LjU2IEMgNzE1LjU1IDM4Ny40NiA3NTIuNjIgNDE4LjQ0IDc4OS43NiA0NDkuMzAgQyA3OTEuOTEgNDUyLjAwIDc5MS44NSA0NTYuNzMgNzg4Ljc0IDQ1OC43MiBDIDc1MC42OSA0OTAuMzYgNzEyLjcyIDUyMi4xMCA2NzQuNjggNTUzLjc1IEMgNjcxLjQzIDU1Ni40OSA2NjYuODIgNTU1LjUyIDY2Mi45MiA1NTUuNTQgQyA2NTguNjUgNTU1LjU1IDY1NC45NyA1NTEuMTggNjU1Ljg2IDU0Ni45NyBDIDY1Ni4xNiA1NDQuOTQgNjU3LjYzIDU0My40MSA2NTkuMTEgNTQyLjEzIEMgNjk0Ljg1IDUxMi4zNSA3MzAuNTggNDgyLjU2IDc2Ni4zMiA0NTIuNzggQyA3MzAuNTEgNDIyLjkwIDY5NC42NSAzOTMuMDggNjU4Ljg1IDM2My4xOSBDIDY1Ni4xNiAzNjEuMjEgNjU0LjgwIDM1Ny40MSA2NTYuNDEgMzU0LjMzIFoiIC8+DQo8L2c+DQo8L3N2Zz4NCg==
// @run-at        document-end
// @grant        unsafeWindow
// @grant        GM_openInTab
// @require https://greasyfork.org/scripts/430421-%E4%B8%AD%E6%96%87%E7%B9%81%E4%BD%93%E7%AE%80%E4%BD%93%E8%BD%AC%E5%8C%96%E5%BA%93/code/%E4%B8%AD%E6%96%87%E7%B9%81%E4%BD%93%E7%AE%80%E4%BD%93%E8%BD%AC%E5%8C%96%E5%BA%93.js?version=1225835
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429332/b%E7%AB%99%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E9%A1%B5%E5%86%85%E8%B7%B3%E8%BD%AC%E6%A8%B1%E8%8A%B1%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/429332/b%E7%AB%99%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E9%A1%B5%E5%86%85%E8%B7%B3%E8%BD%AC%E6%A8%B1%E8%8A%B1%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let window = unsafeWindow
    let upload_url = 'http://www.nekostu.top:1760'
    let search_url = "http://www.yinghuacd.com/search/" //换成其他url以跳转其他网站 如age "https://www.agefans.vip/search?query="
    function handle_name(name){
        name = simplized(name) //繁体转简体
        name = name.replace(/（.*）/,'')//去中文括号
        name = name.replace(/第.*季/,'') //去第二季
        name = name.replace(/剧场版/,'') //去剧场版  "剧场版 王室教师海涅"
        name = name.split('/')[name.split('/').length-1] //去/，保留最后部分
        name = name.slice(0,18)//樱花动漫最长支持18个字符，太长会502
        name = name.trim() // //去多余空格  "无限滑板 / SK8 the Infinity"
        name = name.split(' ')[0] //以空格分割，取前面的   伊甸星原 EDENS ZERO
        name = name.split('，')[name.split('，').length-1] //以，分割，取后面的
        name = name.split('-')[0] // 以-分割，取前面的  "催眠麦克风-Division Rap Battle- Rhyme Anima"
        return name
    }

    function inject_div(){
        if( document.querySelector("#bili_to_yh")){
        return}
    var div = document.createElement("div");
        // 设置div的样式
        div.id = "bili_to_yh"
        div.style.width = "75px";
        div.style.height = "75px";
        div.style.position = "fixed";
        div.style.top = "50%";

        div.style.right = "0";
        div.style.position = "fixed";
        div.style.transform = "translateY(-50%)";
        let img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAqCAMAAAD79pkTAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAPZQTFRFAAAA7GyL7GyL4HuQ526K6Wh/7lt67mF87WWD7mF87WWD6GeD7Vt37lt67myH7mF87mF85WyD7GyL5XqW526K6Wh/7WWD7WWD6WB77mF86Wh/526K5oGW5niO6GeD4Iej5WyD5XOS7mF87mF8526K5X+a6WB75nSL5nSL6WB77WWD5XOS6GeD6GeD7XGN5nSL6GeD7myH6GeD6Wh/7WWD6Wh/7myH6GeD6WB77myH6WB7526K6oOo6WB76GeD5XqW6WB77Hqd7WWD5niO5nSL7XGN7myH6Wh/7myH7mF86WB75nSL5nSL7WWD5XOS526K5WyD5XOSmh+dTAAAAFJ0Uk5TAFVmEVV37syI7ndm//8z/91EMxEiiKqZiJlVMxERRBEzIruqRBHMIjP/ZjNVd3dmiN3du7uZRLvud7t3EZmZIt0R7iIRIlVmZmaqRFXdVYhmRHtUuBsAAAIaSURBVHicpZV9X9MwEMcrsLZZLyQ8rBUKTFseHKLOuTJEBYYiPuDT+38zXtKkTdKO4sf7I7mk3yZ3v1xTz/tve7Qk2uWVB8HLPT8QfUj6D6AjAkARXGWU8rUuep0BpZRseBx7YJsd+IBKixOQfa8Df0wt2+rA+/+Gb9v4QnHSdEd0uwxMfE/MDZ+kDvw0QznyffQykya4xEFIKD08MulnHJ8BjOIN79jEc3EO5YvPa/qkioCnHqmjGa0exFQNyUmFbxINANsf1Hg+DOqdXhh5Ggm+5NrzX1Uu0LEZfB0xkNfqVZgYdGhL86bmmfbqLWFqoLtrvbxayDDjBHhxuqPoGREiOqQzgaOz7K3El6jDoh2es8YcfSfx97yBo2gpceYgUNEEbiREzBbuGrnCnaJVeO7i21qaeCSTrdKDYuitKBdEZtiOCqPEoiTOsumH/nhS6kB42U8utgLiE34+cGsY7TLxqw1UexV53nzeRPErSFoUxRPaa4PLmm+1sIVu6GxY1qDnxArk2hpaFVZqaSs/tY4OILHpj06JjHM7a/bJwm+caD+H9m503V6+PBa9JJvf2jh3Yr8VSzBSPb3RnxKRRxa5uTIa9I7GCkel9R1wnOasrDnLvoiiSBSDd1ak3K94xRUL7u1MRgDf0B1egcYXmlRb/TNOy+jv+0EFPgJn6nqTt6PfVjDavt9d/Li+06Ofs9mv33/uwTvtLyCPR618Lt3pAAAAAElFTkSuQmCC"
        div.innerHTML = `<a title="跳转樱花观看"><img src='${img}' style="height:50px"></a>`
        // 将div插入到body中
        document.body.appendChild(div);
       document.querySelector("#bili_to_yh > a > img").addEventListener("mouseover", function() {
            document.querySelector("#bili_to_yh> a > img").style.height = "75px";
            document.querySelector("#bili_to_yh").style.height = "75px";
});
       document.querySelector("#bili_to_yh > a > img").addEventListener("mouseout", function() {
            document.querySelector("#bili_to_yh > a > img").style.height = "50px";
           document.querySelector("#bili_to_yh").style.height = "50px";
});
       document.querySelector("#bili_to_yh").addEventListener("click", function() {
            let title = document.querySelector("a[class^=mediainfo_media_title]")||document.querySelector("a[class^=mediainfo_mediaTitle]")
            let href = search_url+ handle_name(title.innerText)+"?yname="+title.innerText
            GM_openInTab(href ,{active: true,insert: true})
});
    }

    ///////////////////////////////////////////bili////////////////////////////////////////////////////////
    if(/bilibili/.test(window.location.href)){
        let i = setInterval(inject_div,100)
        setTimeout(function(){clearInterval(i)},5000)
        let ci = 0
        let obser = setInterval(
            function(){
                let video= document.querySelector("#bilibili-player video")
                if(video){
                    clearInterval(obser)
                    let observer = new MutationObserver(()=>{inject_div()})
                    observer.observe(video, { attributes: true });//检测video变化,防止中途切p失效
                }
            },200
        )
        }




/*     ///////////////////////////////////////////樱花////////////////////////////////////////////////////////
    if (/yhdm.*bv=/.test(window.location.href) ){
        let items = /search\/(.*)\?bv=(.*)&yname=(.*)/.exec(window.location.href)
        let query_name = items[1]
        let bv = items[2]
        let yname = items[3]
        let run_num =0
        let i = setInterval(function(){
            if(document.querySelector("div.fire.l > div > ul > li") || run_num>=10){
                clearInterval(i)
            }else if( /未找到相关信息/.test(document.querySelector("div.fire.l > div > ul").innerText)){ //出现bug
                clearInterval(i)
                GM_xmlhttpRequest({
                    method: 'GET',
                    //url: 'http://localhost:1760/bili2yh?bv=' + bv + "&name=" + query_name+"&yname="+yname,
                    url: upload_url + "/bili2yh?bv=" + bv + "&name=" + query_name+"&yname="+yname,
                    onload: function(xhr) {
                        console.log(xhr.responseText)
                        if (xhr.status == 200) {
                            let data = JSON.parse(xhr.responseText)
                            if(data.code == 0){
                            console.log("found")
                                let name = data.data
                                window.location.href = search_url+ name
                            }else{
                            console.log("not found")
                            }
                            console.log('上传bug成功')
                        } else {
                            console.log('上传bug失败')
                        }

                    },
                    onerror:function(){console.log('上传bug失败')}
                });
            }
            run_num +=1

        },500)


        } */

})();