

// ==UserScript==
// @name         新版广东海洋大学一键评估
// @version      1.0
// @description  新版海大一键评估工具,代码基于原版一键评估，感谢海大计协！代码目前测试少，如有bug想提交，可关注公众号“海大弟弟”反馈。
// @author       tlhgq
// @match        *://webvpn.gdou.edu.cn/*
// @match        *://jw.gdou.edu.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://greasyfork.org/users/734428
// @downloadURL https://update.greasyfork.org/scripts/421199/%E6%96%B0%E7%89%88%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/421199/%E6%96%B0%E7%89%88%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

if (location.href.indexOf("xspj_cxXspjIndex.html")>1){
	alert("一键评估点击确定开始，请不要干扰程序运行，时间大概5分钟");
	j=0;
	mainId=window.setInterval(function(){
		var navigation=$(".ui-widget-content.jqgrow.ui-row-ltr");
		if ($(".ui-widget-content.jqgrow.ui-row-ltr").eq(j).find("td[title='已评完']").length){
			j+=1;
			if(j==navigation.length){
				clearInterval(mainId);
				windows.setTimeout(function(){
					$("#btn_xspj_tj").click();
					window.setTimeout("$('#btn_ok').click();",2000);
					alert("已完成评价");
				},10000)
			}
			return;
		}
		$(".ui-widget-content.jqgrow.ui-row-ltr").eq(j).click();
		window.setTimeout(function(){
			var obj=$('.tr-xspj');
			for(i=1;i<obj.length+1;i++)
			{
				var ran = Math.floor(Math.random()*10);
				if(ran<9)
				{
					$(".tr-xspj").eq(i-1).find("input:radio")[0].checked=true
				}
				else
				{
					$(".tr-xspj").eq(i-1).find("input:radio")[1].checked=true
				}
			};
			if($('input:radio')[0].checked)
			{
				$('input:radio')[6].checked=true;
			}
			else
			{
				$('input:radio')[5].checked=true;
			};
			var arr=[
				" 很不错啊!很喜欢这个老师的",
				"教学挺认真负责的, 赞一个!  ",
				"  学生还是挺欣赏的,讲解透彻,通俗易懂  ",
				"  我挺喜欢这老师的，不错不错",
				" 希望老师可以讲得更好。。可以结合一些课外知识 ",
				"讲课通俗易懂，同学都挺喜欢老师的",
				"  上课挺好的，希望可以越来越好    ",
				"每次遇到问题都可以很好的得到解答",
				"和蔼可亲 讲课生动形象，让我们很容易理解   ",
				"  认真负责，上完课还会跟我们培养感情",
				"   平时在q群，还会给我们科普一些知识",
				" 平常还会 发一些学习资料，课外的东西，让我们开阔视野",
				"  其实在我们私下的评价还是挺好的，讲课不错",
				"希望讲课 可以更加透彻易懂",
				"上课时候还会 ，讲一些课外的事情，上课氛围挺融洽",
				"挺喜欢的,为人和蔼亲切",
				"  注重学生的能力培养，比较好的一名老师  ",
				"课下的时候  还会和我们一起吃饭，挺好的  ",
				"  希望课堂的气氛可以更加活跃",
				"如果可以更好的调动学生的积极性就更好了",
				"  在我见过的老师里面，这老师算是挺不错了 ",
				"如果可以讲一些 课外的知识，感觉会更好  ",
				"讲解得挺认真的，不过如果可以说一些课堂外的就好了  ",
				"  尽职尽责的一名老师，讲课挺好的",
				"  每次来教室都是很早的，时间观念准啊",
				"不拖堂，不迟到，这一点做的不错 望保持!  ",
				"   假如可以更注重学生能力 的培养就更好了",
				"q群上 大家都聊得挺好的  就是喜欢这样的老师  ",
				"  假如可以加强跟 ，学生的互动就更好了 ",
				" 大学老师能做到这样，挺不错啊 ",
				"讲课认真，能带动气氛",
				" 讲课很好，气氛活跃",
				"人很好的一个老师，课程简单",
				" 还不错，希望可以再接再厉",
				"印象还行，就是有点严肃",
				"讲课严谨，形象，生动",
				"  喜欢这老师，喜欢这课程",
				"要是能把课堂带活跃点就更好了",
				" 虽然老师课有点太快了，不过还行吧  ",
				"   要是能把课堂弄得更活跃就好了",
				"喜欢的这个老师还不错，上课还行",
				"  很好的一个老师，还会经常给我们学习资料 ",
				"还行吧这个老师，要是能多点跟我们交流就更好了，总体来说，不错!  ",
				"挺喜欢这老师的，不过课堂气氛再好一点就更好了  ",
				" 额,老师课有时候讲得不够清楚，希望可以讲透彻点",
				"不错，有问题我们都可以从他那里得到解决  ",
				"还行吧，虽然有时听不懂部分知识点，但是整体还好. ",
				" 经常在我们来上课之前就到了，很守时的老师",
				"喜欢老师上课很守时，大赞",
				" 经常教我们一些课外知识，很喜欢  ",
				"上课还行吧，会给我们认真讲解",
				"还行，还不错，有时候觉得课有点快",
				"  经常分享课程经验给我们，很好",
				"很好，从这老师那里学到很多知识  ",
				"感觉可以做的更好，虽然有时候不知道怎样理解一些知识点   ",
				"希望老师讲的更加仔细，让气氛更加活跃 ",
				" 勉强过得去吧，上课方面还是好评的",
				"很好啊，喜欢这老师",
				"  觉得课上得还行，再接再厉",
				"思维活跃，课堂氛围不错，挺好的",
				"挺不错的啊, 我们都喜欢啊"
				];
				var isvalid =function(str)
				{
					for(z=0; z<str.length; z++)
					{
						/*自定义非法字符为字母,和<和>符号, 这是ascii码*/
						var index1=str.charCodeAt(z);
						if((65<=index1 &&index1 <= 90)
							||(97<=index1 &&index1 <= 122)
							||index1==60
							||index1==62)
						{
							if(index1==113 || index1==81)
							{/*对于Q或者q就合法,因部分合法评语有"q群"字样*/
								return 1;
							}
							else
							{
								return 0;
							}
						}
					}
					return 1;
				};
				/*随机化评语的函数, 在str字符串中的百分之percent位置插入substr字符串 */
				var insertstr=function(str,percent,substr)
				{
					var res =str;
					var qian=res.substring(0,Math.floor(percent/100*res.length));
					var hou=res.substring(Math.floor(percent/100*res.length),res.length);
					res = qian + substr +hou;
					return res;
				};
				/*随机化评语的函数, 返回num个char字符*/
				var space=function(num,char)
				{
					var str="";
					for(i=0;i<num;i++)
					{
						str = str + char;
					};
					return str;
				};
				/*随机选择一个评语*/
				var ranpingyu = Math.floor(Math.random()*(arr.length-1));
				var pingyu = arr[ranpingyu];
				/*随机化评语的函数, 在pingyu中随机添加空格*/
				var kongge=function(pingyu)
				{
					if(Math.floor(Math.random()*10)<8)
					{
						for(q=Math.floor(Math.random()*2)+1;q;q--)
						{
							var pos=Math.floor(Math.random()*(100*(1+pingyu.length)/pingyu.length+1));
							pingyu=insertstr(pingyu,pos,space(Math.floor(Math.random()*2)+1," "));
						};
					};
					return pingyu;
				};
				/*随机化评语的函数, 在pingyu中随机添加逗号*/
				var douhao=function(pingyu)
				{
					if(Math.floor(Math.random()*10)<7)
					{
						for(q=Math.floor(Math.random()*2)+1;q;q--)
						{
							var pos=Math.floor(Math.random()*(100*(1+pingyu.length)/pingyu.length+1));
							pingyu=insertstr(pingyu,pos,space(Math.floor(Math.random()*2)+1,"，"));
						};
					};
					return pingyu;
				};
				/*随机化评语的函数, 在pingyu中随机添加句号*/
				var juhao=function(pingyu)
				{
					if(Math.floor(Math.random()*10)<6)
					{
						var pos=Math.floor(Math.random()*(100*(1+pingyu.length)/pingyu.length+1));
						pingyu=insertstr(pingyu,pos,space(1,"。"));
					};
					return pingyu;
				};
				/*随机化评语的函数, 在pingyu中随机添加空格, 句号, 逗号*/
				var luanma=function(pingyu)
				{
					var str =juhao(pingyu);
					str =douhao(str);
					str = kongge(str);
					return str;
				};
				/*评语中, 随机添加老师名字, 可能是李老师或者李永波老师*/
				if(Math.floor(Math.random()*10)<6)
				{
						var teachername=$("#jsxm").text()
						teachername = teachername +"老师,";
						teachername = kongge(teachername);	/*随机在老师名字中添加空格*/
					pingyu = teachername + pingyu;
				}
				pingyu = luanma(pingyu);
				/*检查评语是否合法*/
				if(isvalid(pingyu) == 0)
				{/*如果不合法, 则用内置评语*/
					pingyu=arr[ranpingyu];
				};
				$("textarea").eq(0).val(pingyu);
				$("textarea").eq(1).val(pingyu);
				$("#btn_xspj_bc").click();
				window.setTimeout("$('#btn_ok').click();",2000);
		},10000);
		j+=1;
		if(j==navigation.length){
			clearInterval(mainId);
			windows.setTimeout(function(){
				$("#btn_xspj_tj").click();
				window.setTimeout("$('#btn_ok').click();",2000);
				alert("已完成评价");
			},10000)
		}
	},20000)
}






