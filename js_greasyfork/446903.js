// ==UserScript==
// @name         BIC工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  完成一键开户，交易码前加# 主题颜色，翻译等。
// @author       Sunshine.lv
// @match        http://192.168.201.238:8080/branch/xds?targetUri=service.sys.systemManager&method=loadFacePage&flag=transient*
// @match        http://192.168.201.240:8080/branch/xds?targetUri=service.sys.systemManager&method=loadFacePage&flag=transient*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446903/BIC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446903/BIC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
{// 交易号输入栏加#
    let search_field = document.getElementById("search-field");
    search_field.oninput = search_field.onpropertychange = function () {
        search_field.value = "#"+search_field.value.replace(/[^\d,D]/g,'');
    }
}

let Transaction_Code = {  //交易码表
    New_Customers : /0021100/
}
let CustomerInfo = {
//  随机填信息
    Title : 0,
    ID_Issue_Date : "20020618",
    Nationality : "CN",
    Country_Of_Residence : "CN",
    Birth_Date : "20020618",
    Gender : "2",
    Residential_Status : "1",
    Marital_Status : "10",
    Employment_Status : "1",
    Occupation : "1001",
    Occupation_Sectors : "1",
    Occupation_Major : "1",
    Position : "01",
    Monthly_Income : 9999.00,
    US_Person_Declaration : "01",  
      Economic_Type_C : "06", //公司金融
      Economic_Type_P : "08", //个人
    Economic_Sector : "09", 
    Sub_Economic_Sector : "092",
    Workplace : "BANK",
    User_Type : "02",
    Customer_Category : "01",
    Customer_Classification : "02",
//  公司随机填信息
    Country_of_Business : "CN",  
    Industrial : "D",
    Sub_Industrial : "D02",  
//  金融随机填信息
    Country_of_Registration : "CN",
    HO_Register_Country : "CN",
//  联系方式地址
    Province : "01",
    District : "1001",
    Village : "1001001",
    Telephone  : "947",
//  个人信息 
    Emergency_Contact_Name_Local : "LUBENWEI",
    Emergency_Contact_Name_English : "LUBENWEI",
    TelePhone : "947"
}
function Info(){  //基础信息
    this.timeout = 1100;  //定时器延时
    //返回主菜单
    this.backMenu = function (ThisDocumet,name,code){  
        let Title = ThisDocumet.getElementsByClassName(name)[0].childNodes;
        for(let temp in Title){
            if (code.test(Title[temp].href)) {
                Title[temp].click();
                return;
            }
        }
    }
    //随机数方法，输入长度，返回字符串。
    this.MyRandom = function(number){
        let Random = "";
        for(let x = 0;x<number;x++){
            Random +=Math.round(Math.random()*9);
        }
        return Random;
    }
    //赋值，传入Documet，栏位名，数值，是否需要失焦。1为需要
    this.valueIS = function(ThisDocumet,name,parameter,Blurof = 1){ //赋值
    ThisDocumet.getElementById(name).value = parameter;
    if(Blurof){
        ThisDocumet.getElementById(name).focus();  
        ThisDocumet.getElementById(name).blur(); 
    }
}
}

