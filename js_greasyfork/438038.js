// ==UserScript==
// @name         E-Hentai E绅士中文版
// @namespace    Exhentai_叶海晨星
// @namespace    Tast
// @namespace    2016+, Mapaler <mapaler@163.com>
// @version      0.66
// @description  E绅士中文化
// @author       Tast
// @include      *://exhentai.org/*
// @include      *://ul.exhentai.org/*
// @include      *://*e-hentai.org/*
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_getResourceURL
// @icon         http://exhentai.org/favicon.ico
// @require      https://code.jquery.com/jquery-1.12.3.min.js
// @require 	 https://greasyfork.org/scripts/20286-chinesetr/code/ChineseTR.js
// @require 	 https://code.jquery.com/ui/1.12.0-rc.2/jquery-ui.min.js
// @resource 	 JQUI	https://code.jquery.com/ui/1.12.0-rc.2/themes/smoothness/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/438038/E-Hentai%20E%E7%BB%85%E5%A3%AB%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/438038/E-Hentai%20E%E7%BB%85%E5%A3%AB%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==
//==============================================变量声明==============================================
//https://code.jquery.com/ui/
// @resource 	 testjs		http://tast.banner.tw/Javascript/EHentai/Ehentai.user.js
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @require 	 https://greasyfork.org/scripts/20312-e-hentai-tag-list-for-chinese/code/E-Hentai%20Tag%20list%20for%20Chinese.js?version=130078
// @require		 https://greasyfork.org/scripts/20341-eh-chinese-cn-lib-js/code/EH-chinese_CNlibjs.js?version=130143
//======================================================================================================================

