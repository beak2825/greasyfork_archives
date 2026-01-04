// ==UserScript==
// @name         移除知乎专栏登录、顶栏、底栏
// @namespace    https://jkey104.gitee.io/
// @version      1.10
// @description  移除知乎专栏登录框，移除顶栏，移除底栏，将评论移动到侧边栏，添加搜索功能
// @author       Jkey
// @match        *://zhuanlan.zhihu.com/p/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/443075/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%99%BB%E5%BD%95%E3%80%81%E9%A1%B6%E6%A0%8F%E3%80%81%E5%BA%95%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/443075/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%99%BB%E5%BD%95%E3%80%81%E9%A1%B6%E6%A0%8F%E3%80%81%E5%BA%95%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function () {
        // 隐藏登录
        document.querySelector('div.Modal.Modal--default.signFlowModal > button')?.click();
        // 隐藏顶栏
        document.querySelector('div.ColumnPageHeader-Wrapper').style.display = 'none';
        // 隐藏底栏
        document.querySelector('div.ContentItem-actions').style.display = 'none';
        // 将评论移到侧栏
        let pinglun = document.createElement('button');
        let nums_btn = document.querySelector('div.ContentItem-actions > div:nth-child(2) > button');
        let svg_element = nums_btn.querySelector('svg');
        svg_element.setAttribute('width', '');
        svg_element.setAttribute('height', '1.5em');
        svg_element.style.marginBottom = '0.6em';
        pinglun.appendChild(svg_element);
        pinglun.innerHTML += nums_btn.innerText.slice(1);
        pinglun.onclick = function() {
            nums_btn.click();
        };
        pinglun.style.display = "grid";
        let a = document.createElement('div');
        a.classList = 'Post-SideActions';
        a.appendChild(pinglun);
        a.style.marginTop = '10em';
        // 添加搜索
        let search = document.createElement('button');
        search.innerHTML = "<svg width height=\"22\" viewBox=\"0 0 24 24\" data-new-api=\"Search24\" data-old-api=\"Search\" class=\"Zi Zi--Search SearchBar-searchIcon css-1dlt5yv\" fill=\"currentColor\"><g fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"ariaskiptheme\"><path d=\"M11.5 18.389c3.875 0 7-3.118 7-6.945 0-3.826-3.125-6.944-7-6.944s-7 3.118-7 6.944 3.125 6.945 7 6.945zm0 1.5c4.694 0 8.5-3.78 8.5-8.445C20 6.781 16.194 3 11.5 3S3 6.78 3 11.444c0 4.664 3.806 8.445 8.5 8.445z\" class=\"ariaskiptheme\"></path><path d=\"M16.47 16.97a.75.75 0 011.06 0l3.5 3.5a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06z\" class=\"ariaskiptheme\"></path></g></svg><div style=\"margin-top: 0.4em;\">搜索</div>";
        search.style.display = "grid";

        // 遮罩和搜索框
        let searchHover = document.createElement('div');
        searchHover.classList = "Modal-wrapper undefined Modal-enter-done";
        searchHover.style.display = 'none';
        searchHover.innerHTML = "<div class=\"Modal-backdrop\"></div>";
        let searchBar = document.createElement('span');
        searchBar.style.cssText = "margin-left:calc(50% - 200px); margin-top: 30vh; height: 40px;display: flex; width: 400px;border-radius: 4px;";
        let inputBar = document.createElement('input');
        inputBar.setAttribute("type", "search");
        inputBar.setAttribute("placeholder", "输入并搜索");
        inputBar.style.cssText = "width: 100%;height: 100%;border: none;background-color: white;border-radius: 4px;font-size: 15px;font-weight: 500;padding: 0 20px 0 40px;box-shadow: 0 0 0 2px rgb(134 140 160 / 2%);background-image: url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23717790c7'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e\");background-size: 14px;background-repeat: no-repeat;background-position: 16px 48%;";
        inputBar.onkeydown = function(e) {
            var evt = window.event || e;
            if (evt.keyCode == 13 && inputBar.value){
                window.open('http://www.zhihu.com/search?q=' + inputBar.value,'_blank');
            }
        }
        searchBar.appendChild(inputBar);
        searchBar.onclick = function(even){
            even.stopPropagation();
        }
        searchHover.children[0].appendChild(searchBar);
        // 隐藏遮罩和搜索框
        searchHover.onclick = function() {
            searchHover.style.display = 'none';
            inputBar.value = '';
        }
        document.body.appendChild(searchHover);
        // 显示遮罩和搜索框
        search.onclick = function() {
            searchHover.removeAttribute("style");
        };
        a.appendChild(search);
        document.querySelector('div.Sticky.RichContent-actions.is-fixed.is-bottom').appendChild(a);
    });
})();