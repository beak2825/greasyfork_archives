// ==UserScript==
// @name         沧交校园网自动登录(非官方
// @namespace    http://tampermonkey.net/
// @description	 在沧交校园网登录界面自动登录认证，但是请修改代码下方的上网账号与密码还有运营商
// @author     	 建州逸23
// @version      0.6
// @license MIT
// @match        *://*10.40.4.3/portal.do?wlanuserip*
// @match        *://*10.40.4.3/quickauth.do?userid*
// @match        *://*10.40.4.3/portal/*
// @downloadURL https://update.greasyfork.org/scripts/512427/%E6%B2%A7%E4%BA%A4%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%28%E9%9D%9E%E5%AE%98%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512427/%E6%B2%A7%E4%BA%A4%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%28%E9%9D%9E%E5%AE%98%E6%96%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只需要修改这三行就行了
    // 只需要修改这三行就行了
    // 只需要修改下面这三行就行了
    const user = '23xxxxxx'; // 在这里输入上网账号(应该是学号吧)
    const passwd = '我是密码'; // 在这里输入密码
    const yys = 'yd'; //在这里输入运营商 如yd（移动） dx（电信） lt（联通） 若登录校园内网则留空


    const userid = user + yys;
    // 获取当前页面的URL
    const currentUrl = window.location.href;

    // 使用URL构造函数解析URL
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);

    // 从URL参数中提取值
    const wlanuserip = params.get('wlanuserip');
    const wlanacname = params.get('wlanacname');
    const mac = params.get('mac');
    const vlan = params.get('vlan');
    const hostname = params.get('hostname');
    const rand = params.get('rand');
    const urlParam = params.get('url');

    if (currentUrl.includes('/portal.do?wlanuserip')) {
        //是登录首页html
        //alert('自动登录ing');
        // 构造最终的 URL，包含自定义的userid和passwd
        const quickAuthUrl = `http://10.40.4.3/quickauth.do?userid=${userid}&passwd=${passwd}&wlanuserip=${wlanuserip}&wlanacname=${wlanacname}&wlanacIp=10.130.0.10&ssid=&vlan=${vlan}&mac=${encodeURIComponent(mac)}&version=0&portalpageid=41&timestamp=${Date.now()}&uuid=60139c71-7c04-420b-a92e-b1c112e8be68&portaltype=0&hostname=${hostname}&bindCtrlId=`;

        // 输出quickAuth URL（可选）
        console.log('Redirecting to:', quickAuthUrl);

        // 进行跳转到构造好的quickauth URL
        window.location.href = quickAuthUrl;
    }
    else if (currentUrl.includes('/quickauth.do?userid')) {
        //是登录请求结果页

        // 判断当前页面内容是否包含 logout URL --> 登录成功
        if (document.body.innerText.includes('/portal/usertemp_computer/czjtxy-pc5/logout.html')) {
            // 跳转到特定的 logout 页面
            const logOutUrl = `http://10.40.4.3/portal/usertemp_computer/czjtxy-pc5/logout.html?userid=${userid}&passwd=${passwd}&wlanuserip=${wlanuserip}&wlanacname=${wlanacname}&wlanacIp=10.130.0.10&ssid=&vlan=${vlan}&mac=${encodeURIComponent(mac)}&version=0&portalpageid=41&timestamp=${Date.now()}&uuid=60139c71-7c04-420b-a92e-b1c112e8be68&portaltype=0&hostname=${hostname}&bindCtrlId=`;
            // 进行跳转到构造好的logout URL
            window.location.href = logOutUrl;
            return;
        }
        // 检查页面内容是否包含错误提示
        if (document.body.innerText.includes('账号或密码不正确')) {

            // 创建弹窗元素
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
            modal.style.color = 'white';
            modal.style.padding = '20px';
            modal.style.borderRadius = '8px';
            modal.style.zIndex = '9999';
            modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

            // 添加提示信息
            const message = document.createElement('p');
            message.innerText = '登录失败：账号或密码不正确\n\n请检查并修改此脚本的学号与密码后，重新登录。';
            modal.appendChild(message);

            // 创建按钮
            const button = document.createElement('button');
            button.innerText = '我已经修改了，立即重新登录';
            button.style.marginTop = '10px';
            button.style.padding = '10px 20px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.backgroundColor = 'white';
            button.style.color = 'red';
            button.style.cursor = 'pointer';

            // 按钮点击事件，跳转至指定 URL
            button.onclick = function() {
                window.location.href = `http://10.40.4.3/portal.do?wlanuserip=${wlanuserip}&wlanacname=${wlanacname}&wlanacIp=10.130.0.10&ssid=&vlan=${vlan}&mac=${encodeURIComponent(mac)}&version=0&portalpageid=41&timestamp=${Date.now()}&uuid=60139c71-7c04-420b-a92e-b1c112e8be68&portaltype=0&hostname=${hostname}&bindCtrlId=`;
;
            };

            // 将按钮添加到弹窗中
            modal.appendChild(button);

            // 将弹窗添加到页面中
            document.body.appendChild(modal);

        }
    }else if (currentUrl.includes('/portal/usertemp_computer/czjtxy-pc5/logout.html')) {
        //是logout页

        //alert('自动登录成功\n祝您使用愉快');

        // 创建一个提示元素
        const errorMessage = document.createElement('div');
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.right = '20px';
        errorMessage.style.backgroundColor = 'rgba(91,118,255,1)';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '20px';
        errorMessage.style.zIndex = '9999';
        errorMessage.style.borderRadius = '10px'; // 设置圆角
        errorMessage.innerText = '自动登录成功\n祝您使用愉快';
        // 将提示添加到页面中
        document.body.appendChild(errorMessage);
    }


    // 监听页面加载完成事件
    window.addEventListener('load', function() {

    });

})();
