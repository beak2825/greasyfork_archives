// ==UserScript==
// @name         [利用不可]ニコニコ動画(Re:仮) 履歴機能
// @namespace    http://tampermonkey.net/
// @version      2024-07-11
// @description  履歴機能の追加
// @author       ぐらんぴ
// @match        https://www.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498450/%5B%E5%88%A9%E7%94%A8%E4%B8%8D%E5%8F%AF%5D%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E5%B1%A5%E6%AD%B4%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498450/%5B%E5%88%A9%E7%94%A8%E4%B8%8D%E5%8F%AF%5D%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E5%B1%A5%E6%AD%B4%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

(()=>{
    window.onload = function(){
        let history = JSON.parse(localStorage.getItem('history')) || []
        if(location.href == 'https://www.nicovideo.jp/'){
            // history
            let buttons = document.querySelectorAll("button")
            for(let button of buttons){
                if(button.innerText == '動画一覧の再読み込み'){
                    let div = document.createElement("div")
                    div.innerHTML = `履歴`
                        button.parentNode.appendChild(div)
                    div.classList.add("history");
                }
            }
            z()
        }else{ //sm
            setTimeout(()=>{
                // history
                let buttons = document.querySelectorAll("button")
                for(let button of buttons){
                    if(button.innerText == '動画一覧の再読み込み'){
                        let div = document.createElement("div")
                        div.innerHTML = `履歴`
                        button.parentNode.parentNode.appendChild(div)
                        div.classList.add("history");
                    }
                }
                //remove
                document.querySelector(".p_56px_0_24px").remove()
                z()
                // historyVid details
                let sm = location.pathname.substr(location.pathname.indexOf('sm') + 2),
                    href = location.href
                let value = {
                    href : location.href,
                    img: `https://nicovideo.cdn.nimg.jp/thumbnails/${sm}/${sm}`,
                    duration: document.querySelector("span").parentNode.childNodes[2].textContent,
                    title: document.querySelector("div:nth-child(3) > h2").textContent,
                    detail: document.querySelector(".min-h_var\\(--player-width\\) > p").textContent,
                    date: document.querySelector(".fs_12px.text_\\#666 > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)").textContent
                }
                // push to the storage
                let index = -1,
                    filteredObj = history.find((item, i)=>{
                        if(item.href === location.href){
                            index = i;
                            return i;
                        }
                    });
                if(history.length < 10 && index == -1){
                    history.push(value)
                }else if(history.length ==10 && index == -1){
                    console.log('11')
                    history.splice(history[0], 1)
                    history.push(value)
                }
                localStorage.setItem('history', JSON.stringify(history))
            },2000)
        }
    }
    function z(){
        let parent = document.querySelector(".history"),
            div = document.createElement("div")
        div.innerHTML = `<ul class="d_flex flex-wrap_wrap justify_center gap_16px">`
        parent.appendChild(div)

        let historyVids = JSON.parse(localStorage.getItem("history"))
        if(historyVids == null){;}else{
        for(let historyVid of historyVids){
            let div2 = document.createElement("li")
            div2.innerHTML = `<li><a href="${historyVid.href}" class="text_inherit text-decor_none [&amp;:hover]:text-decor_underline
            [&amp;:visited]:text_#888"><div class="MinToNoSmall:w_calc(100dvw_-_16px_*_2) Small:w_224px MinToNoSmall:max-w_360px
            Small:max-w_auto MinToNoSmall:min-h_auto Small:min-h_{sizes.VideoCard.height} pos_relative d_flex flex_column gap_8px overflow_hidden
            rounded_8px shadow_1px_2px_3px_rgba(0,_0,_0,_0.25)"><div class="pos_relative w_100% aspect_16_/_9 bg_#000"
            style="background-image: url(${historyVid.img}); background-size: contain; background-position: center center;
            background-repeat: no-repeat;"><span class="font_alnum rounded_4px pos_absolute
            right_8px bottom_8px bg_rgba(38,_38,_38,_0.8) border_1px_solid_#333 text_#fff fs_11px p_1px_5px">${historyVid.duration}</span></div><div class="d_flex
            flex_column gap_4px p_0_8px_8px"><h2 class="fs_13px m_0 max-h_calc(2_*_1.5em) leading_1.5em clamp_2 overflow_hidden">
            ${historyVid.title}</h2><p class="fs_11px text_#666 max-h_calc(3_*_1.5em) leading_1.5em clamp_3
            overflow_hidden">${historyVid.detail}：　doriko(myli</p><p class="fs_11px text_#666 h_calc(1_*_1.5em)
            leading_1.5em clamp_1 overflow_hidden"> </p></div><p class="pos_absolute right_8px bottom_8px fs_11px text_#666 max-h_calc(1_*_1.5em)
            leading_1.5em">${historyVid.date}</p></div></a></li>`
            document.querySelector(".history > div > ul").appendChild(div2)
        }
        }
    }
    function addStyle(){
        let css = ``,
            style = document.createElement('style')
        style.innerHTML = css;
        document.head.append(style)
    }addStyle()
})();