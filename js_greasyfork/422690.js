// ==UserScript==
// @name         问卷网自动填写提交
// @namespace    https://juzibiji.top
// @version      1.0.0
// @description  自动填写问卷并提交
// @author       桔子
// @match        https://www.wenjuan.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422690/%E9%97%AE%E5%8D%B7%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/422690/%E9%97%AE%E5%8D%B7%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".wjques.maxtop.question").each((index,item)=>{
        let ans = $(item).find("input")
        if(ans.eq(0).attr("type")=="radio"){
            ans.eq(randomNum(0,ans.length-1)).attr("checked",true);
        }else{
            let num = randomNum(2,3)
          for(let i=0;i<num;i++){
               ans.eq(randomNum(0,ans.length-1)).attr("checked",true);
          }
        }

         setTimeout(function(){
             // 延时两秒防止验证
             document.getElementById("next_button").click();
             console.log("答题成功!");
         },2000);

        setTimeout(function(){
            location.reload();
        },4000)
    })
})();

function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}