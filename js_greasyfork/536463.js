// ==UserScript==
// @name         牛牛UI增强插件
// @namespace    https://www.milkywayidle.com/
// @version      0.1.7
// @description  可以调整优化一些界面，可以配合聊天增强插件使用
// @author       HouGuoYu
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://www.milkywayidle.com/favicon.svg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536463/%E7%89%9B%E7%89%9BUI%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/536463/%E7%89%9B%E7%89%9BUI%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

	GM_addStyle(`
@media (min-width: 768px) {
body[data-nav="1"] .NavigationBar_navigationLinks__1XSSb{display:grid;margin:0 0 8px;padding-top:2px;grid-gap:4px;justify-content:center;grid-template-columns:repeat(auto-fill,74px);overflow:visible!important}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA{position:relative;display:flex;flex-direction:column;border-radius:4px;background-color:var(--color-midnight-500);margin-bottom:0!important;overflow:hidden;transition:all .3s}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS{background-color:var(--color-orange-700)!important;box-shadow:0 0 0 2px var(--color-orange-300)}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .NavigationBar_label__1uH-y{color:var(--color-orange-200);font-size:16px;font-weight:700}
body[data-nav="1"] .NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .NavigationBar_currentExperience__3GDeX{background-color:var(--color-orange-400)!important}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA:nth-child(15){grid-column: span 3;}
body[data-nav="1"] .NavigationBar_toggleContainer__2Gsp3{width:46px!important;height:46px!important;left:auto!important;right:6px;top:6px;z-index:11}
body[data-nav="1"] .NavigationBar_toggleContainer__2Gsp3 svg{position:relative;width:0;padding:20px}
body[data-nav="1"] .NavigationBar_toggleContainer__2Gsp3:after{content:'';position:absolute;left:0;top:0;right:0;bottom:0;display:block;border-radius:100px;background-color:var(--color-midnight-300);pointer-events:none;margin:4px;border:2px solid var(--color-midnight-100);transition:all .3s}
body[data-nav="1"] .NavigationBar_toggleContainer__2Gsp3:hover:after{background-color:var(--color-burble-500);border-color:var(--color-burble-400)}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA:nth-child(15) .NavigationBar_subSkills__37qWb{margin:0 6px 6px;display:grid;grid-template-columns:repeat(3,auto);grid-gap:4px;background:var(--color-midnight-700);padding:3px;border-radius:4px 0 4px 4px}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA:nth-child(15) .NavigationBar_subSkills__37qWb:empty{padding:0 3px}
body[data-nav="1"] .NavigationBar_subSkills__37qWb>div{border-radius:4px;background-color:var(--color-midnight-100)}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA:nth-child(15)>.NavigationBar_nav__3uuUl{padding:0!important;flex-direction:column;overflow:hidden;height:50px}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA:nth-child(15)>.NavigationBar_nav__3uuUl>svg{width:50%!important;height:150%!important}
body[data-nav="1"] .NavigationBar_nav__3uuUl{padding:0 0 4px!important;flex-direction:column;overflow:hidden;height:50px}
body[data-nav="1"] .NavigationBar_active__3R-QS .NavigationBar_nav__3uuUl>svg{opacity:.5}
body[data-nav="1"] .NavigationBar_nav__3uuUl>svg{position:absolute;left:-10px!important;top:-10px!important;width:100%!important;height:100%!important;z-index:1;opacity:.4}
body[data-nav="1"] .NavigationBar_contentContainer__1x6WS{width:100%;align-items:center;z-index:10}
body[data-nav="1"] .NavigationBar_textContainer__7TdaI{padding-top:20px;color:var(--color-text-dark-mode)}
body[data-nav="1"] .NavigationBar_experienceBar__2fo3Q{margin:0 10px;display:block;background:var(--color-midnight-900)!important;width:80%!important;border-radius:10px;overflow:hidden}
body[data-nav="1"] .NavigationBar_badges__3D2s5{position:absolute;right:16px;top:6px}
body[data-nav="1"] .NavigationBar_badge__3I_xZ{margin-right:-10px}
body[data-nav="1"] .NavigationBar_level__3C7eR{position:absolute!important;background:var(--color-jade-500);left:0;top:0;border-bottom-right-radius:4px;width:28px!important;text-align:center!important;display:block;color:var(--color-background-game)}
body[data-nav="1"] .NavigationBar_boost__2YbEa{background:var(--color-orange-400);color:var(--color-background-game)!important;margin-left:2px;padding:0 2px;border-bottom-right-radius:4px}
body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7{margin:0 0 8px!important;display:grid!important;grid-template-columns:repeat(3,auto);grid-column:span 3;grid-gap:4px!important}
body[data-nav="1"] .NavigationBar_minorNavigationLink__31K7Y{position:relative;line-height:14px!important;flex-direction:column;border-radius:4px;gap:2px!important;margin:0!important;min-width:0;min-height:50px;text-align:center;justify-content:center;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game);color:var(--color-text-dark-mode)!important}
body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(1){background-color:var(--color-scarlet-800)!important}
body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(1):hover{background-color:var(--color-scarlet-600)!important}
body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(2){background-color:var(--color-space-700)!important}
body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(2):hover{background-color:var(--color-space-500)!important}
body[data-nav="1"] .NavigationBar_minorNavigationLink__31K7Y .NavigationBar_contentContainer__1x6WS{display:block!important;text-align:center}
body[data-nav="1"] .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(2){grid-column:1/-1}
body[data-nav="1"] .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(1){grid-column:1/-1;display:flex;flex-direction:row;justify-content:center}
body[data-nav="1"] .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(1) .NavigationBar_contentContainer__1x6WS{flex-grow:inherit!important;width:auto!important}
body[data-nav="1"] .HousePanel_housePanel__lpphK .HousePanel_houseRooms__3K61R{grid-template-columns:repeat(auto-fill,80px)}
body[data-nav="1"] .HousePanel_housePanel__lpphK .HousePanel_houseRooms__3K61R .HousePanel_houseRoom__nOmpF{width:80px;height:60px;overflow:hidden}
body[data-nav="1"] .HousePanel_iconContainer__3qSC1{overflow:hidden;height:100%!important;width:100%;top:0!important;left:0;right:0;bottom:0}
body[data-nav="1"] .HousePanel_iconContainer__3qSC1>svg{position:absolute;left:-10px!important;top:-10px!important;width:100%!important;height:100%!important;z-index:1;opacity:.4}
body[data-nav="1"] .HousePanel_name__1SBye{z-index:2;padding-top:20px;color:var(--color-text-dark-mode)}
body[data-nav="1"] .HousePanel_level__2UlEu{z-index:2;position:absolute!important;background:var(--color-ocean-400);left:0;top:0;border-bottom-right-radius:4px;padding:0 2px;color:var(--color-background-game)}
body[data-nav="1"] .HousePanel_name__1SBye,body[data-nav="1"] .NavigationBar_textContainer__7TdaI .NavigationBar_label__1uH-y{width:auto!important;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
body[data-nav="1"] .insertedSpan{position:absolute;bottom:-2px;left:0;right:0;width:100%;z-index:10;text-align:center;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
body[data-nav="1"] .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .insertedSpan{color:var(--color-scarlet-100)!important}
body[data-nav="1"] .muip-conf svg{width:50%!important;height:150%!important}
}
@media (max-width: 768px) {
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLinks__1XSSb{display:grid;margin:0 0 8px;padding-top:2px;grid-gap:4px;justify-content:center;grid-template-columns:repeat(auto-fill,74px);overflow:visible!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA{position:relative;display:flex;flex-direction:column;border-radius:4px;background-color:var(--color-midnight-500);margin-bottom:0!important;overflow:hidden;transition:all .3s}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS{background-color:var(--color-orange-700)!important;box-shadow:0 0 0 2px var(--color-orange-300)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .NavigationBar_label__1uH-y{color:var(--color-orange-200);font-size:16px;font-weight:700}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .NavigationBar_currentExperience__3GDeX{background-color:var(--color-orange-400)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA:nth-child(15){grid-column: span 3;}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_toggleContainer__2Gsp3{width:46px!important;height:46px!important;left:auto!important;right:6px;top:6px;z-index:11}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_toggleContainer__2Gsp3 svg{position:relative;width:0;padding:20px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_toggleContainer__2Gsp3:after{content:'';position:absolute;left:0;top:0;right:0;bottom:0;display:block;border-radius:100px;background-color:var(--color-midnight-300);pointer-events:none;margin:4px;border:2px solid var(--color-midnight-100);transition:all .3s}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_toggleContainer__2Gsp3:hover:after{background-color:var(--color-burble-500);border-color:var(--color-burble-400)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA:nth-child(15) .NavigationBar_subSkills__37qWb{margin:0 6px 6px;display:grid;grid-template-columns:repeat(3,auto);grid-gap:4px;background:var(--color-midnight-700);padding:3px;border-radius:4px 0 4px 4px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA:nth-child(15) .NavigationBar_subSkills__37qWb:empty{padding:0 3px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_subSkills__37qWb>div{border-radius:4px;background-color:var(--color-midnight-100)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA:nth-child(15)>.NavigationBar_nav__3uuUl{padding:0!important;flex-direction:column;overflow:hidden;height:50px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA:nth-child(15)>.NavigationBar_nav__3uuUl>svg{width:50%!important;height:150%!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_nav__3uuUl{padding:0 0 4px!important;flex-direction:column;overflow:hidden;height:50px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_active__3R-QS .NavigationBar_nav__3uuUl>svg{opacity:.5}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_nav__3uuUl>svg{position:absolute;left:-10px!important;top:-10px!important;width:100%!important;height:100%!important;z-index:1;opacity:.4}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_contentContainer__1x6WS{width:100%;align-items:center;z-index:10}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_textContainer__7TdaI{padding-top:20px;color:var(--color-text-dark-mode)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_experienceBar__2fo3Q{margin:0 10px;display:block;background:var(--color-midnight-900)!important;width:80%!important;border-radius:10px;overflow:hidden}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_badges__3D2s5{position:absolute;right:16px;top:6px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_badge__3I_xZ{margin-right:-10px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_level__3C7eR{position:absolute!important;background:var(--color-jade-500);left:0;top:0;border-bottom-right-radius:4px;width:28px!important;text-align:center!important;display:block;color:var(--color-background-game)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_boost__2YbEa{background:var(--color-orange-400);color:var(--color-background-game)!important;margin-left:2px;padding:0 2px;border-bottom-right-radius:4px}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7{margin:0 0 8px!important;display:grid!important;grid-template-columns:repeat(3,auto);grid-column:span 3;grid-gap:4px!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLink__31K7Y{position:relative;line-height:14px!important;flex-direction:column;border-radius:4px;gap:2px!important;margin:0!important;min-width:0;min-height:50px;text-align:center;justify-content:center;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game);color:var(--color-text-dark-mode)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(1),body[data-nav="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(2){display:flex!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(1){background-color:var(--color-scarlet-800)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(1):hover{background-color:var(--color-scarlet-600)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(2){background-color:var(--color-space-700)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(2):hover{background-color:var(--color-space-500)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLink__31K7Y .NavigationBar_contentContainer__1x6WS{display:block!important;text-align:center}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(2){grid-column:1/-1}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(1){grid-column:1/-1;display:flex;flex-direction:row;justify-content:center}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_minorNavigationLink__31K7Y:nth-last-child(1) .NavigationBar_contentContainer__1x6WS{flex-grow:inherit!important;width:auto!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_housePanel__lpphK .HousePanel_houseRooms__3K61R{grid-template-columns:repeat(auto-fill,80px)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_housePanel__lpphK .HousePanel_houseRooms__3K61R .HousePanel_houseRoom__nOmpF{width:80px;height:60px;overflow:hidden}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_iconContainer__3qSC1{overflow:hidden;height:100%!important;width:100%;top:0!important;left:0;right:0;bottom:0}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_iconContainer__3qSC1>svg{position:absolute;left:-10px!important;top:-10px!important;width:100%!important;height:100%!important;z-index:1;opacity:.4}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_name__1SBye{z-index:2;padding-top:20px;color:var(--color-text-dark-mode)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_level__2UlEu{z-index:2;position:absolute!important;background:var(--color-ocean-400);left:0;top:0;border-bottom-right-radius:4px;padding:0 2px;color:var(--color-background-game)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .HousePanel_name__1SBye,body[data-nav="1"] .NavigationBar_textContainer__7TdaI .NavigationBar_label__1uH-y{width:auto!important;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .insertedSpan{position:absolute;bottom:-2px;left:0;right:0;width:100%;z-index:10;text-align:center;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
body[data-nav="1"] .NavigationBar_expanded__32lcV .NavigationBar_navigationLink__3eAHA.NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .insertedSpan{color:var(--color-scarlet-100)!important}
body[data-nav="1"] .NavigationBar_expanded__32lcV .muip-conf svg{width:50%!important;height:150%!important}
}
body[data-navh="1"] .NavigationBar_minorNavigationLinks__dbxh7>div:nth-last-child(-n+11):not(:nth-last-child(2)):not([style]){display:none!important}
body[data-nav2="1"] .TabsComponent_tabsComponent__3PqGp.TabsComponent_vertical__2cPB7{display:flex;flex-direction:column}
body[data-nav2="1"] .TabsComponent_tabsComponent__3PqGp.TabsComponent_vertical__2cPB7 .TabsComponent_tabsContainer__3BDUp{border:0}
body[data-nav2="1"] .TabsComponent_tabPanelsContainer__26mzo{width:auto!important}
body[data-nav2="1"] .css-k008qs{display:flex;gap:8px;flex-direction:row}
body[data-nav2="1"] .css-k008qs button{padding:0 10px!important;border-radius:4px 4px 0 0!important}
body[data-nav2="1"] .css-j7qwjs{display:grid;grid-template-columns:repeat(auto-fill,80px);gap:8px}
body[data-nav2="1"] .css-j7qwjs button{width:auto!important;border-radius:4px!important;background:var(--color-midnight-500)}
body[data-nav2="1"] .MuiBadge-root.TabsComponent_badge__1Du26.css-1rzb3uu{position:relative;text-align:center!important;justify-content:center!important}
body[data-quest="1"] .TasksPanel_unreadTasks__sVdle{position:relative}
body[data-quest="1"] .RandomTask_randomTask__3B9fA,body[data-quest="1"] .TasksPanel_purplesGift__DMW4u{position:relative;border-radius:8px;z-index:10;min-height:150px;overflow:hidden}
body[data-quest="1"] .NavigationBar_badges__3D2s5{z-index:2}
body[data-quest="1"] .RandomTask_progressBar__VLCZF,body[data-quest="1"] .TasksPanel_progressBar__2Vjlv{position:absolute;z-index:3;height:100%!important;background-color:var(--color-midnight-100)!important;border-radius:8px;overflow:hidden}
body[data-quest="1"] .RandomTask_content__VVQva,body[data-quest="1"] .TasksPanel_content__E18VE{position:relative;background-color:rgba(32,33,47,.6);overflow:hidden!important;margin:4px;border-radius:5px;z-index:9!important}
body[data-quest="1"] .RandomTask_taskInfo__1uasf{flex-direction:row!important;align-items:center;justify-content:space-between;z-index:3;color:var(--color-ocean-100);font-size:16px;margin-bottom:46px;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
body[data-quest="1"] .RandomTask_rewards__YZk7D{font-size:0;gap:0!important;position:absolute;top:50px}
body[data-quest="1"] .RandomTask_rewards__YZk7D .Item_small__1HxwE{position:relative;display:flex;align-items:center;width:100%!important;height:32px!important;font-size:26px;background:var(--color-orange-400)!important;color:var(--color-orange-800);padding:6px;border-radius:6px 0 0 6px;overflow:visible;z-index:10}
body[data-quest="1"] .RandomTask_rewards__YZk7D>div:nth-child(1) .Item_small__1HxwE{padding-right:16px}
body[data-quest="1"] .RandomTask_rewards__YZk7D>div:nth-child(2) .Item_small__1HxwE{border-radius:0 6px 6px 0!important;background:var(--color-burble-350)!important;color:var(--color-midnight-900)}
body[data-quest="1"] .RandomTask_rewards__YZk7D>div:nth-child(2) .Item_small__1HxwE:after{content:'';display:block;position:absolute;border:10px solid var(--color-burble-350);left:-20px;top:0;border-left-color:transparent;border-bottom-color:transparent;height:100%;border-bottom-width:16px;border-top-width:16px;z-index:11}
body[data-quest="1"] .RandomTask_rewards__YZk7D .Item_iconContainer__5z7j4{display:none}
body[data-quest="1"] .RandomTask_rewards__YZk7D .Item_count__1HVvv{text-shadow:none!important}
body[data-quest="1"] .RandomTask_rewards__YZk7D>div:nth-child(1) .Item_count__1HVvv{font-size:16px}
body[data-quest="1"] .RandomTask_name__1hl1b{font-size:22px}
body[data-quest="1"] .RandomTask_randomTask__3B9fA .RandomTask_name__1hl1b>svg{position:absolute;right:-10%!important;top:-30%!important;width:50%!important;height:150%!important;z-index:2;opacity:.3}
body[data-quest="1"] .RandomTask_completed__3bAce,body[data-quest="1"] .TasksPanel_completed__qMba6{transition:all .3s}
body[data-quest="1"] .RandomTask_buttonsContainer__32ypF,body[data-quest="1"] .TasksPanel_content__E18VE{z-index:5}
body[data-quest="1"] #DungeonIcon,body[data-quest="1"] #MonsterIcon{z-index:8;opacity:.6!important}
body[data-quest="1"] #MonsterIcon{right:-50%;left:0!important;width:auto!important;margin:4px 0;height:142px!important}
body[data-quest="1"] #DungeonIcon{right:150px;left:auto!important;background:var(--color-midnight-900);border-radius:50%;width:60px!important;height:60px!important;bottom:8px;overflow:hidden;border:2px solid var(--color-coral-300)}
body[data-quest="1"] #DungeonIcon:nth-last-child(2){bottom:72px}
body[data-quest="1"] .RandomTask_randomTask__3B9fA:has(#DungeonIcon) .RandomTask_name__1hl1b svg,body[data-quest="1"] .RandomTask_randomTask__3B9fA:has(#MonsterIcon) .RandomTask_name__1hl1b svg{display:none}
body[data-quest="1"] .RandomTask_action__3eC6o>div{position:absolute;right:0;top:40px;z-index:6;background-color:rgba(69,71,113,.5);border-radius:4px 0 0 4px;padding:4px 6px}
body[data-quest="1"] .RandomTask_action__3eC6o>div:nth-child(3){top:66px}
body[data-quest="1"] .RandomTask_name__1hl1b{position:unset!important;background:0 0!important;padding:0!important}
body[data-quest="1"] .RandomTask_randomTask__3B9fA{position:relative;overflow:hidden;transform-style:preserve-3d;transition:transform .15s cubic-bezier(.18,.89,.32,1.28),box-shadow .3s ease;box-shadow:0 4px 8px rgba(0,0,0,.2);cursor:pointer;will-change:transform;backface-visibility:hidden;transform:translate3d(0,0,0)}
body[data-quest="1"] .RandomTask_randomTask__3B9fA>*{transform:translate3d(0,0,0)}
body[data-enhancement="1"] .enhancementLevel_1,body[data-enhancement="1"] .enhancementLevel_2,body[data-enhancement="1"] .enhancementLevel_3,body[data-enhancement="1"] .enhancementLevel_4{color:var(--color-neutral-200)!important}
body[data-enhancement="1"] .enhancementLevel_5,body[data-enhancement="1"] .enhancementLevel_6,body[data-enhancement="1"] .enhancementLevel_7{color:var(--color-ocean-300)!important}
body[data-enhancement="1"] .enhancementLevel_10,body[data-enhancement="1"] .enhancementLevel_8,body[data-enhancement="1"] .enhancementLevel_9{color:#c98cff!important}
body[data-enhancement="1"] .enhancementLevel_11,body[data-enhancement="1"] .enhancementLevel_12,body[data-enhancement="1"] .enhancementLevel_13,body[data-enhancement="1"] .enhancementLevel_14{color:var(--color-orange-500)!important}
body[data-enhancement="1"] .enhancementLevel_15,body[data-enhancement="1"] .enhancementLevel_16,body[data-enhancement="1"] .enhancementLevel_17,body[data-enhancement="1"] .enhancementLevel_18,body[data-enhancement="1"] .enhancementLevel_19{color:#ff0097!important}
body[data-enhancement="1"] .enhancementLevel_20{position:relative;--gradient-angle:0deg;background:linear-gradient(var(--gradient-angle),var(--color-burble-300) 10%,var(--color-space-400) 25%,var(--color-ocean-400) 50%,var(--color-jade-500) 75%,var(--color-orange-300) 87%,var(--color-coral-500));-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;font-weight:700;text-shadow:0 0 5px var(--color-neutral-0-opacity-25)!important;animation:rotateGradient 3s linear infinite}
@keyframes rotateGradient{to{--gradient-angle:360deg}}
@property --gradient-angle{syntax:"<angle>";inherits:false;initial-value:0deg}
body[data-dictionary="1"] .Modal_modal__1Jiep{border-radius:8px!important;background-color:var(--color-midnight-500)!important;font-size:16px!important;line-height:18px;box-shadow:none!important;border:2px solid var(--color-space-300)!important;overflow:auto!important}
body[data-dictionary="1"] .ItemDictionary_infoColumn__379V5{display:flex;max-width:unset!important;background-color:var(--color-midnight-600);border-radius:6px;padding:10px}
body[data-dictionary="1"] .ItemDictionary_info__DberD{overflow:auto!important}
body[data-padding="1"] .GamePage_gamePage__ixiPl{padding-left:var(--padding)}
body[data-padding="2"] .GamePage_characterManagementPanel__3OYQL{margin-left:var(--padding)}
body[data-padding="3"] .GamePage_gamePage__ixiPl{padding-right:var(--padding)}
body[data-price="1"] .MarketplacePanel_price__hIzrY span{color:var(--color-orange-400)!important}
body[data-price="1"] .MarketplacePanel_price__hIzrY span.price_k{color:var(--color-orange-200)!important}
body[data-price="1"] .MarketplacePanel_price__hIzrY span.price_m{color:var(--color-jade-300)!important}
body[data-price="1"] .MarketplacePanel_price__hIzrY span.price_b{color:var(--color-ocean-300)!important}
.EquipmentPanel_equipmentPanel__29pDG .EquipmentPanel_playerModel__3LRB6,.SharableProfile_modalContainer__6Q2JL .SharableProfile_modal__2OmCQ .SharableProfile_modalContent__284HM .SharableProfile_tabsComponentContainer__2T8DG .SharableProfile_equipmentTab__20Oop .SharableProfile_playerModel__o34sV,.LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_equipment__a8U9H .LoadoutsPanel_playerModel__k_nnW{grid-template-columns:repeat(5,var(--iconsize))}
.Inventory_inventory__17CH2 .Inventory_itemGrid__20YAH,.ItemSelector_menu__12sEM .ItemSelector_itemList__Qa5lq,.ItemSelector_menu__12sEM .ItemSelector_itemList__Qa5lq.ItemSelector_wider__356rn,.LootLogPanel_lootLogPanel__2013X .LootLogPanel_actionLoots__3oTid .LootLogPanel_actionLoot__32gl_ .LootLogPanel_itemDrops__2h0ov,.MarketplacePanel_marketplacePanel__21b7o .MarketplacePanel_marketListings__1GCyQ .MarketplacePanel_itemSelection__3jDb- .MarketplacePanel_marketItems__D4k7e{grid-template-columns:repeat(auto-fill,var(--iconsize));justify-content:start;padding:2px}
.ItemSelector_itemSelector__2eTV6 .ItemSelector_itemContainer__3olqe,.ItemSelector_menu__12sEM .ItemSelector_itemList__Qa5lq .ItemSelector_removeButton__3i8Lj,.SharableProfile_modalContainer__6Q2JL .SharableProfile_modal__2OmCQ .SharableProfile_modalContent__284HM .SharableProfile_tabsComponentContainer__2T8DG .SharableProfile_equipmentTab__20Oop .SharableProfile_playerModel__o34sV .SharableProfile_equipmentSlot__kOrug,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_alchemyComponent__1J55d .SkillActionDetail_inputs__2tnEq .SkillActionDetail_catalystItemInputContainer__5zmou .SkillActionDetail_itemContainer__2TT5f,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_alchemyComponent__1J55d .SkillActionDetail_inputs__2tnEq .SkillActionDetail_protectionItemInputContainer__35ChM .SkillActionDetail_itemContainer__2TT5f,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_enhancingComponent__17bOx .SkillActionDetail_inputs__2tnEq .SkillActionDetail_catalystItemInputContainer__5zmou .SkillActionDetail_itemContainer__2TT5f,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_enhancingComponent__17bOx .SkillActionDetail_inputs__2tnEq .SkillActionDetail_protectionItemInputContainer__35ChM .SkillActionDetail_itemContainer__2TT5f,.LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_abilities__3A0I4 .LoadoutsPanel_slot__2k8_W, .LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_consumables__2u-5q .LoadoutsPanel_slot__2k8_W, .LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_equipment__a8U9H .LoadoutsPanel_slot__2k8_W{width:var(--iconsize);height:var(--iconsize)}
.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_alchemyComponent__1J55d .SkillActionDetail_inputs__2tnEq .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .SkillActionDetail_input__1G-kE,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_alchemyComponent__1J55d .SkillActionDetail_inputs__2tnEq .SkillActionDetail_protectionMinLevelInputContainer__1HSzb .SkillActionDetail_input__1G-kE,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_enhancingComponent__17bOx .SkillActionDetail_inputs__2tnEq .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .SkillActionDetail_input__1G-kE,.SkillActionDetail_skillActionDetail__1jHU4 .SkillActionDetail_enhancingComponent__17bOx .SkillActionDetail_inputs__2tnEq .SkillActionDetail_protectionMinLevelInputContainer__1HSzb .SkillActionDetail_input__1G-kE{width:var(--iconsize)}
.Item_itemContainer__x7kH1 .Item_item__2De2O{width:var(--iconsize);height:var(--iconsize);grid-template-columns:var(--iconsize);grid-template-rows:var(--iconsize)}
.Inventory_inventory__17CH2 .Inventory_modalContent__3ObSx .Inventory_gainedItems___e9t9,.LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_abilities__3A0I4, .LoadoutsPanel_loadoutsPanel__Gc5VA .LoadoutsPanel_selectedLoadout__1ozGd .LoadoutsPanel_details__3uO1G .LoadoutsPanel_setup__3mazG .LoadoutsPanel_consumables__2u-5q{grid-template-columns:repeat(auto-fill,var(--iconsize))}
.MarketplacePanel_marketplacePanel__21b7o .MarketplacePanel_marketListings__1GCyQ .MarketplacePanel_infoContainer__2mCnh{z-index:2}
.Item_itemContainer__x7kH1{font-size:var(--icon_fontsize)}
.SkillAction_skillAction__1esCp{width:var(--actionsize);height:var(--actionsize);grid-template-columns:var(--actionsize);grid-template-rows:var(--actionsize)}
.SkillActionGrid_skillActionGrid__1tJFk{grid-template-columns:repeat(auto-fill,var(--actionsize))}
.SkillAction_skillAction__1esCp .SkillAction_name__2VPXa{font-size:var(--action_fontsize)}
.Item_itemContainer__x7kH1.favorit{box-shadow:0 0 0 2px var(--color-orange-300);border-radius:4px}
.Item_itemContainer__x7kH1.favorit .Item_item__2De2O{background:var(--color-orange-800)}
.Item_itemContainer__x7kH1.favorit .Item_item__2De2O:hover{background:var(--color-orange-700)}
.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy .Header_quest__2BHC- .Header_task__31FqV{position:relative;border:2px solid var(--color-midnight-100);background-color:var(--color-midnight-500);margin:0 0 -4px -44px;padding:6px 4px 4px 48px;transition:all .2s;height:50px}
@media only screen and (max-width:768px){.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy .Header_quest__2BHC- .Header_task__31FqV{padding:6px;margin:0}}
.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy:hover .Header_quest__2BHC- .Header_task__31FqV{background-color:var(--color-midnight-300);border-color:var(--color-space-300)}
.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy .Header_quest__2BHC- .Header_task__31FqV .Header_action__2yefD{grid-gap:0;gap:0}
.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy .Header_quest__2BHC- .Header_task__31FqV .Header_action__2yefD .Header_skillIconContainer__2L6b2{width:0;background:0 0}
.Header_header__1DxsV .Header_rightHeader__8LPWK .Header_questInfo__3psCy .Header_quest__2BHC- .Header_task__31FqV svg{position:absolute;right:-8px!important;top:2px!important;width:66px!important;height:66px!important;z-index:1;opacity:.8}
.muip-conf{grid-column:span 3}
.muip-config{z-index:1000;position:absolute;top:0;left:0;height:100%;width:100%;color:var(--color-text-dark-mode);display:flex;justify-content:center;align-items:center}
.muip-mask{position:absolute;height:100%;width:100%;background-color:var(--color-midnight-800);opacity:.8}
.muip-window{position:absolute;display:flex;max-height:100%;max-width:100%;transform: scale(0);transform-origin:top left;opacity:0;transition:transform .3s ease-in-out,opacity .3s ease-in-out}
.muip-window.open{transform:scale(1);opacity:1}
.muip-window-npc{z-index:1;margin-left:-110px;position:absolute;bottom:0}
@media (max-width:800px){.muip-window-npc{display:none}}
.muip-window-npc svg{width:130px;height:100px}
.muip-window-npc-name{margin:0 10px;border-radius:4px;font-size:14px;font-weight:500;background-color:var(--color-space-600);text-align:center}
.muip-window-content{width:800px;min-height:100px;font-weight:400;overflow:auto;display:flex;flex-direction:column;font-size:16px;line-height:18px;background:#2d2d2d;border:solid 2px var(--color-midnight-700);border-radius:4px;padding:12px;background-color:var(--color-midnight-900);box-shadow:rgba(0,0,0,.3) 2px 2px 10px 6px;color:var(--color-text-dark-mode)}
.muip-title{display:flex;justify-content:center;align-items:flex-end;gap:8px;font-size:18px;font-weight:600;text-align:center}
.muip-close{background:0 0;border:none;position:absolute;top:12px;right:12px;height:18px;width:22px;padding:4px;cursor:pointer}
.muip-bottom{display:flex;justify-content:space-between;align-items:center}
.muip-tip{color:var(--color-success);font-size:14px;padding:6px}
#muipSave{border-radius:4px;width:-moz-fit-content;width:fit-content;min-width:50px;border:none;font-family:Roboto;font-weight:600;text-align:center;overflow:hidden;cursor:pointer;display:flex;align-items:center;justify-content:center;background-color:var(--color-success);color:#000;height:36px;padding:0 10px;font-size:14px;line-height:15px;align-self:flex-end}
#muipSave:hover{background-color:var(--color-success-hover)}
.muip-main{display:flex;flex-direction: column;margin:12px 0;overflow:auto}
.muip-tab{display:flex;gap:4px;flex-direction:row;flex-wrap:wrap;padding:0 10px}
.muip-tab-item{position:relative;border-radius:4px 4px 0 0;background-color:var(--color-midnight-500);padding:12px 0 6px;margin-top:6px;flex:1;text-align:center;transition:all .2s;cursor:pointer}
.muip-tab-item:hover{background-color:var(--color-midnight-200)}
.muip-tab-item.active{margin-top:0;font-size:18px;padding:12px 0;background-color:var(--color-midnight-100)}
.muip-page-list{display:flex;position:relative;height:auto;overflow:hidden;flex-direction:column;border:2px solid var(--color-midnight-100);padding:10px;border-radius:8px;transition:height .3s ease-in-out}
.muip-page{display:flex;box-sizing:border-box;transition:height,opacity .3s ease-in-out;overflow:hidden;flex-direction:column;gap:8px;box-sizing:border-box;z-index:1}
.muip-page.active{opacity:1;visibility:visible;z-index:2}
.muip-page:not(.active){position:absolute;top:0;left:0;opacity:0;visibility:hidden;height:0}
.muip-set-value{display:flex}
.muip-set-value-btn{margin-left:6px}
.muip-set-value-btn button{border-radius:4px;min-width:54px;border:none;font-family:Roboto;font-weight:600;cursor:pointer;background-color:var(--color-market-buy);color:#000;height:30px;padding:0 10px;font-size:14px;line-height:15px;display:block}
.muip-set-value-btn button:hover{background-color:var(--color-market-buy-hover)}
.muip-set-value .Input_inputContainer__22GnD{width:auto}
.muip-set-item{display:flex;justify-content:space-between;background:var(--color-midnight-550);padding:10px;align-items:center;border-radius:6px}
.muip-set-title{display:flex;align-items:flex-start;flex-direction:column}
.muip-set-title span{font-size:14px;color:var(--color-disabled);white-space:normal;overflow:hidden;text-overflow:ellipsis}
.muip-switch-container{display:inline-block;position:relative}
.muip-switch-input{position:absolute;opacity:0;width:0;height:0}
.muip-switch-label{display:block;width:60px;height:26px;background-color:var(--color-midnight-100);border-radius:26px;cursor:pointer;transition:background-color .3s;position:relative}
.muip-switch-label:after{content:'';position:absolute;width:20px;height:20px;border-radius:50%;background-color:var(--color-text-dark-mode);top:3px;left:3px;transition:transform .3s}
.muip-switch-input:checked+.muip-switch-label{background-color:var(--color-market-buy)}
.muip-switch-input:checked+.muip-switch-label:after{transform:translateX(34px)}
.muip-switch-input:disabled+.muip-switch-label{opacity:.5;cursor:not-allowed}
.muip-switch-input:focus+.muip-switch-label{box-shadow:0 0 1px var(--color-market-buy)}
.muip-radio-group input[type=radio]{display:none}
.muip-radio-group{display:flex;border-radius:6px;overflow:hidden}
.muip-radio-group label{flex:1;padding:0 6px;background-color:var(--color-midnight-800);cursor:pointer;transition:all .3s ease;text-align:center;user-select:none;width:50px;height:30px;line-height:30px;color:var(--color-empty)}
.muip-radio-group input[type=radio]:checked+label{background-color:var(--color-midnight-100);color:var(--color-text-dark-mode);box-shadow:0 2px 5px rgba(0,0,0,.2)}
.muip-radio-group label:hover{background-color:var(--color-midnight-400)}
.muip-padding{width:60px;height:30px;text-align:center;line-height:30px}
.muip-favorit-list{border:2px solid var(--color-midnight-400);background-color:var(--color-midnight-900);padding:10px;border-radius:8px;gap:8px;display:flex;flex-wrap: wrap;}
.muip-favorit-remove{background-color:var(--color-warning)!important}
.muip-favorit-remove:hover{background-color:var(--color-warning-hover)!important}
.muip-config-link{margin:0 2px;border:0;border-radius:4px;padding:0 3px;background:var(--color-space-600);color:var(--color-ocean-200);text-decoration:none;transition:all .3s}
.muip-config-link:hover{background:var(--color-ocean-500);color:var(--color-ocean-100)}
@media (max-width:380px){
.muip-page-list{overflow:auto}
.muip-set-item{align-items:flex-start;flex-direction:column}
.muip-favorit-list{overflow-y:scroll;flex-direction:column;flex-wrap:nowrap}
.muip-favorit-list .muip-set-item{flex-direction:row;align-items:center;min-height:min-content;min-width:0}
.muip-set-title{flex:1;min-width:0;padding-right:10px;max-width:100%;white-space:normal;overflow:hidden;text-overflow:ellipsis;overflow-wrap:anywhere}
.muip-set-value-padding{flex-direction:column}
.muip-page.active{overflow-y:scroll}
}
.Inventory_gainedItems___e9t9{margin:36px 0 6px;border-radius:4px;background-color:var(--color-midnight-700)!important;font-size:16px!important;line-height:18px;border:2px solid var(--color-space-700);padding:12px 2px;position:relative}
.Inventory_gainedItems___e9t9 .Inventory_label__XEOAx{text-align:center!important}
.MooPass_mooPass__1y8B_{position:relative;overflow:hidden;background:rgba(139,100,40,.9)}
.CommunityBuff_communityBuff__1BILG{overflow:hidden;background:rgba(15,83,95,.9)}
.CommunityBuff_communityBuff__1BILG .CommunityBuff_level__1JCTU{z-index:10;font-weight:700;color:var(--color-background-game);top:auto!important;bottom:0;background:var(--color-jade-500);text-shadow:unset!important;left:0!important;padding:1px 2px 0 0;border-radius:0 4px 0 0}
.Header_communityBuffs__3x-B2 .Icon_icon__2LtL_{position:absolute;left:-8px!important;top:-8px!important;width:110%!important;height:110%!important;z-index:1;opacity:.8}
.Header_communityBuffs__3x-B2 .MooPass_mooPass__1y8B_ .Icon_icon__2LtL_{top:-2px!important;left:-2px!important}
/*拯救MWITools*/
.Inventory_inventory__17CH2>div{color:var(--color-text-dark-mode)!important}
#script_sortByAsk_btn,#script_sortByBid_btn,#script_sortByNone_btn{margin:0 2px;border:0;border-radius:4px!important;padding:2px 6px;background:var(--color-midnight-100)!important;color:var(--color-text-dark-mode)!important;cursor:pointer}
#script_sortByAsk_btn:hover,#script_sortByBid_btn:hover,#script_sortByNone_btn:hover{background:var(--color-midnight-200)!important}
#script_sortByAsk_btn:active,#script_sortByBid_btn:active,#script_sortByNone_btn:active{background:var(--color-midnight-400)!important}
#toggleCurrentAssets,#toggleNetWorth,#toggleNonCurrentAssets,#toggleScores{background:var(--color-midnight-100);margin-top:6px;border-radius:4px;padding:4px 6px;color:var(--color-text-dark-mode);text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game);transition:all .3s}
#toggleCurrentAssets:hover,#toggleNetWorth:hover,#toggleNonCurrentAssets:hover,#toggleScores:hover{color:var(--color-space-100)}
#toggleCurrentAssets,#toggleNonCurrentAssets{background:var(--color-midnight-400)}
#buildScores,#currentAssets,#netWorthDetails,#nonCurrentAssets{margin-left:0!important;padding-left:16px;border-radius:0 0 4px 4px;border:2px solid var(--color-midnight-100);background:var(--color-midnight-700);color:var(--color-space-200);margin-top:-4px;border-top-width:4px;padding:4px 8px 8px 8px}
#currentAssets,#nonCurrentAssets{border:2px solid var(--color-midnight-400);background:var(--color-midnight-600)}
.script_itemLevel{top:1px!important;right:1px!important;text-shadow:-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)}
#script_stack_price{border-radius:4px;background:var(--color-orange-300);color:var(--color-orange-800);cursor:pointer;left:0!important;top:0!important;padding:0 2px}
.script_mapIndex{position:absolute;left:-6px;top:-9px;background:var(--color-orange-650);border-bottom-right-radius:4px;width:16px!important;text-align:center!important;display:block;color:var(--color-background-game)!important}
.Mui-selected .script_mapIndex{background:var(--color-orange-400)}
/*幸运插件*/
body[data-quest="1"] .script_taskMapCount{position:absolute;right:0;top:0;z-index:6;background-color:rgba(69,71,113,.5);border-radius:0 4px 0 6px;padding:0 6px}
	`);
	const TARGET_CONTAINER = '.MarketplacePanel_tabsComponentContainer__3ctJH';//市场收藏
	const NAVIGATIONBAR_CHARACTER = '.NavigationBar_characterManagement__27qu3';
	const MARKETPLACEPANEL_PRICE = '.MarketplacePanel_price__hIzrY';
	let MarketplacePanel = false;
	let favoritItems = GM_getValue('muip_favorit', []);
	let enhancementInited = false;
	let priceInited = false;
	let translate3D = false;
	const defaultCssConfig = {
		iconsize: 60,
		icon_fontsize: 13,
		actionsize: 140,
		action_fontsize: 14
	};
	function muipInit() {
		muipInitAfter()
		let btn = document.querySelector('.muip-conf');
		if (!btn) {
			btn = document.createElement('div');
			btn.innerHTML = `
			<div class="NavigationBar_nav__3uuUl">
				<svg role="img" class="Icon_icon__2LtL_ Icon_small__2bxvH" width="100%" height="100%"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
				<div class="NavigationBar_contentContainer__1x6WS">
					<div class="NavigationBar_textContainer__7TdaI">
						<span class="NavigationBar_label__1uH-y">牛牛UI增强设置</span>
					</div>
				</div>
			</div>
			`;
			btn.className = 'NavigationBar_navigationLink__3eAHA muip-conf';
			btn.addEventListener('click', showmuipDialog);
		}
		let isInserting = false;
		function insertButton() {
			if (isInserting || (btn.parentNode && btn.parentNode.querySelector(NAVIGATIONBAR_CHARACTER))) return true;
			isInserting = true;
			try {
				const targetElement = document.querySelector(NAVIGATIONBAR_CHARACTER);
				if (targetElement && targetElement.parentNode) {
					if (btn.parentNode && btn.parentNode !== targetElement.parentNode) {
						btn.remove();
					}
					targetElement.parentNode.insertBefore(btn, targetElement);
					return true;
				}
				return false;
			} finally {
				isInserting = false;
			}
		};
		if (!insertButton()) {
			const observer = new MutationObserver((mutations) => {
				if (document.querySelector('.muip-conf')) {
					observer.disconnect();
					return;
				}
				const targetElement = document.querySelector(NAVIGATIONBAR_CHARACTER);
				if (targetElement) {
					insertButton();
					if (btn.isConnected) observer.disconnect();
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
			setTimeout(() => observer.disconnect(), 1000);
		}

	}
	function markStart(container = document) {//增加收藏
		const itemContainers = container.querySelectorAll('.Item_itemContainer__x7kH1');
		itemContainers.forEach(container => {
			const item = container.querySelector('.Item_iconContainer__5z7j4');
			if (!item) return;
			const isTargetItem = favoritItems.some(itemName => {
				return item.querySelector(`svg[aria-label="${itemName}"]`);
			});
			if (isTargetItem && !container.classList.contains('favorit')) {
				container.classList.add('favorit');
			}
		});
	}
	function setupContainerObserver(container) {
		markStart(container);
		const internalObserver = new MutationObserver((mutations) => {
			clearTimeout(internalObserver.debounceTimer);
				internalObserver.debounceTimer = setTimeout(() => {
				markStart(container);
			}, 100);
		});
		internalObserver.observe(container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['aria-label']
		});
	}
	function updateFavoritList() {
		const favoritList = document.querySelector('.muip-favorit-list');
		if (!favoritList) return;
		favoritList.innerHTML = '';
		favoritItems.forEach((item) => {
			const itemElement = document.createElement('div');
			itemElement.className = 'muip-set-item';
			itemElement.innerHTML = `
				<div class="muip-set-title">${item}</div>
				<div class="muip-set-value">
					<div class="muip-set-value-btn">
						<button class="muip-favorit-remove" data-name="${item}">删除</button>
					</div>
				</div>
			`;
			favoritList.appendChild(itemElement);
		});
		document.querySelectorAll('.muip-favorit-remove').forEach(button => {
			button.addEventListener('click', function() {
				const itemName = this.getAttribute('data-name');
				if(itemName){
					const index = favoritItems.indexOf(itemName);
					if (index > -1) toggleFavoriteItem(itemName);
				}
				updateFavoritList();
			});
		});
	}
	function toggleFavoriteItem(itemName) {
		const index = favoritItems.indexOf(itemName);
		if (index > -1) {
			favoritItems.splice(index, 1);
		} else {
			favoritItems.push(itemName);
		}
		GM_setValue('muip_favorit', favoritItems);
	}
	function enhancementProcessed(element) {//强化标记
		if (element.classList.contains('enhancementProcessed')) return;
		const levelText = element.textContent.trim();
		const levelNumber = levelText.replace('+', '');
		if (!isNaN(levelNumber) && levelNumber >= 1) {
			element.classList.add('enhancementProcessed');
			element.classList.add(`enhancementLevel_${levelNumber}`);
		}
	}
	function priceProcessed(element,removeProcessed) {//金币标记
		removeProcessed = removeProcessed || false;
		if(removeProcessed) element.classList.remove('price-processed');
		if(MarketplacePanel){
			if (element.classList.contains('price-processed')){
				if(element.querySelector('span span') !== null){
					element.classList.remove('price-processed');
					priceProcessed(element)
				}
				return;
			}
			element.classList.add('price-processed');
			const span = element.querySelector('span');
			if (!span) return;
			const originalText = span.textContent.trim();
			const match = originalText.match(/^(\d+\.?\d*)([KMB])$/i);

			let fullNumber;
			if (match) {
				const number = parseFloat(match[1]);
				const unit = match[2].toUpperCase();

				switch(unit) {
					case 'K': fullNumber = number * 1000; break;
					case 'M': fullNumber = number * 1000000; break;
					case 'B': fullNumber = number * 1000000000; break;
					default: return;
				}
			}else{
				fullNumber = originalText;
			}
			const formatted = fullNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			const parts = formatted.split(',');
			let newHTML = '';

			if (parts.length >= 4) {
				newHTML = `<span class="price_b">${parts[0]},</span><span class="price_m">${parts[1]},</span><span class="price_k">${parts[2]},</span><span class="price_0">${parts.slice(3).join(',')}</span>
				`;
			} else if (parts.length === 3) {
				newHTML = `<span class="price_m">${parts[0]},</span><span class="price_k">${parts[1]},</span><span class="price_0">${parts[2]}</span>`;
			} else if (parts.length === 2) {
				newHTML = `<span class="price_k">${parts[0]},</span><span class="price_0">${parts[1]}</span>`;
			} else {
				newHTML = `<span class="price_0">${parts[0]}</span>`;
			}
			span.innerHTML = newHTML;
		}else{
			if (!element.classList.contains('price-processed')) return;
			element.classList.remove('price-processed');
			const span = element.querySelector('span');
			if (!span) return;

			const billionPart = span.querySelector('.price_b');
			const millionPart = span.querySelector('.price_m');
			const thousandPart = span.querySelector('.price_k');
			const zeroPart = span.querySelector('.price_0');
			let num = zeroPart ? parseInt(zeroPart.textContent) : 0;
			if (billionPart) {
				num += billionPart.textContent.replace(',', '') * 1000000000;
			}
			if (millionPart) {
				num += millionPart.textContent.replace(',', '') * 1000000;
			}
			if (thousandPart) {
				num += thousandPart.textContent.replace(',', '') * 1000;
			}
			let text;
			if (num < 100000) {
				text = num.toString();
			} else if (num < 10000000) {
				text = (num / 1000) + 'K';
			} else if (num < 10000000000) {
				text = (num / 1000000) + 'M';
			} else {
				text = (num / 1000000000) + 'B';
			}
			span.textContent = text;
		}
	}
	function waitObserverProcessed() {
		const existingContainer = document.querySelector(MARKETPLACEPANEL_PRICE);
		if (existingContainer) {
			priceProcessed(existingContainer);
			if(priceInited) return;
		}
		const globalObserver = new MutationObserver((mutations) => {
			const container = document.querySelector(TARGET_CONTAINER);
			if (container) setupContainerObserver(container);
			mutations.forEach((mutation) => {
				if(mutation.type === "childList"){
					const changedSpan = mutation.target.parentElement;
					const parentDiv = changedSpan.closest(MARKETPLACEPANEL_PRICE);
					if (parentDiv && parentDiv.classList.contains('price-processed') && !parentDiv?.querySelector('span>span')) {
						priceProcessed(parentDiv,true)
					}
					const mainPanel = mutation.target.closest('.MainPanel_mainPanel__Ex2Ir');
					if(translate3D && mainPanel && mainPanel.querySelector('.TasksPanel_tasksPanel__Rtqit')) translate3DCard();
				}
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						node.querySelectorAll(MARKETPLACEPANEL_PRICE).forEach(priceProcessed);
						node.querySelectorAll('.Item_enhancementLevel__19g-e').forEach(enhancementProcessed);
					}
				});
			});
		});
		globalObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
		priceInited = true;
	}
	function showmuipDialog() {
		if (document.getElementById('MUIPconfig')) {
			document.getElementById('MUIPconfig').style.display = 'flex';
			setTimeout(() => {
				openMuipWindow();
			}, 10);
			return;
		}
		let html = `
			<div id="MUIPconfig" class="muip-config">
				<div class="muip-mask"></div>
				<div class="muip-window">
					<div class="muip-window-npc">
						<svg role="img" class="Icon_icon__2LtL_" width="100%" height="100%"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
						<div class="muip-window-npc-name">小牛紫</div>
					</div>
					<div class="muip-window-content">
						<span class="muip-title">
							<svg role="img" class="Icon_icon__2LtL_ Icon_small__2bxvH" width="100%" height="100%"><use href="/static/media/chat_icons_sprite.0bff9247.svg#anniversary_purple"></use></svg>
							牛牛UI增强设置
						</span>
						<button id="muipClose" class="muip-close"><svg role="img" aria-label="Close" class="Icon_icon__2LtL_" width="100%" height="100%"><use href="/static/media/misc_sprite.4fc0598b.svg#close_menu"></use></svg></button>
						<div class="muip-main">
							<div class="muip-tab">
								<div class="muip-tab-item active">基础设置</div>
								<div class="muip-tab-item">图标设置</div>
								<div class="muip-tab-item">市场收藏</div>
								<div class="muip-tab-item">其他设置</div>
							</div>
							<div class="muip-page-list">
								<div class="muip-page active">
									<div class="muip-set-item">
										<div class="muip-set-title">导航栏美化<span>已兼容移动端</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_nav" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">隐藏多余菜单<span>新闻~隐私政策/退出登录</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_nav_hidden" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">二级导航美化<span>技能&战斗选择分类部分</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_nav2" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
								</div>
								<div class="muip-page">
									<div class="muip-set-item">
										<div class="muip-set-title">物品图标<span>默认大小 60，推荐大小 40</span></div>
										<div class="muip-set-value">
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_iconsize" type="number">
											</div>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">物品数量字体大小<span>默认大小 13，推荐大小 14</span></div>
										<div class="muip-set-value">
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_icon_fontsize" type="number">
											</div>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">行动(采集/制作/战斗等)图标<span>默认大小 140，推荐大小 80</span></div>
										<div class="muip-set-value">
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_actionsize" type="number">
											</div>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">行动名称字体大小<span>默认大小 14，推荐大小 14</span></div>
										<div class="muip-set-value">
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_action_fontsize" type="number">
											</div>
										</div>
									</div>
								</div>
								<div class="muip-page">
									<div class="muip-set-item">
										<div class="muip-set-title">物品名称<span>支持在市场Ctrl(或⌘)点击物品进行收藏/取消收藏</span></div>
										<div class="muip-set-value">
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_favorit" type="text">
											</div>
											<div class="muip-set-value-btn">
												<button id="addFavorit">添加</button>
											</div>
										</div>
									</div>
									<div class="muip-favorit-list"></div>
								</div>
								<div class="muip-page">
									<div class="muip-set-item">
										<div class="muip-set-title">任务美化<span>兼容 MWI TaskManager</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_quest" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">强化等级美化<span><span class="enhancementLevel_20">+20</span>会动！</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_enhancement" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">物品辞典美化<span>大屏更尽兴</span></div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_dictionary" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">空出区域<span>配合<a class="muip-config-link" href="https://greasyfork.cc/scripts/535795" target="_blank">牛牛聊天增强插件</a></span></div>
										<div class="muip-set-value muip-set-value-padding">
											 <div class="muip-radio-group">
												<input type="radio" id="padding1" value="1" name="muip-padding" checked>
												<label for="padding1">左边</label>

												<input type="radio" id="padding2" value="2" name="muip-padding">
												<label for="padding2">中间</label>

												<input type="radio" id="padding3" value="3" name="muip-padding">
												<label for="padding3">右边</label>
											</div>
											<div class="muip-padding">留出</div>
											<div class="Input_inputContainer__22GnD">
												<input class="Input_input__2-t98" id="muip_set_padding" type="number">
											</div>
										</div>
									</div>
									<div class="muip-set-item">
										<div class="muip-set-title">展开市场价格
											<span>
												<span class="MarketplacePanel_price__hIzrY">
													<span style="color:var(--color-ocean-300)">100B</span>
													<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
												</span>
												<span class="MarketplacePanel_price__hIzrY">
													<span style="color:var(--color-jade-300)">12.5M</span>
													<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
												</span>
												<span class="MarketplacePanel_price__hIzrY">
													<span style="color:var(--color-orange-200)">225K</span>
													<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
												</span>
												<span class="MarketplacePanel_price__hIzrY">
													<span style="color:var(--color-neutral-0)">24000</span>
													<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
												</span>
												<span class="MarketplacePanel_price__hIzrY">
													<span style="color:var(--color-neutral-0)">16</span>
													<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>
												</span>
											</span>
										</div>
										<div class="muip-set-value">
											<label class="muip-switch-container">
												<input type="checkbox" id="muip_set_price" class="muip-switch-input">
												<span class="muip-switch-label"></span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="muip-bottom">
							<div class="muip-tip">提示:如有任何BUG/建议/需求，可以在游戏内私聊@HouGuoYu，或在反馈中提交。</div>
							<button id="muipSave">保存</button>
						</div>
					</div>
				</div>
			</div>
		`;
		document.body.insertAdjacentHTML('beforeend', html);
		setTimeout(() => {
			openMuipWindow()
		}, 10);
		document.getElementById('muip_set_nav').checked = GM_getValue('muip_nav',0);
		document.getElementById('muip_set_nav2').checked = GM_getValue('muip_nav2',0);
		document.getElementById('muip_set_nav_hidden').checked = GM_getValue('muip_navh',0);
		document.getElementById('muip_set_quest').checked = GM_getValue('muip_quest',0);
		document.getElementById('muip_set_enhancement').checked = GM_getValue('muip_enhancement',0);
		document.getElementById('muip_set_dictionary').checked = GM_getValue('muip_dictionary',0);
		document.getElementById('muip_set_price').checked = GM_getValue('muip_price',0);
		const values = getCssConfig();
		document.getElementById('muip_set_iconsize').value = values.iconsize;
		document.getElementById('muip_set_icon_fontsize').value = values.icon_fontsize;
		document.getElementById('muip_set_actionsize').value = values.actionsize;
		document.getElementById('muip_set_action_fontsize').value = values.action_fontsize;
		const padding = GM_getValue('muip_padding',0);
		const padding_type = GM_getValue('muip_padding_type',1);
		document.querySelector(`input[name="muip-padding"][value="${padding_type}"]`).checked = true;
		document.getElementById('muip_set_padding').value = values.padding;
		updateFavoritList()
		document.querySelector('.muip-tab')?.addEventListener('click', function(e) {
			const tab = e.target.closest('.muip-tab-item');
			if (!tab) return;

			const allTabs = Array.from(this.querySelectorAll('.muip-tab-item'));
			const allPages = Array.from(document.querySelectorAll('.muip-page-list .muip-page'));

			const tabIndex = allTabs.indexOf(tab);
			if (tabIndex === -1) return;

			allTabs.forEach(tab => tab.classList.remove('active'));
			allPages.forEach(page => page.classList.remove('active'));

			tab.classList.add('active');
			if (allPages[tabIndex]) {
				allPages[tabIndex].classList.add('active');
				const height = allPages[tabIndex].scrollHeight;
				document.querySelector('.muip-page-list').style.height = `${height + 24}px`;
			}
		});
		document.getElementById('muip_set_nav').addEventListener('click', function() {
			var muip_nav = document.getElementById('muip_set_nav').checked ? 1 : 0;
			GM_setValue('muip_nav', muip_nav);
			document.body.setAttribute('data-nav', muip_nav);
		});
		document.getElementById('muip_set_nav2').addEventListener('click', function() {
			var muip_nav2 = document.getElementById('muip_set_nav2').checked ? 1 : 0;
			GM_setValue('muip_nav2', muip_nav2);
			document.body.setAttribute('data-nav2', muip_nav2);
		});
		document.getElementById('muip_set_nav_hidden').addEventListener('click', function() {
			var muip_nav_hidden = document.getElementById('muip_set_nav_hidden').checked ? 1 : 0;
			GM_setValue('muip_navh', muip_nav_hidden);
			document.body.setAttribute('data-navh', muip_nav_hidden);
		});
		document.getElementById('muip_set_quest').addEventListener('click', function() {
			var quest = document.getElementById('muip_set_quest').checked ? 1 : 0;
			GM_setValue('muip_quest', quest);
			document.body.setAttribute('data-quest', quest);
			translate3D = quest;
		});
		document.getElementById('muip_set_enhancement').addEventListener('click', function() {
			var enhancement = document.getElementById('muip_set_enhancement').checked ? 1 : 0;
			GM_setValue('muip_enhancement', enhancement);
			document.body.setAttribute('data-enhancement', enhancement);
		});
		document.getElementById('muip_set_dictionary').addEventListener('click', function() {
			var dictionary = document.getElementById('muip_set_dictionary').checked ? 1 : 0;
			GM_setValue('muip_dictionary', dictionary);
			document.body.setAttribute('data-dictionary', dictionary);
		});
		document.getElementById('muip_set_price').addEventListener('click', function() {
			var price = document.getElementById('muip_set_price').checked ? 1 : 0;
			GM_setValue('muip_price', price);
			document.body.setAttribute('data-price', price);
			MarketplacePanel = !!price;
			const priceElements = document.querySelectorAll(MARKETPLACEPANEL_PRICE);
			priceElements.forEach(function(element) {
				priceProcessed(element);
			});
		});
		document.getElementById('muipSave').addEventListener('click', function() {
			const values = getCssConfig();
			const iconsize = document.getElementById('muip_set_iconsize').value || values.iconsize;
			const icon_fontsize = document.getElementById('muip_set_icon_fontsize').value || values.icon_fontsize;
			const actionsize = document.getElementById('muip_set_actionsize').value || values.actionsize;
			const action_fontsize = document.getElementById('muip_set_action_fontsize').value || values.action_fontsize;
			const padding = document.getElementById('muip_set_padding').value || 0;
			if(padding){
				const selectedRadio = document.querySelector('input[name="muip-padding"]:checked');
				const paddingValue = selectedRadio ? selectedRadio.value : 1;
				document.body.setAttribute('data-padding', paddingValue);
				GM_setValue('muip_padding',padding);
				GM_setValue('muip_padding_type',paddingValue);
			}else{
				document.body.setAttribute('data-padding', 0);
			}
			const newConfig = {
				iconsize: iconsize,
				icon_fontsize: icon_fontsize,
				actionsize: actionsize,
				action_fontsize: action_fontsize,
				padding: padding
			};
			setCssConfig(newConfig)
			setRootCss()
			document.getElementById('MUIPconfig').style.display = 'none';
			document.querySelector('.muip-window').classList.remove('open');
		});
		document.getElementById('muipClose').addEventListener('click', function() {
			document.getElementById('MUIPconfig').style.display = 'none';
			document.querySelector('.muip-window').classList.remove('open');
		});
		document.querySelector('.muip-mask').addEventListener('click', function() {
			document.getElementById('MUIPconfig').style.display = 'none';
			document.querySelector('.muip-window').classList.remove('open');
		});
		document.getElementById('addFavorit')?.addEventListener('click', function() {
			const favoritName = document.getElementById('muip_set_favorit').value;
			if (!favoritName) return;
			document.getElementById('muip_set_favorit').value = '';
			if (!favoritItems.includes(favoritName)) {
				favoritItems.push(favoritName);
				GM_setValue('muip_favorit', favoritItems);
				updateFavoritList();
			}
		});
	}
	function openMuipWindow(){
		document.querySelector('.muip-window').classList.add('open');
		const activePage = document.querySelector('.muip-page-list .muip-page.active');
		if(activePage){
			const height = activePage.scrollHeight;
			document.querySelector('.muip-page-list').style.height = `${height + 24}px`;
		}
	}
	function muipInitAfter() {
		document.body.setAttribute('data-nav', GM_getValue('muip_nav', '0'));
		document.body.setAttribute('data-nav2', GM_getValue('muip_nav2', '0'));
		document.body.setAttribute('data-navh', GM_getValue('muip_navh', '0'));
		const quest = GM_getValue('muip_quest', '0');
		translate3D = quest;
		document.body.setAttribute('data-quest', quest);
		document.body.setAttribute('data-enhancement', GM_getValue('muip_enhancement', '0'));
		document.body.setAttribute('data-dictionary', GM_getValue('muip_dictionary', '0'));
		const price = GM_getValue('muip_price', '0');
		document.body.setAttribute('data-price',price);
		MarketplacePanel = !!price;

		const padding = GM_getValue('muip_padding',0);
		const padding_type = GM_getValue('muip_padding_type',1);
		if(padding){
			document.body.setAttribute('data-padding', padding_type);
		}else{
			document.body.setAttribute('data-padding', 0);
		}
		setRootCss()
		document.addEventListener('click', function(event) {
			const itemContainer = event.target.closest('.MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1');
			if ((event.ctrlKey || event.metaKey) && event.button === 0 && itemContainer && itemContainer.querySelector('svg[aria-label]')) {
				event.stopImmediatePropagation();
				event.preventDefault();

				const svg = itemContainer.querySelector('svg[aria-label]');
				const itemName = svg ? svg.getAttribute('aria-label') : null;
				if(itemName){
					if (itemContainer.classList.contains('favorit')) {
						itemContainer.classList.remove('favorit');
						if (!favoritItems.includes(itemName)) {
							favoritItems.push(favoritName);
						}
					} else {
						itemContainer.classList.add('favorit');
					}
				}
				toggleFavoriteItem(itemName);
				updateFavoritList();
			}
		}, true);
	}
	function getCssConfig() {
		const savedConfig = GM_getValue('muip_css', '{}');
		return {
			...defaultCssConfig,
			...JSON.parse(savedConfig)
		};
	}
	function setCssConfig(newConfig) {
		const currentConfig = getCssConfig();
		const mergedConfig = {
			...currentConfig,
			...newConfig
		};
		GM_setValue('muip_css', JSON.stringify(mergedConfig));
	}
	function setRootCss(){
		const values = getCssConfig();
		const style = document.createElement('style');
		style.id = 'muip-css';
		style.textContent = `
			:root {
				--iconsize: ${values.iconsize}px;
				--icon_fontsize: ${values.icon_fontsize}px;
				--actionsize: ${values.actionsize}px;
				--action_fontsize: ${values.action_fontsize}px;
				--padding: ${values.padding}px;
			}
		`;
		const oldStyle = document.getElementById('muip-css');
		if (oldStyle) oldStyle.remove();
		document.head.appendChild(style);
	}
	function translate3DCard(){
		console.log('translate3DCard')
		let isAnimating = false;
		document.querySelectorAll('.RandomTask_randomTask__3B9fA').forEach(card => {
			const updateCardTransform = (x, y) => {
				const rotateY = (x - 0.5) * 15; // 减小旋转幅度
				const rotateX = (0.5 - y) * 15;
				card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
				card.style.boxShadow = `${-rotateY * 0.3}px ${rotateX * 0.3}px 15px rgba(0, 0, 0, 0.25)`;
			};
			card.addEventListener('mousemove', (e) => {
				if (!isAnimating) {
					isAnimating = true;
					requestAnimationFrame(() => {
						const cardRect = card.getBoundingClientRect();
						const x = (e.clientX - cardRect.left) / cardRect.width;
						const y = (e.clientY - cardRect.top) / cardRect.height;
					
						updateCardTransform(x, y);
						isAnimating = false;
					});
				}
			});
			card.addEventListener('mouseleave', () => {
				requestAnimationFrame(() => {
					card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
					card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
				});
			});
		});
	}
	function load(){
		muipInit();
		waitObserverProcessed();
	}
	function init() {
		GM_registerMenuCommand('设置', showmuipDialog);
		if(document.readyState === 'complete') {
			load()
		}else{
			window.addEventListener('load', load);
		}
	}
	if (window.ReactRouter) {
		window.ReactRouter.useEffect(() => {
			load();
		}, [window.location.pathname]);
	}
	const spaContentObserver = new MutationObserver(() => {
		if (!document.querySelector('.muip-conf')) {
			load();
		}
	});
	spaContentObserver.observe(document.getElementById('root'), { childList: true, subtree: true });
	init();
})();