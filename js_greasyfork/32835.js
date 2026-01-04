// ==UserScript==
// @name      搜索内容居中显示
// @namespace Violentmonkey Scripts
// @version   0.0.5
// @description 各大搜索引擎内容在屏幕居中显示，解放你的脖子！
// @include		*baidu.com*
// @include		*sogou.com*
// @include		*google.com*
// @include		*google.com.hk*
// @include		*bing.com*
// @author mordom0404
// @downloadURL https://update.greasyfork.org/scripts/32835/%E6%90%9C%E7%B4%A2%E5%86%85%E5%AE%B9%E5%B1%85%E4%B8%AD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/32835/%E6%90%9C%E7%B4%A2%E5%86%85%E5%AE%B9%E5%B1%85%E4%B8%AD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.match(/www\.baidu\.com\//)){
      $("body").prepend(`<style>
        #container{
          margin-left:auto;
          margin-right:auto;
        }
        #s_tab b{
          margin-left:20vw;
        }
        #head .s_form{
          margin-left:20vw;
        }
        </style>`)

    }
    if(window.location.href.match(/cn\.bing\.com/)){
    	var timer = setInterval(function(){
    		if(document.getElementById('b_content')){
    			if(document.getElementById('b_content').style.float!=="left"){
			    	document.getElementById('b_content').style.float="left";
			    	document.getElementById('b_content').style.paddingLeft="0";
			    	document.getElementById('b_content').style.transform="translate(-50%, 0)";
			    	document.getElementById('b_content').style.position="relative";
			    	document.getElementById('b_content').style.left="50%";
			    	document.getElementById('b_header').style.marginLeft="auto";
			    	document.getElementById('b_header').style.marginRight="auto";
		    		console.log("尝试居中")
	    		}else{
	    			clearInterval(timer)
	    			console.log("居中成功")
	    		}
    		}
    	},1000)
    	document.getElementById('b_content').style.float="left";
    	document.getElementById('b_content').style.paddingLeft="0";
    	document.getElementById('b_content').style.transform="translate(-50%, 0)";
    	document.getElementById('b_content').style.position="relative";
    	document.getElementById('b_content').style.left="50%";
    	document.getElementById('b_header').style.marginLeft="auto";
    	document.getElementById('b_header').style.marginRight="auto";
    }
    if(window.location.href.match(/www\.sogou\.com\//)){
    	var timer = setInterval(function(){
    		if(document.getElementById('wrapper')){
    			if(document.getElementById('wrapper').style.float!=="left"){
			    	document.getElementById('wrapper').style.float="left";
			    	document.getElementById('wrapper').style.paddingLeft="0";
			    	document.getElementById('wrapper').style.transform="translate(-50%, 0)";
			    	document.getElementById('wrapper').style.position="relative";
			    	document.getElementById('wrapper').style.left="50%";
		    		console.log("尝试居中")
	    		}else{
	    			clearInterval(timer)
	    			console.log("居中成功")
	    		}
    		}
    	},1000)
    }
    if(window.location.href.match(/www\.google\.com/)){
    	var timer = setInterval(function(){
    		if(document.getElementsByClassName('mw')[1]){
    			if(document.getElementsByClassName('mw')[1].style.marginLeft!=="auto"){
	    			document.getElementsByClassName('mw')[1].style.marginLeft="auto";
			    	document.getElementsByClassName('mw')[1].style.marginRight="auto";
			    	document.getElementById('searchform').getElementsByClassName('tsf')[0].style.marginLeft="auto";
			    	document.getElementById('searchform').getElementsByClassName('tsf')[0].style.marginRight="auto";
			    	document.getElementById('hdtb-msb').style.transform="translate(-50%, 0)";
			    	document.getElementById('hdtb-msb').style.left="50%";
			    	document.getElementById('topabar').style.textAlign="center";
			    	document.getElementById('slim_appbar').style.display="inline-block";
			    	document.getElementById('slim_appbar').style.marginLeft="0";
		    		console.log("尝试居中")
	    		}else{
	    			clearInterval(timer)
	    			console.log("居中成功")
	    		}
    		}
    	},1000)

    }
})()
