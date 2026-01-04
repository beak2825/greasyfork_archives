// ==UserScript==
// @name         2023年度保密教育线上培训-baomi
// @namespace    代刷:vx;shuake345
// @version      0.1
// @description  只需要回车键，其他全自动|代刷:vx;shuake345
// @author       代刷:vx;shuake345
// @match        http://www.baomi.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baomi.org.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467320/2023%E5%B9%B4%E5%BA%A6%E4%BF%9D%E5%AF%86%E6%95%99%E8%82%B2%E7%BA%BF%E4%B8%8A%E5%9F%B9%E8%AE%AD-baomi.user.js
// @updateURL https://update.greasyfork.org/scripts/467320/2023%E5%B9%B4%E5%BA%A6%E4%BF%9D%E5%AF%86%E6%95%99%E8%82%B2%E7%BA%BF%E4%B8%8A%E5%9F%B9%E8%AE%AD-baomi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.alert = function() {}
	//window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
    window.onbeforeunload = function(e) {
  var dialogText = 'Dialog text here';
  e.returnValue = dialogText;
  return dialogText;
};
    var zyurl='http://www.baomi.org.cn/bmCourseDetail/course?id=897ed48c-b420-4b43-844b-280147eb422a&docId=9396210&docLibId=-15&siteId=95&title=2023%E5%B9%B4%E5%BA%A6%E4%BF%9D%E5%AF%86%E6%95%99%E8%82%B2%E7%BA%BF%E4%B8%8A%E5%9F%B9%E8%AE%AD'
    var BanKuai=Number(localStorage.getItem('Bkkey'))
    var LookNum= Number(localStorage.getItem('KCkey'))
    function Zy(){

    document.getElementsByClassName('tab-item pointer')[BanKuai].click()
        setTimeout(zy,3245)
    }
    setInterval(Zy,3524)
    function QT(){
    document.querySelector(" div.cover-img.full > img").src='https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg'
                        document.querySelector(" div.cover-img.full ").style="width:280px; height:280px;"
    }
    setInterval(QT,504)
    function zy(){
        if (document.URL.search('bmCourseDetail') > 2) {


            if(LookNum>=document.getElementsByClassName('titlename').length){
                document.getElementsByClassName('tab-list')[0].querySelector('[active="true"]').nextElementSibling.click()
                BanKuai++
                localStorage.setItem('Bkkey',BanKuai)
                LookNum=0
                localStorage.setItem('KCkey',0)
                //document.getElementsByClassName('titlename')[0].click()
                return
            }
            document.getElementsByClassName('titlename')[LookNum].click()
            LookNum++
            localStorage.setItem('KCkey',LookNum)
        }
    }
    
    function cy(){
        if (document.URL.search('bmVideo') > 2) {
            document.getElementsByTagName('video')[0].play()
            setTimeout(function(){
            document.getElementsByTagName('video')[0].currentTime=1600
            setTimeout(Openurl,2254)
            },1521)
            
    }
    }
    setInterval(cy,3424)
    function cy1(){
    if(document.URL.search('bmImage') > 2) {
        setTimeout(Openurl,1254)
    }
    }

    setInterval(cy1,3424)
        function Openurl(){
        window.location.replace(zyurl)
        }
})();