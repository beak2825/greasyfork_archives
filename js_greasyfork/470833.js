function 自备引物(){
	console.log('新的自备引物界面')
	var local_在测序样品显示选择的引物=localStorage.getItem('在测序样品显示选择的引物');
	var html=$('iframe[src="/viporder/SeqCustPrimerList.aspx"]')//自备引物页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮()
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//在测序样品显示选择的引物  按钮
			if (local_在测序样品显示选择的引物=='true'){
				toolbar.append('<button id="show_primer_cexu" onclick="return false">在测序样品显示选择的引物</button>')
			}
			
			//点击 在测序样品显示选择的引物  按钮
			toolbar.find('#show_primer_cexu').click(function(){
				在测序样品显示选择的引物()
			})
			
		}
	}
	
	
	//把选择的行的引物在 测序样品查询出来
	function 在测序样品显示选择的引物(){
		if(html.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		selecteds=html.find('tbody').find("[aria-selected='true']")//.find('[aria-describedby=list_SeqCustPrimer_id]').text()
		var ids_shuzu = new Array();
		for (var i=0;i<selecteds.size();i++){
			id=selecteds.eq(i).find('[aria-describedby=list_SeqCustPrimer_id]').text()  //获取id
			id=id+"-z"//最后的引物位置
			ids_shuzu[i]=id
		}
		//如果 测序样品 页面是已经打开的
		if($('#tabs').find('li:contains(测序样品)').size()===1){
			//测序样品的html必须加个后缀或者前缀 不能和之前的重复
			var cexuyangpin_html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
			toolbar_cexuyangpin=cexuyangpin_html.find('.toolbar').eq(0)  // 找到了测序样品的toolbar工具栏
			toolbar_cexuyangpin.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='seqs_primer_id_2_kind']").attr('selected','selected')  //把找到的查询条件改成 引物位置
			$('#radd').next().attr('checked','true')  //选择 OR 选项
			for (var i=0;i<selecteds.size();i++){
				$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(i).val(ids_shuzu[i])
			}
			$("#AB").click()
			$('#tabs').find('li:contains(测序样品)').click()
		}
	}
}