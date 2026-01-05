// ==UserScript==
// @name           CL_autoReply
// @description    草榴新手自动回复
// @include        http://*t66y.com/*
// @include        http://cl.man.lv/*
// @include        http://184.154.178.130/*
// @include        http://cl.bearhk.info/*
// @author         congxz6688
// @version        2015.8.13.1
// @grant          none
// @namespace https://greasyfork.org/scripts/102
// @downloadURL https://update.greasyfork.org/scripts/102/CL_autoReply.user.js
// @updateURL https://update.greasyfork.org/scripts/102/CL_autoReply.meta.js
// ==/UserScript==

function addStyle(css) {
	document.head.appendChild(document.createElement("style")).textContent = css;
}
addStyle("#autoReply{margin-left:800px}");
var rou = ["%D0%BB%D0%BB%B7%D6%CF%ED", "%B8%D0%D0%BB%C2%A5%D6%F7%B5%C4%B7%D6%CF%ED", "%B8%D0%D0%BB%B7%D6%CF%ED", "%B8%D0%D0%BB%C2%A5%D6%F7%B7%D6%CF%ED", "%D6%A7%B3%D6%D2%BB%CF%C2", "%D0%BB%D0%BB%B7%D6%CF%ED", "%B8%D0%D0%BB%C2%A5%D6%F7%B5%C4%B7%D6%CF%ED", "%B8%D0%D0%BB%B7%D6%CF%ED", "%B8%D0%D0%BB%C2%A5%D6%F7%B7%D6%CF%ED", "%D6%A7%B3%D6%D2%BB%CF%C2"];
var kinds = ["7", "7", "7", "7", "7", "2", "2", "2", "15", "15", "4", "16", "16", "16", "8", "20", "20", "20"];
var ede;

function runAutoreply() {
	clearTimeout(ede);
	var thisFid = kinds[Math.floor(kinds.length * Math.random())];
	var pages = Math.ceil(10 * Math.random());
	var fidListurl = "http://" + window.location.hostname + "/thread0806.php?fid=" + thisFid + "&search=&page=" + pages;
	var getFidList = new XMLHttpRequest();
	getFidList.open("GET", fidListurl, true);
	getFidList.send(null);
	setListPowerTimeout = setTimeout(function () {
			console.log("!!!!!!!!获取帖子列表页不顺利...这里等待了10秒，因没有响应所以重来");
			getFidList.abort();
			runAutoreply();
		}, 10000);
	getFidList.onreadystatechange = function () {
		if (getFidList.readyState == 4) {
			if (getFidList.status == 200) {
				console.log("顺利进入 fid" + thisFid + " 的第 " + pages + " 页，取消前面设置的强制延时，开始随机获取主题信息");
				clearTimeout(setListPowerTimeout);
				var reTextTxt = getFidList.responseText;
				var tr2n = (pages == 1) ? reTextTxt.split('>��ͨ���}<')[1] : reTextTxt.split('>����l��</td')[reTextTxt.match(/>����l��<\/td/g).length];
				var tdthis = tr2n.match(/<h3>.*?<\/h3>/g)[Math.ceil(90 * Math.random())];
				var tid = tdthis.match(/tid=\d{6,}|\d{6,}\.html/)[0].match(/\d+/)[0];
				var tdtitle = tdthis.match(/">(.*)?<\//)[1];
				var td_content = rou[Math.floor(rou.length * Math.random())];
				var dataa = "atc_money=0&atc_rvrc=0atc_usesign=1&atc_convert=1&atc_autourl=1&atc_title=Re:" + tdtitle + "&atc_content=" + td_content + "&step=2&action=reply&fid=" + thisFid + "&tid=" + tid + "&editor=0&atc_attachment=none&pid=&article=&verify=verify"; // + (thisFid == "7" ? "3de7ee9f" : "verify");
				console.log("        主题信息获取成功，开始回复主题" + tid);
				var urll = "http://" + window.location.hostname + "/post.php?";
				var myPost = new XMLHttpRequest();
				myPost.open("POST", urll, true);
				myPost.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				myPost.setRequestHeader("Content-length", dataa.length);
				myPost.setRequestHeader("Connection", "close");
				myPost.send(dataa);
				setPostPowerTimeout = setTimeout(function () {
						console.log("        !!!!!!!!发表数据发送不畅，这里等待了10秒，因没有响应所以重来");
						myPost.abort();
						getFidList.abort();
						runAutoreply();
					}, 10000);
				myPost.onreadystatechange = function () {
					if (myPost.readyState == 4) {
						if (myPost.status == 200) {
							console.log("                服务器响应顺利，取消前面设置的强制延时");
							clearTimeout(setPostPowerTimeout);
							var res = myPost.responseText;
							if (res.indexOf("�l�N�ꮅ�c���M�����}�б�") != -1) {
								var jyy = new Date();
								var recardTime = jyy.getTime();
								var edwwq = jyy.toLocaleTimeString();
								console.log("                        于 " + edwwq + " 回复成功...180秒后再试");
								localStorage["recardTime"] = recardTime;
								ede = setTimeout(runAutoreply, 1080000);
							} else if (res.indexOf("��ˮ�A���C���ѽ����_����1024��Ȳ��ܰl�N") != -1) {
								console.log("发贴时间未到...6分钟后再试");
								ede = setTimeout(runAutoreply, 360000);
							} else if (res.indexOf("�Ñ��M���ޣ������ٵ��Ñ��Mÿ������ܰl 10 ƪ����.") != -1) {
								console.log("新人每天回复不能超过10贴，今天发完了");
								document.getElementById("autoReply").checked = false;
								localStorage['autoReplybox'] = "false";
							} else {
								console.log("                        回复响应出错，要求重新登录");
								alert("程序出错，多半是登录失效，请尝试重新登录。")
							}
						}
					}
				}
			}
		}
	}
}

//添加按钮
var replySpan = document.createElement("span");
replySpan.innerHTML = "自动回复";
var autoReplybox = document.createElement("input");
autoReplybox.type = "checkbox";
autoReplybox.id = "autoReply";
autoReplybox.title = "选中此项，启动自动回复，否则，关闭自动回复";
autoReplybox.checked = !localStorage.autoReplybox || localStorage.autoReplybox == "false" ? false : true;
autoReplybox.addEventListener('click', function () {
	localStorage['autoReplybox'] = document.getElementById("autoReply").checked;
}, true);
document.querySelector(".banner").appendChild(autoReplybox);
document.querySelector(".banner").appendChild(replySpan);

if (document.getElementById("autoReply").checked) {
	var nrt = new Date();
	var nowTime = nrt.getTime();
	var edwww = nrt.toLocaleTimeString();
	var lastTime = localStorage.recardTime ? localStorage.recardTime : 0;
	var tbt = nowTime - lastTime;
	if (tbt > 1075000) {
		runAutoreply();
	} else {
		clearTimeout(ede);
		console.log("现在是 " + edwww + "，上次回复是" + tbt + "毫秒前");
		ede = setTimeout(runAutoreply, 1080000 - tbt);
	}
}
