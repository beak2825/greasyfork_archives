// ==UserScript==
// @name         MoeShareAutoPost
// @namespace    https://github.com/fhyxz001/MoeShareAutoPost
// @version      0.251
// @description  萌享论坛资源区发贴格式化工具，用于帮助用户方便的进行资源发布
// @author       hexbkyoma&DIBAO
// @match        https://moeshare.cc/post.php?fid=22
// @match        https://moeshare.cc/post.php?fid=33
// @match        https://moeshare.cc/post.php?fid=28
// @match        https://moeshare.cc/post.php?fid=4
// @match        https://moeshare.cc/post.php?fid=42
// @match        https://moeshare.cc/post.php?fid=43
// @match        https://moeshare.cc/post.php?fid=3
// @match        https://moeshare.cc/post.php?fid=17
// @match        https://moeshare.cc/post.php?action=reply&fid=16&tid=*
// @match        https://moeshare.cc/post.php?fid=16&action=reply&tid=*


// @match        https://www.moeshare.cc/post.php?fid=22
// @match        https://www.moeshare.cc/post.php?fid=33
// @match        https://www.moeshare.cc/post.php?fid=28
// @match        https://www.moeshare.cc/post.php?fid=4
// @match        https://www.moeshare.cc/post.php?fid=42
// @match        https://www.moeshare.cc/post.php?fid=43
// @match        https://www.moeshare.cc/post.php?fid=3
// @match        https://www.moeshare.cc/post.php?fid=17
// @match        https://www.moeshare.cc/post.php?action=reply&fid=16&tid=*
// @match        https://www.moeshare.cc/post.php?fid=16&action=reply&tid=*

// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license MIT
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @connect bgm.tv
// @connect bangumi.tv
// @connect www.hotacg.com
// @connect www.3dmgame.com
// @connect www.3dmgame.com
// @connect www.vgtime.com
// @connect www.ali213.net
// @connect news.idmzj.com
// @connect *


