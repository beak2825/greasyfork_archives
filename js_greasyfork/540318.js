// ==UserScript==
// @name         微店自动评价 V:ditianbrother
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  承接脚本定制开发 V:ditianbrother
// @author       ditianbrother
// @match        https://weidian.com/user/order/list.php*
// @match        https://weidian.com/user/order-new/list.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540318/%E5%BE%AE%E5%BA%97%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%20V%3Aditianbrother.user.js
// @updateURL https://update.greasyfork.org/scripts/540318/%E5%BE%AE%E5%BA%97%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%20V%3Aditianbrother.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function clickMyBtn() {

        showLoading();

        // 1. 获取店铺名称、评论内容和数量的元素
        const shopNamesTextarea = document.getElementById('my-shop-names-textarea');
        const commentsTextarea = document.getElementById('my-comments-textarea');
        const countInput = document.getElementById('my-count-input');

        if (!shopNamesTextarea || !commentsTextarea || !countInput) {
            console.error('找不到必要的输入框元素！');
            hideLoading();
            alert('自动评价失败：找不到输入框！');
            return;
        }

        // 2. 获取文本区域和输入框的值
        const shopName = shopNamesTextarea.value.trim();
        const commentsString = commentsTextarea.value.trim();
        const totalCount = parseInt(countInput.value, 10); // 获取评价数量

        // 校验店铺名称
        if (!shopName) {
            alert('请输入店铺名称！');
            hideLoading();
            return;
        }

        // 验证输入值
        if (isNaN(totalCount) || totalCount <= 0 || totalCount >= 50) {
            alert('请输入有效的评价数量 (大于0且小于50的数字)！');
            hideLoading();
            return;
        }

        // 3. 将评论内容按行分割成列表
        // 过滤掉空行
        const comments = commentsString ? commentsString.split('\n').map(comment => comment.trim()).filter(comment => comment !== '') : [];

        if (comments.length === 0) {
            alert('请输入至少一条评论内容！');
            hideLoading();
            return;
        }

        console.log('获取到的店铺名称:', shopName);
        console.log('获取到的评论列表:', comments);
        console.log('评价数量:', totalCount);


        // 获取待评价订单
        // let commentOrders = await fetchCommentOrders();
        // console.log('获取到的待评价订单:', commentOrders);     
        let commentOrders = getPageOrders();
        console.log('获取到的待评价订单:', commentOrders);

        //找到输入的店铺的订单
        commentOrders = commentOrders.filter(order => order.shopName === shopName);
        console.log('找到的输入的店铺的订单:', commentOrders);

        //没有报错
        if (commentOrders.length === 0) {
            alert('没有找到输入的店铺的订单！');
            hideLoading();
            return;
        }
        //可能有多个订单,扁平化列表,设置orderid
        let orderItems = commentOrders.flatMap(({ orderId, items }) =>
            items.map(item => ({ ...item, orderId: orderId }))
        );
        console.log('扁平化后的商品:', orderItems);

        // //获取订单的items，只保留"写评价"按钮的items
        // orderItems = orderItems.filter(item =>
        //     item.buttons.some(button => button.text === '写评价')
        // );
        // console.log('获取到待评价的商品:', orderItems);

        //切割订单的items
        orderItems = orderItems.slice(0, totalCount);
        console.log('切割后的待评价的商品:', orderItems);

        //遍历切割后的订单的items
        for (const item of orderItems) {
            console.log('正在评论该商品:', item);
            const commentData = {
                orderID: item.orderId,
                itemId: item.itemId,
                imgList: [],
                score: 5,
                comment: getRandomComment(comments),
                isShow: 0,
                tagIds: []
            };
            postComment(commentData).then(res => {
                console.log('评价接口响应:', res);
            });
            //等待随机5-10秒
            const randomInterval = Math.floor(Math.random() * 1) + 3; // 5-10秒
            await new Promise(resolve => setTimeout(resolve, randomInterval * 1000));
        }

        hideLoading();
        alert('自动评价成功！'); // 或者根据评价结果显示不同的提示
    }

    function showLoading() {
        if (document.getElementById('myLoading')) return;
        const loading = document.createElement('div');
        loading.id = 'myLoading';
        loading.innerText = '正在自动评价...';
        loading.style.position = 'fixed';
        loading.style.top = '50%'; // 垂直居中
        loading.style.left = '50%'; // 水平居中
        loading.style.transform = 'translate(-50%, -50%)'; // 微调位置使其完全居中
        loading.style.zIndex = 10000;
        loading.style.padding = '10px 20px';
        loading.style.background = 'rgba(0,0,0,0.7)';
        loading.style.color = '#fff';
        loading.style.borderRadius = '5px';
        loading.style.fontSize = '16px';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        // 简单动画
        const dot = document.createElement('span');
        dot.id = 'addAllSkuLoadingDot';
        dot.innerText = '';
        loading.appendChild(dot);
        document.body.appendChild(loading);
        let count = 0;
        loading._interval = setInterval(() => {
            count = (count + 1) % 4;
            dot.innerText = '.'.repeat(count);
        }, 400);
    }

    function hideLoading() {
        const loading = document.getElementById('myLoading');
        if (loading) {
            clearInterval(loading._interval);
            loading.remove();
        }
    }

    // 切换元素的显示/隐藏状态
    function toggleElementsVisibility() {
        const autoEvaluateBtn = document.getElementById('my-btn');
        const shopNamesTextarea = document.getElementById('my-shop-names-textarea');
        const commentsTextarea = document.getElementById('my-comments-textarea');
        const countInput = document.getElementById('my-count-input');
        const toggleBtn = document.getElementById('my-toggle-btn');

        if (!autoEvaluateBtn || !shopNamesTextarea || !commentsTextarea || !toggleBtn || !countInput) {
            return;
        }

        const isHidden = autoEvaluateBtn.style.display === 'none';

        const displayStyle = isHidden ? '' : 'none';
        autoEvaluateBtn.style.display = displayStyle;
        shopNamesTextarea.style.display = displayStyle;
        commentsTextarea.style.display = displayStyle;
        countInput.style.display = displayStyle;

        toggleBtn.innerText = isHidden ? '隐藏' : '显示';
    }

    // 创建按钮和输入框
    function createButton() {
        if (document.getElementById('my-btn')) return; // 防止重复插入

        // 创建自动评价按钮
        const btn = document.createElement('button');
        btn.id = 'my-btn';
        btn.innerText = '自动评价';
        btn.style.position = 'fixed';
        btn.style.top = '70px'; // 调整位置，在显示/隐藏按钮下方
        btn.style.left = 'calc(100vw - 200px)'; // 距离右侧200px，实现左对齐
        // btn.style.right = '20px'; // 移除right属性
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 20px';
        btn.style.background = '#ff6600';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = clickMyBtn;
        document.body.appendChild(btn);

        // 创建店铺名称输入框 (多行)
        const input = document.createElement('input');
        input.id = 'my-shop-names-textarea';
        input.placeholder = '请输入店铺名称';
        input.value = '手工坊'; // 默认值
        input.style.position = 'fixed';
        input.style.top = '110px'; // 放在自动评价按钮下方
        input.style.left = 'calc(100vw - 200px)'; // 与自动评价按钮左对齐
        // input.style.right = '20px'; // 移除right属性
        input.style.zIndex = 9999;
        input.style.padding = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.width = '150px';
        input.style.marginTop = '10px'; // 为店铺名称输入框添加顶部边距
        document.body.appendChild(input);

        // 创建评论列表输入框 (多行)
        const commentsTextarea = document.createElement('textarea');
        commentsTextarea.id = 'my-comments-textarea';
        commentsTextarea.placeholder = '请输入评论内容，每行一个';
        commentsTextarea.style.position = 'fixed';
        commentsTextarea.style.top = '160px'; // 放在店铺名称输入框下方
        commentsTextarea.style.left = 'calc(100vw - 200px)'; // 与店铺名称输入框左对齐
        // commentsTextarea.style.right = '20px'; // 移除right属性
        commentsTextarea.style.zIndex = 9999;
        commentsTextarea.style.padding = '10px';
        commentsTextarea.style.border = '1px solid #ccc';
        commentsTextarea.style.borderRadius = '5px';
        commentsTextarea.style.width = '150px';
        commentsTextarea.style.height = '120px';
        commentsTextarea.style.marginTop = '10px'; // 为评论列表输入框添加顶部边距
        document.body.appendChild(commentsTextarea);

        // 创建评价数量输入框
        const countInput = document.createElement('input');
        countInput.id = 'my-count-input';
        countInput.type = 'number';
        countInput.placeholder = '评价数量';
        countInput.value = '49'; // 默认值
        countInput.style.position = 'fixed';
        countInput.style.top = '320px';
        countInput.style.left = 'calc(100vw - 200px)'; // 与列左对齐
        countInput.style.zIndex = 9999;
        countInput.style.padding = '10px';
        countInput.style.border = '1px solid #ccc';
        countInput.style.borderRadius = '5px';
        countInput.style.width = '150px'; // 与列宽度一致
        document.body.appendChild(countInput);

        // 创建显示/隐藏切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'my-toggle-btn';
        toggleBtn.innerText = '显示'; // 初始文本
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '20px'; // 放在右上角
        toggleBtn.style.right = '20px'; // 放在右上角
        toggleBtn.style.zIndex = 9999;
        toggleBtn.style.padding = '10px 10px';
        toggleBtn.style.background = '#555';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.onclick = toggleElementsVisibility;
        document.body.appendChild(toggleBtn);

        // 初始时隐藏元素 (除了切换按钮本身)
        toggleElementsVisibility();
    }

    // 每2秒检查一次按钮和输入框是否存在
    setInterval(createButton, 2000);

    // 新增：获取待评价订单接口
    async function fetchCommentOrders() {
        try {
            const response = await fetch('https://thor.weidian.com/tradeview/buyer.waitCommentOrderList/1.0?param=' + encodeURIComponent(JSON.stringify({
                pageNum: 1,
                pageSize: 15,
                v_seller_id: ''
            })), {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data && data.result && data.result.commentOrders) {
                console.log('commentOrders:', data.result.commentOrders);
                return data.result.commentOrders;
            } else {
                console.error('接口返回数据异常', data);
                return [];
            }
        } catch (e) {
            console.error('获取commentOrders失败', e);
            return [];
        }
    }

    /**
     * 提交评价（POST，x-www-form-urlencoded方式，无wdtoken）
     * @param {Object} data 评价数据
     * @returns {Promise<Object>} 响应数据
     */
    async function postComment(data) {
        try {
            // 构造 x-www-form-urlencoded 字符串
            const body = `param=${encodeURIComponent(JSON.stringify(data))}`;

            const response = await fetch('https://thor.weidian.com/wdcomment/addComment/1.0', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'accept': 'application/json, */*'
                },
                body: body
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('提交评价失败:', error);
            return null;
        }
    }

    //随机获取一个评论
    function getRandomComment(comments) {
        return comments[Math.floor(Math.random() * comments.length)];
    }

    function getPageOrders() {
        const orders = [];

        document.querySelectorAll('.order_item_info.judge_order_info ul li').forEach(li => {
            // 获取订单ID
            const orderDetailLink = li.querySelector('.to_order_detail');
            const href = orderDetailLink.getAttribute('href');
            const orderId = href.match(/oid=(\d+)/)?.[1];

            // 获取店铺名
            const shopName = li.querySelector('.shop_name .icon_shape')?.textContent.trim() || '';

            // 只获取"写评价"按钮的itemId
            const itemIds = [];
            li.querySelectorAll('.item_buttons a').forEach(link => {
                if (link.textContent.trim() === '写评价') {
                    const href = link.getAttribute('href');
                    const itemId = href.match(/itemId=(\d+)/)?.[1];
                    if (itemId) {
                        itemIds.push({ itemId });
                    }
                }
            });

            if (orderId && itemIds.length > 0) {
                orders.push({
                    orderId: orderId,
                    shopName: shopName,
                    items: itemIds
                });
            }
        });
        return orders;
    }
})();
