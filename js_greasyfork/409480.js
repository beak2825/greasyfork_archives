// ==UserScript==
// @name         花粉俱乐部后台管理小助手
// @namespace    http://tampermonkey.net/
// @version      1.0.15
// @description  帮助你快速输入，点击文本即可填写到输入框
// @author       ddrrcc
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://club.huawei.com/forum.php*
// @match        *://*.club.hihonor.com/forum.php*
// @match        *://*.club.hihonor.com/cn/forum.php*
// @icon         http://demo.sc.chinaz.com/Files/pic/icons/7719/Af11.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/409480/%E8%8A%B1%E7%B2%89%E4%BF%B1%E4%B9%90%E9%83%A8%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/409480/%E8%8A%B1%E7%B2%89%E4%BF%B1%E4%B9%90%E9%83%A8%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function(){(()=>{var a=document.createElement("style");if(a.setAttribute("type","text/css"),a.styleSheet)a.styleSheet.cssText="\n\t\t#Box3{z-index: 99;background-color:rgba(255,255,255,0.9);width:225px;font-size:14px;position:fixed;top:25%;right:0px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}\n\t\t.title{font-size:16px;font-weight:bold;margin:3px 0;padding:0}\n\t\t#red{color:red;font-size:16px;line-height:17px;font-weight:1000}\n\t\t#blue{color:blue;font-size:16px;line-height:17px;font-weight:1000}\n\t\t.box{height:30px}\n\t\t";else{var b=document.createTextNode(`
		#Box3{z-index: 99;background-color:rgba(255,255,255,0.9);width:225px;font-size:14px;position:fixed;top:25%;right:0px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}
		.title{font-size:16px;font-weight:bold;margin:3px 0;padding:0}
		#red{color:red;font-size:16px;line-height:17px;font-weight:1000}
		#blue{color:blue;font-size:16px;line-height:17px;font-weight:1000}
		.box{height:30px}
		`);a.appendChild(b)}var c=document.createElement("div");c.innerHTML=`
		<div id='Box3'>

			 <div class="box" :value="msg" @click="actionClick($event)" v-for="msg,key in msgs" :id="key%2==0?'red':'blue'">{{msg}}</div>

		</div>
		`,document.head.appendChild(a),document.body.appendChild(c)})(),"\u63D0\u4EA4"==$("#submit > strong").html()&&($("#submit").click(function(){GM_setValue("cppwd",$("#cppwd").val())}),$("#cppwd").val(GM_getValue("cppwd")),$("#submit").click()),new Vue({
		el: "#Box3",
		data: {
			//如果想增加，可以直接按照下面的形式进行添加(其中双引号和逗号均为英文状态下)
			msgs: [
				"涉黄",
				"发布VPN",
				"请勿灌水",
				"发布二维码",
				"请勿重复发帖",
				"违反国家安全法",
				"请勿发布广告贴",
				"请勿散布虚假信息",
				"发布与论坛无关内容",
				"请勿使用不文明用语/图片！",
				"二手交易请到二手交易圈圈发帖",
				"请勿使用外链或包含外链的图片",
				"发布电话号码/QQ号码/邮箱/微信/群聊",
			],

		},
		methods: {
			actionClick($event) {
				$(".pt.mtn").html(event.currentTarget.getAttribute("value"))
				$("#reason").html(event.currentTarget.getAttribute("value"))
			}
}})})();


