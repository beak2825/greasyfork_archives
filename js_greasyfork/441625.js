// ==UserScript==
// @name         2022年最新华医网-公需课|选修课|学分类|全自动模式(高效执行力、精确答题库)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  全新写法，脚本在独立隔离环境运行（大大提高安全性），功能：1.视频自动加速，并自动跳过；2.自动进入考试页面，完成考试则自动下一科目，直到该课完成；3.自定义课程（公需课+选修课+学分类一站式），当完成一课则自动切换继续下一课程；4.精确智能的答题库，高效的执行力；5.所有环节适当加入延时应对校验，如：考试等；
// @author       帮帮客
// @license      bbk_1106
// @match        *://*.91huayi.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/441625/2022%E5%B9%B4%E6%9C%80%E6%96%B0%E5%8D%8E%E5%8C%BB%E7%BD%91-%E5%85%AC%E9%9C%80%E8%AF%BE%7C%E9%80%89%E4%BF%AE%E8%AF%BE%7C%E5%AD%A6%E5%88%86%E7%B1%BB%7C%E5%85%A8%E8%87%AA%E5%8A%A8%E6%A8%A1%E5%BC%8F%28%E9%AB%98%E6%95%88%E6%89%A7%E8%A1%8C%E5%8A%9B%E3%80%81%E7%B2%BE%E7%A1%AE%E7%AD%94%E9%A2%98%E5%BA%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441625/2022%E5%B9%B4%E6%9C%80%E6%96%B0%E5%8D%8E%E5%8C%BB%E7%BD%91-%E5%85%AC%E9%9C%80%E8%AF%BE%7C%E9%80%89%E4%BF%AE%E8%AF%BE%7C%E5%AD%A6%E5%88%86%E7%B1%BB%7C%E5%85%A8%E8%87%AA%E5%8A%A8%E6%A8%A1%E5%BC%8F%28%E9%AB%98%E6%95%88%E6%89%A7%E8%A1%8C%E5%8A%9B%E3%80%81%E7%B2%BE%E7%A1%AE%E7%AD%94%E9%A2%98%E5%BA%93%29.meta.js
// ==/UserScript==
class Verify {
    constructor() {
        let version_ = "1.2";
        var txt = '操作流程：\n'+
        '1.复制输入框里的内容；\n'+
        '2.点击浏览器右上角的油猴图标；\n'+
        '3.点击管理面板，找到刚安装的油猴脚本并点击打开；\n'+
        '4.在下方这行代码下有一行是空白行，请将复制的内容粘贴上去；\n'+
        '  // @require      https://cdn**********jquery/3.6.0/jquery.js\n'+
        '5.保存后刷新华医网。\n'+
        '< Ctrl + C 复制输入框内容>';
        var str = '// @require      http://r7ph36bpn.bkt.clouddn.com/bbk_15.js';
        if (GM_listValues().indexOf("set") == -1) {
            GM_setValue("set", {
                "idCard": "",
                "code": "",
                "hear":"",
                "version":""
            });
            confirm("华医网_JavaScript\n初始化完毕!\n请按流程完成功能激活。");
        }
        let Set = GM_getValue("set");
        if (Set["hear"] != true){
            data();
            setTimeout(function (){
                prompt(txt, str);
            },500);
        }
        else if(Set["version"] != version_){
            setTimeout(function (){
                Set = GM_getValue("set");
                if(Set["version"] != version_){
                    data();
                    prompt('华医网_JavaScript\n提示：您有新版本更新\n当前版本:'+Set["version"]+' 最新版本:'+version_+'\n'+
                        '请将输入框内容复制粘贴到代码【空白行】\n'+
                        '[// @require      https://cdn*****jquery.js] 第一行\n'+
                        '[                            空白行                          ] 第二行\n'+
                        '[// @grant         GM_setValue] 第三行\n'+
                        '如需帮助请关注公众号查看说明详情。', str);
                }
            },2000);
        }
    }
}
function data(){
    var url_n,url_t;
    url_n = unsafeWindow.location.href.split("/");url_t = url_n[url_n.length - 1].split("?")[0];
    if (url_t !="course_list_v2.aspx"){
        $('body').append(`
            <div id=gzh style="font-weight: bold;right: 19px;font-size: 14px;height: 32px;text-align: center;display: block;background: #ffffff;position: fixed; top:274px;width: 129px;color: #717375;margin-left: 0px;line-height: 15px;">微信扫一扫<br>关注帮帮客公众号</div>
            <iframe src="https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=102&__biz=Mzk0MjMxNTcxOQ==&mid=2247483681&idx=1&sn=382747485cbe09c94f7e7ee0eef363b5&send_time="
            style="right: 17px;display: block;position: fixed; top:143px;width: 129px;color: #555;margin-left: 0px;line-height: 11px;border-radius: 6px;height: 160px;">
            </iframe>
            `);
    }
    if(document.querySelector('#floatTips2') != null){
        document.querySelector('#imga3').style.display = 'none';
        if(document.querySelector('#floatTips') != null){
            document.querySelector('#floatTips').style.display = 'none';
        }
    }
}
new Verify();