//alert(JSON.stringify(Page_CN));
var url	 		= window.location.href;
var TRvalue 	= GM_getValue("TRlang", "tw");
var Page 		=
{
	"main":
	{
		 "p[id='frontpage'] a"				:"回到首页"
		,"#lb a:contains('Overview')"		:"概况状态"
		,"#lb a:contains('My Stats')"		:"信息统计"
		,"#lb a:contains('My Settings')"	:"个人设置"
		,"#lb a:contains('Hentai@Home')"	:"绅士之家"
		,"#lb a:contains('Donations')"		:"赞助捐款"
		,"#lb a:contains('Hath Perks')"		:"特殊功能"
		,"#lb a:contains('Hath Exchange')"	:"骇斯市集" //哈希
		//,"#lb a:contains('GP Exchange')"	:"ＧＰ市场" //Gallery Points
		,"#lb a:contains('GP Exchange')"	:"图币市场" //Gallery Points
		,"#lb a:contains('Credit Log')"		:"交易记录"
		,"#lb a:contains('Karma Log')"		:"业力记录" //https://ehwiki.org/wiki/Karma/Chinese
		,"p.ip a:contains('Front Page')"	:"回到首页"
		
		
		,"#toppane h1.ih:contains('E-Hentai Galleries: The Free Hentai Doujinshi, Manga and Image Gallery System')":
			"<a href='https://goo.gl/OJksVO'>E绅士图库：免费的绅士同人志、漫画、图片画册系统</a>"
		,"#toppane h1.ih:contains('ExHentai.org - The X Makes It Sound Cool')":
			"<a href='https://goo.gl/OJksVO'>EX绅士图库：中文化 By Tast</a>"
		,"#searchbox p.nopm a:contains('Show Advanced Options')"	:"显示高级搜索"
		,"#searchbox p.nopm a:contains('Show File Search')"			:"显示以图搜图"
		,"div.ido p:contains('No hits found')":"<font color='red'><b>没有任何发现</b></font>"
		
		//以图搜图
		,"#searchbox p:contains('Showing results for file:')"	:"显示图片搜索："
		,"#searchbox label:contains('Only Search Covers')"		:"只搜索画册封面"
		,"#searchbox label:contains('Show Expunged')"			:"显示隐藏画册"
		,"#searchbox a:contains('Perform a new search')"		:"开启新搜索"
		,"#searchbox span:contains('disabled')"					:"关闭"
		
		//列表模式
		,"div.ido table.itg th:contains('Published')"	:"发表时间"
		,"div.ido table.itg th:contains('Name')"		:"标题"
		,"div.ido table.itg th:contains('Uploader')"	:"上传者"
		
		,"ReplaceMode":
		[
			 ["html","div.dp"
				,"E-Hentai Galleries is a free service from "
				,"E绅士图库是免费的服务并来自于 "]
			,["html","div.dp a"
				,"E-Hentai - Free Hentai, Doujinshi, Manga, CG Sets, H-Anime"
				,"E绅士 - 免费绅士，同人志，漫画，CG图片，H动画"]
			,["html","div.dp"
				,"Please read the "
				,"请先阅读 "]
			,["html","div.dp a"
				,"Terms of Service"
				,"合约条款"]
			,["html","div.dp"
				,"before participating with or uploading any content to this site."
				,"后使用本站功能."]
			,["html","div.ido p.ip a"	,"Visit the E-Hentai Main Site"	,"E绅士主站"]
			,["html","div.ido p.ip a"	,"Visit the E-Hentai Forums"	,"E绅士论坛"]
			,["html","div.ido p.ip a"	,"E-Hentai @ Twitter"			,"E绅士推特"]
			,["html","div.ido p.ip a"	,"Play the HentaiVerse Minigame","E绅士游戏"]
			,["html","div.ido p.ip a"	,"Lo-Fi Version"				,"E绅士移动版"]
			
			//以图搜图
			,["html","#searchbox p:contains('a new search to alter this.')"
				,"Similarity Scan was "
				,"相似度搜索已经为此次搜索"]
			,["html","#searchbox p:contains('a new search to alter this.')"
				," for this search. You must start a new search to alter this."
				,".  你必须启动新搜索启用相似度搜条件."]
			 
			 
			,["attr","#searchbox input[name='f_search']",	"placeholder"		,"输入搜索"]
			,["attr","#searchbox input[name='f_apply']"	,	"value"				,"确定"]
			,["attr","#searchbox input[name='f_clear']"	,	"value"				,"清除"]
			
			,["attr","#searchbox p.nopm a:contains('显示高级搜索')"	,	"title"	,"显示/隐藏高级搜索"]
			,["attr","#searchbox p.nopm a:contains('显示以图搜图')"	,	"title"	,"显示/隐藏以图搜图"]
			
			,["modi","#searchbox p.nopm a"	,{
				"Show Advanced Options"	:"显示高级搜索",
				"Show File Search"		:"显示以图搜图"
			}]
			
			,["modi","#advdiv"	,{
				 "Search Gallery Name"			:"搜索图册名称"
				,"Search Gallery Tags"			:"搜索图册标签"
				,"Search Gallery Description"	:"搜索图册描述"
				,"Search Torrent Filenames"		:"搜索种子文件名称"
				,"Search Low-Power Tags"		:"搜索低等的图册标签"
				,"Show Expunged Galleries"		:"显示隐藏图册"
				,"Only Show Galleries With Torrents":"只显示有种子的图册"
				,"Search Downvoted Tags"		:"搜索低评价的标签"
				,"Minimum Rating:"				:"搜索大于星星数："
				,'2 stars':"2 星"
				,'3 stars':"3 星"
				,'4 stars':"4 星"
				,'5 stars':"5 星"
			}]
			
			,["modi","#fsdiv"	,{
				"If you want to combine a file search with a category/keyword search, upload the file first.":
					"如果你想要文件与类型、关键字一起搜索，请先上传文件.",
				"Select a file to upload, then hit File Search.":
					"选择一个文件并点击文件搜索按钮.",
				"All public galleries containing this exact file will be displayed.":
					"任何公开包含此图片档的画册都会被显示.",
				"For color images, the system can also perform a similarity lookup to find resampled images.":
					"如果使用彩色图片，系统会检测画册中最相似的图片.",
					
				"Use Similarity Scan"	:"使用图片类似度搜索",
				"Only Search Covers"	:"只搜索画册封面",
				"Show Expunged"			:"显示被隐藏的画册",
				'name="f_sfile" value="File Search"':'name="f_sfile" value="搜索文件"'
			}]
			,["html","#iw"
				,"Note: No file was uploaded, or the uploaded file was invalid. Better luck next time."
				,"注意：无上传文件，或文件不可用. 祝你下一次成功."]
			//搜索信息
			,["html","#iw p.nopm:contains('The keyword ')"
				,"The keyword "
				,"关键字「"]
			,["html","#iw p.nopm:contains(' is too short, and was therefore skipped.')"
				," is too short, and was therefore skipped. Use an exact search or combine it with other words by using quotes."
				,"」，过短因此忽略，请使用更精确的搜索条件或使用\"引号\"结合其他带有空格的关键字."]
			
			//其他
			,["html","div.ido p.ip"							,"Showing"	,"显示"]
			,["html","div.ido p.ip"							,"of"		,"共有"]
			,["html","div.id42"								,"files"	,"页"]
			,["attp","img.tn[src*='.org/g/t.png']"	,"title"
				,"Torrents exist for this gallery"
				,"本画册附有种子"]
			,["html","#pt","Popular Right Now"				,"热门画册显示区"]
		]
		
	},
	
	"g.e-hentai.org/":
	{
	},
	"exhentai.org/":
	{
	},
	
	"e-hentai.org/":
	{
		//主页
		 "#newshead strong:contains('Welcome to E-Hentai Classic, the portal to the E-Hentai Universe.')":
			"欢迎来到E绅士首页：通往E绅士大宇宙的星门所在."
		,"#newshead strong:contains('E-Hentai Galleries')":
			"E绅士图库"
		,"#searchform a:contains('News & Updates')":
			"新闻 & 新知"
		,"#searchform a:contains('Wiki FAQ')":
			"维基问答"
		,"#searchform a:contains('E-Hentai Galleries')":
			"E绅士图库"
		,"#searchform a:contains('E-Hentai Forums')":
			"E绅士论坛"
		,"#searchform a:contains('The HentaiVerse')":
			"HentaiVerse游戏"
		,"#searchform a[href='https://ehwiki.org/']:contains('EHWiki')":
			"E绅士维基百科"
		,"#lbs a[href='http://e-hentai.org/?search=']:contains('Search')":
			"搜索"
		,"#lbl a[href='http://e-hentai.org/?search=']:contains('List')":
			"列表"
		,"#sde em:contains('keyword')":
			"关键字"
		,"td.rbk:contains('Henjutsu Level')":
			"绅士等级"
		,"td.rbk:contains('Credit Balance')":
			"绅士币余额"
		//搜索页
		,"#mtd div.sdrl a:contains('Show gallery results as list')":
			"搜索结果以列表显示"
		,"#mtd div.sdm a:contains('Repeat search on E-Hentai Galleries')":
			"在E绅士新版图库搜索"
		//画册内容
		,"td.atk:contains('Series:')"		:"系列："
		,"td.atk:contains('Circle:')"		:"画家："
		,"td.atk:contains('Uploader:')"		:"上传："
		,"td.atk:contains('Language:')"		:"语言："
		,"td.atk:contains('Posted:')"		:"发表："
		,"td.atk:contains('Images:')"		:"图数："
		,"div[id='gcb']:contains('(This space was intentionally left blank.)')"	:"( 无叙述 )"
		,"table.at a[onclick*='archiver.php']:contains('Download Archive')"		:"下载图包"
		,"td.atv:contains('Japanese')"		:"日文"
		,"td.atv:contains('English')"		:"英文"
		,"td.atv:contains('Chinese')"		:"中文"
		,"td.atv:contains('Dutch')"			:"菏兰语"
		,"td.atv:contains('French')"		:"法文"
		,"td.atv:contains('German')"		:"德文"
		,"td.atv:contains('Hungarian')"		:"匈牙利文"
		,"td.atv:contains('Italian')"		:"意大利文"
		,"td.atv:contains('Korean')"		:"韩文"
		,"td.atv:contains('Polish')"		:"波兰语"
		,"td.atv:contains('Portuguese')"	:"葡萄牙文"
		,"td.atv:contains('Russian')"		:"俄语"
		,"td.atv:contains('Spanish')"		:"西班牙语"
		,"td.atv:contains('Thai')"			:"泰语"
		,"td.atv:contains('Vietnamese')"	:"越南文"
		,"td.atv:contains('N/A')"			:"N/A无法辨识"
		,"td.atv:contains('Other')"			:"其他"
		
		,"ReplaceMode":
		[
			 ["html","#newshead div a"
				,"For more updated galleries, you can check out "
				,"浏览画册请至："]
			,["html","#newshead div a"
				,"- the next generation free hentai gallery system."
				,"- 次世代版的免费绅士画册系统."]
			//搜索页
			,["attr","#mtd input[value='Hentai Search']"		,"value","绅士搜索"]
			,["attr","#mtd input[value='I\\'m Feeling Horny']"	,"value","我硬了!!"]
			,["attr","#mtd input[value='Search']"				,"value","搜索"]
			,["attr","#mtd input[value='Clear']"				,"value","清除"]
			
			,["html","#sde p"
				,"If no search class is specified, "
				,"如果没有指定搜索的标签类型，"]
			,["html","#sde p"
				,"the following are searched: title, tag, series and circle."
				,"可用：title, tag, series and circle."]
			,["html","#sde p"
				,"You can restrict or expand search classes using the prefixes listed below."
				,"<br>限制或扩大搜索类型，使用下面前缀列表."]
			,["html","#sde p"
				,'You can search for a phrase by putting it "in quotes", '
				,"<br>使用「\"夹住号\"」搜索短词关键字，"]
			,["html","#sde p"
				,"and exclude keywords and phrases by prefixing it with a dash/minus \\(-\\)."
				,"并且使用减号「-」排除该关键字的搜索目标."]
			,["html","#sde p:contains(' does a normal title search.')"
				,"does a normal title search."
				," - 搜索画册标题."]
			,["html","#sde p:contains(' searches the tags assigned to the galleries.')"
				,"searches the tags assigned to the galleries."
				," - 搜索画册标签."]
			,["html","#sde p:contains(' searches series names and aliases.')"
				,"searches series names and aliases."
				," - 搜索系列名称和别名."]
			,["html","#sde p:contains(' searches circle names and aliases.')"
				,"searches circle names and aliases."
				," - 搜索选定画家名称和别名."]
			,["html","#sde p:contains(' searches the work\\'s language.')"
				,"searches the work's language."
				," - 搜索画作语言."]
			,["html","#mtd div.sdrh:contains('matching galleries:')"
				,"Found "
				,"发现 "]
			,["html","#mtd div.sdrh:contains('matching galleries:')"
				,"matching galleries: "
				,"个画册："]
			,["html","#mtd div.sdm:contains('Could not find what you were looking for?')"
				,"Could not find what you were looking for?"
				,"找不到你想要的?"]
			//画册列表模式
			,["html","#lrc:contains(' of ')"
				,"Showing"
				,"显示"]
			,["html","#lrc:contains(' of ')"
				,"of"
				,"共"]
			
		]
	},
	
	"hentaiathome.php":
	{
		//主页
		 "div.stuffbox h1:contains('Hentai@Home Clients')"			:"Hentai@Home 绅士之家客户端"
		,"#div_stats th:contains('H@H Region')"						:"区域"
		,"#div_stats th:contains('Available Network Capacity')"		:"总有效网络流量"
		,"#div_stats th:contains('Used Network Capacity')"			:"总使用网络流量"
		,"#div_stats th:contains('Util%')"							:"比例%"
		,"#div_stats th:contains('Cover')"							:"覆盖率"
		,"#div_stats td:contains('North and South America')"		:"北美和南美"
		,"#div_stats td:contains('Europe and Africa')"				:"欧洲和非洲"
		,"#div_stats td:contains('Asia and Oceania')"				:"亚洲和大洋洲"
		,"#div_stats td:contains('Total')"							:"总计"
		,"#div_clients p:contains('Your Active Clients')"			:"你使用的客户端"
		,"#div_clients p a:contains('PM Tenboro')"					:"Tenboro 碳波罗"
		,"#div_clients table.hct th:contains('Client')"				:"客户端"
		,"#div_clients table.hct th:contains('ID')"					:"编号"
		,"#div_clients table.hct th:contains('Status')"				:"状态"
		,"#div_clients table.hct th:contains('Created')"			:"建立日期"
		,"#div_clients table.hct th:contains('Last Seen')"			:"最后上线"
		,"#div_clients table.hct th:contains('Files Served')"		:"已确定文件数量"
		,"#div_clients table.hct th:contains('Client IP')"			:"客户端IP"
		,"#div_clients table.hct th:contains('Port')"				:"连接端口"
		,"#div_clients table.hct th:contains('Version')"			:"版本号"
		,"#div_clients table.hct th:contains('Max Speed')"			:"最大速度"
		,"#div_clients table.hct th:contains('Trust')"				:"信任度"
		,"#div_clients table.hct th:contains('Quality')"			:"品质"
		,"#div_clients table.hct th:contains('Hitrate')"			:"连接比率"
		,"#div_clients table.hct th:contains('Hathrate')"			:"骇斯比率"
		,"#div_clients table.hct th:contains('Country')"			:"国家"
		,"div.stuffbox p:contains('Client Download')"				:"客户端下载"
		,"#div_download table th:contains('File')"					:"文件"
		,"#div_download table th:contains('Size')"					:"大小"
		
		//设置页
		,"div.stuffbox td:contains('Client ID#:')"					:"客户端编号#:"
		,"div.stuffbox td:contains('Client Key:')"					:"客户端密钥:"
		,"div.infotitle:contains('Port for Incoming Connections')"	:"连入的通信端口"
		,"div.infotitle:contains('Client Name')"					:"客户端名称 ( 随意填 )"
		,"div.infotitle:contains('Maximum Burst Speed')"			:"最大连接速度"
		,"div.infotitle:contains('Hourly Bandwidth Limit')"			:"每小时流量限制"
		,"div.infotitle:contains('Maximum Disk Cache Size')"		:"最大缓存容量 ( 硬盘使用量 )"
		,"td.infota:contains('Advanced Settings')"					:"高级设置"
		,"div.infotitle:contains('Reset Client Key')"				:"重设客户端密钥"
		,"div.infotitle:contains('Local Network Host IP Address')"	:"本地端网络IP地址"
		,"div.infotitle:contains('Minimum space to leave on disk')"	:"最小保留容量 ( 硬盘保留空间大小 )"
		,"div.infotitle:contains('Client Proxy Mode')"				:"客户端代理模式"
		,"div.infotitle:contains('Scheduler')"						:"调度"
		,"div.infotitle:contains('Static Ranges')"					:"静态文件范围 ( 可用文件列表 )"
		,"div.infotitle:contains('Miscellaneous Toggles')"			:"杂项开关"
		
		,"td.infotv:contains('The settings below are optional advanced settings.')":"以下高级设置请先了解后更改"
		
		,"label[for='f_disable_bwm']"			:"取消客户端连接速度限制"
		,"label[for='f_verify_cache']"			:"下次启动检查缓存完整性"
		,"label[for='f_reducestatic_ok']"		:"如果需要就移除静态文件范围"
		,"label[for='resetkey']"				:"重设密钥"
		,"table.infot span:contains('Not Set')"	:"尚未设置"
		,"label[for='resetstaticranges']"		:"重设静态范围"
		,"label[for='f_disable_logging']"		:"关闭硬盘记录：稍微降低硬盘使用率，错误依然会记录."
		,"label[for='f_use_less_memory']"		:"低内存模式：提高内存和硬盘使用率."
		
		,"a[href*='hentaiathome.php']:contains('[Back to Overview]')":"回到上一页"
		
		//调度设置
		,"td:contains('Active')"		:"启用"
		,"td:contains('Mon')"			:"周一"
		,"td:contains('Tue')"			:"周二"
		,"td:contains('Wed')"			:"周三"
		,"td:contains('Thu')"			:"周四"
		,"td:contains('Fri')"			:"周五"
		,"td:contains('Sat')"			:"周六"
		,"td:contains('Sun')"			:"周日"
		,"td:contains('Start Hour')"	:"开始时间"
		,"td:contains('End Hour')"		:"停止时间"
		,"td:contains('Burst Speed')"	:"最大速度"
		,"td:contains('Hourly Limit')"	:"流量限制"
		,"td:contains('Hourly Limit')"	:"流量限制"
		,"a[href*='act=settings']:contains('[Back to Settings]')":"回设置页"
		
		,"ReplaceMode":
		[
			//主页
			 ["html","#div_stats td" 
				,"Stats are near-realtime and update every minute."	
				,"统计表每分钟更新一次."]
			,["html","#div_stats td" 
				,"Util% is based on the region of the visitor rather than the client, "
				,"比例%的区域基于网络访问者而非客户端，"]
			,["html","#div_stats td" 
				,"and can therefore be over 100%."
				,"因此可能是100%以上."]
			,["html","#div_stats td" 
				,"Cover denotes the average number of times a static file range can be found within a given region, "
				,"覆盖率代表该地区中静态文件范围的次数平均数，"]
			,["html","#div_stats td" 
				,"indicating the total available storage capacity."
				,"并指出总有效网络流量."]
				
			,["html","#div_clients p"
				,"To add more clients, "
				,"如要加入更多客户端的话，请联系管理员 "]
			,["html","#div_clients p"
				,"Make sure to read the requirements first to make sure that you qualify."
				,"<br>请先详细阅读客户端营运需求确定拥有资格."]
			,["html","#div_clients p"
				,"Include the specs for the client in the message, "
				,"<br>客户端消息中包含规格信息，"]
			,["html","#div_clients p"
				,"and specify whether it is a home connection or a VPS/Dedicated."
				,"并且指定使用的是家用网络或虚拟主机 / 专业主机."]
			,["html","#div_clients p"
				,"Each client requires its own unique public IPv4 address to run, "
				,"<br>每一个客户端必须拥有单独公开的IPv4地址才可运作，"]
			,["html","#div_clients p"
				,"and must either be reachable directly from the Internet, "
				,"而且可以直接连接到互联网，"]
			,["html","#div_clients p"
				,"or have a port forwarded." 
				,"或有设置好<a href='https://zh.wikipedia.org/zh-tw/%E7%AB%AF%E5%8F%A3%E6%98%A0%E5%B0%84' target='_bank'>端口映射</a>."]
			,["html","#div_clients p"
				,"These are technical requirements, and it is not possible to make any exceptions."
				,"这些是技术上的需求，没有任何意外."
				+"<br><br>额外说明："
				+"<br>给管理员 Tenboro 碳波罗 发送客户端申请之后假如太久没回应，请勿大肆发送询问或重复发送消息."
				+"<br>管理员平时太忙被烦到不爽小心帐号GG.<br>"
				]
			,["html","#div_clients p"
				,"If the auto-detected country is wrong, "
				,"如果系统自动检测的国家错误，"]
			,["html","#div_clients p"
				,"contact Tenboro to have an override applied."
				,"请联系 Tenboro 碳波罗等待修正."]
			,["html","#div_clients p"
				,"Include the correct country, client ID and IP address in your message, "
				,"<br>联系消息中请具备正确的国家名称、客户端编号、网络IP地址，"]
			,["html","#div_clients p"
				,"and make sure to keep your client running."
				,"并且保持客户端运作良好且有效连接."]
			,["html","#div_clients p"
				,"Having the client set to the wrong country will make it perform worse than it would otherwise do."
				,"<br>请注意，错误的国家区域会让客户端的性能运作比原本更糟."]
				
			,["html","#div_download p"
				,"The current version of Hentai@Home is "
				,"现在的绅士之家版本为 "]
			,["html","#div_download p"
				,"Hentai@Home is released as an Open Source project under the GNU General Public Licence v3."
				,"绅士之家的发布是基于开放源代码计划中，第三版本的GNU通用公共授权条款."]
			,["html","#div_download p"
				,"The source code along with necessary libraries and scripts to build it on Windows and Linux/BSD/Unix-type systems can be downloaded below."
				,"<br>源代码以及相应的进程库和脚本，建立在Windows、Linux/BSD/Unix这类系统的组建可在下方下载."]
			,["html","#div_download p"
				,"You will also need the stand-alone SQLiteJDBC Library to build your own version."
				,"<br>你也需要独立的 SQLiteJDBC 进程库用来建造属于你自己的版本类型."]
			,["html","#div_download p"
				,"Note that for security reasons, this page and the files themselves are hosted on different servers."
				,"安全起见，本页以及文件本身放置在不同的服务器上面."]
			,["html","#div_download p"
				,"For your safety, please verify that the size and SHA-256 hash correspond to the file you download."
				,"<br>为了你的安全，请检验对应下载文件的大小以及 SHA-256 的 Hash 哈吸值."]
			,["html","#div_download p"
				,"For more information about file validation, "
				,"<br>要取得更多验证的相关信息，"]
			,["html","#div_download p"
				,"and links to available versions for Microsoft Windows, see this link:"
				,"适用于微软Windows的版本，请点击此链接："]
				
			//设置页
			,["html","div.infotext p"
				,"Can be most numbers between 1024 and 65534."
				,"通信端口编号可在 1024 到 65534 之间."]
			,["html","div.infotext p"
				,"This port must be opened in your firewall, "
				,"此通信端口必须可通过网络防火墙对外连接."]
			,["html","div.infotext p"
				,"and forwarded from any NAT-based cable/ADSL modems/routers you connect to the Internet through."
				,"<br>假如需要最好设置好端口映射，<br>给硬件：NAT、有线电视、ADSL、拨号调制解调器、路由等通过网络连接."]
				
			,["html","div.infotext p"
				,"You can set a custom name for this client here."
				,"你可以在这里自订客户端的名称."]
			,["html","div.infotext p"
				,"This will be used in the various listings this client appears in."
				,"<br> ( 这会变成你对外各种列表显示的暱称 )"]
				
			,["html","div.infotext p"
				,"This is the maximum speed the client is allowed to use, "
				,"这是客户端所能使用的最大速度，"]
			,["html","div.infotext p"
				,"measured in kilobytes per second."
				,"单位是KB/每秒."]
			,["html","div.infotext p"
				,"Actual utilization will reach at most 80% of this over time, "
				,"随时间推移实际上能达到的大概只有80%"]
			,["html","div.infotext p"
				,"unless you also set an hourly limit below."
				,"<br>除非有特别设置每小时限制流量."]
			,["html","div.infotext p"
				,"Turning off the client-side throttle saves some CPU and may make you test higher, "
				,"降低客户端连接速率可减少CPU使用量<br>或也可设置高一点"]
			,["html","div.infotext p"
				,"but could make the traffic more bursty."
				,"获得更高的网络速率."]
				
			,["html","div.infotext p"
				,"The number of megabytes this client is allowed to send every hour."
				,"每小时可准许多少MB的上传流量."]
			,["html","div.infotext p"
				,"Leave at 0 to limit with max speed alone."
				,"设置为 0 代表不限制."]
				
			,["html","div.infotext p"
				,"How much disk space you wish to reserve for this client." 
				,"设置客户端所能使用的最大可用空间."]
			,["html","div.infotext p"
				,"The reserved space must always be available."
				,"可用空间必须不受影响."]
			,["html","div.infotext p"
				,"This must be at least 5 GB. We recommend at least 1 GB disk per 25 KByte/s bandwidth, "
				,"必须至少大于 5GB. <br>建议以带宽速度的每 25Kbps * 1GB 相乘"]
			,["html","div.infotext p"
				,"or 5 GB for every MBit/s, but more is always better."
				,"<br>或使用每 1Mbps * 5GB 相乘会比较好."]
			,["html","div.infotext p"
				,"Static Range allocation is limited to 1 per 175 MB of disk space."
				,"每一单位的静态分配范围，仅限于每 175 MB 的硬盘空间."
				+"<br><br>额外说明：( 请适度决定最大可用大小 )"
				+"<br>骇斯币Hath的获得'基本上'是由上传文件的单位时间获取比率所决定"
				+"<br>所以越大的空间也代表更多的文件获取量，取得更多骇斯Hath"
				+"<br>但也会造成CPU、硬盘运转率上升，跟P2P损伤硬盘的原理一样."
				]
			,["html","div.infotext p"
				,"If you believe your client key has been compromised, "
				,"如果想用更换客户端密钥，"]
			,["html","div.infotext p"
				,"you can reset the key by checking this box."
				,"可以勾选此选项."]
			,["html","div.infotext p"
				,"You will have to re-enter the key the next the the client starts."
				,"<br>你必须在下次客户端启动时输入客户端密钥以便启用."]
				
			,["html","div.infotext p"
				,"If you are on a NAT network and your router has problems routing a request back to itself, "
				,"如果你在NAT网络里，<br>而且你的路由无法正确回应连接给你的电脑"]
			,["html","div.infotext p"
				,"you can set its LAN IP address here." 
				,"<br>可以在这设置局域网路的IP."]
			,["html","div.infotext p"
				,"This will make the system route requests originating from your IP address directly to the server on your local network."
				,"<br>这会让客户端使用此IP发起连接至路由服务器的要求."]
			,["html","div.infotext p"
				,"Note that some browsers and extensions may restrict this type of local network access, "
				,"注意，有些浏览器的扩展可能会禁止此类型的网络连接"]
			,["html","div.infotext p"
				,"requiring explicit whitelisting of the site."
				,"<br>必须设置好白名单以方便网络连接."]
				
			,["html","div.infotext p"
				,"If this value is set, "
				,"如果有设置此项，"]
			,["html","div.infotext p"
				,"the client will temporarily stop getting new files if the free space on the disk decreases below this value."
				,"且可用空间小余此设置值<br>客户端将会暂停下载新缓存文件."]
			,["html","div.infotext p"
				,"Note that even if this is not set, the client will leave at least 100MB for working space."
				,"如果没有设置，客户端只会保留 100MB 的可用空间."]
				
			,["html","div.infotext p"
				,"In most cases, this should be set to Local Network Only."
				,"通常，这默认只给本地端网络使用."]
			,["html","div.infotext p"
				,"This will allow you to use the H@H client as a proxy for viewing images."
				,"<br>可以把绅士家客户端当作浏览图片的代理服务器 ( 仅限E绅士 )."]
			,["html","div.infotext p strong"
				,"Do not set this to All Networks Allowed unless you know what you are doing."
				,"请勿开放互联网连接，除非你了解其中状况."]
			,["html","div.infotext p"
				,"You can optionally require a passkey, found below."
				,"你也可以选用代理密钥，请看右边下方."]
			,["html","div.infotext p"
				,"This passkey will change if you reset your client key."
				,"<br>另外代理密钥也会在更改客户端密钥时更动."
				+"<br><br>额外说明：<br>代理密钥就是对外连接所使用的密钥，可在个人设置中使用."]
				
			,["html","div.infotext p"
				,"The Scheduler allows you to specify periods of time where the client is operating with lower speed limits."
				,"调度可设置特定时间客户端所能提供的网络速度."]
				
			,["html","div.infotext p"
				,"Over time, your client is assigned a number of static ranges that indicate specific, "
				,"随时间经过，你的客户端会被分配一定数量的静态文件范围"]
			,["html","div.infotext p"
				,"permanently assigned ranges of files it is able to serve."
				,"<br>也就是永久可供缓存的图片文件."]
			,["html","div.infotext p"
				,"This toggle will reset this set of ranges."
				,"<br>选项勾选后将会重设静态范围."]
			
			,["html","div.infotext p"
				,"Various toggles to optimize client behavior."
				,"其他可优化客户端的切换选项."]
			//==================
			,["html","td.infotv p","Current Value:"	,"现有值："]
			,["html","td.infotv p","New Value:"		,"赋予新值："]
			,["html","td.infotv p"
				,"Note: The port cannot be changed while the client is running."		
				,"注意：通信端口无法在客户端运作时更改."]
			,["html","td.infotv p"
				,"Warning: 1 KB/s or KBps \\(Kilo Bytes per Second\\) is equivalent to 8 Kb/s or Kbps \\(Kilo Bits per Second\\)."
				,"警告：1KB = 8Kbps. 请参考：<a href='http://www.mobile01.com/topicdetail.php?f=507&t=3464621#45094546'>说明1</a>、"
				+"<a href='http://www.spring.url.tw/internet/internet_06.html'>说明2</a>"
				]
			,["html","td.infotv p"
				,"Internet speeds are typically advertised as the latter, "
				,"<br>网络速度通常都是以 Kbps 为单位，"]
			,["html","td.infotv p"
				,"so make sure you use the right one."
				,"请确认计算正确."]
			,["html","td.infotv p"
				,"You should not set this higher than the upstream bandwidth of your Internet connection."
				,"不应该设置超过上传速率的数值."]
			,["html","td.infotv p span"	,"No Limit"			,"无限制"]
			,["html","td.infotv p"		,"MBytes/hour"		,"MB/每小时"]
			,["html","td.infotv"		,"Current Value:"	,"现有值："]
			,["html","td.infotv"		,"New Value:"		,"改变成："]
			,["html","td.infotv"		,"Disabled"			,"关闭"]
			,["html","td.infotv"		
				,"Local Networks Only \\[Restricted - Passkey Required\\]"			
				,"仅限本地端网络 [ 限制模式 - 需要代理密钥 ]"]
			,["html","td.infotv"		
				,"Local Networks Only \\[Open - No Authentication Required\\]"
				,"仅限本地端网络 [ 开放模式 - 不需代理密钥 ]"]
			,["html","td.infotv"	
				,"All Networks Allowed \\[Restricted - Passkey Required\\]"
				,"全部网络都准许 [ 限制模式 - 需要代理密钥 ]"]
			,["html","td.infotv"	
				,"All Networks Allowed \\[Open - No Authentication Required\\]"
				,"全部网络都准许 [ 开放模式 - 不需代理密钥 ]"]
			,["html","td.infotv strong"	,"Not Recommended"		," 不建议使用 "]
			,["html","td.infotv span"	,"Very Not Recommended"	," 非常不建议 "]
			,["html","td.infotv p"		,"Proxy Passkey:"		," 代理密钥： "]
			,["html","td.infotv p a"
				,"Click here to modify the schedule of this client"
				,"点击设置此客户端的调度表"]
			,["html","td.infotv p"
				,"This client currently has"
				,"此客户端目前有"]
			,["html","td.infotv p"
				,"static range\\(s\\) assigned."
				,"个已分配静态文件范围."]
			,["html","td.infotv span"		,"Warning: You should"		,"你最好"]
			,["html","td.infotv strong"		,"never"					,"不要"]
			,["html","td.infotv span"		,"reset your static ranges"	,"重设静态范围"]
			,["html","td.infotv strong"		,"unless"					,"除非"]
			,["html","td.infotv span"		
				,"the cache has been deleted or is otherwise lost. It should"	
				,"缓存文件被删除或遗失.<br>应该"]
			,["html","td.infotv strong"		,"always"					,"随时"]
			,["html","td.infotv span"
				,"be reset if the cache has been cleared for whatever reason, "
				,"重设，不论任何原因，假如缓存被清除的话，"]
			,["html","td.infotv span"
				,"or the client will encounter serious trust issues."
				,"将会造成严重的客户端信任危机. ( 减少连接机会 )"]
				
			,["html","div"
				,"Note that any changes you make here will be applied the next time your client pings the server, "
				,"注意，任何更动将会在下次客户端与服务器连接时采用，"]
			,["html","div"
				,"which usually happens every five minutes. Some changes will not be applied until next restart."
				,"通常会每五分钟执行一次，有些设置会在下一次客户端启动时采用."]
			,["html","div"
				,"If you are changing the Port Number or reseting your key, "
				,"<br>如果你更改通信端口或重设客户端密钥，"]
			,["html","div"
				,"you should exit Hentai@Home before hitting the button below."
				,"你应该先关闭绅士家客户端后，再点击下面的确定钮."]
			,["attr","input[value='Apply Settings']","value","确定设置"]
			//调度设置
			,["html","h1:contains('Modify Schedule for Client')"
				,"Modify Schedule for Client"
				,"编辑客户端调度："]
			,["html","p:contains('The Scheduler allows you')"
				,"The Scheduler allows you to specify periods of time where the client is operating with different Maximum Burst Speed and Hourly Bandwidth Limit settings."
				,"调度可用于设置特定时间，客户端使用的最大网络速度及每小时流量限制."]
			,["html","p:contains('To add a new scheduling entry')"
				,"To add a new scheduling entry, "
				,"要添加调度，"]
			,["html","p:contains('simply use the row at the bottom.')"
				,"simply use the row at the bottom."
				,"请更改下面的项目."]
			,["html","p:contains('Enter the required values')"
				,"Enter the required values and make sure that Active is checked, "
				,"输入需要的数值并确认启动框有勾选，"]
			,["html","p:contains('then hit Apply Schedule.')"
				,"then hit Apply Schedule."
				,"然后点击确定设置按钮."]
			,["html","p:contains('Repeat to add more than one entry.')"
				,"Repeat to add more than one entry."
				,"依此类推增加更多调度时间表."]
			,["html","p:contains('You can have up to 9 entries per client, ')"
				,"You can have up to 9 entries per client, "
				,"<br>你可以设置每个客户端最多9个调度."]
			,["html","p:contains('excluding the default entry.')"
				,"excluding the default entry."
				,"不包括默认调度."]
			,["html","p:contains('In case of overlap, ')"
				,"In case of overlap, "
				,"当调度时间有重叠，"]
			,["html","p:contains('the schedule with the highest')"
				,"the schedule with the highest granularity will always be applied."
				,"最长时间的调度将会被取用."]
			,["html","p:contains('Schedule settings should always be')"
				,"Schedule settings should always be lower than the default schedule entry."
				,"调度设置值最好低于默认调度的时间."]
			,["html","p:contains('The active Maximum Burst Speed')"
				,"The active Maximum Burst Speed and Hourly Bandwidth Limit will never be set higher than the default entry."
				,"已启用的最大网络速度与每小时流量限制不能设置低于默认调度."]
			,["html","p:contains('To change the default entry, ')"
				,"To change the default entry, "
				,"<br>如果要修改默认调度，"]
			,["html","p:contains('alter the Maximum Burst Speed and')"
				,"alter the Maximum Burst Speed and Hourly Bandwidth Limit values on the Settings page."
				,"请至主设置页面修改最大网络速度跟每小时流量限制设置值."]
			,["html","p:contains('All schedule times are in UTC.')"
				,"All schedule times are in UTC. As a reference, the current UTC time is"
				,"所有调度的时区皆使用国际标准时间，做为参考，现在国际标准时间为："]
			,["attr","input[value='Delete Entry']"		,"value","删除调度"]
			,["attr","input[value='Apply Schedule']"	,"value","确定设置"]
		]
	},
	
	"bitcoin.php":
	{
		 "div.stuffbox h2:contains('Bitcoin Donation')"				:
			 "Bitcoin Donation 比特币赞助捐款 ( 仅翻译主要部分 )<br>"
			+"( <a href='http://zh.scratchpad.wikia.com/wiki/Donation' target='_bank'><font color='green'><b>"
			+"相关说明参考数据"
			+"</a></b></font> )<br>"
			+"围纪实验室"
			
		,"div.stuffbox p:contains('Your Wallet Address:')"			:"你的钱包地址："
		,"div.stuffbox p:contains('Send Address Information')"		:"钱包地址发送说明"
		,"div.stuffbox p a:contains('Request New Address')"			:"要求新地址"
		,"div.stuffbox p:contains('Incoming Bitcoin Transactions')"	:
			 "比特币入帐状况"
			+"<br><font color='blue'>Pending</font>：<font color='gray'>正在处理</font>｜"
			+"<font color='green'>Confirmed</font>：<font color='black'>入帐完成</font>"
			//+"<br>Confirmed：入帐完成"
		,"div.stuffbox h2:contains('Bitcoin Spending History')"		:"比特币花费纪录"
		,"div.stuffbox h2:contains('Donation Log')"					:"捐款记录 ( 美金 )"
		,"div.stuffbox h2:contains('Adopt-a-Server Log')"			:"认养记录"
		
		
		,"#tdon th:contains('Donation Level')"	:"赞助等级"
		,"#tdon th:contains('EXP Bonus')"		:"经验加成"
		,"#tdon th:contains('Daily Bonus')"		:"每日赠币"
		,"#tdon th:contains('Daily Hath')"		:"每日骇斯币"
		,"#tdon th:contains('Free Archives')"	:"免费打包"
		,"#dlvl td.tdon1:contains('None')"		:"尚未赞助"
		,"#tdon td.tdon1:contains('None')"		:"尚未赞助"
		,"#tdon td.tdon2:contains('You did not donate anything yet, but we still love you.')":
			"你还没有赞助，但我们依然感谢你."
		
		
		,"ReplaceMode":
		[
			/*
			["attr"
				,"div.stuffbox p a:contains('Request New Address')"
				,"onclick"	
				,"if(confirm('你确定要建立新的钱包接收地址?? 你只能在24小时内执行一次."
				+"发送到以前的地址仍然会有效.')) { create_new_wallet(); }"]
			*/
			
			 ["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"Bitcoin is a virtual currency that is completely decentralized and independent of any formal authority."
				,"比特币是虚拟性质的货币，分散性地独立于任何机构之外."]
			,["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"Much like real money, you can spend Bitcoins however you wish, "
				,"如同现实货币，你可以按照自己的心愿花费比特币，"]
			,["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"without any fear that someone shuts down your account or otherwise blocks your transfer."
				,"<br>不需要害怕，任何人都无法关闭你的帐户，或以其他方式禁止你的交易."]
			,["html","div.stuffbox a:contains('about Bitcoins and how to acquire them')"
				,"See this thread for more information about Bitcoins and how to acquire them"
				,"<br>请看这里了解更多相关信息和如何取得比特币"]
			
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"This page allows you to transfer Bitcoins from an online service or a local wallet on your computer or cellphone to your wallet at E-Hentai, "
				,"本页可让你在电脑、手机上，从在线服务或本地钱包转帐比特币至E绅士，"]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"then apply that either as a donation or Adopt-a-Server slots."
				,"然后用于捐款或认养服务器."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"Donations can typically be applied within an hour of it being transferred."
				,"<br>捐款一般需要一小时入帐时间."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"You will be able to track the progress of a transfer below as soon as it has been broadcasted to the network - click the transaction ID to bring up the transaction details."
				,"你可于交易至网络运作时追踪交易进度 - 点击交易ID显示交易细况."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"Three confirmations are required for"
				,"并再三进行必要的"]
			,["html","div.stuffbox p strong:contains('Confirmed')"
				,"Confirmed"
				,"检查与确认"]
			,["html","div.stuffbox p:contains(' status.')"
				," status."
				,"."]
			,["html","div.stuffbox p:contains('weighted average provided by ')"
				,"Your Bitcoins will be converted to the equivalent value in US dollars at the time you choose to apply it."
				,"你的比特币将会自动依照汇率转换成等值的美金."]
			,["html","div.stuffbox p:contains('weighted average provided by ')"
				,"We currently use whichever is highest of the 7-day and 24-hour weighted average provided by"
				,"<br>我们目前使用7天和24小时中最高的加权平均，由"]
			,["html","div.stuffbox p:contains('random volatility. Current rate is ')"
				,", plus a 10% bonus to cover transaction fees and random volatility. Current rate is "
				," 提供，附加总额 10% 的额外奖励用于支付手续费和应对随机波动率. 现在的汇率："]
			
			,["html","div.stuffbox p:contains('is actually in the E-Hentai system.')"
				,"You can use this form to send someone a PM from the gallery system with your wallet address."
				,"你可以填写这个表格，透过系统告知别人自己的钱包地址."]
			,["html","div.stuffbox p:contains('is actually in the E-Hentai system.')"
				,"This lets people know for sure that a given wallet address is actually in the E-Hentai system."
				,"这让人知道你的钱包地址确实存在于系统当中，而非错误或假冒地址."]
			,["html","form:contains('Send to member name:')"
				,"Send to member name:"
				,"该会员名称："]
			
			
			
			,["html","div.stuffbox div","Available Balance:"	,"可用余额："]
			,["html","div.stuffbox div","Donation Total:"		,"捐款总计："]
			,["html","div.stuffbox div","Adopt-a-Server Days:"	,"服务器认养天数："]
			
			,["html","div.stuffbox div h2"	,"Apply BTC to Donation"		,"比特币捐款"]
			,["attr","div.stuffbox input[name='donate']"		,"value"	,"确定"]
			
			,["html","div.stuffbox div h2"	,"Apply BTC to Adopt-a-Server"	,"比特币认养服务器"]
			,["html","#aas_slottype"		,"Select slot duration.."	,"选择认养时长.."]
			,["html","#aas_slottype"		,"Month"	,"月"]
			,["html","#aas_slottype"		,"month"	,"每月"]
			,["html","#aas_slottype"		,"Year"		,"年"]
			,["attr","div.stuffbox input[name='aas']"			,"value","确定"]
			
			,["html","#dlvl td.tdon2"
				,"You did not donate anything yet, but we still love you."
				,"你还没有赞助，但我们依然感谢你."]
			,["html","#tdon td.tdon1","Bronze Star"	,"青铜之星"]
			,["html","#tdon td.tdon1","Silver Star"	,"白银之星"]
			,["html","#tdon td.tdon1","Gold Star"	,"黄金之星"]
			,["html","#tdon td.tdon1","Tri Star"	,"黄金三星"]
			,["html","#tdon td.tdon1","Quint Star"	,"黄金五星"]
			,["html","#tdon td.tdon1","Septua Star"	,"黄金七星"]
			,["html","#tdon td.tdon1","Honorary Catgirl","骨灰级猫女"]
			
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$1000.","赞助满 $1000 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$700."	,"赞助满 $700 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$500."	,"赞助满 $500 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$300."	,"赞助满 $300 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$100."	,"赞助满 $100 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$50."	,"赞助满 $50 获得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$20."	,"赞助满 $20 获得."]
			,["html","#tdon td.tdon5","Credits"	,"<font color='Teal'>绅士币</font>"]
			,["html","#tdon td.tdon5","GP"		,"<font color='RoyalBlue'>图币</font>"]
			,["html","#tdon td.tdon6","Hath"	,"<font color='DarkOrchid'>骇斯币</font>"]
			,["html","#tdon td.tdon7"," / day"," / 日"]
		]
	},
	
	"manage.php":
	{
		//Main
		 "div.ui p:contains('Your Galleries')"								:"你的画册"
		,"div.ui p a:contains('Create a New Gallery')"						:"新建画册"
		,"div.ui p a:contains('Manage Folders')"							:"管理文件夹"
		,"#mgform div[style='float:left']div:contains('Galleries newly created')":
			"最新建立的画册"
		,"#mgform div[style='float:left']div:contains('Galleries under construction, or being modified')":
			"画册建设修改中..."
		,"#mgform div[style='float:left']:contains('Galleries active and publicly available')":
			"画册可用且公开"
		,"#mgform div a:contains('Collapse Open Folders')"					:"折叠文件夹"
		,"#gtable4 td a:contains('Get Folder BBCode')"						:"取得文件夹 BBCode"
		,"#mgform span.stdbtn:contains('+ All')" 		:"全选"
		,"#mgform span.stdbtn:contains('- All')" 		:"全不选"
		,"option[value='0']:contains('Unsorted')"		:"未排序"
		,"#mgform table.mt span:contains('Unsorted')"	:"未排序"
		
		//Manage Folders
		,"div.ui h1:contains('Manage Folders')"		:"管理文件夹"
		,"div.ui form th:contains('Folder Name')"	:"文件夹名称"
		,"div.ui form th:contains('Display Order')"	:"显示顺序"
		,"div.ui p:contains('New Folder')"			:"建立文件夹"
		,"div.ui p:contains('Auto-Sort')"			:"自动排序"
		,"div.ui p a:contains('Back to Manager')"	:"回到画册管理页面"
		
		//Create a New Gallery
		,"div.ui p:contains('Create a New Gallery')"				:"建立新画册"
		,"div.ui form td:contains('Gallery Title')" 				:"画册标题"
		,"div.ui form td:contains('Japanese Script (optional)')" 	:"画册副标题(选用)"
		,"div.ui form td:contains('Gallery Folder')"				:"画册文件夹"
		,"div.ui form td:contains('Gallery Description')"			:"画册叙述"
		,"div.ui form[action*='act=new'] a:contains('Back to Manager')":"回到画册管理页面" 
		
		//Modify Gallery
		,"div.ui p:contains('Modify Gallery')"						:"编辑画册"
		,"div.ui td a:contains('Back to Manager')"					:"回到画册管理页面"
		
		//Upload Gallery
		,"#uploadform span:contains('Files uploaded so far')"		:"上传记录"
		
		//Preview Gallery
		,"div.stuffbox td:contains('Name:')" :"名称："
		,"div.stuffbox td:contains('Desc:')" :"叙述："
		,"div.stuffbox td:contains('Files:')":"文件："
		,"div.stuffbox span:contains('Gallery Options:')"			:"画册选项："
		,"div.stuffbox a:contains('Add More Files')"				:"加入更多图片"
		,"div.stuffbox a:contains('Reorder or Remove Files')"		:"排序或移除图片"
		,"div.stuffbox a:contains('Modify Title or Description')"	:"更改标题或叙述"
		,"div.stuffbox a:contains('Publish Gallery')"				:"发布画册"
		,"div.stuffbox a:contains('Go to Public Gallery')"			:"返回画册"
		
		//Reorder Gallery
		,"div.stuffbox h1:contains('Reorder Gallery')":"画册排序"
		
		,"ReplaceMode":
		[
			//Main
			 ["html","#mgform th","Gallery Name"		,"画册名称"]
			,["html","#mgform th","Date Added"			,"建立时间"]
			,["html","#mgform th","Files"				,"图片数"]
			,["html","#mgform th","Public Category"	,"公开分类"]
			,["html","#mgform th","Available Actions"	,"可用动作"]
			,["modi","#mgform"	,{
				'modiTarget1'		:'tr.gtr1,tr.gtr0'
				,'>Go To Gallery<'	:'>返回画册<'
				,'>Stats<'			:'>画册统计<'
				,'>Add Files<'		:'>添加图片<'
				,'>Reorder<'		:'>重新排序<'
				,'>Modify<'			:'>编辑<'
				,'>Publish<'		:'>发布<'
				,'>Delete<'			:'>删除<'
				,'modiTarget2'						:'td.gtc1'
				,'Loading folder, please wait...'	:'加载内容中，请稍后...'
				,'modiTarget3'		:'td.gtc4'
				,"Doujinshi"		:"同人志"
				,"Manga"			:"漫画"
				,"Artist CG Sets"	:"画师绘图"
				,"Game CG Sets"		:"游戏绘图"
				,"Western"			:"西方的"
				,"Non-H"			:"无色情"
				,"Image Sets"		:"图片集"
				,"Cosplay"			:"角色扮演"
				,"Misc"				:"杂项"
			}]
			
			,["html","#mgform td"
				,"Set public category for selected galleries:"
				,"给选择的画册设置分类："]
			,["html","#mgform td"
				,"Move selected galleries to folder:"
				,"将选择的画册移至文件夹："]
			
			,["html","select[name='publiccat']","\\(Private\\)"	,"（ 私人画册 ）"]
			,["html","select[name='publiccat']","Doujinshi"		,"同人志－Doujinshi"]
			,["html","select[name='publiccat']","Manga"			,"漫画－－Manga"]
			,["html","select[name='publiccat']","Artist CG Sets","画师绘图Artist CG Sets"]
			,["html","select[name='publiccat']","Game CG Sets"	,"游戏绘图Game CG Sets"]
			,["html","select[name='publiccat']","Western"		,"西方的－Western"]
			,["html","select[name='publiccat']","Non-H"			,"无色情－Non-H"]
			,["html","select[name='publiccat']","Image Sets"	,"图片集－Image Sets"]
			,["html","select[name='publiccat']","Cosplay"		,"角色扮演Cosplay"]
			,["html","select[name='publiccat']","Misc"			,"杂项－－Misc"]
			
			,["attr","input[name='categorize']","value","设置分类"]
			,["attr","input[name='folderize']" ,"value","转移画册"]
			/*
			,["html","#mgform div:contains('Galleries active and publicly available')"
				,"Galleries active and publicly available"
				,"画册可用且公开"]
			*/
			//Manage Folders
			,["attr","input[value='Apply Sort Order']" 	,"value","设置排序"]
			,["attr","input[value='Create']" 			,"value","建立"]
			,["html","div.ui form[action*='fact=autosort']"
				,"Sort folders alphabetically: "
				,"文件夹按字母排序"]
			,["attr","input[value='Auto-Sort']" ,"value","开始排序"]
			
			//Create a New Gallery
			,["html","form td"," or new folder: "		,"　或使用新文件夹："]
			,["html","label[for='public']"
				,"Make this gallery publicly available for viewing under the category:"
				,"选择画册公开的分类："]
			,["html","label[for='tos']"
				,"I have read and agree with the terms of the"
				,"我已经阅读用户条款："]
			,["attr","input[name='creategallery']" 		,"value","建立并继续"]
			
			//Modify Gallery
			,["attr","input[value='Confirm Changes']" 	,"value","确认编辑"]
			
			//Upload Gallery
			,["html","#uploadform div > span:eq(0)"
				,"Upload new files to gallery:"
				,"上传图片到画册："]
			,["html","#uploadform > div:eq(1)"
				,"\\(No files added yet\\)"
				,"( 还未有文件上传 )"]
			,["html","#uploadform td span"
				,"Accepted Image Formats:"
				,"有效的图片格式："]
			,["html","#uploadform td span"
				,"Accepted Archive Formats:"
				,"有效的压缩文件格式："]
			,["html","#uploadform td span"
				,"Max File Size: "
				,"最大文件大小："]
			,["html","#uploadform td span"
				,"per Image. Max Resolution:"
				,"每张图片. 最大分辨率："]
			,["html","#uploadform > div:eq(2) td"
				,"Max 2,000 files per gallery."
				,"一个画册最多容纳 2千张图片."]
			,["html","#uploadform > div:eq(2) td"
				,"You should upload no more than 500MB at a time, "
				,"你单次上传不应该超过 500MB，"]
			,["html","#uploadform > div:eq(2) td"
				,"less if you have a slow connection."
				,"请依据自己的网络速度调降."]
			,["html","#uploadform > div:eq(2) td"
				,"To upload the files listed above and return here to continue adding files, "
				,"如果你想要上面上传完后回到本页，"]
			,["html","#uploadform > div:eq(2) td"
				,"hit Upload and Add More."
				,"请点击按钮：上传并回到本页"]
			,["html","#uploadform > div:eq(2) td"
				,"To upload these files and continue to the next step, "
				,"如果你想要上面上传完后继续下一步，"]
			,["html","#uploadform > div:eq(2) td"
				,"hit Upload and Continue."
				,"请点击按钮：上传并下一步"]
			,["html","#uploadform > div:eq(2) td"
				,"If you need to remove or reorder files, you can do so at the next step."
				,"如果你需要移除或排序图片，请至下一步."]
			,["attr","input[value='Upload and Add More']","value","上传并回到本页"]
			,["attr","input[value='Upload and Continue']","value","上传并至下一步"]
			
			//Preview Gallery
			,["html","div.stuffbox span:contains('This is only a preview.')"
				,"This is only a preview. Do not link to this page, "
				,"本页只是画册预览，请勿使用本页网址，"]
			,["html","div.stuffbox span:contains('as you are the only')"
				,"as you are the only one who can access it!"
				,"本页只有你能浏览!"]
			,["html","div.stuffbox span:contains('To let people access')"
				,"To let people access this gallery, "
				,"<br>要让人们看到此画册，"]
			,["html","div.stuffbox span:contains('you must first')"
				,'you must first "Publish" it, '
				,'你必须先 "发布" 画册，']
			,["html","div.stuffbox span:contains('then get a link by')"
				,'then get a link by hitting "Go to Public Gallery"'
				,'然后从 "到公开画册" 取得画册网址']
			,["html","div.stuffbox span:contains('at the main manager screen.')"
				,' here or "View Gallery" at the main manager screen.'
				,'或在管理页面点击 "浏览画册".']
			,["html","div.stuffbox td:contains(' total)')"
				,"total\\)"
				,"张图)"]
			,["html","div.stuffbox td:contains('(No files have been added to this gallery.)')"
				,"\\(No files have been added to this gallery.\\)"
				,"( 目前本画册没有图片. )"]
			
			//Reorder Gallery
			,["attr","input[value='Cancel and Return']","value","取消回去"]
			
			//Publish Gallery
			,["html","div.d"
				,"Please confirm that you wish to publish this gallery."
				,"请确认你想要发布这个画册."]
			,["html","div.d"
				,"Doing so will lock it for new file additions and modifications."
				,"<br>这样做将禁止添加或修改图片."]
			,["html","div.d"
				,"If you wish to add to or modify this gallery later, "
				,"<br>如果你希望之后添加或修改画册内容，"]
			,["html","div.d"
				,"a copy will be created for this purpose."
				,"将会为此添加一个画册副本."]
			,["html","div.d"
				,"Note that published galleries cannot be deleted."
				,"<br><font color='red'><b>请注意！！发布画册后无法删除！！</b></font>"]
			,["attr","input[value='Cancel']"	,"value","取消"]
			,["attr","input[value='Publish']"	,"value","发布"]
			
			//Delete Gallery
			,["html","div.d"
				,"Please confirm that you wish to delete the gallery:"
				,"请确认是否要删除此画册："]
			,["attr","input[value='Delete']"	,"value","删除"]
		]
	},
	
	"codegen.php":
	{
		"p:contains('Copy the code below, and paste it to a BBCode-compatible forum or similar to make a gallery.')":
			"复制下面的网页源代码，并贴到支持BBCode语法的论坛、网站."
		
		
	},
	
	"toplist.php":
	{
		 "div.ido h1 a:contains('EHG Toplists')"			:"E绅士排行总榜"
		,"div.ido div.dc h2:contains('Gallery Toplists')"	:"画册排行"
		,"div.ido a:contains('Galleries All-Time')"			:"画册时间总排行"
		,"div.ido a:contains('Galleries Past Year')"		:"画册去年排行榜"
		,"div.ido a:contains('Galleries Past Month')"		:"画册上个月排行"
		,"div.ido a:contains('Galleries Yesterday')"		:"画册昨天排行榜"
		
		,"div.ido h2:contains('Uploader Toplists')"	:"上传排行"
		,"div.ido a:contains('Uploader All-Time')"	:"上传时间总排行"
		,"div.ido a:contains('Uploader Past Year')"	:"上传去年排行榜"
		,"div.ido a:contains('Uploader Past Month')":"上传上个月排行"
		,"div.ido a:contains('Uploader Yesterday')"	:"上传昨天排行榜"
		
		,"div.ido h2:contains('Tagging Toplists')"	:"标签排行"
		,"div.ido a:contains('Tagging All-Time')"	:"标签时间总排行"
		,"div.ido a:contains('Tagging Past Year')"	:"标签去年排行榜"
		,"div.ido a:contains('Tagging Past Month')"	:"标签上个月排行"
		,"div.ido a:contains('Tagging Yesterday')"	:"标签昨天排行榜"
		
		,"div.ido h2:contains('Hentai@Home Toplists')"	:"绅士之家排行"
		,"div.ido a:contains('Hentai@Home All-Time')"	:"绅士之家时间总排行"
		,"div.ido a:contains('Hentai@Home Past Year')"	:"绅士之家去年排行榜"
		,"div.ido a:contains('Hentai@Home Past Month')"	:"绅士之家上个月排行"
		,"div.ido a:contains('Hentai@Home Yesterday')"	:"绅士之家昨天排行榜"
		
		,"div.ido h2:contains('EHTracker Toplists')"	:"BT种子排行"
		,"div.ido a:contains('EHTracker All-Time')"		:"BT种子时间总排行"
		,"div.ido a:contains('EHTracker Past Year')"	:"BT种子去年排行榜"
		,"div.ido a:contains('EHTracker Past Month')"	:"BT种子上个月排行"
		,"div.ido a:contains('EHTracker Yesterday')"	:"BT种子昨天排行榜"
		
		,"div.ido h2:contains('Cleanup Toplists')"	:"清理排行"
		,"div.ido a:contains('Cleanup All-Time')"	:"清理时间总排行"
		,"div.ido a:contains('Cleanup Past Year')"	:"清理去年排行榜"
		,"div.ido a:contains('Cleanup Past Month')"	:"清理上个月排行"
		,"div.ido a:contains('Cleanup Yesterday')"	:"清理昨天排行榜"
		//排行内容页
		,"table.itg th:contains('Rank')"			:"排名"
		,"table.itg th:contains('Score')"			:"分数"
		,"table.itg th:contains('Published')"		:"发表时间"
		,"table.itg th:contains('Name')"			:"名称"
		,"table.itg th:contains('Uploader')"		:"上传者"
		,"#ot a:contains('Show only my galleries')"	:"只显示我的画册"
		,"#ot a:contains('Show all galleries')"		:"显示全部画册"
		,"#nf:contains('No matching entries found')":"<b>无搜索结果</b>"
		,"ReplaceMode":
		[
			 ["text","div.ido h2"	,"Rating & Reviewing Toplists"	,"评星&回顾排行"]
			,["text","div.ido a"	,"Rating & Reviewing All-Time"	,"评星&时间总排行"]
			,["text","div.ido a"	,"Rating & Reviewing Past Year"	,"评星&去年排行榜"]
			,["text","div.ido a"	,"Rating & Reviewing Past Month","评星&上个月排行"]
			,["text","div.ido a"	,"Rating & Reviewing Yesterday"	,"评星&昨天排行榜"]
			//排行内容页
			,["html","p.os:contains('Only showing galleries uploaded by')"
				,"Only showing galleries uploaded by "
				,"显示画册上传者："]
		]
	},
	
	"bounty_post.php":
	{
		 "#lb a:contains('Bounty List')"						:"悬赏列表"
		,"#lb a:contains('Most Wanted Standard Bounties')"		:"标准悬赏类"
		,"#lb a:contains('Most Wanted Translation Bounties')"	:"翻译悬赏类"
		,"#lb a:contains('Most Wanted Editing Bounties')"		:"补充悬赏类"
		,"#lb a:contains('Post New Bounty')"					:"发起悬赏"
		,"div.stuffbox p:contains('Post New Bounty')"			:"发起悬赏"
		,"span:contains('Bounty Headline:')"					:"悬赏头名："
		,"span:contains('Detailed Bounty Description:')"		:"悬赏详细叙述："
		,"span:contains('Wanted Poster:')"						:"悬赏大头贴："
		,"span:contains('Offered Reward:')"						:"提供赏金："
		,"span:contains('Bounty Type:')"						:"悬赏类型："
		,"span:contains('Minimum Hunter Rank:')"				:"赏金猎人最低等级要求："
		,"span:contains('Accepted Delivery:')"					:"可用的交货方式："
		,"span:contains('Super Dwarf Princess')"				:"超级矮人公主"
		,"label[for='btype_0']":"标准类"
		,"label[for='btype_1']":"翻译类"
		,"label[for='btype_2']":"补充类"
		,"label[for*='minrank_']:contains('Rank A')"	:"分级 A"
		,"label[for*='minrank_']:contains('Rank B')"	:"分级 B"
		,"label[for*='minrank_']:contains('Rank C')"	:"分级 C"
		,"label[for*='minrank_']:contains('Rank D')"	:"分级 D"
		,"label[for*='minrank_']:contains('Rank E')"	:"分级 E"
		,"label[for*='minrank_']:contains('Rank F')"	:"分级 F"
		,"label[for*='minrank_']:contains('Unranked')"	:"未分级"
		,"label[for*='acceptable_']:contains('Posted to the E-Hentai Galleries System')"	:
			"发表至E绅士画册系统"
		,"label[for*='acceptable_']:contains('Archive download at a file locker service')"	:
			"私密文件分享空间"
		,"label[for*='acceptable_']:contains('BitTorrent download at a public tracker')"	:
			"公开服务器的BT种子"
		,"label[for*='acceptable_']:contains('Other; specify in bounty description')"		:
			"其他; 注明在悬赏说明中"
		,"label[for*='acceptable_']:contains('Unranked')"	:"未分级"
		
		,"ReplaceMode":
		[	
			["html","td:contains('A short one-liner')"
				,"A short one-liner consistently describing the bounty. "
				,"简述此次悬赏的名称，"]
			,["html","td:contains('This will appear on the')"
				,"This will appear on the Bounty Overview screen."
				,"会显示在各类版面上."]
			
			,["html","td:contains('Remember to be specific.')"
				,"\""
				,""]
			,["html","td:contains('Remember to be specific.')"
				,'Remember to be specific. Bounties like Requesting'
				,"定义要足够具体. <br>叙述像是：「想要"]
			,["html","td:contains('Hentai is not very specific,')"
				,'Hentai is not very specific, '
				,'变态」其实并不够具体，']
			,["html","td:contains('and any bounty claim featuring')"
				,"and any bounty claim featuring anything that matches would be accepted;"
				,"而且任何悬赏投稿，只要符合条件都会被接受;"]
			,["html","td:contains('bounties like Any')"
				,"bounties like Any "
				,"<br><br>其中像是：「任何"]
			,["html","td:contains('Hentai I don\\'t have would require an actual list;')"
				,"Hentai I don't have would require an actual list;"
				,"变态我没有的」列入需求清单;"]
			,["html","td:contains('and so on.')"
				,"and so on. "
				,"诸如此类."]
			,["html","td:contains('If you have any minimum quality/resolution demands,')"
				,"If you have any minimum quality/resolution demands, "
				,"<br>如果你有最低品质/分辨率的需求，"]
			,["html","td:contains('make sure to include this as well.')"
				,"make sure to include this as well."
				,"务必注明完整."]
			
			,["html","td:contains('The more precise you can define your bounty,')"
				,"The more precise you can define your bounty, "
				,"更精确的叙述你悬赏的内容，"]
			,["html","td:contains('the higher the chance you will be satisfied with its result.')"
				,"the higher the chance you will be satisfied with its result."
				,"你会有更高的机会获得满意的结果."]
			,["html","td:contains('Keep in mind that if your bounty')"
				,"Keep in mind that if your bounty is vague and someone technically fulfills it \\(as determined by a Bounty Moderator\\), your posted reward is forfeit."
				,"<br><br>请多当心，如果你的悬赏内容定义模糊，且某个人技术性地提供符合条件的内容 "
				+"( 由悬赏主持人评断 )，你的赏金将会被没收."
				]
				
			,["html","td:contains('You can optionally upload a thumbnail, cover page,')"
				,"You can optionally upload a thumbnail, cover page, "
				,"你可以选择性地上传缩略图、封面图，"]
			,["html","td:contains('an image from an incomplete collection')"
				,"an image from an incomplete collection, or any other image to further specify the bounty. \\(JPG/PNG\\)"
				,"<br>一张跟悬赏内容相关的图片，或任何可让人联想到此悬赏的图片."
				+"<br>可用图片格式：(JPG/PNG)"
				]
			
			,["html","td:contains('The reward you offer for this bounty,')"
				,"The reward you offer for this bounty, "
				,"你可以设置初始赏金，"]
			,["html","td:contains('in Credits and/or Hath.')"
				,"in Credits and/or Hath. The minimum allowed is 20000 Credits or 2 Hath."
				,"使用<font color='RoyalBlue'>绅士币</font>或<font color='DarkOrchid'>骇斯币</font>. "
				+"<br>最低赏金为 20000 <font color='RoyalBlue'>绅士币</font>或 2 <font color='DarkOrchid'>骇斯币</font>."]
			,["html","td:contains(' Credits')"
				," Credits"
				," <font color='RoyalBlue'>绅士币 ( Credits )</font>"]
			,["html","td:contains(' Hath')"
				," Hath"
				," <font color='DarkOrchid'>骇斯币 ( Hath )</font>"]
			
			,["html","td:contains('If this bounty is for a translation job,')"
				,"If this bounty is for a translation job, "
				,"如果是翻译类悬赏，"]
			,["html","td:contains('select Translation.')"
				,"select Translation. In this case, you should provide a link to the source material."
				,"右边请选择翻译类. <br>在这种情况下，你也应该提供原始素材的网址链接."]
			,["html","td:contains('Otherwise, select Standard.')"
				,"Otherwise, select Standard."
				,"<br>若非如此，请选择标准类."]
				
			,["html","td:contains('This is the minimum rank')"
				,"This is the minimum rank a Bounty Hunter needs to accept or claim this bounty."
				,"这边可设置可接下赏金任务或投稿的猎人最低等级."]
			,["html","td:contains('The default recommended setting is Rank D,')"
				,"The default recommended setting is Rank D, "
				,"<br>默认的建议设置是分级 D，"]
			,["html","td:contains('which will allow unranked hunters,')"
				,"which will allow unranked hunters, "
				,"可让未分级猎人接取任务，"]
			,["html","td:contains('but exclude those who')"
				,"but exclude those who have an inordinate number of rejected claims."
				,"但不包括不良猎人. <br>( 拥有过多投稿被拒绝纪录者 )."]
				
			,["html","td:contains('These are the delivery methods')"
				,"These are the delivery methods you accept for this bounty."
				,"这边是你可接受的交货方式."]
			,["html","td:contains('If you only want galleries')"
				,"If you only want galleries posted to E-Hentai Galleries, you do not need to change this."
				,"<br>如果你只想要发表至E绅士画册，设置不需更动."]
				
			,["html","td:contains('Please verify that your information')"
				,"Please verify that your information is correct before you submit this bounty."
				,"请重新确认你的数据皆有填写正确后才发起悬赏."]
			,["attr","input[value='Post Bounty']","value","- 发起悬赏 -"]
		]
	},
	
	"bounty.php":
	{
		//分类框
		 "#lb a:contains('Bounty List')"						:"悬赏列表"
		,"#lb a:contains('Most Wanted Standard Bounties')"		:"标准悬赏榜"
		,"#lb a:contains('Most Wanted Translation Bounties')"	:"翻译悬赏榜"
		,"#lb a:contains('Most Wanted Editing Bounties')"		:"补充悬赏榜"
		,"#lb a:contains('Post New Bounty')"					:"发起悬赏"//
		//悬赏列表
		,"h1.ih:contains('Showing All Open Bounties')"			:"显示<font color='blue'>开放式</font>悬赏"
		,"h1.ih:contains('Showing All Reserved Bounties')"		:"显示<font color='blue'>已保留</font>悬赏"
		,"h1.ih:contains('Showing All Claimed Bounties')"		:"显示<font color='blue'>已服务</font>悬赏"
		,"h1.ih:contains('Showing All Completed Bounties')"		:"显示<font color='blue'>已完成</font>悬赏"
		,"h1.ih:contains('Showing Bounties Posted By Me')"		:"显示<font color='blue'>我发起</font>的悬赏"
		,"h1.ih:contains('Showing Bounties Boosted By Me')"		:"显示<font color='blue'>我投资</font>的悬赏"
		,"h1.ih:contains('Showing Bounties Accepted By Me')"	:"显示<font color='blue'>我接受</font>的悬赏"
		,"h1.ih:contains('Showing Bounties Reserved For Me')"	:"显示<font color='blue'>我保留</font>的悬赏"
		,"h1.ih:contains('Showing Bounties Claimed By Me')"		:"显示<font color='blue'>我投稿</font>的悬赏"
		,"h1.ih:contains('Showing Bounties Completed By Me')"	:"显示<font color='blue'>我完成</font>的悬赏"
		,"table.itg th:contains('Last Updated')"	:"最后更新"
		,"table.itg th:contains('Bounty Headline')"	:"悬赏头名"
		,"table.itg th:contains('Bounty Type')"		:"悬赏类型"
		,"table.itg th:contains('Bounty Status')"	:"悬赏状态"
		,"table.itg th:contains('Total Bounty')"	:"总悬赏金额"
		,"table.itg th:contains('Posted By')"		:"发起者"
		,"table.itg td:contains('Standard')"		:"<font color='green'>标准</font>"
		,"table.itg td:contains('Translation')"		:"<font color='blue'>翻译</font>"
		,"table.itg td:contains('Editing')"			:"<font color='black'>补充</font>"
		,"table.itg td.itd span:contains('Open/New')"			:"开放 / 新建"
		,"table.itg td.itd span:contains('Open/Accepted')"		:"开放 / 接受"
		,"table.itg td.itd span:contains('Closed/Reserved')"	:"关闭 / 保留"
		,"table.itg td.itd span:contains('Closed/Claimed')"		:"关闭 / 投稿"
		,"table.itg td.itd span:contains('Closed/Completed')"	:"关闭 / 完成"
		,"div.stuffbox div:contains('You are currently an Unranked Bounty Hunter.')": "猎人等级尚未分级"
		//悬赏榜单类
		,"div.stuffbox p:contains('Most Wanted Standard Bounties')"		:"标准悬赏榜"
		,"div.stuffbox p:contains('Most Wanted Translation Bounties')"	:"翻译悬赏榜"
		,"div.stuffbox p:contains('Most Wanted Editing Bounties')"		:"补充悬赏榜"
		,"td.bd1:contains('Bounty Poster:')"	:"悬赏发起者："
		,"td.bd1:contains('Posted Date:')"		:"发起时间："
		,"td.bd1:contains('Bounty Status:')"	:"悬赏状态："
		,"td.bd1:contains('Min Hunter Rank:')"	:"最低等级要求："
		,"td.bd1:contains('Current Reward:')"	:"现有赏金："
		,"table.btl span:contains('Open/New')"			:"开放 / 新建"
		,"table.btl span:contains('Open/Accepted')"		:"开放 / 接受"
		,"table.btl span:contains('Closed/Reserved')"	:"关闭 / 保留"
		,"table.btl span:contains('Closed/Claimed')"	:"关闭 / 投稿"
		,"table.btl span:contains('Closed/Completed')"	:"关闭 / 完成"
		,"table.btl span:contains('Rank A')"	:"分级 A"
		,"table.btl span:contains('Rank B')"	:"分级 B"
		,"table.btl span:contains('Rank C')"	:"分级 C"
		,"table.btl span:contains('Rank D')"	:"分级 D"
		,"table.btl span:contains('Rank E')"	:"分级 E"
		,"table.btl span:contains('Rank F')"	:"分级 F"
		,"table.btl span:contains('Unranked')"	:"未分级"
		//悬赏内容页
		,"p:contains('You have successfully upped the reward on this bounty.')":
			"<font color='green'>你已经成功加码到此悬赏</font>"
		,"td:contains('Bounty Posted By:')"			:"悬赏发起者："
		,"td:contains('Bounty Type:')"				:"悬赏类型："
		,"td:contains('Accepted Delivery:')"		:"接受交货："
		,"div.brd td.bd2 strong:contains('Updated')":"已更新"
		,"td.bd2 strong:contains('Standard')"		:"标准"
		,"td.bd2 strong:contains('Translation')"	:"翻译"
		,"td.bd2 strong:contains('Editing')"		:"补充"
		,"td.bd2 span:contains('Open/New')"			:"开放 / 新建"
		,"td.bd2 span:contains('Open/Accepted')"	:"开放 / 接受"
		,"td.bd2 span:contains('Closed/Reserved')"	:"关闭 / 保留"
		,"td.bd2 span:contains('Closed/Claimed')"	:"关闭 / 投稿"
		,"td.bd2 span:contains('Closed/Completed')"	:"关闭 / 完成"
		,"td.bd2 span:contains('Rank A')"	:"分级 A"
		,"td.bd2 span:contains('Rank B')"	:"分级 B"
		,"td.bd2 span:contains('Rank C')"	:"分级 C"
		,"td.bd2 span:contains('Rank D')"	:"分级 D"
		,"td.bd2 span:contains('Rank E')"	:"分级 E"
		,"td.bd2 span:contains('Rank F')"	:"分级 F"
		,"td.bd2 span:contains('Unranked')"	:"未分级"
		,"td.bd2 span:contains('Posted to the E-Hentai Galleries System')":
			"已在E绅士系统上发表画册"
		,"td.bd2 span:contains('Archive download at a file locker service')":
			"文件下载的文件柜服务"
		,"td.bd2 span:contains('BitTorrent download at a public tracker')":
			"公开的BT下载"
		,"td.bd2 span:contains('Other; specify in bounty description')":
			"其他;请看悬赏说明"
		,"div.brw th:contains('Added')"			 :"加入时间"
		,"div.brw th:contains('Amount')"		 :"金额"
		,"div.brw th:contains('Posted By')"		 :"提供者"
		,"div.bcl th:contains('Claim Date')"	 :"服务日期"
		,"div.bcl th:contains('Status')"		 :"状态"
		,"div.bcl th:contains('Bounty Hunter')"	 :"赏金猎人"
		,"div.bcl th:contains('Hunter Rating')"	 :"猎人等级"
		,"div.brw td:contains('Original Bounty')":"基本赏金"
		,"div.bcl td:contains('This bounty has not been accepted or claimed by anyone.')":
			"此悬赏无人接受或投稿."
		,"div.stuffbox p:contains('WANTED')":"悬赏"
		,"div.stuffbox p:contains('REWARD')":"累积赏金"
		,"div.bcl td span:contains('Bounty Reserved')"	:"悬赏保留"
		,"div.bcl td span:contains('Claim Disputed')"	:"争议投稿"
		,"div.bcl td span:contains('Claim Pending')"	:"等待要求"
		,"div.bcl td span:contains('Claim Accepted')"	:"投稿接受"
		,"div.bcl td span:contains('Bounty Accepted')"	:"领取赏金"
		,"td:contains('Rank A')"	:"分级 A"
		,"td:contains('Rank B')"	:"分级 B"
		,"td:contains('Rank C')"	:"分级 C"
		,"td:contains('Rank D')"	:"分级 D"
		,"td:contains('Rank E')"	:"分级 E"
		,"td:contains('Rank F')"	:"分级 F"
		,"td:contains('Unranked')"	:"未分级"
		
		,"ReplaceMode":
		[
			 ["attr","#focusme",	"placeholder"		,"输入搜索"]
			,["html","#searchform","Bounty Type:"		,"悬赏类型："]
			,["html","#searchform","Bounty Status:"		,"悬赏状态："]
			,["html","#searchform select.stdinput[name='t']",">All<"			,">全部<"]
			,["html","#searchform select.stdinput[name='t']",">Standard<"		,">标准<"]
			,["html","#searchform select.stdinput[name='t']",">Translation<"	,">翻译<"]
			,["html","#searchform select.stdinput[name='t']",">Editing<"		,">补充<"]
			,["html","#searchform select.stdinput[name='s']",">All Open Bounties<"			,">开放式<"]
			,["html","#searchform select.stdinput[name='s']",">All Reserved Bounties<"		,">已保留<"]
			,["html","#searchform select.stdinput[name='s']",">All Claimed Bounties<"		,">已投稿<"]
			,["html","#searchform select.stdinput[name='s']",">All Completed Bounties<"		,">已完成<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Posted By Me<"		,">我发起的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Boosted By Me<"		,">我投资的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Accepted By Me<"	,">我接受的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Reserved For Me<"	,">我保留的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Claimed By Me<"		,">我投稿的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Completed By Me<"	,">我完成的<"]
			,["attr","input[value='Search Bounties']"	,	"value","搜索悬赏"]
			,["attr","input[value='Clear']"				,	"value","清除"]
			,["html","h1.ih:contains('Showing All Open Bounties posted by ')"
				,"Showing All Open Bounties posted by "
				,"显示该会员发起的所有悬赏："]
			//悬赏榜单类
			,["html","div.stuffbox span:contains('\\< Prev 10')","Prev 10","前 10 项"]
			,["html","div.stuffbox span:contains('Next 10 \\>')","Next 10","后 10 项"]
			,["html","div.stuffbox a:contains('\\< Prev 10')"	,"Prev 10","前 10 项"]
			,["html","div.stuffbox a:contains('Next 10 \\>')"	,"Next 10","后 10 项"]
			//悬赏内容页
			,["attr","img[title='Contact Poster']","title","跟他联系"]
			,["html","p[id='lb']"
				,"You have successfully upped the reward on this bounty."
				,"你已经成功加码到此悬赏."]
			,["html","#lb p"
				,"You have rescinded your reward for this bounty."
				,"你已经成功撤销投资."]
			,["html","div.brd td.bd2"," Credits \\+ "," <font color='RoyalBlue'>绅士币</font> + "]
			,["html","div.brd td.bd2"," Hath"," <font color='DarkOrchid'>骇斯币</font>"]
			,["attr","input[value='Rescind']"			,	"value","撤销"]
			,["html","div.brd p"
				,"If you wish, you can throw in some more Credits or Hath for this reward."
				,"可以照想法加码<font color='RoyalBlue'>绅士币</font>或<font color='DarkOrchid'>骇斯币</font>."]
			,["html","div.brd p"
				,"As long as the bounty has not been accepted or claimed by anyone, "
				,"<br>只要悬赏未被接受或被任何人投稿，"]
			,["html","div.brd p"
				,"you are free to rescind this additional bounty at any time."
				,"你可以随时撤销这个额外的奖金."]
			,["html","div.brd p"
				,"Note however that you will have no saying in whether a claim for the bounty is accepted or not."
				,"<br>请注意，悬赏投稿被接受之后就无法反悔."]
			,["html","div.brd p"
				,"If this bounty is cancelled, your funds will be automatically returned to you."
				,"<br>如果悬赏被取消，你的投资将会自动返还."]
			,["html","div.brd p"
				,"Additional rewards must be at least"
				,"额外加码不能低于"]
			,["html","div.brd p"
				,"You can no longer add rewards for this bounty."
				,"此悬赏不可额外加码."]
				
			,["html","div.brd p strong:contains('Credits')"	,"Credits"	,"<font color='RoyalBlue'>绅士币</font>"]
			,["html","div.brd p strong:contains('Hath')"	,"Hath"		,"<font color='DarkOrchid'>骇斯币</font>"]
			,["html","div.brd p strong:contains('5000C')"	,"5000C"	,"5000 <font color='RoyalBlue'>绅士币</font>"]
			,["html","div.brd p"," or "					," 或是 "]
			,["html","div.brd p"," Less than "			," <br>少于 "]
			,["html","div.brd p"," will not bump."		," 将不会延长悬赏时间和或提升榜单排名."]
			,["html","div.brd p","You currently have"	,"你拥有"]
			,["html","div.brd p"," and "				," 和 "]
			,["html","div.brd form p"," C \\+ "				," <font color='RoyalBlue'>绅士币</font> + "]
			,["html","div.brd form p"," Hath "				," <font color='DarkOrchid'>骇斯币</font> "]
			
			,["attr","input[value='Submit Additional Reward']",	"value"	,"我要加码!"]
			,["html","div.bcl td"
				,"Comments from Bounty Poster:"
				,"悬赏发起者："]
			,["html","div.bcl td"
				,"\\(No comment was given.\\)"
				,"( 无语置评 )"]
			,["html","div.bcl td"
				,"This claim has been disputed, and is pending ruling by a Bounty Moderator."
				,"此为争议投稿，并且有待悬赏主席裁决结果."]
			,["html","div.bcl td"
				,"This claim has been accepted, and the bounty has been closed."
				,"此投稿已被接受，悬赏已关闭."]
			,["html","div.bcl td"
				,"Remaining Claim Dispute Time:"
				,"争议投稿时间剩下："]
			,["html","div.bcl td"
				,"争议投稿时间剩下： None"
				,"争议投稿时间剩下： 无"]
				
			,["html","div.stuffbox div[style*='wanted.png'] p"," Credits \\+ "," <font color='RoyalBlue'>绅士币</font> + "]
			,["html","div.stuffbox div[style*='wanted.png'] p"," Hath"," <font color='DarkOrchid'>骇斯币</font>"]
			,["html","div.stuffbox > div:eq(1) p"
				,"Bounties that are "
				,"悬赏状态属于"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"Open/New"
				,"开放/新建"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"Open/Accepted"
				,"开放/接受"]
			,["html","div.stuffbox > div:eq(1) p"
				," are open to be accepted and claimed."
				,"，代表任务开放中等待猎人'<font color='darkred'><b>接下任务</b></font>'或'<font color='darkred'><b>投稿</b></font>'."]
			,["html","div.stuffbox > div:eq(1) p"
				,"If you intent to fulfill a bounty within a reasonable amount of time, "
				,"<br>如果你打算接下任务且可如期完成，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"you can optionally"
				,"你可以选择性地先"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"accept"
				,"接受"]
			,["html","div.stuffbox > div:eq(1) p"
				,"the bounty first. After a bounty has been"
				,"这个悬赏任务. <br>当悬赏被"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"claimed"
				,"投稿"]
			,["html","div.stuffbox > div:eq(1) p"
				,", the original poster of the bounty has 7 days to accept or dispute it, "
				," 后，悬赏发起人有七天时间修改任务状态为接受或争议宣告，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"after which a moderator will decide the outcome."
				,"<br>并交由悬赏主持人裁决."]
			,["html","div.stuffbox > div:eq(1) p"
				,"In case of a dispute, "
				,"<br>在有争议的情况下，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"a Bounty Moderator will decide the outcome of the bounty."
				,"悬赏主持人将决定悬赏的结果."]
			,["html","div.stuffbox > div:eq(1) p"
				,"A rejected claim cannot be resubmitted, and will affect your rank."
				,"<br>被拒绝的投稿不能重新提交，而且会影响你的猎人等级."]
			,["html","div.stuffbox > div:eq(1) p"
				,"Your rank \\("
				,"你的猎人等级 ("]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\) is insufficient to accept this bounty."
				,") 不足以接下这个悬赏任务."]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank A\\)"
				,"(<font color='red'>分级 A</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank B\\)"
				,"(<font color='red'>分级 B</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank C\\)"
				,"(<font color='red'>分级 C</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank D\\)"
				,"(<font color='red'>分级 D</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank E\\)"
				,"(<font color='red'>分级 E</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank F\\)"
				,"(<font color='red'>分级 F</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Unranked\\)"
				,"(<font color='red'>未分级</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"You have not yet accepted or claimed this bounty."
				,"你还未接下这个任务或投稿至此悬赏."]
			,["attr","textarea.stdinput[name='ctext']","placeholder"
				//,"For accepting a bounty, you can enter a short comment here. "
				//+"For claiming a bounty, "
				//+"you must enter all the necessary details for where the bounty can be found."
				,"要接下悬赏任务，你可以在此填入简短说明.\n"
				+"you must enter all the necessary details for where the bounty can be found.\n"
				+"( 上面这句我不知道怎么翻译啦... )\n\n"
				+"大概意思应该是以下其中一个：\n"
				+"1.你必须详细描述投稿内容的来源\n"
				+"2.要投稿，必须在你找得到所有任务信息的地方都要输入必要细节.\n"
				+"3.你必须填入全部必要的详细信息xxxxxxx....\n"
				]
			,["html","div.stuffbox > div:eq(1) p"
				,"If you intend to claim this bounty, "
				,"如果你想投稿至此悬赏，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"make sure that all necessary URLs entered above are correct, "
				,"请确保所有必要的网址都要输入正确，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"and that they match the Accepted Carriers of this bounty."
				,"<br>并且符合悬赏发起人所接受的条件."]
			,["html","div.stuffbox > div:eq(1) p"," and ","及"]
			,["html","div.stuffbox > div:eq(1) p"
				,"Do not, for instance, submit a link to a torrent file if that carrier is not accepted."
				,"<br>举例，如果悬赏发起人不希望，请勿贴出BT种子链接."]
			,["html","div.stuffbox > div:eq(1) p"
				,"All information required to determine the validity of a claim MUST be posted in the claim itself."
				,"<br>所有的信息都必须包含在投稿项目里面."]
			,["html","div.stuffbox > div:eq(1) p"
				,"IN ORDER TO CLAIM A BOUNTY, YOU HAVE TO POST A DEPOSIT OF 1000 CREDITS."
				,"投稿时，你必须付出押金 1000 <font color='RoyalBlue'>绅士币</font>."]
			,["html","div.stuffbox > div:eq(1) p"
				,"THIS IS RETURNED TO YOU IF THE CLAIM IS ACCEPTED, "
				,"<br>如果投稿被接受押金会退还，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"BUT IF THE CLAIM IS FOUND TO BE INVALID, IT WILL BE FORFEIT."
				,"一旦投稿被发现不实，押金将会没收."]
			,["attr","input[value='Withdraw Accept/Claim']","value",
				"撤销接受任务或投稿"]
			,["attr","input[value='Accept Bounty']","value",
				"接下悬赏任务"]
			,["attr","input[value='Claim Bounty']","value",
				"投稿"]
		]
	},
	
	"torrents.php":
	{
		 "div.ido h1.ih:contains('Torrents')"			:"BT种子列表"
		,"#torrentform p a:contains('All')"				:"全部"
		,"#torrentform p a:contains('Seeded')"			:"已做种"
		,"#torrentform p a:contains('Unseeded')"		:"无做种"
		,"#torrentform p a:contains('All Torrents')"	:"全部种子"
		,"#torrentform p a:contains('Only My Torrents')":"只有我的"
		
		,"table.itg th a:contains('Added')"				:"加入时间"
		,"table.itg th:contains('Torrent Name')"		:"种子名称"
		,"table.itg th:contains('Gallery')"				:"编号"
		,"table.itg th a:contains('Size')"				:"大小"
		,"table.itg th a:contains('Seeds')"				:"做种"
		,"table.itg th a:contains('Peers')"				:"人数"
		,"table.itg th a:contains('DLs')"				:"下载"
		,"table.itg th:contains('Uploader')"			:"上传者"
		,"div.ido p.ip a:contains('Advanced Gallery/Torrent Search')":"高级画册 / 种子搜索"
		,"div.ido p[style*='text-align:center; font-style:italic;']:contains('No hits found')":
			"<b>无搜索结果</b>"
		
		,"ReplaceMode":
		[
			 ["attr","#focusme","placeholder"	,"关键字搜索"]
			,["html","#torrentform p","Status:"	,"种子："]
			,["html","#torrentform p","Show:"	,"显示："]
			,["attr","#torrentform input[value='Search Torrents']"	,"value","搜索"]
			,["attr","#torrentform input[value='Clear']"			,"value","清除"]
			,["html","div.ido p.ip","Showing"	,"显示"]
			,["html","div.ido p.ip","of"		,"共有"]
			,["html","div.ido p.ip"
				,"Note that you cannot add torrents directly to this page."		
				,"请注意，无法直接在本页增加种子."]
			,["html","div.ido p.ip"
				,"To upload torrents to this system, visit the torrent screen for a gallery."		
				,"要上传种子到本系统，请至画册中的种子页面."]
			
			 
		]
	},
	
	"gallerytorrents.php":
	{
		//多种子页
		 "#torrentinfo span:contains('Posted:')"		:"发表时间："
		,"#torrentinfo span:contains('Size:')"			:"文件大小："
		,"#torrentinfo span:contains('Seeds:')"			:"种子数："
		,"#torrentinfo span:contains('Peers:')"			:"人数："
		,"#torrentinfo span:contains('Downloads:')"		:"下载数："
		,"#torrentinfo span:contains('Posted:')"		:"发表时间："
		,"#torrentinfo span:contains('Uploader:')"		:"上传者："
		,"#torrentinfo span:contains('New Torrents:')"	:"新建种子："
		
		//单种子页
		,"#ett td:contains('Posted')"		:"发表时间"
		,"#ett td:contains('Uploader')"		:"上传者"
		,"#ett td:contains('Size')"			:"文件大小"
		,"#ett td:contains('Seeds')"		:"种子数"
		,"#ett td:contains('DLers')"		:"下载数"
		,"#ett td:contains('Completes')"	:"完成数"
		,"#expungeform a:contains('Vote to Expunge')"	:"投票隐藏"
		,"div.stuffbox a:contains('Close Window')"		:"关闭窗口"
		
		//编辑种子
		,"#torrentinfo td[style='font-weight:bold']:contains('Torrent Name')"	:"<br>种子名称"
		,"#torrentinfo td[style='font-weight:bold']:contains('Comments')"		:"<br>评论注释"
		
		,"ReplaceMode":
		[
			//多种子页
			 ["html","#torrentinfo p"
				,"torrent was found for this gallery."
				,"个种子属于此画册."]
			,["html","#torrentinfo p"
				,"torrents were found for this gallery."
				,"个种子属于此画册."]
			,["attr","input[name='torrent_info']","value","种子信息"]
			,["html","#torrentinfo div"
				,"You can add a torrent for this gallery by uploading it here."
				,"你可以在这边上传画册的种子."]
			,["html","#torrentinfo div"
				,"The maximum torrent file size is 10 MB."
				,"种子文件最大10MB."]
			,["html","#torrentinfo div"
				,"If you are creating the torrent yourself, "
				,"如果使用你自己制作的种子，"]
			,["html","#torrentinfo div"
				,"set this as announce tracker:"
				,"请设置这个BT Tracker服务器："]
			,["html","#torrentinfo div"
				,"Note that you have to download the finished torrent from this site after uploading for stats to be recorded."
				,"请注意，上传种子后请重新下载种子才可以进行记录追踪 ( 获得图币、绅士币 )"]
			,["attr","input[name='torrent_upload']","value","上传种子"]
			
			 
			//单种子页
			,["html","#torrentinfo td","Personalized Torrent"		,"私人用种子 "]
			,["html","#torrentinfo td","Redistributable Torrent"	,"公开用种子 "]
			,["html","#torrentinfo td"
				,"\\(Just For You - this makes sure to record your stats\\)"	
				,"( 仅给你自己使用 - 会影响到你的统计信息 )"]
			,["html","#torrentinfo td"
				,"\\(use if you want a file you can post or give to others\\)"	
				,"( 可公开使用分享 - 发表或给予他人 )"]
			,["html","#etd"
				,"No comments were given for this torrent."	
				,"尚未有任何本种子评论."]
			,["attr","input[value='Back to Index']"	,"value","回列表页"]
			,["attr","input[value='Modify']"		,"style","width:100px"]
			,["attr","input[value='Modify']"		,"value","编辑种子"]
		]
	},
	
	"home.php":
	{
		 "h2:contains('Image Limits')"		:"图片上限"
		,"h2:contains('EHTracker')"			:"BT统计表"
		,"h2:contains('Total GP Gained')"	:"图币总获得"
		,"h2:contains('Toplists')"			:"全站排名"
		,"h2:contains('Moderation Power')"	:"加权指数 ( <a href='http://zh.scratchpad.wikia.com/wiki/Power' target='_Blank'>版务愿力</a> )"
		,"ReplaceMode":
		[
			//https://github.com/ccloli/E-Hentai-Downloader/wiki/E%E2%88%92Hentai-Image-Viewing-Limits
			 ["html","div.homebox p","You are currently at"	,"已使用 "]
			,["html","div.homebox p"," towards a limit of "	," 至上限 "]
			,["html","div.homebox p",". This regenerates at a rate of ","。 重置频率为每分钟 "]
			,["html","div.homebox p"," per minute."			," 次"]
			,["html","div.homebox p","Reset Cost: "			,"重置花费："]
			,["attr","div.homebox input[name='reset']","value"	,"设置重置"]
			
			,["html","div.homebox td.c2","uploaded"		,"已上传流量"]
			,["html","div.homebox td.c2","downloaded"	,"已下载流量"]
			,["html","div.homebox td.c2","up/down ratio","上下载比例"]
			,["html","div.homebox td.c2","torrent completes","做种完成数"]
			,["html","div.homebox td.c2","gallery completes","画册完成数"]
			,["html","div.homebox td.c2","seedmins"			,"做种时间(分钟)"]
			,["html","div.homebox div a","Show My Torrents"	,"显示我的种子"]
			,["html","div.homebox p"
				,"If you misplace any of your personalized torrents, hit the button below to reset your key."	
				,"如果不小心外流你的私人种子，请点击下方按钮重置种子密钥."]
			,["html","div.homebox p"
				,"This will immediately invalidate all of your personalized torrents in play."	
				,"这将会马上撤销当下所有使用中的种子密钥."]
			,["html","div.homebox p","Your current key is:"	,"种子密钥："]
			,["attp","div.homebox input[name='reset_torrent_key']","value"		,"Reset Torrent Key","重置密钥"]
			,["attr","div.homebox input[name='reset_torrent_key']","onclick"	,"return confirm('确定要重置种子密钥?? 此动作不可回复!!')"]
			
			,["html","div.homebox td","GP from gallery visits"		,"<font color='green'>图币</font>来自画册浏览量"]
			,["html","div.homebox td","GP from torrent completions"	,"<font color='green'>图币</font>来自做种完成数"]
			,["html","div.homebox td","GP from archive downloads"	,"<font color='green'>图币</font>来自打包下载量"]
			,["html","div.homebox td","GP from Hentai@Home"			,"<font color='green'>图币</font>来自于绅士之家"]
			
			,["html","div.homebox td","You are currently:"		,"当前排名："]
			,["html","div.homebox td","on the "					,"名位于 "]
			,["html","div.homebox td"," toplist"				," 排行榜"]
			//EHG Toplists
			,["html","div.homebox td a","Hentai@Home "			,"绅士之家"]
			,["html","div.homebox td a","Galleries "			,"画册"]
			,["html","div.homebox td a","Uploader "				,"上传"]
			,["html","div.homebox td a","Tagging "				,"标签"]
			,["html","div.homebox td a","EHTracker  "			,"BT种子"]
			,["html","div.homebox td a","Cleanup "				,"清理"]
			,["html","div.homebox td a","Rating &amp; Reviewing "	,"评星\&回顾"]
			,["html","div.homebox td a","All-Time"				,"时间总计"]
			,["html","div.homebox td a","Past Year"				,"去年累计"]
			,["html","div.homebox td a","Past Month"			,"上月统计"]
			,["html","div.homebox td a","Yesterday"				,"昨天截止"]
			
			,["html","div.homebox td div","Current Moderation Power","当前总加权指数"]
			,["html","div.homebox td","Base"			,"基础"]
			,["html","div.homebox td","Awards"			,"赏赉勋章"]
			,["html","div.homebox td","Tagging"			,"添加标签"]
			,["html","div.homebox td","Level"			,"《HentaiVerse》等级"]
			,["html","div.homebox td","Donations"		,"捐款加权"]
			,["html","div.homebox td","Forum Activity"	,"论坛积极度"]
			,["html","div.homebox td","Uploads/H@H"		,"上传/绅士家"]
			,["html","div.homebox td","Account Age"		,"帐号年资"]
			,["html","div.homebox td","(capped to 25)"	,"封顶上限25"]
		]
		
	},
	"stats.php":
	{
		//画册统计类：
		 "div.stuffbox th:contains('Ranking')"	:"排名"
		,"div.stuffbox th:contains('Score')"	:"评分"
		,"div.stuffbox a:contains('Galleries All-Time')"			:"画册时间总计"
		,"div.stuffbox a:contains('Galleries Past Year')"			:"画册去年统计"
		,"div.stuffbox a:contains('Galleries Past Month')"			:"画册上个月计"
		,"div.stuffbox a:contains('Galleries Yesterday')"			:"画册昨天截止"
		,"div.stuffbox td:contains('Not currently in Top 1000')"	:"不在前 1千名内"
		,"div.stuffbox td:contains('The number of total visits on your galleries.')":
			"画册游客数量"
		,"div.stuffbox p a:contains('Back To Gallery')":"回到画册"
		
		,"ReplaceMode":
		[
			 ["html","div.stuffbox p","Visitor Statistics"	,"来访量统计表格"]
			,["html","div.stuffbox"	,"Visits"				,"来访"]
			,["html","div.stuffbox"	,"Hits"					,"点击"]
			
			,["html","div.stuffbox"	,"Yearly Stats"			,"年度统计"]
			,["html","div.stuffbox"	,"Last 12 Months"		,"12个月内"]
			,["html","div.stuffbox"	,"Daily Stats"			,"每日统计"]
			
			,["html","div.stuffbox td.stdk"	,"Jan"	,"1月"]
			,["html","div.stuffbox td.stdk"	,"Feb"	,"2月"]
			,["html","div.stuffbox td.stdk"	,"Mar"	,"3月"]
			,["html","div.stuffbox td.stdk"	,"Apr"	,"4月"]
			,["html","div.stuffbox td.stdk"	,"May"	,"5月"]
			,["html","div.stuffbox td.stdk"	,"Jun"	,"6月"]
			,["html","div.stuffbox td.stdk"	,"Jul"	,"7月"]
			,["html","div.stuffbox td.stdk"	,"Aug"	,"8月"]
			,["html","div.stuffbox td.stdk"	,"Sep"	,"9月"]
			,["html","div.stuffbox td.stdk"	,"Oct"	,"10月"]
			,["html","div.stuffbox td.stdk"	,"Nov"	,"11月"]
			,["html","div.stuffbox td.stdk"	,"Dec"	,"12月"]
			
			,["html","div.stuffbox td","The number of total visits on your galleries."			,"画册游客数量"]
			,["html","div.stuffbox td","The number of total image accesses on your galleries."	,"画册图片浏览量"]
			//画册统计类：
			,["html","div.stuffbox p"
				,"This gallery has had a total of"
				,"此画册共有"]
			,["html","div.stuffbox p"	
				,"visit\\(s\\)."
				,"个访客."]
		]
		
	},
	
	"uconfig.php":
	{
		 "#msg:contains('Settings were updated')"		:"<font color='Green'><b>设置已更新完毕</b></font>"
		,"#outer h1:contains('Settings')"				:"个人设置"
		,"#outer h2:contains('Image Load Settings')"	:"图片加载"
		,"#outer h2:contains('Image Size Settings')"	:"图片大小"
		,"#outer h2:contains('Gallery Name Display')"	:"画册名称"
		,"#outer h2:contains('Archiver Settings')"		:"打包设置"
		,"#outer h2:contains('Front Page Settings')"	:"首页设置"
		,"#outer h2:contains('Favorites')"				:"我的收藏"
		,"#outer h2:contains('Ratings')"				:"评分颜色"
		,"#outer h2:contains('Tag Namespaces')"			:"标记命名"
		,"#outer h2:contains('Excluded Languages')"		:"隐藏语系"
		,"#outer h2:contains('Search Result Count')"	:"搜索数量"
		,"#outer h2:contains('Thumbnail Settings')"		:"缩略图预览"
		,"#outer h2:contains('Gallery Comments')"		:"画册注释"
		,"#outer h2:contains('Gallery Tags')"			:"画册标记"
		,"#outer h2:contains('Gallery Page Numbering')"	:"预览数量"
		,"#outer h2:contains('Hentai@Home Proxy')"		:"绅士之家"
		,"#outer h2:contains('Tag Flagging')"			:"标记旗帜"
		,"#outer h2:contains('Advertisements')"			:"广告设置"
		,"#outer h2:contains('Original Images')"		:"原始图片"
		,"#outer h2:contains('Multi-Page Viewer')"		:"多图浏览"
		//Image Load Settings
		,"label[for='uh_y']" :"同意 (建议)"
		,"label[for='uh_n']" :"不同意 (你将无法一次浏览多页，请只有在出问题的时候启动此功能.)"
		//Image Size Settings
		,"label[for='xr_0']" :"自动"
		//Gallery Name Display
		,"label[for='tl_r']" :"默认标题"
		,"label[for='tl_j']" :"日文标题 ( 如果可以使用 )"
		//Archiver Settings
		,"label[for='ar_0']" :"手动付费，手动下载 (默认)"
		,"label[for='ar_2']" :"手动付费，自动下载"
		,"label[for='ar_1']" :"自动付费，手动下载"
		,"label[for='ar_3']" :"自动付费，自动下载"
		//Front Page Settings
		,"label[for='dm_l']" :"列表模式"
		,"label[for='dm_t']" :"缩略图模式"
		,"label[for='prn_y']":"显示"
		,"label[for='prn_n']":"隐藏"
		//Favorites
		,"label[for='fs_p']" :"排序：以最新的画册更新时间为准"
		,"label[for='fs_f']" :"排序：以收藏时间为准"
		//Tag Namespaces
		,"label[for='xns_1']":"reclass<br>　(重分类)"
		,"label[for='xns_2']":"language<br>　( 语　系 )"
		,"label[for='xns_3']":"parody<br>　( 滑稽模仿 )"
		,"label[for='xns_4']":"character<br>　( 角　色 )"
		,"label[for='xns_5']":"group<br>　( 分　组 )"
		,"label[for='xns_6']":"artist<br>　( 画　师 )"
		,"label[for='xns_7']":"male<br>　( 男　性 )"
		,"label[for='xns_8']":"female<br>　( 女　性 )"
		//Search Result Count
		,"label[for='rc_0']":"25 个项目"
		,"label[for='rc_1']":"50 个项目"
		,"label[for='rc_2']":"100 个项目"
		,"label[for='rc_3']":"200 个项目"
		//Thumbnail Settings
		,"label[for='lt_m']":"鼠标停留时 ( 网页读取快，鼠标停留读取缩略图时会有点迟滞 )"
		,"label[for='lt_p']":"网页读取时 ( 读取网页慢，鼠标停留读取缩略图无延迟 )"
		,"label[for='ts_m']":"普通"
		,"label[for='ts_l']":"较大"
		//Gallery Comments
		,"label[for='cs_a']":"旧的优先"
		,"label[for='cs_d']":"新的优先"
		,"label[for='cs_s']":"高分优先"
		,"label[for='sc_0']":"鼠标停留在评分上或点击时"
		,"label[for='sc_1']":"任何时候皆显示"
		//Gallery Tags
		,"label[for='to_a']":"按字母顺序"
		,"label[for='to_p']":"按输入顺序"
		//Gallery Page Numbering
		,"label[for='pn_0']":"不"
		,"label[for='pn_1']":"要"
		//Tag Flagging
		,"label[for='tf_n']":"不"
		,"label[for='tf_y']":"要"
		,"label:contains('Hide')":"隐藏"
		//Advertisements
		,"label[for='sa_y']":"当然要啦"
		,"label[for='sa_n']":"绝对不要"
		//Original Images
		,"label[for='oi_n']":"不要"
		,"label[for='oi_y']":"好阿"
		//Multi-Page Viewer
		,"label[for='qb_n']":"不要"
		,"label[for='qb_y']":"要要"
		,"label[for='ms_n']":"往左对齐，只有图片大于浏览器宽度才缩小" //Align left; Only scale if image is larger than browser width
		,"label[for='ms_c']":"中间对齐，只有图片大于浏览器宽度才缩小" //Align center; Only scale if image is larger than browser width
		,"label[for='ms_y']":"中间对齐，随时缩小图片适应浏览器宽度"   //Align center; Always scale images to fit browser width
		,"label[for='mt_n']":"显示"
		,"label[for='mt_y']":"隐藏"
		
		,"ReplaceMode":
		[
			//Image Load Settings
			 ["html","div.optmain"
				,"Do you wish to load images through the Hentai@Home Network, if available?"		
				,"当绅士之家网络可使用时是否使用其网络加载图片??"]
			//Image Size Settings
			,["html","div.optmain p"
				,"Normally, images are resampled to 1280 pixels of horizontal resolution for online viewing."
				,"通常来说，为了在线浏览图片会压缩至垂直高度1280像素大小. "]
			,["html","div.optmain p"
				," You can alternatively select one of the following resample resolutions."
				,"你也可以自己选择."]
			,["html","div.optmain p"
				,"To avoid murdering the staging servers, "
				,"但是为了避免负载过高，"]
			,["html","div.optmain p"
				,"resolutions above 1280x are temporarily restricted to donators, "
				,"高于1280像素将暂时只供给于赞助者、特殊功能，"]
			,["html","div.optmain p"
				,"people with any hath perk, and people with a UID below 3,000,000."
				,"还有会员注册排行三百万内的会员."]
			//Gallery Name Display
			,["html","div.optmain p"
				,"While the site will automatically scale down images to fit your screen width, "
				,"<p>阅览时图片会缩略成适合屏幕宽度，"]
			,["html","div.optmain p"
				,"you can also manually restrict the maximum display size of an image. "
				,"你也可以手动限制图片最大显示大小.</p>"]
			,["html","div.optmain p"
				,"Like the automatic scaling, this does not resample the image, "
				,"这是在线图片自动缩小，不是压缩图片，"]
			,["html","div.optmain p"
				,"as the resizing is done browser-side."
				,"会在浏览器中这一端完成."]
			,["html","div.optmain p"
				,"(0 = no limit)"
				," 0 = 不做限制 "]
			,["html","div.optsub td","Horizontal:"	,"水平："]
			,["html","div.optsub td","Vertical:"	,"垂直："]
			,["html","div.optsub td","pixels"		,"像素"]
			//Gallery Name Display
			,["html","div.optmain p"
				,"Many galleries have both an English/Romanized title and a title in Japanese script. "
				,"很多画册会同时具有英文及日文标题，"]
			,["html","div.optmain p"
				,"Which gallery name would you like to see as default?"
				,"你想要默认看到哪一种??"]
			//Archiver Settings
			,["html","div.optmain p"
				,"The default behavior for the Archiver is to confirm the \"cost\" for downloading an archive, "
				,"选择付费打包下载画册默认行为，"]
			,["html","div.optmain p"
				,"then present a link that can be clicked or copied elsewhere. You can change this behavior here."
				,"然后显示下载链接可以点击或在别处下载，你可以在这边改变确认与付费方式。"]
			//Front Page Settings
			,["html","div.optmain p"
				,"Which display mode would you like to use on the front and search pages?"
				,"首页和搜索页面要使用哪一种显示模式?"]
			,["html","div.optmain p"
				,"Would you like the Popular Right Now pane to be displayed below the most recently added galleries on the front page?"
				,"是否要在首页显示热门画册??"]
			,["html","div.optmain p"
				,"What categories would you like to view as default on the front page?"
				,"首页默认要显示什么类别的画册??"]
			//Favorites
			,["html","div.optmain p"
				,"Here you can choose and rename your favorite categories."
				,"这里可以选择和重命名收藏类别."]
			,["html","div.optmain p"
				,"You can also select your default sort order for galleries on your favorites page. "
				,"<p>你也可以选择收藏中默认的画册排序.</p>"]
			,["html","div.optmain p"
				,"Note that favorites added prior to the March 2016 revamp did not store a timestamp, "
				,"请注意，在2016三月改版之前加入收藏夹的画册并未保存时间戳，"]
			,["html","div.optmain p"
				,"and will use the gallery posted time regardless of this setting."
				,"会以画册发布时间代替."]
			//Ratings
			,["html","div.optmain p"
				,"By default, galleries that you have rated will appear with red stars for ratings of 2 stars and below, "
				,"默认中，被你评分的画册，2星以下显示红色，"]
			,["html","div.optmain p"
				,"green for ratings between 2.5 and 4 stars, and blue for ratings of 4.5 or 5 stars."
				,"2.5星到4星显示绿色，4.5到5星显示蓝色."]
			,["html","div.optmain p"
				,"You can customize this by entering your desired color combination below."
				,"你可以在下面自订想要的颜色组合."]
			,["html","div.optmain #ru2"
				,"Each letter represents one star. "
				,"每一个字符代表一星. "]
			,["html","div.optmain #ru2"
				,"The default RRGGB means R\\(ed\\) for the first and second star, G\\(reen\\) for the third and fourth, "
				,"<br>默认RRGGB代表着R为红色，G为绿色，"]
			,["html","div.optmain #ru2"
				,"and B\\(lue\\) for the fifth. You can also use \\(Y\\)ellow for the normal stars."
				,"B为蓝色. <br>你也可以使用黄色Y."]
			,["html","div.optmain #ru2"
				,"Any five-letter combination of R, G, B and Y will work."
				,"<br>任何五个字符皆可用：R、G、B、Y."]
			//Tag Namespaces
			,["html","div.optmain p"
				,"If you want to exclude certain namespaces from a default tag search, "
				,"如果你想要在默认搜索排除一些标记的画册，"]
			,["html","div.optmain p"
				,"you can check those below."
				,"请注意下面."]
			,["html","div.optmain p"
				,"Note that this does not prevent galleries with tags in these namespaces from appearing, "
				,"<br>这并不会完全隐藏相应标记的画册，"]
			,["html","div.optmain p"
				,"it just makes it so that when searching tags, it will forego those namespaces."
				,"这只会在搜索时隐藏."]
			//Excluded Languages
			,["html","div.optmain p"
				,"If you wish to hide galleries in certain languages from the gallery list and searches, "
				,"如果你希望搜索时隐藏某些语言的画册，"]
			,["html","div.optmain p"
				,"select them from the list below."
				,"请在下面列表勾选."]
			,["html","div.optmain p"
				,"Note that matching galleries will never appear regardless of your search query."
				,"请注意那些符合条件的画册将完全不会显示在搜索中."]
			,["html","div.optmain #xlasel th","Original"	,"原文本"]
			,["html","div.optmain #xlasel th","Translated"	,"翻译本"]
			,["html","div.optmain #xlasel th","Rewrite"		,"重制版"]
			,["html","div.optmain #xlasel th","All"			,"全部"]
			
			,["html","div.optmain #xlasel td.xla","Japanese"	,"日文"]
			,["html","div.optmain #xlasel td.xla","English"		,"英文"]
			,["html","div.optmain #xlasel td.xla","Chinese"		,"中文"]
			,["html","div.optmain #xlasel td.xla","Dutch"		,"菏兰语"]
			,["html","div.optmain #xlasel td.xla","French"		,"法文"]
			,["html","div.optmain #xlasel td.xla","German"		,"德文"]
			,["html","div.optmain #xlasel td.xla","Hungarian"	,"匈牙利文"]
			,["html","div.optmain #xlasel td.xla","Italian"		,"意大利文"]
			,["html","div.optmain #xlasel td.xla","Korean"		,"韩文"]
			,["html","div.optmain #xlasel td.xla","Polish"		,"波兰语"]
			,["html","div.optmain #xlasel td.xla","Portuguese"	,"葡萄牙文"]
			,["html","div.optmain #xlasel td.xla","Russian"		,"俄语"]
			,["html","div.optmain #xlasel td.xla","Spanish"		,"西班牙语"]
			,["html","div.optmain #xlasel td.xla","Thai"		,"泰语"]
			,["html","div.optmain #xlasel td.xla","Vietnamese"	,"越南文"]
			,["html","div.optmain #xlasel td.xla","N/A"			,"N/A无法辨识"]
			,["html","div.optmain #xlasel td.xla","Other"		,"其他"]
			//Search Result Count
			,["html","div.optmain p"
				,"How many results would you like per page for the index/search page and torrent search pages?"
				,"要显示每页多少项目在首页、搜索、种子网页上??"]
			,["html","div.optmain p"
				,"\\(Hath Perk: Paging Enlargement Required\\)"
				,"( 特殊功能需求：Paging Enlargement - 版面扩张 )"]
			//Thumbnail Settings
			,["html","div.optmain p"
				,"How would you like the mouse-over thumbnails on the front page to load when using List Mode?"
				,"请选择首页使用列表模式鼠标放在项目上加载预览图片的时机"]
			,["html","div.optmain p"
				,"You can set a default thumbnail configuration for all galleries you visit."
				,"你可以设置默认的缩略图数量与大小."]
			,["html","div.optmain div.optsub td"
				,"Size: "
				,"大小"]
			,["html","div.optmain div.optsub td"
				,"Rows:"
				,"行数"]
			//Gallery Comments
			,["html","div.optmain p"
				,"Sort order for gallery comments:"
				,"画册注释的排序："]
			,["html","div.optmain p"
				,"Show gallery comment votes:"
				,"显示画册注释的评价："]
			//Gallery Tags
			,["html","div.optmain p"
				,"Sort order for gallery tags:"
				,"画册标记的顺序："]
			//Gallery Page Numbering
			,["html","div.optmain p"
				,"Show gallery page numbers:"
				,"显示画册内图片的页数编号"]
			//Hentai@Home Proxy
			,["html","div.optmain p"
				,"Set the field below to the IP:Port of a proxy-enabled Hentai@Home Client to load all images through this client, "
				,"下面输入绅士之家的网络IP跟通信端口，所有图片都会通过此客户端连接，"]
			,["html","div.optmain p"
				,"or leave blank to not use one."
				,"或是留空不使用."]
			,["html","div.optmain p"
				,"If you are running the client on the same PC you browse from, you can use 127.0.0.1:port."
				,"如果客户端跟你的网页在同台电脑上，网络IP可以填入 127.0.0.1:通信端口."]
			,["html","div.optmain p"
				,"You can also use private network IPs for local proxies, for example 10.0.0.1:port."
				,"你也可以使用本地端私人的局域网路IP，例如 10.0.0.1:通信端口."]
			,["html","div.optmain p"
				,"In the default H@H setting, the client must be on your local computer or local network in order to allow proxy connections."
				,"但是绅士之家的默认值，客户端必须是同台电脑或同局域网路才可准许连接  ( 或更改设置但不建议 )."]
			,["html","div.optmain div.optsub table.hathproxy th"
				,"IP Address:Port"
				,"网络IP地址:通信端口"]
			,["html","div.optmain div.optsub table.hathproxy th"
				,"Passkey \\(Optional\\)"
				,"连接密钥 (选用) "]
			//Tag Flagging
			,["html","div.optmain p"
				,"Enable Tag Flagging?"
				,"是否在搜索页显示标签旗帜??  "]
			,["html","div.optmain p"
				,"\\(Bronze Star or Hath Perk: Tag Flagging Required\\)"
				,"( 必须拥有青铜之星或特殊功能：Tag Flagging - 首页标签旗号 )"]
			,["html","div.optmain p"
				,"Tags entered below will be flagged on the index/search pages."
				,"下面输入的标记都会显示在首页、搜索页面上，"]
			,["html","div.optmain p"
				,"Tags should be separated by a comma. You can add up to "
				,"标记可用逗号分隔，你最多可使用 "]
			,["html","div.optmain p"
				,"tags per flag."
				," 个标记"
				+"<br>旗帜旁边的隐藏勾选后，缩略图会隐藏."]
			//Advertisements
			,["html","div.optmain p"
				,"Would you like to browse with advertisements enabled?"
				,"是否要显示广告???"]
			,["html","div.optmain p"
				,"\\(Bronze Star or Hath Perk: Ads-Be-Gone Required\\)"
				,"( 必须拥有青铜之星或特殊功能：Ads-Be-Gone - 去去广告滚开 )"]
			//Original Images
			,["html","div.optmain p"
				,"Always display the original images instead of the resampled versions?"
				,"是否加载原始图片而不是使用压缩略图片???"]
			,["html","div.optmain p"
				,"\\(Silver Star or Hath Perk: Source Nexus Required\\)"
				,"( 必须拥有白银之星或特殊功能：Source Nexus - 原始人用图片 )"]
			//Multi-Page Viewer
			,["html","div.optmain p"
				,"Enable the Multi-Page Viewer\\? \\(Gold Star or Hath Perk: Multi-Page Viewer Required\\)"
				,"是否使用多图快速阅览??? ( 必须拥有黄金之星或特殊功能：Multi-Page Viewer - 多页快速阅览 )"]
			,["html","div.optmain a[href*='mpv']:contains('demo')"		,"demo","范例网页"]
			,["html","div.optmain p","Multi-Page Viewer Display Style:"	,"多页浏览显示样式："]
			,["html","div.optmain p","Multi-Page Viewer Thumbnail Pane:","多页浏览显示缩略图区："]
			,["attr","input[value='Apply']","value","确定"]
		]
	},
	
	"hathperks.php":
	{
		 "div.stuffbox h1:contains('Hath Perks')"	:
			"骇斯币(Hath)：<a href='https://youtu.be/mJsnsKs5ZHQ' target='_bank'>特异功能</a>"
		 
		,"div.stuffbox a[href*='exchange.php?type=hath']:contains('Hath Exchange')"	:"Hath Exchange ( 骇斯市集 ) "
		,"div.stuffbox a[href*='bitcoin.php']:contains('Donation Screen')"			:"Donation Screen ( 捐款网页 ) "
		 
		,"div.stuffbox th:contains('Hath Perk')"	:"功能名称"
		,"div.stuffbox th:contains('Description')"	:"功能说明"
		,"div.stuffbox p:contains('Obtained')"		:"已购买"
		,"div.stuffbox td a:contains('demo')"		:"范例网页"
		
		,"div.stuffbox span:contains('Free with a $20 donation.')" :"捐款 $20  以上自动免费 ( 如已购买的骇斯币将会退还 )"
		,"div.stuffbox span:contains('Free with a $50 donation.')" :"捐款 $50  以上自动免费 ( 如已购买的骇斯币将会退还 )"
		,"div.stuffbox span:contains('Free with a $100 donation.')":"捐款 $100 以上自动免费 ( 如已购买的骇斯币将会退还 )"
		
		,"td:contains('Ads-Be-Gone')"			:"Ads-Be-Gone<br>"				+"去去广告滚开"
		,"td:contains('Tag Flagging')"			:"Tag Flagging<br>"				+"首页标签旗号"
		,"td:contains('Source Nexus')"			:"Source Nexus<br>"				+"原始人用图片"
		,"td:contains('Multi-Page Viewer')"		:"Multi-Page Viewer<br>"		+"多页快速阅览"
		,"td:contains('More Thumbs')"			:"More Thumbs<br>"				+"缩略图不够不够"
		,"td:contains('Thumbs Up')"				:"More Thumbs<br>"				+"缩略图增长中"
		,"td:contains('All Thumbs')"			:"All Thumbs<br>"				+"缩略图还是不够"
		,"td:contains('More Pages')"			:"More Page<br>"				+"页数抓狂翻桌"
		,"td:contains('Lots of Pages')"			:"Lots of Pages<br>"			+"需要更多页数"
		,"td:contains('Too Many Pages')"		:"Too Many Pages<br>"			+"页数泛滥啦！"
		,"td:contains('More Favorite Notes I')"	:"More Favorite Notes I<br>"	+"疯狂注记收藏家1"
		,"td:contains('More Favorite Notes II')":"More Favorite Notes II<br>"	+"抓狂注记收藏家2"
		,"td:contains('Paging Enlargement I')"	:"Paging Enlargement I<br>"		+"版面扩张手术1 - 盖世神医"
		,"td:contains('Paging Enlargement II')"	:"Paging Enlargement II<br>"	+"版面扩张手术2 - 超神杰克"
		,"td:contains('Paging Enlargement III')":"Paging Enlargement III<br>"	+"版面扩张手术3 - 你是传奇"
		//《HentaiVerse》额外能力
		,"td:contains('Postage Paid')"			:"Postage Paid<br>"				+"邮资清偿专家"
		,"td:contains('Vigorous Vitality')"		:"Vigorous Vitality<br>"		+"生机勃勃"
		,"td:contains('Effluent Ether')"		:"Effluent Ether<br>"			+"溢流以太"
		,"td:contains('Suffusive Spirit')"		:"Suffusive Spirit<br>"			+"心灵坚强"
		,"td:contains('Resplendent Regeneration')"	:"Resplendent Regeneration<br>"			+"辉煌再起"
		,"td:contains('Enigma Energizer')"		:"Enigma Energizer<br>"			+"谜之劲量"
		,"td:contains('Yakety Sax')"			:"Yakety Sax<br>"				+"叶克蒂·萨克斯"
		,"td:contains('Soul Catcher')"			:"Soul Catcher<br>"				+"灵魂捕手"
		,"td:contains('Extra Strength Formula')":"Extra Strength Formula<br>"	+"特强配方"
		//,"td:contains('Thats Good Eatin')"	:"That's Good Eatin'<br>"		+"这倒是挺好吃的！"
		,"td:contains('Coupon Clipper')"		:"Coupon Clipper<br>"			+"食利者"
		,"td:contains('Long Gone Before Daylight')":"Long Gone Before Daylight<br>"	+"黎明之前"
		,"td:contains('Dark Descent')"			:"Dark Descent<br>"				+"黑暗后裔"
		,"td:contains('Eminent Elementalist')"	:"Eminent Elementalist<br>"		+"元素大师"
		,"td:contains('Divine Warmage')"		:"Divine Warmage<br>"			+"圣战法师"
		,"td:contains('Death and Decay')"		:"Death and Decay<br>"			+"死亡凋零"
		,"td:contains('Evil Enchantress')"		:"Evil Enchantress<br>"			+"邪恶女巫"
		,"td:contains('Force of Nature')"		:"Force of Nature<br>"			+"自然之力"
		,"td:contains('Manehattan Project')"	:"Manehattan Project<br>"		+"马哈顿计划"
		,"td:contains('Follower of Snowflake')"	:"Follower of Snowflake<br>"	+"雪花的信徒"
		,"td:contains('Thinking Cap')"			:"Thinking Cap<br>"				+"深思"
		,"td:contains('Mentats')"				:"Mentats<br>"					+"门塔特"
		,"td:contains('Learning Chip')"			:"Learning Chip<br>"			+"学习芯片"
		,"td:contains('Cybernetic Implants')"	:"Cybernetic Implants<br>"		+"神经植入物"
		,"td:contains('Innate Arcana I')"		:"Innate Arcana I<br>"			+"天赋奥术"
		,"td:contains('Crystarium I')"			:"Crystarium I<br>"				+"水晶矿脉"
		,"td:contains('Tokenizer I')"			:"Tokenizer I<br>"				+"令牌技师"
		,"td:contains('Repair Bear Mk.1')"		:"Repair Bear Mk.1<br>"			+"修理熊 Mk.1"
		,"td:contains('Repair Bear Mk.2')"		:"Repair Bear Mk.2<br>"			+"修理熊 Mk.2"
		,"td:contains('Repair Bear Mk.3')"		:"Repair Bear Mk.3<br>"			+"修理熊 Mk.3"
		,"td:contains('Repair Bear Mk.4')"		:"Repair Bear Mk.4<br>"			+"修理熊 Mk.4"
		,"td:contains('Damon Duality')"			:"Damon Duality<br>"			+"双重守护精灵"
		,"td:contains('Free-Flowing Dust')"		:"Free-Flowing Dust<br>"		+"自由流动的尘"
		,"td:contains('Grace and Knowledge')"	:"Grace and Knowledge<br>"		+"恩典和知识"
		,"td:contains('Golden Compasses')"		:"Golden Compasses<br>"			+"黄金罗盘"
		,"td:contains('Asahattr')"				:"Asahattr<br>"					+"伊瑟艾特"
		
		,"ReplaceMode":
		[	
			 ["attr","input[name='purchase']","value","付费购买"]
			 
			,["html","div.stuffbox p"
				,"By running the Hentai@Home client, you will over time gain special bonus points known as "
				,"执行 Hentai@Home 绅士之家客户端，将会随着时间获得特殊加分："]
			,["html","div.stuffbox p"
				,". These are rewards for people who help keeping this site free, "
				," 骇斯(一种币值). <br>这些是人们免费帮助网站的奖励，"]
			,["html","div.stuffbox p"
				,"fast and responsive by donating bandwidth and computer resources, and can be exchanged here for "
				,"付出网络带宽与电脑资源快速响应网站性能，并且可用来交换："]
			,["html","div.stuffbox"
				,'<span style="font-style:italic">Hath Perks</span>'
				,'<span style="font-style:italic">Hath Perks (特殊功能) </span>']
			,["html","div.stuffbox p"
				,", which grant beneficial effects on E-Hentai Galleries and in the HentaiVerse."
				,"<br>让用户在此站享受更尊贵的体验而设立的各种增强功能，包括HentaiVerse小游戏在内."]
				
			,["html","div.stuffbox p"
				,"If running H@H is not an option, you can also you can exchange Credits for Hath at the "
				,"如果不想使用 Hentai@Home 绅士之家，你也可以使用 Credits (绅士币/信用点) 购买交换，就在 "]
				
			,["html","div.stuffbox p"
				,"While the Hath Perks for the HentaiVerse cannot be obtained in any other way, "
				,"对于HentaiVerse所使用的特殊功能并不能从其他管道获取，"]
			,["html","div.stuffbox p"
				,"most of the ones that are specific for Galleries will also get unlocked by making a donation on the "
				,"部分特定的画册功能将会通过捐款赞助而解锁："]
			,["html","div.stuffbox p"
				,". These will be refunded if you buy them for Hath, and later make a qualifying donation."
				,". <br>如果用户获得捐款资格(星星)前就已购入这些能力，那么已花费的 <font color='DarkOrchid'>骇斯</font> 会稍后退还.<br>"]
			,["html","div.stuffbox p"
				,'There is also an option to "adopt" H@H clients that will grant you Hath over time as if you were running it yourself.'
				,'当然也可以通过自己 "营运" 绅士之家客户端并获得相应的 Hath 骇斯币.<br><br>'
				+"本条目部分参考自<a href='http://zh.scratchpad.wikia.com/wiki/Hath_Perks?variant=zh-tw'>围纪实验室 ( Hath Perks )</a><br>"]
			
			
			,["html","div.stuffbox p:contains('You currently have')","You currently have","现在拥有"]
			,["html","td","That's Good Eatin'"	,"That's Good Eatin'<br>"		+"这倒是挺好吃的！"]
			//Ads-Be-Gone
			,["html","td"
				,"Unlocks the display ads toggle for E-Hentai Galleries on the User Settings page."
				,"解锁E绅士设置页的广告显示开关. "]
			,["html","td"
				,"This will allow you to browse E-Hentai Galleries sans ads, and still retain your conscience."
				,"此功能让你无广告浏览E绅士图库，并且仍保留你的良心。"]
			//Tag Flagging
			,["html","td"
				,"Allows you to specify up to three groups of good and bad tags. "
				,"可让你指定多达三组好与坏标签. "]
			,["html","td"
				,"Galleries containing these tags are automatically flagged as such on the index and search pages."
				,"包含指定标签的图库会自动打出旗号，诸如目录和搜索页面."]
			//Source Nexus
			,["html","td"
				,"Unlocks the Original Images functionality on E-Hentai Galleries."
				,"解锁E绅士图库的原图显示功能."]
			,["html","td"
				,"This allows you to browse the original, non-resampled version of a gallery directly."
				,"此功能让你直接浏览原始图片，而非重新采样压缩版本的图库。"]
			//Multi-Page Viewer
			,["html","td"
				,"Unlocks the Multi-Page Viewer function on E-Hentai Galleries."
				,"解锁E绅士图库的多页快速阅读器功能."]
			,["html","td"
				,"This allows you to view all images from a gallery on one page."
				,"此功能让你在单一页面里查看一组图库里的所有图片."]
			//More Thumbs
			,["html","td"
				,"Increases the maximum number of thumbnail rows to 10."
				,"增加缩略图列（Thumb Rows）的最大列数至 10 列."]
			//Thumbs Up
			,["html","td"
				,"Further increases the maximum number of thumbnail rows to 20."
				,"进一步增加缩略图列的最大列数至 20 列."]
			//All Thumbs
			,["html","td"
				,"Further increases the maximum number of thumbnail rows to 40."
				,"进一步增加缩略图列的最大列数至 40 列."]
			//More Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of two."
				,"提高你所有可查看页数上限为两倍."]
			//Lots of Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of five."
				,"提高你所有可查看页数上限为五倍."]
			//Too Many Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of ten."
				,"提高你所有可查看页数上限为十倍."]
			//More Favorite Notes I
			,["html","td"
				,"Increases the number of favorite note slots to 10000."
				,"我的收藏注记（Favorites Note）栏数扩增至 1万 个."]
			//More Favorite Notes II
			,["html","td"
				,"Increases the number of favorite note slots to 25000."
				,"我的收藏注记（Favorites Note）栏数扩增至 2万5 个."]
			//Paging Enlargement I
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 50."
				,"增加目录/搜索页面每一页的显示项目数至 50 个."]
			//Paging Enlargement II
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 100."
				,"增加目录/搜索页面每一页的显示项目数至 100 个."]
			//Paging Enlargement III
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 200."
				,"增加目录/搜索页面每一页的显示项目数至 200 个."]
			//Postage Paid
			,["html","td"
				,"You no longer have to pay postage or CoD fees on messages sent through MoogleMail."
				,"你使用<a href='http://zh.scratchpad.wikia.com/wiki/MoogleMail'>莫古利邮务</a>可免收邮资和货到付款手续费。"]
			//Vigorous Vitality
			,["html","td"
				,"Increases your base health by 10%."
				,"增加你的基础生命值 10%."]
			//Effluent Ether
			,["html","td"
				,"Increases your base mana by 10%."
				,"增加你的基础魔力值 10%."]
			//Suffusive Spirit
			,["html","td"
				,"Increases your base spirit by 10%."
				,"增加你的基础灵力值 10%."]
			//Resplendent Regeneration
			,["html","td"
				,"Increases both your in-combat and out-of-combat regeneration by 50%."
				,"增强你的<a href='http://zh.scratchpad.wikia.com/wiki/Battles#.E4.BD.9C.E6.88.B0'>战斗</a>中与战斗外的<a href='http://zh.scratchpad.wikia.com/wiki/Character_Stats#Regeneration_Rates'>再生能力</a> 50%."]
			//Enigma Energizer
			,["html","td"
				,"Doubles the bonus from the riddlemaster, and increases duration to 50 turns."
				,"加倍<a href='http://zh.scratchpad.wikia.com/wiki/RiddleMaster'>御谜士</a>的奖励，持续回合数增加至 50 回合."]
			//Yakety Sax
			,["html","td"
				,"Monsters will never catch you when fleeing."
				,"你<a href='http://zh.scratchpad.wikia.com/wiki/Skills#Innate_Skills'>逃跑</a>时不会被怪物抓到."]
			//Soul Catcher
			,["html","td"
				,"Get ten free soul fragments every dawn event."
				,"每次<a href='http://zh.scratchpad.wikia.com/wiki/Dawn_of_a_New_Day'>黎明事件</a>可得到 10 片免费的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Soul_Fragments'>灵魂断片</a>"]
			,["html","td"
				,"Note that it will not tell you that you got them, they are silently added to your inventory."
				," 偷偷的增加到你的库存里. "]
			//Extra Strength Formula
			,["html","td"
				,"Happy Pills now fully restore a monster's morale."
				,"快乐药丸会完全恢复怪物的<a href='http://zh.scratchpad.wikia.com/wiki/Monster_Lab#Morale'>士气值</a>."]
			//That's Good Eatin'
			,["html","td"
				,"Increases monster food recovery amount by 20%."
				,"增加怪物<a href='http://zh.scratchpad.wikia.com/wiki/Monster_Lab#Food'>食物</a>的饱足感 20%."]
			//Coupon Clipper
			,["html","td"
				,"10% discount on all purchases at the Item Shop."
				,"在<a href='http://zh.scratchpad.wikia.com/wiki/Bazaar#Item_Shop'>道具店</a>的所有购物享 10% 折扣."]
			//Long Gone Before Daylight
			,["html","td"
				,"The first energy drink used in a day gives twice the normal amount of stamina."
				,"每天的第一瓶<a href='http://zh.scratchpad.wikia.com/wiki/Items#Other_Restoratives'>能量饮料</a>恢复量加倍."]
			//Dark Descent
			,["html","td"
				,"Halve the required number of amnesia shards for reseting an item's potential."
				,"重置装备潜在能力的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Enchantments'>失忆碎片</a>所需数量减半."]
			//Eminent Elementalist
			,["html","td"
				,"Increases effective Elemental Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基础元素魔法熟练度的 10% 会增加到<a href='http://zh.scratchpad.wikia.com/wiki/Proficiencies#Effective_Proficiency'>有效熟练度</a>里."]
			//Divine Warmage
			,["html","td"
				,"Increases effective Divine Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基础神圣魔法熟练度的 10% 会增加到有效熟练度里."]
			//Death and Decay
			,["html","td"
				,"Increases effective Forbidden Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基础禁断魔法熟练度的 10% 会增加到有效熟练度里."]
			//Evil Enchantress
			,["html","td"
				,"Increases effective Deprecating Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基础贬抑魔法熟练度的 10% 会增加到有效熟练度里."]
			//Force of Nature
			,["html","td"
				,"Increases effective Supportive Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基础辅助魔法熟练度的 10% 会增加到有效熟练度里."]
			//Manehattan Project
			,["html","td"
				,"Significantly boosts the damage output of the Orbital Friendship Cannon."
				,"大幅提升「<a href='http://zh.scratchpad.wikia.com/wiki/Skills#Special_Skills'>友情小马砲</a>」的杀伤力。"]
			//Follower of Snowflake
			,["html","td"
				,"Displays your unyielding devotion to Snowflake, the Goddess of Loot and Harvest."
				,"雪花 ─ 专司战利品与收获的女神。宣示你对祂不屈不挠的奉献精神。( <a href='https://forums.e-hentai.org/index.php?s=&showtopic=170909&view=findpost&p=3550156'>解释</a> )"]
			//Thinking Cap
			,["html","td"
				,"Increases EXP gain by 25%. For calculation purposes, this bonus is added to the HentaiVerse training bonus."
				,"所有取得的<a href='http://zh.scratchpad.wikia.com/wiki/Experience_Points'>经验值</a>提升 25%. 为计算方便，这个奖励被合并到《HentaiVerse》<a  href='http://zh.scratchpad.wikia.com/wiki/Training'>训练奖励</a>."]
			//Mentats
			,["html","td"
				,"Increases this EXP bonus to 50%."
				,"提升经验值奖励至 50%.<a href='https://zh.wikipedia.org/wiki/%E9%96%80%E5%A1%94%E7%89%B9'> ( 其他相关 )</a>"]
			//Learning Chip
			,["html","td"
				,"Increases this EXP bonus to 75%."
				,"提升经验值奖励至 75%."]
			//Cybernetic Implants
			,["html","td"
				,"Increases this EXP bonus to 100%."
				,"提升经验值奖励至 100%."]
			//Innate Arcana I
			,["html","td"
				,"Unlocks the first auto-cast slot in the HentaiVerse, with a 10% upkeep reduction bonus."
				,"在《HentaiVerse》解锁第一个<a href='http://zh.scratchpad.wikia.com/wiki/HentaiVerse_Settings#Auto-cast_Slots'>自动施法栏</a>，附赠 10% <a href='http://zh.scratchpad.wikia.com/wiki/HentaiVerse_Settings#.E6.B6.88.E8.80.97'>维持量</a>折扣奖励."]
			,["html","td"
				,"This allows you to select a spell that will be cast automatically."
				,"此能力让你选择一种咒语自动施放."]
			//Innate Arcana II
			,["html","td"
				,"Unlocks a second auto-cast slot, and reduces total upkeep by 20%."
				,"解锁第二个自动施法栏，和 20% 总维持量折扣."]
			//Innate Arcana III
			,["html","td"
				,"Unlocks a third auto-cast slot, and reduces total upkeep by 30%."
				,"解锁第三个自动施法栏，和 30% 总维持量折扣."]
			//Innate Arcana IV
			,["html","td"
				,"Unlocks a fourth auto-cast slot, and reduces total upkeep by 40%."
				,"解锁第四个自动施法栏，和 40% 总维持量折扣."]
			//Innate Arcana V
			,["html","td"
				,"Unlocks a fifth auto-cast slot, and reduces total upkeep by 50%."
				,"解锁第五个自动施法栏，和 50% 总维持量折扣."]
			//Crystarium I
			,["html","td"
				,"Whenever a monster drops a crystal in the HentaiVerse, you will receive an additional bonus crystal."
				,"在《HentaiVerse》里每当一只怪物掉落一颗<a href='http://zh.scratchpad.wikia.com/wiki/Items#Crystals'>水晶时</a>，你将会再获得一颗水晶作为追加奖励。"]
			//Crystarium II
			,["html","td"
				,"Further increases the number of crystals received per drop to three."
				,"进一步提高水晶掉落数量至三倍."]
			//Crystarium III
			,["html","td"
				,"Further increases the number of crystals received per drop to five."
				,"进一步提高水晶掉落数量至五倍."]
			//Crystarium IV
			,["html","td"
				,"Further increases the number of crystals received per drop to seven."
				,"	进一步提高水晶掉落数量至七倍."]
			//Crystarium V
			,["html","td"
				,"Further increases the number of crystals received per drop to ten."
				,"进一步提高水晶掉落数量至十倍."]
			//Tokenizer I
			,["html","td"
				,"Doubles the chance of random mob token drops."
				,"打怪的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Tokens'>令牌</a>掉落率变成双倍."]
			//Tokenizer II
			,["html","td"
				,"Triples the chance of random mob token drops."
				,"打怪的令牌掉落率变成三倍."]
			//Tokenizer III
			,["html","td"
				,"Quadruples the chance of random mob token drops."
				,"打怪的令牌掉落率变成四倍."]
			//Repair Bear Mk.1
			,["html","td"
				,"The latest invention from Moogle Dynamics, "
				,"莫古利动力学的最新发明，"]
			,["html","td"
				,"the Repair Bear will follow you around and help you keep your equipment in good shape at all times."
				,"<a href='http://zh.scratchpad.wikia.com/wiki/The_Forge#Repair'>修理熊</a>会随侍在侧帮助你的<a href='http://zh.scratchpad.wikia.com/wiki/Equipment'>装备</a>随时保持良好状态."]
			,["html","td"
				,"This reduces effective equipment wear by half."
				,"有效装备耗损程度减少一半."]
			//Repair Bear Mk.2
			,["html","td"
				,"Further hones the skills of your Repair Bear, making it better at maintaining your equipment."
				,"进一步磨练你的修理熊的技巧，使牠精于维护你的装备."]
			,["html","td"
				,"Effective equipment wear is reduced to 25% of normal."
				,"有效装备耗损程度减少为正常值的 25%."]
			//Repair Bear Mk.3
			,["html","td"
				,"Trains your Repair Bear to the penultimate level, "
				,"将你的修理熊培训至完全体，"]
			,["html","td"
				,"making those pesky forge visits \\(almost\\) a distant memory."
				,"让那些烦人的锻造次数 (几乎) 成为遥远的记忆.<br>"]
			,["html","td"
				,"Effective equipment wear is reduced to 10% of normal."
				,"有效装备耗损程度减少为正常值的 10%."]
			//Repair Bear Mk.4
			,["html","td"
				,"The pinnacle of Repair Bear Technology, "
				,"修理熊科技的顶尖之作，"]
			,["html","td"
				,"providing the ultimate in-the-field preventive equipment maintenance."
				,"提供这门领域最高级的预防性装备维护技术.<br>"]
			,["html","td"
				,"Equipment wear is fully eliminated, and defeat durability loss is cut by half."
				,"装备耗损完全消除，被<a href='http://zh.scratchpad.wikia.com/wiki/Battles#.E6.95.97.E5.8C.97'>击倒</a>时的耐久度损耗减半."]
			//Damon Duality
			,["html","td"
				,"Increases attack damage and magic damage by 10%."
				,"提升攻击伤害和魔法伤害各 10%."]
			//Free-Flowing Dust
			,["html","td"
				,"Increases attack damage and magic damage by 15%."
				,"提升攻击伤害和魔法伤害各 15%."]
			//Grace and Knowledge
			,["html","td"
				,"Increases attack damage and magic damage by 20%."
				,"提升攻击伤害和魔法伤害各 20%."]
			//Golden Compasses
			,["html","td"
				,"Increases attack damage and magic damage by 25%."
				,"提升攻击伤害和魔法伤害各 25%."]
			//Asahattr
			,["html","td"
				,"Increases attack damage and magic damage by 30%."
				,"提升攻击伤害和魔法伤害各 30%."]
		]
	},
	
	"exchange.php":
	{
		//All
		 "h2:contains('Spread')"					:"股市价差"
		,"h2:contains('Recent Transactions')"		:"近期交易"
		,"strong:contains('High')"					:"最高"
		,"strong:contains('Low')"					:"最低"
		,"strong:contains('Avg')"					:"平均"
		,"strong:contains('Vol')"					:"规模"
		,"h3:contains('Bid (Buyers)')"				:"出价 ( 买家 )"
		,"h3:contains('Ask (Sellers)')"				:"询价 ( 卖家 )"
		,"#historytable th:contains('Time')"		:"时间"
		,"#historytable th:contains('Seller')"		:"卖家"
		,"#historytable th:contains('Buyer')"		:"买家"
		,"#historytable th:contains('Volume')"		:"规模" //数量
		,"#historytable th:contains('Unit Cost')"	:"单价"
		,"#buyform  a:contains('Update Bid!')"		:"<font color='red'>更改</font>出价!"
		,"#sellform a:contains('Update Ask!')"		:"<font color='red'>更改</font>询价!"
		
		//The Hath Exchange
		,"h1:contains('The Hath Exchange')"			:"骇斯市集 (-Hath-)"
		,"h2:contains('Last 8 Hours (per Hath)')"	:"近8小时 (单骇斯币)"
		,"h2:contains('Last 24 Hours (per Hath)')"	:"近24小时 (单骇斯币)"
		,"h2:contains('Buy Hath')"					:"购买骇斯币"
		,"h2:contains('Sell Hath')"					:"卖出骇斯币"
		,"#buyform  a:contains('Buy Hath!')"		:"<font color='red'>购买</font>骇斯币!"
		,"#sellform a:contains('Sell Hath!')"		:"<font color='red'>卖出</font>骇斯币!"
		
		//The GP Exchange
		,"h1:contains('The GP Exchange')"			:"图币市场 (-kGP-)"
		,"h2:contains('Last 8 Hours (per kGP)')"	:"近8小时 (每个图币)"
		,"h2:contains('Last 24 Hours (per kGP)')"	:"近24小时 (每个图币)"
		,"h2:contains('Buy GP')"					:"购买图币"
		,"h2:contains('Sell GP')"					:"卖出图币"
		,"#buyform  a:contains('Buy GP!')"			:"<font color='red'>购买</font>图币!"
		,"#sellform a:contains('Sell GP!')"			:"<font color='red'>卖出</font>图币!"
		
		,"ReplaceMode":
		[
			//All
			 ["html","#buyform"  ,"Buy Count:"		,"购买规模："]
			,["html","#sellform" ,"Sell Count:"		,"卖出规模："]
			,["html","div:contains('Available: ')"	,"Available:"	,"可用："]
			,["html","#buyform,#sellform"			,"> C &nbsp;"	,"> <font color='darkgreen'>绅士币</font>"]
			//The Hath Exchange
			,["html","#buyform"  ,"Bid Price/Hath:"	,"<br>出价/单骇斯币："]
			,["html","#sellform" ,"Ask Price/Hath:"	,"<br>询价/单骇斯币："]
			//The GP Exchange
			,["html","#buyform"  ,"Bid Price/kGP:"	,"<br>出价/单图币："]
			,["html","#sellform" ,"Ask Price/kGP:"	,"<br>询价/单图币："]
			
			//All
			,["html","div:contains(' Credits')"		
				,"Credits"			
				,"<font color='darkgreen'>绅士币</font>"]
			,["html","div:contains(' Hath')"		
				," Hath"				
				,"<font color='darkblue'> 骇斯币</font>"]
			,["html","div:contains(' kGP')"		
				," kGP"				
				,"<font color='darkblue'> 千图币</font>"]
		]
	},
	
	"logs.php":
	{
		//All
		 "th:contains('Date')"			:"日期"
		 
		//Credit Log
		,"th:contains('Amount')"		:"规模"
		,"th:contains('Information')"	:"消息"
		
		//Karma Log
		,"th:contains('Karma')"			:"业力"
		,"th:contains('From')"			:"来自"
		,"th:contains('Topic')"			:"主题"
		,"th:contains('Comment')"		:"评论"
		
		,"ReplaceMode":
		[
			//Credit Log - Normal
			 ["html","div[style='overflow:hidden']" ,"GP Exchange Transaction "		
				,"<font color='RoyalBlue'>图币</font>交易 "]
			,["html","div[style='overflow:hidden']" ,"Hath Exchange Transaction "	
				,"<font color='DarkOrchid'>骇斯</font>交易 "]
			,["html","div[style='overflow:hidden']" ,"\\(Bought "
				,"[<font color='red'>购买</font> "]
			,["html","div[style='overflow:hidden']" ,"\\(Sold "	
				,"[<font color='green'>卖出</font> "]
			,["html","div[style='overflow:hidden']" ," kGP "	
				," <font color='RoyalBlue'>千图币</font> "]
			,["html","div[style='overflow:hidden']" ," Hath "	
				," <font color='DarkOrchid'>骇斯币</font> "]
			,["html","div[style='overflow:hidden']" ," @ "		
				," (单价) "]
			,["html","div[style='overflow:hidden']" ," C\\)"
				," <font color='Teal'>绅士币</font>]"]
			//Credit Log - Donation
			,["html","div[style='overflow:hidden']" ," Donation "
				," <font color='Gray'>美金</font>捐款 "]
			,["html","div[style='overflow:hidden']" ,"\\(Refunded "
				," ( <font color='green'>返还</font> "]
			,["html","div[style='overflow:hidden']" ," Hath\\)"
				," <font color='DarkOrchid'>骇斯币</font> )"]
			//Karma Log
			,["html","div:contains('Total Karma: ')"
				,"Total Karma: "
				,"<a href='https://ehwiki.org/wiki/Karma/Chinese'>(不知道有什么用的)</a> 业力总计："]
		]
	},
	
	//我的收藏
	"favorites.php":
	{
		 "div.ido h1:contains('Favorites')"				:"我的收藏"
		,"div.fp:contains('Show All Favorites')"		:"显示所有收藏"
		,"span:contains('List')"						:"列表"
		,"a[rel='nofollow']:contains('Show Thumbnails')":"缩略图"
		,"span:contains('Favorited')"					:"收藏时间"
		,"a[rel='nofollow']:contains('Use Posted')"		:"发表时间"
		
		,"table.itg th:contains('Published')"			:"发表时间"
		,"table.itg th a:contains('Published')"			:"发表时间"
		,"table.itg th:contains('Name')"				:"标题"
		,"table.itg th:contains('Favorited')"			:"收藏时间"
		,"table.itg th a:contains('Favorited')"			:"收藏时间"
		,"p:contains('No hits found')"					:"<font color='red'><b>无搜索结果</b></font>"
		
		,"ReplaceMode":
		[
			 ["attr","input[name='f_apply']"			,"value"			,"本页搜索"]
			,["attr","input[name='f_clear']"			,"value"			,"清除"]
			
			,["html","div.ido p.ip"									,"Showing"			,"显示"]
			,["html","div.ido p.ip"									,"of"				,"共"]
			,["html","form[name='favform'] div"						,"Display:"			,"显示模式："]
			,["html","form[name='favform'] div span"				,"Thumbnails"		,"缩略图"]
			,["html","form[name='favform'] div a"					,"Show List"		,"列表"]
			,["html","form[name='favform'] div"						,"Order:"			,"排序："]
			,["html","form[name='favform'] div span"				,"Posted"			,"发表时间"]
			,["html","form[name='favform'] div a"					,"Use Favorited"	,"收藏时间"]
			,["html","div.itg div.id1 div.id42"						,"files"	,"页"]
			
			,["html","option[value='delete']"						,"Remove from Favorites"	,"移除收藏"]
			,["attp","optgroup[label='Change Favorite Category']"	,"label" ,"Change Favorite Category"		,"转移项目至收藏："]
			,["attr","input[name='apply']"							,"value"			,"确定"]
			,["html","form[name='favform']:eq(0) div:eq(2)","Action:","动作："]
		]
	},
	
	//画册模式
	"GalleryMode":
	{
		 "h1:contains('Content Warning')"	:"内容警告"
		,"a:contains('View Gallery')"		:"进入画册"
		,"a:contains('Get Me Outta Here')"	:"我要离开"
		,"a:contains('Never Warn Me Again')":"不再警告"		
		
		,"#gd5 p[class='g2 gsp'] a:contains('Multi-Page Viewer')":
			"多页快速阅览"
		,"#gdd td.gdt2:contains('No (Replaced)')":
			"不 ( 已被取代 )"
		,"#gnd p:contains('There are newer versions of this gallery available:')":
			"已有此画册的更新版本："
		,"div[class='c4 nosel'] a:contains('Edit')":
			"编辑评论"
		
		,"ReplaceMode":
		[
			["html","div"
				,"This gallery has been flagged as"
				,"此画册已被标注为"]
			,["html","div strong"
				,"Offensive For Everyone"
				,"非大众向"]
			,["html","div"
				,". Due to its content, it should not be viewed by anyone."
				,". 这个内容物并不适合被任何人观看."]
			,["html","div"
				,"\\(And if you choose to ignore this warning, you lose all rights to complain about it in the future.\\)"
				,"( 如果你选择忽视这个警告，你失去一切未来抱怨的权利 )"]
			,["html","#gnd",", added"		," 添加时间"]
			,["html",".gpc","Showing"		,"显示"]
			,["html",".gpc","of"			,"项，共"]
			,["html",".gpc","images"		,"张"]
			
			,["html","div[class='c3']"			,"Posted on"		,"发表于"]
			,["html","div[class='c4 nosel']"	,"Uploader Comment"	,"上传者注释"]
			,["html","div[class='c4 nosel'] a"	,"Vote-"	,"减分-"]
			,["html","div[class='c4 nosel'] a"	,"Vote+"	,"加分"]
			,["html","div[class='c5 nosel']"	,"Score "	,"评价"]
			
			,["html","#postnewcomment a"	,"Post New Comment"	,"发表新回复"]
			,["html","#rating_label"		,"Average"			,"平均"]
			
			,["html","#taglist"				
				,"No tags have been added for this gallery yet."	
				,"画册尚未标记，"]
			,["html","#taglist"
				,"You can enter some tags below to make this gallery less sad."
				,"可在下方填入"]
			
			,["html","#chd p","There is"								,"这里有"]
			,["html","#chd p","more comment below the viewing threshold","个及更多回复"]
			,["html","#chd p a","click to show all"						,"点我显示"]
			
			,["attr","#gdn a img.ygm"	,"title","跟他联系"]
			,["attr","span.halp"		,"title","此画册已翻译"]
			,["attr","#newtagbutton"	,"value","标记!"]
			,["attr","#newtagfield"		,"placeholder","输入新标记，使用逗号批次输入 (仅支持英文)"]
			,["attr","div.c3 a img.ygm"	,"title","跟他联系"]
			,["modi","#gd3"	,{
				 "modiTarget1"			:"#rating_label"
				,"Average:"				:"平均："
				,"Rate as"				:"评等"
				,"stars"				:"个星"
				,"Thanks for rating!"	:"感谢评分!"
				,"Rating failed."		:"评分失败."
				,"Not Yet Rated"		:"未有评分"
				,"modiTarget2"			:"#favcount"
				,"times"				:"次"
				,"Once"					:"1 次"
				,"modiTarget3"			:"#favoritelink"
				,"Add to Favorites"		:"加入收藏"
			}]
			,["modi","#tagmenu_act"	,{
				 ">Vote Up<"				:"><font color='green'>加分</font><"
				,">Vote Down<"				:"><font color='red'>扣分</font><"
				,">Show Tagged Galleries<"	:"><font color='darkblue'>显示此标签的画册</font><"
				,">Show Tag Definition<"	:">显示标签定义(英文)<"
				,">Add New Tag<"			:">添加标签<"
				,">Withdraw Vote<"			:">取消分数<"
			}]
			,["attr","textarea[name='commenttext']"	
				,"placeholder"
				,"在这边输入评论后发表，如果最后一则评论是你的，将会自动沿展评论区."]
			,["attr","input[value='Post Comment']","value","发表评论"]
			,["html","div.c7[id*='cvotes_']","Base +","基础"]
			,["html","div.c8","Last edited on ","最后更新时间："]
		]
	},
	
	"exhentai.org/mpv/":
	{
		"ReplaceMode":
		[
			//右侧模式列
			 ["attr","img[title='Close Image Viewer']","title"
				,"关闭阅图器"]
			,["attr","img[title='Go Fullscreen - F11 or ESC to cancel']","title"
				,"切换至全屏幕模式 - 按下F11或ESC取消"]
			,["attr","img[title='Align Left, Scale Down Only']","title"
				,"向左对齐，仅按比例缩小"]
			,["attr","img[title='Align Center, Scale Down Only']","title"
				,"向中对齐，仅按比例缩小"]
			,["attr","img[title='Align Center, Scale To Fit']","title"
				,"向中对齐，缩放最适大小"]
			,["attr","img[title='Show Thumbnail Pane']","title"
				,"显示缩略图列"]
			,["attr","img[title='Hide Thumbnail Pane']","title"
				,"隐藏缩略图列"]
		]
	},
	
	"g.e-hentai.org/mpv/":
	{
		"ReplaceMode":
		[
			//右侧模式列
			 ["attr","img[title='Close Image Viewer']","title"
				,"关闭阅图器"]
			,["attr","img[title='Go Fullscreen - F11 or ESC to cancel']","title"
				,"切换至全屏幕模式 - 按下F11或ESC取消"]
			,["attr","img[title='Align Left, Scale Down Only']","title"
				,"向左对齐，仅按比例缩小"]
			,["attr","img[title='Align Center, Scale Down Only']","title"
				,"向中对齐，仅按比例缩小"]
			,["attr","img[title='Align Center, Scale To Fit']","title"
				,"向中对齐，缩放最适大小"]
			,["attr","img[title='Show Thumbnail Pane']","title"
				,"显示缩略图列"]
			,["attr","img[title='Hide Thumbnail Pane']","title"
				,"隐藏缩略图列"]
			//图片相关
			/*
			,["attp","img[title*='original']","title"
				,"Download original"
				,"下载原始图片"]
			,["attp","img[title*='original']","title"
				,"source"
				,""]
			*/
			/*
			,["attr","img[title='Reload broken image']","title"
				,"重载坏连图片"]
			,["attr","img[title='Open image in normal viewer']","title"
				,"使用普通阅览模式开启图片"]
			,["attr","img[title='Show galleries with this image']","title"
				,"以图搜图"]
			,["attr","img[title='Get forum link to image']","title"
				,"取得论坛链接"]
			*/
				
		]
	},
	
	"g.e-hentai.org/s/":
	{
		 "a[href*='f_shash=']:contains('Show all galleries with this file')":
			"显示此图片相关画册(以图搜图)"
		,"a[onclick*='Copy the URL below.']:contains('Generate a static forum image link')":
			"生成论坛用静态贴图链接"
		,"a[id='loadfail']:contains('Click here if the image fails loading')":
			"点我刷新载入失败图片"
		,"ReplaceMode":
		[
			 ["html","a[href*='fullimg.php']","Download original"	,"下载原始图片："]
			,["html","a[href*='fullimg.php']"," source"				,""]
			,["attr","img[src='http://ehgt.org/g/f.png']","title"	,"到第一页"]
			,["attr","img[src='http://ehgt.org/g/p.png']","title"	,"上一页"]
			,["attr","img[src='http://ehgt.org/g/n.png']","title"	,"下一页"]
			,["attr","img[src='http://ehgt.org/g/l.png']","title"	,"到最后一页"]
			,["attr","img[src='http://ehgt.org/g/b.png']","title"	,"回画册列表"]
		]
		
	},
	
	"exhentai.org/s/":
	{
		 "a[href*='f_shash=']:contains('Show all galleries with this file')":
			"显示此图片相关画册(以图搜图)"
		,"a[onclick*='Copy the URL below.']:contains('Generate a static forum image link')":
			"生成论坛用静态贴图链接"
		,"a[id='loadfail']:contains('Click here if the image fails loading')":
			"点我刷新载入失败图片"
		,"ReplaceMode":
		[
			 ["html","a[href*='fullimg.php']","Download original"	,"下载原始图片："]
			,["html","a[href*='fullimg.php']"," source"				,""]
			,["attr","img[src='http://exhentai.org/img/f.png']","title"	,"到第一页"]
			,["attr","img[src='http://exhentai.org/img/p.png']","title"	,"上一页"]
			,["attr","img[src='http://exhentai.org/img/n.png']","title"	,"下一页"]
			,["attr","img[src='http://exhentai.org/img/l.png']","title"	,"到最后一页"]
			,["attr","img[src='http://exhentai.org/img/b.png']","title"	,"回画册列表"]
		]
		
	},
	
	"archiver.php":
	{
		 "#db p:contains('Current Funds:')"	:"现有代币："
		,"#db strong:contains('Free!')"		:"免费!"
		 
		,"ReplaceMode":
		[
			 ["html","#db div","Download Cost:"				,"下载花费："]
			,["html","#db div","Estimated Archive Size:"	,"预估大小："]
			,["attr","#db input[value='Download Archive']"	,"value","下载压缩包"]
			,["html","#db p"
				,"Note: Pressing this button will immediately deduct funds."				
				,"注意事项：按下按钮将立即扣除代币."]
			,["html","#db p"
				,"If the download fails, you will have a week to re-download it."				
				,"如果下载失败，你还有一个星期来重新下载."]
		]
	},
	
	"gallerypopups.php":
	{
		//收藏类
		 "#galpop p:contains('Please choose a color to file this favorite gallery under. You can also add a note to it if you wish.')":
			"请选择一个收藏色作为识别，你也可以加入注记."
		,"#galpop p:contains('Favorite Note (Max 200 Characters)')":
			"收藏注记 ( 最多 200 英文字母 )"
		,"#galpop div.nosel div[onclick*='favdel']:contains('Remove from Favorites')":
			"移除收藏"
		//删除类
		,"#galpop p:contains('Specify an objective reason why you wish to expunge this gallery.')":
			"选择删除画册的原因."
		,"label[for='exp1']":"无 / 撤回请愿."
		,"label[for='exp3']":"这是个重复的画册或早些发表品质较低的画册，需要明确标示."
		,"label[for='exp6']":"画册已更新，此画册的更高品质副本已被上传."
		,"#galpop a:contains('Close Window')":"关闭窗口"
		
		//改名类
		,"#galpop p:contains('Roman Script')"	:"默认标题 ( Roman Script )"
		,"#galpop p:contains('Japanese Script')":"次要标题 ( Japanese Script )"
		,"#galpop td:contains('Uploader:')"		:"上传者："
		,"#galpop td:contains(' New')"			:"添加"
		,"#galpop label:contains('Blank Vote')"	:"废票"
		
		,"ReplaceMode":
		[
			//收藏类
			 ["html","#galpop div","favorite note slots used.","个收藏注记已被使用."]
			,["attr","input[value='Add to Favorites']"	,"value","加入收藏"]
			,["attr","input[value='Apply Changes']"		,"value","确定修改"]
			
			//删除类
			,["html","label[for='exp5']"	
				,"This gallery contains either illicit content like child porn or anything else forbidden by the"
				,"这个画册包含儿童色情或其他"]
			,["html","label[for='exp5']"	
				,">Terms of Service<"
				,">服务条款<"]
			,["html","label[for='exp5']"	
				,", or otherwise falls under the"
				," 禁止的非法内容，除此之外请依据"]
			,["html","label[for='exp5']"
				,">Expunge Guidelines<"
				,">删除指南<"]
			,["html","label[for='exp5']"
				,"\\(specify below\\)."
				,"在下面具体说明."]
			,["attr","textarea[name='expungexpl']"
				,"placeholder"
				,"在此输入此次请愿的说明\n必须包含重复画册的网址或被违反的规定."]
			,["attr","input[value='Show Expunge Log']"		,"value","- 显示删除记录 -"]
			,["attr","input[value='Petition to Expunge']"	,"value","- 递交删除请愿 -"]
			//删除记录
			,["html","#galpop p"
				,"No expunge petitions have been filed for this gallery"
				,"此画册没有任何删除请愿书"]
			,["attr","input[value='Back']"		,"value","上一页"]
			//改名类
			,["attr","input[value='Submit']"	,"value","确定"]
		]
	},
	
	"report.php":
	{
		 "div.stuffbox td:contains('Report Category:')"		:"举报类型："
		,"div.stuffbox td:contains('Specify Complaint:')"	:"说明内容："
		,"div.stuffbox td:contains('Contact E-Mail:')"		:"电子邮箱："
		,"div.stuffbox td:contains('(Required)')"			:"( 必须 )"
		,"div.stuffbox td:contains('(Optional)')"			:"( 选填 )"
		,"div.stuffbox a[target='tos']"						:"帮助说明"
		
		,"ReplaceMode":
		[
			 ["attr","input[value='Submit Report']","value","确定举报"]
			,["html","div.stuffbox p"
				,"Reporting content from:"
				,"回报项目来自于："]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"\\[Select a complaint type...\\]"	,"[ 选择一种类型 ]"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Copyright Infringement"			,"版权侵权"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Child Pornography"				,"儿童色情"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Other ToS-infringing Content"		,"其他服务类型侵权内容"]
			,["html","div.stuffbox p"
				,"If you leave your e-mail address, we may contact you with the result of, "
				,"如果你有留下电子邮箱，有结果时我们将会联系，"]
			,["html","div.stuffbox p"
				,"or further inquiries regarding your report."
				,"或更进一步审查你的举报."]
			,["html","div.stuffbox p"
				,"The e-mail address will not be used for any other purposes, "
				,"<br>电子邮箱并不会做其他用途，"]
			,["html","div.stuffbox p"
				,"and will be removed from our systems when the report has been processed."
				,"并且电子邮箱在举报处理完毕后会从我们的系统中移除."]
				
			,["html","div.stuffbox p"
				,"For Copyright Infringement complaints, "
				,"关于版权投诉，"]
			,["html","div.stuffbox p"
				,"please make sure to include enough information that we can accurately verify your claim."
				,"请务必包含足够的消息，我们才可以准确地验证你的举报."]
			,["html","div.stuffbox p"
				,"A specific list of required information can be found at the bottom of"
				,"<br>所需的具体信息可在此页的底部找到："]
			,["html","div.stuffbox p"
				,"Complaints that do not sufficiently support your claim will be rejected."
				,"如果信息不够完整你的举报将被拒绝."]
				
		]
	}
};
/*
if($("img[src='" + url + "']").length >= 1){
	//window.location.href = "http://tast.banner.tw/Javascript/EHentai/exhentai.jpg"
};
*/

