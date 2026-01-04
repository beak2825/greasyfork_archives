// ==UserScript==
// @name         YouTube multi-view
// @name:en      YouTube multi-view
// @name:ja      YouTube 複窓視聴
// @name:zh-cn      YouTube 多视图
// @namespace    https://www.youtube.com/
// @version      2024-07-20
// @description       multi-view video and streaming
// @description:en    multi-view video and streaming
// @description:ja    生放送や動画を複窓で見れます
// @description:zh-cn 多视图视频和流媒体
// @author       ぐらんぴ
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://greasyfork.org/scripts/433051-trusted-types-helper/code/Trusted-Types%20Helper.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502900/YouTube%20multi-view.user.js
// @updateURL https://update.greasyfork.org/scripts/502900/YouTube%20multi-view.meta.js
// ==/UserScript==

divide = 2

let addBtn = setInterval(()=>{
    if(document.querySelectorAll("#end > div").length !== 2){
        clearInterval(addBtn)
    }else{
        let btns = document.querySelector("#buttons"),
            div = document.createElement('div')
        div.innerHTML = `<button style="color: #ff00dd; position: relative; background: transparent; border: none; outline: none; box-shadow: none; cursor: pointer;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 17H4C2.34315 17 1 15.6569 1 14V6C1 4.34315 2.34315 3 4 3H20C21.6569 3 23 4.34315 23 6V14C23 15.6569 21.6569 17 20 17H13V19H16C16.5523 19 17 19.4477 17 20C17 20.5523 16.5523 21 16 21H8C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19H11V17ZM4 5H20C20.5523 5 21 5.44772 21 6V14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14V6C3 5.44772 3.44772 5 4 5Z"
        fill="currentColor" /></svg></button>`
        btns.before(div)

        let div2 = document.createElement('div')
        div2.innerHTML = `<input type="text" placeholder="URL" style="position: absolute; display: flex; width: 500px; right: 10px; top: 50px;" input>
        <button class="add" style="position: absolute; display: flex; right: 10px; top: 50px;" id='submit'>add</button>
        <button class="switch" style="position: absolute; display: flex; width: 54px; right: 516px; top: 50px;" id='submit'>switch</button>`
        div.appendChild(div2)

        let hideDiv2 = document.querySelector("#end > div:nth-child(2) > div")
        hideDiv2.style.display = 'none'
        document.querySelector("#end > div:nth-child(2) > button").addEventListener('click', ()=>{
            let del = document.querySelectorAll(".del")
            if(hideDiv2.style.display == 'none'){
                hideDiv2.style.display = ''
                del.forEach(elm => {
                    elm.style.display = "";
                })
            }else{
                hideDiv2.style.display = 'none'
                del.forEach(elm => {
                    elm.style.display = "none";
                })
            }
        });
        a()
    }
},1000)
function a(){
    document.querySelector(".add").onclick =()=>{
        if(location.href.match('/watch')){// /watch
            parent = document.querySelector("ytd-watch-flexy") //document.querySelector("ytd-watch-grid")
        }else if(location.href.match('/results')){// /results
            parent = document.querySelector("ytd-search")
        }else{// /home, /subscriptions, /you
            let parents = document.querySelectorAll("ytd-browse")
            for(let i = 0; i < parents.length; i++){
                if(parents[i].getAttribute('role') !== null){
                    parent = parents[i]
                }
            }
        }
        let ytd = document.createElement('div')
        ytd.innerHTML = `
            <div class="area" style="display: none;">
                <div class="content_class" style="display: flex; flex-wrap: wrap;"></div>
            </div>`
        parent.before(ytd)
        if(location.href.match('/watch')){
            Vwidth = (document.querySelector("#masthead").clientWidth-(document.querySelector("yt-icon > span > div > svg").width.animVal.value*3))/2-1 // document.querySelector("#icon > yt-icon-shape > icon-shape > div > svg").width.animVal.value
            console.log(Vwidth)
        }else{
            Vwidth = document.querySelector("#page-manager").clientWidth / divide -1
            console.log(Vwidth)
        }
        Vval = document.querySelector("#end > div:nth-child(2) > div > input[type=text]").value
        if(Vval.match('&')){
            Vsrc = Vval.substring(0, Vval.indexOf("&")).replace("watch?v=", "embed/")
        }else{
            Vsrc = Vval.replace("watch?v=", "embed/")
        }
        let divWatch = document.createElement('div')
        divWatch.innerHTML = `
        <iframe width="${Vwidth}" height="${Math.floor(Vwidth/1.77)}" src="${Vsrc}"
        title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;
        web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <div style="text-align: center;">
        <button class="del" style="position: absolute;" id='submit'>delete</button>
        </div>`
        divWatch.addEventListener('click', (e)=>{
            //console.log(e.target.closest('div').parentNode);
            e.target.closest('div').parentNode.remove()
        });
        document.querySelector(".content_class").appendChild(divWatch)
    }
    document.querySelector(".switch").onclick =()=>{
        if(location.href.match('/watch')){// /watch
            parent = document.querySelector("ytd-watch-flexy")//document.querySelector("ytd-watch-grid")
        }else if(location.href.match('/results')){// /results
            parent = document.querySelector("ytd-search")
        }else{// /home, /subscriptions, /you
            let parents = document.querySelectorAll("ytd-browse")
            for(let i = 0; i < parents.length; i++){
                if(parents[i].getAttribute('role') !== null){
                    parent = parents[i]
                }
            }
        }
        if(parent.style.display == ""){
            parent.style.display = 'none'
            if(document.querySelector(".area") !== null){
                document.querySelector(".area").style.display = ''
            }
        }else{
            parent.style.display = ''
            if(document.querySelector(".area") !== null){
                document.querySelector(".area").style.display = 'none'
            }
        }
    }
}
var oldHref = window.location.href;
var observer = new MutationObserver(()=>{
    if(oldHref != window.location.href){
        oldHref = window.location.href;
        var currHref = window.location.href;
        a()
        if(document.querySelector(".area") !== null && location.href.match('/results')){
            (async () => {
                await new Promise(resolve => setTimeout(resolve, 800)); //Without this code, display = 'none' is unstable.
                document.querySelector("ytd-search").style.display = ''
                document.querySelector(".area").style.display = 'none'
                console.log('async')
            })();
            }else if(document.querySelector(".area") !== null){
                (async () => {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    let parents = document.querySelectorAll("ytd-browse")
                    for(let i = 0; i < parents.length; i++){
                        if(parents[i].getAttribute('role') !== null){
                            if(parents[i].style.display !== 'none' || document.querySelectorAll(".area") !== null){
                                parents[i].style.display = ''
                                document.querySelector(".area").style.display = 'none'
                            }
                        }
                    }
                })();
                }

    }
})
observer.observe(document.body, {childList: true,
                                 subtree: true,
                                });