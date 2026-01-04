(function(){
//VIP视频解析
var v_a=["https://2wk.com/vip.php?url= ","http://www.meilize.cn/jx/?url=","http://aikan-tv.com/?url=","http://jx.52xftv.cn/?url="];

setInterval(function(){
 var jx=v_a[1]+document.URL;
 var v_h=location.hostname; 
if($(".s")){$(".s").remove()}
console.log($(".s"))
console.log(v_h)
switch(v_h){

//PP视频
  case "v.pptv.com":
	$(".play-comment").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
//腾讯
  case "v.qq.com":
	$(".video_title").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
//优酷
  case "v.youku.com":
	$("#subtitle").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //芒果TV
  case "www.mgtv.com":    
	$(".v-panel-title").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //乐视
  case "www.le.com":   
	$(".briefIntro_tit").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
//爱奇艺
  case "www.iqiyi.com":
	$(".player-title").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //暴风影音
  case "www.baofeng.com":
	$(".play-state").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank' style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //央视1905  
  case "vip.1905.com":
	$(".myfavorite").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //56我乐
  case "tv.sohu.com":
	$(".vBox-desktop").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
//天天看看
  case "vip.kankan.com":
	$(".score").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
	break;
 //华数
  case "www.wasu.cn":
	$("#play_vod_hits").after("<span class='s'style='border-radius:7px;background-color:#303030;padding:10px;font-size:12px;color:white;'><a href='http://www.meilize.cn/m1.html' target='_blank'  style='color:white;font-size:12px;padding:5px;'>领优惠券</a>&nbsp;|&nbsp;<a  class='jxh' href='"+jx+"' target='_blank' style='color:white;font-size:12px;padding:5px;'>VIP解析</a>")
    break;
}
},300)
})()