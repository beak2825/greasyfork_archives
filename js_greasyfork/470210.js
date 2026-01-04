function 测序文件(){
	console.log('新的测序文件界面')
	var local_同一个版号中根据实验状态总结=localStorage.getItem('同一个版号中根据实验状态总结');
	if ($('#textarea_zongjie').length==0){
		$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_zongjie" style="position:absolute;left:400px;display:none" rows="3" cols="80"></textarea><button id="button_yincang_textarea"  style="display:none" >隐藏</button>')
	}
	//点击按钮，隐藏textare和自身
	$('#button_yincang_textarea').click(function(){
		$(this).css('display','none');
		$('#textarea_zongjie').css('display','none');
	})
	var html=$('iframe[src="/seq/AutoFileUploadList.aspx"]')//测序样品页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//var table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//添加修改样品名称按钮
			if (local_同一个版号中根据实验状态总结=='true'){
				toolbar.append('<span><input type="text" id="text_banhao"   placeholder="板号" size="5"/><button id="button_zongjie" onclick="return false">总结</font></button></span>')
				
				//点击添加样品前缀按钮执行如下函数
				toolbar.find('#button_zongjie').click(function(){
					根据实验状态总结()
				})
			}
		}
	}
	//根据实验状态总结
	function 根据实验状态总结(){
		板号=html.find('#text_banhao').eq(0).val()
		if(板号===""){console.log('空板号');return false}
		//报告生产界面查询BDT 数据
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		标记=0
		$.get("/seq/xmldata/xmlSeqDBT.aspx?banhao="+板号,
			function (data,status) {
				if (data.indexOf('<Table>')==-1){
					alert('没搜到数据')
					标记=1
					return false
				}
				客户名_arr=文本_取中间文本_批量(data,'<seqo_cust_name>','<\\/seqo_cust_name>')
				生产编号_arr=文本_取中间文本_批量(data,'<seqs_prod_id>','<\\/seqs_prod_id>')
				样品名称_arr=文本_取中间文本_批量(data,'<seqs_sam_num>','<\\/seqs_sam_num>')
				引物_arr=文本_取中间文本_批量(data,'<seqs_primer>','<\\/seqs_primer>')
				状态_arr=文本_取中间文本_批量(data,'<seqs_process>','<\\/seqs_process>')
				产品信息_arr=文本_取中间文本_批量(data,'<prod_info>','<\\/prod_info>')
				报告异常_arr=文本_取中间文本_批量(data,'<seqs_report_error','\\/')
				订单号_arr=文本_取中间文本_批量(data,'<seqo_order_id>','<\\/seqo_order_id>')
			});
		if (标记==1){
			return false
		}
		if (客户名_arr.length==0){
			alert('没搜到数据')
			return false
		}
		
		//样品状态 不是 报告成功的，全部改成  非报告成功
		for (var i=0;i<状态_arr.length;i++){
			if (状态_arr[i].indexOf('报告成功')==-1){
				状态_arr[i]='非报告成功'
			}else{
				状态_arr[i]='报告成功'
			}
		}
		//根据产品信息数组获取孔号数组
		孔号_arr=[]
		for (var i=0;i<产品信息_arr.length;i++){
			分割_arr=产品信息_arr[i].split('.')
			孔号_arr.push(分割_arr[分割_arr.length-2])
		}
		//把报告异常_arr 的>  < 去掉
		for (var i=0;i<报告异常_arr.length;i++){
			if (报告异常_arr[i].indexOf('>')!==-1){
				//删除第一位
				报告异常_arr[i]=报告异常_arr[i].substr(1)
			}
			if (报告异常_arr[i].indexOf('<')!==-1){
				//删除最后一位
				报告异常_arr[i]=报告异常_arr[i].substring(0, 报告异常_arr[i].length - 1);
			}
		}
		
		//显示textarea
		$('#textarea_zongjie').css('display','')
		$('#button_yincang_textarea').css('display','')
		
		//1.同一个引物的完成情况全部非“报告成功”
		引物_全部非报告成功()
		
		//2.同一个样品的完成情况全部非“报告成功”（目的：确定这个客户的个别样品是否有问题，需要跟踪）
		样品_全部非报告成功()
		
		//3.同一个客户的完成情况全部非“报告成功”
		客户_全部非报告成功()
		
		//4.孔号含A01-3,B01-3,C01-3或者f01-3，g01-3，h01-3或者A10-12\B10-12\C10-12或者f10-12、g10-12、h10-12都是没有报告成功的（目的：确定是否是PCR以的问题，PCR以是分4个区域，出问题，会不同区域坏）
        孔号_四个区域()
		
		//5.同一个样品备注都是含有“双峰”（目的：确定一下是否是客户样品问题，还是我们回收不纯，需要重新回收）
		样品_双峰()
		
		//6.同一个引物备注都是含有“双峰”（目的：确定一下是否是客户的引物有问题，持续跟踪分析）
		引物_双峰()
		
		alert('完毕')
	}
	//1.同一个引物的完成情况全部非“报告成功”
	function 引物_全部非报告成功(){
		临时_引物_arr=引物_arr.slice()
		//遍历数组，把状态是报告成功的，搜索所有该引物，和对应的状态全部删除
		引物记录_arr=[]
		for (var i=0;i<临时_引物_arr.length;i++){
			if (状态_arr[i]=='报告成功'){
				引物记录_arr.push(临时_引物_arr[i])
			}
		}
		for (var i=0;i<引物记录_arr.length;i++){
			for (var j=0;j<临时_引物_arr.length;j++){
				if (引物记录_arr[i]==临时_引物_arr[j]){
					临时_引物_arr[j]=''
				}
			}
		}
		//去掉是空字符串的数组
		临时_引物_arr=arr_quchu_kongbai(临时_引物_arr)
		res=数组_统计次数(临时_引物_arr)
		items=res[0]
		values=res[1]
		result=[]
		for (var i=0;i<items.length;i++){
			temp=items[i]+'  ('+values[i]+'个)'
			result.push(temp)
		}
		//console.log(result)
		//$("#textarea_zongjie").val()+
		$("#textarea_zongjie").val('同一个引物的完成情况全部非“报告成功”:  '+result+'\n')
	}
	//2.同一个样品的完成情况全部非“报告成功”（目的：确定这个客户的个别样品是否有问题，需要跟踪） 同一个订单号
	function 样品_全部非报告成功(){
		//连接订单号和样品名
		订单号_样品名_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			订单号_样品名_arr.push(订单号_arr[i]+'-'+样品名称_arr[i])
		}
		//console.log(订单号_样品名_arr)
		//遍历数组，把状态是报告成功的，搜索所有订单号-样品，和对应的状态全部删除
		订单号_样品名记录_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			if (状态_arr[i]=='报告成功'){
				订单号_样品名记录_arr.push(订单号_样品名_arr[i])
			}
		}
		for (var i=0;i<订单号_样品名记录_arr.length;i++){
			for (var j=0;j<订单号_样品名_arr.length;j++){
				if (订单号_样品名记录_arr[i]==订单号_样品名_arr[j]){
					订单号_样品名_arr[j]=''
				}
			}
		}
		//去掉是空字符串的数组
		订单号_样品名_arr=arr_quchu_kongbai(订单号_样品名_arr)
		res=数组_统计次数(订单号_样品名_arr)
		items=res[0]
		values=res[1]
		result=[]
		for (var i=0;i<items.length;i++){
			temp=items[i]+'  ('+values[i]+'个)'
			result.push(temp)
		}
		//console.log(result)
		$("#textarea_zongjie").val($("#textarea_zongjie").val()+'同一个样品的完成情况全部非“报告成功”:  '+result+'\n')
	}
	//3.同一个客户的完成情况全部非“报告成功”
	function  客户_全部非报告成功(){
		临时_订单号_arr=订单号_arr.slice()
		//遍历数组，把状态是报告成功的，搜索所有该订单号，和对应的状态全部删除
		订单号记录_arr=[]
		for (var i=0;i<临时_订单号_arr.length;i++){
			if (状态_arr[i]=='报告成功'){
				订单号记录_arr.push(临时_订单号_arr[i])
			}
		}
		for (var i=0;i<订单号记录_arr.length;i++){
			for (var j=0;j<临时_订单号_arr.length;j++){
				if (订单号记录_arr[i]==临时_订单号_arr[j]){
					临时_订单号_arr[j]=''
				}
			}
		}
		//去掉是空字符串的数组
		临时_订单号_arr=arr_quchu_kongbai(临时_订单号_arr)
		res=数组_统计次数(临时_订单号_arr)
		items=res[0]
		values=res[1]
		result=[]
		板号=html.find('#text_banhao').eq(0).val()
		for (var i=0;i<items.length;i++){
			temp=items[i]+'  ('+values[i]+'个) 板号:'+板号
			result.push(temp)
		}
		//console.log(result)
		$("#textarea_zongjie").val($("#textarea_zongjie").val()+'同一个客户的完成情况全部非“报告成功”:  '+result+'\n')
	}
	//4.孔号含A01-3,B01-3,C01-3或者f01-3，g01-3，h01-3或者A10-12\B10-12\C10-12或者f10-12、g10-12、h10-12都是没有报告成功的（目的：确定是否是PCR以的问题，PCR以是分4个区域，出问题，会不同区域坏）
	function 孔号_四个区域(){
		// test_arr=[]
		// for (var i=0;i<孔号_arr.length;i++){
		// 		test_arr.push(孔号_arr[i]+'-'+状态_arr[i])
		// }
		// console.log(test_arr)
		function 获取区域状态_公共函数(区域孔号){
			区域状态=[]
			for (var i=0;i<区域孔号.length;i++){
				for (var j=0;j<孔号_arr.length;j++){
					if (区域孔号[i]==孔号_arr[j]){
						区域状态.push(状态_arr[j])
					}
				}
			}
			return 区域状态
		}
		第一区域孔号=['A01','A02','A03','B01','B02','B03','C01','C02','C03']
		第一区域状态=获取区域状态_公共函数(第一区域孔号)
		第二区域孔号=['F01','F02','F03','G01','G02','G03','H01','H02','H03']
		第二区域状态=获取区域状态_公共函数(第二区域孔号)
		第三区域孔号=['A10','A11','A12','B10','B11','B12','C10','C11','C12']
		第三区域状态=获取区域状态_公共函数(第三区域孔号)
		第四区域孔号=['F10','F11','F12','G10','G11','G12','H10','H11','H12']
		第四区域状态=获取区域状态_公共函数(第四区域孔号)
		
		// console.log(第一区域状态)
		// console.log(第二区域状态)
		// console.log(第三区域状态)
		// console.log(第四区域状态)
		result=''
		//如果数组长度不为0 ，没有报告成功 则提示
		if (第一区域状态.length!=0){
			if (第一区域状态.indexOf('报告成功')==-1){
				result+='A01-3,B01-3,C01-3  这一个区域全部没有报告成功; '
			}
		}
		if (第二区域状态.length!=0){
			if (第二区域状态.indexOf('报告成功')==-1){
				result+='F01-3，G01-3，H01-3  这一个区域全部没有报告成功; '
			}
		}
		if (第三区域状态.length!=0){
			if (第三区域状态.indexOf('报告成功')==-1){
				result+='A10-12,B10-12,C10-12  这一个区域全部没有报告成功; '
			}
		}
		if (第四区域状态.length!=0){
			if (第四区域状态.indexOf('报告成功')==-1){
				result+='F10-12、G10-12、H10-12  这一个区域全部没有报告成功;'
			}
		}
		//console.log(result)
		$("#textarea_zongjie").val($("#textarea_zongjie").val()+'四个区域中某个没有报告成功:  '+result+'\n')
	}
	//5.同一个样品备注都是含有“双峰”（目的：确定一下是否是客户样品问题，还是我们回收不纯，需要重新回收）
	function 样品_双峰(){
		//连接订单号和样品名
		订单号_样品名_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			订单号_样品名_arr.push(订单号_arr[i]+'-'+样品名称_arr[i])
		}
		//遍历数组，把异常是双峰的，搜索所有订单号-样品，和对应的状态全部删除
		订单号_样品名记录_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			if (报告异常_arr[i].indexOf('双峰')==-1){
				订单号_样品名记录_arr.push(订单号_样品名_arr[i])
			}
		}
		//console.log(订单号_样品名记录_arr)
		for (var i=0;i<订单号_样品名记录_arr.length;i++){
			for (var j=0;j<订单号_样品名_arr.length;j++){
				if (订单号_样品名记录_arr[i]==订单号_样品名_arr[j]){
					订单号_样品名_arr[j]=''
				}
			}
		}
		//console.log(订单号_样品名_arr)
		//去掉是空字符串的数组
		订单号_样品名_arr=arr_quchu_kongbai(订单号_样品名_arr)
		res=数组_统计次数(订单号_样品名_arr)
		items=res[0]
		values=res[1]
		result=[]
		for (var i=0;i<items.length;i++){
			temp=items[i]+'  ('+values[i]+'个)'
			result.push(temp)
		}
		//console.log(result)
		$("#textarea_zongjie").val($("#textarea_zongjie").val()+'同一个样品备注都是含有“双峰”：  '+result+'\n')
	}
	//6.同一个引物备注都是含有“双峰”（目的：确定一下是否是客户的引物有问题，持续跟踪分析）
	function 引物_双峰(){
		// console.log(客户名_arr)
		// console.log(生产编号_arr)
		// console.log(引物_arr)
		// console.log(报告异常_arr)
		// console.log(订单号_arr)
		// console.log(样品名称_arr)
		//console.log(孔号_arr)
		//console.log(状态_arr)
		//连接订单号和引物
		订单号_引物_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			订单号_引物_arr.push(订单号_arr[i]+'-'+引物_arr[i])
		}
		//遍历数组，把异常是双峰的，搜索所有订单号-引物，和对应的状态全部删除
		订单号_引物记录_arr=[]
		for (var i=0;i<样品名称_arr.length;i++){
			if (报告异常_arr[i].indexOf('双峰')==-1){
				订单号_引物记录_arr.push(订单号_引物_arr[i])
			}
		}
		for (var i=0;i<订单号_引物记录_arr.length;i++){
			for (var j=0;j<订单号_引物_arr.length;j++){
				if (订单号_引物记录_arr[i]==订单号_引物_arr[j]){
					订单号_引物_arr[j]=''
				}
			}
		}
		//去掉是空字符串的数组
		订单号_引物_arr=arr_quchu_kongbai(订单号_引物_arr)
		res=数组_统计次数(订单号_引物_arr)
		items=res[0]
		values=res[1]
		result=[]
		for (var i=0;i<items.length;i++){
			temp=items[i]+'  ('+values[i]+'个)'
			result.push(temp)
		}
		//console.log(result)
		$("#textarea_zongjie").val($("#textarea_zongjie").val()+'同一个引物备注都是含有“双峰”：  '+result)
	}
}

