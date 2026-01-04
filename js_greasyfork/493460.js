// ==UserScript==
// @name         易企秀海报导出图片
// @namespace    http://tampermonkey.eqxposter.1.0.baseVresion.net/
// @version      1.0
// @description  易企秀超高清截图。百分百正确去水印，导出原图脚本需要请私聊。此脚本为基础版，支持部分海报正确导出 去水印原图。
// @author       zouys
// @match        https://www.eqxiu.com/h2/create/*
// @icon         https://img.douyucdn.cn/data/yuba/default/2021/08/26/202108260113528146305214128.jpg?i=3729ce896e75556d73b47749933df87293
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      font.eqh5.com
// @connect      asset.eqh5.com
// @downloadURL https://update.greasyfork.org/scripts/493460/%E6%98%93%E4%BC%81%E7%A7%80%E6%B5%B7%E6%8A%A5%E5%AF%BC%E5%87%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/493460/%E6%98%93%E4%BC%81%E7%A7%80%E6%B5%B7%E6%8A%A5%E5%AF%BC%E5%87%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/**
 目前思路:
 通过canvas画板,按照html中的设定样式挨个画出,导出为图片
 图片通过接口抓取地址,
 带字体文本,通过svg保存为图片(编码实现)

 理论上可行,可设置图片分辨率
 根据下载图片的分辨率,理论上存在最大分辨率

 */
