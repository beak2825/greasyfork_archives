// ==UserScript==
// @name         Kook Auto Kick
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过按钮触发踢出七天未活跃成员
// @match        *://www.kookapp.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533886/Kook%20Auto%20Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/533886/Kook%20Auto%20Kick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let guildId = ""

    setInterval(() => {
        try{
            guildId = window.location.pathname.match(/.*channels\/(\d+).*/)[1]
        }catch(e){
            guildId = ""
        }
        if (!document.querySelector('.buttonbuttonbuttonbutton')) {
            add();
        }
    }, 1000);

    const add = () => {
        const GET_URL = `https://www.kookapp.cn/api/v2/guilds/users-v2/${guildId}?s=&r=0&p=1&active_time=0`;
        const POST_URL = 'https://www.kookapp.cn/api/v2/guilds/batch-kickout';

        // 创建操作按钮
        const button = document.createElement('button');
        button.textContent = '踢出七天未活跃成员';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ff4444';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';
        button.style.fontWeight = 'bold';
        button.style.zIndex = '999999';
        button.style['font-family'] = 'Arial, sans-serif';
        button.style.transition = 'all 0.3s';
        button.className = 'buttonbuttonbuttonbutton';

        document.body.appendChild(button);

        // 按钮点击事件处理
        button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = '执行中...';

            let total = 0

            while(true && total < 500){
                try {
                    // 发送GET请求获取用户数据
                    const getResponse = await fetch(GET_URL, {
                        headers: { 'Cookie': document.cookie },
                        method: 'GET'
                    });

                    if (!getResponse.ok) {
                        throw new Error(`获取用户数据失败: ${getResponse.status}`);
                    }

                    const data = await getResponse.json();
                    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                    const targetIds = data.data
                    .filter(user =>
                            user.active_time <= sevenDaysAgo &&
                            user.joined_at <= sevenDaysAgo
                           )
                    .map(user => user.id);

                    if (targetIds.length === 0) {
                        throw new Error('没有需要踢出的用户');
                    }

                    // 发送POST请求执行踢出
                    const postResponse = await fetch(POST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': document.cookie
                        },
                        body: JSON.stringify({ guild_id:guildId, user_ids: targetIds })
                    });

                    if (!postResponse.ok) {
                        throw new Error(`踢出失败: ${postResponse.status}`);
                    }
                    total = total + targetIds.length
                } catch (error) {
                    console.error('操作失败:', error);
                    alert(`操作失败: ${error.message}`);
                    break
                }
            }
            button.disabled = false;
            button.textContent = '踢出七天未活跃成员';
            alert(`成功踢出 ${total} 名用户`);
        });
    };
})();