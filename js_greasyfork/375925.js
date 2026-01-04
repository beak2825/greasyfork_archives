var $=unsafeWindow.jQuery;
var url=document.URL;
function getHx(urls){
   return $.ajax({url:urls});
}
//妹子图片
if(url.indexOf("mzitu")>=0){
var l=url.match(/\d+/g)
if(l.length>1){url=url.substring(0,url.lastIndexOf("/"))}
url+="/"
$(".main-image p").empty()
var num=0,pics="";
for(var o in $("span")){
    var txts=$("span").eq(o).html()
    if(txts.indexOf("下一页")>=0){num=$("span").eq(o-1).html();break;}
}
(function(){
$.when(getHx(url)).done(function(d){
    var pic=d.match(/<img.+jpg"/g)
    for(var i=0;i<pic.length;i++){
        if(pic[i].indexOf("下载妹子")<0){$(".main-image p").append(pic[i]+"/>")}
    }
})
})()
for(var z=2;z<=num;z++){
    (function(z){
      $.when(getHx(url+z)).done(function(e){
      var pic=e.match(/<img.+jpg"/g)
     for(var s=0;s<pic.length;s++){
        if(pic[s].indexOf("下载妹子")<0){$(".main-image p").append(pic[s]+"/>")}
     }
     })
    })(z)
}
}
if(url.indexOf("meitulu")>=0){
    var n=0;
    for(var y in $("a")){
        if($("a").eq(y).html().indexOf("下一页")>=0){
            n=Number($("a").eq(y-1).html());
            return n
        }
    }
}