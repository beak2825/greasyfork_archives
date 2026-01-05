// ==UserScript==
// @name         ROBLOX Followings Manager
// @version      1.0.1
// @description  Manage who you follow on ROBLOX.com
// @author       celliott1997
// @iconURL		 http://www.roblox.com/favicon.ico
// @match        http*://*.roblox.com/friends.aspx
// @match        http*://api.roblox.com/docs*
// @grant		 GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/8398
// @downloadURL https://update.greasyfork.org/scripts/11051/ROBLOX%20Followings%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/11051/ROBLOX%20Followings%20Manager.meta.js
// ==/UserScript==

(function(){
    var loc = location.href.toLowerCase();
    function create(element){return $(document.createElement(element));};
	
    function SetupRobloxWebsite(){
		var ManageButton = create('a').html('Manage Following').addClass('rbx-btn-control-xs').attr('href', '#FollowingsTab/Manage');
		create('div').append(ManageButton).css('padding','0 5px').attr('style','padding:5px;margin:0px 0px 10px;background-color:white;box-shadow:0 0 10px #ccc;')
		.append('<a href="User.aspx?id=3659905" class="rbx-btn-control-xs" style="float:right;background-color:transparent;border-color:transparent;">glosgreen2</a>')
		.insertBefore('* #FriendTabs:eq(0)');

		ManageButton.click(function(event){
			event.preventDefault();
			window.open('http://api.roblox.com/docs?glosgreen2=true&manage=followers', 'AccountManager', 'width=600,height=400,top=30,left=30');
			return false;
		});
    };
    
    var SetupRobloxApiWebsite;
    SetupRobloxApiWebsite = function(){
        if (!(loc.indexOf('glosgreen2=true') > -1 && loc.indexOf('manage=followers') > -1)){return false;};
        $('body').html('').attr('style','cursor:default;overflow-x:hidden;min-width:300px'); $('head').html('<title>Manage Followers</title><base href="//www.roblox.com/"/>');
        $(window).on('selectstart', function(){return false;}).on('contextmenu', function(){return false;});
        
        create('link').attr('rel','stylesheet').attr('href','/CSS/Base/CSS/FetchCSS?path=leanbase___d99c3e5c331ac41c76f80e2f4e37ce3f_m.css').appendTo('head');
        create('link').attr('rel','stylesheet').attr('href','/CSS/Base/CSS/FetchCSS?path=page___f19b4c1e0eb9760d1d950a2f1d1a5566_m.css').appendTo('head');
        create('link').attr('rel','stylesheet').attr('href','//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,500,600,700').appendTo('head');
        
		var RBX_AuthToken;
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://m.roblox.com/',
			onload: function(data){
				var RBX_GetAuthToken = $($.parseHTML(data.responseText)).find('*[name="__RequestVerificationToken"]:eq(0)');
				if (RBX_GetAuthToken !== null && RBX_GetAuthToken !== 'undefined'){RBX_AuthToken = RBX_GetAuthToken.val();};
				
				var UI_Header = create('div').addClass('navbar-fixed-top').addClass('rbx-header').attr('style','height:40px !important').appendTo('body');
				create('div').addClass('container-fluid').appendTo(UI_Header)
				.append('<div class="rbx-navbar-header"><div class="navbar-header"><div class="navbar-brand"><span class="logo"></span></div></div></div>');

				var UI_Body = create('div').attr('style','display:block;margin:50px auto 0 auto;').appendTo('body');
				var UI_List = create('div').addClass('hlist').addClass('game').css('width','initial').appendTo(UI_Body);

				var UI_ControlPanel = create('div').attr('style','margin:10px 8px 10px 8px').insertBefore(UI_List);
				var UI_UnfollowBtn = create('a').html('Unfollow Selected').attr('class','rbx-btn-secondary-xs').attr('href','#').appendTo(UI_ControlPanel);
				
				var UI_ReloadBtn = create('a').html('Reload').attr('class','rbx-btn-control-xs').attr('href','#').css('margin','0 0 0 5px').appendTo(UI_ControlPanel)
				.click(function(event){event.preventDefault();location.reload();return false;});
				
				var UI_ToggleAll = create('a').html('Toggle All').attr('class','rbx-btn-control-xs').attr('href','#').css('margin','0 0 0 5px').appendTo(UI_ControlPanel)
				.attr('title','This will only toggle the visible users. To toggle them all, load the entire list by scrolling down.')
				.click(function(event){
					event.preventDefault();
					
					// This piece of code is from a bookmarklet by Stoyan Stefanov:
					// http://www.phpied.com/checktoggle-em-all/
					// Thank you! :)
					
					(function(){
						function checkFrames(w) {

							try {
								var inputs = w.document.getElementsByTagName('input');
								for (var i = 0; i < inputs.length; i++) {
									if (inputs[i].type && inputs[i].type == 'checkbox'){
										inputs[i].checked = !inputs[i].checked;
									}
								}
							} catch (e){}
							if(w.frames && w.frames.length>0){

								for(var i = 0; i < w.frames.length;i++){
									var fr = w.frames[i];
									checkFrames(fr);
								}
							}
						}
						checkFrames(window);
					})();
					
					return false;
				});
				
				UI_List.html('');
				function LoadFollowingPage(pageNumber){
					$.get('//api.roblox.com/users/followings?imageWidth=100&imageHeight=100&imageFormat=Png&page='+pageNumber, function(data){
						$.each(data, function(index, value){
							var RBX_DoesFollow = true;
							var UI_ListItem = create('div').addClass('list-item').addClass('game').css('width','140px').appendTo(UI_List);

							var UI_BtnPane = create('div');
							var UI_ItemBtn = create('a').html('Unfollow').addClass('rbx-btn-primary-xs').attr('href','#').css('width','100%').appendTo(UI_BtnPane);
							var UI_ItemChk = create('input').attr('type','checkbox').css('position','absolute').css('left','5px').attr('data-id',value['Id']);
							
							var UI_ItemImg = create('span').addClass('game-thumb-content')
							.append('<span class="game-thumb-wrapper"><img class="game-thumb" src="'+value['AvatarUri']+'"/></span>').append(UI_ItemChk);

							var UI_ItemBody = create('div').addClass('game-item').appendTo(UI_ListItem).append(UI_ItemImg)
							.append('<span class="rbx-game-title rbx-text-overflow"><img src="http://www.roblox.com/images/'+((value['IsOnline'] == true)?'online':'offline')+'.png"/> '+value['Username']+'</span>')
							.append(UI_BtnPane);

							UI_ItemBtn.click(function(event){
								event.preventDefault();

								GM_xmlhttpRequest({
									method: 'POST',
									url: 'http://m.roblox.com/Followships/Follow',
									data: '__RequestVerificationToken='+RBX_AuthToken+'&userId='+value['Id']+'&status='+(!RBX_DoesFollow),
									headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
									onload: function(data){UI_ListItem.remove();}
								});

								return false;
							});
						});
					});
				};
				
				var UI_LoadMoreBar = create('div').addClass('rbx-alert-info').html('Loading...').appendTo('body')
				.css('background-color','grey');
				
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://www.roblox.com/friends.aspx',
					onload: function(data){
						var CurrentPageNumber = 1;
						var RBX_TotalPages = $($.parseHTML(data.responseText)).find('#FollowingsTab *.page.text');
						
						if (RBX_TotalPages !== null && RBX_TotalPages !== 'undefined'){
							RBX_TotalPages = RBX_TotalPages.text();
							RBX_TotalPages = RBX_TotalPages.match(/[0-9]+/g)[1];
							
							LoadFollowingPage(1);
							CurrentPageNumber = (RBX_TotalPages > CurrentPageNumber) ? 2:1;
							
							$(window).scroll(function(){
								if($(window).scrollTop() >= $(document).height()-$(window).height()){
									if (RBX_TotalPages > CurrentPageNumber){LoadFollowingPage(CurrentPageNumber);CurrentPageNumber += 1;}
									else{UI_LoadMoreBar.remove();};
								};
							});
							
						};
					}
				});

				UI_UnfollowBtn.click(function(event){
					event.preventDefault();
					$.each(UI_List.find('input:checked'), function(_, element){
						var RBX_UserID = $(this).attr('data-id');

						GM_xmlhttpRequest({
							method: 'POST',
							url: 'http://m.roblox.com/Followships/Follow',
							data: '__RequestVerificationToken='+RBX_AuthToken+'&userId='+RBX_UserID+'&status=false',
							headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
							onload: function(data){$(element).parent().parent().parent().remove();}
						});
					});

					return false;
				});

				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://www.roblox.com/games',
					onload: function(data){
						var UI_AlertBar = $($.parseHTML(data.responseText)).find('.rbx-alert-info');
						if (UI_AlertBar !== null && UI_AlertBar !== 'undefined'){
							UI_AlertBar.insertBefore(UI_ControlPanel);
							UI_Body.css('margin-top','50px');
						};
					}
				});
			}
		});
		
		var UI_Style = create('style')
		.append('.unfollow-undo,.unfollow-undo:hover{border-color:#C63F3F !important;background-color:#C63F3F !important}')
		.appendTo('body');
    };
    
    if (loc.indexOf('/friends.aspx') > -1){
        SetupRobloxWebsite();
    }else if(loc.indexOf('api.roblox.com/docs') > -1){
        SetupRobloxApiWebsite();
    };
})();