// ==UserScript==
// @name         自动签到
// @namespace    https://greasyfork.org/zh-CN/scripts/32400-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0
// @version      2018021103
// @description  自用各种签到
// @grant        none
// @include      *.51cto.com/*
// @include      *//jifen.360.cn/*
// @include      *//sign.suning.com/*
// @include      *//bbs.lenovomobile.cn/*
// @include      *//www.hdpfans.com/*
// @include      *//usergrowth.pptv.com/*
// @include      *//www.chaojifan.com/*
// @include      *//www.4k123.com/*
// @include      *//www.banyungong.org/*
// @include      *//www.bazhuayu.com/*
// @include      *//bbs.kafan.cn/*
// @include      *//dawanjia.wan.360.cn/*
// @include      *//wenku.baidu.com/*
// @include      *//www.tvhome.com/*
// @include      *//youqian.360.cn/*
// @include      *//5sing.kugou.com/*
// @include      *//zhidao.baidu.com/*
// @include      *//bbs.le.com/*
// @include      *.qq.com/*
// @include      *//music.163.com/*
// @include      *//trip.taobao.com/*
// @include      *.lu.com/*    
// @include      *//www.lezhuan.com/*
// @include      *//www.wahuasuan.com/*
// @include      *//tieba.baidu.com/*
// @include      *//bbs.yy.com/*
// @include      *//www.yy.com/u/*
// @include      *//vip.yy.com/u/*
// @include      *//www.kaicongyun.com/*
// @include      *//ld.m.jd.com/*
// @include      *//vip.jd.com/*
// @include      *//vip.jr.jd.com/*
// @include      *//jifen.2345.com/*
// @include      *//shouji.2345.com/*
// @include      *//try.jd.com/*
// @include      http://*.feidee.com/*
// @include      http://re.jd.com/*
// @include      *//www.52pojie.cn/home.php*
// @include      *//vip.xunlei.com/*
// @include      *//jinrong.xunlei.com/*
// @include      *//www.chinapyg.com/home.php*
// @include      *//www.jq22.com/myhome
// @include      *//passport.safedog.cn/*           
// @downloadURL https://update.greasyfork.org/scripts/32400/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/32400/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

var wait = 2000;

if(isURL("passport.safedog.cn")){
    setTimeout(function(){      
    document.getElementsByClassName("btn_yellow_a")[0].click();    
	},wait);   
}
if(isURL("passport.safedog.cn")){
    setTimeout(function(){       
    document.getElementsByClassName("btn_blue")[0].click(); 
	},wait);   
}

if(isURL("www.jq22.com/myhome")){
    setTimeout(function(){      
    document.getElementsByClassName("fa fa-pencil-square-o")[0].click();    
	},wait);   
}

if(isURL("vip.xunlei.com")){
    setTimeout(function(){      
    document.getElementsByClassName("btn_red j_licai_left_btn")[0].click();    
	},wait);   
}
if(isURL("jinrong.xunlei.com")){
    setTimeout(function(){      
    document.getElementsByClassName("btn_buy j_hytq_btn")[0].click();    
	},wait);   
}

if(isURL("www.52pojie.cn/home.php")){
    setTimeout(function(){      
    document.getElementsByClassName("qq_bind")[0].click();  
	},wait);   
}

if(isURL("home.51cto.com")){
    setTimeout(function(){      
    document.getElementById('jsSignGetCredits').click();
	},wait);   
}
if(isURL("edu.51cto.com")){
    setTimeout(function(){ 
    document.getElementsByClassName("signtext1")[0].click();    
	},wait);   
}

if(isURL("www.hdpfans.com")){
    setTimeout(function(){      
    document.getElementById('JD_sign').click();
	},wait);   
}

if(isURL("jifen.360.cn")){
    setTimeout(function(){
    document.getElementsByClassName("btn-white js-btn-sign")[0].click();        
	},wait);   
}

if(isURL("sign.suning.com")){
    setTimeout(function(){
    document.getElementsByClassName("starttip")[0].click();        
	},wait);   
}

if(isURL("bbs.lenovomobile.cn")){
    setTimeout(function(){
    userfnbox('checkin');      
	},wait);   
}

if(isURL("www.hdpfans.com")){
    setTimeout(function(){      
    document.getElementById('JD_sign').click();
	},wait);   
}

if(isURL("usergrowth.pptv.com")){
    setTimeout(function(){      
    document.getElementById('qiandao_vuser').click();
	},wait);   
}

if(isURL("www.chaojifan.com")){
    setTimeout(function(){
    bind.sign();
	},wait);   
}

if(isURL("www.4k123.com")){
    setTimeout(function(){      
    document.getElementById('JD_sign').click();
	},wait);   
}

if(isURL("music.163.com")){
    setTimeout(function(){
    document.getElementsByClassName("sign u-btn2 u-btn2-2")[0].click();        
	},wait);   
}

if(isURL("www.banyungong.org")){
    setTimeout(function(){      
    document.getElementById('btnSign').click();
	},wait);   
}

