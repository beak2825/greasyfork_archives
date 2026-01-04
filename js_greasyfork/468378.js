function 订单管理(){
	console.log('新的订单管理界面')
	var local_订单管理_VIP=localStorage.getItem('订单管理_VIP');
	var local_上传照片=localStorage.getItem('上传照片');
	var local_北京订单数量=localStorage.getItem('北京订单数量');
	var local_每日报表=localStorage.getItem('每日报表');
	var local_CNAS加急=localStorage.getItem('CNAS加急');
	var local_标签打印_新格式标签_换行=localStorage.getItem('标签打印_新格式标签_换行');
	var 当前用户名=$('#curname',window.parent.document).text()
	var html=$('iframe[src="/seq/SeqOrderList.aspx"]')//订单管理页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	//添加toolbar工具栏按钮
	添加toolbar按钮()
	//非北京分公司显示颜色
	非北京分公司显示颜色(html)
	
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			//VIP按钮前置
			if (local_订单管理_VIP=='true'){
				var vip=toolbar.find('#a_addordervip').eq(0)
				var a_edit=toolbar.find('#a_edit').eq(0)
				a_edit.before(vip)
				//点击VIP下单按钮
				vip.click(function(){
					vip_top('dingdan',html)
				})
			}
			//点击VIP按钮
			// toolbar.find('#a_addordervip').eq(0).click(function(){
			// 		vip_top('dingdan',html)
			// 	})
			//添加上传照片按钮
			if (local_上传照片=='true'){
				toolbar.append('<input type="file" id="text_photo"   size="20"/><button id="button_photo" onclick="return false">上传照片</button>') 
				//点击上传照片按钮
				toolbar.find('#button_photo').click(function(){
					add_phone()
				})
			}
			//添加北京订单数量按钮
			if (local_北京订单数量=='true'){
				toolbar.append('<button id="bj_before" onclick="return false">北京12点之前查询</button><button id="bj_after" onclick="return false">北京12点之后查询</button>')
				//查询北京订单数量
				toolbar.find('#bj_before').click(function(){
					find_shuliang('before')
				})
				toolbar.find('#bj_after').click(function(){
					find_shuliang('after')
				})
			}
			//添加每日报表按钮
			if (local_每日报表=='true'){
				toolbar.append('<button id="baobiao_before" onclick="return false">每日报表_之前</button><button id="baobiao_after" onclick="return false">每日报表_之后</button>')
				//每日报表
				toolbar.find('#baobiao_before').click(function(){
					baobiao('before')
				})
				toolbar.find('#baobiao_after').click(function(){
					baobiao('after')
				})
			}
			//标签打印_新格式标签_换行
			if (local_标签打印_新格式标签_换行 == 'true'){
				//点击 标签打印 按钮
				toolbar.find('#a_seq_lable_pr').click(function(){
					函数_标签打印_新格式标签_样品名占两行()
				})
			}
		}
	}
	
	//订单管理，VIP按钮放在最前面  绑定事件：如果点击VIP下单 load后运行 add_order_iframe()
	function vip_top(html){  
		//如果vip 下单弹框显示完全，则运行
		var html_tankuang=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]')  //订单管理  弹框页面
		html_tankuang.on('load',function(){
			html=html_tankuang.contents().find('body').eq(0)
			add_order_iframe(html)
		})
	}
	
	//订单管理  vip下单 页面
	function  add_order_iframe(html){
		//添加订单的iframe弹框界面
		if(html.length===1){
			//建立文本框 放提醒
			html.find("[class='plate-col']").eq(0).append('<div style="position:absolute;right:310px;top:90px"><font size="3" color="red"><textarea id="tixing" rows="11" cols="40"></textarea></font></div>')
			//隐藏左下角提醒
			html.find('#cust_tixing').css('display',"none")
			//建立出齐发按钮和先正常发，最后整理发 按钮
			//html.find("#linkToGeneNo").next().find('label').eq(0).append('<button id="chuqifa" onclick="return false">出齐发</button><button id="zhengchangfa_zhenglifa" onclick="return false">正常发,整理发</button>')
			
			
			//==============================开始 检查到客户变了，那么 ①把客户信息显示出来  ②生产实验室 如果不是北京分公司，那么就显示一个颜色===========
			// 观察器的配置（需要观察什么变动）
			var config = { attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
			var 选择客户后 = function(mutationRecoard, observer) {
				//隐藏图片
				html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏
				html.find("[class='col-xs-3 plate-container']").addClass('hidden')//添加隐藏
				html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏文字
				//客户信息显示出来
				kehu_showAll(html);
				//生产实验室 如果不是北京分公司，那么就显示一个颜色
				color_shengchan_fengongsi(html)
			};
			var observer = new MutationObserver(选择客户后);
			// 以上述配置开始观察目标节点
			dom=$(html).find("#select2-ktz-container").eq(0).get(0)
			observer.observe(dom, config);
			//==============================结束 检查到客户变了，那么 ①把客户信息显示出来  ②生产实验室 如果不是北京分公司，那么就显示一个颜色===========
			
			
			//==============================开始 当table数据变化的时候（根据表格的板号的style属性变化判断），检查是否有空的引物 也数引物个数===================
			// 观察器的配置（需要观察什么变动）
			var config = { attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
			// 当观察到变动时执行的回调函数
			var call_fun = function(mutationRecoard, observer) {
				console.log('table变化')
				//隐藏图片
				html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏
				html.find("[class='col-xs-3 plate-container']").addClass('hidden')//添加隐藏
				html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏文字
				//检测空引物
				检测空引物(html)
				//引物弹框页面，显示引物个数 延时一下
				setTimeout(function(){primer(html);primer_checkbox()}, 100 )
			};
			// 创建一个观察器实例并传入回调函数
			var observer = new MutationObserver(call_fun);
			// 以上述配置开始观察目标节点
			dom=html.find("[class='ht_clone_top handsontable']").find('thead').find('th').eq(0).get(0)
			observer.observe(dom, config);
			//==============================结束 当table数据变化的时候（根据表格的板号的style属性变化判断），检查是否有空的引物===================
			
			
			//==============================开始 当提醒数据变化的时候 把提醒放到右边  ===================、
			// 观察器的配置（需要观察什么变动）, subtree: true,characterDataOldValue:true,attributDataOldValue:true
			var config = {childList: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
			// 当观察到变动时执行的回调函数
			var call_fun = function(mutationRecoard, observer) {
				console.log('提醒变化')
				提醒=html.find('#cust_tixing').text()
				提醒=提醒.replace('课题组提醒','\r课题组提醒')
				html.find('#tixing').eq(0).val(提醒)
			};
			// 创建一个观察器实例并传入回调函数
			var observer = new MutationObserver(call_fun);
			// 以上述配置开始观察目标节点
			dom=html.find("#cust_tixing").eq(0).get(0)
			observer.observe(dom, config);
			
			//==============================结束 当提醒数据变化的时候 把提醒放到右边===================
		
		}
		//点击出齐发
		html.find('#chuqifa').click(function(){
			订单备注元素=html.find("#linkToGeneNo").next().find('textarea').eq(0)
			订单备注元素.val('结果出齐发送 '+订单备注元素.val())
		})
		//点击正常发，整理发，
		html.find('#zhengchangfa_zhenglifa').click(function(){
			订单备注元素=html.find("#linkToGeneNo").next().find('textarea').eq(0)
			订单备注元素.val('先正常发，最后再整理发送一封完整的结果 '+订单备注元素.val())
		})
	}
	
	//检测是否有空引物
	function 检测空引物(html){
		arr_tr=html.find('#handsontable').find('tbody').find('tr')
		var tangs_是否有空引物=false
		arr_tr.each(function(num){
			primer_name=$(this).find('td').eq(8).text()  //获取引物名称
			if (primer_name===''){
				tangs_是否有空引物=true
			}
		})
		if (tangs_是否有空引物===true){
			if ($('#kong_yinwu').length==0){
				$('.sexybutton').parent().prepend('<span id="kong_yinwu" style="color:red;">有空的引物，是否主动添加的？检查一下</span>')
			}
		}else{
			$('#kong_yinwu').remove()
		}
	}
	
	//添加订单页面，选择好客户后显示详细信息
	function kehu_showAll(html){
		//添加文本框 存放提醒内容 和客户信息
		if(html.find('#kehu_all').size()==0){
			t='<div id="kehu_all" style="position:absolute;left:60px;width:1300px;height:67px"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size="3" color="red"></font></div>'
			html.find("[class='wrapper wrapper-content animated fadeInRight']").eq(0).prepend(t)
		}
		//获取客户信息
		客户信息=html.find('#select2-ktz-container').attr('title')
		html.find('#kehu_all').find('font').eq(0).text(客户信息)
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
	
	//订单管理 如果生产公司不是北京分公司，则显示一个颜色
	function 非北京分公司显示颜色(html){
		//先运行一遍
		html.find('#list').eq(0).find('[aria-describedby=list_seqo_product_company_name]').each(function(){
			if($(this).text()!="北京分公司"){
				$(this).attr('Bgcolor','#AeEEe7')
			}
		})
		//当table出现数据改变的时候
		$(html).find('#list').on('DOMNodeInserted',function(e) {
			//$(e.target)代表的每一行
			生产公司=$(e.target).find('[aria-describedby=list_seqo_product_company_name]')
			if(生产公司.text()!="北京分公司"){
				生产公司.attr('Bgcolor','#AeEEe7')
			}
		});
	}
	
	//引物弹框页面，显示引物个数
	function primer(html){
		var primer_html=html.find(".layui-layer-content").eq(0)//如果找到 则说明有引物弹框
		console.log(primer_html.length)
		if(primer_html.length==1){  //说明有引物弹框
			primer_显示引物个数(html,primer_html)
			primer_监听(html,primer_html)
		}
	}
	
	//primer 监听
	function primer_监听(html,primer_html){
		// 观察器的配置（需要观察什么变动）, subtree: true,characterDataOldValue:true,attributDataOldValue:true
		var config = {childList: true,subtree: true,attributes:true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
		// 当观察到变动时执行的回调函数
		var call_fun = function(mutationRecoard, observer) {
			console.log('引物变化')
			primer_显示引物个数(html,primer_html)
		};
		// 创建一个观察器实例并传入回调函数
		var observer = new MutationObserver(call_fun);
		// 以上述配置开始观察目标节点
		dom=primer_html.find("tbody").eq(0).get(0)
		observer.observe(dom, config);
	}
	
	//primer  显示引物个数
	function primer_显示引物个数(html,primer_html){
		primer_num=primer_html.find('tbody').find('tr').size()  //  统计tr出现的次数，减去1，就是所有的引物的总数
		对应_primer_num=0
		for (i=0;i<primer_num;i++){
			当前tr=primer_html.find('tbody').find('tr').eq(i).html()
			if (当前tr.indexOf('readonly')>-1){
				对应_primer_num+=1
			}
		}
		primer_num=primer_num-对应_primer_num
		title_html=html.find('.layui-layer-title').eq(0)
		title_html.html('新增的自备引物数量为： &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;<span style=\"color:red;font-size:40px\">'+ primer_num+'</span>')
	}
	
	//引物弹框页面，批量改浓度，新增引物按钮
	function primer_checkbox(){
		var primer_html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('.layui-layer-content').eq(0)//如果找到 则说明有引物弹框
		if(primer_html.length==1){  //说明有引物弹框
			if(primer_html.find('#nongdu_text').size()==1){
				return false
			}
			//table的元素
			table_html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find("[class='table table-stripped table-bordered']").eq(0)  //新增自备引物 弹框的table表格
			//如果select框的引物 时间太久  则显示一个颜色
			table_html.find('select.form-control').each(function(){
				//select引物的内容
				text_yinwu=$(this).find('option:selected').text()
				if(text_yinwu!=="新增"){
					//判断浓度是否是干粉或者合成
					primer_text=text_yinwu.substring(text_yinwu.lastIndexOf("浓度：") + 3,text_yinwu.lastIndexOf("-客户"))
					//如果判断引物浓度是干粉或者合成 
					if(primer_nongdu_panduan(primer_text)){
						return true
					}
					//查找时间文本
					time_text=text_yinwu.substring(text_yinwu.lastIndexOf("（") + 1,text_yinwu.lastIndexOf("）"))
					var time_old = new Date(time_text).getTime();
					var time_now=new Date().getTime()
					tianshu_chazhi=(time_now-time_old)/(1*24*60*60*1000)
					if(tianshu_chazhi>30){
						$(this).css('color','#FF0000')
						title_html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('.layui-layer-title').eq(0)
						if(title_html.html().indexOf('查看下是否有过期')<0){
							title_html.html(title_html.html()+'<span style="color:red;font-size:20px"> &nbsp;&nbsp;&nbsp;&nbsp;查看下是否有过期的引物</span> ')
						}
					}else{
						$(this).css('color','#676A6C')
					}
				}else{
					$(this).css('color','#676A6C')
				}
			})
			//如果没有新增按钮则运行下面代码①新增
			if(table_html.find('td.butt').size()==0){//如果是第一次则运行下面代码
				table_html.find('tr').append('<td class="butt"><button class="butt_butt">新增</button></td>') //添加  新增 按钮
				table_html.find('button.butt_butt').eq(0).text('全部新增')  //把头部的 新增 按钮改成  全部新增 按钮
				table_html.find('button.butt_butt').eq(0).addClass('butt_butt_top')  //给头部的   全部新增 按钮  添加个class
				table_html.find('button.butt_butt').eq(0).removeClass('butt_butt')//把头部的   全部新增 按钮 之前的class删除
			}
			//如果没有改浓度按钮则运行下面代码 ②更改浓度
			if(table_html.find('#nongdu_text').size()==0){
				nongdu_elem=table_html.find('th:contains(浓度)')  //根据文本内容查找元素  浓度那个元素
				nongdu_elem.html('<input type="text" id="nongdu_text" size="2" /><button id="nongdu_button"><font size="1">更改浓度</font></button>')
			}
	
		}else{return}  //如果长度不为1，那么退出函数
		//下面的新增  ①新增
		table_html.find('.butt_butt').click(function(){
			$(this).parent().parent().find("option[value='-1']").attr('selected','selected')  //把选择那列改为新增选项
			$(this).parent().parent().find("[class='form-control text-center']").removeAttr('readonly')
			$(this).parent().prev().find("[class='form-control text-center']").val('10P')
		});
		//顶部的新增  ①新增
		table_html.find('.butt_butt_top').click(function(){
			$(this).parent().parent().parent().parent().find("option[value='-1']").attr('selected','selected')  //把所有的都改成新增选项
			$(this).parent().parent().parent().parent().find("[class='form-control text-center']").removeAttr('readonly')//去掉所有的readonly
			$(this).parent().parent().parent().parent().find("[class='form-control text-center']").val('10P')
		});
		// 顶部的更改浓度按钮 ②更改浓度
		table_html.find("#nongdu_button").click(function(){
			nongdu_text_bottom_all=table_html.find("[class='form-control text-center']").not('[readonly]')  //获取可以更改的所有的浓度的文本框
			nongdu_text_bottom_all.val(table_html.find('#nongdu_text').val())  //
		})
	}
	//判断 primer弹框 里面的引物浓度是否是干粉 合成 之类的
	function primer_nongdu_panduan(nongdu){
		if(nongdu.indexOf('干粉')>=0){
			return true
		}
		//如果是三个数字
		var patt1 = new RegExp(/\d\d\d/);
		var result=patt1.test(nongdu)
		if(result===true){
			return true
		}
		//如果是三个数字 用-分开的
		var patt1 = new RegExp(/\d(-)\d\d/);
		var result=patt1.test(nongdu)
		if(result===true){
			return true
		}
		//如果是四个数字
		patt1 = new RegExp(/\d\d\d\d/);
		result=patt1.test(nongdu)
		if(result===true){
			return true
		}
		//如果是四个数字 用-分开的
		patt1 = new RegExp(/\d\d(-)\d\d/);
		result=patt1.test(nongdu)
		if(result===true){
			return true
		}
	}
	
	//上传照片
	function add_phone(){
		//订单管理的toolbar
		var toolbar=html.find('.toolbar').eq(0)
		var order_selects=html.find('tbody').find("[aria-selected='true']")  //选择的所有行
		if (order_selects.size()==0){
			return false
		}
		//第一个选择的行
		var select=order_selects.eq(0)
		order_number=select.find('[aria-describedby=list_seqo_id]').text()
		
		//上传图片
		var imgUrl = toolbar.find('#text_photo').eq(0).val()  //获取文件框的图片内容
		if(imgUrl==""){return false}
		var formData = new FormData();
			formData.append("imgFile", toolbar.find('#text_photo')[0].files[0]);
		formData.append('localUrl',imgUrl);
		var zhaopian=""
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.ajax({
				url: '/kindeditor-4.1/asp.net/upload_json.ashx?dir=image', //
				type: 'POST',
				data:  formData,
				contentType: false,
				processData: false,
				success: function (args) {
					console.log(args);  /*服务器端的图片地址*/
					res_shuzu=args.split('attached')
					if(res_shuzu.length<2){alert('重试');return false}
					zhaopian=res_shuzu[1].slice(0,-2)  //比如 /image/20210715/20210715200249_6067.jpg
				}
			})
		$.post("/seq/ashx/seqSampleHandler.ashx?action=addOrderJietuPhoto&jietu_url=/kindeditor-4.1/attached"+zhaopian+"&seqo_order_id="+order_number,
			{action:"addOrderJietuPhoto",jietu_url:"/kindeditor-4.1/attached"+zhaopian,seqo_order_id:order_number},
			function (data) {console.log(data)});  //最后一次提交成功
		toolbar.find('#text_photo').eq(0).val('')
		alert('OK,刷新查看')
	}
	
	//查询北京订单数量
	function find_shuliang(before_after){
		var order_html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了订单管理的页面
		if (before_after=='before'){
			if(order_html.find('#text_num_all').size()==0){
				order_html.find('.ui-jqgrid-titlebar').eq(0).append('<input type=text id="text_num_all" size="200" />')
			}
			today=getday_y_n('today')
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			//昌平 当天的数量
			$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+today+"&endtime="+today+"&seqo_Belongs_id=38",
				function (data,status) {
					order_html.find('#text_num_all').eq(0).attr('value',"")
					order_html.find('#text_num_all').eq(0).attr('value',"北京昌平 "+order_yp_num(data)+"  ")
				});
			//亦庄 当天的数量
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+today+"&endtime="+today+"&seqo_Belongs_id=81",
				function (data,status) {
					c=order_html.find('#text_num_all').eq(0).val()
					order_html.find('#text_num_all').eq(0).attr('value',c+"亦庄 "+order_yp_num(data)+"  ")
				});
		}
		//order_html.find('#bj_after').click(function(){
		if (before_after=='after'){
			if(order_html.find('#text_num_all').size()==0){
				order_html.find('.ui-jqgrid-titlebar').eq(0).append('<input type=text id="text_num_all" size="200"/>')
			}
			today=getday_y_n('today')
			yestday=getday_y_n('yestday')
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			//昌平 12点之前的数量
			$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+yestday+"&endtime="+yestday+"&seqo_Belongs_id=38",
				function (data,status) {
					order_html.find('#text_num_all').eq(0).attr('value',"")
					order_html.find('#text_num_all').eq(0).attr('value',"北京昌平 "+order_yp_num(data)+"  ")
					//亦庄 12点之前的数量
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+yestday+"&endtime="+yestday+"&seqo_Belongs_id=81",
					function (data,status) {
						c=order_html.find('#text_num_all').eq(0).val()
						order_html.find('#text_num_all').eq(0).attr('value',c+"亦庄 "+order_yp_num(data)+"  ")
						//昌平 12点之后的数量
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+today+"&endtime="+today+"&seqo_Belongs_id=38",
							function (data,status) {
								c=order_html.find('#text_num_all').eq(0).val()
								order_html.find('#text_num_all').eq(0).attr('value',c+"12点后 北京昌平 "+order_yp_num(data)+"  ")
								//亦庄 2点之后的数量
								$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
								$.get("/seq/xmldata/xmlSeqOrderAmount.aspx?begtime="+today+"&endtime="+today+"&seqo_Belongs_id=81",
									function (data,status) {
										c=order_html.find('#text_num_all').eq(0).val()
										order_html.find('#text_num_all').eq(0).attr('value',c+"亦庄 "+order_yp_num(data)+"  ")
									});
							});
					});
				});
		}
	}
	
	//根据返回的结果，查询订单总数和反应总数
	function order_yp_num(data){
		if(!data.match(/(\d{1,})(?=<\/order_sum>)/g)){
			return "订单 0  反应  0"
		}
		order_num=eval(data.match(/(\d{1,})(?=<\/order_sum>)/g).join("+"))
		yp_num=eval(data.match(/(\d{1,})(?=<\/sam_sum>)/g).join("+"))
		return "订单 "+order_num+"   反应 "+yp_num
	}
	
	
	//业务员报表
	function baobiao(before_after){
		if (before_after=='before'){
			today=getday_y_n('today')
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=冯世泰');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=王春红-北');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=王春红-西');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=王春红(外)');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=王春红-W');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=陈真真');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=陈真真-南');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=陈真真-W');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=陈真真-西');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=韩亮');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=张京华');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=张京华-W');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=朱旭');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + today + '&saleman=朱旭(外)');
		}
		if (before_after=='after'){
			yestday=getday_y_n('yestday')
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=冯世泰');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=王春红-北');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=王春红-西');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=王春红(外)');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=王春红-W');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=陈真真');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=陈真真-南');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=陈真真-W');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=陈真真-西');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=韩亮');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=张京华');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=朱旭');
			sleep(300)
			window.open('http://49.72.111.82:8081/seq/ReportHtml/seqSalemanBusiness.aspx?begtime=' + yestday + '&saleman=朱旭(外)');
		}
	}

	//函数_标签打印_新格式标签_样品名占两行
	function 函数_标签打印_新格式标签_样品名占两行(){
		//弹框加个按钮
		$('#uiform').find('#txt_temple_label_style3').parent().append('<br /><button id="button_xingeshibiaoqian_yangpinming_huanhang" onclick="return false">新格式标签_样品名换行</button>')
		//点击样品名占两行按钮
		$('#uiform').find('#button_xingeshibiaoqian_yangpinming_huanhang').click(function(){
			函数_标签打印_新格式标签_样品名占两行_详细代码()
		})
	}

	//函数_模板排版样品名占两行()
	function 函数_标签打印_新格式标签_样品名占两行_详细代码(){
		起始订单=$('#uiform').find('#txt_seqo_order_begin').val()
		结束订单=$('#uiform').find('#txt_seqo_order_end').val()
		//用的是反应组那台IIS服务器
		window.open('http://192.168.1.34/xingeshibiaoqian_yangpinming_huanhang/print_xingeshibiaoqian_yangpinming_huanhang.html?begin='+起始订单+'&end='+结束订单)
	}
}

