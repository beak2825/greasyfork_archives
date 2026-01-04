// ==UserScript==
// @name         互动抽奖检测
// @namespace    mscststs
// @version      0.6
// @description  检查互动抽奖情况的
// @author       mscststs
// @match        *://h.bilibili.com/*
// @match        *://space.bilibili.com/*
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.js
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=618337
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370930/%E4%BA%92%E5%8A%A8%E6%8A%BD%E5%A5%96%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370930/%E4%BA%92%E5%8A%A8%E6%8A%BD%E5%A5%96%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var $jquery = jQuery.noConflict();
	
	class Api{
		/*
			api部分
		*/
		constructor(){
			this.notice = "/lottery_svr/v1/lottery_svr/lottery_notice";
			this.titleInfo = "i/api/ajaxTitleInfo";
			this.titleWear = "i/ajaxWearTitle";
			this.GetDailyBucket = "activity/v1/Common/getReceiveGift";
		}
		async _api(url,data,method="post") {
			return axios({
				url,
				baseURL: 'https://api.vc.bilibili.com/',
				method,
				data: data,
				transformRequest: [function (data) {
					// Do whatever you want to transform the data
					let ret = '';
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
					}
					return ret;
				}],
				withCredentials: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (res) {
				return res.data;
			});
		}
		async getNotice(doc_id,type=2){
			return await this._api(`${this.notice}?business_type=${type}&business_id=${doc_id}`);
		}
	}
	let api = new Api();
	function formatTime(date = new Date(), fmt = "YYYY-MM-DD HH:mm:ss") {
      date = typeof date === "number" ? new Date(date) : date;
      var o = {
        "M+": date.getMonth() + 1,
        "D+": date.getDate(),
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      };
      var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
      };
      if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (RegExp.$1.length > 1
            ? RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468"
            : "") + week[date.getDay() + ""]
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    }
	
	const Default_Pic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAAvZJREFUeAHswTEBAAAIwCBfyy+zDUwADD8AAACg2lNlZaUaCIPYhNSXl5fzA9Vq1dTUKM6cOZN12AYM0JMaZWVlWwDsmgPM3TEUxWfGsx1j3sIxnKOFs23bthHMjmYEs23btv87NzlNmk59b2j/L01ynnpfe+7v3erLB33o2bNnJJLX8pm0mfF9+vSpibZ9iPvKeNELAFs4ZMiQnCkFB4l2h96pRE1Jm8SoCsNnswwwph4AVL1UgdNcS+wZEhsO1aGGy2eqnbGztPjLiOkl1YTXDdE+E/rE2E9Q+VjDQXKFZVowoUNQfjOmf//+BaSNMa+lcvh6xfjx47P/YOqVQdt9Ajwzbdq0zLEFhARmMNk3eC71i7hSEqNXjgnHqMq6WtU1jfP0usgkVlrAXKeSlmllEX+ZfS+PM6B3TKK3RexErSpqWMSvZvzuOE+xJ0x4nEXCIxSgPn36lLPoewf73hrnCtrFpPf/TUA4B2VD/HNOxylxBtROmzaN/xYgxE7X+q0cW0CrVq1Kz9NwBL3F6y5RFKVNFhArZ7p2FJjtPQQkUxVGB0Nzf6IV6npBvcH769BZQ8+0mNtmOz/7YBw6F/5i3MHizRkY/JrpYHIxFHmuxeLVxSm5m343wi922EKXEPsIegm9NqTf1d7+oP0FT9DnbMYST6o/8epiCz+htln8Qpn+wlQtZ7/NW1V4JvHGPk+42KHUpbEdP/IKkL6LilcXFaS22VYeA2ql+nQB6C0H7+wrIPHGPt+6mGL7WEGnkVBx3wCJJ/HGPve6OP804ODeS7y6ukp0UTd2HyXeoC6u/xifC2Zqa8b2QYsTFRLZoPrg68VJaJ/mo7Z4c4TFYldzsAY53bUCoAAoAAqAAqAAKAAKgAKgACgACoACoAAoAAqAAqAAyDB3l4DGOAQ0hh7u+ghoGRN8L0ahVglqhFaFIxL9PuG85/eX+QiooPqPMsd6Il5oyz9I0DI13f6nZEyOXfBbe3AgAAAAwDDo/tQHWTUAAAAg7IMRaQWtWFjpAAAAAElFTkSuQmCC";
	function getPic(pic){
		if(pic.length==0|| pic=="loading"){
			return Default_Pic;
		}else
		{
		return pic
		}
	}
	$jquery().ready(function(){
		function prepare_html_node(data,id=1){
			let n_time =  Math.round(new Date().valueOf()/1000);
			
			let str = "";
			
			if(data.first_prize > 0 ){
				str+=`<div class="detail"><img src="${getPic(data.first_prize_pic)}"/><span>一等奖: ${data.first_prize_cmt}  * ${data.first_prize}</span>`;
				let res = `<div class="result">`;
				if(data.lottery_result&&data.lottery_result.first_prize_result){
					for(let person of data.lottery_result.first_prize_result){
						res+=`<div class="fav"><img src="${person.face}"/><a target="_blank" href="https://space.bilibili.com/${person.uid}/#/">${person.name}</a></div>`;
					}
				}
				str+=res+`</div></div>`;
			}
			if(data.second_prize > 0 ){
				str+=`<div class="detail"><img src="${getPic(data.second_prize_pic)}"/><span>二等奖: ${data.second_prize_cmt}  * ${data.second_prize}</span>`;
				let res = `<div class="result">`;
				if(data.lottery_result&&data.lottery_result.second_prize_result){
					for(let person of data.lottery_result.second_prize_result){
						res+=`<div class="fav"><img src="${person.face}"/><a target="_blank" href="https://space.bilibili.com/${person.uid}/#/">${person.name}</a></div>`;
					}
				}
				str+=res+`</div></div>`;
			}
			if(data.third_prize > 0 ){
				str+=`<div class="detail"><img src="${getPic(data.third_prize_pic)}"/><span>三等奖: ${data.third_prize_cmt}  * ${data.third_prize}</span>`;
				let res = `<div class="result">`;
				if(data.lottery_result&&data.lottery_result.third_prize_result){
					for(let person of data.lottery_result.third_prize_result){
						res+=`<div class="fav"><img src="${person.face}"/><a target="_blank" href="https://space.bilibili.com/${person.uid}/#/">${person.name}</a></div>`;
					}
				}
				str+=res+`</div></div>`;
			}

			return `<div class="price" post="${id}"><div class="info">开奖时间: ${formatTime(data.lottery_time*1000)}<br>抽奖条件: ${data.lottery_feed_limit?"关注 ;":""} ${data.lottery_at_num?"@"+data.lottery_at_num+"个好友 ":""}</div>`+str+`</div>`;
		}
		function rewrite_lottery(ele,data,id=1){
			ele.html(ele.html().replace(/互动抽奖/,`<div style="display:inline-block"  onmouseover="show_dia(${id})" onmouseout="hide_dia(${id})"><a class="helper_lottory"><i class="svg" ></i>互动抽奖</a>`+prepare_html_node(data,id)+`</div>`));
			window.show_dia = function(post){
				if($jquery("#helper_ctrn_cla[post='"+post+"']").length){
				}else{
					$jquery("body").append(`<div id="helper_ctrn_cla" post="${post}"><style>.price[post="${post}"]{
							transition:display 1s;
							display:block;
							}
							</style></div>`);
				}
			}
			window.hide_dia = function(post){
					$jquery("#helper_ctrn_cla[post="+post+"]").remove();
			}
			
		}
		async function xiangbu(){
			let detail = await mscststs.wait(".discription",true);
			let doc_id = window.location.pathname.slice(1,1000);
			let lottery = await api.getNotice(doc_id);
			if(lottery.code==0){
				// 确实存在
				//await mscststs.sleep(1000);
				console.log(detail.innerText.length)
				rewrite_lottery($jquery(".discription"),lottery.data);
			}
		}
		async function solve_space_dynamic(card){
			let des = card.find(".original-card-content a.content");
			let id = "";
			//console.log(des.text());
			if(des.text().indexOf("互动抽奖")>=0){
				//存在互动抽奖字符
				let flag = false;
				if(des.attr("href").indexOf("t.bilibili.com")>=0){
					let ind = des.attr("href").indexOf("t.bilibili.com");
					let doc_id = parseInt(des.attr("href").slice(ind+15,1000));
					//console.log(des.attr("href")+"  "+doc_id);
					let lottery = await api.getNotice(doc_id,1);
					if(lottery.code==0){
						rewrite_lottery(des.find(".content-ellipsis"),lottery.data,doc_id);
						rewrite_lottery(des.find(".content-full"),lottery.data,doc_id);
					}
				}if(des.attr("href").indexOf("h.bilibili.com")>=0){
					let ind = des.attr("href").indexOf("h.bilibili.com");
					let doc_id = parseInt(des.attr("href").slice(ind+15,1000));
					flag  =doc_id;
					//console.log(des.attr("href")+"  "+doc_id);
					let lottery = await api.getNotice(doc_id);
					if(lottery.code==0){
						rewrite_lottery(des.find(".content-ellipsis"),lottery.data,doc_id);
						rewrite_lottery(des.find(".content-full"),lottery.data,doc_id);
					}
					
				}
			}
		}
		async function space(){
			setInterval(()=>{
				if($jquery("#page-dynamic div.card>a").length){
					//找出所有的card
					let card_array = [];
					let cards = $jquery("#page-dynamic div.card>a");
					cards.each(function(){
						if($(this).parent().attr("helper_solve")){
							//被处理过，不进行处理
						}else{
							card_array.push($(this).parent());
						}
					})
					
					for(let card of card_array){
						card.attr("helper_solve","true");
						solve_space_dynamic(card); //单独处理每一张card
					}
				}
			},1000);
		}
		async function init(){
			$jquery("body").on("dblclick",".price",function(){
				let id = $jquery(this).attr("post");
				$jquery("#helper_ctrn_cla[post="+id+"]").remove();
			})
			if(window.location.href.indexOf("h.bilibili.com")>=0){
				await xiangbu(); //bilibili 相簿
			}
			if(window.location.href.indexOf("space.bilibili.com")>=0){
				await space(); //动态
			}
		};
		init();
		$jquery("body").append(`
		<style>
		.price{
		z-index:1000;
		border:1px solid #000;
    display:none;
    position:absolute;
	color: #000000 !important;
    font-weight: normal !important;
	background-color:#fff !important;
    margin-top:0px;
    border-radius:10px;
    /*pointer-events: none;*/
    cursor: default;
    width:500px;
    padding:20px 7px;
    border: 1px solid #e3e8ec;
    box-shadow:0 0 18px 0 #aaa,0 0 3px 0 #666;
    user-select:none;
    /*border:1px solid #0f0;*/
}
.price .info{
    padding:10px 30px ;
    background-color:#f4f4f4;
    box-shadow: 0 0 14px  0 #ccc inset;
}
.price .detail{
    margin-top:20px;
}
.price .detail > img{
    margin:5px;
    width:60px;
    height:60px;
    box-shadow:0px 0px 5px 0px #4f5052;
    float:left;
    border-radius:7px;
}
.price .detail > span{
    float:left;
    padding-left:30px;
    width:400px;
    height:70px;
    line-height:70px;
}
.price .detail >.result{
    width:450px;
    max-height:200px;
    overflow:auto;
    padding:0px 25px;
    background-color:#f4f4f4;
    box-shadow: 0 0 14px  0 #ccc inset;
}
.price .detail >.result .fav{
    float:left;
    width:225px;
}

.price .detail >.result .fav a{
    position:relative;
    float:left;
    text-decoration:none;
    color:#000;
    font-family:"Avenir,Helvetica,Arial,sans-serif";
    line-height:40px;
    padding-left:12px;
}
.price .detail >.result .fav:first-child{
    margin-top:15px;
}
.price .detail >.result .fav:nth-child(2){
    margin-top:15px;
}
.price .detail >.result .fav:last-child{
    margin-bottom:15px;
}
.price .detail >.result img{
    border-radius:50%;
    width:40px;
    height:40px;
    float:left;
}
a.helper_lottory{
    cursor:pointer;
    color:rgb(0, 161, 214);
	font-weight:bold;
	user-select:none;
	padding:0 5px;
	display:inline-block;
	border-radius:4px;
}
a.helper_lottory:hover{
	background-color:rgba(0,0,0,0.1);
}
.svg{
display:inline-block;
background-image:url(https://s1.hdslb.com/bfs/seed/bplus-common/icon/2.0.6/bp-svg-icon.svg);
position:relative;top:2px;margin-left:0px;margin-right:2px;
background-position-x:0px;
background-position-y:-335px;
width:17px;
height:16px;
background-size:40px 882px;
font-size:40px;
font-style:italic;
}
		<style>
		`);

	})

    // Your code here...
})();