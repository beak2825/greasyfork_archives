// ==UserScript==
// @name        Friend Filter for SteamDB Instant Search
// @namespace   https://greasyfork.org/users/726
// @author      Deparsoul
// @description 在 SteamDB 的即时搜索页面上直接查看好友是否拥有该游戏并进行过滤
// @icon        https://blog.algolia.com/wp-content/themes/algolia/favicon.ico
// @include     https://steamdb.info/instantsearch*
// @version     20250131
// @require     https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.2.2.min.js
// @supportURL  https://keylol.com/t179815-1-1
// @grant       GM_xmlhttpRequest
// @connect     steamcommunity.com
// @downloadURL https://update.greasyfork.org/scripts/425883/Friend%20Filter%20for%20SteamDB%20Instant%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/425883/Friend%20Filter%20for%20SteamDB%20Instant%20Search.meta.js
// ==/UserScript==

'use strict';

$('.container-search').prepend(
    '<div class="row-fluid"><div class="panel"><div class="panel-heading">点击选中你想要分析的好友<button id="friend_list_toggle">显示全部好友 / 仅显示选中好友</button></div><input type="text" placeholder="输入好友名称、昵称、分组等进行搜索" id="friend_filter" style="width:100%;"><ul id="friend_list"></ul><div style="clear:both;"></div></div></div>' +
    '<style>#friend_list{list-style-type:none;}#friend_list>li{display:block;float:left;width:200px;height:32px;margin-right:10px;margin-bottom:10px;cursor:pointer;}.friend_avatar{width:32px;margin-right:2px;vertical-align:top;}#friend_list>li:hover{background-color:#00406b;}#friend_list>li.friend_chosen{background-color:#00406b;}#friend_list>li>div{display:inline-block;margin-left:4px;}.friend_name, .friend_extra{font-size:14px;line-height:18px;display:inline-block;width:110px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;float:left;}.friend_extra{clear:left;font-size:10px;line-height:10px;}.friend_games{display:inline-block;float:right;padding:5px;width:40px;height:32px;text-align:center;}.friend_details>span{line-height:32px;color:white;padding:0px 4px;}.s-hit:hover{opacity:1!important;}.friend_options>p{margin-bottom:8px;}.friend_options label{font-weight:normal;}.friend_loading{background:url("data:image/gif;base64,R0lGODlhHgAgAIQAAAQCBHRydDw6PBweHLSytAwKDFRSVMzKzERCRNza3AQGBIyKjDw+PCQiJAwODNTS1N3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAAQACwAAAAAHgAgAAAFSiAkjqR4GI4iEGXrls8AzIDCvjgZ0LSQ/xABb6YA5hBDgMOIWyQNzFeCwRscotIFgxG4Yr/gsHhMLpvP6LR6zW673/C4fE6v29shACH5BAkEABEALAAAAAAeACAAhAQCBHRydDw6PKyurBweHFRSVMzKzAwKDERCRNza3AQGBIyKjDw+PLSytNTS1AwODERGRN3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVKYCSO5NgIylMYZeuWwwHMAOG8eCnQdJD/EQVvJgDmZEOEEVcYAhbLl4HAQySi0gADsbhiv+CweEwum8/otHrNbrvf8Lh8Tq/b2SEAIfkECQQAFwAsAAAAAB4AIACEBAIEdHZ0PDo8rK6sHB4clJKUXFpc1NbUjI6MREZEDAoMfH58vLq8LC4sfHp8PD48tLK0JCYkpKakXF5c3NrcTEpMDA4M3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUrgJY5kiUQA4VBl65YLIMvGa5eHMs/F7Q+7WcJ3gwRlAqKNQjgGlDZJsHGA2hgTQWJRtXq/4LB4TC6bz+i0es1uu9/wuHxOr9uVIQAh+QQJBAAUACwAAAAAHgAgAIQEAgSEhoQ0NjS0trQcGhxUUlTU1tQMDgysrqzExsSUlpQ8Pjy8vrwEBgSMjow8Ojy8urwsLixkYmQUFhTd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSSAljmRJGQhkrmzpHAAQMW1NInE+DbZd5DlBr/YAxhrDlsQIICRZCRgw8GQNHo3JQ1Hter/gsHhMLpvP6LR6zW673/C4fE5PhwAAIfkECQQAFwAsAAAAAB4AIACEBAIEdHJ0PDo8rKqsXFpczM7MHB4cHBocbGps1NbUDA4MjIqMTEpMxMLEBAYEREJErK6sXF5c1NLUNDY0bG5s3NrclJKU3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUrgJY5kKTZDYa4smTAA4FBqa49RrB/NfSs6HcFncwRjAmLrcQQglKyGITiRQFmSBcUCqVy/4LB4TC6bz+i0es1uu9/wuHxOr9vVIQAh+QQJBAARACwAAAAAHgAgAIQEAgR0dnQ8OjysqqxcWlyMioxMTkzMysxsamyUkpTU1tREQkRkYmRUUlRsbmyUlpTc2tzd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRWAkjmRpnmgqFsuSqDDJADRAKLF61PWC56cBr4YAnnZDgMB4ciQDzNPDQBUEINGsdsvter/gsHhMLpvP6LR6zW673/BICAAh+QQJBAAXACwAAAAAHgAgAIQEAgR0cnSsrqw0NjSMjozExsRUUlTU0tQUFhSkoqR8enxMSkyUlpRkZmTc2twMDgx0dnQ8OjyUkpTMzsxUVlTU1tQkJiTd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFS+AljmRpnmg6JgHjqDBpAHRUxXBC78uNo4HdjvL6mQjCHcFoqliSAAjTNGlEBg8AojBNHQSHrnhMLpvP6LR6zW673/C4fE6v2+/sEAAh+QQJBAASACwAAAAAHgAgAIQEAgSEgoREQkQcGhy0srQMDgwsKizExsSUkpRcWlzMzswEBgRERkQcHhwUFhQsLizMysycnpzd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFR6AkjmRpnmiqrmzgLAzEsghgA88xq8JtO7LdieGzMRRCU6RoSyRNCIPDJ3iiDoFCg2Dter/gsHhMLpvP6LR6zW673/C4vBwCACH5BAkEABgALAAAAAAeACAAhAQCBHR2dKyqrCwuLBQWFMTGxIyOjLy6vExKTCQiJJyenBQSFNTW1AQGBHx+fKyurDQ2NBwaHJSSlLy+vFRSVCQmJKSipNza3N3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAVLICaOZGmeaKqurMg8U9seEQBQl6xCtm3oqUYPsHgAT4khYHA0KYTDX5M0cSCGgqmJZgtoTZZFovAtm8/otHrNbrvf8Lh8Tq/b7+UQACH5BAkEABYALAAAAAAeACAAhAQCBHR2dKyqrDQ2NMzKzGRiZJSSlERCRDQyNLy6vAwKDLSytNTW1KSipExKTAQGBIyKjKyurDw+PJSWlERGRNza3N3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVRoCWOZGmeaKqubOuaSQAxrxo9ADBUNerkOUPvdADmJsNSwwhA0JIjQQGXC0BLC0SO8ryKCEWAxEtaAh7kEUPysKbf8Lh8Tq/b7/i8fs/v++EhACH5BAkEABkALAAAAAAeACAAhAQCBHRydKyqrDQ2NMTGxBQWFFRWVJSSlAwODLy6vNTW1ISGhDw+PGRmZMTCxAQGBHR2dDw6PMzKzCQmJFxaXJyenBQSFLy+vNza3N3d3QAAAAAAAAAAAAAAAAAAAAAAAAVQYCaOZGmeaKqubOu+cClRzBGnEaAL9/nogIGjV8oBB0QSwYDQIRJJUqUJsGCiI4fuocCOFpHGxTsK7MgZIwQ9nQzR8Lh8Tq/b7/i8fs/vu0IAIfkECQQAHQAsAAAAAB4AIACEBAIEbG5spKakPDo8jI6MxMLEJCIkDA4MXF5cnJqcfHp8tLK0zM7MDAoMTEpMlJaU1NbUBAYEdHJ0rK6sPD48lJKUJCYkFBIUZGJkpKKkfH58tLa01NLU3d3dAAAAAAAABVdgJ45kaZ5oqq5s675wLM90PSLNwNjjBvwanqjwAxCEosqAgpkgO4wIoAFBMn6RHfLheDxFCkrmufgdnkSA4SsIFL7wuEggeSPTFrL5KxHL/4CBgoOEKiEAIfkECQQAIQAsAAAAAB4AIACFBAIEfHp8PD48rK6sHB4clJaUXFpcxMbEjIqMLC4sDAoMvLq8ZGZkhIKEVFJUJCYkpKKk3NrclJKUNDY0xMLEbG5sBAYEJCIkzM7MjI6MNDI0DA4MvL68bGpshIaEVFZUrKqs3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmHAkHBILBqPyKRyyWw6n9CodEqtWq/YLCahQGRDCACA8F1YAJ9viAKJqCOGS+YLEVu+nHNCvfBg1IAhBwwNagJic1kTYl5ZHA4VboGTlFQcA2ogZwxfAWJ7WRQPGwWVpiFBACH5BAkEAB4ALAAAAAAeACAAhAQCBHx6fKyurERGRMTGxIyOjBwaHLy6vFxaXJyanNTS1BQWFIyKjLS2tFRSVJSWlCQmJMTCxGxqbAwKDHx+fLSytExKTMzKzJSSlLy+vFxeXJyenNTW1CwuLN3d3QAAAAVVoCeOZGmeaKqubOu+cCzPdG3feK6bDbFLAEBD1wlSdJgJ5LJrih6ag+4QNOgqwcWOYRE4v7rIhqPLTAADXSKr4wwWDLD8xaHEdYjgHWcJBsoDCAoqIQAh+QQJBAAfACwAAAAAHgAgAIQEAgR0cnSsrqxEQkTExsQcHhyUkpTU0tS8urw0NjQMDgyMiowkJiSkoqR8fnxkYmTMzszc2tzEwsQEBgR0dnS0srTMyswkIiScmpzU1tS8vrwUFhQsKiykpqRsamzd3d0FW+AnjmRpnmiqrmzrvnAsz3Rt33iu7/wqIbvOBODQeQCAgU5TUGB6vExkt5gUCDoOspgLABSVnQYCLdsihx3kAgjoDMhNjBA2ETaAB0wwdJsOGjEUSAk6EgxOLyEAIfkECQQAHgAsAAAAAB4AIACEBAIEdHJ0rKqsPDo8HB4cxMbElJKUhIKEtLa0XF5cLC4sHBoc1NLUDAoMfHp8tLK0VFJUJCYkBAYErK6sREJEzMrMpKakjIqMvLq8bGpsNDY03NrcfH58LCos3d3dAAAABVqgJ45kaZ5oqq5s675wLM90bd94ru9877ObCWM3ACx0G4BylwEMeJufziLYHZQXHUSZ0CEiHYx0TApoDKgoDKFsqEeFSAP9KkgABBNHqYg9AgUmD3cZOwUPKiEAIfkECQQAHgAsAAAAAB4AIACEBAIEdHZ0rK6sPDo8xMbEjI6MHBocXFpc1NLUnJqcvLq8DA4MfH58TEpMzM7MlJaUJCIkbGps3NrcxMLEBAYEfHp8PD48zMrMlJKUHB4cXF5c1NbUnJ6cvL683d3dAAAABV6gJ45kaZ5oqq5s675wLM90bd94ru987//AYGlzaHR0FQCgoSsoD7sCYyP8XY6vy8OBElAADBfCAIBITgHlwNVRArimSWaReEUMAdWZxLBwdApKC3s3BF8GOwIBEy8hACH5BAkEABoALAAAAAAeACAAhAQCBHx6fDw+PLSytMzKzBwaHFxeXLy+vAwODKyqrExOTNTW1JSSlCwqLMTGxAQGBHx+fERGRLy6vNTS1GxubMTCxBQWFFRSVNza3CwuLN3d3QAAAAAAAAAAAAAAAAAAAAVToCaOZGmeaKqubOu+cCzPdG3feK7vfO//rgWEsTMAAMRc5BjQSSwAim7xOFZyGCiCoDsEJD7MddoAKHSDIwCTW2TMO4wjxdZhBFFd4vjQTaARLSEAIfkECQQAGgAsAAAAAB4AIACEBAIEdHZ0NDY0rKqszMrMJCIkTE5MvLq8DA4MjI6M1NbULCosREJEtLK0pKKkBAYErK6s1NLUJCYkZGJkxMLEFBIUlJKU3NrcLC4sREZE3d3dAAAAAAAAAAAAAAAAAAAABVOgJo5kaZ5oqq5s675wLM90bd94ru/sBRE7DADR0AGOEx3imNAJAA+KrnJ06BIFhkJ3eRp0jSMgklMsAIzdRcoTDQJs3OFY0EGOiF2AYW37/4A0IQAh+QQJBAAYACwAAAAAHgAgAIQEAgR0cnRERkS0trRcXlwcHhzMzswMCgxUVlS8vrxsamxMTkwsKizU1tQEBgSEgoRMSky8urxkYmQMDgzEwsRsbmwsLizc2tzd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAFRyAmjmRpnmiqrmzrvnAsz3Rt33iupwnjVDoIYBjJCYaAQU4xFASHwBxh+NAtoLqIZZLQXRiAQiNnQHalDsRuzW673/C4PBYCACH5BAkEABQALAAAAAAeACAAhAQCBGxqbDw+PJyenFxaXMzKzBQWFJSWlExKTKyqrAwKDHx6fGRiZLSytAQGBGxubERCRFxeXExOTKyurN3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVJICWOZGmeaKqubOu+cCzPdG3LCQIdt9g4gCDvFgkGIb2AEYDoLYyOSe9hHPQogqDhSiEEm9cigMAtSCQFrnrNbrvf8Lh8Tq+HAAAh+QQJBAAVACwAAAAAHgAgAIQEAgR0dnSsqqzMzsw8PjwcGhy8vrycnpzU1tQMCgx8fny0srRUUlQEBgSsrqzU0tQsKizEwsTc2tyEgoRUVlTd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSWAljmRpnmiqrmzrvnAsz7Q4CFFdTgkAUBJdZeErKoSBoo8gnCgBDKSysRAeigWHsPIoACCGreghQIjP6LR6zW673/C4fE4/hwAAIfkECQQAEAAsAAAAAB4AIACEBAIEdHZ0rKqsPD48zM7MHB4ctLK0DAoMXFpc1NbUBAYEpKakrK6sTEpMtLa03Nrc3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAgJI5kaZ5oqq5s676iMRzKYMDnogA8oCw40qPQ6xUeQZGjWHQkIQJmD5gkSHmEJwQhRWghiUaxkfiKBIEAw8xuu9/wuHxOr9vv+Lx+z3eHAAAh+QQJBAAQACwAAAAAHgAgAIQEAgR8enxEQkS0trQcGhyEgoRcXlzU0tQkJiRkZmQUFhR8fnyEhoRkYmTU1tQsLizd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSSAkjmRpnmiqrmw7DkEwuKsB3IBBowWOFzsTwndDBEtE3JGkSCqWo0ayARUdHr7HoSpyLASCgINLLpvP6LR6zW673/C4fE6vt0MAIfkECQQADwAsAAAAAB4AIACDBAIEdHJ0PDo8tLK0HB4cDAoMVFJUzMrMREZE3NrcBAYEjIqMPD48DA4M1NLU3d3dBEbwyUmrvThrfUxTwrCNDgGcgCKOWYCiApsx76nIGFIDDX4tO4PPktChCIchcYFgBJLKqHRKrVqv2Kx2y+16v+CweEwumzcRACH5BAkEABcALAAAAAAeACAAhAQCBHRydDw+PKyurCQmJMTGxAwODFxaXIyKjNTS1FRSVLS2tBQWFJyanNza3AwKDERCRDQyNBQSFGRmZJSSlNTW1Ly6vN3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVK4CWOZGme6FUNi5O+JiUBALHA+EDvTIK/it0O8UsJhLRAETVBAhrLU8EgjLiiJovgYTj4sOCweEwum8/otHrNbrvf8Lh8Tq/byyEAIfkECQQAEQAsAAAAAB4AIACEBAIEdHZ0PD48tLK0VFJUJCIkDAoMREZEzMrM3NrcBAYEjI6MREJEVFZUDA4MTEpM1NLU3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUpgJI5kaZ5ohDSOIQxpTEIFYAMKLMfBfQu7mMBnUwRTByLAcUQtlITmKZG8FRDS6eIgCGCz4LB4TC6bz+i0es1uu9/wuHxOr9vJIQAh+QQJBAAXACwAAAAAHgAgAIQEAgR0dnSsqqw8OjwcGhyUkpTU1tRcXlx8fny0trQMCgxMSkwsKix8enysrqwcHhykpqTc2txsbmyEgoS8vrwMDgxUUlTd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSuAljiOFBAKpruzYADCwGG2tQnEs2fxl5TBCzzYAwoa1g5GBbFEUwEKzBXnAFIhpLZJw0LTgsHhMLpvP6LR6zW673/C4fE6v28khACH5BAkEABEALAAAAAAeACAAhAQCBHRydDw6PLSytBweHAwKDFRSVMzKzIyKjERGRNza3AQGBHR2dDw+PCQiJAwODNTS1N3d3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVLYCSOpIIkDQORbOtGSgLMAHG8OIvQtJH/ERkP8ADmGkPAwogLJAXMF4TAWwyir4OhsBBcseCweEwum8/otHrNbrvf8Lh8Tq/b7/AQADs=") no-repeat 50% 50%}</style>'
);

