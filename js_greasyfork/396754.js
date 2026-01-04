// ==UserScript==
// @name         sengokuixa-AutoSynthesis
// @version      2.0.1
// @description  戦国IXA用 自動合成
// @author       nameless
// @match        https://*.sengokuixa.jp/union/levelup.php
// @grant        none
// @namespace    https://greasyfork.org/users/442464
// @downloadURL https://update.greasyfork.org/scripts/396754/sengokuixa-AutoSynthesis.user.js
// @updateURL https://update.greasyfork.org/scripts/396754/sengokuixa-AutoSynthesis.meta.js
// ==/UserScript==


if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
    loadScript();
} else {
    window.addEventListener('DOMContentLoaded', (event) => { loadScript(); });
}

function loadScript() {
  var scriptElement = document.createElement('script');
  scriptElement.setAttribute('type','text/javascript');
  scriptElement.textContent = '(' + Init.toString() + ')(j213$);';
  document.body.appendChild(scriptElement);
}
/*
window.addEventListener('DOMContentLoaded', function () {
    console.log('Init2')
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.textContent = '(' + Init.toString() + ')(j213$);';
    document.body.appendChild(scriptElement);
});
*/

function Init($) {
    console.log('Init')
    let $LogBox = null;

    let xrwStatusText = function (xhr) {
        return xhr.setRequestHeader('X-Requested-With', 'statusText');
    };

    function log(s) {
        if ($LogBox && $LogBox.length) {
            $LogBox.val($LogBox.val() + s + "\n");
            $LogBox.scrollTop($LogBox[0].scrollHeight);
        }
        else {
            console.log(s);
        }
    }

    let exitFlg = false,
        errFlg = false;

    function autoSkillLvUp(cardId) {
        const WaitTime = 100;
        const RequireExp = [0, 0, 300, 800, 1800, 4000, 7000, 12000, 18000, 28000, 40000];
        const RequireExpSkill4 = [0, 0, 900, 2400, 5400, 12000, 21000, 36000, 54000, 84000, 120000];
        const RarityName = { 'jo': '序', 'jou': '上', 'toku': '特', 'goku': '極', 'ten': '天' };
        const FixedExp = { 'jo': 350, 'jou': 600, 'toku': 2000, };
        // 育成期間の1.2倍とかのテキストを取得する
        //const CampaignFactor = $('#hoge').length ? Number($('#hoge').text().match(/経験値が(\d\.\d+)倍/)[1]) : 1;
        const CampaignFactor = 1; // 要素や文言が判明するまで仮で1固定

        // 入力値を保存
        localStorage.setItem('AutoSynthesis_TargetLv', $('#TargetLv').val());
        localStorage.setItem('AutoSynthesis_SenKujiNum', $('#SenKujiNum').val());
        localStorage.setItem('AutoSynthesis_ExcludeJou', $('#ExcludeJou').prop('checked'));
        localStorage.setItem('AutoSynthesis_ExcludeToku', $('#ExcludeToku').prop('checked'));
        localStorage.setItem('AutoSynthesis_ExcludeNames', $('#ExcludeNames').val());
        localStorage.setItem('AutoSynthesis_ExcludeSkills', $('#ExcludeSkills').val());
        localStorage.setItem('AutoSynthesis_TenShots', $('#TenShots').prop('checked'));
        localStorage.setItem('AutoSynthesis_TenShotsHidden', $('#TenShotsHidden').val());

        // 合成ボタンロック
        let $submit = $("#ASSubmit");
        $submit.val('合成中...');
        $submit.off('click');
        $submit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#44C), to(#116))', });
        let $inputselect = $('#AutoSkillUpMenu').find('input:not("#TenShotsHidden"), select');
        $inputselect.prop('disabled', true);
        let $exit = $("#ASExit");
        $exit.prop('disabled', false);
        $exit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#C44), to(#611))', });

        let targetLv = Number($('#TargetLv').val()),
            kujiNum = Number($('#SenKujiNum').val()),
            restDosen = -1,
            senkujiToken = "",
            capaMargin = -1,
            jqXHRList = [],
            cardInfoList = [],
            skill_id = [],
            skillIdList = [],
            excludeRarity = [],
            excludeNames = [],
            tenShots = false,
            excludeSkills = [],
            subId = "";

        class CardInfo {
            constructor(id, name, rarity, skill, exp) {
                this.id = id;
                this.name = name;
                this.rarity = rarity;
                this.skill = skill;
                this.exp = exp;
            }
        }

        // スキルレベルアップ
        function skillLvUp() {
            let finished = false;

            log('合成実行...');
            let postData = {
                select_card_group: $('input[name="select_card_group"]').val(),
                select_hp_status: $('input[name="select_hp_status"]').val(),
                common_filter_change_flg: $('input[name="common_filter_change_flg"]').val(),
                select_filter_num: $('input[name="select_filter_num"]').val(),
                show_deck_card_count: $('input[name="show_deck_card_count"]').val(),
                material_arr: $.map(cardInfoList, function (ci) { return ci.id; }),
                skill_radio: skill_id,
                base_cid: $('input[name="base_cid"]').val(),
                add_flg: $('input[name="add_flg"]').val(),
                new_cid: $('input[name="new_cid"]').val(),
                remove_cid: $('input[name="remove_cid"]').val(),
                selected_skill_radio: $('input[name="selected_skill_radio"]').val(),
                p: 1,
                selected_cid: $('input[name="selected_cid"]').val(),
                deck_mode: $('input[name="deck_mode"]').val(),
                union_type: $('input[name="union_type"]').val(),
                btn_change_flg: $('input[name="btn_change_flg"]').val(),
                use_cp_flg: 0,
                exec_btn: 1,
                sub_id: $('input[name="sub_id"]').val(),
            };
            if ($('input[name="ad_id"]').length) {
              postData.ad_id = $('input[name="ad_id"]').val();
            }

            $.ajax({
                type: 'post',
                url: '/union/levelup_execute.php',
                data: postData,
                beforeSend: xrwStatusText
            }).then(function (html) {
                // 合成結果確認
                let resultType = $(html).find('div.common_box1bottom > p.mb10 > img').attr('alt'),
                    expNum = $(html).find('p.new_union_result_para > strong.red').text();

                if (resultType.match(/合成方法/)) {
                    console.log(postData);
                    exit('エラー：合成失敗');
                    finished = true;
                }
                else {
                    log(`⇒ ${resultType} : exp ${expNum} 獲得`);

                    // 合成結果スキル毎確認
                    let nextLvSum = 0;
                    $(html).find('div.new_union_result_detail > div.skill_result').each(function () {
                        let $title = $(this).find('p.title'),
                            name = $title.text().match(/([^LV\s]+)LV/),
                            lv = 0,
                            exp_info = 0,
                            exp_bar_width = "0%";
                        let title_text = $title.text().match(/\s/g);
                        if (title_text !== null) {
                            if (title_text.length >= 2) {
                                title_text = $title.text().replace(/(.*)LV\d+/, '');
                                name = title_text.match(/([^LV\s]+)LV/);
                            }
                        }
                        if (name) {
                            name = name[1];
                        }
                        else {
                            name = $title.text().match(/([^LV\s]+)\sLV/)[1];
                        }
                        $(html).find('span.ig_skill_name').each(function () {
                            let matches = $(this).text().match(/(\S+)LV(\d+)/);
                            if (!matches) matches = $(this).text().match(/(\S+)\sLV(\d+)/);
                            if (matches && matches.length > 2 && matches[1] == name)
                                lv = Number(matches[2]);
                        });
                        // 目標Lvに到達したか？
                        if (lv < 10) exp_info = $(this).find('div.next_exp').children().eq(0).find('span.num').data('last_exp');
                        if (lv >= targetLv) {
                            // すべてのスキルが到達したなら終了
                            $('table.skill_list_table').find('td.name').each(function () {
                                let matches = $(this).text().match(/(\S+)LV(\d+)/);
                                if (!matches) matches = $(this).text().match(/(\S+)\sLV(\d+)/);
                                if (matches && matches.length > 2 && matches[1] == name) {
                                    $(this).prev().children().eq(0).prop('checked', false);
                                    getSkillIds();
                                    if (!(skill_id.length)) finished = true;
                                }
                            });
                        }

                        exp_bar_width = $(this).data('last_skill_per') + "%";

                        // 合成結果を合成画面に反映
                        $('table.skill_list_table > tbody > tr').each(function (index) {
                            let matches = $(this).find('td.name').text().match(/(\S+)LV(\d+)/);
                            if (!matches) matches = $(this).find('td.name').text().match(/(\S+)\sLV(\d+)/);
                            if (matches && matches.length > 2 && matches[1] == name) {
                                let prevLv = Number(matches[2]);
                                if (prevLv != lv) {
                                    let matches = $(this).find('th > input').val().match(/(\S+)(\d)/);
                                    if (matches && matches.length > 2) {
                                        $(this).find('th > input').val(matches[1] + (Number(matches[2]) + (lv - prevLv)));
                                        getSkillIds();
                                    }
                                    else {
                                        exit('エラー：スキルID更新エラー');
                                        finished = true;
                                    }

                                    $(this).find('td.name').text(name + "LV" + lv);
                                    $(this).find('td.name').animate({ 'backgroundColor': 'red' }, 1000);
                                    if (lv < 10)
                                        $(this).find('span.num').css({ 'width': '0%' });
                                }
                                $(this).find('td.next_lv').text(exp_info);
                                if (index != 3) {
                                    $(this).find('td.next_lv.max').text((Number(exp_info) + RequireExp[10] - RequireExp[lv + 1]) || '-');
                                    if ($.isNumeric($(this).find('td.next_lv.max').text())) {
                                        nextLvSum += Number($(this).find('td.next_lv.max').text());
                                    }
                                }
                                else {
                                    $(this).find('td.next_lv.max').text((Number(exp_info) + RequireExpSkill4[10] - RequireExpSkill4[lv + 1]) || '-');
                                    if ($.isNumeric($(this).find('td.next_lv.max').text())) {
                                        nextLvSum += Number($(this).find('td.next_lv.max').text());
                                    }
                                }
                                $(this).find('span.num').animate({ 'width': exp_bar_width }, 1000);
                            }
                        });
                    });
                    $('span.get_full_exp').text(nextLvSum);
                }

                jqXHRList = [];
                cardInfoList = [];

                if (exitFlg) {
                    finished = true;
                    exit('===処理が中断されました===');
                }

                if (errFlg) {
                    finished = true;
                }

                //log(`finished = ${finished}`);
                // 目標Lvに到達していないならもう一度
                if (!finished) {
                    getKujiToken(kujiNum).then(function () {
                        castSenKuji('0', kujiNum, senkujiToken).then(skillLvUp);
                    }, function () {
                        exit('---合成終了---');
                    });
                }
                else {
                    getKujiToken(-1).then(function () {
                        exit('---合成終了---');
                    });
                }
            });
        }

        // トークンと所持枠・所持銅銭取得
        function getKujiToken(checkNum) {
            let deferred = new $.Deferred;

            if (exitFlg) {
                exit('===処理が中断されました===');
                return deferred.reject();
            }

            $.ajax(
                {
                    type: 'post',
                    url: '/senkuji/senkuji.php',
                    beforeSend: xrwStatusText
                }
            ).then(function (html) {
                let nums = $(html).find('p.l_cardstock').text().match(/(\d+) \/ (\d+)/);
                capaMargin = Number(nums[2]) - Number(nums[1]);
                restDosen = Number($(html).find('span.money_b').text().replace("万", ""));
                senkujiToken = $(html).find('input[name="senkuji_token"]').val(),
                subId = $(html).find('input[name="sub_id"]').val() || 0;
                log(`■所持枠空き: ${capaMargin}, 銅銭： ${restDosen}`);

                // 終了判定 log(`${checkNum} !!`);
                if (checkNum > 0) {
                    // 所持枠確認 log(`${capaMargin} ? ${checkNum}`);
                    if (capaMargin >= checkNum) {
                        // 銅銭確認 log(`${restDosen} ? ${500 * checkNum}`);
                        if (restDosen >= 500 * checkNum) {
                            //log('再実行可能');
                            deferred.resolve();
                        }
                        else {
                            exit('銅銭が足りません');
                            deferred.reject();
                        }
                    }
                    else {
                        exit('カード所持枠が足りません');
                        deferred.reject();
                    }
                }
                else {
                    $('span.money_b').text(restDosen);
                    deferred.resolve();
                }
            }, function () {
                exit('通信エラー:クジ画面取得失敗');
                deferred.reject();
            });

            return deferred.promise();
        }

        // 指定枚数まで一枚ずつくじ引き
        function castSenKuji(t, n, token) {
            let deferred = new $.Deferred;
            let count = 0;
            let excludeCnt = 0;

            function cast(t, n, token, deferred) {
                if (exitFlg) {
                    exit('===処理が中断されました===');
                    return deferred.reject();
                }

                $.ajax({
                    type: 'post',
                    url: '/senkuji/play_senkuji.php',
                    data: { send: 'send', got_type: t, senkuji_token: token, sub_id: subId, },
                    beforeSend: xrwStatusText
                }).then(function (html) {
                    // 白くじを引けなかったら終了
                    if (!$(html).find('div.cardstatus').length) {
                        log('エラー : 白くじ獲得失敗 [1000枚制限]');
                        errFlg = true;
                        if (count == 0) {
                            exit('---合成終了---');
                            return deferred.reject();
                        }
                        else {
                            log('===ここまでのカードを合成します===');
                            return deferred.resolve();
                        }
                    }

                    $(html).find('div.cardstatus').each(function () {
                        tenShots = false;
                        if ($('#TenShotsHidden').val() == '1') {
                            tenShots = true;
                        }

                        let $card = $(this).find('div.parameta_area');
                        let cardId = $card.find('span.commandsol_').attr('id').match(/card_commandsol_(\d+)/)[1];
                        let card_name = $(this).find('span.ig_card_name').text(),
                            rarity = $(this).find('span[class^="rarity_"]').attr('class').match(/rarity_([a-z]+)/)[1],
                            skill_name = $(this).find('span.ig_skill_name').text().match(/(\S+)LV/)[1],
                            exp = FixedExp[rarity] * CampaignFactor;

                        s = "　[" + RarityName[rarity] + "] " + card_name + " (" + skill_name + ")";

                        // 指定された条件で除外
                        if (excludeRarity.indexOf(rarity) == -1 && excludeNames.indexOf(card_name) == -1 && excludeSkills.indexOf(skill_name) == -1) {
                            log(s);
                            cardInfoList.push(new CardInfo(cardId, card_name, rarity, skill_name, exp));
                        }
                        else {
                            log(`${s} : 除外`);
                            excludeCnt++;
                        }

                        count++;
                    });

                    if (tenShots && cardInfoList.length == 0) {
                        log(`素材： ${cardInfoList.length} 枚取得[除外 ${excludeCnt} 枚] --- 再度10連`);
                        setTimeout(cast.bind(null, t, n, token, deferred), WaitTime);
                    }

                    // 必要経験値に到達したら終了
                    let totalRequiredExp = Number($('span.get_full_exp').text()),
                        expectedExp = cardInfoList.reduce((sum, elm) => sum + elm.exp, 0);
                    if (expectedExp >= totalRequiredExp) {
                        log(`素材 ${cardInfoList.length} 枚取得完了[除外 ${excludeCnt} 枚] : 必要経験値到達`);
                        return deferred.resolve();
                    }

                    if (!tenShots) {
                        if (kujiNum - cardInfoList.length <= 10) {
                            t = '0';
                        }

                        // 指定枚数に達してないならもう一度
                        if (cardInfoList.length < kujiNum) {
                            //log(`${count} < ${kujiNum}`);
                            if (count < n) {
                                setTimeout(cast.bind(null, t, n, token, deferred), WaitTime);
                            }
                            else {
                                // 再度所持枠・銅銭確認
                                let m = kujiNum - cardInfoList.length;
                                count = 0;
                                log(`${m} 枚不足`);
                                getKujiToken(m).then(function () {
                                    if (exitFlg) {
                                        exit('===処理が中断されました===');
                                        return deferred.reject();
                                    }
                                    setTimeout(cast.bind(null, t, m, token, deferred), WaitTime);
                                }, function () {
                                    exit('---合成終了---');
                                    deferred.reject();
                                });
                            }

                        }
                        else {
                            log(`素材 ${cardInfoList.length} 枚取得完了[除外 ${excludeCnt} 枚]`);
                            deferred.resolve();
                        }
                    }
                    else {
                        if (cardInfoList.length + 10 <= kujiNum) {
                            let nums2 = $(html).find('p.l_cardstock').text().match(/(\d+) \/ (\d+)/);
                                capaMargin2 = Number(nums2[2]) - Number(nums2[1]);
                                restDosen2 = Number($(html).find('span.money_b').text().replace("万", ""));
                            if (capaMargin2 < 10) {
                                log('カード所持枠が足りなくなりました');
                                log('===合成を実行します===');
                                log(`素材 ${cardInfoList.length} 枚取得[除外 ${excludeCnt} 枚]`);
                                return deferred.resolve();
                            }
                            else if (restDosen2 < 5000) {
                                errFlg = true;
                                log('銅銭が足りなくなりました');
                                log('===ここまでのカードを合成します===');
                                log(`素材 ${cardInfoList.length} 枚取得[除外 ${excludeCnt} 枚]`);
                                return deferred.resolve();
                            }
                            else {
                                setTimeout(cast.bind(null, t, n, token, deferred), WaitTime);
                            }
                        }
                        else {
                            log(`素材 ${cardInfoList.length} 枚取得完了[除外 ${excludeCnt} 枚]`);
                            deferred.resolve();
                        }
                    }
                }, function () {
                    exit('通信エラー：くじ引き失敗');
                    deferred.reject();
                });
            }

            if (n >= 10) t = '1320';
            log(`白くじ ${n} 枚引き中...`);
            cast(t, n, token, deferred);

            return deferred.promise();
        }

        // selected_skill_radioのための文字列作成＆スキル名⇔ID配列確保
        // 目標Lvに到達したスキルはチェックを外す
        function getSkillIds() {
            if (true === skill_level_exp_collect_enable) {
                skill_id = $('input[name="skill_radio[]"]:checked').map(function () {
                    let matches = $(this).parent().next().text().match(/(\S+)LV(\d+)/);
                    if (!matches) matches = $(this).parent().next().text().match(/(\S+)\sLV(\d+)/);
                    if (matches && matches.length > 2) {
                        let lv = Number(matches[2]);
                        if (lv < targetLv) {
                            skillIdList[matches[1]] = $(this).val();
                            return $(this).val();
                        }
                        else {
                            log(`${matches[1]} は既に LV${targetLv} 以上です`);
                            $(this).prop('checked', false);
                        }
                    }
                }).get();
            }
            else {
                skill_id = $('input[name="skill_radio"]:checked').val();
            }

            if (skill_id.length)
                $('input[name="selected_skill_radio"]').val(skill_id.join(','));
        }

        // 開始ボタン復帰
        function exit(s) {
            log(s);
            $submit.val('開始');
            $submit.prop('disabled', false);
            $submit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#C44), to(#611))', });
            $submit.on('click', autoSkillLvUp.bind(null, $('input[name="base_cid"]').val()));
            $inputselect.prop('disabled', false);
            $exit.prop('disabled', true);
            $exit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#444), to(#666))', });
            exitFlg = false;
            errFlg = false;
            if (Number($('#SenKujiNum').val()) % 10 == 0) {
                $('#TenShots').prop('disabled', false);
            }
            else {
                $('#TenShots').prop('disabled', true);
            }
            if ($('#TenShots').prop('checked') && !$('#TenShots').prop('disabled')) {
                $('#TenShotsHidden').val('1');
            }
            else {
                $('#TenShotsHidden').val('0');
            }
        }

        //-----------------------------------------------------

        if (!(targetLv >= 2 && targetLv <= 10)) {
            exit('エラー：目標レベルを入力して下さい(2～10)');
            return;
        }

        if (!(kujiNum >= 1 && kujiNum <= 100)) {
            exit('エラー：素材カード数/回を入力して下さい(1～100)');
            return;
        }

        if (eval($('#ExcludeJou').prop('checked')))
            excludeRarity.push('jou');
        if (eval($('#ExcludeToku').prop('checked')))
            excludeRarity.push('toku')

        excludeNames = $('#ExcludeNames').val().split(',');
        excludeSkills = $('#ExcludeSkills').val().split(',');

        getSkillIds();

        // 合成対象スキルがチェックされているか？
        if (skill_id.length) {
            getKujiToken(kujiNum).then(function () {
                castSenKuji('0', kujiNum, senkujiToken).then(skillLvUp);
            }, function () {
                exit('---合成終了---');
            });
        }
        else {
            exit('強化するスキルを選んでください');
        }
    }

    // levelUp用UI設置
    if (location.pathname == '/union/levelup.php') {
        const createOptions = function (id, start, end, selected) {
            let str = '<select id="' + id + '">';
            for (let n = start; n <= end; n++) {
                str += '<option value="' + n + '"';
                if (n == selected) {
                    str += ' selected';
                }
                str += '>' + n + '</option>';
            }
            str += '</select>';
            return str;
        }

        const cssClass = [
            ".AS_header { margin-bottom: 2px; padding: 5px; background-color: rgb(197,181,96); color: black;" +
            'font: bold 18px/140% "ＭＳ 明朝", serif; text-align: center; text-shadow: 1px 1px 1px rgba(0,0,0,0.1), -1px 1px 1px rgba(0,0,0,0.1), 1px -1px 1px rgba(0,0,0,0.1), -1px -1px 1px rgba(0,0,0,0.1); }',
            ".AS_contents { " + 'font-family: "ＭＳ 明朝"; ' + "display: flex; align-items: top; height: 250px; padding: 4px; background-color: rgb(43,41,37); }",
            ".AS_inputBoxContainer { width: 430px; margin-right: 5px; background-color: rgb(43,41,37); }",
            ".AS_inputInlineContainer { display: flex; align-items: center; padding: 2px; background-color: rgb(43,41,37); }",
            ".AS_inputText1 { width: 45px; height: 20px; border: none; border-bottom: white 1px solid; background-color: rgb(43,41,37); color: white; }",
            ".AS_inputText2 { flex: 1; border: none; border-bottom: white 1px solid; background-color: rgb(43,41,37); color: white; }",
            '.AS_logTextBox { flex: 1; align-self: stretch; border: white 1px solid; padding: 2px; background-color: rgb(24,24,24); color: white; font:12px/110% "ＭＳ 明朝", serif; }',
        ];

        let style = document.createElement("style");
        document.head.appendChild(style);

        let sheet = style.sheet;
        for (let i = 0; i < cssClass.length; i++) {
            sheet.insertRule(cssClass[i], sheet.cssRules.length);
        }

        let $menu = $('<div id="AutoSkillUpMenu">').css({ 'margin': '10px 16.5px', 'color': 'white', });
        let $head = $('<div>').addClass('AS_header').text('自動レベルアップ ').appendTo($menu);
        $('<img src="../img/lot/lot_tab_title_white10.png" alt="戦国くじ【白】拾連">').css({ 'display': 'inline', 'vertical-align': 'middle', 'width': '57px', 'height': '20px', 'margin-bottom': '4px', }).appendTo($head);
        $head.prop('innerHTML', $head.prop('innerHTML') + '＆素材100枚 対応版');
        let $contents = $('<div>').addClass('AS_contents').appendTo($menu);
        let $inputBox = $('<div>').addClass('AS_inputBoxContainer').appendTo($contents);

        let $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<p>').css({ 'height': '1px', }).appendTo($inputs);
        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="TargetLv">').css({ 'padding': '0px 5px 0px 5px', }).text('目標スキルLV').appendTo($inputs);
        $(createOptions('TargetLv', 2, 10, localStorage.getItem('AutoSynthesis_TargetLv') || 10)).addClass('AS_inputText1').appendTo($inputs)
        $('<label for="SenKujiNum">').css({ 'padding': '0px 10px 0px 25px', }).text('素材カード数/回').appendTo($inputs);
        $(createOptions('SenKujiNum', 1, 12, localStorage.getItem('AutoSynthesis_SenKujiNum') || 12)).addClass('AS_inputText1').appendTo($inputs);
        $('<input id="ASExit" type="button" value="停止" disabled>').css({
            'width': '50px', 'padding': '2px 5px', 'border': 'white 1px solid', 'border-radius': '5px', 'background-color': '#BBB', 'color': 'white',
            'background-image': '-webkit-gradient(linear, left top, left bottom, from(#444), to(#666))', 'margin-left': 'auto',
        }).appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label>').css({ 'padding': '0px 5px 0px 5px', 'height': '20px', 'display': 'flex', 'align-items': 'center', }).text('除外レア　　').appendTo($inputs);
        $('<input id="ExcludeJou" type="checkbox">').css({ 'margin-right': '2px', }).appendTo($inputs);
        $('<img src = "../img/card/icon/icon_jou.png">').css({ 'width': '18px', 'height': '18px', }).appendTo($inputs);
        $('<input id="ExcludeToku" type="checkbox">').css({ 'margin': '0px 2px 0px 12px', }).appendTo($inputs);
        $('<img src = "../img/card/icon/icon_toku.png">').css({ 'width': '18px', 'height': '18px', }).appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').css('margin-bottom', '1px').appendTo($inputBox);
        $('<label for="ExcludeNames">').css({ 'padding': '0px 5px', }).text('除外武将名　').appendTo($inputs);
        $(`<input id="ExcludeNames" type="text" value="${localStorage.getItem('AutoSynthesis_ExcludeNames') || ''}">`).addClass('AS_inputText2').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="ExcludeSkills">').css({ 'padding': '0px 5px', }).text('除外スキル　').appendTo($inputs);
        $(`<input id="ExcludeSkills" type="text" value="${localStorage.getItem('AutoSynthesis_ExcludeSkills') || ''}">`).addClass('AS_inputText2').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="TenShots">').css({ 'padding': '0px 5px 0px 5px', 'height': '20px', 'display': 'flex', 'align-items': 'center', }).text('10連のみ　　').appendTo($inputs);
        $('<input id="TenShots" type="checkbox">').appendTo($inputs);
        $('<input id="TenShotsHidden" type="hidden" value="0">').appendTo($inputs);
        $('<label>素材カード数が10の倍数の時のみ選択可能(引き直し無し)</label>').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<input id="ASSubmit" type="button" value="開始">').css({
            'flex': '1', 'padding': '2px 5px', 'border': 'white 1px solid', 'border-radius': '5px', 'background-color': 'rgb(168,41,37)', 'color': 'white',
            'background-image': '-webkit-gradient(linear, left top, left bottom, from(#C44), to(#611))',
        }).appendTo($inputs).on('click', autoSkillLvUp.bind(null, $('input[name="base_cid"]').val()));

        $LogBox = $('<textarea id="LogBox" type="textbox" value="">').addClass('AS_logTextBox').appendTo($contents);

        if ($('.ig_deck_subcardarea').find('#id_deck_card1_front').length) {
            $('table#cardslot_table').after($menu);
        }

        //素材100枚対応
        for (let r = 20; r <= 100; r = r + 10) {
            $(document).find('#SenKujiNum').append($('<option value="' + r + '">' + r + '</option>'));
        }
        let storageVal = localStorage.getItem('AutoSynthesis_SenKujiNum');
        if (storageVal) {
            $(document).find('#SenKujiNum').val(storageVal);
        }
        else {
            $(document).find('#SenKujiNum').val('100');
        }

        if (eval(localStorage.getItem('AutoSynthesis_ExcludeJou'))) $('#ExcludeJou').prop('checked', true);
        if (eval(localStorage.getItem('AutoSynthesis_ExcludeToku'))) $('#ExcludeToku').prop('checked', true);
        if (eval(localStorage.getItem('AutoSynthesis_TenShots'))) $('#TenShots').prop('checked', true);
        if (Number($('#SenKujiNum').val()) % 10 == 0) {
            $('#TenShots').prop('disabled', false);
        }
        else {
            $('#TenShots').prop('disabled', true);
        }
        if ($('#TenShots').prop('checked') && !$('#TenShots').prop('disabled')) {
            $('#TenShotsHidden').val('1');
        }
    }

    $('#SenKujiNum').on('change', function () {
        if (Number($(this).val()) % 10 == 0) {
            $('#TenShots').prop('disabled', false);
            if ($('#TenShots').prop('checked')) {
                $('#TenShotsHidden').val('1');
            }
            else {
                $('#TenShotsHidden').val('0');
            }
        }
        else {
            $('#TenShots').prop('disabled', true);
            $('#TenShotsHidden').val('0');
        }
    });

    $('#ASExit').on('click', function () {
        exitFlg = true;
        return false;
    });

}

