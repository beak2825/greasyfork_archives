// ==UserScript==
// @name         【YD】极兔快递签收
// @namespace    manji
// @license      manji
// @version      0.1.52
// @description  极兔快递批量签收脚本
// @match        https://www.jtexpress.com/aboutUs.html?type=JT
// @match        https://www.jtexpress.com/?type=JT
// @match        https://www.jtexpress.com/contactUs
// @match        https://bc.jtexpress.com.cn/bc/out/loginSecurity
// @author       You
// @grant        GM_xmlhttpRequest
// @connect      bc.jtexpress.com.cn
// @downloadURL https://update.greasyfork.org/scripts/440756/%E3%80%90YD%E3%80%91%E6%9E%81%E5%85%94%E5%BF%AB%E9%80%92%E7%AD%BE%E6%94%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440756/%E3%80%90YD%E3%80%91%E6%9E%81%E5%85%94%E5%BF%AB%E9%80%92%E7%AD%BE%E6%94%B6.meta.js
// ==/UserScript==
// @connect --------------屏蔽跨域弹窗提示
// -----------------------脚本废弃了，userAgent 没有合适的方式修改
//-------------------------------------------------------------------------------------------------------------------------------------
let div=document.createElement("div");
div.innerHTML = `
		<div id="">
			<div id="div_menniu" style="text-align:center">
				<h1>极兔快递自动签收脚本</h1>
				<p>这个程序可以批量签收极兔快递订单</p>
				<p> <button type="button" id="idgetdata">1.点击获取数据</button></p>	
			</div>
			<div id="div_result_id" style="text-align:center">
				<p id="p_result_login_id"></p>
				<p id="p_result_getDataList_id"></p>
				<br><br>
				<p><button type="button" id="button_id_02">2.签收凉水河</button></p>
				<br>
				<p><button type="button" id="button_id_03">3.签收石鼓</button></p><br>
                <br>
                <p><button type="button" id="button_id_04">4.石鼓和凉水河都签</button></p><br>
                <br>
                <p id="p_result_qianshoushuliang_id" style= "color:red">......</p><br>
			</div>
			<div id="div_table"  style="text-align:center">
				
			</div>
		</div>
`
document.body.innerHTML = '';
document.body.append(div);
//-------------------------------------------------------------------------------------------------------------------------------------

// 绑定元素点击事件
div.onclick=function(event){
    if(event.target.id=="idgetdata"){
        alert("准备开始运行查询：");
        runConfig.login_from();

    }else if(event.target.id=="button_id_02"){
        alert("准备开始运行提交程序：");
        document.querySelector("#p_result_qianshoushuliang_id").innerHTML = '即将开始签收，签收间隔5-1秒间';
		runConfigTwo.getTableRowCellsLength('ls');
    }else if(event.target.id=="button_id_03"){
		alert("准备开始运行提交程序：");
        document.querySelector("#p_result_qianshoushuliang_id").innerHTML = '即将开始签收，签收间隔5-1秒间';
		runConfigTwo.getTableRowCellsLength('sg');
	}else if(event.target.id=="button_id_04"){
        //凉水河和石鼓都签收
        alert("准备开始运行提交程序：");
        document.querySelector("#p_result_qianshoushuliang_id").innerHTML = '即将开始签收，签收间隔5-1秒间';
        runConfigTwo.getTableRowCellsLength('all');
    }else{
        //
    };
};

//-------------------------------------------------------------------------------------------------------------
// -----------------------HTTP/1.1  中 请求头  Content-Length 是必须有的------------------------------------------
// ----------------------脚本猫 0.9.0中可以修改请求头  User-Agent-------------------------------------------------


