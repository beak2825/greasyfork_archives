// ==UserScript==
// @name         【京东】站长工作台2
// @namespace    manji
// @license      manji
// @version      0.0.9
// @description  try to take over the world!
// @author       You
// @match        *3pl-ql.jd.com/transport/intoStation*
// @match        *3pl-ql.jd.com*
// @grant        GM_xmlhttpRequest
// @connect      
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/439321/%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%E7%AB%99%E9%95%BF%E5%B7%A5%E4%BD%9C%E5%8F%B02.user.js
// @updateURL https://update.greasyfork.org/scripts/439321/%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%E7%AB%99%E9%95%BF%E5%B7%A5%E4%BD%9C%E5%8F%B02.meta.js
// ==/UserScript==


// 创建页面悬浮元素
console.log('---------------------');
let div=document.createElement("div");
div.innerHTML = `
		<div id="div_jingdong"   style=" text-align:center;background-color: #d5d2d8;">
			<div id="">
				<br>
				<p><textarea rows="10" cols="" id = 'input_text' autocomplete="off"  value="" style="width:300px; height:200px"> </textarea></p>
				<p><button type="button"  id ="get_content_form_inputText">从输入框中获取单号</button>&#12288 <button type="button" id ="get_content_form_url">从网页自动获取单号</button></p>
				<p><button type="button" id="delete_input">清空输入框内容</button>&#12288 <button type="delete_table">清空表格</button> &#12288<button type="button" id="send_request">批量提交再投</button></p>
				<p><button type="button" id="open_in_new_tab">新标签中打开网页</button></p>
				<br>
			</div>
						<p align="left">
					<h1>使用说明：</h1>
					<b>1、遇到错误尝试在中打开(订单入站) ：https://3pl-ql.jd.com/transport/intoStation</b><br>
                    <b>1、订单入站查询 的独立网址：https://3pl-ql.jd.com/transport/intoStationQuery</b><br>
					<b>2、输入时可以不用删除除空格和换行，但 JD 字母一定要大写，按字母识别单号。</b><br>
					<b>3、表格中的第一列必须是快递单号---------------------------------------------------------------</b><br>
				</p><br>
			<div id="div_table" align="center">
				
			</div><br><br>
		</div>
`;
document.body.append(div);
// 默认切换到再投
try{
    document.querySelector("#receiveType_2").click();
}catch(eee){
    console.log("切换到再投 按钮点击失败：",eee)
};


// 绑定元素点击事件
div.onclick=function(event){


    if(event.target.id=="get_content_form_inputText"){
        console.log("从输入框识别单号");
        shibie_input();

    }else if(event.target.id=="get_content_form_url"){
        console.log();
        get_data_from_html.getTableData()
        // alert("功能未开发XXXX");

    }else if(event.target.id=="delete_input"){
        alert("清空输入框");
        console.log();
        document.getElementById('input_text').value = '';
        
    }else if(event.target.id=="delete_table"){
        console.log("清空表格"); 
        alert("清空表格");
        // document.querySelector("#div_table").innerHTML='';

    }else if(event.target.id=="send_request"){
        loop_request();
        console.log("再投请求提交完成！！！");
    }else if(event.target.id=="open_in_new_tab"){
        // 打开网页
        window.open('https://3pl-ql.jd.com/transport/intoStation')
    };
};









//---------------------------------------------------------------------------------------------
// 解题思路

// ----------------------------------------------------------------------------------------------
// ------------------------------------------------------
// 步骤1：识别输入框中的快递单号
function shibie_input(){
	// 识别单号========
	// 查找输入文本框
	var input_content = document.getElementById('input_text');
	
	// 获取数据内容 字符串
	handle_content = input_content.value;
	console.log(handle_content);
	
	// 替换全部空格
	handle_content = handle_content.replace(/[(\r\n)\r\n]+/,"");
	handle_content = handle_content.replace(/\s+/g,"");
	console.log(handle_content);
	
	// 分隔字符串
	handle_content = handle_content.split("JD");
	// 删除空行
	handle_content.forEach((item,index)=>{
			if(!item){
				handle_content.splice(index,1);//删除空项
			}
	});
	console.log(handle_content);
	// 识别单号========

	// 查找要添加表格的 div
	div_table = document.getElementById('div_table');
	// 判断表格行数
	table_rows = handle_content.length;
	// 判断表格列数
	try{
		var table_columns = handle_content[0].trim().split(/\t/);
		var table_columns = table_columns.length + 1;
	}catch(err){
		var table_columns=2
	};
	// 定义表格头 html
	var tab='<table border=1   cellspacing=0   style="margin-left:auto; margin-right:auto;white-space: nowrap" >';
	for(var i=0;i<table_rows;i++){
		// 定义行 ID
		var trid = 'trid_' + i ;
		
		// 拼接行 HTML
		tab += '<tr id = "' + trid + '">' ;
		
		// 拼接行下的单元格
		for(var j=0;j<table_columns;j++){
			
			// 定义每个单元格 ID
			cell_id = trid + '_' + j ;
			
			// 单元格内容
			cell_content = 'JD' + handle_content[i].trim().split(/\t/)[j];
			last_column = table_columns-1;
			if(j==last_column){
				cell_content = '待操作';
			};
			
			// 拼接单元格HTML
			tab += '<td id ="' + cell_id + '">' + cell_content + '</td>' ;
		};
		tab+='</tr>';
	};
	tab+='</table>';
	div_table.innerHTML=tab ;
};

