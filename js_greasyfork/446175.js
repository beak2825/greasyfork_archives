// ==UserScript==
// @name         常熟理工经典阅读自动答题【2023年学习通版】
// @namespace    http://your.homepage/
// @version      1.1.1
// @description  本插件用于常熟理工经典阅读，可以一键自动填涂答案，正确率在95%以上，使用方法见下方
// @author       You
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @match        *://*.chaoxing.com/*
// @resource     ElementUiCss https://lib.baomitu.com/element-ui/2.15.9/theme-chalk/index.min.css
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-y/vue/2.6.10/vue.min.js
// @connect      youdao.com
// @connect      bspapp.com
// @require      https://greasyfork.org/scripts/446130-%E7%A7%81%E6%9C%89%E4%B8%8D%E5%85%AC%E5%BC%80%E4%BE%9D%E8%B5%96/code/%E7%A7%81%E6%9C%89%E4%B8%8D%E5%85%AC%E5%BC%80%E4%BE%9D%E8%B5%96.js?version=1216625
// @antifeature  payment
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446175/%E5%B8%B8%E7%86%9F%E7%90%86%E5%B7%A5%E7%BB%8F%E5%85%B8%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E3%80%902023%E5%B9%B4%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/446175/%E5%B8%B8%E7%86%9F%E7%90%86%E5%B7%A5%E7%BB%8F%E5%85%B8%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E3%80%902023%E5%B9%B4%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%89%88%E3%80%91.meta.js
// ==/UserScript==



(function() {


    function convertObj(data) {
        var _result = [];
        for (var key in data) {
            var value = data[key];
            if (value.constructor == Array) {
                value.forEach(function(_value) {
                    _result.push(key + "=" + _value);
                });
            } else {
                _result.push(key + '=' + value);
            }
        }
        return _result.join('&');
    }

    function getJson(url) {
        var arr = url.split('?')[1].split('&')
        var theRequest = new Object();
        for (var i = 0; i < arr.length; i++) {
            var kye = arr[i].split("=")[0]
            var value = arr[i].split("=")[1]
            theRequest[kye] = value
        }
        return theRequest;
    }

    function getGroup(data, index = 0, group = []) {
        var need_apply = new Array();
        need_apply.push(data[index]);
        for (var i = 0; i < group.length; i++) {
            need_apply.push(group[i] + data[index]);
        }
        group.push.apply(group, need_apply);
        if (index + 1 >= data.length) return group;
        else return getGroup(data, index + 1, group);
    }

    var GM_req=(url)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                nocache:true,
                headers:{
                    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01'
                },
                onload: res=> {
                    resolve(res.response)
                },
                onerror:err=>{
                    console.log("错误信息",err)
                    window.zs=""
                    reject("加载异常")
                }
            })
        })
    }

    var getContent=async (id)=>{
        var res = await GM_req("https://note.youdao.com/yws/api/note/"+id+"?sev=j1")
        res=JSON.parse(res)
        var content = $(res.content).text()
        return  content
    }

    var start_load=async ()=>{
        var serverScriptVersion=await getContent("ccd68cbb0f63160412442413cf63bd9f")
        var html=GM_getValue("lastCode")
        if(serverScriptVersion==GM_getValue("serverScriptVersion")&&html){
            console.log("无需更新",serverScriptVersion)
            return ;
        }
        GM_setValue("serverScriptVersion",serverScriptVersion)
        html=await await getContent("1762a59d76952c07a48fbddf9561cdcf")
        window.check.content=html
    }
    start_load()
})();