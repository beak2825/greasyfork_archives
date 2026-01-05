// ==UserScript==
// @name        挊
// @namespace   撸
// @description 自动获取磁链接并自动离线下载

// @include     http*://avmo.pw/*
// @include     http*://avso.pw/*
// @include     http*://avxo.pw/*

// @include     http*://*javlibrary.com/*
// @include     http*://*5avlib.com/*
// @include     http*://*look4lib.com/*
// @include     http*://*javlib3.com/*
// @include     http*://*javli6.com/*
// @include     http*://*j8vlib.com/*
// @include     http*://*j9lib.com/*
// @include     http*://*javl1b.com/*


// @include     http*://www.libredmm.com/products/*
// @include     http*://www.javbus.com/*
// @include     http*://www.javbus.me/*
// @include     http*://www.javbus2.com/*
// @include     http*://www.javbus3.com/*
// @include     http*://www.javbus5.com/*
// @include     http*://*j8vlib.com/*

// @include     http*://*j8vlib.com/*

// @include     http*://avdb.la/movie/*
// @include     http*://www.141jav.com/view/*
// @include     http*://www.av4you.net/work/*.htm
// @include     http*://www.dmmy18.com/*

// @include     http*://pan.baidu.com/disk/home*
// @include     http*://115.com/?tab=offline&mode=wangpan
// @include     http*://cloud.letv.com/webdisk/home/index
// @include     http*://disk.yun.uc.cn/
// @include     http*://www.furk.net/users/files/add
// @include     *.yunpan.360.cn/my/
// @include     http://www.dmm.co.jp/digital/videoa/*
// @include     http://www.btcherry.org/*
// @include     https://btdigg.org/search*

// @version     1.39
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26854/%E6%8C%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/26854/%E6%8C%8A.meta.js
// ==/UserScript==

