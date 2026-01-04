// ==UserScript==
// @name         UMA_DB_FORMATTER
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  ウマ娘DBのサイトを使いやすくするスクリプト
// @author       GOYH
// @match        *://uma.pure-db.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455566/UMA_DB_FORMATTER.user.js
// @updateURL https://update.greasyfork.org/scripts/455566/UMA_DB_FORMATTER.meta.js
// ==/UserScript==

var $ = window.jQuery;

let heal_skills = ["アオハル点火・体","コーナー回復○","直線回復","隠れ蓑","ペースキープ","ウマ込み冷静","スタミナキープ","好位追走","後方待機","様子見","展開窺い","前途洋々","深呼吸","別腹タンク","軽やかステップ","パス上手","勢い任せ","栄養補給","小休憩","下校の楽しみ","冷静","スリーセブン","ふり絞り","静かな呼吸","砂塵慣れ","憧れのエール","マイペース","抜かりなし"];
let passive_skills = ["右回り○","右回り×","左回り○","左回り×","春ウマ娘○","春ウマ娘×","夏ウマ娘○","夏ウマ娘×","秋ウマ娘○","秋ウマ娘×","冬ウマ娘○","冬ウマ娘×","外枠得意○","外枠苦手","おひとり様○","伏兵○","GⅠ苦手","シンパシー","一匹狼","交流重賞○","交流重賞×","踏み込み上手","泥遊び○","泥遊び×","やまっけ","東京レース場○","東京レース場×","中山レース場○","中山レース場×","阪神レース場○","阪神レース場×","京都レース場○","京都レース場×","中京レース場○","中京レース場×","札幌レース場○","札幌レース場×","函館レース場○","函館レース場×","福島レース場○","福島レース場×","新潟レース場○","新潟レース場×","小倉レース場○","小倉レース場×","大井レース場○","大井レース場×","川崎レース場○","川崎レース場×","船橋レース場○","船橋レース場×","盛岡レース場○","盛岡レース場×","根幹距離○","根幹距離×","非根幹距離○","非根幹距離×","小心者","レースの真髄・心","良バ場○","良バ場×","道悪○","道悪×","対抗意識○","晴れの日○","曇りの日○","雨の日○","雨の日×","雪の日○","徹底マーク○","内枠得意○","内枠苦手","逃げのコツ○","先行のコツ○","差しのコツ○","追込のコツ○","自制心","ナイター○","ナイター×","小回り○","小回り×","ラッキーセブン"];
let debuff_skills = ["かく乱","トリック（前）","トリック（後）","逃げけん制","逃げ焦り","先行けん制","先行焦り","差しけん制","差し焦り","追込けん制","追込焦り","抜け駆け禁止","ささやき","スタミナイーター","鋭い眼光","逃げ駆け引き","先行駆け引き","差し駆け引き","追込駆け引き","逃げためらい","先行ためらい","差しためらい","追込ためらい","後方釘付","スピードイーター","束縛","まなざし","土煙","圧迫感","布石","リスタート"];
let acc_skills = ["本領発揮","直線一気","先駆け","ワンチャンス","レースの真髄・根","アオハル点火・力","がむしゃら","差し切り体勢","真っ向勝負","一足飛び","コーナー加速○","直線加速","垂れウマ回避","押し切り準備","スプリントギア","上昇気流","善後策","アクセラレーション","二の矢","巧みなステップ","直滑降","まき直し","登山家","地固め","意気込み十分","急浮上","がんばり屋"];
let sight_skills = ["ホークアイ","読解力","お見通し","策士","目くらまし"];
let move_skills = ["ポジションセンス","臨機応変","仕掛け準備","イナズマステップ","危険回避","前列狙い"];
let etc_skills = ["集中力"];

var is_first_load = true;

var target2;
var obs2;

