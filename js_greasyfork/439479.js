// ==UserScript==
// @name         【韵达】韵达快递超市_第2版
// @namespace    manji
// @license      manji
// @version      0.0.15
// @description  try to take over the world!
// @author       You
// @match        *ydcspc.dongputech.com/#/in*
// @match        *ydcspc2.dongputech.com:32471/#/in*
// @match        *ydcspc2*
// @match        *ydcspc*
// @match        *ydcspc.dongputech.com/#/dashboard*
// ----------------------------------------------------
// @match        https://yzzsweb.kdy100.com/index.html#/home/index
// @match        http*://yzzsweb.kdy100.com/index.html*
// @match        https://yzzsweb.kdy100.com/#/home/index
// ----------------------------------------------------
// @grant        GM_xmlhttpRequest
// @connect      
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/439479/%E3%80%90%E9%9F%B5%E8%BE%BE%E3%80%91%E9%9F%B5%E8%BE%BE%E5%BF%AB%E9%80%92%E8%B6%85%E5%B8%82_%E7%AC%AC2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/439479/%E3%80%90%E9%9F%B5%E8%BE%BE%E3%80%91%E9%9F%B5%E8%BE%BE%E5%BF%AB%E9%80%92%E8%B6%85%E5%B8%82_%E7%AC%AC2%E7%89%88.meta.js
// ==/UserScript==


// ==============页面中插入元素===================================

getCodeFormZS(); // 获取驿站助手中的参数
let div=document.createElement("div");
div.innerHTML =`
    <div id="yundachaoshi" style=" text-align:center;background-color: #d5d2d8;">
        <div id="div_id_button">
            <button type="button" id = "button_id_01">获取数据</button>
        </div>
        <div id="div_teshujian">
            <h2>特殊单号</h2>
            <table id = "batle_id_teshu"  border=1   cellspacing=0 style="margin-left:auto; margin-right:auto;white-space: nowrap" >
                <thead id = "thead_teshudanhao">
                    <tr>
                        <th>快递单号</th>
                        <th>手机号</th>
                        <th>助手出库时间</th>
                        <th>订单备注</th>
                    </tr>
                </thead>
                <tbody id = "tbody_teshudanhao_01">
                    
                </tbody>
            
            </table>

        </div>
        <p></p>
        <div id="div_putongjian">
            <h2>普通单号</h2><button type="button" id = "button_id_02">提交</button>
            <table id = "table_id_putong" border=1   cellspacing=0 style="margin-left:auto; margin-right:auto;white-space: nowrap" >
                <thead  id = "thead_putong">
                    <tr>
                        <th>快递单号</th>
                        <th>手机号</th>
                        <th>助手出库时间</th>
                        <th>订单备注</th>
                    </tr>
                </thead>
                <tbody id = "tbody_putong">
                </tbody>

            </table>
        </div>
    </div>
`;
// document.body.append(div);

if(window.location.href.indexOf("ydcs")!=-1){
    console.log('准备开始插入元素......');
	var num = 0;
	function loopIput(){
	    var theElement = document.querySelector(".content");
	    num++;
	    if(theElement){
	        theElement.appendChild(div);
	        console.log('插入元素完成');
	        clearInterval(t);
	    }else{console.log('插入元素失败');};
	    console.log('这是第：',num,'次运行函数插入');
	    if(num>120){clearInterval(t);};
	};
	var t = setInterval(loopIput,1000); // 每隔1秒检查一次 运行一次函数，直到运行成功,若果运行30次还没成功，则终止
};

// ==============页面中插入元素===================================

// 绑定元素点击事件
div.onclick=function(event){
    if(event.target.id=="button_id_01"){
        // alert("准备开始运行查询：");
        var startdate = strToday();
        var enddate = strToday();
        // var startdate = "2022-02-10";
        // var enddate = "2022-02-10";

        // 先清空表格
        clear_all_table();

        // 执行操作
        request_post_get_data_yundachaoshi(startdate,enddate);
        alert("数据查询完成");

    }else if(event.target.id=="button_id_02"){
        alert("准备开始运行提交程序：");
        var id = "table_id_putong";
        getTableRowCellsLength(id);
        alert("入库操作完成，请检查！！！");
    };
};


