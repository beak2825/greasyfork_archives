// ==UserScript==
// @name         Shouts v6 Fabi
// @namespace    Fabi
// @version      0.5
// @description  Cambia la apariencia actual de la vista de un shout individual a algo más "vistoso"
// @author       Fabi
// @include        http*://www.taringa.net/*/mi/*
// @downloadURL https://update.greasyfork.org/scripts/21758/Shouts%20v6%20Fabi.user.js
// @updateURL https://update.greasyfork.org/scripts/21758/Shouts%20v6%20Fabi.meta.js
// ==/UserScript==
userNick="";
shoutTitle="";
$('body').hide();

$('head').append('<style>body .v6 .v6-container{border-right:1px solid #CCC;border-left:1px solid #CCC;background:#fff;width:1000px}body .shout-detail{margin:-8px 0 0 5px}body .shout-main-content{border:1px solid #CCC;border-bottom:1px solid #CCC;min-height:35px;width:609px!important;border-radius:5px 5px 0 0;padding:10px 20px;padding-top:21px;margin:0}body .shout-item .shout-txt{margin-bottom:15px;font-size:14px;color:#000}body .shout-detail .wrap-actions{right:-33px;top:4px}body .shout-detail .secondary-actions{height:34px;border:1px solid #CCC;border-top:1px solid #e9e9e9;border-radius:0 0 5px 5px;box-shadow:0 2px 3px #eee;background:#fafafa url(http://o1.t26.net/img/bfs.gif) bottom left repeat-x;width:649px;margin-top:-4px}body .secondary-actions .list-social-media{display:none!important}body .secondary-actions .list-main-actions{float:right;margin-right:0!important}body .secondary-actions .list-main-actions li{margin-right:0}body .secondary-actions .list-main-actions > li > a{background:url(http://o1.t26.net/img/button-action-s.png) left bottom no-repeat!important;padding-right:7px;padding-left:10px}.shout-action-activity{margin-right:10px;float:left}.actvt{float:left;left:-447px;position:relative}body .secondary-actions .list-main-actions li span{font-weight:700;font-size:12px}body .secondary-actions .list-main-actions li a:before{font-size:14px;margin-right:5px}.dropdown_scroll.shout-activity-container li a{display:inline-block!important}.shout-user .shout-user_name{position:absolute;top:3px;font-weight:700;color:#000}.shout-user_img.og-img-user{margin-top:17px}.shout-user .follow-buttons{position:absolute;top:109px;left:140px}.shout-user{margin-top:-2px}.player-post .icon-rew:before,.player-post .icon-ff:before{display:none}body .comments-primary{background-color:#fff;margin:0 0 15px 14px;width:652px;padding-top:0}body .myComment .myComment-text-box{width:550px;margin-left:12px}.parent-comment .myComment .myComment-text-box{width:508px}.replyBox .comment-data .parent-comment{margin:0 12px 0 69px}.comment{border-top:1px dotted #CCC}body .comments-primary article .replyBox .comment-data{width:32px;margin:0 12px 0 69px}.comments__title{margin-top:-1px;margin-left:17px;font-size:17px}.comments-primary .comment-content{color:#000}.myComment .myComment-text-box textarea,.myComment .myComment-text-box textarea:focus{color:#000}.fixme-shout{display:none}.comments-primary .comment-content>a,.comments-primary .comment-author .hovercard,.shout-user .shout-user_name,body .shout-main-content a:hover,body .shout-main-content a,body .shout-user_name a{color:#006595;font-weight:700}i.icon.sprite-document-text-image{background-position:-51px -51px;margin-right:6px}i.icon.points{background-position:-85px -34px;margin-right:6px}i.icon.followers{background-position:-102px -35px;margin-right:6px}.player-post li > a{width:0px!important}.uData{position:relative;float:right;width: 170px;top:-139px}.user-followers,.user-points,.user-shouts{font-size:11px;color:#CCC}.user-followers span,.user-points span,.user-shouts span{font-size:18px;color:#000!important;font-weight:700}.user-rank{border-color:#CCDCEF;font-weight:700;text-align:center;color:#105CB6;background-color:#E3E8F4;margin-top:-2px;padding:4px 8px 5px;width:105px;font-size:12px}footer.contentinfo::before{height:0}footer.contentinfo{margin-bottom:-20px}footer.contentinfo p.hosted{margin-bottom:0}.shouts_user_activity{top:22px;left:inherit;right:-32px}.shouts_user_activity li{background:#fff;padding-left:6px}.shouts_user_activity li.dropdown-wrapper-list{padding-left:0}.shouts_user_activity .user_total-activity{text-align:center;background:#f5f5f5;padding:6px 3px 5px}.shouts_user_activity .user_total-activity li{display:inline-block!important;background:none!important;padding:0!important;color:#757575!important;font-weight:400!important}.shouts_user_activity .user_total-activity li .dash{color:#ccc!important;margin-right:.4em!important}.shouts_user_activity li.dropdown-wrapper-list{padding-left:0}.shouts_user_activity li{background:#fff;padding-left:6px}.shouts_user_activity .dropdown_scroll{max-height:200px;overflow-y:scroll}.shouts_user_activity .dropdown_scroll li{padding:1px 3px 7px 6px}.shouts_user_activity li{background:#fff;padding-left:6px}.shouts_user_activity li.loading{padding:5px 0}.shouts_user_activity .loading{margin-bottom:0!important}.shouts_user_activity li{background:#fff;padding-left:6px}.shouts_user_activity .dropdown_scroll li{padding:1px 3px 7px 6px}.shouts_user_activity .dropdown_scroll li .activities_user{max-width:100px;display:inline-block;position:relative;top:3px}.shouts_user_activity li .icon{color:#757577}.shouts_user_activity .activities_img{width:18px;height:18px;border-radius:2px;position:relative;top:5px;margin:0 5px}.shouts_user_activity{width:211px;background-color:#fff}.user_total-activity{width:126%}body .shout-detail .shout-main-content .shout-content--img img{max-width:100%;width:initial}.comments-primary .comments-closed,.comments-primary .comments-empty{background:rgba(255,235,59,0.48);border:1px rgba(255,193,7,0.65) solid;border-radius:1px;font-weight:700;color:rgba(125,117,9,0.72);margin:10px;padding:14px 10px;font-size:14px;text-align:center}</style>');
$(document).ready(function(){
    //Hide body
    
    
    //StyleSheet
    
    
    //Move things
    $('.shout-user').prependTo($('.sidebar'));
    $('.list-main-actions').prepend('<li class="actvt"></li>');
    $('.shout-action-activity').appendTo($('li.actvt'));
    
    //Avatar
    var avatarR=$('.shout-user_img').attr('src');
    $('.shout-user_img').attr('src',avatarR.replace('48x48','120x120'));
    
    //Show bar
    var htmlTBar='<div class="v6">\
			<div class="v6-container" style="min-height: 0px;">\
					<nav class="tabs">\
				<ul>\
					<li class="">\
				<a href="/mi" data-tag="," data-tab="">Mi Taringa!</a>\
			</li>\
					<li class="">\
				<a href="/mi/destacados" data-tag="," data-tab="">Destacados</a>\
			</li>\
					<li class="">\
				<a href="/mi/populares" data-tag="," data-tab="">Populares</a>\
			</li>\
					<li class="">\
				<a href="/mi/publico" data-tag="," data-tab="">Público</a>\
			</li>\
			</ul>\
					<ul class="clearfix player-post">\
							<li><a href="/shoutNavigator.php?shoutId='+$('.shout-item').attr('data-fetchid')+'&amp;type=prev" original-title="Shout anterior (más viejo)" class="icon-rew before hastipsy"></a></li>\
							<li><a href="/shoutNavigator.php?shoutId='+$('.shout-item').attr('data-fetchid')+'&amp;type=random" original-title="Shout aleatorio" class="icon-random shuffle hastipsy"></a></li>\
							<li><a href="/shoutNavigator.php?shoutId='+$('.shout-item').attr('data-fetchid')+'&amp;type=next" original-title="Shout siguiente (más nuevo)" class="icon-ff next hastipsy"></a></li>\
					</ul>\
</nav>\
							</div>\
		</div>';
    
    $(htmlTBar).insertAfter($('body .v6').first());
    
    
    //COMMENT CREATOR
    
   // $('#commentBox').insertAfter($('.comment-replies-container.parent-comment').last());
    $('#commentBox').insertAfter($('#comments'));
    $('.comments__title').insertAfter('.shout-item');
    
    
    //UserData

    $('.shout-user-info').prepend('<div class="uData"><ul></ul></div>');
    
    var dataName=$('.shout-user .shout-user_name').attr('data-uid');
    
    //GetData
    $.ajax({
        url:'http://api.taringa.net/user/view/'+dataName,
        type:'get',
        success:function(ev){
            
            var vals=ev;
            $.ajax({
                url:'/'+vals.nick,             
                beforeSend:function(er,rr){
                    rr.url='/'+vals.nick+'/posts';
                    er.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
                },
                success:function(rev){
                    var re = /<style>body{background:\s*url\(\"(.*?)}<\/style>/ig; 
                    var res = re.exec(rev);
                    $('body').css('background','url("'+res[1]+'');
                }
            });
            
                          
            $('.shout-user-info').prepend('<div class="user-rank">'+vals.range.name+'</div>');
            $.ajax({
                url:'http://api.taringa.net/user/stats/view/'+vals.id,
                type:'get',
                success:function(res){
                    
                    var dd = res;
                    $('.uData ul').append('<li class="user-followers"><i class="icon followers"></i><span>'+addCommas(dd.followers)+'</span> Seguidores</li>');
                    $('.uData ul').append('<li class="user-points"><i class="icon points"></i><span>'+addCommas(dd.points)+'</span> Puntos</li>');
                    $('.uData ul').append('<li class="user-shouts"><i class="icon sprite-document-text-image"></i><span>'+addCommas(dd.shouts)+'</span> Shouts</li>');
                    
                    if($('.shout-user .shout-user_name').attr('data-uid') == global_data.user){
                        $('.shout-user-info .follow-buttons').remove();
                    }
                    userNick=vals.nick;
                    var hasImage= $('.shout-main-content').hasClass('image');
                    var hasVideo= $('.shout-main-content').hasClass('video');
                    shoutType="shout";
                    if(hasImage){
                        shoutTitle= userNick+ " compartió una imagen - Taringa!";
                    }
                    else if(hasVideo){
                        shoutTitle= userNick+ " compartió una video - Taringa!";
                    }
                    else{
                        var shoutC=$('.shout-txt').html();                        
                        shoutC = shoutC.substr(0, 50);
                        shoutC = shoutC.substr(0, Math.min(shoutC.length, shoutC.lastIndexOf(" ")))
                        shoutC= shoutC + "...";
                        shoutTitle= shoutC + "- @" + userNick +" - Taringa!";
                    }
                    //Title
                    setInterval(function(){
                        var dattt= JSON.parse(localStorage.syncTabs_Data);
                        var counts=dattt[0].params[0].counts.notification;
                        if(counts>0){
                            shoutNot= "("+counts+") "+ shoutTitle;
                            document.title = shoutNot;
                        }
                        else{
                            document.title = shoutTitle;
                        }
                    },800);

                    //Show body again
                  $('body').show();
                }
            }).error(function(){$('body').show();});
        }    
    }).error(function(){$('body').show();});
      
   
});
//http://stackoverflow.com/questions/3753483/javascript-thousand-separator-string-format
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}
