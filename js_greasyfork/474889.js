function 客户管理(src){
	console.log('新的客户管理界面')
	var local_手机号查询姓名=localStorage.getItem('手机号查询姓名');
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
			if (local_手机号查询姓名=='true'){
				toolbar.append('<input type="text" id="text_shoujihao"  placeholder="部分手机号" size="10"/><button id="button_shoujihao" onclick="return false">查询手机号</button>')  //添加按钮
				toolbar.find('#text_shoujihao').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						toolbar.find('#button_shoujihao').click()
						return false
					}
				});
				//点击按钮执行如下函数
				toolbar.find('#button_shoujihao').click(function(){
					var iphone=toolbar.find('#text_shoujihao').eq(0).val()
					if(iphone!==""){
						toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
						$('#searchForm').eq(0).find("option[value='cust_mobile']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 手机号
						$('.searchOper:lt(1)').find("option[value='cn']").attr('selected','selected')  //条件改成包含
						$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(iphone)
						$("#AB").click()
					}
				})
			}
		}
	}
	
}

