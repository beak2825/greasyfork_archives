// ==UserScript==
// @name         Kongregate Flash games fixer
// @version      10.4
// @author       Matrix4348
// @namespace    https://greasyfork.org/users/4818
// @description  You can now chose between Flash, SuperNova, Ruffle and AwayFL to play Flash games on Kongregate!
// @license      MIT
// @match        *://*.konggames.com/games/*/*/frame/*
// @match        *://*.konggames.com/*/games/*/*/frame/*
// @match        *://www.kongregate.com/games/*/*
// @match        *://www.kongregate.com/*/games/*/*
// @match        *://www.kongregate.com/accounts/*/card_album*
// @match        *://www.kongregate.com/*/accounts/*/card_album*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438325/Kongregate%20Flash%20games%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/438325/Kongregate%20Flash%20games%20fixer.meta.js
// ==/UserScript==

/* ************************************************ NOTICE ABOUT @grant ************************************************
Starting with version 10.0, GM_setValue and GM_getValue will be used to store the default SWF player that the user will set.
Previously, this was made using a separate user script because I liked the fact that this one did not require any specific permission.

With @grant none, the window object (and the related context in general) is freely available to user scripts (in Tampermonkey, at least).
However, granting access to certain GM_ functions such as setValue and getValue prohibits that. Therefore, I have to use @grant unsafeWindow, too.
********************************************************************************************************************* */
/* ************************************************** Global functions ********************************************** */
function FlashSupport(){
    var np=navigator.plugins, npl=np.length;
    for(var k=0;k<npl;k++){ if( (np[k].name=="Shockwave Flash") & (np[k].filename!="ruffle.js") ){return true;} }
    return false;
}

function return_default_behaviour(){
    if(FlashSupport()==true){ return "Flash"; }
    else if(navigator.userAgent.search("Windows")>-1){ return "SuperNova"; } // At least while Ruffle is not finished.
    else if(navigator.userAgent.search("Windows")==-1){ return "Ruffle"; } // Because SuperNova only works on Windows.
    else { return "Flash"; }
}
/* ****************************************************************************************************************** */

