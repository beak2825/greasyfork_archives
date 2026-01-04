// ==UserScript==
// @name         Red Leaves Game Repost Assistant
// @namespace    https://leaves.red
// @version      0.2.6
// @icon         https://leaves.red/favicon.ico
// @description  Red Leaves Games Section Helper
// @author       cosmogao, rey5
// @match        https://*.leaves.red/upload.php*
// @match        https://*.leaves.red/edit.php*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470595/Red%20Leaves%20Game%20Repost%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/470595/Red%20Leaves%20Game%20Repost%20Assistant.meta.js
// ==/UserScript==

var sceInstance=sceditor.instance(document.getElementById('descr'));

function html2bb(str) {
    str = sceInstance.toBBCode(str)
    return str
}



function parseFitgirRepack($document){
    console.log($document)
    var info1 = $document.querySelector("div[class='entry-content']").querySelector("p:nth-child(2)");
    var info2_headerlist = $document.querySelector("div[class='entry-content']").querySelectorAll("h3");

    if (!info1) {
      console.log("Not found: div[class='entry-content']");
      return
    }
    if (!info2_headerlist) {
      console.log("Not found: div[class='entry-content'] > h3[3]");
      return
    }
    var info1_bb = html2bb(info1.innerHTML)
    var foundFeature = Array.from(info2_headerlist).find(gg => (gg.textContent.indexOf('Feature')>0));
    // console.log(foundFeature)

    var info2_header_bb = html2bb(foundFeature.innerHTML); // "Repack Feature"
    var info2_list = foundFeature.nextSibling;
    while(info2_list && info2_list.nodeType != 1) {
      info2_list = info2_list.nextSibling;
    }
    if (!info2_list) {
      console.log("Not found: ul");
      return
    }
    var info2_list_bb = html2bb(info2_list.innerHTML);
    //   console.log(info2_list_bb)

    var dlc_bb = '';
    var dlc_header = Array.from($document.querySelectorAll("p")).find(gg => (gg.textContent.indexOf("Included DLCs") != -1));
    if (dlc_header) {
        var dlc_list = dlc_header.nextSibling;
        while(dlc_list && dlc_list.nodeType != 1) {
            dlc_list = dlc_list.nextSibling;
        }
        if (dlc_list) {
            dlc_bb = html2bb(dlc_list.innerHTML);
        } else {
            console.log('found dlc anchor, not found dlc list, please check.');
        }
    }

    // Assembly torrent info
    var output = '' + info1_bb + '\n\n\n[b]' + info2_header_bb + '[/b]\n' +  info2_list_bb + '\n'

    if (dlc_bb != '') {
        output = output + '\n[b]Included DLCs:[/b]\n' + dlc_bb + '\n'
    }

    return output;
}



function getFitgirlTitle(doc) {
    var title = '';
    var h3_list = doc.querySelector("div[class='entry-content']").querySelector('h3');
    if (!h3_list) {
        console.log("Not found: h3_list");
        return title
    }
    console.log(h3_list)
    title_list = h3_list.innerHTML.replace(/<\/?span[^>]*>/g, '|').replace(/<\/?strong>/g, "|").split("|")
    title_list = title_list.filter(x=>x && x.trim())

    title = title_list.slice(1,3).join(" ")
    console.log(title);

    return title;
}


function get1337xUrl(doc) {
	var url = Array.prototype.slice.call(doc.querySelectorAll('a')).map(a=>a.href).filter(a=>a.includes('1337x.to'))
	return url[0].replace("1337x.to", "rlgame.v4fun.eu.org")
}