// @downloadURL https://update.greasyfork.org/scripts/481070/MoeShareAutoPost.user.js
// @updateURL https://update.greasyfork.org/scripts/481070/MoeShareAutoPost.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var windcode = document.getElementById('wy_windcode');
    if (windcode.checked != true){editorcode('windcode');}
    var attribute = [{key:1,label:'首发'},{key:2,label:'补档'},{key:3,label:'二次分流'}]
    var enAttribute = [{key:1,label:'首发'},{key:2,label:'补档'},{key:3,label:'二次分流'}]
    var webSiteList = [ {
        "id": "1",
        "code": "3dmgame",
        "name": "三大妈",
        "parseType": 0,
        "titleSelector": "bt",
        "dateSelector": "time",
        "contentSelector": "news_warp_center",
        "dateFormats": null,
        "maxResults": 6,
        "baseUrl": null
    }, {
        "id": "2",
        "code": "vgtime",
        "name": "游戏时光",
        "parseType": 0,
        "titleSelector": "art_tit",
        "dateSelector": "time_box",
        "contentSelector": "topicContent front_content",
        "dateFormats": null,
        "maxResults": 13,
        "baseUrl": null
    }, {
        "id": "3",
        "code": "ali213",
        "name": "游侠资讯",
        "parseType": 0,
        "titleSelector": "newstit",
        "dateSelector": "newstag_l",
        "contentSelector": "n_show box-shadow",
        "dateFormats": null,
        "maxResults": 15,
        "baseUrl": null
    }, {
        "id": "4",
        "code": "dmzj",
        "name": "动漫之家",
        "parseType": 0,
        "titleSelector": "news_content_head li_img_de autoHeight",
        "dateSelector": "data_time",
        "contentSelector": "news_content_con",
        "dateFormats": null,
        "maxResults": 8,
        "baseUrl": null
    }]
    // 创建一个按钮
    var newButton = document.createElement("i");
    newButton.innerHTML = "发帖模板";
    newButton.onclick = autoPost;
    // 找到按钮容器
    var buttonContainer = document.querySelector(".wy_top_but");
    // 将新按钮插入到按钮容器中
    buttonContainer.appendChild(newButton);
    // 添加点击按钮时触发的函数
    function autoPost() {
        //弹出一个空白的窗口，用于填写信息 [作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
        var postWindow = window.open("","","width=580,height=680");
        //postWindow的位置在屏幕中央的偏右
        postWindow.moveTo((window.screen.width-500)/2, (window.screen.height-500)/2);

        //获取当前页面的url，判断fid是多少，然后根据fid判断是哪个板块，不同模块有着不同的发贴模板
        var url = window.location.href;
        var fid = url.substring(url.indexOf("fid=")+4,url.length);
        console.log(fid);
        //22,33,28属于电子分流区
        switch (fid) {
            case "22":case "28":case "33":
                //在窗口中添加一个中文电子分流区发帖模板标题
                postWindow.document.title = "中文电子分流区发帖模板";
                //标题输入框
                GenerateInput(postWindow,"Bangumi","BangumiURL","输入Bangumi地址，可选项。填入后支持自动刮削");
                GenerateButton(postWindow,"自动刮削",Bangumi,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"出版社","publisher","例如：台湾角川");
                GenerateInput(postWindow,"提取平台","platform","例如：BW、BW原档");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                GenerateInput(postWindow,"其他信息","other","备注信息，可选项");
                //在窗口中添加一个按钮
                GenerateButton(postWindow,"生成标题",title_cn_electronic_area_create,"padding: 3px 8px; text-align: center;margin: 6px 110px;");
                // 封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                // 简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","100px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                GenerateInput(postWindow,"自购证明","certification","请输入自购证明的图床链接");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_cn_electronic_area_info_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                break;
            case "4":case "42":case "43":
                //在窗口中添加一个中文实体分流区发帖模板标题
                postWindow.document.title = "中文实体分流区发帖模板";
                GenerateInput(postWindow,"Bangumi","BangumiURL","输入Bangumi地址，可选项。填入后支持自动刮削");
                GenerateButton(postWindow,"自动刮削",Bangumi,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"出版社","publisher","例如：台湾角川");
                //扫描者
                GenerateInput(postWindow,"扫者","scanner","多位扫描者需要用&连接，例如：A&b&c");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                //添加一个按钮，生成标题
                GenerateButton(postWindow,"生成标题",title_cn_entity_area_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                //封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                //简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","100px","80%");
                //单卷信息输入框
                GenerateMoelistURL(postWindow,"Moelist","MoelistURL");
                GenerateTextArea(postWindow,"单卷信息","Moelist","请在此处粘贴从Moelist输出的单卷信息","100px","80%");
                //属性区输入框
                var selectValue = attribute[0].key;
                GenerateSwitch(postWindow,"资源属性","attribute",attribute,selectValue);
                GenerateTextArea(postWindow,"失效链接","invalid","请输入失效链接，可选项，影响评分，若有多个链接请在中间用空格隔开","50px","80%");
                //其它信息输入框
                GenerateTextArea(postWindow,"其它信息","note","压缩包注释、扫者留言等其它说明可在此处填写","50px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_cn_entity_area_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                break;
            case "3":
                //在窗口中添加一个外文原版分享区发帖模板标题
                postWindow.document.title = "外文原版分享区发帖模板";
                GenerateInput(postWindow,"Bangumi","BangumiURL","输入Bangumi地址，可选项。填入后支持自动刮削");
                GenerateButton(postWindow,"自动刮削",Bangumi,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                GenerateInput(postWindow,"国家","country","例如：日本");
                GenerateInput(postWindow,"作者","author","请输入作者名称");
                GenerateInput(postWindow,"漫画书名","book","请输入漫画名称");
                GenerateInput(postWindow,"卷数","volume","例如：1-7未、1-7完、单7未、单7完");
                GenerateInput(postWindow,"网盘名称","disk","例如：BD、百度");
                //添加一个按钮，生成标题
                GenerateButton(postWindow,"生成标题",title_en_original_area_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                //封面区输入框
                GenerateInput(postWindow,"封面","cover","请输入封面文件的图床链接");
                //简介区输入框
                GenerateTextArea(postWindow,"简介","info","请在此输入简介内容","100px","80%");
                //单卷信息输入框
                GenerateMoelistURL(postWindow,"Moelist","MoelistURL");
                GenerateTextArea(postWindow,"单卷信息","Moelist","请在此处粘贴从Moelist输出的单卷信息","100px","80%");
                //属性区输入框
                var enSelectValue = enAttribute[0].key;
                GenerateSwitch(postWindow,"资源属性","attribute",enAttribute,enSelectValue);
                //失效链接输入框
                GenerateInput(postWindow,"失效链接","invalid","请输入失效链接，可选项，影响评分");
                //其它信息输入框
                GenerateTextArea(postWindow,"其它信息","note","压缩包注释、扫者留言等其它说明可在此处填写","50px","80%");
                // 出售区输入框
                GenerateInput(postWindow,"售价(国库券)","sell","例如：0，代表帖子售价为0国库券");
                // MD可见区输入框
                GenerateInput(postWindow,"MD限制","md","例如：20，代表隐藏内容需20MD以上可见");
                // 下载链接区输入框
                GenerateTextArea(postWindow,"受限内容","download","可在此处输入下载链接、解压密码等信息","50px","80%");
                //生成简介按钮区**********
                GenerateButton(postWindow,"生成帖子",info_en_original_area_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                break;
            case "17":
                //在窗口中添加一个ACG文章转载评论区
                postWindow.document.title = "ACG文章转载评论区";
                GenerateLink(postWindow,"热点ACG","https://www.hotacg.com/");
                GenerateLink(postWindow,"三大妈","https://www.3dmgame.com/");
                GenerateLink(postWindow,"游戏时光","https://www.vgtime.com/");
                GenerateLink(postWindow,"游侠网","https://www.ali213.net/");
                GenerateLink(postWindow,"动漫之家","https://news.idmzj.com/");
                postWindow.document.body.appendChild(postWindow.document.createElement("br"));
                GenerateInput(postWindow,"新闻地址","newsUrl","请输入新闻地址");
                //添加一个按钮，一键解析生成标题和帖子
                GenerateButton(postWindow,"一键解析",news_title_and_info_create,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                break;
            default:
                //答题模板
                postWindow.document.title = "答题模板";
                GenerateInput(postWindow,"题目数量","questionNum","请一次性输入全部题目的数量");
                GenerateButton(postWindow,"生成答题框",answerListCreate,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
                return;
        }
        function answerTotalCreate(){
            //首先获得questionNum的值,并转换成int类型
            let questionNum = parseInt(postWindow.document.getElementById("questionNum").value);
            let finalInfo = "";
            finalInfo+="[hide=999,credit][list][li] \n"
            for (let index = 1; index <= questionNum; index++) {
                var boxtext = "";
                for (var i = 0; i < 4; i++) {
                    var checkboxN = postWindow.document.getElementById("question"+index+"check"+i);
                    if (checkboxN.checked) {boxtext += String.fromCharCode(65 + i);}
                }
                let question = boxtext + " + " + postWindow.document.getElementById("question"+index).value;
                finalInfo += index+"."+question+"\n";
            }
            finalInfo+="[/li][/list][/hide]";
            var info = document.getElementById("textarea");
            info.value = finalInfo;
        }
        function answerListCreate(){
            //首先获得questionNum的值,并转换成int类型
            let questionNum = parseInt(postWindow.document.getElementById("questionNum").value);
            for (let index = 1; index <= questionNum; index++) {
                GenerateAnsTmpl(postWindow,"第"+index+"题","question"+index,"请在此输入第"+index+"题答案选项所对应的文字内容");
            }
	    postWindow.document.body.removeChild(postWindow.document.querySelectorAll('button')[0]);
            postWindow.document.querySelectorAll('input')[0].style.display = "none";
            GenerateButton(postWindow,"生成帖子",answerTotalCreate,"padding: 3px 8px; text-align: center; margin: 6px 110px;");
        }
        function Bangumi(){
            //自动刮削功能
            let BangumiURL = postWindow.document.getElementById("BangumiURL").value
            GM_xmlhttpRequest({
                method: "GET",
                url: BangumiURL,
                onload: function (html) {
                    if(html.status==200){
                        let response = html.response;
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response, "text/html");
                        // 提取数据
                        var chineseNameElement = doc.querySelector('#infobox li:nth-child(1)');
                        var authorElement;
                        // 逐个检查可能的选择器
                        var i=1;
                        for (i = 1; i <= 5; i++) {
                            var selector = `#infobox li:nth-child(${i}) span`;
                            // 检查选择器是否是纯数字
                            if (/^\d+$/.test(selector)) {
                                continue;
                            }
                            // 使用选择器查找元素
                            authorElement = doc.querySelector(selector);
                            // 如果找到包含有 "作者" 或者 "原作" 的元素，则跳出循环
                            if (authorElement && (authorElement.textContent.includes('作者') || authorElement.textContent.includes('原作'))) {
                                break;
                            }
                        }
                        authorElement = doc.querySelector('#infobox li:nth-child('+i+') a');
                        var infotextElement = doc.querySelector('#subject_summary');
                        // 判空并提取数据
                        var chineseName = chineseNameElement ? chineseNameElement.textContent.trim().replace('中文名: ', '') : '';
                        var author = authorElement ? authorElement.textContent.trim() : '';
                        var infotext = infotextElement ? infotextElement.textContent.trim() : '';
                        // 获取id为bangumiInfo的div元素
                        var bangumiInfoDiv = doc.getElementById('bangumiInfo');
                        // 在bangumiInfoDiv内部查找第一个<a>标签
                        var firstAnchorTag = bangumiInfoDiv.querySelector('a');
                        // 获取<a>标签的href属性
                        var cover = firstAnchorTag.getAttribute('href');
                        //赋值数据
                        postWindow.document.getElementById("author").value = author;
                        postWindow.document.getElementById("book").value = chineseName;
                        postWindow.document.getElementById("info").value = infotext;
                        postWindow.document.getElementById("cover").value = 'http:'+cover;
                    }
                },
            })
        }
        function news_title_and_info_create(){
            news_parse(function(result, error) {
                if (result) {
                    console.log('Final Result:', result);
                    document.getElementById('atc_title').value=result.title;
                    document.getElementById('textarea').value=result.content;
                } else {
                    console.error('Error:', error);
                }
            });
        }
        function news_parse(callback){
            //新闻一键解析发帖
            let newsUrl = postWindow.document.getElementById("newsUrl").value
            GM_xmlhttpRequest({
                method: "GET",
                url: newsUrl,
                onload: function (html) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html.response, 'text/html');
                    let elements = doc.querySelectorAll('*');
                    let webSite;

                    webSiteList.forEach(item => {
                        if (newsUrl.includes(item.code)) {
                            webSite = item;
                        }
                    });

                    if (webSite && webSite.parseType === 0) {
                        // 传统php网站的处理方式
                        callback(traditionHandle(elements, webSite,newsUrl));
                    } else {
                        callback(null, "Unsupported website or parse type");
                    }
                },
                onerror: function (error) {
                    callback(null, error);
                }
            });
        }

        function traditionHandle(elements,webSite,newsUrl) {
            //首先遍历所有的element，找到contentSelector对应的element
            let contentElement = null
            let date = null
            let firstDate = true;
            let title = null
            elements.forEach(function (element) {
                if (element.className === (webSite.contentSelector)) {
                    contentElement = element
                }
                if (element.className === (webSite.dateSelector) && firstDate) {
                    date = dateTimeHandle(element.innerText, webSite)
                    firstDate = false
                }
                if (element.className === (webSite.titleSelector)) {
                    title = getTitle(element, webSite)
                }
            });
            //处理contentElement,先转换成字符
            contentElement = contentElement.outerHTML
            //首先在content的开头添加url，作为文章的来源
            contentElement = "[b]文章来源：[/b]" + newsUrl + "\n" + contentElement
            //使用正则 <(?!p|img|/p|/img).*?> 替换掉contentElement
            contentElement = contentElement.replace(/<(?!p|img|\/p|\/img).*?>/g, "")
            //使用正则 <img.*?src="(.*?)".*?> 替换成 [img]$1[/img]
            contentElement = contentElement.replace(/<img.*?src="(.*?)".*?>/g, "[img]$1[/img]")
            //使用正则 <.*?> 替换成 ""
            contentElement = contentElement.replace(/<.*?>/g, "")
            //判断website是否是ali213，如果是的话需要进行额外处理，去除掉其中var之后的内容
            if (webSite.code === "ali213") {
                contentElement = contentElement.replace(/var.*?;/g, "")
            }
            let jsonRes = {
                "title": date + title,
                "content": contentElement
            }
            return jsonRes
        }

        function info_en_original_area_create(){
            //外文原版分享区的帖子生成
            //获取Dom中id为textarea的元素，即简介输入框
            let finalInfo ="【封面】\n[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo+="\n";
            finalInfo+="[quote]【简介】\n"+postWindow.document.getElementById("info").value+"[/quote]";
            finalInfo+="\n";
            if(postWindow.document.getElementById("attribute").value !==""){
                var attributeKey =postWindow.document.getElementById("attribute").value
                if(attributeKey == 1) {
                    finalInfo += "[quote]【资源属性】【首发】";
                }else if(attributeKey == 2){
                    finalInfo += "[quote]【资源属性】【补档】";
                }else {
                    finalInfo += "[quote]【资源属性】【二次分流】";
                }
				if(postWindow.document.getElementById("invalid").value !==""){
                finalInfo+="\n【失效链接】[url="+postWindow.document.getElementById("invalid").value+
				"]"+postWindow.document.getElementById("invalid").value+"[/url][/quote]\n";
				}else {finalInfo+= "[/quote]\n";}
            }
            if(postWindow.document.getElementById("note").value !==""){
                finalInfo+="[quote]"+postWindow.document.getElementById("note").value+"[/quote]\n";
            }
            finalInfo+="[quote]【单卷信息】\n"+postWindow.document.getElementById("Moelist").value+"[/quote]\n";
            if(postWindow.document.getElementById("md").value !=="") {
                finalInfo += "本下载链接需要" + postWindow.document.getElementById("md").value + "MD才能查看" + "\n";
                if (postWindow.document.getElementById("sell").value !== "") {
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += "[hide=" + postWindow.document.getElementById("md").value + ",rvrc]" + "\n";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/hide][/sell]";
                } else {
                    finalInfo += "[hide=" + postWindow.document.getElementById("md").value + ",rvrc]" + "\n";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/hide]";
                }
            }else {
                if (postWindow.document.getElementById("sell").value !== "") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value + "\n";
                    finalInfo += "[/sell]";
                } else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            var info = document.getElementById("textarea");
            info.value = finalInfo;
        }
        function title_en_original_area_create(){
            //外文原版分享区的标题生成
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[国家][作者][漫画名称][卷数][网盘名称]
            let finalTitle = "[" + postWindow.document.getElementById("country").value + "]" +
                "[" + postWindow.document.getElementById("author").value + "]" +
                "[" +postWindow.document.getElementById("book").value + "]" +
                "[" + postWindow.document.getElementById("volume").value + "]" +
                "[" +postWindow.document.getElementById("disk").value +"]";
            title.value = finalTitle;
        }
        function info_cn_entity_area_create(){
            //中文实体区域的帖子生成
            //获取Dom中id为textarea的元素，即简介输入框
            let finalInfo = "";
            finalInfo+="【封面】\n[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo+="\n";
            finalInfo+="[quote]【简介】\n"+postWindow.document.getElementById("info").value+"[/quote]";
            finalInfo+="\n";
            if(postWindow.document.getElementById("scanner").value !==""){
                var scanners = postWindow.document.getElementById("scanner").value.split("&")
                finalInfo+="[quote]【扫者】"
                for (let i = 0; i < scanners.length; i++) {
                    finalInfo+="Scan by "+scanners[i]+"\n";
                }
                finalInfo+=
                    "=========免責聲明==========\n" +
                    "●分享僅供試閱，如果想要收藏請支持且購買正版！！\n" +
                    "●請不要將分享的資源用於盈利或非法用途。\n" +
                    "●如將分享的資源用於盈利或非法用途，產生的任何法律責任請自行負責。\n" +
                    "●分享的資源由網路上轉載而來的，如有侵犯到原發佈者或掃圖者的地方，請傳訊告知。\n" +
                    "===========================\n" +
                    "\n" +
                    "  ～感謝掃者～[/quote]\n";
            }
            if(postWindow.document.getElementById("attribute").value !==""){
                var attributeKey =postWindow.document.getElementById("attribute").value
                if(attributeKey == 1) {
                    finalInfo += "[quote]【资源属性】【首发】";
                }else if(attributeKey == 2) {
                    finalInfo += "[quote]【资源属性】【补档】";
                }else {
                    finalInfo += "[quote]【资源属性】【二次分流】";
                }
	    if (postWindow.document.getElementById("invalid").value !== "") {
		var links = postWindow.document.getElementById("invalid").value.split(" ");
		finalInfo += "\n【失效链接】"
		for (var i = 0; i < links.length; i++) {
			finalInfo += "[url=" + links[i] + "]" + links[i] + "[/url] ；";
			}
		finalInfo += "[/quote]\n"
	    } else {
		finalInfo += "[/quote]\n";
	    }
	    }
            if(postWindow.document.getElementById("note").value !==""){
                finalInfo+="[quote]"+postWindow.document.getElementById("note").value+"[/quote]\n";
            }
            finalInfo+="[quote]【单卷信息】\n"+postWindow.document.getElementById("Moelist").value+"[/quote]\n";
            if(postWindow.document.getElementById("md").value !==""){
                finalInfo += "本下载链接需要"+postWindow.document.getElementById("md").value+"MD才能查看"+"\n";
                if(postWindow.document.getElementById("sell").value !==""){
                    finalInfo +="[sell="+postWindow.document.getElementById("sell").value+",2]";
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide][/sell]";
                }else {
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide]";
                }
            }else {
                if(postWindow.document.getElementById("sell").value !=="") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/sell]";
                }else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            var info = document.getElementById("textarea");
            info.value = finalInfo;
        }
        function title_cn_entity_area_create(){
            //中文实体区域的标题生成
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[作者][漫画书名][卷数][出版社][网盘名称]
            let finalTitle = "[" + postWindow.document.getElementById("author").value + "]" +
                "[" + postWindow.document.getElementById("book").value + "]" +
                "[" + postWindow.document.getElementById("volume").value + "]" +
                "[" +postWindow.document.getElementById("publisher").value +"]" +
                "["+postWindow.document.getElementById("scanner").value+"]"+
                "[" +postWindow.document.getElementById("disk").value +"]";
            title.value = finalTitle;
        }

        function info_cn_electronic_area_info_create(){
            var info = document.getElementById("textarea");
            let finalInfo = "";
            finalInfo += "[img]"+postWindow.document.getElementById("cover").value+"[/img]";
            finalInfo += "\n";
            finalInfo += postWindow.document.getElementById("info").value;
            finalInfo += "\n";
            if(postWindow.document.getElementById("md").value !==""){
                finalInfo += "本下载链接需要"+postWindow.document.getElementById("md").value+"MD才能查看"+"\n";
                if(postWindow.document.getElementById("sell").value !==""){
                    finalInfo +="[sell="+postWindow.document.getElementById("sell").value+",2]";
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide][/sell]";
                }else {
                    finalInfo +="[hide="+postWindow.document.getElementById("md").value+",rvrc]"+"\n";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/hide]";
                }
            }else {
                if(postWindow.document.getElementById("sell").value !=="") {
                    finalInfo += "本下载链接无MD限制\n";
                    finalInfo += "[sell=" + postWindow.document.getElementById("sell").value + ",2]";
                    finalInfo += postWindow.document.getElementById("download").value+"\n";
                    finalInfo += "[/sell]";
                }else {
                    finalInfo += postWindow.document.getElementById("download").value;
                }
            }
            if(postWindow.document.getElementById("certification").value !=="") {
                finalInfo += "自购证明：\n";
                finalInfo += "[hide=999,credit][img]" +
                    postWindow.document.getElementById("certification").value + "[/img][/hide]";
            }
            info.value = finalInfo;
        }

        function title_cn_electronic_area_create(){
            //获取Dom中id为atc_title的元素，即标题输入框
            var title = document.getElementById("atc_title");
            //为title赋值，格式为[作者] 漫画书名 [卷数][出版社][提取平台][网盘名称][其他信息]
            let finalTitle = "[" + postWindow.document.getElementById("author").value + "]" +
                postWindow.document.getElementById("book").value +
                "[" + postWindow.document.getElementById("volume").value + "]" +
                "[" +postWindow.document.getElementById("publisher").value +"]" +
                "[" +postWindow.document.getElementById("platform").value +"]" +
                "[" +postWindow.document.getElementById("disk").value +"]";
            if(postWindow.document.getElementById("other").value !==""){
                finalTitle += "[" + postWindow.document.getElementById("other").value + "]";
            }
            title.value = finalTitle;
        }
    }
    function GenerateLink(postWindow,labelString,link){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var a = postWindow.document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.innerHTML = link;
        postWindow.document.body.appendChild(a);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }

    function GenerateSwitch(postWindow,labelString,switchId,attribute,selectValue){
        var switchLabel = postWindow.document.createElement("label");
        switchLabel.innerHTML = labelString+"：";
        switchLabel.style.display = "inline-block";
        switchLabel.style.width = "20%";
        switchLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(switchLabel);
        var switchSelect = postWindow.document.createElement("select");
        switchSelect.id = switchId;
        switchSelect.style.width = "40%";
        switchSelect.style.verticalAlign = "middle";
        for (let i = 0; i < attribute.length; i++) {
            let option = postWindow.document.createElement("option");
            option.value = attribute[i].key;
            option.innerHTML = attribute[i].label;
            if (attribute[i].key == selectValue) {
                option.selected = true;
            }
            switchSelect.appendChild(option);
        }
        postWindow.document.body.appendChild(switchSelect);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateButton(postWindow,buttonInnerHTML,buttonOnclick,buttonStyle){
        var button = postWindow.document.createElement("button");
        var br = postWindow.document.createElement("br");
        button.style.backgroundColor = "black";
        button.style.color = "white";
        button.innerHTML = buttonInnerHTML;
        button.onclick = buttonOnclick;
        button.style = buttonStyle;
        postWindow.document.body.appendChild(button);
        postWindow.document.body.appendChild(br);
    }
    function GenerateMoelistURL(postWindow,labelString,inputId){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var a = postWindow.document.createElement("a");
        a.id = inputId;
        a.href = "https://toolbox-8hz.pages.dev/moelist";
        a.target = "_blank";
        a.innerHTML = "点击跳转到Moelist页面（需要科学上网）";
        postWindow.document.body.appendChild(a);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateInput(postWindow,labelString,inputId,placeholderString){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var input = postWindow.document.createElement("input");
        input.type = "text";
        input.style.width = "80%";
        input.id = inputId;
        input.placeholder = placeholderString;
        postWindow.document.body.appendChild(input);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateAnsTmpl(postWindow,labelString,inputId,placeholderString){
        var authorLabel = postWindow.document.createElement("label");
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
	for (var i = 0; i < 4; i++) {
            var checkbox = postWindow.document.createElement('input')
	    checkbox.type = "checkbox";
	    checkbox.id = inputId + "check" + i;
            checkbox.value = String.fromCharCode(65 + i);
            var boxlabel = postWindow.document.createElement('label');
            boxlabel.htmlFor = 'checkbox' + i;
            boxlabel.appendChild(postWindow.document.createTextNode('\u00A0\u00A0' + String.fromCharCode(65 + i)));
            postWindow.document.body.appendChild(boxlabel);
            postWindow.document.body.appendChild(checkbox);
	}
        var input = postWindow.document.createElement("input");
        input.type = "text";
        input.style.width = "100%";
        input.id = inputId;
        input.placeholder = placeholderString;
        postWindow.document.body.appendChild(input);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function GenerateTextArea(postWindow,labelString,textareaId,placeholderString,height,width){
        var authorLabel = postWindow.document.createElement("label");
        if (textareaId == "download") {authorLabel.style.color = "red";}
        authorLabel.innerHTML = labelString+"：";
        authorLabel.style.display = "inline-block";
        authorLabel.style.width = "20%";
        authorLabel.style.textAlign = "left";
        postWindow.document.body.appendChild(authorLabel);
        var textarea = postWindow.document.createElement("textarea");
        textarea.id = textareaId;
        textarea.placeholder = placeholderString;
        textarea.style.height = height;
        textarea.style.width = width;
        textarea.style.verticalAlign = "middle";
        postWindow.document.body.appendChild(textarea);
        postWindow.document.body.appendChild(postWindow.document.createElement("br"));
    }
    function dateTimeHandle(dateStr, website) {
        let date = null
        switch (website.code) {
            case "3dmgame":
                //把“时间：2023-07-04 16:02:46” 格式化为yyMMdd 类似于230704
                date = dateStr.replace(/时间：(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}).*/, "$1$2$3");
                //去除date最前面的两位
                date = date.substring(2)
                date = "[" + date + "]"
                break;
            case "gcores":
                //把时间2023-07-05T09:28:29.000+08:00格式化为yyMMdd 类似于230705
                date = dateStr.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*/, "$1$2$3");
                date = date.substring(2)
                date = "[" + date + "]"
                break
            case "dmzj":
                //把时间"2023-07-05 11:42:00"格式化为yyMMdd 类似于230705的形式
                date = dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}).*/, "$1$2$3");
                date = date.substring(2)
                date = "[" + date + "]"
                break
            case "gao7":
                //获取dateStr中类似于“2023年07月05日”的内容，提取出来然后格式化为yyMMdd 类似于230705的形式
                date = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/)[0].replace(/(\d{4})年(\d{2})月(\d{2})日/, "$1$2$3")
                date = date.substring(2)
                date = "[" + date + "]"
                break
            case "hotacg":
                //把时间 “			2023年7月5日 8:31		” 中的年月日提取出来
                var year = dateStr.match(/(\d{4})年/)[0].replace(/(\d{4})年/, "$1")
                var month = dateStr.match(/年(\d{1,2})月/)[0].replace(/年(\d{1,2})月/, "$1")
                var day = dateStr.match(/月(\d{1,2})日/)[0].replace(/月(\d{1,2})日/, "$1")
                //对month和day进行补0操作
                if (month.length === 1) {
                    month = "0" + month
                }
                if (day.length === 1) {
                    day = "0" + day
                }
                //把year month day拼接起来
                date = year + month + day
                date = date.substring(2)
                date = "[" + date + "]"
                break
            case "vgtime":
                //把时间 “2023-07-05 13:05:08 ” 格式化为yyMMdd 类似于230705的形式
                date = dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}).*/, "$1$2$3");
                date = date.substring(2)
                date = "[" + date + "]"
                break
            case "ali213":
                //处理类似于" 2023-07-05 12:12:31    游侠原创：Cloud    编辑：cloud    浏览量：加载中... "的字符串，提取出时间
                date = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}).*/)[0].replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}).*/, "$1$2$3");
                date = date.substring(2)
                date = "[" + date + "]"
                break
            default:
                date = "errorDate"
        }
        return date
    }

    function getTitle(titleElement,webSite){
        let title = null
        switch (webSite.code) {
            case "dmzj":
                //获取titleElement中的<h1>的innerText
                title = titleElement.querySelector("h1").innerText
                break;
            default:
                title = titleElement.innerText
        }
        return title
    }
})();
