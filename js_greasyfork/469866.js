//备注包含CNAS的行就标个颜色
function 公共_CNAS订单加急(html,搜索信息){
	//当table出现数据改变的时候
	// 观察器的配置（需要观察什么变动）
	var config = {attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
	var table变化 = function(mutationRecoard, observer) {
		//会有两次变化  根据最终的变化
		if ($(html).find('#load_list').css('display')=='none'){
			html.find('table').find('tr').each(function(){
				备注=$(this).find(搜索信息).text()
				if(备注.toUpperCase().indexOf('CNAS')!==-1){
					//设置背景颜色
					$(this).find('td').attr('Bgcolor','#24B2C8')
				}
			})
		}
		
	};
	var observer = new MutationObserver(table变化);
	// 以上述配置开始观察目标节点
	dom=$(html).find('#load_list').get(0)
	observer.observe(dom, config);
}

//查询年月日的函数
function getday_y_n(d){
	var myDate = new Date();
	if(d=="yestday" || d==="hecheng_zuotian_riqi" || d=="zuori---"){myDate.setTime(myDate.getTime()-24*60*60*1000);}
	var year = (myDate.getFullYear()).toString(); //获取当前年
	var mon = (myDate.getMonth() + 1).toString(); //获取当前月
	var date = (myDate.getDate()).toString(); //获取当前日
	if(mon.length==1){
		mon="0"+mon
	}
	if(date.length==1){
		date="0"+date
	}
	if(d==="hecheng_zuotian_riqi"){
		return year+mon+date
	}else if(d=="---"){   //---指的格式为XXXX-XX-XX
		return year+"-"+mon+"-"+date
	}else if(d=="zuori---"){
		//返回昨天的日期 比如 2022-05-13
		return year+"-"+mon+"-"+date
	}else{
		return year+mon+date
	}
}

//获取日期范围内的所有日期
function 获取日期范围内的所有日期(日期_前,日期_后){
	var startTime =  new Date(日期_前);
	var endTime =  new Date(日期_后);
	var date_Arr = [];
	while ((endTime.getTime() - startTime.getTime()) >= 0) {
		var year = startTime.getFullYear();
		var month = (startTime.getMonth()+1).toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(),10) + 1) : (startTime.getMonth() + 1);
		var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
		date_Arr.push(year.toString()  + month.toString()  + day.toString());
		startTime.setDate(startTime.getDate() + 1);
	}
	console.log(date_Arr)
	return date_Arr;
}

//延时函数
var sleep = function(time) {
	var startTime = new Date().getTime() + parseInt(time, 10);
	while(new Date().getTime() < startTime) {}
};


//设定 页面的高度
function gaodu(html){
	console.log(html)
	html=$(html).contents().eq(0)
	//下面几行是重新设置 测序样品 页面的高度
	table_div=html.find('.ui-jqgrid-bdiv').eq(0)  // 找到了样品的table的上一级div  用于设置高度
	table_height=table_div.css('height')  //测序样品 页面的高度
	offset_1=$('.footer').eq(0).offset().top
	offset_2=html.find('#pager').eq(0).offset().top
	if(offset_1-offset_2<=120){
		table_div.css('height',table_height.slice(0,-2)-20+"px")  //重新设置  页面的高度
	}else if(offset_1-offset_2>=160){
		table_div.css('height',parseInt(table_height.slice(0,-2))+20+"px")  //重新设置 页面的高度
	}
}

//字符串全部替换部分文字
function str_replaceAll(str, yuanwenben, xianwenben) {
  return str.replace(new RegExp(yuanwenben, 'g'), xianwenben);
}

//判断数据是否是1到20
function 文本是否是1到20(text){
	if(text===""){text="1"}
	var tag=false
	for(var i=1;i<=20;i++){
		if(text===i.toString()){
			tag=true
			break
		}
	}
	return tag
}

