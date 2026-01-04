function 合成费用(src){
	console.log('新的合成费用界面')
	var local_不干胶式_备注带缺和不带缺=localStorage.getItem('不干胶式_备注带缺和不带缺');
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
			if(local_不干胶式_备注带缺和不带缺=='true'){
				送货单按钮=toolbar.find('#a_orderToCustmer').eq(0)
				//点击送货单按钮
				送货单按钮.click(function(){
					不干胶式_备注带缺和不带缺(html)
				})
			}
		}
	}
	
	
	//不干胶式_备注带缺和不带缺
	function 不干胶式_备注带缺和不带缺(html){
		//弹框加个按钮
		$('#uiform').find('#print_synBDT').parent().append('<button id="button_buganjiaoshi_bubaohan_que" onclick="return false">不干胶式_备注不包含缺</button>')
		$('#uiform').find('#print_synBDT').parent().append('<button id="button_buganjiaoshi_baohan_que" onclick="return false">不干胶式_备注包含缺</button>')
		//点击不干胶式_备注不包含缺按钮
		$('#uiform').find('#button_buganjiaoshi_bubaohan_que').click(function(){
			不干胶式_备注包不包含缺_详细代码(html,'不包含缺')
		})
		//点击不干胶式_备注包含缺按钮
		$('#uiform').find('#button_buganjiaoshi_baohan_que').click(function(){
			不干胶式_备注包不包含缺_详细代码(html,'包含缺')
		})
	}
	function 不干胶式_备注包不包含缺_详细代码(html,tag){
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		dingdanhao_arr_str=''
		selecteds.each(function(){
			dingdanhao=$(this).find('[aria-describedby=list_syno_id]').text() 	//订单号
			beizhu=$(this).find('[aria-describedby=list_syno_remark]').text() 	//备注
			if (tag == '不包含缺'){
				//如果备注没有找到缺
				if (beizhu.indexOf('缺')==-1){
					dingdanhao_arr_str=dingdanhao_arr_str+dingdanhao+','
				}
			}
			if (tag == '包含缺'){
				//如果备注找到缺
				if (beizhu.indexOf('缺')!==-1){
					dingdanhao_arr_str=dingdanhao_arr_str+dingdanhao+','
				}
			}
			
		})
		console.log(dingdanhao_arr_str)
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get('/syn/xmldata/xmlSynStoreOut.aspx?order='+dingdanhao_arr_str+'&style=buganjiao',function(data){
			console.log(data)
			if(tag == '不包含缺'){
				保存文本到本地(data,'down.html','http://localhost/buganjiaoBiaoqian/print_bubaohanque.html')
			}
			if(tag == '包含缺'){
				//把缺全部改成补
				data=str_replaceAll(data,'缺','补')
				保存文本到本地(data,'down.html','http://localhost/buganjiaoBiaoqian/print_baohanque.html')
			}
		     // 客户名_arr=文本_取中间文本_批量(data,'"cust_name":"','","')
			
		 }); 
	}
	
	//保存文本到本地
	function 保存文本到本地(text, filename,bendi_url){
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
		window.open(bendi_url)
	}
	//字符串全部替换部分文本
	function str_replaceAll(str, yuanwenben, xianwenben) {
	  return str.replace(new RegExp(yuanwenben, 'g'), xianwenben);
	}
}