/*

function loadScript() {
  var scriptElement = document.createElement('script');
  scriptElement.setAttribute('type','text/javascript');
  scriptElement.textContent = '(' + AutoSynthesis.toString() + ')(j213$);';
  document.body.appendChild(scriptElement);
}

function AutoSynthesis($) {
    console.debug('AutoSynthesis');

    let $LogBox = null;

    let xrwStatusText = function(xhr) {
        return xhr.setRequestHeader('X-Requested-With', 'statusText');
    };

    function log(s) {
        if ($LogBox && $LogBox.length) {
            $LogBox.val($LogBox.val() + s + "\n");
            $LogBox.scrollTop($LogBox[0].scrollHeight);
        }
        else {
          //console.log(s);
        }
    }

    function autoSkillLvUp(cardId) {
        const WaitTime = 100;
        const RequireExp = [0, 0, 300, 800, 1800, 4000, 7000, 12000, 18000, 28000, 40000];
        const RarityName = { 'jo':'序', 'jou':'上', 'toku':'特', 'goku':'極', 'ten':'天' };
        const GotType = {Multi: "1320", Single: "0"};

        // 入力値を保存
        localStorage.setItem('AutoSynthesis_TargetLv', $('#TargetLv option:selected').text());
        localStorage.setItem('AutoSynthesis_SenKujiNum', $('#SenKujiNum option:selected').text());
        localStorage.setItem('AutoSynthesis_ExcludeJou', $('#ExcludeJou').prop('checked'));
        localStorage.setItem('AutoSynthesis_ExcludeToku', $('#ExcludeToku').prop('checked'));
        localStorage.setItem('AutoSynthesis_ExcludeAddSkillLevelUpChecked', $('#ExcludeAddSkillLevelUpChecked').prop('checked'));
        localStorage.setItem('AutoSynthesis_ExcludeNames', $('#ExcludeNames').val());
        localStorage.setItem('AutoSynthesis_ExcludeSkills', $('#ExcludeSkills').val());

        // 合成ボタンロック
        let $submit = $("#ASSubmit");
        $submit.val('合成中...');
        $submit.prop('disable', true);
        $submit.off('click');
        $submit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#44C), to(#116))', });

        let targetLv = Number($('#TargetLv option:selected').text()),
            kujiNum = Number($('#SenKujiNum option:selected').text()),
            restDosen = -1,
            dosen = 500,
            senkujiToken = "",
            multiSenkujiToken = "",
            capaMargin = -1,
            jqXHRList = [],
            cardInfoList = [],
            skill_id = [],
            skillIdList = [],
            excludeRarity = [],
            excludeNames = [],
            excludeSkills = [];

        class CardInfo {
            constructor(id, name, rarity, skill) {
                this.id = id;
                this.name = name;
                this.rarity = rarity;
                this.skill = skill;
            }
        }

        // スキルレベルアップ
        function skillLvUp() {
            let finished = false;

            log('合成実行...');
            let postData = {
                material_arr: $.map(cardInfoList, function (ci) { return ci.id; }),
                skill_radio: skill_id,
                base_cid: $('input[name="base_cid"]').val(),
                add_flg: $('input[name="add_flg"]').val(),
                new_cid: $('input[name="new_cid"]').val(),
                remove_cid: $('input[name="remove_cid"]').val(),
                selected_skill_radio: $('input[name="selected_skill_radio"]').val(),
                p: 1,
                selected_cid: $('input[name="selected_cid"]').val(),
                deck_mode: $('input[name="deck_mode"]').val(),
                union_type: $('input[name="union_type"]').val(),
                btn_change_flg: $('input[name="btn_change_flg"]').val(),
                use_cp_flg: 0,
                exec_btn: 1,
                sub_id: $('input[name="sub_id"]').val(),
                ad_id: $('input[name="ad_id"]').val(),  // キャンペーン
            };

            $.ajax({
                type: 'post',
                url: '/union/levelup_execute.php',
                data: postData,
                beforeSend: xrwStatusText
            }).then(function (html) {
                // 合成結果確認
                let resultType = $(html).find('div.common_box1bottom > p.mb10 > img').attr('alt'),
                    expNum = $(html).find('p.new_union_result_para > strong.red').text();

                if (resultType.match(/合成方法/)) {
                    //console.log(postData);
                    //console.log(html);
                    exit('エラー：合成失敗');
                    finished = true;
                }
                else {
                    log(`⇒ ${resultType} : exp ${expNum} 獲得`);

                    // 合成結果スキル毎確認
                    $(html).find('div.new_union_result_detail > div.skill_result').each(function () {
                        let $title = $(this).find('p.title'),
                            name = $title.text().match(/([^LV\s]+)\s?LV/)[1],
                            lv = 0,
                            exp_info = 0,
                            exp_bar_width = "0%";

                        $(html).find('span.ig_skill_name').each(function () {
                            let matches = $(this).text().match(/(\S+)\s?LV(\d+)/);
                            if (matches && matches.length > 2 && matches[1] == name)
                                lv = Number(matches[2]);
                        });

                        // 目標Lvに到達したか？
                        if (lv < 10) exp_info = $(this).find('div.next_exp').children().eq(0).find('span.num').data('last_exp');

                        if (lv >= targetLv) {
                            //console.log(html);
                            // すべてのスキルが到達したなら終了
                            $('table.skill_list_table').find('td.name').each(function () {
                                let matches = $(this).text().match(/(\S+)\s?LV(\d+)/);
                                if (matches && matches.length > 2 && matches[1] == name) {
                                    $(this).prev().children().eq(0).prop('checked', false);
                                    getSkillIds()
                                    if (!(skill_id.length)) finished = true;
                                }
                            });
                        }

                        exp_bar_width = $(this).data('last_skill_per') + "%";

                        // 合成結果を合成画面に反映
                        $('table.skill_list_table > tbody > tr').each(function () {
                            let matches = $(this).find('td.name').text().match(/(\S+)\s?LV(\d+)/);
                            if (matches && matches.length > 2 && matches[1] == name) {
                                let prevLv = Number(matches[2]);
                                if (prevLv != lv) {
                                    let matches = $(this).find('th > input').val().match(/(\S+)(\d)/);
                                    if (matches && matches.length > 2) {
                                        $(this).find('th > input').val(matches[1] + (Number(matches[2]) + (lv - prevLv)));
                                        getSkillIds();
                                    }
                                    else {
                                        exit('エラー：スキルID更新エラー');
                                        finished = true;
                                    }

                                    $(this).find('td.name').text(name + "LV" + lv);
                                    $(this).find('td.name').animate({ 'backgroundColor': 'red' }, 1000);
                                    if (lv < 10)
                                        $(this).find('span.num').css({ 'width': '0%' });
                                }
                                $(this).find('td.next_lv').text(exp_info);
                                $(this).find('td.next_lv.max').text(Number(exp_info) + RequireExp[10] - RequireExp[lv + 1]);
                                $(this).find('span.num').animate({ 'width': exp_bar_width }, 1000);
                            }
                        });
                    });
                }

                jqXHRList = [];
                cardInfoList = [];

                //log(`finished = ${finished}`);
                // 目標Lvに到達していないならもう一度
                if (!finished) {
                    getKujiToken(kujiNum).then(function () {
                        if(kujiNum >= 10){
                            castSenKuji(GotType.Multi, kujiNum, multiSenkujiToken).then(skillLvUp);
                        } else {
                            castSenKuji(GotType.Single, kujiNum, senkujiToken).then(skillLvUp);
                        }
                    }, function () {
                        exit('---合成終了---');
                    });
                }
                else {
                    getKujiToken(-1).then(function () {
                        exit('---合成終了---');
                    });
                }
            });
        }

        // トークンと所持枠・所持銅銭取得
        function getKujiToken(chekcNum) {
            let deferred = new $.Deferred;

            $.ajax({
              url: '/senkuji/play_senkuji.php',
              beforeSend: xrwStatusText
            }).then(function (html) {
                let nums = $(html).find('p.l_cardstock').text().match(/(\d+) \/ (\d+)/);
                capaMargin = Number(nums[2]) - Number(nums[1]);
                // restDosen = Number($(html).find('span.money_b').text());
                restDosen = Number($(html).find('span.money_b').text().replace(/\D/g,''));
                senkujiToken = $(html).find('input[name="senkuji_token"]').val();
                multiSenkujiToken = $(html).find('.tab_wrap.multiple [name=senkuji_token]').val();
                log(`■所持枠空き: ${capaMargin}, 銅銭： ${restDosen}`);

                //console.log(dosen);
                // 終了判定 log(`${chekcNum} !!`);
                if (chekcNum > 0) {
                    // 所持枠確認 log(`${capaMargin} ? ${chekcNum}`);
                    if (capaMargin >= chekcNum) {
                        // 銅銭確認 log(`${restDosen} ? ${dosen * chekcNum}`);
                        if (restDosen >= dosen * chekcNum) {
                            //log('再実行可能');
                            deferred.resolve();
                        }
                        else {
                            exit('銅銭が足りません');
                            deferred.reject();
                        }
                    }
                    else {
                        exit('カード所持枠が足りません');
                        deferred.reject();
                    }
                }
                else {
                    $('span.money_b').text(restDosen);
                    deferred.resolve();
                }
            }, function () {
                exit('通信エラー:クジ画面取得失敗');
                deferred.reject();
            });

            return deferred.promise();
        }

        // 指定枚数まで一枚ずつくじ引き
        function castSenKuji(t, n, token) {
            let deferred = new $.Deferred;
            let count = 0;

            function cast(t, n, token, deferred) {
                $.ajax({
                    type: 'post',
                    url: '/senkuji/play_senkuji.php',
                    data: { send: 'send', got_type: t, senkuji_token: token },
                    beforeSend: xrwStatusText
                }).then(function (html) {
                    let ids = $(html).find('span.commandsol_');
                    for(let i = 0;i < ids.length;i++){
                        let cardId = $(ids).eq(i).attr('id').match(/card_commandsol_(\d+)/)[1];
                        let $cardstatus = $(html).find('div.cardstatus').eq(i),
                        card_name = $cardstatus.find('span.ig_card_name').text(),
                        rarity = $cardstatus.find('span[class^="rarity_"]').attr('class').match(/rarity_([a-z]+)/)[1],
                        skill_name = $cardstatus.find('span.ig_skill_name').text().match(/(\S+)\s?LV/)[1];

                        s = " [" + RarityName[rarity] + "] " + card_name + " (" + skill_name + ")";

                    // 指定された条件で除外
                    if (excludeRarity.indexOf(rarity) == -1 && excludeNames.indexOf(card_name) == -1 && excludeSkills.indexOf(skill_name) == -1) {
                        log(s);
                        cardInfoList.push(new CardInfo(cardId, card_name, rarity, skill_name));
                    }
                    else {
                        log(`${s} : 除外`);
                    }

                    count++;
                        // mokoの白くじ回数に反映
                        updateWhiteLottery(1);
                    }

                    // 白くじを1000枚/日引いていたらそれ以上は合成させない
                    if(!isLimitWhiteLotter()){
                        // 指定枚数に達してないならもう一度
                        if (cardInfoList.length < kujiNum) {
                            //log(`${count} < ${kujiNum}`);
                            if (count < n) {
                                setTimeout(cast.bind(null, GotType.Single, n, senkujiToken, deferred), WaitTime);
                            }
                            else {
                                // 再度所持枠・銅銭確認
                                let m = kujiNum - cardInfoList.length;
                                count = 0;
                                log(`${m} 枚不足`);
                                getKujiToken(m).then(function () {
                                    setTimeout(cast.bind(null, "0", m, senkujiToken, deferred), WaitTime);
                                }, function () {
                                    exit('---合成終了---');
                                    deferred.reject();
                                });
                            }

                        }
                        else {
                            log(`素材 ${cardInfoList.length} 枚取得完了`);
                            deferred.resolve();
                        }
                    } else {
                      log("白くじを1000枚引き切りました。");
                      deferred.reject();
                    }
                }, function () {
                    exit('通信エラー：くじ引き失敗');
                    deferred.reject();
                });
            }

            log(`白くじ ${n} 枚引き中...`);
            cast(t, n, token, deferred);

            return deferred.promise();
        }

        // 白くじの履歴を更新
        function updateWhiteLottery(white_lottery_count){
            // 白くじの履歴を取得&更新
            var Dt = new Date();
            var now = Dt.getFullYear() + '/' + (Dt.getMonth() + 1) + '/' + Dt.getDate();
            var whiteLottery = getStorage({}, 'ixamoko_white_lottery');
            // 日を跨いでる場合は、引いた回数をリセットしておく
            if(whiteLottery.date !== now){
                whiteLottery = {date: now, count: 0};
            }

            // 引いた回数を反映
            whiteLottery.count += white_lottery_count

            // 白くじ回数の履歴を保存
            setStorage('ixamoko_white_lottery', whiteLottery);
        }

        // 白くじを上限まで引いていないかを確認
        function isLimitWhiteLotter(){
            // 白くじ履歴を0枚で更新を挟む
            updateWhiteLottery(0);
            return getStorage({}, 'ixamoko_white_lottery').count >= 1000;
        }

        // selected_skill_radioのための文字列作成＆スキル名⇔ID配列確保
        // 目標Lvに到達したスキルはチェックを外す
        function getSkillIds() {
            if (true === skill_level_exp_collect_enable) {
                skill_id = $('input[name="skill_radio[]"]:checked').map(function () {
                    let matches = $(this).parent().next().text().match(/(\S+)\s?LV(\d+)/);
                    if (matches && matches.length > 2) {
                        let lv = Number(matches[2]);
                        if (lv < targetLv) {
                            skillIdList[matches[1]] = $(this).val();
                            return $(this).val();
                        }
                        else {
                            log(`${matches[1]} は既に LV${targetLv} 以上です`);
                            $(this).prop('checked', false);
                        }
                    }
                }).get();
            }
            else {
                skill_id = $('input[name="skill_radio"]:checked').val();
            }

            if (skill_id.length)
                $('input[name="selected_skill_radio"]').val(skill_id.join(','));
        }

        // 開始ボタン復帰
        function exit(s) {
            log(s);
            $submit.val('開始');
            $submit.prop('disable', true);
            $submit.css({ 'background-image': '-webkit-gradient(linear, left top, left bottom, from(#C44), to(#611))', });
            $submit.on('click', autoSkillLvUp.bind(null, $('input[name="base_cid"]').val()));
        }

        //-----------------------------------------------------

        if (!(targetLv >= 2 && targetLv <= 10)) {
            exit('エラー：目標レベルを入力して下さい(2～10)');
            return;
        }

        if (!(kujiNum >= 1 && kujiNum <= 12)) {
            exit('エラー：素材カード数/回を入力して下さい(1～12)');
            return;
        }

        if (eval($('#ExcludeJou').prop('checked')))
            excludeRarity.push('jou');
        if (eval($('#ExcludeToku').prop('checked')))
            excludeRarity.push('toku')

        excludeNames = $('#ExcludeNames').val().split(',');
        excludeSkills = $('#ExcludeSkills').val().split(',');

        getSkillIds();

        // 合成対象スキルがチェックされているか？
        if (skill_id.length) {
            // 白くじが引けるか？
            if(!isLimitWhiteLotter()){
                getKujiToken(kujiNum).then(function () {
                    if(kujiNum >= 10){
                        castSenKuji(GotType.Multi, kujiNum, multiSenkujiToken).then(skillLvUp);
                    } else {
                        castSenKuji(GotType.Single, kujiNum, senkujiToken).then(skillLvUp);
                    }
                }, function () {
                    exit('---合成終了---');
                });
            } else {
                exit('白くじを上限まで引き切っています');
            }
        }
        else {
            exit('強化するスキルを選んでください');
        }
    }

    // levelUp用UI設置
    if (location.pathname == '/union/levelup.php') {
        const cssClass = [
            ".AS_header { margin-bottom: 2px; padding: 5px; background-color: rgb(197,181,96); color: black;" +
                'font: bold 18px/140% "ＭＳ 明朝", serif; text-align: center; text-shadow: 1px 1px 1px rgba(0,0,0,0.1), -1px 1px 1px rgba(0,0,0,0.1), 1px -1px 1px rgba(0,0,0,0.1), -1px -1px 1px rgba(0,0,0,0.1); }',
            ".AS_contents { display: flex; align-items: center; padding: 4px; background-color: rgb(43,41,37); }",
            ".AS_inputBoxContainer { width: 400px; margin-right: 5px; background-color: rgb(43,41,37); }",
            ".AS_inputInlineContainer { display: flex; align-items: center; padding: 2px; background-color: rgb(43,41,37); }",
            ".AS_inputText1 { border: none; border-bottom: white 1px solid; background-color: rgb(43,41,37); color: white; text-align: center; }",
            ".AS_inputText2 { flex: 1; border: none; border-bottom: white 1px solid; background-color: rgb(43,41,37); color: white; }",
            '.AS_logTextBox { flex: 1; align-self: stretch; border: white 1px solid; padding: 2px; background-color: rgb(24,24,24); color: white; font:12px/110% "ＭＳ 明朝", serif; }',
        ];

        let style = document.createElement("style");
        document.head.appendChild(style);

        let sheet = style.sheet;
        for (let i = 0; i < cssClass.length; i++) {
            sheet.insertRule(cssClass[i], sheet.cssRules.length);
        }

        let $container = $('<tr>');
        let $td = $('<td>').appendTo($container).attr('width', '589');
        let $menu = $('<div id="AutoSkillUpMenu">').css({ 'margin': '10px 16.5px', 'color': 'white', }).appendTo($td);
        let $head = $('<div>').addClass('AS_header').text('自動レベルアップ').appendTo($menu);
        let $contents = $('<div>').addClass('AS_contents').appendTo($menu);
        let $inputBox = $('<div>').addClass('AS_inputBoxContainer').appendTo($contents);

        let $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="TargetLv">').css({ 'padding': '0px 3px', }).text('目標LV').appendTo($inputs);
        let lv_option_str = "";
        for(let i = 10;i > 1;i--){
            let isCheck = "";
            if(localStorage.getItem('AutoSynthesis_TargetLv') === i.toString()){
                isCheck = "selected"
            }
            lv_option_str += "<option " + isCheck + ">" + i + "</option>";
        }
        $('<select id="TargetLv">' + lv_option_str + '</select>').addClass('AS_inputText1').appendTo($inputs);

        $('<label for="SenKujiNum">').css({ 'padding': '0px 5px 0px 20px', }).text('素材カード数/ 回').appendTo($inputs);
        let cnt_option_str = "";
        for(let i = 1;i <= 12;i++){
            let isCheck = "";
            if(localStorage.getItem('AutoSynthesis_SenKujiNum') === i.toString()){
                isCheck = "selected";
            }
            cnt_option_str += "<option " + isCheck + ">" + i + "</option>";
        }
        $('<select id="SenKujiNum">' + cnt_option_str + '</select>').addClass('AS_inputText1').appendTo($inputs);

        $('<label>').css({ 'padding': '0px 5px 0px 20px', }).text('除外レア').appendTo($inputs);
        $('<img src = "../img/card/icon/icon_jou.png">').css({ 'width': '18px', 'height': '18px', }).appendTo($inputs);
        $('<input id="ExcludeJou" type="checkbox">').appendTo($inputs);
        $('<img src = "../img/card/icon/icon_toku.png">').css({ 'margin-left': '5px', 'width': '18px', 'height': '18px', }).appendTo($inputs);
        $('<input id="ExcludeToku" type="checkbox">').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="ExcludeNames">').css({ 'padding': '0px 5px', }).text('除外武将名').appendTo($inputs);
        $(`<input id="ExcludeNames" type="text" value="${localStorage.getItem('AutoSynthesis_ExcludeNames')}">`).addClass('AS_inputText2').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<label for="ExcludeSkills">').css({ 'padding': '0px 5px', }).text('除外スキル').appendTo($inputs);
        $(`<input id="ExcludeSkills" type="text" value="${localStorage.getItem('AutoSynthesis_ExcludeSkills')}">`).addClass('AS_inputText2').appendTo($inputs);

        $inputs = $('<div>').addClass('AS_inputInlineContainer').appendTo($inputBox);
        $('<input id="ASSubmit" type="button" value="開始">').css({
            'flex': '1', 'padding': '2px 5px', 'border': 'white 1px solid', 'border-radius': '5px', 'background-color': 'rgb(168,41,37)', 'color': 'white',
            'background-image': '-webkit-gradient(linear, left top, left bottom, from(#C44), to(#611))',
        }).appendTo($inputs).on('click', autoSkillLvUp.bind(null, $('input[name="base_cid"]').val()));

        $LogBox = $('<textarea  id="LogBox" type="textbox" value="">').addClass('AS_logTextBox').appendTo($contents);

        $('table#cardslot_table').after($container);

        if (eval(localStorage.getItem('AutoSynthesis_ExcludeJou'))) $('#ExcludeJou').prop('checked', true);
        if (eval(localStorage.getItem('AutoSynthesis_ExcludeToku'))) $('#ExcludeToku').prop('checked', true);
    }

*/

    /**
     * jQuery JSON Plugin
     * version: 2.1 (2009-08-14)
     *
     * This document is licensed as free software under the terms of the
     * MIT License: https://www.opensource.org/licenses/mit-license.php
     *
     * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
     * website's https://www.json.org/json2.js, which proclaims:
     * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
     * I uphold.
     *
     * It is also influenced heavily by MochiKit's serializeJSON, which is
     * copyrighted 2005 by Bob Ippolito.
     */

