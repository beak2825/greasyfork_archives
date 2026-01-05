// ==UserScript==  
// @name       广州十校图书馆豆瓣助手
// @description 为豆瓣图书增加广州大学城十校图书馆藏
// @name:en        Douban library helper for Guangzhou Daxuecheng
// @description:en add library collections in Guangzhou Daxuecheng on douban website
// @author      Hanchy Hill
// @namespace   https://minhill.com
// @include     http://book.douban.com/subject/*
// @include     https://book.douban.com/subject/*
// @include     http://202.116.64.108:8080/apsm/recommend/recommend_nobor.jsp*
// @include     http://202.116.64.108:8080/apsm/recommend/recommend.jsp*
// @include     http://202.38.232.10/opac/servlet/opac.go?cmdACT=recommend.form*
// @include     http://read.douban.com/ebook/*
// @include     https://read.douban.com/ebook/*
// @include     http://www.gdtgw.cn:8080/*
// @include     http://opac.gdufs.edu.cn:8991/F/*func=item-global*
// @include     http://202.116.64.108:8991/F/*func=item-global*
// @include     http://202.38.232.10/opac/servlet/opac.go*
// @include     http://lib.gzhu.edu.cn:8080/bookle/search2/detail/*
// @include     http://202.116.41.246:8080/opac/item.php?marc_no=*
// @include     http://210.38.102.131:86/opac/item.php?marc_no=*
// @include     http://222.200.98.171:81/bookinfo.aspx?ctrlno=*
// @include     http://121.33.246.167/opac/bookinfo.aspx?ctrlno=*
// @include     http://218.192.148.33:81/bookinfo.aspx?ctrlno=*
// @include     http://opac.gdufs.edu.cn:8118/apsm/recommend/recommend_nobor.jsp*
// @version     1.9.8
// @license     MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @icon        http://minhill.com/blog/wp-content/uploads/2012/03/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/2766/%E5%B9%BF%E5%B7%9E%E5%8D%81%E6%A0%A1%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/2766/%E5%B9%BF%E5%B7%9E%E5%8D%81%E6%A0%A1%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


GM_addStyle("#ISBNLoading,#titleLoading { list-style-type:none; }");

GM_addStyle("#libSetting {background: #F6F6F1;border: 1px solid #aaa;box-shadow: 0 0 8px 2px #777;height: auto;left: 320px;min-height: 100px;padding: 0 20px 65px;position: fixed;top: 25%;width: 600px;z-index: 1000002;}"+
'.setbtn{display: inline-block; background: #33A057; border: 1px solid #2F7B4B; color: white!important; padding: 1px 10px; border-radius: 3px; margin-right: 8px;margin:5px;cursor:pointer;} '+
'.gotobtn{display: inline-block; background: #33A057!important; border: 1px solid #2F7B4B; color: white!important; padding: 1px 10px; border-radius: 3px;margin-bottom:5px;font-size:0.8em!important;cursor:pointer;} '+
'#otherTitle .getlink a{display: inline-block; border: 1px solid #2F7B4B; padding: 1px 5px; border-radius: 3px;margin-bottom:2px;font-size:0.8em!important;cursor:pointer;text-decoration:none!important;}');

var schoolList=["SYSU","SCUT","SCNU","GDUT","GDUFS","GZHTCM","GZHU","GZARTS","XHCOM"];