var config = {
	
	// 登录时候的请求头
	headers_old:{
		'User-Agent': 'Android-HUAWEI TAS-AN00/app_out',
		'Content-Type': 'application/json; charset=utf-8',
		'Host': 'bc.jtexpress.com.cn',
	},
	// 获取数据时候的请求头
	//.....
	
	// 地址识别，从以下关键字中识别地址
	sg_list:['石鼓','罗店','十古','十鼓'],
	lsh_list:['凉水河','凉水镇新合作'],
	
	// 接收登录成功后的返回信息
	resContent:{},
	
	// 登录成功后，访问其他页面 header
	headerTwo:{
		"Device-ID": "a0de2fb1cb952d9b065fc4d44d986dcc",
		"Device-Version": "Android-29",
		"Device-Name": "HUAWEI TAS-AN00",
		"device_id": "WCA-a0de2fb1cb952d9",
		"App-Platform": "Android_com.yunlu.salesman",
		"User-Agent": "Android-HUAWEI TAS-AN00/app_out",
		"devicefrom": "android",
		"App-Version": "2.0.52",
		"App-Channel": "Internal Deliver",
		"authToken": '',
		"signature": "RkJBOUEwQkYwOTgwNzU0NEE4NUI4NTlBNkQ3RTQ3RjI=",
		"AppId": "202100001",
		"digestv": "31e352851fbf0604a67185a76fe69f62",
		"Content-Type": "application/json; charset=UTF-8",
		"Content-Length": '',
		"Host": "bc.jtexpress.com.cn",
		"Connection": "Keep-Alive",
		"Accept-Encoding": "gzip",
	},

};

