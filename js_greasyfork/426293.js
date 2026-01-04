// ==UserScript==
// @name         ZJU Health Report
// @namespace    https://wfb.ink/
// @version      21.05.17.02
// @description  To submit the health report
// @author       beta/β/贝塔
// @match        https://healthreport.zju.edu.cn/ncov/wap/default/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426293/ZJU%20Health%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/426293/ZJU%20Health%20Report.meta.js
// ==/UserScript==

(function() {
    'use strict';
     /*
     ************************************************************************************
      封装getElementByXpath函数
     ************************************************************************************
     */
    function getElementByXpath(xpath){
     	var element = document.evaluate(xpath,document).iterateNext();
     	return element;
    }
    /*******************************
      实现sleep函数
    *******************************/
    function sleep(numberMillis) { 
        var now = new Date(); 
        var exitTime = now.getTime() + numberMillis; 
        while (true) { 
        now = new Date(); 
        if (now.getTime() > exitTime) 
        return; 
        } 
        }
    //选择有意向接种
    var willing = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[4]/div/div/div[1]/span[2]");
    willing.click();
    //选择不过敏
    var not_allergy =getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[5]/div/div/div[5]/span[2]");
    not_allergy.click();
    //选择当前接种情况
    var have_one = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[6]/div/div/div[1]/span[2]");
    have_one.click();
    //选择是否发热
    fever =getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[7]/div/div/div[2]/span[2]");
    fever.click();
    //选择除发热外的其他情况
    except_fever = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[8]/div/div/div[2]/span[2]");
    except_fever.click();
    //选择已经领取健康码
    health_code = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[13]/div/div/div[1]/span[2]");
    health_code.click();
    //选择绿码
    green_health_code = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[14]/div/div/div[1]/span[2]");
    green_health_code.click();


    //选择是否在校
    var in_school = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[15]/div/div/div[1]/span[2]");
    in_school.click();
    
    //选择14日进出境情况
    var in_low = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[22]/div/div/div[2]/span[1]");
    in_low.click();

    //选择承诺
    var credit = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[34]/div/div/div/span[1]");
    credit.click();
    
    //点击获取位置
    var location = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[4]/ul/li[19]/div/input");
    location.click();
    
    //提交表单
    var submit = getElementByXpath("/html/body/div[1]/div[1]/div/section/div[5]/div/a");

    submit.click();

})();