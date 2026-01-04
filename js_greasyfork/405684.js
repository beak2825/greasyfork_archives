// ==UserScript==
// @name         haha
// @namespace    noly
// @version      2.2
// @author       唯一有效
// @match        https://*.yuketang.cn/*
// @description   稳定题库, 同时去除切屏检测, 去除异常检测
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/405639-api-lib/code/API_lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405684/haha.user.js
// @updateURL https://update.greasyfork.org/scripts/405684/haha.meta.js
// ==/UserScript==

/*globals $,jQuery*/
'use strict';
console.log=()=>{}
function KloadForm(){
    var arr = location.href.split('/');
    var r='www.seigonala.net?i='+arr[6];
    $.ajax({
        dataType: "json",
        url: r,
        success: function(json) {
            var $tr="";
            for (const [key, value] of Object.entries(json.ans)){
                $tr += "<tr><td style='border: 1px solid; text-align: center;'>"+(key-4)+"</td><td style='border: 1px solid; text-align: center;'>"+value+"</td></tr>";
            }
            $div.find('tbody').html($tr);
        }
    });
}
var $div = $('#panel').length ? $('#panel') : $(
    '<div id="panel" style="border: 2px dashed rgb(255, 255, 255); width: 202px; position: fixed; top: 0; left: 10%; z-index: 99999; background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); overflow-x: auto;">' +
    '<div style="max-height: 302px; overflow-y: auto;">' +
    '<table border="1" style="font-size: 12px; color:rgb(255 ,250 ,250) ;font-weight:bold" >' +
    '<thead>' +
    '<tr>' +
    '<th style="min-width: 40px; border: 1px solid; text-align: center;">序号</th>' +
    '<th style="width: 80%; min-width: 160px; border: 1px solid; text-align: center;">答案（点击可复制）</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody><tr><td style="border: 1px solid; text-align: center;">...</td><td style="border: 1px solid; text-align: center;">正在加载, 请稍后</td></tr></tbody>' +
    '</table>' +
    '</div>' +
    '</div>'
).appendTo('body').on('click', 'td', function() {
    $(this).prev().length && GM_setClipboard($(this).text());
});
KloadForm();

let css=`
.load{
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	z-index: 10000;
    background-color: rgba(0, 0, 0, 1);
}
.loader{
	width: 1500px;
	height: 14000000px;
	text-align: center;
	position: absolute;
	padding-top: 15px;
	background-color: rgba(0, 0, 0, 0);
	border-radius: 5px;
}
#loader-run{
	width: 60px;
	height: 60px;
	background: #f1e5e5;
}
.load-msg{
	height: 50px;
	line-height: 50px;
	color: #fff;
	font-size: 13px;
}
svg path, svg rect {
	fill: #62d652a1;
}`;
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
window.onload=()=>{
    if(window.location.href.toLowerCase().match("quiz")==null)return 0;
    $("body").append(`<div class="load" style="z-index=99999">
		<div class="loader">
			<svg id="loader-run" viewBox="0 0 50 50">
				<path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
					<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
				</path>
			</svg>
			<div class="load-msg">脚本装载, 1分钟内将会出结果, 请耐心等待</div>
		</div>
	</div>`)
}