// shibie_input()  // 识别输入框中的内容


//-----------------------------------------------------------------------------------------------
// 步骤2： 根据快递单号 获取 包裹 data 信息

function get_post_data(waybillCode,i){
	//运单号码

	var url = "/transport/intoStation/doQuery";
	
	var data = {
	  "waybillCode": waybillCode,
	  "receiveType": "2",
	  "t_i_m_e": new Date().getTime()  //  1644671600666
	};
	// 这里需要将json数据转成post能够进行提交的字符串  name1=value1&name2=value2格式
	var oStr = '';
	data = (function(value){
	　　for(var key in value){
	　　　　oStr += key+"="+value[key]+"&";
	　　};
	　　return oStr;
	}(data));
	
	var headers = {
		'Accept': '*/*',
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Accept-Language': 'zh-CN,zh;q=0.9'
	}

	//这里进行HTTP请求
	var xmlhttp = null;
	try{
		xmlhttp = new XMLHttpRequest();
	}catch(e){
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	};
	
	xmlhttp.open("POST", url, true);
	
	// 设置请求头 headers 
	// xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	for(var item in headers){
		xmlhttp.setRequestHeader(item,headers[item]);
	};
	
	// 传入data
	xmlhttp.send(data); 
	
	//接收请求状态
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				//
				try{
					json_data = JSON.parse(xmlhttp.responseText);
					// console.log(json_data);
					console.log("请求data的状态码：",xmlhttp.code);
					
					if(json_data.data != null){
						// 提取 data 数据，并格式成字符串
						var text_data = JSON.stringify(json_data.data);
						
						//  修改关键参数
						text_data=text_data.replace('"receiveType":0','"receiveType":"2"');
						text_data=text_data.replace('"packageCount":0','"packageCount":"0"');
						
						console.log("返回data",typeof(text_data),text_data);
						
						// 将data传给后面的函数，提取数据
						// code..........
						myRequest_jd(text_data,i)
					}else{
						console.log("未获取到请求使用的data数据，返回提示信息为：：",json_data.message)
					};
				
				}catch(e){
					console.log("生成请求data错误××××：",e);
				};
			}else{
				console.log("获取data请求遇到错误，服务器状态码：",xmlhttp.status);
				console.log("如果状态码是0，请检查是否跨域？");
				alert("无法获取数据，请尝试在以下页面上运行代码：https://3pl-ql.jd.com/transport/intoStation");
				window.open("https://3pl-ql.jd.com/transport/intoStation");
			};
		};
	};
};
//---
//get_post_data(waybillCode)  // 根据快递单号获取包裹信息


