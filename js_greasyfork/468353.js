// ==UserScript==
// @name         睿博兴科
// @namespace    http://tampermonkey.net/
// @version      0.142
// @description  增加了新功能
// @author       You
// @license      AGPL
// @match        http://49.72.111.82:8081/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468353/%E7%9D%BF%E5%8D%9A%E5%85%B4%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/468353/%E7%9D%BF%E5%8D%9A%E5%85%B4%E7%A7%91.meta.js
// ==/UserScript==

function main(){//不能删此函数
	//判断当前网址，如果是登录界面或者是已经登录成功的界面
	base_url="http://49.72.111.82:8081"
	url = window.location.href;
	if(url.indexOf('login.htm')!==-1){
		login()
	}
	if(url.indexOf('default.aspx')!==-1){
		login_background()
	}
}
var timer1=""  //设定反应生产的定时器
var timer5="" //作为 发票管理 的定时器
var 显示_测序样品=false   
var 显示_测序样品_客服=false
var 显示_订单管理=false  
var 显示_合成订单=false
var 显示_合成样品=false
var 显示_反应组=false
var 显示_测序样品_纯反应组=false
var 显示_北京价格=false
var 显示_广州价格=false
var user="XXX"
var pass='123456'
var tags_primer_primerCheckBox=0  //VIP下单 iframe框 单击 “上传Excel” 按钮 的标记  是否自送运行 primer()和primer_checkbox();
var 当前用户名=$('#curname',window.parent.document).text()	
main()
//登录界面执行
function login(){
	$(document).ready(function(){
		$('#txtUserName').dblclick(function(){
			//post请求 POST登录
			$.post("/ajax/login.ashx",
				{u:user,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass,c:"38",orgcode:'睿博兴科'},
				function (data) {
					//转到主页
					window.location.href="http://49.72.111.82:8081/default.aspx#"
				});
		})
	});
}
//已经显示后台后执行
function login_background(){
	if($('#A1', window.parent.document).text()==="员工自助 1"){
		return false
	}
	$('#A1').text('员工自助 1')
	if($('#curname', window.parent.document).text()===user){
		$('#curname').parent().prepend('<span>切换至<a href="#" id="luru" onclick="return false">录入</a></span>&nbsp;&nbsp;')
	}else if($('#curname', window.parent.document).text()==="录入"){
		$('#curname').parent().prepend('<span>切换至<a href="#" id="luru" onclick="return false">'+user+'</a></span>&nbsp;&nbsp;')
	}
	gongneng()
	//setInterval(function(){kehu_shenhe()},60*1000) 
	//点击 切换账户
	$('#luru').click(function(){
		//退出账户
		$.get("/ajax/loginout.ashx",
			function (data,status) {
				if($('#curname', window.parent.document).text()===user){
					//post请求 POST登录
					$.post("/ajax/login.ashx",
						{u:'录入',IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:'123456',c:"38",orgcode:'睿博兴科'},
						function (data) {
							//刷新本页面
							location.reload();
						});
				}else if($('#curname', window.parent.document).text()==="录入"){
					//post请求 POST登录
					$.post("/ajax/login.ashx",
						{u:user,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass,c:"38",orgcode:'睿博兴科'},
						function (data) {
							//刷新本页面
							location.reload();
						});
				}
			})
	})
}
function gongneng(){
	//点击左侧的 订单管理
	$('#lnav').find('ul').find('li:contains(订单管理)').eq(0).on('click',function(){
		var html=$('iframe[src="/seq/SeqOrderList.aspx"]')//订单管理页面
		if (html.length==1 && 显示_订单管理==true){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					
					//vip下单放到最前面
					vip_top('dingdan',html);
					//批量添加照片 多个人上传同一个照片
					add_phone()
					if(当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						//查询北京订单数量
						//find_shuliang()
						//每日报表
						baobiao()
					}
					gaodu('dingdanguanli')
					gaodu('dingdanguanli')
				},1000)
				
			})
			//每隔几秒运行一次  如果生产公司不是北京分公司，则显示一个颜色
			setInterval(function(){beijingfengongsi()},4000)
		}
	})
	
	//点击左侧的 测序样品
	$('#lnav').find('ul').find('li:contains(测序样品)').eq(0).on('click',function(){
		var html=$('iframe[src="/seq/SeqSampleList.aspx"]')//测序样品页面
		if (html.length==1 && 显示_测序样品==true && 显示_测序样品_纯反应组==false){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//选中一些行后，把相同引物位置的其余引物标记颜色
					html.on('click','table tbody tr',function(){
						html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//测序样品页面
						show_color_primer(html);//选中一些行后，把相同引物位置的其余引物标记颜色
					})
					//点击 批量添加 按钮 如果选中的行有 待测 和(菌P 或者 菌p） 则 提示
					if(当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						html.on('click','#a_BatchEdit',function(){
							jun_p_daice()
						})
					}
					//把 测序样品 的 流程名称 是反应生产，模板失败，停止反应  标颜色
					gg_color()
					//添加样品前缀 添加样品后缀 更改部分
					yangpin_add_edit()
					
					if(当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						//批量添加反应
						piliang_add()
						//显示选择行所属的订单号
						show_dingdanhao()
						//显示选择行的样品名称   客户名+样品名
						show_yangpinmingcheng()
						//加测
						jiace()
						//查询信息
						yangpin_chaxun()
						//其他  把不常用的功能放在这里
						qita()
					}
					gaodu('cexuyangpin')
					gaodu('cexuyangpin')
					gaodu('cexuyangpin')
					gaodu('cexuyangpin')
				},1000)
				
			})
		}
		
		if(html.length==1 && 显示_反应组==true){
			html.on('load',function(){
				setTimeout(function(){
					html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//测序样品页面
					//改成每页300个数据
					html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('200')
					//显示选择行的样品名称   客户名+样品名
					show_yangpinmingcheng()
					//模板板号和孔号改成-1
					模板板号和孔号改为负一(html)
					gaodu('cexuyangpin')
				},1000)
			})
		}
		
		if(html.length==1 && 显示_测序样品_客服==true){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					查询每日返样个数(html)
				},1000)
			})
		}
	})
	
	//点击左侧的 合成订单
	$('#lnav').find('ul').find('li:contains(合成订单)').find('a:[rel="/syn/syn_order.aspx"]').parent().parent().on('click',function(){
		setTimeout(function(){
			//当页面打开太多，提示的时候
			$('.messager-button').find('a:contains(确定)').on('click',function(){
				var html=$('iframe[src="/syn/syn_order.aspx"]')//合成订单页面
				if (html.length==1 && 显示_合成订单==true){
					合成订单_运行(html)
				}
			})
		},100)
		var html=$('iframe[src="/syn/syn_order.aspx"]')//合成订单页面
		if (html.length==1 && 显示_合成订单==true){
			合成订单_运行(html)
		}
		function  合成订单_运行(html){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//标题颜色改变一下
					$('#tabs').find('li:contains(合成订单)').find('span').css('color','red')
					//vip下单放到最前面
					vip_top('hecheng',html);
				},1000)
			})
		}
	})
	
	//点击左侧的 合成订单审核
	$('#lnav').find('ul').find('li:contains(合成订单审核)').on('click',function(){
		setTimeout(function(){
			//当页面打开太多，提示的时候
			$('.messager-button').find('a:contains(确定)').on('click',function(){
				var html=$('iframe[src="/syn/synOrderwaitAduitList.aspx"]')//合成订单审核页面
				if (html.length==1){
					合成订单审核_运行(html)
				}
			})
		},100)
		var html=$('iframe[src="/syn/synOrderwaitAduitList.aspx"]')//合成订单审核页面
		if (html.length==1){
			合成订单审核_运行(html)
		}
		function 合成订单审核_运行(html){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//标题颜色改变一下
					$('#tabs').find('li:contains(合成订单审核)').find('span').eq(0).css('color','red')
				},1000)
			})
		}
	})
	
	
	
	//点击左侧的  合成样品
	$('#lnav').find('ul').find('li:contains(合成样品)').on('click',function(){
		var html=$('iframe[src="/syn/SynSample.aspx"]')//合成样品页面
		if (html.length==1 && 显示_合成样品==true){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					if(当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						//判断是否是测序引物
						hecheng_is_cexuyinwu()
						//查询同序列所有引物
						hecheng_tong_xulie()
						//查询选择订单号的订单
						hecheng_find_dingdanhao()
						gaodu('hechengyangpin')
						//hecheng_tongji()  统计每日引物条数，订单数量 管数  暂时不需要了
					}
					if(当前用户名==="申高天" || 当前用户名==="孙凤丽"){
						//查询北京分公司每日合成 备注不包含测序，基因，项目的反应条数。大于等于60多少条，小于等于59多少条
						//OPC/PAGE,HPAGE/H-PAGE/HPLC,修饰不等于-1  大于等于60多少条，小于等于59多少条
						统计_活动_2022年(html)
					}
				},1000)
				
			})
		}
	})
	
	//点击左侧的  反应生产
	$('#lnav').find('ul').find('li:contains(反应生产)').on('click',function(){
		setTimeout(function(){
			//当页面打开太多，提示的时候
			$('.messager-button').find('a:contains(确定)').on('click',function(){
				console.log(77)
				var html=$('iframe[src="/seq/SeqReaction.aspx"]')//反应生产页面
				if (html.length==1 && 显示_反应组==true){
					反应生产_运行(html)
				}
			})
		},100)
		var html=$('iframe[src="/seq/SeqReaction.aspx"]')//反应生产页面
		if (html.length==1 && 显示_反应组==true){
			反应生产_运行(html)
		}
		function 反应生产_运行(html){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//标题颜色改变一下
					$('#tabs').find('li:contains(反应生产)').find('span').eq(0).css('color','red')
					找加测反应(html)
					同名引物(html)
					获取加测引物板号(html)
					查询模板板号(html)
					设置板号(html)
					clearInterval(timer1)
					timer1=setInterval(function(){反应生产标颜色()},3000)
					gaodu('fanyingshengchan')
					gaodu('fanyingshengchan')
					gaodu('fanyingshengchan')
				},1000)
			})
		}
	})
	//点击左侧的  模板生产
	$('#lnav').find('ul').find('li:contains(模板生产)').on('click',function(){
		setTimeout(function(){
			//当页面打开太多，提示的时候
			$('.messager-button').find('a:contains(确定)').on('click',function(){
				var html=$('iframe[src="/seq/SeqTemplate.aspx"]')//模板生产页面
				if (html.length==1 && 显示_反应组==true){
					模板生产_运行(html)
				}
			})
		},100)
		var html=$('iframe[src="/seq/SeqTemplate.aspx"]')//模板生产页面
		if (html.length==1 && 显示_反应组==true){
			模板生产_运行(html)
		}
		function 模板生产_运行(html){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//标题颜色改变一下
					$('#tabs').find('li:contains(模板生产)').find('span').eq(0).css('color','red')
					//改成每页300个数据
					html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('300')
					获取引物板号(html,'模板生产')
				},1000)
			})
		}
	})
	
	//点击左侧的  模板浏览
	$('#lnav').find('ul').find('li:contains(模板浏览)').on('click',function(){
		setTimeout(function(){
			//当页面打开太多，提示的时候
			$('.messager-button').find('a:contains(确定)').on('click',function(){
				var html=$('iframe[src="/seq/seqTemplebrowse.aspx"]')//模板浏览页面
				if (html.length==1 && 显示_反应组==true){
					//改成每页300个数据
					html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('300')
					模板浏览_运行(html)
				}
			})
		},100)
		var html=$('iframe[src="/seq/seqTemplebrowse.aspx"]')//模板浏览页面
		if (html.length==1 && 显示_反应组==true){
			模板浏览_运行(html)
		}
		function 模板浏览_运行(html){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//标题颜色改变一下
					//改成每页300个数据
					html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('300')
					$('#tabs').find('li:contains(模板浏览)').find('span').eq(0).css('color','red')
					获取引物板号(html,'模板浏览')
				},1000)
			})
		}
	})
	
	
	
	//======================================基因新管理======================================================
	//点击左侧的 基因返还
	$('#lnav').find('ul').find('li:contains(基因返还)').eq(0).on('click',function(){
		var html=$('iframe[src="/geneNew/GeneReturnList.aspx"]')//基因返还页面
		if (html.length==1){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//返还单生成
					基因返还_查询返还单生成(html);
					
				},1000)
				
			})
		}
	})
	//点击左侧的 基因QC
	$('#lnav').find('ul').find('li:contains(基因QC)').eq(0).on('click',function(){
		var html=$('iframe[src="/geneNew/GeneNewQCList.aspx "]')//基因QC页面
		if (html.length==1){
			html.on('load',function(){
				setTimeout(function(){
					html=html.contents().find('body').eq(0)
					//查询qc待处理_已排版
					基因QC_查询qc待处理_已排版(html);
					
				},1000)
				
			})
		}
	})
	
	
	
	//点击反应生产->机器分装->测序机器分装表打印
	$("#print_SeqMachineFenZhuangReport").live('click',function(){
		加甜菜碱()
	})
	
	
	//点击 订单管理 标题，让VIP添加按钮放在最前面
	$('#tabs').on('click','li:contains(订单管理)',function(){gaodu('dingdanguanli');gaodu('dingdanguanli')})
	//点击  合成订单 标题，让VIP添加按钮放在最前面
	$('#tabs').on('click','li:contains(合成订单)',function(){})
	//点击  自备引物 标题 
	$('#tabs').on('click','li:contains(自备引物)',function(){
		edit_primer_zibei();
		chaxun_yinwu_zibei_cexuyangpinShow()
	})
	//点击 模板排版 标题
	$('#tabs').on('click','li:contains(模板排版)',function(){
		//修改样品类型
		mubanpaiban_xiugai_yangpinleixing()
		//修改样品名称
		mubanpaiban_edit_ypmc()
		//mubanpaiban()
		gaodu('mubanpaiban')
	})
	//点击 课题组管理 标题，
	$('#tabs').on('click','li:contains(课题组管理)',function(){
		add_price()
		//yewuyuan_ketizu_dizhi_jihe()
	})
	//点击 客户课题组管理 标题， 客户课题组 根据选中的行，更改客户管理里面的客户地址（一般就是某个课题组换地址了，这样更改）
	$('#tabs').on('click','li:contains(客户课题组)',function(){
		//一定要放在第一行  每隔5秒执行各种需要自动执行的程序
		zidong_yunxing_kehuketizu()
		if(当前用户名==="申高天" || 当前用户名==="刘泽夫"){
			edit_address()
		}
	})
	//点击 客户管理 标题，
	$('#tabs').on('click','li:contains(客户管理)',function(){
		//根据手机号 查询客户姓名
		kehu_shoujihao()
	})
	//点击 测序样品 标题，
	$('#tabs').on('click','li:contains(测序样品)',function(){gaodu('cexuyangpin');gaodu('cexuyangpin')})
	//点击 合成样品 标题，
	$('#tabs').on('click','li:contains(合成样品)',function(){gaodu('hechengyangpin');gaodu('hechengyangpin')})
	//点击 反应生产 标题，
	$('#tabs').on('click','li:contains(反应生产)',function(){gaodu('fanyingshengchan');gaodu('fanyingshengchan')})
	//点击 发票管理 标题，让是否签收 显示颜色
	$('#tabs').on('click','li:contains(发票管理)',function(){
		if(timer5===""){
			timer5=setInterval(function(){fapiao()},3000)
			$(this).find('span').eq(0).css('color','red')
		}else{
			clearInterval(timer5);
			$(this).find('span').eq(0).css('color','#416AA3')
			timer5=""
		}
		fapiao_paizhao()
	})
	//点击  待核订单 标题，让客户上传的订单显示颜色
	$('#tabs').on('click','li:contains(待核订单)',function(){})
	//点击  合成订单审核 
	 $('#tabs').on('click','li:contains(合成订单审核)',function(){})
	//点击 销售回款清单 标题
	$('#tabs').on('click','li:contains(销售回款清单)',function(){
		//规格去重
		guige_quchong()
	})
	//点击 基因新订单 标题
	$('#tabs').on('click','li:contains(基因新订单)',function(){
		//颜色改变一下
		$('#tabs').find('span:contains(基因新订单)').eq(0).css('color','red')
		//规格去重
		jiyin_add()
		//在 基因新订单 每隔几秒显示没拍照片 
		show_yanse()
	})
	//点击 PCR扩增 标题
	$('#tabs').on('click','li:contains(PCR扩增)',function(){
		//颜色改变一下
		$('#tabs').find('span:contains(PCR扩增)').eq(0).css('color','blue')
		//查询申高天和冯丽丽上传的订单
		jiyin_dingdan_chaxun()
	})
	//点击 订单出库 标题
	$('#tabs').on('click','li:contains(订单出库)',function(){
		//查询订单出库 周报各个分公司（5个 北京两个，广州，青岛，哈尔滨） 计价单位=个的数量的总和
		dingdanchuku_zhoubao_tongji_ge()
		//当前页面的每个订单的总反应数，放在 订单信息 里面
		dingdanchuku_每个订单反应数()
		gaodu('dingdanchuku')
		gaodu('dingdanchuku')
		gaodu('dingdanchuku')
	})
	//=========================测序样品  开始===========================//
	//点击批量编辑 批量编辑测序引物 按钮  如果需要改变引物，那么需要跟反应组说一下（反应生产 模板成功等）
	$("#w").on('click','#select_temple_notNull',function(){
		genggai_yinwu_tixing()
	})
	//=========================测序样品  结束===========================//
	

	
	
	//=========================订单管理//反应生产===========================//
	$('#AB').live('click',function(){
		//如果是订单管理上传订单后再添加合成订单，则继续
		if($('#uiform').find('td:contains(添加成功，确定后添加合成订单，否则点击取消！)').length==1){
			//下面是订单管理上传订单后再添加合成订单
			//dingdan_shangchuanhou_yinwuhecheng_xinguan()
		}
		//如果是 反应生产 设置板号
		if($('#txt_seqs_plate').length==1){
			设置板号_自动添加()
		}
	})
	
	//================================自动运行  CNAS的订单都加急==================================//
	zidong()
	function zidong(){
		var x=setTimeout(function (){
			cnas加急_内部()
			//----------------合成管理--------------
			//安排合成页面  李楠和达尔文生物 加不同的颜色
			安排合成_李楠和达尔文生物_颜色()
			zidong()
		},3000);
		function cnas加急_内部(){
			//-------------------基因新管理---------
			var html_基因新订单=$('iframe[src="/geneNew/GeneNewOrderList.aspx"]').contents().find('body').eq(0) //基因新订单页面
			if(html_基因新订单.length===1){
				搜索信息='[aria-describedby=list_gene_new_remark]'
				cnas订单加急(html_基因新订单,搜索信息)
			}
			var html_PCR扩增=$('iframe[src="/geneNew/GeneNewSeqPcr.aspx"]').contents().find('body').eq(0) //PCR扩增页面
			if(html_PCR扩增.length===1){
				搜索信息='[aria-describedby=list_gene_new_p_remark]'
				cnas订单加急(html_PCR扩增,搜索信息)
			}
			var html_测序鉴定=$('iframe[src="/geneNew/GeneNewSeqIdentificate.aspx"]').contents().find('body').eq(0) //测序鉴定页面
			if(html_测序鉴定.length===1){
				搜索信息='[aria-describedby=list_gene_new_p_remark]'
				cnas订单加急(html_测序鉴定,搜索信息)
			}
			//----------------------合成管理-----------------合成纯化 合成烘干没有弄
			//合成订单页面
			var html=$('iframe[src="/syn/syn_order.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syno_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成费用页面
			var html=$('iframe[src="/syn/syn_jisuan_Money.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syno_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成样品页面
			var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成报告邮件页面
			var html=$('iframe[src="/syn/synBaoGaoEmailList.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syno_remark]'
				cnas订单加急(html,搜索信息)
			}
			//安排合成页面
			var html=$('iframe[src="/syn/synArrange.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成修饰页面
			var html=$('iframe[src="/syn/SynDecorate.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成氨解页面
			var html=$('iframe[src="/syn/SynAmmonoly.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成分装值页面
			var html=$('iframe[src="/syn/synDisopenValue.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//合成分装页面
			var html=$('iframe[src="/syn/SynDispen.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_syn_s_remark]'
				cnas订单加急(html,搜索信息)
			}
			//----------------------测序管理----------------- 报告生产 拼接状态  重新扩增未
			//模板浏览页面
			var html=$('iframe[src="/seq/seqTemplebrowse.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
			//订单管理页面
			var html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_seqo_remark]'
				cnas订单加急(html,搜索信息)
			}
			//测序样品页面
			var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
			//模板排版页面
			var html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
			//模板生产页面
			var html=$('iframe[src="/seq/SeqTemplate.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
			//反应生产页面
			var html=$('iframe[src="/seq/SeqReaction.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
			//样品补送页面
			var html=$('iframe[src="/seq/SeqSampleShortSend.aspx"]').contents().find('body').eq(0) 
			if(html.length===1){
				搜索信息='[aria-describedby=list_remark]'
				cnas订单加急(html,搜索信息)
			}
		}
	}
	
}
//======================================新冠===================================================		新冠



//================================自动运行  CNAS的订单都加急==================================//
//--------------------------------------合成管理--------------
//安排合成_李楠和达尔文生物_颜色
function 安排合成_李楠和达尔文生物_颜色(){
	var html=$('iframe[src="/syn/synArrange.aspx"]').contents().find('body').eq(0) //安排合成页面
	if(html.length===1){
		html.find('table').find('tr').each(function(){
			课题组信息=$(this).find('[aria-describedby=list_syno_ketizu]')
			//如果有标记 则退出
			if(课题组信息.hasClass('biaoji_anpaihecheng')===true){
				return false
			}
			//加个标记
			课题组信息.addClass('biaoji_anpaihecheng')
			课题组=课题组信息.text()
			if(课题组==="李楠"){
				console.log(课题组)
				//设置背景颜色
				$(this).find('td').attr('Bgcolor','#FF7034')
			}
			if(课题组==="达尔文生物"){
				console.log(课题组)
				//设置背景颜色
				$(this).find('td').attr('Bgcolor','#C80000')
			}
		})
	}
}
//备注包含CNAS的行就标个颜色
function cnas订单加急(html,搜索信息){
	var toolbar=html.find('.toolbar').eq(0)
	var table=html.find('table')
	html.find('table').find('tr').each(function(){
		备注信息=$(this).find(搜索信息)
		//如果有标记 则退出
		if(备注信息.hasClass('biaoji_cnas_jiaji')===true){
			return false
		}
		//加个标记
		备注信息.addClass('biaoji_cnas_jiaji')
		备注=$(this).find(搜索信息).text()
		if(备注.toUpperCase().indexOf('CNAS')!==-1){
			console.log(备注)
			//设置背景颜色
			$(this).find('td').attr('Bgcolor','#24B2C8')
		}
	})
	
	
}


//=========================模板生产  开始===========================//                  模板生产

function 获取引物板号(html,框架名){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#button_zhili_banhao').size()==0){
		toolbar.append('<a href="#"><button id="button_zhili_banhao" onclick="return false">质粒引物板号</button></a>')
		toolbar.append('<a href="#"><button id="button_zhiti_banhao" onclick="return false">直提引物板号</button></a>')
		toolbar.append('<a href="#"><button id="button_qiejiao_banhao" onclick="return false">切胶引物板号</button></a>')
		toolbar.append('<a href="#"><button id="button_jun_banhao" onclick="return false">菌引物板号</button></a>')
		if(框架名=='模板生产'){
			toolbar.append('<a href="#"><button id="button_chongchou_banhao" onclick="return false">重抽引物板号</button></a>')
		}
		toolbar.find('#button_zhili_banhao').click(function(){
			公共_引物('质粒',框架名)
		})
		toolbar.find('#button_zhiti_banhao').click(function(){
			公共_引物('直提菌',框架名)
		})
		toolbar.find('#button_qiejiao_banhao').click(function(){
			公共_引物('切胶',框架名)
		})
		toolbar.find('#button_jun_banhao').click(function(){
			公共_引物('菌',框架名)
		})
		toolbar.find('#button_chongchou_banhao').click(function(){
			查找重抽引物()
		})
		function 查找重抽引物(){
			tijiao="/seq/ashx/SeqProcessHandler.ashx?_search=true&nd=1667648881482&rows=5000&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_back%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E9%87%8D%E6%8A%BD%22%7D%5D%7D"
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(tijiao,
				function (data) {
					总个数=文本_取中间文本(data,'"totalrecords":"','"')
					console.log(总个数)
					if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
						console.log('总个数为0')
						//下面用到，所以建一个空的
						测序引物_arr=[]
						return
					}else{
						备注_arr=文本_取中间文本_批量(data,'"remark":"','"')
						客户名_arr=文本_取中间文本_批量(data,'"seqo_cust_name":"','"')
						课题组_arr=文本_取中间文本_批量(data,'"seqo_ketizu":"','"')
						测序引物_arr=文本_取中间文本_批量(data,'"seqs_primer":"','"')
						引物浓度_arr=文本_取中间文本_批量(data,'"seqs_observe":"','"')
						生产编号_arr=文本_取中间文本_批量(data,'"seqs_prod_id":',',')
						//数组去重
						记录需要删除的索引=[]
						数组长度=备注_arr.length
						for(var i=0;i<数组长度;i++){
							//如果备注有待测 或者 长程序 或 暂时不做
							if(备注_arr[i].indexOf('待测')!=-1 || 备注_arr[i].indexOf('长程序')!=-1 || 备注_arr[i].indexOf('暂时不做')!=-1){
								console.log(i,'待测或长程序或暂时不做不会查引物')
								记录需要删除的索引.push(i)
								continue
							}
							// 如果引物浓度为空 则需要删除
							if(引物浓度_arr[i]==""){
								记录需要删除的索引.push(i)
								continue
							}
						}
						for(var i=记录需要删除的索引.length-1;i>=0;i--){
							备注_arr.splice (记录需要删除的索引[i],1)
							客户名_arr.splice (记录需要删除的索引[i],1)
							课题组_arr.splice (记录需要删除的索引[i],1)
							测序引物_arr.splice (记录需要删除的索引[i],1)
							引物浓度_arr.splice (记录需要删除的索引[i],1)
							生产编号_arr.splice (记录需要删除的索引[i],1)
						}
						所有连接_arr=[]
						for (var i=0;i<客户名_arr.length;i++){
							所有连接_arr.push(备注_arr[i]+"&$"+客户名_arr[i]+"&$"+课题组_arr[i]+"&$"+测序引物_arr[i]+"&$"+引物浓度_arr[i]+"&$"+生产编号_arr[i])
						}
						所有连接_arr=quchong_arr(所有连接_arr)
						备注_arr=[]
						客户名_arr=[]
						课题组_arr=[]
						测序引物_arr=[]
						引物浓度_arr=[]
						生产编号_arr=[]
						for(var i=0;i<所有连接_arr.length;i++){
							备注_arr.push(所有连接_arr[i].split('&$')[0])
							客户名_arr.push(所有连接_arr[i].split('&$')[1])
							课题组_arr.push(所有连接_arr[i].split('&$')[2])
							测序引物_arr.push(所有连接_arr[i].split('&$')[3])
							引物浓度_arr.push(所有连接_arr[i].split('&$')[4])
							生产编号_arr.push(所有连接_arr[i].split('&$')[5])
						}
					}
				})
					
			//在测序样品根据生产编号 获取流程记录的板号
			//result_客户名_arr=[]
			//result_课题组_arr=[]
			//result_引物浓度_arr=[]
			//result_备注_arr=[]
			//result_测序引物_arr=[]
			result_板号_arr=[]
			for(var i=0;i<生产编号_arr.length;i++){
				tijiao="/seq/ashx/SeqProcessRecHandler.ashx?seqs_prod_id="+生产编号_arr[i]+"&action=getrec&_search=false&nd=1667735028457&rows=10&page=1&sidx=seqop_id&sord=desc"
				$.get(tijiao,
					function (data) {
						总个数=文本_取中间文本(data,'"totalrecords":"','"')
						if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
							console.log('总个数为0')
							return
						}else{
							//result_备注_arr.push(文本_取中间文本_批量(data,'"remark":"','"')[0])
							//result_客户名_arr.push(文本_取中间文本_批量(data,'"seqo_cust_name":"','"')[0])
							//result_课题组_arr.push(文本_取中间文本_批量(data,'"seqo_ketizu":"','"')[0])
							//result_测序引物_arr.push(文本_取中间文本_批量(data,'"seqs_primer":"','"')[0])
							//result_引物浓度_arr.push(文本_取中间文本_批量(data,'"seqs_observe":"','"')[0])
							板号集合=文本_取中间文本_批量(data,'"seqop_plate":"','"')
							if(板号集合[0]!="-1"){
								result_板号_arr.push(板号集合[0])
							}else{
								result_板号_arr.push(板号集合[1])
							}
						}
					})
			}
			//清空文本框内容
			if($('#textarea_shuju').length===1){
				$("#textarea_shuju").val("")
			}
			//给文本框放入结果数据
			for(var i=0;i<result_板号_arr.length;i++){
				shuju=测序引物_arr[i]+"  ("+result_板号_arr[i]+")  "+客户名_arr[i]+"  "+课题组_arr[i]     //+"  "+result_备注_arr[i]+"  "+result_引物浓度_arr[i]
				if($('#textarea_shuju').length===0){
					$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
				}
				$("#textarea_shuju").val($("#textarea_shuju").val()+shuju+"\n")
			}
			alert('ok')
			
		}
		function 公共_引物(样品类型,框架名){
			if(框架名=='模板生产'){
				if(样品类型=="质粒"){
					tijiao="/seq/ashx/SeqProcessHandler.ashx?_search=true&nd=1667131250674&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22ZL%22%7D%5D%7D"
				}
				if(样品类型=="直提菌"){
					tijiao="/seq/ashx/SeqProcessHandler.ashx?_search=true&nd=1667131250674&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22T%22%7D%5D%7D"
				}
				if(样品类型=="切胶"){
					tijiao="/seq/ashx/SeqProcessHandler.ashx?_search=true&nd=1667131250674&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22Q%22%7D%5D%7D"
				}
				if(样品类型=="菌"){
					//模板板号包含j 或 包含D  或包含S
					tijiao="/seq/ashx/SeqProcessHandler.ashx?_search=true&nd=1679152123738&rows=99999&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22OR%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22J%22%7D%2C%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22D%22%7D%2C%7B%22field%22%3A%22seqs_tempplate%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22S%22%7D%5D%7D"
				}
			}
			if(框架名=='模板浏览'){
				if(样品类型=="质粒"){
					tijiao="/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1667135606902&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_observe%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%AF%B9%E5%BA%94%22%7D%2C%7B%22field%22%3A%22seqs_sam_type%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E8%B4%A8%E7%B2%92%22%7D%5D%7D"
				}
				if(样品类型=="直提菌"){
					tijiao="/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1667135667460&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_observe%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%AF%B9%E5%BA%94%22%7D%2C%7B%22field%22%3A%22seqs_sam_type%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E7%9B%B4%E6%8F%90%E8%8F%8C%22%7D%5D%7D"
				}
				if(样品类型=="切胶"){
					// 引物浓度=对应 且 样品类型包含PCR
					tijiao="/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1667135775532&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_observe%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%AF%B9%E5%BA%94%22%7D%2C%7B%22field%22%3A%22seqs_sam_type%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22PCR%22%7D%5D%7D"
				}
				if(样品类型=="菌"){
					//引物浓度=对应 且  包含菌
					tijiao="/seq/ashx/seqTemplebrowseHandler.ashx?_search=true&nd=1667404097697&rows=8000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_observe%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%AF%B9%E5%BA%94%22%7D%2C%7B%22field%22%3A%22seqs_sam_type%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E8%8F%8C%22%7D%5D%7D"
				}
			}
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(tijiao,
				function (data) {
					总个数=文本_取中间文本(data,'"totalrecords":"','"')
					console.log(总个数)
					if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
						//下面用到，所以建一个空的
						测序引物_arr=[]
						return
					}else{
						备注_arr=文本_取中间文本_批量(data,'"remark":"','"')
						客户名_arr=文本_取中间文本_批量(data,'"seqo_cust_name":"','"')
						课题组_arr=文本_取中间文本_批量(data,'"seqo_ketizu":"','"')
						测序引物_arr=文本_取中间文本_批量(data,'"seqs_primer":"','"')
						引物浓度_arr=文本_取中间文本_批量(data,'"seqs_observe":"','"')
						
						//数组去重
						记录需要删除的索引=[]
						数组长度=备注_arr.length
						for(var i=0;i<数组长度;i++){
							//如果备注有待测                或者 长程序 或  暂时不做 
							if(备注_arr[i].indexOf('待测')!=-1 ){  // 备注_arr[i].indexOf('长程序')!=-1 || 备注_arr[i].indexOf('暂时不做')!=-1
								console.log(i,'待测')
								记录需要删除的索引.push(i)
								continue
							}
							// 如果引物浓度没有包含对应
							if(引物浓度_arr[i].indexOf('对应')==-1){
								记录需要删除的索引.push(i)
								continue
							}
						}
						for(var i=记录需要删除的索引.length-1;i>=0;i--){
							备注_arr.splice (记录需要删除的索引[i],1)
							客户名_arr.splice (记录需要删除的索引[i],1)
							课题组_arr.splice (记录需要删除的索引[i],1)
							测序引物_arr.splice (记录需要删除的索引[i],1)
							引物浓度_arr.splice (记录需要删除的索引[i],1)
						}
						所有连接_arr=[]
						for (var i=0;i<客户名_arr.length;i++){
							所有连接_arr.push(备注_arr[i]+"&$"+客户名_arr[i]+"&$"+课题组_arr[i]+"&$"+测序引物_arr[i]+"&$"+引物浓度_arr[i])
						}
						所有连接_arr=quchong_arr(所有连接_arr)
						备注_arr=[]
						客户名_arr=[]
						课题组_arr=[]
						测序引物_arr=[]
						引物浓度_arr=[]
						for(var i=0;i<所有连接_arr.length;i++){
							备注_arr.push(所有连接_arr[i].split('&$')[0])
							客户名_arr.push(所有连接_arr[i].split('&$')[1])
							课题组_arr.push(所有连接_arr[i].split('&$')[2])
							测序引物_arr.push(所有连接_arr[i].split('&$')[3])
							引物浓度_arr.push(所有连接_arr[i].split('&$')[4])
						}
						console.log('备注_arr的长度',备注_arr.length)
						console.log('客户名_arr的长度',客户名_arr.length)
						console.log('课题组_arr的长度',课题组_arr.length)
						console.log('测序引物_arr的长度',测序引物_arr.length)
						console.log('引物浓度_arr的长度',引物浓度_arr.length)
					}
				})
					
			//在测序样品根据课题组和测序引物降序排序获取板号
			result_客户名_arr=[]
			result_课题组_arr=[]
			result_引物浓度_arr=[]
			result_备注_arr=[]
			result_测序引物_arr=[]
			result_板号_arr=[]
			for(var i=0;i<测序引物_arr.length;i++){
				tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1667077638736&rows=20&page=1&sidx=seqs_plate&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_primer%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+测序引物_arr[i]+"%22%7D%2C%7B%22field%22%3A%22seqo_ketizu%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+课题组_arr[i]+"%22%7D%5D%7D"
				$.get(tijiao,
					function (data) {
						总个数=文本_取中间文本(data,'"totalrecords":"','"')
						if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
							console.log('总个数为0')
							tag=1
							return
						}else{
							result_备注_arr.push(文本_取中间文本_批量(data,'"remark":"','"')[0])
							result_客户名_arr.push(文本_取中间文本_批量(data,'"seqo_cust_name":"','"')[0])
							result_课题组_arr.push(文本_取中间文本_批量(data,'"seqo_ketizu":"','"')[0])
							result_测序引物_arr.push(文本_取中间文本_批量(data,'"seqs_primer":"','"')[0])
							result_引物浓度_arr.push(文本_取中间文本_批量(data,'"seqs_observe":"','"')[0])
							result_板号_arr.push(文本_取中间文本_批量(data,'"seqs_plate":"','"')[0])
						}
					})
			}
			//清空文本框内容
			if($('#textarea_shuju').length===1){
				$("#textarea_shuju").val("")
			}
			//给文本框放入结果数据
			for(var i=0;i<result_备注_arr.length;i++){
				shuju=result_测序引物_arr[i]+"  ("+result_板号_arr[i]+")  "+result_客户名_arr[i]+"  "+result_课题组_arr[i]     //+"  "+result_备注_arr[i]+"  "+result_引物浓度_arr[i]
				if($('#textarea_shuju').length===0){
					$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
				}
				$("#textarea_shuju").val($("#textarea_shuju").val()+shuju+"\n")
			}
			alert('ok')
		}
	}
}

//=========================模板生产  结束===========================//                  

//=========================反应生产  开始===========================//                  反应生产
function 找加测反应(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#button_jiace_no_baogaochongzuo').size()==0){
		toolbar.append('<a href="#"><button id="button_jiace_suoyou" onclick="return false">找加测反应</button></a>')
		toolbar.append('<a href="#"><button id="button_jiace_chunduiying" onclick="return false">找加测反应_纯对应</button></a>')
		toolbar.find('#button_jiace_suoyou').click(function(){
			公共('所有')
		})
		toolbar.find('#button_jiace_chunduiying').click(function(){
			公共('纯对应')
		})
		function  公共(类型){
			//搜索样品对应号包含YP，且 返回状态不等于 报告重做
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='seqs_plus_prod_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 样品对应号
			$('#searchForm').eq(0).find("option[value='cn']").eq(0).attr('selected','selected')  //改成包含
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('YP')
			$('#searchForm').eq(0).find("option[value='seqs_back']").eq(1).attr('selected','selected')  //把查询条件改成 样品对应号
			$('#searchForm').eq(0).find("option[value='ne']").eq(1).attr('selected','selected')  //改成不等于
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val('报告重做')
			if(类型=='纯对应'){
				//本来没有搜引物浓度的，把生成编号的value改成引物浓度的value
				$('#searchForm').eq(0).find("option[value='seqs_prod_id']").eq(2).val('seqs_observe')
				$('#searchForm').eq(0).find("option[value='seqs_observe']").eq(2).attr('selected','selected')  //把查询条件改成 引物浓度
				$('#searchForm').eq(0).find("option[value='cn']").eq(2).attr('selected','selected')  //改成包含
				$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(2).val('对应')
			}
			$("#AB").click()
		}
	}else{return false}
}


