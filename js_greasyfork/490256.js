// ==UserScript==
// @name         百度搜索广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      3.54
// @released     2024-04-07_23:51:11_100
// @description  屏蔽百度搜索的广告
// @author       You
// @license MIT
// @run-at       document-start
// @match        https://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/490256/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490256/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
//document.body.style.display="none";
var newlist=[];
var newli;
function con(doc) {
    let container = doc?.querySelector('[id="container"]')
    if(container){
        if(!doc.querySelector('.newli')){
             newli = doc.createElement('div')
            newli.className = "newli"
            newli.setAttribute("style", `position: absolute;top: 0;right: -640px;`)
            container.appendChild(newli)
        }

    }

}

处理监测元素(document) ;



启动元素检测();
function 启动元素检测(){
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查每个变化的类型
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                // 循环遍历添加的节点
                mutation.addedNodes.forEach(function (addedNode) {
                    // 检查添加的节点是否为目标元素
                    if (addedNode.classList) {

                        
                        处理监测元素(addedNode);
                    }
                });
            }
        });
    });
    // 开始观察父节点下的变化
    observer.observe(document.body, { childList: true, subtree: true });
}

function 处理监测元素(addedNode){
    //console.log(1,addedNode);

    var ad3=addedNode?.querySelector('a.c-gap-left')
    if(ad3?.textContent==="广告"){
        console.log('移除元素1',ad3.parentElement.parentElement)
        let re=ad3.parentElement.parentElement
        if(!re.outerHTML.includes('newremove')){
        re.classList.add("newremove")

        newlist.push(re)
        re?.remove()
        }
    }
    if(addedNode?.querySelector('[tpl="pc-soft-accurate"]')){
        console.log('移除元素2',addedNode.querySelector('[tpl="pc-soft-accurate"]'))
        
        let re=addedNode.querySelector('[tpl="pc-soft-accurate"]')
        if(!re.outerHTML.includes('newremove')){
            re.classList.add("newremove")

            newlist.push(re)
            re?.remove()
            if(re=addedNode){
                return
            }
        }

    }

    var ad = addedNode?.querySelectorAll('span.c-gap-left')
    if (ad.length) {
        //document.body.style.display="none";
        for (let i = 0; i < ad.length; i++) {
            if (ad[i].textContent === "广告") {
                console.log('移除元素3',ad[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)

                let re=ad[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
                if(!re.outerHTML.includes('newremove')){
                    re.classList.add("newremove")
                    newlist.push(re)
                    re?.remove()
                    if(re=addedNode){
                        return
                    }
                }
            }
            }
        }
        //document.body.style.display="block";
    }
    // var ad2 = addedNode?.querySelectorAll('a.c-gap-left')
    // if(ad2){
    //     //document.body.style.display="none";
    //     for (let i = 0; i < ad2.length; i++) {
    //         if (ad2[i].textContent === "广告") {
    //             console.log('移除元素4',ad2[i].parentElement.parentElement)
    //             let re=ad2[i].parentElement.parentElement
    //             if(!re.querySelector(".newremove")){
    //                 re.classList.add("newremove")
    //                 newli.appendChild(re)
    //                 re?.remove()
    //             }
    //         }
    //     }
    //     //document.body.style.display="block";
    // }


//console.log(document.querySelector('.c-gap-left'))

document.addEventListener('DOMContentLoaded', function () {
    处理监测元素(document);
    con(document)
    for (let i = 0; i < newlist.length; i++) {
        newli.appendChild(newlist[i]);
    }
});

//document.body.style.display="block";