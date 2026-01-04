// ==UserScript==
// @name         Bing美化
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Bing首页和搜索优化
// @author       wz
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @match        *://*.bing.com/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue

// @run-at       document-start
// @license MIT
// @connect     geekzwzs.cn
// @icon    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADQmBKKAAAAgVBMVEUAAAAAg3QAg3MAg3UAhHMAg3MAh3cAg3MAg3MAg3MAg3MAg3MAg3MAg3MAg3MAhHMAg3EAgnMAhXQAhHYAg3MAhHMAg3MAg3MAg3QAg3MAg3QAg3MAg3MAgnMAg3MAg3MAg3MAg3IAg3MAgnMAg3MAhHIAg3MAhHMAg3QAg3MAg3OfVFe2AAAAKnRSTlMAIfBMsvUG+6Xnct/LQdEaDS8TCu69qo4nlmJXOtjVxJ1pXTWHgHlTuEivE7PpAAACwElEQVR42u3cWW7jMBBF0SfbouZ59jw74f4X2I4DtDrpJGV+kCogvCs4H5RYogDCZvuFVSfwyplFYSHAJ2cmpQyWYNMd9JYbh+DRA/Rualclpu8OGnOHUw4T0aDR5JcwEA0a87ZdDxPRoLFdaMZEg8bS1woGokFjc4DOgqgsiMqCqCyIyoKoLIjKgqgsiMqCqCyIyoKoLIjKgqgsiMqCqCyIyoLuHUFkGrSYNYccRCZByeP4mjjmNwlCKh/5fQ4iQ6CDfM+r/R5ERkCZHIu7AkT6QfDlv8UHwqQf5HjyY9tbjjHzIBHIz9XxCmOmQQjlFwX+rQKmAaGWXzbr1tU0IF9+2zmfApTI73M358w4CKn8Ka8JHcOgo6RqkswkyJF03m5tDoRWPlO0SMyAxrc1bTonwgRIbOTTBVdHaAchlAp5QagdJAKplNuEuVYQ9lK1hV5Qwg2EmBvoyA2UcQOh5QYqPWYgpNxAvV/zAgHV4PECAVno8gIBebjhBbq33DIDAaeIGQhiveAFunfyXV4gIEt5gYTvsQJdA1ZraJ6yWtRlw+qxF3uX1YvxELHaOpKU1eZaLViNH6KrWc1Dxy2ribHY8ZqpW17fZZeA1bf9LZXKNWttoP5FnROtAE0gsffUPRcBXaAwUuf4PaAJ9Bqrc+I5oAmUteqcYAloAonBVfd0OXSBlpE6py0AXaBAnZPeAG0g9WYhwAk0lOAEWpwARqDNCmAE8i4AJ9A+AydQkwCMQNES4ATqAE4gvwcn0GPI4AMKDniLDWio8IgJaFFAV1msztmuoLNLrcapr9Bc2SntEyX0V/jPcl7WMFOye2rIOMJcK3IpuWcYLV+6P3raDKZzOu9bzi7BFDmNSwwZxiui/znegAmr5rPPi8fBtFXX4OOQMX3l3z+FAZdbgPL44Rn43N0kklS+FGDVGjabjeoP6mzXo0ZEh6sAAAAASUVORK5CYII=

// @downloadURL https://update.greasyfork.org/scripts/450446/Bing%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450446/Bing%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    if(location.href.indexOf('bing.com/search?q=') > 0 ){
        addSearchStyle();
    }else{
        addIndexStyle();
        bing_index();
    }

})();
window.onload=function(){
    console.log('加载完成')
    if(location.href.indexOf('bing.com/search?q=') > 0 ){
        $('#b_content').fadeIn(200)
        bing_ad()
        bing_search();
    }
}

