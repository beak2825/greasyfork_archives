// ==UserScript==
// @name         Github.desktop.stars.js
// @namespace    http://zhihaofans.com
// @version      0.0.2
// @description  在Github首页显示stars列表
// @author       zhihaofans
// @match        https://github.com/
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/25101
// @note         Github地址:https://github.com/zhihaofans/Github.desktop.stars.js
// @downloadURL https://update.greasyfork.org/scripts/25101/Githubdesktopstarsjs.user.js
// @updateURL https://update.greasyfork.org/scripts/25101/Githubdesktopstarsjs.meta.js
// ==/UserScript==
var username="";
function CheckLogin(){
    if(jQuery("meta.js-ga-set").attr('content')=="Logged In"){
        return true;
    }else{
        return false;
    }
}
function initlist(_username){
    var items = '';
    var itemlimit=10;
    var hideitem='';
    var hideitems='';
    var showbutton='';
    jQuery.getJSON( "https://api.github.com/users/"+_username+"/starred", function( data ){
        var starlen=data.length;
        jQuery.each( data, function( key, val ) {
            var ispublic='public';
            var relink='/'+val.full_name;
            var restar=val.stargazers_count;
            var rename=val.name;
            var reauther=val.owner.login;
            if(val.private===true){
                ispublic="private";
            }
            var temptext='<li class="'+ispublic+' source "><a href="'+relink+'" class="mini-repo-list-item css-truncate" data-ga-click="Dashboard, click, Popular repos list item - context:user visibility:public fork:false"><svg aria-label="Repository" class="octicon octicon-repo repo-icon" height="16" role="img" version="1.1" viewbox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z" /></svg><span class="repo-and-owner css-truncate-target"><span class="owner css-truncate-target" title="'+reauther+'">'+reauther+'</span>/<span class="repo" title="'+rename+'">'+rename+'</span></span><span class="stars"> '+restar+'<svg aria-label="stars" class="octicon octicon-star" height="16" role="img" version="1.1" viewbox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z" /></svg></span></a></li> ';
            if(key>itemlimit){
                hideitem+=temptext;
            }else{
                items+=temptext;
            }
        });
        if(starlen>itemlimit){
            hideitems='<span id="hidestars" style="display: none;">'+hideitem+'</span>';
        }
        var listhtml='<div class="boxed-group js-repo-filter flush" role="navigation" id="yourstars"><div class="boxed-group-action"><a href="/'+username+'?tab=stars" class="btn btn-sm btn-primary">              Show all stars</a></div><h3> Starred repositories <span class="counter"> '+String(itemlimit)+'/'+String(starlen)+'</span></h3><div class="boxed-group-inner"><ul class="mini-repo-list js-repo-list">'+items+hideitems+'</ul></div></div>';
        var listdata=jQuery(".dashboard-sidebar.column.one-third").html();
    jQuery(".dashboard-sidebar.column.one-third").html(listhtml+listdata);
    });
}
jQuery(document).ready(function() {
    if(CheckLogin()===true){
        username=jQuery("meta[name='user-login']").attr('content');
        initlist(username);
    }
});
