// ==UserScript==
// @name 阿里快速设置详情
// @namespace Violentmonkey Scripts
// @match https://detail.1688.com/offer/*
// @match https://detail.1688.com//offer/*
// @match https://item.taobao.com/item.htm*
// @match https://detail.tmall.com/item.htm*
// @grant none
// @description 阿里快速设置详情111

var cl = function(site,speed){ //顺滑滚动【函数】
  return function(){ 
      //alert(444);
      var theSite =  window.pageYOffset ||document.documentElement.scrollTop;
      var Dvalue = theSite - site;
      Dvalue < 0 ? window.scrollBy(0, speed) : window.scrollBy(0, speed*-1);
      if(Math.abs(Dvalue)> speed){setTimeout(cl(site,speed), 10);}
  }
}
//setTimeout(cl, 1500);

var theHref = window.location.href.toString();
if(theHref.indexOf('item.taobao.com')!=-1){
   var btnDom = document.querySelector("#J_Title > h3");//添加保存按钮的DOM
   var newNodeCssText = "width:93px; height:20px;background:#fff;position: absolute;top: -9px;right: 53px;text-align: center;";
   var ZTReg = /(_[1-9]{1}\d{0,1}0x[1-9]{1}\d{0,1}0).*/;
   var SKUReg = /url\((\S*\.(jpg|png|gif))/g;
   
   var mainPicDom = document.querySelector("#J_UlThumb");//主图-DOM
   var SKUPicDom = document.querySelector("#J_isku > div > dl.J_Prop.tb-prop.tb-clear.J_Prop_Color > dd > ul");  //SKU-DOM
   var detailPicDom = document.querySelector("#J_DivItemDesc"); //详情-DOM
  
}else if(theHref.indexOf('detail.tmall.com')!=-1){
   var btnDom = document.querySelector("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1");//添加保存按钮的DOM
   var newNodeCssText = "width:75px; height:20px;background:#fff;position: absolute;top: -9px;right: 14px;";
   var ZTReg = /(_[1-9]{1}\d{0,1}0x[1-9]{1}\d{0,1}0).*/;
   var SKUReg = /url\((\S*\.(jpg|png|gif))/g;
  
   var mainPicDom = document.querySelector("#J_UlThumb");//主图-DOM
   var SKUPicDom = document.querySelector("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-key > div > div > dl.tb-prop.tm-sale-prop.tm-clear.tm-img-prop > dd > ul");  //SKU-DOM
  
   var detailPicDom = document.querySelector("#description"); //详情-DOM
  
}else if(theHref.indexOf('detail.1688.com')!=-1){
  var btnDom = document.querySelector("#mod-detail-hd > div > div.widget-custom.offerdetail_ditto_serviceDesc") || document.querySelector("#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-title.region-takla.ui-sortable.region-horizontal.dsc-version2018-page-fix-header > div.widget-custom.offerdetail_version2018_serviceDesc > div > div");//添加保存按钮的DOM
  //var btnDom = 
  var newNodeCssText = "height:20px;float: right;margin-right:22px;line-height: 24px;color:#dc0084;";
  var ZTReg = /(\.[1-9]{1}\d{0,1}[0-9]{1}x[1-9]{1}\d{0,1}[0-9]{1})/;
  var SKUReg = /src\=\"(\S*\.(jpg|png|gif))/g;
  var SKUReg1 = /data\-lazy\-src\=\"(\S*\.(jpg|png|gif))/g;

  var mainPicDom = document.querySelector("#dt-tab > div > ul");//主图-DOM
  var SKUPicDom = document.querySelector("#mod-detail-bd > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical > div.widget-custom.offerdetail_ditto_purchasing > div > div > div > div.obj-leading > div.obj-content > ul") || document.querySelector("#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical.dsc-version2018-page-fix-content-mid > div.widget-custom.offerdetail_zeroConsign_price > div > div > table > tbody");  //SKU-DOM
  if(!SKUPicDom){
    var SKUPicDom = document.querySelector("#mod-detail-bd > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical > div.widget-custom.offerdetail_ditto_purchasing > div > div > div > div.obj-sku > div.obj-content > table > tbody");
  }  
  if(!SKUPicDom){
    var SKUPicDom = document.querySelector("#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical.dsc-version2018-page-fix-content-mid > div.widget-custom.offerdetail_ditto_purchasing > div > div > div > div.obj-sku > div.obj-content > table > tbody");
  }
  
  var detailPicDom = document.querySelector("#desc-lazyload-container"); //详情-DOM

  
  var reg = /\d{8,20}(?=\.html)/; //正则匹配-11位以上的数字
  var pudId = theHref.match(reg)[0]; 
  //alert(pudId);
  
}else{return false;}

//添加打开按钮  
var newNode = document.createElement("div"); 
newNode.id = "picBtn";
newNode.innerHTML="设置详情页"
newNode.style.cssText = newNodeCssText;
newNode.onclick = function () {//绑定点击事件
  
  //document.body.animate({"scrollTop": "5000px"}, 0); 
  //document.body.animate({"scrollTop": "0px"}, 1500); 
  
  document.getElementById("picAry").style.display = "block";
  
  window.scrollTo(0,2000);
  setTimeout(function(){window.scrollTo(0,5000)},1000);
  //document.body.scrollTop=5000;
  setTimeout(cl(0,100), 1500);
  
  
  
  //添加关闭按钮
  var newNode = document.createElement("div"); 
  newNode.id = "picBtnClose";
  newNode.className = "btnClass";
  newNode.innerHTML="关闭图片"
  newNode.style.cssText = "height:20px;float: right;margin-right:60px;";
  newNode.onclick = function () {
    document.getElementById("picAry").innerHTML = "<div id='btnDom'></div>";
    document.getElementById("picAry").style.display = "none";
  }
  document.getElementById("btnDom").appendChild(newNode);  
  
  
  //添加选择路径按钮
  var newNode = document.createElement("div"); 
  newNode.id = "picBtnPath";
  newNode.className = "btnClass";
  newNode.innerHTML="选择路径";
  newNode.onclick = function () {
    var newNode = document.createElement("a"); 
    newNode.href = "getImg://@file_Path@";
    newNode.click();
  }
  newNode.style.cssText = "height:20px;float: right;margin-right:30px;";
  //newNode.onclick = function () {}
  document.getElementById("btnDom").appendChild(newNode);  
  
  
  //添加打开目录按钮
  var newNode = document.createElement("div"); 
  newNode.id = "openFile";
  newNode.className = "btnClass";
  newNode.innerHTML="打开保存目录";
  newNode.onclick = function () {
    var newNode = document.createElement("a"); 
    newNode.href = "getImg://@openPath@";
    newNode.click();
  }
  newNode.style.cssText = "height:20px;float: right;margin-right:30px;";
  //newNode.onclick = function () {}
  document.getElementById("btnDom").appendChild(newNode);  
  
  //添加保存按钮
  var newNode = document.createElement("div"); 
  newNode.id = "picBtnSave";
  newNode.className = "btnClass";
  newNode.innerHTML="保存图片";
  newNode.style.cssText = "height:20px;float: right;margin-right:30px;";
  newNode.onclick = function () {
    // imgAry = Array.from(document.getElementById("picAry").getElementsByTagName("img")); //获取所有IMG对象，并转为数组
    // var i = 1;
    // var count = imgAry.length;
    // setTimeout(function(){test(i,count,imgAry);},(i+1)*100);
    savePicAll();
    //kkk();
  }
  document.getElementById("btnDom").appendChild(newNode);  
  
  
   //替换详情按钮
  var newNode = document.createElement("div"); 
  newNode.id = "changeInfo";
  newNode.className = "btnClass";
  newNode.innerHTML="替换详情";
  newNode.style.cssText = "height:20px;float: right;margin-right:30px;color: rgb(220, 0, 132);";
  newNode.onclick = function () {
    changeInfoDom();
  }
  document.getElementById("btnDom").appendChild(newNode);  
  
  //添加隐藏的iframe
  var iframe = document.createElement('iframe'); 
  iframe.name="iframeID1";  
  iframe.id="iframeID1"; 
  iframe.style.visibility="hidden";
  //document.getElementById("picAry").appendChild(iframe);

  
  
  //添加增量详情按钮
  var newNode = document.createElement("div"); 
  newNode.id = "infoAddBut";
  newNode.className = "btnClass";
  newNode.innerHTML="标记详情【@已改@】";
  newNode.onclick = function () {
    infoAdd("@已改@");
  }
  newNode.style.cssText = "height:20px;position: absolute; right: 0; top: 220px;background: #fb5353; color: #fff; padding: 5px 10px; padding-left: 16px; border-radius: 15px 0px 0px 15px;";
  //newNode.onclick = function () {}
  document.getElementById("btnDom").appendChild(newNode); 
  
  
  
  //添加增量详情按钮
  var newNode = document.createElement("div"); 
  newNode.id = "infoAddBut";
  newNode.className = "btnClass";
  newNode.innerHTML="标记详情【@已改@部分@】";
  newNode.onclick = function () {
    infoAdd("@已改@部分@");
  }
  newNode.style.cssText = "height:20px;position: absolute; right: 0; top: 260px;background: #4c4cff; color: #fff; padding: 5px 10px; padding-left: 16px; border-radius: 15px 0px 0px 15px;";
  //newNode.onclick = function () {}
  document.getElementById("btnDom").appendChild(newNode); 
  
  
    //添加增量详情按钮
  var newNode = document.createElement("div"); 
  newNode.id = "infoAddBut";
  newNode.className = "btnClass";
  newNode.innerHTML="标记详情【@已检查@】";
  newNode.onclick = function () {
    infoAdd("@已检查@");
  }
  newNode.style.cssText = "height:20px;position: absolute; right: 0; top: 300px;background: rgb(187, 120, 81); color: #fff; padding: 5px 10px; padding-left: 16px; border-radius: 15px 0px 0px 15px;";
  //newNode.onclick = function () {}
  document.getElementById("btnDom").appendChild(newNode); 
  
  
  
  aCount = 1;
  //添加测试按钮
  var newNode = document.createElement("div"); 
  newNode.id = "picBtnSave";
  newNode.innerHTML="测试按钮";
  newNode.style.cssText = "width:75px;height:20px;float: right;margin-right:30px;";
  newNode.onclick = function () {
    
    postImgAry("http://www.baidu.com/",{"wowohaha":"666777"});
     //aAry = document.getElementById("picAry").getElementsByTagName("a"); //获取所有a对象，并转为数组
     
    //setTimeout(function(){newNode.onclick();},3000);
    //aAry[aCount].click();aCount++;
     //setTimeout(function(){aAry[2].click();alert(333);},10000);
     //setTimeout(function(){var aAry = document.getElementById("picAry").getElementsByTagName("a");aAry[aCount].click();aCount++;},(aCount+1)*100);
     //for (var i=1,aCount=1;i<aAry.length;i++){
        //setTimeout(function(){aAry[aCount].click();aCount++;},(aCount+1)*200);
        //setTimeout(function(){var aAry = document.getElementById("picAry").getElementsByTagName("a");aAry[i].click();},(i+1)*100);
     //}
  }
  //document.getElementById("picAry").appendChild(newNode);  
  
  setTimeout(function(){getPic();},1000);
};
//newNode.onclick = '';
btnDom.parentNode.insertBefore(newNode, btnDom.nextSibling);


//添加样式表
var style = document.createElement("style");  //alert(1);
style.appendChild(document.createTextNode(""));  //alert(2);
document.head.appendChild(style);  
styleSheet = style.sheet;    
//styleSheet.insertRule("#picBtn {color:red;}", 1); alert(3);
styleSheet.addRule("body", "transition: 5s;", 0); 
styleSheet.addRule("#picBtn", "cursor: pointer;color:#aaa;", 0); 
styleSheet.addRule("#picBtn:hover", "color:red;", 0);   //alert(4);
styleSheet.addRule("#picAry div.imgBOX", "display: inline-block;width: 160px;text-align: center;margin-bottom: 20px;margin-right: 8px;", 0);
styleSheet.addRule("#picAry img", "width:150px;border:5px solid #eee;margin-right:3px;", 0);
styleSheet.addRule("#picAry img:hover", "border-color:#ffa0a0;", 0);
styleSheet.addRule("#picAry video", "border:5px solid #eee;margin-right: 8px;", 0);
styleSheet.addRule("#picAry video:hover", "border-color:#ffa0a0;", 0);
styleSheet.addRule("#picAry img.save", "border-color:red;", 0);
styleSheet.addRule("#picAry video.save", "border-color:red;", 0);
styleSheet.addRule("#picAry .btnClass", "color:black;cursor: pointer;font-size:15px;", 0);
styleSheet.addRule("#picAry #btnDom", "position: fixed;top: 0;right: 0;background: #ccc; padding: 5px 0; padding-left: 18px; border-radius: 0 0px 0px 15px;", 0);
styleSheet.addRule("#picAry #btnDom div", "padding: 2px 5px;background: #ccc;", 0);
styleSheet.addRule(".table-sku .name", "min-width:190px;line-height: 44px;", 0);
styleSheet.addRule(".table-sku .name .image", "margin-right:5px;", 0);
styleSheet.addRule(".obj-sku .obj-content", "height: 719px; overflow-y: scroll !important; max-height: 200px;width: 530px !important;", 0);
styleSheet.addRule(".obj-sku .obj-header", "width: 50px !important;", 0);
styleSheet.addRule(".table-sku .count", "padding: 0 !important; text-align: left !important;", 0);

styleSheet.addRule("#tipTop", "position: fixed;top:0;left:0;width:100%;height:100%;z-index:99999999999999;", 0);
styleSheet.addRule("#tipTop #tipBg", "width:100%;height: 100%;background: rgba(0, 0, 0, 0.2);text-align: center;position: relative;vertical-align: middle;", 0);
styleSheet.addRule("#tipTop #tipBg:after", "font-size: 0;content: '';height: 100%;display:inline-block;vertical-align: middle;", 0);
styleSheet.addRule("#tipTop #tipBg #tipMain", "background-color: rgba(0, 0, 0, 0.6);background-repeat:no-repeat;border-radius:50px;padding: 0 15px;height:35px;display:inline-block;vertical-align: middle;position: relative;line-height: 35px;color: #fff;background-position: 15px 10px;", 0);
styleSheet.addRule("#tipTop #tipBg #tipMain #tipTxt", "display:inline-block;height:35px;margin-left: 7px;", 0);
styleSheet.addRule("#tipTop #tipBg #tipMain #tipIco", "display:inline-block;width:21px;height:21px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;line-height: 20px;", 0);


styleSheet.addRule("#pop", "position: fixed;top:0;left:0;width:100%;height:100%;z-index:88888888888;", 0);
styleSheet.addRule("#pop #popBg", "width:100%;height: 100%;background: rgba(0, 0, 0, 0.2);text-align: center;position: relative;vertical-align: middle;", 0);
styleSheet.addRule("#pop #popBg:after", "font-size: 0;content: '';height: 100%;display:inline-block;vertical-align: middle;", 0);
styleSheet.addRule("#pop #popBg #popMain", "overflow: hidden; background: #fff;background-repeat:no-repeat;border-radius:50px;display:inline-block;vertical-align: middle;position: relative;color: #fff;background-position: 15px 10px;", 0);

styleSheet.addRule("#changeInfoDom", "padding: 20px 0;height:35px;display:inline-block;vertical-align: middle;position: relative;line-height: 35px;color: #fff;height: 160px; width: 500px; background: #fff;", 0);
styleSheet.addRule("#changeInfoDom input[type='text']", "width:65%;height:30px;box-sizing: border-box; vertical-align:middle;padding:0 5px;", 0);
styleSheet.addRule("#changeInfoDom input[type='button']", "width:15%;height:30px; vertical-align:middle;cursor: pointer;", 0);

styleSheet.addRule("#changeInfoDom #infoDom", "width: 80%; height: 70px; position: relative; text-align: left;margin-top: 10px;display: inline-block;", 0);
styleSheet.addRule("#changeInfoDom .pudImg", "background:#eee;width: 70px; height: 70px; display: inline-block; vertical-align: top;", 0);
styleSheet.addRule("#changeInfoDom .pudTit", "width: 70%;height:22px;background: #eee; display: inline-block; vertical-align: top; margin-left: 10px;color: #000; line-height: 22px; overflow: hidden;padding: 2px 10px;", 0);
styleSheet.addRule("#changeInfoDom #description", "display:none;", 0);

styleSheet.addRule("#changeInfoDom #changeBut", "background: #cecece; color:#fff; display: inline-block;width: 40%; height: 30px; border: none; margin-top: 10px;pointer-events: none;", 0);
styleSheet.addRule("#changeInfoDom #cancelBut", "background: #9c9c9c; color:#fff; display: inline-block;width: 40%; height: 30px; border: none; margin-top: 10px;margin-left:1%;", 0);



//添加总DOM----------------*
var newNode = document.createElement("div"); 
newNode.id = "picAry";
newNode.innerHTML = "<div id='btnDom'></div>";
newNode.style.cssText = "display:none;width:100%; height:20000px;background:#eee;z-index:999999999;position: absolute;top:0;left:0;";
//var allDom = document.querySelector("#doc");
//allDom.parentNode.insertBefore(newNode, allDom.nextSibling);
document.body.appendChild(newNode); 

function postImgAry(URL,PARAMS) {//JS-POST PARAMS格式：{passCode:passCode,whoAry:whoAry}
  var temp = document.createElement("form");
  temp.action = URL;
  temp.target = "iframeID1";
  temp.method = "post";
  temp.style.display = "none";
  for (var x in PARAMS) {
    var opt = document.createElement("textarea");
    opt.name = x;
    opt.value = PARAMS[x];
    // alert(opt.name)
    temp.appendChild(opt);
  }
  document.body.appendChild(temp);
  temp.submit();
  return temp;
}  


function test(i,count,imgAry){
  //alert(i+'--'+imgAry[i].src);
  
  var newNode = document.createElement("a");
  newNode.href = "getImg://@file_Name@图片名称"+i+".jpg@"+imgAry[i].src;
  newNode.style.cssText ="display:block;width:150px;height:20px;background:red;";
  newNode.target="_blank";
  document.getElementById("picAry").appendChild(newNode); 
  //newNode.click();
  
  
  i++;
  i < count ? setTimeout(function(){test(i,count,imgAry);},(i+1)*200) : "";
}
 

function savePic(index,imgSrc){ //保存单个图片【函数】
  //var newNode = document.createElement("a"); 
  //newNode.href = "getImg://@file_Name@图片名称"+index+".jpg@"+imgSrc;
  //newNode.click();
} 


function savePicAll(){ //保存所选图片【函数】

  var allPicUrl = ""; //所有图片总和
  //document.getElementById("picAry").innerhtml = '';
  var videos = document.getElementById("picAry").querySelectorAll('video.save');
  for (i = 0; i < videos.length; i++) {
    allPicUrl += videos[i].src + "@" + videos[i].alt + "|";
  }
  
  var imgs = document.getElementById("picAry").querySelectorAll('img.save');
  for (i = 0; i < imgs.length; i++) {
    allPicUrl += imgs[i].src + "@" + imgs[i].alt + "|";
  }
  if(allPicUrl==""){return false;}
  
  gg ='<form method="POST" action="https://newecho.applinzi.com/即时通讯/PHP获取cookies.php" enctype="multipart/form-data" accept-charset="UTF-8" target="ifr"   style="display: none;">';
  gg +='<label for="name">name:</label><input type="text" id="setPicUrl" name="setPicUrl" value="' + allPicUrl +'"/><br/>';
  gg +='<input type="submit" value="提交" id="toGo"></form>';
  gg +='<iframe name="ifr" id="ifr" style="display: none;"></iframe>';
  var iframeNode = document.createElement("div"); 
  iframeNode.innerHTML = gg;
  document.getElementById("picAry").appendChild(iframeNode);
  document.getElementById("toGo").click();
  
  setTimeout(function () {
        iframeNode.parentNode.removeChild(iframeNode);
    }, 500);

  
  setTimeout(function () {
        var newNode = document.createElement("a"); 
        newNode.href = "getImg://toGetPic";
        newNode.click();
    }, 1000);
  
  
  //alert('777');
  
} 

function getPic(){ //获取图片【函数】
  
  try{
      //主图视频
      if(theHref.indexOf('item.taobao.com')!=-1){ 
        var picVideoSrc = document.querySelector("#ggggg").src;
      }else if(theHref.indexOf('detail.tmall.com')!=-1){ 
        var picVideoSrc = document.querySelector("#J_DetailMeta > div.tm-clear > div.tb-gallery > div.tb-booth > div > div > video > source").src;
      }else if(theHref.indexOf('detail.1688.com')!=-1){
        var picVideoSrc = document.querySelector("#detail-main-video-content > div > video").src;
      }
    
      var newNode = document.createElement("div");
      newNode.id = "picVideo";
      var videoNode = document.createElement("video");
      videoNode.src = picVideoSrc;
      videoNode.className = "save";
      videoNode.alt = "主图视频";
      newNode.style.cssText = "margin-top:40px;overflow: hidden;float:left;";
      videoNode.style.cssText = "height:230px;";
      newNode.appendChild(videoNode);
      document.getElementById("picAry").appendChild(newNode);
      var spanNode = document.createElement("span");
      spanNode.innerHTML = "主图视频";
      spanNode.style.cssText = "display: block; text-align: center;";
      newNode.appendChild(spanNode);
      videoNode.play();
      videoNode.loop="1";
      videoNode.controls = "1";
      videoNode.volume = 0;
      newNode.onclick = function () {clickPic(this);}
      
  }catch(e){}
  
  
  try{
     //详情视频
      if(theHref.indexOf('item.taobao.com')!=-1){ 
        var detailVideoSrc = document.querySelector("#ggggg").src;
      }else if(theHref.indexOf('detail.tmall.com')!=-1){ 
        var detailVideoSrc = document.querySelector("#item-flash > div > video > source").src;
      }else if(theHref.indexOf('detail.1688.com')!=-1){
        var detailVideoSrc = document.querySelector("#offer_video_wrap > div > video").src;
      }
     
      var newNode = document.createElement("div");
      newNode.id = "detailVideo";
      var videoNode = document.createElement("video");
      videoNode.src = detailVideoSrc;
      videoNode.className = "save";
      videoNode.alt = "详情视频";
      newNode.style.cssText = "margin-top:40px;overflow: hidden;float:left;";
      videoNode.style.cssText = "height:230px;";
      newNode.appendChild(videoNode);
      document.getElementById("picAry").appendChild(newNode);
      var spanNode = document.createElement("span");
      spanNode.innerHTML = "详情视频";
      spanNode.style.cssText = "display: block; text-align: center;";
      newNode.appendChild(spanNode);
      videoNode.play();
      videoNode.loop="1";
      videoNode.controls = "1";
      newNode.onclick = function () {clickPic(this);}
      
  }catch(e){}      
      
    
  
  
  
  
  
  var newNode = document.createElement("div"); 
  newNode.id = "mainPicAry";
  newNode.style.cssText = "margin-top:40px;overflow: hidden;";
  document.getElementById("picAry").appendChild(newNode); 
  
  //主图

  var mainPicAry = mainPicDom.getElementsByTagName("img");
  //alert(mainPicAry[1].src);//mainPicAry.length
  for (var i=0;i<6;i++){
    try{
      if(mainPicAry[i].src.indexOf('lazyload.')!=-1) continue;
      var newNode = document.createElement("div");
      newNode.className = "imgBOX";
      newNode.onclick = function () {clickPic(this);}
      var imgSrc = mainPicAry[i].src.replace(ZTReg, ''); 
      var imgName = "主图" + (i+1);
      
      var imgNameLink = "<a href='https://st.weiyunbaba.com/ware/meitueidtview?type=content&wareids="+pudId+"&img_types=2&imgurl="+ imgSrc +"' target='_blank'>"+ imgName+ "</a>";
      //newNode.innerHTML = "<img alt='" + imgName + "' src='" + mainPicAry[i].src.replace(/.60x60/g, '') + "'><span>" + imgName + "</span>";
      newNode.innerHTML = "<img class='save' alt='" + imgName + "' src='" + imgSrc + "'><span>" + imgNameLink + "</span>";
      document.getElementById("mainPicAry").appendChild(newNode); 
      
    }catch(e){}
  }
  //document.getElementById("mainPicAry").appendChild(mainPicAry[0]);
  
  
  
  var newNode = document.createElement("div");
  newNode.style.cssText = "clear:both;";
  document.getElementById("picAry").appendChild(newNode);
  
  
  try{
  
    var newNode = document.createElement("div"); 
    newNode.id = "SKUPicAry";
    newNode.style.cssText = "margin-top:30px;overflow: hidden;";
    document.getElementById("picAry").appendChild(newNode); 


    //SKU图

    SKUPicDom.innerHTML.indexOf('data-lazy-src')!=-1 ? SKUReg=SKUReg1 : '';

    var arr = SKUReg.exec(SKUPicDom.innerHTML);  var f=0;
    while(arr){
      //alert(arr[1]);  
      var newNode = document.createElement("div");
      newNode.className = "imgBOX";
      newNode.onclick = function () {clickPic(this);}
      var imgSrc = arr[1].replace(ZTReg, ''); 
      var imgName = "SKU" + (f+1);
      
      var imgNameLink = "<a href='https://st.weiyunbaba.com/ware/meitueidtview?type=content&wareids="+pudId+"&img_types=2&imgurl="+ imgSrc +"' target='_blank'>"+ imgName+ "</a>";
      newNode.innerHTML = "<img class='save' alt='" + imgName + "' src='" + imgSrc + "'><span>" + imgNameLink + "</span>";
      document.getElementById("SKUPicAry").appendChild(newNode); 
      arr = SKUReg.exec(SKUPicDom.innerHTML);
      f++;
    }

  }catch(e){}    
    
    
  
  var newNode = document.createElement("div"); 
  newNode.id = "detailPicAry";
  newNode.style.cssText = "margin-top:30px;overflow: hidden;";
  document.getElementById("picAry").appendChild(newNode); 
  
  
  //详情图
  setTimeout(function () {
        
        var detailPicAry = detailPicDom.getElementsByTagName("img");
        detailLen = detailPicAry.length;
        for (var i=0;i<detailLen;i++){

          try{
              var newNode = document.createElement("div");
              newNode.className = "imgBOX";
              newNode.onclick = function () {clickPic(this);}
              if(detailPicAry[i].getAttribute("data-lazyload-src")!=null){
                var imgSrc = detailPicAry[i].getAttribute("data-lazyload-src"); 
              }else{var imgSrc = detailPicAry[i].src;}
              var imgName = "详情" + (i+1);
            
              var imgNameLink = "<a href='https://st.weiyunbaba.com/ware/meitueidtview?type=content&wareids="+pudId+"&img_types=2&imgurl="+ imgSrc +"' target='_blank'>"+ imgName+ "</a>";
              newNode.innerHTML = "<img class='save' alt='" + imgName + "' src='" + imgSrc + "'><span>" + imgNameLink + "</span>";
              document.getElementById("detailPicAry").appendChild(newNode); 

            }catch(e){}

        }
    
    }, 2200);
  
  var detailHtml = detailPicDom.innerHTML
  if(detailHtml.indexOf("@已改@") != -1 || detailHtml.indexOf("@已检查@") != -1){
     //显示已改
    var newNode = document.createElement("div"); 
    newNode.id = "hasCheck";
    if(detailHtml.indexOf("@已改@部分@") != -1){
      newNode.innerHTML="@已改@部分@";
    }else if(detailHtml.indexOf("@已检查@") != -1){
      newNode.innerHTML="@已检查@";
    }else{
      newNode.innerHTML="@已改@";
    }
    newNode.style.cssText = "height:20px;position: absolute; left: 20px; top: 0px;background: #2fbb5a; color: #fff; padding: 5px 20px; border-radius: 0px 0px 15px 15px;";
    document.getElementById("picAry").appendChild(newNode); 
  }
  
} 



function clickPic(theDom){ //单击选择图片函数
  var theDom  = theDom.firstChild;
  if(theDom.classList.contains('save')){
    theDom.classList.remove("save");
  }else{
    theDom.classList.add("save");
  }
} 


var whenReady = (function() {               //这个函数返回whenReady()函数
    var funcs = [];             //当获得事件时，要运行的函数
    var ready = false;          //当触发事件处理程序时,切换为true
    
    //当文档就绪时,调用事件处理程序
    function handler(e) {
        if(ready) return;       //确保事件处理程序只完整运行一次
        
        //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
        if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
            return;
        }
        
        //运行所有注册函数
        //注意每次都要计算funcs.length
        //以防这些函数的调用可能会导致注册更多的函数
        for(var i=0; i<funcs.length; i++) {
            funcs[i].call(document);
        }
        //事件处理函数完整执行,切换ready状态, 并移除所有函数
        ready = true;
        funcs = null;
    }
    //为接收到的任何事件注册处理程序
    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', handler, false);
        document.addEventListener('readystatechange', handler, false);            //IE9+
        window.addEventListener('load', handler, false);
    }else if(document.attachEvent) {
        document.attachEvent('onreadystatechange', handler);
        window.attachEvent('onload', handler);
    }
    //返回whenReady()函数
    return function whenReady(fn) {
        if(ready) { fn.call(document); }
        else { funcs.push(fn); }
    }
})();


