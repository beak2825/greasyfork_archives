function 模板排版(src){
	console.log('新的模板排版界面')
	var local_同客户名样品个数样品名提示=localStorage.getItem('同客户名样品个数样品名提示');
	var local_模板排版标签_样品名占两行=localStorage.getItem('模板排版标签_样品名占两行')
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
			if(local_同客户名样品个数样品名提示=='true'){
				//点击添加板号
				添加板号=toolbar.find('#a_seq_plate').eq(0)
				添加板号.click(function(){
					模板确定按钮	=$('#w').find('#AB').eq(0)
					//点击模板确定按钮 会弹出 设置模板板号 弹框
					模板确定按钮.click(function(){
						同客户名样品个数样品名进行提示(html)
					})
				})
			}
			if(local_模板排版标签_样品名占两行=='true'){
				模板BDT按钮=toolbar.find('#a_SeqTempleBDT').eq(0)
				//点击模板BDT按钮
				模板BDT按钮.click(function(){
					函数_模板排版样品名占两行()
				})
			}
			
		}
	}
	
	//同客户名样品个数样品名进行提示
	function 同客户名样品个数样品名进行提示(html){
		//$('#d').find('#AB').eq(0).attr('disabled','disabled')
		//获取选择行的第一行
		选择的第一行=table.find('tbody').find("[aria-selected='true']").eq(0)
		客户姓名=选择的第一行.find('[aria-describedby=list_seqo_cust_name]').text()
		订单号_arr=[]
		客户名_arr=[]
		样品编号_arr=[]
		url='/seq/ashx/SeqTemplePlateHandler.ashx?_search=true&nd=1722424701311&rows=300&page=1&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqo_cust_name","op":"eq","data":"'+客户姓名+'"}]}'
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get(url,function (data) {
			总页数=文本_取中间文本(data,'totalpages":"','"')
			订单号_arr=订单号_arr.concat(文本_取中间文本_批量(data,'"seqo_order_id":"','"'))
			客户名_arr=客户名_arr.concat( 文本_取中间文本_批量(data,'"seqo_cust_name":"','"'))
			样品编号_arr=样品编号_arr.concat( 文本_取中间文本_批量(data,'"seqs_sam_num":"','"'))
			if (总页数 !== '1'){
				for (i=2;i<=parseInt(总页数);i++){
					time.sleep(2000)
					url_new=url.replace('page=1','page='+i)
					$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
					$.get(url,function (data) {
						订单号_arr=订单号_arr.concat(文本_取中间文本_批量(data,'"seqo_order_id":"','"'))
						客户名_arr=客户名_arr.concat( 文本_取中间文本_批量(data,'"seqo_cust_name":"','"'))
						样品编号_arr=样品编号_arr.concat( 文本_取中间文本_批量(data,'"seqs_sam_num":"','"'))
						订单号_arr.concat(订单号_arr)
						客户名_arr.concat(客户名_arr)
						样品编号_arr.concat(样品编号_arr)
					})
				}
			}
		});
		去重后_订单号_arr=quchong_arr(订单号_arr)
		new_样品编号_arrs=[]
		for(var i=0;i<去重后_订单号_arr.length;i++){
			new_样品编号_arr=[]
			for(var j=0;j<订单号_arr.length;j++){
				if (订单号_arr[j] == 去重后_订单号_arr[i]){
					new_样品编号_arr.push(样品编号_arr[j])
				}
			}
			new_样品编号_arrs.push(new_样品编号_arr)
		}
		console.log(new_样品编号_arrs)
		//比对数组是否有完全一样的
		res=比对数组(new_样品编号_arrs)
		if (res){
			alert('有样品名完全一样的两张订单')
		}
	}
	
	function 比对数组(arrays) {
	  for(var i=0;i<arrays.length;i++){
		  for(var j=i+1;j<arrays.length;j++){
			   // 检查两个数组是否相等
			  if (比对数组_详细代码(arrays[i], arrays[j])) {
				  return true; // 找到了相同的数组
			  }
		  }
	  }
	  return false
	}
	
	function 比对数组_详细代码(arr1,arr2){
		// 如果长度不同，返回false
		 if (arr1.length !== arr2.length) {
			 return false; 
		 }
		// 比较数组中的每个元素
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]){
				return false;
			} 
		}
		return true
	}
	
	//函数_模板排版样品名占两行()
	function 函数_模板排版样品名占两行(){
		//弹框加个按钮
		$('#uiform').find('#txt_SeqTempleBDT_banhao').parent().append('<button id="button_yangpinming_zhanlianghang" onclick="return false">样品名占两行</button>')
		//添加个文本框 ，用于存储 文件编号 手动输入
		$('#uiform').find('#txt_SeqTempleBDT_banhao').parent().append('<input type="text" id="txt_wenjianbianhao" value="RZXK-QR-108" placeholder="文件编号">')
		//点击样品名占两行按钮
		$('#uiform').find('#button_yangpinming_zhanlianghang').click(function(){
			函数_样品名占两行_详细代码()
		})
	}
	//函数_模板排版样品名占两行()
	function 函数_样品名占两行_详细代码(){
		板号=$('#uiform').find('#txt_SeqTempleBDT_banhao').val()
		if (板号 == ''){
			return 
		}
		操作人=$('#curname').text()
		文件编号=$('#uiform').find('#txt_wenjianbianhao').val()
		$.get('/seq/xmldata/SeqReportDataProviderHandler.ashx?action=SeqTempleBDT&banhao='+板号,function(data){
			保存文本到本地(data,'down.html','http://localhost/mubanpaiban_TA_yangpinmingzhanlianghang/print_mubanpaiban_biaoqian_yangpinzhanlianghang.html?板号='+板号+'&操作人='+操作人+'&文件编号='+文件编号)
			//亦庄IIS服务器 ip
			//保存文本到本地(data,'down.html','http://192.168.110.100/mubanpaiban_TA_yangpinmingzhanlianghang/print_mubanpaiban_biaoqian_yangpinzhanlianghang.html?板号='+板号+'&操作人='+操作人+'&文件编号='+文件编号)
		 		 
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
}

