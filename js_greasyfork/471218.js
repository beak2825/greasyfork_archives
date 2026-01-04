function 基因新订单(src){
	console.log('新的基因新订单界面')
	var local_添加按钮提示=localStorage.getItem('添加按钮提示');
	var local_查询自己订单=localStorage.getItem('查询自己订单');
	var html=$('iframe[src="'+src+'"]')//页面
	html=html.contents().find('body').eq(0)
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	
	//没拍照片显示颜色
	没拍照片显示颜色(html)
	//生产公司不是睿智显示颜色
	生产公司不是睿智显示颜色(html)
	//添加toolbar工具栏按钮
	添加toolbar按钮(html)
	//添加toolbar工具栏按钮
	function 添加toolbar按钮(html){
		if (toolbar.find('.weiyiyici').length==0){
			//添加标记
			toolbar.addClass('weiyiyici')
			if (local_添加按钮提示=='true'){
				//点击添加按钮
				toolbar.find('#a_add').click(function(){
					提示('dingdan',html)
				})
			}
			//查询自己订单按钮
			if (local_查询自己订单=='true'){
				toolbar.append('<button id="button_order" onclick="return false">查询自己订单</button>') 
				//点击上传照片按钮
				toolbar.find('#button_order').click(function(){
					search_order()
				})
			}
		}
	}
	function 提示(){
		var html_tankuang= $('iframe[src="../GeneNew/addGeneOrderSample.aspx"]')//基因新订单  弹框页面
		html_tankuang.on('load',function(){
			h=html_tankuang.contents().find('body').eq(0)
			//需要选择睿智分公司
			var tex="<span style='color:red;font-size:10px;font-weight:bold'>①细菌选北京睿智，三代默认</span>"
			h.find('#txt_prod_company').eq(0).parent().append(tex)
			//订单备注显示和样品备注显示 默认打勾
			h.find('#txt_Radio_isOrderRemark').eq(0).attr('checked','checked')
			h.find('#txt_Radio_isSampleRemark').eq(0).attr('checked','checked')
		
		   //生产实验室 长度变短
			h.find('#txt_prod_company').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
			//结算分公司 青岛和广州的
			tex="<span style='color:red;font-size:8px;font-weight:bold'>③外地的需要选择(三代不用选择)</span>"
			h.find('#txt_settlement_company').eq(0).parent().append(tex)
			   //结算分公司 长度变短
			h.find('#txt_settlement_company').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
			//二级实验室 长度变短
			h.find('#txt_gene_new_second_companyname').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
			
			//二级实验室后面加句话
			tex="<span style='color:red;font-size:10px;font-weight:bold'>④细菌选微生物，三代选三代测序</span>"
			h.find('#txt_gene_new_second_companyname').eq(0).parent().append(tex)
			
			//预期时间后面加句话
			tex="<span style='color:red;font-size:15px;font-weight:bold'>②需要改此处</span>"
			h.find('#txt_gene_expectTime').eq(0).parent().append(tex)
			
			//把折扣改为1
			h.find('#txt_gene_new_discount').eq(0).val('细菌录1，三代报价/1000')
			
			//客户选择加个placeholder 邮箱问题
			h.find('#txtSearch').attr('placeholder','如果底单上的邮箱和客户管理里面的邮箱不一致的话，要抄送在基因新订单的备注里面')
			//备注加个placeholder 邮箱问题
			h.find('#txt_gene_order_remark').attr('placeholder','如果底单上的邮箱和客户管理里面的邮箱不一致的话，要抄送在基因新订单的备注里面')
			
		})
	}
	
	//没拍照片显示颜色
	function 没拍照片显示颜色(){
		订单号_arr=[]
		// 观察器的配置（需要观察什么变动）
		var config = {attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
		var table变化 = function(mutationRecoard, observer) {
			//会有两次变化  根据最终的变化
			if ($(html).find('#load_list').css('display')=='none'){
				//判断当前是否是第一页，如果不是则退出
				当前页=html.find('.ui-pg-input').eq(0).val()
				if (当前页!='1'){
					return false
				}
				第一个订单号_标签=html.find('tbody').eq(0).find('tr').eq(0).find('[aria-describedby=list_gene_new_order]')
				第一个订单号=第一个订单号_标签.text()
				var local_基因新订单_table_第一个订单号_是否已有照片=localStorage.getItem('基因新订单_table_第一个订单号_是否已有照片');
				
				if (local_基因新订单_table_第一个订单号_是否已有照片 == null){
					//如果为null 则查询
					是否有照片_res=查询订单号是否有照片(第一个订单号_标签)
					localStorage.setItem('基因新订单_table_第一个订单号_是否已有照片',第一个订单号+','+是否有照片_res);
				}else{
					//如果通过local获取的订单号一样，照片为true，则不允许，其他情况则查询
					L_订单号=local_基因新订单_table_第一个订单号_是否已有照片.split(',')[0]
					true_or_false=local_基因新订单_table_第一个订单号_是否已有照片.split(',')[1]
					console.log(L_订单号,true_or_false)
					if (L_订单号==第一个订单号 && true_or_false=='true'){
						//不用写
					}else{
						是否有照片_res=查询订单号是否有照片(第一个订单号_标签)
						localStorage.setItem('基因新订单_table_第一个订单号_是否已有照片',第一个订单号+','+是否有照片_res);
					}
				}
			}
		};
		var observer = new MutationObserver(table变化);
		// 以上述配置开始观察目标节点
		dom=$(html).find('#load_list').get(0)
		observer.observe(dom, config);
	}
	//查询某个订单号是否有照片
	function 查询订单号是否有照片(第一个订单号_标签){
		tag='true'
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/geneNew/GeneNewOrderPhoto.aspx?gene_new_order="+第一个订单号_标签.text(),
			function (data,status) {
				//如果没有搜到 说明没有照片
				if(data.indexOf('<img id=')===-1){
					第一个订单号_标签.css('color','red')
					tag='false'
				}
			});
		return tag
	}
	//生产公司不是睿智显示颜色(html)
	function 生产公司不是睿智显示颜色(html){
		//先运行一遍
		html.find('#list').eq(0).find('[aria-describedby=list_gene_new_product_company_name]').each(function(){
			if($(this).text()!="北京睿智"){
				$(this).parent().find('[aria-describedby=list_gene_new_cust_name]').attr('Bgcolor','red')
			}
		})
		//当table出现数据改变的时候
		$(html).find('#list').on('DOMNodeInserted',function(e) {
			//$(e.target)代表的每一行
			生产公司=$(e.target).find('[aria-describedby=list_gene_new_product_company_name]')
			if(生产公司.text()!="北京睿智"){
				生产公司.parent().find('[aria-describedby=list_gene_new_cust_name]').attr('Bgcolor','red')
			}
		});
	}
	//查询自己订单
	function search_order(){
		var 当前用户名=$('#curname',window.parent.document).text()
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='gene_new_addPeople']").attr('selected','selected')  //把找到的第一个查询条件改成 添加人
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(当前用户名)
		$("#AB").click()
	}
}

