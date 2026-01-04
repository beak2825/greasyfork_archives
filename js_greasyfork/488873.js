// ==UserScript==
// @name         小说下载-红袖招
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  小说下载，个人测试使用，主要是为了熟悉js的语法
// @author       You
// @match        https://hongxiue.com/*
// @match        https://hongxiuf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixunshu.net
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/488873/%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD-%E7%BA%A2%E8%A2%96%E6%8B%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/488873/%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD-%E7%BA%A2%E8%A2%96%E6%8B%9B.meta.js
// ==/UserScript==

var g_chapterURLList = [];//全部章节列表
var g_paragraphList = [];//段落内容列表 [临时变量] 所有的段落和在一起就是一本书
var g_chapterList = [];//章节内容列表
var g_bTestDownload = false;
var g_iTestDownloadCnt = 1;
var g_handleCnt = 0;
var g_chapterPromises = [];
var g_iMaxPromiseCount = 3;
var g_needSleep = false;
var g_replaceMap = new Map([
['\uE290','操'],['\uE291','嫩'],['\uE292','扭'],['\uE293','揉'],['\uE294','硬'],['\uE295','奸'],['\uE296','吸'],['\uE297','处'],['\uE298','道'],['\uE299','毛'],['\uE29A','捅'],['\uE29B','催'],['\uE29C','身'],['\uE29D','捏'],['\uE29E','芭'],['\uE29F','股'],['\uE2A0','搞'],['\uE2A1','喘'],['\uE2A2','翻'],['\uE2A3','握'],['\uE2A5','入'],['\uE2A7','翘'],['\uE2A8','迷'],['\uE2A9','嘴'],['\uE2AA','扒'],['\uE2AB','摸'],['\uE2AC','抽'],['\uE2AD','耻'],['\uE2AE','裸'],['\uE2AF','弄'],['\uE2B0','臀'],['\uE2B1','腹'],['\uE2B2','鸡'],['\uE2B3','肉'],['\uE2B4','粗'],['\uE2B5','肤'],['\uE2B6','挺'],['\uE2B7','流'],['\uE2B8','淫'],['\uE2B9','唇'],['\uE2BA','下'],['\uE2BB','头'],['\uE2BC','插'],['\uE2BD','舔'],['\uE2BE','湿'],['\uE2BF','屄'],['\uE2C0','纤'],['\uE2C1','阴'],['\uE2C2','脚'],['\uE2C3','射'],['\uE2C4','推'],['\uE2C5','精'],['\uE2C6','媚'],['\uE2C7','咬'],['\uE2C8','舐'],['\uE2C9','乳'],['\uE2CA','干'],['\uE2CB','抚'],['\uE2CC','欲'],['\uE2CD','钻'],['\uE2CE','潮'],['\uE2CF','做'],['\uE2D0','骚'],['\uE2D1','体'],['\uE2D2','房'],['\uE2D3','掏'],['\uE2D4','满'],['\uE2D5','阳'],['\uE2D6','叉'],['\uE2D7','性'],['\uE2D8','裤'],['\uE2D9','拔'],['\uE2DA','光'],['\uE2DB','茎'],['\uE2DC','丰'],['\uE2DD','含'],['\uE2DE','根'],['\uE2DF','浪'],['\uE2E0','色'],['\uE2E1','胸'],['\uE2E2','龟'],['\uE2E3','药'],['\uE2E4','漏'],['\uE2E5','痒'],['\uE2E6','顶'],['\uE2E7','尿'],['\uE2E8','荡'],['\uE2E9','勃'],['\uE2EA','情'],['\uE2EB','贪'],['\uE2EC','诱'],['\uE2ED','沟'],['\uE2EE','吻'],['\uE2EF','腿'],['\uE2F0','爱'],['\uE2F1','坚'],['\uE2F3','液'],['\uE2F4','女'],['\uE2F5','屁'],['\uE2F6','席'],['\uE2F7','穴'],['\uE2F8','白'],['\uE2F9','趴'],['\uE2FA','奶'],['\uE2FB','撩'],['\uE2FC','罩'],['\uE2FD','裙'],['\uE2FE','滑'],['\uE2FF','软'],['\uE300','蜜'],['\uE301','柔'],['\uE302','搓'],['\uE303','吹'],['\uE304','尻'],['\uE305','爆'],['\uE306','交'],['\uE307','吮'],['\uE308','水'],['\uE309','脱'],['\uE30A','露'],['\uE30B','口'],['\uE30C','的'],['\uE30D','袜'],['\uE30E','呻'],['\uE30F','妇'],['\uE310','逗'],['\uE311','腰'],['\uE312','洞'],['\uE313','胀'],['\uE314','啊'],['\uE315','蒂'],['\uE316','户'],['\uE317','肥'],['\uE320','共'],['\uE321','党'],['\uE322','习'],['\uE323','产']
]);

