// ==UserScript==
// @name         matome-kakushi
// @version      2.0
// @description  まとめて隠し玉するやつ
// @author       You
// @match        https://*.sengokuixa.jp/*
// @exclude      https://sengokuixa.jp/*
// @exclude      http://h.sengokuixa.jp/*
// @exclude      https://m.sengokuixa.jp/*
// @exclude      https://*.sengokuixa.jp/world/*
// @exclude      https://*.sengokuixa.jp/false/*
// @grant        none
// @namespace    https://greasyfork.org/users/442464
// @downloadURL https://update.greasyfork.org/scripts/396172/matome-kakushi.user.js
// @updateURL https://update.greasyfork.org/scripts/396172/matome-kakushi.meta.js
// ==/UserScript==

(function($) {
  const xhrStatusText = function(xhr) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }
  const xrwStatusText = function(xhr) {
    return xhr.setRequestHeader('X-Requested-With', 'statusText');
  };
  // まとめて隠し玉
  /*
  jQuery.ajax('/card/deck.php?select_card_group=0&select_filter_num=0', {
          beforeSend: (xhr) => {xhr.setRequestHeader('X-Requested-With', 'statusText')},
          async: false
        }).responseText
  */
  async function matomeKakushi() {
    async function executeKakushi() {
      let cards;
      const fetchCardDocument = async (p) => {
        const response = await fetch(`/facility/set_unit_list.php?p=${p}&select_card_group=0&select_filter_num=0&show_num=100`)
        const html = await response.text()

        const $doc = $(html)
        const fronts = $doc.find('div.ig_card_cardStatusFront')
        const backs = $doc.find('div.ig_card_cardStatusBack')
        const windows = $doc.find('div[id^="cardWindow_"]')
        const pager = $doc.find('ul.pager')
        const is_last = !pager.find('li.last')[0]

        const cards = []
        for(let i=0; i < fronts.length; i++) {
          const cid = $(windows[i]).attr('id').replace('cardWindow_', '')
          cards.push({
            front: $(fronts[i]),
            back: $(backs[i]),
            cid: cid,
          })
        }

        return {is_last, cards}
      }

      const createCardData = async (inip) => {
        let page = inip
        const first_page = await fetchCardDocument(page)
        let is_last = first_page.is_last
        let cards = first_page.cards

        while(!is_last) {
          page++
          const p = await fetchCardDocument(page)
          is_last = p.is_last
          cards = cards.concat(p.cards)
        }

        const data = []
        for(let c of cards) {
          data.push(parseCardData(c))
        }
        return data
      }

      const parseCardData = (card) => {
        const data = {}
        // parameter
        const $parameters = card.front.find('div.parameta_area')
        
        // rarity
        const rarity_class = $parameters.find('span[class^=rarity]').attr('class')
        switch(rarity_class) {
          case 'rarity_ten': data.rarity = '1'; break;
          case 'rarity_fukkoku_ten': data.rarity = '1'; break;

          case 'rarity_goku': data.rarity = '2'; break;
          case 'rarity_masago_expansion': data.rarity = '2'; break;
          case 'rarity_fukkoku': data.rarity = '2'; break;
          case 'rarity_goku_secret': data.rarity = '2'; break;
          
          case 'rarity_toku': data.rarity = '3'; break;
          case 'rarity_toku_secret': data.rarity = '3'; break;
          
          case 'rarity_jou':  data.rarity = '4'; break;
          case 'rarity_jo':   data.rarity = '5'; break;
          case 'rarity_bake': data.rarity = '6'; break;
          default: data.rarity = '1';
        }
        // cost
        const cost_text = $parameters.find('span[class^=ig_card_cost]').text()
        data.cost = +cost_text

        // rank
        const rank_img = $parameters.find('img.bg_star')
        if(rank_img[0]) {
          const width = rank_img.attr('width')
          const rank = Math.floor((1*width.replace('%', '')) / 20)
          data.rank = rank
        } else {
          const rank_span = $parameters.find('span.rank_over_limit')
          const rank_text = rank_span.attr('alt')
          let rank = 999
          if(rank_text === '限界突破') {
            rank = 6
          } else if(rank_text === '極限突破') {
            rank = 7
          } else if(rank_text === '天限突破') {
            rank = 8
          }
          data.rank = rank
        }

        // level
        const level_text = $parameters.find('span.ig_card_level').text()
        data.level = +level_text

        // name
        const name_text = $parameters.find('span.ig_card_name').text()
        data.name = name_text

        // attack
        const attack_text = $parameters.find('span.ig_card_status_att').text()
        data.attack = +attack_text
        // defense
        const defense_text = $parameters.find('span.ig_card_status_def').text()
        data.defense = +defense_text
        // intellect
        const intellect_text = $parameters.find('span.ig_card_status_int').text()
        data.intellect = +intellect_text
        // lead_unit
        const lead_unit_text = $parameters.find('span[class^=commandsol_no]').text()
        data.lead_unit = +(lead_unit_text.split('/')[1])
        // card_id
        //const card_id_text = $parameters.find('span.ig_card_cardno').text()
        //data.card_id = card_id_text
        data.card_id = card.cid

        data.protect_flg = '0' // TODO

        // back
        const $skills = card.back.find('div.ig_skill_box')
        const skills = []
        for(let i=0; i < $skills.length; i++) {
          const title = $($skills[i]).find('span.ig_skill_name').text()
          skills.push({
            skill_name: title
          })
        }
        data.skill = skills

        return data
      }


      var externalFilePath = (function() {
        var href = $('LINK[type="image/x-icon"][href^="https://cache"]').attr('href') || '';
        href = href.match(/^.+(?=\/)/) || '';
        return href;
      })();

      var inactiveSkills = localStorage.getItem("ixa_auto_white") ? localStorage.getItem("ixa_auto_white") : false;
      if(!!inactiveSkills) {
        inactiveSkills = JSON.parse(inactiveSkills)['keep_skills'].split(',')
      }


      var getCardList = function() {
        return cards
      },
      createKakushiList = function(list) {
        var nameList = [ '小姓の応援', '小姓の隠し玉', '高橋Ｐ', 'ルルハ', 'すみれ', '鋼鉄素来夢王' ];
        return list.filter(function(e) {
          for(var i = 0; i < nameList.length; i++) {
            if(e.name == nameList[i] && e.protect_flg != "1") {
              return e;
            }
          }
        });
      },
      createLevelupCardList = function(list) {
        return list.filter(function(e) {
          if(e.rank*1 <= 5 && e.level*1 < 20 && e.rarity*1 <= 5 && e.cost*1 < 50) {
            return e;
          }
        });
      },
      getIconName = function(card) {
        var icon;
        switch(card.rarity) {
          case '1':
            if(card.cost == 0 && card.card_id*1 != '1187') {
              icon = 'icon_warabe.png';
            } else if(card.cost == 193) {
              icon = 'icon_syuku.png';
            } else {
              icon = 'icon_ten.png';
            }
            break;
          case '2': icon = 'icon_goku.png'; break;
          case '3': icon = 'icon_toku.png'; break;
          case '4': icon = 'icon_jou.png'; break;
          case '5': icon = 'icon_jo.png'; break;
          case '6': icon = 'icon_bake.png'; break;
          default: return false;
        }
        return icon;
      },
      createSkillNames = function(card) {
        var array = [];
        for(var i = 0; i < card.skill.length; i++) {
          array.push(card.skill[i].skill_name);
        }
        return array.join('</br>');
      },
      sortRankLevel = function(list) {
        return list.sort(function(a, b) {
          var a_rank = a.rank*1, b_rank = b.rank*1,
            a_level = a.level*1, b_level = b.level*1,
            a_number = a.card_number*1, b_number = b.card_number*1;
          if (a_rank < b_rank) return -1;
          if (a_rank > b_rank) return 1;
          if (a_level < b_level) return -1;
          if (a_level > b_level) return 1;
          if (a_number < b_number) return 1;
          if (a_number > b_number) return -1;
          return 0;
        });
      },
      create$Tr = function(card) {
        var inactiveStyle = '';
        if(!!inactiveSkills && inactiveSkills.indexOf(card.skill[0].skill_name.split('LV')[0]) != -1) {
          inactiveStyle = 'background-color: gray;';
        }
        var tr = '' +
        '<tr class="fs12" style="' + inactiveStyle + '">' +
          '<td><input name="page_card_arr[]" type="checkbox" value="' + card.card_id + '"></td>' +
          '<td class="left"><img class="middle mr5" src="' + externalFilePath + '/img/card/icon/' + getIconName(card) + '">' + card.name +'</td>' +
          '<td>' + '★'.repeat( card.rank ) + '☆'.repeat( 5 - card.rank ) + '</br>' + card.level + '</td>' +
          '<td>' + card.cost + '</td>' +
          '<td>' + createSkillNames(card) + '</td>' +
          '<td>' + card.attack + '</td>' +
          '<td>' + card.defense + '</td>' +
          '<td>' + card.intellect + '</td>' +
          '<td>' + card.lead_unit + '</td>' +
        '</tr>';
        var $tr = $(tr).on('click', function(e) {
          if(e.target.localName == 'input') return;
          var $input = $(e.currentTarget).find('td input[name="page_card_arr[]"]');
          $input.prop("checked", !$input.prop("checked"));
        }).hover(function(e){$(e.currentTarget).toggleClass("now")}, function(e){$(e.currentTarget).toggleClass("now")});
        return $tr;
      },
      create$Dialog = function() {
        var html = '' +
        '<div id="kakushi_wrapper">' +
          '<div id="kakushi_dialog">' +
            '<div id="kakushi_head">' +
              '<span>まとめて隠し玉</span>' +
            '</div>' +
            '<div id="kakushi_inner"></div>' +
            '<div id="kakushi_exec"></div>' +
          '</div>' +
        '</div>';
        return $(html);
      },
      create$Table = function(list) {
        var contents = '' +
        '<table class="common_table1 center mt10">' +
          '<tbody>' +
            '<tr>' +
              '<th>選択</th><th>名前</th><th>ランク/LV</th><th>コスト</th><th>スキル</th>' +
              '<th>攻撃</th><th>防御</th><th>兵法</th><th>指揮力</th>' +
            '</tr>' +
          '</tbody>' +
        '</table>';
        var $table = $(contents),
          $tbody = $table.find('tbody:eq(0)');
        for(var i = 0; i < list.length; i++) {
          var $tr = create$Tr(list[i]);
          $tbody.append($tr);
        }
        return $table;
      },
      addButtons = function($dialog) {
        var exec = $('<button>').text('実行').on('click', execute),
          cancel = $('<button>').text('キャンセル').on('click', function() {
            $('#kakushi_wrapper').remove();
          });
        $dialog.find('#kakushi_exec').append(exec).append(cancel);
      },
      showDialog = function() {
        var $dialog = create$Dialog(),
          list = getCardList(),
          kakushiList = sortRankLevel(createKakushiList(list)),
          bushoList = sortRankLevel(createLevelupCardList(list)),
          $kakushiTable = create$Table(kakushiList).attr('name', 'kakushi'),
          $bushoTable = create$Table(bushoList).attr('name', 'busho');
        $dialog.find('#kakushi_inner').append($kakushiTable).append($bushoTable);
        addButtons($dialog);
        $('body').append($dialog);
      },
      getAdID = function(kakushi, busho) {
        var postData = {
          select_card_group: 0,
          select_filter_num: 0,
          'sort_order[]': [1,0,0],
          'sort_order_type[]': [0,0,0],
          show_deck_card_count: 15,
          add_flg         : '',
          new_cid         : '',
          remove_cid      : '',
          p               : '',
          selected_cid    : kakushi*1,
          deck_mode       : '',
          union_type      : 5,
          btn_change_flg  : '',
        };
        var html = $.ajax(location.origin + '/union/expadd.php', {
          async: false,
          method: 'POST',
          beforeSend: xrwStatusText,
          data: postData
        }).responseText;
        return $(html).find('form input[name="ad_id"]').val() * 1;
      };

      function execute(e) {
        var kakushi = [], busho = [];
        $('#kakushi_inner table[name="kakushi"] :checked').each(function() {
          kakushi.push( $(this).val() );
        });
        $('#kakushi_inner table[name="busho"] :checked').each(function() {
          busho.push( $(this).val() );
        });
        if(kakushi.length == 0 || busho.length == 0) {
          alert('武将が選択されていません');
          return;
        }

        var ad_id = getAdID(kakushi[0], busho[0]);
        $.Deferred().resolve()
        .then(function() {
          $('#kakushi_inner').html('');
        })
        .then(post);

        function post() {
          // カード情報を読み込んで存在確認
          createCardData(0)
          .then( function( card_data ) {
            var remain_kakushi = card_data.filter(function(card) {
              if(kakushi.indexOf(card.card_id) != -1) {
                return card;
              }
            }).map(function(card) { return card.card_id; });

            var remain_busho = card_data.filter(function(card) {
              if(busho.indexOf(card.card_id) != -1 && card.level != 20) {
                return card;
              }
            }).map(function(card) { return card.card_id; });

            return [ remain_kakushi, remain_busho ];
          })
          .then( function( list ) {
            [ kakushi, busho ] = list;
            if( kakushi.length == 0 || busho.length == 0 ) {
              //playSound(SOUND.notice);
              $('#kakushi_inner').append('<span>特殊合成を完了しました。</span></br>');
              return;
            }

            var postData = {
              base_cid    : kakushi[0]*1,
              'added_cid_arr[]' : [],
              'material_cid[]': [],

              select_card_group: 0,
              select_filter_num: 0,
              show_deck_card_count: 15,
              add_flg: '',
              new_cid: '',
              remove_cid: '',
              selected_skill_radio: '',
              p: '',
              selected_cid: '',
              deck_mode: '',
              union_type  : 7,
              btn_change_flg: '',
              use_cp_flg  : 0,
              exec_btn    : 1,
              sub_id      : '',
              executive_bonus_flg: '',
            };
            if(!!ad_id) {
              postData['ad_id'] = ad_id;
            }

            for( var i = 0; i < busho.length && i < 10; i++ ) {
              postData['added_cid_arr[]'].push( busho[i]*1 );
            }

            for( var i = 1; i < kakushi.length && i < 5; i++ ) {
              postData['material_cid[]'].push( kakushi[i]*1 );
            }

            $.ajax(location.origin + '/union/expadd_execute.php', {
              data: postData,
              method: 'POST',
              beforeSend: xrwStatusText
            })
            .then( function( html ) {
              var msg = $(html).find('.common_box3bottom P:first').text();
              if(msg == '武将カードのランクを1つ上昇させます。') {
                alert('実行できませんでした。');
              } else {
                const ranks = $(html).find('div.busho_rank')
                for(let i=0; i<ranks.length; i++) {
                  const $rank = $(ranks[i])
                  const name = $rank.find('span.busho_name').text()
                  const lv = $rank.find('div[class="left"]').text()
                  const star_length = $rank.find('span.rank_glay').text().length
                  const star = `${'★'.repeat(5-star_length)}${'☆'.repeat(star_length)}`
                  $('#kakushi_inner').append(`<span>${name}: ${star} Lv.${lv}</span></br>`);
                }
                post();
              }
            });
          });
        }
      }

      createCardData(0).then((cs) => {
        cards = cs
        showDialog();
      })

    }
    const style = document.createElement('style');
    style.setAttribute('type','text/css');
    style.innerHTML = '' +
    '#kakushi_wrapper { position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 2000; }' +
    '#kakushi_dialog { position: relative; margin: auto; width: 80%; height: 90%; background-color: #f1f0dc; border: solid 2px #666; overflow: hidden; top: 48px; }' +
    '#kakushi_head { background-color: #ccc; padding: 8px; font-weight: bold; }' +
    '#kakushi_inner { margin: 8px 0px 8px 8px; padding-right: 8px; font-size: 12px; height: 85%; overflow: auto; }' +
    '#kakushi_exec { margin: 5px; padding: 5px 10px; border-top: solid 1px black; text-align: right; }' +
    '#kakushi_exec button { cursor: pointer; margin: 0 4px; width: 100px; height: 30px; }'
    document.head.appendChild(style);

    $('<div><li><a href="javascript:void(0);">【まとめて隠し玉】</a></li></div>')
        .css('font-color', 'white')
        .on('click', 'a', executeKakushi)
        .prependTo('li.gMenu01 > ul');
  }
  matomeKakushi()
})(j213$);