// --------------------------------------------------------
// =============================定义的函数================================
// 解题思路



// 查询韵达快递 今日入库清单
//  --------------------------------------------------
function request_post_get_data_yundachaoshi(startdate,enddate){
	//
	// var startdate = "2022-01-31";
	// var enddate = "2022-01-31";
	var url = '/gateway/interface';
	var xmlhttp=createXMLHttp();
	var data = {
		"action":"appMarket.appMarket.ship.WebQueryShipList",
		"appid":"wg2zkto8e3jmvzmp",
		"token":getCookie("token"),
		"req_time":new Date().getTime(), // 当前时间戳
		"version":"V1.0",
		"data":{"agentId":"153096",
				"accountPhone":"",
				"date":startdate + "," + enddate, // "2022-01-31,2022-01-31"
				"dateType":"arrive",
				"company":"",
				"pageNum":1,
				"pageSize":500,
				"pickCode":"",
				"receName":"",
				"phone":"",
				"shipId":"",
				"state":"shipment_sending,shipment_sendself,shipment_unnotice,shipment_signed,shipment_back,shipment_notout",
				"storeOrTimeout":"",
				"type":"4",
				"deliverType":"",
				"smsStatus":""}
	}

	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type","application/json; charset=UTF-8");
	xmlhttp.send(JSON.stringify(data));  // 要发送的参数，要转化为json字符串发送给后端，后端就会接受到json对象
	// readyState == 4 为请求完成，status == 200为请求陈宫返回的状态
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			ydcsdata_all = xmlhttp.responseText;
			// 嵌套 
			request_post_get_data_yizhanzhushou(ydcsdata_all,startdate,enddate,new_Authorication);
			
			// console.log(xmlhttp.responseText);
            console.log('韵达超市数据条数：',JSON.parse(xmlhttp.responseText)["body"]["data"]["total"]);
		};
	};
};