//个人选项设置
var prefs={
    school:GM_getValue("school","SYSU"),
    studentID:GM_getValue("studentID","2333333"),
    //password:"Hello_Kitty",
    campus:GM_getValue("campus","东校区"),
    telephone:GM_getValue("telephone","13145201748"),
    name:GM_getValue("name","二三三"),
    eMail:GM_getValue("eMail","HelloKitty@sysu.edu.cn"),
    libraryId:GM_getValue("libraryId","ID1000244462")
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
bookMeta=(function(){
    if(location.href.indexOf('douban')==-1){return null;}//只在豆瓣页面执行

    if(location.href.indexOf('douban.com/subject')!=-1){
        //执行豆瓣图书Func.
    
  var rawBookInfo=document.getElementById("info").innerHTML; //获取info块
  var author = document.querySelector("#info a"); //获取作者
  if (author){
    author = author.innerHTML.trim();

  }

  var title =document.querySelector('h1 span').textContent;
  var bracketIndex = title.indexOf("(");//去除括号，防止搜索进行子匹配操作
    if(bracketIndex!=-1){
        title=title.slice(0,bracketIndex);
    }

  bracketIndex = title.indexOf("（");//去除括号，防止搜索进行子匹配操作
    if(bracketIndex!=-1){
        title=title.slice(0,bracketIndex);
    }

  var publisher = /出版社:<\/span>(.*)<br>/.exec(rawBookInfo);
  if (publisher !== null){
    publisher = publisher[1].trim();
  }

  var pubdate = /出版年:<\/span>(.*)<br>/.exec(rawBookInfo); 
  if (pubdate !== null){
    pubdate = /[\d]+/.exec(pubdate[1].trim());
    pubdate = pubdate[0];
  }

  var price = /定价:<\/span>(.*)<br>/.exec(rawBookInfo);
  if (price !== null){
    price = price[1].trim();
  }

  var isbn = /ISBN:<\/span>(.*)<br>/.exec(rawBookInfo);
  if (isbn !== null){
    isbn = isbn[1].trim();
  }
  var bookIndex = /统一书号:<\/span>(.*)<br>/.exec(rawBookInfo);
  if (bookIndex !== null){
    bookIndex = bookIndex[1].trim();
  }

  var rating = document.querySelector('#interest_sectl .rating_num').innerHTML.trim();
  if (!rating) {
    rating = '暂无评分';
  }
  }

  else if(location.href.indexOf('ebook')!=-1){//豆瓣电子书页面
    var allNodes, isbn=null;
    allNodes = document.evaluate('//a[@itemprop="isbn"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);//获取isbn
    if(allNodes.snapshotItem(0)){
        isbn=allNodes.snapshotItem(0).innerHTML;
    }
//////////////

////////////
    var title;
    allNodes = document.evaluate('//h1[@itemprop="name"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    if(allNodes.snapshotItem(0)){
        title=allNodes.snapshotItem(0).innerHTML;
        var bracketIndex = title.indexOf("(");//去除括号，防止搜索进行子匹配操作
        if(bracketIndex!=-1){
            title=title.slice(0,bracketIndex);
        }
    
        bracketIndex = title.indexOf("（");//去除括号，防止搜索进行子匹配操作
            if(bracketIndex!=-1){
            title=title.slice(0,bracketIndex);
        }
    }

    var publisher;
    allNodes = document.evaluate('//span[@itemprop="publisher"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    if(allNodes.snapshotItem(0)){
        publisher=allNodes.snapshotItem(0).innerHTML;
    }

    var author;
    allNodes = document.evaluate('//span[@itemprop="author"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    if(allNodes.snapshotItem(0)){
        author=allNodes.snapshotItem(0).innerHTML;
    }

    var pubdate;
    allNodes = document.evaluate('//span[@itemprop="datePublished"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    if(allNodes.snapshotItem(0)){
        pubdate=allNodes.snapshotItem(0).innerHTML;
        pubdate=pubdate.slice(0,4);
    }    

    var rating='暂无评分';
    var price="";
    var bookIndex="";
  }
//////////////////////ISBN转为旧格式///////////////////////////////////
  function ISBN10(isbn){
    if(isbn == null){
        return null;
    }
    else if(pubdate == null){
        return isbn;
    }

    if(isbn.length==13){

    var rawISBN=isbn.slice(3,12);

    var checkCode=0;//校验码
    for(i=0;i<9;i++){
        checkCode+=parseInt(rawISBN[i])*(10-i);
    }

    checkCode=11-checkCode%11;
    if(checkCode==10){checkCode="X";}


    var preCode="";
    publishDate=Number(pubdate.slice(0,4));
    if((publishDate)>=2007){//判断年份以检查是否需要加前缀和修正校验位
        preCode=isbn.slice(0,3)+"-";
        checkCode=isbn[12];
    }
}
    else{//ISBN只有10位的时候，年份小于2007时校验位为原码
        rawISBN =isbn.slice(0,9);
        checkCode = isbn[9];
        preCode="";
        publishDate=Number(pubdate.slice(0,4));
    if((publishDate)>=2007){//判断年份以检查是否需要加前缀和修正校验位
        preCode='978'+"-";
        a = 7+parseInt(rawISBN[0])+parseInt(rawISBN[2])+parseInt(rawISBN[4])+parseInt(rawISBN[6])+parseInt(rawISBN[8]);
        a =a*3;
        b = 9+8+parseInt(rawISBN[1])+parseInt(rawISBN[3])+parseInt(rawISBN[5])+parseInt(rawISBN[7]);
        c = a+b;
        d = c%10;
        checkCode = (10-d)%10;
    }
}

//alert(preCode+rawISBN+checkCode);
    switch(rawISBN[1]){
    case '0':
        ISBNold=preCode+rawISBN[0]+"-"+rawISBN.slice(1,3)+"-"+rawISBN.slice(3,9)+"-"+checkCode;
        break;
    case '1':
    case '2':
    case '3':
        ISBNold=preCode+rawISBN[0]+"-"+rawISBN.slice(1,4)+"-"+rawISBN.slice(4,9)+"-"+checkCode;
        break;
    case '5':
    case '7':
        ISBNold=preCode+rawISBN[0]+"-"+rawISBN.slice(1,5)+"-"+rawISBN.slice(5,9)+"-"+checkCode;
        break;
    case '4':
    case '8':
        ISBNold=preCode+rawISBN[0]+"-"+rawISBN.slice(1,6)+"-"+rawISBN.slice(6,9)+"-"+checkCode;
        break;
    case '6':
        ISBNold=preCode+rawISBN.slice(0,3)+"-"+rawISBN.slice(3,6)+"-"+rawISBN.slice(6,9)+"-"+checkCode;
        break;
    default:
        ISBNold=rawISBN;
        break;
    }
    return ISBNold;
  }

var isbn10=ISBN10(isbn,pubdate);
/////////////////////////////////////////////////////////
var lan="zh";
    GM_setValue("doubanLanguage","zh");
  if(title.charCodeAt(0)<=122&&((isbn&&isbn[3]!=="7")||!isbn)){
        lan="en";
        GM_setValue("doubanLanguage","en");
  }
  return{
    "title": title,
    "author": author,
    "publisher": publisher,
    "pubdate": pubdate,
    "price": price,
    "isbn": isbn,
    "bookIndex": bookIndex,
    "rating": rating,
    "isbn10": isbn10,
    "lan":lan//语言
  };
})();



//各学校元信息
var schoolInfo={
//中山大学
"SYSU":{
    name:"中山大学",
    anySearchUrl:"http://202.116.64.108:8991/F/?func=find-b&find_code=WRD&request=%s",
    anyForeianSearchUrl:"http://202.116.64.108:8991/F/?func=find-b&find_code=WRD&request=%s&local_base=ZSU09",
    isbnSearchUrl:"http://202.116.64.108:8991/F/?func=find-b&find_code=ISB&request=%s",
    isbnForeianSearchUrl:"http://202.116.64.108:8991/F/?func=find-b&find_code=ISB&request=%s&local_base=ZSU09",
    titleSearchUrl:"",
    abbrName:"中大",
    isGBK:false,
    recommendUrl:"http://202.116.64.108:8080/apsm/recommend/recommend.jsp?url_id=http://202.116.64.108:8991/F/"
},

//华南理工大学
"SCUT":{
    name:"华南理工大学",
    anySearchUrl:"http://202.38.232.10/opac/servlet/opac.go?CLANLINK=&CODE=&FIELD1=TITLE&MARCTYPE=&MODE=FRONT&ORGLIB=SCUT&PAGE=&RDID=ANONYMOUS&SCODE=&TABLE=&VAL1=%s&cmdACT=simple.list&libcode=",
    isbnSearchUrl:"http://202.38.232.10/opac/servlet/opac.go?CLANLINK=&CODE=&FIELD1=ISBN&MARCTYPE=&MODE=FRONT&ORGLIB=SCUT&PAGE=&RDID=ANONYMOUS&SCODE=&TABLE=&VAL1=%s&cmdACT=simple.list&libcode=",
    anyForeianSearchUrl:"http://202.38.232.10/opac/servlet/opac.go?CLANLINK=&CODE=&FIELD1=TITLE&MARCTYPE=&MODE=FRONT&ORGLIB=SCUT&PAGE=&RDID=ANONYMOUS&SCODE=&TABLE=&VAL1=%s&cmdACT=simple.list&libcode=",
    isbnForeianSearchUrl:"http://202.38.232.10/opac/servlet/opac.go?CLANLINK=&CODE=&FIELD1=ISBN&MARCTYPE=&MODE=FRONT&ORGLIB=SCUT&PAGE=&RDID=ANONYMOUS&SCODE=&TABLE=&VAL1=%s&cmdACT=simple.list&libcode=",
    abbrName:"华理工",
    isGBK:false,
    recommendUrl:"http://202.38.232.10/opac/servlet/opac.go?cmdACT=recommend.form"

},

//南中国一般大学
"SCNU":{
    name:"华南师范大学",
    abbrName:"华师",
    anySearchUrl:"http://202.116.41.246:8080/opac/openlink.php?sort=M_TITLE&orderby=ASC&title=%s",
    isbnSearchUrl:"http://202.116.41.246:8080/opac/openlink.php?isbn=%s&_m=1",
    isGBK:false
},

//广东工业大学
"GDUT":{
    name:"广东工业大学",
    abbrName:"广工",
    anySearchUrl:"http://222.200.98.171:81/searchresult.aspx?anywords=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL",
    isbnSearchUrl:"http://222.200.98.171:81/searchresult.aspx?isbn_f=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL",
    isGBK:true
},

//外语外贸大学
"GDUFS":{
    name:"广东外语外贸大学",
    abbrName:"广外",
    anySearchUrl:"http://opac.gdufs.edu.cn:8991/F/?find_code=WRD&request=%s&func=find-b",
    anyForeianSearchUrl:"http://opac.gdufs.edu.cn:8991/F/?func=find-b&find_code=WRD&request=%s&local_base=GWD09",
    isbnSearchUrl:"http://opac.gdufs.edu.cn:8991/F/?func=find-b&find_code=ISB&request=%s&local_base=GWD01",
    isbnForeianSearchUrl:"http://opac.gdufs.edu.cn:8991/F/?func=find-b&find_code=ISB&request=%s&local_base=GWD09",
    recommendUrl:"http://opac.gdufs.edu.cn:8118/apsm/recommend/recommend_nobor.jsp",
    isGBK:false

},

//广州中医药大学
"GZHTCM":{
  name:"广州中医药大学",
  abbrName:"广中医",
  anySearchUrl:"http://210.38.102.131:86/opac/openlink.php?sort=M_TITLE&orderby=ASC&title=%s",
  isbnSearchUrl:"http://210.38.102.131:86/opac/openlink.php?strText=%s&strSearchType=isbn",
  isGBK:false
},

//广州大学
"GZHU":{
    name:"广州大学",
    abbrName:"广大",
    anySearchUrl:"http://lib.gzhu.edu.cn:8080/bookle/?id=searchForm&displayPages=15&index=default&matchesPerPage=10&query=%s&searchPage=1&submit=Bookle%20%E6%90%9C%E7%B4%A2",
    isbnSearchUrl:"http://lib.gzhu.edu.cn:8080/bookle/?index=default&query=STANDARDNO%3A%28%s%29",
    isGBK:false
},

//广州美术学院gzarts
"GZARTS":{
    name:"广州美术学院",
    abbrName:"广美",
    anySearchUrl:"http://121.33.246.167/opac/searchresult.aspx?anywords=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL&ecx=0",
    isbnSearchUrl:"http://121.33.246.167/opac/searchresult.aspx?isbn_f=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL&ecx=0",
    //http://121.33.246.167/opac/searchresult.aspx?isbn_f=7-02-000220-X&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL&ecx=0
    isGBK:true
},


//星海音乐学院
"XHCOM":{
    name:"星海音乐学院",
    abbrName:"星海",
    anySearchUrl:"http://218.192.148.33:81/searchresult.aspx?anywords=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL",
    isbnSearchUrl:"http://218.192.148.33:81/searchresult.aspx?isbn_f=%s&dt=ALL&cl=ALL&dp=20&sf=M_PUB_YEAR&ob=DESC&sm=table&dept=ALL",
    isGBK:true
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
    anySearchUrl:"http://opac.nlc.gov.cn/F?func=find-b&find_code=WTP&request=%s&local_base=NLC01&filter_code_1=WLN&filter_request_1=&filter_code_2=WYR&filter_request_2=&filter_code_3=WYR&filter_request_3=&filter_code_4=WFM&filter_request_4=&filter_code_5=WSL&filter_request_5=",
    isbnSearchUrl:"http://opac.nlc.gov.cn/F?find_code=ISB&request=%s&local_base=NLC01&func=find-b",
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


//广东药学院,由于编码问题和没提供ISBN检索，暂不支持//
"GDPU":{
    name:"广东药学院",
    abbrName:"广药"
}

}

function popSetting(){
    var settingDiv = document.createElement("div");
    settingDiv.setAttribute("id","libSetting");
    settingDiv.innerHTML="<h2>图书馆检索设置</h2>"+
    '&nbsp&nbsp'+'学校<select id="setschool" class="barname">'+'<option value="SYSU">中山大学</option><option value="SCUT">华南理工大学</option>'+
    '<option value="SCNU">华南师范大学</option><option value="GDUFS">广东外语外贸大学</option>'+
    '<option value="GDUT">广东工业大学</option><option value="GZHU">广州大学</option>'+
    '<option value="GZHTCM">广州中医药大学</option><option value="GZARTS">广州美术学院</option><option value="XHCOM">星海音乐学院</option></select>'+'&nbsp&nbsp'+
    '学号<input id="setstudentID" class="barname">'+'&nbsp&nbsp&nbsp'+
    '校区<input id="setcampus" class="barname">'+'<br><br>'+
    '手机号<input id="settelephone" class="barname">'+'&nbsp&nbsp'+
    '姓名<input id="setname" class="barname">'+'&nbsp&nbsp'+
    '邮箱<input id="seteMail" class="barname">'+'<br>'+'<br>'+
    '读者ID<input id="setLibID" class="barname">*读者ID为荐购页面登陆时所填写的ID，请自行查阅本馆读者荐购页面'+'<br>'+'<br>'+
    '<a id="setsave" class="setbtn">保存设置并刷新</a><a  id="setclose" class="setbtn">直接关闭</a>'

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
    document.getElementById("setclose").addEventListener("click",function(){settingDiv.parentNode.removeChild(settingDiv)},false);
    
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
                    
                }
                else{

                  isbnFilter.SYSU.filter(reDetails.responseText,frameLocation);

                }
                
                return;
        },


        filter:function(gettxt,frameLocation){

        /////////////////////////////////////////////////////////

        str = gettxt;
        str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
        str = str.replace(/amp;/g,""); //去除URL转码
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

/////////////////回调函数馆藏位置获取////////////////////////////////////////
    getBookinfo:function(webText,eBook,frameLocation,url){
    var hasBook = true;
    webText = webText.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");

    ///防止无书籍的情况发生
    if(webText.indexOf('无匹配单册')!=-1){
        var msg = new LibMeta("SYSU");
        msg.state="recommend";
        messageCatcher(msg,frameLocation);
        return null;
    }
    else{
    blockBook = webText.match(/OPAC注释(.*?)<\/tbody>/)[1];
    borrowItem = blockBook.match(/<tr>.*?<\/tr>/g);
    var loan = new Array();

      for(k=0;k<borrowItem.length;k++){
      loan[k] = borrowItem[k].match(/<!--Loan.*?td1">(.*?)<\/td>.*?date.*?td1">(.*?)<\/td>.*?hour.*?td1>(.*?)<\/td>.*?Sub.*?nowrap="">(.*?)<\/td>.*?Collection.*?nowrap="">(.*?)<\/td>.*?td1">(.*?)<\/td>/);
    /////借书类型/时间/到期/分馆/馆藏地/索书号
      }
    }
    /////////////////

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
    },
    //华南理工大学
    SCUT:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("SCUT");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");//后续版本再处理
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('无符合')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
            var msg = new LibMeta("SCUT");
            msg.state="recommend";
            messageCatcher(msg,frameLocation);
            return;
          }
          isbnFilter.SCUT.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");
        rowText = text.match(/javascript:book_detail.*?<\/tr>/g);

        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/\((\d+\.?\d*)\)">(.*?)<\/a>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>/);
          bookBlock[s].shift();

        }

        var list = new LibMeta("SCUT");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("SCUT");
           list.items[s].link ="http://202.38.232.10/opac/servlet/opac.go?SORTFIELD=CALLNO&SORTORDER=asc&bookid="+bookBlock[s][0]+"&cmdACT=query.bookdetail&libcode=";
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].bookIndex = bookBlock[s][6];
           list.items[s].pubDate = bookBlock[s][5];
        }

        //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("SCUT");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                messageCatcher(msg,frameLocation);
                return;
              }
                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });



        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");
          text=text.match(/id="queryholding".*?<\/table>/);
          var row;
          row=text[0].match(/<tr>.*?<\/tr>/g);
          row.shift();
          var storeBlock = new Array();
          for(s=0;s<row.length;s++){
          storeBlock[s] = row[s].match(/"8%">(.*?)<\/td>.*?F">(.*?)<\/td.*?8%">(.*?)<\/td>.*?4%">(.*?)<\/td>.*?8%">(.*?)<\/td>.*?8%">(.*?)<\/td>.*?0%">(.*?)<\/td>/);
          storeBlock[s].shift();
        }
          var storeList = new LibMeta("SCUT");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("SCUT");
            storeList.items[s].storeState=storeBlock[s][5].replace(/ /g,"");
            storeList.items[s].returnTime=storeBlock[s][6];
            storeList.items[s].branch=storeBlock[s][0];
            storeList.items[s].location = storeBlock[s][1];
            storeList.items[s].bookIndex = storeBlock[s][2];
            storeList.items[s].link = finalUrl;
            if(storeList.items[s].storeState.indexOf('在馆')!=-1&&storeList.items[s].branch.indexOf('停')==-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;

        }

      }
    },

    //南中国一般大学
    SCNU:{      
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("SCNU");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){
            var msg = new LibMeta("SCNU");
            msg.state="recommend";
 
            messageCatcher(msg,frameLocation);
            return;
          }

          isbnFilter.SCNU.filter(reDetails.responseText,frameLocation);

      },

      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/ /g,"").replace(/\r/g,"");
        rowText = text.match(/book_list_info.*?<img/);
        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/marc_no=(\d+\.?\d*)">(.*?)<\/a>(.*?)<\/h3>.*?span>(.*?)<br>(.*?)<\/span>(.*?)<br\/>(.*?)<br\/>/);
          bookBlock[s].shift();
        }

        var list = new LibMeta("SCNU");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("SCNU");
           list.items[s].link ="http://202.116.41.246:8080/opac/item.php?marc_no="+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][5];
           list.items[s].publisher = bookBlock[s][6];
           list.items[s].bookIndex = bookBlock[s][2];
        }

        //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("SCNU");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                messageCatcher(msg,frameLocation);
                return;
              }
                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });



        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
          var row;
          row=text.match(/whitetext.*?left/g);
          var storeBlock = new Array();
          for(s=0;s<row.length;s++){
            storeBlock[s] = row[s].match(/"10%">(.*?)<\/td>.*?title="(.*?)">.*?20%">(.*?)<\/td>/);
            storeBlock[s].shift();
        }

          var storeList = new LibMeta("SCNU");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("SCNU");
            storeList.items[s].storeState=storeBlock[s][2].replace(/ /g,"");
            storeList.items[s].branch=storeBlock[s][1];
            storeList.items[s].bookIndex = storeBlock[s][0];
            storeList.items[s].link = finalUrl;
            if(storeList.items[s].storeState.indexOf('可借')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;

        }

      }
    },

    //广东工业大学
    GDUT:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GDUT");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){
            var msg = new LibMeta("GDUT");
            msg.state="recommend";

            messageCatcher(msg,frameLocation);
            return;
          }

          isbnFilter.GDUT.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        rowText = text.match(/class="tb".*?<\/table>/);
        var bookBlock = new Array();

        bookBlock[0]=rowText[0].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);

        bookBlock[0].shift();
        var list = new LibMeta("GDUT");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("GDUT");
           list.items[s].link ="http://222.200.98.171:81/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
       }
                //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GDUT");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                messageCatcher(msg,frameLocation);
                return;
              }

                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });

        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
          var row;
          row=text.match(/<tbody>.*?<\/tbody>/);
          row[0].replace(/ /g,"");
          row = row[0].match(/<tr>.*?<\/tr>/g);

          var storeBlock = new Array();
          for(s=0;s<row.length;s++){

            storeBlock[s] = row[s].match(/showLibInfo.*?'>(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td>.*?tbr.*?<td>.*?<td>(.*?)<\/td>/);
            storeBlock[s].shift();
        }

          var storeList = new LibMeta("GDUT");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("GDUT");
            storeList.items[s].storeState=storeBlock[s][3];
            storeList.items[s].branch=storeBlock[s][0];
            storeList.items[s].bookIndex = storeBlock[s][1];
            storeList.items[s].link = finalUrl;
            if(storeList.items[s].storeState.indexOf('可供出借')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;

        }

      }
    },

    //外语外贸大学
    GDUFS:{
        respond:function (reDetails,frameLocation,fullUrl) {
              //var fullUrl = reDetails.finalUrl;
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GDUFS");
                msg.state="error";
                msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }
              //document.getElementById("footer").textContent=reDetails.responseText;
              if(reDetails.responseText.indexOf('indexpage')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
                  var msg = new LibMeta("GDUFS");
                  msg.state="recommend";
                  //hasBook = false;
                  //recommendBook();
                  messageCatcher(msg,frameLocation);
                  return;
              }

                if(reDetails.responseText.indexOf('Search Results')!=-1){
                    titleFilter.GDUFS.filter(reDetails.responseText,fullUrl,frameLocation);
                }
                else{
                  isbnFilter.GDUFS.filter(reDetails.responseText,frameLocation);
                }
                
                return;
        },

        filter:function(gettxt,frameLocation){

        /////////////////////////////////////////////////////////

        str = gettxt;
        str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
        str = str.replace(/amp;/g,""); //去除URL转码

        ///获取一整块
        var eBook;
        eBook = null;
        if(str.match(/电子资源定位/)){
        eBook = str.match(/电子资源定位.*?jpg.*?File Extension: url">(.*?)<\/a>/)[1];
        }
        if(!eBook&&str.indexOf("索书")==-1){
            var msg = new LibMeta("GDUFS");
            msg.state="recommend";
            messageCatcher(msg,frameLocation);
            return;
        }
        str = str.match(/全部馆藏(.*?)所有单册/g)
        var txt = str[0];
        txt = txt.match(/http:.*?sub_library=/);
        where=txt;

            GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : where[0],
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GDUFS");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }
                var libra =document.createElement("div");
                libra.innerHTML = reDetails.responseText;
                isbnFilter.GDUFS.getBookinfo(libra.innerHTML,eBook,frameLocation,where[0]);//回调函数馆藏位置获取
            }
        });
      },

      /////////////////回调函数馆藏位置获取////////////////////////////////////////
    getBookinfo:function(webText,eBook,frameLocation,finalUrl){
    var hasBook = true;
    webText = webText.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");

    ///防止无书籍的情况发生
    if(webText.indexOf('无匹配单册')!=-1){
        var msg = new LibMeta("GDUFS");
        msg.state="recommend";
        messageCatcher(msg,frameLocation);
    }
    else{
    blockBook = webText.match(/OPAC注释(.*?)<\/tbody>/)[1];
    //alert(typeof blockBook);
    borrowItem = blockBook.match(/<tr>.*?<\/tr>/g);
    //alert(borrowItem[0]);
    var loan = new Array();

      for(k=0;k<borrowItem.length;k++){
      loan[k] = borrowItem[k].match(/<!--Loan.*?td1">(.*?)<\/td>.*?date.*?td1">(.*?)<\/td>.*?hour.*?td1>(.*?)<\/td>.*?Sub.*?nowrap="">(.*?)<\/td>.*?Location.*?td1">(.*?)<\/td>/);
    /////借书类型/时间/到期/位置/索书号
      }
    }
    /////////////////


      if(hasBook){
        //alert("hasBook");
        var storeList = new LibMeta("GDUFS");
        storeList.state="store";
        storeList.items= new Array();


        for(s=0;s<borrowItem.length;s++){

           storeList.items[s]=new StoreItem("GDUFS");
           storeList.items[s].storeState=loan[s][1];
           storeList.items[s].returnTime=loan[s][2].replace(/<br>/,"");
           storeList.items[s].branch=loan[s][4];
           storeList.items[s].bookIndex=loan[s][5];
           storeList.items[s].link=finalUrl;
           if(storeList.items[s].storeState.indexOf('外借')!=-1&&storeList.items[s].returnTime.indexOf('在架上')!=-1&&storeList.items[s].storeState.indexOf('闭架')==-1){//闭架无法预约
                storeList.items[s].rentable=true;
           } 
        }
 
        if(eBook){

          var itemsLength=storeList.items.length;
          storeList.items[itemsLength]=new StoreItem("GDUFS");         
          storeList.items[itemsLength].link=eBook;
          storeList.items[itemsLength].type="eBook";
          storeList.items[itemsLength].storeState="电子书";
        };
      } 
      messageCatcher(storeList,frameLocation);

    //////////////////////完成框架插入//////////////
          }
    },

    //广州中医药大学
    GZHTCM:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GZHTCM");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){
            var msg = new LibMeta("GZHTCM");
            msg.state="recommend";

            messageCatcher(msg,frameLocation);
            return;
          }
          isbnFilter.GZHTCM.filter(reDetails.responseText,frameLocation);

      },

      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/ /g,"").replace(/\r/g,"");
        rowText = text.match(/book_list_info.*?<img/);
        //document.getElementById("reviews").textContent=rowText;        

        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/marc_no=(\d+\.?\d*)">(.*?)<\/a>(.*?)<\/h3>.*?span>(.*?)<br>(.*?)<\/span>(.*?)<br\/>(.*?)<br\/>/);
          bookBlock[s].shift();
        }

        var list = new LibMeta("GZHTCM");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("GZHTCM");
           list.items[s].link ="http://210.38.102.131:86/opac/item.php?marc_no="+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][5];
           list.items[s].publisher = bookBlock[s][6];
           list.items[s].bookIndex = bookBlock[s][2];
        }

        //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GZHTCM");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }
                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });



        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
          var row;
          row=text.match(/whitetext.*?left/g);
          var storeBlock = new Array();
          for(s=0;s<row.length;s++){
            storeBlock[s] = row[s].match(/"10%">(.*?)<\/td>.*?gif"\/>(.*?)<\/td>.*?20%">(.*?)<\/td>/);
            storeBlock[s].shift();
        }

          var storeList = new LibMeta("GZHTCM");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("GZHTCM");
            storeList.items[s].storeState=storeBlock[s][2].replace(/ /g,"");
            storeList.items[s].branch=storeBlock[s][1];
            storeList.items[s].bookIndex = storeBlock[s][0];
            storeList.items[s].link = finalUrl;
            if(storeList.items[s].storeState.indexOf('可借')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;

        }

      }

    },

    //广州大学
    GZHU:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GZHU");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");//后续版本再处理
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('找不到')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
            var msg = new LibMeta("GZHU");
            msg.state="recommend";

            messageCatcher(msg,frameLocation);
            return;
          }

          isbnFilter.GZHU.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/ /g,"").replace(/\r/g,"");
        rowText = text.match(/book_info>.*?<\/div>/g);

        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/href="(.*?)"target="_blank">(.*?)<\/a><span>(.*?)<\/span>.*?<h4>(.*?)&nbsp;/);
          bookBlock[s].shift();
        }

        var list = new LibMeta("GZHU");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("GZHU");
           list.items[s].link ="http://lib.gzhu.edu.cn:8080"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
        }


        //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,
            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GZHU");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }

                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });

        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
          var row;
          var bookIndex = text.match(/索书号.*?<td>(.*?)<\/td>/)[1];
          
          text=text.match(/holdings_info_content.*?clear/);

          row = text[0].match(/<td>.*?<\/tr>/g);


          var storeBlock= new Array();
          for(s=0;s<row.length;s++){

            storeBlock[s] = row[s].match(/<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<a.*?<\/tr>/);
            storeBlock[s].shift();
        }

          var storeList = new LibMeta("GZHU");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("GZHU");
            storeList.items[s].storeState=storeBlock[s][1];
            storeList.items[s].returnTime=storeBlock[s][3];
            storeList.items[s].branch=storeBlock[s][4];
            storeList.items[s].link=finalUrl;
            storeList.items[s].bookIndex=bookIndex;
            if(storeList.items[s].storeState.indexOf('在馆')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;

        }



      }
    },

    //广州美术学院
    GZARTS:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GZARTS");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
            var msg = new LibMeta("GZARTS");
            msg.state="recommend";

            messageCatcher(msg,frameLocation);
            return;
          }


          isbnFilter.GZARTS.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        rowText = text.match(/class="tb".*?<\/table>/);

        var bookBlock = new Array();

        bookBlock[0]=rowText[0].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);
        //alert(bookBlock[0].length);

        bookBlock[0].shift();
        var list = new LibMeta("GZARTS");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("GZARTS");
           list.items[s].link ="http://121.33.246.167/opac/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
       }

                //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,

            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GZARTS");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }

                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });

        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");

          var row;
          row=text.match(/<tbody>.*?<\/tbody>/);
          row[0].replace(/ /g,"");

          row = row[0].match(/<tr>.*?<\/tr>/g);

          var storeBlock = new Array();
          for(s=0;s<row.length;s++){

            storeBlock[s] = row[s].match(/showLibInfo.*?'>(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td>.*?tbr.*?<td>.*?<td>(.*?)<\/td>/);

            storeBlock[s].shift();
        }
          var storeList = new LibMeta("GZARTS");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("GZARTS");
            storeList.items[s].storeState=storeBlock[s][3];
            //storeList.items[s].returnTime=storeBlock[s][2];
            storeList.items[s].branch=storeBlock[s][0];
            //storeList.items[s].location = storeBlock[s][1];
            storeList.items[s].bookIndex = storeBlock[s][1];
            storeList.items[s].link=finalUrl;
            if(storeList.items[s].storeState.indexOf('可供出借')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;
        }

      }
    },


    //星海音乐学院
    XHCOM:{      
        respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("XHCOM");
          msg.state="error";
          msg.errorMsg="ISBN连接错误";
                //alert("ISBN连接错误");
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){

            var msg = new LibMeta("XHCOM");
            msg.state="recommend";

            messageCatcher(msg,frameLocation);
            return;
          }

          isbnFilter.XHCOM.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        rowText = text.match(/class="tb".*?<\/table>/);
      

        var bookBlock = new Array();
        bookBlock[0]=rowText[0].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);
        //alert(bookBlock[0].length);

        bookBlock[0].shift();
        var list = new LibMeta("XHCOM");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("XHCOM");
           list.items[s].link ="http://218.192.148.33:81/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
       }



                //进一步获取馆藏
        GM_xmlhttpRequest({ //获取列表
            method : 'GET',
           synchronous : false,
            url : list.items[0].link,

            onload : function (reDetails) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("XHCOM");
                msg.state="error";
                msg.errorMsg="无法获取馆藏列表";
                //alert("ISBN连接错误");//后续版本再处理
                messageCatcher(msg,frameLocation);
                return;
              }
                getStoreFilter(reDetails.responseText,frameLocation,list.items[0].link);//回调函数馆藏位置获取
            }
        });

        function  getStoreFilter(text,frameLocation,finalUrl){
          text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");

          var row;
          row=text.match(/<tbody>.*?<\/tbody>/);
          row[0].replace(/ /g,"");
          //alert(row[0]);
          row = row[0].match(/<tr>.*?<\/tr>/g);

          var storeBlock = new Array();
          for(s=0;s<row.length;s++){

            storeBlock[s] = row[s].match(/showLibInfo.*?'>(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td>.*?tbr.*?<td>.*?<td>(.*?)<\/td>/);
            storeBlock[s].shift();
        }
          var storeList = new LibMeta("XHCOM");
          storeList.state="store";
          storeList.items= new Array();

          for(s=0;s<storeBlock.length;s++){
            storeList.items[s]=new StoreItem("XHCOM");
            storeList.items[s].storeState=storeBlock[s][3];
            //storeList.items[s].returnTime=storeBlock[s][2];
            storeList.items[s].branch=storeBlock[s][0];
            //storeList.items[s].location = storeBlock[s][1];
            storeList.items[s].bookIndex = storeBlock[s][1];
            storeList.items[s].link=finalUrl;
            if(storeList.items[s].storeState.indexOf('可供出借')!=-1){
                storeList.items[s].rentable=true;
            }
          }
           messageCatcher(storeList,frameLocation);
           return;
        }

      }
  },

    //广东药学院,由于编码问题和没提供ISBN检索，暂不支持//

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
                }
                else if(reDetails.responseText.indexOf('记录数')!=-1||reDetails.responseText.indexOf('轮排')!=-1){
                    var msg = new LibMeta("SYSU");
                    msg.state = "error";
                    msg.errorMsg = "搜索页面跳转到了款目/轮排列表页面，<br>此页面无法获取图书详细信息。";

                    messageCatcher(msg,frameLocation);
                    return;
                }
                else{                    
                     isbnFilter.SYSU.filter(reDetails.responseText,frameLocation);
                     return;

                  //
                }
      },

      filter:function (txt,urltext,frameLocation){

    str = txt;
    str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
    str = str.replace(/amp;/g,""); //去除URL转码
    atxt= str.match(/col2>.*?<\/table>/g);

    ///////获取图书馆书本元信息//////
    var bookDetail = new Array();//元信息数组
    atxt.shift();//去除整块信息中的多余信息

    for(s=0;s<atxt.length;s++){

          bookDetail[s] = atxt[s].match(/a href=(.*?)>(.*?)<\/a>.*?top>(.*?)<td.*?top>(.*?)<tr>.*?top>(.*?)<td.*?top>(.*?)<tr>/).slice(1);
          // 超链接/ 书名 /作者 / 索引号/出版社 /年份 /
    }

      ////////框架//////////////////////////////////

       //判断URL类型
       if(urltext.indexOf('ISB')!=-1){
        var allBook = '<div class="gray_ad" id="sysulib"><h2>中大ISBN检索</h2>' +
                       '<a href="'+ urltext +'" target="_blank">前往图书馆查看这本书</a>'; 
       }
       else{
        var allBook = '<div class="gray_ad" id="sysulib"><h2>中大图书馆检索</h2>' +
                       '<a href="'+ urltext +'" target="_blank">前往图书馆查看这本书</a>';         
       }

        var display;
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
  
      ///////////////判断URL

      //} 
      ////////////插入框架结束//////////////
    }

    },
    //华南理工大学
    SCUT:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("SCUT");
          msg.state="error";
          msg.errorMsg="全字段连接错误";
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('无符合')!=-1){

            var msg = new LibMeta("SCUT");
            msg.state="error";
          msg.errorMsg="全字段查无此书";

            messageCatcher(msg,frameLocation);
            return;
          }

          titleFilter.SCUT.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){

        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"");
        rowText = text.match(/javascript:book_detail.*?<\/tr>/g);
        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/\((\d+\.?\d*)\)">(.*?)<\/a>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>.*?F">(.*?)<\/TD>/);

          bookBlock[s].shift();

        }

        var list = new LibMeta("SCUT");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("SCUT");
           list.items[s].link ="http://202.38.232.10/opac/servlet/opac.go?SORTFIELD=CALLNO&SORTORDER=asc&bookid="+bookBlock[s][0]+"&cmdACT=query.bookdetail&libcode=";
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].bookIndex = bookBlock[s][6];
           list.items[s].pubDate = bookBlock[s][5];
        }

        messageCatcher(list,frameLocation);
        return;

      }
    },

    //南中国一般大学
    SCNU:{
        respond: function (reDetails, frameLocation) {
          if (reDetails.status !== 200 && reDetails.status !== 304) {
          var msg = new LibMeta('SCNU');
          msg.state = 'error';
          msg.errorMsg = '全字段检索连接错误';
          messageCatcher(msg, frameLocation);
          return;
        }

        if (reDetails.responseText.indexOf('没有') != - 1) {
    //alert("ISBN查无此书"); //增加荐购
        var msg = new LibMeta('SCNU');
        msg.state = 'error';
        msg.errorMsg = '全字段查无此书';
    
        messageCatcher(msg, frameLocation);
        return;
  }


  titleFilter.SCNU.filter(reDetails.responseText, frameLocation);
},
filter: function (text, frameLocation) {
  text = text.replace(/[ | ]*\n/g, '').replace(/\n[\s| | ]*\r/g, '').replace(/amp;/g, '').replace(/ /g, '').replace(/\r/g, '');
  rowText = text.match(/book_list_info.*?<img/g);
      
  var bookBlock = new Array();
  var bookDetail = new Array();
  for (s = 0; s < rowText.length; s++) {
    bookBlock[s] = rowText[s].match(/marc_no=(\d+\.?\d*)">(.*?)<\/a>(.*?)<\/h3>.*?span>(.*?)<br>(.*?)<\/span>(.*?)<br\/>(.*?)<br\/>/);
    bookBlock[s].shift();
  }
  var list = new LibMeta('SCNU'); ////构造函数
  list.state = 'booklist';
  list.items = new Array();
  for (s = 0; s < rowText.length; s++) {
    list.items[s] = new LibItem('SCNU');
    list.items[s].link = 'http://202.116.41.246:8080/opac/item.php?marc_no=' + bookBlock[s][0];
    list.items[s].bookName = bookBlock[s][1];
    list.items[s].author = bookBlock[s][5];
    list.items[s].publisher = bookBlock[s][6];
    list.items[s].bookIndex = bookBlock[s][2];

  }
   messageCatcher(list,frameLocation);
   return;

}

    },

    //广东工业大学
    GDUT:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GDUT");
          msg.state="error";
          msg.errorMsg="全字段连接错误";
          messageCatcher(msg,frameLocation);
          return;
          }

          if(reDetails.responseText.indexOf('没有')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
            var msg = new LibMeta("GDUT");
          msg.state="error";
          msg.errorMsg="全字段查无此书";
            messageCatcher(msg,frameLocation);
            return;
          }

          //document.getElementById("reviews").textContent=reDetails.responseText;
          titleFilter.GDUT.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        rowText = text.match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/g);
        var bookBlock = new Array();

        for(s=0;s<rowText.length;s++){
            bookBlock[s]=rowText[s].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);
            bookBlock[s].shift();
        }


        bookBlock[0].shift();
        var list = new LibMeta("GDUT");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<bookBlock.length;s++){
           list.items[s] = new LibItem("GDUT");
           list.items[s].link ="http://222.200.98.171:81/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
        }
        messageCatcher(list,frameLocation);

      }     
    },

    //外语外贸大学
    GDUFS:{
     respond:function(reDetails,frameLocation,fullUrl) {
              if (reDetails.status !== 200&&reDetails.status !== 304){
                var msg = new LibMeta("GDUFS");

                msg.state = "error";
                msg.errorMsg = "搜索连接错误";
                messageCatcher(msg,frameLocation);
                return;
              }


                if(reDetails.responseText.indexOf('Search Results')!=-1){
                    titleFilter.GDUFS.filter(reDetails.responseText,fullUrl,frameLocation);
                    return;
                }
                else if(reDetails.responseText.indexOf('记录数')!=-1||reDetails.responseText.indexOf('轮排')!=-1){
                    var msg = new LibMeta("GDUFS");
                    msg.state = "error";
                    msg.errorMsg = "搜索页面跳转到了款目/轮排列表页面，<br>此页面无法获取图书详细信息。";

                    messageCatcher(msg,frameLocation);
                    return;
                }
                else{                    
                     isbnFilter.GDUFS.filter(reDetails.responseText,frameLocation);
                     return;

                  //
                }
      },

      filter:function (txt,urltext,frameLocation){

    str = txt;
    str = str.replace(/[ | ]*\n/g,''); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,''); //去除多余空行
    str = str.replace(/amp;/g,""); //去除URL转码

    atxt= str.match(/col2>.*?<\/table>/g);

    ///////获取图书馆书本元信息//////
    var bookDetail = new Array();//元信息数组
    atxt.shift();//去除整块信息中的多余信息

    for(s=0;s<atxt.length;s++){

          bookDetail[s] = atxt[s].match(/a href=(.*?)>(.*?)<\/a>.*?top>(.*?)<td.*?top>(.*?)<tr>.*?top>(.*?)<td.*?top>(.*?)<tr>/).slice(1);
          // 超链接/ 书名 /作者 / 索引号/出版社 /年份 /
    }

      ////////框架//////////////////////////////////


        var display;
       
        var list = new LibMeta("GDUFS");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<bookDetail.length;s++){
            if(s>4){
              display=" ;display : none";
            }
            else{
              display="";
            }
           list.items[s] = new LibItem("GDUFS");
           list.items[s].link = bookDetail[s][0];
           list.items[s].bookName = bookDetail[s][1];
           list.items[s].author = bookDetail[s][2].replace(/<br>/,"").replace(/<br\/>/,"");
           list.items[s].publisher = bookDetail[s][4];
           list.items[s].pubDate = bookDetail[s][5];

        }

        messageCatcher(list,frameLocation);
        //判断URL
  
      ///////////////判断URL

      //} 
      ////////////插入框架结束//////////////
    }

    },

    //广州中医药大学
    GZHTCM:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GZHTCM");
          msg.state="error";
          msg.errorMsg="全字段连接错误";
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){
                  //alert("ISBN查无此书"); //增加荐购
            var msg = new LibMeta("GZHTCM");
          msg.state="error";
          msg.errorMsg="全字段查无此书";
            messageCatcher(msg,frameLocation);
            return;
          }

          titleFilter.GZHTCM.filter(reDetails.responseText,frameLocation);

      },

      filter:function(text,frameLocation){

        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/ /g,"").replace(/\r/g,"");
        rowText = text.match(/book_list_info.*?<img/g);
        var bookBlock = new Array();
        var bookDetail = new Array();
        for(s=0;s<rowText.length;s++){
          bookBlock[s] = rowText[s].match(/marc_no=(\d+\.?\d*)">(.*?)<\/a>(.*?)<\/h3>.*?span>(.*?)<br>(.*?)<\/span>(.*?)<br\/>(.*?)<br\/>/);
          bookBlock[s].shift();
        }



        var list = new LibMeta("GZHTCM");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<rowText.length;s++){
           list.items[s] = new LibItem("GZHTCM");
           list.items[s].link ="http://210.38.102.131:86/opac/item.php?marc_no="+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][5];
           list.items[s].publisher = bookBlock[s][6];
           list.items[s].bookIndex = bookBlock[s][2];
        }
        messageCatcher(list,frameLocation);

      }
    },

    //广州大学
    GZHU:{
respond: function (reDetails, frameLocation) {
  if (reDetails.status !== 200 && reDetails.status !== 304) {
    var msg = new LibMeta('GZHU');
    msg.state = 'error';
    msg.errorMsg = '全字段连接错误';
    messageCatcher(msg, frameLocation);
    return;
  }

  if (reDetails.responseText.indexOf('找不到') != - 1) {
    var msg = new LibMeta('GZHU');
    msg.state = 'error';
    msg.errorMsg = '全字段查无此书';

    messageCatcher(msg, frameLocation);
    return;
  }


  titleFilter.GZHU.filter(reDetails.responseText, frameLocation);
},
filter: function (text, frameLocation) {
  text = text.replace(/[ | ]*\n/g, '').replace(/\n[\s| | ]*\r/g, '').replace(/amp;/g, '').replace(/ /g, '').replace(/\r/g, '');
  rowText = text.match(/book_info>.*?<\/div>/g);
  var bookBlock = new Array();
  var bookDetail = new Array();
  for (s = 0; s < rowText.length; s++) {
    bookBlock[s] = rowText[s].match(/href="(.*?)"target="_blank">(.*?)<\/a><span>(.*?)<\/span>.*?<h4>(.*?)&nbsp;/);
    bookBlock[s].shift();
  }
  var list = new LibMeta('GZHU'); ////构造函数
  list.state = 'booklist';
  list.items = new Array();
  for (s = 0; s < rowText.length; s++) {
    list.items[s] = new LibItem('GZHU');
    list.items[s].link = 'http://lib.gzhu.edu.cn:8080' + bookBlock[s][0];
    list.items[s].bookName = bookBlock[s][1];
    list.items[s].author = bookBlock[s][2];
    list.items[s].publisher = bookBlock[s][3];

  }
  messageCatcher(list,frameLocation);

    return;
  }

    },

    //广州美术学院
    GZARTS:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("GZARTS");
          msg.state="error";
          msg.errorMsg="全字段连接错误";
                //alert("ISBN连接错误");
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){

            var msg = new LibMeta("GZARTS");
          msg.state="error";
          msg.errorMsg="全字段查无此书";

            messageCatcher(msg,frameLocation);
            return;
          }
          titleFilter.GZARTS.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        rowText = text.match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/g);
        var bookBlock = new Array();
        for(s=0;s<rowText.length;s++){
            bookBlock[s]=rowText[s].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);
            bookBlock[s].shift();
        }

        bookBlock[0].shift();
        var list = new LibMeta("GZARTS");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<bookBlock.length;s++){
           list.items[s] = new LibItem("GZARTS");
           list.items[s].link ="http://121.33.246.167/opac/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
        }
        messageCatcher(list,frameLocation);

      }
    },


    //星海音乐学院
    XHCOM:{
      respond:function (reDetails,frameLocation) {
        if (reDetails.status !== 200&&reDetails.status !== 304){
          var msg = new LibMeta("XHCOM");
          msg.state="error";
          msg.errorMsg="全字段连接错误";
                //alert("ISBN连接错误");
          messageCatcher(msg,frameLocation);
          return;
          }
          if(reDetails.responseText.indexOf('没有')!=-1){

            var msg = new LibMeta("XHCOM");
          msg.state="error";
          msg.errorMsg="全字段查无此书";

            messageCatcher(msg,frameLocation);
            return;
          }

          titleFilter.XHCOM.filter(reDetails.responseText,frameLocation);

      },
      filter:function(text,frameLocation){
        text = text.replace(/[ | ]*\n/g,'').replace(/\n[\s| | ]*\r/g,'').replace(/amp;/g,"").replace(/\r/g,"").replace(/ /g,"");
        var rowText=text.match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/g)     

        var bookBlock = new Array();

        for(s=0;s<rowText.length;s++){
            bookBlock[s]=rowText[s].match(/(bookinfo.aspx\?ctrlno=\d+\.?\d*)".*?blank">(.*?)<\/a>.*?<td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/);
            bookBlock[s].shift();
        }

        var list = new LibMeta("XHCOM");////构造函数
        list.state="booklist";
        list.items= new Array();
        for(s=0;s<bookBlock.length;s++){
           list.items[s] = new LibItem("XHCOM");
           list.items[s].link ="http://121.33.246.167/opac/"+bookBlock[s][0];
           list.items[s].bookName = bookBlock[s][1];
           list.items[s].author = bookBlock[s][2];
           list.items[s].publisher = bookBlock[s][3];
           list.items[s].pubDate = bookBlock[s][4];
        }
        messageCatcher(list,frameLocation);

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
            getInfo = rowText[s].match(/获得途径：<\/span>(.*?)<\/li>/);
            if(getInfo){
                getInfo[1] = getInfo[1].replace(/href="/g,'href="http://ss.zhizhen.com').replace(/href=\//g,'href=http://ss.zhizhen.com/');
                bookBlock[s][4] = getInfo[1];
                //
            }
            else{
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
        var fullText;
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
    },

    //广东药学院,由于编码问题和没提供ISBN检索，暂不支持//
    GDPU:{
        respond:function (reDetails,frameLocation) {
        },
        filter:function(text,frameLocation){            
        }
    }
}


//////////////////图书馆荐购页面Main//////////////////////////////////////

libRecommend = {
  SYSU: function () {
    if (document.getElementsByName("Z13_TITLE")&&GM_getValue('doubanTitle')) {

      document.getElementsByName("Z13_TITLE")[0].value=GM_getValue('doubanTitle', 'bookMeta.title');
      document.getElementsByName("Z13_AUTHOR")[0].value=GM_getValue('doubanAuthor', 'bookMeta.author');
      document.getElementsByName("Z13_IMPRINT")[0].value=GM_getValue('doubanPublisher', 'bookMeta.publisher');
      document.getElementsByName("Z13_YEAR")[0].value=GM_getValue('doubanPubdate', 'bookMeta.pubdate');
      document.getElementsByName("Z13_ISBN_ISSN")[0].value=GM_getValue('doubanIsbn', 'bookMeta.isbn');
      document.getElementsByName("Z13_PRICE")[0].value=GM_getValue('doubanPrice', 'bookMeta.price');
      document.getElementsByName("Z68_NO_UNITS")[0].value=2;
      document.getElementsByName("Z303_REC_KEY")[0].value=prefs.libraryId;
      document.getElementsByName("Z46_REQUEST_PAGES")[0].value='豆瓣读书得分: ' + GM_getValue('doubanRating', 'bookMeta.rating');
      if(GM_getValue('doubanLanguage','zh')=="en") document.getElementsByName("LIBRARY")[0].value="02";//语言为外语时
      
      GM_deleteValue('doubanTitle');
      GM_deleteValue('doubanAuthor');
      GM_deleteValue('doubanPublisher');
      GM_deleteValue('doubanPubdate');
      GM_deleteValue('doubanIsbn');
      GM_deleteValue('doubanPrice');
      GM_deleteValue('doubanRating');
    }
  },
  SCUT: function () {
    var pubDate = document.getElementById('b_date');
    if (!pubDate) {
      return null;
    }
    var publisher = document.getElementById('b_pub');
    var author = document.getElementsByName('F210$c') [0];
    var title = document.getElementsByName('F200$a') [0];
    var ISBN = document.getElementsByName('F010$a') [0];
    var recommendText = document.getElementsByName('F330$a') [0];
    title.value = GM_getValue('doubanTitle', 'bookMeta.title');
    author.value = GM_getValue('doubanAuthor', 'bookMeta.author');
    publisher.value = GM_getValue('doubanPublisher', 'bookMeta.publisher');
    pubDate.value = GM_getValue('doubanPubdate', 'bookMeta.pubdate');
    ISBN.value = GM_getValue('doubanIsbn', 'bookMeta.isbn');
    recommendText.value = '豆瓣读书得分: ' + GM_getValue('doubanRating', 'bookMeta.rating');
    GM_deleteValue('doubanTitle');
    GM_deleteValue('doubanAuthor');
    GM_deleteValue('doubanPublisher');
    GM_deleteValue('doubanPubdate');
    GM_deleteValue('doubanIsbn');
    GM_deleteValue('doubanPrice');
    GM_deleteValue('doubanRating');
  },
  GDUFS: function () {
    if (document.getElementsByName("Z13_TITLE")&&GM_getValue('doubanTitle')) {

      document.getElementsByName("Z13_TITLE")[0].value=GM_getValue('doubanTitle', 'bookMeta.title');
      document.getElementsByName("Z13_AUTHOR")[0].value=GM_getValue('doubanAuthor', 'bookMeta.author');
      document.getElementsByName("Z13_IMPRINT")[0].value=GM_getValue('doubanPublisher', 'bookMeta.publisher');
      document.getElementsByName("Z13_YEAR")[0].value=GM_getValue('doubanPubdate', 'bookMeta.pubdate');
      document.getElementsByName("Z13_ISBN_ISSN")[0].value=GM_getValue('doubanIsbn', 'bookMeta.isbn');
      document.getElementsByName("Z13_PRICE")[0].value=GM_getValue('doubanPrice', 'bookMeta.price');
      document.getElementsByName("Z68_NO_UNITS")[0].value=2;
      document.getElementsByName("Z303_REC_KEY")[0].value=prefs.libraryId;
      document.getElementsByName("Z46_REQUEST_PAGES")[0].value='豆瓣读书得分: ' + GM_getValue('doubanRating', 'bookMeta.rating');
      if(GM_getValue('doubanLanguage','zh')=="en") document.getElementsByName("LIBRARY")[0].value="02";//语言为外语时
      GM_deleteValue('doubanTitle');
      GM_deleteValue('doubanAuthor');
      GM_deleteValue('doubanPublisher');
      GM_deleteValue('doubanPubdate');
      GM_deleteValue('doubanIsbn');
      GM_deleteValue('doubanPrice');
      GM_deleteValue('doubanRating');
      GM_deleteValue('doubanLanguage');
    }
  }
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
    if(bookMeta.lan=="en")  otherTabName="EBSCO";
    frame.innerHTML='<ul class="tabmenu">'+
        '<li id="clickTitle" class="blue"><a>'+schoolInfo[prefs.school].abbrName+'</a></li>'+
        '<li id="clickOtherTitle"><a>'+otherTabName+'</a></li>'+
        '<li id="clickJaysonTitle"><a>'+'谷歌聚合搜索'+'</a></li>'+
        '</ul>'+
        '<div id="libTitle" class="tab_content libBottom">'+'<h2>'+schoolInfo[prefs.school].abbrName+'图书馆全字段检索</h2>'+'</div>'+
        '<div id="otherTitle" class="tab_content libBottom" style="display:none"><div id="mainOtherTitle">'+
        '</div><div id="errorOtherTitle"></div>'+
        '</div>'+
        '<div id="jaysonTitle" class="tab_content libBottom" style="display:none">'+'<h2>'+
        '<a target="_blank" class="gotobtn" href="'+googleCustomUrl+'">前往谷歌聚合搜索</a><br>'+
        '</h2>'+
        '<div id="googleLoading"><li class="loadingSource"><img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw=="> 努力加载中...</li></div>'+
        '</div>';

    frame.setAttribute("class","tablist title_div");

    if(location.href.indexOf("ebook")!=-1){
        var aside=document.getElementsByTagName("aside")[0];
    }
    else{
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


    var NLCfinalUrl = schoolInfo.NLC.isbnSearchUrl.replace(/%s/,bookMeta.isbn10);
    var CALISfinalUrl = schoolInfo.CALIS.isbnSearchUrl.replace(/%s/,bookMeta.isbn10);
    frame.innerHTML=    '<ul class="tabmenu">'+
        '<li id="clickISBN" class="blue"><a>'+schoolInfo[prefs.school].abbrName+'</a></li>'+
        '<li id="clickOtherISBN"><a>其他图书馆</a></li>'+
        '<li id="settingPop"><a>设置</a></li>'+
        '</ul>'+
        '<div id="libISBN" class="tab_content libTop">'+'<h2>'+schoolInfo[prefs.school].abbrName+'图书馆ISBN检索</h2>'+'</div>'+
        '<div id="otherISBN" class="tab_content libTop" style="display:none"><div id="mainOtherISBN">'+
        '<a target="_blank" class="gotobtn" href="'+CALISfinalUrl+'">前往CALIS</a>'+' &nbsp;'+'<a class="gotobtn" target="_blank" href="'+NLCfinalUrl+'">前往国家图书馆</a>'+
        '</div><div id="errorOtherISBN"></div></div>';//+

    frame.setAttribute("class","tablist");
    if(location.href.indexOf("ebook")!=-1){
        var aside=document.getElementsByTagName("aside")[0];
    }
    else{
        var aside=document.querySelector(".aside");        
    }
    aside.insertBefore(frame,aside.firstChild);
    clickOther=document.getElementById("clickOtherISBN");
    clickOther.addEventListener("click",showOtherFrame,false);
    clickOther=document.getElementById("clickISBN");
    clickOther.addEventListener("click",showOriginFrame,false);
    document.getElementById("settingPop").addEventListener("click",popSetting,false);


}


//////////////////////其它图书馆ISBN//////////////////////////////////

function otherISBN(){
    for(var key in schoolList){
      if(schoolList[key]!=prefs.school){
        //alert(school);
        mineISBN(schoolList[key],"otherISBN");
      }
    }
}

//////////////////////超星其它//////////////////////////////////

function otherTitle(){
//////////////////////////超星发现和超星读书

        if(bookMeta.lan=="en"){
            var fullUrl=schoolInfo.EBSCO.anySearchUrl.replace(/%s/,bookMeta.title);//外文图书
        }
        else{
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

    }
    else{
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
                    'http://www.guge.link/'
                    //,'https://www.ko50.com/'
                    ,'https://www.guge.click/'
                    //,'http://gg.cellmean.com/'
                    ,'https://google.xface.me/'
                    ,'http://google.sidney-aldebaran.me/'
                    //,'https://guge.in/'
                    //,'http://www.ggooo.net/'
                    ,'https://gg.kfd.me/'
                    //,'https://www.ko50.com/'
                    //,'https://google-hk.wewell.net/'
                    //,'http://www.googlestable.cn/'
                    //,'http://hisbig.com/'
                    //,'http://gg.cellmean.com/'
                    ,'https://www.sslpxy.com/'
                    ,'http://xueshu.cytbj.com/'
                    //,'https://www.nssjs.com/'
                    //,'https://hk.g.net.co/'
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
            "Accept": "text/html;charset=utf-8"            // If not specified, browser defaults will be used.
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
            }
            else{
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
    
    }

    else{//无ISBN号的情况
        var msg = new LibMeta(school);
        msg.error=true;
        msg.state="error";
        msg.errorMsg = "无法获取ISBN号";

        messageCatcher(msg,frameLocation)

    }
}

function insertLoading(fullUrl){
        frame = document.getElementById("libISBN");
        frameLink = document.createElement("a");
        frameLink.setAttribute("target","_blank");
        frameLink.innerHTML="前往图书馆查看这本书";
        frameLink.setAttribute("href",fullUrl);
        frame.appendChild(frameLink);

        loadingFrame=document.createElement("div");
        loadingFrame.setAttribute("id","ISBNLoading");
        loadingFrame.innerHTML= '<li id="loadingSource"><a><img border="0" src="data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw=="> 努力加载中...</a></li>'

        frame.appendChild(loadingFrame);
}
/////////////////////////////////////////


//////////////书名搜索xml获取//////////////////
mineTitle = function(school){
    titleFrame();
        if(bookMeta.isbn&&bookMeta.title.charCodeAt(0)<=122&&bookMeta.isbn[3]!=="7"){
             var fullUrl=schoolInfo[school].anyForeianSearchUrl.replace(/%s/,bookMeta.title);
             GM_setValue("doubanLanguage","en");
        }
        else{
             var fullUrl=schoolInfo[school].anySearchUrl.replace(/%s/,bookMeta.title);           
        }

        frame = document.getElementById("libTitle");
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
        }
        else{
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
/////////////////////////////////////////

///////////////ISBN插入框架//////////////////////////////
ISBNInsert=function(msg,frameLocation){
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
      }
      else{
        confirm("以下信息已复制到粘贴板\n\n"+this.getAttribute("data-storeInfo"));
      }
    });
  }
  else{
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
            if(loading =document.getElementById("ISBNLoading")){
                loading.parentNode.removeChild(loading);
            }
            

            frame = document.getElementById("libISBN");
            break;
        case "title":
            if(loading =document.getElementById("titleLoading")){
                loading.parentNode.removeChild(loading);
            };
            
            frame = document.getElementById("libTitle");
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

  var style = ('style="' +
                         'display: inline-block; ' +
                         'background: #33A057; ' +
                         'border: 1px solid #2F7B4B; ' +
                         'color: white; ' +
                         'padding: 1px 10px; ' +
                         'border-radius: 3px; ' +
                         'margin-right: 8px;" '
  );


  statBtn = ('<a id="recbtn" rel="modal:open"' + 
      style + '>荐购</a>' );

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
            }
            else{
                attachRent='';
            }
            storeInfo = bookMeta.title+" "+schoolInfo[msg.school].name+" ";
            //msg.items[s].bookIndex=null;
            if(msg.items[s].bookIndex) storeInfo+="索书号:"+msg.items[s].bookIndex+" ";            
            if(msg.items[s].branch) storeInfo+="分馆:"+msg.items[s].branch+" ";
            if(msg.items[s].location) storeInfo+="馆藏地:"+msg.items[s].location;
           bookStatus =   '<ul class="preStoreRegister storelist ft pl more-after'+attachRent+'" data-storeInfo="'+storeInfo+'" '+'title="双击可粘贴馆藏信息到剪贴板"'+'> ' +//+'ondblclick="GM_setClipboard(this.getAttribute('+"'data-storeInfo'"+'))"'
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
          }
          else{
            otherAbbr="院校:"+schoolInfo[msg.items[0].school].abbrName+" ";
          }
          
        }
        for(s=0;s<msg.items.length;s++){
            if(s>4){
              display="display : none;";
            }
            else{
              display="";
            }

            if(msg.school=="EBSCO"){
                extra='<li class="getlink"><a target="_blank" href="'+msg.items[s].extra+'">Full Text</a></li>';
            }

           bookStatus =   '<ul class="ft pl more-after"> ' +
            '<li style="border: none">'+otherAbbr+'书名:<a href="'+msg.items[s].link+'"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
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
            }
            else{
              display="";
            }
           bookStatus =   '<ul class="ft pl more-after"> ' +
            '<li style="border: none">'+otherAbbr+'书名:'+'<a href="'+msg.items[s].link+'"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
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
            }
            else{
              display="";
            }
           bookStatus =   '<ul class="ft pl more-after"> ' +
            '<li style="border: none">'+otherAbbr+'书名:'+'<a href="'+msg.items[s].link+'"target="_blank">' + msg.items[s].bookName+ '</a></li>' +
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