//过滤一段文本 将其中的特殊字符替换正确
function fun_filterText(txt)
{
	g_replaceMap.forEach(function(value, key){
		txt = txt.replaceAll(key,value);
	});
	
	return txt;
}

//睡眠一段时间
function fun_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//从内容中获取文本
function fun_getContentFromHTML(html)
{
    // 将 HTML 字符串转换为 jQuery 对象
    var $tempDiv = $(html);

    // 获取 id 为 "booktxt" 的 div 元素
    var $booktxtDiv = $tempDiv.find('.article-content');

    // 如果未找到对应的 div，则提示错误并返回空字符串
    if (!$booktxtDiv.length) {
        console.error('未找到 id 为 "content" 的 div 元素');
		throw new Error('error 未找到 id 为 "content" 的 div 元素');
        return '';
    }
	
	let lines = [];
	
	$booktxtDiv.find('p').each(function() {
		if ($(this).attr('style')) 
			return;
		if($(this).find('a').length != 0)
			return;
		
		var text = this.textContent.trim();
		
		lines.push(text);
	});
	
	var txt = lines.join('\n');
	
    return fun_filterText(txt);
}


//这里有个问题，这个框架实际上并没有被抽象出来，基本上还是得按需调整
// 获取每一章的内容 一页一页的获取
async function fun_getChapterContenPageByPage(url) {
    console.log("正在获取章节内容：" + url);
    try {
        // 发送 HTTP 请求并等待响应
        const response = await fetch(url);
        const data = await response.text();

        //定义一个临时变量，最终需要返回
        var paragraphList = [];

        var regex = /page=/;
        if (regex.test(url)) {
            console.log("链接中包含 page=");
        } else {
            console.log("链接中不包含 page=");
            var sixthChild = $(data).find('.con_top').contents()[6];
            var chapterTitle = "";
            // 移除文本的前三个字符
            if (sixthChild.nodeType === Node.TEXT_NODE && sixthChild.nodeValue.length >= 3) {
                 chapterTitle = sixthChild.nodeValue.substring(3);
            }

            if(chapterTitle.length > 0)
            {
                paragraphList.push("");
                paragraphList.push(chapterTitle); //TODO 暂时不处理章节名称
                paragraphList.push("");
            }
        }

        // 获取当前页面的小说内容
        var content = fun_getContentFromHTML(data);


        // 将当前页面的小说内容存储到数组中
        paragraphList.push(content);

        // 检查是否有下一页按钮
        var nextPageBtn = $(data).find('a[rel="prev"]:contains("下一页")');
        if (nextPageBtn.length > 0) {
            // 获取下一页链接
            var nextPageLink = nextPageBtn.attr('href');
            console.log("存在下一页，继续获取：", nextPageLink);
            // 继续获取下一页的内容
            var nextContentList = await fun_getChapterContenPageByPage(nextPageLink); // 使用 await 等待递归调用完成
            paragraphList = paragraphList.concat(nextContentList);
        } else {
            console.log("已到达最后一页，停止获取内容。");
        }

        return paragraphList;
    } catch (error) {
        console.error("请求失败:", error);
        g_needSleep = true;
    }
}


