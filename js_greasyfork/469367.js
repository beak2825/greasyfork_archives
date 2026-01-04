// ==UserScript==
// @name         周报填写增强
// @namespace    http://39.96.71.121:8090/
// @version      0.1.30
// @description   针对DDHL的OA填报系统的增强
// @author       lvyb
// @match        http://39.96.71.121:8090/FlowIndex/index/flowid/156?p=workflow/run
// @match        http://39.96.71.121:8090/FlowSetData/index?p=workflow/run
// @match        http://39.96.71.121:8090/FlowSetData/index/act/SetData*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=layuion.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.8/dayjs.min.js
// @downloadURL https://update.greasyfork.org/scripts/469367/%E5%91%A8%E6%8A%A5%E5%A1%AB%E5%86%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469367/%E5%91%A8%E6%8A%A5%E5%A1%AB%E5%86%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// 测试xiyueta
	// 构造客制化共用的脚本字符串
	let commonScript = `
	    // 格式化日期
		function formatDateStr(str) {
			return dayjs(str).format('YYYY-MM-DD')
		}
		// 清除当前表格下的所有填写行
		function clearRows(){
			var btnDel = $('input[value="删除一行"]')
			// 先移除所有的行
			var rows = $('#' + tableId).find('tbody')
			for(var i=1;i<rows.length;i++){
				btnDel.trigger('click')
			}
		}
		// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
		function sheet2blob(sheet, sheetName) {
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
			var wbout = XLSX.write(workbook, wopts);
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
		 * 通用的打开下载对话框方法，没有测试过具体兼容性
		 * @param url 下载地址，也可以是一个blob对象，必选
		 * @param saveName 保存文件名，可选
		 */
		function openDownloadDialog(url, saveName){
			if(typeof url == 'object' && url instanceof Blob)
			{
				url = URL.createObjectURL(url); // 创建blob地址
			}
			var aLink = document.createElement('a');
			aLink.href = url;
			aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
			var event;
			if(window.MouseEvent) event = new MouseEvent('click');
			else{
				event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			}
			aLink.dispatchEvent(event);
		}
		// 列数据转换
		function convertSheetData(data){
			let titleMap = data[0]
			let newData = []
			for(let i=1;i<data.length;i++){
				var newObj = {}
				for(let x in titleMap){
					newObj[titleMap[x]] = data[i][x]
				}
				newData.push(newObj)
			}
			return newData;
		}
		// 获取指定页面的数据
		async function parseHtmlData(page){
			let fetchResult = await fetch('/FieldCenter/edit/svalue//fieldlist//Logic//item/TABLE_805_cfield2_1/fieldclass/SelectTableData/fieldid/10778/pass//t/805/page/'+page+'?p=core')
			let htmlResult = await fetchResult.text()
			let dataObj = $(htmlResult)
			return dataObj
		}

		function queryProjectData(pageData, projectData) {
			$(pageData.find('table.datalist tr')).not('tr:first').each((index,item) => {
				let tds = $(item).find('td');
				let projNumber = $(tds[1]).text().trim()
				let projName = $(tds[2]).text().trim()
				projectData.push({
					projNumber: projNumber,
					projName: projName
				})
			})
		}
		// 解析所有的项目数据
		async function fetchCurUserProjs() {
			let curPage = 1;
			let allPage = -1;
			let projectData = []
			// 获取所有的页码
			let pageData = await parseHtmlData(curPage)
			// 解析数据
			queryProjectData(pageData, projectData)
			let maxPageLinkStr = pageData.find('div.earliest').parent().attr('href')
			let maxPage = Number(maxPageLinkStr.substring(maxPageLinkStr.lastIndexOf('/') + 1).split('?')[0])
			for(let curPage = 2;curPage <= maxPage;curPage++){
				pageData = await parseHtmlData(curPage)
				// 解析数据
				queryProjectData(pageData, projectData)
			}
			return projectData
		}
		// 读取excel文件
		function outputWorkbook(workbook, sheetName, fillType) {
			var sheetNames = workbook.SheetNames; // 工作表名称集合
			let targetSheetIndex = sheetNames.indexOf(sheetName)
			if(targetSheetIndex === -1) {
				alert('未找到《'+sheetName+'》的Sheet页面')
				return;
			}
			let data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[targetSheetIndex]])
			let newData = convertSheetData(data)
			if(fillType === '156'){
				fetchCurUserProjs().then(res => {
					let projs = []
					res.forEach(item => {
						projs.push(item.projNumber + ';;;' + item.projName)
					})
					let err = []
					newData.forEach((item,index) => {
						let userInputValue = item.cfield2 + ';;;' + item.cfield3
						if(projs.indexOf(userInputValue) === -1){
							err.push('第' + (index + 1) + '行填写的项目编号['+item.cfield2+']或名称['+item.cfield3+']错误!')
						}
					})
					if(err.length === 0){
						// 填写数据
						readExcelDataToPage(newData)
					}else{
						alert(err.join(','))
					}
				})
			}else{
				// 填写数据
				readExcelDataToPage(newData)
			}
			
		}
		function extfillContent(line, type, tableId, fieldId, value){
			var arr = line.find(type + "[name^='"+tableId + fieldId+"']")
			//var arr = $( type + "[name^='"+tableId+" + fieldId+"']")
			for(var i=0;i<arr.length;i++){
				var item = arr[i]
				var itemNameArr = item.name.split('_')
				var number = itemNameArr[itemNameArr.length - 1]
				try{
					parseInt(number)
					$(item).val(value)
				}catch(e){}
			}
		}
		function extfillSelect(line,tableId, fieldId, value){
			var arr = line.find("select[name^='"+tableId + fieldId+"']")
			for(var i=0;i<arr.length;i++){
				var item = arr[i]
				var itemNameArr = item.name.split('_')
				var number = itemNameArr[itemNameArr.length - 1]
				try{
					parseInt(number)
					$(item).val(value)
				}catch(e){}
			}
		}
		function getFilledData(data) {
			var title = data[0];
			var arrs = $('#' + tableId + '>tbody')
			//console.log('目标tbody:', arrs)
			for(var i=1;i<arrs.length;i++){
				var newObj = {}
				for(var x in title){
					let type = 'input'
					if(title[x] === 'cfield8' && tableId === 'Tab_805') type = 'textarea'
					if(title[x] === 'cfield12' && tableId === 'Tab_806') type = 'textarea'
					if(dropdownTitle.indexOf(title[x]) > -1 ) { type = 'select'}
					if(title[x] === 'cfield2' || title[x] === 'cfield4') type+= '.readonly'
					var targetArrs = $(arrs[i]).find(type + '[name^="' + cmpNamePrefix + title[x] + '"]')
					for(var j=0;j<targetArrs.length;j++){
						if(!targetArrs[j]){
							//console.log(targetArrs[j]);
							continue;
						}
						var targetName = targetArrs[j].name
						try{
							var nnArr = targetName.split('_')
							Number(nnArr[nnArr.length - 1])
							newObj[x] = $(targetArrs[j]).val()
						}catch(e){}
					}
				}
				data.push(newObj);
			}
		}
	`
	// 启动定时器
    let timer = setInterval(function(){
		// 获取当前流程id
		var flowidCmp = $('input[name="f"]')
		// 获取页面上的增加一行的按钮
		var addRowBtnCmp = $('input[value="增加一行"]')
		// 如果添加一行按钮存在则需要停止计时器
		if(addRowBtnCmp.length > 0){
			clearInterval(timer)
			if(flowidCmp && flowidCmp.val() === '156'){	// 周报填写
				let custScript = `
					<script>
						let tableId = 'Tab_805'
						let cmpNamePrefix = 'TABLE_805_'
						let sheetName = 'OA周报'
						let dropdownTitle = ['cfield12', 'cfield15', 'cfield9']

						function importExcel() {
							var fileCmp = $('#btn_file')
							fileCmp.click();
							fileCmp.unbind('change')
							fileCmp.change(function(e) {
								var files = e.target.files;
								var fileReader = new FileReader();
								fileReader.onload = function(event) {
									var data = event.target.result;
									var workbook = XLSX.read(data, {type: 'binary'});
									clearRows()
									outputWorkbook(workbook, sheetName, '156')
									fileCmp.val('')
								}
								fileReader.readAsBinaryString(files[0]);
							});
						}
						// 校验是否存在获取按钮
						function checkGetAutoNumberBtn(){
							var from = eval(localStorage.getItem('batchImportFlag') || 'false')
							if($('input[type=button][value="获取"]').length === 0 && from === true) {
								// 如果不存在则说明暂存过了,点击流程列表
								$('div.list').trigger('click')
							}
						}
						// 从批量中解析数据
						function parseBatchImportData(){
							let dataJson = JSON.parse(localStorage.getItem('batchImportSheetData') || '{}')
							let sheets = Object.keys(dataJson)
							// 如果 获取按钮存在则处理数据，否则不消耗数据
							if(sheets.length > 0 && $('input[type=button][value="获取"]').length > 0){
								let sheetName = sheets[0]
								let data = dataJson[sheetName]
								delete dataJson[sheetName]
								localStorage.setItem('batchImportSheetData', JSON.stringify(dataJson))

								clearRows()
								let newData = convertSheetData(data)
								// 解析数据
								readExcelDataToPage(newData)
								// 将sheet名称设置到周日表格中
								$('input[name="TABLE_810_cfield7"]').val(sheetName)
								// 获取数据编号
								var model = new Model("ajax");
								model.stringUrl = '/GetAutoNumber/index/t/810/fieldid/10831?p=core/handle';
								model.processData = function (responseText) {
									document.getElementsByName('TABLE_810_cfield1')[0].value = decodeURI(responseText);
									//CheckSingle(document.getElementsByName('TABLE_810_cfield1')[0]);
									// 触发暂存数据处理
									setTimeout(() => {
										$('div.save').parent().trigger('click')
									},300)
								};
								model.load();
							}else if(sheets.length === 0){
								localStorage.removeItem('batchImportFlag')
							}
						}
						// 解析Excel导入数据
						function readExcelDataToPage(newData){
							// 根据数据行触发新增行
							var btnAdd = $('input[value="增加一行"]')
							for(let i=0;i<newData.length;i++){
								// 增加一行
								btnAdd.trigger('click')
								var targetLine = $($('#' + tableId).find('tbody')[i + 1])
								var item = newData[i]
								for(var title in item){
									if(title === 'cfield6'){
										// 判断时间是否为周日，如果为周日则将周日填充到内容表上
										let week = dayjs(item[title]).day()
										let convertDate = formatDateStr(item[title])
										if(week === 0){
											// 如果是0，则将该值填入到周报的周日上
											$('input[name="TABLE_810_cfield7"]').val(convertDate)
										}
										extfillContent(targetLine, 'input',cmpNamePrefix, title, convertDate)
									}else if(title === 'cfield8'){
										extfillContent(targetLine, 'textarea',cmpNamePrefix, title, item[title])
									}else if(dropdownTitle.indexOf(title) > -1){
										let newValue = item[title]
										if(title === 'cfield9'){
											if(String(newValue) === '0'){
												newValue = '0.0'
											}
										}
										extfillSelect(targetLine, cmpNamePrefix, title, newValue)
									}else{
										extfillContent(targetLine, 'input',cmpNamePrefix, title, item[title])
									}
								}
							}
						}
						// 下载当前页数据
						function downloadPageData(flag) {
							var dataJson = []
							dataJson.push({
								项目编号: 'cfield2',
								项目名称: 'cfield3',
								项目阶段: 'cfield4',
								里程碑: 'cfield13',
								日期: 'cfield6',
								工作类型: 'cfield12',
								工作内容: 'cfield8',
								工时: 'cfield9',
								工作地点: 'cfield7',
								项目类型: 'cfield5',
								出差: 'cfield15'
							})
							// 获取现有界面上的数据
							if(flag === 'tpl'){
								dataJson.push({
									项目编号: '20220023',
									项目名称: '潍柴ACM系统开发项目',
									项目阶段: '系统详细设计、开发、测试',
									里程碑: 'M2系统开发及测试',
									日期: '2023-06-25',
									工作类型: '项目实施',
									工作内容: '测试系统问题',
									工时: 1,
									工作地点: '潍坊',
									项目类型: 'PLM',
									出差: '否'
								})
							}else{
								getFilledData(dataJson)
							}
							//console.log('收集后的数据:', dataJson)
							var sheet = XLSX.utils.json_to_sheet(dataJson);
							var zbNumber = $('input[name="TABLE_810_cfield7"]').val()
							var fileName = (zbNumber ? zbNumber : dayjs().format('YYYY-MM-DD')) + '_周报.xlsx'
							openDownloadDialog(sheet2blob(sheet, sheetName), fileName);
						}
					`
				custScript += commonScript
				custScript += `
					</script>
					<input type="file" id="btn_file" style="display:none" accept=".xls, .xlsx" >
					<input type=button onclick="importExcel()" value="Excel导入" />
					<input type=button onclick="downloadPageData()" value="下载当前页数据" />
					<input type=button onclick="downloadPageData('tpl')" value="下载模板" />
					<input type=button onclick="clearRows()" value="清空现有数据行" />`
				$('input[value="增加一行"]').before(custScript)
				setTimeout(() => {
					parseBatchImportData()
					checkGetAutoNumberBtn()
				}, 300)
			}else if(flowidCmp && flowidCmp.val() === '155'){ // 费用报销
				let custScript = `
					<script>
						let tableId = 'Tab_806'
						let cmpNamePrefix = 'TABLE_806_'
						let sheetName = 'OA报销'
						let dropdownTitle = ['cfield2', 'cfield3', 'cfield6']
						function importBx() {
							var fileCmp = $('#btn_file')
							fileCmp.click();
							fileCmp.change(function(e) {
								var files = e.target.files;
								var fileReader = new FileReader();
								fileReader.onload = function(event) {
									var data = event.target.result;
									var workbook = XLSX.read(data, {type: 'binary'});
									clearRows()
									outputWorkbook(workbook, sheetName, '155')
									fileCmp.val('')
								}
								fileReader.readAsBinaryString(files[0]);
							});
						}
						// 解析Excel导入数据
						function readExcelDataToPage(newData){
							//console.log('报销data:', newData)
							// 根据数据行触发新增行
							var btnAdd = $('input[value="增加一行"]')
							for(let i=0;i<newData.length;i++){
								// 增加一行
								btnAdd.trigger('click')
								// 待补充解析Excel内容
								var targetLine = $($('#' + tableId).find('tbody')[i + 1])
								var item = newData[i]
								for(var title in item){
									if(title === 'cfield6' || title === 'cfield9' || title === 'cfield13'){
										let convertDate = formatDateStr(item[title])
										extfillContent(targetLine, 'input',cmpNamePrefix, title, convertDate)
									}else if(title === 'cfield12'){
										extfillContent(targetLine, 'textarea',cmpNamePrefix, title, item[title])
									}else if(dropdownTitle.indexOf(title) > -1){
										extfillSelect(targetLine, cmpNamePrefix, title, item[title])
									}else{
										extfillContent(targetLine, 'input',cmpNamePrefix, title, item[title])
									}
								}
							}
						}
						// 下载当前页数据
						function dowloadBxData(flag) {
							var dataJson = []
							dataJson.push({
								费用大类: 'cfield2',
								费用小类: 'cfield3',
								项目编号: 'cfield4',
								项目名称: 'cfield5',
								项目阶段: 'cfield6',
								项目类型: 'cfield14',
								日期起: 'cfield9',
								日期止: 'cfield13',
								金额: 'cfield10',
								单据张数: 'cfield15',
								报销说明: 'cfield12'
							})
							// 获取现有界面上的数据
							if(flag === 'tpl'){
								dataJson.push({
									费用大类: '项目',
									费用小类: '火车票',
									项目编号: '20220023',
									项目名称: '潍柴ACM系统开发项目',
									项目阶段: '产品实施',
									项目类型: 'PLM',
									日期起: '2023-06-25',
									日期止: '2023-06-25',
									金额: 304.5,
									单据张数: 1,
									报销说明: '此处填写说明'
								})
							}else{
								getFilledData(dataJson)
							}
							//console.log('收集后的数据:', dataJson)
							var sheet = XLSX.utils.json_to_sheet(dataJson);
							var bxNumber = $('input[name="TABLE_811_cfield1"]').val()
							var fileName = (bxNumber && bxNumber !== '自动生成' ? bxNumber : dayjs().format('YYYY-MM-DD')) + '_报销.xlsx'
							openDownloadDialog(sheet2blob(sheet, sheetName), fileName);
						}
					`
				custScript += commonScript
				custScript += `
					</script>
					<input type="file" id="btn_file" style="display:none" accept=".xls, .xlsx" >
					<input type=button onclick="importBx()" value="Excel导入" />
					<input type=button onclick="dowloadBxData()" value="下载当前页数据" />
					<input type=button onclick="dowloadBxData('tpl')" value="下载模板" />
					<input type=button onclick="clearRows()" value="清空现有数据行" />
				`
				$('input[value="增加一行"]').before(custScript)
			}
		}

        // 判断是否存在开始新流程
        var startFlow = $('div.flowstart')
        if(startFlow.length > 0) {
            clearInterval(timer)
            // 增加增强按钮
            let scriptStr = `
                <script>
			`
			scriptStr += commonScript
			scriptStr += `
					// 批量处理数据
					function startBatchCreateWorkLog(){
						let batchDataJson = JSON.parse(localStorage.getItem('batchImportSheetData') || '{}')
						let waitToDeal = Object.keys(batchDataJson).length
						if( waitToDeal > 0 ){
							localStorage.setItem('batchImportFlag', true)
							$('div.flowstart').trigger('click')
						}
					}
					// 批量解析多sheet的数据
					function batchParseSheetData(workbook) {
						localStorage.removeItem('batchImportSheetData')	// 移除存储中的数据
						var sheetNames = workbook.SheetNames; // 工作表名称集合
						var errorSheetName = []
						var excelData = {}	// 按照Sheet页存储数据
						for(let nameIndex=0;nameIndex < sheetNames.length;nameIndex++ ){
							var sheetName = sheetNames[nameIndex]
							if(!dayjs(sheetName).isValid()){
								errorSheetName.push(sheetName)
								continue;
							}
							var dateSheetName = formatDateStr(sheetNames[nameIndex])
							let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[nameIndex]])
							excelData[dateSheetName] = sheetData
						}
						if(errorSheetName.length > 0){
							alert('批量导入的Sheet页名称必须为周报的周日!以下名称有误:' + errorSheetName.join(','))
							return;
						}
						// console.log(excelData)
						// 将解析后的Excel数据存储到localStorage中
						localStorage.setItem('batchImportSheetData', JSON.stringify(excelData))
						// 开始批量自动创建周报
						startBatchCreateWorkLog()
					}
                    function batchImportZB() {
                       var fileCmp = $('#btn_file')
                        fileCmp.click();
                        fileCmp.change(function(e) {
                            var files = e.target.files;
                            var fileReader = new FileReader();
                            fileReader.onload = function(event) {
                                var data = event.target.result;
                                var workbook = XLSX.read(data, {type: 'binary'});
                                //clearRows()
                                batchParseSheetData(workbook)
                                fileCmp.val('')
                            }
                            fileReader.readAsBinaryString(files[0]);
                        });
                   }
                </script>
            `
            let btns = `
                <td nowrap="" id="_San.Item_4" class="menu_css_barItem">
                    <input type="file" id="btn_file" style="display:none" accept=".xls, .xlsx" >
                   	<input type=button value="批量导入周报" onclick="batchImportZB()"/>
                </td>
            `
            $('div.flowlist').parent().parent().append(scriptStr + btns)
			setTimeout(()=>{
				startBatchCreateWorkLog()
			},300)
        }
    }, 300)
})();