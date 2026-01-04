// ==UserScript==
// @name         YWM-wms配货脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check for text and hide parent elements of specific class using jQuery, and add a button when conditions are met
// @author       You
// @match        https://wms.private.mabangerp.com/redirect/pick/20302/pdaPage
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531817/YWM-wms%E9%85%8D%E8%B4%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/531817/YWM-wms%E9%85%8D%E8%B4%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    // 添加 CSS 样式
    GM_addStyle(`
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .enlarged-photo {
            max-width: 90%;
            max-height: 90%;
        }
        .close-btn {

            cursor: pointer;
            font-size: 32px;
            color: white;
            background: transparent;
            border: none;
        }
    `);
$(document).on('click', '.getPickProduct', function() {
    if ($(this).text().trim() === '获取任务') {
        console.log('Task button clicked.');
                    $('#productbody .originalSku').parent().hide(); // 隐藏 originalSku 类的父元素
                    $('.bottom').hide();
                    $('.right br').remove();
                    $('.productpicking-detail').removeClass('mt5');
        const skus = [];
        $('.right').each(function() {
            const sku = $(this).find('p').has('.sku').find('b').text().trim();
            skus.push(sku);
        });

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.taobaimei.com/YWM/admin_control_center.php",
            data: "type=checkRestocks&skus=" + encodeURIComponent(JSON.stringify(skus)),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                console.log(response)
                const results = JSON.parse(response.responseText);
                $('.right').each(function(index) {
                    const lastP = $(this).find('p:last');
                    const firstP = $(this).find('p:first');

                    $(firstP).css({
                        'background-color': 'lightgray', // 注意属性名是 background-color
                        'padding': '2px'  // padding 的设置已经是正确的
                });
                    // 添加 'done' 按钮
                    const btndoneHtml = `<button class="btn btn-default" style="padding: 0;text-align: center;float: right;color: black;">
                        ✅OK
                    </button>`;
                    firstP.append(btndoneHtml);

                    // 根据结果决定如何显示 'Restock' 按钮
                    let btnHtml;
                    if (results[skus[index]] === "yes") {
                        btnHtml = `<button class="btn btn-success Done" style="padding: 0;text-align: center;float: right;color: black;">
                            ✔ Done
                        </button>`;
                    } else {
                        btnHtml = `<button class="btn btn-default Restock" style="padding: 0;text-align: center;float: right;color: black;">
                            🛒Restock
                        </button>`;
                    }
                    lastP.append(btnHtml);
                });
                // 调整左侧图片容器宽度和图片尺寸
                $('.left').css('width', '19%').find('img').css({
                    height: 'auto',  // 自适应高度
                    width: '100%'    // 宽度充满整个父元素
                });
                $('.right').css('width', '61%');
            }
        });
    }
});
$(document).on("click", ".Done", function () {
    console.log("Restock called");
    var button = $(this); // 保存按钮引用
    // 直接寻找SKU信息
    var sku = $(this).closest('.right').find('p').has('.sku').find('b').text().trim();
    console.log('SKU:', sku);

    if (sku === "") {
        alert("SKU not found");
        return;
    }
            var confirmMessage = "确认这个SKU已经补货完成了吗？\n" +
                "Are you sure this SKU has been restocked?\n" +
                "သင်သည်ဤSKUကိုပြန်လည်ဖြည့်ပြီးကြောင်းသေချာပါသလား？\n" +
                "คุณแน่ใจหรือไม่ว่าสินค้านี้ได้รับการเติมเต็มแล้ว?";
    if (!confirm(confirmMessage)) {
        return;
    }

    // 使用 GM_xmlhttpRequest 发送跨域请求
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.taobaimei.com/YWM/admin_control_center.php", // 替换成你的后端处理文件路径
        data: "type=updateRestockStatus&sku=" + encodeURIComponent(sku) + "&restock=NO",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            if (response.responseText.indexOf("OK") !== -1) {
                //alert("Restock operation was successful!");
                $(button).replaceWith('<button class="btn btn-default Restock" style="padding: 0;text-align: center;float: right;color: black;">' +
                    '🛒Restock' +
                    '</button>');
            } else {
                alert("Failed to update restock status: " + response.responseText);
            }
        },
        onerror: function() {
            alert("An error occurred while updating the restock status.");
        }
    });
});

$(document).on("click", ".Restock", function () {
    console.log("Restock called");
    var button = $(this); // 保存按钮引用
    // 直接寻找SKU信息
    var sku = $(this).closest('.right').find('p').has('.sku').find('b').text().trim();
    console.log('SKU:', sku);

    if (sku === "") {
        alert("SKU not found");
        return;
    }

    if (!confirm("Are you going to restock this item to the shelf?\n确认要重新补货到货架上吗?\nคุณต้องการเติมสินค้าไปยังชั้นวางหรือไม่?\nသင်သည်ဤပစ္စည်းကို စင်သို့ဖြည့်ချင်ပါသလား?")) {
        return;
    }

    // 使用 GM_xmlhttpRequest 发送跨域请求
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.taobaimei.com/YWM/admin_control_center.php", // 替换成你的后端处理文件路径
        data: "type=updateRestockStatus&sku=" + encodeURIComponent(sku) + "&restock=yes",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            if (response.responseText.indexOf("OK") !== -1) {
                //alert("Restock operation was successful!");
                $(button).replaceWith('<button class="btn btn-success" style="padding: 0;text-align: center;float:right;">' +
                    '<span>🛒</span>Awaiting' +
                    '</button>');
            } else {
                alert("Failed to update restock status: " + response.responseText);
            }
        },
        onerror: function() {
            alert("An error occurred while updating the restock status.");
        }
    });
});
    // 设置图片点击事件，创建并显示放大图片和关闭按钮
    $(document).on("click", ".photo", function() {
        var src = $(this).attr('src');  // 获取图片源地址

        // 创建遮罩层
        var overlay = $('<div class="overlay"></div>');

        // 创建放大的图片元素
        var enlargedPhoto = $('<img>').attr('src', src).addClass('enlarged-photo');

        // 创建关闭按钮
        var closeButton = $('<button class="close-btn">✖</button>');

        // 关闭按钮点击事件，移除遮罩层
        closeButton.on('click', function() {
            overlay.remove();
        });

        // 将图片和关闭按钮添加到遮罩层
        overlay.append(enlargedPhoto).append(closeButton);

        // 将遮罩层添加到 body
        $('body').append(overlay);
    });

})(jQuery);
