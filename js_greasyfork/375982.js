// ==UserScript==
// @name         B站去除主页各种推荐视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  B站各种分区删除各种不想看到的关键字的视频推荐
// @author       a8105
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375982/B%E7%AB%99%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%90%84%E7%A7%8D%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/375982/B%E7%AB%99%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%90%84%E7%A7%8D%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
var regList=new Array();
regList[0]=new RegExp(".*排行.*");
regList[1]=new RegExp(".*数据可视.*");
regList[2]=new RegExp(".*[Tt][Oo][Pp][0-9]+.*");
//以下为近期泛滥的ikun视频推荐屏蔽,不喜欢请注释
regList[3]=new RegExp(".*蔡徐坤.*|.*坤坤.*");


(function() {
    'use strict';
    var list=getBiliAreas();
    setInterval(function(){
        for(var x=0;x<list.length;x++)
        {
            var viedoNode=getZone(getZoneModule(list[x]));
            checkViedos(viedoNode);

        }
    },5000);

    // Your code here...
})();
function checkReg(title)
{
    for(var x=0;x<regList.length;x++)
    {
        var reg=regList[x];
        if(reg.test(title))
        {
            return true;
        }
    }
    return false;
}
function checkViedos(node)
{
    var removeList=new Array();
    var index=0;
    for(var x=0;x<node.childNodes.length;x++)
    {
        if(node.childNodes[x].className=="spread-module")
        {
            var viedo=node.childNodes[x].childNodes[0].childNodes[1];
            var title=viedo.getAttribute("title");

            if(checkReg(title))
            {
                console.log("查找到死妈排行榜标题:"+title+",进行人道毁灭");
                removeList[index++]=x;
            }
        }
    }
    for(x=0;x<removeList.length;x++)
    {
        node.removeChild(node.childNodes[removeList[x]]);
    }
}
function getZone(node)
{
    var subNode=null;
    for(var x=0;x<node.childNodes.length;x++)
    {
        if(node.childNodes[x].className=="new-comers-module l-con")
        {
            subNode=node.childNodes[x];
            break;
        }
    }
    if(subNode==null)
    {
        return null;
    }
    for(x=0;x<subNode.childNodes.length;x++)
    {
        if(subNode.childNodes[x].className=="storey-box clearfix")
        {
            return subNode.childNodes[x];
        }
    }
    return null;
}
function getZoneModule(node)
{
    for(var x=0;x<node.childNodes.length;x++)
    {
        if(node.childNodes[x].className=="zone-module")
        {
            return node.childNodes[x];
        }
    }
    return null;
}
function getBiliAreas()
{

    var list=new Array();
    var index=0;
    var appNode=getBiliNode();
    if(appNode==null)
    {
        return list;
    }
    for(var x=0;x<appNode.childNodes.length;x++)
    {
        var a=hasArea(appNode.childNodes[x]);
        if(a==true)
        {
            list[index++]=appNode.childNodes[x];
        }
    }
    return list;
}
function getBiliNode()
{
    var childs=document.body.childNodes;
    for(var x=0;x<childs.length;x++)
    {
        console.log(childs[x].id);
        if(childs[x].id=="app")
        {
            var child=childs[x];
            for(var y=0;y<child.childNodes.length;y++)
            {
                if(child.childNodes[y].className=="bili-wrapper")
                {
                    return child.childNodes[y];
                }
            }
        }
    }
    return null;
}
function hasArea(node)
{
    for(var x=0;x<node.childNodes.length;x++)
    {
        if(node.childNodes[x].className=="zone-module")
        {
            return true;
        }
    }
    return false;
}