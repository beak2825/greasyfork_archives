/*
@author Parker
@version 2020-05-08
@aim 对xlsx-style方法进行二次封装 方便调用以导出带样式Excel
@aim 对 XSU 进行封装和调用
@usage XSExport.xxxx()

依赖于
	1. xlsx.core.min.js
	2. xlsxStyle.core.min.js
	3. xlsxStyle.utils.js
	
*/
var XSExport = {};

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
XSExport.openDownloadDialog = function(url, saveName){
	if(typeof url == 'object' && url instanceof Blob)
	{
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	var event;
	if(window.MouseEvent) event = new MouseEvent('click');
	else
	{
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param sheet sheet数据
 * @param sheetName excel页内签
 */
XSExport.sheet2blob = function(sheet, sheetName) {
	var that = this;
	sheetName = sheetName || 'sheet1';
	var workbook = {
		SheetNames: [sheetName],
		Sheets: {}
	};
	workbook.Sheets[sheetName] = sheet;
	// 生成excel的配置项
	var wopts = {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
		type: 'binary'
	};
	
	// 设置样式
	that.setWorkbookStyle(workbook,workbook.SheetNames[0]);
	
	var wbout = xlsxStyle.write(workbook,wopts);
	var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
	// 字符串转ArrayBuffer
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	
	return blob;
}

/**
 * 自定义对应表格样式
 * @param wb workbook Excel工作布
 * @param sheetName excel页内签名称
 */
XSExport.setWorkbookStyle = function(wb,sheetName){			
	var cols = XSU.getMaxCol(wb,sheetName);//当前最大列
	
	//wb样式处理，调用xlsxStyle.utils方法

	//------------------通用表格样式----------------------------
	XSU.mergeCells(wb,sheetName,"A1",cols); //合并title单元格
	XSU.setFontTypeAll(wb,sheetName,'Arial');//字体：Arial
	XSU.setFontSizeAll(wb,sheetName,10);//字体大小：10
	XSU.setAlignmentHorizontalAll(wb,sheetName,'center');//垂直居中
	XSU.setAlignmentVerticalAll(wb,sheetName,'center');//水平居中
	XSU.setBorderDefaultAll(wb,sheetName);//设置所有单元格默认边框
	//-------------------------个性化----------------------------
	//列宽设置 1wch为1英文字符宽度 (统一放大一下宽度)
	XSU.setColWidthAll(wb,sheetName,15);
	
	//设置A 行 主标题 默认样式 必须最后设置 否则可能会被其他覆盖
	XSU.setTitleStylesDefault(wb,sheetName);
	//设置B 行 小标题 默认样式 必须最后设置 否则可能会被其他覆盖
	XSU.setSecondRowStylesDefault(wb,sheetName);
}


/**
 * 导出excel
 * @param data 原始数据
 *        数据格式为 第一行是 小标题 后续行则是对应行数据
 *		  例：
 *			data = [
 *				['姓名','年龄','性别'],
 *				['张三','12','男'],
 *				['李四','18','女']
 *			]
 * @param title 标题名称（用于excel内 第一行标题 和 导出文件名）
 */
XSExport.excelExport = function(data,title){	
	var that = this;
	var aoa = data;	
	// 插入头部
	var header = [];
	header.push(title);
	var cols = aoa[0].length;
	for(var i=0;i<cols-1;i++){
		header.push("");	
	}
	aoa.unshift(header);
	
	// 生成sheet
	var sheet = XLSX.utils.aoa_to_sheet(aoa);
	// 二进制文件
	var blob = that.sheet2blob(sheet);
	
	that.openDownloadDialog(blob, title+that.dateToStr('yyyyMMddHHmmss')+'.xlsx');
}
/**
 * 日期对象转换为指定格式的字符串
 * f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
 *  date Date日期对象, 如果缺省，则为当前时间
 *
 * YYYY/yyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w 星期
 * dd/DD/d/D 日期
 * hh/HH/h/H 时间
 * mm/m 分钟
 * ss/SS/s/S 秒
 * string 指定格式的时间字符串
 */
XSExport.dateToStr = function(formatStr, date){
	
	formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
	date = arguments[1] || new Date();
	var str = formatStr;
	var Week = ['日','一','二','三','四','五','六'];
	str=str.replace(/yyyy|YYYY/,date.getFullYear());
	str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
	str=str.replace(/MM/,date.getMonth()>=9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
	str=str.replace(/M/g,date.getMonth());
	str=str.replace(/w|W/g,Week[date.getDay()]);

	str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
	str=str.replace(/d|D/g,date.getDate());

	str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
	str=str.replace(/h|H/g,date.getHours());
	str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
	str=str.replace(/m/g,date.getMinutes());

	str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
	str=str.replace(/s|S/g,date.getSeconds());

	return str;
}