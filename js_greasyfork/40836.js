// ==UserScript==
// @name         Myfcu++(AhKui)
// @description  Change Myfcu menu to tree mode
// @match        https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx*
// @version 0.0.1.20180419171715
// @namespace https://greasyfork.org/users/180920
// @downloadURL https://update.greasyfork.org/scripts/40836/Myfcu%2B%2B%28AhKui%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40836/Myfcu%2B%2B%28AhKui%29.meta.js
// ==/UserScript==
(function (window) {
    "use strict";
    function Apps_maker(){
        //此區可以隨便你改
        //使用 html+=物件 來新增物件
        //
        //addFloder('資料夾名稱','資料夾ID','資料夾網址')
        //資料夾網址是選用的
        //資料夾ID不可重複，他是拿來操作開啟與關閉資料夾用的
        //
        //addItem('功能名稱','屬於哪個資料夾','功能會跳轉的超連結',是否為該資料夾最後功能)
        //屬於哪個資料夾，一定要對應到正確的資料夾
        //不然他就會在奇怪的時候顯示或乾脆不顯示
        //功能會跳轉的連結分成兩種
        //若會跳轉到站內頁面，填寫頁面代碼即可
        //若會跳轉到站外頁面，需填寫完整網址，且會以新分頁開啟連結
        //是否為該資料夾最後功能 只有填寫true會有動作而已
        //目的是把最前面的符號從├ 改成└
    
        let html="";
        html+=addFloder('畢業生專區','Floder1');
        html+=addItem('學位服領取歸還查詢','Floder1','SP8100002');
        html+=addItem('畢業離校流程資訊查詢','Floder1','SP8100003');
        html+=addItem('畢業典禮邀請函通訊資料','Floder1','SP8100004');
        html+=addItem('問卷系統','Floder1','http://survey.fcu.edu.tw/Login.aspx',true);
    
        html+=addFloder('安定就學專區','Floder2');
        html+=addItem('就學貸款線上申請','Floder2','SP4100003');
        html+=addItem('就學優待線上申請','Floder2','SP4100004');
        html+=addItem('弱勢助學線上申請','Floder2','SP4100005');
        html+=addItem('生活學習獎助金申請','Floder2','SP4100006');
        html+=addItem('弱勢學生資格查核結果查詢','Floder2','https://myfcu.fcu.edu.tw/main/S4101/S410106_feered_query.aspx ');
        html+=addItem('校內獎學金','Floder2','SP4100001');
        html+=addItem('校外獎學金','Floder2','SP4100002');
        html+=addItem('學習型兼任服務助理實習記錄','Floder2','SP9000001',true);
    
        html+=addFloder('我的逢甲','Floder3');
        html+=addItem('學生綜合資料卡','Floder3','SP1000001');
        html+=addItem('役男兵役狀況調查','Floder3','SP1100012');
        html+=addItem('Learning Portfolio','Floder3','https://myfcu.fcu.edu.tw/main/S4208/S4208_learningportfolio_ldap.aspx?ItemParam=Learning');
        html+=addItem('家長資訊系統啟動作業','Floder3','SP1100009');
        html+=addItem('NID密碼變更','Floder3','https://netid.fcu.edu.tw/');
        html+=addItem('意見回饋回覆','Floder3','SP1100011',true);
    
        html+=addFloder('學雜費繳費','Floder4');
        html+=addItem('繳費查詢','Floder4','SP1400002');
        html+=addItem('就學貸款線上申請','Floder4','SP4100003');
        html+=addItem('就學優待線上申請','Floder4','SP4100004');
        html+=addItem('學雜費繳費證明申請','Floder4','http://140.134.20.15/stumend/login.do?method=verify');
        html+=addItem('學雜費逾期未繳補單申請','Floder4','http://140.134.20.80/w3000/?ctNode=29423&idPath=10530_29417_29418_29423');
        html+=addItem('國際生繳費補印系統','Floder4','http://140.134.20.80/w3000/PrintEnLogin.aspx');
        html+=addItem('學生會會費繳費申請','Floder4','SP1400006');
        html+=addItem('學雜費繳費收據','Floder4','SP1400007');
        html+=addItem('臺灣銀行學雜費入口網','Floder4','https://school.bot.com.tw/twbank.net/index.aspx?pgid=3');
        html+=addItem('行動e製單','Floder4','https://service202-sds.fcu.edu.tw/tuition/infologin.aspx?ctNode=42171&idPath=10530_29417',true);
    
        html+=addFloder('校園生活與帳務查詢','Floder5');
        html+=addItem('體適能查詢及試算','Floder5','SP3300014');
        html+=addItem('自我健康管理','Floder5','SP2300001');
        html+=addItem('個人帳務查詢','Floder5','SP1000002');
        html+=addItem('撥(付)款明細查詢','Floder5','SP1000003');
        html+=addItem('所得明細查詢','Floder5','SP1000004');
        html+=addItem('各類所得扣繳暨免扣繳憑單','Floder5','SP1000005');
        html+=addItem('銀行帳號維護','Floder5','SP1000006',true);
    
        html+=addFloder('課外活動與生活','Floder6');
        html+=addItem('請假系統','Floder6','SP3800001');
        html+=addItem('獎懲記錄查詢','Floder6','SP4300006');
        html+=addItem('班幹部服務證明','Floder6','SP4300007');
        html+=addItem('校本部機車證抽籤申請','Floder6','https://myfcu.fcu.edu.tw/main/S6222/S6222_motorcycle.aspx');
        html+=addItem('二校區機車證抽籤申請','Floder6','https://myfcu.fcu.edu.tw/main/S6222/S6222_motorcycle_second.aspx');
        html+=addItem('汽車抽籤(博士/進修學士班)','Floder6','SP9600002');
        html+=addItem('外語文檢定成績登錄','Floder6','https://myfcu.fcu.edu.tw/main/S7304/S7304_enscore-ins.aspx');
        html+=addItem('證照上傳系統','Floder6','SP4300002');
        html+=addItem('非社團學習表現成果','Floder6','SP4300003');
        html+=addItem('社團活動護照','Floder6','http://infocenter.fcu.edu.tw/assoc/assoc_login.jsp');
        html+=addItem('志工服務時數登錄','Floder6','http://sdsweb.oit.fcu.edu.tw/stu_VolServ/loginAction.do',true);
    
        html+=addFloder('教務資源','Floder7');
        html+=addItem('教學助理(TA)請益維護','Floder7','SP3300011 ');
        html+=addItem('資電學院主輔學程申請','Floder7','SP2100001');
        html+=addItem('課制學程申請','Floder7','SP2100002');
        html+=addItem('學分學程申請','Floder7','SP2100003');
        html+=addItem('輔系/雙主修申請','Floder7','SP2100004');
        html+=addItem('學分採計申請','Floder7','SP2100005');
        html+=addItem('第二專長課程配當查詢','Floder7','SP2100006');
        html+=addItem('轉系申請及處理進度查詢','Floder7','SP2100007');
        html+=addItem('抵免學分申請','Floder7','SP2200001');
        html+=addItem('抵免學分查詢','Floder7','SP2200002');
        html+=addItem('學習型兼任服務助理媒合','Floder7','http://140.134.20.15/StuWorkerApply/login.jsp?ctNode=14592&idPath=11551_13675');
        html+=addItem('科技部計畫助理出勤','Floder7','SP4200005',true);
    
    
        html+=addFloder('課表與學習平台','Floder8');
        html+=addItem('我的課表','Floder8','SP3200004');
        html+=addItem('iLearn 2.0','Floder8','https://myfcu.fcu.edu.tw/main/S9902/S990203_ilearn2sso_login.aspx ');
        html+=addItem('線上學習測驗平台','Floder8','http://easytest.lib.fcu.edu.tw/ ');
        html+=addItem('教師與TA請益時間查詢','Floder8','SP3300003');
        html+=addItem('教學大綱','Floder8','https://myfcu.fcu.edu.tw/main/S3205/A320501.aspx?appurl=https://service120-sds.fcu.edu.tw/W320104/W320104.aspx@022');
        html+=addItem('考程表','Floder8','SP3300012');
        html+=addItem('補考及缺考資料查詢','Floder8','SP3300015');
        html+=addItem('校際課程交流平台','Floder8','http://www.cttlrc.fcu.edu.tw/Across/SUMA001.aspx');
        html+=addItem('課程檢索系統','Floder8','https://myfcu.fcu.edu.tw/main/coursesearch.aspx?sso');
        html+=addItem('選課系統','Floder8','https://course.fcu.edu.tw/');
        html+=addItem('選課地圖','Floder8','https://myfcu.fcu.edu.tw/main/S3201/S3201_CurriculumMapping_sso.aspx',true);
    
        html+=addFloder('成績及修課進度','Floder9');
        html+=addItem('服務學習修課進度','Floder9','SP3300013');
        html+=addItem('操行分數查詢','Floder9','SP3500004');
        html+=addItem('成績查詢','Floder9','SP3500001');
        html+=addItem('個人修習記錄查詢','Floder9','SP3500002');
        html+=addItem('成績暨證明文件申請','Floder9','https://service120.sds.fcu.edu.tw/w3119/alumnilogin.aspx');
        html+=addItem('形成性評量','Floder9','SP3600001');
        html+=addItem('學生課程學習回饋表','Floder9','SP3600003',true);
    
        html+=addFloder('住宿專區','Floder10');
        html+=addItem('租屋專區','Floder10','https://rent.housefun.com.tw/school/fcu/searchlist.aspx');
        html+=addItem('住宿點名系統','Floder10','SP9500005');
        html+=addItem('宿舍抽籤申請','Floder10','SP9500003');
        html+=addItem('宿舍設備維修業務申請','Floder10','https://myfcu.fcu.edu.tw/main/S4202/S4202_dormRepairList.aspx',true);
    
        html+=addFloder('空間查詢與借用','Floder11');
        html+=addItem('教室借用查詢','Floder11','SP9300001');
        html+=addItem('教室課表查詢','Floder11','SP9300002');
        html+=addItem('積學堂(人創)空間借用','Floder11','https://myfcu.fcu.edu.tw/main/S5672/S5672_learningroom.aspx');
        html+=addItem('圖書館空間借用','Floder11','https://myfcu.fcu.edu.tw/main/S5672/S5672_library.aspx');
        html+=addItem('體育處戶外場地借用','Floder11','https://myfcu.fcu.edu.tw/main/S5672/S5672_sport.aspx',true);
    
        html+=addFloder('學校資源','Floder12');
        html+=addItem('Mymail','Floder12','https://mymail.fcu.edu.tw/');
        html+=addItem('Gomail服務','Floder12','https://myfcu.fcu.edu.tw/main/S9902/gomail.htm');
        html+=addItem('雲端應用程式(CLOUDAPP)','Floder12','https://cloudapp2.fcu.edu.tw/ ');
        html+=addItem('Office365','Floder12','http://www.o365.fcu.edu.tw/ ');
        html+=addItem('校園軟體','Flode12','http://software-bank.fcu.edu.tw/');
        html+=addItem('Sky雲端空間','Floder12','https://sky.fcu.edu.tw/navigate/');
        html+=addItem('法規查詢','Floder12','https://apps.fcu.edu.tw/fculaw/Default.aspx?version=stu');
        html+=addItem('校園新聞','Floder12','SP9400003');
        html+=addItem('座談會公告查詢','Floder128','SP9400004  ');
        html+=addItem('書報攤','Floder12','https://fengchia.sharepoint.com/sites/e-paper/');
        html+=addItem('訪客與活動臨時無線帳號申請','Floder12','https://wifiguest.fcu.edu.tw/guest/GuestregPage.php?_browser=1');
        html+=addItem('學生信件通告','Floder12','SP1100010');
        html+=addItem('失物招領','Floder12','http://www.life.fcu.edu.tw/wSite/lp?ctNode=11025&mp=221101&idPath=11020_11025',true);
    
        return html;
    }
    
    function tree_maker(){
        let html="";
        html+=addFloder('我的逢甲','Floder1','SS100000');
        html+=addItem('學生綜合資料卡','Floder1','SP1000001');
        html+=addItem('役男兵役狀況調查','Floder1','SP1100012');
        html+=addItem('Portfolio','Floder1','https://myfcu.fcu.edu.tw/main/S4208/S4208_learningportfolio_ldap.aspx?ItemParam=Learning');
        html+=addItem('線上學習測驗平台','Floder1','http://easytest.lib.fcu.edu.tw/ ');
        html+=addItem('家長資訊系統啟動作業','Floder1','SP1100009');
        html+=addItem('意見回饋回覆','Floder1','SP1100011',true);
    
        html+=addFloder('課程準備','Floder2','SS300000');
        html+=addItem('教學助理(TA)請益維護','Floder2','SP3300011 ');
        html+=addItem('資電學院主輔學程申請','Floder2','SP2100001');
        html+=addItem('課制學程申請','Floder2','SP2100002');
        html+=addItem('學分學程申請','Floder2','SP2100003');
        html+=addItem('輔系/雙主修申請','Floder2','SP2100004');
        html+=addItem('學分採計申請','Floder2','SP2100005');
        html+=addItem('第二專長課程配當查詢','Floder2','SP2100006');
        html+=addItem('轉系申請及處理進度查詢','Floder2','SP2100007');
        html+=addItem('抵免學分申請','Floder2','SP2200001');
        html+=addItem('抵免學分查詢','Floder2','SP2200002');
        html+=addItem('選課地圖','Floder2','https://myfcu.fcu.edu.tw/main/S3201/S3201_CurriculumMapping_sso.aspx');
        html+=addItem('教學大綱','Floder2','https://myfcu.fcu.edu.tw/main/S3205/A320501.aspx?appurl=https://service120-sds.fcu.edu.tw/W320104/W320104.aspx@022');
        html+=addItem('校際課程交流平台','Floder2','http://www.cttlrc.fcu.edu.tw/Across/SUMA001.aspx');
        html+=addItem('課程檢索系統','Floder2','https://myfcu.fcu.edu.tw/main/coursesearch.aspx?sso',true);
    
        html+=addFloder('課程學習','Floder3','SS200000 ');
        html+=addItem('iLearn 2.0','Floder3','https://myfcu.fcu.edu.tw/main/S9902/S990203_ilearn2sso_login.aspx ');
        html+=addItem('教師與TA請益時間查詢','Floder3','SP3300003');
        html+=addItem('選課系統','Floder3','https://course.fcu.edu.tw/');
        html+=addItem('我的課表','Floder3','SP3200004');
        html+=addItem('學生請假','Floder3','SP3800001');
        html+=addItem('考程表','Floder3','SP3300012');
        html+=addItem('補考及缺考資料查詢','Floder3','SP3300015',true);
    
        html+=addFloder('學習成果','Floder4','SS400000');
        html+=addItem('服務學習修課進度','Floder4','SP3300013');
        html+=addItem('外語文檢定成績登錄','Floder4','https://myfcu.fcu.edu.tw/main/S7304/S7304_enscore-ins.aspx');
        html+=addItem('證照上傳系統','Floder4','SP4300002');
        html+=addItem('非社團學習表現成果','Floder4','SP4300003');
        html+=addItem('操行分數查詢','Floder4','SP3500004');
        html+=addItem('成績查詢','Floder4','SP3500001');
        html+=addItem('個人修習記錄查詢','Floder4','SP3500002');
        html+=addItem('成績暨證明文件申請','Floder4','https://service120.sds.fcu.edu.tw/w3119/alumnilogin.aspx');
        html+=addItem('形成性評量','Floder4','SP3600001');
        html+=addItem('學生課程學習回饋表','Floder4','SP3600003',true);
    
        html+=addFloder('獎助資訊','Floder5','SS500000');
        html+=addItem('弱勢學生資格查核結果查詢','Floder5','https://myfcu.fcu.edu.tw/main/S4101/S410106_feered_query.aspx ');
        html+=addItem('校內獎學金','Floder5','SP4100001');
        html+=addItem('校外獎學金','Floder5','SP4100002');
        html+=addItem('就學貸款線上申請','Floder5','SP4100003');
        html+=addItem('就學優待線上申請','Floder5','SP4100004');
        html+=addItem('弱勢助學線上申請','Floder5','SP4100005');
        html+=addItem('生活學習獎助金申請','Floder5','SP4100006');
        html+=addItem('成績暨證明文件申請','Floder5','https://service120.sds.fcu.edu.tw/w3119/alumnilogin.aspx');
        html+=addItem('學習型兼任服務助理媒合','Floder5','http://140.134.20.15/StuWorkerApply/login.jsp?ctNode=14592&idPath=11551_13675');
        html+=addItem('科技部計畫助理出勤','Floder5','SP4200005',true);
    
        html+=addFloder('系統設定','Floder6','SS700000');
        html+=addItem('密碼變更(NID)','Floder6','https://netid.fcu.edu.tw/',true);
    
        html+=addFloder('畢業資訊','Floder7','SS800000');
        html+=addItem('學位服領取歸還查詢','Floder7','SP8100002');
        html+=addItem('畢業離校流程資訊查詢','Floder7','SP8100003');
        html+=addItem('畢業典禮邀請函通訊資料','Floder7','SP8100004');
        html+=addItem('問卷系統','Floder7','http://survey.fcu.edu.tw/Login.aspx',true);
    
        html+=addFloder('學校資源','Floder8','SS910000');
        html+=addItem('Mymail','Floder8','https://mymail.fcu.edu.tw/');
        html+=addItem('Gomail服務','Floder8','https://myfcu.fcu.edu.tw/main/S9902/gomail.htm');
        html+=addItem('雲端應用程式(CLOUDAPP)','Floder8','https://cloudapp2.fcu.edu.tw/ ');
        html+=addItem('Office365','Floder8','http://www.o365.fcu.edu.tw/ ');
        html+=addItem('校園軟體','Flode8','http://software-bank.fcu.edu.tw/');
        html+=addItem('Sky雲端空間','Floder8','https://sky.fcu.edu.tw/navigate/');
        html+=addItem('教室借用查詢','Floder8','SP9300001');
        html+=addItem('教室課表查詢','Floder8','SP9300002');
        html+=addItem('空間借用','Floder8','SP9300003 ');
        html+=addItem('法規查詢','Floder8','https://apps.fcu.edu.tw/fculaw/Default.aspx?version=stu');
        html+=addItem('校園新聞','Floder8','SP9400003');
        html+=addItem('座談會公告查詢','Floder8','SP9400004  ');
        html+=addItem('書報攤','Floder8','https://fengchia.sharepoint.com/sites/e-paper/');
        html+=addItem('訪客與活動臨時無線帳號申請','Floder8','https://wifiguest.fcu.edu.tw/guest/GuestregPage.php?_browser=1');
        html+=addItem('學生信件通告','Floder8','SP1100010');
        html+=addItem('失物招領','Floder8','http://www.life.fcu.edu.tw/wSite/lp?ctNode=11025&mp=221101&idPath=11020_11025',true);
    
        html+=addFloder('校園生活','Floder9','SS920000');
        html+=addItem('體適能查詢及試算','Floder9','SP3300014');
        html+=addItem('自我健康管理','Floder9','SP2300001');
        html+=addItem('校本部機車證抽籤申請','Floder9','https://myfcu.fcu.edu.tw/main/S6222/S6222_motorcycle.aspx');
        html+=addItem('二校區機車證抽籤申請','Floder9','https://myfcu.fcu.edu.tw/main/S6222/S6222_motorcycle_second.aspx');
        html+=addItem('汽車抽籤(博士/進修學士班)','Floder9','SP9600002');
        html+=addItem('學雜費繳費收據','Floder9','SP1400007');
        html+=addItem('臺灣銀行學雜費入口網','Floder9','https://school.bot.com.tw/twbank.net/index.aspx?pgid=3');
        html+=addItem('繳費查詢','Floder9','SP1400002');
        html+=addItem('學雜費繳費證明申請','Floder9','http://140.134.20.15/stumend/login.do?method=verify');
        html+=addItem('學雜費逾期未繳補單申請','Floder9','http://140.134.20.80/w3000/?ctNode=29423&idPath=10530_29417_29418_29423');
        html+=addItem('國際生繳費補印系統','Floder9','http://140.134.20.80/w3000/PrintEnLogin.aspx');
        html+=addItem('學生會會費繳費申請','Floder9','SP1400006');
        html+=addItem('個人帳務查詢','Floder9','SP1000002');
        html+=addItem('撥(付)款明細查詢','Floder9','SP1000003');
        html+=addItem('所得明細查詢','Floder9','SP1000004');
        html+=addItem('各類所得扣繳暨免扣繳憑單','Floder9','SP1000005');
        html+=addItem('銀行帳號維護','Floder9','SP1000006');
        html+=addItem('行動e製單','Floder9','https://service202-sds.fcu.edu.tw/tuition/infologin.aspx?ctNode=42171&idPath=10530_29417');
        html+=addItem('社團活動護照','Floder9','http://infocenter.fcu.edu.tw/assoc/assoc_login.jsp');
        html+=addItem('志工服務時數登錄','Floder9','http://sdsweb.oit.fcu.edu.tw/stu_VolServ/loginAction.do');
        html+=addItem('獎懲記錄查詢','Floder9','SP4300006');
        html+=addItem('班幹部服務證明','Floder9','SP4300007');
        html+=addItem('租屋專區','Floder9','https://rent.housefun.com.tw/school/fcu/searchlist.aspx');
        html+=addItem('宿舍抽籤申請','Floder9','SP9500003');
        html+=addItem('宿舍設備維修業務申請','Floder9','https://myfcu.fcu.edu.tw/main/S4202/S4202_dormRepairList.aspx ');
        html+=addItem('住宿點名系統','Floder9','SP9500005');
        html+=addItem('學習型兼任服務助理實習記錄','Floder9','SP9000001',true);
    
        return html;
    }
    
    function addItem(name,FloderID,url,end){
        var outURL=true;
        if(url.substr(0,2)=='SP'){
            url="https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx#/prog/"+url;
            outURL=false;
        }
        let html="<div class='"+FloderID+"'style='width:270px;height:23px;display:none;'";
        if(outURL==false){
            html+="onClick='hideMenu(1)'";
        }
        else{
            html+="onClick='hideMenu(0)'";
        }
        html+=">&nbsp;&nbsp;";
        if(end==true)html+="└";
        else html+="├";
        html+="<a href='"+url+"' style='color:black;'";
        if(outURL==true){
            html+=' target="_blank" ';
        }
        html+=">&nbsp;&nbsp;"+name+"</a></div>";
        return html;
    }
    
    function addFloder(name,ElementID,url){
        if(url==null){
            return "<div style='width:270px;'><a href='javascript: function(){return false;}' onclick=OpenClose('"+ElementID+"')>"+
                "<img id="+ElementID+" src='https://visualpharm.com/assets/889/Folder-595b40b65ba036ed117d40dd.svg' width='25' height='25'>"+
                "</a>"+name+"</div>";
        }
        else{
            return "<div style='width:270px;'><a href='javascript: function(){return false;}' onclick=OpenClose('"+ElementID+"')>"+
                "<img id="+ElementID+" src='https://visualpharm.com/assets/889/Folder-595b40b65ba036ed117d40dd.svg' width='25' height='25'>"+
                "</a><a href=https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx#/subs/"+url+" style='color:black;'>"+name+"</a></div>";
        }
    
    }
    
    function changeView(){
        var index = document.getElementById('MenuType').selectedIndex;
        var menu =document.getElementById('menu');
        if(index==0){
            menu.innerHTML=oreign_macker();
            menu.style.height='auto';
            menu.style.overflow='';
        }
        else if(index==1){
            menu.innerHTML=tree_maker();
            setMenuHeight();
        }
        else if(index==2){
            menu.innerHTML=Apps_maker();
            setMenuHeight();
        }
    }
    
    function block_maker(r,g,b,txt,url){
        return '<!-- ngRepeat: item in mainCtrl.menudata.tree track by item.id -->'+
                            '<a href="https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx#/subs/'+url+'"><div ng-repeat="item in mainCtrl.menudata.tree track by item.id" ng-hide="mainCtrl.isAgentMode1" class="ng-scope">'+
                                '<div style="width:85px" align="center">'+
                                    "<div class=\"icon-block text ng-binding\" ng-click=\"mainCtrl.goSubs(item.id)\" ng-style=\"{'background-color':'#'+item.color}\" style=\"background-color: rgb("+r+','+g+', '+b+');">'+txt+
                                    "</div>"+
                                "</div>"+
                            "</div></a><!-- end ngRepeat: item in mainCtrl.menudata.tree track by item.id -->";
    }
    
    function oreign_macker(){
        let html='';
        html+=block_maker(193,64,64,'我的逢甲','SS100000');
        html+=block_maker(163,201,74,'課程準備','SS300000');
        html+=block_maker(95,144,176,'課程學習','SS200000');
        html+=block_maker(243,136,128,'學習成果','SS400000');
        html+=block_maker(27,172,227,'獎助資訊','SS500000');
        html+=block_maker(103,243,223,'系統設定','SS700000');
        html+=block_maker(247,176,50,'畢業資訊','SS800000');
        html+=block_maker(142,136,180,'學校資源','SS910000');
        html+=block_maker(109,208,205,'校園生活','SS920000');
        return html;
    }
    
    function OpenClose(ElementID){
        let img=document.getElementById(ElementID);
        let menu = document.getElementById('menu');
        if(img.src=="https://visualpharm.com/assets/889/Folder-595b40b65ba036ed117d40dd.svg"){//view->hide
            img.src="https://visualpharm.com/assets/479/Open-595b40b85ba036ed117da75e.svg";
            var items=document.getElementsByClassName(ElementID);
            totalShowItem+=items.length;
            for(let i=0;i<items.length;i++){
                items[i].style.display='block';
            }
        }
        else{
            img.src="https://visualpharm.com/assets/889/Folder-595b40b65ba036ed117d40dd.svg";
            let items=document.getElementsByClassName(ElementID);
            totalShowItem-=items.length;
            for(let i=0;i<items.length;i++){
                items[i].style.display='none';
            }
        }
        setMenuHeight();
    }
    function setMenuHeight(){
        let menuHeight = 360+totalShowItem*23;
        let menu = document.getElementById('menu');
        let index = document.getElementById('MenuType').selectedIndex;
        if(menuHeight>document.body.clientHeight*0.75&&index!=0){
            menu.style.height=document.body.clientHeight*0.75+'px';
            menu.style.overflow='scroll';
            menu.style.overflowX='hidden';
        }
        else{
            menu.style.height='auto';
            menu.style.overflow='';
        }
    }
    function hideMenu(OpenAlert){
        var menu = document.getElementsByClassName('ng-binding div-Balloon')[0];
        menu.setAttribute("class","ng-binding div-Balloon div-Balloon-hide");
        if(OpenAlert==1){
            Alert('頁面載入中...');
        }
    }
    function Alert(str) {
        var msgw,msgh,bordercolor;
        msgw=350;//提示窗口的宽度
        msgh=100;//提示窗口的高度
        let titleheight=25 //提示窗口标题高度
        bordercolor="#666";//提示窗口的边框颜色
        let titlecolor="#BCD";//提示窗口的标题颜色
        var sWidth,sHeight;
        //获取当前窗口尺寸
        sWidth = document.body.offsetWidth;
        sHeight = document.body.offsetHeight;
    //    //背景div
        var bgObj=document.createElement("div");
        bgObj.setAttribute('id','alertbgDiv');
        bgObj.style.position="absolute";
        bgObj.style.top="0";
        bgObj.style.background="#FFF";
        bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
        bgObj.style.opacity="0.6";
        bgObj.style.left="0";
        bgObj.style.width = sWidth + "px";
        bgObj.style.height = sHeight + "px";
        bgObj.style.zIndex = "10000";
        document.body.appendChild(bgObj);
        //创建提示窗口的div
        var msgObj = document.createElement("div")
        msgObj.setAttribute("id","alertmsgDiv");
        msgObj.setAttribute("align","center");
        msgObj.style.background="white";
        msgObj.style.border="1px solid " + bordercolor;
        msgObj.style.position = "absolute";
        msgObj.style.left = "50%";
        msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
        //窗口距离左侧和顶端的距离
        msgObj.style.marginLeft = "-225px";
        //窗口被卷去的高+（屏幕可用工作区高/2）-150
        msgObj.style.top = document.body.scrollTop+(window.screen.availHeight/2)-150 +"px";
        msgObj.style.width = msgw + "px";
        msgObj.style.height = msgh + "px";
        msgObj.style.textAlign = "center";
        msgObj.style.lineHeight ="25px";
        msgObj.style.zIndex = "10001";
        document.body.appendChild(msgObj);
        //提示信息标题
        var title=document.createElement("h4");
        title.setAttribute("id","alertmsgTitle");
        title.setAttribute("align","left");
        title.style.margin="0";
        title.style.padding="3px";
        title.style.background = "#D1E9F7";
        title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
        title.style.opacity="0.75";
        title.style.border="1px solid " + bordercolor;
        title.style.height="18px";
        title.style.font="12px Verdana, Geneva, Arial, Helvetica, sans-serif";
        title.style.color="black";
        title.innerHTML="提示信息!";
        document.getElementById("alertmsgDiv").appendChild(title);
        //提示信息
        var txt = document.createElement("p");
        txt.setAttribute("id","msgTxt");
        txt.style.margin="16px 0";
        txt.innerHTML = str;
        document.getElementById("alertmsgDiv").appendChild(txt);
    }
    function closewin() {
        document.body.removeChild(document.getElementById("alertbgDiv"));
        document.getElementById("alertmsgDiv").removeChild(document.getElementById("alertmsgTitle"));
        document.body.removeChild(document.getElementById("alertmsgDiv"));
    }
    function waitLoad(){
        closewin();
    }
    function waitLoad3(){
        document.getElementById('main').onload=waitLoad;
    }
    function waitLoad2(){
        setTimeout(function(){ waitLoad3(); },3000);
    }
    function start(){
        let place= document.getElementsByClassName('div-Balloon')[0];
        var menu=place.children[3];
        menu.setAttribute('id','menu');
    
    
        var select = document.createElement('select');
        select.setAttribute("id", "MenuType");
        /*select.setAttribute('onChange','window.changeView');*/
    
        var option=document.createElement('option');
        option.setAttribute('value','官方版');
        option.innerHTML='官方版';
        select.appendChild(option);
    
        option = document.createElement('option');
        option.setAttribute('value','樹狀版');
        option.innerHTML='樹狀版';
        select.appendChild(option);
    
        option = document.createElement('option');
        option.setAttribute('value','Fcu Apps');
        option.innerHTML='Fcu Apps';
        select.appendChild(option);
    
        var div=document.createElement('span');
        div.setAttribute('style','width: 135px; display: inline-block;');
    
        place.insertBefore(div,place.children[2]);
        place.insertBefore(select,place.children[3]);
        /*
        let script = document.createElement('script');
        script.setAttribute("type", "application/javascript");
        let AllScript = changeView.toString()+'\n'+oreign_macker.toString()+'\n'+block_maker.toString();
        AllScript+='\n'+tree_maker.toString()+'\n'+addFloder.toString()+'\n'+OpenClose.toString();
        AllScript+='\n'+addItem.toString()+'\n'+Apps_maker.toString()+'\n'+hideMenu.toString();
        AllScript+='\nvar totalShowItem=0;\n'+setMenuHeight.toString()+'document.getElementsByTagName("BODY")[0].onresize = function() {setMenuHeight()};window.onload=waitLoad2;';
        AllScript+='\n'+waitLoad.toString()+waitLoad2.toString()+waitLoad3.toString()+closewin.toString()+Alert.toString();
        script.textContent = AllScript;
        document.body.appendChild(script);
        //*/
        $("#MenuType").change(function(){
            changeView();
        })
    }


    var totalShowItem=0;
    function init(){
        $(".barbtn").click(function(){
            console.log(this)
        })
        console.log('loaded');
        start()
    }
    window.addEventListener('load', init);
})(window);