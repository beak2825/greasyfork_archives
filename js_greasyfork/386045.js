// ==UserScript==
// @name         山东科技大学课程评价自动选择——Course evaluation selector of SDUST
// @namespace    https://windylh.com
// @version      0.3.1
// @description  Default selection a
// @author       Windylh
// @match        http://jwgl.sdust.edu.cn/jsxsd/xspj/xspj_edit.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386045/%E5%B1%B1%E4%B8%9C%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E2%80%94%E2%80%94Course%20evaluation%20selector%20of%20SDUST.user.js
// @updateURL https://update.greasyfork.org/scripts/386045/%E5%B1%B1%E4%B8%9C%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E2%80%94%E2%80%94Course%20evaluation%20selector%20of%20SDUST.meta.js
// ==/UserScript==

/*定位要点击的页面元素*/
function getTargetByTAV(t_tag,t_attr,t_value){
	var target2 = document.getElementsByTagName(t_tag);
	for(var i=0;i <target2.length;i++){
		if(target2[i].getAttribute(t_attr) == t_value){
			return target2[i];
		}
	}
}
/*获取所有选项*/
function getOption()
{
	var trs = document.getElementsByTagName("tr")
	var targets = new Array()
	for(var i = 0; i < trs.length;i++)
	{
		var tds = trs[i].getElementsByTagName("td")
		// console.log(len)
		if(tds.length == 2 && tds[1].getElementsByTagName("input").length)
		{
			targets.push(tds)
		}
	}
	return targets
	//tds[1].getElementsByTagName("input")[0].click()
}

/*选择 随机一个b其他全是a*/
function select(targets)
{
	var rdnum = Math.floor((Math.random()*targets.length));
	//console.log(rdnum)
	for(var i =0; i < targets.length; i++)
	{
		if(i == rdnum)
		{
			targets[i][1].getElementsByTagName("input")[2].click()
		}
		else
		{
			targets[i][1].getElementsByTagName("input")[0].click()			
		}
	}
}
/* 保存 */
function save()
{
    var btn = getTargetByTAV("input","name","bc");
    btn.click();
}
/* 提交 */
function submit()
{
    var btn = getTargetByTAV("input","name","tj");
    btn.click();
}
var targets = getOption()
select(targets)