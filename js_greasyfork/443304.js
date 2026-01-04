// ==UserScript==
// @name        v2ex 免跳转浏览 + 折叠回复少的页面
// @namespace   ThomasKara
// @run-at document-end
// @match     http*://v2ex.com
// @match     http*://*.v2ex.com
// @version     0.1.3
// @description 折叠回复少的页面；在 v2ex 主页面显示鼠标悬停内容
// @downloadURL https://update.greasyfork.org/scripts/443304/v2ex%20%E5%85%8D%E8%B7%B3%E8%BD%AC%E6%B5%8F%E8%A7%88%20%2B%20%E6%8A%98%E5%8F%A0%E5%9B%9E%E5%A4%8D%E5%B0%91%E7%9A%84%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/443304/v2ex%20%E5%85%8D%E8%B7%B3%E8%BD%AC%E6%B5%8F%E8%A7%88%20%2B%20%E6%8A%98%E5%8F%A0%E5%9B%9E%E5%A4%8D%E5%B0%91%E7%9A%84%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function getBox(){
    let box;
    if (location.pathname.startsWith("/go/")){
        box=Array.from(document.querySelectorAll("#Main .box")).slice(-1);
    } else {
        box=Array.from(document.querySelectorAll("#Main .box"));
    }
    return box[0];
}

function getCells(box){
    let l=box.querySelectorAll("*>.cell")
    if (l.length){
        return l
    }
    l=box.querySelectorAll(".box #TopicsNode .cell.item")
    if (l.length){
        return l
    }
    return []
}

// 折叠回复小于等于1的页面
(function () {
    'use strict';
    var box=getBox();
    var l=getCells(box);
    var less=[""];

    if (l.length){
        for (var i=0;i<l.length;i++){
            var tr=l[i].querySelector("tr");
            if (!tr){
                continue;
            }
            if (tr.lastElementChild&&tr.lastElementChild.children.length>1){
                continue;
            }
            if (tr.lastElementChild.querySelector("a")&&parseInt(tr.lastElementChild.querySelector("a").innerText)>1){
                continue;
            }
            l[i].style="padding: 0 10px;overflow: hidden;height: 1.3rem;border: none;";
            l[i].querySelector(".item_title").style.fontSize=".9em";
            less.push(l[i]);
        }
        less[0]=less.length+" - "+Math.floor(100*(l.length-less.length)/l.length)+"% ("+(l.length-less.length)+"/"+l.length+")";
        box.append(...less);

        console.log(less[0]);
    }
})();

// 免跳转预览
(function () {
    'use strict';
    var box=getBox();
    var l=getCells(box);
    var ifrm=document.querySelector("iframe.fast-viewer");
    var blocker=document.querySelector("div.blocker");

    if (l.length){
        document.querySelector("#Rightbar").style.display="none";
        if (!ifrm){
            ifrm=document.createElement("iframe");
            ifrm.classList.add("fast-viewer");
            ifrm.style="height: 80vh;border: 1px solid gray;z-index: 1;";
            blocker=document.createElement("div");
            blocker.classList.add("blocker");
            blocker.style="position: fixed; bottom: 0px; width: 100%;";
            blocker.title="this area is blocked to prevent falling, try to scroll up";
        }
        for (var i=0;i<l.length;i++){
            var a=l[i].querySelector(".item_title a");
            if (a){
                let current=l[i];
                let a=current.querySelector(".item_title a");
                a.onmouseenter=()=>{
                    if (ifrm.src!=a.href){
                        ifrm.src=a.href;
                        let margin=40;
                        ifrm.style.width=document.body.getBoundingClientRect().width-margin-10+"px";
                        ifrm.style.marginLeft=(margin-current.getBoundingClientRect().x)+"px";
                        insertAfter(ifrm, current);
                        window.scrollTo(0, current.getBoundingClientRect().top + document.documentElement.scrollTop)
                        ifrm.onload=()=>{
                            let replyBox=ifrm.contentWindow.document.querySelector("#reply-box")
                            if (replyBox){
                                replyBox.style.display="none";
                            }
                            ifrm.contentWindow.document.querySelector("#Bottom").style.display="none";
                        };
                        blocker.style.height=window.innerHeight-ifrm.offsetHeight-current.offsetHeight+"px";
                        insertAfter(blocker, ifrm);
                    }
                };
            }
        }
    }
})();
