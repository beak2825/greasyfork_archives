// ==UserScript==
// @name         豆瓣小组屏蔽用户及屏蔽关键词
// @namespace    http://tampermonkey.net/
// @version      1.1.2.5
// @license      MIT
// @description  提供豆瓣小组屏蔽用户及屏蔽关键词的功能,no sight,no mind
// @author       https://greasyfork.org/users/574395-frammolz-amanda
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://www.douban.com/group/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/441100/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%8F%8A%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/441100/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%8F%8A%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
	function update(){
		var i0=0;
		for(var j = 0; j<blk.length; j++){
			var fix1 = new RegExp("https://www.douban.com/people/"+".*");
			var result=fix1.exec(blk[j]);
			if(!result){
				keyword[i0]=blk[j];
				blk.splice(j,1);
				i0++;
				j--;
			}
		}
		localStorage.setItem("blk", JSON.stringify(blk));
		localStorage.setItem("keyword", JSON.stringify(keyword));
		localStorage.setItem("blkver", "1.1.0");
	}
	var Html = `
		<div id="top-nav-blk" class="douban-blk">
			<div class="douban-blk-out"></div>
			<div class="popup">
				<div>
					<img class="img" src="https://s1.ax1x.com/2022/03/08/b6j7pF.png" height="80" width="80" />
					<h1><br /></h1>
					<h1>屏蔽名单</h1>
					<div id="blk"></div>
					<div>
						<br /><input type="text" placeholder="输入主页地址" id="blockItem" />
						<button id="addBlockItem" class="addBlockItem">add</button>
						<p align="center">示例：https://www.douban.com/people/xxxxxxx/<br />(链接后面不要加后缀)</p>
					</div>
					<br />
					<h1>屏蔽词</h1>
					<div id="keyword"></div>
					<div>
						<div class="cb">
							<input type="checkbox" id="applyOnComment" value="1">应用屏蔽词于评论（默认只应用于标题）
						</div>
						<br /><input type="text" placeholder="输入屏蔽词" id="blkword" />
						<button id="addkeyword" class="addBlockItem">add</button>
						<p align="center">示例：抽奖</p>
					</div>
				</div>
				<div class="BackupContent"><div>请完全复制以下内容：</div>
					<p id="BackupContent"></p>
				</div>
				<div class="RestoreWindow">
					<input type="text" placeholder="输入要导入的数据" id="SyncData" />
					<button id="sync" class="addBlockItem">OK</button>
					<p align="center">示例：["https://www.douban.com/people/xxxx/","抽奖"]</p>
				</div>
				<button id="Backup" class="addBlockItem" >导出</button>
				<button id="Restore" class="addBlockItem" >导入</button><br /><br />
				<button id="Done" class="addBlockItem" >完成</button><br /><br />
			</div>
		</div>
	`;
	var style = `
		<style>
			.img{
				position:absolute;
				top:0px;
				right:0px;
			}
			.blk{
				float: left;
				margin: auto auto auto 30px;
			}
			.cb{
				float: left;
				padding-top: 20px;
				margin: auto auto 10px 30px;
			}
			.del{
				float: right;
				cursor: pointer;
				margin-right: 30px;
				padding: 0px 12px;
			}
			.del:hover {
				color: #fff;
			}
			.del0{
				float: right;
				cursor: pointer;
				margin-right: 30px;
				padding: 0px 12px;
			}
			.del0:hover {
				color: #fff;
			}
			.addBlockItem{
				cursor: pointer;
				padding: 0px 8px;
			}
			.addBlockItem:hover {
				color: #fff;
			}
			.douban-blk {
				width: 100vw;
				height: 100vh;
				position: absolute;
				top: 0;
				left: 0;
				display:none;
			}
			.douban-blk-out {
				position: absolute;
				background: rgba(0,0,0,0);
				width: 100%;
				height: 100%;
				z-index: 99;
			}
			.popup {
				width: 400px;
				text-align: center;
				margin: auto;
				position:absolute;
				right:0px;
				top: 28px;
				background: #fff;
				padding: auto;
				overflow: auto;
				z-index: 100;
				border-style: groove
			}
			.RestoreWindow {
				display:none;
			}
			#BackupContent {
				margin: auto 30px 10px 30px;
				word-wrap:break-word;
				word-break:normal; 
				border-style: groove;
			}
			.BackupContent{
				display:none;
			}
		</style>
	`;
	var style1 = `
		<style>
			.popup {
				height: auto;
			}
		</style>
	`;
	var style2 = `
		<style>
			.popup {
				height: 800px;
			}
		</style>
	`;
		var blk=JSON.parse(localStorage.getItem("blk"));
		var keyword=JSON.parse(localStorage.getItem("keyword"));
		var ver=localStorage.getItem("blkver");
		var apoc=localStorage.getItem("apoc");
		if(!blk){
		blk=[];
		localStorage.setItem("blk", JSON.stringify(blk));
	}
		if(!keyword){
		keyword=[];
		localStorage.setItem("keyword", JSON.stringify(keyword));
	}
		if(ver!="1.1.0"){
		update();
	}
		if(!apoc){
		apoc = 0;
		localStorage.setItem("apoc", "0");
	}
		$(document.body).append(Html);
	$(document.body).append(style);
		if(blk.length+keyword.length>11){
		$(document.body).append(style2);
	}
	else{
		$(document.body).append(style1);
	}
		const utils = {
		bindedEles: [],
		bindClick: function(selector, callback) {
			this.bindedEles.push(selector);
			$(selector).click(callback);
		}
	}
		const insertPos = $('#db-global-nav .top-nav-doubanapp');
	if (insertPos && insertPos[0]) {
		$(insertPos[0]).after('<div id="blk-config" class="top-nav-info"><span class="addBlockItem">黑名单设置</span></div>');
	}
	const $contain = $('#top-nav-blk');
	const $body = $(document.body);
	utils.bindClick('#blk-config', e => {
		$contain.show();
		$body.css('overflow', 'hidden');
	});
	utils.bindClick('#Done', e => {
		$contain.hide();
		$body.css('overflow', 'initial');
	});
	utils.bindClick('.douban-blk-out', e => {
		$contain.hide();
		$body.css('overflow', 'initial');
	});
	var list=[];
	var list1=[];
	goto();
	function goto(){
		list=[];
		list1=[];
		blk.forEach(function(item,index){
			var listItem='<br /><div class="blockItem"><p class="blk">item</p><button data-index="{index}" class="del">删除</button></div><br />'.replace(/item/g,item)
			listItem=listItem.replace(/{index}/g,index)
			list.push(listItem)
			$("#blk").html(list.join(""));
			$(".del").on("click",function(){
				var index=$(this).attr("data-index");
				$(this).closest("div").remove();
				blk=JSON.parse(localStorage.getItem("blk"));
				blk.splice(index,1)
				localStorage.setItem("blk", JSON.stringify(blk));
				goto();
			})
		})
		keyword.forEach(function(item,index){
			var listItem='<br /><div class="blockItem"><p class="blk">item</p><button data-index="{index}" class="del0">删除</button></div><br />'.replace(/item/g,item)
			listItem=listItem.replace(/{index}/g,index)
			list1.push(listItem)
			$("#keyword").html(list1.join(""));
			$(".del0").on("click",function(){
				var index=$(this).attr("data-index");
				$(this).closest("div").remove();
				keyword=JSON.parse(localStorage.getItem("keyword"));
				keyword.splice(index,1)
				localStorage.setItem("keyword", JSON.stringify(keyword));
				goto();
			})
		})
	}
	if(apoc == 1){
		$("#applyOnComment").attr("checked", true);
	}
	else{
		$("#applyOnComment").attr("checked", false);
	}
	$("#addBlockItem").on("click",function(){
		var blockItem=$("#blockItem").val();
		if(!blockItem){
			alert("不能提交空白内容")
			return;
		}
		var re1 = new RegExp("https://www.douban.com/people/"+".*"+"/"+"$");
		var result4=re1.exec(blockItem);
		if(!result4){
			alert("主页地址必须为“https://www.douban.com/people/xxxxxxxxxx/”\n请删除例如“?_dtcc=1”的后缀！")
			return;
		}
		blk=JSON.parse(localStorage.getItem("blk"));
		var listItem='<br /><div class="blockItem"><p class="blk">item</p><button data-index="{index}" class="del">删除</button></div><br />'.replace(/item/g,blockItem);
		if($.isEmptyObject(blk)){
			blk.push(blockItem)
			localStorage.setItem("blk", JSON.stringify([blockItem]));
			listItem=listItem.replace(/{index}/,"0")
		}
		else{
			blk.push(blockItem)
			localStorage.setItem("blk", JSON.stringify(blk));
			listItem=listItem.replace(/{index}/,blk.length-1)
		}
		$("#blockItem").val("");
		goto();
	})
	$("#addkeyword").on("click",function(){
		var blockItem=$("#blkword").val();
		if(!blockItem){
			alert("不能提交空白内容")
			return;
		}
		var re2 = new RegExp("https://www.douban.com/people/"+".*");
		var result5=re2.exec(blockItem);
		if(result5){
			alert("请勿输入主页地址！")
			return;
		}
		keyword=JSON.parse(localStorage.getItem("keyword"));
		var listItem='<br /><div class="blockItem"><p class="blk">item</p><button data-index="{index}" class="del0">删除</button></div><br />'.replace(/item/g,blockItem);
		if($.isEmptyObject(keyword)){
			keyword.push(blockItem)
			localStorage.setItem("keyword", JSON.stringify([blockItem]));
			listItem=listItem.replace(/{index}/,"0")
		}
		else{
			keyword.push(blockItem)
			localStorage.setItem("keyword", JSON.stringify(keyword));
			listItem=listItem.replace(/{index}/,blk.length-1)
		}
		$("#blkword").val("");
		goto();
	})
	$("#applyOnComment").on("click",function(){
		if ($("#applyOnComment")[0].checked) {
			apoc = 1;
		}
		else{
			apoc = 0;
		}
		localStorage.setItem("apoc", apoc);
		goto();
	})
	$("#Backup").on("click",function(){
		var a = JSON.parse(localStorage.getItem("blk"));
		var b = JSON.parse(localStorage.getItem("keyword"));
		var c = a.concat(b);
		$(".BackupContent").show();
		$("#BackupContent").html(JSON.stringify(c));
		goto();
	})
	$("#Restore").on("click",function(){
		$(".RestoreWindow").show();
	})
	$("#sync").on("click",function(){
		var b = $("#SyncData").val()
		var re1 = new RegExp("\\["+".*"+"\\]");
		var result4 = re1.exec(b);
		if(!result4){
			alert("请输入导出后复制的完整格式！（一定要带中括号\"[]\"！）\n例：[\"https://www.douban.com/people/xxxx/\",\"抽奖\"]")
			return;
		}
		else{
			var a = JSON.parse($("#SyncData").val())
			var re2 = new RegExp("https://www.douban.com/people/"+".*");
			blk=JSON.parse(localStorage.getItem("blk"));
			keyword=JSON.parse(localStorage.getItem("keyword"));
			a.forEach(function(itema){
				var result=re2.exec(itema)
				if(result){
					var i = 0
					blk.forEach(function(itemblk){
						if(itema == itemblk){
							i = 1;
						}
					})
					if (i == 0){
						blk.push(itema);
					}
				}
				else{
					var i = 0
					keyword.forEach(function(itemblk){
						if(itema == itemblk){
							i = 1;
						}
					})
					if (i == 0){
						keyword.push(itema);
					}
				}
			})
			localStorage.setItem("blk", JSON.stringify(blk));
			localStorage.setItem("keyword", JSON.stringify(keyword));
			$("#SyncData").val("");
			goto();
		}
	})
	var windowUrl = window.location.href;
	var topicre = /https:\/\/www.douban.com\/group\/topic\/*/;
	var groupre = /https:\/\/www.douban.com\/group\/*/;
	if( windowUrl.match(groupre)){
		if( windowUrl.match(topicre)){
			blk=JSON.parse(localStorage.getItem("blk"));
			keyword=JSON.parse(localStorage.getItem("keyword"));
			$("a").each(function(index,item){
				var href=$(item).attr("href");
				var title=$(item).attr("title");
				blk.forEach(function(blockItem){
					var re = new RegExp(".*"+blockItem+".*");
					var result1=re.exec(href);
					if(result1){
						$(item).closest(".comment-item").hide();
					}
				})
				keyword.forEach(function(blockItem){
					var re = new RegExp(".*"+blockItem+".*");
					var fix = new RegExp("真的要删除"+".*"+blockItem+".*"+"的发言");
					var result2=re.exec(title);
					var result3=fix.exec(title);
					if(result2&&!result3){
						$(item).closest("li").hide();
					}
				})
			})
			if(apoc == 1){
				$("p.reply-content").each(function(index,item){
					var reply = $(this).text();
					keyword.forEach(function(blockItem){
						var re = new RegExp(".*"+blockItem+".*");
						var result2=re.exec(reply);
						if(result2){
							$(item).closest(".reply-item").hide();
						}
					})
				})
			}
		}
		else{
			blk=JSON.parse(localStorage.getItem("blk"));
			keyword=JSON.parse(localStorage.getItem("keyword"));
			$("a").each(function(index,item){
				var href=$(item).attr("href");
				var title=$(item).attr("title");
				blk.forEach(function(blockItem){
					var re = new RegExp(".*"+blockItem+".*");
					var result1=re.exec(href);
					if(result1){
						$(item).closest("tr").hide();
					}
				})
				keyword.forEach(function(blockItem){
					var re = new RegExp(".*"+blockItem+".*");
					var result2=re.exec(title);
					if(result2){
						$(item).closest("tr").hide();
					}
				})
			})
		}
	}
})();