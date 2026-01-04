// ==UserScript==
// @name         ssss
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  理杏仁辅助增强
// @author       李富全
// @match        *://cn.bing.com/*
// @match        *://www.lixinger.com/*
// @match        *://www.lixinger.com/*
// @match        *://www.jisilu.cn/*
// @icon         https://www.lixinger.com/static/img/logo50x50.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      danjuanfunds.com
// @connect      open.lixinger.com
// @connect      www.jisilu.cn
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435526/ssss.user.js
// @updateURL https://update.greasyfork.org/scripts/435526/ssss.meta.js
// ==/UserScript==

(function() {
   //投资星级
        grade();
        function grade(){
            //金色星星、灰色的星星
            var golden='<svg t="1635563991909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3794" width="15" height="15"><path d="M509.867 189.867L608 411.733l243.2 25.6-181.333 162.134 51.2 238.933-211.2-121.6-211.2 121.6 51.2-238.933L168.533 435.2l243.2-25.6 98.134-219.733z" p-id="3795" fill="#f4ea2a"></path></svg>';
            var gray='<svg t="1635563991909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3794" width="15" height="15"><path d="M509.867 189.867L608 411.733l243.2 25.6-181.333 162.134 51.2 238.933-211.2-121.6-211.2 121.6 51.2-238.933L168.533 435.2l243.2-25.6 98.134-219.733z" p-id="3795" fill="#FFFFFF"></path></svg>';
            var half='<svg t="1635563863937" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3132" width="15" height="15"><path d="M883.075899 428.228061l-267.119757-22.906709-104.369046-246.226914-104.363929 246.226914-267.122827 22.906709 202.63714 175.596274-60.72606 261.081227 229.575676-138.430816 229.577722 138.374534-60.780295-261.134439L883.075899 428.228061zM511.587096 656.715963 511.587096 311.183322l63.559595 149.966547 162.695452 14.038738-123.465986 106.871029 37.002752 158.998247L511.587096 656.715963z" p-id="3133" fill="#f4ea2a"></path></svg>';
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://danjuanfunds.com/djapi/fundx/activity/user/vip_valuation/show/detail?source=lsd",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var time=json.data.time;
                        var grade=json.data.grade;
                        //数字等级转化为图片，更易识别
                        switch(grade){
                            case "1":
                                grade=golden+gray+gray+gray+gray;
                                break;
                            case "1.5":
                                grade=golden+half+gray+gray+gray;
                                break;
                            case "2":
                                grade=golden+golden+gray+gray+gray;
                                break;
                            case "2.5":
                                grade=golden+golden+half+gray+gray;
                                break;
                            case "3":
                                grade=golden+golden+golden+gray+gray;
                                break;
                            case "3.5":
                                grade=golden+golden+golden+half+gray;
                                break;
                            case "4":
                                grade=golden+golden+golden+golden+gray;
                                break;
                            case "4.5":
                                grade=golden+golden+golden+golden+half;
                                break;
                            case "5":
                                grade=golden+golden+golden+golden+golden;
                                break;
                        }
                        alert(1111)
                        $("#_grade").append("<a href='https://danjuanfunds.com/screw/valuation-table?channel=' target='_blank'><p title='数据来源：银行螺丝钉\r\n数据时间"+time+"'>"+grade+"</p></a>");
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                }
            });
        }
        //投资星级

})();