(function() {
    'use strict';

    if(typeof GM_xmlhttpRequest=='undefined'){
        console.error('GM_xmlhttpRequest not support！')
        return ;
    }
    let btn=document.createElement('button')
    btn.style.width='250px;'
    btn.style.height='50px;'
    btn.style.position='absolute'
    btn.style.left='50%'
    btn.style.top='70px'
    btn.style.zindex='999999'
    btn.style.backgroundColor='yellow'
    btn.onclick=()=>{domain()}
    btn.innerText='一键导出图片'
    document.body.appendChild(btn);


    //捕获请求获得的模版数据
    let templateData;
    //模版图片数据，用于获取无水印图片
    let templatePicListData;
    //画布
    let canvas;
    //画布上下文
    let ctx;
    //缩放值
    let scale;
    /**
     * 通过queue保存画布操作
     * 队列
     */
    let drawQueue = [];
    //字体
    let fontMap=new Map();
    //字体中文别名
    let fontNickNameMap=new Map();
    //字体对应url
    let fontUrlMap=new Map();
    //特殊字体用字，用于获取差异字体文件
    let specialFontMap=new Map();

    // 创建Canvas元素
    canvas = document.createElement('canvas');
    // Canvas上下文
    ctx = canvas.getContext('2d');
    /**
     * 将绘制操作添加到队列中
     * @param drawFunction 函数，队列中保存的函数
     */
    function addToDrawQueue(drawFunction) {
        drawQueue.push(drawFunction);
    }
    /**
     * 从队列中取出绘制操作并执行，默认会取出队列
     * @param execute 默认为true，从队列头部取出操作
     * @returns {Promise<void>}
     */
    async function runDrawQueue(execute = true) {
        await new Promise(function (resolve, reject) {
            if (drawQueue.length > 0 && execute) {
                let drawFunction = drawQueue.shift();
                drawFunction();
                resolve();
            } else {
                console.warn('drawQueue is empty');
                reject()
            }
        })
    }
    /**
     * 根据url，提升画质
     *     *https://asset.eqh5.com//store/bade83874ac8f0d467738052ff2a5ef6.jpg?
     *     * imageMogr2/auto-orient
     *     * /quality/100
     *     * /cut/976x2048x194x0
     * @param imageUrl 图片地址
     * @param quality 质量，1-100，越大越清晰
     * @returns {*|string} 返回加工后的图片地址
     */
    let upgradeImage=(imageUrl,quality)=>{
        if(imageUrl.includes('quality/')){
            let stringArr=imageUrl.split('quality/');
            return stringArr[0]+'quality/'+quality+(stringArr[1].length>3?stringArr[1].substring(stringArr[1].indexOf('/')):'');
        }else
            return imageUrl
    }
    /**
     * 将画布转为图片
     * @param canvas 已完成操作的画布
     */
    let canvasToImage=(canvas)=>{
        // 获取转换后的图片数据
        const imageData = canvas.toDataURL('image/jpeg',1);

        let downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = 'test.jpeg';
        downloadLink.click();
        Vue.loading.close()
    }
    /**
     * 图片加载完成后，进行画布操作
     * @param image 图片
     * @param canvas 画布，弱耦合，获取画布宽高
     * @param ctx 画布上下文，用于画操作
     * @param dx 在画布中开画的起始x轴坐标
     * @param dy 在画布中开画的起始y轴坐标
     * @param dWidth 默认为画布宽带，规定所画图片的宽带，等比例缩放。
     * @param dHeight 默认为画布高度，规定所画图片的高度，等比例缩放。
     * @returns {Promise<void>} 可同步等待完成
     */
    let imageLoad=async (image,canvas,ctx,dx,dy,dWidth,dHeight)=>{
        console.log(image.msg,`,加载成功：像素：${image.naturalWidth}*${image.naturalHeight}`);
        //console.log('图片高度：',image.naturalHeight,'px');
        //console.log('图片宽度：',image.naturalWidth,'px');
        //console.log(image);

        //画出背景图,保存ctx，独立每次操作
        //ctx.save();
        //ctx.globalAlpha = 0.5;
        await ctx.drawImage(image,dx,dy,dWidth || canvas.width,dHeight || canvas.height);
        //ctx.globalAlpha = 1;
        //ctx.restore();
        //await canvasToImage(canvas);
    }

    /**
     * 队列处理，逐个出队
     */
    function drawLoop(){
        runDrawQueue().then()
        while(drawQueue.length>0){
            runDrawQueue().then();
        }
        try {
            canvasToImage(canvas);
            console.log("图片导出成功！")
        }catch (e) {
            console.warn("图片最后导出异常！",e)

        }
    }
    function getDateString() {
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1，然后确保两位数
        let day = ('0' + currentDate.getDate()).slice(-2); // 获取日期并确保两位数
        let hours = ('0' + currentDate.getHours()).slice(-2); // 获取小时并确保两位数
        let minutes = ('0' + currentDate.getMinutes()).slice(-2); // 获取分钟并确保两位数
        let seconds = ('0' + currentDate.getSeconds()).slice(-2); // 获取秒并确保两位数
        let daysOfWeek = ['Sunday周日', 'Monday周一', 'Tuesday周二', 'Wednesday周三', 'Thursday周四', 'Friday周五', 'Saturday周六'];
        let dayOfWeek = daysOfWeek[currentDate.getDay()];

        // 构建时间字符串，格式为 YYYY-MM-DD HH:MM:SS DayOfWeek
        let currentDateString = year + '年-' + month + '月-' + day + '日 ' + hours + '时:' + minutes + '分:' + seconds + '秒 ' + dayOfWeek;
        return (currentDateString);
    }
    //劫持函数
    function addXMLRequestCallback(callback) {
        // oldSend 旧函数 i 循环
        var oldSend, i;
        //判断是否有callbacks变量
        if (XMLHttpRequest.callbacks) {
            //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            XMLHttpRequest.callbacks.push(callback);
        } else {
            //如果不存在则在xmlhttprequest函数下创建一个回调列表/callback数组
            XMLHttpRequest.callbacks = [callback];
            // 保存 XMLHttpRequest 的send函数
            oldSend = XMLHttpRequest.prototype.send;
            //获取旧xml的send函数，并对其进行劫持（替换）  function()则为替换的函数
            XMLHttpRequest.prototype.send = function () {
                // 把callback列表上的所有函数取出来
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    // 把this传入进去
                    XMLHttpRequest.callbacks[i](this);
                }
                //循环回调xml内的回调函数
                // 调用旧的send函数 并传入this 和 参数
                oldSend.apply(this, arguments);
            };
        }
    }
    //传入回调 接收xhr变量
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener("load", function () {
            // 输出xhr所有相关信息
            if (xhr.readyState === 4 && xhr.status === 200) {
                //  如果xhr请求成功 则返回请求路径
                //console.log("函数1", xhr.responseURL);
                // 捕获模版元素 数据 用于获取特殊字体
                if(xhr.responseURL.includes('https://p1.eqxiu.com/m/print/page/save') || xhr.responseURL.includes('https://p1.eqxiu.com/m/print/page/batch/save')){
                    console.log(xhr.response)
                    if(JSON.parse(xhr.response).obj){
                        templateData=JSON.parse(xhr.response).obj.elements;
                        console.log("捕获请求数据：",templateData);
                    }
                }
                // 捕获 模板 字体数据或 所用图片列表
                else if (xhr.responseURL.includes("https://emw-api.eqxiu.com/copyright/list-style")){
                    //console.log(JSON.parse(xhr.response))
                    if(JSON.parse(xhr.response).obj.picList){
                        templatePicListData=JSON.parse(xhr.response).obj.picList;
                        console.log("捕获请求图片列表：",templatePicListData)
                    }
                }
            }
        });

    });
    let getSpecialFont=async (eleList) => {
        try {
            if (eleList) {
                //获取模版用字，特殊字体字
                //叠加获取字体，style和list-style不可信
                for (const ele of eleList) {
                    //console.log(ele)
                    if (ele.property.content && (ele.property.fontFamilyName !== "默认字体")) {
                        //获取特殊字
                        let fontFamily;
                        let fontFamilyName = ele.property.fontFamilyName;

                        if (ele.property.contentStyle && ele.property.contentStyle.fontFamily) {
                            fontFamily = ele.property.contentStyle.fontFamily;

                        } else {
                            //根据fontFamilyName来获取对应的font
                            if(fontNickNameMap.size>0){
                                for(let [key, value] of fontNickNameMap.entries()) {
                                    if (value === fontFamilyName) {
                                        fontFamily = key;
                                        break;
                                    }
                                }
                            }else{
                                console.warn("字体别名查询异常！");
                            }
                        }
                        if(ele.css && ele.css.fontFamily){
                            fontFamily = ele.css.fontFamily;
                        }
                        //去除所有空格
                        let fontContent = ele.property.content.replace(/\s/g, '');
                        //检查是否为时间格式的
                        //showLayerLabel='日期...'
                        if(ele.property.showLayerLabel && ele.property.showLayerLabel.includes("日期")) {
                            fontContent = getDateString().replace(/\s/g, '');
                        }
                        console.log("fontContent", fontContent);
                        //保存多种字体用字
                        specialFontMap.set(fontFamily, specialFontMap.get(fontFamily) ? (specialFontMap.get(fontFamily) + fontContent) : fontContent);
                        //增加字体
                        if(!fontUrlMap.has(fontFamily)){
                            fontUrlMap.set(fontFamily, `https://font.eqh5.com/store/fonts/${fontFamily}.woff`);
                        }
                    }
                }
                console.log("特殊字体字：", specialFontMap)
                //文件差异化装载到map中
                try {
                    if(fontUrlMap.size>0){
                        for(let [key,value] of fontUrlMap.entries()) {
                            //console.log(value)
                            if(!fontMap.has(key)){
                                //去重
                                value=value+'?text='+encodeURIComponent(Array.from(new Set(specialFontMap.get(key))).join(''));
                                //获取字体数据
                                fontMap.set(key, await requestFontDate(value));
                                console.log(`字体：${key},别名${fontNickNameMap.get(key)},文件已差异化加载到map`)
                            }
                        }
                        //console.log("fontMap:",fontMap)
                    }else {
                        console.log("本模版使用默认字体！")
                    }
                }catch (e) {
                    console.error("字体map装载出错",e)
                }

            }

        } catch (e) {
            console.warn("模版特殊用字获取失败！导出图片可能为默认字体！");
            console.warn(e);
        }
    }
    /**
     * 根据dom中的style装载字体map，不装载默认字体
     * */
    let initFont=async (defaultFont) => {
        try {
            let styleNodeCollection = document.getElementsByTagName('style');
            let arr = Array.from(styleNodeCollection);
            for (let index = 0; index < arr.length; index++) {
                //序列化
                let styleNode = new XMLSerializer().serializeToString(arr[index]);
                //console.log("styleNode:",styleNode)
                let fontMatches = styleNode.match(/@font-face\s*{[^}]*}/g)
                //console.log(fontMatches)
                if (fontMatches && fontMatches.length > 0) {
                    for(let matchString of fontMatches) {
                        let fontString = matchString;
                        let font;
                        if(fontString.split('font-family:"')[1] && fontString.split('font-family:"')[1].split('";')[0]){
                            font = fontString.split('font-family:"')[1].split('";')[0]
                            console.log("检测到字体：",font);
                        }else {
                            continue;
                        }

                        if (font && !fontUrlMap.has(font) && font!==defaultFont && font!=='element-icons') {
                            //获取这个字体的url
                            //https://font.eqh5.com/store/fonts/ZYADMGWSBZ.woff?text=%E7%88%B1%E7%9A%84%E7%9B%AE%E5%85%89%E6%97%A0%E6%89%80%E4%B8%8D%E5%9C%A8
                            let url = fontString.split('url(')[1].split(')')[0]
                            //纯净url，组装获取所需要的字
                            //url=url.split('?')[0]+'?'+`text=${encodeURIComponent(specialFontMap.get(font))}`;
                            //字体别名存储
                            try {
                                fontNickNameMap.set(font, decodeURIComponent(url.split('text=')[1]))
                            } catch (e) {
                                console.warn("字体别名存储失败！导出字体可能失效！")
                            }
                            //纯净url
                            url=url.split('?text=')[0];
                            console.log(`字体：${font},别名${fontNickNameMap.get(font)} ,对应url：${url}`)

                            fontUrlMap.set(font, url)

                        } else {
                            //console.error(`字体:${font}`)
                        }
                    }
                } else {
                    //console.warn("未找到：@font-face 字段")
                }
            }
            console.log("字体urlMap",fontUrlMap);

        } catch (e) {
            console.error("字体初始化异常！", e)
        }
    }
    /**
     *
     * */
    let getDiv2Svg=(div)=>{
        let mySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let divRect=window.getComputedStyle(div);
        div.setAttribute("xmlns",'http://www.w3.org/1999/xhtml');
        mySvg.setAttribute('width', divRect.width+'');
        mySvg.setAttribute('height', divRect.height+'');
        // 创建一个 foreignObject 元素，用于包装原始 div 元素
        let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.setAttribute('width', '100%');
        foreignObject.setAttribute('height', '100%');
        foreignObject.appendChild(div.cloneNode(true));
        //包含特殊字体处理
        if(divRect.fontFamily && divRect.fontFamily!=="SourceHanSansCN_Normal"){
            mySvg=fontStyleInnerSvg(mySvg,divRect.fontFamily);
        }
        mySvg.appendChild(foreignObject);
        let mySvgData = new XMLSerializer().serializeToString(mySvg);
        return "data:image/svg+xml,"+mySvgData;
    }
    async function domain() {
        console.log('do it')
        console.log('do it')
        /*以下需要等待懒加载全部加载成功后调用*/
        Vue.loading.open('导出中...')
        /*eqc-editor  根元素*/
        //获取根节点
        const editorRoot = document.querySelector('.eqc-editor');
        //获取根节点宽高信息
        const editorRootRect = editorRoot.getBoundingClientRect();
        //获取编辑器中所有子节点，包括水印
        //const childDivALL = editorRoot.children;
        /*根据编辑器 高宽 ,设置画布,最后导出为图片*/

        canvas.width = editorRootRect.width;
        canvas.height = editorRootRect.height;
        //画出背景图  eqc-background
        //无水印获取图片
        //获取背景图div
        try{
            let background_div_0 = editorRoot.children[0].children[1].children[0];
            let background_url;
            if((new XMLSerializer().serializeToString(background_div_0)).includes('background')){
                let myBackground_url = window.getComputedStyle(background_div_0).backgroundImage.split('"')[1].split('"')[0]
                //  图片画质提升
                background_url = await upgradeImage(myBackground_url, 100);
                //console.log("背景图画质提升后url：",background_url);
            }else {
                //转为svg
                try {
                    background_div_0=editorRoot.children[0];
                    background_url=getDiv2Svg(background_div_0);

                }catch (e) {
                    console.warn("背景图转为svg失败！导出图片可能会有缺失！")
                }
            }
            if(!background_url){
                console.warn("背景图url解析失败！")
            }else {
                //同步加载背景图片，并存入队列，防止错位
                let image;
                await new Promise((resolve, reject) => {
                    try {
                        let image = new Image();
                        //防止跨域问题
                        image.setAttribute("crossOrigin", 'anonymous');
                        image.src = background_url;
                        image.msg = '背景图片';
                        resolve(image)
                    } catch (e) {
                        reject(e);
                        console.error('Failed to load image:', e)
                    }
                }).then((v)=>{
                    image=v;
                },r=>{
                    console.log(r)
                    image.msg="null image!"
                })
                console.log(image.msg,",入队！")
                //console.log(image)
                addToDrawQueue(() => {
                    imageLoad(image, canvas, ctx, 0, 0,null,null);
                })
            }
        }catch (e) {
            console.log(e)
        }
        //初始化字体map，排除默认字体
        await initFont("SourceHanSansCN_Normal");
        /**
         * 获取特殊字体
         * */
        await getSpecialFont(templateData);


        /*获取 eqc-elements */
        let eqcEle = document.querySelector('.eqc-elements');
        //获取缩放值
        scale = parseFloat(eqcEle.style.transform.split('(')[1].split(')')[0]);

        //编辑器中的div集合，包裹svg或者图片  .h2-core-check-ele
        const divCollect = document.querySelector('.eqc-elements').querySelectorAll('div')
        let domObjectArr=[];
        await divCollect.forEach((value)=>{
            if(value.style.zIndex){
                domObjectArr.push({
                    dom: value,
                    zIndex: value.style.zIndex
                });
            }
        })
        domObjectArr.sort((a, b) => {
            // 将zIndex转换为数字进行比较
            return parseInt(a.zIndex) - parseInt(b.zIndex);
        });
        console.log("dom元素数组：",domObjectArr)
        //遍历集合，确定其中是svg还是图片，得按顺序入队使用for
        let loopArr=domObjectArr
            for (let key = 0; key < loopArr.length; key++) {
                //console.log("value:", value)
                let value=loopArr[key];
                let svg = value.dom.querySelector('svg');
                let img=value.dom.querySelector('img');
                let div=value.dom.querySelector('div');
                //svg，画到canvas
                if (svg) {
                    //svg中包含image标签的情况
                    let svgImage=svg.querySelectorAll('image');
                    if(svgImage.length > 0){
                        // console.log("svgImage[0]:",svgImage[0]);
                        // console.log(svgImage[0].href.baseVal)
                        svgImage[0].src= await new Promise((resolve, reject) => {
                            // 创建一个 Image 对象
                            const img = new Image();

                            // 允许加载跨域图像
                            img.crossOrigin = "Anonymous";
                            img.src=svgImage[0].href.baseVal
                            // 图像加载完成后的处理
                            img.onload = function () {
                                // 创建一个 Canvas 元素
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');

                                // 设置 Canvas 的宽度和高度
                                canvas.width = img.width;
                                canvas.height = img.height;

                                // 将图像绘制到 Canvas 上
                                ctx.drawImage(img, 0, 0);

                                // 获取 Canvas 上的图像数据
                                const imageData = canvas.toDataURL('image/png'); // 使用 'image/png' 格式

                                // 解析 Base64 数据并返回
                                resolve(imageData);
                            };

                            // 加载失败的处理
                            img.onerror = function (e) {
                                reject(e);
                            };}
                            )
                        //console.log("svgImage[0].src",svgImage[0].src);
                        // 获取 Canvas 上的图像数据
                         // 使用 'image/png' 格式
                        //svgImage[0].src = myCanvas.toDataURL('image/png');
                    }
                    let svgData = new XMLSerializer().serializeToString(svg);
                    let valueData=new XMLSerializer().serializeToString(value.dom);
                    /* SVG父节点中包含旋转样式的处理*/
                    if(valueData.includes('rotate')){
                        let rect=window.getComputedStyle(value.dom);
                        let matrix=rect.getPropertyValue('transform');
                        let angle=0;
                        if(matrix!==''){
                            let values = matrix.split('(')[1].split(')')[0].split(',');
                            let a = parseFloat(values[0]);
                            let b = parseFloat(values[1]);
                            angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                            let mySvg=svg.cloneNode(true);
                            mySvg.setAttribute('transform',`rotate(${angle})`);
                            svgData=new XMLSerializer().serializeToString(mySvg);
                        }else {
                            console.warn('图片没有旋转！但进入了旋转适应函数！')
                            return
                        }
                    }
                    //console.log(svgData)
                    /*svg对应字体获取*/
                    //获取字体名
                    if(svgData.includes("font-family"))
                    {
                        let font=svgData.split('font-family:')[1].split(';')[0]
                        try {
                            console.log(`检测到字体：${font}`)
                            if(font!=="SourceHanSansCN_Normal"&& fontMap.has(font)){
                                svgData=new XMLSerializer().serializeToString(fontStyleInnerSvg(svg,font));
                            }
                        }catch (e) {
                            console.warn("字体加载出错！",e)
                        }
                    }
                    //console.log(`svg:${svgData}`)
                    // 将SVG绘制到Canvas上
                    let blob = await new Blob([svgData], {type: 'image/svg+xml;base64,'});
                    //console.log("src:",URL.createObjectURL(blob))
                    await getImage2Queue(URL.createObjectURL(blob),key,svg,value,"svg")

                }
                //img,画到canvas
                else if(img){
                    //console.log("图片地址：",img.src)
                    //水印检查
                    img.src=checkPicWaterMaskUrl(img.src)
                    //质量提升
                    img.src=upgradeImage(img.src,100);
                    await getImage2Queue(img.src,key,img,value,"img");
                }
                else if(div){
                     //有多种情况
                    if(div.children.length>0){
                        //包含的是其他标签
                        //canvas
                        let flag=div.children[0];
                        if(flag instanceof HTMLCanvasElement){
                            //canvas->image->function
                            let canvas = flag;
                            let ctx = canvas.getContext('2d');

                            // 将 Canvas 的背景颜色设置为透明
                            canvas.style.backgroundColor = "transparent";

                            // 获取 Canvas 的宽度和高度
                            let width = canvas.width;
                            let height = canvas.height;

                            // 创建一个新的 Canvas 元素
                            let newCanvas = document.createElement('canvas');
                            let newCtx = newCanvas.getContext('2d');

                            // 设置新 Canvas 的宽度和高度
                            newCanvas.width = width;
                            newCanvas.height = height;

                            // 清空新 Canvas
                            newCtx.clearRect(0, 0, width, height);

                            // 获取 Canvas 上的非透明内容
                            let imageData = ctx.getImageData(0, 0, width, height);

                            // 在新 Canvas 上绘制非透明内容
                            newCtx.putImageData(imageData, 0, 0);

                            // 将新 Canvas 的背景颜色设置为透明
                            newCanvas.style.backgroundColor = "transparent";

                            // 将新 Canvas 转换为图片
                            let url = newCanvas.toDataURL('image/jpeg', 1);
                            await getImage2Queue(url, key, flag, value, "div has canvas");
                            continue;
                        }
                    }
                    // 获取 style 属性值
                    let styleAttr = div.getAttribute('style');
                    // 通过正则表达式匹配背景图片地址
                    let backgroundImageURL = styleAttr.match(/background:\s*url\(['"]?([^'"]*)['"]?\)/);

                    // 提取背景图片地址
                    if (backgroundImageURL && backgroundImageURL.length > 1) {
                        /**
                         * div中包含背景图片的情况
                         * @type {string}
                         */
                        try{
                            let imageURL = backgroundImageURL[1];
                            /**
                             * 检查图片是否带水印   捕获请求
                             * https://emw-api.eqxiu.com/copyright/list-style
                             * https://p1.eqxiu.com/m/print/findProductByIdsWithOrderCheck
                             * */
                            //水印检查
                            imageURL=checkPicWaterMaskUrl(imageURL)
                            //console.log("水印检查后image：",imageURL)
                            //质量提升
                            imageURL=upgradeImage(imageURL,100);
                            //console.log("div has image src:",imageURL);
                            await getImage2Queue(imageURL,key,div,value,"div to image");
                        }catch (e) {
                            console.warn("div背景图片url导出失败！导出图片可能会有缺失！",e)
                        }

                    } else {
                        //console.warn('未找到div内嵌图片地址。');
                        /**
                         * 纯div，div中包含文字
                         */
                        try {
                            let mySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            let divRect=window.getComputedStyle(div);
                            let divData=new XMLSerializer().serializeToString(value.dom);
                            if(divData.includes('rotate')){
                                /* 父节点中包含旋转样式的处理*/
                                let rect=window.getComputedStyle(value.dom);
                                let matrix=rect.getPropertyValue('transform');
                                let angle=0;
                                if(matrix!==''){
                                    let values = matrix.split('(')[1].split(')')[0].split(',');
                                    let a = parseFloat(values[0]);
                                    let b = parseFloat(values[1]);
                                    angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                                    mySvg.setAttribute('transform',`rotate(${angle})`);
                                    //svgData=new XMLSerializer().serializeToString(svg);
                                }else {
                                    console.warn('图片没有旋转！但进入了旋转适应函数！')
                                    return
                                }

                            }
                            div.setAttribute("xmlns",'http://www.w3.org/1999/xhtml');
                            mySvg.setAttribute('width', divRect.width+'');
                            mySvg.setAttribute('height', divRect.height+'');
                            // 创建一个 foreignObject 元素，用于包装原始 div 元素
                            let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
                            foreignObject.setAttribute('width', '100%');
                            foreignObject.setAttribute('height', '100%');
                            foreignObject.appendChild(div.cloneNode(true));
                            //包含特殊字体处理
                            if(divRect.fontFamily && divRect.fontFamily!=="SourceHanSansCN_Normal"){
                                mySvg=fontStyleInnerSvg(mySvg,divRect.fontFamily);
                            }
                            mySvg.appendChild(foreignObject);
                            let mySvgData = new XMLSerializer().serializeToString(mySvg);
                            // let image=new Image();
                            // image.src="data:image/svg+xml,"+mySvgData;

                            // 将SVG绘制到Canvas上
                            //let myBlob = await new Blob([mySvgData], {type: 'image/svg+xml;charset=utf-8;base64,'});
                            //console.log("div to svg src:","data:image/svg+xml,"+mySvgData);

                            //这里采用数据uri，绕过浏览器检查，使用blob会导致画布被污染。
                            await getImage2Queue("data:image/svg+xml,"+mySvgData,key,div,value,"div to svg")
                        }catch (e) {
                            console.warn("div文字转为svg失败！导出图片可能会有缺失！")
                        }
                    }


                }
            }


        console.log("queue is :",drawQueue);
        //开始执行队列操作
        drawLoop();

    }
    /**
     * @param svgNode svg节点
     * @param font 字体
     * @returns String 序列化svg标签字符串
     * */
    let fontStyleInnerSvg=(svgNode,font)=>{
        /**
         * 尝试将字体嵌入svg标签中
         * */
        try {
            // 创建 <defs> 元素
            let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            let style = document.createElementNS("http://www.w3.org/2000/svg", "style");
            style.innerHTML = `
                                @font-face {
                                  font-family: ${font};
                                  src: url(${fontMap.get(font)});
                                  }
                            `;
            /*src: url('${fontMap.get(font)}');
            * src: url(https://asset.eqh5.com/store/0e46c94fe4785f70847594775d3e8cc3.woff format('woff'));
            * */
            defs.appendChild(style);
            // svg.appendChild(defs);
            svgNode.insertBefore(defs, svgNode.childNodes[0]);
            return svgNode;
        }catch (e) {
            console.warn("字体内嵌时错误",e)
        }
    }
    /**
     *
     * @param src 图片src
     * @returns String 重塑的无水印URL或原始URL
     */
    let checkPicWaterMaskUrl=(src)=>{
        let fullPath=src;
        src=fullPath.split('.com/')[1];
        let endPath='';
        if(src.split('?')[1]){
            endPath=src.split('?')[1];
            src=src.split('?')[0];
        }
        //console.log("fullPath,src,endPath",fullPath,src,endPath);
        let temp=src;
        if(templatePicListData.length>0){
            for (const value of templatePicListData) {
                //console.log("picList src:",src)
                //console.log("picList watermarkPath:",value.productTypeMap.watermarkPath)
                if(value.productTypeMap.watermarkPath && src===value.productTypeMap.watermarkPath){
                    src=value.productTypeMap.path!==src?value.productTypeMap.path:(src);
                    if(src===temp){
                        console.warn("图片未去水印！导出图片可能有问题！");
                    }else {
                        console.log("内嵌图已去水印！src:",src);
                    }

                }
            }
        }
        //console.log("检查后src：",realUrl)
        return fullPath.split('.com/')[0] + '.com/' + src + (endPath === '' ? '' : '?' + endPath);
    }


    /**
     *
     * @param url 图片src
     * @param key 顺序标识
     * @param self 自身节点
     * @param parent 父节点，用于获取宽高及起始坐标
     * @param source 来源 div svg img 标签
     * @returns {Promise<void>} 需同步等待操作完成
     */
    let getImage2Queue=async (url,key,self,parent,source,)=> {

        try {
            //console.log("self:",self)
            let imgChild = new Image();
            imgChild.setAttribute("crossOrigin", 'Anonymous');
            imgChild.msg = `子图片[${key}](源：${source})`;
            url=source !== "svg" ? url : upgradeImage(url, 100);
            /*try {
                //图片旋转检查
                if(new XMLSerializer().serializeToString(parent).includes("rotate")){
                    imgChild.src=await getRotatedImage(parent, url);
                }else {
                    imgChild.src = url;
                    console.log('图片不旋转');
                }
            }catch (e) {

            }*/
            imgChild.src = url;
            // 使用 Promise 包装图片加载过程
            await new Promise((resolve, reject) => {
                imgChild.onload = () => resolve();
                imgChild.onerror = reject;
            });
            //console.log(imgChild)
            //画的起始位置，(left,top) * scale
            //通过父元素div获取

            let rect = window.getComputedStyle(parent.dom);
            let rectSelf=window.getComputedStyle(self);
            let left = parseFloat(rect.left) * scale ;
            let top = parseFloat(rect.top) * scale ;
            //console.log("onload:", left, top)
            //  svg的宽高，(width,height) * scale
            //  实际宽高考虑内边距   padding 本元素内边距
            //  ((width,height) - 2*padding) * scale
            let svgWidth = (parseFloat(rect.width) - 2*parseFloat(rectSelf.padding)) * scale;
            let svgHeight = (parseFloat(rect.height) - 2*parseFloat(rectSelf.padding)) * scale;
            console.log(`子svg：层级：${parent.zIndex},开始位置xy和图片宽高（${left}，${top}，${svgWidth}，${svgHeight}）`)
            console.log(imgChild.msg, ",入队！")
            addToDrawQueue(() => {
                imageLoad(imgChild, canvas, ctx, left, top, svgWidth, svgHeight).then();
            })

        } catch (e) {
            console.warn("图片宽高设置失败！导出图片可能不正确！",e)
        }
    }

    /**
     * @param nodeParent 父节点
     * @param imageSrc 图片索引
     * @returns image 图片对象
     * */
    let getRotatedImage=async  (nodeParent,imageSrc)=>{
        //使用缓存canvas生成图片后在旋转
        let cacheCanvas=document.createElement("canvas");

        let cacheCtx=cacheCanvas.getContext("2d");
        let image = new Image();
        let rect=window.getComputedStyle(nodeParent);
        cacheCanvas.width=parseFloat(rect.width);
        cacheCanvas.height=parseFloat(rect.height);
        let matrix=rect.getPropertyValue('transform');
        let angle=0;
        if(matrix!==''){
            let values = matrix.split('(')[1].split(')')[0].split(',');
            let a = parseFloat(values[0]);
            let b = parseFloat(values[1]);
            angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        }else {
            console.warn('图片没有旋转！但进入了旋转适应函数！')
            return
        }
        if(angle!==0){
            //构造图片，并画到临时canvas上
            image.onload=()=>{
                cacheCtx.drawImage(image,0,0,cacheCanvas.width,cacheCanvas.height);
                //旋转角度
                if(angle!==0){
                    cacheCtx.rotate(angle)
                }else {
                    console.warn('未检测到旋转角度！')
                }
                console.log('旋转后的图片：',cacheCanvas.toDataURL('image/jpeg',1));
                return cacheCanvas.toDataURL('image/jpeg',1);
            }

            image.src=imageSrc;
        }

    }
    async function requestFontDate(url) {
        return await new Promise((resolve) => {
            GM_xmlhttpRequest({
                'url': url,
                method: 'GET',
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "priority": "u=0",
                    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "font",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "referrer": "https://www.eqxiu.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "mode": "cors",
                    "credentials": "omit",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
                },
                responseType: 'blob',
                onload: async function (res) {
                    if (res.status===200){
                        console.log(`${url}请求成功！`,res)
                        var byteString = res.response;
                        var arrayBuffer = new Uint8Array(byteString.length);
                        for (var i = 0; i < byteString.length; i++) {
                            arrayBuffer[i] = byteString.charCodeAt(i);
                        }
                       /*if(Base64){
                       }else{
                           console.warn("base64 not load")
                       }*/
                        var blob = new Blob([byteString], { type: 'application/font-woff;charset=utf-8' });
                        var file = new File([blob], 'font.woff', { type: 'application/font-woff;charset=utf-8' });
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            var base64String = event.target.result;
                            //console.log(base64String); // 输出 Base64 编码的字符串
                            resolve(base64String)
                        };
                        reader.readAsDataURL(file);
                    }else{
                        console.log("请求失败！")
                    }
                },
                onerror: function (err) {
                    console.warn('请求错误！' +err.message)
                }
            });
        })
    }


