// ==UserScript==
// @name        01BZ小帮手
// @author      Xproject
// @match       *://yydstxt.*/
// @match       *://yydstxt.*/*
// @match       *://yydstxt.*/*.*
// @version     2.0
// @icon        https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png
// @description 菜单键查看功能,下次更新：分页下载文档合并
// @compatible    chrome
// @compatible    firefox
// @grant         none
// @namespace https://greasyfork.org/users/981531
// @downloadURL https://update.greasyfork.org/scripts/454785/01BZ%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454785/01BZ%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==
(function(){
  'use strict';
  /*绕过访问限制*/
  var NewUA='Android';//备用属性 Mozilla/5.0 (Linux;U;Android 12;zh-cn;22021211RC Build/SKQ1.211006.001)
  Object.defineProperty(navigator,'userAgent',{value:NewUA,writable:false});
  
  $(document).ready(function(){
    /*自动登录*/if(document.getElementById("password")!=null){$("input#password").val(1);document.getElementsByTagName("a")[0].click();}
    /*去除遮罩*/$("div:first").removeAttr("style");
  });
  
  /*保存至文档*/function download(){
    var get = 0;/*判断文本获取指标*/
    var WB;/*获取文本内容*/
    if(document.getElementById("chapterinfo")!=null){WB=document.getElementById("chapterinfo").innerHTML;get=1;}
    else if(document.getElementById("chapter")!=null){WB=document.getElementById("chapter").innerHTML;get=2;}
    else if(document.getElementById("ChapterView")!=null){WB=document.getElementById("ChapterView").innerHTML;get=3;}
    if(document.getElementById("ad")!=null){WB=document.getElementById("ad").innerHTML;get=4;}
    if(get!=0){
      WB=ZD(WB);/*使用正则表达式更正文本*/
      var blob = new Blob([WB],{type:"text/plain"});/*设置下载属性*/
      var anchor = document.createElement("a");/*创建链接*/
      anchor.download = "0.txt";/*文档的名称*/
      anchor.href = window.URL.createObjectURL(blob);/*设置链接属性：路径*/
      anchor.target ="_blank";/*设置链接属性：在新窗口中打开*/
      anchor.click();
      document.title = "本页已下载";
      open=false;/*关闭本页下载*/
    }
    else{
      document.title = "下载失败，文本未获取成功！";
    }
  }
  
  /*按键翻页*/if(document.getElementById("password")==null){
    var P_P,N_P;
    if(document.getElementsByClassName("next")[0]==undefined){
      if(document.getElementsByClassName("prePage")[0]!=undefined){
        P_P = document.getElementsByClassName("prePage")[0].getAttribute("href");
      }
      if(document.getElementsByClassName("nextPage")[0]!=undefined){
        N_P = document.getElementsByClassName("nextPage")[0].getAttribute("href");
      }
    }
    else{
      if(document.getElementsByClassName("prev")[0]!=undefined){
        P_P = document.getElementsByClassName("prev")[0].getAttribute("href");
      }
      if(document.getElementsByClassName("next")[0]!=undefined){
        N_P = document.getElementsByClassName("next")[0].getAttribute("href");
      }
      var HJ = $("center.chapterPages").children();
      var YC = HJ.length;
      if(YC!=0){
        var BY = $("a.curr").text();
        BY=BY.replace(/【/,"");BY=BY.replace(/】/,"");
        var P = 0;
        for(let i=0;i<=YC;i++){
          if(i==BY){P = i-1;}
        }
        if(BY>1){P_P = HJ[P-1].getAttribute("href");}
        if(BY<YC){N_P = HJ[P+1].getAttribute("href");}
      }
    }
  }
 var open=true;
  /*按键功能*/
  function TP(){
    var keyCode;
    keyCode = (navigator.appname=="Netscape")?event.which:window.event.keyCode;
    if(keyCode==13&&open==true){download();}
    if(keyCode==37&&P_P!=undefined){window.location.replace(P_P);}
    if(keyCode==39&&N_P!=undefined){window.location.replace(N_P);}
    if(keyCode==93){alert("←和→键切换上下页\n在文章页面点击小键盘回车键可保存");}
  }
  $(document).ready(function(){$('body').keydown(TP);});
  /*正则字典*/
  function ZD(WB){
WB=WB.replace(/&nbsp;/ig,"");
WB=WB.replace(/<\S?br\S?>/ig,"\r\n");
WB=WB.replace(/ o /ig,"");
WB=WB.replace(/\t/ig,"");
WB=WB.replace(/ /ig,"");
WB=WB.replace(/<!--\S+-->/ig,"");
WB=WB.replace(/href="\S+"/ig,"");
WB=WB.replace(/<a>\S+<\/a>/ig,"");
WB=WB.replace(/style="\S+"/ig,"");
WB=WB.replace(/id="[a-zA-Z0-9]{8}"/ig,"");
WB=WB.replace(/class="[a-zA-Z0-9-]+"/ig,"");
WB=WB.replace(/<imgsrc="\/toimg\/data\//ig,"");
WB=WB.replace(/.png"\S?>/ig,"");
WB=WB.replace(/<\S?div>/ig,"");
WB=WB.replace(/<\S?a>/ig,"");
WB=WB.replace(/<\S?span>/ig,"");
WB=WB.replace(/<\S?center>/ig,"");
WB=WB.replace(/<script\S*<\/script>/ig,"");

WB=WB.replace(/&#9829;/ig,"♥");
WB=WB.replace(/&#10084;/ig,"❤");
WB=WB.replace(/0010005960/ig,"下");WB=WB.replace(/0038716011/ig,"裸");WB=WB.replace(/0123303427/ig,"厥");WB=WB.replace(/0188589055/ig,"炸");
WB=WB.replace(/0203769080/ig,"丰");WB=WB.replace(/0230924173/ig,"共");WB=WB.replace(/0277593854/ig,"湿");WB=WB.replace(/0286099622/ig,"美");
WB=WB.replace(/0304558987/ig,"母");WB=WB.replace(/0312005842/ig,"六");WB=WB.replace(/0355171744/ig,"地");WB=WB.replace(/0399680202/ig,"唇");
WB=WB.replace(/0407334288/ig,"涛");WB=WB.replace(/0462284997/ig,"内");WB=WB.replace(/0465229144/ig,"鹏");WB=WB.replace(/0494725103/ig,"证");
WB=WB.replace(/0517159832/ig,"舌");WB=WB.replace(/0528649589/ig,"臀");WB=WB.replace(/0543813166/ig,"兽");WB=WB.replace(/0570562432/ig,"插");
WB=WB.replace(/0587188979/ig,"吟");WB=WB.replace(/0592893886/ig,"穴");WB=WB.replace(/0602771294/ig,"妈");WB=WB.replace(/0665756424/ig,"胸");
WB=WB.replace(/0682651127/ig,"酸");WB=WB.replace(/0692957361/ig,"春");WB=WB.replace(/0744208851/ig,"一");WB=WB.replace(/0744258594/ig,"粉");
WB=WB.replace(/0747467933/ig,"蜜");WB=WB.replace(/0818169035/ig,"挤");WB=WB.replace(/0832215510/ig,"合");WB=WB.replace(/0835270647/ig,"八");
WB=WB.replace(/0851402991/ig,"美");WB=WB.replace(/0855781973/ig,"合");WB=WB.replace(/0894532232/ig,"儿");WB=WB.replace(/0897088508/ig,"粗");
WB=WB.replace(/0899255392/ig,"局");WB=WB.replace(/0902364778/ig,"十");WB=WB.replace(/0902772900/ig,"春");WB=WB.replace(/0902926171/ig,"龟");
WB=WB.replace(/0948398955/ig,"漏");WB=WB.replace(/0951783242/ig,"露");WB=WB.replace(/0965662198/ig,"件");WB=WB.replace(/0978291143/ig,"幼");
WB=WB.replace(/0983658750/ig,"香");WB=WB.replace(/0990372354/ig,"淫");WB=WB.replace(/1007046559/ig,"夫");WB=WB.replace(/1020382214/ig,"三");
WB=WB.replace(/1042838226/ig,"足");WB=WB.replace(/1078667735/ig,"扎");WB=WB.replace(/1090502360/ig,"第");WB=WB.replace(/1128608327/ig,"偷");
WB=WB.replace(/1141551481/ig,"乳");WB=WB.replace(/1164260008/ig,"帮");WB=WB.replace(/1165271020/ig,"暴");WB=WB.replace(/1167260777/ig,"腿");
WB=WB.replace(/1190111324/ig,"第");WB=WB.replace(/1212982941/ig,"最");WB=WB.replace(/1221601598/ig,"二");WB=WB.replace(/1257558943/ig,"容");
WB=WB.replace(/1312563809/ig,"介");WB=WB.replace(/1315163785/ig,"地");WB=WB.replace(/1330289459/ig,"丝");WB=WB.replace(/1341427057/ig,"东");
WB=WB.replace(/1354231266/ig,"指");WB=WB.replace(/1398281412/ig,"棒");WB=WB.replace(/1431765711/ig,"伦");WB=WB.replace(/1461142782/ig,"房");
WB=WB.replace(/1466119857/ig,"弹");WB=WB.replace(/1484832267/ig,"头");WB=WB.replace(/1509162328/ig,"义");WB=WB.replace(/1527556132/ig,"元");
WB=WB.replace(/1605992686/ig,"件");WB=WB.replace(/1613331912/ig,"宰");WB=WB.replace(/1625785675/ig,"帮");WB=WB.replace(/1689714497/ig,"吟");
WB=WB.replace(/1690746609/ig,"义");WB=WB.replace(/1748611635/ig,"炮");WB=WB.replace(/1776326009/ig,"具");WB=WB.replace(/1782567235/ig,"情");
WB=WB.replace(/1790668606/ig,"高");WB=WB.replace(/1809149563/ig,"含");WB=WB.replace(/1834872811/ig,"吟");WB=WB.replace(/1886709496/ig,"粉");
WB=WB.replace(/1901233548/ig,"暴");WB=WB.replace(/1909221781/ig,"毒");WB=WB.replace(/1916417096/ig,"独");WB=WB.replace(/1949866581/ig,"水");
WB=WB.replace(/1957086454/ig,"丰");WB=WB.replace(/1969781516/ig,"一");WB=WB.replace(/1970298383/ig,"处");WB=WB.replace(/1993443364/ig,"亲");
WB=WB.replace(/2038870549/ig,"爱");WB=WB.replace(/2044276277/ig,"精");WB=WB.replace(/2056942298/ig,"巴");WB=WB.replace(/2088765670/ig,"狗");
WB=WB.replace(/2113285564/ig,"死");WB=WB.replace(/2123405327/ig,"八");WB=WB.replace(/2125923322/ig,"东");WB=WB.replace(/2132128883/ig,"菊");
WB=WB.replace(/2159282507/ig,"玉");WB=WB.replace(/2211806946/ig,"人");WB=WB.replace(/2218308069/ig,"未");WB=WB.replace(/2222207117/ig,"嫩");
WB=WB.replace(/2226143209/ig,"蜜");WB=WB.replace(/2279922761/ig,"退");WB=WB.replace(/2333744551/ig,"活");WB=WB.replace(/2347547983/ig,"弹");
WB=WB.replace(/2352694038/ig,"偷");WB=WB.replace(/2378050882/ig,"纪");WB=WB.replace(/2378569828/ig,"共");WB=WB.replace(/2398210818/ig,"射");
WB=WB.replace(/2403603674/ig,"具");WB=WB.replace(/2406299329/ig,"眼");WB=WB.replace(/2444390640/ig,"弟");WB=WB.replace(/2472677945/ig,"马");
WB=WB.replace(/2472759648/ig,"潮");WB=WB.replace(/2479341369/ig,"帮");WB=WB.replace(/2485220834/ig,"童");WB=WB.replace(/2508447790/ig,"骚");
WB=WB.replace(/2522832594/ig,"枪");WB=WB.replace(/2546160883/ig,"上");WB=WB.replace(/2552707218/ig,"死");WB=WB.replace(/2563690011/ig,"麻");
WB=WB.replace(/2623901427/ig,"嫩");WB=WB.replace(/2624694117/ig,"缝");WB=WB.replace(/2628020990/ig,"药");WB=WB.replace(/2641673291/ig,"共");
WB=WB.replace(/2642204389/ig,"处");WB=WB.replace(/2642397267/ig,"狗");WB=WB.replace(/2735853814/ig,"独");WB=WB.replace(/2814245110/ig,"含");
WB=WB.replace(/2846608968/ig,"白");WB=WB.replace(/2857703127/ig,"法");WB=WB.replace(/2876804651/ig,"顶");WB=WB.replace(/2877274169/ig,"辱");
WB=WB.replace(/2885608989/ig,"中");WB=WB.replace(/2886155750/ig,"棒");WB=WB.replace(/2953530793/ig,"花");WB=WB.replace(/2954536573/ig,"杀");
WB=WB.replace(/2968320736/ig,"血");WB=WB.replace(/3027722189/ig,"斩");WB=WB.replace(/3028548732/ig,"逼");WB=WB.replace(/3047720382/ig,"肛");
WB=WB.replace(/3061193484/ig,"人");WB=WB.replace(/3087672465/ig,"五");WB=WB.replace(/3091089594/ig,"流");WB=WB.replace(/3186999824/ig,"棒");
WB=WB.replace(/3205881331/ig,"蛋");WB=WB.replace(/3211393926/ig,"学");WB=WB.replace(/3236560627/ig,"胎");WB=WB.replace(/3269935019/ig,"光");
WB=WB.replace(/3309407590/ig,"咪");WB=WB.replace(/3323959507/ig,"硬");WB=WB.replace(/3332912323/ig,"十");WB=WB.replace(/3390508734/ig,"纪");
WB=WB.replace(/3452829630/ig,"毛");WB=WB.replace(/3462784021/ig,"射");WB=WB.replace(/3473128666/ig,"性");WB=WB.replace(/3511096181/ig,"摇");
WB=WB.replace(/3540936540/ig,"一");WB=WB.replace(/3554203860/ig,"死");WB=WB.replace(/3561353475/ig,"眼");WB=WB.replace(/3573763138/ig,"最");
WB=WB.replace(/3597754944/ig,"缝");WB=WB.replace(/3609388116/ig,"乱");WB=WB.replace(/3672519671/ig,"勃");WB=WB.replace(/3679503296/ig,"轮");
WB=WB.replace(/3684012410/ig,"十");WB=WB.replace(/3691658535/ig,"做");WB=WB.replace(/3697158622/ig,"主");WB=WB.replace(/3720176816/ig,"高");
WB=WB.replace(/3734280203/ig,"毛");WB=WB.replace(/3750225803/ig,"交");WB=WB.replace(/3761170223/ig,"操");WB=WB.replace(/3770724478/ig,"主");
WB=WB.replace(/3774281334/ig,"吸");WB=WB.replace(/3785706613/ig,"四");WB=WB.replace(/3817726133/ig,"最");WB=WB.replace(/3835404789/ig,"大");
WB=WB.replace(/3841393519/ig,"舔");WB=WB.replace(/3851298429/ig,"买");WB=WB.replace(/3887706975/ig,"温");WB=WB.replace(/3895473218/ig,"下");
WB=WB.replace(/3909511071/ig,"枪");WB=WB.replace(/3924123605/ig,"奴");WB=WB.replace(/3928657599/ig,"肉");WB=WB.replace(/3928911332/ig,"甲");
WB=WB.replace(/3955350664/ig,"吞");WB=WB.replace(/3987221833/ig,"穴");WB=WB.replace(/3996916798/ig,"玉");WB=WB.replace(/3997708706/ig,"干");
WB=WB.replace(/4029006589/ig,"辱");WB=WB.replace(/4055228760/ig,"退");WB=WB.replace(/4065205050/ig,"奶");WB=WB.replace(/4072862874/ig,"吞");
WB=WB.replace(/4074851758/ig,"熟");WB=WB.replace(/4080685678/ig,"偷");WB=WB.replace(/4081174270/ig,"件");WB=WB.replace(/4100571969/ig,"地");
WB=WB.replace(/4177639527/ig,"八");WB=WB.replace(/4179250285/ig,"迷");WB=WB.replace(/4190571012/ig,"出");WB=WB.replace(/4199839723/ig,"证");
WB=WB.replace(/4208731327/ig,"未");WB=WB.replace(/4215887283/ig,"温");WB=WB.replace(/4221946546/ig,"裸");WB=WB.replace(/4247282819/ig,"潮");
WB=WB.replace(/4281755712/ig,"凌");WB=WB.replace(/4304523715/ig,"三");WB=WB.replace(/4323477214/ig,"发");WB=WB.replace(/4333336968/ig,"唇");
WB=WB.replace(/4364293920/ig,"公");WB=WB.replace(/4380620349/ig,"私");WB=WB.replace(/4412323691/ig,"虐");WB=WB.replace(/4463549087/ig,"吞");
WB=WB.replace(/4463833256/ig,"逼");WB=WB.replace(/4465328127/ig,"六");WB=WB.replace(/4472105527/ig,"学");WB=WB.replace(/4474051358/ig,"水");
WB=WB.replace(/4500574558/ig,"人");WB=WB.replace(/4574361464/ig,"义");WB=WB.replace(/4594920519/ig,"四");WB=WB.replace(/4598856392/ig,"弟");
WB=WB.replace(/4606314618/ig,"胸");WB=WB.replace(/4608623657/ig,"露");WB=WB.replace(/4609698611/ig,"法");WB=WB.replace(/4633423952/ig,"头");
WB=WB.replace(/4691614404/ig,"漏");WB=WB.replace(/4707263212/ig,"母");WB=WB.replace(/4738148856/ig,"办");WB=WB.replace(/4763085099/ig,"九");
WB=WB.replace(/4808657706/ig,"顶");WB=WB.replace(/4813465063/ig,"炮");WB=WB.replace(/4820521578/ig,"里");WB=WB.replace(/4829671606/ig,"宰");
WB=WB.replace(/4830525755/ig,"潮");WB=WB.replace(/4837206388/ig,"洞");WB=WB.replace(/4847629361/ig,"春");WB=WB.replace(/4870547767/ig,"发");
WB=WB.replace(/4896650341/ig,"色");WB=WB.replace(/4915941086/ig,"西");WB=WB.replace(/4973271227/ig,"呻");WB=WB.replace(/5025986971/ig,"锦");
WB=WB.replace(/5032489262/ig,"搞");WB=WB.replace(/5034321418/ig,"流");WB=WB.replace(/5040723321/ig,"动");WB=WB.replace(/5041330601/ig,"药");
WB=WB.replace(/5050246827/ig,"里");WB=WB.replace(/5061449905/ig,"搞");WB=WB.replace(/5067461841/ig,"菊");WB=WB.replace(/5071472241/ig,"妹");
WB=WB.replace(/5091848517/ig,"幼");WB=WB.replace(/5093089507/ig,"马");WB=WB.replace(/5111229895/ig,"奸");WB=WB.replace(/5117051722/ig,"温");
WB=WB.replace(/5126322372/ig,"硬");WB=WB.replace(/5141468309/ig,"足");WB=WB.replace(/5167141579/ig,"奶");WB=WB.replace(/5174870454/ig,"操");
WB=WB.replace(/5200837531/ig,"干");WB=WB.replace(/5205548090/ig,"泽");WB=WB.replace(/5218315173/ig,"眼");WB=WB.replace(/5219037129/ig,"搞");
WB=WB.replace(/5227025337/ig,"酸");WB=WB.replace(/5241270215/ig,"址");WB=WB.replace(/5242240437/ig,"兽");WB=WB.replace(/5268319798/ig,"房");
WB=WB.replace(/5287671279/ig,"性");WB=WB.replace(/5310232896/ig,"咪");WB=WB.replace(/5314593750/ig,"扎");WB=WB.replace(/5366920169/ig,"干");
WB=WB.replace(/5382174556/ig,"交");WB=WB.replace(/5385687355/ig,"药");WB=WB.replace(/5405095624/ig,"活");WB=WB.replace(/5427613105/ig,"公");
WB=WB.replace(/5446146111/ig,"露");WB=WB.replace(/5473638027/ig,"胎");WB=WB.replace(/5504072831/ig,"裸");WB=WB.replace(/5515430018/ig,"妹");
WB=WB.replace(/5527272297/ig,"乱");WB=WB.replace(/5548249566/ig,"亲");WB=WB.replace(/5554918885/ig,"夫");WB=WB.replace(/5570002531/ig,"粉");
WB=WB.replace(/5618127868/ig,"中");WB=WB.replace(/5637260964/ig,"轮");WB=WB.replace(/5655070942/ig,"奴");WB=WB.replace(/5761080466/ig,"淫");
WB=WB.replace(/5765697086/ig,"爱");WB=WB.replace(/5794932762/ig,"巴");WB=WB.replace(/5797973848/ig,"伦");WB=WB.replace(/5798715549/ig,"山");
WB=WB.replace(/5814392141/ig,"七");WB=WB.replace(/5825662041/ig,"白");WB=WB.replace(/5845812256/ig,"缝");WB=WB.replace(/5847243892/ig,"主");
WB=WB.replace(/5853540975/ig,"浪");WB=WB.replace(/5865212886/ig,"里");WB=WB.replace(/5887114772/ig,"乱");WB=WB.replace(/5896195606/ig,"私");
WB=WB.replace(/5909889921/ig,"伦");WB=WB.replace(/5934682064/ig,"二");WB=WB.replace(/5942653794/ig,"山");WB=WB.replace(/5954911131/ig,"光");
WB=WB.replace(/5958823569/ig,"麻");WB=WB.replace(/5964092977/ig,"上");WB=WB.replace(/5978095077/ig,"腿");WB=WB.replace(/5985086913/ig,"舌");
WB=WB.replace(/6039632604/ig,"湿");WB=WB.replace(/6076847362/ig,"迷");WB=WB.replace(/6077837752/ig,"欲");WB=WB.replace(/6115586454/ig,"吸");
WB=WB.replace(/6143300813/ig,"咪");WB=WB.replace(/6146409280/ig,"粗");WB=WB.replace(/6149826374/ig,"三");WB=WB.replace(/6184831247/ig,"勃");
WB=WB.replace(/6198192490/ig,"童");WB=WB.replace(/6202025318/ig,"代");WB=WB.replace(/6258129695/ig,"欲");WB=WB.replace(/6261439078/ig,"贱");
WB=WB.replace(/6261906167/ig,"布");WB=WB.replace(/6269512667/ig,"天");WB=WB.replace(/6310792342/ig,"阴");WB=WB.replace(/6312544120/ig,"腐");
WB=WB.replace(/6325155879/ig,"奶");WB=WB.replace(/6338842694/ig,"排");WB=WB.replace(/6345580535/ig,"摇");WB=WB.replace(/6347202533/ig,"内");
WB=WB.replace(/6356531709/ig,"排");WB=WB.replace(/6357713966/ig,"阴");WB=WB.replace(/6385481463/ig,"生");WB=WB.replace(/6385714697/ig,"精");
WB=WB.replace(/6534980771/ig,"台");WB=WB.replace(/6546197987/ig,"花");WB=WB.replace(/6581803664/ig,"屁");WB=WB.replace(/6582446880/ig,"插");
WB=WB.replace(/6598183488/ig,"弹");WB=WB.replace(/6602934344/ig,"轮");WB=WB.replace(/6630583610/ig,"白");WB=WB.replace(/6695148880/ig,"美");
WB=WB.replace(/6764978449/ig,"儿");WB=WB.replace(/6800261922/ig,"吸");WB=WB.replace(/6810021581/ig,"熟");WB=WB.replace(/6813919707/ig,"纪");
WB=WB.replace(/6817781912/ig,"高");WB=WB.replace(/6843073930/ig,"指");WB=WB.replace(/6874325047/ig,"操");WB=WB.replace(/6921916056/ig,"龟");
WB=WB.replace(/6942262704/ig,"鸡");WB=WB.replace(/6956001608/ig,"花");WB=WB.replace(/6965515376/ig,"丰");WB=WB.replace(/6972560942/ig,"亲");
WB=WB.replace(/7068856042/ig,"合");WB=WB.replace(/7071132422/ig,"湿");WB=WB.replace(/7075168225/ig,"穴");WB=WB.replace(/7080698327/ig,"炮");
WB=WB.replace(/7084008153/ig,"蜜");WB=WB.replace(/7092415778/ig,"头");WB=WB.replace(/7093253691/ig,"代");WB=WB.replace(/7106060561/ig,"夫");
WB=WB.replace(/7138983218/ig,"摇");WB=WB.replace(/7160038829/ig,"情");WB=WB.replace(/7160647985/ig,"毛");WB=WB.replace(/7177706034/ig,"西");
WB=WB.replace(/7224150395/ig,"布");WB=WB.replace(/7227745529/ig,"奴");WB=WB.replace(/7230561098/ig,"活");WB=WB.replace(/7230730327/ig,"血");
WB=WB.replace(/7270938794/ig,"大");WB=WB.replace(/7334347774/ig,"玉");WB=WB.replace(/7337698464/ig,"宫");WB=WB.replace(/7352867298/ig,"址");
WB=WB.replace(/7354186984/ig,"五");WB=WB.replace(/7366713478/ig,"买");WB=WB.replace(/7373168399/ig,"办");WB=WB.replace(/7390498076/ig,"房");
WB=WB.replace(/7402244018/ig,"宫");WB=WB.replace(/7412915922/ig,"发");WB=WB.replace(/7450445747/ig,"挤");WB=WB.replace(/7454910199/ig,"乳");
WB=WB.replace(/7506204301/ig,"指");WB=WB.replace(/7544658985/ig,"生");WB=WB.replace(/7582804185/ig,"龟");WB=WB.replace(/7614763772/ig,"水");
WB=WB.replace(/7615188907/ig,"天");WB=WB.replace(/7641707176/ig,"甲");WB=WB.replace(/7650648460/ig,"波");WB=WB.replace(/7662722126/ig,"马");
WB=WB.replace(/7666628481/ig,"学");WB=WB.replace(/7691109819/ig,"含");WB=WB.replace(/7756664002/ig,"色");WB=WB.replace(/7801094435/ig,"阴");
WB=WB.replace(/7806997609/ig,"灭");WB=WB.replace(/7808420336/ig,"荡");WB=WB.replace(/7814833369/ig,"荡");WB=WB.replace(/7875951963/ig,"四");
WB=WB.replace(/7880862058/ig,"舔");WB=WB.replace(/7888067492/ig,"动");WB=WB.replace(/7889416076/ig,"五");WB=WB.replace(/7912251525/ig,"舔");
WB=WB.replace(/7950018257/ig,"胸");WB=WB.replace(/7979336243/ig,"丝");WB=WB.replace(/7980237169/ig,"内");WB=WB.replace(/8001980049/ig,"国");
WB=WB.replace(/8019581819/ig,"大");WB=WB.replace(/8023457557/ig,"逼");WB=WB.replace(/8134092417/ig,"容");WB=WB.replace(/8165804057/ig,"母");
WB=WB.replace(/8186728471/ig,"出");WB=WB.replace(/8191231978/ig,"欲");WB=WB.replace(/8202714140/ig,"东");WB=WB.replace(/8208577763/ig,"买");
WB=WB.replace(/8208727967/ig,"奸");WB=WB.replace(/8210855360/ig,"交");WB=WB.replace(/8212084865/ig,"屁");WB=WB.replace(/8240041430/ig,"排");
WB=WB.replace(/8242185966/ig,"动");WB=WB.replace(/8244230680/ig,"独");WB=WB.replace(/8254683485/ig,"嫩");WB=WB.replace(/8285637025/ig,"容");
WB=WB.replace(/8353295295/ig,"暴");WB=WB.replace(/8358388359/ig,"顶");WB=WB.replace(/8370627720/ig,"光");WB=WB.replace(/8371203386/ig,"妈");
WB=WB.replace(/8374219522/ig,"色");WB=WB.replace(/8381351178/ig,"具");WB=WB.replace(/8421964095/ig,"臀");WB=WB.replace(/8431104929/ig,"舌");
WB=WB.replace(/8431794980/ig,"唇");WB=WB.replace(/8443857439/ig,"插");WB=WB.replace(/8454668064/ig,"未");WB=WB.replace(/8457823464/ig,"淫");
WB=WB.replace(/8487710161/ig,"灭");WB=WB.replace(/8500738501/ig,"七");WB=WB.replace(/8519707329/ig,"杀");WB=WB.replace(/8522399281/ig,"妹");
WB=WB.replace(/8554004725/ig,"洞");WB=WB.replace(/8576438185/ig,"童");WB=WB.replace(/8590038166/ig,"酸");WB=WB.replace(/8604758995/ig,"代");
WB=WB.replace(/8605843019/ig,"香");WB=WB.replace(/8620217283/ig,"肉");WB=WB.replace(/8625748415/ig,"熟");WB=WB.replace(/8637348340/ig,"精");
WB=WB.replace(/8650024872/ig,"妈");WB=WB.replace(/8660416328/ig,"做");WB=WB.replace(/8706852605/ig,"流");WB=WB.replace(/8710918821/ig,"办");
WB=WB.replace(/8728327662/ig,"乳");WB=WB.replace(/8735858515/ig,"第");WB=WB.replace(/8739167787/ig,"处");WB=WB.replace(/8770568739/ig,"肉");
WB=WB.replace(/8771907310/ig,"狗");WB=WB.replace(/8773645769/ig,"情");WB=WB.replace(/8774556813/ig,"台");WB=WB.replace(/8779415131/ig,"网");
WB=WB.replace(/8794230418/ig,"法");WB=WB.replace(/8804400892/ig,"上");WB=WB.replace(/8806967364/ig,"奸");WB=WB.replace(/8836471562/ig,"中");
WB=WB.replace(/8838087473/ig,"香");WB=WB.replace(/8963596058/ig,"西");WB=WB.replace(/8986539842/ig,"证");WB=WB.replace(/9030340049/ig,"性");
WB=WB.replace(/9045509252/ig,"挤");WB=WB.replace(/9063255411/ig,"出");WB=WB.replace(/9065740329/ig,"射");WB=WB.replace(/9073248466/ig,"血");
WB=WB.replace(/9075956636/ig,"迷");WB=WB.replace(/9093172577/ig,"胎");WB=WB.replace(/9100236271/ig,"兽");WB=WB.replace(/9102602793/ig,"天");
WB=WB.replace(/9123535704/ig,"洞");WB=WB.replace(/9131928994/ig,"硬");WB=WB.replace(/9144615555/ig,"妇");WB=WB.replace(/9150071773/ig,"爱");
WB=WB.replace(/9209363567/ig,"粗");WB=WB.replace(/9217862382/ig,"宫");WB=WB.replace(/9218945420/ig,"波");WB=WB.replace(/9260450717/ig,"二");
WB=WB.replace(/9261732995/ig,"臀");WB=WB.replace(/9294600366/ig,"巴");WB=WB.replace(/9312787093/ig,"七");WB=WB.replace(/9332720497/ig,"足");
WB=WB.replace(/9350080768/ig,"下");WB=WB.replace(/9364129810/ig,"丁");WB=WB.replace(/9386124353/ig,"儿");WB=WB.replace(/9440082131/ig,"生");
WB=WB.replace(/9465258920/ig,"凌");WB=WB.replace(/9478849035/ig,"波");WB=WB.replace(/9572922210/ig,"布");WB=WB.replace(/9588077975/ig,"幼");
WB=WB.replace(/9633654504/ig,"公");WB=WB.replace(/9652486924/ig,"麻");WB=WB.replace(/9707609372/ig,"丝");WB=WB.replace(/9784824665/ig,"屁");
WB=WB.replace(/9806206863/ig,"做");WB=WB.replace(/9818286580/ig,"扎");WB=WB.replace(/9875422061/ig,"凌");WB=WB.replace(/9884662704/ig,"撸");
WB=WB.replace(/9885014626/ig,"腿");WB=WB.replace(/9942269763/ig,"浪");WB=WB.replace(/9986630664/ig,"漏");WB=WB.replace(/9993921948/ig,"局");
WB=WB.replace(/a85090415a/ig,"日");WB=WB.replace(/b69322714b/ig,"日");WB=WB.replace(/c81498104c/ig,"日");WB=WB.replace(/4602423928/ig,"茎");
WB=WB.replace(/8715410257/ig,"呻");WB=WB.replace(/2733856399/ig,"首");WB=WB.replace(/8899305652/ig,"大");WB=WB.replace(/3620919708/ig,"宰");
WB=WB.replace(/0698278491/ig,"首");WB=WB.replace(/0872283620/ig,"泽");WB=WB.replace(/0689040939/ig,"炸");WB=WB.replace(/1019435523/ig,"胡");
WB=WB.replace(/7645727085/ig,"私");WB=WB.replace(/5844292263/ig,"园");WB=WB.replace(/8406787204/ig,"退");WB=WB.replace(/3187883344/ig,"园");
WB=WB.replace(/5119090656/ig,"灭");WB=WB.replace(/0817898144/ig,"民");WB=WB.replace(/8553796321/ig,"尸");WB=WB.replace(/2116155892/ig,"妇");
WB=WB.replace(/0343310657/ig,"国");WB=WB.replace(/6472284406/ig,"辱");WB=WB.replace(/5118765982/ig,"网");WB=WB.replace(/7279115113/ig,"贱");
WB=WB.replace(/9600739652/ig,"骚");WB=WB.replace(/6187610487/ig,"浪");WB=WB.replace(/7168606002/ig,"鸡");WB=WB.replace(/9293860947/ig,"弟");
WB=WB.replace(/9767114503/ig,"荡");WB=WB.replace(/4378132885/ig,"炸");WB=WB.replace(/7140597939/ig,"蛋");WB=WB.replace(/9574018318/ig,"杀");
WB=WB.replace(/5947611027/ig,"甲");WB=WB.replace(/2836910644/ig,"撸");WB=WB.replace(/8755875442/ig,"秽");WB=WB.replace(/4188337959/ig,"首");
WB=WB.replace(/8377724925/ig,"呻");WB=WB.replace(/7185542494/ig,"胡");WB=WB.replace(/7177895002/ig,"虐");WB=WB.replace(/0665889261/ig,"蛋");
WB=WB.replace(/6834531826/ig,"尿");WB=WB.replace(/2676668403/ig,"虐");WB=WB.replace(/6445315584/ig,"肛");WB=WB.replace(/7118332370/ig,"贱");
WB=WB.replace(/0132292497/ig,"台");WB=WB.replace(/8180918630/ig,"网");WB=WB.replace(/7614765414/ig,"斩");WB=WB.replace(/5738418978/ig,"氓");
WB=WB.replace(/4656222554/ig,"六");WB=WB.replace(/6189237176/ig,"氓");WB=WB.replace(/4654336320/ig,"尿");WB=WB.replace(/1992295418/ig,"尿");
WB=WB.replace(/5412723094/ig,"丁");WB=WB.replace(/4426733800/ig,"秽");WB=WB.replace(/3654555607/ig,"址");WB=WB.replace(/7478986526/ig,"鸡");
WB=WB.replace(/7175324752/ig,"妇");WB=WB.replace(/2105123431/ig,"氓");WB=WB.replace(/9078990437/ig,"席");WB=WB.replace(/9513785378/ig,"胡");
WB=WB.replace(/3534031771/ig,"棍");WB=WB.replace(/5264533408/ig,"园");WB=WB.replace(/3246642373/ig,"国");WB=WB.replace(/4170964036/ig,"民");
WB=WB.replace(/2660141736/ig,"亡");WB=WB.replace(/6695940412/ig,"锦");WB=WB.replace(/6543501150/ig,"局");WB=WB.replace(/9655348333/ig,"妓");
WB=WB.replace(/2610770243/ig,"坑");WB=WB.replace(/0117530724/ig,"棍");WB=WB.replace(/7406513426/ig,"毒");WB=WB.replace(/0774208243/ig,"介");
WB=WB.replace(/9498890427/ig,"菊");WB=WB.replace(/0739597541/ig,"朱");WB=WB.replace(/5947057862/ig,"丁");WB=WB.replace(/2825234303/ig,"版");
WB=WB.replace(/3948875377/ig,"茎");WB=WB.replace(/6092378237/ig,"版");WB=WB.replace(/2757781217/ig,"妓");WB=WB.replace(/8482091824/ig,"江");
WB=WB.replace(/3023538105/ig,"席");WB=WB.replace(/9145127477/ig,"席");WB=WB.replace(/7887536384/ig,"江");WB=WB.replace(/1117966584/ig,"江");
WB=WB.replace(/2453282069/ig,"山");WB=WB.replace(/8294761359/ig,"亡");WB=WB.replace(/2773399424/ig,"九");WB=WB.replace(/7049694563/ig,"坑");
WB=WB.replace(/3926979151/ig,"尸");WB=WB.replace(/1644155001/ig,"腐");WB=WB.replace(/7902010953/ig,"九");WB=WB.replace(/2321223621/ig,"朱");
WB=WB.replace(/2386447352/ig,"毒");WB=WB.replace(/2043405379/ig,"民");WB=WB.replace(/5558441730/ig,"介");WB=WB.replace(/2383311784/ig,"棍");
WB=WB.replace(/6179042850/ig,"尸");WB=WB.replace(/3518213323/ig,"勃");WB=WB.replace(/3326385285/ig,"版");WB=WB.replace(/5287254025/ig,"撸");
WB=WB.replace(/1894022554/ig,"泽");WB=WB.replace(/2148844516/ig,"茎");WB=WB.replace(/1782605261/ig,"漪");WB=WB.replace(/3292843358/ig,"亡");
WB=WB.replace(/2491143861/ig,"元");WB=WB.replace(/8870572165/ig,"秽");WB=WB.replace(/2845054079/ig,"漪");WB=WB.replace(/9934161012/ig,"婊");
WB=WB.replace(/2791601284/ig,"枪");WB=WB.replace(/3891562379/ig,"斩");WB=WB.replace(/9480765147/ig,"厥");WB=WB.replace(/5604308767/ig,"颅");
WB=WB.replace(/2572476976/ig,"涛");WB=WB.replace(/7873389278/ig,"朱");WB=WB.replace(/4852882191/ig,"妊");WB=WB.replace(/2537989817/ig,"党");
WB=WB.replace(/2346301295/ig,"剖");WB=WB.replace(/7971728127/ig,"杜");
//WB=WB.replace(//ig,"");
    return WB;
  }
  /*下次更新位置*/
})();