// 驿站助手快递清单
// --------------------------------------------------------------------
var new_Authorication = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDUwODg1MjQsInN1YiI6ImI3YmUyMzZhMTBmN2UyODRjY2RkNzk0NGI1MDdmNzkzIiwicGhvbmVOdW0iOiIxNTcwNzI5NTE4NSIsImlzcyI6IlAwNzI4NjYyOGNmLTBlMTAtNDQ0MS05ODY3LWJhOWNiY2Y1NGJjOSJ9.LyAkEfGbhERnwYRhgf8yoIQv7duSWs6btUZAyXTUeEc";
// var new_Authorication = '';
function request_post_get_data_yizhanzhushou(ydcsdata_all,startdate,enddate,new_Authorication){
	//
	var startdate = startdate + " 00:00:00";
	var enddate = addDate(enddate,1) + " 00:00:00";
	var url = "https://yzzs.kdy100.com:1991/mossapi/mossp.expressj/queryExpressListV4"; // https://yzzs.kdy100.com:1991/mossapi/mossp.expressj/queryExpressListV4
	var xmlhttp=createXMLHttp();
	var data ={"userId":"P07286628cf-0e10-4441-9867-ba9cbcf54bc9",
		"startTime":startdate,
		"endTime":enddate,
		"packStatus":"",
		"companyId":103,
		"notifyStatus":"",
		"stockDay":"",
		"mailNum":"",
		"callee":"",
		"packNum":"",
		"sortBy":0,
		"sortOrder":"desc",
		"currentPage":1,
		"pageSize":500,
		"queryModel":"QueryInTime"
	};
	
	var headers = {
		"Content-Type": "application/json;charset=UTF-8",
	    "Authorication": new_Authorication,
	    "Accept": "application/json, text/plain, */*",
	    "mossctx-versionCode": "2080006",
	    "mossctx-clientType": "WEB",
	    "Accept-Language": "zh-CN,zh;q=0.9"
	};

	xmlhttp.open("POST", url, true);
	// 设置请求头
	for(var item in headers){
		//
		xmlhttp.setRequestHeader(item,headers[item]);
	};
	xmlhttp.send(JSON.stringify(data));  // 要发送的参数，要转化为json字符串发送给后端，后端就会接受到json对象
	// readyState == 4 为请求完成，status == 200为请求陈宫返回的状态   && xmlhttp.status == 200
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                //
                //
                jsonData = JSON.parse(xmlhttp.responseText);
                var datalist_total = jsonData.expressPackCount;  // 全部记录条数
                console.log("总数据记录(条)：expressPackCount",datalist_total,"条");			
                var datalist = jsonData.expressPackLst;  // 存放记录的列表
                var datalist_long = datalist.length  // 显示出来的记录条数
                console.log("当前显示记录数(条)：expressPackLst.length",datalist_long);
                
                if(datalist_long>0){
                    //
                    for(var dataNu=0;dataNu<datalist_long; dataNu++){
                        var everyData = datalist[dataNu];
                        // 运单号码
                        // var yundan_nu = everyData.mailNum;
                        // var phone = everyData.callee;
                        var outTime = everyData.outTime;
                        if(outTime =="0000-00-00 00:00:00"){outTime="助手待出库"};
                        console.log("运单号码：",yundan_nu,"手机号码：",phone,"出库时间",outTime);
                        
                        // 定义填写表格需要用到的字段
                        var tabale_tr_dic = new Array();
                        tabale_tr_dic["number"] = everyData.mailNum; // 运单号码
                        tabale_tr_dic["phone"] = everyData.callee; // 手机号码
                        tabale_tr_dic["outTime"] = outTime; // 出库时间；
                        
                        // 判断是否入库
                        compareNum(ydcsdata_all,tabale_tr_dic) 
                    };
                }else{
                    console.log('驿站助手数据获取数据长度小于0 ：',xmlhttp.status);
                    alert("请尝试在当前浏览器 登录驿站助手,或者刷新驿站助手页面之后，再返回该页面点确认操作！");
                    new_Authorication = getCodeFormZS(); // 从驿站助手重新获取值
                    request_post_get_data_yizhanzhushou(ydcsdata_all,startdate,enddate,new_Authorication);
                };
            }else{
                //
                console.log('驿站助手数据请求遇到错误代码：',xmlhttp.responseText);
                alert("请尝试在当前浏览器 登录驿站助手,或者刷新驿站助手页面之后，再返回该页面点确认操作！");
                new_Authorication = getCodeFormZS(); // 从驿站助手重新获取值
                request_post_get_data_yizhanzhushou(ydcsdata_all,startdate,enddate,new_Authorication);
            };
		};
	};
};

//----


// 检查是否特殊件
// ------------------------------------------------------------------
function teshujian(tabale_tr_dic){
	//
	// var startdate = "2022-01-31";
	// var enddate = "2022-01-31";
	var kuaidi_number = tabale_tr_dic["number"];
	var url = "/gateway/interface";
	var xmlhttp=createXMLHttp();
	var data = {
		"action": "appMarket.appMarket.ship.specialShipCheck240",
		 "appid": "wg2zkto8e3jmvzmp",
		 "token": getCookie("token"),
		 "req_time": new Date().getTime(), // 时间戳 new Date().getTime()   1643593610765
		 "version": "V1.0",
		 "data": {"agentId": "153096",
		  "shipId": kuaidi_number,   // 快递单号 kuaidi_number
		  "chopper": true,
		  "company": "express_yunda",      // 快递公司名称 "express_yunda"
		  "deviceTypeNew": "PC",
		  "osVersion": "WINDOWS"}
	  };

	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type","application/json; charset=UTF-8");
	xmlhttp.send(JSON.stringify(data));  // 要发送的参数，要转化为json字符串发送给后端，后端就会接受到json对象
	// readyState == 4 为请求完成，status == 200为请求陈宫返回的状态
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var ydcsdata_all_2 = xmlhttp.responseText;
			var ydbodymessage = JSON.parse(ydcsdata_all_2).body.message;  //  操作成功  特殊件
			var ydbodymessagetype = JSON.parse(ydcsdata_all_2).body.data.type; // 特殊件类型
			var queryMessage = ydbodymessage + ":" + ydbodymessagetype;
			
			if(queryMessage.indexOf("操作成功")!=-1){
				//
                tabale_tr_dic["messageType"] = "普通件";
				// tabale_tr_dic["messageType"] = queryMessage;
				tabale_tr_dic["messageType"] = "普通件-待入库_查询：" + queryMessage;
				console.log("普通件：",queryMessage);
				inputTable("putong",tabale_tr_dic);	
			}else{
				//
                tabale_tr_dic["messageType"] = "未入库_" + queryMessage;
				console.log("特殊件：",queryMessage);
				inputTable("teshu",tabale_tr_dic);
			};

		};
	};
};

