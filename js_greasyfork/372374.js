// ==UserScript==
// @name         E-Hentai E绅士简体中文版
// @namespace    Exhentai_微皮恩
// @namespace    Tast
// @namespace    2016+, Mapaler <1692179400@qq.com>
// @version      0.69
// @description  E绅士简体中文化
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
// @downloadURL https://update.greasyfork.org/scripts/372374/E-Hentai%20E%E7%BB%85%E5%A3%AB%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/372374/E-Hentai%20E%E7%BB%85%E5%A3%AB%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==
//==============================================變數聲明==============================================
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
		,"#lb a:contains('Overview')"		:"概觀狀態"
		,"#lb a:contains('My Stats')"		:"資訊統計"
		,"#lb a:contains('My Settings')"	:"個人設定"
		,"#lb a:contains('Hentai@Home')"	:"紳士之家"
		,"#lb a:contains('Donations')"		:"贊助捐款"
		,"#lb a:contains('Hath Perks')"		:"特殊功能"
		,"#lb a:contains('Hath Exchange')"	:"駭斯市集" //哈希
		//,"#lb a:contains('GP Exchange')"	:"ＧＰ市場" //Gallery Points
		,"#lb a:contains('GP Exchange')"	:"圖幣市場" //Gallery Points
		,"#lb a:contains('Credit Log')"		:"交易記錄"
		,"#lb a:contains('Karma Log')"		:"業力記錄" //https://ehwiki.org/wiki/Karma/Chinese
		,"p.ip a:contains('Front Page')"	:"回到首页"
		
		,"#toppane h1.ih:contains('E-Hentai Galleries: The Free Hentai Doujinshi, Manga and Image Gallery System')":
			"<a href='https://goo.gl/OJksVO'>E绅士图库：免费的绅士同人志、漫画、图片画册系统</a>"
		,"#toppane h1.ih:contains('ExHentai.org - The X Makes It Sound Cool')":
			"<a href='https://goo.gl/OJksVO'>EX绅士图库：后续维护 by：微皮恩</a>"
		,"#searchbox p.nopm a:contains('Show Advanced Options')"	:"显示高级选项"
		,"#searchbox p.nopm a:contains('Show File Search')"			:"显示以图找图"
		,"div.ido p:contains('No hits found')":"<font color='red'><b>沒有任何發現</b></font>"
		
		//以圖找圖
		,"#searchbox p:contains('Showing results for file:')"	:"顯示圖片搜尋："
		,"#searchbox label:contains('Only Search Covers')"		:"只搜尋畫冊封面"
		,"#searchbox label:contains('Show Expunged')"			:"顯示隱藏畫冊"
		,"#searchbox a:contains('Perform a new search')"		:"開啟新搜尋"
		,"#searchbox span:contains('disabled')"					:"關閉"
		
		//列表模式
		,"div.ido table.itg th:contains('Published')"	:"上传时间"
		,"div.ido table.itg th:contains('Name')"		:"标题"
		,"div.ido table.itg th:contains('Uploader')"	:"上传者"
		
		,"ReplaceMode":
		[
			 ["html","div.dp"
				,"E-Hentai Galleries is a free service from "
				,"E紳士圖庫是免費的服務並來自於 "]
			,["html","div.dp a"
				,"E-Hentai - Free Hentai, Doujinshi, Manga, CG Sets, H-Anime"
				,"E紳士 - 免費紳士，同人誌，漫畫，CG圖片，H動畫"]
			,["html","div.dp"
				,"Please read the "
				,"請先閱讀 "]
			,["html","div.dp a"
				,"Terms of Service"
				,"合約條款"]
			,["html","div.dp"
				,"before participating with or uploading any content to this site."
				,"後使用本站功能."]
			,["html","div.ido p.ip a"	,"Visit the E-Hentai Main Site"	,"E紳士主站"]
			,["html","div.ido p.ip a"	,"Visit the E-Hentai Forums"	,"E紳士論壇"]
			,["html","div.ido p.ip a"	,"E-Hentai @ Twitter"			,"E紳士推特"]
			,["html","div.ido p.ip a"	,"Play the HentaiVerse Minigame","E紳士遊戲"]
			,["html","div.ido p.ip a"	,"Lo-Fi Version"				,"E紳士行動版"]
			
			//以圖找圖
			,["html","#searchbox p:contains('a new search to alter this.')"
				,"Similarity Scan was "
				,"相似度搜尋已經為此次搜尋"]
			,["html","#searchbox p:contains('a new search to alter this.')"
				," for this search. You must start a new search to alter this."
				,".  你必須啟動新搜尋啟用相似度搜條件."]
			 
			 
			,["attr","#searchbox input[name='f_search']",	"placeholder"		,"填此搜索"]
			,["attr","#searchbox input[name='f_apply']"	,	"value"				,"搜索"]
			,["attr","#searchbox input[name='f_clear']"	,	"value"				,"清除"]
			
			,["attr","#searchbox p.nopm a:contains('顯示進階搜尋')"	,	"title"	,"顯示/隱藏進階搜尋"]
			,["attr","#searchbox p.nopm a:contains('顯示以圖找圖')"	,	"title"	,"顯示/隱藏以圖找圖"]
			
			,["modi","#searchbox p.nopm a"	,{
				"Show Advanced Options"	:"显示高级选项",
				"Show File Search"		:"显示以图找图"
			}]

            //绅士论坛
            ,["attr","#qr_open input[name='submit']"	,	"value"				,"添加回复"]
            ,["attr","#qr_open input[name='preview']"	,	"value"				,"更多选项"]
            ,["attr","#qr_open input[name='qrc']"	,	"value"				,"关闭快速回复"]

            //功能设定
            ,["attr","#profile_select input[onclick='do_profile_rename()']"	,	"value"				,"重命名"]
            ,["attr","#profile_select input[onclick='do_profile_create()']"	,	"value"				,"新建"]
			,["modi","#profile_select"	,{
				 "Selected Profile:"			:"选择的档案"
                ,'Default Profile':"默认配置"
                ,'':""
			}]

			,["modi","#advdiv"	,{
				 "Search Gallery Name"			:"搜索图册名称"
				,"Search Gallery Tags"			:"搜索图册标签"
				,"Search Gallery Description"	:"搜索图册描述"
				,"Search Torrent Filenames"		:"搜索种子档案名称"
				,"Search Low-Power Tags"		:"搜索低评价的图册标签"
				,"Show Expunged Galleries"		:"显示隐藏图册"
				,"Only Show Galleries With Torrents":"只显示有种子的图册"
				,"Search Downvoted Tags"		:"搜索低评价的标签"
				,"Minimum Rating:"				:"搜索大于星星数："
				,'2 stars':"2 星"
				,'3 stars':"3 星"
				,'4 stars':"4 星"
				,'5 stars':"5 星"
                ,'Disable default filters for':"禁用默认过滤器"
                ,'Language':"语言类型"
                ,'Uploader':"上传者"
                ,'':""
			}]
			
			,["modi","#fsdiv"	,{
				"If you want to combine a file search with a category/keyword search, upload the file first.":
					"如果你想要檔案與類型、關鍵字一起搜尋，請先上傳檔案.",
				"Select a file to upload, then hit File Search.":
					"選擇一個檔案並點擊檔案搜尋按鈕.",
				"All public galleries containing this exact file will be displayed.":
					"任何公開包含此圖片檔的畫冊都會被顯示.",
				"For color images, the system can also perform a similarity lookup to find resampled images.":
					"如果使用彩色圖片，系統會偵測畫冊中最相似的圖片.",
					
				"Use Similarity Scan"	:"使用圖片類似度搜尋",
				"Only Search Covers"	:"只搜索画册封面",
				"Show Expunged"			:"显示被隐藏的画册",
				'name="f_sfile" value="File Search"':'name="f_sfile" value="搜尋檔案"'
			}]
			,["html","#iw"
				,"Note: No file was uploaded, or the uploaded file was invalid. Better luck next time."
				,"注意：無上傳檔案，或檔案不可用. 祝你下一次成功."]
			
			//搜尋資訊
			,["html","#iw p.nopm:contains('The keyword ')"
				,"The keyword "
				,"關鍵字「"]
			,["html","#iw p.nopm:contains(' is too short, and was therefore skipped.')"
				," is too short, and was therefore skipped. Use an exact search or combine it with other words by using quotes."
				,"」，過短因此忽略，請使用更精確的搜尋條件或使用\"夾住號\"結合其他帶有空格的關鍵字."]
			
			//其他
			,["html","div.ido p.ip"							,"Showing"	,"显示"]
			,["html","div.ido p.ip"							,"of"		,"共有"]
			,["html","div.id42"								,"files"	,"页"]
			,["attp","img.tn[src*='.org/g/t.png']"	,"title"
				,"Torrents exist for this gallery"
				,"本畫冊附有種子"]
			,["html","#pt","Popular Right Now"				,"熱門畫冊顯示區"]
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
		//主頁
		 "#newshead strong:contains('Welcome to E-Hentai Classic, the portal to the E-Hentai Universe.')":
			"歡迎來到E紳士首頁：通往E紳士大宇宙的星門所在."
		,"#newshead strong:contains('E-Hentai Galleries')":
			"E紳士圖庫"
		,"#searchform a:contains('News & Updates')":
			"新聞 & 新知"
		,"#searchform a:contains('Wiki FAQ')":
			"維基問答"
		,"#searchform a:contains('E-Hentai Galleries')":
			"E紳士圖庫"
		,"#searchform a:contains('E-Hentai Forums')":
			"E紳士論壇"
		,"#searchform a:contains('The HentaiVerse')":
			"HentaiVerse遊戲"
		,"#searchform a[href='https://ehwiki.org/']:contains('EHWiki')":
			"E紳士維基百科"
		,"#lbs a[href='http://e-hentai.org/?search=']:contains('Search')":
			"搜尋"
		,"#lbl a[href='http://e-hentai.org/?search=']:contains('List')":
			"列表"
		,"#sde em:contains('keyword')":
			"關鍵字"
		,"td.rbk:contains('Henjutsu Level')":
			"紳士等級"
		,"td.rbk:contains('Credit Balance')":
			"紳士幣餘額"
		//搜尋頁
		,"#mtd div.sdrl a:contains('Show gallery results as list')":
			"搜尋結果以列表顯示"
		,"#mtd div.sdm a:contains('Repeat search on E-Hentai Galleries')":
			"在E紳士新版圖庫搜尋"
		//畫冊內容
		,"td.atk:contains('Series:')"		:"系列："
		,"td.atk:contains('Circle:')"		:"畫家："
		,"td.atk:contains('Uploader:')"		:"上傳："
		,"td.atk:contains('Language:')"		:"語言："
		,"td.atk:contains('Posted:')"		:"發表："
		,"td.atk:contains('Images:')"		:"圖數："
		,"div[id='gcb']:contains('(This space was intentionally left blank.)')"	:"( 無敘述 )"
		,"table.at a[onclick*='archiver.php']:contains('Download Archive')"		:"下載圖包"
		,"td.atv:contains('Japanese')"		:"日文"
		,"td.atv:contains('English')"		:"英文"
		,"td.atv:contains('Chinese')"		:"中文"
		,"td.atv:contains('Dutch')"			:"菏蘭語"
		,"td.atv:contains('French')"		:"法文"
		,"td.atv:contains('German')"		:"德文"
		,"td.atv:contains('Hungarian')"		:"匈牙利文"
		,"td.atv:contains('Italian')"		:"意大利文"
		,"td.atv:contains('Korean')"		:"韓文"
		,"td.atv:contains('Polish')"		:"波蘭語"
		,"td.atv:contains('Portuguese')"	:"葡萄牙文"
		,"td.atv:contains('Russian')"		:"俄語"
		,"td.atv:contains('Spanish')"		:"西班牙語"
		,"td.atv:contains('Thai')"			:"泰語"
		,"td.atv:contains('Vietnamese')"	:"越南文"
		,"td.atv:contains('N/A')"			:"N/A無法辨識"
		,"td.atv:contains('Other')"			:"其他"
		
		,"ReplaceMode":
		[
			 ["html","#newshead div a"
				,"For more updated galleries, you can check out "
				,"瀏覽畫冊請至："]
			,["html","#newshead div a"
				,"- the next generation free hentai gallery system."
				,"- 次世代版的免費紳士畫冊系統."]
			//搜尋頁
			,["attr","#mtd input[value='Hentai Search']"		,"value","紳士搜尋"]
			,["attr","#mtd input[value='I\\'m Feeling Horny']"	,"value","我硬了!!"]
			,["attr","#mtd input[value='Search']"				,"value","搜尋"]
			,["attr","#mtd input[value='Clear']"				,"value","清除"]
			
			,["html","#sde p"
				,"If no search class is specified, "
				,"如果沒有指定搜尋的標籤類型，"]
			,["html","#sde p"
				,"the following are searched: title, tag, series and circle."
				,"可用：title, tag, series and circle."]
			,["html","#sde p"
				,"You can restrict or expand search classes using the prefixes listed below."
				,"<br>限制或擴大搜尋類型，使用下面前綴列表."]
			,["html","#sde p"
				,'You can search for a phrase by putting it "in quotes", '
				,"<br>使用「\"夾住號\"」搜尋短詞關鍵字，"]
			,["html","#sde p"
				,"and exclude keywords and phrases by prefixing it with a dash/minus \\(-\\)."
				,"並且使用減號「-」排除該關鍵字的搜尋目標."]
			,["html","#sde p:contains(' does a normal title search.')"
				,"does a normal title search."
				," - 搜尋畫冊標題."]
			,["html","#sde p:contains(' searches the tags assigned to the galleries.')"
				,"searches the tags assigned to the galleries."
				," - 搜尋畫冊標籤."]
			,["html","#sde p:contains(' searches series names and aliases.')"
				,"searches series names and aliases."
				," - 搜尋系列名稱和別名."]
			,["html","#sde p:contains(' searches circle names and aliases.')"
				,"searches circle names and aliases."
				," - 搜尋選定畫家名稱和別名."]
			,["html","#sde p:contains(' searches the work\\'s language.')"
				,"searches the work's language."
				," - 搜尋畫作語言."]
			,["html","#mtd div.sdrh:contains('matching galleries:')"
				,"Found "
				,"發現 "]
			,["html","#mtd div.sdrh:contains('matching galleries:')"
				,"matching galleries: "
				,"個畫冊："]
			,["html","#mtd div.sdm:contains('Could not find what you were looking for?')"
				,"Could not find what you were looking for?"
				,"找不到你想要的?"]
			//畫冊列表模式
			,["html","#lrc:contains(' of ')"
				,"Showing"
				,"顯示"]
			,["html","#lrc:contains(' of ')"
				,"of"
				,"共"]
			
		]
	},
	
	"hentaiathome.php":
	{
		//主頁
		 "div.stuffbox h1:contains('Hentai@Home Clients')"			:"Hentai@Home 紳士之家客戶端"
		,"#div_stats th:contains('H@H Region')"						:"區域"
		,"#div_stats th:contains('Available Network Capacity')"		:"總有效網路流量"
		,"#div_stats th:contains('Used Network Capacity')"			:"總使用網路流量"
		,"#div_stats th:contains('Util%')"							:"比例%"
		,"#div_stats th:contains('Cover')"							:"覆蓋率"
		,"#div_stats td:contains('North and South America')"		:"北美和南美"
		,"#div_stats td:contains('Europe and Africa')"				:"歐洲和非洲"
		,"#div_stats td:contains('Asia and Oceania')"				:"亞洲和大洋洲"
		,"#div_stats td:contains('Total')"							:"總計"
		,"#div_clients p:contains('Your Active Clients')"			:"你使用的客戶端"
		,"#div_clients p a:contains('PM Tenboro')"					:"Tenboro 碳波羅"
		,"#div_clients table.hct th:contains('Client')"				:"客戶端"
		,"#div_clients table.hct th:contains('ID')"					:"編號"
		,"#div_clients table.hct th:contains('Status')"				:"狀態"
		,"#div_clients table.hct th:contains('Created')"			:"建立日期"
		,"#div_clients table.hct th:contains('Last Seen')"			:"最後上線"
		,"#div_clients table.hct th:contains('Files Served')"		:"已送出檔案數量"
		,"#div_clients table.hct th:contains('Client IP')"			:"客戶端IP"
		,"#div_clients table.hct th:contains('Port')"				:"連接埠"
		,"#div_clients table.hct th:contains('Version')"			:"版本號"
		,"#div_clients table.hct th:contains('Max Speed')"			:"最大速度"
		,"#div_clients table.hct th:contains('Trust')"				:"信任度"
		,"#div_clients table.hct th:contains('Quality')"			:"品質"
		,"#div_clients table.hct th:contains('Hitrate')"			:"連線比率"
		,"#div_clients table.hct th:contains('Hathrate')"			:"駭斯比率"
		,"#div_clients table.hct th:contains('Country')"			:"國家"
		,"div.stuffbox p:contains('Client Download')"				:"客戶端下載"
		,"#div_download table th:contains('File')"					:"檔案"
		,"#div_download table th:contains('Size')"					:"大小"
		
		//設定頁
		,"div.stuffbox td:contains('Client ID#:')"					:"客戶端編號#:"
		,"div.stuffbox td:contains('Client Key:')"					:"客戶端金鑰:"
		,"div.infotitle:contains('Port for Incoming Connections')"	:"連入的通訊埠"
		,"div.infotitle:contains('Client Name')"					:"客戶端名稱 ( 隨意填 )"
		,"div.infotitle:contains('Maximum Burst Speed')"			:"最大連線速度"
		,"div.infotitle:contains('Hourly Bandwidth Limit')"			:"每小時流量限制"
		,"div.infotitle:contains('Maximum Disk Cache Size')"		:"最大快取容量 ( 硬碟使用量 )"
		,"td.infota:contains('Advanced Settings')"					:"進階設定"
		,"div.infotitle:contains('Reset Client Key')"				:"重設客戶端金鑰"
		,"div.infotitle:contains('Local Network Host IP Address')"	:"本地端網路IP位址"
		,"div.infotitle:contains('Minimum space to leave on disk')"	:"最小保留容量 ( 硬碟保留空間大小 )"
		,"div.infotitle:contains('Client Proxy Mode')"				:"客戶端代理模式"
		,"div.infotitle:contains('Scheduler')"						:"排程"
		,"div.infotitle:contains('Static Ranges')"					:"靜態檔案範圍 ( 可用檔案列表 )"
		,"div.infotitle:contains('Miscellaneous Toggles')"			:"雜項開關"
		
		,"td.infotv:contains('The settings below are optional advanced settings.')":"以下進階設定請先瞭解後更改"
		
		,"label[for='f_disable_bwm']"			:"取消客戶端連線速度限制"
		,"label[for='f_verify_cache']"			:"下次啟動檢查快取完整性"
		,"label[for='f_reducestatic_ok']"		:"如果需要就移除靜態檔案範圍"
		,"label[for='resetkey']"				:"重設金鑰"
		,"table.infot span:contains('Not Set')"	:"尚未設定"
		,"label[for='resetstaticranges']"		:"重設靜態範圍"
		,"label[for='f_disable_logging']"		:"關閉硬碟記錄：稍微降低硬碟使用率，錯誤依然會記錄."
		,"label[for='f_use_less_memory']"		:"低記憶體模式：提高記憶體和硬碟使用率."
		
		,"a[href*='hentaiathome.php']:contains('[Back to Overview]')":"回到上一頁"
		
		//排程設定
		,"td:contains('Active')"		:"啟用"
		,"td:contains('Mon')"			:"週一"
		,"td:contains('Tue')"			:"週二"
		,"td:contains('Wed')"			:"週三"
		,"td:contains('Thu')"			:"週四"
		,"td:contains('Fri')"			:"週五"
		,"td:contains('Sat')"			:"週六"
		,"td:contains('Sun')"			:"週日"
		,"td:contains('Start Hour')"	:"開始時間"
		,"td:contains('End Hour')"		:"停止時間"
		,"td:contains('Burst Speed')"	:"最大速度"
		,"td:contains('Hourly Limit')"	:"流量限制"
		,"td:contains('Hourly Limit')"	:"流量限制"
		,"a[href*='act=settings']:contains('[Back to Settings]')":"回設定頁"
		
		,"ReplaceMode":
		[
			//主頁
			 ["html","#div_stats td" 
				,"Stats are near-realtime and update every minute."	
				,"統計表每分鐘更新一次."]
			,["html","#div_stats td" 
				,"Util% is based on the region of the visitor rather than the client, "
				,"比例%的區域基於網路訪問者而非客戶端，"]
			,["html","#div_stats td" 
				,"and can therefore be over 100%."
				,"因此可能是100%以上."]
			,["html","#div_stats td" 
				,"Cover denotes the average number of times a static file range can be found within a given region, "
				,"覆蓋率代表該地區中靜態檔案範圍的次數平均數，"]
			,["html","#div_stats td" 
				,"indicating the total available storage capacity."
				,"並指出總有效網路流量."]
				
			,["html","#div_clients p"
				,"To add more clients, "
				,"如要加入更多客戶端的話，請聯絡管理員 "]
			,["html","#div_clients p"
				,"Make sure to read the requirements first to make sure that you qualify."
				,"<br>請先詳細閱讀客戶端營運需求確定擁有資格."]
			,["html","#div_clients p"
				,"Include the specs for the client in the message, "
				,"<br>客戶端訊息中包含規格資訊，"]
			,["html","#div_clients p"
				,"and specify whether it is a home connection or a VPS/Dedicated."
				,"並且指定使用的是家用網路或虛擬主機 / 專業主機."]
			,["html","#div_clients p"
				,"Each client requires its own unique public IPv4 address to run, "
				,"<br>每一個客戶端必須擁有單獨公開的IPv4地址才可運作，"]
			,["html","#div_clients p"
				,"and must either be reachable directly from the Internet, "
				,"而且可以直接連接到網際網路，"]
			,["html","#div_clients p"
				,"or have a port forwarded." 
				,"或有設定好<a href='https://zh.wikipedia.org/zh-tw/%E7%AB%AF%E5%8F%A3%E6%98%A0%E5%B0%84' target='_bank'>端口映射</a>."]
			,["html","#div_clients p"
				,"These are technical requirements, and it is not possible to make any exceptions."
				,"這些是技術上的需求，沒有任何意外."
				+"<br><br>額外說明："
				+"<br>給管理員 Tenboro 碳波羅 傳送客戶端申請之後假如太久沒回應，請勿大肆廣發詢問或重複傳送訊息."
				+"<br>管理員平時太忙被煩到不爽小心帳號GG.<br>"
				]
			,["html","#div_clients p"
				,"If the auto-detected country is wrong, "
				,"如果系統自動偵測的國家錯誤，"]
			,["html","#div_clients p"
				,"contact Tenboro to have an override applied."
				,"請聯絡 Tenboro 碳波羅等待修正."]
			,["html","#div_clients p"
				,"Include the correct country, client ID and IP address in your message, "
				,"<br>聯絡訊息中請具備正確的國家名稱、客戶端編號、網路IP地址，"]
			,["html","#div_clients p"
				,"and make sure to keep your client running."
				,"並且保持客戶端運作良好且有效連線."]
			,["html","#div_clients p"
				,"Having the client set to the wrong country will make it perform worse than it would otherwise do."
				,"<br>請注意，錯誤的國家區域會讓客戶端的效能運作比原本更糟."]
				
			,["html","#div_download p"
				,"The current version of Hentai@Home is "
				,"現在的紳士之家版本為 "]
			,["html","#div_download p"
				,"Hentai@Home is released as an Open Source project under the GNU General Public Licence v3."
				,"紳士之家的釋出是基於開放原始碼計畫中，第三版本的GNU通用公共授權條款."]
			,["html","#div_download p"
				,"The source code along with necessary libraries and scripts to build it on Windows and Linux/BSD/Unix-type systems can be downloaded below."
				,"<br>原始碼以及相應的程式庫和腳本，建立在Windows、Linux/BSD/Unix這類系統的組建可在下方下載."]
			,["html","#div_download p"
				,"You will also need the stand-alone SQLiteJDBC Library to build your own version."
				,"<br>你也需要獨立的 SQLiteJDBC 程式庫用來建造屬於你自己的版本類型."]
			,["html","#div_download p"
				,"Note that for security reasons, this page and the files themselves are hosted on different servers."
				,"安全起見，本頁以及檔案本身放置在不同的伺服器上面."]
			,["html","#div_download p"
				,"For your safety, please verify that the size and SHA-256 hash correspond to the file you download."
				,"<br>為了你的安全，請檢驗對應下載檔案的大小以及 SHA-256 的 Hash 哈吸值."]
			,["html","#div_download p"
				,"For more information about file validation, "
				,"<br>要取得更多驗證的相關資訊，"]
			,["html","#div_download p"
				,"and links to available versions for Microsoft Windows, see this link:"
				,"適用於微軟Windows的版本，請按此連結："]
				
			//設定頁
			,["html","div.infotext p"
				,"Can be most numbers between 1024 and 65534."
				,"通訊埠編號可在 1024 到 65534 之間."]
			,["html","div.infotext p"
				,"This port must be opened in your firewall, "
				,"此通訊埠必須可通過網路防火牆對外連線."]
			,["html","div.infotext p"
				,"and forwarded from any NAT-based cable/ADSL modems/routers you connect to the Internet through."
				,"<br>假如需要最好設定好端口映射，<br>給硬體：NAT、有線電視、ADSL、撥號數據機、路由等通過網路連線."]
				
			,["html","div.infotext p"
				,"You can set a custom name for this client here."
				,"你可以在這裡自訂客戶端的名稱."]
			,["html","div.infotext p"
				,"This will be used in the various listings this client appears in."
				,"<br> ( 這會變成你對外各種列表顯示的暱稱 )"]
				
			,["html","div.infotext p"
				,"This is the maximum speed the client is allowed to use, "
				,"這是客戶端所能使用的最大速度，"]
			,["html","div.infotext p"
				,"measured in kilobytes per second."
				,"單位是KB/每秒."]
			,["html","div.infotext p"
				,"Actual utilization will reach at most 80% of this over time, "
				,"隨時間推移實際上能達到的大概只有80%"]
			,["html","div.infotext p"
				,"unless you also set an hourly limit below."
				,"<br>除非有特別設定每小時限制流量."]
			,["html","div.infotext p"
				,"Turning off the client-side throttle saves some CPU and may make you test higher, "
				,"降低客戶端連線速率可減少CPU使用量<br>或也可設定高一點"]
			,["html","div.infotext p"
				,"but could make the traffic more bursty."
				,"獲得更高的網路速率."]
				
			,["html","div.infotext p"
				,"The number of megabytes this client is allowed to send every hour."
				,"每小時可准許多少MB的上傳流量."]
			,["html","div.infotext p"
				,"Leave at 0 to limit with max speed alone."
				,"設定為 0 代表不限制."]
				
			,["html","div.infotext p"
				,"How much disk space you wish to reserve for this client." 
				,"設定客戶端所能使用的最大可用空間."]
			,["html","div.infotext p"
				,"The reserved space must always be available."
				,"可用空間必須不受影響."]
			,["html","div.infotext p"
				,"This must be at least 5 GB. We recommend at least 1 GB disk per 25 KByte/s bandwidth, "
				,"必須至少大於 5GB. <br>建議以頻寬速度的每 25Kbps * 1GB 相乘"]
			,["html","div.infotext p"
				,"or 5 GB for every MBit/s, but more is always better."
				,"<br>或使用每 1Mbps * 5GB 相乘會比較好."]
			,["html","div.infotext p"
				,"Static Range allocation is limited to 1 per 175 MB of disk space."
				,"每一單位的靜態分配範圍，僅限於每 175 MB 的硬碟空間."
				+"<br><br>額外說明：( 請適度決定最大可用大小 )"
				+"<br>駭斯幣Hath的獲得'基本上'是由上傳檔案的單位時間獲取比率所決定"
				+"<br>所以越大的空間也代表更多的檔案獲取量，取得更多駭斯Hath"
				+"<br>但也會造成CPU、硬碟運轉率上升，跟P2P損傷硬碟的原理一樣."
				]
			,["html","div.infotext p"
				,"If you believe your client key has been compromised, "
				,"如果想用更換客戶端金鑰，"]
			,["html","div.infotext p"
				,"you can reset the key by checking this box."
				,"可以勾選此選項."]
			,["html","div.infotext p"
				,"You will have to re-enter the key the next the the client starts."
				,"<br>你必須在下次客戶端啟動時輸入客戶端金鑰以便啟用."]
				
			,["html","div.infotext p"
				,"If you are on a NAT network and your router has problems routing a request back to itself, "
				,"如果你在NAT網路裡，<br>而且你的路由無法正確回應連線給你的電腦"]
			,["html","div.infotext p"
				,"you can set its LAN IP address here." 
				,"<br>可以在這設定區域網路的IP."]
			,["html","div.infotext p"
				,"This will make the system route requests originating from your IP address directly to the server on your local network."
				,"<br>這會讓客戶端使用此IP發起連線至路由伺服器的要求."]
			,["html","div.infotext p"
				,"Note that some browsers and extensions may restrict this type of local network access, "
				,"注意，有些瀏覽器的外掛套件可能會禁止此類型的網路連線"]
			,["html","div.infotext p"
				,"requiring explicit whitelisting of the site."
				,"<br>必須設定好白名單以利網路連線."]
				
			,["html","div.infotext p"
				,"If this value is set, "
				,"如果有設定此項，"]
			,["html","div.infotext p"
				,"the client will temporarily stop getting new files if the free space on the disk decreases below this value."
				,"且可用空間小餘此設定值<br>客戶端將會暫停下載新快取檔案."]
			,["html","div.infotext p"
				,"Note that even if this is not set, the client will leave at least 100MB for working space."
				,"如果沒有設定，客戶端只會保留 100MB 的可用空間."]
				
			,["html","div.infotext p"
				,"In most cases, this should be set to Local Network Only."
				,"通常，這預設只給本地端網路使用."]
			,["html","div.infotext p"
				,"This will allow you to use the H@H client as a proxy for viewing images."
				,"<br>可以把紳士家客戶端當作瀏覽圖片的代理伺服器 ( 僅限E紳士 )."]
			,["html","div.infotext p strong"
				,"Do not set this to All Networks Allowed unless you know what you are doing."
				,"請勿開放網際網路連線，除非你瞭解其中狀況."]
			,["html","div.infotext p"
				,"You can optionally require a passkey, found below."
				,"你也可以選用代理金鑰，請看右邊下方."]
			,["html","div.infotext p"
				,"This passkey will change if you reset your client key."
				,"<br>另外代理金鑰也會在更改客戶端金鑰時更動."
				+"<br><br>額外說明：<br>代理金鑰就是對外連線所使用的金鑰，可在個人設定中使用."]
				
			,["html","div.infotext p"
				,"The Scheduler allows you to specify periods of time where the client is operating with lower speed limits."
				,"排程可設定特定時間客戶端所能提供的網路速度."]
				
			,["html","div.infotext p"
				,"Over time, your client is assigned a number of static ranges that indicate specific, "
				,"隨時間經過，你的客戶端會被分配一定數量的靜態檔案範圍"]
			,["html","div.infotext p"
				,"permanently assigned ranges of files it is able to serve."
				,"<br>也就是永久可供快取的圖片檔案."]
			,["html","div.infotext p"
				,"This toggle will reset this set of ranges."
				,"<br>選項勾選後將會重設靜態範圍."]
			
			,["html","div.infotext p"
				,"Various toggles to optimize client behavior."
				,"其他可優化客戶端的切換選項."]
			//==================
			,["html","td.infotv p","Current Value:"	,"現有值："]
			,["html","td.infotv p","New Value:"		,"賦予新值："]
			,["html","td.infotv p"
				,"Note: The port cannot be changed while the client is running."		
				,"注意：通訊埠無法在客戶端運作時更改."]
			,["html","td.infotv p"
				,"Warning: 1 KB/s or KBps \\(Kilo Bytes per Second\\) is equivalent to 8 Kb/s or Kbps \\(Kilo Bits per Second\\)."
				,"警告：1KB = 8Kbps. 請參考：<a href='http://www.mobile01.com/topicdetail.php?f=507&t=3464621#45094546'>說明1</a>、"
				+"<a href='http://www.spring.url.tw/internet/internet_06.html'>說明2</a>"
				]
			,["html","td.infotv p"
				,"Internet speeds are typically advertised as the latter, "
				,"<br>網路速度通常都是以 Kbps 為單位，"]
			,["html","td.infotv p"
				,"so make sure you use the right one."
				,"請確認計算正確."]
			,["html","td.infotv p"
				,"You should not set this higher than the upstream bandwidth of your Internet connection."
				,"不應該設定超過上傳速率的數值."]
			,["html","td.infotv p span"	,"No Limit"			,"無限制"]
			,["html","td.infotv p"		,"MBytes/hour"		,"MB/每小時"]
			,["html","td.infotv"		,"Current Value:"	,"現有值："]
			,["html","td.infotv"		,"New Value:"		,"改變成："]
			,["html","td.infotv"		,"Disabled"			,"關閉"]
			,["html","td.infotv"		
				,"Local Networks Only \\[Restricted - Passkey Required\\]"			
				,"僅限本地端網路 [ 限制模式 - 需要代理金鑰 ]"]
			,["html","td.infotv"		
				,"Local Networks Only \\[Open - No Authentication Required\\]"
				,"僅限本地端網路 [ 開放模式 - 不需代理金鑰 ]"]
			,["html","td.infotv"	
				,"All Networks Allowed \\[Restricted - Passkey Required\\]"
				,"全部網路都准許 [ 限制模式 - 需要代理金鑰 ]"]
			,["html","td.infotv"	
				,"All Networks Allowed \\[Open - No Authentication Required\\]"
				,"全部網路都准許 [ 開放模式 - 不需代理金鑰 ]"]
			,["html","td.infotv strong"	,"Not Recommended"		," 不建議使用 "]
			,["html","td.infotv span"	,"Very Not Recommended"	," 非常不建議 "]
			,["html","td.infotv p"		,"Proxy Passkey:"		," 代理金鑰： "]
			,["html","td.infotv p a"
				,"Click here to modify the schedule of this client"
				,"點擊設定此客戶端的排程表"]
			,["html","td.infotv p"
				,"This client currently has"
				,"此客戶端目前有"]
			,["html","td.infotv p"
				,"static range\\(s\\) assigned."
				,"個已分配靜態檔案範圍."]
			,["html","td.infotv span"		,"Warning: You should"		,"你最好"]
			,["html","td.infotv strong"		,"never"					,"不要"]
			,["html","td.infotv span"		,"reset your static ranges"	,"重設靜態範圍"]
			,["html","td.infotv strong"		,"unless"					,"除非"]
			,["html","td.infotv span"		
				,"the cache has been deleted or is otherwise lost. It should"	
				,"快取檔案被刪除或遺失.<br>應該"]
			,["html","td.infotv strong"		,"always"					,"隨時"]
			,["html","td.infotv span"
				,"be reset if the cache has been cleared for whatever reason, "
				,"重設，不論任何原因，假如快取被清除的話，"]
			,["html","td.infotv span"
				,"or the client will encounter serious trust issues."
				,"將會造成嚴重的客戶端信任危機. ( 減少連線機會 )"]
				
			,["html","div"
				,"Note that any changes you make here will be applied the next time your client pings the server, "
				,"注意，任何更動將會在下次客戶端與伺服器連線時採用，"]
			,["html","div"
				,"which usually happens every five minutes. Some changes will not be applied until next restart."
				,"通常會每五分鐘執行一次，有些設定會在下一次客戶端啟動時採用."]
			,["html","div"
				,"If you are changing the Port Number or reseting your key, "
				,"<br>如果你更改通訊埠或重設客戶端金鑰，"]
			,["html","div"
				,"you should exit Hentai@Home before hitting the button below."
				,"你應該先關閉紳士家客戶端後，再點擊下面的送出鈕."]
			,["attr","input[value='Apply Settings']","value","送出設定"]
			//排程設定
			,["html","h1:contains('Modify Schedule for Client')"
				,"Modify Schedule for Client"
				,"編輯客戶端排程："]
			,["html","p:contains('The Scheduler allows you')"
				,"The Scheduler allows you to specify periods of time where the client is operating with different Maximum Burst Speed and Hourly Bandwidth Limit settings."
				,"排程可用於設定特定時間，客戶端使用的最大網路速度及每小時流量限制."]
			,["html","p:contains('To add a new scheduling entry')"
				,"To add a new scheduling entry, "
				,"要新增排程，"]
			,["html","p:contains('simply use the row at the bottom.')"
				,"simply use the row at the bottom."
				,"請更改下面的項目."]
			,["html","p:contains('Enter the required values')"
				,"Enter the required values and make sure that Active is checked, "
				,"輸入需要的數值並確認啟動框有勾選，"]
			,["html","p:contains('then hit Apply Schedule.')"
				,"then hit Apply Schedule."
				,"然後點擊送出設定按鈕."]
			,["html","p:contains('Repeat to add more than one entry.')"
				,"Repeat to add more than one entry."
				,"依此類推增加更多排程時間表."]
			,["html","p:contains('You can have up to 9 entries per client, ')"
				,"You can have up to 9 entries per client, "
				,"<br>你可以設定每個客戶端最多9個排程."]
			,["html","p:contains('excluding the default entry.')"
				,"excluding the default entry."
				,"不包括預設排程."]
			,["html","p:contains('In case of overlap, ')"
				,"In case of overlap, "
				,"當排程時間有重疊，"]
			,["html","p:contains('the schedule with the highest')"
				,"the schedule with the highest granularity will always be applied."
				,"最長時間的排程將會被取用."]
			,["html","p:contains('Schedule settings should always be')"
				,"Schedule settings should always be lower than the default schedule entry."
				,"排程設定值最好低於預設排程的時間."]
			,["html","p:contains('The active Maximum Burst Speed')"
				,"The active Maximum Burst Speed and Hourly Bandwidth Limit will never be set higher than the default entry."
				,"已啟用的最大網路速度與每小時流量限制不能設定低於預設排程."]
			,["html","p:contains('To change the default entry, ')"
				,"To change the default entry, "
				,"<br>如果要修改預設排程，"]
			,["html","p:contains('alter the Maximum Burst Speed and')"
				,"alter the Maximum Burst Speed and Hourly Bandwidth Limit values on the Settings page."
				,"請至主設定頁面修改最大網路速度跟每小時流量限制設定值."]
			,["html","p:contains('All schedule times are in UTC.')"
				,"All schedule times are in UTC. As a reference, the current UTC time is"
				,"所有排程的時區皆使用國際標準時間，做為參考，現在國際標準時間為："]
			,["attr","input[value='Delete Entry']"		,"value","刪除排程"]
			,["attr","input[value='Apply Schedule']"	,"value","送出設定"]
		]
	},
	
	"bitcoin.php":
	{
		 "div.stuffbox h2:contains('Bitcoin Donation')"				:
			 "Bitcoin Donation 比特幣贊助捐款 ( 僅翻譯主要部分 )<br>"
			+"( <a href='http://zh.scratchpad.wikia.com/wiki/Donation' target='_bank'><font color='green'><b>"
			+"相關說明參考資料"
			+"</a></b></font> )<br>"
			+"圍紀實驗室"
			
		,"div.stuffbox p:contains('Your Wallet Address:')"			:"你的錢包地址："
		,"div.stuffbox p:contains('Send Address Information')"		:"錢包地址傳送說明"
		,"div.stuffbox p a:contains('Request New Address')"			:"要求新地址"
		,"div.stuffbox p:contains('Incoming Bitcoin Transactions')"	:
			 "比特幣入帳狀況"
			+"<br><font color='blue'>Pending</font>：<font color='gray'>正在處理</font>｜"
			+"<font color='green'>Confirmed</font>：<font color='black'>入帳完成</font>"
			//+"<br>Confirmed：入帳完成"
		,"div.stuffbox h2:contains('Bitcoin Spending History')"		:"比特幣花費紀錄"
		,"div.stuffbox h2:contains('Donation Log')"					:"捐款記錄 ( 美金 )"
		,"div.stuffbox h2:contains('Adopt-a-Server Log')"			:"認養記錄"
		
		
		,"#tdon th:contains('Donation Level')"	:"贊助等級"
		,"#tdon th:contains('EXP Bonus')"		:"經驗加成"
		,"#tdon th:contains('Daily Bonus')"		:"每日贈幣"
		,"#tdon th:contains('Daily Hath')"		:"每日駭斯幣"
		,"#tdon th:contains('Free Archives')"	:"免費打包"
		,"#dlvl td.tdon1:contains('None')"		:"尚未贊助"
		,"#tdon td.tdon1:contains('None')"		:"尚未贊助"
		,"#tdon td.tdon2:contains('You did not donate anything yet, but we still love you.')":
			"你還沒有贊助，但我們依然感謝你."
		
		
		,"ReplaceMode":
		[
			/*
			["attr"
				,"div.stuffbox p a:contains('Request New Address')"
				,"onclick"	
				,"if(confirm('你確定要建立新的錢包接收地址?? 你只能在24小時內執行一次."
				+"發送到以前的地址仍然會有效.')) { create_new_wallet(); }"]
			*/
			
			 ["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"Bitcoin is a virtual currency that is completely decentralized and independent of any formal authority."
				,"比特幣是虛擬性質的貨幣，分散性地獨立於任何機構之外."]
			,["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"Much like real money, you can spend Bitcoins however you wish, "
				,"如同現實貨幣，你可以按照自己的心願花費比特幣，"]
			,["html","div.stuffbox p:contains('account or otherwise blocks your transfer.')"
				,"without any fear that someone shuts down your account or otherwise blocks your transfer."
				,"<br>不需要害怕，任何人都無法關閉你的帳戶，或以其他方式禁止你的交易."]
			,["html","div.stuffbox a:contains('about Bitcoins and how to acquire them')"
				,"See this thread for more information about Bitcoins and how to acquire them"
				,"<br>請看這裡瞭解更多相關資訊和如何取得比特幣"]
			
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"This page allows you to transfer Bitcoins from an online service or a local wallet on your computer or cellphone to your wallet at E-Hentai, "
				,"本頁可讓你在電腦、手機上，從線上服務或本地錢包轉帳比特幣至E紳士，"]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"then apply that either as a donation or Adopt-a-Server slots."
				,"然後用於捐款或認養伺服器."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"Donations can typically be applied within an hour of it being transferred."
				,"<br>捐款一般需要一小時入帳時間."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"You will be able to track the progress of a transfer below as soon as it has been broadcasted to the network - click the transaction ID to bring up the transaction details."
				,"你可於交易至網路運作時追蹤交易進度 - 點選交易ID顯示交易細況."]
			,["html","div.stuffbox p:contains('Three confirmations are required for')"
				,"Three confirmations are required for"
				,"並再三進行必要的"]
			,["html","div.stuffbox p strong:contains('Confirmed')"
				,"Confirmed"
				,"檢查與確認"]
			,["html","div.stuffbox p:contains(' status.')"
				," status."
				,"."]
			,["html","div.stuffbox p:contains('weighted average provided by ')"
				,"Your Bitcoins will be converted to the equivalent value in US dollars at the time you choose to apply it."
				,"你的比特幣將會自動依照匯率轉換成等值的美金."]
			,["html","div.stuffbox p:contains('weighted average provided by ')"
				,"We currently use whichever is highest of the 7-day and 24-hour weighted average provided by"
				,"<br>我們目前使用7天和24小時中最高的加權平均，由"]
			,["html","div.stuffbox p:contains('random volatility. Current rate is ')"
				,", plus a 10% bonus to cover transaction fees and random volatility. Current rate is "
				," 提供，附加總額 10% 的額外獎勵用於支付手續費和應對隨機波動率. 現在的匯率："]
			
			,["html","div.stuffbox p:contains('is actually in the E-Hentai system.')"
				,"You can use this form to send someone a PM from the gallery system with your wallet address."
				,"你可以填寫這個表格，透過系統告知別人自己的錢包地址."]
			,["html","div.stuffbox p:contains('is actually in the E-Hentai system.')"
				,"This lets people know for sure that a given wallet address is actually in the E-Hentai system."
				,"這讓人知道你的錢包地址確實存在於系統當中，而非錯誤或假冒地址."]
			,["html","form:contains('Send to member name:')"
				,"Send to member name:"
				,"該會員名稱："]
			
			
			
			,["html","div.stuffbox div","Available Balance:"	,"可用餘額："]
			,["html","div.stuffbox div","Donation Total:"		,"捐款總計："]
			,["html","div.stuffbox div","Adopt-a-Server Days:"	,"伺服器認養天數："]
			
			,["html","div.stuffbox div h2"	,"Apply BTC to Donation"		,"比特幣捐款"]
			,["attr","div.stuffbox input[name='donate']"		,"value"	,"送出"]
			
			,["html","div.stuffbox div h2"	,"Apply BTC to Adopt-a-Server"	,"比特幣認養伺服器"]
			,["html","#aas_slottype"		,"Select slot duration.."	,"選擇認養時長.."]
			,["html","#aas_slottype"		,"Month"	,"月"]
			,["html","#aas_slottype"		,"month"	,"每月"]
			,["html","#aas_slottype"		,"Year"		,"年"]
			,["attr","div.stuffbox input[name='aas']"			,"value","送出"]
			
			,["html","#dlvl td.tdon2"
				,"You did not donate anything yet, but we still love you."
				,"你還沒有贊助，但我們依然感謝你."]
			,["html","#tdon td.tdon1","Bronze Star"	,"青銅之星"]
			,["html","#tdon td.tdon1","Silver Star"	,"白銀之星"]
			,["html","#tdon td.tdon1","Gold Star"	,"黃金之星"]
			,["html","#tdon td.tdon1","Tri Star"	,"黃金三星"]
			,["html","#tdon td.tdon1","Quint Star"	,"黃金五星"]
			,["html","#tdon td.tdon1","Septua Star"	,"黃金七星"]
			,["html","#tdon td.tdon1","Honorary Catgirl","骨灰級貓女"]
			
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$1000.","贊助滿 $1000 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$700."	,"贊助滿 $700 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$500."	,"贊助滿 $500 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$300."	,"贊助滿 $300 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$100."	,"贊助滿 $100 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$50."	,"贊助滿 $50 獲得."]
			,["html","#tdon td.tdon2","Awarded for a total donation of \\$20."	,"贊助滿 $20 獲得."]
			,["html","#tdon td.tdon5","Credits"	,"<font color='Teal'>紳士幣</font>"]
			,["html","#tdon td.tdon5","GP"		,"<font color='RoyalBlue'>圖幣</font>"]
			,["html","#tdon td.tdon6","Hath"	,"<font color='DarkOrchid'>駭斯幣</font>"]
			,["html","#tdon td.tdon7"," / day"," / 日"]
		]
	},
	
	"manage.php":
	{
		//Main
		 "div.ui p:contains('Your Galleries')"								:"你的畫冊"
		,"div.ui p a:contains('Create a New Gallery')"						:"新建畫冊"
		,"div.ui p a:contains('Manage Folders')"							:"管理資料夾"
		,"#mgform div[style='float:left']div:contains('Galleries newly created')":
			"最新建立的畫冊"
		,"#mgform div[style='float:left']div:contains('Galleries under construction, or being modified')":
			"畫冊建設修改中..."
		,"#mgform div[style='float:left']:contains('Galleries active and publicly available')":
			"畫冊可用且公開"
		,"#mgform div a:contains('Collapse Open Folders')"					:"折疊文件夾"
		,"#gtable4 td a:contains('Get Folder BBCode')"						:"取得資料夾 BBCode"
		,"#mgform span.stdbtn:contains('+ All')" 		:"全選"
		,"#mgform span.stdbtn:contains('- All')" 		:"全不選"
		,"option[value='0']:contains('Unsorted')"		:"未排序"
		,"#mgform table.mt span:contains('Unsorted')"	:"未排序"
		
		//Manage Folders
		,"div.ui h1:contains('Manage Folders')"		:"管理資料夾"
		,"div.ui form th:contains('Folder Name')"	:"資料夾名稱"
		,"div.ui form th:contains('Display Order')"	:"顯示順序"
		,"div.ui p:contains('New Folder')"			:"建立資料夾"
		,"div.ui p:contains('Auto-Sort')"			:"自動排序"
		,"div.ui p a:contains('Back to Manager')"	:"回到畫冊管理頁面"
		
		//Create a New Gallery
		,"div.ui p:contains('Create a New Gallery')"				:"建立新畫冊"
		,"div.ui form td:contains('Gallery Title')" 				:"畫冊標題"
		,"div.ui form td:contains('Japanese Script (optional)')" 	:"畫冊副標題(選用)"
		,"div.ui form td:contains('Gallery Folder')"				:"畫冊資料夾"
		,"div.ui form td:contains('Gallery Description')"			:"畫冊敘述"
		,"div.ui form[action*='act=new'] a:contains('Back to Manager')":"回到畫冊管理頁面" 
		
		//Modify Gallery
		,"div.ui p:contains('Modify Gallery')"						:"編輯畫冊"
		,"div.ui td a:contains('Back to Manager')"					:"回到畫冊管理頁面"
		
		//Upload Gallery
		,"#uploadform span:contains('Files uploaded so far')"		:"上傳記錄"
		
		//Preview Gallery
		,"div.stuffbox td:contains('Name:')" :"名稱："
		,"div.stuffbox td:contains('Desc:')" :"敘述："
		,"div.stuffbox td:contains('Files:')":"檔案："
		,"div.stuffbox span:contains('Gallery Options:')"			:"畫冊選項："
		,"div.stuffbox a:contains('Add More Files')"				:"加入更多圖片"
		,"div.stuffbox a:contains('Reorder or Remove Files')"		:"排序或移除圖片"
		,"div.stuffbox a:contains('Modify Title or Description')"	:"更改標題或敘述"
		,"div.stuffbox a:contains('Publish Gallery')"				:"發佈畫冊"
		,"div.stuffbox a:contains('Go to Public Gallery')"			:"來去畫冊"
		
		//Reorder Gallery
		,"div.stuffbox h1:contains('Reorder Gallery')":"畫冊排序"
		
		,"ReplaceMode":
		[
			//Main
			 ["html","#mgform th","Gallery Name"		,"畫冊名稱"]
			,["html","#mgform th","Date Added"			,"建立時間"]
			,["html","#mgform th","Files"				,"圖片數"]
			,["html","#mgform th","Public Category"	,"公開分類"]
			,["html","#mgform th","Available Actions"	,"可用動作"]
			,["modi","#mgform"	,{
				'modiTarget1'		:'tr.gtr1,tr.gtr0'
				,'>Go To Gallery<'	:'>來去畫冊<'
				,'>Stats<'			:'>畫冊統計<'
				,'>Add Files<'		:'>新增圖片<'
				,'>Reorder<'		:'>重新排序<'
				,'>Modify<'			:'>編輯<'
				,'>Publish<'		:'>發佈<'
				,'>Delete<'			:'>刪除<'
				,'modiTarget2'						:'td.gtc1'
				,'Loading folder, please wait...'	:'載入內容中，請稍後...'
				,'modiTarget3'		:'td.gtc4'
				,"Doujinshi"		:"同人誌"
				,"Manga"			:"漫畫"
				,"Artist CG Sets"	:"畫師繪圖"
				,"Game CG Sets"		:"遊戲繪圖"
				,"Western"			:"西方的"
				,"Non-H"			:"無色情"
				,"Image Sets"		:"圖片集"
				,"Cosplay"			:"角色扮演"
				,"Misc"				:"雜項"
			}]
			
			,["html","#mgform td"
				,"Set public category for selected galleries:"
				,"給選擇的畫冊設定分類："]
			,["html","#mgform td"
				,"Move selected galleries to folder:"
				,"將選擇的畫冊移至資料夾："]
			
			,["html","select[name='publiccat']","\\(Private\\)"	,"（ 私人畫冊 ）"]
			,["html","select[name='publiccat']","Doujinshi"		,"同人志－Doujinshi"]
			,["html","select[name='publiccat']","Manga"			,"漫画－－Manga"]
			,["html","select[name='publiccat']","Artist CG Sets","畫師繪圖Artist CG Sets"]
			,["html","select[name='publiccat']","Game CG Sets"	,"遊戲繪圖Game CG Sets"]
			,["html","select[name='publiccat']","Western"		,"西方的－Western"]
			,["html","select[name='publiccat']","Non-H"			,"无色情－Non-H"]
			,["html","select[name='publiccat']","Image Sets"	,"图片集－Image Sets"]
			,["html","select[name='publiccat']","Cosplay"		,"角色扮演Cosplay"]
			,["html","select[name='publiccat']","Misc"			,"杂项－－Misc"]
			
			,["attr","input[name='categorize']","value","設定分類"]
			,["attr","input[name='folderize']" ,"value","轉移畫冊"]
			/*
			,["html","#mgform div:contains('Galleries active and publicly available')"
				,"Galleries active and publicly available"
				,"畫冊可用且公開"]
			*/
			//Manage Folders
			,["attr","input[value='Apply Sort Order']" 	,"value","設定排序"]
			,["attr","input[value='Create']" 			,"value","建立"]
			,["html","div.ui form[action*='fact=autosort']"
				,"Sort folders alphabetically: "
				,"資料夾按字母排序"]
			,["attr","input[value='Auto-Sort']" ,"value","開始排序"]
			
			//Create a New Gallery
			,["html","form td"," or new folder: "		,"　或使用新資料夾："]
			,["html","label[for='public']"
				,"Make this gallery publicly available for viewing under the category:"
				,"選擇畫冊公開的分類："]
			,["html","label[for='tos']"
				,"I have read and agree with the terms of the"
				,"我已經閱讀使用者條款："]
			,["attr","input[name='creategallery']" 		,"value","建立並繼續"]
			
			//Modify Gallery
			,["attr","input[value='Confirm Changes']" 	,"value","確認編輯"]
			
			//Upload Gallery
			,["html","#uploadform div > span:eq(0)"
				,"Upload new files to gallery:"
				,"上傳圖片到畫冊："]
			,["html","#uploadform > div:eq(1)"
				,"\\(No files added yet\\)"
				,"( 還未有檔案上傳 )"]
			,["html","#uploadform td span"
				,"Accepted Image Formats:"
				,"有效的圖片格式："]
			,["html","#uploadform td span"
				,"Accepted Archive Formats:"
				,"有效的壓縮檔格式："]
			,["html","#uploadform td span"
				,"Max File Size: "
				,"最大檔案大小："]
			,["html","#uploadform td span"
				,"per Image. Max Resolution:"
				,"每張圖片. 最大解析度："]
			,["html","#uploadform > div:eq(2) td"
				,"Max 2,000 files per gallery."
				,"一個畫冊最多容納 2千張圖片."]
			,["html","#uploadform > div:eq(2) td"
				,"You should upload no more than 500MB at a time, "
				,"你單次上傳不應該超過 500MB，"]
			,["html","#uploadform > div:eq(2) td"
				,"less if you have a slow connection."
				,"請依據自己的網路速度調降."]
			,["html","#uploadform > div:eq(2) td"
				,"To upload the files listed above and return here to continue adding files, "
				,"如果你想要上面上傳完後回到本頁，"]
			,["html","#uploadform > div:eq(2) td"
				,"hit Upload and Add More."
				,"請點擊按鈕：上傳並回到本頁"]
			,["html","#uploadform > div:eq(2) td"
				,"To upload these files and continue to the next step, "
				,"如果你想要上面上傳完後繼續下一步，"]
			,["html","#uploadform > div:eq(2) td"
				,"hit Upload and Continue."
				,"請點擊按鈕：上傳並下一步"]
			,["html","#uploadform > div:eq(2) td"
				,"If you need to remove or reorder files, you can do so at the next step."
				,"如果你需要移除或排序圖片，請至下一步."]
			,["attr","input[value='Upload and Add More']","value","上傳並回到本頁"]
			,["attr","input[value='Upload and Continue']","value","上傳並至下一步"]
			
			//Preview Gallery
			,["html","div.stuffbox span:contains('This is only a preview.')"
				,"This is only a preview. Do not link to this page, "
				,"本頁只是畫冊預覽，請勿使用本頁網址，"]
			,["html","div.stuffbox span:contains('as you are the only')"
				,"as you are the only one who can access it!"
				,"本頁只有你能瀏覽!"]
			,["html","div.stuffbox span:contains('To let people access')"
				,"To let people access this gallery, "
				,"<br>要讓人們看到此畫冊，"]
			,["html","div.stuffbox span:contains('you must first')"
				,'you must first "Publish" it, '
				,'你必須先 "發佈" 畫冊，']
			,["html","div.stuffbox span:contains('then get a link by')"
				,'then get a link by hitting "Go to Public Gallery"'
				,'然後從 "到公開畫冊" 取得畫冊網址']
			,["html","div.stuffbox span:contains('at the main manager screen.')"
				,' here or "View Gallery" at the main manager screen.'
				,'或在管理頁面點選 "瀏覽畫冊".']
			,["html","div.stuffbox td:contains(' total)')"
				,"total\\)"
				,"張圖)"]
			,["html","div.stuffbox td:contains('(No files have been added to this gallery.)')"
				,"\\(No files have been added to this gallery.\\)"
				,"( 目前本畫冊沒有圖片. )"]
			
			//Reorder Gallery
			,["attr","input[value='Cancel and Return']","value","取消回去"]
			
			//Publish Gallery
			,["html","div.d"
				,"Please confirm that you wish to publish this gallery."
				,"請確認你想要發佈這個畫冊."]
			,["html","div.d"
				,"Doing so will lock it for new file additions and modifications."
				,"<br>這樣做將禁止新增或修改圖片."]
			,["html","div.d"
				,"If you wish to add to or modify this gallery later, "
				,"<br>如果你希望之後新增或修改畫冊內容，"]
			,["html","div.d"
				,"a copy will be created for this purpose."
				,"將會為此新增一個畫冊副本."]
			,["html","div.d"
				,"Note that published galleries cannot be deleted."
				,"<br><font color='red'><b>請注意！！發佈畫冊後無法刪除！！</b></font>"]
			,["attr","input[value='Cancel']"	,"value","取消"]
			,["attr","input[value='Publish']"	,"value","發佈"]
			
			//Delete Gallery
			,["html","div.d"
				,"Please confirm that you wish to delete the gallery:"
				,"請確認是否要刪除此畫冊："]
			,["attr","input[value='Delete']"	,"value","刪除"]
		]
	},
	
	"codegen.php":
	{
		"p:contains('Copy the code below, and paste it to a BBCode-compatible forum or similar to make a gallery.')":
			"複製下面的網頁原始碼，並貼到支援BBCode語法的論壇、網站."
		
		
	},
	
	"toplist.php":
	{
		 "div.ido h1 a:contains('EHG Toplists')"			:"E紳士排行總榜"
		,"div.ido div.dc h2:contains('Gallery Toplists')"	:"畫冊排行"
		,"div.ido a:contains('Galleries All-Time')"			:"畫冊時間總排行"
		,"div.ido a:contains('Galleries Past Year')"		:"畫冊去年排行榜"
		,"div.ido a:contains('Galleries Past Month')"		:"畫冊上個月排行"
		,"div.ido a:contains('Galleries Yesterday')"		:"畫冊昨天排行榜"
		
		,"div.ido h2:contains('Uploader Toplists')"	:"上傳排行"
		,"div.ido a:contains('Uploader All-Time')"	:"上傳時間總排行"
		,"div.ido a:contains('Uploader Past Year')"	:"上傳去年排行榜"
		,"div.ido a:contains('Uploader Past Month')":"上傳上個月排行"
		,"div.ido a:contains('Uploader Yesterday')"	:"上傳昨天排行榜"
		
		,"div.ido h2:contains('Tagging Toplists')"	:"標籤排行"
		,"div.ido a:contains('Tagging All-Time')"	:"標籤時間總排行"
		,"div.ido a:contains('Tagging Past Year')"	:"標籤去年排行榜"
		,"div.ido a:contains('Tagging Past Month')"	:"標籤上個月排行"
		,"div.ido a:contains('Tagging Yesterday')"	:"標籤昨天排行榜"
		
		,"div.ido h2:contains('Hentai@Home Toplists')"	:"紳士之家排行"
		,"div.ido a:contains('Hentai@Home All-Time')"	:"紳士之家時間總排行"
		,"div.ido a:contains('Hentai@Home Past Year')"	:"紳士之家去年排行榜"
		,"div.ido a:contains('Hentai@Home Past Month')"	:"紳士之家上個月排行"
		,"div.ido a:contains('Hentai@Home Yesterday')"	:"紳士之家昨天排行榜"
		
		,"div.ido h2:contains('EHTracker Toplists')"	:"BT種子排行"
		,"div.ido a:contains('EHTracker All-Time')"		:"BT種子時間總排行"
		,"div.ido a:contains('EHTracker Past Year')"	:"BT種子去年排行榜"
		,"div.ido a:contains('EHTracker Past Month')"	:"BT種子上個月排行"
		,"div.ido a:contains('EHTracker Yesterday')"	:"BT種子昨天排行榜"
		
		,"div.ido h2:contains('Cleanup Toplists')"	:"清理排行"
		,"div.ido a:contains('Cleanup All-Time')"	:"清理時間總排行"
		,"div.ido a:contains('Cleanup Past Year')"	:"清理去年排行榜"
		,"div.ido a:contains('Cleanup Past Month')"	:"清理上個月排行"
		,"div.ido a:contains('Cleanup Yesterday')"	:"清理昨天排行榜"
		//排行內容頁
		,"table.itg th:contains('Rank')"			:"排名"
		,"table.itg th:contains('Score')"			:"分數"
		,"table.itg th:contains('Published')"		:"發表時間"
		,"table.itg th:contains('Name')"			:"名稱"
		,"table.itg th:contains('Uploader')"		:"上傳者"
		,"#ot a:contains('Show only my galleries')"	:"只顯示我的畫冊"
		,"#ot a:contains('Show all galleries')"		:"顯示全部畫冊"
		,"#nf:contains('No matching entries found')":"<b>無搜尋結果</b>"
		,"ReplaceMode":
		[
			 ["text","div.ido h2"	,"Rating & Reviewing Toplists"	,"評星&回顧排行"]
			,["text","div.ido a"	,"Rating & Reviewing All-Time"	,"評星&時間總排行"]
			,["text","div.ido a"	,"Rating & Reviewing Past Year"	,"評星&去年排行榜"]
			,["text","div.ido a"	,"Rating & Reviewing Past Month","評星&上個月排行"]
			,["text","div.ido a"	,"Rating & Reviewing Yesterday"	,"評星&昨天排行榜"]
			//排行內容頁
			,["html","p.os:contains('Only showing galleries uploaded by')"
				,"Only showing galleries uploaded by "
				,"顯示畫冊上傳者："]
		]
	},
	
	"bounty_post.php":
	{
		 "#lb a:contains('Bounty List')"						:"懸賞列表"
		,"#lb a:contains('Most Wanted Standard Bounties')"		:"標準懸賞類"
		,"#lb a:contains('Most Wanted Translation Bounties')"	:"翻譯懸賞類"
		,"#lb a:contains('Most Wanted Editing Bounties')"		:"補充懸賞類"
		,"#lb a:contains('Post New Bounty')"					:"發起懸賞"
		,"div.stuffbox p:contains('Post New Bounty')"			:"發起懸賞"
		,"span:contains('Bounty Headline:')"					:"懸賞頭名："
		,"span:contains('Detailed Bounty Description:')"		:"懸賞詳細敘述："
		,"span:contains('Wanted Poster:')"						:"懸賞大頭貼："
		,"span:contains('Offered Reward:')"						:"提供賞金："
		,"span:contains('Bounty Type:')"						:"懸賞類型："
		,"span:contains('Minimum Hunter Rank:')"				:"賞金獵人最低等級要求："
		,"span:contains('Accepted Delivery:')"					:"可用的交貨方式："
		,"span:contains('Super Dwarf Princess')"				:"超級矮人公主"
		,"label[for='btype_0']":"標準類"
		,"label[for='btype_1']":"翻譯類"
		,"label[for='btype_2']":"補充類"
		,"label[for*='minrank_']:contains('Rank A')"	:"分級 A"
		,"label[for*='minrank_']:contains('Rank B')"	:"分級 B"
		,"label[for*='minrank_']:contains('Rank C')"	:"分級 C"
		,"label[for*='minrank_']:contains('Rank D')"	:"分級 D"
		,"label[for*='minrank_']:contains('Rank E')"	:"分級 E"
		,"label[for*='minrank_']:contains('Rank F')"	:"分級 F"
		,"label[for*='minrank_']:contains('Unranked')"	:"未分級"
		,"label[for*='acceptable_']:contains('Posted to the E-Hentai Galleries System')"	:
			"發表至E紳士畫冊系統"
		,"label[for*='acceptable_']:contains('Archive download at a file locker service')"	:
			"私密檔案分享空間"
		,"label[for*='acceptable_']:contains('BitTorrent download at a public tracker')"	:
			"公開伺服器的BT種子"
		,"label[for*='acceptable_']:contains('Other; specify in bounty description')"		:
			"其他; 註明在懸賞說明中"
		,"label[for*='acceptable_']:contains('Unranked')"	:"未分級"
		
		,"ReplaceMode":
		[	
			["html","td:contains('A short one-liner')"
				,"A short one-liner consistently describing the bounty. "
				,"簡述此次懸賞的名稱，"]
			,["html","td:contains('This will appear on the')"
				,"This will appear on the Bounty Overview screen."
				,"會顯示在各類版面上."]
			
			,["html","td:contains('Remember to be specific.')"
				,"\""
				,""]
			,["html","td:contains('Remember to be specific.')"
				,'Remember to be specific. Bounties like Requesting'
				,"定義要足夠具體. <br>敘述像是：「想要"]
			,["html","td:contains('Hentai is not very specific,')"
				,'Hentai is not very specific, '
				,'變態」其實並不夠具體，']
			,["html","td:contains('and any bounty claim featuring')"
				,"and any bounty claim featuring anything that matches would be accepted;"
				,"而且任何懸賞投稿，只要符合條件都會被接受;"]
			,["html","td:contains('bounties like Any')"
				,"bounties like Any "
				,"<br><br>其中像是：「任何"]
			,["html","td:contains('Hentai I don\\'t have would require an actual list;')"
				,"Hentai I don't have would require an actual list;"
				,"變態我沒有的」列入需求清單;"]
			,["html","td:contains('and so on.')"
				,"and so on. "
				,"諸如此類."]
			,["html","td:contains('If you have any minimum quality/resolution demands,')"
				,"If you have any minimum quality/resolution demands, "
				,"<br>如果你有最低品質/解析度的需求，"]
			,["html","td:contains('make sure to include this as well.')"
				,"make sure to include this as well."
				,"務必註明完整."]
			
			,["html","td:contains('The more precise you can define your bounty,')"
				,"The more precise you can define your bounty, "
				,"更精確的敘述你懸賞的內容，"]
			,["html","td:contains('the higher the chance you will be satisfied with its result.')"
				,"the higher the chance you will be satisfied with its result."
				,"你會有更高的機會獲得滿意的結果."]
			,["html","td:contains('Keep in mind that if your bounty')"
				,"Keep in mind that if your bounty is vague and someone technically fulfills it \\(as determined by a Bounty Moderator\\), your posted reward is forfeit."
				,"<br><br>請多當心，如果你的懸賞內容定義模糊，且某個人技術性地提供符合條件的內容 "
				+"( 由懸賞主持人評斷 )，你的賞金將會被沒收."
				]
				
			,["html","td:contains('You can optionally upload a thumbnail, cover page,')"
				,"You can optionally upload a thumbnail, cover page, "
				,"你可以選擇性地上傳縮圖、封面圖，"]
			,["html","td:contains('an image from an incomplete collection')"
				,"an image from an incomplete collection, or any other image to further specify the bounty. \\(JPG/PNG\\)"
				,"<br>一張跟懸賞內容相關的圖片，或任何可讓人聯想到此懸賞的圖片."
				+"<br>可用圖片格式：(JPG/PNG)"
				]
			
			,["html","td:contains('The reward you offer for this bounty,')"
				,"The reward you offer for this bounty, "
				,"你可以設定初始賞金，"]
			,["html","td:contains('in Credits and/or Hath.')"
				,"in Credits and/or Hath. The minimum allowed is 20000 Credits or 2 Hath."
				,"使用<font color='RoyalBlue'>紳士幣</font>或<font color='DarkOrchid'>駭斯幣</font>. "
				+"<br>最低賞金為 20000 <font color='RoyalBlue'>紳士幣</font>或 2 <font color='DarkOrchid'>駭斯幣</font>."]
			,["html","td:contains(' Credits')"
				," Credits"
				," <font color='RoyalBlue'>紳士幣 ( Credits )</font>"]
			,["html","td:contains(' Hath')"
				," Hath"
				," <font color='DarkOrchid'>駭斯幣 ( Hath )</font>"]
			
			,["html","td:contains('If this bounty is for a translation job,')"
				,"If this bounty is for a translation job, "
				,"如果是翻譯類懸賞，"]
			,["html","td:contains('select Translation.')"
				,"select Translation. In this case, you should provide a link to the source material."
				,"右邊請選擇翻譯類. <br>在這種情況下，你也應該提供原始素材的網址連結."]
			,["html","td:contains('Otherwise, select Standard.')"
				,"Otherwise, select Standard."
				,"<br>若非如此，請選擇標準類."]
				
			,["html","td:contains('This is the minimum rank')"
				,"This is the minimum rank a Bounty Hunter needs to accept or claim this bounty."
				,"這邊可設定可接下賞金任務或投稿的獵人最低等級."]
			,["html","td:contains('The default recommended setting is Rank D,')"
				,"The default recommended setting is Rank D, "
				,"<br>預設的建議設定是分級 D，"]
			,["html","td:contains('which will allow unranked hunters,')"
				,"which will allow unranked hunters, "
				,"可讓未分級獵人接取任務，"]
			,["html","td:contains('but exclude those who')"
				,"but exclude those who have an inordinate number of rejected claims."
				,"但不包括不良獵人. <br>( 擁有過多投稿被拒絕紀錄者 )."]
				
			,["html","td:contains('These are the delivery methods')"
				,"These are the delivery methods you accept for this bounty."
				,"這邊是你可接受的交貨方式."]
			,["html","td:contains('If you only want galleries')"
				,"If you only want galleries posted to E-Hentai Galleries, you do not need to change this."
				,"<br>如果你只想要發表至E紳士畫冊，設定不需更動."]
				
			,["html","td:contains('Please verify that your information')"
				,"Please verify that your information is correct before you submit this bounty."
				,"請重新確認你的資料皆有填寫正確後才發起懸賞."]
			,["attr","input[value='Post Bounty']","value","- 發起懸賞 -"]
		]
	},
	
	"bounty.php":
	{
		//分類框
		 "#lb a:contains('Bounty List')"						:"懸賞列表"
		,"#lb a:contains('Most Wanted Standard Bounties')"		:"標準懸賞榜"
		,"#lb a:contains('Most Wanted Translation Bounties')"	:"翻譯懸賞榜"
		,"#lb a:contains('Most Wanted Editing Bounties')"		:"補充懸賞榜"
		,"#lb a:contains('Post New Bounty')"					:"發起懸賞"//
		//懸賞列表
		,"h1.ih:contains('Showing All Open Bounties')"			:"顯示<font color='blue'>開放式</font>懸賞"
		,"h1.ih:contains('Showing All Reserved Bounties')"		:"顯示<font color='blue'>已保留</font>懸賞"
		,"h1.ih:contains('Showing All Claimed Bounties')"		:"顯示<font color='blue'>已服務</font>懸賞"
		,"h1.ih:contains('Showing All Completed Bounties')"		:"顯示<font color='blue'>已完成</font>懸賞"
		,"h1.ih:contains('Showing Bounties Posted By Me')"		:"顯示<font color='blue'>我發起</font>的懸賞"
		,"h1.ih:contains('Showing Bounties Boosted By Me')"		:"顯示<font color='blue'>我投資</font>的懸賞"
		,"h1.ih:contains('Showing Bounties Accepted By Me')"	:"顯示<font color='blue'>我接受</font>的懸賞"
		,"h1.ih:contains('Showing Bounties Reserved For Me')"	:"顯示<font color='blue'>我保留</font>的懸賞"
		,"h1.ih:contains('Showing Bounties Claimed By Me')"		:"顯示<font color='blue'>我投稿</font>的懸賞"
		,"h1.ih:contains('Showing Bounties Completed By Me')"	:"顯示<font color='blue'>我完成</font>的懸賞"
		,"table.itg th:contains('Last Updated')"	:"最後更新"
		,"table.itg th:contains('Bounty Headline')"	:"懸賞頭名"
		,"table.itg th:contains('Bounty Type')"		:"懸賞類型"
		,"table.itg th:contains('Bounty Status')"	:"懸賞狀態"
		,"table.itg th:contains('Total Bounty')"	:"總懸賞金額"
		,"table.itg th:contains('Posted By')"		:"發起者"
		,"table.itg td:contains('Standard')"		:"<font color='green'>標準</font>"
		,"table.itg td:contains('Translation')"		:"<font color='blue'>翻譯</font>"
		,"table.itg td:contains('Editing')"			:"<font color='black'>補充</font>"
		,"table.itg td.itd span:contains('Open/New')"			:"開放 / 新建"
		,"table.itg td.itd span:contains('Open/Accepted')"		:"開放 / 接受"
		,"table.itg td.itd span:contains('Closed/Reserved')"	:"關閉 / 保留"
		,"table.itg td.itd span:contains('Closed/Claimed')"		:"關閉 / 投稿"
		,"table.itg td.itd span:contains('Closed/Completed')"	:"關閉 / 完成"
		,"div.stuffbox div:contains('You are currently an Unranked Bounty Hunter.')": "獵人等級尚未分級"
		//懸賞榜單類
		,"div.stuffbox p:contains('Most Wanted Standard Bounties')"		:"標準懸賞榜"
		,"div.stuffbox p:contains('Most Wanted Translation Bounties')"	:"翻譯懸賞榜"
		,"div.stuffbox p:contains('Most Wanted Editing Bounties')"		:"補充懸賞榜"
		,"td.bd1:contains('Bounty Poster:')"	:"懸賞發起者："
		,"td.bd1:contains('Posted Date:')"		:"發起時間："
		,"td.bd1:contains('Bounty Status:')"	:"懸賞狀態："
		,"td.bd1:contains('Min Hunter Rank:')"	:"最低等級要求："
		,"td.bd1:contains('Current Reward:')"	:"現有賞金："
		,"table.btl span:contains('Open/New')"			:"開放 / 新建"
		,"table.btl span:contains('Open/Accepted')"		:"開放 / 接受"
		,"table.btl span:contains('Closed/Reserved')"	:"關閉 / 保留"
		,"table.btl span:contains('Closed/Claimed')"	:"關閉 / 投稿"
		,"table.btl span:contains('Closed/Completed')"	:"關閉 / 完成"
		,"table.btl span:contains('Rank A')"	:"分級 A"
		,"table.btl span:contains('Rank B')"	:"分級 B"
		,"table.btl span:contains('Rank C')"	:"分級 C"
		,"table.btl span:contains('Rank D')"	:"分級 D"
		,"table.btl span:contains('Rank E')"	:"分級 E"
		,"table.btl span:contains('Rank F')"	:"分級 F"
		,"table.btl span:contains('Unranked')"	:"未分級"
		//懸賞內容頁
		,"p:contains('You have successfully upped the reward on this bounty.')":
			"<font color='green'>你已經成功加碼到此懸賞</font>"
		,"td:contains('Bounty Posted By:')"			:"懸賞發起者："
		,"td:contains('Bounty Type:')"				:"懸賞類型："
		,"td:contains('Accepted Delivery:')"		:"接受交貨："
		,"div.brd td.bd2 strong:contains('Updated')":"已更新"
		,"td.bd2 strong:contains('Standard')"		:"標準"
		,"td.bd2 strong:contains('Translation')"	:"翻譯"
		,"td.bd2 strong:contains('Editing')"		:"補充"
		,"td.bd2 span:contains('Open/New')"			:"開放 / 新建"
		,"td.bd2 span:contains('Open/Accepted')"	:"開放 / 接受"
		,"td.bd2 span:contains('Closed/Reserved')"	:"關閉 / 保留"
		,"td.bd2 span:contains('Closed/Claimed')"	:"關閉 / 投稿"
		,"td.bd2 span:contains('Closed/Completed')"	:"關閉 / 完成"
		,"td.bd2 span:contains('Rank A')"	:"分級 A"
		,"td.bd2 span:contains('Rank B')"	:"分級 B"
		,"td.bd2 span:contains('Rank C')"	:"分級 C"
		,"td.bd2 span:contains('Rank D')"	:"分級 D"
		,"td.bd2 span:contains('Rank E')"	:"分級 E"
		,"td.bd2 span:contains('Rank F')"	:"分級 F"
		,"td.bd2 span:contains('Unranked')"	:"未分級"
		,"td.bd2 span:contains('Posted to the E-Hentai Galleries System')":
			"已在E紳士系統上發表畫冊"
		,"td.bd2 span:contains('Archive download at a file locker service')":
			"檔案下載的文件櫃服務"
		,"td.bd2 span:contains('BitTorrent download at a public tracker')":
			"公開的BT下載"
		,"td.bd2 span:contains('Other; specify in bounty description')":
			"其他;請看懸賞說明"
		,"div.brw th:contains('Added')"			 :"加入時間"
		,"div.brw th:contains('Amount')"		 :"金額"
		,"div.brw th:contains('Posted By')"		 :"提供者"
		,"div.bcl th:contains('Claim Date')"	 :"服務日期"
		,"div.bcl th:contains('Status')"		 :"狀態"
		,"div.bcl th:contains('Bounty Hunter')"	 :"賞金獵人"
		,"div.bcl th:contains('Hunter Rating')"	 :"獵人等級"
		,"div.brw td:contains('Original Bounty')":"基本賞金"
		,"div.bcl td:contains('This bounty has not been accepted or claimed by anyone.')":
			"此懸賞無人接受或投稿."
		,"div.stuffbox p:contains('WANTED')":"懸賞"
		,"div.stuffbox p:contains('REWARD')":"累積賞金"
		,"div.bcl td span:contains('Bounty Reserved')"	:"懸賞保留"
		,"div.bcl td span:contains('Claim Disputed')"	:"爭議投稿"
		,"div.bcl td span:contains('Claim Pending')"	:"等待要求"
		,"div.bcl td span:contains('Claim Accepted')"	:"投稿接受"
		,"div.bcl td span:contains('Bounty Accepted')"	:"領取賞金"
		,"td:contains('Rank A')"	:"分級 A"
		,"td:contains('Rank B')"	:"分級 B"
		,"td:contains('Rank C')"	:"分級 C"
		,"td:contains('Rank D')"	:"分級 D"
		,"td:contains('Rank E')"	:"分級 E"
		,"td:contains('Rank F')"	:"分級 F"
		,"td:contains('Unranked')"	:"未分級"
		
		,"ReplaceMode":
		[
			 ["attr","#focusme",	"placeholder"		,"填此搜尋"]
			,["html","#searchform","Bounty Type:"		,"懸賞類型："]
			,["html","#searchform","Bounty Status:"		,"懸賞狀態："]
			,["html","#searchform select.stdinput[name='t']",">All<"			,">全部<"]
			,["html","#searchform select.stdinput[name='t']",">Standard<"		,">標準<"]
			,["html","#searchform select.stdinput[name='t']",">Translation<"	,">翻譯<"]
			,["html","#searchform select.stdinput[name='t']",">Editing<"		,">補充<"]
			,["html","#searchform select.stdinput[name='s']",">All Open Bounties<"			,">開放式<"]
			,["html","#searchform select.stdinput[name='s']",">All Reserved Bounties<"		,">已保留<"]
			,["html","#searchform select.stdinput[name='s']",">All Claimed Bounties<"		,">已投稿<"]
			,["html","#searchform select.stdinput[name='s']",">All Completed Bounties<"		,">已完成<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Posted By Me<"		,">我發起的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Boosted By Me<"		,">我投資的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Accepted By Me<"	,">我接受的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Reserved For Me<"	,">我保留的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Claimed By Me<"		,">我投稿的<"]
			,["html","#searchform select.stdinput[name='s']",">Bounties Completed By Me<"	,">我完成的<"]
			,["attr","input[value='Search Bounties']"	,	"value","搜尋懸賞"]
			,["attr","input[value='Clear']"				,	"value","清除"]
			,["html","h1.ih:contains('Showing All Open Bounties posted by ')"
				,"Showing All Open Bounties posted by "
				,"顯示該會員發起的所有懸賞："]
			//懸賞榜單類
			,["html","div.stuffbox span:contains('\\< Prev 10')","Prev 10","前 10 項"]
			,["html","div.stuffbox span:contains('Next 10 \\>')","Next 10","後 10 項"]
			,["html","div.stuffbox a:contains('\\< Prev 10')"	,"Prev 10","前 10 項"]
			,["html","div.stuffbox a:contains('Next 10 \\>')"	,"Next 10","後 10 項"]
			//懸賞內容頁
			,["attr","img[title='Contact Poster']","title","跟他聯絡"]
			,["html","p[id='lb']"
				,"You have successfully upped the reward on this bounty."
				,"你已經成功加碼到此懸賞."]
			,["html","#lb p"
				,"You have rescinded your reward for this bounty."
				,"你已經成功撤銷投資."]
			,["html","div.brd td.bd2"," Credits \\+ "," <font color='RoyalBlue'>紳士幣</font> + "]
			,["html","div.brd td.bd2"," Hath"," <font color='DarkOrchid'>駭斯幣</font>"]
			,["attr","input[value='Rescind']"			,	"value","撤銷"]
			,["html","div.brd p"
				,"If you wish, you can throw in some more Credits or Hath for this reward."
				,"可以照想法加碼<font color='RoyalBlue'>紳士幣</font>或<font color='DarkOrchid'>駭斯幣</font>."]
			,["html","div.brd p"
				,"As long as the bounty has not been accepted or claimed by anyone, "
				,"<br>只要懸賞未被接受或被任何人投稿，"]
			,["html","div.brd p"
				,"you are free to rescind this additional bounty at any time."
				,"你可以隨時撤銷這個額外的獎金."]
			,["html","div.brd p"
				,"Note however that you will have no saying in whether a claim for the bounty is accepted or not."
				,"<br>請注意，懸賞投稿被接受之後就無法反悔."]
			,["html","div.brd p"
				,"If this bounty is cancelled, your funds will be automatically returned to you."
				,"<br>如果懸賞被取消，你的投資將會自動返還."]
			,["html","div.brd p"
				,"Additional rewards must be at least"
				,"額外加碼不能低於"]
			,["html","div.brd p"
				,"You can no longer add rewards for this bounty."
				,"此懸賞不可額外加碼."]
				
			,["html","div.brd p strong:contains('Credits')"	,"Credits"	,"<font color='RoyalBlue'>紳士幣</font>"]
			,["html","div.brd p strong:contains('Hath')"	,"Hath"		,"<font color='DarkOrchid'>駭斯幣</font>"]
			,["html","div.brd p strong:contains('5000C')"	,"5000C"	,"5000 <font color='RoyalBlue'>紳士幣</font>"]
			,["html","div.brd p"," or "					," 或是 "]
			,["html","div.brd p"," Less than "			," <br>少於 "]
			,["html","div.brd p"," will not bump."		," 將不會延長懸賞時間和或提升榜單排名."]
			,["html","div.brd p","You currently have"	,"你擁有"]
			,["html","div.brd p"," and "				," 和 "]
			,["html","div.brd form p"," C \\+ "				," <font color='RoyalBlue'>紳士幣</font> + "]
			,["html","div.brd form p"," Hath "				," <font color='DarkOrchid'>駭斯幣</font> "]
			
			,["attr","input[value='Submit Additional Reward']",	"value"	,"我要加碼!"]
			,["html","div.bcl td"
				,"Comments from Bounty Poster:"
				,"懸賞發起者："]
			,["html","div.bcl td"
				,"\\(No comment was given.\\)"
				,"( 無語置評 )"]
			,["html","div.bcl td"
				,"This claim has been disputed, and is pending ruling by a Bounty Moderator."
				,"此為爭議投稿，並且有待懸賞主席裁決結果."]
			,["html","div.bcl td"
				,"This claim has been accepted, and the bounty has been closed."
				,"此投稿已被接受，懸賞已關閉."]
			,["html","div.bcl td"
				,"Remaining Claim Dispute Time:"
				,"爭議投稿時間剩下："]
			,["html","div.bcl td"
				,"爭議投稿時間剩下： None"
				,"爭議投稿時間剩下： 無"]
				
			,["html","div.stuffbox div[style*='wanted.png'] p"," Credits \\+ "," <font color='RoyalBlue'>紳士幣</font> + "]
			,["html","div.stuffbox div[style*='wanted.png'] p"," Hath"," <font color='DarkOrchid'>駭斯幣</font>"]
			,["html","div.stuffbox > div:eq(1) p"
				,"Bounties that are "
				,"懸賞狀態屬於"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"Open/New"
				,"開放/新建"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"Open/Accepted"
				,"開放/接受"]
			,["html","div.stuffbox > div:eq(1) p"
				," are open to be accepted and claimed."
				,"，代表任務開放中等待獵人'<font color='darkred'><b>接下任務</b></font>'或'<font color='darkred'><b>投稿</b></font>'."]
			,["html","div.stuffbox > div:eq(1) p"
				,"If you intent to fulfill a bounty within a reasonable amount of time, "
				,"<br>如果你打算接下任務且可如期完成，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"you can optionally"
				,"你可以選擇性地先"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"accept"
				,"接受"]
			,["html","div.stuffbox > div:eq(1) p"
				,"the bounty first. After a bounty has been"
				,"這個懸賞任務. <br>當懸賞被"]
			,["html","div.stuffbox > div:eq(1) p span"
				,"claimed"
				,"投稿"]
			,["html","div.stuffbox > div:eq(1) p"
				,", the original poster of the bounty has 7 days to accept or dispute it, "
				," 後，懸賞發起人有七天時間修改任務狀態為接受或爭議宣告，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"after which a moderator will decide the outcome."
				,"<br>並交由懸賞主持人裁決."]
			,["html","div.stuffbox > div:eq(1) p"
				,"In case of a dispute, "
				,"<br>在有爭議的情況下，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"a Bounty Moderator will decide the outcome of the bounty."
				,"懸賞主持人將決定懸賞的結果."]
			,["html","div.stuffbox > div:eq(1) p"
				,"A rejected claim cannot be resubmitted, and will affect your rank."
				,"<br>被拒絕的投稿不能重新提交，而且會影響你的獵人等級."]
			,["html","div.stuffbox > div:eq(1) p"
				,"Your rank \\("
				,"你的獵人等級 ("]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\) is insufficient to accept this bounty."
				,") 不足以接下這個懸賞任務."]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank A\\)"
				,"(<font color='red'>分級 A</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank B\\)"
				,"(<font color='red'>分級 B</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank C\\)"
				,"(<font color='red'>分級 C</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank D\\)"
				,"(<font color='red'>分級 D</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank E\\)"
				,"(<font color='red'>分級 E</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Rank F\\)"
				,"(<font color='red'>分級 F</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"\\(Unranked\\)"
				,"(<font color='red'>未分級</font>)"]
			,["html","div.stuffbox > div:eq(1) p"
				,"You have not yet accepted or claimed this bounty."
				,"你還未接下這個任務或投稿至此懸賞."]
			,["attr","textarea.stdinput[name='ctext']","placeholder"
				//,"For accepting a bounty, you can enter a short comment here. "
				//+"For claiming a bounty, "
				//+"you must enter all the necessary details for where the bounty can be found."
				,"要接下懸賞任務，你可以在此填入簡短說明.\n"
				+"you must enter all the necessary details for where the bounty can be found.\n"
				+"( 上面這句我不知道怎麼翻譯啦... )\n\n"
				+"大概意思應該是以下其中一個：\n"
				+"1.你必須詳細描述投稿內容的來源\n"
				+"2.要投稿，必須在你找得到所有任務資訊的地方都要輸入必要細節.\n"
				+"3.你必須填入全部必要的詳細資訊xxxxxxx....\n"
				]
			,["html","div.stuffbox > div:eq(1) p"
				,"If you intend to claim this bounty, "
				,"如果你想投稿至此懸賞，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"make sure that all necessary URLs entered above are correct, "
				,"請確保所有必要的網址都要輸入正確，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"and that they match the Accepted Carriers of this bounty."
				,"<br>並且符合懸賞發起人所接受的條件."]
			,["html","div.stuffbox > div:eq(1) p"," and ","及"]
			,["html","div.stuffbox > div:eq(1) p"
				,"Do not, for instance, submit a link to a torrent file if that carrier is not accepted."
				,"<br>舉例，如果懸賞發起人不希望，請勿貼出BT種子連結."]
			,["html","div.stuffbox > div:eq(1) p"
				,"All information required to determine the validity of a claim MUST be posted in the claim itself."
				,"<br>所有的資訊都必須包含在投稿項目裡面."]
			,["html","div.stuffbox > div:eq(1) p"
				,"IN ORDER TO CLAIM A BOUNTY, YOU HAVE TO POST A DEPOSIT OF 1000 CREDITS."
				,"投稿時，你必須付出押金 1000 <font color='RoyalBlue'>紳士幣</font>."]
			,["html","div.stuffbox > div:eq(1) p"
				,"THIS IS RETURNED TO YOU IF THE CLAIM IS ACCEPTED, "
				,"<br>如果投稿被接受押金會退還，"]
			,["html","div.stuffbox > div:eq(1) p"
				,"BUT IF THE CLAIM IS FOUND TO BE INVALID, IT WILL BE FORFEIT."
				,"一旦投稿被發現不實，押金將會沒收."]
			,["attr","input[value='Withdraw Accept/Claim']","value",
				"撤銷接受任務或投稿"]
			,["attr","input[value='Accept Bounty']","value",
				"接下懸賞任務"]
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
		,"div.ido p.ip a:contains('Advanced Gallery/Torrent Search')":"進階畫冊 / 種子搜尋"
		,"div.ido p[style*='text-align:center; font-style:italic;']:contains('No hits found')":
			"<b>無搜尋結果</b>"
		
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
				,"請注意，無法直接在本頁增加種子."]
			,["html","div.ido p.ip"
				,"To upload torrents to this system, visit the torrent screen for a gallery."		
				,"要上傳種子到本系統，請至畫冊中的種子頁面."]
			
			 
		]
	},
	
	"gallerytorrents.php":
	{
		//多種子頁
		 "#torrentinfo span:contains('Posted:')"		:"發表時間："
		,"#torrentinfo span:contains('Size:')"			:"檔案大小："
		,"#torrentinfo span:contains('Seeds:')"			:"種子數："
		,"#torrentinfo span:contains('Peers:')"			:"人數："
		,"#torrentinfo span:contains('Downloads:')"		:"下載數："
		,"#torrentinfo span:contains('Posted:')"		:"發表時間："
		,"#torrentinfo span:contains('Uploader:')"		:"上傳者："
		,"#torrentinfo span:contains('New Torrents:')"	:"新建種子："
		
		//單種子頁
		,"#ett td:contains('Posted')"		:"發表時間"
		,"#ett td:contains('Uploader')"		:"上傳者"
		,"#ett td:contains('Size')"			:"檔案大小"
		,"#ett td:contains('Seeds')"		:"種子數"
		,"#ett td:contains('DLers')"		:"下載數"
		,"#ett td:contains('Completes')"	:"完成數"
		,"#expungeform a:contains('Vote to Expunge')"	:"投票隱藏"
		,"div.stuffbox a:contains('Close Window')"		:"關閉視窗"
		
		//編輯種子
		,"#torrentinfo td[style='font-weight:bold']:contains('Torrent Name')"	:"<br>種子名稱"
		,"#torrentinfo td[style='font-weight:bold']:contains('Comments')"		:"<br>評論註釋"
		
		,"ReplaceMode":
		[
			//多種子頁
			 ["html","#torrentinfo p"
				,"torrent was found for this gallery."
				,"個種子屬於此畫冊."]
			,["html","#torrentinfo p"
				,"torrents were found for this gallery."
				,"個種子屬於此畫冊."]
			,["attr","input[name='torrent_info']","value","種子資訊"]
			,["html","#torrentinfo div"
				,"You can add a torrent for this gallery by uploading it here."
				,"你可以在這邊上傳畫冊的種子."]
			,["html","#torrentinfo div"
				,"The maximum torrent file size is 10 MB."
				,"種子檔案最大10MB."]
			,["html","#torrentinfo div"
				,"If you are creating the torrent yourself, "
				,"如果使用你自己製作的種子，"]
			,["html","#torrentinfo div"
				,"set this as announce tracker:"
				,"請設定這個BT Tracker伺服器："]
			,["html","#torrentinfo div"
				,"Note that you have to download the finished torrent from this site after uploading for stats to be recorded."
				,"請注意，上傳種子後請重新下載種子才可以進行記錄追蹤 ( 獲得圖幣、紳士幣 )"]
			,["attr","input[name='torrent_upload']","value","上傳種子"]
			
			 
			//單種子頁
			,["html","#torrentinfo td","Personalized Torrent"		,"私人用種子 "]
			,["html","#torrentinfo td","Redistributable Torrent"	,"公開用種子 "]
			,["html","#torrentinfo td"
				,"\\(Just For You - this makes sure to record your stats\\)"	
				,"( 僅給你自己使用 - 會影響到你的統計資訊 )"]
			,["html","#torrentinfo td"
				,"\\(use if you want a file you can post or give to others\\)"	
				,"( 可公開使用分享 - 發表或給予他人 )"]
			,["html","#etd"
				,"No comments were given for this torrent."	
				,"尚未有任何本種子評論."]
			,["attr","input[value='Back to Index']"	,"value","回列表頁"]
			,["attr","input[value='Modify']"		,"style","width:100px"]
			,["attr","input[value='Modify']"		,"value","編輯種子"]
		]
	},
	
	"home.php":
	{
		 "h2:contains('Image Limits')"		:"圖片上限"
		,"h2:contains('EHTracker')"			:"BT統計表"
		,"h2:contains('Total GP Gained')"	:"圖幣總獲得"
		,"h2:contains('Toplists')"			:"全站排名"
		,"h2:contains('Moderation Power')"	:"加權指數 ( <a href='http://zh.scratchpad.wikia.com/wiki/Power' target='_Blank'>版務願力</a> )"
		,"ReplaceMode":
		[
			//https://github.com/ccloli/E-Hentai-Downloader/wiki/E%E2%88%92Hentai-Image-Viewing-Limits
			 ["html","div.homebox p","You are currently at"	,"已使用 "]
			,["html","div.homebox p"," towards a limit of "	," 至上限 "]
			,["html","div.homebox p",". This regenerates at a rate of ","。 重置頻率為每分鐘 "]
			,["html","div.homebox p"," per minute."			," 次"]
			,["html","div.homebox p","Reset Cost: "			,"重置花費："]
			,["attr","div.homebox input[name='reset']","value"	,"設定重置"]
			
			,["html","div.homebox td.c2","uploaded"		,"已上傳流量"]
			,["html","div.homebox td.c2","downloaded"	,"已下載流量"]
			,["html","div.homebox td.c2","up/down ratio","上下載比例"]
			,["html","div.homebox td.c2","torrent completes","做種完成數"]
			,["html","div.homebox td.c2","gallery completes","畫冊完成數"]
			,["html","div.homebox td.c2","seedmins"			,"做種時間(分鐘)"]
			,["html","div.homebox div a","Show My Torrents"	,"顯示我的種子"]
			,["html","div.homebox p"
				,"If you misplace any of your personalized torrents, hit the button below to reset your key."	
				,"如果不小心外流你的私人種子，請點選下方按鈕重置種子金鑰."]
			,["html","div.homebox p"
				,"This will immediately invalidate all of your personalized torrents in play."	
				,"這將會馬上撤銷當下所有使用中的種子金鑰."]
			,["html","div.homebox p","Your current key is:"	,"種子金鑰："]
			,["attp","div.homebox input[name='reset_torrent_key']","value"		,"Reset Torrent Key","重置金鑰"]
			,["attr","div.homebox input[name='reset_torrent_key']","onclick"	,"return confirm('確定要重置種子金鑰?? 此動作不可回復!!')"]
			
			,["html","div.homebox td","GP from gallery visits"		,"<font color='green'>圖幣</font>來自畫冊瀏覽量"]
			,["html","div.homebox td","GP from torrent completions"	,"<font color='green'>圖幣</font>來自做種完成數"]
			,["html","div.homebox td","GP from archive downloads"	,"<font color='green'>圖幣</font>來自打包下載量"]
			,["html","div.homebox td","GP from Hentai@Home"			,"<font color='green'>圖幣</font>來自於紳士之家"]
			
			,["html","div.homebox td","You are currently:"		,"當前排名："]
			,["html","div.homebox td","on the "					,"名位於 "]
			,["html","div.homebox td"," toplist"				," 排行榜"]
			//EHG Toplists
			,["html","div.homebox td a","Hentai@Home "			,"紳士之家"]
			,["html","div.homebox td a","Galleries "			,"畫冊"]
			,["html","div.homebox td a","Uploader "				,"上傳"]
			,["html","div.homebox td a","Tagging "				,"標籤"]
			,["html","div.homebox td a","EHTracker  "			,"BT種子"]
			,["html","div.homebox td a","Cleanup "				,"清理"]
			,["html","div.homebox td a","Rating &amp; Reviewing "	,"評星\&回顧"]
			,["html","div.homebox td a","All-Time"				,"時間總計"]
			,["html","div.homebox td a","Past Year"				,"去年累計"]
			,["html","div.homebox td a","Past Month"			,"上月統計"]
			,["html","div.homebox td a","Yesterday"				,"昨天截止"]
			
			,["html","div.homebox td div","Current Moderation Power","當前總加權指數"]
			,["html","div.homebox td","Base"			,"基礎"]
			,["html","div.homebox td","Awards"			,"賞賚勳章"]
			,["html","div.homebox td","Tagging"			,"添加標籤"]
			,["html","div.homebox td","Level"			,"《HentaiVerse》等級"]
			,["html","div.homebox td","Donations"		,"捐款加權"]
			,["html","div.homebox td","Forum Activity"	,"論壇積極度"]
			,["html","div.homebox td","Uploads/H@H"		,"上傳/紳士家"]
			,["html","div.homebox td","Account Age"		,"帳號年資"]
			,["html","div.homebox td","(capped to 25)"	,"封頂上限25"]
		]
		
	},
	"stats.php":
	{
		//畫冊統計類：
		 "div.stuffbox th:contains('Ranking')"	:"排名"
		,"div.stuffbox th:contains('Score')"	:"评分"
		,"div.stuffbox a:contains('Galleries All-Time')"			:"畫冊時間總計"
		,"div.stuffbox a:contains('Galleries Past Year')"			:"畫冊去年統計"
		,"div.stuffbox a:contains('Galleries Past Month')"			:"畫冊上個月計"
		,"div.stuffbox a:contains('Galleries Yesterday')"			:"畫冊昨天截止"
		,"div.stuffbox td:contains('Not currently in Top 1000')"	:"不在前 1千名內"
		,"div.stuffbox td:contains('The number of total visits on your galleries.')":
			"畫冊遊客數量"
		,"div.stuffbox p a:contains('Back To Gallery')":"回到畫冊"
		
		,"ReplaceMode":
		[
			 ["html","div.stuffbox p","Visitor Statistics"	,"來訪量統計表格"]
			,["html","div.stuffbox"	,"Visits"				,"來訪"]
			,["html","div.stuffbox"	,"Hits"					,"點擊"]
			
			,["html","div.stuffbox"	,"Yearly Stats"			,"年度統計"]
			,["html","div.stuffbox"	,"Last 12 Months"		,"12個月內"]
			,["html","div.stuffbox"	,"Daily Stats"			,"每日統計"]
			
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
			
			,["html","div.stuffbox td","The number of total visits on your galleries."			,"畫冊遊客數量"]
			,["html","div.stuffbox td","The number of total image accesses on your galleries."	,"畫冊圖片瀏覽量"]
			//畫冊統計類：
			,["html","div.stuffbox p"
				,"This gallery has had a total of"
				,"此畫冊共有"]
			,["html","div.stuffbox p"	
				,"visit\\(s\\)."
				,"個訪客."]
		]
		
	},
	
	"uconfig.php":
	{
		 "#msg:contains('Settings were updated')"		:"<font color='Green'><b>設定已更新完畢</b></font>"
		,"#outer h1:contains('Settings')"				:"個人設定"
		,"#outer h2:contains('Image Load Settings')"	:"圖片載入"
		,"#outer h2:contains('Image Size Settings')"	:"圖片大小"
		,"#outer h2:contains('Gallery Name Display')"	:"畫冊名稱"
		,"#outer h2:contains('Archiver Settings')"		:"打包設定"
		,"#outer h2:contains('Front Page Settings')"	:"首頁設定"
		,"#outer h2:contains('Favorites')"				:"我的收藏"
		,"#outer h2:contains('Ratings')"				:"評分顏色"
		,"#outer h2:contains('Tag Namespaces')"			:"標記命名"
		,"#outer h2:contains('Excluded Languages')"		:"隱藏語系"
		,"#outer h2:contains('Search Result Count')"	:"搜尋數量"
		,"#outer h2:contains('Thumbnail Settings')"		:"縮圖預覽"
		,"#outer h2:contains('Gallery Comments')"		:"畫冊註釋"
		,"#outer h2:contains('Gallery Tags')"			:"畫冊標記"
		,"#outer h2:contains('Gallery Page Numbering')"	:"預覽數量"
		,"#outer h2:contains('Hentai@Home Proxy')"		:"紳士之家"
		,"#outer h2:contains('Tag Flagging')"			:"標記旗幟"
		,"#outer h2:contains('Advertisements')"			:"廣告設定"
		,"#outer h2:contains('Original Images')"		:"原始圖片"
		,"#outer h2:contains('Multi-Page Viewer')"		:"多圖瀏覽"
		//Image Load Settings
		,"label[for='uh_y']" :"同意 (建議)"
		,"label[for='uh_n']" :"不同意 (你將無法一次瀏覽多頁，請只有在出問題的時候啟動此功能.)"
		//Image Size Settings
		,"label[for='xr_0']" :"自動"
		//Gallery Name Display
		,"label[for='tl_r']" :"預設標題"
		,"label[for='tl_j']" :"日文標題 ( 如果可以使用 )"
		//Archiver Settings
		,"label[for='ar_0']" :"手動付費，手動下載 (預設)"
		,"label[for='ar_2']" :"手動付費，自動下載"
		,"label[for='ar_1']" :"自動付費，手動下載"
		,"label[for='ar_3']" :"自動付費，自動下載"
		//Front Page Settings
		,"label[for='dm_l']" :"列表模式"
		,"label[for='dm_t']" :"縮圖模式"
		,"label[for='prn_y']":"顯示"
		,"label[for='prn_n']":"隱藏"
		//Favorites
		,"label[for='fs_p']" :"排序：以最新的畫冊更新時間為準"
		,"label[for='fs_f']" :"排序：以收藏時間為準"
		//Tag Namespaces
		,"label[for='xns_1']":"reclass<br>　(重分類)"
		,"label[for='xns_2']":"language<br>　( 語　系 )"
		,"label[for='xns_3']":"parody<br>　( 滑稽模仿 )"
		,"label[for='xns_4']":"character<br>　( 角　色 )"
		,"label[for='xns_5']":"group<br>　( 分　組 )"
		,"label[for='xns_6']":"artist<br>　( 畫　師 )"
		,"label[for='xns_7']":"male<br>　( 男　性 )"
		,"label[for='xns_8']":"female<br>　( 女　性 )"
		//Search Result Count
		,"label[for='rc_0']":"25 個項目"
		,"label[for='rc_1']":"50 個項目"
		,"label[for='rc_2']":"100 個項目"
		,"label[for='rc_3']":"200 個項目"
		//Thumbnail Settings
		,"label[for='lt_m']":"滑鼠停留時 ( 網頁讀取快，滑鼠停留讀取縮圖時會有點遲滯 )"
		,"label[for='lt_p']":"網頁讀取時 ( 讀取網頁慢，滑鼠停留讀取縮圖無延遲 )"
		,"label[for='ts_m']":"普通"
		,"label[for='ts_l']":"較大"
		//Gallery Comments
		,"label[for='cs_a']":"舊的優先"
		,"label[for='cs_d']":"新的優先"
		,"label[for='cs_s']":"高分優先"
		,"label[for='sc_0']":"滑鼠停留在評分上或點擊時"
		,"label[for='sc_1']":"任何時候皆顯示"
		//Gallery Tags
		,"label[for='to_a']":"按字母順序"
		,"label[for='to_p']":"按輸入順序"
		//Gallery Page Numbering
		,"label[for='pn_0']":"不"
		,"label[for='pn_1']":"要"
		//Tag Flagging
		,"label[for='tf_n']":"不"
		,"label[for='tf_y']":"要"
		,"label:contains('Hide')":"隱藏"
		//Advertisements
		,"label[for='sa_y']":"當然要啦"
		,"label[for='sa_n']":"絕對不要"
		//Original Images
		,"label[for='oi_n']":"不要"
		,"label[for='oi_y']":"好阿"
		//Multi-Page Viewer
		,"label[for='qb_n']":"不要"
		,"label[for='qb_y']":"要要"
		,"label[for='ms_n']":"往左對齊，只有圖片大於瀏覽器寬度才縮略" //Align left; Only scale if image is larger than browser width
		,"label[for='ms_c']":"中間對齊，只有圖片大於瀏覽器寬度才縮略" //Align center; Only scale if image is larger than browser width
		,"label[for='ms_y']":"中間對齊，隨時縮略圖片適應瀏覽器寬度"   //Align center; Always scale images to fit browser width
		,"label[for='mt_n']":"顯示"
		,"label[for='mt_y']":"隱藏"
		
		,"ReplaceMode":
		[
			//Image Load Settings
			 ["html","div.optmain"
				,"Do you wish to load images through the Hentai@Home Network, if available?"		
				,"當紳士之家網路可使用時是否使用其網路載入圖片??"]
			//Image Size Settings
			,["html","div.optmain p"
				,"Normally, images are resampled to 1280 pixels of horizontal resolution for online viewing."
				,"通常來說，為了線上瀏覽圖片會壓縮至垂直高度1280像素大小. "]
			,["html","div.optmain p"
				," You can alternatively select one of the following resample resolutions."
				,"你也可以自己選擇."]
			,["html","div.optmain p"
				,"To avoid murdering the staging servers, "
				,"但是為了避免負載過高，"]
			,["html","div.optmain p"
				,"resolutions above 1280x are temporarily restricted to donators, "
				,"高於1280像素將暫時只供給於贊助者、特殊功能，"]
			,["html","div.optmain p"
				,"people with any hath perk, and people with a UID below 3,000,000."
				,"還有會員註冊排行三百萬內的會員."]
			//Gallery Name Display
			,["html","div.optmain p"
				,"While the site will automatically scale down images to fit your screen width, "
				,"<p>閱覽時圖片會縮略成適合螢幕寬度，"]
			,["html","div.optmain p"
				,"you can also manually restrict the maximum display size of an image. "
				,"你也可以手動限制圖片最大顯示大小.</p>"]
			,["html","div.optmain p"
				,"Like the automatic scaling, this does not resample the image, "
				,"這是線上圖片自動縮略，不是壓縮圖片，"]
			,["html","div.optmain p"
				,"as the resizing is done browser-side."
				,"會在瀏覽器中這一端完成."]
			,["html","div.optmain p"
				,"(0 = no limit)"
				," 0 = 不做限制 "]
			,["html","div.optsub td","Horizontal:"	,"水平："]
			,["html","div.optsub td","Vertical:"	,"垂直："]
			,["html","div.optsub td","pixels"		,"像素"]
			//Gallery Name Display
			,["html","div.optmain p"
				,"Many galleries have both an English/Romanized title and a title in Japanese script. "
				,"很多畫冊會同時具有英文及日文標題，"]
			,["html","div.optmain p"
				,"Which gallery name would you like to see as default?"
				,"你想要預設看到哪一種??"]
			//Archiver Settings
			,["html","div.optmain p"
				,"The default behavior for the Archiver is to confirm the \"cost\" for downloading an archive, "
				,"選擇付費打包下載畫冊預設行為，"]
			,["html","div.optmain p"
				,"then present a link that can be clicked or copied elsewhere. You can change this behavior here."
				,"然後顯示下載連結可以點選或在別處下載，你可以在這邊改變確認與付費方式。"]
			//Front Page Settings
			,["html","div.optmain p"
				,"Which display mode would you like to use on the front and search pages?"
				,"首頁和搜尋頁面要使用哪一種顯示模式?"]
			,["html","div.optmain p"
				,"Would you like the Popular Right Now pane to be displayed below the most recently added galleries on the front page?"
				,"是否要在首頁顯示熱門畫冊??"]
			,["html","div.optmain p"
				,"What categories would you like to view as default on the front page?"
				,"首頁預設要顯示什麼類別的畫冊??"]
			//Favorites
			,["html","div.optmain p"
				,"Here you can choose and rename your favorite categories."
				,"這裡可以選擇和重新命名收藏類別."]
			,["html","div.optmain p"
				,"You can also select your default sort order for galleries on your favorites page. "
				,"<p>你也可以選擇收藏中預設的畫冊排序.</p>"]
			,["html","div.optmain p"
				,"Note that favorites added prior to the March 2016 revamp did not store a timestamp, "
				,"請注意，在2016三月改版之前加入收藏夾的畫冊並未儲存時間戳，"]
			,["html","div.optmain p"
				,"and will use the gallery posted time regardless of this setting."
				,"會以畫冊發佈時間代替."]
			//Ratings
			,["html","div.optmain p"
				,"By default, galleries that you have rated will appear with red stars for ratings of 2 stars and below, "
				,"預設中，被你評分的畫冊，2星以下顯示紅色，"]
			,["html","div.optmain p"
				,"green for ratings between 2.5 and 4 stars, and blue for ratings of 4.5 or 5 stars."
				,"2.5星到4星顯示綠色，4.5到5星顯示藍色."]
			,["html","div.optmain p"
				,"You can customize this by entering your desired color combination below."
				,"你可以在下面自訂想要的顏色組合."]
			,["html","div.optmain #ru2"
				,"Each letter represents one star. "
				,"每一個字元代表一星. "]
			,["html","div.optmain #ru2"
				,"The default RRGGB means R\\(ed\\) for the first and second star, G\\(reen\\) for the third and fourth, "
				,"<br>預設RRGGB代表著R為紅色，G為綠色，"]
			,["html","div.optmain #ru2"
				,"and B\\(lue\\) for the fifth. You can also use \\(Y\\)ellow for the normal stars."
				,"B為藍色. <br>你也可以使用黃色Y."]
			,["html","div.optmain #ru2"
				,"Any five-letter combination of R, G, B and Y will work."
				,"<br>任何五個字元皆可用：R、G、B、Y."]
			//Tag Namespaces
			,["html","div.optmain p"
				,"If you want to exclude certain namespaces from a default tag search, "
				,"如果你想要在預設搜尋排除一些標記的畫冊，"]
			,["html","div.optmain p"
				,"you can check those below."
				,"請注意下面."]
			,["html","div.optmain p"
				,"Note that this does not prevent galleries with tags in these namespaces from appearing, "
				,"<br>這並不會完全隱藏相應標記的畫冊，"]
			,["html","div.optmain p"
				,"it just makes it so that when searching tags, it will forego those namespaces."
				,"這只會在搜尋時隱藏."]
			//Excluded Languages
			,["html","div.optmain p"
				,"If you wish to hide galleries in certain languages from the gallery list and searches, "
				,"如果你希望搜尋時隱藏某些語言的畫冊，"]
			,["html","div.optmain p"
				,"select them from the list below."
				,"請在下面列表勾選."]
			,["html","div.optmain p"
				,"Note that matching galleries will never appear regardless of your search query."
				,"請注意那些符合條件的畫冊將完全不會顯示在搜尋中."]
			,["html","div.optmain #xlasel th","Original"	,"原文本"]
			,["html","div.optmain #xlasel th","Translated"	,"翻译本"]
			,["html","div.optmain #xlasel th","Rewrite"		,"重制版"]
			,["html","div.optmain #xlasel th","All"			,"全部"]
			
			,["html","div.optmain #xlasel td.xla","Japanese"	,"日文"]
			,["html","div.optmain #xlasel td.xla","English"		,"英文"]
			,["html","div.optmain #xlasel td.xla","Chinese"		,"中文"]
			,["html","div.optmain #xlasel td.xla","Dutch"		,"荷兰语"]
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
				,"要顯示每頁多少項目在首頁、搜尋、種子網頁上??"]
			,["html","div.optmain p"
				,"\\(Hath Perk: Paging Enlargement Required\\)"
				,"( 特殊功能需求：Paging Enlargement - 版面擴張 )"]
			//Thumbnail Settings
			,["html","div.optmain p"
				,"How would you like the mouse-over thumbnails on the front page to load when using List Mode?"
				,"請選擇首頁使用列表模式滑鼠放在項目上載入預覽圖片的時機"]
			,["html","div.optmain p"
				,"You can set a default thumbnail configuration for all galleries you visit."
				,"你可以設定預設的縮圖數量與大小."]
			,["html","div.optmain div.optsub td"
				,"Size: "
				,"大小"]
			,["html","div.optmain div.optsub td"
				,"Rows:"
				,"行數"]
			//Gallery Comments
			,["html","div.optmain p"
				,"Sort order for gallery comments:"
				,"畫冊註釋的排序："]
			,["html","div.optmain p"
				,"Show gallery comment votes:"
				,"顯示畫冊註釋的評價："]
			//Gallery Tags
			,["html","div.optmain p"
				,"Sort order for gallery tags:"
				,"畫冊標記的順序："]
			//Gallery Page Numbering
			,["html","div.optmain p"
				,"Show gallery page numbers:"
				,"顯示畫冊內圖片的頁數編號"]
			//Hentai@Home Proxy
			,["html","div.optmain p"
				,"Set the field below to the IP:Port of a proxy-enabled Hentai@Home Client to load all images through this client, "
				,"下面輸入紳士之家的網路IP跟通訊埠，所有圖片都會通過此客戶端連線，"]
			,["html","div.optmain p"
				,"or leave blank to not use one."
				,"或是留空不使用."]
			,["html","div.optmain p"
				,"If you are running the client on the same PC you browse from, you can use 127.0.0.1:port."
				,"如果客戶端跟你的網頁在同台電腦上，網路IP可以填入 127.0.0.1:通訊埠."]
			,["html","div.optmain p"
				,"You can also use private network IPs for local proxies, for example 10.0.0.1:port."
				,"你也可以使用本地端私人的區域網路IP，例如 10.0.0.1:通訊埠."]
			,["html","div.optmain p"
				,"In the default H@H setting, the client must be on your local computer or local network in order to allow proxy connections."
				,"但是紳士之家的預設值，客戶端必須是同台電腦或同區域網路才可准許連線  ( 或更改設定但不建議 )."]
			,["html","div.optmain div.optsub table.hathproxy th"
				,"IP Address:Port"
				,"網路IP地址:通訊埠"]
			,["html","div.optmain div.optsub table.hathproxy th"
				,"Passkey \\(Optional\\)"
				,"連線金鑰 (選用) "]
			//Tag Flagging
			,["html","div.optmain p"
				,"Enable Tag Flagging?"
				,"是否在搜尋頁顯示標籤旗幟??  "]
			,["html","div.optmain p"
				,"\\(Bronze Star or Hath Perk: Tag Flagging Required\\)"
				,"( 必須擁有青銅之星或特殊功能：Tag Flagging - 首頁標籤旗號 )"]
			,["html","div.optmain p"
				,"Tags entered below will be flagged on the index/search pages."
				,"下面輸入的標記都會顯示在首頁、搜尋頁面上，"]
			,["html","div.optmain p"
				,"Tags should be separated by a comma. You can add up to "
				,"標記可用逗號分隔，你最多可使用 "]
			,["html","div.optmain p"
				,"tags per flag."
				," 個標記"
				+"<br>旗幟旁邊的隱藏勾選後，縮圖會隱藏."]
			//Advertisements
			,["html","div.optmain p"
				,"Would you like to browse with advertisements enabled?"
				,"是否要顯示廣告???"]
			,["html","div.optmain p"
				,"\\(Bronze Star or Hath Perk: Ads-Be-Gone Required\\)"
				,"( 必須擁有青銅之星或特殊功能：Ads-Be-Gone - 去去廣告滾開 )"]
			//Original Images
			,["html","div.optmain p"
				,"Always display the original images instead of the resampled versions?"
				,"是否載入原始圖片而不是使用壓縮圖片???"]
			,["html","div.optmain p"
				,"\\(Silver Star or Hath Perk: Source Nexus Required\\)"
				,"( 必須擁有白銀之星或特殊功能：Source Nexus - 原始人用圖片 )"]
			//Multi-Page Viewer
			,["html","div.optmain p"
				,"Enable the Multi-Page Viewer\\? \\(Gold Star or Hath Perk: Multi-Page Viewer Required\\)"
				,"是否使用多圖快速閱覽??? ( 必須擁有黃金之星或特殊功能：Multi-Page Viewer - 多頁快速閱覽 )"]
			,["html","div.optmain a[href*='mpv']:contains('demo')"		,"demo","範例網頁"]
			,["html","div.optmain p","Multi-Page Viewer Display Style:"	,"多頁瀏覽顯示樣式："]
			,["html","div.optmain p","Multi-Page Viewer Thumbnail Pane:","多頁瀏覽顯示縮圖區："]
			,["attr","input[value='Apply']","value","送出"]
		]
	},
	
	"hathperks.php":
	{
		 "div.stuffbox h1:contains('Hath Perks')"	:
			"駭斯幣(Hath)：<a href='https://youtu.be/mJsnsKs5ZHQ' target='_bank'>特異功能</a>"
		 
		,"div.stuffbox a[href*='exchange.php?type=hath']:contains('Hath Exchange')"	:"Hath Exchange ( 駭斯市集 ) "
		,"div.stuffbox a[href*='bitcoin.php']:contains('Donation Screen')"			:"Donation Screen ( 捐款網頁 ) "
		 
		,"div.stuffbox th:contains('Hath Perk')"	:"功能名稱"
		,"div.stuffbox th:contains('Description')"	:"功能說明"
		,"div.stuffbox p:contains('Obtained')"		:"已購買"
		,"div.stuffbox td a:contains('demo')"		:"範例網頁"
		
		,"div.stuffbox span:contains('Free with a $20 donation.')" :"捐款 $20  以上自動免費 ( 如已購買的駭斯幣將會退還 )"
		,"div.stuffbox span:contains('Free with a $50 donation.')" :"捐款 $50  以上自動免費 ( 如已購買的駭斯幣將會退還 )"
		,"div.stuffbox span:contains('Free with a $100 donation.')":"捐款 $100 以上自動免費 ( 如已購買的駭斯幣將會退還 )"
		
		,"td:contains('Ads-Be-Gone')"			:"Ads-Be-Gone<br>"				+"去去廣告滾開"
		,"td:contains('Tag Flagging')"			:"Tag Flagging<br>"				+"首頁標籤旗號"
		,"td:contains('Source Nexus')"			:"Source Nexus<br>"				+"原始人用圖片"
		,"td:contains('Multi-Page Viewer')"		:"Multi-Page Viewer<br>"		+"多頁快速閱覽"
		,"td:contains('More Thumbs')"			:"More Thumbs<br>"				+"縮圖不夠不夠"
		,"td:contains('Thumbs Up')"				:"More Thumbs<br>"				+"縮略圖增長中"
		,"td:contains('All Thumbs')"			:"All Thumbs<br>"				+"縮圖還是不夠"
		,"td:contains('More Pages')"			:"More Page<br>"				+"頁數抓狂翻桌"
		,"td:contains('Lots of Pages')"			:"Lots of Pages<br>"			+"需要更多頁數"
		,"td:contains('Too Many Pages')"		:"Too Many Pages<br>"			+"頁數氾濫啦！"
		,"td:contains('More Favorite Notes I')"	:"More Favorite Notes I<br>"	+"瘋狂註記收藏家1"
		,"td:contains('More Favorite Notes II')":"More Favorite Notes II<br>"	+"抓狂註記收藏家2"
		,"td:contains('Paging Enlargement I')"	:"Paging Enlargement I<br>"		+"版面擴張手術1 - 蓋世神醫"
		,"td:contains('Paging Enlargement II')"	:"Paging Enlargement II<br>"	+"版面擴張手術2 - 超神傑克"
		,"td:contains('Paging Enlargement III')":"Paging Enlargement III<br>"	+"版面擴張手術3 - 你是傳奇"
		//《HentaiVerse》額外能力
		,"td:contains('Postage Paid')"			:"Postage Paid<br>"				+"郵資清償專家"
		,"td:contains('Vigorous Vitality')"		:"Vigorous Vitality<br>"		+"生機勃勃"
		,"td:contains('Effluent Ether')"		:"Effluent Ether<br>"			+"溢流以太"
		,"td:contains('Suffusive Spirit')"		:"Suffusive Spirit<br>"			+"心靈堅強"
		,"td:contains('Resplendent Regeneration')"	:"Resplendent Regeneration<br>"			+"輝煌再起"
		,"td:contains('Enigma Energizer')"		:"Enigma Energizer<br>"			+"謎之勁量"
		,"td:contains('Yakety Sax')"			:"Yakety Sax<br>"				+"葉克蒂·薩克斯"
		,"td:contains('Soul Catcher')"			:"Soul Catcher<br>"				+"靈魂捕手"
		,"td:contains('Extra Strength Formula')":"Extra Strength Formula<br>"	+"特強配方"
		//,"td:contains('Thats Good Eatin')"	:"That's Good Eatin'<br>"		+"這倒是挺好吃的！"
		,"td:contains('Coupon Clipper')"		:"Coupon Clipper<br>"			+"食利者"
		,"td:contains('Long Gone Before Daylight')":"Long Gone Before Daylight<br>"	+"黎明之前"
		,"td:contains('Dark Descent')"			:"Dark Descent<br>"				+"黑暗後裔"
		,"td:contains('Eminent Elementalist')"	:"Eminent Elementalist<br>"		+"元素大師"
		,"td:contains('Divine Warmage')"		:"Divine Warmage<br>"			+"聖戰法師"
		,"td:contains('Death and Decay')"		:"Death and Decay<br>"			+"死亡凋零"
		,"td:contains('Evil Enchantress')"		:"Evil Enchantress<br>"			+"邪惡女巫"
		,"td:contains('Force of Nature')"		:"Force of Nature<br>"			+"自然之力"
		,"td:contains('Manehattan Project')"	:"Manehattan Project<br>"		+"馬哈頓計劃"
		,"td:contains('Follower of Snowflake')"	:"Follower of Snowflake<br>"	+"雪花的信徒"
		,"td:contains('Thinking Cap')"			:"Thinking Cap<br>"				+"深思"
		,"td:contains('Mentats')"				:"Mentats<br>"					+"門塔特"
		,"td:contains('Learning Chip')"			:"Learning Chip<br>"			+"學習晶片"
		,"td:contains('Cybernetic Implants')"	:"Cybernetic Implants<br>"		+"神經植入物"
		,"td:contains('Innate Arcana I')"		:"Innate Arcana I<br>"			+"天賦奧術"
		,"td:contains('Crystarium I')"			:"Crystarium I<br>"				+"水晶礦脈"
		,"td:contains('Tokenizer I')"			:"Tokenizer I<br>"				+"令牌技師"
		,"td:contains('Repair Bear Mk.1')"		:"Repair Bear Mk.1<br>"			+"修理熊 Mk.1"
		,"td:contains('Repair Bear Mk.2')"		:"Repair Bear Mk.2<br>"			+"修理熊 Mk.2"
		,"td:contains('Repair Bear Mk.3')"		:"Repair Bear Mk.3<br>"			+"修理熊 Mk.3"
		,"td:contains('Repair Bear Mk.4')"		:"Repair Bear Mk.4<br>"			+"修理熊 Mk.4"
		,"td:contains('Damon Duality')"			:"Damon Duality<br>"			+"雙重守護精靈"
		,"td:contains('Free-Flowing Dust')"		:"Free-Flowing Dust<br>"		+"自由流動的塵"
		,"td:contains('Grace and Knowledge')"	:"Grace and Knowledge<br>"		+"恩典和知識"
		,"td:contains('Golden Compasses')"		:"Golden Compasses<br>"			+"黃金羅盤"
		,"td:contains('Asahattr')"				:"Asahattr<br>"					+"伊瑟艾特"
		
		,"ReplaceMode":
		[	
			 ["attr","input[name='purchase']","value","付費購買"]
			 
			,["html","div.stuffbox p"
				,"By running the Hentai@Home client, you will over time gain special bonus points known as "
				,"執行 Hentai@Home 紳士之家客戶端，將會隨著時間獲得特殊加分："]
			,["html","div.stuffbox p"
				,". These are rewards for people who help keeping this site free, "
				," 駭斯(一種幣值). <br>這些是人們免費幫助網站的獎勵，"]
			,["html","div.stuffbox p"
				,"fast and responsive by donating bandwidth and computer resources, and can be exchanged here for "
				,"付出網路頻寬與電腦資源快速響應網站效能，並且可用來交換："]
			,["html","div.stuffbox"
				,'<span style="font-style:italic">Hath Perks</span>'
				,'<span style="font-style:italic">Hath Perks (特殊功能) </span>']
			,["html","div.stuffbox p"
				,", which grant beneficial effects on E-Hentai Galleries and in the HentaiVerse."
				,"<br>讓使用者在此站享受更尊貴的體驗而設立的各種增強功能，包括HentaiVerse小遊戲在內."]
				
			,["html","div.stuffbox p"
				,"If running H@H is not an option, you can also you can exchange Credits for Hath at the "
				,"如果不想使用 Hentai@Home 紳士之家，你也可以使用 Credits (紳士幣/信用點) 購買交換，就在 "]
				
			,["html","div.stuffbox p"
				,"While the Hath Perks for the HentaiVerse cannot be obtained in any other way, "
				,"對於HentaiVerse所使用的特殊功能並不能從其他管道獲取，"]
			,["html","div.stuffbox p"
				,"most of the ones that are specific for Galleries will also get unlocked by making a donation on the "
				,"部分特定的畫冊功能將會通過捐款贊助而解鎖："]
			,["html","div.stuffbox p"
				,". These will be refunded if you buy them for Hath, and later make a qualifying donation."
				,". <br>如果使用者獲得捐款資格(星星)前就已購入這些能力，那麼已花費的 <font color='DarkOrchid'>駭斯</font> 會稍後退還.<br>"]
			,["html","div.stuffbox p"
				,'There is also an option to "adopt" H@H clients that will grant you Hath over time as if you were running it yourself.'
				,'當然也可以通過自己 "營運" 紳士之家客戶端並獲得相應的 Hath 駭斯幣.<br><br>'
				+"本條目部分參考自<a href='http://zh.scratchpad.wikia.com/wiki/Hath_Perks?variant=zh-tw'>圍紀實驗室 ( Hath Perks )</a><br>"]
			
			
			,["html","div.stuffbox p:contains('You currently have')","You currently have","現在擁有"]
			,["html","td","That's Good Eatin'"	,"That's Good Eatin'<br>"		+"這倒是挺好吃的！"]
			//Ads-Be-Gone
			,["html","td"
				,"Unlocks the display ads toggle for E-Hentai Galleries on the User Settings page."
				,"解鎖E紳士設定頁的廣告顯示開關. "]
			,["html","td"
				,"This will allow you to browse E-Hentai Galleries sans ads, and still retain your conscience."
				,"此功能讓你無廣告瀏覽E紳士圖庫，並且仍保留你的良心。"]
			//Tag Flagging
			,["html","td"
				,"Allows you to specify up to three groups of good and bad tags. "
				,"可讓你指定多達三組好與壞標籤. "]
			,["html","td"
				,"Galleries containing these tags are automatically flagged as such on the index and search pages."
				,"包含指定標籤的圖庫會自動打出旗號，諸如目錄和搜尋頁面."]
			//Source Nexus
			,["html","td"
				,"Unlocks the Original Images functionality on E-Hentai Galleries."
				,"解鎖E紳士圖庫的原圖顯示功能."]
			,["html","td"
				,"This allows you to browse the original, non-resampled version of a gallery directly."
				,"此功能讓你直接瀏覽原始圖片，而非重新取樣壓縮版本的圖庫。"]
			//Multi-Page Viewer
			,["html","td"
				,"Unlocks the Multi-Page Viewer function on E-Hentai Galleries."
				,"解鎖E紳士圖庫的多頁快速閱讀器功能."]
			,["html","td"
				,"This allows you to view all images from a gallery on one page."
				,"此功能讓你在單一頁面裡檢視一組圖庫裡的所有圖片."]
			//More Thumbs
			,["html","td"
				,"Increases the maximum number of thumbnail rows to 10."
				,"增加縮圖列（Thumb Rows）的最大列數至 10 列."]
			//Thumbs Up
			,["html","td"
				,"Further increases the maximum number of thumbnail rows to 20."
				,"進一步增加縮圖列的最大列數至 20 列."]
			//All Thumbs
			,["html","td"
				,"Further increases the maximum number of thumbnail rows to 40."
				,"進一步增加縮圖列的最大列數至 40 列."]
			//More Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of two."
				,"提高你所有可檢視頁數上限為兩倍."]
			//Lots of Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of five."
				,"提高你所有可檢視頁數上限為五倍."]
			//Too Many Pages
			,["html","td"
				,"Increases all limits on how many pages you can view by a factor of ten."
				,"提高你所有可檢視頁數上限為十倍."]
			//More Favorite Notes I
			,["html","td"
				,"Increases the number of favorite note slots to 10000."
				,"我的收藏註記（Favorites Note）欄數擴增至 1萬 個."]
			//More Favorite Notes II
			,["html","td"
				,"Increases the number of favorite note slots to 25000."
				,"我的收藏註記（Favorites Note）欄數擴增至 2萬5 個."]
			//Paging Enlargement I
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 50."
				,"增加目錄/搜尋頁面每一頁的顯示項目數至 50 個."]
			//Paging Enlargement II
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 100."
				,"增加目錄/搜尋頁面每一頁的顯示項目數至 100 個."]
			//Paging Enlargement III
			,["html","td"
				,"Increases the number of results you can show per page on the index, search and torrent pages to 200."
				,"增加目錄/搜尋頁面每一頁的顯示項目數至 200 個."]
			//Postage Paid
			,["html","td"
				,"You no longer have to pay postage or CoD fees on messages sent through MoogleMail."
				,"你使用<a href='http://zh.scratchpad.wikia.com/wiki/MoogleMail'>莫古利郵務</a>可免收郵資和貨到付款手續費。"]
			//Vigorous Vitality
			,["html","td"
				,"Increases your base health by 10%."
				,"增加你的基礎生命值 10%."]
			//Effluent Ether
			,["html","td"
				,"Increases your base mana by 10%."
				,"增加你的基礎魔力值 10%."]
			//Suffusive Spirit
			,["html","td"
				,"Increases your base spirit by 10%."
				,"增加你的基礎靈力值 10%."]
			//Resplendent Regeneration
			,["html","td"
				,"Increases both your in-combat and out-of-combat regeneration by 50%."
				,"增強你的<a href='http://zh.scratchpad.wikia.com/wiki/Battles#.E4.BD.9C.E6.88.B0'>戰鬥</a>中與戰鬥外的<a href='http://zh.scratchpad.wikia.com/wiki/Character_Stats#Regeneration_Rates'>再生能力</a> 50%."]
			//Enigma Energizer
			,["html","td"
				,"Doubles the bonus from the riddlemaster, and increases duration to 50 turns."
				,"加倍<a href='http://zh.scratchpad.wikia.com/wiki/RiddleMaster'>御謎士</a>的獎勵，持續回合數增加至 50 回合."]
			//Yakety Sax
			,["html","td"
				,"Monsters will never catch you when fleeing."
				,"你<a href='http://zh.scratchpad.wikia.com/wiki/Skills#Innate_Skills'>逃跑</a>時不會被怪物抓到."]
			//Soul Catcher
			,["html","td"
				,"Get ten free soul fragments every dawn event."
				,"每次<a href='http://zh.scratchpad.wikia.com/wiki/Dawn_of_a_New_Day'>黎明事件</a>可得到 10 片免費的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Soul_Fragments'>靈魂斷片</a>"]
			,["html","td"
				,"Note that it will not tell you that you got them, they are silently added to your inventory."
				," 偷偷的增加到你的庫存裡. "]
			//Extra Strength Formula
			,["html","td"
				,"Happy Pills now fully restore a monster's morale."
				,"快樂藥丸會完全恢復怪物的<a href='http://zh.scratchpad.wikia.com/wiki/Monster_Lab#Morale'>士氣值</a>."]
			//That's Good Eatin'
			,["html","td"
				,"Increases monster food recovery amount by 20%."
				,"增加怪物<a href='http://zh.scratchpad.wikia.com/wiki/Monster_Lab#Food'>食物</a>的飽足感 20%."]
			//Coupon Clipper
			,["html","td"
				,"10% discount on all purchases at the Item Shop."
				,"在<a href='http://zh.scratchpad.wikia.com/wiki/Bazaar#Item_Shop'>道具店</a>的所有購物享 10% 折扣."]
			//Long Gone Before Daylight
			,["html","td"
				,"The first energy drink used in a day gives twice the normal amount of stamina."
				,"每天的第一瓶<a href='http://zh.scratchpad.wikia.com/wiki/Items#Other_Restoratives'>能量飲料</a>恢復量加倍."]
			//Dark Descent
			,["html","td"
				,"Halve the required number of amnesia shards for reseting an item's potential."
				,"重置裝備潛在能力的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Enchantments'>失憶碎片</a>所需數量減半."]
			//Eminent Elementalist
			,["html","td"
				,"Increases effective Elemental Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基礎元素魔法熟練度的 10% 會增加到<a href='http://zh.scratchpad.wikia.com/wiki/Proficiencies#Effective_Proficiency'>有效熟練度</a>裡."]
			//Divine Warmage
			,["html","td"
				,"Increases effective Divine Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基礎神聖魔法熟練度的 10% 會增加到有效熟練度裡."]
			//Death and Decay
			,["html","td"
				,"Increases effective Forbidden Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基礎禁斷魔法熟練度的 10% 會增加到有效熟練度裡."]
			//Evil Enchantress
			,["html","td"
				,"Increases effective Deprecating Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基礎貶抑魔法熟練度的 10% 會增加到有效熟練度裡."]
			//Force of Nature
			,["html","td"
				,"Increases effective Supportive Magic Proficiency by 10% of your natural base proficiency."
				,"你自身的基礎輔助魔法熟練度的 10% 會增加到有效熟練度裡."]
			//Manehattan Project
			,["html","td"
				,"Significantly boosts the damage output of the Orbital Friendship Cannon."
				,"大幅提升「<a href='http://zh.scratchpad.wikia.com/wiki/Skills#Special_Skills'>友情小馬砲</a>」的殺傷力。"]
			//Follower of Snowflake
			,["html","td"
				,"Displays your unyielding devotion to Snowflake, the Goddess of Loot and Harvest."
				,"雪花 ─ 專司戰利品與收獲的女神。宣示你對祂不屈不撓的奉獻精神。( <a href='https://forums.e-hentai.org/index.php?s=&showtopic=170909&view=findpost&p=3550156'>解釋</a> )"]
			//Thinking Cap
			,["html","td"
				,"Increases EXP gain by 25%. For calculation purposes, this bonus is added to the HentaiVerse training bonus."
				,"所有取得的<a href='http://zh.scratchpad.wikia.com/wiki/Experience_Points'>經驗值</a>提升 25%. 為計算方便，這個獎勵被合併到《HentaiVerse》<a  href='http://zh.scratchpad.wikia.com/wiki/Training'>訓練獎勵</a>."]
			//Mentats
			,["html","td"
				,"Increases this EXP bonus to 50%."
				,"提升經驗值獎勵至 50%.<a href='https://zh.wikipedia.org/wiki/%E9%96%80%E5%A1%94%E7%89%B9'> ( 其他相關 )</a>"]
			//Learning Chip
			,["html","td"
				,"Increases this EXP bonus to 75%."
				,"提升經驗值獎勵至 75%."]
			//Cybernetic Implants
			,["html","td"
				,"Increases this EXP bonus to 100%."
				,"提升經驗值獎勵至 100%."]
			//Innate Arcana I
			,["html","td"
				,"Unlocks the first auto-cast slot in the HentaiVerse, with a 10% upkeep reduction bonus."
				,"在《HentaiVerse》解鎖第一個<a href='http://zh.scratchpad.wikia.com/wiki/HentaiVerse_Settings#Auto-cast_Slots'>自動施法欄</a>，附贈 10% <a href='http://zh.scratchpad.wikia.com/wiki/HentaiVerse_Settings#.E6.B6.88.E8.80.97'>維持量</a>折扣獎勵."]
			,["html","td"
				,"This allows you to select a spell that will be cast automatically."
				,"此能力讓你選擇一種咒語自動施放."]
			//Innate Arcana II
			,["html","td"
				,"Unlocks a second auto-cast slot, and reduces total upkeep by 20%."
				,"解鎖第二個自動施法欄，和 20% 總維持量折扣."]
			//Innate Arcana III
			,["html","td"
				,"Unlocks a third auto-cast slot, and reduces total upkeep by 30%."
				,"解鎖第三個自動施法欄，和 30% 總維持量折扣."]
			//Innate Arcana IV
			,["html","td"
				,"Unlocks a fourth auto-cast slot, and reduces total upkeep by 40%."
				,"解鎖第四個自動施法欄，和 40% 總維持量折扣."]
			//Innate Arcana V
			,["html","td"
				,"Unlocks a fifth auto-cast slot, and reduces total upkeep by 50%."
				,"解鎖第五個自動施法欄，和 50% 總維持量折扣."]
			//Crystarium I
			,["html","td"
				,"Whenever a monster drops a crystal in the HentaiVerse, you will receive an additional bonus crystal."
				,"在《HentaiVerse》裡每當一隻怪物掉落一顆<a href='http://zh.scratchpad.wikia.com/wiki/Items#Crystals'>水晶時</a>，你將會再獲得一顆水晶作為追加獎勵。"]
			//Crystarium II
			,["html","td"
				,"Further increases the number of crystals received per drop to three."
				,"進一步提高水晶掉落數量至三倍."]
			//Crystarium III
			,["html","td"
				,"Further increases the number of crystals received per drop to five."
				,"進一步提高水晶掉落數量至五倍."]
			//Crystarium IV
			,["html","td"
				,"Further increases the number of crystals received per drop to seven."
				,"	進一步提高水晶掉落數量至七倍."]
			//Crystarium V
			,["html","td"
				,"Further increases the number of crystals received per drop to ten."
				,"進一步提高水晶掉落數量至十倍."]
			//Tokenizer I
			,["html","td"
				,"Doubles the chance of random mob token drops."
				,"打怪的<a href='http://zh.scratchpad.wikia.com/wiki/Items#Tokens'>令牌</a>掉落率變成雙倍."]
			//Tokenizer II
			,["html","td"
				,"Triples the chance of random mob token drops."
				,"打怪的令牌掉落率變成三倍."]
			//Tokenizer III
			,["html","td"
				,"Quadruples the chance of random mob token drops."
				,"打怪的令牌掉落率變成四倍."]
			//Repair Bear Mk.1
			,["html","td"
				,"The latest invention from Moogle Dynamics, "
				,"莫古利動力學的最新發明，"]
			,["html","td"
				,"the Repair Bear will follow you around and help you keep your equipment in good shape at all times."
				,"<a href='http://zh.scratchpad.wikia.com/wiki/The_Forge#Repair'>修理熊</a>會隨侍在側幫助你的<a href='http://zh.scratchpad.wikia.com/wiki/Equipment'>裝備</a>隨時保持良好狀態."]
			,["html","td"
				,"This reduces effective equipment wear by half."
				,"有效裝備耗損程度減少一半."]
			//Repair Bear Mk.2
			,["html","td"
				,"Further hones the skills of your Repair Bear, making it better at maintaining your equipment."
				,"進一步磨練你的修理熊的技巧，使牠精於維護你的裝備."]
			,["html","td"
				,"Effective equipment wear is reduced to 25% of normal."
				,"有效裝備耗損程度減少為正常值的 25%."]
			//Repair Bear Mk.3
			,["html","td"
				,"Trains your Repair Bear to the penultimate level, "
				,"將你的修理熊培訓至完全體，"]
			,["html","td"
				,"making those pesky forge visits \\(almost\\) a distant memory."
				,"讓那些煩人的鍛造次數 (幾乎) 成為遙遠的記憶.<br>"]
			,["html","td"
				,"Effective equipment wear is reduced to 10% of normal."
				,"有效裝備耗損程度減少為正常值的 10%."]
			//Repair Bear Mk.4
			,["html","td"
				,"The pinnacle of Repair Bear Technology, "
				,"修理熊科技的頂尖之作，"]
			,["html","td"
				,"providing the ultimate in-the-field preventive equipment maintenance."
				,"提供這門領域最高端的預防性裝備維護技術.<br>"]
			,["html","td"
				,"Equipment wear is fully eliminated, and defeat durability loss is cut by half."
				,"裝備耗損完全消除，被<a href='http://zh.scratchpad.wikia.com/wiki/Battles#.E6.95.97.E5.8C.97'>擊倒</a>時的耐久度損耗減半."]
			//Damon Duality
			,["html","td"
				,"Increases attack damage and magic damage by 10%."
				,"提升攻擊傷害和魔法傷害各 10%."]
			//Free-Flowing Dust
			,["html","td"
				,"Increases attack damage and magic damage by 15%."
				,"提升攻擊傷害和魔法傷害各 15%."]
			//Grace and Knowledge
			,["html","td"
				,"Increases attack damage and magic damage by 20%."
				,"提升攻擊傷害和魔法傷害各 20%."]
			//Golden Compasses
			,["html","td"
				,"Increases attack damage and magic damage by 25%."
				,"提升攻擊傷害和魔法傷害各 25%."]
			//Asahattr
			,["html","td"
				,"Increases attack damage and magic damage by 30%."
				,"提升攻擊傷害和魔法傷害各 30%."]
		]
	},
	
	"exchange.php":
	{
		//All
		 "h2:contains('Spread')"					:"股市價差"
		,"h2:contains('Recent Transactions')"		:"近期交易"
		,"strong:contains('High')"					:"最高"
		,"strong:contains('Low')"					:"最低"
		,"strong:contains('Avg')"					:"平均"
		,"strong:contains('Vol')"					:"規模"
		,"h3:contains('Bid (Buyers)')"				:"出價 ( 買家 )"
		,"h3:contains('Ask (Sellers)')"				:"詢價 ( 賣家 )"
		,"#historytable th:contains('Time')"		:"時間"
		,"#historytable th:contains('Seller')"		:"賣家"
		,"#historytable th:contains('Buyer')"		:"買家"
		,"#historytable th:contains('Volume')"		:"規模" //數量
		,"#historytable th:contains('Unit Cost')"	:"單價"
		,"#buyform  a:contains('Update Bid!')"		:"<font color='red'>更改</font>出價!"
		,"#sellform a:contains('Update Ask!')"		:"<font color='red'>更改</font>詢價!"
		
		//The Hath Exchange
		,"h1:contains('The Hath Exchange')"			:"駭斯市集 (-Hath-)"
		,"h2:contains('Last 8 Hours (per Hath)')"	:"近8小時 (單駭斯幣)"
		,"h2:contains('Last 24 Hours (per Hath)')"	:"近24小時 (單駭斯幣)"
		,"h2:contains('Buy Hath')"					:"購買駭斯幣"
		,"h2:contains('Sell Hath')"					:"賣出駭斯幣"
		,"#buyform  a:contains('Buy Hath!')"		:"<font color='red'>購買</font>駭斯幣!"
		,"#sellform a:contains('Sell Hath!')"		:"<font color='red'>賣出</font>駭斯幣!"
		
		//The GP Exchange
		,"h1:contains('The GP Exchange')"			:"圖幣市場 (-kGP-)"
		,"h2:contains('Last 8 Hours (per kGP)')"	:"近8小時 (每個圖幣)"
		,"h2:contains('Last 24 Hours (per kGP)')"	:"近24小時 (每個圖幣)"
		,"h2:contains('Buy GP')"					:"購買圖幣"
		,"h2:contains('Sell GP')"					:"賣出圖幣"
		,"#buyform  a:contains('Buy GP!')"			:"<font color='red'>購買</font>圖幣!"
		,"#sellform a:contains('Sell GP!')"			:"<font color='red'>賣出</font>圖幣!"
		
		,"ReplaceMode":
		[
			//All
			 ["html","#buyform"  ,"Buy Count:"		,"購買規模："]
			,["html","#sellform" ,"Sell Count:"		,"賣出規模："]
			,["html","div:contains('Available: ')"	,"Available:"	,"可用："]
			,["html","#buyform,#sellform"			,"> C &nbsp;"	,"> <font color='darkgreen'>紳士幣</font>"]
			//The Hath Exchange
			,["html","#buyform"  ,"Bid Price/Hath:"	,"<br>出價/單駭斯幣："]
			,["html","#sellform" ,"Ask Price/Hath:"	,"<br>詢價/單駭斯幣："]
			//The GP Exchange
			,["html","#buyform"  ,"Bid Price/kGP:"	,"<br>出價/單圖幣："]
			,["html","#sellform" ,"Ask Price/kGP:"	,"<br>詢價/單圖幣："]
			
			//All
			,["html","div:contains(' Credits')"		
				,"Credits"			
				,"<font color='darkgreen'>紳士幣</font>"]
			,["html","div:contains(' Hath')"		
				," Hath"				
				,"<font color='darkblue'> 駭斯幣</font>"]
			,["html","div:contains(' kGP')"		
				," kGP"				
				,"<font color='darkblue'> 千圖幣</font>"]
		]
	},
	
	"logs.php":
	{
		//All
		 "th:contains('Date')"			:"日期"
		 
		//Credit Log
		,"th:contains('Amount')"		:"規模"
		,"th:contains('Information')"	:"訊息"
		
		//Karma Log
		,"th:contains('Karma')"			:"業力"
		,"th:contains('From')"			:"來自"
		,"th:contains('Topic')"			:"主題"
		,"th:contains('Comment')"		:"評論"
		
		,"ReplaceMode":
		[
			//Credit Log - Normal
			 ["html","div[style='overflow:hidden']" ,"GP Exchange Transaction "		
				,"<font color='RoyalBlue'>圖幣</font>交易 "]
			,["html","div[style='overflow:hidden']" ,"Hath Exchange Transaction "	
				,"<font color='DarkOrchid'>駭斯</font>交易 "]
			,["html","div[style='overflow:hidden']" ,"\\(Bought "
				,"[<font color='red'>購買</font> "]
			,["html","div[style='overflow:hidden']" ,"\\(Sold "	
				,"[<font color='green'>賣出</font> "]
			,["html","div[style='overflow:hidden']" ," kGP "	
				," <font color='RoyalBlue'>千圖幣</font> "]
			,["html","div[style='overflow:hidden']" ," Hath "	
				," <font color='DarkOrchid'>駭斯幣</font> "]
			,["html","div[style='overflow:hidden']" ," @ "		
				," (單價) "]
			,["html","div[style='overflow:hidden']" ," C\\)"
				," <font color='Teal'>紳士幣</font>]"]
			//Credit Log - Donation
			,["html","div[style='overflow:hidden']" ," Donation "
				," <font color='Gray'>美金</font>捐款 "]
			,["html","div[style='overflow:hidden']" ,"\\(Refunded "
				," ( <font color='green'>返還</font> "]
			,["html","div[style='overflow:hidden']" ," Hath\\)"
				," <font color='DarkOrchid'>駭斯幣</font> )"]
			//Karma Log
			,["html","div:contains('Total Karma: ')"
				,"Total Karma: "
				,"<a href='https://ehwiki.org/wiki/Karma/Chinese'>(不知道有什麼用的)</a> 業力總計："]
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
		
		,"table.itg th:contains('Published')"			:"發表時間"
		,"table.itg th a:contains('Published')"			:"發表時間"
		,"table.itg th:contains('Name')"				:"標題"
		,"table.itg th:contains('Favorited')"			:"收藏時間"
		,"table.itg th a:contains('Favorited')"			:"收藏時間"
		,"p:contains('No hits found')"					:"<font color='red'><b>無搜尋結果</b></font>"
		
		,"ReplaceMode":
		[
			 ["attr","input[name='f_apply']"			,"value"			,"本页搜索"]
			,["attr","input[name='f_clear']"			,"value"			,"清除"]
			
			,["html","div.ido p.ip"									,"Showing"			,"顯示"]
			,["html","div.ido p.ip"									,"of"				,"共"]
			,["html","form[name='favform'] div"						,"Display:"			,"顯示模式："]
			,["html","form[name='favform'] div span"				,"Thumbnails"		,"縮圖"]
			,["html","form[name='favform'] div a"					,"Show List"		,"列表"]
			,["html","form[name='favform'] div"						,"Order:"			,"排序："]
			,["html","form[name='favform'] div span"				,"Posted"			,"發表時間"]
			,["html","form[name='favform'] div a"					,"Use Favorited"	,"收藏時間"]
			,["html","div.itg div.id1 div.id42"						,"files"	,"頁"]
			
			,["html","option[value='delete']"						,"Remove from Favorites"	,"移除收藏"]
			,["attp","optgroup[label='Change Favorite Category']"	,"label" ,"Change Favorite Category"		,"轉移項目至收藏："]
			,["attr","input[name='apply']"							,"value"			,"送出"]
			,["html","form[name='favform']:eq(0) div:eq(2)","Action:","動作："]
		]
	},
	
	//畫冊模式
	"GalleryMode":
	{
		 "h1:contains('Content Warning')"	:"內容警告"
		,"a:contains('View Gallery')"		:"進入畫冊"
		,"a:contains('Get Me Outta Here')"	:"我要離開"
		,"a:contains('Never Warn Me Again')":"不再警告"		
		
		,"#gd5 p[class='g2 gsp'] a:contains('Multi-Page Viewer')":
			"多頁快速閱覽"
		,"#gdd td.gdt2:contains('No (Replaced)')":
			"不 ( 已被取代 )"
		,"#gnd p:contains('There are newer versions of this gallery available:')":
			"已有此畫冊的更新版本："
		,"div[class='c4 nosel'] a:contains('Edit')":
			"編輯評論"
		
		,"ReplaceMode":
		[
			["html","div"
				,"This gallery has been flagged as"
				,"此畫冊已被標注為"]
			,["html","div strong"
				,"Offensive For Everyone"
				,"非大眾向"]
			,["html","div"
				,". Due to its content, it should not be viewed by anyone."
				,". 這個內容物並不適合被任何人觀看."]
			,["html","div"
				,"\\(And if you choose to ignore this warning, you lose all rights to complain about it in the future.\\)"
				,"( 如果你選擇忽視這個警告，你失去一切未來抱怨的權利 )"]
			,["html","#gnd",", added"		," 新增時間"]
			,["html",".gpc","Showing"		,"Showing"]
			,["html",".gpc","of"			,"of"]
			,["html",".gpc","images"		,"images"]
			
			,["html","div[class='c3']"			,"Posted on"		,"发表于"]
			,["html","div[class='c4 nosel']"	,"Uploader Comment"	,"上传者注释"]
			,["html","div[class='c4 nosel'] a"	,"Vote-"	,"减分-"]
			,["html","div[class='c4 nosel'] a"	,"Vote+"	,"加分"]
			,["html","div[class='c5 nosel']"	,"Score "	,"评价"]
			
			,["html","#postnewcomment a"	,"Post New Comment"	,"发表新回复"]
			,["html","#rating_label"		,"Average"			,"平均 "]
			
			,["html","#taglist"				
				,"No tags have been added for this gallery yet."	
				,"畫冊尚未標記，"]
			,["html","#taglist"
				,"You can enter some tags below to make this gallery less sad."
				,"可在下方填入"]
			
			,["html","#chd p","There is"								,"這裡有"]
			,["html","#chd p","more comment below the viewing threshold","個及更多回覆"]
			,["html","#chd p a","click to show all"						,"點我顯示"]
			
			,["attr","#gdn a img.ygm"	,"title","跟他聯絡"]
			,["attr","span.halp"		,"title","此画册已翻译"]
			,["attr","#newtagbutton"	,"value","标记"]
			,["attr","#newtagfield"		,"placeholder","输入新标记，使用逗号批次输入 (仅支持英文)"]
			,["attr","div.c3 a img.ygm"	,"title","跟他聯絡"]
			,["modi","#gd3"	,{
				 "modiTarget1"			:"#rating_label"
				,"Average:"				:"平均："
				,"Rate as"				:"评分"
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
				,">Show Tagged Galleries<"	:"><font color='darkblue'>顯示此標籤的畫冊</font><"
				,">Show Tag Definition<"	:">顯示標籤定義(英文)<"
				,">Add New Tag<"			:">新增標籤<"
				,">Withdraw Vote<"			:">取消分數<"
			}]
			,["attr","textarea[name='commenttext']"	
				,"placeholder"
				,"在這邊輸入評論後發表，如果最後一則評論是你的，將會自動沿展評論區."]
			,["attr","input[value='Post Comment']","value","發表評論"]
			,["html","div.c7[id*='cvotes_']","Base +","基礎"]
			,["html","div.c8","Last edited on ","最后更新时间："]
		]
	},
	
	"exhentai.org/mpv/":
	{
		"ReplaceMode":
		[
			//右側模式列
			 ["attr","img[title='Close Image Viewer']","title"
				,"關閉閱圖器"]
			,["attr","img[title='Go Fullscreen - F11 or ESC to cancel']","title"
				,"切換至全螢幕模式 - 按下F11或ESC取消"]
			,["attr","img[title='Align Left, Scale Down Only']","title"
				,"向左對齊，僅按比例縮小"]
			,["attr","img[title='Align Center, Scale Down Only']","title"
				,"向中對齊，僅按比例縮小"]
			,["attr","img[title='Align Center, Scale To Fit']","title"
				,"向中對齊，縮放最適大小"]
			,["attr","img[title='Show Thumbnail Pane']","title"
				,"顯示縮圖列"]
			,["attr","img[title='Hide Thumbnail Pane']","title"
				,"隱藏縮圖列"]
		]
	},
	
	"g.e-hentai.org/mpv/":
	{
		"ReplaceMode":
		[
			//右側模式列
			 ["attr","img[title='Close Image Viewer']","title"
				,"關閉閱圖器"]
			,["attr","img[title='Go Fullscreen - F11 or ESC to cancel']","title"
				,"切換至全螢幕模式 - 按下F11或ESC取消"]
			,["attr","img[title='Align Left, Scale Down Only']","title"
				,"向左對齊，僅按比例縮小"]
			,["attr","img[title='Align Center, Scale Down Only']","title"
				,"向中對齊，僅按比例縮小"]
			,["attr","img[title='Align Center, Scale To Fit']","title"
				,"向中對齊，縮放最適大小"]
			,["attr","img[title='Show Thumbnail Pane']","title"
				,"顯示縮圖列"]
			,["attr","img[title='Hide Thumbnail Pane']","title"
				,"隱藏縮圖列"]
			//圖片相關
			/*
			,["attp","img[title*='original']","title"
				,"Download original"
				,"下載原始圖片"]
			,["attp","img[title*='original']","title"
				,"source"
				,""]
			*/
			/*
			,["attr","img[title='Reload broken image']","title"
				,"重載壞連圖片"]
			,["attr","img[title='Open image in normal viewer']","title"
				,"使用普通閱覽模式開啟圖片"]
			,["attr","img[title='Show galleries with this image']","title"
				,"以圖找圖"]
			,["attr","img[title='Get forum link to image']","title"
				,"取得論壇連結"]
			*/
				
		]
	},
	
	"g.e-hentai.org/s/":
	{
		 "a[href*='f_shash=']:contains('Show all galleries with this file')":
			"顯示此圖片相關畫冊(以圖找圖)"
		,"a[onclick*='Copy the URL below.']:contains('Generate a static forum image link')":
			"產生論壇用靜態貼圖連結"
		,"a[id='loadfail']:contains('Click here if the image fails loading')":
			"點我刷新失連圖片"
		,"ReplaceMode":
		[
			 ["html","a[href*='fullimg.php']","Download original"	,"下載原始圖片："]
			,["html","a[href*='fullimg.php']"," source"				,""]
			,["attr","img[src='http://ehgt.org/g/f.png']","title"	,"到第一頁"]
			,["attr","img[src='http://ehgt.org/g/p.png']","title"	,"上一頁"]
			,["attr","img[src='http://ehgt.org/g/n.png']","title"	,"下一頁"]
			,["attr","img[src='http://ehgt.org/g/l.png']","title"	,"到最後一頁"]
			,["attr","img[src='http://ehgt.org/g/b.png']","title"	,"回畫冊列表"]
		]
		
	},
	
	"exhentai.org/s/":
	{
		 "a[href*='f_shash=']:contains('Show all galleries with this file')":
			"顯示此圖片相關畫冊(以圖找圖)"
		,"a[onclick*='Copy the URL below.']:contains('Generate a static forum image link')":
			"產生論壇用靜態貼圖連結"
		,"a[id='loadfail']:contains('Click here if the image fails loading')":
			"點我刷新失連圖片"
		,"ReplaceMode":
		[
			 ["html","a[href*='fullimg.php']","Download original"	,"下載原始圖片："]
			,["html","a[href*='fullimg.php']"," source"				,""]
			,["attr","img[src='http://exhentai.org/img/f.png']","title"	,"到第一頁"]
			,["attr","img[src='http://exhentai.org/img/p.png']","title"	,"上一頁"]
			,["attr","img[src='http://exhentai.org/img/n.png']","title"	,"下一頁"]
			,["attr","img[src='http://exhentai.org/img/l.png']","title"	,"到最後一頁"]
			,["attr","img[src='http://exhentai.org/img/b.png']","title"	,"回畫冊列表"]
		]
		
	},
	
	"archiver.php":
	{
		 "#db p:contains('Current Funds:')"	:"現有代幣："
		,"#db strong:contains('Free!')"		:"免費!"
		 
		,"ReplaceMode":
		[
			 ["html","#db div","Download Cost:"				,"下載花費："]
			,["html","#db div","Estimated Archive Size:"	,"預估大小："]
			,["attr","#db input[value='Download Archive']"	,"value","下載包裝檔"]
			,["html","#db p"
				,"Note: Pressing this button will immediately deduct funds."				
				,"注意事項：按下按鈕將立即扣除代幣."]
			,["html","#db p"
				,"If the download fails, you will have a week to re-download it."				
				,"如果下載失敗，你還有一個星期來重新下載."]
		]
	},
	
	"gallerypopups.php":
	{
		//收藏類
		 "#galpop p:contains('Please choose a color to file this favorite gallery under. You can also add a note to it if you wish.')":
			"請選擇一個收藏色作為識別，你也可以加入註記."
		,"#galpop p:contains('Favorite Note (Max 200 Characters)')":
			"收藏註記 ( 最多 200 英文字元 )"
		,"#galpop div.nosel div[onclick*='favdel']:contains('Remove from Favorites')":
			"移除收藏"
		//刪除類
		,"#galpop p:contains('Specify an objective reason why you wish to expunge this gallery.')":
			"選擇刪除畫冊的原因."
		,"label[for='exp1']":"無 / 撤回請願."
		,"label[for='exp3']":"這是個重複的畫冊或早些發表品質較低的畫冊，需要明確標示."
		,"label[for='exp6']":"畫冊已更新，此畫冊的更高品質副本已被上傳."
		,"#galpop a:contains('Close Window')":"關閉視窗"
		
		//改名類
		,"#galpop p:contains('Roman Script')"	:"預設標題 ( Roman Script )"
		,"#galpop p:contains('Japanese Script')":"次要標題 ( Japanese Script )"
		,"#galpop td:contains('Uploader:')"		:"上傳者："
		,"#galpop td:contains(' New')"			:"新增"
		,"#galpop label:contains('Blank Vote')"	:"廢票"
		
		,"ReplaceMode":
		[
			//收藏類
			 ["html","#galpop div","favorite note slots used.","個收藏註記已被使用."]
			,["attr","input[value='Add to Favorites']"	,"value","加入收藏"]
			,["attr","input[value='Apply Changes']"		,"value","送出修改"]
			
			//刪除類
			,["html","label[for='exp5']"	
				,"This gallery contains either illicit content like child porn or anything else forbidden by the"
				,"這個畫冊包含兒童色情或其他"]
			,["html","label[for='exp5']"	
				,">Terms of Service<"
				,">服務條款<"]
			,["html","label[for='exp5']"	
				,", or otherwise falls under the"
				," 禁止的非法內容，除此之外請依據"]
			,["html","label[for='exp5']"
				,">Expunge Guidelines<"
				,">刪除指南<"]
			,["html","label[for='exp5']"
				,"\\(specify below\\)."
				,"在下面具體說明."]
			,["attr","textarea[name='expungexpl']"
				,"placeholder"
				,"在此輸入此次請願的說明\n必須包含重複畫冊的網址或被違反的規定."]
			,["attr","input[value='Show Expunge Log']"		,"value","- 顯示刪除記錄 -"]
			,["attr","input[value='Petition to Expunge']"	,"value","- 遞交刪除請願 -"]
			//刪除記錄
			,["html","#galpop p"
				,"No expunge petitions have been filed for this gallery"
				,"此畫冊沒有任何刪除請願書"]
			,["attr","input[value='Back']"		,"value","上一頁"]
			//改名類
			,["attr","input[value='Submit']"	,"value","送出"]
		]
	},
	
	"report.php":
	{
		 "div.stuffbox td:contains('Report Category:')"		:"檢舉類型："
		,"div.stuffbox td:contains('Specify Complaint:')"	:"說明內容："
		,"div.stuffbox td:contains('Contact E-Mail:')"		:"電子信箱："
		,"div.stuffbox td:contains('(Required)')"			:"( 必須 )"
		,"div.stuffbox td:contains('(Optional)')"			:"( 選填 )"
		,"div.stuffbox a[target='tos']"						:"幫助說明"
		
		,"ReplaceMode":
		[
			 ["attr","input[value='Submit Report']","value","送出檢舉"]
			,["html","div.stuffbox p"
				,"Reporting content from:"
				,"回報項目來自於："]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"\\[Select a complaint type...\\]"	,"[ 選擇一種類型 ]"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Copyright Infringement"			,"版權侵權"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Child Pornography"				,"兒童色情"]
			,["html","div.stuffbox select.stdinput[name='report_cat']"
				,"Other ToS-infringing Content"		,"其他服務類型侵權內容"]
			,["html","div.stuffbox p"
				,"If you leave your e-mail address, we may contact you with the result of, "
				,"如果你有留下電子信箱，有結果時我們將會聯繫，"]
			,["html","div.stuffbox p"
				,"or further inquiries regarding your report."
				,"或更進一步審查你的檢舉."]
			,["html","div.stuffbox p"
				,"The e-mail address will not be used for any other purposes, "
				,"<br>電子信箱並不會做其他用途，"]
			,["html","div.stuffbox p"
				,"and will be removed from our systems when the report has been processed."
				,"並且電子信箱在檢舉處理完畢後會從我們的系統中移除."]
				
			,["html","div.stuffbox p"
				,"For Copyright Infringement complaints, "
				,"關於版權投訴，"]
			,["html","div.stuffbox p"
				,"please make sure to include enough information that we can accurately verify your claim."
				,"請務必包含足夠的訊息，我們才可以準確地驗證你的檢舉."]
			,["html","div.stuffbox p"
				,"A specific list of required information can be found at the bottom of"
				,"<br>所需的具體資訊可在此頁的底部找到："]
			,["html","div.stuffbox p"
				,"Complaints that do not sufficiently support your claim will be rejected."
				,"如果資訊不夠完整你的檢舉將被拒絕."]
				
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
		"<h2>繁简设定</h2>"+
			"<div class='optmain'>"+
				"<p>设定绅士站中文化是繁体还是简体<p>"+
				"<div class='optsub'>"+
					'<input type="radio" name="TRlang" value="tw" id="zh_tw" checked="checked">'+
						'<label for="zh_tw" id="TR_tw">繁体中文</label><br>'+
					'<input type="radio" name="TRlang" value="cn" id="zh_cn">'+
						'<label for="zh_cn" id="TR_cn">简体中文 ( 纯字元转换 )</label><br>'+
					//'<input type="radio" name="TRlang" value="cnd" id="zh_cnd">'+
					//	'<label for="zh_cnd" id="TR_cnd">简体中文 ( 常用语支援-更新较慢 )</label><br>'+
				"</div>"+
			"</div>"+
			'<input type="button" id="TRlang" name="Transform" value=" 保存设定 " class="stdbtn">'+
		"</div><br>"
	).insertBefore("#outer form h2:eq(0)");
	
	$("#zh_" + TRvalue).prop("checked",true);
	
	$("#TRlang").click(function(){
		var TRlang 	= $("#Transform input[name='TRlang']:checked").val();
		var TR_ 	= "TR_" + TRlang;
		GM_setValue("TRlang", TRlang);
		
		alert("已更改中文化語系：" + $("#" + TR_).html());
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

//==============================================全域函數==============================================
function fanyi(strArray, temp) { //翻譯
    for (var i = 0; i < strArray.length; i++) {
        if (strArray[i][0].length > 2) {
            var regex = new RegExp(strArray[i][0], "g"); //全域正則匹配
            temp = temp.replace(regex, strArray[i][1]); //全域替換
        }
    }
    return temp;
}

function DescByLength(a, b) { //按字元長度倒序排列
    if (a[0].length > b[0].length) return -1;     
    return 1;
}

//==============================================翻譯製作==============================================
function make_nb() { //主導航
    var array_EN_CH = new Array();
    array_EN_CH.push([">Front Page<"		, ">首页<"]);
    array_EN_CH.push([">Torrents<"			, ">种子<"]);
    array_EN_CH.push([">My Galleries<"		, ">我的画册<"]);
    array_EN_CH.push([">My Home<"			, ">我的首页<"]);
    array_EN_CH.push([">Bounties<"			, ">懸賞<"]);
    array_EN_CH.push([">Settings<"			, ">功能设定<"]);
    array_EN_CH.push([">Favorites<"			, ">我的收藏<"]);
    array_EN_CH.push([">Upload Gallery<"	, ">上傳畫冊<"]);
    array_EN_CH.push([">Maintain Galleries<", ">管理畫冊<"]);
    array_EN_CH.push([">Toplists<"			, ">排行榜<"]);
    array_EN_CH.push([">News<"				, ">新聞<"]);
    array_EN_CH.push([">Forums<"			, ">論壇<"]);
    array_EN_CH.push([">Wiki<"				, ">百科<"]);
    array_EN_CH.push([">Logout<"			, ">退出<"]);
    array_EN_CH.sort(DescByLength); 	//進行排序
    return array_EN_CH;
}

function make_dmi() { //顯示方式
    var array_EN_CH = new Array();
    array_EN_CH.push(["Display:"			, "显示方式:"]);
    array_EN_CH.push([">List<"				, ">列表<"]);
    array_EN_CH.push([">Thumbnails<"		, ">缩略图<"]);
    array_EN_CH.push([">Show List<"			, ">列表<"]);
    array_EN_CH.push([">Show Thumbnails<"	, ">缩略图<"]);
    array_EN_CH.sort(DescByLength); 	//進行排序
    return array_EN_CH;
}

function make_gd3() { //畫冊內資訊
    var array_EN_CH = new Array();
    array_EN_CH.push(["class=\"gdt", "style=\"white-space:nowrap;\" class=\"gdt"]);
    array_EN_CH.push([">TR<"				, ">译制<"]);
    array_EN_CH.push([">RES<"				, ">压缩<"]);
    array_EN_CH.push([">Posted:<"			, ">上传时间:<"]);
    //array_EN_CH.push([">Images:<"			, ">画册资讯:<"]);
    //array_EN_CH.push([">Resized:<"		, ">缩放大小:<"]);
    array_EN_CH.push([">Parent:<"			, ">画册来自:<"]);
    array_EN_CH.push([">Visible:<"			, ">是否可见:<"]);
    array_EN_CH.push([">File Size:<"		, ">文件大小:<"]);
    array_EN_CH.push([">Length:<"			, ">画册页数:<"]);
    array_EN_CH.push([">Language:<"			, ">语言类型:<"]);
    array_EN_CH.push([">Rating:<"			, ">评分:<"]);
    //array_EN_CH.push([">Average:"			, ">平均評分:<"]);
    array_EN_CH.push([">Favorited:<"		, ">收藏次数:<"]);
    array_EN_CH.push([">Never<"				, ">无人收藏<"]);
    array_EN_CH.push([">Once<"				, ">1 次<"]);
    array_EN_CH.push(["> Add to Favorites<"	, "> 添加收藏<"]);
    //array_EN_CH.push([">For browsing<"	, ">流覽優化<"]);
    //array_EN_CH.push([">Originals only<"	, ">原畫尺寸<"]);
    array_EN_CH.push([">Japanese"			, ">日语"]);
    array_EN_CH.push([">English"			, ">英语"]);
    array_EN_CH.push([">Chinese"			, ">中文"]);
    array_EN_CH.push([">Dutch"				, ">荷兰语"]);
    array_EN_CH.push([">French"				, ">法语"]);
    array_EN_CH.push([">German"				, ">德语"]);
    array_EN_CH.push([">Hungarian"			, ">匈牙利語"]);
    array_EN_CH.push([">Italian"			, ">意大利语"]);
    array_EN_CH.push([">Korean"				, ">韩语"]);
    array_EN_CH.push([">Polish"				, ">波兰语"]);
    array_EN_CH.push([">Portuguese"			, ">葡萄牙語"]);
    array_EN_CH.push([">Russian"			, ">俄罗斯语"]);
    array_EN_CH.push([">Spanish"			, ">西班牙語"]);
    array_EN_CH.push([">Thai"				, ">泰语"]);
    array_EN_CH.push([">Vietnamese"			, ">越南语"]);
    array_EN_CH.push([">N\/A"				, ">未知"]);
    array_EN_CH.push([">Other"				, ">其他"]);
    //array_EN_CH.push(["\\(T\\)<"			, "(譯)<"]);
    array_EN_CH.push(["pages<"				, "页<"]);
    array_EN_CH.push(["times<"				, "次<"]);
    array_EN_CH.push([">None<"				, ">无<"]);
    array_EN_CH.push([">Yes<"				, ">是<"]);
    array_EN_CH.push([">No<"				, ">否<"]);
    array_EN_CH.sort(DescByLength); 	//進行排序
    return array_EN_CH;
}

function make_gd5() { //畫冊內設置
    var array_EN_CH = new Array();
    //array_EN_CH.push(["> Thumbnail Selection<", ">縮略圖選項:<"]);
    //array_EN_CH.push([">Size:<"			, ">預覽:<"]);
    array_EN_CH.push([">Normal<"			, ">Normal<"]);
    array_EN_CH.push([">Large<"				, ">Large<"]);
    array_EN_CH.push(["rows<"				, "行<"]);
    array_EN_CH.push([">Get External Gallery<"	, ">獲取分享代碼<"]);
    array_EN_CH.push([">Archive Download<"	, ">下载画册<"]);
    array_EN_CH.push([">Torrent Download"	, ">下载种子"]);
    array_EN_CH.push([">H@H Downloader<"	, ">用H@H下载<"]);
    array_EN_CH.push([">Show Gallery Stats<", ">顯示畫冊統計<"]);
    array_EN_CH.push([">Petition to Expunge<", ">申请删除<"]);
    array_EN_CH.push([">Petition to Rename<", ">申请改名<"]);
    array_EN_CH.push([">Report Gallery<"	, ">检举画册<"]);
    array_EN_CH.sort(DescByLength); 	//進行排序
    return array_EN_CH;
}

function make_taglist() { 	//畫冊內標籤分類
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
    array_EN_CH.push([">reclass:<"		, ">重新归类:<"]);
    array_EN_CH.sort(DescByLength); 	//進行排序
    return array_EN_CH;
}
//==============================================翻譯函數==============================================
function getArrayByKey(key) { //填充陣列
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

function ChangeDoc(key, code) { //翻譯操作
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


//==============================================函式呼叫==============================================
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
//畫冊標籤功能
var showOriginal = 0


var rData={
//行名
	"language"	:"語　言",
	"parody"	:"出　處",
	"character"	:"角　色",
	"group"		:"分　組",
	"artist"	:"畫　師",
	"female"	:"女角色",
	"male"		:"男角色",
	"misc"		:"雜　項",
	"reclass"	:"重歸類"
}
//TAG翻譯資料庫
var tData={
	"=Age=":"=年齡=",//==========================================
	"age progression":"快速成長",
	"age regression":"返老還童",
	"dilf":"熟男",
	"infantilism":"幼稚病",
	"lolicon":"蘿莉控",
	"low lolicon":"隱晦的蘿莉控",
	"low shotacon":"隱晦的正太控",
	"low toddlercon":"隱晦的嬰兒控",
	"milf":"熟女",
	"old lady":"老女人",
	"old man":"老男人",
	"shotacon":"正太控",
	"toddlercon":"嬰兒控",
	"=Body=":"=身體=",//==========================================
	"amputee":"人棍",
	"body modification":"身體改造",
	"conjoined":"連體",
	"doll joints":"球形關節",
	"gijinka":"擬人化",
	"inflation":"脹腹",
	"invisible":"透明人",
	"muscle":"筋肉人",
	"multiple arms":"多個胳膊",
	"multiple breasts":"多個乳房",
	"multiple paizuri":"多人乳交",
	"multiple penises":"多根陰莖",
	"pregnant":"孕婦Play",
	"stretching":"擴張",
	"tailjob":"用尾巴擼",
	"wings":"翅膀",
	"=Change=":"=變化=",//==========================================
	"absorption":"吞噬吸收",
	"age progression":"快速成長",
	"age regression":"返老還童",
	"ass expansion":"屁股膨大",
	"balls expansion":"睾丸膨大",
	"body swap":"身體交換",
	"breast expansion":"乳房膨大",
	"clit growth":"陰蒂增長",
	"corruption":"墮落",
	"dick growth":"陰莖增長",
	"feminization":"男變女",
	"gender bender":"性別變化",
	"growth":"體型增大",
	"moral degeneration":"道德淪喪",
	"muscle growth":"肌肉增長",
	"nipple expansion":"乳頭膨大",
	"petrification":"石化",
	"shrinking":"體型縮小",
	"transformation":"身體變化",
	"weight gain":"體重增長",
	"=Creature=":"=生物=",//==========================================
	"alien":"外星人",
	"alien girl":"外星女",
	"angel":"天使",
	"bee girl":"蜂娘",
	"bunny boy":"兔男",
	"bunny girl":"兔娘",
	"catboy":"貓男",
	"catgirl":"貓娘",
	"cowgirl":"奶牛娘",
	"cowman":"奶牛男",
	"demon":"恶魔",
	"demon girl":"女恶魔",
	"dog boy":"犬男",
	"dog girl":"犬娘",
	"draenei":"德萊尼",
	"fairy":"妖精",
	"fox boy":"狐男",
	"fox girl":"狐娘(狐女)",
	"furry":"人型獸",
	"ghost":"幽靈",
	"goblin":"地精",
	"harpy":"鳥身女妖",
	"horse boy":"馬男",
	"horse girl":"馬娘",
	"human on furry":"人X人性獸",
	"insect boy":"昆蟲男",
	"insect girl":"昆蟲娘",
	"kappa":"河童",
	"lizard girl":"蜥蜴娘",
	"lizard guy":"蜥蜴男",
	"mermaid":"人魚娘",
	"merman":"人魚男",
	"minotaur":"牛頭人",
	"monster":"怪物",
	"monster girl":"怪物娘",
	"mouse boy":"鼠男",
	"mouse girl":"鼠娘",
	"necrophilia":"奸屍",
	"oni":"日本鬼",
	"orc":"獸人",
	"pig girl":"豬娘",
	"pig man":"豬男",
	"plant girl":"植物娘",
	"plant guy":"植物男",
	"centaur":"半人馬",
	"raccoon boy":"浣熊男孩",
	"raccoon girl":"浣熊娘",//ehWiki
	"robot":"機器人",
	"robot girl":"機器娘",
	"sheep boy":"男羊人",
	"sheep girl":"綿羊娘",
	"slime":"史萊姆",
	"slime boy":"史萊姆男",//ehWiki
	"slime girl":"史萊姆娘",
	"snake girl":"蛇女",
	"snake guy":"男蛇人",
	"spider girl":"蜘蛛娘",
	"squid girl":"魷魚娘",
	"tentacles":"觸手",
	"wolf boy":"男狼人",
	"wolf girl":"狼女",
	"yukkuri":"油庫裡",
	"zombie":"喪屍",
	"=Animal=":"=動物=",//==========================================
	"animal on animal":"動物X動物",
	"animal on furry":"人型獸X動物",
	"bear":"熊",
	"bestiality":"獸交",
	"bull":"公牛",
	"camel":"駱駝",
	"cat":"貓",
	"cow":"牛",
	"crab":"蟹",
	"dinosaur":"恐龍",
	"dog":"犬",
	"dolphin":"海豚",
	"donkey":"毛驢",
	"dragon":"龍",
	"eel":"鰻魚",
	"elephant":"大象",
	"fish":"魚",
	"fox":"狐狸",
	"frog":"青蛙",
	"goat":"山羊",
	"gorilla":"猩猩",
	"horse":"馬",
	"insect":"昆蟲",
	"lion":"獅子",
	"lioness":"母獅",
	"low bestiality":"隱晦的獸交",
	"maggot":"蛆蟲",
	"monkey":"猴子",
	"mouse":"老鼠",
	"octopus":"章魚",
	"ostrich":"鴕鳥",
	"panther":"豹子",
	"pig":"豬",
	"rabbit":"兔子",
	"reptile":"爬行",
	"rhinoceros":"犀牛",
	"sheep":"羊",
	"shark":"鯊魚",
	"slug":"蛞蝓",
	"snake":"蛇",
	"spider":"蜘蛛",
	"tiger":"老虎",
	"turtle":"烏龜",
	"unicorn":"獨角獸",
	"whale":"鯨魚",
	"wolf":"狼",
	"worm":"蟲子",
	"zebra":"斑馬",
	"=Height=":"=身高=",//==========================================
	"giant":"巨人",
	"giantess":"女巨人",
	"growth":"體型增大",
	"midget":"侏儒",
	"minigirl":"袖珍女人",
	"miniguy":"袖珍男人",
	"shrinking":"體型縮小",
	"tall girl":"高個女",
	"tall man":"高個男",
	"=Skin=":"=皮膚=",//==========================================
	"albino":"白化",
	"body writing":"身上寫字",
	"body painting":"人體彩繪",
	"dark skin":"黑皮膚",
	"freckles":"雀斑",
	"full body tattoo":"全身紋身",
	"gyaru":"太妹",
	"gyaru-oh":"馬仔",
	"oil":"抹油",
	"scar":"傷疤",
	"skinsuit":"人皮衣",
	"sweating":"出汗",
	"tanlines":"日曬線",
	"=Weight=":"=體重=",//==========================================
	"anorexic":"骨瘦如柴",
	"bbm":"胖帥男",
	"bbw":"胖美女",
	"weight gain":"體重增加",
	"=Head=":"=頭部=",//==========================================
	"brain fuck":"腦交",
	"cockslapping":"陰莖蹭臉",
	"ear fuck":"耳交",
	"elf":"小精靈",
	"facesitting":"顏面騎乘",
	"gasmask":"防毒面具",
	"hairjob":"發交",
	"masked face":"戴面具",
	"prehensile hair":"抓著頭髮",
	"=Mind=":"=心靈=",//==========================================
	"body swap":"身體交換",
	"chloroform":"迷藥",
	"corruption":"墮落",
	"drugs":"沉浸藥物",
	"drunk":"醉酒",
	"emotionless sex":"無感情性交",
	"mind break":"精神崩潰",
	"mind control":"思想控制",
	"parasite":"寄生",
	"possession":"佔據附身",
	"possess":"入替",
	"shared senses":"感官共用",
	"sleeping":"睡奸",
	"=Eyes=":"=眼睛=",//==========================================
	"blindfold":"遮眼",
	"cum in eye":"眼射",
	"eye penetration":"眼交",
	"eyemask":"眼部面具",
	"eyepatch":"眼罩",
	"glasses":"眼鏡",
	"sunglasses":"墨鏡",
	"unusual pupils":"非正常瞳孔",
	"=Nose=":"=鼻子=",//==========================================
	"nose fuck":"鼻交",
	"nose hook":"鼻鉤",
	"smell":"聞味道",
	"=Mouth=":"=嘴部=",//==========================================
	"autofellatio":"自己口交",
	"ball sucking":"吸奶子",
	"big lips":"大嘴唇",
	"blowjob":"口交",
	"blowjob face":"口交臉",
	"braces":"牙套",
	"burping":"打嗝",
	"coprophagia":"食糞",
	"cunnilingus":"舔陰",
	"deepthroat":"深喉",
	"double blowjob":"兩女一屌",
	"foot licking":"舔足",
	"gag":"堵嘴",
	"gokkun":"飲精",
	"kissing":"接吻",
	"long tongue":"長舌頭",
	"piss drinking":"喝尿",
	"rimjob":"舔菊花",
	"saliva":"唾液",
	"smoking":"吸煙",
	"tooth brushing":"刷牙",
	"unusual teeth":"牙型奇異",
	"vampire":"吸血鬼",
	"vomit":"嘔吐",
	"vore":"丸吞",
	"=Neck=":"=脖子=",//==========================================
	"asphyxiation":"窒息",
	"collar":"項圈",
	"=Arms=":"=手臂=",//==========================================
	"armpit licking":"舔腋下",
	"armpit sex":"腋下交",
	"fingering":"指奸",
	"fisting":"拳交",
	"handjob":"套弄雞雞",
	"hairy armpits":"腋下多毛",
	"=Chest=":"=胸部=",//==========================================
	"=Breasts=":"=乳房=",//==========================================
	"autopaizuri":"自己乳交",
	"big areolae":"大乳暈",
	"big breasts":"巨乳",
	"breast expansion":"乳房膨大",
	"breast feeding":"母乳餵養",
	"breast reduction":"乳房縮小",
	"huge breasts":"超巨乳",
	"lactation":"乳汁",
	"milking":"噴奶",
	"motorboating":"埋胸",
	"multiple paizuri":"多人乳交",
	"oppai loli":"巨乳蘿莉",
	"paizuri":"乳交",
	"small breasts":"貧乳",
	"=Nipples=":"=乳頭=",//==========================================
	"big nipples":"大乳頭",
	"dark nipples":"黑乳頭",
	"dicknipples":"雞巴乳頭",
	"inverted nipples":"乳頭內翻",
	"nipple expansion":"乳頭膨大",
	"nipple fuck":"肏乳頭",
	"=Torso=":"=軀幹=",//==========================================
	"inflation":"脹腹",
	"navel fuck":"肏肚臍",
	"pregnant":"孕婦Play",
	"stomach deformation":"胃變形",
	"=Lower Body=":"=下身=",//==========================================
	"=Crotch=":"=襠部=",//==========================================
	"bike shorts":"自行車短褲",
	"bloomers":"運動短褲",
	"chastity belt":"貞操帶",
	"diaper":"尿布",
	"fundoshi":"兜襠布",
	"gymshorts":"拳擊短褲",
	"hairy":"多陰毛",
	"pubic stubble":"陰毛茬",
	"shimapan":"條紋內褲",
	"urethra insertion":"尿道插入",
	"=Penile=":"=屌=",//==========================================
	"balls expansion":"睾丸膨大",
	"ball sucking":"吸奶子",
	"balljob":"睾丸交",
	"big balls":"大睾丸",
	"big penis":"大陰莖",
	"cbt":"虐睾丸",
	"cuntboy":"有屄的男人",
	"cockslapping":"陰莖蹭臉",
	"dick growth":"陰莖增長",
	"frottage":"雙屌互蹭",
	"futanari":"扶她",
	"futanari on male":"扶她X男人",
	"horse cock":"馬屌",
	"huge penis":"超大陰莖",
	"multiple penises":"多根陰莖",
	"penis birth":"長出陰莖",
	"phimosis":"包莖",
	"prostate massage":"前列腺按摩",
	"shemale":"人妖",
	"scrotal lingerie":"陰囊內衣",
	"smegma":"包皮垢",
	"=Vaginal=":"=屄=",//==========================================
	"big clit":"大陰蒂",
	"big vagina":"大陰道",
	"birth":"出產",
	"cervix penetration":"子宮脫出",
	"clit growth":"陰蒂增長",
	"cunnilingus":"舔陰",
	"defloration":"破處",
	"double vaginal":"兩屌一屄",
	"squirting":"潮吹",
	"strap-on":"假陽具",
	"tribadism":"兩屄互蹭",
	"triple vaginal":"三屌一屄",
	"vaginal sticker":"小穴貼",
	"=Buttocks=":"=臀部=",//==========================================
	"anal":"肛交",
	"anal birth":"肛門出產",
	"ass expansion":"屁股膨大",
	"assjob":"肏屁股",
	"big ass":"大屁股",
	"double anal":"兩屌一菊",
	"enema":"灌腸",
	"farting":"放屁",
	"pegging":"女攻男受",
	"rimjob":"舔菊花",
	"scat":"排糞Play",
	"spanking":"打屁股",
	"triple anal":"三屌一菊花",
	"=Either Hole=":"=各個穴=",//==========================================
	"eggs":"產蛋",
	"gaping":"豁開",
	"large insertions":"巨物插入",
	"nakadashi":"中出",
	"prolapse":"脫垂",
	"sex toys":"性玩具",
	"speculum":"內窺器",
	"unbirth":"鑽進屄裡",
	"=Legs=":"=腿部=",//==========================================
	"garter belt":"吊襪腰帶",
	"kneepit sex":"膝交",
	"leg lock":"夾腿",
	"pantyhose":"連褲襪",
	"stockings":"絲襪",
	"sumata":"素股",
	"=Feet=":"=腳部=",//==========================================
	"foot insertion":"腳入屄",
	"foot licking":"舔足",
	"footjob":"足交",
	"thigh high boots":"過膝長靴",
	"=Costume=":"=服飾=",//==========================================
	"apron":"圍裙",
	"bandages":"繃帶",
	"bike shorts":"自行車短褲",
	"bikini":"比基尼",
	"blindfold":"遮眼",
	"bloomers":"運動短褲",
	"bodystocking":"連身襪",
	"bodysuit":"緊身衣",
	"bride":"新娘",
	"bunny boy":"兔男",
	"bunny girl":"兔娘",
	"business suit":"商務裝",
	"butler":"男管家",
	"cashier":"收銀員",
	"catboy":"貓男",
	"catgirl":"貓娘",
	"cheerleader":"啦啦隊",
	"chinese dress":"中式服裝",
	"christmas":"聖誕裝",
	"collar":"項圈",
	"condom":"避孕套",
	"corset":"緊身胸衣",
	"cosplaying":"Cos裝",
	"cowgirl":"奶牛娘",
	"cowman":"男奶牛人",
	"crossdressing":"異性服裝",
	"diaper":"尿布",
	"dougi":"武道服",
	"eyemask":"眼部面具",
	"eyepatch":"眼罩",
	"fundoshi":"兜襠布",
	"gag":"堵嘴",
	"garter belt":"吊襪腰帶",
	"gasmask":"防毒面具",
	"glasses":"眼鏡",
	"gothic lolita":"哥特洛麗塔",
	"gymshorts":"拳擊短褲",
	"haigure":"高叉馬步(????)",
	"hijab":"頭巾",
	"kigurumi":"玩偶服",
	"kimono":"和服",
	"kunoichi":"女忍者",
	"lab coat":"白大褂",
	"latex":"乳膠衣",
	"leotard":"連體衣",
	"lingerie":"內衣",
	"living clothes":"觸手服",
	"magical girl":"魔法少女",
	"maid":"女仆",
	"mecha boy":"機甲男",//ehWiki
	"mecha girl":"機甲娘",
	"metal armor":"金属盔甲",
	"miko":"日本巫女",
	"military":"军装",
	"nazi":"纳粹",
	"ninja":"忍者",
	"nose hook":"鼻钩",
	"nurse":"护士",
	"pantyhose":"连裤袜",
	"pantyjob":"肏內褲",
	"pasties":"乳贴",
	"piercing":"穿孔",
	"policeman":"男員警",
	"policewoman":"女員警",
	"ponygirl":"女騎師",
	"race queen":"賽車女郎",
	"randoseru":"日式小學書包",
	"schoolboy uniform":"男校服",
	"schoolgirl uniform":"女校服",
	"schoolboy":"男學生",
	"schoolgirl":"女學生",
	"scrotal lingerie":"陰囊內衣",
	"shimapan":"條紋內褲",
	"stewardess":"制服",
	"stockings":"丝袜",
	"swimsuit":"泳装",
	"school swimsuit":"學校泳裝",
	"thigh high boots":"過膝長靴",
	"tights":"緊身服",
	"tracksuit":"運動服",
	"vaginal sticker":"小穴贴",
	"witch":"美式女巫",
	"=Multiple Activities=":"=多人活動=",//==========================================
	"double anal":"兩屌一菊",
	"double blowjob":"兩女一屌",
	"double vaginal":"兩屌一屄",
	"ffm threesome":"兩女一男",
	"fft threesome":"兩女一扶她",
	"group":"群P",
	"harem":"后宫",
	"layer cake":"換著插",
	"mmf threesome":"兩男一女",
	"mmt threesome":"兩男一扶她",
	"mtf threesome":"一男一女一扶她",
	"multiple paizuri":"多人乳交",
	"triple anal":"三屌一菊花",
	"triple vaginal":"三屌一屄",
	"ttf threesome":"兩扶她一女",
	"ttm threesome":"兩扶她一男",
	"twins":"双胞胎",
	"=Multiple Holes=":"=多個穴=",//==========================================
	"all the way through":"頭尾貫通",
	"double penetration":"雙穴貫通",
	"triple penetration":"三穴貫通",
	"=Tools=":"=工具=",
	"blindfold":"遮眼",
	"dakimakura":"抱枕",
	"gag":"堵嘴",
	"glory hole":"牆穴",
	"machine":"機械",
	"onahole":"自慰器",
	"pillory":"頸手枷",
	"pole dancing":"鋼管舞",
	"sex toys":"性玩具",
	"speculum":"內窺器",
	"strap-on":"假阳具",
	"syringe":"注射器",
	"table masturbation":"桌子自慰",
	"tube":"插管",
	"whip":"鞭打",
	"wooden horse":"木马",
	"wormhole":"蟲洞",
	"=Fluids=":"=流體=",//==========================================
	"oil":"抹油",
	"slime":"史莱姆",
	"slime girl":"史萊姆娘",
	"underwater":"水下性愛",
	"=Bodily Fluids=":"=体液=",//==========================================
	"=Semen=":"=精液=",//==========================================
	"bukkake":"颜射",
	"cum bath":"精液浴",
	"cum swap":"交換精液",
	"gokkun":"飲精",
	"nakadashi":"中出",
	"=Waste=":"=排泄物=",//==========================================
	"blood":"血液",
	"coprophagia":"食糞",
	"menstruation":"經血",
	"piss drinking":"喝尿",
	"public use":"公共使用",
	"saliva":"唾液",
	"scat":"排糞Play",
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
	"human pet":"人型寵物",
	"latex":"乳胶衣",
	"orgasm denial":"禁止高潮",
	"slave":"奴隶",
	"tickling":"瘙癢",
	"=Bondage=":"=束縛=",//==========================================
	"bondage":"捆绑",
	"gag":"堵嘴",
	"shibari":"繩藝",
	"stuck in wall":"卡牆裡",
	"vacbed":"乳膠真空床",
	"=Violence=":"=暴力=",//==========================================
	"abortion":"堕胎",
	"blood":"血液",
	"cannibalism":"同類相食",
	"catfight":"兩女相爭",
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
	"phone sex":"電話性愛",
	"selfcest":"自己X自己",
	"solo action":"自慰",
	"table masturbation":"桌子自慰",
	"=Disability=":"=残疾=",//==========================================
	"amputee":"人棍",
	"blind":"瞎子",
	"handicapped":"残疾",
	"mute":"哑巴",
	"=Gender=":"=性別=",//==========================================
	"cuntboy":"有屄的男人",
	"feminization":"男變女",
	"futanari":"扶她",
	"gender bender":"性別變化",
	"shemale":"人妖",
	"=Inter-gender Relations=":"=跨性別=",//==========================================
	"fft threesome":"兩女一扶她",
	"futanari on futanari":"扶她X扶她",
	"futanari on male":"扶她X男人",
	"male on futanari":"男人X扶她",
	"mmt threesome":"兩男一扶她",
	"mtf threesome":"一男一女一扶她",
	"ttf threesome":"兩扶她一女",
	"ttm threesome":"兩扶她一男",
	"=Technical=":"=技術=",//==========================================
	"3d":"3D",
	"anaglyph":"立體",
	"animated":"動畫",
	"anthology":"選集",
	"artbook":"畫集",
	"figure":"畫像",
	"first person perspective":"第一人稱",
	"full color":"全彩",
	"game sprite":"圖元畫",
	"multi-work series":"故事系列",//ehWiki
	"novel":"小說",
	"paperchild":"紙孩",
	"redraw":"重繪",
	"screenshots":"截圖",
	"story arc":"故事框架",
	"tankoubon":"单行本",
	"themeless":"无题",
	"x-ray":"透视",
	"=Censorship=":"=色情審查=",//==========================================
	"full censorship":"色塊遮擋",
	"mosaic censorship":"馬賽克遮擋",
	"uncensored":"未審查",
	"=Cosplay=":"=Cosplay=",//==========================================
	"hardcore":"重口味",
	"non-nude":"非裸體",
	"=Expunging=":"=刪除=",//==========================================
	"already uploaded":"已上傳過",
	"compilation":"匯集",
	"forbidden content":"禁止的內容",
	"realporn":"真正的色情",
	"replaced":"已更換",
	"watermarked":"有浮水印",
	"=Semi-Expunging=":"=半成品=",//==========================================
	"incomplete":"不完整",
	"out of order":"次序颠倒",
	"missing cover":"无封面",
	"sample":"样本",
	"scanmark":"掃描標記",
	"=Language=":"=语言=",//==========================================
	"albanian":"阿爾巴尼亞語",
	"arabic":"阿拉伯语",
	"caption":"自製標題",
	"catalan":"加泰羅尼亞語",
	"chinese":"汉语",
	"czech":"捷克語",
	"danish":"丹麥語",
	"dutch":"荷蘭語",
	"english":"英语",
	"esperanto":"世界語",
	"estonian":"愛沙尼亞語",
	"finnish":"芬蘭語",
	"french":"法語",
	"german":"德語",
	"greek":"希臘語",
	"hebrew":"希伯來語",
	"hindi":"印地語",
	"hungarian":"匈牙利語",
	"indonesian":"西澳特羅尼西亞語",
	"italian":"義大利語",
	"japanese":"日語",
	"korean":"韓語",
	"malay":"馬來語",
	"polish":"波蘭語",
	"poor grammar":"語義不通",
	"portuguese":"葡萄牙語",
	"rewrite":"重新修改",
	"romanian":"羅馬尼亞語",
	"russian":"俄羅斯語",
	"slovak":"斯洛伐克語",
	"spanish":"西班牙語",
	"speechless":"無文字",
	"swedish":"瑞典語",
	"tagalog":"他加祿語",
	"text cleaned":"無嵌字版",
	"thai":"泰語",
	"translated":"譯製品",
	"turkish":"烏克蘭語",
	"ukrainian":"烏克蘭語",
	"vietnamese":"越南語",
	"=Contextual=":"=語境=",//==========================================
	"blackmail":"勒索",
	"cheating":"出軌",
	"coach":"教練",
	"defloration":"破處",
	"females only":"只有女性",
	"males only":"只有男性",
	"impregnation":"內射",
	"netorare":"寢取",
	"prostitution":"賣淫",
	"swinging":"擺動",
//======================================================================================================================
	"western":"西方的",
	"misc":"雜 項",
	"imageset":"圖片集",
//藝術家
	"oouso":"大噓",
	"korie riko":"捆枝??",
	"peko":"??",
	"akaza":"???",
	"ishikei":"石惠",
	"happoubi jin":"八寶備仁(????? ??)",
	"kizuki aruchu":"鬼月????",
	"harumi chihiro":"晴見千尋（??????）",
//團隊
	"usotsukiya":"噓??屋",
	"softstar":"大宇資訊",
//語言和色彩類
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
//同人題材類
	"touhou":"东方",
	"touhou project":"東方Project",
	"moetan":"萌單",
	"ore no imouto ga konna ni kawaii wake ga nai":	"我的妹妹不可能那麼可愛",
	"toaru kagaku no railgun":"某科學的超電磁炮",
	"kantai collection":"艦隊collection",
	"pokemon | pocket monsters":"精靈寶可夢",
	"higurashi no naku koro ni | when they cry":"寒蟬鳴泣之時",
	"saki":"天才麻將少女",
	"puella magi madoka magica":"魔法少女小圓",
	"lotte no omocha":"露蒂的玩具",
	"sword art online":"刀劍神域",
	"to love-ru":"To LOVE?",
	"ro-kyu-bu":"蘿球社",
	"tantei opera milky holmes":"偵探歌劇 少女福爾摩斯",
	"hyperdimension neptunia | choujigen game neptune":"超次元遊戲：海王星",
	"love live":"Love Live!",
	"sora no otoshimono | heavens lost property":"天降之物",
	"boku wa tomodachi ga sukunai":"我的朋友很少",
	"vocaloid":"V家",
	"date a live":"約會大作戰",
	"gochuumon wa usagi desu ka | is the order a rabbit":"今天你也要來點兔子嗎？",
//角色
	"wriggle nightbug":"莉格露·奈特巴格",
	"mystia lorelei":"斯蒂婭·蘿蕾拉",
	"reimu hakurei":"博麗靈夢",
	"marisa kirisame":"霧雨魔理沙",
	"rumia":"露米婭",
	"cirno":"琪露諾",
	"daiyousei":"大妖精",
	"hong meiling":"紅美鈴",
	"patchouli knowledge":"帕秋莉‧諾蕾姬",
	"koakuma":"小恶魔",
	"sakuya izayoi":"十六夜咲夜",
	"remilia scarlet":"蕾米莉亞‧斯卡雷特",
	"flandre scarlet":"芙蘭朵露‧斯卡雷特",
	"letty whiterock":"蕾迪‧霍瓦特羅克",
	"chen":"橙",
	"ink nijihara":"虹原茵可",
	"pastel ink":"閃亮茵可",
//外觀類
	"small breasts":"小胸部",
	"big breasts":"大胸部",
	"huge breasts":"超級大胸部",
	"pantyhose":"连裤袜",
	"stockings":"长筒袜",
	"bloomers":"灯笼裤",
	"glasses":"戴眼鏡的",
	"exhibitionism":"暴露狂",
	"breast expansion":"乳房膨脹",
	"swimsuit":"泳装",
	"lingerie":"女用貼身內衣褲",
	"mind break":"精神受创",
	"ahegao":"高潮顏",
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
	"garter belt":"吊带裤",
	"dark skin":"黑皮肤",
	"dougi":"各種武術類的服裝",
	"butler":"帶領結的燕尾服",
	"hotpants":"紧身短裤",
	"tracksuit":"运动服",
	"corset":"緊身胸衣",
	"latex":"乳膠橡膠衣物（緊身）",
	"rubber":"乳膠橡膠衣物（緊身）",
	"big balls":"異常大的睾丸",
	"bandages":"绷带",
	"bbm":"胖男人",
	"lab coat":"实验室外套",
	"bike shorts":"自行車短褲",
	"thigh high boots":"长筒靴",
	"metal armor":"金属盔甲",
	"inverted nipples":"乳头凹陷",
	"human pet":"把人當成寵物來對待",
	"bunny girl":"兔女、兔女郎",
	"dog girl":"狗娘",
	"shimapan":"條紋胖次",
	"mecha girl":"机甲少女",
	"gothic lolita":"哥特萝莉",
	"business suit":"西装",
	"muscle":"肌肉",
	"monster girl":"怪物女孩",
	"eyemask":"眼罩",
	"scrotal lingerie":"陰囊穿內衣",
	"sundress":"太陽裙(夏裝)",
	"gymshorts":"拳擊短褲",
	"chinese dress":"中國衣著（旗袍）",
	"minigirl":"迷你女孩",
	"invisible":"隐形人",
	"gyaru":"日式太妹（原宿風）",
	"schoolgirl uniform":"學校女生制服",
	"schoolboy uniform":"學校男生制服",
	"albino":"白化病",
	"bodysuit":"全包緊身衣",
	"tall man":"高男人",
	"anorexic":"厭食症",
	"masked face":"面具",
	"oil":"油覆蓋皮膚",
	"chastity belt":"貞操帶",
	"vaginal sticker":"陰部貼紙",
	"scar":"刀疤",
//年齡、職業或身份類
	"inseki":"姻親",
	"sister":"姐姐或妹妹",
	"mother":"母親",
	"father":"父親",
	"brother":"哥哥或弟弟",
	"niece":"侄女",
	"aunt":"阿姨",
	"uncle":"叔叔",
	"daughter":"女兒",
	"lolicon":"蘿莉",
	"shotacon":"正太",
	"mature":"成熟的(通常指年紀較大的人)",
	"schoolgirl":"女學生",
	"schoolboy":"男學生",
	"maid":"女僕",
	"nurse":"護士",
	"teacher":"教師",
	"bride":"新娘",
	"princess":"公主",
	"nun":"修女",
	"vampire":"吸血鬼",
	"catgirl":"貓女",
	"catboy":"貓男",
	"dog":"狗",
	"interracial":"不同人種間的",
	"futanari":"扶她",
	"futanari on futanari":"扶她上扶她",
	"male on futanari":"男的上扶她",
	"futanari on male":"扶她上男的",
	"shemale":"人妖(後天的)",
	"gender bender":"跟異性的舉動、打扮一樣的人(偽娘或偽男)",
	"crossdressing":"穿異性服裝(女裝或男裝)",
	"age regression":"返老还童",
	"virginity":"处女",
	"school boy":"男学生",
	"demon":"恶魔",
	"angel":"天使",
	"policewoman":"女員警",
	"miko":"巫女",
	"military":"軍服",
	"milf":"年龄在30-50岁的女人",
	"harem":"后宫",
	"fairy":"仙女",
	"dilf":"年齡在30-50歲的老男人",
	"magical girl":"馬猴燒酒（魔法少女)",
	"elf":"精灵",
	"kunoichi":"女忍者",
	"witch":"女巫",
	"demon girl":"女妖",
	"twins":"双胞胎",
	"chikan":"痴汉",
	"old man":"老男人",
	"cousin":"堂[表]兄弟姊妹",
	"cheerleader":"啦啦队长",
	"tomboy":"女同假陽具(假小子)",
	"valkyrie":"女武神",
	"stewardess":"女乘務員",
	"coach":"訓練、教練",
	"voyeurism":"窺陰癖者",
	"yandere":"病嬌",
	"unusual pupils":"不尋常的瞳孔",
	"snake girl":"蛇女",
	"tutor":"校外導師(家教)",
	"wolf girl":"狼女",
	"widower":"鰥夫",
	"widow":"寡妇",
	"tomgirl":"娘娘腔",
	
//動作類
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
	"fingering":"用手指撥弄",
	"prostate massage":"前列腺按摩",
	"cum bath":"精液浴",
	"fisting":"拳交",
	"large insertions":"大的插入",
	"urethra insertion":"尿道插入",
	"necrophilia":"恋尸癖",
	"bukkake":"顏射",
	"gag":"塞口器",
	"piss drinking":"喝尿",
	"nakadashi":"中出",
	"deepthroat":"深喉",
	"swinging":"交換性伴侶(擺動)",
	"blackmail":"性勒索",
	"tanlines":"曬黑的",
	"squirting":"潮吹",
	"chloroform":"氯仿（迷藥）",
	"drugs":"药物（媚药）",
	"sleeping":"睡觉",
	"spanking":"被打屁股",
	"cunnilingus":"舔阴部",
	"time stop":"时间停止",
	"dick growth":"陰莖生長",
	"selfcest":"自己X自己",
	"electric shocks":"电击",
	"body painting":"人体彩绘",
	"body writing":"人体写作",
	"ryona":"虐待",
	"piercing":"穿刺",
	"filming":"拍摄",
	"tribadism":"交叉體位（女同）",
	"hairjob":"髮絲交",
	"sumata":"股間性交",
	"underwater":"水下",
	"leg lock":"夹腿",
	"rimjob":"舔肛",
	"kissing":"接吻",
	"double blowjob":"雙人口交",
	"pegging":"女插男",
	"frottage":"摩擦淫",
	"pantyjob":"內褲交",
	"assjob":"屁股交",
	"triple penetration":"三人互插",
	"facesitting":"坐脸",
	"grandmother":"老奶奶",
	"grandfather":"祖父",
	"granddaughter":"孙女",
	"table masturbation":"桌角自慰",
	"milking":"擠奶",
	"armpit licking":"腋下舔 ",
	"prolapse":"子宮脱垂",
	"orgasm denial":"拒绝高潮",
	"phone sex":"打电话性交",
	"whip":"鞭打",
	"big clit":"大阴蒂",
	"gaping":"张口的",
	"pillory":"枷刑",
	"tickling":"撓癢",
	"nose hook":"鉤鼻子",
	"gokkun":"饮精",
	"foot licking":"舔足",
	"cum swap":"左右交换口交",
	"solo action":"獨自愉悅",
	"emotionless sex":"無表情性交（冷漠.jpg）",
	"tailjob":"尾巴性交",
	"brain fuck":"入腦性交",
	"dickgirl on dickgirl":"扶她上扶她",
	"male on dickgirl":"男的上扶她",
	"dickgirl on male":"扶她上男的",
	"ball sucking":"嘴吸蛋蛋",
	"sweating":"出汗",
	"smell":"嗅氣味",
	"cbt":"雞\/蛋酷刑",
//類型類
	"incest":"乱伦",
	"netorare":"NTR",
	"guro":"猎奇",
	"yuri":"女同(GL)",
	"yaoi":"男同(BL)",
	"femdom":"女性支配",
	"original":"原创",
	"mind control":"精神控制",
	"body swap":"身體交換",
	"tentacles":"触手",
	"bestiality":"兽奸",
	"cheating":"出轨(和NTR不同)",
	"monster":"怪物",
	"wore":"丸吞",
	"inflation":"胃區膨脹",
	"unbirth":"從B鑽出來",
	"skinsuit":"画皮（换皮）",
	"absorb":"融合（皮類常用標籤）",
	"psssession":"佔據（皮類常用標籤）",
	"birth":"出產",
	"eggs":"生蛋",
	"furry":"毛皮",
	"worm":"虫子",
	"amputee":"殘肢（四肢切斷的人棍）",
	"bbw":"胖女人",
	"wings":"翅膀",
	"christmas":"圣诞服裝",
	"waiter":"服务员",
	"waitress":"女服务员",
	"mmf threesome":"二男一女（3P）",
	"ffm threesome":"二女一男（3P）",
	"condom":"避孕套",
	"eyepatch":"眼罩",
	"multiple penises":"多個陰莖",
	"impregnation":"性行為後懷孕",
	"stomach deformation":"胃部突起",
	"tankoubon":"单行本",
	"machine":"性機器",
	"big penis":"大阴茎",
	"strap-on":"可連接的假陽具",
	"anthology":"選集（多個作者）",
	"full censorship":"全面體檢",
	"leg locks":"脚锁",
	"art book":"畫集",
	"full body tattoo":"纹身",
	"uncensored":"未经审查（通常无码）",
	"vomit":"呕吐物",
	"torture":"酷刑",
	"bdsm":"虐恋调教",
	"tube":"管子",
	"wooden horse":"木马",
	"public use":"公眾使用",
	"speculum":"窺器",
	"smegma":"包皮垢",
	"insect":"昆蟲",
	"slime":"粘液",
	"huge penis":"巨大的阴茎",
	"zombie":"丧尸",
	"diaper":"尿布",
	"octopus":"章魚",
	"onahole":"自慰器",
	"girls only":"只有女的",
	"guys only":"只有男的",
	"corruption":"腐朽（墮落？）",
	"blood":"血",
	"snuff":"死去",
	"animated":"GIF動畫的",
	"double vaginal":"雙陰道的",
	"triple vaginal":"三陰道的",
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
	"gasmask":"防毒面罩",
	"infantilism":"幼稚型",
	"parasite":"寄生虫",
	"horse":"马",
	"age progression":"年龄进展",
	"plant girl":"植物（怪物娘）",
	"slime girl":"史萊姆（怪物娘）",
	"themeless":"无主题的",
	"cervix penetration":"子宮頸透視",
	"prostitution":"卖淫 / 援交",
	"hairy":"多毛的",
	"robot":"机器人",
	"sole male":"男角唯一",
	"sole female":"女角唯一",
	"oni":"鬼（日本神话）",
	"females only":"只有女性",
	"low lolicon":"未通過蘿莉控",
	"alien girl":"外星女孩",
	"double anal":"肛門雙交", //兩個陰莖插入相同的肛門
	"males only":"只有男性",
	"spider girl":"蜘蛛女孩",
	"netonare":"NTR綠帽子",
	"bunny ears":"兔耳",
	"big nipples":"大乳頭",
	"humiliation":"淩辱",
	"sex addict":"性成癮",
	"bisexual":"雌雄同體或雙性戀",
	"gender swap":"性交換",
	"transform":"變身",
	"side ponytail":"雙馬尾",
	"ponytail":"馬尾",
	"cat ears":"猫耳",
	"cavalry":"騎兵",
	"monoeye":"天生單眼",
	
//重新分類
	"doujinshi":"同人本",
	"manga":"漫画杂志"
};



function translateR(word){ //尋找翻譯
	var word2 = word;
	word = word.substr(0,word.length-1);	
	var txt = rData[word];					//翻譯不存在返回原文本，否則返回翻譯後的文本。
	if (txt == undefined) 
			return word;
　	else	return txt;
}
//英語翻譯函數
function translate(word){ //尋找翻譯
	var txt = tData[word];//翻譯不存在返回原文本，否則返回翻譯後的文本。
	if (txt == undefined)
			return word;
	else	return txt;
}

var GalleryCategory = {
	 "Doujinshi"		:"同人志 : Doujinshi"
	,"Manga"			:"漫画 : Manga"
	,"Artist CG Sets"	:"畫師繪圖 : Artist CG Sets"
	,"Game CG Sets"		:"游戏CG : Game CG Sets"
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
	var tab 	= taglist.getElementsByTagName("table").item(0);//TAG清單裡的表格
	if(!tab) return;
	var rowsl 	= tab.rows.length;						//行數
	
	for(var ir 	= 0;ir < rowsl;ir++){
		var rowt 			= tab.rows.item(ir);		//該行
		var cell_rowname 	= rowt.cells.item(0);		//該行名
		var cell_tags 		= rowt.cells.item(1);		//該行TAG
		var tags 			= cell_tags.getElementsByTagName("div");
		var eword 			= cell_rowname.textContent;	//去掉行名的冒號
		var traR 			= translateR(eword);		//翻譯
		if (traR && traR !== eword) cell_rowname.innerHTML = traR + ":";
		
		for(var ic = 0;ic < tags.length;ic++){
			var tag 	= tags.item(ic);							//該TAG
			var taga 	= tag.getElementsByTagName("a").item(0);	//該TAG的連接
			if(!taga) continue;
			var eword 	= taga.textContent;							//該TAG的文字
			var tra 	= translate(eword);							//翻譯
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