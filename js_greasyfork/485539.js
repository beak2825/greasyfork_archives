// ==UserScript==
// @name         TorrentFilter
// @description  Filter and highlight torrents with conditions
// @version      1.0.3
// @author       Anonymous
// @match        *.nexushd.org/*
// @match        uhdbits.org/*
// @match        totheglory.im/*
// @match        kp.m-team.cc/*
// @match        filelist.io/*
// @match        greatposterwall.com/*
// @match        pterclub.com/*
// @match        pt.sjtu.edu.cn/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @icon         http://www.nexushd.org/favicon.ico
// @namespace    d8e7078b-abee-407d-bcb6-096b59eeac17
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485539/TorrentFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/485539/TorrentFilter.meta.js
// ==/UserScript==
const $ = window.jQuery;
////////////////////////////////////////////////////////////////////////////////////////////////
// Settings
// 黑名单，一定会被过滤
const blackList = [
  '', 'CMCT', 'ADE', 'FRDS', 'beAst', 'TLF', 'CHD', 'NYPAD'
].map(team => team.toLowerCase());
// 白名单，一定不被过滤
const whiteList = [
  // BluRay
  '4EVERHD','(C)Z','AE','AJ8','AJP','antsy','Arucard','AURiNKO','AW','Ayaku','BBW','BG','BMF','BoK','BS','Cache',
  'CALiGARi','Chotab','CRiME','Crow','D4','DiGG','DiR','DiRTY','disc','DBO','DoNOLi','E76','ECI','EML-HDTEAM','ESiR',
  'ETH','EucHD','FANDANGO','FaP','fLAMEhd','FPG','FSK','Ft4U','FTO','fty','Funner','Geek','GMoRK','GoLDSToNE','GOS',
  'GrapeHD','GRiND','GrupoHDS','H@M','H2','h264iRMU','HaB','HANDJOB','HDB','HDC','HDBiRD','HDEncX','HDL','HDxT','HiFi',
  'HR','hymen','HZ','iCO','IDE','IMDTHS','incarnation','iNFLiKTED','iNK','iON','iOZO','Ivandro','IY','J4F','JAVLiU',
  'JCH','k2','k4n0','kaBOOM','KalorZ','KiNGS','KiTTeN','KTN','KweeK','LP','LSHD','lulz','M794','MAGiC','MC','MCR','MdM',
  'MMI','Mojo','momosas','Mondo','Moshy','NaRB','NCmt','NFHD','NiP','NiX','NorTV','NoVA','NWO','OAS','OB1','OmertaHD',
  'ONYX','ORiGEN','PeeWee','PerfectionHD','PetaHD','PHiN','PiNG','PRESTiGE','Prime','PXE','QDP','QXE','RANDi','REDJOHN',
  'Redµx','REPTiLE','RightSiZE','RuDE','RZF','S26','SA89','SFH','sJR','SK','Slappy','SLO','SLO4U','SMoKeR','SPeSHaL',
  'SrS','SURFER','TAiCHi','THORA','TjHD','tK','TM','toho','ToK','tRuEHD','TSE','TsH','UioP','V','VanRay','Viet3X','(pr0n)',
  'ViNYL','ViSUM','Vroom','wAm','XSHD','YanY','Z','Zim','D','ZMB','Z-XCV','CRiSC','CtrlHD','DON','EA','EbP','LolHD','NTb',
  'SbR','TayTo','VietHD','de[42]','FoRM','NiBuRu','SaNcTi','Penumbra','Positive','SHeNTo','decibeL','D-Z0N3','FTW-HD',
  'OISTiLe','TDD','ZQ','PTer','WiKi','c0kE','dps','EDPH','HDMaNiAcS','HDVN','HiDt','iFT','JKP','JM','KnG','LorD','playHD',
  'prldm','PuTal','Q0S','RightSIZE','rttr','SaL','Skazhutin','TayTO','TBB','ZoroSenpai','147','Atomic','BARC0DE','BTN',
  'BV','BYRHD','BdC','CHAOS','CNZ','CREATiVE','CRX','CarpeDiem','Dariush','Dave','DiVULGED','DigitalIrony','Envi','EuReKA',
  'EwT','Friday','GALAXY','Japhson','KASHMiR','L9','LiNG','MGs','MKu','MaG','Narkyy','O2STK','ReQuEsT','Tron','VXS',
  'W4NK3R','WMD','WMING','Whales','WiHD','WiLDCAT','XTA','i9','iKA','nmd','nek','npuer','xander','uR','xvistos','SPHD',
  'eXterminator','PuTao', 'RiCO', 'TnP', 'SUPER',
  // Other BluRay
  'E.N.D', 'GALVANiZE', 'NyHD',
  // WEB / HDTV
  'FLUX', 'ADWeb', 'playWEB', 'TEPES', 'MZABI', 'AREY', 'CMRG', 'HDCTV', 'KHN', 'SMURF', 'ARiN'
].map(team => team.toLowerCase());
// 站名
const TTG = 'totheglory'; const PTERCLUB = 'pterclub'; const PUTAO = 'pt.sjtu'; const MTEAM = 'm-team'; const NHD = 'nexushd';
const BluRay = 'bluray'; const WEB = 'web'; const HDTV = 'hdtv';
const res1080p = '1080p'; const res720p = '720p'; const res2160p = '2160p'
const colorRecipeLight = {
  name: '',
  year: 'Blue',
  media: 'Navy',
  resolution: 'Green',
  codec: 'DimGray',
  team: 'Red',
  background: ''
}
const colorRecipeDark = {
  name: '',
  year: 'DeepSkyBlue',
  media: 'DodgerBlue',
  resolution: 'Green',
  codec: 'Gray',
  team: 'Red',
  background: ''
}
const siteInfoMap = {
  [TTG]: {
    // 主页
    hostName: 'totheglory.im',
    pages: [
      'browse.php'
    ],
    searchPage: /(?:&|\?)search_field=/i,
    // 过滤时是否移除条目。如果设置为true，被过滤的entry不会出现在页面中，否则只是不被高亮
    removeFiltered: true,
    // 字段配色
    colors: colorRecipeDark,
    watchType: {
      // 720p, 1080p, 2160p
      resolutions: [res1080p, res2160p],
      // 监测的media类型：BluRay, WEB,
      media: [BluRay, WEB, HDTV],
      // 白名单模式，设置为true时，既不在黑名单也不在白名单中的会被过滤
      teamsWhiteListMode: true
    }
  },
  [PTERCLUB]: {
    hostName: 'pterclub.com',
    pages: [
      'torrents.php',
      'officialgroup.php'
    ],
    searchPage: /(?:&|\?)search=/i,
    removeFiltered: true,
    colors: colorRecipeDark,
    watchType: {
      resolutions: [res720p, res1080p, res2160p],
      media: [BluRay, WEB, HDTV],
      teamsWhiteListMode: true
    }
  },
  [PUTAO]: {
    hostName: 'pt.sjtu.edu.cn',
    pages: [
      'torrents.php'
    ],
    searchPage: /(?:&|\?)search=/i,
    removeFiltered: true,
    colors: colorRecipeLight,
    watchType: {
      resolutions: [res1080p, res2160p],
      media: [BluRay, WEB, HDTV],
      teamsWhiteListMode: true
    }
  },
  [MTEAM]: {
    hostName: 'm-team.cc',
    pages: [
      'browse',
      'browse/movie'
    ],
    searchPage: /(?:&|\?)keyword=/i,
    waitForElement: 'div[class="flex flex-nowrap"]',
    removeFiltered: true,
    colors: colorRecipeDark,
    watchType: {
      resolutions: [res1080p, res2160p],
      media: [BluRay, WEB, HDTV],
      teamsWhiteListMode: true
    }
  },
  [NHD]: {
    hostName: 'nexushd.org',
    pages: [
      'torrents.php'
    ],
    searchPage: /(?:&|\?)search=/i,
    removeFiltered: false,
    colors: colorRecipeLight,
    watchType: {
      resolutions: [res720p, res1080p, res2160p],
      media: [BluRay, WEB, HDTV],
      teamsWhiteListMode: true
    }
  }
}
const retryInterval = 500
////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function decodeTorrentTags(torrent_name) {
  let start = ''
  let end = ''
  // 移除末尾无效内容（方便识别压制组）
  let matchEnd = torrent_name.match(/\.(mkv|mp4|avi|ts|wmv|mpg)$/, 'i')
  if (matchEnd) {
    end = matchEnd[0]
    torrent_name = torrent_name.substring(0, torrent_name.length - end.length)
  }
  // 移除开头无效内容并记录移除部分的长度（用于最终恢复真实字符索引）
  let matchStart = torrent_name.match(/^(「.*」|\[.*\]) */)
  if (matchStart) {
    start = matchStart[0]
    torrent_name = torrent_name.substring(start.length)
  }
  let tags = {
    name: [-1, 0],
    year: [-1, 0],
    media: [-1, 0],
    resolution: [-1, 0],
    codec: [-1, 0],
    team: [-1, 0]
  };
  let match_media = torrent_name.match(/\b(((UHD )?Blu-?Ray)|UHD|(BD|(HD)?DVD|WEB|HDTV)Rip|(HD)?DVD|HDTV|WEB(-?DL)?)\b/i);
  if (match_media) {
    tags.media = [match_media.index, match_media[0].length];
  }
  let match_team = torrent_name.match(/\b(D-Z0N3|[^\s-@]*(@[^\s-]+)?)$/);
  if (match_team) {
    tags.team = [match_team.index, match_team[0].length];
  }
  let match_codec = torrent_name.match(/\b(x26\d|h26\d|h\.?26\d|avc|hevc|xvid|divx|mpeg-\d|vc-1)\b/i);
  if (match_codec) {
    tags.codec = [match_codec.index, match_codec[0].length];
  }
  let match_resolution = torrent_name.match(/\b((480|720|1080|2160)[ip]|4k(?! ?remaster| ?restoration| ?restore))\b/i);
  if (match_resolution) {
    tags.resolution = [match_resolution.index, match_resolution[0].length];
  }
  // 注意符合年份regex的可能有多个，因为电影标题中可能有年份，所以要选择最后一个
  let match_year = torrent_name.match(/\b\d{4}\b/g);
  if (match_year) {
    let year = match_year[match_year.length - 1];
    tags.year = [torrent_name.lastIndexOf(year), year.length];
  }
  let name_length = torrent_name.length;
  for (var tag in tags) {
    if (tags[tag][0] < name_length && tags[tag][0] > 0) {
      name_length = tags[tag][0];
    }
  }
  tags.name = [0, name_length - 1];
  // 所有index加上头部长度
  for (const key in tags) {
    tags[key] = [tags[key][0] + start.length, tags[key][1]]
  }
  return tags
}
function whetherRemove(tags, title, siteName) {
  let site = siteInfoMap[siteName] || {}
  if (!site.watchType) {
    return false
  }
  let mediaToWatch = site.watchType.media
  let resolutionsToWatch = site.watchType.resolutions
  let teamsWhiteListMode = site.watchType.teamsWhiteListMode
  let team = '';
  if (tags.team[0] >= 0) {
    team = title.substring(tags.team[0], tags.team[0] + tags.team[1]).toLowerCase();
  }
  let resolution = '';
  if (tags.resolution[0] >= 0) {
    resolution = title.substring(tags.resolution[0], tags.resolution[0] + tags.resolution[1]).toLowerCase();
  }
  let media = '';
  if (tags.media[0] >= 0) {
    media = title.substring(tags.media[0], tags.media[0] + tags.media[1]).toLowerCase();
  }
  // 压制组过滤
  var remove = whiteList.includes(team)
    ? false
    : blackList.includes(team)
      ? true
      : teamsWhiteListMode;
  // 分辨率过滤
  if (!remove && resolutionsToWatch) {
    let res_ok = false;
    if (resolutionsToWatch.includes(resolution)) {
      res_ok = true;
    } else if (resolution.match(/4k/i) && resolutionsToWatch.includes('2160p')) {
      res_ok = true;
    }
    remove = !res_ok;
  }
  // 媒介过滤
  if (!remove && mediaToWatch) {
    let media_ok = false;
    if (mediaToWatch.includes(media)) {
      media_ok = true;
    } else if (media.match(/(UHD BluRay)|BluRay|UHD|Blu-ray|BDRip/i) && mediaToWatch.includes('bluray')) {
      media_ok = true;
    } else if (media.match(/WEB-DL|WEBRip|WEB/i) && mediaToWatch.includes('web')) {
      media_ok = true;
    } else if (media.match(/DVDRip|HDDVD|DVD/i) && mediaToWatch.includes('dvd')) {
      media_ok = true;
    }
    remove = !media_ok;
  }
  if (remove) {
    console.log(`remove ${title}`);
  } else {
    console.log(`keep ${title}`);
  }
  return remove;
}
// tags are the slices of the title stored in a dictionary, {'media': [4, 1], 'team': [8, 1]}
// renderFieldFunction renders a field, <color=red>text</color>
// renderTitleFunction renders a title
function renderTitle(originalText, tags, renderFieldFunction, renderTitleFunction, siteName) {
  let site = siteInfoMap[siteName] || {}
  let newText = '';
  let colors = site.colors || {}
  // sort the tags by starting index of the tag
  let sorted_keys = Object.keys(tags).map(k => ([k, tags[k][0]])).sort((a, b) => (a[1] - b[1]));
  let j = 0;
  for (let i = 0; i < sorted_keys.length; i++) {
    let key = sorted_keys[i][0];
    let idx_field = tags[key][0];
    let len_field = tags[key][1];
    let color_field = colors[key];
    if (len_field > 0) {
      let text_field = originalText.substring(idx_field, idx_field + len_field);
      if (j < idx_field) {
        newText += originalText.substring(j, idx_field);
      }
      if (color_field) {
        newText += renderFieldFunction(text_field, color_field);
      } else {
        newText += text_field;
      }
      j = idx_field + len_field;
    }
  }
  // possible extension
  if (j < originalText.length) {
    newText += originalText.substring(j);
  }
  let renderedTitle = renderTitleFunction(newText);
  return renderedTitle;
}
function runWhenReady(readySelector, callback) {
  var tryNow = function() {
    var elem = document.querySelector(readySelector)
    if (elem) {
      callback(elem)
    } else {
      console.log(`Page not ready yet, retrying in ${retryInterval/1000} seconds`)
      setTimeout(tryNow, retryInterval)
    }
  }
  tryNow()
}
function update(siteName, isSearchPage) {
  if (!siteName) {
    return
  }
  const site = siteInfoMap[siteName]
  if (siteName === PTERCLUB || siteName === PUTAO || siteName === NHD) {
    let tbody = $('tbody').closest('table.torrents');
    tbody.map(function() {
      let titles = $('a')
        .closest('table.torrentname')
        .find('a');
      $.each(titles, function(_, obj) {
        if ($(obj).attr("title")) {
          let title = $(obj).attr("title").trim();
          let tags = decodeTorrentTags(title);
          let remove = whetherRemove(tags, title, siteName);
          if (remove) {
            if (site.removeFiltered && !isSearchPage) {
              let row = obj.closest('table.torrentname').closest('tr');
              row.remove();
            }
          } else {
            let newText = renderTitle(title, tags,
              (text, color) => {
                return `<span style="color: ${color};">${text}</span>`;
              },
              nt => {
                return nt;
              },
              siteName
            );
            $(obj).find('b').html(newText);
            if (site.colors && site.colors.background) {
              $(obj).find('b').css('background-color', site.colors.background);
            }
          }
        }
      });
    });
  } else if (siteName === TTG) {
    let tbody = $('tbody').closest('#torrent_table');
    tbody.map(function() {
      let titles = $('a[class!="treport"]')
        .closest('div.name_left')
        .closest('tr.hover_hr')
        .find('a[class!="treport"][href^="/t/"] b');
      $.each(titles, function(_, obj) {
        if ($(obj).prop('innerHTML')) {
          let title = $(obj).prop('innerText').split(/\r?\n/)[0].trim();
          let tags = decodeTorrentTags(title);
          let remove = whetherRemove(tags, title, siteName);
          if (remove) {
            if (site.removeFiltered && !isSearchPage) {
              let row = obj.closest('tr.hover_hr');
              row.remove();
            }
          } else {
            let originalText = $(obj).prop('outerHTML');
            let newText = renderTitle(title, tags,
              (text, color) => {
                return `<span style="color: ${color};">${text}</span>`;
              },
              nt => {
                let regex = RegExp('(<b>.*)(' + escapeRegExp(title) + ')(.*<br>)', '');
                return originalText.replace(regex, '$1' + nt + '$3');
              },
              siteName
            );
            $(obj).html(newText);
            if (site.colors && site.colors.background) {
              $(obj).css('background-color', site.colors.background);
            }
          }
        }
      });
    })
  } else if (siteName === MTEAM) {
    let tbody = $('tbody').closest('#root').find('tbody')
    tbody.map(function() {
      let titles = $('strong')
        .closest('div[class="flex flex-nowrap"]')
        .find('strong')
      $.each(titles, function(_, obj) {
        if ($(obj).prop('textContent')) {
          let title = $(obj).prop('textContent').trim();
          let tags = decodeTorrentTags(title);
          let remove = whetherRemove(tags, title, siteName);
          if (remove) {
            if (site.removeFiltered && !isSearchPage) {
              let row = obj.closest('tr')
              row.remove()
            }
          } else {
            let newText = renderTitle(title, tags,
              (text, color) => {
                return `<span style="color: ${color};">${text}</span>`;
              },
              nt => {
                return nt
              },
              siteName
            );
            $(obj).html(`<strong>${newText}</strong>`);
            if (site.colors && site.colors.background) {
              $(obj).find('strong').css('background-color', site.colors.background);
            }
          }
        }
      });
    });
  }
}
(() => {
  'use strict';
  const siteName = Object.keys(siteInfoMap).find(sn => {
    let st = siteInfoMap[sn]
    return window.location.href.match(escapeRegExp(st.hostName))
  })
  let page = ''
  let site = {}
  if (siteName) {
    site = siteInfoMap[siteName]
    page = site.pages.find(pg => {
      let url = `${site.hostName}/${pg}`
      return window.location.href.match(escapeRegExp(url))
    })
  }
  if (!siteName || !page) {
    return
  }
  const isSearchPage = !!window.location.href.match(site.searchPage)
  console.log(`running in site ${siteName} and page ${page}.`)
  if (isSearchPage) {
    console.log(`running in search page`)
  }
  if (site.waitForElement) {
    // eslint-disable-next-line no-unused-vars
    runWhenReady(site.waitForElement, _ => {
      update(siteName, isSearchPage)
    })
  } else {
    update(siteName, isSearchPage)
  }
})();