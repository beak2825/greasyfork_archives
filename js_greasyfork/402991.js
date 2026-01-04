// ==UserScript==
// @name         Url-Editor
// @namespace    https://greasyfork.org/users/390742
// @updateURL    https://github.com/fjqingyou/url_editor/raw/master/src/urlEditor.js
// @version      1.0.5
// @include      *
// @description  编辑 url 用
// @author       fjqingyou
// @match        http://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/**
 * Url 编辑模块
 */
UrlEditor = {};

/**
 * 获取 url 参数
 * @param {*} url 
 * @param {*} variable 
 * @returns 取得目标参数的值，不存在时返回 null
 */
UrlEditor.getUrlParam = function(url, variable){
    var result = null;
    var nIndexQuestionMark = url.indexOf('?');
    if(nIndexQuestionMark > -1){//如果存在参数
        var query = url.substring(nIndexQuestionMark + 1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] === variable){//如果找到目标了
                result = pair[1] || null;//取值，如果值不存在，返回null
                break;
            }
        }
    }
    return result;
};

/**
 * 设置 url 参数
 * @param {*} url 
 * @param {*} name 
 * @param {*} value 
 * @returns 返回变更后的 url
 */
UrlEditor.setUrlParam = function(url, name, value){
    var result;
    
    var nIndexQuestionMark = url.indexOf('?');
    if(nIndexQuestionMark === -1){//如果目标url上面还未有这个属性
        result = url + '?' + name + '=' + value;
    }else{//如果url上面已经存在了这个参数
        var nIndex = nIndexQuestionMark + 1;
        result = url.substring(0, nIndex);
        var query = url.substring(nIndex);

        var needAppend = true;
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            var key = pair[0];
            var v = pair[1];

            if(i > 0){
                result += "&";
            }
            result += key;
            result += '=';
            
            if(key !== name){//如果不是目标参数
                result += v;//保持原有值
            }else{//如果是目标参数
                result += value;//修改值
                needAppend = false;//标记为已经修改。不需要末尾填充了
            }
        }

        if(needAppend){//如果需要末尾填充
            result += '&' + name + '=' + value;
        }
    }
    return result;
};