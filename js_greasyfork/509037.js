// ==UserScript==  
// @name        中山大学图书馆豆瓣读书助手
// @description 为豆瓣图书增加中山大学图书馆藏检索与荐购服务
// @name:en        Douban library helper for SYSU
// @description:en Added Sun Yat-sen University Library collection search and purchase recommendation services to Douban Books
// @author      Kawatabi
// @namespace   http://tampermonkey.net/
// @include     http://book.douban.com/subject/*
// @include     https://book.douban.com/subject/*
// @include     http://read.douban.com/ebook/*
// @include     https://read.douban.com/ebook/*
// @include     http://10.8.11.130:8991/*
// @include     http://10.8.11.130:8080/apsm/recommend/recommend.jsp?url_id=http://10.8.11.130:8991/F/
// @include     http://opac.calis.edu.cn/*
// @include     
// @include     
// @version     2.0.0
// @license     MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/509037/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/509037/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


GM_addStyle("#ISBNLoading,#titleLoading { list-style-type:none; }");

// 使用 GM_addStyle 函数添加自定义的 CSS 样式
GM_addStyle(
  "#libSetting {" + 
    "background: #F6F6F1;" +          // 背景颜色为浅灰色
    "border: 1px solid #aaa;" +       // 边框颜色为灰色，宽度为1px
    "box-shadow: 0 0 8px 2px #777;" + // 添加阴影效果，颜色为深灰色
    "height: auto;" +                 // 高度根据内容自动调整
    "left: 320px;" +                  // 元素距离左边缘320px
    "min-height: 100px;" +            // 最小高度为100px
    "padding: 10px 20px 40px;" +      // 内边距：顶部10px，左右20px，底部40px
    "position: fixed;" +              // 定位方式为固定定位，始终在视口中的固定位置
    "top: 25%;" +                     // 元素距离顶部25%的位置
    "width: 600px;" +                 // 宽度为600px
    "z-index: 1000002;" +             // 元素的堆叠顺序很高，确保它覆盖其他元素
  "}" +
  ".setbtn {" + 
    "display: inline-block;" +        // 元素显示为内联块级元素
    "background: #33A057;" +          // 背景颜色为绿色
    "border: 1px solid #2F7B4B;" +    // 边框颜色为深绿色，宽度为1px
    "color: white !important;" +      // 字体颜色为白色，并强制应用
    "padding: 1px 10px;" +            // 内边距：顶部和底部1px，左右10px
    "border-radius: 3px;" +           // 边框圆角为3px
    "margin-right: 8px;" +            // 右侧外边距为8px
    "margin: 5px;" +                  // 四周外边距为5px
    "cursor: pointer;" +              // 鼠标悬停时显示为指针手型，表示可点击
  "} " +
  ".gotobtn {" + 
    "display: inline-block;" +        // 元素显示为内联块级元素
    "background: #33A057 !important;" + // 背景颜色为绿色，并强制应用
    "border: 1px solid #2F7B4B;" +    // 边框颜色为深绿色，宽度为1px
    "color: white !important;" +      // 字体颜色为白色，并强制应用
    "padding: 1px 10px;" +            // 内边距：顶部和底部1px，左右10px
    "border-radius: 3px;" +           // 边框圆角为3px
    "margin-bottom: 5px;" +           // 底部外边距为5px
    "font-size: 0.8em !important;" +  // 字体大小为原来的80%，并强制应用
    "cursor: pointer;" +              // 鼠标悬停时显示为指针手型，表示可点击
  "} " +
  "#otherTitle .getlink a {" + 
    "display: inline-block;" +        // 链接显示为内联块级元素
    "border: 1px solid #2F7B4B;" +    // 边框颜色为深绿色，宽度为1px
    "padding: 1px 5px;" +             // 内边距：顶部和底部1px，左右5px
    "border-radius: 3px;" +           // 边框圆角为3px
    "margin-bottom: 2px;" +           // 底部外边距为2px
    "font-size: 0.8em !important;" +  // 字体大小为原来的80%，并强制应用
    "cursor: pointer;" +              // 鼠标悬停时显示为指针手型，表示可点击
    "text-decoration: none !important;" + // 链接去除下划线样式，并强制应用
  "}"
);


// 定义学校列表
var schoolList = [
  "SYSU",   // 中山大学
  "SCUT",   // 华南理工大学
  "SCNU",   // 华南师范大学
  "GDUT",   // 广东工业大学
  "GDUFS",  // 广东外语外贸大学
  "GZHTCM", // 广州中医药大学
  "GZHU",   // 广州大学
  "GZARTS", // 广州美术学院
  "XHCOM"   // 星海音乐学院
];


//个人选项设置
var prefs={
    school:GM_getValue("school","SYSU"),
    studentID:GM_getValue("studentID","2333333"),
    //password:"Hello_Kitty",
    campus:GM_getValue("campus","东校区"),
    telephone:GM_getValue("telephone","13145201748"),
    name:GM_getValue("name","二三三"),
    eMail:GM_getValue("eMail","HelloKitty@sysu.edu.cn"),
    libraryId:GM_getValue("libraryId","ID1000114514")
}


function LibMeta(schoolName){
    this.state=null;
    this.error=false;
    this.errorMsg=null;
    this.type=null;
    this.link=null;
    this.items=null;
    this.originUrl=null;
    this.school=schoolName;
}


function LibItem(school){
    this.bookName=null;
    this.author=null;
    this.bookIndex=null;
    this.publisher=null;
    this.pubDate=null;
    this.school=school;
    this.link=null;
    this.extra=null;
    this.type="booklist";
}

function StoreItem(school){
    this.school=school;
    this.storeState=null;
    this.borrowTime=null;
    this.returnTime="";
    this.location=null;
    this.bookIndex=null;
    this.branch=null;
    this.link=null;
    this.type="store";
    this.rentable=false;
}



