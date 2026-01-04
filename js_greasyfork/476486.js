// ==UserScript==
// @name           Save Image
// @description    save all content images
// @match *://*
// @namespace https://greasyfork.org/users/3920
// @version 0.0.1.20251227122929
// @downloadURL https://update.greasyfork.org/scripts/476486/Save%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/476486/Save%20Image.meta.js
// ==/UserScript==

(function() {
  function Convert(title) {
    return title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％");
  }

  function Numbering(n) {
    return String(n).padStart(2, '0');
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

  function CheckUrl(url) {
    return fetch(url, {
      method: 'HEAD',
    })
    .then((response) => {
      return response.status;
    })
    .then((data) => {
      return data;
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

  function FindClass(name) {
    for (let doms of document.querySelectorAll(`span[class^="${name}"]`)) {
      return doms.textContent;
    }
  }

  let modules = [
    tcafe = {
      domains: ["tcafe2a"],
      GetName: async function (url) {
        let title = document.getElementsByTagName('h1')[0].textContent.replace(/\s+/g, '');
        let id = (url.match(/wr_id=(\d+)/) ? RegExp.$1 : '');
        return Convert(`${title}_${id}`);
      },
      GetList: async function (url, lists) {
/*
        for (let link of document.getElementsByClassName('view_image')) {
          let url = link.getAttribute('href').replace('tcafe2a.com/bbs/view_image.php?fn=/data/editor', 'i2.tcafe2a.com');
          //console.log(url);
          lists.push({'link': url});
        }
*/
        for (let link of document.getElementsByClassName('img-tag')) {
          //if (null !== link.getAttribute('title')) continue;
          let url = link.getAttribute('src').replace(/^http:/, 'https:');
          //console.log(url);
          lists.push({'link': url, 'name': ''});
        }

        for (let link of document.getElementsByClassName('jwplayer')) {
          //if (null !== link.getAttribute('title')) continue;
          let id = link.getAttribute('id');
          let jw = jwplayer(id);
          console.log(jw.config);
          lists.push({'link': jw.config.file, 'name': ''});
          lists.push({'link': jw.config.image, 'name': ''});
        }

        // 링크 형태로 추가된 파일
        let checklist = [];
        for (let content of document.getElementsByClassName('view-content')) {
          for (let link of content.getElementsByTagName('a')) {
            if ('view_image' == link.getAttribute('class')) continue;
            let url = link.getAttribute('href').replace(/^http:/, 'https:');
            if (checklist.includes(url)) continue;
            //console.log(url);
            lists.push({'link': url, 'name': ''});
            checklist.push(url);
          }
        }
      },
    },

    ruliweb = {
      domains: ["ruliweb"],
      GetName: async function (url) {
        for (let doms of document.getElementsByClassName('subject_inner_text')) {
          let title = doms.textContent;
          let id = (url.match(/\/read\/(\d+)/) ? RegExp.$1 : '');
          return Convert(`${title}_${id}`);
        }
      },
      GetList: async function (url, lists) {
        for (let main of document.getElementsByTagName('article')) {
          // image
          for (let img of main.getElementsByTagName('img')) {
            let url = img.getAttribute('src').replace('.ruliweb.net', '.ruliweb.com').replace(/^http:/, 'https:');
            let ori_url = url.replace(/\/img\//, '/ori/');
            let status = await CheckUrl(ori_url);
            if (200 != status) {
              console.log(`dead link: ${ori_url}`);
            } else {
              url = ori_url;
            }
            //console.log(url);
            lists.push({'link': url, 'name': ''});
          }

          // video
          for (let video of main.getElementsByTagName('video')) {
            let url = video.getAttribute('src').replace('.ruliweb.net', '.ruliweb.com');
            url = url.replace(/\/img\//, '/ori/');
            url = url.replace(/\.mp4\?(\w+)/, '.$1');
            //console.log(url);
            lists.push({'link': url, 'name': ''});
          }
        }

        // comment image
        for (let img of document.getElementsByClassName('comment_img')) {
          let url = img.getAttribute('src').replace('.ruliweb.net', '.ruliweb.com');
          url = url.replace(/\/img\//, '/ori/');
          //console.log(url);
          lists.push({'link': url, 'name': ''});
        }
      },
    },

    dcinside = {
      domains: ["dcinside"],
      GetName: async function (url) {
        let title = document.getElementsByClassName('title_subject')[0].textContent;
        let id = (url.match(/[\?&]no=(\d+)/) ? RegExp.$1 : '');
        return Convert(`${title}_${id}`);
      },
      GetList: async function (url, lists) {
        // 첨부된 이미지
        for (let append of document.getElementsByClassName('appending_file')) {
          for (let file of append.getElementsByTagName('a')) {
            let url_orig = file.getAttribute('href');
            let url_fix = url_orig.replace('download.php', 'download_ajax2.php').replace(/&f_no=[^&]*/, '');
            let name = Convert(file.textContent);
            //console.log(url);
            lists.push({'link': url_fix, 'orig': url_orig, 'name': name});
          }
        }

        // iframe로 추가된 비디오
        for (let frame of document.getElementsByTagName('iframe')) {
          if (/(widget|doubleclick)/.test(frame.src)) continue;
          let id = frame.getAttribute('id');
          for (let wrap of frame.contentDocument.getElementsByClassName('video_wrap')) {
            for (let img of wrap.getElementsByTagName('video')) {
              let url = img.getAttribute('poster');
              let name = (url.match(/type=([^&]+)/) ? `${id}.${RegExp.$1}` : '');
              lists.push({'link': url, 'orig': '', 'name': name});
            }
            for (let img of wrap.getElementsByTagName('source')) {
              let url_fix = img.getAttribute('src');
              let name = (url_fix.match(/type=([^&]+)/) ? `${id}.${RegExp.$1}` : '');
              lists.push({'link': url_fix, 'orig': '', 'name': name});
            }
          }
        }

        // 첨부되지 않은 내부 링크 이미지
        if (0 >= lists.length) {
          for (let wrap of document.getElementsByClassName('imgwrap')) {
/*
            for (let img of wrap.getElementsByTagName('img')) {
              if (null == img.getAttribute('id')) continue;
              let url_fix = img.getAttribute('src');
              let name = await GetFilename(url_fix);
              lists.push({'link': url_fix, 'orig': '', 'name': name});
            }
*/
            for (let img of wrap.getElementsByTagName('video')) {
              let url_fix = img.getAttribute('data-src');
              let name = await GetFilename(url_fix);
              lists.push({'link': url_fix, 'orig': '', 'name': name});
            }
/*
            for (let img of wrap.getElementsByTagName('source')) {
              let url_fix = img.getAttribute('src');
              let name = await GetFilename(url_fix);
              lists.push({'link': url_fix, 'orig': '', 'name': name});
            }
*/
          }
        }

        // 첨부되지 않은 외부 링크 이미지
        for (let wrap of document.getElementsByClassName('write_div')) {
          for (let img of wrap.getElementsByTagName('img')) {
            let url_fix = img.getAttribute('src');
            let inside = url_fix.includes('dcinside.co.kr');
            let name = (inside ? await GetFilename(url_fix) : img.getAttribute('alt'));
            lists.push({'link': url_fix, 'orig': '', 'name': name});
          }
        }
      },
    },

    arca = {
      domains: ["arca.live"],
      GetFileName: function () {
        let title = document.querySelector('.title-row > .title').lastChild.textContent.trim().replace(/[\n\t]+/g, '');
        return Convert(title);
      },
      GetName: async function (url) {
        let id = (url.match(/\/(\d+)/) ? RegExp.$1 : '');
        return Convert(`${this.GetFileName()}_${id}`);
      },
      GetList: async function (pageurl, lists) {
        let filename = this.GetFileName();
        let index = 0;

        // 본문 추출 여부
        if (confirm('본문을 포함할까요?')) {
          let name = `${filename}.html`;
          lists.push({'link': document.querySelector('.article-content').innerHTML, 'name': name});
        }

        for (let main of document.getElementsByClassName('article-body')) {
          for (let a of main.getElementsByTagName('a')) {
            let url = a.href;
            if (/\.namu\.la/.test(url)) {
              let name = (url.match(/\.(\w+)\?/) ? `${filename}_${index}.${RegExp.$1}` : '');
              let status = await CheckUrl(url);
              if (200 != status) {
                console.log(`dead link: ${url}`);
                url = a.querySelector('img').src;
              }
              lists.push({'link': url, 'name': name});
              ++index;
            }
          }
        }

        index = 0;
        for (let main of document.getElementsByClassName('article-body')) {
          for (let v of main.getElementsByTagName('video')) {
            let url = v.src;
            if (/\.namu\.la/.test(url)) {
              let name = (url.match(/\.(\w+)\?/) ? `${filename}_${index}.${RegExp.$1}` : '');
              lists.push({'link': url, 'name': name});
              ++index;
            }
          }
        }
      },
    },

    fmk = {
      domains: ["fmkorea"],
      GetName: function (url) {
        let title = document.querySelector('.np_18px_span').textContent.trim().replace(/[\n\t]+/g, '');
        let id = (url.match(/\/(\d+)/) ? RegExp.$1 : '');
        return Convert(`${title}_${id}`);
      },
      GetList: async function (url, lists) {
        let mapFiles = [];
        for (let files of document.querySelectorAll('div.rd_file')) {
          for (let filename of files.querySelectorAll('[data-href]')) {
            mapFiles.push(filename.textContent);
          }
        }

        let count = 0;
        for (let a of document.querySelectorAll('img.auto_insert')) {
          let url = decodeURIComponent((a.dataset.original || a.src)).replace(/^\/\//, `${window.location.protocol}//`);
          lists.push({'link': url, 'name': (mapFiles[count] || '')});
          ++count;
        }
      },
    },

    tpi = {
      domains: ["torrentpi"],
      GetName: function () {
        let title = document.querySelector('h1[itemprop="headline"]').textContent.trim().replace(/[\n\t]+/g, '');
        return Convert(title);
      },
      GetList: async function (url, lists) {
        for (let file of document.querySelectorAll('.list-group-item')) {
          let url = file.href;
          for (let filename of file.childNodes) {
            if ('#text' == filename.nodeName) {
              let name = (filename.nodeValue.match(/\s*(.+)\s\(/) ? RegExp.$1 : '');
              lists.push({'link': url, 'name': name});
            }
          }
        }

        for (let main of document.querySelectorAll('article')) {
          for (let a of main.querySelectorAll('.view_image, div>.img-tag, span>.img-tag, .view-content>p>.img-tag')) {
            let url = decodeURIComponent((a.href || a.src)).replace(/(\/bbs\/view_image.php\?fn=|^http.+\/view_img\.php\?img=)/, '');
            lists.push({'link': url, 'name': name});
          }
        }
      },
    },

    smartstore = {
      domains: ["smartstore"],
      GetName: async function (url) {
        return Convert(document.querySelector('._22kNQuEXmb').textContent);
      },
      GetList: async function (url, lists) {
        for (let img of document.querySelectorAll('.bd_1Niq0, .se-image-resource')) {
          let url = (img.dataset.src || img.src).replace(/\?.+/, '');
          lists.push({'link': url, 'name': ''});
        }
      },
    },

    red52 = {
      domains: ["red52"],
      GetName: async function (url) {
        let title = document.getElementsByTagName('h1')[0].textContent.replace(/[\n\t]+/g, '');
        let id = (url.match(/\/(\d+)/) ? RegExp.$1 : '');
        return Convert(`${title}_${id}`);
      },
      GetList: async function (url, lists) {
        for (let main of document.getElementsByClassName('article-content')) {
          // image
          for (let img of main.getElementsByTagName('img')) {
            let url = img.getAttribute('src');
            url = url.replace(/(\/media\/[^\/]+).*$/, '$1');
            //console.log(url);
            lists.push({'link': url, 'name': ''});
          }

          // video
          for (let video of main.getElementsByTagName('source')) {
            let url = video.getAttribute('src');
            //console.log(url);
            lists.push({'link': url, 'name': ''});
          }
        }
      },
    },

    sugarnet = {
      domains: ["sugar-net"],
      GetName: async function (url) {
        return Convert(document.querySelector('.detail_page_title>.goods_name').textContent);
      },
      GetList: async function (url, lists) {
        for (let main of document.querySelectorAll('.detail_item_photo>.list_item_table>.list_item_row')) {
          // image
          for (let img of main.getElementsByTagName('a')) {
            let url = img.getAttribute('href');
            url = url.replace(/\?.*$/, '');
            //console.log(url);
            lists.push({'link': url, 'name': ''});
          }
        }
      },
    },

    mobile01 = {
      domains: ["mobile01.com"],
      GetName: async function (url) {
        return Convert(document.querySelector('.l-heading__title>h1').textContent);
      },
      GetList: async function (url, lists) {
        for (let main of document.querySelectorAll('.l-publish__content')) {
          //기본 이미지
          for (const img of main.querySelectorAll('[itemprop="articleBody"]>img')) {
            //console.log(img.src);
            lists.push({'link': img.src, 'name': ''});
          }

          //그룹 이미지
          for (const group of main.querySelectorAll('.imageset>.group-img-thumbs>.l-thumbGallery__item')) {
            for (const img of group.querySelectorAll('div')) {
              //console.log(decodeURIComponent(img.getAttribute('data-img')));
              lists.push({'link': decodeURIComponent(img.getAttribute('data-img')), 'name': ''});
            }
          }

          //원본 이미지
          for (const link of main.querySelectorAll('[itemprop="articleBody"]>a')) {
            const url = link.href;
            const type = link.getAttribute('data-fancybox');
            if (url.includes('original=') || type == 'images')
              lists.push({'link': url, 'name': ''});
              //console.log(`type: ${type}, url: ${url}`);
          }
        }
      },
    },

    mangabox = {
      domains: ["mangabox"],
      DecryptImage: async function (url, key) {
        try {
          // 1. 데이터 가져오기 (response를 arrayBuffer로 받음)
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();

          // 2. 바이트 단위로 조작하기 위해 Uint8Array로 변환
          const encryptedData = new Uint8Array(buffer);

          // 3. XOR 복호화 진행 (원본 배열을 직접 수정하거나 새 배열 생성)
          // 원본을 보존해야 한다면 .map()을, 성능이 중요하다면 제자리 수정을 사용합니다.
          for (let i = 0; i < encryptedData.length; i++) {
            encryptedData[i] = encryptedData[i] ^ key;
          }

          return encryptedData;
        } catch (error) {
          console.error("이미지 복호화 중 오류 발생:", error);
        }
      },
      GetName: async function (url) {
        let main = FindClass('_title__main_');
        let sub = FindClass('_title__sub_');
        let title = `${main} ${sub}`;
        return Convert(title);
      },
      GetList: async function (url, lists) {
        let id = (url.match(/\/episodes\/(\d+)/) ? RegExp.$1 : '');
        if ('' === id) return;
        let api = `https://www.mangabox.me/api/honshi/episode/${id}/images`;
        let data = await GetJson(api);
        //console.log(data);
        for (let img of data.imageUrls) {
          let url_fix = img.replace(/\?.*$/, '').replace(/\/webp\//, '/').replace(/\.webp$/, '.jpg');
          let name = (url_fix.match(/\/([^\/\?]+)(?:\?|$)/) ? RegExp.$1 : '');
          //console.log(url_fix);
          lists.push({'link': await this.DecryptImage(url_fix, data.mask), 'name': name});

          await resolveAfter();
        }
      },
    },

    sss = {
      domains: ["pivim.jp"],
      GetName: async function (url) {
        const main = document.querySelector('[class="current"]').textContent;
        const sub = document.querySelector('.sec-title__title').textContent.replace(/\s/g, '');
        return Convert(`${main} ${sub}`);
      },
      GetList: async function (url, lists) {
        // 1. 'detail__textArea' 클래스를 가진 DOM 요소 찾기
        const targetElement = document.querySelector('.detail__textArea');
        if (!targetElement) {
          alert("'detail__textArea' 클래스를 가진 요소를 찾을 수 없습니다.");
          return;
        }
        // 2. DOM의 전체 HTML 내용 가져오기
        const htmlContent = targetElement.outerHTML;
        lists.push({'link': htmlContent, 'name': 'index.html'});

        // 3. DOM 내의 모든 이미지 요소 찾기
        const images = targetElement.getElementsByTagName('img');
        const imageUrls = Array.from(images).map(img => img.src);
        for (const img of imageUrls) {
          lists.push({'link': img, 'name': ''});
        }
      },
    },

    mygirl = {
      domains: ["emii.photo", "mygirlstore"],
      base: ["https://emii.photo/mygirl", "https://mygirlstore.net"],
      GetName: async function (url) {
        for (let doms of document.getElementsByClassName('series-ev-title')) {
          let title = doms.textContent;
          return Convert(title);
        }
      },
      GetList: async function (url, lists) {
        let basepath = '';
        for(let i in this.domains){
          if (url.match(this.domains[i])) {
            basepath = this.base[i];
          }
        }
        for (let i of document.getElementsByClassName('photolistimg')) {
          // image
          let path = (null !== i.style.backgroundImage.match(/url\("([^"]+)"/) ? RegExp.$1 : '');
          let img = path.replace(/^\./, basepath).replace('_wm/', '/');
          lists.push({'link': img, 'name': ''});
        }
      },
    },

    stores = {
      domains: ["stores.jp"],
      GetName: async function (url) {
        for (let doms of document.getElementsByClassName('item_name')) {
          let title = doms.textContent;
          return Convert(title);
        }
      },
      GetList: async function (url, lists) {
        for (let i of document.getElementsByClassName('main_content_gallery_lists')) {
          // image
          for (let img of i.getElementsByTagName('img')) {
            let url = img.getAttribute('src').replace(/[^/]+$/, 'original');
            let name = (url .match(/\/([^/]+)\/[^/]+$/) ? RegExp.$1 : '');
            lists.push({'link': url , 'name': name});
          }
        }
        if (0 == lists.length) {
          for (let i of document.getElementsByClassName('gallery_image_carousel')) {
            // image
            for (let img of i.getElementsByTagName('img')) {
              let url = img.getAttribute('src').replace(/[^/]+$/, 'original');
              let name = (url .match(/\/([^/]+)\/[^/]+$/) ? RegExp.$1 : '');
              lists.push({'link': url , 'name': name});
            }
          }
        }
      },
    },

    joqr = {
      domains: ["joqr.co.jp"],
      GetNameClass: function (url) {
        if (url.includes('/comcha/')) return 'h3';
        return 'h1';
      },
      GetImageClass: function (url) {
        if (url.includes('/article/')) return 'alignnone size-full';
        return 'mt-image-none';
      },
      GetName: async function (url) {
        for (let doms of document.getElementsByTagName(this.GetNameClass(url))) {
          if (doms.textContent.match(/^\s*(.+?)\s*（\s*(\d+)\s*\.\s*(\d+)\s*\/\s*(\d+)\s*OA\s*(?:#\d+)?）\s*$/)) {
            let title = RegExp.$1;
            let date = `${RegExp.$2}${Numbering(RegExp.$3)}${Numbering(RegExp.$4)}`;
            return Convert(`${date} ${title}`);
          } else {
            return Convert(doms.textContent);
          }
        }
        return '';
      },
      GetList: async function (url, lists) {
        for (let img of document.getElementsByClassName(this.GetImageClass(url))) {
          // image
          let url = img.getAttribute('src').replace('http://', 'https://');
          let name = img.getAttribute('alt');
          if (false === url.includes('joqr.co.jp')) continue;
          lists.push({'link': url , 'name': name});
        }
      },
    },

    mocho = {
      domains: ["trysail.jp", "sonymusic.co.jp"],
      GetNameClass: function (url) {
        if (url.includes('trysail.jp')) return 'div.title';
        return 'h1.p-infoHeader__title';
      },
      GetContentClass: function (url) {
        if (url.includes('trysail.jp')) return '.body';
        return '.p-infoContent';
      },
      GetName: async function (url) {
        let title = document.querySelector(this.GetNameClass(url));
        if (null === title) return '';
        title = title.textContent.replace(/\s/g, '');
        return Convert(`${title}_${window.location.host}`);
      },
      GetList: async function (url, lists) {
        let body = document.querySelector(this.GetContentClass(url));
        if (null === body) return;

        for (let img of body.getElementsByTagName('img')) {
          // image
          let url = img.getAttribute('src').replace('http://', 'https://');
          if (false == url.includes('://')) url = `${window.location.origin}${url}`;
          lists.push({'link': url, 'name': ''});
        }
      },
    },

  ];

  /**
   * URL에서 이미지 데이터를 비동기적으로 가져와 zip 객체에 추가합니다.
   * fetch를 사용하여 네이티브 Promise 기반으로 작동합니다.
   * @param {string} url - 이미지 URL
   * @param {string} filename - zip 파일에 저장될 이름
   * @param {JSZip} zip - JSZip 인스턴스
   */
  async function addZipAsync(url, filename, zip) {
    try {
      // 1. fetch API를 사용해 이미지 데이터를 가져옵니다.
      const response = await fetch(url);
      if (!response.ok) {
        // HTTP 에러 상태(404 등)를 처리합니다.
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      // 2. 응답 데이터를 Blob(바이너리 데이터)으로 변환합니다.
      const data = await response.blob();
      // 3. zip 파일에 데이터를 추가합니다.
      zip.file(filename, data, { binary: true });
    } catch (err) {
      console.error(`Error adding ${url} to zip:`, err);
      // 특정 파일 실패 시 전체를 중단시키지 않으려면 여기서 에러를 throw하지 않을 수도 있습니다.
      // 하지만 보통은 하나의 파일이라도 실패하면 사용자에게 알려주는 것이 좋습니다.
      throw err;
    }
  }

  /**
   * 500ms 지연을 발생시키는 Promise를 반환합니다. (서버 부하 방지용)
   */
  function resolveAfter() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  async function BatchDownload(imgs, title) {
    const zip = new JSZip();
    const promises = [];

    console.log("Downloading...");

    files = [];
    try {
      // 각 이미지에 대해 비동기 작업을 시작하고, 생성된 Promise를 배열에 저장합니다.
      for (let cup of imgs) {
        if ('' == cup.link) continue;
        if ('' == cup.name)
          cup.name = (cup.link.match(/\/([^\/\?]+)(?:\?|$)/) ? RegExp.$1 : '');
        if ('' == cup.name) {
          console.log(`error no name: ${cup.link}`);
          continue;
        }

        cup.name = CheckDuplicate(decodeURIComponent(cup.name), files);
        if (/^http/.test(cup.link)) {
          // addImageToZipAsync는 Promise를 반환하므로 바로 배열에 추가합니다.
          promises.push(addZipAsync(cup.link, cup.name, zip));
          // 서버에 과도한 부하를 주지 않기 위해 각 요청 사이에 약간의 딜레이를 줍니다.
          await resolveAfter();
        } else {
          zip.file(cup.name, cup.link);
        }
        //console.log(`${cup.base}${cup.file}`);
        //break;
      }

      // Promise.all을 사용해 모든 이미지 다운로드 및 zip 추가 작업이 완료될 때까지 기다립니다.
      await Promise.all(promises);

      // 모든 작업이 성공적으로 완료되면 zip 파일을 생성합니다.
      const blob = await zip.generateAsync({ type: "blob" });

      // FileSaver.js를 사용해 파일을 저장합니다.
      saveAs(blob, `${title}.zip`);
    } catch (err) {
      // 이미지 다운로드 또는 zip 생성 과정에서 오류가 발생하면 여기서 처리합니다.
      console.error("Batch download failed:", err);
      // 사용자에게 오류가 발생했음을 알리는 로직을 추가할 수 있습니다.
      alert("이미지를 다운로드하는 중 오류가 발생했습니다. 일부 이미지를 가져오지 못했을 수 있습니다.");
    }

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
      //{"url":"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", "type":typeof(jQuery)},
      {"url":"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", "type":typeof(JSZip)},
      //{"url":"https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js", "type":typeof(JSZipUtils)},
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

    let domain = window.location.host;
    let url = document.location.href;
 
    // page open failed
    if(typeof(loadTimeData) !== "undefined") {
      domain = loadTimeData.data_.summary.hostName;
      url = loadTimeData.data_.summary.failedUrl;
    }
 
    for(let module of modules) {
      if (module.domains.some(t => domain.match(t))) {
        let imgs = [];
        let name = await module.GetName(url);
        await module.GetList(url, imgs);
        console.log(name);
        console.log(imgs);
        if (0 < imgs.length)
          BatchDownload(imgs, name);
        break;
      }
    }
  }

  start();
})();