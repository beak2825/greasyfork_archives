// ==UserScript==
// @name        Super Bawu
// @namespace   http://tieba.baidu.com
// @include     http://tieba.baidu.com/bawu2/*
// @exclude     http://tieba.baidu.com/bawu2/platform/listBlackUser*
// @exclude     http://tieba.baidu.com/bawu2/platform/listBawuDel*
// @version     1.4
// @description  吧务拉黑封禁功能增强
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/469/Super%20Bawu.user.js
// @updateURL https://update.greasyfork.org/scripts/469/Super%20Bawu.meta.js
// ==/UserScript==

;(function($){

	//会员列表封禁
	
	var block = {menber:0,blocked:0};
	var blockAjax = $.Deferred();
	
	$(".btn_group").each(function(){
		$(this).parent().prepend('<td><input type="checkbox"></td>');
	})
	.parents(".member_list_table")
	.append('<tfoot><td colspan="2">\
	<input id="check_all" type="checkbox" >全选</td>\
	<td class="right_cell" colspan="8">\
	<a id="block_all" class="ui_btn ui_btn_s" onclick="return false;"href="#">\
	<span><em>选中项加入黑名单</em></span></a></td></tfoot>')
	.find("th:first").before('<th></th>');

	blockAjax.done(function(e){
		var d = $("#page_message").text(e);
		d.css("marginLeft", - (d.outerWidth() / 2));
		d.animate({
		  top: 0
		}, 500).delay(3000).animate({
		  top: -39
		}, 500)
		.done(location.reload());	
	});
	
	function blockID(id){
		$.post("http://tieba.baidu.com/bawu2/platform/addBlack",{
			ie:"utf-8",
			tbs:unsafeWindow.PageData.user.tbs,
			user_id:id,
			word:$(".forum_list_name >a:first").text()
		})
		.done(function(){
			block.blocked += 1;
			if (block.menber === block.blocked){
				blockAjax.resolve('操作完成，本次共拉黑'+block.blocked+'人！');
				block.menber = 0;
				block.blocked = 0;
			}
		});	
	}	
		
	$("#check_all").click(function(){
		if(!$(this).data("all")){
			$("input[type='checkbox']").each(function() {
				$(this).prop("checked", true);
			})	
			$(this).data("all",1);
		}
		else{
			$("input[type='checkbox']").each(function() {
				$(this).prop("checked", false);
			})
			$(this).data("all",0);
		}
	})
	
	$("#block_all").click(function(){
		$("tbody input[type='checkbox']").each( function(){
			if($(this).attr("checked") === "checked"){
				block.menber += 1;
				blockID($(this).parents("tr").children(".btn_group").attr("id"));
			}
		});	
	});
	
	//用户封禁列表
	
	var bHTML = '<a id="block_check" class="ui_btn ui_btn_s"\
	onclick="return false;"href="#">\
	<span><em>选中项加入黑名单</em></span></a>\ ';
	$("#restoreChecked").before(bHTML);
	
	$("#block_check").click(function(){
		$("#dataTable tbody input[type='checkbox']").each(function(){
			if($(this).attr("checked") === "checked"){
				block.menber += 1;
				var userID = $(this).parent().parent().find(".ui_btn").data("user-id");
				blockID(userID);
			}
		});
	});
	
})(unsafeWindow.$);