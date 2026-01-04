// ==UserScript==
// @name        一键转种至 fsm
// @namespace   https://github.com/tomyangsh/userscrips
// @match       https://www.happyfappy.org/torrents.php?id=*
// @match       https://our.kelu.one/details.php?id=*
// @match       https://www.nicept.net/details.php?id=*
// @match       https://rousi.zip/details.php?id=*
// @match       https://share.ilolicon.com/details.php?id=*
// @match       https://bitporn.eu/details.php?id=*
// @match       https://kufirc.com/torrents.php?id=*
// @match       https://kamept.com/details.php?id=*
// @match       https://exoticaz.to/torrent/*
// @match       https://www.pttime.org/details.php?id=*
// @match       https://pornbay.org/torrents.php?id=*
// @match       https://www.empornium.is/torrents.php?id=*
// @match       https://www.empornium.sx/torrents.php?id=*
// @match       https://kp.m-team.cc/detail/*
// @match       https://zp.m-team.io/detail/*
// @match       https://xp.m-team.cc/detail/*
// @match       https://fsm.name/Torrents/new?autofill
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.xmlHttpRequest
// @grant       GM_registerMenuCommand
// @version     2.11.9
// @author      大統領 (fix by seed)
// @description 目前支持：馒头/emp/pb/ptt/exo/kamept/kufirc/bitporn/ilolicon/rousi/nicept/kelu/happyfappy (适配更新后的馒头 启用脚本后需要设置馒头的TOKEN）
// @icon        https://img.fsm.name/21/69/2169f715a4805d2643db30a4b8fd95d0.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523488/%E4%B8%80%E9%94%AE%E8%BD%AC%E7%A7%8D%E8%87%B3%20fsm.user.js
// @updateURL https://update.greasyfork.org/scripts/523488/%E4%B8%80%E9%94%AE%E8%BD%AC%E7%A7%8D%E8%87%B3%20fsm.meta.js
// ==/UserScript==

// 添加设置MT TOKEN的菜单
GM_registerMenuCommand("设置MT TOKEN", () => {
  const token = prompt("请输入MT TOKEN:");
  if (token) {
    GM_setValue("MT_TOKEN", token);
    alert("MT TOKEN设置成功！");
  }
});

const HOST = document.location.host.match(/([^.]+)\.\w+$/)[1];

function process_luminance() {
  const link_box = document.querySelector('div.linkbox');

  const fsm_link = create_link(function () {
    let title = document.querySelector('h2').innerText;
    let info_node = document.querySelector('#descbox');
    let img_list = []

    let image_cover = document.querySelector('#coverimage img').src.replace('resize/250/', '');
    img_list.push(image_cover);
    info_node.querySelectorAll('img').forEach(node => {
      let image = node.src.replace(/\.(th|md)(\.\w+)$/, '$2');
      img_list.push(image);
    });

    const tag = document.querySelector('td.cats_col div').title;
    const torrent_url = document.querySelector('a.blueButton').href;
    const upload_info = {
      "title": title,
      "img_list": img_list,
      "tag": tag,
      "torrent_url": torrent_url
    }
    GM_setValue("upload_info", upload_info);
  })

  link_box.append(fsm_link);
}

