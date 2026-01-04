// ==UserScript==
// @name         Chaster Translator zh-cn
// @namespace    chaster_translator_zh-cn
// @version      0.2
// @description  Chaster Translator Simplified Chinese
// @author       HBcao
// @match        https://*.chaster.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaster.app
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/470690/Chaster%20Translator%20zh-cn.user.js
// @updateURL https://update.greasyfork.org/scripts/470690/Chaster%20Translator%20zh-cn.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var first = true;
  var s, ss;

  function wait(selector, func, times, interval) {
    var _times = times || -1,
      _interval = interval || 20, //20毫秒每次 
      _self,
      _iIntervalID; //定时器id
    _iIntervalID = setInterval(function () {
      if (!_times) { //是0就退出
        clearInterval(_iIntervalID);
      }
      _times <= 0 || _times--; //如果是正数就 --

      _self = $(selector);
      if (_self.length) {
        clearInterval(_iIntervalID);
        func && func.call(_self);
      }
    }, _interval);

    return _self;
  }
  $.fn.wait = function (selector, func, times, interval) {
    var parent = this, _times = times || -1,
      _interval = interval || 20, //20毫秒每次 
      _self,
      _iIntervalID; //定时器id
    _iIntervalID = setInterval(function () {
      if (!_times) { //是0就退出
        clearInterval(_iIntervalID);
      }
      _times <= 0 || _times--; //如果是正数就 --

      _self = $(parent).find(selector);
      if (_self.length) {
        try {
          func && func.call(_self);
        } catch (e) {
          console.warn(e);
          return false;
        }
        clearInterval(_iIntervalID);
      }
    }, _interval);

    return parent;
  }

  function waitIf(funcIf, func, times, interval) {
    if (!funcIf) return false;
    var _times = times || -1,
      _interval = interval || 20,  //20毫秒每次 
      _iIntervalID;  // 定时器id
    _iIntervalID = setInterval(function () {
      if (!_times) {
        clearInterval(_iIntervalID);
      }
      _times <= 0 || _times--;  //如果是正数就 --

      if (funcIf()) {
        clearInterval(_iIntervalID);
        func && func.call();
      }
    }, _interval);
    return true;
  }

  function is_mobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
      return true;
    }
    if (window.innerWidth < 400) {
      return true;
    }
    var result = regex_match.exec(u);
    if (null == result) {
      return false
    } else {
      return true
    }
  }

  $(function () {
    function check() {
      s = $(location).attr("href")
        .replace(/https:\/\/.*chaster.app\//g, '')
        .replace(/#.*/g, '');
      ss = s.split('/');
      console.log(ss);

      if (!is_mobile()) {
        if (ss[0] == 'locks' || ss[0] == 'shared-locks' || ss[0] == 'keyholder' || ss[0] == 'explore' ||
          ss[0] == 'activity' || ss[0] == 'users' || ss[0] == 'verifications' || ss[0] == 'user' ||
          ss[0] == 'rules') {
          head();
          left();
        }
      } else {
        if (ss[0] != 'auth') {
          bottom();
        }
      }
      main();
    }
    $(window).resize(check);

    function main() {
      try {
        if (first) loading();

        switch (ss[0]) {
          case '':
            home(); break;
          case 'auth':
            login(); break;
          case 'register':
            register(); break;
          case 'locks':
            switch (ss[1]) {
              case undefined:
              case '':
                locks(); break;
              case 'new':
                locks_new(); break;
              default:
                switch (ss[2]) {
                  case 'history':
                    locks_history(); break;
                  case 'extensions':
                    locks_extensions(); break;
                  case 'settings':
                    switch (ss[3]) {
                      case undefined:
                      case '':
                        locks_settings(); break;
                      case 'extensions':
                        if (ss[4] == 'edit') {
                          locks_settings_extensions_edit();
                        } else {
                          locks_settings_extensions();
                        }
                        break;
                      case 'keyholder':
                        locks_settings_keyholder(); break;
                    }
                    break;
                }
            }
            break;
          case 'verifications':
            verifications(); break;
          case 'shared-locks':
            switch (ss[1]) {
              case undefined:
              case '':
                shared_locks(); break;
              case 'new':
                shared_locks_new(); break;
              default:
                shared_locks_lock(); break;
            }
            break;
          case 'keyholder':
            keyholder(ss);
            break;
          case 'explore':
            switch (ss[1]) {
              case undefined:
              case '':
                explore(); break;
              case 'search':
                explore_search(); break;
              default:
                explore_lock(); break;
            }
            break;
          case 'rules':
            if (ss[1] == 'community' && ss[2] == 'review') {
              rules_community_review();
            }
            break;
          case 'menu':
            if (ss[1] == 'profile') {
              menu_profile();
            }
            break;
        }
      } catch (e) {
        console.warn(e)
      }
    }
    check();

    const _historyWrap = function (type) {
      const orig = history[type];
      const e = new Event(type);
      return function () {
        const rv = orig.apply(this, arguments);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    window.addEventListener('popstate', function (event) {
      console.log('change popstate');
      check()
    })

    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

    window.addEventListener('pushState', function (e) {
      console.log('change pushState');
      check()
    });
    window.addEventListener('replaceState', function (e) {
      console.log('change replaceState');
      check()
    });
  })

  function loading() {
    wait('#root .full-page-loader', function () {
      first = false;
      var _iIntervalID;
      _iIntervalID = setInterval(function () {
        let c = $('#root .full-page-loader .caption');
        let t = c.text();
        let tt;
        switch (t) {
          case 'Loading...':
            tt = '加载中...'; break;
          case 'Loading account...':
            tt = '加载账号中...'; break;
          case 'Loading settings...':
            tt = '加载账号中...'; break;
          case 'Loading profile...':
            tt = '加载数据中...'; break;
        }
        c.text(tt);
        if (c.length == 0) {
          clearInterval(_iIntervalID);
        }
      })
    }, 20);
  }

  function home() {
    wait('#root .wrapper .navbar-collapse', function () {
      try {
        let $visitor_navbar = $(this);
        let $visitor_navbar0 = $($visitor_navbar.children()[0]);
        let $visitor_navbar1 = $($visitor_navbar.children()[1]);
        try {
          $($visitor_navbar0.children()[0]).text('探索');
          $($visitor_navbar0.children()[1]).text('公开锁');
          $visitor_navbar0.children()[2].innerHTML = $visitor_navbar0.children()[2].innerHTML.replace('Plus', '会员');
        } catch (e) { }

        $($visitor_navbar1.find('>a')[0]).text('登录');
        $($visitor_navbar1.find('>a')[1]).text('注册');

        head()
      } catch (e) {
        console.warn(e)
      }
    })

    wait('#root .Home', function () {
      try {
        $($(this).children()[0].children[0].children[0].children[1]).text('终极贞操体验');
        let signup = $(this).children()[0].children[0].children[0].children[2].children[0].children[0];
        signup.innerHTML = signup.innerHTML
          .replace('Sign up', '注册')
          .replace('Access the application', '访问应用程序');

        let a = $(this).children()[1].children[0].children[0].children;
        $(a[0]).text('Time-based locks - 时间锁计划');
        $(a[1]).text('探索新的贞操体验，定制时间锁计划和为您打造的新冒险。使用Chaster，使用社区锁计划中的一个，或者创建自己的自定义锁计划。');

        a = $(this).children()[2].children[0].children[0].children[0].children;
        $(a[0]).text('Keyholders - 钥匙管理者');
        $(a[1]).text('创建共享锁计划(shared locks)并控制其他用户的锁。管理他人锁的持续时间，并通过扩展(extensions)带来挑战。');

        a = $(this).children()[3].children[0].children[0].children;
        $(a[0]).text('Extensions - 拓展');
        $(a[1]).text('无限的可能性的锁扩展。为你的锁添加扩展，添加新功能，体验终极贞洁体验。包括但不限于分享加时链接(Shared links)、角色(Role)、随机事件(Random Events)等诸多功能。');

        a = $(this).children()[4].children[0].children[0].children;
        $(a[0]).text('Chaster 功能');
        $(a[1]).text('许多功能能带来卓越体验');
        let b = a[2].children[1].children[0].children;
        b[0].children[1].children[0].innerText = "图片锁盒密码";
        b[0].children[1].children[1].innerText = "为你的锁盒拍照，或者生成一个密码。";
        b[1].children[1].children[0].innerText = "锁计划和冒险";
        b[1].children[1].children[1].innerText = "在数百个锁计划中选择一个计划，无论您是初学者还是高级用户。";
        b[2].children[1].children[0].innerText = "拓展(Extensions)";
        b[2].children[1].children[1].innerText = "添加新功能以自定义您的锁。";
        b[3].children[1].children[0].innerText = "事件(Events)";
        b[3].children[1].children[1].innerText = "参加由Chaster团队或社区创建的每日或每周活动。";

        if ($(this).children().length > 5) {
          a = $(this).children()[5].children[0].children[0].children;
          a[0].innerText = '加入Chaster社区';
          a[1].innerText = '注册并加入Chaster社区，即可访问所有功能，体验终极贞操体验！';
          a[2].children[0].children[0].innerText = '在Chaster注册';
          a[3].children[0].innerText = '我已有账号';
        }

      }
      catch (e) {
        console.warn(e);
      }
    })

    wait('#root .Footer .container .row', function () {
      try {
        let a = $(this).children();
        a[0].children[1].children[0].innerText = '与Chaster一起探索新的贞操体验。';

        a[1].children[0].innerText = 'Resources - 资源';
        let b = $(a[1].children[1]).find('a');
        b[0].innerText = '文档';
        b[1].innerText = '隐私政策';
        b[2].innerText = '用户条款';

        a[2].children[0].innerText = 'Application - 应用';
        b = $(a[2].children[1]).find('a');
        b[0].innerText = '文档';
        b[1].innerText = '更新日志';
        b[2].innerText = '反馈';
        b[3].innerText = '开发';
      } catch (e) {
        console.warn(e);
      }
    })
  }

  function register() {
    wait('.Register .register-col', function () {
      $('.wrapper > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > .caption').text('终极贞操体验');

      let a = $(this).children();
      a[0].innerText = '注册';
      a[1].innerText = '在Chaster上注册以获得新的贞操体验。';
      a[4].innerHTML = a[4].innerHTML
        .replace('Have an account?', '已有账号？')
        .replace('Log in', '登录');

      a = a[3].children;
      a[0].children[0].innerText = '用户名';
      a[1].children[0].innerText = '邮箱地址';
      a[2].children[0].innerText = '密码';
      a[4].innerHTML = a[4].innerHTML
        .replace('By registering, you agree to our', '一经注册即代表你同意我们的')
        .replace('terms<', '用户条款<')
        .replace('and', '和')
        .replace('privacy policy', '隐私政策');
    })
  }

  function login() {
    wait('.main', function () {
      try {
        $(this).children()[0].children[0].children[1].innerText = '终极贞操体验';

        if ($(this).children()[1].children[0].children[1].children[0].innerText == 'Sign in to your account') {
          $(this).children()[1].children[0].children[1].children[0].innerText = '登录您的帐户';
          $(this).children()[1].children[0].children[1].children[1].innerText = '登录Chaster，探索终极贞操体验。';

          let form = $($(this).children()[1].children[0].children[2]).find('form')[0];
          form.children[0].children[0].innerText = '用户名或邮箱';
          form.children[1].children[0].innerText = '密码';
          form.children[2].children[1].children[0].children[0].innerText = '忘记密码？';
          $(form.children[3].children[1]).val('登录');
        }

      } catch (e) {
        console.warn(e);
      }
    })
  }

  function head() {
    wait('.navbar-nav .profile-dropdown a', function () {
      setTimeout(function () {
        try {
          $('.navbar-nav .profile-dropdown a').click(function () {
            setTimeout(function () {
              let a = $('.navbar-nav .profile-dropdown a').next().children();
              a[1].innerText = '账号';
              a[2].innerText = '保存的锁';
              a[3].innerText = '设置';
              a[5].innerText = '登出';
            }, 10);
          })
        } catch (e) {
          console.warn(e)
        }
      }, 1000)


    })

  }

  function left() {
    wait('.wrapper .p-4', function () {
      function _left() {
        try {
          let a = $('.wrapper .p-4')[0].children;
          if (a.length > 1 && a[1].innerText == 'MENU') {
            a[1].innerText = '菜单';

            let b = a[2].children;
            b[0].children[0].children[0].children[1].innerText = '锁计划';
            b[1].children[0].children[0].children[1].innerText = '共享锁计划';
            // b[2].children[0].children[0].children[1].innerText = '钥匙管理者';
            b[3].children[0].children[0].children[1].innerText = '探索';
            b[4].children[0].children[0].children[1].innerText = '公示锁';
            b[5].children[0].children[0].children[1].innerText = 'Chaster Plus会员';

            a[4].innerText = '社区';
            b = a[5].children;
            b[0].children[0].children[0].children[1].innerText = '成员';
            b[1].children[0].children[0].children[1].innerText = '核查锁照';

            let $b = $(a[7].children[1]).find('>a');
            $b[0].innerText = '文档';
            $b[1].innerText = '开发';
            $b[2].innerText = '更新日志';
            $b[3].innerText = '用户条款';
            $b[4].innerText = '隐私政策';

            // $('.wrapper .p-4 .align-items-center button').click(_left);
            waitIf(() => { return a[1].innerText == 'MENU' }, () => {
              _left();
            }, 50)
          }

        } catch (e) {
          console.warn(e)
        }
      }
      _left();
    })
  }

  function bottom() {
    function _bottom() {
      for (let i = 0; i < $(this).length; i++) {
        let $item = $($(this)[i]);
        let $name = $item.find('.name');
        let name = String($name.text()).trim();
        switch (name) {
          case 'Locks':
            $name.text('锁计划');
            break;
          case 'Explore':
            $name.text('探索');
            break;
          case 'Activity':
            $name.text('公示锁');
            break;
          case 'Messages':
            $name.text('消息');
            break;
        }
      }
      waitIf(() => { return $($(this)[0]).find('.name').text() == 'Locks' }, () => {
        _bottom.call(this);
      }, 50)
    }
    wait('.BottomMenuBarWrapper .BottomMenuBar .BottomMenuBarItem', _bottom)
  }

  function dialog() {
    function _penalty_option(a) {
      let $a = $(a);
      let options = $a.find('select option');
      for (let i = 0; i < options.length; i++) {
        let $option = $(options[i]);
        let v = String($option.val()).trim();
        switch (v) {
          case 'add_time':
            $option.text('加时');
            break;
          case 'freeze':
            $option.text('冻结');
            break;
          case 'pillory':
            $option.text('公示');
            break;
        }
      }
    }

    function _penalty_box($p) {
      try {
        let b = $p.children();
        b[0].innerText = '放弃任务时的惩罚';
        if (b[1].children.length > 0) _penalty_option(b[1]);
        $(b[1]).on('click', '.mt-3 button', function () {
          setTimeout(() => {
            _penalty_option(b[1]);
          }, 10);
        })
        $(b[1]).on('change', 'select', function () {
          setTimeout(() => {
            _penalty_option(b[1]);
          }, 10);
        })
        $(b[1]).on('click', '.actions span:nth-child(1)', function () {
          setTimeout(() => {
            _penalty_option(b[1]);
          }, 10);
        })
        $(b[1]).on('mouseover', '.ml-3 .text-warning', function () {
          wait('.tooltip-inner', function () {
            $(this).text('确保你有办法解冻自己（keyholder、其他扩展插件等），否则你将面临无限期冻结的风险！');
          })
        })
      } catch (e) {
        console.warn(e)
      }
    }

    function _input(input) {
      let $section = $(input).find('~div');
      $section.children().hide();
      $(input).find('~div .trans').remove();

      let title_list = [
        'Self-training - 自我训练',
        'CBT - 认知行为治疗',
        'Teasing - 挑逗',
        'Oral - 口',
        'Exercice - 体育锻炼'
      ]
      let item_li_list = [
        [
          {
            id: 0,
            text: '佩戴肛塞 (30 分钟) (Wear a buttplug (30 min))',
            fulltext: '佩戴肛塞 (30 分钟) Wear a buttplug (30 min) peidaigangsai pdgs',
          },
          {
            id: 1,
            text: '抽插假阳具 (30 分钟) (Fuck a dildo (30 min))',
            fulltext: '抽插假阳具 (30 分钟) Fuck a dildo (30 min) chouchajiayangju ccjyj',
          },
          {
            id: 2,
            text: '充气肛塞 (30 分钟) (Inflatable plug (30 min))',
            fulltext: '充气肛塞 (30 分钟) Inflatable plug (30 min) chongqigangsai cqgs',
          },
          {
            id: 3,
            text: '两指叠放抽插你的屁股 (Put one finger after the other in your ass)',
            fulltext: '两指叠放抽插你的屁股 Put one finger after the other in your ass',
          }
        ],
        [
          {
            id: 0,
            text: '电击 (Electro-stimulation)',
            fulltext: '电击 Electro-stimulation dianji dj',
          },
          {
            id: 1,
            text: '拍打蛋蛋 30 次 (Slap balls 30 times)',
            fulltext: '拍打蛋蛋 30 次 Slap balls 30 times paidadandan pddd',
          },
          {
            id: 2,
            text: '拳击蛋蛋 10 次 (Punch balls 10 times)',
            fulltext: '拳击蛋蛋 10 次 Punch balls 10 times quanjidandan qjdd',
          },
          {
            id: 3,
            text: '拳击贞操锁 20 次 (Punch your cage 20 times)',
            fulltext: '拳击贞操锁 20 次 Punch your cage 20 times quanjizhencaosuo qjzcs',
          },
          {
            id: 4,
            text: '冰敷蛋蛋 (Put ice on your balls)',
            fulltext: '冰敷蛋蛋 Put ice on your balls bingfudandan bfdd',
          }
        ],
        [
          {
            id: 0,
            text: '不触碰下体看涩涩 (20 分钟) (Watch porn without touching (20 min))',
            fulltext: '不触碰下体看涩涩 (20 分钟) Watch porn without touching (20 min) buchupengxiatikansese bcpxtkss',
          },
          {
            id: 1,
            text: '边看涩涩边摩擦抱枕 (20 分钟)Watch porn while humping a pillow (20 min)',
            fulltext: '边看涩涩边摩擦抱枕 (20 分钟) Watch porn while humping a pillow (20 min) biankansesebianmocabaozhen bkssbmcbz',
          },
          {
            id: 2,
            text: '边看涩涩边用振动器 (20 分钟)Watch porn while using a vibrator (20 min)',
            fulltext: '边看涩涩边用振动器 (20 分钟) Watch porn while using a vibrator (20 min) biankansesebianyongzhendongqi bkssbyzdq',
          },
          {
            id: 3,
            text: '边看涩涩，边撸动放置在贞操锁上的假阴茎 (Watch porn while stroking a dildo)',
            fulltext: '边看涩涩，边撸动放置在贞操锁上的假阴茎 Watch porn while stroking a dildo beside your cage biankansese bianludongfangzhizaizhencaosuoshangdejiayinjing bkss bldfzzzcssdjyj',
          }
        ],
        [
          {
            id: 0,
            text: '吮吸假阴茎 (10 分钟) (Suck on a dildo (10 min))',
            fulltext: '吮吸假阴茎 (10 分钟) Suck on a dildo (10 min) shunxijiayinjing sxjyj',
          },
          {
            id: 1,
            text: '40次深喉 (40 deepthroats)',
            fulltext: '40次深喉 40 deepthroats sishicishenhou sscsh',
          },
          {
            id: 2,
            text: '20次深喉 (每次至少保持10秒) (20 deepthroats held for at least 10s)',
            fulltext: '20次深喉 (每次至少保持10秒) 20 deepthroats held for at least 10 seconds ershicishenhou escsh',
          },
        ],
        [
          {
            id: 0,
            text: '30个深蹲 (30 squats)',
            fulltext: '30个深蹲 30 squats sanshigeshendun ssgsd',
          },
          {
            id: 1,
            text: '30个俯卧撑 (30 push-ups)',
            fulltext: '30个俯卧撑 30 push-ups sanshigefuwocheng ssgfwc',
          },
          {
            id: 2,
            text: '30个仰卧起坐 (30 sit-ups)',
            fulltext: '30个仰卧起坐 30 sit-ups sanshigeyangwoqizuo ssgywqz',
          },
        ]
      ]
      let item_li_list_show = [
        [], [], [], [], []
      ];

      let v = String($(input).val());
      let flag = false;
      if (v.trim() != '') {
        for (let i = 0; i < item_li_list.length; i++) {
          for (let j = 0; j < item_li_list[i].length; j++) {
            let fulltext = String(item_li_list[i][j].fulltext);
            if (fulltext.indexOf(v.trim()) != -1) {
              item_li_list_show[i].push(item_li_list[i][j]);
              flag = true;
            }
          }
        }
      } else {
        item_li_list_show = item_li_list;
      }
      if (flag) $section.addClass('react-autosuggest__suggestions-container--open');

      for (let i = 0; i < item_li_list_show.length; i++) {
        if (item_li_list_show[i].length > 0) {
          let $item = $('<div class="react-autosuggest__section-container trans"></div>');
          if (i == 0) $item.addClass('react-autosuggest__section-container--first');
          $item.append($('<div class="react-autosuggest__section-title">' + title_list[i] + '</div>'));

          let $ul = $('<ul class="react-autosuggest__suggestions-list"></ul>');
          for (let j = 0; j < item_li_list_show[i].length; j++) {
            let $li = $('<li role="option" class="react-autosuggest__suggestion">' + item_li_list_show[i][j].text + '</li>');
            if (j == 0) $li.addClass('react-autosuggest__suggestion--first');
            $li.attr({
              'id': 'react-autowhatever-1-section-' + i + '-item-' + item_li_list_show[i][j].id,
              'aria-selected': false,
            })
            $ul.append($li);
          }

          $item.append($ul);
          $section.append($item);

          $item.find('li').click(function () {
            let id = $(this).attr('id');
            let $parent = $(this).parent().parent().parent();
            $parent.find('div:not(.trans) #' + id).click();
            setTimeout(() => {
              $(input).val(this.innerText);
            }, 10);
          })
        }
      }
    }

    wait('.modal-dialog .modal-content', function () {
      try {
        let $title = $(this).find('.modal-header>.modal-title>.modal-title'),
          $body = $(this).find('.modal-body'),
          $footer = $(this).find('.modal-footer');

        if ($title.length == 0) {
          $title = $(this).find('.modal-header>.modal-title');
        }
        let b1, b2, f, a, b, c, btns, $o, o_children, $a;
        let title_text = $title.text().trim();

        function extensions_mode($body, modes_info) {
          let a, modes, $o, o_children;
          if (!modes_info) {
            modes_info = [
              {
                'text': '不累积',
                'tooltip': '在每次操作之后，您必须等待一定的时间才能重用扩展。',
                'caption': '使用扩展后，您必须等待此时间才能再次使用它。',
              },
              {
                'text': '累积',
                'tooltip': '扩展的可使用次数会随时间累积。',
                'caption': '每过此时间扩展的可使用次数将会加 1。',
              },
              {
                'text': '无限制的',
                'tooltip': '您可以随意多次使用扩展。',
              }
            ]
          }

          a = $body.find('.d-sm-flex').children();
          a[0].children[0].children[0].innerText = '模式';
          a[0].children[0].children[1].innerText = '选择拓展模式';
          modes = a[0].children[0].children[2].children;
          for (let i = 0; i < modes.length; i++) {
            $(modes[i]).click(function () {
              wait('.modal-dialog .modal-body .d-sm-flex .flex-even:nth-child(2) .caption span', function () {
                if (modes_info[i].caption) this.text(modes_info[i].caption);
              })
            })
            $o = $(modes[i]).find('label > span:not(.ml-2)');
            o_children = $o.children();
            $o.empty();
            $o.append(modes_info[i].text);
            $(o_children[0]).hover(function () {
              wait('.tooltip-inner', function () {
                $(this).text(modes_info[i].tooltip);
              })
            })
            $o.append($(o_children[0]));
          }
          $body.find('.d-sm-flex .flex-even:nth-child(2) .caption span').text(modes_info[0].caption);
        }

        switch (title_text) {
          case 'Lock limit reached':
            $title.text('锁计划拥有上限已达到')
            b1 = $body.children()[0];
            b2 = $body.children()[1];
            $body.text('您已达到启用锁计划的最大数量。将您当前的锁存档以创建一个新锁，或成为Chaster Plus会员。');

            $(b2).find('.caption')[0].innerText = $(b2).find('.caption')[0].innerText.replace('per month', '每月');
            f = $(b2).find('.features')[0].children;
            f[0].innerHTML = f[0].innerHTML.replace('Unlimited locks and extensions', '无限制的锁计划和拓展');

            $(b2).find('.sub-subscribe button')[0].innerText = '订阅';
            $body.append(b1);
            $body.append(b2);

            $footer.find('button span').text('关闭');
            break;
          case 'Add more time':
            $title.text('增加时间');
            $body.children()[0].innerText = '你可以在这里给你的锁添加时间';

            a = $body.find('.DurationSelector')[0].children;
            a[0].children[2].innerText = '天';
            a[1].children[2].innerText = '时';
            a[2].children[2].innerText = '分';

            b = $footer[0].children;
            b[0].innerHTML = b[0].innerHTML.replace('Close', '关闭');
            b[1].innerHTML = b[1].innerHTML.replace('Add more time', '添加时间');
            break;
          case 'Update lock duration':
            $title.text('更新锁的时长');
            $body.children()[0].children[0].innerText = '你可以给锁增加或减少时间。';
            a = $($body.children()[0].children[1]).find('label');
            a[0].children[0].innerText = '加时';
            a[1].innerText = '减时';
            break;
          case 'Unlock your lock':
            $title.text('解锁你的锁');
            $body.children()[0].innerText = '你的锁已经可以打开了。您可以现在打开它并显示密码，或者添加时间。';
            let btns = $footer.find('button');
            let btns_span = $footer.find('button span');
            btns_span[0].innerHTML = btns_span[0].innerHTML.replace('Add more time', '增加时间');
            btns_span[1].innerHTML = btns_span[1].innerHTML.replace('Unlock my lock', '解锁');

            $(btns[0]).click(function () {
              var _timeid;
              _timeid = setInterval(() => {
                $title = $('.modal-dialog .modal-content').find('.modal-header>.modal-title');
                if ($title.text() == 'Add more time') {
                  dialog();
                  clearInterval(_timeid);
                }
              }, 20)
            })
            break;
          case 'Archive your lock':
            $title.text('归档你的锁');
            $body.children()[0].innerText = '是否要归档您的锁？你仍然可以从你的锁历史记录中看到它。';
            if ($body.children()[1]) {
              $body.children()[1].innerHTML = '警告：您的锁仍在运行。通过存档此锁，<strong>您将无法再访问您的密码</strong>。您的会话将被视为已放弃。';
            }
            b = $footer[0].children;
            b[0].innerHTML = b[0].innerHTML.replace('Cancel', '取消');
            b[1].innerHTML = b[1].innerHTML.replace('Archive my lock', '归档我的锁');
            break;
          case 'Put in pillory':
            $title.text('公示');
            $body.children()[0].innerText = '选择公示的时长和原因。';
            $body.children()[1].children[0].innerText = '公示时长';
            $body.children()[1].children[1].innerText = '访问者可以在这段时间内投票加时';
            $body.children()[2].children[0].innerText = '公示原因';
            $body.children()[3].innerText = '加时投票将被发布到 公开锁(Activity) 页面';
            break;
          case 'Configure Share links':
            $title.text('配置-分享链接');
            $body.children()[0].innerText = '与他人分享您锁的加时投票链接';
            a = $body.find('.mb-2').children();
            a[0].children[0].innerText = '增加的时间';
            a[0].children[1].innerText = '访问者投票增加时间时，所增加的时间。';
            a[1].children[0].innerText = '减少的时间';
            a[1].children[1].innerText = '访问者投票减少时间时，所减少的时间。';

            $o = $($body.find('.mb-3').children()[0]);
            o_children = $o.children();
            $o.empty();
            $o.append($(o_children[0]));
            $o.append('提供随机选项');
            $(o_children[1]).hover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('投票此选项将会在增加和减少时间之间随机选择。');
              })
            })
            $o.append($(o_children[1]));

            $body.find('form').children()[0].children[0].innerText = '所需投票次数';
            $body.find('form').children()[0].children[1].innerText = '你需要获得一定数量的投票才能解锁你的锁。';

            $o = $($body.find('form').children()[1].children[0]);
            o_children = $o.children();
            $o.empty();
            $o.append($(o_children[0]));
            $o.append('只允许登录的人投票');
            $(o_children[1]).hover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('如果启用此选项，访问者将需要登录才能增加或减少时间。');
              })
            })
            $o.append($(o_children[1]));
            break;
          case 'Configure Pillory':
            $title.text('配置 公开加时');
            $body.children()[0].innerText = '当您受到处罚时，将会在指定的时间段内公开显示。其他用户将能够为您的锁增加时间。';

            a = $body.children()[3].children;
            a[0].innerText = '每票加时';
            a[1].innerText = '访问者每次投票增加的时间';
            a[4].innerText = '我怎么会被公开加时？';

            b = a[5].children;
            b[0].innerText = '你可能会因为以下原因而被公开加时：';
            b[2].innerText = '注意：你不能自己公开。';
            c = b[1].children;
            c[0].innerText = '幸运转盘拓展(Wheel of Fortune Extensions)：指针落在公开格子上';
            c[1].innerText = 'Keyholder：你的Keyholder把你的锁公开';
            c[2].innerText = '惩罚拓展(Penalties Extensions)：你受到了惩罚';
            c[3].innerText = '验证锁照：你的验证锁照被多数拒绝';
            break;
          case 'Configure Hygiene opening':
            $title.text('配置-日常清洁');
            $body.children()[0].innerText = '因为卫生很重要，所以定期解锁自己来清洁你的贞操设备。要小心，如果你解锁超过了允许的时间，你将受到处罚。';

            $body.children()[2].children[0].children[0].children[0].innerText = 'Regularity - 间隔时间';
            $body.children()[2].children[0].children[0].children[1].children[0].innerText = '解锁后，您必须等待此时间才能再次解锁。';

            $body.children()[4].children[0].innerText = '每次允许解锁时间';
            $body.children()[4].children[1].innerText = '每次允许打开锁的最长时间。';

            $body.children()[5].children[0].innerText = '超时惩罚时间';
            $body.children()[5].children[1].innerText = '如果您没有在允许的时间之前锁回去，那么您的锁将增加此时间。';

            $o = $($body.children()[6].children[0]);
            o_children = $o.children();
            $o.empty();
            $o.append($(o_children[0]));
            $o.append('只允许keyholder打开锁清洁');
            $(o_children[1]).hover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('您将无法自己打开锁清洁，只有钥匙持有者(keyholder)才能打开。注意：启用此选项后，间隔时间将失效。');
              })
            })
            $o.append($(o_children[1]));

            $o.click(function () {
              wait('.modal-dialog .modal-body .text-warning', function () {
                this[0].innerHTML = this[0].innerHTML
                  .replace('By enabling this option, you will need to have a keyholder to unlock yourself temporarily.', '启用此选项后，您将需要一个keyholder才能清洁解锁。');
              })
            })
            break;
          case 'Configure Dice':
            $title.text('配置-骰子');
            $body.children()[0].innerText = '每一次你和机器人都会掷骰子。如果你掷的比机器人多，时间就会减少。如果机器人掷得更多，时间就会增加。';
            extensions_mode($body)

            $body.children()[3].children[0].innerText = '时间倍数';
            $body.children()[3].children[1].innerText = '两个骰子之间的差值将乘以这个时间。';
            break;
          case 'Configure Wheel of Fortune':
            $title.text('配置-幸运转盘');
            $body.children()[0].innerText = '转动幸运转盘，更改锁的持续时间。为幸运转盘的每个格子配置操作：增加或减少时间、冻结锁或自定义文本。';
            extensions_mode($body);
            $body.children()[4].innerText = '转盘格子';
            $body.children()[5].innerText = '配置幸运转盘的格子';

            function _option($body) {
              setTimeout(() => {
                let a = $($body.children()[6]).find('form .card-content');
                for (let i = 0; i < a.length; i++) {
                  let options = $(a[i]).find('select option');
                  for (let j = 0; j < options.length; j++) {
                    let $option = $(options[j]);
                    switch ($option.val()) {
                      case 'add-time':
                        $option.text('加时');
                        break;
                      case 'remove-time':
                        $option.text('减时');
                        break;
                      case 'add-remove-time':
                        $option.text('加时或减时');
                        break;
                      case 'text':
                        $option.text('文本');
                        break;
                      case 'freeze':
                        $option.text('冻结 / 解冻');
                        break;
                      case 'set-freeze':
                        $option.text('冻结');
                        break;
                      case 'set-unfreeze':
                        $option.text('解冻');
                        break;
                      case 'pillory':
                        $option.text('公示');
                        break;
                    }
                  }
                  $(a[i]).find('select').change(function () {
                    let self = this;
                    setTimeout(function () {
                      switch ($(self).find(':selected').val()) {
                        case 'text':
                          wait('.invalid-feedback', function () {
                            $(this).text('请输入文本');
                          })
                          $(a[i]).find('.flex-grow-1 .ml-2 input').bind('input propertychange', function () {
                            if ($(this).val() == '') {
                              wait('.invalid-feedback', function () {
                                $(this).text('请输入文本');
                              })
                            }
                          })
                          break;
                        case 'freeze':
                          $(a[i]).find('.flex-grow-1 .ml-3 .ml-2').hover(function () {
                            wait('.tooltip-inner', function () {
                              $(this).text('如果指针落在这个选项上，你的锁将被冻结 (即暂停时间)，你必须再次降落在这个选项或解冻选项上才能解冻！不建议初学者使用。');
                            })
                          })
                          break;
                      }
                    }, 10)
                  })
                }
              }, 10);

            }
            _option($body);
            $($body.children()[6]).find('.mt-3 button').click(function () {
              _option($body);
            });
            break;
          case 'Configure Tasks':
            $title.text('配置-任务');
            $body.children()[0].innerText = '通过做任务来增加训练的趣味性。配置您要执行的任务，然后接收一个随机任务，或让其他用户投票决定任务。';
            extensions_mode($body);

            a = $body.find('form').children();
            a[0].innerText = '任务积分';
            a[1].innerText = '通过配置任务积分，可以为每个任务分配点数。获得更多积分，并设定解锁所需的积分数量。';

            $o = $(a[2].children[0]);
            o_children = $o.children();
            $o.empty()
            $o.append($(o_children[0]));
            $o.append("启用任务积分");
            $(o_children[1]).hover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('为每项任务分配分数，并设定一个分数目标。');
              })
            })
            $o.append($(o_children[1]));
            $o.click(function () {
              let self = this;
              setTimeout(function () {
                let a = $(self).parent().next().children();
                if (a.length > 0) {
                  a[0].innerText = '所需积分';
                  a[1].innerText = '你需要获得一定数量的积分才能解锁你的锁。';
                }
              }, 10)
            })

            b = $($body.find('form').find('hr')[0]).next().children();
            b[0].innerText = '任务';
            b[1].innerText = '配置上锁期间要执行的任务。(点击任务建议选项后请手动输入空格使中文生效)';
            if ($(b[2]).find('button')[0]) {
              $(b[2]).find('button')[0].innerHTML =
                $(b[2]).find('button')[0].innerHTML
                  .replace('Add a task', '添加任务');
              if ($(b[2]).find('button')[0].innerText == 'Configure the task list myself') {
                $(b[2]).find('button')[0].innerText = '我自己配置任务列表';
                $($(b[2]).find('button')[0]).parent().prev().text('使用者将在第一次使用扩展时配置任务列表。');
              }
            }
            if ($(b[2]).find('button')[1]) {
              $(b[2]).find('button')[1].innerText = '或者让使用者自行编辑任务';

              let $c = $(b[2]).parent();
              $c.on('click', 'button:nth-child(2)', function () {
                setTimeout(() => {
                  $c.find('div div div.mb-2').text('使用者将在第一次使用扩展时配置任务列表。');
                  $c.find('div div div button').text('我自己配置任务列表');
                }, 10)
              })
              $c.on('click', 'button:nth-child(1)', function () {
                setTimeout(() => {
                  $c.find('button')[0].innerHTML = $c.find('button')[0].innerHTML.replace('Add a task', '添加任务');
                  $c.find('button')[1].innerText = '或者让使用者自行编辑任务';
                }, 10)
              })
            }

            $(b[2]).on('click input propertychange', '.react-autosuggest__input', function (e) {
              _input(e.target);
            })
            $(b[2]).on('blur', '.react-autosuggest__input', function (e) {
              $(e.target).find('~div .trans').remove();
            })
            $(b[2]).on('mousedown', '.react-autosuggest__input ~ div', function (e) {
              e.preventDefault();
            })
            $(b[2]).on('mousewheel', 'input.form-control', function (e) {
              setTimeout(function () {
                e.preventDefault();
              }, 10)
            })

            $a = $($body.find('form').find('hr')[1]).next();
            $a.text('Assign and edit votes - 任务获取、任务修改选项');
            $a.next().text('是否允许修改任务及任务获取方式');

            b = $($a.next().find('~ .mb-3 .CheckboxGroupItem'));
            for (let i = 0; i < b.length; i++) {
              let $o = $(b[i]);
              let o_children = $o.children();
              let o_text = $o.text().trim();

              let tooltip;
              switch (o_text) {
                case 'Allow editing tasks while you are locked':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许上锁时编辑任务');
                  $o.append($(o_children[1]));
                  tooltip = '您将能够创建、编辑和删除任务。';
                  break;
                case 'Allow wearers to edit tasks while they are locked':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许使用者上锁时编辑任务');
                  $o.append($(o_children[1]));
                  tooltip = '使用者将能够创建、编辑和删除任务。';
                  break;
                case 'Allow you to assign a task randomly or by creating a vote':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许您随机分配任务或创建一个公开投票选择任务');
                  $o.append($(o_children[1]));
                  tooltip = '如果未选中该选项，则只有您的密钥持有者才能为您分配任务。';
                  $o.click(function () {
                    let self = this;
                    setTimeout(function () {
                      if ($(self).next().length > 0) {
                        $(self).next()[0].innerHTML = $(self).next()[0].innerHTML
                          .replace('By disabling this option, you will need to have a keyholder to receive tasks.', '禁用此选项后，您将需要一个keyholder来接收任务。');
                      }
                      let $o1 = $($(self).parent().next().children()[0]);
                      if ($o1.text().trim() == 'Allow you to choose your own task from the list') {
                        let o1_children = $o1.children();
                        $o1.empty();
                        $o1.append($(o1_children[0]));
                        $o1.append('允许您从任务列表中自行选择任务');
                        $o1.append($(o1_children[1]));
                        $(o1_children[1]).hover(function () {
                          wait('.tooltip-inner', function () {
                            $(this).text('您将能够自行选择任务。');
                          })
                        })
                      }
                    }, 10)
                  })
                  break;
                case 'Allow wearers to assign tasks to themselves':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许使用者随机分配任务或创建一个公开投票选择任务');
                  $o.append($(o_children[1]));
                  tooltip = '如果未选中该选项，只有您能够给使用者分配任务。';
                  $o.click(function () {
                    let self = this;
                    setTimeout(function () {
                      let $o1 = $($(self).parent().next().children()[0]);
                      if ($o1.text().trim() == 'Allow wearers to choose their own task from the list') {
                        let o1_children = $o1.children();
                        $o1.empty();
                        $o1.append($(o1_children[0]));
                        $o1.append('允许您从任务列表中自行选择任务');
                        $o1.append($(o1_children[1]));
                        $(o1_children[1]).hover(function () {
                          wait('.tooltip-inner', function () {
                            $(this).text('您将能够自行选择任务。');
                          })
                        })
                      }
                    }, 10)
                  })
                  break;
                case 'Allow you to choose your own task from the list':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许您从任务列表中自行选择任务');
                  $o.append($(o_children[1]));
                  tooltip = '您将能够自行选择任务。';
                  break;
                case 'Allow wearers to choose their own task from the list':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('允许使用者从任务列表中自行选择任务');
                  $o.append($(o_children[1]));
                  tooltip = '使用者能够自行选择任务。';
                  break;
                case 'Give a penalty when a task is abandoned':
                  $o.empty();
                  $o.append($(o_children[0]));
                  $o.append('放弃任务时给予惩罚');
                  $o.append($(o_children[1]));
                  tooltip = '如果你放弃任务，你将受到惩罚。';

                  if ($o.parent().next().length > 0) {
                    _penalty_box($o.parent().next());
                  }

                  $o.click(function () {
                    setTimeout(function () {
                      _penalty_box($o.parent().next());
                    }, 10)
                  });

                  break;
              }
              $(o_children[1]).hover(function () {
                wait('.tooltip-inner', function () {
                  $(this).text(tooltip);
                })
              })
            }
            break;
          case 'Configure tasks':
            $title.text('配置 任务列表');
            a = $body.children()[0].children[0].children;
            a[0].innerText = '任务';
            a[1].innerText = '配置上锁期间要执行的任务。';
            $(a[2]).on('click input propertychange', '.react-autosuggest__input', function (e) {
              _input(e.target);
            })
            $(a[2]).on('blur', '.react-autosuggest__input', function (e) {
              $(e.target).find('~div .trans').remove();
            })
            $(a[2]).on('mousedown', '.react-autosuggest__input ~ div', function (e) {
              e.preventDefault();
            })
            break;
          case 'Configure Penalties':
            $title.text('配置-惩罚');
            $body.children()[0].innerText = '如果您不按时执行操作，将受到惩罚。';

            wait('.modal-body .form-group .select', function () {
              let $form = $(this).parent();
              $form.children()[0].innerText = '添加新的惩罚行为';
              $form.children()[1].children[1].innerText = '首先启用扩展以选择惩罚。';

              function _options() {
                let options = $($form.children()[1].children[0]).find('option');
                for (let i = 0; i < options.length; i++) {
                  let $option = $(options[i]);
                  let v = String($option.text()).trim();
                  switch (v) {
                    case 'Select a punishable action...':
                      $option.text('选择一个惩罚行为');
                      break;
                    case 'Roll the dice':
                      $option.text('掷骰子-未达次数惩罚');
                      break;
                    case 'Roll the dice ✓':
                      $option.text('掷骰子-未达次数惩罚 ✓');
                      break;
                    case 'Turn the Wheel of Fortune':
                      $option.text('幸运转盘-未达次数惩罚');
                      break;
                    case 'Turn the Wheel of Fortune ✓':
                      $option.text('幸运转盘-未达次数惩罚 ✓');
                      break;
                    case 'Do the tasks':
                      $option.text('任务-未达次数惩罚');
                      break;
                    case 'Do the tasks ✓':
                      $option.text('任务-未达次数惩罚 ✓');
                      break;
                    case 'Delay to do a task':
                      $option.text('任务-超时惩罚');
                      break;
                    case 'Delay to do a task ✓':
                      $option.text('任务-超时惩罚 ✓');
                      break;
                    case 'Open temporarily your lock':
                      $option.text('日常清洁-未达次数惩罚');
                      break;
                    case 'Open temporarily your lock ✓':
                      $option.text('日常清洁-未达次数惩罚 ✓');
                      break;
                    case 'Maximum opening time':
                      $option.text('日常清洁-超时惩罚');
                      break;
                    case 'Maximum opening time ✓':
                      $option.text('日常清洁-超时惩罚 ✓');
                      break;
                    case 'Verify your session':
                      $option.text('验证锁照-未达次数惩罚');
                      break;
                    case 'Verify your session ✓':
                      $option.text('验证锁照-未达次数惩罚 ✓');
                      break;
                  }
                }
              }
              $body.on('click', '.card-content .btn-danger', function () {
                setTimeout(() => {
                  _options();
                }, 10)
              })

              function _content() {
                wait('.modal-body .card-content', function () {
                  _options()
                  for (let i = 0; i < $(this).length; i++) {
                    let $card = $($(this)[i]);
                    let title = $card.find('h6').text();

                    $card.on('mousewheel', 'input.form-control', function (e) {
                      setTimeout(function () {
                        e.preventDefault();
                      }, 10)
                    })
                    function _times_options(options) {
                      for (let j = 0; j < options.length; j++) {
                        let $option = $(options[j]);
                        let v = String($option.text()).trim();
                        switch (v) {
                          case 'Daily':
                            $option.text('每天');
                            break;
                          case 'Every 2 days':
                            $option.text('每两天');
                            break;
                          case 'Weekly':
                            $option.text('每周');
                            break;
                          case 'Monthly':
                            $option.text('每月');
                            break;
                        }
                      }
                    }
                    let options;
                    switch (title) {
                      case 'Roll the dice':
                        $card.find('h6').text('掷骰子-未达次数惩罚');
                        $card.find('.caption')[0].innerText = '所需掷骰子次数';
                        $card.find('hr ~ .caption')[0].innerText = '次数未及时达标惩罚';

                        options = $($card.children()[1]).find('select option');
                        _times_options(options);
                        break;
                      case 'Turn the Wheel of Fortune':
                        $card.find('h6').text('幸运转盘-未达次数惩罚');
                        $card.find('.caption')[0].innerText = '所需转转盘次数';
                        $card.find('hr ~ .caption')[0].innerText = '次数未及时达标惩罚';

                        options = $($card.children()[1]).find('select option');
                        _times_options(options);
                        break;
                      case 'Do the tasks':
                        $card.find('h6').text('任务-未达次数惩罚');
                        $card.find('.caption')[0].innerText = '所需完成任务数';
                        $card.find('hr ~ .caption')[0].innerText = '数量未及时达标惩罚';

                        options = $($card.children()[1]).find('select option');
                        _times_options(options);
                        break;
                      case 'Delay to do a task':
                        $card.find('h6').text('任务-超时惩罚');
                        $card.find('.caption')[0].innerText = '每个任务限时时间';
                        $card.find('hr ~ .caption')[0].innerText = '超时惩罚';
                        break;
                      case 'Open temporarily your lock':
                        $card.find('h6').text('日常清洁-未达次数惩罚');
                        $card.find('.caption')[0].innerText = '所需次数';
                        $card.find('hr ~ .caption')[0].innerText = '次数未及时达标惩罚';

                        options = $($card.children()[1]).find('select option');
                        _times_options(options);
                        break;
                      case 'Maximum opening time':
                        $card.find('h6').text('日常清洁-超时惩罚');
                        $card.find('.caption')[0].innerText = '每次清洁最长解锁时间';
                        $card.find('hr ~ .caption')[0].innerText = '超时惩罚';
                        break;
                      case 'Verify your session':
                        $card.find('h6').text('验证锁照-未达次数惩罚');
                        $card.find('.caption')[0].innerText = '所需验证次数';
                        $card.find('hr ~ .caption')[0].innerText = '次数未及时达标惩罚';

                        options = $($card.children()[1]).find('select option');
                        _times_options(options);
                        break;
                    }

                    let a = $card.children()[4];
                    _penalty_option(a);
                    $(a).on('change', 'select', function () {
                      setTimeout(() => {
                        _penalty_option(a);
                      }, 10);
                    })
                    $(a).on('click', '.actions span:nth-child(1)', function () {
                      setTimeout(() => {
                        _penalty_option(a);
                      }, 10);
                    })
                    $(a).on('mouseover', '.ml-3 .text-warning', function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('确保你有办法解冻自己（keyholder、其他扩展插件等），否则你将面临无限期冻结的风险！');
                      })
                    })
                  }
                })
              }
              _options()
              _content();
              $form.find('select').change(function () {
                _content()
              })
            })
            break;
          case 'Configure Verification picture':
            $title.text('配置-验证锁照');
            $body.children()[0].innerText = '定期为您的锁拍照，以证明您已上锁。';
            extensions_mode($body, [
              {
                'text': '非累积的',
                'tooltip': '在每次操作之后，您必须等待一定的时间才能重用扩展。',
                'caption': '使用扩展后，您必须等待此时间才能再次使用它。',
              },
              {
                'text': '无限制的',
                'tooltip': '您可以随意多次使用扩展插件。',
              }
            ]);

            a = $body.find('hr ~ div')[1].children;
            a[0].innerText = '验证锁照的可视性';
            a[1].innerText = '指明谁可以看到你的锁照。';
            b = a[2].children;
            for (let i = 0; i < b.length; i++) {
              let $option = $(b[i]);
              let v = $option.val();
              switch (v) {
                case 'all':
                  $option.text('每个人都可以看到我的锁照');
                  break;
                case 'keyholder':
                  $option.text('只有我和我的keyholder才能看到锁照');
                  break;
              }
            }

            a = $body.find('hr ~ div')[2].children;
            $o = $(a[0].children[0]);
            o_children = $o.children();
            $o.empty()
            $o.append($(o_children[0]));
            $o.append("启用验证惩罚")
            $o.append($(o_children[1]));
            $(o_children[1]).mouseover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('其他用户必须多数验证通过您的锁照，否则您将会受到处罚。')
              })
            })
            if ($o.parent().next().length > 0) {
              _penalty_box($o.parent().next());
            }

            $o.click(function () {
              setTimeout(function () {
                $o.parent().next().find('caption').innerText = '验证被多数拒绝时的惩罚';
                _penalty_box($o.parent().next());
              }, 10)
            });
            break;
          case 'Configure Random Events':
            $title.text('配置-随机事件');
            $body.children()[0].innerText = '随机事件可能发生并更改您的计时器。时间增加或减少，冻结锁定，许多事情都可能发生。你不知道什么时候会发生，这会是一个惊喜。';

            a = $body.children()[3].children;
            a[0].innerText = '事件难度';
            a[1].innerHTML = '您可以在这里找到有关此扩展如何工作的更多信息 → <a href="https://docs.chaster.app/extensions/random-events/" target="_blank" rel="noopener noreferrer">文档 <i class="far fa-external-link-alt"></i></a>.';

            let buttons = $($body.children()[3]).find('button');
            for (let i = 0; i < buttons.length; i++) {
              let $button = $(buttons[i]);
              let $button_title = $button.find('.action-title');
              let $button_description = $button.find('.action-description');
              let v = String($button_title.text()).trim();
              switch (v) {
                case 'Easy':
                  $button_title.text('简单');
                  $button_description.text('给新手准备，事件频繁，但对锁时间的影响很小(little impact)。');
                  break;
                case 'Normal':
                  $button_title.text('普通');
                  $button_description.text('更多事件，对锁时间的有一些影响(some impact)。');
                  break;
                case 'Hard':
                  $button_title.text('困难');
                  $button_description.text('更长的事件，您的锁可能会比预期的时间长得多。');
                  break;
                case 'Expert':
                  $button_title.text('专家');
                  $button_description.text('你喜欢冒险！给那些不会因惧怕而放弃的人。');
                  break;
              }
            }
            break;
          case 'Configure Guess the Timer':
            $title.text('配置-时间竞猜');
            $body.children()[0].innerText = '正确猜测计时器，否则添加时间。计时器将会被隐藏，当你认为计时器结束时按下解锁按钮。如果计时器仍在运行，则会添加随机时间！';

            a = $body.children()[3].children;
            a[0].innerText = '增加的随机时间';
            a[1].innerText = '如果您试图在计时器结束前解锁，将会增加随机时间。';
            b = a[2].children[0].children;
            b[0].children[0].innerText = '最小时间';
            b[0].children[1].innerText = '增加的时间将会大于这个时间';
            b[1].children[0].innerText = '最大时间';
            b[1].children[1].innerText = '增加的时间不会超过此时间';
            break;
        }

        switch (title_text) {
          case 'Configure Share links':
          case 'Configure Pillory':
          case 'Configure Hygiene opening':
          case 'Configure Dice':
          case 'Configure Wheel of Fortune':
          case 'Configure Tasks':
          case 'Configure Penalties':
          case 'Configure Verification picture':
          case 'Configure Random Events':
          case 'Configure Guess the Timer':
            btns = $footer.find('button');
            $(btns[0]).text('取消');
            btns[1].children[0].innerText = '保存';
            break;
        }

      } catch (e) {
        console.warn(e)
      }

    })
  }

  function panel() {
    wait('.panel .panel-content', function () {
      let $title = $(this).find('.panel-content-title .text-lg');
      let title = String($title.text()).trim();
      switch (title) {
        case 'View a lock':
          $title.text('查看锁');
          $(this).wait('.panel-content-children > div:nth-child(3) > div', function () {
            let a = $(this).children();
            for (let i = 0; i < a.length; i++) {
              let $group = $(a[i]);
              let $group_title = $($group.children()[0]);
              let $group_content = $group_title.find('~ div');
              let group_title = $group_title.text();
              let b;
              switch (group_title) {
                case 'Actions':
                  $group_title.text('操作');
                  b = $group_content.children();
                  for (let j = 0; j < b.length; j++) {
                    let $item = $(b[j]);
                    let item_title = b[j].children[1];
                    let v = item_title.innerText.trim();
                    switch (v) {
                      case 'Add or remove time':
                        item_title.innerText = '增加或减少时间';
                        $item.click(dialog);
                        break;
                      case 'Freeze the lock':
                        item_title.innerText = '冻结锁';
                        break;
                      case 'Unfreeze the lock':
                        item_title.innerText = '解冻锁';
                        break;
                      case 'Hide the timer':
                        item_title.innerText = '隐藏时间';
                        break;
                      case 'Unlock the wearer':
                        item_title.innerText = '为他解锁';
                        $item.click(dialog);
                        break;
                      case 'Lock settings':
                        item_title.innerText = '锁设置';
                        break;
                    }
                  }
                  break;
                case 'Information':
                  $group_title.text('信息');
                  b = $group_content.children();
                  for (let j = 0; j < b.length; j++) {
                    let item_title = b[j].children[1];
                    let v = item_title.innerText.trim();
                    switch (v) {
                      case 'View combination':
                        item_title.innerText = '查看密码';
                        break;
                      case 'View history':
                        item_title.innerText = '查看更改历史';
                        break;
                    }
                  }
                  break;
                case 'Community features':
                  $group_title.text('社区特征');
                  b = $group_content.children();
                  for (let j = 0; j < b.length; j++) {
                    if ($(b[j]).hasClass('card-content')) {
                      let card_title = b[j].children[1].children[0];
                      let card_caption = b[j].children[1].children[1];
                      waitIf(() => { return card_caption.innerText != '' }, function () {
                        let v = card_title.innerText.trim();
                        switch (v) {
                          case 'Share links':
                            card_title.innerText = '分享链接';
                            card_caption.innerText = '与他人分享您锁的加时投票链接';
                            break;
                          case 'Pillory':
                            card_title.innerText = '公开加时';
                            card_caption.innerText = '受到处罚时公开展示加时';
                            break;
                          case 'Hygiene opening':
                            card_title.innerText = '日常清洁';
                            card_caption.innerText = '暂时解锁用以清洁';
                            break;
                        }
                      })

                    } else {
                      b[j].children[0].children[1].innerText = '修改社区属性';
                    }

                  }
                  break;
                case 'Extensions':
                  $group_title.text('扩展');
                  $group_content.find('.text-center a span').text('修改拓展');
                  $group_content.wait('.card-content', function () {
                    for (let j = 0; j < $(this).length; j++) {
                      let card_title = $(this)[j].children[1].children[0];
                      let card_caption = $(this)[j].children[1].children[1];
                      waitIf(() => { return card_caption.innerText != '' }, function () {
                        let v = card_title.innerText.trim();
                        switch (v) {
                          case 'Dice':
                            card_title.innerText = '骰子';
                            card_caption.innerText = '掷骰子尝试减少锁定时间';
                            break;
                          case 'Wheel of Fortune':
                            card_title.innerText = '幸运转盘';
                            card_caption.innerText = '转动幸运转盘试试你的运气';
                            break;
                          case 'Tasks':
                            card_title.innerText = '任务';
                            card_caption.innerText = '完成任务获得用来解锁的积分';
                            break;
                          case 'Penalties':
                            card_title.innerText = '惩罚';
                            card_caption.innerText = '如果您不按时执行操作，将受到惩罚';
                            break;
                          case 'Verification picture':
                            card_title.innerText = '验证锁照';
                            card_caption.innerText = '定期为您的锁拍照，以证明您已上锁';
                            break;
                          case 'Random Events':
                            card_title.innerText = '随机事件';
                            card_caption.innerText = '为你的锁带来随机性';
                            break;
                          case 'Guess the Timer':
                            card_title.innerText = '时间竞猜';
                            card_caption.innerText = '隐藏计时器，猜测计时器何时结束';
                            break;
                        }
                      })
                    }
                  });
                  break;
              }
            }
          })
          break;
      }
    })
  }

  function toastify() {
    wait('.Toastify .Toastify__toast-body', function () {
      let v = String($(this).text()).trim();
      switch (v) {
        case 'Please verify your email in your profile settings before accessing the community.':
          $(this).text('访问社区之前，请在您的个人资料设置中验证您的电子邮件。');
          break;
      }
    })
  }

  function locks() {
    wait('.Home', function () {
      if (is_mobile()) {
        let $page_title = $('.MobileHeader div h2');
        if ($page_title.text() == 'My Locks') $page_title.text('我的锁计划');
      } else {
        $(this).find('> div > div > h3').text('我的锁计划');
      }
    })

    wait('.btn-primary', function () {
      $(this)[0].innerHTML = $(this)[0].innerHTML.replace('Create a lock', '创建新的锁计划');
      $(this).click(function () {
        dialog()
      })

      if ($(this).prev().text() == "You don't have any locks. Start a session now!") {
        $(this).prev().text('你当前还没有正在执行的锁计划。立刻创建！');
        $(this).parent().next().children().children().text('探索社区锁计划');
      }
    })

    wait('.LockCard', function () {
      try {
        $(this).css('width', 'auto');

        let a = $(this).find('.lock-card-content')[0].children;
        // console.log(a[0].children[1].children[0].children[0].innerText)
        let l = a[0].children[1].children[0].children[0];
        l.innerText = l.innerText
          .replace('Locked for', '已经锁了')
          .replace('days', '天')
          .replace('hours', '时')
          .replace('mins', '分')
          .replace('secs', '秒');
        if ($(a[1]).find('.h5').text() == 'Tasks required to unlock') {
          let $o = $(a[1]).find('.h5');
          let o_children = $o.children();
          $(o_children[0]).mouseover(function () {
            wait('.tooltip-inner', function () {
              $(this).text('某些扩展要求您在解锁锁之前完成任务。');
            })
          })
          $o.empty().append("需要完成任务才能解锁").append($(o_children[0]));
          $(a[1]).find('.h5 ~ div div')[0].innerHTML =
            $(a[1]).find('.h5 ~ div div')[0].innerHTML
              .replace('Reach your task points goal', '达到你的任务积分目标');

        }

        a[2].children[0].innerHTML = a[2].children[0].innerHTML
          .replace('Locked by', '管理者')
          .replace('Test lock', '测试锁');
      } catch (e) {
        console.warn(e)
      }
    })

    wait('.home-actions-col', function () {
      try {
        let a, b;
        if ($($(this).children()[0]).hasClass('action-list-group')) {
          b = $(this).children()[0].children;
          for (let j = 0; j < b.length; j++) {
            let $btn = $(b[j]);
            let $btn_title = $btn.find('.action-info .action-title');
            let $btn_description = $btn.find('.action-info .action-description');
            let v = String($btn_title.text()).trim();
            switch (v) {
              case 'Ready to unlock':
                $btn_title.text('已经可以解锁');
                $btn_description.text('点这里解锁或增加时间');
                $btn.click(function () {
                  dialog()
                })
                break;
            }
          }
        }

        a = $(this).find('h5');
        for (let i = 0; i < a.length; i++) {
          let title = a[i].innerText.trim();
          b = $(a[i]).next().children();

          switch (title) {
            case 'Actions':
              a[i].innerText = a[i].innerText.replace('Actions', '操作');
              for (let j = 0; j < b.length; j++) {
                let $btn = $(b[j]);
                let $btn_title = $btn.find('.action-info .action-title');
                let $btn_description = $btn.find('.action-info .action-description');
                let v = String($btn_title.text()).trim();
                switch (v) {
                  case 'Add more time':
                    $btn_title.text('添加时间');
                    $btn_description.text('给你的锁增加时间');
                    $btn.click(dialog);
                    break;
                  case 'Tasks to be completed':
                    $btn_title.text('待完成的任务');
                    $btn_description.text('完成你的任务以防止受到惩罚');
                    break;
                  case 'Submit a verification picture':
                    $btn_title.text('提交验证锁照');
                    $btn_description.text('你必须验证你是否上锁');
                    break;
                  case 'View the combination':
                    $btn_title.text('查看密码');
                    $btn_description.text('查看你锁盒的密码');
                    break;
                  case 'Archive lock':
                    $btn_title.text('归档锁');
                    $btn_description.text('从主页移除该锁');
                    $btn.click(dialog);
                    break;
                  case 'Complete your task':
                    $btn_title.text('完成你的任务');
                    $btn_description.text('你接取了一个任务');
                    break;
                }
              }
              break;
            case 'Extensions':
              a[i].innerText = a[i].innerText.replace('Extensions', '扩展');
              for (let j = 0; j < b.length; j++) {
                let t1 = b[j].children[1].children[0],
                  t2 = b[j].children[1].children[1];

                switch (t1.innerText) {
                  case 'Share links':
                    t1.innerText = '分享链接';
                    t2.innerText = '给他人发送加/减时投票链接';
                    break;
                  case 'Pillory':
                    t1.innerText = '公示加时';
                    t2.innerText = '受到处罚时公开展示加时';
                    break;
                  case 'Hygiene opening':
                    t1.innerText = '日常清洁';
                    t2.innerText = '暂时解锁用以清洁';
                    break;
                  case 'Dice':
                    t1.innerText = '骰子';
                    t2.innerText = '掷骰子尝试减少锁定时间';
                    break;
                  case 'Wheel of Fortune':
                    t1.innerText = '幸运转盘';
                    t2.innerText = '转动幸运转盘试试你的运气';
                    break;
                  case 'Tasks':
                    t1.innerText = '任务';
                    t2.innerText = '完成任务获得用来解锁的积分';
                    break;
                  case 'Penalties':
                    t1.innerText = '惩罚';
                    t2.innerText = '如果您不按时执行操作，将受到惩罚';
                    break;
                  case 'Verification picture':
                    t1.innerText = '验证锁照';
                    t2.innerText = '定期为您的锁拍照，以证明您已上锁';
                    break;
                  case 'Random Events':
                    t1.innerText = '随机事件';
                    t2.innerText = '为你的锁带来随机性';
                    break;
                  case 'Guess the Timer':
                    t1.innerText = '时间竞猜';
                    t2.innerText = '隐藏计时器，猜测计时器何时结束';
                    break;
                }
              }
              break;
            case 'Lock':
              a[i].innerText = a[i].innerText.replace('Lock', '锁管理');
              for (let j = 0; j < b.length; j++) {
                let t1 = b[j].children[1].children[0],
                  t2 = b[j].children[1].children[1];
                switch (t1.innerText) {
                  case 'Lock history':
                    t1.innerText = '修改历史';
                    t2.innerText = '查看锁修改历史';
                    break;
                  case 'Verifications':
                    t1.innerText = '核查锁照';
                    t2.innerText = '检查他人的任务和锁照';
                    break;
                  case 'Extensions':
                    t1.innerText = '拓展';
                    t2.innerText = '查看扩展信息';
                    break;
                  case 'Settings':
                    t1.innerText = '设置';
                    t2.innerText = '修改锁设置';
                    break;
                }
              }
              break;
          }
        }

      } catch (e) {
        console.warn(e)
      }

    })

    wait('.Home .mb-4 .caption', function () {
      $(this).text('查看已归档的锁');
    })
  }

  function combinationContent() {
    setTimeout(() => {
      let c = $('.lock-type-selector').next()[0].children;
      let t = c[0].innerText;
      if (t == 'Upload your combination picture') {
        c[0].innerText = '上传您的密码照片';
        c[1].innerText = '上传你的密码照片，一旦锁计划结束，你就可以再次看到它';
        $(c[2]).find('.FileDropzone .dropzone-content div .mt-2').text('拖入图片或单击上传');
      } else if (t == 'Generate a combination') {
        c[0].innerText = '生成密码';
        c[1].innerText = '生成一个密码用以设置在您的锁盒上';
        let d = c[2].children[0].children;
        d[0].innerText = '密码的位数';
        d[4].innerText = '以下是要在您的锁盒上设置的生成代码。';
        d[6].children[0].innerHTML = d[6].children[0].innerHTML.replace('Generate', '生成');
        d[6].children[1].innerHTML = d[6].children[1].innerHTML.replace('Hide', '隐藏');
      }
    }, 100)
  }
  function _FE() {
    try {
      let a = $(this)[0].children;
      // Features
      a[1].innerHTML = a[1].innerHTML.replace('Community features', '社区特征');
      let b = a[2].children[0].children;
      for (let i = 0; i < b.length; i++) {
        let $t = $(b[i].children[0].children[0].children[1].children[0].children[0]),
          $ml = $($t.children()[0]),
          $caption = $(b[i].children[0].children[1]),
          tooltip = '',
          title = $t[0].innerText.trim();
        switch (title) {
          case 'Share links':
            $t.text('分享链接');
            $t.append($ml);
            $caption.text('与他人分享您锁的加时投票链接');
            tooltip = '与其他人分享投票链接，要求他们给您的锁增加或减少时间。';
            break;
          case 'Pillory':
            $t.text('公示加时');
            $t.append($ml);
            $caption.text('受到处罚时公开展示加时');
            tooltip = '当您受到处罚时，将会在指定的时间段内公开显示。其他用户将能够为您的锁增加时间。';
            break;
          case 'Hygiene opening':
            $t.text('日常清洁');
            $t.append($ml);
            $caption.text('暂时解锁用以清洁');
            tooltip = '因为卫生很重要，所以定期解锁自己来清洁你的贞操设备。要小心，如果你解锁超过了允许的时间，你将受到处罚。';
            break;
        }
        $ml.hover(function () {
          wait('.tooltip-inner', function () {
            $(this).text(tooltip);
          })
        });

        $(b[i]).on('click', '.mt-2 button', dialog);
        if ($(b[i]).find('.mt-2').length > 0) {
          $(b[i]).find('.mt-2 button span').text('配置');
        }
        $(b[i]).find('label span').click(function () {
          $(b[i]).wait('.mt-2', function () {
            this.find('button span').text('配置');
          })
        })
      }

      let $ml = $(a[3]).find('.TooltipIconBadge').parent().parent();
      $ml.hover(function () {
        wait('.tooltip-inner', function () {
          $(this).text('成为Plus会员可无限添加扩展。');
        })
      });

      // Extensions
      $(a[3]).find('.caption')[0].innerText = $(a[3]).find('.caption')[0].innerText
        .replace('Infinite customizations', '无限定制');
      b = a[4].children[0].children;
      for (let i = 0; i < b.length; i++) {
        let $t = $(b[i].children[0].children[0].children[1].children[0].children[0]),
          $ml = $($t.children()[0]),
          $caption = $(b[i].children[0].children[1]),
          tooltip = '',
          title = $t[0].innerText.trim();
        switch (title) {
          case 'Dice':
            $t.text('骰子');
            $t.append($ml);
            $caption.text('掷骰子尝试减少锁定时间');
            tooltip = '每一次你和机器人都会掷骰子。如果你掷的比机器人多，时间就会减少。如果机器人掷得更多，时间就会增加。';
            break;
          case 'Wheel of Fortune':
            $t.text('幸运转盘');
            $t.append($ml);
            $caption.text('转动幸运转盘试试你的运气');
            tooltip = '转动幸运转盘，更改锁的持续时间。为幸运转盘的每个格子配置操作：增加或减少时间、冻结锁或自定义文本。';
            break;
          case 'Tasks':
            $t.text('任务');
            $t.append($ml);
            $caption.text('完成任务获得用来解锁的积分');
            tooltip = '通过做任务来增加训练的趣味性。配置您要执行的任务，然后接收一个随机任务，或让其他用户投票决定任务。';
            break;
          case 'Penalties':
            $t.text('惩罚');
            $t.append($ml);
            $caption.text('如果您不按时执行操作，将受到惩罚');
            tooltip = '如果您不按时执行操作，将受到惩罚。';
            break;
          case 'Verification picture':
            $t.text('验证锁照');
            $t.append($ml);
            $caption.text('定期为您的锁拍照，以证明您已上锁');
            tooltip = '定期为您的锁拍照，以证明您已上锁。';
            break;
          case 'Random Events':
            $t.text('随机事件');
            $t.append($ml);
            $caption.text('为你的锁带来随机性');
            tooltip = '随机事件可能发生并更改您的计时器。时间增加或减少，冻结锁定，许多事情都可能发生。你不知道什么时候会发生，这会是一个惊喜。';
            break;
          case 'Guess the Timer':
            $t.text('时间竞猜');
            $t.append($ml);
            $caption.text('隐藏计时器，猜测计时器何时结束');
            tooltip = '正确猜测计时器，否则添加时间。计时器将会被隐藏，当你认为计时器结束时按下解锁按钮。如果计时器仍在运行，则会添加随机时间！';
            break;
        }
        $ml.hover(function () {
          wait('.tooltip-inner', function () {
            $(this).text(tooltip);
          })
        });

        $(b[i]).on('click', '.mt-2 button', dialog);
        if ($(b[i]).find('.mt-2').length > 0) {
          $(b[i]).find('.mt-2 button span').text('配置');
        }
        $(b[i]).find('label span').click(function () {
          $(b[i]).wait('.mt-2', function () {
            this.find('button span').text('配置');
          })
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }
  function _new_lock(self) {
    try {
      var a = $(self)[0].children;
      switch (a[0].innerText.trim()) {
        case 'Create a new lock':
          a[0].innerText = '创建新的锁计划';
          a[1].innerHTML = '您正在给自己创建锁。<br>想给别人创建锁计划？<a href="/shared-locks/new">创建一个共享锁计划</a>';
          break;
        case 'Create a shared lock':
          a[0].innerText = '创建共享锁计划';
          a[1].innerHTML = '<div class="caption mb-4">您正在创建一个可以与其他人共享的锁计划。<br>想为自己创建一个锁计划吗？ <a href="/locks/new">创建锁计划</a></div>';
          break;
      }

      if (a[0].children[0] && a[0].children[0].innerText == 'Edit a shared lock') {
        a[0].children[0].innerText = '编辑共享锁计划';
        a[0].children[1].children[0].innerText = '操作';
        $(a[0].children[1].children[0]).click(function () {
          $(this).wait('~ .dropdown-menu', function () {
            let a = $(this).children();
            a[0].innerText = '预览';
            let $o = $(a[1]);
            let o_children = $o.children();
            $o.text('以此为模版创建锁计划');
            $o.append($(o_children[0]));
          })
        })

        a[1].children[0].innerText = '复制并分享此链接以邀请其他用户加入您的共享锁计划。';
      }

      let $btn_submit_span = $(self).find('button:submit span');
      $btn_submit_span.text($btn_submit_span.text().replace('Create the lock', '创建锁计划'));
      $(self).wait('form', function () {
        if ($(this).parents('.EditSharedLock').length > 0) {
          a = $(self).find('h4');
          if (a[0] && a[0].innerText.trim() == 'General') {
            a[0].innerHTML = a[0].innerHTML.replace('General', '信息');
            $(a[0]).next().text('描述你的共享锁');
            let $section = $(a[0]).next().next();
            let b = $section.children();
            for (let i = 0; i < b.length; i++) {
              let item = b[i];
              let subtitle = item.children[0].innerText.trim();
              switch (subtitle) {
                case 'Lock name':
                  item.children[0].innerText = '锁计划名';
                  break;
                case 'Lock description':
                  item.children[0].innerText = '锁计划介绍';
                  break;
                case 'Lock photo':
                  item.children[0].innerText = '锁计划图片';
                  break;
              }
            }
          }
        }

        a = $(this).find('h4');
        for (let i = 0; i < a.length; i++) {
          let title = a[i].innerText.trim();
          let $description = $(a[i]).next();
          let $section = $description.next();
          let c;
          switch (title) {
            case 'Initial duration':
              a[i].innerHTML = a[i].innerHTML.replace('Initial duration', '初始时间');
              $description.text('将在最小时间和最大时间之间选择一个随机时间。');
              $section.find('.MinMaxDurationSelector h5')[0].innerText = '最小时间';
              $section.find('.MinMaxDurationSelector h5')[1].innerText = '最大时间';
              $section.find('.MinMaxDurationSelector .caption')[0].innerText = '最短时间';
              $section.find('.MinMaxDurationSelector .caption')[1].innerText = '初始时间不会超过此时间';
              break;
            case 'Options':
              a[i].innerHTML = a[i].innerHTML.replace('Options', '选项');
              $description.text('配置您的锁');
              c = $section.children();
              for (let j = 0; j < c.length; j++) {
                let t0 = c[j].children[0].children[1].children[0],
                  t1 = c[j].children[0].children[1].children[1];
                let $ml;
                let v = t0.innerText.trim();
                switch (v) {
                  case 'Display remaining time':
                    t0.innerText = '显示剩余时间';
                    t1.innerText = '将显示剩余时间。';
                    break;
                  case 'Display time information from history':
                    t0.innerText = '显示时间更改历史信息';
                    t1.innerText = '时间更改将显示在锁历史记录中。';
                    break;
                  case 'Limit lock time':
                    t0.innerText = '限制锁的时间';
                    t1.innerText = '锁定不能超过下面设置的最长时间。';

                    $(c[j].children[0]).click(function () {
                      $(this).wait('~ .checkbox-list-group-footer', function () {
                        $(this).find('.form-label').text('自定义最长时间');
                        $(this).find('.caption').text('在这段时间之后，您将能够释放自己，而不考虑扩展。');
                      })
                    })

                    break;
                  case 'Offer your session':
                    $ml = $(t0.children[0]);
                    t0.innerText = '设置keyholder';
                    t1.innerText = '请求另一个用户控制你的锁';
                    $ml.hover(function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('所选的钥匙持有者(keyholder)将能够修改锁的时间、冻结锁定或修改扩展。')
                      })
                    });
                    $(t0).append($ml);

                    $(c[j].children[0]).click(function () {
                      wait('.checkbox-list-group-item:nth-child(' + (j + 1) + ') .checkbox-list-group-footer', function () {
                        try {
                          $(this).find('.form-label').text('输入keyholder的用户名');
                          $(this).find('.caption').text('您也可以将其留空，稍后选择一个keyholder，或者向某人发送邀请链接。');
                        } catch (e) {
                          console.warn(e)
                        }

                      })
                    })
                    break;
                  case 'Test lock':
                    $ml = $(t0.children[0]);
                    t0.innerText = '测试锁';
                    t1.innerText = '测试锁不计入您的统计数据。';
                    $ml.hover(function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('在不影响统计数据的情况下尝试Chaster。')
                      })
                    });
                    $(t0).append($ml);
                    break;
                  case 'Limit the number of locked users':
                    t0.innerText = '限制上锁的人数';
                    t1.innerText = '限制同时锁定的用户数。';
                    break;
                  case 'This is a findom lockPlus':
                    let $o = $(t0);
                    let o_children = $o.children();
                    t0.innerText = '付费锁计划';
                    t1.innerText = '如果你使用该锁计划需要费用，你必须选择这个选项。';
                    $(t0).append($(o_children[0]));
                    $(t0).append($(o_children[1]));
                    $(o_children[0]).hover(function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('让佩戴者知道你的锁计划要求支付费用。');
                      })
                    });
                    $(o_children[1]).hover(function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('你必须订阅Chaster Plus才能获取付费贞操计划的收入');
                      })
                    });
                    break;
                }
              }
              break;
            case 'Security':
              a[i].innerHTML = a[i].innerHTML.replace('Security', '安全性');
              $description.text('保护您的锁计划');
              c = $section.children();
              for (let j = 0; j < c.length; j++) {
                let $item = $(c[j]);
                let $subtitle = $item.find('.checkbox-label-title');
                let $caption = $item.find('.checkbox-label-title ~ .caption');
                let v = $subtitle[0].innerText.trim();
                switch (v) {
                  case 'Hide this lock from your public profile':
                    $subtitle.text('在您的个人介绍中隐藏此锁');
                    $caption.text('共享锁不会出现在您的个人资料或 “探索” 界面。');
                    break;
                  case 'The user must contact me before loading the lock':
                    $subtitle.text('用户必须在加入该锁计划之前与我联系');
                    $caption.text('这纯粹是指示性的，并要求用户在加入锁计划之前与您联系。');
                    break;
                  case 'Set a password':
                    $subtitle.text('设置一个密码');
                    $caption.text('用户必须使用密码才能加入锁计划。');

                    if (c[j].children[1]) {
                      $(c[j].children[1]).find('.form-label').text('密码');
                    }
                    $(c[j].children[0]).click(function () {
                      $(this).wait('~ .checkbox-list-group-footer', function () {
                        $(this).find('.form-label').text('密码');
                      })
                    })
                    break;
                }
              }
              break;
            case 'Actions':
              a[i].innerHTML = a[i].innerHTML.replace('Actions', '操作');
              $description.text('编辑你的共享锁');
              c = $section.children();
              for (let j = 0; j < c.length; j++) {
                let $item = $(c[j]);
                let $subtitle = $($item.children()[0].children[0]);
                let $caption = $($item.children()[0].children[1]);
                let v = $subtitle[0].innerText.trim();
                switch (v) {
                  case 'Archive your lock':
                    $subtitle.text('归档你的锁');
                    $caption.text('你将会在归档锁界面看到它');
                    break;
                }
              }
              break;
          }
        }

        // Features and Extensions
        if ($(self).parents('.CreateLock').length > 0) {
          $(self).wait('div:nth-child(7):not(.loader-container):not(.card-content)', _FE);
        }
        if ($(self).parents('.EditSharedLock').length > 0) {
          $(self).wait('div:nth-child(10):not(.loader-container):not(.card-content)', _FE);
        }


        // Lock combination
        if ($(self).parents('.CreateLock').length > 0) {
          wait('.CombinationFormView .caption', function () {
            combinationContent()
            let c = $(this).parent()[0].children;
            c[1].innerText = '选择您的密码类型';
            c[2].children[0].children[0].children[1].children[0].innerText = '密码照片';
            c[2].children[0].children[0].children[1].children[1].innerText = '上传你的密码照片，我们会在解锁时给你看。';
            c[2].children[1].children[0].children[1].children[0].innerText = '生成密码';
            c[2].children[1].children[0].children[1].children[1].innerText = '该应用程序将生成一个密码用以设置在您的锁盒上。';

            $(c[2]).find('.list-group').click(combinationContent)
          })
        }
      })

    } catch (e) {
      console.warn(e)
    }
  }

  function locks_new() {
    wait('.CreateLock>div>div>div', function () {
      _new_lock(this);
    })
  }

  function locks_history() {
    wait('.LockSidebarView', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('锁更改历史');
      } else {
        $(this).prev().find('div h3').text('锁更改历史');
      }
    })

    wait('.LockSidebarView .card-content', function () {
      $(this).find('h4').text('历史');
      $(this).find('.caption').text('以下是您的锁更改的历史记录。');
    })
  }

  function locks_settings() {
    wait('.LockSidebarView', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('锁设置');
      } else {
        $(this).prev().find('div h3').text('锁设置');
      }

      let a = $(this)[0].children[0].children[0].children[1].children;
      for (let ai = 0; ai < a.length; ai++) {
        switch (a[ai].innerText.trim()) {
          case 'Lock settings':
            a[ai].innerText = '锁设置';
            break;
          case 'Manage your lock here.':
            a[ai].innerText = '在此处管理您的锁。';
            let b = a[ai + 1].children;
            for (let i = 0; i < b.length; i++) {
              let t0 = b[i].children[0].children[0],
                t1 = b[i].children[0].children[1];
              switch (t0.innerText.trim()) {
                case 'Maximum lock date':
                  t0.innerText = '最长锁期';
                  t1.innerText = '您的锁不能超过定义的日期。';
                  break;
                case 'Initial unlock date':
                  t0.innerHTML = t0.innerHTML.replace('Initial unlock date', '最初解锁时间');
                  break;
              }
            }
            break;
          case 'Permissions':
            a[ai].innerText = '权限';
            break;
          case 'Trust your keyholder':
            a[ai].innerText = '信任你的keyholder';
            a[ai + 1].children[0].children[0].children[0].innerText = '信任我的keyholder';
            a[ai + 1].children[0].children[0].children[1].innerText = '您的keyholder可以更改锁的设置。';
            if (a[ai + 1].children[0].children[1].children[0].children[0].innerText == 'Trusted') {
              a[ai + 1].children[0].children[1].children[0].children[0].innerText = '已信任';
            }
            break;
          case 'Advanced options':
            a[ai].innerText = '高级设置';
            break;
          case 'Archive your lock':
            a[ai].innerText = '归档你的锁';
            a[ai + 1].children[0].children[0].children[0].innerText = '归档你的锁';
            a[ai + 1].children[0].children[0].children[1].innerText = '在主页中隐藏您的锁';
            a[ai + 1].children[0].children[1].children[0].innerText = '归档';
            $(a[ai + 1]).find('button').click(dialog)
            break;
        }
      }

    })
  }

  function locks_settings_keyholder() {
    wait('.LockSidebarView > div > div > div:nth-child(2) > form', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('锁设置');
      } else {
        $('.LockSidebarView').prev().find('h3.mb-0').text('锁设置');
      }

      $(this).find('button span').text('保存设置');
    })
    wait('.LockSidebarView > div > div > div:nth-child(2) > form div', function () {
      let a = $(this).children();
      for (let i = 0; i < a.length; i++) {
        let text = a[i].innerText.trim();
        switch (text) {
          case 'Lock settings':
            a[i].innerText = '锁设置';
            break;
          case 'Manage the lock':
            a[i].innerText = '管理锁';
            $(a[i + 1]).find('.checkbox-label-title').text('在历史记录中显示时间信息');
            $(a[i + 1]).find('.checkbox-label-title ~ .caption').text('时间改变将会显示在锁改变历史记录中');
            break;
        }
      }
    })
  }

  function _mode($mode) {
    let mode_icon = $($mode.children()[0]);
    let t = $mode.text();
    let tip;
    if (t.indexOf('Non cumulative') != -1) {
      t = t.replace('Non cumulative: Next action after', '不累计: 间隔');
      tip = '在每次操作之后，您必须等待一定的时间才能重用扩展。';
    } else if (t.indexOf('Cumulative') != -1) {
      t = t.replace('Cumulative: New chance every', '累计: 增加使用次数每');
      tip = '扩展的可使用次数会随时间累积。';
    } else if (t.indexOf('Unlimited actions') != -1) {
      t = t.replace('Unlimited actions', '无限制的');
      tip = '您可以随意多次使用扩展。';
    }
    $mode.parent().parent().mouseover(function () {
      wait('.tooltip-inner', function () {
        $(this).text(tip);
      })
    })
    $mode.empty().append(mode_icon).append(t);
  }

  function locks_settings_extensions() {
    wait('.LockSidebarView', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('拓展设置');
      } else {
        $(this).prev().find('div h3').text('拓展设置');
      }
    })
    wait('.LockSidebarView>div>div > div:nth-child(2) > div', function () {
      try {
        let a, b;
        a = $(this)[0].children;
        if (a.length > 0) {
          a[0].innerText = '社区特征';
          b = a[1].children;
          for (let i = 0; i < b.length; i++) {
            let $card = $(b[i]);
            let $title = $card.find('.h5');
            let $ml = $card.find('.h5 ~ .ml-2');
            let $caption = $card.find('.mb-2 ~ .caption');
            let v = String($title.text()).trim();
            let tooltip;

            switch (v) {
              case 'Share links':
                $title.text('分享链接');
                tooltip = '与其他人分享投票链接，要求他们给您的锁增加或减少时间。';

                for (let j = 0; j < $caption.children().length; j++) {
                  $caption.children()[j].innerHTML = $caption.children()[j].innerHTML
                    .replace('Add time', '加时')
                    .replace('Remove time', '减时')
                    .replace('Random option enabled', '随机选项启用');
                }

                break;
              case 'Pillory':
                $title.text('公示加时');
                tooltip = '当您受到处罚时，将会在指定的时间段内公开显示。其他用户将能够为您的锁增加时间。';

                $caption.children()[0].innerText = '每票增加 ' + $caption.children()[0].innerText.replace(' added per vote', '');
                break;
              case 'Hygiene opening':
                $title.text('日常清洁');
                tooltip = '因为卫生很重要，所以定期解锁自己来清洁你的贞操设备。要小心，如果你解锁超过了允许的时间，你将受到处罚。';

                let $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);

                $caption.children()[0].innerText = $caption.children()[0].innerText
                  .replace('Time allowed', '允许解锁时间')
                  .replace('penalty for exceeding time', '超时惩罚');
                break;
            }
            $ml.mouseover(function () {
              wait('.tooltip-inner', function () {
                $(this).text(tooltip);
              })
            });
          }
        }

        a = $(this)[1].children;
        if (a.length > 0) {
          a[0].innerText = '扩展';
          b = a[1].children;
          for (let i = 0; i < b.length; i++) {
            let $card = $(b[i]);
            let $title = $card.find('.h5');
            let $ml = $card.find('.h5 ~ .ml-2');
            let $caption = $($card.find('.mb-2 ~ .caption')[0]);
            let v = String($title.text()).trim();
            let tooltip;
            let $mode;
            let lis;
            let c;
            switch (v) {
              case 'Dice':
                $title.text('骰子');
                tooltip = '每一次你和机器人都会掷骰子。如果你掷的比机器人多，时间就会减少。如果机器人掷得更多，时间就会增加。';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);
                $caption.children()[0].innerText = $caption.children()[0].innerText.replace('Time multiplier', '时间倍数');
                break;
              case 'Wheel of Fortune':
                $title.text('幸运转盘');
                tooltip = '转动幸运转盘，更改锁的持续时间。为幸运转盘的每个格子配置操作：增加或减少时间、冻结锁或自定义文本。';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);

                lis = $caption.children()[0].children;
                for (let j = 0; j < lis.length; j++) {
                  let li = lis[j];
                  let v = li.innerText.trim();
                  switch (v) {
                    case 'Freeze / unfreeze':
                      li.innerText = '冻结 / 解冻';
                      break;
                    case 'Freeze':
                      li.innerText = '冻结';
                      break;
                    case 'Unfreeze':
                      li.innerText = '解冻';
                      break;
                  }
                  if (v.indexOf('Pillory') != -1) {
                    li.innerText = li.innerText.replace('Pillory', '公示');
                  }
                }
                break;
              case 'Tasks':
                $title.text('任务');
                tooltip = '通过做任务来增加训练的趣味性。配置您要执行的任务，然后接收一个随机任务，或让其他用户投票决定任务。';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);
                lis = $caption.children()[0].children;
                for (let j = 0; j < lis.length; j++) {
                  let $a = $(lis[j]);
                  let t = $a[0].innerText.trim();
                  switch (t) {
                    case 'Assign yourself a random task':
                      $a[0].innerHTML = $a[0].innerHTML.replace('Assign yourself a random task', '随机分配任务');
                      break;
                    case 'Choose your task':
                      $a[0].innerHTML = $a[0].innerHTML.replace('Choose your task', '自行选择任务');
                      break;
                    case 'Edit the list of tasks':
                      $a[0].innerHTML = $a[0].innerHTML.replace('Edit the list of tasks', '可编辑任务列表');
                      break;
                    case 'Tasks assigned by the keyholder':
                      $a[0].innerHTML = $a[0].innerHTML.replace('Tasks assigned by the keyholder', '任务由keyholder分配');
                      break;
                  }
                  if (t.indexOf('points required') != -1) {
                    $a[0].innerHTML = $a[0].innerHTML.replace('points required', '积分需要')
                  }
                }

                for (let k = 0; k < $caption.find('~h6').length; k++) {
                  let t = $caption.find('~h6')[k];
                  let v = t.innerText.trim();
                  switch (v) {
                    case 'List of tasks':
                      t.innerText = '任务列表';
                      break;
                    case 'Penalty for abandoning a task':
                      t.innerText = '放弃惩罚';
                      let lis = $(t).next().children()[0].children;
                      for (let j = 0; j < lis.length; j++) {
                        let li = lis[j];
                        li.innerText = li.innerText
                          .replace('Add', '加时')
                          .replace('Freeze the lock', '冻结')
                          .replace('Pillory for', '公示');
                      }
                      break;
                  }
                }
                if ($caption.next().text() == 'Configure the tasks you want to do.') {
                  $caption.next().text('自行配置你想做的任务');
                }
                break;
              case 'Penalties':
                $title.text('惩罚');
                tooltip = '如果您不按时执行操作，将受到惩罚。';

                c = $card.find('.mb-2 ~ div')[0].children;
                for (let j = 0; j < c.length; j++) {
                  let $item = $(c[j]);
                  let d = $item.find('.mb-2 .mb-2').children();
                  let title = d[0].innerText.trim();
                  switch (title) {
                    case 'Number of dice rolls required':
                      d[0].innerText = '掷骰子次数要求'; break;
                    case 'Number of times you will have to turn the wheel of fortune':
                      d[0].innerText = '转动幸运转盘次数要求'; break;
                    case 'Number of to-do tasks required':
                      d[0].innerText = '做任务数量要求'; break;
                    case 'Time required to do an action':
                      d[0].innerText = '做任务限时'; break;
                    case 'Number of temporary openings required':
                      d[0].innerText = '日常清洁次数要求'; break;
                    case 'Maximum opening time allowed':
                      d[0].innerText = '清洁解锁限时'; break;
                    case 'Number of verifications required':
                      d[0].innerText = '上传验证锁照次数要求'; break;
                  }
                  d[1].innerText = d[1].innerText
                    .replace('daily', '每天');
                  let e = $item.find('.mb-2 .mb-2').next()[0];
                  let text = e.innerText.trim();
                  switch (text) {
                    case 'Penalty for not rolling the dice in time':
                      e.innerText = '掷骰子-未达次数惩罚'; break;
                    case 'Penalty for not turning the wheel of fortune enough times':
                      e.innerText = '幸运转盘-未达次数惩罚'; break;
                    case 'Penalty for failing to complete all required tasks':
                      e.innerText = '任务-未达次数惩罚'; break;
                    case 'Penalty for not completing the task in time':
                      e.innerText = '任务-超时惩罚'; break;
                    case 'Penalty for not opening your lock the required number of times':
                      e.innerText = '日常清洁-未达次数惩罚'; break;
                    case 'Penalty for not relocking in time':
                      e.innerText = '日常清洁-超时惩罚'; break;
                    case 'Penalty for not verifying your session enough times':
                      e.innerText = '验证锁照-未达次数惩罚'; break;
                  }
                  let lis = $item.find('ul li');
                  for (let k = 0; k < lis.length; k++) {
                    let li = lis[k];
                    li.innerText = li.innerText
                      .replace('Add', '加时')
                      .replace('Freeze the lock', '冻结')
                      .replace('Pillory for', '公示');
                  }
                }
                break;
              case 'Verification picture':
                $title.text('验证锁照');
                tooltip = '定期为您的锁拍照，以证明您已上锁';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);

                c = $card.find('.mb-2 ~ div').children();
                for (let j = 0; j < c.length; j++) {
                  let $item = $(c[j]);
                  if ($item.find('span span span').text() == 'Peer verification') {
                    $item.find('span span span').text('启用验证惩罚');
                    $item.find('span span span').parent().parent().mouseover(function () {
                      wait('.tooltip-inner', function () {
                        $(this).text('您的图片将由其他成员验证。');
                      })
                    })
                  }
                  if ($item.hasClass('caption') && String($item.find('span').text()).trim() == 'Visible to everyone') {
                    $item.find('span')[0].innerHTML = $item.find('span')[0].innerHTML.replace('Visible to everyone', '对所有人可见');
                  } if ($item.hasClass('caption') && String($item.find('span').text()).trim() == 'Only visible to the keyholder') {
                    $item.find('span')[0].innerHTML = $item.find('span')[0].innerHTML.replace('Only visible to the keyholder', '仅对keyholder可见');
                  }
                  if ($item.hasClass('mt-3') && $item.text() == 'Penalty for having a rejected picture') {
                    $item.text('验证锁照被多数拒绝时的惩罚');
                  }
                  if ($item.find('ul li').length > 0) {
                    for (let k = 0; k < $item.find('ul li').length; k++) {
                      let li = $item.find('ul li')[k];
                      li.innerText = li.innerText
                        .replace('Add', '加时')
                        .replace('Freeze the lock', '冻结')
                        .replace('Pillory for', '公示');
                    }
                  }
                }
                break;
              case 'Random Events':
                $title.text('随机事件');
                tooltip = '随机事件可能发生并更改您的计时器。时间增加或减少，冻结锁定，许多事情都可能发生。你不知道什么时候会发生，这会是一个惊喜。';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);

                let text = $caption.find('p').text();
                if (text.indexOf('Easy') != -1) {
                  $caption.find('p').text('简单: 给新手准备，事件频繁，但对锁时间的影响很小(little impact)。');
                } else if (text.indexOf('Normal') != -1) {
                  $caption.find('p').text('普通: 更多事件，对锁时间的有一些影响(some impact)。');
                } else if (text.indexOf('Hard') != -1) {
                  $caption.find('p').text('困难: 更长的事件，您的锁可能会比预期的时间长得多。');
                } else if (text.indexOf('Expert') != -1) {
                  $caption.find('p').text('专家: 你喜欢冒险！给那些不会因惧怕而放弃的人。');
                }
                break;
              case 'Guess the Timer':
                $title.text('时间竞猜');
                tooltip = '正确猜测计时器，否则添加时间。计时器将会被隐藏，当你认为计时器结束时按下解锁按钮。如果计时器仍在运行，则会添加随机时间！';
                $mode = $card.find('.mb-2 .caption-dark span span');
                _mode($mode);

                $caption.find('p').text(
                  $caption.find('p').text()
                    .replace('Random time between', '随机加时')
                    .replace('and', '到')
                );
                break;
            }
            $ml.mouseover(function () {
              wait('.tooltip-inner', function () {
                $(this).text(tooltip);
              })
            });
          }
        }
      } catch (e) {
        console.warn(e)
      }

    })
  }

  function locks_settings_extensions_edit() {
    wait('.LockSidebarView', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('编辑拓展');
      } else {
        $(this).prev().find('h3.mb-0').text('编辑拓展');
      }
    })
    wait('.LockSidebarView > div > div > div:nth-child(2)', function () {
      $(this).find('button.btn span').text('保存扩展设置');
    })
    wait('.LockSidebarView > div > div > div:nth-child(2) > div:nth-child(1):not(.loader-container)', _FE)
  }

  function locks_extensions() {
    wait('.LockSidebarView', function () {
      let $title = $(this).prev().find('div h3');
      if ($title.length == 0 && is_mobile()) $title = $('.MobileHeader div h2');
      let title = String($title.text()).trim();
      let a, b;
      switch (title) {
        case 'Share links':
          $title.text('分享链接');
          wait('.LockSidebarView .LinkExtension', function () {
            a = $(this).children();
            a[0].innerText = '目标';
            a[1].innerText = '当前投票数量 / 最少投票数量';
            if (a[4].innerText == 'Share your link') {
              a[4].innerText = '分享链接';
              a[5].innerText = '复制并分享以下链接以邀请其他人给您的锁加时投票。';
            }
          })
          break;
        case 'Pillory':
          $title.text('公示');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            a[0].innerText = '公示';
            a[1].innerText = '当您受到处罚时，将会在指定的时间段内公开显示。';

            b = $(this).find('.card-content');
            for (let i = 0; i < b.length; i++) {
              let $card = $(b[i]);
              let $title = $card.children()[0];
              let $caption = $card.children()[1];
              let title = $title.innerText;
              switch (title) {
                case 'Information':
                  $title.innerText = '信息';
                  if ($caption.innerText == 'You are not currently pilloried.') {
                    $caption.innerText = '你目前没有被公示。';
                  } else if ($caption.innerText == 'Here is the information about the pillory.') {
                    $caption.innerText = '下面是你的公示信息。';
                  }
                  break;
                case 'Put in pillory':
                  $title.innerText = '信息';
                  $caption.innerText = $caption.innerText
                    .replace('You can put ', '你可以让')
                    .replace('on the pillory at any time if you wish.', '公示任意时间，只要你愿意');
                  let btn = $($card.children()[2]).find('button.btn')[0];
                  btn.innerHTML = btn.innerHTML.replace('Put in pillory', '公示');
                  $(btn).click(dialog);
                  $card.children()[3].innerText = '它将在您指定的时间内显示在 公开锁(Activity) 页面上，访问者可以给锁增加时间。';
                  break;
              }
            }

          });
          break;
        case 'Hygiene opening':
          $title.text('日常清洁');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            a[0].innerText = '日常清洁';
            a[1].innerText = '因为卫生很重要，所以定期解锁自己来清洁你的贞操设备。';
            b = a[2].children;
            b[0].innerText = b[0].innerText
              .replace('You will have', '你将会有')
              .replace('to clean yourself before closing the lock.', '去清理你的锁');
            b[1].innerText = b[1].innerText
              .replace('Be careful, if you exceed the allowed time,', '要小心，如果你解锁超过了允许的时间，你的锁时间将会增加')
              .replace('will be added to your lock.', '');
            if (a[3].children[0].innerText == 'Only your keyholder can temporarily open your lock.') {
              a[3].children[0].innerText = '只有你的keyholder能够给你打开日常清洁';
            }
          });
          break;
        case 'Dice':
          $title.text('日常清洁');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            a[0].innerText = '骰子';
            a[1].innerText = '每一次你和机器人都会掷骰子。如果你掷的比机器人多，时间就会减少。如果机器人掷得更多，时间就会增加。';
            b = $(this).find('.dices .dice-col');
            b[0].children[1].innerText = '你';
            b[1].children[1].innerText = '机器人';
            $(this).find('.mt-4 button').text('掷骰子');
            let self = this;
            $(this).find('.mt-4 button').click(function () {
              let t = $(self).find('.mt-4 .alert span')[0];
              t.innerText = t.innerText.replace('Added', '增加了').replace('Removed', '减少了');
            })
          });
          break;
        case 'Wheel of Fortune':
          $title.text('幸运转盘');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            a[0].innerText = '幸运转盘';
            a[1].innerText = '转动幸运转盘试试你的运气！';
            // $(this).find('.mb-4 button').text('转动');
          });
          break;
        case 'Tasks':
          $title.text('任务');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            if (a[0].innerText == 'Tasks') {
              a[0].innerText = '任务';
              a[1].innerText = a[1].innerText
                .replace('Receive a random task, or ask other users to vote!', '随机接取任务，或让其他用户投票！');
              b = $(a[2]).find('button');
              b.click(dialog);
              for (let i = 0; i < b.length; i++) {
                let $btn = $(b[i]);
                let v = String($btn.find('span').text()).trim();
                let text = String($btn.text()).trim();
                if (v == 'Get a random task') {
                  $btn.find('span').text('随机获取任务');
                }
                if (text == 'Let other users choose') {
                  $btn[0].innerHTML = $btn[0].innerHTML.replace('Let other users choose', '让其他用户投票决定');
                }
              }

              // points_card
              if ($(this).parent().prev().find('.card-content h5').text() == 'Points') {
                let $points_card = $(this).parent().prev().find('.card-content h5').parent();
                // $points_card.find('h5').text('积分');
                if ($points_card.find('h5 ~ .caption').text() == 'Earn more points by completing tasks.') {
                  $points_card.find('h5 ~ .caption').text('通过完成任务赚取更多积分。');
                }
              }

              a[4].innerText = '操作';
              a[5].innerText = a[5].innerText
                .replace('Receive a random task, or ask other users to vote!', '随机接取任务，或让其他用户投票！');

              let $tasks = $(a[7]);
              if ($(a[6]).hasClass('mb-3')) {
                if ($(a[6]).find('button').text() == 'Configure tasks') {
                  $(a[6]).find('button').text('修改任务');
                }
              } else {
                $tasks = $(a[6]);
              }
              $tasks.find('button').css('white-space', 'nowrap');
              $tasks.find('button span').text('接取');
              $tasks.find('button').click(dialog)
            } else if (a[0].innerText == 'Current task') {
              a[0].innerText = '当前任务';
              a[1].children[0].innerText = '你已经接取了一个任务！'
              a[3].innerText = '完成你的任务，并指示你是否完成了任务。';
              $(a[4]).find('button span')[0].innerText = '我已完成任务';
              $(a[4]).find('button span')[1].innerText = '放弃任务';
              $($(a[4]).find('button')[1]).mouseover(function () {
                wait('.tooltip-inner', function () {
                  $(this).text('如果你放弃任务，你将不会得到积分点');
                })
              })
            }

          });
          break;
        case 'Penalties':
          $title.text('惩罚');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            let a = $(this).children();
            a[0].children[0].innerText = '我的任务';
            a[0].children[1].innerText = '以下是为了避免受到惩罚而要执行的任务。';
          });
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container) .basic-grid .card-content', function () {
            try {
              for (let i = 0; i < $(this).length; i++) {
                let $card = $($(this)[i]);
                let $title = $card.find('h5');
                let $caption = $card.find('h5 ~ .caption');
                let $a = $card.find('a');
                let $time = $card.find('.mb-2:nth-child(2) span');

                let title = String($title.text()).trim();
                switch (title) {
                  case 'Dice':
                    $title.text('骰子');
                    $caption.text('掷骰子');
                    $a.text('跳转骰子页面');
                    break;
                  case 'Wheel of Fortune':
                    $title.text('幸运转盘');
                    $caption.text('转转盘');
                    $a.text('跳转幸运转盘页面');
                    break;
                  case 'Tasks':
                    $title.text('任务');
                    $caption.text('做任务');
                    $a.text('跳转任务页面');
                    break;
                  case 'Hygiene opening':
                    $title.text('日常清洗');
                    $caption.text('打开你的锁清洁');
                    $a.text('跳转日常清洗页面');
                    break;
                  case 'Verification picture':
                    $title.text('验证锁照');
                    $caption.text('上传锁照');
                    $a.text('跳转验证锁照页面');
                    break;
                }
                $time[0].innerHTML = $time[0].innerHTML.replace('remaining', '剩余');

                let $view = $card.find('.text-link');
                $view.text('查看惩罚');
                $view.click(function () {
                  wait('.popover-body > div', function () {
                    let a = $(this)[$(this).length - 1].children;
                    let t = a[0].innerText.trim();
                    switch (t) {
                      case 'Penalty for not rolling the dice in time':
                        a[0].innerText = '掷骰子-未达次数惩罚';
                        break;
                      case 'Penalty for not turning the wheel of fortune enough times':
                        a[0].innerText = '幸运转盘-未达次数惩罚';
                        break;
                      case 'Penalty for failing to complete all required tasks':
                        a[0].innerText = '任务-未达次数惩罚';
                        break;
                      case 'Penalty for not completing the task in time':
                        a[0].innerText = '任务-超时惩罚';
                        break;
                      case 'Penalty for not opening your lock the required number of times':
                        a[0].innerText = '日常清洁-未达次数惩罚';
                        break;
                      case 'Penalty for not relocking in time':
                        a[0].innerText = '日常清洁-超时惩罚';
                        break;
                      case 'Penalty for not verifying your session enough times':
                        a[0].innerText = '验证锁照-未达次数惩罚';
                        break;
                    }

                    let lis = $(this).find('ul li');
                    for (let j = 0; j < lis.length; j++) {
                      let li = lis[j];
                      li.innerText = li.innerText
                        .replace('Add', '加时')
                        .replace('Freeze the lock', '冻结')
                        .replace('Pillory for', '公示');
                    }
                  })
                })
              }
            } catch (e) {
              console.warn(e)
            }

          })
          break;
        case 'Verification picture':
          $title.text('验证锁照');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children()[0].children;
            a[0].innerText = '验证锁照';
            a[1].innerText = '定期为您的锁拍照，以证明您已上锁。';
            $(a[2]).find('button span').text('提交一个新的锁照');

            function _v($p) {
              let $o = $p.find('>.mb-4');
              let o_children = $o.children();
              $(o_children).children()[0].innerText = '验证码:';
              $o.empty().append($(o_children)).append('请把验证码写在一张纸上，然后放在你的贞操设备旁边拍张照片。这将证明你刚刚拍了这张照片。');
              $p.find('>hr ~ h4').text('上传您的验证锁照');
              $p.find('>hr ~ h4').next().text('拍下你带验证码的贞操设备的照片，然后上传到这里。');
            }
            $($(this).children()[0]).on('click', 'button', function () {
              wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container) .card-content div:nth-child(3) .mb-4', function () {
                _v($(this).parent());
              })
            })
            if ($(a[2]).find('>.mb-4').length > 0) {
              _v($(a[2]));
            }
          });
          break;
        case 'Random Events':
          $title.text('随机事件');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children()[0].children;
            a[0].innerText = '随机事件';
            a[1].innerText = '以下是发生的随机事件的历史。';
          });
          break;
        case 'Guess the Timer':
          $title.text('时间竞猜');
          wait('.LockSidebarView >div>div >div:nth-child(2) >div:not(.loader-container)', function () {
            a = $(this).children();
            a[0].innerText = '猜猜看！';
            a[1].innerText = '当你认为时间已到时按下按钮。如果没有，时间将被增加！';
          });
          break;
      }

    })
  }

  function verifications() {
    wait('.title-row', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('用户核查');
      }
      $(this)[0].children[0].children[0].innerText = '用户核查';
      $(this)[0].children[0].children[1].innerText = '检查他人的任务和锁照';
    })

    wait('.verification-row', function () {
      let a = $(this)[0].children[0].children[1].children;
      a[0].innerText = '什么需要检查？';
      a[1].innerText = '验证图片';
      a[2].children[1].children[0].innerText = '验证码';
      a[2].children[1].children[1].innerText = '图片中的验证码是否和给出的相同';
      a[3].children[1].children[0].innerText = '贞操锁';
      a[3].children[1].children[1].innerText = '贞操锁是否锁好';

      let btns = $(this)[0].children[1].children[0].children[1].children;
      btns[0].children[1].innerText = '拒绝';
      btns[1].children[1].innerText = '通过';

      let prev = $(this)[0].children[1].children[1].children[0];
      prev.innerHTML = prev.innerHTML.replace('Previous', '上一个');

      let next = $(this)[0].children[1].children[1].children[2];
      next.innerHTML = next.innerHTML.replace('Next', '下一个');
    })
  }

  function shared_locks() {
    wait('.SharedLocks', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('共享锁');
      }
      let spans = $(this).find('.TabHeader .selector-title span');
      spans[0].innerText = spans[0].innerText
        .replace('Shared locks', '共享锁');
      spans[1].innerText = spans[1].innerText
        .replace('Archived locks', '归档锁')
      $(this).find('a.btn')[0].innerHTML = $(this).find('a.btn')[0].innerHTML
        .replace('Create a shared lock', '创建共享锁计划');
    })
  }

  function shared_locks_lock() {
    wait('.EditSharedLock>div>div>div', function () {
      _new_lock(this);
    })
  }

  function shared_locks_new() {
    wait('.EditSharedLock>div>div>div', function () {
      _new_lock(this);
    })
  }

  function keyholder() {
    wait('.Keyholder>div>div', function () {
      let spans = $(this).find('.TabHeader .selector-title span');
      for (let i = 0; i < spans.length; i++) {
        let span = spans[i];
        let v = span.innerText.trim();
        switch (v) {
          case 'Locked':
            span.innerText = '上锁中';
            break;
          case 'Unlocked':
            span.innerText = '已解锁';
            break;
          case 'Deserted':
            span.innerText = '已放弃';
            break;
          case 'Archived':
            span.innerText = '已归档';
            break;
        }
      }
      if (ss[1]) {
        panel()
      }
    })
  }

  function explore() {
    wait('.Explore>div .mt-4', function () {
      if (is_mobile()) {
        $('.MobileHeader div h2').text('探索');
      }
      $(this).children()[0].innerText = '查看所有共享锁计划';
    })
    wait('.Explore>div .mb-4', function () {
      if (is_mobile()) {
        let $page_title = $('.MobileHeader div h2');
        if ($page_title.text() == 'Explore') $page_title.text('探索');
      }
      $($(this)[0]).find('.mb-2 .flex-grow-1 .explore-item-title').text('社区锁计划');
      $($(this)[0]).find('.mb-2 .flex-grow-1 .caption').text('社区用户创建的锁');

      $($(this)[1]).find('.mb-2 .flex-grow-1 .explore-item-title').text('给新手的锁计划');
      $($(this)[1]).find('.mb-2 .flex-grow-1 .caption').text('初次接触贞洁世界');
      $(this).find('a button').text('查看更多');
    })
  }

  function explore_search() {
    wait('.ExploreSearch', function () {
      let $a = $(this).prev();
      $a.find('.mr-2').text('筛选');
      let btns = $a.find('button');
      $(btns[0]).append($('<span> 初始时间 </span>'));
      $(btns[1]).append($('<span> 拓展 </span>'));
      btns[2].children[0].innerText = '是否付费';

      $(btns[0]).click(function () {
        wait('.popover-body', function () {
          let $pop = $($(this)[$(this).length - 1]);
          $pop.find('.caption').text('选择初始时间');
          $pop.find('.form-label')[0].innerText = '最小初始时间';
          $pop.find('.form-label')[1].innerText = '最大初始时间';
          $pop.next().find('button')[0].innerText = '清除';
          $pop.next().find('button')[1].innerText = '保存';
        })
      })
      $(btns[1]).click(function () {
        wait('.popover-body', function () {
          let $pop = $($(this)[$(this).length - 1]);
          let a = $pop.find('>div>div');
          for (let i = 0; i < a.length; i++) {
            let $item = $(a[i]);
            let $title = $item.find('.text-break');
            let $caption = $item.find('.caption');
            let title = $title[0].innerText.trim();
            switch (title) {
              case 'Share links':
                $title.text('分享链接');
                $caption.text('给他人分享你的加时投票链接');
                break;
              case 'Pillory':
                $title.text('公示');
                $caption.text('当受到惩罚时公开展示');
                break;
              case 'Dice':
                $title.text('骰子');
                $caption.text('掷骰子尝试减少锁定时间');
                break;
              case 'Wheel of Fortune':
                $title.text('幸运转盘');
                $caption.text('转动幸运转盘试试你的运气');
                break;
              case 'Tasks':
                $title.text('任务');
                $caption.text('完成任务获得用来解锁的积分');
                break;
              case 'Penalties':
                $title.text('惩罚');
                $caption.text('如果您不按时执行操作，将受到惩罚');
                break;
              case 'Hygiene opening':
                $title.text('日常清洁');
                $caption.text('暂时打开你的贞操锁用于清洁');
                break;
              case 'Verification picture':
                $title.text('验证锁照');
                $caption.text('定期为您的锁拍照，以证明您已上锁');
                break;
              case 'Random Events':
                $title.text('随机事件');
                $caption.text('为你的锁带来随机性');
                break;
              case 'Guess the Timer':
                $title.text('时间竞猜');
                $caption.text('隐藏计时器，猜测计时器何时结束');
                break;
            }
          }
          $pop.next().find('button')[0].innerText = '清除';
          $pop.next().find('button')[1].innerText = '保存';
          $pop.next().find('label').text('包含所有选中');
        })
      })
      $(btns[2]).click(function () {
        wait('.popover-body', function () {
          let $pop = $($(this)[$(this).length - 1]);
          $pop.find('.caption').text('筛选锁计划是否需要费用');
          $pop.find('.form-check label')[0].innerText = '显示所有';
          $pop.find('.form-check label')[1].innerText = '仅显示需要付费的';
          $pop.find('.form-check label')[2].innerText = '排除付费';
          $pop.next().find('button')[0].innerText = '清除';
          $pop.next().find('button')[1].innerText = '保存';
        })
      })

      $a = $a.prev();
      $a.find('.col-md-6').children()[0].innerText = '社区锁计划';
      $a.find('.col-md-6').children()[1].innerText = '社区用户创建的锁';
    })
  }

  function explore_lock() {
    wait('.PublicLockView > div:nth-child(2) > div', function () {
      $(this).find('button.btn').text('加入锁计划');
      $(this).find('button.btn').click(function () {
        wait('.CombinationFormView .caption', function () {
          combinationContent()
          let c = $(this).parent()[0].children;
          c[1].innerText = '选择您的密码类型';
          c[2].children[0].children[0].children[1].children[0].innerText = '密码照片';
          c[2].children[0].children[0].children[1].children[1].innerText = '上传你的密码照片，我们会在解锁时给你看。';
          c[2].children[1].children[0].children[1].children[0].innerText = '生成密码';
          c[2].children[1].children[0].children[1].children[1].innerText = '该应用程序将生成一个密码用以设置在您的锁盒上。';

          $(c[2]).find('.list-group').click(combinationContent);

          setTimeout(() => {
            let $a = $(this).parent().next().next();

            if ($a.find('.checkbox-label-title').text() == 'I confirm that I have made contact with the owner.') {
              $a.find('.checkbox-label-title').text('我保证我已联系了keyholder');
              $a.find('.checkbox-label-title ~ .caption').text('所有者要求在加入锁计划之前与其联系。');
            }
            $a = $a.next().next();
            if ($($a.children()[0]).text() == 'Lock password') {
              $($a.children()[0]).text('锁密码');
            }
          }, 10)

        })
      })

      let hrs = $(this).find('hr');
      for (let i = 0; i < hrs.length; i++) {
        let $section = $(hrs[i]).next(),
          $title = $section.find('> h4.mb-3'),
          title = String($title.text()).trim();
        let a;
        switch (title) {
          case 'Initial lock duration':
            let o_children = $title.children();
            $title.text('初始锁定时间');
            $title.append($(o_children[0]));
            $(o_children[0]).mouseover(function () {
              wait('.tooltip-inner', function () {
                $(this).text('初始锁定时间将会在最小时间和最大时间之间随机生成。');
              })
            })
            a = $section.find('.LockInfoItem');
            for (let j = 0; j < a.length; j++) {
              let $card = $(a[j]);
              let $card_title = $card.find('.lock-info-title');
              let $card_text = $card.find('.lock-info-text');
              let v = $card_title[0].innerText.trim();
              switch (v) {
                case 'Min initial duration':
                  $card_title.text('最小初始时间');
                  break;
                case 'Max initial duration':
                  $card_title.text('最大初始时间');
                  break;
                case 'Timer':
                  $card_title.text('计时器');
                  if ($card_text.text() == 'Hidden timer') {
                    $card_text.text('隐藏时间');
                  } else if ($card_text.text() == 'Visible timer') {
                    $card_text.text('时间可视');
                  }
                  break;
              }
            }
            break;
          case 'Community features':
            $title.text('社区特征');
            a = $section.find('.card-content');
            for (let j = 0; j < a.length; j++) {
              let $card = $(a[j]);
              let $card_title = $card.find('.h5');
              let $card_caption = $($card.find('.mb-2 ~ .caption')[0]);
              let $ml = $card.find('.h5 ~ .ml-2');
              let v = $card_title[0].innerText.trim();
              let tip;
              let b;
              switch (v) {
                case 'Share links':
                  $card_title.text('分享链接');
                  tip = '与其他人分享投票链接，要求他们给您的锁增加或减少时间。';
                  b = $card_caption.children();
                  for (let k = 0; k < b.length; k++) {
                    let li = b[k];
                    li.innerHTML = li.innerHTML
                      .replace('Add time', '加时')
                      .replace('Remove time', '减时')
                      .replace('Random option enabled', '随机选项启用')
                      .replace('visits required', '投票人数需要')
                      .replace('Only connected users can vote', '仅登录用户可投票');
                  }
                  break;
                case 'Pillory':
                  $card_title.text('公示加时');
                  tip = '当您受到处罚时，将会在指定的时间段内公开显示。其他用户将能够为您的锁增加时间。';
                  $card_caption.find('p')[0].innerText = $card_caption.find('p')[0].innerText
                    .replace('added per vote', '每票加时');
                  break;
                case 'Hygiene opening':
                  $card_title.text('日常清洁');
                  tip = '因为卫生很重要，所以定期解锁自己来清洁你的贞操设备。要小心，如果你解锁超过了允许的时间，你将受到处罚。';
                  $card_caption.find('p')[0].innerText = $card_caption.find('p')[0].innerText
                    .replace('Time allowed', '允许解锁时间')
                    .replace('penalty for exceeding time', '超时惩罚');
                  _mode($card.find('.caption-dark span span'));
                  break;
              }
              $ml.mouseover(function () {
                wait('.tooltip-inner', function () {
                  $(this).text(tip);
                })
              })
            }

            $section = $section.next();
            $title = $section.find('> h4.mb-3');
            title = String($title.text()).trim();
            if (title == 'Extensions') {
              $title.text('拓展');
              a = $section.find('.card-content');
              for (let j = 0; j < a.length; j++) {
                let $card = $(a[j]);
                let $card_title = $card.find('.h5');
                let $card_caption = $($card.find('.mb-2 ~ .caption')[0]);
                let $ml = $card.find('.h5 ~ .ml-2');
                let v = $card_title[0].innerText.trim();
                let tip;
                let c;
                let lis;
                switch (v) {
                  case 'Dice':
                    $card_title.text('骰子');
                    tip = '每一次你和机器人都会掷骰子。如果你掷的比机器人多，时间就会减少。如果机器人掷得更多，时间就会增加。';
                    _mode($card.find('.caption-dark span span'));
                    $card_caption.children()[0].innerText = $card_caption.children()[0].innerText
                      .replace('Time multiplier', '时间倍数');
                    break;
                  case 'Wheel of Fortune':
                    $card_title.text('幸运转盘');
                    tip = '转动幸运转盘，更改锁的持续时间。为幸运转盘的每个格子配置操作：增加或减少时间、冻结锁或自定义文本。';
                    _mode($card.find('.caption-dark span span'));

                    lis = $card_caption.children()[0].children;
                    for (let j = 0; j < lis.length; j++) {
                      let li = lis[j];
                      let v = li.innerText.trim();
                      switch (v) {
                        case 'Freeze / unfreeze':
                          li.innerText = '冻结 / 解冻';
                          break;
                        case 'Freeze':
                          li.innerText = '冻结';
                          break;
                        case 'Unfreeze':
                          li.innerText = '解冻';
                          break;
                      }
                      if (v.indexOf('Pillory') != -1) {
                        li.innerText = li.innerText.replace('Pillory', '公示');
                      }
                    }
                    break;
                  case 'Tasks':
                    $card_title.text('任务');
                    tip = '通过做任务来增加训练的趣味性。配置您要执行的任务，然后接收一个随机任务，或让其他用户投票决定任务。';
                    _mode($card.find('.caption-dark span span'));

                    lis = $card_caption.children()[0].children;
                    for (let j = 0; j < lis.length; j++) {
                      let $a = $(lis[j]);
                      let t = $a[0].innerText.trim();
                      switch (t) {
                        case 'Assign yourself a random task':
                          $a[0].innerHTML = $a[0].innerHTML.replace('Assign yourself a random task', '随机分配任务');
                          break;
                        case 'Choose your task':
                          $a[0].innerHTML = $a[0].innerHTML.replace('Choose your task', '自行选择任务');
                          break;
                        case 'Edit the list of tasks':
                          $a[0].innerHTML = $a[0].innerHTML.replace('Edit the list of tasks', '可编辑任务列表');
                          break;
                        case 'Tasks assigned by the keyholder':
                          $a[0].innerHTML = $a[0].innerHTML.replace('Tasks assigned by the keyholder', '任务由keyholder分配');
                          break;
                      }
                      if (t.indexOf('points required') != -1) {
                        $a[0].innerHTML = $a[0].innerHTML.replace('points required', '积分需要')
                      }
                    }

                    for (let k = 0; k < $card_caption.find('~h6').length; k++) {
                      let t = $card_caption.find('~h6')[k];
                      let v = t.innerText.trim();
                      switch (v) {
                        case 'List of tasks':
                          t.innerText = '任务列表';
                          break;
                        case 'Penalty for abandoning a task':
                          t.innerText = '放弃惩罚';
                          let lis = $(t).next().children()[0].children;
                          for (let j = 0; j < lis.length; j++) {
                            let li = lis[j];
                            li.innerText = li.innerText
                              .replace('Add', '加时')
                              .replace('Freeze the lock', '冻结')
                              .replace('Pillory for', '公示');
                          }
                          break;
                      }
                    }
                    if ($card_caption.next().text() == 'Configure the tasks you want to do.') {
                      $card_caption.next().text('自行配置你想做的任务');
                    }
                    break;
                  case 'Penalties':
                    $card_title.text('惩罚');
                    tip = '如果您不按时执行操作，将受到惩罚。';
                    _mode($card.find('.caption-dark span span'));

                    c = $card.find('.mb-2 ~ div')[0].children;
                    for (let j = 0; j < c.length; j++) {
                      let $item = $(c[j]);
                      let d = $item.find('.mb-2 .mb-2').children();
                      let title = d[0].innerText.trim();
                      switch (title) {
                        case 'Number of dice rolls required':
                          d[0].innerText = '掷骰子次数要求'; break;
                        case 'Number of times you will have to turn the wheel of fortune':
                          d[0].innerText = '转动幸运转盘次数要求'; break;
                        case 'Number of to-do tasks required':
                          d[0].innerText = '做任务数量要求'; break;
                        case 'Time required to do an action':
                          d[0].innerText = '做任务限时'; break;
                        case 'Number of temporary openings required':
                          d[0].innerText = '日常清洁次数要求'; break;
                        case 'Maximum opening time allowed':
                          d[0].innerText = '清洁解锁限时'; break;
                        case 'Number of verifications required':
                          d[0].innerText = '上传验证锁照次数要求'; break;
                      }
                      d[1].innerText = d[1].innerText
                        .replace('daily', '每天');
                      let e = $item.find('.mb-2 .mb-2').next()[0];
                      let text = e.innerText.trim();
                      switch (text) {
                        case 'Penalty for not rolling the dice in time':
                          e.innerText = '掷骰子-未达次数惩罚'; break;
                        case 'Penalty for not turning the wheel of fortune enough times':
                          e.innerText = '幸运转盘-未达次数惩罚'; break;
                        case 'Penalty for failing to complete all required tasks':
                          e.innerText = '任务-未达次数惩罚'; break;
                        case 'Penalty for not completing the task in time':
                          e.innerText = '任务-超时惩罚'; break;
                        case 'Penalty for not opening your lock the required number of times':
                          e.innerText = '日常清洁-未达次数惩罚'; break;
                        case 'Penalty for not relocking in time':
                          e.innerText = '日常清洁-超时惩罚'; break;
                        case 'Penalty for not verifying your session enough times':
                          e.innerText = '验证锁照-未达次数惩罚'; break;
                      }
                      let lis = $item.find('ul li');
                      for (let k = 0; k < lis.length; k++) {
                        let li = lis[k];
                        li.innerText = li.innerText
                          .replace('Add', '加时')
                          .replace('Freeze the lock', '冻结')
                          .replace('Pillory for', '公示');
                      }
                    }
                    break;
                  case 'Verification picture':
                    $card_title.text('验证锁照');
                    tip = '定期为您的锁拍照，以证明您已上锁。';
                    _mode($card.find('.caption-dark span span'));

                    c = $card.find('.mb-2 ~ div').children();
                    for (let j = 0; j < c.length; j++) {
                      let $item = $(c[j]);
                      if ($item.find('span span span').text() == 'Peer verification') {
                        $item.find('span span span').text('启用验证惩罚');
                        $item.find('span span span').parent().parent().mouseover(function () {
                          wait('.tooltip-inner', function () {
                            $(this).text('您的图片将由其他成员验证。');
                          })
                        })
                      }
                      if ($item.hasClass('caption') && String($item.find('span').text()).trim() == 'Visible to everyone') {
                        $item.find('span')[0].innerHTML = $item.find('span')[0].innerHTML.replace('Visible to everyone', '对所有人可见');
                      } if ($item.hasClass('caption') && String($item.find('span').text()).trim() == 'Only visible to the keyholder') {
                        $item.find('span')[0].innerHTML = $item.find('span')[0].innerHTML.replace('Only visible to the keyholder', '仅对keyholder可见');
                      }
                      if ($item.hasClass('mt-3') && $item.text() == 'Penalty for having a rejected picture') {
                        $item.text('验证锁照被多数拒绝时的惩罚');
                      }
                      if ($item.find('ul li').length > 0) {
                        for (let k = 0; k < $item.find('ul li').length; k++) {
                          let li = $item.find('ul li')[k];
                          li.innerText = li.innerText
                            .replace('Add', '加时')
                            .replace('Freeze the lock', '冻结')
                            .replace('Pillory for', '公示');
                        }
                      }
                    }
                    break;
                  case 'Random Events':
                    $card_title.text('随机事件');
                    tip = '随机事件可能发生并更改您的计时器。时间增加或减少，冻结锁定，许多事情都可能发生。你不知道什么时候会发生，这会是一个惊喜。';
                    _mode($card.find('.caption-dark span span'));

                    let text = $card_caption.find('p').text();
                    if (text.indexOf('Easy') != -1) {
                      $card_caption.find('p').text('简单: 给新手准备，事件频繁，但对锁时间的影响很小(little impact)。');
                    } else if (text.indexOf('Normal') != -1) {
                      $card_caption.find('p').text('普通: 更多事件，对锁时间的有一些影响(some impact)。');
                    } else if (text.indexOf('Hard') != -1) {
                      $card_caption.find('p').text('困难: 更长的事件，您的锁可能会比预期的时间长得多。');
                    } else if (text.indexOf('Expert') != -1) {
                      $card_caption.find('p').text('专家: 你喜欢冒险！给那些不会因惧怕而放弃的人。');
                    }
                    break;
                  case 'Guess the Timer':
                    $card_title.text('时间竞猜');
                    tip = '正确猜测计时器，否则添加时间。计时器将会被隐藏，当你认为计时器结束时按下解锁按钮。如果计时器仍在运行，则会添加随机时间！';
                    _mode($card.find('.caption-dark span span'));

                    $card_caption.find('p').text(
                      $card_caption.find('p').text()
                        .replace('Random time between', '随机加时')
                        .replace('and', '到')
                    );
                    break;
                }
                $ml.mouseover(function () {
                  wait('.tooltip-inner', function () {
                    $(this).text(tip);
                  })
                })
              }
            }
            break;
        }
        if ($section.hasClass('lock-notable-items')) {
          a = $section[0].children;
          for (let j = 0; j < a.length; j++) {
            let $item = $(a[j]);
            let $item_title = $item.find('.lock-notable-title');
            let $description = $item.find('.lock-notable-description');
            let item_title = $item_title[0] && $item_title[0].innerText.trim();
            switch (item_title) {
              case 'No time limit':
                $item_title.text('无时间限制的');
                $description.text('锁定时间可以无限制地增加。');
                break;
              case 'Password required':
                $item_title.text('需要密码');
                $description.text('需要密码才能加入该锁计划');
                break;
              case 'Contact required':
                $item_title.text('加入前需要联系作者');
                $description.find('.mb-1').text('你必须在加入该锁计划前联系 keyholder');
                $description.find('a')[0].innerHTML = $item.find('a')[0].innerHTML
                  .replace('Send a message', '发信息');
                break;
              case 'Findom lock':
                $item_title.text('付费锁计划');
                $description.text('该锁计划需要支付费用');
                break;
              case 'Maximum lock duration':
                $item_title.text('最大锁定时间');
                $description.text(
                  $description.text()
                    .replace('The lock duration cannot exceed', '这个锁计划的时间不会超过')
                );
                break;
              case 'Time information hidden from the lock history':
                $item_title.text('从锁更改历史记录中隐藏时间信息');
                $description.text('你将无法看到时间增加和删除记录');
                break;
            }
          }
        }
      }
    })
  }

  function rules_community_review() {
    wait('.Header ~ div > div > div, .MobileHeader ~ div > div > div', function () {
      $($(this)[0]).find('h2').text('欢淫来到 Chaster社区');
      $($(this)[0]).find('h2 ~ .caption').text('Chaster社区受某些规则的约束。在进入社区之前，您必须阅读并接受这些规则。');

      $($(this)[1].children[0]).find('.caption.mb-4 .mb-2').text('如果违反规则，团队可能会暂时或永久暂停您的帐户。');
      $($(this)[1].children[0]).find('.caption.mb-4 .mb-2 ~ div').text('我们邀请您举报任何不遵守规则的内容。');
      let $o = $($(this)[1].children[0]).find('div .mb-3 .CheckboxGroupItem');
      let o_children = $o.children();
      $o.empty().append($(o_children[0])).append('我同意Chaster社区规则');
      $($(this)[1].children[0]).find('div .mb-3 ~ div button span').text('加入 Chaster社区');
      $($(this)[1].children[0]).find('div .mb-3 ~ div button').click(toastify);

      let a = $(this)[1].children[0].children;
      for (let i = 0; i < a.length; i++) {
        let $item = $(a[i]);
        if ($item.hasClass('card-content')) {
          let title = $item.children()[1].children[0];
          let caption = $item.children()[1].children[1];
          let v = title.innerText.trim();
          switch (v) {
            case 'Spam is prohibited':
              title.innerText = '禁止垃圾邮件(消息)';
              caption.innerText = '不要发送自荐或营销信息。';
              break;
            case 'Be respectful':
              title.innerText = '要有礼貌';
              caption.innerText = '为每个人保持一个健康愉快的讨论空间。禁止使用冒犯性、威胁性或诽谤性内容。';
              break;
            case 'Financial interactions':
              title.innerText = '金钱互动';
              caption.innerHTML = caption.innerHTML
                .replace('If you offer paid services, you must take the Findom role in', '如果您提供付费服务，您必须有 Findom 角色在')
                .replace('your profile', '你的个人资料')
                .replace('. Findoms must not initiate contact with other users to offer such services.', '。Findom们不得主动与其他用户联系以提供此类服务。');
              break;
            case 'Respect the laws':
              title.innerText = '尊重法律';
              caption.innerText = '你不能以任何方式对未成年人进行性行为，也不应该提倡、鼓励或从事任何非法行为。';
              break;
          }
        }
      }
    })
  }

  function menu_profile() {
    wait('.Header ~ div > div:last-child > div > div, .MobileHeader ~ div > div:last-child > div > div', function () {
      if ($('.MobileHeader div h2').text() == 'Profile') $('.MobileHeader div h2').text('个人资料');
      $($(this)[0]).find('.caption .text-sm.mt-1').text('查看个人资料');
      $(this).wait('> div:nth-child(2)', function () {
        let a = $(this).children();
        for (let i = 0; i < a.length; i++) {
          let item = a[i];
          let title = item.children[0];
          let v = title && title.innerHTML.trim();
          let b;
          switch (v) {
            case 'Account':
              title.innerText = '账号';
              b = a[i + 1].children;
              for (let j = 0; j < b.length; j++) {
                let jtem = b[j];
                let subtitle = jtem.children[1];
                let jv = subtitle && subtitle.innerHTML.trim();
                switch (jv) {
                  case 'Shared locks':
                    subtitle.innerText = '共享锁';
                    break;
                  case 'Member verifications':
                    subtitle.innerText = '用户核查';
                    break;
                  case 'Messages':
                    subtitle.innerText = '消息';
                    break;
                  case 'Profile':
                    subtitle.innerText = '个人资料';
                    break;
                  case 'Saved locks':
                    subtitle.innerText = '保存锁';
                    break;
                  case 'Settings':
                    subtitle.innerText = '设置';
                    break;
                  case 'Plus':
                    subtitle.innerText = 'Plus会员';
                    break;
                  case 'Log out':
                    subtitle.innerText = '登出';
                    break;
                }
              }
              break;
            case 'Community':
              title.innerText = '社区';
              b = a[i + 1].children;
              for (let j = 0; j < b.length; j++) {
                let jtem = b[j];
                let subtitle = jtem.children[1];
                let jv = subtitle && subtitle.innerHTML.trim();
                switch (jv) {
                  case 'Members':
                    subtitle.innerText = '用户';
                    break;
                }
              }
              break;
            case 'Application':
              title.innerText = '应用';
              b = a[i + 1].children;
              for (let j = 0; j < b.length; j++) {
                let jitem = b[j];
                let subtitle = jitem.children[1];
                if (!subtitle) subtitle = jitem.children[0].children[1];
                let jv = subtitle && subtitle.innerHTML.trim();
                switch (jv) {
                  case 'Documentation':
                    subtitle.innerText = '文档';
                    break;
                  case 'Changelog':
                    subtitle.innerText = '更新日志';
                    break;
                  case 'Developers':
                    subtitle.innerText = '开发';
                    break;
                  case 'Privacy policy':
                    subtitle.innerText = '隐私政策';
                    break;
                  case 'Terms':
                    subtitle.innerText = '用户条款';
                    break;
                  case 'Contact':
                    subtitle.innerText = '联系我们';
                    break;
                }
              }
              break;
          }
        }
      })
    })
  }

})();