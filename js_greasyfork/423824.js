// ==UserScript==
// @name         out-tgu
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  out college without permission
// @author       ayAryan
// @match        https://wk.tiangong.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423824/out-tgu.user.js
// @updateURL https://update.greasyfork.org/scripts/423824/out-tgu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    var currentdate = year + '-' + month + '-' + strDate;
    return currentdate;
}
setZt('cx')
$("[name=qjkssj]").text(getNowFormatDate()+' 7:00');
$("[name=qjjssj]").text(getNowFormatDate()+' 21:30');
$("#zpimg").attr('src','https://z3.ax1x.com/2021/03/23/6Hn9js.png');
$("#zpimg").css("border-radius","25px");
$("#cx_btn").on("click",function(){
			layer.open({
				icon: 7,
				content:"确认是否出校？",
				closeBtn: 0,
				title: '出校确认',
				shadeClose: false,
				btn: ['确认','关闭'],
				btn1: function(index, layero){
					setZt('hx')
                    
				},
				btn2: function(index, layero){
					return;
				}
			});
		});


$("#jx_btn").on("click",function(){
			layer.open({
				icon: 7,
				content:"确认是否进校？",
				closeBtn: 0,
				title: '进校确认',
				shadeClose: false,
				btn: ['确认','关闭'],
				btn1: function(index, layero){
						setZt('jz');
						$("#zpimg").hide();
						//$("#zpimg").attr('src','src');
                        //$("#zpimg").css("border-radius","0px");
						//layer.close(index);
				},
				btn2: function(index, layero){
					return;
				}
			});
		});
})();