// Iframes part. The script must be limited to Flash iframes (the URL for the html games iframes look a bit different, but there may be some exceptions), so we will check if the iframe includes the variable kong_flash_variables.
if ((document.URL.search("/frame/")>-1)&&(document.body.innerHTML.search("kong_flash_variables")>-1)){
    // SuperNova and Ruffle scripts:
    var SuperNova_script_was_executed;
    if(( document.head.innerHTML.search("getsupernova.com/tags/supernovalauncher.js")==-1 )&&( document.body.innerHTML.search("getsupernova.com/tags/supernovalauncher.js")==-1 )){
        try{
            var sn=document.createElement("script");
            sn.onload=function(){ SuperNova_script_was_executed=true; };
            sn.onerror=function(){ SuperNova_script_was_executed=false; };
            sn.src="https://web.archive.org/web/20210426110734id_/https://cdn.getsupernova.com/tags/supernovalauncher.js";
            document.body.appendChild(sn);
        }
        catch(e){
            SuperNova_script_was_executed=false;
        }
    }
    var Ruffle_script_was_executed;
    if(( document.head.innerHTML.search("unpkg.com/@ruffle-rs/ruffle")==-1 )&&( document.body.innerHTML.search("unpkg.com/@ruffle-rs/ruffle")==-1 )){
        try{
            var rp=document.createElement("script");
            rp.type="text/javascript";
            rp.id="No Ruffle polyfills";
            rp.innerHTML=`window.RufflePlayer = window.RufflePlayer || {}; window.RufflePlayer.config = { "polyfills": false };`;
            document.body.appendChild(rp);
            var r=document.createElement("script");
            r.onload=function(){ Ruffle_script_was_executed=true; };
            r.onerror=function(){ Ruffle_script_was_executed=false; };
            r.src="https://unpkg.com/@ruffle-rs/ruffle";
            document.body.appendChild(r);
        }
        catch(e){
            Ruffle_script_was_executed=false;
        }
    }
    // First, we need to extract the link to the swf (the game file) and a few other things.
    var file_url0, file_url, file_url_base; // Basic URL.
    var my_first_link, my_second_link, blablabla, GameShellAPI; // For loading the games in a gameshell when they should, because in these cases the gameshell is required for submitting scores. [Update:] The API file can replace the game shell for this, but is their any little feature that makes this replacement fail?
    var my_width, my_height, my_bgcolor, my_wmode=""; // Parameters.
    function rgbtohex(rgb){ // The bgcolor Flash parameter must be an hexadecimal value.
        if(rgb.length==7){ return rgb }
        else if(rgb.length<7){ return "#ffffff" }
        else{
            var a = rgb.split("(")[1].split(")")[0];
            a = a.split(",");
            var b = a.map(function(x){ x = parseInt(x).toString(16); return (x.length==1) ? "0"+x : x; });
            b = "#"+b.join("");
            return b
        }
    }
    function set_up_variables(){
        var scripts=document.getElementsByTagName("script");
        for(var i=0; i<scripts.length;i++) {
            var script_text=scripts[i].text, url_text;
            /*
            Note for the future: with August 24th, 2022's update, the difference between AVM1 and AMV2 games is the "old" superNova code for AMV2 and the "new" Ruffle code for AMV1,
            however the game shell is no longer mentionned there. This makes me fear that, if they implement one day Ruffle for every games, the difference between them may be VERY HARD
            to make.
            Fear confirmed on February 3rd, 2023.
            Partial solution: using document.getElementById("gamediv").firstElementChild._metadata.isActionScript3.
            Problem: this only works if Ruffle works...
            Temporary solution: using the value of kongregate_api_path pasted in the HTML, as long as the value stays different between AVM1 and AVM2.
            */
            if(script_text.indexOf("swf_location")!== -1) {
                var isAS3;
                var sometimes_wrong_API_link=script_text.match(`"kongregate_api_path":"(.*?)"`)[1];
                if( sometimes_wrong_API_link.search("API_AS3")==-1 ){isAS3=false;}
                else {isAS3=true;}
                if(isAS3){
                    url_text=script_text.match(`swf_location = "(.*?)"`)[1];
                    file_url0=decodeURIComponent(url_text);

                    // Parameters for swf injection.
                    my_bgcolor=rgbtohex(document.getElementById("game_wrapper").style.backgroundColor);
                    if(script_text.search(`wmode":"(.*?)"`)>-1){my_wmode=script_text.match(`wmode":"(.*?)"`)[1];}
                    else{ my_wmode="direct"; } // The normal value can no longer be found anywhere (when it is needed) so I will just try that everywhere (default is "window").

                    //  Flash, game shell and API (even though, in this part of the loop, games do not need game shells).
                    my_first_link=file_url0.substring(file_url0.search("//"),file_url0.length);
                    my_second_link="";
                    GameShellAPI="";

                    // Values for the SuperNova part.
                    my_width=script_text.match(`player.style.width = "(.*?)px"`)?.[1]||document.getElementById("game_wrapper").clientWidth;
                    my_height=script_text.match(`player.style.height = "(.*?)px"`)?.[1]||document.getElementById("game_wrapper").clientHeight;

                    break;
                }
                else{
                    url_text=script_text.match(`swf_location = "(.*?)"`)[1];
                    file_url0=decodeURIComponent(url_text);
                    if(file_url0.search("/flash/GameShell")>-1){ file_url0=decodeURIComponent(script_text.match(`game_swf":"(.*?)"`)[1]); }

                    // Parameters for swf injection.
                    my_bgcolor=rgbtohex(document.getElementById("game_wrapper").style.backgroundColor);
                    if(script_text.search(`wmode":"(.*?)"`)>-1){my_wmode=script_text.match(`wmode":"(.*?)"`)[1];}
                    else{ my_wmode="direct"; } // The normal value can no longer be found anywhere (when it is needed) so I will just try that everywhere (default is "window").

                    //  Flash, game shell and API.
                    let sub=file_url0.substring(file_url0.search("//")+2,file_url0.search(".kongregate.com"));
                    my_first_link="//"+sub+".kongregate.com/flash/GameShell.swf";
                    my_second_link=encodeURIComponent("http:"+file_url0.substring(file_url0.search("//"),file_url0.length)); // HTTPS WILL NOT MAKE THE API LOAD/WORK/WHATEVER!
                    GameShellAPI="/flash/API.swf";

                    // Values for the SuperNova part.
                    my_width=script_text.match(`player.style.width = "(.*?)px"`)?.[1]||document.getElementById("game_wrapper").clientWidth;
                    my_height=script_text.match(`player.style.height = "(.*?)px"`)?.[1]||document.getElementById("game_wrapper").clientHeight;

                    break;
                }
            }
        }
        file_url=file_url0.substring(file_url0.search("//"),file_url0.length);
        if (file_url.search("/live/")>-1){
            file_url_base="http:"+file_url.substring(0,file_url.search("/live/")+6);
        }
        else {
            file_url_base="http:"+file_url.substring(0,file_url.search("/game_files/")+22);
        }
        if(GameShellAPI.length==0){file_url_base=file_url_base.substring(file_url_base.search("//"),file_url_base.length);} // This fixes a logging issue for Bloons TD 5, but does it create problems elsewhere?
    }
    // Then, we build the functions that will load the games.
    function more_players(){
        var a=document.createElement("script");
        a.id="Kongregate Flash games fixer: swf players";
        a.type="text/javascript";
        // IMPORTANT: The checkParams function (originally present in the web page) inputs most of the flashvars into kong_flash_variables.
        a.innerHTML=`
//<![CDATA[

var swf_location = "`+my_first_link+`";
var true_swf_location = "`+file_url+`";
var swfobject_flash_vars = {};
var Ruffle_flash_vars = {};
var swf_parameters = {"bgcolor":"`+my_bgcolor+`","allownetworking":"all","allowscriptaccess":"always","base":"`+file_url_base+`","wmode":"`+my_wmode+`"};

function setFlashvars4348(){
    // Missing Flash variables (for high scores, for multiplayers game, for premium content...):
    if(typeof(kong_flash_variables) == "object"){
        for(var k in kong_flash_variables){ swfobject_flash_vars[k] = encodeURIComponent(kong_flash_variables[k]); };
        swfobject_flash_vars.kongregate_api_path=encodeURIComponent("/flash/API_AS3.swf"); // Disappeared from kong_flash_variables around November 2025.
        swfobject_flash_vars.kongregate_api_host=encodeURIComponent("https://api.kongregate.com"); // Disappeared in 2025. Does it have any use?
        swfobject_flash_vars.kongregate_flash_postmessage=true; // This line is fundamental for "activating" the API.
        swfobject_flash_vars.api_path=swfobject_flash_vars.kongregate_api_path; // This line is required for a lot of games (AVM1 games specifically?)
        swfobject_flash_vars.api_host=swfobject_flash_vars.kongregate_api_host; // Needed? Useless?
        swfobject_flash_vars.game_url=swfobject_flash_vars.kongregate_game_url; // May be useless, or may reactivate API on games where we supposed it broken for good, who knows...
        swfobject_flash_vars.kongregate_stamp=swfobject_flash_vars.kongregate_game_auth_token; // Probably useless.
    }
    swfobject_flash_vars.game_swf="`+my_second_link+`";
    if(swfobject_flash_vars.game_swf.length!=0){
        swfobject_flash_vars.kongregate_api_path=encodeURIComponent("`+GameShellAPI+`"); // Yep, game shells and AVM1 games need a different API file!
        swfobject_flash_vars.api_path=swfobject_flash_vars.kongregate_api_path;
    };

    // Ruffle needs non-encoded flashvars.
    for(var k in swfobject_flash_vars){ Ruffle_flash_vars[k] = decodeURIComponent(swfobject_flash_vars[k]); };
}

function activateGame4348(swf_player){
    var prot="http";
    // Some games may always need to load via https, and other games will only need it when getsupernova.com is down or have problems (why, seriously?...).
    var games_needing_https=["144037","195142"];
    if(games_needing_https.includes(document.URL.substring(document.URL.search("//")+6,document.URL.search(".konggames")))){ prot="https"; }
    // Some games might still lack CORS headers but I forgot the list since last time I checked. Things have improved, at least, and remaining one may have all been added but better be safe than sorry.
    var no_CORS;
    if( typeof(window.no_cors) == "undefined" ){ no_CORS=false; }
    else{ no_CORS=window.no_cors; }

    reset_gamediv();

    if(swf_player=="Flash"){
        // Note: Extension excepted, as of June 2023 Ruffle no longer polyfills Flash content in browser with Flash supported (and installed?). This may even be true with replacements to Flash like Lightspark.
        swfobject.embedSWF( swf_location, "gamediv2", "100%", "100%", "6", "/flash/expressInstall.swf", swfobject_flash_vars, swf_parameters, {} );

        // Sometimes, if a browser does not support Adobe Flash Player, then swfobject.embedSWF may not work, leaving a mere black screen instead of a "this plugin is not supported" message.
        // Therefore, the game will be injected using another method, just so the users know that the script works.
        if (document.getElementById("gamediv2").type==undefined){
            document.getElementById("gamediv2").remove();
            var truc=document.createElement("object");
            truc.id="gamediv2";
            truc.type="application/x-shockwave-flash";
            truc.data=swf_location;
            truc.width="100%";
            truc.height="100%";
            for(var p in swf_parameters){ var p1=document.createElement("param"); p1.name=p; p1.value=swf_parameters[p]; truc.appendChild(p1); }
            var fv0=""; for(var k in swfobject_flash_vars){fv0=fv0+k+"="+swfobject_flash_vars[k]+"&"};
            var fv=document.createElement("param"); fv.name="flashvars"; fv.value=fv0.substring(0,fv0.length-1); truc.appendChild(fv);
            document.getElementById("game_wrapper").appendChild(truc);
        };
    }

    else if(swf_player=="SuperNova"){
        var SNoptions = { "swfurl" : prot+":"+true_swf_location, "flashvars":"", "title" : ttgArgs.game_title, "width" : `+my_width+`, "height" : `+my_height+` };
        var SNflashvars={}; for(var k in swfobject_flash_vars){ SNflashvars[k] = decodeURIComponent(swfobject_flash_vars[k]); }; SNoptions.flashvars = $j.param(SNflashvars);
        SNoptions.el = document.querySelector('#gamediv2');
        SNoptions.pageUrl=window.location.href;
        //SNoptions.autoplay=true;
        if(typeof(supernova)==='object'){ document.getElementById("game_wrapper").style.overflow="auto"; supernova.launch(SNoptions); setTimeout(function(){supernova.openGame(SNoptions);},3000); }
        // The SuperNova code does not work in some browsers (like Pale Moon[*] and Basilisk), therefore the window will not know what is supernova.
        // However, we can still open the game using the "manual" command.
        // [*] This is no longer true for Pale Moon. /!\ TO-DO: ADDING THE THREE LAUNCHING OPTIONS FROM THE MANUAL COMMAND TO THE OFFICIAL SCREEN. This would solve http/https problems that can arise.
        else{ custom_SuperNova_launcher(SNoptions); }
    }

    else if(swf_player=="Ruffle"){
        var Ruffle_swf_location=swf_location;
        if(swfobject_flash_vars.game_swf.length!=0){ // Skips gameshell and loads AS2 api directly, until Ruffle supports it
            Ruffle_swf_location = window.location.protocol.slice(0,-1)+"://www.kongregate.com/flash/API.swf";
        }
        // For games that could be somehow still lacking CORS headers
        if( no_CORS ){
            if(swfobject_flash_vars.game_swf.length!=0){
                Ruffle_flash_vars.game_swf=Ruffle_flash_vars.game_swf.replace(/chat.kongregate.com|assets.kongregate.com|internal.kongregate.com/,"game"+swfobject_flash_vars.kongregate_game_id+".konggames.com");
            }
            else{
                Ruffle_swf_location = window.location.protocol.slice(0,-1)+"://game"+swfobject_flash_vars.kongregate_game_id+".konggames"+swf_location.substring(swf_location.indexOf(".com"),swf_location.length);
            };
        }

        window.RufflePlayer.config = {
            "publicPath": undefined, "polyfills": false, // Options affecting the whole page, but that should no longer matter at this point in the user script code.
            "autoplay": "on",
            "allowNetworking": swf_parameters.allownetworking,
            "allowScriptAccess": swf_parameters.allowscriptaccess == "always" ? true : false,
            "backgroundColor": swf_parameters.bgcolor,
            "wmode": swf_parameters.wmode,
            "contextMenu": "on",
            "favorFlash": true,
            "openUrlMode": "allow",
            "showSwfDownload": `+(my_second_link.length==0)+`,
            "maxExecutionDuration": 100,
            "base": no_CORS ? swf_parameters.base.replace(/chat.kongregate.com|assets.kongregate.com|internal.kongregate.com/,"game"+swfobject_flash_vars.kongregate_game_id+".konggames.com") : swf_parameters.base,
            "menu": true,
            "scale": "showAll",
            "quality": "high",
        };

        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        player.style.width = "100%";
        player.style.height = "100%";
        const container = document.getElementById("game_wrapper");
        document.getElementById("gamediv2").remove();
        container.appendChild(player);
        player.load({
            url: Ruffle_swf_location,
            parameters: Ruffle_flash_vars,
            allowScriptAccess: true
        });
    }

    else if(swf_player=="AwayFL"){
        var AwayFL_swf_location=swf_location;
        window.AWAY_EMBED_CFG = {
            enableFilters: true,
            enableBlends: true
        }
        if(swfobject_flash_vars.game_swf.length!=0){ // Until AwayFL can load AVM1 games into their game shell.
            AwayFL_swf_location = window.location.protocol+true_swf_location;
        }
        // For games that could be somehow still lacking CORS headers
        if( no_CORS ){
            if(swfobject_flash_vars.game_swf.length!=0){ // Until AwayFL can load AVM1 games into their game shell.
                AwayFL_swf_location = window.location.protocol.slice(0,-1)+"://game"+swfobject_flash_vars.kongregate_game_id+".konggames"+true_swf_location.substring(true_swf_location.indexOf(".com"),true_swf_location.length);
            }
            else{
                AwayFL_swf_location = window.location.protocol.slice(0,-1)+"://game"+swfobject_flash_vars.kongregate_game_id+".konggames"+swf_location.substring(swf_location.indexOf(".com"),swf_location.length);
            };
        };
        var a=document.createElement("script");
        a.src="https://cdn.jsdelivr.net/gh/awayfl/awayfl-embed@master/dist/embed.js";
        a.addEventListener("load",function(){ swfobject.embedSWF(AwayFL_swf_location,"gamediv2","100%","100%","6","/flash/expressInstall.swf",swfobject_flash_vars,swf_parameters,{}); });
        document.body.appendChild(a);
    }

    else{ activateGame4348("Flash"); }
}

function reset_gamediv(){
    if( document.getElementById("game_wrapper").firstDescendant()!=null ){ document.getElementById("game_wrapper").firstDescendant().remove(); };
    var d=document.createElement("div"); d.id="gamediv2"; document.getElementById("game_wrapper").appendChild(d);
}

function custom_SuperNova_launcher(options){
    manual_url=options.swfurl.substring(options.swfurl.search("//"),options.swfurl.search(".swf")+4);
    manual_launch_http="supernova://play/?swfurl="+encodeURIComponent("http:"+manual_url)+"&flashvars="+encodeURIComponent(options.flashvars)+"&pageurl="+encodeURIComponent(options.pageUrl);
    manual_launch_https="supernova://play/?swfurl="+encodeURIComponent("https:"+manual_url)+"&flashvars="+encodeURIComponent(options.flashvars)+"&pageurl="+encodeURIComponent(options.pageUrl);
    var unofficial_interface=document.createElement("div");
    var Roboto_stylesheet=document.createElement("link"), interface_subdiv=document.createElement("div");
    var intro_div=document.createElement("div"), first_line=document.createElement("hr"), download_div=document.createElement("div"), second_line=document.createElement("hr"), play_div=document.createElement("div");
    var download_button_div=document.createElement("div"), download_button=document.createElement("button"), download_span=document.createElement("span"), warning_span=document.createElement("span");
    var play_div=document.createElement("div"), play_buttons_div=document.createElement("div"), play_button_http=document.createElement("button"), play_button_https=document.createElement("button");
    unofficial_interface.id="Unofficial SuperNova interface"; unofficial_interface.style="text-align: center; background:#FFFFFF; left: 0px; top:0px; width:100%; height:100%; position:absolute";
    Roboto_stylesheet.rel="stylesheet"; Roboto_stylesheet.type="text/css"; Roboto_stylesheet.href="https://fonts.googleapis.com/css?family=Roboto";
    unofficial_interface.appendChild(Roboto_stylesheet);
    interface_subdiv.style="text-align:center; align-items:center; background:#FFFFFF; width:100%; height:100%; position:fixed; font-family: Roboto; font-style: normal; font-weight: 500; line-height: normal; overflow:auto";
    intro_div.id="Introduction"; intro_div.style="display:block; position: relative; width: 90%; height:auto; top:4%; left: 5%; right: 15%";
    intro_div.innerHTML="It seems that, for some technical reasons, your browser could not load the official SuperNova interface, which explains why you are reading this replacement frame. Well, fear not! The process stays the same."
    interface_subdiv.appendChild(intro_div);
    first_line.style="margin-top:6%; margin-bottom:3%";
    interface_subdiv.appendChild(first_line);
    download_div.id="Download SuperNova"; download_div.style="display:block; position: relative; width: 90%; height:auto; top:auto; left: 5%; right: 15%";
    download_div.innerHTML="To play <i>"+options.title+"</i> with the SuperNova player, you first need to download the SuperNova player from <i>https://www.getsupernova.com/download/</i> and install it.";
    download_button_div.id="Download button"; download_button_div.style="margin-top:2%";
    download_button.id="downloadbutton"; download_button.style="background: #0D5694; color: white; height:40px";
    //download_button.setAttribute("onclick", "window.location='https://cdn.getsupernova.com/SuperNovaSetup.exe'");
    download_button.setAttribute("onclick", "window.open('http://web.archive.org/web/20210426173012id_/https://cdn.getsupernova.com/update/SuperNovaSetup0.1.23.exe')");
    download_span.style="left:50px; font-weight: 700; text-decoration:underline; font-size:20px"; download_span.innerHTML="Download";
    download_button.appendChild(download_span);
    download_button_div.appendChild(download_button);
    download_div.appendChild(download_button_div);
    warning_span.style="font-size:12px"; warning_span.innerHTML="(Warning: At the moment, it is only available on Windows.)";
    download_div.appendChild(warning_span);
    interface_subdiv.appendChild(download_div);
    second_line.style="margin-top:3%; margin-bottom:4%";
    interface_subdiv.appendChild(second_line);
    play_div.id="Play with SuperNova"; play_div.style="display: block; position:relative; width: 90%; height:auto; top:auto; left: 5%; right: 15%; bottom:4%";
    play_div.innerHTML="Once you have the SuperNova player installed on your computer, you can play the game by clicking one of the buttons below. If it does not load properly, try another one.";
    play_buttons_div.id="Play buttons"; play_buttons_div.style="margin-top: 2%; margin-bottom:2%";
    play_button_http.id="playbuttonhttp"; play_button_http.style="border-radius: 30px; background: #0D5694; color: white; margin-right: 10px; width: 130px; height: 26px; font-size: 15px; border: none";
    play_button_http.innerHTML="Play (http)";
    play_button_http.setAttribute("onclick", "window.location=manual_launch_http");
    play_buttons_div.appendChild(play_button_http);
    play_button_https.id="playbuttonhttps"; play_button_https.style="border-radius: 30px; background: #0D5694; color: white; margin-left: 10px; width: 130px; height: 26px; font-size: 15px; border: none";
    play_button_https.innerHTML="Play (https)";
    play_button_https.setAttribute("onclick", "window.location=manual_launch_https");
    play_buttons_div.appendChild(play_button_https);
    if("game_swf" in swfobject_flash_vars){
        manual_launch_gameshell="supernova://play/?swfurl="+encodeURIComponent("http:"+swf_location)+"&flashvars="+encodeURIComponent(options.flashvars)+"&pageurl="+encodeURIComponent(options.pageUrl);
        var play_button_gameshell=document.createElement("button");
        play_button_gameshell.id="playbuttongameshell";
        play_button_gameshell.style="border-radius: 30px; background: #0D5694; color: white; margin-left: 20px; width: 150px; height: 26px; font-size: 15px; border: none";
        play_button_gameshell.innerHTML="Play (in game shell)";
        play_button_gameshell.setAttribute("onclick", "window.location=manual_launch_gameshell");
        play_buttons_div.appendChild(play_button_gameshell);
    }
    play_div.appendChild(play_buttons_div);
    interface_subdiv.appendChild(play_div);
    unofficial_interface.appendChild(interface_subdiv);
    document.getElementById("gamediv2").appendChild(unofficial_interface);
}

function FlashSupport(){
    var np=navigator.plugins, npl=np.length;
    for(var k=0;k<npl;k++){ if((np[k].name=="Shockwave Flash")&(np[k].filename!="ruffle.js")){return true}; }
    return false;
};

function time_to_play(){
    setFlashvars4348();
    if(document.URL.search("swf_player_to_use=Flash")>-1){ activateGame4348("Flash"); }
    else if(document.URL.search("swf_player_to_use=SuperNova")>-1){ activateGame4348("SuperNova"); }
    else if(document.URL.search("swf_player_to_use=Ruffle")>-1){ activateGame4348("Ruffle"); }
    else if(document.URL.search("swf_player_to_use=AwayFL")>-1){ activateGame4348("AwayFL"); }
    else{
        if(FlashSupport()==true){ activateGame4348("Flash"); }
        else if(navigator.userAgent.search("Windows")>-1){ activateGame4348("SuperNova"); } // At least while Ruffle is not finished.
        else if(navigator.userAgent.search("Windows")==-1){ activateGame4348("Ruffle"); }   // Because SuperNova only works on Windows.
        else { activateGame4348("Flash"); }
    }
};
//time_to_play();
async function check_cors_then_launch_the_game(){
    var url=window.location.protocol.slice(0,-1)+":"+true_swf_location.substring(true_swf_location.search("//"),true_swf_location.length);
    try{
        var r = await fetch(url);
        window.no_cors=false;
    }
    catch(e){
        window.no_cors=true;
    }
    finally{
        time_to_play();
    }
}
check_cors_then_launch_the_game();

//]]>
        `;
        document.body.appendChild(a);
    }

    function iframe_main_function(){
        var SuperNova_state=typeof(SuperNova_script_was_executed)=="boolean"||"supernova" in unsafeWindow;
        var Ruffle_state=typeof(Ruffle_script_was_executed)=="boolean"||typeof(unsafeWindow.RufflePlayer)=="object";
        if(unsafeWindow.activateGame._alreadyActivated&&SuperNova_state&&Ruffle_state){
            set_up_variables();
            more_players();
        }
        else{ setTimeout(iframe_main_function,1000); }
    }
    iframe_main_function();

}