let title_k,title_option_k,title;
let style_option,style_option_A,style_option_B,language;
{   //顶部状态栏,样式表
    title_k = document.createElement('div'); 
    title_option_k = document.createElement('div'); 
    title =  document.createElement('div');
    style_option = document.createElement('div'); 
    style_option_A = document.createElement('div'); 
    style_option_B = document.createElement('div'); 
    language = document.createElement('div'); 

// title_k.style.backgroundColor = "yellow";
// title_option_k.style.backgroundColor = "blueviolet";
// title.style.backgroundColor = "blue";

    language.innerHTML = "中英切换";
    language.style.width = "80px";
    language.style.height = "30px";
    language.style.float = "left";
    language.style.backgroundColor = "tomato";
    language.style.lineHeight = "30px";
    language.style.textAlign = "center";
    language.style.marginLeft = "300px";
    language.style.borderRadius = "5px";

    style_option.style.width = "100px";
    style_option.style.height = "auto";
    // style_option.style.backgroundColor = "blueviolet";
    style_option.style.float = "right";
    style_option.style.fontSize = "20px";
    style_option.style.textAlign = "center";
    style_option.style.color = "white";

    style_option_A.style.height = "30px";
    style_option_A.style.backgroundColor = "pink";
    style_option_A.innerHTML = "主题样式";
    style_option_A.style.fontWeight = "900";
    style_option_A.style.color = "green";

    style_option_B.style.height = "90px";
    style_option_B.style.lineHeight = "30px";
    style_option_B.style.backgroundColor = "red";
    style_option_B.style.zIndex = "999";
    style_option_B.style.position = "absolute";


    for (let index = 0; index < 3; index++) {
        console.log(index);
        let temp = new Object();
        temp = document.createElement('div'); 
        temp.style.width = "100px";
        temp.onmouseover = function(){//鼠标移入
            this.style.transform = "scale(1.2)";
        }
        temp.onmouseout = function(){//鼠标移出
            this.style.transform = "scale(1)";
        }
        switch (index) {
            case 0:
                temp.style.backgroundColor = "rgb(255, 69, 69)";
                temp.innerHTML = "故宫红";
                temp.onclick = function(){
                    let of  = confirm("样式变更会将现有的交易关闭,确认要更换样式吗?");
                    if (of) {changeTheme('red');}
                    
                }; 
                break;
            case 1:
                temp.style.backgroundColor = "rgb(38, 182, 38)";
                temp.innerHTML = "原谅绿";
                temp.onclick = function(){
                    let of  = confirm("样式变更会将现有的交易关闭,确认要更换样式吗?");
                    if (of) {changeTheme('green');}
                }; 
                break;    
            case 2:
                temp.style.backgroundColor = "rgb(58, 58, 212)";
                temp.innerHTML = "BIC 蓝";
                temp.onclick = function(){
                    let of  = confirm("样式变更会将现有的交易关闭,确认要更换样式吗?");
                    if (of) {changeTheme('blue');}
                }; 
                break;        
        }
        style_option_B.appendChild(temp);
        console.log(style_option_B);
    }


    title_k.style.float = "left";
    title_k.style.height = "90px";
    title_k.style.width = "500px";
    title_k.style.marginLeft = "10px";
    title_option_k.style.height = "55px";
    title_option_k.style.width = "500px";
    title_option_k.style.paddingTop = "5px";

    title.style.fontSize = "20px";
    title.style.textAlign = "center";
    title.style.color = "yellow";

    title_k.appendChild(title_option_k);
    title_option_k.appendChild(language);
    title_option_k.appendChild(style_option);
    style_option.appendChild(style_option_A);
    style_option.appendChild(style_option_B);
    title_k.appendChild(title);
    let top_k = document.getElementsByClassName("top")[0];
    console.log(top_k);
    let right_k = document.getElementsByClassName("right")[0];
    top_k.insertBefore(title_k,right_k);
}
{   //顶部状态栏，控制
    style_option_B.style.display = "none";
    style_option_A.onclick = function(){ 
        if (style_option_B.style.display == "none") {
            style_option_B.style.display = "block";
        }else{
            style_option_B.style.display = "none";
        } 
    }
    language.onclick = function(){ //中英文切换
        let l_of  = confirm("语言变更会将现有的交易关闭,语言更换后交易页面可能会有些许不同");
        if (l_of){ setlanguage(); }
    }
}
let Title_top = function(){};
{   //状态栏类
    Title_top.start = "";
    Title_top.timeerval ;
    Title_top.temp_S = 0 ;
    // 执行成功
    Title_top.finish = function(temp_S = 12,start = "一键创建成功"){
        Title_top.temp_S = temp_S;
        Title_top.start = start;
        Title_top.run();
    }
    //  执行中
    Title_top.run = function(){
        Title_top.start = "请稍等";
        Title_top.timeerval = setInterval(function () {
            Title_top.start = "请稍等";
            title.innerHTML = Title_top.start;
            console.log(Title_top.temp_S);
            if (Title_top.temp_S>=4 & Title_top.temp_S<=6) {
                Title_top.start = "网络不佳，一键失败，请手动输入继续";
                if (Title_top.temp_S == 6) { //0~10为状态超时
                    Title_top.start = "";
                    clearTimeout(Title_top.timeerval);
                }
            }
            if(Title_top.temp_S>=12 & Title_top.temp_S<=16){
                Title_top.start = "创建完成";
                if (Title_top.temp_S == 14) { //10~20为状态完成
                    Title_top.start = "";
                    clearTimeout(Title_top.timeerval);

                }
            }
            title.innerHTML = Title_top.start;
            Title_top.temp_S++;
        },1500);
    }
}


