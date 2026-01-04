// ==UserScript==
// @name         【YD】多多驿站
// @namespace    manji
// @license      manji
// @version      0.0.5
// @description  多多驿站脚本
// @match        https://jinbao.pinduoduo.com/
// @match        https://mms.pinduoduo.com/other/questionnaire?surveyId=16915304967
// @match        https://www.jtexpress.com/aboutUs
// @match        http*://yzzsweb.kdy100.com*
// @author       You
// @grant        GM_xmlhttpRequest
// @connect      mdkd-api.pinduoduo.com
// @connect      yzzsweb.kdy100.com/
// @connect      yzzs.kdy100.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/440822/%E3%80%90YD%E3%80%91%E5%A4%9A%E5%A4%9A%E9%A9%BF%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/440822/%E3%80%90YD%E3%80%91%E5%A4%9A%E5%A4%9A%E9%A9%BF%E7%AB%99.meta.js
// ==/UserScript==

let div=document.createElement("div");
div.innerHTML = `
	<div id="">
		<div id=""  style="text-align:center">
			<h1>助手单号（极兔快递）自动入多多驿站</h1>
			<p>助手总订单数：</p>
			<p>多多驿站总订单数：</p>
			
		</div>
		
		<!-- 助手未入 多多驿站订单 -->
		<h3 style="text-align:center">1.1 助手未入 多多驿站订单</h3>
		<p style="text-align:center">
			<button type="button"  id = 'button_id_zs_getdata'>获取未入订单</button>
			<button type="button"  id = 'button_id_zs_request'>批量入库多多</button>
		</p>
		<div id="div_id_zs" >
			<table id = "table_id_zs" border="5" cellspacing="0" cellpadding=""  style="margin-left:auto; margin-right:auto;white-space: nowrap">
				<thead>
					<tr>
						<td>助手运单号码</td>
						<td>助手快递名称</td>
						<td>助手手机号码</td>
						<td>助手出库状态</td>
						<td>多多快递名称</td>
						<td>多多快递代码</td>
						<td>多多取件码</td>
						<td>多多入库状态</td>
					</tr>
				</thead>
				<tbody>
				</tbody>

			</table>
		</div>
		
		
		<!-- 多多驿站未出库订单 -->
		<h3 style="text-align:center">2.1 多多驿站未出库的订单</h3>
		<p style="text-align:center"><button type="button"  id = 'button_id_dd_chuku'>多多驿站批量出库</button></p>
		<div id="div_id_dd_daichu">
			<table id = "table_id_daichu" border="5" cellspacing="0" cellpadding=""  style="margin-left:auto; margin-right:auto;white-space: nowrap">
				<thead>
					<tr>
						<td>多多ID</td>
						<td>运单号码</td>
						<td>手机号码</td>
						<td>姓名</td>
						<td>出库状态码</td>
						<td>操作状态</td>
					</tr>
				</thead>
				<tbody>	
				</tbody>

			</table>
		</div>
		
		<!-- 多多驿站已出库的订单 -->
		<h3 style="text-align:center">2.2 多多驿站已出库的订单</h3>
		<div id="div_id_dd_yichu">
			<table id = "table_id_yichu" border="1" cellspacing="0" cellpadding=""  style="margin-left:auto; margin-right:auto;white-space: nowrap">
				<thead>
					<tr>
						<td>多多ID</td>
						<td>运单号码</td>
						<td>手机号码</td>
						<td>姓名</td>
						<td>出库状态码</td>
						<td>操作状态</td>
					</tr>
				</thead>
				<tbody>
				</tbody>

			</table>
		</div>
		
	</div>
`
// document.body.innerHTML = '';
// document.body.append(div);
// alert('插入元素完成');


if(window.location.href.indexOf("www.jtexpress.com/aboutUs")!=-1){
    console.log('准备开始插入元素......');

	var theElement = document.body;
	if(theElement){
		document.body.innerHTML = '';
		theElement.append(div);
		console.log('插入元素完成');
	}else{
		console.log('插入元素失败');
	};

};

// -----------------------------------------------------------------------------------------
if(window.location.href.indexOf("kdy100")!=-1){
	runGet.getCodeFormZS();
};