function 反应生产标颜色(){
	var html=$('iframe[src="/seq/SeqReaction.aspx"]').contents().find('body').eq(0)
	if(html.length==1){
		html.find('[aria-describedby=list_remark]').each(function(){
			//备注包含待测标颜色
			if($(this).text().indexOf('待测')!=-1){
				$(this).css('background','red') //.parent()
			}
			//备注包含长程序标颜色
			if($(this).text().indexOf('长程序')!=-1){
				$(this).css('background','orange') //.parent()
			}
		})
		html.find('[aria-describedby=list_seqs_observe]').each(function(){
			//引物浓度等于对应颜色
			if($(this).text()=='对应'){
				$(this).css('background','#AeEEe7') //.parent()
			}
		})
	}
}
function 同名引物(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	if(toolbar.find('#button_tongming_yinwu').size()==0){
		toolbar.append('<a href="#" id="id_tongming_yinwu"><button id="button_tongming_yinwu" onclick="return false">同名引物</button></a>')
	}else{return false}
	toolbar.find('#button_tongming_yinwu').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		var 课题组=sample_table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_ketizu]').text()  //查询课题组
		var 引物名称=sample_table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_undefined]').eq(1).attr('title')  //查询引物名称
		console.log(引物名称)
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqo_ketizu']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 课题组
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(课题组)
		$('#searchForm').eq(0).find("option[value='seqs_primer']").eq(1).attr('selected','selected')  //把找到的第一个查询条件改成 引物名称
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(引物名称)
		$("#AB").click()
	})
}
function 获取加测引物板号(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#button_jiace_yinwu_banhao').size()==0){
		toolbar.append('<a href="#" id="id_jiace_yinwu_banhao"><button id="button_jiace_yinwu_banhao" onclick="return false">获取加测引物板号</button></a>')
		toolbar.find('#button_jiace_yinwu_banhao').click(function(){
			//获取 包含YP  不包含报告重做的反应
			tijiao="/seq/ashx/SeqReactionHandler.ashx?_search=true&nd=1667031128516&rows=2000&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_plus_prod_id%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22YP%22%7D%2C%7B%22field%22%3A%22seqs_back%22%2C%22op%22%3A%22ne%22%2C%22data%22%3A%22%E6%8A%A5%E5%91%8A%E9%87%8D%E5%81%9A%22%7D%5D%7D"
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(tijiao,
				function (data) {
					总个数=文本_取中间文本(data,'"totalrecords":"','"')
					if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
						console.log('总个数为0')
						return
					}else{
						备注_arr=文本_取中间文本_批量(data,'"remark":"','"')
						客户名_arr=文本_取中间文本_批量(data,'"seqo_cust_name":"','"')
						课题组_arr=文本_取中间文本_批量(data,'"seqo_ketizu":"','"')
						测序引物_arr=文本_取中间文本_批量(data,'"seqs_primer":"','"')
						引物浓度_arr=文本_取中间文本_批量(data,'"seqs_observe":"','"')
						//数组去重
						记录需要删除的索引=[]
						数组长度=备注_arr.length
						for(var i=0;i<数组长度;i++){
							//如果备注有待测 或者 长程序  或 暂时不做
							if(备注_arr[i].indexOf('待测')!=-1 || 备注_arr[i].indexOf('长程序')!=-1  || 备注_arr[i].indexOf('暂时不做')!=-1){
								console.log(i,'待测')
								记录需要删除的索引.push(i)
								continue
							}
							// 如果引物浓度没有包含对应
							if(引物浓度_arr[i].indexOf('对应')==-1){
								记录需要删除的索引.push(i)
								continue
							}
						}
						// console.log(记录需要删除的索引)
						for(var i=记录需要删除的索引.length-1;i>=0;i--){
							console.log(i)
							console.log(备注_arr[记录需要删除的索引[i]],客户名_arr[记录需要删除的索引[i]],课题组_arr[记录需要删除的索引[i]],测序引物_arr[记录需要删除的索引[i]],引物浓度_arr[记录需要删除的索引[i]])
							
							备注_arr.splice (记录需要删除的索引[i],1)
							客户名_arr.splice (记录需要删除的索引[i],1)
							课题组_arr.splice (记录需要删除的索引[i],1)
							测序引物_arr.splice (记录需要删除的索引[i],1)
							引物浓度_arr.splice (记录需要删除的索引[i],1)
						}
						所有连接_arr=[]
						for (var i=0;i<客户名_arr.length;i++){
							所有连接_arr.push(备注_arr[i]+"&$"+客户名_arr[i]+"&$"+课题组_arr[i]+"&$"+测序引物_arr[i]+"&$"+引物浓度_arr[i])
						}
						所有连接_arr=quchong_arr(所有连接_arr)
						备注_arr=[]
						客户名_arr=[]
						课题组_arr=[]
						测序引物_arr=[]
						引物浓度_arr=[]
						for(var i=0;i<所有连接_arr.length;i++){
							备注_arr.push(所有连接_arr[i].split('&$')[0])
							客户名_arr.push(所有连接_arr[i].split('&$')[1])
							课题组_arr.push(所有连接_arr[i].split('&$')[2])
							测序引物_arr.push(所有连接_arr[i].split('&$')[3])
							引物浓度_arr.push(所有连接_arr[i].split('&$')[4])
						}
					}
				})
			// console.log(备注_arr,客户名_arr,课题组_arr,测序引物_arr,引物浓度_arr)
			
			//在测序样品根据课题组和测序引物降序排序获取板号
			result_客户名_arr=[]
			result_课题组_arr=[]
			result_引物浓度_arr=[]
			result_备注_arr=[]
			result_测序引物_arr=[]
			result_板号_arr=[]
			for(var i=0;i<测序引物_arr.length;i++){
				tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1667077638736&rows=20&page=1&sidx=seqs_plate&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_primer%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+测序引物_arr[i]+"%22%7D%2C%7B%22field%22%3A%22seqo_ketizu%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+课题组_arr[i]+"%22%7D%5D%7D"
				$.get(tijiao,
					function (data) {
						总个数=文本_取中间文本(data,'"totalrecords":"','"')
						if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
							console.log('总个数为0')
							tag=1
							return
						}else{
							result_备注_arr.push(文本_取中间文本_批量(data,'"remark":"','"')[0])
							result_客户名_arr.push(文本_取中间文本_批量(data,'"seqo_cust_name":"','"')[0])
							result_课题组_arr.push(文本_取中间文本_批量(data,'"seqo_ketizu":"','"')[0])
							result_测序引物_arr.push(文本_取中间文本_批量(data,'"seqs_primer":"','"')[0])
							result_引物浓度_arr.push(文本_取中间文本_批量(data,'"seqs_observe":"','"')[0])
							result_板号_arr.push(文本_取中间文本_批量(data,'"seqs_plate":"','"')[0])
						}
					})
			}
			//清空文本框内容
			if($('#textarea_shuju').length===1){
				$("#textarea_shuju").val("")
			}
			//给文本框放入结果数据
			for(var i=0;i<result_备注_arr.length;i++){
				shuju=result_测序引物_arr[i]+"  ("+result_板号_arr[i]+")  "+result_客户名_arr[i]+"  "+result_课题组_arr[i]      //+"  "+result_备注_arr[i]+"  "+result_引物浓度_arr[i]
				console.log(shuju)
				if($('#textarea_shuju').length===0){
					$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
				}
				$("#textarea_shuju").val($("#textarea_shuju").val()+shuju+"\n")
			}
			alert('ok')
		})
	}else{return false}
}
function 查询模板板号(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#button_mubanbanhao').size()==0){
		toolbar.append('<input type="text" id="text_mubanbanhao" placeholder="模板板号" size="10"/><a href="#"><button id="button_mubanbanhao" onclick="return false">查询模板板号</button></a>')
	}else{return false}
	//给文本框绑定回车键的函数
	toolbar.find('#text_mubanbanhao').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	toolbar.find('#button_mubanbanhao').click(function(){
		//把每页10改成每页500
		html.find('#pager_center').eq(0).find("option[value='10']").eq(0).val('500')
		模板板号_文本框=html.find('#text_mubanbanhao').eq(0).val()  
		if(模板板号_文本框==''){
			return false
		}
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
		$('#searchForm').eq(0).find("option[value='seqs_tempplate']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 模板板号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(模板板号_文本框)
		$("#AB").click()
		
	})
}
function 设置板号(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#button_banhao').size()==0){
		toolbar.append('<input type="text" id="text_banhao" placeholder="板号" size="10"/>')
	}else{return false}
}
function 设置板号_自动添加(){
	var html=$('iframe[src="/seq/SeqReaction.aspx"]').contents().find('body').eq(0)//反应生产页面
	板号=html.find('#text_banhao').eq(0).val()  
	$('#txt_seqs_plate').val(板号)
}
//=========================反应生产  结束===========================//                  



//=========================订单管理  开始===========================//                   订单管理


//订单管理和合成订单  vip下单 弹框页面
function  add_order(leixings){
	if(leixings==="hecheng"){
		var html=$('iframe[src="../bio/erp/primerSynthesis.html?mode=add"]').contents().find('body').eq(0)  //合成管理 iframe弹框页面
	}else if(leixings==='dingdan'){
		var html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('body').eq(0) //订单管理 iframe弹框页面
	}
	//添加订单的iframe弹框界面
	if(html.length===1){
		var form=html.find('#form').eq(0)
		if(form.hasClass('yijingyunxingyici')===false){
			form.addClass('yijingyunxingyici')
			//================开始--当table数据变化的时候（根据表格的板号的style属性变化判断），检查是否有空的引物=================
			// 观察器的配置（需要观察什么变动）
			var config = { attributes: true};  //, childList: true, subtree: true,characterData:true,characterDataOldValue:true,attributDataOldValue:true
			// 当观察到变动时执行的回调函数
			var 检查是否有空引物 = function(mutationRecoard, observer) {
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
				
			};
			// 创建一个观察器实例并传入回调函数
			var observer = new MutationObserver(检查是否有空引物);
			// 以上述配置开始观察目标节点
			dom=html.find("[class='ht_clone_top handsontable']").find('thead').find('th').eq(0).get(0)
			observer.observe(dom, config);
			//================结束--当table数据变化的时候（根据表格的板号的style属性变化判断），检查是否有空的引物=================
			
			
			if(leixings==="dingdan"){
				//点击 上传Excel按钮 运行 primer ()  primer_checkbox ();
				html.find('#upload-file').eq(0).click(function(){
					if(tags_primer_primerCheckBox===1){
						return false
					}
					zidong_primer()
					function zidong_primer(){
						var x=setTimeout(function (){
							primer();  
							primer_checkbox();
							var html_1=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('body').eq(0) //订单管理 iframe弹框页面
							if(html_1.length===0){
								tags_primer_primerCheckBox=0
								return false
							}else{
								//如果iframe弹框不存在 需要停止自动运行
								if($('[class="panel window"]').css('display')==="none"){
									tags_primer_primerCheckBox=0
									return false
								}else{
									tags_primer_primerCheckBox=1
									//回调函数 不要删
									zidong_primer()
								}
							}
						},2500);
					}
				})
			}
			//点击 选择客户的文本框，是每个客户显示在一行
			html.on('click','.select2-search__field',function(event){
				kehu_yihang(leixings);
			})
			html.on('click',function(event){
				// 把客户信息显示出来
				//kehu_showAll(leixings);
				//添加订单iframe页面 生产实验室 如果不是北京分公司，那么就显示一个颜色
				color_shengchan_fengongsi()
			})
		}
	}
}

