// ==UserScript==
// @name         安徽86文字标红一键办理
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  系统文字变红，突然文字亮点，轻松锁定。
// @author       You
// @match        http://ngcs.cs.cmos/ngcs/index_cloud.html
// @match        http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/*/*_main.html
// @exclude      http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/busi298/busi298_main.html

// @icon         https://www.google.com/s2/favicons?sz=64&domain=cs.cmos
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486825/%E5%AE%89%E5%BE%BD86%E6%96%87%E5%AD%97%E6%A0%87%E7%BA%A2%E4%B8%80%E9%94%AE%E5%8A%9E%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/486825/%E5%AE%89%E5%BE%BD86%E6%96%87%E5%AD%97%E6%A0%87%E7%BA%A2%E4%B8%80%E9%94%AE%E5%8A%9E%E7%90%86.meta.js
// ==/UserScript==
//http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/busi298/busi298_main.html
(function() {
    'use strict';

    function go(){
        // 获取当前页面的 URL
        const currentUrl = window.location.href;
        console.log(currentUrl);
        if (currentUrl.includes('http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/busi154/busi154_main.html')) {
            // 假设multiLineString包含了你想要处理的数据
            var multiLineString = `【一键办理：热门推荐】1500积分兑换100分钟通话-当月使用到月底|s4622ActList:积分兑换业务营销活动（2024年）|s4622MeanList:1500积分兑换100分钟语音包|s4622ContentDisplay:100分钟语音包（积分兑换）(必选)
【一键办理：热门推荐】2100积分兑换2个G流量-当月使用到月底|s4622ActList:积分兑换流量包活动（2024年）|s4622MeanList:2100积分兑换2GB流量加油包|s4622ContentDisplay:2GB流量加油包（积分兑换）(必选)
【一键办理：热门推荐】3000积分兑换5个G流量-当月使用到月底|s4622ActList:积分兑换流量包活动（2024年）|s4622MeanList:3000积分兑换5GB流量加油包|s4622ContentDisplay:5GB流量加油包（积分兑换）(必选)
【一键办理】全省大众市场积分购1元享流量包(2年期)QHY|s4622ActList:全省大众市场积分购1元享流量包(2年期)QHY|s4622MeanList:1积分购国内1GB*24月+流量包优惠1元*1月|s4622ContentDisplay:新版轻合约流量包（国内1GB，24个月）(必选)
【一键办理】全省大众市场1元享流量包（2年期）QHY|s4622ActList:全省大众市场1元享流量包（2年期）QHY|s4622MeanList:（当月生效）月享国内1G流量24个月|s4622ContentDisplay:新版轻合约流量包（国内1GB，24个月）(必选)
【一键办理】全省大众市场积分购1元享语音包(2年期)QHY|s4622ActList:全省大众市场积分购1元享语音包(2年期)QHY|s4622MeanList:1积分购国内50分钟*24月+语音包优惠1元*1月|s4622ContentDisplay:新版轻合约通话包（国内50分钟，24个月）(必选)
【一键办理】全省大众市场1元享语音包（2年期）QHY|s4622ActList:全省大众市场1元享语音包（2年期）QHY|s4622MeanList:（当月生效）月享国内50分钟通话，24个月|s4622ContentDisplay:新版轻合约通话包（国内50分钟，24个月）(必选)
`;


            // 分割多行字符串为行数组
            var lines = multiLineString.split('\n');

            // 创建新的ul元素，并设置一个id以便后续查找
            var newUl = document.createElement('ul');
            newUl.id = 'dynamicUl';
            newUl.className = 'ued-slide-check';

            // 处理每行字符串
            lines.forEach(function (line) {
                // 分割行为多个部分
                var parts = line.split('|');
                if (parts.length > 1) { // 确保行包含多个部分
                    // 创建li元素并设置其内容为第一个部分
                    var li = document.createElement('li');
                    li.style.color = 'red';
                    var span = document.createElement('span');
                    span.textContent = parts[0]; // 显示"操作指南"或其他指令文本
                    li.appendChild(span);

                    // 将整行作为mydata属性存储
                    li.setAttribute('mydata', line);

                    // 为li元素添加点击事件监听器
                    li.addEventListener('click', function () {
                        // 获取当前li的mydata属性
                        var mydata = this.getAttribute('mydata');
                        // 分割mydata字符串，跳过第一个部分（操作指南文本）
                        var commands = mydata.split('|').slice(1);
                        console.log(commands);
                        // 依次处理每个命令
                        commands.forEach(function (command, index) {
                            //console.log(index);
                            setTimeout(function () {
                                var [divId, liContent] = command.split(':');
                                var targetDiv = document.getElementById(divId);
                                var have=false;
                                if (targetDiv) {
                                    var targetList = targetDiv.querySelectorAll('li');
                                    targetList.forEach(function (li) {
                                        // console.log(li.textContent);
                                        if (li.textContent.includes(liContent)) {
                                            console.log(`模拟点击 '${liContent}'`); // 演示用
                                            // 实际应用中可以在这里触发点击事件或其他操作
                                             have=true;
                                            li.click();

                                        }
                                    });
                                    //s4622ActList

                                    if(index==0 && !have) {
                                        // 触发点击事件
                                        document.querySelector("#s4622ActList > p > a").click();

                                        // 使用setTimeout延迟后续操作，以等待页面加载或处理
                                        setTimeout(function() {
                                            // 获取目标div，此时页面应该已经响应了之前的点击
                                            var targetDiv = document.querySelector("#moreActList");
                                            console.log(targetDiv);

                                            // 如果targetDiv存在，则继续执行后续操作
                                            if(targetDiv) {
                                                var targetList = targetDiv.querySelectorAll('li');
                                                console.log(targetList);

                                                // 遍历列表项
                                                targetList.forEach(function (li) {
                                                    // 检查列表项文本是否包含特定内容
                                                    if (li.textContent.includes(liContent)) {
                                                        console.log(`模拟点击 '${liContent}'`); // 演示用
                                                        // 实际应用中可以在这里触发点击事件或其他操作
                                                        li.click();

                                                        // 如果有特定的操作需要在点击后的一段时间执行，可以在这里使用setTimeout

                                                        setTimeout(function() {
                                                            selectSingelActFromMore();
                                                        }, 500); // 延迟500毫秒

                                                    }
                                                });
                                            }
                                        }, 500); // 延迟500毫秒以等待页面响应点击事件
                                    }



                                    if(index==1 && !have) {
                                        // 触发点击事件
                                        document.querySelector("#s4622MeanList > p > a").click();

                                        // 使用setTimeout延迟后续操作，以等待页面加载或处理
                                        setTimeout(function() {
                                            // 获取目标div，此时页面应该已经响应了之前的点击
                                            var targetDiv = document.querySelector("#moreMeansList");
                                            console.log(targetDiv);

                                            // 如果targetDiv存在，则继续执行后续操作
                                            if(targetDiv) {
                                                var targetList = targetDiv.querySelectorAll('li');
                                                console.log(targetList);

                                                // 遍历列表项
                                                targetList.forEach(function (li) {
                                                    // 检查列表项文本是否包含特定内容
                                                    if (li.textContent.includes(liContent)) {
                                                        console.log(`模拟点击 '${liContent}'`); // 演示用
                                                        // 实际应用中可以在这里触发点击事件或其他操作
                                                        li.click();

                                                        // 如果有特定的操作需要在点击后的一段时间执行，可以在这里使用setTimeout

                                                        setTimeout(function() {
                                                            selectSingelMeanFromMore();
                                                        }, 500); // 延迟500毫秒

                                                    }
                                                });
                                            }
                                        }, 500); // 延迟500毫秒以等待页面响应点击事件
                                    }



                                    // 使用setTimeout来实现等待0.5秒（500毫秒）
                                    setTimeout(function() {
                                        // 这里的代码会在等待0.5秒后执行
                                        if(index == 2) {
                                            submitMarketOrder();
                                        }
                                    }, 500); // 500毫秒后执行函数
                                }
                            }, 1000 * index*2); // 每间隔1秒处理一个命令
                        });


                    });

                    // 将li元素添加到ul中
                    newUl.appendChild(li);
                }
            });

            // 获取#actCategory元素
            var actCategory = document.querySelector('#actCategory');

            // 将新的ul元素添加到#actCategory的下方
            if (actCategory) {
                actCategory.parentNode.insertBefore(newUl, actCategory.nextSibling);
            }
        }



        // 对第一个网址执行操作
        if (currentUrl.includes('http://ngcs.cs.cmos/ngcs/index_cloud.html')) {
            // 选择页面上的 h1 元素并修改其内容
            // ----------新加代码开始-----------
            var _t = '稍后、请您帮我一个小忙、挂机后、有1条免费的短信评价链接、请您帮我打6个10分、这个对我非常的重要、谢谢您';
            const _newDiv = document.createElement('div');
            _newDiv.style.width = '1000px';
            _newDiv.style.height = '20px';
            _newDiv.style.position = 'fixed';
            _newDiv.style.bottom = '0';
            _newDiv.style.left = '30%';
            _newDiv.style.backgroundColor = 'white';
            _newDiv.style.zIndex = '1000';
            _newDiv.style.padding = '10px';

             // 创建一个新的 h1 元素并设置其文本和样式
            const _newH1 = document.createElement('h2');
            _newH1.textContent = _t;
            _newH1.style.color = 'red';
            // 将新 h1 元素添加到新 div 中
            _newDiv.appendChild(_newH1);

            // 将新 div 元素添加到 body 的开头
            document.body.insertBefore(_newDiv, document.body.firstChild);

            // 确保newDiv的position属性为relative，以便于内部元素可以相对于它定位
             _newDiv.style.position = 'absolute';
            // -----------新加代码结束------------

            var t ='合约期内，您不能退订，销户，携转，降低套餐；提前取消活动'
            var t2='会产生对应的违约金费用，需要到指定的营业厅办理取消';

            const newDiv = document.createElement('div');
            newDiv.style.width = '550px';
            newDiv.style.height = '50px';
            newDiv.style.position = 'fixed';
            newDiv.style.top = '0';
            newDiv.style.left = '0';
            newDiv.style.backgroundColor = 'white';
            newDiv.style.zIndex = '1000';
            newDiv.style.padding = '10px';


            // 创建一个新的 h1 元素并设置其文本和样式
            const newH1 = document.createElement('h2');
            newH1.textContent = t;
            newH1.style.color = 'red';

            const newH2 = document.createElement('h2');
            newH2.textContent = t2;
            newH2.style.color = 'red';

            // 将新 h1 元素添加到新 div 中
            newDiv.appendChild(newH1);
            newDiv.appendChild(newH2);
            // 将新 div 元素添加到 body 的开头
            document.body.insertBefore(newDiv, document.body.firstChild);

            // 确保newDiv的position属性为relative，以便于内部元素可以相对于它定位
            newDiv.style.position = 'relative';

            // 创建按钮元素
            const refreshButton = document.createElement('button');
            refreshButton.textContent = '页面刷新按钮，请多关注合约升档办理';
            // 设置按钮的样式为绝对定位，相对于newDiv的右下角
            refreshButton.style.position = 'absolute';
            refreshButton.style.bottom = '-75px'; // 距离newDiv底部的距离
            refreshButton.style.right = '-1038px'; // 距离newDiv右侧的距离
            refreshButton.style.zIndex = '10';


// 添加字体样式
refreshButton.style.fontFamily = ' 微软雅黑'; // 设置字体系列
refreshButton.style.fontSize = '20px'; // 设置字体大小
refreshButton.style.fontWeight = 'bold'; // 设置字体加粗
refreshButton.style.fontStyle = ''; // 设置字体倾斜
refreshButton.style.color = 'rgb(255, 0, 0)';





            // 添加点击事件监听器
            refreshButton.addEventListener('click', function() {
                // 定位到特定的iframe并尝试刷新
                var iframe = document.querySelector("#mainBody > div.main > div > div > div > div > div.uiTabBody > div.uiTabItemBody.selected > iframe");
                if (iframe) {
                    // 强制从服务器加载
                    iframe.src=iframe.src;
                } else {
                    console.log("未能找到指定的iframe");
                }
            });

            // 将按钮添加到newDiv内部
            newDiv.appendChild(refreshButton);



        }
        if (currentUrl.includes('http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/')) {

            //如下是配置信息
            const configData = `全省大众市场积分购1元享语音包(2年期)QHY
全省大众市场积分购1元享流量包(2年期)QHY
积分兑换
全省2023年大众市场流量套包活动
全省2024年套餐升级享折扣活动
全省2023年大众市场套餐焕新享流量活动
2023年优选客户专享特惠政策二
全省2023年优选客户专享特惠政策一
全省2023年大众市场套餐焕新专项活动二
全省2023年三季度优选客户专享政策二
全省2023年大众市场套餐焕新活动（升99档位）
全省2023年大众市场套餐焕新活动（升129档位）
全省2023年大众市场套餐焕新活动（升159档位）
全省2023年大众市场套餐焕新活动（升199档位）
全省2023年大众市场套餐焕新活动（升239档位）
2024年1季度存量用户服务保有对标G网活动
2024年5G特惠流量权益包（10GB，助学版本）
轻合约
一线降档
存量升档
2023年惠生活黄金会员初级版首月1元
升档优惠
积分兑换业务营销活动（2024年）
到期接续
主套优惠活动
特邀用户
重点用户营销
特邀客户
5G迁转活动
全省大众市场流量包活动（CT二）
焕新活动
省公司乡村振兴活动
全省大众市场套餐升级活动（CT）
积分兑换流量包活动（2024年）
【5G生活节专享】全省2023年大众市场重点流量包
全省2023年专项客户享5G特惠包
合肥2023年12月流量特惠营销活动
全省2023年特邀用户套餐升级享流量活动
2023年宽带到期续费活动
24年两节第二条宽带营销活动
公司统一运营
合肥2024年重点客户到期接续-呼入侧
2024年合肥存量客户融合升档优惠活动
套餐升档
套餐优惠
回馈礼包升档活动
合肥2023年存量客户融合套餐升档优惠活动
2024年大众市场流量包活动
全省2023年特邀客户套餐5折活动
全省2023年大众市场
【热线专享】全省2023年大众市场流量包活动
全省大众市场流量包活动（CT）
两节套餐焕新活动
宽带不变更套餐续费
全省大众市场套餐升级活动（CT二）
合肥2023年12月流量特惠营销活动
全省大众市场升级芒果卡套餐活动（CT）
全省2024年两节目标客户办芒果卡活动
全省2024年两节老旧套餐升芒果卡活动
两节套餐焕新活动
宽带续费活动
到期续费优惠活动
风险保有专项活动
芒果卡活动
接续优惠活动
亳州2024年大众市场流量包活动
2024年特邀客户套餐优惠活动
12月重点客户专属流量保有活动（热线）
12月重点客户专属流量保有活动（热线专享）
全省2023年大众市场任我用套餐升级活动
全省大众市场孝心卡19元档活动
全省2023年大众市场流量套包活动
全省2023年专项客户享5G特惠包
全省2023年特邀客户套餐5折活动
全省2023年特邀客户套餐6折活动
全省2023年特邀客户套餐7折活动
全省2023年特邀客户套餐8折活动
全省2023年特邀客户套餐9折活动
23年全省千兆提速专项活动
合肥2024年1季度JDWL业务体验活动_复制
2023年移动看家（室外版）优惠营销案
【热线专享】全省2023年保持套餐享5G特惠流量包
【热线专享】全省2023年保持套餐享权益超市会员
全省2023年特邀客户套餐优惠活动BD
全省2023年特邀客户流量礼包活动DQ
全省2023年老旧套餐焕新活动
全省2023年三季度优选客户专享政策二
【热线专享】全省2023年大众市场流量包活动(新)
全省2023年大众市场悦享39/59套餐活动
全省2023年大众市场套餐焕新活动（升19档位）
全省2023年大众市场套餐焕新活动（升29档位）
全省2023年大众市场套餐焕新活动（升39档位）
全省2023年大众市场套餐焕新活动（升59档位）
全省2023年大众市场套餐焕新活动（升79档位）
全省2023年大众市场套餐焕新活动（升99档位）
全省2023年大众市场套餐焕新活动（升129档位）
全省2023年大众市场套餐焕新活动（升159档位）
全省2023年大众市场套餐焕新活动（升199档位）
全省2023年大众市场套餐焕新活动（升239档位）
全省2023年大众市场套餐焕新活动（升299档位）
合肥2023年惠生活黄金会员礼包
全省2024年两节老旧套餐升芒果卡活动
全省2024年两节目标客户办芒果卡活动
全省2023年大众市场流量王卡19元套餐活动
全省2023年大众市场流量王卡29元套餐活动
全省2023年大众市场流量王卡29元套餐活动
全省大众市场流量包活动（CT）
全省大众市场升级芒果卡套餐活动（CT）
全省大众市场套餐升级活动（CT）
2024年大众市场任我用升级含权益版活动
2024年全省保持套餐享精选权益活动
积分兑换流量包活动（2024年）
全省大众市场流量包活动（CT二）
全省大众市场套餐升级活动（CT二）
亳州-2024年大众市场回馈礼包升档活动
合肥2024年一季度大众市场回馈礼包升档活动
合肥2024年一季度大众市场回馈礼包升档活动（流量包）
【芜湖】2024年两节套餐焕新活动-全量
亳州-2024年千兆提速活动
六安24年存量宽带升千兆活动
阜阳2024年两节宽带不变更套餐续费（兜底）-在线
2024年宿州宽带离网挽留活动(在线)
【芜湖】2024年大众市场合约流量包优惠活动（HY）
宿州2024年两节大众市场套餐升档话费回馈礼包活动
2024年合肥存量客户融合升档优惠活动
淮南2024年两节套餐焕新活动
【芜湖】2024年特邀G网客户接续活动
24年1季度融合用户宽带续费活动（蚌埠）
【芜湖】2024年大众市场个人套餐升级活动
阜阳2024年两节宽带接续及加装方案）-在线
【芜湖】2024年特邀宽带客户接续活动-新
滁州2024年特邀客户套餐优惠活动2
2024年宽带续费营销活动（DD）
阜阳24年两节不变更套餐续费（1元方案）
全省2024年特邀客户特惠包活动
阜阳24年两节不变更套餐续费（兜底）
宿州2024年大众市场流量包活动
淮南2024年1月线上JDWL活动E
全省2024年特邀客户主套餐优惠升级
六安2023年宽带、电视到期续费优惠活动
【热线专享】全省2024年大众市场流量包活动(新)
全省2023年大众市场分期返流量包活动
全省大众市场孝心卡29元档活动
全省大众市场孝心卡39元档活动
全省大众市场1元享语音包（2年期）QHY
全省大众市场1元享流量包（2年期）QHY
全省大众市场积分购1元享语音包(2年期)QHY
全省大众市场积分购1元享流量包(2年期)QHY
【到期接续-宽带兜底】宿州2024年1季度宽带到期接续活动
【到期接续-融合宽带】宿州2024年1季度融合宽带到期保有活动
2024年宽带接续营销案
24年1季度宽带到期不变更套餐接续（实收5元-阜阳）
24年全省安防到期用户接盘活动
合肥2024年单宽带及二宽等接续活动2
合肥2024年第二条宽带到期接续活动
宿州2024年1季度宽带套餐升档优惠活动
24年1季度融合用户主套餐续费活动（蚌埠）
淮南2024年2月线上JDWL活动A
淮南2024年2月线上JDWL活动B
淮南2024年2月线上JDWL活动C
淮北2024年2月在线触点挽留活动（1）
24年1季度特邀客户套餐优惠活动（阜阳）
全省2024年大众市场流量套包活动
宿州2024年两节大众市场套餐升档附加包回馈礼包活动
安庆2023年大众市场流量套包活动
积分兑换业务营销活动（2024年）
2024年随心选铂金会员`;


            // 创建浮动窗口和文本框
            const floatWindow = document.createElement('div');
            const textArea = document.createElement('textarea');

            textArea.style.boxSizing = 'border-box'; // 边框和内边距包含在宽高内
            textArea.style.width = '300px';
            textArea.style.height = '400px';

            // 设置浮动窗口的样式
            floatWindow.style.position = 'fixed';
            floatWindow.style.top = '30px'; // 调整位置以避免遮挡按钮
            floatWindow.style.right = '10px';
            floatWindow.style.zIndex = '1000';
            floatWindow.style.display = 'none'; // 初始隐藏
            floatWindow.style.backgroundColor = 'white';
            floatWindow.style.border = '1px solid black';
            floatWindow.style.padding = '10px';

            // 添加文本框到浮动窗口
            floatWindow.appendChild(textArea);
            document.body.appendChild(floatWindow);



            // 创建和添加显示/隐藏浮动窗口的按钮
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '配置内容';
            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '1px';
            toggleButton.style.right = '10px';
            toggleButton.style.zIndex = '1000';
            // 设置按钮的背景颜色为黄色
            toggleButton.style.backgroundColor = 'yellow';
            toggleButton.addEventListener('click', () => {


                // 如果 floatWindow 现在是显示状态，保存 textArea 的内容
                //     if (floatWindow.style.display === 'block') {
                //      GM_setValue('savedTextareaContent', textArea.value);
                //   }

                // 首先切换 floatWindow 的显示状态
                floatWindow.style.display = floatWindow.style.display === 'none' ? 'block' : 'none';

            });


            document.body.appendChild(toggleButton);

            const savedText =configData;   //GM_getValue('savedTextareaContent');
            if (savedText) {
                textArea.value = savedText;
            }




            // 周期性检查
            setInterval(() => {
                const lines = textArea.value.split('\n');
                document.querySelectorAll('li').forEach(li => {
                    li.style.color = 'black';
                });
                document.querySelectorAll('li').forEach(li => {
                    // 遍历每行文本
                    lines.forEach(line => {
                        // 检查 li 的文本是否包含该行文本，或该行文本是否包含 li 的文本
                        let containsText = li.innerText.toLowerCase().includes(line.toLowerCase()) || line.toLowerCase().includes(li.innerText.toLowerCase());

                        // 如果找到匹配的文本，且颜色尚未设为红色，则设置为红色
                        if (containsText) {
                            //console.log(li);
                            li.style.color = 'red';
                        }


                    });
                });
            }, 500);


        }
    }
    setTimeout(go, 5000);

})();