// teshujian("432366722692716");


// ---------------------------------------------------------------------------------
//  判断是否在列表中
function compareNum(ydcsdata_all,tabale_tr_dic){
	// ydcsdata_all 长字符串，thisNu传入的快递单号
	var thisNu = tabale_tr_dic["number"];
	if(ydcsdata_all.indexOf(thisNu) == -1 ){
		// 包含
		console.log("驿站助手的快递单号，在韵达快递中没有包含关系，代表没有入库。开始进行入库判断操作，单号：",thisNu);
		// 开始入库判断操作
		// 判断是否特殊件
		teshujian(tabale_tr_dic);
		
		
	}else{
		console.log("驿站助手的快递单号，在韵达快递中没有包含关系，代表已入库。跳过入库NO.",thisNu);
	};
};


//------------------------------------------------------------------------------------
// 填写页面表格
function inputTable(tableName,tabale_tr_dic){
	//
	if(tableName == "teshu"){
		// 填写1表
		console.log("准备填写 特殊状态表");
		var tbody = document.querySelector("#tbody_teshudanhao_01");
		var thead = document.querySelector("#thead_teshudanhao");	
	}else if(tableName == "putong"){
		// 填写2表
		console.log("准备填写 普通状态表");
		var tbody = document.querySelector("#tbody_putong");
		var thead = document.querySelector("#thead_putong");
	}else{
		// 未识别到填写哪张表
		console.log("未识别到填写哪张表");
	};
	
	try{
		//
		// 产生一个tr，新添加行等于复制隐藏行
		var newTr = thead.firstElementChild.cloneNode(true);
		// 添加数据
		newTr.children[0].innerHTML = tabale_tr_dic["number"];
		newTr.children[1].innerHTML = tabale_tr_dic["phone"];
		newTr.children[2].innerHTML = tabale_tr_dic["outTime"];
		newTr.children[3].innerHTML = tabale_tr_dic["messageType"];
		// 将一个tr追加到tbody
		tbody.appendChild(newTr);
	}catch(err) {
		console.log(err.message);
	}
};

//-------------------------------------------------------------------
// 日期加1
function addDate(date,days){ 
   var d=new Date(date); 
   d.setDate(d.getDate()+days); 
   var m=d.getMonth()+1; 
   return d.getFullYear()+'-'+m+'-'+d.getDate(); 
}; 
// addDate('2021-12-31',1)
 
function strToday(){
	//
	var myDate = new Date();
	var m=myDate.getMonth()+1; 
	return myDate.getFullYear()+'-'+m+'-'+myDate.getDate(); 
};