function uconfig(){
	if(TRvalue == "cn"){
		//Page = Page_CN;
		ChineseCH();
	}
	
	if(!url.match('uconfig.php')) return;
	//http://www.w3schools.com/css/css3_borders.asp
	$(	"<div id='Transform' style='border-radius:25px;border: 2px solid #73AD21;padding: 20px; '>"+
		"<h2>繁简设置</h2>"+
			"<div class='optmain'>"+
				"<p>设置绅士站中文化是繁体还是简体<p>"+
				"<div class='optsub'>"+
					'<input type="radio" name="TRlang" value="tw" id="zh_tw" checked="checked">'+
						'<label for="zh_tw" id="TR_tw">繁体中文</label><br>'+
					'<input type="radio" name="TRlang" value="cn" id="zh_cn">'+
						'<label for="zh_cn" id="TR_cn">简体中文 ( 纯字符转换 )</label><br>'+
					//'<input type="radio" name="TRlang" value="cnd" id="zh_cnd">'+
					//	'<label for="zh_cnd" id="TR_cnd">简体中文 ( 常用语支持-更新较慢 )</label><br>'+
				"</div>"+
			"</div>"+
			'<input type="button" id="TRlang" name="Transform" value=" 保存设置 " class="stdbtn">'+
		"</div><br>"
	).insertBefore("#outer form h2:eq(0)");
	
	$("#zh_" + TRvalue).prop("checked",true);
	
	$("#TRlang").click(function(){
		var TRlang 	= $("#Transform input[name='TRlang']:checked").val();
		var TR_ 	= "TR_" + TRlang;
		GM_setValue("TRlang", TRlang);
		
		alert("已更改中文化语系：" + $("#" + TR_).html());
	})
}

