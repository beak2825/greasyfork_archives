function 切换用户(){
	var user = localStorage.getItem('user');
	if (user=='申高天1'){
		user='申高天'
	}
	var pass = localStorage.getItem('pass');
	if($('#A1', window.parent.document).text()==="员工自助 1"){
		return false
	}
	$('#A1').text('员工自助 1')
	var 当前用户名=$('#curname',window.parent.document).text()
	if(当前用户名==='申高天' || 当前用户名==='冯丽丽'  ){
		$('#curname').parent().prepend('<span>切换至<a href="#" id="luru" onclick="return false">录入</a></span>&nbsp;&nbsp;')
	}else if (当前用户名==='薛培'){
		$('#curname').parent().prepend('<span>切换至<a href="#" id="luru" onclick="return false">删除</a></span>&nbsp;&nbsp;')
	}
	else if(当前用户名==="录入" || 当前用户名==="删除" ){
		$('#curname').parent().prepend('<span>切换至<a href="#" id="luru" onclick="return false">'+user+'</a></span>&nbsp;&nbsp;')
	}
	$('#curname').parent().prepend('<a href="#" id="chajian_gongneng_zizhu_xuanze"  style="position:relative;z-index:1; onclick="return false">插件功能自主选择</a>&nbsp;&nbsp;')
	//主动生成插件div
	插件功能自主选择()
	
	//===============================================
	//点击 切换账户
	$('#luru').click(function(){
		//退出账户
		$.get("/ajax/loginout.ashx",
			function (data,status) {
				if(当前用户名==='申高天' || 当前用户名==='冯丽丽'){
					var user_luru = localStorage.getItem('user_luru');
					var pass_luru = localStorage.getItem('pass_luru');
					//post请求 POST登录
					$.post("/ajax/login.ashx",
						{u:user_luru,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass_luru,c:"38",orgcode:'睿博兴科'},
						function (data) {
							//刷新本页面
							location.reload();
						});
				}else if (当前用户名==='薛培'){
					var user_shanchu = localStorage.getItem('user_shanchu');
					var pass_shanchu = localStorage.getItem('pass_shanchu');
					//post请求 POST登录
					$.post("/ajax/login.ashx",
						{u:user_shanchu,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass_shanchu,c:"0",orgcode:'睿博兴科'},
						function (data) {
							//刷新本页面
							location.reload();
						});
				}
				else if(当前用户名==="录入" || 当前用户名==="删除"){
					//post请求 POST登录
					$.post("/ajax/login.ashx",
						{u:user,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass,c:"0",orgcode:'睿博兴科'},
						function (data) {
							//刷新本页面
							location.reload();
						});
				}
			})
	})
	
	
	// 插件功能自主选择  
	$('#chajian_gongneng_zizhu_xuanze').click(function(){
		$('#div_chajian').toggle()
	})
	function 插件功能自主选择(){
		$("body").append('<div id="div_chajian" style="position:relative;float:right; margin-right:200px;margin-top:20px;width:800px;height:240px;border:1px solid orange;background-color:#ffffff;z-index:3;display:none"></div>') //display:none
		
		//权限按钮
		$('#div_chajian').append('<button id="id_luru_quanxian">录入权限</button>')
		$('#div_chajian').append('<button id="id_fanying_quanxian">反应权限</button>')
		$('#div_chajian').append('<button id="id_hecheng_quanxian">合成权限</button>')
		$('#div_chajian').append('<button id="id_muban_quanxian">模板权限</button>')
		$('#div_chajian').append('<button id="id_baogao_quanxian">报告权限</button>')
		$('#div_chajian').append('<button id="id_xiangmu_quanxian">项目权限</button>')
		$('#div_chajian').append('<button id="id_tongji_quanxian">统计</button><br/>')
		//具体
		$('#div_chajian').append('<span class="class_luru_quanxian">客户管理<br/></span>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">手机号查询姓名<br/></label>')
		$('#div_chajian').append('<span class="class_luru_quanxian">课题组管理<br/></span>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">添加北京价格</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">添加广州价格</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">添加海南价格<br/></label>')
		$('#div_chajian').append('<span class="class_luru_quanxian">订单管理<br/></span>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">订单管理_VIP</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">上传照片</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">北京订单数量</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">每日报表<br/></label>')
		$('#div_chajian').append('<span class="class_luru_quanxian">测序样品<br/></span>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">修改样品名称</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">批量添加反应</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">显示订单号</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">显示样品名称</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">查询引物</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">其他</label>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">查询平板菌返还</label>')
		if (当前用户名=='申高天'){
			$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">模板板号和孔号改为负一</label>')
			$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">修改模板板号</label>')
			$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">修改模板孔号<br/></label>')
		}else{
			$('#div_chajian').append('<br/>')
		}
		$('#div_chajian').append('<span class="class_luru_quanxian">自备引物<br/></span>')
		$('#div_chajian').append('<label class="class_luru_quanxian"><input class="checkbox_chajian" type="checkbox">在测序样品显示选择的引物<br/></label>')
		
		//===============================================反应组权限  开始==============================================================
		$('#div_chajian').append('<span class="class_fanying_quanxian">反应生产<br/></span>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">查询加测反应</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">查询选择的同名引物</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">获取加测引物板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">查询模板板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">设置板号<br /></label>')
		
		$('#div_chajian').append('<span class="class_fanying_quanxian">模板生产/浏览<br/></span>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">质粒引物板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">直提引物板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">切胶引物板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">菌引物板号</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">重抽引物板号<br/></label>')
		
		
		$('#div_chajian').append('<span class="class_fanying_quanxian">测序样品<br/></span>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">重跑标颜色</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">模板改为负一<br/></label>')
		
		$('#div_chajian').append('<span class="class_fanying_quanxian">样品补送<br/></span>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">打印样品标签</label>')
		$('#div_chajian').append('<label class="class_fanying_quanxian"><input class="checkbox_chajian" type="checkbox">标颜色引物已清或不足</label>')
		
		//===============================================反应组权限  结束==============================================================
		
		//===============================================模板组权限  开始==============================================================
		$('#div_chajian').append('<span class="class_muban_quanxian">模板排版<br/></span>')
		$('#div_chajian').append('<label class="class_muban_quanxian"><input class="checkbox_chajian" type="checkbox">同客户名样品个数样品名提示<br/></label>')
		$('#div_chajian').append('<span class="class_muban_quanxian">订单管理<br/></span>')
		$('#div_chajian').append('<label class="class_muban_quanxian"><input class="checkbox_chajian" type="checkbox">标签打印_新格式标签_换行<br/></label>')
		//===============================================模板组权限  结束==============================================================
		
		
		//===============================================合成部权限  开始==============================================================
		
		$('#div_chajian').append('<span class="class_hecheng_quanxian">合成订单<br/></span>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">合成_vip按钮前置<br/></label>')
		$('#div_chajian').append('<span class="class_hecheng_quanxian">合成样品<br/></span>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">判断是否是测序引物</label>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">查询同序列引物</label>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">查询订单号</label>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">查询打印修饰HPLC标签<br/></label>')
		$('#div_chajian').append('<span class="class_hecheng_quanxian">安排合成<br/></span>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">李楠和达尔文生物改变颜色</label>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">圆稀赠引物标签加姓名</label>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">上机表_兼并碱基加颜色<br/></label>')
		$('#div_chajian').append('<span class="class_hecheng_quanxian">安排费用<br/></span>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">不干胶式_备注带缺和不带缺<br/></label>')
		$('#div_chajian').append('<span class="class_hecheng_quanxian">合成订单完成/合成入财务<br/></span>')
		$('#div_chajian').append('<label class="class_hecheng_quanxian"><input class="checkbox_chajian" type="checkbox">合成订单完成_合成入财务_不干胶式<br/></label>')
		
		
		
		$('#div_chajian').append('<span class="class_baogao_quanxian">测序文件<br/></span>')
		$('#div_chajian').append('<label class="class_baogao_quanxian"><input class="checkbox_chajian" type="checkbox">同一个版号中根据实验状态总结<br/></label>')
		
		//===============================================项目组权限==============================================================
		$('#div_chajian').append('<span class="class_xiangmu_quanxian">基因新订单<br/></span>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">CNAS加急</label>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">添加按钮提示</label>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">查询自己订单<br/></label>')
		$('#div_chajian').append('<span class="class_xiangmu_quanxian">基因返还<br/></span>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">查询返还单生成<br/></label>')
		$('#div_chajian').append('<span class="class_xiangmu_quanxian">基因QC<br/></span>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">查询qc待处理_已排版<br/></label>')
		$('#div_chajian').append('<span class="class_xiangmu_quanxian">模板排版<br/></span>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">模板排版标签_样品名占两行<br/></label>')
		$('#div_chajian').append('<span class="class_xiangmu_quanxian">反应生产<br/></span>')
		$('#div_chajian').append('<label class="class_xiangmu_quanxian"><input class="checkbox_chajian" type="checkbox">反应BDT表_样品名占两行<br/></label>')
		
		$('#div_chajian').append('<span class="class_tongji_quanxian">统计<br/></span>')
		$('#div_chajian').append('<label class="class_tongji_quanxian"><input class="checkbox_chajian" type="checkbox">测序入财务_统计汇总_订单款项_PCR_大于8<br/></label>')
		$('#div_chajian').append('<span class="class_tongji_quanxian">仓库<br/></span>')
		$('#div_chajian').append('<label class="class_tongji_quanxian"><input class="checkbox_chajian" type="checkbox">仓库包含测序_出库<br/></label>')
		
		//默认开启一些权限
		//建一个录入的item
		var local_录入账号 = localStorage.getItem('user_luru');
		if (local_录入账号 === null){
			localStorage.setItem('user_luru','录入');
			localStorage.setItem('pass_luru','000000');
		}
		var local_删除账号 = localStorage.getItem('user_shanchu');
		if (local_删除账号 === null){
			localStorage.setItem('user_shanchu','删除');
			localStorage.setItem('pass_shanchu','000000');
		}
		权限对象_公共={
			//添加北京价格:'添加北京价格',
			//订单管理_VIP:'订单管理_VIP',
			//修改样品名称:'修改样品名称',
			//显示订单号:'显示订单号',
			手机号查询姓名:'手机号查询姓名',
			//反应组
			// 质粒引物板号:'质粒引物板号',
			// 直提引物板号:'直提引物板号',
			// 切胶引物板号:'切胶引物板号',
			// 菌引物板号:'菌引物板号',
		}
		for ( key in 权限对象_公共) {
			var local = localStorage.getItem(key);
			if (local === null){
				localStorage.setItem(key,'true');
			}
		}
		权限对象_申高天={
			每日报表:'每日报表',
			//批量添加反应:'批量添加反应',
			//显示样品名称:'显示样品名称',
			//查询引物:'查询引物',
			//其他:'其他',
			//在测序样品显示选择的引物:'在测序样品显示选择的引物',
			//判断是否是测序引物:'判断是否是测序引物',
			//查询同序列引物:'查询同序列引物',
			//查询订单号:'查询订单号',
			//添加按钮提示:'添加按钮提示'
		}
		if(当前用户名==='申高天' || 当前用户名==='冯丽丽'){
			for ( key in 权限对象_申高天) {
				var local = localStorage.getItem(key);
				if (local === null){
					localStorage.setItem(key,'true');
				}
			}
		}
		
		//获取本地local数据，如果有true的，则自动打上对号
		var all_local数据=localStorage.valueOf()
		for(var text文本  in all_local数据){
			是否为true=all_local数据[text文本]
			if (是否为true=='true'){
				$('#div_chajian').find('label:contains("'+text文本+'")').find('input').attr('checked',true)
			}
	    }
		
		//默认隐藏所有权限
		$('#div_chajian').find('.class_luru_quanxian').css('display','none')
		$('#div_chajian').find('.class_fanying_quanxian').css('display','none')
		$('#div_chajian').find('.class_hecheng_quanxian').css('display','none')
		$('#div_chajian').find('.class_muban_quanxian').css('display','none')
		$('#div_chajian').find('.class_baogao_quanxian').css('display','none')
		$('#div_chajian').find('.class_xiangmu_quanxian').css('display','none')
		$('#div_chajian').find('.class_tongji_quanxian').css('display','none')
		//点击权限按钮 显示 隐藏 权限
		$('#id_luru_quanxian').click(function(){
			$('.class_luru_quanxian').toggle()
		})
		$('#id_fanying_quanxian').click(function(){
			$('.class_fanying_quanxian').toggle()
		})
		$('#id_hecheng_quanxian').click(function(){
			$('.class_hecheng_quanxian').toggle()
		})
		$('#id_muban_quanxian').click(function(){
			$('.class_muban_quanxian').toggle()
		})
		$('#id_baogao_quanxian').click(function(){
			$('.class_baogao_quanxian').toggle()
		})
		$('#id_xiangmu_quanxian').click(function(){
			$('.class_xiangmu_quanxian').toggle()
		})
		$('#id_tongji_quanxian').click(function(){
			$('.class_tongji_quanxian').toggle()
		})
	}
	//点击checkbox
	$('.checkbox_chajian').click(function(){
		text文本=$(this).parent()[0].textContent
		if($(this)[0].checked==true){
			localStorage.setItem(text文本,'true');
		}else{
			localStorage.setItem(text文本,'false');
		}
	})
}