$('.container > .row > .span4').prepend(
    '<div class="panel"><div class="panel-heading">好友过滤选项</div><div class="friend_options">' +
    '<p>每页最多显示 <select id="friend_hPP"><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select> 条结果</p>' +
    '<p>显示 <select id="friend_show"><option value="5">至少 5 人拥有</option><option value="4">至少 4 人拥有</option><option value="3">至少 3 人拥有</option><option value="2">至少 2 人拥有</option><option value="1">至少 1 人拥有</option><option value="-1">所选好友都没有</option><option selected value="0">所有</option></select> 的游戏</p>' +
    '<p><label><input type="checkbox" id="friend_opacity" checked> 用透明度区分拥有游戏的好友人数</label></p>' +
    '<p><label><input type="checkbox" id="friend_store" checked> 点击搜索结果直接打开Steam商店页面</label></p>' +
    '</div></div>'
);

function add_player(data) {
    var avatar = data.m_strAvatarHash;
	// 修改了头像域名。
    $('#friend_list').append('<li data-id="' + data.m_unAccountID + '" data-steamid="' + data.m_ulSteamID + '"><img class="friend_avatar" title="' + data.m_strName + '" src="' + data.avatar.replace('https://avatars.st.dl.eccdnx.com','https://avatars.cloudflare.steamstatic.com').replace('.jpg','_medium.jpg') + '"><div><span class="friend_name">' + data.m_strName + '</span><span class="friend_extra">' + (data.m_strNickname || '') + '</span></div><span class="friend_games"></span></li>');
}

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://steamcommunity.com/my/friends',
    onload: function (response) {
        var html = (new DOMParser()).parseFromString(response.responseText, 'text/html');
        var fbs = html.querySelectorAll('.friend_block_v2');

        if (fbs) {
            var user_info = JSON.parse(html.querySelector('#webui_config').getAttribute('data-userinfo'));
            var me = {
                avatar: html.querySelector('.user_avatar.playerAvatar > img').src,
                m_unAccountID: user_info.accountid,
                m_ulSteamID: user_info.steamid,
                m_strName: html.querySelector('.friends_header_name > a').innerText,
                m_strNickname: ''
            };
            add_player(me);

            for (var i = 0; i < fbs.length; i++) {
                var argv = {
                    avatar: fbs[i].querySelector('.player_avatar > img').src.replace('_medium', ''),
                    m_unAccountID: fbs[i].getAttribute('data-miniprofile'),
                    m_ulSteamID: fbs[i].getAttribute('data-steamid'),
                    m_strName: fbs[i].getAttribute('data-search').replace(/ ; .*/, ''),
                    m_strNickname: fbs[i].querySelector('.friend_block_content').firstChild.data
                };
                console.log(argv);
                add_player(argv);
            }
        } else {
            $('#friend_list').html('<a target="_blank" href="https://steamcommunity.com/login">请先登录 Steam 社区</a>，然后刷新本页面');
        }
    }
});

