// ==UserScript==
// @name         小说下载-笔趣阁
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  小说下载，个人测试使用，主要是为了熟悉js的语法
// @author       You
// @match        https://www.xbiquge.bz/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixunshu.net
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/488818/%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD-%E7%AC%94%E8%B6%A3%E9%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/488818/%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD-%E7%AC%94%E8%B6%A3%E9%98%81.meta.js
// ==/UserScript==

var g_chapterURLList = [];//全部章节列表
var g_paragraphList = [];//段落内容列表 [临时变量] 所有的段落和在一起就是一本书
var g_chapterList = [];//章节内容列表
var g_bTestDownload = false;
var g_iTestDownloadCnt = 20;
var g_handleCnt = 0;
var g_chapterPromises = [];
var g_iMaxPromiseCount = 5;
var g_needSleep = false;


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
    var $booktxtDiv = $tempDiv.find('#content');

    // 如果未找到对应的 div，则提示错误并返回空字符串
    if (!$booktxtDiv.length) {
        console.error('未找到 id 为 "content" 的 div 元素');
        return '';
    }
	
	let lines = [];
	
	$booktxtDiv.contents().each(function() {
		// 检查当前节点是否是文本节点
		if (this.nodeType === Node.TEXT_NODE) {
			// 去除当前文本节点的首尾空格，并判断是否为空字符串
			var text = this.textContent.trim();
			if (text !== "") {
				lines.push(text);
			}
		}
	});
	
    // 返回合并后的文本
    return lines.join('\n');
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
        const gbkData = await response.arrayBuffer();
		//console.log(gbkData);
		
		const decoder = new TextDecoder("gbk");
		const data = decoder.decode(gbkData);
		//console.log(data);
    
		
		let paragraphList = [];
		
		//章节头部
		let chapterTitle = $(data).find('.bookname h1:first').text();
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
	$('#list dl').children().each(function() {
		// 获取当前子标签的标签名
		var tagName = this.tagName.toLowerCase();

		// 检查标签名是否是dt或dd
		if (tagName === 'dt') dtCnt+=1;
		if (dtCnt >= 2)
		{
			var url = $(this).find('a').attr('href');
			if(url)
			{
				g_chapterURLList.push(url);
			}
		}
	});
}


//获取小说下载的名称
function fun_getNovelSaveName() {
    var bookTitle = $('meta[property="og:novel:book_name"]').attr('content');
    var author = $('meta[property="og:novel:author"]').attr('content');
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
    $('.box_con').append(newButton);
    $('#local_download_btn').click(function() { // 使用按钮的id来绑定点击事件
        fun_downloadNovel();
    });
}


//判断当前url是什么类型的界面
function fun_ruleMatch(url)
{
    var rule_type = 0;//0 不匹配 1 书籍主页 2 目录页 3 章节页
    var rule_locUrlCheck = "https://www.xbiquge.bz/book/[0-9]*/";
    var regex = new RegExp(rule_locUrlCheck);
    if (regex.test(url)) {
        rule_type = 1;
    } else {
        rule_type = 0;
    }
    return rule_type;
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