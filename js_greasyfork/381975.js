// ==UserScript==
// @name           微信公众号文章图片格式转换与下载(WeChat Official Account Articles Automatically Download Tools)
// @author         Lepturus
// @description    微信公众号文章图片格式转换与下载, ON/OFF按钮可选择是否浏览时自动下载图片, 并额外支持豆瓣B站站点webp/avif转jpg。
// @include        *://mp.weixin.qq.com/*
// @include        *://mmbiz.qpic.cn/*
// @include        *://doubanio.com/*
// @include        *://*.douban.com/*
// @include        *://*.bilibili.com/read*
// @grant          GM_addStyle
// @version     1.3
// @namespace https://greasyfork.org/users/213516
// @downloadURL https://update.greasyfork.org/scripts/381975/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%9B%BE%E7%89%87%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E4%B8%8E%E4%B8%8B%E8%BD%BD%28WeChat%20Official%20Account%20Articles%20Automatically%20Download%20Tools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381975/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%9B%BE%E7%89%87%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E4%B8%8E%E4%B8%8B%E8%BD%BD%28WeChat%20Official%20Account%20Articles%20Automatically%20Download%20Tools%29.meta.js
// ==/UserScript==
GM_addStyle(".switch{position:relative;width:45px;height:17px;margin-bottom:-2px;display:inline-block} .switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ca2222;transition:.4s}.slider:before{position:absolute;content:'';height:13px;width:13px;left:2px;bottom:2px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#2ab934}input:checked+.slider:before{transform:translateX(28px)}.on{display:none}.off,.on{color:#fff;position:absolute;transform:translate(-50%,-50%);top:50%;left:50%;font-size:8px}input:checked+.slider .on{display:block} input:checked+.slider .off{display:none}.slider.round{border-radius:17px}.slider.round:before{border-radius:50%}")

var imgs = document.getElementsByTagName("img")

// 微信公众号文章批量下载按钮
if(document.getElementById('meta_content')){
    var dswitch = document.createElement ('label');
    dswitch.innerHTML = "<input id='d_switch' type='checkbox'><div class='slider round'><span class='on'>ON</span><span class='off'>OFF</span></div>";
    dswitch.setAttribute('class', 'switch');
    document.getElementById('meta_content').appendChild(dswitch);}

function downloadImg(url, name) {
    fetch(url).then(res => res.blob()).then((blob) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}


function convert(){
    for (var i=0;i<imgs.length;i++)
    {
        // 转换是否为微信懒加载图片, jpeg&wxfrom=5&wx_lazy=1&wx_co=1
        if(imgs[i].src.includes('&wx_lazy')){
            // 图片转换为JPG
            imgs[i].src = imgs[i].src.replace(/&tp=webp&/g,"&tp=jpg&")
            if (document.getElementById("d_switch").checked){
                // 判断图片是否已下载
                imgs[i].src = imgs[i].src.replace(/&tp=jpg&.*/g,"")
                // s?__biz=MjM5MTEzODczMQ==&mid 为微信旧版URL
                let filename = document.URL.replace(/.*\/s\//,"").replace(/\?poc_token.*/,"").replace(/\?poc_token.*/,"").replace(/==&mid.*/,"").replace(/.*\?__biz=/,"")
                if(imgs[i].src.match(/wx_fmt=(.*)&wxfrom/)){
                downloadImg(imgs[i].src,  filename + "_" + i.toString().padStart(2, '0')  +"." + imgs[i].src.match(/wx_fmt=(.*)&wxfrom/)[1])}
                else{
                downloadImg(imgs[i].src, filename + "_" + i.toString().padStart(2, '0')  +".jpg")
                }
                imgs[i].src = imgs[i].src.replace(/&wx_lazy/,"&wx_downloaded")
            }
            console.log(i,imgs[i].src)}
        if(imgs[i].src.includes('doubanio')&&imgs[i].src.includes('webp')){ // douban
            imgs[i].src = imgs[i].src.replace(/\.webp/g,".jpg")
        }
        if(imgs[i].src.includes('hdslb')){ // Bilibili
            //document.getElementsByTagName("img").forEach((ele) => { ele.src = ele.src.replace(/@.*\.avif/g,"")}); //replace avif extension
            imgs[i].src = imgs[i].src.replace(/\.webp/g,".jpg").replace(/@.*\.avif/g,"")
        }
    }
}
// 懒得用onload
setInterval(convert,1000);