// ==UserScript==
// @name        Remove spammers comments livejournal-users
// @name:ru     Удаление спамерских комментариев пользователей livejournal
// @version     0.2
// @description Hide spam-authors by list.
// @description:ru Скрывает спам-авторов по списку
// @include     http://livejournal.com/
// @include     http://*.livejournal.com/
// @include     http://*.livejournal.com/*
// @include     https://livejournal.com/
// @include     https://*.livejournal.com/
// @include     https://*.livejournal.com/*
// @namespace https://greasyfork.org/users/828699
// @downloadURL https://update.greasyfork.org/scripts/434473/Remove%20spammers%20comments%20livejournal-users.user.js
// @updateURL https://update.greasyfork.org/scripts/434473/Remove%20spammers%20comments%20livejournal-users.meta.js
// ==/UserScript==

(function(){

    var spamSList = [

        //insert your own list of spammers
    ];

    var wrapperS = [
        {q:'.comment-wrap .comment-head-in >span .i-ljuser >.i-ljuser-username'
         +',.comments-body .comment-meta .i-ljuser >.i-ljuser-username b'
         +',.b-tree .b-leaf-inner .i-ljuser >.i-ljuser-username'
         ,parent: 5},
        {q:'.comment-wrap.partial >.i-ljuser >.i-ljuser-username'
         +',.comments-body .collapsed-comment .i-ljuser >.i-ljuser-username'
         ,parent: 2},
    ];
    var win = typeof unsafeWindow !='undefined'? unsafeWindow : window;
	var $q = function(q, f){return (f||document).querySelector(q)};
	var setLocStor = function(name, hh){
		if(!localStorage) return;
		localStorage['removeLj_'+ name] = JSON.stringify({h: hh});
	};
	var getLocStor = function(name){
		return (JSON.parse(localStorage && localStorage['removeLj_'+ name] ||'{}')).h;
	};
	var removeLocStor = function(name){localStorage.removeItem('removeLj_'+ name);};
	var cleaning = function(){
		for(let i =0; i < wrapperS.length; i++){
			let wI = wrapperS[i];
            let wQA = [].slice.call(document.querySelectorAll(wI.q) );

            for(let j =0; j < wQA.length; j++){
				var wJ = wQA[j];
				//block spam
                var isSpam =0;
                for(let k =0; k < spamSList.length; k++){
                    if(wJ.innerHTML.replace(/<.*?>/g,'') == spamSList[k]){
                        isSpam =1;
                        break;
                    }
                }
                if(isSpam) {
                    for(let k =0; k < wI.parent; k++) {
                        wJ = wJ.parentNode;
                    }
                    wJ.style.display ='none';
                    //TODO add grey blocks
                }
            }
			//TODO add supress by click
		}
    };
    cleaning();
    LJ.Event.on("afterCommentExpand", cleaning);
	//spamSList = getLocStor('spamList') || spamSList;
	//TODO button to add to spamList

})();