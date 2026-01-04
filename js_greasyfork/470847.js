function 合成样品(){
	console.log('新的合成样品界面')
	var local_判断是否是测序引物=localStorage.getItem('判断是否是测序引物');
	var local_查询同序列引物=localStorage.getItem('查询同序列引物');
	var local_查询订单号=localStorage.getItem('查询订单号');
	var local_查询打印修饰HPLC标签=localStorage.getItem('查询打印修饰HPLC标签');
	var html=$('iframe[src="/syn/SynSample.aspx"]')//合成样品页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮()
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//判断是否是测序引物
			if (local_判断是否是测序引物=='true'){
				toolbar.append('<button  id="button_is_cexuyinwu" onclick="return false">判断是否是测序引物</button>')  //添加按钮
				toolbar.find('#button_is_cexuyinwu').click(function(){
					hecheng_is_cexuyinwu()
				})
			}
			//查询同序列引物
			if (local_查询同序列引物=='true'){
				toolbar.append('<button  id="button_find_tong_xulie" onclick="return false">查询同序列引物</button>')  //添加按钮
				toolbar.find('#button_find_tong_xulie').click(function(){
					hecheng_tong_xulie()
				})
			}
			//查询选择订单号的订单
			if (local_查询订单号=='true'){
				toolbar.append('<button  id="button_find_dingdanhao" onclick="return false">查询订单号</button>')  //添加按钮
				toolbar.find('#button_find_dingdanhao').click(function(){
					hecheng_find_dingdanhao()
				})
			}
			//查询打印修饰标签
			if(local_查询打印修饰HPLC标签=='true'){
				toolbar.append('<button  id="button_chaxun_xiushi" onclick="return false">查询修饰HPLC</button>')  //添加按钮
				toolbar.append('<button  id="button_dayin_xiushi_biaoqian" onclick="return false">打印修饰HPLC标签</button>')  //添加按钮
				toolbar.find('#button_chaxun_xiushi').click(function(){
					hecheng_chaxun_xiushi()
				})
				toolbar.find('#button_dayin_xiushi_biaoqian').click(function(){
					hecheng_dayin_xiushi_biaoqian()
				})
			}
		}
	}
	
	//合成样品 判断是否是测序引物  从 合成订单  合成费用  出库 完成  入财务都查一下
	function hecheng_is_cexuyinwu(){
		var selecs=html.find('tbody').eq(0).find("[aria-selected='true']")  //选择选中的行	
		if(selecs.length===0){
			return false
		}
		selecs.each(function(){
			var each_duixiang=$(this)
			var hecheng_dingdanhao=$(this).find('[aria-describedby=list_syn_s_order]').eq(0).text()
			for(var i=1;i<=5;i++){
				if(i===1){
					//在 合成订单找
					var tijiao="/syn/ashx/SynOrderHandler.ashx?_search=true&nd=1631714310616&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
				}else if(i===2){
					var tijiao="/syn/ashx/Syn_jisuan_moneyHandler.ashx?_search=true&nd=1631720231655&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
				}else if(i===3){
					var tijiao="/syn/ashx/SynOrderOutHandler.ashx?_search=true&nd=1631721204479&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
				}else if(i===4){
					var tijiao="/syn/ashx/SynOrderCompleteHandler.ashx?_search=true&nd=1631722322368&rows=100&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
				}else if(i===5){
					var tijiao="/syn/ashx/SynOrderToFinaceHandler.ashx?_search=true&nd=1631722400048&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
				}
				
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.get(tijiao,
					function (data) {
						//先截取订单号
						 var ding=data.substring(data.indexOf('syno_id":"') + 10,data.indexOf('","cust_id"'))
						 if(ding===hecheng_dingdanhao){
							 var beizhu=data.substring(data.indexOf('syno_remark":"') + 14,data.indexOf('","syno_add_people'))
							 //说明备注里面包含 测序引物 四个字
							 if(beizhu.indexOf('测序引物')!==-1){
								 var dingdanhao_dangtian=each_duixiang.find('td[aria-describedby=list_syn_s_order]')
								 dingdanhao_dangtian.attr('title',beizhu)
								 dingdanhao_dangtian.css('color','red')
								 i=5
							 }else{
								 var dingdanhao_dangtian=each_duixiang.find('td[aria-describedby=list_syn_s_order]')
								 dingdanhao_dangtian.attr('title',beizhu)
								 i=5
							 }
						 }
					});
			}
		})
		
	}
	
	//合成样品  查询同序列所有引物
	function hecheng_tong_xulie(){
		var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行
		if(selec.length===0){return false}
		var hecheng_xulie=selec.find('[aria-describedby=list_syn_s_seq]').eq(0).text()
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='syn_s_seq']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 序列
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(hecheng_xulie)
		$("#AB").click()
	}
	//合成样品 查询选择订单号的订单
	function hecheng_find_dingdanhao(){
		var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行
		if(selec.length===0){
			return false
		}
		var hecheng_dingdanhao=selec.find('[aria-describedby=list_syn_s_order]').eq(0).text()
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='syn_s_order']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户名
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(hecheng_dingdanhao)
		$("#AB").click()
	}
	//查询修饰HPLC
	function hecheng_chaxun_xiushi(){
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='syn_s_pur']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 纯化方式
		//$('#searchForm').eq(0).find("option[value='ne']").eq(0).attr('selected','selected')  //把找到的第一个查询方式改成 不等于
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('HPLC')
		$("#AB").click()
	}
	//打印修饰HPLC标签
	function hecheng_dayin_xiushi_biaoqian(){
		var selects=html.find('tbody').eq(0).find("[aria-selected='true']")
		if(selects.size()==0){return false}
		res="<NewDataSet>"
		selects.each(function(){
			for(var i=1;i<=2;i++){
				res+="<Table1>"
				生产编号=$(this).find('[aria-describedby=list_syn_s_num]').eq(0).text() //生产编号
				res+="<shengchanbianhao>"+生产编号+"</shengchanbianhao>"
				板号=$(this).find('[aria-describedby=list_syn_s_palte]').text() //板号
				res+="<banhao>"+板号+"</banhao>"
				孔号=$(this).find('[aria-describedby=list_syn_s_hole]').text() //孔号
				res+="<konghao>"+孔号+"</konghao>"
				修饰=$(this).find('[aria-describedby=list_syn_s_decorate]').text() //修饰
				res+="<xiushi>"+修饰+"</xiushi>"
				OD总量=$(this).find('[aria-describedby=list_syn_s_od]').text() //OD总量
				单管量=$(this).find('[aria-describedby=list_syn_s_od_tube]').text() //单管量
				res+="<od>"+OD总量+"("+单管量+")"+"</od>"
				res+="</Table1>"
			}
		})
		res+="</NewDataSet>"
		
		//生产编号
		生产编号_arr=selects.map(function(key,item){
			return $(item).find('[aria-describedby=list_syn_s_num]').text()
		}) 
		
		保存文本到本地(res,'down.html')
	}
	//保存文本到本地
	function 保存文本到本地(text, filename){
		// 创建一个Blob实例，类型为纯文本
		    var blob = new Blob([text], { type: 'text/plain' });
		 
		    // 创建一个指向Blob对象的URL
		    var url = URL.createObjectURL(blob);
		 
		    // 创建一个a标签
		    var a = document.createElement("a");
		 
		    // 设置a标签属性
		    a.href = url;
		    a.download =filename;
		 
		    // 模拟a标签点击，触发下载
		    document.body.appendChild(a);
		    a.click();
		 
		    // 清理临时DOM和对象URL
		    document.body.removeChild(a);
		    URL.revokeObjectURL(url);
			window.open('http://localhost/xiushiYinwuBiaoqian/print.html')
	}
}