var cache = {};
function load_cache(li) {
    var steamid = li.data('steamid');
    if (cache.hasOwnProperty(steamid)) {
        refresh_hits();
        return;
    }
    cache[steamid] = {};
    var games = li.find('.friend_games');
    games.addClass('friend_loading');
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://steamcommunity.com/profiles/' + steamid + '/games/?tab=all',
        onload: function (response) {
            var count = 0;
            var text = response.responseText;
			var el = (new DOMParser()).parseFromString(text, 'text/html');
			var html = el.querySelector('#gameslist_config').getAttribute('data-profile-gameslist');
            var reg = /"appid":(\d+),"name"/g;
            var match = reg.exec(html);
            while (match != null) {
                var appid = match[1];
                cache[steamid][appid] = true;
                ++count;
                match = reg.exec(html);
            }
            games.removeClass('friend_loading').text(count);
            refresh_hits();
        }
    });
}

$('#friend_list').on('click', 'li', function () {
    var li = $(this);
    if (li.hasClass('friend_chosen')) {
        li.removeClass('friend_chosen');
        refresh_hits();
    } else {
        li.addClass('friend_chosen');
        load_cache(li);
    }
    li.detach();
    var last_chosen = $('.friend_chosen:last');
    if (last_chosen.length)
        li.insertAfter(last_chosen);
    else
        $('#friend_list').prepend(li);
});