whenReady(function () {
  if(theHref.indexOf('detail.1688.com')!=-1){
    //设置SKU显示文字
    skuMainDom = document.querySelector("#mod-detail-bd > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical > div.widget-custom.offerdetail_ditto_purchasing > div > div > div > div.obj-sku > div.obj-content > table") || document.querySelector("#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical.dsc-version2018-page-fix-content-mid > div.widget-custom.offerdetail_version2018_purchasing > div > div > div > div.obj-sku > div.obj-content > table");
    var skuDom = skuMainDom.getElementsByTagName("tr");
    for (var i=0;i<skuDom.length;i++){
      try{
        var skuTit = skuDom[i].children[0].children[0].title;
        var newNode = document.createElement("span");
        newNode.innerHTML = skuTit;
        newNode.title = skuTit;
        newNode.style.cssText = 'max-width: 150px; overflow: hidden; display: inline-block; height: 14px; line-height: 14px;';
        skuDom[i].children[0].appendChild(newNode);
        aDom = document.querySelector("#mod-detail-bd > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical > div.widget-custom.offerdetail_ditto_purchasing > div > div > div > div.obj-sku > div.obj-expand > a") || document.querySelector("#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-property.region-takla.ui-sortable.region-vertical.dsc-version2018-page-fix-content-mid > div.widget-custom.offerdetail_version2018_purchasing > div > div > div > div.obj-sku > div.obj-expand > a");
        aDom.click();
      }catch(e){}
    }
  }
  
})