//订单管理，VIP按钮放在最前面  绑定事件：如果点击VIP下单 load后运行 add_order()
function vip_top(leixings,html){  //把VIP下单按钮放在最前面
	if(leixings==="hecheng"){
		var html=$('iframe[src="/syn/syn_order.aspx"]').contents().find('body').eq(0)  //合成管理页面
	}else if(leixings==='dingdan'){
		var html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0) //订单管理页面
	}
	var vip=html.find('#a_addordervip').eq(0)
	var tianjia_anniu=html.find('#a_add').eq(0)
	if(vip.hasClass('judge_have')==false){
		vip.addClass('judge_have')
		var a_edit=html.find('#a_edit').eq(0)
		a_edit.before(vip)
		//点击 vip下单 触发事件
		vip.click(function(){
			//如果vip 下单弹框显示完全，则运行
			if(leixings==="hecheng"){
				var html_tankuang= $('iframe[src="../bio/erp/primerSynthesis.html?mode=add"]') //合成管理  弹框页面
			}else{
				var html_tankuang=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]')  //订单管理  弹框页面
			}
			html_tankuang.on('load',function(){
				add_order(leixings)
				//显示客户详细信息
				显示客户详细信息()
				function 显示客户详细信息(){
					var x=setTimeout(function (){
						kehu_showAll(leixings)
						//如果iframe弹框不存在 需要停止自动运行
						if($('[class="panel window"]').css('display')==="none"){
							return false
						}else{
							//回调函数 不要删
							显示客户详细信息()
						}
					},2000);
				}
			})
		})
	}
	
}



//添加订单iframe页面 生产实验室 如果不是北京分公司，那么就显示一个颜色
function color_shengchan_fengongsi(){
	var html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('body').eq(0) //订单管理 iframe弹框页面
	var value=html.find('#sys').eq(0).val()
	if(value!=='38' && value!==''){  //如果不是北京分公司
		html.find('#sys').eq(0).css('background-color','#8BEEE7')
	}else{
		html.find('#sys').eq(0).css('background-color','white')
	}
}
//业务员报表
function baobiao(){
	var html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0) //订单管理页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#baobiao_before').size()==0){
		toolbar.append('<button id="baobiao_before" onclick="return false">每日报表_之前</button><button id="baobiao_after" onclick="return false">每日报表_之后</button>')
	}else{return false}
	toolbar.find('#baobiao_before').click(function(){
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
	})
	toolbar.find('#baobiao_after').click(function(){
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
	})
}
//订单管理 如果生产公司不是北京分公司，则显示一个颜色
function beijingfengongsi(html){
	var html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0)//订单管理页面
	if(html.length==1 && html.find('[aria-describedby=list_seqo_order_state]').last().attr('title')!=='唯一'){
		html.find('[aria-describedby=list_seqo_order_state]').last().attr('title','唯一')
		html.find('#list').eq(0).find('[aria-describedby=list_seqo_product_company_name]').each(function(){
			if($(this).text()!="北京分公司"){
				$(this).attr('Bgcolor','#AeEEe7')
			}
		})
	}else{return false}	
}
//=========================订单管理  结束===========================//

//====================测序样品  开始===============================//                      测序样品 
	//   添加样品前缀 添加样品后缀 更改部分  整体更改样品名
function yangpin_add_edit(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	if(toolbar.find('#button_xiugai_yangpin').size()==0){
		toolbar.append('<a href="#" id="id_xiugai_yangpin" style="position:relative;z-index:2;"><button id="button_xiugai_yangpin" onclick="return false">修改样品名称▽</button><div id="div_xiugai_yangpin" style="position:absolute;width:250px;height:360px;border:1px solid orange;background-color:	#1B211D;display:none"></div></a>')
		div_show_yincang=toolbar.find('#div_xiugai_yangpin').eq(0)
		div_show_yincang.append('<input type="text" id="text_qianzhui" placeholder="样品前缀" size="10"/><button id="button_qianzhui" onclick="return false">添加样品前缀</button>')
		div_show_yincang.append('<a href="#" id="id_qianzhui"><input type="text" id="text_houzhui"  placeholder="样品后缀" size="10"/><button id="button_houzhui" onclick="return false">添加样品后缀</button></a>')
		div_show_yincang.append('<a href="#" id="id_genggai"><input type="text" id="text_gaiqian"     placeholder="需要改的部分" size="15"/><input type="text" id="text_gaihou" placeholder="改成的部分" size="10"/><button id="button_genggai" onclick="return false">更改部分样品名称</button></a>')
		div_show_yincang.append('<div style="width:180px" id="id_zhengti_gengxin"><textarea id="text_zhengti_gengxin" rows="15" cols="16" placeholder="一行一个样品名，顺序和生产编号相反，也就是第一行更新的是生产编号最小的样品名，整体替换" size="10"></textarea><button id="button_zhengti_gengxin" onclick="return false">整体更新样品名</button></div>')
	}else{return false}
	//给文本框绑定回车键的函数
	toolbar.find('#text_houzhui').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	toolbar.find('#text_qianzhui').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	toolbar.find('#text_gaiqian').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	toolbar.find('#text_gaihou').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	//点击修改样品按钮 显示或者隐藏DIV
	toolbar.find('#button_xiugai_yangpin').click(function(){
		div_show_yincang=toolbar.find('#div_xiugai_yangpin').eq(0)
		if(div_show_yincang.css('display')==="none"){
			div_show_yincang.css('display','block')
			toolbar.find('#button_xiugai_yangpin').eq(0).text('修改样品名称△')
			toolbar.find('#button_xiugai_yangpin').eq(0).css('background-color','#B7A0AA')
		}else{
			div_show_yincang.css('display','none')
			toolbar.find('#button_xiugai_yangpin').eq(0).text('修改样品名称▽')
			toolbar.find('#button_xiugai_yangpin').eq(0).css('background-color','')
			//把已填的数据清除
			toolbar.find('#div_xiugai_yangpin').eq(0).find(":input").val('')
		}
	})
	//点击添加样品后缀按钮执行如下函数
	toolbar.find('#button_houzhui').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		if(html.find('#text_houzhui').eq(0).val()===""){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		selecteds.each(function(){
			ids=$(this).find('[aria-describedby=list_undefined]').text()  //获取生产编号
			product_number=$(this).find('[aria-describedby=list_seqs_sam_num]').text()  //获取最开始的样品编号
			new_product_number=product_number+toolbar.find('#text_houzhui').eq(0).val()  //获取最新的样品编号
			//post请求 更改样品编号
			$.post("/seq/ashx/SeqSampleHandler.ashx",
				{action:"piliang_edit",ids:ids.slice(2),newValue:"seqs_sam_num="+new_product_number,rules_txt:"样品编号"},
				function (data,status) {console.log("成功" + data);});
		})
		html.find('.ui-pg-input').eq(0).focus()
		alert('修改了 '+sample_table.find('tbody').find("[aria-selected='true']").size()+' 条反应的样品名称，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
		return false
	})
	//点击添加样品前缀按钮执行如下函数
	toolbar.find('#button_qianzhui').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		if(html.find('#text_qianzhui').eq(0).val()===""){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		selecteds.each(function(){
			ids=$(this).find('[aria-describedby=list_undefined]').text()  //获取生产编号
			product_number=$(this).find('[aria-describedby=list_seqs_sam_num]').text()  //获取最开始的样品编号
			new_product_number=toolbar.find('#text_qianzhui').eq(0).val()+product_number  //获取最新的样品编号
			//post请求 更改样品编号
			$.post("/seq/ashx/SeqSampleHandler.ashx",
				{action:"piliang_edit",ids:ids.slice(2),newValue:"seqs_sam_num="+new_product_number,rules_txt:"样品编号"},
				function (data,status) {console.log("成功" + data);});
		})
		html.find('.ui-pg-input').eq(0).focus()
		alert('修改了 '+sample_table.find('tbody').find("[aria-selected='true']").size()+' 条反应的样品名称，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
		return false
	})
	//点击 更改部分  执行如下函数
	toolbar.find('#button_genggai').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		if(html.find('#text_gaiqian').eq(0).val()===""){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		var is_goon=true
		selecteds.each(function(){
			ids=$(this).find('[aria-describedby=list_undefined]').text()  //获取生产编号
			product_number=$(this).find('[aria-describedby=list_seqs_sam_num]').text()  //获取最开始的样品编号
			old_part=toolbar.find('#text_gaiqian').eq(0).val()  //获取需要更改的部分名称
			new_part=toolbar.find('#text_gaihou').eq(0).val()  //获取需要更改的部分名称
			num=product_number.split(old_part).length-1  //存在多少遍要更改的部分,只有1遍才可以
			if (num!=1){is_goon=false;  alert('只有每个样品都能匹配一次,才能修改');return false}
		})
		if (is_goon==true){
			selecteds.each(function(){
				ids=$(this).find('[aria-describedby=list_undefined]').text()  //获取生产编号
				product_number=$(this).find('[aria-describedby=list_seqs_sam_num]').text()  //获取最开始的样品编号
				old_part=toolbar.find('#text_gaiqian').eq(0).val()  //获取需要更改的部分名称
				new_part=toolbar.find('#text_gaihou').eq(0).val()  //获取需要更改的部分名称
				var reg = new RegExp(old_part,"g");
				new_product_number=product_number.replace(reg,new_part);  //改成最新的样品编号
				//post请求 更改样品编号
				$.post("/seq/ashx/SeqSampleHandler.ashx",
					{action:"piliang_edit",ids:ids.slice(2),newValue:"seqs_sam_num="+new_product_number,rules_txt:"样品编号"},
					function (data,status) {console.log("成功" + data);});
			})
			html.find('.ui-pg-input').eq(0).focus()
			alert('修改了 '+sample_table.find('tbody').find("[aria-selected='true']").size()+' 条反应的样品名称，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
			return false
		}
	})
	//点击 整体更新样品名 执行如下函数
	toolbar.find('#button_zhengti_gengxin').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		if(html.find('#text_zhengti_gengxin').eq(0).val()===""){return false}//如果没有输入数据 那么退出
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")  //获取所有的行
		arr_zhengti_fenge=html.find('#text_zhengti_gengxin').eq(0).val().split('\n')
		for(var i=0;i<arr_zhengti_fenge.length;i++){
			if(arr_zhengti_fenge[i]===""){
				alert('有数据为空的行，需要删除')
				return false
			}
		}
		if(selecteds.size()!==arr_zhengti_fenge.length){
			alert('选择的行数和文本框的个数不一致，需要检查一下')
			return false
		}
		//倒着更改样品名
		$(selecteds.toArray().reverse()).each(function(index){
			ids=$(this).find('[aria-describedby=list_undefined]').text()  //获取生产编号
			new_product_number=arr_zhengti_fenge[index]  //获取最新的样品编号
			//post请求 更改样品编号
			$.post("/seq/ashx/SeqSampleHandler.ashx",
				{action:"piliang_edit",ids:ids.slice(2),newValue:"seqs_sam_num="+new_product_number,rules_txt:"样品编号"},
				function (data,status) {console.log("成功" + data);});
		})
		html.find('.ui-pg-input').eq(0).focus()
		alert('修改了 '+sample_table.find('tbody').find("[aria-selected='true']").size()+' 条反应的样品名称，光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
		return false
	})
}
//显示选择行所属的订单号
function show_dingdanhao(){
	//点击 显示选择行所属的订单号 按钮执行如下函数
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
		if(html.find('#id_show_order').size()==0){
			toolbar.append('<a href="#" id="id_show_order"><button id="button_show_order" onclick="return false">显示订单号</button></a>')
		}else{return false}
		toolbar.find('#button_show_order').click(function(){
			if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
			var dingdanhao=sample_table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_order_id]').text()  //查询订单号
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
			$('#searchForm').eq(0).find("option[value='seqo_order_id']").attr('selected','selected')  //把找到的第一个查询条件改成 订单号
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(dingdanhao)
			$("#AB").click()
		})
	}
}

//显示选择行的样品名称
function show_yangpinmingcheng(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
		if(html.find('#id_show_yp').size()==0){
			toolbar.append('<a href="#" id="id_show_yp"><button id="button_show_yp" onclick="return false">显示样品名称</button></a>')
		}else{return false}
		//显示选择行的样品名称  查询这个样品在这个客户名下所有的记录
		toolbar.find('#button_show_yp').click(function(){
			if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
			kehu_id=sample_table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqo_cust_id]').text()  //查询id
			yp_name=sample_table.find('tbody').find("[aria-selected='true']").eq(0).find('[aria-describedby=list_seqs_sam_num]').text()  //查询样品名称
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //点击 查询按钮
			$('#searchForm').eq(0).find("option[value='seqo_cust_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户ID
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(kehu_id)
			$('#searchForm').eq(0).find("option[value='seqs_sam_num']").eq(1).attr('selected','selected')  //把找到的第二个查询条件改成 样品编号
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val(yp_name)
			$("#AB").click()
		})
	}
}
//批量添加反应 
function piliang_add(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if(html.find('#button_piliang').size()==0){
			toolbar.append('<a href="#" id="id_piliang" style="position:relative;z-index:2;"><button id="button_piliang" onclick="return false"><font color="red">批量添加反应▽</font></button><div id="div_piliang" style="position:absolute;left:-250px;height:100px;width:500px;height:100px;border:1px solid orange;background-color:	#1B211D;display:none"></div></a>')
			div_piliang=toolbar.find('#div_piliang').eq(0)
			div_piliang.append('<input type="text" id="text_piliang_duotiaodai" placeholder="添加多条带，默认1" size="10" value="1"/><button id="button_duotiaodai" onclick="return false">批量添加多条带,默认双条带(带引物)</button><br/><br/>')
			div_piliang.append('<input type="text" id="text_piliang_tongming" placeholder="添加同名反应" size="10" value="1"/><button id="button_tongming" onclick="return false">批量添加同名反应，默认1(不带引物,一个名字只能选一次)</button>')			
		}else{return false}
		//给文本框绑定回车键的函数
		toolbar.find('#text_piliang_duotiaodai').eq(0).keypress(function(event){
			if(event.keyCode ==13){
				return false
			}
			//如果输入的字符不是数字 那么不允许输入
			if(event.keyCode !==48 && event.keyCode !==49 && event.keyCode !==50 && event.keyCode !==51 && event.keyCode !==52 && event.keyCode !==53 && event.keyCode !==54 && event.keyCode !==55 && event.keyCode !==56 && event.keyCode !==57 ){
				return false
			}
		});
		toolbar.find('#text_piliang_tongming').eq(0).keypress(function(event){
			if(event.keyCode ==13){
				return false
			}
			//如果输入的字符不是数字 那么不允许输入
			if(event.keyCode !==48 && event.keyCode !==49 && event.keyCode !==50 && event.keyCode !==51 && event.keyCode !==52 && event.keyCode !==53 && event.keyCode !==54 && event.keyCode !==55 && event.keyCode !==56 && event.keyCode !==57 ){
				return false
			}
		});
		//点击修改样品按钮 显示或者隐藏DIV
		toolbar.find('#button_piliang').click(function(){
			div_show_yincang=toolbar.find('#div_piliang').eq(0)
			if(div_show_yincang.css('display')==="none"){
				div_show_yincang.css('display','block')
				toolbar.find('#button_piliang').eq(0).text('批量添加反应△')
				toolbar.find('#button_piliang').eq(0).css('color','red')
				toolbar.find('#button_piliang').eq(0).css('background-color','#B7A0AA')
			}else{
				div_show_yincang.css('display','none')
				toolbar.find('#button_piliang').eq(0).text('批量添加反应▽')
				toolbar.find('#button_piliang').eq(0).css('color','red')
				toolbar.find('#button_piliang').eq(0).css('background-color','')
				toolbar.find('#div_piliang').eq(0).find(":input").val('1')
			}
		})
		//点击多条带批量添加按钮
		toolbar.find('#button_duotiaodai').click(function(){
			var geshu=toolbar.find('#text_piliang_duotiaodai').eq(0).val()
			if(geshu===""){geshu="1"}
			var tag=0
			for(var i=1;i<=20;i++){
				if(geshu===i.toString()){
					tag=1
				}
			}
			if(tag===1){ //说明输入的符合要求
				piliang_duotiaodai(parseInt(geshu))
			}else{
				alert('输入的不符合要求，需要输入1到20')
			}
		})
		//点击批量添加同名反应按钮
		toolbar.find('#button_tongming').click(function(){
			var geshu=toolbar.find('#text_piliang_tongming').eq(0).val()
			if(geshu===""){geshu="1"}
			var tag=0
			for(var i=1;i<=20;i++){
				if(geshu===i.toString()){
					tag=1
				}
			}
			if(tag===1){ //说明输入的符合要求
				piliang_tongming(parseInt(geshu))
			}else{
				alert('输入的不符合要求，需要输入1到20')
			}
		})
	}
}
//加测反应
function jiace(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
		if(html.find('#text_jiace').size()==0){
			toolbar.append('<a href="#" id="id_jiace"><input type="text" id="text_jiace"   placeholder="需要留几个空行，默认1个" size="20"/><button id="button_jiace" onclick="return false"><font color="red">加测</font></button></a>')
		}else{return false}
		//加测反应    点击 加测 执行如下函数
		toolbar.find('#button_jiace').click(function(){
			jiace_gonggong('jiace');
		})
		toolbar.find('#text_jiace').eq(0).keypress(function(event){
			if(event.keyCode ==13){
				return false
			}
		});
	}
}
//加测的函数实现
function jiace_gonggong(what){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
	selecteds=is_one_order(html)
	if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
		return false
	}
	yp_all_array=[]  //生产编号
	old_yp_all_array=[]  //也是存的生产编号，然后对上面那个排序，和这个进行比较，不一样，就退出
	ypdyh_all_array=[]  //样品对应号
	ypmc_all_array=[] //样品名称
	yplx_all_array=[]  //样品类型
	zaiti_array=[]	//载体
	pianduan_array=[]  //片段
	kangshengsu_array=[]  //抗生素
	beizhu_array=[]  //备注
	is_cetong_array=[]  //是否测通
	
	$(selecteds.toArray().reverse()).each(function(){  //倒序把生产编号放进数组
			yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
			old_yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
	})
	yp_all_array.sort()  //对 生产编号排序，如果和 old_yp_all_array的顺序一样，那么继续，如果不一样，那么退出
	for (var j=0;j<old_yp_all_array.length;j++){
		if(old_yp_all_array[j]!=yp_all_array[j]){
			alert('生产编号需要降序排序')
			return false;	
		}
	}	
	$(selecteds.toArray().reverse()).each(function(){  //倒序把样品对应号放进数组
			ypdyh_name=$(this).find('[aria-describedby=list_seqs_plus_prod_id]').html()
			if(ypdyh_name=="" || ypdyh_name=="&nbsp;"){
				ypdyh_all_array.push($(this).find('[aria-describedby=list_undefined]').text())//如果没有样品对应号，则把生产编号放进数组
			}else{ypdyh_all_array.push(ypdyh_name)}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把样品名称放进数组
		ypmc_all_array.push($(this).find('[aria-describedby=list_seqs_sam_num]').text())
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把样品类型放进数组
		yplx_name=$(this).find('[aria-describedby=list_seqs_sam_type]').text()
		if(yplx_name=="质粒" ||   yplx_name.search("菌")!= -1){
			yplx_all_array.push("质粒")
		}else if( yplx_name.search("胶")!= -1  || yplx_name=="PCR已纯化" || yplx_name=="PCR单一"){
			yplx_all_array.push("PCR已纯化")
		}else{yplx_all_array.push("质粒")}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把载体放进数组
		zaiti_name=$(this).find('[aria-describedby=list_seqs_carry]').html()
		if(zaiti_name=="" || zaiti_name=="&nbsp;"){  //如果载体为空 或者 空格
			zaiti_array.push("")
		}else{zaiti_array.push(zaiti_name)}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把片段放进数组
		pianduan_name=$(this).find('[aria-describedby=list_seqs_fragment_size]').html()
		if(pianduan_name=="" || pianduan_name=="&nbsp;"){  //如果片段为空 或者 空
			pianduan_array.push("")
		}else{pianduan_array.push(pianduan_name)}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把抗生素放进数组
		kangshengsu_name=$(this).find('[aria-describedby=list_seqs_ant_type]').html()
		if(kangshengsu_name=="" || kangshengsu_name=="&nbsp;"){  //如果为空 或者 空格
			kangshengsu_array.push("")
		}else{kangshengsu_array.push(kangshengsu_name)}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把备注放进数组
		beizhu_name=$(this).find('[aria-describedby=list_remark]').html()
		if(beizhu_name=="" || beizhu_name=="&nbsp;"){
			beizhu_array.push("")
		}else{beizhu_array.push(beizhu_name)}
	})
	$(selecteds.toArray().reverse()).each(function(){  //倒序把是否测通放进数组
		cetong_is=$(this).find('[aria-describedby=list_seqs_istest_pass]').text()
		if(cetong_is=="是" || cetong_is=="true"){
			is_cetong_array.push(true)
		}else{is_cetong_array.push(false)}
	})

	order_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
	kehu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_id]').eq(0).text()  //查找客户ID
	kehu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_cust_name]').eq(0).text()  //查找客户姓名
	ketizu_ID=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu_id]').eq(0).text()  //查找课题组ID
	ketizu_name=selecteds.eq(0).find('[aria-describedby=list_seqo_ketizu]').eq(0).text()  //查找课题组姓名

	company_ID=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_id]').eq(0).text()  // 公司ID 比如昌平的是38
	company_name=selecteds.eq(0).find('[aria-describedby=list_seqs_product_company_name]').eq(0).text()  // 生产分公司名字 比如北京分公司
	if(what=="jiace"){
		riqi=getday_y_n('---')
		jihang=toolbar.find("#text_jiace").eq(0).val()  //确定加测几行，
		if(jihang=="" || jihang==" "){jihang="1"}
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
			hou=',"seqs_vip_number":'+(index+1)+',"seqs_vip_sam_num":"'+ypmc_all_array[index]+'","seqs_vip_sam_kind":"'+yplx_all_array[index]+'","seqs_vip_fragment_size":"'+pianduan_array[index]+'","seqs_vip_seqs_carry":"'+zaiti_array[index]+'","seqs_vip_ant_type":"'+kangshengsu_array[index]+'","seqs_vip_seqs_primer":"","seqs_vip_seqsprime_kind":"","seqs_vip_seqs_primer_id":"","seqs_vip_spec_require":"","seqs_vip_istest_pass":'+is_cetong_array[index]+',"seqs_vip_return_sample":false,"seqs_vip_sample_remark":"'+beizhu_array[index]+'","seqs_plus_prod_id":"'+ypdyh_all_array[index]+'"},'
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
}
//批量添加多条带
function piliang_duotiaodai(nums){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
	selecteds=is_one_order(html)
	if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
		return false
	}
	yp_all_array=[]  //生产编号
	old_yp_all_array=[]  //也是存的生产编号，然后对上面那个排序，和这个进行比较，不一样，就退出
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
	$(selecteds.toArray().reverse()).each(function(){  //倒序把生产编号放进数组
		yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
		old_yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
	})
	yp_all_array.sort()  //对 生产编号排序，如果和 old_yp_all_array的顺序一样，那么继续，如果不一样，那么退出
	for (var j=0;j<old_yp_all_array.length;j++){
		if(old_yp_all_array[j]!=yp_all_array[j]){
			alert('生产编号需要降序排序')
			return false;	
		}
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
		for(var j=1;j<=nums;j++){  // 多条带 这是为了方便样品的多条带加上后缀
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
	
	var r = confirm("确定要给"+kehu_name+"添加"+(nums+1).toString()+"条带吗?总共 "+(selecteds.size()*nums).toString()+" 条反应");
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
function piliang_tongming(nums){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
	selecteds=is_one_order(html)
	if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
		return false
	}
	yp_all_array=[]  //生产编号
	old_yp_all_array=[]  //也是存的生产编号，然后对上面那个排序，和这个进行比较，不一样，就退出
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
		
	$(selecteds.toArray().reverse()).each(function(){  //倒序把生产编号放进数组
		yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
		old_yp_all_array.push($(this).find('[aria-describedby=list_undefined]').text())
	})
	yp_all_array.sort()  //对 生产编号排序，如果和 old_yp_all_array的顺序一样，那么继续，如果不一样，那么退出
	for (var j=0;j<old_yp_all_array.length;j++){
		if(old_yp_all_array[j]!=yp_all_array[j]){
			alert('生产编号需要降序排序')
			return false;	
		}
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
		for(var j=1;j<=nums;j++){  // 多条带 这是为了方便样品的多条带加上后缀
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
	
	var r = confirm("确定要给"+kehu_name+"添加"+(selecteds.size()*nums).toString()+"条同名反应吗?");
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
//公共函数 判断选择的是否是同一个订单号
function is_one_order(html){
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//如果没有选择行则退出
	if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
	panduan=0
	selecteds=sample_table.find('tbody').find("[aria-selected='true']")
	selecteds.find('[aria-describedby=list_seqo_order_id]').each(function(){
		if(selecteds.find('[aria-describedby=list_seqo_order_id]').eq(0).text()!=$(this).text()){
			alert('需要选择同一个订单号！')
			panduan=1
		}
	})
	if(panduan==1){  //如果 不是同一个订单号，就退出
		return false;
	}else{
		return selecteds;
	}
}
//	条件查询 客户姓名和引物
function yangpin_chaxun(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)  //测序样品页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if(html.find('.text_tiaojian_key').size()==0){
			toolbar.append('<a href="#"><input type="text" disabled class="text_tiaojian_key"  value="客户姓名" size="5"/><input type="text" class="text_tiaojian_value" placeholder="条件value" size="10"/></a>')
			toolbar.append('<a href="#"><input type="text" disabled class="text_tiaojian_key"  value="测序引物" size="5"/><input type="text" class="text_tiaojian_value" placeholder="空格区分" size="10"/></a>')
			toolbar.append('<a href="#"><button id="button_chaxun" onclick="return false">查询</button><button id="button_qingkong" onclick="return false" style="display:none">清空value</button></a>')  //隐藏清空按钮 暂时没用
		}else{return false}
		toolbar.find('.text_tiaojian_value').keypress(function(event){
			if(event.keyCode ==13){
				//如果客户或者引物 至少有一个是有数据，那么才能点击
				if(toolbar.find('.text_tiaojian_value').eq(0).val().trim()!=="" || toolbar.find('.text_tiaojian_value').eq(1).val().trim()!==""){
					toolbar.find('#button_chaxun').eq(0).click()
				}
				return false
			}
		});
		html.find('#button_chaxun').eq(0).click(function(){
			//获取 测序引物按钮value值
			var yinwu_val=toolbar.find('.text_tiaojian_value').eq(1).val()
			if(yinwu_val!==""){
				yinwu_val=yinwu_val.replace(/^\s*|\s*$/g,"");//去除左右两边空格
				for(var i=1;i<=10;i++){
					yinwu_val=yinwu_val.replace(/  /g," ");//两个空格替换成一个空格 多运行几遍
				}
				var yinwu_arr=yinwu_val.split(" "); //把测序引物 按照 空管split成数组
			}else{
				var yinwu_arr=new Array();//下面有用到 yinwu_arr 数组 所以新建一个
			}
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='seqo_cust_name']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户姓名
			for(var i=1;i<=yinwu_arr.length;i++){
				$('#searchForm').eq(0).find("option[value='seqs_primer']").eq(i).attr('selected','selected')  //测序引物
			}
			//查询方式前14个变成包含
			$('.searchOper:lt(14)').find("option[value='cn']").attr('selected','selected')  //测序引物
			var cha_xingming=html.find('.text_tiaojian_value').eq(0).val().trim()
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(cha_xingming)
			for(var i=1;i<=yinwu_arr.length;i++){
				$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(i).val(yinwu_arr[i-1])
			}
			$("#AB").click()
		})
		html.find('#button_qingkong').eq(0).click(function(){
			toolbar.find('.text_tiaojian_value').eq(0).val('')
			toolbar.find('.text_tiaojian_value').eq(1).val('')
		})
	}
}


