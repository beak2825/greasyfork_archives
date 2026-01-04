function 合成订单(){
	console.log('新的合成订单界面')
	var local_合成_vip按钮前置=localStorage.getItem('合成_vip按钮前置');
	var html=$('iframe[src="/syn/syn_order.aspx"]')//合成订单页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮()
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//VIP按钮前置
			if (local_合成_vip按钮前置=='true'){
				var vip=toolbar.find('#a_addordervip').eq(0)
				//点击VIP下单按钮
				vip.click(function(){
					vip_top(html)
				})
			}
		}
	}
	
	//VIP按钮放在最前面  绑定事件：如果点击VIP下单 load后运行 add_order_iframe()
	function vip_top(html){
		//如果vip 下单弹框显示完全，则运行
		var html_tankuang= $('iframe[src="../bio/erp/primerSynthesis.html?mode=add"]')//合成管理  弹框页面
		html_tankuang.on('load',function(){
			html=html_tankuang.contents().find('body').eq(0)
			add_order_iframe(html)
		})
	}
	
	//合成订单  vip下单 页面
	function  add_order_iframe(html){
		//添加订单的iframe弹框界面
		if(html.length===1){
			sleep(1000)
			//默认选择nmol模式
			html.find('#unit2').click()
			//测序引物用nmol模式
			测序引物用nmol模式(html)
			//iframe 监听增加元素的情况
			$(html).on('DOMNodeInserted',function(e) {
				//如果检查到客户信息显示了,就是li里面的很多行客户信息,那么选择客户的时候让数据显示在一行
				if (e.target.outerHTML.indexOf('<li class="select2-results__option" role="treeitem"')!=-1){
					//$(e.target)表示每一行客户信息
					$(e.target).find('br').before("<span> —— </span>")
					$(e.target).find('br').remove()
				}
			});
			
			//==============================开始 检查到客户变了，那么 ①把客户信息显示出来  ②生产实验室 如果不是北京分公司，那么就显示一个颜色===========
			// 观察器的配置（需要观察什么变动）
			var config = { attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
			var 选择客户后 = function(mutationRecoard, observer) {
				//客户信息显示出来
				kehu_showAll(html);
				//生产实验室 如果不是北京分公司，那么就显示一个颜色
				color_shengchan_fengongsi(html)
			};
			var observer = new MutationObserver(选择客户后);
			// 以上述配置开始观察目标节点
			dom=$(html).find("[class='select2-selection select2-selection--single']").eq(0).get(0)
			observer.observe(dom, config);
			//==============================结束 检查到客户变了，那么 ①把客户信息显示出来  ②生产实验室 如果不是北京分公司，那么就显示一个颜色===========
			
		}
	}
	
	//添加页面，选择好客户后显示详细信息
	function kehu_showAll(html){
		//先隐藏图
		html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏
		html.find("[class='col-xs-3 plate-container']").addClass('hidden')//添加隐藏
		//添加文本框 存放提醒内容 和客户信息
		if(html.find('#kehu_all').size()==0){
			t='<div id="kehu_all" style="position:absolute;left:60px;width:1300px;height:67px"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size="3" color="red"></font></div>'
			html.find("[class='wrapper wrapper-content animated fadeInRight']").eq(0).prepend(t)
			html.find("[class='plate-col']").eq(0).append('<div style="position:absolute;right:310px;top:90px"><font size="3" color="red"><textarea id="tixing" rows="11" cols="40"></textarea></font></div>')
			html.find("#kehu_all").attr('title',"")
		}
		ktz_text=html.find('#select2-ktz-container').eq(0)  //课题组选择框
		//去除里面的div标签 <div hidden='hidden'>朱旭</div>
		ktz_text.find('div').remove()
		select_xinxi=ktz_text.text()
		if(select_xinxi=="输入名称、邮箱、电话查询"){
			html.find('#kehu_all').eq(0).find('font').eq(0).text("")
			return false
		}
		select_xinxi=select_xinxi.slice(1)
		id=parseInt(select_xinxi).toString()  //选择的客户ID
		name=select_xinxi.slice(id.length)  //选择的客户名称
		if(html.find("#kehu_all").attr('title')!==id){
			$.ajaxSettings.async = false;
			$.get("/ajax/SearchCustmer.ashx?action=getcustKtz&keyword="+id+"%20"+name,  
				function (data,status) {
					data=data.slice(2,-2)		//把左右两遍的[""]去掉
					html.find('#kehu_all').eq(0).find('font').eq(0).text(data)
					html.find("#kehu_all").attr('title',id)
					//放入提醒
					data_arr=data.split('——')
					ktz_id=data_arr[2]//从已经建立的div里面获取里面的课题组ID
					ti_xing=getTixing(id,ktz_id)  //获取客户和课题组提醒
					html.find('#tixing').eq(0).val(ti_xing)
				});
		}
	}
	
	//添加订单iframe页面 生产实验室 如果不是北京分公司，那么就显示一个颜色
	function color_shengchan_fengongsi(html){
		var value=html.find('#sys').eq(0).val()
		if(value!=='38' && value!==''){  //如果不是北京分公司
			html.find('#sys').eq(0).css('background-color','#8BEEE7')
		}else{
			html.find('#sys').eq(0).css('background-color','white')
		}
	}
	
	function getTixing(id,ktz_id){  //变量传客户ID和 课题组ID
		//客户提醒
		ti_kehu=""
		ti_ketizu=""
		$.ajaxSettings.async = false;
		$.get("/custmer/ashx/CustmerHandler.ashx?_search=true&nd=1625069471021&rows=20&page=1&sidx=cust_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22cust_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+id+"%22%7D%5D%7D",
			function (data,status) {
				ti_kehu=data.match(/ent":(.*?)(?=,"cust_wx_id)/)[0]
				ti_kehu=ti_kehu.substr(5)
			});
		//课题组提醒
		$.get("/custmer/ashx/KeTiZuHandler.ashx?_search=true&nd=1625137163049&rows=20&page=1&sidx=ketizu_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22ketizu_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+ktz_id+"%22%7D%5D%7D",
			function (data,status) {
				ti_ketizu=data.match(/ent":(.*?)(?=,"ketizu_Gen)/)[0]
				ti_ketizu=ti_ketizu.substr(5)
			});
		tixing="客户提醒："+ti_kehu+"\n"+"\n"+"课题组提醒："+ti_ketizu
		return tixing
	}
}

//测序引物用nmol模式
function 测序引物用nmol模式(html){
	html.find("[class='m-b-sm tool-group']").append('<span style="color:red;font-size:22px">录入提醒：合成"测序引物"如无特殊要求，按nmol模式，需求量是6.4，分装管数是2</span>')
}