function createXMLHttpRequest(){//创建AJAX对象
  var xmlHttp;
  if(window.ActiveXObject){
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }else if(window.XMLHttpRequest){
    xmlHttp = new XMLHttpRequest();
  }
  return xmlHttp;
}    


function infoAdd(info){ //详情增量请求
     var usermidid = document.getElementById("usermidid").innerHTML;
     tipOpen("标记中，请稍候····");
	   var xmlHttp = createXMLHttpRequest();
     var url="https://newecho.applinzi.com/库存系统-1/1688_Api.php";
     xmlHttp.open("POST",encodeURI(url),true);
     xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'); //与 请求页面 设置相同编码模式【需写在OPEN后面】
     xmlHttp.onreadystatechange = function(){infoAddBack(xmlHttp);};
     xmlHttp.send("shopName="+usermidid+"&pudid="+pudId+"&description="+info);//alert(111);  
        
	}
    
    
function infoAddBack(xmlHttp){ //AJAX-详情增量请求-回调函数
  
  if(xmlHttp.readyState == 4){ 
    if(xmlHttp.status == 200){

      var responseText = xmlHttp.responseText; console.log(responseText);
      if(responseText.indexOf("增加成功") != -1){
        tipOpen(" √ 标记成功",1);
        //alert("增加成功！");
      }else{
        tipOpen(" × 标记失败",3);
      }
    }
  }
}     