function process_nexus() {
  let subtitle;
  let action_bar;
  let tags = [];

  document.querySelectorAll('td.rowhead').forEach(td => {
    switch (td.innerText) {
      case '资源标签':
      case '標簽':
      case '标签': {
        td.nextElementSibling.querySelectorAll('span').forEach(span => {
          tags.push(span.innerText);
        })

        break;
      }
      case '副標題':
      case '副标题': {
        subtitle = td.nextElementSibling.innerText;

        break;
      }
      case '基本資訊':
      case '基本信息': {
        const attribute = td.nextElementSibling.innerText;
        if (attribute.match('无码')) {
          tags.push('无码');
        } else if (attribute.match('有码')) {
          tags.push('有码');
        }

        break;
      }
      case 'Basic Info': {
        const type = td.nextElementSibling.innerText.match(/Type:\s(\w+)/)[1];
        tags.push(type);

        break;
      }
      case 'Action':
      case '行為':
      case '行为': {
        action_bar = td.nextElementSibling;

        break;
      }
    }
  })

  const fsm_link = create_link(function () {
    const title = document.querySelector('h1').firstChild.textContent;
    const info_node = document.querySelector('#kdescr');
    const img_list = [];

    info_node.querySelectorAll('img').forEach(img => {
      let image = img.src.replace('.thumb.jpg', '');
      img_list.push(image);
    })

    const tag = tags.join();
    const torrent_url = document.querySelector('a.index').href;
    const upload_info = {
      "title": title,
      "subtitle": subtitle,
      "img_list": img_list,
      "tag": tag,
      "torrent_url": torrent_url
    }
    GM_setValue("upload_info", upload_info);
  })

  action_bar.append(' | ');
  action_bar.append(fsm_link);
}

function load_torrent(url) {
  GM.xmlHttpRequest({
    url: url,
    method: "GET",
    responseType: 'blob',
    onload: res => {
      const torrent_file = new window.File([res.response], 'file.torrent', { type: "application/x-bittorrent" });
      const container = new DataTransfer();
      container.items.add(torrent_file);

      let input_file = document.querySelector('input.el-upload__input');
      input_file.files = container.files;
      input_file.dispatchEvent(new Event('change'));
    },
    onerror: res => {
      console.log(res);
      alert("加载种子失败，可能是你点得太快了！");
    }
  })
}