// 绑定点击元素
// 绑定元素点击事件
div.onclick=function(event){
    if(event.target.id=="button_id_zs_getdata"){
        alert("准备开始获取未入订单：");
		runGet.cleanTable();  // 清空表格
		
		// config.waybillCodeAll = [];   // 清空 存储的列表
		
		runGet.get_waybillCode_allList();  //获取多多所有单号
		
		// 获取助手数据
		var startdate = config.zs.strToday();
        var enddate = config.zs.strToday();
		runGet.request_post_get_data_yizhanzhushou(startdate,enddate);


    }else if(event.target.id=="button_id_zs_request"){
        alert("准备开始批量提交入库：");
		
		
		runto.readTable_zs();  // 循环表格入库
		
    }else if(event.target.id=="button_id_dd_chuku"){
		alert("准备开始批量出库：");
		runOut.readTable_dd_daichu();
	};
};

//----------------------------------------------------------------------------------------------
// 开始代码编写正文

// 定义常用参数
var config={
	
	headers_phone:{
		"anti-content": "2af7w2KcT1h/34g9eMgvx4yPgSYA7Ttn0FN5ETh8kVVXp1b74kMQXlRbBO9EjDmBpbi7hnwTM1g93Rzl/4fLIRJzXniJz/Nnp4HuQl6BLQmsAvsJXgPTuqwYj9qclshCwW0xTnuxI4GfR5J1X5InVIkj+gBklAw1jsvidYTkxin5PHo3f33DLz+PhJe4hnzWI4XVEeHrr0FSbnV1qJhE/ZaDHJN93Jus4Xj9gXy6zm+sRTy7RdoOTsJlPQ8S6ZQcU4ND/9Ujwx0WPcfZjlqT7oO/Kg5KRtOhjrzaSb2HzHmsYD14Fm4pBxmW5LFYPz23FNh0Maw+4eyVUCVhEBH2bGWsTd7O9+931Gan/ULKJnm/GjK6kDct1rsLlevk2oGLVUAt0BjfyTqBHJ2KKgcVHPXmEzbs8CAHaUC2pjEb2i+BavONOzNcuODGCq+45P7hb48V7o/BZe2g/1oDHGtPwW9KzDnrYKLoaExdgz4jMx0AL0=",
		"Referer": "Android",
		"cookie": "SUB_PASS_ID=x_eyJ0IjoiemR6THVlcDZnT3ZDVWR1WG4wY0xvUG4rcy9xQ3JnWXJnajVrZHNlVmxtaVdQbXV3VEZJQUI5YytrNzJoSzgwUSIsInYiOjEsInMiOjEwMDYsInUiOjU2NTgyNDYxODM2fQ==",
		"ETag": "Mf7Jfj7H",
		"User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1.2; vmos Build/NZH54D)station_android_version/1.6.2 PackegeName/com.xunmeng.station AppVersion/1.6.2 DeviceType/Mobile AppName/DDStore",
		"AccessToken": "x_eyJ0IjoiemR6THVlcDZnT3ZDVWR1WG4wY0xvUG4rcy9xQ3JnWXJnajVrZHNlVmxtaVdQbXV3VEZJQUI5YytrNzJoSzgwUSIsInYiOjEsInMiOjEwMDYsInUiOjU2NTgyNDYxODM2fQ==",
		"lat": "0.0",
		"p-appname": "DDStore",
		"lng": "0.0",
		"Content-Type": "application/json;charset=utf-8",
		"Content-Length": "147",
		"Host": "mdkd-api.pinduoduo.com",
		"Connection": "Keep-Alive",
		"Accept-Encoding": "gzip"
	},

    headers_pc:{
        'authority': 'mdkd-api.pinduoduo.com',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92"',
        'anti-content': '0apWtxUkM_VenaESnlL56PdmMeB__2Urx3MZUCQMLAepBWv-2wv7RSH3LkF1RVzkQD--Qe0Fz3qCIbRa6XzQUuusS0CeCQwnYwalYf8lUfjndgal0eYnlwjl0nxnr9ylUw8O09Y0BZa5l2q8JuROdGYO14xK1S_lrNInquSvAivYy22fxxKDS33OetC5fGZVkL2cwtwanYg7IP4Yg_damBVf4ujT0EtQrlgJideEn6edgP08qTgjyAPfpuYQjE2Tdv3QjidadMUG0NJzA6ppni9YNdvyswTL44sbnpyxGtnM0eT1a2SCvQw9VnieaQ02K8f9cCfoftw5b54yGqfaK0f4QCbtgnYx62FpbNnNbtw-8xEdaQdzXTO0Itzd14P2jAqXS1akw9AhstyB8QiyL-6yag6FSdbBjVHUa6',
        'sec-ch-ua-mobile': '?0',
        'etag': 'owfY0WfBfOn9qtvRKaMiJ6NUjpUVdSo0',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 HBPC/12.0.0.300',
        'p-appname': 'DDStore-PC',
        'accept': 'application/json, text/plain, */*',
        'pdd-id': 'owfY0WfBfOn9qtvRKaMiJ6NUjpUVdSo0',
        'origin': 'https://mdkd.pinduoduo.com',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://mdkd.pinduoduo.com/',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cookie': '_bee=owfY0WfBfOn9qtvRKaMiJ6NUjpUVdSo0; _f77=f7559729-cdc6-4cf2-8da5-94c0701e59b4; _a42=9a802325-eed6-4a8a-b79e-a0a1c1a290f0; rckk=owfY0WfBfOn9qtvRKaMiJ6NUjpUVdSo0; ru1k=f7559729-cdc6-4cf2-8da5-94c0701e59b4; ru2k=9a802325-eed6-4a8a-b79e-a0a1c1a290f0; SUB_PASS_ID=x_eyJ0IjoiYVRnVDVaUzhJR1NXaHQrZXhyQnNmdTY4M0VXNG5ua2N1MlJyb1REaExUenlMYnFqZWxxQnM1Uks1QzZMeVJDSiIsInYiOjEsInMiOjEwMDYsInUiOjU2NTgyNDYxODM2fQ==; JSESSIONID=66CE519520A8D20C1C4F9EACCE1A4149',
    },
	
	// 多多所有入库信息
	waybillCodeAll:[],
	
	//驿站助手参数信息
	zs:{
		"new_Authorication":"eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDUwODg1MjQsInN1YiI6ImI3YmUyMzZhMTBmN2UyODRjY2RkNzk0NGI1MDdmNzkzIiwicGhvbmVOdW0iOiIxNTcwNzI5NTE4NSIsImlzcyI6IlAwNzI4NjYyOGNmLTBlMTAtNDQ0MS05ODY3LWJhOWNiY2Y1NGJjOSJ9.LyAkEfGbhERnwYRhgf8yoIQv7duSWs6btUZAyXTUeEc",
		//函数 参数
		strToday:function(){
			// 返回示例 "2022-3-2"
			var myDate = new Date();
			var m=myDate.getMonth()+1; 
			return myDate.getFullYear()+'-'+m+'-'+myDate.getDate(); 
		},
		// 日期加1
		addDate:function(date,days){ 
		    // 示例 addDate("2022-3-2",1)  返回 "2022-3-3"
		   var d=new Date(date); 
		   d.setDate(d.getDate()+days); 
		   var m=d.getMonth()+1; 
		   return d.getFullYear()+'-'+m+'-'+d.getDate(); 
		},
	},
	
	// 多多参数信息
	dd:{
		shelf_number:"",    // 取件码头部编码
	},

};
// 字典复制
// var headers = JSON.parse(JSON.stringify(config.headers_phone));
// delete headers['Content-Length'];

