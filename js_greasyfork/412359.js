// ==UserScript==
// @name         哔哩哔哩大会员视频替换
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  此脚本会替换掉原本的播放器，然后匹配相关资源并播放。同时提供视频和弹幕下载。
// @author       coldrainf
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      xbeibeix.com
// @connect      bilivideo.com
// @include      https://www.bilibili.com/bangumi/play/*
// @include      https://www.bilibili.com/video/BV*
// @require      https://greasyfork.org/scripts/402897-bilibili-ass-danmaku-downloader-by-%E7%94%B0%E7%94%9F/code/bilibili%20ASS%20Danmaku%20Downloader%20by%20%E7%94%B0%E7%94%9F.js?version=802822
// @downloadURL https://update.greasyfork.org/scripts/412359/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%A7%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/412359/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%A7%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let dloading = false
    let bangumi = /bilibili.com\/bangumi\/play\//g.test(window.location.href)
    let parentId = bangumi ? 'toolbar_module' : 'arc_toolbar_report'
    //添加样式
    let style = document.createElement("style")
    style.innerHTML =(".coldrainf-get-dm{float:right;}.coldrainf-get-dm>div{display:inline-block;}.coldrainf-get-dm a{font-size:15px;color:#00a1d6;margin:0 12px;line-height:28px;}.coldrainf-get-dm a:hover{cursor:pointer;color:#f25d8e;}")
    document.head.appendChild(style)
    //if(bangumi && unsafeWindow.__PGC_USERSTATE__.area_limit != 0) Object.defineProperty(unsafeWindow, '__PGC_USERSTATE__', {get: () => ({area_limit:0, gat: true})})
    //添加按钮
    let addElement = cid => {
        let name = document.title.match(/(.+?)_((.+?)_|哔哩哔哩 )/)[1]
        let title = bangumi ? unsafeWindow.__INITIAL_STATE__.mediaInfo.title : name
        let parent = document.getElementById(parentId)
        let old = document.querySelector('.coldrainf-get-dm')
        if(old) parent.removeChild(old)
        let ele = document.createElement("div")
        ele.className = 'coldrainf-get-dm'
        let dm = document.createElement("a")
        dm.href = "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid
        dm.textContent = "下载弹幕"
        dm.addEventListener('click',e => {
            fetch("https://api.bilibili.com/x/v1/dm/list.so?oid="+cid).then(res=>res.text()).then(text => {
                let danmaku = parseXML(text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ''));
                let ass = generateASS(setPosition(danmaku), {
                    'title': name,
                    'ori': name,
                })
                startDownload('\ufeff' + ass, name + '.ass');
            })
            if(e.preventDefault) e.preventDefault()
            else window.event.returnValue == false
        })
        let iframeTmp = document.querySelector('#coldrainf-iframe')
        if(iframeTmp) document.querySelector('.plp-l').removeChild(iframeTmp)
        let bfq = document.getElementById('player_module')
        if(bfq) bfq.style.display = 'block'
        let jump = document.createElement("a")

        if(bangumi && (unsafeWindow.__INITIAL_STATE__.epPayMent.status != 0)) {
            let iframe = document.createElement("iframe")
            iframe.id = 'coldrainf-iframe'
            iframe.src = `https://dm.coldrain.top/?dm=${cid}&wd=${title}&ep=${unsafeWindow.__INITIAL_STATE__.epInfo.i + 1}`
            if(document.body.className.includes('player-mode-widescreen')) {
                iframe.style.position = 'absolute'
                iframe.style.top = '0'
            }
            iframe.height = 0
            iframe.width = bfq.clientWidth
            iframe.setAttribute('frameborder','no')
            iframe.setAttribute('border','0')
            iframe.setAttribute('allowfullscreen','allowfullscreen')
            iframe.setAttribute('webkitallowfullscreen','webkitallowfullscreen')
            document.querySelector('.plp-l').insertBefore(iframe,bfq)
            jump.textContent = "替换播放器"
            jump.onclick = e => {
                if(unsafeWindow.player) unsafeWindow.player.pause()
                if(bfq.style.display == 'none') return
                iframe.height = bfq.clientHeight
                bfq.style.display = 'none'
            }
        }
        let video = document.createElement("a")
        if(bangumi && unsafeWindow.__INITIAL_STATE__.epPayMent.status == 0) {
            (async () => {
                video = document.createElement("div")
                let select = document.createElement("select"),
                    api = `https://api.bilibili.com/x/player/playurl?cid=${cid}&avid=${unsafeWindow.__INITIAL_STATE__.epInfo.aid}`,
                    res0 = await fetch(api,{credentials: 'include'}),
                    json = await res0.json()
                if(!json.data) return
                select.value = json.data.accept_quality[0]
                for(let i in json.data.accept_quality) {
                    if(!unsafeWindow.__INITIAL_STATE__.loginInfo.isVip && json.data.accept_quality[i] == '112') {
                        select.value = json.data.accept_quality[1]
                        continue
                    }
                    let option = document.createElement("option")
                    option.value = json.data.accept_quality[i]
                    option.textContent = json.data.accept_description[i]
                    select.appendChild(option)
                }

                video.appendChild(select)
                let dl = document.createElement("a")
                dl.textContent = "下载视频"
                dl.addEventListener('click', e => {
                    if(e.preventDefault) e.preventDefault()
                    else window.event.returnValue == false
                    if(dloading) return
                    dloading = true;
                    (async () => {
                        let res1 = await fetch(`${api}&qn=${select.value}`,{credentials: 'include'}),
                            json1 = await res1.json(),
                            url = json1.data.durl[0].url.replace('http','https')

                        let res = await fetch(url,{headers:{'Referer':'https://www.bilibili.com/'}}),
                            loaded = 0, chunks = []
                        const reader = res.body.getReader(), total = +res.headers.get('Content-Length');
                        select.style.display = 'none'
                        while(true) {
                            const {done, value} = await reader.read()
                            if(done) break
                            chunks.push(value)
                            loaded += value.length
                            dl.textContent = `${(loaded/1024/1024).toFixed(2)}M/${(total/1024/1024).toFixed(2)}M`
                        }
                        select.style.display = 'inline'
                        dl.textContent = "下载视频"
                        dloading = false
                        let hz = /\.flv\?/.test(url) ? '.flv' : '.mp4'
                        startDownload(new Blob(chunks), name+hz)
                    })()
                })
                video.appendChild(dl)
            })()

        }else video.textContent = "无法下载该视频"
        if(!bangumi) {
            video.textContent = "下载视频"
            video.target = '_blank'
            let api = 'https://www.xbeibeix.com/api/bilibiliapi.php?url=https://www.bilibili.com/&aid='+aid+'&cid='+cid
            GM_xmlhttpRequest({method: "get", url: api,onload(res){
                if(res.status != 200) return
                let json = JSON.parse(res.responseText)
                video.href = json.url
            },
            });
        }
        ele.appendChild(video)
        ele.appendChild(dm)
        ele.appendChild(jump)
        parent.appendChild(ele)
    }
    //添加换p事件
    let href = window.location.href
    let changeEp = () => {
        let eles = bangumi ? document.querySelectorAll('.plp-r') : document.querySelectorAll('.list-box li')
        if(!eles) return
        eles.forEach(ele => {
            ele.addEventListener('click',e => {
                setTimeout(()=>{
                    if(window.location.href == href) return
                    href = window.location.href
                    document.getElementById(parentId).removeChild(document.querySelector('.coldrainf-get-dm'))
                    addElement(getCid())
                },200)
            })
        })
    }
    //获取cid
    let getCid = () => {
        if(bangumi) return unsafeWindow.__INITIAL_STATE__.epInfo.cid
        else return cid
    }
    let init = () => {
        addElement(getCid())
        changeEp()
    }
    let obs = bangumi ? document.querySelector('#toolbar_module') : document.querySelector('.ops')
    if(!obs) setTimeout(init,500)
    else{
        new MutationObserver(function (mutations, observer) {
            observer.disconnect();
            setTimeout(init,500)
        }).observe(obs, {childList: true, subtree: true});
    }
})();