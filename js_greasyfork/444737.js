// ==UserScript==
// @name         项目组提问小助手v1.0
// @namespace    lipei@fanruan.com
// @version      1.0.0
// @description  在项目组空间内提问时有了更高效的提问方式,丰富的选项和提示文字可以提升大家的提问效率
// @author       lipei
// @match        https://kms.fineres.com/qa/questions/ask
// @match        https://kms.fineres.com/display/project/qa/questions/ask
// @match        https://kms.fineres.com/tnqa/ask.action
// @match        https://kms.fineres.com/qa/questions/*
// @match        https://kms.fineres.com/display/project/qa/questions/*
// @match        https://kms.fineres.com/qa/questions
// @match        https://kms.fineres.com/display/project/qa/questions
// @grant        none
// @icon         https://kms.finedevelop.com/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/444737/%E9%A1%B9%E7%9B%AE%E7%BB%84%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv10.user.js
// @updateURL https://update.greasyfork.org/scripts/444737/%E9%A1%B9%E7%9B%AE%E7%BB%84%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv10.meta.js
// ==/UserScript==


(function() {
	'use strict';
	// Your code here...
	window.addCss = function(cssString) {
		const head = document.getElementsByTagName('head')[0];
		const newCss = document.createElement('style');
		newCss.type = "text/css";
		newCss.innerHTML = cssString;
		head.appendChild(newCss);
	}
	//添加css的全局方法
	//以下是添加标签的一些方法的封装
	window.addTag = function(fineTag) {
		var chosen = ''; //已经选择的标签
		$('li.select2-search-choice').each(function() {
			chosen = chosen + $(this).text().trim() + ","
		})
		if (chosen.indexOf(fineTag) == -1) {
			$('input#tags').val(chosen + fineTag.replace("</br>", ""))
			console.log(chosen + fineTag.replace("</br>", ""))
			$('input#tags').trigger('change')
		}
	}
	window.addClick = function() {
		setTimeout(function() {
			$('table#t1').find('td[index]').click(function() {
				console.log($(this).text())
				addTag($(this).text())
			})
			//非插件的单元格，点击之后直接设置标签为当前值+已选择的标签值
			$('#chajian').click(function() {
				alert("已经添加所有官方插件的问答标签,请在上方标签输入框中直接搜索插件名称~若搜不到,建议选择最接近的模块")
			}) //点击展开官方插件列表

		}, 2000)
	}
	window.getColor = function(name) {
		var color = "#00CED1";
		if (name.indexOf("finereport-") != -1 || name.indexOf("BI-") != -1) {
			color = "#FFFFE0"
		} else if (name.indexOf("决策报表-") != -1) {
			color = "#FFE1FF"
		} else if (name.indexOf("参数-") != -1) {
			color = "#F0FFF0"
		} else if (name.indexOf("图表-") != -1) {
			color = '#D1EEEE'
		} else if (name.indexOf("填报-") != -1) {
			color = '#8DB6CD'
		} else if (name.indexOf("移动端-") != -1) {
			color = 'pink'
		} else if (name.indexOf("官方插件-") != -1) {
			color = '#E0EEEE'
		} else if (name.indexOf("展现-") != -1) {
			color = '#E0FFFF'
		} else if (name.indexOf("平台-") != -1) {
			color = '#FAF0E6'
		} else if (name.indexOf("独立模块-") != -1) {
			color = '#F0F8FF'
		} else if (name.indexOf("计算-") != -1 || name.indexOf("输出-") != -1) {
			color = '#EEB4B4'
		} else if (name.indexOf("设计器-") != -1) {
			color = 'FFAEB9'
		} else if (name == "js协助") {
			color = 'pink'
		} else {
			color = '#EBEBEB'
		}
		return color;
	}
	window.getTitle = function(name) {
		var title = name;
		switch (name) {
			case "图表-需求&方案咨询":
				title = "图表的需求和逻辑确认";
				break;
			case "图表-难还原":
				title = "本地不能复现/无法稳定复现的问题";
				break;
			case "图表-接口":
				title = "图表使用中的API接口咨询";
				break;
			case "图表-报错":
				title = "图表的报错/Bug咨询";
				break;
			case "平台-其他基础模块（不包含于其他标签）":
				title = "不包含于其他标签的平台基础内容";
				break;
		}
		return title;

	}

	window.MakeTags = function(type) {
		$('#beforeAll').remove()
		var beforeAll =
			'<div id="beforeAll" style="width:1500px;margin:0 auto"><table id="t1" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="qiyong">标签名称含【旧】的请勿使用，点击下方单元格可直接添加标签</label><p>选择技巧：选择范围最大的标签，例如在新填报预览的时候入库数据不对，则选“新填报”而不是“填报-提交入库”。</br>如果是定时调度发送短信的功能异常，其他功能正常，则选择“独立模块-短信”而不是“平台-定时调度”</p></table><table id="t2" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="chajian">点我展开官方插件列表</label></table><div>'
		$('#main').append(beforeAll); //先添加两个table，要加在main后面，加在content后面的话会格式错乱

		$('td[index][name="tags"]').remove()
		$('[name="cols"]').remove()
		var tags = []
		if (type == "common") {
			switch ($('input[name="module"]:checked').val()) {
				case "报表":
					tags = ['finereport-11.0', 'finereport-10.0', 'finereport-9.0', 'finereport-8.0',
						'数据源-原生方法（非插件）', '输出-导出pdf', '输出-打印&导出（除了pdf）', '决策报表-设计/制作',
						'决策报表-展现/布局', '决策报表-离屏控制', '决策报表-取数/计算', '参数-参数计算', '参数-参数面板控件', '填报-导入excel',
						'填报-控件', '填报-提交入库&插入删除行', '填报-新填报预览', '填报-暂存',
						'展现-html解析&参数组合&icu换行', '展现-其他展现效果（例如边框/背景等）', '展现-冻结', '展现-国际化', '展现-折叠树&工具栏&条形码',
						'展现-数据分析预览', '展现-条件属性&形态&超链', '展现-水印', '展现-自适应', '独立模块-新前端', '计算-公式计算和解析',
						'计算-单元格过滤', '计算-新引擎', '计算-行式引擎&分页sql', '计算-计算性能', '设计器-操作/交互/性能', '设计器-更新升级',
						'独立模块-fvs',
						'设计器-模板版本管理', '设计器-远程设计', '独立模块-压测相关', '独立模块-多级上报', '独立模块-安全', '独立模块-宕机',
						'独立模块-性能问题', '独立模块-性能优化插件',
						'独立模块-模板展现性能', '独立模块-独立/嵌入式/集成部署', '独立模块-短信', '独立模块-邮件', '第三方插件功能确认',
						'未知-找armstrong'
					];
					break;
				case "平台":
					tags = ['finereport-11.0', 'finereport-10.0','finereport-9.0', 'finereport-8.0',
						'BI-5.0', 'BI-6.0', '独立模块-注册机制&注册异常', '独立模块-10.0升级工具&问题', '独立模块-公有私有云', '独立模块-web集群',
						'平台-8.0&9.0平台数据迁移', '平台-8.0/9.0平台功能', '平台-finedb相关', '平台-logdb相关', '平台-swift相关',
						'平台-websocket相关问题', '平台-代理相关', '平台-其他基础模块（不包含于其他标签）', '平台-前台交互&展现逻辑', '平台-外接数据库/迁移',
						'平台-外观配置', '平台-安全管理', '平台-官方接口使用', '平台-定时调度', '平台-定时调度-附件', '平台-插件管理',
						'平台-智能运维-云端运维',
						'平台-智能运维-内存管理/智能检测', '平台-智能运维-备份还原', '平台-智能运维-平台日志', '平台-智能运维-资源迁移', '平台-权限管理',
						'平台-模板认证', '平台-注册管理', '平台-用户管理', '平台-登录/用户认证', '平台-单点登录', '平台-目录管理', '平台-移动平台',
						'平台-系统管理'
					];
					break;
				case "图表":
					tags = ['finereport-11.0', 'finereport-10.0', 'finereport-9.0', 'finereport-8.0', 'BI-5.0', 'BI-6.0', 
						'图表-报错', '图表-接口', '图表-难还原', '图表-需求&方案咨询', '第三方插件-图表类'
					];
					break;
				case "移动端":
					tags = ['finereport-11.0', 'finereport-10.0', 'finereport-9.0', 'finereport-8.0', 'BI-5.0', 'BI-6.0', 
						 "移动端-fr图表", "移动端-后端&性能", "移动端-报表展现", "移动端-控件&oem平台", "移动端-集成&bi"
					];
					break;
				default:
					tags = ['finereport-10.0', 'finereport-9.0', 'finereport-8.0', 'BI-5.0', 'BI-6.0', 
						'数据源-原生方法（非插件）', '输出-导出pdf', '输出-打印&导出（除了pdf）', '决策报表-展现/布局/性能', '决策报表-离屏控制',
						'决策报表-设计/制作', '参数-参数计算', '参数-参数面板控件', '填报-导入excel', '填报-控件', '填报-提交入库&插入删除行',
						'填报-新填报预览', '填报-暂存',
						'展现-html解析&参数组合&icu换行', '展现-其他展现效果（例如边框/背景等）', '展现-冻结', '展现-国际化', '展现-折叠树&工具栏&条形码',
						'展现-数据分析预览', '展现-条件属性&形态&超链', '展现-水印', '展现-自适应', '独立模块-新前端', '计算-公式计算和解析',
						'计算-单元格过滤', '计算-新引擎', '计算-行式引擎&分页sql', '计算-计算性能', '设计器-操作/交互/性能', '设计器-更新升级',
						'设计器-模板版本管理', '设计器-远程设计', '平台-8.0&9.0平台数据迁移', '平台-8.0/9.0平台功能', '平台-finedb相关',
						'平台-logdb相关', '平台-swift相关',
						'平台-websocket相关问题', '平台-代理相关', '平台-其他基础模块（不包含于其他标签）', '平台-前台交互&展现逻辑', '平台-外接数据库/迁移',
						'平台-外观配置', '平台-安全管理', '平台-官方接口使用', '平台-定时调度', '平台-定时调度-附件', '平台-插件管理',
						'平台-智能运维-云端运维',
						'平台-智能运维-内存管理/智能检测', '平台-智能运维-备份还原', '平台-智能运维-平台日志', '平台-智能运维-资源迁移', '平台-权限管理',
						'平台-模板认证', '平台-注册管理', '平台-用户管理', '平台-登录/用户认证', '平台-单点登录', '平台-目录管理', '平台-移动平台',
						'平台-系统管理', '独立模块-fvs', '独立模块-10.0升级工具&问题',
						'独立模块-web集群', '独立模块-公有私有云', '独立模块-压测相关', '独立模块-多级上报', '独立模块-安全', '独立模块-宕机',
						'独立模块-性能问题', '独立模块-性能优化插件',
						'独立模块-模板展现性能', '独立模块-注册机制&注册异常', '独立模块-独立/嵌入式/集成部署', '独立模块-短信', '独立模块-邮件', '图表-报错',
						'图表-接口', '图表-难还原', '图表-需求&方案咨询', '第三方插件-图表类', "移动端-fr图表", "移动端-后端&性能", "移动端-报表展现",
						"移动端-控件&oem平台", "移动端-集成&bi", '未知-找armstrong', '第三方插件功能确认'
					]
			}
		} else {
			tags = ['finereport-11.0', 'finereport-10.0', 'finereport-9.0', 'finereport-8.0', 'BI-5.0', 'BI-6.0', 
				"js协助", "独立模块-安全", "数据源-原生方法（非插件）", "平台-代理相关", "平台-外接数据库", "平台-单点登录", "独立模块-web集群",
				'独立模块-宕机', '独立模块-性能问题', "独立模块-模板展现性能", "独立模块-独立/嵌入式/集成部署"
			]
		}
		var len = tags.length; //标签的总个数
		var everyCol = type = "common" ? 12 : 5; //每列标签的个数
		console.log(len + "," + everyCol)
		for (let j = 0; j < everyCol; j++) {
			$('table#t1').append('<tr name="cols" col="' + j + '"></tr>'); //生成了everyCol个tr元素
		}
		var colNum = parseInt(len / Number(everyCol)) + 1; //要生成的列数=取整(元素数量/每行元素数量)+1
		console.log(colNum)
		for (let i = 0; i < everyCol; i++) //i行
		{
			for (let t = 0; t < colNum; t++) //t列
			{
				if (tags[Number(Number(t * everyCol) + i)] != undefined) {
					var myName = tags[Number(Number(t * everyCol) + i)];
					$('table#t1').find('tr[col="' + i + '"]').append('<td name="tags" title=' + getTitle(
						myName) + ' index=' + Number(Number(t * everyCol) + i) +
						' style="cursor:pointer;font-size:16px;border:thin  solid #00CED1;background-color:' +
						getColor(myName) + '">' + myName + '</td>')
				}
			}
		}
	}
	//以上为生成标签列表的功能
	//
	//

	if (window.location.href.indexOf("ask") != -1) {
		const radioCss = `
.radio {
  margin: 0.1rem;
}
.radio-label {
  font-weight:bold;
}
.radio input[type="radio"]:checked + .radio-label:before {
  background-color: #3197EE;
  box-shadow: inset 0 0 0 4px #f4f4f4;
}
}`
		window.addCss(radioCss)

		//标签输入的合理性校验
		$('input#post').mouseenter(function() {
			window.chosen = ''; //已经选择的标签
			var zhuanjia_tags = ['fr技术支持', 'finereport-11.0', 'finereport-10.0', 'finereport-7.0',
				'finereport-8.0', 'finereport-9.0', 'fr专家协助', "js协助", "独立模块-安全", "数据源-原生方法（非插件）",
				"平台-代理相关", "平台-外接数据库", "平台-单点登录", "平台-登录", "独立模块-web集群", "独立模块-宕机", "独立模块-性能问题",
				"独立模块-模板展现性能", "独立模块-独立/嵌入式/集成部署"
			]
			var common_tags = ['fr技术支持', 'finereport-11.0', 'finereport-10.0', 'finereport-7.0',
				'finereport-8.0', 'finereport-9.0', 'fr专家协助'
			]
			window.incorrect_tags = []
			window.module_tags = [] //已经选择的模块标签数组
			$('li.select2-search-choice').each(function() {
				chosen = chosen + $(this).text().trim() + ",";
				if (zhuanjia_tags.indexOf($(this).text().trim()) < 0) {
					incorrect_tags.push($(this).text())
				} //incorrect_tags存储的是非专家模块的标签个数
				if (common_tags.indexOf($(this).text().trim()) < 0) {
					module_tags.push($(this).text())
				} //module_tags存储的是除了固定的几个标签以外，指定模块的标签
			})
			if (chosen.indexOf("fr技术支持") >= 0) {
				if (chosen.indexOf("finereport-") < 0) {
					alert("别忘了选择版本标签~")
				}
				if (chosen.indexOf("fr专家协助") >= 0 && incorrect_tags.length > 0) {
					alert("您选择了一个不在专家协助范围内的标签,请去除~")
				}
				if (module_tags.length == 0) {
					alert("您没有选择功能模块标签,这会导致问题无法推送")
				}
			}
		})


		document.getElementById("title").value = "【报表】【问题】问题描述"
		//标题
		$('input#postSpaceKeyAutoComplete').attr("placeholder", "请手动输入kms空间，然后下拉列表选择") //提示文字
		$('#postSpaceKey').val('project').trigger('change');
		document.getElementById('postSpaceKey').value = "project";
		document.getElementById('postSpaceName').value = "3.1 项目组";
		document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').innerHTML =
			"<p>【BUG链接】：</p><p>【现象】：</p><p>【详情】：</p><p>【主要疑问】：</p><p>【已参考的文档】：</p><p>【JAR包版本】：</p><p>【相关插件】：</p><p>【运行环境】：</p><p>【日志】：</p>";
		document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').title =
			`【SLA链接】：若关联，请务必直接复制SLA链接，后台可以识别到SLA信息来反馈给研发
【参考过的文档】：若查阅了相关文档但仍未解决，可以说明一下，减少重复工作
【详情】：写上执行过的排查步骤，如查询知识库/需求看板、二分法到最简；需求类问题需补充上客户的完整需求场景
【主要疑问】：结合当前问题的核心阻塞点来提问，多个问题可以用序号分开
【JAR包版本/相关插件】：如果不是最新版本，补充不能升级的原因；看看是否有二开插件
【附件】：尽量获取日志和内置数据集模版，使用insert link来上传文件
        `
		//内容和标题填充
		var notice =
			'<label  style="color:green;">标签不少于3项（团队+版本+模块），团队已经自动选择为fr技术支持。</br>模块项请选择最接近标签，后台根据标签推送给问题的责任研发/模块专家，<a target="_blank_" href="https://kms.fineres.com/pages/viewpage.action?pageId=281122133">标签选择常见问题</a>！</br>点击最下方的表格，可自动添加标签，不用再搜索啦！</br>问答推送时间：上午11点15&下午16点15，加急请找young.yang或<a target="_blank_" href="https://www.jiandaoyun.com/app/59f96c4ae1ddba302aaa624a/entry/607803373bb0e00007a5c5b5">填写表单</a></label>'
		$('input#tags').parent('div.form-item').children('label').click(function() {
			window.open("https://kms.fineres.com/pages/viewpage.action?pageId=110273236")
		})
		$('input#tags').parent('div.form-item').children('label').css("text-decoration", "underline").css("color",
			"blue") //标签可点击，高亮
		$('input#tags').parent('div.form-item').children('label').eq(0).after(notice);
		//标签说明

		//这部分无论选什么都不会变
		var target =
			'<div style="display:none"><label style="font-size:20px;color:royalblue;font-weight:bold;">请选择向谁提问</label></div><div class="radio" style="display:none"><input type="radio" class="radio-label" name="target" id="putong" value="普通版"</input><label for="putong" class="radio-label">普通版</label></div>';
		var module =
			'<div style="display:inline"><label style="font-size:20px;color:turquoise;font-weight:bold">问题模块</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="module" id="report" checked value="报表"</input><label class="radio-label"  for="report" >报表</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="module" id="bi" value="BI"</input><label for="bi" class="radio-label">BI</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="module" id="chart" value="图表"</input><label  for="chart" class="radio-label">图表</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="module" id="mobile" value="移动端"</input><label class="radio-label"  for="mobile" >移动端</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="module" id="dec" value="平台"</input><label  for="dec" class="radio-label">平台</label></div><br/>';
		var type =
			'<div style="display:inline"><label style="font-size:20px;color:SkyBlue;font-weight:bold">问题类型</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="leixing" id="wenti"  checked value="问题"</input><label for="wenti" class="radio-label">问题</label></div><div class="radio" style="display:inline"><input type="radio" class="radio-label" name="leixing" id="xuqiu" value="需求"</input><label for="xuqiu" class="radio-label">需求</label></div>'
		$('#question-form > div.page-title > h1').before("<div >" + module + "<br>" + type + "<br>" + target +
			"</div>")


		setTimeout(function() {
			$('input[type="radio"][name="target"][value="普通版"]').click()
		}, 2000)

		$('input[type="radio"][name="target"]').click(function() {
			$('a[name="my-link"]').remove()
			$('#ps').remove()
			if ($(this).val() == "普通版") {
				$('#tags').val('项目组')
				$('#tags').trigger('change')
				$("[name='xswl']").remove()
				$("[name='yqtx']").remove()
				//$('.post-editor').after("<div id='ps'><p style='color:red;font-size:25px'>P.S</p><p>详情有图片现象则直接贴图，省去下载的步骤。</p><p>如果对这个问题做出了自己的尝试，务必列出排查过程</p><p>说明主要疑问可以帮助理解，解决问题更高效</p><p>相关插件若无则不写</p><p>使用insert link来上传文件，尽量截取与问题相关的那一段日志，尽量避免整个上传</p></div>")
				$('#question-form > div.page-title > h1').append(
					'<a name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=101228930">&nbsp;&nbsp;&nbsp;&nbsp;请熟读问答规范</a>'
					)
				
				//加两个超链
				MakeTags("common");
				addClick()
			} else {
				$('#tags').val('fr技术支持,fr专家协助,finereport-10.0')
				$('#tags').trigger('change')
				$('#chajian').remove()
				$("[name='xswl']").remove()
				$('#question-form > div.page-title > h1').append(
					'<a name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=250009228">&nbsp;&nbsp;&nbsp;&nbsp;来看看专家负责的问题</a>'
					)
				$('#question-form > div.page-title > h1').append(
					"<label name='xswl' style='color:red'>  ←这是一个超链</label><label name='yqtx' style='color:green'><br/>专家版仅支持选择表格中列出的标签!!其他勿选!!</label>"
					)
				MakeTags("special")
				addClick()
			}
		})

		$('input[type="radio"][name!="target"][id]').click(function() {
			MakeTags("common")
			addClick()
			document.getElementById("title").value = "【" + $('input[name="module"]:checked').val() + "】【" +
				$('input[name="leixing"]:checked').val() + "】问题描述"
		}) //上面两个单选按钮组选中时修改标题

		$('label[for="xuqiu"]').click(function() {
			var xuqiukanban =
				"<a id='xuqiukanban' href='https://bi.finereporthelp.com/webroot/decision/link/R3lT' style='font-weight:bold;font-color:red' target='_blank_'>请先打开需求查询看板进行搜索</a>"
			if ($('#xuqiukanban').length == 0) {
				$(this).after(xuqiukanban)
			}
		})
	} else if (window.location.href.indexOf("edit") != -1) {
		setTimeout(function() {
			console.log("编辑界面")
			MakeTags("common")
			addClick()
		}, 1000)
	} else {
		function MySearch() {
			var inputString = $('#question-search').children('input').attr("value");
			if (inputString.length == 0) {
				alert("请输入搜索内容")
			} else {
				window.open('https://kms.fineres.com/dosearchsite.action?cql=siteSearch+~+"' + inputString +
					'"+and+type+%3D+%22com.elitesoftsp.confluence.tiny.question.answer.plugins%3Aquestion%22')
			}
			window.open('http://knowledge.fanruan.com/index.php?search-fulltext-title-' + inputString)
		}
		if (window.location.href.indexOf("qa/questions/?page=") != -1 || window.location.href ==
			"https://kms.fineres.com/display/project/qa/questions" || window.location.href ==
			"https://kms.fineres.com/qa/questions") {
			console.log("首页")
			setTimeout(function() {
				$('#content').css("max-width", "none")
				$('#question-search').after('<button id="myButton">点我可以全文检索</button>')
				$('a.question-hyperlink[href^="/display/project/qa/questions/"]').css("font-size", "18px")
					.css("font-weight", 700).css("color", "rgba(64,116,52,0.8)")
				$('.excerpt').eq(0).css("color", "rgba(3,38,58,1").css("font-weight", 500)
				//修改字体样式
				var w = $('.status').eq(0).css("width")
				var ht = $('.status').eq(0).css("height")
				var imgg = '<div align="center" style="width:' + w + ';height:' + ht +
					'"><img id="solved" alt="Solved" title="Solved" src="/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/accepted.png"></div>'
				$('.question-summary').has('#solved-question').each(function() {
					$(this).find('.statscontainer').find('.stats').find('.status').after(imgg)
				})
				//闭环更明显
				$('#myButton').click(function() {
					MySearch()
				})
			}, 500)
			//全文检索功能
		}
	}
})();