Pager();
//setTimeout(function(){ Pager(); }, 50);
function Pager(){
	/*
	if(TRvalue == "cnd" && Page_CN != undefined){
		//alert(TRvalue);
		//Page = {};
		Page = Page_CN;
	}
	*/
	var PageName = "";
	//alert($("h2:contains('Reviewing Toplists')").html());
	//alert('"' + $("h2:contains('Rating \\& Reviewing Toplists')").html() + '"');
	if(url.match(".php")){
		////PageName = new RegExp("http:.+\/(.+)|https:.+\/(.+)",'gmi').exec(url)[1];
				if(url.match('https')){ PageName = new RegExp("https:.+\/(.+)",'gmi').exec(url)[1]; }
		else 	if(url.match('http')) { PageName = new RegExp("http:.+\/(.+)",'gmi') .exec(url)[1]; }
		
		if(url.match("\\?") || url.match("\\&")){
			PageName = PageName.split(".php")[0] + ".php";
		}
	}
	else PageName = url.replace("https://","").replace("http://","");
	
	if(url.match("\\?") || url.match("\\&") || url.match("\\#")){
		PageName = PageName.split("&")[0];
		PageName = PageName.split("?")[0];
		PageName = PageName.split("#")[0];
	}
	
	if(url.match("\/tag\/")) 					PageName = PageName.split('tag')[0]
	if(url.match("\/mpv\/")) 					PageName = PageName.split('mpv')[0] + "mpv/"
	if(url.match(".org\/s\/")) 					PageName = PageName.split('.org\/s\/')[0] + ".org/s/"
	if(url.match(".org\/uploader\/")) 			PageName = PageName.split('.org\/uploader\/')[0] + ".org/"
	if(url.match(".org\/uploader\/")) 			PageName = PageName.split('.org\/uploader\/')[0] + ".org/"
	if(url.match("e-hentai.org\/classic\/")) 	PageName = PageName.split('.org\/classic\/')[0] + ".org/"
	
	ReplaceHtml("main");
	if(Page[PageName] != undefined) ReplaceHtml(PageName);
	if(url.match(".org\/g\/")) 		ReplaceHtml("GalleryMode");
	//alert(PageName);
	uconfig();
};