//------------------------------------------------------------------------------------
// 定义运行函数
var runConfig={
	//  ------------------------------------------------------------------------------------------------------------
	login_from:function(){
	    const data={
	        "password":"3cc886fe0047c2219a5e5cd8da2ac095",
	        "appDeviceId":"WCA-a0de2fb1cb952d9",
	        "code":"",
	        "account":"00336071",
	        "macAddr":"a0de2fb1cb952d9b065fc4d44d986dcc"
	    };
		var dataStr = JSON.stringify(data);
		var contentLength = dataStr.length.toString();
		var headers_new = config.headers_old;
		headers_new['Content-Length'] = contentLength;
	
		GM_xmlhttpRequest({
			method: "post",
			url: 'https://bc.jtexpress.com.cn/bc/out/loginSecurity',
			
	        // data 只能接收字符串
			data:dataStr,
			headers:headers_new,
			
			onload: function(res){
				if(res.status === 200){
					console.log('极兔快递，登录成功！！！');
	                // console.log(res.response);
	
	                // res.response  获得响应内容
	                // console.log(res);
	                jsonData = JSON.parse(res.response);
	
	                // 获取 token
	                token = jsonData['data']['token'];
					config.resContent['token'] = token;
	 
	                // 获取网点参数 + networkCode
	                networkCode = jsonData['data']['networkCode'];
					config.resContent['networkCode'] = networkCode;
	
	                // 将获取到的值写入 HTML
					document.querySelector("#p_result_login_id").innerHTML = "1、登录成功值获取如下：" + "<br>" + "networkCode: " + token + "<br>" +" networkCode: "  + networkCode;
	
	                // 获取 快递列表
	                // code .............
	                runConfig.get_data_form(token);
	
	
				}else{
					console.log('失败')
					console.log(res)
				}
			},
			onerror : function(err){
				console.log('error')
				console.log(err)
			}
		});
	},
	
	//-------------------------------------------------------------------------------------------------------------
	// 时间处理函数 （）获取当前时间
	strToday:function(){
		//  返回格式 "2022-2-18"
		var myDate = new Date();
		var m=myDate.getMonth()+1; 
		var d = myDate.getDate()
		if(m<10){
			m = '0'+m;
		};
		if(d<10){
			d = '0'+d;
		};
		return myDate.getFullYear()+'-'+m+'-'+ d; 
	},
	
	//-------------------------------------------------------------------------------------
	// 判断字符串是否在列表中
	isInArray:function(arr,value){
		for(var i = 0; i < arr.length; i++){
			if(value.indexOf(arr[i])!=-1){
				return true;
			};
		};
		return false;
	},
	
	// ------------------------------------------------------------------------------------------------------------
	// 从快递公司请求 获取快递列表   时间格式为 2022-02-27 00:00:00
	get_data_form:function(token){
	    const data = {
	        "isAbnormal":0,"address":"","phone":"","orderFlag":11,"waybillId":"","staffLngLat":"111.522807,32.561664",
	        "startTime":runConfig.strToday() + ' 00:00:00',  // 注意时间格式 2022-02-27 00:00:00
	        "endTime":runConfig.strToday() + ' 23:59:59',  // 注意时间格式 2022-02-27 23:59:59
	        "pageNum":1,"taskStatus":3,"customerName":""
	    };
		var dataStr = JSON.stringify(data);
		// console.log(dataStr);
		var contentLength = dataStr.length.toString();
		var headers_new = config.headerTwo;
		headers_new['authToken'] = config.resContent['token'];
		headers_new['Content-Length'] = contentLength;
	
		GM_xmlhttpRequest({
			method: "post",
			url: 'https://bc.jtexpress.com.cn/outer/task/awaitDelivery/all',
			
	        // data 只能接收字符串
		    data:dataStr,
			headers:headers_new,
			
			onload: function(res){
				if(res.status === 200){
					console.log('请求代签列表，返回状态码200，请判断是否有数据返回！！！');
	                // console.log(res.response);
	
	                // res.response  获得响应内容
	                // console.log(res);
	                jsonData = JSON.parse(res.response);
	                // console.log(res.responseHeaders);
	
	                // 数据获取结果
	                dataList_result = jsonData['msg'];
					
					// 存储快递的列表
					dataList = jsonData['data'];
					// console.log(dataList);
					if(dataList==null){
						console.log('获取代签列表数据：',res.response);
					}else{
						console.log('');
					};
					
					//获取到的数据数量
					dataL = dataList.length.toString();
	
					// 将获取到的结果状态值写入 HTML
					document.querySelector("#p_result_getDataList_id").innerHTML = "2、请求运单列表的结果：" + dataList_result + ' ; 获取到：' + dataL+'  个包裹';
					
					// 将获取的 运单列表写入到HTML
					runConfig.input_data_list_to_table(dataList);
					
				}else{
					console.log('失败')
					console.log(res)
				}
			},
			onerror : function(err){
				console.log('error')
				console.log(err)
			}
		});
	},
	
	// -----------------------------------------------------------------------------------------------------------
	// --------------------------------------------------------------------------
	// 将获取到的 data list 写入到网页中
	input_data_list_to_table:function(data){
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
			td.innerHTML=rows_content.waybillNo;  // 获取快递单号
			
			// 创建列
			var td =tr.insertCell();
			td.innerHTML=rows_content.receiverMobile;  // 获取手机
						
			// 包裹类型列
			goodsTypeCode = rows_content.goodsTypeCode;
			if(goodsTypeCode == 'bm000007'){
				goodsTypeCode='生鲜件';
			}else{
				goodsTypeCode='未定义包裹代码：'+goodsTypeCode;
			};
			var td =tr.insertCell();
			td.innerHTML=goodsTypeCode;  //  填写包裹类型
			
			// 地址列
			receiverStreet = rows_content.receiverStreet; // 乡镇地址
			receiverDetailedAddress =  rows_content.receiverDetailedAddress; // 末端地址
			if(receiverStreet != null){
				address = receiverStreet + receiverDetailedAddress;
			}else{
				address = receiverDetailedAddress;
			};
			var td =tr.insertCell();
			td.innerHTML=address;  // 填写拼接后的地址到表格
			
			//  判断地址归属
			//--------------------------
			try{
				//
				if(typeof(address)=="undefined"){
					//如果地址为空
					addressType = '地址为空';
				}
				else if(runConfig.isInArray(config.lsh_list,address) == true){
					addressType = '凉水河';
				}else if(runConfig.isInArray(config.sg_list,address) == true){
					addressType = '石鼓';
				}else{
					addressType = '未识别地址';
				};
			}catch(err){
				console.log('判断地址归属 --遇到错误')
				console.error(err)
			};

			var td =tr.insertCell();
			td.innerHTML=addressType;

			// 特殊状态列（例如 派前务必电联）
			teshu_type = rows_content.isNeedContact;
			if(teshu_type==1){
				teshu_type_content = '务必电联！！！！！';
			}else{
				teshu_type_content = '未发现特殊件' + teshu_type;
			};
			var td =tr.insertCell();
			td.innerHTML=teshu_type_content;  // 这个代码有可能是标记 派前电联
			
			var td =tr.insertCell();
			td.innerHTML='待签收'; 
		};
		
		// 设置表格格式
		createTable.setAttribute("border","1");  // 线框宽度
		createTable.setAttribute("cellspacing","0");  // 取消表格间距
		createTable.setAttribute("align","center");  // 居中显示 left，right，center
		
		// 创建的表格添加到网页中
		divTable.append(createTable);
	},
	// -----------------------------------------------------------------------------------------------------------
};