// Game pages part (first iframe layer and top-level document, respectively). Only for Flash games, so I will make sure that active_user.gameType()="flash".
else if(document.URL.search("www.kongregate.com(.*?)/games/(.*?)/embed")>-1){
    // Useful variables.
    var urlstart=document.URL.substring(0,document.URL.search("://"));

    var my_game_version, my_svid, my_iframe_class, my_game_host;
    function getting_the_variables(){
        var game_scripts=document.getElementsByClassName("game-embed-container")[0].getElementsByTagName("script");
        for(var j=0; j<game_scripts.length;j++){
            var game_script_text=game_scripts[j].text;
            if((game_script_text.indexOf("game_version")!== -1)&(game_script_text.indexOf("svid")!== -1)) {
                my_game_version=game_script_text.match(`game_version":(.*?),`)[1];
                my_svid=(game_script_text.match(`svid":"(.*?)"`)||game_script_text.match(`svid":(.*?),`))[1];
                my_iframe_class=game_script_text.match(`iframe_class":"(.*?)"`)[1];
                my_game_host=game_script_text.match(`game_host":"(.*?)"`)[1];
                break;
            }
        }
    }

    // What will be inserted in the web page, to load the different iframes that we will use.
    function code_for_iframes(){
        var ic=document.createElement("script");
        ic.id="Kongregate Flash games fixer: iframes";
        ic.innerHTML=`
//<![CDATA[
function LoadFrame4348(swf_player,urlOptions){
    if (!urlOptions) { urlOptions = ''; }
    if (!swf_player) { swf_player = 'none'; }

    new GameIframe({
        "auto_resize":null,
        "iframe_url":"`+urlstart+`"+"://game"+active_user.gameId()+".konggames.com"+active_user.gameResourcePath().substring(active_user.gameResourcePath().search("/games/"))+'/frame/'+channel_id+'/?kongregate_host=www.kongregate.com&swf_player_to_use='+swf_player,
        "alternate_game_file_url":null,
        "game_width":holodeck._html_dimensions.game_width,
        "game_height":holodeck._html_dimensions.game_height,
        "max_game_width":holodeck._html_dimensions.max_game_width,
        "max_game_height":holodeck._html_dimensions.max_game_height,
        "game_left":holodeck._html_dimensions.game_left,
        "game_top":holodeck._html_dimensions.game_top,
        "iframe_class":"`+my_iframe_class+`",
        "host":"`+urlstart+`"+"://www.kongregate.com",
        "api_host":"https://api.kongregate.com",
        "api_path":"https://chat.kongregate.com/flash/API_AS3.swf", // A way to differenciate between AMV1 and AMV2 games would be great, but the URL will be corrected in the iframe.
        "preview":false,
        "game_permalink":active_user.gamePermalink(),
        "game_id":active_user.gameId(),
        "game_url":"http://www.kongregate.com"+active_user.gamePath().substring(active_user.gamePath().search("/games/")),
        "game_version":`+my_game_version+`,
        "flash_var_prefix":"kv_",
        "post_message":true,
        "iframe_host":"`+urlstart+`"+"://game"+active_user.gameId()+".konggames.com",
        "game_host":"`+my_game_host+`",
        "channel_id":encodeURIComponent(channel_id),
        "svid":"`+my_svid+`",
        "game_type":"flash"
    },urlOptions, channel_id).createGameIframeElement();

    document.fire('game:activated');
}

// In october 2025, their new redesign came with an extra layer of iframe. Basically, most of the old code is in that layer. window.postMessage circumvents that.
window.addEventListener('message', function(event) {
var keyword = "SWF player to use: ";
    if(typeof(event.data)=="string"){
        if(event.data.search(keyword)==0){
            var swf_player=event.data.substring(keyword.length);
            LoadFrame4348(swf_player);
        }
     }
});
//]]>
        `;
        document.getElementsByClassName("game-embed-container")[0].appendChild(ic);
    }

    // ...
    function do_things(){
        var is_Flash_game, everything_ready;
        if(document.readyState=="complete"&&typeof(unsafeWindow.active_user)!="undefined"&&typeof(unsafeWindow.activateGame)!="undefined"&&typeof(unsafeWindow.holodeck)!="undefined"){
            if(typeof(unsafeWindow.active_user.gameType)!="undefined"){
                if(unsafeWindow.active_user.gameType()=="flash"){ is_Flash_game=true; } else{ is_Flash_game=false; }
            }
            else{ is_Flash_game=-1 }
            if(unsafeWindow.activateGame._alreadyActivated&&unsafeWindow.holodeck.ready){ everything_ready=true; }
            else{ everything_ready=false; }
        }
        if(is_Flash_game==true&&everything_ready){
            getting_the_variables();
            code_for_iframes();
        }
        else if(is_Flash_game!=false){ setTimeout(function(){ do_things(); },1000); }
    }
    do_things();

}

