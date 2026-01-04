// ==UserScript==
// @name         可可英语刷单词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮您实现可可英语短时间内刷大量单词，点击脚本运行后，可调整刷单词的间隔时间，一分钟50关不是梦！使用说明：打开可可英语网页版，点击运行脚本，选择您需要刷的单词计划，即可自动开始刷单词，100%正确率（注意：时长需要自己刷）
// @author       Mystery
// @match        http://word.kekenet.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/394389/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%88%B7%E5%8D%95%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/394389/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%88%B7%E5%8D%95%E8%AF%8D.meta.js
// ==/UserScript==

var setting = {
    random: 0//是否开启随机时间提交，默认开启，若关闭，将会立即提交
    ,minTime: 3e3//随机最小时间
    ,maxTime: 3e3//随机最大时间
},
    _self = unsafeWindow,
    url = location.pathname,
    top = _self,
    $ = _self.jQuery || top.jQuery;

(function() {
    var param = location.search,
        word = _self.word;
    if(param.match("/?do=login")){
        return;
    }else if(param.match("/?do=levelbegin")){
        //判断是否完成当前关卡
        console.log("选关页面");
        var finished = parseInt(document.getElementsByClassName("tongj").item(0).children.item(0).innerText.match(".*：([0-9]*)")[1]),
            total = parseInt(document.getElementsByClassName("tongj").item(0).children.item(1).innerText.match(".*：([0-9]*)")[1]);
        if(finished == total){
            console.log("闯关结束");
            return;
        }
        _self.go();
    }else if(param.match("/?do=round")){
        console.log("选测页面");
        _self.go('index.php?do=wordstart&type=wordexam');
    }else{
        console.log("测试页面");
        if(document.getElementsByClassName("btn4").length != 0){
            console.log("下一关");
            document.getElementsByClassName("btn4").item(0).click();
        }else{
            console.log("选择答案:" + word);
            $('input[value=' + word + ']').attr('checked',true);
            if(setting.random){
                var time = Math.floor(Math.random() * (setting.maxTime - setting.minTime) + setting.minTime);
                setTimeout(submitAnswer, time);
            }else{
                submitAnswer();
            }
        }
    }
})();

function submitAnswer(){
    $("form").submit();
}
