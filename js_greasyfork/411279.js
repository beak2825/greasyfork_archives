// ==UserScript==
// @name        2048快速下种子
// @namespace   Violentmonkey Scripts
// @match       *://*/2048/*
// @grant       GM_setClipboard
// @version     2.9
// @author      -
// @description 2048 4096 打开帖子 自动复制标题 直接下载种子链接 过滤某些贴主 左右键翻页 上键 点击下载链接
// @downloadURL https://update.greasyfork.org/scripts/411279/2048%E5%BF%AB%E9%80%9F%E4%B8%8B%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/411279/2048%E5%BF%AB%E9%80%9F%E4%B8%8B%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==
(function() {
    'use strict';

  function getElementsByClassName(clsName, tagName) {
      var ClassElements = [];
      var selElements = document.getElementsByTagName(tagName);
 
      for (var i = 0; i < selElements.length; i++) {
        if (selElements[i].className == clsName) {
            ClassElements[ClassElements.length] = selElements[i];
        }
      }
      return ClassElements;
    } 
  document.onkeydown=function(event){
            var e = event || window.event ;
            if(e && e.keyCode){
              var span1= getElementsByClassName("pages",'span')[0]
              var aa = span1.getElementsByTagName("a"); 
              
              if(e.keyCode==39){aa[1].click();}
              if(e.keyCode==37){aa[0].click();}
              if(e.keyCode==38){document.getElementById("downloadlink").click();}
			  }
        }
		document.onkeyup=function(event){
			var e = event || window.event ;
            if(e && e.keyCode){

			}
		}

  //获取帖子时间
  var copy
  var spans = document.getElementsByTagName("span")
  for(var i=0,len=spans.length;i<len;i++){
      if  (spans[i].title.search(/2020/i)>-1){
        copy = spans[i].title.split(' ')[0]
      }
    }

   
    
  //复制标题 
  var range = document.createRange();
  var referenceNode = document.getElementById("subject_tpc");
  if (referenceNode !=null){GM_setClipboard((referenceNode.innerText + copy).replace(/\\|\/|:|\*|\?|"|<|>|\|/g,"-")
                                            .replace(/【超清新片速遞】|【超清新片速递】|超清新片速遞】|【無印優品高清原档】|源码高清录制|高清源码录制|【网曝门事件】|【最新国产速递】|【原档超清无水印】|【泄密资源】|【今日推荐】|源码录制|源录制|最源录制/g,"")
                                            .replace(/【AI高清画质2K修复】|【AI高清2K修复】|【AI超清画质4K修复】|【AI高清画质4K修复】/g,"【AI高清】")
                                            .replace(/-MP4/g,"")
                                            .replace(/『|〖|《/g,"【")
                                            .replace(/』|〗|》/g,"】"))}
  //if (referenceNode !=null){GM_setClipboard((referenceNode.innerText + copy).replace(/\\|\/|:|\*|\?|"|<|>|\|/g,"-"))}
  
  
  if (document.getElementById('read_tpc')!=null){
    //1000 页以后自动点下一主题
    

    //var str= document.getElementsByClassName("fl black")
    //console.log(getElementsByClassName("fl black",'b')[0].innerHTML.search(/無印優品/i))
    //console.log(referenceNode.innerText)
    if (getElementsByClassName("fl black",'b')[0].innerText.search(/無印優品/i) ==-1 
        || getElementsByClassName("fl black",'b')[0].innerText.search(/無印優品/i) >-1 
        && referenceNode.innerText.search(/约|探|乔|大叔淦学妹|小宝|9总|午夜|沈先生|B哥|太子|横扫|按摩|KTV|外围|模特|学生|兼职|野狼|上门|小姐|肏|草|操|干|搞|玩|挑|选|颜值/i) ==-1
        || referenceNode.innerText.search(/约|探|乔|大叔淦学妹|小宝|9总|午夜|沈先生|B哥|太子|横扫|按摩|KTV|外围|模特|学生|兼职|野狼|上门|小姐|肏|草|操|干|搞|玩|挑|选|颜值/i) ==-1
        && referenceNode.innerText.search(/震动|按摩器|假|嘘嘘|尿|道具|尿|玩具|跳蛋|抚慰|跳弹|假屌|自慰|少妇|网友|粉丝|炮友/i) >-1
        || referenceNode.innerText.search(/最新流出|户外|破解|剧情|网红|家用|外站|TS|汤不热|CD|电报|女探花|人间水蜜桃|AV|黑人|大黑牛|泄密|嫂子|盗站|同事|留学|小姨子|网曝|农村|老头|老年|乱伦|监控|情侣|野战|百合|推特|的白白|字幕|不见星空|狗花|可馨|姐夫|经典|孕|国外|360|快手|抖音|家庭|MJ|迷奸|迷J|妈妈|儿子|SWAG/i) >-1
       ){
      getElementsByClassName("fn",'a')[0].click()
    }

    

    //替换链接
    var hrefs = document.getElementById('read_tpc').getElementsByTagName("a"); 
    for(var i=len=hrefs.length-1,len=hrefs.length;i<len;i++){
      if  (hrefs[i].href.search(/download/i)>-1){
        hrefs[i].href = hrefs[i].href.replace('http://download.bbcd.tw/list.php?name=','http://download.bbcd.tw/down.php/')+'.torrent';
        hrefs[i].innerHTML = hrefs[i].innerHTML.replace('http://download.bbcd.tw/list.php?name=','http://download.bbcd.tw/down.php/')+'.torrent';
        hrefs[i].target = '_self'
        hrefs[i].id = 'downloadlink'

        var as = document.createElement("a"); 
        as.innerHTML ='<br>'+'【下载网址】: '+hrefs[i].innerHTML
        as.href = hrefs[i].href
        referenceNode.append(as);

        //hrefs[i].click()
      }
    }

    //去除无用描述
    function resizeImage(obj){if(obj.height>100)obj.height=100;if(obj.width>100)obj.width=100; } 
    var str= document.getElementById('read_tpc').getElementsByTagName("span")[0]
    if (str){
      var index1 = str.innerHTML.indexOf('<img')
     str.innerHTML = str.innerHTML.substring(index1).replace(/<br>/g,'').replace("if(this.offsetWidth>'1440')this.width='1440';","if(this.offsetWidth>'200')this.width='200';"); 
    //console.log(str.innerHTML)
    }
    else{
      var str= document.getElementById('read_tpc')   
    var index1 = str.innerHTML.indexOf('<img')
    str.innerHTML = str.innerHTML.substring(index1).replace(/<br>/g,'').replace("if(this.offsetWidth>'1440')this.width='1440';","if(this.offsetWidth>'200')this.width='200';"); 
    
      
    //console.log(str.innerHTML)
    }
  } 
  
  //过滤主题垃圾种子
    function getSize(str){
      var n 
      if (str.search(/M|MB/i)>-1){
        n = Number(str.split('M')[0]) 
      }
      else
        {
          n = Number(str.split('G')[0]) *1000
        }
      return !isNaN(n)&&n
    }
    
  var trs = document.getElementsByTagName('tr'); 
  for (var i = 0; i < trs.length; i++) { 
    if (trs[i].className == 'tr3 t_one') { 
      var sel = trs[i].getElementsByTagName('td'); 
      if (sel.length==4){
      trs[i].style.display='none';
      }
      
      if (sel.length==5 
          && sel[2].innerText.search(/国产专员|優衣庫|hdgc|日落黄昏|罗马教皇|hdgc|avp2p|东华帝君|東方秋白|feixue124|YouKu|soav.|myheroman|zgome|魔火帝皇|豆芽高手|1080fuli/i)>-1
          ||sel[1].innerText.search(
        /TS|CD|电报|女探花|人间水蜜桃|AV|黑人|大黑牛|道具|尿|泄密|嫂子|盗站|网友|粉丝|玩具|同事|留学|小姨子|网曝|农村|老头|老年|跳蛋|狼友|抚慰|泰澳|泰国|越南|老挝|缅甸|乱伦|监控|情侣|野战|炮友|跳弹|百合|假屌|推特/i)>-1
          ||sel[1].innerText.search(
        /的白白|字幕|不见星空|韩国|狗花|可馨|姐夫|经典|孕|国外|360|自慰|快手|抖音|家庭|MJ|迷奸|迷J|妈妈|儿子/i)>-1
          ||getSize(String(sel[1].innerText.split('/')[0].split('[')[2]))<100){
         trs[i].style.display='none';
      }
      else
        {
          //console.log(getSize(String(sel[1].innerText.split('/')[0].split('[')[2])))
        }
      //console.log(sel.length)
    } 
  } 
  
  //过滤搜索结果垃圾种子
  for (var i = 0; i < trs.length; i++) { 
    if (trs[i].className == 'tr3 tac') { 
    var sel = trs[i].getElementsByTagName('td'); 
    //console.log(sel.length)
    if (sel.length==4 && sel[1].innerText.search(/国产专员|優衣庫|hdgc|罗马教皇|日落黄昏|hdgc|avp2p|东华帝君|東方秋白|feixue124|YouKu|soav.|myheroman|zgome|魔火帝皇|豆芽高手|1080fuli/i)>-1){
         trs[i].style.display='none';
    }

    } 
  }
//console.log(navigator.userAgent)
})();
