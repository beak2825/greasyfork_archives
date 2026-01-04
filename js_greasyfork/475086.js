// ==UserScript==
// @name         海外拼多多自动加入发货单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于海外版拼多多自动加入发货单
// @author       强仔
// @match        https://kuajing.pinduoduo.com/main/order-manage
// @icon         https://kj-bstatic.pddpic.com/static/sc-container/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475086/%E6%B5%B7%E5%A4%96%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%85%A5%E5%8F%91%E8%B4%A7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/475086/%E6%B5%B7%E5%A4%96%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%85%A5%E5%8F%91%E8%B4%A7%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const random = Math.random();
    const queryS = (selector) => {
        return document.querySelector(selector);
    }

    const css = css => {
            const myStyle = document.createElement('style');
            myStyle.textContent = css;
            const doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        }

    css(`#zuihuitao {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
			#zuihuitao .logo { position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: deepskyblue;}
			#zuihuitao .die {display:none; position:absolute; left:26px; top:0; text-align:center;background-color:#B9B9FF; border:1px solid gray;}
			#zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 2px;list-style-type: none;}
			#zuihuitao .die li:hover{color:#fff;background:#97CBFF;}
            @media print {body {display: block !important;}}
            *{-webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text;}
			.add{background-color:#BBFFFF;}
            .btn-success{position: fixed;font-weight: 400;color: #fff;background-color: #28a745;border-color: #28a745;text-align: center;vertical-align: middle;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;line-height: 1.5;border-radius: .25rem; z-index:2147483647;cursor: pointer;}`);


    const _html = `<div id='zuihuitao'>
		    <div class='item_text'>
		        <div class="logo"><a id="m">自动加入发货台</a></div>
		            <div class='die' >
		                <div style='display:flex;'>
		                    <div style='width:76px; padding:0px 0;'>
		                        <ul style="padding-left: 0px;">
                                    <li id="li0">开启</li>
                                    <li id="li1">关闭</li>
		                        </ul>
							</div>`;
    // $("#root").html(_html);
    //document.body.innerHTML += _html;
    const div = document.createElement('div');
    div.innerHTML = _html;
    document.body.appendChild(div);
    queryS("#zuihuitao > div").addEventListener("mouseover", () => {
        queryS("#zuihuitao > div > div.die").style.display = "block";
    });
    queryS("#zuihuitao > div").addEventListener("mouseout", () => {
        queryS("#zuihuitao > div > div.die").style.display = "none";
    });
    console.log(document.lastModified);

    let intervalId;
    let startnum = 0;
    let last_num = 0;
    let index = 0;

    queryS("#li0").addEventListener("click", e => {
        // var xpath = "/html/body/div[4]/div/div[1]/div/div/div/div[2]/button";
        ///html/body/div[5]/div/div[1]/div/div/div/div[2]/button
        ///html/body/div[5]/div/div[1]/div/div/div/div[2]/button
        var btnSelector = '.BTN_outerWrapper_5-72-0.BTN_primary_5-72-0.BTN_medium_5-72-0.BTN_outerWrapperBtn_5-72-0'

        // CSS选择器
        var cssSelector = 'a[data-tracking-id="custom-t3wO-KG-3BT_5xyK"]';
        // 使用document.querySelectorAll()方法查询所有匹配的元素
        var elements = document.querySelectorAll(cssSelector);

        last_num = elements.length;
        startnum = elements.length;

        let retry = 0;

        intervalId = setInterval(function() { // 每秒执行一次加入
            var elements = document.querySelectorAll(cssSelector);
            if (elements.length < last_num){ // 加入发货台成功，发送通知
                last_num = elements.length;
                console.log('通知加入成功！！！');
            }else{
                console.log('尝试失败，继续操作！');
            }

            if (last_num <= 0 || index >= last_num || retry > 1000) {
                clearInterval(intervalId); // 如果满足条件，停止循环
                console.log('没有找到对象，自动关闭!!!');
                alert("已关闭自动加入发货台功能。成功订单数量：" + (startnum - last_num));
                return;
            }
            while (index < last_num && elements[index].hasAttribute("disabled")) {
                index += 1;
            }
            console.log('点击对象序列：' + index);

            if (index >= last_num || elements[index].hasAttribute("disabled")) {
                // clearInterval(intervalId); // 如果满足条件，停止循环
                // console.log('没有找到对象，自动关闭!!!');
                // alert("已关闭自动加入发货台功能。成功订单数量：" + (startnum - last_num));
                // return;
                retry += 1;
                index = 0;
                console.log('==============重试次数：' + retry);
                document.querySelectorAll(btnSelector)[0].click();
                return;
            }

            elements[index].click();

            setTimeout(function() {
                document.querySelectorAll(btnSelector)[1].click();
            }, 800);
        }, random * (2000 - 1500) + 1500);
    });

    queryS("#li1").addEventListener("click", e => {
        clearInterval(intervalId); // 停止循环
        console.log('关闭成功!!!');
        alert("已关闭自动加入发货台功能。成功订单数量：" + (startnum - last_num));
    });
})();