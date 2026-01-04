// ==UserScript==
// @name         十个十电商详情页抓取脚本
// @description  淘宝天猫详情页抓取
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  try to take over the world!
// @author       You
// @match        https://detail.tmall.com/*
// @match        https://detail.tmall.hk/*
// @match        https://item.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/453818/%E5%8D%81%E4%B8%AA%E5%8D%81%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E6%8A%93%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453818/%E5%8D%81%E4%B8%AA%E5%8D%81%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E6%8A%93%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log($)
    function copy(value){

        var inp =document.createElement('input'); // create input标签

        document.body.appendChild(inp) // 添加到body中

        inp.value =value

        inp.select(); // 选中

        document.execCommand('copy',false); // copy已经选中的内容

        inp.remove(); // 删除掉这个dom

    }
    let iconSvg = `<svg t="1665542548643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1837" width="40" height="40"><path d="M869.262222 188.871111v646.257778H154.737778V188.871111h714.524444M921.6 136.533333H102.4v750.933334h819.2V136.533333z" fill="#F5CF5C" p-id="1838"></path><path d="M119.466667 308.679111h785.066666v52.337778h-785.066666zM204.8 222.663111h52.337778v52.337778H204.8zM290.133333 222.663111h52.337778v52.337778h-52.337778zM375.466667 222.663111h52.337777v52.337778H375.466667zM526.791111 756.622222h-29.582222L489.244444 638.862222V438.044444h45.511112v200.817778l-7.964445 117.76z" fill="#F5CF5C" p-id="1839"></path><path d="M438.044444 506.993778h147.911112v91.022222h-147.911112z" fill="#F5CF5C" p-id="1840"></path><path d="M566.727111 756.622222h31.061333l34.247112-155.079111-59.392-35.726222-41.642667 31.744 55.864889 27.534222-20.138667 131.527111zM457.272889 756.622222l-20.138667-131.527111 55.864889-27.534222-41.642667-31.744-59.392 35.726222 34.247112 155.079111h31.061333z" fill="#F5CF5C" p-id="1841"></path></svg>`
    setTimeout(()=>{
        $('body').append(`<a href="#" id='get_desc_button' title="复制宝贝详情页代码" style='position:fixed;right:60px;top:40px;width:40px;height:40px;cursor:pointer'>${iconSvg}</a>`)
        $(document).on('click','#get_desc_button',()=>{
            let dom = null

            let doms = ["#description",".desc-root .descV8-container",".rich_media_content"]
            for(let i=0;i<doms.length;i++){
                if($(doms[i]).length>0){
                    dom = doms[i]
                    break;
                }
            }
            if(!dom){
                alert("未找到详情页")
                return
            }
            let imagesHtml = ''
            Array.from($(dom).find("img")).forEach((img)=>{
                imagesHtml+=`<img src="${img.src.replace("img.alicdn.com/imgextra","oss.pnxlw.com/pnxlw/imgalicdn/imgextra")}" >`
            })
            let html = $(dom).html()
            html = html.replaceAll(`<img class="desc_anchor lazyload" id="desc-module-1" src="https://assets.alicdn.com/kissy/1.0.0/build/imglazyload/spaceball.gif">`,"")
            html = html.replaceAll(/style="width: .*px; height: .*px;"/g,"")
            html = html.replaceAll(`style="max-width: 750.0px;"`,`style="max-width: 100%;"`)
            html = html.replaceAll("img.alicdn.com/imgextra","oss.pnxlw.com/pnxlw/imgalicdn/imgextra")
            copy(imagesHtml)
            alert("复制成功")
        })
        
    },100)

})();