(function() {
    window.onload = function() {
        const options = {
            childList: false, //直接の子の変更を監視
            characterData: true,　 //文字の変化を監視
            characterDataOldValue: false,　//属性の変化前を記録
            attributes: true,　 //属性の変化を監視
            subtree: false, //全ての子要素を監視
        }

        function is_heal_skill(skill_name) {
            //alert(skill_name);
            return heal_skills.includes(skill_name);
        }
        function is_passive_skill(skill_name) {
            //alert(skill_name);
            return passive_skills.includes(skill_name);
        }
        function is_debuff_skill(skill_name) {
            //alert(skill_name);
            return debuff_skills.includes(skill_name);
        }
        function is_acc_skill(skill_name) {
            //alert(skill_name);
            return acc_skills.includes(skill_name);
        }
        function is_sight_skill(skill_name) {
            //alert(skill_name);
            return sight_skills.includes(skill_name);
        }
        function is_move_skill(skill_name) {
            //alert(skill_name);
            return move_skills.includes(skill_name);
        }
        function is_etc_skill(skill_name) {
            //alert(skill_name);
            return etc_skills.includes(skill_name);
        }

        function is_oya_skill(skill_name) {
            return skill_name.match(/代表/);
        }

        function add_skill_array(arr, h) {
            arr.push(h)
        }

        function format() {
            var $uma_inshi_blocks = $('#__BVID__42 .col-10');
            $uma_inshi_blocks.each(function(index, e) {
                if ($(e).attr('comp') === 'true') {
                    return;
                }

                let p_div = $(e).children().eq(3);
                let r_div = $(e).children().eq(4);
                let s_div = $(e).children().eq(5);

                var heal_skill_block = [];
                var passive_skill_block = [];
                var debuff_skill_block = [];
                var acc_skill_block = [];
                var sight_skill_block = [];
                var move_skill_block = [];
                var etc_skill_block = [];
                var speed_skill_block = [];

                $(e).find('.factor4').each(function(j, ce) {
                    var txt = $(ce).eq(0).text().replace(/\s+/g, '');
                    let temp_h = $(ce).html();
                    let h = "<span data-v-ee90f09c='' class='factor factor4'>" + temp_h + "</span>";

                    if ($('#oya_only').is(':checked')) {
                        if (!is_oya_skill(txt)) {
                            $(ce).hide();
                            return true;
                        }
                    }

                    txt = txt.replace(/（.*/g, '').slice(0, -1);

                    if (is_heal_skill(txt)) {
                        add_skill_array(heal_skill_block, h);
                    } else if (is_passive_skill(txt)) {
                        add_skill_array(passive_skill_block, h);
                    } else if (is_debuff_skill(txt)) {
                        add_skill_array(debuff_skill_block, h);
                    } else if (is_acc_skill(txt)) {
                        add_skill_array(acc_skill_block, h);
                    } else if (is_sight_skill(txt)) {
                        add_skill_array(sight_skill_block, h);
                    } else if (is_move_skill(txt)) {
                        add_skill_array(move_skill_block, h);
                    } else if (is_etc_skill(txt)) {
                        add_skill_array(etc_skill_block, h);
                    } else {
                        add_skill_array(speed_skill_block, h);
                    }
                    $(ce).hide();

                });

                var skill_index
                p_div.prepend("<div class='etc_skill_block'>その他スキル</br></div>");
                if (etc_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < etc_skill_block.length; skill_index++) {
                        p_div.find(".etc_skill_block").append(etc_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".etc_skill_block").append('なし');
                }
                p_div.prepend("<div class='debuff_skill_block'>デバフスキル</br></div>");
                if (debuff_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < debuff_skill_block.length; skill_index++) {
                        p_div.find(".debuff_skill_block").append(debuff_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".debuff_skill_block").append('なし');
                }
                p_div.prepend("<div class='sight_skill_block'>視界スキル</br></div>");
                if (sight_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < sight_skill_block.length; skill_index++) {
                        p_div.find(".sight_skill_block").append(sight_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".sight_skill_block").append('なし');
                }
                p_div.prepend("<div class='move_skill_block'>レーン移動スキル</br></div>");
                if (move_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < move_skill_block.length; skill_index++) {
                        p_div.find(".move_skill_block").append(move_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".move_skill_block").append('なし');
                }
                p_div.prepend("<div class='heal_skill_block'>回復スキル</br></div>");
                if (heal_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < heal_skill_block.length; skill_index++) {
                        p_div.find(".heal_skill_block").append(heal_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".heal_skill_block").append('なし');
                }
                p_div.prepend("<div class='acc_skill_block'>加速スキル</br></div>");
                if (acc_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < acc_skill_block.length; skill_index++) {
                        p_div.find(".acc_skill_block").append(acc_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".acc_skill_block").append('なし');
                }
                p_div.prepend("<div class='speed_skill_block'>速度スキル</br></div>");
                if (speed_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < speed_skill_block.length; skill_index++) {
                        p_div.find(".speed_skill_block").append(speed_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".speed_skill_block").append('なし');
                }
                p_div.prepend("<div class='passive_skill_block'>緑スキル</br></div>");
                if (passive_skill_block.length > 0) {
                    for (skill_index = 0; skill_index < passive_skill_block.length; skill_index++) {
                        p_div.find(".passive_skill_block").append(passive_skill_block[skill_index]);
                    }
                } else {
                    p_div.find(".passive_skill_block").append('なし');
                }

                r_div.prepend("<div class='race_skill_block'>レース場スキル</br></div>");
                var $fact5 = $(e).find('.factor5');
                if ($fact5.length == 0) {
                    r_div.find('.race_skill_block').append('なし');
                } else {
                    if ($('#oya_only').is(':checked')) {
                        $fact5.each(function(k, re) {
                            var txt = $(re).eq(0).text().replace(/\s+/g, '');
                            if (!is_oya_skill(txt)) {
                                $(re).hide();
                                return true;
                            }
                        });
                    }
                }
                s_div.prepend("<div class='scinario_skill_block'>シナリオスキル</br></div>");
                var $fact6 = $(e).find('.factor6');
                if ($fact6.length == 0) {
                    s_div.find('.scinario_skill_block').append('なし');
                } else {
                    if ($('#oya_only').is(':checked')) {
                        $fact6.each(function(k, se) {
                            var txt = $(se).eq(0).text().replace(/\s+/g, '');
                            if (!is_oya_skill(txt)) {
                                $(se).hide();
                                return true;
                            }
                        });
                    }
                }

                $(e).attr('comp', true);
            });

        }

        function delete_before_data() {
            let $uma_inshi_blocks = $('#__BVID__42 .col-10');
            $uma_inshi_blocks.each(function(index, e) {
                $(e).attr('comp', false);
                $(e).find("[class$='block']").each(function(i, ce) {
                    $(ce).remove();
                });
                $(e).find('.factor4').each(function(j, ce2) {
                    $(ce2).show();
                });
            });
        }

        function callback2(mutationsList, observer) {
            for(const mutation of mutationsList) {
                // 処理
                delete_before_data();
                format();
            }
            //ターゲット要素の監視を停止
           // obs.disconnect();
        }

        function callback(mutationsList, observer) {
            for(const mutation of mutationsList) {
                // 処理
                //alert(); //ターゲット要素
                if (mutation.target.getAttribute('aria-busy') === 'false') {

                    if (mutation.target.getAttribute('aria-rowcount') == null) {
                        return false;
                    }
                    if (is_first_load) {
                        format();
                        target2 = target.children[1].children[0];
                        // alert(target2);
                        obs2 = new MutationObserver(callback2);
                        obs2.observe(target2, options);
                        is_first_load = false;
                    } else {
                        delete_before_data();
                        format();
                        obs2.disconnect();
                        target2 = target.children[1].children[0];
                        // alert(target2);
                        obs2 = new MutationObserver(callback2);
                        obs2.observe(target2, options);
                    }

                }
            }
            //ターゲット要素の監視を停止
           // obs.disconnect();
        }

        function addScrollingBoxStyle($dom) {
            $dom.css('position', '-webkit-sticky');
            $dom.css('position', 'sticky');
            $dom.css('top', '0px');
            $dom.css('display', 'flex');
            $dom.css('justify-content', 'flex-end');
            $dom.css('z-index', '20000');

            return $dom;
        }

        function nav_styling($dom) {
            $dom.css('background', '#fff');
            $dom.css('border', '1px solid #eee');
            $dom.css('box-shadow', '0 0 5px #ddd');
            $dom.css('padding', '20px');
            $dom.css('width', '220px');


            return $dom;
        }

        function createScrollingBox() {
            var $checkbox = $("<label for='oya_only'><input type='checkbox' id='oya_only' /> 代表のみで絞り込み</label>");
            var $scrollingBox = addScrollingBoxStyle($('<div></div>'));
            var $nav = nav_styling($('<nav></nav>'));
            $nav = $nav.append('<div>' + $checkbox.prop('outerHTML') + '</div>');
            var $html = $scrollingBox.append($nav);

            return $html;
        }
        if (!($('#oya_only').length)) {
            var $html = createScrollingBox();
            // alert($html.prop('outerHTML'));
            $('#app').prepend($html.prop('outerHTML'));
        }


        //ターゲット要素をDOMで取得
        const target = document.getElementById('__BVID__42');
        if (target == null) {
            return false;
        }
        //インスタンス化
        const obs = new MutationObserver(callback);
        //ターゲット要素の監視を開始
        obs.observe(target, options);

    }
})();