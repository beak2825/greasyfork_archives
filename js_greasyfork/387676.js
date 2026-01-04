// ==UserScript==

// @name         幕布-全屏浏览
// @namespace    。。。
// @version      0.1
// @description  全屏浏览【BUG 全屏浏览或其他一些操作之后“收缩/展开主题”按钮就没了 】
// @include      https://mubu.com/doc*
// @author       Arno Lee
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/387676/%E5%B9%95%E5%B8%83-%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/387676/%E5%B9%95%E5%B8%83-%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {

    // 画布宽度100%、调整内容区域上边距
    document.getElementById("paper").style.cssText="max-width: 100%;margin: -28px auto 0px";

    // 隐藏没什么卵用的区域
    document.getElementsByClassName("header-position")[0].style.cssText = "height: unset;";

    // 收拾头部
    let viewHeader = document.getElementsByClassName("view-header")[0];
    viewHeader.style.cssText = "height: unset;position: fixed;top: 12px;font-size: 13px;background: unset;box-shadow: unset;width: 100px;left: 91.3%;";

    let viewHeaderChilds = viewHeader.childNodes;
    for(let i = 0 ;i<viewHeaderChilds.length;i++)
    {
        let child = viewHeaderChilds[i];
        if(child.className==undefined)
        {
           continue;
        }
        if(child.className != "right")
        {
           child.style.cssText="display: none; visibility: hidden;";
        }
        else
        {
            let cchilds = child.childNodes;
            for(let i = 0;i<cchilds.length;i++)
            {
                  let child = cchilds[i];
                  if(child.className==undefined)
                  {
                      continue;
                  }
                  if(child.id != "toolbar-mind" && child.id != "toolbar-play")
                  {
                      child.style.cssText="display: none; visibility: hidden;";
                  }
            }
        }
    }

    // 隐藏统计及时间区域、只保留“收缩/展开主题”按钮
    let viewInfoChilds = document.getElementsByClassName("view-info")[0].childNodes;
    for(let i = 0 ;i<viewInfoChilds.length;i++)
    {
       let child = viewInfoChilds[i];
       if(child.className=="row"||child.className=="row view-count"||child.className=="row view-time")
       {
           child.style.cssText="display: none;";
       }
       else if(child.className=="row view-shortcuts")
       {
           child.style.cssText="margin-top: -85px;";
       }
    }

    // 隐藏右侧评论区域
    document.getElementById("comment-op").style.cssText="display: none;";

    // 隐藏底部举报区域
    document.getElementById("complaints").style.cssText="display: none;";

})();