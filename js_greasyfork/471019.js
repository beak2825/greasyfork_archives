// ==UserScript==
// @name         ②▶▶lua卡密充值==一门主页充值专用【替换id及类名】
// @namespace    none
// @version      23.9.19
// @description  用于卡密充值
// @author       You
// @match        http://aa.99kpk.top:5004/key/yh/login.php
// @icon         https://i.imgtg.com/2023/07/14/OzDrBj.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471019/%E2%91%A1%E2%96%B6%E2%96%B6lua%E5%8D%A1%E5%AF%86%E5%85%85%E5%80%BC%3D%3D%E4%B8%80%E9%97%A8%E4%B8%BB%E9%A1%B5%E5%85%85%E5%80%BC%E4%B8%93%E7%94%A8%E3%80%90%E6%9B%BF%E6%8D%A2id%E5%8F%8A%E7%B1%BB%E5%90%8D%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/471019/%E2%91%A1%E2%96%B6%E2%96%B6lua%E5%8D%A1%E5%AF%86%E5%85%85%E5%80%BC%3D%3D%E4%B8%80%E9%97%A8%E4%B8%BB%E9%A1%B5%E5%85%85%E5%80%BC%E4%B8%93%E7%94%A8%E3%80%90%E6%9B%BF%E6%8D%A2id%E5%8F%8A%E7%B1%BB%E5%90%8D%E3%80%91.meta.js
// ==/UserScript==