//---------------------------------------------------------------------------------------------
// 步骤3：提交 再投请求
function myRequest_jd(text_data,i){
	//
	var url = '/transport/intoStation/doSave';
	
	var headers = {
	    'authority': '3pl-ql.jd.com',
	    'accept': '*/*',
	    'x-requested-with': 'XMLHttpRequest',
	    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
	    'accept-language': 'zh-CN,zh;q=0.9'
	};
	
	// jsonData 中 "receiveType":"2"  是提交再投的 关键信息
	var data = {
	'jsonData':text_data,
	'siteName': '\u5341\u5830\u51C9\u6C34\u6CB3\u9547\u4E50\u52A0\u670D\u52A1\u7AD9',
	't_i_m_e': new Date().getTime()  //  1644671600666
	};
	// 这里需要将json数据转成post能够进行提交的字符串  name1=value1&name2=value2格式
	var oStr = "";
	data = (function(value){
	　　for(var key in value){
	　　　　oStr += key+"="+value[key]+"&";
	　　};
	　　return oStr;
	}(data));
	
		
	//这里进行HTTP请求
	var xmlhttp = null;
	try{
		xmlhttp = new XMLHttpRequest();
	}catch(e){
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	};
	
	//post方式打开文件
	xmlhttp.open('post',url,true);
	// 设置请求头 headers
	for(var item in headers){
		xmlhttp.setRequestHeader(item,headers[item]);
	};
	//post发送数据
	xmlhttp.send(data);
	
	// 接收请求后的数据
	//当状态为4的时候，执行以下操作
	xmlhttp.onreadystatechange = function(){
		//当状态为4的时候，执行以下操作
		if(xmlhttp.readyState == 4){
			try{
				if(xmlhttp.status == 200){
					// 将返回的字符串格式化成字典
					var json_data = JSON.parse(xmlhttp.responseText);
					var text_message = JSON.stringify(json_data.message);
					if(text_message == "null"){
						text_message = "再投返回结果编码_" + json_data.code + "_抽查是否成功！";
					}else{
						text_message = text_message + "_返回编码_" + json_data.code;
					};
					
					console.log(text_message);
					wirteResult(text_message,i);
					

				}else{
					console.log("提交再投遇到错误，返回网页状态码：",xmlhttp.status);
				};

　　　　	}catch(e){
　　　　　　    alert('提交再投信息遇到错误，错误信息：'+e);
　　　　    };
	　　};
	};
};
//----
//myRequest_jd(text_data,idNumber)   // 提交包裹再投请求。




//---------------------------------------------------------------------------------------------
//  获取表格行数和列数
function get_table_rowsAndCells(){
	inputTable = document.querySelector("#div_table>table");
	
	//表格行数
	var rows = inputTable.rows.length ;
	
	//表格列数
	var cells = inputTable.rows.item(0).cells.length ;
	
	console.log("行数"+rows+"列数"+cells);
	alert("行数"+rows+"列数"+cells);
};
// get_table_rowsAndCells()









// ------------------------------------------------------
// 循环单号 提交 并写入状态结果
function loop_request(){
	// 循环读取表格中的运单号，并执行程序
	var inputTable = document.querySelector("#div_table>table");
	
	//表格行数
	var rows = inputTable.rows.length ;
	
	//表格列数
	// var cells = inputTable.rows.item(0).cells.length ;
	
	// 循环取出每行数据
	for(var i = 0;i<rows;i++){
		// 每一行
		tr = inputTable.rows[i];
		
		// 每一行第一列（运单号）取出
		danhao_number = tr.cells[0].innerHTML;
		
		// 将单号传递给提交函数
		get_post_data(danhao_number,i);
		
		// 
	};
	
};



// ------------------------------------------------------
// 写入结果
function wirteResult(add_cells_content,i){
	//参数 i  是 loop_request() 函数中的变量
	var inputTable = document.querySelector("#div_table>table");
	tr = inputTable.rows[i];
	
	//每一行增加列
	var td = tr.insertCell(tr.cells.length);
	console.log(typeof(td));
	
	// 将增加的列 填写内容
	td.innerHTML=add_cells_content;
};

// wirteResult(add_cells_content,i)


