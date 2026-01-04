// ==UserScript==
// @name         分派电影优化
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  本脚本支持直接提取分派电影资源，无需关注公众号，剔除淘宝推广广告(ps：会删除所有图片)，剔除弹窗跳转,移除底部推广链接,兼容广告屏蔽插件
// @author       晚枫QQ237832960
// @license      Creative Commons
// @match        https://ifenpaidy.com/*
// @grant        用我的脚本还是别太过分啦
// @downloadURL https://update.greasyfork.org/scripts/438336/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438336/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    console.log('~~~~~~~脚本开始执行~~~~~~~')
    console.log('~~~~~~~删除图片~~~~~~~')
    var ele = document.getElementsByClassName("img-responsive")
    console.log('测试')
    console.log(ele)
    var i
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始，删除所有图片及淘宝推广广告')
            console.log(ele[i])
            ele[i].remove()
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    console.log('~~~~~~~提取资源~~~~~~~')
    ele = document.getElementsByClassName("hidepost")
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始,解除资源隐藏')
            console.log(ele[i])
            ele[i].classList.remove('hidepost')
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    console.log('~~~~~~~删除验证码~~~~~~~')
    ele = document.getElementsByClassName("post-code-container")
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始，验证码提示栏')
            console.log(ele[i])
            ele[i].remove()
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    console.log('~~~~~~~移除文字广告~~~~~~~')
    ele = document.getElementsByClassName("div")
    if (ele != null){
        for (i = ele.length-1;i>1;i--){
            console.log('下标数字为：    '+i +'    开始，文字广告')
            console.log(ele[i])
            ele[i].remove()
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    console.log('~~~~~~~移除弹窗广告~~~~~~~')
    ele = document.getElementsByClassName("modal-body")
    if (ele != null){
        ele[0].remove()//删除弹窗广告
    }
    console.log('~~~~~~~移除网站底部推广链接~~~~~~~')
    ele = document.getElementsByClassName("pull-right")[0].getElementsByTagName('a')
    if (ele != null){
        for (i = ele.length-1;i>=0;i--){
            console.log('下标数字为：    '+i +'    开始，底部导航推广链接')
            console.log('链接： '+ele[i].getAttribute('href'))
            if(ele[i].getAttribute('href').indexOf('http') != -1){
                ele[i].remove()
            }
            console.log('下标数字为：    '+i +'    结束')
        }
    }
    console.log('~~~~~~~移除全局好狗导航推广链接~~~~~~~')
    $("body").unbind("click");
    console.log('~~~~~~~脚本执行完毕~~~~~~~')
})();