else if(document.URL.search("www.kongregate.com(.*?)/games/")>-1){
    function press_play_now_then_change_swf_player(swf_player){
        if(document.getElementById("game")?.style?.display=="none"){
            document.getElementById("play-now-overlay").getElementsByTagName("BUTTON")?.[0].click();
            setTimeout(function(){ press_play_now_then_change_swf_player(swf_player); },1000);
        }
        else if(document.getElementById("fullscreen_button")?.style?.display=="none"){
            setTimeout(function(){ press_play_now_then_change_swf_player(swf_player); },1000);
        }
        else{
            document.getElementsByClassName("game-embed-iframe")[0].contentWindow.postMessage("SWF player to use: "+swf_player);
        }
    }

    function open_settings(){
        var default_player=prompt("Which SWF player do you want to use by default when a page loads: Flash, SuperNova, Ruffle or AwayFL?\n\n Note: Typing anything else will be treated like "+return_default_behaviour()+".");
        switch((default_player||"null").toLowerCase()) {
            case "null":
                break;
            case "flash":
                GM_setValue("default_swf_player","Flash");
                break;
            case "supernova":
                GM_setValue("default_swf_player","SuperNova");
                break;
            case "ruffle":
                GM_setValue("default_swf_player","Ruffle");
                break;
            case "awayfl":
                GM_setValue("default_swf_player","AwayFL");
                break;
            default:
                GM_setValue("default_swf_player",return_default_behaviour());
        }
        document.getElementById("default swf player setting button").innerHTML="Set default swf player <br> <i>Currently: "+GM_getValue( "default_swf_player", return_default_behaviour() )+"</i>";
    }

    // Let's make some shiny buttons!
    function ButtonMaker(){
        var fullscreen_button=document.getElementById("fullscreen_button");
        var ql2=fullscreen_button?.parentElement;
        var is_Flash_game=-1, everything_ready;
        if(document.readyState=="complete" && unsafeWindow[0]?.active_user?.gameType){
            is_Flash_game = unsafeWindow[0].active_user.gameType()=="flash";
            everything_ready = ql2!==null;
        }
        if(is_Flash_game==true&&everything_ready){
            // Flash button
            var FlashButton=document.createElement('button');
            FlashButton.id="Button to (re)load with Flash";
            FlashButton.style.display="flex";
            FlashButton.innerHTML=`<img width="15" height="15" src="//bluemaxima.org/flashpoint/images/icons/flash.png" style=""><span> Flash</span>`;
            FlashButton.addEventListener("click",function(){ press_play_now_then_change_swf_player("Flash"); });
            ql2.insertBefore(FlashButton,fullscreen_button);
            // SuperNova button
            var SuperNovaButton=document.createElement('button');
            SuperNovaButton.id="Button to (re)load with SuperNova";
            SuperNovaButton.style.display="flex";
            SuperNovaButton.innerHTML=`<img width="16" height="16" src="//web.archive.org/web/20210420194152id_/https://www.getsupernova.com/images/icon-32x32.png" style=""><span> SuperNova</span>`;
            SuperNovaButton.addEventListener("click",function(){ press_play_now_then_change_swf_player("SuperNova"); });
            ql2.insertBefore(SuperNovaButton,fullscreen_button);
            // Ruffle button
            var RuffleButton=document.createElement('button');
            RuffleButton.id="Button to (re)load with Ruffle";
            RuffleButton.style.display="flex";
            RuffleButton.innerHTML=`<img width="15" height="15" src="//web.archive.org/web/20220709055848/https://addons.mozilla.org/user-media/userpics/17/17184/17184207.png?modified=1639619051" style=""><span> Ruffle</span>`;
            RuffleButton.addEventListener("click",function(){ press_play_now_then_change_swf_player("Ruffle"); });
            ql2.insertBefore(RuffleButton,fullscreen_button);
            // AwayFL button
            var AwayFLButton=document.createElement('button');
            AwayFLButton.id="Button to (re)load with AwayFL";
            AwayFLButton.style.display="flex";
            AwayFLButton.innerHTML=`<img width="15" height="15" src="//awayfl.org/img/awayfl-logo_large_trans_white.png" style=""><span> AwayFL</span>`;
            AwayFLButton.addEventListener("click",function(){ press_play_now_then_change_swf_player("AwayFL"); });
            ql2.insertBefore(AwayFLButton,fullscreen_button);
            // Settings button
            var SettingsButton=document.createElement("button");
            SettingsButton.id="default swf player setting button";
            SettingsButton.style.borderWidth="1px";
            SettingsButton.style.backgroundColor="grey";
            var h=50,w=150; SettingsButton.style.height=h+"px"; SettingsButton.style.width=w+"px";
            SettingsButton.style.fontSize="14px";
            SettingsButton.innerHTML="Set default swf player <br> <i>Currently: "+GM_getValue( "default_swf_player", return_default_behaviour() )+"</i>";
            SettingsButton.addEventListener("click",open_settings);
            fullscreen_button.parentElement.insertBefore(SettingsButton,fullscreen_button);
            // Launch the game using the default SWF player that the user has set
            press_play_now_then_change_swf_player(GM_getValue( "default_swf_player", return_default_behaviour() ));
        }
        else if(is_Flash_game!=false){ setTimeout(function(){ ButtonMaker(); },1000); }
    }

    ButtonMaker();
}