///////////////////////////豆瓣图书元信息///////////////////////////////////
bookMeta = (function () {
  // 只在豆瓣页面执行
  if (location.href.indexOf('douban') == -1) {
    return null;
  }

  if (location.href.indexOf('douban.com/subject') != -1) {
    // 获取info块内容
    var rawBookInfo = document.getElementById("info").innerHTML;

    // 获取作者信息
    var author = document.querySelector("#info a");
    if (author) {
      author = author.innerHTML.trim();
    }

    // 获取标题
    var title = document.querySelector('h1 span').textContent;
    // 去除括号内容
    var bracketIndex = title.indexOf("(");
    if (bracketIndex != -1) {
      title = title.slice(0, bracketIndex);
    }
    bracketIndex = title.indexOf("（");
    if (bracketIndex != -1) {
      title = title.slice(0, bracketIndex);
    }
    title = title.replace(/[^\p{L}\p{M}0-9\s]|_/gu, "").replace(/\s+/g, " ").trim(); // 使用正则表达式去掉所有标点符号，保留所有字符和数字
    console.log(title); // 输出纯文本

    // 提取出版社信息
    var publisherMatch = /<span class="pl">出版社:<\/span>\s*(?:<a[^>]*>)?([^<"]+)(?:<\/a>)?/i.exec(rawBookInfo);
    if (publisherMatch !== null) {
      var publisher = publisherMatch[1].trim();
      console.log('出版社:', publisher);
    } else {
      console.log('未找到出版社信息');
    }

    // 提取出版年
    var pubdate = /出版年:<\/span>(.*)<br>/.exec(rawBookInfo);
    if (pubdate !== null) {
      pubdate = /[\d]+/.exec(pubdate[1].trim());
      pubdate = pubdate[0];
    }

    // 提取定价
    var price = /定价:<\/span>(.*)<br>/.exec(rawBookInfo);
    if (price !== null) {
      price = price[1].trim();
    }

    // 提取ISBN
    var isbn = /ISBN:<\/span>(.*)<br>/.exec(rawBookInfo);
    if (isbn !== null) {
      isbn = isbn[1].trim();
    }

    // 提取统一书号
    var bookIndex = /统一书号:<\/span>(.*)<br>/.exec(rawBookInfo);
    if (bookIndex !== null) {
      bookIndex = bookIndex[1].trim();
    }

    // 获取评分
    var rating = document.querySelector('#interest_sectl .rating_num').innerHTML.trim();
    if (!rating) {
      rating = '暂无评分';
    }

  } else if (location.href.indexOf('ebook') != -1) {
    var allNodes, isbn = null;

    // 获取ISBN
    allNodes = document.evaluate('//a[@itemprop="isbn"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (allNodes.snapshotItem(0)) {
      isbn = allNodes.snapshotItem(0).innerHTML;
    }

    // 获取标题并去除括号
    var title;
    allNodes = document.evaluate('//h1[@itemprop="name"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (allNodes.snapshotItem(0)) {
      title = allNodes.snapshotItem(0).innerHTML;
      var bracketIndex = title.indexOf("(");
      if (bracketIndex != -1) {
        title = title.slice(0, bracketIndex);
      }
      bracketIndex = title.indexOf("（");
      if (bracketIndex != -1) {
        title = title.slice(0, bracketIndex);
      }
    }
    title = title.replace(/[^\p{L}\p{M}0-9\s]|_/gu, "").replace(/\s+/g, " ").trim(); // 使用正则表达式去掉所有标点符号，保留所有字符和数字  
    console.log(title); // 输出纯文本 

    // 获取出版社
    var publisher;
    allNodes = document.evaluate('//span[@itemprop="publisher"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (allNodes.snapshotItem(0)) {
      publisher = allNodes.snapshotItem(0).innerHTML;
    }

    // 获取作者
    var author;
    allNodes = document.evaluate('//span[@itemprop="author"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (allNodes.snapshotItem(0)) {
      author = allNodes.snapshotItem(0).innerHTML;
    }

    // 获取出版日期
    var pubdate;
    allNodes = document.evaluate('//span[@itemprop="datePublished"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (allNodes.snapshotItem(0)) {
      pubdate = allNodes.snapshotItem(0).innerHTML;
      pubdate = pubdate.slice(0, 4);
    }

    // 初始化评分、价格和统一书号
    var rating = '暂无评分';
    var price = "";
    var bookIndex = "";
  }

  //////////////////////ISBN转为旧格式///////////////////////////////////
  function ISBN10(isbn) {
    if (isbn == null) {
      return null;
    } else if (pubdate == null) {
      return isbn;
    }

    if (isbn.length == 13) {
      var rawISBN = isbn.slice(3, 12);
      var checkCode = 0; // 校验码
      for (i = 0; i < 9; i++) {
        checkCode += parseInt(rawISBN[i]) * (10 - i);
      }
      checkCode = 11 - checkCode % 11;
      if (checkCode == 10) {
        checkCode = "X";
      }

      var preCode = "";
      publishDate = Number(pubdate.slice(0, 4));
      if ((publishDate) >= 2007) { // 判断年份以检查是否需要加前缀和修正校验位
        preCode = isbn.slice(0, 3) + "-";
        checkCode = isbn[12];
      }
    } else { // ISBN 只有 10 位时
        rawISBN = isbn.slice(0, 9);
        checkCode = isbn[9];
        preCode = "";
      publishDate = Number(pubdate.slice(0, 4));
      if ((publishDate) >= 2007) { // 判断年份以检查是否需要加前缀和修正校验位
        preCode = '978' + "-";
        var a = 7 + parseInt(rawISBN[0]) + parseInt(rawISBN[2]) + parseInt(rawISBN[4]) + parseInt(rawISBN[6]) + parseInt(rawISBN[8]);
        a = a * 3;
        var b = 9 + 8 + parseInt(rawISBN[1]) + parseInt(rawISBN[3]) + parseInt(rawISBN[5]) + parseInt(rawISBN[7]);
        var c = a + b;
        var d = c % 10;
        checkCode = (10 - d) % 10;
      }
    }

    switch (rawISBN[1]) {
      case '0':
        ISBNold = preCode + rawISBN[0] + "-" + rawISBN.slice(1, 3) + "-" + rawISBN.slice(3, 9) + "-" + checkCode;
        break;
      case '1':
      case '2':
      case '3':
        ISBNold = preCode + rawISBN[0] + "-" + rawISBN.slice(1, 4) + "-" + rawISBN.slice(4, 9) + "-" + checkCode;
        break;
      case '5':
      case '7':
        ISBNold = preCode + rawISBN[0] + "-" + rawISBN.slice(1, 5) + "-" + rawISBN.slice(5, 9) + "-" + checkCode;
        break;
      case '4':
      case '8':
        ISBNold = preCode + rawISBN[0] + "-" + rawISBN.slice(1, 6) + "-" + rawISBN.slice(6, 9) + "-" + checkCode;
        break;
      case '6':
        ISBNold = preCode + rawISBN.slice(0, 7) + "-" + rawISBN.slice(7, 9) + "-" + checkCode;
        break;
      case '9':
        ISBNold = preCode + rawISBN.slice(0, 8) + "-" + rawISBN.slice(8, 9) + "-" + checkCode;
        break;
      default:
        ISBNold = null;
    }

    return ISBNold;
  }
  ISBNold = ISBN10(isbn); // 获取旧格式ISBN
 
  //图书语言判断
  var lan="zh";
    GM_setValue("doubanLanguage","zh");
  if(title.charCodeAt(0)<=122&&((isbn&&isbn[3]!=="7")||!isbn)){
        lan="en";
        GM_setValue("doubanLanguage","en");
  }

  // 返回提取的信息
  return {
    title: title,
    author: author,
    rating: rating,
    publisher: publisher,
    pubdate: pubdate,
    price: price,
    bookIndex: bookIndex,
    lan:lan,//语言
    isbn: isbn,
    isbn10: ISBNold,
    ISBNold: ISBNold
  };
})();



//各学校元信息
var schoolInfo={
//中山大学
"SYSU":{
    name:"中山大学",
    anySearchUrl:"http://10.8.11.130:8991//F/?func=find-b&find_code=WRD&request=%s",
    anyForeianSearchUrl:"http://10.8.11.130:8991/F/?func=find-b&find_code=WRD&request=%s&local_base=ZSU09",
    isbnSearchUrl:"http://10.8.11.130:8991/F/?func=find-b&find_code=ISB&request=%s",
    isbnForeianSearchUrl:"http://10.8.11.130:8991/F/?func=find-b&find_code=ISB&request=%s&local_base=ZSU09",
    titleSearchUrl:"",
    abbrName:"中大",
    isGBK:false,
    recommendUrl:"http://10.8.11.130:8080/apsm/recommend/recommend.jsp?url_id=http://10.8.11.130:8991/F/"
},

"zhizhen":{
    name:"超星发现",
    abbrName:"超星发现",
    anySearchUrl:"http://ss.zhizhen.com/s?strchannel=11&adv=Z%3D%s&aorp=a&size=15&isort=0&x=0_17#searchbody",
    isbnSearchUrl:"http://ss.zhizhen.com/s?adv=I%3D%s&aorp=a&size=15&isort=0&x=0_17#searchbody",
    //anyForeianSearchUrl:"http://ss.zhizhen.com/s?strchannel=11&adv=Z%3D%s&aorp=a&size=15&isort=0&x=0_17#searchbody",
    isGBK:false
},

"chaoxing":{
    name:"超星读书",
    abbrName:"超星读书",
    anySearchUrl:"http://book.chaoxing.com/search/name/%s/bookList1_.html",
    //isbnSearchUrl:"http://ss.zhizhen.com/s?adv=I%3D%s&aorp=a&size=15&isort=0&x=0_17#searchbody",
    isGBK:false
},

"CALIS":{
    name:"CALIS",
    abbrName:"CALIS",
    anySearchUrl:"http://opac.calis.edu.cn/doSimpleQuery.do?actionType=doSimpleQuery&dbselect=all&indexkey=dc.title%7Cinc&langBase=default&maximumRecords=50&operation=searchRetrieve&pageno=1&pagingType=0&query=(dc.title%3D%22*%s*%22)&sortkey=title&startRecord=1&version=1.1",
    isbnSearchUrl:"http://opac.calis.edu.cn/doSimpleQuery.do?actionType=doSimpleQuery&dbselect=all&indexkey=bath.isbn|frt&langBase=default&maximumRecords=50&operation=searchRetrieve&pageno=1&pagingType=0&query=%28bath.isbn%3D%22%s*%22%29&sortkey=title&startRecord=1&version=1.1",
    isGBK:false
},

"NLC":{
    name:"中国国家图书馆",
    abbrName:"国家馆",
    anySearchUrl:"http://opac.nlc.cn/F?func=find-b&find_code=WTP&request=%s&local_base=NLC01&filter_code_1=WLN&filter_request_1=&filter_code_2=WYR&filter_request_2=&filter_code_3=WYR&filter_request_3=&filter_code_4=WFM&filter_request_4=&filter_code_5=WSL&filter_request_5=",
    isbnSearchUrl:"http://opac.nlc.cn/F?find_code=ISB&request=%s&local_base=NLC01&func=find-b",
    isGBK:false
},

"GZlib":{
    name:"广州市图书馆",
    abbrName:"广图",
    isbnSearchUrl:"https://opac.gzlib.org.cn/opac/search?&q=%s&searchWay=isbn&sortWay=score&sortOrder=desc&scWay=dim&hasholding=1&curlibcode=GT&searchSource=reader",
    isGBK:false
},

"SZlib":{
    name:"深圳市图书馆",
    abbrName:"深图",
    isbnSearchUrl:"https://www.szlib.org.cn/opac/searchShow?v_index=isbn&v_value=%s&library=all&v_tablearray=bibliosm,serbibm,apabibibm,mmbibm,&sortfield=ptitle&sorttype=desc&pageNum=10&cirtype=&v_secondquery=&v_startpubyear=&v_endpubyear=",
    isGBK:false
},

"ZHlib":{
    name:"珠海市图书馆",
    abbrName:"珠图",
    isbnSearchUrl:"https://opac.zhlib.com.cn/opac/search?&q=%s&searchWay=isbn&sortWay=score&sortOrder=desc&scWay=dim&hasholding=1&searchSource=reader",
    isGBK:false
},

"DGlib":{
    name:"东莞市图书馆",
    abbrName:"莞图",
    isbnSearchUrl:"https://opac3.dglib.cn/opac/search?q=%s&searchType=standard&isFacet=true&view=standard&searchWay=isbn&booktype=1&booktype=2&booktype=4&rows=10&hasholding=1&searchWay0=marc&logical0=AND&sortWay=score&sortOrder=desc",
    isGBK:false
},

"EBSCO":{
    name:"EBSCOhost eBook",
    abbrName:"EBSCO",
    anySearchUrl:"http://search.ebscohost.com/login.aspx?direct=true&site=eds-live&scope=site&type=0&custid=s5802652&groupid=main&profid=eds&mode=and&lang=en&authtype=ip,guest&bquery=%s&defaultdb=NLEBK",
    isGBK:false
    //,EXP:"title-link-wrapper*?treelist-group"
},

"GoogleDoc":{
    name:"谷歌聚合搜索",
    abbrName:"谷歌",
    anySearchUrl:"https://g.net.co/uds/GwebSearch?rsz=filtered_cse&hl=zh_CN&cx=006100883259189159113%3Atwgohm0sz8q&v=1.0&key=notsupplied&q=%s",
    mirrorUrl:['https://g.net.co/', 'https://www.90r.org/', 'https://soso.red/', 'https://cao.si/'],
    isGBK:false
},

}

function popSetting(){
    // 创建一个新的 <div> 元素用于设置面板
    var settingDiv = document.createElement("div");
    // 设置 <div> 元素的 id 为 "libSetting"
    settingDiv.setAttribute("id", "libSetting");

    // 为设置面板的内部内容设置 HTML 字符串
    settingDiv.innerHTML = 
      "<h2>图书馆检索设置</h2>" + // 标题
      '&nbsp;&nbsp;' + // 添加空白间隔
      '学校：<select id="setschool" class="barname">' + // 学校选择下拉菜单
      '<option value="SYSU">中山大学</option>' + // 中山大学选项
      //'<option value="SCUT">华南理工大学</option>' + // 华南理工大学选项
      //'<option value="SCNU">华南师范大学</option>' + // 华南师范大学选项
      //'<option value="GDUFS">广东外语外贸大学</option>' + // 广东外语外贸大学选项
      //'<option value="GDUT">广东工业大学</option>' + // 广东工业大学选项
      //'<option value="GZHU">广州大学</option>' + // 广州大学选项
      //'<option value="GZHTCM">广州中医药大学</option>' + // 广州中医药大学选项
      //'<option value="GZARTS">广州美术学院</option>' + // 广州美术学院选项
      //'<option value="XHCOM">星海音乐学院</option>' + // 星海音乐学院选项
      '</select>' + 
      '&nbsp;&nbsp;&nbsp;' + // 添加空白间隔
      '学号：<input id="setstudentID" class="barname">' + // 学号输入框
      '&nbsp;&nbsp;&nbsp;' + // 添加更多空白间隔
      '校区：<select id="setcampus" class="barname">' + // 校区下拉菜单
      '<option value="SCampus">南校区</option>' + 
      '<option value="ECampus">东校区</option>' +
      '<option value="NCampus">北校区</option>' +
      '<option value="ZHCampus">珠海校区</option>' +
      '<option value="SZCampus">深圳校区</option>' +
      '</select>' + 
      '&nbsp;&nbsp;' + // 添加空白间隔
      '<br><br>' + // 添加两个换行符
      '手机号：<input id="settelephone" class="barname">' + // 手机号输入框
      '&nbsp;&nbsp;' + // 添加空白间隔
      '姓名：<input id="setname" class="barname">' + // 姓名输入框
      '&nbsp;&nbsp;' + // 添加空白间隔
      '邮箱：<input id="seteMail" class="barname">' + // 邮箱输入框
      '<br><br>' + // 添加两个换行符
      '读者ID或条码：<input id="setLibID" class="barname"><br>*读者ID为荐购页面登录时所填写的ID，请自行查阅本馆读者荐购页面' + 
      '<br><br>' + // 添加两个换行符
      '<a id="setsave" class="setbtn">保存设置并刷新</a>' + // 保存设置并刷新按钮
      '<a id="setclose" class="setbtn">直接关闭</a>'; // 关闭按钮
      //document.body.appendChild(settingDiv);

      
    document.getElementsByTagName("body")[0].appendChild(settingDiv);// 插入完毕

    document.getElementById("setschool").value=prefs.school;
    document.getElementById("setstudentID").value=prefs.studentID;
    document.getElementById("setcampus").value=prefs.campus;
    document.getElementById("settelephone").value=prefs.telephone;
    document.getElementById("setname").value=prefs.name;
    document.getElementById("seteMail").value=prefs.eMail;
    document.getElementById("setLibID").value=prefs.libraryId;
    
    function setSaving(){
        GM_setValue("school",document.getElementById("setschool").value);
        GM_setValue("studentID",document.getElementById("setstudentID").value);
        GM_setValue("campus",document.getElementById("setcampus").value);
        GM_setValue("telephone",document.getElementById("settelephone").value);
        GM_setValue("name",document.getElementById("setname").value);
        GM_setValue("eMail",document.getElementById("seteMail").value);
        GM_setValue("libraryId",document.getElementById("setLibID").value);
        settingDiv.parentNode.removeChild(settingDiv);
        location.reload();    
    } 
    document.getElementById("setsave").addEventListener("click",setSaving,false); 
    document.getElementById("setclose").addEventListener("click",function(){
      settingDiv.parentNode.removeChild(settingDiv)
    },false);
    
}



//函数：提取isbn搜索元信息
var isbnFilter={
  //中山大学
  SYSU: {
    respond:function (reDetails,frameLocation,fullUrl) {
    if (reDetails.status !== 200&&reDetails.status !== 304){
      var msg = new LibMeta("SYSU");
      msg.state="error";
      msg.errorMsg="ISBN连接错误";
      messageCatcher(msg,frameLocation);
      return;
    }
    
    //document.getElementById("footer").textContent=reDetails.responseText;
    if(reDetails.responseText.indexOf('indexpage')!=-1){
      var msg = new LibMeta("SYSU");
      msg.state="recommend";
      messageCatcher(msg,frameLocation);
      return;
    }

    if(reDetails.responseText.indexOf('Search Results')!=-1){
      titleFilter.SYSU.filter(reDetails.responseText,fullUrl,frameLocation);
    } else{
      isbnFilter.SYSU.filter(reDetails.responseText,frameLocation);
    }
                
    return;
    },


    filter:function(gettxt,frameLocation){
      str = gettxt;
      //去除行尾空白、多余空行、URL转码
      str = str.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,""); 
      
      ///获取一整块
      var eBook;
      eBook = null;
      if(str.match(/电子资源定位/)){
        //document.getElementById("footer").textContent=str;
        eBook = str.match(/电子资源定位.*?jpg.*?File Extension: url">(.*?)<\/a>/)[1];
      }
      
      if(!eBook&&str.indexOf("索书")==-1){
        var msg = new LibMeta("SYSU");
        msg.state="recommend";
        messageCatcher(msg,frameLocation);
        return;

      }

      str = str.match(/全部馆藏(.*?)所有单册借阅状态/g)

      var txt = str[0];
      txt = txt.match(/http:.*?sub_library=/)[0];

      GM_xmlhttpRequest({ //获取列表
          method : 'GET',
          synchronous : false,
          url : txt,
          onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("SYSU");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }
                
              var libra =document.createElement("div");
              libra.innerHTML = reDetails.responseText;
              isbnFilter.SYSU.getBookinfo(libra.innerHTML,eBook,frameLocation,txt);//回调函数馆藏位置获取
          }
      });
    },

    //////////////回调函数馆藏位置获取////////////////////////////////
    getBookinfo:function(webText,eBook,frameLocation,url){
      var hasBook = true;
      webText = webText.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");

      ///防止无书籍的情况发生
      if(webText.indexOf('无匹配单册')!=-1){
        var msg = new LibMeta("SYSU");
        msg.state="recommend";
        messageCatcher(msg,frameLocation);
        return null;
      }else{
        blockBook = webText.match(/OPAC注释(.*?)<\/tbody>/)[1];
        borrowItem = blockBook.match(/<tr>.*?<\/tr>/g);
        var loan = new Array();

        for(k=0;k<borrowItem.length;k++){  /////借书类型/时间/到期/分馆/馆藏地/索书号
          loan[k] = borrowItem[k].match(/<!--Loan.*?td1">(.*?)<\/td>.*?date.*?td1">(.*?)<\/td>.*?hour.*?td1>(.*?)<\/td>.*?Sub.*?nowrap="">(.*?)<\/td>.*?Collection.*?nowrap="">(.*?)<\/td>.*?td1">(.*?)<\/td>/);
  
        }
      }

      if(hasBook){
        var storeList = new LibMeta("SYSU");
        storeList.state="store";
        storeList.items= new Array();

        for(s=0;s<borrowItem.length;s++){
           //allBook += bookStatus;
           storeList.items[s]=new StoreItem("SYSU");
           storeList.items[s].storeState=loan[s][1];
           storeList.items[s].returnTime=loan[s][2].replace(/<br>/,"");
           storeList.items[s].branch=loan[s][4];
           storeList.items[s].link=url;
           storeList.items[s].location=loan[s][5];
           storeList.items[s].bookIndex=loan[s][6];
           if(storeList.items[s].storeState.indexOf('外借')!=-1&&storeList.items[s].returnTime.indexOf("在架上")!=-1&&storeList.items[s].storeState.indexOf('闭架')==-1){
                storeList.items[s].rentable=true;
           }
 
        }

        if(eBook){
          var itemsLength=storeList.items.length;
          storeList.items[itemsLength]=new StoreItem("SYSU");         
          storeList.items[itemsLength].link=eBook;
          storeList.items[itemsLength].type="eBook";
          storeList.items[itemsLength].storeState="电子书";
        };
      } 
      messageCatcher(storeList,frameLocation);
      return null;
      
      //////////////////////完成框架插入//////////////

    }
  }

}

//函数：提取title搜索元信息
var titleFilter={
  //中山大学
  SYSU:{

    respond:function(reDetails,frameLocation,fullUrl) {
      if (reDetails.status !== 200&&reDetails.status !== 304){
        var msg = new LibMeta("SYSU");
        msg.state = "error";
        msg.errorMsg = "搜索连接错误";
        messageCatcher(msg,frameLocation);
        return;
      }
      
      if(reDetails.responseText.indexOf('Search Results')!=-1){
        titleFilter.SYSU.filter(reDetails.responseText,fullUrl,frameLocation);
        return;
      }else if(reDetails.responseText.indexOf('记录数')!=-1||reDetails.responseText.indexOf('轮排')!=-1){
        var msg = new LibMeta("SYSU");
        msg.state = "error";
        msg.errorMsg = "搜索页面跳转到了款目/轮排列表页面，<br>此页面无法获取图书详细信息。";
        messageCatcher(msg,frameLocation);
        return;
      }else{
        isbnFilter.SYSU.filter(reDetails.responseText,frameLocation);
        return;
      }
    },

    filter:function (txt,urltext,frameLocation){
      //去除行尾空白、多余空行、URL转码
      str = txt.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,""); 
      atxt= str.match(/col2>.*?<\/table>/g);

      ///////获取图书馆书本元信息//////
      var bookDetail = new Array();//元信息数组
      atxt.shift();//去除整块信息中的多余信息

      for(s=0;s<atxt.length;s++){
        bookDetail[s] = atxt[s].match(/a href=(.*?)>(.*?)<\/a>.*?top>(.*?)<td.*?top>(.*?)<tr>.*?top>(.*?)<td.*?top>(.*?)<tr>/).slice(1);
        // 超链接/ 书名 /作者 / 索引号/出版社 /年份 /
      }

      ////////框架//////////////////////////////////

       //判断URL类型（待选区）
      if(urltext.indexOf('ISB')!=-1){
        var allBook = '<div class="gray_ad" id="sysulib"><h2>中大ISBN检索</h2>' +
                       '<a href="'+ urltext +'" target="_blank">前往图书馆查看这本书</a>'; 
      }else{
        var allBook = '<div class="gray_ad" id="sysulib"><h2>中大图书馆检索</h2>' +
                       '<a href="'+ urltext +'" target="_blank">前往图书馆查看这本书</a>';         
      }
        var display;

        //
        //var allBook = '<div class="gray_ad" id="sysulib"><h2>中大图书馆检索</h2>' +  
        //     '<a href="' + urltext + '" target="_blank">前往图书馆查看这本书</a>';
        //

      var list = new LibMeta("SYSU");////构造函数
      list.state="booklist";
      list.items= new Array();
      
      for(s=0;s<bookDetail.length;s++){
            if(s>4){
              display=" ;display : none";
            }
            else{
              display="";
            }

        list.items[s] = new LibItem("SYSU");
        list.items[s].link = bookDetail[s][0];
        list.items[s].bookName = bookDetail[s][1];
        list.items[s].author = bookDetail[s][2];
        list.items[s].publisher = bookDetail[s][4];
        list.items[s].pubDate = bookDetail[s][5];

      }

      messageCatcher(list,frameLocation);
        //判断URL

      //} 
      ////////////插入框架结束//////////////
    }

    },

  //超星发现全字段
  zhizhen:{
    respond:function (reDetails,frameLocation) {
      if (reDetails.status !== 200&&reDetails.status !== 304){
        var msg = new LibMeta("zhizhen");
        msg.state="error";
        msg.errorMsg="超星发现全字段连接错误";
                //alert("ISBN连接错误");
        messageCatcher(msg,frameLocation);
        return;
      }
        
      if(reDetails.responseText.indexOf('没有找到')!=-1||reDetails.responseText.indexOf('不在IP')!=-1){
        var msg = new LibMeta("zhizhen");
        msg.state="error";
        msg.errorMsg="超星发现全字段查无此书";
        messageCatcher(msg,frameLocation);
        return;
      }

      titleFilter.zhizhen.filter(reDetails.responseText,frameLocation);
    },
      
    filter:function(text,frameLocation){
      text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"");
      var rowText = text.match(/savelist.*?form/g);
      var bookBlock = new Array();

      for(s=0;s<rowText.length;s++){
        bookBlock[s]=rowText[s].match(/[图书].*?href="(\/detail.*?)" target="_blank">(.*?)<\/a>.*?作者：(.*?)<\/li>.*?出处：(.*?)&nbsp;/);
        if(bookBlock[s]==null){
            bookBlock[s]=bookBlock[s-1];
            continue;
          } 
        bookBlock[s].shift();
        //链接|书名|作者|出处
        var getInfo = rowText[s].match(/获得途径：<\/span>(.*?)<\/li>/);
        if(getInfo){
            getInfo[1] = getInfo[1].replace(/href="/g,'href="http://ss.zhizhen.com').replace(/href=\//g,'href=http://ss.zhizhen.com/');
            bookBlock[s][4] = getInfo[1];
        }else{
            bookBlock[s][4]="无获取途径";
        }
      }

      var list = new LibMeta("zhizhen");////构造函数
      list.state="zhizhen";
      list.items= new Array();

      for(s=0;s<rowText.length;s++){
        list.items[s] = new LibItem("zhizhen");
        list.items[s].link ="http://ss.zhizhen.com"+bookBlock[s][0];
        list.items[s].bookName = bookBlock[s][1];
        list.items[s].author = bookBlock[s][2];
        list.items[s].publisher = bookBlock[s][3];
        list.items[s].extra = bookBlock[s][4];
      }
      messageCatcher(list,frameLocation);
    }
  },

  //超星读书全字段
  chaoxing:{
    respond:function (reDetails,frameLocation) {
      if (reDetails.status !== 200&&reDetails.status !== 304){
        var msg = new LibMeta("chaoxing");
        msg.state="error";
        msg.errorMsg="超星读书全字段连接错误";
              //alert("ISBN连接错误");
        messageCatcher(msg,frameLocation);
        return;
      }
        
      //document.getElementById("footer").textContent=reDetails.responseText;
      if(reDetails.responseText.indexOf('没有找到')!=-1){
        var msg = new LibMeta("chaoxing");
        msg.state="error";
        msg.errorMsg="超星读书题名查无此书";
        messageCatcher(msg,frameLocation);
        return;
      }

      titleFilter.chaoxing.filter(reDetails.responseText,frameLocation);

    },

    filter:function(text,frameLocation){
      text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"");
      var rowText = text.match(/pic_upost.*?name.*?<\/p>/g);
      var bookBlock = new Array();

      for(s=0;s<rowText.length;s++){
        bookBlock[s]=rowText[s].match(/title="(.*?)".*?href="(.*?)".*?class="name".*?<span>(.*?)<\/span>/);
        bookBlock[s].shift();
            //|书名|链接|作者
      }
      var list = new LibMeta("chaoxing");////构造函数
      list.state="chaoxing";
      list.items= new Array();
      
      for(s=0;s<rowText.length;s++){
        list.items[s] = new LibItem("chaoxing");
        list.items[s].bookName = bookBlock[s][0];
        list.items[s].link ="http://book.chaoxing.com"+bookBlock[s][1];
        list.items[s].author = bookBlock[s][2];
      }
      
      messageCatcher(list,frameLocation);
    }
  },

  EBSCO:{
    respond:function (reDetails,frameLocation) {
      if (reDetails.status !== 200&&reDetails.status !== 304){
        var msg = new LibMeta("EBSCO");
        msg.state="error";
        msg.errorMsg="EBSCO读书全字段连接错误";
                //alert("ISBN连接错误");
        messageCatcher(msg,frameLocation);
        return;
      }
        
      //document.getElementById("footer").textContent=reDetails.responseText;
      if(reDetails.responseText.indexOf('没有找到')!=-1){
        var msg = new LibMeta("EBSCO");
        msg.state="error";
        msg.errorMsg="EBSCO读书题名查无此书";
        messageCatcher(msg,frameLocation);
        return;
      }

      titleFilter.EBSCO.filter(reDetails.responseText,frameLocation,reDetails.finalUrl);

    },

    filter:function(text,frameLocation,finalUrl){
      text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"");
      var rowText = text.match(/title-link-wrapper.*?treelist-group/g);
      //alert(rowText.length);
      var bookBlock = new Array();
      var abbrUrl=finalUrl.match(/(.*?)results/)[1];

      for(s=0;s<rowText.length;s++){
        //alert(rowText[s]);
        bookBlock[s]=rowText[s].match(/href="(.*?)".*?title="(.*?)".*?caption.*?By:(.*?):(.*?)<p/);
        //link//题名//作者//出版社
        var fullTextLink = null;
        var fullTextLink=rowText[s].match(/title="PDF Full Text" href="(.*?)"/);
            
        //link//书名//
        bookBlock[s].shift();
        if(fullTextLink) fullTextLink.shift();   
        fullTextLink=abbrUrl+fullTextLink;
        if(fullTextLink) bookBlock[s][4]=fullTextLink;
            //document.getElementById("footer").textContent+=s+" "+bookBlock[s]+"\n"+"\n";         
      }
      
      var list = new LibMeta("EBSCO");////构造函数
      list.state="booklist";
      list.items= new Array();
      
      for(s=0;s<rowText.length;s++){
        list.items[s] = new LibItem("EBSCO");
        list.items[s].bookName = bookBlock[s][1];
        list.items[s].link =bookBlock[s][0];
        list.items[s].author = bookBlock[s][2];
        list.items[s].publisher = bookBlock[s][3];
        if(bookBlock[s][4]) list.items[s].extra = bookBlock[s][4];           
      }
      messageCatcher(list,frameLocation);
    }
  }
}