GM_addStyle('.recbtn{display: inline-block; background: #33A057;border: 1px solid #2F7B4B; color: white; padding: 1px 10px; border-radius: 3px; margin-right: 8px;cursor:pointer} ')
GM_registerMenuCommand("图书馆检索设置", popSetting);
//////////////主函数//////////////////////////

if(location.href.indexOf('douban')!=-1){

  GM_addStyle(".tablist {position:relative;}"+
".tab_content {position: relative;width:295px;margin-bottom:5px;max-height: 300px;overflow: auto;padding:15px 5px 15px 5px;border:1px solid #91a7b4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:1.2em;line-height:1.5em;color:#666;background:#F6F6F1;}"+
".tabmenu {position:absolute;bottom:100%;margin:0;width:316px;}"+
  ".tabmenu li{display:inline-block;}"+
  ".tabmenu li a {display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px 5px 0 0;background:#F6F6F1;color:#333;text-decoration:none;}#libISBN div ul,#libTitle div ul,#otherISBN div ul,#otherTitle div ul{border-bottom: 1px dashed #ddd;}#errorOtherISBN{font-size:10px}.blue a{background:#37A !important;color:white !important;}.tab_content h2{color:#007722; font:15px/150% Arial,Helvetica,sans-serif;margin: 0 0 12px;}"+
".libTop{margin-top:30px;}#clickISBN a,#clickOtherISBN a,#settingPop a{cursor:pointer;}#settingPop{position:relative;float:right;}"+
".rentable{background:#E3F1ED!important;}.ft.pl.rentable li a{color:#4f946e;}.ft.pl.rentable li a:hover{background:#007711;color:#FFFFFF;}"+
".title_div{margin-top: 35px;}");
  mineISBN(prefs.school,"ISBN");
  mineTitle(prefs.school);

    GM_setValue("doubanTitle",bookMeta.title);
    GM_setValue("doubanAuthor",bookMeta.author);
    GM_setValue('doubanPubdate',bookMeta.pubdate);
    GM_setValue("doubanIsbn",bookMeta.isbn);
    GM_setValue("doubanPublisher",bookMeta.publisher);
}