//从指定页面获取完整的一页数据 
async function fun_getChapterContenFromOnePage(url) {
	console.log("正在获取章节内容：" + url);
    try {
        //请求
        const response = await fetch(url);
        const data = await response.text();
		//console.log(data);
    
		
		let paragraphList = [];
		
		//章节头部
		let chapterTitle = $(data).find('.article-content h1:first').text();
		if (chapterTitle.length !== 0)
		{
			paragraphList.push("");
			paragraphList.push(chapterTitle); //TODO 暂时不处理章节名称
			paragraphList.push("");
		}
		
		//获取主体内容
        var content = fun_getContentFromHTML(data);
        paragraphList.push(content);
        return paragraphList;
    } catch (error) {
        console.error("请求失败:", error);
        g_needSleep = true;
    }
}


async function fun_getChapterContentPromise(url)
{
    return new Promise(async (resolve, reject) => {
        try {
            var contentList = await fun_getChapterContenFromOnePage(url);
            const resultMap = new Map();
            resultMap.set(url, contentList);
            resolve(resultMap);
            g_handleCnt += 1;
            console.log("进度："+g_handleCnt+"/"+g_chapterURLList.length);
        } catch (error) {
            reject(error);
        }
    });

}

//获取章节列表
async function fun_getChapterList(url)
{
    console.log("正在获取章节列表: "+url);
    try {
        // 发送 HTTP 请求并等待响应
        const response = await fetch(url);
        const data = await response.text();

        // 找到章节链接所在的元素
        var chapterContainer = $(data).find('#content_1');

        // 遍历所有章节链接
        chapterContainer.find('a[rel="chapter"]').each(function() {
            // 获取章节链接
            var chapterLink = $(this).attr('href');
            // 添加到章节列表
            g_chapterURLList.push(chapterLink);
        });

        // 找到包含“下一页”文本的按钮
        var nextPageBtn = $(data).find('.index-container-btn:contains("下一页")');
        if (nextPageBtn.length > 0) {
            // 获取下一页链接
            var nextPageLink = nextPageBtn.attr('href');
            // 继续获取下一页的章节链接
            await fun_getChapterList(nextPageLink);
        } else {
            // 输出章节列表
            console.log("所有章节链接获取完毕。");
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

//获取章节页的地址
function fun_getChapterListUrl()
{
    var chapterURL = "";
    $('a[rel="chapter"] dt:contains("点击查看全部章节目录")').each(function() {
        // 获取当前元素的链接地址
        chapterURL = $(this).parent().attr('href');
        console.log("章节目录的URL是：" + chapterURL);
    });
    return chapterURL;
}


//从当前页面获取所有的章节 
function fun_getChapterListFromCurPage()
{
	let dtCnt = 0;
	//第二个dt之后的所有内容全部都是
	$('.m-chapters a').each(function() {
		// 获取章节链接
		var chapterLink = $(this).attr('href');
		// 添加到章节列表
		g_chapterURLList.push(chapterLink);
	});
}


//获取小说下载的名称
function fun_getNovelSaveName() {
    var bookTitle = $('.m-info > h1:first').text();
    var author = $('.m-info .author > a:first').text()
    var originalBookName = '《' + bookTitle + '》作者：' + author;
    var optimizedBookName = originalBookName.replace(/[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/g, 'x');

    return {
        originalBookName: bookTitle,
        author: author,
        optimizedBookName: optimizedBookName
    };
}

//并行的获取一批数据
async function fun_PromiseHandle(resmap)
{
    try {
        const resultArray = await Promise.all(g_chapterPromises);
        // console.log(resultArray);
        // 这里可以继续处理resultMap
        resultArray.forEach((tempMap) => {
            tempMap.forEach((value,key) => {
                resmap.set(key, value);
            });
        });
    } catch (error) {
        console.error('Error fetching chapter content:', error);
    }
    g_chapterPromises = [];
}

//遍历章节列表，逐步下载小说内容 //这里是可以调整的，使用Promise并发的进行请求
async function fun_downloadChapterUrlList(chapterList)
{
   let bInterrupt = false;
    for (let i = 0; i < chapterList.length; i++)
    {
        let url = chapterList[i];
        let p = fun_getChapterContentPromise(url);
        g_chapterPromises.push(p);
        if(g_chapterPromises.length >=g_iMaxPromiseCount)
        {
           await fun_PromiseHandle(g_resmap);
        }

        if(g_needSleep)
        {
            console.log("过程中出现错误，睡眠3秒...");
            await fun_sleep(3000);
            g_needSleep = false;
            console.log("睡眠结束！");
        }

        if(g_bTestDownload && i>=(g_iTestDownloadCnt-1)) 
		{
			bInterrupt = true;
			break;
		}
    }
	
	//需要再执行一次，保证余下的
	await fun_PromiseHandle(g_resmap);
	
	let failedList = [];
	
	//如果中断直接退出执行
	if(bInterrupt) 
	{
		g_chapterURLList.forEach((url)=>{
			const dataArray = g_resmap.get(url);
			if(dataArray === undefined)
				return;
			
			dataArray.forEach((d)=>{
				g_paragraphList.push(d);
			});
		});
		return failedList;
	}

    

    g_chapterURLList.forEach((url)=>{
        const dataArray = g_resmap.get(url);
        if(dataArray === undefined)
        {
            failedList.push(url);
            return;
        }
        dataArray.forEach((d)=>{
            g_paragraphList.push(d);
        });
    });


    if(failedList.length !=0)
        g_paragraphList = [];

    return failedList;
}

//下载小说
async function fun_downloadNovel()
{
    //清空存储容器
    g_chapterURLList = [];
    g_chapterList = [];
    g_paragraphList = [];
    g_resmap = new Map();
    g_handleCnt = 0;

    let g_bookHeader = [];
    console.log("正在下载小说...");

    //获取保存的文件名称
    let novelInfo = fun_getNovelSaveName();
    console.log("书籍名称："+novelInfo.optimizedBookName);

    //插入下载信息
    g_bookHeader.push("书名：" + novelInfo.originalBookName);
    g_bookHeader.push("作者：" + novelInfo.author);
    g_bookHeader.push("地址：" + window.location.href);
    g_bookHeader.push("下载：雯饰太一");
    g_bookHeader.push("形式：网页插件");
    g_bookHeader.push("说明：数据为网页爬取而来，作者写作不易，请尊重正版原创");
    g_bookHeader.push("");
    g_bookHeader.push("");

	fun_getChapterListFromCurPage();
    if (g_chapterURLList.length == 0)
    {
        console.log("章节列表为空，取消下载任务")
        return;
    }
    else
    {
        console.log("章节总数：\n"+g_chapterURLList.length);
    }

    failedList = g_chapterURLList;
    let iDownloadBatch = 1;
    while(failedList.length!=0)
    {
        console.log("当前下载批次："+iDownloadBatch);
        failedList = await fun_downloadChapterUrlList(failedList);
        iDownloadBatch += 1;
    }


    //内容拼接
    let allContents = g_bookHeader.join('\n') + g_paragraphList.join('\n');

    // 计算内容大小
    let contentSizeKB = (new Blob([allContents])).size / 1024; // 转换为 KB
    let contentSizeMB = contentSizeKB / 1024; // 转换为 MB

    // 输出内容大小
    if (contentSizeMB >= 1) {
        console.log("内容大小:", contentSizeMB.toFixed(2) + " MB");
    } else {
        console.log("内容大小:", contentSizeKB.toFixed(2) + " KB");
    }

    //将内容下载为文件
    let blob = new Blob([allContents], { type: "text/plain;charset=utf-8" });
    saveAs(blob, novelInfo.optimizedBookName+".txt");
}

//插入下载按钮
function fun_insertDownloadInfo() {
    var newButton = $('<button id="local_download_btn">下载书籍</button>'); // 设置按钮的id为'local_download_btn'
    $('.ops').append(newButton);
    $('#local_download_btn').click(function() { // 使用按钮的id来绑定点击事件
        fun_downloadNovel();
    });
}


//判断当前url是什么类型的界面 0 不匹配 1 书籍主页 2 目录页 3 章节页
function fun_ruleMatch(url)
{
	if($('.inner .m-info .author').length >=0)
	{
		return 1;
	}
	return 0;
}


(function() {
    'use strict';

    // Your code here...
    var locUrl = window.location.href;
    console.log(locUrl);
    var rule_type = fun_ruleMatch(locUrl);
    if(rule_type == 0)
    {
        console.log("不是书籍主页，脚本不生效！");
        return;
    }
    else if(rule_type == 1)
    {
        console.log("脚本已激活，正在插入下载按钮...");
        fun_insertDownloadInfo();
        return;
    }

})();