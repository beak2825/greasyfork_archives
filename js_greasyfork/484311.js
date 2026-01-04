// ==UserScript==
// @name         湖南省事业单位工作人员培训网络平台
// @namespace    https://hn.ischinese.cn/
// @version      1.5
// @description  学习视频（基于作者Aether代码修改）
// @author       liber
// @match        *.ischinese.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484311/%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484311/%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==




(function () {
    console.log("js--------------------start---------------");
    setInterval(() => {
    	console.log("setInterval--------------------start---------------");
	    let hre = location.href;
	    
	    //初始化首页播放列表下标
	    var limit = localStorage.getItem('limit');
	    if(limit == null){
	    	limit = 0;
	    	localStorage.setItem('limit',limit);
	    }else{
	    	limit = parseInt(localStorage.getItem('limit'));
	    }
	    
	    console.log("limitInit :"+limit);
	
			//视频首页遍历视频列表
	    if (hre.match("ischinese.cn/course")) {
	    				console.log("into --- ischinese.cn/course");
	//        	setTimeout(() => {
	            var courceList = document.getElementsByClassName('mark');
	            //如果已看完当前页面所有视频则检查是否有下一页并翻页  否则点击播放下一个视频
	            if(courceList.length !=0){
		            if(limit == courceList.length){
		                console.log("ischinese.cn/course  -----------------end----------------");
		                setTimeout(() => {
		        				}, 1000000)
		                return;
		            }else{
		                console.log("courceList count:"+courceList+"courceList[limit].click() limit:"+limit);
		            	  courceList[limit].click(); 
		            }
		          }
	    				console.log("out ----  ischinese.cn/course --- ");
	
	    }
	    
	    //此处为点击查看进度不是100%的部分  是则跳过
	    if (hre.match("ischinese.cn/learncenter/play")) {
	        console.log("into--1 ischinese.cn/learncenter/play");
	        setTimeout(() => {
	            var jindu = document.getElementsByClassName('text')[0].querySelectorAll('span')[1].textContent.replace('%','');
	            console.log("into--1 check jindu:"+jindu);
	            if(jindu == '100'){
		            //首页遍历播放列表下标加1
	    					localStorage.setItem('limit',parseInt(limit)+1) ;
	        			console.log("limit+1  and goback");
	               window.history.go(-1);
	               return;
	            }
	            //全部播完了跳回去
	        }, 5000)
	    }
	    
	    if (hre.match("ischinese.cn/learncenter/play")) {
	        console.log("into--2 ischinese.cn/learncenter/play");
	        setTimeout(() => {
	            try {
	                //判断视频界面是否加载完成
	                if (document.getElementById('player-content').getElementsByClassName('vjs-tech')[0].innerHTML != '') {
	                    //3秒后再操作 防止元素未加载出来
	                    setTimeout(() => {
	                        //判断进度 
	                        var jindu = parseInt(document.getElementsByClassName('text')[0].querySelectorAll('span')[1].textContent.replace('%',''));
	            						console.log("into--2 check jindu:"+jindu);
	            						
	            						if(document.getElementsByClassName("vjs-icon-placeholder").length >0){
	            							console.log("clickPlay:"+document.getElementsByClassName("vjs-icon-placeholder").length);
	            							document.getElementsByClassName("vjs-icon-placeholder")[0].click();
	            						}
	                        
	                        //获取右侧播放列表
	                        var vdList = document.getElementsByClassName('class-catlog')[0].getElementsByClassName('sectionNum');
	                        
	                        //获取播放视频当前章节
	                        var title = document.getElementsByClassName('present')[0].textContent;
	                        
	                        
	                        //判断是否已经有重播按钮 表示当前视频已经播放结束
	                        var playButton = document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-paused vjs-ended');
	                        
	                        if (playButton.length > 0 ){
	            						console.log("check this playing is over");
		                        for(var i = 0; i < vdList.length; i++ ){
		                        	
			                        // 获取播放列表 章节  第1节  
			                        var title0 = document.getElementsByClassName('class-catlog')[0].getElementsByClassName('sectionNum')[0].textContent;
			                        // 获取播放列表 标题  文件的出台背景与重要意义 
			                        var title1 = document.getElementsByClassName('class-catlog')[0].getElementsByClassName('classname')[0].textContent  ;
			                        
			                        //判断当前播放章节是否最后一章  最后一章播放结束则返回上一页面  否则播放下一章节
		                            if(title.match(title0)&&title.match(title1)&&i==vdList.length-1 ){
	            											console.log("check the vdList is lastOne limit+1 and goback");
		                            		//首页播放列表下标加1
	    															localStorage.setItem('limit',parseInt(limit)+1) ;
		               									window.history.go(-1);
	                									return;
		                            }
	            									console.log("check the vdList and goto nextOne");
		                        		document.getElementsByClassName('nextdontcheat')[0].click();
		                        }
	                     	 }
	                        
	                    }, 2000)
	                }
	            } catch(err) {
	                console.log(err)
	                setTimeout(() =>{
	                    window.location.reload();
	                },1000)
	            }
	        }, 10000)
	    }
	    
	    console.log("setInterval--------------------end----------------");
    }, 10000);
    
    console.log("js--------------------end----------------");

})();