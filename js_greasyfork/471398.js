function 测序入财务(src){
	console.log('新的测序入财务界面')
	//测序入财务   课题组 客户姓名 选择时间段（结束时间  ）    选择公司   价格大于8，名称包含PCR，选择时间已后面的时间  某个客户有多少个数量汇总
	var local_测序入财务_统计汇总_订单款项_PCR_大于8=localStorage.getItem('测序入财务_统计汇总_订单款项_PCR_大于8');
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
			//查询加测反应
			if (local_测序入财务_统计汇总_订单款项_PCR_大于8=='true'){
				北京='<option value ="北京分公司">北京分公司</option>'
				亦庄='<option value ="北京亦庄分公司">北京亦庄分公司</option>'
				广州='<option value="广州分公司">广州分公司</option>'
				青岛='<option value="青岛分公司">青岛分公司</option>'
				哈尔滨='<option value="哈尔滨分公司">哈尔滨分公司</option>'
				toolbar.append('<select id="suoshugongsi">'+北京+亦庄+广州+青岛+哈尔滨+'</select>')
				toolbar.append('<input type="text" disabled  value="客户ID" size="5"/><input type="text" class="text_value" id="text_kehu_value" placeholder="条件value" size="10"/>')
				//toolbar.append('<input type="text" disabled  value="课题组" size="5"/><input type="text" class="text_value" id="text_ketizu_value" placeholder="课题组" size="10"/>')
				toolbar.append('<input type="date" id="qian_shijian">')  //添加前时间
				toolbar.find("#qian_shijian").val(getday_y_n("---"))//设置默认时间为今天
				toolbar.append('<input type="date" id="hou_shijian">')  //添加后时间
				toolbar.find("#hou_shijian").val(getday_y_n("---"))//设置默认时间为今天
				toolbar.append('<button id="huizong_shuliang" onclick="return false">汇总某个客户有多少数量</button>')
				//给文本框绑定回车键的函数
				toolbar.find('.text_value').keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
				//点击 汇总某个客户有多少数量  按钮   
				toolbar.find('#huizong_shuliang').click(function(){
					测序入财务_统计汇总_订单款项_PCR_大于8()
				})
				
			}
			
		}
	}
	//测序入财务_统计汇总_订单款项_PCR_大于8
	function 测序入财务_统计汇总_订单款项_PCR_大于8(){
		所属公司=toolbar.find('#suoshugongsi').val()
		客户ID=toolbar.find('#text_kehu_value').val()
		//客户id不能为空
		if (客户ID==''){
			alert('客户id不不能为空')
			return false
		}
		var qian=toolbar.find("#qian_shijian").val()
		var hou=toolbar.find("#hou_shijian").val()
		日期_arr=获取日期范围内的所有日期(qian,hou)
		if (日期_arr.length==0){
			alert('两个日期差不对')
			return false
		}
		//查询条件：所属公司 && 客户ID &&  （结束时间，每天的日期）
		订单号_arr=[]
		tag标记=true
		for (var i=0;i<日期_arr.length;i++){
			url='/seq/ashx/SeqOrderToFinaceHandler.ashx?_search=true&nd=1690028610700&rows=200&page=1&sidx=seqo_id&sord=desc&filters={"groupOp":"AND","rules":[{"field":"seqo_Belongs_name","op":"eq","data":"'+所属公司+'"},{"field":"seqo_cust_id","op":"eq","data":"'+客户ID+'"},{"field":"replace(CONVERT(varchar(11),+seq_order_endtime,121),\'-\',\'\')","op":"eq","data":"'+日期_arr[i]+'"}]}'
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(url,function (data,status) {
					//如果没有找到totalpages，说明网页运行失败
					if(data.indexOf('totalrecords')==-1){
						alert('访问失败,重新尝试')
						tag标记=false
						return false
					}else{
						//总共有多少条数据
						总条数=文本_取中间文本(data,'totalrecords":"','"')
						//总共有多少页
						总页数=文本_取中间文本(data,'totalpages":"','"')
						if (总页数==='0'){
							console.log('总页数为0')
							return false
						}else{
							console.log('总页数为1')
							当前日期订单号arr=文本_取中间文本_批量(data,'"seqo_id":"','"')
							订单号_arr=订单号_arr.concat(当前日期订单号arr);
						}
					}
				});
		}
		if (tag标记==false){
			return false
		}
		console.log(订单号_arr)
		//循环  订单号_arr  获取 订单款项中PCR的 不包含 PCR纯化费的大于8元的个数
		个数=0
		for (var i=0;i<订单号_arr.length;i++){
			url='/seq/ashx/SeqMoneyHandler.ashx?action=fee_money&seqo_id='+订单号_arr[i]+'&_search=false&nd=1690045700563&rows=50&page=1&sidx=seq_money_id&sord=desc'
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(url,function (data,status) {
					//如果没有找到totalpages，说明网页运行失败
					if(data.indexOf('totalrecords')==-1){
						alert('访问失败,重新尝试')
						tag标记=false
						return false
					}else{
						//总共有多少条数据
						总条数=文本_取中间文本(data,'totalrecords":"','"')
						if (总条数==='0'){
							return false
						}else{
							名称_arr=文本_取中间文本_批量(data,'"seq_money_name":"','"')
							数量_arr=文本_取中间文本_批量(data,'"seq_money_amount":"','"')
							单价_arr=文本_取中间文本_批量(data,',"seq_money_ever":"','"')
							for (var j=0;j<名称_arr.length;j++){
								//如果不包含PCR 或者 是 PCR纯化费  则不要
								if (名称_arr[j].toUpperCase().indexOf('PCR')==-1 || 名称_arr[j].toUpperCase()=='PCR纯化费'){
									continue
								}
								//如果单价大于8 则数量
								if(Number(单价_arr[j])>8){
									个数+=Number(数量_arr[j])
								}
							}
						}
					}
				});
		}
		if (tag标记==false){
			return false
		}
		alert('单款项中PCR,不包含PCR纯化费,单价大于8元的个数为：'+个数)
	}
	
	
	
}

