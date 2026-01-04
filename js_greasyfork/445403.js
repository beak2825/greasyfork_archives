// ==UserScript==
// @name        去除知乎登陆和跳转拦截
// @namespace   zhihu
// @match       *://zhuanlan.zhihu.com/*
// @include     *://*.zhihu.com/*
// @include     https://www.baidu.com/*
// @include     https://m.baidu.com/*
// @grant       none
// @version     1.2
// @author      Xian
// @description 2024/3/20
// @downloadURL https://update.greasyfork.org/scripts/445403/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E9%99%86%E5%92%8C%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/445403/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E9%99%86%E5%92%8C%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==


window.addEventListener('touchstart', function (e) {
    window.localStorage.clear();
    // 清除cookie
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
});

window.addEventListener('load', function (e) {

    document.querySelector('html').style.overflow = 'auto';

    let style = document.createElement('style')
    style.innerHTML = /* css */`
        html,body{
            overflow: auto!important;
        }
        .Modal-wrapper,.Modal-enter-done,.OpenInAppButton,.pt10,.clearfix{
            display: none!important;
        }
    `
    document.body.appendChild(style)




    const MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    const observeMutationSupport = !!MutationObserver;
    baidu()
    if (observeMutationSupport) {
        let observer = new MutationObserver(function (records) {
            setTimeout(function () {
                baidu()
            },0)

        });
        let body = document.querySelector('body')
        observer.observe(body, {
            'childList': true,
            'subtree': true
        })
    }

    // 监听url变化
    window.addEventListener('popstate', function (e) {
        window.localStorage.clear();
        // 清除cookie
        let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (let i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            }
        }
        baidu()
    })

    function clickLink(url){
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click();
        a.remove()
    }

    function baidu() {
       // 去除知乎跳转拦截
    document.querySelectorAll('a').forEach(function (item) {
        let href = item.href;
        // 获取链接参数
        let params = href.split('?')[1];
      if(!params){
        return
      }
        let paramsArr = params.split('&');
      if(!paramsArr){return}
        let paramsObj = {};
        paramsArr.forEach(function (item) {
            let arr = item.split('=');
            paramsObj[arr[0]] = arr[1];
        })
      if(!paramsObj['target']){return}
        item.href = decodeURIComponent(paramsObj['target'])
    })
        // 去除csdn结果
        document.querySelectorAll('.result').forEach(function (item) {
            let mu = item.getAttribute('mu');
            if(mu){
                item.addEventListener('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    clickLink(mu)
                })
            }else{
                item.style.display = 'none';
            }
            if (mu && mu.indexOf('.csdn.') > -1) {
                item.style.display = 'none';
            }
        })

        // 去除百度广告
        let baiduReslut =  document.querySelector('#content_left') && document.querySelector('#content_left').children;
        if(baiduReslut){
            for (let i = baiduReslut.length - 1; i >= 0; i--) {
                let className = baiduReslut[i].className;
                if (className.indexOf('result') < 0) {
                    baiduReslut[i].style.display = 'none';
                    // baiduReslut[i].remove()
                }
            }
        }

    }



    // 去除禁止复制代码
    document.querySelectorAll('pre').forEach(function (item) {
        item.style.userSelect = 'auto!important';
    })
    document.querySelectorAll('code').forEach(function (item) {
        item.style.userSelect = 'auto!important';
    })


})