// ---------------------------------------------------
//  从表格中提取快递单号，并提交数据
var id = "table_id_putong";
function getTableRowCellsLength(id){
    var mytable = document.getElementById(id);
	console.log("总记录数",mytable.rows.length);
    for(var index=1,total = mytable.rows.length;index < total;index++){
		// console.log(mytable.rows[index]);
		
		// 从表格中获取快递单号
		var shipId = mytable.rows[index].cells[0].innerHTML;
		
		// 从表格中获取手机号码
		var recePhone = mytable.rows[index].cells[1].innerHTML;
		
		// 从表格中提取状态  驿站助手入库状态
		var zs_zhuangtai = mytable.rows[index].cells[2].innerHTML;
		
		// 从表格中提取状态  普通件-待入库
		var beizhu_messge = mytable.rows[index].cells[3].innerHTML;
		
		if(beizhu_messge.indexOf("待入库") == -1 || zs_zhuangtai.indexOf("助手待出库") == -1 ){
			console.log("已入库，跳过操作")
		}else{
			// 开始入库韵达快递超市，并将结果返写回网页table
			post_number_to_yundachaoshi(shipId,recePhone,index);
		};
		
    };
};
// getTableRowCellsLength(id);


//------------------------------------------------------------------------------------
// 获取cookie中值的函数
function getCookie(name) {
    var prefix = name + "="
    var start = document.cookie.indexOf(prefix)
 
    if (start == -1) {
        return null;
    }
 
    var end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
 
    var value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
};

//------------------------------------------------------------------------------------
// post 提交快递信息到韵达快递超市
function post_number_to_yundachaoshi(shipId,recePhone,index){
	
	// var recePhone = "13252104995";  // 入库手机号码
	// var shipId = "ceshi00000123";  // 入库快递单号
	var company = "express_yunda"  // 入库快递公司
	// var data = {"action": "appMarket.appMarket.ship.arriveShip176",
	// 	 "appid": "wg2zkto8e3jmvzmp",
	// 	 "token": getCookie("token"),
	// 	 "req_time": 1644592065195,
	// 	 "version": "V1.0",
	// 	 "data": {"items": [{"company": company,
	// 		"isUpLogistics": "true",
	// 		"fastArrive": "",
	// 		"pickCode": "02114995",
	// 		"shelfNumber": "0211",
	// 		"receName": "",
	// 		"ydUserId": "",
	// 		"recePhone": recePhone,
	// 		"shipId": shipId,
	// 		"isFirstUser": "",
	// 		"zsScanFlag": "0",
	// 		"zsScanTime": strTodayTimeShow(),  // "2022-02-11 22:57:25"
	// 		"batchNumber": "",
	// 		"arriveRemark": "",
	// 		"deliverType": 1,
	// 		"userTag": "",
	// 		"shipTag": ""}],
	// 	  "firstUserOpenVoice": "false",
	// 	  "ztSpecialSwitch": "false",
	// 	  "myAgentInfo": {"accountPhone": "15707295185",
	// 	   "agentId": "153096",
	// 	   "source": "3",
	// 	   "userId": "57260",
	// 	   "firstUserOpenVoice": "false"},
	// 	  "smsOptMode": "1"},
	//   };


    // 注意 data中action的值可能会变，表示接口
	var data = {"action": "appMarket.appMarket.ship.arriveShip290",
		 "appid": "wg2zkto8e3jmvzmp",
		 "token": getCookie("token"),
		 "req_time":new Date().valueOf(), // 1644592065195
		 "version": "V1.0",
		 "data": {"items": [{"company": company,
			"isUpLogistics": "true",
			"fastArrive": "Normal",
			"pickCode": "09182325",
			"shelfNumber": "0918",
			"receName": "",
			"ydUserId": "",
			"recePhone": recePhone,
			"shipId": shipId,
			"isFirstUser": "",
			"zsScanFlag": "0",
			"zsScanTime": strTodayTimeShow(),  // "2022-02-11 22:57:25"
			"batchNumber": "",
			"arriveRemark": "",
			"deliverType": 1,
			"userTag": "",
			"shipTag": "",
            "webScanTime":strTodayTimeShow()}],  // "2022-02-11 22:57:25"
		  "firstUserOpenVoice": "false",
		  "ztSpecialSwitch": "false",
		  "myAgentInfo": {"accountPhone": "15707295185",
		   "agentId": "153096",
		   "source": "3",
		   "userId": "57260",
		   "firstUserOpenVoice": "false"},
		  "smsOptMode": "1"},
	  };

	var url = "/gateway/interface";
	var xmlhttp=createXMLHttp();
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type","application/json; charset=UTF-8");
	xmlhttp.send(JSON.stringify(data));  // 要发送的参数，要转化为json字符串发送给后端，后端就会接受到json对象
	// readyState == 4 为请求完成，status == 200为请求陈宫返回的状态
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var text_data = xmlhttp.responseText;
			var json_data = JSON.parse(text_data)
			
			// 请求是否成功 True or False
			var result_type = json_data.body.result;  //  'result': False  或者  'result': True
			
			// 请求返回的代码 成功是0，重复单号是 103
			var result_code = json_data.body.code; 
			
			// 请求返回的状态信息(如果成功返回 请求成功，失败返回快递单号)
			var result_message = json_data.body.message;
			
			// 根据 请求是否成功 True or False  修改返回信息
			if(result_type){
				//
				result_message = "入库成功";
				// console.log("入库韵达超市成功：",shipId);
			}else{
				// 如果返回 false 则将返回信息修改为
				if(result_code == 103){
					result_message = "重复入库_代码：" + result_code + '，' + result_message;
				}else{
					result_message = "入库失败×××错误代码："+result_code + '，' + result_message;
				};
				
			};
			
			//  将入库状态填写在网页表格中
			var id = "table_id_putong";
			var mytable = document.getElementById(id);
			mytable.rows[index].cells[3].innerHTML = result_message;
	
		};
	};
	
	
}


