// ==UserScript==
// @name        挊
// @namespace   撸
// @description 自动获取磁链接并自动离线下载
// @include     http://www.javmoo.info/*
// @include     http://www.avmask.net/*
// @include     http://www.jav2lib.com/*
// @include     http://www.dmm.co.jp/digital/videoa/*
// @include     http://www.libredmm.com/products/*
// @include     http://www.minnano-av.com/av*
// @include     http://www.oisinbosoft.com/dera/*
// @include     http://www.javbus.co/*
// @include     http://avdb.la/movie/*
// @include     http://www.141jav.com/view/*

// @include     http://pan.baidu.com/disk/home
// @include     http://115.com/?tab=offline&mode=wangpan
// @include     http://cloud.letv.com/webdisk/home/index
// @include     https://www.furk.net/users/files/add
// @include     *.yunpan.360.cn/my/

// @include     http://www.bt2mag.com/search?keyword=*
// @include     https://btdigg.org/search*
// @include     http://www.shousibaocai.com/search/*
// @include     http://www.shousibaocai.com/list/*
// @include     http://torrentkittycn.com/search?q=*
// @include     http://www.btspread.com/search/*

// @version     1.11
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13507/%E6%8C%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/13507/%E6%8C%8A.meta.js
// ==/UserScript==
var apply_search_site = false; //将脚本应用到搜索页面
var offline_data = {
  baidu: {
    url: 'http://pan.baidu.com/disk/home',
    name: '百度云',
  },
  115: {
    name: '115离线',
    url: 'http://115.com/?tab=offline&mode=wangpan'
  },
  letv: {
    name: '乐视云',
    url: 'http://cloud.letv.com/webdisk/home/index'
  },
  360: {
    name: '360云',
    url: 'http://yunpan.360.cn/my/'
  },
  furk: {
    name: 'Furk',
    url: 'https://www.furk.net/users/files/add'
  },
};
var $ = function (selector) {
  var result = document.querySelectorAll(selector);
  if (selector[0] == '#') {
    return result[0];
  } 
  else {
    return result;
  }
};
var $ib = function (target, a, b) {
  target.parentElement.insertBefore(a, b);
};
var xhr = function (url, cb) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function (result) {
      console.log('番号搜索', url);
      cb(result.responseText);
    },
    onerror: function (e) {
      console.log(e);
    }
  });
};
var exist_magnet = function () {
  var magnet = GM_getValue('magnet');
  if (magnet) {
    GM_setValue('magnet', '');
    return magnet;
  } 
  else {
    return '';
  }
};
var insert_js = function (falg, value, func) {
  var js = document.createElement('script');
  if (falg) { //磁链接
    js.innerHTML = '(' + func.toString() + ')(\'' + value + '\');';
  } 
  else { //搜索引擎
    js.innerHTML = '(' + func.toString() + ')();';
  }
  document.body.appendChild(js);
};
var add_style = function (css) {
  if (css) {
    GM_addStyle(css);
  } 
  else {
    GM_addStyle([
    '#magnet-tab table{margin:10px auto;border:1px solid #cad9ea;color:#666;font-size:12px;text-align:center;}',
    '.magnet-th,.magnet-td{height:30px; border:1px solid #cad9ea;padding:0 1em 0;}',
    '.magnet-copy{color:#08c;}',
    '.magnet-download{color: #d22222;margin-right: 4px;border: solid 1px #000;}'
    ].join(''));
  }
};
var shorten_str = function (str) {
  return str.length > 30 ? str.slice(0, 30) + '...' : str;
};
var init_offline = function (parent, child) {
  for (var key in offline_data) {
    var tmp = child.cloneNode();
    tmp.href = offline_data[key].url;
    tmp.textContent = offline_data[key].name;
    parent.appendChild(tmp);
  }
  return parent;
};
var create_table_th = function () {
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  th.className = 'magnet-th';
  tr.appendChild((function () {
    var t = th.cloneNode();
    var a = document.createElement('a');
    a.id = 'switch_engine';
    a.href = 'javascript:void(0);';
    a.textContent = '标题';
    t.appendChild(a);
    return t;
  }) ());
  var strings = [
    '大小',
    '操作',
    '离线下载'
  ];
  for (var i = 0; i < strings.length; i++) {
    var t = th.cloneNode();
    t.textContent = strings[i];
    tr.appendChild(t);
  }
  return tr;
};
var create_table_td = function (data) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.className = 'magnet-td';
  tr.appendChild((function () {
    var title = td.cloneNode();
    title.setAttribute('title', data.title);
    title.textContent = shorten_str(data.title);
    return title;
  }) ());
  tr.appendChild((function () {
    var size = td.cloneNode();
    size.textContent = data.size;
    return size;
  }) ());
  tr.appendChild((function () {
    var copy = td.cloneNode();
    var link = document.createElement('a');
    link.className = 'magnet-copy';
    link.textContent = '复制';
    link.href = 'magnet:?xt=urn:btih:' + data.hash;
    copy.appendChild(link);
    return copy;
  }) ());
  tr.appendChild((function () {
    var link = document.createElement('a');
    link.className = 'magnet-download';
    link.target = '_blank';
    var offline = init_offline(td.cloneNode(), link);
    offline.setAttribute('data', 'magnet:?xt=urn:btih:' + data.hash);
    return offline;
  }) ());
  return tr;
};
var create_wrapper = function (data) {
  var table = document.createElement('table');
  table.appendChild(create_table_th());
  //console.log(data);
  if (data) {
    for (var i = 0; i < data.length; i++) {
      table.appendChild(create_table_td(data[i]));
    }
  } 
  else {
    var p = document.createElement('p');
    p.textContent = '没有找到...';
    table.appendChild(p);
  }
  var wrapper = document.createElement('div');
  wrapper.id = 'magnet-tab';
  wrapper.appendChild(table);
  return wrapper;
};
var gethash = function (vid, callback) {
  var search_url = 'http://www.bt2mag.com/search/';
  xhr(search_url + vid, function (html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.documentElement.innerHTML = html;
    var data = [
    ];
    if (search_url == 'http://www.bt2mag.com/search/') { //搜索引擎切换?
      var t = doc.getElementsByClassName('data-list') [0];
      if (t) {
        var elems = t.getElementsByTagName('a');
        for (var i = 0; i < elems.length; i++) {
          data.push({
            'title': elems[i].title,
            'hash': elems[i].href.replace(/.*hash\//, ''),
            'size': elems[i].nextElementSibling.textContent
          });
        }
        callback(create_wrapper(data));
      } 
      else {
        callback(create_wrapper(false));
      }
    }
  });
};
var handle_event = function (event) {
  if (event.target.className == 'magnet-copy') {
    event.target.innerHTML = '成功';
    GM_setClipboard(event.target.href);
    setTimeout(function () {
      event.target.innerHTML = '复制';
    }, 1000);
    event.preventDefault(); //阻止跳转
  } 
  else if (event.target.className == 'magnet-download') {
    GM_setValue('magnet', event.target.parentElement.getAttribute('data'));
  }
};
var reg_event = function () {
  var elem_copy = $('.magnet-copy');
  var elem_dl = $('.magnet-download');
  for (var i = 0; i < elem_copy.length; i++) {
    elem_copy[i].addEventListener('click', handle_event, false);
  }
  for (var j = 0; j < elem_dl.length; j++) {
    elem_dl[j].addEventListener('click', handle_event, false);
  }
  /*$('#switch_engine').addEventListener('click', function () {
    //TO DO ....
  }, false);*/

};
var main = {
  //av信息查询 类
  avsow: {
    regexp: /javmoo.*movie.*/,
    vid: function () {
      return $('.header') [0].nextElementSibling.innerHTML;
    },
    proc: function (wrapper) {
      add_style();
      var title = document.createElement('h4');
      title.innerHTML = '磁链接';
      var tmp = $('#movie-share');
      $ib(tmp, wrapper, tmp.nextElementSibling);
      $ib(tmp, title, tmp.nextElementSibling);
      reg_event();
    }
  },
  avmask: {
    regexp: /avmask.*movie/,
    vid: function () {
      return $('.header') [0].nextElementSibling.innerHTML;
    },
    proc: function (wrapper) {
      add_style();
      var title = document.createElement('h4');
      title.innerHTML = '磁链接';
      var tmp = $('#movie-share');
      $ib(tmp, wrapper, tmp.nextElementSibling);
      $ib(tmp, title, tmp.nextElementSibling);
      reg_event();
    }
  },
  jav2lib: {
    regexp: /jav2lib.*\?v=.*/,
    vid: function () {
      return $('#video_id').getElementsByClassName('text') [0].innerHTML;
    },
    proc: function (wrapper) {
      add_style();
      var tmp = $('#video_favorite_edit');
      $ib(tmp, wrapper, tmp.nextElementSibling);
      reg_event();
    }
  },
  libredmm: {
    regexp: /libredmm/,
    vid: function () {
      return location.pathname.substr(10);
    },
    proc: function (wrapper) {
      add_style();
      var tmp = $('.container') [0];
      $ib(tmp, wrapper, tmp.nextElementSibling);
      reg_event();
    }
  },
  dmm: {
    regexp: /dmm\.co\.jp/,
    vid: function () {
      var result = location.href.replace(/.*cid=/, '').replace(/\/\??.*/, '').match(/[^h_0-9].*/);
      if (result[0]) {
        return result[0].replace('00', '');
      } 
      else {
        return '';
      }
    },
    proc: function (wrapper) {
      add_style();
      var tmp = $('.lh4') [0];
      $ib(tmp, wrapper, tmp.previousElementSibling);
      reg_event();
    }
  },
  minnano: {
    regexp: /minnano-av/,
    vid: function () {
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
    proc: function (wrapper) {
      add_style();
      var tmp = (function () {
        var a = $('table');
        for (var i = 0; i < a.length; i++) {
          if (a[i].bgColor == '#EEEEEE') {
            return a[i];
          }
        }
      }) ();
      $ib(tmp, wrapper, tmp.nextElementSibling);
      reg_event();
    }
  },
  oisinbosoft: {
    regexp: /oisinbosoft/,
    vid: function () {
      var r = location.pathname.replace(/.*\/+/, '').replace('.html', '');
      if (r.indexOf('-') == r.lastIndexOf('-')) {
        return r;
      } 
      else {
        return r.replace(/\w*-?/, '');
      }
    },
    proc: function (wrapper) {
      add_style();
      add_style('#magnet-tab table{clear:both;}');
      var tmp = $('#detail_info');
      $ib(tmp, wrapper, tmp.nextElementSibling);
      reg_event();
    }
  },
  javbus: {
    regexp: /javbus/,
    vid: function () {
      var result = $('.movie-code');
      if (result) {
        return result[0].textContent;
      } 
      else {
        return '';
      }
    },
    proc: function (wrapper) {
      add_style();
      var tmp = $('.movie') [0].parentElement;
      $ib(tmp, wrapper, tmp.nextElementSibling);
      reg_event();
    }
  },
  avdb: {
    regexp: /avdb\.la/,
    vid: function () {
      return String.trim($('.info') [0].firstElementChild.innerHTML.replace(/<.*>/, ''));
    },
    proc: function (wrapper) {
      add_style();
      wrapper.className = 'movie';
      var tmp = $('#downs');
      var title = document.createElement('h4');
      title.innerHTML = '磁链接';
      $ib(tmp, title, tmp);
      $ib(tmp, wrapper, tmp)
      reg_event()
    }
  },
  jav141: {
    regexp: /141jav/,
    vid: function () {
      return location.href.match(/view\/(.*)\//) [1];
    },
    proc: function (wrapper) {
      add_style();
      var tmp = $('.dlbtn') [0];
      $ib(tmp, wrapper, tmp);
      reg_event();
    },
  },
  //网盘下载 类
  baidu: {
    regexp: /pan\.baidu\.com/,
    proc: function (magnet) {
      $('.icon-btn-download').click();
      setTimeout(function () {
        $('#_disk_id_24').click();
        setTimeout(function () {
          $('#_disk_id_13').click();
          $('#share-offline-link').val(magnet);
        }, 500);
      }, 500);
    }
  },
  115: {
    regexp: /115\.com/,
    proc: function (link) {
      var readyStareChange = setInterval(function () {
        if (document.readyState == 'complete') {
          clearInterval(readyStareChange);
          setTimeout(function () {
            Core['OFFL5Plug'].OpenLink();
            setTimeout(function () {
              $('#js_offline_new_add').val(link);
            }, 0);
          }, 1000);
        }
      }, 200);
    }
  },
  letv: {
    regexp: /cloud\.letv\.com/,
    proc: function (link) {
      setTimeout(function () {
        $('#offline-btn').click();
        setTimeout(function () {
          $('#offline_clear_complete').prev().click();
          setTimeout(function () {
            $('#offline-add-link').val(link);
          }, 500);
        }, 1000);
      }, 2000);
    }
  },
  furk: {
    regexp: /www\.furk\.net/,
    proc: function (link) {
      setTimeout(function () {
        $('#url').val(link.replace('magnet:?xt=urn:btih:', ''));
      }, 1500);
    }
  },
  360: {
    regexp: /yunpan\.360\.cn\/my/,
    proc: function (link) {
      yunpan.cmdCenter.showOfflineDia();
      setTimeout(function () {
        $('.offdl-btn-create').click();
        setTimeout(function () {
          $('#offdlUrl').val(link)
        }, 500)
      }, 1000);
    }
  },
  //磁链接搜索 类
  btcherry: {
    regexp: /bt2mag/,
    handle_html: function () {
      var offline_div = $('.offline-div').show();
      $('.r div a').after(offline_div);
      offline_div.remove();
    },
    proc: function () {
      var elems = $('.offline-div');
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('data', elems[i].previousElementSibling.href);
      }
    }
  },
  btdigg: {
    regexp: /bt2mag/,
    handle_html: function () {
      var targets = document.querySelectorAll('.snippet');
      var offline_div = document.querySelectorAll('.offline-div') [0];
      offline_div.style.display = '';
      for (var i = 0; i < targets.length; i++) {
        targets[i].parentElement.appendChild(offline_div.cloneNode(true));
      }
      //document.body.removeChild(offline_div);

    },
    proc: function () {
      var elems = $('.offline-div');
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('data', elems[i].parentElement.getElementsByClassName('ttth') [0].getElementsByTagName('a') [0].href);
      }
    }
  },
  shousibaocai: {
    regexp: /shousibaocai/,
    handle_html: function () {
      var offline_div = $('.offline-div').show();
      $('.tail').after(offline_div);
      offline_div.remove();
    },
    proc: function () {
      var elems = $('.offline-div');
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('data', elems[i].previousElementSibling.getElementsByClassName('title') [0].href);
      }
    }
  },
  /*torrentkittycn:{
    regexp:/torrentkittycn/,
    handle_html:function(){
      var offline_div = $(".offline-div").show();
      $(".dmag").empty();
      $(".dmag").append(offline_div);
      offline_div.remove();
    },
    proc:function(){
      add_style(".offline-div{color:red}");
      var elems = $(".offline-div");
      for(var i=0;i<elems.length;i++){
        elems[i].setAttribute("data",elems[i].previousElementSibling.getElementsByTagName("a")[0].href.match(/hash\/(.*)\//)[1]);
      }
    }
  },*/
  btspread: {
    regexp: /bt2mag/,
    handle_html: function () {
      var offline_div = $('.offline-div').show();
      $('tbody tr').append(offline_div);
      offline_div.remove();
    },
    proc: function () {
      var elems = $('.offline-div');
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute('data', 'magnet:?xt=urn:btih:' + elems[i].previousElementSibling.getElementsByClassName('btn') [0].href.match(/hash\/(.*)/) [1]);
      }
    }
  }
};
for (var key in main) {
  if (location.href.match(main[key].regexp)) {
    if (main[key].vid) {
      gethash(main[key].vid(), main[key].proc);
    } 
    else {
      var magnet = exist_magnet();
      if (magnet) {
        insert_js(true, magnet, main[key].proc);
      } 
      else if (apply_search_site) {
        var link = document.createElement('a');
        link.className = 'magnet-download';
        link.target = '_blank';
        var offline = init_offline(document.createElement('div'), link);
        offline.className = 'offline-div';
        offline.style.display = 'none';
        document.body.appendChild(offline);
        insert_js(false, null, main[key].handle_html);
        setTimeout(function () {
          main[key].proc();
          reg_event();
        }, 1000);
      }
    }
    break;
  }
}