// Stuff related to card albums:
else if (document.URL.search(`www.kongregate.com/accounts/(.*?)/card_album`)>-1){
    // Since Kongai's in-game "card album" button has been pointing to the wrong page for ages, we'd better fix it!
    if(document.URL.search(`www.kongregate.com/accounts/(.*?)/card_albums`)==-1){
        unsafeWindow.location=document.URL.substring(0,document.URL.search("/card_album")+11)+"s"+document.URL.substring(document.URL.search("/card_album")+11,document.URL.length);
    }
    else{
        // Switching card set when viewing another player's album should not redirect you to your own album!
        var true_core_href=document.location.pathname;
        if (document.getElementById("martial_artists_nav").href.search(true_core_href)==-1){
            document.getElementById("martial_artists_nav").setAttribute("href",true_core_href+"?card_set=1");
            document.getElementById("amazons_nav").setAttribute("href",true_core_href+"?card_set=2");
            document.getElementById("tiki_villagers_nav").setAttribute("href",true_core_href+"?card_set=3");
            document.getElementById("vampires_nav").setAttribute("href",true_core_href+"?card_set=4");
            document.getElementById("pirates_nav").setAttribute("href",true_core_href+"?card_set=5");
            document.getElementById("knights_nav").setAttribute("href",true_core_href+"?card_set=6");
            document.getElementById("robots_nav").setAttribute("href",true_core_href+"?card_set=7");
            document.getElementById("witches_nav").setAttribute("href",true_core_href+"?card_set=8");
            document.getElementById("general_items_nav").setAttribute("href",true_core_href+"?card_set=0");
        }
    }
}