// 更新请求头参数
headers_phone_new = {
	"anti-content": "2af7w2KcT1h/34g9eMgvx4yPq8ouVfA89BJlnL3RtUmL23ICIVLLhKHxR+mMTD1AWngLmArVfHWZJlkxIxhikNWDVT600PJ744aMWrnquoJ3xoxzPylOulGCrlapElqFMjvUlx/+vEk9A/KrxMuem7WoPP7aF9Cfzbh8mzac4JUMGy2I9ppyQWaf73DwrpU5O/7gQIGTSEzp1hzSKiAaXIfkXZqFAUsR7d+KjO2P9RKgMK9cxgSrPixGWz06QQ8gTx1sFJJuo5Hnrj4TXoYe6WfC/nuZuGuP+hqY4wp+1m8uZCZ7FWcE1vdwSsStpR5Ckg36XKtzC6cI/4/gNhtw9FEjRCHETNX9+I9xHzT1NcXaVoc7EB7RBZyBr3/8QBxWca+Ntyxeg4n2K3sJrt1CmQ9KHssMBXEKoJVMq6CZEU2ltcdHVkATL/RwPS2XViXkZrCUDzxprSfGL3rtNhOl5LDxrXjUh/fn8HMRxMLmaHN/NY=",
	"cookie": "SUB_PASS_ID=x_eyJ0IjoiamRCRERlbi9TOW90a3VoSHJNTS9HOVRzNitUSStpS0p0MjhZa0d3Tkd3b2ZDWEZGOWZLUTUxNk9UVHJEMUZTeSIsInYiOjEsInMiOjEwMDYsInUiOjU2NTgyNDYxODM2fQ==",
	"AccessToken": "x_eyJ0IjoiamRCRERlbi9TOW90a3VoSHJNTS9HOVRzNitUSStpS0p0MjhZa0d3Tkd3b2ZDWEZGOWZLUTUxNk9UVHJEMUZTeSIsInYiOjEsInMiOjEwMDYsInUiOjU2NTgyNDYxODM2fQ==",
};
for(var k in headers_phone_new){
	config.headers_phone[k] = headers_phone_new[k];
	console.log(k,":",headers_phone_new[k]);
};