function tipOpen(text,time=""){ 
    
    tipClose();
    var tipDom = document.createElement("div"); 
    tipDom.id = "tipTop";
    tipDom.innerHTML='<div id="tipBg"><div id="tipMain"></div></div>';
    document.body.appendChild(tipDom);  
    document.getElementById("tipMain").innerHTML = text;
    time ? setTimeout(function(){tipClose();},time*1000) : '';
  
}

function tipClose(){ 
    try{
      document.getElementById("tipTop").remove();
    }catch(e){}
}

function changeInfoDom(){ 
    changeInfoClose();
    var popDom = document.createElement("div"); 
    popDom.id = "pop";
    infoDom = '<div id="infoDom"><img class="pudImg" id="pudImg"><div class="pudTit" id="pudTit"></div></div>';
    changeButDom = '<input type="button" id="changeBut" value="替换详情"><input type="button" id="cancelBut" value="取消">'
    popDom.innerHTML = '<div id="popBg"><div id="popMain"><div id="changeInfoDom"><input id="getPudInfoTxt" type="text"><input type="button" id="getPudInfoBut" value="获取详情"><div id="description"></div>'+infoDom+changeButDom+'</div></div></div>';
    document.body.appendChild(popDom); 
  
    document.getElementById("getPudInfoBut").onclick = function () {
      getPudInfo();
    }
    document.getElementById("cancelBut").onclick = function () {
      changeInfoClose();
    }
    document.getElementById("changeBut").onclick = function () {
      changePudInfo();
    }
  
}

