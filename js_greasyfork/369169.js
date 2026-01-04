// ==UserScript==
// @name			When you can create Steam booster pack
// @name:zh-CN			Steam补充包制作时间显示
// @version	 		0.3
// @description			Show the time when you can create Steam booster pack at creator page.
// @description:zh-CN		Steam已隐藏下一个补充包制作时间的显示，安装后可恢复显示
// @author			QHS
// @include			*steamcommunity.com/*boostercreator*
// @icon			http://pan.hriq.org/steam.green.ico
// @namespace 			https://greasyfork.org/users/155548-黑山東雲光圈研究所
// @namespace 			https://steamcommunity.com/profiles/76561198132556503
// @downloadURL https://update.greasyfork.org/scripts/369169/When%20you%20can%20create%20Steam%20booster%20pack.user.js
// @updateURL https://update.greasyfork.org/scripts/369169/When%20you%20can%20create%20Steam%20booster%20pack.meta.js
// ==/UserScript==

$J('.booster_game_selector').after('<div id="atime_insert" style="color: #f56795;margin-bottom: 12px;"></div>');
$J( '#booster_game_selector' ).change( function() {
    check();
});
function check(){
	if ($J('#booster_game_selector_booster')[0].children.length > 0) {
		var atime = CBoosterCreatorPage.sm_rgBoosterData[$J( '#booster_game_selector' ).val()].available_at_time;
		if(atime){
			$J('#atime_insert').html('You will not be able to create another Booster Pack until '+atime+'.');
		}else{
			$J('#atime_insert').html('');
        }
	}
}check();
