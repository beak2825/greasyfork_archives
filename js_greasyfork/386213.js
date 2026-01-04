// ==UserScript==
// @icon            http://twitter.com/favicon.ico
// @name            一键屏蔽推特指定用户所有follower
// @namespace       暂无
// @author          PetalsOnaWet
// @description     用官方推特进入指定用户页面，点击关注着列表，出现一键屏蔽，即可将该用户以及该用户所有的follower屏蔽
// @match           *://twitter.com/*/followers
// @version         0.0.3
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/386213/%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD%E6%8E%A8%E7%89%B9%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E6%89%80%E6%9C%89follower.user.js
// @updateURL https://update.greasyfork.org/scripts/386213/%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD%E6%8E%A8%E7%89%B9%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E6%89%80%E6%9C%89follower.meta.js
// ==/UserScript==

//屏蔽按钮


var block_btn_html = '<span >';
block_btn_html += '<button type="button"  id="_peBlockAll" class="EdgeButton EdgeButton--secondary EdgeButton--medium">'
block_btn_html += '<span>一键屏蔽</span>'
block_btn_html +=' </button>'
block_btn_html +='</span>'


//插入

var parentDom =  document.querySelectorAll('.btn-group')[0];

parentDom.insertAdjacentHTML('afterbegin',block_btn_html)





var y = 5000

var spinner = document.querySelectorAll('.GridTimeline-footer .spinner')[0] 

var timeout = false; //启动及关闭按钮


//屏蔽主程序

 function block(){

	if(getScrollTop() + getWindowHeight() == getScrollHeight()&&isHidden(spinner)){//如果到底部了并且loading隐藏了，说明出错或者follower已加载完毕，弹出提示框并取消定时器
		
		timeout = true
		var con = confirm('屏蔽完成，如果满意点确定帮我star')
		if(con===true){
			window.location.href='https://github.com/PetalsOnaWet/one-button-block'
		}else{
			//do nothing
		}
	}else{
		window.scrollTo(0,y)//滚动
		y += 5000
		var arr = document.querySelectorAll('.block-text .dropdown-link') //获取屏蔽按钮
		//屏蔽主程序
		for(var i =0;i<arr.length;i++){

			if(!isHidden(arr[i].parentElement)){
						arr[i].click()

					var button = document.querySelectorAll('.block-button');//确认屏蔽

					button[0].click()
			}
	
		}


	}

  }
  
//点击事件

function time(){
  if(timeout) return;
   block();

  setTimeout(time,5000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
  
}






//滚动条在Y轴上的滚动距离
function getScrollTop()
{
　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
　　if(document.body){
　　　　bodyScrollTop = document.body.scrollTop;
　　}
　　if(document.documentElement){
　　　　documentScrollTop = document.documentElement.scrollTop;
　　}
scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
return scrollTop;
}
//文档的总高度
function getScrollHeight(){
　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
　　if(document.body){
　　　　bSH = document.body.scrollHeight;
　　}
　　if(document.documentElement){
　　　　dSH = document.documentElement.scrollHeight;
　　}
scrollHeight = (bSH - dSH > 0) ? bSH : dSH ;
　　return scrollHeight;
}
//浏览器视口的高度
function getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
}

//判断当前元素是否可见

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}


var _peBlockAll = document.querySelectorAll('#_peBlockAll')[0];

_peBlockAll.addEventListener('click',time)