//点击批量编辑 批量编辑测序引物 按钮  如果需要改变引物，那么需要跟反应组说一下（反应生产 模板成功等）
function genggai_yinwu_tixing(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	selecteds=table.find('tbody').find("[aria-selected='true']")
	if(html.length==1){
		tag=0
		selecteds.find('[aria-describedby=list_seqs_process]').each(function(){
			if($(this).text()=="反应生产" ||  $(this).text()=="模板失败" ||  $(this).text()=="停止反应" ||  $(this).text()=="模板成功"){
				tag=1
			}
		})
		if(tag===1){
			yinwu_html=$('#iframeUpload').contents().find('body').eq(0) //如果找到 说明找到了 批量更改测序引物界面
			if(yinwu_html.length===1){
				setTimeout(function(){
					yinwu_html=$('#iframeUpload').contents().find('body').eq(0) //这一行不能删，要不是定位不到  
					con="<span style='font-size:20px;color:blue'>改的引物如果有反应生产或者模板成功的需要跟反应组说</span>" 
					yinwu_html.find('#txt_seqo_urgen2').parent().append(con)
				},1000)
				
			}
		}
	}
}
//点击 批量添加 按钮 如果选中的行有 待测 和(菌P 或者 菌p） 则 提示
function jun_p_daice(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	selecteds=table.find('tbody').find("[aria-selected='true']")
	tag=0
	if(selecteds.size()>0){
		//备注如果包含菌P 那么在去掉待测的时候要跟反应组说一下 必须要说
		selecteds.each(function(){
			if(($(this).text().indexOf('菌P')!==-1 || $(this).text().indexOf('菌p')!==-1) && $(this).text().indexOf('待测')!==-1) {//说明找到了菌P两个字 且包含待测两个字
				tag=1
			}
		})
		if(tag===1){
			$('#paliang_edit_Form').find('tbody').find('td').last().append('<span style="position:absolute;top:400px;left:273px;color:red;font-size:13px" id="jun_p"> 如果菌P的样品要把待测去掉 那么需要跟反应组说下</span>')
		}else{
			$('#paliang_edit_Form').find('#jun_p').remove()
		}
	}
}

//其他 把不常用的功能放在这里
function qita(){
	var html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	if(toolbar.find('#button_qita').size()==0){
		toolbar.append('<a href="#" id="id_qita" style="position:relative;z-index:1;"><button id="button_qita" onclick="return false">其他▽</button><div id="div_qita" style="position:absolute;left:-150px;width:280px;height:120px;border:1px solid orange;background-color:	#1B211D;display:none"></div></a>')
		div_qita=toolbar.find('#div_qita').eq(0)
		if(当前用户名==="申高天"){
			div_qita.append('<a href="#" id="id_add_mubanbanhao"><input type="text" id="text_add_mubanbanhao"     placeholder="模板板号" size="10"/><button id="button_add_mubanbanhao" onclick="return false"><font color="blue">添加模板板号</font></button></a><br/>')
			
		}
		div_qita.append('<a href="#" id="id_beizhu_genggai"><input type="text" id="text_beizhu_gaiqian"     placeholder="需要改的部分" size="10"/><input type="text" id="text_beizhu_gaihou" placeholder="改成的部分" size="10"/><button id="button_beizhu_genggai" onclick="return false">更改备注</button></a><br/>')
		if(当前用户名==="申高天"){
			div_qita.append('<a href="#"><button id="button_tiaozhuandao_zibeiyinwu" onclick="return false"><font color="blue">跳转到自备引物</font></button></a><br/>')
			//div_qita.append('<a href="#" id="id_guopeng"><button id="button_guopeng" onclick="return false"><font color="blue">郭鹏</font></button></a><br/>')
			div_qita.append('<a href="#" id="id_tiqushuju"><button id="button_tiqushuju" onclick="return false"><font color="blue">提取数据</font></button></a>')
			div_qita.append('<a href="#" id="id_qingchushuju"><button id="button_qingchushuju" onclick="return false"><font color="blue">清除数据</font></button></a><br/>')
		}
		
	}else{return false}
	//点击修改样品按钮 显示或者隐藏DIV
	toolbar.find('#button_qita').click(function(){
		div_qita=toolbar.find('#div_qita').eq(0)
		if(div_qita.css('display')==="none"){
			div_qita.css('display','block')
			toolbar.find('#button_qita').eq(0).text('其他△')
			toolbar.find('#button_qita').eq(0).css('background-color','#B7A0AA')
		}else{
			div_qita.css('display','none')
			toolbar.find('#button_qita').eq(0).text('其他▽')
			toolbar.find('#button_qita').eq(0).css('background-color','')
			//把已填的数据清除
			toolbar.find('#div_qita').eq(0).find(":input").val('')
		}
	})
	//根据选择的行，跳转到自备引物页面
	toolbar.find('#button_tiaozhuandao_zibeiyinwu').click(function(){
		if(html.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		//如果 自备引物 页面是已经打开的
		if($('#tabs').find('li:contains(自备引物)').size()===1){
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
			console.log(ids_shuzu)
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
			$("#AB").click()
			$('#tabs').find('li:contains(自备引物)').click()
		}
	})
	//搜索客户=郭鹏
	toolbar.find('#button_guopeng').click(function(){
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='seqo_cust_name']").attr('selected','selected')  //把找到的第一个查询条件改成 客户名
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('郭鹏')
		$("#AB").click()
	})
	//-----------------模板板号 开始---------------------//
	//模板板号 文本框按回车键不管用
	toolbar.find('#text_add_mubanbanhao').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	//添加模板板号
	toolbar.find('#button_add_mubanbanhao').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		var r = confirm("确定要给这 "+selecteds.size()+" 条添加模板板号吗？");
		if (r == false) {
			return false;
		} 
		wenben=toolbar.find('#text_add_mubanbanhao').eq(0).val()
		var tag=1
		if(当前用户名!=="申高天"){
			selecteds.each(function(){
				//如果模板板号不为-1或者空  那么返回
				banhao=$(this).find('[aria-describedby=list_seqs_tempplate]').eq(0).text()
				if(banhao!=="-1" && banhao!==""){
					tag=0
					alert('所有之前的板号必须为-1或者为空才能编辑')
					return false
				}
			})
		}
		if(tag===0){return false}
		selecteds.each(function(){
			$(this).click()
			if($(this).attr("aria-selected")=="false"){
				$(this).click()
			}
			if($(this).attr("aria-selected")=="true"){
				toolbar.find("[class='l-btn-text icon-edit']").eq(0).click();
				$('#txt_seqs_tempplate').eq(0).val(wenben)
				$("#AB").click()
			}
		})
	})
	//-----------------模板板号 结束---------------------//
	//-----------------更改备注  开始-------------------------//
	//给更改备注文本框绑定回车键的函数
	toolbar.find('#text_beizhu_gaiqian').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	//给更改备注文本框绑定回车键的函数
	toolbar.find('#text_beizhu_gaihou').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	//单击  更改备注
	toolbar.find('#button_beizhu_genggai').eq(0).click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		beizhu_xiugaiqian=toolbar.find('#text_beizhu_gaiqian').eq(0).val()
		beizhu_xiugaihou=toolbar.find('#text_beizhu_gaihou').eq(0).val()
		if(beizhu_xiugaiqian===""){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
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
	});
	//双击  清空备注
	toolbar.find('#button_beizhu_genggai').eq(0).dblclick(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
		if(beizhu_xiugaiqian==="" && beizhu_xiugaihou===""){
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
	})
	//-----------------更改备注  结束-------------------------//
	//-----------------提取数据 清除数据  开始-------------------------//
	 //提取数据
	toolbar.find('#button_tiqushuju').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false} 
		biaoti='生产编号&订单号&客户ID&客户姓名&客户地址&课题组&课题组ID&样品对应号&样品编号&引物位置&测序引物&引物浓度&样品类型&载体&抗生素&片段大小&是否测通&原浓度&模板板号&模板孔号&备注&添加时间&生产分公司'
		var shuju=""
		sample_table.find('tbody').find("[aria-selected='true']").each(function(){
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
		//点击表格，则选择所有内容
		if($('#textarea_shuju').length===0){
			$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_biaoti" style="position:absolute;left:400px;" rows="1" cols="400"></textarea>')
			$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_shuju" style="position:absolute;left:400px;top:20px" rows="2" cols="400"></textarea>');
		}
		$("#textarea_biaoti").val(biaoti)
		$("#textarea_shuju").val($("#textarea_shuju").val()+shuju)
	})
	//清除数据
	toolbar.find('#button_qingchushuju').click(function(){
		if($('#textarea_shuju').length!==0){
			$("#textarea_biaoti").remove()
			$("#textarea_shuju").remove()
		}
	})
	//-----------------提取数据 清除数据  结束-------------------------//
}

function 查询每日返样个数(html){
	var toolbar=html.find('.toolbar').eq(0)
	if(toolbar.find('#button_fanhuan_geshu').size()==0){//如果是第一次则运行下面代码
		toolbar.append('<input type="date" id="shijian_fanhuan">')  //添加时间
		toolbar.find("#shijian_fanhuan").val(getday_y_n("zuori---"))//设置默认时间为昨天
		toolbar.append('<button  id="button_fanhuan_geshu" onclick="return false">统计每日返还的类型个数</button>')  //添加按钮
		toolbar.append('<input type="text" id="result_fanhuan" size="10"> ')  //结果显示
	}else{return false}
	toolbar.find('#button_fanhuan_geshu').eq(0).click(function(){
		//清空结果文本框
		toolbar.find('#result_fanhuan').val("")
		var 时间=toolbar.find("#shijian_fanhuan").val()
		//获取前几天的时间，组成数组
		日期_arr=getday_old(时间,0)
		console.log(日期_arr)
		时间=时间.replace(/-/g,"")
		console.log(时间)
		tag=0
		生产编号_arr_all=[]
		订单号_arr_all=[]
		样品编号_arr_all=[]
		样品对应号_arr_all=[]
		for(var i=0;i<日期_arr.length;i++){
			if (tag==1){
				break
			}
			//获取那一天包含‘已返’，北京分公司，时间的所有已返数据
			tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1665560740546&rows=20&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22remark%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E5%B7%B2%E8%BF%94%22%7D%2C%7B%22field%22%3A%22seqs_add_time%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+日期_arr[i]+"%22%7D%2C%7B%22field%22%3A%22seqs_product_company_name%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%8C%97%E4%BA%AC%E5%88%86%E5%85%AC%E5%8F%B8%22%7D%5D%7D"
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(tijiao,
				function (data) {
					总个数=文本_取中间文本(data,'"totalrecords":"','"')
					if (总个数=="0" || 总个数=='没有找到 前面文本 ' || 总个数=='前面文本必须唯一'){
						console.log('总个数为0')
						tag=1
						return
					}else{
						//根据总个数发送请求
						tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1665560740546&rows="+总个数+"&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22remark%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E5%B7%B2%E8%BF%94%22%7D%2C%7B%22field%22%3A%22seqs_add_time%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+日期_arr[i]+"%22%7D%2C%7B%22field%22%3A%22seqs_product_company_name%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22%E5%8C%97%E4%BA%AC%E5%88%86%E5%85%AC%E5%8F%B8%22%7D%5D%7D"
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get(tijiao,function (data) {
							一天_生产编号_arr=文本_取中间文本_批量(data,'"seqs_prod_id":',',')
							console.log(一天_生产编号_arr.length)
							// 一天_客户姓名_arr=文本_取中间文本_批量(data,'"seqo_cust_name":"','"')
							一天_订单号_arr=文本_取中间文本_批量(data,'"seqs_plus_first_order_id":"','"')
							一天_样品编号_arr=文本_取中间文本_批量(data,'"seqs_sam_num":"','"')
							一天_样品对应号_arr=文本_取中间文本_批量(data,'"seqs_plus_prod_id":"','"')
							
							生产编号_arr_all=生产编号_arr_all.concat(一天_生产编号_arr)
							订单号_arr_all=订单号_arr_all.concat(一天_订单号_arr)
							样品编号_arr_all=样品编号_arr_all.concat(一天_样品编号_arr)
							样品对应号_arr_all=样品对应号_arr_all.concat(一天_样品对应号_arr)
						})
					}
					
				})
		}
		//console.log(生产编号_arr_all)
		result=quchong_arr_duogeshuzu(生产编号_arr_all,订单号_arr_all,样品编号_arr_all,样品对应号_arr_all)
		//已经去重后的生产编号和样品对应号
		new_生产编号_arr=result[0]
		new_样品对应号_arr=result[1]
		
		if(tag==1){
			alert('没找到数据，是否查询的日期不对')
			return
		}
		// console.log(new_生产编号_arr)
		// console.log(new_样品对应号_arr)
		// 判断样品对应号是否在查询的日期内
		生产编号_all_result=判断样品对应号(new_生产编号_arr,new_样品对应号_arr,日期_arr)
		// console.log(生产编号_all_result)
		//对每个生产编号获取返还的数据
		根据生产编号获取返还的数据(生产编号_all_result)
	})
}
function 根据生产编号获取返还的数据(生产编号_all_result){
	result_包含已返_arr=[]
	// console.log(生产编号_all_result)
	for(var i=0;i<生产编号_all_result.length;i++){
		//获取流程记录
		tijiao="/seq/ashx/SeqProcessRecHandler.ashx?seqs_prod_id="+生产编号_all_result[i]+"&action=getrec&_search=false&nd=1665489724893&rows=10000&page=1&sidx=seqop_id&sord=desc"
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get(tijiao,
			function (data) {
				返还记录=文本_取中间文本_批量(data,'"seqop_process":"','"')
				// console.log(返还记录)
				for(var j=0;j<返还记录.length;j++){
					if(返还记录[j].indexOf('已返')!=-1){
						result_包含已返_arr.push(返还记录[j])
					}
				}
			})
	}
	console.log(result_包含已返_arr)
}

//模板板号和孔号改为负一
function 模板板号和孔号改为负一(html){
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	if(html.find('#button_mubanbanhao_konghao_-1').size()==0){
		toolbar.append('<a href="#"><button id="button_mubanbanhao_konghao_-1" onclick="return false">模板板号和孔号改为-1</button></a>')
	}else{return false}
	toolbar.find('#button_mubanbanhao_konghao_-1').click(function(){
		if(sample_table.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		selecteds=sample_table.find('tbody').find("[aria-selected='true']")
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
	})
}

//====================测序样品  结束===============================//
//====================客户管理  开始===============================//                客户管理
function kehu_shoujihao(){
	var html=$('iframe[src="/custmer/managerCustmer.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 客户管理 页面
	var toolbar=html.find('.toolbar').eq(0)
	if(toolbar.find('#button_shoujihao').size()==0){//如果是第一次则运行下面代码
		toolbar.append('<input type="text" id="text_shoujihao"  placeholder="部分手机号" size="10"/><button id="button_shoujihao" onclick="return false">查询手机号</button>')  //添加按钮
	}else{return false}
	toolbar.find('#text_shoujihao').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			toolbar.find('#button_shoujihao').click()
			return false
		}
	});
	toolbar.find('#button_shoujihao').click(function(){
		var iphone=toolbar.find('#text_shoujihao').eq(0).val()
		if(iphone!==""){
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='cust_mobile']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 手机号
			$('.searchOper:lt(1)').find("option[value='cn']").attr('selected','selected')  //条件改成包含
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(iphone)
			$("#AB").click()
		}
	})
}

//====================客户管理  结束===============================//
//====================自备引物  开始===============================//                      自备引物 
//在 自备引物页面  添加 一键修改 测序样品 的引物名称
function edit_primer_zibei(){
	var zibei_html=$('iframe[src="/viporder/SeqCustPrimerList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了自备引物的页面
	if(zibei_html.length==1){
		toolbar_edit=zibei_html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if(zibei_html.find('#edit_primer').size()==0){
			toolbar_edit.append('<button id="edit_primer" onclick="return false">一键修改测序样品相对应的引物名称</button>')
		}else{return false}
	}else{return false}
	toolbar_edit.find('#edit_primer').click(function(){
		if(zibei_html.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		selecteds_edit=zibei_html.find("[aria-selected='true']")
		for (var i=0;i<selecteds_edit.size();i++){
			id=selecteds_edit.eq(i).find('[aria-describedby=list_SeqCustPrimer_id]').text()  //获取id
			id=id+"-z"//最后的引物位置
			primer_name=selecteds_edit.eq(i).find('[aria-describedby=list_SeqCustPrimer_name]').text()  //获取自备引物的引物名称
			//get 请求  在 测序样品 根据 引物位置 获得所有需要更改的生产编号
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1624035568813&rows=2000000&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_primer_id_2_kind%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+id+"%22%7D%5D%7D",
				function (data,status) {
					yps=data.match(/\d{1,}(?=,"seqo_order_id)/g)//匹配获得的生产编号集合，如果没有则为null
					if(!yps){return; }//如果没有找到生产编号 则进入下个循环
					yps_new=[] //新建一个空数组，用于存放所有需要修改的生产编号
					primers=data.match(/(seqs_primer":")(.*?)(?=","seqs_observe")/g)
					if(yps.length!=0){//如果yps有数据,yps为数组
						if(yps.length!= primers.length){alert(primer_name+'   在测序样品找到的生产编号和引物名称的个数不一致，需要手动更改');return; }
						//循环找到的引物，如果和自备引物的引物名称不一致，那么存放在yps_new数组里面
						$.each(primers,function(j,item){
							primer_dui=item.substr(14)  //正确的引物
							if(primer_name!=primer_dui) { //如果自备引物的名称和测序样品的每一个引物名称不一致，那么存放在yps_new数组里面
								yps_new.push(yps[j])	
							}
						})
						if (yps_new.length>0){
							yps_str=yps_new.join(',')  //数组转换成字符串
							//post请求 根据找到的生产编号，在 测序样品 批量修改相对应的引物名称
							$.post("/seq/ashx/SeqSampleHandler.ashx",
								{action:"piliang_edit",ids:yps_str,newValue:"seqs_primer="+primer_name,rules_txt:"测序引物"},
								function (data,status) {if(i==selecteds_edit.size()-1){alert('修改成功')}});  //最后一次提交成功
						}else{return; }
					}else{return; }
				});
			//$.ajaxSettings.async = true;//get请求默认是异步的，在这里再改回异步
		}
	})
}
//把选择的行的引物在 测序样品查询出来
function chaxun_yinwu_zibei_cexuyangpinShow(){
	var html=$('iframe[src="/viporder/SeqCustPrimerList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了自备引物的页面
	if(html.length==1){
		toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if(html.find('#show_primer_cexu').size()==0){
			toolbar.append('<button id="show_primer_cexu" onclick="return false">在测序样品显示选择的引物</button>')
		}else{return false}
	}else{return false}
	toolbar.find('#show_primer_cexu').click(function(){
		if(html.find('tbody').find("[aria-selected='true']").size()==0){return false}  //如果没有选择的行，那么退出
		selecteds=html.find('tbody').find("[aria-selected='true']")//.find('[aria-describedby=list_SeqCustPrimer_id]').text()
		var ids_shuzu = new Array();
		for (var i=0;i<selecteds.size();i++){
			id=selecteds.eq(i).find('[aria-describedby=list_SeqCustPrimer_id]').text()  //获取id
			id=id+"-z"//最后的引物位置
			ids_shuzu[i]=id
		}
		//如果 测序样品 页面是已经打开的
		if($('#tabs').find('li:contains(测序样品)').size()===1){
			//测序样品的html必须加个后缀或者前缀 不能和之前的重复
			var cexuyangpin_html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
			toolbar_cexuyangpin=cexuyangpin_html.find('.toolbar').eq(0)  // 找到了测序样品的toolbar工具栏
			toolbar_cexuyangpin.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='seqs_primer_id_2_kind']").attr('selected','selected')  //把找到的查询条件改成 引物位置
			$('#radd').next().attr('checked','true')  //选择 OR 选项
			for (var i=0;i<selecteds.size();i++){
				$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(i).val(ids_shuzu[i])
			}
			$("#AB").click()
			$('#tabs').find('li:contains(测序样品)').click()
		}
	})
}

//====================自备引物  结束===============================//
//====================合成订单  开始===============================//					合成订单

//隐藏确定按钮
function hidden_show_quedinganniu(yesNo){
	//隐藏
	if(yesNo===true){
		$('html').find('#AB').css('display','none')
	}
	//显示
	if(yesNo===false){
		$('html').find('#AB').css('display','')
	}
}


//====================合成订单  结束===============================//
//====================合成样品  开始===============================                   合成样品 页面//
//合成样品 判断是否是测序引物  从 合成订单  合成费用  出库 完成  入财务都查一下
function hecheng_is_cexuyinwu(){
	var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 合成样品 页面
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_is_cexuyinwu').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_is_cexuyinwu" onclick="return false">判断是否是测序引物</button>')  //添加按钮
		}else{return false}
		toolbar.find('#button_is_cexuyinwu').eq(0).click(function(){
			var selecs=html.find('tbody').eq(0).find("[aria-selected='true']")  //选择选中的行	
			if(selecs.length===0){
				return false
			}
			selecs.each(function(){
				var each_duixiang=$(this)
				var hecheng_dingdanhao=$(this).find('[aria-describedby=list_syn_s_order]').eq(0).text()
				for(var i=1;i<=5;i++){
					//console.log('第'+i+"次运行")
					if(i===1){
						//在 合成订单找
						var tijiao="/syn/ashx/SynOrderHandler.ashx?_search=true&nd=1631714310616&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
					}else if(i===2){
						var tijiao="/syn/ashx/Syn_jisuan_moneyHandler.ashx?_search=true&nd=1631720231655&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
					}else if(i===3){
						var tijiao="/syn/ashx/SynOrderOutHandler.ashx?_search=true&nd=1631721204479&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
					}else if(i===4){
						var tijiao="/syn/ashx/SynOrderCompleteHandler.ashx?_search=true&nd=1631722322368&rows=100&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
					}else if(i===5){
						var tijiao="/syn/ashx/SynOrderToFinaceHandler.ashx?_search=true&nd=1631722400048&rows=20&page=1&sidx=syno_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syno_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+hecheng_dingdanhao+"%22%7D%5D%7D"
					}
					
					$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
					$.get(tijiao,
						function (data) {
							//先截取订单号
							 var ding=data.substring(data.indexOf('syno_id":"') + 10,data.indexOf('","cust_id"'))
							 if(ding===hecheng_dingdanhao){
								 var beizhu=data.substring(data.indexOf('syno_remark":"') + 14,data.indexOf('","syno_add_people'))
								 //说明备注里面包含 测序引物 四个字
								 if(beizhu.indexOf('测序引物')!==-1){
									 var dingdanhao_dangtian=each_duixiang.find('td[aria-describedby=list_syn_s_order]')
									 dingdanhao_dangtian.attr('title',beizhu)
									 dingdanhao_dangtian.css('color','red')
									 i=5
								 }
							 }
						});
				}
			})
		})
	}else{return false}
}
//合成样品  查询同序列所有引物
function hecheng_tong_xulie(){
	var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 合成样品 页面
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_find_tong_xulie').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_find_tong_xulie" onclick="return false">同序列引物(只查找第一个选择的)</button>')  //添加按钮
		}else{return false}
		toolbar.find('#button_find_tong_xulie').eq(0).click(function(){
			var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行	
			if(selec.length===0){return false}
			var hecheng_xulie=selec.find('[aria-describedby=list_syn_s_seq]').eq(0).text()
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='syn_s_seq']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 序列
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(hecheng_xulie)
			$("#AB").click()
		})
	}else{return false}
}
//合成样品 查询选择订单号的订单
function hecheng_find_dingdanhao(){
	var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 合成样品 页面
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_find_dingdanhao').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_find_dingdanhao" onclick="return false">查询订单号</button>')  //添加按钮
		}else{return false}
		toolbar.find('#button_find_dingdanhao').eq(0).click(function(){
			var selec=html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行	
			if(selec.length===0){
				return false
			}
			var hecheng_dingdanhao=selec.find('[aria-describedby=list_syn_s_order]').eq(0).text()
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='syn_s_order']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户名
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(hecheng_dingdanhao)
			$("#AB").click()
		})
	}else{return false}
}

