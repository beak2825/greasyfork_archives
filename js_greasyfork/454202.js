// ==UserScript==
// @name           Extract Video Info
// @description    extract OTT video info for download script..
// @match *://www.tving.com/*
// @match *://seezntv.com/*
// @match *://dorama.kr/*
// @version 0.0.1.20230218170713
// @namespace https://greasyfork.org/users/976225
// @downloadURL https://update.greasyfork.org/scripts/454202/Extract%20Video%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/454202/Extract%20Video%20Info.meta.js
// ==/UserScript==
 
(function() {
  copyToClipboard = function (val) {
    var t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = val;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
  };
 
  getJson = async function(link, parameter) {
    return new Promise(res => {
      $.ajax({
        type: "GET",
        url: link,
        data: parameter,
        contentType: "application/html",
        dataType: "json",
        success: function(json) {
          res(json);
        },
        error: function(xhr, status, error) {
          res(undefined);
        }
      });
    });
  };
 
  getContents = async function(link) {
    return new Promise(res => {
      $.ajax({
        type: "GET",
        url: link,
        success: function(contents) {
          res(contents);
        },
        error: function(xhr, status, error) {
          res(undefined);
        }
      });
    });
  };
 
  function ToByteArray(hexString) {
    var result = [];
    while (hexString.length >= 2) {
      result.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
    return result;
  }
 
  function GetCookie(key) {
    let cookie = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`);
    return (cookie ? cookie[2] : null);
  }
 
  Common = {
    GetJson: function (url, options = {}) {
      return fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    },
    GetHls: function (url, options = {}) {
      return fetch(url, options)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        return data;
      });
    },
    GetXml: function (url, options = {}) {
      return fetch(url, options)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data, "text/xml");
        return xml;
      });
    },
    Redirection: function (url) {
      return fetch(url, {
        method: 'HEAD',
      })
      .then((response) => {
        return response.url;
      })
      .then((data) => {
        return data;
      });
    },
    FindMpdPssh: function (mpd) {
      let drms = mpd.getElementsByTagName('ContentProtection');
      for (let drm of drms) {
        let lic_url = drm.getAttribute('bc:licenseAcquisitionUrl');
        if (/urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed/i.test(drm.getAttribute('schemeIdUri'))) {
          let psshDom = drm.getElementsByTagName('cenc:pssh');
          if (0 < psshDom.length) {
            return {pssh: psshDom[0].textContent, lic_url: lic_url};
          }
        }
      }
      return "";
    },
    CheckMpdSub: function (mpd) {
      let doms = mpd.getElementsByTagName('Representation');
      for (let dom of doms) {
        switch (dom.getAttribute('mimeType')) {
          case 'application/mp4':
          case 'text/vtt':
            return true;
        }
      }
      return false;
    },
    GetMpdPssh: async (url) => {
      let mpd = await Common.GetXml(url);
      let license = Common.FindMpdPssh(mpd);
      return license.pssh;
    },
    GetHlsPssh: function (data) {
      let keyExp = /#EXT-X-KEY:(.+)/gm;
      let keyMatch = null;
      while (null !== (keyMatch = keyExp.exec(data))) {
        //alert(keyMatch[1]);
 
        let tag = [];
        let tagExp = /([^=,]+)=("[^"]+"|[^=,]+)/g;
        let tagMatch = null;
        while (null !== (tagMatch = tagExp.exec(keyMatch[1]))) {
          tag[tagMatch[1]] = tagMatch[2];
        }
 
        if ('"urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"' == tag["KEYFORMAT"]) {
          return (tag["URI"].match(/,([^"]+)"/) ? RegExp.$1 : '');
        }
      }
      return "";
    },
    Check: function (url, options = {}) {
      return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('');
        }
        return true;
      })
      .catch((error) => {
        return false;
      });
    },
    SafeTitle: function (title) {
      return title.replace(/[\\\/:*?"<>|~,;]/g, "_");
    },
  };
 
  let modules = [
//****** module start!!
 
  DoramaKorea = {
    domains: ["dorama\.kr"],
    GetVideoInfo: function (url, pk) {
      return fetch(url, {
        method: 'GET',
        headers: {
          'Accept': `application/json;pk=${pk}`
        }
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        return data;
      });
    },
    GetPK: function (url) {
      return fetch(url, {
        method: 'GET',
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        if (data.match(/"(BCpk[^"]+)/)) {
          return RegExp.$1;
        }
        return "";
      });
    },
    GetMPD: function (url) {
      return fetch(url, {
        method: 'GET',
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        let parser = new DOMParser();
        let mpd = parser.parseFromString(data, "text/xml");
        return mpd;
      });
    },
    FindJS: function () {
      for (let script of document.scripts) {
        let js = script.getAttribute('src');
        if (/index\.min\.js/.test(js)) {
          return js;
        }
      }
      return null;
    },
    FindVideoId: function () {
      let video = document.getElementsByTagName('video');
      if (0 < video.length) {
        return [video[0].getAttribute('data-account'), video[0].getAttribute('data-video-id')];
      }
      return [null, null];
    },
    GetVideoId: function (contentId) {
      if ('' === contentId) return null;
      return fetch(`https://www.dorama.kr/api/episodes/show?subset=PD&id=${contentId}`, {
        method: 'GET',
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let ids = [];
        if (undefined !== data.video_nosub) {
          ids.push(['nosub', data.video_nosub.bc_id]);
        }
        if (undefined !== data.video_sub) {
          ids.push(['sub', data.video_sub.bc_id]);
        }
        return ids;
      });
    },
    call: async (url) => {
      let jsUrl = DoramaKorea.FindJS();
      if (null === jsUrl) return;
 
      let accountid = (jsUrl.match(/\/(\d+)\//) ? RegExp.$1 : '');
      console.log(accountid);
      if ('' === accountid) return;
 
      let pk = await DoramaKorea.GetPK(jsUrl);
      console.log(pk);
 
      //let [accountid, videoid] = DoramaKorea.FindVideoId();
      //if (null === accountid || null === videoid) return;
 
      let ids = await DoramaKorea.GetVideoId(url.match(/watch\/(\d+)/) ? RegExp.$1 : '');
      if (null === ids) return;
//      ids.then(async (ids) => {
        for (let [type, videoid] of ids) {
          console.log(`account=${accountid}, video=${videoid}`);
 
          let infoUrl = `https://edge.api.brightcove.com/playback/v1/accounts/${accountid}/videos/${videoid}`;
          let videoinfo = await DoramaKorea.GetVideoInfo(infoUrl, pk);
 
          let title = (videoinfo.custom_fields.ep_title || document.getElementsByClassName('info-group')[0].getElementsByClassName('subject')[0].innerText);
          let licenseUrl = '';
          let mpdUrl = '';
          for (let src of videoinfo.sources) {
            if ("application/dash+xml" != src.type) continue;
 
            licenseUrl = src.key_systems['com.widevine.alpha'].license_url;
            mpdUrl = src.src;
            if (/^https/.test(mpdUrl)) break;
          }
          console.log(licenseUrl);
          console.log(mpdUrl);
          title = Common.SafeTitle(title);
          AddCopyResult(`${title}_${type}\n`, `${title}_${type}`, `title_${type}`);
          AddCopyResult(`${mpdUrl}\n`, "mpd", `mpd_${type}`);
          AddCopyResult(`${licenseUrl}\n`, "license", `license_${type}`);
 
          let mpd = await DoramaKorea.GetMPD(mpdUrl);
          let drms = mpd.getElementsByTagName('ContentProtection');
          for (let drm of drms) {
            if ("urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed" == drm.getAttribute('schemeIdUri')) {
              let psshDom = drm.getElementsByTagName('cenc:pssh');
              if (0 < psshDom.length) {
                let pssh = psshDom[0].textContent;
                console.log(pssh);
                AddCopyResult(`${pssh}\n`, "pssh", `pssh_${type}`);
                AddCopyResult(`${mpdUrl}\n${licenseUrl}\n${pssh}\n${title}_${type}\nhigh\n\n`, "all", `all_${type}`);
                break;
              }
            }
          }
        }
//      });
    },
  },
 
  Seezn = {
    domains: ["seezntv"],
    headers: {
      //'Access-Control-Allow-Headers': 'Authentication',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-DEVICE-TYPE': 'PCWEB',
      'X-DEVICE-MODEL': 'Chrome',
      'X-OS-TYPE': 'Windows',
      'X-OS-VERSION': 'NT 10.0',
      'transactionId': '20221023202808571000000000000001',
    },
    GetIDs: async (content_id) => {
      let src = 'https://api.seezntv.com/svc/cmsMenu/record_gw/api/comm/ipgmap/mapping/info/v1';
      let data = {"istest":"0","content_parent_id":"","content_id":content_id};
      let recv = await Common.GetJson(src, {method:'POST', headers:Seezn.headers, body:JSON.stringify(data)});
      return { content_id: recv.content_id,
                    menu_id: recv.menu_id,
                    series_id: recv.series_id };
    },
    GetCocID: async (ids) => {
      let src = `https://api.seezntv.com/svc/cmsMenu/app6/api/vod_detail?content_id=${ids.content_id}&menu_id=${ids.menu_id}&series_id=${ids.series_id}&istest=0&pairing_yn=N&&filter_yn=Y&approach_path=`;
      let recv = await Common.GetJson(src, {headers:Seezn.headers});
      let title = decodeURI(recv.data.series_title).replace(/\+/g, ' ');
      if ('N' == recv.data.movie_yn) {
        title += ` ${decodeURIComponent(recv.data.title).replace(/\+/g, ' ')}`;
        //title += `EP${recv.data.series_no.padStart(2, '0')} ${decodeURIComponent(recv.data.title).replace(/\+/g, ' ')}`;
      }
      return { co_content_id: recv.data.co_content_id,
                    main_menu_id: recv.data.main_menu_id,
                    title: title, caption: recv.data.multi_caption_flag  };
    },
    GetMaster: async (ids) => {
      let uuid = '99185b096a859a37823f50f8e1a988ca000000000000000000000001';
      src = `https://api.seezntv.com/svc/contents/app6/api/play_start_preplay.aspx?uuid=${uuid}&content_id=${ids.content_id}&co_content_id=${ids.co_content_id}&series_id=&co_series_id=&ppm_id=&main_menu_id=${ids.main_menu_id}&menu_id=${ids.menu_id}&approach_path=01&free_pass_id=&screen_kind=PCWEB&jumping_play_yn=&otu_bit_rate=H&otu_bit_rate_option=2000&master_m3u8_yn=N&protocol=https&user_model=Chrome%2F105.0.0.0&user_os=Windows&user_type=PCWEB&user_net=BROADBAND`;
      recv = await Common.GetJson(src, {headers:Seezn.headers});
      let wrapHls = '';
      for (let otu of recv.data.adaptive_url) {
        wrapHls  = otu.otu;
        break;
      }
      if ('' === wrapHls) return '';
 
      let master = await Common.Redirection(wrapHls);
      return master;
    },
    ExtractSubtitle: async (content_id, series_id, menu_id) => {
      let url = `https://api.seezntv.com/svc/cmsMenu/app6/api/vod_series_info?series_id=${series_id}&menu_id=${menu_id}&istest=0&filter_yn=Y`;
      let recv = await Common.GetJson(url, {headers:Seezn.headers});
      //alert(recv);
 
      let contents = [];
      if ('01' == recv.data.series_type) {
        for (let id of recv.data.list_contents) {
          contents.push(id.content_id);
        }
      } else {
        contents.push(content_id);
      }
 
      let allsub = '';
      for (let id of contents) {
        let ids = await Seezn.GetIDs(id);
        ids = Object.assign(ids, await Seezn.GetCocID(ids));
        if ('N' == ids.caption) continue;
        let title = Common.SafeTitle(ids.title);
        let master = await Seezn.GetMaster(ids);
 
        let hlsBase = (master.match(/^(.+\/)[^\/]+$/) ? RegExp.$1 : '');
        let m3u8 = await Common.GetHls(master);
        let subtitle = (m3u8.match(/^#EXT-X-MEDIA:TYPE=SUBTITLES,.+?,LANGUAGE="[kKoO]+",.+?URI="([^"]+)/gm) ? RegExp.$1 : '');
        allsub += `${hlsBase}${subtitle}\n${title}\n`;
      }
      if ('' != allsub)
        AddCopyResult(`${allsub}\n`, '전체 자막 정보 복사', 'allsub');
    },
    call: async (url) => {
      let content_id = (url.match(/content_id=([-\d]+)/) ? RegExp.$1 : '');
      let ids = await Seezn.GetIDs(content_id);
 
      let title = document.getElementsByClassName('season-title')[0].textContent;
      title = Common.SafeTitle(title);
 
      ids = Object.assign(ids, await Seezn.GetCocID(ids));
      let license = `https://api.seezntv.com/svc/widevine/LIC_REQ_PRE?contentId=${ids.content_id}&serviceType=0&drmType=Modular&coContentId=${ids.co_content_id}&deviceType=0&isTest=N`;
 
      let master = await Seezn.GetMaster(ids);
      //alert(master);
      let hlsBase = (master.match(/^(.+\/)[^\/]+$/) ? RegExp.$1 : '');
 
      let m3u8 = await Common.GetHls(master);
      //alert(m3u8);
 
      let playlist = (m3u8.match(/^([^#\s]+)/gm) ? RegExp.$1 : '');
      if ('' !== playlist) {
        m3u8 = await Common.GetHls(`${hlsBase}${playlist}`);
        let pssh = Common.GetHlsPssh(m3u8);
        //alert(pssh);
 
        AddCopyResult(`${title}\n`, `${title}`, `title_high`);
        AddCopyResult(`${master}\n`, "m3u8", `m3u8_high`);
        AddCopyResult(`${license}\n`, "license", `license_high`);
        AddCopyResult(`${pssh}\n`, "pssh", `pssh_high`);
        AddCopyResult(`${master}\n${license}\n${pssh}\n${title}\nhigh\n\n`, "all", `all_high`);
 
        AddCopyResult(`${title}\n`, `${title}_자막용 저화질`, `title_low`);
        AddCopyResult(`${master}\n`, "m3u8", `m3u8_low`);
        AddCopyResult(`${license}\n`, "license", `license_low`);
        AddCopyResult(`${pssh}\n`, "pssh", `pssh_low`);
        AddCopyResult(`${master}\n${license}\n${pssh}\n${title}\nlow\n\n`, "all", `all_low`);
 
        window.ExtractSubtitle = Seezn.ExtractSubtitle;
        let cmd = `javascript:window.ExtractSubtitle(${ids.content_id}, ${ids.series_id}, ${ids.menu_id});`;
        SetResult(`<a href="${cmd}">전체자막 추출</a>`, '', 'right', 'extractsub');
      }
    },
  },
 
  Tving = {
    domains: ["tving"],
    Playlists: [],
    GetDeviceKey: function () {
      let client = new window.ClientJS();
      let lang = client.getLanguage();
      if (lang === 'ko')
        lang = 'ko-KR';
      return client.getCustomFingerprint(client.getOS(), client.getBrowser(), lang, client.getSystemLanguage(), client.getColorDepth(), client.getTimeZone(), client.getDeviceXDPI(), client.getDeviceYDPI(), client.getCanvasPrint());
    },
    GetUniqueId: function () {
      let viewMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let windowName = viewMode === 'popup' ? '' : window.name;
      let playingUnique = windowName || js_cookie_default.a.get('thpa');
      let value = playingUnique || window.sessionStorage.getItem('unique-id');
      if (!value) {
        value = windowName || generateUuid();
        window.sessionStorage.setItem('unique-id', value);
      }
      if (viewMode !== 'popup') {
        window.name = value;
      }
      return value;
    },
    GetUUID: function () {
      return Tving.GetDeviceKey() + '-' + Tving.GetUniqueId();
    },
    GetQuality: function () {
      for (let ul of document.getElementsByTagName('ul')) {
        if ('화질' == ul.parentElement.childNodes[0].textContent) {
          for (let li of ul.childNodes) {
            let cls = li.firstChild.getAttribute('class');
            if (1 == ul.getElementsByClassName(cls).length) {
              return Number(li.firstChild.firstChild.textContent);
            }
          }
        }
      }
      return 0;
    },
    GetQualityList: function (quality, type) {
      let vt = "CPCS0100" === type || "CPCS0300" === type || "CPCS0400" === type;
      return quality.map((function(e) {
        let t = e.code
        , n = (e.name, e.selected)
        , r = e.active
        , i = ""
        , a = "";
        return "stream50" === t && (i = "1080", a = "FHD"),
          "stream40" === t && (i = "720", a = "HD"),
          "stream30" === t && (i = "480", a = "SD"),
          "stream25" === t && (i = "270", a = "MD"),
          "stream20" === t && (i = "360", a = "SD"),
          vt && "stream30" === t && (i = "360", a = "SD"),
          "CSMD0200" === type && ("stream30" === t && (i = "540", a = "SD"),
          "stream25" === t && (i = "480", a = "SD")),
          {
            code: t,
            height: Number(i),
            displaySubName: a,
            isActive: "Y" === r,
            isSelected: "Y" === n
          };
      }));
    },
    GetPlaylist: function (master) {
      let pattern = /#EXT.+?BANDWIDTH=([^,]+).+?,RESOLUTION=([^,]+)[^\s]*\s*([^#\s]+)/gm;
      let matchResult;
      let playlists = [];
      while ((matchResult = pattern.exec(master)) !== null) {
        let bit = matchResult[1];
        let res = matchResult[2];
        let url = matchResult[3];
        Tving.Playlists.push({'bandwidth': bit, 'resolution': res, 'url': url});
      }
    },
    call: async (url) => {
      let api_info = 'https://api.tving.com/v2a/media/stream/info';
      let api_key = '1e7952d0917d6aab1f0293a063697610';
      let c_screen = 'CSSD0100';
      let c_network = 'CSND0900';
      let c_tele = 'CSCD0900';
      let c_os = 'CSOD0900';
      let uuid = Tving.GetUUID();
      let c_media = (url.match(/\/([^\/\?$]+)(?:\?|$)/) ? RegExp.$1 : '');
      if ('' === c_media) return;
      let info_url = `${api_info}?screenCode=${c_screen}&networkCode=${c_network}&osCode=${c_os}&teleCode=${c_tele}&apiKey=${api_key}&mediaCode=${c_media}&uuid=${uuid}&info=Y`;
 
      let recv = await Common.GetJson(info_url, { credentials: 'include'});
 
      let watermark = false;
      if (null !== recv.body.content.info.movie && 'Y' == recv.body.content.info.movie.watermark_flag) {
        AddCopyResult('', '워터마크가 사용된 영상입니다..', 'error');
        watermark = true;
      }
      let token = recv.body.stream.drm_license_assertion;
      let wv_url = `http://cj.drmkeyserver.com/widevine_license?${token}`;
 
      let quality = Tving.GetQualityList(recv.body.stream.quality, recv.body.content.vod_type);
      let height_select = Tving.GetQuality();
      let GetHeight = function(code) {
        for (let q of quality) {
          if (q.code == code) return q.height;
        }
        return 0;
      };
 
      let stream_select = null;
      let prev_url = '';
      let integrated = true;
      for (let stream of recv.body.content.info.stream) {
        if (0 === height_select) {
          if (null === stream_select)
            stream_select = stream;
          else if (GetHeight(stream_select.code) < GetHeight(stream.code))
            stream_select = stream;
        } else {
          if (height_select == GetHeight(stream.code)) {
            stream_select = stream;
            //break;
          }
        }
 
        if ('' === prev_url) prev_url = stream.url;
        else if (prev_url != stream.url) integrated = false;
      }
 
      if (null !== recv.body.content.info.movie && null !== recv.body.content.info.movie.abr_flag)
        integrated = ('Y' == recv.body.content.info.movie.abr_flag);
      let title = `${recv.body.content.program_name}`;
      let mpd = `${stream_select.url.replace(/http:/, 'https:')}`.replace(/\.ctx$/, '.json');
      mpd += `/manifest${(integrated ? '_'+(Math.max(GetHeight(stream_select.code), 360)) : '')}.mpd?content_type=VOD`;
      if ('CSMD0100' == recv.body.content.vod_type) {
        title += ` EP${String(recv.body.content.frequency).padStart(2, '0')} ${recv.body.content.episode_name}`;
      }
      title = Common.SafeTitle(title);
      title = title.replace(/[\s_]/g, '.').replace(/\.+/g, '.');
 
      Tving.Playlists = [];
      let base_hls = '';
      if (mpd.includes('.smi') || mpd.includes('.mp4')) {
        for (let hlsdata of document.getElementsByName('hlsdata')) {
          let data = JSON.parse(hlsdata.getAttribute('data'));
          if (true == /playlist\.m3u8/.test(data.url) && 0 === Tving.Playlists.length) {
            AddCopyResult(`${data.url}\n${title}\n`, '영상 주소 복사', 'copyall');
            base_hls = data.url.replace(/\/[^\/]+$/, '');
            let master_data = await Common.GetHls(data.url);
            Tving.GetPlaylist(master_data);
          } else if (true == /subtitle/.test(data.url)) {
            AddCopyResult(`${data.url}\n${title}\n`, '자막 주소 복사', 'copysub');
          }
        }
 
        if (0 < Tving.Playlists.length) {
          AddCopyResult(``, '해상도별 영상 주소 복사', 'copyres');
          for (let playlist of Tving.Playlists) {
            AddCopyResult(`${base_hls}/${playlist.url}\n${title}\n`, `영상 주소 복사: Resolution ${playlist.resolution}, Bandwidth ${playlist.bandwidth}`, `copy${playlist.bandwidth}`);
          }
        }
        return;
      }
 
      let param1 = '';
      let param2 = '';
      for (let mpddata of document.getElementsByName('mpddata')) {
        let mpd = JSON.parse(mpddata.getAttribute('data'));
        for (let header of mpd.headers) {
          if ('X-TVING-PARAM1' == header.name) {
            param1 = header.value;
          } else if ('X-TVING-PARAM2' == header.name) {
            param2 = header.value;
          }
        }
      }
 
      //let pssh = (watermark ? null : await Common.GetMpdPssh(mpd));
      let mpd_body = await Common.GetXml(mpd, (watermark ? {headers:{'X-Tving-Param1':param1, 'X-Tving-Param2':param2}} : {}));
      let license = Common.FindMpdPssh(mpd_body);
      let pssh = (watermark ? null : license.pssh);
      let has_sub = Common.CheckMpdSub(mpd_body);
 
      AddCopyResult(`${title}\n`, `${title}`, `title`);
      //AddCopyResult(`${mpd}\n`, "mpd", `mpd`);
      //AddCopyResult(`${wv_url}\n`, "license", `license`);
      if (null !== pssh) {
        //AddCopyResult(`${pssh}\n`, "pssh", `pssh`);
        AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}\nhigh\n\n`, "영상 저장", "all");
        if (has_sub) {
          AddCopyResult(`${mpd}\n${title}\n`, "자막 저장", "all_sub");
          AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}\nhigh\n\n${mpd}\n`, "영상+자막 저장", "all_vs");
        }
      } else {
        AddCopyResult(`${mpd}\n${title}\n${wv_url}\nhigh\n${param1}\n${param2}\n`, "영상 저장_drm", "all");
      }
      //console.log(`title : ${title}`);
      //console.log(`mpd : ${mpd}`);
      //console.log(`pssh : ${pssh}`);
      //console.log(`token : ${token}`);
    },
  },
 
  CoupangPlay = {
    domains: ["coupangplay"],
    episodes: [],
    headersAdd: {
//      'x-drm': 'com.widevine.alpha',
      'x-drm': 'com.microsoft.playready',
      'x-force-raw': 'true',
//      'x-platform': 'web',
      'x-profileid': window.localStorage.currentProfile,
      'x-profiletype': 'standard',
//      'x-sessionid': ec53273a-e1b3-4280-8f47-829c11bcc009
    },
    headersDef: {
      'x-app-version': '1.32.4',
      'x-device-id': GetCookie('device_id'),
      'x-device-os-version': '107',
      'x-nr-session-id': GetCookie('session_web_id'),
      'x-pcid': GetCookie('PCID'),
    },
    GenerateRandomValue: function (t) {
      function e() {
        return n ? 15 & n[r++] : 16 * Math.random() | 0;
      }
      let n = null
        , r = 0
        , o = window.crypto || window.msCrypto;
      o && o.getRandomValues && Uint8Array && (n = o.getRandomValues(new Uint8Array(31)));
      for (var i = [], a = 0; a < t; a++)
        i.push(e().toString(16));
      return i.join("");
    },
    GetSpanId: function () {
      return CoupangPlay.GenerateRandomValue(16);
    },
    GetTraceId: function () {
      return CoupangPlay.GenerateRandomValue(32);
    },
    GenerateNewrelic: function(t, e, n, r, o, i) {
      let a = "btoa"in window && "function" == typeof window.btoa;
      if (!a)
        return null;
      let c = {
        v: [0, 1],
        d: {
          ty: "Browser",
          ac: r,
          ap: o,
          id: t,
          tr: e,
          ti: n
        }
      };
      return i && r !== i && (c.d.tk = i), btoa(JSON.stringify(c));
    },
    GetNewrelic: function () {
      let e = window.NREUM;
      if (!e.loader_config)
        return null;
      let n = (e.loader_config.accountID || "").toString() || null
        , r = (e.loader_config.agentID || "").toString() || null
        , f = (e.loader_config.trustKey || "").toString() || null;
      if (!n || !r)
        return null;
      let h = CoupangPlay.GetSpanId()
        , m = CoupangPlay.GetTraceId()
        , v = Date.now();
      return CoupangPlay.GenerateNewrelic(h, m, v, n, r, f);
    },
    Extract: async (content, onlysub = false) => {
      function GetTitle(classname) {
        let doms = document.getElementsByClassName(classname);
        for (let elem of doms) {
          if ('SPAN' == elem.tagName) {
            let title = elem.textContent.replace(/^:/, '');
            return title.trim();
          }
        }
        return '';
      }
 
      let newrelic = CoupangPlay.GetNewrelic();
 
      let title = '';
      if (false == onlysub) {
        let content_url = `https://discover.coupangstreaming.com/v1/discover/titles/${content.id}?platform=WEBCLIENT&locale=ko&filterRestrictedContent=false`;
        let content_info = await Common.GetJson(content_url, {headers:Object.assign(CoupangPlay.headersDef, { 'newrelic': newrelic, })});
 
        title += GetTitle('title');
 
        if (undefined !== content_info.data.season) {
          title += ` S${String(content_info.data.season).padStart(2, '0')}`;
        }
 
        if (undefined !== content_info.data.episode) {
          title += ` EP${String(content_info.data.episode).padStart(2, '0')}`;
        }
        let subtitle = GetTitle('subtitle');
        if ('' !== subtitle) {
          title += ` ${subtitle}`;
        }
        title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      }
 
      let headers = Object.assign(Object.assign(CoupangPlay.headersDef, CoupangPlay.headersAdd), { 'newrelic': newrelic, });
      let api_url = `https://www.coupangplay.com/api/playback/play?titleId=${content.id}&titleType=${content.type.toUpperCase()}`;
      let api_info = await Common.GetJson(api_url, {headers:headers, credentials: 'include'});
      //console.log(api_info);
 
      let sub = '';
      if (undefined !== api_info.data.raw.text_tracks && null !== api_info.data.raw.text_tracks) {
        for (let subs of api_info.data.raw.text_tracks) {
          if ("ko" == subs.srclang) {
            if (onlysub) {
              return `${subs.src}`;
            }
            sub = subs.src;
            AddCopyResult(`${subs.src}\n${title}\n\n`, '자막 저장용 정보 복사', 'allsub');
            break;
          }
        }
      }
 
      if (false == onlysub) {
        for (let src of api_info.data.raw.sources) {
          if ('application/dash+xml' == src.type && /^https/.test(src.src)) {
            let mpd = await Common.GetXml(src.src);
            let license = Common.FindMpdPssh(mpd);
 
            AddCopyResult(`${title}\n`, `${title}`, `title`);
            AddCopyResult(`${src.src}\n`, "mpd", `mpd`);
            AddCopyResult(`${license.lic_url}\n`, "license", `license`);
            AddCopyResult(`${license.pssh}\n`, "pssh", `pssh`);
            AddCopyResult(`${src.src}\n${license.lic_url}\n${license.pssh}\n${title}\nhigh\n\n`, "영상 저장", "all_high");
            if ('' !== sub) {
              AddCopyResult(`${src.src}\n${license.lic_url}\n${license.pssh}\n${title}\nhigh\n\n${sub}\n`, "영상+자막 저장", "all_high");
            }
            break;
          }
        }
      }
 
      return null;
    },
    ProcessEpisode: async (id, season, page, perPage = 50) => {
      let api_url = `https://discover.coupangstreaming.com/v1/discover/titles/${id}?platform=WEBCLIENT&locale=ko`;
      let api_info = await Common.GetJson(api_url);
      let title = api_info.data.title;
 
      api_url = `https://discover.coupangstreaming.com/v1/discover/titles/${id}/episodes?platform=WEBCLIENT&season=${season}&sort=true&locale=ko&page=${page}&perPage=${perPage}`;
      api_info = await Common.GetJson(api_url);
 
      for (let episode of api_info.data) {
        let sub_link = await CoupangPlay.Extract({id: episode.id, type: episode.as}, true);
        if (null !== sub_link) {
          let ep_title = `${title} S${String(season).padStart(2, '0')} EP${String(episode.episode).padStart(2, '0')} ${episode.title}`;
          ep_title = Common.SafeTitle(ep_title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
          CoupangPlay.episodes.push({'title': ep_title, 'link': sub_link});
        }
      }
 
      let allsub = '';
      for (let episode of CoupangPlay.episodes) {
        allsub += `${episode.link}\n${episode.title}\n`;
      }
      let start = (page - 1) * perPage;
      AddCopyResult(`${allsub}\n`, `${start+1}~${start+api_info.data.length}까지의 자막 정보 복사`, `allsub${page}`);
      CoupangPlay.episodes = [];
 
      if (page < api_info.pagination.totalPages) {
        setTimeout(CoupangPlay.ProcessEpisode, 2000, id, season, page+1);
      }/* else {
        let allsub = '';
        for (let episode of CoupangPlay.episodes) {
          allsub += `${episode.link}\n${episode.title}\n`;
        }
        AddCopyResult(`${allsub}\n`, '전체 자막 정보 복사', 'allsub');
      }*/
    },
    call: async (url) => {
      if (/coupangplay.com\/play/.test(url)) {
        let content = (url.match(/\/play\/([^\/]+)\/([^\?]+)/) ? {id: RegExp.$1, type: RegExp.$2} : null);
        if (null === content) return;
        CoupangPlay.Extract(content);
      } else {
        let id = (url.match(/\/titles\/([^\/\?]+)/) ? RegExp.$1 : null);
        if (null === id) return;
 
        CoupangPlay.episodes = [];
        let season = (() => {
          for (let elem of document.getElementsByTagName('li')) {
            if (/TitleTvShowSelector_seasonListItemSelected/.test(elem.getAttribute('class'))) {
              return (elem.textContent.match(/(\d+)/) ? RegExp.$1 : null);
            }
          }
        })();
        console.log(id);
        setTimeout(CoupangPlay.ProcessEpisode, 1, id, season, 1);
        return;
/*
        let allsub = '';
        for (let elem of document.getElementsByTagName('div')) {
          if (/TitleTvShowEpisode_container/.test(elem.getAttribute('class'))) {
            let title = '';
            for (let meta of elem.getElementsByTagName('div')) {
              if (/TitleTvShowEpisode_metadata_/.test(meta.getAttribute('class'))) {
                let ep = (meta.firstElementChild.textContent.match(/(\d+)[\s\.]*(.*)/) ? `EP${String(RegExp.$1).padStart(2, '0')} ${RegExp.$2}` : '');
                console.log(ep);
              }
            }
            for (let link of elem.getElementsByTagName('a')) {
              allsub += await CoupangPlay.Extract(link.href, true);
            }
          }
        }
        AddCopyResult(`${allsub}\n`, '전체 자막 정보 복사', 'allsub');
*/
      }
    },
  },CoupangPlay = {
    domains: ["coupangplay"],
    episodes: [],
    headersAdd: {
//      'x-drm': 'com.widevine.alpha',
      'x-drm': 'com.microsoft.playready',
      'x-force-raw': 'true',
//      'x-platform': 'web',
      'x-profileid': window.localStorage.currentProfile,
      'x-profiletype': 'standard',
//      'x-sessionid': ec53273a-e1b3-4280-8f47-829c11bcc009
    },
    headersDef: {
      'x-app-version': '1.32.4',
      'x-device-id': GetCookie('device_id'),
      'x-device-os-version': '107',
      'x-nr-session-id': GetCookie('session_web_id'),
      'x-pcid': GetCookie('PCID'),
    },
    GenerateRandomValue: function (t) {
      function e() {
        return n ? 15 & n[r++] : 16 * Math.random() | 0;
      }
      let n = null
        , r = 0
        , o = window.crypto || window.msCrypto;
      o && o.getRandomValues && Uint8Array && (n = o.getRandomValues(new Uint8Array(31)));
      for (var i = [], a = 0; a < t; a++)
        i.push(e().toString(16));
      return i.join("");
    },
    GetSpanId: function () {
      return CoupangPlay.GenerateRandomValue(16);
    },
    GetTraceId: function () {
      return CoupangPlay.GenerateRandomValue(32);
    },
    GenerateNewrelic: function(t, e, n, r, o, i) {
      let a = "btoa"in window && "function" == typeof window.btoa;
      if (!a)
        return null;
      let c = {
        v: [0, 1],
        d: {
          ty: "Browser",
          ac: r,
          ap: o,
          id: t,
          tr: e,
          ti: n
        }
      };
      return i && r !== i && (c.d.tk = i), btoa(JSON.stringify(c));
    },
    GetNewrelic: function () {
      let e = window.NREUM;
      if (!e.loader_config)
        return null;
      let n = (e.loader_config.accountID || "").toString() || null
        , r = (e.loader_config.agentID || "").toString() || null
        , f = (e.loader_config.trustKey || "").toString() || null;
      if (!n || !r)
        return null;
      let h = CoupangPlay.GetSpanId()
        , m = CoupangPlay.GetTraceId()
        , v = Date.now();
      return CoupangPlay.GenerateNewrelic(h, m, v, n, r, f);
    },
    Extract: async (content, onlysub = false) => {
      function GetTitle(classname) {
        let doms = document.getElementsByClassName(classname);
        for (let elem of doms) {
          if ('SPAN' == elem.tagName) {
            let title = elem.textContent.replace(/^:/, '');
            return title.trim();
          }
        }
        return '';
      }
 
      let newrelic = CoupangPlay.GetNewrelic();
 
      let title = '';
      if (false == onlysub) {
        let content_url = `https://discover.coupangstreaming.com/v1/discover/titles/${content.id}?platform=WEBCLIENT&locale=ko&filterRestrictedContent=false`;
        let content_info = await Common.GetJson(content_url, {headers:Object.assign(CoupangPlay.headersDef, { 'newrelic': newrelic, })});
 
        title += GetTitle('title');
 
        if (undefined !== content_info.data.season) {
          title += ` S${String(content_info.data.season).padStart(2, '0')}`;
        }
 
        if (undefined !== content_info.data.episode) {
          title += ` EP${String(content_info.data.episode).padStart(2, '0')}`;
        }
        let subtitle = GetTitle('subtitle');
        if ('' !== subtitle) {
          title += ` ${subtitle}`;
        }
        title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      }
 
      let headers = Object.assign(Object.assign(CoupangPlay.headersDef, CoupangPlay.headersAdd), { 'newrelic': newrelic, });
      let api_url = `https://www.coupangplay.com/api/playback/play?titleId=${content.id}&titleType=${content.type.toUpperCase()}`;
      let api_info = await Common.GetJson(api_url, {headers:headers, credentials: 'include'});
      //console.log(api_info);
 
      let sub = '';
      if (undefined !== api_info.data.raw.text_tracks && null !== api_info.data.raw.text_tracks) {
        for (let subs of api_info.data.raw.text_tracks) {
          if ("ko" == subs.srclang) {
            if (onlysub) {
              return `${subs.src}`;
            }
            sub = subs.src;
            AddCopyResult(`${subs.src}\n${title}\n\n`, '자막 저장용 정보 복사', 'allsub');
            break;
          }
        }
      }
 
      if (false == onlysub) {
        for (let src of api_info.data.raw.sources) {
          if ('application/dash+xml' == src.type && /^https/.test(src.src)) {
            let mpd = await Common.GetXml(src.src);
            let license = Common.FindMpdPssh(mpd);
 
            AddCopyResult(`${title}\n`, `${title}`, `title`);
            AddCopyResult(`${src.src}\n`, "mpd", `mpd`);
            AddCopyResult(`${license.lic_url}\n`, "license", `license`);
            AddCopyResult(`${license.pssh}\n`, "pssh", `pssh`);
            AddCopyResult(`${src.src}\n${license.lic_url}\n${license.pssh}\n${title}\nhigh\n\n`, "영상 저장", "all_high");
            if ('' !== sub) {
              AddCopyResult(`${src.src}\n${license.lic_url}\n${license.pssh}\n${title}\nhigh\n\n${sub}\n`, "영상+자막 저장", "all_high");
            }
            break;
          }
        }
      }
 
      return null;
    },
    ProcessEpisode: async (id, season, page, perPage = 50) => {
      let api_url = `https://discover.coupangstreaming.com/v1/discover/titles/${id}?platform=WEBCLIENT&locale=ko`;
      let api_info = await Common.GetJson(api_url);
      let title = api_info.data.title;
 
      api_url = `https://discover.coupangstreaming.com/v1/discover/titles/${id}/episodes?platform=WEBCLIENT&season=${season}&sort=true&locale=ko&page=${page}&perPage=${perPage}`;
      api_info = await Common.GetJson(api_url);
 
      for (let episode of api_info.data) {
        let sub_link = await CoupangPlay.Extract({id: episode.id, type: episode.as}, true);
        if (null !== sub_link) {
          let ep_title = `${title} S${String(season).padStart(2, '0')} EP${String(episode.episode).padStart(2, '0')} ${episode.title}`;
          ep_title = Common.SafeTitle(ep_title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
          CoupangPlay.episodes.push({'title': ep_title, 'link': sub_link});
        }
      }
 
      let allsub = '';
      for (let episode of CoupangPlay.episodes) {
        allsub += `${episode.link}\n${episode.title}\n`;
      }
      let start = (page - 1) * perPage;
      AddCopyResult(`${allsub}\n`, `${start+1}~${start+api_info.data.length}까지의 자막 정보 복사`, `allsub${page}`);
      CoupangPlay.episodes = [];
 
      if (page < api_info.pagination.totalPages) {
        setTimeout(CoupangPlay.ProcessEpisode, 2000, id, season, page+1);
      }/* else {
        let allsub = '';
        for (let episode of CoupangPlay.episodes) {
          allsub += `${episode.link}\n${episode.title}\n`;
        }
        AddCopyResult(`${allsub}\n`, '전체 자막 정보 복사', 'allsub');
      }*/
    },
    call: async (url) => {
      if (/coupangplay.com\/play/.test(url)) {
        let content = (url.match(/\/play\/([^\/]+)\/([^\?]+)/) ? {id: RegExp.$1, type: RegExp.$2} : null);
        if (null === content) return;
        CoupangPlay.Extract(content);
      } else {
        let id = (url.match(/\/titles\/([^\/\?]+)/) ? RegExp.$1 : null);
        if (null === id) return;
 
        CoupangPlay.episodes = [];
        let season = (() => {
          for (let elem of document.getElementsByTagName('li')) {
            if (/TitleTvShowSelector_seasonListItemSelected/.test(elem.getAttribute('class'))) {
              return (elem.textContent.match(/(\d+)/) ? RegExp.$1 : null);
            }
          }
        })();
        console.log(id);
        setTimeout(CoupangPlay.ProcessEpisode, 1, id, season, 1);
        return;
/*
        let allsub = '';
        for (let elem of document.getElementsByTagName('div')) {
          if (/TitleTvShowEpisode_container/.test(elem.getAttribute('class'))) {
            let title = '';
            for (let meta of elem.getElementsByTagName('div')) {
              if (/TitleTvShowEpisode_metadata_/.test(meta.getAttribute('class'))) {
                let ep = (meta.firstElementChild.textContent.match(/(\d+)[\s\.]*(.*)/) ? `EP${String(RegExp.$1).padStart(2, '0')} ${RegExp.$2}` : '');
                console.log(ep);
              }
            }
            for (let link of elem.getElementsByTagName('a')) {
              allsub += await CoupangPlay.Extract(link.href, true);
            }
          }
        }
        AddCopyResult(`${allsub}\n`, '전체 자막 정보 복사', 'allsub');
*/
      }
    },
  },
 
  Serieson = {
    domains: ["serieson"],
    GetOption: function () {
      let oplist = document.getElementsByName('resolution');
      for (let sel of oplist) {
        if (sel.checked) {
          return Number(sel.getAttribute('value'));
        }
      }
      return 0;
    },
    GetMpdUrl: function (recv, option) {
      let select = null;
      for (let mpd of recv.mpdInfos) {
        if ('0' == option) {
          if (null === select || select.height < mpd.height)
            select = mpd;
        } else if (option == mpd.height) {
          select = mpd;
          break;
        }
      }
      return (null !== select ? select.url : '');
    },
    GetAVUrl: function (mpd) {
      let result = {};
      for (let av of mpd.getElementsByTagName('Representation')) {
        let urls = av.getElementsByTagName('BaseURL');
        if (0 < urls.length) {
          let height = av.getAttribute('height');
          if (null !== height && 0 < height) {
            result['video'] = urls[0].textContent;
          } else if (null === height || 0 == height) {
            result['audio'] = urls[0].textContent;
          }
        }
      }
      return result;
    },
    call: async (url) => {
      let apibase = 'https://apis.naver.com/seriesOnWebPlayer/serieson-web';
      let content_id = (url.match(/\/(\d+)(?:$|\?)/) ? RegExp.$1 : '');
 
      let recv = await Common.GetJson(`${apibase}/v2/views/${content_id}?_=${(new Date).getTime()}`,
                                                               { credentials:'include', });
      let cid = recv.result.meta.contentSeq;
      let title = Common.SafeTitle(recv.result.meta.name);
 
      recv = await Common.GetJson(`${apibase}/v1/users/configs?_=${(new Date).getTime()}`,
                                                          { credentials:'include', });
      let did = recv.result.device.encryptedDeviceKey;
 
      recv = await Common.GetJson(`${apibase}/v2/playContexts/views/${content_id}?_=${(new Date).getTime()}`,
                                                          { credentials:'include', });
      let oid = recv.result.rightContext.liquidationSeq;
 
      recv = await Common.GetJson(`${apibase}/getPlayListUrl?cid=${cid}&deviceId=${did}&deviceType=WEB&drmType=WIDEVINE&oid=${oid}`,
                                                          { credentials:'include', });
      let pl = recv.pl;
      let resolution = Serieson.GetOption();
      let mpd_url = Serieson.GetMpdUrl(recv, resolution);
 
 
      mpd = await Common.GetXml(mpd_url, { credentials:'include', });
      let license = Common.FindMpdPssh(mpd);
      let av_url = Serieson.GetAVUrl(mpd);
      //alert(`pssh:${license.pssh},\nurl:${license.lic_url}`);
 
      recv = await Common.GetJson(`${apibase}/getLicenseUrl?drmType=WIDEVINE&pl=${pl}`,
                                                          { credentials:'include', });
      let lic_url = recv.licenseUrl;
 
      if (false == await Common.Check(av_url.video, {method:'HEAD', credentials: 'include'})) {
        av_url.video = mpd_url;
      }
      AddCopyResult(`${title}\n`, `${title}`, `title`);
      AddCopyResult(`${av_url.video}^${av_url.audio}\n`, "mpd", `mpd`);
      AddCopyResult(`${lic_url}\n`, "license", `license`);
      AddCopyResult(`${license.pssh}\n`, "pssh", `pssh`);
      AddCopyResult(`${av_url.video}^${av_url.audio}\n${lic_url}\n${license.pssh}\n${title}\nhigh\n`, "all_선택된 화질_쿠키 수동 복사", "all_high");
    },
  },
 
  Jbox = {
    domains: ["jbox\.co\.kr"],
    call: async (url) => {
      let id = (url.match(/detail\/(\d+)/) ? RegExp.$1 : '');
      let api = `https://www.jbox.co.kr/v3/content/content-buy-json?ContentId=${id}&UseType=STRM&ServerRole=PC_GSTRM1&FileType=HD`;
      let recv = await Common.GetJson(api);
      let stream = recv.StreamingUrl;
      if (null === stream) return;
 
      let info = document.getElementsByClassName('info_txt');
      let title = (info.length > 0 ? info[0].firstElementChild.textContent : '');
      info = document.getElementsByClassName('info_title');
      title += (info.length > 0 ? ` ${info[0].textContent}` : '');
      title = Common.SafeTitle(title);
      SetResult(`<a href="${stream}" download="${title}.mp4">${title}</a>`, "", "right", "mp4");
     },
  },
 
 DisneyPlus = {
    domains: ["disneyplus"],
    call: async (url) => {
      let token = '';
      for (let i = 0; i < localStorage.length; ++i) {
        let k = localStorage.key(i);
        if (/__bam_sdk_access--disney-svod/.test(k)) {
          let ls = JSON.parse(localStorage.getItem(k));
          token = ls.context.token;
        }
      }
 
      let title = `${document.getElementsByClassName('title-field')[0].textContent}.${document.getElementsByClassName('subtitle-field')[0].textContent}`;
      title = Common.SafeTitle(title);
      for (let hlsdata of document.getElementsByName('hlsdata')) {
        let data = JSON.parse(hlsdata.getAttribute('data'));
        if (false == /dssott\.com\/int\//.test(data.url)) {
          let m3u8 = await Common.GetHls(data.url);
          let pssh = Common.GetHlsPssh(m3u8);
          if ('' != pssh) {
            let lic = 'https://disney.playback.edge.bamgrid.com/widevine/v1/obtain-license';
            console.log(pssh);
            AddCopyResult(`${data.url}\n${lic}\n${pssh}\n${title}\nhigh\n${token}\n`, '영상 추출 정보 복사', 'copyall');
            break;
          }
        }
      }
    },
  },
  
//****** module end!!
  ];
 
  function start() {
    if(typeof(jQuery) == 'undefined') {
      let jquery = document.createElement('script');
      jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
      document.body.appendChild(jquery);
      setTimeout(start, 100);
      return;
    }
 
    let domain = window.location.host;
    let url = document.location.href;
 
    for(let module of modules) {
      if (module.domains.some(t => domain.match(t))) {
        module.call(url);
        break;
      }
    }
  }
 
  function ShowResult(results, color) {
    var status;
    var extractLink;
    if(color === "")
      color = "white";
    if (results.length === 0) {
      status = "Parse error...";
      extractLink = "Not found...";
    } else {
      status = results[0];
      extractLink = results[1];
    }
    var trends_dom = document.createElement('div');
    var title_dom = document.createElement('strong');
    title_dom.innerHTML = [
      '<div style="display: block; text-align:center; width: 100%; height:23px; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
      '<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: pink;">' + status + '</div>',
      '<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + ';"><a href="' + extractLink + '">' + extractLink + '</div>',
      '</div>'
    ].join(' ');
 
    trends_dom.appendChild(title_dom);
    trends_dom.style.cssText = [
      'background-color: transparent',
      'background-image: -webkit-repeating-linear-gradient(' +
      '45deg, transparent, transparent 35px,' +
      'rgba(245,213,213,.1) 20px, rgba(245,213,213,.1) 70px);',
      'color: #000;',
      'padding: 0px;',
      'position: fixed;',
      'z-index:1000;',
      'width:100%;',
      'height:24px;',
      'vertical-align: middle;',
    ].join(' ');
    //document.body.style.cssText = 'position: relative; margin-top: 45px';
    document.body.parentElement.insertBefore(trends_dom, document.body);
  }
 
  function CreateTable(col, row, color = "") {
    if (color === "")
      color = "white";
 
    var row_dom = document.createElement('div');
    row_dom.setAttribute('id', row);
    row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo;padding:5px 0px; cursor: text !important;');
    row_dom.setAttribute('onclick', 'copyToClipboard(this.getAttribute("value"));');
 
    var col_dom = document.getElementById(col);
    if(col_dom === null) {
      col_dom = document.createElement('div');
      col_dom.setAttribute('id', col);
      col_dom.setAttribute('style', 'display:table-cell;padding:0px 10px 0px 10px; vertical-align:middle;');
 
      var table_dom = document.getElementById('resulttable');
      if(table_dom === null)
        CreateLayout();
      table_dom = document.getElementById('resulttable');
      if(table_dom !== null)
        table_dom.appendChild(col_dom);
    }
 
    col_dom.appendChild(row_dom);
  }
 
  function CreateLayout(color) {
    var trends_dom = document.getElementById('extractresult');
    if (trends_dom !== null)
      trends_dom.outerHTML = "";
    trends_dom = document.createElement('div');
    trends_dom.setAttribute('id', 'extractresult');
    var title_dom = document.createElement('strong');
    title_dom.innerHTML = [
      '<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div id="resulttable" style="display: inline-table;">',
      '</div></div>'
    ].join(' ');
 
    trends_dom.appendChild(title_dom);
    trends_dom.style.cssText = [
      'background: rgba(55, 55, 55, 0.5);',
      'color: #fff;',
      'padding: 0px;',
      'position: fixed;',
      'z-index:102400;',
      'width:100%;',
      'font: 12px Meiryo;',
      'vertical-align: middle;',
    ].join(' ');
    //document.body.style.cssText = 'position: relative; margin-top: 0px';
    document.body.insertBefore(trends_dom, document.body.firstElementChild);
  }
 
  function SetResult(name, value, col_id, row_id, color = "") {
    var elem = document.getElementById(row_id);
    if (elem === null)
      CreateTable(col_id, row_id, color);
 
    elem = document.getElementById(row_id);
    if (elem !== null) {
      elem.setAttribute('value', value);
      elem.innerHTML = name;
    }
  }
 
  function AddDownResult(url, name, title) {
    if("" === name) {
      SetResult(`<a href="${url}">${url}</a>`, "", "right", title);
    } else {
      SetResult(`<a href="${url}" download="${name}">${url}</a>`, "", "right", title);
    }
  }
 
  function AddCopyResult(url, name, title) {
    SetResult(name, url, "right", title);
  }
 
//// detect page change
  (function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
      if (typeof history.onpushstate == "function") {
        history.onpushstate({state: state});
      }
      // whatever else you want to do
      // maybe call onhashchange e.handler
      return pushState.apply(history, arguments);
    }
  })(window.history);
 
  window.onpopstate = history.onpushstate = function(e) {
    let result_dom = document.getElementById('extractresult');
    if(null !== result_dom) {
      result_dom.remove();
    }
 
    let hlslist = document.getElementsByName('hlsdata');
    for (let hls = hlslist.item(0); null !== hls; hls = hlslist.item(0)) {
      hls.remove();
    }
    let mpdlist = document.getElementsByName('mpddata');
    for (let mpd = mpdlist.item(0); null !== mpd; mpd = mpdlist.item(0)) {
      mpd.remove();
    }
    let wvlist = document.getElementsByName('wvdata');
    for (let wv = wvlist.item(0); null !== wv; wv = wvlist.item(0)) {
      wv.remove();
    }
    let vttlist = document.getElementsByName('vttdata');
    for (let vtt = vttlist.item(0); null !== vtt; vtt = vttlist.item(0)) {
      vtt.remove();
    }
  };
 
  var _wr = function(type) {
    let orig = history[type];
    return function() {
      let rv = orig.apply(this, arguments);
      let e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');
  window.addEventListener('replaceState', function(e) {
    let result_dom = document.getElementById('extractresult');
    if(null !== result_dom) {
      result_dom.remove();
    }
 
    let hlslist = document.getElementsByName('hlsdata');
    for (let hls = hlslist.item(0); null !== hls; hls = hlslist.item(0)) {
      hls.remove();
    }
    let mpdlist = document.getElementsByName('mpddata');
    for (let mpd = mpdlist.item(0); null !== mpd; mpd = mpdlist.item(0)) {
      mpd.remove();
    }
    let wvlist = document.getElementsByName('wvdata');
    for (let wv = wvlist.item(0); null !== wv; wv = wvlist.item(0)) {
      wv.remove();
    }
    let vttlist = document.getElementsByName('vttdata');
    for (let vtt = vttlist.item(0); null !== vtt; vtt = vttlist.item(0)) {
      vtt.remove();
    }
  });
 
  start();
})();