// ==UserScript==
// @name	玛雅网优化
// @description	网页优化，广告清理
// @namespace	ed8311262b384bc1d613e96f226ec4af
// @match	http://*/*
// @author	ejin
// @version	2024.01.08.6
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/483903/%E7%8E%9B%E9%9B%85%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483903/%E7%8E%9B%E9%9B%85%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 2024.01.08 优化手机界面
// 2024.01.06 清理影响布局的残留table，隐藏边栏
// 2024.01.05 优化界面
// 2016.09.08 部分代码优化
setTimeout(()=>{
	if (document.body.innerText.indexOf('Powered by Discuz!') != -1
	&& document.body.innerHTML.indexOf('maya@mailkx.com') != -1 ) {
		//已登录
		if ( document.body.innerHTML.indexOf("register.php")==-1 ){
			//登录跳转自动点击
			if ( document.body.innerHTML.indexOf('现在将转入登录前页面') != -1 ) {
				document.getElementsByClassName("altbg1")[0].getElementsByTagName("a")[0].click();
			}
		} else {
		//未登录
			//登录界面
			if ( document.querySelector("form[action^='logging.php?action=login']") != null ) {
				//填写密码
				document.getElementsByName("username")[0].value = "mimamima";
				document.getElementsByName("password")[0].value = "mimamima";
				//密码保存一个月(如果选项存在)
				document.body.querySelectorAll("input[value='2592000']").forEach( (input)=>{input.checked="checked"} );

				//权限不足登录界面，补充缺少的密码保存期限选项
				if (document.getElementsByName("cookietime").length == 1){
					document.getElementsByName("cookietime")[0].remove();
					var new_span=document.createElement("div");
					new_span.id="savepass";
					document.getElementsByName("password")[0].parentElement.appendChild(new_span);

					document.getElementById("savepass").innerHTML+='<label>'
						+'<input class="radio" type="radio" name="cookietime" value="2592000" checked="checked">存一月</label>';
					document.getElementById("savepass").innerHTML+='<label>'
						+'<input class="radio" type="radio" name="cookietime" value="0">不保存</label>';
				}
			}
		}

		//无论是否登录
		//帖子界面
		if (location.href.indexOf("viewthread.php") != -1){
			//设置网页默认显示比例
			var viewport = document.createElement('meta');
			viewport.name = 'viewport';
			viewport.content = 'width=device-width, initial-scale=1.0';
			document.head.appendChild(viewport);

			//移动端界面优化
			if(document.body.clientWidth<700){
				//在帖子/回帖的小标题显示发表者
				document.querySelectorAll('a[href^="pm.php?"]').forEach((pm,i)=>{
					var reply_head=pm.parentElement;
					var reply_user=document.querySelectorAll('.t_user a[href^="space.php"]')[i].innerHTML;
					var reply_userlink=document.querySelectorAll('.t_user a[href^="space.php"]')[i].href;
					reply_head.innerHTML="<a>"+reply_user+"</a>"+reply_head.innerHTML;
				});
				//清理一些元素
				document.querySelectorAll('.t_user,a[href^="pm.php"],[href^="viewpro.php"],[href^="memcp.php"],[href^="magic.php"]').forEach((ele)=>{
					//避免删除顶部栏位中的元素
					if(ele.parentElement.innerHTML.indexOf("logging.php") == -1 ){
						ele.remove();
					}
				});
			}
		}

		//清理可能存在广告
		top.document.onclick = null;
		document.onclick = null;

		//清理图片横幅广告
		document.querySelectorAll('img[src^=http]').forEach( (img) => {
		  if (img.width >700 && img.height<100) {
			  img.remove();
		  }
		});
		//清理横幅广告第二种方法，判断table里全是外链，作为补充
		document.querySelectorAll('table').forEach( (table) => {
			if(table.innerHTML.indexOf('href="http') != -1){
				if(table.innerHTML.split('<a').length==table.innerHTML.split('href="http').length){
					table.remove();
				} else {
					return;
				}
			}
		});
		//清理没有内容的table，避免影响布局
		document.querySelectorAll('table').forEach( (table) => {
			if(table.innerText==""){
				table.remove();
			}
		});
	}
},0)