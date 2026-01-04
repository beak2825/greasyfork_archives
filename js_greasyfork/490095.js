// ==UserScript==
// @name         qingwa-torrent-assistant
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  QingWaPT-审种助手
// @author       QingWaPT-Official
// @thanks       SpringSunday-Torrent-Assistant, Agsv-Torrent-Assistant
// @match        *://www.qingwapt.com/details.php*
// @match        *://new.qingwa.pro/details.php*
// @match        *://www.qingwapt.org/details.php*
// @icon         https://qingwapt.com/logo/green.svg
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490095/qingwa-torrent-assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/490095/qingwa-torrent-assistant.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var isWaitImgLoad = true;

  // 自定义参数
  var review_info_position = 3; // 错误提示信息位置：1:页面最上方，2:主标题正下方，3:主标题正上方
  var timeout = 200; // 弹出页内鼠标点击间隔，单位毫秒，设置越小点击越快，但是对网络要求更高
  var biggerbuttonsize = '40pt'; // 放大的按钮大小
  var autoback = 0; // 一键通过后返回上一页面

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  if (isMobile) {
    biggerbuttonsize = '120pt';
    autoback = 1;
  }

  var cat_constant = {
    401: '电影',
    402: '剧集',
    403: '综艺',
    404: '纪录片',
    405: '动漫',
    406: 'MV',
    407: '体育',
    408: '音乐',
    412: '短剧',
    409: '其他',
  };

  var type_constant = {
    1: 'UHD Blu-ray',
    8: 'Blu-ray',
    9: 'Remux',
    10: 'Encode',
    7: 'WEB-DL',
    4: 'HDTV',
    11: 'MiniBD',
    2: 'DVD',
    3: 'CD',
    5: 'Track',
    6: 'Other',
  };

  var encode_constant = {
    1: 'H.264/AVC',
    6: 'H.265/HEVC',
    2: 'VC-1',
    4: 'MPEG-2',
    7: 'AV1',
    3: 'MPEG-4',
    8: 'VP9',
    5: 'Other',
  };

  var audio_constant = {
    9: 'DTS:X',
    14: 'DTS',
    10: 'DTS-HD MA',
    3: 'DTS-HD HRA',
    11: 'TrueHD Atmos',
    12: 'TrueHD',
    13: 'LPCM',
    15: 'DD/AC3',
    16: 'DDP/E-AC3',
    1: 'FLAC',
    17: 'AAC',
    18: 'APE',
    19: 'WAV',
    4: 'MP3',
    8: 'M4A',
    20: 'OPUS',
    7: 'Other',
    22: 'AV3A',
    23: 'USAC',
  };

  var resolution_constant = {
    6: '8K',
    7: '4K',
    1: '1080p',
    2: '1080i',
    3: '720p',
    4: 'SD',
    5: 'Other',
  };

  var group_constant = {
    6: 'FROG',
    7: 'FROGE',
    8: 'FROGWeb',
    9: 'GodDramas ',
    5: 'Other',
  };

  const brief = $('#kdescr').text().toLowerCase(); // 获取元素的文本内容
  const Brief = $('#kdescr').text();
  const containsIMDbLink = brief.includes('imdb.com'); // 检查内容是否包含 imdb.com 链接
  const containsDoubanLink = brief.includes('douban.com'); // 检查内容是否包含 douban.com 链接
  const containsTMDBLink = brief.includes('themoviedb.org'); // 检查内容是否包含 themoviedb.org 链接
  const containsBGMLink = brief.includes('bgm.tv');

  var dbUrl; // 是否包含影片链接
  if (containsIMDbLink || containsDoubanLink || containsTMDBLink || containsBGMLink) {
    dbUrl = true;
  } else {
    dbUrl = false;
  }

  var find_season_episod = function (text) {
    if (title.match(/\bS\d\d/)) {
      if (title.match(/\bS\d+\s?E\d+/)) return 0;
      if (title.match(/\bS\d+-/)) return 2; //multi seasons case
      return 1;
    }
    return -1;
  };

  var find_info = function (text) {
    if (text.includes('Complete name') && text.includes('Movie name') && text.includes('Video'))
      return 0;

    if (text.includes('Complete name') && text.includes('General') && text.includes('Video'))
      return 0;

    if (text.includes('File name') && text.includes('General') && text.includes('Video')) {
      //旧版本mediainfo
      return 0;
    }
    if (text.includes('DISC INFO') || text.includes('Disc Title:') || text.includes('Disc Label:'))
      return 1;

    return -1;
  };

  var isBriefContainsInfo = false; //是否包含Mediainfo
  if (Brief.includes('Complete name') && Brief.includes('Movie name') && Brief.includes('Video')) {
    isBriefContainsInfo = true;
  }

  if (Brief.includes('Complete name') && Brief.includes('General') && Brief.includes('Video')) {
    isBriefContainsInfo = true;
  }

  if (Brief.includes('File name') && Brief.includes('General') && Brief.includes('Video')) {
    //旧版本mediainfo
    isBriefContainsInfo = true;
  }

  if (
    Brief.includes('DISC INFO') ||
    Brief.includes('Disc Title:') ||
    Brief.includes('Disc Label:')
  ) {
    isBriefContainsInfo = true;
  }

  var isBriefContainsForbidReseed = false; //是否包含禁止转载
  if (brief.includes('禁止转载')) {
    isBriefContainsForbidReseed = true;
  }

  var title = $('#top').text();
  title = title
    .replace(
      /禁转|\((已审|冻结|待定)\)|\[(免费|50%|2X免费|30%|2X 50%)\]|\(限时\d+.*\)|\[2X\]|\[(推荐|热门|经典|已审)\]/g,
      ''
    )
    .trim();
  title = title.replace(/剩余时间.*/g, '').trim();
  title = title.replace('(禁止)', '').trim();
  var title_lowercase = title.toLowerCase();

  var officialSeed = 0; //官组种子
  var godDramaSeed = 0; //驻站短剧组种子
  var officialMusicSeed = 0; //官组音乐种子
  var isVCBStudio = false; //VCB-Studio
  if (
    title_lowercase.includes('frog') ||
    title_lowercase.includes('froge') ||
    title_lowercase.includes('frogweb') ||
    title.includes('Loong@QingWa')
  ) {
    officialSeed = 1;
  }
  // 预留，不影响判断
  if (title_lowercase.includes('frogmus')) {
    officialMusicSeed = 1;
  }
  // 预留，不影响判断
  if (title_lowercase.includes('goddramas')) {
    godDramaSeed = 1;
  }
  if (title_lowercase.includes('vcb-studio')) {
    isVCBStudio = 1;
  }

  var title_type,
    title_encode,
    title_audio,
    title_resolution,
    title_group,
    title_is_complete,
    title_is_episode,
    title_x265,
    title_x264;
  var title_DVD720 = false;

  let title_wrongBD = title.match(/Blu[Rr]ay|Blu-Ray|BDMV|BLURAY/);
  let title_wrongBDrip = title.match(/BD[Rr]ip|Blu-?ray|Blu-Ray|BLURAY/);
  let title_HEVC = title.includes(' HEVC');
  let title_AVC = title.includes(' AVC');
  let title_10bit = title.includes('10bit');

  let title_resolution_pos = title.search(/\b((4320|2160|1080|720|576|480)[pi])/i);
  let title_source_pos = title.search(
    /BLU-?RAY|MiniBD|Blu-?[Rr]ay|WEB[- ]?DL|Remux|REMUX|(BD|DVD|WEB)[Rr]ip|BDMV|\bBD\b|\bDVD[5|9]?\b|\bU?HDTV/
  );
  let title_HDR_pos = title.search(/\b(DV|DoVi|HDR|HLG|HDR10+)\b/i);
  let title_video_pos = title.search(/\b(AVS3|HEVC|AVC|AV1|VP9|VC-1|MPEG-?[24]|(H\.?|x)26[45])/);
  let title_audio_pos = title
    .replace('WAVVE', 'WAAAE')
    .search(/\b(AAC|(E-?)?AC3|\bDD|TrueHD|DTS|FLAC|USAC|LPCM|OPUS|MPEG|WAV|MP[123]|M4A|APE|AV3A)/);
  let title_area_pos = title.search(/\b(CAN|ITA|USA|JPN|HKG|TWN|EUR|GRE|FRA|GBR|AUS|IND|NOR)/);

  let title_ES = find_season_episod(title);
  let title_encode_system = title.match(/\b(NTSC|PAL)/);

  let title_audio_complete = title.match(
    /\b(DD[P\+]?|FLAC|LPCM|AC3|AV3A|OPUS|TrueHD|DTS([: -]?X|-?HD ?(M|HR)A)?) ?(\d[ \.]?\d)?/
  );
  let title_AC3 = title.includes(' AC3');
  let title_HQ = title.includes(' HQ');
  let title_FPS = title.match(/\s\d{2,3}FPS\s/i);
  let title_EDR = title.includes(' EDR');
  let title_4K = title.includes(' 4K');
  let title_SDR = title.includes(' SDR');

  // 媒介
  if (title_lowercase.includes('web-dl') || title_lowercase.includes('webdl')) {
    title_type = 7;
  } else if (title_lowercase.includes('remux')) {
    title_type = 9;
  } else if (title_lowercase.includes('hdtv')) {
    title_type = 4;
  } else if (title_lowercase.includes('minibd')) {
    title_type = 11;
  } else if (
    (title_lowercase.includes('blu-ray') || title_lowercase.includes('bluray')) &&
    !(
      title.includes(' HEVC') ||
      title.includes(' AVC') ||
      title.includes(' VC-1') ||
      title.match(/\bMPEG-?[24]/)
    )
  ) {
    title_type = 10;
  } else if (
    title_lowercase.includes('webrip') ||
    title_lowercase.includes('dvdrip') ||
    title_lowercase.includes('bdrip') ||
    title_lowercase.includes('x265') ||
    title_lowercase.includes('x264')
  ) {
    title_type = 10;
  } else if (title_lowercase.includes('uhd blu-ray') || title_lowercase.includes('uhd bluray')) {
    title_type = 1;
  } else if (title_lowercase.includes('blu-ray') || title_lowercase.includes('bluray')) {
    title_type = 8;
  } else if (title.includes(' DVD')) {
    title_type = 2;
  } else if (title_lowercase.includes('cd')) {
    title_type = 3;
  } else if (title_lowercase.includes('track')) {
    title_type = 5;
  }
  // 视频编码
  if (title_lowercase.includes('264') || title_lowercase.includes('avc')) {
    title_encode = 1;
  } else if (title_lowercase.includes('265') || title_lowercase.includes('hevc')) {
    title_encode = 6;
  } else if (title_lowercase.includes('vc') || title_lowercase.includes('vc-1')) {
    title_encode = 2;
  } else if (title_lowercase.includes('mpeg2') || title_lowercase.includes('mpeg-2')) {
    title_encode = 4;
  } else if (title_lowercase.includes('av1') || title_lowercase.includes('av-1')) {
    title_encode = 7;
  } else if (title_lowercase.includes('mpeg4') || title_lowercase.includes('mpeg-4')) {
    title_encode = 3;
  } else if (title_lowercase.includes('vp9') || title_lowercase.includes('vp-9')) {
    title_encode = 8;
  }

  // 音频 可能有多个音频，选择与标题不一致，跳过
  if (title.includes('FLAC')) {
    title_audio = 1;
  } else if (title.includes('LPCM')) {
    title_audio = 13;
  } else if (title.includes(' DDP') || title.includes(' DD+') || title.search(/E-?AC-?3/) != -1) {
    title_audio = 16;
  } else if (title.includes(' DD') || title.includes(' AC3')) {
    title_audio = 15;
  } else if (title_lowercase.includes(' hra ')) {
    title_audio = 3;
  } else if (title_lowercase.includes('truehd') && title_lowercase.includes('atmos')) {
    title_audio = 11;
  } else if (title_lowercase.includes('dts-hd') || title_lowercase.includes('dts hd')) {
    title_audio = 10;
  } else if (
    title_lowercase.includes('dts:x') ||
    title_lowercase.includes('dts-x') ||
    title_lowercase.includes('dts: x') ||
    title_lowercase.includes('dtsx')
  ) {
    title_audio = 9;
  } else if (title_lowercase.includes('truehd')) {
    title_audio = 12;
  } else if (title.includes(' DTS')) {
    title_audio = 14;
  } else if (title.includes('AAC') || title.includes('USAC')) {
    title_audio = 17;
  } else if (title_lowercase.includes('ape')) {
    title_audio = 18;
  } else if (title_lowercase.includes('wav')) {
    title_audio = 19;
  } else if (title_lowercase.includes('mp3')) {
    title_audio = 4;
  } else if (title_lowercase.includes('m4a')) {
    title_audio = 8;
  } else if (title.includes(' OPUS')) {
    title_audio = 20;
  } else if (title.includes(' AV3A')) {
    title_audio = 22;
  }
  // 分辨率
  if (title_lowercase.includes('1080p')) {
    title_resolution = 1;
  } else if (title_lowercase.includes('1080i')) {
    title_resolution = 2;
  } else if (title_lowercase.includes('720p') || title_lowercase.includes('720i')) {
    title_resolution = 3;
  } else if (title.includes(' SD ')) {
    title_resolution = 4;
  } else if (
    title_lowercase.includes('8k') ||
    title_lowercase.includes('4320p') ||
    title_lowercase.includes('4320i')
  ) {
    title_resolution = 6;
  } else if (
    title_lowercase.includes('4k') ||
    title_lowercase.includes('2160p') ||
    title_lowercase.includes('2160i') ||
    title_lowercase.includes('uhd')
  ) {
    title_resolution = 7;
  }

  if (title_lowercase.includes('complete')) {
    title_is_complete = true;
  }

  if (title_lowercase.match(/s\d+e\d+/i) || title_lowercase.match(/ep\d+/i)) {
    title_is_episode = true;
  }

  if (title_lowercase.includes('x265')) {
    title_x265 = true;
  }
  if (title_lowercase.includes('x264')) {
    title_x264 = true;
  }

  if (title.includes(' DVD') && title_resolution == 3) {
    title_DVD720 = true;
  }

  var subtitle, cat, type, encode, audio, resolution, area, group, anonymous, category;
  var poster;
  var fixtd, douban, imdb, mediainfo, mediainfo_short, mediainfo_err;
  var isGroupSelected = false; //是否选择了制作组
  var isMediainfoEmpty = false; //Mediainfo栏内容是否为空
  var isInfoCorrect = false; //检查info信息是否正确
  var isBiggerThan1T = false; //种子体积是否大于1T
  // 禁转 官方 中字 国语 粤语 完结 VCB-Studio DIY 原生原盘 Remux 杜比视界 HDR HDR10+ 合集 驻站
  var isReseedProhibited = false; //禁转
  var isOfficialSeedLabel = false; //官方
  var isTagTextChinese = false; //中字
  var isTagAudioMandarin = false; //国语
  var isTagAudioCantonese = false; //粤语
  var isTagVCBStudio = false; //VCB-Studio
  var isTagResident = false; //标签是否选择驻站
  var isAudioMandarin = false;
  var isAudioCantonese = false;
  var isTextChinese = false;
  var isTextEnglish = false;

  var isTagComplete = false;
  var isTagIncomplete = false;
  var isTagCollection = false;

  var mi_x265 = false;
  var mi_x264 = false;
  var mi_type;

  var isTagDIY = false;
  var isTagUNTOUCHED = false;
  var isTagREMUX = false;

  var isTagDV = false;
  var isTagHDR = false;
  var isTagHDR10P = false;
  var isDV = false;
  var isHDR = false;
  var isHDR10P = false;
  var isDIY = title.match(/(-|@)(BHYS|sGnb|SPM|HDSky|HDHome|D[Ii]Y)/);

  var tdlist = $('#outer').find('td');
  for (var i = 0; i < tdlist.length; i++) {
    var td = $(tdlist[i]);
    if (td.text() == '副标题' || td.text() == '副標題') {
      subtitle = td.parent().children().last().text();
      if (subtitle.includes('DIY')) isDIY = true;
    }

    if (td.text() == '添加') {
      var text = td.parent().children().last().text();
      if (text.indexOf('匿名') >= 0) {
        anonymous = 1;
      }
    }

    if (td.text() == '标签') {
      var text = td.parent().children().last().text();
      if (text.includes('禁转')) {
        isReseedProhibited = true;
      }
      if (text.includes('官方')) {
        isOfficialSeedLabel = true;
      }
      if (text.includes('国语')) {
        isTagAudioMandarin = true;
      }
      if (text.includes('粤语')) {
        isTagAudioCantonese = true;
      }
      if (text.includes('中字')) {
        isTagTextChinese = true;
      }
      if (text.includes('VCB-Studio')) {
        isTagVCBStudio = true;
      }
      if (text.indexOf('完结') >= 0) {
        isTagComplete = true;
      }

      if (text.includes('分集')) {
        isTagIncomplete = true;
      }

      if (text.includes('合集')) {
        isTagCollection = true;
      }

      if (text.includes('驻站')) {
        isTagResident = true;
      }

      if (text.includes('DIY')) {
        isTagDIY = true;
      }
      if (text.includes('原生原盘')) {
        isTagUNTOUCHED = true;
      }
      if (text.includes('Remux')) {
        isTagREMUX = true;
      }

      if (text.includes('杜比视界')) {
        isTagDV = true;
      }
      if ((!text.includes('HDR10+') && text.includes('HDR')) || text.match(/HDR[^1]/) || text.includes(' HLG')) {
        isTagHDR = true;
      }
      if (text.includes('HDR10+')) {
        isTagHDR10P = true;
      }
    }

    if (td.text() == '基本信息') {
      var text = td.parent().children().last().text();
      if (text.includes('制作组')) {
        isGroupSelected = true;
      }
      if (text.includes('TB')) {
        isBiggerThan1T = true;
      }
      // 类型
      Object.keys(cat_constant).some((key) => {
        if (text.indexOf(cat_constant[key]) >= 0) {
          cat = Number(key);
          return true;
        }
      });

      // 媒介
      Object.keys(type_constant).some((key) => {
        if (text.indexOf('媒介: ' + type_constant[key]) >= 0) {
          type = Number(key);
          return true;
        }
      });

      // 编码
      let text_no_audio = text.replace(/音频编码/, 'AUDIO');
      Object.keys(encode_constant).some((key) => {
        if (text_no_audio.indexOf('编码: ' + encode_constant[key]) >= 0) {
          encode = Number(key);
          return true;
        }
      });

      // 音频编码
      Object.keys(audio_constant).some((key) => {
        if (text.indexOf('音频编码: ' + audio_constant[key]) >= 0) {
          audio = Number(key);
          return true;
        }
      });
      // 分辨率
      Object.keys(resolution_constant).some((key) => {
        if (text.indexOf('分辨率: ' + resolution_constant[key]) >= 0) {
          resolution = Number(key);
          return true;
        }
      });
      if (text.indexOf('720i') >= 0) {
        resolution = 3;
      }
      if (
        text.indexOf('480p') >= 0 ||
        text.indexOf('480i') >= 0 ||
        text.indexOf('360p') >= 0 ||
        text.indexOf('360i') >= 0
      ) {
        resolution = 4;
      }

      // 制作组
      Object.keys(group_constant).some((key) => {
        if (text.indexOf('制作组: ' + group_constant[key]) >= 0) {
          category = Number(key);
          return true;
        }
      });
    }

    if (td.text() == '副标题' || td.text() == '副標題') {
      subtitle = td.parent().children().last().text();
    }

    if (td.text() == '行为') {
      fixtd = td.parent().children().last();
    }

    if (td.text().trim() == '海报') {
      poster = $('#kposter').children().attr('src');
    }
    if (td.text() == 'MediaInfo') {
      //$(this).find("")
      let md = td.parent().children().last();
      if (md == undefined || md.text().trim() == '') {
        isMediainfoEmpty = true;
      }
      mi_type = find_info(md.text());
      if (md.children('div').length > 0) {
        mediainfo_short = md.text().replace(/\s+/g, '');
        mediainfo = md.text().replace(/\s+/g, '');
      } else if (md.children('table').length > 0) {
        mediainfo_short = md.children().children().children().eq(0).text().replace(/\s+/g, '');
        mediainfo = md.children().children().children().eq(1).text().replace(/\s+/g, '');
      }
      if (
        (containsBBCode(mediainfo) || containsBBCode(mediainfo_short)) &&
        mediainfo_short === mediainfo
      ) {
        mediainfo_err = 'MediaInfo中含有bbcode';
      }

      // 根据 Mediainfo 判断标签选择
      const audioMatch = mediainfo.matchAll(/Audio.*?Language:(\w+)/g) || [];
      for (let audioOne of audioMatch) {
        const audioLanguage = audioOne[1];
        if (audioOne[0].includes('Text')) {
          continue;
        }
        if (audioLanguage.includes('Chinese')) {
          if (subtitle.includes('粤')) {
            isAudioCantonese = true;
          } else {
            isAudioMandarin = true;
          }
          if (subtitle.includes('国语') || subtitle.includes('国配') || subtitle.includes('国粤')) {
            isAudioMandarin = true;
          }
        }
        if (audioLanguage.includes('Mandarin')) {
          isAudioMandarin = true;
        }
        if (audioLanguage.includes('Cantonese')) {
          isAudioCantonese = true;
        }
      }

      const textMatches = mediainfo.match(/Text.*?Language:(\w+)/g) || [];
      const textLanguages = textMatches.map((text) => {
        const match = text.match(/Language:(\w+)/);
        return match ? match[1] : 'Not found';
      });
      var textLanguage = textLanguages.join(',');
      if (textLanguage.includes('Chinese')) {
        isTextChinese = true;
      }
      if (textLanguage.includes('English')) {
        isTextEnglish = true;
      }
      if (mediainfo.includes('x264')) {
        mi_x264 = true;
      }
      if (mediainfo.includes('x265')) {
        mi_x265 = true;
      }
      // alert(isAudioChinese.toString() + isTextChinese.toString() + isTextEnglish.toString());
      if (md.text().includes('dvhe.') || md.text().includes('Dolby Vision')) {
        isDV = true;
      }
      const mediaintext = md.text();
      isHDR = /\bHDR Vivid\b|\bBT.2020\b|SMPTE ST 2086/i.test(mediaintext);

      if (md.text().includes('SMPTE ST 2094') || mediainfo.includes('HDR10+')) {
        isHDR10P = true;
        isHDR = true;
      }
    }
  }

  function containsBBCode(str) {
    // 创建一个正则表达式来匹配 [/b]、[/color] 等结束标签
    const regex = /\[\/(b|color|i|u|img)\]/;

    // 使用正则表达式的 test 方法来检查字符串
    return regex.test(str);
  }

  var screenshot = '';
  var pngCount = 0;
  var imgCount = 0;
  $('#kdescr img').each(function (index, element) {
    var src = $(element).attr('src');
    if (src != undefined) {
      if (index != 0) {
        screenshot += '\n';
      }
      screenshot += src.trim();
    }
    if (src.indexOf('.png') >= 0) {
      pngCount++;
    }
    imgCount++;
  });

  let error = false;
  let warning = false;

  switch (review_info_position) {
    case 1:
      $('#outer').prepend(
        '<div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>'
      );
      $('#outer').prepend(
        '<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br>'
      );
      break;
    case 2:
      $('#top').after(
        '<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>'
      );
      break;
    case 3:
      $('#top').before(
        '<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>'
      );
      break;
    default:
      $('#top').after(
        '<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>'
      );
  }

  $('#assistant-tooltips').append('');
  $('#assistant-tooltips-warning').append('');

  if (/[\u4e00-\u9fa5\uff01-\uff60]+/.test(title)) {
    $('#assistant-tooltips').append('主标题包含中文或中文字符<br/>');
    error = true;
  }
  if (/Complete/i.test(title) && type != 1 && type != 8) {
    $('#assistant-tooltips').append('主标题: Complete 需删除<br/>');
    error = true;
  }
  if (
    /\s(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\s.*S(0[1-9]|[12][0-9]|30)/.test(
      title
    )
  ) {
    $('#assistant-tooltips').append('标题：季集应在年份前<br/>');
    error = true;
  }
  if (/\sHDR10\s/.test(title)) {
    $('#assistant-tooltips').append('标题：HDR10 需要改为 HDR<br/>');
    error = true;
  }
  if (isTagHDR10P && !/(^|\s)HDR10\+\s/.test(title)) {
    $('#assistant-tooltips').append('标题：HDR类型 缺少/错误<br/>');
    error = true;
  }
  if (isTagHDR && !isTagHDR10P && !/(^|\s)(HLG|HDR|HDR10\+)(\s|$)/.test(title)) {
    $('#assistant-tooltips').append('标题：HDR类型 缺少/错误<br/>');
    error = true;
  }
  if (type == 7 && /\s(HEVC|H265)\s/i.test(title)) {
    $('#assistant-tooltips').append('标题：WEB 资源, HEVC 或 H265 应改为 H.265<br/>');
    error = true;
  }
  if (cat == 401 && /\bS\d{2}(?:E\d{2}(?:-\d{2}|E\d{2})*)?\b/gi.test(title)) {
    $('#assistant-tooltips').append(
      '经脚本检查标题包含 <b>S**E**</b>，但选择了电影类别，请再次确认<br/>'
    );
    error = true;
  }
  if (cat == 402 && !/\bS\d{2}(?:E\d{2}(?:-\d{2}|E\d{2})*)?\b/gi.test(title)) {
    $('#assistant-tooltips').append(
      '选择了剧集类别，但是经脚本检查标题未包含 <b>S**E**</b>，请再次确认<br/>'
    );
    error = true;
  }
  if (type == 7 && /\s(AVC|H264)\s/i.test(title)) {
    $('#assistant-tooltips').append('标题：WEB 资源, AVC 或 H264 应改为 H.264<br/>');
    error = true;
  }
  if (type == 4 && /\s(HEVC|H\.265)\s/.test(title)) {
    $('#assistant-tooltips').append('标题：HDTV 资源, HEVC 或 H.265 应改为 H265<br/>');
    error = true;
  }
  if (type == 4 && /\s(AVC|H\.264)\s/.test(title)) {
    $('#assistant-tooltips').append('标题：HDTV 资源, AVC 或 H.264 应改为 H264<br/>');
    error = true;
  }
  if (
    /(-|@)(FGT|NSBC|BATWEB|GPTHD|DreamHD|BlackTV|CatWEB|Xiaomi|Huawei|MOMOWEB|DDHDTV|SeeWeb|TagWeb|SonyHD|MiniHD|BitsTV|ALT|LelveTV|NukeHD|ZeroTV|HotTV|EntTV|GameHD|SmY|SeeHD|ParkHD|VeryPSP|DWR|XLMV|XJCTV|Mp4Ba|Huluwa)/i.test(
      title
    )
  ) {
    $('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
    error = true;
  }
  if (/(-|@)(CTRLHD)/.test(title)) {
    $('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
    error = true;
  }
  if (!subtitle) {
    $('#assistant-tooltips').append('副标题为空<br/>');
    error = true;
  }
  if (!cat) {
    $('#assistant-tooltips').append('未选择分类<br/>');
    error = true;
  }
  if (!type) {
    $('#assistant-tooltips').append('未选择媒介<br/>');
    error = true;
  } else {
    if (title_type && title_type !== type) {
      $('#assistant-tooltips').append(
        '标题检测媒介为' +
          type_constant[title_type] +
          '，选择媒介为' +
          type_constant[type] +
          '<br/>'
      );
      error = true;
    }
  }
  if (!encode) {
    $('#assistant-tooltips').append('未选择主视频编码<br/>');
    error = true;
  } else {
    if (title_encode && title_encode !== encode) {
      $('#assistant-tooltips').append(
        '标题检测视频编码为' +
          encode_constant[title_encode] +
          '，选择视频编码为' +
          encode_constant[encode] +
          '<br/>'
      );
      error = true;
    }
  }
  if (!audio) {
    $('#assistant-tooltips').append('未选择主音频编码<br/>');
    error = true;
  } else {
    if (title_audio && title_audio !== audio) {
      $('#assistant-tooltips').append(
        '标题检测音频编码为' +
          audio_constant[title_audio] +
          '，选择音频编码为' +
          audio_constant[audio] +
          '<br/>'
      );
      error = true;
    }
  }
  if (!resolution) {
    $('#assistant-tooltips').append('未选择分辨率<br/>');
    error = true;
  } else {
    if (title_resolution && title_resolution !== resolution) {
      $('#assistant-tooltips').append(
        '标题检测分辨率为' +
          resolution_constant[title_resolution] +
          '，选择分辨率为' +
          resolution_constant[resolution] +
          '<br/>'
      );
      error = true;
    }
  }
  if (/(480|720|1080|2160|4320)P/.test(title)) {
    $('#assistant-tooltips').append('标题：分辨率 P 应改为 p<br/>');
    error = true;
  }
  if (/atmos.*truehd/.test(title_lowercase)) {
    $('#assistant-tooltips').append('标题：Atmos 应置于 声道 之后<br/>');
    error = true;
  }
  if (/(avc|hevc|h\.265|h\.264|x265|x264).*(bluray|blu-ray|web-dl|remux)/.test(title_lowercase)) {
    $('#assistant-tooltips').append('标题：片源类型与规格应置于视频编码前面<br/>');
    error = true;
  }
  if (title_resolution_pos == -1) {
    if (title_type == 2 || title_type == 9) {
      if (!title_encode_system) {
        $('#assistant-tooltips').append('标题中缺少分辨率或制式<br/>');
        error = true;
      }
    } else {
      $('#assistant-tooltips').append('标题中缺少分辨率<br/>');
      error = true;
    }
  }

  if (title_source_pos == -1) {
    $('#assistant-tooltips').append('标题中缺少来源或媒介<br/>');
    error = true;
  }

  if (title_resolution_pos != -1 && title_source_pos != -1) {
    if (title_resolution_pos > title_source_pos) {
      $('#assistant-tooltips').append('将标题中的分辨率置于来源/媒介前<br/>');
      error = true;
    }
  }

  if (title_video_pos == -1) {
    $('#assistant-tooltips').append('标题中缺少视频编码<br/>');
    error = true;
  }

  if (title_audio_pos == -1) {
    $('#assistant-tooltips').append('标题中缺少音频编码<br/>');
    error = true;
  }

  if (title_AC3) {
    $('#assistant-tooltips').append('AC3改为 DD<br/>');
    error = true;
  }
  if (title_HQ) {
    $('#assistant-tooltips').append('删除标题中的 HQ<br/>');
    error = true;
  }
  if (title_FPS) {
    $('#assistant-tooltips').append('删除标题中的 FPS<br/>');
    error = true;
  }
  if (title_EDR) {
    $('#assistant-tooltips').append('删除标题中的 EDR<br/>');
    error = true;
  }
  if (title_SDR) {
    $('#assistant-tooltips').append('删除标题中的 SDR<br/>');
    error = true;
  }
  if (title_4K) {
    $('#assistant-tooltips').append('4K 改为 2160p,<br/>');
    error = true;
  }

  if (title_audio_complete) {
    if (!title_audio_complete[0].match(/\d\.\d/)) {
      $('#assistant-tooltips').append('标题中未正确标示声道数<br/>');
      error = true;
    }
  }

  if (title_video_pos != -1 && title_audio_pos != -1) {
    if (title_video_pos > title_audio_pos) {
      $('#assistant-tooltips').append('将标题中的视频编码置于音频编码前面<br/>');
      error = true;
    }
    if (title_HDR_pos > title_video_pos) {
      $('#assistant-tooltips').append('将标题中的HDR类型置于视频编码前面<br/>');
      error = true;
    }
    if (title_HDR_pos > title_audio_pos) {
      $('#assistant-tooltips').append('将标题中的HDR类型置于视频编码前面<br/>');
      error = true;
    }
  }

  if (title_type == type) {
    if (title_type == 1 || title_type == 8 || title_type == 11) {
      if (title_wrongBD) {
        $('#assistant-tooltips').append(`标题中${title_wrongBD}应为Blu-ray<br/>`);
        error = true;
      }
      if (mi_type == 0) {
        $('#assistant-tooltips').append('Mediainfo栏应填写BDinfo<br/>');
        error = true;
      }
      if (mi_type == 1) {
        //检查DIY和原生原盘标签
        var TagError = false;
        if (isDIY) {
          if (!isTagDIY) {
            $('#assistant-tooltips').append(`未选择DIY标签<br/>`);
            TagError = true;
          }
          if (isTagUNTOUCHED) {
            $('#assistant-tooltips').append(`不应选择原生原盘标签<br/>`);
            TagError = true;
          }
        }
        if (!isTagDIY && !isTagUNTOUCHED) {
          $('#assistant-tooltips').append(`Blu-ray 类型，未选择 原生 或 DIY 标签<br/>`);
          TagError = true;
        }
        if (isTagDIY && isTagUNTOUCHED) {
          $('#assistant-tooltips').append(`原生 或 DIY 标签只能使用一个<br/>`);
          TagError = true;
        }
        if (TagError) {
          error = true;
        }
      }
    } else {
      if (mi_type == 1) {
        $('#assistant-tooltips').append('Mediainfo栏应填写mediainfo<br/>');
        error = true;
      }
    }
    if (title_type == 10) {
      if (title_wrongBDrip) {
        $('#assistant-tooltips').append(`标题中${title_wrongBDrip}应为BluRay<br/>`);
        error = true;
      }
    }
  }

  if (/^(?!Encoding).*HLG/im.test(mediainfo_short) && !isTagHDR) {
    $('#assistant-tooltips').append(`HLG 需要添加 HDR 标签<br/>`);
    error = true;
  }
  if (title_10bit) {
    $('#assistant-tooltips').append('删除标题中的10bit<br/>');
    error = true;
  }

  // Other || SD(480 || 360)
  if (
    (resolution === 5 || resolution === 4 || title_resolution === 4) &&
    !(godDramaSeed || officialSeed)
  ) {
    $('#assistant-tooltips-warning').append('请检查是否有更高清的资源<br/>');
    warning = true;
  }

  if (title_DVD720) {
    $('#assistant-tooltips-warning').append('请检查该DVD来源的资源分辨率有否错标<br/>');
    warning = true;
  }

  if (title_ES >= 1 && !isTagComplete) {
    $('#assistant-tooltips').append('完结剧集请添加完结标签<br/>');
    error = true;
  }

  if (title_ES == 0 && !isTagIncomplete) {
    $('#assistant-tooltips').append(
      '未完结剧集请添加分集标签，如果无法勾选，请前往站点首页公告处查看并申请分集标签权限或举报删除<br/>'
    );
    error = true;
  }

  if (title_ES >= 0 && title_ES < 2 && isTagCollection) {
    $('#assistant-tooltips').append('不应选择合集标签<br/>');
    error = true;
  }

  if (!dbUrl && !godDramaSeed) {
    $('#assistant-tooltips-warning').append('简介中未检测到IMDb或豆瓣链接<br/>');
    warning = true;
  }

  if (mediainfo_err) {
    $('#assistant-tooltips').append(mediainfo_err).append('<br/>');
    error = true;
  }

  if (officialSeed && !isGroupSelected) {
    $('#assistant-tooltips').append('未选择制作组<br/>');
    error = true;
  }

  if (!officialSeed && isOfficialSeedLabel) {
    $('#assistant-tooltips').append('非官种不可选择官方标签<br/>');
    error = true;
  }

  if (officialSeed && !isOfficialSeedLabel) {
    $('#assistant-tooltips').append('官种未选择官方标签<br/>');
    error = true;
  }

  if (isBriefContainsInfo) {
    $('#assistant-tooltips').append('简介中包含Mediainfo<br/>');
    error = true;
  }

  if (isAudioMandarin && !isTagAudioMandarin) {
    $('#assistant-tooltips').append('未选择国语标签<br/>');
    error = true;
  }

  if (isAudioCantonese && !isTagAudioCantonese) {
    $('#assistant-tooltips').append('未选择粤语标签<br/>');
    error = true;
  }

  if (isTextChinese && !isTagTextChinese) {
    $('#assistant-tooltips').append('未选择中字标签<br/>');
    error = true;
  }

  if (isVCBStudio && !isTagVCBStudio) {
    $('#assistant-tooltips').append('VCB资源未选择VCB-Studio标签<br/>');
    error = true;
  }

  if ((isHDR || isHDR10P) && !isTagHDR) {
    $('#assistant-tooltips').append('未选择 HDR 标签<br/>');
    error = true;
  }
  if (!(isHDR || isHDR10P) && isTagHDR) {
    $('#assistant-tooltips').append('选择 HDR 标签，未识别到 HDR<br/>');
    error = true;
  }
  if (isHDR10P && !isTagHDR10P) {
    $('#assistant-tooltips').append('未选择 HDR10+ 标签<br/>');
    error = true;
  }
  if (!isHDR10P && isTagHDR10P) {
    $('#assistant-tooltips').append('选择 HDR10+ 标签，未识别到 HDR10+ <br/>');
    error = true;
  }
  if (!isDV && isTagDV) {
    $('#assistant-tooltips').append('选择 杜比视界 标签，未识别到 杜比视界<br/>');
    error = true;
  }
  if (isDV && !isTagDV) {
    $('#assistant-tooltips').append('未选择杜比视界标签<br/>');
    error = true;
  }
  if (title_type == 9 && !isTagREMUX) {
    $('#assistant-tooltips').append('未选择Remux标签<br/>');
    error = true;
  }

  if (imgCount < 1) {
    $('#assistant-tooltips').append('缺少海报或截图<br/>');
    error = true;
  }
  if (isMediainfoEmpty) {
    $('#assistant-tooltips').append('Mediainfo栏为空<br/>');
    error = true;
  } else if (mi_type == -1) {
    $('#assistant-tooltips').append('Mediainfo栏填写不正确<br/>');
    error = true;
  }

  if (mi_x264 && !title_x264 && officialSeed && category === 7) {
    $('#assistant-tooltips').append('压制组-主标题中编码应为 x264<br/>');
    error = true;
  }
  if (mi_x265 && !title_x265 && officialSeed && category === 7) {
    $('#assistant-tooltips').append('压制组-主标题中编码应为 x265<br/>');
    error = true;
  }

  if (officialMusicSeed) {
    $('#assistant-tooltips').empty();
    error = false;
    if (!isGroupSelected) {
      $('#assistant-tooltips').append('未选择制作组<br/>');
      error = true;
    }
  }

  if (cat === 408) {
    $('#assistant-tooltips').empty();
    error = false;
    $('#assistant-tooltips-warning').empty();
    warning = false;
  }

  if (cat === 409) {
    $('#assistant-tooltips').empty();
    error = false;
    $('#assistant-tooltips-warning').empty();
    warning = false;
  }

  if (cat === 408 && !title_lowercase.includes('khz')) {
    $('#assistant-tooltips').append('主标题缺少采样频率<br/>');
    error = true;
  }

  if (cat === 408 && !title_lowercase.includes('bit')) {
    $('#assistant-tooltips').append('主标题缺少比特率<br/>');
    error = true;
  }

  var startTime = new Date().getTime();
  var intervalId = setInterval(function () {
    var allload = true;
    $('#kdescr img').each(function (index, element) {
      var src = $(element).attr('src');
      if (src != undefined) {
        var height = $(element).height();
        if (height == 0) {
          allload = false;
        }
      }
    });
    var diff = ~~((new Date().getTime() - startTime) / 1000);
    if (diff > 30) {
      $('#assistant-tooltips-warning').append('页面图片加载30秒超时<br/>');
      window.stop();
      allload = true;
    }
    if (allload) {
      isWaitImgLoad = false;
      clearInterval(intervalId);
      $('#kdescr img').each(function (index, element) {
        var src = $(element).attr('src');
        if (src != undefined) {
          var height = $(element).height();
          if (height <= 24) {
            warning = true;
            $('#assistant-tooltips-warning').append(
              '异常图片：<a href=' + src + ' target="_blank">' + src + '</a><br/>'
            );
            $('#assistant-tooltips-warning').show();
          }
        }
      });
      if (error) {
        $('#assistant-tooltips').show();
        $('#assistant-tooltips').css('background', '#EA2027');
      } else {
        $('#assistant-tooltips').empty();
        $('#assistant-tooltips').append('此种子未检测到错误');
        $('#assistant-tooltips').css('background', '#8BC34A');
      }
      if (!warning) {
        $('#assistant-tooltips-warning').hide();
      } else {
        $('#assistant-tooltips-warning').show();
      }

      if (!error && warning) {
        $('#assistant-tooltips').hide();
      }
    }
  }, 200);

  // 主页面操作
  if (
    /https:\/\/(.*\.)?(qingwapt\.(com|org)|qingwa\.pro)\/details\.php\?id=.*/.test(
      window.location.href
    )
  ) {
    if (biggerbutton) {
      if (!error && isFoundReviewLink) {
        document.querySelector('#approvelink').style.fontSize = biggerbuttonsize;
        document.querySelector('#approvelink_foot').style.fontSize = biggerbuttonsize;
      } else if (error && isFoundReviewLink) {
        document.querySelector('#approval').style.fontSize = biggerbuttonsize;
      }
    }
    if (GM_getValue('autoClose', false)) {
      GM_setValue('autoClose', false);
      window.close();
    }
    if (GM_getValue('autoBack', false)) {
      GM_setValue('autoBack', false);
      window.history.back();
    }
  }

  // 弹出页的操作
  if (
    /https:\/\/(.*\.)?(qingwapt\.(com|org)|qingwa\.pro)\/web\/torrent-approval-page\?torrent_id=.*/.test(
      window.location.href
    )
  ) {
    // 使用延迟来等待页面可能的异步加载
    setTimeout(function () {
      if (GM_getValue('autoCheckAndConfirm', false)) {
        var radioPassButton = document
          .querySelector(
            'body > div.form-comments > form > div:nth-child(3) > div > div:nth-child(4) > div'
          )
          .click();
        if (radioPassButton) {
          radioPassButton.checked = true;
        }

        var confirmButton = document.querySelector(
          'body > div.form-comments > form > div:nth-child(5) > div > button:nth-child(1)'
        );
        if (confirmButton) {
          // 完成操作后，清除标记
          GM_setValue('autoCheckAndConfirm', false);
          GM_setValue('autoFillErrorInfo', false);
          confirmButton.click();
        }
      }
      if (GM_getValue('autoFillErrorInfo', false)) {
        var radioDenyButton = document
          .querySelector(
            'body > div.form-comments > form > div:nth-child(3) > div > div:nth-child(6)'
          )
          .click();
        if (radioDenyButton) {
          radioDenyButton.checked = true;
        }
        var errorInfo = GM_getValue('errorInfo', '');
        errorInfo = errorInfo.replace('【错误】: ', '');
        errorInfo = errorInfo.replace(
          'MediaInfo中含有bbcode',
          '请将MediaInfo中多余的标签删除，例如：[b][color=royalblue]******[/color][/b]'
        );
        errorInfo = errorInfo.replace('简介中包含Mediainfo', '请删去简介中的MediaInfo');
        errorInfo = errorInfo.replace(
          '媒体信息未解析',
          '请使用通过MediaInfo或者PotPlayer获取的正确的mediainfo信息，具体方法详见教程第四步https://www.agsvpt.com/forums.php?action=viewtopic&forumid=4&topicid=8'
        );
        errorInfo = errorInfo.replace('简介中未检测到IMDb或豆瓣链接', '请补充imdb/豆瓣链接');
        errorInfo = errorInfo.replace('副标题为空', '请补充副标题');
        $('#approval-comment').text(errorInfo);
      }
    }, timeout); // 可能需要根据实际情况调整延迟时间
  }

  // 快捷键 ctrl+e 一键通过
  document.addEventListener('keydown', function (e) {
    if (e.key === 'F4') {
      if (!error) {
        let button = document.querySelector('#approvelink');
        button.click();
      } else {
        let button = document.querySelector('#approval');
        button.click();
      }
    }
    if (e.key === 'F3') {
      window.close();
    }
  });

  // 种子存在错误便设置变量
  if (error && isFoundReviewLink) {
    GM_setValue('autoFillErrorInfo', true);
    GM_setValue('errorInfo', document.getElementById('assistant-tooltips').innerHTML);
  } else if (!error) {
    GM_setValue('autoFillErrorInfo', false);
  }

  if (!isWaitImgLoad) {
    if (error) {
      $('#assistant-tooltips').css('background', '#EA2027');
    } else {
      $('#assistant-tooltips').empty();
      $('#assistant-tooltips').append('此种子未检测到错误');
      $('#assistant-tooltips').css('background', '#8BC34A');
    }
    if (!warning) {
      $('#assistant-tooltips-warning').hide();
    }

    if (!error && warning) {
      $('#assistant-tooltips').hide();
    }
  } else {
    $('#assistant-tooltips').hide();
    $('#assistant-tooltips-warning').hide();
  }
})();
