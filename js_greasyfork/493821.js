// ==UserScript==
// @name         idleinfinity
// @version      1.0.7
// @namespace    lyxk
// @description  挂机无止境的辅助UI
// @author       lyxk
// @grant        GM_addStyle
// @run-at       document-start
// @match        https://www.idleinfinity.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/493821/idleinfinity.user.js
// @updateURL https://update.greasyfork.org/scripts/493821/idleinfinity.meta.js
// ==/UserScript==

const defaultFilterOptions = ['技能', '凹槽(0/2)', '凹槽(0/4)', '取得魔法装备', '攻击速度', '施法速度'];

let config = {
  userNumber: 1,
  showRequire: true,
  fastFilter: true,
  fastOptions: defaultFilterOptions.slice(0), // 快速过滤器配置，可自行增删
  showSpellColor: true,
  showSpeedLevel: true,
  dropNotification: true,
  itemStats: true,
  showBattle: true,
  mapHack: true,
  mapHackType: 'all',
  infiniteMap: false,
  showSetAttr: true,
  oneKeyEquip: true,
  oneKeyAgree: true,
  oneKeyRune: true,
  showRuneTip: true,
  showBattleDetail: true,
  minLevel: null,
  moveTime: 5000,
  failure: 10,
  minSan: 4,
  showEquipInfo: true,
  quickSearch: true,
};

const configLabel = {
  showRequire: '职业专属显示',
  fastFilter: '快速过滤选项',
  showSpellColor: '法术技能高亮',
  showSpeedLevel: '显示速度档位',
  showCharDmg: '角色均伤显示',
  showAccuracy: '角色命中显示',
  dropNotification: '欧皇暗金通知',
  itemStats: '欧皇收获统计',
  showBattle: '快速秘境战斗',
  mapHack: '秘境自动战斗',
  infiniteMap: '无限秘境模式',
  showSetAttr: '显示套装属性',
  showEquipInfo: '显示装备属性简版',
  oneKeyAgree: '一键同意功能',
  oneKeyRune: '一键转移符文',
  showRuneTip: '符文之语提示',
  showBattleDetail: '战斗详细分析',
  minLevel: '符文序号',
  failure: '失败重置次数',
  quickSearch: '快捷搜索'
};

const userConfig = ['dropNotification', 'showEquipInfo', 'quickSearch'];

let localConfig = localStorage.getItem('idle-ui-config');
if (localConfig) {
  localConfig = JSON.parse(localConfig);
  Object.keys(localConfig).map(key => {
    if (config[key] !== undefined) config[key] = localConfig[key];
  });
}

