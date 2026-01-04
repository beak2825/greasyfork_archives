// ==UserScript==
// @name           Extract Video Info
// @description    extract OTT video info for download script..
// @match *://www.tving.com/*
// @match *://seezntv.com/*
// @match *://dorama.kr/*
// @version 0.0.1.20251204151238
// @namespace https://greasyfork.org/users/976225
// @downloadURL https://update.greasyfork.org/scripts/453934/Extract%20Video%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/453934/Extract%20Video%20Info.meta.js
// ==/UserScript==
 
(function() {
  returnAfter = function (delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('end');
      }, delay);
    });
  };

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

  Numbering = function(n) {
    return String(n).padStart(2, '0');
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
            for (let base of dom.getElementsByTagName('BaseURL')) {
              return {has: true, url: base.textContent};
            }
            return {has: true, url: ''};
        }
      }
      return {has: false};
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
    SaveText: function (text, title) {
      let b = new Blob([text], {type : 'application/text'});
      let f = new FileReader();
      f.onload = function(e) {
        let a = document.createElement('a');
        a.setAttribute('download', title);
        a.href = e.target.result;
        a.click();
      };
      f.readAsDataURL(b);
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
      //let playingUnique = windowName || js_cookie_default.a.get('thpa');
      //let value = playingUnique || window.sessionStorage.getItem('unique-id');
      let value = window.sessionStorage.getItem('unique-id');
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
    GetDrmInfo: function (drms) {
      for (let drm of drms) {
        if ('Widevine' == drm.drm_type)
          return {url: drm.drm_server_url, key: drm.drm_header_value};
      }
    },
    GetSogneInfo: function () {
      for (let mpddata of document.getElementsByName('mpddata')) {
        let data = JSON.parse(mpddata.getAttribute('data'));
        let url = data.url;
        //if (data.url.includes('//sogne')) {
          return {url: data.url, isSogne: true};
        //}
      }
      return {url: '', isSogne: false};
    },
    call: async function (url) {
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
      let vttsub = '';
      for (let sub of recv.body.stream.subtitles) {
        if ("KO" == sub.lang_cd)
          vttsub = sub.url;
      }

      let watermark = false;
      if (null !== recv.body.content.info.movie && 'Y' == recv.body.content.info.movie.watermark_flag) {
        AddCopyResult('', '워터마크가 사용된 영상입니다..', 'error');
        watermark = true;
      }

      let quality = Tving.GetQualityList(recv.body.stream.quality, recv.body.content.vod_type);
      let height_select = Tving.GetQuality();
      let GetHeight = function(code) {
        for (let q of quality) {
          if (q.code == code) return q.height;
        }
        return 0;
      };
/*
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
*/
      if (null !== recv.body.content.info.movie && null !== recv.body.content.info.movie.abr_flag)
        integrated = ('Y' == recv.body.content.info.movie.abr_flag);
      let title = `${recv.body.content.program_name}`;
      if (title.match(/(.+?)\s*(?:시즌(\d+))?$/)) {
        title = RegExp.$1;
        if (RegExp.$2) title += ` S${Numbering(RegExp.$2)}`;
        if ('CSMD0100' == recv.body.content.vod_type) {
          title += `${(RegExp.$2 ? '' : ' S01')}E${Numbering(recv.body.content.frequency)} ${recv.body.content.episode_name}`;
        }
      }
      title = Common.SafeTitle(title);
      title = title.replace(/[\s_]/g, '.').replace(/\.+/g, '.');

      let mpd = '';
      let sogne = Tving.GetSogneInfo();
/*
      let mpd = `${stream_select.url.replace(/http:/, 'https:')}`.replace(/\.ctx$/, '.json');
      mpd += `/manifest${(integrated ? '_'+(Math.max(GetHeight(stream_select.code), 360)) : '')}.mpd?content_type=VOD`;
*/
      if(sogne.isSogne) mpd = sogne.url;

      Tving.Playlists = [];
      let base_hls = '';
      if ('' === mpd || mpd.includes('.smi') || mpd.includes('.mp4')) {
        for (let hlsdata of document.getElementsByName('hlsdata')) {
          let data = JSON.parse(hlsdata.getAttribute('data'));
          let cookies = ' ';
          for (let header of data.headers) {
            if ('cookie' == header.name.toLowerCase()) {
              cookies = header.value;
              break;
            }
          }
          if (true == /playlist\.m3u8/.test(data.url) && 0 === Tving.Playlists.length) {
            if ('' === cookies) {
              AddCopyResult(`${data.url}\n${title}\n`, 'JBOX - 영상 주소 복사', 'copyall');
            } else {
              AddCopyResult(`${data.url}\n${cookies}\n${title}\n`, 'WAVVE - 영상 주소 복사', 'copyall');
            }
            base_hls = data.url.replace(/\/[^\/]+$/, '');
            let master_data = await Common.GetHls(data.url);
            Tving.GetPlaylist(master_data);
            let subtitle = (master_data.match(/TYPE=SUBTITLES,.*?URI="([^"]+)"/) ? RegExp.$1 : '');
            if ('' !== subtitle) {
              AddCopyResult(`${data.url}\n${cookies}\n${title}\n`, '자막 주소 복사', 'copysub');
            }
          } else if (true == /subtitle/.test(data.url)) {
            AddCopyResult(`${data.url}\n \n${title}\n`, '자막 주소 복사', 'copysub');
          }
        }
/*
        if (0 < Tving.Playlists.length) {
          AddCopyResult(``, '해상도별 영상 주소 복사', 'copyres');
          for (let playlist of Tving.Playlists) {
            AddCopyResult(`${base_hls}/${playlist.url}\n${title}\n`, `영상 주소 복사: Resolution ${playlist.resolution}, Bandwidth ${playlist.bandwidth}`, `copy${playlist.bandwidth}`);
          }
        }
*/
        return;
      }

      if (!recv.body.stream.drm_license_data) {
        for (let mpddata of document.getElementsByName('mpddata')) {
          let data = JSON.parse(mpddata.getAttribute('data'));
          let cookies = ' ';
          for (let header of data.headers) {
            if ('cookie' == header.name.toLowerCase()) {
              cookies = header.value;
              break;
            }
          }
        }
      }
      let drm = (recv.body.stream.drm_license_data ? this.GetDrmInfo(recv.body.stream.drm_license_data) : null);
      let wv_url = (drm ? `${drm.url}?${drm.key}` : 'undefined');
      let param1 = '';
      let param2 = '';
      for (let mpddata of document.getElementsByName('mpddata')) {
        let data = JSON.parse(mpddata.getAttribute('data'));
        if (!recv.body.stream.drm_license_data) {
          mpd = data.url;
        }
        for (let header of data.headers) {
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
      let pssh = (watermark ? null : (license ? license.pssh : 'undefined'));
      let sub = Common.CheckMpdSub(mpd_body);

      AddCopyResult(`${title}\n`, `${title}`, `title`);
      //AddCopyResult(`${mpd}\n`, "mpd", `mpd`);
      //AddCopyResult(`${wv_url}\n`, "license", `license`);
      if (null !== pssh) {
        //AddCopyResult(`${pssh}\n`, "pssh", `pssh`);
        AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}\nhigh\n\n`, "영상 저장", "all");
        if (sub.has) {
          AddCopyResult(`${mpd}\n${title}\n`, "자막 저장", "all_sub");
          AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}\nhigh\n\n${mpd}\n`, "영상+자막 저장", "all_vs");
        } else if ('' !== vttsub) {
          AddCopyResult(`${vttsub}\n${title}\n`, "자막 저장", "all_sub");
        }
      } else {
        AddCopyResult(`${mpd}\n \n${title}\n${wv_url}\nhigh\n${param1}\n${param2}\n`, "영상 저장_drm", "all");
        if (sub.has) {
          AddCopyResult(`${mpd.replace(/[^\/]+$/, '')}${('' !== sub.url ? sub.url : mpd)}\n${title}\n`, "자막 저장", "all_sub");
        }
      }
      //console.log(`title : ${title}`);
      //console.log(`mpd : ${mpd}`);
      //console.log(`pssh : ${pssh}`);
      //console.log(`token : ${token}`);
    },
  },

  Watcha = {
    domains: ["watcha"],
    headers: {
//      'x-frograms-app-code': 'mars',
//      'x-frograms-client': 'Mars-Web-App',
      'x-frograms-mars-screen': '1920x1080/1',
//      'x-frograms-version': '1.0.5',
      'x-watchaplay-client': 'WatchaPlay-WebApp',
      'x-watchaplay-client-version': '1.0.5',
      'x-watchaplay-screen': '1920x1080/1',
    },
    GetCustomData: function (payload) {
      for (let wvdata of document.getElementsByName('wvdata')) {
        let wv = JSON.parse(wvdata.getAttribute('data'));
        for (let header of wv.headers) {
          if ('dt-custom-data' == header.name.toLowerCase()) {
            return (header.value);
          }
        }
      }
      return false;
    },
    ExtractSubtitle: async (url) => {
      let content = (url.match(/\/([^\/\?$]+)(?:\?|$)/) ? RegExp.$1 : '');
      let content_api = `https://watcha.com/api/aio_contents/${content}/episodes?all=true`;
      let episode_info = await Common.GetJson(content_api, {headers:Object.assign(Watcha.headers, window.__API_HEADERS__), credentials: 'include'});
      //console.log(episode_info);

      let all_subtitles = '';
      for (let episode of episode_info.result.episode_ids) {
        let episode_api = `https://watcha.com/api/plays/video/${episode}`;
        let episode_info = await Common.GetJson(episode_api, {headers:Object.assign(Watcha.headers, window.__API_HEADERS__), credentials: 'include'});

        let season = false;
        let title = episode_info.result.title;
        if (episode_info.result.content.titles.short) {
          if (episode_info.result.content.titles.short.match(/(?:시즌\s*([^:]+))/)) {
            title += ` S${Numbering(RegExp.$1)}`;
            season = true;
          }
        }
        if (undefined !== episode_info.result.content.episode_number) {
          title += `${season ? '' : ' S01'}E${Numbering(episode_info.result.content.episode_number)}`;
        }
        title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');

        for (let subtitle of episode_info.result.stream.subtitles) {
          if ('ko' != subtitle.lang) continue;
          if (undefined === subtitle.url || '' === subtitle.url) continue;
          all_subtitles += `${subtitle.url}\n${title}\n`;
        }
      }

      //console.log(all_subtitles);
      if ('' !== all_subtitles)
        AddCopyResult(`${all_subtitles}\n`, '전체 자막 저장 정보 복사', 'allsub');
      else
        AddCopyResult('', '추출된 자막 없음', 'allsub');
    },
    ExtractVideo: async (url) => {
      let id = (url.match(/\/([^\/\?$]+)(?:\?|$)/) ? RegExp.$1 : '');
      let api_info = `https://watcha.com/api/plays/video/${id}`;

      let recv = await Common.GetJson(api_info, {headers:Object.assign(Watcha.headers, window.__API_HEADERS__), credentials: 'include'});
      console.log(recv);

      let season = false;
      let title = recv.result.title;
      if (recv.result.content.titles.short) {
        if (recv.result.content.titles.short.match(/(?:시즌\s*([^:]+))/)) {
          title += ` S${Numbering(RegExp.$1)}`;
          season = true;
        }
      }
      if (undefined !== recv.result.content.episode_number) {
        title += `${season ? '' : ' S01'}E${Numbering(recv.result.content.episode_number)}`;
      }
      title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
 
      let mpd = recv.result.stream.source;
      let pssh = await Common.GetMpdPssh(mpd);
      let token = Watcha.GetCustomData(recv.result.ping_payload);
      if (false == token) {
        alert('get cookie failed');
        return;
      }
      let wv_url = `https://lic.drmtoday.com/license-proxy-widevine/cenc/?${token}`;
      let vtt = '';
      if (recv.result.stream.subtitles !== null && recv.result.stream.subtitles !== undefined && recv.result.stream.subtitles.length != 0) {
        vtt = recv.result.stream.subtitles[0].url;
      }
/*
      AddCopyResult(`${title}\n`, `${title}`, `title`);
      AddCopyResult(`${mpd}\n`, "mpd", `mpd`);
      AddCopyResult(`${wv_url}\n`, "license", `license`);
      AddCopyResult(`${pssh}\n`, "pssh", `pssh`);
*/
      AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}\nhigh\n\n${vtt}\n`, "고화질 영상 추출", "all_high");
      AddCopyResult(`${mpd}\n${wv_url}\n${pssh}\n${title}_저화질\nlow\n\n${vtt}\n`, "저화질 영상 추출", "all_low");

      if ('' != vtt) {
        AddCopyResult(`${vtt}\n${title}\n`, "자막 추출", "all_sub");
      }

      setTimeout(() => {
        location.reload();
      }, "1700");
    },
    call: function (url) {
      if (/watcha\.com\/watch/.test(url)) Watcha.ExtractVideo(url);
      if (/watcha\.com\/contents/.test(url)) Watcha.ExtractSubtitle(url);
    },
  },

  CoupangPlay = {
    domains: ["coupangplay"],
    episodes: [],
    discover_API: 'https://www.coupangplay.com/api-discover/v1/discover/titles',
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
    GetCookie: function () {
      for (let wvdata of document.getElementsByName('wvdata')) {
        let wv = JSON.parse(wvdata.getAttribute('data'));
        for (let header of wv.headers) {
          if ('cookie' == header.name.toLowerCase()) {
            return header.value;
          }
        }
      }
      return '';
    },
    GetSeason: function () {
      for (let selected of document.querySelectorAll('div[class^="Dropdown_selectedItem_"]')) {
        let data = selected.getAttribute('data-cy');
        if (/dropdown-season-option/.test(data)) {
          let season = (data.match(/(\d+)/) ? RegExp.$1 : 0);
          return (0 == season ? '-1' : `${season}~${season}`);
        }
      }
      return '-1';
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
        let content_url = `${CoupangPlay.discover_API}/${content.id}?platform=WEBCLIENT&locale=ko&filterRestrictedContent=false`;
        let content_info = await Common.GetJson(content_url, {headers:Object.assign(CoupangPlay.headersDef, { 'newrelic': newrelic, })});
 
        title += GetTitle('title');

        if (undefined !== content_info.data) {
          let season = false;
          if (undefined !== content_info.data.season) {
            title += ` S${Numbering(content_info.data.season)}`;
            season = true;
          }

          if (undefined !== content_info.data.episode) {
            title += `${season ? '' : ' S01'}E${Numbering(content_info.data.episode)}`;
          }
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
      if (undefined !== api_info.data?.raw?.text_tracks && null !== api_info.data.raw.text_tracks) {
        for (let subs of api_info.data.raw.text_tracks) {
          if ("ko" == subs.srclang) {
            sub = subs.src.replace('/non-drm/', '/drm/');
            if (onlysub) {
              return `${sub}`;
            }
            AddCopyResult(`${sub}\n${title}\n\n`, '자막 저장용 정보 복사', 'allsub');
            break;
          }
        }
      }

      if (false == onlysub) {
        for (let src of api_info.data.raw.sources) {
          if ('application/dash+xml' == src.type && /^https/.test(src.src)) {
            let mpd = await Common.GetXml(src.src);
            let license = Common.FindMpdPssh(mpd);
            let lic_url = (license.lic_url || src.key_systems['com.widevine.alpha'].license_url);
            let cookies = CoupangPlay.GetCookie();

            AddCopyResult(`${title}\n`, `${title}`, `title`);
/*
            AddCopyResult(`${src.src}\n`, "mpd", `mpd`);
            AddCopyResult(`${lic_url}\n`, "license", `license`);
            AddCopyResult(`${license.pssh}\n`, "pssh", `pssh`);
*/
            AddCopyResult(`${src.src}\n${lic_url}\n${license.pssh}\n${title}\nhigh\n${cookies}\n`, "고화질 영상 저장", "all_high");
            AddCopyResult(`${src.src}\n${lic_url}\n${license.pssh}\n${title}\nlow\n${cookies}\n`, "저화질 영상 저장", "all_low");
            if ('' !== sub) {
              AddCopyResult(`${src.src}\n${lic_url}\n${license.pssh}\n${title}\nhigh\n${cookies}\n${sub}\n`, "고화질 영상+자막 저장", "all_high");
              AddCopyResult(`${src.src}\n${lic_url}\n${license.pssh}\n${title}\nlow\n${cookies}\n${sub}\n`, "저화질 영상+자막 저장", "all_low");
            }
            break;
          }
        }
      }

      return null;
    },
    ProcessEpisode: async (id, season, page, perPage = 50) => {
      let api_url = `${CoupangPlay.discover_API}/${id}?platform=WEBCLIENT&locale=ko`;
      let api_info = await Common.GetJson(api_url);
      let title = api_info.data.title;

      api_url = `${CoupangPlay.discover_API}/${id}/episodes?seasonRange=${season}&page=${page}&overrideSortOrder=asc&titleId=${id}&locale=ko&perPage=${perPage}&disableCache=false&includeChannelContents=false&platform=WEBCLIENT&sort=true`;
      api_info = await Common.GetJson(api_url);

      for (let episode of api_info.data) {
        let sub_link = await CoupangPlay.Extract({id: episode.id, type: episode.as}, true);
        if (null !== sub_link) {
          let ep_title = `${title} S${Numbering(episode.season)}E${Numbering(episode.episode)} ${episode.title}`;
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
        let season = CoupangPlay.GetSeason();
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
                let ep = (meta.firstElementChild.textContent.match(/(\d+)[\s\.]*(.*)/) ? `E${Numbering(RegExp.$1)} ${RegExp.$2}` : '');
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
      for (let i of document.getElementsByClassName('img_wrap playing')) {
        let f = (i.parentElement.getAttribute('onclick').match(/'(\d+)'/) ? RegExp.$1 : '');
        if ('' !== f) content_id = f;
      }

      let recv = await Common.GetJson(`${apibase}/v2/views/${content_id}?_=${(new Date).getTime()}`,
                                                               { credentials:'include', });
      let cid = recv.result.meta.contentSeq;
      let title = Common.SafeTitle(recv.result.meta.name).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      if (undefined !== recv.result.meta.seasonName && null !== recv.result.meta.seasonName) {
        title = `${recv.result.meta.seasonName} ${title}`;
      }
      title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');

      recv = await Common.GetJson(`${apibase}/v1/users/configs?_=${(new Date).getTime()}`,
                                                          { credentials:'include', });
      let did = recv.result.device.encryptedDeviceKey;

      recv = await Common.GetJson(`${apibase}/v2/playContexts/views/${content_id}?_=${(new Date).getTime()}`,
                                                          { credentials:'include', });
      let oid = recv.result.rightContext.liquidationSeq;

      recv = await Common.GetJson(`${apibase}/getPlayListUrl?cid=${cid}&deviceId=${did}&deviceType=WEB&drmType=WIDEVINE&oid=${oid}`,
                                                          { credentials:'include', });
      let caption_url = recv.captionUrl;
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
        av_url.audio = mpd_url;
      }

      let cookies = '';
      for (let mpddata of document.getElementsByName('mpddata')) {
        let mpd = JSON.parse(mpddata.getAttribute('data'));
        for (let header of mpd.headers) {
          if ('cookie' == header.name.toLowerCase()) {
            cookies = header.value;
            break;
          }
        }
        if ('' !== cookies) break;
      }

      // 자막 추출
      if (undefined != caption_url && null !== caption_url && '' !== caption_url) {
        caption_url = '';
        recv = await Common.GetJson(`${apibase}/getCaptionFiles?cntsSeq=${cid}&liqidSeq=${oid}`, { credentials:'include', });
        for (let caption of recv.result.captionFiles) {
          if ('ko' == caption.languageTag) {
            let captionJson = await Common.GetJson(`${caption.url}&deviceKey=${did}`, { credentials:'include' });
            //let subtitle = await Common.GetHls(captionJson.url, { credentials:'include' });
            caption_url = `NAVERCAP:${cid}:${captionJson.url}`;
          }
        }
      } else { caption_url = ''; }

      //AddCopyResult(`${title}\n`, `${title}`, `title`);
      //AddCopyResult(`${av_url.video}^${av_url.audio}\n`, "mpd", `mpd`);
      //AddCopyResult(`${lic_url}\n`, "license", `license`);
      //AddCopyResult(`${license.pssh}\n`, "pssh", `pssh`);
      AddCopyResult(`${av_url.video}^${av_url.audio}\n${lic_url}\n${license.pssh}\n${title}\nhigh\n${cookies}\n\n`, "영상 추출", "video_high");
      AddCopyResult(`${caption_url}\n${title}\n`, "자막 추출", "sub_high");
      AddCopyResult(`${av_url.video}^${av_url.audio}\n${lic_url}\n${license.pssh}\n${title}\nhigh\n${cookies}\n${caption_url}\n`, "영상+자막 추출", "all_high");
    },
  },

  Naver = {
    domains: ["sports.naver"],
    call: async (url) => {
      let id = (url.match(/video\/(\d+)/) ? RegExp.$1 : '');
      let api = `https://api-gw.sports.naver.com/video/${id}?fields=all`;
      let recv = await Common.GetJson(api);
      let vid = recv.result.masterVid;
      let key = recv.result.inkey;
      if (null === vid || null === key) return;

      api = `https://apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${vid}?key=${key}`;
      recv = await Common.GetJson(api);

      let best = null;
      for (let video of recv.videos.list) {
        if (null === best) best = video;
        else if (video.size > best.size) best = video;
      }

      let title = Common.SafeTitle(recv.meta.subject).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      SetResult(`<a href="${best.source}" download="${title}.mp4">${title}</a>`, "", "right", "mp4");
     },
  },

  Jbox = {
    domains: ["jbox\.co\.kr"],
    episodes: [],
    GetKey: function () {
      let v = document.getElementById('play_screen');
      for (let s of v.contentDocument.scripts) {
        if (s.innerText.match(/terminalkey=([^&]+)&/)) {
          return RegExp.$1;
        }
      }
      return '';
    },
    GetPlayerData: function (s, r) {
      if (s.match(r)) {
        return RegExp.$1;
      }
      return '';
    },
    GetParam: function () {
      let s = document.getElementById('play_screen').getAttribute('src');
      if (s.match(/cust_id=((?:[^\|]*\|@\|){9})(\d*)(\|@\|(?:[^\|]*\|@\|)+)/)) {
        return `${RegExp.$1}{VID}${RegExp.$3}`;
      }
      return '';
    },
    GetSt: function () {
      let s = document.getElementById('play_screen').getAttribute('src');
      if (s.match(/&st=([^&]+)/)) {
        return RegExp.$1;
      }
      return '';
    },
    Extract: async function (key, cid, st) {
      let playerUrl = `https://www.jbox.co.kr/player/?cust_id=${cid}&st=${st}`;
      let recv = await Common.GetHls(playerUrl, {credentials: 'include'});
      let sno = this.GetPlayerData(recv, /\s+sno\s+=\s+"(\d+)"/);
      let apiUrl = `https://www.jbox.co.kr/appinterface/v1.0/player/getplayvideo/?terminalkey=${key}&cust_id=${cid}&ucn=&res_id=&sno=${sno}&vod_id=&drm_type=`;
      recv = await Common.GetJson(apiUrl);
      for (let stream of recv.data.video_file) {
        return stream.vod_file_url;
      }
      return null;
    },
    Main: async function (key, cid, st, season) {
      let stream = await this.Extract(key, cid, st);
      if (null === stream) return;

      let info = document.getElementsByClassName('content_title');
      let title = season;
      title += (info.length > 0 ? ` ${info[0].textContent}` : '');
      title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      this.episodes.push({'title': title, 'link': stream});

      AddCopyResult(`${stream}\n${title}\n`, `${title}`, 'episode');
    },
    call: async function (url) {
      episodes = [];
      let checkdupl = [];

      let key = this.GetKey();
      let param = this.GetParam();
      let id = document.getElementById('broadprog_id').getAttribute('value');
      let mainCid = document.getElementById('broadvod_id').getAttribute('value');
      let st = this.GetSt();
      if ('' === key || '' === param || '' === id || '' === mainCid || '' === st) {
        console.log('extract error!!');
        return;
      }
      let info = document.getElementsByClassName('item title');
      let season = (info.length > 0 ? info[0].textContent : '');
      this.Main(key, param.replace('{VID}', mainCid), st, season);
      checkdupl.push(mainCid);

      for (let page = 1; true; ++page) {
        let url = `https://www.jbox.co.kr/work/episode/?broadprog_id=${id}&&broadvod_id=${mainCid}&curpage=${page}`;
        let info = await Common.GetHls(url, {credentials: 'include'});

        let empty = true;
        let result = null;
        let pattern = /menu_locate_vod\(.+'(\d+)'[\s\S]+?class="title">([^<]+)</gm;
        while ((result = pattern.exec(info)) !== null) {
          let cid = result[1];
          let ep = result[2];
          if (checkdupl.includes(cid)) continue;
          checkdupl.push(cid);

          console.log(`id : ${cid}, ep : ${ep}`);

          empty = false;

          let stream = await this.Extract(key, param.replace('{VID}', cid), st);
          if (null === stream) continue;

          let title = season;
          title += ('' !== ep ? ` ${ep}` : '');
          title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
          this.episodes.push({'title': title, 'link': stream});
        }

        if (empty)
          break;
      }

      if (0 < this.episodes.length) {
        let allepisode = '';
        for (let episode of this.episodes) {
          allepisode += `${episode.link}\n${episode.title}\n`;
        }
        AddCopyResult(`${allepisode}\n`, '전체 에피소드 추출 정보 복사', 'allepisode');
      }

      console.log(this.episodes);
    },
  },

  SBS = {
    domains: ["sbs\.co\.kr"],
    API_BASE: 'https://static.apis.sbs.co.kr',
    GetQuality: async function (id, token) {
      let rscuse = '02';
      let api_url = `https://apis.sbs.co.kr/play-api/1.0/sbs_vodall/${id}?jwt-token=${token}&platform=pcweb&protocol=hls&absolute_show=Y&service=program&rscuse=&ssl=Y`;
      let info = await Common.GetJson(api_url);
      info = info.vod;

      for (const vod of info.source.mediasourcelist) {
        if (rscuse < vod.mediarscuse) rscuse = vod.mediarscuse;
      }
      return rscuse;
/*
      let cur = document.getElementsByClassName('current');
      for (let i of cur) {
        if ('BUTTON' == i.tagName && 'current' == i.className) {
          return (i.id.match(/-(\d+)$/) ? RegExp.$1 : '');
        }
      }
*/
    },
    Extract: async function (id) {
      //let id = (url.match(/(\d+)(?:\?.*)?$/) || url.match(/mdaId=(\d+)/) ? RegExp.$1 : '');
      if ('' === id)
        return;

      let token = GetCookie('LOGIN_JWT');
      let q = await SBS.GetQuality(id, token);
      let api_url = `https://apis.sbs.co.kr/play-api/1.0/sbs_vodall/${id}?jwt-token=${token}&platform=pcweb&protocol=hls&absolute_show=Y&service=program&rscuse=${q}&ssl=Y`;
      let info = await Common.GetJson(api_url);
      info = info.vod;
      console.log(info);

      let title = Common.SafeTitle(info.info.program.programtitle).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      let ep = `E${Numbering(info.info.content.number)}`;
      let onair = (info.info.broaddate.match(/\d{2}(\d{2})-(\d+)-(\d+)/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '');
      let quality = info.source.mediasource.quality;
      let media = info.source.mediasource.mediaurl;
      let fullname = `${title}.${ep}.${onair}.${quality}`;
      let subtitle = info.source.subtitle;

      return { title: fullname, vod: media, sub: subtitle };
    },
    call: async function (url) {
      const prog_name = (url.match(/\/([^\/]+)\/vods/) ? RegExp.$1 : '');
      if ('' !== prog_name) {
        const ep_start = Number.parseInt(prompt('추출을 시작할 에피소드', '1'));
        if (Number.isNaN(ep_start) || ep_start < 1) return;

        let api_url = `${this.API_BASE}/program-api/1.0/menu/${prog_name}`;
        let info = await Common.GetJson(api_url);

        const fullid = info.program.fullprogramid;
        const limit = 24;
        api_url = `${this.API_BASE}/play-api/1.0/sbs_vodalls?offset=${ep_start - 1}&limit=${limit}&sort=old&search=&cliptype=&subcategory=&sportscomment=&programid=${fullid}&absolute_show=Y&mdadiv=01&viewcount=Y&srsdiv=01`;
        info = await Common.GetJson(api_url);

        let vods = '';
        let subs = '';
        for (const ep of info.list) {
          const data = await this.Extract(ep.mediaid);
          if (data.vod) vods += `${data.vod}\n${data.title}\n`;
          if (data.sub) subs += `${data.sub}\n${data.title}\n`;
          await returnAfter(1000);
        }
        if ('' !== vods) AddCopyResult(vods, `${ep_start} ~ ${ep_start + (info.list.length - 1)} 영상 추출 정보 복사`, 'video');
        if ('' !== subs) AddCopyResult(`${data.sub}\n${data.title}\n`, `${ep_start} ~ ${ep_start + ep_count} 자막 추출 정보 복사`, 'subtitle');
        return;
      }

      const id = (url.match(/(\d+)(?:\?.*)?$/) || url.match(/mdaId=(\d+)/) ? RegExp.$1 : '');
      if ('' !== id) {
        const data = await this.Extract(id);
        if (data.vod) AddCopyResult(`${data.vod}\n${data.title}\n`, '영상 추출 정보 복사', 'video');
        if (data.sub) AddCopyResult(`${data.sub}\n${data.title}\n`, '자막 추출 정보 복사', 'subtitle');
        return;
      }
    },
  },

  MBC = {
    domains: ["imbc\.com"],
    GetQuality: function (items) {
      let select = {speed:0, iid:0, res:''};
      for (let i of items) {
        if (select.speed < i.Speed) {
          switch (i.IconType) {
          case 'SD': select.res = '480p'; break;
          case 'MD': select.res = '720p'; break;
          case 'HD': select.res = '1080p'; break;
          }
          select.iid = i.ItemId;
          select.speed = i.Speed;
        }
      }
      return select;
    },
    call: async (url) => {
      let bid = jarvis.mbcPlayer.broadcastId;
      let iid = itemId;
      let api_url = `https://mediaapi.imbc.com/Player/PlayerUtil?broadcastId=${bid}&itemid=${iid}`
      let info = await Common.GetJson(api_url, {credentials: 'include'});

      let title = Common.SafeTitle(info.MediaInfo.ProgramTitle).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
      let all_ep = '';
      let result = null;
      let pattern = /(\d+)/g;
      while ((result = pattern.exec(info.MediaInfo.ContentNumber)) !== null) {
        let ep = result[1];
        all_ep += `E${Numbering(Number(ep))}`;
      }
      let onair = (info.MediaInfo.BroadDate.match(/\d{2}(\d{2})-(\d+)-(\d+)/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '');
      let quality = MBC.GetQuality(info.MediaItemList);
      let subtitle = info.MediaInfo.CaptionURL;
      let fullname = `${title}.${all_ep}.${onair}`;

      api_url = `https://mediaapi.imbc.com/Player/PlayURLUtil?broadcastId=${bid}&itemid=${quality.iid}`
      info = await Common.GetJson(api_url, {credentials: 'include'});
      let media = info.MediaURL;
      AddCopyResult(`${media}\n${fullname}\n`, '영상 추출 정보 복사', 'video');

      if (subtitle) {
        AddCopyResult(`${subtitle}\n${fullname}\n`, '자막 추출 정보 복사', 'subtitle');
      }
    },
  },

  KBS = {
    domains: ["vod\.kbs\.co\.kr"],
    call: async (url) => {
      let info = JSON.parse(player_video_contents.data);

      let title = info.title;
      let ep = `E${Numbering(info.program_sequence_number)}`;
      let onair = (info.program_planned_date.match(/\d{2}(\d{6})/) ? RegExp.$1 : '');
      let subtitle = '';
      if (null !== info.custom_caption) {
        for (let sub of info.custom_caption) {
          if ('ko' == sub.language) {
            subtitle = sub.url;
            break;
          }
        }
      }

      let fullname = `${title}.${ep}.${onair}`;

      let media = player_video_contents.bill_info.cdn_file_name;
      AddCopyResult(`${media}\n${fullname}\n`, '영상 추출 정보 복사', 'video');
      if (subtitle) {
        AddCopyResult(`${subtitle}\n${fullname}\n`, '자막 추출 정보 복사', 'subtitle');
      }
    },
  },

  EBS = {
    domains: ["www\.ebs\.co\.kr"],
    GetVod: function () {
      for (const lists of source) {
        let select = null;
        for (const vod of lists.quality) {
          if (null === select) select = vod;
          else if (select.code < vod.code) select = vod;
        }
        if (null !== select)
          return (select.src);
      }
      return '';
    },
    GetTitle: function () {
      // title: main.season.date.sub
      const main = vodOption.courseNm.trim();
      const season = Numbering(vodOption.stepNm.match(/시즌(\d+)/) ? RegExp.$1 : '1');
      const sub = vodLectNm.trim();
      const cur_ep = document.querySelector('._playList').querySelector('.on');
      const date = cur_ep.querySelector('.date').textContent.match(/(?:19|20)(\d{2})\.?(\d{2})\.?(\d{2})/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '000000';
      return Common.SafeTitle(`${main} S${season} ${date} 1080p ${sub}`).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
    },
    call: function (url) {
      let subtitle = '';
      const title = this.GetTitle();
      const vod = this.GetVod();
      if ('' === vod) {
        AddCopyResult('', '추출 실패', 'error');
      }
      AddCopyResult(`${vod}\n${title}\n`, '영상 추출 정보 복사', 'video');
      if (subtitle) {
        AddCopyResult(`${subtitle}\n${title}\n`, '자막 추출 정보 복사', 'subtitle');
      }
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
      title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
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

  linkkf = {
    domains: ["linkkf"],
    GetId: function() {
      if (typeof(player_aaaa) != 'undefined')
        return player_aaaa.url;
      else if (typeof(player_data) != 'undefined')
        return player_data.url;
      return '';
    },
    GetTitlePlayer: function() {
      for (let dom of document.getElementsByTagName('class="title"')) {
        let title = dom.innerText;
        if (title.match(/^(.+?)(:?(\d+)기)?(:?\s+BD)?-(\d+)$/)) {
          title = RegExp.$1;
          title += ` S${Numbering(RegExp.$3 ? RegExp.$3 : 1)}`;
          title += `E${Numbering(RegExp.$5 ? RegExp.$5 : 1)}`;
          title = title.replace(/[\s_]/g, '.').replace(/\.+/g, '.');
          return Common.SafeTitle(title);
        }
      }
      return '';
    },
    GetTitleWatch: function() {
      for (let dom of document.querySelectorAll('.ewave-gbook-report')) {
        let title = dom.getAttribute('data-name');
        if (title.match(/^(.+?)\s*(\d+)?$/)) {
          title = RegExp.$1;
          title += ` S${Numbering(1)}`;
          title += `E${Numbering(RegExp.$2 ? RegExp.$2 : 1)}`;
          title = title.replace(/[\s_]/g, '.').replace(/\.+/g, '.');
          return Common.SafeTitle(title);
        }
      }
      return '';
    },
    call: async function(url) {
      let id = this.GetId();
      let subData = await Common.GetHls(`https://2.sub2.top/s/${id}.vtt`);
      let title = this.GetTitlePlayer();
      if ('' === title) title = this.GetTitleWatch();
      if ('' !== title) {
        Common.SaveText(subData, `${title}.vtt`);
      }
    },
  },

  Wavve = {
    domains: ["wavve"],
    Playlists: [],
    GetPlaylist: function (master) {
      let pattern = /#EXT.+?BANDWIDTH=([^,]+).+?,RESOLUTION=([^,]+)[^\s]*\s*([^#\s]+)/gm;
      let matchResult;
      let playlists = [];
      while ((matchResult = pattern.exec(master)) !== null) {
        let bit = matchResult[1];
        let res = matchResult[2];
        let url = matchResult[3];
        Wavve.Playlists.push({'bandwidth': bit, 'resolution': res, 'url': url});
      }
    },
    GetMpdPlaylist: async (mpd) => {
      let res = [];
      let data = await Common.GetXml(mpd, {credentials: 'include'});
      let doms = data.getElementsByTagName('Representation');
      for (let dom of doms) {
        let height = dom.getAttribute('height');
        if (false == res.includes(height) && Number.isSafeInteger(Number.parseInt(height)))
          res.push(height);
      }
      return res.sort((a, b) => { return (a - b); });
    },
    call: async (url) => {
      let title = document.getElementsByClassName('text-info');
      if (0 < title.length) {
        if (title[0].textContent.match(/(.+?)\s*(?:시즌(\d+))?\s*(?:(\d+)[회화])?$/)) {
          title = RegExp.$1;
          if (RegExp.$2) title += ` S${Numbering(RegExp.$2)}`;
          if (RegExp.$3) title += `${RegExp.$2 ? '' : ' S01'}E${Numbering(RegExp.$3)}`;
          title = title.replace(/\s/g, '.');
          title = Common.SafeTitle(title).replace(/[\s_]/g, '.').replace(/\.+/g, '.');
        } else title = title[0].textContent;
      }
      Wavve.Playlists = [];
      let base_hls = '';
      let cookies = '';
      for (let hlsdata of document.getElementsByName('hlsdata')) {
        let data = JSON.parse(hlsdata.getAttribute('data'));
        if (false == /chunklist\.m3u8/.test(data.url) && 0 === Wavve.Playlists.length) {
          for (let header of data.headers) {
            if ('cookie' == header.name.toLowerCase()) {
              cookies = header.value;
              break;
            }
          }
          AddCopyResult(`${data.url}\n${cookies}\n${title}\n`, '영상 주소 복사', 'copyall');
          base_hls = data.url.replace(/\/[^\/]+$/, '');
          let master_data = await Common.GetHls(data.url, {credentials: 'include'});
          Wavve.GetPlaylist(master_data);
          break;
        }
      }

      for (let mpddata of document.getElementsByName('mpddata')) {
        let mpd = JSON.parse(mpddata.getAttribute('data'));
        if (true == /chunklist\d+.mpd/.test(mpd.url) ||
            true == /MP4_CENC/.test(mpd.url)) {
          for (let header of mpd.headers) {
            if ('cookie' == header.name.toLowerCase()) {
              cookies = header.value;
              break;
            }
          }

          for (let wvdata of document.getElementsByName('wvdata')) {
            let wv = JSON.parse(wvdata.getAttribute('data'));
            let find = false;
            for (let header of wv.headers) {
              if ('pallycon-customdata' == header.name.toLowerCase() || 'license-token' == header.name.toLowerCase()) {
                let res = await Wavve.GetMpdPlaylist(mpd.url);
                for (let height of res) {
                  AddCopyResult(`${mpd.url}\n${cookies}\n${title}\n${wv.url}\n${header.value}\n${height}\n`, `영상 주소 복사: ${height}p`, `copyall_${height}`);
                }
                //AddCopyResult(`${mpd.url}\n${cookies}\n${title}\n${wv.url}\n${header.value}\n\n`, '영상 주소 복사', 'copyall');
                find = true;
                break;
              }
            }
            if (find) break;
          }
          break;
        }
      }

      for (let vttdata of document.getElementsByName('vttdata')) {
        let data = JSON.parse(vttdata.getAttribute('data'));
        AddCopyResult(`${data.url}\n${title}\n`, '자막 주소 복사', 'copysub');
      }

      if (0 < Wavve.Playlists.length) {
        AddCopyResult(``, '해상도별 영상 주소 복사', 'copyres');
        for (let playlist of Wavve.Playlists) {
          AddCopyResult(`${base_hls}/${playlist.url}\n${cookies}\n${title}\n`, `영상 주소 복사: Resolution ${playlist.resolution}, Bandwidth ${playlist.bandwidth}`, `copy${playlist.bandwidth}`);
        }
      }
      return;
    },
  },

  UNEXT = {
    domains: ["unext\.jp"],
    call: async (url) => {
      let vid = (url.match(/\/([^\/\?]+)(?:$|\?)/) ? RegExp.$1 : '');
      let body = {"operationName":"cosmo_getPlaylistUrl","variables":{"code":vid,"playMode":"caption","bitrateLow":192,"bitrateHigh":null,"validationOnly":false},"query":"query cosmo_getPlaylistUrl($code: String, $playMode: String, $bitrateLow: Int, $bitrateHigh: Int, $validationOnly: Boolean) {\n  webfront_playlistUrl(\n    code: $code\n    playMode: $playMode\n    bitrateLow: $bitrateLow\n    bitrateHigh: $bitrateHigh\n    validationOnly: $validationOnly\n  ) {\n    subTitle\n    playToken\n    playTokenHash\n    beaconSpan\n    result {\n      errorCode\n      errorMessage\n      __typename\n    }\n    resultStatus\n    licenseExpireDate\n    urlInfo {\n      code\n      startPoint\n      resumePoint\n      endPoint\n      endrollStartPosition\n      holderId\n      saleTypeCode\n      sceneSearchList {\n        IMS_AD1\n        IMS_L\n        IMS_M\n        IMS_S\n        __typename\n      }\n      movieProfile {\n        cdnId\n        type\n        playlistUrl\n        movieAudioList {\n          audioType\n          __typename\n        }\n        licenseUrlList {\n          type\n          licenseUrl\n          __typename\n        }\n        __typename\n      }\n      umcContentId\n      movieSecurityLevelCode\n      captionFlg\n      dubFlg\n      commodityCode\n      movieAudioList {\n        audioType\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"};

      let api_url = 'https://cc.unext.jp/';
      let info = await Common.GetJson(api_url, {method:'POST', credentials: 'include', headers: {"Content-Type": "application/json"}, body:JSON.stringify(body)});

      let title = '';
      for (let header of document.getElementsByClassName('Header__TitleContainer-sc-4llmoh-2')) {
        for (let t of header.getElementsByTagName('h2')) {
          title += ` ${t.textContent}`;
        }
        for (let t of header.getElementsByTagName('span')) {
          title += ` ${t.textContent}`;
        }
      }
      title = Common.SafeTitle(title.trim());

      for (let urlinfo of info.data.webfront_playlistUrl.urlInfo) {
        for (let profile of urlinfo.movieProfile) {
          if ('DASH' != profile.type) continue;
          let mpdurl = `${profile.playlistUrl}&play_token=${info.data.webfront_playlistUrl.playToken}`;
          let mpd = await Common.GetXml(mpdurl);
          let pssh = Common.FindMpdPssh(mpd);
          for (let lic of profile.licenseUrlList) {
            if ('WIDEVINE' != lic.type) continue;
            let licurl = `${lic.licenseUrl}?play_token=${info.data.webfront_playlistUrl.playToken}`;
            AddCopyResult(`${mpdurl}\n${licurl}\n${pssh.pssh}\n${title}\nhigh\n\n`, "all", `all`);
          }
        }
      }
    },
  },

  laftel = {
    domains: ["laftel"],
    GetToken: function () {
      for (let i = 0; i < localStorage.length; ++i) {
        let k = localStorage.key(i);
        if (/user/.test(k)) {
          let ls = JSON.parse(localStorage.getItem(k));
          return ls.token;
        }
      }
      return '';
    },
    GetTitle: function () {
      for (let i of document.getElementsByTagName('meta')) {
        if (i.getAttribute('property') == 'og:title') {
          let title = i.getAttribute('content');
          title = title.replace(/\s*\(자막\)\s*/, '').replace(/-?\s*판권\s*부활\s*/, '');
          if (title.match(/(.+?)\s*(?:(\d+)기)?\s*(?:(\d+)(\.\d+)?화)\s*-?\s*(.*$)/)) {
            title = RegExp.$1;
            if (RegExp.$2) title += ` S${Numbering(RegExp.$2)}`;
            if (RegExp.$3) title += `${RegExp.$2 ? '' : ' S01'}E${Numbering(RegExp.$3)}`;
            if (RegExp.$4) title += `${RegExp.$4}`;
            if (RegExp.$5) title += ` ${RegExp.$5}`;
          }
          return Common.SafeTitle(title).replace(/[\s_-]/g, '.').replace(/\.+/g, '.');
        }
      }
      return '';
    },
    GetMpd: async function () {
      for (let mpddata of document.getElementsByName('mpddata')) {
        let mpd = JSON.parse(mpddata.getAttribute('data'));
        let pssh = await Common.GetMpdPssh(mpd.url);
        return {url: mpd.url, pssh: pssh};
      }
      return false;
    },
    GetLicense: function () {
      for (let wvdata of document.getElementsByName('wvdata')) {
        let wv = JSON.parse(wvdata.getAttribute('data'));
        for (let header of wv.headers) {
          if ('pallycon-customdata-v2' == header.name.toLowerCase()) {
            return header.value;
          }
        }
      }
      return '';
    },
    Extract: async function (id, token) {
      let lic_url = 'https://license.pallycon.com/ri/licenseManager.do';
      let title = this.GetTitle();
      let mpd = await this.GetMpd();
      let pallycon = this.GetLicense();
      return `${mpd.url}\n${lic_url}\n${mpd.pssh}\n${title}\nhigh\n${pallycon}\n`;
    },
    GetApi: async function (url) {
      let header = {
        'Authorization': this.GetToken(),
      };
      return await Common.GetJson(url, { credentials: 'include', headers:header});
    },
    ExtractApi: async function (id) {
      let info_url = `https://laftel.net/api/episodes/v2/${id}/video/?device=Web`;
      let stream = await this.GetApi(info_url);
      if (stream.protected_streaming_info && stream.protected_streaming_info.dash_url) {
        let mpd = stream.protected_streaming_info.dash_url;
        let wvtoken = stream.protected_streaming_info.widevine_token;
        let pssh = await Common.GetMpdPssh(mpd);
        return {url: mpd, pssh: pssh, wvtoken: wvtoken};
      }
      return false;
    },
    call: async function (url) {
      let token = this.GetToken();
      if ('' === token) return;

      let result = '';

      if (/\/item\/\d+|[?&]modal=/.test(url)) {
        let id = (url.match(/\/item\/(\d+)|[?&]modal=(\d+)/) ? (RegExp.$1 | RegExp.$2) : '');
        let lic_url = 'https://license.pallycon.com/ri/licenseManager.do';
        let list_url = `https://laftel.net/api/episodes/v2/list/?item_id=${id}&sort=oldest&limit=1000&show_playback_offset=false&offset=0`;
        let ep_list = await this.GetApi(list_url);
        for (let i of ep_list.results) {
          let eid = i.id;
          let season = false;
          let title = i.title.replace('판권 부활', '');
          if (title.match(/(.+?)\s*(?:(\d+)기)/)) {
            title = `${RegExp.$1} S${Numbering(RegExp.$2)}`;
            season = true;
          }
          title = `${title}${season?'':' S01'}E${Numbering(i.episode_num)} ${(null !== i.subject ? i.subject : '')}`;

          title = Common.SafeTitle(title).replace(/[\s_-]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
          let mpd = await this.ExtractApi(eid);
          if (false != mpd)
            result += `${mpd.url}\n${lic_url}\n${mpd.pssh}\n${title}\nhigh\n${mpd.wvtoken}\n`;
          await returnAfter(2000);
        }
      } else if (/\/player\/\d+\/\d+/.test(url)) {
        let id = (url.match(/\/player\/\d+\/(\d+)/) ? RegExp.$1 : '');
        result += await this.Extract(id, token);
      } else {
        return;
      }
      AddCopyResult(result, '영상 추출 정보 복사', 'copyall');
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