//////////////////图书馆荐购页面Main//////////////////////////////////////

libRecommend = {
  SYSU: function () {
    if (document.getElementsByName("Z13_TITLE") && GM_getValue('doubanTitle')) {

      document.getElementsByName("Z13_TITLE")[0].value = GM_getValue('doubanTitle', 'bookMeta.title');
      document.getElementsByName("Z13_AUTHOR")[0].value = GM_getValue('doubanAuthor', 'bookMeta.author');
      document.getElementsByName("Z13_IMPRINT")[0].value = GM_getValue('doubanPublisher', 'bookMeta.publisher');
      document.getElementsByName("Z13_YEAR")[0].value = GM_getValue('doubanPubdate', 'bookMeta.pubdate');
      document.getElementsByName("Z13_ISBN_ISSN")[0].value = GM_getValue('doubanIsbn', 'bookMeta.isbn');
      document.getElementsByName("Z13_PRICE")[0].value = GM_getValue('doubanPrice', 'bookMeta.price');
      
      // 获取用户设置的校区值并进行映射
      var campusMapping = {
        'SCampus': '1', // 南校区
        'NCampus': '2', // 北校区
        'ECampus': '3', // 东校区
        'ZHCampus': '4', // 珠海校区
        'SZCampus': '5'  // 深圳校区
      };
      var selectedCampus = GM_getValue('campus'); // 获取用户设置的校区代号
      var mappedCampusValue = campusMapping[selectedCampus] || '0'; // 映射校区值，默认为0（未选择）

      document.getElementsByName("Z68_NO_UNITS")[0].value = mappedCampusValue; // 设置推荐校区
      document.getElementsByName("Z303_REC_KEY")[0].value = prefs.libraryId;
      document.getElementsByName("Z46_REQUEST_PAGES")[0].value = '豆瓣读书得分: ' + GM_getValue('doubanRating', 'bookMeta.rating');
      
      if(GM_getValue('doubanLanguage', 'zh') == "en") {
        document.getElementsByName("LIBRARY")[0].value = "02"; // 语言为外语时
      }

      GM_deleteValue('doubanTitle');
      GM_deleteValue('doubanAuthor');
      GM_deleteValue('doubanPublisher');
      GM_deleteValue('doubanPubdate');
      GM_deleteValue('doubanIsbn');
      GM_deleteValue('doubanPrice');
      GM_deleteValue('doubanRating');
      GM_deleteValue('doubanLanguage')
    }
  },
}


