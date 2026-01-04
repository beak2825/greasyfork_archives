// ==UserScript==
// @name         自動白くじツール
// @version      2.1
// @author       Yon
// @description:ja IXAでつかうやつ
// @include      https://*.sengokuixa.jp/*
// @exclude      https://sengokuixa.jp/*
// @exclude      http://h.sengokuixa.jp/*
// @exclude      https://m.sengokuixa.jp/*
// @exclude      https://*.sengokuixa.jp/world/*
// @exclude      https://*.sengokuixa.jp/false/*
// @grant        none
// @namespace https://greasyfork.org/users/442464
// @description IXAでつかうやつ
// @downloadURL https://update.greasyfork.org/scripts/396168/%E8%87%AA%E5%8B%95%E7%99%BD%E3%81%8F%E3%81%98%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/396168/%E8%87%AA%E5%8B%95%E7%99%BD%E3%81%8F%E3%81%98%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function($){
        if (location.pathname != '/senkuji/senkuji.php') {
            return
        }
        function main($) {
            const WHITE_PRICE = 500
            const STORAGE_KEY = "ixa_auto_white"
            let timerId = -1
            let storage = localStorage.getItem(STORAGE_KEY)

            window.state = {
                'senkuji_token': null,
                'money': 0,
                'card': 0,
                'card_cap': 0,
                'bids': 0,
                'statistics': [0, 0, 0, 0],
                'percentage': [0, 0, 0],
                'rankup_cards': [],
                'log_cards': [],
                'rank_ad_id': -1,
                'exp_ad_id': -1,
                'busho_list': [],
                'kakushi_list': [],
                'kakushi_exp': 0,
                white: function(result) {
                    state['card']++
                    state['money'] -= WHITE_PRICE
                    state['statistics'][0]++
                    state['statistics'][result['rare']-2]++
                    for(let i = 0; i < state['percentage'].length; i++) {
                        if(state['statistics'][0] != 0) {
                            state['percentage'][i] = parseInt(1000 * (state['statistics'][i+1] / state['statistics'][0])) / 10
                        }
                    }
                },
                remove: function() {
                    state['card']--
                    state['money'] += 50
                },
                rankup: function() {
                    state['card']--
                    state.rankup_cards = []
                },
                logCard: function(result) {
                    if(state['log_cards'].length === 0) {
                        state['log_cards'].push(result['no'])
                        return
                    } else {
                        state['log_cards'][1] = state['log_cards'][0]
                        state['log_cards'][0] = result['no']
                        return
                    }
                }
            }

            const xrwStatusText = function(xhr) { return xhr.setRequestHeader('X-Requested-With', 'statusText') }
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
            const parseQuery = (obj) => { return Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&") }
            let tmp = JSON.parse(storage)
            if(tmp) {
                storage = tmp
            } else {
                storage = {
                    'while': 'while_card',
                    'while_num': '10',
                    'after': 'after_keep',
                    'keep_rare': 'toku',
                    'keep_skills': '槍隊堅守,槍隊進撃'
                }
            }

            // create interface

            /// Dog text
            let text = $('<a id="auto_white_dog" href="#" style="color: black;">自動で白くじを引くワン？</a>')

            /// Configure
            let parentDiv = $('<div class="ig_tilesection_innermid"></div>')

            let loopDiv = $('<div style="display: inline-block; vertical-align: top; margin: 8px;"></div>')
            let loopInfo = $('<p><strong>条件</strong></p>')
            let loop1 = createRadio('while_card', 'while', '指定した枚数')
            let loop2 = createRadio('while_under', 'while', '指定した所持銅銭以下になるまで')
            let loop3 = createRadio('while_consume', 'while', '指定した銅銭を消費')
            let loopText = createTextInput('loopText', '指定数')
            let checkBox1 = createCheckBox('double_cards', 'double', '連続同一武将で終了')
            loopDiv.append(loopInfo).append(loop1).append(loop2).append(loop3).append(loopText).append(checkBox1)
            loopDiv.find('input[name=while]').val([storage['while']])
            loopText.find('input').val(storage['while_num'])

            let afterDiv = $('<div style="display: inline-block; vertical-align: top; margin: 8px;"></div>')
            let afterInfo = $('<p><strong>後処理</strong></p>')
            let after1 = createRadio('after_remove', 'after', '破棄')
            let after2 = createRadio('after_keep', 'after', 'すべて保持')
            let after3 = createRadio('after_rank', 'after', 'ランクアップ')
            afterDiv.append(afterInfo).append(after1).append(after2).append(after3)
            afterDiv.find('input[name=after]').val([storage['after']])

            let keepDiv = $('<div style="display: inline-block; vertical-align: top; margin: 8px;"></div>')
            let keepInfo = $('<p><strong>保持する武将(破棄の場合のみ、いずれかに合致)</strong></p>')
            let keepRarity = createRaritySelect()
            let keepSkill = createTextInput('keepText', 'スキル名(カンマ区切り)')
            let keepSkillList = $('<p></p>')
            keepDiv.append(keepInfo).append(keepRarity).append(keepSkill).append(keepSkillList)
            keepRarity.find('select').val(storage['keep_rare'])
            keepSkill.find('input:first').val(storage['keep_skills'])
            showSkillList()

            let startDiv = $('<div style="text-align: right;"></div>')
            let startButton = $('<input type="button" value="開始" />')
            startDiv.append(startButton)

            let displayDiv = $('<div></div>')
            let logs = $('<p style="overflow-y: scroll; height: 400px; width: 100%; display: none;"></p>')


            parentDiv.append(loopDiv).append(afterDiv).append(keepDiv).append(startDiv).append(displayDiv).append(logs)
            let div = $('<div class="ig_tilesection_mid" style="display: none;">&nbsp;</div>').append(
                $('<div class="ig_tilesection_innertop"></div>')).append(parentDiv).append(
                $('<div class="ig_tilesection_innerbottom">&nbsp;</div>'))
            $('.gokusen_point.with_super:first').after(div)
            $('#ixaDogTop p').empty().append(text)


            // event
            text.on('click', function(e) {
                div.toggle(400)
            })

            $('#keepText').on('change', showSkillList)

            startButton.on('click', function() {
                if(timerId == -1) {
                    if(isValid()) {
                        save()
                        startButton.val('中断')
                        init()
                        start()
                    } else {
                        alert("入力を確認してください。")
                    }
                } else {
                    clearTimeout(timerId)
                    timerId = -1
                    startButton.val('決定')
                }
            })

            // factory method
            function showSkillList() {
                let text = keepSkill.find('input:first').val()
                keepSkillList.html(text.split(',').join('</br>'))
            }

            function createRadio(id, name, text) {
                let radio = $('<input type="radio" name="' + name + '" id="' + id + '" value="' + id + '"/>')
                let label = $('<label for="' + id + '">' + text + '</label>')
                let div = $('<div style="margin: 8px;"></div>').append(radio).append(label)
                return div
            }

            function createCheckBox(id, name, text) {
                let checkBox = $('<input type="checkbox" name="' + name + '" id="' + id + '" value="' + id + '"/>')
                let label = $('<label for="' + id + '">' + text + '</label>')
                let div = $('<div style="margin: 8px;"></div>').append(checkBox).append(label)
                return div
            }

            function createTextInput(id, text) {
                let input = $('<input type="text" id="' + id + '"/>')
                let label = $('<label for="' + id + '">' + text + ': </label>')
                let div = $('<div style="margin: 8px;"></div>').append(label).append(input)
                return div
            }

            function createRaritySelect() {
                let div = $('<div style="margin: 8px;"></div>')
                let label = $('<label for="rarity">レアリティ以上: </label>')
                let select = $('<select id="rarity" name="rarity"></select>')
                let options = $('<option value="toku" selected>特</option><option value="jou">上</option><option value="jo">序</option>')
                return div.append(label).append(select.append(options))
            }

            // util
            function sortRankLevel(list) {
                return list.sort(function(a, b) {
                    var a_rank = a.rank*1, b_rank = b.rank*1,
                        a_level = a.level*1, b_level = b.level*1,
                        a_number = a.card_number*1, b_number = b.card_number*1
                    if (a_rank < b_rank) return -1
                    if (a_rank > b_rank) return 1
                    if (a_level < b_level) return -1
                    if (a_level > b_level) return 1
                    return 0
                })
            }
            function isValid() {
                let cond = $('input[name=while]:checked').val()
                let num = $('#loopText').val()
                let after = $('input[name=after]:checked').val()
                if(!cond) {
                    //undefined
                    return false
                }
                if(!after) {
                    //undefined
                    return false
                }
                if(!parseInt(num) && parseInt(num) != 0) {
                    return false
                }
                return true
            }

            function rareToNum(text) {
                if(text == 'toku') {
                    return 3
                } else if(text == 'jou') {
                    return 4
                } else if(text == 'jo') {
                    return 5
                } else {
                    return 0
                }
            }

            function save() {
                storage['while'] = $('input[name=while]:checked').val()
                storage['while_num'] = $('#loopText').val()
                storage['after'] = $('input[name=after]:checked').val()
                storage['keep_rare'] = $('#rarity').val()
                let skills = $('#keepText').val()
                if(skills.strip() != '') {
                    storage['keep_skills'] = skills
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
            }


            let condition = (function() {
                let func = null
                return {
                    continue: function() {
                        return func()
                    },
                    init: function() {
                        // TODO kakushidama cond
                        let val = $('input[name=while]:checked').val()
                        let num = $('#loopText').val() * 1
                        if(val == 'while_card') {
                            func = (function(num) {
                                let n = num
                                let counter = 0
                                return function() {
                                    if(counter++ >= n) {
                                        return false
                                    }
                                    return true
                                }
                            })(num)
                        } else if(val == 'while_under') {
                            func = (function(num) {
                                let n = num
                                return function() {
                                    if(state['money'] <= n) {
                                        return false
                                    }
                                    return true
                                }
                            })(num)
                        } else if(val == 'while_consume') {
                            func = (function(num) {
                                let n = num
                                let initN = state['money']
                                return function() {
                                    if(initN - state['money'] >= n) {
                                        return false
                                    }
                                    return true
                                }
                            })(num)
                        }
                    }
                }
            })()

            let after = (function() {
                let removeFunc = function() { return false }
                let kakushiFunc = function() { return false }
                let afterVal = null
                return {
                    init: function() {
                        let val = $('input[name=after]:checked').val()
                        afterVal = val
                        if(val == 'after_keep') {
                        } else if(val == 'after_rank') {
                            let rare = rareToNum($('#rarity').val())
                            let skills = $('#keepText').val().split(',')
                            kakushiFunc = (function(r, s) {
                                let rare = r
                                let skills = s
                                return function(data) {
                                    let shouldRemove = (data['rare'] > r) && (skills.indexOf(data['skill']) == -1)
                                    return shouldRemove
                                }
                            })(rare, skills)
                        } else if(val == 'after_remove') {
                            let rare = rareToNum($('#rarity').val())
                            let skills = $('#keepText').val().split(',')
                            removeFunc = (function(r, s) {
                                let rare = r
                                let skills = s
                                return function(data) {
                                    let shouldRemove = (data['rare'] > r) && (skills.indexOf(data['skill']) == -1)
                                    return shouldRemove
                                }
                            })(rare, skills)
                        }
                    },
                    shouldRemove: function(data) {
                        return removeFunc(data)
                    },
                    shouldKakushi: function(data) {
                        return kakushiFunc(data)
                    },
                    getValue: function() { return afterVal }
                }
            })()

            let log = (function() {
                function add(text) {
                    logs.html(text + '</br>' + logs.html())
                }
                return {
                    shortage: function() {
                        add('銅銭が足りないため、終了しました。')
                    },
                    capOver: function() {
                        add('カード所持上限に達したため、終了しました。')
                    },
                    success: function() {
                        add('条件を満たしたため、終了しました。')
                    },
                    error: function() {
                        add('タイムアウトか、くじが正常に引けなかったため、終了しました。')
                    },
                    rankup: function(name) {
                        add(`ランクアップ完了: ${name}`)
                    },
                    exp: function(name) {
                        add(`経験値付与完了: ${name}`)
                    },
                    double: function() {
                        add('連続で同一武将を引いたため、終了しました。')
                    },
                    card: function(data, removed) {
                        let rare = ''
                        if(data['rare'] <= 3) {
                            rare = '<span style="color: red;">特</span>'
                        } else if(data['rare'] <= 4) {
                            rare = '上'
                        } else if(data['rare'] <= 5) {
                            rare = '序'
                        }
                        let text = ''

                        if(removed) {
                            text = `${rare} No.${data['no']}: ${data['name']}(${data['skill']}) ...破棄`
                        } else {
                            text = `${rare} No.${data['no']}: <strong>${data['name']}</strong>(${data['skill']}) ...保持`
                        }
                        add(text)
                    }
                }
            })()

            let display = (function() {
                let money = $('<p>所持銅銭: ' + state['money'] + '</p>')
                let cards = $('<p>所持カード: ' + state['card'] + '</p>')
                let bids = $('<p>入札中: ' + state['bids'] + '</p>')
                let card_cap = $('<p>カード上限: ' + state['card_cap'] + '</p>')
                let statistics = $('<p></p>')
                let exp = $('<p>隠し玉の経験値: ' + state['kakushi_exp'] + '</p>')

                let html_card = $('.l_cardstock')
                let html_money = $('.money_b')
                return {
                    update: function() {
                        money.text('所持銅銭: ' + state['money'])
                        cards.text('所持カード: ' + state['card'])
                        bids.text('入札中: ' + state['bids'])
                        card_cap.text('カード上限: ' + state['card_cap'])
                        let text1 = '全体: ' + state['statistics'][0] + ', 特: ' + state['statistics'][1] + ', 上: ' + state['statistics'][2] + ', 序: ' + state['statistics'][3]
                        let text2 = '(' + state['percentage'][0] + '%, ' + state['percentage'][1] + '%, ' + state['percentage'][2] + '%)'
                        statistics.text(text1 + ' ' + text2)
                        exp.text('隠し玉の経験値: ' + state['kakushi_exp'] + '')

                        html_card.text(state['card'] + ' / ' + state['card_cap'])
                        html_money.text(state['money'])
                    },
                    init: function() {
                        displayDiv.empty().append(money).append(cards).append(bids).append(card_cap).append(statistics).append(exp).append('</br>')
                    }
                }
            })()

            // execute
            function init() {
                state['money'] = $('.money_b:first').text().replace(/,/g, '') * 1
                state['card'] = $('.l_cardstock').text().split('/')[0].strip() * 1
                state['card_cap'] = $('.l_cardstock').text().split('/')[1].strip() * 1
                state['bids'] = getBids()
                state['senkuji_token'] = $('input[name="senkuji_token"]').val()
                logs.show()
                condition.init()
                after.init()
                if(after.getValue() == 'after_rank') {
                    state.busho_list = getBushoList()
                    state.kakushi_list = filterKakushi(state.busho_list)
                    updateKakushiExp()
                }
                display.init()
                display.update()
            }

            function start() {
                if(after.getValue() == 'after_rank' && state.kakushi_list.length == 0) {
                    alert('隠し玉が見つかりません。部隊編成の組分けを確認してください。')
                    finish()
                    return
                }
                if(!condition.continue()) {
                    log.success()
                    finish()
                    return
                }
                if(state['money'] < WHITE_PRICE) {
                    log.shortage()
                    finish()
                    return
                }
                if(state['card'] + state['bids'] >= state['card_cap']) {
                    log.capOver()
                    finish()
                    return
                }

                let result = white()
                if(!result) {
                    log.error()
                    finish()
                    return
                }
                state.white(result)
                state.logCard(result)
                display.update()

                // remove
                if(after.shouldRemove(result)) {
                    remove(result['id'])
                    log.card(result, true)
                    state.remove()
                } else {
                    log.card(result, false)
                }

                // kakushi
                if(after.shouldKakushi(result)) {
                    // level up
                    state.busho_list = getBushoList()
                    state.kakushi_list = filterKakushi(state.busho_list)
                    updateKakushiExp()
                    if(state.kakushi_exp < (20546)) {
                        alert('隠し玉の経験値が不足しています。')
                        finish()
                        return
                    }
                    // setup
                    if(state.exp_ad_id == -1) {
                        const exp_busho = state.busho_list.filter((busho) => { return (busho['level']*1 < 20) && (busho['rank']*1 < 6) && (!busho['cantset']) })
                        const exp_ad_id = getExpAdID(state.kakushi_list[0]['card_id'], exp_busho[0]['card_id'])
                        if(!!exp_ad_id) {
                            state.exp_ad_id = exp_ad_id
                        } else {
                            state.exp_ad_id = null
                        }
                    }
                    exp(result['id'])
                    log.exp(result['name'])
                    state.rankup_cards.push({'id': result['id'], 'name': result['name']})
                }
                if(state.rankup_cards.length == 2) {
                    if(state.rank_ad_id == -1) {
                        const rank_busho = state.busho_list.filter((busho) => { return (busho['rank']*1 < 6) && (busho['level']*1 == 20) && (!busho['cantset']) })
                        const rank_ad_id = getRankAdID(rank_busho[0]['card_id'])
                        if(!!rank_ad_id) {
                            state.rank_ad_id = rank_ad_id
                        } else {
                            state.rank_ad_id = null
                        }
                    }

                    // rank up
                    rankup()
                    log.rankup(state.rankup_cards[0]['name'])
                    state.rankup()
                    updateKakushiExp()
                }

                display.update()

                // double cards
                if(document.getElementById('double_cards').checked && state['log_cards'][0] === state['log_cards'][1]) {
                    log.double()
                    finish()
                    return
                }

                timerId = setTimeout(start, 100)
            }

            function finish() {
                timerId = -1
                startButton.val('決定')
                alert('自動くじ引きを終了したワン！')
            }

            function updateKakushiExp() {
                let exp = 0
                for(let i=0; i < state.kakushi_list.length; i++) {
                    exp += state.kakushi_list[i]['experience']*1
                }
                state.kakushi_exp = exp
            }

            // ajax
            function getBids() {
                let html = $.ajax({
                    type: 'get',
                    url: '/card/bid_list.php',
                    beforeSend: xrwStatusText,
                    async: false
                }).responseText
                return $(html).find('.t_cardstock.rightF:first').text().split('：')[2].split('件')[0] * 1
            }

            function white() {
                let data = {
                    send: 'send',
                    got_type: '0',
                    sub_id: '0',
                    senkuji_token: state['senkuji_token']
                }
                let html = $.ajax({
                    type: 'post',
                    url: '/senkuji/play_senkuji.php',
                    data: data,
                    beforeSend: xrwStatusText,
                    async: false
                }).responseText

                let $card_front = $(html).find('#id_deck_card_front')
                if(!$card_front[0]) {
                    return false
                }
                let card_name = $card_front.find('span.ig_card_name').text(),
                    rare = $card_front.find('span[class^="rarity_"]').attr('class').split('_')[1],
                    card_id = $card_front.find('.commandsol_').attr('id').split('_')[2],
                    card_no = $card_front.find('.ig_card_cardno').text(),
                    skill = $(html).find('#id_deck_card_back').find('.ig_skill_name').text().split('L')[0]
                return {
                    'name': card_name,
                    'rare': rareToNum(rare),
                    'id': card_id,
                    'no': card_no,
                    'skill': skill
                }
            }

            function remove(card_num) {
                let data = {
                    show_num: 100,
                    p: 4,
                    tmp_show_num: 100,
                    select_card_group: 0,
                    select_filter_num: 0,
                    'delete_card_arr[]': card_num,
                    btn_send: '破棄を実行'
                }
                let html = $.ajax({
                    type: 'post',
                    url: '/card/deck_card_delete.php',
                    data: data,
                    beforeSend: xrwStatusText,
                    async: false
                }).responseText
                }

            function exp(card_num) {
                let postData = {
                    base_cid    : state.kakushi_list[0]['card_id']*1,
                    added_cid   : card_num*1,
                    'material_cid[]': [],
                    use_cp_flg  : 0,
                    union_type  : 5,
                    exec_btn    : 1,
                    sub_id      : '',
                }
                if(state.exp_ad_id != null && state.exp_ad_id != -1) {
                    postData['ad_id'] = state.exp_ad_id;
                }

                for(let i = 1; i < state.kakushi_list.length && i < 5; i++) {
                    postData['material_cid[]'].push(state.kakushi_list[i]['card_id']*1)
                }

                const html = $.ajax(location.origin + '/union/special_execute.php', {
                    data: postData,
                    method: 'POST',
                    beforeSend: xrwStatusText,
                    async: false
                })
                }

            function rankup() {
                let postData = {
                    base_cid    : state.rankup_cards[0]['id']*1,
                    'material_arr[]': [state.rankup_cards[1]['id']*1],
                    union_type  : 4,
                    use_cp_flg  : 0,
                    exec_btn    : 1,
                    sub_id      : 0,
                }
                if(state.rank_ad_id != null && state.rank_ad_id != -1) {
                    postData['ad_id'] = state.rank_ad_id;
                }

                fetch('/union/rankup_execute.php', { method: 'POST', headers: headers, body: parseQuery(postData) })
            }

            function getBushoList() {
                return $.ajax('/card/deck.php?select_card_group=0&select_filter_num=0', {
                    beforeSend: (xhr) => { xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest') },
                    async: false,
                    cache : false
                }).responseJSON.card_data
            }

            function filterKakushi(list) {
                const kakushiNo = ['6702', '6703', '6706', '6707']
                return sortRankLevel(list.filter(function(e) {
                    if(kakushiNo.indexOf(e.card_number) !== -1 && e.protect_flg != "1") {
                        return e
                    }
                }))
            }

            function getExpAdID(kakushi, busho) {
                const postData = {
                    base_cid        : kakushi*1,
                    added_cid       : busho*1,
                    add_flg         : '',
                    new_cid         : '',
                    remove_cid      : '',
                    p               : '',
                    selected_cid    : '',
                    deck_mode       : '',
                    union_type      : '5',
                    btn_change_flg  : ''
                }
                const html = $.ajax('/union/special_confirm.php', {
                    async: false,
                    method: 'POST',
                    data: postData
                }).responseText
                return $(html).find('form input[name="ad_id"]').val() * 1
            }

            function getRankAdID(busho) {
                const postData = {
                    base_cid        : '',
                    added_cid       : '',
                    add_flg         : '',
                    new_cid         : '',
                    remove_cid      : '',
                    p               : '',
                    selected_cid    : busho*1,
                    deck_mode       : '',
                    union_type      : '4',
                    btn_change_flg  : ''
                }
                const html = $.ajax('/union/rankup.php', {
                    async: false,
                    method: 'POST',
                    data: postData
                }).responseText
                return $(html).find('form input[name="ad_id"]').val() * 1
            }
        }
        main($)
    })(j213$);
})();