/*let requestFontDate=async (url)=>{
        try{

            let response=await fetch(url, {
                "headers": {
                    "accept": "*!/!*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "priority": "u=0",
                    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "font",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": "https://www.eqxiu.com/",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit"
            })
            if (response.status===200){
                let blob=await response.blob()
                let reader =await new FileReader()
                return new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        reject(reader.error);
                    };
                    reader.readAsDataURL(blob);
                });
            }else{
                console.log("请求失败！")
            }
        }catch (e) {
            console.warn("请求失败！",e)
        }
    }*/
    /**********************************************************************************/
        /*
        html2canvas(document.getElementsByClassName('eqc-editor')[0]).then(canvas => {
            // 创建一个图片元素
            var img = canvas.toDataURL("image/png");

            // 可以选择将图片添加到页面中
            //var image = document.createElement('img');
            //image.src = img;
            //document.body.appendChild(image);

            // 也可以选择下载图片
            var downloadLink = document.createElement('a');
            downloadLink.href = img;
            downloadLink.download = 'html-snapshot.png';
            downloadLink.click();
        });
         }*/
        /**********************************************************************************/
        /**********************************************************************************/
        /* */
        /**********************************************************************************/
        /* div  to  svg*/
        /**********************************************************************************/
        /* convertToSVG()
         function convertToSVG() {
             const div = document.querySelectorAll('.h2-core-check-ele')[0];
             const svg = convertToSVGElement(div);
             svg.id='mysvg';
             document.body.appendChild(svg);
             svgToImage('mysvg');
         }

         function convertToSVGElement(htmlElement) {
             const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
             const html = new XMLSerializer().serializeToString(htmlElement.cloneNode(true));
             svg.innerHTML = `<foreignObject width="100%" height="100%">${html}</foreignObject>`;
             return svg;
         }*/
        /**********************************************************************************/




    // Your code here...
})();