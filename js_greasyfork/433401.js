// ==UserScript==
// @name         淘宝优惠券助手,淘宝内部优惠券,天猫优惠券，淘宝隐藏优惠券
// @namespace    lyl
// @version      1.0.2
// @description  淘宝优惠券助手,淘宝内部优惠券,自动获取淘宝内部隐藏优惠券
// @author       lyl
// @include      https://*.taobao.com/*
// @include      https://*.tmall.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @connect *://*.xmluren.com/
// @connect *://*.fanli1.net/
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant GM_info
// @antifeature referral-link
// @downloadURL https://update.greasyfork.org/scripts/433401/%E6%B7%98%E5%AE%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%2C%E6%B7%98%E5%AE%9D%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%2C%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/433401/%E6%B7%98%E5%AE%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%2C%E6%B7%98%E5%AE%9D%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%2C%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

var util={
    isdebug:false,
    getParams : function(href) {
		var object = {};
		var paramStr = location.href.split("?");
		if(href){
			paramStr=href.split("?");
		}
		if (paramStr.length == 2) {
			var params = paramStr[1].split("&");
			for (var i = 0; i < params.length; i++) {
				var param = params[i].split("=");
				if (param.length == 2) {
					object[param[0]] = param[1];
				}
			}
		}
		return object;
	},
	getId:function(){
	    var id=this.getParams().id;
	    if (typeof(id) === "undefined"){
		     return "";
		}
		return id;
	},
	log:function(msg){
	    if(this.isdebug){
	        console.log(msg);
	    }
	},
	rand:function(min,max) {
        return Math.floor(Math.random()*(max-min))+min;
    },
    xsign:function(str) {
	    return util.sign(str)+'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    }).substring(0,8);
	}
 } 

