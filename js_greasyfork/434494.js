// ==UserScript==
// @name         js开源答案
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  user can edit the code of demo.ltpower test in Zhku
// @author       Yiiik
// @match        http://demo.ltpower.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434494/js%E5%BC%80%E6%BA%90%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/434494/js%E5%BC%80%E6%BA%90%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==
/*双端可用，移动端有概率卡崩*/
(function() {
    'use strict';
        setTimeout( function(){
            var list = document.getElementsByClassName('ans-analysis'); //获取命为“ans-analysis”的标签，类型:数组
            for(var i = 0; i <= list.length; i+1){ //遍历所有‘ans_analysis’
                list[i].classList =change; //输出
}
            function change(){
                list[this].setAttribute("class"," block;");
};

},4*1000);//延迟五千毫秒后执行
    // Your code here...
})();