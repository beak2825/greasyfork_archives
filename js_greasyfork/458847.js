// ==UserScript==
// @name           Extract FR
// @description    Extract only FR in 5glab
// @match *://*
// @namespace https://greasyfork.org/users/3920
// @version 0.0.1.20230128133050
// @downloadURL https://update.greasyfork.org/scripts/458847/Extract%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/458847/Extract%20FR.meta.js
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

  function btoa_utf8(value) {
    return btoa(
      String.fromCharCode(
        ...new TextEncoder('utf-8')
          .encode(value)
      )
    );
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
    let style = "color: #eee; background-color: dodgerblue; border-radius: 0.25rem; padding: 0em 0.5rem;";
    // border: 1px solid #fff;
    if("" === name) {
      SetResult(`<a style="${style}" href="${url}">${url}</a>`, "", "right", title);
    } else {
      SetResult(`<a style="${style}" href="${url}" download="${name}">${name}</a>`, "", "right", title);
    }
  }

  function AddCopyResult(url, name, title) {
    SetResult(name, url, "right", title);
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
  };

  let modules = [
//****** module start!!

  FR = {
    domains: ["5glab"],
    headers: {
      'Accept': 'application/json;pk=BCpkADawqM1l5pA4XtMLusHj72LGzFewqKZzldpmNYTUQdoKnFL_GHhN3dg5FRnNQ5V7SOUKBl-tYFMt8CpSzuSzFAPhIHtVwmMz6F52VnMfu2UjDmeYfvvUqk0CWon46Yh-CZwIVp5vfXrZ',
      'X-OS-TYPE': 'ANDROID',
      'X-APP-VERSION': '1.2.3',
      'X-APP-BUILD': '29',
      'X-FIVE-G-PROMOTION-ACCESSTOKEN': '- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYjhhMDQwZjQtMjY5ZS0xMWVkLTliZGQtMGE1OGE5ZmVhYzAyIiwiYWRtaW4iOmZhbHNlLCJleHAiOjE2NjE2ODA2NjZ9.uE2LbqHMt08kygFU0QtrvzOMPw-hbhq6jjse2rggwis',
    },
    Extract: async (contentid, elem) => {
      let json_url = `https://api.multi.vsp.mb.softbank.jp/api/v1/movies/${contentid}`;
      let content = await Common.GetJson(json_url, {headers:FR.headers});
      if (undefined === content.movie) {
        return;
      }

      let json = content.movie;
      if (undefined === json.tracking) {
        return;
      }
      let result_dom = document.getElementById('extractresult');
      if (null !== result_dom) result_dom.remove();

      //console.log(json);
      let date = (null !== json.start_date.match(/(\d{4})\W+(\d{2})\W+(\d{2})/) ? `${RegExp.$1+RegExp.$2+RegExp.$3}` : "");
      let title = date + " " + json.tracking.title;

      AddCopyResult(title, title, "title");
      AddDownResult("data:application/text;base64," + btoa_utf8(JSON.stringify(json)), `${contentid}.json`, "json");
      AddDownResult(json.tracking.playlist_xml, "", "xml");

      if (null !== json.tracking.thumbnail_image_url.match(/[^\/]+(\.\w{2,})(?=\?|$)/)) {
        let thum_title = `thumbnail${RegExp.$1}`;
        AddDownResult(json.tracking.thumbnail_image_url+`?title=${thum_title}`, thum_title, "thum");
      }

      for (let channel of json.tracking.tracking_channels) {
        if (null !== channel.thumbnail_image_url.match(/[^\/]+(\.\w{2,})(?=\?|$)/)) {
          let track_title = `${channel.view_id}_${channel.label}${RegExp.$1}`;
          AddDownResult(channel.thumbnail_image_url+`?title=${track_title}`, track_title, channel.view_id);
        }
      }

      let base = (null !== json.tracking.playlist_xml.match(/^(.+\/)/) ? `${RegExp.$1}` : "");
      if ("" === base) {
        return;
      }

      let all_hls = '';
      content = await Common.GetXml(json.tracking.playlist_xml);
      let xml = content;
      let views = xml.getElementsByTagName("view");
      for (let view of views) {
        let id = view.getAttribute("id");
        let uri = view.getAttribute("uri");
        let url = base + uri;
        AddDownResult(url+`?title=${id}.m3u8`, "", `playlist${id}`);

        let playbase = (null !== url.match(/^(.+\/)/) ? `${RegExp.$1}` : "");
        if ("" === playbase) {
          continue;
        }
        content = await Common.GetHls(url);
        if (null !== content.match(/^((?:audio|video_17).+)$/gm)) {
          all_hls += playbase+RegExp.$1+`\n${id}\n`;
        }
      }
      AddCopyResult(all_hls+'\n', 'copy HLS', 'hls');
      elem.style.outlineColor = 'deeppink';
    },
    call: (url) => {
      let dom = document.getElementById('toApp');
      let lists = dom.getElementsByTagName('li');
      for (let item of lists) {
        let links = item.getElementsByTagName('a');
        for (let link of links) {
          let url = decodeURIComponent(link.getAttribute('href'));
          let id = (null !== decodeURIComponent(url).match(/(?:frsquare:\/\/open\/contents\/(\d+)|\/fr\/(\d+))/) ?
                       (RegExp.$1 || RegExp.$2) : '');
          if ('' !== id) {
            //console.log(id);
            link.removeAttribute('href');
            link.setAttribute('onclick', `FR.Extract(${id}, this)`);
            link.setAttribute('style', 'outline-style: dotted; outline-color: pink; outline-width: thick;');
          }
        }
      }
    },
  },

//****** module end!!
  ];

  function start() {
    let domain = window.location.host;
    let url = document.location.href;

    for (let module of modules) {
      if (module.domains.some(t => domain.match(t))) {
        module.call(url);
        break;
      }
    }
  }
  start();
})();