// ==UserScript==
// @name        Jandan+
// @namespace   Jandan+@Byzod
// @description 煎蛋评论显示图链接
// @include     /^https?:\/\/jandan\.net\//
// @version     2016-11-24
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25097/Jandan%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/25097/Jandan%2B.meta.js
// ==/UserScript==

function JandanPlus(){
	var self = this;
	var IMAGE_URL_REGEX = /(ftp|http)s?:\/\/[^\s\r\n]+\.(jpe?g|png|bmp|gif|ico|tga|tpic|tiff|svgz?|webp|jp2|j2c)/gi;
	
	self.RegisterCommentListMutation = function(){
		var commentLists = document.querySelectorAll(".commentlist");
		var observer = new MutationObserver(
			(e)=>{
				self.ParseImgURLTextInComment(e);
			}
		);
		var config = { childList: true, subtree: true };
		if(commentLists){
			for(var commentList of commentLists){
				observer.observe(commentList, config);
			}
		}
	};
	
	self.ParseImgURLTextInComment = function(e){
		for(var record of e){
			if(record.target.id == "ds-hot-posts" || (record.previousSibling && record.previousSibling.id == "ds-hot-posts")){
				// 评论
				var comments = record.addedNodes[1].querySelectorAll(".ds-comment-body");
				// console.log("jd+ comment-body: %o", comments);//debug
				for(var comment of comments){
					var commentText = comment.querySelector("p").innerHTML;
					var matches = commentText.match(IMAGE_URL_REGEX);
					if(matches){
						for(var i = 0; i < matches.length; i++){
							commentText = commentText.replace(matches[i], '<img src="' + matches[i] + '"></img>');
							// console.log("jd+ matches[%d]: %o;\n    replace to: %o", i, matches[i], i, commentText);//debug
						}
						comment.querySelector("p").innerHTML = commentText;
					}
				}
			}
		}
	};
}
var oioi = new JandanPlus();
oioi.RegisterCommentListMutation();