//合成样品  统计合成样品的每日引物条数，订单数量，管数
function hecheng_tongji(){
	var html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 合成样品 页面
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_tongji').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<input type="text" id="text_tongji" placeholder="输入日期,例如 20210915"/>')
			toolbar.append('<button  id="button_tongji" onclick="return false">统计每日引物条数，订单数量，管数</button>')  //添加按钮
			toolbar.append('<input type="text" id="text_jieguo" placeholder="结果" size="25"/>')
		}else{return false}
		toolbar.find('#text_tongji').eq(0).val(getday_y_n('hecheng_zuotian_riqi'))
	}else{return false}
	//设置按空格 无效
	toolbar.find('#text_tongji').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	toolbar.find('#button_tongji').eq(0).click(function(){
		toolbar.find('#text_jieguo').eq(0).val('')  //结果内容清空
		var riqi=toolbar.find('#text_tongji').eq(0).val()
		if(riqi==="" || riqi.length!==8){
			alert('查询条件不对，重新录入8位日期')
			return false
		}
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		$.get("/syn/ashx/SynSampleHandler.ashx?_search=true&nd=1631691890735&rows=2000000&page=1&sidx=syn_s_num&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syn_s_add_time%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22"+riqi+"%22%7D%5D%7D",
			function (data,status) {
				 var zongtiaoshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 console.log(zongtiaoshu)
				 if(zongtiaoshu==="0"){
					 alert('查询条件不对，重新录入日期')
					 return false
				 }
				 //订单号统计
				 var all_dingdan=data.match(/syn_s_order":"(.{17})(?=","cust_id)/g)
				 //管数统计
				 var all_guanshu=data.match(/syn_s_tube":"(.{1,17})(?=","syn_s_primer)/g)
				 all_dingdan=all_dingdan.map(function(e){
					 return e.replace('syn_s_order":"','')
				 })
				 all_guanshu=all_guanshu.map(function(e){
					 return e.replace('syn_s_tube":"','')
				 })
				all_dingdan=quchong_arr(all_dingdan)
				dingdan_num=all_dingdan.length
				guanshu_num=eval(all_guanshu.join('+'))
				toolbar.find('#text_jieguo').eq(0).val(riqi+':  引物总条数 '+zongtiaoshu+" 订单数量 "+dingdan_num+" 管数 "+guanshu_num)
			});
	});
}
//统计_活动_2022年()
//查询北京分公司每日合成 备注不包含测序，基因，项目的反应条数。大于等于60多少条，小于等于59多少条
//OPC/PAGE,HPAGE/H-PAGE/HPLC,修饰不等于-1  大于等于60多少条，小于等于59多少条
function 统计_活动_2022年(html){
	var toolbar=html.find('.toolbar').eq(0)
	if(toolbar.find('#button_tongji_2022').size()==0){//如果是第一次则运行下面代码
		toolbar.append('<input type="date" id="shijian_2022">')  //添加时间
		toolbar.find("#shijian_2022").val(getday_y_n("zuori---"))//设置默认时间为昨天
		toolbar.append('<button  id="button_tongji_2022" onclick="return false">2022活动统计合成条数</button>')  //添加按钮
		toolbar.append('<input type="text" id="result_2022" size="160"> ')  //结果显示
	}else{return false}
	toolbar.find('#button_tongji_2022').eq(0).click(function(){
		toolbar.find('#result_2022').val('')
		日期=toolbar.find("#shijian_2022").val()
		日期=日期.replace(/-/g,"")
		网址='/syn/ashx/SynSampleHandler.ashx?_search=true&nd=1661244549653&rows=1&page=1&sidx=syn_s_num&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syn_s_add_time%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22'+日期+'%22%7D%2C%7B%22field%22%3A%22syn_s_Belongs_name%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E5%8C%97%E4%BA%AC%22%7D%5D%7D'
		总条数=网址_获取总条数(网址)
		if(总条数=='查询失败' || 总条数=='0'){
			return false
		}
		网址='/syn/ashx/SynSampleHandler.ashx?_search=true&nd=1661244549653&rows='+总条数+'&page=1&sidx=syn_s_num&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22syn_s_add_time%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22'+日期+'%22%7D%2C%7B%22field%22%3A%22syn_s_Belongs_name%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%E5%8C%97%E4%BA%AC%22%7D%5D%7D'
		$.get(网址,function (data,status) {
				if(data.indexOf('totalrecords')==-1){
					alert('查询“订单是否已经上传过”失败，请确定是否断网或者是否需要重新登录，请重新查询！')
				}else{
					arr_备注=文本_取中间文本_批量(data,'syn_s_remark":"','","')
					arr_修饰=文本_取中间文本_批量(data,'"syn_s_decorate":"','","')
					arr_纯化方式=文本_取中间文本_批量(data,'"syn_s_pur":"','","')
					arr_碱基数=文本_取中间文本_批量(data,'"syn_s_base":',',"')
					//新建数组，存放 去掉 测序，基因，项目的数据
					arr_修饰_new=[]
					arr_纯化方式_new=[]
					arr_碱基数_new=[]
					if(arr_备注.length != arr_修饰.length || arr_纯化方式.length != arr_碱基数.length){
						alert('查询失败，重新尝试！')
						return false
					}else{
						//如果不包含 测序，基因，项目，则存放到新数组里
						for (i=0;i<arr_备注.length;i++){
							if(arr_备注[i].indexOf('测序')==-1 && arr_备注[i].indexOf('基因')==-1 && arr_备注[i].indexOf('项目')==-1){
								arr_修饰_new.push(arr_修饰[i])
								arr_纯化方式_new.push(arr_纯化方式[i])
								arr_碱基数_new.push(arr_碱基数[i])
							}
						}
						//循环碱基数数组
						result_总数_大于等于60_nums=0
						result_OPC_PAGE_大于等于60_nums=0
						result_hpage_HPLC_大于等于60_nums=0
						result_修饰_大于等于60_nums=0
						
						result_总数_小于等于59_nums=0
						result_OPC_PAGE_小于等于59_nums=0
						result_hpage_HPLC_小于等于59_nums=0
						result_修饰_小于等于59_nums=0
						
						for(i=0;i<arr_碱基数_new.length;i++){
							if(parseInt(arr_碱基数_new[i])>=60){
								result_总数_大于等于60_nums+=1
								if((arr_纯化方式_new[i].toUpperCase()=="OPC" || arr_纯化方式_new[i].toUpperCase()=="PAGE" || arr_纯化方式_new[i].toUpperCase()=="IPAGE" || arr_纯化方式_new[i].toUpperCase()=="DSL") && arr_修饰_new[i]=="-1" ){
									result_OPC_PAGE_大于等于60_nums+=1
								}
								if((arr_纯化方式_new[i].toUpperCase()=="HPAGE" || arr_纯化方式_new[i].toUpperCase()=="H-PAGE" ||  arr_纯化方式_new[i].toUpperCase()=="HPLC" ) && arr_修饰_new[i]=="-1"){
									result_hpage_HPLC_大于等于60_nums+=1
								}
								if(arr_修饰_new[i]!=="-1" ){
									result_修饰_大于等于60_nums+=1
								}
							}
							if(parseInt(arr_碱基数_new[i])<=59){
								result_总数_小于等于59_nums+=1
								if((arr_纯化方式_new[i].toUpperCase()=="OPC" || arr_纯化方式_new[i].toUpperCase()=="PAGE" ) && arr_修饰_new[i]=="-1"){
									result_OPC_PAGE_小于等于59_nums+=1
								}
								if((arr_纯化方式_new[i].toUpperCase()=="HPAGE" || arr_纯化方式_new[i].toUpperCase()=="H-PAGE" ||  arr_纯化方式_new[i].toUpperCase()=="HPLC" ) && arr_修饰_new[i]=="-1"){
									result_hpage_HPLC_小于等于59_nums+=1
								}
								if(arr_修饰_new[i]!=="-1" ){
									result_修饰_小于等于59_nums+=1
								}
							}
						}
						toolbar.find('#result_2022').val('备注不包含测序，基因，项目的数量：OPC/PAGE<=59  ('+result_OPC_PAGE_小于等于59_nums+')  >=60: ('+ result_OPC_PAGE_大于等于60_nums+")  ； ")
						toolbar.find('#result_2022').val(toolbar.find('#result_2022').val()+'H-PAGE/HPLC<=59 ('+result_hpage_HPLC_小于等于59_nums+')  >=60: ('+ result_hpage_HPLC_大于等于60_nums+")  ；  ")
						toolbar.find('#result_2022').val(toolbar.find('#result_2022').val()+'修饰<=59 ('+result_修饰_小于等于59_nums+')  >=60: ('+ result_修饰_大于等于60_nums+")  ；  ")
						toolbar.find('#result_2022').val(toolbar.find('#result_2022').val()+'总数<=59 ('+result_总数_小于等于59_nums+')  >=60: ('+ result_总数_大于等于60_nums+")  ")
					}
				}
			});
	})
}

