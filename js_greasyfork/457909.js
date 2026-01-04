// ==UserScript==
// @name         barriergate visualize
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add shift mutiselect on data protal
// @author       You
// @match        http://xdata.xiaopeng.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaopeng.link
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457909/barriergate%20visualize.user.js
// @updateURL https://update.greasyfork.org/scripts/457909/barriergate%20visualize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const image_query={
        save_result(value){
            if (value.hits){
                this.result=value
                console.log(this.result)
            }
        },
        result:[]
    }
    function brgate(js,context,size){

        console.log(js,context,size)
        const x_side=503
        const y_side=426
        js.forEach(obj=>{
            context.beginPath()
            context.strokeStyle = 'red'
            let idx
            for (idx in obj.barrier_gate){
                const x=(obj.barrier_gate[idx][0]/2-x_side)
                const y=(obj.barrier_gate[idx][1]/2-y_side)
                console.log(idx,(x_side+x)*size.width/1920,(y_side+y)*size.height/1080)
                if (idx==0){
                    context.moveTo((x_side+x*2)*size.width/1920,(y_side+y*2)*size.height/1080)
                }else{
                    context.lineTo((x_side+x*2)*size.width/1920,(y_side+y*2)*size.height/1080)
                }
            }
            context.stroke()
        })
    }
    function brgateside(js,context,size){
        context.strokeStyle = 'red'
        //console.log(js,context,size)
        js.barrier_line.lines.forEach(line=>{
            context.beginPath()
            let idx
            for (idx in line){
                console.log(line)
                if (idx==='0'){
                    context.moveTo((4/2/1.5+line[idx][0]*2)*1.5*size.width/968,(55/2/1.5+line[idx][1]*2)*1.5*size.height/775)
                }else{
                    context.lineTo((4/2/1.5+line[idx][0]*2)*1.5*size.width/968,(55/2/1.5+line[idx][1]*2)*1.5*size.height/775)
                }
            }
            context.stroke()
        })
        context.strokeStyle = 'green'
        js.pole_point.points.forEach(point=>{
            context.beginPath()
            context.arc((4/2/1.5+point[0]*2)*1.5*size.width/968,(55/2/1.5+point[1]*2)*1.5*size.height/775, 4, 0, 2 * Math.PI)
            context.stroke()
        }
                                    )
        context.strokeStyle = 'blue'
        js.ground_point.points.forEach(point=>{
            context.beginPath()
            context.arc((4/2/1.5+point[0]*2)*1.5*size.width/968,(55/2/1.5+point[1]*2)*1.5*size.height/775, 4, 0, 2 * Math.PI)
            context.stroke()
        }
                                      )
    }
    function cam2_crop(){
        document.querySelectorAll("canvas").forEach(
            (el,index)=>{
                const id =el.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll("span")[2].textContent
                const source=image_query.result.hits.hits.find(element => element._source.id===id)._source
                const context = el.getContext("2d")
                const size=el.getBoundingClientRect()
                if (source.camera_name==='cam2'){
                    context.strokeStyle = 'grey'
                    context.lineWidth = 3
                    context.strokeRect(
                        503*size.width/1920,426*size.height/1080,
                        914*size.width/1920,
                        574*size.height/1080
                    )
                }
                console.log(el)
                if(source.pj_ips_version.indexOf("gxodips_barriergatee38cam2")!=-1){
                    fetch("/data/prediction/ips_gxodips_barriergatee38cam2/"+source.prefix+'/'+source.id+'.json').then(response=>response.json()).then(data=>brgate(JSON.parse(data.pred_json).BARRIERGATE.br_gate_object,context,size))
                }
                if(source.pj_ips_version.indexOf("gxodips_brgatesidefront")!=-1){
                    fetch("/data/prediction/ips_gxodips_brgatesidefront/"+source.prefix+'/'+source.id+'.json').then(response=>response.json()).then(data=>brgateside(JSON.parse(data.pred_json).barriergate.br_gate_object,context,size))
                }
            }
        )
    }
    const button='<div style="width:50px; height:50px;border-radius:50%;background-color:white;text-align:center;position:fixed;right:50px;bottom:100px;" id="crop"><img src="service.png" width="40px" height="40px"></div>'
    document.querySelector("body").insertAdjacentHTML('beforeend', button)
    document.getElementById('crop').onclick=cam2_crop
    function show_picture(el){
        const stream_id=el.target.parentElement.querySelector("span:nth-child(5)").innerText.trim()
        const prefix=/prefix":string"(\d\d\d\d-\d\d-\d\d)/i.exec(document.querySelector("#rc-tabs-0-panel-clip_json > div > div > div > div").textContent)[1].trim()
        const frame_id=el.target.parentElement.querySelector("span").innerText.trim()
        const picture_src=`https://image-web-prod.xiaopeng.link/data/annotation_v2/${prefix}/${stream_id}/${frame_id}.jpg`
        //const dialog=`<div><div class="ant-modal-root"><div class="ant-modal-mask"></div><div tabindex="-1"class="ant-modal-wrap"style=""><div role="dialog"aria-modal="true"class="ant-modal"style="width: 1000px; transform-origin: 1263.74px 932.016px;"><div tabindex="0"aria-hidden="true"style="width: 0px; height: 0px; overflow: hidden; outline: none; --darkreader-inline-outline: initial;"data-darkreader-inline-outline=""></div><div class="ant-modal-content"><button type="button"aria-label="Close"class="ant-modal-close"><span class="ant-modal-close-x"><span role="img"aria-label="close"class="anticon anticon-close ant-modal-close-icon"><svg viewBox="64 64 896 896"focusable="false"data-icon="close"width="1em"height="1em"fill="currentColor"aria-hidden="true"data-darkreader-inline-fill=""style="--darkreader-inline-fill:currentColor;"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></span></button><div class="ant-modal-body"><img width="100%"height="100%"src="${picture_src}"></div><div class="ant-modal-footer"></div></div><div tabindex="0"aria-hidden="true"style="width: 0px; height: 0px; overflow: hidden; outline: none; --darkreader-inline-outline: initial;"data-darkreader-inline-outline=""></div></div></div></div></div>`
        //document.querySelector("body").insertAdjacentHTML('beforeend', dialog)
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
    const originFetch = fetch;
    //console.log(originFetch)
    window.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            console.log(url)
            if(/_search/.exec(url)){
                document.querySelectorAll("#canvas-image-sequence").forEach(el=> {
                    if(read_id.indexOf(el.parentElement.nextElementSibling.querySelector("div").textContent)>-1){
                        el.parentElement.style.backgroundColor='grey'
                    }else{
                        el.parentElement.style.backgroundColor=''
                    }
                })
                const reader = response.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            // "done"是一个布尔型，"value"是一个Unit8Array
                            reader.read().then((e) => {
                                let { done, value }=e;
                                try{
                                    image_query.save_result(JSON.parse(new TextDecoder("utf-8").decode(value)));
                                }
                                catch{
                                }
                                // 判断是否还有可读的数据？
                                //console.log(new TextDecoder("utf-8").decode(value))
                                if (done) {
                                    // 告诉浏览器已经结束数据发送
                                    controller.close();
                                    return;
                                }
                                // 取得数据并将它通过controller发送给浏览器
                                controller.enqueue(value);
                                push();
                            });
                        }
                        push();
                    }
                });
                let ret=new Response(stream, { headers: { "Content-Type": "text/html" } })
                //console.log(stream,ret);
                return ret;
            }else{
                return response;

            }
        });
    }
    function modifyTree(value,keyScale){
        let i
        for (i in value){
            if(i in keyScale){
                //if (!value[i].hasScale){
                value[i]=keyScale[i](value[i])
                //value[i].hasScale=true}
                //debugger
            }else{
                //console.log(Object.prototype.toString.call(value[i])==='[Object Object]')
                if (value[i]&&(value[i].constructor === Object || value[i].constructor === Array)){
                    value[i]=modifyTree(value[i],keyScale)
                }
                //debugger
            }
        }
        return value
    }
    var parse = JSON.parse;
    JSON.parse = function(params) {
        params=parse(params)
        //console.log("Hook JSON.parse ——> ", params);
        if(params.AP_WPSO){
            console.log("Hook JSON.parse ——> ", params.AP_WPSO);
            params.AP_WPSO=modifyTree(params.AP_WPSO,{x:coord => coord*4,y:coord => coord*4})
            console.log("Hook JSON.parse ——> ", params.AP_WPSO);
        }
        if(false &&params.AP_SOD){
            console.log("Hook JSON.parse ——> ", params.AP_SOD);
            params.AP_SOD=modifyTree(params.AP_SOD,{points: points=> {
                let p
                for (p in points){
                    points[p][0]=points[p][0]*4;points[p][1]=points[p][1]*4
                }return points
            }})
            console.log("Hook JSON.parse ——> ", params.AP_SOD);
        }
        return params;
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
        }
    })
    document.addEventListener('keyup', (e) => {
        if (e.keyCode === 16 && shiftKeyDown) { shiftKeyDown = false;console.log('shift up') ;shiftKeySelect = { start: null, end: null }}

    })

    // Your code here...
})();