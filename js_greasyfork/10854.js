// ==UserScript==
// @name        QuickPass
// @namespace   202.204.48.66
// @description 去除5秒限制；去除注销弹框；请勿滥用^-^
// @include     http://202.204.48.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10854/QuickPass.user.js
// @updateURL https://update.greasyfork.org/scripts/10854/QuickPass.meta.js
// ==/UserScript==


//alert("Grease Monkry is working");
//windows.int=function(){ $("btn").innerHTML = "登录 Login";}

//windows.init = null;
/*unsafeWindow.init = function () {
         $("btn").innerHTML = "登录 Login";
    };*/



/*function addZero(i){
	if (i<10) {i = "0"+i};
	return i
	}
	h = addZero(h);
	m = addZero(m);
	//s = addZero(s);
	document.getElementById("today").innerHTML = M+"月"+D+"日"+" "+week[W]+" "+h+":"+m//+":"+s
	setTimeout('clock()',30000)//若显示秒需改成500
	}
</script>
*/
unsafeWindow.init = function (){
  if(remain>100){window.setTimeout(init,1000);}
  else{
    $("btn").disabled = false;
    $("btn").innerHTML = "登录 Login";}  
};
/*var _kexchange = _kexchange || [];
    _dmid='RUU4OThBNUU2NkI5QjZC';
    _kexchange.push(['_setAccount', _dmid]);
    _kexchange.push(['_setWLogo', 'Y']); 
     document.write('<script type="text/javascript" charset="utf-8" src="' 
        + ('https:' == document.location.protocol ? 'https://' : 'http://') 
        + 'cmarket.kejet.net/exchange2.js?a='+_dmid + '"></scr'+'ipt>');
        _kenid = 'RjIzMjBDRDhENTE3N0JD_'+Math.random();
        _kexchange.push(['_addSlot',_kenid,'300','250','2','9']);</script></div><div class="widget widget_d_banner widget_d_banner_row"><iframe width="100%" height="510" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=2&ptype=0&speed=0&skin=5&isTitle=0&noborder=1&isWeibo=1&isFans=0&uid=1748462795&verifier=465b5d97&&colors=FAFAFA,FAFAFA,000000,3B5998,FFFFFF&dpc=1"></iframe></div><div class="widget widget_d_banner widget_d_banner_row"><script type="text/javascript">document.write('<a style="display:none!important" id="tanx-a-mm_35282911_5956534_32376382"></a>');
        tanx_s = document.createElement("script");
        tanx_s.type = "text/javascript";
        tanx_s.charset = "gbk";
        tanx_s.id = "tanx-s-mm_35282911_5956534_32376382";
        tanx_s.async = true;
        tanx_s.src = "http://p.tanx.com/ex?i=mm_35282911_5956534_32376382";
        tanx_h = document.getElementsByTagName("head")[0];
        if(tanx_h)tanx_h.insertBefore(tanx_s,tanx_h.firstChild);*/
unsafeWindow.wc = function(){s2=1;window.location=url4};