function 模板浏览(src){
	console.log('新的模板浏览界面')
	var local_质粒引物板号=localStorage.getItem('质粒引物板号');
	var local_直提引物板号=localStorage.getItem('直提引物板号');
	var local_切胶引物板号=localStorage.getItem('切胶引物板号');
	var local_菌引物板号=localStorage.getItem('菌引物板号');
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
			//改成每页100个数据
			html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('100')
			//查询
			if (local_质粒引物板号=='true'){
				toolbar.append('<button id="button_zhili_liulan_banhao" onclick="return false">质粒引物板号</button>')
				//点击 质粒引物板号  按钮   
				toolbar.find('#button_zhili_liulan_banhao').click(function(){
					获取质粒引物板号_浏览()
				})
			}
			if (local_直提引物板号=='true'){
				toolbar.append('<button id="button_zhiti_liulan_banhao" onclick="return false">直提引物板号</button>')
				//点击 直提引物板号  按钮   
				toolbar.find('#button_zhiti_liulan_banhao').click(function(){
					获取直提引物板号_浏览()
				})
			}
			if (local_切胶引物板号=='true'){
				toolbar.append('<button id="button_qiejiao_liulan_banhao" onclick="return false">PCR引物板号</button>')
				//点击 直提引物板号  按钮
				toolbar.find('#button_qiejiao_liulan_banhao').click(function(){
					获取切胶引物板号_浏览()
				})
			}
			if (local_菌引物板号=='true'){
				toolbar.append('<button id="button_jun_liulan_banhao" onclick="return false">菌引物板号</button>')
				//点击 菌引物板号  按钮
				toolbar.find('#button_jun_liulan_banhao').click(function(){
					获取菌引物板号_浏览()
				})
			}
		}
	}
	//获取质粒引物板号   搜索  引物浓度包含对应  且  样品类型=质粒
	function 获取质粒引物板号_浏览(){
		url='/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1711275386690&rows=200&page='+'第几页'+'&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_observe","op":"cn","data":"对应"},{"field":"seqs_sam_type","op":"cn","data":"质粒"}]}'
		公共_引物_浏览(url)
	}
	
	//获取直提引物板号  搜索 引物浓度包含对应  模板板号包含T
	function 获取直提引物板号_浏览(){
		url='/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1711275386690&rows=200&page='+'第几页'+'&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_observe","op":"cn","data":"对应"},{"field":"seqs_sam_type","op":"cn","data":"直提菌"}]}'
		公共_引物_浏览(url)
	}
	//获取切胶引物板号  搜索 引物浓度包含对应 模板板号包含Q
	function 获取切胶引物板号_浏览(){
		url='/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1711275386690&rows=200&page='+'第几页'+'&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_observe","op":"cn","data":"对应"},{"field":"seqs_sam_type","op":"cn","data":"PCR"}]}'
		公共_引物_浏览(url)
	}
	
	//获取菌引物板号  搜索 引物浓度包含对应  且  样品类型包含菌  
	function 获取菌引物板号_浏览(){
		url='/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1711275386690&rows=200&page='+'第几页'+'&sidx=seqs_prod_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqs_observe","op":"cn","data":"对应"},{"field":"seqs_sam_type","op":"cn","data":"菌"}]}'
		公共_引物_浏览(url)
	}
	
	
	//公共函数
	function 公共_引物_浏览(url_原始){
		//先改成1，获取总共页数
		url=url_原始.replace('第几页',1)
		总页数=网址_获取总页数(url)
		sleep(2000)
		备注_arr=[]
		客户名_arr=[]
		课题组_arr=[]
		测序引物_arr=[]
		返回状态_arr=[] 
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
			        返回状态_arr=返回状态_arr.concat( 文本_取中间文本_批量(data,'"seqs_back":"','"'))
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
			返回状态_arr.splice (记录需要删除的索引[i],1)
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
						//获取返回状态 如果返回状态==报告重跑 则板号改成-1
						返回状态=文本_取中间文本_批量(data,'"seqs_back":"','"')[0]
						板号=文本_取中间文本_批量(data,'"seqs_plate":"','"')[0]
						//如果是 报告重跑
						if (返回状态=='报告重跑'){
							result_板号_arr.push(板号+'重跑')
						}else{
							result_板号_arr.push(板号)
						}
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
}

