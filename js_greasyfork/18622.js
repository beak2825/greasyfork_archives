// ==UserScript==
// @name        virtonomica office_adv
// @namespace   virtonomica
// @description office advertisement
// @include     *virtonomic*.*/*/main/unit/view/*/virtasement*
// @version     1.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18622/virtonomica%20office_adv.user.js
// @updateURL https://update.greasyfork.org/scripts/18622/virtonomica%20office_adv.meta.js
// ==/UserScript==
var run = function (type) {
  var realm = 'vera';
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var clone = function (o) {
    if (!o || 'object' !== typeof o) {return o;}
    var c = 'function' === typeof o.pop ? [] : {};
    var p,v;
    for (p in o) {
      if (o.hasOwnProperty(p)) {
        v = o[p];
        if (v && 'object' === typeof v) {c[p] = clone(v);} 
        else {c[p] = v;}
      }
    }
    return c;
  }
  function getURL(href) {
    return href.match(/(\D+\/unit\/view\/\d+\/virtasement\/)(\d+\/?\d+)/);
  }
  function getGroup() {
    var loc = getURL(location.href);
    arr = readCookie('units');
    setCookie('units', 0, - 1);
    if (arr == null) {
      var arr = new Array();
      arr[0] = loc[1];
      arr[arr.length] = loc[2];
    } 
    else
    {
      arr = arr.split(',');
      total = arr.length;
      if (total == 0) {
        arr[0] = loc[1];
        arr[arr.length] = loc[2];
      }
    }
    return arr;
  }
  var doit = function (params, url, data) {
    var arr = getGroup();
    if (data == undefined) data = '';
    var total = arr.length - 1;
    try {
      $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
      $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + total + '</div>').width($(window).width()).prependTo('body');
      var num = 1,
      handle = function () {
        if (num >= arr.length) {
          $('#js-progress').remove();
          $('#js-wall').remove();
          alert('Операция выполнена для предприятий: ' + (num - 1));
          history.back();
          return;
        }
        $('#js-curr').text(num);
        var ajax = clone(params);
        ajax.url = arr[0] + arr[num];
        ajax.data = data;
        ajax.success = handle;
        ajax.error = function () {
          alert('Ошибка!');
          $('#js-progress').remove();
          $('#js-wall').remove();
        }
        num++;
        $.ajax(ajax);
      };
      handle();
    } catch (ex) {
      alert(ex);
    }
  }
  var main = function () {
    $('input[name="destroy"]').before($('<input class="button250" type="submit" value="Запустить выбранные кампании" name="mass_adv">').click(redirect))
  }
  var adv = function () {
    $('.buttonset [class*="button"]').each( function(){
      $(this).unbind().click(function () {
       var data = $('form[name="advertForm"]:first').serialize();
       doit({type: 'POST'}, '', data + '&' + $(this).attr('name') + '=' + $(this).attr('value'))
       return false;
      })
    })
  }
  var redirect = function () {
    try {
      var arr = new Array();
      $('.destroy:checked').each(function () {
        var loc = getURL($(this).parent().parent().find('>td:first').attr('onclick').replace('Go(\'', '').replace('\')', ''));
        arr[0] = loc[1];
        arr[arr.length] = loc[2];
      })
      if (arr.length == 0) return false;
      var units = arr.join(',');
      if (units.length > 4090) {
        alert('Выбрано слишком много подразделений. (l=' + units.length + '). Операция прервана.');
        return false;
      } //размер cookie не больше 4К

      setCookie('units', units);
      var url = arr[0] + arr[1];
      window.location = url;
    } catch (ex) {
      alert('Error: ' + ex);
    }
    return false;
  }
  switch (type) {
    case 'main':
      main();
      break;
    case 'adv':
      adv();
      break;
  }
}
var handlers = [
  {
    regex: /main\/unit\/view\/\d+\/virtasement$/,
    handler: 'main'
  },
  {
    regex: /main\/unit\/view\/\d+\/virtasement\/\d+\/\d+$/,
    handler: 'adv'
  }
];
for (var i = 0; i < handlers.length; i++) {
  if (handlers[i].regex.test(location.href)) {
    // Хак, что бы получить полноценный доступ к DOM >:]
    var script = document.createElement('script');
    script.textContent = '(' + run.toString() + ')("' + handlers[i].handler + '");';
    document.getElementsByTagName('head') [0].appendChild(script);
    break;
  }
}
