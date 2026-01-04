// ==UserScript==
// @name         bilibili 首页刷新可选择上一个
// @namespace    https://fybgame.top/
// @version      1.01
// @description  在b站首页刷一刷按钮上添加上一个下一个按钮以此来回到上一个想看的视频
// @author       fyb
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474898/bilibili%20%E9%A6%96%E9%A1%B5%E5%88%B7%E6%96%B0%E5%8F%AF%E9%80%89%E6%8B%A9%E4%B8%8A%E4%B8%80%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/474898/bilibili%20%E9%A6%96%E9%A1%B5%E5%88%B7%E6%96%B0%E5%8F%AF%E9%80%89%E6%8B%A9%E4%B8%8A%E4%B8%80%E4%B8%AA.meta.js
// ==/UserScript==

(function() {

window.onload = function (){
    let videoArray = []
    let videos = document.getElementsByClassName('feed-card');
    let itemArray = []
    for(let i = 0 ; i < videos.length ; i ++){
        itemArray.push(videos[i].cloneNode(true))
    }
    videoArray.push(itemArray)
    let nowIndex = 0
    let toAppendLast = document.createElement("BUTTON");
    let spanTextLast = document.createElement("span");
    spanTextLast.innerHTML = '上一个';
    toAppendLast.addEventListener("click", function () {
        if(nowIndex != 0){
            nowIndex -- ;
            nowCountText.innerHTML = (nowIndex+1)+'/'+videoArray.length
            for(let i = 0 ; i < videos.length ; i ++){
                videos[i].innerHTML = videoArray[nowIndex][i].innerHTML;
            }
        }

    })
    toAppendLast.className = 'primary-btn roll-btn';
    toAppendLast.style.marginBottom = "8px"
    toAppendLast.appendChild(spanTextLast);

    let toAppendNext = document.createElement("BUTTON");
    let spanTextNext = document.createElement("span");
    spanTextNext.innerHTML = '下一个';
    toAppendNext.addEventListener("click", function () {
        if(nowIndex < videoArray.length -1){
            nowIndex ++ ;
            nowCountText.innerHTML = (nowIndex+1)+'/'+videoArray.length
            for(let i = 0 ; i < videos.length ; i ++){
                videos[i].innerHTML = videoArray[nowIndex][i].innerHTML;
            }
        }

    })
    toAppendNext.className = 'primary-btn roll-btn';
    toAppendNext.style.marginBottom = "8px"
    toAppendNext.appendChild(spanTextNext);



    var nowCount = document.createElement("BUTTON");
    var nowCountText = document.createElement("span");
    nowCountText.innerHTML = '1/1';
    nowCount.className = 'primary-btn roll-btn';
    nowCount.style.marginBottom = "8px"
    nowCount.appendChild(nowCountText);


    let c = document.getElementsByClassName('feed-roll-btn')[0];
    c.children[0].removeChild(c.children[0].children[0]);
    c.children[0].children[0].innerHTML = '刷新下';

    c.children[0].addEventListener("click", function () {

            setTimeout(function (){
                let itemArray = []
                for(let i = 0 ; i < videos.length ; i ++){
                    itemArray.push(videos[i].cloneNode(true))
                }
                videoArray.push(itemArray)
                nowIndex = videoArray.length-1;
                nowCountText.innerHTML = (nowIndex+1)+'/'+videoArray.length
            },500)

    })

    c.insertBefore(toAppendNext,c.children[0])
    c.insertBefore(nowCount,c.children[0])
    c.insertBefore(toAppendLast,c.children[0])

}

})();