// ==UserScript==
// @name           （已失效，代码仅供参考）贴吧广告自动删除及黑名单自动封禁
// @description    根据设置的广告关键字和广告图片，扫描帖子并自动删除广告。另外也可以自动删除和封禁黑名单用户
// @include        http://tieba.baidu.com/f?*
// @connect        imgsrc.baidu.com
// @connect        hiphotos.baidu.com
// @version        0.9.6
// @author         yechenyin
// @namespace	     https://greasyfork.org/users/3586-yechenyin
// @require	       https://code.jquery.com/jquery-1.11.2.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_info
// @downloadURL https://update.greasyfork.org/scripts/18577/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E4%BB%A3%E7%A0%81%E4%BB%85%E4%BE%9B%E5%8F%82%E8%80%83%EF%BC%89%E8%B4%B4%E5%90%A7%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%8F%8A%E9%BB%91%E5%90%8D%E5%8D%95%E8%87%AA%E5%8A%A8%E5%B0%81%E7%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/18577/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E4%BB%A3%E7%A0%81%E4%BB%85%E4%BE%9B%E5%8F%82%E8%80%83%EF%BC%89%E8%B4%B4%E5%90%A7%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%8F%8A%E9%BB%91%E5%90%8D%E5%8D%95%E8%87%AA%E5%8A%A8%E5%B0%81%E7%A6%81.meta.js
// ==/UserScript==

default_settings = {
  'scan_threads':5,
  'scan_interval_seconds':60,
  'scan_floors':20,
  'below_level':2,
  'only_last':false,
  'also_delete':true,
  'also_blockid':false,
  'block_days':10,
  'block_users':'',
  'white_users':'',
  'edit_ETags':'',
};

append_settings = {
  'append_rules':'hsn3660 /[YＹyｙ][aаａα][nｎ][gｇ][SＳsｓ][hｈ][eｅě][nｎ][gｇ]/ @高清网盘看头像 ',
  'append_ETags': '  15389725661213149746 17692237048646853765 4461156921076104320 6137503168619420662  '
};

function get(name) {
  if (typeof GM_getValue !== 'undefined') {
    //console.log(name + ': ' + GM_getValue(name));
  return GM_getValue(name);
  } else {
    var value = '';
    name = 'gm_'+name;
    //console.log(name + ': ' + localStorage[name]);
    if (typeof localStorage[name] !== 'undefined' && localStorage[name])
      value = JSON.parse(localStorage[name]);
    return value;

  }
}

function set(name, value) {
  if (typeof GM_setValue !== 'undefined') {
    GM_setValue(name, value);
    console.log(name + ' = ' + GM_getValue(name));
  } else {
    name = 'gm_'+name;
    localStorage[name] = JSON.stringify(value);
    console.log(name + ' = ' + localStorage[name]);
  }
}

if (!get(GM_info.script.version)) {
  for (var prop in default_settings) {
    if (typeof get(prop) == 'undefined')
      set(prop, default_settings[prop]);
  }

  for (var prop in append_settings) {
    if (typeof get(prop) == 'undefined')
      set(prop, '');
    if (get(prop) && /\S/.test(get(prop)[0]))
      set(prop, ' ' + get(prop));
    var keywords = append_settings[prop].match(/\S+/g);
    if (keywords) {
      for (var i = 0; i < keywords.length; i++) {
        if (get(prop).indexOf(keywords[i]) < 0) {
          set(prop, ' ' + keywords[i] + get(prop));
        }
      }
    }
  }
  set(GM_info.script.version, true);
}

if (!get('first_initialization')) {
  show_setting();
  set('first_initialization', true);
}

