// ==UserScript==
// @name         易仓RMA店铺多选保存和填充按钮增加
// @namespace    http://maxpeedingrods.cn/
// @version      20241203
// @description  易仓RMA退款店铺多选保存和填充按钮增加
// @license      No License
// @author       yang
// @match        *://home.eccang.com/entry/E2JRLA/ERP/*
// @match        *://ntmhry9-eb.eccang.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.min.js
// @resource     chosenCSS https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css

// @downloadURL https://update.greasyfork.org/scripts/519830/%E6%98%93%E4%BB%93RMA%E5%BA%97%E9%93%BA%E5%A4%9A%E9%80%89%E4%BF%9D%E5%AD%98%E5%92%8C%E5%A1%AB%E5%85%85%E6%8C%89%E9%92%AE%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/519830/%E6%98%93%E4%BB%93RMA%E5%BA%97%E9%93%BA%E5%A4%9A%E9%80%89%E4%BF%9D%E5%AD%98%E5%92%8C%E5%A1%AB%E5%85%85%E6%8C%89%E9%92%AE%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==


function createButton() {
    function addEventListener() {
        // 保留原始的方法
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;

        // 重写pushState
        history.pushState = function () {
            var result = originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        // 重写replaceState
        history.replaceState = function () {
            var result = originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        // 监听popstate事件
        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event('locationchange'));
        });

        // 自定义事件处理
        window.addEventListener('locationchange', function () {
            const url = window.location.href;
            if (url.indexOf("eccang.com") >= 0) {
                waitForElement('#searchForm > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3)', createInfo);
            }
        });
    }

    // 等待元素出现并执行回调
    function waitForElement(selector, callback) {
        var checkExist = setInterval(function () {
            if ($(selector).length > 0) {
                clearInterval(checkExist);
                callback();
            }
        }, 100); // 每100毫秒检查一次，根据需要调整
    }

    function createInfo() {
        // 找到的元素
        const targetElement = $('#searchForm > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3)');
        // 初始化搜索框和按钮（这里假设搜索框已经存在，但代码中没有显示创建）
        initSearchUI(targetElement);
    }


    function initSearchUI(targetElement) {
        // 创建一个带空格和自定义样式的按钮组
        const buttonGroup = $('<div style="display: flex; gap: 10px;"></div>'); 
        const Choicesavebutton = $('<button id="Choicesavebutton" style="background-color: #00CCFF; color: white; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; margin: 4px 2px; cursor: pointer;">多选保存</button>');
        const fillbutton = $('<button id="fillbutton" style="background-color: #80BFFF; color: white; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; margin: 4px 2px; cursor: pointer;">填充</button>');
    
        buttonGroup.append(Choicesavebutton, fillbutton);
        targetElement.prepend(buttonGroup);
    
        // 使用事件委托来绑定点击事件，并阻止默认行为和其他事件传播
        $(document).on('click', '#Choicesavebutton', function (event) {
            event.preventDefault();
            event.stopPropagation();
            //console.log("多选保存按钮");
            // 询问用户是否填充数据
            var coverdata = confirm("是否要覆盖原数据？");           
            if (!coverdata) {
                return; // 如果用户选择否，则终止代码执行
            }
            // 选择所有符合条件的 span 元素
            var spans = $('#E17_chosen > ul > li.search-choice > span');        
            if (spans.length == 0) {
                alert("未选择店铺！请检查");  
                return; // 如果用户选择否，则终止代码执行
            }
            // 提取 span 元素的文本内容
            var spanValues = [];
            spans.each(function() {
                spanValues.push($(this).text().trim()); // 使用 trim() 去除多余的空白字符
            });
            
            // 将数据保存到 localStorage
            try {
                localStorage.setItem('savedSpanValues', JSON.stringify(spanValues));
                //console.log('保存成功:', spanValues);
            } catch (e) {
                //console.error('保存失败:', e);
            }
        
            // 可选：通知用户保存完成
            alert('已保存 ' + spanValues+ ' 项到本地存储');
        });
        $(document).on('click', '#fillbutton', function(event) {
            event.preventDefault();
            event.stopPropagation();
            //console.log("填充按钮被点击");

            if (!confirm("是否要填充数据？")) return;
            // 获取具有ID 'E17_chosen' 的元素
            var element = document.getElementById('E17_chosen');
            
            // 检查元素是否存在
            if (element) {
                // 从DOM中移除元素
                element.remove();
            }    

            var savedSpanValues = JSON.parse(localStorage.getItem('savedSpanValues')) || [];

            var selectElement = $('#E17');

            if (typeof $.fn.chosen === 'function') {
                if (selectElement.data('chosen')) {
                    selectElement.chosen('destroy');
                }

                selectElement.val([]); // 清空选择

                Array.from(selectElement[0].options).forEach(function(option) {
                    option.selected = savedSpanValues.includes(option.text.trim());
                });

                selectElement.chosen({
                    width: "150px",
                    disable_search_threshold: 10,
                }).trigger("chosen:updated"); // 触发更新事件
            } else {
                //console.error('Chosen插件未加载');
            }

            //console.log('填充完成:', savedSpanValues);
        });
    

    }

    $(document).ready(function () {
        addEventListener();
        window.dispatchEvent(new Event('locationchange'));
    });
}

(function () {
    'use strict';
    createButton();
})();
