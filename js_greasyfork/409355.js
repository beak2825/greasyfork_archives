// ==UserScript==
// @name         chinahrt.cn济宁专业技术人员继续教育
// @namespace    **************
// @version      0.2
// @description  济宁市专业技术人员继续教育脚本
// @author       luter
// @match        *://*.chinahrt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/409355/chinahrtcn%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/409355/chinahrtcn%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
(function (){
    var b = new Date();
    var mytime=b.toLocaleTimeString();
    console.log(mytime);
	if(window.location.href.indexOf("asp?id")!=-1)//课程列表页判断
       {if(document.getElementsByClassName("kcswks")[0].innerText=="课程已合格。")
           {}
        else{for(var a of Array.from(document.getElementsByClassName("ui-bxkc clearfix")[0].getElementsByTagName("li")).concat(Array.from(document.getElementsByClassName("ui-bxkc clearfix")[1].getElementsByTagName("li"))))
	    	{
		    	if(a.innerText.indexOf("ok")!=-1)
					{console.log("课程已学完");}
				else
					{
						console.log(a);
                        console.log(a.getElementsByTagName("a")[0]);
                         a.getElementsByTagName("a")[0].click();
						break;}
					}
			}
           }
	else//如果是在视频页面
		{setInterval(function ()//设置10秒循环判断是否学完是否检测挂机
			{
			if(document.getElementById("jd_box").innerText == "已完成")//如果学习已完成则返回主页
				{document.getElementById("quitLink").click();}
			else{ b = new Date();
                console.log(b.toLocaleTimeString());//如果学习没完成判断挂机监测
				console.log(document.getElementById("jd_box").innerText);
				var current_btnx = document.getElementById("popquestion");
				    if(current_btnx)
                        {
					    console.log("答案是:"+current_btnx.getAttribute("sysans"));
                        var ans = document.getElementById("popquestion").getAttribute("sysans");
                        }
				var current_btn0 = document.getElementsByTagName('input')[0];
				if(current_btn0)
                   {
				    for(var b in ans.split(","))
					   {document.getElementsByTagName('input')[parseInt(ans.split(",")[b])-1].click();}
				   }
				var current_btn1= document.getElementsByClassName('layui-layer-btn0')[0];
				if(current_btn1)
                    {current_btn1.click()}
				var current_btn2= document.getElementsByClassName('layui-btn')[0];
				if(current_btn2)
                    {current_btn2.click()}
				}
			}, 10000);
		}

    })();