///////////////////图书馆荐购页面结束//////////////////


///////////////////框架//////////////////
titleFrame=function(){

  function showOtherFrame(){
    document.getElementById("libTitle").style.display="none";
    document.getElementById("otherTitle").style.display="block";
    document.getElementById("jaysonTitle").style.display="none";
    defineClass=this.getAttribute("data-ready");
    this.setAttribute("class","blue");
    document.getElementById("clickTitle").setAttribute("class","");
    document.getElementById("clickJaysonTitle").setAttribute("class","");
    if(!defineClass){
      this.setAttribute("data-ready","already");
        otherTitle();
    }
  }

  function showOriginFrame(){
    document.getElementById("libTitle").style.display="block";
    document.getElementById("otherTitle").style.display="none";
    document.getElementById("jaysonTitle").style.display="none";
    this.setAttribute("class","blue");
    document.getElementById("clickOtherTitle").setAttribute("class","");
    document.getElementById("clickJaysonTitle").setAttribute("class","");
  }

  function showJaysonFrame(){
    document.getElementById("libTitle").style.display="none";
    document.getElementById("otherTitle").style.display="none";
    document.getElementById("jaysonTitle").style.display="block";
    defineClass=this.getAttribute("data-ready");
    this.setAttribute("class","blue");
    document.getElementById("clickTitle").setAttribute("class","");
    document.getElementById("clickOtherTitle").setAttribute("class","");
    if(!defineClass){
      this.setAttribute("data-ready","already");
      jaysonTitle();//改为谷歌
    }
  }
    
  var frame = document.createElement("div");

  googleCustomUrl="https://www.google.com/cse?q="+bookMeta.title+"&newwindow=1&cx=006100883259189159113%3Atwgohm0sz8q";
  var otherTabName="超星";
  if(bookMeta.lan=="en") otherTabName="EBSCO";
  //console.log("otherTabName: ", otherTabName);

  // 创建一个框架的 HTML 内容
  frame.innerHTML = 
      // 创建一个包含三个选项卡的菜单列表（图书馆、其他选项、谷歌聚合搜索）
      '<ul class="tabmenu">' + 
        // 第一个选项卡：显示当前学校图书馆的简称
        '<li id="clickTitle" class="blue"><a>' + schoolInfo[prefs.school].abbrName + '</a></li>' + 
        // 第二个选项卡：显示其他选项的名称
        '<li id="clickOtherTitle"><a>' + otherTabName + '</a></li>' + 
        // 第三个选项卡：谷歌聚合搜索
        '<li id="clickJaysonTitle"><a>' + '谷歌聚合搜索' + '</a></li>' + 
      '</ul>' +

      // 创建图书馆检索的内容区域，显示当前学校图书馆的全字段检索标题
      '<div id="libTitle" class="tab_content libBottom">' + 
        '<h2>' + schoolInfo[prefs.school].abbrName + '图书馆全字段检索</h2>' + 
      '</div>' +

      // 创建其他选项的内容区域，初始状态为隐藏（display: none）
      '<div id="otherTitle" class="tab_content libBottom" style="display:none">' + 
        // 用于存放其他选项的主要内容
        '<div id="mainOtherTitle">' + 
        '</div>' + 
        // 用于显示错误信息
        '<div id="errorOtherTitle"></div>' + 
      '</div>' +

      // 创建谷歌聚合搜索的内容区域，初始状态为隐藏
      '<div id="jaysonTitle" class="tab_content libBottom" style="display:none">' + 
        // 显示谷歌聚合搜索的标题和按钮，点击按钮将打开新的页面
        '<h2>' + 
          '<a target="_blank" class="gotobtn" href="' + googleCustomUrl + '">前往谷歌聚合搜索</a><br>' + 
        '</h2>' + 
        // 显示加载动画，提示用户正在加载内容
        '<div id="googleLoading">' + 
          '<li class="loadingSource">' + 
            '<img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw==">' + 
            ' 努力加载中...' + 
          '</li>' + 
        '</div>' + 
      '</div>';


  frame.setAttribute("class","tablist title_div");

  if(location.href.indexOf("ebook")!=-1){
    var aside=document.getElementsByTagName("aside")[0];
  }else{
    var aside=document.querySelector(".aside");        
  }

  aside.insertBefore(frame,aside.firstChild.nextSibling);
  clickOther=document.getElementById("clickOtherTitle");
  clickOther.addEventListener("click",showOtherFrame,false);
  clickOther=document.getElementById("clickTitle");
  clickOther.addEventListener("click",showOriginFrame,false);
  clickOther=document.getElementById("clickJaysonTitle");
  clickOther.addEventListener("click",showJaysonFrame,false);
}


