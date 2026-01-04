// ==UserScript==
// @name                翻譯サーモンラーンNW
// @name:zh-CN          翻译サーモンラーンNW
// @namespace           http://tampermonkey.net/
// @version             0.6
// @description         翻譯這一網站中的部分字串至中文。
// @description:zh-CN   翻译这一网站中的部分字串至中文。
// @author              清平現
// @match               https://salmon-learn-nw.gungee.jp/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=gungee.jp
// @license             Creative Commons Attribution Non Commercial Share Alike 3.0 Unported
// @downloadURL https://update.greasyfork.org/scripts/462891/%E7%BF%BB%E8%AD%AF%E3%82%B5%E3%83%BC%E3%83%A2%E3%83%B3%E3%83%A9%E3%83%BC%E3%83%B3NW.user.js
// @updateURL https://update.greasyfork.org/scripts/462891/%E7%BF%BB%E8%AD%AF%E3%82%B5%E3%83%BC%E3%83%A2%E3%83%B3%E3%83%A9%E3%83%BC%E3%83%B3NW.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    let tc = false;
    const navigatorLanguages = navigator.languages;
    for (let lang of navigatorLanguages) {
        lang = lang.toLowerCase();
        if (lang.includes('zh') || lang.includes('cmn')) {
            tc = ['-hant', '-hk', '-mo', '-tw'].some((sub, lang) => lang.includes(sub));
            break;
        }
    }

    if (tc) {
        const headerElement = document.getElementsByTagName('header')[0];
        if (headerElement) {
            const headerTranslation = {
                'もどる': '返回',
                'アラマキ砦': '新卷堡',
                'ムニ・エール海洋発電所': '麥年海洋發電所',
                'シェケナダム': '鮭壩',
                '難破船ドン・ブラコ': '漂浮落難船',
                '満潮': '滿潮',
                '干潮': '乾潮'
            };
            headerElement.innerHTML = translate(headerElement, headerTranslation);
        }

        const footerElement = document.getElementsByTagName('footer')[0];
        if (footerElement) {
            const footerTranslation = {
                'ホーム': '首頁',
                'マップ': '地圖',
                'オプション': '選項',
                'ブキ': '武器',
                'シャケ他': '鮭魚等'
            };
            footerElement.innerHTML = translate(footerElement, footerTranslation);
        }

        const configElement = document.getElementById('modal_config_content');
        if (configElement) {
            const configStrings = configElement.querySelectorAll(':scope>.list-group>.list-group-item>.row>:first-child, :scope>.text-white-400.my-2.mx-3');
            const configTranslation = {
                'ステージ画像の種類': '場地圖片類型',
                'スケールを表示する': '顯示比例',
                'スケールの種類': '比例類型',
                'スケール表示を有効にすると、ロビーの試射場やクマサン商会の控室に引いてあるラインと同じ間隔で画面上にラインが表示されます。': '在啟用比例顯示時屏幕上會顯示線條，其間隔與在大廳試射場和熊先生商會等候室中的線條相同。',
                'タマヒロイのスポナー': '拾蛋魚的產生位置',
                'ザコシャケのスポナー': '雜兵鮭魚的產生位置',
                'カタパッドの定位置と移動ルート': '墊肩飛魚的固定位置與移動路線',
                'タワーの定位置': '高塔魚的固定位置',
                'コウモリの定位置': '蝙蝠魚的固定位置',
                'コウモリの移動ルート': '蝙蝠魚的移動路線',
                'ハシラの定位置': '柱魚的固定位置',
                'テッキュウの発射台の定位置': '鐵球魚發射臺的固定位置',
                '巨大タツマキの箱およびザコのスポナー': '在出現巨型龍捲風時箱子及雜魚的產生位置',
                'ハコビヤおよびシャケコプターの定位置': '走私魚及直升機鮭魚的固定位置',
                'マップ上のコウモリの定位置を表す点をタップすると、索敵半径やボロノイ図の描画メニューが表示されます。': '按下在地圖上代表蝙蝠魚固定位置的點時，會顯示其索敵半徑和沃羅諾伊圖的繪圖選單。'
            };
            configStrings.forEach((configStringElement) => {
                const configString = configStringElement.innerHTML;
                configStringElement.innerHTML = configTranslation[configString] || configString;
            });
        }

        const mainPage = document.querySelectorAll('main>.content-home>.row');
        if (mainPage[0]) {
            const mainTranslation = {
                'メニュー': '選單',
                'マップ': '地圖',
                'リンク': '連結',
                'スケジュール': '時間表',
                '実装予定': '計劃實裝',
                'このサイトについて': '關於本網站',
                'は、サーモンラン NEXT WAVEの攻略ツール・情報を提供する非公式のWebサイトです。': '是提供鮭魚跑<span style="user-select: none;"> </span>NEXT WAVE<span style="user-select: none;"> </span>攻略工具及資訊的非官方網站。',
                '管理人は': '管理員是',
                'です。お問い合わせはリプライやDMでどぞ。': '。お問い合わせはリプライやDMでどぞ。'
            };
            mainPage.forEach((row) => {
                row.innerHTML = translate(row, mainTranslation);
            });
        }
        else {
            const mainRows = document.querySelectorAll('main>.col-10>.row');
            if (mainRows[0]) {
                const mainTranslation = {
                    'マップ': '地圖',
                    'サーモンランのステージ': '在鮭魚跑場地',
                    'ビューアです。各種オブジェクトの位置を確認したり、': '檢視器中，可以確認各種對象的位置，還可以在',
                    '上にブキ画像を配置したりできます。': '上放置武器圖片。',
                    'アラマキ砦': '新卷堡',
                    'ムニ・エール海洋発電所': '麥年海洋發電所',
                    'シェケナダム': '鮭壩',
                    '難破船ドン・ブラコ': '漂浮落難船',
                    '満潮': '滿潮',
                    '干潮': '乾潮'
                };
                mainRows.forEach((row) => {
                    row.innerHTML = translate(row, mainTranslation);
                });
            }
        }
    } else {
        const headerElement = document.getElementsByTagName('header')[0];
        if (headerElement) {
            const headerTranslation = {
                'もどる': '返回',
                'アラマキ砦': '新卷堡',
                'ムニ・エール海洋発電所': '麦年海洋发电所',
                'シェケナダム': '鲑坝',
                '難破船ドン・ブラコ': '漂浮落难船',
                '満潮': '满潮'
            };
            headerElement.innerHTML = translate(headerElement, headerTranslation);
        }

        const footerElement = document.getElementsByTagName('footer')[0];
        if (footerElement) {
            const footerTranslation = {
                'ホーム': '首页',
                'マップ': '地图',
                'オプション': '选项',
                'ブキ': '武器',
                'シャケ他': '鲑鱼等'
            };
            footerElement.innerHTML = translate(footerElement, footerTranslation);
        }

        const configElement = document.getElementById('modal_config_content');
        if (configElement) {
            const configStrings = configElement.querySelectorAll(':scope>.list-group>.list-group-item>.row>:first-child, :scope>.text-white-400.my-2.mx-3');
            const configTranslation = {
                'ステージ画像の種類': '场地图片类型',
                'スケールを表示する': '显示比例',
                'スケールの種類': '比例类型',
                'スケール表示を有効にすると、ロビーの試射場やクマサン商会の控室に引いてあるラインと同じ間隔で画面上にラインが表示されます。': '在启用比例显示时屏幕上会显示线条，其间隔与在大厅试射场和熊先生商会等候室中的线条相同。',
                'タマヒロイのスポナー': '拾蛋鱼的产生位置',
                'ザコシャケのスポナー': '杂兵鲑鱼的产生位置',
                'カタパッドの定位置と移動ルート': '垫肩飞鱼的固定位置与移动路线',
                'タワーの定位置': '高塔鱼的固定位置',
                'コウモリの定位置': '蝙蝠鱼的固定位置',
                'コウモリの移動ルート': '蝙蝠鱼的移动路线',
                'ハシラの定位置': '柱鱼的固定位置',
                'テッキュウの発射台の定位置': '铁球鱼发射台的固定位置',
                '巨大タツマキの箱およびザコのスポナー': '在出现巨型龙卷风时箱子及杂鱼的产生位置',
                'ハコビヤおよびシャケコプターの定位置': '走私鱼及直升机鲑鱼的固定位置',
                'マップ上のコウモリの定位置を表す点をタップすると、索敵半径やボロノイ図の描画メニューが表示されます。': '按下在地图上代表蝙蝠鱼固定位置的点时，会显示其索敌半径和沃罗诺伊图的绘图菜单。'
            };
            configStrings.forEach((configStringElement) => {
                const configString = configStringElement.innerHTML;
                configStringElement.innerHTML = configTranslation[configString] || configString;
            });
        }

        const mainPage = document.querySelectorAll('main>.content-home>.row');
        if (mainPage[0]) {
            const mainTranslation = {
                'メニュー': '菜单',
                'マップ': '地图',
                'リンク': '链接',
                'スケジュール': '日程',
                '実装予定': '计划实装',
                'このサイトについて': '关于本网站',
                'は、サーモンラン NEXT WAVEの攻略ツール・情報を提供する非公式のWebサイトです。': '是提供鲑鱼跑<span style="user-select: none;"> </span>NEXT WAVE<span style="user-select: none;"> </span>攻略工具及信息的非官方网站。',
                '管理人は': '管理员是',
                'です。お問い合わせはリプライやDMでどぞ。': '。お问い合わせはリプライやDMでどぞ。'
            };
            mainPage.forEach((row) => {
                row.innerHTML = translate(row, mainTranslation);
            });
        }
        else {
            const mainRows = document.querySelectorAll('main>.col-10>.row');
            if (mainRows[0]) {
                const mainTranslation = {
                    'マップ': '地图',
                    'サーモンランのステージ': '在鲑鱼跑场地',
                    'ビューアです。各種オブジェクトの位置を確認したり、': '查看器中，可以确认各种对象的位置，还可以在',
                    '上にブキ画像を配置したりできます。': '上放置武器图片。',
                    'アラマキ砦': '新卷堡',
                    'ムニ・エール海洋発電所': '麦年海洋发电所',
                    'シェケナダム': '鲑坝',
                    '難破船ドン・ブラコ': '漂浮落难船',
                    '満潮': '满潮'
                };
                mainRows.forEach((row) => {
                    row.innerHTML = translate(row, mainTranslation);
                });
            }
        }
    }

    function translate(element, translation) {
        let html = element.innerHTML;
        for (let original in translation) {
            html = html.replaceAll(original, translation[original]);
        }
        return html;
    }
})();