function parse1337Language(doc) {
  // console.log(doc);
  if (!doc) {
      return;
  }
  var html1 = doc.querySelector("div[class='torrent-tabs']");
  if (!html1) {
      return;
  }

  html1 = html1.textContent;
  // console.log(html1);

  var lang = html1.match(/(Interface Language[\s\S]*?)Crack/im);
  if (!lang || lang.length != 2) {
      console.log(lang);
      return;
  }

  lang = lang[1].trim()
              .replace(/\s+/g, ' ')
              .replace(/Audio Language/g, '\nAudio Language')
              .replace(/, /g, '、')
              .replace(/Interface Language/g, '[b]界面语言[/b]')
              .replace(/Audio Language/g, '[b]音频语言[/b]')
              .replace(/Simplified Chinese/g, '简体中文')
              .replace(/Traditional Chinese/g, '繁体中文')
              .replace(/Chinese/g, '中文')
              .replace(/English/g, '英语')
              .replace(/Russian/g, '俄语')
              .replace(/German/g, '德语')
              .replace(/French/g, '法语')
              .replace(/Korean/g, '韩语')
              .replace(/Japanese/g, '日语')
              .replace(/Italian/g, '意大利语')
              .replace(/Turkish/g, '土耳其语')
              .replace(/Spanish - Latin America/g, '西班牙语-拉丁美洲')
              .replace(/Spanish - Spain/g, '西班牙语-西班牙')
              .replace(/Portuguese - Brazil/g, '葡萄牙语-巴西')
              .replace(/Portuguese/g, '葡萄牙语')
              .replace(/Thai/g, '泰语')
              .replace(/Arabic/g, '阿拉伯语')
              .replace(/Danish/g, '丹麦语')
              .replace(/Dutch/g, '荷兰语')
              .replace(/Finnish/g, '芬兰语')
              .replace(/Norwegian/g, '挪威语')
              .replace(/Polish/g, '波兰语')
              .replace(/Swedish/g, '瑞典语')
              .replace(/Catalon/g, '加泰罗尼亚语')
              .replace(/Greek/g, '希腊语')
              .replace(/Czech/g, '捷克语')
              .replace(/Estonian/g, '爱沙尼亚语')
              .replace(/Hungarian/g, '匈牙利语')
              .replace(/Spanish/g, '西班牙语')
              .replace(/Indonesian/g, '印度尼西亚语')
              ;

  console.log('1337x: ' + lang);

  return lang;
}



