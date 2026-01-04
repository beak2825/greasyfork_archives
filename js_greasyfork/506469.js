// ==UserScript==
// @name         baxitv_find_preview
// @namespace    com.oldtan.find_preview
// @version      1.1.9
// @description  查找预览
// @author       oldtan
// @include       https://www.baxi.tv/forum-54-*.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/506469/baxitv_find_preview.user.js
// @updateURL https://update.greasyfork.org/scripts/506469/baxitv_find_preview.meta.js
// ==/UserScript==
function sleep(time){
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}

window.addEventListener('load', function() {
    //console.log(123111111111111111111111111111)
    // // 获取所有的超链接元素
    // var links = document.querySelectorAll('a');
    // // 遍历这些超链接并检查文本内容
    // links.forEach(function(link) {
    //      // 检查超链接文本是否等于 '预览'
    //     if (link.textContent === '预览') {
    //         // 获取超链接所在的 tbody 元素的 ID
    //         var tbodyElement = link.closest('tbody');
    //         if (tbodyElement.id.includes('stick')){
    //             return
    //         }
    //         if (tbodyElement) {
    //             // 提取 tid，这里假设 tbody 的 ID 是 'thread_' + tid
    //             var tid = tbodyElement.id.replace('normalthread_', '');
    //             // 调用 forum.js 中的 previewThread 函数
    //             previewThread(tid, tbodyElement.id);
    //             // 确保预览元素可见
    //             var previewDiv = document.getElementById('threadPreviewTR_' + tid);
    //             if (previewDiv) {
    //                 previewDiv.style.display = 'revert';
    //             }
    //         }
    //     }
    // });

   

    var scbar = document.getElementById('scbar');
    var scbar_hot = document.getElementById('scbar_hot');

    // 获取 div 内的所有 <a> 元素
    var links = scbar_hot.getElementsByTagName('*');
    // 倒序遍历并删除所有 <a> 元素
    for (var i = links.length - 1; i >= 0; i--) {
        links[i].parentNode.removeChild(links[i]);
    }
    document.getElementsByClassName('scbar_hot_td')[0].style.width='60%';
    scbar_hot.addEventListener('click', function(e) {
         // 获取所有的超链接元素
        var links = document.querySelectorAll('a');
        // 遍历这些超链接并检查文本内容
        links.forEach(function(link) {
            // 检查超链接文本是否等于 '预览'
            if (link.textContent === '预览') {
                // 获取超链接所在的 tbody 元素的 ID
                var tbody = link.closest('tbody').getAttribute('id');
                if (tbody.includes('stick')){
                    return
                }
                if (tbody) {
                    // 提取 tid，这里假设 tbody 的 ID 是 'thread_' + tid
                    var tid = tbody.split('_')[1];
                    // 调用 forum.js 中的 previewThread 函数
                    previewThread(tid, tbody);
                    // 确保预览元素可见
                    var previewDiv = document.getElementById('threadPreviewTR_' + tid);
                    if (previewDiv) {
                        previewDiv.style.display = 'revert';
                    }
                }
            }
        });

    });

    // 初始化时设置 scbar 的样式
    // setScrollStyle(scbar);

    // 隐藏热搜关键字
    var hotkwdDiv = document.getElementById('scbar_hot');
    if (hotkwdDiv) {
        // hotkwdDiv.style.display = 'none';
    }
    var navbar = document.getElementById('scbar');
    var navbarOffsetTop = navbar.offsetTop; // 导航栏距离页面顶部的距离
    var isScrollStyle=false
    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > navbarOffsetTop) {
            setScrollStyle(scbar);
            isScrollStyle=true
        } else {
            setInitialStyle(scbar);
            isScrollStyle=false
        }
    });
    // 添加键盘事件监听器
    document.addEventListener('keydown', function(event) {
        // 检查是否同时按下了 Ctrl 和 'F' 或 'S' 键
        // if (event.ctrlKey && (event.key === 'D' || event.key === 'S')) {
        if (event.key === 'Tab') {
            // 阻止默认的 Tab 行为
            event.preventDefault();
            // 获取输入框元素
            var input = document.getElementById('scbar_txt');
            // 让输入框获取焦点
            input.focus();
            // 选中输入框中的所有文本
            input.select();
        }
    });

    // 获取搜索提交按钮和搜索输入框
    var searchButton = document.getElementById('scbar_btn');
    var searchInput = document.getElementById('scbar_txt');
    var searchForm = document.getElementById('scbar_form');

    // searchButton.addEventListener('click', function() {
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认的提交
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        //先隐藏所有预览
        hidePreview();
        //移除之前的高亮显示
        removeHighlight();
        // 获取搜索框的值
        var searchValue = searchInput.value.toLowerCase();
        var displayElement = document.getElementById('scbar_type');
        if (searchValue) {
            // 获取所有超链接
            var links = document.getElementsByClassName('s xst');
            var matchCount = 0; // 重置匹配计数器
            var firstMatch = null; // 存储第一个匹配的超链接
            // 遍历超链接
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                // 检查超链接文本是否包含搜索值
                if (link.textContent.toLowerCase().includes(searchValue)) {
                    // 打印匹配的超链接文本内容
                    // console.log(link.textContent);
                    matchCount++;
                    // 高亮显示匹配的超链接文本
                    highlightText(link, searchValue);
                    // 获取超链接所在的 tbody 元素的 ID
                    var tbody = link.closest('tbody').getAttribute('id');
                    if (tbody.includes('stick')){
                        return
                    }
                    if (tbody) {
                        // 提取 tid，这里假设 tbody 的 ID 是 'thread_' + tid
                        var tid = tbody.split('_')[1];
                        // 调用 forum.js 中的 previewThread 函数
                        previewThread(tid, tbody);
                        // 确保预览元素可见
                        var previewDiv = document.getElementById('threadPreviewTR_' + tid);
                        if (previewDiv) {
                            previewDiv.style.display = 'revert';
                        }
                        if (!firstMatch) {
                            firstMatch = link; // 存储第一个匹配的超链接
                            if(!isScrollStyle){
                                setScrollStyle(scbar);//不设置的话搜索到的关键字正好是第一个,显示有异样
                            }
                            // 找到当前链接的父节点
                            var previousElement = firstMatch.closest('tbody').previousElementSibling;
                            if(previousElement.nodeName==='SCRIPT'){
                                previousElement=previousElement.previousElementSibling.previousElementSibling;
                            }

                            console.log(previousElement)
                            previousElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }
            }
            if(firstMatch){

                // if(isScrollStyle){
                    // console.log(previousElement+scrollTop)
                    // previousElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // }else{
                    // previousElement = previousElement.previousElementSibling.previousElementSibling;
                    // console.log(previousElement)
                    // previousElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // var stickElement = document.getElementById('threadlist');//threadlist
                    // stickElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // }
            }
            displayElement.textContent = matchCount;
        } else {
            console.log('Please enter a search term.');
            displayElement.textContent = 0;
        }
        // 使用 setTimeout 延迟获取所有类名为 'previewvfastpost' 的元素
        setTimeout(function() {
            var elements = document.getElementsByClassName('previewvfastpost');
            // console.log(elements.length);
            // 遍历所有元素并隐藏它们
            for (var j = 0; j < elements.length; j++) {

                elements[j].style.display = 'none';

            }
        }, 500); // 毫秒
    });


});

