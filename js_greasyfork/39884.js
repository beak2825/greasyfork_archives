// ==UserScript==
// @name         Mod Panel
// @description  NHD Panel for Mods
// @version      2.17
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/torrents.php*
// @include      http*://www.nexushd.org/edit.php?*
// @include      http*://www.nexushd.org/details.php?*
// @include      http*://v6.nexushd.org/torrents.php*
// @include      http*://v6.nexushd.org/edit.php?*
// @include      http*://v6.nexushd.org/details.php?*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon         http://www.nexushd.org/favicon.ico
// @icon         https://v6.nexushd.org/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39884/Mod%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/39884/Mod%20Panel.meta.js
// ==/UserScript==
(function ($) {
  'use strict';
  //#region Global Variables
  const comments_col = Boolean($('table.torrents>tbody>tr a[href^="comment.php?action=add"], a[href$="#startcomments"]').length);
  const delete_col = Boolean($('.staff_delete').length);
  const this_user = $('#info_block a[href*="userdetails.php?id="]');
  const page_href = window.location.href;
  const this_username = this_user.text();
  const this_userlink = this_user[0].href;
  const this_userid = this_userlink.match(/id=(\d+)/)[1];
  const mouse_down = {
    $trow: undefined,
    class: undefined,
    $siblings: undefined,
    midYs: [],
    flag: false,
    posY: 0,
    lowY: 0,
    highY: 0,
    midY: 0
  };
  const mouse_pos = {
    posY: 0
  };
  const page_scroll = {
    top: 0
  };
  //#endregion

  //#region Configurations (JSON or Array)
  const trump_array = [
    {
      name: 'web',
      reason: 'BDRip版本已发布，移除来源质量较差的版本（如HDTV、WEB-DL、WEBRip等）',
      edit: {
        enable: false
      }
    },
    {
      name: 'scene',
      reason: '视频质量较差，较优版本获得至少24小时的免费促销',
      edit: {
        spstate: 2,
        promotionlength: 24,
        compatible: true
      }
    },
    {
      name: 'source',
      reason: '压制源质量较差，较优版本获得至少24小时的免费促销',
      edit: {
        spstate: 2,
        promotionlength: 24,
        compatible: true
      }
    },
    {
      name: 'top',
      reason: '经筛选本资源被淘汰，最优版本获得至少72小时的置顶和免费促销',
      edit: {
        posstate: 1,
        spstate: 2,
        promotionlength: 72,
        compatible: true
      }
    }
  ];
  const batch_array = [
    {
      type: 'trump',
      batchFun: fetchTrumpTemp,
      finalFun: falseDelete
    },
    {
      type: 'pack',
      batchFun: fetchPackTemp,
      finalFun: falseDelete
    }
  ]
  const status_json = {
    seeders: {
      text: '正在做种',
      color: '#0f0'
    },
    leechers: {
      text: '正在下载',
      color: '#ffd700'
    },
    snatchers: {
      text: '下载完成',
      color: '#f00'
    }
  };
  const bgcolor_json = {
    checked: 'rgb(150, 150, 150)',
    unchecked: 'rgb(202, 202, 202)'
  };
  const torrents_colhead_json = {
    unfold: '展开',
    fold: '收起'
  };
  const details_colhead_json = {
    'select-all': '全选',
    'unselect-all': '清除'
  }
  const icon_json = {
    unfold: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC' +
    'jElEQVR4Aa2V30uTURjHnVBUgglCaXVTJJVLMdhQm7+1JEvJiKAggmgSQiKJl0V0E13UVf0HQZmB' +
    'Lcvlpqa55tqV0YoMzIhY6js0yDH11X17vuO8Sq5Zgl/48DznPD/G63nOMSmBkoUNwhYhTUgn9NUe' +
    'Y8z5p0wqOVXYKRwQLMJhhYV7Kpaqck2rNdskbBPMdrv9osfjcQaDwW/RaHSR0OceY8xhrqox/a3Z' +
    'ZmGHkO9wOB7ouj6PBGKMOcxlzcqmdDYKGZmZmSWjo6PvIYosRuDWXGj50IwTb4+hxleN5sAVvJh4' +
    'jvBCGBRzWSO121UPk3EAaUKuz+d7ycTp+Wnc/nwL1d4qHBVidmjZv/npBkJzGiiv19vFWmGrcVDs' +
    'vKupqeky/056VMf1j9dQOViBKo9Aa/ixdbnYcrQGWsBc1jQ2NtrZQ/VKShHM8kvdEPVN9qJsoBRl' +
    '/aUoHyiJ+UpcCxJTtmfCDYoHJT2yYyOlPtcaCoUmGGwdbkVRbxGK+2y0gg2GisUvNmJCy/BVUJqm' +
    '/eBIxXqpgbUtiBise12HQlc+ClwFSKRCiZH6wXpQs7OzETWn6XENa/trYemywuK0IpGsTotgRU3f' +
    'cVBzouWG6pOnpqY0BhuGGpDXeUjIW7JKcfuX3tjjP9k4FBkZN4PtY+042JGzzNMcGDJ35C7tmcU+' +
    '+tJmjE63OpSUuLEJ62GcfXUO+59kr8rJnlOY0WfAGtYaY/PHYPv9fhdEY7++4nz/BWS17UPWY0Es' +
    '2avWp3vOYOTnCCheBtaqHskJr95kZBL3AvdR2XkEex5mYbdQ+qwCd97dRTAcXHn1Moyrt16PA2tN' +
    '//V8jY+Pf4cS/VWerzU9sDay1gd2Xf4F/AZqlpeB9836LwAAAABJRU5ErkJggg==',
    fold: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC' +
    'dUlEQVR4Aa2V30tTYRjHVSgsoQKhXPUPlKZMlImiIIg/pggiiDeCBAdqyC4Kf9zVhVdeelX33QnC' +
    'btYvxZsxxkoqKxiz1SzdFudMb5xO5/bt+fa+sPCw3IVf+PA+532e5ytn53lfK0qoSrggXBauCbUK' +
    'xtxjjjVnq1IXXxFuCXeEFqGdMOYec6zRtZX/M6sWrgv1hmHcDwQCLxOJxM9CoZAnjLnHHGt0bbXd' +
    'VG1cEm4KLp/P9yKXyx2jhJhjDWvZc9qUwUWhzuFwdMVisc8QFQ4PcbCygvT0NJLDw0gNDSH96DEy' +
    'fj8KmQwo1rJHem8oD2VapX/sxlAo9Aqi/N4e9hYWsDMwgARxD2DH7ZZYren5eZxYFqhgMOhnr3BV' +
    'eSnn216v98Hf3yqXg/X0CX719YFs9/WquJfPGtkzZ2fBWvZ4PB6DHtqrokaol7/0GqLM2hq2enps' +
    'xMmpvf3VVVD8UOJxV42Uet1Wy7J+M5mam8P37u6ySM7MgDJNM8mRUl5qYDtOREz+GB3FZlcXNjs7' +
    'UUrMk/jYGKhsNnuo57TWZhgTw0hHO0EpRdpV/tvICKgjUdFQv/Lu7q7JZHxqCl9dLqGtSJtL4VJ8' +
    '0Wvc8xD2V9YfRUbmLZPp5WVstLTYaSWt+lmt1tISKH5Q/VFqbGOTl6GNTk7iQ3Oz4FSrU8UfuTqd' +
    'BJHxceQz+2APe/8Zm+Jgh8PhNxBlt7YQNQysNzVivbEJ7wXGiiZEJiZwEI2C4mFgr/aoKnn0jk0T' +
    'iWfPsTE4iHcN9xBuaMCn/n5sLy7iKJk8ffTqikfvfC4H9laWdX2lUqltaDEu9/o664LtIOVfsOf4' +
    'L+APb5yaiwyN8+8AAAAASUVORK5CYII=',
  };
  //#endregion

  //#region Configurations (Functions Return Template Functions)
  function fetchTrumpTemp(ID, PROMEND, titles, reason, edit){
    return (id, i) => fetchMassSendPM(
      id,
      titles[i],
      {
        ID: ID,
        reason: reason
      }
    ).then(
      e => Promise.all([
        fetchSendPM(
          replyPMTemp(
            {
              receivers: e,
              ID: ID,
              id: id,
              title: titles[i],
              reason: reason
            }
          )
        ),
        fetchDelete(
          id,
          {
            type: 5,
            reason: deleteReasonTemp(
              {
                ID: ID,
                reason: reason
              }
            )
          }
        ),
        fetchEdit(
          ID,
          Object.assign(
            edit,
            {
              promotionend: PROMEND
            }
          )
        )
      ])
    ).then(
      () => id
    );
  }

  function fetchPackTemp(){
    return id =>
    fetchDelete(
      id,
      {
        type: 5,
        reason: 'pack'
      }
    ).then(
      () => id
    )
  }

  function batchClickCallbackTemp(type, ID, PROMEND){
    return (evt) => {
      const target = evt.target;
      const targets = $(`.other-versions-${ID}:has(.pick:checked)`);
      const ids = targets
      .toArray()
      .map(
        e => $(e).find('.pick')[0]
        .id
        .match(/\d+$/)[0]
      );
      const titles = targets
      .toArray()
      .map(
        e => $(e.children[2])
        .find(`a[href*="details.php?id="]`)
        .text()
      );
      const {reason, edit} = trump_array.find(e=>e.name === target.name)||{reason: undefined, edit: undefined};
      const batch_operation = batch_array.find(e => e.type === type);
      if (ids.length && window.confirm('你确定要继续吗？批量删除操作将不可逆')) {
        $(target).closest('.panel-row').find('*').prop('disabled', true);
        Promise.all(
          ids.map(
            batch_operation.batchFun(ID, PROMEND, titles, reason, edit)
          )
        ).then(batch_operation.finalFun).then(() => {
          $(target).closest('.panel-row').find('*').prop('disabled', false);
        });
      }
    }
  }


  function trumpDeleteTemp(){
    return `<tr>
			<td width="0" class="rowhead nowrap" valign="top" align="right">
				<label>
					<input class="trump" name="reasontype" type="radio" value="5">
					淘汰				</label>
			</td>
			<td class="rowfollow" valign="top" align="left">
				<input class="better-version" type="text" style="width: 200px" placeholder="保留版本的ID或链接">
				(必填)			<div style="padding:5px 5px 0px 0px"><textarea class="trump-reason" style="width: 100%" placeholder="具体说明"></textarea></div></td>
		</tr>`
  }
  //#endregion

  //#region Configurations (Functions Return Template Strings)
  function rowTemp([
    ID,
    type,
    id,
    title,
    sub_title,
    date,
    size,
    seeders,
    leechers
  ]) {
    return `<tr class="other-versions-${ID}" style="background-color:${bgcolor_json.unchecked}">\
<td class="rowfollow nowrap" align="middle" style="padding: 0px"><input id="other-version-${id}" class="pick" type="checkbox"/></td>
<td class="rowfollow nowrap" valign="middle" style="padding: 0px">${type}</td>
<td class="rowfollow" align="left"><table class="torrentname" width="100%"><tbody><tr>\
<td class="embedded"><a title="${title}" href="details.php?id=${id}&hit=1">\
<b>${title}</b></a> <a href="torrents.php?search=${title.replace(/\.{2}$/ , '').trim()}&search_mode=${title.match(/\.{2}$/) ? 0 : 2}#searchinput">\
<b>[<font style="color:rgb(34,118,187)">搜索</font>]</b></a><br>${sub_title}</td>
<td width="20" class="embedded" style="text-align: right; " valign="middle"><a href="download.php?id=${id}">\
<img class="download" src="pic/trans.gif" style="padding-bottom: 2px;" alt="download" title="下载本种"></a></td>
</tr></tbody></table></td>${
    comments_col
      ? `<td class="rowfollow"><a href="comment.php?action=add&pid=${id}&type=torrent" title="添加评论">+</a></td>`
    : ''
  }<td class="rowfollow nowrap">${date}</td><td class="rowfollow">${size}</td><td class="rowfollow" align="center">${
    seeders === 0
      ? seeders
    : `<b><a href="details.php?id=${id}&hit=1&dllist=1#seeders">${seeders}</a></b>`
  }</td>
<td class="rowfollow">${
    leechers === 0
      ? leechers
    : `<b><a href="details.php?id=${id}&hit=1&dllist=1#leechers">${leechers}</a></b>`
  }</td>
<td class="rowfollow">-</td>
<td class="rowfollow" align="center"><i>-</i></td>${
    delete_col
      ? `<td class="rowfollow"><a href="fastdelete.php?id=${id}"><img class="staff_delete" src="pic/trans.gif" alt="D" title="删除"></a><br>\
<a href="edit.php?returnto=%2Ftorrents.php&id=${id}"><img class="staff_edit" src="pic/trans.gif" alt="E" title="编辑"></a></td>`
    : ''
  }</tr>`;
  }

  function panelButtonTemp(name) {
    return $(
      `<input type="button" name="${name}" value="${name[0].toUpperCase()}${name.slice(
        1
      )}" class="btn medium" style="margin:2px;width:6%">`
    );
  }

  function massPMTemp({
    status = '',
    ID,
    id,
    title,
    reason
  }) {
    const body_status = (status_json[status] || {text: ''}).text || '正在做种或下载（过）';
    return {
      subject: `种子被删除：${id}（${title}）`,
      content: `你好，你的一个${body_status}的种子：${id}（${title}）已被[url=${this_userlink}]${this_username}[/url]删除

原因：trump（淘汰）
${reason}

你可以到这里下载到质量更好的版本：http://www.nexushd.org/details.php?id=${ID}

这是一条自动发送的消息，无需回复。但是如果你有任何疑问，可以向[url=contactstaff.php]管理组[/url]咨询。`
    };
  }

  function replyPMTemp({
    receivers,
    ID,
    id,
    title,
    reason
  }) {
    const temp = massPMTemp({
      ID: ID,
      id: id,
      title: title,
      reason: reason
    });
    const num_of_receivers = receivers.map(e=>e.num).reduce((a, b)=>(a + b), 0);
    const body_of_receivers = receivers.map(e=>{
      return `[color=${status_json[e.status].color}]${e.users.map(e=>e.name).join(' ')}[/color]`
    }).join(' ');
    return {
      subject: `${id}（${title}）删种群发成功`,
      content: `[quote=标题]${temp.subject}[/quote]\
[quote=内容]${temp.content}[/quote]\
[quote=收信人（共${num_of_receivers}人）]${body_of_receivers}[/quote]`
    }
  }

  function deleteReasonTemp({ID, reason}) {
    return `Trump!（淘汰）
质量更好的版本：http://www.nexushd.org/details.php?id=${ID}
详细原因：${reason}`
  }
  //#endregion

  //#region Promises
  function fetchSendPM({
    user = {
      id: this_userid,
      name: this_username
    },
    subject = `Test Personal Mail`,
    content = `This is a test PM. Please ignore it if you've received one.`,
    save_log = false
  } = {}) {
    const data = new URLSearchParams();
    data.append('receiver', user.id);
    data.append('subject', subject);
    data.append('body', content);
    data.append('save', save_log);
    return fetch('takemessage.php', {
      body: data,
      method: 'POST'
    }).then(() => user);
  }

  function fetchStatusSendPM(users, {status, ID, id, title, reason}){
    return Promise.all(users.map(
      e => fetchSendPM(
        Object.assign({
          user: e//undefined
        }, massPMTemp({
          status: status,
          ID: ID,
          id: id,
          title: title,
          reason: reason
        })))
    )).then(
      e => ({
        status: status,
        users: e,
        num: e.length
      })
    );
  }

  function fetchMassSendPM(id, title, {ID, reason}){
    return fetchUploaderPeers(id).then(
      e => {
        const promises = [];
        for (let status in e[1]) {
          promises.push(
            fetchStatusSendPM(
              e[1][status].filter(
                x => x.id !== e[0].uploader
              ),
              {
                status: status,
                ID: ID,
                id: id,
                title: title,
                reason: reason
              }
            )
          )
        }
        return Promise.all(promises);
      }
    );
  }

  function fetchUploaderPeers(id){
    return Promise.all(
      [
        fetchUploader(id),
        fetchPeers(id)
      ]
    );
  }

  function fetchUploader(torrent_id) {
    return fetch(`details.php?id=${torrent_id}`)
      .then(e => e.text())
      .then(e => {
      const vd = document.implementation.createHTMLDocument('virtual');
      return {
        uploader: ((
          $(e, vd).find('#bookmark0 ~ span.nowrap>a')[0] || {
            href: ''
          }
        ).href.match(/id=(\d+)/) || [])[1]
      };
    });
  }

  function fetchPeers(torrent_id) {
    return Promise.all([
      fetchSeedersLeechers(torrent_id),
      fetchSnatchers(torrent_id)
    ]).then(e => Object.assign(
      e[0],
      {
        snatchers: e[1].snatchers.filter(
          snatcher => e[0].seeders.every(
            seeder => seeder.id !== snatcher.id
          )
        )
      }
    ));
  }

  function fetchSeedersLeechers(torrent_id) {
    return fetch(`viewpeerlist.php?id=${torrent_id}`)
      .then(e => e.text())
      .then(e => {
      const content = $(e);
      const seeders = content
      .filter('table.main:first')
      .find('a[href^="userdetails.php"]')
      .toArray()
      .map(e => ({
        id: e.href.match(/id=(\d+)/)[1],
        name: e.innerText
      }));
      const leechers = content
      .filter('table.main:nth-of-type(2)')
      .find('a[href^="userdetails.php"]')
      .toArray()
      .map(e => ({
        id: e.href.match(/id=(\d+)/)[1],
        name: e.innerText
      }));
      return {
        seeders: seeders,
        leechers: leechers
      };
    });
  }

  function fetchSnatchers(torrent_id) {
    return fetchOnePageSnatchers(torrent_id).then(e => {
      let total;
      if ((total = e.total)) {
        let batch = [];
        let base = e.snatchers;
        for (let i = 1; i <= total; ++i) {
          batch.push(
            fetchOnePageSnatchers(torrent_id, i).then(e => e.snatchers)
          );
        }
        return Promise.all(batch).then(e => {
          return {
            snatchers: base.concat(...e)
          };
        });
      } else {
        return e;
      }
    });
  }

  function fetchOnePageSnatchers(torrent_id, page = 0) {
    return fetch(`viewsnatches.php?id=${torrent_id}&page=${page}`)
      .then(e => e.text())
      .then(e => {
      const vd = document.implementation.createHTMLDocument('virtual');
      const snatchers = $(e, vd)
      .find('table.main table a[href^="userdetails.php"]')
      .toArray()
      .map(e => ({
        id: e.href.match(/id=(\d+)/)[1],
        name: e.innerText
      }));
      let total;
      if (
        page === 0 &&
        (total = Math.max(
          ...$(e, vd)
          .find('a[href^="/viewsnatches.php"]')
          .toArray()
          .map(e => parseInt(e.href.match(/page=(\d+)$/)[1])),
          0
        ))
      ) {
        return {
          snatchers: snatchers,
          total: total
        };
      } else {
        return {
          snatchers: snatchers
        };
      }
    });
  }

  function fetchVersions(torrent_link) {
    const id = torrent_link.match(/id=(\d+)/)[1];
    return fetch(torrent_link)
      .then(e => e.text())
      .then(e => {
      const vd = document.implementation.createHTMLDocument('virtual');
      const other_copies = $(e, vd)
      .find('#kothercopy>table>tbody>tr')
      .toArray()
      .slice(1)
      .map((e, i) => {
        const $t_row = $(
          rowTemp([
            id,
            e.children[0].innerHTML,
            e.children[1].children[0].href.match(/id=(\d+)/)[1],
            e.children[1].children[0].innerText,
            e.children[2].innerText,
            e.children[4].innerText.split(' ').join('<br>').replace(/^(\d+[年月天时分秒])(\d+[年月天时分秒])$/, '$1<br>$2'),
            e.children[3].innerText.split(' ').join('<br>'),
            parseInt(e.children[5].innerText),
            parseInt(e.children[6].innerText)
          ])
        );
        const $check_box = $t_row.find('.pick');
        $check_box.on('click', (evt) => {
          switch ($check_box.prop('checked')) {
            case false:
              $t_row.css('background-color', bgcolor_json.unchecked);
              break;
            case true:
              $t_row.css('background-color', bgcolor_json.checked);
              break;
          }
        });
        $t_row.prop('unchanged', true);
        $t_row.on('click', (evt) => {
          if ($(evt.target).closest('.pick').length === 0) {
            $check_box.click();
          }
        }).on('mousedown', trMousedownCallback);
        $t_row.find('a, a *').on('click', evt => {
          evt.stopPropagation();
        });
        return $t_row;
      });
      return other_copies;
    });
  }

  function fetchDelete(torrent_id, {type = 5, reason = '', delete_subs = 1} = {}) {
    const data = new URLSearchParams();
    data.append('id', torrent_id);
    data.append('reasontype', type);
    data.append('reason[]', type === 2 ? reason : '');
    data.append('reason[]', type === 3 ? reason : '');
    data.append('reason[]', type === 4 ? (reason || 'Other') : '');
    data.append('reason[]', type === 5 ? (reason || 'Other') : '');
    data.append('deletesubs', delete_subs);
    return fetch('delete.php', {
      body: data,
      method: 'POST'
    });
  }

  function fetchEdit(torrent_id, {
    enable = true,
    posstate = undefined,
    spstate = undefined,
    promotionlength = -1,
    recmovie = undefined,
    compatible = false,
    promotionend = NaN
  } = {}) {
    if(enable){
      return fetch(`edit.php?id=${torrent_id}`)
        .then(e => e.text())
        .then(e => {
        const vd = document.implementation.createHTMLDocument('virtual');
        const data = new URLSearchParams(
          $(e, vd).find('#compose').serialize()
        );
        const before_spstate = data.get('sel_spstate');
        let promotionleft;
        if(!isNaN(promotionend)){
          promotionleft = promotionend - Date.now();
        }
        else if(before_spstate != 1){
          promotionleft = Infinity;
        }
        else{
          promotionleft = 0;
        }
        if(typeof posstate !== 'undefined'){
          data.set('sel_posstate', posstate);
        }
        if((!compatible) || (before_spstate != spstate) || (promotionleft/3600000 <= promotionlength)){
          data.set('promotionlength', promotionlength);
        }
        if(typeof spstate !== 'undefined'){
          data.set('sel_spstate', spstate);
        }
        let temp = data.get('sel_recmovie');
        if((typeof recmovie !== 'undefined') && (recmovie != temp) && ((compatible && (temp != 2)) || (!compatible))){
          data.set('sel_recmovie', recmovie);
        }
        return data;
      }).then(e => fetch('takeedit.php', {
        body: e,
        method: 'POST'
      }));
    }
    else{
      return;
    }
  }

  function falseDelete(ids){
    const page_href = window.location.href;
    return new Promise((resolve, reject) => {
      if(page_href.match('/torrents.php')){
        $('a[href*="details.php?id="]')
          .filter((i, e) => ids.includes(e.href.match(/id=(\d+)/)[1]))
          .closest('.torrents>tbody>tr')
          .remove();
        const $panel_rmv = $('tr:not([class*="other-versions"]) + tr[class*="panel-row"]');
        const $button_rmv = $panel_rmv.prev().find('.toggle-button');
        $panel_rmv.remove();
        $button_rmv.children().remove();
        $button_rmv.css('cursor', '').off('click');
      }
      else if(page_href.match('/details.php')){
        $('a[href*="details.php?id="]')
          .filter((i, e) => ids.includes(e.href.match(/id=(\d+)/)[1]))
          .closest('#kothercopy>table>tbody>tr')
          .remove();
        const $panel_rmv = $('tr:not([class*="other-versions"]) + tr[class*="panel-row"]');
        if($panel_rmv.length){
          $('#picothercopy').closest('tr').remove();
        }
        else{
          const count = $('b', $('#kothercopy').parent());
          count.text(count.text().replace(/\d+/, (m)=>parseInt(m) - ids.length));
        }
      }
      resolve(true);
    });
  }
  //#endregion

  //#region Callback Functions
  function BUTTONClickCallback(evt){
    let $button = $(evt.target);
    let $temp;
    switch ($button.attr('state')) {
      case '0':
        $temp = $('.toggle-button[state="0"]');
        $button.text(torrents_colhead_json.fold);
        $button.attr('state', '1');
        $temp.trigger('click', [true]);
        break;
      case '1':
        $temp = $('.toggle-button[state="1"]');
        $button.text(torrents_colhead_json.unfold);
        $button.attr('state', '0');
        $temp.trigger('click', [true]);
        break;
    }
  }

  function selectClickCallback(evt){
    let $button = $(evt.target);
    let $temp;
    switch ($button.attr('state')) {
      case '0':
        $temp = $('.pick:not(:checked)');
        $button.text(details_colhead_json['unselect-all']);
        $button.attr('state', '1');
        $temp.trigger('click', [true]);
        break;
      case '1':
        $temp = $('.pick:checked');
        $button.text(details_colhead_json['select-all']);
        $button.attr('state', '0');
        $temp.trigger('click', [true]);
        break;
    }
  }

  function stickyClickCallback(evt){
    const pin = evt.target;
    $(pin).off('click');
    const $trow = $(pin).closest('table.torrents>tbody>tr');
    const id = $(pin).next('a[href^="details.php?id="]')[0].href.match(/id=(\d+)/)[1];
    return fetchEdit(id, {
      posstate: 0,
      spstate: evt.shiftKey? 1 : 6,
      promotionlength: 0
    }).then(() => {
      pin.nextSibling
      $(pin).remove();
    });
  }

  function trMousedownCallback(evt){
    evt.preventDefault();
    mouse_down.$trow = $(evt.target)
      .closest('[class*="other-versions-"]');
    mouse_down.class = mouse_down.$trow.attr('class')
      .split(' ')
      .find(e=>/^other\-versions\-/.test(e));
    mouse_down.$siblings = mouse_down.$trow.siblings(`.${mouse_down.class}:not(.panel-row)`).addBack();
    mouse_down.midYs = mouse_down.$siblings.map((i, e)=>$(e).outerHeight()/2 + $(e).offset().top);
    mouse_down.flag = true;
    mouse_down.posY = evt.pageY;
    mouse_down.lowY = mouse_down.$trow.offset().top;
    mouse_down.highY = mouse_down.lowY + mouse_down.$trow.outerHeight();
    mouse_down.midY = (mouse_down.lowY + mouse_down.highY)/2;

    mouse_pos.posY = mouse_down.posY;
    page_scroll.top = $(document).scrollTop();
  }

  function trowsCallback(i, e) {
    const $e = $(e);
    const midY = mouse_down.midYs[i];
    if((mouse_down.posY < midY && midY <= mouse_pos.posY) ||
       (mouse_down.posY > midY && midY >= mouse_pos.posY)){
      if($e.prop('unchanged')){
        $e.trigger('click');
        $e.prop('unchanged', false);
      }
    }
    else{
      if(!$e.prop('unchanged')){
        $e.trigger('click');
        $e.prop('unchanged', true);
      }
    }
  }

  function docMousemoveCallback(evt){
    if(mouse_down.flag){
      evt.preventDefault();
      mouse_pos.posY = evt.pageY;
      page_scroll.top = $(document).scrollTop();
      mouse_down.$siblings.map(trowsCallback);
    }
  }

  function docScrollCallback(evt){
    if(mouse_down.flag){
      let temp = $(document).scrollTop();
      if(page_scroll.top != temp){
        mouse_pos.posY -= (page_scroll.top - temp);
        page_scroll.top = temp;
      }
      mouse_down.$siblings.map(trowsCallback);
    }
  }

  function docMouseupCallback(evt){
    if(mouse_down.flag){
      const mouseY = evt.pageY;
      if(
        (mouse_down.lowY <= mouseY && mouseY <= mouse_down.highY) && (
          (mouse_down.posY < mouse_down.midY && mouse_down.midY <= mouseY) ||
          (mouse_down.posY > mouse_down.midY && mouse_down.midY >= mouseY)
        )
      ){
        mouse_down.$trow.trigger('click');
      }
      mouse_down.$trow = undefined;
      mouse_down.class = undefined;
      mouse_down.$siblings = undefined;
      mouse_down.midYs = [];
      mouse_down.flag = false;
      mouse_down.posY = 0;
      mouse_down.lowY = 0;
      mouse_down.highY = 0;
      mouse_down.midY = 0;

      mouse_pos.posY = 0;
      page_scroll.top = 0;
      $('[class*="other-versions-"]:not([class*="panel-row"])').prop('unchanged', true);
    }
  }
  //#endregion


  if(page_href.match('/torrents.php')){

    //#region Mouse Move, Mouse Up & Scroll Event Behavior
    $(document)
      .on('mousemove', docMousemoveCallback)
      .on('mouseup', docMouseupCallback)
      .on('scroll', docScrollCallback);
    //#endregion

    //#region Mod Buttons Behavior
    $('table.torrents>tbody>tr').map((i, e) => {
      if (i === 0) {
        const $BUTTON = $(
          `<a id="toggle-all-button" href="javascript:void(0)" state="0">${torrents_colhead_json.unfold}</a>`
        );
        $BUTTON.click(BUTTONClickCallback);
        $(e).prepend(
          $('<td class="colhead" style="padding: 0px"/>').append($BUTTON)
        );
      }
      else {
        const $toggle_button = $(
          `<td class="rowfollow nowrap toggle-button" valign="middle" style="padding:0px;cursor:pointer" state="0">\
<img src="${icon_json.unfold}" style="padding:7px"/></td>`
        );
        const $BUTTON = $('#toggle-all-button');
        const torrent_link = $(e.children[1])
        .find('a[href^="details.php"]')
        .attr('href');
        const torrent_id = torrent_link.match(/id=(\d+)/)[1];
        const torrent_promotion_end = Date.parse(
          ($(e.children[1])
           .find('span[title]')
           .toArray()
           .filter(e=>{
            if(e){
              return e.title.match(/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/)
            }
            else{
              return false;
            }
          })[0] || {title: undefined}).title
        );
        const col_num = e.children.length;
        const click_fun = (evt, flag = false) => {
          $toggle_button.off('click');
          let temp;
          switch ($toggle_button.attr('state')) {
            case '0':
              new Promise((resolve, reject) => {
                if ((temp = $(`.other-versions-${torrent_id}`)).length) {
                  temp.show();
                  resolve(true);
                }
                else {
                  const $panel = $(
                    `<td colspan="${col_num + 1}" style="border:0;text-align:center;vertical-align:middle"/>`
                  );

                  const trump_buttons = trump_array.map(e=>panelButtonTemp(e.name));
                  $(trump_buttons).map((i, e) => e.toArray()).on('click', batchClickCallbackTemp('trump', torrent_id, torrent_promotion_end));

                  const $pack_button = panelButtonTemp('pack');
                  $pack_button.on('click', batchClickCallbackTemp('pack', torrent_id));

                  const buttons = [$pack_button].concat(trump_buttons);

                  fetchVersions(torrent_link).then(e => {
                    if (e.length) {
                      $toggle_button
                        .closest('tr')
                        .after(
                        $(`<tr class="other-versions-${torrent_id} panel-row"/>`)
                        .append(
                          $panel.append(buttons)
                        )
                      )
                        .after(e);
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  });
                }
              }).then(e => {
                if (e) {
                  $toggle_button
                    .find('img')
                    .attr(
                    'src',
                    icon_json.fold
                  );
                  $toggle_button.attr('state', '1');
                  $toggle_button.on('click', click_fun);
                  if (flag) {
                    if ($BUTTON.attr('state') === '0') {
                      $toggle_button.trigger('click');
                    }
                  }
                } else {
                  $toggle_button.css('cursor', '');
                  $toggle_button.children().remove();
                }
              });
              break;
            case '1':
              if (evt.shiftKey) {
                const unchecked = $(
                  `.other-versions-${torrent_id} .pick:not(:checked)`
                );
                const checked = $(`.other-versions-${torrent_id} .pick:checked`);
                if (checked.length <= unchecked.length) {
                  unchecked.click();
                } else {
                  checked.click();
                }
                $toggle_button.on('click', click_fun);
              }
              else {
                $(`.other-versions-${torrent_id}`).hide();
                $toggle_button
                  .find('img')
                  .attr(
                  'src',
                  icon_json.unfold
                );
                $toggle_button.attr('state', '0');
                $toggle_button.on('click', click_fun);
                if (flag) {
                  if ($BUTTON.attr('state') === '1') {
                    $toggle_button.trigger('click');
                  }
                }
              }
              break;
          }
        };
        $toggle_button.on('click', click_fun);
        $(e).prepend($toggle_button);
      }
    });
    //#endregion

    //#region Sticky Behavior
    $('img.sticky').css('cursor', 'pointer').on('click', stickyClickCallback);
    //#endregion
  }
  else if(page_href.match('/edit.php')){
    let $form = $('form[action="delete.php"]');
    $form
      .find('tr:has(input[name="reason[]"]):last')
      .before(trumpDeleteTemp());
    $form.submit((evt)=>{
      evt.preventDefault();
      if($form.find('input[name="reasontype"].trump').prop('checked')){
        let better_version = $form.find('input.better-version').val();
        let ID, temp;
        if((temp = better_version.match(/^\d+$/))){
          ID = temp[0];
        }
        else if((temp = better_version.match(/id=(\d+)/))){
          ID = temp[1];
        }
        else{
          ID = null;
        }
        if(ID){
          let trump_reason = $form.find('textarea.trump-reason').val();
          let id = $form.find('input[name="id"]').val();
          let titles = [$('#compose tr:first').text()];
          let reason = deleteReasonTemp({ID: ID, reason: trump_reason});
          fetchTrumpTemp(ID, undefined, titles, reason, {enable: false})(id, 0).then(e=>{
            window.location.href = `edit.php?id=${ID}`;
            alert(`种子：${e}（${titles[0]}）删除成功！
请在页面跳转后，编辑保留版本的促销状态！`)
          });
        }
        else{
          $form.unbind('submit').submit();
        }
      }
      else{
        $form.unbind('submit').submit();
      }
    });
  }
  else if(page_href.match('/details.php')){
    const torrent_id = $('#compose>input[name="pid"]').val();
    const torrent_promotion_end = Date.parse(
      ($('#top')
       .find('span[title]')
       .toArray()
       .filter(e=>{
        if(e){
          return e.title.match(/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/)
        }
        else{
          return false;
        }
      })[0] || {title: undefined}).title
    );
    $('#kothercopy>table>tbody>tr').map((i, e) => {
      const $e = $(e);
      if (i === 0) {
        const BUTTON = $(
          `<a id="select-all-button" href="javascript:void(0)" state="0">${details_colhead_json['select-all']}</a>`
        );
        BUTTON.click(selectClickCallback);
        $e.prepend(
          $('<td class="colhead" style="padding: 0px; text-align:center;"/>').append(BUTTON)
        );
      }
      else{
        $e.addClass(`other-versions-${torrent_id}`);
        $e.prop('unchanged', true);
        const id = e.children[1].children[0].href.match(/id=(\d+)/)[1];
        const $check_box = $(`<input id="other-version-${id}" class="pick" type="checkbox" style="margin: 10px"/>`);
        $e.prepend(
          $('<td class="rowfollow nowrap" align="middle" style="padding: 0px"/>').append($check_box)
        );
        $check_box.on('click', (evt) => {
          switch ($check_box.prop('checked')) {
            case false:
              $(e).css('background-color', '');
              break;
            case true:
              $(e).css('background-color', bgcolor_json.checked);
              break;
          }
        });
        $e.on('click', evt => {
          if ($(evt.target).closest('.pick').length === 0) {
            $check_box.click();
          }
        }).on('mousedown', trMousedownCallback);
        $e.find('a, a *').on('click', evt => {
          evt.stopPropagation();
        });
      }
    });
    const $panel = $(
      `<td colspan="8" style="border:0;text-align:center;vertical-align:middle"/>`
    );

    const trump_buttons = trump_array.map(e=>panelButtonTemp(e.name));
    $(trump_buttons).map((i, e) => e.toArray()).on('click', batchClickCallbackTemp('trump', torrent_id, torrent_promotion_end));

    const $pack_button = panelButtonTemp('pack');
    $pack_button.on('click', batchClickCallbackTemp('pack', torrent_id));

    const buttons = [$pack_button].concat(trump_buttons);

    $('#kothercopy>table>tbody').append(
      $(`<tr class="other-versions-${torrent_id} panel-row"/>`)
      .append(
        $panel.append(buttons)
      )
    );

    //#region Mouse Move, Mouse Up & Scroll Event Behavior
    $(document)
      .on('mousemove', docMousemoveCallback)
      .on('mouseup', docMouseupCallback)
      .on('scroll', docScrollCallback);
    //#endregion
  }
})(window.$.noConflict(true));