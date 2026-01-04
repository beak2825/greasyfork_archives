// ==UserScript==
// @name         刷课一号机（自动刷课脚本）实验版一
// @version      0.3.8
// @description  一个自动刷课的脚本，仅供学习交流使用，不得用于商业用途，否则后果自负！
// @author       blackcat
// @match        https://ss.nmgjzyxh.com/index.php/welcome/index/2019957300
// @grant        none
// @namespace https://greasyfork.org/users/1052995
// @downloadURL https://update.greasyfork.org/scripts/463253/%E5%88%B7%E8%AF%BE%E4%B8%80%E5%8F%B7%E6%9C%BA%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%89%E5%AE%9E%E9%AA%8C%E7%89%88%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463253/%E5%88%B7%E8%AF%BE%E4%B8%80%E5%8F%B7%E6%9C%BA%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%89%E5%AE%9E%E9%AA%8C%E7%89%88%E4%B8%80.meta.js
// ==/UserScript==
//通过xpath定位点击元素/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a
(function() {
//通过xpath定位点击元素/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a
    var xpath = "/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a";
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //通过xpath定位点击元素/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a
        var xpath = "/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a";
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);
    //通过xpath定位点击元素//*[@id="imgdownup"]
    var xpath2 = '//*[@id="imgdownup"]';
    var element2 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //通过xpath定位点击元素//*[@id="imgdownup"]
        var xpath2 = '//*[@id="imgdownup"]';
        var element2 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);
    //通过xpath定位点击元素//*[@id="data-container"]/div[1]/div[2]/div/p[1]/a
    var xpath3 = '//*[@id="data-container"]/div[1]/div[2]/div/p[1]/a';
    var element3 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //通过xpath定位点击元素//*[@id="data-container"]/div[1]/div[2]/div/p[1]/a
        var xpath3 = '//*[@id="data-container"]/div[1]/div[2]/div/p[1]/a';
        var element3 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);
    //通过xpath定位点击元素/html/body/div[2]/div[2]/div/div[1]/div/div[1]/span[1]/a
    var xpath4 = '/html/body/div[2]/div[2]/div/div[1]/div/div[1]/span[1]/a';
    var element4 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //通过xpath定位点击元素/html/body/div[2]/div[2]/div/div[1]/div/div[1]/span[1]/a
        var xpath4 = '/html/body/div[2]/div[2]/div/div[1]/div/div[1]/span[1]/a';
        var element4 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);
    //通过xpath定位点击元素//*[@id="example_video_1"]/button/span[1]
    var xpath5 = '//*[@id="example_video_1"]/button/span[1]';
    var element5 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //通过xpath定位点击元素//*[@id="example_video_1"]/button/span[1]
        var xpath5 = '//*[@id="example_video_1"]/button/span[1]';
        var element5 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);
    //待变量aria-valuetext的值为50：00时，点击元素/html/body/div[4]/ul/li[1]/i
    var xpath6 = '/html/body/div[4]/ul/li[1]/i';
    var element6 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
    element.click();
    //点击后等待3秒
    setTimeout(function(){
        //待变量aria-valuetext的值为50：00时，点击元素/html/body/div[4]/ul/li[1]/i
        var xpath6 = '/html/body/div[4]/ul/li[1]/i';
        var element6 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;//
        element.click();
    },3000);

})();