function changeInfoClose(){ 
    try{
      document.getElementById("pop").remove();
    }catch(e){}
}


function getPudInfo(){ //获取宝贝详情
      
    var reg = /\d{8,20}(?=\.html)/; //正则匹配-11位以上的数字
	  var thePudId = document.getElementById("getPudInfoTxt").value.match(reg)[0]; //alert(pudId);return false;
  
     tipOpen("获取中，请稍候····");
	   var xmlHttp = createXMLHttpRequest();
     var url="https://newecho.applinzi.com/库存系统-1/1688_Api.php";
     xmlHttp.open("POST",encodeURI(url),true);
     xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'); //与 请求页面 设置相同编码模式【需写在OPEN后面】
     xmlHttp.onreadystatechange = function(){getPudInfoBack(xmlHttp);};
     xmlHttp.send("getPudInfo="+thePudId);//alert(111);  
        
}

function getPudInfoBack(xmlHttp){ //AJAX-获取宝贝详情-回调函数
  if(xmlHttp.readyState == 4){ 
    if(xmlHttp.status == 200){
      var responseText = xmlHttp.responseText; //console.log(responseText);
      var jsonObj = JSON.parse(responseText); //将字符串转JSON数组
      if (jsonObj['message'].indexOf("成功") >= 0) {
        tipOpen("获取成功",0.8);
        var data = jsonObj['data'];
        document.getElementById("pudImg").src = "https://cbu01.alicdn.com/" + data['pudPic'];
        document.getElementById("pudTit").innerHTML = data['pudTit'];
        document.getElementById("description").innerHTML = data['description'];
        document.getElementById("changeBut").style.setProperty('pointer-events', 'auto');
        document.getElementById("changeBut").style.setProperty('background', 'green');
        
        if(data['description'].indexOf("@已改@") != -1 || data['description'].indexOf("@已检查@") != -1){ //显示已改
           
          var newNode = document.createElement("div"); 
          //newNode.id = "hasCheck";
          if(data['description'].indexOf("@已改@部分@") != -1){
            newNode.innerHTML="@已改@部分@";
          }else if(data['description'].indexOf("@已检查@") != -1){
            newNode.innerHTML="@已检查@";
          }else{
            newNode.innerHTML="@已改@";
          }
          newNode.style.cssText = "height:20px;position: absolute; left: 82px; bottom: 5px;background: #2fbb5a; color: #fff; padding: 5px 20px; border-radius: 20px;    line-height: 20px;";
          document.getElementById("infoDom").appendChild(newNode); 
        }
        
      }else{
        tipOpen("获取失败",3);
      }
    }
  }
}   