ISBNFrame=function(){
  function showOtherFrame(){
    document.getElementById("libISBN").style.display="none";
    document.getElementById("otherISBN").style.display="block";
    defineClass=this.getAttribute("data-ready");
    this.setAttribute("class","blue");
    document.getElementById("clickISBN").setAttribute("class","");
    if(!defineClass){
      this.setAttribute("data-ready","already");
      otherISBN();
    }
  }

  function showOriginFrame(){
    document.getElementById("libISBN").style.display="block";
    document.getElementById("otherISBN").style.display="none";
    this.setAttribute("class","blue");
    document.getElementById("clickOtherISBN").setAttribute("class","");
  }

  var frame = document.createElement("div");

  var NLCfinalUrl = schoolInfo.NLC.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);  // 使用正确的ISBN10值
  var CALISfinalUrl = schoolInfo.CALIS.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);
  var GZlibfinalUrl = schoolInfo.GZlib.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);
  var SZlibfinalUrl = schoolInfo.SZlib.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);
  var ZHlibfinalUrl = schoolInfo.ZHlib.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);
  var DGlibfinalUrl = schoolInfo.DGlib.isbnSearchUrl.replace(/%s/, bookMeta.isbn10);

  // 设置 frame 的内部 HTML 内容
  frame.innerHTML = 
      // 创建一个无序列表（tabmenu），包含三个选项卡：ISBN、其他图书馆、设置
      '<ul class="tabmenu">' +
        // 第一个选项卡：显示当前学校的简称，并设为蓝色
        '<li id="clickISBN" class="blue"><a>' + schoolInfo[prefs.school].abbrName + '</a></li>' +
        // 第二个选项卡：显示“其他图书馆”
        '<li id="clickOtherISBN"><a>其他图书馆</a></li>' +
        // 第三个选项卡：显示“设置”
        '<li id="settingPop"><a>设置</a></li>' +
      '</ul>' +

      // 创建一个 div 容器用于显示当前学校图书馆的 ISBN 检索结果
      '<div id="libISBN" class="tab_content libTop">' +
        // 显示当前学校的图书馆 ISBN 检索标题
        '<h2>' + schoolInfo[prefs.school].abbrName + '图书馆ISBN检索</h2>' +
      '</div>' +

      // 创建另一个 div 容器用于显示其他图书馆的 ISBN 检索结果，初始状态为隐藏
      '<div id="otherISBN" class="tab_content libTop" style="display:none">' +
        // 包含前往 CALIS 和国家图书馆的按钮链接
        '<div id="mainOtherISBN">' +
          '<a target="_blank" class="gotobtn" href="' + CALISfinalUrl + '">前往CALIS</a>' + 
          ' &nbsp;' + 
          '<a target="_blank" class="gotobtn" href="' + NLCfinalUrl + '">前往中国国家图书馆</a>' +
          '<br>' + 
          '<a target="_blank" class="gotobtn" href="' + GZlibfinalUrl + '">前往广州图书馆</a>' +
          ' &nbsp;' + 
          '<a target="_blank" class="gotobtn" href="' + SZlibfinalUrl + '">前往深圳图书馆</a>' +
          '<br>' + 
          '<a target="_blank" class="gotobtn" href="' + ZHlibfinalUrl + '">前往珠海图书馆</a>' +
          ' &nbsp;' + 
          '<a target="_blank" class="gotobtn" href="' + DGlibfinalUrl + '">前往东莞图书馆</a>' + 
        '</div>' +
        // 显示其他图书馆 ISBN 检索的错误信息（如果有）
        '<div id="errorOtherISBN"></div>' +
      '</div>';

  frame.setAttribute("class","tablist");
  if(location.href.indexOf("ebook")!=-1){
    var aside=document.getElementsByTagName("aside")[0];
  }else{
    var aside=document.querySelector(".aside");        
  }
  aside.insertBefore(frame,aside.firstChild);
  clickOther=document.getElementById("clickOtherISBN");
  clickOther.addEventListener("click",showOtherFrame,false);
  clickOther=document.getElementById("clickISBN");
  clickOther.addEventListener("click",showOriginFrame,false);
  document.getElementById("settingPop").addEventListener("click",popSetting,false);

}

