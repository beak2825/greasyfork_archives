// ==UserScript==
// @name         B站视频跳转
// @namespace    https://gist.github.com/QingMu01
// @version      1.0.2
// @description  将B站的视频/专栏传送门功能搬到站外
// @author       QingMu_
// @include      *
// @exclude      *://*.bilibili.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/400724/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/400724/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
//如需添加其他站点,按上面@match的格式自行添加即可(每行一个)

const matchRules = /(?:av[0-9]+)|(?:bv[A-z0-9]{10,})|(?:cv[0-9]+)/gi;
const config = {childList: true, subtree: true ,characterData:true ,attributes:true};
var observer = {
    observe(){},
    disconnect(){}
}
const checker={
    nodeChecker:(node)=>{
        if((node.nodeType != 8) && (node.nodeType != 3) && (node.nodeName !== 'STYLE') && (node.nodeName != 'SCRIPT') && (node.nodeName != 'A')){
            return true;
        }else{
            return false;
        }
    },
    typeChecker:(match)=>{
        let type = match.trim().toLowerCase().substring(0,1);
        if(type == 'b'){
            return `<a target="_blank" style="text-decoration:underline;" href="https://www.bilibili.com/video/${match}">${match}</a>`;
        }else if(type == 'a'){
            return `<a target="_blank" style="text-decoration:underline;" href="https://www.bilibili.com/video/${match.toLowerCase()}">${match}</a>`;
        }else if(type == 'c'){
            return `<a target="_blank" style="text-decoration:underline;" href="https://www.bilibili.com/read/${match.toLowerCase()}">${match}</a>`;
        }
    }
}
//检索所有文字节点,匹配到的加入处理列表
const DFS = {
    nodes: [],
    do (root) {
        for (let i = 0;i < root.childNodes.length;i++) {
            var node = root.childNodes[i];
            if (checker.nodeChecker(node)) {
                try{
                    if(node.innerText.match(matchRules) != null){
                        this.nodes.push(node);
                    }
                }catch(e){};
                this.do(node);
            }
        }
        return this.nodes;
    }
}

//节点操作
const DOMmanipulate={
    update : (mutationsList,observer)=>{
        mutationsList.forEach((item,index)=>{
            if(item.addedNodes.length>0){
            item.addedNodes.forEach((node,i)=>{
                try{
                    if((checker.nodeChecker(node)) && (node.innerText.match(matchRules) !== null)){
                        DOMmanipulate.startTransaction(node)
                    }
                }catch(e){};
            });
        }
        });
    },
    startTransaction : (checkNodes)=>{
        observer.disconnect();
        DFS.nodes.length=0;
        DFS.do(checkNodes);
        for(let x in DFS.nodes){
            let gc = DFS.nodes[x].children;
            if(gc.length==0){
                DFS.nodes[x].innerHTML = DFS.nodes[x].innerHTML.replace(matchRules,(match)=>{
                    return checker.typeChecker(match);
                });
            }else{
                let originLength = gc.length;
                for(let i=0;i<originLength;i++){
                    if(gc[i].innerText.match(matchRules) != null){
                        break;
                    }else if(i == gc.length-1){
                        DFS.nodes[x].innerHTML = DFS.nodes[x].innerHTML.replace(matchRules,(match)=>{
                            return checker.typeChecker(match);
                        });
                    }
                }
            }
        }
        observer.observe(document.body, config);
    }
}
//创建观察者,当节点更新时检查
try{
    observer = new MutationObserver(DOMmanipulate.update);
}catch(e){
    console.log("[B站视频跳转]:创建MutationObserver失败,无法监听DOM节点改变,后续更新的内容将不会对av/bv/cv号进行链接转换!")
}
//防止在网站对内容解析前生效导致出现奇怪的布局
window.setTimeout(function(){
    DOMmanipulate.startTransaction(document.body);
},3000)