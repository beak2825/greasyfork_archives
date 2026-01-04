// ==UserScript==
// @name         悬浮吧!知识库
// @namespace    armstrong@fanruan.com
// @version      2.3.8.3
// @description  POM-2419,大力感谢LeoYuan提供的fastapi接口~
// @author       Armstrong
// @match        http://knowledge.fanruan.com/*
// @grant        none
// @exclude      http://knowledge.fanruan.com/comment-*
// @downloadURL https://update.greasyfork.org/scripts/430276/%E6%82%AC%E6%B5%AE%E5%90%A7%21%E7%9F%A5%E8%AF%86%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/430276/%E6%82%AC%E6%B5%AE%E5%90%A7%21%E7%9F%A5%E8%AF%86%E5%BA%93.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    //
  window.waitForAddedNode = function(params) {
    const observer = new MutationObserver(mutations => {
      const matched = [];
      for (const { addedNodes }
           of mutations) {
        for (const n of addedNodes) {
          if (!n.tagName) continue;
          if (n.matches(params.selector)) {
            matched.push(n);
          } else if (n.firstElementChild) {
            matched.push(...n.querySelectorAll(params.selector));
          }
        }
      }
      const smatched = [...new Set(matched)]
      if (smatched && params.once) this.disconnect();
      for (const el of smatched) {
        params.done(el);
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  }

window.addCss = function(cssString) {
    const head = document.getElementsByTagName('head')[0];
    const newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }

  function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }



 const up_down_Css=`.upup {
    height: 20px;
    background: url(http://119.3.134.63/examples/up.png) left no-repeat;
    background-size: 32px 32px;
    padding: 6px 34px 6px 36px;
    cursor:pointer;}

    .downdown {
    height: 20px;
    background: url(http://119.3.134.63/examples/down.png) left no-repeat;
    background-size: 32px 32px;
    padding: 6px 34px 6px 36px;
    cursor:pointer;
}`

const mainCss=`
a.bug-link:link{color:royalblue;}
a.bug-link:visited{color:pink;}
a.bug-link:hover{color:turquoise;}
a.bug-link:active{color:SkyBlue;}
.myyesorno{
    font: 400 12px helvetica,arial,verdana,tahoma,sans-serif;
    font-family: PingFangSC-Regular;
    margin: 0;
    border: 0;
    list-style: none;
    font-style: normal;
    font-weight: normal;
    -webkit-text-size-adjust: none;
    height: 42px;
    font-size: 14px;
    color: #334356;
    padding: 10px 0 0 0;
    position: relative;
    border-bottom: none;
    background-color: #FFFFFF;
}
.myyes:hover {
    background-image: url(http://knowledge.fanruan.com/view/help2019/images/yes_hover.png);
    cursor: pointer;
}
.myyes {
    height: 20px;
    background: url(http://knowledge.fanruan.com/view/help2019/images/yes.png) left no-repeat;
    background-size: 32px 32px;
    padding: 6px 34px 6px 36px;
}
.mybrowse:hover {
    background-image: url(http://knowledge.fanruan.com/view/help2019/images/browse_hover.png);
    cursor: pointer;
}

.mybrowse {
    height: 20px;
    background: url(http://knowledge.fanruan.com/view/help2019/images/browse.png) left no-repeat;
    background-size: 32px 32px;
    padding: 6px 34px 6px 36px;
}
`

window.addCss(up_down_Css)
window.addCss(mainCss)

var wid=$('#doc-body').css("width") //悬浮块的宽度用Body宽度
var left=$('#api-tree').css("width") //悬浮块的左边距用目录树的宽度
var username=$('.wenhou a').eq(0).text() //获取用户名
console.log("用户名:"+username)

var flo='<div id="float-help" style="position: fixed; width: '+wid+'; bottom: 0px; left: '+left+'; border-top: 1px solid rgb(233, 237, 241); z-index: 250; box-shadow: rgba(29, 29, 31, 0.1) 0px -2px 4px;"></div>'
var choice=`<div class="myyesorno" id="yesorno" style="padding-left: 40px;"> <ul>
<li style="float:left"><div class="yes" id="myes"  name="float-help"><b>有帮助</b></div></li>
<li style="float:left"><div class="browse" name="say"><b>评论</b></div></li>
<li style="float:left"><div class="upup" name="up"><b>回到顶端</b></div></li>
<li style="float:left"><div class="downdown" name="down"><b>下拉到底</b></div></li>
<li style="float:left"><b>当前推荐文档:</b><a name="recommend" href="http://knowledge.fanruan.com/doc-view-7389.html" target='_blank'>平台日志和解决方案汇总</a><label id="rec_des">这是一段文字</label></li>
</ul></div>`
var say='<div id="my-comment" style="background-color:white"><li><textarea id="say-something" name="say-something" rows="5" cols="95" placeholder="如果你发现了文档错误或有文档改进建议等均可留言"></textarea><input name="button" style="height:20%;width:10%" type="button" onclick="fabiao()" value="发表" class="btnyy"></input></li></div>'
var bug_list='<li><div id="before" style="width:'+wid+';left:'+left+'"></div></li>'
    window.waitForAddedNode({
    selector: '#Quater_bar .nav ul li a',
    recursive: false,
    done: $("#Quater_bar .nav ul li,#zmr").click(function(){
       var click_title=$(this).children("a").text()
       var click_url=$(this).children("a").attr("href")
       var click_source=window.location.href=="http://knowledge.fanruan.com/"?"首页":Number(window.location.href.replace("http://knowledge.fanruan.com/doc-view-","").replace(".html",""))
       var detail='{"source":"'+click_source+'","title":"'+click_title+'","url":"'+click_url+'","des":null}'
       var name=$('.wenhou a').text()
       maidian(name,"up-click",detail)
    })
  });//给上方内容添加埋点功能
var realname=username.toLowerCase()=="armstrong"?"jasmine.wang":username.toLowerCase()
if(window.location.href=="http://knowledge.fanruan.com/")
{
  console.log("首页打开")
  setTimeout(function(){
    var newTab='<div>&nbsp;</div><div id="zmr"><a style="font-size:16px;font-family:PingFangSC-Regular" target="_blank" href="http://knowledge.fanruan.com/index.php?search-fulltext-title-%E5%85%B3%E9%94%AE%E8%AF%8D1%E3%80%81%E5%85%B3%E9%94%AE%E8%AF%8D2" title="全面查询">全面查询</a></div>'
    $('#Quater_bar').append(newTab)
    $('.shouye_left1_left').eq(1).append("<div style=\"padding-left:0;color:red;font-color:red;font-weight:bold\"><p>搜索技巧:中文词语可以用、或者空格连接(英文用空格)，即可实现多关键词查询功能~例如搜索：填报、失败；另:报错堆栈会直接分词搜索,无需手动分词</p></div>")
},1000)
    window.waitForAddedNode({
    selector: '.doctiltop.clr',
    recursive: false,
    done: occur
  });
  $('.x-tree-node-el.x-tree-node-leaf').click(function(){
    window.waitForAddedNode({
    selector: '.doctiltop.clr',
    recursive: false,
    done: occur
  });
  })
  }
else if(window.location.href.indexOf("index.php")!=-1)//在搜索页
{
//加个提示
$(".search_text").attr("placeholder","搜索技巧:中文词语可以用、或者空格连接(英文用空格)，即可实现多关键词查询功能~例如搜索：填报、失败 or 填报 失败;另:报错堆栈会直接分词搜索,无需手动分词");
$(".result_search").after("<div style=\"padding-left:15%;color:yellow;font-color:yellow;font-weight:bold;height:1px\"><p>搜索技巧:中文词语可以用、或者空格连接(英文用空格)，即可实现多关键词查询功能~例如搜索：填报、失败 or 填报 失败;另:报错堆栈会直接分词搜索,无需手动分词</p></div>")
 var originString=$('#search-box').attr("value")
  var inputString=originString.replace(/\s+/g,"、");
  var testString=originString.replace(/\s+/g,"").replace(/\u3001+/g,"")
  if (/^[\u4e00-\u9fa5]+$/i.test(testString)) {
    if(originString.match(/[\u4e00-\u9fa5]+/g).length==1)
  {
   inputString=inputString.replace(/\.+/g,"、");
  }
  }else{
    if(originString.match(/[\w.]+/g).length==1)
  {
   inputString=inputString.replace(/\.+/g,"、");
  }
  }
  window.originInput=inputString
  //如果有搜索结果，添加下一个Tab
if($('.nsmsg').length==0)
  {
    $('li:contains("全部")').hide()
var new_search='<li id="search_report" style="color:#F00078;background-color:#BBFFFF;font-weight:bold" class="null">三线问题查询</li><li id="search_other" style="color:yellow;background-color:#00BB00;font-weight:bold" class="null">其他内容查询</li>'
$('.search_tab li').eq(0).after(new_search)
$('li.null span:hidden').parent().remove()
$('li span:hidden').parent().remove()
$('#search_report').click(function(){
$('.search_tab li').removeClass("choose")
$(this).addClass("choose")
$("#all").hide();
$("#fr").hide();
$("#bi").hide();
$("#knowledge").hide();
$("#rec").hide();
$("#sea1").hide()
setTimeout(function(){$("#fenye").hide()},200)
    var sea='<div id="sea" style="display:block"></div>'
if($('#sea').length==0)
{$("#knowledge").after(sea)}
else {$('#sea').show()}
var make_width_1=Number($('.search_tab').css("width").replace("px",""))*1.2
var rand_value=new Date().getSeconds()%4
//var viewlet_array=["join_search.cpt","join_search_i.cpt","join_search_l.cpt","join_search_p.cpt"]
var viewlet_array=["join_search_v4.cpt","join_search_v4.cpt","join_search_v4.cpt","join_search_v4.cpt"]
var viewlet_random=viewlet_array[rand_value]
console.log("打开模板:"+viewlet_random)
var url_1="http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/"+viewlet_random+"&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username;
    setTimeout(function() {
        var frame_1 = $('<iframe style="width:'+make_width_1+'px;height:800px;display:auto;" class="search_report"></iframe>');
        frame_1.attr('src', url_1);
        if($('.search_report').length>0){
            $('.search_report').show()
        if(window.originInput!=inputString){$('.search_other').attr('src', url_2)}
        }
        else { $('#sea').append(frame_1);}
    },200);
})
//其他内容查询--tab操作
$('#search_other').click(function(){
  var originString=$('#search-box').attr("value")
  var inputString=originString.replace(/\s+/g,"、");
   var testString=originString.replace(/\s+/g,"").replace(/\u3001+/g,"")
  if (/^[\u4e00-\u9fa5]+$/i.test(testString)) {
    if(originString.match(/[\u4e00-\u9fa5]+/g).length==1)
  {
   inputString=inputString.replace(/\.+/g,"、");
  }
  }else{
    if(originString.match(/[\w.]+/g).length==1)
  {
   inputString=inputString.replace(/\.+/g,"、");
  }
  }
window.originInput=inputString
$('.search_tab li').removeClass("choose")
$(this).addClass("choose")
$("#all").hide();
$("#fr").hide();
$("#bi").hide();
$("#knowledge").hide();
$("#rec").hide();
$("#sea").hide()
setTimeout(function(){$("#fenye").hide()},200)
    var sea1='<div id="sea1" style="display:block"></div>'
if($('#sea1').length==0)
{$("#knowledge").after(sea1)}
else {$('#sea1').show()}
var make_width_1=Number($('.search_tab').css("width").replace("px",""))*1.2
var rand_value=new Date().getSeconds()%4
var viewlet_array=["join_search_v2-b.frm","join_search_v2-b.frm","join_search_v2-b.frm","join_search_v2-b.frm"]
var viewlet_random=viewlet_array[rand_value]
console.log("打开模板:"+viewlet_random)
var url_2="http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/"+viewlet_random+"&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username;
    setTimeout(function() {
        var frame_2 = $('<iframe style="width:'+make_width_1+'px;height:800px;display:auto;" class="search_other"></iframe>');
        frame_2.attr('src', url_2);
        if($('.search_other').length>0){
            $('.search_other').show()
        if(window.originInput!=inputString){$('.search_other').attr('src', url_2)}
        }
        else { $('#sea1').append(frame_2);}
    },200);
})
//下面两句是用来控制tab切换
/*$('.search_tab li').not('#recommends').click(function(){
  $('#recommends').removeClass("choose");
    $('.recommends').hide()
    $('#fenye').show()
    $('.rec').hide()
})*/
$('.search_tab li').not('#search_report').click(function(){
  $('#search_report').removeClass("choose");
    $('.search_report').hide()
    $('#fenye').show()
})
$('.search_tab li').not('#search_other').click(function(){
  $('#search_other').removeClass("choose");
    $('.search_other').hide()
    $('#fenye').show()
})}
else //没有搜索结果时自己加两个按钮
{
  $('.nsmsg').hide()
    var originString1=$('#search-box').attr("value")
  var inputString1=originString1.replace(/\s+/g,"、");
 var testString1=originString1.replace(/\s+/g,"").replace(/\u3001+/g,"")
  if (/^[\u4e00-\u9fa5]+$/i.test(testString1)) {
    if(originString1.match(/[\u4e00-\u9fa5]+/g).length==1)
  {
   inputString=inputString.replace(/\.+/g,"、");
  }
  }else{
    if(originString1.match(/[\w.]+/g).length==1)
  {
   inputString1=inputString1.replace(/\.+/g,"、");
  }
  }
window.originInput=inputString1
  var button_width=Number(window.innerWidth)/10
 var make_width_2=Number(window.innerWidth)*3/4
var new_search1=`<div class="new_search"><div class="new_search_child" id="search_report" style="cursor:pointer;color:#F00078;display:inline-block;background-color:#BBFFFF;font-size:24px;font-weight:bold;width:`+button_width+`px;height:80px"">三线问题查询</div>
<div class="new_search_child" id="search_other" style="cursor:pointer;display:inline-block;color:yellow;background-color:#00BB00;font-size:24px;font-weight:bold;width:`+button_width+`px;height:80px">其他内容查询</div></div>`
$('.col-dl').prepend(new_search1)
 var sea_r='<div name="my_window" id="search_report" style="width:100%;display:block"></div>'
 var sea_o='<div name="my_window" id="search_other" style="width:100%;display:block"></div>'
 var url_r="http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/join_search_v4.cpt&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username;
 var url_o="http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/join_search_v2-b.frm&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username;
 var frame_r='<iframe style="width:'+make_width_2+'px;height:800px;display:auto;" src='+url_r+' class="search_report"></iframe>'
 var frame_o='<iframe style="width:'+make_width_2+'px;height:800px;display:auto;" src='+url_o+' class="search_other"></iframe>'
 $('#search_other').after(sea_r).after(sea_o)
 $('[name="my_window"]#search_report').append(frame_r)
 $('[name="my_window"]#search_other').append(frame_o)
$('.new_search_child').click(function(){
  var this_id=$(this).attr("id")
  console.log(this_id)
  $('[name="my_window"]').show()
  $('[name="my_window"]').not('#'+this_id+'').hide()
  if(window.originInput!=inputString){
    $('frame.search_report').attr("src","http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/join_search_v4.cpt&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username)
    $('frame.search_other').attr("src","http://121.36.205.229:7080/webroot/decision/view/report?viewlet=公共/support/能效运营/join_search_v2-b.frm&op=write&__cutpage__=v&input="+inputString+"&wiki_user="+username)
  }
})
}
}
else
{  console.log("文档页打开")
var httpRequest = new XMLHttpRequest();//这里是获取未解决BUG列表，如果获取失败的话，整个都不执行
        httpRequest.open('GET', 'http://47.96.248.206:60080/cors/unsolved_sla/'+realname, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
          // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var returnjson = httpRequest.responseText;//获取到json字符串，还需解析
                console.log(returnjson);
                window.data=JSON.parse(returnjson);
  setTimeout(function(){
    occur();
  $('.full-list').children().children().mouseover(function(){var txt=$(this).text();$(this).attr("title",txt)})//给目录加上悬浮显示所有文字的功能
  $('.x-tree-node-el.x-tree-node-leaf').click(function(){
    window.waitForAddedNode({
    selector: '.doctiltop.clr',
    recursive: false,
    done: occur
  });
  })  },200)}
 }
};


window.fabiao=function(){ //发表按钮点击后，将输入框内容赋值给下面的评论框，并且触发提交
  var inputval=$('#say-something').val();
  //alert(inputval)
  document.querySelector('.noform iframe').contentWindow.document.querySelector('textarea').value=inputval//赋值
  document.querySelector('.noform iframe').contentWindow.document.querySelector('input.btnyy').click()//触发
   $('#my-comment').remove()
   Toast("已提交,感谢反馈~")
}
    window.float_toggle=function(){
  $('#float-help').fadeToggle()
}

window.maidian=function(n,e,d){
var data = JSON.stringify({"c":n,"t": "knowledge","e":e,"i": d});
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});
xhr.open("POST", "http://47.96.248.206:60080/c447bb0737483295a34e14ec74c61589");
xhr.setRequestHeader("access_key", "$2a$10$efEiBCptS/r11B4ffr4F9uHZ9.4P8nL06lCAkeXz.h5lmVhWBccoK");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(data);
}

