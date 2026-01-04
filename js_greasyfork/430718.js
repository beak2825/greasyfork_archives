// ==UserScript==
// @name         党员E家平台优化
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.31
// @description  对两个对话框的数据进行同步
// @match        https://fj.dyejia.cn/partysso/login.html?*
// @downloadURL https://update.greasyfork.org/scripts/430718/%E5%85%9A%E5%91%98E%E5%AE%B6%E5%B9%B3%E5%8F%B0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430718/%E5%85%9A%E5%91%98E%E5%AE%B6%E5%B9%B3%E5%8F%B0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
function removeEl(elName){
    document.getElementById(elName).remove();
};
var per
var par
var perID;
var perIDtip;
var perPA;
var perPAtip;
var parID;
var parIDtip;
var parPA;
var parPAtip;

var t1=window.setInterval(a,1000);

function a(){

    const DFS = {
        nodes: [],
        do (root) {
            for (let i = 0;i < root.childNodes.length;i++) {
                var node = root.childNodes[i];
                // 过滤 text 节点、script 节点
                if ((node.nodeType != 3) && (node.nodeName != 'SCRIPT')) {
                    this.nodes.push(node);
                    this.do(node);
                }
            }
            return this.nodes;
        }
    }
    var nodeList=DFS.do(document.body);
    for(var i=0;i<nodeList.length;i++){
        if(undefined!=nodeList[i].attributes.title&&"请输入个人账户"==nodeList[i].attributes.title.textContent){
            per=nodeList[i].attributes.id.nodeValue.split(":") [0]
            perID=per+":t"
            perIDtip=per+":pht"
            perPA=(parseInt(per,16)+1).toString(16) + ":t"
            perPAtip=(parseInt(per,16)+1).toString(16) + ":pht"
        }
        if(undefined!=nodeList[i].attributes.title&&"请输入管理员账户"==nodeList[i].attributes.title.textContent){
            par=nodeList[i].attributes.id.nodeValue.split(":") [0]
            parID=par+":t"
            parIDtip=par+":pht"
            parPA=(parseInt(par,16)+1).toString(16) + ":t"
            parPAtip=(parseInt(par,16)+1).toString(16) + ":pht"
        }
    }
    var inputEnd=document.getElementById(perID)
    if (undefined != inputEnd){
        document.getElementById(perID).addEventListener('change',function(){document.getElementById(parID).value=document.getElementById(perID).value});//注册事件
        document.getElementById(perPA).addEventListener('change',function(){document.getElementById(parPA).value=document.getElementById(perPA).value});//注册事件

        console.log(perID)
        console.log(perIDtip)
        console.log(perPA)
        console.log(perPAtip)

        console.log(parID)
        console.log(parIDtip)
        console.log(parPA)
        console.log(parPAtip)

        removeEl(perIDtip)
        removeEl(perPAtip)
        removeEl(parIDtip)
        removeEl(parPAtip)

        document.getElementsByClassName('_s f-omit')[0].click()//切换到：个人标签
        
        
        window.clearInterval(t1);
    }else{
        console.log(1)
    }

}
