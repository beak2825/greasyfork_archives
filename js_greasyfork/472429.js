// ==UserScript==
// @name         腾讯验证码自动滑动v2
// @namespace    mscststs
// @version      0.4
// @description  解决腾讯QQ登录验证码拖动问题
// @license      ISC
// @author       mscststs
// @match        https://captcha.gtimg.com/1/template/drag_ele.html
// @match        https://t.captcha.qq.com/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/472429/%E8%85%BE%E8%AE%AF%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E6%BB%91%E5%8A%A8v2.user.js
// @updateURL https://update.greasyfork.org/scripts/472429/%E8%85%BE%E8%AE%AF%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E6%BB%91%E5%8A%A8v2.meta.js
// ==/UserScript==

(function() {

    'use strict';
    async function eventHijacker(cb){
        let hijackEventList = ["mousedown","mousemove","mouseup","click","dblclick","pointerup","pointerdown","pointermove"];
        function handler(e){
            if(!e.fake){
                // 拦截真事件，防止触发
                e.stopPropagation();
                e.preventDefault();
                return false
            }
        }
        hijackEventList.forEach(eventKey=>{
            window.addEventListener(eventKey,handler,true)
        })
        await cb()
        hijackEventList.forEach(eventKey=>{
            window.removeEventListener(eventKey,handler,true)
        })
    };
    async function loadMain(){
        // 初始化 ，监听canvas
        console.log("start>>>>-1");
        await mscststs.sleep(500)
        await mscststs.wait("body[aria-hidden='false']")
        // console.log("重放！")
        const bg = await mscststs.wait("#slideBg")
            console.log("BG NOT V2",bg, bg.tagName )
        if(bg.tagName === "IMG"){
            console.log("BG NOT V2" )
            return;
        }
        console.log("start>>>>0");
        await mscststs.wait(".tc-slider-normal")
        console.log("start>>>>1");
        // await mscststs.sleep(500)
        // 重放开始
        const mutationObserver = new MutationObserver(mutations => {
            doHijack();
        })
        mutationObserver.observe(bg, {
            attributes: true
        });

        let inHack = false;
        doHijack();

        function doHijack(){
            if(inHack){
                return
            }
            eventHijacker(async ()=>{
                inHack = true;

                console.log("start>>>>1 body");
                await mscststs.wait("body[aria-hidden='false']");

                console.log("start>>>>1 bg");
                while(!bg.style.backgroundImage){
                    await mscststs.sleep(50);
                }
                console.log("start>>>>1 call");
                //await mscststs.sleep(500);
                await replay(getTargetRecorder( await fetchCanvas()-30,500),".tc-slider-normal")
                inHack = false;
            })
        }

    }

    async function loadImage(){
        const imageUrl = new URL(location.href).searchParams.get("url");

        console.log("跨域图片加载: ",imageUrl);
        let img = new Image();
        img.onload = ()=>{
            console.log("imgLoad -> success");
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL("image/png");
            // console.log("dataUrl:",dataURL)
            window.parent.postMessage(JSON.stringify({src:imageUrl,type:"CrossImageLoad",url: dataURL}), "*")
        };
        img.src = imageUrl;
    }

    (()=>{
        if(location.host === "captcha.gtimg.com"){
            loadMain();
        }

        if(location.host === "t.captcha.qq.com"){
            loadImage();
        }
    })()

    // 亲自录制的老奶奶轨迹，成功率 100%
    const recoder = [{"type":"pointerdown","clientX":256,"clientY":709,"ts":2176},{"type":"pointermove","clientX":256,"clientY":709,"ts":2190},{"type":"pointermove","clientX":256,"clientY":707,"ts":2239},{"type":"pointermove","clientX":257,"clientY":707,"ts":2247},{"type":"pointermove","clientX":258,"clientY":707,"ts":2254},{"type":"pointermove","clientX":259,"clientY":707,"ts":2263},{"type":"pointermove","clientX":259,"clientY":708,"ts":2279},{"type":"pointermove","clientX":260,"clientY":708,"ts":2287},{"type":"pointermove","clientX":261,"clientY":708,"ts":2296},{"type":"pointermove","clientX":263,"clientY":708,"ts":2303},{"type":"pointermove","clientX":265,"clientY":708,"ts":2312},{"type":"pointermove","clientX":268,"clientY":708,"ts":2319},{"type":"pointermove","clientX":271,"clientY":709,"ts":2328},{"type":"pointermove","clientX":277,"clientY":709,"ts":2335},{"type":"pointermove","clientX":280,"clientY":710,"ts":2346},{"type":"pointermove","clientX":284,"clientY":710,"ts":2351},{"type":"pointermove","clientX":289,"clientY":711,"ts":2362},{"type":"pointermove","clientX":294,"clientY":711,"ts":2367},{"type":"pointermove","clientX":299,"clientY":713,"ts":2379},{"type":"pointermove","clientX":303,"clientY":713,"ts":2386},{"type":"pointermove","clientX":306,"clientY":713,"ts":2396},{"type":"pointermove","clientX":309,"clientY":713,"ts":2399},{"type":"pointermove","clientX":311,"clientY":713,"ts":2407},{"type":"pointermove","clientX":315,"clientY":713,"ts":2415},{"type":"pointermove","clientX":318,"clientY":713,"ts":2422},{"type":"pointermove","clientX":322,"clientY":713,"ts":2431},{"type":"pointermove","clientX":326,"clientY":713,"ts":2439},{"type":"pointermove","clientX":330,"clientY":713,"ts":2447},{"type":"pointermove","clientX":333,"clientY":713,"ts":2455},{"type":"pointermove","clientX":336,"clientY":713,"ts":2463},{"type":"pointermove","clientX":338,"clientY":714,"ts":2471},{"type":"pointermove","clientX":339,"clientY":714,"ts":2481},{"type":"pointermove","clientX":338,"clientY":714,"ts":2719},{"type":"pointermove","clientX":337,"clientY":716,"ts":2732},{"type":"pointermove","clientX":336,"clientY":716,"ts":2735},{"type":"pointermove","clientX":334,"clientY":716,"ts":2746},{"type":"pointermove","clientX":333,"clientY":716,"ts":2751},{"type":"pointermove","clientX":332,"clientY":716,"ts":2762},{"type":"pointermove","clientX":330,"clientY":716,"ts":2767},{"type":"pointermove","clientX":329,"clientY":716,"ts":2779},{"type":"pointermove","clientX":328,"clientY":716,"ts":2783},{"type":"pointermove","clientX":327,"clientY":716,"ts":2799},{"type":"pointermove","clientX":328,"clientY":716,"ts":3063},{"type":"pointermove","clientX":329,"clientY":716,"ts":3087},{"type":"pointermove","clientX":330,"clientY":716,"ts":3103},{"type":"pointermove","clientX":331,"clientY":716,"ts":3127},{"type":"pointermove","clientX":332,"clientY":716,"ts":3146},{"type":"pointermove","clientX":331,"clientY":716,"ts":3583},{"type":"pointermove","clientX":330,"clientY":716,"ts":3639},{"type":"pointermove","clientX":329,"clientY":716,"ts":3655},{"type":"pointerup","clientX":329,"clientY":716,"ts":4407},{"type":"click","clientX":329,"clientY":716,"ts":4420},{"type":"pointermove","clientX":329,"clientY":716,"ts":4422},{"type":"mousemove","clientX":329,"clientY":716,"ts":4422}]
    /**
    * ImageData 转色值矩阵
    */
    function imageDataToBrightnessArray(imageData,width,height){
        const step = 110;
        let brightnessArray = []
        let pixel_color = imageData
        let pointer = 0
        for(let i=0;i< height;i++)
        {
            brightnessArray[i] = []; //将每一个子元素又定义为数组
            for( let n=0;n< width;n++)
            {
                if(pixel_color[pointer] > step){
                    brightnessArray[i][n] = parseInt((pixel_color[pointer] + pixel_color[pointer+1] + pixel_color[pointer+2]) / 3);
                }else if(pixel_color[pointer+1] > step){
                    brightnessArray[i][n] = parseInt((pixel_color[pointer] + pixel_color[pointer+1] + pixel_color[pointer+2]) / 3);
                }else if(pixel_color[pointer+2] > step){
                    brightnessArray[i][n] = parseInt((pixel_color[pointer] + pixel_color[pointer+1] + pixel_color[pointer+2]) / 3);
                }else{
                    brightnessArray[i][n] = 0;
                }
                //brightnessArray[i][n]= parseInt((pixel_color[pointer] + pixel_color[pointer+1] + pixel_color[pointer+2]) / 3) > 160 ? 1 : 0 ; //此时pix[i][n]可以看作是一个二级数组
                pointer = pointer+4;
            }
        }
        return brightnessArray

    }
    function zipArray_row(b_array){
        let result = []
        let height = b_array.length;
        let width = b_array[0].length;
        for(let i = 0;i<width;i++){
            let val = 0;
            for(let j= 0;j<height ; j++){
                val += b_array[j][i]
            }
            result[i] = parseInt(val/height)
        }
        return result
    }

    async function loadCrossOriginImg(src){
        return new Promise((resolve,reject)=>{
            const iframe = document.createElement("iframe");
            iframe.src = `https://t.captcha.qq.com/CrossOriginLoad?url=${encodeURIComponent(src)}`;
            window.addEventListener("message", (event)=>{
                const data = JSON.parse(event.data);
                if(data.src === src){
                    document.body.removeChild(iframe);
                    const img = new Image();
                    img.onload = ()=>{
                        resolve(img);
                    };
                    img.onerror = reject;
                    img.src = data.url;
                }

            });
            document.body.appendChild(iframe);
        })
    };
    function drawVline(ctx,left){
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(left, 0, 1, ctx.height)
    }
    async function createCanvas(element){
        let {width,height} = element.style;
        width = parseInt(width);
        height = parseInt(height);
        console.log("createCanvas",width,height);
        let canvas = document.createElement("Canvas");
        canvas.width=width;
        canvas.height=height;
        document.body.appendChild(canvas);
        canvas.style = "position:absolute; bottom:0px;";
        let ctx = canvas.getContext("2d");
        const url = element.style.backgroundImage.split("\"")[1];
        const image = await loadCrossOriginImg(url);
        ctx.drawImage(image,0,0, width, image.height/image.width*width);
        return canvas
    }
    async function getctx(selector){
        let bgCanvas = document.querySelector(selector);
        console.dir(bgCanvas)
        if(bgCanvas.tagName != 'CANVAS'){
            bgCanvas = await createCanvas(bgCanvas)
        }
        let {width, height} = bgCanvas; // 宽度，高度
        let ctx = bgCanvas.getContext("2d");
        ctx.height = height;
        ctx.width = width;
        return ctx
    }
    function getImageData(selector){
        let ctx = getctx(selector)
        return ctx.getImageData(0,0,ctx.width,ctx.height).data
    }
    window.fetchCanvas = async function(brightStep=10){
        //let fullBgData = getImageData("#slideBg") // 完整背景图
        console.log("start>>>>1.5");
        let bgctx = await getctx("#slideBg");
        console.log("start>>>>2: bgctx", bgctx);
        let bgData = bgctx.getImageData(0,0,bgctx.width,bgctx.height).data // 残缺背景图

        const maxTop = parseInt(document.querySelector(".tc-fg-item[style*='absolute'][style*='cursor']").style.top) + 5;
        const height = parseInt(document.querySelector(".tc-fg-item[style*='absolute'][style*='cursor']").style.height) -15 ;
        bgctx.fillStyle = "black";
        console.log("maxTop", maxTop);
        console.log("height", height);
        bgctx.fillRect(0, 0, bgctx.width, maxTop);
        bgctx.fillRect(0, maxTop+height, bgctx.width,bgctx.height );


        window.brightnessArray = imageDataToBrightnessArray(bgData,bgctx.width,bgctx.height);

        window.brightnessArray = window.brightnessArray.slice(maxTop, maxTop+height);

        console.log("brightnessArray", window.brightnessArray);

        window.brightnessArray_row = zipArray_row(window.brightnessArray);



        console.log("brightnessArray_row",window.brightnessArray_row);

        let leftOffset = 0;
        window.brightnessChange_row = [];

        for(let i = 0;i<window.brightnessArray_row.length - 45 -10 ;i ++ ){
            const sum = window.brightnessArray_row.slice(i,45+i).reduce((p,c)=>c+p, 0);
            window.brightnessChange_row.push({
                index:i,
                value:sum
            })
        }


        /*window.brightnessChange_row = window.brightnessArray_row.map((item,index)=>{
            let next = window.brightnessArray_row[index+1] || item
            return {
                index:index,
                value:Math.abs(next-item)
            }
        });*/
        //console.log(window.brightnessChange_row);

        window.brightnessChange_row = window.brightnessChange_row.filter(item=>{
            if(item.index < bgctx.width*0.4){
                return false
            }
            return true
        })

        window.brightnessChange_row.sort((a,b)=>{
            return a.value-b.value
        })

        console.log("brightnessChange_row",window.brightnessChange_row);

        drawVline(bgctx ,window.brightnessChange_row[0].index)
        drawVline(bgctx ,window.brightnessChange_row[1].index)
        drawVline(bgctx ,window.brightnessChange_row[2].index)

        leftOffset = Math.min(window.brightnessChange_row[0].index, window.brightnessChange_row[1].index,window.brightnessChange_row[2].index)

        // console.log(window.brightnessChange_row)
        //throw new Error("暂停")
        // 拿到 leftOffset ，就是对应的缺口的偏移量
        console.log(leftOffset)
        return leftOffset
    }
    // 录制鼠标事件
    window.record = async function(){
        return await new Promise((resolve,reject)=>{
            let ms = new Date().valueOf();
            const getTime = ()=>{ // 时间打点
                return new Date().valueOf() - ms;
            }
            let eventList = [];
            function eventRecorder(e){
                let { type, clientX, clientY, target } = e;
                let eventMsg = { type, clientX, clientY, ts:getTime()}
                eventList.push(eventMsg)
            }
            // 开始录制
            window.addEventListener("keyup",(e)=>{
                ["mousedown","mousemove","mouseup","click","dblclick","pointerup","pointerdown","pointermove"].forEach(eventKey=>{
                    window.addEventListener(eventKey,eventRecorder,true)
                })
                // 停止录制
                window.addEventListener("keyup",(e)=>{
                    ["mousedown","mousemove","mouseup","click","dblclick","pointerup","pointerdown","pointermove"].forEach(eventKey=>{
                        window.removeEventListener(eventKey,eventRecorder,true)
                    })
                    resolve(eventList)
                },{once:true})
            },{once:true})
        })
    }
    // 轨迹压缩和重整
    window.getTargetRecorder = function getTargetRecorder(targetlength=100, targetduration=1000, recorder=recoder, ){
        console.log(`重放，长度 ${targetlength}， 时间 ${targetduration}`)
        // step 1. 首先以第一个事件的位置为起始，压缩整个轨迹
        let base = recorder[0];
        let ziped_recorder = recorder.map(event=>{
            return {
                type:event.type,
                offsetX:event.clientX - base.clientX,
                offsetY:event.clientY - base.clientY,
                ts:event.ts - base.ts
            }
        })
        // 压缩后的事件记录
        // console.log("ziped", ziped_recorder)
        let max = ziped_recorder[ziped_recorder.length -1] // 拿到最后一个
        ziped_recorder.reduce((p,e,i)=>{
            e.offsetX = parseInt(e.offsetX * targetlength / max.offsetX) // 轨迹缩放
            e.ts = parseInt(e.ts * targetduration / max.ts ) // 时间戳缩放
            return e
        })
        return ziped_recorder
    }
    // 轨迹事件重放
    window.replay = function(recorder, dom){
        if(typeof dom === "string"){
            dom = document.querySelector(dom)
        }
        let {left, top} = dom.getBoundingClientRect();
        left = left + 20* Math.random()
        top = top + 20* Math.random()
        return Promise.all(
            recorder.map(e=>{
                return new Promise(resolve=>{

                    setTimeout(()=>{
                        let type = "";
                        // 由于以前极验用的是pointer，现在要用mouse
                        if(e.type === "pointerdown") type = "mousedown";
                        if(e.type === "pointermove") type = "mousemove";
                        if(e.type === "pointerup") type = "mouseup";

                        let event = new Event(type,{"bubbles":true, "cancelable":false});

                        event.offsetX = e.offsetX;
                        event.offsetY = e.offsetY;
                        event.screenX = event.pageX = event.clientX = e.offsetX + left;
                        event.screenY = event.pageY = event.clientY = e.offsetY + top;
                        event.fake = true;
                        dom.dispatchEvent(event);
                        resolve()
                        //console.log("....",e.type,event)
                    },e.ts)
                })
            })
        )
    }
})();