if(location.href.indexOf('http://202.116.64.108:8080/apsm/recommend/recommend.jsp')!=-1){
  libRecommend.SYSU();//中山大学图书馆荐购页面
}
if(location.href.indexOf('http://202.38.232.10/opac/servlet/opac.go?cmdACT=recommend.form')!=-1){
  libRecommend.SCUT();//华南理工大学图书馆荐购页面
}
if(location.href.indexOf('http://opac.gdufs.edu.cn:8118/apsm/recommend/recommend_nobor.jsp')!=-1){
  libRecommend.SYSU();//广东外语外贸大学图书馆荐购页面
}

if(location.href.indexOf('gdtgw.cn')!=-1){//十校互借页面

    if(GM_getValue('gotoRent')==true){

    function clickShow(mutations){    //点击按钮
        function fillForm(mutations){//填写表单
            
            
            //document.getElementById("publishTime").value=GM_getValue("doubanPubdate","");

            /*observerRight.disconnect();//去除监听*/
            //var target = document.getElementById("supplier");
            var target = document.querySelector('#supplier');
            var observerSchool = new MutationObserver(function(mutations,obs){
                document.getElementsByName("reader.campusId")[0].value=prefs.school.toLowerCase();
                document.getElementById("supplier").value=GM_getValue("rentSchool","");
                
                //alert("test");
                obs.disconnect;
                observerRight.disconnect();


            });
            var config = { 'childList': true} 
            // 传入目标节点和观察选项
            observerSchool.observe(target, config);


            ///
            //document.getElementsByName("reader.campus")[0].value=prefs.campus;
            
           
            document.getElementById("phone").value=prefs.telephone;
            document.getElementById("idNo").value=prefs.studentID;
            document.getElementById("name").value=prefs.name;
            document.getElementById("email").value=prefs.eMail;
            document.getElementsByName("reader.campus")[0].value=prefs.campus;
            document.getElementById("callNo").value=GM_getValue("bookIndex","");            
            document.getElementById("title").value=GM_getValue("doubanTitle","");
            document.getElementById("isbn").value=GM_getValue("doubanIsbn","");
            document.getElementById("publishTime").value=GM_getValue("doubanPubdate","");
            document.getElementById("author").value=GM_getValue("doubanAuthor","");  
            document.getElementById("publisher").value=GM_getValue("doubanPublisher","");
        }
        ////////////////////////////////////////


        document.getElementById("Map").areas[1].click();
        observerLeft.disconnect();
        var target = document.querySelector('#rightContent');
        var observerRight = new MutationObserver(fillForm);
        var config = { 'childList': true} 
        // 传入目标节点和观察选项
        observerRight.observe(target, config);
    }
    ///////////////////////


        var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver || 
        window.MozMutationObserver;
        if(MutationObserver){
    // 选择目标节点
        var target = document.querySelector('#leftContent');

    // 创建观察者对象
        var observerLeft = new MutationObserver(clickShow); 
    // 配置观察选项:
        var config = { 'childList': true} 
    // 传入目标节点和观察选项
        observerLeft.observe(target, config); 
    // 随后,你还可以停止观察

       
        }
        else{
            function clickSecond(){

            document.getElementById("idNo").value=prefs.studentID;
            document.getElementById("campusId").value=prefs.school.toLowerCase();//无法设置，还需要一次监听，或者setTimeout
            document.getElementsByName("reader.email")[0].value=prefs.eMail;
            document.getElementsByName("reader.campus")[0].value=prefs.campus;
            document.getElementsByName("reader.phone")[0].value=prefs.telephone;
            document.getElementById("name").value=prefs.name;
            document.getElementById("supplier").value=GM_getValue("rentSchool","");
            document.getElementById("callNo").value=GM_getValue("bookIndex","");            
            document.getElementById("title").value=GM_getValue("doubanTitle","");
            if(GM_getValue("doubanIsbn")) document.getElementById("isbn").value=GM_getValue("doubanIsbn","");
            if(GM_getValue("doubanPubdate","")) document.getElementById("publishTime").value=GM_getValue("doubanPubdate","");
            document.getElementById("author").value=GM_getValue("doubanAuthor","");  
            document.getElementById("publisher").value=GM_getValue("doubanPublisher","");
            
            }

            function clickFirst(){
            document.getElementById("Map").areas[1].click();
            setTimeout(function(){clickSecond()},1000);
            }

            setTimeout(function(){clickFirst()},500);
        }
        GM_setValue('gotoRent',false); 

    }
}