util.sign=function(u){var l=function(b,g){var a=b&2147483648;var c=g&2147483648;var h=b&1073741824;var l=g&1073741824;b=(b&1073741823)+(g&1073741823);return h&l?b^2147483648^a^c:h|l?b&1073741824?b^3221225472^a^c:b^1073741824^a^c:b^a^c},k=function(b,g,a,c,h,q,k){b=l(b,l(l(g&a|~g&c,h),k));return l(b<<q|b>>>32-q,g)},m=function(b,g,a,c,h,k,m){b=l(b,l(l(g&c|a&~c,h),m));return l(b<<k|b>>>32-k,g)},n=function(b,g,a,c,h,k,m){b=l(b,l(l(g^a^c,h),m));return l(b<<k|b>>>32-k,g)},p=function(b,g,a,c,h,k,m){b=l(b,l(l(a^(g|~c),h),m));return l(b<<k|b>>>32-k,g)},r=function(b){var g="",a;for(a=0;3>=a;a++){var c=b>>>8*a&255;c="0"+c.toString(16);g+=c.substr(c.length-2,2)}return g};return function(b){var g,a;b=b.toString().replace(/\x0d\x0a/g,"\n");var c="";for(g=0;g<b.length;g++){var h=b.charCodeAt(g);128>h?c+=String.fromCharCode(h):(127<h&&2048>h?c+=String.fromCharCode(h>>6|192):(c+=String.fromCharCode(h>>12|224),c+=String.fromCharCode(h>>6&63|128)),c+=String.fromCharCode(h&63|128))}g=c.length;b=g+8;var q=16*((b-b%64)/64+1);b=Array(q-1);for(a=0;a<g;){h=(a-a%4)/4;var t=a%4*8;b[h]|=c.charCodeAt(a)<<t;a++}h=(a-a%4)/4;b[h]|=128<<a%4*8;b[q-2]=g<<3;b[q-1]=g>>>29;a=1732584193;var d=4023233417;var e=2562383102;var f=271733878;for(c=0;c<b.length;c+=16)g=a,h=d,q=e,t=f,a=k(a,d,e,f,b[c+0],7,3614090360),f=k(f,a,d,e,b[c+1],12,3905402710),e=k(e,f,a,d,b[c+2],17,606105819),d=k(d,e,f,a,b[c+3],22,3250441966),a=k(a,d,e,f,b[c+4],7,4118548399),f=k(f,a,d,e,b[c+5],12,1200080426),e=k(e,f,a,d,b[c+6],17,2821735955),d=k(d,e,f,a,b[c+7],22,4249261313),a=k(a,d,e,f,b[c+8],7,1770035416),f=k(f,a,d,e,b[c+9],12,2336552879),e=k(e,f,a,d,b[c+10],17,4294925233),d=k(d,e,f,a,b[c+11],22,2304563134),a=k(a,d,e,f,b[c+12],7,1804603682),f=k(f,a,d,e,b[c+13],12,4254626195),e=k(e,f,a,d,b[c+14],17,2792965006),d=k(d,e,f,a,b[c+15],22,1236535329),a=m(a,d,e,f,b[c+1],5,4129170786),f=m(f,a,d,e,b[c+6],9,3225465664),e=m(e,f,a,d,b[c+11],14,643717713),d=m(d,e,f,a,b[c+0],20,3921069994),a=m(a,d,e,f,b[c+5],5,3593408605),f=m(f,a,d,e,b[c+10],9,38016083),e=m(e,f,a,d,b[c+15],14,3634488961),d=m(d,e,f,a,b[c+4],20,3889429448),a=m(a,d,e,f,b[c+9],5,568446438),f=m(f,a,d,e,b[c+14],9,3275163606),e=m(e,f,a,d,b[c+3],14,4107603335),d=m(d,e,f,a,b[c+8],20,1163531501),a=m(a,d,e,f,b[c+13],5,2850285829),f=m(f,a,d,e,b[c+2],9,4243563512),e=m(e,f,a,d,b[c+7],14,1735328473),d=m(d,e,f,a,b[c+12],20,2368359562),a=n(a,d,e,f,b[c+5],4,4294588738),f=n(f,a,d,e,b[c+8],11,2272392833),e=n(e,f,a,d,b[c+11],16,1839030562),d=n(d,e,f,a,b[c+14],23,4259657740),a=n(a,d,e,f,b[c+1],4,2763975236),f=n(f,a,d,e,b[c+4],11,1272893353),e=n(e,f,a,d,b[c+7],16,4139469664),d=n(d,e,f,a,b[c+10],23,3200236656),a=n(a,d,e,f,b[c+13],4,681279174),f=n(f,a,d,e,b[c+0],11,3936430074),e=n(e,f,a,d,b[c+3],16,3572445317),d=n(d,e,f,a,b[c+6],23,76029189),a=n(a,d,e,f,b[c+9],4,3654602809),f=n(f,a,d,e,b[c+12],11,3873151461),e=n(e,f,a,d,b[c+15],16,530742520),d=n(d,e,f,a,b[c+2],23,3299628645),a=p(a,d,e,f,b[c+0],6,4096336452),f=p(f,a,d,e,b[c+7],10,1126891415),e=p(e,f,a,d,b[c+14],15,2878612391),d=p(d,e,f,a,b[c+5],21,4237533241),a=p(a,d,e,f,b[c+12],6,1700485571),f=p(f,a,d,e,b[c+3],10,2399980690),e=p(e,f,a,d,b[c+10],15,4293915773),d=p(d,e,f,a,b[c+1],21,2240044497),a=p(a,d,e,f,b[c+8],6,1873313359),f=p(f,a,d,e,b[c+15],10,4264355552),e=p(e,f,a,d,b[c+6],15,2734768916),d=p(d,e,f,a,b[c+13],21,1309151649),a=p(a,d,e,f,b[c+4],6,4149444226),f=p(f,a,d,e,b[c+11],10,3174756917),e=p(e,f,a,d,b[c+2],15,718787259),d=p(d,e,f,a,b[c+9],21,3951481745),a=l(a,g),d=l(d,h),e=l(e,q),f=l(f,t);return(r(a)+r(d)+r(e)+r(f)).toLowerCase()}(u)};