if(isURL("www.bazhuayu.com")){
    setTimeout(function(){      
    document.getElementById('cp_body_Profile_5_Button_QianDao1').click();
	},wait); 
}

if(isURL("bbs.kafan.cn")){
    setTimeout(function(){      
    document.getElementById('pper_a').click();
	},wait);   
}

if(isURL("dawanjia.wan.360.cn")){
    setTimeout(function(){      
    document.getElementById('clockin').click();
	},wait);   
}

if(isURL("wenku.baidu.com")){
    setTimeout(function(){
    document.getElementsByClassName("g-btn g-btn-pass js-signin-btn g-btn-no")[0].click();        
	},wait);   
}

if(isURL("www.tvhome.com")){
    setTimeout(function(){      
    document.getElementById('vsign').click();
	},wait);   
}

if(isURL("youqian.360.cn")){
    setTimeout(function(){
    document.getElementsByClassName("signin")[0].click();        
	},wait);   
}

if(isURL("5sing.kugou.com")){
    setTimeout(function(){
    document.getElementsByClassName("clock_in_txt")[0].click();        
	},wait);   
}

if(isURL("zhidao.baidu.com")){
    setTimeout(function(){
    document.getElementsByClassName("go-sign-in")[0].click();        
	},wait);   
}

if(isURL("bbs.le.com")){
    setTimeout(function(){      
    document.getElementById('sign').click();
	},wait);   
}

if(isURL("rewards.qq.com")){
    setTimeout(function(){
    document.getElementsByClassName("mod_attendance_link")[0].click();   
    document.getElementsByClassName("tick")[0].click();  
	},wait);   
}

if(isURL("trip.taobao.com")){
    setTimeout(function(){
    document.getElementsByClassName("J_mySignInText")[0].click();        
	},wait);   
}

if(isURL("lumi.lu.com")){
    setTimeout(function(){
	document.getElementsByClassName("btn-login")[0].click();
    document.getElementsByClassName("btn-check-in")[0].click();        
    document.getElementById('loginBtn').click();
	},wait);   
}
if(isURL("lumi.lu.com")){
    setTimeout(function(){
    document.getElementsByClassName("btn-check-in")[0].click();        
    document.getElementById('loginBtn').click();
	},wait);   
}
if(isURL("lumi.lu.com")){
    setTimeout(function(){
    document.getElementsByClassName("img-loading")[0].click();        
	},wait);   
}

if(isURL("user.lu.com")){
    setTimeout(function(){
    document.getElementById('loginBtn').click();
	},wait);   
}


if(isURL("www.lezhuan.com")){
    setTimeout(function(){
	document.getElementsByClassName("jiand2_l_tab")[0].click();
	},wait);   
}
if(isURL("www.lezhuan.com")){
    setTimeout(function(){
    signin();      
	},wait);   
}

if(isURL("www.wahuasuan.com")){
    setTimeout(function(){
	document.getElementsByClassName("sign")[0].click();
	},wait);   
}

if(isURL("tieba.baidu.com")){
    setTimeout(function(){
	document.getElementsByClassName("onekey_btn")[0].click();
	},wait);   
}

if(isURL("bbs.yy.com")){
    setTimeout(function(){
	document.getElementsByClassName("ysign-signin")[0].click();
	},wait);   
}

if(isURL("www.yy.com/u")){
    setTimeout(function(){
    document.getElementsByClassName("clickin-btn")[0].click();
    //document.getElementById('checkinBtn').click();
	},wait+500);   
}

if(isURL("www.kaicongyun.com")){
    setTimeout(function(){
    document.getElementById('signtext').click();
	},wait+500);   
}

if(isURL("re.jd.com")){
var url = location.href;
if(url.indexOf("/item/") > 0) {
    var index1 = url.indexOf(".html");
    var index2 = url.lastIndexOf("/", index1);
    location.replace("http://item.jd.com" + url.substring(index2,index1) + ".html");
}
    }
    
if(isURL("feidee.com")){
    if(self.location.protocol == "http:") self.location.replace(self.location.href.replace(/^http/, "https"));   
}
if(isURL("shouji.2345.com")){
    setTimeout(function(){
		every_day_signature();
	},wait);   
}
if(isURL("jifen.2345.com")){
    setTimeout(function(){
		every_day_signature();
	},wait);   
}
if(isURL("vip.jd.com")){
    setTimeout(function(){
    //document.getElementsByClassName("signup-btn")[0].click();
    document.getElementById('checkinBtn').click();
	},wait+500);   
}
if(isURL("http://vip.jr.jd.com/")){
    setTimeout(function(){
		//document.getElementById('qian-btn').click();
          document.getElementsByClassName("qian-text")[0].click();  
	},wait);   
}
if(isURL("try.jd.com")){
    //京东试用
    setTimeout(function(){
		document.getElementById('btn-app').click();
	},wait);
}
if(isURL("ld.m.jd.com")){
    setTimeout(function(){
		document.getElementById('signId').click();
	},wait);   
}
function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
        return true;
    }else{
        return false;
    }
}