// ==UserScript==
// @name           Extract Video Url
// @description    Extract video url for Live channel
// @match *://live.line.me/*
// @match *://abemafresh.tv/*
// @match *://freshlive.tv/*
// @match *://instagram.com/*
// @match *://namatv.jp/*
// @match *://pandora.tv/*
// @match *://*.twitter.com/*
// @match *://vod.afreecatv.com/*
// @version 0.0.1.20240428112308
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/20056/Extract%20Video%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/20056/Extract%20Video%20Url.meta.js
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
    GetBestHls: function (m3u8) {
      let baseLink = '';
      let baseRes = '';
      let baseBandwidth = 0;
      for (let line of m3u8.split('\n')) {
        if ('' === line) continue;
        if ('#' == line[0]) {
          let conv = (line.replace(/#EXT[^:]+:/g, '').replace(/,/g, '&'));
          const ext = new URLSearchParams(conv);
          const bandwidth = Number(ext.get("BANDWIDTH"), 10);
          if (null === bandwidth) continue;
          if (bandwidth > baseBandwidth) {
            baseLink = 'none';
            baseRes = ext.get("RESOLUTION");
            baseBandwidth = bandwidth;
          }
        } else if ('none' == baseLink) {
          baseLink = line;
        }
      }
      return { link:baseLink, res:baseRes, band:baseBandwidth };
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
    SafeTitle: function (title) {
      return title.replace(/[\\\/:*?"<>|]/g, "_");
    },
  };


  let modules = [
//****** module start!!

  ExtractLineLive = {
    domains: ["live.line.me", "file:\/\/\/"],
    call: async (url) => {
      let data = null;
      let hideArchive = /not_found/gi.test(url);
      if (hideArchive) {
        var broadcast = prompt('input script','');
        if (broadcast !== "") {
          var content = await getContents(broadcast + "/embed");
          if(content !== undefined) {
            //console.log(content);
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(content, "text/html");
            data = htmlDoc.getElementById("data");
          } else {
            console.log("error");
          }
        }
      } else {
        data = document.getElementById("data");
      }

      if (data !== null) {
        let info = data.getAttribute("data-broadcast");
        if (info !== null) {
          let jsonData = JSON.parse(info);

          // title
          let today = new Date(jsonData.item.createdAt * 1000);
          let dd = today.getDate();
          let mm = today.getMonth()+1; //January is 0!
          let yyyy = today.getFullYear();
          if(dd < 10) dd = '0' + dd;
          if(mm < 10) mm = '0' + mm;
          var title = yyyy + '' + mm + '' + dd + ' ' + jsonData.item.title;
          title = title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？");
          SetResult(title, title, "left", "title");

          // hls link
          var playinfoUrl = jsonData.item.shareURL.replace(/https?:\/\/.+?\/channels/, "https://live-api.line-apps.com/web/v4.0/channel");
          if (playinfoUrl !== "") {
            var json = await getJson(playinfoUrl, undefined);
            if(json !== undefined) {
              let max= 0;
              let maxUrl = "";
              let hlsUrl = undefined;
              if(json.item.liveStatus == "LIVE") hlsUrl = json.liveHLSURLs;
              else hlsUrl = json.archivedHLSURLs;
              for(var i in hlsUrl) {
                let key = Number(i);
                if(Number.isNaN(key)) continue;
                if(max <= key && hlsUrl[key] !== null) {
                  max = key;
                  maxUrl = hlsUrl[key];
                }
              }
              SetResult(maxUrl, maxUrl, "right", "url");
            } else {
              SetResult("error", "", "right", "url");
            }
          } else if (jsonData.item.autoPlayURL !== null) {
            let liveUrl = jsonData.item.autoPlayURL.replace(/\/\d{3}/, "/720");
            SetResult(liveUrl, liveUrl, "right", "url");
          }
        } else {
          let liveNum = /([^\/]\d+?)$/.exec(url);
          let regexp = RegExp("\"item\":{\"id\":" + liveNum[1]);
          let results = regexp.exec(data.getAttribute("data-upcoming"));
          if (results !== null) {
            SetResult("Upcoming", "", "right", "url");
          }
        }
      }
    },
  },

  AbemaFresh = {
    domains: ["abemafresh\.tv", "freshlive\.tv"],
    GetFreshLiveKey: function (uri) {
      let keyDownLink = "";
      let parsing = /abemafresh:\/\/abemafresh\/([^\/]+)\/(.+)/.exec(uri);
      if (parsing !== null) {
        let key1 = parsing[1];
        let key2 = parsing[2];
        let secret = [1413502068, 2104980084, 1144534056, 1967279194, 2051549272, 860632952, 1464353903, 1212380503];
        let hash = CryptoJS.lib.WordArray.create(secret);
        let aesKey = CryptoJS.HmacSHA256(key1, hash);
        let decryptKey = CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({ciphertext:CryptoJS.enc.Hex.parse(key2)}),aesKey,{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.NoPadding}).toString();
        keyDownLink = "data:application/text;base64," + btoa(String.fromCharCode.apply(null, ToByteArray(decryptKey)));
      }
      return keyDownLink;
    },
    call: async (url) => {
      if(typeof(CryptoJS) == 'undefined') {
        let cryptojs = document.createElement('script');
        cryptojs.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';
        document.body.appendChild(cryptojs);
        setTimeout(start, 100);
        return;
      }

      let liveNum = /([^\/]\d+?)$/.exec(url);

      let archive = "";
      let json = await getJson("https://freshlive.tv/proxy/Programs;id=" + liveNum[1], {});
      if(json !== undefined)
      {
        let cstatus = json.data.status;
        if (cstatus == "onair") {
          SetResult("live", "", "left", "ex_status");
          SetResult(json.data.liveStreamUrl, json.data.liveStreamUrl, "right", "ex_live");
        }
        else if (cstatus == "archive") {
          SetResult("archive", "", "left", "ex_status");
          if(json.data.archiveStreamUrl)
            archive = (json.data.archiveStreamUrl);
          else
            archive = ("https://movie.freshlive.tv/manifest/" + liveNum[1] + "/archive.m3u8");
        }
      }
      if(archive === "") return;

      SetResult(archive, archive, "right", "ex_master");
      let bestlink = "";
      let content = await getContents(archive);
      if(content !== undefined) {
        let domain = archive.replace(/^(https?:\/\/[^:\/\s]+)(.+?)$/, "$1");
        let pattern = /^.+?,BANDWIDTH=(\d+?),.+?$\n^([^#].+?)$/gm;
        let matchArray;
        let maxBandwidth = 0;

        while ((matchArray = pattern.exec(content)) !== null) {
          let bandwidth = Number(matchArray[1]);
          if (maxBandwidth < bandwidth) {
            maxBandwidth = bandwidth;
            bestlink = domain + "" + matchArray[2];
          }
        }
      }
      if(bestlink === "") return;

      SetResult(bestlink, bestlink, "right", "ex_best");
      content = await getContents(bestlink);
      if(content !== undefined) {
        let domain = bestlink.replace(/^(https?:\/\/[^:\/\s]+)(.+?)$/, "$1");
        let pattern = /^([^\r\n]+)$/gm;
        let matchArray;
        let fixStr = "";

        while ((matchArray = pattern.exec(content)) !== null) {
          let str = matchArray[1];
          if(/^(#|https?)/.test(str)) {
            var findkey = /EXT-X-KEY.+URI="([^"]+)"/.exec(str);
            if(findkey !== null && findkey.length > 0) {
              SetResult('<a download="key.dat" href="' + AbemaFresh.GetFreshLiveKey(findkey[1]) + '">key</a>', bestlink, "left", "ex_key");
              fixStr += str.replace(findkey[1], "key.dat");
            }
            else
              fixStr += str;
          }
          else
            fixStr += (domain + str);
          fixStr += "\n";
        }
        SetResult('<a download="fix.m3u8" href="data:application/text;base64,' + btoa(fixStr) + '">fix m3u8</a>', bestlink, "right", "ex_fix");
      }
    },
  },

  ExtractInstagram = {
    domains: ["instagram\.com"],
    call: function (url) {
      let retn = Array();
      let meta = document.head.querySelector('[property="og:video:secure_url"]');
      if (meta === null)
        meta = document.head.querySelector('[property="og:video"]');

      if (meta !== null) {
        if (meta.content !== "") {
          retn[0] = "Archived";
          retn[1] = meta.content;
        }
      }

      ShowResult(retn, "black");
    },
  },

  ExtractNamaTV = {
    domains: ["namatv\.jp"],
    call: function (url) {
      let retn = Array();
      let account = "";
      let videoid = "";
      let element = document.getElementById("viewingScreen");
      if (element !== null) {
        account = element.getAttribute("data-account");
        videoid = element.getAttribute("data-video-id");
      }
      else {
        let data = document.body.innerHTML;
        let regexp = /var videoId = '(.+?)';/;
        let results = regexp.exec(data);
        if (results !== null) {
          videoid = results[1];

          regexp = /data-account="(.+?)" /;
          results = regexp.exec(data);
          if (results !== null)
            account = results[1];
        }
      }

      if((account !== "" && account !== null) && (videoid !== "" && videoid !== null))
      {
        $.ajax({
          type:"GET",
          url:"https://edge.api.brightcove.com/playback/v1/accounts/" + account + "/videos/" + videoid,
//          data : {contentId : results[1]},
          contentType: 'application/html',
          dataType: "json",
          success: function(xml) {
//            regexp = /"720"\s*:\s*"(.+?)"/;
            let vodUrl = xml.sources[0].streaming_src;
            if (vodUrl !== null) {
              retn[1] = vodUrl;
            }
            else {
              retn[1] = "error";
            }
            ShowResult(retn, "");
          },
          error: function(xhr, status, error) {
            retn[1] = "error";
            ShowResult(retn, "");
          }
        });
      }
    }
  },

  ExtractPandoraTV = {
    domains: ["pandora\.tv"],
    call: function (url) {
      let extractVideoUrl = document.getElementById("qVideo");
      if(extractVideoUrl !== null)
      {
        let extractVideoResolution = document.getElementsByClassName("resolution");
        if(extractVideoResolution !== null && extractVideoResolution.length > 0)
        {
          let extractVideoTitle = document.head.querySelector('[name="title"]').content.replace(/[:"\?\*]/g, '').replace(/[\|\\\/.]/g, '_');

          let buttonArea = document.getElementsByClassName("etc");
          let downloadBtn = document.createElement('a');
          downloadBtn.setAttribute('href', extractVideoUrl.getAttribute("src") + '&title=' + extractVideoTitle);
          downloadBtn.setAttribute('download', extractVideoTitle + '.mp4');
          downloadBtn.innerText = 'Download(' + extractVideoResolution[0].innerText + ')';
          buttonArea[0].appendChild(downloadBtn);
          return;
        }
      }

      {
        let retn = Array();
        retn[1] = "error";
        ShowResult(retn, "");
      }
    }
  },

  ExtractTwitter = {
    domains: ["twitter\.com"],
    call: function (url) {
      let retn = Array();
      let postNum = /([^\/]\d+?)$/.exec(url);
      if (postNum !== null) {
        $.ajax({
          type:"GET",
          url:"https://api.twitter.com/1.1/videos/tweet/config/" + postNum[1] + ".json",
          dataType: "json",
          beforeSend: function(req) {
            req.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw");
          },
          success: function(data) {
            retn[0] = "Archived";
            retn[1] = data.track.playbackUrl;
            ShowResult(retn, "");
          },
          error: function(xhr, status, error) {
            retn[1] = "error";
            ShowResult(retn, "");
          }
        });
      }
      else
      {
        retn[0] = "url error";
        retn[1] = "";
        ShowResult(retn, "");
      }
    }
  },

  Afreecatv = {
    domains: ["vod\.afreecatv\.com"],
    call: async (url) => {
      let vid = (url.match(/player\/(\d+)/) ? RegExp.$1 : '');
      if ('' === vid) return;

      let api = "https://api.m.afreecatv.com/station/video/a/view";
      let level = 10;
      let data = new URLSearchParams({"nTitleNo":vid,"nApiLevel":level});
      let recv = await Common.GetJson(api, {method:'POST', body:data, credentials:'include'});

      let date = (undefined !== recv.data.broad_start ? recv.data.broad_start : recv.data.write_tm).replace(/(\d+)-(\d+)-(\d+)\s*\d+:\d+:\d+/, "$1$2$3");
      let maintitle = Common.SafeTitle(date + " " + recv.data.full_title);
      let is_chapter = (1 < recv.data.files.length);

      let part = 1;
      for (let file of recv.data.files) {
        let master_hls = '';
        let max_bit = 0;
        let max_hls = '';
        let max_label = '원본화질';
        for (let hls of file.quality_info) {
          let bitrate = Number(hls.bitrate.replace('k', ''));
          if (0 == bitrate) {
            master_hls = hls.file;
          }
          else if (max_bit < bitrate) {
            max_bit = bitrate;
            max_hls = hls.file;
            max_label = hls.label;
          }
        }

        if ('' === max_hls) max_hls = file.file;
        let title = maintitle + (is_chapter ? `_part${file.file_order}` : '');

        console.log("label : " + max_label);
        console.log("title : " + title);
        console.log("url : " + master_hls);
        console.log("max url : " + max_hls);

        SetResult(title, title, "left", "ex_title"+file.file_order);
        SetResult(max_label, max_hls + "\n" + title + "\n", "right", "ex_best"+file.file_order);

        //SetResult(title, title, "left", "ex_title");
        //SetResult("hide"+file.file_order, master + "\n" + title + "_hide\n", "right", "ex_master");
      }
    }
  },

  ExtractXVideo = {
    domains: ["xvideos"],
    call: async (url) => {
      let title = "";
      let mp4url = "";

      if(html5player.video_title)
        title = html5player.video_title;
      else
        title = html5player.id_video;

      if(html5player.url_high) {
        mp4url = html5player.url_high;
        SetResult("high", title, "left", "ex_title");
      }
      else if(html5player.url_low) {
        mp4url = html5player.url_low;
        SetResult("low", title, "left", "ex_title");
      }

      if(mp4url !== "") {
        SetResult("<a href='" + mp4url + "' download='" + title + "'>mp4</a>", "mp4", "right", "ex_mp4");
      }

      if(html5player.url_hls) {
        let hlsurl = "";
        let content = await getContents(html5player.url_hls);
        if(content !== undefined) {
          let domain = html5player.url_hls.replace(/^(.+\/)[^\/]+$/, "$1");
          let pattern = /^.+?,BANDWIDTH=(\d+?),.+?$\n^([^#].+?)$/gm;
          let matchArray;
          let maxBandwidth = 0;

          while ((matchArray = pattern.exec(content)) !== null) {
            let bandwidth = Number(matchArray[1]);
            if (maxBandwidth < bandwidth) {
              maxBandwidth = bandwidth;
              hlsurl = domain + "" + matchArray[2];
            }
          }
        }
        SetResult("hls", "hls", "left", "ex_titleh");
        SetResult("hls", hlsurl + "\n" + title + "\n", "right", "ex_hls");
      }
    },
  },

  GyaoFR = {
    domains: ["gyao\.yahoo\.co\.jp\/fr"],
    call: async (url) => {
      if(null === url.match(/\/fr\/(\d+)/)) {
        return;
      }

      let appid = "dj00aiZpPXNlZ0VxQnM4MklNNiZzPWNvbnN1bWVyc2VjcmV0Jng9ZDU-"
      let vid = RegExp.$1;
      let content = await getContents(`https://gyao.yahoo.co.jp/apis/5glab-fr-playback-data/movie/${vid}?appid=${appid}`);
      let json = content;//JSON.parse(content);
      if(undefined === json.tracking) {
        return;
      }
      //console.log(json);
      AddDownResult(json.tracking.playlist_xml, "", "xml");

      let date = (null !== json.start_date.match(/(\d{4})\W+(\d{2})\W+(\d{2})/) ? `${RegExp.$1+RegExp.$2+RegExp.$3}` : "");
      let title = date + " " + json.tracking.title;

      AddDownResult(json.tracking.thumbnail_image_url, "", "thum");

      for(let channel of json.tracking.tracking_channels) {
        if(null !== channel.thumbnail_image_url.match(/[^\/]+(\.\w{2,})(?=\?|$)/)) {
          AddDownResult(channel.thumbnail_image_url+`?title=${channel.view_id}_${channel.label}${RegExp.$1}`, `${channel.view_id}_${channel.label}${RegExp.$1}`, channel.view_id);
        }
      }

      let base = (null !== json.tracking.playlist_xml.match(/^(.+\/)/) ? `${RegExp.$1}` : "");
      if("" === base) {
        return;
      }

      content = await getContents(json.tracking.playlist_xml);
      let parser = new DOMParser();
      let xml = parser.parseFromString(content, "text/html");
      let views = xml.getElementsByTagName("view");
      for(let view of views) {
        let id = view.getAttribute("id");
        let uri = view.getAttribute("uri");
        let url = base + uri;
        AddDownResult(url+`?title=${id}.m3u8`, "", `playlist${id}`);

        let playbase = (null !== url.match(/^(.+\/)/) ? `${RegExp.$1}` : "");
        if("" === playbase) {
          continue;
        }
        content = await getContents(url);
        if(null !== content.match(/^((?:audio|video_17).+)$/gm)) {
          AddCopyResult(playbase+RegExp.$1+`\n${id}\n`, playbase+RegExp.$1, `down${id}`);
        }
      }
    }
  },

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
                AddCopyResult(`${mpdUrl}\n${licenseUrl}\n${pssh}\n${title}_${type}\n`, "all", `all_${type}`);
                break;
              }
            }
          }
        }
//      });
    },
  },

  Idolplus = {
    domains: ["idolplus.com"],
    headers: {
      App_type: 'web',
      Client_ip: '100.200.030.040',
      Country_code: 'KR',
    },
    getData: (data, key) => {
      let re = new RegExp(`({[^{}]+?${key}[^{}]+?})`, 'g');
      return (null !== data.match(re) ? RegExp.$1 : '');
    },
    call: async function (url) {
      let id = (null !== url.match(/albumId=([^&]+)/) ? RegExp.$1 : '');
      if ('' === id) return;
      let param = {
        rulesetId: 'contents',
        albumId: id,
        distribute: 'PRD',
        loggedIn: 'false',
        osName: 'windows',
        browserName: 'chrome',
        userAgnet: 'ect',
        region: 'zk',
        countryGroup: '00010',
        lang: 'ko',
        saId: 999999999998,
        isTester: 'N',
        page: 1,
      };
      const urlparam = new URLSearchParams(param).toString();
      let api = 'https://idolplus.com/api/zk/viewdata/ruleset/build';
      let json = await Common.GetHls(`${api}?${urlparam}`, {headers:this.headers, credentials:'include'});
      let master = (null !== json.match(/"video_url"\s*:\s*"([^"]+)"/) ? RegExp.$1 : '');
      console.log(master);
      let m3u8 = await Common.GetHls(master);
      let best = Common.GetBestHls(m3u8);
      let base = (null !== master.match(/^(.+\/)/) ? RegExp.$1 : '');
      console.log(`${base}${best.link}`);
      let title = JSON.parse(this.getData(json, '콘텐츠 상세 타이틀'));
      let time = JSON.parse(this.getData(json, '콘텐츠 상세 시간'));

      let name = Common.SafeTitle(`${time.title.replace('.', '')} ${title.title}`);
      AddCopyResult(`${base}${best.link}\n${name}\n`, 'copy', 'copy');
    }
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
      '<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: pink; font: 12px Meiryo;">' + status + '</div>',
      '<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + '; font: 12px Meiryo;"><a href="' + extractLink + '">' + extractLink + '</div>',
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
      'font: 12px Meiryo;',
      'vertical-align: middle;',
    ].join(' ');
    document.body.style.cssText = 'position: relative; margin-top: 45px';
    document.body.parentElement.insertBefore(trends_dom, document.body);
  }

  function CreateTable(col, row, color = "") {
    if (color === "")
      color = "white";

    var row_dom = document.createElement('div');
    row_dom.setAttribute('id', row);
    row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo;');
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
    document.body.style.cssText = 'position: relative; margin-top: 0px';
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

  start();
})();