// ----------------------------------------------------------------------------------------------
// 获取未入订单
var runGet = {
	// 获取今天时间戳
	
	// 根据ID获取 运单号、手机号、联系人姓名
	get_waybillCode_messge:function(package_id,msDic){
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		delete headers['Content-Length'];
		var url = 'https://mdkd-api.pinduoduo.com/api/orion/op/package/reverse?package_id=' + package_id
		
		GM_xmlhttpRequest({
			method: "get",
			url: url,
			headers:headers,
			onload: function(res){
				if(res.status === 200){
					console.log('ID:',package_id,'信息请求成功，请查收是否有数据返回');

		            jsonData = JSON.parse(res.response);
					
					dataRes = jsonData['result']
					if(dataRes){
						waybill_code = dataRes['waybill_code']   //运单号码
						mobile = dataRes['mobile']   //手机号码
						customer_name = dataRes['customer_name']   // 姓名
						
						// 将数据存入字典
						msDic['package_id'] = package_id;
						msDic['waybill_code'] = waybill_code;
						msDic['mobile'] = mobile;
						msDic['customer_name'] = customer_name;
						// 将数据存储
						config.waybillCodeAll.push(msDic);
						// 将结果写入到网页
						runGet.inputTable_ms(msDic);
						
					}else{
						console.log('ID:',package_id,'信息请求成功，返回数据未识别',jsonData);
					};
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
	
	// 获取 列表中的所有单号
	get_waybillCode_allList:function(){
		//
		var page_size = 100 ;  // 每页数据条数
		var page_index = 1;   // 页码
		var offset = (page_index-1)*page_size;    //每页数据偏移量
		
		var data ={
			"page_size": page_size,
			// "waybill_status": "100",     //  表示待自提包裹，如果此条不写，表示全部状态包裹
			"start_in_cabinet_date": (new Date(new Date(new Date().toLocaleDateString()).getTime())).valueOf(),  // 今天0点时间戳
			"page_index": page_index,
			"offset": offset,   // 这个参数和 翻译有关系  （page_index - 1 ）* page_size
			"end_in_cabinet_date": (new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1)).valueOf()  // 今天23：59：59秒时间戳
		};
		var dataStr = JSON.stringify(data);
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		var contentLength = dataStr.length.toString();
		headers['Content-Length'] = contentLength;
		url = 'https://mdkd-api.pinduoduo.com/api/orion/op/package/search';
		
		GM_xmlhttpRequest({
			method: "post",
			url: url,
			headers:headers,
			data:dataStr,
			onload: function(res){
				if(res.status === 200){
					console.log('多多列表信息请求成功，请查收是否有数据返回');
		            dataJSon = JSON.parse(res.response);
					// console.log(dataJSon);
					detail = dataJSon['result'];
					if(detail){
						total = detail['total'];
						console.log(总数据条数,total);
						detail = dataJSon['result']['detail'];
						for(var idx in detail){
							var package_id = detail[idx]['package_id'];
							var waybill_status = detail[idx]['waybill_status'];
							
							var msDic = {};
							msDic['waybill_status'] = waybill_status;
							
							//运行函数
							if(package_id){
								runGet.get_waybillCode_messge(package_id,msDic);
							};
							
							console.log(package_id,'出库状态码：',waybill_status)
						};
					}else{
						console.log('----',jsonData);
					};
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
	
	// 填写数据到表格
	inputTable_ms:function(msDic){
		//
		waybill_status = msDic['waybill_status']
		if(waybill_status == 100){
			// 判断tabaleId
			var tbody = document.querySelector("#table_id_daichu tbody");
			var thead = document.querySelector("#table_id_daichu thead");
			lastMes ='多多待出库';
		}else{
			//判断tabaleId
			var tbody = document.querySelector("#table_id_yichu tbody");
			var thead = document.querySelector("#table_id_yichu thead");
			var lastMes = '多多已出库';
		};
		// 填写数据
		// code 
		try{
			//
			// 产生一个tr，新添加行等于复制隐藏行
			var newTr = thead.firstElementChild.cloneNode(true);
			// 添加数据
			newTr.children[0].innerHTML = msDic["package_id"];
			newTr.children[1].innerHTML = msDic["waybill_code"];
			newTr.children[2].innerHTML = msDic["mobile"];
			newTr.children[3].innerHTML = msDic["customer_name"];
			newTr.children[4].innerHTML = waybill_status;
			newTr.children[5].innerHTML = lastMes;
			// 将一个tr追加到tbody
			tbody.appendChild(newTr);
		}catch(err) {
			console.log('多多列表，写入到网页表格错误',err.message);
		}
	},
	
	// 清空网页表格
	cleanTable:function(){
		var lst = ["#table_id_daichu tbody","#table_id_yichu tbody","table_id_zs tbody"]
		for(var s in lst){
			try{
				var tbody = document.querySelector(lst[s]);
				tbody.innerHTML = '';
			}catch(e){
				//TODO handle the exception
				console.log('清空表格完成')
			};

		};
	},
	
	//  助手传值  获取助手登录信息函数
	getCodeFormZS:function(){
		//
		if(window.location.href.indexOf("yz")!=-1){
			if(sessionStorage.getItem("authorication")!=null){
				//
				GM_setValue('form_zs_code',sessionStorage.getItem("authorication"));
				console.log('成功在驿站助手登录中获取 Authorication 值')
				// alert('成功在驿站助手登录中获取 Authorication 值');
			}else{
				//
				console.log('未在驿站助手网址中发现 Authorication 值，请检查驿站助手是否在当前浏览器登录')
				// alert('未在驿站助手网址中发现 Authorication 值，请检查驿站助手是否在当前浏览器登录');
			};
			console.log('驿站助手 Authorication 值 获取程序 运行结束。');
		};
		
		var zs_code = GM_getValue('form_zs_code');
		console.log('获取到的值为：',zs_code);
		return zs_code;
	},
	
	// 从驿站助手中获取运单信息
	request_post_get_data_yizhanzhushou:function(startdate,enddate){
	
		var new_Authorication = config.zs.new_Authorication;
		var startdate = startdate + " 00:00:00";
		var enddate = config.zs.addDate(enddate,1) + " 00:00:00";
		var url = "https://yzzs.kdy100.com:1991/mossapi/mossp.expressj/queryExpressListV4"; // https://yzzs.kdy100.com:1991/mossapi/mossp.expressj/queryExpressListV4
		var data ={"userId":"P07286628cf-0e10-4441-9867-ba9cbcf54bc9",
			"startTime":startdate,
			"endTime":enddate,
			"packStatus":"",
			"companyId":94,  // 查询的快递公司  "" 是所有快递， 94是极兔快递
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
		var dataStr = JSON.stringify(data);
		
		var headers = {
			"Content-Type": "application/json;charset=UTF-8",
			"Authorication": new_Authorication,
			"Accept": "application/json, text/plain, */*",
			"mossctx-versionCode": "2080006",
			"mossctx-clientType": "WEB",
			"Accept-Language": "zh-CN,zh;q=0.9"
		};
			
			
		GM_xmlhttpRequest({
			method: "post",
			url: url,
			headers:headers,
			data:dataStr,
			onload: function(res){
				if(res.status === 200){
					console.log('驿站助手订单列表访问成功，请查收是否有数据返回');
		
					jsonData = JSON.parse(res.responseText);
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
							if(everyData.companyId == 102){
								tabale_tr_dic["companyNice"] = '圆通快递';
							}else if(everyData.companyId == 103){
								tabale_tr_dic["companyNice"] = '韵达快递';
							}else if(everyData.companyId == 116){
								tabale_tr_dic["companyNice"] = '京东';
							}else if(everyData.companyId == 94){
								tabale_tr_dic["companyNice"] = '极兔快递';
							}else if(everyData.companyId == 106){
								tabale_tr_dic["companyNice"] = '顺丰快递';
							}else if(everyData.companyId == 93){
								tabale_tr_dic["companyNice"] = '丹鸟快递';
							}else if(everyData.companyId == 85){
								tabale_tr_dic["companyNice"] = '丰网速运';
							}else if(everyData.companyId == 104){
								tabale_tr_dic["companyNice"] = '百世快递';
							}else{
								tabale_tr_dic["companyNice"] = everyData.companyId;
							};
							
							// 将数据写入HTML
							// code......
							runGet.inputTable_from_zs(tabale_tr_dic);
							
						};
					}else{
						console.log('驿站助手数据获取数据长度小于0 ：',res.status);
						alert("请尝试在当前浏览器 登录驿站助手,或者刷新驿站助手页面之后，再返回该页面点确认操作！");
						config.zs.new_Authorication = runGet.getCodeFormZS(); // 从驿站助手重新获取值
						runGet.request_post_get_data_yizhanzhushou(startdate,enddate);
					};
				}else{
					console.log('驿站助手数据请求遇到错误代码：',res);
					alert("未找到数据，请检查是否有数据，如果有数据，但未获取到，请尝试在当前浏览器 登录驿站助手,或者刷新驿站助手页面之后，再返回该页面点确认操作！");
					config.zs.new_Authorication = runGet.getCodeFormZS(); // 从驿站助手重新获取值
					runGet.request_post_get_data_yizhanzhushou(startdate,enddate);
				}
			},
			onerror : function(err){
				console.log('驿站助手 列表信息访问遇到未知错误 error')
				console.log(err)
			}
		});
			
	},
	
	// 将助手中未入多多的快递写入HTML
	inputTable_from_zs:function(tabale_tr_dic){
		//
		var number = tabale_tr_dic["number"]; // 快递单号
		var phone = tabale_tr_dic["phone"];
		var outTime = tabale_tr_dic["outTime"];
		var companyNice = tabale_tr_dic["companyNice"];
		
		// 判断快递单号 是否已经入库多多快递
		var dd_number_str = JSON.stringify(config.waybillCodeAll);
		if(dd_number_str.indexOf(number) == -1){
			// 填写数据到html
			var tbody = document.querySelector("#table_id_zs tbody");
			var thead = document.querySelector("#table_id_zs thead");
			try{
				// 产生一个tr，新添加行等于复制隐藏行
				var newTr = thead.firstElementChild.cloneNode(true);
				// 添加数据
				newTr.children[0].innerHTML = number;
				newTr.children[1].innerHTML = companyNice;
				newTr.children[2].innerHTML = phone;
				newTr.children[3].innerHTML = outTime;
				newTr.children[4].innerHTML = '';
				newTr.children[5].innerHTML = '';
				newTr.children[6].innerHTML = '';
				newTr.children[7].innerHTML = '多多待入库';
				// 将一个tr追加到tbody
				tbody.appendChild(newTr);
			}catch(err) {
				console.log('多多列表，写入到网页表格错误',err.message);
			};
			
		}else{
			console.log("驿站助手的快递单号，在多多中已存在",number);
		};
		
	},
	
	
};

// 批量入库多多
var runto = {
	// 获取取件码 开头编码
	getHeadCode:function(){
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		delete headers['Content-Length'];
		
		var url = 'https://mdkd-api.pinduoduo.com/api/orion/op/pre/check/new';
		
		GM_xmlhttpRequest({
			method: "get",
			url: url,
			headers:headers,
			onload: function(res){
				if(res.status === 200){
					console.log('获取取件码 头部 编码的请求完成，请检查是否有返回');
					 dataJson = JSON.parse(res.response);
					 result = dataJson['result']
					 if(result){
						 shelf_number = result['shelf_number']
						 console.log('取件码 头部 编码为：',shelf_number);
						 // 返回了头部编码
						 config.dd.shelf_number = shelf_number;
					 }else{
						 console.log('获取取件码 头部 编码的请求失败',res.response);
					 };

				}else{
					console.log('获取取件码 头部 编码的请求失败',res)
				}
			},
			onerror : function(err){
				console.log('获取取件码 头部 编码的请求失败','error');
				console.log(err);
			}
		});
	},
	
	//  获取入库信息 （快递编码，取件码等）
	getPostData:function(waybill_code,mobile,index){
		var shelf_number = config.dd.shelf_number;
		var data = {
			"waybill_code": waybill_code,
			"shelf_number": shelf_number
		};
		var dataStr = JSON.stringify(data);
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		var contentLength = dataStr.length.toString();
		headers['Content-Length'] = contentLength;
		var url = 'https://mdkd-api.pinduoduo.com/api/orion/op/cabinet/in/prepare';
		
		GM_xmlhttpRequest({
			method: "post",
			url: url,
			headers:headers,
			data:dataStr,
			onload: function(res){
				if(res.status === 200){
					console.log('根据单号获取入库参数信息，请求完成，请检查是否有返回');
					 dataJson = JSON.parse(res.response);
					 result = dataJson['result']
					 if(result){
						 pickup_code = result['pickup_code'];  // 取件码
						 wp_name = result['wp_name'];  // 快递名称
						 wp_code = result['wp_code'];  // 快递编码
						 
						 // 将数据写入到表格
						 try{
						 	var mytable = document.querySelector("#table_id_zs tbody");
							mytable.rows[index].cells[4].innerHTML = wp_name;
							mytable.rows[index].cells[5].innerHTML = wp_code;
							mytable.rows[index].cells[6].innerHTML = pickup_code;
						 }catch(err) {
						 	console.log('根据单号获取入库参数信息 ，填写到表格失败',err.message);
						 };
						 
						 // 运行 提交入库信息，并填写入库结果
						 runto.requestRuKu(waybill_code,mobile,wp_code,wp_name,pickup_code,index);
						 
					 }else{};

				}else{
					console.log('获取取件码 头部 编码的请求失败',res)
				}
			},
			onerror : function(err){
				console.log('获取取件码 头部 编码的请求失败','error');
				console.log(err);
			}
		});		
		
	},
	
	// 提交入库
	requestRuKu:function(waybill_code,mobile,wp_code,wp_name,pickup_code,index){
		//
		var data = {
			"modify_wp": "false",
			"waybill_code": waybill_code,   //快递单号
			"shelf_number": config.dd.shelf_number,  // 日期编号
			"pickup_code": pickup_code, // 取件码 日期 + 4位入库顺序
			"wp_name":wp_name, //快递公司名称
			"courier_id": "0",
			"mobile": mobile,  //手机号码
			"wp_code": wp_code,  //快递公司编码
			"confirm_flag": "false",
			"modify_mobile": "true",
			"is_virtual": "false",
			"in_cabinet_type": "1",
			"customer_name": "",
			"modify_waybill_code": "false",
			"type": "1"
		};
		var dataStr = JSON.stringify(data);
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		var contentLength = dataStr.length.toString();
		headers['Content-Length'] = contentLength;
		var url = 'https://mdkd-api.pinduoduo.com/api/orion/op/cabinet/in';
		
		GM_xmlhttpRequest({
			method: "post",
			url: url,
			headers:headers,
			data:dataStr,
			onload: function(res){
				if(res.status === 200){
					console.log('入库请求请求完成，请检查是否有返回');
					// 返回的信息示例
					// {'result': '', 'toast': {'message': '入库成功', 'type': '3'}, 'success': True}
					// {'error_message': '该包裹已入库，请勿重复操作', 'error_msg': '该包裹已入库，请勿重复操作','success': False,'error_code': 130101}
					dataJson = JSON.parse(res.response);
					result = dataJson['success']
					if(result){
						 resMessge = dataJson['toast']['message']
					}else{
						console.log('入库请求请求完成，遇到错误',res.response);
						resMessge = dataJson['error_message']
					};
					// 将数据写入到表格
					try{
						var mytable = document.querySelector("#table_id_zs tbody");
						mytable.rows[index].cells[7].innerHTML = resMessge;
					}catch(err) {
						console.log('将入库结果写入到表格失败 ',err.message);
					};
		
				}else{
					console.log('入库请求请求失败',res)
				}
			},
			onerror : function(err){
				console.log('入库请求失败','error')
				console.log(err)
			}
		});		
	},
	
	//  循环 读取 数据
	readTable_zs:function(){
		
		runto.getHeadCode();   //  获取多多取件码头部编码
		//
		var mytable = document.querySelector("#table_id_zs tbody");
		console.log("待入库总记录数：",mytable.rows.length);
		
		for(var index=0,total = mytable.rows.length;index < total;index++){
			var waybill_code = mytable.rows[index].cells[0].innerHTML;  // 快递单号
			var mobile = mytable.rows[index].cells[2].innerHTML;  // 手机号码
			var companyNice = mytable.rows[index].cells[1].innerHTML;  // 快递名称
			var ruku_zhuangtai = mytable.rows[index].cells[7].innerHTML;  // 入库状态
			var ourCode = mytable.rows[index].cells[3].innerHTML;  //  助手出库状态
			
			// 批量出库,并将结果返回到表格
			// duoduo_zhuangtai.indexOf('已出')
			if(mobile && ruku_zhuangtai.indexOf('待入') != -1){
				runto.getPostData(waybill_code,mobile,index);
			};
			
		};
	},
	
};

//多多驿站批量出库
var runOut = {
	
	duodOut:function(duoduo_id,index){
		var data = {"device":"vmos","package_ids":[duoduo_id]};
		var dataStr = JSON.stringify(data);
		
		var headers = JSON.parse(JSON.stringify(config.headers_phone));
		var contentLength = dataStr.length.toString();
		headers['Content-Length'] = contentLength;
		
		var url = 'https://mdkd-api.pinduoduo.com/api/orion/op/cabinet/out/batch';
		
		GM_xmlhttpRequest({
			method: "post",
			url: url,
			headers:headers,
			data:dataStr,
			onload: function(res){
				if(res.status === 200){
					console.log('多多出库请求成功，请查收是否出库');
		            dataJSon = JSON.parse(res.response);
					// console.log(dataJSon);
					detail = dataJSon['result'];
					if(detail){
						console.log('包裹已出库');
						// 将出库结果返回到页面
						var mytable = document.querySelector("#table_id_daichu tbody");
						mytable.rows[index].cells[5].innerHTML = '多多已出库✔';
					}else{
						console.log('包裹出库失败，请检查信息',res.response);
					};
				}else{
					console.log('多多ID:',duoduo_id,'出库请求失败失败',res)
				}
			},
			onerror : function(err){
				console.log('多多ID:',duoduo_id,'出库请求失败失败','error')
				console.log(err)
			}
		});
	},
	
	// 循环读取出库表格
	readTable_dd_daichu:function(){
		var mytable = document.querySelector("#table_id_daichu tbody");
		console.log("多多待出库表格总记录数：",mytable.rows.length);
		
		for(var index=0,total = mytable.rows.length;index < total;index++){
			var duoduo_id = mytable.rows[index].cells[0].innerHTML;
			var duoduo_zhuangtai = mytable.rows[index].cells[5].innerHTML;
			
			// 批量出库,并将结果返回到表格
			if(duoduo_zhuangtai.indexOf('已出') == -1){
				runOut.duodOut(duoduo_id,index);
			};
			
		};
	},
};


// ------------------------------------
// test
// ls = [{'a':1,'b':11},{'a':2,'b':22}]
// for(var l in ls){
// 	console.log(l,'LS',ls[l]['a'])
// }

