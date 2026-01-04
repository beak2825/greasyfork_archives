// ==UserScript==

// @name        Tools DEV 收集页面性能信息、资源信息
// @description 收集页面性能信息、资源信息
// @include     *
// @author      AD
// @version     0.1
// @namespace   aboutdev
// @icon        data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/433169/Tools%20DEV%20%E6%94%B6%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BF%A1%E6%81%AF%E3%80%81%E8%B5%84%E6%BA%90%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/433169/Tools%20DEV%20%E6%94%B6%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BF%A1%E6%81%AF%E3%80%81%E8%B5%84%E6%BA%90%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...

    // 将以下脚本放在 </head> 前面就能获取白屏时间。

    // <script>
    //     whiteScreen = new Date() - performance.timing.navigationStart
    // </script>

    // 收集性能信息
    const getPerformance = ()=>{
        if (!window.performance)
            return
        const timing = window.performance.timing
        const performance = {
            // 重定向耗时
            redirect: timing.redirectEnd - timing.redirectStart,
            // 白屏时间
            // whiteScreen: whiteScreen,
            // DOM 渲染耗时
            dom: timing.domComplete - timing.domLoading,
            // 页面加载耗时
            load: timing.loadEventEnd - timing.navigationStart,
            // 页面卸载耗时
            unload: timing.unloadEventEnd - timing.unloadEventStart,
            // 请求耗时
            request: timing.responseEnd - timing.requestStart,
            // 获取性能信息时当前时间
            time: new Date().getTime(),
        }
        return performance
    }

    // 获取资源信息
    const getResources = ()=>{
        if (!window.performance)
            return
        const data = window.performance.getEntriesByType('resource')
        const resource = {
            xmlhttprequest: [],
            css: [],
            other: [],
            script: [],
            img: [],
            link: [],
            fetch: [],
            // 获取资源信息时当前时间
            time: new Date().getTime(),
        }

        data.forEach(item=>{
            const arry = resource[item.initiatorType]
            arry && arry.push({
                // 资源的名称
                name: item.name,
                // 资源加载耗时
                duration: item.duration.toFixed(2),
                // 资源大小
                size: item.transferSize,
                // 资源所用协议
                protocol: item.nextHopProtocol,
            })
        }
                    )

        return resource
    }
    let getPerformanceAD = getPerformance()
    , getResourcesAD = getResources()
    console.log(getPerformanceAD,'=> AD 页面性能信息')
    //console.table(getPerformanceAD)
    console.log(getResourcesAD,'=> AD 页面资源信息')
    //console.table(getResourcesAD)

    //let getPerformanceADJson = JSON.stringify(getPerformanceAD)
    //, getResourcesADJson = JSON.stringify(getResourcesAD)
    //console.log(getPerformanceADJson,'=> AD 页面性能信息')
    //console.log(getResourcesADJson,'=> AD 页面性能信息')
})();