/*
     var toJSON = function(o) {var type = typeof(o);if (o === null) {return 'null';}if (type == 'undefined') {return undefined;}if (type == 'number' || type == 'boolean') {return o + '';}if (type == 'string') {return quoteString(o);}if (type == 'object') {if (o.constructor === Date) {var month = o.getUTCMonth() + 1;if (month < 10) {month = '0' + month;}var day = o.getUTCDate();if (day < 10) {day = '0' + day;}var year = o.getUTCFullYear();var hours = o.getUTCHours();if (hours < 10) {hours = '0' + hours;}var minutes = o.getUTCMinutes();if (minutes < 10) {minutes = '0' + minutes;}var seconds = o.getUTCSeconds();if (seconds < 10) {seconds = '0' + seconds;}var milli = o.getUTCMilliseconds();if (milli < 100) {milli = '0' + milli;}if (milli < 10) {milli = '0' + milli;}return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';}if (o.constructor === Array) {var ret = [];for (var i = 0, len = o.length; i < len; i++) {ret.push(toJSON(o[i]) || 'null');}return '[' + ret.join(',') + ']';}var pairs = [];for (var k in o) {var name;type = typeof k;if (type == "number") {name = '"' + k + '"';} else if (type == "string") {name = quoteString(k);} else {continue;}if (typeof o[k] == "function") {continue;}var val = toJSON(o[k]);pairs.push(name + ":" + val);}return '{' + pairs.join(', ') + '}';}},quoteString = function(s) {var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;var _meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"': '\\"','\\': '\\\\'};if (s.match(_escapeable)) {return '"' + s.replace(_escapeable, function(a) {var c = _meta[a];if (typeof c === 'string') {return c;}c = a.charCodeAt();return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);}) + '"';}return '"' + s + '"';};

     var changeKeys = function(key) {

       // ログインデータと空き地攻撃力以外、通常城主・影城主でkeyを切り替える
       if (document.body.className.indexOf("current_owner_sub") != -1 && key != 'ixamoko_login_data' && key != 'ixamoko_potential_data') {
         key = 'zs_' + key;
       }
       return key;
     },
     setStorage = function(key, value) {
         localStorage.setItem(changeKeys(key), toJSON(value));
     },
     getStorage = function(o, key) {
       var keys = changeKeys(key);
       return localStorage.getItem(keys) ? JSON.parse(localStorage[keys]) : o;
     }
}


if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
    loadScript();
} else {
    window.addEventListener('DOMContentLoaded', (event) => { loadScript(); });
}
*/

