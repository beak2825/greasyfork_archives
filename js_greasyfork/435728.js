// ==UserScript==
// @name         🎉【U校园、Unipus网课答案显示】支持视听说新视野读写答案显示
// @namespace    gongchen
// @version      3.1
// @description  U校园题目答案显示；支持视听说、新视野；不支持单元测试
// @author       gongchen
// @match        *://ucontent.unipus.cn/_pc_default/pc.html?*
// @connect      *://ucontent.unipus.cn/*
// @connect      unipus.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @antifeature  ads      单元测试答案在app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435728/%F0%9F%8E%89%E3%80%90U%E6%A0%A1%E5%9B%AD%E3%80%81Unipus%E7%BD%91%E8%AF%BE%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%E3%80%91%E6%94%AF%E6%8C%81%E8%A7%86%E5%90%AC%E8%AF%B4%E6%96%B0%E8%A7%86%E9%87%8E%E8%AF%BB%E5%86%99%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435728/%F0%9F%8E%89%E3%80%90U%E6%A0%A1%E5%9B%AD%E3%80%81Unipus%E7%BD%91%E8%AF%BE%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%E3%80%91%E6%94%AF%E6%8C%81%E8%A7%86%E5%90%AC%E8%AF%B4%E6%96%B0%E8%A7%86%E9%87%8E%E8%AF%BB%E5%86%99%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

$('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
$.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function(data, status, jqxhr) {
    layui.use('element', function(){
        var element = layui.element;
    });
    layer.closeAll();
    show();
    showanswer();
});

// 感谢ssmjae提供的解密代码
function decryptContent(json) {
    if (json) {
        let r = json.content.slice(7)
        , o = CryptoJS.enc.Utf8.parse("1a2b3c4d" + json.k)
        , i = CryptoJS.enc.Hex.parse(r)
        , a = CryptoJS.enc.Base64.stringify(i)
        , contentJson = JSON.parse(CryptoJS.AES.decrypt(a, o, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        }).toString(CryptoJS.enc.Utf8));
        json = contentJson;
        console.log(json);
    }
    return json;
}

var show = ()=>{
    layer.open({
        type: 1,
        area: ['500px', '600px'],
        offset: 'l',
        id: 'msgt',
        closeBtn: 1,
        title: "U校园网课助手(答案显示，支持单选、多选、填空、简答、问答)",
        shade: 0,
        maxmin: true,
        anim: 2,
        content:'<div class="layui-collapse"><div class="layui-colla-item"><h2 class="layui-colla-title">公告</h2><div class="layui-colla-content layui-show">脚本已修复普通测试答案获取，单元测试的相关答案已录入app<img src="https://d2.ananas.chaoxing.com/download/feac612889547d337f651b219c7fb219?at_=1731486793172&ak_=348c90275cd7177a97ae69b0cb0376a6&ad_=3a92768cb747ef62b8b80b1ac716fca1" width="300px" /></div>'+
        '</div></div>'+
        '<div id="content"><ul></ul><table class="layui-table"> <colgroup> <col width="100"> <col> <col> </colgroup> <thead> <tr>  </tr> </thead> <tbody>  </tbody> </table></div></div></div>'
    });
}

let isShow = true
var showanswer = ()=>{
    if (isShow){
        let url = location.href
        let arr = url.split("/")
        let book = arr[arr.length-7]
        let unit = arr[arr.length-2]
        let answer = []
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ucontentapi.unipus.cn/course/api/content/'+book+'/'+unit+'/default/',
            headers: {
                'X-ANNOTATOR-AUTH-TOKEN': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcGVuX2lkIjoidHV4NkNCQVc4aGRrcnFZdzc5SEpEWDF2aTR5Z2ptcDUiLCJuYW1lIjoiIiwiZW1haWwiOiIiLCJhZG1pbmlzdHJhdG9yIjoiZmFsc2UiLCJleHAiOjE5MDI5NzAxNTcwMDAsImlzcyI6IlI0aG03RmxQOFdvS0xaMUNmTkllIiwiYXVkIjoiZWR4LnVuaXB1cy5jbiJ9.CwuQmnSmIuts3hHAMf9lT954rKHXUNkps-PfRJp0KnU'
            },
            timeout: 5000,
            onload: function(xhr) {
                if (xhr.status == 200) {
                    let el = '<tr class="layui-bg">' + '</td></tr>'
                    console.log('https://ucontentapi.unipus.cn/course/api/content/'+book+'/'+unit+'/default/')

                    console.log(xhr.responseText)
                    let obj = JSON.parse(xhr.responseText) || {};
                    let deObj = decryptContent(obj);
                    let keyList = Object.keys(deObj);
                    console.log(keyList)
                    Array.prototype.contains = function (obj) {
                        var index = this.length;
                        while (index--) {
                            if (this[index] === obj) {
                                return true;
                            }
                        }
                        return false;
                    }
                    // 选择题
                    if (keyList.contains('questions:questions')){
                        let questionList = deObj['questions:questions'].questions
                        for (let question of questionList){
                            let result = ''
                            if (question.answers){
                                result += question.answers.join(' ')
                            }
                            el = el + '<td>' + result + question.analysis.html + '</td></td></tr>'
                        }
                    }
                    // 简答题
                    if (keyList.contains('shortanswer:shortanswer')){
                        let questionList = deObj['shortanswer:shortanswer'].questions
                        for (let question of questionList){
                            el = el + '<td>' + deObj['shortanswer:shortanswer'].analysis.html + question.content.html + question.analysis.html + '</td></td></tr>'
                        }
                    }
                    // 填空题
                    if (keyList.contains('questions:scoopquestions')){
                        let questionList = deObj['questions:scoopquestions'].questions
                        for (let question of questionList){
                            let result = ''
                            if (question.answers){
                                result += question.answers.join(' ')
                            }
                            el = el + '<td>' + result + question.analysis.html + '</td></td></tr>'
                            console.log(el)
                        }
                    }
                    // 短回答题
                    if (keyList.contains('questions:shortanswer')){
                        let questionList = deObj['questions:shortanswer'].questions
                        for (let question of questionList){
                            let result = ''
                            if (question.answers){
                                result += question.answers.join(' ')
                            }
                            el = el + '<td>' + result + question.analysis.html + '</td></td></tr>'
                        }
                    }
                    el = el + '<td>答案结束，没答案就是没适配，请使用app</td></td></tr>'
                    $("#content>table>tbody").append($(el));
                }
            }
        });
    }
    isShow = !isShow
}

window.onhashchange=()=>{
    $("#content>table>tbody").empty();
    showanswer();
}