function changePudInfo(){ //替换详情
      
    var reg = /\d{8,20}(?=\.html)/; //正则匹配-11位以上的数字
	  var thePudId = document.getElementById("getPudInfoTxt").value.match(reg)[0];
  
    if (!confirm('确定替换详情？？')) {
      return false;
    }
  
     tipOpen("替换中，请稍候····");
     var usermidid = document.getElementById("usermidid").innerHTML;
	   var xmlHttp = createXMLHttpRequest();
     var url="https://newecho.applinzi.com/库存系统-1/1688_Api.php";
     xmlHttp.open("POST",encodeURI(url),true);
     xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'); //与 请求页面 设置相同编码模式【需写在OPEN后面】
     xmlHttp.onreadystatechange = function(){changePudInfoBack(xmlHttp);};
     xmlHttp.send("shopName="+usermidid+"&changePudInfo="+pudId+"&thePudId="+thePudId);//alert(111);  
        
}


function changePudInfoBack(xmlHttp){ //AJAX-获取宝贝详情-回调函数
  if(xmlHttp.readyState == 4){ 
    if(xmlHttp.status == 200){
      var responseText = xmlHttp.responseText; //console.log(responseText);
      if(responseText.indexOf("替换成功") != -1){
        tipOpen(" √ 替换成功",1);
      }else{
        tipOpen(" × 替换失败",3);
      }
    }
  }
}   



// @version 0.0.1.20200124
// @downloadURL https://update.greasyfork.org/scripts/420648/%E9%98%BF%E9%87%8C%E5%BF%AB%E9%80%9F%E8%AE%BE%E7%BD%AE%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/420648/%E9%98%BF%E9%87%8C%E5%BF%AB%E9%80%9F%E8%AE%BE%E7%BD%AE%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

