//Bing首页美化
function bing_index(){
    const logoSvg = '<svg id="logoo" style="width:55%" class="logo" viewBox="0 0 154 28" aria-label="Bing"><svg class="squares"><path class="top_l"fill="#f26522" d="M11.35 0H0v11.35h11.35z"></path><path class="top_r" fill="#8dc63f" d="M23.88 0H12.53v11.35h11.35z"></path><path class="bom_l" fill="#00aeef" d="M11.35 12.53H0v11.35h11.35z"></path><path class="bom_r" fill="#ffc20e" d="M23.88 12.53H12.53v11.35h11.35z"></path></svg><path class="ms_text" fill="#666" d="M46.55 4.77V19.1h-2.48V7.87h-.05L39.59 19.1h-1.65L33.37 7.87h-.03V19.1h-2.3V4.77h3.57l4.11 10.62h.06l4.35-10.62zm2.08 1.1c0-.4.15-.74.44-1.01.29-.27.63-.4 1.03-.4a1.44 1.44 0 011.48 1.4c0 .4-.14.73-.43 1-.28.26-.64.4-1.05.4s-.76-.14-1.04-.41c-.29-.27-.43-.6-.43-.99zm2.67 2.96V19.1h-2.42V8.83zm7.34 8.51c.35 0 .75-.08 1.18-.24.44-.17.84-.39 1.2-.66v2.24c-.38.22-.82.4-1.3.5a7.2 7.2 0 01-1.62.17 4.97 4.97 0 01-3.7-1.43A4.99 4.99 0 0153 14.26c0-1.65.48-3.01 1.45-4.08.96-1.07 2.33-1.6 4.1-1.6a5.62 5.62 0 012.48.58v2.31a5 5 0 00-1.14-.63 3.32 3.32 0 00-1.2-.23c-.95 0-1.72.31-2.3.93s-.89 1.46-.89 2.51c0 1.04.29 1.85.85 2.43.56.58 1.33.86 2.3.86zm9.27-8.68a2.54 2.54 0 01.91.14v2.45a2.56 2.56 0 00-1.44-.4c-.6 0-1.1.26-1.5.76s-.62 1.27-.62 2.3v5.2h-2.42V8.82h2.42v1.62h.04c.22-.56.56-1 1-1.31.45-.32.98-.48 1.6-.48zm1.04 5.46c0-1.7.48-3.05 1.44-4.04s2.3-1.49 4-1.49c1.6 0 2.85.48 3.76 1.43s1.35 2.25 1.35 3.88c0 1.66-.48 2.99-1.44 3.97a5.22 5.22 0 01-3.92 1.48c-1.59 0-2.85-.47-3.79-1.4a5.17 5.17 0 01-1.4-3.83zm2.52-.08c0 1.07.24 1.89.73 2.46s1.18.84 2.09.84c.87 0 1.54-.28 2-.84s.7-1.41.7-2.52c0-1.1-.24-1.94-.72-2.5a2.48 2.48 0 00-2-.85c-.89 0-1.57.3-2.06.88-.5.6-.74 1.44-.74 2.53zm11.63-2.51c0 .35.1.62.33.82.22.2.7.44 1.46.74.96.39 1.64.82 2.03 1.3.39.49.58 1.07.58 1.76 0 .96-.37 1.74-1.11 2.33s-1.75.88-3.01.88a7.25 7.25 0 01-2.73-.56v-2.37c.44.3.91.55 1.42.73.5.18.97.27 1.38.27.55 0 .95-.08 1.21-.23.26-.16.39-.41.39-.77 0-.34-.14-.62-.4-.85-.28-.23-.79-.5-1.54-.8-.89-.37-1.52-.79-1.9-1.26s-.56-1.05-.56-1.77c0-.93.37-1.7 1.1-2.29.75-.6 1.7-.9 2.87-.9a7.06 7.06 0 012.33.44v2.3c-.32-.22-.7-.4-1.12-.56a3.74 3.74 0 00-1.27-.23c-.46 0-.82.1-1.07.27a.86.86 0 00-.4.75zm5.44 2.59c0-1.7.48-3.05 1.44-4.04a5.3 5.3 0 014-1.49c1.6 0 2.86.48 3.76 1.43s1.35 2.25 1.35 3.88c0 1.66-.48 2.99-1.44 3.97a5.22 5.22 0 01-3.91 1.48c-1.6 0-2.86-.47-3.8-1.4a5.17 5.17 0 01-1.4-3.83zm2.52-.08c0 1.07.24 1.89.73 2.46s1.18.84 2.1.84c.87 0 1.54-.28 2-.84s.7-1.41.7-2.52c0-1.1-.25-1.94-.72-2.5a2.48 2.48 0 00-2-.85c-.89 0-1.58.3-2.07.88a3.8 3.8 0 00-.74 2.53zm16.06-3.23h-3.6v8.3h-2.45v-8.3h-1.72V8.83h1.72V7.4a3.56 3.56 0 013.75-3.69c.3 0 .56.02.78.05.23.03.43.08.6.14v2.09a2.42 2.42 0 00-1.1-.27c-.51 0-.9.16-1.18.47-.27.32-.4.78-.4 1.4v1.25h3.6V6.53l2.42-.74v3.05H112v1.97h-2.45v4.8c0 .64.12 1.09.35 1.35.23.26.59.39 1.08.39a2.35 2.35 0 001.02-.34v2c-.15.09-.4.17-.76.24s-.7.1-1.06.1c-1.01 0-1.78-.26-2.29-.8-.5-.55-.76-1.36-.76-2.46v-5.28z"></path><path class="b_text" fill="#666" d="M117.5 19.24V5.07h4.5c1.37 0 2.46.3 3.26.9.8.6 1.2 1.38 1.2 2.34 0 .8-.23 1.5-.68 2.1a3.68 3.68 0 01-1.89 1.26v.04c.98.11 1.75.47 2.33 1.09.59.6.88 1.4.88 2.37 0 1.21-.48 2.2-1.43 2.94s-2.16 1.13-3.62 1.13zm2.35-12.28v4.03h1.52c.82 0 1.46-.2 1.92-.57.47-.4.7-.94.7-1.64 0-1.22-.81-1.82-2.43-1.82zm0 5.92v4.48h2c.88 0 1.56-.2 2.03-.6.48-.41.72-.97.72-1.68 0-1.47-1.01-2.2-3.05-2.2zM129.97 7c-.37 0-.7-.13-.96-.37-.27-.24-.4-.55-.4-.93s.13-.69.4-.94.59-.37.97-.37.71.12.98.37.4.57.4.94c0 .36-.13.66-.4.92-.27.25-.6.38-.99.38zm1.14 12.24h-2.29V9.12h2.3zM142.46 19.24h-2.29v-5.7c0-1.9-.67-2.84-2-2.84-.7 0-1.28.27-1.74.8a2.9 2.9 0 00-.68 1.97v5.77h-2.3V9.12h2.3v1.68h.04a3.6 3.6 0 013.28-1.92c1.1 0 1.94.36 2.52 1.08.58.71.87 1.74.87 3.1zM153.81 18.43c0 3.71-1.86 5.57-5.6 5.57a8.35 8.35 0 01-3.45-.66v-2.1c1.1.64 2.16.95 3.15.95 2.4 0 3.61-1.18 3.61-3.55v-1.1h-.04a3.71 3.71 0 01-3.42 1.93 3.72 3.72 0 01-2.98-1.34 5.49 5.49 0 01-1.13-3.63c0-1.72.4-3.08 1.22-4.1s1.92-1.52 3.34-1.52c1.33 0 2.32.55 2.97 1.64h.04v-1.4h2.3zm-2.27-3.82v-1.32c0-.71-.24-1.32-.71-1.82a2.3 2.3 0 00-1.76-.76c-.87 0-1.55.33-2.04.97a4.34 4.34 0 00-.74 2.69c0 1 .24 1.79.7 2.39.48.6 1.1.89 1.88.89.8 0 1.44-.29 1.93-.85.5-.58.74-1.3.74-2.2z"></path></svg>'
    let divNode = document.createElement("div")
    divNode.style="height:120px;text-align:center;"
    divNode.innerHTML=logoSvg
    $('.sbox').hide()
    setTimeout(()=>{
        $('.sbox').prepend(divNode)
        $('.sbox').fadeIn(200)
    },300)
}