//---------------------------------------------
// ---------------------------------------------------
//  从表格中提取快递单号，并提交数据
var runConfigTwo={
	
	// --------------------------------------------------------------------------------------
	listIdTimeCode:function(){
		function rst(m){
			if(m<10){
				m = '0'+m;
			};
			return m;
		};
		
		var myDate = new Date();
		var y = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		var m = myDate.getMonth()+1; 
		var d = myDate.getDate(); //获取当前日(1-31)
		
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var mm = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds(); //获取当前秒数(0-59)
		var ss = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
		if(ss<100){
			ss = '0'+ ss
		}
		
		var str = y + rst(m) + rst(d) + rst(h) + rst(mm) + rst(s) + ss
		return str
	},
	
	// --------------------------------------------------------------------------------------
	getFullTime:function(){
		function rst(m){
			if(m<10){
				m = '0'+m;
			};
			return m;
		};
		
		var myDate = new Date();
		var y = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		var m = myDate.getMonth()+1; 
		var d = myDate.getDate(); //获取当前日(1-31)
		
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var mm = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds(); //获取当前秒数(0-59)
		var str = y +'-'+ rst(m) +'-'+ rst(d) +' '+ rst(h) +':'+ rst(mm) +':'+ rst(s)
		return str
	},
	// ----------签收快递包裹-----------------------------------------------------------------
	// code.......
	postData:function(index,waybillId,signName){
		
		// var waybillId = 'JT5101032077079';
		var listId = runConfigTwo.listIdTimeCode() + config.resContent['networkCode']   // 生成一个编号
		// console.log(listId)
		
		
		const data = [{
            'deliveryMobile':'13317287105',
             'listId':listId,  //后8位会变   清单编号，不能为空  '571913020220215181925157'
             'scanNetworkCity':'十堰市',
             'scanNetworkContact':'15271367522',
             'scanNetworkProvince':'湖北省',
             'scanNetworkTypeId':'336',
             'scanNetworkTypeName':'网点',
             'scanPda':'a0de2fb1cb952d9b065fc4d44d986dcc',
             'scanTime':runConfigTwo.getFullTime(), // '2022-02-15 17:19:06'
             'signId':'0',
             'signName':signName,
             'signer':'潘霞',
             'waybillId':waybillId,
        }];
		var dataStr = JSON.stringify(data);
		// console.log(dataStr);
		var contentLength = dataStr.length.toString();
		var headers_new = config.headerTwo;
		headers_new['authToken'] = config.resContent['token'];
		headers_new['Content-Length'] = contentLength;
			
		GM_xmlhttpRequest({
			method: "post",
			url: 'https://bc.jtexpress.com.cn/bc/scanList/uploadSigningData',
			
		    // data 只能接收字符串
		    data:dataStr,
			headers:headers_new,
			
			onload: function(res){
				if(res.status === 200){
					console.log('发起签收请求，返回状态码200，请判断是否有数据返回！！！');
					// console.log(res.response);
	
		            jsonData = JSON.parse(res.response);
		            // console.log(res.responseHeaders);
			
		            // 数据获取结果
		            dataList_result = jsonData['msg'];
					console.log(dataList_result);
					dataList_result = '签收结果：' + dataList_result
					
					// dataList = jsonData['data'];
					// console.log(dataList);
					

					// 将获取到的结果状态值写入 HTML
					var mytable = document.querySelector("#div_table > table");
					mytable.rows[index].cells[6].innerHTML = dataList_result;
					
				}else{
					console.log('失败')
					console.log(res)
				}
			},
			onerror : function(err){
				console.log('error')
				console.log(err)
			}
		});
	},
	
	//----------

	//--------------------------------------------------------------------------------------
	// --------------从表格中获取签收信息------------------------------------------------------
	getTableRowCellsLength:function(ad){
		var mytable = document.querySelector("#div_table > table");
		console.log("总记录数",mytable.rows.length);
        // 签收成功数量
        var rightNumber = 0
        var timeCode = 1  //初始化时间间隔
		for(var index=0,total = mytable.rows.length;index < total;index++){
			// console.log(mytable.rows[index]);
            // 从表格中获取快递单号
            var waybillId = mytable.rows[index].cells[0].innerHTML;
			
			// 签收状态
			var qianshouCode = mytable.rows[index].cells[6].innerHTML;
			
			// 从表格中提取状态  判断是否特殊件
			var teshu_type_messge = mytable.rows[index].cells[6].innerHTML;

			if(teshu_type_messge.indexOf("务必电联") != -1 || qianshouCode.indexOf("待签收") == -1){
				console.log("务必电联 或非待签件,跳过操作")
			}else{
                // 10-5随机数 (用于设置定时的随机时间)
                // var timeCode = Math.round(Math.random()*(10-5)+5);

                // 签收成功数量写入网页
                rightNumber += 1;

                jieguoElement  = document.querySelector("#p_result_qianshoushuliang_id");
                
                // 从表格中获取地址类型 （石鼓 / 凉水河）
                var addressType = mytable.rows[index].cells[4].innerHTML;
                // 定时签收（每间隔10-5秒签收一个）
                time_long = Math.round(Math.random()*(10-5)+5);
                // 更新10-5随机数 (用于设置定时的随机时间)
                timeCode =timeCode +  time_long;

                (function(index,timeCode,waybillId,addressType,timeCode,time_long,rightNumber,jieguoElement,addressType){
                    setTimeout(function(){
                        // 这里放置签收代码
                        //--------------------------------------------------

                        // 开始签收，并将结果返写回网页table
                        // post_number_to_yundachaoshi(shipId,recePhone,index);

                        if(addressType.indexOf("凉水河") != -1 && ad == 'ls'){
                            signName = '凉水河韵达快递超市';
                            // 签收 并写入结果 代码
                            // console.log(index,waybillId,signName)
                            runConfigTwo.postData(index,waybillId,signName);
                            //alert("签收确认弹窗");
                        }else if(addressType.indexOf("石鼓") != -1 && ad == 'sg'){
                            signName = '石鼓圆通快递超市';
                            // 签收 并写入结果 代码
                            // console.log(index,waybillId,signName)
                            runConfigTwo.postData(index,waybillId,signName);
                            //alert("签收确认弹窗");
                        }else if((addressType.indexOf("石鼓") != -1 || addressType.indexOf("凉水河") != -1 ) && ad == 'all'){
                            //
                            if(addressType.indexOf("凉水河") != -1 ){
                                signName = '凉水河韵达快递超市';
                            }else if (addressType.indexOf("石鼓") != -1 ){
                                signName = '石鼓圆通快递超市';
                            } else{
                                console.log('未识别地址')
                            };
                            runConfigTwo.postData(index,waybillId,signName);
                        }else{
                            console.log('未识别地址不签收');
                            console.log(addressType);
                        };
                        
                        jieguoElement.innerHTML = '运行了：' + rightNumber + ' 个签收，' + '最近一个签收的时间间隔是：' + time_long + '秒';
                        
                        //--------------------------------------------------
                        // 放置的签收代码至这里完结
                    },(timeCode)*1*1000);

                })(index,timeCode,waybillId,addressType,timeCode,time_long,rightNumber,jieguoElement,addressType)

			};
		};
	},
};
