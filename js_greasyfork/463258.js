// ==UserScript==
// @name         刷课一号机（自动刷课脚本）
// @version      0.3.12
// @description  一个自动刷课的脚本，仅供学习交流使用，不得用于商业用途，否则后果自负！
// @author       blackcat
// @match        https://ss.nmgjzyxh.com/index.php/welcome/index/2019957300
// @match        https://ss.nmgjzyxh.com/web/myPlan
// @match        https://ss.nmgjzyxh.com/web/CourseInfo/addShop/2019957300/lJxyNzNkj/lyXzizSkV/nmgjzyxh123202304021238077499
// @match        https://ss.nmgjzyxh.com/web/CourseInfo/startStudent/2019957300/lJxyNzNkj/lXSSyJSgq/lyXzizSkV/nmgjzyxh123202304021238077499
// @grant        none
// @namespace https://greasyfork.org/users/1052995
// @downloadURL https://update.greasyfork.org/scripts/463258/%E5%88%B7%E8%AF%BE%E4%B8%80%E5%8F%B7%E6%9C%BA%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463258/%E5%88%B7%E8%AF%BE%E4%B8%80%E5%8F%B7%E6%9C%BA%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    //建立一个循环，用于判断当前页面的url是否为https://ss.nmgjzyxh.com/index.php/welcome/index/2019957300，如果是，则执行下面的代码，否则不执行
    while (window.location.href == "https://ss.nmgjzyxh.com/index.php/welcome/index/2019957300") {
    //利用xpath定位点击元素/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a
    var xpath = "/html/body/div[4]/div[2]/div[2]/div/div[3]/h2/a";
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    element.click();
    //进入新网页，利用xpath定位点击元素"//*[@id=\"imgdownup\"]"
    var xpath = "//*[@id=\"imgdownup\"]";
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    element.click();
    

    }
})();