function requestFitGirlUrl(urlFitgirl) {
  var name;
  var bbstr;

  GM.xmlHttpRequest({
    method: "GET",
    url: urlFitgirl,
    responseType: "document",
    onload: function(resp) {
      var parser = new DOMParser ();
      var ajaxDoc = parser.parseFromString(resp.responseText, "text/html");

      // 获取种子标题，生成固定副标题
      name = getFitgirlTitle(ajaxDoc)
      document.querySelector('input[name=name]').value=name + ' - FitGirl'
      document.querySelector('input[name=small_descr]').value='中文名称 | 英文名称 发布年份 | 多国语言 | 安装包 | FitGirl'

      // 自动填写相应选项卡
      document.querySelector('select[name="source_sel[7]"]').value=12
      document.querySelector('select[name="team_sel[7]"]').value=13
      //document.querySelector('select[name="standard_sel[7]"').value=12
      document.querySelector('select[name="medium_sel[7]"').value=11

      // 获取种子简介
      bbstr = parseFitgirRepack(ajaxDoc)
      console.log(bbstr)

      // 获取语言信息
      var url1337x = get1337xUrl(ajaxDoc);
      if (url1337x && url1337x != '') {
        console.log('访问: ' + url1337x + ' 获取语言');
        GM.xmlHttpRequest({
          method: 'GET',
          url: url1337x,
          onload(resp) {
            var ajaxDoc = new DOMParser ().parseFromString(resp.responseText, "text/html");
            var bb_lang = parse1337Language(ajaxDoc);
            console.log(bb_lang)

            var interface_lang = bb_lang.split('\n')[0].split(':')[1].trim().split('、')
            var lang_desp = "其他语言"
            var lang_code = "11"
            if (interface_lang.length > 1) {
              lang_code = "12"
              lang_desp = "多国语言"
            }
            if (interface_lang.length <=1 && interface_lang.includes('英语')) {
              lang_code = "9"
              lang_desp = "英文"
            }
            if (interface_lang.length <=1 && interface_lang.includes('简体中文')) {
              lang_code = "7"
              lang_desp = "简体中文"
            }
            if (interface_lang.length <=1 && interface_lang.includes('繁体中文')) {
              lang_code = "8"
              lang_desp = "繁体中文"
            }
            if (interface_lang.length <=1 && interface_lang.includes('日语')) {
              lang_code = "10"
              lang_desp = "日语"
            }
			
			// 自动生成副标题
			var RL_GAME_id = document.querySelector('input[name="custom_fields[7][4]"]').value
            var eng_name = '英文名称'
            var chs_name = '中文名称'
            var rls_year = '发布年份'
            if (RL_GAME_id != '') {
              GM.xmlHttpRequest({
                method: "GET",
                url: 'https://leaves.red/gamedb.php?action=showgame&id='+ RL_GAME_id,
                responseTypd: "document",
                onload: function(resp) {
                  var parser = new DOMParser();
                  var ajaxDoc = parser.parseFromString(resp.responseText, "text/html");

                  var game_info = ajaxDoc.querySelectorAll('td.embedded')[1]
                  eng_name = game_info.querySelector('h1').textContent
                  chs_name = game_info.querySelector('h2').textContent
                  rls_year = game_info.querySelectorAll('td.rowfollow')[6].textContent.split('-')[0]
                  console.log(eng_name)
                  document.querySelector('input[name=small_descr]').value=chs_name+' | '+eng_name+' '+ rls_year+' | '+ lang_desp +' | 安装包 | FitGirl'

                }
              })
            }

            // 重新判断语言
            document.querySelector('select[name="standard_sel[7]"').value=lang_code

            // 判断中字标签
            if (interface_lang.some(elem => elem.includes('中文'))) {
              document.querySelector('input[type="checkbox"][name="tags[7][]"][value="6"]').checked=1
            }
            // 判断国语标签
            var audio_lang = bb_lang.split('\n')[1].split(':')[1].split('、')
            if (audio_lang.some(elem => elem.includes('中文'))) {
              document.querySelector('input[type="checkbox"][name="tags[7][]"][value="5"]').checked=1
            }

            // 默认匿名发布
            document.querySelector('input[type="checkbox"][name="uplver"][value="yes"]').checked=1

            var bb_head = '[b]安装步骤[/b]\n[li]运行 "Verify BIN files before installation.bat" 进行MD5验证（可选）[/li]\n[li]运行 "setup.exe"安装游戏[/li]\n[li]开始游玩[/li]\n[li]游戏经过高压，需要一定时间才能解压完毕，请耐心等待[/li]\n'
            bbstr = '[quote]' + bb_head + '\n' + bb_lang + '[/quote]\n[hr]\n' + bbstr
            //document.querySelector('textarea[name=technical_info]').value=bbstr
            sceInstance.val(bbstr)
          },
          onerror: function(resp) {
            console.log(resp);
            console.log('语言获取失败！');
          }
        });
      } else {
        console.log('未获取到1337x链接...');
      }



    }
  })
}

