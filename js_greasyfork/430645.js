// ==UserScript==
// @name         b站低质弹幕过滤 测试版 bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  低质弹幕屏蔽测试版，屏蔽无意义的弹幕如“哈哈哈哈”，刷屏弹幕如“完结撒花”。随便写的脚本，虽然搞过nlp，但都是语义建模，很少接触表达建模，而且js也不循序太高的复杂度，所以目前用的是简单测词频法，后续还会慢慢优化。
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430645/b%E7%AB%99%E4%BD%8E%E8%B4%A8%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4%20%E6%B5%8B%E8%AF%95%E7%89%88%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/430645/b%E7%AB%99%E4%BD%8E%E8%B4%A8%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4%20%E6%B5%8B%E8%AF%95%E7%89%88%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

function GET(url,fun=function(x){console.log(x.responseText)}){
    const xhr = new XMLHttpRequest()
    xhr.open('get',url)
    xhr.send()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            fun(xhr)
        }
    }
}
(function() {
    'use strict';
    const cid = window.__INITIAL_STATE__.videoData.cid
    console.log('video cid',cid)
    const danmuURL = 'https://api.bilibili.com/x/v1/dm/list.so?oid='+cid
    console.log('danmu url:',danmuURL)
    const k = 5  //屏蔽强度 1~10，10最强
    GET(danmuURL,function(xhr){
        const xml = xhr.responseXML
        xml.getElementsByTagName('d')
        const danmuList = []
        for(let d of xml.getElementsByTagName('d')){
            const danmu = d.textContent.replace(/[~!@#$(),.?''""！（），。？“”‘’；：;: +-=\\、·…]/g,'').toLowerCase()
            if(!!danmu){
                danmuList.push(danmu+'#')
            }
        }
        console.log(danmuList)
        const char_dict = {}
        const word_dict = {}
        let total_char = 0
        for(let danmu of danmuList){
            for(let i=0;i<danmu.length-1;i++){
                const cc = danmu[i]
                const nc = danmu[i+1]
                if(!(cc in char_dict)){
                    char_dict[cc] = 0
                }
                if(!(cc in word_dict)){
                    word_dict[cc] = {'total':0}
                }
                if(!(nc in word_dict[cc])){
                    word_dict[cc][nc] = 0
                }
                char_dict[cc] += 1
                word_dict[cc][nc] += 1
                word_dict[cc]['total'] += 1
                total_char += 1
            }
        }
        for(let c in char_dict){
            char_dict[c] = char_dict[c]/total_char
        }
        console.log('char dict',char_dict)
        for(let cc in word_dict){
            let total_nc = word_dict[cc].total
            for(let nc in word_dict[cc]){
                word_dict[cc][nc] = char_dict[cc]*word_dict[cc][nc] / total_nc
            }
        }
        let danmuFreqList = []
        for(let danmu of danmuList){
            let freq = 0
            for(let i = 0;i < danmu.length -1;i++){
                freq += word_dict[danmu[i]][danmu[i+1]]
            }
            freq /= danmu.length-1
            danmuFreqList.push([danmu,freq])
        }
        danmuFreqList = danmuFreqList.sort(function(a,b){
            return b[1] - a[1]
        })
        const size = parseInt(danmuList.length * k / 10)
        const removed_danmu = new Set()
        for(let i =0;i<size;i++){
            removed_danmu.add(danmuFreqList[i][0].substring(0,danmuFreqList[i][0].length-1))
        }
        console.log('danmu  freq list',danmuFreqList)
        console.log('removed danmu list',removed_danmu)
        function addOBS(){
            const container = document.getElementsByClassName('bilibili-player-video-danmaku')[0]
            if(container){
                const init_danmu = container.getElementsByClassName('b-danmaku')
                for(let danmu of init_danmu){
                    if(removed_danmu.has(danmu.innerText.replace(/[~!@#$(),.?''""！（），。？“”‘’；：;: +-=\\、·…]/g,'').toLowerCase())){
                        console.log('屏蔽',danmu.innerText)
                        danmu.innerText = ''
                    }
                }
                function obsFunc(mutations,observer){
                    for(let mutation of mutations){
                        const target = mutation.target
                        if('b-danmaku' == target.className){
                            if(removed_danmu.has(target.innerText.replace(/[~!@#$(),.?''""！（），。？“”‘’；：;: +-=\\、·…]/g,'').toLowerCase())){
                                console.log('屏蔽',target.innerText)
                                target.innerText = ''
                            }
                        }
                    }
                }

                const config = {childList: true, subtree: true}
                const obser = new MutationObserver(obsFunc)
                obser.observe(container,config)

            }else{
                requestAnimationFrame(addOBS)
            }
        }
        addOBS()  
        
    })
    // Your code here...
})();