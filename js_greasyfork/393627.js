// ==UserScript==
// @name         美丽加数据拉取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快捷的美丽加数据拉取
// @author       iblilife@outlook.com

// @match        https://o2o.mljia.cn/**
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require           https://cdn.jsdelivr.net/npm/vue

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393627/%E7%BE%8E%E4%B8%BD%E5%8A%A0%E6%95%B0%E6%8D%AE%E6%8B%89%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/393627/%E7%BE%8E%E4%B8%BD%E5%8A%A0%E6%95%B0%E6%8D%AE%E6%8B%89%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function($) {

        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            a256 = '',
            r64 = [256],
            r256 = [256],
            i = 0;

        var UTF8 = {

            /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
            encode: function(strUni) {
                // use regular expressions & String.replace callback function for better efficiency
                // than procedural approaches
                var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                                            function(c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                })
                .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                         function(c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                });
                return strUtf;
            },

            /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
            decode: function(strUtf) {
                // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
                var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
                                            function(c) { // (note parentheses for precence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                })
                .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
                         function(c) { // (note parentheses for precence)
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                });
                return strUni;
            }
        };

        while(i < 256) {
            var c = String.fromCharCode(i);
            a256 += c;
            r256[i] = i;
            r64[i] = b64.indexOf(c);
            ++i;
        }

        function code(s, discard, alpha, beta, w1, w2) {
            s = String(s);
            var buffer = 0,
                i = 0,
                length = s.length,
                result = '',
                bitsInBuffer = 0;

            while(i < length) {
                var c = s.charCodeAt(i);
                c = c < 256 ? alpha[c] : -1;

                buffer = (buffer << w1) + c;
                bitsInBuffer += w1;

                while(bitsInBuffer >= w2) {
                    bitsInBuffer -= w2;
                    var tmp = buffer >> bitsInBuffer;
                    result += beta.charAt(tmp);
                    buffer ^= tmp << bitsInBuffer;
                }
                ++i;
            }
            if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
            return result;
        }

        var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

        Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
            plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
            plain = code(plain, false, r256, b64, 8, 6);
            return plain + '===='.slice((plain.length % 4) || 4);
        };

        Plugin.atob = Plugin.decode = function(coded, utf8decode) {
            coded = coded.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            coded = String(coded).split('=');
            var i = coded.length;
            do {--i;
                coded[i] = code(coded[i], true, r64, a256, 6, 8);
               } while (i > 0);
            coded = coded.join('');
            return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
        };
    }(jQuery));

    $(function(){

        let accessString = GLOBAL.accessUserStr;
        let shopId = GLOBAL.shopSid;
        let decodeAccessString = $.base64.decode(accessString, 'utf-8');
        let accessObject = JSON.parse(decodeAccessString);
        let accessToken = accessObject.accessToken
        let params = {
            shop_sid: shopId,
            sex: null,
            custom_type: 0,
            day: null,
            agent_type_flag: null,
            start_date: null,
            end_date: null,
            custom_level_id: -1,
            custom_status: 0,
            left_money_min: null,
            left_money_max: null,
            left_count_min: null,
            left_count_max: null,
            key_words: null,
            note_words: null,
            birthday_remind_flag: null,
            phone_flag: null,
            birthday_flag: null,
            custom_channel: null,
            create_start_date: null,
            create_end_date: null,
            sort: 'customTotalMoney',
            sort_type: 0,
            page: 1,
            access_token: accessToken
        }

        let pageInit = false;
        let appId = 'vue_app_' + new Date().getTime();

        hotkeys('ctrl+shift+f', function (event, handler){
            if (handler.key === 'ctrl+shift+f') {
                if (!pageInit) {
                    console.log('开始初始化抓取数据界面...');
                    let containerHtml = $(`
                      <div id="${appId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;">
                          <div style="background-color: rgba(0, 0, 0, 0.3); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                          <div style="width: 80%; margin-left: 10%; margin-top: 100px; background: #fff; z-index: 10001; position: relative; padding: 10px; border-radius: 4px; box-shadow: 0 0 32px 1px rgba(0, 0, 0, 0.4);">
                              <div style="font-size: 16px; height: 45px; line-height: 45px; border-bottom: solid 1px #ddd; padding: 0 8px;">会员数据抓取<span style="font-size: 12px; color: #aaa; margin-left: 10px;">(Power by: iblilife@outlook.com)</span></div>
                              <div style="height: 220px; padding: 10px 0;">
                                  <textarea style="width: 100%; height: 100%;" placeholder="获取会员数据成功后将在此处展示">{{dataString}}</textarea>
                              </div>
                              <div style="width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">进度：{{progressRate}}% （{{progressCurrent}}/{{progressTotal}}）&nbsp;&nbsp;<span style="color: #888;">{{progressCurrentDes}}</span></div>
                              <div style="background: #eee; height: 8px; border-radius: 8px; overflow: hidden; position: relative; margin-top: 6px">
                                  <div style="position: absolute: width: 0; left: 0; height: 100%; top: 0; background: #42b983; border-radius: 8px;" :style="{ 'width': progressRate + '%' }"></div>
                              </div>
                              <div style="margin: 18px 0; text-align: right;">
                                  <div @click="beginFetchData" style="display: inline-block; background: #42b983; color: #fff; height: 40px; line-height: 40px; padding: 0 18px; border-radius: 4px; cursor: pointer;" :style="{ backgroundColor: progressLoading ? '#999': '#42b983' }">
                                    <span v-if="!progressLoading && !isDone">开始抓取数据</span>
                                    <span v-else-if="progressLoading && !isDone">数据抓取中，请稍后...</span>
                                    <span v-else-if="!progressLoading && isDone">恭喜，数据抓取完成！</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    `);

                    $(document.body).append(containerHtml);
                    pageInit = true;
                    // 初始化vue实例
                    new Vue({
                        el: '#' + appId,
                        data: {
                            isDone: false,

                            pageSize: 10, // 每页数据大小
                            pageTotal: 0, // 总页数

                            progressLoading: false,
                            progressCurrent:0,
                            progressTotal: 0,
                            progressCurrentDes: '',
                            dataString: ''
                        },
                        computed: {
                            progressRate () {
                                if (this.progressTotal > 0) {
                                    return (this.progressCurrent / this.progressTotal * 100).toFixed(2);
                                }
                                return '0';
                            }
                        },
                        mounted () {
                            console.log('页面第一次展示调用')
                            $.ajax({
                                url: 'https://saas.mljia.cn/customer/info/list',
                                data: params,
                                type: 'get',
                                dataType: 'json',
                                success: (data) => {
                                    this.progressTotal = data.totalCount
                                    this.pageSize = data.rows;

                                    if (this.progressTotal % this.pageSize > 0) {
                                        this.pageTotal = parseInt(this.progressTotal/this.pageSize) + 1
                                    } else {
                                        this.pageTotal = this.progressTotal/this.pageSize
                                    }
                                    console.log('总页数： ', this.pageTotal)
                                }
                            })
                        },
                        methods: {
                            trim (str) {
                                if(str){
                                    return str.replace(/\s/g, '');
                                }
                                return str;
                            },
                            async beginFetchData () {
                                console.log('开始获取数据')
                                let titles = ["手机号","姓名","性别","全部卡总余额","全部卡总次数",
                                      "有效卡数量","用户备注","卡号", "卡類型", "卡名称","卡剩余金额",
                                      "卡赠送金额","卡剩余次数", "卡折扣"]
                                let rowStrings = []

                                console.log('this.pageTotal:', this.pageTotal)
                                for (let i = 1; i <= this.pageTotal; i++) {
                                    let newParams = { ...params }
                                    newParams.page = i

                                    let data = await $.ajax({
                                        url: 'https://saas.mljia.cn/customer/info/list',
                                        data: newParams,
                                        type: 'get',
                                        dataType: 'json'
                                    })
                                    let list = JSON.parse($.base64.decode(data.content, 'utf-8'))

                                    let memberList = []
                                    for (let j = 0; j < list.length; j++) {
                                        let member = {}

                                        let item = list[j]

                                        // 獲取用戶基本信息
                                        member.mobile = item.custom_mobile
                                        member.name = item.custom_name
                                        member.sex = (item.custom_sex == 1 ? '女' : '男')
                                        member.leftMoney = item.left_money
                                        member.leftCount = item.left_count
                                        member.availableCardNum = item.available_card_num
                                        member.userNote = item.user_note
                                        member.mobile = item.custom_mobile

                                        let custom_id = item.custom_id;
                                        member.customId = custom_id
                                        //获取用户备注
                                        let reamrkData = await $.ajax({
                                            url: 'https://saas.mljia.cn/customer/info/get?custom_id='+custom_id+'&shop_sid='+shopId+'&access_token=' + accessToken
                                        })
                                        reamrkData = JSON.parse($.base64.decode(reamrkData.content, 'utf-8'))

                                        let note = this.trim(reamrkData.note || '')
                                        member.note = note
                                        member.customMemberId = this.trim(reamrkData.custom_member_id || '')
                                        member.cards = []

                                        if (item.available_card_num > 0) {
                                            // 获取卡信息
                                            let cardData = await $.ajax({
                                                url: 'https://saas.mljia.cn/customer/card/list?shop_sid='+shopId+'&card_flag=0&custom_id='+custom_id+'&page=1&access_token=' + accessToken
                                            });
                                            cardData = JSON.parse($.base64.decode(cardData.content, 'utf-8'))

                                            cardData.forEach((cardItem) => {
                                                let card = {}
                                                card.name = cardItem.card_name
                                                let item_left_num = cardItem.card_info_list[0].item_left_num | 0;
                                                let left_not_given_money = 0.0;
                                                if (cardItem.card_info_list[0].left_not_given_money) {
                                                    left_not_given_money = parseFloat(cardItem.card_info_list[0].left_not_given_money);
                                                }
                                                let left_given_money = 0.0;
                                                if (cardItem.card_info_list[0].left_given_money) {
                                                    left_given_money = parseFloat(cardItem.card_info_list[0].left_given_money);
                                                }

                                                card.cardType = cardItem.card_type
                                                card.leftNotGivenMoney = left_not_given_money;
                                                card.leftGivenMoney = left_given_money;
                                                card.itemLeftNum = item_left_num;
                                                card.itemDiscount = cardItem.card_info_list[0].item_discount | 10;

                                                member.cards.push(card)
                                            })

                                            //console.log(member)
                                            memberList.push(member)

                                        }
                                    }

                                    memberList.forEach((member) => {
                                        if (member.cards.length > 0) {
                                            member.cards.forEach(card => {
                                                rowStrings.push([
                                                    member.mobile, member.name, member.sex, member.leftMoney, member.leftCount,
                                                    member.cards.length, member.note, member.customMemberId, card.cardType, card.name, card.leftNotGivenMoney,
                                                    card.leftGivenMoney, card.itemLeftNum, card.itemDiscount
                                                ].join('\t'))
                                            })
                                        } else {
                                            rowStrings.push([
                                                    member.mobile, member.name, member.sex, member.leftMoney, member.leftCount,
                                                    member.cards.length, member.note, member.customMemberId, '', '', 0,
                                                    0, 0, 0
                                                ].join('\t'))
                                        }
                                    })

                                    if (i == this.pageTotal) {
                                        this.progressCurrent += this.progressTotal % this.pageSize
                                    } else {
                                        this.progressCurrent += this.pageSize
                                    }
                                }

                                this.dataString = titles.join('\t') + '\r\n' + rowStrings.join('\r\n')
                            }
                        }
                    });

                } else {
                    $(`#${appId}`).toggle();
                }
            }
        });
    })