function hidePreview(){
    // 获取所有的超链接元素
    var links = document.querySelectorAll('a');
    // 遍历这些超链接并检查文本内容
    links.forEach(function(link) {
        // 检查超链接文本是否等于 '预览'
        if (link.textContent === '隐藏预览') {
            // 获取超链接所在的 tbody 元素的 ID
            var tbody = link.closest('tbody').getAttribute('id');
            if (tbody.includes('stick')){
                return
            }
            if (tbody) {
                // 提取 tid，这里假设 tbody 的 ID 是 'thread_' + tid
                var tid = tbody.split('_')[1];
                // 调用 forum.js 中的 previewThread 函数
                previewThread(tid, tbody);
                // 确保预览元素可见
                var previewDiv = document.getElementById('threadPreviewTR_' + tid);
                if (previewDiv) {
                    previewDiv.style.display = 'revert';
                }
            }
        }
    });

}

// 函数：高亮显示匹配的文本
function highlightText(element, searchValue) {
    var innerHTML = element.innerHTML; // 获取元素的原始HTML
    var highlighted = innerHTML.replace(new RegExp(searchValue, 'gi'), function(match) {
        return '<span class="ai-assist-highlight">' + match + '</span>'; // 将匹配的文本包裹在span中，并添加高亮样式类
    });
    element.innerHTML = highlighted; // 更新元素的HTML以显示高亮文本
}

// 移除高亮显示的函数
function removeHighlight() {
    var highlights = document.querySelectorAll('.ai-assist-highlight');
    highlights.forEach(function(el) {
        // 将高亮文本的父级超链接的文本内容恢复原样
        var parentLink = el.parentNode;
        parentLink.innerHTML = parentLink.textContent;
    });
}

// 定义初始化样式
function setInitialStyle(scbar) {
    scbar.style.overflow = 'hidden';
    scbar.style.height = '42px';
    scbar.style.lineHeight = '42px';
    scbar.style.borderTop = '1px solid #FFF';
    scbar.style.borderBottom = '1px solid #E9EFF5';
    scbar.style.background = '#E8EFF5';
    scbar.style.position = 'static'; // 非固定定位
    // scbar.style.left = '234.667px';
    scbar.style.zIndex = '199';
    scbar.style.top = '0px';
}

// 定义滚动时的样式
function setScrollStyle(scbar) {
    scbar.style.borderLeftWidth = '0px';
    scbar.style.borderRightWidth = '0px';
    scbar.style.height = '42px';
    scbar.style.lineHeight = '42px';
    scbar.style.width = '960px';
    scbar.style.position = 'fixed';
    scbar.style.opacity = '1';
    // scbar.style.left = '234.667px';
    scbar.style.zIndex = '199';
    scbar.style.top = '0px';
}
function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }


function Toast2(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }



