// ==UserScript==
// @name         iwara mod
// @namespace    https://greasyfork.org/zh-CN/scripts/457618-iwara-mod
// @version      0.7
// @description  iwara mod title,resolution Source
// @author       You
// @match        *://*.iwara.tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_download
// @license      none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/457618/iwara%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/457618/iwara%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const originFetch = fetch
    window.unsafeWindow.fetch = async (url, options) => {
        let response = await originFetch(url, options)
        if(url.includes('files.iwara.tv/file')){
            // console.log(response)
            let data = await response.json()

            // console.log('Success:', data)
            let source
            data.forEach(item => {
                if(item.name == 'Source'){
                    setTitle(item)
                    //addDownloadBtn(item)
                    source = item
                }
            })
            // console.log('return')
            if(source){
                return {
                    ok: true,
                    status: 200,
                    json: async () => {
                        console.log([source])
                        return [source]
                    }
                }
            }else{
                return response
            }
        } else {
            return response
        }
    }

    let isSetTitle = false
    let newTitle
    function setTitle (item){
        let title = document.querySelector('.text--h1').innerText
        let username = document.querySelector('.username').innerText
        let date = item.createdAt.match(/\d+\-\d+-\d+/)[0]
        newTitle = title + ' - ' + username + ' - ' + date
        window.unsafeWindow.document.title = newTitle
        let interval = setInterval(()=>{
            let d = $('.page-video__details')
            if(d.length > 0){
                window.unsafeWindow.document.title = newTitle
            } else {
                clearInterval(interval)
            }
        },100);
    }
    GM_addStyle(`
    .page-video__byline__info{
        align-items: flex-start;
    }
         `)
    // GM_addStyle(`
    //     .my_download_btn{
    //     position: fixed
    //     }
    //     `)
    // function addDownloadBtn(item){
    //     let content = document.querySelector('.content')
    //     let container = content.querySelector('.container-fluid')
    //     let btn = document.createElement("a")
    //     btn.text = '下载Source视频'
    //     btn.className = 'my_download_btn'
    //     btn.download = newTitle
    //     btn.href = item.src.download
    //     // btn.onclick = ()=>{
    //     //     let a = GM_download(btn.href,btn.download)
    //     //     console.log('GM_download',a)
    //     //     return false
    //     // }
    //     content.insertBefore(btn,container)
    // }

    $(document).on('click','.pagination__item',()=>{
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });


    // 预览更改
    GM_addStyle(`
    .container-fluid{
    max-width:1335px;
    }
    .image{
    width:auto;
    }
         `)

    let previewAddDoing = false

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        //console.log('MutationObserver')
        let has = document.querySelector('.videoTeaser__thumbnail > img')
        let added = document.querySelector('[previewadded="1"]')
        if (has && !added) {
            mutationInstance.disconnect();
            document.querySelectorAll('.videoTeaser__thumbnail > img').forEach((i)=>{
                //console.log(i)
                const clone = i.cloneNode();
                clone.setAttribute('previewadded', '1')
                clone.src = clone.src.replace(/\/[^/]*$/, '/preview.webp')
                clone.src = clone.src.replace('thumbnail', 'original')
                //console.log(clone.src)
                i.insertAdjacentElement('afterend', clone)
            })
            previewAddDoing = false
        }
    });

    function previewAdd(){
        //console.log(previewAddDoing)
        if (previewAddDoing == true) {
            return
        }

        previewAddDoing = true
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }


    window.navigation.addEventListener("navigate", (event) => {
        previewAdd()
    });
    previewAdd()

})()