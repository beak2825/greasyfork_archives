// ==UserScript==
// @name VozHideLongPosts
// @description Chống Rết, Truyện Kiều các kiểu con đà điểu
// @grant none
// @include *://*vozforums.com/showthread.php?t=*
// @version 0.0.1.20150822071541
// @namespace https://greasyfork.org/users/14513
// @downloadURL https://update.greasyfork.org/scripts/11908/VozHideLongPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/11908/VozHideLongPosts.meta.js
// ==/UserScript==

posts = [].slice.call(document.querySelectorAll('[id^=post_message_]'));
heightLimit  = window.innerHeight*2;
hideStr = "Hide this Post";
showStr = "This post has been hidden";
var style = `
.btn-success:hover {
    color: #FFF;
    background-color: #449D44;
    border-color: #398439;
}
.btn-success {
    background-color: #5CB85C;
    border-color: #4CAE4C;
    color: #FFF;
}
.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    -moz-user-select: none;
    background-image: none;
    border: 1px solid transparent;
    /*border-radius: 4px;*/
}
.btn ~ div{
	transition: all .6s;
}
`;
customStyle = document.createElement('style');
customStyle.innerHTML = style;
document.body.appendChild(customStyle);
posts.forEach(function(post,index,array){
	if(post.offsetHeight < heightLimit){return;}
	parent = post.parentElement;
	hideBtn = document.createElement('button');
	hideBtn.setAttribute("class","btn btn-success");
	if(index !=0){
		hideBtn.innerHTML = showStr;
		post.style.display = "none";
	}
	else{
		hideBtn.innerHTML = hideStr;
	}
	hideBtn.addEventListener("click",function(){
		if(post.style.display == "none"){
			post.style.display = "block";
			this.innerHTML = hideStr;
		}else{
			post.style.display = "none";
			this.innerHTML = showStr;
		}
	})
	parent.insertBefore(hideBtn,post);
});