function upload_img(source_url) {
  let referer = source_url.match(/https?:\/\/.+?\//)[0];

  GM.xmlHttpRequest({
    url: source_url,
    method: "GET",
    responseType: 'blob',
    headers: {
      'Referer': referer
    },
    onload: res => {
      const image_file = new window.File([res.response], 'file.jpg');
      const container = new DataTransfer();
      container.items.add(image_file);

      let input_file = document.querySelectorAll('input.el-upload__input')[1];
      input_file.files = container.files;
      input_file.dispatchEvent(new Event('change'));
    }
  })
}

function add_observer(action) {
  const observer = new MutationObserver(action);
  const target = document.querySelector('title');
  const config = { childList: true };
  observer.observe(target, config);
}

function create_link(collect_data) {
  const fsm_link = document.createElement('a');
  fsm_link.innerText = '[转至 FSM]';
  fsm_link.style = "cursor: pointer;";
  fsm_link.onclick = function() {
    collect_data();
    const url_autofill = 'https://fsm.name/Torrents/new?autofill';
    window.open(url_autofill, '_blank').focus();
  }

  GM_setValue("source_url", document.location.href);

  return fsm_link;
}

switch (HOST) {
  case 'happyfappy':
  case 'kufirc':
  case 'pornbay':
  case 'empornium':
    process_luminance();
    break;
  case 'kelu':
  case 'nicept':
  case 'rousi':
  case 'ilolicon':
  case 'bitporn':
  case 'kamept':
  case 'pttime':
    process_nexus();
    break;
  case 'exoticaz': {
    const action_bar = document.querySelector('div.p-2 div.float-right');

    function collect_data () {
      const title = document.querySelector('h1').innerText;
      const img_list = [];
      const tags = [];

      document.querySelectorAll('#TorrentDescription img').forEach(img => {
        img_list.push(img.src);
      })

      document.querySelectorAll('#screenshots img').forEach(img => {
        img_list.push(img.src);
      })

      document.querySelectorAll('div.tags a').forEach(a => {
        tags.push(a.innerText);
      })

      const tag = tags.join();
      const torrent_url = document.querySelector('a.btn-xs').href;
      const upload_info = {
        "title": title,
        "img_list": img_list,
        "tag": tag,
        "torrent_url": torrent_url
      }
      GM_setValue("upload_info", upload_info);
    }

    const fsm_link = create_link(collect_data);
    action_bar.prepend(fsm_link);

    break;
  }
  case 'm-team': {
    function append_link() {
      const fsm_link = create_link(function () {
      const title = document.querySelector('h2 span').innerText;
      let subtitle = '';
      let img_list = [];
      let tags = [];

      document.querySelectorAll('th.ant-descriptions-item-label').forEach(th => {
        switch (th.innerText) {
          case '副標題': {
            subtitle = th.nextSibling.innerText;

            break;
          }
          case 'Tag': {
            th.nextSibling.querySelectorAll('span div div').forEach(tag_node => {
              tags.push(tag_node.innerText);
            })

            break;
          }
          case '基本資訊': {
            const attribute = th.nextSibling.innerText;
            if (attribute.match('無碼')) {
              tags.push('无码');
            } else if (attribute.match('有碼')) {
              tags.push('有码');
            } else if (attribute.match('寫真')) {
              tags.push('写真');
            } else if (attribute.match('遊戲')) {
              tags.push('黄油');
            } else if (attribute.match('漫畫')) {
              tags.push('漫画');
            } else if (attribute.match('動畫')) {
              tags.push('动画');
            }

            break;
          }
        }
      });

       let tag = tags.join();

      document.querySelectorAll('.braft-output-content img').forEach(img => {
        img_list.push(img.src);
      });

      let torrent_id = document.location.href.match(/\d+/)[0];
      const token = GM_getValue("MT_TOKEN");
      if (!token) {
        alert("请先设置MT TOKEN！点击脚本图标选择'设置MT TOKEN'");
        return;
      }
      const form_data = new FormData();
      form_data.append("id", torrent_id)

      GM.xmlHttpRequest({
        url: 'https://api2.m-team.cc/api/torrent/genDlToken',
        method: 'POST',
        responseType: 'json',
        data: form_data,
        headers: {
          "x-api-key": token
        },
        synchronous: false,
        onload: res => {
          console.log(res);
          const torrent_url = res.response.data;

          const upload_info = {
            "title": title,
            "subtitle": subtitle,
            "img_list": img_list,
            "tag": tag,
            "torrent_url": torrent_url
          }
          GM_setValue("upload_info", upload_info);
        }
      })
    })

      let action_bar;

      document.querySelectorAll('span').forEach(node => {
        if (node.innerText == '行為') {
          action_bar = node.parentNode.nextSibling.childNodes[0].childNodes[0];
        }
      })

      action_bar.append(fsm_link);
    }

    add_observer(append_link);

    break;
  }
  case 'fsm': {
    function fill_info(mutations) {
      if (!document.querySelector('title').innerText.match('FSM')) {return;}

      const editor = document.querySelector('div.ql-editor');
      const upload_info = GM_getValue("upload_info");
      const note_node = document.createElement('div');
      note_node.innerText = "请等待下方图片全部上传完成后再点击发布！记得删去不必要的图片，及拖动改变顺序，第一张图片会用作封面";
      editor.parentNode.parentNode.parentNode.prepend(note_node);

      let input_title = document.querySelectorAll('label')[1].control;
      input_title.value = upload_info.title;
      input_title.dispatchEvent(new Event('input'));

      let input_tag = document.querySelectorAll('label')[2].control;
      input_tag.value = upload_info.tag;
      input_tag.dispatchEvent(new Event('input'));

      let input_source = document.querySelectorAll('label')[3].control;
      input_source.value = GM_getValue("source_url");
      input_source.dispatchEvent(new Event('input'));

      if (upload_info.subtitle) {
        let subtitle_node = document.createElement('p');
        subtitle_node.innerText = upload_info.subtitle;
        editor.append(subtitle_node);
      }

      for (let img_url of upload_info.img_list) {
        upload_img(img_url);
      }

      if (upload_info.torrent_url) {
        load_torrent(upload_info.torrent_url);
      }

    }

    add_observer(fill_info);

    break;
  }
}
