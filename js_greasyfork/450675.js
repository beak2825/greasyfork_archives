// ==UserScript==
// @name         伪用发帖辅助
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world!
// @author       白澪
// @match        https://sstm.moe/files/submit/?do=submit&category=7
// @icon         https://s.sstmlt.com/board/monthly_2020_12/Eo3cKOVUcAAxybH.thumb.jpg.b0dd0e33f3e881d1aacb0dce94262fe4.jpg
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450675/%E4%BC%AA%E7%94%A8%E5%8F%91%E5%B8%96%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/450675/%E4%BC%AA%E7%94%A8%E5%8F%91%E5%B8%96%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('我的脚本加载了');
    var btn = document.createElement('button');

    document.getElementById("elURLFiles").before(btn);
    btn.innerText = '粘贴'
    btn.onclick = function ()
    {
        //e.preventDefault()防止打开链接

        var txt =document.getElementById("elSearchField").value;
        //console.log(txt)
        var txt3=/链接：(.*)title/.exec(txt)[1];
        var txt0=/title：(.*).end/.exec(txt)[1];
        //console.log('点击了按键');
        //console.log(txt);
        document.getElementById("elInput__0").value = txt3;//文件
        document.getElementById("elInput_file_title").value = txt0;//文件名
        var txt1=/end(.*)秒传：/.exec(txt)[1];
        var txt2=/秒传：(.*) /.exec(txt)[1];
        var txt5=/tag:(.*)封面/.exec(txt)[1];
        var list = document.getElementsByClassName('cke_wysiwyg_div cke_reset cke_enable_context_menu cke_editable cke_editable_themed cke_contents_ltr');
        document.evaluate('//*[@id="elDownloadsSubmit_otherinfo"]/div[1]/div[2]/div/div/ul/li[3]/div/a',document,).iterateNext().click();
        setTimeout(function(){
            var tag = txt5.match(/(\d)+/g);
            var i = 0
            //console.log(tag)
            for (i in tag){
                //console.log(tag[i])
                var tage = '//*[@id="elInput_file_tags_results"]/ul/li['+tag[i]+']';
                //console.log(tage)
                document.evaluate(tage,document,).iterateNext().click();
            };
            },600);

        //console.log(tag)
        list[0].innerHTML =txt1;
        list[1].innerHTML =txt2;
        console.log('txt1='+txt1);
        console.log('txt2='+txt2);
        //console.log('zhuijial ')



    };
    var btn0 = document.createElement('button');
    document.getElementById("elURLScreenshots").before(btn0);
    btn0.innerText = '封面'
    btn0.onclick = function ()
    {

        //console.log("click1");
        //封面——完成
        var title2 = document.getElementById("elURLScreenshots")
        setTimeout(function(){
        title2.click(function(){});
        //console.log("click2");
        },300);
        var btn2 = document.getElementsByClassName('ipsButton ipsButton_light ipsButton_small')[0]
        setTimeout(function(){
        btn2.click(function(){});

        },600);
        //xpath定位
        //https://cloud.tencent.com/developer/article/1703895
        //https://blog.csdn.net/woden2005/article/details/1530969
        //https://www.w3school.com.cn/xmldom/met_document_evaluate.asp
        var txt =document.getElementById("elSearchField").value;
        var txt1=/封面：(.*) 链接/.exec(txt)[1];
        setTimeout(function(){
        var link =document.evaluate(
            "//*[@id='elURLScreenshots_menu']/ul/li/div/div/ul/li/input",
            document,
            ).iterateNext();
        //console.log(link.value);
        link.value = txt1;
        },1000);

        setTimeout(function(){
        var btn1 =document.evaluate(
            "//*[@id='elURLScreenshots_menu']/a",
            document,
            ).iterateNext();
            btn1.click(function(){});
        },1500);
        var prefix = /前缀:(\d)tag/.exec(txt)[1]
        setTimeout(function(){
            document.evaluate(
                '//*[@id="elDownloadsSubmit_otherinfo"]/div[1]/div[2]/div/div/ul/li[2]/div/select',
                document,).iterateNext().options[prefix].selected=true
        },2500);

        var jc =document.evaluate(
            "//*[@id='file_cost']/div/input",
            document,
            ).iterateNext();
        //console.log(prefix);
        var paid = document.getElementById('elRadio_file_cost_type_paid_')
        paid.click(function(){});
        jc.value = '5'
        //console.log(jc);
    };
    var btn1 = document.createElement('button');
    btn0.before(btn1);
    btn1.innerText = '提交'
    btn1.onclick = function (){
        document.evaluate('//*[@id="elDownloadsSubmit"]/div[4]/div[2]/div/button',document,).iterateNext().click();

    }
    // Your code here...
})();
