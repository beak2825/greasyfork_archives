// ==UserScript==
// @name         去掉慕课网广告图标
// @namespace
// @version      0.1
// @description  去掉广告图标
// @author       e
// @include      /^http(s?)://www.imooc.com/(.*)$/
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/221396
// @downloadURL https://update.greasyfork.org/scripts/382632/%E5%8E%BB%E6%8E%89%E6%85%95%E8%AF%BE%E7%BD%91%E5%B9%BF%E5%91%8A%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/382632/%E5%8E%BB%E6%8E%89%E6%85%95%E8%AF%BE%E7%BD%91%E5%B9%BF%E5%91%8A%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==


(function () {
    'use strict';

   setTimeout(function () {
       $("#J_GotoTop").hide();
       $("#BindingPublicNumber").css('display','none');
       $(".publicnumber-block").css('display','none');
       $(".nv-share").css('display','none');
       $("#moco-top-advertising").hide();
      // $("#moco-top-advertising").hide();
   },1500);

 if($("#video-box").length>0){
           CreateNode();
          }
    function CreateNode(){
		let div=document.createElement("div");
		div.setAttribute("class","wasted_time");
        div.setAttribute("id","wasted_time");
		let style=document.createElement("style");
		div.appendChild(document.createTextNode("关灯"));
		style.appendChild(document.createTextNode(`
		.wasted_time{
				font-size:14px;
				position:fixed;
				display:block;
				text-align:center;
				cursor:pointer;
				padding:3px 20px;
				border-radius:3px;
				background-color:rgb(208, 212, 206);
				right:17px;
				bottom:3px;
				z-index:999999;
				color:rgb(17, 82, 17);
				text-shadow:0 0 0.1px rgba(0,0,0,0.5);
				user-select:none;
				box-shadow:0 0 7px 0 rgba(18, 80, 18,0.4),0 0 0 1px rgba(0,0,0,0.3);
			}
		`));
		document.querySelector("body").appendChild(div);
		document.querySelector("body").appendChild(style);
	};
    $(document).on('click','#wasted_time',function(){
        allofthelights();
  })

  function allofthelights(options) {

        var options = {
            'color': '#000000',
            'opacity': '0.9',
            'switch_id': 'wasted_time',
			'animation': 'fade',
			'delay_turn_on': 400,
			'delay_turn_off': 400,
			'scrolling': true,
			'clickable_bg': false,
			'is_responsive': true,
			'z_index': '10',
			'custom_player': null,
        };

        return $("#video-box-mocoplayer-hls-video_html5_api").each(function () {

			var $this		= $("#video-box-mocoplayer-hls-video_html5_api"),
			first_click		= true,
			offset			= null,
			height			= null,
			width			= null,
			width_window	= null,
			height_window	= null,
			button			= null,
			switch_off		= '#'+options.switch_id+'_off';

			if (options.is_responsive) {
				var selectors = [
				];

				if (options.custom_player) {
					selectors.push(options.custom_player);
				}

				var $allVideos = $(this).parent().find(selectors.join(','));


				$allVideos.each(function(){
					var $this = $(this);

					var height = ( this.tagName.toLowerCase() == 'object' || $this.attr('height') ) ? $this.attr('height') : $this.height(),
					width = $this.attr('width') ? $this.attr('width') : $this.width(),
					aspectRatio = height / width;
					if(!$this.attr('id')){
						var videoID = 'fitvid' + Math.floor(Math.random()*999999);
						$this.attr('id', videoID);
					}

				});
			}

			$('body').on('click', switch_off, function() {
				variables();
				update();
				$('div.allofthelights_bg').fadeOut(+options.delay_turn_off);
				$('#'+options.switch_id+'_off').fadeOut(0);
                $('#'+options.switch_id).css('display',"block");
				if (!options.scrolling) {
					$('body').css('overflow', 'auto');
				}
			}).on('click', '#'+options.switch_id, function() {
				variables();
				if (first_click) {
					first_click = false;
					var html = "<style type='text/css'>.allofthelights_bg {display:none;position:absolute;background:"+options.color+";z-index:"+options.z_index+";}</style>" + "<div id='"+options.switch_id+"_off' style='background-color:rgb(208, 212, 206);cursor:pointer;user-select:none;text-shadow:0 0 0.1px rgba(0,0,0,0.5);color:rgb(17, 82, 17);box-shadow:0 0 7px 0 rgba(18, 80, 18,0.4),0 0 0 1px rgba(0,0,0,0.3);z-index:999999;border-radius:3px;text-align:center;font-size:14px;padding:3px 20px;display:none;position:absolute;top:"+button.top+"px;left:"+button.left+"px;'>开灯</div>";
					var i 	 = 0;
					for ( i = 1 ; i <= 4 ; ++i ) {
						html += "<div id='allofthelights_bg"+i+"' class='allofthelights_bg'></div>"
					}
					$('body').append(html);
                    $('#'+options.switch_id).css('display',"none");
					$('.allofthelights_bg').css('opacity',+options.opacity);
					update();
				}
				$('#'+options.switch_id+'_off').fadeIn(0);
				$('div.allofthelights_bg').fadeIn(+options.delay_turn_on);

				if (!options.scrolling) {
					$('body').css('overflow', 'hidden');
				}
			});

			function variables() {
				offset 		= $this.offset();
				height 		= $this.height();
				width 		= $this.width();
				width_window 	= $(document).width();
				height_window 	= $(document).height();
				button 		= $('#'+options.switch_id).offset();
			}

			function update() {
				$('#'+options.switch_id+'_off').css({
					'top': button.top,
					'left': button.left
				});
				$('#allofthelights_bg1').css({
					'top': '0px',
					'height': offset.top,
					'left': '0px',
					'right': '0px'
				});
				$('#allofthelights_bg2').css({
					'height': height,
					'top': offset.top,
					'left': '0px',
					'right': (width_window - offset.left)
				});
				$('#allofthelights_bg3').css({
					'height': height,
					'top': offset.top,
					'right': '0px',
					'bottom': '0px',
					'left': (offset.left+width)
				});
				$('#allofthelights_bg4').css({
					'height': (height_window-(offset.top+height)),
					'top': (offset.top+height),
					'bottom': '0px',
					'left': '0px',
					'right': '0px'
				});
			}
        });
    };

})();