// ==UserScript==
// @name           Save Text
// @description    save content text
// @match *://*
// @namespace https://greasyfork.org/users/3920
// @version 0.0.1.20241226180029
// @downloadURL https://update.greasyfork.org/scripts/521886/Save%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/521886/Save%20Text.meta.js
// ==/UserScript==

(function() {
  function Convert(title) {
    return title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％");
  }

  function CheckDuplicate(file, lists) {
    if (lists.includes(file)) {
      let [name, ext] = (file.match(/^(.+)\.([^.]+)$/) ? [RegExp.$1,  RegExp.$2]: ['', '']);
      //console.log(`name: ${name}, ext: ${ext}`);
      let index = 1;
      do {
        file = `${name} (${index}).${ext}`;
        ++index;
      } while (lists.includes(file));
    }
    lists.push(file);
    //console.log(`add: ${file}`);
    return file;
  }

  function GetFilename(url) {
    return fetch(url, { method:'HEAD' }).then((res) => {
      const header = res.headers.get('Content-Disposition');
      const parts = header.split(';');
      let filename = parts[1].split('=')[1];
      return filename;
    });
  }

  function GetJson(url, options = {}) {
    return fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
  }

  function GetHtml(url, options = {}) {
    return fetch(url, options)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let parser = new DOMParser();
      let xml = parser.parseFromString(data, "text/html");
      return xml;
    });
  }

  function TagToStr(tags) {
    let tagstr = '';
    for (let tag of tags) {
      tagstr += `#${'object' == typeof(tag) ? tag.tag : tag} `;
    }
    return tagstr;
  }

  function Save(text, filename) {
    let b = new Blob([text], {type : 'application/text'});
    let f = new FileReader();
    f.onload = function(e) {
      let a = document.createElement('a');
      a.setAttribute('download', `${filename}`);
      a.href = e.target.result;
      a.click();
    };
    f.readAsDataURL(b);
  }

  let modules = [

    pixiv_novel_main = {
      filters: ['pixiv.net/novel/series'],
      filename: '',
      GetName: function (url) {
        return `${filename}.txt`;
      },
      GetContents: async function (url) {
        let id = (document.location.href.match(/\/series\/(\d+)/) ? RegExp.$1 : '');
        let j = await GetJson(`https://www.pixiv.net/ajax/novel/series/${id}`);
        let title = j.body.title;
        let desc = j.body.caption;
        let tags = TagToStr(j.body.tags);
        filename = Convert(title);

        let setup = '[設定資料]\n';
        j = await GetJson(`https://www.pixiv.net/ajax/novel/series/${id}/glossary`);
        j.body.categories.forEach((c) => {
          setup += `[${c.name}]\n`;
          c.items.forEach((i) => {
            setup += `${i.name}\n${i.overview}\n\n`;
          });
        });

        return ( `[Series]\n${title}\n\n[Description]\n${desc}\n\n[Tags]\n${tags}\n\n${setup}`);
      },
    },

    pixiv_novel_show = {
      filters: ['pixiv.net/novel/show.php'],
      filename: '',
      GetName: function (url) {
        return `${filename}.txt`;
      },
      GetContents: async function (url) {
        let doc = await GetHtml(document.location.href);
        let dom = doc.getElementById('meta-preload-data');
        let j = JSON.parse(dom.content);
        for (let k of Object.keys(j.novel)) {
          let novel = j.novel[k];
          let title = novel.title;
          let desc = novel.description.replace(/<[bB][rR]\s*\/>/g, '\n');;
          let content = novel.content;
          let tags = TagToStr(novel.tags.tags);

          if (novel.seriesNavData) {
            let series = `${novel.seriesNavData.title} #${novel.seriesNavData.order}`;
            filename = Convert(`${series} : ${title}`);
            return ( `[Series]\n${series}\n\n[Title]\n${title}\n\n[Description]\n${desc}\n\n[Tags]\n${tags}\n\n[Text]\n${content}`);
          } else {
            filename = Convert(`${title}`);
            return ( `[Title]\n${title}\n\n[Description]\n${desc}\n\n[Tags]\n${tags}\n\n[Text]\n${content}`);
          }
        }
      },
    },

  ];

  function deferredAddZip(url, filename, zip) {
    var deferred = $.Deferred();
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if (err) {
        console.log(url);
        deferred.reject(err);
      } else {
        zip.file(filename, data, {
          binary: true
        });
        deferred.resolve(data);
      }
    });
    return deferred;
  }

  function resolveAfter() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('resolved');
      }, 100);
    });
  }

  async function BatchDownload(imgs, title) {
    let zip = new JSZip();
    let deferreds = [];

    console.log("Downloading...");

    files = [];
    for (let cup of imgs) {
      if ('' == cup.link) continue;
      if ('' == cup.name)
        cup.name = (cup.link.match(/\/([^\/\?]+)(?:\?|$)/) ? RegExp.$1 : '');
      if ('' == cup.name) {
        console.log(`error no name: ${cup.link}`);
        continue;
      }
      cup.name = CheckDuplicate(cup.name, files);
      deferreds.push(deferredAddZip(cup.link, cup.name, zip));
      //console.log(`${cup.base}${cup.file}`);
      const result = await resolveAfter();
      //break;
    }

    // when everything has been downloaded, we can trigger the dl
    $.when.apply($, deferreds).done(function () {
      zip.generateAsync({ type: "blob" })
      .then(function (blob) {
        // use content
        saveAs(blob, `${title}.zip`);
      });
    }).fail(function(err) {
      console.log(err);
    });
    return false;
  }

  function injector(src) {
    return new Promise(resolve => {
      if (src.type == 'undefined') {
        const script = document.createElement("script");
        script.onload = resolve;
        script.setAttribute("src", src.url);
        document.getElementsByTagName('body')[0].appendChild(script);
      } else {
        console.log('skip injection');
        resolve();
      }
    });
  }

  async function init () {
    const inject = [
      {"url":"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", "type":typeof(jQuery)},
      {"url":"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", "type":typeof(JSZip)},
      {"url":"https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js", "type":typeof(JSZipUtils)},
      {"url":"https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js", "type":typeof(saveAs)},
    ];

    for (let script of inject) {
      console.log(`injection: ${script.url}`);
      await injector(script);
      console.log(`injection complete: ${script.url}`);
    }

    console.log('init complete');
  }

  let start = async function() {
    await init();

    let url = document.location.href;
 
    // page open failed
    if(typeof(loadTimeData) !== "undefined") {
      url = loadTimeData.data_.summary.failedUrl;
    }
 
    for(let module of modules) {
      if (module.filters.some(t => url.match(t))) {
        let contents = await module.GetContents(url);
        let name = await module.GetName(url);
        console.log(name);
        console.log(contents);
        Save(contents, name);
        break;
      }
    }
  }

  start();
})();