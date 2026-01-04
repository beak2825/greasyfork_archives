// ==UserScript==
// @name         data protal extension
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  data portal 插件
// @author       You
// @match        http://xdata.xiaopeng.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaopeng.link
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448856/data%20protal%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/448856/data%20protal%20extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function show_picture(el){
        const stream_id=el.target.parentElement.querySelector("span:nth-child(5)").innerText.trim()
        const prefix=/prefix":string"(\d\d\d\d-\d\d-\d\d)/i.exec(document.querySelector("#rc-tabs-0-panel-clip_json > div > div > div > div").textContent)[1].trim()
        const frame_id=el.target.parentElement.querySelector("span").innerText.trim()
        const picture_src=`https://image-web-prod.xiaopeng.link/data/annotation_v2/${prefix}/${stream_id}/${frame_id}.jpg`
        const canvas = document.querySelector("canvas")
        const context = canvas.getContext("2d")
        let img = new Image()
        img.src = picture_src
            img.onload = function(){
                canvas.width=1920
                canvas.height=1080
                context.drawImage(this, 0, 0,1920,1080)
                // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
            }
        }
    setInterval(_=>document.querySelectorAll("div.ant-row > div > div > div >canvas").forEach(el=> ( el.onclick=e=>show_picture(e))),1000)
    let read_id=[]
    setInterval(_=>document.querySelectorAll("#canvas-image-sequence").forEach(el=> ( el.onclick=e=>{
        e.target.parentElement.style.backgroundColor='grey'
        read_id.push(e.target.parentElement.nextElementSibling.querySelector("div").textContent)
    })),1000)
    function cam2_crop(){
        document.querySelectorAll("canvas").forEach(
            (el,index)=>{
                const id =el.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll("span")[2].textContent
                const context = el.getContext("2d")
                const size=el.getBoundingClientRect()
                if (1){
                    context.strokeStyle = 'grey'
                    context.lineWidth = 3
                    context.strokeRect(
                        503*size.width/1920,426*size.height/1080,
                        914*size.width/1920,
                        574*size.height/1080
                    )
                }
            }
        )
    }
    const originFetch = fetch;
    //console.log(originFetch)
    window.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            console.log(url)
            if(/es-cn-zz11whj3g00127pvs.public.elasticsearch.aliyuncs.com:9200\/.*?\/_search/.exec(url)){
                console.log(document.querySelectorAll("#canvas-image-sequence"))
                document.querySelectorAll("#canvas-image-sequence").forEach(el=> {
                    if(read_id.indexOf(el.parentElement.nextElementSibling.querySelector("div").textContent)>-1){
                        el.parentElement.style.backgroundColor='grey'
                    }else{
                    el.parentElement.style.backgroundColor=''
                    }
                })
                return response;
            }else{
                return response;

            }
        });
    }
    var shiftKeySelect = { start: null, end: null }
    var shiftKeyDown = false
    var selectors
    var selecting=false
    function checkInputRange(start, end) {
        if (start<end){
            for (let i = start; i <= end; i++) {
                if (!selectors[i].checked){
                    console.log(i,'checking')
                    selectors[i].click()}
                else{
                    //console.log(selectors[i],'checked')
                }
            }
        }else{
            for (let i = start; i >= end; i--) {
                if (!selectors[i].checked){
                    console.log(i,'checking')
                    selectors[i].click()}
                else{
                    //console.log(selectors[i],'checked')
                }
            }
        }
    }
    var selectorsIndex
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 16 && !shiftKeyDown) {
            shiftKeyDown = true;console.log('shift down');
            selectors= Array.prototype.slice.call(document.querySelectorAll("div:nth-child(2) > label > span > input"));
            shiftKeySelect={ start: selectors.indexOf(document.activeElement), end: null };
            if (shiftKeySelect.start===-1){
                shiftKeySelect.start=null
            }
            console.log(selectors)
            for (selectorsIndex in selectors) {
                selectors[selectorsIndex].selectorsIndex=parseInt(selectorsIndex)
                selectors[selectorsIndex].onclick = e => {
                    if (e.target.checked && shiftKeyDown && !selecting) {
                        //console.log(e.target.selectorsIndex)
                        if (shiftKeySelect.start===null) {
                            shiftKeySelect.start = e.target.selectorsIndex
                            shiftKeySelect.end = null
                            console.log(shiftKeySelect)
                        } else {
                            if (shiftKeySelect.end===null){
                                shiftKeySelect.end = e.target.selectorsIndex
                                console.log(shiftKeySelect)}
                        }
                        if(shiftKeySelect.end){
                            selecting=true
                            checkInputRange(shiftKeySelect.start,shiftKeySelect.end)
                            selecting=false
                        }

                    }
                }
            }
        }else{
            if(e.keyCode === 188){
                document.querySelector("span.anticon.anticon-left-circle").click()
            }
            if(e.keyCode === 190){
                document.querySelector("span.anticon.anticon-right-circle").click()
            }
                        if(e.keyCode === 67){
                cam2_crop()
            }
        }
    })
    document.addEventListener('keyup', (e) => {
        if (e.keyCode === 16 && shiftKeyDown) { shiftKeyDown = false;console.log('shift up') ;shiftKeySelect = { start: null, end: null }}

    })

    // Your code here...
})();