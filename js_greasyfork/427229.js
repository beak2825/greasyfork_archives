// ==UserScript==
// @name         OTOY黑五操作脚本
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  自动化执行OTOY网站的任务
// @author       WxM
// @match        *://*.otoy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427229/OTOY%E9%BB%91%E4%BA%94%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427229/OTOY%E9%BB%91%E4%BA%94%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function displayCustomAlert() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.style.opacity = '1', 50);

        const alertBox = document.createElement('div');
        alertBox.style.backgroundColor = '#ffffff';
        alertBox.style.padding = '5%';
        alertBox.style.borderRadius = '15px';
        alertBox.style.width = '90%';
        alertBox.style.maxWidth = '500px';
        alertBox.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.1)';
        alertBox.style.textAlign = 'center';
        alertBox.style.fontFamily = "'Arial', sans-serif";
        overlay.appendChild(alertBox);

        const date = new Date();
        date.setDate(date.getDate() + 37);
        const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        alertBox.innerHTML = `
    <p style="font-size: 4vw; margin-bottom: 5%;">充值已经提交，由于系统维护，预计在30分钟左右到账！账号最新到期时间是: ${formattedDate}！</p>
`;

       const closeButton = document.createElement('button');
       closeButton.textContent = '关闭';
       closeButton.style.backgroundColor = '#2196F3';
       closeButton.style.color = '#ffffff';
       closeButton.style.padding = '4% 8%';
       closeButton.style.border = 'none';
       closeButton.style.borderRadius = '5px';
       closeButton.style.cursor = 'pointer';
       closeButton.style.fontFamily = "'Arial', sans-serif";
       closeButton.style.fontSize = '4vw';
       closeButton.style.transition = 'background-color 0.3s';
       closeButton.addEventListener('touchstart', () => closeButton.style.backgroundColor = '#187ABD');
       closeButton.addEventListener('touchend', () => closeButton.style.backgroundColor = '#2196F3');
       closeButton.onclick = () => {
           const textToCopy = `充值已经提交，由于系统维护，预计在30分钟左右到账！账号最新到期时间是: ${formattedDate}！`;
           navigator.clipboard.writeText(textToCopy).then(() => {
               window.location.href = "https://render.otoy.com/account/cards.php";
           }).catch(err => {
               console.error('Failed to copy: ', err);
           });
           overlay.style.opacity = '0';
           setTimeout(() => document.body.removeChild(overlay), 500);
       };
       alertBox.appendChild(closeButton);
   }


    let currentURL = window.location.href;


    // 登录页面
    if (currentURL.includes("sign_in")) {
        var input = prompt("请输入账号和密码，使用空格或换行分隔：");

        // 检查用户是否点击取消
        if (input !== null) {
            var parts = input.split(/[\s\n]+/, 2); // 使用正则表达式匹配空格或换行，并最多分割为两部分

            if (parts.length === 2) { // 确保输入中有两个部分
                var account = parts[0];
                var password_sign = parts[1];

                document.getElementById("session_email").value = account;
                document.getElementById("session_password").value = password_sign;

                var signInButton = document.querySelector(".btn.btn-lg.btn-default.btn-block");
                if (signInButton) {
                    signInButton.click();
                }
            }
        }
    }

    // 如果URL包含"mac-pro"
    if (currentURL.includes("mac-pro")) {
        const buttonToClick = document.querySelector('.btn.btn-large.btn-red.purchase_column_buy');

        if (buttonToClick) {
            buttonToClick.click();
        }
    } else if (currentURL.includes("shop/macpro")) {
        const cslaChk = document.getElementById("csla_chk");

        if (cslaChk) {
            cslaChk.click(); // 模拟鼠标点击选中"csla_chk"

            // 延迟一秒后再模拟鼠标点击选中"notice_chk"
            setTimeout(() => {
                const noticeChk = document.getElementById("notice_chk");
                if (noticeChk) {
                    noticeChk.click();
                }
            }, 1000); // 延迟1000毫秒，即1秒
        }
    }


    // 如果当前页面是首页、登录失败页或登录配置页，则跳转到购买页面
    if (
        currentURL === "https://home.otoy.com/" ||
        currentURL.includes("config/shared/login") ||
        (currentURL.includes("login") && (document.body.textContent || document.body.innerText).includes("Login Failure"))
    ) {
        // 执行跳转操作
        window.location.href = "https://render.otoy.com/account/purchases.php";
    }

    // 如果当前页面是注册页，提示用户输入邮箱和密码
    if (currentURL.includes("sign_up")) {
        var email = prompt("请输入邮箱：");

        // 如果用户点击取消，则email为null，不再继续弹出密码输入框
        if (email !== null) {
            var password = prompt("请输入密码：");

            if (password !== null) {
                document.getElementById("email").value = email;
                let emailPrefix = email.split("@")[0];
                document.getElementById("username").value = emailPrefix;
                document.getElementById("first_name").value = emailPrefix;
                document.getElementById("last_name").value = emailPrefix;
                document.getElementById("password").value = password;
                document.getElementById("password_confirmation").value = password;
            }
        }
    }

    // 如果当前页面是注册确认页，勾选同意条款并提交
    if (currentURL.includes("register")) {
        document.getElementById("userinfo_accept").click();
        document.getElementById("p_password").value = password;
        document.getElementById("p_password2").value = password;
        document.getElementById("forumuser_accept").click();
    }

    // 如果当前页面是政策更新页，点击同意按钮
    if (currentURL.includes("config/shared/policy_update")) {
        document.getElementById("msg_accept").click();
    }

    // 如果当前页面是购买页面
    if (currentURL.includes("account/purchases")) {
        const table2 = document.getElementsByTagName("table")[1];

        if (table2) {
            const lastRow = table2.rows[table2.rows.length - 1];
            const subscriptionCell = lastRow.cells[0];
            const noSubscriptionInvoices = table2.rows[1].cells[0].innerText.trim() === "No subscription invoices.";

            const hasActiveSubscription = document.querySelector(".sub_status_active");

            if (noSubscriptionInvoices) {
                window.location.href = "https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10";
            } else if (hasActiveSubscription) {
                // 获取第一个 "sub_status_active" 类的元素的文本内容
                const subID = hasActiveSubscription.innerText.trim();

                // 根据获取到的subID构建URL并重定向
                window.location.href = "https://render.otoy.com/account/subscriptionDetails.php?subID=" + subID;
            } else {
                window.location.href = "https://render.otoy.com/account/subscriptionDetails.php?subID=" + subscriptionCell.innerText;
            }
        }
    }


    // 如果当前页面是商店页面
    if (currentURL.includes("shop")) {
        // 监听页面内容是否包含 "Purchase - Subscription being processed" 字符串
        const checkProcessingStatus = () => {
            if (document.body.innerText.includes("Purchase - Subscription being processed")) {
                clearInterval(processingStatusInterval);
                window.location.href = "https://render.otoy.com/account/purchases.php";
            }
        };
        const processingStatusInterval = setInterval(checkProcessingStatus, 1000);

        // 勾选同意条款
        const checkboxes = ["csla_chk", "tacoc_chk", "notice_chk"];
        checkboxes.forEach(checkboxId => {
            document.getElementById(checkboxId).checked = true;
        });

        const address1 = document.getElementById("p_address1").value;
        const zip = document.getElementById("p_zip").value;
        const city = document.getElementById("p_city").value;
        const country = document.getElementById("p_country").value;

        // 填写地址信息并点击同意按钮
        if (!(address1 && zip && city && country)) {
            document.getElementById("p_address1").value = "beijing";
            document.getElementById("p_city").value = "beijing";
            document.getElementById("p_state").value = "beijing";
            document.getElementById("p_zip").value = "000000";
            document.getElementById("p_country").value = "CHN";
        }
        document.getElementById("billinfo_accept").click();

        // 选择支付方式为Stripe
        document.getElementById("payment-option-stripe").click();

        // 监听支付状态，支付完成后跳转到卡片页面
        const checkPaymentStatus = () => {
            const stripeCompleteMsg = document.getElementById("stripeCompleteMsg");
            if (stripeCompleteMsg && stripeCompleteMsg.innerText === "Your payment has been completed and your invoice has been processed.") {
                clearInterval(paymentStatusInterval);
                window.location.href = "https://render.otoy.com/account/cards.php";
            }

            // 检查支付失败消息
            const paymentFailedText = document.body.innerText.includes("Payment Failed");
            if (paymentFailedText) {
                window.location.href = "https://render.otoy.com/account/cards.php";
                displayCustomAlert();
            }
        };
        const paymentStatusInterval = setInterval(checkPaymentStatus, 500);
    }

    // 如果当前页面是卡片页面
    if (currentURL.includes("cards")) {
        let table1 = document.getElementsByTagName("table")[0];
        if (table1 && table1.rows[1] && table1.rows[1].cells.length === 4) {
            let actionCell = table1.rows[1].cells[3];
            let removeLink = Array.from(actionCell.getElementsByTagName("a")).find(a => a.innerText.trim() === "Remove");
            if (removeLink) {
                // 如果有保存的卡片，点击移除链接
                removeLink.click();
            }
        } else if (table1 && table1.rows[1] && table1.rows[1].cells.length === 1 && table1.rows[1].cells[0].innerText.trim() === "-- No saved cards --") {
            // 如果没有保存的卡片，跳转到购买页面
            window.location.href = "https://render.otoy.com/account/purchases.php";
        }
    }

    // 如果当前页面是账户页面
    if (currentURL.includes("account")) {
        let activeSubscriptions = document.querySelectorAll(".sub_status_active");
        if (activeSubscriptions.length > 0 && activeSubscriptions[0].innerText.trim() === "Active") {

            let expirationDateCell = table1.rows[3].cells[3];
                let expirationDate = new Date(expirationDateCell.innerText.trim());
                let currentDate = new Date();
                let daysDiff = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);

                if (daysDiff >= 34) {
                    document.body.addEventListener("click", function() {
                        let copiedText = `****【充值完成】****\n\n↓ 账号最新到期时间是 ↓\n<<<${expirationDate.getFullYear()}年${expirationDate.getMonth() + 1}月${expirationDate.getDate()}日>>>`;
                        navigator.clipboard.writeText(copiedText);
                    });
                } else if (daysDiff > 1) {
                    let monthsToAdd = prompt("提示需要续费几个月：");
                    if (monthsToAdd) {
                        let addedDays = 37 * parseInt(monthsToAdd);
                        let newDate = new Date(expirationDate.getTime());
                        newDate.setDate(newDate.getDate() + addedDays);
                        document.body.addEventListener("click", function() {
                            let copiedText = `****【充值完成】****\n\n${expirationDate.getFullYear()}年${expirationDate.getMonth() + 1}月${expirationDate.getDate()}日刷新本次充值时间！\n\n↓ 账号最新到期时间是 ↓\n<<<${newDate.getFullYear()}年${newDate.getMonth() + 1}月${newDate.getDate()}日>>>`;
                            navigator.clipboard.writeText(copiedText);
                        });
                    }
                } else if (daysDiff <= 1) {
                    window.location.href = "https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10";
                }
        } else {
            let table1 = document.getElementsByTagName("table")[0];

            if (table1 && table1.rows.length > 3 && table1.rows[3].cells.length > 3) {
                let expirationDateCell = table1.rows[3].cells[3];
                let expirationDate = new Date(expirationDateCell.innerText.trim());
                let currentDate = new Date();
                let daysDiff = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);

                if (daysDiff >= 34) {
                    document.body.addEventListener("click", function() {
                        let copiedText = `****【充值完成】****\n\n↓ 账号最新到期时间是 ↓\n<<<${expirationDate.getFullYear()}年${expirationDate.getMonth() + 1}月${expirationDate.getDate()}日>>>`;
                        navigator.clipboard.writeText(copiedText);
                    });
                } else if (daysDiff > 1) {
                    let monthsToAdd = prompt("提示需要续费几个月：");
                    if (monthsToAdd) {
                        let addedDays = 37 * parseInt(monthsToAdd);
                        let newDate = new Date(expirationDate.getTime());
                        newDate.setDate(newDate.getDate() + addedDays);
                        document.body.addEventListener("click", function() {
                            let copiedText = `****【充值完成】****\n\n${expirationDate.getFullYear()}年${expirationDate.getMonth() + 1}月${expirationDate.getDate()}日刷新本次充值时间！\n\n↓ 账号最新到期时间是 ↓\n<<<${newDate.getFullYear()}年${newDate.getMonth() + 1}月${newDate.getDate()}日>>>`;
                            navigator.clipboard.writeText(copiedText);
                        });
                    }
                } else if (daysDiff <= 1) {
                    window.location.href = "https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10";
                }
            }

        }
    }



})();
