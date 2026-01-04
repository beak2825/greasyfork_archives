// ==UserScript==
// @name         法制考试秒视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击播放后会自动更新数据，需要关闭播放器重新进入才能同步状态
// @author       moxiaoying
// @match        https://ks.cqsdx.cn/exam/user/home
// @match        https://ks.cqsdx.cn/exam/user/exam/video*
// @match        https://ks.cqsdx.cn/exam/user/exam/submit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1198733
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477083/%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%A7%92%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/477083/%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%A7%92%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    function dictToParams(params) {
        let paramsString = '';
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                paramsString += key + '=' + encodeURIComponent(params[key]) + '&';
            }
        }
        // 去除最后一个"&"字符
        if (paramsString.length > 0) {
            paramsString = paramsString.slice(0, -1);
        }
        return paramsString;
    }
    function parseParams(paramsString){

        // 创建正则表达式对象，以匹配等号两侧的参数键值对
        const regex = /([^=&]+)=([^&]*)/g;
        // 使用match方法来解析参数键值对
        const matches = paramsString.match(regex);

        // 创建空字典来存储参数键值对
        const params = {};

        // 使用forEach循环和match结果来解析参数键值对
        matches.forEach((match) => {
            // 使用split方法和decodeURIComponent函数对匹配结果进行解码
            const [key, value] = decodeURIComponent(match).split('=');
            // 将匹配结果存储到字典中
            params[key] = value;
        });
        return params
    }
    ajaxHooker.hook(request => {
        if (request.url.includes('exam/saveTime')&& request.method=='POST'){
            const data = parseParams(request.data)

            //if(data.currentTime!=0){
                data.access += '='
                data.currentTime = 2*60*60
                request.data = dictToParams(data)
            //}
        }
    });
    // Your code here...
})();