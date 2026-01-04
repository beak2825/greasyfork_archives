// ==UserScript==
// @name         btnull设置已看
// @namespace    设置已看
// @version      1.0.0
// @description  btnull设置已看，用来找电影
// @author       蓝白社野怪
// @include      *btnull*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.mini.min.js
// @license        GPLv3
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/508782/btnull%E8%AE%BE%E7%BD%AE%E5%B7%B2%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/508782/btnull%E8%AE%BE%E7%BD%AE%E5%B7%B2%E7%9C%8B.meta.js
// ==/UserScript==


// 透明度设置修改下面三个变量：数值越小越透明，1不透明、0完全透明
// ***********************************************************
// 全局：视频封面（已看）：透明度 设定（0.0-1.0）
var opacityIsViewCover = 0.1;
// 全局：未看按钮：透明度 设定（0.0-1.0）
var opacitybtnView = 0.7;
// 全局：已看按钮：透明度 设定（0.0-1.0）
var opacitybtnIsView = 0.3;
// ***********************************************************

// 添加自定义样式
var GM_addStyle = GM_addStyle || function(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.getElementsByTagName("head")[0].appendChild(style);
};



$(document).ready(function() {
    'use strict';

    gateway();
    obServerPicture2();

});

// 方法入口
var gateway = function(){
    setUploadList();
	setVideoIsViewed();
    setBtnView();
}



// 网站的列表，翻页只替换元素，不刷新，无法执行脚本，所以要监听元素变化
var obServerPicture2 = function(){
    // 目标元素
const targetElement = document.querySelector('.content-list');

    // 创建一个MutationObserver实例
const observer = new MutationObserver((mutations) => {
  if(mutations){
      gateway();
  }
});

// 配置观察器
const config = {
  childList: true,
};

// 启动观察器
observer.observe(targetElement, config);
}



// 自定义样式
var staticStyle = `
.btnView{opacity:`+opacitybtnView+`;width:40px;height: 25px;line-height:16px;font-size:12px;text-align:center;cursor:pointer;display:inline-block;position:absolute;right:0;top:0;z-index:2;border:1px solid #999;border-radius:3px;padding:3px 5px;background:#fff;color:black;}
.btnIsView{opacity:`+opacitybtnIsView+`;background:rgba(255,255,255,0.5);}
.btnView:hover{opacity:1;background:#aaa;color:#fff;}
.btnIsView:hover{background:rgba(255,255,255,1);opacity:1;color:#999;}
.btnRefresh{display:inline-block;position:absolute;z-index:1;right:52px;top:18px;background:#fff;border:1px solid #999;border-radius:5px;color:#999;padding:1px 5px;}
.btnRefresh:hover{background:#aaa;color:#fff;}
.btnList{display:inline-block;position:absolute;z-index:1;right:97px;top:18px;background:#fff;border:1px solid #999;border-radius:5px;color:#999;padding:1px 5px;}
.btnList:hover{background:#aaa;color:#fff;}
.btnListSave{display:inline-block;position:absolute;z-index:1;right:170px;top:18px;background:#fff;border:1px solid #999;border-radius:5px;color:#999;padding:1px 5px;display:none;}
.btnListSave:hover{background:#aaa;color:#fff;}
.viewList{width:100%;height:120px;display:none;color:#999;padding:1px 5px;}
/*通用属性*/
.__scale-wrap .btnView{right:unset;width:40px;line-height:16px;}`;

GM_addStyle(staticStyle);

// bvid 影片id，bname 影片名称
var bvid = null;
var bname = null;
// viewGroupArr存影片时间,viewNameGroupArr存影片名称
var viewGroupArr = [];
var viewNameGroupArr = [];
viewGroupArr = GM_getValue("BtnullViewIdList",null);
if(!viewGroupArr)
    viewGroupArr = [];
viewNameGroupArr = GM_getValue("BtnullViewNameList",null);
if(!viewNameGroupArr)
    viewNameGroupArr = [];

// 设置上传按钮
var setUploadList = function(){
    if($("#viewListUpload").length>0)
        return;
    else{
        $(".sort div:first").before("<input type='file' id='viewListUpload' >");
        $("#viewListUpload").bind("change", handleFile);
    }
}