function occur(){
  if($('#float-help').length==0){$('.nei_bottom5').after('<div style="display:block;height:500px;width:1000px"></div>')//预先添加一个空白元素，给float预留位置
$('#doc-body').append(flo)//添加悬浮
$('#float-help').append(choice)//添加选项和推荐文档
var doc_id=Number(window.location.href.replace("http://knowledge.fanruan.com/doc-view-","").replace(".html",""))
var newhttpRequest = new XMLHttpRequest();
newhttpRequest.open('GET', 'http://47.96.248.206:60080/cors/latest_docs/'+doc_id, true)
newhttpRequest.send();
newhttpRequest.onreadystatechange = function () {
if (newhttpRequest.readyState == 4 && newhttpRequest.status == 200) {
var returnjson = newhttpRequest.responseText;
var newest=JSON.parse(returnjson);
$('a[name="recommend"]').text(newest[0].title).attr("href",newest[0].url)
$('label#rec_des').html(newest[0].des)
$('a[name="recommend"]').click(function(){
  var detail='{"source":"'+doc_id+'","title":"'+newest[0].title+'","url":"'+newest[0].url+'","des":"'+newest[0].des+'"}'
  var name=$('.wenhou a').text()
  maidian(name,"click",detail)
})//自定义内容的埋点功能
}}
//推荐文档的标题和地址替换为数据库查询的

$('#call').remove()
$('.x-tree-node:last').after('<li class="x-tree-node"><div id="call" onclick="float_toggle()" style="cursor:pointer;color:HotPink;padding-left:40px;font-size:14px">显示/隐藏悬浮工具栏<div></li>')//加一个入口来隐藏和展示悬浮元素

$('.upup').click(function(){$('#doc-body')[0].scrollTop=0})//回到顶端
$('.downdown').click(function(){$('#doc-body')[0].scrollTop=$('#doc-body')[0].scrollHeight}) //跳转到底部
var box_array=[]
box_array.push('<input type="checkbox" name="bug"  value="一线问题">一线问题')
box_array.push('<input type="checkbox" name="bug"  value="其他问题">其他问题')
for(var i=0,l=window.data.length;i<l;i++){
var bug=window.data[i].jirakey+"-"+data[i].summary
var bug_link="https://work.fineres.com/browse/"+window.data[i].jirakey
box_array.push('<input type="checkbox" name="bug"  value="'+window.data[i].jirakey+'">'+bug+"<a class='bug-link' target='_blank' href='"+bug_link+"'>    打开</a>")
 }
//在box_array中动态生成元素
 var boxes='<div id="boxes" style="font-size:16px;max-height:110px;overflow-y: auto;background-color:white;box-shadow: rgba(29, 29, 31, 0.1)">'+box_array.join("<br>")+"</div>"
setTimeout(function(){
  $('[name="float-help"]').click(function(){
    $('#my-comment').remove()
    $('#float-help').append(bug_list)
    if($('#boxes').length==0){//点击"有用"，显示BUG列表
      $('#before').append(boxes)
      $('input[name="bug"]').click(function(){ //
        var chosen=$(this).val()
        if ($(this).is(":checked")== true)
        {
          document.querySelector('.noform iframe').contentWindow.document.querySelector('textarea').value="有帮助~"+chosen+"~"
          document.querySelector('.noform iframe').contentWindow.document.querySelector('input.btnyy').click()//触发
           Toast("已提交,感谢反馈~")
          $('#boxes').remove()
            if($('.yesorno:visible').length>0){
          $('.yesorno').find('.yes').click()} //如果可以点击，那就触发点击
        }
       })
       }
       else
       {
          $('#boxes').remove()
       }

  })
$('[name="say"]').click(function(){ //评论按钮点击后，出现一个输入框
  $('#boxes').remove()
  if($('#my-comment').length==0)
    {
      $('#float-help').append(say)
    }
  else
    {
      $('#my-comment').remove()
    }
})

},100)}
}

})();

