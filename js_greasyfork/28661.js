// ==UserScript==
// @name        NexusHD System Award
// @improvedBy  AsukaSong
// @description 发米脚本
// @include     http*://www.nexushd.org/forums.php?action=viewtopic*
// @icon        http://www.nexushd.org/favicon.ico
// @run-at      document-end
// @version     0.1.2
// @namespace https://greasyfork.org/users/111695
// @downloadURL https://update.greasyfork.org/scripts/28661/NexusHD%20System%20Award.user.js
// @updateURL https://update.greasyfork.org/scripts/28661/NexusHD%20System%20Award.meta.js
 // ==/UserScript==

(function($) {
$('a[href^="?action=quotepost"]').before('<div class=award style="float:left"></div>');
var $select = $('<input type="button" value="-500"  class="btn select"/><input type="button" value="+500"  class="btn select"/>&nbsp&nbsp<input type="text" size=8 class=bonusgift />&nbsp<label>Reason</label>&nbsp<input type="text" class="reason" />&nbsp<input type="button" value="bonus"  class="btn" />');

$('.award').append($select);
$('.award >.btn').click(function(){

	$username=$(this).parent().parent().parent().parent().parent().prev().find('.nowrap b').get(0).innerHTML;
	//alert($username);
	$userid=$(this).parent().parent().parent().parent().parent().prev().find('.nowrap a').attr('href').match(/(\d+)$/)[1];
	//alert($userid);
	$operator=$('.bottom>.medium>.nowrap').find('b').get(0).innerHTML;
	//alert($operator);
	if($(this).attr('value')!='bonus'){
		$bonusgift=$(this).attr('value');
		$reason=$(this).parent().children('.reason').get(0).value;
	}else{
		$bonusgift=$(this).prev().prev().prev().val();
		$reason=$(this).prev().val();
	}
	
	var url=$(this).parent().next().get(0);
	var regExp=/postid=(\d+)$/;
	regExp.exec(url);
	var $postid=RegExp.$1;
	
	
	if($bonusgift>0){
		$transferalert="bonus已经发送，即将发送站内信";
		$pmsubject="somebody loves you";
		$pmcontent="You received "+$bonusgift+" bonus from system ,operator: "+$operator;
		if($reason!=""){
			$pmcontent+=" , reason: "+$reason+".";
		}else{
			//$pmcontent+".";
		}
		$pmalert="发米成功，并且已经发送站内信给"+$username;
		$comment='\n[quote]此贴已被'+$operator+'评分  赠送'+$username+" "+$bonusgift+'个魔力值';
		if($reason!=""){
			$comment+=",原因: "+$reason+".[/quote]";
		}else{
			$comment+=".[/quote]";
		}
	}else{
		$transferalert="bonus已经扣除，即将发送站内信";
		$pmsubject="Your bonus has decreased";
		$pmcontent="Your bonus has decreased by "+(-$bonusgift)+" ,operator: "+$operator;
		if($reason!=""){
			$pmcontent+=" , reason: "+$reason+".";
		}else{
			//$pmcontent+".";
		}
		$pmalert="扣米成功，并且已经发送站内信给"+$username;
		$comment='\n[quote]此贴已被'+$operator+'评分  扣除'+$username+" "+(-$bonusgift)+'个魔力值';
		if($reason!=""){
			$comment+=",原因: "+$reason+".[/quote]";
		}else{
			$comment+=".[/quote]";
		}
	}
	$.ajax({
				type:"POST",
				url:"amountbonus.php",
				timeout: 20000,
				error: function(){alert("出错啦！");},
				data: "seedbonus="+$bonusgift+"&username="+$username,
				success: function(msg)
				{   
					reg=/denied/;
					if(reg.test(msg)){
						alert("别乱搞，权限不足");
					}else{
						alert($transferalert);
						$.get('forums.php?action=editpost&postid='+$postid,function(data){
						
						$rawcontent=data.match(/<textarea.*>([\s\S]*)<\/textarea>/)[1];
						$content=$rawcontent+$comment;
			//alert("aaa");
						$.ajax({
							type:"POST",
							url:"forums.php?action=post",
							timeout:20000,
							error:function(){alert("出错啦！");},
							data:"body="+$content.replace(/&amp;/g, "%26")+"&id="+$postid+"&type=edit&color=0&font=0&size=0",
							success:function(){
									$.ajax({
										type:"POST",
										url:"takemessage.php",
										timeout:20000,
										error:function(){alert("出错啦！");},
										data:"body="+$pmcontent+"&subject="+$pmsubject+"&color=0&font=0&size=0&save=yes&receiver="+$userid,
										success:function(){
											alert($pmalert);
										}	
									});
								}		
						});
						});
					}
				}
			});	
});
})(jQuery);