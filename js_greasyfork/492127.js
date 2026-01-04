// ==UserScript==
// @name         PTCG Deck Check Tool Translator (To Traditional Chinese)
// @namespace    https://funamushi.net/pokeca_hitorimawashi/pokeca_deck_check/
// @version      2024-04-06
// @description  將ふなむし製作的「ポケカデッキ確認ツール」翻譯成繁體中文
// @author       Blue Daze
// @match        https://funamushi.net/pokeca_hitorimawashi/pokeca_deck_check/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492127/PTCG%20Deck%20Check%20Tool%20Translator%20%28To%20Traditional%20Chinese%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492127/PTCG%20Deck%20Check%20Tool%20Translator%20%28To%20Traditional%20Chinese%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 選取所有文字節點，並遍歷它們
    document.querySelectorAll('*').forEach(function(node) {
        Array.from(node.childNodes).forEach(function(child) {
            // 檢查節點是否是文字節點
            if (child.nodeType === Node.TEXT_NODE) {
                // 替換文字內容
                child.nodeValue = child.nodeValue.replace(/hand/g, '手牌');
                child.nodeValue = child.nodeValue.replace(/trash/g, '棄牌區');
                child.nodeValue = child.nodeValue.replace(/deck/g, '牌庫');
                child.nodeValue = child.nodeValue.replace(/bench/g, '備戰區');
                child.nodeValue = child.nodeValue.replace(/battle/g, '戰鬥場');
                child.nodeValue = child.nodeValue.replace(/stadium/g, '競技場');
                child.nodeValue = child.nodeValue.replace(/FREE/g, '自由操作區');
                child.nodeValue = child.nodeValue.replace(/lost/g, '放逐區');
                child.nodeValue = child.nodeValue.replace(/side/g, '獎賞卡');
                child.nodeValue = child.nodeValue.replace(/coin/g, '硬幣');
            }
        });
    });

    var element = document.getElementById('share_btn');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '在X(Twitter)分享這個牌組';
    }

    element = document.getElementById('left_code');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.placeholder = '請輸入牌組編碼';
    }

    element = document.getElementById('gx_hide');
    var targetObject = document.getElementById('p1_GX');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.innerText == 'Vstarマーカー表示') {
            element.innerText = '關閉VSTAR標記'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            // 檢查目標物件的顯示狀態
            if (targetObject.style.display == 'none') {
                /*targetObject.style.display = "block";*/
                document.getElementById("gx_hide").innerText = '顯示VSTAR標記'
            } else {
                /*targetObject.style.display = "none";*/
                document.getElementById("gx_hide").innerText = '關閉VSTAR標記'
            }
        });
    }

    element = document.getElementById('p1_lostzone_btn');
    targetObject = document.getElementById('p1_lostzone');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.innerText == 'ロストゾーン表示') {
            element.innerText = '顯示放逐區'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            // 檢查目標物件的顯示狀態
            if (targetObject.style.display == 'none') {
                targetObject.style.display = "block";
                document.getElementById("p1_lostzone_btn").innerText = '關閉放逐區'
            } else {
                targetObject.style.display = "none";
                document.getElementById("p1_lostzone_btn").innerText = '顯示放逐區'
            }
        });
    }

    // 檢查元素是否存在
    if (document.getElementById('p1_side_open')) {
        // 將元素的文字內容替換為「新的文字」
        if (document.getElementById('p1_side_open').innerText == '表にする') {
            document.getElementById('p1_side_open').innerText = '全翻為正面'
        }

        // 添加點擊事件監聽器
        document.getElementById('p1_side_open').addEventListener('click', function() {
            if (document.getElementById('p1_side_open').innerText == '全翻為正面') {

                for (var i = 0; i < document.getElementById("p1_side_wrap").getElementsByTagName('li').length; i++) {
                    document.getElementById("p1_side_wrap").getElementsByTagName('li')[i].classList.remove('hide')
                }

                document.getElementById('p1_side_open').innerText = '全翻為反面'
            } else if (document.getElementById('p1_side_open').innerText == '全翻為反面') {

                for (var j = 0; j < document.getElementById("p1_side_wrap").getElementsByTagName('li').length; j++) {
                    document.getElementById("p1_side_wrap").getElementsByTagName('li')[j].classList.add('hide')
                }

                document.getElementById('p1_side_open').innerText = '全翻為正面'
            }
        });
            // 檢查目標物件的顯示狀態
            /*

                document.getElementById('p1_side_open').innerText = '全翻為反面'
             else if (document.getElementById('p1_side_open').innerText == '全翻為反面') {
                Array.from(document.getElementById("p1_side_wrap").children).forEach(function(card) {
                    card.class = "card hide";
                });
                document.getElementById('p1_side_open').innerText = '全翻為正面'
            }*/
    }

    element = document.getElementById('p1_mugen_zone');
    targetObject = document.getElementById('p1_bench6');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.innerText == 'ベンチ+') {
            element.innerText = '備戰區+'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            // 檢查目標物件的顯示狀態
            if (targetObject.style.display == 'none') {
                /*targetObject.style.display = "block";*/
                document.getElementById("p1_mugen_zone").innerText = '備戰區+'
            } else {
                /*targetObject.style.display = "none";*/
                document.getElementById("p1_mugen_zone").innerText = '備戰區-'
            }
        });
    }

    element = document.getElementById('p1_deck_5_2');
    targetObject = document.getElementById('p1_deck');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.value == '山上5枚見る') {
            element.value = '查看牌庫上方5張卡'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            // 檢查目標物件的顯示狀態
            if (targetObject.style.display == 'none') {
                document.getElementById("p1_deck_5_2").value = '查看牌庫上方5張卡'
                document.getElementById("p1_deck_btn_2").value = '查看牌庫'
            } else {
                document.getElementById("p1_deck_5_2").value = '洗牌並關閉'
                document.getElementById("p1_deck_btn_2").value = '關閉牌庫'
            }
        });
    }

    element = document.getElementById('p1_deck_btn_2');
    targetObject = document.getElementById('p1_deck');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.value == 'デッキを見る') {
            element.value = '查看牌庫'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            // 檢查目標物件的顯示狀態
            if (targetObject.style.display == 'none') {
                document.getElementById("p1_deck_5_2").value = '查看牌庫上方5張卡'
                document.getElementById("p1_deck_btn_2").value = '查看牌庫'
            } else {
                document.getElementById("p1_deck_5_2").value = '洗牌並關閉'
                document.getElementById("p1_deck_btn_2").value = '關閉牌庫'
            }
        });
    }

    /*element = document.getElementById('p1_side_open');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        if (element.innerText == '表にする') {
            element.innerText = '全部正面顯示'
        }

        // 添加點擊事件監聽器
        element.addEventListener('click', function() {
            let p1SideArea = Array.from(document.getElementById('p1SideWrap').children)

            if (element.innerText == '全部正面顯示') {
                p1SideArea.forEach(function(card) {
                    card.classList.remove("hide");
                });
                document.getElementById('p1_side_open').innerText == "表にする"
            } /*else if (element.innerText == '全部正面顯示') {
                p1SideArea.forEach(function(card) {
                    card.classList.add("hide");
                });
                p1SideOpen.innerText == "全部正面顯示"
                onoff = 1
            }
        });
    }*/

    element = document.getElementById('edit_btn');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '編輯這個牌組(日版官網)';
    }

    element = document.getElementById('p1_reset');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '重新抽牌';
    }

    element = document.getElementById('go_to_home');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '首頁';
    }

    element = document.getElementById('set-btn');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.value = '設置';
    }

    element = document.getElementById('p1_p1_free_space_reverse');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '將卡片翻面';
    }

    element = document.getElementById('p1_p1_free_space_to_hand');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '將卡片加入手牌';
    }

    element = document.getElementById('p1_side_shuffle');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '洗牌';
    }

    element = document.getElementById('p1_side_get1');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '拿1獎';
    }

    element = document.getElementById('p1_side_get2');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '拿2獎';
    }

    element = document.getElementById('p1_side_get3');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '拿3獎';
    }

    element = document.getElementById('retuen_to_deck');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '放回牌庫並重洗';
    }

    element = document.getElementById('move_to_trash');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '丟棄';
    }

    element = document.getElementById('go_to_card_page');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '顯示大卡圖';
    }

    element = document.getElementById('move_to_top');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '放回牌庫上方';
    }

    element = document.getElementById('move_to_bottom');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '放回牌庫下方';
    }

    element = document.getElementById('saru');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '小聰明';
    }

    element = document.getElementById('reverse_card');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.textContent = '卡片翻面';
    }

    element = document.getElementById('p1_draw_btn_2');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.value = '抽出1張卡';
    }

    element = document.getElementById('p1_shuffle_btn_2');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.value = '洗牌';
    }

    element = document.getElementById('p1_deck_7');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.value = '再查看2張';
    }

    element = document.getElementById('p1_deck_sort');

    // 檢查元素是否存在
    if (element) {
        // 將元素的文字內容替換為「新的文字」
        element.value = '排序';
    }

    var elements = document.querySelectorAll('#go_to_manual');

    // 遍歷所有元素並進行處理
    elements.forEach(function(element) {
        // 將每個元素的文字內容替換為「新的文字」

        if (element.textContent == '使い方') {
            element.textContent = '使用方法';
        }

        if (element.textContent == '要望等') {
            element.textContent = '提出建議';
        }
    });

    elements = document.querySelectorAll('.btn01');

    // 遍歷所有元素並進行處理
    elements.forEach(function(element) {
        // 將每個元素的文字內容替換為「新的文字」

        if (element.textContent == '支援する') {
            element.textContent = '贊助';
        }

        if (element.textContent == 'トラッシュ') {
            element.textContent = '丟棄';
        }

        if (element.textContent == 'バトル場') {
            element.textContent = '戰鬥場';
        }

        if (element.textContent == 'やけど') {
            element.textContent = '灼傷';
        }

        if (element.textContent == 'どく') {
            element.textContent = '中毒';
        }

        if (element.textContent == 'ねむり') {
            element.textContent = '睡眠';
        }

        if (element.textContent == 'まひ') {
            element.textContent = '麻痺';
        }

        if (element.textContent == 'こんらん') {
            element.textContent = '混亂';
        }

        if (element.textContent == 'デッキに戻す') {
            element.textContent = '放回牌庫';
        }

        if (element.textContent == '並び替え') {
            element.textContent = '排序';
        }

        if (element.textContent == '博士の研究') {
            element.textContent = '博士的研究';
        }

        if (element.textContent == 'ナンジャモ') {
            element.textContent = '奇樹';
        }

        if (element.textContent == 'ジャッジマン') {
            element.textContent = '裁判';
        }
    });

})();