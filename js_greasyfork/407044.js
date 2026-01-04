// ==UserScript==
// @name         上学吧免费解析答案V2
// @namespace    https://letogther.cn/
// @version      2.1
// @description  上学问题一键查询，快速解决所遇到的问题!
// @author       Letogther.CN
// @match        *://*.shangxueba.com/*
// @icon         https://www.shangxueba.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407044/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E7%AD%94%E6%A1%88V2.user.js
// @updateURL https://update.greasyfork.org/scripts/407044/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E7%AD%94%E6%A1%88V2.meta.js
// ==/UserScript==

(function() {
	var sign="http://zhannei.baidu.com/cse/search?s=15172883906289933777&entry=1&q=";
	var wpqr="https://letogther.cn/collection/wp-qr.php?text=";
	var hbao="RPc1x04837usjvxamuuhzfv56ZHb";
	var mhid="5kfBXlvszp0hMHcnKdVWO6g";
	var tit=document.title;
    tit=tit.replace(" - 上学吧找答案","");
	var wturl='http://zhannei.baidu.com/cse/search?s=15172883906289933777&entry=1&q=';
	var tishi='<hr><p><b>温馨提示：</b>点击上方“免费查看答案”按钮，会带你搜索相关资源，如果未能找到，可能百度暂未收录！</p><br>1.此插件基于百度搜索引擎，百度没有收录的搜索不到是正常的，点的人多了，百度收录就快<br>2.理论上说，这次搜索不到，下次来可能就搜到，只要大家能搜到的都有免费答案<br>3.插件在初期阶段，请直接反馈问题，不要语言攻击我，不合适的话请选择其它作者的插件，没必要在骂人上边浪费时间，你的时间是宝贵的！';
	var	p_html='<div id="codeimage" class="gai_answer_im" style="background-color: #F8F8F8"><div class="gai_answer_i"></div><div class="zjbtndiv"><a href="'+wturl+tit+'" class="zjbtn" id="zjbtn" target="_blank">免费查看答案</a>'+tishi+'</div>';
	var	m_html='<div class="best_answer_g"><div class="best_answer_bg"><div class="s_content" id="zuijiadiv"></div><div class="s_content"><a href="'+wturl+tit+'" class="zjbtn" style="margin-top:0rem;" target="_blank">免费查看答案</a>'+tishi+'</div></div></div>';
	if (document.getElementById("codeimage")){
		document.getElementById("codeimage").innerHTML=p_html;
	}
	if (document.getElementById("Panel_zuijia")){
		document.getElementById("Panel_zuijia").innerHTML=m_html;
	}
})();