function requestPterUrl(urlPTerClub) {
  var url = new URL(urlPTerClub);
  var game_id = url.searchParams.get("id");

  GM.xmlHttpRequest({
    method: "GET",
    url: urlPTerClub,
    responseTypd: "document",
    onload: function(resp) {
      var parser = new DOMParser();
      var ajaxDoc = parser.parseFromString(resp.responseText, "text/html");
      //
      var eng_title = ajaxDoc.querySelector('h1').textContent;
      var chs_title = ajaxDoc.querySelector('h1').nextSibling.textContent;

      console.log(eng_title);
      console.log(chs_title);

      var link = ajaxDoc.querySelector('a.faqlink[href*="'+game_id+'"]');
      var desc = link.parentNode.querySelector('#kdescr');
      var torrent = desc.parentNode;
      if (torrent.previousSibling.nodeType != 1) {
        torrent = torrent.parentNode;
      }
      var after_title = torrent.previousSibling.querySelector('a[title*="点击"').querySelector('.nowrap').textContent.split('[')[0].trim();
      var group = after_title.split('-').at(-1);

      var lang = '多国语言'
      var gy = torrent.previousSibling.querySelector('.chs_tag2.chs_tag2-gy')
      var sub = torrent.previousSibling.querySelector('.chs_tag2.chs_tag2-sub')


      var title = eng_title.split(' ').slice(0,-1).join(' ') + ' ' + after_title;
      var subtitle = chs_title + ' | ' + eng_title + ' | ' + lang + ' | 安装包 | ' + group
      console.log(desc)

      // 填写对应输入框
      // 标题
      document.querySelector('input[name=name]').value=title

      // 副标题
      document.querySelector('input[name=small_descr]').value=subtitle

      // 本站词条获取封面图
      var img_bb = ''
      var RL_GAME_id = document.querySelector('input[name="custom_fields[7][4]"]').value
      if (RL_GAME_id != '') {
        GM.xmlHttpRequest({
          method: "GET",
          url: 'https://leaves.red/gamedb.php?action=showgame&id='+ RL_GAME_id,
          responseTypd: "document",
          onload: function(resp) {
            var parser = new DOMParser();
            var ajaxDoc = parser.parseFromString(resp.responseText, "text/html");

            var img_link = ajaxDoc.querySelectorAll('td.embedded')[1].querySelector('img').src
            img_bb = '[img]' + img_link + '[/img][hr]'
            console.log(img_bb)
            bb_code = img_bb+sceInstance.toBBCode(desc.innerHTML)
            sceInstance.val(bb_code);
          }
        })
      } else {
        bb_code = sceInstance.toBBCode(desc.innerHTML)
        sceInstance.val(bb_code);
      }

      document.querySelector('select[name="source_sel[7]"]').value=12
      var team
      switch(group){
        case 'GOG': team = '14'
          break
        case 'FitGirl': team = '13'
          break
        case 'Humble Bundle': team = '15'
          break
        case '3DM': team = '16'
          break
        case 'ALI213': team = '17'
          break
        case 'TENOKE': team = '20'
          break
        case 'SKIDROW': team = '21'
          break
        default: team = '0'
      }
      document.querySelector('select[name="team_sel[7]"]').value=team
      document.querySelector('select[name="standard_sel[7]"').value=12
      document.querySelector('select[name="medium_sel[7]"').value=11
      if (gy) {
        document.querySelector('input[type="checkbox"][name="tags[7][]"][value="5"]').checked=1
      }
      if (sub) {
        document.querySelector('input[type="checkbox"][name="tags[7][]"][value="6"]').checked=1
      }
      document.querySelector('input[type="checkbox"][name="uplver"][value="yes"]').checked=1
    }
  })

}



(function() {

    // 创建表格
    let newRow = document.createElement("tr");

    let titleCell = newRow.insertCell()
    titleCell.innerHTML = "<b>源链接(FG|猫)</b>";
    titleCell.align = 'right';

    let inputCell = newRow.insertCell();
    let input = document.createElement("input");
    input.style.width = '500px';
    input.type = "text";
    input.placeholder = "请输入链接";
    inputCell.appendChild(input);

    // 创建按钮
    let button = document.createElement("button");
    button.textContent = "获取信息";

    // 添加点击事件
    button.addEventListener("click", function(e) {
      e.preventDefault();
      let url = input.value;
      if (url.includes('fitgirl')) {
        requestFitGirlUrl(url);
      } else if (url.includes('pterclub')) {
        requestPterUrl(url);
      } else {
        console.log('不是有效的链接！')
      }

    });
    inputCell.appendChild(button)

    // 将输入框和按钮插入页面
    let row = document.querySelector('input[name="name"]').parentNode.parentNode.parentNode.parentNode
    row.parentNode.insertBefore(newRow, row);
})();