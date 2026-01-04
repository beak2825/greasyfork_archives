// ==UserScript==
// @name         nexusphp-torrent-checker
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  新版NP架构种审检查
// @author       QingWaPT-Official
// @thanks       PTerClub Torrent Checker
// @match        *://*.qingwapt.com/details.php*
// @match        *://*.qingwa.pro/details.php*
// @icon         https://qingwapt.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522994/nexusphp-torrent-checker.user.js
// @updateURL https://update.greasyfork.org/scripts/522994/nexusphp-torrent-checker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //页面提醒元素
  var h1 = document.getElementById('top');
  var span_correct;

  var torrentResultDiv = document.createElement('div');
  torrentResultDiv.id = 'CheckBox';
  torrentResultDiv.style =
    'max-height: 1080px; max-width: 300px; opacity: 1; overflow: auto; display: block; position: fixed; left: 1%; bottom: 70%; opacity: 1; z-index: 90; background-color: white';

  //Info 初始化
  const TORRENT_INFO = {
    titleinfo: {
      origin: '',
      logo: '',
      name: '',
      season: '',
      chapter1: '-1',
      chapter2: '',
      year: '',
      resolution: '',
      source: '',
      remux: false,
      vcodec: '',
      bitdepth: '',
      fps: '',
      hdr: '',
      dv: false,
      acodec: '',
      channels: '',
      aobject: '',
      group: '',
      freeinfo: '',
    },
    tableinfo: {
      torrentfilename: '',
      subtitle: '',
      chapter1: '-1',
      chapter2: '',
      size: '',
      category: '',
      zhiliang: '',
      area: '',
      files: 1,
      imdburl: '',
      doubanurl: '',
      tags: '',
      hasTagMandarin: false,
      hasTagCantonese: false,
      hasTagChineseSubtitles: false,
      hasTagEnglishSubtitles: false,
      hasTagDIY: false,
    },
    descrinfo: {
      moviename: '',
      imdburl: '',
      doubanurl: '',
      area: '',
      lang: '',
      chapters: '',
      category: '',
      publishdate: '',
    },
    mediainfo: {
      full: '',
      filesize: '',
      video: {
        format: '',
        bitrates: '',
        hdr: '',
        dv: false,
        fps: '',
        width: '',
        height: '',
        bitdepth: '',
        scantype: '',
        codec: '',
      },
      audios: {},
      audio_lang: 0,
      subtitles: {},
      hasMandarin: false,
      hasCantonese: false,
      hasChineseSubtitles: false,
      hasEnglishSubtitles: false,
      standard: '',
    },
    bdinfo: {
      full: '',
      DIY: false,
      video: {
        format: '',
        bitrates: '1 kbps',
        hdr: '',
        dv: false,
        resolution: '',
      },
      video_dv: '0 kbps',
      audios: {},
      subtitles: [],
    },
    results: {
      title: '',
      season: '',
      chapter1: '-1',
      chapter2: '',
      files: 1,
      resolution: '',
      source: '',
      remux: false,
      vcodec: '',
      hdr: '',
      dv: false,
      acodec: '',
      channels: '',
      aobject: '',
      group: '',
      dupe: false,
      subtitle: '',
      category: '',
      zhiliang: '',
      standard: '',
    },
  };

  var match;
  var splitflag;

  //获取：tableinfo（帖子内容的表格）
  var table = document.querySelectorAll(' td#outer > table ')[0];
  for (var i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].textContent == '下载') {
      //获取种子文件名
      var torrentfilename = table.rows[i].cells[1].firstChild.textContent;
      TORRENT_INFO.tableinfo.torrentfilename = torrentfilename.match(
        /(?<=\[PTer\]\.).*?(?=\.torrent)/
      )[0];
    } else if (table.rows[i].cells[0].textContent == '副标题') {
      //获取副标题
      TORRENT_INFO.tableinfo.subtitle = table.rows[i].cells[1].textContent;
      if (
        TORRENT_INFO.tableinfo.subtitle.match(
          /((全|共)\s?[0-9]{1,4}\s?(集|话|期)|[0-9]{1,4}\s?(集|话|期)全)/
        )
      ) {
        TORRENT_INFO.tableinfo.chapter1 = '';
        TORRENT_INFO.tableinfo.chapter2 = TORRENT_INFO.tableinfo.subtitle
          .match(/((全|共)\s?[0-9]{1,4}\s?(集|话|期)|[0-9]{1,4}\s?(集|话|期)全)/)[0]
          .replace(/(全|共|集|话|期)/g, '')
          .trim();
      } else if (
        TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}-[0-9]{1,4}\s?(集|话|期)/)
      ) {
        let chapterArr = TORRENT_INFO.tableinfo.subtitle
          .match(/第?\s?[0-9]{1,4}-[0-9]{1,4}\s?(集|话|期)/)[0]
          .replace(/(第|集|话|期)/g, '')
          .split('-');
        TORRENT_INFO.tableinfo.chapter1 = chapterArr[0].trim();
        TORRENT_INFO.tableinfo.chapter2 = chapterArr[1].trim();
      } else if (TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}\s?(集|话|期)/)) {
        TORRENT_INFO.tableinfo.chapter2 = TORRENT_INFO.tableinfo.subtitle
          .match(/第?\s?[0-9]{1,4}\s?(集|话|期)/)[0]
          .replace(/(第|集|话|期)/g, '')
          .trim();
      }
    } else if (table.rows[i].cells[0].textContent == '类别与标签') {
      //获取标签
      if (TORRENT_INFO.tableinfo.tags == '') {
        TORRENT_INFO.tableinfo.tags = table.rows[i].cells[1].textContent.trim();
        if (TORRENT_INFO.tableinfo.tags.match(/国语/)) {
          TORRENT_INFO.tableinfo.hasTagMandarin = true;
        }
        if (TORRENT_INFO.tableinfo.tags.match(/粤语/)) {
          TORRENT_INFO.tableinfo.hasTagCantonese = true;
        }
        if (TORRENT_INFO.tableinfo.tags.match(/中字/)) {
          TORRENT_INFO.tableinfo.hasTagChineseSubtitles = true;
        }
        if (TORRENT_INFO.tableinfo.tags.match(/英字/)) {
          TORRENT_INFO.tableinfo.hasTagEnglishSubtitles = true;
        }
        if (TORRENT_INFO.tableinfo.tags.match(/DIY原盘/)) {
          TORRENT_INFO.tableinfo.hasTagDIY = true;
        }
      }
    } else if (table.rows[i].cells[0].textContent == '基本信息') {
      //获取基本信息
      var info = table.rows[i].cells[1].textContent;
      if (info.match(/地区.*/)) {
        TORRENT_INFO.tableinfo.area = info.match(/地区.*/)[0].trim();
        info = info.replace(TORRENT_INFO.tableinfo.area, '');
      }
      if (info.match(/质量.*/)) {
        TORRENT_INFO.tableinfo.zhiliang = info
          .match(/质量.*/)[0]
          .replace('Remux', 'REMUX')
          .trim();
        info = info.replace(TORRENT_INFO.tableinfo.zhiliang, '');
        TORRENT_INFO.tableinfo.zhiliang = TORRENT_INFO.tableinfo.zhiliang.replace('质量: ', '');
      }
      if (info.match(/类型.*/)) {
        TORRENT_INFO.tableinfo.category = info.match(/类型.*/)[0].trim();
        info = info.replace(TORRENT_INFO.tableinfo.category, '');
      }
      if (info.match(/大小.*/)) {
        TORRENT_INFO.tableinfo.size = info
          .match(/大小.*/)[0]
          .replace('大小：', '')
          .trim();
      }
    } else if (table.rows[i].cells[0].textContent == 'IMDb链接') {
      //获取 IMDb 链接
      TORRENT_INFO.tableinfo.imdburl = table.rows[i].cells[1].textContent.trim();
    } else if (table.rows[i].cells[0].textContent == '豆瓣链接') {
      //获取豆瓣链接
      TORRENT_INFO.tableinfo.doubanurl = table.rows[i].cells[1].textContent.trim();
    } else if (table.rows[i].cells[0].textContent.match('简介')) {
      //获取：descrinfo（帖子正文）
      var descr = table.rows[i].cells[1].firstChild.textContent;
      var descr_rows = descr.split('\n');
      descr_rows.forEach((r) => {
        var match;
        if (r.match(/.*(片.*名|名.*字).*/)) {
          //'　'
          match = r.match(/.*(片.*名|名.*字)/);
          TORRENT_INFO.descrinfo.moviename =
            TORRENT_INFO.descrinfo.moviename + '/' + r.replace(match[0], '').trim();
        } else if (r.match(/.*(译.*名|又.*名|别.*名).*/)) {
          match = r.match(/.*(译.*名|又.*名|别.*名)/);
          TORRENT_INFO.descrinfo.moviename =
            TORRENT_INFO.descrinfo.moviename + '/' + r.replace(match[0], '').trim();
        } else if (r.match(/(http|https):\/\/www\.imdb\.com\/title\/tt[0-9]{0,8}/)) {
          TORRENT_INFO.descrinfo.imdburl =
            'http://' + r.match(/www\.imdb\.com\/title\/tt[0-9]{0,8}/)[0].trim();
        } else if (r.match(/douban\.com\/subject\/[0-9]{0,8}/)) {
          TORRENT_INFO.descrinfo.doubanurl =
            'https://movie.' + r.match(/douban\.com\/subject\/[0-9]{0,8}/)[0].trim();
        } else if (
          r.match(/(制\s*片|产\s*地|国\s*家|地\s*区)/) &&
          !r.match(/(制\s*片\s*人|压.*制.*片.*源)/) &&
          TORRENT_INFO.descrinfo.area == '' &&
          TORRENT_INFO.descrinfo.area == ''
        ) {
          match = r.match(/.*(制\s*片|产\s*地|国\s*家|地\s*区)/);
          TORRENT_INFO.descrinfo.area = r
            .replace(match[0], '')
            .replace('中国香港', '香港')
            .replace('中国台湾', '台湾')
            .trim();
        } else if (r.match(/.*语.*言.*/) && TORRENT_INFO.descrinfo.lang == '') {
          match = r.match(/.*语.*言/);
          TORRENT_INFO.descrinfo.lang = r.replace(match[0], '').trim();
        } else if (r.match(/.*集.*数.*/) && TORRENT_INFO.descrinfo.chapters == '') {
          match = r.match(/.*集.*数/);
          TORRENT_INFO.descrinfo.chapters = r.replace(match[0], '').trim();
          console.log(TORRENT_INFO.descrinfo.chapters);
          if (!TORRENT_INFO.descrinfo.chapters.match(/^[0-9]{1,4}$/)) {
            TORRENT_INFO.descrinfo.chapters = '';
          }
        } else if (
          r.match(/.*(类.*型|类.*别).*/) &&
          (TORRENT_INFO.descrinfo.category == '' || TORRENT_INFO.descrinfo.category == '电影') &&
          !r.match(/我们的TG/)
        ) {
          match = r.match(/.*(类.*型|类.*别)/);
          TORRENT_INFO.descrinfo.category = r.replace(match[0], '').trim();
          if (TORRENT_INFO.descrinfo.category.match(/纪录片/)) {
            TORRENT_INFO.descrinfo.category = '纪录片';
          } else if (TORRENT_INFO.descrinfo.category.match(/动画/)) {
            TORRENT_INFO.descrinfo.category = '动画';
          } else if (TORRENT_INFO.descrinfo.category.match(/真人秀/)) {
            TORRENT_INFO.descrinfo.category = '综艺';
          } else if (TORRENT_INFO.descrinfo.category.match(/(4K|HDR)/i)) {
            TORRENT_INFO.descrinfo.category = '';
          }
        } else if (
          r.match(/(首\s*映|上映日期|年\s*代|年\s*份)/) &&
          TORRENT_INFO.descrinfo.publishdate == ''
        ) {
          match = r.match(/(首\s*映|上映日期|年\s*代|年\s*份)/);
          TORRENT_INFO.descrinfo.publishdate = r.replace(match[0], '').trim();
          if (TORRENT_INFO.descrinfo.publishdate.match(/[1-2][0-9]{3}/)) {
            TORRENT_INFO.descrinfo.publishdate =
              TORRENT_INFO.descrinfo.publishdate.match(/[1-2][0-9]{3}/)[0];
            console.log(`年份为 ${TORRENT_INFO.descrinfo.publishdate}`);
          } else {
            TORRENT_INFO.descrinfo.publishdate = '';
          }
        }
      });
    }
  }
  //获取 MediaInfo
  var codehides = document.getElementsByClassName('hide');
  var quote = document.getElementsByTagName('fieldset');
  var mediainfo = '';
  var bdinfo = '';
  var infosp;
  if (codehides) {
    for (let i = 0; i < codehides.length; i++) {
      if (codehides[i].textContent.match(/General\s*(ID|Complete\sname|File\sname|Unique\sID)/i)) {
        mediainfo = codehides[i].textContent;
        if (
          codehides[i].getElementsByTagName('img').length != 0 ||
          mediainfo.match(/\[img\][\S\s]*?\[\/img\]/i)
        ) {
          torrentResultDiv.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
        }
        break;
      } else if (
        bdinfo == '' &&
        codehides[i].textContent
          .trim()
          .match(/^(Disc\sTitle|Disc\sLabel|DISC\sINFO|QUICK SUMMARY):/i)
      ) {
        bdinfo = codehides[i].textContent;
        if (
          codehides[i].getElementsByTagName('img').length != 0 ||
          bdinfo.match(/\[img\][\S\s]*?\[\/img\]/i)
        ) {
          torrentResultDiv.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
        }
      }
    }
  }
  if (quote && !mediainfo && !bdinfo) {
    console.log('quote');
    for (let i = 0; i < quote.length; i++) {
      let quotet = quote[i].textContent.replace('引用', '').trim();
      if (quotet.match(/General\s*(ID|Complete\sname|File\sname|Unique\sID)/i)) {
        mediainfo = quotet.replace(/This release.*\n/i, '');
        if (
          quote[i].getElementsByTagName('img').length != 0 ||
          mediainfo.match(/\[img\][\S\s]*?\[\/img\]/i)
        ) {
          torrentResultDiv.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
        }
        break;
      } else if (quotet.match(/^(Disc\sTitle|Disc\sLabel|DISC\sINFO|QUICK SUMMARY):/i)) {
        if (bdinfo == '') {
          bdinfo = quotet;
          if (
            quote[i].getElementsByTagName('img').length != 0 ||
            bdinfo.match(/\[img\][\S\s]*?\[\/img\]/i)
          ) {
            torrentResultDiv.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
          }
        }
      }
    }
  }
  if (mediainfo) {
    TORRENT_INFO.mediainfo.full = mediainfo.replace(/\u2002/g, ' ');
    mediainfo = TORRENT_INFO.mediainfo.full
      .replace('Audio Video Interleave', '')
      .replace(/[\s\S]*?General/i, '')
      .replace(/(?<=Video) \#[1-9]\n/gi, '\n')
      .replace(/(?<=Audio) \#[1-9]\n/gi, '\n')
      .replace(/(?<=Text) \#[1-9]\n/gi, '\n');
    mediainfo = mediainfo.replace(/(Menu|菜单).*\n00:00:00\.000[\S\s]*$/i, '');
    let stream;
    //General
    match = mediainfo.match(
      /[\s\S]*?(?=((Video|视频).*\nID|(Audio|音频).*\nID|(Text|文本).*\nID|$))/gi
    )[0];
    if (match.match(/(File size|文件大小).*(?=\n)/i)) {
      TORRENT_INFO.mediainfo.filesize = match.match(/(File size|文件大小).*(?=\n)/i)[0];
    }
    mediainfo = mediainfo.replace(match, '');
    //Video
    match = mediainfo.match(
      /(Video|视频)[\s\S]*?(?=(\n(Video|视频).*\nID|\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/gi
    );
    if (match) {
      stream = match[0];
      mediainfo = mediainfo.replace(stream, '');
      if (stream.match(/(Format|格式).*/i)) {
        mediainfo = mediainfo.replace(stream, '');
      } else {
        stream = match[1];
        mediainfo = mediainfo.replace(stream, '');
      }
      if (stream.match(/(Format|格式).*/i)) {
        TORRENT_INFO.mediainfo.video.format = stream.match(/(Format|格式).*/i)[0];
        if (
          TORRENT_INFO.mediainfo.video.format.match(/MPEG/) &&
          stream.match(/Format version.*Version 2/)
        ) {
          TORRENT_INFO.mediainfo.video.format = 'MPEG-2';
        }
      }
      if (stream.match(/HDR (format|格式).*/i)) {
        let hdr_format = stream.match(/HDR (format|格式).*/i)[0];
        if (hdr_format.match(/Dolby Vision/i)) {
          TORRENT_INFO.mediainfo.video.dv = true;
          TORRENT_INFO.results.dv = true;
        }
        if (hdr_format.match(/HDR10\+/i)) {
          TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
          TORRENT_INFO.results.hdr = 'HDR10+';
        } else if (hdr_format.match(/HDR\sVivid/i)) {
          TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
          TORRENT_INFO.results.hdr = 'HDR Vivid';
        } else if (hdr_format.match(/HDR10/i)) {
          TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
          TORRENT_INFO.results.hdr = 'HDR10';
        }
      } else if (
        stream.match(/(Transfer characteristics|Transfer_characteristics_Original).*PQ.*/i)
      ) {
        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
        TORRENT_INFO.results.hdr = 'HDR10';
      } else if (
        stream.match(/(Transfer characteristics|Transfer_characteristics_Original).*HLG.*/i)
      ) {
        TORRENT_INFO.mediainfo.video.hdr = 'HLG';
        TORRENT_INFO.results.hdr = 'HLG';
      }
      if (stream.match(/(Bit rate).*/i)) {
        TORRENT_INFO.mediainfo.video.bitrates = stream.match(/(Bit rate).*/i)[0].replace(/\s/g, '');
        if (TORRENT_INFO.mediainfo.video.bitrates.match(/Mb/i)) {
          TORRENT_INFO.mediainfo.video.bitrates =
            parseFloat(
              TORRENT_INFO.mediainfo.video.bitrates.replace(/Bitrate:/i, '').replace(/Mb\/s/i, '')
            ) * 1024;
        } else if (TORRENT_INFO.mediainfo.video.bitrates.match(/kb/i)) {
          TORRENT_INFO.mediainfo.video.bitrates = parseInt(
            TORRENT_INFO.mediainfo.video.bitrates.replace(/Bitrate:/i, '').replace(/kb\/s/i, '')
          );
        }
      }
      if (stream.match(/Frame rate.*FPS\n/i)) {
        if (stream.match(/Frame rate.*23.976.*FPS\n/i)) {
          TORRENT_INFO.mediainfo.video.fps = '24FPS';
        } else if (stream.match(/Frame rate.*24.975.*FPS\n/i)) {
          TORRENT_INFO.mediainfo.video.fps = '25FPS';
        } else if (stream.match(/Frame rate.*29.970.*FPS\n/i)) {
          TORRENT_INFO.mediainfo.video.fps = '30FPS';
        } else if (stream.match(/Frame rate.*59.*FPS\n/i)) {
          TORRENT_INFO.mediainfo.video.fps = '60FPS';
        } else if (stream.match(/Frame rate.*119.*FPS\n/i)) {
          TORRENT_INFO.mediainfo.video.fps = '120FPS';
        } else {
          TORRENT_INFO.mediainfo.video.fps = stream
            .match(/Frame rate.*FPS(?=\n)/i)[0]
            .replace(/\s/g, '')
            .replace(/\.000/g, '')
            .match(/[0-9]{2,3}FPS/i)[0];
        }
      }
      if (stream.match(/(Width|宽度).*/i)) {
        TORRENT_INFO.mediainfo.video.width = parseInt(
          stream
            .match(/(Width|宽度).*/i)[0]
            .replace(/\s/g, '')
            .match(/[0-9]{3,4}(?=(pixels|像素))/i)[0]
        );
      }
      if (stream.match(/(Height|高度).*/i)) {
        TORRENT_INFO.mediainfo.video.height = parseInt(
          stream
            .match(/(Height|高度).*/i)[0]
            .replace(/\s/g, '')
            .match(/[0-9]{3,4}(?=(pixels|像素))/i)[0]
        );
      }
      if (stream.match(/(Bit depth|位深).*10 (bits|位)\s*\n/i)) {
        TORRENT_INFO.mediainfo.video.bitdepth = '10';
      } else if (stream.match(/(Bit depth|位深).*8 (bits|位)\s*\n/i)) {
        TORRENT_INFO.mediainfo.video.bitdepth = '8';
      }
      if (stream.match(/(Scan type|扫描类型|扫描方式).*/i)) {
        TORRENT_INFO.mediainfo.video.scantype = stream.match(
          /(?<=(Scan type|扫描类型|扫描方式)[\s]*: ).*/i
        )[0];
      }
      if (stream.match(/(Writing library|编码函数库).*/i)) {
        TORRENT_INFO.mediainfo.video.codec = stream.match(/(Writing library|编码函数库).*/i)[0];
        if (TORRENT_INFO.mediainfo.video.codec.match(/x264/)) {
          TORRENT_INFO.mediainfo.video.codec = 'x264';
        } else if (TORRENT_INFO.mediainfo.video.codec.match(/x265/)) {
          TORRENT_INFO.mediainfo.video.codec = 'x265';
        } else if (TORRENT_INFO.mediainfo.video.codec.match(/XviD/)) {
          TORRENT_INFO.mediainfo.video.codec = 'XviD';
        } else {
          console.log(TORRENT_INFO.mediainfo.video.codec);
        }
      }
      if (stream.match(/Standard.*NTSC/i)) {
        TORRENT_INFO.mediainfo.standard = 'NTSC';
      } else if (stream.match(/Standard.*PAL/i)) {
        TORRENT_INFO.mediainfo.standard = 'PAL';
      }
    }
    console.log(mediainfo);
    //Audios
    match = mediainfo.match(
      /\n(Audio|音频).*\n[\s\S]*?(?=(\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/gi
    );
    for (let i = 1; match; i++) {
      stream = match[0].trim();
      console.log(stream);
      mediainfo = mediainfo.replace(stream, '');
      let audioTitle = 0;
      let audioLang = 0;
      let audioAdd = 0;
      var audio_x = {
        format: '',
        channels: '',
        object: '',
        title: '',
        lang: '',
      };
      if (stream.match(/(Format|格式).*/)) {
        audio_x.format = stream.match(/(Format|格式).*/)[0];
        if (audio_x.format.match(/MLP FBA 16-ch/)) {
          audio_x.format = 'TrueHD';
          audio_x.object = 'Atmos';
        } else if (audio_x.format.match(/DTS XLL X/)) {
          audio_x.format = 'DTS:X';
        } else if (audio_x.format.match(/MLP FBA/)) {
          audio_x.format = 'TrueHD';
        } else if (audio_x.format.match(/(DTS XLL|DTS ES XLL|DTS ES XXCH XLL)/)) {
          audio_x.format = 'DTS-HD MA';
        } else if (audio_x.format.match(/(DTS XBR)/)) {
          audio_x.format = 'DTS-HD HR';
        } else if (audio_x.format.match(/PCM/)) {
          audio_x.format = 'LPCM';
        } else if (audio_x.format.match(/FLAC/)) {
          audio_x.format = 'FLAC';
        } else if (audio_x.format.match(/DTS LBR/)) {
          audio_x.format = 'DTSE';
        } else if (audio_x.format.match(/Opus/)) {
          audio_x.format = 'Opus';
        } else if (audio_x.format.match(/AAC/)) {
          audio_x.format = 'AAC';
        } else if (audio_x.format.match(/DTS/)) {
          audio_x.format = 'DTS';
        } else if (audio_x.format.match(/E-AC-3 JOC/)) {
          audio_x.format = 'DDP';
          audio_x.object = 'Atmos';
        } else if (audio_x.format.match(/E-AC-3/)) {
          audio_x.format = 'DDP';
        } else if (audio_x.format.match(/AC-3/)) {
          audio_x.format = 'DD';
        } else if (audio_x.format.match(/MPEG Audio/)) {
          audio_x.format = 'MPEG';
        }
      }
      if (audio_x.format == 'MPEG' && stream.match(/Format profile.*Layer 2/)) {
        audio_x.format = 'MP2';
      } else if (audio_x.format == 'MPEG' && stream.match(/Format profile.*Layer 3/)) {
        audio_x.format = 'MP3';
      }
      if (stream.match(/(Channel layout|ChannelLayout_Original|声道布局).*/i)) {
        let channel_layout = stream.match(
          /(?<=(Channel layout|ChannelLayout_Original|声道布局)).*/i
        )[0];
        let channels = 0;
        if (channel_layout.match(/LFE/i)) {
          channels += 0.1;
          channel_layout = channel_layout.replace(channel_layout.match(/LFE/i), '');
        }
        if (channel_layout.match(/Lss?/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/Lss?/i), '');
        }
        if (channel_layout.match(/Rss?/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/Rss?/i), '');
        }
        if (channel_layout.match(/Cb/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/Cb/i), '');
        }
        if (channel_layout.match(/Lb/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/Lb/i), '');
        }
        if (channel_layout.match(/Rb/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/Rb/i), '');
        }
        if (channel_layout.match(/(C|M)s?/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/C/i), '');
        }
        if (channel_layout.match(/L/i)) {
          channels += 1;
          channel_layout = channel_layout.replace(channel_layout.match(/L/i), '');
        }
        if (channel_layout.match(/R/i)) {
          channels += 1;
        }
        audio_x.channels = channels.toFixed(1).toString();
      } else if (stream.match(/Channel positions.*Front: L C R, Side: L R, Back: L R, LFE/i)) {
        audio_x.channels = '7.1';
      } else if (stream.match(/Channel positions.*Front: L C R, Side: L R, LFE/i)) {
        audio_x.channels = '5.1';
      } else if (stream.match(/Channel\(s\).*6\schannels/i)) {
        audio_x.channels = '5.1';
      } else if (stream.match(/Channel\(s\).*[12].*/i)) {
        audio_x.channels = stream.match(/Channel\(s\).*[12].*/i)[0].match(/[12]/)[0] + '.0';
      }
      //判断音轨语言
      if (stream.match(/Title.*/)) {
        TORRENT_INFO.mediainfo.video.audio_lang += 1;
        audio_x.title = stream.match(/Title.*/)[0];
        if (audio_x.title.match(/(国语|普通话|国配|台配|Mandarin)/)) {
          audioTitle = 1;
        }
        if (audio_x.title.match(/(粤语|粵語|粤配|Cantonese)/)) {
          audioTitle = 3;
        }
      } else {
        audio_x.title = null;
      }
      if (stream.match(/(Language|语言).*/)) {
        TORRENT_INFO.mediainfo.video.audio_lang += 1;
        audio_x.lang = stream.match(/(Language|语言).*/)[0];
        if (audio_x.lang.match(/(Chinese|Mandarin)/i)) {
          audioLang = 5;
        }
        if (audio_x.lang.match(/(Cantonese)/i)) {
          audioLang = 9;
        }
      } else {
        audio_x.lang = null;
      }
      audioAdd = audioTitle + audioLang;
      console.log(`audioAdd ${audioAdd}`);
      if (audioAdd == 1) {
        TORRENT_INFO.mediainfo.hasMandarin = true;
      } else if (audioAdd == 3) {
        TORRENT_INFO.mediainfo.hasCantonese = true;
      } else if (audioAdd == 6) {
        TORRENT_INFO.mediainfo.hasMandarin = true;
      } else if (audioAdd == 12) {
        TORRENT_INFO.mediainfo.hasCantonese = true;
      } else if (audioAdd == 5) {
        TORRENT_INFO.mediainfo.hasMandarin = true;
      } else if (audioAdd == 9 || audioAdd == 8) {
        TORRENT_INFO.mediainfo.hasCantonese = true;
      }
      let key = 'audio' + i;
      TORRENT_INFO.mediainfo.audios[key] = audio_x;
      match = mediainfo.match(
        /\n(Audio|音频).*\n[\s\S]*?(?=(\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/gi
      );
    }
    console.log(mediainfo);
    //Subtitles
    match = mediainfo.match(/\n(Text|文本).*\n[\s\S]*?(?=(\n(Text|文本).*\nID|$))/gi);
    for (let i = 1; match; i++) {
      stream = match[0].trim();
      console.log(stream);
      mediainfo = mediainfo.replace(stream, '');
      var text_x = {
        title: '',
        lang: '',
      };
      if (stream.match(/(Language|语言).*(Chinese|Mandarin)/i)) {
        TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
        if (stream.match(/Title.*(cht&eng|中英|chs&eng)/i)) {
          TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
        }
      }
      if (stream.match(/(Language|语言).*English/i)) {
        TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
      }
      let key = 'text' + i;
      TORRENT_INFO.mediainfo.subtitles[key] = text_x;
      match = mediainfo.match(/\n(Text|文本).*\n[\s\S]*?(?=(\n(Text|文本).*\nID|$))/gi);
    }
  }
  if (bdinfo && !mediainfo) {
    bdinfo = bdinfo.replace(/\u2002/g, ' ');
    console.log(bdinfo);
    TORRENT_INFO.bdinfo.full = bdinfo;
    if (TORRENT_INFO.tableinfo.subtitle.match(/DIY/i)) {
      TORRENT_INFO.bdinfo.DIY = true;
    }
    let ai = 1;
    let si = 1;
    //Video
    var bdinfo_rows = [];
    bdinfo.split('\n').forEach((r) => {
      if (r.match(/ kbps/)) {
        bdinfo_rows.push(r);
      }
    });
    bdinfo_rows.forEach((r) => {
      console.log(r);
      if (r.match(/Video/) && TORRENT_INFO.bdinfo.video.format == '') {
        //format
        if (r.match('AVC')) {
          TORRENT_INFO.bdinfo.video.format = 'AVC';
        } else if (r.match('HEVC')) {
          TORRENT_INFO.bdinfo.video.format = 'HEVC';
        } else if (r.match('VC-1')) {
          TORRENT_INFO.bdinfo.video.format = 'VC-1';
        } else if (r.match('MPEG-2')) {
          TORRENT_INFO.bdinfo.video.format = 'MPEG-2';
        }
        //bitrates
        if (r.match(/[0-9]{1,5} kbps/)) {
          TORRENT_INFO.bdinfo.video.bitrates = r.match(/[0-9]{1,5} kbps/)[0];
        }
        //resolution
        if (r.match(/[1-2][0-9]{3}(p|i)/)) {
          TORRENT_INFO.bdinfo.video.resolution = r.match(/[1-2][0-9]{3}(p|i)/)[0];
        } else {
          TORRENT_INFO.bdinfo.video.resolution = r.match(/[0-8]{3}(p|i)/)[0];
        }
        //HDR
        if (r.match(/HDR10\+/)) {
          TORRENT_INFO.bdinfo.video.hdr = 'HDR10+';
          TORRENT_INFO.results.hdr = 'HDR10+';
        } else if (r.match(/HDR/)) {
          TORRENT_INFO.bdinfo.video.hdr = 'HDR';
          TORRENT_INFO.results.hdr = 'HDR';
        }
      } else if (r.match(/Video/) && r.match(/Dolby Vision/)) {
        //DV
        if (r.match(/[0-9]{1,5} kbps/)) {
          TORRENT_INFO.bdinfo.video_dv = r.match(/[0-9]{1,5} kbps/)[0];
        }
        TORRENT_INFO.bdinfo.video.dv = true;
        TORRENT_INFO.results.dv = true;
      }
      //Subtitles
      else if (r.match(/(Subtitle|Presentation Graphics)/)) {
        if (r.match('Chinese')) {
          TORRENT_INFO.bdinfo.subtitles.push('Mandarin');
          TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
        }
        if (r.match('English') || r.match('英')) {
          TORRENT_INFO.bdinfo.subtitles.push('English');
          TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
        }
        TORRENT_INFO.bdinfo.subtitles.push('有字幕');
      }
      //Audios
      else if (r.match(/(Audio|kHz)/)) {
        var audio_x = {
          format: '',
          channels: '',
          lang: '',
          object: '',
        };
        //format
        if (r.match(/Dolby TrueHD\/Atmos Audio/)) {
          audio_x.format = 'TrueHD';
          audio_x.object = 'Atmos';
        } else if (r.match(/Dolby TrueHD Audio/)) {
          audio_x.format = 'TrueHD';
        } else if (r.match(/DTS-HD Master Audio/)) {
          audio_x.format = 'DTS-HD MA';
        } else if (r.match(/DTS-HD High-Res/)) {
          audio_x.format = 'DTS-HD HR';
        } else if (r.match(/DTS/)) {
          audio_x.format = 'DTS';
        } else if (r.match(/Dolby Digital Plus Audio/)) {
          audio_x.format = 'DDP';
        } else if (r.match(/Dolby Digital Audio/)) {
          audio_x.format = 'DD';
        } else if (r.match(/LPCM Audio/)) {
          audio_x.format = 'LPCM';
        } else {
          audio_x.format = 'Unknown';
        }
        //channels
        if (r.match(/[1-7]\.[0-1]( |-ES )\//)) {
          audio_x.channels = r
            .match(/[1-7]\.[0-1]( |-ES )\//)[0]
            .replace('-ES', '')
            .replace(' /', '');
        }
        //language
        if (r.match('Chinese')) {
          audio_x.lang = 'Mandarin';
          TORRENT_INFO.mediainfo.hasMandarin = true;
        } else if (r.match('Cantonese')) {
          audio_x.lang = 'Cantonese';
          TORRENT_INFO.mediainfo.hasCantonese = true;
        }
        let key = 'audio' + ai;
        ai++;
        TORRENT_INFO.bdinfo.audios[key] = audio_x;
      }
    });
  }
  //获取 titleinfo
  var title = document.getElementById('top');
  //分离主标题和免费信息
  TORRENT_INFO.titleinfo.origin = title.firstChild.textContent.trim();
  TORRENT_INFO.titleinfo.freeinfo = title.textContent.replace(TORRENT_INFO.titleinfo.origin, '');
  TORRENT_INFO.results.title = TORRENT_INFO.titleinfo.origin;
  //获取台标
  if (TORRENT_INFO.results.title.match(/(CCTV4K)/i)) {
    match = TORRENT_INFO.results.title.match(/(CCTV4K)/i);
    TORRENT_INFO.titleinfo.logo = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Logo##');
  }
  //获取：标题 REMUX 信息
  if (TORRENT_INFO.results.title.match(/Remux/i)) {
    TORRENT_INFO.titleinfo.remux = true;
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
      TORRENT_INFO.results.title.match(/Remux/i)[0],
      '##REMUX##'
    );
  }
  //获取：标题来源1
  if (TORRENT_INFO.results.title.match(/Blu-?ray/i)) {
    match = TORRENT_INFO.results.title.match(/Blu-?ray/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'Blu-ray';
    //获取：标题来源2
  } else if (TORRENT_INFO.results.title.match(/WEB-?DL/i)) {
    match = TORRENT_INFO.results.title.match(/WEB-?DL/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'WEB-DL';
    //获取标题来源3
  } else if (TORRENT_INFO.results.title.match(/WEBRip/i)) {
    match = TORRENT_INFO.results.title.match(/WEBRip/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'WEBRip';
    //获取标题来源4
  } else if (TORRENT_INFO.results.title.match(/HDTVRip/i)) {
    match = TORRENT_INFO.results.title.match(/HDTVRip/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'HDTVRip';
    //获取标题来源5
  } else if (TORRENT_INFO.results.title.match(/HDTV/i)) {
    match = TORRENT_INFO.results.title.match(/HDTV/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'HDTV';
    //获取标题来源6
  } else if (TORRENT_INFO.results.title.match(/DVDRip/i)) {
    match = TORRENT_INFO.results.title.match(/DVDRip/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'DVDRip';
    //获取标题来源6
  } else if (
    TORRENT_INFO.results.title.match(/DVD[59]?/i) &&
    TORRENT_INFO.results.title.match(/(PAL|NTSC)/i)
  ) {
    match = TORRENT_INFO.results.title.match(/DVD[59]?/i);
    TORRENT_INFO.titleinfo.source = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
    TORRENT_INFO.results.source = 'DVD';
    match = TORRENT_INFO.results.title.match(/(PAL|NTSC)/i);
    TORRENT_INFO.titleinfo.standard = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Standard##');
  } else {
    torrentResultDiv.innerHTML += '<span>主标题缺少来源</span><br>';
  }
  //获取标题视频编码
  if (
    TORRENT_INFO.results.title.match(
      /(HEVC|AVC|x264|x265|H(\.|\s)?264|H(\.|\s)?265|Xvid|VC-?1|MPEG-?2|AV1|VP9)/i
    )
  ) {
    match = TORRENT_INFO.results.title.match(
      /(HEVC|AVC|x264|x265|H(\.|\s)?264|H(\.|\s)?265|Xvid|VC-?1|MPEG-?2|AV1|VP9)/i
    );
    TORRENT_INFO.titleinfo.vcodec = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Vcodec##');
  } else {
    torrentResultDiv.innerHTML += '<span>主标题缺少视频编码</span><br>';
  }
  if (TORRENT_INFO.results.source != 'DVDRip') {
    //获取标题视频分辨率1
    if (TORRENT_INFO.results.title.match(/(480i|480p|576p|720p|1080p|2160p|4320p)/i)) {
      match = TORRENT_INFO.results.title.match(/(480i|480p|576p|720p|1080p|2160p|4320p)/i);
      TORRENT_INFO.titleinfo.resolution = match[0].trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
      //获取标题视频分辨率2
    } else if (TORRENT_INFO.results.title.match(/8K/i)) {
      match = TORRENT_INFO.results.title.match(/8K/i);
      TORRENT_INFO.titleinfo.resolution = '4320p';
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
      //获取标题视频分辨率3
    } else if (TORRENT_INFO.results.title.match(/4K/i)) {
      match = TORRENT_INFO.results.title.match(/4K/i);
      TORRENT_INFO.titleinfo.resolution = '2160p';
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
      //获取标题视频分辨率3
    } else if (TORRENT_INFO.results.title.match(/1080i/i)) {
      match = TORRENT_INFO.results.title.match(/1080i/i);
      TORRENT_INFO.titleinfo.resolution = '1080i';
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace('1080i', '##Resolution##');
    } else {
      torrentResultDiv.innerHTML += '<span>主标题缺少分辨率</span><br>';
    }
  } else {
    //获取 DVDRip 标题视频分辨率1
    if (TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p)/i)) {
      match = TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p)/i);
      TORRENT_INFO.titleinfo.resolution = match[0].trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
    }
  }
  //获取标题音频对象1
  if (TORRENT_INFO.results.title.match(/Atmos/i)) {
    TORRENT_INFO.titleinfo.aobject = 'Atmos';
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(/Atmos/i, '##Atmos##');
    //获取标题音频对象2
  } else if (TORRENT_INFO.results.title.match(/DDPA/i)) {
    TORRENT_INFO.titleinfo.aobject = 'A';
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(/DDPA/i, 'DDP##Atmos##');
  }
  //获取前置：标题拆分
  console.log(`TORRENT_INFO.titleinfo.origin ${TORRENT_INFO.titleinfo.origin}`);
  if (TORRENT_INFO.titleinfo.source != '') {
    title = TORRENT_INFO.titleinfo.origin
      .replace(TORRENT_INFO.titleinfo.source, '##Source##')
      .split('##Source##');
    title[1] = TORRENT_INFO.titleinfo.origin
      .replace(title[0], '')
      .replace(TORRENT_INFO.titleinfo.source, '')
      .replace(TORRENT_INFO.titleinfo.resolution, '')
      .replace('Remux', '')
      .replace(TORRENT_INFO.titleinfo.vcodec, ''); //剩下制作组、音频编码、音频通道、HDR 信息、HQ 等
    title[0] = title[0]
      .replace(TORRENT_INFO.titleinfo.resolution, '')
      .replace('Remux', '')
      .replace(TORRENT_INFO.titleinfo.vcodec, ''); //剩下片名、年份、季数、集数、剪辑版本、Hybrid 等
  } else if (TORRENT_INFO.titleinfo.resolution != '') {
    title = TORRENT_INFO.titleinfo.origin
      .replace(TORRENT_INFO.titleinfo.resolution, '##Resolution##')
      .split('##Resolution##');
    title[1] = TORRENT_INFO.titleinfo.origin
      .replace(title[0], '')
      .replace(TORRENT_INFO.titleinfo.resolution, '')
      .replace(TORRENT_INFO.titleinfo.source, '')
      .replace('Remux', '')
      .replace(TORRENT_INFO.titleinfo.vcodec, ''); //剩下片名、年份、季数、集数、剪辑版本、Hybrid 等
    title[0] = title[0]
      .replace(TORRENT_INFO.titleinfo.source, '')
      .replace('Remux', '')
      .replace(TORRENT_INFO.titleinfo.vcodec, ''); //剩下制作组、音频通道、HDR 信息、HQ 等
  }
  if (title[0] && title[1]) {
    console.log(`title[0] is ${title[0]}`);
    console.log(`title[1] is ${title[1]}`);
    //获取标题音频编码1
    if (
      title[1].match(
        /(DTS(-|\s|\.)?HD.?MA|DTS(-|\s\.)?HD.?HR|DD\+|DDP|LPCM|DTS.?X|MP2|EAC-?3|FLAC|TrueHD|AAC|OPUS)/gi
      )
    ) {
      match = title[1].match(
        /(DTS(-|\s|\.)?HD.?MA|DTS(-|\s\.)?HD.?HR|DD\+|DDP|LPCM|DTS.?X|MP2|EAC-?3|FLAC|TrueHD|AAC|OPUS)/gi
      );
      TORRENT_INFO.titleinfo.acodec = match[0].replace('.', ' ').trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Acodec##');
      title[1] = title[1].replace(match[0], '');
      //获取标题音频编码2
    } else if (title[1].match(/(DTS|DD|PCM|AC-?3)/gi)) {
      match = title[1].match(/(DTS|DD|PCM|AC-?3)/gi);
      TORRENT_INFO.titleinfo.acodec = match[0].trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Acodec##');
      title[1] = title[1].replace(match[0], '');
    }
    //获取标题音频通道
    if (title[1].match(/[1-7]\.[0-1]/gi)) {
      match = title[1].match(/[1-7]\.[0-1]/gi);
      TORRENT_INFO.titleinfo.channels = match[0].trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Channels##');
      title[1] = title[1].replace(match[0], '');
    }
    //获取标题制作组
    if (title[1].match(/￡.*(-|@)FRDS/i)) {
      TORRENT_INFO.titleinfo.group = title[1].match(/￡.*(-|@)FRDS/i)[0].trim();
    } else {
      try {
        let groups = title[1].split('-');
        TORRENT_INFO.titleinfo.group += groups[1].trim();
        for (let i = 2; i < groups.length; i++) {
          TORRENT_INFO.titleinfo.group += '-';
          TORRENT_INFO.titleinfo.group += groups[i].trim();
        }
        if (TORRENT_INFO.titleinfo.group == '') {
          TORRENT_INFO.titleinfo.group = title[1].split('@')[1].trim();
        }
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
          TORRENT_INFO.titleinfo.group,
          '##Group##'
        );
      } catch (e) {
        console.log('无制作组');
      }
    }
    //获取季数
    if (title[0].match(/S[0-2][0-9]/i)) {
      match = title[0].match(/S[0-2][0-9]/i);
      TORRENT_INFO.titleinfo.season = match[0];
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Season##');
      title[0] = title[0].replace(match[0], '');
    }
    //获取集数
    if (title[0].match(/E[0-9]{1,4}-E?[0-9]{1,4}/)) {
      match = title[0].match(/E[0-9]{1,4}-E?[0-9]{1,4}/);
      let chapterArr = match[0].replaceAll('E', '').split('-');
      TORRENT_INFO.titleinfo.chapter1 = chapterArr[0];
      TORRENT_INFO.titleinfo.chapter2 = chapterArr[1];
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Chapters##');
      title[0] = title[0].replace(match[0], '');
    } else if (title[0].match(/E[0-9]{1,4}/)) {
      match = title[0].match(/E[0-9]{1,4}/);
      TORRENT_INFO.titleinfo.chapter1 = '-1';
      TORRENT_INFO.titleinfo.chapter2 = match[0].replaceAll('E', '');
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Chapters##');
      title[0] = title[0].replace(match[0], '');
    } else {
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
        '##Season##',
        '##Season####Chapters##'
      );
    }
    //获取片名和年份
    console.log(TORRENT_INFO.results.title);
    TORRENT_INFO.titleinfo.name = TORRENT_INFO.results.title
      .replace('##Logo##', '')
      .split('##', 1)[0]
      .trim(); //先获取一个片名
    if (TORRENT_INFO.descrinfo.moviename.match(TORRENT_INFO.titleinfo.name)) {
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
        TORRENT_INFO.titleinfo.name,
        '##Name##'
      ); //如果直接匹配，说明主标题没有年份可以获取或在季数后面
      match = TORRENT_INFO.results.title.match(/[1-2][0-9]{3}/g);
      if (match) {
        TORRENT_INFO.titleinfo.year = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
          TORRENT_INFO.titleinfo.year,
          '##Year##'
        );
      }
    } else if (title[0].match(/[1-2][0-9]{3}/g)) {
      match = title[0].match(/[1-2][0-9]{3}/g);
      TORRENT_INFO.titleinfo.year = match[match.length - 1];
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
        TORRENT_INFO.titleinfo.year,
        '##Year##'
      );
      TORRENT_INFO.titleinfo.name = TORRENT_INFO.results.title
        .replace('##Logo##', '')
        .split('##', 1)[0]
        .trim();
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
        TORRENT_INFO.titleinfo.name,
        '##Name##'
      );
    } else {
      TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(
        TORRENT_INFO.titleinfo.name,
        '##Name##'
      );
    }
  }
  //获取标题 FPS
  if (TORRENT_INFO.results.title.match(/[0-9]{2,3}FPS/i)) {
    match = TORRENT_INFO.results.title.match(/[0-9]{2,3}FPS/i);
    TORRENT_INFO.titleinfo.fps = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##FPS##');
  }
  //获取标题 HDR
  if (TORRENT_INFO.results.title.match(/HDR10(\+|P)/i)) {
    match = TORRENT_INFO.results.title.match(/HDR10(\+|P)/i);
    TORRENT_INFO.titleinfo.hdr = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
  } else if (TORRENT_INFO.results.title.match(/HDR.Vivid/i)) {
    match = TORRENT_INFO.results.title.match(/HDR.Vivid/i);
    TORRENT_INFO.titleinfo.hdr = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
  } else if (TORRENT_INFO.results.title.match(/HDR(10)?/i)) {
    match = TORRENT_INFO.results.title.match(/HDR(10)?/i);
    TORRENT_INFO.titleinfo.hdr = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
  } else if (TORRENT_INFO.results.title.match(/HLG/i)) {
    TORRENT_INFO.titleinfo.hdr = 'HLG';
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace('HLG', '##HDR##');
  }
  //获取标题 DV
  if (TORRENT_INFO.results.title.match(/(DV|DoVi)/i)) {
    match = TORRENT_INFO.results.title.match(/(DV|DoVi)/i);
    TORRENT_INFO.titleinfo.dv = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##DoVi##');
  }
  //获取 10bit
  if (TORRENT_INFO.results.title.match(/10bits?/i)) {
    match = TORRENT_INFO.results.title.match(/10bits?/i);
    TORRENT_INFO.titleinfo.bitdepth = match[0];
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##BitDepth##');
  }
  TORRENT_INFO.results.title = TORRENT_INFO.results.title
    .replace('##Name####', '##Name## ##')
    .replace(/\./g, ' ');

  //逻辑：重要检查
  //逻辑：MediaInfo 检查
  if (TORRENT_INFO.mediainfo.full != '' || infosp) {
    //逻辑：标题媒介检查
    if (TORRENT_INFO.titleinfo.remux) {
      TORRENT_INFO.results.zhiliang = 'REMUX';
    } else if (
      TORRENT_INFO.results.source == 'Blu-ray' &&
      TORRENT_INFO.mediainfo.video.codec.match(/(x264|x265|Xvid)/i)
    ) {
      TORRENT_INFO.results.zhiliang = 'Encode';
    } else if (
      TORRENT_INFO.results.source == 'Blu-ray' &&
      TORRENT_INFO.titleinfo.group.match(
        /(FRDS|beAst|WScode|Dream|WiKi|CMCT|ANK-Raws|TLF|HDH$|HDS$)/i
      )
    ) {
      if (TORRENT_INFO.mediainfo.video.bitrates > 50000 && TORRENT_INFO.results.resolution > 1080) {
        console.log('质量可能为 REMUX');
        TORRENT_INFO.results.zhiliang = 'REMUX';
      } else if (
        TORRENT_INFO.mediainfo.video.bitrates > 15600 &&
        TORRENT_INFO.results.resolution <= 1080
      ) {
        console.log('质量可能为 REMUX');
        TORRENT_INFO.results.zhiliang = 'REMUX';
      } else {
        TORRENT_INFO.results.zhiliang = 'Encode';
      }
    } else if (
      TORRENT_INFO.results.source == 'WEB-DL' &&
      TORRENT_INFO.titleinfo.group.match(/(FRDS)/i)
    ) {
      TORRENT_INFO.results.zhiliang = 'Encode';
    } else if (TORRENT_INFO.results.source == 'WEB-DL') {
      TORRENT_INFO.results.zhiliang = 'WEB-DL';
    } else if (TORRENT_INFO.results.source == 'WEBRip') {
      TORRENT_INFO.results.zhiliang = 'Encode';
    } else if (TORRENT_INFO.results.source == 'HDTVRip') {
      TORRENT_INFO.results.zhiliang = 'Encode';
    } else if (TORRENT_INFO.results.source == 'HDTV') {
      TORRENT_INFO.results.zhiliang = 'HDTV';
    } else if (TORRENT_INFO.results.source == 'DVDRip') {
      TORRENT_INFO.results.zhiliang = 'Encode';
    } else if (TORRENT_INFO.results.source == 'DVD') {
      TORRENT_INFO.results.zhiliang = 'DVD';
    } else {
      console.log('MediaInfo 质量为 Unknown');
    }
    //逻辑：视频编码检查
    if (TORRENT_INFO.mediainfo.video.format == 'MPEG-2') {
      TORRENT_INFO.results.vcodec = 'MPEG-2';
    } else if (TORRENT_INFO.mediainfo.video.codec == 'XviD') {
      TORRENT_INFO.results.vcodec = 'XviD';
    } else if (TORRENT_INFO.mediainfo.video.format.match(/AV1/)) {
      TORRENT_INFO.results.vcodec = 'AV1';
    } else if (TORRENT_INFO.mediainfo.video.format.match(/VP9/i)) {
      TORRENT_INFO.results.vcodec = 'VP9';
    } else if (TORRENT_INFO.mediainfo.video.format.match(/VC-1/)) {
      TORRENT_INFO.results.vcodec = 'VC-1';
    } else if (TORRENT_INFO.results.zhiliang == 'REMUX') {
      if (TORRENT_INFO.mediainfo.video.format.match(/AVC/)) {
        TORRENT_INFO.results.vcodec = 'AVC';
      } else if (TORRENT_INFO.mediainfo.video.format.match(/HEVC/)) {
        TORRENT_INFO.results.vcodec = 'HEVC';
      } else if (TORRENT_INFO.mediainfo.video.format.match(/VC-1/)) {
        TORRENT_INFO.results.vcodec = 'VC-1';
      }
    } else if (TORRENT_INFO.results.zhiliang == 'Encode') {
      if (
        TORRENT_INFO.mediainfo.video.format.match(/AVC/) ||
        TORRENT_INFO.mediainfo.video.codec.match(/x264/)
      ) {
        TORRENT_INFO.results.vcodec = 'x264';
      } else if (
        TORRENT_INFO.mediainfo.video.format.match(/HEVC/) ||
        TORRENT_INFO.mediainfo.video.codec.match(/x265/)
      ) {
        TORRENT_INFO.results.vcodec = 'x265';
      }
    } else if (TORRENT_INFO.mediainfo.video.codec.match(/(x264|x265|Xvid)/i)) {
      TORRENT_INFO.results.vcodec = TORRENT_INFO.mediainfo.video.codec;
    } else if (TORRENT_INFO.mediainfo.video.format.match(/AVC/)) {
      TORRENT_INFO.results.vcodec = 'H264';
    } else if (TORRENT_INFO.mediainfo.video.format.match(/HEVC/)) {
      TORRENT_INFO.results.vcodec = 'H265';
    } else if (false) {
      TORRENT_INFO.results.vcodec = 'MPEG-2';
    } else {
      console.log(`MediaInfo 视频编码为 ${TORRENT_INFO.mediainfo.video.format}`);
    }
    //逻辑：音频编码检查
    //逻辑：分辨率检查
    var minusresult = TORRENT_INFO.mediainfo.video.width - TORRENT_INFO.mediainfo.video.height;
    console.log(minusresult);
    if (TORRENT_INFO.mediainfo.video.width < TORRENT_INFO.mediainfo.video.height) {
      minusresult = 0 - minusresult;
      console.log(`竖屏短剧宽小于高 ${minusresult}`);
    }
    if (minusresult > 4096 - 1248) {
      console.log('分辨率为 4320p');
      TORRENT_INFO.results.resolution = '4320';
    } else if (
      minusresult > 1920 - 672 ||
      (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height &&
        TORRENT_INFO.mediainfo.video.height == 2160)
    ) {
      console.log('分辨率为 2160p');
      TORRENT_INFO.results.resolution = '2160';
    } else if (
      minusresult > 1280 - 500 ||
      (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height &&
        TORRENT_INFO.mediainfo.video.height == 1080)
    ) {
      console.log('分辨率为 1080');
      TORRENT_INFO.results.resolution = '1080';
    } else if (
      minusresult > 1024 - 520 ||
      (TORRENT_INFO.mediainfo.video.width > 1260 && TORRENT_INFO.mediainfo.video.width <= 1280) ||
      TORRENT_INFO.mediainfo.video.height == 720
    ) {
      console.log('分辨率为 720p');
      TORRENT_INFO.results.resolution = '720';
    } else if (
      TORRENT_INFO.mediainfo.video.height > 480 &&
      TORRENT_INFO.mediainfo.video.height <= 576
    ) {
      console.log('分辨率为 576p');
      TORRENT_INFO.results.resolution = '576';
    } else if (
      TORRENT_INFO.mediainfo.video.height > 350 &&
      TORRENT_INFO.mediainfo.video.height <= 480
    ) {
      console.log('分辨率为 480p');
      TORRENT_INFO.results.resolution = '480';
    } else {
      console.log(`MediaInfo 分辨率为 ${TORRENT_INFO.titleinfo.resolution}?`);
    }
    if (TORRENT_INFO.mediainfo.full != '' && TORRENT_INFO.results.resolution != '') {
      if (TORRENT_INFO.mediainfo.video.scantype.match(/(Interlaced|MBAFF|隔行扫描)/i)) {
        TORRENT_INFO.results.resolution += 'i';
      } else {
        TORRENT_INFO.results.resolution += 'p';
      }
    } else if (TORRENT_INFO.results.resolution != '') {
      if (TORRENT_INFO.results.source == 'HDTV' && TORRENT_INFO.results.resolution != '2160') {
        TORRENT_INFO.results.resolution += 'i';
      } else {
        TORRENT_INFO.results.resolution += 'p';
      }
    }
  } else if (TORRENT_INFO.bdinfo.full != '') {
    //逻辑：标题媒介检查
    if (TORRENT_INFO.bdinfo.video.resolution == '2160p') {
      console.log('质量为 UHD Discs');
      TORRENT_INFO.results.zhiliang = 'UHD';
      TORRENT_INFO.results.source = 'Blu-ray';
    } else if (TORRENT_INFO.bdinfo.video.resolution.match(/1080/)) {
      console.log('质量为 BD Discs');
      TORRENT_INFO.results.zhiliang = 'BD';
      TORRENT_INFO.results.source = 'Blu-ray';
    } else {
      console.log('BDInfo 质量为 Unknown');
    }
    //逻辑：分辨率检查
    TORRENT_INFO.results.resolution = TORRENT_INFO.bdinfo.video.resolution;
    //逻辑：视频编码检查
    TORRENT_INFO.results.vcodec = TORRENT_INFO.bdinfo.video.format;
    //逻辑：音频编码检查
  }
  //逻辑：类型
  if (TORRENT_INFO.descrinfo.category == '纪录片') {
    TORRENT_INFO.results.category = '纪录片';
  } else if (TORRENT_INFO.tableinfo.subtitle.match('演唱会')) {
    TORRENT_INFO.results.category = '舞台演出';
  } else if (TORRENT_INFO.descrinfo.category == '动画') {
    TORRENT_INFO.results.category = '动画';
  } else if (TORRENT_INFO.descrinfo.category == '综艺') {
    TORRENT_INFO.results.category = '综艺';
  } else if (
    TORRENT_INFO.descrinfo.chapters != '' ||
    TORRENT_INFO.tableinfo.subtitle.match(/短剧/) ||
    TORRENT_INFO.tableinfo.chapter2 != ''
  ) {
    TORRENT_INFO.results.category = '电视剧';
  } else if (TORRENT_INFO.descrinfo.category != '') {
    TORRENT_INFO.results.category = '电影';
  }
  //逻辑：季数
  if (TORRENT_INFO.titleinfo.season != '') {
    if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(1|一)\s?季/)) {
      TORRENT_INFO.results.season = 'S01';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(2|二)\s?季/)) {
      TORRENT_INFO.results.season = 'S02';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(3|三)\s?季/)) {
      TORRENT_INFO.results.season = 'S03';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(4|四)\s?季/)) {
      TORRENT_INFO.results.season = 'S04';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(5|五)\s?季/)) {
      TORRENT_INFO.results.season = 'S05';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(6|六)\s?季/)) {
      TORRENT_INFO.results.season = 'S06';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(7|七)\s?季/)) {
      TORRENT_INFO.results.season = 'S07';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(8|八)\s?季/)) {
      TORRENT_INFO.results.season = 'S08';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(9|九)\s?季/)) {
      TORRENT_INFO.results.season = 'S09';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(10|十)\s?季/)) {
      TORRENT_INFO.results.season = 'S10';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(11|十一)\s?季/)) {
      TORRENT_INFO.results.season = 'S11';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(12|十二)\s?季/)) {
      TORRENT_INFO.results.season = 'S12';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(13|十三)\s?季/)) {
      TORRENT_INFO.results.season = 'S13';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(14|十四)\s?季/)) {
      TORRENT_INFO.results.season = 'S14';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(15|十五)\s?季/)) {
      TORRENT_INFO.results.season = 'S15';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(16|十六)\s?季/)) {
      TORRENT_INFO.results.season = 'S16';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(17|十七)\s?季/)) {
      TORRENT_INFO.results.season = 'S17';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(18|十八)\s?季/)) {
      TORRENT_INFO.results.season = 'S18';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(19|十九)\s?季/)) {
      TORRENT_INFO.results.season = 'S19';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(20|二十)\s?季/)) {
      TORRENT_INFO.results.season = 'S20';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(21|二十一)\s?季/)) {
      TORRENT_INFO.results.season = 'S21';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(22|二十二)\s?季/)) {
      TORRENT_INFO.results.season = 'S22';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(23|二十三)\s?季/)) {
      TORRENT_INFO.results.season = 'S23';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(24|二十四)\s?季/)) {
      TORRENT_INFO.results.season = 'S24';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(25|二十五)\s?季/)) {
      TORRENT_INFO.results.season = 'S25';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(26|二十六)\s?季/)) {
      TORRENT_INFO.results.season = 'S26';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(27|二十七)\s?季/)) {
      TORRENT_INFO.results.season = 'S27';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(28|二十八)\s?季/)) {
      TORRENT_INFO.results.season = 'S28';
    } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(29|二十九)\s?季/)) {
      TORRENT_INFO.results.season = 'S29';
    } else {
      TORRENT_INFO.results.season = 'S01';
    }
  }
  //逻辑：文件
  var filelist;
  jQuery.ajax({
    async: false,
    type: 'get',
    url: window.location.href.replace('details', 'viewfilelist'),
    datatype: 'json',
    success: function (data) {
      filelist = data;
    },
  });
  let filelistArr = filelist.split('<tr>');
  TORRENT_INFO.results.files = filelistArr.length - 2;
  let errorFileNum = 0;
  let fileTypes = [];
  if (TORRENT_INFO.results.zhiliang.match(/(BD|UHD)/)) {
    for (let i = 2; i < filelistArr.length; i++) {
      let fileTemp = filelistArr[i];
      let num1 = fileTemp.indexOf('>');
      fileTemp = fileTemp.slice(num1 + 1);
      let num2 = fileTemp.indexOf('</');
      fileTemp = fileTemp.slice(0, num2);
      let fileLastDotNum = fileTemp.lastIndexOf('.');
      let fileType = fileTemp.slice(fileLastDotNum);
      if (
        filelistArr[i].match(
          /\/dbmv\/stream|\/dbmv\/clipinf|\/dbmv\/playlist|\/bdmv\/backup\/clipinf|\/bdmv\/backup\/playlist/gi
        )
      ) {
        if (fileType.match(/\.clpi|\.mpls|\.m2ts/gi)) {
        } else {
          errorFileNum += 1;
          fileTypes.push(fileType);
        }
      }
    }
  } else if (TORRENT_INFO.results.zhiliang == 'DVD') {
    for (let i = 2; i < filelistArr.length; i++) {
      let num1 = filelistArr[i].indexOf('>');
      filelistArr[i] = filelistArr[i].slice(num1 + 1);
      let num2 = filelistArr[i].indexOf('</');
      filelistArr[i] = filelistArr[i].slice(0, num2);
      let fileLastDotNum = filelistArr[i].lastIndexOf('.');
      let fileType = filelistArr[i].slice(fileLastDotNum);
      if (fileType.match(/\.vob|\.iso|\.ifo|\.bup/gi)) {
      } else {
        errorFileNum += 1;
        fileTypes.push(fileType);
      }
    }
  } else {
    for (let i = 2; i < filelistArr.length; i++) {
      let num1 = filelistArr[i].indexOf('>');
      filelistArr[i] = filelistArr[i].slice(num1 + 1);
      let num2 = filelistArr[i].indexOf('</');
      filelistArr[i] = filelistArr[i].slice(0, num2);
      let fileLastDotNum = filelistArr[i].lastIndexOf('.');
      let fileType = filelistArr[i].slice(fileLastDotNum);
      if (fileType.match(/\.mkv|\.mp4|\.vob|\.m2ts|\.ts|\.avi|\.mov/gi)) {
      } else {
        errorFileNum += 1;
        fileTypes.push(fileType);
      }
    }
  }
  //逻辑：集数
  if (TORRENT_INFO.tableinfo.chapter2 == '') {
    TORRENT_INFO.results.chapter2 = TORRENT_INFO.descrinfo.chapters;
  } else {
    TORRENT_INFO.results.chapter1 = TORRENT_INFO.tableinfo.chapter1;
    TORRENT_INFO.results.chapter2 = TORRENT_INFO.tableinfo.chapter2;
  }

  //页面提醒
  span_correct = '<br><span>' + TORRENT_INFO.results.title + '</span>';
  span_correct = span_correct.replace('##Logo##', TORRENT_INFO.titleinfo.logo);
  //预处理
  span_correct = span_correct
    .replace(/HQ/i, '<span style="color: white">HQ</span>')
    .replace(/EDR/i, '<span style="color: white">EDR</span>');
  match = span_correct.match(/[2-9]?Audios?/i);
  if (match) {
    span_correct = span_correct.replace(
      /[2-9]?Audios?/i,
      `<span style="color: white">${match[0]}</span>`
    );
  }
  //判断：类型
  if (
    TORRENT_INFO.tableinfo.category.match(TORRENT_INFO.results.category) &&
    TORRENT_INFO.results.category != ''
  ) {
    torrentResultDiv.innerHTML += '<span>必有 1：类型选择正确</span><br>';
  } else if (TORRENT_INFO.results.category == '') {
    torrentResultDiv.innerHTML += '<span style="color: orange">必有 1：类型未判断</span><br>';
  } else {
    torrentResultDiv.innerHTML += `<span style="color: red">必有 1：类型选择错误，类型应为 ${TORRENT_INFO.results.category}</span><br>`;
  }
  //判断：质量
  if (
    TORRENT_INFO.tableinfo.zhiliang.match(TORRENT_INFO.results.zhiliang) &&
    TORRENT_INFO.results.zhiliang != ''
  ) {
    torrentResultDiv.innerHTML += '<span>必有 2：质量选择正确</span><br>';
  } else if (TORRENT_INFO.results.zhiliang == '') {
    torrentResultDiv.innerHTML += '<span style="color: orange">必有 2：质量未判断</span><br>';
  } else {
    torrentResultDiv.innerHTML += `<span style="color: red">必有 2：质量选择错误，应为 ${TORRENT_INFO.results.zhiliang}</span><br>`;
  }
  //判断：地区
  if (
    TORRENT_INFO.tableinfo.area.match(/大陆/) &&
    TORRENT_INFO.descrinfo.area.match(/(大陆|中国)/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为中国大陆</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/香港/) &&
    TORRENT_INFO.descrinfo.area.match(/香港/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为香港</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/台湾/) &&
    TORRENT_INFO.descrinfo.area.match(/台湾/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为台湾</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/欧美/) &&
    TORRENT_INFO.descrinfo.area.match(
      /(英国|美国|法国|西班牙|德国|俄罗斯|意大利|加拿大|墨西哥|瑞典|加拿大|澳大利亚)/
    )
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为欧美</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/日本/) &&
    TORRENT_INFO.descrinfo.area.match(/日本/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为日本</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/韩国/) &&
    TORRENT_INFO.descrinfo.area.match(/韩国/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为韩国</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/印度/) &&
    TORRENT_INFO.descrinfo.area.match(/印度/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为印度</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.area.match(/其他/) &&
    TORRENT_INFO.descrinfo.area.match(/泰国/)
  ) {
    torrentResultDiv.innerHTML += '<span>必有 3：地区一致，为印度</span><br>';
  } else if (TORRENT_INFO.descrinfo.area != '') {
    torrentResultDiv.innerHTML += `<span style="color: red">必有 3：地区不一致，应为 ${TORRENT_INFO.descrinfo.area}</span><br>`;
  } else {
    torrentResultDiv.innerHTML += '<span style="color: orange">必有 3：地区未判断</span><br>';
  }
  //判断：显著错误
  if (
    TORRENT_INFO.titleinfo.origin
      .replace(TORRENT_INFO.titleinfo.group, '')
      .match(/(BDRip|BDMV|[^\x00-\xff])/i)
  ) {
    console.log(
      TORRENT_INFO.titleinfo.origin
        .replace(TORRENT_INFO.titleinfo.group, '')
        .match(/(BDRip|BDMV|[^\x00-\xff])/i)
    );
    torrentResultDiv.innerHTML += '<span style="color: red">如有：命名规范（BDRip、BDMV、特殊字符）</span><br>';
  } else if (TORRENT_INFO.results.title.match(/\./)) {
    torrentResultDiv.innerHTML += '<span style="color: red">如有：标题中有多余的点需要删除</span><br>';
  } else if (TORRENT_INFO.results.title.match(/2.05.1/)) {
    torrentResultDiv.innerHTML += '<span style="color: red">如有：音频通道错误</span><br>';
  } else if (
    TORRENT_INFO.titleinfo.format == 'TrueHD' &&
    TORRENT_INFO.titleinfo.channels != '7.1' &&
    TORRENT_INFO.titleinfo.aobject == 'Atmos'
  ) {
    torrentResultDiv.innerHTML += '<span style="color: red">如有：音频对象错误</span><br>';
  }
  //判断：MediaInfo 检查
  if (TORRENT_INFO.mediainfo.full == '' && TORRENT_INFO.bdinfo.full == '') {
    //MediaInfo、BDInfo 都为空
    span_correct = span_correct.replace('##Resolution##', TORRENT_INFO.titleinfo.resolution);
    span_correct = span_correct.replace('##Vcodec##', TORRENT_INFO.titleinfo.vcodec);
    span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
    span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
    span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
    span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);
    span_correct = '<br><span style="color: red">缺少 MediaInfo 或 BDInfo</span>';
  } else if (TORRENT_INFO.mediainfo.full != '') {
    //判断：分辨率
    if (TORRENT_INFO.titleinfo.resolution == TORRENT_INFO.results.resolution) {
      span_correct = span_correct.replace(
        '##Resolution##',
        `<span style="color: #00FF00">${TORRENT_INFO.results.resolution}</span>`
      );
    } else if (TORRENT_INFO.results.resolution == '') {
      span_correct = span_correct.replace(
        '##Resolution##',
        `<span style="color: orange">${TORRENT_INFO.titleinfo.resolution}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Resolution##',
        `<span style="color: red">${TORRENT_INFO.results.resolution}</span>`
      );
    }
    //判断：视频编码
    if (TORRENT_INFO.titleinfo.vcodec == TORRENT_INFO.results.vcodec) {
      span_correct = span_correct.replace(
        '##Vcodec##',
        `<span style="color: #00FF00">${TORRENT_INFO.results.vcodec}</span>`
      );
    } else if (TORRENT_INFO.titleinfo.vcodec.match(/(H.?264|H.?265)/i)) {
      match = TORRENT_INFO.titleinfo.vcodec.match(/(H.?264|H.?265)/i)[0];
      if (match.replace('.', '') == TORRENT_INFO.results.vcodec) {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.vcodec}</span>`
        );
      } else if (match.replace(' ', '') == TORRENT_INFO.results.vcodec) {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`
        );
      } else if (TORRENT_INFO.results.vcodec == '') {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: orange">${TORRENT_INFO.titleinfo.vcodec}</span>`
        );
      } else {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`
        );
      }
    } else if (TORRENT_INFO.results.vcodec == 'MPEG-2') {
      if (TORRENT_INFO.titleinfo.vcodec.match(/MPEG-?2/i)) {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.vcodec}</span>`
        );
      } else {
        span_correct = span_correct.replace(
          '##Vcodec##',
          `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`
        );
      }
    } else if (TORRENT_INFO.results.zhiliang == '' || TORRENT_INFO.mediainfo.video.format == '') {
      span_correct = span_correct.replace(
        '##Vcodec##',
        `<span style="color: orange">${TORRENT_INFO.titleinfo.vcodec}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Vcodec##',
        `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`
      );
    }
    //判断：音频编码
    if (Object.keys(TORRENT_INFO.mediainfo.audios).length == 1) {
      //对象
      if (
        TORRENT_INFO.mediainfo.audios.audio1.object.match(TORRENT_INFO.titleinfo.aobject) &&
        TORRENT_INFO.titleinfo.aobject != ''
      ) {
        span_correct = span_correct.replace(
          '##Atmos##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`
        );
      } else if (
        TORRENT_INFO.mediainfo.audios.audio1.object == 'Atmos' &&
        TORRENT_INFO.titleinfo.aobject == ''
      ) {
        span_correct = span_correct
          .replace('##Acodec##', '##Acodec## ##Atmos## ')
          .replace('##Atmos##', '<span style="color: red">Atmos</span>');
      } else {
        span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
      }
      //编码
      if (
        TORRENT_INFO.mediainfo.audios.audio1.format ==
        TORRENT_INFO.titleinfo.acodec.replace('EAC3', 'DDP').replace('DD+', 'DDP')
      ) {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`
        );
      } else if (
        TORRENT_INFO.mediainfo.audios.audio1.format ==
        TORRENT_INFO.titleinfo.acodec.replace(/AC-?3/i, 'DD')
      ) {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`
        );
      } else if (TORRENT_INFO.mediainfo.audios.audio1.format != '') {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: red">${TORRENT_INFO.mediainfo.audios.audio1.format}</span>`
        );
      } else {
        span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
      }
      //通道
      if (TORRENT_INFO.mediainfo.audios.audio1.channels == TORRENT_INFO.titleinfo.channels) {
        span_correct = span_correct.replace(
          '##Channels##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.channels}</span>`
        );
      } else if (TORRENT_INFO.titleinfo.channels != '') {
        span_correct = span_correct.replace(
          '##Channels##',
          `<span style="color: red">${TORRENT_INFO.mediainfo.audios.audio1.channels}</span>`
        );
      }
    } else {
      console.log(Object.keys(TORRENT_INFO.mediainfo.audios).length);
      span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
      span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
      span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
    }
    span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);

    span_correct = span_correct + TORRENT_INFO.titleinfo.freeinfo;
  } else if (TORRENT_INFO.bdinfo.full != '') {
    //判断：分辨率
    if (TORRENT_INFO.titleinfo.resolution == TORRENT_INFO.results.resolution) {
      span_correct = span_correct.replace(
        '##Resolution##',
        `<span style="color: #00FF00">${TORRENT_INFO.results.resolution}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Resolution##',
        `<span style="color: red">${TORRENT_INFO.results.resolution}</span>`
      );
    }
    //判断：视频编码
    if (TORRENT_INFO.titleinfo.vcodec == TORRENT_INFO.results.vcodec) {
      span_correct = span_correct.replace(
        '##Vcodec##',
        `<span style="color: #00FF00">${TORRENT_INFO.results.vcodec}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Vcodec##',
        `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`
      );
    }
    //判断：音频编码
    console.log(Object.keys(TORRENT_INFO.bdinfo.audios).length);
    if (Object.keys(TORRENT_INFO.bdinfo.audios).length == 1) {
      if (
        TORRENT_INFO.bdinfo.audios.audio1.object.match(TORRENT_INFO.titleinfo.aobject) &&
        TORRENT_INFO.titleinfo.aobject != ''
      ) {
        span_correct = span_correct.replace(
          '##Atmos##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`
        );
      } else if (
        TORRENT_INFO.bdinfo.audios.audio1.object.match(TORRENT_INFO.titleinfo.aobject) &&
        TORRENT_INFO.titleinfo.aobject == ''
      ) {
        span_correct = span_correct
          .replace('##Acodec##', '##Acodec## ##Atmos##')
          .replace(
            '##Atmos##',
            `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`
          );
      } else {
        span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
      }
      if (
        TORRENT_INFO.bdinfo.audios.audio1.format ==
        TORRENT_INFO.titleinfo.acodec.replace('EAC3', 'DDP').replace('DD+', 'DDP')
      ) {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`
        );
      } else if (
        TORRENT_INFO.bdinfo.audios.audio1.format ==
        TORRENT_INFO.titleinfo.acodec.replace('AC3', 'DD')
      ) {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`
        );
      } else if (TORRENT_INFO.bdinfo.audios.audio1.format != '') {
        span_correct = span_correct.replace(
          '##Acodec##',
          `<span style="color: red">${TORRENT_INFO.bdinfo.audios.audio1.format}</span>`
        );
      } else {
        span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
      }
      if (TORRENT_INFO.bdinfo.audios.audio1.channels == TORRENT_INFO.titleinfo.channels) {
        span_correct = span_correct.replace(
          '##Channels##',
          `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.channels}</span>`
        );
      } else if (TORRENT_INFO.titleinfo.channels != '') {
        span_correct = span_correct.replace(
          '##Channels##',
          `<span style="color: red">${TORRENT_INFO.bdinfo.audios.audio1.channels}</span>`
        );
      }
    } else {
      span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
      span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
      span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
    }
    span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);

    span_correct = span_correct + TORRENT_INFO.titleinfo.freeinfo;
  }
  //判断 DVD 制式
  if (
    TORRENT_INFO.mediainfo.standard == TORRENT_INFO.titleinfo.standard &&
    TORRENT_INFO.mediainfo.standard != ''
  ) {
    span_correct = span_correct.replace(
      '##Standard##',
      `<span style="color: #00FF00">${TORRENT_INFO.mediainfo.standard}</span>`
    );
  } else {
    span_correct = span_correct.replace(
      '##Standard##',
      `<span style="color: red">${TORRENT_INFO.mediainfo.standard}</span>`
    );
  }
  //判断：标题片名
  match = TORRENT_INFO.descrinfo.moviename
    .replace(/\+/g, '@@')
    .toLowerCase()
    .match(TORRENT_INFO.titleinfo.name.replace(/\+/g, '@@').toLowerCase());
  if (match && TORRENT_INFO.titleinfo.name.toLowerCase() != '') {
    span_correct = span_correct.replace(
      '##Name##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.name}</span>`
    );
  } else if (TORRENT_INFO.titleinfo.name.toLowerCase() != '') {
    span_correct = span_correct.replace(
      '##Name##',
      `<span style="color: orange">${TORRENT_INFO.titleinfo.name}</span>`
    );
  } else {
    span_correct = span_correct.replace('##Name##', '');
    torrentResultDiv.innerHTML += '<span style="color: red">如有：主标题不符合命名规范</span><br>';
  }
  //判断：标题年份
  if (TORRENT_INFO.results.category == '电影' && TORRENT_INFO.titleinfo.year == '') {
    torrentResultDiv.innerHTML += '<span style="color: red">如有：标题缺少年份</span><br>';
  } else if (
    TORRENT_INFO.titleinfo.year == TORRENT_INFO.descrinfo.publishdate &&
    TORRENT_INFO.descrinfo.publishdate != ''
  ) {
    span_correct = span_correct.replace(
      '##Year##',
      `<span style="color: #00FF00">${TORRENT_INFO.descrinfo.publishdate}</span>`
    );
  } else if (TORRENT_INFO.descrinfo.publishdate == '') {
    span_correct = span_correct.replace(
      '##Year##',
      `<span style="color: orange">${TORRENT_INFO.titleinfo.year}</span>`
    );
  } else {
    span_correct = span_correct.replace(
      '##Year##',
      `<span style="color: red">${TORRENT_INFO.descrinfo.publishdate}</span>`
    );
  }
  //判断：标题季数
  if (TORRENT_INFO.titleinfo.season == TORRENT_INFO.results.season) {
    span_correct = span_correct.replace(
      '##Season##',
      `<span style="color: #00FF00">${TORRENT_INFO.results.season}</span>`
    );
  } else {
    span_correct = span_correct.replace(
      '##Season##',
      `<span style="color: red">${TORRENT_INFO.results.season}</span>`
    );
  }
  //判断：年份季数至少含一个
  if (TORRENT_INFO.titleinfo.year == '' && TORRENT_INFO.titleinfo.season == '') {
    torrentResultDiv.innerHTML += '<span style="color: red">如有：主标题不符合命名规范</span><br>';
  }
  //判断：标题集数
  if (TORRENT_INFO.tableinfo.chapter1 == '-1' && TORRENT_INFO.tableinfo.chapter2 != '') {
    if (
      parseInt(TORRENT_INFO.titleinfo.chapter1) == parseInt(TORRENT_INFO.tableinfo.chapter1) &&
      parseInt(TORRENT_INFO.titleinfo.chapter2) == parseInt(TORRENT_INFO.tableinfo.chapter2)
    ) {
      span_correct = span_correct.replace(
        '##Chapters##',
        `<span style="color: #00FF00">E${TORRENT_INFO.titleinfo.chapter2}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Chapters##',
        `<span style="color: red">E${TORRENT_INFO.results.chapter2}</span>`
      );
    }
  } else if (TORRENT_INFO.tableinfo.chapter1 != '-1' && TORRENT_INFO.tableinfo.chapter1 != '') {
    if (
      parseInt(TORRENT_INFO.titleinfo.chapter1) == parseInt(TORRENT_INFO.tableinfo.chapter1) &&
      parseInt(TORRENT_INFO.titleinfo.chapter2) == parseInt(TORRENT_INFO.tableinfo.chapter2)
    ) {
      span_correct = span_correct.replace(
        '##Chapters##',
        `<span style="color: #00FF00">E${TORRENT_INFO.titleinfo.chapter1}-E${TORRENT_INFO.titleinfo.chapter2}</span>`
      );
    } else {
      span_correct = span_correct.replace(
        '##Chapters##',
        `<span style="color: red">E${TORRENT_INFO.results.chapter1}-E${TORRENT_INFO.results.chapter2}</span>`
      );
    }
  } else {
    span_correct = span_correct.replace('##Chapters##', '');
  }
  //判断：标题媒介
  if (TORRENT_INFO.results.zhiliang == TORRENT_INFO.results.source) {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'DVDRip') {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (
    (TORRENT_INFO.results.zhiliang == 'BD' ||
      TORRENT_INFO.results.zhiliang == 'UHD' ||
      TORRENT_INFO.results.zhiliang == 'REMUX' ||
      TORRENT_INFO.results.zhiliang == 'Encode') &&
    TORRENT_INFO.results.source == 'Blu-ray'
  ) {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (
    TORRENT_INFO.results.zhiliang == 'Encode' &&
    TORRENT_INFO.results.source == 'HDTVRip'
  ) {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'WEBRip') {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (
    TORRENT_INFO.results.zhiliang == 'Encode' &&
    TORRENT_INFO.results.source == 'WEB-DL' &&
    TORRENT_INFO.titleinfo.group.match(/FRDS/)
  ) {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`
    );
  } else if (TORRENT_INFO.results.zhiliang == '') {
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: orange">${TORRENT_INFO.results.source}</span>`
    );
  } else {
    console.log(TORRENT_INFO.titleinfo.group.match(/FRDS/));
    span_correct = span_correct.replace(
      '##Source##',
      `<span style="color: red">${TORRENT_INFO.results.source}</span>`
    );
  }
  //判断：标题 REMUX
  if (TORRENT_INFO.results.source == 'Blu-ray' && TORRENT_INFO.results.zhiliang == 'REMUX') {
    span_correct = span_correct.replace('##REMUX##', '<span style="color: #00FF00">REMUX</span>');
  } else {
    span_correct = span_correct.replace('##REMUX##', 'REMUX');
  }
  //判断：标题 FPS
  match = TORRENT_INFO.titleinfo.fps.toLowerCase();
  if (TORRENT_INFO.mediainfo.video.fps.toLowerCase() == match) {
    span_correct = span_correct.replace(
      '##FPS##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.fps}</span>`
    );
  } else {
    span_correct = span_correct.replace(
      '##FPS##',
      `<span style="color: red">${TORRENT_INFO.mediainfo.video.fps}</span>`
    );
  }
  //判断：HDR
  if (TORRENT_INFO.titleinfo.hdr != '') {
    if (
      TORRENT_INFO.results.hdr.match(
        TORRENT_INFO.titleinfo.hdr.replace('HDR10', 'HDR').replace('P', '+')
      )
    ) {
      span_correct = span_correct.replace(
        '##HDR##',
        `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.hdr}</span>`
      );
    } else if (TORRENT_INFO.results.hdr != 'Unknown') {
      span_correct = span_correct.replace(
        '##HDR##',
        `<span style="color: red">${TORRENT_INFO.results.hdr}</span>`
      );
    } else if (TORRENT_INFO.results.hdr == 'Unknown') {
      span_correct = span_correct.replace(
        '##HDR##',
        `<span style="color: orange">${TORRENT_INFO.titleinfo.hdr}</span>`
      );
    } else {
      span_correct = span_correct.replace('##HDR##', '');
    }
  }
  span_correct = span_correct.replace('##HDR##', '??');
  //判断：DV
  if (
    (TORRENT_INFO.mediainfo.video.dv == true || TORRENT_INFO.bdinfo.video.dv == true) &&
    TORRENT_INFO.titleinfo.dv != ''
  ) {
    span_correct = span_correct.replace(
      '##DoVi##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.dv}</span>`
    );
  } else if (
    (TORRENT_INFO.mediainfo.video.dv == false || TORRENT_INFO.bdinfo.video.dv == false) &&
    TORRENT_INFO.titleinfo.dv != ''
  ) {
    span_correct = span_correct.replace('##DoVi##', '');
  }
  span_correct = span_correct.replace('##DoVi##', '??');
  //判断：10 Bits
  if (
    TORRENT_INFO.titleinfo.bitdepth.match(TORRENT_INFO.mediainfo.video.bitdepth) &&
    TORRENT_INFO.mediainfo.video.bitdepth != ''
  ) {
    span_correct = span_correct.replace(
      '##BitDepth##',
      `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.bitdepth}</span>`
    );
  } else if (TORRENT_INFO.mediainfo.video.bitdepth == '') {
    span_correct = span_correct.replace(
      '##BitDepth##',
      `<span style="color: orange">${TORRENT_INFO.titleinfo.bitdepth}</span>`
    );
  }
  if (
    TORRENT_INFO.mediainfo.hasCantonese == false &&
    TORRENT_INFO.tableinfo.hasTagCantonese == true
  ) {
    torrentResultDiv.innerHTML += '<span style="color: red" id="Cantonese_N">没有 粤语</span><br>';
  } else if (
    TORRENT_INFO.mediainfo.hasCantonese == true &&
    TORRENT_INFO.tableinfo.hasTagCantonese == false
  ) {
    torrentResultDiv.innerHTML += '<span style="color: red" id="Cantonese_Y">缺少 粤语 标签</span><br>';
  }
  if (
    TORRENT_INFO.mediainfo.hasMandarin == false &&
    TORRENT_INFO.tableinfo.hasTagMandarin == true
  ) {
    torrentResultDiv.innerHTML += '<span style="color: red">没有 国语</span><br>';
  } else if (
    TORRENT_INFO.mediainfo.hasMandarin == true &&
    TORRENT_INFO.tableinfo.hasTagMandarin == false
  ) {
    torrentResultDiv.innerHTML += '<span style="color: red">缺少 国语 标签</span><br>';
  }
  //判断：字幕标签
  if (
    Object.keys(TORRENT_INFO.mediainfo.subtitles).length == 0 &&
    TORRENT_INFO.bdinfo.subtitles.length == 0 &&
    TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false &&
    TORRENT_INFO.tableinfo.hasTagEnglishSubtitles == false
  ) {
    //没有考虑解析 Info 获取到了字幕的情况（length = 0）
    torrentResultDiv.innerHTML += '<span style="color: red">检查是否有字幕</span><br>';
  } else {
    if (TORRENT_INFO.results.zhiliang != 'BD' && TORRENT_INFO.results.zhiliang != 'UHD') {
      if (
        (TORRENT_INFO.tableinfo.area.match(/(大陆|台湾|香港)/) ||
          TORRENT_INFO.mediainfo.hasChineseSubtitles == true) &&
        TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false
      ) {
        torrentResultDiv.innerHTML += '<span style="color: red">缺少 中字 标签</span><br>';
      } else if (
        !TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/) &&
        TORRENT_INFO.mediainfo.hasChineseSubtitles == false &&
        TORRENT_INFO.tableinfo.hasTagChineseSubtitles == true
      ) {
        torrentResultDiv.innerHTML += '<span style="color: orange">检查是否有硬中字字幕</span><br>';
      }
    } else {
      if (
        (TORRENT_INFO.mediainfo.hasChineseSubtitles == true ||
          TORRENT_INFO.tableinfo.subtitle.match(/内嵌中字|硬中字/)) &&
        TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false
      ) {
        torrentResultDiv.innerHTML += '<span style="color: red">缺少 中字 标签</span><br>';
      } else if (
        TORRENT_INFO.mediainfo.hasChineseSubtitles == false &&
        TORRENT_INFO.tableinfo.hasTagChineseSubtitles == true
      ) {
        torrentResultDiv.innerHTML += '<span style="color: red">没有 中字</span><br>';
      }
    }
    console.log(!TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/));
    if (
      TORRENT_INFO.mediainfo.hasEnglishSubtitles == false &&
      TORRENT_INFO.tableinfo.hasTagEnglishSubtitles == true
    ) {
      torrentResultDiv.innerHTML += '<span style="color: orange">检查是否有硬英字字幕</span><br>';
    }
  }
  if (TORRENT_INFO.bdinfo.DIY == true && TORRENT_INFO.tableinfo.hasTagDIY == false) {
    torrentResultDiv.innerHTML += '<span style="color: red" id="DIY_Y">缺少 DIY 标签</span><br>';
  } else if (TORRENT_INFO.bdinfo.DIY == false && TORRENT_INFO.tableinfo.hasTagDIY == true) {
    torrentResultDiv.innerHTML += '<span style="color: red" id="DIY_N">非 DIY 原盘</span><br>';
  }
  //判断：IMDb 链接
  if (
    TORRENT_INFO.tableinfo.imdburl == '' &&
    !TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/)
  ) {
    torrentResultDiv.innerHTML += '<br><span style="color: red">IMDb 链接为空</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.imdburl != TORRENT_INFO.descrinfo.imdburl &&
    TORRENT_INFO.descrinfo.imdburl != ''
  ) {
    torrentResultDiv.innerHTML += '<br><span style="color: red">IMDb 链接不一致</span><br>';
  }
  //判断：豆瓣链接
  if (TORRENT_INFO.tableinfo.doubanurl == '') {
    torrentResultDiv.innerHTML += '<br><span style="color: red">豆瓣链接为空</span><br>';
  } else if (
    TORRENT_INFO.tableinfo.doubanurl != TORRENT_INFO.descrinfo.doubanurl &&
    TORRENT_INFO.descrinfo.doubanurl != ''
  ) {
    torrentResultDiv.innerHTML += '<br><span style="color: red">豆瓣链接不一致</span><br>';
  }
  //判断：文件
  if (!TORRENT_INFO.results.zhiliang.match(/(BD|UHD|DVD)/i)) {
    if (TORRENT_INFO.results.chapter2 != '' && TORRENT_INFO.results.chapter1 != '') {
      if (TORRENT_INFO.results.chapter1 != '-1') {
        if (
          TORRENT_INFO.results.files !=
          parseInt(TORRENT_INFO.results.chapter2) - parseInt(TORRENT_INFO.results.chapter1) + 1
        ) {
          table.rows[4].cells[1].innerHTML +=
            '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
          torrentResultDiv.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
          console.log('第一种错误的文件数量');
        }
      } else {
        if (
          (TORRENT_INFO.tableinfo.chapter2 == '' &&
            TORRENT_INFO.results.files != parseInt(TORRENT_INFO.descrinfo.chapters)) ||
          (TORRENT_INFO.tableinfo.chapter2 != '' && TORRENT_INFO.results.files != 1)
        ) {
          table.rows[4].cells[1].innerHTML +=
            '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
          torrentResultDiv.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
        }
      }
    } else if (
      TORRENT_INFO.results.chapter1 == '' &&
      TORRENT_INFO.results.files != parseInt(TORRENT_INFO.results.chapter2)
    ) {
      table.rows[4].cells[1].innerHTML +=
        '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
      torrentResultDiv.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
    }
  }
  if (fileTypes != '') {
    torrentResultDiv.innerHTML += `<span style="color: red">如有：包含多余文件（${fileTypes[0]}）</span>`;
    table.rows[4].cells[1].innerHTML += `<font size="3"><b><span style="color: red">包含多余文件（${fileTypes[0]}）</font></b></font>`;
  }
  //判断：重复
  table = document.getElementById('kothercopy').firstChild;
  if (table.tagName == 'TABLE') {
    let season = false;
    for (let i = 1; i < table.rows.length; i++) {
      if (
        table.rows[i].cells[2].textContent == TORRENT_INFO.tableinfo.size &&
        table.rows[i].cells[1].textContent.match(TORRENT_INFO.titleinfo.group)
      ) {
        table.rows[i].bgColor = '#FFC6B0';
        table.parentNode.parentNode.firstChild.innerHTML +=
          '<span style="color: red">重复！</span>';
      } else if (table.rows[i].cells[2].textContent == TORRENT_INFO.tableinfo.size) {
        table.rows[i].bgColor = '#FFFABE';
        table.parentNode.parentNode.firstChild.innerHTML +=
          '<span style="color: red">可能重复！</span>';
      }
      if (TORRENT_INFO.results.season != '' && TORRENT_INFO.results.season != 'S01' && !season) {
        if (table.rows[i].cells[1].textContent.match('S01')) {
          table.rows[i].bgColor = '#FFFABE';
          table.parentNode.parentNode.firstChild.innerHTML +=
            '<span style="color: red">此种不为第一季但其他列表出现第一季！</span>';
          season = true;
        }
      }
    }
  }
  //判断：BDInfo 码率
  if (TORRENT_INFO.bdinfo.video.bitrates.replace('kbps', '').trim() == '0') {
    torrentResultDiv.innerHTML += '<br><span style="color: red">BDInfo 码率为 0</span><br>';
  }
  //判断：连续多个空格
  if (TORRENT_INFO.titleinfo.origin.match(/\s{2,}/g)) {
    torrentResultDiv.innerHTML += '<br><span>主标题含连续多个空格</span><br>';
  }

  h1.innerHTML += span_correct;
  document.body.appendChild(torrentResultDiv);
  console.log('checked');
})();