//////////////////////超星其它//////////////////////////////////
//////////////////////////超星发现和超星读书
function otherTitle(){

  if(bookMeta.lan=="en"){
    var fullUrl=schoolInfo.EBSCO.anySearchUrl.replace(/%s/,bookMeta.title);//外文图书
  }else{
    var fullUrl=schoolInfo.zhizhen.anySearchUrl.replace(/%s/,bookMeta.title);
    var fullUrl2=schoolInfo.chaoxing.anySearchUrl.replace(/%s/,bookMeta.title);
  }

  var frame=document.getElementById("mainOtherTitle");
  var loadingFrame=document.createElement("div");
  loadingFrame.setAttribute("id","otherTitleLoading");
  loadingFrame.innerHTML= '<li class="loadingSource"><img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw=="> 努力加载中...</li>'

  var frameLink = document.createElement("a");
  frameLink.setAttribute("target","_blank");
  frameLink.innerHTML="前往查看检索";
  frameLink.setAttribute("href",fullUrl);
  frame.appendChild(frameLink);
  frame.appendChild(loadingFrame);

  if(bookMeta.lan=="zh"){
    GM_xmlhttpRequest({ //获取列表
      method : 'GET',
      synchronous : false,//异步获取
      url : fullUrl,
      onload :function (reDetails){           
        titleFilter.zhizhen.respond(reDetails,"otherTitle",fullUrl);
      }
    });
        //////////////////////
    GM_xmlhttpRequest({ //获取列表
      method : 'GET',
      synchronous : false,//异步获取
      url : fullUrl2,
      onload :function (reDetails){            
        titleFilter.chaoxing.respond(reDetails,"otherTitle",fullUrl2);
      }
    });

  } else {
    GM_xmlhttpRequest({ //获取列表
      method : 'GET',
      synchronous : false,//异步获取
      url : fullUrl,
      onload :function (reDetails){             
      titleFilter.EBSCO.respond(reDetails,"otherTitle",fullUrl);
      }
    });
  }

}

//////////////////谷歌检索，改自豆藤////////////////////////////
var jaysonTitle = function(){
  var keyw = bookMeta.title;
  var cid = '006100883259189159113%3Atwgohm0sz8q'
     //http://g.yon.hk/uds/GwebSearch?rsz=filtered_cse&hl=zh_CN&cx=006100883259189159113%3Atwgohm0sz8q&v=1.0&key=notsupplied&q=allintitle%3Aboy
  var getSite = function(){
    return [ 
      //'https://gs.awei.me/'//'http://g.yh.gs/'
      //,'https://www.ppx.pw/'
      'http://www.guge.link/',
      //'https://www.ko50.com/',
      'https://www.guge.click/',
      //'http://gg.cellmean.com/',
      'https://google.xface.me/',
      'http://google.sidney-aldebaran.me/',
      //'https://guge.in/',
      //'http://www.ggooo.net/',
      'https://gg.kfd.me/',
      //'https://www.ko50.com/',
      //'https://google-hk.wewell.net/',
      //'http://www.googlestable.cn/',
      //'http://hisbig.com/',
      //'http://gg.cellmean.com/',
      'https://www.sslpxy.com/',
      'http://xueshu.cytbj.com/',
      //'https://www.nssjs.com/',
      //'https://hk.g.net.co/'
    ][Math.floor(Math.random() * 7 + 1)-1];
    // ******** Google 镜像 ********
  };

  var googleLoader = function(site){
    var path = site || 'http://www.google.com/';
    // var path = 'https://repigu.com/';
                    
    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
          "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
          "Accept": "text/html;charset=utf-8"   // If not specified, browser defaults will be used.
        },
        url: path + 'uds/GwebSearch?rsz=filtered_cse&hl=zh_CN&cx='+cid+'&v=1.0&key=notsupplied&q=allintitle%3A' + keyw,
        
        onload: function(resp){
          //alert(resp.status);
          if(resp.status < 200 || resp.status > 300){
            googleLoader(getSite()); // 切换镜像
            return;
          };
          if(resp.responseText.indexOf('Abuse')!==-1){
            //alert("Abuse");
            googleLoader(getSite()); // 切换镜像
            return;
          }
          
          var date = JSON.parse(resp.responseText);
          var loading =document.getElementById("googleLoading");
          if(loading) loading.parentNode.removeChild(loading);
          var itemNum = date.responseData.results.length; //搜索结果条目数
          if(itemNum == 0){
            document.getElementById("jaysonTitle").innerHTML+='<div>未找到相关内容</div>';
          };                           
                            
          for(var i=0,j=itemNum; i<j; i++){
            var itemi = date.responseData.results[i]; //itemi 搜索结果条目i
            //alert(itemi);
            var webSite = !!itemi.perResultLabels && itemi.perResultLabels[0].anchor || ''; 
            //alert(webSite);
            webSite="【"+webSite+"】";
            //如果是图书，则将来源网站改为文档类型                               
            var docType = itemi.title.match(/\.(txt|pdf|doc|ppt|chm|rar|exe|zip|epub|mobi|caj|jar)/i);
            !!docType && (webSite = '【' + docType[1].toUpperCase() + '】');
            document.getElementById("jaysonTitle").innerHTML += '<li style="font-size: 12px;list-style-type:none"' +'><span class="pl">'+ webSite +'</span><a href="' + decodeURIComponent(itemi.url).replace('pan.baidu.com/wap/link', 'pan.baidu.com/share/link') + '" title="' + itemi.titleNoFormatting + '" target="_blank">' + itemi.title.replace(/_免费高速下载_新浪爱问共享资料|-epub电子书下载.*|–华为网盘.*|-在线下载.*|网盘下载\|115网盘.*|迅雷快传-|\| IMAX\.im 高清影院|资源下载,中文字幕下载,|电影,|下载,|已上映,|,下载《.*|\| 720p 高清电影\(imax.im\)|[\[【\(（][^\[\]]*\.(com|cn|net|org|cc)[\]】\)）]/gi, '') + '</a></li>';
          };
                            
        },
        onerror: function(){
          googleLoader(getSite());
          return;
        }
      });
  };
  googleLoader(getSite());
};

//////////////ISBN搜索xml获取//////////////////
mineISBN = function(school,frameLocation){

  if(frameLocation=="ISBN"){
    ISBNFrame();
  }
   
  if(bookMeta.isbn){
    var fullUrl="";
    switch(school){
      case "SCUT":
      case "SCNU":
      case "GZHU":
      case "GDUT":
      case "GZHTCM":
      case "GZARTS":
      case "XHCOM":
        fullUrl =schoolInfo[school].isbnSearchUrl.replace(/%s/,bookMeta.isbn10);
        break;
      case "SYSU":
      case "GDUFS":
        if(bookMeta.isbn&&bookMeta.title.charCodeAt(0)<=122&&bookMeta.isbn[3]!=="7"){
          fullUrl=schoolInfo[school].isbnForeianSearchUrl.replace(/%s/,bookMeta.isbn);  
        }else{
          fullUrl=schoolInfo[school].isbnSearchUrl.replace(/%s/,bookMeta.isbn);        
        }
        break;
      default:
        break;
    }

    if(frameLocation=="ISBN"){
      insertLoading(fullUrl);
    }
    frame = document.getElementById("libISBN");  //此处frame需要删除    

    GM_xmlhttpRequest({ //获取列表
      method : 'GET',
      synchronous : false,//异步获取
      url : fullUrl,
      onload :function (reDetails){
        isbnFilter[school].respond(reDetails,frameLocation,fullUrl);
      }
    });
    
  }else{//无ISBN号的情况
    var msg = new LibMeta(school);
    msg.error=true;
    msg.state="error";
    msg.errorMsg = "无法获取ISBN号";
    messageCatcher(msg,frameLocation)
  }

}

function insertLoading(fullUrl){
  var frame = document.getElementById("libISBN");
  var frameLink = document.createElement("a");
  frameLink.setAttribute("target","_blank");
  frameLink.innerHTML="前往图书馆查看这本书";
  frameLink.setAttribute("href",fullUrl);
  frame.appendChild(frameLink);

  var loadingFrame=document.createElement("div");
  loadingFrame.setAttribute("id","ISBNLoading");
  loadingFrame.innerHTML= '<li id="loadingSource"><a><img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw=="> 努力加载中...</a></li>'

  frame.appendChild(loadingFrame);
}


//////////////书名搜索xml获取//////////////////
mineTitle = function(school){
  titleFrame();
  if(bookMeta.isbn&&bookMeta.title.charCodeAt(0)<=122&&bookMeta.isbn[3]!=="7"){
    var fullUrl=schoolInfo[school].anyForeianSearchUrl.replace(/%s/,bookMeta.title);
    GM_setValue("doubanLanguage","en");
  }else{
    var fullUrl=schoolInfo[school].anySearchUrl.replace(/%s/,bookMeta.title);           
  }

  var frame = document.getElementById("libTitle");
  var loadingFrame=document.createElement("div");
  loadingFrame.setAttribute("id","titleLoading");
  loadingFrame.innerHTML= '<li id="loadingSource"><img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw=="> 努力加载中...</li>'

  var frameLink = document.createElement("a");
  frameLink.setAttribute("target","_blank");
  frameLink.innerHTML="前往图书馆查看这本书";
  frameLink.setAttribute("href",fullUrl);
  frame.appendChild(frameLink);
  frame.appendChild(loadingFrame);

  if(!schoolInfo[school].isGBK){
    GM_xmlhttpRequest({ //获取列表
        method : 'GET',
        synchronous : false,//异步获取
        url : fullUrl,
        onload :function (reDetails){
          titleFilter[school].respond(reDetails,"title",fullUrl);
        }
    });
  }else {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://www.baidu.com/s?ie=utf-8&wd=' + encodeURIComponent(bookMeta.title),
      overrideMimeType: 'text/xml; charset=gb2312',
      onload: function(response) {
        //alert("text");
        if (response.status !== 200&&response.status !== 304){
          var msg = new LibMeta(school);
          msg.state="error";
          msg.errorMsg="无法获取远程GBK转码";
          messageCatcher(msg,frameLocation);
          return;
        }
        var keywordGB = String(response.responseText.match(/word=[^'"&]+['"&]/i)).replace(/word=|['"&]/ig,'');
        fullUrl=  schoolInfo[school].anySearchUrl.replace(/%s/,keywordGB);
        frameLink.setAttribute("href",fullUrl);
                
        //alert(fullUrl);
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
            synchronous : false,//异步获取
            url : fullUrl,
            onload :function (reDetails){
              titleFilter[school].respond(reDetails,"title",fullUrl);
            }
        });
      },
      onerror: function(){
        return;
      }
    });
  }
}