// 读取上传的文件内容
var handleFile = function(e) {
  var nameArray = [];
  var timeArray = [];
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.readAsArrayBuffer(file);
  //reader.readAsText(file,'GB2312');
  reader.onload = function(e) {
    var data = e.target.result;
    /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */

    //var workbook = XLSX.read(data,{ type: "binary", codepage: 936 });
    var workbook = XLSX.read(data);
    var mySheet = workbook.Sheets.Sheet1;
    let s = mySheet['!ref'];
    var sheetHeight = s.slice(s.indexOf(':')+2);
    //循环读取数据
    for(let i = 2;i<=sheetHeight;i++){
        var name = mySheet["A"+i].w;
        var time = null;
        var timecol = mySheet["E"+i];
        if(timecol == undefined){
            time = "0/";
        }else{
            time = timecol.w;
        }

        let a = name.indexOf('/');
        if(a!=-1){
           name = name.slice(0,name.indexOf('/')-1);
        }
        time = time.slice(0,time.indexOf('/'));
        nameArray.unshift(name);
        timeArray.unshift(time);
    }

    // 存储到GM
    GM_setValue("BtnullViewIdList",timeArray);
    GM_setValue("BtnullViewNameList",nameArray);
    alert("上传成功");
  };
}

// 设置封面样式
var setVideoIsViewed = function(){
    // 获取内容列表
    var content_list = $(".content-list li");
    $.each(content_list,function(index,item){
        // 获取封面的 a标签
        var coverObj0 = $(item).find("a")[0];
        var coverObj = $(coverObj0);
 //       bvid = coverObj.attr("href");
 //       bvid = bvid.replace("/mv/","");
        var timeObj = coverObj.parent().next().find("div");
        var text = timeObj.text();
        bvid = text.slice(0,text.indexOf('/')-1);
        bname = coverObj.attr("title");
        // 添加已看/未看按钮、设置封面透明度
        if(getBvIsViewed(bvid,bname)){
            // 已看
            coverObj.before("<button class='btnView btnIsView' data-view='1' data-av='"+bvid+"' data-bname='"+bname+"'>已看</button>");
            coverObj.css("opacity",opacityIsViewCover);
        }else{
            // 未看
            coverObj.before("<button class='btnView btnNotView' data-view='0' data-av='"+bvid+"' data-bname='"+bname+"'>未看</button>");
            coverObj.css("opacity","1");
        }
    });
}

// 判断视频是否已看,判断同年且同名的
var getBvIsViewed = function(bvid,bname){
  bvid = bvid + "";
  bname = bname + "";
  if(!viewNameGroupArr)
      return false;
  for(var i = 0 ; i < viewNameGroupArr.length;i++){
    if(bname == viewNameGroupArr[i] && bvid == viewGroupArr[i]){
      return true;
    }
  }
  return false;
}

// 更新和保存GM本地存储的列表
var saveGMVideoList = function(bvid,bname,isViewed){
  bvid = bvid + "";
  bname = bname + "";
  if(isViewed){
    //列表非空
    if(viewNameGroupArr){
        // 防止没刷新重复插入
        for(let i = 0 ; i < viewNameGroupArr.length ;i++){
            if(viewNameGroupArr[i] == bname && viewGroupArr[i] == bvid){
                return;
            }
        }
    }
    viewGroupArr.unshift(bvid); // 添加新的ID到数组中
    viewNameGroupArr.unshift(bname);
  }else{
    if(!viewNameGroupArr)
        return;
    for(let i = 0 ; i < viewNameGroupArr.length;i++){
      if(viewNameGroupArr[i] == bname && viewGroupArr[i] == bvid){
        viewGroupArr.splice(i,1); // 删除数组上指定位置的数据
        viewNameGroupArr.splice(i,1);
      }
    }
  }
  // 存储到GM
  GM_setValue("BtnullViewIdList",viewGroupArr);
  GM_setValue("BtnullViewNameList",viewNameGroupArr);
}



// 设置已看/未看按钮响应
//var coverItemClass = "img";
var setBtnView = function(){
  $(".btnView").unbind("click").click(function(e){
    var avId = $(this).data("av");
    var view = $(this).data("view");
    var avName = $(this).data("bname");
    var coverObjs = $(this).next();
    // 先读再存（跨页操作）
    // not:类.block-list-item-info-player--img为课堂分区封面上面的播放小图标
    // not:类.cover为热门-全站排行榜的唱片封面
//    var coverObjs = $(this).parent().find(coverItemClass+":not(.block-list-item-info-player--img):not(.cover):first");
    // 已看标志
    var setIsViewed = false;
    if(view == 0){
      // 未看 -> 已看
      setIsViewed = true;
      $(this).text("已看");
      $(this).removeClass("btnNotView");
      $(this).addClass("btnIsView");
      $(this).data("view","1");
      coverObjs.css("opacity",opacityIsViewCover);
    }else{
      // 已看 -> 未看
      $(this).text("未看");
      $(this).removeClass("btnIsView");
      $(this).addClass("btnNotView");
      $(this).data("view","0");
      coverObjs.css("opacity","1");
    }
    // 删除所有按钮
//    $(".btnView").remove();
    // 即时存储
    saveGMVideoList(avId,avName,setIsViewed);
    // 重新读取
//    setMethod();
    return false;
  });
}
