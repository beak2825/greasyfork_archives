// ==UserScript==
// @name         斗鱼批量取消关注
// @namespace    http://github.com/qianjiachun
// @version      0.1
// @description  斗鱼关注中新增取消关注按钮
// @author       小淳
// @match        https://www.douyu.com/directory/myFollow
// @grant        none
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/389432/%E6%96%97%E9%B1%BC%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/389432/%E6%96%97%E9%B1%BC%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==
let isClick = false; //判断是否处于批量操作
function addInfrastructure() {
	let style = document.createElement("style");
  
	style.appendChild(document.createTextNode(`
	.bubbly-button {
	  font-family: 'Helvetica', 'Arial', sans-serif;
	  display: inline-block;
	  font-size: 1em;
	  padding: 1em 2em;
	  margin-bottom: 20px;
	  -webkit-appearance: none;
	  appearance: none;
	  background-color: hotpink;
	  color: #fff;
	  border-radius: 4px;
	  border: none;
	  cursor: pointer;
	  position: relative;
	  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
	  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
	}
	.bubbly-button:focus {
	  outline: 0;
	}
	.bubbly-button:hover {
	  color: royalblue;
	}
	.bubbly-button:before, .bubbly-button:after {
	  position: absolute;
	  content: '';
	  display: block;
	  width: 140%;
	  height: 100%;
	  left: -20%;
	  z-index: -1000;
	  transition: all ease-in-out 0.5s;
	  background-repeat: no-repeat;
	}
	.bubbly-button:before {
	  display: none;
	  top: -75%;
	  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
	  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
	}
	.bubbly-button:after {
	  display: none;
	  bottom: -75%;
	  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
	  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
	}
	.bubbly-button:active {
	  transform: scale(0.9);
	  background-color: #e60074;
	  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
	}
	.bubbly-button.animate:before {
	  display: block;
	  animation: topBubbles ease-in-out 0.75s forwards;
	}
	.bubbly-button.animate:after {
	  display: block;
	  animation: bottomBubbles ease-in-out 0.75s forwards;
	}
	
	@keyframes topBubbles {
	  0% {
	    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
	  }
	  50% {
	    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
	  }
	  100% {
	    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
	    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
	  }
	}
	@keyframes bottomBubbles {
	  0% {
	    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
	  }
	  50% {
	    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
	  }
	  100% {
	    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
	    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
	  }
	}

	`));
	
	

	document.head.appendChild(style);
}




function unFollowRoom(room_id,fElement) {
	$.ajax("https://www.douyu.com/room/follow/cancel_confuse/" + room_id, {
	    type: 'post',
	    success: function(data1){
			let data2 = eval("(" + data1 + ")");
			if (data2.error == "0") {
				console.log(room_id + "取关完毕");
				fElement.remove();
			} else{
				console.log(room_id + "取关失败");
			}
		}
	});
}


function unFollowRooms(e){
	var classname = document.getElementsByClassName("bubbly-button");
	
	for (var i = 0; i < classname.length; i++) {
	  classname[i].addEventListener('click', animateButton, false);
	}
	let allRooms = document.getElementsByClassName("DyLiveCover-selectArea is-active");
	let room_id = "";
	if (allRooms.length >= 1) {
		let ret = confirm("是否确定取关？");
		if (ret == false) {
			return;
		}
	} else{
		return;
	}
	for (let i = 0; i < allRooms.length; i++) {
		if (allRooms[i].parentElement.getAttribute("href") == null) {
			room_id = allRooms[i].parentElement.querySelector("a").getAttribute("href");
		} else{
			room_id = allRooms[i].parentElement.getAttribute("href");
		}
		room_id = room_id.substring(1);//得到房间号
		unFollowRoom(room_id,allRooms[i].parentElement.parentElement);
	}
	
	
}
var animateButton = function(e) {
	
	  e.preventDefault;
	  //reset animation
	  e.target.classList.remove('animate');
	  
	  e.target.classList.add('animate');
	  setTimeout(function(){
	    e.target.classList.remove('animate');
	  },700);
};

(function(){
	
	window.unFollowRooms = unFollowRooms;
	addInfrastructure();

	let intID = setInterval(() => {
		if (typeof(document.getElementsByClassName("BranchTool")[0]) != "undefined") {
			document.getElementsByClassName("BranchTool")[0].onclick = function() {
				let fdiv = document.getElementsByClassName("FollowList-tabs")[0];
				if (typeof(document.getElementsByClassName("BranchTool-all")[0]) == "undefined") {
					isClick = true;
					let div = document.createElement("div");
					
					div.innerHTML = "<a href='javascript:void(0);' onclick='unFollowRooms()' id='unFollow' class='bubbly-button'>取消关注</a>";
					
					fdiv.insertBefore(div,fdiv.childNodes[0]);
				} else{
					isClick = false;
					document.getElementById("unFollow").remove();
				}
				console.log(isClick);
			}
			clearInterval(intID);
		}
	},1000);
	
	
})()




