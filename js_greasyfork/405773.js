// ==UserScript==
// @name         MyKirito Auto Click
// @namespace    https://github.com/jakeuj/MyKirito
// @version      1.2
// @description  mykirito.com 的自動操作，不包含任何界面調整。
// @author       jakeuj@hotmail.com
// @match        https://mykirito.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405773/MyKirito%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/405773/MyKirito%20Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // [使用者自定義參數] 樓層獎勵是否已啟用: true=已啟用樓層獎勵, false=未啟用樓層獎勵
    var floorBonusEnalbe = true;
    // [使用者自定義參數] 行動: 1=狩獵兔肉, 2=自主訓練, 3=外出野餐, 4=汁妹, 5=做善事, 6=坐下休息, 7=釣魚
    var action = 7;

    // 自動確認修行彈窗
    var realConfirm=window.confirm;
    window.confirm=function(){
        window.confirm=realConfirm;
        return true;
    };

    // 依據樓層獎勵是否已啟用定位行動所在Div
    var actionDivIndex = 3;
    if(floorBonusEnalbe){
        actionDivIndex = 4;
    }

    //自動行動並領取樓層獎勵
    setInterval(function(){
        // 行動
        var xPathRes = document.evaluate ('/html/body/div[1]/div/div[1]/div['+actionDivIndex+']/button['+action+']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        xPathRes.singleNodeValue.click();
        // 樓層獎勵
        if(floorBonusEnalbe){
            xPathRes = document.evaluate ('/html/body/div[1]/div/div[1]/div[3]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            xPathRes.singleNodeValue.click();
        }
    }, 10000);
})();