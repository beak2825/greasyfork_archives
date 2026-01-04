// ==UserScript==
// @name         国家开放大学 新平台（刷视频，进度（视频和进度全自动），形考，考试）
// @namespace    http://www.baidu.com/
// @version      0.05
// @description  国开自动刷视频和目录进度
// @author       laowang3142 微信:laowang3142
// @match        http://*/course/view.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432988/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%20%E6%96%B0%E5%B9%B3%E5%8F%B0%EF%BC%88%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E8%BF%9B%E5%BA%A6%EF%BC%88%E8%A7%86%E9%A2%91%E5%92%8C%E8%BF%9B%E5%BA%A6%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%89%EF%BC%8C%E5%BD%A2%E8%80%83%EF%BC%8C%E8%80%83%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/432988/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%20%E6%96%B0%E5%B9%B3%E5%8F%B0%EF%BC%88%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E8%BF%9B%E5%BA%A6%EF%BC%88%E8%A7%86%E9%A2%91%E5%92%8C%E8%BF%9B%E5%BA%A6%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%89%EF%BC%8C%E5%BD%A2%E8%80%83%EF%BC%8C%E8%80%83%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


   (function ($) {
  $(function(){
  		//获取当前url
  		href= window.location.href.split('course')[0];
  		mid=window.location.href.split('mid=')[1];

  		$('div[role="main"]').css('display','none');
		//展示小节信息
		var sec=$('#region-main-box').attr('sec');
		var courseid=$('#alm').attr('courseid');
		$.ajaxSetup({
		    async : false
		});
		function aler(e){
		    $("body").append("<div style='width:20em;background-color:white;padding:0 20px;height: 6rem; text-align: center; position: fixed; top: 50%; margin-top: -1rem; line-height: 6rem;right:0;left:0;margin:auto' id='msg'><span>"+e+"</span></div>");
		    clearmsg();
		}
		function clearmsg(){

		};
		$.post(href+'theme/blueonionre/sectionInfo.php',{sectionid:sec,courseid:courseid},function(response){
			 data=JSON.parse(response);
			 var secinfo=data.secinfo;
			 var tmpsequence=data.sequence;
			 var sequence='';
			 $.each(tmpsequence,function(n,va){
			 	if(n < (tmpsequence.length -1)){
			 		sequence +=va+',';
			 	}else{
			 		sequence +=va
			 	}
			 })

			 var order=sequence.split(',');
			 lmes=new Array();
			 $.each(order,function(n,v){
			 	if(data[v]){
			 		lmes.push(data[v]);
			 	}

			 })
			 // $('.listinfo').append($("<p>"+secinfo.fsec+"</p>"));
			 $('#list span').html(secinfo.fsec+"<img style='position:absolute;right: 15px;;margin-top:10px;' src='"+href+"theme/blueonionre/pix/v.png'>");

			 delete secinfo.fsec;console.log(secinfo);
			 $.each(secinfo,function(na,va){
			 	$('.listinfo').append($("<a style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' href='"+href+"course/view.php?id="+courseid+"&sectionid="+va.id+"&mid="+va.sequence.split(',')[0]+"' title='"+va.name+"'>"+va.name+"</a>"));
			 })
			console.log(data)
			console.log(lmes)
			 delete data.sequence;
			 delete data.secinfo;
			 // '/mod/"+value.type+"/view.php?id="+value.id+"'
			 var i=1;
			 $.each(lmes,function(name,value){

			 	switch(value.type)
				{
				case "page":
				  	src=href+'theme/blueonionre/pix/page.png';
				  break;
				case "forum":
				  src=href+'theme/blueonionre/pix/forum.png';
				  break;
				case "quiz":
				  src=href+'theme/blueonionre/pix/quiz.png';
				  break;
				case "assign":
				  src=href+'theme/blueonionre/pix/assign.png';
				  break;
				 case "url":
				  src=href+'theme/blueonionre/pix/url.png';
				  break;
				}
			 	if(mid == value.id){
			 		if(value.is_com == '1'){
			 			var li=$("<li typ="+value.type+" availability='"+value.availability+"' is_com="+value.is_com+" class='act' i="+value.id+"> <div> <img src='"+href+"theme/blueonionre/pix/"+value.type+"(c).png'> <p title='"+value.name+"'>"+value.name+"</p> </div> </li>");
			 		}else{
			 			var li=$("<li typ="+value.type+" availability='"+value.availability+"' is_com="+value.is_com+" class='act' i="+value.id+"> <div> <img src='"+href+"theme/blueonionre/pix/"+value.type+".png'> <p title='"+value.name+"'>"+value.name+"</p> </div> </li>");
			 		}
			 		if(value.type == 'page'  || value.type == 'url'){
			 			if(value.type== 'url'){

				 			if($(window).width()<=768){
								video_height='179px';
							}else if($(window).width()>768 && $(window).width()<=1200){
								video_height='370px';
							}else{
								video_height='619px';
							}
			 				cnt = "<div>"+data[value.id].des+"</div><div id='video' style='height:"+video_height+"'></div>";
			 				// cnt = "<div>"+data[name].des+"</div><video width='100%' src='"+data[name].videourl+"' controls='controls'> 您的浏览器不支持 video 标签。 </video>";
			 			}else{
			 				cnt= "<div>"+data[value.id].cnt+"</div>";
			 				//发送ajax添加完成
			 				if(value.is_com != 1){
			 					$.get(href+'theme/blueonionre/modulesCompletion.php',{cmid:value.id,id:courseid,sectionid:sec},function(res){
				 					console.log(res)
				 					if(res==1){
				 						li.attr('is_com','1').find('img').attr('src',href+'theme/blueonionre/pix/'+value.type+'(c).png');
				 					}
				 				})
			 				}

			 			}
			 			$('#com div:first-child').html(cnt);

			 			if(data[value.id].type == 'url'){
			 				center=data[value.id].videourl.split('.ouchn.cn/')[0].split('oss')[1];
				 			if(center){
				 				videourl='http://oss.ouchn.cn/'+center+'/'+data[value.id].videourl.split('.ouchn.cn/')[1];
				 			}else{
				 				videourl=data[value.id].videourl;
				 			}

				 					var videoObject = {
					        container:'#video',
					        variable:'player',
					        autoplay:false,
					        video:videourl,
					        duration:10,
					        seek:0
					    };
    					var player=new ckplayer(videoObject);

    					function videoContol(ckplayerInstance) {
							var _this = this;
							this.video = ckplayerInstance.V;
							this.pastTime = 0;//缓存视频上一秒的播放时间
							this.currentTimeBeforeSeek = 0;//缓存开始拖动时的播放时间
							this.isSeeking = true;//是否在“拖动”状态

							//重置视频拖动播放前的位置
							function resetVideo() {


							}

							//视频播放事件
							this.video.ontimeupdate = function () {
								//如果出现拖动情况，重置状态（如果当前播放时间与上一次的时间相差超过1秒，就视为拖动行为）

							}

							//播放结束事件
							this.video.onended = function () {
								//如果用户一下子拖至视频的结束位置，重置状态
                            }

							//拖动播放事件
							this.video.onseeking = function () {

							}

							//拖动结束
							this.video.onseeked = function () {

							}

							return this;
						}

						//如果ckplayer使用的是h5的video播放器
						if (player.playerType == 'html5video' && data[mid].is_com != 1) {
							//实例化一个监控对象
							//new videoContol(player)
						}

			 			}



			 		}else{
			 			$('#com div:first-child').html(data[value.id].des);
			 			$('#com #ck').css('display','block').find('a').attr("href",href+"mod/"+value.type+"/view.php?id="+value.id);
			 		}
			 		// 完成情况
			 		if(value.is_com == '1'){
			 			$('#ov').css('display','block');


			 		}else{
			 			var sign=$('<div id="sign">标记为完成</div>');
			 			$('#ov').css('display','none');
			 			sign.click(function(){
			 				$.get(href+'theme/blueonionre/modulesCompletion.php',{cmid:value.id,id:courseid,sectionid:sec},function(res){
			 					console.log(res)
			 					if(res==1){
			 						$('#sign').css('display','none');
			 						$('#ov').css('display','block');
			 						$('.mlist li[i="'+value.id+'"]').attr('is_com','1').find('img').attr('src',href+'theme/blueonionre/pix/'+value.type+'(c).png');
			 					}
			 				})
			 			})
			 			$('#ov').before(sign);


			 		}
			 	}else{
			 		if(value.is_com == '1'){
			 			var li=$("<li typ="+value.type+" availability='"+value.availability+"' is_com="+value.is_com+" i="+value.id+"> <div> <img src='"+href+"theme/blueonionre/pix/"+value.type+"(c).png'> <p title='"+value.name+"'>"+value.name+"</p> </div> </li>");
			 		}else{
			 			var li=$("<li typ="+value.type+" availability='"+value.availability+"' is_com="+value.is_com+" i="+value.id+"> <div> <img src='"+href+"theme/blueonionre/pix/"+value.type+".png'> <p title='"+value.name+"'>"+value.name+"</p> </div> </li>");
			 		}
			 	}


			 	li.click(function(){
			 		var li_clicktyp=$(this).attr('typ');
			 		var _ava=true;
			 		if(JSON.parse($(this).attr('availability'))){
			 			var availability=JSON.parse($(this).attr('availability')).c;
				 		$.each(availability,function(k,v){
				 			switch(v.type)
							{
								case "completion":

									if(v.e ==1){
										if($('.mlist li[i='+v.cm+']').attr('is_com') !=1){
											if(li_clicktyp == 'quiz'){
								 				alert('请先观看完成本专题内的视频，再进行专题测验。');
								 			}else{
								 				alert('专题内视频需按顺序进行学习，请先观看上一视频。');

								 			}

								 			_ava=false;
								 			return false;
										}

									}

					  			break;
					  			case "date":

					  				if(v.d == '>='){
					  					if(Math.round(new Date() / 1000) < v.t ){
					  						alert('未到开启时间');
					  						_ava=false;
					  						return false;
					  					}
					  				}else{
					  					if(Math.round(new Date() / 1000) > v.t){
					  						alert('截止时间已过');
					  						_ava=false;
					  						return false;
					  					}
					  				}
					  			break;
					  		}

				 		})
			 		}



			 		if(!_ava){
			 			return false;
			 		}
			 		// if(($(this).prev().attr('is_com') ==0 || $(this).prev().attr('is_com') == 'false') && $(this).attr('typ') != 'page' &&  $(this).prev().attr('typ') != 'page' ){
			 		// 	if($(this).attr('typ') == 'quiz'){
			 		// 		alert('请先观看完成本专题内的视频，再进行专题测验。');
			 		// 	}else{
			 		// 		alert('专题内视频需按顺序进行学习，请先观看上一视频。');
			 		// 	}

			 		// 	return false;
			 		// }
			 		var url=window.location.href;
			 		window.location.href = url.replace(mid,value.id);
			 		return false;

			 	})
			 	$('#na ul').append(li);
			 	i++;
			 })

		})
		// 当前章节移动到合适位置
		function move_mod(){
			if($(window).width()<=768){
				var ind=$('.mlist .act').index()+1;
				if(ind>2){
					$('.mlist ul').css('left',(2-ind)*131 + 'px');
				}

			}else if($(window).width()>768 && $(window).width()<=1200){
				var ind=$('.mlist .act').index()+1;
				if(ind>3){
					$('.mlist ul').css('left',(3-ind)*221 + 'px');
				}

			}else{
				var ind=$('.mlist .act').index()+1;
				if(ind>5){
					$('.mlist ul').css('left',(5-ind)*221 + 'px');
				}

			}
		}
		move_mod();
    	//点击展开小节目录
    	// $('#list>span').click(function(){
    	// 	$('.listinfo').slideToggle();
    	// 	return false;
    	// })

    	//点击移动
    	//
    	function sec_move(){
    		if($(window).width()<=768){
				sec_width=131;
				sec_lgh=2;
			}else if($(window).width()>768 && $(window).width()<=1200){
				sec_lgh=3;
				sec_width=221;
			}else{
				sec_lgh=5;
				sec_width=221;
			}
			$('.mlist ul').css('width',sec_width*$('.mlist li').length+'px');
		}
		sec_move();

    	if($('.mlist li').length>sec_lgh){
			$('#sec_right').css('background-image','url("'+href+'theme/blueonionre/pix/btnrc.png")');
		}
    	$('#sec_right').click(function(){
    		if($('.mlist li').length<=sec_lgh){
    			var left=0;
    		}else{
    			var left= parseInt($('.mlist ul').css('left')) -sec_width;
    		}

    		if(left < 0 ){
    			setTimeout(function () {
			        $('#sec_left').css('background-image','url("'+href+'theme/blueonionre/pix/btnlc.png")');
			    }, 800);
    		}
    		if(-left > ($('.mlist li').length-(sec_lgh+1))*sec_width && $('.mlist li').length>sec_lgh){
    			left = -($('.mlist li').length-sec_lgh)*sec_width;
    			setTimeout(function () {
			        $('#sec_right').css('background-image','url("'+href+'theme/blueonionre/pix/btnr.png")');
			    }, 800);
    		}
    		$('.mlist ul').css('left',left + 'px');
    	})

		$('#sec_left').click(function(){
			left= parseInt($('.mlist ul').css('left')) +sec_width;
			if(-left <= ($('.mlist li').length-(sec_lgh+1))*sec_width){
				setTimeout(function () {
					$('#sec_right').css('background-image','url("'+href+'theme/blueonionre/pix/btnrc.png")');
			    }, 800);
			}
			if( left > -sec_width){
				left=0;
				setTimeout(function () {
			        $('#sec_left').css('background-image','url("'+href+'theme/blueonionre/pix/btnl.png")');
			    }, 800);

			}
    		$('.mlist ul').css('left',left + 'px');
    	})



    	$(window).resize(function() {
		     sec_move();
		     move_mod();
		});


    	// 页面离开或最小化暂停播放
		document.addEventListener("visibilitychange", function () {


		}, true);

	})

})(jQuery);

    var video = document.getElementsByTagName("video")[0];


    video.play();
    setTimeout(function () {

			      video.currentTime=video.duration-4;
video.play();

			    }, 3000);
setTimeout(function () {
history.go(0);

},6000)

})();
