function 测序样品(){
	console.log('新的测序样品界面')
	var local_修改样品名称=localStorage.getItem('修改样品名称');
	var local_批量添加反应=localStorage.getItem('批量添加反应');
	var local_显示订单号=localStorage.getItem('显示订单号');
	var local_显示样品名称=localStorage.getItem('显示样品名称');
	var local_打印样品标签=localStorage.getItem('打印样品标签');
	var local_查询引物=localStorage.getItem('查询引物');
	var local_其他=localStorage.getItem('其他');
	var local_模板板号和孔号改为负一=localStorage.getItem('模板板号和孔号改为负一');
	var local_模板改为负一=localStorage.getItem('模板改为负一');  //这是反应组的权限  模板板号和孔号改为负一
	var local_修改模板板号=localStorage.getItem('修改模板板号');
	var local_修改模板孔号=localStorage.getItem('修改模板孔号');
	var local_查询平板菌返还=localStorage.getItem('查询平板菌返还');
	var local_重跑标颜色=localStorage.getItem('重跑标颜色');
	var 当前用户名=$('#curname',window.parent.document).text()
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]')//测序样品页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	
	
	
	初始化()
	function 初始化(){
		if (local_重跑标颜色=='true'){
			//反应组标的颜色
			状态_标颜色_反应组()
		}else{
			//录入标的颜色
			//选中一些行后，把相同引物位置的其余引物标记颜色
			table.on('click','tbody tr',function(){
				相同引物位置标记颜色();
			})
			//把 测序样品 的 流程名称 是反应生产，模板失败，停止反应  引物已清 标颜色
			状态_标颜色_录入组()
		}
		
		//点击批量编辑 批量编辑测序引物 按钮  如果需要改变引物，那么需要跟反应组说一下（反应生产 模板成功等）
		$("#w").on('click','#select_temple_notNull',function(){
			更改引物_提醒_跟反应组说()
		})
		if (当前用户名=='申高天'){
			//改成每页150个数据
			html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('150')
		}
	}
	
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			
			//反应组  模板改为负一  和录入组的  模板板号和孔号改为负一 是一样的。
			if (local_模板改为负一=='true'){
				toolbar.append('<button id="button_muban_-1" onclick="return false">模板板号和孔号改为-1</button>')
				//点击按钮
				toolbar.find('#button_muban_-1').click(function(){
					模板板号和孔号改为负一()
				})
			}
			
			//添加修改样品名称按钮
			if (local_修改样品名称=='true'){
				toolbar.append('<span style="position:relative;z-index:2;"><button id="button_xiugai_yangpin" onclick="return false">修改样品名称◇</button><div id="div_xiugai_yangpin" style="position:absolute;width:250px;height:95px;border:1px solid orange;background-color:	#1B211D;display:none"></div></span>')
				var div_show_yincang=toolbar.find('#div_xiugai_yangpin').eq(0)
				div_show_yincang.append('<input type="text" class="text_huichejian" id="text_qianzhui" placeholder="样品前缀" size="10"/><button id="button_qianzhui" onclick="return false">添加样品前缀</button>')
				div_show_yincang.append('<input type="text" class="text_huichejian" id="text_houzhui"  placeholder="样品后缀" size="10"/><button id="button_houzhui" onclick="return false">添加样品后缀</button>')
				div_show_yincang.append('<input type="text" class="text_huichejian" id="text_gaiqian"  placeholder="需要改的部分" size="15"/><input type="text" class="text_huichejian" id="text_gaihou" placeholder="改成的部分" size="10"/><button id="button_genggai" onclick="return false">更改部分样品名称</button>')
				
				//点击修改样品名称按钮  显示或者隐藏DIV
				toolbar.find('#button_xiugai_yangpin').click(function(){
					显示隐藏DIV('#div_xiugai_yangpin',"button_xiugai_yangpin")
				})
				//点击添加样品前缀按钮执行如下函数
				toolbar.find('#button_qianzhui').click(function(){
					添加前后缀('前缀','#text_qianzhui')
				})
				//点击添加样品后缀按钮执行如下函数
				toolbar.find('#button_houzhui').click(function(){
					添加前后缀('后缀','#text_houzhui')
				})
				//点击 更改部分  执行如下函数
				toolbar.find('#button_genggai').click(function(){
					更改部分()
				})
				//给文本框绑定回车键的函数
				toolbar.find('.text_huichejian').keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
			}
			//添加批量添加反应按钮
			if (local_批量添加反应=='true'){
				toolbar.append('<span style="position:relative;z-index:2;"><button id="button_piliang" onclick="return false"><font color="red">批量添加反应◇</font></button><div id="div_piliang" style="position:absolute;left:-250px;height:100px;width:430px;height:105px;border:1px solid orange;background-color:	#1B211D;display:none"></div></span>')
				div_piliang=toolbar.find('#div_piliang').eq(0)
				div_piliang.append('<input type="text" id="text_piliang_duotiaodai" placeholder="添加多条带" size="10" value="1"/><button id="button_duotiaodai" onclick="return false">批量添加多条带,默认双条带(带引物)</button><br/><br/>')
				div_piliang.append('<input type="text" id="text_piliang_tongming" placeholder="添加同名反应" size="10" value="1"/><button id="button_tongming" onclick="return false">批量添加同名反应(不带引物,一个名字只能选一次)</button><br/><br/>')	
				div_piliang.append('<input type="text" id="text_jiace"   placeholder="默认1个" value="1" size="10"/><button id="button_jiace" onclick="return false"><font color="red">加测</font></button>')		
				
				//点击批量添加反应按钮 显示或者隐藏DIV
				toolbar.find('#button_piliang').click(function(){
					显示隐藏DIV('#div_piliang',"button_piliang")
				})
				//给批量多条带文本框绑定回车键的函数
				toolbar.find('#text_piliang_duotiaodai').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
					//如果输入的字符不是数字 那么不允许输入
					if(event.keyCode !==48 && event.keyCode !==49 && event.keyCode !==50 && event.keyCode !==51 && event.keyCode !==52 && event.keyCode !==53 && event.keyCode !==54 && event.keyCode !==55 && event.keyCode !==56 && event.keyCode !==57 ){
						return false
					}
				});
				//给批量同名文本框绑定回车键的函数
				toolbar.find('#text_piliang_tongming').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
					//如果输入的字符不是数字 那么不允许输入
					if(event.keyCode !==48 && event.keyCode !==49 && event.keyCode !==50 && event.keyCode !==51 && event.keyCode !==52 && event.keyCode !==53 && event.keyCode !==54 && event.keyCode !==55 && event.keyCode !==56 && event.keyCode !==57 ){
						return false
					}
				});
				//给加测文本框绑定回车键的函数
				toolbar.find('#text_jiace').eq(0).keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
				
				//点击多条带批量添加按钮
				toolbar.find('#button_duotiaodai').click(function(){
					批量_添加多条带()
				})
				//点击批量添加同名反应按钮
				toolbar.find('#button_tongming').click(function(){
					批量_添加同名反应()
				})
				//点击加测 按钮
				toolbar.find('#button_jiace').click(function(){
					加测('jiace');
				})
			}
			//添加显示订单号按钮
			if (local_显示订单号=='true'){
				toolbar.append('<button id="button_show_order" onclick="return false">显示订单号</button>')
				//点击按钮
				toolbar.find('#button_show_order').click(function(){
					显示选择行所属的订单号()
				})
			}
			//添加 显示样品名称 按钮
			if (local_显示样品名称=='true'){
				toolbar.append('<button id="button_show_yp" onclick="return false">显示样品名称</button>')
				//点击按钮
				toolbar.find('#button_show_yp').click(function(){
					显示选择行的样品名称()
				})
			}
			//点击 打印样品标签 按钮
			if (local_打印样品标签 == 'true'){
				toolbar.append('<button id="button_print_ypbq" onclick="return false">打印样品标签</button>')
				//点击按钮
				toolbar.find('#button_print_ypbq').click(function(){
					打印样品标签()
				})
			}
			//添加 查询引物 按钮
			if (local_查询引物=='true'){
				toolbar.append('<div id="chaxun_yinwu"></div>')
				toolbar.find('#chaxun_yinwu').append('<input type="text" disabled  value="客户姓名" size="5"/><input type="text" class="text_value" id="text_kehu_value" placeholder="条件value" size="10"/>')
				toolbar.find('#chaxun_yinwu').append('<input type="text" disabled  value="测序引物" size="5"/><input type="text" class="text_value" id="text_yinwu_value" placeholder="空格区分" size="10"/>')
				toolbar.find('#chaxun_yinwu').append('<input type="text" disabled  value="课题组" size="5"/><input type="text" class="text_value" id="text_ketizu_value" placeholder="课题组" size="10"/>')
				toolbar.find('#chaxun_yinwu').append('<button id="button_qingkong" onclick="return false">清空value</button>')  //清空按钮 
				//客户姓名 回车  要求：客户姓名和测序引物必须有一项不为空
				toolbar.find('.text_value').keypress(function(event){
					if(event.keyCode ==13){
						//如果 客户 或者 引物 或者 课题组， 至少有一个是有数据，那么才能点击
						var kehu_val=toolbar.find('#text_kehu_value').val().trim()
						var yinwu_val=toolbar.find('#text_yinwu_value').val().trim()
						var ketizu_val=toolbar.find('#text_ketizu_value').val().trim()
						if( kehu_val !=="" || yinwu_val !==""  || ketizu_val !=="" ){
							//查询客户姓名+测序引物+课题组
							查询引物(kehu_val,yinwu_val,ketizu_val)
						}
						return false
					}
				});
				//点击 清空value按钮
				toolbar.find('#button_qingkong').click(function(){
					toolbar.find('.text_value').val('')
				})
			}
			//添加 其他 按钮
			if (local_其他=='true'){
				//在查询引物的后面加其他按钮
				toolbar.find('#chaxun_yinwu').append('<span style="position:relative;z-index:1;"><button id="button_qita" onclick="return false">其他◇</button><div id="div_qita" style="position:absolute;left:-150px;width:280px;height:50px;border:1px solid orange;background-color:	#1B211D;display:none"></div></span>')
				var div_qita=toolbar.find('#div_qita').eq(0)
				if(当前用户名==="申高天"){
					div_qita.css('height','160px')
					if (local_修改模板板号=='true'){
						div_qita.append('<input type="text" class="text_huichejian" id="text_add_mubanbanhao" placeholder="模板板号" size="10"/><button id="button_add_mubanbanhao" onclick="return false"><font color="blue">修改模板板号</font></button><br/>')
					}
				}
				div_qita.append('<input type="text"  class="text_huichejian" id="text_beizhu_gaiqian" placeholder="需要改的部分" size="10"/><input type="text"  class="text_huichejian" id="text_beizhu_gaihou" placeholder="改成的部分" size="10"/><button id="button_beizhu_genggai" onclick="return false">更改备注</button><br/>')
				div_qita.append('<button id="button_tiaozhuandao_zibeiyinwu" onclick="return false"><font color="blue">跳转到自备引物</font></button><br/><br/>')
				if(当前用户名==="申高天"){
					if (local_修改模板孔号=='true'){
						div_qita.append('<input type="text" class="text_huichejian" id="text_add_mubankonghao" placeholder="模板孔号" size="10"/><button id="button_add_mubankonghao" onclick="return false"><font color="blue">修改模板孔号</font></button><br/>')
					}
					div_qita.append('<button id="button_tiqushuju" onclick="return false"><font color="blue">提取数据</font></button>')
					div_qita.append('<button id="button_qingchushuju" onclick="return false"><font color="blue">清除数据</font></button><br/>')
					//添加 textarea 用于放数据
					$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_biaoti" style="position:absolute;left:400px;visibility:hidden" rows="1" cols="400"></textarea>')
					$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px;visibility:hidden" rows="2" cols="400"></textarea><br/>');
					//模板板号和孔号改为负一
					if (local_模板板号和孔号改为负一=='true'){
						div_qita.append('<button id="button_mubanbanhaokonghao_fuyi" onclick="return false"><font color="blue">模板板号和孔号改为负一</font></button><br/>')
					}
				}
				div_qita.append('<button id="button_jiaji" onclick="return false"><font color="blue">查找菌液加急</font></button><br/>')
				//点击 其他 按钮  显示或者隐藏DIV
				toolbar.find('#button_qita').click(function(){
					显示隐藏DIV('#div_qita',"button_qita")
				})
				//给文本框绑定回车键的函数
				toolbar.find('.text_huichejian').keypress(function(event){
					if(event.keyCode ==13){
						return false
					}
				});
				//点击  修改模板板号 按钮
				toolbar.find('#button_add_mubanbanhao').click(function(){
					修改模板板号()
				})
				//点击  修改模板孔号 按钮
				toolbar.find('#button_add_mubankonghao').click(function(){
					修改模板孔号()
				})
				//单击  更改备注 按钮
				toolbar.find('#button_beizhu_genggai').click(function(){
					更改备注()
				})
				//双击  清空备注
				toolbar.find('#button_beizhu_genggai').dblclick(function(){
					清空备注()
				})
				//点击  跳转到自备引物 按钮
				toolbar.find('#button_tiaozhuandao_zibeiyinwu').click(function(){
					跳转到自备引物()
				})
				//点击  提取数据 按钮
				toolbar.find('#button_tiqushuju').click(function(){
					提取数据()
				})
				//点击  清除数据 按钮
				toolbar.find('#button_qingchushuju').click(function(){
					清除数据()
				})
				//点击  模板板号和孔号改为负一 按钮
				toolbar.find('#button_mubanbanhaokonghao_fuyi').click(function(){
					模板板号和孔号改为负一()
				})
				//点击  查找菌液加急 按钮
				toolbar.find('#button_jiaji').click(function(){
					查找菌液加急()
				})
			}
			
			//添加 查询平板菌返还 按钮
			if (local_查询平板菌返还=='true'){
				toolbar.append('<button id="button_pingbanjunfanhuan" onclick="return false">查询平板菌返还</button>')
				//点击按钮
				toolbar.find('#button_pingbanjunfanhuan').click(function(){
					查询平板菌返还()
				})
			}
			
			
		}
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
	//添加前后缀
	function 添加前后缀(前后缀,id){
		加的前后缀=html.find(id).eq(0).val()
		//如果没写数据，那么退出
		if(加的前后缀===""){return false}
		//点击 批量编辑
		toolbar.find('#a_BatchEdit').eq(0).find('.l-btn-left').eq(0).click();
		$('#txt_seqs_sam_num').eq(0).val(加的前后缀)
		if (前后缀=='前缀'){
			//选择前缀单选按钮
			$('#txt_seqs_sam_num_foreedit').attr('checked','true')
		}
		if (前后缀=='后缀'){
			//选择后缀单选按钮
			$('#txt_seqs_sam_num_houedit').attr('checked','true')
		}
		$("#AB").click()
	}
	//更改部分样品名称
	function 更改部分(){
		改_前=html.find('#text_gaiqian').eq(0).val()
		改_后=html.find('#text_gaihou').eq(0).val()
		//如果没有选择的行，那么退出
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}  
		if(改_前===""){return false}
		//点击 批量编辑
		toolbar.find('#a_BatchEdit').eq(0).find('.l-btn-left').eq(0).click();
		$('#txt_seqs_sam_num').eq(0).val(改_前)  
		$('#txt_seqs_sam_num2').eq(0).val(改_后)
		//选择替换单选按钮
		$('#txt_seqs_sam_num_partedit').attr('checked','true')
		$("#AB").click()
	}
	
	//添加多条带
	function 批量_添加多条带(){
		var geshu=toolbar.find('#text_piliang_duotiaodai').eq(0).val()
		res=文本是否是1到20(geshu)
		if(!res){ //说明输入的不符合要求
			alert('输入的不符合要求，需要输入1到20')
			return false
		}
		geshu=parseInt(geshu)
		//判断是否选择了反应，且选择的是否是同一个订单号
		selecteds=is_one_order(html)
		if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
			return false
		}
		yp_all_array=[]  //生产编号
		ypmc_all_array=[] //样品名称
			new_ypmc_all_array=[] //新的样品名称
		yinwu_all_array=[] //引物名称
			new_yinwu_all_array=[] //新的引物名称
		yinwu_weizhi_array=[]  //引物位置
			new_yinwu_weizhi_array=[]  //新的引物位置
		yinwu_nong_all_array=[] //引物浓度
			new_yinwu_nong_all_array=[] //新的引物浓度
		yplx_all_array=[]  //样品类型
			new_yplx_all_array=[]  //新的样品类型
		zaiti_array=[]	//载体
			new_zaiti_array=[]	//新的载体
		pianduan_array=[]  //片段
			new_pianduan_array=[]  //新的片段
		kangshengsu_array=[]  //抗生素
			new_kangshengsu_array=[]  //新的抗生素
		beizhu_array=[]  //备注
			new_beizhu_array=[]  //新的备注
		is_cetong_array=[]  //是否测通
			new_is_cetong_array=[]   //新的是否测通
		
		//公共函数 生产编号需要降序排序
		是否排好序=生产编号需要降序排序(selecteds)
		if(是否排好序===false){//如果返回的是false 那么没有排好序
			return false
		}	
						
		//倒序把样品对应号放进数组
		tags=0
		$(selecteds.toArray().reverse()).each(function(){
			ypdyh_name=$(this).find('[aria-describedby=list_seqs_plus_prod_id]').html()
			if(ypdyh_name!=="" && ypdyh_name!=="&nbsp;"){
				tags=1
			}
		})
		if(tags===1){
			alert('有的反应带有"样品对应号"，不能添加多条带')
			return false
		}
		$(selecteds.toArray().reverse()).each(function(){
			//倒序把样品名称放进数组
			ypmc_all_array.push($(this).find('[aria-describedby=list_seqs_sam_num]').text())
			//倒序把引物名称放进数组
			yinwu_name=$(this).find('[aria-describedby=list_seqs_primer]').html()
			if(yinwu_name=="" || yinwu_name=="&nbsp;"){
				yinwu_all_array.push("")
			}else{yinwu_all_array.push(yinwu_name)}
			//倒序把引物位置放进数组
			yinwu_weizhi_array.push($(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').text())
			//倒序把引物浓度放进数组
			nongdu_name=$(this).find('[aria-describedby=list_seqs_observe]').html()
			if(nongdu_name=="" || nongdu_name=="&nbsp;"){  //如果载体为空 或者 空格
				yinwu_nong_all_array.push("")
			}else{yinwu_nong_all_array.push(nongdu_name)}
			//倒序把样品类型放进数组
			yplx_name=$(this).find('[aria-describedby=list_seqs_sam_type]').text()
			yplx_all_array.push(yplx_name)
			//倒序把载体放进数组
			zaiti_name=$(this).find('[aria-describedby=list_seqs_carry]').html()
			if(zaiti_name=="" || zaiti_name=="&nbsp;"){  //如果载体为空 或者 空格
				zaiti_array.push("")
			}else{zaiti_array.push(zaiti_name)}
			//倒序把片段放进数组
			pianduan_name=$(this).find('[aria-describedby=list_seqs_fragment_size]').html()
			if(pianduan_name=="" || pianduan_name=="&nbsp;"){  //如果片段为空 或者 空
				pianduan_array.push("")
			}else{pianduan_array.push(pianduan_name)}
			//倒序把抗生素放进数组
			kangshengsu_name=$(this).find('[aria-describedby=list_seqs_ant_type]').html()
			if(kangshengsu_name=="" || kangshengsu_name=="&nbsp;"){  //如果为空 或者 空格
				kangshengsu_array.push("")
			}else{kangshengsu_array.push(kangshengsu_name)}
			//倒序把备注放进数组
			beizhu_name=$(this).find('[aria-describedby=list_remark]').html()
			if(beizhu_name=="" || beizhu_name=="&nbsp;"){
				beizhu_array.push("")
			}else{beizhu_array.push(beizhu_name)}
			//倒序把是否测通放进数组
			cetong_is=$(this).find('[aria-describedby=list_seqs_istest_pass]').text()
			if(cetong_is=="是" || cetong_is=="true"){
				is_cetong_array.push(true)
			}else{is_cetong_array.push(false)}
		})
		//对多条带进行重新赋值
		quchong_ypm=quchong_arr(ypmc_all_array)
		for(var i=0;i<quchong_ypm.length;i++){  //去重后的数组
			for(var j=1;j<=geshu;j++){  // 多条带 这是为了方便样品的多条带加上后缀
				for(var z=0;z<ypmc_all_array.length;z++){  //原数组
					if(quchong_ypm[i]===ypmc_all_array[z]){
						new_ypmc_all_array.push(ypmc_all_array[z]+'-'+(j+1).toString()) //把样品名加上多条带的后缀push到新的样品数组里面
						new_yinwu_all_array.push(yinwu_all_array[z])  //push到新的引物数组里面
						new_yinwu_weizhi_array.push(yinwu_weizhi_array[z]) //push到新的引物位置数组里面
						new_yinwu_nong_all_array.push(yinwu_nong_all_array[z]) //push到新的引物浓度数组里面
						new_yplx_all_array.push(yplx_all_array[z]) //push到新的样品类型数组里面
						new_zaiti_array.push(zaiti_array[z])//push到新的载体数组里面
						new_pianduan_array.push(pianduan_array[z])//push到新的片段数组里面
						new_kangshengsu_array.push(kangshengsu_array[z]) //push到新的抗生素数组里面
						new_beizhu_array.push(beizhu_array[z])  //push到新的备注数组里面
						new_is_cetong_array.push(is_cetong_array[z]) //push到新的是否测通数组里面
					}
				}
			}
		}
		order_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
		kehu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_id]').eq(0).text()  //查找客户ID
		kehu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_name]').eq(0).text()  //查找客户姓名
		ketizu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu_id]').eq(0).text()  //查找课题组ID
		ketizu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu]').eq(0).text()  //查找课题组姓名
		
		company_ID=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_id]').eq(0).text()  // 公司ID 比如昌平的是38
		company_name=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_name]').eq(0).text()  // 生产分公司名字 比如北京分公司
		
		var r = confirm("确定要给"+kehu_name+"添加"+(geshu+1).toString()+"条带吗?总共 "+(selecteds.size()*geshu).toString()+" 条反应");
		if (r == false) {
			return false;
		} else{
			html.find('#button_duotiaodai').eq(0).attr('disabled',true)
		}
		josn_str=''
		$.each(new_ypmc_all_array,function(index){  //对数组 多条反应，需要结合成josn_str  index是从0开始的
			weizhi_split_array=new_yinwu_weizhi_array[index].split("-")  //位置用split分隔，如果不能分隔，那么长度为1，如果能分隔，那么长度为2
			if(weizhi_split_array.length==1){
				yinwu_weizhi_kind="";
				yinwu_weizhi_primerid=""
			}else{
				yinwu_weizhi_kind=weizhi_split_array[1]
				yinwu_weizhi_primerid=weizhi_split_array[0]
			}
			josn_str=josn_str+'{"seqs_vip_platestyle":"纵向提交","seqs_vip_platename":"1","seqs_vip_plate":1,"seqs_vip_hole":'+(index+1)+',"seqs_vip_number":'+(index+1)+',"seqs_vip_sam_num":"'+new_ypmc_all_array[index]+'","seqs_vip_sam_kind":"'+new_yplx_all_array[index]+'","seqs_vip_fragment_size":"","seqs_vip_seqs_carry":"'+new_zaiti_array[index]+'","seqs_vip_ant_type":"'+new_kangshengsu_array[index]+'","seqs_vip_seqs_primer":"'+new_yinwu_all_array[index]+'","seqs_vip_seqsprime_kind":"'+yinwu_weizhi_kind+'","seqs_vip_seqs_primer_id":"'+yinwu_weizhi_primerid+'","seqs_vip_istest_pass":'+new_is_cetong_array[index]+',"seqs_vip_return_sample":false,"seqs_vip_sample_remark":"'+new_beizhu_array[index]+'"},'
			if(new_ypmc_all_array.length==index+1){  //如果是最后一项，那么把最后的逗号去掉
				josn_str=josn_str.slice(0,-1);
			}
		})
		josn_str='['+josn_str+'],'+'"orderid":"'+order_ID+'","companyid":"'+company_ID+'"}'
		josn_str='{"action":"AddSeqOrder","seqHighPhoto":"","seqscreenshot":[],"cust_id":'+kehu_ID+',"cust_name":"'+kehu_name+'","ketizu_id":"'+ketizu_ID+'","ketizu_name":"'+ketizu_name+'","ordersort":"","linkToGeneNo":"","seqo_product_company_id":"'+company_ID+'","seqo_product_company_name":"'+company_name+'","seqo_settlement_company_id":"","seqo_settlement_company_name":"","order":{"vip_order_name":"","vip_order_kind":"PCR切胶","vip_order_platestyle":"2","vip_order_remark":"","vip_order_state":0,"vip_order_ketizuid":"'+ketizu_ID+'","vip_order_ketizuname":"'+ketizu_name+'","vip_order_isurgent":"false"},"seqo_id":"'+order_ID+'","seqs":'+josn_str
		$.ajax({
				type:"POST",
				url:"/ajax/PostErpUseVipPageHandler.ashx",
				contentType: "application/json", //必须这样写
				dataType:"json",
				data: JSON.stringify(jQuery.parseJSON(josn_str)),   //josn_str是你要提交是json字符串
				success:function (data) {
					html.find('.ui-pg-input').eq(0).focus()
					alert('修改成功 ，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
					html.find('#button_duotiaodai').eq(0).attr('disabled',false)
				}
		})
	}
	
	//批量添加同名反应
	function 批量_添加同名反应(){
		var geshu=toolbar.find('#text_piliang_tongming').eq(0).val()
		res=文本是否是1到20(geshu)
		if(!res){ //说明输入的不符合要求
			alert('输入的不符合要求，需要输入1到20')
			return false
		}
		geshu=parseInt(geshu)
		//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
		selecteds=is_one_order(html)
		if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
			return false
		}
		yp_all_array=[]  //生产编号
		ypdyh_all_array=[]  //样品对应号
			new_ypdyh_all_array=[]  //新的样品对应号
		ypmc_all_array=[] //样品名称
			new_ypmc_all_array=[] //新的样品名称
		yplx_all_array=[]  //样品类型
			new_yplx_all_array=[]  //新的样品类型
		zaiti_array=[]	//载体
			new_zaiti_array=[]	//新的载体
		pianduan_array=[]  //片段
			new_pianduan_array=[]  //新的片段
		kangshengsu_array=[]  //抗生素
			new_kangshengsu_array=[]  //新的抗生素
		beizhu_array=[]  //备注
			new_beizhu_array=[]  //新的备注
		is_cetong_array=[]  //是否测通
			new_is_cetong_array=[]   //新的是否测通
			
		//公共函数 生产编号需要降序排序
		是否排好序=生产编号需要降序排序(selecteds)
		if(是否排好序===false){//如果返回的是false 那么没有排好序
			return false
		}
		
		$(selecteds.toArray().reverse()).each(function(){
			//倒序把样品名称放进数组
			ypmc_all_array.push($(this).find('[aria-describedby=list_seqs_sam_num]').text())
			//倒序把样品对应号放进数组
			ypdyh_name=$(this).find('[aria-describedby=list_seqs_plus_prod_id]').html()
			if(ypdyh_name=="" || ypdyh_name=="&nbsp;"){
				ypdyh_all_array.push("")
			}else{ypdyh_all_array.push(ypdyh_name)}
			//倒序把样品类型放进数组
			yplx_name=$(this).find('[aria-describedby=list_seqs_sam_type]').text()
			yplx_all_array.push(yplx_name)
			//倒序把载体放进数组
			zaiti_name=$(this).find('[aria-describedby=list_seqs_carry]').html()
			if(zaiti_name=="" || zaiti_name=="&nbsp;"){  //如果载体为空 或者 空格
				zaiti_array.push("")
			}else{zaiti_array.push(zaiti_name)}
			//倒序把片段放进数组
			pianduan_name=$(this).find('[aria-describedby=list_seqs_fragment_size]').html()
			if(pianduan_name=="" || pianduan_name=="&nbsp;"){  //如果片段为空 或者 空
				pianduan_array.push("")
			}else{pianduan_array.push(pianduan_name)}
			//倒序把抗生素放进数组
			kangshengsu_name=$(this).find('[aria-describedby=list_seqs_ant_type]').html()
			if(kangshengsu_name=="" || kangshengsu_name=="&nbsp;"){  //如果为空 或者 空格
				kangshengsu_array.push("")
			}else{kangshengsu_array.push(kangshengsu_name)}
			//倒序把备注放进数组
			beizhu_name=$(this).find('[aria-describedby=list_remark]').html()
			if(beizhu_name=="" || beizhu_name=="&nbsp;"){
				beizhu_array.push("")
			}else{beizhu_array.push(beizhu_name)}
			//倒序把是否测通放进数组
			cetong_is=$(this).find('[aria-describedby=list_seqs_istest_pass]').text()
			if(cetong_is=="是" || cetong_is=="true"){
				is_cetong_array.push(true)
			}else{is_cetong_array.push(false)}
		})
		//对同名数组进行重新赋值
		quchong_ypm=quchong_arr(ypmc_all_array)
		//如果去重后的长度和原先的长度不一致，代表有重复的
		if(ypmc_all_array.length!==quchong_ypm.length){
			alert('不要选择重复的样品名，一个样品名只允许选择一次')
			return false
		}
		for(var i=0;i<ypmc_all_array.length;i++){  //去重后的数组
			for(var j=1;j<=geshu;j++){  // 多条带 这是为了方便样品的多条带加上后缀
				new_ypmc_all_array.push(ypmc_all_array[i]) //把样品名push到新的样品数组里面
				new_ypdyh_all_array.push(ypdyh_all_array[i])//把样品对应号push到新的样品数组里面
				new_yplx_all_array.push(yplx_all_array[i]) //push到新的样品类型数组里面
				new_zaiti_array.push(zaiti_array[i])//push到新的载体数组里面
				new_pianduan_array.push(pianduan_array[i])//push到新的片段数组里面
				new_kangshengsu_array.push(kangshengsu_array[i]) //push到新的抗生素数组里面
				new_beizhu_array.push(beizhu_array[i])  //push到新的备注数组里面
				new_is_cetong_array.push(is_cetong_array[i]) //push到新的是否测通数组里面
			}
		}
		
		order_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
		kehu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_id]').eq(0).text()  //查找客户ID
		kehu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_name]').eq(0).text()  //查找客户姓名
		ketizu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu_id]').eq(0).text()  //查找课题组ID
		ketizu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu]').eq(0).text()  //查找课题组姓名
		
		company_ID=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_id]').eq(0).text()  // 公司ID 比如昌平的是38
		company_name=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_name]').eq(0).text()  // 生产分公司名字 比如北京分公司
		
		var r = confirm("确定要给"+kehu_name+"添加"+(selecteds.size()*geshu).toString()+"条同名反应吗?");
		if (r == false) {
			return false;
		} else{
			html.find('#button_tongming').eq(0).attr('disabled',true)
		}
		josn_str=''
		$.each(new_ypmc_all_array,function(index){  //对数组 多条反应，需要结合成josn_str  index是从0开始的
			josn_str=josn_str+'{"seqs_vip_platestyle":"纵向提交","seqs_vip_platename":"1","seqs_vip_plate":1,"seqs_vip_hole":'+(index+1)+',"seqs_vip_number":'+(index+1)+',"seqs_vip_sam_num":"'+new_ypmc_all_array[index]+'","seqs_vip_sam_kind":"'+new_yplx_all_array[index]+'","seqs_vip_fragment_size":"'+new_pianduan_array[index]+'","seqs_vip_seqs_carry":"'+new_zaiti_array[index]+'","seqs_vip_ant_type":"'+new_kangshengsu_array[index]+'","seqs_vip_seqs_primer":"","seqs_vip_seqsprime_kind":"","seqs_vip_seqs_primer_id":"","seqs_vip_istest_pass":'+new_is_cetong_array[index]+',"seqs_vip_return_sample":false,"seqs_vip_sample_remark":"'+new_beizhu_array[index]+'","seqs_plus_prod_id":"'+new_ypdyh_all_array[index]+'"},'
			if(new_ypmc_all_array.length==index+1){  //如果是最后一项，那么把最后的逗号去掉
				josn_str=josn_str.slice(0,-1);
			}
		})
		josn_str='['+josn_str+'],'+'"orderid":"'+order_ID+'","companyid":"'+company_ID+'"}'
		josn_str='{"action":"AddSeqOrder","seqHighPhoto":"","seqscreenshot":[],"cust_id":'+kehu_ID+',"cust_name":"'+kehu_name+'","ketizu_id":"'+ketizu_ID+'","ketizu_name":"'+ketizu_name+'","ordersort":"","linkToGeneNo":"","seqo_product_company_id":"'+company_ID+'","seqo_product_company_name":"'+company_name+'","seqo_settlement_company_id":"","seqo_settlement_company_name":"","order":{"vip_order_name":"","vip_order_kind":"PCR切胶","vip_order_platestyle":"2","vip_order_remark":"","vip_order_state":0,"vip_order_ketizuid":"'+ketizu_ID+'","vip_order_ketizuname":"'+ketizu_name+'","vip_order_isurgent":"false"},"seqo_id":"'+order_ID+'","seqs":'+josn_str
		
		$.ajax({
			type:"POST",
			url:"/ajax/PostErpUseVipPageHandler.ashx",
			contentType: "application/json", //必须这样写
			dataType:"json",
			data: JSON.stringify(jQuery.parseJSON(josn_str)),   //josn_str是你要提交是json字符串
			success:function (data) {
				html.find('.ui-pg-input').eq(0).focus()
				alert('修改成功 ，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
				html.find('#button_tongming').eq(0).attr('disabled',false)
			}
		})
	}
	
	//加测
	function 加测(){
		//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
		selecteds=is_one_order(html)
		if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
			return false
		}
		//公共函数 生产编号需要降序排序
		是否排好序=生产编号需要降序排序(selecteds)
		if(是否排好序===false){//如果返回的是false 那么没有排好序
			return false
		}
		//获取选择的行的所有数据
		数据_arr=获取选择的行的所有数据(selecteds)
		scbh_arr=数据_arr[0]   //生产编号
		ypdyh_arr=数据_arr[1]  //样品对应号
		ypmc_arr=数据_arr[2] //样品名称
		yplx_arr=数据_arr[6]  //样品类型
		zaiti_arr=数据_arr[7]	//载体
		pianduan_arr=数据_arr[8]  //片段
		kangshengsu_arr=数据_arr[9]  //抗生素
		beizhu_arr=数据_arr[10]  //备注
		is_cetong_arr=数据_arr[11]  //是否测通
		
		
		for (var i=0;i<scbh_arr.length;i++){
			//对样品对应号进行循环  如果样品对应号为空 那么把样品对应号改成生产编号
			当前样品对应号=ypdyh_arr[i]
			当前样品对应号=当前样品对应号.trim()
			if (当前样品对应号==''){
				ypdyh_arr[i]=scbh_arr[i]
			}else if (当前样品对应号.indexOf('YP')==-1){
				alert('选择的行中，样品对应号有的不对')
				return false
			}
			
			//对样品类型进行循环 转换成质粒或者PCR已纯化
			当前样品类型=yplx_arr[i]
			if(当前样品类型=="质粒" || 当前样品类型.search("菌")!= -1){
				yplx_arr[i]="质粒"
			}else if( 当前样品类型.search("胶")!= -1  || 当前样品类型.toUpperCase()=="PCR已纯化" || 当前样品类型.toUpperCase()=="PCR单一"){
				yplx_arr[i]="PCR已纯化"
			}else{yplx_arr[i]="质粒"}
			
			//对是否测通进行循环 放入true或false
			当前是否测通=is_cetong_arr[i]
			if(当前是否测通=="是"){
				is_cetong_arr[i]=true
			}else{is_cetong_arr[i]=false}
		}
		
		order_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
		kehu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_id]').eq(0).text()  //查找客户ID
		kehu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_name]').eq(0).text()  //查找客户姓名
		ketizu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu_id]').eq(0).text()  //查找课题组ID
		ketizu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu]').eq(0).text()  //查找课题组姓名
		
		company_ID=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_id]').eq(0).text()  // 公司ID 比如昌平的是38
		company_name=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_name]').eq(0).text()  // 生产分公司名字 比如北京分公司
		
		riqi=getday_y_n('---')
		jihang=toolbar.find("#text_jiace").eq(0).val()  //确定加测几行，
		if(jihang.trim()==""){jihang="1"}
		jihang=parseInt(jihang)
		if(!jihang){jihang="1"}
		josn_str=''
		var r = confirm("确定要给"+kehu_name+"加测吗?总共  "+jihang*selecteds.size()+"  条加测反应");
		if (r == false) {
			return false;
		} else{
			html.find('#button_jiace').eq(0).attr('disabled',true)
		}
		$(selecteds.toArray().reverse()).each(function(index){  //多条反应，需要结合成josn_str  index是从0开始的
			qian='{"seqs_vip_platestyle":"纵向提交","seqs_vip_platename":"1","seqs_vip_plate":1,"seqs_vip_hole":'
			zhong=index*jihang+1
			hou=',"seqs_vip_number":'+(index+1)+',"seqs_vip_sam_num":"'+ypmc_arr[index]+'","seqs_vip_sam_kind":"'+yplx_arr[index]+'","seqs_vip_fragment_size":"'+pianduan_arr[index]+'","seqs_vip_seqs_carry":"'+zaiti_arr[index]+'","seqs_vip_ant_type":"'+kangshengsu_arr[index]+'","seqs_vip_seqs_primer":"","seqs_vip_seqsprime_kind":"","seqs_vip_seqs_primer_id":"","seqs_vip_spec_require":"","seqs_vip_istest_pass":'+is_cetong_arr[index]+',"seqs_vip_return_sample":false,"seqs_vip_sample_remark":"'+beizhu_arr[index]+'","seqs_plus_prod_id":"'+ypdyh_arr[index]+'"},'
			josn_str=josn_str+qian+zhong+hou
			for(var i=2;i<=jihang;i++){
				zhong=index*jihang+i
				josn_str=josn_str+qian+zhong+hou
			}
			if(selecteds.size()==index+1){  //如果是最后一项，那么把最后的逗号去掉
				josn_str=josn_str.slice(0,-1);
			}
		})
		josn_str='['+josn_str+'],'+'"orderid":null,"companyid":null}'
		josn_str='{"action":"AddSeqOrder","seqHighPhoto":"","seqscreenshot":[],"cust_id":'+kehu_ID+',"cust_name":"'+kehu_name+'","ketizu_id":"'+ketizu_ID+'","ketizu_name":"'+ketizu_name+'","ordersort":"","linkToGeneNo":"","seqo_product_company_id":"'+company_ID+'","seqo_product_company_name":"'+company_name+'","seqo_settlement_company_id":"","seqo_settlement_company_name":"","order":{"vip_order_name":"'+riqi+'","vip_order_kind":"PCR切胶","vip_order_platestyle":"2","vip_order_remark":"","vip_order_state":0,"vip_order_ketizuid":"'+ketizu_ID+'","vip_order_ketizuname":"'+ketizu_name+'","vip_order_isurgent":"false"},"seqo_id":null,"seqs":'+josn_str
		$.ajax({
				type:"POST",
				url:"/ajax/PostErpUseVipPageHandler.ashx",
				contentType: "application/json", //必须这样写
				dataType:"json",
				data: JSON.stringify(jQuery.parseJSON(josn_str)),   //josn_str是你要提交是json字符串
				success:function (data) {
				html.find('.ui-pg-input').eq(0).focus()
				alert('修改成功 ，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
				html.find('#button_jiace').eq(0).attr('disabled',false)
				}
		})
	}
	
	
	
	//显示选择行所属的订单号
	function 显示选择行所属的订单号(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
		var dingdanhao=table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_order_id]').text()  //查询订单号
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqo_order_id']").attr('selected','selected')  //把找到的第一个查询条件改成 订单号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(dingdanhao)
		$("#AB").click()
	}
	
	//显示选择行的样品名称 查询这个样品在这个客户名下所有的记录
	function 显示选择行的样品名称(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		kehu_id=table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_cust_id]').text()  //查询客户id
		yp_name=table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqs_sam_num]').text()  //查询样品名称
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqo_cust_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户ID
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(kehu_id)
		$('#searchForm').eq(0).find("option[value='seqs_sam_num']").eq(1).attr('selected','selected')  //把找到的第二个查询条件改成 样品编号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(yp_name)
		$("#AB").click()
	}
	
	//查询客户姓名+测序引物+课题组
	function 查询引物(kehu_val,yinwu_val,ketizu_val){
		for(var i=1;i<=5;i++){
			yinwu_val=yinwu_val.replace(/  /g," ");//两个空格替换成一个空格 多运行几遍
		}
		yinwu_arr=yinwu_val.split(" "); //把测序引物 按照 空管split成数组
		console.log(yinwu_arr)
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='seqo_cust_name']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户姓名
		$('#searchForm').eq(0).find("option[value='seqo_ketizu']").eq(1).attr('selected','selected')  //把找到的第二个查询条件改成 课题组
		if (yinwu_arr.length>0){
			for(var i=2;i<=yinwu_arr.length+1;i++){
				$('#searchForm').eq(0).find("option[value='seqs_primer']").eq(i).attr('selected','selected')  //测序引物
			}
		}
		//查询方式前14个变成包含
		$('.searchOper:lt(14)').find("option[value='cn']").attr('selected','selected')  //测序引物
		//放入信息
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(kehu_val)
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(ketizu_val)
		for(var i=2;i<=yinwu_arr.length+1;i++){
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(i).val(yinwu_arr[i-2])
		}
		$("#AB").click()
	}
	
	//修改模板板号
	function 修改模板板号(){
		公共_修改模板板号或孔号("模板板号")
	}
	
	//修改模板孔号
	function 修改模板孔号(){
		公共_修改模板板号或孔号("模板孔号")
	}
	//公共函数 修改模板板号和孔号
	function 公共_修改模板板号或孔号(板号或者孔号){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		selecteds=table.find('tbody').find("[aria-selected='true']")
		var r = confirm("确定要给这 "+selecteds.size()+" 条添加"+板号或者孔号+"吗？");
		if (r == false) {
			return false;
		} 
		if (板号或者孔号=="模板板号"){
			wenben=toolbar.find('#text_add_mubanbanhao').val()
		}else{
			wenben=toolbar.find('#text_add_mubankonghao').val()
		}
		
		selecteds.each(function(){
			$(this).click()
			if($(this).attr("aria-selected")=="false"){
				$(this).click()
			}
			if($(this).attr("aria-selected")=="true"){
				toolbar.find("[class='l-btn-text icon-edit']").eq(0).click();
				if (板号或者孔号=="模板板号"){
					$('#txt_seqs_tempplate').eq(0).val(wenben)
				}else{
					$('#txt_seqs_tempspace').eq(0).val(wenben)
				}
				
				$("#AB").click()
			}
		})
	}
	//更改备注
	function 更改备注(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		beizhu_xiugaiqian=toolbar.find('#text_beizhu_gaiqian').eq(0).val()
		beizhu_xiugaihou=toolbar.find('#text_beizhu_gaihou').eq(0).val()
		if(beizhu_xiugaiqian===""){return false}
		selecteds=table.find('tbody').find("[aria-selected='true']")
		var r = confirm("确定要给这 "+selecteds.size()+" 条修改备注吗？");
		if (r == false) {
			return false;
		}
		var is_goon=true
		selecteds.each(function(){
			beizhu=$(this).find('[aria-describedby=list_remark]').text()  //获取备注
			num=beizhu.split(beizhu_xiugaiqian).length-1  //存在多少遍要更改的部分,只有1遍才可以
			if (num!=1){is_goon=false;  alert('只有每个样品备注都能匹配且只匹配一次,才能修改');return false}
		})
		if (is_goon==true){
			selecteds.each(function(){
				$(this).click()
				if($(this).attr("aria-selected")=="false"){
					$(this).click()
				}
				if($(this).attr("aria-selected")=="true"){
					beizhu=$(this).find('[aria-describedby=list_remark]').text()  //获取备注
					beizhu=beizhu.replace(beizhu_xiugaiqian,beizhu_xiugaihou) //替换好的备注
					toolbar.find("[class='l-btn-text icon-edit']").eq(0).click();
					$('#txt_manage_seqsample_remark').eq(0).val(beizhu)
					$("#AB").click()
				}
			})
			setTimeout("alert('已改完，检查一下')", 1000 )
		}
	}
	
	//清空备注
	function 清空备注(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		selecteds=table.find('tbody').find("[aria-selected='true']")
		var r = confirm("确定要清空这 "+selecteds.size()+" 条的备注吗？");
		if (r == false) {
			return false;
		}
		selecteds.each(function(){
			$(this).click()
			if($(this).attr("aria-selected")=="false"){
				$(this).click()
			}
			if($(this).attr("aria-selected")=="true"){
				toolbar.find("[class='l-btn-text icon-edit']").eq(0).click();
				$('#txt_manage_seqsample_remark').eq(0).val('')
				$("#AB").click()
			}
		})
		setTimeout("alert('已改完，检查一下')", 1000 )
	}
	
	//跳转到自备引物
	function 跳转到自备引物(){
		if(html.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		//如果 自备引物 页面没有打开 则自动打开
		if($('#tabs').find('li:contains(自备引物)').size()===0){
			//自动打开 自备引物页面
			$('#lnav').find('li:contains(自备引物)').click()
			var html_自备引物=$('iframe[src="/viporder/SeqCustPrimerList.aspx"]').get(0)//自备引物页面
			html_自备引物.onload=function(){
			公共_查引物()	
			自备引物()
			}
		}else if($('#tabs').find('li:contains(自备引物)').size()===1){
			公共_查引物()
		}
		function 公共_查引物(){
			selecteds=html.find('tbody').find("[aria-selected='true']")
			var ids_shuzu = new Array();
			for (var i=0;i<selecteds.size();i++){
				id=selecteds.eq(i).find('[aria-describedby=list_seqs_primer_id_2_kind]').text()  //获取引物位置
				//如果没找到 -Z则进行下次循环
				if(id.indexOf('-Z')==-1){continue}
				id=id.slice(0,-2)//把最后两个字符去掉，最后的引物位置
				ids_shuzu[i]=id
			}
			//数组去重
			ids_shuzu=quchong_arr(ids_shuzu)
			//在 自备引物界面 查询
			//自备引物的html必须加个后缀或者前缀 不能和之前的重复
			var zibeiyinwu_html=$('iframe[src="/viporder/SeqCustPrimerList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了自备引物的页面
			toolbar_zibeiyinwu=zibeiyinwu_html.find('.toolbar').eq(0)  // 找到了自备引物的toolbar工具栏
			toolbar_zibeiyinwu.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			//$('#searchForm').eq(0).find("option[value='seqs_primer_id_2_kind']").attr('selected','selected')  //把找到的查询条件改成 引物位置
			$('#radd').next().attr('checked','true')  //选择 OR 选项
			for (var i=0;i<ids_shuzu.length;i++){
				$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(i).val(ids_shuzu[i])
			}
			if($("#AB").length==1){
				setTimeout("$('#AB').click()", 200)
			}
			$('#tabs').find('li:contains(自备引物)').click()
		}
		
	}
	
	//提取数据
	function 提取数据(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		biaoti='生产编号&订单号&客户ID&客户姓名&客户地址&课题组&课题组ID&样品对应号&样品编号&引物位置&测序引物&引物浓度&样品类型&载体&抗生素&片段大小&是否测通&原浓度&模板板号&模板孔号&备注&添加时间&生产分公司'
		var shuju=""
		table.find('tbody').find("[aria-selected='true']").each(function(){
			shengchanbianhao=$(this).find('[aria-describedby=list_undefined]').text() //生产编号
			dingdanhao=$(this).find('[aria-describedby=list_seqo_order_id]').text() 	//订单号
			kehu_id=$(this).find('[aria-describedby=list_seqo_cust_id]').text()  //客户ID
			kehu_xingming=$(this).find('[aria-describedby=list_seqo_cust_name]').text()  //客户姓名
			kehu_dizhi=$(this).find('[aria-describedby=list_seqo_cust_address]').text()  //客户地址
			ketizu=$(this).find('[aria-describedby=list_seqo_ketizu]').text() //课题组
			ketizu_id=$(this).find('[aria-describedby=list_seqo_ketizu_id]').text()  //课题组ID
			yangpinduiyinghao=$(this).find('[aria-describedby=list_seqs_plus_prod_id]').text()  //样品对应号
			yangpinbianhao=$(this).find('[aria-describedby=list_seqs_sam_num]').text() //样品编号
			yinwuweizhi=$(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').text() //引物位置
			cexuyinwu=$(this).find('[aria-describedby=list_seqs_primer]').text() //测序引物
			yinwunongdu=$(this).find('[aria-describedby=list_seqs_observe]').text() // 引物浓度
			yangpinleixing=$(this).find('[aria-describedby=list_seqs_sam_type]').text() //样品类型
			zaiti=$(this).find('[aria-describedby=list_seqs_carry]').text() // 载体
			kangshengsu=$(this).find('[aria-describedby=list_seqs_ant_type]').text() //抗生素
			pianduandaxiao=$(this).find('[aria-describedby=list_seqs_fragment_size]').text() //片段大小
			shifoucetong=$(this).find('[aria-describedby=list_seqs_istest_pass]').text() //是否测通
			yuannongdu=$(this).find('[aria-describedby=list_seqs_original_con]').text() //原浓度
			mubanbanhao=$(this).find('[aria-describedby=list_seqs_tempplate]').text() // 模板板号
			mubankonghao=$(this).find('[aria-describedby=list_seqs_tempspace]').text() //模板孔号
			beizhu=$(this).find('[aria-describedby=list_remark]').text() //备注
			tianjiashijian=$(this).find('[aria-describedby=list_seqs_add_time]').text() //添加时间
			shengchangongsi=$(this).find('[aria-describedby=list_seqs_product_company_name]').text() //生产分公司
			shuju=shuju+shengchanbianhao+"&"+dingdanhao+"&"+kehu_id+"&"+kehu_xingming+"&"+kehu_dizhi+"&"+ketizu+"&"+ketizu_id+"&"+yangpinduiyinghao+"&"+yangpinbianhao+"&"+yinwuweizhi+"&"+cexuyinwu+"&"+yinwunongdu+"&"+yangpinleixing+"&"+zaiti+"&"+kangshengsu+"&"+pianduandaxiao+"&"+shifoucetong+"&"+yuannongdu+"&"+mubanbanhao+"&"+mubankonghao+"&"+beizhu+"&"+tianjiashijian+"&"+shengchangongsi+"\n"
		})
		if($('#textarea_shuju').length===0){
			//$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_biaoti" style="position:absolute;left:400px;" rows="1" cols="400"></textarea>')
			//$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
		}
		$('#textarea_shuju').css('visibility','visible')
		$('#textarea_biaoti').css('visibility','visible')
		$("#textarea_biaoti").val(biaoti)
		$("#textarea_shuju").val($("#textarea_shuju").val()+shuju)
	}
	
	//清除数据
	function 清除数据(){
		$("#textarea_biaoti").val('')
		$('#textarea_shuju').val('')
		$('#textarea_biaoti').css('visibility','hidden')
		$('#textarea_shuju').css('visibility','hidden')
	}
	
	// 查询平板菌返还
	function 查询平板菌返还(){
		//如果没有选择的行，那么退出
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}  
		selected=table.find('tbody').find("[aria-selected='true']").eq(0)
		//获取样品名的前面部分   用-分割
		样品名=selected.find("[aria-describedby='list_seqs_sam_num']").text()
		客户姓名=selected.find("[aria-describedby='list_seqo_cust_name']").text()
		最后一个横杠的位置=样品名.lastIndexOf('-')
		if (最后一个横杠的位置==-1){
			alert('样品名里没有 -')
			return false
		}
		样品名=样品名.slice(0,最后一个横杠的位置)
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqs_sam_num']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 样品编号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(样品名)
		//查询方式前1个变成包含
		$('.searchOper:lt(1)').find("option[value='cn']").attr('selected','selected') 
		$('#searchForm').eq(0).find("option[value='seqo_cust_name']").eq(1).attr('selected','selected')  //把找到的第二个查询条件改成 客户姓名
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(客户姓名)
		$("#AB").click()
	}
	
	//模板板号和孔号改为负一
	function 模板板号和孔号改为负一(){
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		selecteds=table.find('tbody').find("[aria-selected='true']")
		var r = confirm("确定要给把 "+selecteds.size()+" 条反应的模板板号和孔号都改成-1吗？");
		if (r == false) {
			return false;
		} 
		selecteds.each(function(){
			$(this).click()
			if($(this).attr("aria-selected")=="false"){
				$(this).click()
			}
			if($(this).attr("aria-selected")=="true"){
				toolbar.find("[class='l-btn-text icon-edit']").eq(0).click();
				$('#txt_seqs_tempplate').eq(0).val('-1')
				$('#txt_seqs_tempspace').eq(0).val('-1')
				$("#AB").click()
			}
		})
		
	}
	//查找菌液加急
	function 查找菌液加急(){
		//查询 样品类型包含菌，样品类型不等于直提菌，样品类型不等于沉菌，备注包含加急
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').find("option[value='seqs_sam_type']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 样品类型
		$('#searchForm').find("option[value='cn']").eq(0).attr('selected','selected')  //把找到的第一个查询方式改成 包含
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('菌')
		
		$('#searchForm').find("option[value='seqs_sam_type']").eq(1).attr('selected','selected')  //把找到的第二个查询条件改成 样品类型
		$('#searchForm').find("option[value='ne']").eq(1).attr('selected','selected')  //把找到的第二个查询方式改成 不等于
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val('直提菌')
		
		$('#searchForm').find("option[value='seqs_sam_type']").eq(2).attr('selected','selected')  //把找到的第三个查询条件改成 样品类型
		$('#searchForm').find("option[value='ne']").eq(2).attr('selected','selected')  //把找到的第三个查询方式改成 不等于
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(2).val('沉菌')
		
		$('#searchForm').find("option[value='remark']").eq(3).attr('selected','selected')  //把找到的第四个查询条件改成 备注
		$('#searchForm').find("option[value='cn']").eq(3).attr('selected','selected')  //把找到的第四个查询方式改成 包含
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(3).val('急')
		
		$("#AB").click()
	}
	//选中一些行后，把相同引物位置的其余引物标记颜色
	function 相同引物位置标记颜色(){
		//把选中的所有行的行数显示在右下角
		old_text=html.find('#pager_right').eq(0).find('div').eq(0).text()
		num_s=table.find('tbody').find("[aria-selected='true']").size()
		html.find('#pager_right').eq(0).find('div').eq(0).find('#reve').remove()
		html.find('#pager_right').eq(0).find('div').eq(0).prepend("<span id='reve'>总共选中了 "+num_s+"  行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>")
		//改颜色
		var yinwu_weizhi=[]
		//对被选中的行进行 查找引物位置并赋值到yinwu_weizhi数组里面
		table.find('tbody').find("[aria-selected='true']").each(function(){
			yinwu_weizhi.push($(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').eq(0).text())
		})
		//获取的引物位置需要和当前页面所有的tr里面的引物位置进行比较
		table.find('[aria-describedby=list_seqs_primer_id_2_kind]').attr('Bgcolor','')  //先把所有的行的颜色去掉
		if(yinwu_weizhi.length>0){
			table.find('tr').each(function(){
				every_weizhi=$(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').eq(0).text()
				for(var i=0;i<yinwu_weizhi.length;i++){
					if(yinwu_weizhi[i]==every_weizhi){
						$(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').eq(0).attr('Bgcolor','#ceEEe7')
						return; 
					}
				}
			})
		}
	}
	
	//把 测序样品 的 流程名称 是反应生产，模板失败，停止反应  标颜色
	function 状态_标颜色_录入组(){
		table.find('[aria-describedby=list_seqs_process]').each(function(){
			if($(this).text()=="反应生产" ||  $(this).text()=="模板失败" ||  $(this).text()=="停止反应" ||  $(this).text()=="模板成功" || $(this).text()=="样品不足" || $(this).text()=="引物已清"){
				$(this).attr('Bgcolor','#AeEEe7')
				$(this).parent().find('[aria-describedby=list_seqs_primer]').eq(0).attr('title','更改此引物需要跟反应组说!!!')
			}
		})
		
		//当table出现数据改变的时候
		$(html).find('#list').on('DOMNodeInserted',function(e) {
			//$(e.target)代表的每一行
			流程名称=$(e.target).find('[aria-describedby=list_seqs_process]')
			if(流程名称.text()=="反应生产"  ||  流程名称.text()=="模板失败" ||  流程名称.text()=="停止反应" ||  流程名称.text()=="模板成功" ||  流程名称.text()=="样品不足" || 流程名称.text()=="引物已清"){
				流程名称.attr('Bgcolor','#AeEEe7')
				$(e.target).find('[aria-describedby=list_seqs_primer]').eq(0).attr('title','更改此引物需要跟反应组说!!!')
			}
			备注=$(e.target).find('[aria-describedby=list_remark]')
			if(备注.text().toUpperCase().indexOf('菌P')!==-1  && 备注.text().indexOf('待测')!==-1) {//说明找到了菌P两个字
				备注.attr('Bgcolor','#f58220')
				$(e.target).find('[aria-describedby=list_remark]').eq(0).attr('title','如果菌P的样品要把待测去掉 那么需要跟反应组说下')
			}
		})
	}
	
	//如果是 状态_标颜色_反应组
	function 状态_标颜色_反应组(){
		table.find('[aria-describedby=list_seqs_back]').each(function(){
			if($(this).text()=="报告重跑"){
				$(this).attr('Bgcolor','#AeEEe7')
			}
		})
		
		//当table出现数据改变的时候
		$(html).find('#list').on('DOMNodeInserted',function(e) {
			//$(e.target)代表的每一行
			返回状态=$(e.target).find('[aria-describedby=list_seqs_back]')
			if(返回状态.text()=="报告重跑"  ){
				返回状态.attr('Bgcolor','#AeEEe7')
			}
		})
	}
	
	//点击批量编辑 批量编辑测序引物 按钮  如果需要改变引物，那么需要跟反应组说一下（反应生产 模板成功等）
	function 更改引物_提醒_跟反应组说(){
		selecteds=table.find('tbody').find("[aria-selected='true']")
		tag=0
		selecteds.find('[aria-describedby=list_seqs_process]').each(function(){
			if($(this).text()=="反应生产" ||  $(this).text()=="模板失败" ||  $(this).text()=="停止反应" ||  $(this).text()=="模板成功" || $(this).text()=="引物已清"){
				tag=1
			}
		})
		if(tag===1){
			yinwu_html=$('#iframeUpload').contents().find('body').eq(0) //如果找到 说明找到了 批量更改测序引物界面
			if(yinwu_html.length===1){
				setTimeout(function(){
					alert('改的引物如果有(反应生产)或者(模板成功)或(引物已清)的需要跟反应组说')
				},300)
			}
		}
	}
	
	//打印样品标签
	function 打印样品标签(){
		selecteds=table.find('tbody').find("[aria-selected='true']")
		if (selecteds.size()==0){return false}
		res="<NewDataSet>"
		selecteds.each(function(){
			shengchanbianhao=$(this).find('[aria-describedby=list_undefined]').text() //生产编号
			kehu_xingming=$(this).find('[aria-describedby=list_seqo_cust_name]').text()  //客户姓名
			yangpinbianhao=$(this).find('[aria-describedby=list_seqs_sam_num]').text() //样品编号
			yangpinleixing=$(this).find('[aria-describedby=list_seqs_sam_type]').text() //样品类型
			res+="<Table1>"
			res+="<seqs_prod_id>"+shengchanbianhao+"</seqs_prod_id>"
			res+="<seqo_cust_name>"+kehu_xingming+"</seqo_cust_name>"
			res+="<seqs_sam_num>"+yangpinbianhao+"</seqs_sam_num>"
			res+="<seqs_ant_type />"
			res+="<seqs_sam_type>"+'质粒'+"</seqs_sam_type>"
			res+="<seqs_fragment_size />"
			当天日期=getday_y_n('---')
			res+="<seqo_send_sample_time>"+当天日期+"T18:47:08+08:00</seqo_send_sample_time>"
			res+="</Table1>"
		})
		res+="</NewDataSet>"
		保存文本到本地(res,'down.html')
		
	}
	
	//保存文本到本地
	function 保存文本到本地(text, filename){
		// 创建一个Blob实例，类型为纯文本
		    var blob = new Blob([text], { type: 'text/plain' });
		 
		    // 创建一个指向Blob对象的URL
		    var url = URL.createObjectURL(blob);
		 
		    // 创建一个a标签
		    var a = document.createElement("a");
		 
		    // 设置a标签属性
		    a.href = url;
		    a.download =filename;
		 
		    // 模拟a标签点击，触发下载
		    document.body.appendChild(a);
		    a.click();
		 
		    // 清理临时DOM和对象URL
		    document.body.removeChild(a);
		    URL.revokeObjectURL(url);
			window.open('http://localhost//打印/print.html')
	}
	
	//公共函数 判断选择的是否是同一个订单号
	function is_one_order(html){
		//如果没有选择行则退出
		if(table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
		panduan=0
		selecteds=table.find('tbody').find("[aria-selected='true']")
		selecteds.find('[aria-describedby=list_seqo_order_id]').each(function(){
			if(selecteds.find('[aria-describedby=list_seqo_order_id]').eq(0).text()!=$(this).text()){
				alert('需要选择同一个订单号！')
				panduan=1
				return false;
			}
		})
		if(panduan==1){  //如果 不是同一个订单号，就退出
			return false;
		}else{
			return selecteds;
		}
	}
	//公共函数  生产编号需要降序排序
	function 生产编号需要降序排序(selecteds){
		new_scbh_arr=[]
		old_scbh_arr=[]
		$(selecteds.toArray().reverse()).each(function(){  //倒序把生产编号放进数组
			new_scbh_arr.push($(this).find('[aria-describedby=list_undefined]').text())
		})
		old_scbh_arr=new_scbh_arr.slice()
		new_scbh_arr.sort()  //对 生产编号排序，如果和 old_scbh_arr的顺序一样，那么继续，如果不一样，那么退出
		for (var i=0;i<old_scbh_arr.length;i++){
			if(old_scbh_arr[i]!=new_scbh_arr[i]){
				alert('生产编号需要降序排序')
				return false;	
			}
		}	
		return true
	}
	//公共函数  获取选择的行的所有数据
	function 获取选择的行的所有数据(selecteds){
		scbh_arr=[]  //生产编号
		ypdyh_arr=[]  //样品对应号
			new_ypdyh_arr=[]  //新的样品对应号
		ypmc_arr=[] //样品名称
			new_ypmc_arr=[] //新的样品名称
		yinwu_arr=[] //引物名称
			new_yinwu_arr=[] //新的引物名称
		yinwu_weizhi_arr=[]  //引物位置
			new_yinwu_weizhi_arr=[]  //新的引物位置
		yinwu_nong_arr=[] //引物浓度
			new_yinwu_nong_arr=[] //新的引物浓度
		yplx_arr=[]  //样品类型
			new_yplx_arr=[]  //新的样品类型
		zaiti_arr=[]	//载体
			new_zaiti_arr=[]	//新的载体
		pianduan_arr=[]  //片段
			new_pianduan_arr=[]  //新的片段
		kangshengsu_arr=[]  //抗生素
			new_kangshengsu_arr=[]  //新的抗生素
		beizhu_arr=[]  //备注
			new_beizhu_arr=[]  //新的备注
		is_cetong_arr=[]  //是否测通
			new_is_cetong_arr=[]   //新的是否测通
			
		$(selecteds.toArray().reverse()).each(function(){
			//倒序把生产编号放进数组
			scbh_arr.push($(this).find('[aria-describedby=list_undefined]').text())
			//倒序把样品对应号放进数组
			ypdyh_name=$(this).find('[aria-describedby=list_seqs_plus_prod_id]').html()
			if(ypdyh_name=="&nbsp;"){
				ypdyh_arr.push('')
			}else{
				ypdyh_arr.push(ypdyh_name)
			}
			//倒序把样品名称放进数组
			ypmc_arr.push($(this).find('[aria-describedby=list_seqs_sam_num]').text().trim())
			//倒序把引物名称放进数组
			yinwu_name=$(this).find('[aria-describedby=list_seqs_primer]').html() 
			if(yinwu_name=="&nbsp;"){
				yinwu_arr.push('')
			}else{
				yinwu_arr.push(yinwu_name)
			}
			//倒序把引物位置放进数组
			yinwu_weizhi_arr.push($(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').text().trim())
			//倒序把引物浓度放进数组
			nongdu_name=$(this).find('[aria-describedby=list_seqs_observe]').html()
			if(nongdu_name=="&nbsp;"){
				yinwu_nong_arr.push('')
			}else{
				yinwu_nong_arr.push(nongdu_name)
			}
			//倒序把样品类型放进数组
			yplx_arr.push($(this).find('[aria-describedby=list_seqs_sam_type]').text().trim())
			//倒序把载体放进数组
			zaiti_name=$(this).find('[aria-describedby=list_seqs_carry]').html()
			if(zaiti_name=="&nbsp;"){  //如果载体为空 或者 空格
				zaiti_arr.push("")
			}else{
				zaiti_arr.push(zaiti_name)
			}
			//倒序把片段放进数组
			pianduan_name=$(this).find('[aria-describedby=list_seqs_fragment_size]').html()
			if(pianduan_name=="&nbsp;"){  //如果片段为空 或者 空
				pianduan_arr.push("")
			}else{
				pianduan_arr.push(pianduan_name)
			}
			//倒序把抗生素放进数组
			kangshengsu_name=$(this).find('[aria-describedby=list_seqs_ant_type]').html()
			if(kangshengsu_name=="&nbsp;"){  //如果为空 或者 空格
				kangshengsu_arr.push("")
			}else{
				kangshengsu_arr.push(kangshengsu_name)
			}
			//倒序把备注放进数组
			beizhu_name=$(this).find('[aria-describedby=list_remark]').html()
			if(beizhu_name=="&nbsp;"){
				beizhu_arr.push("")
			}else{
				beizhu_arr.push(beizhu_name)
			}
			//倒序把是否测通放进数组
			cetong_is=$(this).find('[aria-describedby=list_seqs_istest_pass]').html()
			if(cetong_is=="是" || cetong_is=="true"){
				is_cetong_arr.push(true)
			}else{is_cetong_arr.push(false)}
		})	
		// console.log(scbh_arr)  //生产编号
		// console.log(ypdyh_arr)  //样品对应号
		// console.log(ypmc_arr) //样品名称
		// console.log(yinwu_arr) //引物名称
		// console.log(yinwu_weizhi_arr)  //引物位置
		// console.log(yinwu_nong_arr) //引物浓度
		// console.log(yplx_arr)  //样品类型
		// console.log(zaiti_arr)	//载体
		// console.log(pianduan_arr)  //片段
		// console.log(kangshengsu_arr)  //抗生素
		// console.log(beizhu_arr)  //备注
		// console.log(is_cetong_arr)  //是否测通
		return [scbh_arr,ypdyh_arr,ypmc_arr,yinwu_arr,yinwu_weizhi_arr,yinwu_nong_arr,yplx_arr,zaiti_arr,pianduan_arr,kangshengsu_arr,beizhu_arr,is_cetong_arr]
		//以下代码是仅仅为了复制方便
		arr[0]=scbh_arr//生产编号
		arr[1]=ypdyh_arr  //样品对应号
		arr[2]=ypmc_arr //样品名称
		arr[3]=yinwu_arr //引物名称
		arr[4]=yinwu_weizhi_arr  //引物位置
		arr[5]=yinwu_nong_arr //引物浓度
		arr[6]=yplx_arr  //样品类型
		arr[7]=zaiti_arr	//载体
		arr[8]=pianduan_arr  //片段
		arr[9]=kangshengsu_arr  //抗生素
		arr[10]=beizhu_arr  //备注
		arr[11]=is_cetong_arr  //是否测通
	}
}



