// ==UserScript==
// @name         steam card exchange simple viewer
// @namespace    https://github.com/deathxlent/steamcardexchangeviewer
// @version      0.11
// @description  just click the 'Sets Available' view showcase on the right side
// @author       deathxlent
// @match        http://www.steamcardexchange.net/index.php?inventory
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26254/steam%20card%20exchange%20simple%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/26254/steam%20card%20exchange%20simple%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$('#notification').prepend('<style>div.showcase-element {width: 120px; height:240px ;  position: relative;       float: left;    background-color: #18191B;    background-color: rgba(0, 0, 0, .3);}</style>');
	var noneedReg=new RegExp('<div class="showcase-element"></div>','g');
    $('#inventorylist > tbody > tr > td:nth-child(4)').each(function(){
	    var ele=$(this);
		ele.unbind();
		ele.css("border","1px #338FCC solid");
		ele.css("cursor","pointer");
		ele.bind("click",function(){
			var id=ele.attr("id").replace('set-','');
			$("div").remove("#div_d");
			$.ajax({
				url:'http://www.steamcardexchange.net/index.php?gamepage-appid-'+id,
				type:'GET',
				async:true,
				dataType:'text',
				success:function(data){
					$('#notification').prepend("<div id='div_d' style='position:absolute;right:0;top:"+ele.position().top+"px;height:80%;width:400px;'></div>");
					var obj=jQuery.parseHTML(data);
					var htmlStr='';
					$(obj).find('.showcase-element-container').each(function(){
						htmlStr+=$(this).attr('class').replace('showcase-element-container ','')+"<br/>"+$(this).html().replace(noneedReg,'');
					});
					$('#div_d').html(htmlStr);
				}
			});
		});
	});

})();