//====================合成样品  结束===============================//
//====================课题组  开始===============================//                    课题组管理  页面
//课题组管理 添加价格
function add_price(){
	var ketizu_html=$('iframe[src="/custmer/manageketizu.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 课题组管理 页面
	var toolbar_ketizu=ketizu_html.find('.toolbar').eq(0)
	if(toolbar_ketizu.find('#text_ketizuID').size()==0){//如果是第一次则运行下面代码
		if (显示_北京价格==true){
			toolbar_ketizu.append('<button  id="button_addPrice" onclick="return false">添加北京默认价格</button>')  //添加按钮
		}
		if (显示_广州价格==true){
			//toolbar_ketizu.append('<button  id="button_add_guangzhou_Price" onclick="return false">添加广州默认价格</button>')  //添加按钮
			toolbar_ketizu.append('<a href="#" style="position:relative;z-index:2;"><button id="button_tianjia_guangzhou_Price" onclick="return false">添加广州价格▽</button><div id="div_tianjia_guangzhou_Price" style="position:absolute;width:180px;height:140px;border:1px solid orange;background-color:#1B211D;display:none"></div></a>')
			div=toolbar_ketizu.find('#div_tianjia_guangzhou_Price').eq(0)
			div.append('<a href="#"><button id="button_gz_morenjiage" onclick="return false">广州默认价格</button></a>')
			div.append('<a href="#"><button id="button_gz_lihaitao" onclick="return false">李海涛(广西以外报价)</button></a>')
			div.append('<a href="#"><button id="button_gz_shenzhen" onclick="return false">深圳报价</button></a>')
			div.append('<a href="#"><button id="button_gz_mozhihong" onclick="return false">肿瘤医院(莫智鸿)</button></a>')
			div.append('<a href="#"><button id="button_gz_zenggangdi" onclick="return false">肿瘤黄埔院区(曾港迪)</button></a>')
			div.append('<a href="#"><button id="button_gz_guangxi" onclick="return false">广西</button>')
		}
		if (显示_北京价格==true){
			toolbar_ketizu.append('<button  id="button_copy_price" onclick="return false">仅能复制北京价格</button>')  //添加按钮
			toolbar_ketizu.append('<input type="text" id="text_ketizuID" placeholder="需要复制的课题组ID" />')  //添加文本框
		}
		
		//toolbar_ketizu.append('<button  id="button_copy_guangzhou_price" onclick="return false">复制广州价格</button>')  //添加按钮
		
	}else{return false}
	
	//禁止text文本框按键
	ketizu_html.find('#text_ketizuID').eq(0).keypress(function(event){
		if(event.keyCode ==13){
			return false
		}
	});
	
	//点击 添加广州价格 按钮 显示或者隐藏DIV
	toolbar_ketizu.find('#button_tianjia_guangzhou_Price').click(function(){
		div_show=toolbar_ketizu.find('#div_tianjia_guangzhou_Price').eq(0)
		if(div_show.css('display')==="none"){
			div_show.css('display','block')
			toolbar_ketizu.find('#button_tianjia_guangzhou_Price').eq(0).text('添加广州价格△')
			toolbar_ketizu.find('#button_tianjia_guangzhou_Price').eq(0).css('background-color','#B7A0AA')
		}else{
			div_show.css('display','none')
			toolbar_ketizu.find('#button_tianjia_guangzhou_Price').eq(0).text('添加广州价格▽')
			toolbar_ketizu.find('#button_tianjia_guangzhou_Price').eq(0).css('background-color','')
		}
	})
	
	function 公共添加价格(地方){
		if(地方=='北京'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆']
			var jiage_shuzu=['','300','5','0','0','80','20','','1.5','300','20','','1.8','3','','400','480','550','300','300','80','480','3.5','900','900','50','3','','0','0']
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
		var selec=ketizu_html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行
		if(selec.length===0){
			return false
		}
		id=selec.find('[aria-describedby=list_ketizu_id]').eq(0).text()
		name=selec.find('[aria-describedby=list_ketizu_name]').eq(0).text()
		var r = confirm("是否给 "+name+" 课题组添加价格？");
		if (r == false) {
		    return false
		}else{
			toolbar_ketizu.find('#button_addPrice').attr('disabled',true)
			toolbar_ketizu.find('#button_add_guangzhou_Price').attr('disabled',true)
			toolbar_ketizu.find('#button_copy_price').attr('disabled',true)
			toolbar_ketizu.find('#button_copy_guangzhou_price').attr('disabled',true)
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
				 if(地方=='北京'){
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
	//点击 添加价格 按钮
	ketizu_html.find('#button_addPrice').click(function(){
		公共添加价格('北京')
	})
	ketizu_html.find('#button_gz_morenjiage').click(function(){
		公共添加价格('广州默认价格')
	})
	ketizu_html.find('#button_gz_lihaitao').click(function(){
		公共添加价格('李海涛(广西以外报价)')
	})
	ketizu_html.find('#button_gz_shenzhen').click(function(){
		公共添加价格('深圳报价')
	})
	ketizu_html.find('#button_gz_mozhihong').click(function(){
		公共添加价格('肿瘤医院(莫智鸿)')
	})
	ketizu_html.find('#button_gz_zenggangdi').click(function(){
		公共添加价格('肿瘤黄埔院区(曾港迪)')
	})
	ketizu_html.find('#button_gz_guangxi').click(function(){
		公共添加价格('广西')
	})
	
	function 公共复制价格(地方){
		if(地方=='北京'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆']
			var jiage_shuzu=['','300','5','0','0','80','20','','1.5','300','20','','1.8','3','','400','480','550','300','300','80','480','3.5','900','900','50','3','','0','0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079']
		}
		if(地方=='广州'){
			var jiage_danwei_shuzu=['测序单价','克隆费','PCR扩增','PCR验证费','PCR纯化费','I碱基单价','小于16bp-opc','16-59bp-opc','60-89bp-opc','FAM','小于16bp-PAGE','16-59bp-PAGE','60-89bp-PAGE','60-89bp-HPLC','16-59bp-HPLC','HEX','TAMRA','ROX','Biotin','磷酸化','U碱基','TET','大于89bp-hplc','CY5','CY3','小于16bp-HPLC','大于89bp-PAGE','测序引物','高纯质粒大提','TA克隆','菌液测序','质粒测序','PCR已纯化测序','PCR未纯化测序']
			var jiage_shuzu=['','300','5','0','0','80','20','','1.5','300','20','','1.8','3','','400','480','550','300','300','80','480','3.5','900','900','50','3','','0','0','0','0','0','0']
			var jiage_set_cm_kind=['118','122','123','124','130','120','125','126','127','128','131','132','133','134','135','136','138','140','142','144','146','158','159','160','161','162','163','164','1078','1079','607','608','609','610']
		}
		var selec=ketizu_html.find('tbody').eq(0).find("[aria-selected='true']").eq(0)  //选择第一个选中的行
		if(selec.length===0){
			return false
		}
		id=selec.find('[aria-describedby=list_ketizu_id]').eq(0).text()
		name=selec.find('[aria-describedby=list_ketizu_name]').eq(0).text()
		console.log(id,name)
		var copyID=toolbar_ketizu.find('#text_ketizuID').eq(0).val()
		if(copyID===""){
			return false
		}
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		var flag=1
		var flag1=1
		var flag2=1
		//先根据文本框的课题组ID查询，能不能找到信息
		$.get("/custmer/ashx/KeTiZuHandler.ashx?_search=true&nd=1631271843425&rows=100&page=1&sidx=ketizu_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22ketizu_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+copyID+"%22%7D%5D%7D",
			function (data) {
				 var mubiao_ketizu=data.substring(data.indexOf('ketizu_name":"') + 14,data.indexOf('","ketizu_contac'))
				 if(mubiao_ketizu==='{"totalpages"'){
					 alert('目标课题组没有找到')
					 flag=0
					 return false
				 }else{
					 var r1 = confirm("是否给 "+name+" 课题组复制 "+mubiao_ketizu+" 课题组的价格？");
					 if (r1 == false) {
						 flag=0
					     return false
					 }else{
						toolbar_ketizu.find('#button_addPrice').attr('disabled',true)
						toolbar_ketizu.find('#button_add_guangzhou_Price').attr('disabled',true)
						toolbar_ketizu.find('#button_copy_price').attr('disabled',true)
						toolbar_ketizu.find('#button_copy_guangzhou_price').attr('disabled',true)
					}
				 }
				 $.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				 $.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+copyID+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=desc",
				 	function (data) {
				 		 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
				 		 if(parseInt(geshu)<30){
				 			 alert('目标课题组价格不符合复制条件，请重新查看')
				 			 flag1=0
				 			 return false
				 		 }
				 		console.log(data)
						jiage_shuzu=[]
						for(var i=0;i<jiage_danwei_shuzu.length;i++){
							chazhao_qian=jiage_danwei_shuzu[i]+'","set_cm_price":"'
							var arr=data.match(chazhao_qian+'(^$|.{0,10})(?=",")')  //空白符或者0到10个任意字符
							jiage_shuzu.push(arr[1])
						}
						//=====================================================
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=desc",
							function (data,status) {
								 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
								 if(geshu!=="0"){
									 alert('必须为空，才能添加价格')
									 flag2=0
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
						if(flag2===0){  //说明本身已经存在价格
							return false
						}
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get("/custmer/ashx/SetCustMoneyHandler.ashx?action=get_cust_money&set_kzt_id="+id+"&_search=false&nd=1631194735107&rows=100&page=1&sidx=set_cm_id&sord=desc",
							function (data,status) {
								 var geshu=data.substring(data.indexOf('totalrecords":"') + 15,data.indexOf('","griddata'))
								 if(地方=='北京'){
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
				 	});
			});
		if(flag===0 || flag1===0 || flag2===0){
			return false
		}
	}
	
	//点击 复制课题组价格 按钮
	ketizu_html.find('#button_copy_price').click(function(){
		公共复制价格('北京')
	})
	ketizu_html.find('#button_copy_guangzhou_price').click(function(){
		公共复制价格('广州')
	})
}
	

//业务员所有的课题组和地址集合
function yewuyuan_ketizu_dizhi_jihe(){
	var html=$('iframe[src="/custmer/manageketizu.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 课题组管理 页面
	var ketizu_id_shuzu=[]
	var ketizu_name_shuzu=[]
	var ketizu_area_shuzu=[]
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_ketizu_dizhi_jihe').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_ketizu_dizhi_jihe" onclick="return false">业务员所有课题组和地址集合▽</button><div id="div_ketizu_dizhi" style="position:absolute;z-index:1;width:320px;height:200px;border:1px solid orange;background-color:	#1B211D;display:none"></div>')  //添加按钮
			div=toolbar.find('#div_ketizu_dizhi').eq(0)
			div.append('<input type="text" id="text_yewuyuan" placeholder="业务员姓名" size="10"/>')
			//div.append('<button id="button_yewuyuan_zhengzepipei" onclick="return false">第一步：客户管理查询：销售员包含“业务员姓名”，正则匹配客户ID和客户名字</button>')
			div.append('<button id="button_kehuxinxi" onclick="return false">获取业务员的课题组姓名和地址</button>')
		}else{return false}
		//点击按钮 显示或者隐藏DIV
		toolbar.find('#button_ketizu_dizhi_jihe').click(function(){
			div=toolbar.find('#div_ketizu_dizhi').eq(0)
			if(div.css('display')==="none"){
				div.css('display','block')
				toolbar.find('#button_ketizu_dizhi_jihe').eq(0).text('业务员课题组和地址集合△')
			}else{
				div.css('display','none')
				toolbar.find('#button_ketizu_dizhi_jihe').eq(0).text('业务员课题组和地址集合▽')
			}
		})
		/* //第一步：客户管理查询：销售员包含“业务员姓名”，正则匹配客户ID和客户名字
		toolbar.find('#button_yewuyuan_zhengzepipei').click(function(){
			var name=toolbar.find('#text_yewuyuan').eq(0).val()
			if(name===""){return false}
			if(html.find('#textarea_quanbu_zhengze').size()===0){
				html.append('<textarea id="textarea_quanbu_zhengze" style="position:absolute;z-index:2;width:250px;height:100px;top:90px;left:400px;border:1px solid orange;display:block"></textarea>')
			}
			//业务员包含 业余员的姓名
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get("/custmer/ashx/CustmerHandler.ashx?_search=true&nd=1639906444357&rows=200000&page=1&sidx=cust_addr&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22cust_saler%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22"+name+"%22%7D%5D%7D",
				function (data,status) {
					html.find('#textarea_quanbu_zaluan').eq(0).val(data)
				});
		}) */
		toolbar.find('#button_kehuxinxi').click(function(){
			var name=toolbar.find('#text_yewuyuan').eq(0).val()
			if(name===""){return false}
			//业务员包含  业余员的姓名
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get("/custmer/ashx/CustmerHandler.ashx?_search=true&nd=1639906444357&rows=200000&page=1&sidx=cust_addr&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22cust_saler%22%2C%22op%22%3A%22cn%22%2C%22data%22%3A%22%"+name+"%22%7D%5D%7D",
				function (data,status) {
					//批量获取 所有的用户ID
					yonghu_id=data.match(/cust_id":(.*?)(?=,"cust_name)/g)
					yonghu_id.forEach(function(item,index){
						item=item.replace(/cust_id":/,"")
						yonghu_id[index]=item
						//对每个客户ID 在客户课题组 get方法获取课题组ID和课题组姓名
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get("/custmer/ashx/CustToKtzHandler.ashx?_search=true&nd=1639911577687&rows=20&page=1&sidx=ktz_to_cust_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22cust_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+yonghu_id[index]+"%22%7D%5D%7D",
							function (data,status) {
								//找到了，说明该客户没有对应课题组
								if(data.indexOf('"totalrecords":"0"')!==-1){
									return false
								}else {
									//课题组ID
									id_zhongjianshuzu=data.match(/ktz_cust_ketizu_id":"(.*?)(?=","ktz_cust_ketizu_name)/g)
									id_zhongjianshuzu.forEach(function(item_1,index_1){
										item_1=item_1.replace(/ktz_cust_ketizu_id":"/,"")
										id_zhongjianshuzu[index_1]=item_1
									})
									ketizu_id_shuzu=ketizu_id_shuzu.concat(id_zhongjianshuzu)
									//课题组姓名
									name_zhongjian=data.match(/ktz_cust_ketizu_name":"(.*?)(?=","ktz_cust_remark)/g)
									name_zhongjian.forEach(function(item_1,index_1){
										item_1=item_1.replace(/ktz_cust_ketizu_name":"/,"")
										name_zhongjian[index_1]=item_1
									})
									ketizu_name_shuzu=ketizu_name_shuzu.concat(name_zhongjian)
									//课题组地址
									area_zhongjian=data.match(/cust_addr":"(.*?)(?=","cust_postal)/g)
									area_zhongjian.forEach(function(item_1,index_1){
										item_1=item_1.replace(/cust_addr":"/,"")
										area_zhongjian[index_1]=item_1
									})
									ketizu_area_shuzu=ketizu_area_shuzu.concat(area_zhongjian)
								}
							});
					})
					//批量获取 用户名
					yonghu_name=data.match(/cust_name":"(.*?)(?=","cust_area)/g)
					yonghu_name.forEach(function(item,index){
						item=item.replace(/cust_name":"/,"")
						yonghu_name[index]=item
					})
					//批量获取 客户地址
					yonghu_area=data.match(/cust_addr":"(.*?)(?=","cust_postal)/g)
					yonghu_area.forEach(function(item,index){
						item=item.replace(/cust_addr":"/,"")
						yonghu_area[index]=item
					})
					//通过客户课题组
				});
			console.log(ketizu_name_shuzu.toString())
			console.log('------------------')
			console.log(ketizu_area_shuzu.toString())
			/* $("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_ketizu_xinxi" style="position:absolute;left:400px;" rows="3" cols="50"></textarea>')
			var jieguo=ketizu_name_shuzu.toString()+ketizu_area_shuzu.toString()
			$('body').find('#textarea_ketizu_xinxi').text(jieguo) */
		})
	}
}

//====================课题组  结束===============================//
//====================客户课题组  开始===============================//              客户课题组 
//一定要放在第一行  每隔5秒执行各种需要自动执行的程序
function zidong_yunxing_kehuketizu(){
	var html=$('iframe[src="/custmer/CustToKtz.aspx"]').contents().find('body').eq(0)  //客户课题组页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#a_search').size()==1){
		zidong_kehuketizu()
		function zidong_kehuketizu(){
			window.clearTimeout(t2); // 每次都先清除timer
			var t2=setTimeout(function (){
				if(html.find('tbody').find('[aria-describedby=list_ketizu_cust_addtime]').size()>0 && html.find('[aria-describedby=list_ketizu_cust_addtime]').last().attr('title').indexOf('唯一')===-1){  //如果有数据 且 没有 唯一 说明没有找到，则运行
					//客户课题组 "是否启用"" 为0的标记一个颜色
					shifouqiyong()
				}
				//回调函数 不要删
				zidong_kehuketizu()
			},3000);
		}
	}
}
//在 客户课题组 修改客户地址
function edit_address(){
	var html_kkz=$('iframe[src="/custmer/CustToKtz.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了客户课题组的页面
	if(html_kkz.length==1){
		toolbar_kkz=html_kkz.find('.toolbar').eq(0)  // 找到了toolbar工具栏
		if(html_kkz.find('#id_address').size()==0){
			toolbar_kkz.append('<a href="#" id="id_address" ><input type="text" id="text_address"   placeholder="更新后的地址" size="20"/><button id="button_address" onclick="return false">更改客户地址</button></a>')
		}else{return false}
	}else{return false}
	//点击 更改客户地址 按钮执行如下函数
	buyao_tankuang=0
	toolbar_kkz.find('#button_address').click(function(){
		new_address=html_kkz.find('#text_address').val()
		if(new_address==""){return false} //如果text没填写数据则退出
		selecteds=html_kkz.find('tbody').find("[aria-selected='true']")  //所有选择的行的集合
		if(selecteds.size()==0){return false} //如果没有选择行则退出
		sele=selecteds.eq(0)
		kehu_id_kkz=sele.find('[aria-describedby=list_cust_id]').eq(0).text()  //查找客户课题组的客户ID
		kehu_name_kkz=sele.find('[aria-describedby=list_cust_name]').eq(0).text()  //查找客户课题组的客户姓名
		//判断这个客户对应几个课题组 如果对应多个则提醒
		$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
		var flag=0
		$.get("/custmer/ashx/CustToKtzHandler.ashx?_search=true&nd=1631453676576&rows=20&page=1&sidx=ktz_to_cust_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22cust_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+kehu_id_kkz+"%22%7D%5D%7D",
			function (data,status) {
				if(data.indexOf('totalrecords":"1"')===-1){
					alert('这个客户ID对应多个客户组，不更改此客户地址')
					flag=1
					return false
				}
			});
		if(flag===1){
			console.log('xxx')
			return false
		}
		if(toolbar_kkz.find('#button_address').eq(0).text()=="更改客户地址"){  
			if(buyao_tankuang==0){
				var r = confirm("确定要更改地址吗？一般点击2次才能更改成功");
				if (r == false) {
					return false;
				}
				var r = confirm("是否后续都不需要弹框？");
				if (r != false) {
					buyao_tankuang=1
				}
			}
		}
		toolbar_kkz.find('#button_address').eq(0).text('更改客户地址1')  //改地址，目的：只提醒一次 confirm("确定要更改地址吗？");
		toolbar_kkz.find('#button_address').eq(0).css('color','orange')
		var html_kehu=$('iframe[src="/custmer/managerCustmer.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了客户管理的页面
		if(html_kehu.length<1){alert('需要打开客户管理页面');return false}
		toolbar_kehu=html_kehu.find('.toolbar').eq(0)  //找到客户管理的toolbar工具栏
		
		toolbar_kehu.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();  //单击 客户管理的查询
		$('#searchForm').find("option[value='cust_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 客户ID
		$('#searchForm').find("[class='txt02 searchString']").eq(0).val(kehu_id_kkz)
		$("#AB").click()
		sleep(300)
		old_id_kehu=html_kehu.find('tbody').find('[aria-describedby=list_cust_id]').text()  //客户管理找到的客户ID
		if(old_id_kehu==""){return false}
		console.log('客户课题组',kehu_id_kkz)
		console.log('客户',old_id_kehu)
		if(old_id_kehu!=kehu_id_kkz){return false}  //如果 客户管理找到的客户ID 和 客户课题组的客户ID  不一致 则退出
		html_kehu.find('tbody').find('tr').eq(0).trigger("click");   //选中第一行
		html_kehu.find('#a_edit').find('span').eq(0).trigger("click");   //单击 编辑 按钮
	
		if($('#txt_cust_name').val()!=kehu_name_kkz){alert('no');return false}  //如果姓名不对，则退出
		$('#txt_cust_addr').val(new_address)
		$("#AB").click()
		toolbar_kkz.find('#button_address').eq(0).text('更改客户地址')  //改回来地址，目的：只提醒一次 confirm("确定要更改地址吗？");
		toolbar_kkz.find('#button_address').eq(0).css('color','black')
	})
}
//是否启用为0的标记一个颜色
function shifouqiyong(){
	var html=$('iframe[src="/custmer/CustToKtz.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了客户课题组的页面
	if(html.length==1){
		shifouqiyong_lie=html.find('tbody').find('[aria-describedby=list_cust_state]')  //是否启用  列
		shifouqiyong_lie.each(function(){
			if($(this).text()==="0"){	
				$(this).css('background-color',"red")
			}
		})
		html.find('[aria-describedby=list_ketizu_cust_addtime]').last().attr('title','唯一')
	}
}
//====================客户课题组  结束===============================//
//====================模板排版  开始===============================//            模板排版
//在模板排版 修改样品类型
function mubanpaiban_xiugai_yangpinleixing(){
	var html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 模板排版 页面
	if(html.length===1){
		var tag=0
		var toolbar=html.find('.toolbar').eq(0)
		var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
		if(toolbar.find('#button_edit_yplx').size()===0){
			toolbar.append('<select id="zl_ych"><option value ="0">选择质粒和已纯化样品类型</option><option value ="质粒">质粒</option><option value ="已纯化">PCR已纯化</option></select>')  //添加文本框
			toolbar.append('<select id="jun"><option value ="0">选择菌液样品类型</option><option value ="菌液">菌液</option><option value ="直提菌">直提菌</option><option value ="平板菌">平板菌</option><option value ="大管菌液">大管菌液</option><option value ="96孔板菌液">96孔板菌液</option><option value ="划线菌">划线菌</option><option value ="枪头菌">枪头菌</option><option value ="沉菌">沉菌</option><option value ="9">清菌</option><option value ="48孔板菌液">48孔板菌液</option></select>')  //添加文本框
			toolbar.append('<select id="pcr"><option value ="0">选择PCR样品类型</option><option value ="PCR切胶">PCR切胶</option><option value ="PCR单一">PCR单一</option><option value ="PCR胶块">PCR胶块</option></select>')  //添加文本框
			toolbar.append('<button id="button_edit_yplx" onclick="return false">修改样品类型</button>')
		}else{return false}
		toolbar.find('#zl_ych').change(function(){
			if(toolbar.find('#zl_ych').val()!=="0"){
				tag=1
			}
			if(toolbar.find('#zl_ych').val()==="0" && toolbar.find('#jun').val()==="0" && toolbar.find('#pcr').val()==="0"){
				tag=0
			}
			//把另外两个选择框的选择改为第一个
			toolbar.find('#jun').find("option[value='0']").eq(0).attr('selected','selected') 
			toolbar.find('#pcr').find("option[value='0']").eq(0).attr('selected','selected') 
		})
		toolbar.find('#jun').change(function(){
			if(toolbar.find('#jun').val()!=="0"){
				tag=2
			}
			if(toolbar.find('#zl_ych').val()==="0" && toolbar.find('#jun').val()==="0" && toolbar.find('#pcr').val()==="0"){
				tag=0
			}
			//把另外两个选择框的选择改为第一个
			toolbar.find('#zl_ych').find("option[value='0']").eq(0).attr('selected','selected') 
			toolbar.find('#pcr').find("option[value='0']").eq(0).attr('selected','selected') 
		})
		toolbar.find('#pcr').change(function(){
			if(toolbar.find('#pcr').val()!=="0"){
				tag=3
			}
			if(toolbar.find('#zl_ych').val()==="0" && toolbar.find('#jun').val()==="0" && toolbar.find('#pcr').val()==="0"){
				tag=0
			}
			//把另外两个选择框的选择改为第一个
			toolbar.find('#zl_ych').find("option[value='0']").eq(0).attr('selected','selected') 
			toolbar.find('#jun').find("option[value='0']").eq(0).attr('selected','selected') 
		})
		toolbar.find('#button_edit_yplx').click(function(){
			//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
			selecteds=is_one_order(html)
			if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
				return false
			}
			if(toolbar.find('#zl_ych').val()==="0" && toolbar.find('#jun').val()==="0" && toolbar.find('#pcr').val()==="0"){
				alert('需要选择要改成的样品类型')
				return false
			}
			if(toolbar.find('#zl_ych').val()!=="0"){
				var lx=toolbar.find('#zl_ych').val()
			}else if(toolbar.find('#jun').val()!=="0"){
				var lx=toolbar.find('#jun').val()
			}else if(toolbar.find('#pcr').val()!=="0"){
				var lx=toolbar.find('#pcr').val()
			}
			var r = confirm("确定要把这"+selecteds.size()+"条的样品类型改为 "+ lx +" 吗？");
			if (r == false) {
				return false;
			}
			var yps_shuzu=[]
			selecteds.each(function(){
				YP_1=$(this).find('[aria-describedby=list_undefined]').eq(0).text()  //查找生产编号
				order=$(this).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
				yp_name=$(this).find('[aria-describedby=list_seqs_sam_num]').eq(0).text()  //查找样品名
				yp_geshu=$(this).find('[aria-describedby=list_count_num]').eq(0).text()  //查找个数
				if(yp_geshu==="1"){
					yps_shuzu.push(YP_1.slice(2))
				}else{
					//在测序样品 搜索 订单号+样品名  获取这个样品名的所有生产编号
					$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
					$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1642935960152&rows=200&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqo_order_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+order+"%22%7D%2C%7B%22field%22%3A%22seqs_sam_num%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+yp_name+"%22%7D%5D%7D",
						function (data) {
							arr=data.split('"seqs_prod_id":')
							for(var i=1;i<arr.length;i++){
								//获取 改好的生产编号
								shengchanbianhao=arr[i].slice(0,8);
								yps_shuzu.push(shengchanbianhao)
							}
						}); 
				}
			})
			ids=yps_shuzu.toString()
			$.post("/seq/ashx/SeqSampleHandler.ashx",
				{action:"piliang_edit",ids:ids,newValue:"seqs_sam_type="+lx,rules_txt:"样品类型"},
				function (data) {
					if(data!=="1"){
						alert('出现问题，重新运行！')
						return false
					}
					html.find('.ui-pg-input').eq(0).focus()
					alert('光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
				});
		})
	}
}
//修改样品名称
function mubanpaiban_edit_ypmc(){
	var html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 模板排版 页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)
		var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
		if(toolbar.find('#button_ypmc').size()===0){
			toolbar.append('<a href="#" id="id_ypmc"><input type="text" id="text_ypmc"   placeholder="要改成的样品名" size="15"/><button id="button_ypmc" onclick="return false">要改成的样品名称,一次只能修改一个</button></a>')
		}else{return false}
		toolbar.find('#text_ypmc').eq(0).keypress(function(event){
			if(event.keyCode ==13){
				return false
			}
		});
		toolbar.find('#button_ypmc').click(function(){
			var new_value=toolbar.find('#text_ypmc').eq(0).val()
			//如果文本框为空 那么退出
			if(new_value===""){
				return false
			}
			//公共函数 判断是否选择了反应，且选择的是否是同一个订单号
			selecteds=is_one_order(html)
			if(selecteds===false){//如果返回的是false 那么要不没有选择反应，要不选择的不是同一个订单号
				return false
			}
			var r = confirm("确定要把样品名称改为 "+ new_value +" 吗？");
			if (r == false) {
				return false;
			}
			YP_1=selecteds.eq(0).find('[aria-describedby=list_undefined]').eq(0).text()  //查找生产编号
			order=selecteds.eq(0).find('[aria-describedby=list_seqo_order_id]').eq(0).text()  //查找订单号
			yp_name=selecteds.eq(0).find('[aria-describedby=list_seqs_sam_num]').eq(0).text()  //查找样品名
			yp_geshu=selecteds.eq(0).find('[aria-describedby=list_count_num]').eq(0).text()  //查找个数
			var ypm_shuzu=[]
			if(yp_geshu==="1"){
				ypm_shuzu.push(YP_1.slice(2))
			}else{
				//在测序样品 搜索 订单号+样品名  获取这个样品名的所有生产编号
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1642935960152&rows=200&page=1&sidx=seqs_prod_id&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqo_order_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+order+"%22%7D%2C%7B%22field%22%3A%22seqs_sam_num%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+yp_name+"%22%7D%5D%7D",
					function (data) {
						arr=data.split('"seqs_prod_id":')
						for(var i=1;i<arr.length;i++){
							//获取 改好的生产编号
							shengchanbianhao=arr[i].slice(0,8);
							ypm_shuzu.push(shengchanbianhao)
						}
					}); 
			}
			ids=ypm_shuzu.toString()
			$.post("/seq/ashx/SeqSampleHandler.ashx",
				{action:"piliang_edit",ids:ids,newValue:"seqs_sam_num="+new_value,rules_txt:"样品编号"},
				function (data) {
					if(data!=="1"){
						alert('出现问题，重新运行！')
						return false
					}
					html.find('.ui-pg-input').eq(0).focus()
					alert('光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
				}); 
		})
	}
}
//  模板排版  
function mubanpaiban(){
	var muban_html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 模板排版 页面
	if(muban_html.length==1){
		var toolbar_muban=muban_html.find('.toolbar').eq(0)
		if(toolbar_muban.find('#button_paiban_hengpai').size()==0){//如果是第一次则运行下面代码
			toolbar_muban.append('<input type="text" id="text_muban" placeholder="从上往下排模板板号" />')  //添加文本框
			toolbar_muban.append('<button  id="button_paiban_hengpai" onclick="return false">横排(有顺序，注意!)</button>')  //添加按钮
			toolbar_muban.append('<button  id="button_jinyong_hengpai" onclick="return false">禁用</button>')  //添加按钮
			toolbar_muban.append('<button  id="button_paiban_junshupai" disabled=disabled onclick="return false">菌竖排(有顺序，注意!)</button>')  //添加按钮
			toolbar_muban.append('<button  id="button_jinyong_junshupai" onclick="return false">禁用</button>')  //添加按钮
			toolbar_muban.append('<input type="text" id="text_dingdanhao" placeholder="查询订单号" />')  //添加文本框
			toolbar_muban.append('<button  id="button_dingdanhao" onclick="return false">查询订单号</button>')  //添加按钮
			toolbar_muban.append('<input type="text" id="text_tiaojian" placeholder="查询条件" />')  //添加文本框
			toolbar_muban.append('<button  id="button_tiaojian" onclick="return false">查询条件</button>')  //添加按钮
			//设置高度gaodu
			table_div_muban=muban_html.find('.ui-jqgrid-bdiv').eq(0)  // 找到了样品的table的上一级div  用于设置高度
			table_height_muban=table_div_muban.css('height')  //测序样品 页面的高度
			if($('body').css('height').slice(0,-2)-table_height_muban.slice(0,-2)<=245){  //如果table的高度小于等于整体页面的高度
				table_div_muban.css('height',table_height_muban.slice(0,-2)-25+"px") //重新设置 测序样品 页面的高度
			}
		}else{return false}
	}else{return false}
	toolbar_muban.find("[id^='button_paiban']").click(function(){ 
		if($(this)[0].innerHTML.slice(0,2)!=="横排"){
			var leixing="菌竖排"
		}else{
			var leixing="横排"
		}
		var kehu_selects=muban_html.find('tbody').find("[aria-selected='true']")  //选择的所有行	
		if($.trim(toolbar_muban.find('#text_muban').eq(0).val())===""){
			return false
		}else{
			var banhao=toolbar_muban.find('#text_muban').eq(0).val()
		}
		if(kehu_selects.size()>=1){
			kehu_selects.each(function(){
				var hang=$(this)
				YP=$(this).find('[aria-describedby=list_undefined]').eq(0).text()  //查找生产编号
				console.log(YP)
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.post("/seq/ashx/SeqTemplePlateHandler.ashx",
					{action:"SetTemplePlate",ids:YP.slice(2),seqs_tempplate:banhao,remark:"",seqs_tempplate_style:leixing,seqs_temple_machine_style:192},
					function (data) {
						if(data!=="1"){
							alert('出现问题，需要检查模板排版后重新运行！')
							return false
						}
						hang.attr('hidden',true)
						hang.attr('aria-selected',false)  //相当于取消选择某一行
					});  //最后一次提交成功
			})
		}else{return false}  //如果选择的是没有选择 那么退出
		muban_html.find('.ui-pg-input').eq(0).focus()
		alert('光标自动定位在页数，直接按回车或更改页数可以查看更改结果')
	})
	toolbar_muban.find('#button_jinyong_hengpai').click(function(){
		if(toolbar_muban.find('#button_paiban_hengpai').eq(0).attr('disabled')){
			toolbar_muban.find('#button_paiban_hengpai').eq(0).attr('disabled',false)
		}else{
			toolbar_muban.find('#button_paiban_hengpai').eq(0).attr('disabled',true)
		}
	})
	toolbar_muban.find('#button_jinyong_junshupai').click(function(){
		if(toolbar_muban.find('#button_paiban_junshupai').eq(0).attr('disabled')==="disabled"){
			toolbar_muban.find('#button_paiban_junshupai').eq(0).attr('disabled',false)
		}else{
			toolbar_muban.find('#button_paiban_junshupai').eq(0).attr('disabled',true)
		}
	})
	toolbar_muban.find('#button_dingdanhao').click(function(){
		var dingdanhao=toolbar_muban.find('#text_dingdanhao').val()
		toolbar_muban.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		$('#searchForm').eq(0).find("option[value='seqo_order_id']").eq(0).attr('selected','selected')  //把找到的第一个查询条件改成 订单号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(dingdanhao)
		$("#AB").click()
	})
	toolbar_muban.find('#button_tiaojian').click(function(){
		var tiaojian=$.trim(toolbar_muban.find('#text_tiaojian').val())
		if(tiaojian===""){
			return false
		}
		var selects=muban_html.find('tbody').eq(0).find("tr")  //所有行
		selects.each(function(){
			var yangpinming=$(this).find('td[aria-describedby="list_seqs_sam_num"]').eq(0).text()
			if(yangpinming.indexOf(tiaojian)===-1){ //说明没有找到条件，需要隐藏行
				$(this).attr('hidden',true)
			}
		})
	})
}
//====================模板排版  结束===============================//


//加甜菜碱
function 加甜菜碱(){
	板号=$('#txt_SeqMachineFenZhuangReport_plate').val()
	//根据板号获取 测序样品 相对应的所有的生产编号
	$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
	$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1664200454310&rows=20000&page=1&sidx=seqs_space&sord=asc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_plate%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+板号+"%22%7D%5D%7D",
		function (data,status) {
			总条数=文本_取中间文本(data,'totalrecords":"','"')
			if (总条数=='0'  || 总条数=='没有找到 前面文本'){
				return false
			}
			备注_arr=文本_取中间文本_批量(data,'"remark":"','","seqop_id')
			样品类型_arr=文本_取中间文本_批量(data,'"seqs_sam_type":"','","seqs_ant_type')
			生产编号_arr=文本_取中间文本_批量(data,'"seqs_prod_id":',',"seqo_order_id')
			生产编号_arr_添加甜菜碱=[]
			for(var i=0;i<生产编号_arr.length;i++){
				//如果没有找到甜菜碱 且 是PCR类型
				if (备注_arr[i].split("加甜菜碱").length==1 && 样品类型_arr[i].toUpperCase().indexOf("PCR")>=0){
					生产编号_arr_添加甜菜碱.push(生产编号_arr[i])
				}
			}
			if(生产编号_arr_添加甜菜碱.length>0){
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.post("/seq/ashx/SeqSampleHandler.ashx",
					{action:'piliang_edit',ids:生产编号_arr_添加甜菜碱.join(','),newValue:'remark#= 加甜菜碱',rules_txt:"备注"},
					function (data) {
						console.log('OK')
					});
			}
			
		});
}


//设定 订单管理 和 测序管理的高度
function gaodu(lei){
	if(lei==="dingdanguanli"){
		var order_html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了订单管理的页面
		zhongjian_gonggong(order_html)
	}else if(lei==="cexuyangpin"){
		var sample_html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
		if(sample_html.length==0){return false}
		zhongjian_gonggong(sample_html)
	}else if(lei==="hechengyangpin"){
		var hecheng_html=$('iframe[src="/syn/SynSample.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了合成样品的页面
		zhongjian_gonggong(hecheng_html)
	}else if(lei==="mubanpaiban"){
		var mubanpaiban_html=$('iframe[src="/seq/SeqTemplePlate.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了模板排版的页面
		zhongjian_gonggong(mubanpaiban_html)
	}else if(lei==="fanyingshengchan"){
		var fanyingshengchan_html=$('iframe[src="/seq/SeqReaction.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了反应生产的页面
		zhongjian_gonggong(fanyingshengchan_html)
	}else if(lei==="dingdanchuku"){
		var html=$('iframe[src="/seq/SeqOrderOut.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了反应生产的页面
		zhongjian_gonggong(html)
	}
	function zhongjian_gonggong(html){
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
}
//引物弹框页面，显示引物个数
function primer(){
	var primer_html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('.layui-layer-content').eq(0)//如果找到 则说明有引物弹框
	if(primer_html.length==1){  //说明有引物弹框
		primer_num=primer_html.find('tr').size()-1  //  统计tr出现的次数，减去1，就是所有的引物的总数
		htm=primer_html.html()
		if(htm.match('readonly')){ //说明找到了 readonly，
			primer_num=primer_num-htm.match(/readonly/g).length   //match(/readonly/g)  括号里面的是正则
		}
		title_html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('.layui-layer-title').eq(0)
		title_html.html('新增的自备引物数量为： &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;<span style=\"color:red;font-size:40px\">'+ primer_num+'</span>')
	}
}
//添加订单页面，选择好客户后显示详细信息
function kehu_showAll(leixings){
	if(leixings==="hecheng"){
		var html=$('iframe[src="../bio/erp/primerSynthesis.html?mode=add"]').contents().find('body').eq(0)  //合成管理 iframe弹框页面   .find('#wrapper').eq(0)
	}else{
		var html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('body').eq(0) //订单管理 iframe弹框页面   .find('#wrapper').eq(0)
	}
	var order_xinzeng_html=html
	if(order_xinzeng_html.length==1){  //说明有 添加订单页面
		//先隐藏图
		if(order_xinzeng_html.find("[class='col-xs-3 plate-param-container hidden']").length==0){  //如果图片没有隐藏
			order_xinzeng_html.find("[class='col-xs-3 plate-param-container']").addClass('hidden')//添加隐藏
		}
		if(order_xinzeng_html.find("[class='col-xs-3 plate-container hidden']").length==0){  //如果图片没有隐藏
			order_xinzeng_html.find("[class='col-xs-3 plate-container']").addClass('hidden')//添加隐藏
		}
		if(order_xinzeng_html.find('#kehu_all').size()==0){
			t='<div id="kehu_all" style="position:absolute;left:60px;width:1300px;height:67px"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size="3" color="red"></font></div>'
			order_xinzeng_html.find("[class='wrapper wrapper-content animated fadeInRight']").eq(0).prepend(t)
			order_xinzeng_html.find("[class='plate-col']").eq(0).append('<div style="position:absolute;right:333px"><font size="3" color="red"><textarea id="tixing" rows="11" cols="40"></textarea></font></div>')
			order_xinzeng_html.find("#kehu_all").attr('title',"")
		}
		ktz_text=order_xinzeng_html.find('#select2-ktz-container').eq(0)  //课题组选择框
		//去除里面的div标签 <div hidden='hidden'>朱旭</div>
		ktz_text.find('div').remove()
		select_xinxi=ktz_text.text()
		console.log(select_xinxi)
		if(select_xinxi=="输入名称、邮箱、电话查询"){
			order_xinzeng_html.find('#kehu_all').eq(0).find('font').eq(0).text("")
			return false
		}
		select_xinxi=select_xinxi.slice(1)
		id=parseInt(select_xinxi).toString()  //选择的客户ID
		name=select_xinxi.slice(id.length)  //选择的客户名称
		if(order_xinzeng_html.find("#kehu_all").attr('title')!==id){
			$.ajaxSettings.async = false;
			$.get("/ajax/SearchCustmer.ashx?action=getcustKtz&keyword="+id+"%20"+name,  
				function (data,status) {
					data=data.slice(2,-2)		//把左右两遍的[""]去掉
					order_xinzeng_html.find('#kehu_all').eq(0).find('font').eq(0).text(data)
					order_xinzeng_html.find("#kehu_all").attr('title',id)
				});
			order_xinzeng_html.find('#tixing').eq(0).val("")
			old_xinxi=order_xinzeng_html.find('#kehu_all').find('font').eq(0).text()//从已经建立的div里面获取里面的客户信息，
			if (old_xinxi!=""){  // 从已经建立的div里面获取里面的信息不为空
				old_xinxi_split=old_xinxi.split('——');
				old_id=old_xinxi_split[0]  //从已经建立的div里面获取里面的客户ID
				old_name=old_xinxi_split[1]//从已经建立的div里面获取里面的客户姓名
				old_ktz_id=old_xinxi_split[2]//从已经建立的div里面获取里面的课题组ID
				ti_xing=getTixing(id,old_ktz_id)  //获取客户和课题组提醒
				order_xinzeng_html.find('#tixing').eq(0).val(ti_xing)
			}
		}
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

//查询北京订单数量
function find_shuliang(){
	var order_html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了订单管理的页面
	if(order_html.length===0){return false}
	if(order_html.find('#bj_before').size()==0){
		order_html.find('.toolbar').eq(0).append('<button id="bj_before" onclick="return false">北京12点之前查询</button><button id="bj_after" onclick="return false">北京12点之后查询</button>')
	}else{return false}
	order_html.find('#bj_before').click(function(){
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
	})
	order_html.find('#bj_after').click(function(){
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
	})
}

//多人同时上传照片
function add_phone(){
	var order_html=$('iframe[src="/seq/SeqOrderList.aspx"]').contents().find('body').eq(0)//如果找到 则说明有 订单管理 页面
	if(order_html.length===0){return false}
	//订单管理的toolbar
	var toolbar_order=order_html.find('.toolbar').eq(0)
	if(toolbar_order.find('#text_photo').size()==0){//如果是第一次则运行下面代码
		//添加上传照片的表单按钮
		toolbar_order.append('<input type="file" id="text_photo"   size="20"/><button id="button_photo" onclick="return false">上传照片</button>')  
	}else{return false}
	toolbar_order.find('#button_photo').click(function(){
			var order_selects=order_html.find('tbody').find("[aria-selected='true']")  //选择的所有行
			var order_number=[]  //订单号数组
			if(order_selects.size()>=1){
				order_selects.each(function(){
					order_number.push($(this).find('[aria-describedby=list_seqo_id]').text())
				})
			}else{return false}  //如果选择的是没有选择 那么退出
	
			//上传图片
			var imgUrl = toolbar_order.find('#text_photo').eq(0).val()  //获取文件框的图片内容
			if(imgUrl==""){return false}
			var formData = new FormData();
	       		formData.append("imgFile", toolbar_order.find('#text_photo')[0].files[0]);
			formData.append('localUrl',imgUrl);
			var zhaopian=""
			for(var i=0;i<order_number.length;i++){
				if(order_number[i]==""){continue}
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
				$.post("/seq/ashx/seqSampleHandler.ashx?action=addOrderJietuPhoto&jietu_url=/kindeditor-4.1/attached"+zhaopian+"&seqo_order_id="+order_number[i],
					{action:"addOrderJietuPhoto",jietu_url:"/kindeditor-4.1/attached"+zhaopian,seqo_order_id:order_number[i]},
					function (data) {console.log(data)});  //最后一次提交成功
			}
			toolbar_order.find('#text_photo').eq(0).val('')
			alert('刷新查看')
		})
}


//添加订单页面，选择客户的时候让数据显示在一行
function kehu_yihang(leixings){
	if(leixings==="hecheng"){
		var html=$('iframe[src="../bio/erp/primerSynthesis.html?mode=add"]').contents().find('body').eq(0)  //合成管理 iframe弹框页面
	}else{
		var html=$('iframe[src="../bio/erp/sangerSequencing.html?mode=add"]').contents().find('body').eq(0) //订单管理 iframe弹框页面
	}
	if(html.length==1){//说明有 添加合成订单页面
		var liebiao=html.find('ul.select2-results__options').eq(0)
		if(liebiao.find('br').size()==0){return false}
		liebiao.find('li').find('br').before("<span> —— </span>")
		liebiao.find('li').find('br').remove()
		html.find("[class='select2-dropdown select2-dropdown--below']").css('width','1100px')
	}
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


//数组去重 返回重复位置,去掉空白
function quchong_arr_chongfu_weizhi(arr){
	var hash=[];
	var chongfu_weizhi=[]
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]!=""){
			if(hash.indexOf(arr[i])==-1){
					hash.push(arr[i]);
			}else{
				chongfu_weizhi.push(i+1)
			}
		}
	}
	console.log(chongfu_weizhi)
	return chongfu_weizhi;
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

//数组去重，多个数组根据某两个数组的连接重复的，同步去重
function quchong_arr_duogeshuzu(生产编号_arr_all,订单号_arr_all,样品编号_arr_all,样品对应号_arr_all){
	result_arr=[]
	new_生产编号_arr=[]
	new_样品对应号_arr=[]
	//连接订单号和样品编号
	订单号_样品编号_arr=[]
	for(var i=0;i<订单号_arr_all.length;i++){
		订单号_样品编号_arr.push(订单号_arr_all[i]+样品编号_arr_all[i])
	}
	test=[]
	for (var i = 0; i < 订单号_样品编号_arr.length; i++) {
		if(test.indexOf(订单号_样品编号_arr[i])==-1){
				test.push(订单号_样品编号_arr[i]);
				new_生产编号_arr.push(生产编号_arr_all[i])
				new_样品对应号_arr.push(样品对应号_arr_all[i])
		}
	}
	//把样品对应号重复的删除 生产编号和样品对应号
	//获取重复的位置
	arr_重复位置=quchong_arr_chongfu_weizhi(new_样品对应号_arr)
	for(var i=0;i<arr_重复位置.length;i++){
		new_生产编号_arr.splice(arr_重复位置[i]-1,1)
		new_样品对应号_arr.splice(arr_重复位置[i]-1,1)
	}
	result_arr.push(new_生产编号_arr)
	result_arr.push(new_样品对应号_arr)
	return  result_arr
}
// 判断样品对应号是否在查询的日期内
function 判断样品对应号(new_生产编号_arr,new_样品对应号_arr,日期_arr){
	for(var i=0;i<new_样品对应号_arr.length;i++){
		//如果找到了YP
		if(new_样品对应号_arr[i].indexOf('YP')!=-1){
			当前对应号=new_样品对应号_arr[i].substr(2)
			tijiao="/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1665579029400&rows=20&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqs_prod_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+当前对应号+"%22%7D%5D%7D"
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get(tijiao,
				function (data) {
					订单号=文本_取中间文本(data,'seqo_order_id":"','"')
					if (订单号.length==17){
						订单号前八位=订单号.slice(0,8)
						//如果在查询的日期内，那么把相应的生产编号变成空
						if(日期_arr.indexOf(订单号前八位)!=-1){
							new_生产编号_arr[i]=''
						}
					}
				})
		}
	}
	//把new_生产编号_arr的空去掉
	new_生产编号_arr_qudiao_kongbai=arr_quchu_kongbai(new_生产编号_arr)
	return new_生产编号_arr_qudiao_kongbai
}

//没用到该函数 统计数组中每个数据出现的次数，形参有2个，第一个已经去重的数组，第二个 原始数组 返回值是个数数组 比如[3,5,1]，对应已经去重的形参
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
//选中一些行后，把相同引物位置的其余引物标记颜色  
function show_color_primer(html){
	var sample_table=html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	//把选中的所有行的行数显示在右下角
	old_text=html.find('#pager_right').eq(0).find('div').eq(0).text()
	num_s=sample_table.find('tbody').find("[aria-selected='true']").size()
	html.find('#pager_right').eq(0).find('div').eq(0).find('#reve').remove()
	html.find('#pager_right').eq(0).find('div').eq(0).prepend("<span id='reve'>总共选中了 "+num_s+"  行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</spam>")
	//改颜色
	if(html.length==1){
		var yinwu_weizhi=[]
		//对被选中的行进行 查找引物位置并赋值到yinwu_weizhi数组里面
		sample_table.find('tbody').find("[aria-selected='true']").each(function(){
			yinwu_weizhi.push($(this).find('[aria-describedby=list_seqs_primer_id_2_kind]').eq(0).text())
		})
		//获取的引物位置需要和当前页面所有的tr里面的引物位置进行比较
		sample_table.find('[aria-describedby=list_seqs_primer_id_2_kind]').attr('Bgcolor','')  //先把所有的行的颜色去掉
		if(yinwu_weizhi.length>0){
			sample_table.find('tr').each(function(){
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
//查询之前的日期,把从今天到前几天的日期组成一个数组，返回
function getday_old(传入的日期,num){
	var myDate = new Date(传入的日期);
	arr=[]
	arr.push(传入的日期.replace(/-/g,""))
	for(var i=1;i<=num;i++){
		时间戳=myDate.setTime(myDate.getTime()-24*60*60*1000)
		var year = (myDate.getFullYear()).toString(); //获取当前年
		var mon = (myDate.getMonth() + 1).toString(); //获取当前月
		var date = (myDate.getDate()).toString(); //获取当前日
		if(mon.length==1){
			mon="0"+mon
		}
		if(date.length==1){
			date="0"+date
		}
		arr.push(year+mon+date)
	}
	return arr
}

//把 测序样品 的 流程名称 是反应生产，模板失败，停止反应  标颜色
function gg_color(){
	var sample_html=$('iframe[src="/seq/SeqSampleList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了测序样品的页面
	var sample_table=sample_html.find('.ui-jqgrid-btable').eq(0)  // 找到了样品的table
	if(sample_html.length==1){
		sample_table.find('[aria-describedby=list_seqs_process]').each(function(){
			if($(this).text()=="反应生产" ||  $(this).text()=="模板失败" ||  $(this).text()=="停止反应" ||  $(this).text()=="模板成功"){
				$(this).attr('Bgcolor','#AeEEe7')
				$(this).parent().find('[aria-describedby=list_seqs_primer]').eq(0).attr('title','更改此引物需要跟反应组说!!!')
				$(this).parent().find('[aria-describedby=list_seqs_primer]').eq(0).attr('Bgcolor','#f58220') //#AeEEe7
			}
		})
		sample_table.find('[aria-describedby=list_seqs_complete]').each(function(){
			if($(this).text()=="样品不足"){
				$(this).attr('Bgcolor','#AeEEe7')
			}
		})
		//备注如果包含菌P 那么在去掉待测的时候要跟反应组说一下 必须要说
		if($('#curname',window.parent.document).text()==="申高天" || $('#curname',window.parent.document).text()==="冯丽丽"){
			sample_table.find('[aria-describedby=list_remark]').each(function(){
				if(($(this).text().indexOf('菌P')!==-1 || $(this).text().indexOf('菌p')!==-1) &&$(this).text().indexOf('待测')!==-1) {//说明找到了菌P两个字
					$(this).attr('Bgcolor','#f58220')
					$(this).parent().find('[aria-describedby=list_remark]').eq(0).attr('title','如果菌P的样品要把待测去掉 那么需要跟反应组说下')
				}
			})
		}
		sample_table.find("[role='row']").eq(-1).find('[aria-describedby=list_seqo_order_id]').attr('title',"客户提醒")
	}
}



//=======================发票自动拍照 开始===========================//                   发票管理 页面
function fapiao_paizhao(){
	var text_arr=[]
	var html=$('iframe[src="/orderfina/FinacebillList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了发票管理的页面
	var disibu_shangyige_fapiaohao=""
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_paizhao').size()==0){//如果是第一次则运行下面代码
			//多文本文本框  用于录入订单号
			$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_fapiao" style="position:absolute;left:400px;" rows="3" cols="50"></textarea>')
			toolbar.append('<button  id="button_huluetankuang" onclick="return false">第一步:手动忽略弹框</button>')  //添加按钮
			toolbar.append('<button  id="button_copy" onclick="return false" disabled= "disabled">第二步:复制数据</button>')  //添加按钮
			toolbar.append('<button  id="button_paizhao" onclick="return false"  disabled= "disabled">第三步:发票自动拍照</button>')  //添加按钮
			toolbar.append('<span  id="span_paizhao" style="font-size:15px;color:blue"></span>')  //添加按钮
			toolbar.append('<button  id="chaxun_shangyige_fapiao"  onclick="return false">查询上一个发票</button>')  //添加按钮
		}else{return false}
		//点击 第一步
		toolbar.find('#button_huluetankuang').eq(0).click(function(){
			//点击 发票签收 按钮
			toolbar.find('#a_FinaBillSign').eq(0).find('.l-btn-left').eq(0).click()
			//点击 添加 按钮
			setTimeout("$('#iframeStaff').contents().find('#a_add').eq(0).click()",1000)
			//隐藏 第一步
			toolbar.find('#button_huluetankuang').eq(0).attr('hidden',true)
			//解禁 第二步
			toolbar.find('#button_copy').eq(0).attr('disabled',false)
		})
		//点击 第二步
		toolbar.find('#button_copy').eq(0).click(function(){
			if($('#textarea_fapiao').val()===""){
				return false
			}
			text_arr=$('#textarea_fapiao').val().split('\n')
			for(var i=0;i<text_arr.length;i++){
				//如果运行到了最后一次
				if(text_arr[i]==="" && i===text_arr.length-1){
					text_arr.pop()
				}
			}
			$("#textarea_fapiao").remove()
			toolbar.find('#button_copy').attr('hidden',true)
			toolbar.find('#button_paizhao').eq(0).attr('disabled',false)
			toolbar.find('#span_paizhao').eq(0).text('      下一个发票号是      '+text_arr[0])
		})
		//点击第三步
		toolbar.find('#button_paizhao').eq(0).click(function(){
			if(text_arr.length===0){
				return false
			}
			//点击发票签收 按钮
			toolbar.find('#a_FinaBillSign').eq(0).find('.l-btn-left').eq(0).click()
			//显示完全 发票签收 弹框	
			$('#iframeStaff').on('load',function(){
				var fapiaoqianshou_html=$('#iframeStaff').contents()
				var fapiaohao=fapiaoqianshou_html.find('#txt_fina_bill_number').val(text_arr[0])//发票号
				var fapiaohao_hou8wei=text_arr[0].slice(-8)//截取发票号的后8位
				disibu_shangyige_fapiaohao=fapiaohao_hou8wei  //把后8位赋值，用于第四步
				//点击 拍照 按钮
				fapiaoqianshou_html.find('#button2').eq(0).click()
				//拍照仪load后
				$('#iframeUpload').on('load',function(){
					setTimeout(paizhao_shangchuan,5000)
					function paizhao_shangchuan(){
						var paizhao_html=$('#iframeUpload').contents().find('body').eq(0)
						//点击 拍照上传 按钮
						paizhao_html.find("input").eq(0).click()
						setTimeout(click_queding,3000)
						function click_queding(){
							$("#d").find("#AB").click()
							setTimeout(click_tianjia,2000)
							function click_tianjia(){
								var paizhao_fujian=fapiaoqianshou_html.find('#phote_url').val()//拍照附件
								//如果发票号和拍照附件不为空 并且 订单拍照 界面 是隐藏的情况下，说明OK
								if(fapiaohao!=="" && paizhao_fujian!=="" && $('#d').parent().css('display')==="none"){
									//点击 添加按钮
									fapiaoqianshou_html.find('#a_add').eq(0).click()
									setTimeout(click_fapiaoqianshou_queding,1000)
									function click_fapiaoqianshou_queding(){
										$("#w").find("#AB").click()
										setTimeout(chaxun,2500)
										function chaxun(){
											//检查是否拍照成功
											toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
											$('#searchForm').eq(0).find("option[value='fina_bill_number']").attr('selected','selected')  //把找到的第一个查询条件改成 发票号
											$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(fapiaohao_hou8wei)
											$("#w #AB").click()
											if(html.find('tbody').find('tr').size===1){
												var s=html.find('tbody').find('tr').eq(0)
												//如果第一条记录的发票号和数组的第0项不一致，则再运行一次
												if(s.find('[aria-describedby=list_fina_bill_number]').eq(0).text()!==text_arr[0]){
													toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
													$('#searchForm').eq(0).find("option[value='fina_bill_number']").attr('selected','selected')  //把找到的第一个查询条件改成 发票号
													$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(fapiaohao_hou8wei)
													$("#w #AB").click()
												}
											}
											if(text_arr.length>0){
												text_arr.shift()
												if(text_arr.length>0){
													toolbar.find('#span_paizhao').eq(0).text('      下一个发票号是      '+text_arr[0])
												}else{
													toolbar.find('#span_paizhao').eq(0).text('      已拍完')
													//隐藏第三步
													toolbar.find('#button_huluetankuang').eq(0).attr('hidden',true)
												}
											}else{
												toolbar.find('#button_paizhao').attr('hidden',true)
											}
										}
									}
								}else{
									$('[class="panel window"] div:contains(发票签收)').text("发票签收&nbsp;&nbsp;&nbsp;&nbsp;没成功，需要重新运行")
									return false
								}
							}
						}
					}
				})
				
			})
		})
		//点击第四步
		toolbar.find('#chaxun_shangyige_fapiao').eq(0).click(function(){
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='fina_bill_number']").attr('selected','selected')  //把找到的第一个查询条件改成 发票号
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val(disibu_shangyige_fapiaohao)
			$("#w #AB").click()
		})
	}else{return false}
}

//发票管理  如果 是否签收显示的是，那么显示一个颜色
function fapiao(){
	var order_html=$('iframe[src="/orderfina/FinacebillList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了发票管理的页面
	if(order_html.length==1){
		order_html.find('[aria-describedby=list_fina_bill_sign]').each(function(){
			if($(this).text()=="是"){
				//$(this).parent().attr('Bgcolor','#AeEEe7')
				$(this).parent().css('background','#AeEEe7')
			}
		})
	}
}
//=======================发票自动拍照 结束===========================//
//=======================销售回款清单 结束===========================//                  销售回款清单 页面
//规格去重
function guige_quchong(){
	var html=$('iframe[src="/orderfina/SalerGetMoneyList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了销售回款清单的页面
	if(html.length==1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_guige_quzhong').size()==0){//如果是第一次则运行下面代码
			//多文本文本框  用于录入订单号
			$("body").find("[class='layout-body panel-body panel-body-noheader panel-body-noborder']").append('<textarea id="textarea_guige_quzhong" style="position:absolute;left:400px;" rows="3" cols="50"></textarea>')
			toolbar.append('<input type="text" id="text_guige_quzhong" placeholder="填写完整的发票号" />')  //填写完整的发票号
			toolbar.append('<button  id="button_guige_quzhong" onclick="return false">规格去重</button>')  //规格去重
		}else{return false}
		//文本框回车键失效
		toolbar.find('#text_guige_quzhong').eq(0).keypress(function(event){
			if(event.keyCode ==13){
				return false
			}
		});
		toolbar.find('#button_guige_quzhong').eq(0).click(function(){
			//获取文本框的内容
			var t=toolbar.find('#text_guige_quzhong').eq(0).val()
			if(t==="" || t.length!=20){
				return false;
			}
			$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
			$.get("/orderfina/xmldata/xmlOrderFinaBillDetail.aspx?sqlpara=order_fina_invoice_number%23"+t,
				function (data,status) {
					arr_guige=data.split("<order_fina_format>")
					arr_jijiadanwei=data.split("<order_fina_priceunit>")
					arr_danjia=data.split("<order_fina_everprice>")
					var arr_zong=['']
					if(arr_guige.length<=1){
						alert('没找到数据，是否错误？')
					}
					//不要从0开始 因为0没有需要的数据
					for(var i=1;i<arr_guige.length;i++){
						//截取 获得正确的规格
						arr_guige[i]=arr_guige[i].substring(0,arr_guige[i].indexOf('</order_fina_format>'))
						//截取 获得正确的计价单位
						arr_jijiadanwei[i]=arr_jijiadanwei[i].substring(0,arr_jijiadanwei[i].indexOf('</order_fina_priceunit>')) 
						//截取 获得正确的单价
						arr_danjia[i]=arr_danjia[i].substring(0,arr_danjia[i].indexOf('</order_fina_everprice>'))
					}
					
					for(var i=1;i<arr_guige.length;i++){
						//如果没有找到-OPC_，-PAGE_,-HPLC_ 
						if(arr_guige[i].toUpperCase().indexOf('-OPC_')===-1 && arr_guige[i].toUpperCase().indexOf('-PAGE_')===-1 && arr_guige[i].toUpperCase().indexOf('-HPLC_')===-1){
							//测序样品类型
							if(arr_guige[i]=="PCR切胶" || arr_guige[i]=="PCR单一" || arr_guige[i]=="PCR已纯化" || arr_guige[i]=="PCR胶块" || arr_guige[i]=="质粒" || arr_guige[i]=="菌液" || arr_guige[i]=="直提菌" || arr_guige[i]=="平板菌" || arr_guige[i]=="大管菌液" || arr_guige[i]=="96孔板菌液" || arr_guige[i]=="划线菌" || arr_guige[i]=="枪头菌" || arr_guige[i]=="沉菌" || arr_guige[i]=="清菌" || arr_guige[i]=="48孔板菌液"){
								arr_guige[i]="测序反应"+arr_danjia[i]+"元"
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							var arr=["基因组DNA提取","定点突变","高纯质粒大提"]
							for(var j=0;j<arr.length;j++){
								if(arr_guige[i]==arr[j]){
									arr_guige[i]=arr_danjia[i]+"元/个（"+arr[j]+"）"
									arr_jijiadanwei[i]=""
									arr_danjia[i]=""
								}
							}
							//测序引物
							if(arr_guige[i]=="测序引物"){
								arr_guige[i]=arr_danjia[i]+"元/bp（测序引物）"
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							//合成基因片段大于500bp
							if(arr_guige[i]=="合成基因片段大于500bp"){
								arr_guige[i]=arr_danjia[i]+"元/bp（合成基因片段大于500bp，根据难易程度决定）"
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							//合成基因片段大于500bp
							if(arr_guige[i]=="合成基因片段小于等于500bp"){
								arr_guige[i]=arr_danjia[i]+"元/条（合成基因片段小于等于500bp，根据难易程度决定）"
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							//载体构建
							if(arr_guige[i]=="载体构建"){
								arr_guige[i]=arr_danjia[i]+"元/个（载体构建，根据难易程度决定）"
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							//Biotin
							if(arr_guige[i]=="Biotin" || arr_guige[i]=="5-Biotin" || arr_guige[i]=="3-Biotin" ){
								arr_guige[i]="Biotin（修饰费为"+arr_danjia[i]+"元/个）     "+i.toString()//加上i是为了最后在删除重复项的时候不删除
								arr_jijiadanwei[i]=""
								arr_danjia[i]=""
								continue;
							}
							//修饰的引物的按碱基收费的，所以没有纯化方式 比如16-59bp_1OD
							for(var j=1;j<=20;j++){
								//如果没有找到bp 那么直接退出该循环
								if(arr_guige[i].toUpperCase().indexOf('BP')===-1){
									break
								}
								if(j>=1 && j<=4){
									var jiewei="1-4OD）    "+i.toString()
								}else if(j>=5 && j<=8){
									var jiewei="5-8OD）    "+i.toString()
								}else if(j>=9 && j<=12){
									var jiewei="9-12OD）    "+i.toString()
								}else if(j>=13 && j<=16){
									var jiewei="13-16OD）    "+i.toString()
								}else if(j>=17 && j<=20){
									var jiewei="17-20OD）    "+i.toString()
								}
								if(arr_guige[i]==="16-59bp_"+j.toString()+"OD"){
									arr_guige[i]=arr_danjia[i]+"元/bp(16-59BP,"+jiewei
								}
							}
						}else{
							//（OPC/PAGE/HPLC纯化，1-20OD,所有碱基数量）OK
							if(arr_guige[i].toUpperCase().indexOf('-OPC_')!==-1){
								var gg="opc"
							}else if(arr_guige[i].toUpperCase().indexOf('-PAGE_')!==-1){
								var gg="PAGE"
							}else if(arr_guige[i].toUpperCase().indexOf('-HPLC_')!==-1){
								var gg="hplc"
							}
							if(gg!="opc" && gg!="PAGE" && gg!="hplc"){
								alert('运行有问题 检查一下 gg不等于OPC PAGE HPLC')
								return false
							}
							//1OD到20OD
							for(var j=1;j<=20;j++){
								if(j>=1 && j<=4){
									var jiewei="1-4OD）"
								}else if(j>=5 && j<=8){
									var jiewei="5-8OD）"
								}else if(j>=9 && j<=12){
									var jiewei="9-12OD）"
								}else if(j>=13 && j<=16){
									var jiewei="13-16OD）"
								}else if(j>=17 && j<=20){
									var jiewei="17-20OD）"
								}
								//===============小于16BP 开始===========================================//
								if(arr_guige[i].toUpperCase()===("小于16bp-"+gg+"_"+j.toString()+'OD').toUpperCase()){
									arr_guige[i]=arr_danjia[i]+"元/bp（"+gg.toUpperCase()+"纯化，长度小于16bp，"+jiewei 
									arr_jijiadanwei[i]=""
									arr_danjia[i]=""
									break;
								}
								//===============16-59BP 开始===========================================//
								if(arr_guige[i].toUpperCase()===("16-59bp-"+gg+"_"+j.toString()+'OD').toUpperCase()){
									arr_guige[i]=arr_danjia[i]+"元/bp（"+gg.toUpperCase()+"纯化，长度16-59bp，"+jiewei
									arr_jijiadanwei[i]=""
									arr_danjia[i]=""
									break;
								}
								//===============大于59-89bp 开始===========================================//
								if(arr_guige[i].toUpperCase()===("大于59-89bp-"+gg+"_"+j.toString()+'OD').toUpperCase()){
									arr_guige[i]=arr_danjia[i]+"元/bp（"+gg.toUpperCase()+"纯化，长度大于59-89bp，"+jiewei
									arr_jijiadanwei[i]=""
									arr_danjia[i]=""
									break;
								}
								//===============大于90bp 开始===========================================//
								if(arr_guige[i].toUpperCase()===("大于90bp-"+gg+"_"+j.toString()+'OD').toUpperCase()){
									arr_guige[i]=arr_danjia[i]+"元/bp（"+gg.toUpperCase()+"纯化，长度大于90bp，"+jiewei
									arr_jijiadanwei[i]=""
									arr_danjia[i]=""
									break;
								}
							}
						}
					}
					for(var i=1;i<arr_guige.length;i++){
						arr_zong.push(arr_guige[i]+" "+arr_jijiadanwei[i]+" "+arr_danjia[i])
					}
					//下面是显示所有的规格，整理好后的
					//console.log(arr_zong)
					//复制到文本框里面
					var x=""
					for(var i=1;i<arr_guige.length;i++){
						x+=arr_zong[i]+"\n"
					}
					$('body').find('#textarea_guige_quzhong').eq(0).val(x)
				});
		})
	}
}

//=======================销售回款清单 结束===========================//
//=======================基因新订单 开始===========================//                  基因新订单 页面
//添加界面 生产实验室 折扣 预期时间 需要更改
function jiyin_add(){
	var html=$('iframe[src="/geneNew/GeneNewOrderList.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了基因新订单的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)
		toolbar.find('#a_add').eq(0).click(function(){
			var html_jiyin_iframe= $('iframe[src="../GeneNew/addGeneOrderSample.aspx"]')//.contents().find('body').eq(0) //基因新订单  弹框页面
			html_jiyin_iframe.on('load',function(){
				var h=$(this).contents().find('body').eq(0)
				if(h.find('#yichunzaile').size()===0){
					if( 当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						//需要选择亦庄分公司
						var tex="<span id='yichunzaile' style='color:red;font-size:25px;font-weight:bold'>①选择亦庄</span>"
						h.find('#txt_prod_company').eq(0).parent().append(tex)
						//订单备注显示和样品备注显示 默认打勾
						h.find('#txt_Radio_isOrderRemark').eq(0).attr('checked','checked')
						h.find('#txt_Radio_isSampleRemark').eq(0).attr('checked','checked')
					}
					   //生产实验室 长度变短
					h.find('#txt_prod_company').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
					//结算分公司 青岛和广州的
					tex="<span style='color:red;font-size:25px;font-weight:bold'>③外地的需要选择</span>"
					h.find('#txt_settlement_company').eq(0).parent().append(tex)
					   //结算分公司 长度变短
					h.find('#txt_settlement_company').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
					//二级实验室 长度变短
					h.find('#txt_gene_new_second_companyname').eq(0).parent().find('[class="combo-text validatebox-text"]').eq(0).css('width','150px')
					if( 当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){
						//二级实验室后面加句话
						tex="<span style='color:red;font-size:15px;font-weight:bold'>④选微生物</span>"
						h.find('#txt_gene_new_second_companyname').eq(0).parent().append(tex)
					}
					//预期时间后面加句话
					tex="<span style='color:red;font-size:25px;font-weight:bold'>②需要改此处</span>"
					h.find('#txt_gene_expectTime').eq(0).parent().append(tex)
					if( 当前用户名==="申高天" || 当前用户名==="冯丽丽" || 当前用户名==="刘泽夫"){   //
						//把折扣改为1
						h.find('#txt_gene_new_discount').eq(0).val('1')
					}else{
						//客服 根据选择的服务类型获取相应的折扣
						var tex='<select id="xuanze_fuwuleixing"><option value ="0">选择服务类型</option>><option value ="1">----------------</option><option value ="BSP-甲基化测序">BSP-甲基化测序</option><option value ="转化/涂板费">转化/涂板费</option><option value ="基因检测">基因检测</option><option value ="PCR扩增">PCR扩增</option><option value ="SSR/STR分型服务">SSR/STR分型服务</option><option value ="TA克隆">TA克隆</option><option value ="载体构建">载体构建</option><option value ="无缝克隆">无缝克隆</option><option value ="定点突变">定点突变</option><option value ="全基因合成">全基因合成</option><option value ="基因组DNA提取">基因组DNA提取</option><option value ="高纯质粒大提">高纯质粒大提</option><option value ="RNA提取">RNA提取</option><option value ="cDNA反转录">cDNA反转录</option><option value ="荧光定量PCR">荧光定量PCR</option><option value ="SNP检测">SNP检测</option></select>'
						var btn='<button id="btn_xuanze_fuwuleixing" onclick="return false">确定</button>'
						var 标签框='<span id="span_xuanze_fuwuleixing" ></span>'
						h.find('#txt_gene_new_p_isplate1').eq(0).parent().next().next().append(tex)
						h.find('#txt_gene_new_p_isplate1').eq(0).parent().next().next().append(btn)
						h.find('#txt_gene_new_p_isplate1').eq(0).parent().next().next().append(标签框)
						h.find('#btn_xuanze_fuwuleixing').click(function(){
							//先清空价格折扣
							h.find('#txt_gene_new_discount').eq(0).val('')
							value=h.find('#xuanze_fuwuleixing').val()
							if (value==='0' || value==='1'){return false}
							第一行折扣=折扣(h,value)
							if (第一行折扣===false){
								h.find('#span_xuanze_fuwuleixing').text('没有搜到')
								return false
							}else{
								h.find('#span_xuanze_fuwuleixing').text('')
								h.find('#txt_gene_new_discount').eq(0).val(第一行折扣)
							}
						})
					}
					
				}
				
			})
		})
	}
}
//根据服务类型查询折扣
function 折扣(html,服务类型){
	//如果没有选择客服则退出
	客户_行信息=html.find('#txtSearch').val()
	if (客户_行信息===""){return false}
	if (客户_行信息.split('——').length<=6){return false}
	课题组ID=客户_行信息.split('——')[2]
	url="/geneNew/ashx/GeneNewSampleHandler.ashx?_search=true&nd=1660736555992&rows=1&page=1&sidx=gene_new_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22gene_new_p_ketizu_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+课题组ID+"%22%7D%2C%7B%22field%22%3A%22gene_new_p_service_kind%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+服务类型+"%22%7D%5D%7D"
	result=false
	$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
	$.get(url,function (data,status) {
			//总共有多少页
			总页数=文本_取中间文本(data,'totalpages":"','"')
			if (总页数!=='0'){
				第一行折扣=data.split('gene_new_p_discount":"')[1].split('"')[0]
				result=第一行折扣
			}else{
				result=false
			}
		});
	return result
}
//在 基因新订单 每隔几秒显示没拍照片 		
function show_yanse(){
	var html=$('iframe[src="/geneNew/GeneNewOrderList.aspx').contents().find('body').eq(0)  // 基因新订单 页面
	var toolbar=html.find('.toolbar').eq(0)  // 找到了toolbar工具栏
	if(toolbar.find('#a_add').size()==1){
		zidong2()
		function zidong2(){
			window.clearTimeout(t2); // 每次都先清除timer
			var t2=setTimeout(function (){
				if(html.find('tbody').find('[aria-describedby=list_gene_new_cust_name]').size()>0 && html.find('[aria-describedby=list_gene_new_cust_id]').last().attr('title').indexOf('唯一')===-1){  //如果有数据 且 没有 唯一 说明没有找到，则运行
					//基因新订单  如果没有照片，则显示一个颜色
					jiyin_zhaopian();
				}
				//回调函数 不要删
				zidong2()
			},1500);
		}
	}
}
//提示 照片是否已经拍过
function jiyin_zhaopian(){
	var html=$('iframe[src="/geneNew/GeneNewOrderList.aspx').contents().find('body').eq(0)  // 基因新订单 页面
	if(html.length==1){
		html.find('#list').eq(0).find('[aria-describedby=list_gene_new_addPeople]').each(function(){
			if($(this).text()==="申高天" || $(this).text()==="冯丽丽"){
				//获取当前行的客户姓名nayil
				var name=$(this).parent().find('[aria-describedby=list_gene_new_cust_name]')
				var order=$(this).parent().find('[aria-describedby=list_gene_new_order]').text()
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.get("/geneNew/GeneNewOrderPhoto.aspx?gene_new_order="+order,
					function (data,status) {
						//如果没有搜到 说明没有照片
						if(data.indexOf('<img id=')===-1){
							name.css('color','red')
						}
					});
			}
		})
		html.find('[aria-describedby=list_gene_new_cust_id]').last().attr('title','唯一')
	}else{return false}	
}

//=======================基因新订单 结束===========================//
//=======================PCR扩增 开始===========================//                  PCR扩增 页面
//查询申高天和冯丽丽上传的订单
function jiyin_dingdan_chaxun(){
	var html=$('iframe[src="/geneNew/GeneNewSeqPcr.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了PCR扩增的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_dingdan').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_dingdan" onclick="return false">查询订单</button>')  //添加按钮
		}else{return false}
		toolbar.find('#button_dingdan').eq(0).click(function(){
			toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
			$('#searchForm').eq(0).find("option[value='gene_new_p_addpeople']").attr('selected','selected')  //把找到的第一个查询条件改成 添加人
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('申高天')
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val('冯丽丽')
			$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(1).val('刘泽夫')
			$('#w').find('#radd').next().attr('checked','true')
			$("#AB").click()
		})
	}
}
//=======================PCR扩增 结束==========================//    

//=========================订单出库 开始==========================//                   订单出库 页面
//查询订单出库 周报各个分公司（5个 北京两个，广州，青岛，哈尔滨） 计价单位=个的数量的总和
function dingdanchuku_zhoubao_tongji_ge(){
	var html=$('iframe[src="/seq/SeqOrderOut.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了订单出库的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_tongjizongshu').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<input type="date" id="qian_shijian">')  //添加前时间
			toolbar.find("#qian_shijian").val(getday_y_n("zuori---"))//设置默认时间为昨天
			toolbar.append('<input type="date" id="hou_shijian">')  //添加后时间
			toolbar.find("#hou_shijian").val(getday_y_n("zuori---"))//设置默认时间为昨天
			toolbar.append('<button  id="button_tongjizongshu" onclick="return false">统计各个分公司数量总和</button>')  //添加按钮
			toolbar.append('<input type="text" id="result_zong" size="120"> ')  //结果显示
		}else{return false}
		toolbar.find('#button_tongjizongshu').eq(0).click(function(){
			//清空结果文本框
			toolbar.find('#result_zong').val("")
			var tage=0
			var qian=toolbar.find("#qian_shijian").val()
			qian=qian.replace(/-/g,"")
			var hou=toolbar.find("#hou_shijian").val()
			hou=hou.replace(/-/g,"")
			//北京 38   亦庄 81 广州 53 青岛 60 哈尔滨 70
			var gongsi_ID=["38","81","53","60","70"]
			var gongsi_name=["北京分公司","北京亦庄分公司","广州分公司","青岛分公司","哈尔滨分公司"]
			if(qian==hou){
				var result_tongji=qian+" 找到的结果为： "
			}else{
				var result_tongji=qian+" 到 "+hou+"找到的结果为： "
			}
			for (i=0;i<5;i++ ){
				if(tage==1){
					//当查询的类型和数量的arr长度不一致时 tage=1  弹框 退出
					alert("查询出现问题，请重新查询")
					break
				}
				tijiao="/SEQ/xmldata/xmlTimeMoneyReport.aspx?begtime="+qian+"&endtime="+hou+"&seqo_Belongs_id="+gongsi_ID[i]+"&orderSetKind=custmer"
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				$.get(tijiao,
					function (data) {
						//匹配类型==如 条  个  等等======================================================
						leixing= data.match(/<seq_money_unit>.*?<\/seq_money_unit>/g)
						//匹配 产品规格  如 PCR纯化费 PCR扩增=====================================
						chanpinguige= data.match(/<seq_money_name>.*?<\/seq_money_name>/g)
						//如果没有匹配到类型 比如 <seq_money_unit>个</seq_money_unit> 说明没有数据
						if(leixing == null){
							result_tongji=result_tongji+gongsi_name[i]+": 0 "
							if(i==4){
								toolbar.find('#result_zong').val(result_tongji)
							}
							return true
						}
						console.log("第",i,"次运行")
						//map函数 使用该函数去掉 leixing 左右两遍无用的东西
						function qudiaoliangbian_leixing(value){
							value=value.replace("<seq_money_unit>","")
							value=value.replace("</seq_money_unit>","")
							return value
						}
						leixing=leixing.map(qudiaoliangbian_leixing)  //如 个 条
						
						function qudiaoliangbian_chanpinguige(value){
							value=value.replace("<seq_money_name>","")
							value=value.replace("</seq_money_name>","")
							return value
						}
						chanpinguige=chanpinguige.map(qudiaoliangbian_chanpinguige)  //如   PCR纯化费 PCR扩增
						//匹配个数=================================================================
						amount=data.match(/<seq_money_amount>.*?<\/seq_money_amount>/g)
						//map函数 使用该函数去掉左右两遍无用的东西
						function shuliang_qudiaoliangbian(value){
							value=value.replace("<seq_money_amount>","")
							value=value.replace("</seq_money_amount>","")
							return value
						}
						amount=amount.map(shuliang_qudiaoliangbian)
						if(leixing.length!=amount.length){
							tage=1
							return true
						}
						//如果是广州分公司 则按照 产品规格不为 PCR纯化费 PCR扩增  如果是其他的 则按照 leixing 为“个”
						//i==2 说明是广州分公司
						if(i==2){
							chanpinguige.forEach(function(item,index){
								if(item.toUpperCase()=="PCR纯化费" || item.toUpperCase()=="PCR扩增"){
									amount[index]="0"
								}
							})
						}else{
							leixing.forEach(function(item,index){
								if(item!="个"){
									amount[index]="0"
								}
							})
						}
						amount_str=amount.join("+")
						re=eval(amount_str)
						result_tongji=result_tongji+gongsi_name[i]+": "+re+"  "
						toolbar.find('#result_zong').val(result_tongji)
					});
			}
			alert("查询完毕！")
		})
	}
}

//当前页面的每个订单的总反应数，放在 订单信息 里面
function dingdanchuku_每个订单反应数(){
	var html=$('iframe[src="/seq/SeqOrderOut.aspx"]').contents().find('body').eq(0)//如果找到 则说明找到了订单出库的页面
	if(html.length===1){
		var toolbar=html.find('.toolbar').eq(0)
		if(toolbar.find('#button_fanyingshu').size()==0){//如果是第一次则运行下面代码
			toolbar.append('<button  id="button_fanyingshu" onclick="return false">显示每个订单的反应数</button>')  //添加按钮
		}else{return false}
		toolbar.find('#button_fanyingshu').eq(0).click(function(){
			html.find('#list').eq(0).find('[aria-describedby=list_seqo_id]').each(function(){
				当前订单号=$(this).text()
				var 订单信息=$(this).parent().find('[aria-describedby=list_seqo_order_info]')
				$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
				//访问测序样品界面
				$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1678871126677&rows=10&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqo_order_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+当前订单号+"%22%7D%5D%7D",
					function (data,status) {
						console.log(当前订单号)
						//正则表达式求总反应数
						var 反应总数=data.match(/(totalrecords":")(.*?)(?=","gridda)/)[0].substr(15)
						$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
						$.get("/seq/ashx/SeqSampleHandler.ashx?_search=true&nd=1678871126677&rows="+反应总数+"&page=1&sidx=seqs_prod_id&sord=desc&filters=%7B%22groupOp%22%3A%22AND%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22seqo_order_id%22%2C%22op%22%3A%22eq%22%2C%22data%22%3A%22"+当前订单号+"%22%7D%5D%7D",
							function (data,status) {
								//正则表达式求总反应数
								反应总数=data.match(/(totalrecords":")(.*?)(?=","gridda)/)[0].substr(15)
								流程状态_arrarr=文本_取中间文本_批量(data,'seqs_process":"','",')
								//报告成功 失败次数
								var 报告成功次数=0
								var 报告失败次数=0
								for(var i=0;i<流程状态_arrarr.length;i++){
									if(流程状态_arrarr[i]=="报告成功"){
										报告成功次数+=1
									}
									if(流程状态_arrarr[i]=="报告失败"){
										报告失败次数+=1
									}
								}
								订单信息.text(订单信息.text()+'反应数是:'+反应总数+" 报告成功反应数:"+报告成功次数+" 报告失败反应数:"+报告失败次数)
							});
						//订单信息.text(订单信息.text()+'反应数是:'+反应总数)
					});
			})
		})
	}
}
//=========================订单出库 结束==========================//   

//=========================基因新管理 开始==========================//   
//基因返还页面 查询 返还单生成
function 基因返还_查询返还单生成(html){
	var toolbar=html.find('.toolbar').eq(0)
	if(toolbar.find('#button_fanhuandan_shengcheng').size()==0){//如果是第一次则运行下面代码
		toolbar.append('<button  id="button_fanhuandan_shengcheng" onclick="return false">查询返还单生成</button>')  //添加按钮
	}else{return false}
	toolbar.find('#button_fanhuandan_shengcheng').eq(0).click(function(){
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		//点击 qc已排版
		$('#w').find('#return_not_ids').click()
		setTimeout('$("#AB").click()', 100)
		
	})
}
//基因QC_查询qc待处理_已排版
function 基因QC_查询qc待处理_已排版(html){
	var toolbar=html.find('.toolbar').eq(0)
	if(toolbar.find('#button_daichuli_yipaiban').size()==0){//如果是第一次则运行下面代码
		toolbar.append('<button  id="button_daichuli_yipaiban" onclick="return false">查询qc待处理_已排版</button>')  //添加按钮
	}else{return false}
	toolbar.find('#button_daichuli_yipaiban').eq(0).click(function(){
		//点击 查询
		toolbar.find('#a_search').eq(0).find('.l-btn-left').eq(0).click();
		//点击 qc已排版
		$('#w').find('#qc_already_plate_ids').click()
		//组合方式改成 or
		$('#w').find('#radd').next().attr('checked','true')
		$('#searchForm').eq(0).find("option[value='qc_gnp_plate']").attr('selected','selected')  //把找到的第一个查询条件改成 板号
		$('#searchForm').eq(0).find("[class='txt02 searchString']").eq(0).val('-1')
		$("#AB").click()
	})
}

//=========================基因新管理 结束==========================//   

//客户自己上传订单的话，显示颜色
function kehu_shenhe(){
	//如果没有网则退出
	if(navigator.onLine===false){
		return false
	}
	$.get("/seq/ashx/seqOrderwaitAduitHandler.ashx?_search=false&nd=1625315015855&rows=20&page=1&sidx=seqo_id&sord=desc&filters=",
		function (data,status) {
			geshu=data.match(/(totalrecords":")(.*?)(?=","gridda)/)[0].substr(15)
			if(geshu!="0"){
				$('a[rel="/seq/seqOrderwaitAduitList.aspx"]').eq(0).parent().parent().css('background','yellowgreen')
			}else{
				$('a[rel="/seq/seqOrderwaitAduitList.aspx"]').eq(0).parent().parent().css('background','')
			}
		});
}



//延时函数
var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};


//文本_取中间文本
function 文本_取中间文本(总文本,前面文本_必须唯一,后面文本){
	arr=总文本.split(前面文本_必须唯一)
	//如果长度为1，说明没找到 前面文本_必须唯一
	if (arr.length==1){
		return '没有找到 前面文本 '
	}
	if (arr.length>3){
		return '前面文本必须唯一'
	}
	result=arr[arr.length-1].split(后面文本)[0]
	return result
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
//网址  获取总的条数 totalrecords
function 网址_获取总条数(网址){
	result='查询失败'
	$.ajaxSettings.async = false; //get请求默认是异步的，在这里改为同步
	// 查询添加时间是今天的合成
	$.get(网址,function (data,status) {
			//如果没有找到totalpages，说明网页运行失败
			if(data.indexOf('totalrecords')==-1){
				alert('查询“订单是否已经上传过”失败，请确定是否断网或者是否需要重新登录，请重新查询！')
			}else{
				//总共有多少条数据
				总条数=文本_取中间文本(data,'totalrecords":"','"')
				result=总条数
			}
		});
	return result
}