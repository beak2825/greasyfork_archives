// ==UserScript==
// @name         Gems
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to show how much gems to get when resolve background or emotion
// @author       You
// @match        http://steamcommunity.com/market/*
// @match        https://steamcommunity.com/market/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @connect     sp0.baidu.com
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/39888/Gems.user.js
// @updateURL https://update.greasyfork.org/scripts/39888/Gems.meta.js
// ==/UserScript==

(function() {

    var login = document.getElementsByTagName("body")[0];
    login.onclick = function(){
        var x=document.getElementsByClassName("market_listing_row_link");
        for (var i=0;i<x.length;i++)
        {
            var str = x[i].toString().split('-')[0];
            var arr = str.split('/');
            var code = arr[arr.length -1];


            var elmDiv = document.createElement('div');
            elmDiv.id = "gems"+i;
            elmDiv.innerHTML = 0;
            var elmDivResoult = document.querySelector('#result_'+i);
            elmDivResoult.appendChild(elmDiv);

            getMaxGems(code,i);
        }

    };
    function getMaxGems(code,x){
        getGems(code,5,x);
        getGems(code,11,x);
        getGems(code,17,x);
    }

    function getGems(code,i,x){
           var url3 = "https://steamcommunity.com/auction/ajaxgetgoovalueforitemtype/?appid="+code+"&item_type="+i;
           var s = "";
           $.getJSON(url3,function(data){

               s = data.goo_value ;
               if(Number(s) > Number(document.querySelector('#gems'+x).innerHTML))
                   document.querySelector('#gems'+x).innerHTML = s ;
    });
           return Number(s);
    }

})();



/*
<a class="market_listing_row_link" href="http://steamcommunity.com/market/listings/753/563910-Swamp?filter=%E8%83%8C%E6%99%AF" id="resultlink_0">
	<div class="market_listing_row market_recent_listing_row market_listing_searchresult" id="result_0">
				<img id="result_0_image" src="http://community.edgecast.steamstatic.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGGoLZAwO94OaJ90-mvWF4gueBAVjG3S0nR0WOUfO6pl1NtN5F7dkurw5gZ7o0CXp95SOK_D8LCLg/62fx62f" srcset="http://community.edgecast.steamstatic.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGGoLZAwO94OaJ90-mvWF4gueBAVjG3S0nR0WOUfO6pl1NtN5F7dkurw5gZ7o0CXp95SOK_D8LCLg/62fx62f 1x, http://community.edgecast.steamstatic.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGGoLZAwO94OaJ90-mvWF4gueBAVjG3S0nR0WOUfO6pl1NtN5F7dkurw5gZ7o0CXp95SOK_D8LCLg/62fx62fdpx2x 2x" style="" class="market_listing_item_img" alt="">
				<div class="market_listing_price_listings_block">
			<div class="market_listing_right_cell market_listing_num_listings">
				<span class="market_table_value">
					<span class="market_listing_num_listings_qty">7</span>
				</span>
			</div>
			<div class="market_listing_right_cell market_listing_their_price">
				<span class="market_table_value normal_price">
					起价：<br>
					<span class="normal_price">¥ 0.09</span>
					<span class="sale_price">¥ 0.08</span>
				</span>
				<span class="market_arrow_down" style="display: none"></span>
				<span class="market_arrow_up" style="display: none"></span>
			</div>
		</div>

				<div class="market_listing_item_name_block">
			<span id="result_0_name" class="market_listing_item_name" style="color: #;">Swamp</span>
			<br>
			<span class="market_listing_game_name">Guardian Of December 个人资料背景</span>
		</div>
		<div style="clear: both"></div>
	</div>
</a>*/