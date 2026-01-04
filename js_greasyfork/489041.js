// ==UserScript==
// @name         自动学内蒙古乌兰察布兴安盟呼伦贝尔科尔沁济宁专业技术人员继续教育chinahrt.cn
// @license      快速代看+VX:zengyi136
// @namespace    快速代看+VX:zengyi136
// @description  快速代看+VX:zengyi136
// @version      0.2
// @description  内蒙古乌兰察布兴安盟呼伦贝尔济宁专业技术人员继续教育
// @author       luter
// @match        *://*.chinahrt.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489041/%E8%87%AA%E5%8A%A8%E5%AD%A6%E5%86%85%E8%92%99%E5%8F%A4%E4%B9%8C%E5%85%B0%E5%AF%9F%E5%B8%83%E5%85%B4%E5%AE%89%E7%9B%9F%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%A7%91%E5%B0%94%E6%B2%81%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2chinahrtcn.user.js
// @updateURL https://update.greasyfork.org/scripts/489041/%E8%87%AA%E5%8A%A8%E5%AD%A6%E5%86%85%E8%92%99%E5%8F%A4%E4%B9%8C%E5%85%B0%E5%AF%9F%E5%B8%83%E5%85%B4%E5%AE%89%E7%9B%9F%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%A7%91%E5%B0%94%E6%B2%81%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2chinahrtcn.meta.js
// ==/UserScript==
(function ()
	{
    var b = new Date();
    var mytime=b.toLocaleTimeString();
    console.log(mytime);
	if(window.location.href.indexOf("asp?id")!=-1)//课程列表页判断
           {if(document.getElementsByClassName("kcswks")[0].innerText=="课程已合格。")
           {}
            else{for(var a in document.getElementsByClassName("ui-bxkc clearfix")[0].getElementsByTagName("li"))
					{
					if(document.getElementsByClassName("ui-bxkc clearfix")[0].getElementsByTagName("li")[a].innerText.indexOf("ok")!=-1)
						{console.log("课程已学完");}
					else
						{
						console.log(a);
                        console.log(document.getElementsByClassName("ui-bxkc clearfix")[0].getElementsByTagName("li")[a].getElementsByTagName("a")[0]);
                         document.getElementsByClassName("ui-bxkc clearfix")[0].getElementsByTagName("li")[a].getElementsByTagName("a")[0].click();
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