//卡密授权页面
(function() {
    const urls = ["http://aa.99kpk.top:5004/key/yh/login.php"];//只在授权页面显示或运行
    if (urls.some(url => window.location.href.includes(url))) {

        //每隔3秒刷新一次当前页面,如果没有检测到文本"请完善内容" 那么就刷新当前页面
        setInterval(function(){
            if (!document.body.innerText.includes("请完善内容")) {
                console.log("未检测到文本【请完善内容】延迟1秒后刷新页面");
                setTimeout(function(){
                    location.reload();
                }, 1000);
            } else {
                console.log("检测到文本【请完善内容】");
            }
        }, 3000);

        // 动态注入Fingerprint2库(浏览器指纹库)https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.1.0/fingerprint2.min.js或者http://sally99.web3v.vip/fingerprint2.min.js或者https://www.yzyhq.cc/myjs/fingerprint2.min.js

        var script = document.createElement("script");
        script.src = "https://www.yzyhq.cc/myjs/fingerprint2.min.js";
        document.head.appendChild(script);

        // 等待库加载完成
        script.onload = function() {
            // 获取当前浏览器的指纹并转换为字符串
            Fingerprint2.getPromise().then(function(components) {
                var imei = Fingerprint2.x64hash128(components.map(function(pair) { return pair.value }).join(), 31);
                var url = "http://aa.99kpk.top:5004";
                var account = "425125627";

                // 创建容器div元素
                var sallycontainer = document.createElement("div");
                sallycontainer.id = "xiaoyuankami";

                // 添加样式
                sallycontainer.style.position = "absolute";
                sallycontainer.style.top = "60px";
                sallycontainer.style.left = "50%";
                sallycontainer.style.transform = "translateX(-50%) scale(1.2)";
                sallycontainer.style.textAlign = "left";
                sallycontainer.style.height = "auto";

                // 将容器添加到页面中
                document.body.appendChild(sallycontainer);

                // 创建标题元素
                var sallyTitle = document.createElement("h1");
                sallyTitle.innerText = "卡密激活";
                sallyTitle.style.textAlign = "center";
                sallycontainer.appendChild(sallyTitle);

                // 定义post函数
                function post(judgment, url, xm, pj) {

                    function showTip(text) {//这是一个共用的提示框函数,用于充值提示
                        // 创建共用的提示框元素
                        var tip = document.createElement("div");
                        tip.innerText = text;
                        tip.style.position = "fixed";
                        tip.style.top = "70%";
                        tip.style.left = "50%";
                        tip.style.transform = "translate(-50%, -50%)";
                        tip.style.backgroundColor = "red";
                        tip.style.padding = "20px";
                        tip.style.borderRadius = "10px";
                        tip.style.border = "1px solid #333";
                        tip.style.fontSize = "18px";
                        tip.style.color = "#fff";
                        tip.style.fontWeight = "bold";

                        // 将提示框元素添加到页面中
                        document.body.appendChild(tip);

                        // 3 秒后移除提示框元素
                        setTimeout(function() {
                            tip.remove();
                        }, 3000);
                    }

                    // 打印当前正在执行的操作
                    console.log("正在执行：" + judgment);

                    // 创建XMLHttpRequest对象
                    var xhr = new XMLHttpRequest();
                    // 打开连接
                    xhr.open("POST", url + xm);
                    // 设置请求头
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    // 发送请求
                    xhr.send(pj);
                    // 监听状态变化
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var responseText = xhr.responseText;
                            // 打印服务器返回的响应文本
                            console.log("收到响应：" + responseText);
                            if (judgment == "卡密充值") {
                                if (responseText == "卡密已被使用") {
                                    showTip("此卡密已被使用");
                                } else if (responseText == "卡密不存在") {
                                    showTip("此卡密不存在");
                                } else if (responseText == "激活成功") {
                                    showTip("激活成功! 正刷新会员状态!");
                                    setTimeout(function() {
                                        location.reload();
                                    }, 3000);
                                }
                            } else if (judgment == "个人信息") {


                                // 解析服务器返回的响应文本
                                var info = JSON.parse(responseText);

                                // 创建用户ID元素
                                var userId = document.createElement("p");
                                userId.innerText = "用户ID: " + info.id;
                                sallycontainer.appendChild(userId);

                                // 创建会员时间元素
                                var vipTime = document.createElement("p");
                                vipTime.innerText = "会员时间: " + info.vip;
                                sallycontainer.appendChild(vipTime);

                                // 创建IMEI机器码元素
                                var imeiCode = document.createElement("p");
                                imeiCode.innerText = "IMEI机器码: " + info.imei;
                                sallycontainer.appendChild(imeiCode);

                                // 获取IMEI机器码元素的宽度
                                var imeiCodeWidth = imeiCode.offsetWidth;

                                // 修改容器元素的样式
                                sallycontainer.style.width = (imeiCodeWidth + 10) + "px";

                                // 创建用户创建时间元素
                                var createTime = document.createElement("p");
                                createTime.innerText = "用户创建时间: " + info.time;

                                // 设置用户创建时间元素与下面元素之间的行距为 50px
                                createTime.style.marginBottom = "50px";

                                // 将用户创建时间元素添加到容器中
                                sallycontainer.appendChild(createTime);


                                //-------------------------

                                // 创建输入框
                                var input = document.createElement("input");
                                input.type = "text";
                                input.id = "编辑框";
                                input.placeholder = "在此输入卡密 ,  然后点击下面的 '立即激活'";

                                // 修改输入框的样式
                                input.style.width = imeiCodeWidth + "px";
                                input.style.marginBottom = "20px";
                                input.style.padding = "7px";
                                input.style.backgroundColor = "#F6B352";
                                input.style.border = "none";
                                input.style.borderRadius = "5px";
                                input.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";




                                // 创建立即激活按钮
                                var button = document.createElement("button");
                                button.id = "chongzhijihuo";
                                button.innerText = "立即激活";

                                // 修改立即激活按钮的样式
                                button.style.width = imeiCodeWidth + "px";
                                button.style.marginBottom = "20px";
                                button.style.padding = "7px";
                                button.style.backgroundColor = "#30A9DE";
                                button.style.border = "none";
                                button.style.borderRadius = "5px";
                                button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                button.style.color = "#fff";



                                // 将输入框和按钮添加到容器中
                                sallycontainer.appendChild(input);
                                sallycontainer.appendChild(button);

                                // 让光标自动停留在输入框内
                                input.focus();

                                //---------------------------

                                // 创建购买卡密按钮
                                var buyButton = document.createElement("button");
                                buyButton.innerText = "购买卡密";

                                // 修改购买卡密按钮的样式
                                buyButton.style.width = imeiCodeWidth + "px";
                                buyButton.style.marginBottom = "20px";
                                buyButton.style.padding = "7px";
                                buyButton.style.backgroundColor = "#30A9DE";
                                buyButton.style.border = "none";
                                buyButton.style.borderRadius = "5px";
                                buyButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                buyButton.style.color = "#fff";


                                // 添加购买卡密按钮的点击事件处理函数
                                buyButton.addEventListener("click", function() {
                                    // 弹出一个悬浮窗显示淘宝购买链接二维码图片

                                    // 创建遮罩层
                                    var mask = document.createElement("div");
                                    mask.style.position = "fixed";
                                    mask.style.top = "0";
                                    mask.style.left = "0";
                                    mask.style.right = "0";
                                    mask.style.bottom = "0";
                                    mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

                                    // 创建悬浮窗
                                    var floatWindow = document.createElement("div");
                                    floatWindow.style.position = "fixed";
                                    floatWindow.style.top = "50%";
                                    floatWindow.style.left = "50%";
                                    floatWindow.style.transform = "translate(-50%, -50%)";
                                    floatWindow.style.backgroundColor = "#fff";
                                    floatWindow.style.padding = "20px";
                                    floatWindow.style.borderRadius = "10px";

                                    // 创建淘宝购买链接二维码图片元素
                                    var image = document.createElement("img");
                                    image.src = "https://www.yzyhq.cc/tbewm.jpg";

                                    // 将图片添加到悬浮窗中
                                    floatWindow.appendChild(image);

                                    // 将悬浮窗添加到遮罩层中
                                    mask.appendChild(floatWindow);

                                    // 将遮罩层添加到页面中
                                    document.body.appendChild(mask);

                                    // 点击遮罩层时关闭悬浮窗
                                    mask.addEventListener("click", function() {
                                        mask.remove();
                                    });
                                });

                                //-------------------------

                                // 创建联系微信按钮
                                var wechatButton = document.createElement("button");
                                wechatButton.innerText = "联系微信";

                                // 修改联系微信按钮的样式
                                wechatButton.style.width = imeiCodeWidth + "px";
                                wechatButton.style.marginBottom = "20px";
                                wechatButton.style.padding = "7px";
                                wechatButton.style.backgroundColor = "#30A9DE";
                                wechatButton.style.border = "none";
                                wechatButton.style.borderRadius = "5px";
                                wechatButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                wechatButton.style.color = "#fff";


                                // 添加联系微信按钮的点击事件处理函数
                                wechatButton.addEventListener("click", function() {
                                    // 弹出一个悬浮窗显示图片 https://i.imgtg.com/2023/04/24/IeZKD.jpg

                                    // 创建遮罩层
                                    var mask = document.createElement("div");
                                    mask.style.position = "fixed";
                                    mask.style.top = "0";
                                    mask.style.left = "0";
                                    mask.style.right = "0";
                                    mask.style.bottom = "0";
                                    mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

                                    // 创建悬浮窗
                                    var floatWindow = document.createElement("div");
                                    floatWindow.style.position = "fixed";
                                    floatWindow.style.top = "50%";
                                    floatWindow.style.left = "50%";
                                    floatWindow.style.transform = "translate(-50%, -50%)";
                                    floatWindow.style.backgroundColor = "#fff";
                                    floatWindow.style.padding = "20px";
                                    floatWindow.style.borderRadius = "10px";

                                    // 创建联系微信图片元素
                                    var image = document.createElement("img");
                                    image.src = "https://i.imgtg.com/2023/04/24/IeZKD.jpg";

                                    // 将图片添加到悬浮窗中
                                    floatWindow.appendChild(image);

                                    // 将悬浮窗添加到遮罩层中
                                    mask.appendChild(floatWindow);

                                    // 将遮罩层添加到页面中
                                    document.body.appendChild(mask);

                                    // 点击遮罩层时关闭悬浮窗
                                    mask.addEventListener("click", function() {
                                        mask.remove();
                                    });
                                });

                                // 创建进入系统按钮
                                var jinruxitongButton = document.createElement("button");
                                jinruxitongButton.innerText = "点击进入系统";

                                // 修改进入系统按钮的样式
                                jinruxitongButton.style.width = imeiCodeWidth + "px";
                                jinruxitongButton.style.marginBottom = "20px";
                                jinruxitongButton.style.padding = "7px";
                                jinruxitongButton.style.backgroundColor = "#30A9DE";
                                jinruxitongButton.style.border = "none";
                                jinruxitongButton.style.borderRadius = "5px";
                                jinruxitongButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                jinruxitongButton.style.color = "#fff";

                                // 添加进入系统按钮的点击事件处理函数
                                jinruxitongButton.addEventListener("click", function() {


                                    //检测到会员未到期立即跳转到"烟草订货导航"主页
                                    let checkElement = () => {
                                        let element = document.querySelector('#xiaoyuankami > p:nth-child(3)');
                                        if (element && !element.textContent.includes("非会员")) {
                                            window.location.href = 'https://www.yzyhq.cc/';
                                        } else {
                                            showTip("您还不是VIP会员,请先购买卡密后激活会员");
                                        }
                                    }
                                    checkElement();



                                });

                                // 将购买卡密按钮和联系微信按钮添加到容器中
                                sallycontainer.appendChild(buyButton);
                                sallycontainer.appendChild(wechatButton);
                                sallycontainer.appendChild(jinruxitongButton);

                                //==========================================


                                // 立即充值按钮点击事件
                                button.onclick = function() {
                                    var inputText = document.getElementById("编辑框").value;
                                    if (inputText == "") {
                                        // 输入框为空，使用提示框提示用户先输入卡密
                                        showTip("请先输入卡密");
                                    } else {
                                        // 充值会员
                                        post(
                                            "卡密充值",
                                            url,
                                            "/key/yh/vip.php",
                                            "qq=" + account + "&imei=" + imei + "&km=" + inputText
                                        );
                                    }
                                };


                            }
                        }
                    }
                }

                // 调用post函数获取个人信息
                post("个人信息", url, "/key/yh/login.php", "qq=" + account + "&imei=" + imei);
            });
        }



    }//只在授权页面显示或运行
})();