///////////////ISBN插入框架//////////////////////////////
ISBNInsert=function(msg, frameLocation){
  var innerContent=document.createElement("div");
  innerContent.innerHTML= msg;
  switch(frameLocation){
    case "ISBN":
      loading =document.getElementById("ISBNLoading");
      loading.parentNode.removeChild(loading);
      frame = document.getElementById("libISBN");
      break;
    case "title":
      loading =document.getElementById("titleLoading");
      loading.parentNode.removeChild(loading);
      frame = document.getElementById("libTitle");
      break;
    case "otherISBN":
      frame = document.getElementById("mainOtherISBN");
      break;
    default:
      break;
  }
  frame.appendChild(innerContent);
  
  function addStoreListener(){
    GM_setClipboard(this.getAttribute("data-storeInfo"));

    noteInfo = "已复制到粘贴板 "+this.getAttribute("data-storeInfo");

   // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      confirm("以下信息已复制到粘贴板\n\n"+this.getAttribute("data-storeInfo"));
    }

   // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
        var notification = new Notification(noteInfo);
    }

   // Otherwise, we need to ask the user for permission
   // Note, Chrome does not implement the permission static property
   // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Whatever the user answers, we make sure we store the information
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }

        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(noteInfo);
        }else{
          confirm("以下信息已复制到粘贴板\n\n"+this.getAttribute("data-storeInfo"));
        }
      });
    }else{
      confirm("以下信息已复制到粘贴板\n\n"+this.getAttribute("data-storeInfo"));
    }
  }
  
  var storeListener = document.querySelectorAll(".preStoreRegister");
  for(s=0;s<storeListener.length;s++){
    storeListener[s].addEventListener("dblclick",addStoreListener,false);
    storeListener[s].classList.remove("preStoreRegister");            
  }
}

///////////////Title插入框架//////////////////////////////
titleInsert=function(msg,frameLocation){
  var innerContent=document.createElement("div");
  innerContent.innerHTML= msg;
  
  switch(frameLocation){
    case "ISBN":
      var loading =document.getElementById("ISBNLoading");
      loading.parentNode.removeChild(loading);
      frame = document.getElementById("libISBN");
      break;
    case "title":
      GM_addStyle("#libTitle { max-height: 300px;overflow: auto; }");
      if(loading =document.getElementById("titleLoading")){
        loading.parentNode.removeChild(loading);
      }
      frame = document.getElementById("libTitle");
      break;
    case "otherISBN":
      frame = document.getElementById("mainOtherISBN");
      break;
    case "otherTitle":
      var loading =document.getElementById("otherTitleLoading");
      if(loading) loading.parentNode.removeChild(loading);
      frame = document.getElementById("mainOtherTitle");
      break;
    default:
      break;
  }  
  frame.appendChild(innerContent);
}

///////////////Title插入框架//////////////////////////////
errorInsert=function(msg,frameLocation,school){
  var innerContent=document.createElement("div");
  innerContent.innerHTML= msg;
    
  switch(frameLocation){
    case "ISBN":
      frame = document.getElementById("libISBN");
      if(loading =document.getElementById("ISBNLoading")){
        loading.parentNode.removeChild(loading);
      }      
      break;
    case "title":
      frame = document.getElementById("libTitle");
      if(loading =document.getElementById("titleLoading")){
        loading.parentNode.removeChild(loading);
      };
      break;
    case "otherISBN":
      frame = document.getElementById("errorOtherISBN"); 
      if(!frame.textContent){
        frame.innerHTML+="以下院校查无此书: "
      }
      frame.innerHTML+=school+"&nbsp|&nbsp"; 
      break;
    case "otherTitle":
      var loading =document.getElementById("otherTitleLoading");
      if(loading) loading.parentNode.removeChild(loading);
      frame = document.getElementById("errorOtherTitle"); 
      break;
    default:
      return;
  }
  if(frameLocation!="otherISBN") frame.appendChild(innerContent);
}


//////////////豆瓣网页荐购获取/////////////////////////
recommendBook = function(frameLocation,school){
  var innerContent=document.createElement("div");
  
  //根据frameLocation选择框架
  switch(frameLocation){
    case "ISBN":
      loading =document.getElementById("ISBNLoading");
      loading.parentNode.removeChild(loading);
      frame = document.getElementById("libISBN");
      break;
    case "title":
      loading =document.getElementById("titleLoading");
      loading.parentNode.removeChild(loading);
      frame = document.getElementById("libTitle");
      break;
    case "otherISBN":
      frame = document.getElementById("errorOtherISBN"); 
      if(!frame.textContent){
        frame.innerHTML+="以下院校查无此书: "
      }
      frame.innerHTML+=schoolInfo[school].abbrName+" ";
      return;
    default:
      return;
  }
  
  //设置荐购按钮      
  function gotoRecommend(){
    GM_setValue('doubanTitle',bookMeta.title);
    GM_setValue('doubanAuthor',bookMeta.author);
    GM_setValue('doubanPublisher',bookMeta.publisher);
    GM_setValue('doubanPubdate',bookMeta.pubdate);
    GM_setValue('doubanIsbn',bookMeta.isbn||bookMeta.bookIndex);
    GM_setValue('doubanPrice',bookMeta.price);
    GM_setValue('doubanRating',bookMeta.rating);
    GM_openInTab(schoolInfo[prefs.school].recommendUrl);
  };

  // 定义一个样式字符串，用于设置元素的外观
  var style = (
  'style="' +  // 开始定义样式属性
    'display: inline-block; ' +  // 使元素成为内联块级元素，这样它可以设置宽度和高度，但仍然保持在文本流中
    'background: #33A057; ' +  // 设置背景颜色为绿色
    'border: 1px solid #2F7B4B; ' +  // 设置边框为 1 像素实线，颜色为深绿色
    'color: white; ' +  // 设置文本颜色为白色
    'padding: 1px 10px; ' +  // 设置内边距，垂直方向 1 像素，水平方向 10 像素
    'border-radius: 3px; ' +  // 设置圆角半径为 3 像素，使边框角变圆滑
    'margin-right: 8px;' +  // 设置右边距为 8 像素
  '"'  // 结束样式属性定义
  );


  statBtn = ('<a id="recbtn" rel="modal:open"' + style + '>荐购</a>' );

  var allBook = '<ul><li>ISBN查询无此书'+statBtn+'</li></ul>';
   
  innerContent.innerHTML= allBook;
  frame.appendChild(innerContent);

  button=document.getElementById("recbtn");
  if(button){
    button.addEventListener("click",gotoRecommend,false);    
  }
 
}


///////获取回调数据//////////////
messageCatcher=function(msg,frameLocation){
  switch(msg.state){
    case "store":
      var allBook="";
      var otherAbbr="";
      if(frameLocation.indexOf("other")!=-1){
        otherAbbr="院校:"+schoolInfo[msg.school].abbrName+" ";
      }

      var attachRent="";
      for(s=0;s<msg.items.length;s++){
        if(msg.items[s].rentable){
          attachRent=' rentable'
        }else{
          attachRent='';
        }
        storeInfo = bookMeta.title+" "+schoolInfo[msg.school].name+" ";
        //msg.items[s].bookIndex=null;
        if(msg.items[s].bookIndex) storeInfo+="索书号:"+msg.items[s].bookIndex+" ";            
        if(msg.items[s].branch) storeInfo+="分馆:"+msg.items[s].branch+" ";
        if(msg.items[s].location) storeInfo+="馆藏地:"+msg.items[s].location;
        bookStatus =  '<ul class="preStoreRegister storelist ft pl more-after'+attachRent+'" data-storeInfo="'+storeInfo+'" '+'title="双击可粘贴馆藏信息到剪贴板"'+'> ' +//+'ondblclick="GM_setClipboard(this.getAttribute('+"'data-storeInfo'"+'))"'
                      '<li style="border: none"><a href="'+msg.items[s].link+'" target="_blank">'+otherAbbr+'状态:' + msg.items[s].storeState+
                      '<span style="position:relative; ">  应还日期: ' + msg.items[s].returnTime +'</span></a></li>' + 
                      '<li style="border: none">分馆: ' + msg.items[s].branch + '</li>' +
                      '</ul>';                        
        allBook += bookStatus;
      }

      ISBNInsert(allBook,frameLocation);
      break;
      
    case "booklist":
      var display;
      var allBook = "";
      var otherAbbr="";
      var extra="";
      //alert(msg.school);
      if(frameLocation.indexOf("other")!=-1){
        if(msg.school=="EBSCO"){
          otherAbbr=schoolInfo[msg.items[0].school].abbrName+" ";
        }else{
          otherAbbr="院校:"+schoolInfo[msg.items[0].school].abbrName+" ";
        }
      }
      for(s=0;s<msg.items.length;s++){
        if(s>4){
          display="display : none;";
        }else{
          display="";
        }

        if(msg.school=="EBSCO"){
          extra='<li class="getlink"><a target="_blank" href="'+msg.items[s].extra+'">Full Text</a></li>';
        }

        bookStatus =  '<ul class="ft pl more-after"> ' +'<li style="border: none">'+otherAbbr+'书名:<a href="'+msg.items[s].link +
                      '"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
                      '<li style="overflow:hidden;border: none;'+display+'">作者: ' + msg.items[s].author  + 
                      '  出版社:' + msg.items[s].publisher + '</li>' +extra+
                      '</ul>';
                                                 
        allBook += bookStatus;
      }

      titleInsert(allBook,frameLocation);
      break;

    case "recommend":
      recommendBook(frameLocation,msg.school);
      break;

    case "error":
      var bookStatus = '<ul class="ft pl more-after"> ' +
                     '<li style="border: none">' + msg.errorMsg+'</li>' +
                     '</ul>';

      errorInsert(bookStatus,frameLocation,schoolInfo[msg.school].abbrName);
      break;

    case "zhizhen"://超星发现
      var display;
      var allBook = "";
      var otherAbbr="";
      otherAbbr=schoolInfo[msg.items[0].school].abbrName+" ";
      for(s=0;s<msg.items.length;s++){
        if(s>4){
          display="display : none;";
        }else{
          display="";
        }
        bookStatus =  '<ul class="ft pl more-after"> ' +'<li style="border: none">'+otherAbbr+'书名:'+
                      '<a href="'+msg.items[s].link+'"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
                      '<li><span style="overflow:hidden;border: none;'+display+'">作者: ' + msg.items[s].author  + 
                      '  出版社:' + msg.items[s].publisher + '</span></li>'+
                      '<li><span class="getlink">获取途径:'+msg.items[s].extra+'</span></li>' +
                      '</ul>';               
        allBook += bookStatus;
      }
      titleInsert(allBook,frameLocation);
      break;

    case "chaoxing"://超星读书
      var display;
      var allBook = "";
      var otherAbbr="";
      otherAbbr=schoolInfo[msg.items[0].school].abbrName+" ";
      for(s=0;s<msg.items.length;s++){
        if(s>4){
          display="display : none;";
        }else{
          display="";
        }
        bookStatus =  '<ul class="ft pl more-after"> ' + '<li style="border: none">'+ otherAbbr + 
                      '书名:'+'<a href="'+msg.items[s].link+'"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
                      '<li><span style="overflow:hidden;border: none;'+display+'">作者: ' + msg.items[s].author  + '</span></li>' +                      
                      '</ul>';               
        allBook += bookStatus;
      }
      titleInsert(allBook,frameLocation);
      break;
    default:
      alert("defalut");
      break;
  }

}
/////////////////////////////////



