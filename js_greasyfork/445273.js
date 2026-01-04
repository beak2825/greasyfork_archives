// ==UserScript==
// @name         bilibili港澳台番剧替换弹幕
// @namespace    https://github.com/LuffyLSX/bilibili_danmaku_replace
// @version      1.3
// @description  点击按钮后，输入想要替换的番剧的网址、Epid、SeasonId其中一种即可替换弹幕
// @author       LuffyLSX
// @license      GNU
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/video/*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445273/bilibili%E6%B8%AF%E6%BE%B3%E5%8F%B0%E7%95%AA%E5%89%A7%E6%9B%BF%E6%8D%A2%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445273/bilibili%E6%B8%AF%E6%BE%B3%E5%8F%B0%E7%95%AA%E5%89%A7%E6%9B%BF%E6%8D%A2%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    let css = `
        .danmu-replace {
            margin: 0px 0px 0px 28px;
            position: relative;
            display: block;
            float: left;
            height: 36px;
            cursor: pointer;
        }

        .danmu-svg {
            width: 28px;
            height: 28px;
            display: inline-block;
            fill: #757575;
        } 

        .danmu-span {
            display: inline-block;
            vertical-align: top;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #505050;margin-left: 5px;
            
        } `
    
        
    function getBangumiData(Epid_or_Ssid = window.location.href, ep = 0){
        $.ajaxSettings.async = false
        var bangumi_data = {}
        var BangumiInfo_url = 'https://bangumi.bilibili.com/view/web_api/season'
        var get_data = {
            ep_id:/ep([0-9]+)/.exec(Epid_or_Ssid) == null ? 0 : /ep([0-9]+)/.exec(Epid_or_Ssid)[1],
            season_id:/ss([0-9]+)/.exec(Epid_or_Ssid) == null ? 0 : /ss([0-9]+)/.exec(Epid_or_Ssid)[1],
        }
        ep_item = document.getElementsByClassName('ep-item cursor visited')
        $.get(BangumiInfo_url, get_data, function(data){
            //bangumi_data.ep_watch = 1
            bangumi_data.ep_watch = (ep_item.length == 0) ? ep : /[0-9]+/.exec(ep_item[0].innerText)[0]
            console.log(bangumi_data.ep_watch)
            bangumi_data.ep_id = data['result']['episodes'][bangumi_data.ep_watch - 1]['ep_id']
            bangumi_data.season_id = data['result']['season_id']
            bangumi_data.title = data['result']['title'].replace(/（.+）/, '')
            bangumi_data.aid = data['result']['episodes'][bangumi_data.ep_watch - 1]['aid']
            bangumi_data.cid = data['result']['episodes'][bangumi_data.ep_watch - 1]['cid']
            bangumi_data.mid = data['result']['episodes'][bangumi_data.ep_watch - 1]['mid'] 
        },"json")
        $.ajaxSettings.async = true
        return bangumi_data
    }

    function getVideoData(bvid = window.location.href, ep_on){
        $.ajaxSettings.async = false
        var video_data = {}
        var get_data = {
            bvid: /BV[0-9A-Za-z]+/.exec(bvid) == null ? bvid : /BV[0-9A-Za-z]+/.exec(bvid)[0],
            jsonp: 'jsonp'
        }
        var VideoInfo_url = 'https://api.bilibili.com/x/player/pagelist'
        $.get(VideoInfo_url, get_data, function(data){
            video_data.cid = data['data'][ep_on - 1]['cid']
            video_data.ep_watch = ep_on
        },"json")
        $.ajaxSettings.async = true
        return video_data
    }

    //合并arraybuff
    function concatenate(arrays){
        let totalLen = 0;
        for (let arr of arrays)
            totalLen += arr.byteLength;
        let res = new Uint8Array(totalLen)
        let offset = 0
        for (let arr of arrays) {
            let uint8Arr = new Uint8Array(arr)
            res.set(uint8Arr, offset)
            offset += arr.byteLength
        }
        return res.buffer
    }

    function inputDanmaku(protobuf){
        ah.proxy({
            onRequest: (config, handler) => {
                handler.next(config);
            },
            //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
            onError: (err, handler) => {
                handler.next(err)
            },
            //请求成功后进入
            onResponse: (response, handler) => {
                var DanmuProtobufUrl = /api\.bilibili\.com\/x\/v2\/dm\/web\/seg\.so.+/
                if (DanmuProtobufUrl.test(response.config.url)) {
                    if (protobuf) {
                        response.response = protobuf;
                        protobuf = undefined;
                        console.log(response.response)
                        ah.unProxy()
                    }
                }
                handler.next(response)
            }
        })
        try {
            window.player.reload()
        } catch(error) {
            window.player.reload({'cid':video_reloadData.cid,'p':video_reloadData.ep_watch})
        }
    }

    
    function getDanmukuProtobuf(cid = 714449041, n = 1){
        var url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid +"&segment_index=" + n
        var xhr = new XMLHttpRequest()
        xhr.responseType = "arraybuffer"
        xhr.onreadystatechange = function(){
        // 通信成功时，状态值为4
        if (xhr.readyState === 4){
            if (xhr.status === 200){
            console.log(xhr.response)
            //var message = dmList.decode(xhr.response)
            danmuProtobuf.push(xhr.response)
            console.log(xhr.response)
            getDanmukuProtobuf(cid,n + 1)
            } else {
            console.log('弹幕获取完成')
            inputDanmaku(concatenate(danmuProtobuf))
            }
        }
        }
        xhr.onerror = function (e) {
        console.error(xhr.statusText)
        }
        xhr.open('GET', url, true) //只能异步,同步不能为'arraybuffer'
        xhr.send(null)
        return 1
    }

    var video_reloadData = {}
    var danmuProtobuf = new Array()
    function replace(){
        var episodes = document.querySelector('.list-box')
        var ep_on = (document.querySelector('.list-box') == null) ? 1 : /[0-9]+/.exec(episodes.querySelector('.on').innerText)[0]
        if(/video/.test(window.location.href)){
            video_reloadData = getVideoData(window.location.href, ep_on)
        }
        var text = prompt("请输入要替换番剧网址：")
        var EpSsid = /[eps]+([0-9]+)/.exec(text) == null? 0 : /[eps]+([0-9]+)/.exec(text)[0]

        if(EpSsid == 0){
            alert('非法输入')
            console.log(cid)
            return
        }
        var Target = getBangumiData(EpSsid, ep_on)
        getDanmukuProtobuf(Target.cid)
        danmuProtobuf = new Array()
    }
    
    function insert_danmu(){
        let danmu = document.createElement('div')
        danmu.className = "danmu-replace"
        danmu.innerHTML = `
       <div class="danmu-svg">
            <svg viewBox="0 0 28 28">
                        <use xlink:href="#bpx-svg-sprite-dantype-scroll"></use>
                    </svg>
            </div>
        <span class="danmu-span">替换弹幕</span>
        `
        /*
        <div class="danmu-svg">
            <svg viewBox="0 0 28 28">
                        <use xlink:href="#bpx-svg-sprite-dantype-scroll"></use>
                    </svg>
            </div>
        <span class="danmu-span">替换弹幕</span>
        `
        */
        
        document.getElementsByClassName('toolbar_toolbar__NJCNy')[0].appendChild(danmu)
        let styleNode = document.createElement("style");
        styleNode.className = 'css'
        styleNode.appendChild(document.createTextNode(css));
        //(document.querySelector("head") || document.documentElement).appendChild(styleNode);
        document.documentElement.appendChild(styleNode);
    
        danmu.addEventListener('click',function(){replace()})
        danmu.addEventListener("mouseover", function(){document.getElementsByClassName('danmu-span')[0].style.color = '#23ADE5'})
        danmu.addEventListener("mouseout", function(){document.getElementsByClassName('danmu-span')[0].style.color = ''})
    
        danmu.addEventListener("mouseover", function(){document.getElementsByClassName('danmu-svg')[0].style.fill = '#00a1d6'})
        danmu.addEventListener("mouseout", function(){document.getElementsByClassName('danmu-svg')[0].style.fill = ''})
    }
    /*
    function clone_danmu(){
        let sourceNode = document.getElementsByClassName("toolbar-left")[0]
        let danmu = sourceNode.getElementsByClassName('coin')[0].cloneNode(true)
        let svg = danmu.children[1]
        let text = danmu.children[2]
        danmu.title = ''
        danmu.className = 'video_danmu'
        let path = 'M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM11 9h6a1 1 0 010 2h-6a1 1 0 010-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 010-2h6a1 1 0 010 2z'
        svg.childNodes[0].setAttribute('d', path)
        text.innerText = '替换弹幕'
        document.getElementsByClassName('toolbar-left')[0].appendChild(danmu)
    
        danmu.addEventListener('click',function(){replace()})
    }
    */
   
    function clone_danmu(){
        let sourceNode = document.getElementsByClassName("toolbar_coin_info__5hnd9 toolbar_item_info__xpKhw")[0]
        let danmu = sourceNode.cloneNode(true)
        let svg = danmu.children[0]
        svg.innerHTML = `
                        <svg viewBox="0 0 28 28">
                            <use xlink:href="#bpx-svg-sprite-dantype-scroll"></use>
                        </svg>
                        `
        svg.style.fill='#757575'
        danmu.addEventListener("mouseover", function(){svg.style.fill = '#00a1d6'})
        danmu.addEventListener("mouseout", function(){svg.style.fill = '#757575'})
        let text = danmu.children[1]
        // danmu.title = ''
        // danmu.className = 'video_danmu'
        // let path = 'M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM11 9h6a1 1 0 010 2h-6a1 1 0 010-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 010-2h6a1 1 0 010 2z'
        // svg.childNodes[0].setAttribute('d', path)
        text.innerText = '替换弹幕'
        document.getElementsByClassName('toolbar_toolbar__NJCNy')[0].appendChild(danmu)
    
        danmu.addEventListener('click',function(){replace()})
    }

    var id = setInterval(function(){
        var bangumi_toolbar = document.querySelector('.main-container')
        var video_toolbar = document.querySelector('.video-toolbar-v1')
        if(bangumi_toolbar){
            clone_danmu()
            clearInterval(id)
        }
        if(video_toolbar){
            clone_danmu()
            clearInterval(id)
        }}, 1000)

})();
