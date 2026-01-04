function 基因QC(src){
	console.log('新的基因QC界面')
	var local_查询qc待处理_已排版=localStorage.getItem('查询qc待处理_已排版');
	var html=$('iframe[src="'+src+'"]')//页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//添加 查询qc待处理_已排版 按钮
			if (local_查询qc待处理_已排版=='true'){
				toolbar.append('<button  id="button_daichuli_yipaiban" onclick="return false">查询qc待处理_已排版</button>')  //添加按钮
				//点击按钮执行如下函数
				toolbar.find('#button_daichuli_yipaiban').click(function(){
					//点击 查询
					toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
					//点击 qc已排版
					$('#w').find('#qc_already_plate_ids').click()
					//组合方式改成 or
					$('#w').find('#radd').next().attr('checked','true')
					$('#searchForm').eq(0).find("option[value='qc_gnp_plate']").attr('selected','selected')  //把找到的第一个查询条件改成 板号
					$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('-1')
					setTimeout('$("#AB").click()', 100)
				})
			}
		}
	}
	
}

