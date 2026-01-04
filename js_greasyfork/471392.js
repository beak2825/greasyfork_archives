function 反应生产(src){
	console.log('新的反应生产界面')
	var local_查询加测反应=localStorage.getItem('查询加测反应');
	var local_查询选择的同名引物=localStorage.getItem('查询选择的同名引物');
	var local_获取加测引物板号=localStorage.getItem('获取加测引物板号');
	var local_查询模板板号=localStorage.getItem('查询模板板号');
	var local_设置板号=localStorage.getItem('设置板号');
	var local_反应BDT表_样品名占两行=localStorage.getItem('反应BDT表_样品名占两行');
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
			//改成每页200个数据
			html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('200')
			//反应组标的颜色
			标颜色()
			//查询加测反应
			if (local_查询加测反应=='true'){
				toolbar.append('<button id="button_jiace_suoyou" onclick="return false">查询加测反应</button>')
				toolbar.append('<button id="button_jiace_chunduiying" onclick="return false">查询加测反应_纯对应</button>')
				//点击 查询加测反应 按钮   
				toolbar.find('#button_jiace_suoyou').click(function(){
					查询加测反应('所有')
				})
				//点击 查询加测反应_纯对应 按钮
				toolbar.find('#button_jiace_chunduiying').click(function(){
					查询加测反应('纯对应')
				})
			}
			//查询选择的同名引物
			if (local_查询选择的同名引物=='true'){
				toolbar.append('<button id="button_tongming_yinwu" onclick="return false">查询选择的同名引物</button>')
				//点击 查询选择的同名引物 按钮
				toolbar.find('#button_tongming_yinwu').click(function(){
					查询选择的同名引物()
				})
			}
			//获取加测引物板号
			if (local_获取加测引物板号=='true'){
				toolbar.append('<button id="button_jiace_yinwu_banhao" onclick="return false">获取加测引物板号</button>')
				toolbar.find('#button_jiace_yinwu_banhao').click(function(){
					获取加测引物板号()
				})
			}
			
			//查询模板板号
			if (local_查询模板板号=='true'){
				toolbar.append('<input type="text" id="text_mubanbanhao" placeholder="模板板号" size="10"/><button id="button_mubanbanhao" onclick="return false">查询模板板号</button>')
				//给文本框绑定回车键的函数
				toolbar.find('#text_mubanbanhao').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
				toolbar.find('#button_mubanbanhao').click(function(){
					查询模板板号()
				})
			}
			
			//设置板号
			if (local_设置板号=='true'){
				toolbar.append('<input type="text" id="text_banhao" placeholder="板号" size="10"/>')
				//给文本框绑定回车键的函数
				toolbar.find('#text_banhao').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
			}
			//反应BDT表_样品名占两行
			if (local_反应BDT表_样品名占两行=='true'){
				测序BDT表按钮=toolbar.find('#a_seq_BDT').eq(0)
				//点击测序BDT表按钮
				测序BDT表按钮.click(function(){
					函数_反应组BDT表_样品名占两行()
				})
			}
			
			//把板号放在排版的位置上
			$('#AB').live('click',function(){
				if($('#txt_seqs_plate').length==1){
					板号=toolbar.find('#text_banhao').eq(0).val() 
					$('#txt_seqs_plate').val(板号)
				}
			})
			
		}
	}
	//查询加测反应
	function 查询加测反应(类型){
		//搜索样品对应号包含YP，且 返回状态不等于 报告重做
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='seqs_plus_prod_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 样品对应号
		$('#searchForm').eq(0).find("option[value='cn']").eq(0).attr('selected','selected')  //改成包含
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('YP')
		$('#searchForm').eq(0).find("option[value='seqs_back']").eq(1).attr('selected','selected')  //把查询条件改成 样品对应号
		$('#searchForm').eq(0).find("option[value='ne']").eq(1).attr('selected','selected')  //改成不等于
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val('报告重做')
		if(类型=='纯对应'){
			//本来没有搜引物浓度的，把生成编号的value改成引物浓度的value
			$('#searchForm').eq(0).find("option[value='seqs_prod_id']").eq(2).val('seqs_observe')
			$('#searchForm').eq(0).find("option[value='seqs_observe']").eq(2).attr('selected','selected')  //把查询条件改成 引物浓度
			$('#searchForm').eq(0).find("option[value='cn']").eq(2).attr('selected','selected')  //改成包含
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(2).val('对应')
		}
		$("#AB").click()
	}
	
	//查询选择的同名引物
	function 查询选择的同名引物(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		var 课题组=table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_ketizu]').text()  //查询课题组
		var 引物名称=table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_undefined]').eq(1).attr('title')  //查询引物名称
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqo_ketizu']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 课题组
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(课题组)
		$('#searchForm').eq(0).find("option[value='seqs_primer']").eq(1).attr('selected','selected')  //把找到的第一个查询条件改成 引物名称
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(引物名称)
		$("#AB").click()
	}
	
	//获取加测引物板号
	function 获取加测引物板号(){
		//获取 包含YP  不包含报告重做的反应 且浓度包含对应
		url_原始='/seq/ashx/SeqReactionHandler.ashx?_search=true&nd=1667031128516&rows=200&page='+'第几页'+'&sidx=seqs_prod_id&sord=asc&filters={"groupOp":"AND","rules":[{"field":"seqs_plus_prod_id","op":"cn","data":"YP"},{"field":"seqs_back","op":"ne","data":"报告重做"},{"field":"seqs_observe","op":"cn","data":"对应"}]}'
		//先改成1，获取总共页数
		url=url_原始.replace('第几页',1)
		总页数=网址_获取总页数(url)
		sleep(2000)
		备注_arr=[]
		客户名_arr=[]
		课题组_arr=[]
		测序引物_arr=[]
		
		for (i=1;i<=parseInt(总页数);i++){
			url=url_原始.replace('第几页',i)
			jQuery.ajax({  
			    url:url,  
			    type: "get",  
			    dataType: "text",  
			    async: false,
			    success: function(data){
			        备注_arr=备注_arr.concat(文本_取中间文本_批量(data,'"remark":"','"'))
			        客户名_arr=客户名_arr.concat( 文本_取中间文本_批量(data,'"seqo_cust_name":"','"'))
			        课题组_arr=课题组_arr.concat( 文本_取中间文本_批量(data,'"seqo_ketizu":"','"'))
			        测序引物_arr=测序引物_arr.concat( 文本_取中间文本_批量(data,'"seqs_primer":"','"'))
			    }  
			});
			sleep(2000)
		}
		
		//删除 待测的，所有数组都要去除
		记录需要删除的索引=[]
		for(var i=0;i<备注_arr.length;i++){
			//如果备注有待测   或者 长程序 或  暂时不做 
			if(备注_arr[i].indexOf('待测')!=-1 ){  // 备注_arr[i].indexOf('长程序')!=-1 || 备注_arr[i].indexOf('暂时不做')!=-1
				记录需要删除的索引.push(i)
				continue
			}
		}
		for(var i=记录需要删除的索引.length-1;i>=0;i--){
			备注_arr.splice (记录需要删除的索引[i],1)
			客户名_arr.splice (记录需要删除的索引[i],1)
			课题组_arr.splice (记录需要删除的索引[i],1)
			测序引物_arr.splice (记录需要删除的索引[i],1)
		}
		
		所有连接_arr=[]
		for (var i=0;i<客户名_arr.length;i++){
			所有连接_arr.push(备注_arr[i]+"&$"+客户名_arr[i]+"&$"+课题组_arr[i]+"&$"+测序引物_arr[i])
		}
		所有连接_arr=quchong_arr(所有连接_arr)
		备注_arr=[]
		客户名_arr=[]
		课题组_arr=[]
		测序引物_arr=[]
		for(var i=0;i<所有连接_arr.length;i++){
			备注_arr.push(所有连接_arr[i].split('&$')[0])
			客户名_arr.push(所有连接_arr[i].split('&$')[1])
			课题组_arr.push(所有连接_arr[i].split('&$')[2])
			测序引物_arr.push(所有连接_arr[i].split('&$')[3])
		}
		//在测序样品根据课题组和测序引物降序排序获取板号
		result_客户名_arr=[]
		result_课题组_arr=[]
		result_引物浓度_arr=[]
		result_备注_arr=[]
		result_测序引物_arr=[]
		result_板号_arr=[]
		console.log('共访问',测序引物_arr.length,'次')
		for(var i=0;i<测序引物_arr.length;i++){
			tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1667077638736&rows=200&page=1&sidx=seqs_plate&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_primer%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+测序引物_arr[i]+"%22%7D%2C%7B%22field%22%3A%22seqo_ketizu%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+课题组_arr[i]+"%22%7D%5D%7D"
			$.get(tijiao,
				function (data) {
					总个数=文本_取中间文本(data,'"totalrecords":"','"')
					if (总个数=="0" || 总个数==false){
						return
					}else{
						console.log('第',i+1,'次')
						result_备注_arr.push(文本_取中间文本_批量(data,'"remark":"','"')[0])
						result_客户名_arr.push(文本_取中间文本_批量(data,'"seqo_cust_name":"','"')[0])
						result_课题组_arr.push(文本_取中间文本_批量(data,'"seqo_ketizu":"','"')[0])
						result_测序引物_arr.push(文本_取中间文本_批量(data,'"seqs_primer":"','"')[0])
						result_引物浓度_arr.push(文本_取中间文本_批量(data,'"seqs_observe":"','"')[0])
						板号=文本_取中间文本_批量(data,'"seqs_plate":"','"')[0]
						result_板号_arr.push(板号)
					}
				})
			sleep(2000)
		}
		//清空文本框内容
		if($('#textarea_shuju').length===1){
			$("#textarea_shuju").val("")
		}
		//给文本框放入结果数据
		for(var i=0;i<result_备注_arr.length;i++){
			shuju=result_测序引物_arr[i]+"  ("+result_板号_arr[i]+")  "+result_客户名_arr[i]+"  "+result_课题组_arr[i]     //+"  "+result_备注_arr[i]+"  "+result_引物浓度_arr[i]
			if($('#textarea_shuju').length===0){
				$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
			}
			$("#textarea_shuju").val($("#textarea_shuju").val()+shuju+"\n")
		}
		alert('ok')
					
	}
	
	//查询模板板号
	function 查询模板板号(){
		//把每页10改成每页150 ,方便反应组排版
		//html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('150')
		模板板号_文本框=html.find('#text_mubanbanhao').eq(0).val()  
		if(模板板号_文本框==''){
			return false
		}
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqs_tempplate']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 模板板号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(模板板号_文本框)
		$("#AB").click()
	}
	
	//标颜色
	function 标颜色(){
		console.log('yici')
		table.find('[aria-describedby=list_remark]').each(function(){
			if($(this).text().indexOf("待测")!=-1){
				$(this).attr('Bgcolor','#ee0e43')
			}
		})
		
		//当table出现数据改变的时候
		$(html).find('#list').on('DOMNodeInserted',function(e) {
			//$(e.target)代表的每一行
			备注=$(e.target).find('[aria-describedby=list_remark]')
			if(备注.text().indexOf("待测")!=-1){
				备注.attr('Bgcolor','#ee0e43')
			}
		})
	}
	
	//函数_反应组BDT表_样品名占两行
	function 函数_反应组BDT表_样品名占两行(){
		//弹框加个按钮
		$('#uiform').find('#txt_seqBDT_banhao').parent().append('<button id="button_fanying_yangpinming_zhanlianghang" onclick="return false">打标签_样品名占两行</button>')
		//添加个文本框 ，用于存储 文件编号 手动输入
		$('#uiform').find('#txt_seqBDT_banhao').parent().append('<input type="text" id="txt_fanying_wenjianbianhao" value="RZXK-QR-89" placeholder="文件编号" />') //
		//点击样品名占两行按钮
		$('#uiform').find('#button_fanying_yangpinming_zhanlianghang').click(function(){
			函数_样品名占两行_详细代码()
		})
	}
	
	//函数_样品名占两行()
	function 函数_样品名占两行_详细代码(){
		板号=$('#uiform').find('#txt_seqBDT_banhao').val()
		if (板号 == ''){
			return 
		}
		操作人=$('#curname').text()
		文件编号=$('#uiform').find('#txt_fanying_wenjianbianhao').val()
		
		$.get('/seq/xmldata/SeqReportDataProviderHandler.ashx?action=SeqBDT&banhao='+板号+'&kind=old',function(data){
			保存文本到本地(data,'down.html','http://localhost/fanyingBDT_yangpinmingzhanlianghang/print_fanying_biaoqian_yangpinzhanlianghang.html?板号='+板号+'&操作人='+操作人+'&文件编号='+文件编号)
			//亦庄IIS服务器 ip
			//保存文本到本地(data,'down.html','http://192.168.110.100/fanyingBDT_yangpinmingzhanlianghang/print_fanying_biaoqian_yangpinzhanlianghang.html?板号='+板号+'&操作人='+操作人+'&文件编号='+文件编号)
					 
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

