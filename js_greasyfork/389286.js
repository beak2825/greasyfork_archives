// ==UserScript==
// @name 素素站鸡排辅助
// @namespace zzsoft.susutool
// @version	  0.0.3
// @description 素素站-坐骑和宠物标记
// @author zzsoft
// @match https://tools.ffxiv.cn/lajipai/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/389286/%E7%B4%A0%E7%B4%A0%E7%AB%99%E9%B8%A1%E6%8E%92%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/389286/%E7%B4%A0%E7%B4%A0%E7%AB%99%E9%B8%A1%E6%8E%92%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
// 
window.__copy_text_to_clipboard__ = true;
var key="_zz_own";
var owns={};
var pageno=0;
var namecache="";


//加载数据
loadData();
//初始化
init();
//检查是否坐骑或宠物页面
checkPage();


function init()
{
  //导出按钮
  $('<a class="" href="#" style="font-size: 9px;padding: 0;color: #444;position:absolute;top:5px;left:5px">导出</a>')
    .appendTo('#top')
    .on('click',function(){
        copyToClip($('#_zz_local')[0]);
        alert("已复制到剪贴板~");
      });
  
  //导入按钮
  $('<a class="" href="#" style="font-size: 9px;padding: 0;color: #444;position:absolute;top:25px;left:5px">导入</a>')
    .appendTo('#top')
    .on('click',function(){
        var o=$("#_zz_local");
        if (o.attr("size")==1)
        {
          o.attr("size",100).css({background:"#fff"});
          $(this).html("粘贴后点这里");          
        }       
        else
        {
          localStorage[key]=o.val();
          location.replace("/");
        }
      });
  
  //导出导入用文本框
  $('<input type="text" id="_zz_local" size="1" style="background: #333;color: #333;position:absolute;top:45px;left:5px">')
    .appendTo('#top')
    .val(JSON.stringify(owns));
}

function copyToClip(o)
{
    o.select();
    document.execCommand('copy');
    o.blur();
}

function checkPage()
{  
  //
  if ($("a.btn").length==0)
    {
      setTimeout(checkPage,300);   
      return;
    }
  $(document).on("contextmenu","a.btn",function(){        
     toggleOwn(this);        
     return false;
  });
  checkPageNo();  
}

function checkPageNo()
{
  //当前页号
  var pagenow=$("a.on").text();
  if(pagenow!=pageno)
    {
      pageno=pagenow;
      showOwn();      
    }
  setTimeout(checkPageNo,300);
}

function checkGameCmd()
{
  //文本控件已存在 或 容器不存在
  if ($("#_zz_gmcmd").length>0 || $("#page_item_right").length==0)
  {        
    setTimeout(checkGameCmd,500);
    return;
  }
  
  //目标名称是否就是当前的
  var tname=$("#page_item_right p:first").text();
  if (tname==namecache)
  {    
    setTimeout(checkGameCmd,500);
    return;
  }
  else
  {
    namecache=tname;
  }
  
  //插入文本框
  var cmd="/"+ $("#page_itemtop li p").text()+" ";
  $("<input type='text' id='_zz_gmcmd' style='height:20px;color:#333;background:#333'>")
    .val(cmd+tname)
    .appendTo("#page_item_right");
  
 
  //注册复制事件
  $("#page_item_right p:first")
    .css("cursor","pointer")
    .on("click",function()
        {
          copyToClip($("#_zz_gmcmd")[0]);
        });
  
  
  setTimeout(checkGameCmd,500);
}

function showOwn()
{
  $("a.btn").each(function(i,o){
      var id=getId($(o));
      if(owns[id]==1)
        {
          $(o).css("opacity",0.2);
        }
  });
  checkGameCmd();
}

function loadData()
{
  var jstr=localStorage[key];
  if (jstr==undefined || jstr==""){return;}
  owns=JSON.parse(jstr);
}

function saveData()
{
  var jstr=JSON.stringify(owns);
  $("#_zz_local").val(jstr);
  localStorage[key]=jstr;
}

function getId(o)
{
  var u=o.find("img").attr("src");
  var aaa=u.indexOf(".");
  var bbb=u.lastIndexOf("/")
  return u.substr(bbb+1,aaa-bbb-1);
}

function toggleOwn(o)
{
  o=$(o);
  console.log("toggleOwn-start");
  var opa=o.css("opacity");
  var id=getId(o);
  
  if (opa=""||opa>=1)
    {
      o.css("opacity",0.2);
      owns[id]=1;
    }
  else
    {
      o.css("opacity","");
      delete owns[id];
    }
  saveData();
  console.log("toggleOwn-end");
}