//Bing搜索页美化
function bing_search(){
    //百度热搜
    getNews()
    // 更换网站图标
    setTimeout(()=>{
        const imgList = document.getElementsByClassName("rms_img")
        for (let i = 0; i < imgList.length; i++) {
            if(imgList[i].alt ==="全球 Web 图标"&&imgList[i].src.indexOf("&w=")){
                imgList[i].src=imgList[i].src.split("&w=")[0]
            }
        }
    },300)

    const sh_favicon = document.querySelector(".sh_favicon")
    if(sh_favicon) sh_favicon.style.setProperty("visibility", "visible", "important");
    //政府tag
    $(".b_title").each(function(i){
        if($(this).context.firstChild.href.indexOf(".gov")>0){
            var a = document.createElement("span")
            a.innerText="政府"
            a.className = "tag tag-gov"
            $(this).context.appendChild(a)
        }
    })

}

function getNews(){
    GM_xmlhttpRequest({
        method: "get",
        url: "https://api.geekzwzs.cn/resou",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },

        onload: function(data){
            const result = JSON.parse(data.response).data[0];
            const title = `<div class="news_type">${result.text}</div>`;
            const list = result.value.slice(0, 15).map((v,i)=>`<div class="news_item"><span class="news_index">${i+1}</span><a class="news_link" href=${v.rawUrl}>${v.wordQuery}</a>${v.hotTag==3?'<span class="tag tag-hot">热</span>':''}</div>`)
            let hotSearch = document.createElement("div");
            hotSearch.innerHTML=title+list.join("");
            hotSearch.className="hot_search";
            $("#b_content main").append(hotSearch);
        },
        onerror: function(response){
            console.log("请求失败");
        }
    });

}

