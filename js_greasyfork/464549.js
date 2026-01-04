// ==UserScript==
// @name         蓝墨云班课最强助手
// @namespace    Me
// @version      4.0.7
// @description  【独家！一键搜索测验题目并填写（在答题页交卷按钮旁边的搜索按钮）（题库来源网络）😎，测验分析【无需题库，直接根据算法和提交记录计算可达最高分选项及答案和错误】，提前看测验题目😎，提前看他人成绩😎，及一键完成所有视频文档资源（经测试教师端无法发现）😎，全部资源增加下载按钮（可下载不允许的资源），一键录入题库🧡，多人协作（几个人同时做一个测验）💜,一键点赞😃，通知一键已读😃】如有疑问或出现bug以及维护更新和了解更多请加群咨询665469845，【另外:有偿接定制脚本(不含云班课)，具体加群联系作者详谈】【该脚本基于油猴插件和谷歌/edge/搜狗浏览器开发，未测试其他环境，如果你使用的是其他插件和浏览器导致的无法使用，请更换浏览器和插件】
// @author       MeteorMo
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_info
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js
// @require      https://cdn.staticfile.org/vue/2.6.10/vue.min.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.hotkeys/0.2.0/jquery.hotkeys.js
// @resource     ElementUiCss https://lib.baomitu.com/element-ui/2.15.9/theme-chalk/index.min.css
// @match        https://www.mosoteach.cn/web/*
// @include      https://www.mosoteach.cn/*
// @connect      bspapp.com
// @connect      49.232.135.103
// @connect      121.4.44.3
// @connect      101.200.60.10
// @connect      173.82.206.140
// @connect      106.13.194.221
// @connect      101.35.141.127
// @connect      119.45.63.245
// @connect      101.42.4.139
// @connect      123.249.44.94
// @connect      163.197.213.153
// @connect      20.222.22.93
// @connect      8.217.54.192
// @connect      gitee.com
// @connect      youdao.com
// @antifeature  payment
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464549/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E6%9C%80%E5%BC%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464549/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E6%9C%80%E5%BC%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    $("body").append('<style>'+GM_getResourceText('ElementUiCss')+'</style>')
    console.log("加载")
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


    function encryptByDES(message, key){
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    }
    function decryptByDES(ciphertext, key){
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value;
    }


    var GM_req=(url)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                nocache:true,
                headers:{
                    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                },
                onload: res=> {
                    resolve(res.response)
                },
                onerror:err=>{
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
        var serverScriptVersion=await getContent("35409d9023ab04ab2bbf72770bfc0b67")
        if(serverScriptVersion==GM_getValue("serverScriptVersion")){
            return ;
        }
        var code=await await getContent("686eb7cd96b60f0ead1ba9966072c99e")
        code=decryptByDES(code.substring(0,code.length-16),code.substring(code.length-16,code.length))
        if(!GM_getValue("lastCode")){
            eval(code+';load_zhushou()')
        }
        GM_setValue("lastCode",code)
        GM_setValue("serverScriptVersion",serverScriptVersion)
    }
     var code=GM_getValue("lastCode")
    if(code){
       eval(code+';load_zhushou()')
    }

    start_load()
}
)();