$('#friend_filter').keyup(function () {
    var input = $(this);
    var q = input.val().trim().toLowerCase();
    $('#friend_list>li').each(function () {
        var li = $(this);
        if (q && li.text().toLowerCase().indexOf(q) < 0)
            li.hide();
        else
            li.show();
    });
});
$('#friend_list_toggle').click(function () {
    var hide = $('#friend_list>li:not(.friend_chosen):visible').length > 0;
    $('#friend_filter').val('').keyup();
    if (hide)
        $('#friend_list>li:not(.friend_chosen)').hide();
});

var refreshing = false;
var timer = -1;
function refresh_hits(level) {
    level = level || 0;

    var friends = $('.friend_chosen');
    $('#friend_show>option').each(function () {
        var option = $(this);
        var val = option.val();
        if (val > friends.length)
            option.hide();
        else
            option.show();
    });
    if ($('#friend_show').val() > friends.length)
        $('#friend_show').val($('#friend_show>option:visible:first').val());
    var show = $('#friend_show').val();

    clearTimeout(timer);
    if (refreshing)
        return;
    console.log('refreshing');
    refreshing = true;

    $('.s-hit').each(function () {
        if (friends.length < 1)
            return;

        var hit = $(this);

        hit.removeClass('s-hit--owned');

        var details = hit.find('.friend_avatars');
        if (level == 0 || details.length == 0) {
            var appid = hit.attr('href').match(/\d+/)[0];
            if (details.length > 0) {
                details.html('');
            } else {
                hit.find('.s-hit--details').after('<div class="friend_details"><span>好友</span><span class="friend_avatars"></span></div>');
                details = hit.find('.friend_avatars');
            }
            friends.each(function () {
                var friend = $(this);
                if (cache[friend.data('steamid')][appid])
                    details.append(friend.find('.friend_avatar').clone());
            });
        } else {
            if (level > 1)
                return;
        }

        var count = hit.find('.friend_avatar').length;
        var hide = false;
        if (show == -1) {
            if (count > 0)
                hide = true;
        } else {
            if (count < friends.length && count < show)
                hide = true;
        }
        if (hide)
            hit.hide();
        else
            hit.show();
		/*
        var opacity = 1;
        if ($('#friend_opacity').is(':checked'))
            opacity = .3 + .7 * (count / friends.length);
        hit.css('opacity', opacity);
		*/
		// 会导致 steamdb 本来的隐藏已拥有功能失效
    });
    refreshing = false;
}

$('#hits').bind("DOMSubtreeModified", function () {
    if (refreshing)
        return;
    clearTimeout(timer);
    timer = setTimeout(function () {
        refresh_hits(2);
    }, 500);
});

var hPP = location.href.match(/hPP=(\d+)/);
hPP = hPP ? hPP[1] : 20;
$('#friend_hPP').val(hPP).change(function () {
    if (!confirm('修改每页结果数量需要刷新网页，你需要重新选择好友，是否确定要修改？')) {
        $(this).val(hPP);
        return false;
    }
    hPP = $(this).val();
    hPP = 'hPP=' + hPP;
    var href = location.href.replace(/hPP=(\d+)/, hPP);
    if (href == location.href) {
        if (href.match(/\?/))
            href += '&' + hPP;
        else
            href += '?' + hPP;
    }
    location.href = href;
});
$('#friend_show, #friend_opacity').change(function () {
    refresh_hits(1);
});
$('#hits').on('click', '.s-hit', function () {
    if ($('#friend_store').is(':checked')) {
        window.open('http://store.steampowered.com' + $(this).attr('href'), '_blank');
        return false;
    } else {
        return true;
    }
});