// 添加首页 css样式
function addIndexStyle() {
    let css = `
     .sbox{display:none;top:25%}
     .mic_cont,#est_cn,#est_en{display:none!important}
     .logo_cont{filter:grayscale(1)}
     .img_cont{background-color:aliceblue!important}
     .img_uhd{background-color:aliceblue!important}
     #footer{display:none}
     #est_switch{display:none}
    `
    GM_addStyle(css)
}

// 添加搜索页 css样式
function addSearchStyle() {
    let css = `
       .news_type{font-size: 17px;color: #222;margin-bottom: 15px;font-weight: 600;}
       .hot_search{position: absolute; top: 220px;left: 1150px; width: 300px;}
       .news_index{width: 25px;text-align: center; display: inline-block;color:#9195A3}
       .news_item:nth-child(-n+4) .news_index{color:#FE2D46}
       .news_item{padding:8px 0;font-size: 14px;}
       #b_header{background-color:#fff!important;position:sticky;z-index:99999;top:0;box-shadow: 0px 3px 6px #eee;}
       #b_results{width:850px}
       body{font-size:13px}
       .sh_favicon{visibility:visible!important}
       #est_switch .est_unselected::after{background:none;border:none}
       #est_switch .est_selected::after{background-color:#fff}
       #b_content{display:none}
       .dlCollapsedCnt,#b_algospacing,.b_vidAns,#b_footer,.mic_cont,.b_ad,#LGPopDomainsContainer,#textDeeplinksWidgetContainer,#wikiWidgetContainer,#b_context,.b_nwsAns,#lgImgAnsContainer,.pagereco_anim,.b_mop,.b_bop,.pageRecoContainer,.mic_cont{display:none!important}
       a>strong{color:#2440b3!important}
       p>strong{color:#f73131!important}
       li.b_algo a{color:#2440b3!important}
       cite{color:#70757a!important;font-size: 13px;}
       .tag{color:#fff;background-color:#F60; border-radius: 2px;font-size: 12px;padding: 1px 2px;margin-left: 3px;}
       .tag-gov{background-color:#355cf9;}
    `
    GM_addStyle(css)
}


function bing_ad() {
    $(".b_ad").remove();
    $(".b_algo").each(function() {
        if ($(this).children(":first")[0].nodeName=="H2"){
            $(this).hide();
        }
    })

}