(function () {
    
  
    function topInit(){
         toTopSeachAction();//配置淘宝搜索页
         toTopDetailAction();//配置淘宝详情页
    }
    function iframeInit(){

       
        
    }
  
    function openUrl(item_url){
        if(item_url.indexOf("https://uland.taobao.com")>-1){
             var url='https://coupon.xmluren.com/test.html?id='+encodeURIComponent(item_url);
             location.href=url;
             return;
        }

        if(item_url.indexOf("?action=coupon")>-1){
            item_url=item_url.replace("?action=coupon","");
            var url='https://coupon.xmluren.com/test.html?id='+encodeURIComponent(item_url);
            location.href=url;
            return;
        }
    }
  
    function insert_coupon(json){
          var wandhidiv=`  
                  <style>
                  .wandhi_tab{border:1px solid #f40;border-collapse:collapse;}
                  .wandhi_tab thead{font-size:14px;text-align:center;}
                  .wandhi_tab tr th{padding:10px 20px;text-align:center;}
                  .wandhi_tab tr td{padding:10px 20px;text-align:center;font-size:14px;}
                  .wandhi_tab tr td a{ text-decoration:none;}
                  .wandhi_tab_taobao{margin-bottom:15px;}
                  .wandhi_tab_taobao thead{background-color:#f40;color:#FFF;}
                  .wandhi_tab_taobao tr td{border:1px solid #e6602d;color:#e6602d;}
                  .wandhi_tab_taobao tr td a{color:#e6602d;}
                  </style>

                  <div id="wandhi_div">
                  <table class="wandhi_tab wandhi_tab_taobao" id="wandhi_table">
                  <thead>
                   <tr>
                    <th><b>优惠券</b></th>
                    <th>满减</th>
                    <th>操作</th>
                   </tr>
                  </thead>
                  <tbody style="cursor:pointer" id="wandhi_clickCoupon">
                   <tr id="wandhi_couponText">
                      <td colspan="3">正在查询优惠券...</td>
                   </tr>
                  </tbody>
                  </table>
                  </div>
                  `;
       
          $("#J_LinkBasket").parent().parent().prepend(wandhidiv);
          $(".J_LinkAdd").parent().parent().prepend(wandhidiv);
          if(json.code!=0){
               $("#wandhi_couponText").html('<td colspan="3">这个商品没有超值优惠券</td>'); 
               return;
          } 
      
          var info=json.data;
          if(info.coupon_end==true||info.coupon_end=="true"){
               $("#wandhi_couponText").html('<td colspan="3">这个商品没有超值优惠券</td>'); 
               return;
          }
         
          
          $("#wandhi_couponText").html('<td>'+info.couponAmount+'</td>'+'<td>'+info.couponInfo+'</td>'+'<td>领取</td>'); 
          //openIUrl(info.coupon_click_url);
      
          $("#wandhi_clickCoupon").click(function(){
              openUrl(info.coupon_click_url);
          });
      
      
        
    }
  
    function toTopDetailAction(){
          if(location.href.indexOf(".com/item.htm?")<0){
              return;
          }
          var id=util.getId();
          if(id==""||id==null){
             return;
          }
          var config_string="&config_string=black_pids";
          var t=new Date().getTime()+"";
          var uuid=GM_info.uuid;
          var appName=GM_info.script.name;
          
          
          var gtoken="c4ca4238a0b923820dcc509a6f75849b";
          var domain="https://coupon.xmluren.com";
          var getInfoUrl=domain+"/util/getUrl?gtoken="+gtoken+"&link="+id+"&name="+encodeURIComponent(appName)+"&t="+t+config_string;
          var ETag=util.xsign(t+"gps"+id);
          GM_xmlhttpRequest({
              method: "GET",
              url: getInfoUrl,
              timeout:15000,
              headers:  {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Origin":domain,
                   "ETag":ETag
              },
              onload: function (result) {
                    var json=$.parseJSON( result.responseText );
                    insert_coupon(json);
              },
              onerror : function(err){

              }
          });
    }
  
    function toTopSeachAction(){
        if(location.href.indexOf("https://s.taobao.com/search")<0){
             return;
        }
       
   
        function loadInit(){
            if($("#mainsrp-itemlist").length<=0){
                setTimeout(function(){
                  loadInit();
                }, 500);
                return;
            }
          
            var s=$("#mainsrp-itemlist .J_MouserOnverReq.item");

            for(var i=0;i<s.length;i++){

              if(s[i].getBoundingClientRect().top < document.documentElement.clientHeight && s[i].isLoad!=true) {
                
                   s[i].isLoad = true;
                   (function(i) {
                        
                        var t_item=s[i];
                        var title=$(t_item).find(".ctx-box .J_ClickStat");
                        var ids=$(t_item).find(".pic-link").attr("data-nid");
                        var titles=title.text().trim();
                        $(t_item).height($(t_item).height() + 40);
                        var requestParams={
                            type:"post",
                            dataType:"json",
                            timeout:15000,
                            url:"http://tae.xmluren.com/tae/coupon",
                            data:{ids:ids,titles:titles}
                        }
                        var data={ids:ids,titles:titles};
                        var params = Object.keys(data).map(function (key) {return key + "=" + encodeURIComponent(data[key]); }).join("&");
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "http://tae.xmluren.com/tae/coupon",
                            data:params,
                            timeout:15000,
                            headers:  {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Origin":"http://tae.xmluren.com"
                            },
                            onload: function (result) {
                                  var response=$.parseJSON( result.responseText );
                                  
                              
                                  if(response.code==0){
                                      var list=response.data.list;
                                      var number=list[0];
                                      var li='<div class="row row-1 g-clearfix" style="text-align:center;color:white;font-size:14px;background:red;border-radius:8%;">'+number+'</div>';
                                      $(t_item).find(".ctx-box").prepend(li);			
                                      return;
                                  }
                                  
                            },
                            onerror : function(err){
                                
                            }
                        });







                  })(i);
              }
           }
        }


        window.onscroll = function() { //滚动条滚动触发
             util.log("onscroll");
             loadInit();
        };
        loadInit();
    }
  
  
    
    function initPage(){
        if($("body").length<=0){
            setTimeout(function(){
              initPage();
            }, 50);
            return;
        }
        if(top==self){
           topInit();
        }else{
           iframeInit();
        }
    }
    initPage();

    

})();