function ReplaceHtml(Name){
	var Item = Object.keys(Page[Name]);
	for(var i = 0 ; i < Item.length ; i++){
		var elemName  = Item[i];
		var elemText  = Page[Name][elemName];
		/*
		var containsText= new RegExp("contains\\('(.+)'\\)",'gmi').exec(elemName)[1];
		$(elemName).each(function(){
			var elemOriText	= $(this).html();
			if( containsText === elemOriText && containsText.length === elemOriText.length){
				$(this).html(elemText);
			}
			//else $(this).html(elemText);
		});
		*/
		if(elemName.match("contains")){
			//alert(elemName + "\n" + typeof(elemName));
			var containsText= new RegExp("contains\\('(.+)'\\)",'gmi').exec(elemName)[1];
			$(elemName).each(function(){
				var elemOriText	= $(this).html();
				if( containsText === elemOriText && containsText.length === elemOriText.length){
					$(this).html(elemText);
				}
				//else $(this).html(elemText);
			});
		}
		else $(elemName).html(elemText);
	};
	
	if(Page[Name]['ReplaceMode'] 	!== undefined) ReplaceHtml2(Name);
	//if(Page[Name]['AttrMode'] 		!== undefined) ReplaceHtml3(Name);
};

function ReplaceHtml2(Name){
	var Item2 = Page[Name]['ReplaceMode'];
	for(var i = 0 ; i < Item2.length ; i++){
		var Item3		= 		Item2[i];
		var Mode		= 		Item2[i][0]	;
		var elem 		= $(	Item2[i][1]	);
		var elemText1 	= 		Item2[i][2]	;
		var elemText2 	= 		Item2[i][3]	;
		if(elem.length == 0) 	continue;
		
		if(Mode == "html"){
			//alert($(elem).length);
			$(elem).each(function(){
				var HtmlText= $(this).html();
				if(!HtmlText.match(elemText1)) return true;
				HtmlText = HtmlText.replace(new RegExp(elemText1,"gmi"),elemText2);
				$(this).html(HtmlText);
			});
		} 
		else if(Mode == "text"){
			$(elem).each(function(){
				var HtmlText= $(this).text()
					.replace(new RegExp(elemText1,"gm"),elemText2);
					
				$(this).text(HtmlText);
			});
		} 
		else if(Mode == "attr"){
			$(elem).attr(elemText1,elemText2);
		}
		else if(Mode == "attp"){
			var elemText3 	= Item2[i][4]	;
			$(elem).each(function(){
				var OutputText 	= $(this).attr(elemText1)
					.replace(new RegExp(elemText2,"gm"),elemText3);
				
				//alert(JSON.stringify(Item2[i]) + "\n" + OutputText);
				//$(this)[0].setAttribute(elemText1,OutputText);
				$(this).attr(elemText1,OutputText);
				
				//$(this).removeAttr(elemText1);
				//$(this)[0].removeAttribute(elemText1)
				//$(this)[0].writeAttribute(elemText1,'');
			});
		}
		else if(Mode == "click"){
			//ClickChange(elem,Item2[i]);
			//alert(JSON.stringify(Item3[2]));
			$(elem).attr("Transform",JSON.stringify(Item3[2])).click(function(){ 
				//setTimeout(function(){ ClickChange(this); }, 200);
				ClickChange(this);
			})
		}
		else if(Mode == "modi"){
			//elem = $(elem).parent().parent();
			$(elem).attr("Transform",JSON.stringify(Item3[2]));
			ModiChange(elem);
		}
		else if(Mode == "node"){
			var obj			= Item2[i][2];
			//http://stackoverflow.com/a/26346136
			var Nodes = $(elem).contents().filter(function(){
				return this.nodeType === 3 && $.trim(this.nodeValue) !== '';
				//return this.nodeType === 3 && /\S/.test(this.nodeValue);
			});
			
			for(var j = 0 ; j < Nodes.length ; j++){
				var text 	= $(Nodes[j]).text();
				var ItemS 	= Object.keys(obj);
				for(var i = 0 ; i < ItemS.length ; i++){
					var ItemNodeN = ItemS[i]
					var ItemNodeT = obj[ItemNodeN]
					if(text.match(ItemNodeN)){
						text = text.replace(new RegExp(ItemNodeN,"gm"),ItemNodeT);
						
					}
				}
				$(Nodes[j]).replaceWith( 
					//$("<a></a>").html(text)
					document.createTextNode(text) 
				);
			}
		}
	}
}
//https://davidwalsh.name/dom-events-javascript
function ModiChange(elem){
	$(elem).unbind("DOMSubtreeModified");
	var Transform 	= $(elem).attr("Transform");
	var obj			= JSON.parse(Transform);
	var elem2		= elem
	var Item 		= Object.keys(obj);
	for(var i = 0 ; i < Item.length ; i++){
		if(Item[i].match("modiTarget")){
			elem2 = $(obj[Item[i]]);
			continue;
		}
		$(elem2).each(function(){
			var HtmlText = $(this).html();
			if(this !== undefined && HtmlText !== undefined && HtmlText.match(Item[i])){
				//alert($(this).html());
				HtmlText = HtmlText.replace(new RegExp(Item[i],"gm"),obj[Item[i]]);
				$(this).html( HtmlText );
			}
		})
	}
	/*
	$("#taglist").html(
		$("#taglist").html() + "<br>" + "changed."
	);
	*/
	$(elem).bind("DOMSubtreeModified", function() { ModiChange(this); });
}

