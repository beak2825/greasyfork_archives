// ==UserScript==
// @name         牛牛聊天增强插件
// @namespace    https://www.milkywayidle.com/
// @version      0.2.1
// @description  让牛牛聊天支持发送图片、解析图片；支持插件专属表情；支持自定义聊天界面；支持屏蔽复读机
// @author       HouGuoYu
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://www.milkywayidle.com/favicon.svg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535795/%E7%89%9B%E7%89%9B%E8%81%8A%E5%A4%A9%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535795/%E7%89%9B%E7%89%9B%E8%81%8A%E5%A4%A9%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function(){
	'use strict';
	GM_addStyle(`
body[data-chatfontsize="1"] .ChatMessage_chatMessage__2wev4{font-size:18px}
body[data-chatfontsize="2"] .ChatMessage_chatMessage__2wev4{font-size:20px}
body[data-chatfontsize="3"] .ChatMessage_chatMessage__2wev4{font-size:24px;line-height:24px}
body[data-chatusername="1"] .ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2{display:inline-flex;height:18px;grid-gap:4px;gap:4px;align-items:center;margin:1px 4px;width:-moz-fit-content;width:fit-content;border-radius:4px;padding:1px 5px;white-space:nowrap;border:1px solid var(--color-space-400);background:var(--color-space-600)}
.ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2{height:auto;}
body[data-chatfontsize="1"][data-chatusername="1"] .ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2{height:18px;}
body[data-chatfontsize="2"][data-chatusername="1"] .ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2{height:20px;}
body[data-chatfontsize="3"][data-chatusername="1"] .ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2{height:24px;}
body[data-chatfontsize="1"] .ChatMessage_chatMessage__2wev4 .CharacterName_chatIcon__22lxV{height:20px;width:20px}
body[data-chatfontsize="2"] .ChatMessage_chatMessage__2wev4 .CharacterName_chatIcon__22lxV{height:24px;width:24px}
body[data-chatfontsize="3"] .ChatMessage_chatMessage__2wev4 .CharacterName_chatIcon__22lxV{height:28px;width:28px}
body[data-chatchattime="1"] .ChatMessage_chatMessage__2wev4 .ChatMessage_timestamp__1iRZO{display:none}
.ChatMessage_chatMessage__2wev4 span[aria-labelledby]>span{display:flex}
.ChatMessage_chatMessage__2wev4 span>span>span{display:flex}
body[data-chatat="1"] .ChatMessage_chatMessage__2wev4.ChatMessage_mention__1pKLW{border:2px dashed var(--color-midnight-100)}
body[data-chatat="1"] .ChatMessage_chatMessage__2wev4.ChatMessage_mention__1pKLW>*:not(:nth-child(-n+2)){color:var(--color-scarlet-100)}
body[data-chatic="1"] .ChatMessage_chatMessage__2wev4 .CharacterName_gameMode__2Pvw8,.ic-icon{display:inline-block;border-radius:50%;color:#000!important;width:14px;height:14px;font-size:0;margin:3px 0 0 2px;border:1px solid #fff;background:linear-gradient(61deg,var(--color-neutral-300),var(--color-neutral-300) 3%,var(--color-neutral-100) 15%,var(--color-neutral-0) 50%,var(--color-neutral-200) 70%,var(--color-neutral-300) 95%,var(--color-neutral-300))}
body[data-chatwindow="1"] .GamePage_gamePage__ixiPl .GamePage_gamePanel__3uNKN .GamePage_contentPanel__Zx4FH .GamePage_middlePanel__uDts7 .GamePage_chatPanel__mVaVt{position:fixed!important;width:unset;background:#2d2d2d;border:solid 2px var(--color-midnight-100);border-radius:4px;padding:12px;background-color:var(--color-midnight-900);box-shadow:rgba(0,0,0,.3) 2px 2px 10px 6px;color:var(--color-text-dark-mode);z-index:100}
body[data-chatwindow="1"] .TabsComponent_tabsContainer__3BDUp.TabsComponent_wrap__3fEC7{cursor:move;transition:all .2s}
body[data-chatwindow="1"] .TabsComponent_tabsContainer__3BDUp.TabsComponent_wrap__3fEC7:hover{background:var(--color-midnight-600)}
.resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;z-index:10;overflow:hidden;display:none}
body[data-chatwindow="1"] .resize-handle{display:block}
.resize-handle:after{content:'';position:absolute;width:0;height:0;border:6px solid transparent;left:0;top:0;border-right-color:var(--color-midnight-100);border-bottom-color:var(--color-midnight-100);transition:all .2s}
.resize-handle:hover:after{border-right-color:var(--color-space-300);border-bottom-color:var(--color-space-300)}
body[data-chatwindow="1"] .gutter-vertical{display:none}
.CharacterName_characterName__2FqyZ{font-size:unset;align-items:center}
.chat-img{display:inline-block}
.chat-img img{display:inline-flex;margin:1px 4px;max-height:60px;max-width:100px;width:fit-content;object-fit:contain;border:2px solid #778be1;border-radius:4px;padding:1px;white-space:nowrap;background:#000;cursor:pointer;transition:all .2s}
.chat-img:hover img{background-color:var(--color-midnight-300);border-color:var(--color-space-300)}
.chat-img.chat-emoji img{border:0;background:0 0;padding:0;margin:0}
.chat-img span{padding:0 1px;border:0;margin:0;background:unset}
.chat-img-preview{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);display:flex;justify-content:center;align-items:center;z-index:9999;cursor:zoom-out}
.chat-img-preview img{max-width:90%;max-height:90%;border:2px solid #fff;border-radius:4px}
.upload-status{position:fixed;bottom:20px;right:20px;padding:10px 15px;background:#4caf50;color:#fff;border-radius:4px;z-index:10000;box-shadow:0 2px 10px rgba(0,0,0,.2)}
.chat-conf,.emoji-btn{width:28px;height:28px;display:flex;justify-content:center;align-items:center;cursor:pointer;position:relative;border-radius:4px;padding:4px;background-color:var(--color-midnight-500);margin:2px}
.chat-conf>svg,.emoji-btn>svg{width:100%;height:100%}
.chat-conf:hover,.emoji-btn:hover{background-color:var(--color-midnight-300)}
.emoji-panel{position:absolute;width:450px;z-index:10000;border:solid 2px var(--color-midnight-100);box-shadow:rgba(0,0,0,.3) 2px 2px 10px 6px;color:var(--color-text-dark-mode);transform:translateY(20px);opacity:0;pointer-events:none;transition:all .3s ease;border-radius:8px;background-color:var(--color-midnight-700);overflow:hidden}
.emoji-panel.show{transform:translateY(0);opacity:1;pointer-events:all}
.emoji-tab-list{position:relative;padding:8px 40px;background:var(--color-neutral-900)}
.emoji-tabbar{overflow:hidden;display:flex;flex-wrap:wrap}
.emoji-tabbar-scroll{display:flex;gap:4px;transition:transform .3s ease;padding:0 4px}
.emoji-tab-arrow{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border:none;border-radius:50%;background:var(--color-midnight-200);font-size:16px;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;transition:background .3s ease}
.emoji-tab-arrow:hover{background:var(--color-midnight-100)}
.emoji-tab-arrow:disabled{opacity:.3;cursor:not-allowed}
.left-arrow{left:6px}
.right-arrow{right:6px}
.emoji-tab{background:0 0;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;transition:background .3s ease}
.emoji-tab:hover{background:var(--color-midnight-300)}
.emoji-tab.active{background:var(--color-space-600)}
.emoji-grid{display:flex;flex-wrap:wrap;gap:8px;padding:8px;background-color:var(--color-midnight-700);border-radius:4px;max-height:300px;overflow-y:scroll}
.emoji-item{cursor:pointer;padding:4px;border-radius:4px;width:100px;background:var(--color-midnight-500);transition:all .2s}
.emoji-item:hover{transform:scale(1.05);background:var(--color-midnight-100)}
.emoji-item img{width:100%;height:auto}
.link-tooltip{position:absolute;display:none;left:0;top:0}
.link-tooltip>div{max-width:300px;border-radius:4px;padding:6px 8px;background-color:rgba(187,197,241,.95);box-shadow:rgba(0,0,0,.3) 2px 2px 10px 6px;font-size:14px;font-weight:500;line-height:19px;color:#000;user-select:none;pointer-events:none}
.link-tooltip .GuideTooltip_paragraph__18Zcq{white-space:normal;overflow-wrap:break-word}
.ic-icon-default{color:var(--color-neutral-300)}
.duplicate-marker{display:inline-flex;color:var(--color-disabled)}
.duplicate-marker i{font-size:.6em;padding-left:2px}
.chat-my .ChatMessage_clickable__58ej2{border-color:var(--color-jade-500)!important;background:var(--color-jade-600)!important}
.chatp-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;z-index:1000;opacity:0;pointer-events:none;transition:opacity .3s ease}
.chatp-overlay.active{opacity:1;pointer-events:all}
.chatp-settings-window{width:90%;max-width:800px;max-height:90vh;display:flex;flex-direction:column;transform:translateY(20px);transition:transform .3s ease;background:#2d2d2d;border:solid 2px var(--color-midnight-100);border-radius:8px;background-color:var(--color-midnight-900);box-shadow:rgba(0,0,0,.3) 2px 2px 10px 6px;color:var(--color-text-dark-mode);background-color:var(--color-midnight-700)}
.chatp-overlay.active .chatp-settings-window{transform:translateY(0)}
.chatp-header{padding:20px;border-bottom:1px solid var(--color-midnight-500);display:flex;justify-content:space-between;align-items:center}
.chatp-title{font-size:24px;font-weight:600}
.chatp-close-btn{background:0 0;border:none;height:22px;width:22px;padding:4px;cursor:pointer}
.chatp-tabs{display:flex;border-bottom:1px solid var(--color-midnight-500);padding:0 15px}
.chatp-tab{padding:12px 20px;cursor:pointer;font-weight:500;color:var(--color-space-400);border-bottom:2px solid transparent;white-space:nowrap;transition:all .2s ease}
.chatp-tab.active{color:var(--color-space-200);border-bottom-color:var(--color-space-200);font-weight:700}
.chatp-content-wrapper{flex:1;min-height:0;overflow:hidden;position:relative}
.chatp-content{position:relative;display:flex;height:auto;max-height:100%;overflow:hidden;flex-direction:column;padding:12px 20px;transition:height .2s ease}
.chatp-tab-content{display:flex;box-sizing:border-box;transition:all .2s ease-in-out;overflow:hidden;flex-direction:column;box-sizing:border-box;z-index:1}
.chatp-tab-content:not(.active){position:absolute;top:0;left:0;opacity:0;visibility:hidden;height:0}
.chatp-tab-content.active{overflow:auto}
.chatp-setting-item{margin-bottom:8px;padding-bottom:10px;border-bottom:1px solid var(--color-midnight-500)}
.chatp-setting-item:last-child{margin-bottom:0;border-bottom:none}
.chatp-setting-title{font-size:16px;font-weight:600}
.chatp-setting-subtitle{font-size:14px;color:var(--color-disabled);line-height:1.4}
.chatp-setting-controls{display:flex;flex-direction:column;gap:8px;padding:6px 0}
.chatp-checkbox-group,.chatp-radio-group{display:flex;flex-direction:column;gap:10px}
.chatp-checkbox-item{display:flex;align-items:center;gap:10px;position:relative;padding-left:30px;cursor:pointer;user-select:none}
.chatp-checkbox-item input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}
.chatp-switch{position:relative;display:inline-block;width:50px;height:24px}
.chatp-switch input{opacity:0;width:0;height:0}
.chatp-switch.small{width:40px;height:20px}
.chatp-switch.large{width:60px;height:30px}
.chatp-toggle-container{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background-color:var(--color-midnight-500);border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
.chatp-toggle-label{flex:1;margin-right:16px}
.chatp-toggle-title{font-size:16px;font-weight:500;margin-bottom:4px}
.chatp-toggle-description{font-size:12px;color:var(--color-disabled);line-height:1.4}
.chatp-toggle-switch{position:relative;display:inline-block;width:50px;height:24px;flex-shrink:0}
.chatp-toggle-switch input{opacity:0;width:0;height:0}
.chatp-toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--color-midnight-700);transition:.3s;border-radius:24px}
.chatp-toggle-slider:before{position:absolute;content:"";height:20px;width:20px;left:2px;bottom:2px;background-color:#fff;transition:.3s;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.2)}
input:checked+.chatp-toggle-slider{background-color:var(--color-space-400)}
input:checked+.chatp-toggle-slider:before{transform:translateX(26px)}
.chatp-slider-container{width:180px;flex-shrink:0;position:relative;padding-bottom:25px}
.chatp-slider{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:var(--color-midnight-700);outline:0;margin:10px 0 15px}
.chatp-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:var(--color-space-400);cursor:pointer;transition:all .2s ease;z-index:2}
.chatp-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--color-space-400);cursor:pointer;transition:all .2s ease;z-index:2}
.chatp-slider-marks{display:flex;justify-content:space-between;width:calc(100% - 18px);position:absolute;bottom:0;left:9px;pointer-events:none}
.chatp-slider-mark{position:relative;text-align:center;width:0}
.chatp-slider-mark::before{content:"";position:absolute;top:-28px;left:50%;transform:translateX(-50%);width:2px;height:10px;background-color:var(--color-text-dark-mode);transition:all .2s ease}
.chatp-slider-mark::after{content:attr(data-value);position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:12px;color:var(--color-text-dark-mode);transition:all .2s ease}
.chatp-slider-mark.active::before{background-color:var(--color-space-400);height:14px;width:3px}
.chatp-slider-mark.active::after{color:var(--color-space-400);font-weight:700;font-size:14px}
.chatp-slider-progress{position:absolute;top:25%;left:0;transform:translateY(-50%);height:6px;background-color:var(--color-space-400);border-radius:3px;z-index:1;pointer-events: none;}
input:checked+.chatp-slider{background-color:var(--color-space-400)}
input:checked+.chatp-slider:before{transform:translateX(26px)}
.chatp-radio-item{display:flex;align-items:center;gap:10px;position:relative;padding-left:30px;cursor:pointer;user-select:none}
.chatp-radio-item input{position:absolute;opacity:0;cursor:pointer}
.chatp-radio-checkmark{position:absolute;top:0;left:0;height:20px;width:20px;background-color:var(--color-midnight-900);border:2px solid var(--color-midnight-100);border-radius:50%;transition:all .2s ease}
.chatp-radio-item:hover .chatp-radio-checkmark{border-color:var(--color-neutral-500)}
.chatp-radio-item input:checked~.chatp-radio-checkmark{border-color:var(--color-space-400)}
.chatp-radio-checkmark:after{content:"";position:absolute;display:none;top:3px;left:3px;width:10px;height:10px;border-radius:50%;background:var(--color-space-400);transition:all .2s ease}
.chatp-radio-item input:checked~.chatp-radio-checkmark:after{display:block}
.chatp-radio-as-switch{display:flex;align-items:center;justify-content:space-between;width:100%}
.chatp-radio-as-switch-label{flex:1}
.chatp-input{padding:10px 12px;background-color:var(--color-midnight-900);border:1px solid var(--color-midnight-100);border-radius:6px;font-size:14px;width:100%;transition:all .2s ease}
.chatp-input:focus{outline:0;border-color:var(--color-space-400);box-shadow:0 0 0 4px rgba(13,110,253,.25)}
.chatp-toggle-container.disabled .chatp-input{cursor:not-allowed;background-color:var(--color-midnight-600);border:1px solid var(--color-midnight-300);color:var(--color-disabled)}
.chatp-preview{background:var(--color-midnight-800);margin-top:10px;padding:12px 16px;font-size:14px;line-height:20px;text-align:left;border-radius:8px}
.chatp-preview .ChatMessage_chatMessage__2wev4{white-space:unset;padding:10px 0}
.chatp-settings-window-npc{z-index:1;margin-left:-110px;position:absolute;bottom:0}
.chatp-settings-window-npc svg{width:130px;height:100px}
.chatp-settings-window-npc-name{margin:0 10px;border-radius:4px;font-size:14px;font-weight:500;background-color:var(--color-space-600);text-align:center}
.chatp-btn{padding:10px 16px;background-color:var(--color-space-500);color:var(--color-text-dark-mode);border:none;border-radius:6px;font-size:14px;cursor:pointer;transition:all .2s ease;text-decoration:none}
.chatp-btn:hover{background-color:var(--color-space-400)}
.chatp-btn.chatp-btn-close{background-color:var(--color-midnight-500);border:1px solid var(--color-midnight-200)}
.chatp-btn.chatp-btn-close:hover{background-color:var(--color-midnight-400);border:1px solid var(--color-midnight-100)}
.chatp-bottom{padding:16px 20px;border-top:1px solid var(--color-midnight-500);display:flex;justify-content:flex-end;gap:10px}
@media (max-width:768px){
.chatp-settings-window{width:100%;height:100%;max-width:100%;max-height:100%;border:0;border-radius:0}
.chatp-header{padding:15px}
.chatp-title{font-size:16px}
.chatp-tab{padding:10px 15px;font-size:14px}
.chatp-content{padding:4px 12px}
.chatp-settings-window-npc{display:none}
}
    `);
	const gamePageChatPanel = '.GamePage_chatPanel__mVaVt';
	const tabsComponent = '.TabsComponent_wrap__3fEC7';
	const chatHistorySelector = '.ChatHistory_chatHistory__1EiG3';
	const chatMessageSelector = '.ChatMessage_chatMessage__2wev4';
	const chatInputSelector = '.Chat_chatInput__16dhX';

	let inputObserver = null;
	let globalObserver;
	const handledInputs = new WeakSet();
	let isProcessing = false;
	let emojiPanel;
	let tooltip;
	let initialHeight = window.innerHeight;
	let cleanupDraggable = null;
	let chatPanelConfig;
	let chatUserNameMy = false;
	let shortcutKey = {'ctrl':false,'alt':false};
	const COMPRESSED_EMOJI_DATA = [
		["Adela", "2025/05/13", ["6822787e1f9a3", "682278801af4c", "68227876259d7","68227880e8b5b", "682278829c625", "682278b51e4ce"]],
		["Adriana", "2025/05/13", ["682278dc64bc8", "682278df2aec2", "682278df9f902","682278dec78c1", "682278e19aeef", "682278e57cc98","682278e80ef54", "68227924b3820", "682279269379c","6822792ad0801", "68227927a2726", "6822792e99f9d","6822792495782"]],
		["Aiden", "2025/05/13", ["682279ee7d34a", "682279e92545b", "682279ef77d86","682279fbc0d07", "682279e9083d6", "682279f2098d4","682279fbbcad6"]],
		["Alex", "2025/05/13", ["68227a8437342", "68227a836aedc", "68227a7e3b1e4","68227a85b5b3b", "68227a89a93e4", "68227a7e4090e","68227ac730057", "68227aca492d5", "68227ac87c6a9","68227acc230e7", "68227ad188f42", "68227ac961e61"]],
		["Angelika", "2025/05/13", ["68227b12b2d6b", "68227b08f0c8f", "68227b09592c0","68227b1146ce5", "68227b101397b", "68227b0a74f09"]],
		["Arda", "2025/05/13", ["68227b5a04178", "68227b42d179b", "68227b42dc9ee","68227b43504c5", "68227b43aa87c", "68227b4d2723d"]],
		["Aya", "2025/05/13", ["68227bae53837", "68227bb199b76", "68227baf9e9f6","68227bbe4ca1e", "68227bc80c410", "68227bae947b1","68227baf17e05", "68227bed10bad", "68227bef7fbe2","68227bf144282", "68227befad25f", "68227bf5c9372","68227bedf39e0"]],
		["Azuko", "2025/05/13", ["68227c26ec0fe", "68227c26e940c", "68227c28409ae","68227c2b464a5", "68227c309dca2", "68227c26ed151"]],
		["Barbara", "2025/05/13", ["68227c61bf4c6", "68227c6237b22", "68227c57ebdfd","68227c5d4423b", "68227c591a910", "68227c59b5200","68227c5c26676"]],
		["Bernice", "2025/05/13", ["68227ca1a7788", "68227c981d78b", "68227c9b7ac7c","68227c9886e21", "68227c9c8be28", "68227c992289b"]],
		["Bianca", "2025/05/13", ["6822858c83f7e", "6822856d2124a", "68228560c0411","6822856bed04b", "6822857080c78", "6822856132aa0"]],
		["Camilo", "2025/05/13", ["682285dda8f27", "682285ee5344b", "682285f009ce2","682285f1550dc", "682285c91b753", "682285c5e5d85","68228617e9e7c", "6822861e34e07", "6822861964d77","6822861aa750e", "6822861f903f5", "6822862391bd6"]],
		["Cathy", "2025/05/13", ["6822acb40087a", "6822acba3cd86", "6822acbceb492","6822acc0d932b", "6822acb69050b", "6822acb64842b"]],
		["Celine", "2025/05/13", ["6822acfcb9a01", "6822ad00edbae", "6822ad0279376","6822ad044678c", "6822acfcd1fdf", "6822acfd162d9"]],
		["Chiara", "2025/05/13", ["6822ad395e9e6", "6822aea264109", "6822aea5c9b49","6822ae8c74312", "6822aea71a27a", "6822aea2dc7b7","6822ae8deec53"]],
		["Chloe", "2025/05/13", ["6822aee5d8781", "6822aee543990", "6822aee6163ad","6822aef034223", "6822aee60e506", "6822aee7ee8fb"]],
		["Dailin", "2025/05/13", ["6822af2e22c67", "6822af243c5dc", "6822af2475945","6822af2701928", "6822af297f693", "6822af25ed9c9"]],
		["Daniel", "2025/05/13", ["6822af6cca77a","6822af6e3408b","6822af6964153","6822af72aaa16","6822af69c393e","6822af6cca77a"]],
		["Echion", "2025/05/13", ["6822afcab90f4","6822afcb91e5b","6822afce7977b","6822afbc30f0b","6822afcbe1d9e","6822afcab90f4"]],
		["Elena", "2025/05/13", ["6822b010afdcd","6822b009b3312","6822b00f64656","6822b010d46df","6822b009ed6fe","6822b00ba6d2a"]],
		["Eleven", "2025/05/13", ["6822b04e22136","6822b05403d3a","6822b0596558f","6822b0520afb4","6822b0520470c","6822b04e85508"]],
		["Emma", "2025/05/13", ["6822cb1434582","6822cb1577f35","6822cb0b55713","6822cb1641e76","6822cb0ca4e96","6822cb0c9bb38","6822cb18ecf07","6822cb0d58e5f","6822cb0e73a13","6822cb11e7275","6822cb13c0bcb","6822cb1ad69a6"]],
		["Ersha", "2025/05/13", ["6822cb873ce8f","6822cb86a51a4","6822cb8a2a04e","6822cb8366e28","6822cb8747d70","6822cb8466238"]],
		["Eva", "2025/05/15", ["6824e3deb52c2","6824e3f38115d","6824e3f89d882","6824e3f6976d9","6824e3dea72c1","6824e3e014ff1","6824e3f15eb6a","6824e3df8d3a1","6824e3e024a4e","6824e3e4bba98","6824e3e46dd22","6824e3e666692"]],
		["Fiora", "2025/05/20", ["682ba4c3dfc8c","682ba4c264605","682ba4ba8ed83","682ba4be50012","682ba4be61b3b","682ba4bb218e0"]],
		["Hart", "2025/05/28", ["6836442c0e499","6836441fbca9a","683644156c0e1","68364422da4ed","68364430b6374","6836441061a80","6836447ac751b","68364e66b3de4","68364e6459a56","68364e743a33f","68364e61b69f2","6836447aba8c4"]],
		["Hyejin", "2025/05/28", ["6836567f27f88","6836569d77832","6836568425ddc","6836568861fc0","6836567e29467","683656818146f","6836580bf2e51","683658096b148","683658240bf90","68365809bf649","6836580eb0e8a","6836580b4fedb"]],
		["Hyunwoo", "2025/05/28", ["683668ca34d84","683668bbd3cd9","683668cc3f9a4","683668c5bf454","683668cbcd7fb","683668c46d2ac","683669726fc6f","6836696fa29cb","6836696fa1b30","6836696fa2f6b","6836697c0f334","6836696fa3f0a"]],
	];
	function decompressEmojiData() {
		const baseUrl = "https://tupian.li/images/";
		return COMPRESSED_EMOJI_DATA.map(([name, date, files]) => ({
			name,
			list: files.map(file => `${baseUrl}${date}/${file}.png`)
		}));
	}
	const emojiData = decompressEmojiData();
	function isImageUrl(url) {// 检查链接是否是图片
		return url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
	}

	function createPreviewOverlay(imgSrc) {//创建预览
		const overlay = document.createElement('div');
		overlay.className = 'chat-img-preview';
		const previewImg = document.createElement('img');
		previewImg.src = imgSrc;
		overlay.appendChild(previewImg);
		document.body.appendChild(overlay);

		overlay.addEventListener('click', (e) => {// 点击后关闭图片预览
			if (e.target === overlay || e.target === previewImg) {
				document.body.removeChild(overlay);
			}
		});
		document.addEventListener('keydown', function handleEsc(e) {// ESC关闭图片预览
			if (e.key === 'Escape') {
				document.body.removeChild(overlay);
				document.removeEventListener('keydown', handleEsc);
			}
		});
	}
	function createPreviewableLink(url, altText,emoji) {//创建可预览的链接
		emoji = emoji || null;
		const link = document.createElement('a');
		link.href = url;
		link.target = '_blank';
		link.rel = 'noreferrer noopener nofollow';
		link.className = emoji ? 'chat-img chat-emoji' : 'chat-img';
		var img;
		if(emoji || GM_getValue('option_img',0) == 1){
			img = document.createElement('img');
			img.src = url;
			img.alt = altText;
		}else{
			img = document.createElement('span');
			img.innerHTML = GM_getValue('img_title','[图片]');
		}
		link.appendChild(img);
		link.addEventListener('click', function(e) {
			if (e.ctrlKey || e.metaKey) return; // 允许Ctrl+点击在新标签打开
			e.preventDefault();
			e.stopImmediatePropagation();
			createPreviewOverlay(url);
		});
		return link;
	}

	function replaceLinkContentWithImage(link) {//修改A标签内的图片
		const href = link.getAttribute('href');
		if (!isImageUrl(href)){//普通链接
			if (link.querySelector('.chat-link')) return;
			link.className = 'chat-link';
			link.innerHTML = GM_getValue('url_title','[网页链接]');
			link.addEventListener('mouseover', (e) => {
				tooltip.querySelector('.GuideTooltip_title__1QDN9').textContent = '网页链接';
				tooltip.querySelector('.GuideTooltip_paragraph__18Zcq').textContent = e.target.href;
				positionTooltip(e.target);
			});
			link.addEventListener('mouseout', function(){
				tooltip.style.display = 'none';
			});
			return
		}
		if (link.querySelector('.chat-img') || link.querySelector('img')) return;

		const newLink = createPreviewableLink(href, '图片预览');
		link.parentNode.replaceChild(newLink, link);
	}
	function positionTooltip(link) {
		tooltip.style.display = 'block';
		tooltip.style.left = '0';
		tooltip.style.top = '0';
		const linkRect = link.getBoundingClientRect();
		const tooltipRect = tooltip.getBoundingClientRect();
		const windowWidth = window.innerWidth;
		let left = linkRect.left + (linkRect.width - tooltipRect.width) / 2;
		let top = linkRect.top - tooltipRect.height - 5;
		if(left + tooltipRect.width > windowWidth) left = windowWidth - tooltipRect.width - 5;
		if(left < 5) left = 5;
		if(top < window.scrollY) top = linkRect.bottom + window.scrollY + 5;
		tooltip.style.left = `${left}px`;
		tooltip.style.top = `${top}px`;
	}
	function convertEmojiCodes(container) {
		const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT,{
			acceptNode: (node) => {
				if (node.parentNode.classList?.contains('processed-emoji')) {
					return NodeFilter.FILTER_REJECT;
				}
				if (chatUserNameMy && node.textContent.trim() === getChatName()) {
					const clickableElement = node.parentNode.closest(chatMessageSelector);
					if (clickableElement) {
						clickableElement.classList.add('chat-my');
					}
				}
				return /{::\d+_\d+}/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
			}
		},false);
		let node;
		while ((node = walker.nextNode())) {
			const fragment = document.createDocumentFragment();
			const parts = node.nodeValue.split(/({::\d+_\d+})/);
			parts.forEach(part => {
				if (!part) return;
				const emojiMatch = part.match(/{::(\d+)_(\d+)}/);
				if (emojiMatch) {
					const groupIndex = parseInt(emojiMatch[1]) - 1;
					const emojiIndex = parseInt(emojiMatch[2]) - 1;
					if (emojiData[groupIndex]?.list[emojiIndex]) {
						const url = emojiData[groupIndex].list[emojiIndex];
						const link = createPreviewableLink(url, `emoji:${groupIndex+1}_${emojiIndex+1}`,1);
						fragment.appendChild(link);
						return;
					}
				}
				fragment.appendChild(document.createTextNode(part));
			});
			if (node.parentNode) {
				const wrapper = document.createElement('span');
				wrapper.className = 'processed-emoji';
				wrapper.appendChild(fragment);
				node.parentNode.replaceChild(wrapper, node);
			}
		}
	}
	function getChatName(){
		const nameElement = document.querySelector('.Header_name__227rJ .CharacterName_name__1amXp');
		const name = nameElement.dataset.name;
		return name;
	}
	function processExistingMessages(container) {//聊天页面消息处理
		const messages = container.querySelectorAll(chatMessageSelector);
		messages.forEach(message => {
			processExistingMessage(message)
		});
	}
	function processExistingMessage(message) {//聊天页面消息处理
		const links = message.querySelectorAll('a');
		if(links.length){
			links.forEach(replaceLinkContentWithImage);
		}
		convertEmojiCodes(message);
	}
	function initClipboardUpload() {
		if (inputObserver && typeof inputObserver.disconnect === 'function') {
			inputObserver.disconnect();
		}
		const chatInput = document.querySelector(chatInputSelector);
		if (chatInput && !handledInputs.has(chatInput)) {
			setupPasteHandler(chatInput);
			return;
		}
		inputObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const input = node.matches(chatInputSelector) ? node : node.querySelector(chatInputSelector);
						if (input && !handledInputs.has(input)) {
							setupPasteHandler(input);
						}
					}
				});
			});
		});
		inputObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	function setupPasteHandler(inputElement) {
		handledInputs.add(inputElement);
		inputElement.removeEventListener('paste', handlePaste);
		inputElement.addEventListener('paste', handlePaste);
		let isProcessing = false;
		async function handlePaste(e) {
			if (isProcessing) {
				e.preventDefault();
				return;
			}
			isProcessing = true;
			try {
				const items = e.clipboardData.items;
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf('image') !== -1) {
						e.preventDefault();
						const blob = items[i].getAsFile();
						if (blob) await uploadAndInsertImage(blob, inputElement);
						break;
					}
				}
			} finally {
				isProcessing = false;
			}
		}
	}
	function uploadAndInsertImage(blob, inputElement) {//上传图片
		const statusDiv = document.createElement('div');
		statusDiv.className = 'upload-status';
		statusDiv.textContent = '正在上传图片...';
		document.body.appendChild(statusDiv);

		const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
		const formParts = [];

		function appendFile(name, file) {
			formParts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`);
			formParts.push(file);
			formParts.push('\r\n');
		}
		appendFile('file', blob);
		formParts.push(`--${boundary}--\r\n`);
		const bodyBlob = new Blob(formParts);

		GM_xmlhttpRequest({
			method: 'POST',
			url: 'https://tupian.li/api/v1/upload',
			data: bodyBlob,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${boundary}`,
				'Accept': 'application/json'
			},
			binary: true,
			onload: function(response) {
				statusDiv.remove();
				if (response.status === 200) {
					try {
						const result = JSON.parse(response.responseText);
						if (result.status) {
							const url = result.data.links.url;

							const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

							const currentValue = inputElement.value;
							const newValue = currentValue ? `${currentValue} ${url}` : url;

							nativeInputValueSetter.call(inputElement, newValue);
							inputElement.dispatchEvent(new Event('input', { bubbles: true }));
							inputElement.focus();

							const successDiv = document.createElement('div');
							successDiv.className = 'upload-status';
							successDiv.textContent = '上传成功！';
							document.body.appendChild(successDiv);
							setTimeout(() => successDiv.remove(), 2000);
						} else {
							throw new Error(result.message || '上传失败');
						}
					} catch (e) {
						showError('解析失败: ' + e.message);
					}
				} else {
					showError('服务器错误: ' + response.status);
				}
			},
			onerror: function(error) {
				statusDiv.remove();
				showError('上传失败: ' + error.statusText);
			}
		});

		function showError(message) {
			const errorDiv = document.createElement('div');
			errorDiv.className = 'upload-status error';
			errorDiv.textContent = message;
			document.body.appendChild(errorDiv);
			setTimeout(() => errorDiv.remove(), 3000);
			console.error(message);
		}
	}
	function insertAtCursor(inputElement, text) {//插入文本，兼容SB VUE
		const start = inputElement.selectionStart;
		const end = inputElement.selectionEnd;
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			"value"
		).set;
		nativeInputValueSetter.call(inputElement,inputElement.value.substring(0, start) + text + inputElement.value.substring(end)
		);
		const event = new Event('input', {
			bubbles: true,
			cancelable: true
		});
		inputElement.dispatchEvent(event);
		inputElement.selectionStart = inputElement.selectionEnd = start + text.length;
		inputElement.focus();
	}
	function initEmojiPanel() {
		const chatInput = document.querySelector(chatInputSelector);
		if (!chatInput || chatInput.previousElementSibling?.classList.contains('emoji-btn')) {
			return;
		}
		const emojiBtn = document.createElement('div');
		emojiBtn.className = 'emoji-btn';
		emojiBtn.innerHTML = '<svg><use href="/static/media/actions_sprite.e6388cbc.svg#cow"></use></svg>';
		chatInput.parentNode.insertBefore(emojiBtn, chatInput);

		emojiPanel = document.querySelector('.emoji-panel');
		let panelContainer;
		if (!emojiPanel){
			const panelContainer = document.createElement('div');
			panelContainer.innerHTML = createEmojiPanelHTML();
			panelContainer.className = 'emoji-panel';
			document.body.appendChild(panelContainer);
			emojiPanel = panelContainer;
			if(!emojiPanel) return;
		}else{
			panelContainer = emojiPanel;
		}
		const categoriesScroll = document.querySelector('.emoji-tabbar-scroll');
		const leftArrow = document.querySelector('.left-arrow');
		const rightArrow = document.querySelector('.right-arrow');
		let currentScroll = 0;
		function getVisibleButtonRange() {
			const container = document.querySelector('.emoji-tabbar');
			const buttons = document.querySelectorAll('.emoji-tab');
			const containerRect = container.getBoundingClientRect();
			let firstVisible = 0;
			let lastVisible = buttons.length - 1;
			for (let i = 0; i < buttons.length; i++) {
				const btnRect = buttons[i].getBoundingClientRect();
				if (btnRect.left >= containerRect.left) {
					firstVisible = i;
					break;
				}
			}
			for (let i = buttons.length - 1; i >= 0; i--) {
				const btnRect = buttons[i].getBoundingClientRect();
				if (btnRect.right <= containerRect.right) {
					lastVisible = i;
					break;
				}
			}
			return { firstVisible, lastVisible };
		}
		function getButtonsPerPage() {
			const container = document.querySelector('.emoji-tabbar');
			const buttons = document.querySelectorAll('.emoji-tab');
			if (buttons.length === 0) return 0;
			const containerWidth = container.clientWidth;
			const firstButtonWidth = buttons[0].getBoundingClientRect().width;
			return Math.floor(containerWidth / (firstButtonWidth + 4));//4 = gap:4px;
		}
		leftArrow.addEventListener('click', () => {
			const { firstVisible } = getVisibleButtonRange();
			const buttonsPerPage = getButtonsPerPage();
			const buttons = document.querySelectorAll('.emoji-tab');
			const container = document.querySelector('.emoji-tabbar');
			let targetIndex = Math.max(0, firstVisible - buttonsPerPage);
			if (targetIndex >= 0) {
				const targetBtn = buttons[targetIndex];
				const targetRect = targetBtn.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				currentScroll = Math.max(0, currentScroll - (containerRect.left - targetRect.left));
				categoriesScroll.style.transform = `translateX(-${currentScroll}px)`;
			}
			updateArrowState();
		});
		rightArrow.addEventListener('click', () => {
			const { lastVisible } = getVisibleButtonRange();
			const buttonsPerPage = getButtonsPerPage();
			const buttons = document.querySelectorAll('.emoji-tab');
			const container = document.querySelector('.emoji-tabbar');
			const scrollWidth = categoriesScroll.scrollWidth;
			let targetIndex = Math.min(buttons.length - 1, lastVisible + buttonsPerPage);
			if (targetIndex < buttons.length) {
				const targetBtn = buttons[targetIndex];
				const targetRect = targetBtn.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				currentScroll = Math.min(scrollWidth - container.clientWidth, currentScroll + (targetRect.right - containerRect.right));
				categoriesScroll.style.transform = `translateX(-${currentScroll}px)`;
			}
			updateArrowState();
		});
		function updateArrowState() {
			leftArrow.disabled = currentScroll <= 4;
			const maxScroll = categoriesScroll.scrollWidth - categoriesScroll.parentElement.clientWidth;
			rightArrow.disabled = currentScroll + 4 >= maxScroll;
		}
		let touchStartX = 0;
		let touchStartScroll = 0;
		categoriesScroll.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
			touchStartScroll = currentScroll;
		});
							
		categoriesScroll.addEventListener('touchmove', (e) => {
			const touchX = e.touches[0].clientX;
			const diff = touchStartX - touchX;
			const newScroll = touchStartScroll + diff;
			
			const maxScroll = categoriesScroll.scrollWidth - categoriesScroll.parentElement.clientWidth;
			currentScroll = Math.max(0, Math.min(maxScroll, newScroll));
			
			categoriesScroll.style.transform = `translateX(-${currentScroll}px)`;
			updateArrowState();
			e.preventDefault();
		});
		emojiBtn.addEventListener('click', (e) => {//打开表情按钮
			e.stopPropagation();
			emojiPanel.classList.toggle('show');
			const btnRect = emojiBtn.getBoundingClientRect();
			emojiPanel.style.bottom = `${window.innerHeight - btnRect.top + 3}px`;
			let left = btnRect.left;
			let width = document.querySelector('.Chat_chatInputContainer__2euR8').getBoundingClientRect().width - 4;
			if(width < 562 && window.innerWidth >= 562) width = 562;
			if(window.innerWidth < left + width) left = window.innerWidth - width;
			emojiPanel.style.left = `${left}px`;
			emojiPanel.style.width = `${width}px`
		});
		emojiPanel.querySelectorAll('.emoji-tab').forEach(tab => {
			tab.addEventListener('click', function(){
				const groupIndex = parseInt(tab.dataset.group);
				if (isNaN(groupIndex)) return;
				emojiPanel.querySelector('.emoji-content').innerHTML = createEmojiGroupHTML(groupIndex);
				emojiPanel.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
			});
		});
		if(!emojiPanel._hasEmojiListener) {//表情按钮 修复一个重复执行的BUG
			emojiPanel.addEventListener('click', (e) => {
				const emojiItem = e.target.closest('.emoji-item');
				if (!emojiItem) return;
				e.stopPropagation();
				e.stopImmediatePropagation();
				const chatInput = document.querySelector(chatInputSelector);
				if (chatInput) {
					const groupId = emojiItem.dataset.group;
					const emojiId = emojiItem.dataset.emoji;
					insertAtCursor(chatInput, `{::${groupId}_${emojiId}}`);
				}
				emojiPanel.classList.remove('show');
			});
			emojiPanel._hasEmojiListener = true;
		}
		document.addEventListener('click', (e) => {//关闭面板
			if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
				emojiPanel.classList.remove('show');
			}
		});
		return panelContainer;
	}
	function createEmojiPanelHTML() {
		return `
		<div class="emoji-content">
			${createEmojiGroupHTML(0)}
		</div>
		<div class="emoji-tab-list">
			<div class="emoji-tabbar">
				<div class="emoji-tabbar-scroll">
					${emojiData.map((group, index) => `
						<button class="emoji-tab ${index === 0 ? 'active' : ''}" data-group="${index}">
							${group.name}
						</button>
					`).join('')}
				</div>
			</div>
			<button class="emoji-tab-arrow left-arrow" disabled>‹</button>
			<button class="emoji-tab-arrow right-arrow">›</button>
		</div>
		`;
	}
	function createEmojiGroupHTML(groupIndex) {
		const group = emojiData[groupIndex];
		if (!group) return '';

		return `
		<div class="emoji-grid" data-group="${groupIndex}">
			${group.list.map((url, emojiIndex) => `
				<div class="emoji-item"
					 data-group="${groupIndex + 1}"
					 data-emoji="${emojiIndex + 1}">
					<img src="${url}" alt="{::${groupIndex + 1}_${emojiIndex + 1}}">
				</div>
			`).join('')}
		</div>
		`;
	}
	function tryAddEmojiButton() {
		const chatInput = document.querySelector(chatInputSelector);
		if (!chatInput || chatInput.previousElementSibling?.classList.contains('emoji-btn')) {
			return;
		}
		initEmojiPanel();
	}
	// ---------- 配置功能 ----------
	function showConfigDialog() {
		if (document.getElementById('chatp-overlay')) {
			toggleSettingsWindow()
			return;
		}
		let html = `
		<div class="chatp-overlay active" id="chatp-overlay">
			<div class="chatp-settings-window" id="chatp-settings-window">
				<div class="chatp-settings-window-npc">
					<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
					<div class="chatp-settings-window-npc-name">小牛紫</div>
				</div>
				<div class="chatp-header">
					<h2 class="chatp-title">设置</h2>
					<button class="chatp-close-btn">
						<svg class="Icon_icon__2LtL_"><use href="/static/media/misc_sprite.4fc0598b.svg#close_menu"></use></svg>
					</button>
				</div>
				<div class="chatp-tabs">
					<div class="chatp-tab active">基础设置</div>
					<div class="chatp-tab">预览设置</div>
					<div class="chatp-tab">屏蔽设置</div>
					<div class="chatp-tab">其他设置</div>
				</div>
				<div class="chatp-content-wrapper">
					<div class="chatp-content">
						<div class="chatp-tab-content active">
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">界面设置</h3>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">强调昵称</div>
											<div class="chatp-toggle-description">会给昵称一个明显的颜色</div>
										</div>
										<div class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-username">
											<span class="chatp-toggle-slider"></span>
										</div>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">强调自己</div>
											<div class="chatp-toggle-description">给自己一个更明显的颜色</div>
										</div>
										<div class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-my">
											<span class="chatp-toggle-slider"></span>
										</div>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">屏蔽时间</div>
											<div class="chatp-toggle-description">它不重要吧，也许</div>
										</div>
										<div class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-time">
											<span class="chatp-toggle-slider"></span>
										</div>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">强调@消息</div>
											<div class="chatp-toggle-description">再显眼一点</div>
										</div>
										<div class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-at">
											<span class="chatp-toggle-slider"></span>
										</div>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">文本大小</div>
											<div class="chatp-toggle-description">包括时间、玩家昵称</div>
										</div>
										<div class="chatp-slider-container">
											<div class="chatp-slider-progress"></div>
											<input type="range" min="0" max="3" step="1" value="0" class="chatp-slider" id="chatp-fontsize">
											<div class="chatp-slider-marks">
												<div class="chatp-slider-mark" data-value="小"></div>
												<div class="chatp-slider-mark" data-value="中"></div>
												<div class="chatp-slider-mark" data-value="大"></div>
												<div class="chatp-slider-mark" data-value="夶"></div>
											</div>
										</div>
									</label>
								</div>
							</div>
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">铁牛图标</h3>
								<span class="chatp-setting-subtitle"></span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">转换</div>
											<div class="chatp-toggle-description">将原版[IC]显示转换为图标</div>
										</div>
										<div class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-ic">
											<span class="chatp-toggle-slider"></span>
										</div>
									</label>
								</div>
							</div>
							<div class="chatp-setting-item">
								<div class="chatp-preview">
									<div class="ChatMessage_chatMessage__2wev4 preview-my chat-my">
										<span class="ChatMessage_timestamp__1iRZO">[11:45:14] </span>
										<span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2">
											<div class="CharacterName_characterName__2FqyZ" translate="no">
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#moderator"></use></svg>
												</div>
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
												</div>
												<div class="CharacterName_name__1amXp CharacterName_rainbow__1GTos" data-chatname="Stella">
													<span>Stella</span>
												</div>
											</div>
										</span>
										<span>: </span>
										<span>杀！</span>
									</div>
									<div class="ChatMessage_chatMessage__2wev4 ChatMessage_mention__1pKLW">
										<span class="ChatMessage_timestamp__1iRZO">[11:45:14] </span>
										<span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2">
											<div class="CharacterName_characterName__2FqyZ" translate="no">
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#moderator"></use></svg>
												</div>
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#ice_sorcerer"></use></svg>
												</div>
												<div class="CharacterName_name__1amXp CharacterName_fancy_blue__Vk2EJ" data-chatname="AlphB">
													<span>AlphB</span>
												</div>
												<div class="CharacterName_gameMode__2Pvw8">[IC]</div>
											</div>
										</span>
										<span>: </span>
										<span>@Stella 闪！</span>
									</div>
								</div>
							</div>
						</div>
						<div class="chatp-tab-content">
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">图片预览</h3>
								<span class="chatp-setting-subtitle">图片支持点击查看</span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">显示图片</div>
											<div class="chatp-toggle-description">图片将直接显示</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="radio" name="chatp-image" id="chatp-image" value="1">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">显示为文本</div>
											<div class="chatp-toggle-description">将显示为特定文本</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="radio" name="chatp-image" id="chatp-image-text" value="0">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<div class="chatp-toggle-container disabled" id="chatp-image-title-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">文本内容</div>
											<div class="chatp-toggle-description">用于替代图片显示</div>
										</div>
										<div class="chatp-input-container">
											<input type="text" class="chatp-input" id="chatp-image-title" value="[图片]">
										</div>
									</div>
								</div>
							</div>
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">链接转换</h3>
								<span class="chatp-setting-subtitle">将链接转换为特定文本，支持鼠标预览</span>
								<div class="chatp-setting-controls">
									<div class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">文本内容</div>
											<div class="chatp-toggle-description">用于替换原本链接</div>
										</div>
										<div class="chatp-input-container">
											<input type="text" class="chatp-input" id="chatp-url" value="[网页链接]">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="chatp-tab-content">
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">屏蔽复读机</h3>
								<span class="chatp-setting-subtitle">支持鼠标预览</span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">屏蔽复读</div>
											<div class="chatp-toggle-description">重复内容转换为(复读)</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-duplicate">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">显示字数</div>
											<div class="chatp-toggle-description">显示复读原文字数</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-duplicate-size">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">不屏蔽过短内容</div>
											<div class="chatp-toggle-description">10字以内的内容不处理</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-duplicate-num">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
								</div>
								<div class="chatp-preview">
									<div class="ChatMessage_chatMessage__2wev4 preview-my chat-my">
										<span class="ChatMessage_timestamp__1iRZO">[11:45:14] </span>
										<span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2">
											<div class="CharacterName_characterName__2FqyZ" translate="no">
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#moderator"></use></svg>
												</div>
												<div class="CharacterName_chatIcon__22lxV">
													<svg class="Icon_icon__2LtL_"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
												</div>
												<div class="CharacterName_name__1amXp CharacterName_rainbow__1GTos" data-chatname="Stella">
													<span>Stella</span>
												</div>
											</div>
										</span>
										<span>: </span>
										<span class="duplicate-marker">(复读<i>114514字</i>)</span>
									</div>
								</div>
							</div>
						</div>
						<div class="chatp-tab-content">
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">窗口化设置</h3>
								<span class="chatp-setting-subtitle">开启后可随意拖动缩放聊天窗口</span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">窗口化</div>
											<div class="chatp-toggle-description"></div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-window">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">适配插件</div>
											<div class="chatp-toggle-description">配合牛牛UI增强插件可以空出区域</div>
										</div>
										<label class="chatp-input-container">
											<a class="chatp-btn" href="https://greasyfork.org/scripts/536463" target="_blank">安装</a>
										</label>
									</label>
								</div>
							</div>
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">快捷操作</h3>
								<span class="chatp-setting-subtitle">@/私聊快捷操作</span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">快捷@</div>
											<div class="chatp-toggle-description">Ctrl(或⌘)点击昵称快速@</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-ctrl">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">快捷私聊</div>
											<div class="chatp-toggle-description">Alt点击昵称快速私聊</div>
										</div>
										<label class="chatp-toggle-switch">
											<input type="checkbox" id="chatp-alt">
											<span class="chatp-toggle-slider"></span>
										</label>
									</label>
								</div>
							</div>
							<div class="chatp-setting-item">
								<h3 class="chatp-setting-title">更多功能</h3>
								<span class="chatp-setting-subtitle"></span>
								<div class="chatp-setting-controls">
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">提示</div>
											<div class="chatp-toggle-description">部分操作需要收起并重新打开聊天窗口才会生效</div>
										</div>
									</label>
									<label class="chatp-toggle-container">
										<div class="chatp-toggle-label">
											<div class="chatp-toggle-title">建议、反馈或需求</div>
											<div class="chatp-toggle-description">可以在游戏内私聊@HouGuoYu</div>
										</div>
										<label class="chatp-input-container">
											<a class="chatp-btn" id="repost">私聊</a>
										</label>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="chatp-bottom">
					<button class="chatp-btn chatp-btn-close" id="chatp-close">关闭</button>
					<button class="chatp-btn chatp-btn-save" id="chatp-save">保存</button>
				</div>
			</div>
		</div>`
		document.body.insertAdjacentHTML('beforeend', html);
		document.getElementById('chatp-username').checked = GM_getValue('option_username',0);
		document.getElementById('chatp-time').checked = GM_getValue('option_chattime',0);
		document.getElementById('chatp-at').checked = GM_getValue('option_at',0);
		const option_my = GM_getValue('option_my',false);
		document.getElementById('chatp-my').checked = option_my;
		const fontsize = GM_getValue('option_fontsize',0);
		setSliderToMark(document.getElementById('chatp-fontsize'),fontsize);
		document.getElementById('chatp-ic').checked = GM_getValue('option_ic',0);

		const image = GM_getValue('option_img',0);
		const imageTitleContainer = document.getElementById('chatp-image-title-container');
		const imageTitle = document.getElementById('chatp-image-title');
		if(image == 1){
			document.getElementById('chatp-image').checked = true;
			imageTitleContainer.classList.add('disabled');
			imageTitle.disabled = true;
		}else{
			document.getElementById('chatp-image-text').checked = true;
			imageTitleContainer.classList.remove('disabled');
			imageTitle.disabled = false;
		}
		const image_title = GM_getValue('img_title','[图片]');
		document.getElementById('chatp-image-title').value = image_title;
		const url_title = GM_getValue('url_title','[网页链接]');
		document.getElementById('chatp-url').value = url_title;

		document.getElementById('chatp-duplicate').checked = GM_getValue('option_duplicate',false);
		document.getElementById('chatp-duplicate-size').checked = GM_getValue('option_duplicate_size',false);
		document.getElementById('chatp-duplicate-num').checked = GM_getValue('option_duplicate_check',false);
		const marker = document.querySelector('.chatp-preview .duplicate-marker');
		if(marker)  marker.innerHTML = '(复读' + (duplicateSizeStatus ? '<i>114514字</i>' : '') + ')';

		document.getElementById('chatp-window').checked = GM_getValue('option_window',false);
		document.getElementById('chatp-ctrl').checked = GM_getValue('option_ctrl',false);
		document.getElementById('chatp-alt').checked = GM_getValue('option_alt',false);
		
		const preview = document.querySelectorAll('.preview-my'); 
		preview.forEach(preview => {
			preview.classList.toggle('chat-my',option_my);
		});
		const allContents = document.querySelectorAll('.chatp-tab-content');
		const contentContainer = document.querySelector('.chatp-content');
		const height = allContents[0].scrollHeight;
		contentContainer.style.height = `${height + 24}px`;
		
		document.getElementById('chatp-save').addEventListener('click', function(){
			GM_setValue('img_title', document.getElementById('chatp-image-title').value);
			GM_setValue('url_title', document.getElementById('chatp-url').value);
			toggleSettingsWindow(true);
		});
		document.querySelectorAll('.chatp-tab').forEach((tab, index) => {
			tab.addEventListener('click', function() {
				const allTabs = document.querySelectorAll('.chatp-tab');
				const allContents = document.querySelectorAll('.chatp-tab-content');
				const contentContainer = document.querySelector('.chatp-content');
				
				if (tab.classList.contains('active')) return;
				
				allTabs.forEach(t => t.classList.remove('active'));
				allContents.forEach(c => c.classList.remove('active'));
				
				tab.classList.add('active');
				allContents[index].classList.add('active');
				allContents[index].style.overflow = 'hidden';
				const height = allContents[index].scrollHeight;
				contentContainer.style.height = `${height + 24}px`;
				setTimeout(() => {
					allContents[index].style.overflow = 'auto';
				}, 200);
			});
		});
		document.querySelector('.chatp-close-btn').addEventListener('click', function(){
			toggleSettingsWindow(true);
		});
		document.getElementById('chatp-close').addEventListener('click', function(){
			toggleSettingsWindow(true);
		});
		document.querySelector('.chatp-overlay').addEventListener('click', function(e) {
			if (e.target === this) toggleSettingsWindow(true);
		});
		document.querySelectorAll('.chatp-slider').forEach(slider => {
			slider.addEventListener('input', function(){
				updateSliderUI(this);
			});
		});

		document.getElementById('chatp-username').addEventListener('click',  function(){
			var username = document.getElementById('chatp-username').checked ? 1 : 0;
			GM_setValue('option_username', username);
			document.body.setAttribute('data-chatusername', username);
		});
		document.getElementById('chatp-my').addEventListener('click',  function(){
			var my = document.getElementById('chatp-my').checked ;
			GM_setValue('option_my', my);
			const preview = document.querySelectorAll('.preview-my'); 
			preview.forEach(preview => {
				preview.classList.toggle('chat-my',my);
			});
			chatUserNameMy = my;
		});
		document.getElementById('chatp-time').addEventListener('click',  function(){
			var chattime = document.getElementById('chatp-time').checked ? 1 : 0;
			GM_setValue('option_chattime', chattime);
			document.body.setAttribute('data-chatchattime', chattime);
		});
		document.getElementById('chatp-at').addEventListener('click',  function(){
			var at = document.getElementById('chatp-at').checked ? 1 : 0;
			GM_setValue('option_at', at);
			document.body.setAttribute('data-chatat', at);
		});
		document.getElementById('chatp-fontsize').addEventListener('input', function(){
			const font_val = this.value;
			document.body.setAttribute('data-chatfontsize', font_val);
			GM_setValue('option_fontsize', font_val);
		});
		document.getElementById('chatp-ic').addEventListener('click',  function(){
			var ic = document.getElementById('chatp-ic').checked ? 1 : 0;
			GM_setValue('option_ic', ic);
			document.body.setAttribute('data-chatic', ic);
		});
		document.querySelectorAll('input[name="chatp-image"]').forEach(radio => {
			radio.addEventListener('click',  function(){
				const image = this.value;
				GM_setValue('option_img', this.value);
				const imageTitleContainer = document.getElementById('chatp-image-title-container');
				const imageTitle = document.getElementById('chatp-image-title');
				if(image == 1){
					imageTitleContainer.classList.add('disabled');
					imageTitle.disabled = true;
				}else{
					imageTitleContainer.classList.remove('disabled');
					imageTitle.disabled = false;
				}
			});
		});

		document.getElementById('chatp-duplicate').addEventListener('click',  function(){
			var duplicate = document.getElementById('chatp-duplicate').checked;
			GM_setValue('option_duplicate', duplicate);
			duplicateStatus = duplicate;
		});
		document.getElementById('chatp-duplicate-size').addEventListener('click',  function(){
			var duplicate_size = document.getElementById('chatp-duplicate-size').checked;
			GM_setValue('option_duplicate_size', duplicate_size);
			duplicateSizeStatus = duplicate_size;
			const marker = document.querySelector('.chatp-preview .duplicate-marker');
			if(marker) marker.innerHTML = '(复读' + (duplicateSizeStatus ? '<i>114514字</i>' : '') + ')';
		});
		document.getElementById('chatp-duplicate-num').addEventListener('click',  function(){
			var duplicate_check = document.getElementById('chatp-duplicate-num').checked;
			GM_setValue('option_duplicate_check', duplicate_check);
			duplicatCheckStatus = duplicate_check;
		});

		document.getElementById('chatp-window').addEventListener('click',  function(){
			var window = document.getElementById('chatp-window').checked;
			GM_setValue('option_window', window);
			document.body.setAttribute('data-chatwindow', window ? 1 : 0);
			if(window){
				enableWindow()
			}else{
				disableWindow()
			}
			refreshAllChats();
			setTimeout(() => {
				document.querySelectorAll(chatHistorySelector).forEach(chatHistory => {
					processExistingMessages(chatHistory);
				});
				tryAddEmojiButton()
			}, 50);
		});
		document.getElementById('chatp-ctrl').addEventListener('click',  function(){
			var ctrl = document.getElementById('chatp-ctrl').checked;
			GM_setValue('option_ctrl', ctrl);
			shortcutKey.ctrl = ctrl;
		});
		document.getElementById('chatp-alt').addEventListener('click',  function(){
			var alt = document.getElementById('chatp-alt').checked;
			GM_setValue('option_alt', alt);
			shortcutKey.alt = alt;
		});
		document.getElementById('repost').addEventListener('click',  function(){
			const chatInput = document.querySelector(chatInputSelector);
			insertAtCursor(chatInput, `/w HouGuoYu  `);
			toggleSettingsWindow(true);
		});
	}
	function updateSliderUI(slider) {
		const value = parseFloat(slider.value);
		const min = parseFloat(slider.min);
		const max = parseFloat(slider.max);
		const progressBar = slider.previousElementSibling;
		const marksContainer = slider.nextElementSibling;
		const percent = (value - min) / (max - min) * 100;
		progressBar.style.width = `${percent}%`;
		const marks = Array.from(marksContainer.children);
		const step = (max - min) / (marks.length - 1);
		let activeIndex = Math.round((value - min) / step);
		activeIndex = Math.max(0, Math.min(activeIndex, marks.length - 1));
		marks.forEach((mark, index) => {
			if (index === activeIndex) {
				mark.classList.add('active');
			} else {
				mark.classList.remove('active');
			}
		});
	}
	function setSliderToMark(slider, val) {
		slider.value = val;
		updateSliderUI(slider);
		const event = new Event('change');
		slider.dispatchEvent(event);
	}
	GM_registerMenuCommand("配置", showConfigDialog);
	function toggleSettingsWindow(hide) {
		const overlay = document.getElementById('chatp-overlay');
		const settingsWindow = document.getElementById('chatp-settings-window');
		if (!hide) {
			overlay.classList.add('active');
			settingsWindow.style.display = 'flex';
		} else {
			overlay.classList.remove('active');
			setTimeout(() => {
				if (!overlay.classList.contains('active')) {
					settingsWindow.style.display = 'none';
				}
			}, 300);
		}
	}
	function chatConfigInit() {
		checkAndAddButton();
		if(!tooltip) {
			tooltip = document.createElement('div');
			tooltip.className = 'link-tooltip MuiPopper-root MuiTooltip-popper css-112l0a2';
			tooltip.innerHTML = `
				<div class="MuiTooltip-tooltipPlacementBottom css-1spb1s5">
					<div class="GuideTooltip_guideTooltipText__PhA_Q">
						<div class="GuideTooltip_title__1QDN9">提示</div>
						<div class="GuideTooltip_content__1_yqJ">
							<div class="GuideTooltip_paragraph__18Zcq">牛牛要炸了！</div>
						</div>
					</div>
				</div>
			`;
			document.body.appendChild(tooltip);
		}
		document.body.setAttribute('data-chatfontsize', GM_getValue('option_fontsize', '0'));
		document.body.setAttribute('data-chatusername', GM_getValue('option_username', '0'));
		document.body.setAttribute('data-chatchattime', GM_getValue('option_chattime', '0'));
		document.body.setAttribute('data-chatat', GM_getValue('option_at', '0'));
		document.body.setAttribute('data-chatic', GM_getValue('option_ic', '0'));
		duplicateStatus = GM_getValue('option_duplicate',false);
		duplicatCheckStatus = GM_getValue('option_duplicate_check',false);
		duplicateSizeStatus = GM_getValue('option_duplicate_size',false);
		chatUserNameMy = GM_getValue('option_my',false);
		shortcutKey.ctrl = GM_getValue('option_ctrl', false);
		shortcutKey.alt = GM_getValue('option_alt', false);
		if(GM_getValue('option_window',false)){
			enableWindow()
			document.body.setAttribute('data-chatwindow', 1);
		}else{
			disableWindow()
		}
		document.addEventListener('click', function(event) {
			const ChatMessage_name = event.target.closest('.ChatMessage_name__1W9tB');
			const expandCollapseButton = event.target.closest('.TabsComponent_expandCollapseButton__6nOWk');
			if(ChatMessage_name &&
				((shortcutKey.ctrl && (event.ctrlKey || event.metaKey)) || (shortcutKey.alt && event.altKey))&&
				event.button === 0 
			){
				event.stopImmediatePropagation();
				event.preventDefault();
		
				const CharacterName = ChatMessage_name.querySelector('.CharacterName_name__1amXp');
				const name = CharacterName ? CharacterName.getAttribute('data-name') : null;
				const chatInput = document.querySelector(chatInputSelector);
				if(name && chatInput){
					const type = event.altKey ? '/w ' : '@';
					insertAtCursor(chatInput, `${type}${name} `);
				}
			}
			if(expandCollapseButton){
				setTimeout(() => {
					document.querySelectorAll(chatHistorySelector).forEach(chatHistory => {
						processExistingMessages(chatHistory);
					});
					tryAddEmojiButton()
				}, 50);
			}
		}, true);
	}
	function createCustomButton() {
		const btn = document.createElement('div');
		btn.innerHTML = '<svg><use href="/static/media/misc_sprite.4fc0598b.svg#settings"></use></svg>';
		btn.className = 'chat-conf';
		btn.addEventListener('click', showConfigDialog);
		return btn;
	}
	function checkAndAddButton() {
		const targetElement = document.querySelector('.TabsComponent_expandCollapseButton__6nOWk');
		if (targetElement) {
			const existingButton = targetElement.previousElementSibling;
			if (!existingButton || !existingButton.classList.contains('chat-conf')) {
				const customButton = createCustomButton();
				targetElement.parentNode.insertBefore(customButton, targetElement);
				document.querySelectorAll(chatHistorySelector).forEach(chatHistory => {
					processExistingMessages(chatHistory);
				});
			}
		}
		tryAddEmojiButton()
	}
	// ---------- 复读过滤 ----------
	const duplicateProcessors = new WeakMap();
	let duplicateStatus = false;
	let duplicatCheckStatus = false;
	let duplicateSizeStatus = false;
	function refreshAllChats() {
		document.querySelectorAll(chatHistorySelector).forEach(chatHistory => {
			const processor = duplicateProcessors.get(chatHistory);
			if (processor) {
				processor.processMessages();
			}
		});
	}
	function initDuplicateCheck(){
		document.querySelectorAll(chatHistorySelector).forEach(chatHistory => {
			if (!duplicateProcessors.has(chatHistory)) {
				const processor = new DuplicateProcessor(chatHistory);
				duplicateProcessors.set(chatHistory, processor);
				processor.init();
			}
		});
		setTimeout(initDuplicateCheck, 1000);
	}
	class DuplicateProcessor {
		constructor(chatHistory) {
			this.chatHistory = chatHistory;
			this.observer = null;
			this.isProcessing = false;
		}
		init() {
			this.observer = new MutationObserver(mutations => {
				if (!duplicateStatus) return;
				if (!this.isProcessing && mutations.some(m => m.addedNodes.length > 0)) {
					this.processMessages();
				}
			});
			this.observer.observe(this.chatHistory, {
				childList: true,
				subtree: true
			});
			this.processMessages();
		}
		processMessages() {
			if (!duplicateStatus) return;
			this.isProcessing = true;
			const messages = Array.from(
				this.chatHistory.querySelectorAll(chatMessageSelector)
			);
			messages.forEach((currentMsg, currentIndex) => {
				if (currentMsg._processed) return;

				const currentKey = this.getMessageKey(currentMsg);
				if (!currentKey) return;
				const isDuplicate = messages.slice(0, currentIndex).some(prevMsg => {
					const prevKey = this.getMessageKey(prevMsg);
					return prevKey === currentKey;
				});
				if (isDuplicate) {
					this.markAsDuplicate(currentMsg);
				}
				currentMsg._processed = true;
			});
			this.isProcessing = false;
		}

		getMessageKey(msg) {
			const children = Array.from(msg.children).filter(el => el.tagName === 'SPAN').slice(2);
			if (children.length === 0) return null;
			return children.map(el => el.textContent.trim()).join('|');
		}
		markAsDuplicate(msg) {
			const children = Array.from(msg.children);
			if (children.length <= 2) return;
			if (children.slice(2).some(el => el.tagName === 'DIV')) return;
			const contentElements = children.slice(2);
			const originalContent = contentElements.map(el => el.textContent.trim()).join(' ');
			if(duplicatCheckStatus && originalContent.length <= 10) return;
			contentElements.forEach(el => el.remove());
			const marker = document.createElement('span');
			marker.className = 'duplicate-marker';
			marker.innerHTML = '(复读' + (duplicateSizeStatus ? '<i>' + originalContent.length + '字</i>' : '') + ')';
			msg.appendChild(marker);

			marker.addEventListener('mouseover', (e) => {
				tooltip.querySelector('.GuideTooltip_title__1QDN9').textContent = '原文';
				tooltip.querySelector('.GuideTooltip_paragraph__18Zcq').textContent = originalContent;
				positionTooltip(e.target);
			});
			marker.addEventListener('mouseout', function(){
				tooltip.style.display = 'none';
			});
		}
	}
	// ---------- 聊天窗口 ----------
	const defaultConfig = {
		top: 130,
		left: 240,
		width: 600,
		height: 600
	};
	function getChatPanelConfig() {
		const savedConfig = GM_getValue('chatPanel', '{}');
		return {
			...defaultConfig,
			...JSON.parse(savedConfig)
		};
	}
	function setChatPanelConfig(newConfig) {
		const currentConfig = getChatPanelConfig();
		const mergedConfig = {
			...currentConfig,
			...newConfig
		};
		GM_setValue('chatPanel', JSON.stringify(mergedConfig));
	}
	function initchatPanelDraggable(panelElement, handleElement) {
		addResizeHandle(panelElement);
		let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		chatPanelConfig = getChatPanelConfig();
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		chatPanelConfig.width = Math.min(chatPanelConfig.width, screenWidth);
		chatPanelConfig.height = Math.min(chatPanelConfig.height, screenHeight);
		chatPanelConfig.left = Math.max(0, Math.min(chatPanelConfig.left, screenWidth - chatPanelConfig.width));
		chatPanelConfig.top = Math.max(0, Math.min(chatPanelConfig.top, screenHeight - chatPanelConfig.height));
		panelElement.style.top = `${chatPanelConfig.top}px`;
		panelElement.style.left = `${chatPanelConfig.left}px`;
		panelElement.style.width = `${chatPanelConfig.width}px`;
		panelElement.style.height = `${chatPanelConfig.height}px`;
		const dragMouseDown = (e) => {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.addEventListener('mouseup', closeDragElement);
			document.addEventListener('mousemove', elementDrag);
		};

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			panelElement.style.top = (panelElement.offsetTop - pos2) + "px";
			panelElement.style.left = (panelElement.offsetLeft - pos1) + "px";
		}
		function closeDragElement() {
			document.removeEventListener('mousemove', elementDrag);
			document.removeEventListener('mouseup', closeDragElement);
			setChatPanelConfig({top:parseInt(panelElement.style.top),left:parseInt(panelElement.style.left)});
		}
		handleElement.addEventListener('mousedown', dragMouseDown);
		return function(){
			handleElement.removeEventListener('mousedown', dragMouseDown);
		};
	}
	function addResizeHandle(panelElement) {
		const existingHandle = panelElement.querySelector('.resize-handle');
		if (existingHandle) return;

		const handle = document.createElement('div');
		handle.className = 'resize-handle';
		panelElement.appendChild(handle);
		let startX, startY, startWidth, startHeight;
		handle.onmousedown = function(e) {
			e.preventDefault();
			e.stopPropagation();
			startX = e.clientX;
			startY = e.clientY;
			startWidth = panelElement.offsetWidth;
			startHeight = panelElement.offsetHeight;
			document.onmousemove = resize;
			document.onmouseup = stopResize;
		};

		function resize(e){
			const newWidth = startWidth + (e.clientX - startX);
			const newHeight = startHeight + (e.clientY - startY);
			panelElement.style.width = `${Math.max(400, newWidth)}px`;
			panelElement.style.height = `${Math.max(150, newHeight)}px`;
		}
		function stopResize(e) {
			document.onmousemove = null;
			document.onmouseup = null;
			const newWidth = startWidth + (e.clientX - startX);
			const newHeight = startHeight + (e.clientY - startY);
			setChatPanelConfig({width:newWidth,height:newHeight});
		}
	}
	function enableWindow() {
		const chatPanel = document.querySelector(gamePageChatPanel);
		const dragHandle = chatPanel?.querySelector(tabsComponent);
		if (chatPanel && dragHandle){
			if (cleanupDraggable) cleanupDraggable();
			cleanupDraggable = initchatPanelDraggable(chatPanel, dragHandle);
		}
	}
	function disableWindow() {
		if (cleanupDraggable) cleanupDraggable();
		cleanupDraggable = null;
		const chatPanel = document.querySelector(gamePageChatPanel);
		if(chatPanel){
			chatPanel.style.top = 'unset';
			chatPanel.style.left = 'unset';
			chatPanel.style.width = 'unset';
			chatPanel.style.height = 'height';
		}
	}
	// ---------- 插件，启动！ ----------
	function init() {
		const chatHistories = document.querySelectorAll(chatHistorySelector);
		if (chatHistories.length === 0) {
			setTimeout(init, 1000);
			return;
		}
		chatHistories.forEach((element) => {processExistingMessages(element)});
		if(!globalObserver){
			globalObserver = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							if(node.matches(chatMessageSelector)) processExistingMessages(node.parentNode);
						}
					});
				});
			});
		}
		if(document.readyState === 'complete') {
			chatConfigInit();
		}else{
			window.addEventListener('load', chatConfigInit);
		}
		globalObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	window.addEventListener('resize', function(){
		if (window.innerHeight > initialHeight) {
			tooltip.style.display = 'none';
		}
	});
	if (window.ReactRouter) {
		window.ReactRouter.useEffect(function(){
			chatConfigInit();
		}, [window.location.pathname]);
	}
	const spaContentObserver = new MutationObserver(function(){
		if (!document.querySelector('.chat-conf')) {
			chatConfigInit();
		}
	});
	spaContentObserver.observe(document.getElementById('root'), { childList: true, subtree: true });
	init();
	initClipboardUpload();
	initDuplicateCheck();
})();