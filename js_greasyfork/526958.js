// ==UserScript==
// @name         宽百度_把百度首页样式调整为宽屏模式
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  修改百度首页为宽屏模式，固定顶部导航和用户信息栏
// @author       Edmond.Yang
// @match        *://www.baidu.com/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAHUElEQVR42u2ZC1BUZRTH/3cfvBcWhAUEM8vRspnULE0rLcwhRdM0UwvTEUt8goimNo5OmVMoPsCMwnynZk5OpoLomI98o1hZpqWlJrIssjz3vXs737ei8pJdXyvMnhlmZ/be++35fed85/zPRUATNsHVDrjh3HBuuKZjbrjGam64xmpNHE4URVc74YZzw90F3NFcAzw8BHR82rPO6/sO6tHjBW9XMzkPN3RkAY4cM/ASNKi/H1LnBd+E+lmP5JlFUBdaoVRKMH1KIN4erHA1m2NwzPHV68sQFiqDzSai6JoN6akheOsNP369V78r+POcGYGBEuh0NshkAv482dLVbI7Bdeh2CQaDCEEQIJUAZeU2RPfyQWa6CoeO6jF8tBpeXhJYrYBcDhQXWzFhjBIzkgPvyrmzXap3qrZHnSsPDcIdOKzHqPhCigboVgESiQi9XkQHOndbNoRjy7YKJE4tgq+vBGwlQRBRUSmiD8FnpKkebrjcPANiR6khSMCdl9CnTieiaxcvbFgZhuzdlRiboIE3RY4yFlKpiLIyEQPpXC5JCa533ZqO3yu7dQMcSsuomCs4f8EMf38JRQa8cCSMC8DM5CBcvGxGzKCrMJlFeMjtDms0FqSlqjBkoN/DBZf3qxGLlpbgSr4FvaJ8MD0pEDk/6TAhSYPKShs/V61aynF4T+SNZz6ZX4y0L0oJDrBYgJjevli+VIXjJw1IWaSlSNrQl76bGK90Ldyz3S8jn8B8fARotTZ8+EEQkibYnVqQpqWCImDyBGWtRbf8WIHTZ0xo87gcQwbZ20Cnly6joMACL28BJSU2zKK1Escra8E5e5ZqWn1rVYNb/HkJ3+ngYCmPgNUiQkGpmLu/hdM/mLJYyzMghNZi0TaZRISESHFod2S9zzgC7MymVIOLG6/G7j16qnwC9TN78TAaRaz9OhTdOldXHufOm3DhggV+fgJe7FpblYyMV2PPXh0UfhK+Fmv+bMPWrwrFcx29HnxaxlK/OnBQz8s6a9YSqh5G2vEVGSEkq3xuPDSFmnr2Lh0M1BIEKfBIpAwzSJWwM3pzrQJay3DLRgnUK21Yt8K+UQ8cbsmyEnyaqoWK0sdCqSQSILt45sRNtfFOXAF2UXQDSWYxh5kxVcKinElF5NVX7IDTZ1/Dmm/KeIqzX9DpbQhVyW6kpUsKSvSAfOSdMsDbR4JyUiJxI/wxf669X81boKWqWIJmQRKeYlVwVenLgI9fP5/HThjw7ntqrmakUoHuF7Hgk2C8M6R+zXlfz1yVffxZMW8FT7XzxMQxAfy7bdmVSJiqgZenAE/WsK0MyAaRNT5agulJVvK7v+iNdctD+TMHj+jx/Q8VMNFG9KKIvt7H975Eyym4mpazR4fJH2i4voyMkGHDqjASyiaMTdRwvckCyM6ojCJUSoD9YnyxbGGIQw7cq/SsK4oNwq37thxzKZIWqwiLGWjeXIqDdG5O/2HCoNir9B2LHGjOAwdlyzHhHEWR2kjy7KGFm5tSjC9XlHLnw8NkXHqFh0uxaW0YTv9uwrCRakQQLNOV/16y2HtZsIQXpDNnzfSMFHuzIm/rlEvgEikN128qp+IhRfzoAAwb7EeO02jASGk6yM3TIzauEGuWq/BMe0+8/NoVnPvbjDkfBiE+LgCTkjXYuLmCpzGrop07eTUI54xScWRiqBMuLYNaAlVGTyoe494PQHJCIIq1Vpw8ZX/N8FI3b+T9YuSRY32rUwdP9Ii2D6wfzQrCWNqM+AQ1snP0fFSKCJdhf05kg07WdNDRa07BdY26jMIiK7wJbufW5qRCJBQlNY6fMKL1Y3Ls3RlBaWnE4FgGp+Jwr/TOx9m/qiLnT8WmENt26HifK9RYMXsmfT8qwGG4hpyvK51r3lML7vAxPTVqNS/tCpJWP2VF8AoYRc5X0FTQ6lE59u1sjt//MOOt4VdJmoXh2Y4e6NKDIveXCfPmNOPqn0Vue5YeSiW1iHIR0T19eHo6Yrc7h3VFqL6NqAV34JD9tQGTYExVfEfFoxNpwUXpWny/tRItSGqtzlThN1ZQRqixlp05uh4/qRAnThqRlKDkL4fG04i0PUt3A65nD2+szAi9KzBH4BocVtt3vcQrH3ud8HxnT3yVroJCIa12z5mzRkT3v4rZMwJJxdROt8RpGmzeUoFmzaS4Rq2BFRk28txJpJypqA3CxY0rxI6cSl7SmQR78gk5BvT141Fj6p5N3H+fN2Nhegn8FXQehyrQpo38ejMHLyKZK8uRSxKMzXKVOhGb17H0vVkxHXG4ytF7CsesW8//cOEf+6sFFkWzGfxWJqj5CEPGqqmVmjtTLuyMyqTgn0xryj2uX6PoT6NpPqnGgOvMuXIUrsGCcqtNmVHE3zLrDfb3I2x8YQNnu7YeaE0TdwCBm80i8gusXLFcvGRGaant+mtAe+MfPkyBNwfU/S7lXk7jdZn7fwWN1VwNt5f+XnbD3RFcEzY3XGM1N1xjNTdcYzU3XGO1Jg33PzTflv9M2/qGAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526958/%E5%AE%BD%E7%99%BE%E5%BA%A6_%E6%8A%8A%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4%E4%B8%BA%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526958/%E5%AE%BD%E7%99%BE%E5%BA%A6_%E6%8A%8A%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4%E4%B8%BA%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==



