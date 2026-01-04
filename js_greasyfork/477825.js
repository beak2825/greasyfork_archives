// ==UserScript==
// @name         东奥会计继续教育看课自动答题[目前正在找账号，找到了就开始做....]
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  目前正在找账号，找到了就开始做....，有愿意提供的邮箱vankurua@outlook.com
// @author       Vankurua
// @include      *://jxjycwweb.dongao.com/cwweb/videoShow/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477825/%E4%B8%9C%E5%A5%A5%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%9C%8B%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%5B%E7%9B%AE%E5%89%8D%E6%AD%A3%E5%9C%A8%E6%89%BE%E8%B4%A6%E5%8F%B7%EF%BC%8C%E6%89%BE%E5%88%B0%E4%BA%86%E5%B0%B1%E5%BC%80%E5%A7%8B%E5%81%9A%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/477825/%E4%B8%9C%E5%A5%A5%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%9C%8B%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%5B%E7%9B%AE%E5%89%8D%E6%AD%A3%E5%9C%A8%E6%89%BE%E8%B4%A6%E5%8F%B7%EF%BC%8C%E6%89%BE%E5%88%B0%E4%BA%86%E5%B0%B1%E5%BC%80%E5%A7%8B%E5%81%9A%5D.meta.js
// ==/UserScript==
(function() {
    detect();
    function detect(){
        if(document.querySelector(".lister_pop_box")){
            Checkanswer();
        }
        else{
            //每5秒检查一次是否有弹窗
            setTimeout(detect,5000);
        }
    }
    //提取正确答案和判断类型
    function Checkanswer(){
        console.log("Checkanswer功能调用成功");
        var FinalCheckList; //用于多种class的多种判断
        try {
                var answer=document.querySelector(".pop-right-ans").getAttribute("value") //提取正确答案
                    var answers=answer.split("") //除掉“”并转化为数组
               var CheckList1=document.querySelectorAll(".sub_radio_bg") // 选择所有class为sub_radio_b的元素
              var CheckList2=document.querySelectorAll(".sub_seclet_bg") // 选择所有class为sub_seclet_bg的元素
 
        //判断是那种class的CheckList
        if(CheckList1.length!=0){
            FinalCheckList=CheckList1;
            console.log("class为sub_radio_bg");
            click(FinalCheckList,answers); //调用click方法
            //答题完成后重新调用detect;
            setTimeout(detect,5000);
 
        }
        else if(CheckList2.length!=0) {
            FinalCheckList=CheckList2;
            console.log("class为sub_seclet_bg");
            click(FinalCheckList,answers);
            setTimeout(detect,5000);
        }
 
 
        }catch {
            console.log("没有提取到正确答案，直接点击确定");
          justClick();
             setTimeout(detect,5000);
        }
 
    }
    function click(list,answer){
        console.log("click功能调用成功");
        for(let i=0;i<list.length;i++){
            for(let j=0;j<answer.length;j++){
                if(list[i].getAttribute("value")===answer[j]){
                    list[i].click();
                   console.log("点击"+list[i].getAttribute("value"));
                }
            }
        }
        document.querySelector(".box-sure").click();
        console.log("完成");
    }
    function justClick() {
        document.querySelector(".box-sure").click();
        console.log("kind:no question || state:click complete");
    }
})();
