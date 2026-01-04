//================================自动运行  CNAS的订单都加急==================================//
function zidong_cnas(){
	console.log('自动cnas加急')
	setTimeout(function (){
		cnas加急_内部()
		zidong_cnas()
	},3000);
	cnas加急_内部()
	function cnas加急_内部(){
		//-------------------基因新管理---------
		var html_基因新订单=$('iframe[src="/geneNew/GeneNewOrderList.aspx"]').contents().find('body').eq(0) //基因新订单页面
		if(html_基因新订单.length===1){
			搜索信息='[aria-describedby=list_gene_new_remark]'
			公共_CNAS订单加急(html_基因新订单,搜索信息)
		}
		var html_PCR扩增=$('iframe[src="/geneNew/GeneNewSeqPcr.aspx"]').contents().find('body').eq(0) //PCR扩增页面
		if(html_PCR扩增.length===1){
			搜索信息='[aria-describedby=list_gene_new_p_remark]'
			公共_CNAS订单加急(html_PCR扩增,搜索信息)
		}
		var html_测序鉴定=$('iframe[src="/geneNew/GeneNewSeqIdentificate.aspx"]').contents().find('body').eq(0) //测序鉴定页面
		if(html_测序鉴定.length===1){
			搜索信息='[aria-describedby=list_gene_new_p_remark]'
			公共_CNAS订单加急(html_测序鉴定,搜索信息)
		}
		//----------------------合成管理-----------------合成纯化 合成烘干没有弄
		//合成订单页面
		var html=$('iframe[src="/syn/syn_order.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syno_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成费用页面
		var html=$('iframe[src="/syn/syn_jisuan_Money.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syno_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成样品页面
		var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成报告邮件页面
		var html=$('iframe[src="/syn/synBaoGaoEmailList.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syno_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//安排合成页面
		var html=$('iframe[src="/syn/synArrange.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成修饰页面
		var html=$('iframe[src="/syn/SynDecorate.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成氨解页面
		var html=$('iframe[src="/syn/SynAmmonoly.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成分装值页面
		var html=$('iframe[src="/syn/synDisopenValue.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//合成分装页面
		var html=$('iframe[src="/syn/SynDispen.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_syn_s_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//----------------------测序管理----------------- 报告生产 拼接状态  重新扩增未
		//模板浏览页面
		var html=$('iframe[src="/seq/seqTemplebrowse.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//订单管理页面
		var html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_seqo_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//测序样品页面
		var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//模板排版页面
		var html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//模板生产页面
		var html=$('iframe[src="/seq/SeqTemplate.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//反应生产页面
		var html=$('iframe[src="/seq/SeqReaction.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
		//样品补送页面
		var html=$('iframe[src="/seq/SeqSampleShortSend.aspx"]').contents().find('body').eq(0) 
		if(html.length===1){
			搜索信息='[aria-describedby=list_remark]'
			公共_CNAS订单加急(html,搜索信息)
		}
	}
}
		
//备注包含CNAS的行就标个颜色
function 公共_CNAS订单加急1111(html,搜索信息){
	var toolbar=html.find('.toolbar').eq(0)
	var table=html.find('table')
	html.find('table').find('tr').each(function(){
		备注信息=$(this).find(搜索信息)
		//如果有标记 则退出
		if(备注信息.hasClass('biaoji_cnas_jiaji')===true){
			return false
		}
		//加个标记
		备注信息.addClass('biaoji_cnas_jiaji')
		备注=$(this).find(搜索信息).text()
		if(备注.toUpperCase().indexOf('CNAS')!==-1){
			//设置背景颜色
			$(this).find('td').attr('Bgcolor','#CDE2F7')
		}
	})
}