/*
    let accessString = GLOBAL.accessUserStr;
    let shopId = GLOBAL.shopSid;
    let decodeAccessString = atob(accessString);
    let accessObject = JSON.parse(decodeAccessString);
    let accessToken = accessObject.accessToken
    let pageIndex = 1;

    // 获取页面记录总页数
    let pageTotal = 0;
    // 获取页面分页数据大小
    let pageSize = 10;

    $.ajax({
      url: 'https://saas.mljia.cn/customer/info/list',
      data: {
          shop_sid: 111695,
          sex: null,
          custom_type: 0,
          day: null,
          agent_type_flag: null,
          start_date: null,
          end_date: null,
          custom_level_id: -1,
          custom_status: 0,
          left_money_min: null,
          left_money_max: null,
          left_count_min: null,
          left_count_max: null,
          key_words: null,
          note_words: null,
          birthday_remind_flag: null,
          phone_flag: null,
          birthday_flag: null,
          custom_channel: null,
          create_start_date: null,
          create_end_date: null,
          sort: 'customTotalMoney',
          sort_type: 0,
          page: pageIndex,
          access_token: accessToken
      },
      type: 'get',
      dataType: 'json',
	  success: function (data) {
         console.log(data)
         let totalCount = data.totalCount
         pageSize = data.rows;

         if (totalCount%pageSize > 0) {
            pageTotal = parseInt(totalCount/pageSize) + 1
         } else {
            pageTotal = totalCount/pageSize
         }
         console.log('总页数： ', pageTotal)

          for (let i = 1; i <= pageTotal; i++) {

          }
      }
    })

     //  var accessTokenJson = base.decode(accessTokenBase64);
	// var accessTokenObj = JSON.parse(accessTokenJson);

    // Your code here...
    */
})();