function ClickChange(elem){
	//alert($(elem).html());
	var Transform 	= $(elem).attr("Transform");
	var object		= JSON.parse(Transform);
	var HtmlText	= $(elem).html();
	var elemObj 	= object[HtmlText];
	
	if(elemObj != undefined){
		$(elem).html( HtmlText.replace(new RegExp(HtmlText,"gm"),elemObj) );
		//alert(elemObj);	
	}
	//else alert(elemObj);
}

//http://stackoverflow.com/questions/3379220/how-to-limit-a-table-cell-to-one-line-of-text-using-css
//Tags
//width 50px
//table-layout fixed

//==============================================全域函数==============================================
function fanyi(strArray, temp) { //翻译
    for (var i = 0; i < strArray.length; i++) {
        if (strArray[i][0].length > 2) {
            var regex = new RegExp(strArray[i][0], "g"); //全域正则匹配
            temp = temp.replace(regex, strArray[i][1]); //全域替换
        }
    }
    return temp;
}

function DescByLength(a, b) { //按字符长度倒序排列
    if (a[0].length > b[0].length) return -1;     
    return 1;
}

//==============================================翻译制作==============================================
function make_nb() { //主导航
    var array_EN_CH = new Array();
    array_EN_CH.push([">Front Page<"		, ">首页<"]);
    array_EN_CH.push([">Torrents<"			, ">种子<"]);
    array_EN_CH.push([">My Galleries<"		, ">我的画册<"]);
    array_EN_CH.push([">My Home<"			, ">我的首页<"]);
    array_EN_CH.push([">Bounties<"			, ">悬赏<"]);
    array_EN_CH.push([">Settings<"			, ">功能设置<"]);
    array_EN_CH.push([">Favorites<"			, ">我的收藏<"]);
    array_EN_CH.push([">Upload Gallery<"	, ">上传画册<"]);
    array_EN_CH.push([">Maintain Galleries<", ">管理画册<"]);
    array_EN_CH.push([">Toplists<"			, ">排行榜<"]);
    array_EN_CH.push([">News<"				, ">新闻<"]);
    array_EN_CH.push([">Forums<"			, ">论坛<"]);
    array_EN_CH.push([">Wiki<"				, ">百科<"]);
    array_EN_CH.push([">Logout<"			, ">退出<"]);
    array_EN_CH.sort(DescByLength); 	//进行排序
    return array_EN_CH;
}

