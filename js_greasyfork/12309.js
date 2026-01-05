// ==UserScript==
// @name        打印月历
// @namespace   http://www.mapaler.com/
// @description 打印设定月份的月历
// @include     *://wannianrili.51240.com/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12309/%E6%89%93%E5%8D%B0%E6%9C%88%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/12309/%E6%89%93%E5%8D%B0%E6%9C%88%E5%8E%86.meta.js
// ==/UserScript==

//适用于http://wannianrili.51240.com/
(function (){
var print_button = document.createElement("input");
print_button.className ="all_an_1";
print_button.type = "button"
print_button.value="打印当前月份";
print_button.onclick = function(){rebuild();window.print();};
document.getElementsByClassName("nry_bt")[0].appendChild(print_button);

function rebuild()
{
	if (document.getElementById('jie_guo'))
	{
		var jie_guo = document.getElementById("jie_guo");
		var wnrl_k_zuo = jie_guo.getElementsByClassName("wnrl_k_zuo")[0].cloneNode(true);
		wnrl_k_zuo.id = "wnrl_k_zuo";
		var wnrl_xuanze_top = wnrl_k_zuo.getElementsByClassName("wnrl_xuanze_top")[0];
		var wnrl_xuanze_top_wenzi = wnrl_xuanze_top.getElementsByClassName("wnrl_xuanze_top_wenzi")[0];
		document.title = wnrl_xuanze_top_wenzi.textContent + "日历表";
		//删掉Top里的按钮
		var topList = wnrl_xuanze_top.childNodes;
		for(var i=topList.length-1;i>=0;i--){
			if(topList[i] != wnrl_xuanze_top_wenzi)
				wnrl_xuanze_top.removeChild(topList[i]);
		}
		//wnrl_xuanze_top.innerHTML = wnrl_xuanze_top_wenzi.outerHTML;
		//删掉当天
		var riqiList = wnrl_k_zuo.getElementsByClassName("wnrl_riqi");
		for(var i=0;i<riqiList.length;i++){
			var btn = riqiList[i].getElementsByTagName("a")[0];
			btn.removeAttribute("style");
			if (btn.classList.contains('wnrl_riqi_xiu'))
			{
				var span_xiu = document.createElement("span");
				span_xiu.innerHTML = "休";
				span_xiu.className = "wnrl_riqi_xiu_sign";
				btn.insertBefore(span_xiu,btn.firstChild);
			}
			if (btn.classList.contains('wnrl_riqi_ban'))
			{
				var span_xiu = document.createElement("span");
				span_xiu.innerHTML = "班";
				span_xiu.className = "wnrl_riqi_xiu_sign";
				btn.insertBefore(span_xiu,btn.firstChild);
			}
		}
		var print_border = document.createElement("div");
		print_border.id = "print_border";
		print_border.className = "print_border";
		print_border.appendChild(wnrl_k_zuo);
		
		var childList = document.body.childNodes;
		for(var i=childList.length-1;i>=0;i--){
			document.body.removeChild(childList[i]);
		}
		document.body.appendChild(print_border);
	}
	
	if (!document.getElementById('print'))
	{
		var ss = document.createElement("style");
		ss.id = "print";
	}
	else
	{
		var ss = document.getElementById("print");
	}
	ss.innerHTML = '.print_border,.wnrl_k_zuo,body,html{width:100%;height:100%;padding:0;background:0 0}.wnrl_xuanze_top{width:100%;text-align:center;height:4%}.wnrl_xuanze_top_wenzi{font-size:2em;text-height:font-size;float:none}.wnrl_kongbai,.wnrl_riqi,.wnrl_xingqi{width:14.28%}.wnrl_kongbai,.wnrl_riqi,.wnrl_riqi:hover{box-sizing:border-box;border:1px solid #C8CACC}.wnrl_riqi a,.wnrl_riqi a:hover{border:none;width:70px;height:70px}.wnrl_xingqi{height:2%}.wnrl_kongbai,.wnrl_riqi{height:18.4%}.wnrl_riqi_xiu{background:#FFF0F0 none repeat scroll 0 0}.wnrl_riqi_ban{background:#F5F5F5 none repeat scroll 0 0}.wnrl_riqi_xiu_sign{display:block;width:15px;height:15px;color:#FFF;background:#F43 none repeat scroll 0 0;text-indent:1px;line-height:14px;position:absolute}.wnrl_riqi_ban .wnrl_riqi_xiu_sign{background:#969799 none repeat scroll 0 0}';
	document.body.appendChild(ss);
}

})();