//已经显示后台后执行
function sgt_login_bg(){
	切换用户()
	//cnas加急
	var local_cnas加急 = localStorage.getItem('CNAS加急');
	//客户自己上传订单的话，待核订单 显示颜色，10分钟查询一次
	//setTimeout(function(){kehu_shenhe()}, 3000 )
	var 当前用户名=$('#curname',window.parent.document).text()
	if(当前用户名==='申高天' || 当前用户名==='冯丽丽'  ){
		setInterval(function(){kehu_shenhe()},1000*60*3) 
	}
	
	//点击左侧的列的时候  
	$("#lnav").find('li').click(function(){
		//如果有 系统提示 默认点击确定
		if ($("[class='panel window messager-window']").length==1){
			$("[class='panel window messager-window']").find('.l-btn').click()
		}
		
		//根据点击的名称，运行iframe里面的函数
		tabs_对象={
			客户管理:客户管理,
			订单管理:订单管理,
			测序样品:测序样品,
			样品补送:样品补送,
			课题组管理:课题组管理,
			自备引物:自备引物,
			合成订单:合成订单,
			合成样品:合成样品,
			测序文件:测序文件,
			基因返还:基因返还,
			基因QC:基因QC,
			基因新订单:基因新订单,
			PCR扩增:PCR扩增,
			测序鉴定:测序鉴定,
			合成费用:合成费用,
			合成订单完成:合成订单完成,
			合成入财务:合成入财务,
			合成报告邮件:合成报告邮件,
			安排合成:安排合成,
			合成修饰:合成修饰,
			合成氨解:合成氨解,
			合成分装值:合成分装值,
			合成分装:合成分装,
			模板浏览:模板浏览,
			模板排版:模板排版,
			模板生产:模板生产,
			反应生产:反应生产,
			样品补送:样品补送,
			测序入财务:测序入财务,
			库存管理:库存管理
		};
		
		iframe_text=$(this).find('span').eq(1).text()
		iframe_src=$(this).find('a').eq(0).attr('rel')
		//如果点击的不是 tabs_对象 里面的keys其中的一个，则退出
		if (Object.keys(tabs_对象).indexOf(iframe_text)==-1){
			return false
		}
		var html=$('iframe[src="'+iframe_src+'"]').get(0)//页面
		//点击 标题，让高度合适
		$('#tabs').on('click','li:contains('+iframe_text+')',function(){gaodu(html)})
		//运行iframe
		html.onload=function(){
			tabs_对象[iframe_text](iframe_src)
			if (local_cnas加急=='true'){
				cnas加急(html)
			}
		}
	})
	
	function cnas加急(html){
		//CNAS加急
		html_内容=$(html).contents().find('body').eq(0)
		//-------------------基因新管理---------
		if (iframe_text=='基因新订单'){
			搜索信息='[aria-describedby=list_gene_new_remark]'
		}else if(iframe_text=='PCR扩增' || iframe_text=='测序鉴定'){
			搜索信息='[aria-describedby=list_gene_new_p_remark]'
		}
			//----------------------合成管理-----------------合成纯化 合成烘干没有弄
		else if(iframe_text=='合成订单' || iframe_text=='合成费用' || iframe_text=='合成报告邮件'){
			搜索信息='[aria-describedby=list_syno_remark]'
		}else if (iframe_text=='合成样品' || iframe_text=='安排合成' || iframe_text=='合成修饰' || iframe_text=='合成氨解' ||iframe_text=='合成分装值' || iframe_text=='合成分装'){
			搜索信息='[aria-describedby=list_syn_s_remark]'
		}
		//----------------------测序管理----------------- 报告生产 拼接状态  重新扩增未
		else if(iframe_text=='模板浏览' || iframe_text=='测序样品' || iframe_text=='模板排版' || iframe_text=='模板生产' || iframe_text=='反应生产' || iframe_text=='样品补送'){
			搜索信息='[aria-describedby=list_remark]'
		}else if(iframe_text=='订单管理'){
			搜索信息='[aria-describedby=list_seqo_remark]'
		}
		公共_CNAS订单加急(html_内容,搜索信息)
	}
}

//当有新文件的时候看看这里面，如果有则删除
function PCR扩增(){}
function 测序鉴定(){}
function 合成报告邮件(){}
function 合成修饰(){}
function 合成氨解(){}
function 合成分装值(){}
function 合成分装(){}


//客户自己上传订单的话，显示颜色
function kehu_shenhe(){
	if ($('.footer').find('#daishenhe').length==0){
		$('.footer').prepend('<span id="daishenhe" style="color:red;font-size:20px"></span>')
	}
	//测序管理的  会员订单审核
	$.get("/seq/ashx/seqOrderwaitAduitHandler.ashx?_search=false&nd=1625315015855&rows=20&page=1&sidx=seqo_id&sord=desc&filters=",
		function (data,status) {
			geshu=data.match(/(totalrecords":")(.*?)(?=","gridda)/)[0].substr(15)
			if(geshu!="0"){
				$('a[rel="/seq/seqOrderwaitAduitList.aspx"]').eq(0).parent().parent().css('background','yellowgreen')
				$('#daishenhe').text('会员订单审核 有待审核订单')
			}else{
				$('a[rel="/seq/seqOrderwaitAduitList.aspx"]').eq(0).parent().parent().css('background','')
				$('#daishenhe').text('')
			}
			
		});
	//会员管理的  待核订单
	$.get("/viporder/ashx/VipOrderWaitAduitHandler.ashx?_search=false&nd=1694163724522&rows=20&page=1&sidx=vip_order_id&sord=desc&filters=",
		function (data,status) {
			geshu=data.match(/(totalrecords":")(.*?)(?=","gridda)/)[0].substr(15)
			if(geshu!="0"){
				$('a[rel="/viporder/VipOrderWaitAduitList.aspx"]').eq(0).parent().parent().css('background','yellowgreen')
				$('#daishenhe').text($('#daishenhe').text()+'    会员管理 有待核订单')
			}else{
				$('a[rel="/viporder/VipOrderWaitAduitList.aspx"]').eq(0).parent().parent().css('background','')
				$('#daishenhe').text($('#daishenhe').text()+'')
			}
		});
}