//==================================================================================================
//--------------------------------------------------------------------------------------------------
// 获取开始时间函数
getDateTime=function(timeTpye){
	//
	var myDate = new Date();
	var m=myDate.getMonth()+1; 
	var date = myDate.getFullYear()+'-'+m+'-'+myDate.getDate(); 
	
	if(timeTpye == "beginDate"){
		//  获取今天0点时间
		return date + ' ' +'00:00:00'; 
	}else if(timeTpye =="endDate"){
		//
		hour = myDate.getHours();      //获取当前小时数(0-23)
		mi = myDate.getMinutes();   // 获取当前分钟数(0-59)
		sod = myDate.getSeconds();      //获取当前秒数(0-59)
		return date + " " + hour+':'+ mi +':'+ sod;
	}else{
		console.log("获取时间的参数错误！！！");
	};
	
},
//--------------------------------------------------------------------------------------------------
//  从网页中 获取需要再投的包裹信息
get_data_from_html = {
	//
	getTableData:function(){
		//运单号码
		var url = "transport/intoStationQuery";
		// https://3pl-ql.jd.com/transport/intoStationQuery/doQuer
		var url = "/transport/intoStationQuery/doQuery";
		
		var data = {
			  'siteId': '880624',
			  'receiveType': '2',
			  'status': '-1',
			  'waybillCode': '',
			  'courierId': '0',
			  'beginDate': get_data_from_html.dateTime.beginDate,  //    '2022-02-12 00:00:00'
			  'endDate': get_data_from_html.dateTime.endDate, //     '2022-02-14 09:21:58'
			  'adjustStatus': '-1',
			  'currentPage': '1',
			  'pageSize': '300',
			  't_i_m_e': new Date().getTime()  //  1644671600666
		}
		// 这里需要将json数据转成post能够进行提交的字符串  name1=value1&name2=value2格式
		var oStr = '';
		data = (function(value){
		　　for(var key in value){
		　　　　oStr += key+"="+value[key]+"&";
		　　};
		　　return oStr;
		}(data));
		
		var headers = {
			'authority': '3pl-ql.jd.com',
			'accept': '*/*',
			'x-requested-with': 'XMLHttpRequest',
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'accept-language': 'zh-CN,zh;q=0.9',
		}
	
		//这里进行HTTP请求
		var xmlhttp = null;
		try{
			xmlhttp = new XMLHttpRequest();
		}catch(e){
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		};
		
		xmlhttp.open("POST", url, true);
		
		// 设置请求头 headers 
		// xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		for(var item in headers){
			xmlhttp.setRequestHeader(item,headers[item]);
		};
		
		// 传入data
		xmlhttp.send(data); 
		
		//接收请求状态
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == 4){
				if(xmlhttp.status == 200){
					//
					try{
						json_data = JSON.parse(xmlhttp.responseText);
						// console.log(json_data);
						console.log("请求data的状态码：",xmlhttp.status);
						
						if(json_data.data.totalRow != 0){
							console.log("查询的再投记录数：",json_data.data.totalRow);
							alert("查询的再投记录数："+json_data.data.totalRow+' 查询的时间是： '+get_data_from_html.dateTime.beginDate+'  '+get_data_from_html.dateTime.endDate);
							
							// 获取存储 再投信息的 list
							var resultList = json_data.data.result;
							console.log(resultList);
							
							// 将数据写入 HTML table
							// code....
							get_data_from_html.input_table(resultList)
	
						}else{
							console.log("未获取到请求使用的data数据，返回提示信息为：：",json_data.message)
							alert("未获取到数据，可能是今天没有需要再投包裹！,查询的时间范围是："+get_data_from_html.dateTime.beginDate+'  '+get_data_from_html.dateTime.endDate);
						};
					
					}catch(e){
						console.log("生成请求data错误××××：",e);
					};
				}else{
					console.log("从网页获取再投的清单，响应错误，服务器响应代码为：：",xmlhttp.status);
					console.log("如果状态码是0，请检查是否跨域？");
					alert("无法获取数据，请尝试在以下页面上运行代码：https://3pl-ql.jd.com/transport/intoStationQuery");
					window.open("https://3pl-ql.jd.com/transport/intoStationQuery");
				};
			};
		};
	},
	
	// 填写数据内容到表格上
	input_table:function(data){
		//
		var divTable = document.querySelector("#div_table");
		
		// 清空网页表格
		divTable.innerHTML = "";
		
		// 创建表格
		createTable = document.createElement("table");
		
		// 从data中创建数据内容
		var rows = data.length;
		console.log(rows);
		for(var row = 0;row<rows;row++){
			rows_content = data[row];
			
			// 创建行
			var tr = createTable.insertRow(row);
			
			// 创建列
			var td =tr.insertCell();
			td.innerHTML=rows_content.waybillCode;  // 填写手机号
			
			// 创建列
			var td =tr.insertCell();
			td.innerHTML=rows_content.reasonStr;  // 原因 例如 暂未联系上客户等
			
			// 创建列
			var td =tr.insertCell();
			td.innerHTML=rows_content.receiverAddress;  // 客户地址
			
			// 创建列
			var td =tr.insertCell();
			td.innerHTML=rows_content.remark;  // 备注
			
		};
		
		// 设置表格格式
		createTable.setAttribute("border","1");  // 线框宽度
		createTable.setAttribute("cellspacing","0");  // 取消表格间距
		createTable.setAttribute("align","center");  // 居中显示 left，right，center
		
		// 创建的表格添加到网页中
		divTable.append(createTable);
		
	},
	
	

	
	dateTime:{
        // beginDate:'2021-02-10 00:00:00',
		beginDate:getDateTime('beginDate'),
		endDate:getDateTime('endDate')
	}
	
};

// 调用
// get_data_from_html.getTableData();