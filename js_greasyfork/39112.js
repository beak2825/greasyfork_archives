// ==UserScript==
// @name         Steam Name Helper
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Quick Switch between Steam Names(Change Name: Alt+1, Recover Name: Alt+2)
// @author       fllp
// @include      http://*/*
// @include      https://*/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource     CSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      steamcommunity.com
// @connect      steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/39112/Steam%20Name%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/39112/Steam%20Name%20Helper.meta.js
// ==/UserScript==


var originalName="ylxm";//<-----------------------------------------------------左边引号里面改成steam账号原名
var substituteFrom=["daxxxx.com","xxxx.com"]; //【示例】<-----------------若遇到某网站改名要求不对应当前网站可自行匹配（这里添加的是原网站）
var substituteTo=["csgoxxxx.com","xxxxxxx.com"];//【示例】<-----------------若遇到某网站改名要求不对应当前网站可自行匹配（这里添加的是对应上面顺序Steam名字需要加的网站）

(function() {
    GM_addStyle(GM_getResourceText('CSS'));
    toastr.options = {
                       tapToDismiss : false,
                       timeOut : 5000,
                       debug : false,
                       fadeOut: 4,
                       positionClass : "toast-bottom-left"
            };
    $(document).keydown(function(e) {
    if(e.altKey && e.keyCode == 49) {
        changeNamePrep();
    }else if(e.altKey && e.keyCode == 50) {
       recoverNamePrep();
    }
});
    var id,domain,name,sessionID,backgroundID,customURLName,summary,favorite_badge,favorite_badge_commmunity,badgetype,badgeid,real_name,country,state,city;
    var temp = window.location.hostname.split('.').reverse();
    //var root_domain = '.' + temp[1] + '.' + temp[0];
    domain=temp[1] + '.' + temp[0];
    //domain=window.location.hostname;
    if($("img[src*='signinthroughsteam']").length>0 || $("img[src*='steamlogin']").length>0){
        console.log("startPic");
        $("img[src*='signinthroughsteam']").each(function(){
        //appendButton($(this).parent());
        });
        $("img[src*='steamlogin']").each(function(){
        //appendButton($(this).parent());
        });
    }else if($("a:contains('Sign in through')").length>0){
        console.log("startStr");
        $("a:contains('Sign in through')").each(function(){
        //appendButton($(this));
        });
    }
    function appendButton(a){
        var $input = $('<input type="button" value="Change Name"/>');
        var $input2 = $('<input type="button" value="Recover Name"/>');
            $input.on("click", function(event){
            changeNamePrep();
            });
        $input2.on("click", function(event){
            recoverNamePrep();
            });
        $input.appendTo(a.parent());
        $input2.appendTo(a.parent());
        //domain=window.location.hostname;
    }
    function changeNamePrep(){
        if(domain.toLowerCase().indexOf("steam")>-1){
        toastr.warning('<strong>Steam related websites are Not Allowed!</strong>');
        return;
       }else{
           for(var i=0;i<substituteFrom.length;i++){
               if(domain==substituteFrom[i]){
                   domain=substituteTo[i];
                   break;
               }
           }
       }
         GM_xmlhttpRequest({
        url:"http://store.steampowered.com/",
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            id=response.responseText.match(/steamcommunity\.com\/profiles\/(.+?)\//);
            //sessionID=response.responseText.match(/var g_sessionID = \"(.+?)\"/);
            name=response.responseText.match(/data-miniprofile=\"(.+?)\">(.+?)<\/a>/);
            //console.log(name[2]);
            //console.log(id[0]);
            if(id==null){
                id=response.responseText.match(/steamcommunity\.com\/id\/(.+?)\//);
            }
            //console.log(sessionID[1]);
            //console.log(originalName+" "+domain);
            GM_xmlhttpRequest({
        url:"http://"+id[0]+"edit",
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            badgetype="&favorite_badge_badgeid=";
            sessionID=response.responseText.match(/g_sessionID = \"(.+?)\"/);
            backgroundID=response.responseText.match(/\"communityitemid\":\"(.+?)\"/);
            customURLName=response.responseText.match(/id=\"customURL\" value=\"(.+?)\"/);
            summary=response.responseText.match(/id=\"summary\">(.+?)<\/textarea>/);
            favorite_badge=response.responseText.match(/\"favorite_badge_badgeid\" value=\"(.+?)\">/);
            real_name=response.responseText.match(/id=\"real_name\"(.+?)value=\"(.+?)\"/);
            var countryStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("country"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            country=countryStr.match(/option value=\"(.+?)\"/);
            var stateStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("state"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            state=stateStr.match(/option value=\"(.+?)\"/);
            var cityStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("city"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            city=cityStr.match(/option value=\"(.+?)\"/);
            if(favorite_badge==null){
                favorite_badge_commmunity=response.responseText.match(/\"favorite_badge_communityitemid\" value=\"(.+?)\"/);
                badgetype="&favorite_badge_communityitemid=";
                if(favorite_badge_commmunity==null){
                    badgeid="";
                }else{
                badgeid=favorite_badge_commmunity[1];
                }
            }else{
                badgeid=favorite_badge[1];
            }
            if(real_name==null){
             real_name=["","",""];
            }
            if(country==null){
             country=["",""];
            }
            if(state==null){
             state=["",""];
            }
            if(city==null){
             city=["",""];
            }
            //console.log(sessionID[1]);
                applyName(sessionID[1],originalName+" "+domain,backgroundID[1],customURLName[1],summary[1],badgeid,real_name[2],country[1],state[1],city[1]);
            }
         });
            }
         });
     }
    function recoverNamePrep(){
         GM_xmlhttpRequest({
        url:"http://store.steampowered.com/",
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            id=response.responseText.match(/steamcommunity\.com\/profiles\/(.+?)\//);
            //sessionID=response.responseText.match(/var g_sessionID = \"(.+?)\"/);
            name=response.responseText.match(/data-miniprofile=\"(.+?)\">(.+?)<\/a>/);
            //console.log(name[2]);
            //console.log(id[0]);
            if(id==null){
                id=response.responseText.match(/steamcommunity\.com\/id\/(.+?)\//);
            }
            //console.log(sessionID[1]);
            //console.log(originalName+" "+domain);
            GM_xmlhttpRequest({
        url:"https://"+id[0]+"edit",
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            badgetype="&favorite_badge_badgeid=";
            sessionID=response.responseText.match(/g_sessionID = \"(.+?)\"/);
            backgroundID=response.responseText.match(/\"communityitemid\":\"(.+?)\"/);
            customURLName=response.responseText.match(/id=\"customURL\" value=\"(.+?)\"/);
            summary=response.responseText.match(/id=\"summary\">(.+?)<\/textarea>/);
            favorite_badge=response.responseText.match(/\"favorite_badge_badgeid\" value=\"(.+?)\">/);
            real_name=response.responseText.match(/id=\"real_name\"(.+?)value=\"(.+?)\"/);
            var countryStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("country"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            country=countryStr.match(/option value=\"(.+?)\"/);
            var stateStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("state"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            state=stateStr.match(/option value=\"(.+?)\"/);
            var cityStr=response.responseText.substring(response.responseText.substring(response.responseText.indexOf("city"),response.responseText.indexOf("selected")).lastIndexOf("<opt"));
            city=cityStr.match(/option value=\"(.+?)\"/);
            //console.log(countryStr);
            if(favorite_badge==null){
                favorite_badge_commmunity=response.responseText.match(/\"favorite_badge_communityitemid\" value=\"(.+?)\"/);
                badgetype="&favorite_badge_communityitemid=";
                if(favorite_badge_commmunity==null){
                    badgeid="";
                }else{
                badgeid=favorite_badge_commmunity[1];
                }
            }else{
                badgeid=favorite_badge[1];
            }
            if(real_name==null){
             real_name=["","",""];
            }
            if(country==null){
             country=["",""];
            }
            if(state==null){
             state=["",""];
            }
            if(city==null){
             city=["",""];
            }
           //console.log(country);
            //console.log(response.responseText);
                applyName(sessionID[1],originalName,backgroundID[1],customURLName[1],summary[1],badgeid,real_name[2],country[1],state[1],city[1]);
            }
         });
            }
         });
     }
    function applyName(a,b,c,d,e,f,g,h,i,j){
        GM_xmlhttpRequest({
            url: "https://"+id[0]+"edit",
            method: 'POST',
            data: 'sessionID='+escape(a)+'&type=profileSave&personaName='+b+'&profile_background='+c+'&customURL='+encodeURIComponent(d)+'&summary='+encodeURIComponent(e)+badgetype+f+'&real_name='+encodeURIComponent(g)+'&country='+h+'&state='+i+'&city='+j,
            headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
        onload: function(response){
             //console.log(response.responseText);
            //console.log(a);
            //console.log(b);
            //console.log("http://"+id[0]+"edit");
            toastr.success('<strong>Name Changing Success: <br><span style="color:gold">'+b+'</span></strong>');
          }
        });
    }

})();