//数组去重
function quchong_arr(arr){
	var hash=[];
	for (var i = 0; i < arr.length; i++) {
   		if(hash.indexOf(arr[i])==-1){
    			hash.push(arr[i]);
    	}
	}
  return hash;
}
//数组去掉空字符串
function arr_quchu_kongbai(arr){
	var hash=[];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]!=""){
			hash.push(arr[i]);
		}
	}
	return hash;
}
//统计数组中每个数据出现的次数，形参有2个，第一个已经去重的数组，第二个 原始数组 返回值是个数数组 比如[3,5,1]，对应已经去重的形参
function  chongfu_cishu_arr(quchong_arr,yuanshi_arr){
	var new_geshu_arr=new Array();  //新建一维数组 存放个数
	for(var i=0;i<quchong_arr.length;i++){
		new_geshu_arr[i]=0
		for(var j=0;j<yuanshi_arr.length;j++){
			//已经去重的数组和原始数组比对，如果有一致的，那么个数+1
			if(quchong_arr[i]===yuanshi_arr[j]){
				new_geshu_arr[i]+=1
			}
		}
	}
	return new_geshu_arr
}
//数组 统计次数
function 数组_统计次数(arr){
	arr_quchonghou=quchong_arr(arr)
	arr_个数=chongfu_cishu_arr(arr_quchonghou,arr)
	return [arr_quchonghou,arr_个数]
}

//两个数组去重 数组长度要求一致
function 两个数组去重(arr1,arr2){
	所有连接_arr=[]
	for (var i=0;i<arr1.length;i++){
		所有连接_arr.push(arr1[i]+"&$"+arr2[i])
	}
	所有连接_arr=quchong_arr(所有连接_arr)
	arr1=[]
	arr2=[]
	for(var i=0;i<所有连接_arr.length;i++){
		arr1.push(所有连接_arr[i].split('&$')[0])
		arr2.push(所有连接_arr[i].split('&$')[1])
	}
	return [arr1,arr2]
}

//文本_取中间文本_批量
function 文本_取中间文本_批量(总文本,前面文本,后面文本){
	function 数组整理(item){
		return item.split(前面文本)[1]
	}
	表达式=eval('/('+前面文本+')(.*?)(?='+后面文本+')/g')
	arr_result=总文本.match(表达式)
	arr_result=arr_result.map(数组整理)
	return arr_result
}
//文本_取中间文本
function 文本_取中间文本(总文本,前面文本_必须唯一,后面文本){
	arr=总文本.split(前面文本_必须唯一)
	//如果长度为1，说明没找到 前面文本_必须唯一
	if (arr.length==1){
		console.log('没有找到 前面文本 ')
		return false
	}
	if (arr.length>3){
		console.log('前面文本必须唯一')
		return false
	}
	result=arr[arr.length-1].split(后面文本)[0]
	return result
}


//网址  获取总的条数 totalrecords  
function 网址_获取总条数(网址){
	return 网址_查询公共函数('总条数',网址)
}
//网址  获取总的页数 totalpages":"
function 网址_获取总页数(网址){
	return 网址_查询公共函数('总页数',网址)
}

function 网址_获取总页数和总条数(网址){
	return 网址_查询公共函数('总页数和总条数',网址)
}
//返回  false 或者 页数
function 网址_查询公共函数(类型,网址){
	result=false
	$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
	$.get(网址,function (data,status) {
			//如果没有找到totalpages，说明网页运行失败
			if(data.indexOf('totalrecords')==-1){
				console.log('查询“订单是否已经上传过”失败，请确定是否断网或者是否需要重新登录，请重新查询！')
				result='0'
			}else{
				if (类型=='总条数'){
					//总共有多少条数据
					总条数=文本_取中间文本(data,'totalrecords":"','"')
					result=总条数
				}
				if (类型=='总页数'){
					//总共有多少页
					总页数=文本_取中间文本(data,'totalpages":"','"')
					result=总页数
				}
				if (类型=='总页数和总条数'){
					//总共有多少条数据
					总条数=文本_取中间文本(data,'totalrecords":"','"')
					//总共有多少页
					总页数=文本_取中间文本(data,'totalpages":"','"')
					result=总页数+','+总条数
				}
			}
		});
	return result
}

//jquery对象转换成dom
function jquery对象转换成dom(){
	dom对象=$('div').get(0)
}

//添加style属性
function addGlobalStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
}


// function addScript(url){
// 	var script = document.createElement('script');
// 	script.setAttribute('type','text/javascript');
// 	script.setAttribute('src',url);
// 	document.getElementsByTagName('head')[0].appendChild(script);
// }