function idleInit() {
  // 转移物品间隔时间,单位毫秒,最低不能低于1000,会被制裁
  config.moveTime = config.moveTime < 1000 ? 1000 : config.moveTime;
  // 战斗失败重置次数,当同一组怪物失败到达此次数,自动重置当前秘境
  config.failure = 25;
  // 同意消息间隔时间
  config.agreedTime = 1000;
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `.eq-weapon { background-color: #700;} .eq-armor {background-color: #007;} .eq-amulet {background-color: #0b0;} .eq-delete {background-color: gray;}
        .eq-jewel {background-color: #808a87;} .selected-b {border: 1px solid #66ccff!important;} .selected-r {border: 1px solid #f00!important;} .selected-d {border: 1px solid #fff!important;}`;
  let head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
  let link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://cdn.faith.wang/Content/game-icons.css?v=3";
  head.appendChild(link);

  if (config.showEquipInfo)
    getItemInfo();
  addConfig();
  // 显示限定字符
  switchSkin(config.showRequire);
  Notification.requestPermission();

  $('.navbar-nav > li > a').each(function () {
    if ($(this).text().indexOf('帮助') >= 0) {
      const links = [
        { text: '暗金列表', link: '/Help/Content?url=Unique' },
        { text: '套装列表', link: '/Help/Content?url=Set' },
        { text: '秘境圣衣', link: '/Help/Content?url=Sacred' },
        { text: '神器列表', link: '/Help/Content?url=Artifact' },
        { text: '普通物品', link: '/Help/Content?url=BaseEquip' },
        { text: '前缀属性', link: '/Help/Content?url=Prefix' },
        { text: '后缀属性', link: '/Help/Content?url=Suffix' },
        { text: '固定词缀', link: '/Help/Content?url=SpecialAffix' },
        { text: '神秘玩具', link: '/Help/specialequip' },
      ].map(item => {
        return `<li><a class="base" href="${item.link}" target="_blank">${item.text}</a></li>`;
      }).join('');
      $(this).next().append(links);
    }
    if ($(this).text().indexOf('设置') >= 0) {
      const pluginSetting = `<li><a class="base" id="open-ui-modal-header">插件设置</a></li>`
      $(this).next().append(pluginSetting)
    }
  });

  function fetchItem(name, callback) {
    if (!name) return;
    if (quickSearchType === 'Set' || quickSearchType === 'Unique') {
      $.get(`/Help/${quickSearchType}`, function (html) {
        const dom = $.parseHTML(html);
        const type = quickSearchType.toLowerCase();
        $(dom).find(`.equip > .${type}`).each(function () {
          if ($(this).text().indexOf(name) >= 0) {
            callback($(this).parent());
            return;
          }
        });
      });
    } else {
      $.get('/Help/Artifact', function (html) {
        const dom = $.parseHTML(html);
        $(dom).find('tr').each(function (i) {
          if (i > 0) {
            const nameLabel = $(this).children().last().find('.artifact');
            if (nameLabel.text().indexOf(name) >= 0) {
              const ret = [];
              ret.push(`<p class="artifact">${nameLabel.text()}</p>`);
              $(this).children().first().children('div').each(function () {
                ret.push(`<p class="physical">${$(this).text()}</p>`);
              });
              ret.push('<p class="artifact">神器</p>');
              nameLabel.parent().children().each(function (index) {
                if (index > 0) ret.push(`<p>${$(this).text()}</p>`);
              });
              const recipe = [];
              $(this).children().eq(1).find('.artifact.equip-name').each(function () {
                const id = $(this).text().match(/\d+/g)[0];
                recipe.push(`<span class="artifact">${id}#</span>`);
              });
              ret.push(`<p class="physical">${recipe.join(' + ')}</p>`);
              callback($(`<div class="equip">${ret.join('')}</div>`));
              return;
            }
          }
        });
      });
    }
  }

  let quickSearchType = 'Unique';
  const itemTypes = `
    <div class="btn-group">
      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
        <span id="idle-quick-type">暗金</span><span class="caret" style="margin-left: 5px;"></span>
      </button>
      <ul class="dropdown-menu">
          <li><a class="quick-option unique" data-type="Unique" href="javascript: void(0);">暗金</a></li>
          <li><a class="quick-option set" data-type="Set" href="javascript: void(0);">套装</a></li>
          <li><a class="quick-option artifact" data-type="Artifact" href="javascript: void(0);">神器</a></li>
      </ul>
    </div>
  `;

  $('#open-ui-modal-header').click(function () {
    $('#modalUI').modal('show');
  });

  if (config.quickSearch) {
    const input = `<div id="idle-ui-quicksearch">${itemTypes}<input placeholder="搜索..." class="form-control"/><div class="popover" style="display: none; left: 60px; top: 28px;"><div class="popover-content"></div></div></div>`;
    $('.navbar-header').append(input);

    $('.quick-option').click(function (e) {
      e.preventDefault();
      quickSearchType = $(this).data('type');
      $('#idle-quick-type').text($(this).text());
      const val = $('#idle-ui-quicksearch > input').val();
      if (val) {
        const popover = $('#idle-ui-quicksearch > input').next();
        popover.hide();
        fetchItem(val, function (html) {
          popover.children().first().html(html);
          popover.show();
        });
      }
    });

    let quickTimer = null;
    $('#idle-ui-quicksearch > input').keyup(function () {
      if (quickTimer) {
        clearTimeout(quickTimer);
        quickTimer = null;
      }
      const val = $(this).val();
      if (!val) $(this).next().hide();
      quickTimer = setTimeout(() => {
        const popover = $(this).next();
        popover.hide();
        fetchItem(val, function (html) {
          popover.children().first().html(html);
          popover.show();
        });
      }, 500);
    });
  }

  if (config.fastFilter) {
    const fastOptions = (['无'].concat(config.fastOptions)).map(function (item) {
      return `<li><a href="javascript: void(0);" class="filter-text" style="color: white">${item}</a></li>`;
    }).join('');

    const fastFilter = `<div class="fast-filter btn-group">
                              <button type="button" class="btn btn-default btn-xs dropdown-toggle" style="margin-left: 10px;" data-toggle="dropdown">快速过滤<span class="caret"/></button>
                              <ul class="dropdown-menu">${fastOptions}</ul>
                            </div>`;
    $(fastFilter).insertAfter('.panel-filter');

    $('.filter-text').click(function () {
      const text = $(this).text() === '无' ? '' : $(this).text();
      const filter = $(this).parent().parent().parent().prev();
      filter.val(text);
      filter.trigger('input');
    });
  }

  if (config.showSpellColor) {
    $('.skill-name').each(function () {
      let desc = '';
      let label = '';
      if ($(this).children().length === 2) {
        desc = $(this).next().text();
        label = $(this).children().last();
      } else {
        desc = $(this).parent().next().text();
        label = $(this);
      }
      if (desc.indexOf('法术技能') >= 0) {
        label.addClass('skill');
      }
    });
  }

  function getSpeedLevel(speed, isAttack) {
    const levels = isAttack ? [0, -25, -50, -80, -120, -160, -200] : [0, -20, -45, -75, -110, -145, -180];
    for (let i = 0; i < levels.length; i++) {
      if (speed > levels[i]) {
        const next = levels[i];
        return [i, next];
      }
    }
    return [levels.length, '已最高'];
  }

  function renderCharLabel(name, value, id) {
    const idStr = id ? `id="${id}"` : '';
    return `<p><span>${name}：</span><span ${idStr} class="state">${value}</span></p>`;
  }

  if (location.href.indexOf('Character/Detail') >= 0) {
    $('.label.label-default').each(function () {
      let level = 0
      const label = $(this).text();
      if (label.indexOf('Lv') >= 0 && level === 0) {
        level = label.replace('Lv', '') - 0;
      }
      if (config.showSpeedLevel) {
        if (label === '攻击') {
          const attackSpeed = $(this).parent().next().next().next().next().children().last();
          const level = getSpeedLevel(attackSpeed.text(), true);
          const levelElement = renderCharLabel('攻速档位', level[0]) + renderCharLabel('下档攻速', level[1]);
          $(levelElement).insertAfter(attackSpeed.parent());
        } else if (label === '法术') {
          const spellSpeed = $(this).parent().next().children().last();
          const level = getSpeedLevel(spellSpeed.text(), false);
          const levelElement = renderCharLabel('速度档位', level[0]) + renderCharLabel('下档法速', level[1]);
          $(levelElement).insertAfter(spellSpeed.parent());
        }
      }

      if (config.itemStats) {
        if (label == '综合') {
          const uniqueNum = $(this).parent().next().next().next().next().children().last().text();
          const setNum = $(this).parent().next().next().next().next().next().children().last().text();
          saveStats({ uniqueNum: uniqueNum, setNum: setNum });
        }
      }
    });
  }

  function saveStats(statsData) {
    const idMatch = location.href.match(/Character\/Detail\?Id=(\d+)/i);
    if (!idMatch) return;
    const id = idMatch[1];
    let stats = localStorage.getItem('idle-ui-stats');
    stats = stats ? JSON.parse(stats) : { uniqueNum: 0, setNum: 0 };
    const lastStatsData = stats[id];
    const time = +new Date();
    if (lastStatsData && lastStatsData.time) {
      const duration = moment.duration(moment(time).diff(moment(lastStatsData.time)));
      const timeSpan = duration.asMinutes() > 60 ? (duration.asHours().toFixed(1) - 0) + '小时前' : Math.round(duration.asMinutes()) + '分钟前';
      const uniqueChange = statsData.uniqueNum - lastStatsData.uniqueNum;
      const setChange = statsData.setNum - lastStatsData.setNum;
      displayStats(id, timeSpan, uniqueChange, setChange);
    }
    statsData.time = time;
    stats[id] = statsData;
    localStorage.setItem('idle-ui-stats', JSON.stringify(stats));
    localStorage.getItem('idle-ui-stats');

  }

  function displayStats(id, timeSpan, uniqueChange, setChange) {
    const message = `<div class="panel panel-inverse panel-top"><div class="panel-body">上次访问是${timeSpan}，这段时间内你获得了 <span class="unique">${uniqueChange}</span> 件暗金，<span class="set">${setChange}</span> 件套装。<a href="javascript: void(0);" id="open-ui-modal" class="btn btn-xs btn-default ml-10">插件设置</a></div></div>`;

    $('.navbar.navbar-inverse.navbar-fixed-top').next().next().prepend(message);
    $('#open-ui-modal').click(function () {
      $('#modalUI').modal('show');
    });
  }

  if (config.showBattle && inBattlePage() && !$('.error').length) {
    let waitTime = $('#time');
    if (waitTime.length) {
      waitTime = waitTime.val();
    } else {
      $(document).ready(function () {
        $(".turn").battle({
          interval: 0,
          guaji: 0
        });
      });
    }
  }

  function renderConigHtml() {
    return Object.keys(config)
      .filter(item => userConfig.indexOf(item) >= 0)
      .map(key => {
        return `<div class="col-sm-4">
                          <div class="checkbox" style="margin: 2px 0;">
                            <label><input class=" idle-ui-config" type="checkbox" data-key="${key}"> ${configLabel[key]}</label>
                          </div>
                        </div>`
      })
      .join('');
  }

  function addConfig() {
    const configHtml = renderConigHtml();
    const html = `
          <div class="modal fade" id="modalUI" style="display: none;">
              <div class="modal-dialog modal-large" role="">
                  <div class="modal-content model-inverse">
                      <div class="modal-header">
                          <span class="modal-title">插件设置</span>
                      </div>
                      <div class="modal-body">
                        <div class="panel-header state">配置项开关（点击即可启用/禁用，变更后请刷新）</div>
                        <div class="form row">${configHtml}</div>
                        <p>按 Alt+T 可快速切换主题皮肤</p>
                        <div class="panel-header state">符文提示过滤</div>
                        <div>
                            <input id="idle-ui-rune-filter" type="number" name="points" min="1" max="33" step="1" style="padding: 0 0 0 10px; width: 20%;" placeholder=${configLabel.minLevel} value=${config.minLevel}>
                        </div>
                        <div class="panel-header state"></div>
                        <div class="panel-header state">快速过滤下拉选项（每行一个）</div>
                        <textarea id="idle-ui-filters" class="form-control panel-textarea" rows="5"></textarea>
                        <div class="textarea-actions">
                          <button type="button" class="btn btn-xs btn-success" id="idle-ui-save-filters">保存选项</button>
                          <button type="button" class="btn btn-xs btn-default" id="idle-ui-reset-filters">恢复默认</button>
                        </div>
                        <div class="panel-header state">清除插件缓存（清除插件的所有配置）</div>
                        <div class="textarea-actions">
                          <button type="button" class="btn btn-xs btn-error" id="idle-ui-localstorage-clear">执行</button>
                        </div>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                      </div>
                  </div>
              </div>
          </div>
          <div class="modal fade" id="modalUIAuto" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content model-inverse">
                <div class="modal-header">
                    <span class="modal-title">自动秘境设置</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="control-label">自动重置</label>
                        <input id="autoReset" name="autoReset" type="checkbox" checked="checked">
                    </div>
                    <div class="form-group">
                      <label class="radio-inline">
                        <input type="radio" class="idle-ui-hack-type" name="maphack-type" id="hack-boss" value="boss"> 只打BOSS
                      </label>
                      <label class="radio-inline">
                        <input type="radio" class="idle-ui-hack-type" name="maphack-type" id="hack-all" value="all"> 小怪全清
                      </label>
                    </div>
                    <div class="form-group">
                        <label class="control-label">失败重试</label>
                        <input id="maxCount" name="maxCount" class="form-control" type="text" placeholder="请输入最大失败重试次数" value="100">
                    </div>
                    <div class="form-group">
                        <label class="control-label">SAN阈值</label>
                        <input id="minSan" name="minSan" class="form-control" type="text" placeholder="请输入最低保留SAN值" value="0">
                    </div>
                    <div class="form-group">
                        <label class="control-label">使用角色数（请输入使用自动秘境的角色数，会设定对应延时请求，防止封号）</label>
                        <input id="userNumber" name="userNumber" class="form-control" type="text" placeholder="请输入使用角色数量" value="0">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-xs auto-ui-apply" data-dismiss="modal">提交</button>
                    <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
        `;

    $(document.body).append(html);

    loadLocalConfig();
    let $modalDialog = $('div.modal div.modal-dialog');
    let dialogHeight = $modalDialog.height();
    let windowHeight = $(window).height();
    if (windowHeight > dialogHeight)
      $modalDialog.css({
        "marginTop": (windowHeight - dialogHeight) / 3
      });

    $('.idle-ui-localstorage-clear').click(function () {
      localStorage.clear();
    });
  }

  function loadLocalConfig() {
    $('.idle-ui-config').each(function () {
      const key = $(this).data('key');
      $(this).prop('checked', config[key]);
    });
    $('#idle-ui-filters').val(config.fastOptions.join('\n'));

    $('#idle-ui-localstorage-clear').click(function () {
      config.fastOptions = defaultFilterOptions;
      saveLocalConfig();
      loadLocalConfig();
    });

    $('#idle-ui-save-filters').click(function () {
      config.fastOptions = $('#idle-ui-filters').val().split('\n');
      config.minLevel = $('#idle-ui-rune-filter').val();
      saveLocalConfig();
    });

    $('.idle-ui-config').change(function () {
      const key = $(this).data('key');
      config[key] = $(this).prop('checked');
      saveLocalConfig();
    });
  }

  function saveLocalConfig() {
    localStorage.setItem('idle-ui-config', JSON.stringify(config));
  }

  $(document).ready(function () {
    $(".panel-filter").each(function (i, input) {
      var value = window.localStorage.getItem($(this).attr("id"));
      if (value != null && value.length > 0) {
        $(this).val(value);
        $(this).trigger("propertychange");
      }
    });
  });

  function getItemInfo() {
    //装备栏物品信息
    let on_gears = $('.equip-container .equip-content').get();
    on_gears.duff((item, index) => {
      equipmentAttributesSimplify(item.previousElementSibling, item);
    })

    //背包和储存箱物品信息
    let bagAndBoxItemDescriptionsList = $('.equip-content-container .equip-content').get();
    let bagItemList = $('.equip-bag .equip-container p');
    let boxItemList = $('.equip-box .equip-container p');
    bagAndBoxItemDescriptionsList.duff((item, index) => {
      matchItemId(bagItemList, item);
      matchItemId(boxItemList, item);
    })

    function matchItemId(itemList, bagAndBoxItemDescription) {
      let list = itemList.find('span.equip-name').get();
      list.duff((item, index) => {
        $(item).data().id == bagAndBoxItemDescription.dataset.id ? equipmentAttributesSimplify(itemList[index], bagAndBoxItemDescription) : null;
      })
    }

    function equipmentAttributesSimplify(eqn, gear) {
      let innerHTML = gear.innerHTML,
        simplify = '<div class="equip-info" style="display: flex; flex-wrap: wrap;">',
        commonStyle = "margin-right: 10px;",
        yellow = "yellow", white = "white",
        rareImg = `<img src="https://www.idleinfinity.cn/Content/images/rare1.png" width="15" height="15" />`;
      if ($('head link#webstyle')[0].href.indexOf('page3.css') > 0) {
        yellow = "#aaaa03";
        white = "black";
      }

      let hits = null;
      $list = $(gear).find(".equip p");
      for (let i = 1; i < $list.length; i++) {
        if ($list[i].innerHTML.indexOf("掉落等级") > 0) {
          hits = $($list[i]).find("span")[1].innerText;
          continue;
        }
      }
      if (hits != null) {
        simplify += ` <span style="${commonStyle}">Lv${hits}</span>`;
      }

      hits = innerHTML.match(/攻击速度提升 (\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:#ffd700; ${commonStyle}">${hits[1]}%攻速</span>`;
      }
      hits = innerHTML.match(/施法速度提升 (\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:#ff8000; ${commonStyle}">${hits[1]}%法速</span>`;
      }
      hits = innerHTML.match(/\+(\d+)\% 增强伤害/);
      if (hits != null) {
        simplify += ` <span style="color:#66ccff; ${commonStyle}">${hits[1]}%增伤</span>`;
      }
      hits = innerHTML.match(/\+(\d+)\% 暴击几率/);
      if (hits != null) {
        simplify += ` <span style="color:#CCCC00; ${commonStyle}">${hits[1]}%暴击</span>`;
      }
      hits = innerHTML.match(/凹槽(\(\d+\/\d+\))/);
      if (hits != null) {
        simplify += ` <span style="color:#afafaf; ${commonStyle}">${hits[1]}孔</span>`;
      }
      hits = innerHTML.match(/\+(\d+)\% 更佳的机会取得魔法装备/);
      if (hits != null) {
        simplify += ` <span style="color:${white}; ${commonStyle}">${hits[1]}%掉装</span>`;
      }
      hits = innerHTML.match(/\+(\d+)\% 额外金币从怪物身上取得/);
      if (hits != null) {
        simplify += ` <span style="color:gold; ${commonStyle}">${hits[1]}%掉钱</span>`;
      }

      hits = innerHTML.match(/(\d+)陨石/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">火刻Lv${hits[1]}</span>`;
      }
      hits = innerHTML.match(/(\d+)暴风雪/);
      if (hits != null) {
        simplify += ` <span style="color:#3ff; ${commonStyle}">冰刻Lv${hits[1]}</span>`;
      }
      hits = innerHTML.match(/(\d+)连锁闪电/);
      if (hits != null) {
        simplify += ` <span style="color:${yellow}; ${commonStyle}">电刻Lv${hits[1]}</span>`;
      }
      hits = innerHTML.match(/(\d+)剧毒新星/);
      if (hits != null) {
        simplify += ` <span style="color:#00c400; ${commonStyle}">毒刻${hits[1]}</span>`;
      }
      hits = innerHTML.match(/(\d+)虚化/);
      if (hits != null) {
        simplify += `<span style="color:#B659F5; ${commonStyle}">魔刻${hits[1]}</span>`;
      }
      hits = innerHTML.match(/(\d+)伤害加深/);
      if (hits != null) {
        simplify += `<span style="color:${white}; ${commonStyle}">增物伤</span>`;
      }

      hits = innerHTML.match(/(\d+)\% 火焰伤害/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">${hits[1]}%火伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 冰冷伤害/);
      if (hits != null) {
        simplify += ` <span style="color:#3ff; ${commonStyle}">${hits[1]}%冰伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 闪电伤害/);
      if (hits != null) {
        simplify += ` <span style="color:${yellow}; ${commonStyle}">${hits[1]}%电伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 毒素伤害/);
      if (hits != null) {
        simplify += ` <span style="color:#00c400; ${commonStyle}">${hits[1]}%毒伤</span>`;
      }
      hits = innerHTML.match(/(\d+)~(\d+)\ 火焰伤害/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">${hits[1]}~${hits[2]}火伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 魔法伤害/);
      if (hits != null) {
        simplify += ` <span style="color:#B659F5; ${commonStyle}">+${hits[1]}%法伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 物理伤害/);
      if (hits != null) {
        simplify += ` <span style="color:${white}; ${commonStyle}">+${hits[1]}%物伤</span>`;
      }


      hits = innerHTML.match(/(\d+)\% 目标伤害/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">减${rareImg}火抗${hits[1]}%</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 目标火焰抗性/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">减${rareImg}火抗${hits[1]}%</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 目标冰冷抗性/);
      if (hits != null) {
        simplify += ` <span style="color:#3ff; ${commonStyle}">减${rareImg}冰抗${hits[1]}%</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 目标闪电抗性/);
      if (hits != null) {
        simplify += ` <span style="color:${yellow}; ${commonStyle}">减${rareImg}电抗${hits[1]}%</span>`;
      }
      hits = innerHTML.match(/(\d+)\% 目标毒素抗性/);
      if (hits != null) {
        simplify += ` <span style="color:#00c400; ${commonStyle}">减${rareImg}毒抗${hits[1]}%</span>`;
      }

      hits = innerHTML.match(/(\d+)~(\d+)\ 闪电伤害/);
      if (hits != null) {
        simplify += ` <span style="color:${yellow}; ${commonStyle}">${hits[1]}~${hits[2]}电伤</span>`;
      }
      hits = innerHTML.match(/(\d+)\ 毒素伤害，持续(\d+)\次/);
      if (hits != null) {
        simplify += ` <span style="color:#00c400; ${commonStyle}">${hits[1]}毒伤${hits[2]}dot</span>`;
      }
      hits = innerHTML.match(/(\d+)~(\d+)\ 冰冷伤害，冰冷效果持续(\d+)\次/);
      if (hits != null) {
        simplify += ` <span style="color:#3ff; ${commonStyle}">${hits[1]}~${hits[2]}冰伤${hits[3]}寒dot</span>`;
      }

      hits = innerHTML.match(/元素抗性 \+(\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:#f90; ${commonStyle}">${hits[1]}%元素抗性</span>`;
      }
      hits = innerHTML.match(/抗火 \+(\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:red; ${commonStyle}">${hits[1]}%火抗</span>`;
      }
      hits = innerHTML.match(/抗寒 \+(\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:#3ff; ${commonStyle}">${hits[1]}%寒抗</span>`;
      }
      hits = innerHTML.match(/抗闪电 \+(\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:${yellow}; ${commonStyle}">${hits[1]}%电抗</span>`;
      }
      hits = innerHTML.match(/抗毒 \+(\d+)\%/);
      if (hits != null) {
        simplify += ` <span style="color:#00c400; ${commonStyle}">${hits[1]}%毒抗</span>`;
      }
      $(eqn).append(`${simplify}</div>`);
    }
  }

  // 当前是秘境界面
  if (config.mapHack && location.href.indexOf('Map/Dungeon') >= 0) {
    const idMatch = location.href.match(/id=(\d+)/i);
    if (!idMatch) return;
    const id = idMatch[1];
    let hacking = false;
    let map = localStorage.getItem('idle-ui-maphack');
    const $dungeonAutoContainer = $(`<div class="panel-heading ${$('head link#webstyle')[0].href.indexOf('page2.css') > 0 ? '' : 'mt-10'}"></div>`);
    const dungeonAutoContainerTitle = `<span>插件</span>`;
    const $dungeonAutoOperator = $(`<div class="pull-right"></div>`);
    const dungeonAutoLogBtn = '<a class="btn btn-xs btn-default ml-10" id="idle-ui-maplog" href="#" role="button">自动秘境日志</a>';
    const enableDungeonAutoBtn = '<a class="btn btn-xs btn-success ml-10" id="enableDungeonAutoBtn" data-toggle="modal" data-target="#modalUIAuto" role="button">自动秘境</a>';
    const cancelDungeonAutoBtn = '<a class="btn btn-xs btn-warning ml-10" id="cancelDungeonAutoBtn" href="#" role="button">取消自动秘境</a>';
    $dungeonAutoOperator.append(dungeonAutoLogBtn).append(enableDungeonAutoBtn).append(cancelDungeonAutoBtn)
    $dungeonAutoContainer.append(dungeonAutoContainerTitle).append($dungeonAutoOperator);
    const $dungeonStatus = $('.container .col-md-9 .panel-heading');
    const createArr = Array.from(new Array(400), (v, i) => i);

    $dungeonStatus.after($dungeonAutoContainer);
    initDungeonAutoLog();
    initDungeonAutoModal();
    let log = {};

    function initDungeonAutoLog() {
      let page = 1;
      const modal = `
        <div class="modal fade" id="modalMapLog" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content model-inverse">
                    <div class="modal-header">
                        <span class="modal-title">自动秘境日志</span>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                          <div class="col-md-6 col-xs-12">
                            <div class="panel-header state">小怪战斗统计</div>
                            <p>
                              <span>战斗次数：</span><span class="state mr-10" id="idle-ui-creepnum"></span>
                              <span>平均回合：</span><span class="state mr-10" id="idle-ui-avgcreepturns"></span>
                              <span>胜率：</span><span class="state" id="idle-ui-creepwinrate"></span>
                            </p>
                          </div>
                          <div class="col-md-6 col-xs-12">
                            <div class="panel-header state">Boss战斗统计</div>
                            <p>
                              <span>战斗次数：</span><span class="state mr-10" id="idle-ui-bossnum"></span>
                              <span>平均回合：</span><span class="state mr-10" id="idle-ui-avgbossturns"></span>
                              <span>胜率：</span><span class="state" id="idle-ui-bosswinrate"></span>
                            </p>
                          </div>
                        </div>
                        <div class="panel-header state">
                          <span class="mr-10">战斗日志</span>
                          <label class="normal" style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="idle-ui-only-boss"/> 只看Boss</label>
                        </div>
                        <table class="table table-condensed" style="margin-bottom: 10px;">
                          <thead><tr><td width="120">时间</td><td width="50">结果</td><td width="60">回合数</td><td width="200">敌人</td><td>掉落</td></tr></thead>
                          <tbody id="idle-ui-log-table" class="table-body"></tbody>
                        </table>
                        <div class="row">
                          <div class="col-md-6 col-xs-12" style="text-align: left;">
                            <span>共 <span id="idle-ui-log-length">0</span> 条记录</span>
                          </div>
                          <div class="col-md-6 col-xs-12" style="text-align: right;">
                            <span class="mr-10">第 <span id="idle-ui-page">0</span> 页，共 <span id="idle-ui-max-page">0</span> 页</span>
                          </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row">
                          <div class="col-md-6 col-xs-12" style="text-align: left;">
                            <button type="button" id="clear-log" class="btn btn-danger btn-xs" style="float: left;">清空日志</button>
                            <button type="button" id="idle-ui-reload" class="btn btn-success btn-xs">刷新数据</button>
                          </div>
                          <div class="col-md-6 col-xs-12" style="text-align: right;">
                            <button type="button" id="page-prev" class="btn btn-default btn-xs">上一页</button>
                            <button type="button" id="page-next" class="btn btn-default btn-xs">下一页</button>
                            <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
      $(document.body).append(modal);

      $('#page-prev').click(function () {
        page = page - 1;
        renderRows();
      });

      $('#page-next').click(function () {
        page = page + 1;
        renderRows();
      });

      $('#idle-ui-only-boss').change(function () {
        page = 1;
        getLengthAndMaxPage();
        renderRows();
      });

      $('#clear-log').click(function () {
        clearLog(id)
        location.reload();
      });

      $('#idle-ui-reload').click(function () {
        reloadLog(id);
      });

      $('#idle-ui-maplog').click(function () {
        reloadLog(id);
        $('#modalMapLog').modal('show');
      });
    }

    function initDungeonAutoModal() {
      const $autoReset = $('#autoReset');
      const $maxCount = $("#maxCount");
      const $minSan = $("#minSan");
      const $userNumber = $("#userNumber");
      const $enableDungeonAutoBtn = $('#enableDungeonAutoBtn');
      const $cancelDungeonAutoBtn = $('#cancelDungeonAutoBtn');
      $enableDungeonAutoBtn.css("display", "");
      $cancelDungeonAutoBtn.css("display", "none");

      $("#modalUIAuto").on('show.bs.modal', function (event) {
        if (config.infiniteMap) $autoReset.prop('checked', true);
        $(`#modalUIAuto .idle-ui-hack-type[value=${config.mapHackType}]`).prop('checked', true);
        $maxCount.val(config.failure);
        $minSan.val(config.minSan);
        $userNumber.val(config.userNumber);
      });

      $('#modalUIAuto button.auto-ui-apply').click(function (params) {
        getAutoSetting();
        saveLocalConfig();
        reloadLog(id);
        $enableDungeonAutoBtn.css("display", "none");
        $cancelDungeonAutoBtn.css("display", "");
        startHack(true);
      });

      $cancelDungeonAutoBtn.click(function (params) {
        $enableDungeonAutoBtn.css("display", "");
        $cancelDungeonAutoBtn.css("display", "none");
        hacking = false;
        stopDungeonAuto();
      });

      function getAutoSetting() {
        config.infiniteMap = $autoReset.prop('checked');
        config.mapHackType = $('#modalUIAuto .idle-ui-hack-type:checked').val();
        config.maxCount = $maxCount.val();
        let minSan = $minSan.val()
        config.minSan = minSan ? minSan >= 4 ? minSan : 4 : 4;
        config.userNumber = $userNumber.val() ? $userNumber.val() : 1;
      }
    }

    let failedBlocks = localStorage.getItem(`idle-ui-dungeon-auto-fail-blocks-${id}`);
    failedBlocks = failedBlocks ? JSON.parse(failedBlocks) : [];

    // 是否出现验证码提示
    if ($("[role='dialog'][data-code='True']").length) {
      // 提示验证码 停止自动秘境
      endMove("验证码出现");
      return;
    }

    if (map) {
      map = JSON.parse(map);

      if (map[id] && map[id] === 'start') {
        const $enableDungeonAutoBtn = $('#enableDungeonAutoBtn');
        const $cancelDungeonAutoBtn = $('#cancelDungeonAutoBtn');
        $enableDungeonAutoBtn.css("display", "none");
        $cancelDungeonAutoBtn.css("display", "");
        const bossLeft = $('.panel .panel-body .boss-left').text() - 0;
        const monster = $('.panel .panel-body .monster-left').text() - 0;
        const notExploreBlock = $('.panel .panel-body .not-explore').text() - 0;

        // 只刷Boss
        if (config.mapHackType === 'boss') {
          if (bossLeft === 0) {
            // Boss干掉了
            autoHint();
          } else {
            // Boss还存活
            startHack();
          }
        } else if (config.mapHackType === 'all') {
          if (bossLeft === 0 && monster === 0 && notExploreBlock === 0) {
            autoHint();
          } else {
            startHack();
          }
        }
      }
    } else {
      map = {};
      map[id] = 'end';
    }

    function autoHint() {
      if (config.infiniteMap) {
        new Notification('秘境扫荡完毕，3s后自动重新扫荡');
        setTimeout(() => {
          tryReset();
        }, 3000);
      } else {
        new Notification('秘境扫荡完毕');
        map = {};
        map[id] = 'end';
      }
    }

    function tryReset() {
      const stoneLeft = $('.panel-heading .state').text();
      if (stoneLeft > config.minSan) {
        localStorage.setItem(`idle-ui-dungeon-auto-fail-blocks-${id}`, '[]');
        $("form").attr("action", "DungeonRefresh");
        $("form").trigger("submit");
      } else {
        endMove('SAN已达到最低要求');
      }
    }

    function startHack(fromClick) {
      if (hacking) return;
      hacking = true;
      if (!map[id] && typeof map == 'string') {
        map = JSON.parse(map);
      }
      map[id] = 'start';
      localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      if (fromClick) {
        localStorage.removeItem(`idle-ui-dungeon-auto-enemy-blocks-${id}`);
        localStorage.removeItem(`idle-ui-dungeon-auto-can-explore-blocks-${id}`);
        localStorage.setItem(`idle-ui-dungeon-auto-fail-blocks-${id}`, "[]");
        localStorage.setItem(`idle-ui-dungeon-auto-failure-${id}`, 0);
      }
      mapMove();
    }

    function mapMove() {
      if (map[id] != 'start') return;
      const bossLeft = $('.panel .panel-body .boss-left').text() - 0;
      const monster = $('.panel .panel-body .monster-left').text() - 0;
      const notExploreBlock = $('.panel .panel-body .not-explore').text() - 0;

      // 只刷Boss
      if (config.mapHackType === 'boss') {
        if (bossLeft === 0) {
          // Boss干掉了
          autoHint();
          return;
        }
      } else if (config.mapHackType === 'all') {
        if (bossLeft === 0 && monster === 0 && notExploreBlock === 0) {
          autoHint();
          return;
        }
      }

      // 有boss先打boss
      const bossBlock = $('.boss').eq(0);
      if (bossBlock.length && !bossBlock.hasClass('mask')) {
        clickBlock(bossBlock);
        return;
      }

      let enemyBlocks = []; // 有敌人的可行区块
      let canExploreBlocks = []; // 可探索临近迷雾的区块
      let canExploreEnemyBlocks = [];
      let notExploreEnemyBlocks = [];

      createArr.duff((item, index) => {
        const block = $(`#${index}`);
        if (block.hasClass('monster') && canExplore(index)) {
          canExploreEnemyBlocks.push(index);
        } else if (block.hasClass('monster') && !canExplore(index)) {
          notExploreEnemyBlocks.push(index)
        } else if (block.hasClass('current')) {
        } else if (canExplore(index)) {
          canExploreBlocks.push(index);
        }
      })

      enemyBlocks = [...canExploreEnemyBlocks, ...notExploreEnemyBlocks];
      if (canExploreBlocks.length > 0) {
        clickBlock($(`#${canExploreBlocks.shift()}`));
        localStorage.setItem(`idle-ui-dungeon-auto-can-explore-blocks-${id}`, JSON.stringify(canExploreBlocks));
        return;
      }


      // 下一个怪
      let nextBlockIndex = null;

      if (config.mapHackType === 'boss')
        enemyBlocks.duff((item, index) => {
          if (failedBlocks.indexOf(item) === -1) {
            clickBlock($(`#${item}`));
          }
        })

      if (nextBlockIndex === null && enemyBlocks.length > 0) {
        nextBlockIndex = enemyBlocks[0];
        localStorage.setItem(`idle-ui-dungeon-auto-fail-blocks-${id}`, '[]');
        if (failedBlocks.length > 0) {
          let number = parseInt(localStorage.getItem(`idle-ui-dungeon-auto-failure-${id}`));
          let failure = (isNaN(number) ? 0 : number) + 1;
          localStorage.setItem(`idle-ui-dungeon-auto-failure-${id}`, failure);
          if ((failure % 3) === 0) {
            if (failure > 1) new Notification('第' + failure + '轮战斗失败');
          }
          if (failure > config.failure) {
            hacking = false;
            stopDungeonAuto();
          }
        }
        clickBlock($(`#${nextBlockIndex}`));
        return;
      }

      if (nextBlockIndex !== null) {
        clickBlock($(`#${nextBlockIndex}`));
        localStorage.setItem(`idle-ui-dungeon-auto-enemy-blocks-${id}`, JSON.stringify(enemyBlocks.filter(element => element != nextBlockIndex)));
      } else {
        autoHint();
      }
    }

    function clickBlock(block) {
      const width = block.width();
      const height = block.height();
      const rect = document.getElementById(block.attr('id')).getBoundingClientRect();
      const x = Math.round(rect.left + width / 3 + (width / 4 * Math.random(id))) + $(window).scrollLeft();
      const y = Math.round(rect.top + height / 3 + (height / 4 * Math.random(id))) + $(window).scrollTop();
      ajaxMove(block, { pageX: x, pageY: y, originalEvent: { isTrusted: true } });
    }

    function ajaxMove(block, a) {
      const f = block;
      var c = f.parent();
      const g = f.attr("id");
      const k = $("#cid").val();
      const td = localStorage.getItem("t");
      if (f.hasClass("monster")) {
        // location.href = "/Battle/InDungeon?id=" + k + "&bid=" + g;
        requestCheckInterval(() => {
          $.get("/Battle/InDungeon?id=" + k + "&bid=" + g, function (val) {
            let $val = $(val);
            let waitTime = $val.text().match(/waitTime:(\d+)/);
            if (waitTime) {
              waitTime = parseInt(waitTime[1]);
            }
            if (waitTime) {
              setTimeout(() => {
                refreshMap();
              }, (waitTime + 1) * 1000);
            } else {
              endFight(g, $val);
            }
          });
        });
      } else {
        $(".dungeon-layer").show();
        var e = [];
        if (0 < a.pageX && 0 < a.pageY && a.hasOwnProperty("originalEvent") && (a.originalEvent.isTrusted || 1 == a.originalEvent.detail)) {
          e = $(c).offset();
          const h = $(c).width();
          c = $(c).height();
          const l = Math.floor(Math.random() * h);
          e = [a.pageX, l, a.pageY, e.left, h - l, e.top, h, Math.floor(Math.random() * c), c]
        }
        a = {
          id: k,
          bid: g,
          m: e,
          t: td,
          __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
        };

        requestCheckInterval(() => {
          $.ajax({
            url: "MoveTo",
            type: "post",
            data: a,
            dataType: "json",
            success: function (a) {
              $.each(a, function (a, b) {
                void 0 == b.id && (b.id = 0);
                a = "";
                0 == b.d[0] && (a += " top");
                0 == b.d[1] && (a += " left");
                if (1 == b.m)
                  $("#" + b.id).addClass(a);
                else {
                  a += " public";
                  var c = "";
                  0 < b.mlvl && (c += "Lv" + b.mlvl + " " + b.mname, a = a + " monster " + b.mtype);
                  $("#" + b.id).removeClass("mask").addClass(a);
                  "" != c && $("#" + b.id).attr("title", c)
                }
              });
              0 < a.length && ($("#explore").text(parseInt($("#explore").text()) + a.length),
                $("#not-explore").text(parseInt($("#not-explore").text()) - a.length));
              $(".current").removeClass("current");
              f.addClass("current");
              $(".dungeon-layer").hide();
              requestCheckInterval(() => {
                mapMove();
              });
            },
            error: function (XMLHttpRequest) {
              const responseText = XMLHttpRequest.responseText;
              if (responseText.indexOf('封号') >= 0) {
                addBlockNum();
                requestCheckInterval(() => {
                  mapMove();
                });
              }
              $(".dungeon-layer").hide();
            }
          });
        });
      }
    }

    function requestCheckInterval(callback) {
      if (map[id] != 'start') return;
      let dungeonAutoRequestTime = localStorage.getItem("idle-ui-dungeon-auto-request-time");
      if (dungeonAutoRequestTime) {
        let startTime = new Date(dungeonAutoRequestTime);
        let usedTime = new Date() - startTime;
        if (usedTime < 1000) {
          setTimeout(() => {
            requestCheckInterval(callback);
          }, Math.random() * (3000 - 2000) + 2000 + usedTime);
          return;
        }
      }
      localStorage.setItem("idle-ui-dungeon-auto-request-time", new Date());
      callback();
    }

    function refreshMap() {
      requestCheckInterval(() => {
        $.get(`/Map/Dungeon?id=${id}`, function (val) {
          const $val = $(val);
          createArr.duff((item, index) => {
            let newBlock = $val.find(`#${index}`);
            let block = $(`#${index}`);
            if (block.prop('class') != newBlock.prop('class'))
              block.replaceWith(newBlock);
          })
          mapMove();
        })
      });
    }

    function endMove(notice, retry, reset) {
      if (!reset) {
        map[id] = 'end';
        localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      }

      if (notice) new Notification(notice);

      if (retry) {
        // 请求异常情况直接刷新界面,暂时注释原来逻辑
        $('#modalAlert').modal('hide');
        setTimeout(function () {
          const userId = $("#cid").val();
          location.href = `/Map/Dungeon?id=${userId}`
        }, Math.round(1000));
      } else if (reset) {
        tryReset();
      }
    }

    // 判断是否可以点击
    function canExplore(i) {
      const size = 20;
      const block = $(`#${i}`);
      if (block.hasClass('public')) {
        const left = i % size === 0 ? null : $(`#${i - 1}`);
        const right = i % size === (size - 1) ? null : $(`#${i + 1}`);
        const up = i < size ? null : $(`#${i - size}`);
        const down = i >= ((size * size) - size) ? null : $(`#${i + size}`);
        const canMoveLeft = left && left.hasClass('mask') && !block.hasClass('left');
        const canMoveRight = right && right.hasClass('mask') && !right.hasClass('left');
        const canMoveUp = up && up.hasClass('mask') && !block.hasClass('top');
        const canMoveDown = down && down.hasClass('mask') && !down.hasClass('top');
        return canMoveLeft || canMoveRight || canMoveUp || canMoveDown;
      }
      return false
    }

    function endFight(bid, $this) {
      let $turn = $this.find('.turn')
      const win = $turn.first().text().indexOf('战斗胜利') > 0;
      const turns = $turn.length - 1;
      let enemys = {};
      $this.find('.battle-char').each(function () {
        const monster_id = $(this).prop('id').split('_')[1];
        if (monster_id < 0) {
          const type = $(this).children().first().children().last().prop('class');
          if (enemys[type]) {
            enemys[type] += 1;
          } else {
            enemys[type] = 1;
          }
        }
      });
      let drops = [];
      $turn.first().find('.equip-name').each(function () {
        const type = $(this).clone().prop('class').replace('equip-name', '').trim();
        const name = $(this).text();
        drops.push({ type: type, name: name });
      });
      const isBoss = $('.boss').length > 0;
      const battleLog = { time: +new Date(), win, boss: isBoss, turns, enemys, drops };
      addBattleLog(battleLog);

      const bossWin = isBoss && win;
      if (!win) {
        let failedBlocks = localStorage.getItem(`idle-ui-dungeon-auto-fail-blocks-${id}`);
        failedBlocks = failedBlocks ? JSON.parse(failedBlocks) : [];
        if (failedBlocks.indexOf(bid) === -1) failedBlocks.push(bid);
        localStorage.setItem(`idle-ui-dungeon-auto-fail-blocks-${id}`, JSON.stringify(failedBlocks));
      } else {
        localStorage.setItem(`idle-ui-dungeon-auto-failure-${id}`, '0');
        localStorage.setItem(`idle-ui-dungeon-auto-fail-blocks-${id}`, '[]');
      }
      let timeout = 5;
      if (turns < 50) {
        timeout = 3
      } else if (turns < 100) {
        timeout = 7;
      } else if (turns < 200) {
        timeout = 10;
      }
      setTimeout(() => {
        refreshMap();
      }, timeout * 1000);
    }

    function addBattleLog(battleLog) {
      let log = localStorage.getItem('idle-ui-maplog');
      log = log ? JSON.parse(log) : {};
      if (!log[id]) log[id] = [];
      log[id].unshift(battleLog);
      log[id] = log[id].slice(0, 500);
      localStorage.setItem('idle-ui-maplog', JSON.stringify(log));
    }

    function stopDungeonAuto() {
      map[id] = 'end';
      localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      alert('自动秘境已停止', () => { });
    }

    function clearLog() {
      log[id] = [];
      localStorage.setItem('idle-ui-maplog', JSON.stringify(log));
    }

    function reloadLog() {
      log = localStorage.getItem('idle-ui-maplog');
      log = log ? JSON.parse(log) : {};
      dataSource = log[id] || [];
      getLengthAndMaxPage();
      const stats = getBattleLogStats(dataSource);
      $('#idle-ui-creepnum').text(stats.creepNum);
      $('#idle-ui-avgcreepturns').text(stats.avgCreepTurns);
      $('#idle-ui-creepwinrate').text(`${stats.creepWinRate}%`);
      $('#idle-ui-bossnum').text(stats.bossNum);
      $('#idle-ui-avgbossturns').text(stats.avgBossTurns);
      $('#idle-ui-bosswinrate').text(`${stats.bossWinRate}%`);
      page = 1;
      renderRows();
    }

    function renderRows() {
      const start = (page - 1) * pageSize;
      let data = [];
      if ($('#idle-ui-only-boss').prop('checked')) {
        data = dataSource.filter(item => item.boss).slice(start, start + pageSize);
      } else {
        data = dataSource.slice(start, start + pageSize);
      }
      const rows = data.map(item => {
        const date = moment(item.time).format('MM-DD HH:mm:ss');
        const result = item.win ? '<span class="poison">胜利</span>' : '<span class="fire">失败</span>';
        const enemys = Object.keys(item.enemys).map(type => {
          const count = item.enemys[type];
          return `<span class="${type}">${enemyTypes[type.split(" ")[1]]}</span><span class="normal mr-10"> x ${count}</span>`;
        }).join('');
        const drops = item.drops.map(item => {
          return `<span class="${item.type}">${item.name}</span>`;
        }).join('');
        return `<tr><td>${date}</td><td>${result}</td><td>${item.turns}</td><td>${enemys}</td><td>${drops}</td></tr>`;
      }).join('');
      $('#idle-ui-log-table').html(rows);
      if (page === 1) {
        $('#page-prev').prop('disabled', true);
      } else {
        $('#page-prev').prop('disabled', false);
      }
      if (page === maxPage) {
        $('#page-next').prop('disabled', true);
      } else {
        $('#page-next').prop('disabled', false);
      }
      $('#idle-ui-log-length').text(logLength);
      $('#idle-ui-max-page').text(maxPage);
      $('#idle-ui-page').text(page);
    }
  }

  const pageSize = 10;
  let dataSource = [];
  let maxPage = 0;
  const enemyTypes = { 'normal': '普通', 'rare': '稀有', 'super': '精英', 'boss': 'Boss' };

  function getLengthAndMaxPage() {
    const checked = $('#idle-ui-only-boss').prop('checked');
    logLength = checked ? dataSource.filter(item => item.boss).length : dataSource.length;
    maxPage = Math.ceil(logLength / pageSize);
  }

  function getBattleLogStats(battleLog) {
    let creepNum = 0;
    let bossNum = 0;
    let creepWin = 0;
    let bossWin = 0;
    let creepTurns = 0;
    let bossTurns = 0;
    battleLog.forEach(item => {
      if (item.boss) {
        bossNum += 1;
        if (item.win) bossWin += 1;
        bossTurns += item.turns;
      } else {
        creepNum += 1;
        if (item.win) creepWin += 1;
        creepTurns += item.turns;
      }
    });
    const avgCreepTurns = creepNum > 0 ? Math.round(creepTurns / creepNum) : 0;
    const avgBossTurns = bossNum > 0 ? Math.round(bossTurns / bossNum) : 0;
    const creepWinRate = creepNum > 0 ? Math.round(creepWin / creepNum * 100) : 0;
    const bossWinRate = bossNum > 0 ? Math.round(bossWin / bossNum * 100) : 0;
    return { creepNum, bossNum, avgCreepTurns, avgBossTurns, creepWinRate, bossWinRate }
  }

  if (config.showSetAttr && location.href.indexOf('Auction/Query') < 0) {
    loadSetAttr();

    function loadSetAttr() {
      if (!$('.equip-content > .equip > .set').length) return;
      const setDB = localStorage.getItem('idle-ui-set-db');
      const newSetDB = localStorage.getItem('idle-ui-set-db-new');
      if (setDB && newSetDB) {
        const JSONSetDB = JSON.parse(setDB);
        const JSONNewSetDB = JSON.parse(newSetDB);
        $('.equip-content > .equip > .set').each(function () {
          const content = $(this).parent();
          const itemName = content.children().first().text().replace(/\(\d+\)/g, '');
          const singleData = JSONSetDB.singleData[itemName];
          const existSingLeNum = content.children('.set').length - 1;
          if (singleData && singleData.length > existSingLeNum) {
            const singleContent = singleData.slice(existSingLeNum).map(item => {
              return `<p class="set idle-ui-set-single">${item}</p>`;
            }).join('');
            content.children('.unique').before(singleContent);
          }
          const fullContent = content.children('.unique');
          const existFullNum = fullContent.children('p[class!="set"][class!="require"]').length - 1;
          const setName = fullContent.children('br').last().next().text().replace(/\(\d+\)/g, '');
          var fullData = JSONSetDB.setData[setName];
          if (!fullData) {
            fullData = JSONNewSetDB.setData[setName];
          }
          let setContent = fullData.slice(existFullNum).map(item => {
            return `<p class="idle-ui-set-full">${item}</p>`;
          }).join('');
          if (fullContent.children('br').length === 1) setContent = '<br>' + setContent;
          fullContent.children('br').last().before(setContent);
        });
      } else {
        $.get('/Help/Set', function (html) {
          const parsedsetDB = parseSetHtml(html);
          localStorage.setItem('idle-ui-set-db', JSON.stringify(parsedsetDB));
          loadSetAttr();
        });
        $.get('/Help/Sacred', function (html) {
          const parsedsetDB = parseSetHtml(html);
          localStorage.setItem('idle-ui-set-db-new', JSON.stringify(parsedsetDB));
          loadSetAttr();
        });
      }
    }

    function parseSetHtml(html) {
      $(".footer").before(`<div style="display: none;" id="set-data">${html}</div>`);
      const singleData = {};
      const setData = {};
      $('#set-data .masonry-item .panel-body .equip').each(function () {
        const lines = $(this).children();
        const itemName = lines.first().text().replace(/\(\d+\)/, '');
        const singleLines = [];
        lines.each(function (index) {
          const line = $(this);
          if (index > 0 && line.hasClass('set')) {
            singleLines.push(line.text().replace(/\n/g, ''));
          }
          if (line.hasClass('unique')) {
            const setItems = line.children();
            let stop = false;
            const setLines = [];
            let setName = '';
            setItems.each(function (index) {
              if (index > 0) {
                if ($(this).prop('tagName').toLowerCase() === 'br') {
                  stop = true;
                  setName = $(this).next().text();
                }
                if (!stop) setLines.push($(this).text().replace(/\n/g, ''));
              }
            });
            if (!setData[setName]) setData[setName] = setLines;
          }
        });
        if (singleLines.length) singleData[itemName] = singleLines;
      });
      return { singleData, setData };
    }
  }


  if (config.oneKeyEquip && location.href.indexOf('Equipment/Query') >= 0) {
    const cname = '<input  style="height: 22px;background: black; border: solid 1px #322a20; width: 180px; text-indent: 3px" class="move-name" placeholder="转移ID"/>';
    const startMetastasis = '<button class="btn btn-xs btn-default" id="start-metastasis">一键转移</button>';
    const stopMetastasis = '<button class="btn btn-xs btn-default" id="end-metastasis">停止转移</button>';

    $('.panel-heading .btn').eq(0).before(cname);
    let map = localStorage.getItem('idle-ui-maphack');
    if (map) {
      map = JSON.parse(map);
    } else {
      map = {};
    }
    const cid = $("#cid").val();
    var mysteryIndex = 5;

    // 是否一键转移
    const metastasis = map[`metastasis${cid}`];
    // 要转移人的姓名
    const name = map[`cname${cid}`];

    if (name) {
      $('.move-name').val(name);
    }
    if ((metastasis) && metastasis === 'start') {
      $('.panel-heading .btn').eq(0).before(stopMetastasis);
      mysteryIndex = 6;
    }

    $('.panel-heading .btn').eq(0).before(startMetastasis);
    $('#start-metastasis').click(function (params) {
      map[`metastasis${cid}`] = 'start';
      map[`cname${cid}`] = $('.move-name').val();
      localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      moveMystery();
    });

    function moveMystery() {
      const mysteryId = $(".selected").children(":first").next().next().next().data('id');
      if (!mysteryId) {
        map[`metastasis${cid}`] = 'end';
        localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
        alert('没有物品被选中,已停止');
        return;
      }
      a = {
        cid: cid,
        eid: mysteryId,
        cname: map[`cname${cid}`],
        __RequestVerificationToken: $("[name='__RequestVerificationToken']").val(),
      };

      $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "html",//预期服务器返回的数据类型
        url: 'EquipTrade',//url
        data: a,
        success: function (result) {
          location.reload()
        },
        error: function (result) {
          alert(result)
        }
      });
    }

    if (metastasis && metastasis === 'start') {
      setTimeout(() => {
        if ((metastasis) && metastasis === 'start') {
          moveMystery()
        }
      }, config.moveTime);
    }
  }

  if (location.href.indexOf('Equipment/Query') >= 0) {
    let $filter_container = $('.col-md-12 .panel .panel-heading .pull-right');
    $filter = [];
    ['bag', 'box'].forEach(element => {
      $filter.push({
        id: element, value: $(`
      <div class="btn-group">
        <button id="${element + "-filter"}" type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">排序顺序 <span class="caret"></span></button>
        <ul class="dropdown-menu">
          <li><a class="physical" data-sort="abc">字母排序</a></li>
          ${config.showEquipInfo ? '<li><a class="physical" data-sort="level">掉落等级</a></li>' : ''}
        </ul>
      </div>`)
      })
    })
    for (let i = 0; i < 2; i++) {
      let item = $filter[i];
      $filter_container[i + 1].append(item.value[0]);

      item.value.first().on('click', 'li a', function () {
        let $value = $(this);
        let text = $(this).text();
        let filter = $(`#${item.id + "-filter"}`);
        filter[0].innerHTML = `${text} <span class="caret"></span>`
        if ($value.data().sort == "abc") {
          let $parent = $(`.equip-${item.id}`);
          let $list = $(`.equip-${item.id} .equip-container`).get();
          let resultArray = $list.sort(
            function compareFunction(param1, param2) {
              return $(param1).find(".equip-name span")[1].innerText.localeCompare($(param2).find(".equip-name span")[1].innerText, "zh");
            }
          );

          resultArray.duff((item, index) => {
            $parent.append(item);
          })
        } else if ($value.data().sort == "level") {
          let $parent = $(`.equip-${item.id}`);
          let $list = $(`.equip-${item.id} .equip-container`).get();
          let resultArray = $list.sort(
            function compareFunction(param1, param2) {
              let $param1 = $(param1).find(".equip-info");
              let $param2 = $(param2).find(".equip-info");
              let p1 = parseInt($param1[0].innerText.match(/Lv(\d+)/)[1]);
              let p2 = parseInt($param2[0].innerText.match(/Lv(\d+)/)[1]);
              return p2 - p1;
            }
          );

          resultArray.duff((item, index) => {
            $parent.append(item);
          })
        }
      })
    }
  }

  if (config.oneKeyAgree && location.href.indexOf('Notice/Query') >= 0) {
    let map = localStorage.getItem('idle-ui-maphack');
    if (map) {
      map = JSON.parse(map);
    } else {
      map = {};
    }
    // 所有消息的数量
    const allCount = $('.badge').eq(0).text();

    let processing = false;
    const agreeList = [];
    $('.notice-yes').each(function () {
      agreeList.push($(this).data('id'));
    });

    function doAgree(index) {
      if (blockData.num >= 9) {
        alert('封号打击次数过多,禁止一键同意');
        location.reload();
      }
      if (index > agreeList.length - 1) {
        $('#processing').hide();
        processing = false;

        if (map[`agree${cid}`] && map[`agree${cid}`] === 'start' && allCount > 0) {
          // 获得当前页面的第几页数据,然后+1
          var number = getUrlParam('pi');
          if (number > 0) {
            number = Number(number) + 1;
          } else {
            number = 1;
          }
          // 跳转到下一页
          location.href = `/Notice/Query?pi=${number}&pi2=0`;
          return;
        } else {
          map[`agree${cid}`] = 'end';
          localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
          location.reload();
          return;
        }
      }
      const id = agreeList[index];
      const list = $('#form').serializeArray();
      const params = {
        contentType: false,
        processData: false,
      };
      list.forEach(item => {
        params[item.name] = item.value;
      });
      params.nid = id;
      $.post('/Notice/NoticeYes', params, function () {
        setTimeout(function () {
          location.reload();
        }, config.agreedTime);
      }).fail(function (data) {
        alert("发生异常");
        setTimeout(function () {
          location.reload();
        }, config.agreedTime);
      });
    }

    function getUrlParam(paraName) {
      const url = document.location.toString();
      const arrObj = url.split("?");

      if (arrObj.length > 1) {
        const arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split("=");
          if (arr != null && arr[0] == paraName) {
            return arr[1];
          }
        }
        return "";
      }
      else {
        return "";
      }
    }

    const def = $('a.btn.btn-xs.btn-default');
    let all = renderProcessing();
    all += renderButton('idle-ui-agree-all', '同意所有');
    def.eq(0).before(all);
    $('#idle-ui-agree-all').click(function () {
      // 终止转移
      map[`agree${cid}`] = 'start';
      localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      agreeMessage();
    });

    if (map[`agree${cid}`] && map[`agree${cid}`] === 'start') {
      let stop = renderProcessing();
      stop += renderButton('idle-ui-agree-stop', '停止同意');
      def.eq(0).before(stop);

      $('#idle-ui-agree-stop').click(function () {
        // 终止转移
        map[`agree${cid}`] = 'stop';
        localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
        location.reload();
      });
      if (allCount > 0) {
        setTimeout(function () {
          agreeMessage();
        }, 500);
      } else {
        // 终止转移
        map[`agree${cid}`] = 'end';
        localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
      }
    }

    function agreeMessage() {
      if (processing) return;
      if (agreeList.length || allCount > 0) {
        $('#processing').show();
        processing = true;
        doAgree(0);
      } else {
        alert('没有可处理的消息');
      }
    }
  }

  if (config.oneKeyRune && location.href.indexOf('Equipment/Material') >= 0) {
    let processing = false;
    const runeList = [];
    $('.artifact.equip-name').each(function () {
      const count = $(this).next().next().text() - 0;
      if (count > 0) {
        const rune = {
          id: $(this).next().next().next().data('id') - 0,
          count: count
        };
        runeList.push(rune);
      }
    });

    $('.equip-name').each(function () {
      const count = $(this).next().next().text() - 0;
      if (count > 0) {
        const rune = {
          id: $(this).next().next().next().data('id') - 0,
          count: count
        };
        runeList.push(rune);
      }
    });

    function doMoveRune(index, cname) {
      if (blockData.num >= 9) {
        alert('封号打击次数过多,禁止一键符文转移');
        location.reload();
      }
      if (index > runeList.length - 1) {
        $('#processing').hide();
        processing = false;
        location.reload();
        return;
      }
      const rune = runeList[index];
      const list = $('#form').serializeArray();
      const params = {};
      list.forEach(item => {
        params[item.name] = item.value;
      });
      params.cname = cname;
      params.count = rune.count;
      params.rune = rune.id;
      $.post('/Equipment/RuneTrade', params, function () {
        setTimeout(function () {
          doMoveRune(index + 1, cname);
        }, 300);
      }).fail(function (data) {
        alert("发生异常，请检查角色名是否正确");
        location.reload();
      });
    }

    $('.btn.btn-xs.btn-default').eq(1).before(renderButton('idle-ui-show-rune', '转移全部符文'));
    $('#idle-ui-show-rune').click(function () {
      $('#modalMoveRune').modal('show');
    });
    const spinner = renderProcessing();
    const modal = `
      <div class="modal fade" id="modalMoveRune" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content model-inverse">
                  <div class="modal-header">
                      <span class="modal-title">转移全部符文</span>
                  </div>
                  <div class="modal-body">
                      <div class="form-group">
                          <label for="charName" class="control-label">交易角色：</label>
                              <input type="text" class="form-control" id="idle-ui-cname" name="charName" placeholder="请输入角色名称">
                      </div>
                  </div>
                  <div class="modal-footer">
                      ${spinner}
                      <button type="button" class="btn btn-primary btn-xs" id="idle-ui-move-rune">提交</button>
                      <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                  </div>
              </div>
          </div>
      </div>
    `;
    $(document.body).append(modal);
    $('#idle-ui-move-rune').click(function () {
      if (processing) return;
      if (runeList.length) {
        const cname = $('#idle-ui-cname').val();
        if (!cname) {
          alert('请输入角色名称');
        } else {
          processing = true;
          $('#processing').show();
          doMoveRune(0, cname);
        }
      } else {
        alert('没有转移的符文');
      }
    });
  }

  if (config.showRuneTip) {
    let runeList = [];
    const runeData = localStorage.getItem('idle-ui-rune-db');
    if (runeData) {
      runeList = JSON.parse(runeData);
    } else {
      fetchRuneTip();
    }

    if (location.href.indexOf('Equipment/Inlay') >= 0) {
      const footer = `
        <div class="panel-footer">
            <input class="panel-filter hidden-xs filter-input" id="panel-filter-runeword" placeholder="搜索符文之语">
            <span id="runeword-content"></span>
        </div>
      `;
      $('.panel').eq(0).append(footer);
      let timer = null;
      $('#panel-filter-runeword').keyup(function () {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          const name = $(this).val();
          const filtered = name ? runeList.filter(item => item.name.indexOf(name) >= 0) : [];
          let ret = '';
          if (filtered.length) {
            const item = filtered[0];
            const recipe = item.recipe.map(item => {
              return `<span class="artifact">${item}</span>`
            }).join(' + ');
            ret = `<span><span class="artifact equip-name">【${item.name}】</span>：<span>${recipe}</span></span>`;
            const requireContent = item.require.map(item => {
              return `<p><span class="equip-label">${item}</span></p>`;
            }).join('');
            const attrContent = item.attr.map(item => {
              return `<p>${item}</p>`;
            }).join('');
            const tip = `<div class="equip-content"><div class="equip"><p class="artifact">${item.name}</p>${requireContent}${attrContent}</div></div>`;
            ret += tip;
          }
          $('#runeword-content').html(ret);
          $.initPopup();
        }, 300);
      });

      $('.equip').eq(0).children().last().prop('id', 'big-slot');

      const link = '<a href="/Help/Content?url=Artifact" target="_blank" class="btn btn-xs btn-success mr-10">神器列表</a>';
      $('.btn.btn-xs').eq(0).before(link);
    }

    if (location.href.indexOf('Help/Content?url=Artifact') >= 0) {
      const filter = '<div class="container" style="margin-bottom: 20px;"><input class="form-control" id="panel-filter" placeholder="输入神器名称或符文序号" /></div>';
      $('.navbar').next().after(filter);
      let timer = null;
      $('#panel-filter').keyup(function () {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          const val = $(this).val();
          if (val) {
            if (/^\d+$/.test(val)) {
              $('tbody tr').each(function (i) {
                const recipe = [];
                $(this).children().eq(1).find('.artifact.equip-name').each(function () {
                  recipe.push($(this).text().match(/\d+/g)[0]);
                });
                if (recipe.indexOf(val) >= 0) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            } else {
              $('tbody tr').each(function (i) {
                const name = $(this).children().last().find('.artifact').text();
                if (name.indexOf(val) >= 0) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            }
          } else {
            $('tbody tr').show();
          }
        }, 300);
      });
    }

    function fetchRuneTip() {
      $.get('/Help/Artifact', function (html) {
        const dom = $.parseHTML(html);
        $(dom).find('tr').each(function (i) {
          if (i > 0) {
            const nameLabel = $(this).children().last().find('.artifact');
            const rune = { name: nameLabel.text(), attr: [], recipe: [], require: [] };
            nameLabel.parent().children().each(function (index) {
              if (index > 0) rune.attr.push($(this).text());
            });
            $(this).children().eq(1).find('.artifact.equip-name').each(function () {
              rune.recipe.push($(this).text());
            });
            $(this).children().eq(0).find('.equip-label').each(function () {
              rune.require.push($(this).text());
            });
            runeList.push(rune);
          }
        });
        localStorage.setItem('idle-ui-rune-db', JSON.stringify(runeList));
      });
    }
  }

  if (config.showBattleDetail && inBattlePage()) {
    const battleResult = {};
    const addedDamageTypes = ['溅射', '触发了技能', '对方受到'];

    function getDamageType(plainText) {
      let ret = -1;
      addedDamageTypes.forEach((item, i) => {
        if (plainText.indexOf(item) >= 0) ret = i;
      });
      return ret;
    }

    $('.turn').each(function (index) {
      if (index > 0) {
        const line = $(this).children().eq(1);
        const hpData = $(this).children().first().data('hp');
        const id = line.children()[0].innerHTML;
        if (!hpData[1]) return;
        const firstTargetId = hpData[1].id;
        const skillLabel = line.children('.skill-name');
        const skill = skillLabel.length ? skillLabel.eq(0).text() : '普通攻击';
        const damageLabel = line.children('.damage');

        let damage = 0;
        let damageDetail = { base: 0 };
        if (firstTargetId < 0) {
          damage = damageLabel.length ? damageLabel.eq(0).text() - 0 : 0;
          damageDetail = { base: damage };
          $(this).children().each(function (i) {
            if (i > 1) {
              const plainText = getPlainText($(this));
              if (getDamageType(plainText) >= 0) {
                const addedDamage = $(this).children('.damage').eq(0).text() - 0;
                const damageType = getDamageType(plainText);
                damage += addedDamage;
                const lastDamage = damageDetail[damageType];
                damageDetail[damageType] = lastDamage ? lastDamage + addedDamage : addedDamage;
              }
            }
          });
        }
        if (!battleResult[id]) battleResult[id] = {};
        if (!battleResult[id][skill]) battleResult[id][skill] = {
          turn: 0,
          damage: 0,
          damageDetail: {}
        };

        const skillData = battleResult[id][skill];
        skillData.turn += 1;
        skillData.damage += damage;
        Object.keys(damageDetail).forEach(type => {
          if (skillData.damageDetail[type]) {
            skillData.damageDetail[type] += damageDetail[type];
          } else {
            skillData.damageDetail[type] = damageDetail[type];
          }
        });
      }
    });

    const totalTurns = $('.turn').length - 1;
    let partyTotalDamage = 0;
    $('.battle-data tbody tr').each(function (index) {
      if (getCharId(index) > 0) {
        const dmg = $(this).children().eq(2).text() - 0;
        partyTotalDamage += dmg;
      }
    });

    $('.battle-data thead td').eq(2).after('<td class="text-center">友方伤害占比</td><td class="text-center">详情</td><td class="text-center">出手次数</td><td class="text-center">出手占比</td><td class="text-center">每回合伤害</td>');
    $('.battle-data tbody tr').each(function (index) {
      const id = getCharId(index);
      const actor = $(this).children().first().text();
      const turns = getActorTurns(actor);
      const turnsPercent = (turns / totalTurns * 100).toFixed(1) - 0;
      const damage = $(this).children().eq(2).text() - 0;
      const damagePercent = id > 0 ? `${(damage / partyTotalDamage * 100).toFixed(1) - 0}%` : '-';
      const avgDamage = turns > 0 ? Math.round(damage / turns) : '-';
      const link = battleResult[actor] ? `<a href="javascript: void(0);" class="link-detail" data-id="${actor}" data-actor="${actor}">查看</a>` : '-';
      const content = `<td class="text-center poison">${damagePercent}</td><td class="text-center">${link}</td><td class="text-center physical ddd">${turns}</td><td class="text-center poison">${turnsPercent}%</td><td class="text-center fire ee">${avgDamage}</td>`;
      $(this).children().eq(2).after(content);
    });

    $('.battle-data').css('overflow', 'auto');

    const modal = `
      <div class="modal fade" id="modalBattleDetail" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content model-inverse">
                  <div class="modal-header">
                      <span class="modal-title"><span id="idle-ui-char"></span> - 伤害详情</span>
                  </div>
                  <div class="modal-body">
                      <table class="table table-condensed">
                        <thead><tr><th class="text-center">技能</th><th class="text-center">总伤害</th><th class="text-center">伤害占比</th><th class="text-center">出手次数</th><th class="text-center">出手占比</th><th class="text-center">每回合伤害</th><th class="text-center">直接伤害</th><th class="text-center">溅射</th><th class="text-center">触发技能</th><th class="text-center">持续伤害及其他</th></tr></thead>
                        <tbody id="idle-ui-battle-rows"></tbody>
                      </table>
                      <ul>
                        <li>直接伤害：技能造成的实际直接伤害</li>
                        <li>溅射：因溅射，对非主目标造成的溅射伤害之和</li>
                        <li>触发技能：【装备自带技能】或【被击中触发】的技能等被触发后造成的伤害</li>
                        <li>持续伤害及其他：技能造成的持续伤害，以及其他伤害  </li>
                      </ul>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                  </div>
              </div>
          </div>
      </div>
    `;

    $(document.body).append(modal);

    $('.link-detail').click(function () {
      const id = $(this).data('id');
      const data = battleResult[id];
      const actor = $(this).data('actor');
      $('#idle-ui-char').text(actor);
      let actorTotalTurns = 0;
      let actorTotalDamage = 0;
      Object.keys(data).forEach(skill => {
        actorTotalTurns += data[skill].turn;
        actorTotalDamage += data[skill].damage;
      });

      const content = Object.keys(data).map(skill => {
        const skillData = data[skill];
        const percent = (skillData.turn / actorTotalTurns * 100).toFixed(1) - 0;
        const damagePercent = (skillData.damage / actorTotalDamage * 100).toFixed(1) - 0;
        const avgDamage = skillData.turn > 0 ? Math.round(skillData.damage / skillData.turn) : '-';
        return `<tr><td class="text-center skill">${skill}</td><td class="text-center fire">${skillData.damage}</td><td class="text-center poison">${damagePercent}%</td><td class="text-center physical">${skillData.turn}</td><td class="text-center poison">${percent}%</td><td class="text-center fire">${avgDamage}</td><td class="text-center fire">${skillData.damageDetail.base}</td><td class="text-center fire">${skillData.damageDetail['0'] || 0}</td><td class="text-center fire">${skillData.damageDetail['1'] || 0}</td><td class="text-center fire">${skillData.damageDetail['2'] || 0}</td></tr>`;
      }).join('');
      $('#idle-ui-battle-rows').html(content);
      $('#modalBattleDetail').modal('show');
    });

    function getCharId(index) {
      const ary = $('.battle-char').eq(index).prop('id').split('_');
      return ary[ary.length - 1];
    }

    function getActorTurns(id) {
      let ret = 0;
      if (battleResult[id]) {
        Object.keys(battleResult[id]).forEach(skill => {
          ret += battleResult[id][skill].turn;
        });
      }
      return ret;
    }

    function getPlainText(element) {
      return element.clone()    //clone the element
        .children() //select all the children
        .remove()   //remove all the children
        .end()  //again go back to selected element
        .text();
    }
  }

  function switchSkin(showRequire) {
    $('.equip-content > .equip').each(function (item) {
      const type = $(this).children().first().attr('class');

      let classLabel = '';
      const requireIndex = $(this).text().indexOf('限');
      if (requireIndex >= 0) {
        const requireClass = $(this).text().substring(requireIndex + 1, requireIndex + 2);
        classLabel = '<span style="color: #a99877" class="mr-10">' + requireClass + '</span>';
      }

      const label = location.href.indexOf('Auction/QueryBid') >= 0 ? $(this).parent().prev().find('.equip-name').first() : $(this).parent().prev().find('.equip-name').last();
      if (classLabel) {
        showRequire ? label.after(classLabel) : label.next().remove();
      }
    });
  }

  function inBattlePage() {
    const battePages = ['Battle/Simulate', 'Battle/InDungeon', 'Battle/WithChar'];
    return battePages.some(path => location.href.indexOf(path) >= 0);
  }

  function renderProcessing() {
    return '<span id="processing" class="mr-10" style="display:none;"><i class="glyphicon glyphicon-refresh"></i> 处理中...</span>';
  }

  function renderButton(id, text, type) {
    if (!type) type = 'success';
    return `<button type="button" class="btn btn-xs btn-${type} mr-10" id="${id}">${text}</button>`;
  }

  let uid = purl().param().id || purl().param().Id;

  let blockMap = localStorage.getItem('idle-ui-block');
  if (blockMap) {
    blockMap = JSON.parse(blockMap);
  } else {
    blockMap = {};
  }
  if (!blockMap[uid]) blockMap[uid] = { num: 0, time: +new Date() };
  let blockData = blockMap[uid];

  if (location.href.indexOf('Character/Detail') >= 0) {
    checkBlockNum();
    $('.col-sm-6 .panel-body').eq(0).children().last().append(`<p>封号打击次数（仅供参考）：<span class="physical">${blockData.num}</span></p>`);
  }

  function addBlockNum() {
    checkBlockNum();
    if (!blockData.num) blockData.num = 0;
    blockData.num += 1;
    blockData.time = +new Date();
    localStorage.setItem('idle-ui-block', JSON.stringify(blockMap));
    new Notification(`当前封号打击为${blockData.num}次，请注意`);
  }

  function checkBlockNum() {
    const curTime = +new Date();
    const hours = Math.floor((curTime - blockData.time) / (3600 * 1000));
    if (hours > 0) {
      blockData.num = blockData.num > hours ? blockData.num - hours : 0;
      blockData.time = blockData.time + (hours * 3600 * 1000);
      localStorage.setItem('idle-ui-block', JSON.stringify(blockMap));
    }
  }
};

window.addEventListener('load', idleInit, false);

const borderColor = '#6f5a40';
GM_addStyle(`
      .panel-top {
        margin-bottom: 20px;
        text-align: center;
      }
      .idle-ui-title {
        font-size: 18px;
        color: #fff;
        margin-bottom: 6px;
      }
      .panel-header {
        margin: 8px 0;
      }
      .panel-textarea {
        background-color: rgba(255,255,255,0.1);
        color: #a99877;
        margin-bottom: 8px;
      }
      .block-visited {
        background-color: #3f51b5 !important;
      }
      .hit-input {
        display: inline-block;
        color: #fff;
        width: 60px;
        padding: 0 8px;
        border-radius: 0;
        background-color: transparent;
      }
      .idle-ui-set-single, .idle-ui-set-full {
        opacity: 0.5;
      }
      .idle-ui-new-item {
        border: 1px dashed #888 !important;
      }
      .mt-10 {
        margin-top: 10px;
      }
      .mr-10 {
        margin-right: 10px;
      }
      .ml-10 {
        margin-left: 3px;
      }
      @-webkit-keyframes rotate {
        from {
          -webkit-transform: rotate(0deg);
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        to {
          -webkit-transform: rotate(360deg);
          -o-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      #processing i {
        animation: rotate 1s ease-in-out infinite;
      }
      .filter-input {
        width: 150px !important;
      }
      #big-slot {
        font-size: 24px;
        margin-top: 10px !important;
        color: #fff;
      }
      #idle-ui-quicksearch {
        position: relative;
        float: left;
        margin-top: 14px;
      }
      #idle-ui-quicksearch > input {
        width: 150px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border-radius: 3px;
      }
    `);

Array.prototype.duff = function (callback) {
  if (!Array.isArray(this)) {
    console.error('must be array');
    return;
  }
  if (this.length == 0)
    return;

  let iteration = Math.ceil(this.length / 8);
  let start = this.length % 8;
  let index = 0;

  do {
    switch (start) {
      case 0: callback(this[index], index++)
      case 7: callback(this[index], index++)
      case 6: callback(this[index], index++)
      case 5: callback(this[index], index++)
      case 4: callback(this[index], index++)
      case 3: callback(this[index], index++)
      case 2: callback(this[index], index++)
      case 1: callback(this[index], index++)
    }
    start = 0;
  } while (--iteration)
}