let INFO = new Info();
let iframeID;
let reg = /.\d{12}_ifr/; //正则匹配交易码
let ext_gen5 = document.getElementById("ext-gen5");

ext_gen5.addEventListener('DOMSubtreeModified', function (e) {
    if(reg.test(e.path[0].id)){
        iframeID = e.path[0].id;
        let thisDocumet = null;
        //这里开始判断交易码
        if(Transaction_Code.New_Customers.test(e.path[0].src)){
            var timeout =  setTimeout(function () {
                console.log(e.path[0]);
                thisDocumet = e.path[0].contentWindow.document;  
                console.log(thisDocumet);
                clearTimeout(timeout);
                New_Customers_Function(thisDocumet,iframeID);
            },INFO.timeout);
        }
    }
}, false);

function getNewDocumet() { //更新Documet
    let ext_iframe = 
    // 这里写得有点傻吊，实在没办法不知道怎么拿指定子类对象。
        ext_gen5.children[1].children[0].children[0].children[0].children[0];
    return ext_iframe.contentWindow.document;
}



function New_Customers_Function(ThisDocumet,iframeID){

    function Basic_Information_Add(){ //基类，客户基本信息1，
        this.CompanyCustomer = function (ThisDocumet,Basic_info){     //公司客户
            INFO.valueIS(ThisDocumet,"IDEFDT",Basic_info.ID_Issue_Date);
            INFO.valueIS(ThisDocumet,"OSFLG",Basic_info.Residential_Status);
            INFO.valueIS(ThisDocumet,"CTY_RES",Basic_info.Country_of_Business);
            INFO.valueIS(ThisDocumet,"CTY_REG",Basic_info.Country_Of_Residence);
    
            INFO.valueIS(ThisDocumet,"CHARGE_GROUP",Basic_info.User_Type);
            INFO.valueIS(ThisDocumet,"ORG_TYP",Basic_info.Customer_Category);      
            INFO.valueIS(ThisDocumet,"AI_TYPE",Basic_info.Customer_Classification);      
            INFO.valueIS(ThisDocumet,"SECTOR",Basic_info.Economic_Type_C);       
            INFO.valueIS(ThisDocumet,"INDUS_CN",Basic_info.Economic_Sector);     
            INFO.valueIS(ThisDocumet,"INDUS_HK",Basic_info.Sub_Economic_Sector);
    
            ThisDocumet.getElementById("#TABSHEET2").click();  //点到第二页面，不然失焦
    
            INFO.valueIS(ThisDocumet,"INDUS_PB",Basic_info.Industrial);
            INFO.valueIS(ThisDocumet,"INDUS_OT",Basic_info.Sub_Industrial);
            INFO.valueIS(ThisDocumet,"ANNUAL_INCOME",Basic_info.Monthly_Income);
            INFO.valueIS(ThisDocumet,"USER",Basic_info.US_Person_Declaration);
        }
        this.PersonalCustomer = function(ThisDocumet,Basic_info){     //个人客户
            INFO.valueIS(ThisDocumet,"TITLE",Basic_info.Title);
            INFO.valueIS(ThisDocumet,"IDEFDT",Basic_info.ID_Issue_Date);
            INFO.valueIS(ThisDocumet,"CTY_REG",Basic_info.Nationality);
            INFO.valueIS(ThisDocumet,"CTY_RES",Basic_info.Country_Of_Residence);
            INFO.valueIS(ThisDocumet,"BIRDT",Basic_info.Birth_Date);
            INFO.valueIS(ThisDocumet,"SEX",Basic_info.Gender);
            INFO.valueIS(ThisDocumet,"OSFLG",Basic_info.Residential_Status);
    
            ThisDocumet.getElementById("#TABSHEET2").click();  //点到第二页面
    
            INFO.valueIS(ThisDocumet,"MARI",Basic_info.Marital_Status);
            INFO.valueIS(ThisDocumet,"EMP_STS",Basic_info.Employment_Status);
            INFO.valueIS(ThisDocumet,"OCCUP",Basic_info.Occupation);
            INFO.valueIS(ThisDocumet,"MARI",Basic_info.Marital_Status);
            INFO.valueIS(ThisDocumet,"OCCUP1",Basic_info.Occupation_Sectors);
            INFO.valueIS(ThisDocumet,"OCCUP2",Basic_info.Occupation_Major);
            INFO.valueIS(ThisDocumet,"POSIT",Basic_info.Position);
            INFO.valueIS(ThisDocumet,"ANNUAL_INCOME",Basic_info.Monthly_Income);
            INFO.valueIS(ThisDocumet,"USA_FLAG",Basic_info.US_Person_Declaration);
            INFO.valueIS(ThisDocumet,"SECTOR",Basic_info.Economic_Type_P);
            INFO.valueIS(ThisDocumet,"INDUS_CN",Basic_info.Economic_Sector);
            INFO.valueIS(ThisDocumet,"INDUS_HK",Basic_info.Sub_Economic_Sector);
            INFO.valueIS(ThisDocumet,"EM_NAME",Basic_info.Workplace);
            INFO.valueIS(ThisDocumet,"CHARGE_GROUP",Basic_info.User_Type);
            INFO.valueIS(ThisDocumet,"CUS_CLASS",Basic_info.Customer_Classification);
    
        }
        this.FinancialCustomer = function(ThisDocumet,Basic_info){    //金融客户
            INFO.valueIS(ThisDocumet,"IDEFDT",Basic_info.ID_Issue_Date);
            ThisDocumet.getElementById("#TABSHEET2").click();       //点到第二页面
            INFO.valueIS(ThisDocumet,"CHARGE_GROUP",Basic_info.User_Type);
            INFO.valueIS(ThisDocumet,"AI_TYPE",Basic_info.Customer_Classification);
            INFO.valueIS(ThisDocumet,"USER",Basic_info.US_Person_Declaration);
            INFO.valueIS(ThisDocumet,"OSFLG",Basic_info.Residential_Status);
            INFO.valueIS(ThisDocumet,"INDUS_PB",Basic_info.Industrial);
            INFO.valueIS(ThisDocumet,"INDUS_OT",Basic_info.Sub_Industrial);
            INFO.valueIS(ThisDocumet,"ANNUAL_INCOME",Basic_info.Monthly_Income);
            ThisDocumet.getElementById("#TABSHEET3").click();       //点到第三页面
            INFO.valueIS(ThisDocumet,"RES_CTY",Basic_info.Country_of_Business);
            INFO.valueIS(ThisDocumet,"REG_CTY",Basic_info.Country_of_Registration);
            INFO.valueIS(ThisDocumet,"CTY_ORI",Basic_info.HO_Register_Country);
            INFO.valueIS(ThisDocumet,"SECTOR",Basic_info.Economic_Type_C);
            INFO.valueIS(ThisDocumet,"INDUS_CN",Basic_info.Economic_Sector);
            INFO.valueIS(ThisDocumet,"INDUS_HK",Basic_info.Sub_Economic_Sector);
        }
    
        this.CustomerContactInformation =function (ThisDocumet,Basic_info){ //联系地址
            INFO.valueIS(ThisDocumet,"ADDR_PRO_CD",Basic_info.Province);
            INFO.valueIS(ThisDocumet,"ADDR_CITY_CD",Basic_info.District);
            INFO.valueIS(ThisDocumet,"ADDR_RGN_CD",Basic_info.Village);
            INFO.valueIS(ThisDocumet,"TELNO",Basic_info.Telephone+INFO.MyRandom(5),0);
        }
        this.ContactPersonInformation = function(ThisDocumet,Basic_info){  //关系人信息
            INFO.valueIS(ThisDocumet,"CON_CNAME",Basic_info.Emergency_Contact_Name_Local);
            INFO.valueIS(ThisDocumet,"CON_ENAME",Basic_info.Emergency_Contact_Name_English);
            INFO.valueIS(ThisDocumet,"TEL_NO2",Basic_info.TelePhone+INFO.MyRandom(5),0);
        } 
    }
    //个人客户新增，基本参数
    function Personal_Customer_Basic_Information_Add(iframeID){
        console.log("Personal_Customer_Basic_Information_Add  OK");
        var timeout11 =  setTimeout(function () {
    
            let ThisDocumet = getNewDocumet();
    
            new Basic_Information_Add().PersonalCustomer(ThisDocumet,CustomerInfo);
            ThisDocumet.getElementById("button_submit").click();//个人提交下一步
            Customer_Information_Menu(iframeID);
    
            clearTimeout(timeout11);
        },INFO.timeout);
    }
    //公司客户新增，基本参数
    function Corporate_Customer_Basic_Information_Add(iframeID){
        console.log("Corporate_Customer_Basic_Information_Add  OK");
        var timeout1 =  setTimeout(function () {
    
            let ThisDocumet = getNewDocumet();
            
            console.log(ThisDocumet);
    
            new Basic_Information_Add().CompanyCustomer(ThisDocumet,CustomerInfo);
            console.log(ThisDocumet.getElementById("button_Next"));
    
            ThisDocumet.getElementById("button_Next").click();//公司提交下一步
    
            Customer_Information_Menu(iframeID);
    
            clearTimeout(timeout1);
        },INFO.timeout);
    } 
    //金融客户新增，基本参数
    function Financial_Institution_Customer_Basic_Information_Add(iframeID){
        console.log("Financial_Institution_Customer_Basic_Information_Add  OK");
        var timeout21 =  setTimeout(function () {
            let ThisDocumet =  getNewDocumet();
            console.log(ThisDocumet);
    
            new Basic_Information_Add().FinancialCustomer(ThisDocumet,CustomerInfo);
            ThisDocumet.getElementById("button_Next").click();//金融提交下一步
    
            Customer_Information_Menu(iframeID);
    
            clearTimeout(timeout21);
        },INFO.timeout);
    }
    function Customer_Information_Menu(iframeID,index = 0){ //基本菜单页面
        Title_top.temp_S = 0 ;
        console.log("Customer_Information_Menu OK");
        var timeout2 =  setTimeout(function () {    
            let ThisDocumet = getNewDocumet();
            console.log(ThisDocumet);
    
            switch(index){
                case 0:
                    ThisDocumet.getElementById("BUTTON12").click(); //地址
                    Customer_Contact_Information_Maintenance(iframeID);
                    break;
                case 1:
                    ThisDocumet.getElementById("BUTTON13").click(); //联系人
                    Contact_Person_Information_Maintenance(iframeID);
                    break;
                case 2:
                    Title_top.temp_S = 12 ;
                    break;
            }
            clearTimeout(timeout2);
        },INFO.timeout);
    }
    function Customer_Contact_Information_Maintenance(iframeID){ //客户联系信息页面
        var timeout3 =  setTimeout(function () {    
            let ThisDocumet = getNewDocumet();
            console.log(ThisDocumet);
            ThisDocumet.getElementsByClassName("fbutton")[1].click();
            Customer_Contact_Information_Maintenance_Add(iframeID);
            clearTimeout(timeout3);
        },INFO.timeout);
    
        function Customer_Contact_Information_Maintenance_Add(iframeID){ //客户地址新增窗口
            var timeout4 =  setTimeout(function () {  
                let ThisDocumet = getNewDocumet();
                console.log(ThisDocumet);
    
                let WindowDocumet = ThisDocumet.getElementById("ifr_in_window").contentWindow.document;
                console.log(WindowDocumet);
                new Basic_Information_Add().CustomerContactInformation(WindowDocumet,CustomerInfo);
                WindowDocumet.getElementById("button_submit").click();  //提交
    
                var temptime = setTimeout(function () {  
                    ThisDocumet.getElementsByClassName("x-tool-close")[0].click();        //关闭窗口
                    INFO.backMenu(ThisDocumet,"left_txt",/0021101/);
                    Customer_Information_Menu(iframeID,1);                                //返回主菜单
                    clearTimeout(temptime);
                },INFO.timeout);
            clearTimeout(timeout4);
            },INFO.timeout);
        }
    }
    function Contact_Person_Information_Maintenance(iframeID){//客户关系人页面
        var timeout5 =  setTimeout(function () {    
            let ThisDocumet = getNewDocumet();
            console.log(ThisDocumet);
            ThisDocumet.getElementsByClassName("fbutton")[1].click(); //点击新增
            
    
            Contact_Person_Information_Maintenance_Add(iframeID);
    
        clearTimeout(timeout5);
        },INFO.timeout);
    
        function Contact_Person_Information_Maintenance_Add(iframeID){
            var timeout6 =  setTimeout(function () {  
                let ThisDocumet = getNewDocumet();
                console.log(ThisDocumet);
    
                let WindowDocumet = ThisDocumet.getElementById("ifr_in_window").contentWindow.document;
                console.log(WindowDocumet);
    
                new Basic_Information_Add().ContactPersonInformation(WindowDocumet,CustomerInfo);
                WindowDocumet.getElementById("button_submit").click(); 
                var temptime =  setTimeout(function () {  
                    ThisDocumet.getElementsByClassName("x-tool-close")[0].click();        //关闭窗口
                    INFO.backMenu(ThisDocumet,"left_txt",/0021101/);
                    Customer_Information_Menu(iframeID,2);                 
    
                clearTimeout(temptime);
                },INFO.timeout); 
    
            clearTimeout(timeout6);
            },INFO.timeout);  
        }
    }
    let quickButton = document.createElement("div"); //一键开户
    {   //样式表
        quickButton.style.height = "26px";
        quickButton.style.width = "120px";
        quickButton.style.marginLeft = "300px";
        quickButton.style.backgroundColor = "red";
        quickButton.style.display = "inline-block";
        quickButton.innerHTML = "一键开户";
        quickButton.iframeID = iframeID;
        quickButton.style.fontSize = "20px";
        quickButton.style.textAlign = "center";
        quickButton.style.borderRadius = "6px";
        quickButton.style.color = "white";
    }
    quickButton.onclick = function(){
        console.log("一键开户");
        let ThisDocumet = 
            document.getElementById(this.iframeID).contentWindow.document;
        console.log(ThisDocumet);
        let type = ThisDocumet.getElementById("CI_TYP").value;
        console.log(type);
        switch(type[0]){
            case "P":
                Title_top.run();
                ThisDocumet.getElementById("button_submit").click();
                Personal_Customer_Basic_Information_Add(this.iframeID); 
                break;
            case "C":
                Title_top.run();
                ThisDocumet.getElementById("button_submit").click();
                Corporate_Customer_Basic_Information_Add(this.iframeID); 
                break; 
            case "F":
                Title_top.run();
                ThisDocumet.getElementById("button_submit").click();
                Financial_Institution_Customer_Basic_Information_Add(this.iframeID); 
                break;   
        }
        // Personal_Customer_Basic_Information_Add(this.iframeID);    //个人客户新增
        // Corporate_Customer_Basic_Information_Add(this.iframeID); //公司客户新增
        // Financial_Institution_Customer_Basic_Information_Add(this.iframeID); //金融客户新增

    }
    let panel2 = ThisDocumet.getElementById("panel2");
    panel2.appendChild(quickButton);
    console.log(ThisDocumet);
    { //临时测试
        // INFO.valueIS(ThisDocumet,"IDTYPE","1003");
        ThisDocumet.getElementById("IDNO").value = "947"+INFO.MyRandom(5);
        // let tmepname = "DOMZ"+INFO.MyRandom(2);
        // INFO.valueIS(ThisDocumet,"ENAME_L",tmepname);
        // INFO.valueIS(ThisDocumet,"CNAME_L",tmepname);
        // INFO.valueIS(ThisDocumet,"OPCITYP","2","2"); //2是快速开户
    }
}

})();