// 添加自定义样式、在油猴菜单中添加一个命令项
GM_addStyle(`  
  .recbtn {  
      display: inline-block;         /* 设置为行内块元素 */  
      background: #33A057;         /* 背景颜色 */  
      border: 1px solid #2F7B4B;   /* 边框样式 */  
      color: white;                 /* 字体颜色 */  
      padding: 1px 10px;           /* 内边距 */  
      border-radius: 3px;          /* 边框圆角 */  
      margin-right: 8px;           /* 右边距 */  
      cursor: pointer;              /* 鼠标悬停时显示为指针 */  
  }  
`);

GM_registerMenuCommand("图书馆检索设置", popSetting);

//////////////主函数//////////////////////////
////////处理豆瓣网站
if(location.href.indexOf('douban')!=-1){
  
  ////////添加自定义样式
  GM_addStyle(
  // 设置 `.tablist` 类的 CSS 样式，定位方式为相对定位
    ".tablist {position:relative;}" +

    // 设置 `.tab_content` 类的 CSS 样式，用于定义内容区域的样式
    ".tab_content {" +
    "position: relative;" +                 // 相对定位
    "width:295px;" +                        // 内容宽度为 295 像素
    "margin-bottom:5px;" +                  // 底部外边距为 5 像素
    "max-height: 300px;" +                  // 最大高度为 300 像素，内容溢出时显示滚动条
    "overflow: auto;" +                     // 超出内容区域时，自动显示滚动条
    "padding:15px 5px 15px 5px;" +          // 内边距设置为四边分别 15px、5px、15px、5px
    "border:1px solid #91a7b4;" +           // 边框为实线，颜色为 #91a7b4
    "border-radius:3px;" +                  // 圆角边框，半径为 3 像素
    "box-shadow:0 2px 3px rgba(0,0,0,0.1);" + // 添加阴影，偏移量为 0px 横向，2px 纵向，模糊半径为 3px，颜色为半透明黑色
    "font-size:1.2em;" +                    // 字体大小为 1.2 倍标准字号
    "line-height:1.5em;" +                  // 行高为 1.5 倍标准行高
    "color:#666;" +                         // 字体颜色为 #666
    "background:#F6F6F1;" +                 // 背景颜色为 #F6F6F1
    "}" +

    // 设置 `.tabmenu` 类的 CSS 样式，用于定义菜单区域的样式
    ".tabmenu {" +
    "position:absolute;" +                  // 绝对定位
    "bottom:100%;" +                        // 将菜单放置在容器顶部（即相对容器底部的 100%）
    "margin:0;" +                           // 无外边距
    "width:316px;" +                        // 菜单宽度为 316 像素
    "}" +

    // 设置 `.tabmenu li` 标签的 CSS 样式，设置列表项为内联块元素
    ".tabmenu li{display:inline-block;}" +

    // 设置 `.tabmenu li a` 标签的 CSS 样式，用于定义菜单中的链接样式
    ".tabmenu li a {" +
    "display:block;" +                      // 链接块元素显示
    "padding:5px 10px;" +                   // 内边距设置为 5px（上下）、10px（左右）
    "margin:0 10px 0 0;" +                  // 外边距设置为右边 10px
    "border:1px solid #91a7b4;" +           // 边框为实线，颜色为 #91a7b4
    "border-radius:5px 5px 0 0;" +          // 圆角边框，顶部圆角半径为 5 像素
    "background:#F6F6F1;" +                 // 背景颜色为 #F6F6F1
    "color:#333;" +                         // 字体颜色为 #333
    "text-decoration:none;" +               // 去掉下划线
    "}" +

    // 设置 ID 为 `libISBN`, `libTitle`, `otherISBN`, `otherTitle` 的元素内部 div 和 ul 标签的边框样式
    "#libISBN div ul,#libTitle div ul,#otherISBN div ul,#otherTitle div ul{" +
    "border-bottom: 1px dashed #ddd;" +     // 设置底部边框为虚线，颜色为 #ddd
    "}" +

    // 设置 ID 为 `errorOtherISBN` 的元素的字体大小
    "#errorOtherISBN{font-size:10px}" +     // 字体大小设置为 10 像素

    // 设置类 `.blue` 下的 `a` 标签的背景颜色和字体颜色
    ".blue a{" +
    "background:#37A !important;" +         // 背景颜色设置为 #37A，并用 `!important` 强制应用
    "color:white !important;" +             // 字体颜色设置为白色，并用 `!important` 强制应用
    "}" +

    // 设置 `.tab_content h2` 标签的 CSS 样式，用于定义标题样式
    ".tab_content h2{" +
    "color:#007722;" +                      // 标题颜色设置为 #007722
    "font:15px/150% Arial,Helvetica,sans-serif;" + // 字体设置为 Arial 等，大小为 15 像素，行高为 150%
    "margin: 0 0 12px;" +                   // 外边距设置为下边 12 像素，其他为 0
    "}" +

    // 设置类 `.libTop` 的 CSS 样式，定义顶部外边距
    ".libTop{margin-top:30px;}" +           // 顶部外边距设置为 30 像素

    // 设置 ID 为 `clickISBN`, `clickOtherISBN`, `settingPop` 下的 `a` 标签的光标样式
    "#clickISBN a,#clickOtherISBN a,#settingPop a{" +
    "cursor:pointer;" +                     // 将光标样式设置为手型（点击状态）
    "}" +

    // 设置 ID 为 `settingPop` 的元素的定位和浮动样式
    "#settingPop{" +
    "position:relative;" +                  // 相对定位
    "float:right;" +                        // 向右浮动
    "}" +

    // 设置类 `.rentable` 的背景颜色
    ".rentable{background:#E3F1ED!important;}" + // 背景颜色设置为 #E3F1ED，并用 `!important` 强制应用

    // 设置类 `.ft.pl.rentable` 下 `li a` 标签的字体颜色
    ".ft.pl.rentable li a{" +
    "color:#4f946e;" +                      // 字体颜色设置为 #4f946e
    "}" +

    // 设置类 `.ft.pl.rentable` 下 `li a` 标签悬停时的背景和字体颜色
    ".ft.pl.rentable li a:hover{" +
    "background:#007711;" +                 // 悬停时背景颜色为 #007711
    "color:#FFFFFF;" +                      // 悬停时字体颜色为白色
    "}" +

    // 设置类 `.title_div` 的 CSS 样式，定义顶部外边距
    ".title_div{margin-top: 35px;}"         // 顶部外边距设置为 35 像素
  );

  ////////执行数据数据挖掘操作
  mineISBN(prefs.school,"ISBN");
  mineTitle(prefs.school);

  ////////设置数据元数据
  GM_setValue("doubanTitle",bookMeta.title);
  GM_setValue("doubanAuthor",bookMeta.author);
  GM_setValue('doubanPubdate',bookMeta.pubdate);
  GM_setValue("doubanIsbn",bookMeta.isbn);
  GM_setValue("doubanPublisher",bookMeta.publisher);
}


//处理中山大学图书馆荐购页面
if(location.href.indexOf('http://10.8.11.130:8080/apsm/recommend/recommend.jsp?url_id=http://10.8.11.130:8991/F/')!=-1){
  libRecommend.SYSU();
}

/* 
//处理中大特定页面
if(location.href.indexOf('10.8.11.130:8991')!=-1&&prefs.school!="SYSU"){
  var rentTable=document.getElementsByTagName("table");
  rentTable=rentTable[6];

  function SYSU_interLending(){
    var bookIndex=this.parentNode.parentNode.cells[6].textContent;
    GM_setValue("bookIndex",bookIndex);
    GM_setValue("rentSchool","sysu");
    GM_setValue("gotoRent",true);
    GM_openInTab("http://www.gdtgw.cn:8080/#.html");
  }

  for (var s = 1; s < rentTable.rows.length; s++) {
    var recbtn=document.createElement("a");
    recbtn.setAttribute("class","recbtn");
    recbtn.innerHTML="十校互借";
    rentTable.rows[s].cells[9].innerHTML='';
    rentTable.rows[s].cells[9].appendChild(recbtn);
    recbtn.addEventListener("click",SYSU_interLending,false);
  };
} 
  */