var main = {
  //av信息查询 类
  jav: {
    type: 0,
    re: /(avmo|avso|avxo).*movie.*/,
    vid: function() {
      return $('.header')[0].nextElementSibling.innerHTML;
    },
    proc: function() {
      insert_after('#movie-share');
    }
  },
  javlibrary: {
    type: 0,
    re: /(javlibrary|javlib3|look4lib|5avlib|javli6|j8vlib|j9lib|javl10).*\?v=.*/,
    vid: function() {
      return $('#video_id')[0].getElementsByClassName('text')[0].innerHTML;
    },
    proc: function() {
      insert_after('#video_favorite_edit');
    }
  },
  libredmm: {
    type: 0,
    re: /libredmm/,
    vid: function() {
      return location.href.match(/products\/(.*)/)[1];
    },
    proc: function() {
      insert_after('.container');
    }
  },
  dmm: {
    type: 0,
    re: /dmm\.co\.jp/,
    vid: function() {
      var result = location.href.replace(/.*cid=/, '').replace(/\/\??.*/, '').match(/[^h_0-9].*/);
      return result[0] ? result[0].replace('00', '') : '';
    },
    proc: function() {
      insert_after('.lh4');
    },
  },
  minnano: {
    type: 0,
    re: /minnano-av/,
    vid: function() {
      var elems = $('.t11');
      var r = '';
      for (var i = 0; i < elems.length; i++) {
        if (elems[i].textContent == '品番') {
          r = elems[i].nextElementSibling.textContent;
          break;
        }
      }
      return r;
    },
    proc: function() {
      var tmp = (function() {
        var a = $('table');
        for (var i = 0; i < a.length; i++) {
          if (a[i].bgColor == '#EEEEEE') {
            return a[i];
          }
        }
      })();
      insert_after(tmp);
    }
  },
  oisinbosoft: {
    type: 0,
    re: /oisinbosoft/,
    vid: function() {
      var r = location.pathname.replace(/.*\/+/, '').replace('.html', '');
      return r.indexOf('-') == r.lastIndexOf('-') ? r : r.replace(/\w*-?/, '');
    },
    proc: function() {
      // add_style('#magnet-tab table{clear:both;}');
      insert_after('#detail_info');
    }
  },
  javbus: {
    type: 0,
    re: /javbus/,
    vid: function() {
      var a = $('.header')[0].nextElementSibling;
      return a ? a.textContent : '';
    },
    proc: function() {
      insert_after('#star-div');
    }
  },
  avdb: {
    type: 0,
    re: /avdb\.la/,
    vid: function() {
      return $('.info')[0].firstElementChild.innerHTML.replace(/<.*>/, '').trim();
    },
    proc: function() {
      insert_after($('#downs')[0].previousElementSibling);
    }
  },
  jav141: {
    type: 0,
    re: /141jav/,
    vid: function() {
      return location.href.match(/view\/(.*)\//)[1];
    },
    proc: function() {
      insert_after($('.dlbtn')[0].previousElementSibling);
    },
  },
  av4you: {
    type: 0,
    re: /av4you/,
    vid: function() {
      return $('.star-detail-name')[0].textContent.trim();
    },
    proc: function() {
      insert_after('.star-detail');
    }
  },
  dmmy18_sin: {
    type: 0,
    re: /dmmy18\.com\/details\.aspx\?id=.*/,
    vid: function() {
      return $('.info li')[0].textContent.replace('番号：', '');
    },
    proc: function() {
      insert_after('.head_coverbanner');
    },
  },
  //网盘下载 类
  //这些 $ 是真正的 jquery
  baidu: {
    type: 1,
    re: /pan\.baidu\.com/,
    fill_form: function(magnet) {
      document.querySelector('.g-button[data-button-id=b13]').click();
      setTimeout(function() {
        document.querySelector('#_disk_id_2').click();
        setTimeout(function() {
          document.querySelector('#share-offline-link').value = magnet;
          document.querySelector('.g-button[data-button-id=b65]').click();
        }, 500);
      }, 1500);
    }
  },
  115: {
    type: 1,
    re: /115\.com/,
    fill_form: function(link) {
      var rsc = setInterval(function() {
        if (document.readyState == 'complete') {
          clearInterval(rsc);
          setTimeout(function() {
            Core['OFFL5Plug'].OpenLink();
            setTimeout(function() {
              $('#js_offline_new_add').val(link);
            }, 300);
          }, 1000);
        }
      }, 400);
    }
  },
  letv: {
    type: 1,
    re: /cloud\.letv\.com/,
    fill_form: function(link) {
      setTimeout(function() {
        $('#offline-btn').click();
        setTimeout(function() {
          $('#offline_clear_complete').prev().click();
          setTimeout(function() {
            $('#offline-add-link').val(link);
          }, 500);
        }, 1000);
      }, 2000);
    }
  },
  furk: {
    type: 1,
    re: /www\.furk\.net/,
    fill_form: function(link) {
      setTimeout(function() {
        $('#url').val(link.replace('magnet:?xt=urn:btih:', ''));
      }, 1500);
    }
  },
  360: {
    type: 1,
    re: /yunpan\.360\.cn\/my/,
    fill_form: function(link) {
      yunpan.cmdCenter.showOfflineDia();
      setTimeout(function() {
        $('.offdl-btn-create').click();
        setTimeout(function() {
          $('#offdlUrl').val(link);
        }, 500);
      }, 1000);
    }
  },
  uc: {
    type: 1,
    re: /disk\.yun\.uc\.cn\//,
    fill_form: function(link) {
      setTimeout(function() {
        $('#newuclxbtn_index').click();
        setTimeout(function() {
          $('#uclxurl').val(link);
        }, 1000);
      }, 1200);
    }
  },
  //磁链接搜索 类
  btcherry_a: {
    type: 2,
    re: /btcherry\.org\/search\?keyword=.*/,
    func: function(tab) {
      var selector = '.r div a';
      var a = $(selector);
      for (var i = 0; i < a.length; i++) {
        var b = tab.cloneNode(true);
        b.setAttribute('maglink', a[i].href);
          //console.log(a[i].href)
        a[i].parentElement.appendChild(b);
      }
    },
  },
  btcherry_b: {
    type: 2,
    re: /btcherry\.org\/hash\/.*/,
    func: function(tab) {
      var selector = '#content div ul';
      var a = $(selector)[0];
      tab.setAttribute('maglink', $('li a', a)[0]);
      a.parentElement.insertBefore(tab, a);
    },
  },
  btdigg: {
    type: 2,
    re: /btdigg\.org\/search/,
    func: function(tab) {
      var selector = '.snippet';
      var a = null;
      if ($('#search_res').length !== 0) { //搜索页面
        a = $(selector);
        for (var i = 0; i < a.length; i++) {
          var b = tab.cloneNode(true);
          b.setAttribute('maglink', $('.ttth a', a[i].previousElementSibling)[0].href);
          a[i].parentElement.appendChild(b);
        }
      }
      else if ($('.torrent_info_tbl').length !== 0) { //详情页面
        selector = '.torrent_info_tbl';
        a = $(selector)[0];
        tab.setAttribute('maglink', $('a', a)[1].href);
        a.parentElement.insertBefore(tab, a);
      }
    },
  },

};
var main_keys = Object.keys(main); //下面的不要出现
main.cur_tab = null;
main.cur_vid = '';
var $ = function(selector, context) {
  if (context) {
    return context.querySelectorAll(selector);
  }
  return document.querySelectorAll(selector);
};
var insert_after = function(b) {
  b = $(b)[0];
  if (b) {
    b.parentElement.insertBefore(main.cur_tab, b);
  }
  else{
    console.log(location,"没有正确插入表格",b);
  }
};
var offline_sites = {
  baidu: {
    url: 'http://pan.baidu.com/disk/home',
    name: '百度云',
    enable: true
  },
  115: {
    name: '115离线',
    url: 'http://115.com/?tab=offline&mode=wangpan',
    enable: true,
  },
  letv: {
    name: '乐视云',
    url: 'http://cloud.letv.com/webdisk/home/index',
    enable: false
  },
  360: {
    name: '360云',
    url: 'http://yunpan.360.cn/my/',
    enable: false
  },
  uc: {
    name: 'UC离线',
    url: 'http://disk.yun.uc.cn/',
    enable: false
  },
  furk: {
    name: 'Furk',
    url: 'https://www.furk.net/users/files/add',
    enable: true
  },
};
var common = {
  add_style: function(css) {
    if (css) {
      GM_addStyle(css);
    }
    else {
      GM_addStyle([
        '#nong-table{border-collapse: initial !important;background-color: white !important;text-align: center !important;margin:10px auto;color:#666 !important;font-size:13px;text-align:center !important;border: 1px solid #cfcfcf !important;border-radius: 10px !important;}',
        '#nong-table a {margin-right: 5px !important;color:blue}',
        '#nong-table a:hover {color:#d20f00 !important;}',
        '#nong-table th,#nong-table td{text-align: inherit !important;height:30px;padding:0 1em 0 !important;}',
        '.nong-row{text-align: inherit !important;height:30px;padding:0 1em 0 !important;border: 1px solid #EFEFEF !important;}',
        '.nong-row:hover{background-color: #dae8ff !important;}',
        '.nong-offline-download{color: rgb(0, 180, 30) !important;}',
        '.nong-offline-download:hover{color:red !important;}',
      ].join(''));
    }
  },
  handle_event: function(event) {
    if (event.target.className == 'nong-copy') {
      event.target.innerHTML = '成功';
      GM_setClipboard(event.target.href);
      setTimeout(function() {
        event.target.innerHTML = '复制';
      }, 1000);
      event.preventDefault(); //阻止跳转
    }
    else if (event.target.className == 'nong-offline-download') {
      var maglink = event.target.parentElement.parentElement.getAttribute('maglink') || event.target.parentElement.parentElement.parentElement.getAttribute('maglink');
      GM_setValue('magnet', maglink);
    }
    // else if (event.target.id == 'nong-search-select') {
    //   current_search_name = event.target.value;
    //   GM_setValue('search', current_search_name);
    //   search_engines[current_search_name](current_vid, function(src, data) {
    //     magnet_table.updata_table(src, data);
    //   });
    // }
  },
  reg_event: function() { //TODO target 处理 更精准
    var list = [
      '.nong-copy',
      '.nong-offline-download'
    ];
    for (var i = 0; i < list.length; i++) {
      var a = document.querySelectorAll(list[i]);
      for (var u = 0; u < a.length; u++) {
        a[u].addEventListener('click', this.handle_event, false);
      }
    }
    // var b = document.querySelectorAll('#nong-search-select')[0];
    // b.addEventListener('change', this.handle_event, false);

  },
  parsetext: function(text) {
    var doc = null;
    try {
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = text;
      return doc;
    }
    catch (e) {
      alert('parse error');
    }
  },
  insert_js: function(js, maglink) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = '(' + js.toString() + ')(\'' + maglink + '\')';
    document.body.appendChild(script);
  },
  add_mini_table: function(sel, func) {
    var a = $(sel);
    for (var i = a.length - 1; i >= 0; i--) {
      a[i].parentElement.insertBefore(a[i], magnet_table.mini()); //TODO
      func(a[i]);
    }
  },
};
var magnet_table = {
  template: {
    create_head: function() {
      var a = document.createElement('tr');
      a.className = 'nong-row';
      a.id = 'nong-head';
      var list = [
        '标题',
        '大小',
        '操作',
        '离线下载'
      ];
      for (var i = 0; i < list.length; i++) {
        var b = this.head.cloneNode(true);
        if (i === 0) {
          var select = document.createElement("select");
          var ops = ["btso", "btdb"];
          var cur_index = GM_getValue("search_index",0);
          for (var j = 0; j < ops.length; j++) {
            var op = document.createElement("option");
            op.value = j.toString();
            op.textContent = ops[j];
            if (cur_index == j) {
              op.setAttribute("selected", "selected");
            }
            select.appendChild(op);
          }
          b.removeChild(b.firstChild);
          b.appendChild(select);
          a.appendChild(b);
          continue;
        }
        b.firstChild.textContent = list[i];
        a.appendChild(b);
      }
      // var select_box = this.create_select_box();
      // a.firstChild.appendChild(select_box);

      return a;
    },
    create_row: function(data) {
      var a = document.createElement('tr');
      a.className = 'nong-row';
      a.setAttribute('maglink', data.maglink);
      var b = document.createElement('td');
      var list = [
        this.create_info(data.title, data.maglink),
        this.create_size(data.size, data.src),
        this.create_operation(data.maglink),
        this.create_offline()
      ];
      for (var i = 0; i < list.length; i++) {
        var c = b.cloneNode(true);
        c.appendChild(list[i]);
        a.appendChild(c);
      }
      return a;
    },
    create_loading: function() {
      var a = document.createElement('tr');
      a.className = 'nong-row';
      var p = document.createElement('p');
      p.textContent = 'Loading';
      p.id = 'notice';
      a.appendChild(p);
      return a;
    },
    create_info: function(title, maglink) {
      var a = this.info.cloneNode(true);
      a.firstChild.textContent = title.length < 20 ? title : title.substr(0, 20) + '...';
      a.firstChild.href = maglink;
      a.title = title;
      return a;
    },
    create_size: function(size, src) {
      var a = this.size.cloneNode(true);
      a.textContent = size;
      a.href = src;
      return a;
    },
    create_operation: function(maglink) {
      var a = this.operation.cloneNode(true);
      a.firstChild.href = maglink;
      return a;
    },
    create_offline: function() {
      var a = this.offline.cloneNode(true);
      a.className = 'nong-offline';
      return a;
    },
    create_select_box: function() {
      var select_box = document.createElement('select');
      select_box.id = 'nong-search-select';
      select_box.setAttribute('title', '切换搜索结果');
      var search_name = GM_getValue('search', default_search_name);
      console.log(search_engines);
      for (var k in search_engines) {
        var o = document.createElement('option');
        if (k == search_name) {
          o.setAttribute('selected', 'selected');
        }
        o.setAttribute('value', k);
        o.textContent = k;
        select_box.appendChild(o);
      }
      return select_box;
    },
    head: (function() {
      var a = document.createElement('th');
      var b = document.createElement('a');
      a.appendChild(b);
      return a;
    })(),
    info: (function() {
      var a = document.createElement('div');
      var b = document.createElement('a');
      b.textContent = 'name';
      b.href = 'src';
      a.appendChild(b);
      return a;
    })(),
    size: function() {
      var a = document.createElement('a');
      a.textContent = 'size';
      return a;
    }(),
    operation: (function() {
      var a = document.createElement('div');
      var copy = document.createElement('a');
      copy.className = 'nong-copy';
      copy.textContent = '复制';
      a.appendChild(copy);
      return a;
    })(),
    offline: (function() {
      var a = document.createElement('div');
      var b = document.createElement('a');
      b.className = 'nong-offline-download';
      b.target = '_blank';
      for (var k in offline_sites) {
        if (offline_sites[k].enable) {
          var c = b.cloneNode(true);
          c.href = offline_sites[k].url;
          c.textContent = offline_sites[k].name;
          a.appendChild(c);
        }
      }
      return a;
    })(),
  },
  create_empty_table: function() {
    var a = document.createElement('table');
    a.id = 'nong-table';
    return a;
  },
  updata_table: function(src, data, type) {
    if (type == 'full') {
      var tab = $('#nong-table')[0];
      tab.removeChild(tab.querySelector("#notice").parentElement);
      for (var i = 0; i < data.length; i++) {
        tab.appendChild(this.template.create_row(data[i]));
      }
    }
    // else if(type =='mini'){
    // }

    common.reg_event();
  },
  full: function(src, data) {
    var tab = this.create_empty_table();
    tab.appendChild(this.template.create_head());
    // for (var i = 0; i < data.length; i++) {
    //     tab.appendChild(this.template.create_row(data[i]))
    // }
    var loading = this.template.create_loading();
    tab.appendChild(loading);
    return tab;
  },
  mini: function(data) {
    var tab = this.create_empty_table();
    tab.appendChild(this.template.create_offline());
    return tab;
  }
};
var search_engines = {
  switch_engine: function(i) {
    // var index = GM_getValue("search_index",0);
    GM_setValue('search_index', i);
    return i;
  },
  cur_engine: function(kw, cb) {
    var z = this[GM_getValue('search_index', 0)];
    if(!z){
      alert("search engine not found");
    }
    return z(kw, cb);
  },
  parse_error:function(a){
    alert("调用搜索引擎错误，可能需要更新，请向作者反馈。i="+ a);
  },
  full_url: '',
  0: function(kw, cb) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://btso.pw/search/' + kw,
      onload: function(result) {
        search_engines.full_url = result.finalUrl;
        var doc = common.parsetext(result.responseText);
        if (!doc) {
          search_engines.parse_error(GM_getValue('search_index'));
        }
        var data = [];
        var t = doc.getElementsByClassName('data-list')[0];
        if (t) {
          var a = t.getElementsByTagName('a');
          for (var i = 0; i < a.length; i++) {
            if (!a[i].className.match('btn')) {
              data.push({
                'title': a[i].title,
                'maglink': 'magnet:?xt=urn:btih:' + a[i].outerHTML.replace(/.*hash\//, '').replace(/" .*\n.*\n.*\n.*/, ''),
                'size': a[i].nextElementSibling.textContent,
                'src': a[i].href,
              });
            }
          }
        }
        cb(result.finalUrl, data);
      },
      onerror: function(e) {
        console.log(e);
      }
    });
  },
  1: function(kw, cb) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://btdb.in/q/' + kw + '/',
      onload: function(result) {
        search_engines.full_url = result.finalUrl;
        var doc = common.parsetext(result.responseText);
        if(!doc){
          search_engines.parse_error(GM_getValue('search_index'));
        }
        var data = [];
        var elems = doc.getElementsByClassName('item-title');
        for (var i = 0; i < elems.length; i++) {
          data.push({
            'title': elems[i].firstChild.title,
            'maglink': elems[i].nextElementSibling.firstElementChild.href,
            'size': elems[i].nextElementSibling.children[1].textContent,
            'src': 'https://btdb.in' + elems[i].firstChild.getAttribute('href'),
          });
        }
        cb(result.finalUrl, data);
      },
      onerror: function(e) {
        console.log(e);
      }
    });
  },
  // 2: function(kw, cb) {
  //   GM_xmlhttpRequest({
  //     method: 'POST',
  //     url: this.url,
  //     data: 's=' + kw,
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     onload: function(result) {
  //       var doc = document.implementation.createHTMLDocument('');
  //       doc.documentElement.innerHTML = result.responseText;
  //       var data = [];
  //       var t = doc.getElementsByClassName('list-content')[0];
  //       if (t) {
  //         var elems = t.getElementsByClassName('item-title');
  //         for (var i = 0; i < elems.length; i++) {
  //           data.push({
  //             'title': elems[i].getElementsByTagName('a')[0].textContent,
  //             'magnet': elems[i].nextElementSibling.getElementsByTagName('a')[0].href,
  //             'size': elems[i].nextElementSibling.getElementsByTagName('b')[1].textContent
  //           });
  //         }
  //         cb(result.finalUrl, data);
  //       }
  //     },
  //     onerror: function(e) {
  //       console.log(e);
  //     }
  //   });
  // },
};
if(GM_getValue('search_index',null) === null){
  GM_setValue('search_index',0);
}
var run = function() {
  for (var i = 0; i < main_keys.length; i++) {
    var v = main[main_keys[i]];

    //for javlibrary
    if(document.querySelector("#adultwarningprompt")){
      document.querySelector("#adultwarningprompt").click();
    }

    if (v.re.test(location.href)) {
      if (v.type === 0) {
        try {
          main.cur_vid = v.vid();
        }
        catch (e) {
          main.cur_vid = '';
        }
        if (main.cur_vid) {
          common.add_style();
          main.cur_tab = magnet_table.full();
          console.log('番号：', main.cur_vid);
          v.proc();

          // console.log(main.cur_tab)
          var t = $('#nong-head')[0].firstChild;
          t.firstChild.addEventListener('change', function(e) {
            console.log(e.target.value);
            GM_setValue('search_index', e.target.value);
            var s = $('#nong-table')[0];
            s.parentElement.removeChild(s);
            run();
          });
          
          search_engines.cur_engine(main.cur_vid, function(src, data) {
            if (data.length == 0) {
              $('#nong-table')[0].querySelectorAll('#notice')[0].textContent = 'No search result';
            }
            else {
              magnet_table.updata_table(src, data, 'full');
              /*display search url*/
              var y = $('#nong-head th')[1].firstChild;
              y.href = search_engines.full_url;
            }
          });
        }
      }
      else if (v.type == 1) {
        var js = v.fill_form;
        var maglink = GM_getValue('magnet');
        if (maglink) {
          common.insert_js(js, maglink);
          GM_setValue('magnet', '');
        }
      }
      else if (v.type == 2) {
        common.add_style();
        v.func(magnet_table.mini());
        magnet_table.updata_table('', '', 'mini');
      }
      break;
    }
  }
};

run();