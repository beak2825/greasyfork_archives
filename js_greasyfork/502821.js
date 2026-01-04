// ==UserScript==
// @name         MissAv m3u8 finder
// @namespace    https://greasyfork.org/zh-CN/scripts/502821-missav-m3u8-finder
// @version      2024-08-08-2
// @description  try fun ~
// @author       Luuuucus
// @match        *://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502821/MissAv%20m3u8%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/502821/MissAv%20m3u8%20finder.meta.js
// ==/UserScript==

(function() {

    async function fetchVideoList(url) {
        console.log('fetch url :' ,url)
        const response = await fetch(url);
        const text = await response.text();
        return text;
    }

    async function fetchVideoPart(url){
        console.log('fetch item url :' ,url)
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
    }

    async function mergeBlobs(mediaUrls) {
        const res = await Promise.all(mediaUrls.map(async (mediaUrl) => {
            return await fetchVideoPart(mediaUrl.url);
        })).then((blobs) => {
            const mergedBlob = new Blob(blobs, { type: 'video/mp4' });
            return mergedBlob;
        });

        return res;
    }

    async function mergeBatch(mediaUrls,target) {
        const blobs = [];
        let total = mediaUrls.length;
        for(var i=0;i<mediaUrls.length;i=i+100){
            var tmp = await Promise.all(mediaUrls.slice(i, i+100).map(async (mediaUrl) => {
                return fetch(mediaUrl.url).then(resp=>{return resp.blob()})
            })).then((b) => {
                const mergedBlob = new Blob(b, { type: 'video/mp4' });
                return mergedBlob;
            });
            //计算百分比
            var current = i+100
            if(i+100>total){
                current = total
            }
            target.parentElement.querySelector('.progress-download').style.width = (current/total)*100+'%'
            blobs.push(tmp)
        }

        return new Blob(blobs, { type: 'video/mp4' });
    }


    function createUrlElement(fileInfo){
        // 创建外层div元素
        const flexDiv = document.createElement('div');
        flexDiv.className = 'flex';
        flexDiv.style.height='30px'

        // 创建a元素并设置样式
        const link = document.createElement('a');
        link.style.color = 'lightgreen';
        link.style.fontWeight = 'bold';
        link.style.border = '2px solid lightgreen';
        link.textContent = fileInfo.display;

        const textDiv = document.createElement('div');
        textDiv.className = 'flex flex-col justify-center';


        // 创建span元素作为text，并设置样式（HTML中没有text标签）
        const text = document.createElement('span');
        text.style.marginLeft = '10px';
        text.style.fontStyle = 'italic';
        text.style.alignSelf = 'baseline'; // 注意：alignSelf是Flexbox属性，应该设置在flex容器上
        text.style.borderBottom = '2px groove lightgrey';
        text.style.color='white'
        text.style.fontSize = '12px'
        text.style.height='100%'
        text.style.alignContent ='end'
        text.textContent = fileInfo.url; // 这里假设是文本内容
        // 创建外部进度条容器div元素
        var progressOuterDiv = document.createElement('div');
        progressOuterDiv.style.height = '15%';
        progressOuterDiv.style.width = '95%';
        progressOuterDiv.style.backgroundColor = 'white';
        progressOuterDiv.style.marginLeft = '10px';

        // 创建内部进度条填充div元素
        var progressDiv = document.createElement('div');
        progressDiv.className='progress-download'
        progressDiv.style.backgroundColor = 'lightgreen';
        progressDiv.style.width = '0%';
        progressDiv.style.height = '100%';

        // 将内部进度条填充div添加到外部进度条容器div
        progressOuterDiv.appendChild(progressDiv);

        textDiv.appendChild(text);
        textDiv.appendChild(progressOuterDiv);

        // 创建button元素并设置样式
        const button = document.createElement('button');
        button.style.marginLeft = '10px';
        button.style.backgroundColor = 'lightgray';
        button.style.color = 'black';
        button.textContent = '复制';

        // 创建button元素并设置样式
        const downloadBtn = document.createElement('button');
        downloadBtn.style.marginLeft = '10px';
        downloadBtn.style.backgroundColor = 'lightgray';
        downloadBtn.style.color = 'black';
        downloadBtn.textContent = '下载';
        downloadBtn.setAttribute('data-ref', fileInfo.url)
        downloadBtn.setAttribute('data-prefix', fileInfo.prefix)
        downloadBtn.setAttribute('file-name','test.mp4')

        downloadBtn.addEventListener('click',async function(event){
            var target = event.target
            target.disabled = true
            target.textContent = '下载中...'
            target.style.backgroundColor = 'lightgreen';

            var url = target.getAttribute('data-ref')
            var urlPrefix = target.getAttribute('data-prefix')

            const text = await fetchVideoList(url);
            const lines = text.split('\n');
            const mediaUrls = [];
            // 遍历每一行，解析媒体URL
            lines.forEach(line => {
                // 忽略空行和注释行
                if (line.trim() &&!line.startsWith('#')) {
                    // 媒体URL通常在EXTINF标签之后
                    let name = line.trim().split('\\.')[0]
                    //提取name中的数字
                    const index = parseInt(name.match(/\d+/)[0]);

                    const fileInfo = {
                        index: index,
                        url: urlPrefix+line.trim()
                    }
                    mediaUrls.push(fileInfo);
                }
            });
            console.log(mediaUrls)
            const blobs =[]
            //多线程遍历mediaUrls，获取每个视频的blob
            const blob  = await mergeBatch(mediaUrls,target);
            //创建blob下载链接
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileInfo.filename;
            a.click();
            setTimeout(()=>{
                target.disabled = false
                target.textContent = '下载'
                target.style.backgroundColor = 'lightgray';
            },1000)
        })

        button.addEventListener('click', function() {
            // 使用navigator.clipboard API复制文本
            navigator.clipboard.writeText(text.textContent).then(() => {
                // 复制成功的操作
                console.log('已复制文本：', text.textContent);
                alert('链接已复制到剪贴板');
            }).catch(err => {
                // 复制失败的操作
                console.error('复制文本时出错：', err);
                alert('复制失败，请稍后重试');
            });
        });


        // 将子元素添加到flexDiv中
        flexDiv.appendChild(link);
        flexDiv.appendChild(textDiv);
        flexDiv.appendChild(button);
        flexDiv.appendChild(downloadBtn);
        return flexDiv
    }

    'use strict';
    console.log("my first monkey script",this)
    window.addEventListener("load", () => {
        var tools = document.querySelector('.order-first .mt-4')
        const flexDiv = document.createElement('div');
        const filename = document.querySelector('.order-first .mt-4 h1').textContent.trim()

        // 添加类名
        flexDiv.className = 'flex justify-center space-x-4 md:space-x-6 py-8 rounded-md shadow-sm';

        // 设置内联样式
        flexDiv.style.flexDirection = 'column';
        flexDiv.style.alignItems='baseline'
        tools.removeChild(tools.children[1])
        tools.appendChild(flexDiv)

        var videoDoc = document.querySelector('.order-first')
        // 判断是否播放视频页面
        if (videoDoc != undefined) {
            var prefix = 'https://surrit.com/'
            var suffix = '/playlist.m3u8'
            //获取播放列表m3u8
            // 使用evaluate执行XPath查询
            var nodeValue = document.evaluate(
                '/html/body/script[5]/text()', // XPath表达式
                document, // 要执行查询的节点
                null, // 解析的文档
                XPathResult.FIRST_ORDERED_NODE_TYPE, // 只获取第一个匹配的节点
                null
            ).singleNodeValue.textContent
            var index = nodeValue.indexOf("seek");

            // 确保 "seek" 存在于字符串中，并且截取的位置不会是负数
            if (index !== -1 && index - 32 >= 0) {
                // 截取 "seek" 前的32个字符
                var first32Chars = nodeValue.substring(index - 38, index-2);
                var url =prefix+first32Chars+suffix
                console.log('the m3u8 url is:' ,url);
                fetch(url).then(resp=>{
                    return resp.text()
                }).then(text => {
    // 将响应文本按行分割
                    const lines = text.split('\n');
                    const mediaUrls = [];

                    // 遍历每一行，解析媒体URL
                    lines.forEach(line => {
                        // 忽略空行和注释行
                        if (line.trim() && !line.startsWith('#')) {
                            // 媒体URL通常在EXTINF标签之后
                            var fileInfo = {
                                filename: filename,
                                prefix: prefix+first32Chars+'/'+line.trim().split('/')[0] + '/',
                                display: line.trim().split('/')[0],
                                url: prefix+first32Chars+'/'+line.trim()
                            }
                            flexDiv.appendChild(createUrlElement(fileInfo))
                        }
                    });

                    // 输出解析出的媒体URL列表
                    console.log(mediaUrls);
                })
            } else {
                console.log("'seek' 不在字符串中，或不足以截取32个字符。");
            }
        }
    });
})();