function show_setting() {
  var setting = $('<div>', {css:{padding:'5px 16px', background:'#fff'}});
  setting.append($('<div>', {text:'×', css:{width:'20px', height:'20px', color:'#999', 'font-size':'20px', float:'right', cursor:'pointer', margin:'-4px -15px 0 0'}, click:function() {
     $('.delete_setting').remove();
  }}));
  setting.append($('<div>', {text:'扫描设置', css:{color:'#bbb', 'margin':'4px 0 0px'}}));
  setting.append($('<span>', {text:'每次扫描'}));
  setting.append($('<input>', {name:'scan_threads', type:'text', css:{width:'30px', height:'12px', margin:'0 3px'}}));
  setting.append($('<span>', {text:'个帖子'}));
  setting.append($('<div>', {css:{'margin':'1px'}}));
  setting.append($('<span>', {text:'每次扫描间隔'}));
  setting.append($('<input>', {name:'scan_interval_seconds', type:'text', css:{width:'30px', height:'12px', margin:'0 3px'}}));
  setting.append($('<span>', {text:'秒'}));
  setting.append($('<div>', {css:{'margin':'1px'}}));
  setting.append($('<span>', {text:'每个帖子扫描'}));
  setting.append($('<input>', {name:'scan_floors', type:'text', css:{width:'30px', height:'12px', margin:'0 3px'}}));
  setting.append($('<span>', {text:'楼'}));

  setting.append($('<div>', {text:'广告搜索设置', css:{color:'#bbb', 'margin':'8px 0 0px'}}));
  setting.append($('<span>', {text:'仅检查小于等于等级'}));
  setting.append($('<input>', {name:'below_level', type:'text', css:{width:'20px', height:'12px', margin:'0 3px'}}));
  setting.append($('<span>', {text:'以下的用户'}));
  setting.append($('<div>', {css:{'margin':'2px'}}));
  setting.append($('<span>', {text:'广告包含的关键字'}));
  setting.append($('<span>', {text:'(每个关键字使用空格或者换行隔开，中间可以用*表示任意长度文字。另外可以使用以/开头和结尾的正则表达式)', css:{color:'#999'}}));
  setting.append($('<textarea>', {name:'append_rules', css:{height:'32', width:'360px', 'line-height':'19px', color:'#333', padding:'4px 4px', display:'block', margin:'1px auto 6px', 'border':'1px solid #bebebe'}}));
  setting.append($('<span>', {text:'广告包含的回复或者签名图片地址'}));
  setting.append($('<span>', {text:'(每个地址使用空格或者换行隔开)', css:{color:'#999'}}));
  setting.append($('<textarea>', {class:'set_block_images', name:'block_signs', css:{height:'32', width:'360px', 'line-height':'19px', color:'#333', padding:'4px 4px', display:'block', margin:'1px auto 6px', 'border':'1px solid #bebebe'}}));
  setting.append($('<div>', {css:{'margin':'2px'}}));
  setting.append($('<span>', {text:'白名单'}));
  setting.append($('<span>', {text:'(回复不会被删除,每个用户名使用空格隔开)', css:{color:'#999'}}));
  setting.append($('<textarea>', {name:'white_users', css:{height:'32', width:'360px', 'line-height':'19px', color:'#333', padding:'4px 4px', display:'block', margin:'1px auto 6px', 'border':'1px solid #bebebe'}}));

  setting.append($('<div>', {text:'黑名单封禁设置', css:{color:'#bbb', 'margin':'8px 0 0px'}}));
  setting.append($('<span>', {text:'封禁天数:'}));
  setting.append($('<select>', {name:'block_days', css:{margin:'0 3px'}}).append($('<option>', {value:'10', text:'10天(小吧3天)'})).append($('<option>', {value:'3', text:'3天'})).append($('<option>', {value:'1', text:'1天'})).append($('<option>', {value:'0', text:'0天(停止自动封禁)'})));
  setting.append($('<div>', {css:{'margin':'2px'}}));
  setting.append($('<span>', {text:'同时删除回复'}));
  setting.append($('<input>', {name:'also_delete', type:'checkbox', css:{width:'12px', height:'12px', margin:'0px 10px 0 3px'}}));
  setting.append($('<span>', {text:'仅检测最新回复'}));
  setting.append($('<input>', {name:'only_last', type:'checkbox', css:{width:'12px', height:'12px', margin:'0 3px'}}));
  setting.append($('<div>', {css:{'margin':'2px'}}));
  setting.append($('<span>', {text:'自动封禁的黑名单'}));
  setting.append($('<span>', {text:'(每个用户名使用空格隔开)', css:{color:'#999'}}));
  setting.append($('<textarea>', {name:'block_users', css:{height:'32', width:'360px', 'line-height':'19px', color:'#333', padding:'4px 4px', display:'block', margin:'1px auto 10px', 'border':'1px solid #bebebe'}}));

  setting.find('input, textarea, select').each(function() {
    if($(this).attr('type') == 'checkbox')
      $(this).prop('checked', get($(this).attr('name')));
    else
      $(this).val(get($(this).attr('name')));
  });
  setting.find('input, textarea, select').change(function() {
    if($(this).attr('type') == 'checkbox')
      set($(this).attr('name'), $(this).prop('checked'));
    else
     set($(this).attr('name'), $(this).val());
  });

  setting.find('.set_block_images').change(function() {
    set('edit_ETags', '');
    var set_block_images = $(this).val().matched(/\S+/g);
    console.log(set_block_images);
    set_block_images.forEach(function (image) {
      GM_xmlhttpRequest({
        method: "HEAD",
        url: image,
        onload: function(response) {
          var etag = /ETag: "(\w+)"/.exec(response.responseHeaders)[1];
          if (get('edit_ETags').search(etag) < 0)
            set('edit_ETags', etag + ' ' + get('ETags'));
        },
        onerror: function(response) {
          console.log(response.statusText);
        }
      });
    });
  });
  if (get('append_error_sign') === undefined) {
    setting.find('.set_block_images').val('http://tb1.bdstatic.com/tb/static-itieba/img/sign_err.png '+setting.find('.set_block_images').val());
    set('append_error_sign', 'appended');
  }

  setting.append($('<button>', {text:'导入设置', class:'input_setting', css:{margin:'4px 0 8px 0px', 'line-height':'20px',  padding:'0px 6px', background:'#fff', border:'1px solid #aaa', color:'#777', 'border-radius':2, 'font-size':'12px', }}).click(function() {
    $('.confirm_input, [name="setting_input"], .output_tip').remove();
    setting.append($('<button>', {text:'确定导入', class:'confirm_input', css:{margin:'4px 0 8px 160px',  'line-height':'20px', padding:'0px 6px', background:'#fff', border:'1px solid #aaa', color:'#777', 'border-radius':2, 'font-size':'12px', }}).click(function() {
      var inputed_setting = JSON.parse($('[name="setting_input"]').val());
      console.log(inputed_setting);
      setting.find('input, textarea, select').each(function() {
        if($(this).attr('type') == 'checkbox')
          $(this).prop('checked', inputed_setting[$(this).attr('name')]);
        else
         $(this).val(inputed_setting[$(this).attr('name')]);
      });
      $('.confirm_input, [name="setting_input"], .output_tip').remove();
    }));
    setting.append($('<textarea>', {name:'setting_input', text:'请将其他人复制过来的导出设置粘贴至此输入框，点击“确定导入”后导入全部设置', css:{height:'32', width:'360px', 'line-height':'19px', color:'rgb(153, 153, 153)', padding:'4px 4px', display:'block', margin:'1px auto 10px', 'border':'1px solid #bebebe'}}).click(function() {
      if ($(this).css('color') == 'rgb(153, 153, 153)') {
        $(this).val('');
        $(this).css('color', '#333');
      }
    }));
  }));

  setting.append($('<button>', {text:'导出设置', class:'output_setting', css:{margin:'4px 0 8px 20px',  'line-height':'20px', padding:'0px 6px', background:'#fff', border:'1px solid #aaa', color:'#777', 'border-radius':2, 'font-size':'12px', }}).click(function() {
    var setting_output = {};
    $('.confirm_input, [name="setting_input"], .output_tip').remove();
    setting.find('input, textarea, select').each(function() {
      if($(this).attr('type') == 'checkbox')
        setting_output[$(this).attr('name')] = $(this).prop('checked');
      else
       setting_output[$(this).attr('name')] = $(this).val();
    });
    GM_setClipboard(JSON.stringify(setting_output));
    setting.append($('<div>', {text:'已复制到粘贴板，现在你可以将全部设置信息发送给其他人了', class:'output_tip', css:{color:'#999', 'margin':'0px 0 0px'}}));
  }));


  $('.u_ddl').hide();
  $('<div>', {class:'delete_setting', css:{width:'400px', top:'28px ', left:'50%', 'margin-left':'-300px', background:'rgba(51, 51, 51, 0.3)', padding:'4px', position:'fixed', 'z-index':10001, 'font-size':'12px', 'vertical-align':'center', 'box-shadow':'0 0 5px #C6C6C6', 'border':'#aaa solid 1px', 'border-radius':3}}).append(setting).appendTo($('body'));
}




