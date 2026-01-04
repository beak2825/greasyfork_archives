// ==UserScript==
// @name              信息流屏蔽工具
// @namespace         https://github.com/WinLinQ/info_flow_block
// @version           1.1.0
// @author            冬林Breeze
// @icon              https://raw.githubusercontent.com/WinLinQ/info_flow_block/main/icon.png
// @description       帮助用户在工作/学习查询资料时屏蔽信息流以使用户更加专注。
// @license           AGPL-3.0-or-later
// @homepage          https://github.com/WinLinQ/info_flow_block
// @supportURL        https://github.com/WinLinQ/info_flow_block/issues
// @require           https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @match             *://*.bilibili.com/*
// @match             *://*.baidu.com/*
// @match             *://*.xiaohongshu.com/*
// @match             *://*.zhihu.com/*
// @match             *://*.douyin.com/*
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486300/%E4%BF%A1%E6%81%AF%E6%B5%81%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/486300/%E4%BF%A1%E6%81%AF%E6%B5%81%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    let block = {
        bili(){
            let main_page = `
                .bili-header__channel, .bili-feed4-layout, .header-channel, .left-entry, .right-entry, .adblock-tips, .trending{
                    display: none !important; 
                }
                .nav-search-input::placeholder{
                    font-size: 0px !important;
                }
            `;
            let search_page = `
                #biliMainFooter{
                    display: none !important; 
                }
            `;
            let video_page = `
                #reco_list, .pop-live-small-mode{
                display: none !important; 
                }
            `;

            $(document).ready(function(){
                let nav_search_input = document.querySelector('.nav-search-input');

                let loop_n_time = 3;
                let n = 0;
                function loop(){      
                    n++;
                    console.log(n);
    
                    //代码
                    nav_search_input.removeAttribute("title");
                    
    
                    if(n>=loop_n_time){
                        clearInterval(timer);
                    }
                }
                var timer=setInterval(loop,1000);
            });

            GM_addStyle(main_page);
            GM_addStyle(search_page);
            GM_addStyle(video_page);
        },
        baidu(){
            let search_page = `
                #con-ceiling-wrapper{
                    display: none !important; 
                }
            `;

            $(document).ready(function(){
                function loop(){      
                    //代码
                    GM_addStyle(search_page);

                }
                var timer=setInterval(loop,100);
            });

            GM_addStyle(search_page);
        },
        xiaohongshu(){
            let main_page = `
                .sug-box, .hotspots, .channel-list, #exploreFeeds, .channel-container, .reds-button-new{
                    display: none !important; 
                }
                .search-input::placeholder{
                    font-size: 0px !important;
                }
            `;
            let search_page = `
                #biliMainFooter{
                    display: none !important; 
                }
            `;

            GM_addStyle(main_page);
            GM_addStyle(search_page);

        },
        zhihu(){
            let main_page = `
                .css-1qyytj7, .AppHeader-Tabs, .AppHeader-userInfo, .TopstoryTabs, .Topstory-recommend, .SearchBar-topSearchItem, .SearchBar-label{
                    display: none !important; 
                }
                .Input::placeholder{
                    font-size: 0px !important;
                }
            `;
            let search_page = `
                .css-knqde{
                    display: none !important; 
                }
            `;

            GM_addStyle(main_page);
            GM_addStyle(search_page);

        },
        douyin(){
            if (location.pathname==='/'){
                location.href = "https://www.douyin.com/discover";
            }

            let main_page = `
                .jscIDlNp, .bAWEc17k, .mXmCULv9, .MkxzAXKO, .n5__RH8Y, ._FQT2Mbu, .SZWmE23U{
                    display: none !important; 
                }
                .Input::placeholder{
                    font-size: 0px !important;
                }
            `;
            let search_page = `
                .kQ2JnIMK, .iqHX00br, .w5EpFlgg{
                    display: none !important; 
                }
            `;

            GM_addStyle(main_page);
            GM_addStyle(search_page);

        },
    }

    // 主代码
	let main = {
		init() {
			// 判断地址并加载对应的Block
			if (/www.bilibili.com/.test(location.host) || /search.bilibili.com/.test(location.host)) {
				block.bili();
			}
            if (/www.baidu.com/.test(location.host)) {
				block.baidu();
			}
            if (/www.xiaohongshu.com/.test(location.host)) {
				block.xiaohongshu();
			}
            if (/www.zhihu.com/.test(location.host)) {
				block.zhihu();
			}
            if (/www.douyin.com/.test(location.host)) {
				block.douyin();
			}
		}
	};

	main.init();
})();