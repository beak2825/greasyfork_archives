// ==UserScript==
// @name       Highlight DLC in SteamDB
// @namespace  sharkiller
// @version    0.1
// @description  Highlight DLC owned in SteamDB
// @match      http://steamdb.info/app/*/dlc/
// @require    http://code.jquery.com/jquery-latest.js
// @require    http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js
// @author     Sharkiller
// @downloadURL https://update.greasyfork.org/scripts/3300/Highlight%20DLC%20in%20SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/3300/Highlight%20DLC%20in%20SteamDB.meta.js
// ==/UserScript==

$("body").prepend('<style>\
	tr.hidden:hover td {background-color: #D99E9E!important;border-color: #E29E9E;}\
	tr.hidden td {background-color: #F9B9B9;border-color: #F3B3B3;}\
	tr.free:hover td {background-color: #AFD99E!important;border-color: #BEE29E;}\
	tr.free td {background-color: #C6DDBD;border-color: #C3D3B5;}\
	tr.wish:hover td {background-color: #95B2D0!important;border-color: #85A4C2;}\
	tr.wish td {background-color: #ACC8E4;border-color: #A1BBD5;}\
	tr.owned:hover td {background-color: #AFD99E!important;border-color: #BEE29E;}\
	tr.owned td {background-color: #C6DDBD;border-color: #C3D3B5;}\
</style>');

var jsonappdetails = null;
var dlcs = [];
$("#dlc tr td a").each(function(){
    dlcs.push($(this).text());
});

function markDLC(appid){
    GM_xmlhttpRequest({
        method: "GET",
        headers: {
            "Cache-Control": "max-age=0"
        },
        url: "http://store.steampowered.com/api/appuserdetails/?appids="+appid,
        onload: function(response) {
            var item = $.parseJSON(response.responseText)[appid];
            console.log(appid, item.data);
            if(item.success){
                if(item.data.is_owned){
                    $("#dlc a[href='/app/"+appid+"/']").text(appid+" - Owned").parent().parent().addClass("owned");
                }else if(jsonappdetails[appid].data.length == 0){
                    $("#dlc a[href='/app/"+appid+"/']").text(appid+" - Free").parent().parent().addClass("free");
                }else if(item.data.added_to_wishlist){
                    $("#dlc a[href='/app/"+appid+"/']").text(appid+" - In wishlist").parent().parent().addClass("wish");
                }
            }else{
                $("#dlc  a[href='/app/"+appid+"/']").text(appid+" - Unavailable").parent().parent().addClass("hidden");
            }
        }
    });
}

GM_xmlhttpRequest({
    method: "GET",
    url: "http://store.steampowered.com/api/appdetails/?appids="+dlcs.join()+"&filters=price_overview",
    onload: function(response) {
        jsonappdetails = $.parseJSON(response.responseText);
        $.each(dlcs, function(key, val) {
            // Delay request every 1s because steam api limits.
            _.delay(markDLC, key*800, val);
        });
    }
});