if(location.href.indexOf('gdufs.edu.cn')!=-1&&prefs.school!="GDUFS"){//广外

    var rentTable=document.getElementsByTagName("table");
    rentTable=rentTable[6];

    function GDUFS_interLending(){
        var bookIndex=this.parentNode.parentNode.cells[5].textContent;
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","gdufs");
        GM_setValue("gotoRent",true);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {
         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         rentTable.rows[s].cells[9].innerHTML='';
         rentTable.rows[s].cells[9].appendChild(recbtn);
         recbtn.addEventListener("click",GDUFS_interLending,false);
    };
}

if(location.href.indexOf('202.116.64.108:8991')!=-1&&prefs.school!="SYSU"){//中大

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

if(location.href.indexOf('http://202.38.232.10/opac/servlet/opac.go')!=-1&&prefs.school!="SCUT"){//华理工
    var rentTable=document.getElementById("queryholding");
    if(rentTable){
        //break;
        //return null;
    

    function SCUT_interLending(){
        var bookIndex=this.parentNode.parentNode.cells[2].textContent;

        var title=document.getElementById("bookName").getAttribute("value");

        var infoTable=document.getElementsByClassName("left12")[0].getElementsByTagName("table")[0];
        ISBN = infoTable.textContent;
        ISBN = ISBN.replace(/\n/g,"").replace(/ /g,"").match(/ISBN(\d|-)+/)[0].slice(4);
        publisher = infoTable.rows[2].cells[1].textContent;
        pubDate = publisher.match(/\d+/);
        publisher = publisher.slice(0,publisher.indexOf(pubDate)-2);
        author = infoTable.rows[1].cells[1].getElementsByTagName("a")[0].innerHTML;

        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","scut");
        GM_setValue("gotoRent",true);
        GM_setValue("doubanTitle",title);
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        //alert(ISBN);
        GM_setValue("doubanIsbn",ISBN);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }
    rentTable=rentTable.rows[0].cells[0].getElementsByTagName("table")[0];
    for (var s = 1; s < rentTable.rows.length; s++) {

         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[3];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",SCUT_interLending,false);
    };   
    } 
}

if(location.href.indexOf('lib.gzhu.edu.cn:8080/bookle/search2/detail')!=-1&&prefs.school!="GZHU"){//广州大学
    var rentTable=document.getElementsByClassName("book_holding")[0];

    function GZHU_interLending(){
        var infoTable=document.getElementsByClassName("book_detail")[0];

        var bookIndex=infoTable.rows[5].cells[1].textContent;
        var publisher = infoTable.rows[0].cells[1].textContent;

        var pubDate = publisher.match(/\d+/);
        pubDate=pubDate.toString();
        publisher=publisher.slice(0,publisher.indexOf(pubDate)-1);
        var title=document.getElementsByTagName("title")[0].textContent.slice(13,-1);
        var author=infoTable.rows[1].cells[1].textContent.replace(/\n/g,"").replace(/ /g,"");
        //alert(publisher+bookIndex+pubDate+title);
        GM_setValue("doubanTitle",title);
        if(pubDate) GM_setValue("doubanPubdate",pubDate.toString());
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        //GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","gzhu");
        GM_setValue("gotoRent",true);
        GM_setValue("doubanTitle",title);
        //GM_setValue("doubanIsbn",bookisbn);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {

         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[6];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",GZHU_interLending,false);
    };    
}

if(location.href.indexOf('http://210.38.102.131:86/opac/item.php?marc_no=')!=-1&&prefs.school!="GZHTCM"){//广中医
    var rentTable=document.getElementById("item");

    function GZHTCM_interLending(){

        var infoTable=document.getElementsByClassName("booklist");

        var bookIndex=this.parentNode.parentNode.cells[0].textContent;
        var publisher =infoTable[1].getElementsByTagName("dd")[0].textContent;
        var pubDate = publisher.match(/\d+/);
        pubDate=pubDate.toString();
        var ISBN=infoTable[2].getElementsByTagName("dd")[0].textContent.match(/(\d|-)+/);
        ISBN=ISBN[0];
        publisher=publisher.slice(0,publisher.indexOf(pubDate)-1);
        var title=document.getElementsByTagName("title")[0].textContent;
        var author=infoTable[0].getElementsByTagName("dd")[0].textContent;
        author = author.slice(author.indexOf('/')+1)

        GM_setValue("doubanTitle",title);
        GM_setValue("doubanIsbn",ISBN);
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","gzhtcm");
        GM_setValue("gotoRent",true);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {

         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[2];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",GZHTCM_interLending,false);
    };    
}

if(location.href.indexOf('http://202.116.41.246:8080/opac/item.php?marc_no=')!=-1&&prefs.school!="SCNU"){//华师
    var rentTable=document.getElementById("item");

    function SCNU_interLending(){

        var infoTable=document.getElementsByClassName("booklist");
        var bookIndex=this.parentNode.parentNode.cells[0].textContent;
        var publisher =infoTable[1].getElementsByTagName("dd")[0].textContent;
        var pubDate = publisher.match(/\d+/);
        pubDate=pubDate.toString()
        var ISBN=infoTable[2].getElementsByTagName("dd")[0].textContent.match(/(\d|-)+/);
        ISBN=ISBN[0];
        publisher=publisher.slice(0,publisher.indexOf(pubDate)-1);
        var title=document.getElementsByTagName("title")[0].textContent;
        var author=infoTable[0].getElementsByTagName("dd")[0].textContent;
        author = author.slice(author.indexOf('/')+1)
        //alert(publisher+bookIndex+pubDate+title);
        GM_setValue("doubanTitle",title);
        GM_setValue("doubanIsbn",ISBN);
        //alert(GM_getValue("doubanIsbn"));
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","scnu");
        GM_setValue("gotoRent",true);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {
         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[2];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",SCNU_interLending,false);
    };    
}

if(location.href.indexOf('http://222.200.98.171:81/bookinfo.aspx?ctrlno=')!=-1&&prefs.school!="GDUT"){//广东工业大学
    var rentTable=document.getElementById("bardiv").getElementsByTagName("table")[0];

    function GDUT_interLending(){

        var infoTable=document.getElementById("ctl00_ContentPlaceHolder1_bookcardinfolbl");

        var bookIndex=this.parentNode.parentNode.cells[1].textContent;
        var publisher =infoTable.getElementsByTagName("a")[0].innerHTML;
        if(pubDate = infoTable.textContent.match(/\d+\.?\d*/)) pubDate=pubDate.toString();
        var ISBN=infoTable.textContent.replace(/\n/g,"").match(/ISBN(\d|-)+/)[0];

        ISBN=ISBN.slice(4)
        var title=infoTable.textContent.slice(0,infoTable.textContent.indexOf("／")).replace(/　+/g,"");
        var author=infoTable.textContent.slice(infoTable.textContent.indexOf("／")+1,infoTable.textContent.indexOf("—")-1);

        GM_setValue("doubanTitle",title);
        GM_setValue("doubanIsbn",ISBN);
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","gdut");
        GM_setValue("gotoRent",true);
        GM_setValue("doubanTitle",title);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {

         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[6];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",GDUT_interLending,false);
    };    
}

if(location.href.indexOf('http://121.33.246.167/opac/bookinfo.aspx?ctrlno=')!=-1&&prefs.school!="GZARTS"){//广州美术学院
    var rentTable=document.getElementById("bardiv").getElementsByTagName("table")[0];

    function GZARTS_interLending(){

        var infoTable=document.getElementById("ctl00_ContentPlaceHolder1_bookcardinfolbl");
        //alert(infoTable.textContent);

        var bookIndex=this.parentNode.parentNode.cells[1].textContent;
        var publisher =infoTable.getElementsByTagName("a")[0].innerHTML;
        if(pubDate = infoTable.textContent.match(/\d+\.?\d*/)) pubDate=pubDate.toString();
        var ISBN=infoTable.textContent.replace(/\n/g,"").match(/ISBN(\d|-)+/)[0];

        ISBN=ISBN.slice(4)
        var title=infoTable.textContent.slice(0,infoTable.textContent.indexOf("／")).replace(/　+/g,"");
        var author=infoTable.textContent.slice(infoTable.textContent.indexOf("／")+1,infoTable.textContent.indexOf("—")-1);

        GM_setValue("doubanTitle",title);
        GM_setValue("doubanIsbn",ISBN);
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","gzarts");
        GM_setValue("gotoRent",true);
        GM_setValue("doubanTitle",title);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    //alert(rentTable.textContent);
    for (var s = 1; s < rentTable.rows.length; s++) {
         //let bookIndex=rentTable.rows[s].cells[5].textContent;
         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[6];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",GZARTS_interLending,false);
    };    
}

if(location.href.indexOf('http://218.192.148.33:81/bookinfo.aspx?ctrlno=')!=-1&&prefs.school!="XHCOM"){//星海音乐学院
    var rentTable=document.getElementById("bardiv").getElementsByTagName("table")[0];

    function XHCOM_interLending(){

        var infoTable=document.getElementById("ctl00_ContentPlaceHolder1_bookcardinfolbl");
        var bookIndex=this.parentNode.parentNode.cells[1].textContent;
        var publisher =infoTable.getElementsByTagName("a")[0].innerHTML;
        
        if(pubDate = infoTable.textContent.match(/\d+\.?\d*/)) pubDate=pubDate.toString();
        var ISBN=infoTable.textContent.replace(/\n/g,"").match(/ISBN(\d|-)+/)[0];

        ISBN=ISBN.slice(4)
        var title=infoTable.textContent.slice(0,infoTable.textContent.indexOf("／")).replace(/　+/g,"");
        var author=infoTable.textContent.slice(infoTable.textContent.indexOf("／")+1,infoTable.textContent.indexOf("—")-1);

        GM_setValue("doubanTitle",title);
        GM_setValue("doubanIsbn",ISBN);
        GM_setValue("doubanPubdate",pubDate);
        GM_setValue("doubanPublisher",publisher);
        GM_setValue("doubanAuthor",author);
        GM_setValue("bookIndex",bookIndex);
        GM_setValue("rentSchool","xhcm");
        GM_setValue("gotoRent",true);
        GM_setValue("doubanTitle",title);
        GM_openInTab("http://www.gdtgw.cn:8080/#.html");
    }

    for (var s = 1; s < rentTable.rows.length; s++) {
         //let bookIndex=rentTable.rows[s].cells[5].textContent;
         var recbtn=document.createElement("a");
         recbtn.setAttribute("class","recbtn");
         recbtn.innerHTML="十校互借";
         var btncell=rentTable.rows[s].cells[6];
         btncell.appendChild(recbtn);
         recbtn.addEventListener("click",XHCOM_interLending,false);
    };    
}