function make_dmi() { //显示方式
    var array_EN_CH = new Array();
    array_EN_CH.push(["Display:"			, "显示方式:"]);
    array_EN_CH.push([">List<"				, ">列表<"]);
    array_EN_CH.push([">Thumbnails<"		, ">缩略图<"]);
    array_EN_CH.push([">Show List<"			, ">列表<"]);
    array_EN_CH.push([">Show Thumbnails<"	, ">缩略图<"]);
    array_EN_CH.sort(DescByLength); 	//进行排序
    return array_EN_CH;
}

function make_gd3() { //画册内信息
    var array_EN_CH = new Array();
    array_EN_CH.push(["class=\"gdt", "style=\"white-space:nowrap;\" class=\"gdt"]);
    array_EN_CH.push([">TR<"				, ">译制<"]);
    array_EN_CH.push([">RES<"				, ">压缩<"]);
    array_EN_CH.push([">Posted:<"			, ">上传时间:<"]);
    //array_EN_CH.push([">Images:<"			, ">画册信息:<"]);
    //array_EN_CH.push([">Resized:<"		, ">缩放大小:<"]);
    array_EN_CH.push([">Parent:<"			, ">画册来自:<"]);
    array_EN_CH.push([">Visible:<"			, ">是否可见:<"]);
    array_EN_CH.push([">File Size:<"		, ">文件大小:<"]);
    array_EN_CH.push([">Length:<"			, ">画册页数:<"]);
    array_EN_CH.push([">Language:<"			, ">语言类型:<"]);
    array_EN_CH.push([">Rating:<"			, ">评分:<"]);
    //array_EN_CH.push([">Average:"			, ">平均评分:<"]);
    array_EN_CH.push([">Favorited:<"		, ">收藏次数:<"]);
    array_EN_CH.push([">Never<"				, ">无人收藏<"]);
    array_EN_CH.push([">Once<"				, ">1 次<"]);
    array_EN_CH.push(["> Add to Favorites<"	, "> 添加收藏<"]);
    //array_EN_CH.push([">For browsing<"	, ">流览优化<"]);
    //array_EN_CH.push([">Originals only<"	, ">原画尺寸<"]);
    array_EN_CH.push([">Japanese"			, ">日语"]);
    array_EN_CH.push([">English"			, ">英语"]);
    array_EN_CH.push([">Chinese"			, ">汉语"]);
    array_EN_CH.push([">Dutch"				, ">荷兰语"]);
    array_EN_CH.push([">French"				, ">法语"]);
    array_EN_CH.push([">German"				, ">德语"]);
    array_EN_CH.push([">Hungarian"			, ">匈牙利语"]);
    array_EN_CH.push([">Italian"			, ">意大利语"]);
    array_EN_CH.push([">Korean"				, ">韩语"]);
    array_EN_CH.push([">Polish"				, ">波兰语"]);
    array_EN_CH.push([">Portuguese"			, ">葡萄牙语"]);
    array_EN_CH.push([">Russian"			, ">俄罗斯语"]);
    array_EN_CH.push([">Spanish"			, ">西班牙语"]);
    array_EN_CH.push([">Thai"				, ">泰语"]);
    array_EN_CH.push([">Vietnamese"			, ">越南语"]);
    array_EN_CH.push([">N\/A"				, ">未知"]);
    array_EN_CH.push([">Other"				, ">其他"]);
    //array_EN_CH.push(["\\(T\\)<"			, "(译)<"]);
    array_EN_CH.push(["pages<"				, "页<"]);
    array_EN_CH.push(["times<"				, "次<"]);
    array_EN_CH.push([">None<"				, ">无<"]);
    array_EN_CH.push([">Yes<"				, ">是<"]);
    array_EN_CH.push([">No<"				, ">否<"]);
    array_EN_CH.sort(DescByLength); 	//进行排序
    return array_EN_CH;
}

function make_gd5() { //画册内设置
    var array_EN_CH = new Array();
    //array_EN_CH.push(["> Thumbnail Selection<", ">缩略图选项:<"]);
    //array_EN_CH.push([">Size:<"			, ">预览:<"]);
    array_EN_CH.push([">Normal<"			, ">正常<"]);
    array_EN_CH.push([">Large<"				, ">大图<"]);
    array_EN_CH.push(["rows<"				, "行<"]);
    array_EN_CH.push([">Get External Gallery<"	, ">获取分享代码<"]);
    array_EN_CH.push([">Archive Download<"	, ">下载画册<"]);
    array_EN_CH.push([">Torrent Download"	, ">下载种子"]);
    array_EN_CH.push([">H@H Downloader<"	, ">用H@H下载<"]);
    array_EN_CH.push([">Show Gallery Stats<", ">显示画册统计<"]);
    array_EN_CH.push([">Petition to Expunge<", ">申请删除<"]);
    array_EN_CH.push([">Petition to Rename<", ">申请改名<"]);
    array_EN_CH.push([">Report Gallery<"	, ">举报画册<"]);
    array_EN_CH.sort(DescByLength); 	//进行排序
    return array_EN_CH;
}

function make_taglist() { 	//画册内标签分类
    var array_EN_CH = new Array();
    array_EN_CH.push(["text-align:right; font-family:verdana; font-size:8pt; padding-top:2px; vertical-align:top", "white-space:nowrap; text-align:right; font-family:verdana; font-size:8pt; padding-top:2px; vertical-align:top"]);
    array_EN_CH.push([">language:<"		, ">语　言:<"]);
    array_EN_CH.push([">parody:<"		, ">出　处:<"]);
    array_EN_CH.push([">character:<"	, ">角　色:<"]);
    array_EN_CH.push([">group:<"		, ">分　组:<"]);
    array_EN_CH.push([">artist:<"		, ">画　师:<"]);
    array_EN_CH.push([">female:<"		, ">女角色:<"]);
    array_EN_CH.push([">male:<"			, ">男角色:<"]);
    array_EN_CH.push([">misc:<"			, ">杂　项:<"]);
    array_EN_CH.push([">reclass:<"		, ">重归类:<"]);
    array_EN_CH.sort(DescByLength); 	//进行排序
    return array_EN_CH;
}
//==============================================翻译函数==============================================
function getArrayByKey(key) { //填充数组
    var array_EN_CH = new Array();
    switch (key.toLowerCase()) {
        case "nb":	return make_nb();
        case "dmi":	return make_dmi();
        case "gd3":	return make_gd3();
        case "gd5": return make_gd5();
        case "gdo":	return make_gd5();
        case "taglist":	return make_taglist();
        default:	return;
    }
}

function ChangeDoc(key, code) { //翻译操作
    var array_EN_CH = new Array();
    var mask = arguments[2] ? arguments[2] : null;
    switch (code.toLowerCase()) {
        case "tab": 	code = key; 		break;
        case "id": 		code = "#" + key;	break;
        case "class":	code = "." + key;	break;
        default:		code = "*";			break;
    }
    if (mask) if (!document.location.href.match(mask)) return;
    if (!document.querySelector(code)) return;
    array_EN_CH = getArrayByKey(key);
    if (!array_EN_CH) return;
    var itemdiv = document.querySelector(code).innerHTML;
    itemdiv = fanyi(array_EN_CH, itemdiv);
    document.querySelector(code).innerHTML = itemdiv;
}


//==============================================函式调用==============================================
main();
function main() {
    ChangeDoc("nb", "id");
    ChangeDoc("dmi", "id");
    ChangeDoc("gd3", "id", "\/g\/");
    ChangeDoc("gd5", "id", "\/g\/");
    ChangeDoc("gdo", "id", "\/g\/");
    ChangeDoc("taglist", "id", "\/g\/");
}

//======================================================================================================================
//画册标签功能
var showOriginal = 0


