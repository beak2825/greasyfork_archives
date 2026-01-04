// ==UserScript==
// @name         必应搜索过滤 激进版
// @namespace    https://greasyfork.org/scripts/442253-%E5%B1%8F%E8%94%BD%E5%86%85%E5%AE%B9%E5%86%9C%E5%9C%BA-with-%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC/code/%E5%B1%8F%E8%94%BD%E5%86%85%E5%AE%B9%E5%86%9C%E5%9C%BA%EF%BC%88with%20%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @version      0.4.06.03
// @description  配合原脚本使用，增加对国内假新闻网站的过滤。这个真的很激进，请做好需要临时禁用本脚本的准备。
// @author       limbopro
// @license MIT
// @match        https://www.google.com/search*
// @match        https://www.google.com.hk/search*
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @match        https://www.bing.com/?FORM*
// @match        https://cn.bing.com/?FORM*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.hk
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497631/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4%20%E6%BF%80%E8%BF%9B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/497631/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4%20%E6%BF%80%E8%BF%9B%E7%89%88.meta.js
// ==/UserScript==
 
/* 源码地址
// https://limbopro.com/Adguard/contentFarm/contentFarm.js 每日更新；供 Quantumult X / Surge 等代理软件调用；
// https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adguard/contentFarm/contentFarm.js push 后更新至GitHub 方便查看历史更新内容
*/

/*
Written by limbopro
https://limbopro.com/archives/block-contentfarm.html
https://t.me/Adblock4limbo
There are 7179 content farm domains in total until now.
Last updated at 31/5月/2024/23:12
*/


/*
Google TxT Ads block 
*/

function contentFarm_AdsRemove_Auto(){

    //var ads_cssSelectors = [
    //"[data-text-ad]",
    //"#tvcap"
    //];
    
    //var ads_List = document.querySelectorAll( ads_cssSelectors );
    //if (ads_List.length >0) {
    //for (xyz = 0; xyz < ads_List.length; xyz++){
    //ads_List[xyz].style.display = "none";
    //}
    //}
    
    
    /* 
    var ads_cssSelectors = ["[data-text-ad],#tvcap"];
    var ads_List = document.querySelectorAll( ads_cssSelectors );
    var ads_Block;
    for (ads_Block = 0; ads_Block < ads_List.length; ads_Block++){
    ads_List[ads_Block].style.display = "none";
    }
    */
    
    /*
    content farm domains list.
    */
    
    
    var ads_host = [

"://view.inews.qq.com",
"://news.qq.com",
".sina.com",
".sina.cn",
"://www.msn.com/zh-cn/news",
"://www.msn.cn/zh-cn/news",
"://xueqiu.com",
"://baijiahao.baidu.com",
".sohu.com",
".163.com",
".ifeng.com",
".thepaper.cn",
".bilibili.com",
"://blog.csdn.net",
".zaker.cn",
".sinchew.com.my",
".hk01.com",
".storm.mg",
".crntt.com",
".chinatimes.com",
"://udn.com",
".stnn.cc",




".guancha.cn"
        ];
    
        var search_results_css = [
            "li.b_algo", // bing 搜索结果样式
            ".mnr-c.xpd.O9g5cc.uUPGi", // Google 富文本搜索结果 style
            "div[data-sokoban-grid]", // 通用
            "div.Ww4FFb.vt6azd.xpd.EtOod.pkphOe", // 新增 2023.08.27
            "div.g", // Google PC 搜索结果样式
            "div[class='g'][data-hveid]", // 这是谷歌PC端搜索结果页的 style
            "div[class='mnr-c g'][data-hveid]", // 这是谷歌手机端搜索结果页的 style
            "div[class][data-sokoban-container]"// 最后一个选择器也不需要逗号结尾
        ]
    
    var i, x;
        setTimeout(() => {
            var huge = document.querySelectorAll(search_results_css);
            console.log("捕获" + huge.length + "个有效样式！")
            for (i = 0; i < ads_host.length; i++) {
                var ads_host_css = "[href*='" + ads_host[i] + "']";
                    for (x = 0; x < huge.length; x++) {
                        if (huge[x].querySelectorAll(ads_host_css).length) {
                            huge[x].remove();
                            console.log(huge[x].textContent + " -> 涉及内容农场！已移除！")
                        }
                    }
                }
            }, 500);
    
        timecount +=1;
        console.log("循环第" + timecount + "次")
        if (timecount === 1) {
            clearInterval(id);
            console.log("循环结束！")
        }
    }
    
    
    contentFarm_AdsRemove_Auto();
    var timecount = 0;
    var id = setInterval(contentFarm_AdsRemove_Auto, 1000);


// 选择需要观察的目标节点
const targetNode = document.body;

// 配置观察选项
const config = { childList: true, subtree: true }; // 监听子节点的变化以及子树中的变化

// 创建一个 MutationObserver 实例
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('DOM 子节点发生了变化:', mutation);

            setTimeout(() => { 
                contentFarm_AdsRemove_Auto() // 如页面加载了新的内容则执行农场内容检测
            }, 1500)

        } else if (mutation.type === 'attributes') {
            console.log('DOM 属性发生了变化:', mutation);
        }
    }
});

// 开始观察
observer.observe(targetNode, config);

// 停止观察
// observer.disconnect();