(function() {
    'use strict';


    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 检查当前页面是否为百度首页
        if (window.location.href === 'https://www.baidu.com/') {
            // 查找 class="s-menu-item s-menu-mine" 的按钮
            const myFocusButton = document.querySelector('.s-menu-item.s-menu-mine');
            if (myFocusButton) {
                // 模拟点击按钮
                myFocusButton.click();
            } else {
            }
        }
    });



    const style = document.createElement('style');
	//  添加CSS覆盖，以调整导航栏部份宽度,图标部份调整以下前5个宽度（Width）值；s-top-userset-menu为顶部用户信息部份的设置项弹出菜单宽度；s-drag-stock为“我的股票”部份宽度设置。
	//  .s-skin-hasbg #s_main {    background: rgba(255, 255, 255, .15);}  最后的15为透明度，数字越小越透明
	// 12个图标位： 1230-1186-1220-1230-1120
	// 10个图标位： 1080-1036-1070-1080- 960
	//  .s-drag-stock 为“我的股票” 宽度至少应为 1110  才能放得下3列股票信息，可设置为与.s-drag-site宽度一致

    style.innerHTML = `
        .s-skin-hasbg #s_main {    background: rgba(255, 255, 255, .15);}

        .s-drag-site {                     width: 1230px !important;       }
        .main {                              width: 1186px !important;       }
        .card_layout_11HoJ {         width: 1220px !important;       }
        .content {                         width: 1230px !important;       }
        .cate-site-container {        width: 1120px !important;       }

        .s-drag-stock {                 width: 1100px !important;        }

        .s-top-userset-menu {      width: 100px !important;         }
        .s-top-wrap {                   height: 0px !important;            }

        .s_ipt {                   height: 18px !important;            }

       .new_search_guide_bub {     margin-top: -15px !important;       }
       .s-isindex-wrap{                  style.paddingtop: 1px !important;
                                                 style.minheight: 90px !important;
                                                 style.maxheight: 90px !important;        }

        .wrapper_new{                 margin-top: 10px;!important;        }

         .s-p-top{                        min-height: 90px !important;
                                              max-height: 100px !important;        }
   `;

    // 减少调整后的间隔空白
    // 获取元素
    const headWrapper = document.getElementById('head_wrapper');
        // 检查元素是否存在且具有指定的类名
    if (headWrapper && headWrapper.classList.contains('s-isindex-wrap'))
    {
        headWrapper.style.height= '95px';
        headWrapper.style.minHeight = '95px';
        headWrapper.style.maxHeight = '95px';
    }

    //    将百度首页中的导航、用户信息等固定在页面顶端，即使页面滚动也不会移动。
    // 1. 固定顶部导航部分
    const topNav = document.getElementById('s-top-left');
    if (topNav) {
        topNav.style.position = 'fixed';
        topNav.style.top = '0';
        topNav.style.left = '0';
        topNav.style.width = '100%';
        topNav.style.zIndex = '1000';
        topNav.style.textAlign= 'left';
        topNav.style.backgroundColor = '#80999999'; // 设置背景颜色
    }


    // 2. 固定搜索框部分
    const searchForm = document.getElementById('form');
    if (searchForm) {
        searchForm.style.position = 'fixed';
        searchForm.style.top = '8px';
        searchForm.style.right = '500';
        searchForm.style.zIndex = '1000';
        //        userInfo.style.backgroundColor = '#80999999'; // 不设置背景颜色，避免底色叠加

    }

    // 3. 固定用户信息部分
    const userInfo = document.getElementById('u1');
    if (userInfo) {
        userInfo.style.position = 'fixed';
        userInfo.style.top = '0';
        userInfo.style.right = '0';
        userInfo.style.zIndex = '1000';
        //        userInfo.style.backgroundColor = '#80999999'; // 不设置背景颜色，避免底色叠加

    }

    // 4. 调整页面内容的上边距，避免被固定的导航栏和用户信息遮挡
    const contentWrapper = document.getElementById('wrapper');
    if (contentWrapper) {
        const topNavHeight = topNav ? topNav.offsetHeight : 0;
        const userInfoHeight = userInfo ? userInfo.offsetHeight : 0;
        const maxHeight = Math.max(topNavHeight, userInfoHeight); // 取两者高度的最大值
        contentWrapper.style.marginTop = `${maxHeight + 20}px`; // 增加额外的边距
    }

    document.head.appendChild(style);


})();