//------------------------------------------------------------------------------
// 获取当前时间 "2022-2-12 9:30:22"
function strTodayTimeShow(){
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth()+1;//得到月份
	var date = now.getDate();//得到日期
	// var day = now.getDay();//得到周几
	var hour= now.getHours();//得到小时数
	var minute= now.getMinutes();//得到分钟数
	var second= now.getSeconds();//得到秒数
	
	return year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second; 
};


//------------------------------------------------------------------------------
// 清空页面表格
function clear_all_table(){
	document.querySelector("#tbody_teshudanhao_01").innerHTML="";
	document.querySelector("#tbody_putong").innerHTML="";
};


//----------------------------------------------------------------------------------
function createXMLHttp(){
	 //创建一个新变量并赋值false，使用false作为判断条件说明还没有创建XMLHTTPRequest对象 
	 var flag=true;
	 
	 var xmlhttp = null;
	 try{
		 //尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
		 xmlhttp=new XMLHttpRequest();
	 }catch(e){
		 try{
			 //使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
			 xmlhttp=ActiveXobject("Msxml12.XMLHTTP");
		 }catch(e1){
			 try{
				 //使用较老版本的 IE 创建 IE 兼容的对象（Microsoft.XMLHTTP）。
				 xmlhttp=ActiveXobject("Microsoft.XMLHTTP");
			 }catch(e2){
				 flag=false; 
			 } 
		 }
	 };
	
	//判断是否成功的例子：
	 if(!flag){
		 throw new RuntimeExecption("创建XMLHTTPRequest 对象失败");
	 }else{
		 return xmlhttp;
	 };
};


// -------------Authorication 值传递-------------------------------
//  助手传值
function getCodeFormZS(){
	//
	if(window.location.href.indexOf("yz")!=-1){
		if(sessionStorage.getItem("authorication")!=null){
			//
			GM_setValue('form_zs_code',sessionStorage.getItem("authorication"));
			alert('成功在驿站助手登录中获取 Authorication 值');
		}else{
			//
			alert('未在驿站助手网址中发现 Authorication 值，请检查驿站助手是否在当前浏览器登录');
		};
		console.log('驿站助手 Authorication 值 获取程序 运行结束。');
	};
	
	var zs_code = GM_getValue('form_zs_code');
	console.log('获取到的值为：',zs_code);
	return zs_code;
};