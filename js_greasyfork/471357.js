function 安排合成(src){
	console.log('新的安排合成界面')
	var local_李楠和达尔文生物改变颜色=localStorage.getItem('李楠和达尔文生物改变颜色');
	var local_圆稀赠引物标签加姓名=localStorage.getItem('圆稀赠引物标签加姓名');
	var local_上机表_兼并碱基加颜色=localStorage.getItem('上机表_兼并碱基加颜色');
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
			if (local_李楠和达尔文生物改变颜色=='true'){
				安排合成_李楠和达尔文生物_颜色()
			}
			if(local_圆稀赠引物标签加姓名=='true'){
				标签打印按钮=toolbar.find('#a_seq_lable_pr').eq(0)
				//点击标签打印按钮
				标签打印按钮.click(function(){
					安排合成_圆稀赠引物标签加姓名(html)
				})
			}
			//上机表_兼并碱基加颜色
			if(local_上机表_兼并碱基加颜色 == 'true'){
				上机表按钮=toolbar.find('#a_seq_Table').eq(0)
				//点击上机表按钮
				上机表按钮.click(function(){
					上机表_兼并碱基加颜色(html)
				})
			}
		}
	}
	//安排合成_李楠和达尔文生物_颜色
	function 安排合成_李楠和达尔文生物_颜色(){
		//==============================当table出现数据改变的时候=================================
		// 观察器的配置（需要观察什么变动）
		var config = {attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
		var table变化 = function(mutationRecoard, observer) {
			//会有两次变化  根据最终的变化
			if ($(html).find('#load_list').css('display')=='none'){
				html.find('table').find('tr').each(function(){
					课题组信息=$(this).find('[aria-describedby=list_syno_ketizu]')
					课题组=课题组信息.text()
					if(课题组==="李楠"){
						//设置背景颜色
						$(this).find('td').attr('Bgcolor','#FF7034')
					}
					if(课题组==="达尔文生物"){
						//设置背景颜色
						$(this).find('td').attr('Bgcolor','#C80000')
					}
					if(课题组==="基因部"){
						//设置背景颜色
						$(this).find('td').attr('Bgcolor','#ceEEe7')
					}
					if(课题组==="迈津生物"){
						//设置背景颜色
						$(this).find('td').attr('Bgcolor','#3BAF6D')
					}
				})
			}
			
		};
		var observer = new MutationObserver(table变化);
		// 以上述配置开始观察目标节点
		dom=$(html).find('#load_list').get(0)
		observer.observe(dom, config);
	}
	
	//安排合成_圆稀赠引物标签加姓名
	function 安排合成_圆稀赠引物标签加姓名(html){
		//弹框加个按钮
		$('#d').find('#uiform').find('#print_synBDT').after('<button id="button_addName" onclick="return false">顶部标签加姓名</button>')
		//点击按钮
		$('#d').find('#uiform').find('#button_addName').click(function(){
			安排合成_圆稀赠引物标签加姓名_详细代码()
		})
	}
	function 安排合成_圆稀赠引物标签加姓名_详细代码(html){
		板号=$('#uiform').find('#txt_syn_plate').val()
		if (板号 == ''){
			return 
		}
		var 客户名_arr=[]
		var 引物名称_arr=[]
		var OD总量_arr=[]
		var 单管量_arr=[]
		//根据总量和单管量 获取管数
		var 管数_arr=[]
		var 孔号_arr=[]
		var 备注_arr=[]
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get('/syn/ashx/SynSampleHandler.ashx?_search=true&nd=1720597763777&rows=500&page=1&sidx=syn_s_num&sord=asc&filters={"groupOp":"AND","rules":[{"field":"syn_s_palte","op":"eq","data":"'+板号+'"}]}',function(data){
		     客户名_arr=文本_取中间文本_批量(data,'"cust_name":"','","')
			 引物名称_arr=文本_取中间文本_批量(data,'"syn_s_primer":"','","')
			 OD总量_arr=文本_取中间文本_批量(data,'"syn_s_od":"','","')
			 单管量_arr=文本_取中间文本_批量(data,'"syn_s_od_tube":"','","')
			 //决定每个引物出几管
			 for (var i=0;i<OD总量_arr.length;i++){
				 管量=parseInt(OD总量_arr[i]/单管量_arr[i])+1
				 if (管量>4){
					 管量=4
				 }
				 管数_arr.push(管量)
			 }
			 孔号_arr=文本_取中间文本_批量(data,'"syn_s_hole":"','","')
			 备注_arr=文本_取中间文本_批量(data,'"syn_s_remark":"','","')
		 }); 
		 //排版分为2种，一种96孔板，一种384
		 if (客户名_arr.length<=96){
			 //排序*******************按照 A1 B1...H1,A2..H2这个顺序********************
			 var new_客户名_arr=[]
			 var new_引物名称_arr=[]
			 var new_OD总量_arr=[]
			 var new_单管量_arr=[]
			 var new_管数_arr=[]
			 var new_孔号_arr=[]
			 var new_备注_arr=[]
			 位置字典={
				1:'A',
				2:'B',
				3:'C',
				4:'D',
				5:'E',
				6:'F',
				7:'G',
				8:'H',
			 }
			 //i表示1到12，j表示A到H
			 for(var i=1;i<13;i++){
				 for(var j=1;j<9;j++){
					 字母=位置字典[j]
					 if (i<10){
						孔号位置=孔号_arr.indexOf(字母+'0'+i) 
					 }else{
						孔号位置=孔号_arr.indexOf(字母+i)
					 }
					 if (孔号位置 !== -1){
						 new_客户名_arr.push(客户名_arr[孔号位置])
						 new_引物名称_arr.push(引物名称_arr[孔号位置])
						 new_OD总量_arr.push(OD总量_arr[孔号位置])
						 new_单管量_arr.push(单管量_arr[孔号位置])
						 new_管数_arr.push(管数_arr[孔号位置])
						 new_孔号_arr.push(孔号_arr[孔号位置])
						 new_备注_arr.push(备注_arr[孔号位置])
					 }
				 }
			 }
		 }else{
			 //排序*******************按照 A1 C1 E1...O1 B1 D1...P1   这个顺序********************
			 var new_客户名_arr=[]
			 var new_引物名称_arr=[]
			 var new_OD总量_arr=[]
			 var new_单管量_arr=[]
			 var new_管数_arr=[]
			 var new_孔号_arr=[]
			 var new_备注_arr=[]
			 位置字典={
				1:'A',
				2:'C',
				3:'E',
				4:'G',
				5:'I',
				6:'K',
				7:'M',
				8:'O',
				9:'B',
				10:'D',
				11:'F',
				12:'H',
				13:'J',
				14:'L',
				15:'N',
				16:'P',
			 }
			 //i表示1到24，j表示位置字典 A到P
			 for(var i=1;i<25;i++){
				 for(var j=1;j<17;j++){
					 字母=位置字典[j]
					 if (i<10){
						孔号位置=孔号_arr.indexOf(字母+'0'+i) 
					 }else{
						孔号位置=孔号_arr.indexOf(字母+i)
					 }
					 if (孔号位置 !== -1){
						 new_客户名_arr.push(客户名_arr[孔号位置])
						 new_引物名称_arr.push(引物名称_arr[孔号位置])
						 new_OD总量_arr.push(OD总量_arr[孔号位置])
						 new_单管量_arr.push(单管量_arr[孔号位置])
						 new_管数_arr.push(管数_arr[孔号位置])
						 new_孔号_arr.push(孔号_arr[孔号位置])
						 new_备注_arr.push(备注_arr[孔号位置])
					 }
				 }
			 }
		 }
		 res="<NewDataSet>"
		 if (new_客户名_arr.length>=1){
			 for (var i=0;i<new_客户名_arr.length;i++){
				 //决定测序引物的位置
				 for(var j=0;j<new_管数_arr[i];j++){
					 if (new_备注_arr[i].search('测序引物') >=0){
						 res+="<Table1>"
						 if (j == 0){
							 res+="<syn_s_primer>"+new_引物名称_arr[i]+'('+new_客户名_arr[i]+')'+"</syn_s_primer>"
						 }else{
							 res+="<syn_s_primer>"+new_引物名称_arr[i]+"</syn_s_primer>"
						 }
						 
						 res+="<syn_s_hole>"+new_孔号_arr[i]+"</syn_s_hole>"
						 res+="</Table1>"
					 }else{
						 res+="<Table1>"
						 res+="<syn_s_primer>"+new_引物名称_arr[i]+"</syn_s_primer>"
						 res+="<syn_s_hole>"+new_孔号_arr[i]+"</syn_s_hole>"
						 res+="</Table1>"
					 }
				 }
			 }
		 }
		 res+="</NewDataSet>"
		 保存文本到本地(res,'down.html','http://localhost/addName/print.html')
	}
	
	//上机表_兼并碱基加颜色
	function 上机表_兼并碱基加颜色(html){
		//弹框加个按钮
		$('#w').find('#uiform').find('#print_SynMachine').after('<button id="button_addColor" onclick="return false">兼并碱基加颜色</button>')
		//点击按钮
		$('#w').find('#uiform').find('#button_addColor').click(function(){
			兼并碱基加颜色_详细代码()
		})
	}
	function 兼并碱基加颜色_详细代码(html){
		板号=$('#uiform').find('#txt_syn_plate').val()
		if (板号 == ''){
			return 
		}
		操作人=$('#curname').text()
		window.open('http://localhost/jianbingjianji_jiayanse/print.html?板号='+板号+'&操作人='+操作人)
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
	
	//字符串全部替换部分文字
	function str_replaceAll(str, yuanwenben, xianwenben) {
	  return str.replace(new RegExp(yuanwenben, 'g'), xianwenben);
	}
}

