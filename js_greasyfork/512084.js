function 库存管理(src){
	console.log('新的库存管理界面')
	var local_仓库包含测序_出库=localStorage.getItem('仓库包含测序_出库');
	var html=$('iframe[src="'+src+'"]')//页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			if(local_仓库包含测序_出库=='true'){
				toolbar.append('<button id="button_chaxun_cangku_baohan_cexu" onclick="return false">查询仓库包含测序</button>')
				toolbar.append('<button id="button_cangku_baohan_cexu_chuku" onclick="return false">仓库包含测序_出库</button>')
				//点击 查询仓库包含测序 按钮
				toolbar.find('#button_chaxun_cangku_baohan_cexu').click(function(){
					查询仓库包含测序()
				})
				//点击 仓库包含测序_出库  按钮   
				toolbar.find('#button_cangku_baohan_cexu_chuku').click(function(){
					仓库包含测序_出库()
				})
			}
		}
	}
	function 查询仓库包含测序(){
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='store_name']").attr('selected','selected')  //把找到的第一个查询条件改成 仓库
		$('.searchOper:lt(1)').find("option[value='cn']").attr('selected','selected')  //条件改成包含
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('测序')
		$("#AB").click()
	}
	function 仓库包含测序_出库(){
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		selecteds.each(function(){
			//选中该行
			$(this).click()
			if($(this).attr("aria-selected")=="false"){
				$(this).click()
			}
			//如果选择了改行
			if($(this).attr("aria-selected")=="true"){
				入库数量=$(this).find('[aria-describedby=list_store_put_amount]').text() 
				toolbar.find("[class='l-btn-text icon-arrow_switch_bluegreen']").eq(0).click();
				$('#txt_store_requit_prod_amount').eq(0).val(入库数量)
				$('#d').find("#AB").eq(0).click()
			}
		})
	}
}

