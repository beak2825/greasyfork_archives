// ==UserScript==
// @name Block Sasha-Flyer
// @namespace http://tabun.everypony.ru/profile/Sasha-Flyer/
// @version 0.02
// @description Убирает комментарии Синдзи.
// @include      http://tabun.everypony.ru/*
// @include      https://tabun.everypony.ru/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13994/Block%20Sasha-Flyer.user.js
// @updateURL https://update.greasyfork.org/scripts/13994/Block%20Sasha-Flyer.meta.js
// ==/UserScript==



function parseAndBlock()
{
	var allComments = document.getElementsByClassName("comment  ");

	for (var i = 0; i < allComments.length; i++)
		{
			var comment = allComments[i];
			var commentInfo = comment.getElementsByClassName("comment-info")[0];
			if (commentInfo !== undefined) // на случай уже удалённых комментов
			{
				var commentAuthor = commentInfo.getElementsByClassName("comment-author ")[0];
				var commentAuthorName = commentAuthor.lastElementChild.innerHTML;

				if(commentAuthorName == "Sasha-Flyer")
				{
					comment.innerHTML = "";
					comment.setAttribute("style","height:0px");
					comment.setAttribute("style","min-height:0px");
				}
			}
		}
}

window.addEventListener('load',function(){
	document.getElementById('update-comments').addEventListener('click', function(event){ parseAndBlock(); },false);
	parseAndBlock();
});
