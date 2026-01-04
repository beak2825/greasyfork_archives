function 基因返还(){
	console.log('新的基因返还界面')
	var local_查询返还单生成=localStorage.getItem('查询返还单生成');
	var html=$('iframe[src="/geneNew/GeneReturnList.aspx"]')//测序样品页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//添加 查询返还单生成 按钮
			if (local_查询返还单生成=='true'){
				toolbar.append('<button  id="button_fanhuandan_shengcheng" onclick="return false">查询返还单生成</button>')  //添加按钮
				//点击按钮执行如下函数
				toolbar.find('#button_fanhuandan_shengcheng').click(function(){
					toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
					//点击 qc已排版
					$('#w').find('#return_not_ids').click()
					setTimeout('$("#AB").click()', 100)
				})
			}
		}
	}
	
}