String.prototype.matched = function () {
  var matched_array = [];
  for (var i = 0; i < arguments.length; i++) {
    while (arguments[i].test(this)) {
      if (RegExp.lastParen)
        matched_array.push(RegExp.lastParen);
      else if (RegExp.lastMatch)
        matched_array.push(RegExp.lastMatch);
      if (!arguments[i].global)
        break;
    }
  }

  if (arguments[0].global)
    return matched_array;
  else
    return matched_array[0];
};

jQuery.fn.loaded = function(action) {
  var target = this.selector;
  if ($(target).length > 0)
    console.log($(target).length + ' ' + target + " is loaded at beginning");
  var check = setInterval(function () {
    if ($(target).length > 0) {
      console.log($(target).length + ' ' + target + " is loaded");
      clearInterval(check);
      action();
    }
  }, 200);
};

$.fn.update = function () {
  $(this).load(location.href + ' ' + this.selector + '>*');
};

$.fn.attrs = function () {
  var attrs = [];
  for (var i = 0; i < $(this).length; i++) {
    attrs.push($(this)[i]);
  }
  return attrs;
};

String.prototype.check = function (regexp) {
  if (!this || !regexp)
    return false;
  if (typeof regexp == 'string')
    regexp = [regexp];
  if (regexp && regexp instanceof Array && regexp.length>0){
    var re;
    for (var i = 0; i < regexp.length; i++) {
      if (/^\/.*\/$/.test(regexp)) {
        re = regexp[i].substring(1, regexp[i].length-1);
      } else {
        re = regexp[i].replace(/[\.|\\|\[|\{|\(|\)|\^|\$|\||\?|\+]/g, '\\$&').replace(/\*/g, '.*');
      }
      //console.log(new RegExp(re));
      if ((new RegExp(re)).test(this))
      return true;
    }
    return false;
  } else if (regexp instanceof RegExp) {
    return regexp.test(this);
  }
};

function count() {
  var i = 0;
  (function () {
    console.log(i);
    i++;
  })();
}

function loadData(href, selector, attr, callback) {
  if (arguments.length == 3 && typeof arguments[2] == 'function') {
    callback = arguments[2];
    attr = '';
  }

  var datas = [];
  var hrefs = href instanceof Array ? href : [href];
  for (var index = 0; index < hrefs.length; index++) {
    (function (index) {
          console.log(hrefs[index]);
          $.get(hrefs[index], function(response) {
            var element, elements, datas = [];
            //var $xml = $($.parseXML(response));
            if (typeof selector == 'string') {
              elements = $(response).find(selector);
              for (var k = 0; k < elements.length; k++) {
                element = elements.eq(k);
                if (attr === 'text')
                  datas.push(element.text());
                else if (attr && element.attr(attr))
                  datas.push(element.attr(attr));
                else
                  datas.push(element[0].outerHtml);
              }
            }
            else if (selector instanceof RegExp) {
              if (selector.exec(response)[1])
                datas.push(selector.exec(response)[1]);
              else
                datas.push(selector.exec(response)[0]);
            }


            if (selector instanceof Array) {
              var matches = function() {
                var matched_array = [];
                for (var i = 0; i < arguments.length; i++) {
                  while (arguments[i].test(this)) {
                    if (RegExp.lastParen)
                      matched_array.push(RegExp.lastParen);
                    else if (RegExp.lastMatch)
                      matched_array.push(RegExp.lastMatch);
                    if (!arguments[i].global)
                      break;
                  }
                }

                if (arguments[0].global)
                  return matched_array;
                else
                  return matched_array[0];
              };

              for (var i = 0; i < selector.length; i++) {
                if (selector[i] instanceof RegExp) {
                  datas.push(response.matches(selector[i]));
                }
                else {
                  var data = [];
                  elements = $(response).find(selector[i]);
                  for (var j = 0; j < elements.length; j++) {
                    element = elements.eq(j);
                    if (attr[i] === 'text')
                      data.push(element.text());
                    else if (attr[i] && element.attr(attr[i]))
                      data.push(element.attr(attr[i]));
                    else if (attr[i] === 'html')
                      data.push(element[0].outerHtml);
                    else
                      data.push(element[0].outerHtml);
                  }
                  if (typeof datas[i] == 'undefined')
                    datas[i] = data;
                  else
                    datas[i] = datas[i].concat(data);
                }
              }

            }



            if (index == hrefs.length) {
              if (datas.length === 1)
                callback(datas[0]);
              else
                callback(datas);
            }

          });

    })(index);

  }
}


function switch_running() {
  if (typeof stop_scan !== 'undefined' && stop_scan)
    stop_scan = false;
  else
    stop_scan = true;
}

// console.log = function (s) {
//   console.debug(s);
//   if (typeof GM_setValue == 'undefined')
//     localStorage.gm_log = typeof localStorage.gm_log == 'undefined' ? s : localStorage.gm_log + '\n' + s;
//   else
//     GM_setValue('log', typeof GM_getValue('log') == 'undefined' ? s : GM_getValue('log') + '\n' + s);
// };
// console.debug = function (s) {
//   Object.getPrototypeOf(console).debug(s);
//   set('debug', typeof get('debug') == 'undefined' ? '' + '\n' + s : get('debug') + '\n' + s);
// };
// console.error = function (s) {
//   console.debug(s);
//   if (typeof GM_setValue == 'undefined')
//     localStorage.gm_log = typeof localStorage.gm_log == 'undefined' ? s : localStorage.gm_log + '\n' + s;
//   else
//     GM_setValue('log', typeof GM_getValue('log') == 'undefined' ? s : GM_getValue('log') + '\n' + s);
// };

window.onerror = function(msg, url, line) {

  console.info(url+':'+line+'\n'+msg);
};

$(document).keydown(function (e) {
  var log = '';
  if (e.altKey === true && e.keyCode == 'l'.charCodeAt(0)-'a'.charCodeAt(0)+65) {
    log += 'script '+GM_info.script.version;
    log += GM_info.scriptHandler + ' ' + GM_info.version;
    log += navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+)/i)[0];
    log += navigator.appVersion.match(/(Win|Mac|Linux")/)[0];
    log += 'Errors:\n'+get('error');
    log += 'Logs:\n'+get('log');
    Object.getPrototypeOf(console).log(log);
  }
});


if (!location.href.indexOf("http://tieba.baidu.com/f?")) {
  $('.u_setting ul').loaded(function () {
      $('.u_setting ul').prepend($('<li>').append($('<a>', {text:'删除设置', css:{cursor:'pointer'}, click:show_setting})));

      $('.u_setting ul').prepend($('<li>').append($('<a>', {text:'停止删除', css:{cursor:'pointer'}, click:function() {
          if ($(this).text() == '停止删除') {
            stop_scan = true;
            $(this).text('自动删除');
          } else {
            stop_scan = false;
            $(this).text('停止删除');
            check_and_delete();
          }
      }})));

      check_and_delete();
  });


}

function check_and_delete(hrefs, users, replys, i) {
  if ($('.manager_btn').length === 0)
    return;
  if (typeof stop_scan !== 'undefined' && stop_scan)
    return;

  var href, user, gap, contain_block_user=false;
  if (!i)
    i = 0;
  if (hrefs)
    href = 'http://tieba.baidu.com/' + hrefs[i];
  else
    href = $("a.j_th_tit")[i].href;
  //console.log(href);

  if (users)
    gap = hrefs.length - users.length;
  else
    gap = $("a.j_th_tit").length - $(".tb_icon_author_rely .j_user_card").length;
  if (i-gap>=0) {
    if (users) {
      user = users[i-gap];
      reply = replys[i-gap];
    } else {
      user = $(".tb_icon_author_rely .j_user_card").eq(i-gap).text();
      reply = $('.j_thread_list .threadlist_rep_num').eq(i-gap).text();
    }
    if (get('block_users').match(/\S+/g) && user.check(get('block_users').match(/\S+/g)))
      contain_block_user = true;
    if (contain_block_user && get('block_days') !== '0') {
      console.log(user, reply, href);
      var pn = Math.floor(reply/30 + 1);
      scan (href + '?pn=' + pn, contain_block_user);
    }

  }





  if (get('below_level') !== '0') {
    var tid = href.match(/\d+/);
    whetherRecorded(tid, function (scaned) {
      if (!scaned)
        scan (href);
    });
  }


  i++;
  //console.log(i);
  if (i== get('scan_threads') || i == $("a.j_th_tit").length) {
    setTimeout(function () {
      if (typeof load_href === 'undefined') {
      if (!getUrlParameter('pn'))
        load_href = location.href + '&pn=50';
      else
        load_href = location.href.replace(/pn=\d+/, 'pn='+(parseInt(getUrlParameter('pn'))+50));
      }
      else
        load_href = load_href.replace(/pn=\d+/, 'pn='+(parseInt(/pn=(\d+)/.exec(load_href)[1])+50));
      if (parseInt(/pn=(\d+)/.exec(load_href)[1]) >= parseInt(get('scan_threads'))) {
        load_href = load_href.replace(/pn=\d+/, 'pn=0');
        console.log('load_href:'+load_href);
        loadData(load_href, ['a.j_th_tit', '.tb_icon_author_rely .j_user_card', '.j_thread_list .threadlist_rep_num'], ['href', 'text', 'text'], function (datas) {
          console.log(datas[0], datas[1], datas[2]);
          check_and_delete(datas[0], datas[1], datas[2], 0);
        });
      }


    }, get('scan_interval_seconds') * 1000);
  } else if (get('below_level') !== '0' || get('block_days') !== '0') {
    setTimeout(function() {
      check_and_delete(hrefs, users, replys, i);
    }, 50);
  }



}


function scan (href, contain_block_user) {
  if (href.indexOf('http://tieba.baidu.com/p/') !== 0)
    return;
  $.get(href, function (data) {
    var html = $(data);
    console.log(href + ' ' + html.find('.l_post').length);
    //console.log(/<title>(.*?)<\//.exec(data)[1]);
    if (/"tbs"\s*:\s*"(\w+)"/.exec(data)) {
      var tbs = data.matched(/"tbs"\s*:\s*"(\w+)"/);
      var tid = data.matched(/thread_id\s*:\s*(\d+)/);
      var kw = data.matched(/forum\.name_url\s*=\s*"(\S+?)"/, /forum_name\s*:\s*'(\S+?)'/);
      var fid = data.matched(/\{"forum_id"\s*:\s*(\d+)/);


      html.find('.l_post').each(function(i) {
        var data, that = this;
        var delete_post = function (also_delete, also_blockid) {
          var pid = $(that).find('.d_post_content').attr('id').replace('post_content_', '');

          if (also_blockid) {
            var block_days = get('block_days');
            if(block_days == 10 && isXiaoba())
              block_days = 3;
            data = {day:block_days,
            fid:fid,
            tbs:tbs,
            ie:'utf-8',
            'user_name[]':$(that).find('.p_author_name').text(),
            'pid[]':pid,
            'reason':'扰乱贴吧秩序'
            };
            console.log(data);

            $.post('http://tieba.baidu.com/pmc/blockid', data, function(response) {
            console.log(response);
            });
          }

          if(also_delete) {
            data = {
              commit_fr:'pb',
              ie:'utf-8',
              tbs:tbs,
              kw:kw,
              fid:fid,
              tid:tid,
              is_vipdel:0,
              pid:pid,
              is_finf:false
            };
            //console.log(data);
            console.log($(that).find('.d_post_content').text());
              $.post('http://tieba.baidu.com/f/commit/post/delete', data, function(response) {
                console.log(response);
              });
          }


        };

        if (contain_block_user) {
          if ($(this).find('.p_author_name').text().check(get('block_users').match(/\S+/g))) {
            console.log('user:'+$(this).find('.p_author_name').text());
            delete_post(get('also_delete'), true);
          }


        } else {
          var pn = (getUrlParameter('pn', href) || 1) - 1;
          if(pn*30 + i > get('scan_floors'))
            return;
          if($(this).find('.d_badge_lv').text() <= get('below_level')  && !$(this).find('.p_author_name').text().check(get('white_users').match(/\S+/g))) {
              if (!get('only_last') && $(this).find('.p_author_name').text().check(get('block_users').match(/\S+/g)))
                delete_post(get('also_delete'), true);
              else if ($(this).find('.d_post_content').text().check(get('append_rules').match(/\S+/g)))
                delete_post(true, get('also_blockid'));
              else if ($(this).find('.voice_player').length && $(this).find('.voice_player .second').text().check(get('append_rules').match(/\S+/g)))
                delete_post(true, get('also_blockid'));
              else if ($(this).find('.j_user_sign, .BDE_Image').length == 1) {
                GM_xmlhttpRequest({
                  method: "HEAD",
                  url: $(this).find('.j_user_sign, .BDE_Image').attr('src'),
                  onload: function(response) {
                    //console.log('ETag='+response.responseHeaders.matched(/ETag: "(\w+)"/));
                    if ((get('append_ETags')+get('edit_ETags')).indexOf(response.responseHeaders.matched(/ETag: "(\w+)"/)) >= 0)
                      delete_post();
                  },
                  onerror: function(response) {
                    console.log(response.statusText);
                  }
                });

              }

          }
        }


    });

    if ($(data).find('.l_post').length >= 20)
      recorded(tid);

    if (typeof next_href === 'undefined') {
    if (!getUrlParameter('pn'))
      next_href = location.href + '&pn=2';
    else
      next_href = location.href.replace(/pn=\d+/, 'pn='+(parseInt(getUrlParameter('pn'))+1));
    }
    else
      next_href = next_href.replace(/pn=\d+/, 'pn='+(parseInt(/pn=(\d+)/.exec(next_href)[1])+1));
    if (parseInt(/pn=(\d+)/.exec(next_href)[1]-1)*30 < parseInt(get('scan_floors'))) {
      console.log('next_href:'+next_href);
      scan(next_href);
    }
  }


});
}

function isXiaoba() {
  var result = true;
  for (var i = 0; i < array.length; i++) {
    if ($('.u_username_title').text() == $('.manager_name a').text())
      result = false;
  }
  return result;
}

function onStoreOpened(func, funcByLocalStorage, use_local_storage) {
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if(!indexedDB || use_local_storage) {
    if(!indexedDB)
      console.log("你的浏览器不支持IndexedDB");
    if (funcByLocalStorage)
      funcByLocalStorage();
  } else {
    var request = indexedDB.open("tieba_recorded", 1);
    var db;
    request.onerror = function(event){
      console.log("打开数据库失败", event);
    };
    request.onupgradeneeded   = function(event){
      console.log("Upgrading database");
      db = event.target.result;
      var objectStore = db.createObjectStore("recorded", { keyPath : "tid" });
    };
    request.onsuccess  = function(event){
      var db = event.target.result;
      var transaction = db.transaction(["recorded"],"readwrite");
      var store = transaction.objectStore("recorded");
      func(store);
    };
  }
}


function recorded(tid) {
  onStoreOpened(function(store){
    store.add({tid: tid});
    console.log(tid + " is recorded");
  },
  function () {
    if (typeof localStorage.recorded === 'undefined')
      localStorage.recorded = '';
    localStorage.recorded = tid + ' ' + localStorage.recorded;
  });
}


function whetherRecorded(tid, callback) {
  var result;
  onStoreOpened(function(store){
    var request = store.get(tid);
    request.onsuccess = function(event){
      if (request.result) {
        //console.log(tid + " is recorded already");
        result = true;
      } else {
        //console.log(tid + " is not recorded");
        result = false;
      }
      if (callback)
      callback(result);
    };
  }, function () {
    console.log("你的浏览器不支持IndexedDB");
    if (localStorage.recorded && localStorage.recorded.indexOf(tid) >= 0) {
      result = true;
    } else {
      result = false;
    }
    if (callback)
    callback(result);
  });
}

function getUrlParameter(name, url) {
  if (!url)
    url = location.href;
  if (url.indexOf('?') > 0) {
    var href = url.substring(url.indexOf('?')+1);
    if (href.indexOf('#')>=0)
      href = href.substring(0, href.indexOf('#'));
    var arrays = href.split('&');
    for (var i = 0; i < arrays.length; i++) {
      var parameter = arrays[i].split('=');
      if (decodeURIComponent(parameter[0]) === name)
        return decodeURIComponent(parameter[1]);
    }
     return '';
  } else
   return '';
}
