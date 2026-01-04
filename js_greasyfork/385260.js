// ==UserScript==
// @name         微博抽奖
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/385260/%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/385260/%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {

	let forStep=(items,step,end)=>{
		let index=-1;
		let over=0;
		let length=items.length;
		let run=()=>{
			index++;

			let item=items[index];

			if(!item){
				return;
			}
			step.apply(items,[item,next,index]);
		},
		next=()=>{
			over++;
			if(over == length){
				if(end){
					end();
				}
				return;
			}
			setTimeout(run,1);
		};
		run();
	};

	// 随机数组方法
	let shuffle=(arr)=>{ 
		let i = arr.length; 
		while (i) { 
			let j = Math.floor(Math.random() * i--);
			[arr[j], arr[i]] = [arr[i], arr[j]]; 
		} 
	};

	let getWeiboPostsHTMLByPid=(wbpid,onOver)=>{
		let page = 1;
		let max  = 1;
		let html = '';
		let one = ()=>{
			let url = 'https://weibo.com/aj/v6/mblog/info/big?ajwvr=6&id='+wbpid+'&page='+page;
			fetch(url,{
				credentials: 'include',
				mode: 'cors',
				headers: {
					'content-type': 'application/json'
				},
			})
			.then(res => res.json())
			.then(r => {
				html += r.data.html;
				max  = r.data.page.totalpage;

				console.log(/完成一页转发数据/,page+'/'+max);
				if(page < max){
					page++;
					one();
				}else{
					onOver(html);
				}
			});
		};
		one();
	};
	let getWeiboPostsByPid=(wbpid,onOver)=>{
		getWeiboPostsHTMLByPid(wbpid,html=>{
			let div = document.createElement('div');
			div.innerHTML = html;
			let originList = div.querySelectorAll('.list_li[mid]');

			originList = Array.prototype.slice.call(originList);

			originList = originList.map(item=>{
				let mid  = +item.getAttribute('mid');
				let img  = item.querySelector('img');
				let uid  = +img.getAttribute('usercard').match(/\d+$/)[0];
				let unix = +item.querySelector('[date]').getAttribute('date');
				let href = item.querySelector('[date]').href;

				let data = {
					avatar : img.src,
					name   : img.alt,
					img,
					uid,
					mid,
					text   : item.querySelector('span[node-type="text"]').innerText,
					atNum  : +item.querySelector('a[action-type="feed_list_forward"]').innerHTML.match(/\d+$/)||0,
					unix
				};
				return data
			});
			originList.sort((a,b)=>b.unix-a.unix);

			onOver(originList);
		})
	};

	let 在微博详情页开启转发抽奖 = (config)=>{
		let wbpid;
		try{
			wbpid = +document.body.innerHTML.match(/isReEdit=1&mid=(\d{6,})/)[1];
		}catch(e){
			return alert('这不是一个微博详情页面！');
		}

		

		getWeiboPostsByPid(wbpid,originList=>{
			let User = {};
			let returnList = [];

			let data = {
				originList,
				diffNum:0,
				selfNum:0,
			};

			data.returnList = originList.filter(item=>{

				//禁止我自己中奖
				if(!config.self){
					if(item.uid == $CONFIG['uid']){
						data.selfNum++;
						console.log(/刨除我自己的转发微博/,item);
						return false;
					}
				}

				//根据 uid 排重
				if(config.diff){
					if(User[item.uid]){
						data.diffNum++;
						console.log(/重复转发，仅生效一条/,item);
						return false;
					}
					User[item.uid] = item;
				}

				return true;
			});

			console.log(/抽奖数据？/,data);


			forStep(data.returnList,(item,nextItem,index)=>{
				let img = new Image();
				img.src = item.avatar;
				console.log(/完成头像数据抓取/,index+'/'+data.returnList.length);
				img.onload = ()=>{
					item.img = img;
					nextItem();
				}
			},()=>{
				生成转发抽奖结构(data);
			})

		})

	};

	let 生成转发抽奖结构=(data)=>{
		let div = document.createElement('div');
		div.innerHTML = `

<style>
.itorr-shadow-box{
	position: fixed;
	top:0;
	right:0;
	bottom:0;
	left:0;
	background:rgba(0,0,0,.9);
    z-index: 9999;
    font-size:14px;
}
.itorr-body-box{
	position: absolute;

	top:0;
	right:0;
	bottom:0;
	left:0;
	margin:auto;

	width: 800px;
	height: 670px;
	background:#FFF;
	border-radius:4px;
}
.itorr-body-box>.head .cover-box{
	position: relative;
	height:150px;
	overflow:hidden;
}
.itorr-body-box>.head .cover-box::before{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    height: 150px;
    margin:auto;
    z-index: 1;
    background: #b16a00;
}
.itorr-body-box>.head canvas{
	position: absolute;

	height:50px;
	top:50px;
	transition:opacity 1s ease;
	opacity:0;
	margin-left: 350px;
}
.itorr-body-box>.head canvas.start{
	animation: move 10s cubic-bezier(.34,.52,0,1);
	transform:translateX(-90%);
	opacity:1;
}
@keyframes move{
	from {
		transform:translateX(0);
	}
	to {
		transform:translateX(-90%);
	}
};

.itorr-body-box>.body{
	
}
.itorr-body-box h3{
    font-weight: bold;
    padding: 10px;
}
.itorr-body-box>.body .user-list{
	overflow: hidden;
	padding:10px 0 0 10px;
}
.itorr-body-box>.body .user-list img{
    float  : left;
    width  : 32px;
    height : 32px;
    margin : 0 2px 2px 0;
}
.itorr-body-box>.foot{
	padding:20px;
	margin:15px;
	background:#F8F8F8;
}
</style>
<div class="itorr-shadow-box">
	<div class="itorr-body-box">
		<div class="head">
			<div class="cover-box">
				<canvas>
			</div>
		</div>
		<div class="body">
			<h3>待抽奖用户名单</h3>
			<div class="user-list"></div>
		</div>
		<div class="foot">
			<p>转发总数：<b>${data.originList.length}</b></p>
			<p>重复转发数：<b>${data.diffNum}</b></p>
			<p>我的转发数：<b>${data.selfNum}</b></p>
			<p>实际有效的抽奖用户数：<b>${data.returnList.length}</b></p>
			<button id="开始抽奖">开始抽奖</button>
		</div>
	</div>
</div>
		`;
		data.returnList.forEach(item=>{
			div.querySelector('.user-list').appendChild(item.img);
		})

		document.body.appendChild(div);

		开始抽奖.onclick=()=>{
			shuffle(data.returnList);

			let list = data.returnList;
			let canvas = div.querySelector('canvas');

			let width = 50;
			canvas.height = width;
			canvas.width = width * list.length;
			let ctx = canvas.getContext('2d');

			list.forEach((item,index)=>{
				ctx.drawImage(item.img,index*width,0,width,width);
			});

			let item = list[Math.ceil(list.length*.9)];

			

			setTimeout(()=>{
				console.log(/中奖的用户是这个人/,item);
				alert('中奖的用户是这个人\n'+JSON.stringify(item,0,4));
			},12000);

			canvas.className='start';

		};
	};

	let button = document.createElement('button');

	button.innerHTML='在当前页面尝试转发抽奖';
	button.style.cssText ='position:fixed;bottom:0;left:0;margin:20px;'
	document.body.appendChild(button);

	button.onclick=()=>{
		在微博详情页开启转发抽奖({
			diff:true,
			self:false
		})
	};

})();