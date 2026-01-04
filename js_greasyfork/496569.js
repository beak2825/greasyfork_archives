function 样品补送(src){
	console.log('新的样品补送界面')
	var local_打印样品标签=localStorage.getItem('打印样品标签');
	var local_标颜色引物已清或不足=localStorage.getItem('标颜色引物已清或不足');
	var html=$('iframe[src="'+src+'"]')//页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//改成每页100个数据
			html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('100')
			
			//点击 打印样品标签 按钮
			if (local_打印样品标签 == 'true'){
				toolbar.append('<button id="button_print_ypbq" onclick="return false">打印样品标签</button>')
			}
			
			//标颜色引物已清或不足
			if (local_标颜色引物已清或不足 == 'true'){
				toolbar.append('<button id="button_show_yinwu_yiqing_buzu" onclick="return false">查询引物已清或不足</button>')
				toolbar.append('<button id="button_color_yinwu_yiqing_buzu_qian" onclick="return false">当前页标颜色引物已清或不足(12点前)</button>')
				toolbar.append('<button id="button_color_yinwu_yiqing_buzu_hou" onclick="return false">当前页标颜色引物已清或不足(12点后)</button>')
			}
			
			//点击 打印样品标签 按钮
			toolbar.find('#button_print_ypbq').click(function(){
				打印样品标签()
			})
			//点击  查询引物已清或不足 按钮
			toolbar.find('#button_show_yinwu_yiqing_buzu').click(function(){
				函数_查询引物已清或不足()
			})
			//点击  标颜色引物已清或不足(12点前) 按钮
			toolbar.find('#button_color_yinwu_yiqing_buzu_qian').click(function(){
				当天时间=getday_y_n()
				函数_标颜色引物已清或不足(当天时间)
			})
			//点击  标颜色引物已清或不足(12点后) 按钮
			toolbar.find('#button_color_yinwu_yiqing_buzu_hou').click(function(){
				昨天时间=getday_y_n('yestday')
				console.log(昨天时间)
				函数_标颜色引物已清或不足(昨天时间)
			})
		}
	}
	
	//打印样品标签
	function 打印样品标签(){
		selecteds=table.find('tbody').find("[aria-selected='true']")
		if (selecteds.size()==0){return false}
		res="<NewDataSet>"
		selecteds.each(function(){
			shengchanbianhao=$(this).find('[aria-describedby=list_undefined]').text() //生产编号
			kehu_xingming=$(this).find('[aria-describedby=list_seqo_cust_name]').text()  //客户姓名
			yangpinbianhao=$(this).find('[aria-describedby=list_seqs_sam_num]').text() //样品编号
			yangpinleixing=$(this).find('[aria-describedby=list_seqs_sam_type]').text() //样品类型
			res+="<Table1>"
			res+="<seqs_prod_id>"+shengchanbianhao+"</seqs_prod_id>"
			res+="<seqo_cust_name>"+kehu_xingming+"</seqo_cust_name>"
			res+="<seqs_sam_num>"+yangpinbianhao+"</seqs_sam_num>"
			res+="<seqs_ant_type />"
			res+="<seqs_sam_type>"+'质粒'+"</seqs_sam_type>"
			res+="<seqs_fragment_size />"
			当天日期=getday_y_n('---')
			res+="<seqo_send_sample_time>"+当天日期+"T18:47:08+08:00</seqo_send_sample_time>"
			res+="</Table1>"
		})
		res+="</NewDataSet>"
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
			window.open('http://localhost//打印/print.html')
	}
	
	//查询引物已清或不足
	function 函数_查询引物已清或不足(){
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqs_complete']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 完成情况
		$('.searchOper:lt(14)').find("option[value='cn']").attr('selected','selected')  //查询方式前14个变成包含
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('引物')
		$("#AB").click()
	}
	//函数_标颜色引物已清或不足
	function 函数_标颜色引物已清或不足(年月日){
		姓名_arr=[]
		引物_arr=[]
		//循环每一个tr
		table.find('tbody').find("tr").each(function(){
			姓名=$(this).find('[aria-describedby=list_seqo_cust_name]').text()  //客户姓名
			姓名_arr.push(姓名)
			引物=$(this).find('[aria-describedby=list_seqs_primer]').text()  //引物
			引物_arr.push(引物)
		})
		arr=两个数组去重(姓名_arr,引物_arr)
		姓名_去重后_arr=arr[0]
		引物_去重后_arr=arr[1]
		//如果去重后长度为0 则提示没有
		if (姓名_去重后_arr.length == 0){
			alert('没有已清的引物')
			return false
		}
		//循环
		
		for(var i=0;i<姓名_去重后_arr.length;i++){
			console.log(i)
			姓名=姓名_去重后_arr[i]
			引物=引物_去重后_arr[i]
			sleep(500)
			//测序样品搜 添加时间=年月日 and 客户名=姓名 and 测序引物=引物 如果这都搜不到，就不用再次访问了。
			url='/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1732194359277&rows=10&page=1&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_add_time","op":"eq","data":"'+年月日+'"},{"field":"seqo_cust_name","op":"eq","data":"'+姓名+'"},{"field":"seqs_primer","op":"eq","data":"'+引物+'"}]}'
			总条数= parseInt(网址_获取总条数(url))
			if (总条数==0){
				continue
			}
			sleep(500)
			//测序样品搜 添加时间=年月日 and 客户名=姓名 and 测序引物=引物 and ( 引物浓度包含P 或 引物浓度包含干粉)  分成2次访问
			url='/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1732194359277&rows=10&page=1&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_add_time","op":"eq","data":"'+年月日+'"},{"field":"seqo_cust_name","op":"eq","data":"'+姓名+'"},{"field":"seqs_primer","op":"eq","data":"'+引物+'"},{"field":"seqs_observe","op":"cn","data":"P"}]}'
			总条数= parseInt(网址_获取总条数(url))
			
			if (总条数==0){
				sleep(500)
				//测序样品搜 添加时间=年月日 and 客户名=姓名 and 测序引物=引物 and  引物浓度包含干粉)  分成2次访问
				url='/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1732194359277&rows=10&page=1&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_add_time","op":"eq","data":"'+年月日+'"},{"field":"seqo_cust_name","op":"eq","data":"'+姓名+'"},{"field":"seqs_primer","op":"eq","data":"'+引物+'"},{"field":"seqs_observe","op":"cn","data":"干粉"}]}'
				总条数=网址_获取总条数(url)
				sleep(500)
			}
			console.log('总条数',总条数)
			if (总条数>0){
				table.find('tbody').find("tr").each(function(){
					tr_姓名=$(this).find('[aria-describedby=list_seqo_cust_name]').text()  //客户姓名
					tr_引物=$(this).find('[aria-describedby=list_seqs_primer]').text()  //引物
					if (tr_姓名==姓名 && tr_引物==引物){
						$(this).find('[aria-describedby=list_seqs_primer]').attr('Bgcolor','#AeEEe7')  //引物标颜色
						$(this).find('[aria-describedby=list_seqs_observe]').attr('Bgcolor','#AeEEe7') //引物浓度标颜色
					}
				})
			}
			
		}
		alert('完毕')
	}
}