var rData={
//行名
	"language"	:"语　言",
	"parody"	:"出　处",
	"character"	:"角　色",
	"group"		:"分　组",
	"artist"	:"画　师",
	"female"	:"女角色",
	"male"		:"男角色",
	"misc"		:"杂　项",
	"reclass"	:"重归类"
}
//TAG翻译数据库
var tData={
	"=Age=":"=年龄=",//==========================================
	"age progression":"快速成长",
	"age regression":"返老还童",
	"dilf":"熟男",
	"infantilism":"幼稚病",
	"lolicon":"萝莉控",
	"low lolicon":"隐晦的萝莉控",
	"low shotacon":"隐晦的正太控",
	"low toddlercon":"隐晦的婴儿控",
	"milf":"熟女",
	"old lady":"老女人",
	"old man":"老男人",
	"shotacon":"正太控",
	"toddlercon":"婴儿控",
	"=Body=":"=身体=",//==========================================
	"amputee":"人棍",
	"body modification":"身体改造",
	"conjoined":"连体",
	"doll joints":"球形关节",
	"gijinka":"拟人化",
	"inflation":"胀腹",
	"invisible":"透明人",
	"muscle":"筋肉人",
	"multiple arms":"多个胳膊",
	"multiple breasts":"多个乳房",
	"multiple paizuri":"多人乳交",
	"multiple penises":"多根阴茎",
	"pregnant":"孕妇Play",
	"stretching":"扩张",
	"tailjob":"用尾巴撸",
	"wings":"翅膀",
	"=Change=":"=变化=",//==========================================
	"absorption":"吞噬吸收",
	"age progression":"快速成长",
	"age regression":"返老还童",
	"ass expansion":"屁股膨大",
	"balls expansion":"睾丸膨大",
	"body swap":"身体交换",
	"breast expansion":"乳房膨大",
	"clit growth":"阴蒂增长",
	"corruption":"堕落",
	"dick growth":"阴茎增长",
	"feminization":"男变女",
	"gender bender":"性别变化",
	"growth":"体型增大",
	"moral degeneration":"道德沦丧",
	"muscle growth":"肌肉增长",
	"nipple expansion":"乳头膨大",
	"petrification":"石化",
	"shrinking":"体型缩小",
	"transformation":"身体变化",
	"weight gain":"体重增长",
	"=Creature=":"=生物=",//==========================================
	"alien":"外星人",
	"alien girl":"外星女",
	"angel":"天使",
	"bee girl":"蜂娘",
	"bunny boy":"兔男",
	"bunny girl":"兔娘",
	"catboy":"猫男",
	"catgirl":"猫娘",
	"cowgirl":"奶牛娘",
	"cowman":"奶牛男",
	"demon":"恶魔",
	"demon girl":"女恶魔",
	"dog boy":"犬男",
	"dog girl":"犬娘",
	"draenei":"德莱尼",
	"fairy":"妖精",
	"fox boy":"狐男",
	"fox girl":"狐娘(狐女)",
	"furry":"人型兽",
	"ghost":"幽灵",
	"goblin":"地精",
	"harpy":"鸟身女妖",
	"horse boy":"马男",
	"horse girl":"马娘",
	"human on furry":"人X人性兽",
	"insect boy":"昆虫男",
	"insect girl":"昆虫娘",
	"kappa":"河童",
	"lizard girl":"蜥蜴娘",
	"lizard guy":"蜥蜴男",
	"mermaid":"人鱼娘",
	"merman":"人鱼男",
	"minotaur":"牛头人",
	"monster":"怪物",
	"monster girl":"怪物娘",
	"mouse boy":"鼠男",
	"mouse girl":"鼠娘",
	"necrophilia":"奸尸",
	"oni":"日本鬼",
	"orc":"兽人",
	"pig girl":"猪娘",
	"pig man":"猪男",
	"plant girl":"植物娘",
	"plant guy":"植物男",
	"centaur":"半人马",
	"raccoon boy":"浣熊男孩",
	"raccoon girl":"浣熊娘",//ehWiki
	"robot":"机器人",
	"robot girl":"机器娘",
	"sheep boy":"男羊人",
	"sheep girl":"绵羊娘",
	"slime":"史莱姆",
	"slime boy":"史莱姆男",//ehWiki
	"slime girl":"史莱姆娘",
	"snake girl":"蛇女",
	"snake guy":"男蛇人",
	"spider girl":"蜘蛛娘",
	"squid girl":"鱿鱼娘",
	"tentacles":"触手",
	"wolf boy":"男狼人",
	"wolf girl":"狼女",
	"yukkuri":"油库里",
	"zombie":"丧尸",
	"=Animal=":"=动物=",//==========================================
	"animal on animal":"动物X动物",
	"animal on furry":"人型兽X动物",
	"bear":"熊",
	"bestiality":"兽交",
	"bull":"公牛",
	"camel":"骆驼",
	"cat":"猫",
	"cow":"牛",
	"crab":"蟹",
	"dinosaur":"恐龙",
	"dog":"犬",
	"dolphin":"海豚",
	"donkey":"毛驴",
	"dragon":"龙",
	"eel":"鳗鱼",
	"elephant":"大象",
	"fish":"鱼",
	"fox":"狐狸",
	"frog":"青蛙",
	"goat":"山羊",
	"gorilla":"猩猩",
	"horse":"马",
	"insect":"昆虫",
	"lion":"狮子",
	"lioness":"母狮",
	"low bestiality":"隐晦的兽交",
	"maggot":"蛆虫",
	"monkey":"猴子",
	"mouse":"老鼠",
	"octopus":"章鱼",
	"ostrich":"鸵鸟",
	"panther":"豹子",
	"pig":"猪",
	"rabbit":"兔子",
	"reptile":"爬行",
	"rhinoceros":"犀牛",
	"sheep":"羊",
	"shark":"鲨鱼",
	"slug":"蛞蝓",
	"snake":"蛇",
	"spider":"蜘蛛",
	"tiger":"老虎",
	"turtle":"乌龟",
	"unicorn":"独角兽",
	"whale":"鲸鱼",
	"wolf":"狼",
	"worm":"虫子",
	"zebra":"斑马",
	"=Height=":"=身高=",//==========================================
	"giant":"巨人",
	"giantess":"女巨人",
	"growth":"体型增大",
	"midget":"侏儒",
	"minigirl":"袖珍女人",
	"miniguy":"袖珍男人",
	"shrinking":"体型缩小",
	"tall girl":"高个女",
	"tall man":"高个男",
	"=Skin=":"=皮肤=",//==========================================
	"albino":"白化",
	"body writing":"身上写字",
	"body painting":"人体彩绘",
	"dark skin":"黑皮肤",
	"freckles":"雀斑",
	"full body tattoo":"全身纹身",
	"gyaru":"太妹",
	"gyaru-oh":"马仔",
	"oil":"抹油",
	"scar":"伤疤",
	"skinsuit":"人皮衣",
	"sweating":"出汗",
	"tanlines":"日晒线",
	"=Weight=":"=体重=",//==========================================
	"anorexic":"骨瘦如柴",
	"bbm":"胖帅男",
	"bbw":"胖美女",
	"weight gain":"体重增加",
	"=Head=":"=头部=",//==========================================
	"brain fuck":"脑交",
	"cockslapping":"阴茎蹭脸",
	"ear fuck":"耳交",
	"elf":"小精灵",
	"facesitting":"颜面骑乘",
	"gasmask":"杀毒面具",
	"hairjob":"发交",
	"masked face":"戴面具",
	"prehensile hair":"抓着头发",
	"=Mind=":"=心灵=",//==========================================
	"body swap":"身体交换",
	"chloroform":"迷药",
	"corruption":"堕落",
	"drugs":"沉浸药物",
	"drunk":"醉酒",
	"emotionless sex":"无感情性交",
	"mind break":"精神崩溃",
	"mind control":"思想控制",
	"parasite":"寄生",
	"possession":"占据附身",
	"possess":"入替",
	"shared senses":"感官共用",
	"sleeping":"睡奸",
	"=Eyes=":"=眼睛=",//==========================================
	"blindfold":"遮眼",
	"cum in eye":"眼射",
	"eye penetration":"眼交",
	"eyemask":"眼部面具",
	"eyepatch":"眼罩",
	"glasses":"眼镜",
	"sunglasses":"太阳镜",
	"unusual pupils":"非正常瞳孔",
	"=Nose=":"=鼻子=",//==========================================
	"nose fuck":"鼻交",
	"nose hook":"鼻钩",
	"smell":"闻味道",
	"=Mouth=":"=嘴部=",//==========================================
	"autofellatio":"自己口交",
	"ball sucking":"吸奶子",
	"big lips":"大嘴唇",
	"blowjob":"口交",
	"blowjob face":"口交脸",
	"braces":"牙套",
	"burping":"打嗝",
	"coprophagia":"食粪",
	"cunnilingus":"舔阴",
	"deepthroat":"深喉",
	"double blowjob":"两女一屌",
	"foot licking":"舔足",
	"gag":"堵嘴",
	"gokkun":"饮精",
	"kissing":"接吻",
	"long tongue":"长舌头",
	"piss drinking":"喝尿",
	"rimjob":"舔菊花",
	"saliva":"唾液",
	"smoking":"吸烟",
	"tooth brushing":"刷牙",
	"unusual teeth":"牙型奇异",
	"vampire":"吸血鬼",
	"vomit":"呕吐",
	"vore":"丸吞",
	"=Neck=":"=脖子=",//==========================================
	"asphyxiation":"窒息",
	"collar":"项圈",
	"=Arms=":"=手臂=",//==========================================
	"armpit licking":"舔腋下",
	"armpit sex":"腋下交",
	"fingering":"指奸",
	"fisting":"拳交",
	"handjob":"套弄鸡鸡",
	"hairy armpits":"腋下多毛",
	"=Chest=":"=胸部=",//==========================================
	"=Breasts=":"=乳房=",//==========================================
	"autopaizuri":"自己乳交",
	"big areolae":"大乳晕",
	"big breasts":"巨乳",
	"breast expansion":"乳房膨大",
	"breast feeding":"母乳喂养",
	"breast reduction":"乳房缩小",
	"huge breasts":"超巨乳",
	"lactation":"乳汁",
	"milking":"喷奶",
	"motorboating":"埋胸",
	"multiple paizuri":"多人乳交",
	"oppai loli":"巨乳萝莉",
	"paizuri":"乳交",
	"small breasts":"贫乳",
	"=Nipples=":"=乳头=",//==========================================
	"big nipples":"大乳头",
	"dark nipples":"黑乳头",
	"dicknipples":"鸡巴乳头",
	"inverted nipples":"乳头内翻",
	"nipple expansion":"乳头膨大",
	"nipple fuck":"肏乳头",
	"=Torso=":"=躯干=",//==========================================
	"inflation":"胀腹",
	"navel fuck":"肏肚脐",
	"pregnant":"孕妇Play",
	"stomach deformation":"胃变形",
	"=Lower Body=":"=下身=",//==========================================
	"=Crotch=":"=裆部=",//==========================================
	"bike shorts":"自行车短裤",
	"bloomers":"运动短裤",
	"chastity belt":"贞操带",
	"diaper":"尿布",
	"fundoshi":"兜裆布",
	"gymshorts":"拳击短裤",
	"hairy":"多阴毛",
	"pubic stubble":"阴毛茬",
	"shimapan":"条纹内裤",
	"urethra insertion":"尿道插入",
	"=Penile=":"=屌=",//==========================================
	"balls expansion":"睾丸膨大",
	"ball sucking":"吸奶子",
	"balljob":"睾丸交",
	"big balls":"大睾丸",
	"big penis":"大阴茎",
	"cbt":"虐睾丸",
	"cuntboy":"有屄的男人",
	"cockslapping":"阴茎蹭脸",
	"dick growth":"阴茎增长",
	"frottage":"双屌互蹭",
	"futanari":"扶她",
	"futanari on male":"扶她X男人",
	"horse cock":"马屌",
	"huge penis":"超大阴茎",
	"multiple penises":"多根阴茎",
	"penis birth":"长出阴茎",
	"phimosis":"包茎",
	"prostate massage":"前列腺按摩",
	"shemale":"人妖",
	"scrotal lingerie":"阴囊内衣",
	"smegma":"包皮垢",
	"=Vaginal=":"=屄=",//==========================================
	"big clit":"大阴蒂",
	"big vagina":"大阴道",
	"birth":"出产",
	"cervix penetration":"子宫脱出",
	"clit growth":"阴蒂增长",
	"cunnilingus":"舔阴",
	"defloration":"破处",
	"double vaginal":"两屌一屄",
	"squirting":"潮吹",
	"strap-on":"假阳具",
	"tribadism":"两屄互蹭",
	"triple vaginal":"三屌一屄",
	"vaginal sticker":"小穴贴",
	"=Buttocks=":"=臀部=",//==========================================
	"anal":"肛交",
	"anal birth":"肛门出产",
	"ass expansion":"屁股膨大",
	"assjob":"肏屁股",
	"big ass":"大屁股",
	"double anal":"两屌一菊",
	"enema":"灌肠",
	"farting":"放屁",
	"pegging":"女攻男受",
	"rimjob":"舔菊花",
	"scat":"排粪Play",
	"spanking":"打屁股",
	"triple anal":"三屌一菊花",
	"=Either Hole=":"=各个穴=",//==========================================
	"eggs":"产蛋",
	"gaping":"豁开",
	"large insertions":"巨物插入",
	"nakadashi":"中出",
	"prolapse":"脱垂",
	"sex toys":"性玩具",
	"speculum":"内窥器",
	"unbirth":"钻进屄里",
	"=Legs=":"=腿部=",//==========================================
	"garter belt":"吊袜腰带",
	"kneepit sex":"膝交",
	"leg lock":"夹腿",
	"pantyhose":"连裤袜",
	"stockings":"丝袜",
	"sumata":"素股",
	"=Feet=":"=脚部=",//==========================================
	"foot insertion":"脚入屄",
	"foot licking":"舔足",
	"footjob":"足交",
	"thigh high boots":"过膝长靴",
	"=Costume=":"=服饰=",//==========================================
	"apron":"围裙",
	"bandages":"绷带",
	"bike shorts":"自行车短裤",
	"bikini":"比基尼",
	"blindfold":"遮眼",
	"bloomers":"运动短裤",
	"bodystocking":"连身袜",
	"bodysuit":"紧身衣",
	"bride":"新娘",
	"bunny boy":"兔男",
	"bunny girl":"兔娘",
	"business suit":"商务装",
	"butler":"男管家",
	"cashier":"收银员",
	"catboy":"猫男",
	"catgirl":"猫娘",
	"cheerleader":"啦啦队",
	"chinese dress":"中式服装",
	"christmas":"圣诞装",
	"collar":"项圈",
	"condom":"避孕套",
	"corset":"紧身胸衣",
	"cosplaying":"Cos装",
	"cowgirl":"奶牛娘",
	"cowman":"男奶牛人",
	"crossdressing":"异性服装",
	"diaper":"尿布",
	"dougi":"武道服",
	"eyemask":"眼部面具",
	"eyepatch":"眼罩",
	"fundoshi":"兜裆布",
	"gag":"堵嘴",
	"garter belt":"吊袜腰带",
	"gasmask":"杀毒面具",
	"glasses":"眼镜",
	"gothic lolita":"哥特洛丽塔",
	"gymshorts":"拳击短裤",
	"haigure":"高叉马步(????)",
	"hijab":"头巾",
	"kigurumi":"玩偶服",
	"kimono":"和服",
	"kunoichi":"女忍者",
	"lab coat":"白大褂",
	"latex":"乳胶衣",
	"leotard":"连体衣",
	"lingerie":"内衣",
	"living clothes":"触手服",
	"magical girl":"魔法少女",
	"maid":"女仆",
	"mecha boy":"机甲男",//ehWiki
	"mecha girl":"机甲娘",
	"metal armor":"金属盔甲",
	"miko":"日本巫女",
	"military":"军装",
	"nazi":"纳粹",
	"ninja":"忍者",
	"nose hook":"鼻钩",
	"nurse":"护士",
	"pantyhose":"连裤袜",
	"pantyjob":"肏内裤",
	"pasties":"乳贴",
	"piercing":"穿孔",
	"policeman":"男员警",
	"policewoman":"女员警",
	"ponygirl":"女骑师",
	"race queen":"赛车女郎",
	"randoseru":"日式小学书包",
	"schoolboy uniform":"男校服",
	"schoolgirl uniform":"女校服",
	"schoolboy":"男学生",
	"schoolgirl":"女学生",
	"scrotal lingerie":"阴囊内衣",
	"shimapan":"条纹内裤",
	"stewardess":"制服",
	"stockings":"丝袜",
	"swimsuit":"泳装",
	"school swimsuit":"学校泳装",
	"sunglasses":"太阳镜",
	"thigh high boots":"过膝长靴",
	"tights":"紧身服",
	"tracksuit":"运动服",
	"vaginal sticker":"小穴贴",
	"witch":"美式女巫",
	"=Multiple Activities=":"=多人活动=",//==========================================
	"double anal":"两屌一菊",
	"double blowjob":"两女一屌",
	"double vaginal":"两屌一屄",
	"ffm threesome":"两女一男",
	"fft threesome":"两女一扶她",
	"group":"群P",
	"harem":"后宫",
	"layer cake":"换着插",
	"mmf threesome":"两男一女",
	"mmt threesome":"两男一扶她",
	"mtf threesome":"一男一女一扶她",
	"multiple paizuri":"多人乳交",
	"triple anal":"三屌一菊花",
	"triple vaginal":"三屌一屄",
	"ttf threesome":"两扶她一女",
	"ttm threesome":"两扶她一男",
	"twins":"双胞胎",
	"=Multiple Holes=":"=多个穴=",//==========================================
	"all the way through":"头尾贯通",
	"double penetration":"双穴贯通",
	"triple penetration":"三穴贯通",
	"=Tools=":"=工具=",
	"blindfold":"遮眼",
	"dakimakura":"抱枕",
	"gag":"堵嘴",
	"glory hole":"墙穴",
	"machine":"机械",
	"onahole":"自慰器",
	"pillory":"颈手枷",
	"pole dancing":"钢管舞",
	"sex toys":"性玩具",
	"speculum":"内窥器",
	"strap-on":"假阳具",
	"syringe":"注射器",
	"table masturbation":"桌子自慰",
	"tube":"插管",
	"whip":"鞭打",
	"wooden horse":"木马",
	"wormhole":"虫洞",
	"=Fluids=":"=流体=",//==========================================
	"oil":"抹油",
	"slime":"史莱姆",
	"slime girl":"史莱姆娘",
	"underwater":"水下性爱",
	"=Bodily Fluids=":"=体液=",//==========================================
	"=Semen=":"=精液=",//==========================================
	"bukkake":"颜射",
	"cum bath":"精液浴",
	"cum swap":"交换精液",
	"gokkun":"饮精",
	"nakadashi":"中出",
	"=Waste=":"=排泄物=",//==========================================
	"blood":"血液",
	"coprophagia":"食粪",
	"menstruation":"经血",
	"piss drinking":"喝尿",
	"public use":"公共使用",
	"saliva":"唾液",
	"scat":"排粪Play",
	"sweating":"出汗",
	"urination":"排尿Play",
	"vomit":"呕吐",
	"=Force=":"=能力=",//==========================================
	"chikan":"痴汉",
	"rape":"强奸",
	"sleeping":"睡奸",
	"time stop":"时间停止",
	"=Sadomasochism=":"=虐恋=",//==========================================
	"bdsm":"施虐受虐",
	"bodysuit":"紧身衣",
	"blindfold":"遮眼",
	"collar":"项圈",
	"femdom":"女王",
	"forniphilia":"人型家居",
	"human cattle":"人型牲畜",
	"human pet":"人型宠物",
	"latex":"乳胶衣",
	"orgasm denial":"禁止高潮",
	"slave":"奴隶",
	"tickling":"瘙痒",
	"=Bondage=":"=束缚=",//==========================================
	"bondage":"捆绑",
	"gag":"堵嘴",
	"shibari":"绳艺",
	"stuck in wall":"卡墙里",
	"vacbed":"乳胶真空床",
	"=Violence=":"=暴力=",//==========================================
	"abortion":"堕胎",
	"blood":"血液",
	"cannibalism":"同类相食",
	"catfight":"两女相争",
	"guro":"猎奇",
	"electric shocks":"电击",
	"ryona":"虐女萌",
	"snuff":"虐杀",
	"torture":"酷刑",
	"trampling":"踩踏",
	"whip":"鞭打",
	"wrestling":"摔跤",
	"=Self Pleasure=":"=自慰=",//==========================================
	"autofellatio":"自己口交",
	"autopaizuri":"自己乳交",
	"masturbation":"手淫",
	"phone sex":"电话性爱",
	"selfcest":"自己X自己",
	"solo action":"自慰",
	"table masturbation":"桌子自慰",
	"=Disability=":"=残疾=",//==========================================
	"amputee":"人棍",
	"blind":"瞎子",
	"handicapped":"残疾",
	"mute":"哑巴",
	"=Gender=":"=性别=",//==========================================
	"cuntboy":"有屄的男人",
	"feminization":"男变女",
	"futanari":"扶她",
	"gender bender":"性别变化",
	"shemale":"人妖",
	"=Inter-gender Relations=":"=跨性别=",//==========================================
	"fft threesome":"两女一扶她",
	"futanari on futanari":"扶她X扶她",
	"futanari on male":"扶她X男人",
	"male on futanari":"男人X扶她",
	"mmt threesome":"两男一扶她",
	"mtf threesome":"一男一女一扶她",
	"ttf threesome":"两扶她一女",
	"ttm threesome":"两扶她一男",
	"=Technical=":"=技术=",//==========================================
	"3d":"3D",
	"anaglyph":"立体",
	"animated":"动画",
	"anthology":"选集",
	"artbook":"画集",
	"figure":"画像",
	"first person perspective":"第一人称",
	"full color":"全彩",
	"game sprite":"图元画",
	"multi-work series":"故事系列",//ehWiki
	"novel":"小说",
	"paperchild":"纸孩",
	"redraw":"重绘",
	"screenshots":"截图",
	"story arc":"故事框架",
	"tankoubon":"单行本",
	"themeless":"无题",
	"x-ray":"透视",
	"=Censorship=":"=色情审查=",//==========================================
	"full censorship":"色块遮挡",
	"mosaic censorship":"马赛克遮挡",
	"uncensored":"未审查",
	"=Cosplay=":"=Cosplay=",//==========================================
	"hardcore":"重口味",
	"non-nude":"非裸体",
	"=Expunging=":"=删除=",//==========================================
	"already uploaded":"已上传过",
	"compilation":"编辑",
	"forbidden content":"禁止的内容",
	"realporn":"真正的色情",
	"replaced":"已更换",
	"watermarked":"有浮水印",
	"=Semi-Expunging=":"=半成品=",//==========================================
	"incomplete":"不完整",
	"out of order":"次序颠倒",
	"missing cover":"无封面",
	"sample":"样本",
	"scanmark":"扫描标记",
	"=Language=":"=语言=",//==========================================
	"albanian":"阿尔巴尼亚语",
	"arabic":"阿拉伯语",
	"caption":"自制标题",
	"catalan":"加泰罗尼亚语",
	"chinese":"汉语",
	"czech":"捷克语",
	"danish":"丹麦语",
	"dutch":"荷兰语",
	"english":"英语",
	"esperanto":"世界语",
	"estonian":"爱沙尼亚语",
	"finnish":"芬兰语",
	"french":"法语",
	"german":"德语",
	"greek":"希腊语",
	"hebrew":"希伯来语",
	"hindi":"印地语",
	"hungarian":"匈牙利语",
	"indonesian":"西澳特罗尼西亚语",
	"italian":"意大利语",
	"japanese":"日语",
	"korean":"韩语",
	"malay":"马来语",
	"polish":"波兰语",
	"poor grammar":"语义不通",
	"portuguese":"葡萄牙语",
	"rewrite":"重新修改",
	"romanian":"罗马尼亚语",
	"russian":"俄罗斯语",
	"slovak":"斯洛伐克语",
	"spanish":"西班牙语",
	"speechless":"无文本",
	"swedish":"瑞典语",
	"tagalog":"他加禄语",
	"text cleaned":"无嵌字版",
	"thai":"泰语",
	"translated":"译制品",
	"turkish":"乌克兰语",
	"ukrainian":"乌克兰语",
	"vietnamese":"越南语",
	"=Contextual=":"=语境=",//==========================================
	"blackmail":"勒索",
	"cheating":"出轨",
	"coach":"教练",
	"defloration":"破处",
	"females only":"只有女性",
	"males only":"只有男性",
	"impregnation":"内射",
	"netorare":"寝取",
	"prostitution":"卖淫",
	"swinging":"摆动",
//======================================================================================================================
	"western":"西方的",
	"misc":"杂 项",
	"imageset":"图片集",
//艺术家
	"oouso":"大嘘",
	"korie riko":"捆枝??",
	"peko":"??",
	"akaza":"???",
	"ishikei":"石惠",
	"happoubi jin":"八宝备仁(????? ??)",
	"kizuki aruchu":"鬼月????",
	"harumi chihiro":"晴见千寻（??????）",
//团队
	"usotsukiya":"嘘??屋",
	"softstar":"大宇信息",
//语言和色彩类
	"chinese":"中文",
	"translated":"翻译本",
	"Italian":"意大利文",
	"english":"英文",
	"portuguese":"葡萄牙文",
	"french":"法文",
	"full color":"全彩色",
	"korean":"韩文",
	"spanish":"西班牙语",
	"russian":"俄罗斯语",
	"thai":"泰文",
	"italian":"意大利文",
//同人题材类
	"touhou":"东方",
	"touhou project":"东方Project",
	"moetan":"萌单",
	"ore no imouto ga konna ni kawaii wake ga nai":	"我的妹妹不可能那么可爱",
	"toaru kagaku no railgun":"某科学的超电磁炮",
	"kantai collection":"舰队collection",
	"pokemon | pocket monsters":"精灵宝可梦",
	"higurashi no naku koro ni | when they cry":"寒蝉鸣泣之时",
	"saki":"天才麻将少女",
	"puella magi madoka magica":"魔法少女小圆",
	"lotte no omocha":"露蒂的玩具",
	"sword art online":"刀剑神域",
	"to love-ru":"To LOVE?",
	"ro-kyu-bu":"萝球社",
	"tantei opera milky holmes":"侦探歌剧 少女福尔摩斯",
	"hyperdimension neptunia | choujigen game neptune":"超次元游戏：海王星",
	"love live":"Love Live!",
	"sora no otoshimono | heavens lost property":"天降之物",
	"boku wa tomodachi ga sukunai":"我的朋友很少",
	"vocaloid":"V家",
	"date a live":"约会大作战",
	"gochuumon wa usagi desu ka | is the order a rabbit":"今天你也要来点兔子吗？",
//角色
	"wriggle nightbug":"莉格露·奈特巴格",
	"mystia lorelei":"斯蒂娅·萝蕾拉",
	"reimu hakurei":"博丽灵梦",
	"marisa kirisame":"雾雨魔理沙",
	"rumia":"露米娅",
	"cirno":"琪露诺",
	"daiyousei":"大妖精",
	"hong meiling":"红美铃",
	"patchouli knowledge":"帕秋莉‧诺蕾姬",
	"koakuma":"小恶魔",
	"sakuya izayoi":"十六夜咲夜",
	"remilia scarlet":"蕾米莉亚‧斯卡雷特",
	"flandre scarlet":"芙兰朵露‧斯卡雷特",
	"letty whiterock":"蕾迪‧霍瓦特罗克",
	"chen":"橙",
	"ink nijihara":"虹原茵可",
	"pastel ink":"闪亮茵可",
//外观类
	"small breasts":"小胸部",
	"big breasts":"大胸部",
	"huge breasts":"超级大胸部",
	"pantyhose":"连裤袜",
	"stockings":"长筒袜",
	"bloomers":"灯笼裤",
	"glasses":"戴眼镜的",
	"exhibitionism":"暴露狂",
	"breast expansion":"乳房膨胀",
	"swimsuit":"泳装",
	"lingerie":"女用贴身内衣裤",
	"mind break":"精神受创",
	"ahegao":"高潮颜",
	"drunk":"喝醉了的",
	"kimono":"和服",
	"yukata":"浴衣",
	"school swimsuit":"死库水",
	"bikini":"比基尼",
	"apron":"围裙",
	"big ass":"大屁股",
	"collar":"项圈",
	"oppai loli":"巨乳萝莉",
	"tiara":"头饰",
	"crown":"皇冠",
	"fisting":"拳交",
	"garter belt":"吊带袜",
	"dark skin":"黑皮肤",
	"dougi":"各种武术类的服装",
	"butler":"带领结的燕尾服",
	"hotpants":"紧身短裤",
	"tracksuit":"运动服",
	"corset":"紧身胸衣",
	"latex":"乳胶橡胶衣物（紧身）",
	"rubber":"乳胶橡胶衣物（紧身）",
	"big balls":"异常大的睾丸",
	"bandages":"绷带",
	"bbm":"胖男人",
	"lab coat":"实验室外套",
	"bike shorts":"自行车短裤",
	"thigh high boots":"长筒靴",
	"metal armor":"金属盔甲",
	"inverted nipples":"乳头凹陷",
	"human pet":"把人当成宠物来对待",
	"bunny girl":"兔女、兔女郎",
	"dog girl":"狗娘",
	"shimapan":"条纹胖次",
	"mecha girl":"机甲少女",
	"gothic lolita":"哥特萝莉",
	"business suit":"西装",
	"muscle":"肌肉",
	"monster girl":"怪物女孩",
	"eyemask":"眼罩",
	"scrotal lingerie":"阴囊穿内衣",
	"sundress":"太阳裙(夏装)",
	"gymshorts":"拳击短裤",
	"sunglasses":"太阳镜",
	"chinese dress":"中国衣着（旗袍）",
	"minigirl":"迷你女孩",
	"invisible":"隐形人",
	"gyaru":"日式太妹（原宿风）",
	"schoolgirl uniform":"学校女生制服",
	"schoolboy uniform":"学校男生制服",
	"albino":"白化病",
	"bodysuit":"全包紧身衣",
	"tall man":"高男人",
	"anorexic":"厌食症",
	"masked face":"面具",
	"oil":"油覆盖皮肤",
	"chastity belt":"贞操带",
	"vaginal sticker":"阴部贴纸",
	"scar":"刀疤",
//年龄、职业或身份类
	"inseki":"姻亲",
	"sister":"姐姐或妹妹",
	"mother":"母亲",
	"father":"父亲",
	"brother":"哥哥或弟弟",
	"niece":"侄女",
	"aunt":"阿姨",
	"uncle":"叔叔",
	"daughter":"女儿",
	"lolicon":"萝莉",
	"shotacon":"正太",
	"mature":"成熟的(通常指年纪较大的人)",
	"schoolgirl":"女学生",
	"schoolboy":"男学生",
	"maid":"女仆",
	"nurse":"护士",
	"teacher":"教师",
	"bride":"新娘",
	"princess":"公主",
	"nun":"修女",
	"vampire":"吸血鬼",
	"catgirl":"猫女",
	"catboy":"猫男",
	"dog":"狗",
	"interracial":"不同人种间的",
	"futanari":"扶她",
	"futanari on futanari":"扶她上扶她",
	"male on futanari":"男的上扶她",
	"futanari on male":"扶她上男的",
	"shemale":"人妖(后天的)",
	"gender bender":"跟异性的举动、打扮一样的人(伪娘或伪男)",
	"crossdressing":"穿异性服装(女装或男装)",
	"age regression":"返老还童",
	"virginity":"处女",
	"school boy":"男学生",
	"demon":"恶魔",
	"angel":"天使",
	"policewoman":"女员警",
	"miko":"巫女",
	"military":"军服",
	"milf":"年龄在30-50岁的女人",
	"harem":"后宫",
	"fairy":"仙女",
	"dilf":"年龄在30-50岁的老男人",
	"magical girl":"马猴烧酒（魔法少女)",
	"elf":"精灵",
	"kunoichi":"女忍者",
	"witch":"女巫",
	"demon girl":"女妖",
	"twins":"双胞胎",
	"chikan":"痴汉",
	"old man":"老男人",
	"cousin":"堂[表]兄弟姊妹",
	"cheerleader":"啦啦队长",
	"tomboy":"女同假阳具(假小子)",
	"valkyrie":"女武神",
	"stewardess":"女乘务员",
	"coach":"训练、教练",
	"voyeurism":"窥阴癖者",
	"yandere":"病娇",
	"unusual pupils":"不寻常的瞳孔",
	"snake girl":"蛇女",
	"tutor":"校外导师(家教)",
	"wolf girl":"狼女",
	"widower":"鳏夫",
	"widow":"寡妇",
	"tomgirl":"娘娘腔",
	
//动作类
	"defloration":"上了处女",
	"bondage":"绑缚",
	"group":"群P",
	"discipline":"调教",
	"x-ray":"透视",
	"paizuri":"乳交",
	"multiple paizuri":"多人乳交",
	"blowjob":"口交",
	"footjob":"足交",
	"anal":"肛交",
	"enema":"灌肠",
	"rape":"强奸",
	"scat":"排泄",
	"pregnant":"怀孕中性行为",
	"birth":"分娩",
	"double penetration":"双洞插入",
	"lactation":"乳汁",
	"sex toys":"性玩具",
	"urination":"排尿",
	"armpit sex":"腋下性爱",
	"blindfold":"蒙住眼睛",
	"shibari":"绳缚",
	"masturbation":"自慰",
	"handjob":"手淫",
	"fingering":"用手指拨弄",
	"prostate massage":"前列腺按摩",
	"cum bath":"精液浴",
	"fisting":"拳交",
	"large insertions":"大的插入",
	"urethra insertion":"尿道插入",
	"necrophilia":"恋尸癖",
	"bukkake":"颜射",
	"gag":"塞口器",
	"piss drinking":"喝尿",
	"nakadashi":"中出",
	"deepthroat":"深喉",
	"swinging":"交换性伴侣(摆动)",
	"blackmail":"性勒索",
	"tanlines":"晒黑的",
	"squirting":"潮吹",
	"chloroform":"氯仿（迷药）",
	"drugs":"药物（媚药）",
	"sleeping":"睡觉",
	"spanking":"被打屁股",
	"cunnilingus":"舔阴部",
	"time stop":"时间停止",
	"dick growth":"阴茎生长",
	"selfcest":"自己X自己",
	"electric shocks":"电击",
	"body painting":"人体彩绘",
	"body writing":"人体写作",
	"ryona":"虐待",
	"piercing":"穿刺",
	"filming":"拍摄",
	"tribadism":"交叉体位（女同）",
	"hairjob":"发丝交",
	"sumata":"股间性交",
	"underwater":"水下",
	"leg lock":"夹腿",
	"rimjob":"舔肛",
	"kissing":"接吻",
	"double blowjob":"双人口交",
	"pegging":"女插男",
	"frottage":"摩擦淫",
	"pantyjob":"内裤交",
	"assjob":"屁股交",
	"triple penetration":"三人互插",
	"facesitting":"坐脸",
	"grandmother":"老奶奶",
	"grandfather":"祖父",
	"granddaughter":"孙女",
	"table masturbation":"桌角自慰",
	"milking":"挤奶",
	"armpit licking":"腋下舔 ",
	"prolapse":"子宫脱垂",
	"orgasm denial":"拒绝高潮",
	"phone sex":"打电话性交",
	"whip":"鞭打",
	"big clit":"大阴蒂",
	"gaping":"张口的",
	"pillory":"枷刑",
	"tickling":"挠痒",
	"nose hook":"钩鼻子",
	"gokkun":"饮精",
	"foot licking":"舔足",
	"cum swap":"左右交换口交",
	"solo action":"独自愉悦",
	"emotionless sex":"无表情性交（冷漠.jpg）",
	"tailjob":"尾巴性交",
	"brain fuck":"入脑性交",
	"dickgirl on dickgirl":"扶她上扶她",
	"male on dickgirl":"男的上扶她",
	"dickgirl on male":"扶她上男的",
	"ball sucking":"嘴吸蛋蛋",
	"sweating":"出汗",
	"smell":"嗅气味",
	"cbt":"鸡\/蛋酷刑",
//类型类
	"incest":"乱伦",
	"netorare":"NTR",
	"guro":"猎奇",
	"yuri":"女同(GL)",
	"yaoi":"男同(BL)",
	"femdom":"女性支配",
	"original":"原创",
	"mind control":"精神控制",
	"body swap":"身体交换",
	"tentacles":"触手",
	"bestiality":"兽奸",
	"cheating":"出轨(和NTR不同)",
	"monster":"怪物",
	"wore":"丸吞",
	"inflation":"胃区膨胀",
	"unbirth":"从B钻出来",
	"skinsuit":"画皮（换皮）",
	"absorb":"融合（皮类常用标签）",
	"psssession":"占据（皮类常用标签）",
	"birth":"出产",
	"eggs":"生蛋",
	"furry":"毛皮",
	"worm":"虫子",
	"amputee":"残肢（四肢切断的人棍）",
	"bbw":"胖女人",
	"wings":"翅膀",
	"christmas":"圣诞服装",
	"waiter":"服务员",
	"waitress":"女服务员",
	"mmf threesome":"二男一女（3P）",
	"ffm threesome":"二女一男（3P）",
	"condom":"避孕套",
	"eyepatch":"眼罩",
	"multiple penises":"多个阴茎",
	"impregnation":"性行为后怀孕",
	"stomach deformation":"胃部突起",
	"tankoubon":"单行本",
	"machine":"性机器",
	"big penis":"大阴茎",
	"strap-on":"可连接的假阳具",
	"anthology":"选集（多个作者）",
	"full censorship":"全面体检",
	"leg locks":"脚锁",
	"art book":"画集",
	"full body tattoo":"纹身",
	"uncensored":"未经审查的（通常是无码的）",
	"vomit":"呕吐物",
	"torture":"酷刑",
	"bdsm":"虐恋调教",
	"tube":"管子",
	"wooden horse":"木马",
	"public use":"公众使用",
	"speculum":"窥器",
	"smegma":"包皮垢",
	"insect":"昆虫",
	"slime":"粘液",
	"huge penis":"巨大的阴茎",
	"zombie":"丧尸",
	"diaper":"尿布",
	"octopus":"章鱼",
	"onahole":"自慰器",
	"girls only":"只有女的",
	"guys only":"只有男的",
	"corruption":"腐朽（堕落？）",
	"blood":"血",
	"snuff":"死去",
	"animated":"GIF动画的",
	"double vaginal":"双阴道的",
	"triple vaginal":"三阴道的",
	"slave":"奴隶",
	"doll":"玩偶",
	"gamecg":"游戏CG",
	"snake":"蛇",
	"incomplete":"不完整的",
	"all the way through":"一直走到底(穿刺)",
	"petrification":"石化",
	"transformation":"转化",
	"giantess":"女巨人",
	"ghost":"鬼魂",
	"asphyxiation":"窒息",
	"gasmask":"杀毒面罩",
	"infantilism":"幼稚型",
	"parasite":"寄生虫",
	"horse":"马",
	"age progression":"年龄进展",
	"plant girl":"植物（怪物娘）",
	"slime girl":"史莱姆（怪物娘）",
	"themeless":"无主题的",
	"cervix penetration":"子宫颈透视",
	"prostitution":"卖淫 / 援交",
	"hairy":"多毛的",
	"robot":"机器人",
	"sole male":"男角唯一",
	"sole female":"女角唯一",
	"oni":"鬼（日本神话）",
	"females only":"只有女性",
	"low lolicon":"未通过萝莉控",
	"alien girl":"外星女孩",
	"double anal":"肛门双交", //两个阴茎插入相同的肛门
	"males only":"只有男性",
	"spider girl":"蜘蛛女孩",
	"netonare":"NTR绿帽子",
	"bunny ears":"兔耳",
	"big nipples":"大乳头",
	"humiliation":"凌辱",
	"sex addict":"性成瘾",
	"bisexual":"雌雄同体或双性恋",
	"gender swap":"性交换",
	"transform":"变身",
	"side ponytail":"双马尾",
	"ponytail":"马尾",
	"cat ears":"猫耳",
	"cavalry":"骑兵",
	"monoeye":"天生单眼",
	
//重新分类
	"doujinshi":"同人本",
	"manga":"漫画杂志"
};



function translateR(word){ //寻找翻译
	var word2 = word;
	word = word.substr(0,word.length-1);	
	var txt = rData[word];					//翻译不存在返回原文本，否则返回翻译后的文本。
	if (txt == undefined) 
			return word;
　	else	return txt;
}
//英语翻译函数
function translate(word){ //寻找翻译
	var txt = tData[word];//翻译不存在返回原文本，否则返回翻译后的文本。
	if (txt == undefined)
			return word;
	else	return txt;
}

var GalleryCategory = {
	 "Doujinshi"		:"同人志 : Doujinshi"
	,"Manga"			:"漫画 : Manga"
	,"Artist CG Sets"	:"画师绘图 : Artist CG Sets"
	,"Game CG Sets"		:"游戏绘图 : Game CG Sets"
	,"Western"			:"西方的 : Western"
	,"Non-H"			:"无色情 : Non-H"
	,"Image Sets"		:"图片集 : Image Sets"
	,"Cosplay"			:"角色扮演 : Cosplay"
	,"Misc"				:"杂项 : Misc"
}

GalleryListTags();
function GalleryListTags(){
	//$("div[class='id43 ir irb']").css("background-color","#8C95FF")
	$("div.tft,div.tfl").each(function(){
		//$(this).attr("title",$(this).attr("title").replace(", ","\n"));
		var title = $(this).attr("title");
		var Temp = [title];
		var Output = "";
		
		if(title.match(",")) Temp = title.split(", ");
		
		for(var i = 0 ; i < Temp.length ; i++){
			//console.error(Temp[i]);
			if(!Temp[i].match(":")) Temp[i] = Temp[i] + ": "
			var row = Temp[i].split(":")[0];
			var tag = Temp[i].split(":")[1];
			row = translateR(row + ":");
			tag = translate (tag);
			Output = Output + row + "：" + tag + "\n"
		}
		$(this).attr("title",Output);
	})
	
	$("div.id41").each(function(){
		var Title = $(this).attr("title");
		var TitleT = GalleryCategory[Title];
		if(TitleT !== undefined) $(this).attr("title",TitleT);
		//else alert("ccc");
	})
}

function TagListChange(){
	$("#taglist td.tc").css("table-layout","fixed").css("width","60px");
	var taglist = document.getElementById("taglist");	//TAG列表
	var tab 	= taglist.getElementsByTagName("table").item(0);//TAG清单里的表格
	if(!tab) return;
	var rowsl 	= tab.rows.length;						//行数
	
	for(var ir 	= 0;ir < rowsl;ir++){
		var rowt 			= tab.rows.item(ir);		//该行
		var cell_rowname 	= rowt.cells.item(0);		//该行名
		var cell_tags 		= rowt.cells.item(1);		//该行TAG
		var tags 			= cell_tags.getElementsByTagName("div");
		var eword 			= cell_rowname.textContent;	//去掉行名的冒号
		var traR 			= translateR(eword);		//翻译
		if (traR && traR !== eword) cell_rowname.innerHTML = traR + ":";
		
		for(var ic = 0;ic < tags.length;ic++){
			var tag 	= tags.item(ic);							//该TAG
			var taga 	= tag.getElementsByTagName("a").item(0);	//该TAG的连接
			if(!taga) continue;
			var eword 	= taga.textContent;							//该TAG的文本
			var tra 	= translate(eword);							//翻译
			if (tra && tra !== eword){
				taga.innerHTML = showOriginal ? tra + "[" + eword + "]" : tra;
				var tagaTitle = $(taga).attr("id").replace(new RegExp("ta_","gmi"),"").replace(new RegExp("_","gmi")," ");
				$(taga).attr("title",tagaTitle);
			}
		}
	}
};
	
function split( val ) 			{ return val.split( /,\s*/ ); }
function extractLast( term ) 	{ return split( term ).pop(); }
Object.values = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}
function swap(json){
		var ret = {};
		for(var key in json){
			ret[json[key]] = key;
		}
		return ret;
	}

if(url.match(".org\/g\/")){ 
	var JQUI = GM_getResourceURL("JQUI");
	$('head').append('<link rel="stylesheet" href="' + JQUI + '" type="text/css" />');
	
	//TagListChange2(); 
	//$("#gn").click(function(){ alert($("#taglist").html().length); });
	
	TagListChange2(); 
	$("#taglist").bind("DOMSubtreeModified", function() { 
		TagListChange2(); 
	});
	
	$("#newtagfield").bind( "keyup", function( event ) {
		$(this).unbind("keyup");
		SubTag();
	})
}

function SubTag(){
	//https://jqueryui.com/autocomplete/#multiple
	//https://jqueryui.com/autocomplete/#maxheight
	$(	 "<style type='text/css'> .ui-autocomplete { max-height: 200px; overflow-y: auto; overflow-x: hidden; }"
		+"* html .ui-autocomplete { height: 100px; }"
		+"</style>").appendTo("head");
	
	var KeyName 		= Object.keys(tData);
	var KeyValueName	= swap(tData);
	var KeyValue		= Object.keys(KeyValueName);
	
	$("#newtagfield").bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB && $( this ).autocomplete( "instance" ).menu.active ) 
			{ event.preventDefault(); }
	})
	.autocomplete({ minLength: 1, delay: 300,
        source: function( request, response ) {
			//response( $.ui.autocomplete.filter( KeyName, extractLast( request.term ) ) );
			var InputKey = extractLast( request.term );
			//alert(JSON.stringify(extractLast( request.term )));
			var filter = $.ui.autocomplete.filter( KeyName, InputKey );
			for(var i = 0 ; i < filter.length ; i++){
				filter[i] = filter[i] + "：" + tData[filter[i]];
			}
			
			if(filter.length == 0){
				filter = $.ui.autocomplete.filter( KeyValue, InputKey );
				for(var i = 0 ; i < filter.length ; i++){
					filter[i] = KeyValueName[filter[i]] + "：" + filter[i];
				}
			}
			
			response( filter );
        },
        focus: function() {
			// prevent value inserted on focus
			return false;
        },
        select: function( event, ui ) {
			  var terms = split( this.value ); // remove the current input
			  ui.item.value = ui.item.value.split("：")[0];
			  terms.pop(); // add the selected item
			  terms.push( "female:" + ui.item.value ); // add placeholder to get the comma-and-space at the end
			  terms.push( "" );
			  this.value = terms.join( ", " );
			  return false;
		}
    });
}


var TagListLen = 0;
var Tagtar = "#taglist"
function TagListChange2(){
	var TagListLenTemp = $("#taglist").html().length;
	if(TagListLen == TagListLenTemp) return;
	TagListLen = TagListLenTemp;
	
	$(Tagtar).unbind("DOMSubtreeModified");
	
	TagListChange();
	/*
	$("#gd5").html(
		$("#gd5").html() + "<br>" + "changed." + TagListLenTemp
	);
	*/
	$(Tagtar).bind("DOMSubtreeModified", function() { 
		TagListChange2(); 
	});
}
