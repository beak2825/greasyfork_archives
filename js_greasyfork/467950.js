// ==UserScript==
// @name         click a link always open a new tab
// @description  click a link always open a new tabs
// @icon         https://img1.baidu.com/it/u=1412332306,99938487&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @license	     MIT
// @version      0.0.2
// @author       lee mathew
// @run-at       document-end
// @include      http*://*
// @namespace https://greasyfork.org/users/1090699
// @downloadURL https://update.greasyfork.org/scripts/467950/click%20a%20link%20always%20open%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/467950/click%20a%20link%20always%20open%20a%20new%20tab.meta.js
// ==/UserScript==


(function () {


    // const onClick = function (event, href) {
    //     // event.preventDefault();
    //     console.log(event, href)
    // }
    let elements = document.querySelectorAll("a")
    elements.forEach(el => {
        //如果是a标签的href只有javascript:;之类的，需要跳过
        if (el.href.indexOf('javascript:') === -1&&['http','https'].includes(el.href.split(":")[0])) {
            el.target = '_blank'
            // let params = queryURLparamsRegEs6(el.href)
            // params['new_tab_return_path'] = window.location.href
            // el.href = paramsToUrl(params)
            // el.addEventListener('click', (event) => { onClick(event, el.href) })
        }
    })
    // let params = queryURLparamsRegEs6(window.location.href)
    // if (params['new_tab_return_path']) {
    //     console.log('pushState！！！', location.href)
    //     setTimeout(() => {
    //         var thisLocation = location.href;
    //         // history.replaceState({ page: 'intercept', entered: false }, '', intercetpUrl);
    //         history.pushState({ page: 'current' }, '', thisLocation);
    //     }, 1000)

    // }
    // window.addEventListener("popstate", e => {
    //     alert("监听到了浏览器的返回按钮事件");
    // }, false);


    // function queryURLparamsRegEs6(url) {
    //     let obj = {}
    //     obj.baseUrl = url.split("?")[0]
    //     if (url.indexOf('?') < 0) return obj
    //     let arr = url.split('?')
    //     url = arr[1]
    //     let array = url.split('&')
    //     for (let i = 0; i < array.length; i++) {
    //         let arr2 = array[i]
    //         let arr3 = arr2.split('=')
    //         obj[arr3[0]] = arr3[1]
    //     }
    //     return obj
    // }
    // function paramsToUrl(params) {
    //     let ans = params.baseUrl
    //     delete params.baseUrl
    //     Object.keys(params).forEach((key, index) => {
    //         if (index === 0) {
    //             ans += '?'
    //         } else {
    //             ans += '&'
    //         }
    //         ans += `${key}=${params[key]}`
    //     })
    //     return ans
    // }
})();
