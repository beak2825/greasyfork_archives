// ==UserScript==
// @name         get all eposodes' link list from hanime1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  take over the world!
// @author       Anaaya
// @match        https://hanime1.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519333/get%20all%20eposodes%27%20link%20list%20from%20hanime1.user.js
// @updateURL https://update.greasyfork.org/scripts/519333/get%20all%20eposodes%27%20link%20list%20from%20hanime1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LS = localStorage

    let nowUrl = ''
    let collectedLinks = []
    const opts = {
        collectLinks: ()=>{},
        getInfo: ()=>{},
        test: ()=>{ alert('test') }
    }
    const urlTypeRegex = /^https:\/\/hanime1.me\/([a-z]+)\?/
    const vRegex = /^https:\/\/hanime1.me\/[a-z]+\?v=(\d+)/
    const collectRegex = /^https:\/\/hanime1.me\/[a-z]+\?v=\d+&collect[0-9a-z_&=]*/
    const preffixRegex = /\/(\d+)-/
    const waitSeconds = 10
    const logFlag = true
    const aleFlag = true
    const resoStrat = true

    function log(...args) {
        if (logFlag) {
            console.log(args)
        }
    }
    function ale(s) {
        if (aleFlag) {
            alert(s)
        }
    }
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
            alert("文本已复制!");
        })
            .catch(err => {
            console.error("复制失败: ", err);
        });
    }
    function getENameList() {
        let eles = document.querySelectorAll("#playlist-scroll div.card-mobile-title")
        let len = eles.length
        let res = []
        eles.forEach((e, i) => {
            if ( i >= Math.floor(len/2) ) {
                return
            }
            res.push(e.innerText)
        })
        log('e name list:', res)
        return res
    }
    function getVList() {
        let eles = document.querySelectorAll('#playlist-scroll .overlay')
        let len = eles.length
        let res = []
        eles.forEach((e, i) => {
            if ( i >= Math.floor(len/2) ) {
                return
            }
            res.push(getV(e.href))
        })
        log('v list:', res)
        return res
    }
    function getSName() {
        let ele = document.querySelector('#video-playlist-wrapper > div.single-icon-wrapper.video-playlist-top > h4')
        let res = ele.innerText
        log('series name:', res)
        return res
    }
    // 最后一步，获取localStorage内的所有下载链接QWQ
    function getDownloadLinkList(vLi) {
        let res = []
        vLi.forEach(v => {
            let dLink = LS.getItem(linkKeyNameGen(v))
            res.push(dLink)
        })
        log('downloadLinks: ', res)
        return res
    }
    function downloadLinkGen(v) {
        return `https://hanime1.me/download?v=${v}`
    }
    // 打开所有download页面并收集下载链接
    function handleLinksCollect(vLi, sName) {
        const allPromises = []
        let downloadLinkList = []
        vLi.forEach((v, idx) => {
            allPromises.push(new Promise((resolve, reject) => {
                let dLink = downloadLinkGen(v)
                log('running link:', v)
                const newWindow = window.open(dLink+"&collect", "_blank", "width=800,height=600,resizable=no,scrollbars=no,menubar=yes,toolbar=yes,location=yes,status=yes");
                let i = 0
                const inter = setInterval(()=>{
                    let link = newWindow.anaayaLink
                    if (link !== undefined) {
                        clearInterval(inter)
                        downloadLinkList[idx] = link
                        newWindow.close()
                        resolve('closed successfully.')
                    }
                    else if (i >= waitSeconds * 1000) {
                        clearInterval(inter)
                        newWindow.close()
                        reject('wait too long time!')
                    }
                    else {
                        i++
                    }
                }, 2000)
            }))
        })
        let res = 'no links'
        Promise.all(allPromises).then(()=>{
            log('all is end')
            res = downloadLinkList.join("\n")
            ale(`${sName} collect end, there are results:\n${res}\nCopy to clipboard.`)
            console.log(res)
            collectedLinks = downloadLinkList
            copyToClipboard(res)
        }).catch(e => {
            ale("failed, e:\n" + e)
        })
    }
    // 脚本自动执行
    function pageWatch() {
        let sName = getSName()
        let vList = getVList()

        handleLinksCollect(vList, sName)

    }
    function isCollect() {
        let res = collectRegex.test(nowUrl)
        if (res === true) {
            log('this url need collect.')
        }
        else {
            log('this url do not need collect')
        }
        return res
    }
    function linkKeyNameGen(v) {
        return `episode-${v}`
    }
    function getV(url=nowUrl) {
        let m = url.match(vRegex)
        let res = m[1]
        log('download v:', res)
        return res
    }
    function getlink() {
        let eles = document.querySelectorAll('.download-table a')
        let len = eles.length
        let res = ''
        res = resoStrat? eles[0].href : eles[len - 1].href
        log('download link is:', res)
        return res
    }
    function linkStorage(v, link) {
        let key = linkKeyNameGen(v)
        LS.setItem(key, link)
        log('link has stored:', key)
    }
    function pageDownload(v) {
        ale(`
        start collect:
        v   = ${v}`)
        let link = getlink()
        window.anaayaLink = link
        //linkStorage(v, link)
        ale('end')
    }
    // 获取类型，watch 或 download
    function getPageType() {
        let res = nowUrl.match(urlTypeRegex)
        return res[1]
    }
    // watch页功能：收集链接列表
    function watchCollect() {
        ale('start')
        pageWatch()
    }
    function formatInfo(sName, preffixList, eNameList) {
        let res = ''
        res = `${sName}<-***->${preffixList.join(' ')}<-***->${eNameList.join('->')}`
        log('formated info:', res)
        return res
    }
    function getPreffixList() {
        let res = []
        collectedLinks.forEach(link => {
            let m = link.match(preffixRegex)
            res.push(m[1])
        })
        log('preffix list:', res)
        return res
    }
    // watch页功能：获取总名称以及对应集名
    function watchInfoGet() {
        let sName = getSName()
        let preffixList = getPreffixList()
        let eNameList = getENameList()
        alert(`series name: ${sName}\nv: ${preffixList}\nepisode name list: ${eNameList}\n`)
        let formatedInfo = formatInfo(sName, preffixList, eNameList)
        console.log(formatedInfo)
    }
    // 初始化
    function init() {
        nowUrl = window.location.href
        opts.collectLinks = watchCollect
        opts.getInfo = watchInfoGet
    }
    function main() {
        init()
        const pageType = getPageType()
        // watch页需要收集，说明是脚本打开的
        if (pageType === 'watch') {
            window.anaaya = opts
            ale('load success.')
        }
        // download 页且需收集
        else if (pageType === 'download' && isCollect()) {
            let v = getV()
            pageDownload(v)
        }
        else return
    }
    setTimeout(main, 5000)
    // Your code here...
})();