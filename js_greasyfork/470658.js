function 课题组管理(){
	console.log('新的课题组管理界面')
	var local_添加北京价格=localStorage.getItem('添加北京价格');
	var local_添加广州价格=localStorage.getItem('添加广州价格');
	var local_添加海南价格=localStorage.getItem('添加海南价格');
	var html=$('iframe[src="/custmer/manageketizu.aspx"]')//课题组管理页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮()
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//添加北京价格
			if (local_添加北京价格=='true'){
				toolbar.append('<button  id="button_beijing_addPrice" onclick="return false">添加北京默认价格</button>')  //添加按钮
			}
			//添加广州价格
			if (local_添加广州价格=='true'){
				toolbar.append('<span style="position:relative;z-index:2;"><button id="button_guangzhou_addPrice" onclick="return false">添加广州价格◇</button><div id="div_guangzhou_addPrice" style="position:absolute;width:180px;height:140px;border:1px solid orange;background-color:#1B211D;display:none"></div></span>')
				div_show_yincang=toolbar.find('#div_guangzhou_addPrice').eq(0)
				div_show_yincang.append('<button id="button_gz_morenjiage" onclick="return false">广州默认价格</button><br />')
				div_show_yincang.append('<button id="button_gz_lihaitao" onclick="return false">李海涛(广西以外报价)</button><br />')
				div_show_yincang.append('<button id="button_gz_shenzhen" onclick="return false">深圳报价</button><br />')
				div_show_yincang.append('<button id="button_gz_mozhihong" onclick="return false">肿瘤医院(莫智鸿)</button><br />')
				div_show_yincang.append('<button id="button_gz_zenggangdi" onclick="return false">肿瘤黄埔院区(曾港迪)</button><br />')
				div_show_yincang.append('<button id="button_gz_guangxi" onclick="return false">广西</button>')
			}
			//添加海南价格
			if (local_添加海南价格=='true'){
				toolbar.append('<button  id="button_hainan_addPrice" onclick="return false">添加海南默认价格(固定)</button>')  //添加按钮
			}
			if (local_添加北京价格=='true' || local_添加广州价格=='true' || local_添加海南价格=='true'){
				toolbar.append('<button  id="button_copy_price" onclick="return false">复制价格</button>')  //添加按钮
				toolbar.append('<input type="text" id="text_ketizuID" placeholder="需要复制的课题组ID" />')  //添加文本框
			}
			//禁止text文本框按键
			html.find('#text_ketizuID').eq(0).keypress(function(event){
				if(event.keyCode ==13){
					return false
				}
			});
			//点击添加广州价格按钮  显示或者隐藏DIV
			toolbar.find('#button_guangzhou_addPrice').click(function(){
				显示隐藏DIV('#div_guangzhou_addPrice',"#button_guangzhou_addPrice")
			})
			//点击 添加北京价格按钮
			toolbar.find('#button_beijing_addPrice').click(function(){
				公共添加价格('北京')
			})
			//点击 广州各个按钮
			toolbar.find('#button_gz_morenjiage').click(function(){
				公共添加价格('广州默认价格')
			})
			toolbar.find('#button_gz_lihaitao').click(function(){
				公共添加价格('李海涛(广西以外报价)')
			})
			toolbar.find('#button_gz_shenzhen').click(function(){
				公共添加价格('深圳报价')
			})
			toolbar.find('#button_gz_mozhihong').click(function(){
				公共添加价格('肿瘤医院(莫智鸿)')
			})
			toolbar.find('#button_gz_zenggangdi').click(function(){
				公共添加价格('肿瘤黄埔院区(曾港迪)')
			})
			toolbar.find('#button_gz_guangxi').click(function(){
				公共添加价格('广西')
			})
			//点击 添加海南价格按钮
			toolbar.find('#button_hainan_addPrice').click(function(){
				公共添加价格('海南')
			})
			
			
			//点击 复制价格 按钮
			toolbar.find('#button_copy_price').click(function(){
				复制价格()
			})
		}
	}
	
	//复制价格
	function 复制价格(){
		 //选择第一个选中的行
		var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0) 
		if(selec.length===0){
			return false
		}
		id=selec.find('[aria-describedby=list_ketizu_id]').eq(0).text()
		name=selec.find('[aria-describedby=list_ketizu_name]').eq(0).text()
		var copyID=toolbar.find('#text_ketizuID').eq(0).val()
		if(copyID===""){
			return false
		}
		var flag=true
		var mubiao_ketizu=''
		//先根据文本框的课题组ID查询，能不能找到信息
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/custmer/ashx/KeTiZuHandler.ashx?_search=true&nd=1631271843425&rows=10&page=1&sidx=ketizu_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22ketizu_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+copyID+"%22%7D%5D%7D",
			function (data) {
				mubiao_ketizu=data.substring(data.indexOf('ketizu_name":"') + 14,data.indexOf('","ketizu_contac'))
				if(mubiao_ketizu==='{"totalpages"'){
					alert('目标课题组没有找到')
					flag=false
				}
			});
		if (flag==false){
			return false
		}
		if (mubiao_ketizu==''){
			alert('目标课题组没有找到')
			return false
		}
		var r1 = confirm("是否给 "+name+" 课题组复制 "+mubiao_ketizu+" 课题组的价格？");
		if (r1 == false) {
			return false
		}
		
		flag=true
		目标_类别_arr=[]
		目标_收费名称_arr=[]
		目标_价格_arr=[]
		//查询目标课题组价格个数是否符合复制条件  并且把数据放到数组里面
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+copyID+"&_search=false&nd=1631194735107&rows=300&page=1&sidx=set_cm_id&sord=asc",
			function (data) {
				 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 if(parseInt(geshu)<30){
					 alert('目标课题组价格不符合复制条件，请重新查看')
					 flag=false
					 return false
				 }
				目标_类别_arr=文本_取中间文本_批量(data,'"set_cm_kind":"','","')
				目标_收费名称_arr=文本_取中间文本_批量(data,'"set_cm_name":"','","')
				目标_价格_arr=文本_取中间文本_批量(data,'"set_cm_price":"','","')
			});
		if (flag==false){
			return false
		}
		
		flag=true
		//本身ID必须是空的才能添加价格
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=asc",
			function (data,status) {
				 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 if(geshu!=="0"){
					 alert('必须为空，才能添加价格')
					 flag=false
				 }
			});
		if(flag===false){  //说明本身已经存在价格
			return false
		}
		
		toolbar.find('#button_beijing_addPrice').attr('disabled',true)
		toolbar.find('#button_guangzhou_addPrice').attr('disabled',true)
		toolbar.find('#button_copy_price').attr('disabled',true)
		
		//添加价格 循环 类别_arr
		var 默认收费名称数组=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
		//var 默认价格数组=['','300','5','0','0','80','20','','1.5','300','20','','1.8','3','','400','480','550','300','300','80','480','3.5','900','900','50','3','','0','0','0','0','0','0']
		var 默认set_cm_kind数组=['118','122','123','124','130','120','125','126',         '127',    '128',   '131',          '132',         '133',        '134',          '135',    '136','138','140',    '142',   '144','146',   '158',      '159',     '160','161','162',            '163',        '164',    '1078',      '1079',                                  '607',      '608',     '609','610']
		var 默认类别数组=[     '测序',   '测序',  '测序',     '测序',    '测序',       '合成',         '合成','合成',         '合成','合成',      '合成',     '合成',           '合成',          '合成',         '合成', '合成','合成','合成','合成',     '合成','合成','合成',        '合成', '合成','合成',     '合成',         '合成',  '合成','基因自动收费价格','基因自动收费价格','测序','测序',      '测序',       '测序']
		
		for(var i=0;i<目标_类别_arr.length;i++){
			当前_目标_类别=目标_类别_arr[i]
			当前_目标_收费名称=目标_收费名称_arr[i]
			当前_目标_价格=目标_价格_arr[i]
			位置=默认收费名称数组.indexOf(当前_目标_收费名称)
			
			if (位置==-1){
				continue
			}
			当前默认类别=默认类别数组[位置]
			当前默认kind=默认set_cm_kind数组[位置]
			//如果类别不相等，（'高纯质粒大提','TA克隆' 有重复的位置，所以需要判断类别相等）
			if (当前默认类别!=当前_目标_类别){
				continue
			}
			//可以添加了 循环添加
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.post("/custmer/ashx/SetCustMoneyHandler.ashx",
				{set_cm_id:"",set_kzt_id:'',set_cm_kind:'',set_cm_kind:当前默认kind,set_cm_price:当前_目标_价格,set_cm_begintime1:'',set_cm_endtime1:'',set_cm_reamrk:'',action:'add',set_cm_name:当前_目标_收费名称,set_cm_begintime:"",set_cm_endtime:'',set_kzt_id:id+"#"},
				function (data) {
					console.log(data)
				});
		}
		//最后判断是否添加正确个数
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=300&page=1&sidx=set_cm_id&sord=desc",
			function (data,status) {
				 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 if(geshu!=="30" && geshu!=="34"){
					 alert('北京价格需为30项，广州价格需为34项，数量不对，需要检查一下！！！')
				 }else{
					 alert('添加成功！！！')
				 }
			});
	}
	
	//公共添加价格
	function 公共添加价格(地方){
		if(地方=='北京'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆']
			var jiage_shuzu=['','300','5','0','0','80','20','','1.5','300','20','','1.8','3','','400','480','550','300','300','80','480','3.5','900','900','50','3','','0','0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079']
		}
		if(地方=='海南'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆']
			var jiage_shuzu=['10','300','5','0','0','80','20','0.4','1.5','300','20','0.8','1.8','3','0.4','400','480','550','300','300','80','480','3.5','900','900','50','3','0.4','0','0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079']
		}
		if(地方=='广州默认价格'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '20',            '',       '1.5',     '300',    '20',            '',           '1.8',           '3',          '2.5',    '400', '480', '480', '300',  '300',    '80', '480',     '3.5',     '900','900',     '50',          '3',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		if(地方=='李海涛(广西以外报价)'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '20',            '',       '1.5',     '300',    '20',            '',           '1.8',           '2',          '1',     '400', '480', '480', '300',  '300',    '80', '480',     '3',     '900','900',     '50',          '3',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		if(地方=='深圳报价'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '20',            '',       '1.2',     '320',    '20',            '',           '1.5',           '2.5',          '2',   '360', '480', '560', '320',  '300',    '80', '480',     '3.5',     '900','900',     '50',          '3',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		if(地方=='肿瘤医院(莫智鸿)'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '15',            '',       '1.2',     '240',    '15',            '',           '1.2',           '2',          '1.6',   '320', '380', '440', '240',  '240',    '80', '380',     '2.5',     '720','720',     '50',          '2.5',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		if(地方=='肿瘤黄埔院区(曾港迪)'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '15',            '',       '1.2',     '240',    '15',            '',           '1.5',           '2.5',     '1.8',      '320', '380', '440', '240',  '240',    '80', '380',     '4',     '720','720',     '50',          '2.5',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		if(地方=='广西'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=[          '',     '300',     '5',      '5',        '0',      '80',        '22',            '',       '1.2',     '220',    '22',            '',           '1.6',           '3',          '2',      '280', '550', '550', '240',  '200',    '80', '360',     '4',     '900','900',     '50',          '3',          '',        '0',        '0',     '0',      '0',       '0',             '0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行
		if(selec.length===0){
			return false
		}
		id=selec.find('[aria-describedby=list_ketizu_id]').eq(0).text()
		name=selec.find('[aria-describedby=list_ketizu_name]').eq(0).text()
		var r = confirm("是否给 "+name+" 课题组添加价格？");
		if (r == false) {
		    return false
		}else{
			toolbar.find('#button_beijing_addPrice').attr('disabled',true)
			toolbar.find('#button_guangzhou_addPrice').attr('disabled',true)
			toolbar.find('#button_copy_price').attr('disabled',true)
		}
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		var flag=1
		$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=desc",
			function (data,status) {
				 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 if(geshu!=="0"){
					 alert('必须为空，才能添加价格')
					 flag=0
					 return false
				 }
				 $.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				 for(var i=0;i<jiage_danwei_shuzu.length;i++){
					$.post("/custmer/ashx/SetCustMoneyHandler.ashx",
						{set_cm_id:"",set_kzt_id:'',set_cm_kind:'',set_cm_kind:jiage_set_cm_kind[i],set_cm_price:jiage_shuzu[i],set_cm_begintime1:'',set_cm_endtime1:'',set_cm_reamrk:'',action:'add',set_cm_name:jiage_danwei_shuzu[i],set_cm_begintime:"",set_cm_endtime:'',set_kzt_id:id+"#"},
						function (data) {
							console.log(data)
						});
				 }
			});
		if(flag===0){  //说明本身已经存在价格
			return false
		}
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=desc",
			function (data,status) {
				 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 if(地方=='北京' || 地方=='海南'){
					 if(geshu!=="30"){
						 alert('添加后不为30项，需要检查一下！！！')
						 return false
					 }else{
						 alert('添加成功！！！')
					 }
				 }else{
					 if(geshu!=="34"){
						 alert('添加后不为34项，需要检查一下！！！')
						 return false
					 }else{
						 alert('添加成功！！！')
					 }
				 }
			});
	}
	
	
	//显示或者隐藏DIV
	function 显示隐藏DIV(div_id,button_id){
		div=toolbar.find(div_id).eq(0)
		div.toggle()
		//改变背景颜色
		if (div.css('display')==="none"){
			toolbar.find(button_id).css('background-color','')
		}else{
			toolbar.find(button_id).css('background-color','#B7A0AA')
			//如果是批量添加反应的div  把已填的数据改为1
			if (div_id=='#div_piliang'){
				toolbar.find(div_id).eq(0).find(":input").val('1')
			}else{
				//如果是修改样品名称的div 或者 其他div 把已填的数据清除
				toolbar.find(div_id).eq(0).find(":input").val('')
			}
		}
	}
}