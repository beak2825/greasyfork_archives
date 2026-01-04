// ==UserScript==
// @name         RF Cerberus网页汉化
// @description  自动汉化RF Cerberus网页
// @author       你给龙打油
// @version      1.4.4
// @match        https://cerberus-games.com*
// @match        https://cerberus-games.com/*
// @match        https://cerberus-games.com/*/
// @grant        none
// @namespace https://greasyfork.org/users/1270377
// @downloadURL https://update.greasyfork.org/scripts/489024/RF%20Cerberus%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/489024/RF%20Cerberus%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //=====================================================================SECTION function====================================================================================================================================================================================
  // Define the ReplaceStrings function
  function ReplaceStrings(className, translations) {
    const elements = document.querySelectorAll("." + className);

    elements.forEach((element) => {
      //console.log("Starting ReplaceStrings function...");
      //console.log("Processing element:", element);

      // Loop through each key-value pair in the translations object
      Object.keys(translations).forEach((key) => {
        // Check if the element's text content includes the current key
        if (element.textContent.includes(key)) {
          //console.log(`Found '${key}' in element. Starting replacement...`);

          // Replace the current key with its corresponding translation
          element.innerHTML = element.innerHTML.replace(new RegExp(key, 'g'), translations[key]);

          //console.log("Replacement complete.");
        }
      });
    });
  }

  function ReplacePlaceholders(className, translations) {
    const container = document.querySelector("." + className);

    if (!container) {
      console.log("Container not found.");
      return; // Exit the function if container is not found
    }

    const inputs = container.querySelectorAll("input");

    // Check if inputs exist and are not empty
    if (inputs && inputs.length > 0) {
      inputs.forEach((input) => {
        Object.keys(translations).forEach((key) => {
          if (input.placeholder.includes(key)) {
            input.placeholder = input.placeholder.replace(key, translations[key]);
          }
        });
      });
    }
    //else {
    //console.log("No input elements found in container.");
    //}
  }

  function ReplaceDroplistStrings(selectName, DroplistTranslations) {
    // Select the dropdown element by name
    const dropdown = document.querySelector(`select[name="${selectName}"]`);

    // Check if dropdown exists
    if (dropdown) {
      // Log starting message
      //console.log(`Replacing strings for dropdown '${selectName}'...`);
      //console.log("Dropdown:", dropdown);

      // Get the option elements
      const options = dropdown.querySelectorAll('option');

      // Loop through each option in the dropdown
      options.forEach(option => {
        // Loop through each key-value pair in the translations object
        Object.keys(DroplistTranslations)
          // Sort keys by length in descending order
          .sort((a, b) => {
            if (a.length !== b.length) {
              return b.length - a.length; // Sort by length if lengths are different
            }
            else {
              return a.localeCompare(b); // Otherwise, sort alphabetically
            }
          })
          .some(key => {
            // Check if the option's text content includes the current key
            if (option.textContent.includes(key)) {
              // Log message for replacement
              //console.log(`Replacing '${key}' in option text...`);
              // Replace the current key with its corresponding translation
              option.textContent = option.textContent.replace(new RegExp(key, 'g'), DroplistTranslations[key]);
              // Log message for replacement complete
              //console.log("Replacement complete.");
              // Return true to break out of the some loop
              return true;
            }
            // Return false to continue to the next key
            return false;
          });
      });
    }
    else {
      // Log message if dropdown is not found
      //console.log(`Dropdown '${selectName}' not found.`);
    }
  }

  // Function to convert Moscow time to Beijing time and update all elements' content
  function convertAndReplaceMoscowTimeWithBeijingTime() {
    // Find all elements with class "returnDate"
    const returnDateElements = document.querySelectorAll('.returnDate');

    // Loop through each element
    returnDateElements.forEach((returnDateElement) => {
      // Extract the datetime string from the element's inner HTML
      const dateTimeString = returnDateElement.innerHTML.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/)[0];

      // Split the datetime string into its components
      const [datePart, timePart] = dateTimeString.split(' ');

      // Split the date part into year, month, and day
      const [day, month, year] = datePart.split('-');

      // Split the time part into hour, minute, and second
      const [hour, minute, second] = timePart.split(':');

      // Create a Date object in Moscow time
      const moscowDate = new Date(year, month - 1, day, hour, minute, second);

      // Get the time zone offset for Moscow time
      const moscowOffset = moscowDate.getTimezoneOffset();

      // Moscow is 3 hours ahead of Greenwich Mean Time (GMT+3)
      // Beijing is 8 hours ahead of Greenwich Mean Time (GMT+8)
      const beijingOffset = (8 - 3) * 60; // Difference in minutes

      // Calculate the time in milliseconds
      const beijingTime = new Date(moscowDate.getTime() + (beijingOffset * 60 * 1000));

      // Convert hours to 12-hour format and determine if it's AM or PM
      let hours = beijingTime.getHours();
      const amOrPm = hours >= 12 ? '下午' : '上午';
      hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

      // Pad single-digit values with leading zeros
      const padZero = (value) => (value < 10 ? '0' + value : value);

      // Format the Beijing time string
      const formattedBeijingTime = `${beijingTime.getFullYear()}年${padZero(beijingTime.getMonth() + 1)}月${padZero(beijingTime.getDate())}日, ${amOrPm} ${padZero(hours)}:${padZero(beijingTime.getMinutes())}:${padZero(beijingTime.getSeconds())}`;

      // Replace the original datetime string in the element's inner HTML with the updated Beijing time string
      returnDateElement.innerHTML = returnDateElement.innerHTML.replace(dateTimeString, formattedBeijingTime);
    });
  }

  //=====================================================================SECTION var====================================================================================================================================================================================
  const url = window.location.href;

  var navigator = {
    'Best Players and Guilds': '排行榜',
    'What\'s new': '最新发布',
    'Language': '语言',
    'Forums': '论坛',
    'Members': '成员',
  }

  var tabPanes = {
    'Create ingame access code': '创建登入码',
    'Password and security': '密码与安全',
    'Account details': '账号详情',
    'Billing history': '账单记录',
    'Premium Expire': '会员到期时间',
    'Your payouts': '提现记录',
    'Linked PC\'s': '已链接的设备',
    'Preferences': '偏好设置',
    'Following': '关注名单',
    'Play Time': '游玩时间',
    'Signature': '签名',
    'Ignoring': '拉黑名单',
    'Messages': '消息',
    'Log out': '登出',
    'minutes': '分钟',
    'Privacy': '隐私设置',
    'minute': '分钟',
    'Coins': '商城点',
    'Apr': '4月',
    'Aug': '8月',
    'Dec': '12月',
    'Feb': '2月',
    'Jan': '1月',
    'Jul': '7月',
    'Jun': '6月',
    'Mar': '3月',
    'May': '5月',
    'Nov': '11月',
    'Oct': '10月',
    'Sep': '9月',
  };

  var block = {
    'Buy Premium': "购买会员",
    'Donations': "赞助",
    'Важно': '重要',
    'Donate': "充值",
    'Payout': "提现",
  }

  var forum_title = {
    'Прокачка Умений Гильдии': '公会技能',
    'Клиентские модификации': '客户端修改',
    'Гильдийный магазин': '公会商店',
    'Межрасовый аукцион': '交易所',
    'Как начать играть': '如何开始游戏',
    'Тех.поддержка': '技术支持',
    'База знаний': '资料库',
    'Описание': '服务器信息',
    'Гильдии': '公会',
    'Новости': '新闻',
    'Правила': '规则',
    'Ивенты': '活动',
    'ОФФтоп': '聊天室',
    'Турнир': '锦标赛',
    'Гайды': '教程',
    'Медиа': '媒体',
    'Рынок': '交易市场',
  }

  var formInfoRow = {
    'Don\'t share and don\'t show you access code with people you don\'t know or don\'t trust': '<br>不要与不认识或不信任的人分享或展示你的登入码',
    'Please confirm that you want to make new access token for account': '确认要为',
    'Sharing your access code = sharing your account.': '<br>分享登入码等于分享账号',
    'to grant access from new PC': '创建登入码',
  }
  var formSubmitRow_controls = {
    'Confirm': '确认',
  }

  var pc_body_content = {
    'Shared Accounts': '共享账号',
    'Last requested': '上次登入',
    'Remove from IP': '被移除的IP',
    'Accessed num': '登入次数',
    'Remove date': '移除日期',
    'Check date': '检测日期',
    'Content IP': '设备IP',
    'Expires': '过期时间',
    'Code': '登入码',
  }

  var AddPrem = {
    'Please select subsription type and then press buy': '先选择时长后再点击购买',
    'Subscription types': '会员时长',
    'Buy Premium': '购买会员',
    'Required': '必选',
  }
  var option_AddPrem = {
    'Select subscription type': '选择会员时长',
    'Premium service': '',
    'Premium Service': '',
    "Day's": '日会员',
    'SHOP': '商城点',
  };

  var categories = {
    'Characters': '角色',
    'History': '记录',
    'Storage': '仓储',
    'Items': '物品',
  }

  var LTRB_button = {
    'to character': '加入背包',
    'Skills': '技能',
    'Force': '能力',
    'Reset': '重置',
    'Info': '详情',
    'BUY': '购买',
  }

  var LBRT_button = {
    'to marketplace': '上架交易所',
    'to Account': '加入账号',
    'Accept': '确认',
    'Search': '搜索',
  }

  var price = {
    'CS': '商城点',
  }

  var upgrade = {
    'No talics upgrades': '无羽石洞',
  }

  var level = {
    'Class points': '熟练度',
    'Quantity': '数量',
    'Level': '等级',
  }

  var ability = {
    'Ignore rate of an opponent s blocking': '无视对方格挡机率',
    'Success rate of shield\'s defense': '格挡几率',
    'Receiving critical attack': '抗暴',
    'Attack delay of launcher': '炮攻击延迟',
    'Duration of force debuff': '减益效果持续时间',
    'Debuff assisting time': '持续损害辅助时间',
    'Delay of force attack': '能力攻击延迟',
    'Critical probability': '暴击',
    'Force Attack Power': '能力攻击',
    'Damage avoidance': '回避',
    'Defense ability': '防御',
    'Level up skills': '技能等级',
    'All resistance': '所有抗性',
    'FP consumption': '蓝量消耗',
    'Accuracy rate': '命中',
    'Damage to HP': '吸血',
    'Moving speed': '移动速度',
    'Force range': '能力射程',
    'All attack': '所有攻击',
    'SP Maximum': '最高黄量SP',
    'Max HP FP': '最高血蓝HP/FP',
    'Max FP': '最高蓝量FP',
    'Max HP': '最高血量HP',
    'Range': '射程',
  };
  var grant = {
    'Exchange': '交易',
    'Bank': '仓库',
    'Drop': '丢弃',
    'Sell': '贩卖',
  }
  var ph_filters = {
    'Item name': '物品名称 (英文)',
    'Max Level': '最高等级',
    'Min Level': '最低等级',
  };

  var option_sort = {
    'Sorting': '排序',
    'Price': '价格',
    'Date': '日期',
  }
  var option_sort2 = {
    'Descending': '降序',
    'Ascending': '升序',
  }
  var option_isActive = {
    'Marketplace': '交易所',
    'Location': '位置',
    'Storage': '仓储'
  }
  var option_type = {
    'Gauntlets': '手套 [Gauntlets]',
    'Item type': '物品类型 [Item type]',
    'Resources': '资源 [Resources]',
    'Booster': '推进器 [Booster]',
    'Amulet': '护身符 [Amulet]',
    'Helmet': '头盔 [Helmet]',
    'Shield': '盾牌 [Shield]',
    'Weapon': '武器 [Weapon]',
    'Force': '能力球 [Force]',
    'Lower': '下装 [Lower]',
    'Shoes': '鞋子 [Shoes]',
    'Upper': '上衣 [Upper]',
    'Ring': '戒指 [Ring]',
  }
  var option_subtype = {
    'Grenade Launcher': '榴弹发射器 [Grenade Launcher]',
    'Weapon type': '物品类型 [Weapon type]',
    'Launcher': '炮 [Launcher]',
    'Throwing': '飞刀 [Throwing]',
    'Firearm': '枪 [Firearm]',
    'Mining': '采矿机 [Mining]',
    'Knife': '刀 [Knife]',
    'Spear': '矛 [Spear]',
    'Staff': '法杖 [Staff]',
    'Sword': '剑 [Sword]',
    'Mace': '锤子 [Mace]',
    'Axe': '斧头 [Axe]',
    'Bow': '弓 [Bow]',
  }

  var option_race = {
    'Bellato\&Cora': '贝尔托\&克拉 [Bellato\&Cora]',
    'Acretia': '阿克雷提亚 [Acretia]',
    'Bellato': '贝尔托 [Bellato]',
    'Cora': '克拉 [Cora]',
    'Race': '种族 [Race]',
    'Any': '任意种族 [Any]',

  };
  var option_grade = {
    'Normal': "白色 [Normal]",
    'Relict': "蓝色 [Relict]",
    'Type A': "紫色 [Type A]",
    'Type B': "黄色 [Type B]",
    'Type C': "橙色 [Type C]",
    'Grade': "物品级别 [Grade]",
    'Hero': "浅蓝 [Hero]",
    'Leon': "里昂 [Leon]",
    'Rare': "粉色 [Rare]",
    'PvP': "PVP武器",
    'Set': "套装 [Set]",

  };
  var option_class = {
    'Launcher': '炮手 [Launcher]',
    'Class': '基础职业 [Class]',
    'Force': '法师 [Force]',
    'Melee': '近战 [Melee]',
    'Range': '远程 [Range]',

  };

  var charClass = {
    'Hiddensoldier': '迷踪兵-Hiddensoldier',
    'Phantomshadow': '幻影神兵-Phantomshadow',
    'Battleleader': '战斗指挥-Battleleader',
    'Blackknights': '黑暗骑士-Blackknights',
    'Shieldmiller': '神盾勇者-Shieldmiller',
    'Spiritualist': '神灵使者-Spiritualist',
    'Infiltrator': '渗透者-Infiltrator',
    'Mentalsmith': '睿智工匠-Mentalsmith',
    'Adventurer': '冒险者-Adventurer',
    'Armorrider': '武装驾驶-Armorrider',
    'Darkpriest': '暗灵祭司-Darkpriest',
    'Holycandra': '神圣斩德拉-Holycandra',
    'Specialist': '专家-Specialist',
    'Assaulter': '强袭战士-Assaulter',
    'Berserker': '狂武者-Berserker',
    'Craftsman': '匠师-Craftsman',
    'Desperado': '暴徒-Desperado',
    'Destroyer': '毁灭者-Destroyer',
    'Mercenary': '超能战士-Mercenary',
    'Scientist': '科学家-Scientist',
    'Assassin': '暗杀者-Assassin',
    'Champion': '斗士-Champion',
    'Commando': '突击队员-Commando',
    'Dementer': '暴走战狂-Dementer',
    'Engineer': '工程师-Engineer',
    'Guardian': '审判骑士-Guardian',
    'Punisher': '制裁者-Punisher',
    'Sentinel': '禁卫军-Sentinel',
    'Summoner': '召唤师-Summoner',
    'Armsman': '武装者-Armsman',
    'Gladius': '神鬼战士-Gladius',
    'Grazier': '幻兽牧者-Grazier',
    'Knights': '骑兵-Knights',
    'Scouter': '侦察员-Scouter',
    'Steeler': '异端杀手-Steeler',
    'Striker': '天威炮将-Striker',
    'Templar': '圣殿骑士-Templar',
    'Warlock': '魔咒师-Warlock',
    'Warrior': '战士-Warrior',
    'Archer': '弓箭手-Archer',
    'Artist': '天艺匠师-Artist',
    'Astral': '灵魂使-Astral',
    'Candra': '斩德拉-Candra',
    'Caster': '暗灵使-Caster',
    'Driver': '战斗驾驶-Driver',
    'Gunner': '砲兵-Gunner',
    'Hunter': '猎杀者-Hunter',
    'Miller': '诱敌者-Miller',
    'Psyper': '操灵师-Psyper',
    'Ranger': '巡察队-Ranger',
    'Sniper': '狙击手-Sniper',
    'Wizard': '巫师-Wizard',
  };


  var ptBlock = {
    'Defence': '防御技能',
    'Shield': '盾牌技能',
    'Melee': '近距离技能',
    'Range': '远距离技能',
    'Gold': '黄金',
    'GP': '黄金点',
    'OC': '贡献',
  }

  var characterCardSpecPt = {
    'Dalants': '种族币',
    'Special': '特殊技能',
  }

  var p_title = {
    'Cashshop Points': '商城点',
    'Characters': '角色',
    'history': '记录',
    'Storage': '仓储',
    'Items': '物品',
  }

  var itemActionType = {
    'Published': '上架',
    'Returned': '入包',
    'Sold': '售出',
    'Buy': '购入',
    'Add': '仓储',
  }

  var storageCardDetails = {
    'At the auction until': '下架时间 (北京时间)',
    'In storage': '还未上架',
  }

  var mobinfo_block = {
    'Avg respawn Interval': '平均刷新时间',
    'Ignore rate of an opponent s blocking': '无视对方格挡机率',
    'Success rate of shield\'s defense': '格挡几率',
    'Receiving critical attack': '抗暴',
    'Attack delay of launcher': '炮攻击延迟',
    'Duration of force debuff': '减益效果持续时间',
    'Debuff assisting time': '持续损害辅助时间',
    'Delay of force attack': '能力攻击延迟',
    'Critical probability': '暴击',
    'Force Attack Power': '能力攻击',
    'Damage avoidance': '回避',
    'Defense ability': '防御',
    'Level up skills': '技能等级',
    'All resistance': '所有抗性',
    'FP consumption': '蓝量消耗',
    'Accuracy rate': '命中',
    'Spawn dummies': '刷怪信息',
    'Damage to HP': '吸血',
    'Moster stats': '怪物信息',
    'Moving speed': '移动速度',
    'Force range': '能力射程',
    'All attack': '所有攻击',
    'Item Class': '职业要求',
    'Item Grade': '物品级别',
    'Item type': '物品类别',
    'Max HP FP': '最高血蓝',
    'Max Level': '最高等级',
    'Min Level': '最低等级',
    'PB status': 'Boss状态',
    'Accuracy': '命中',
    'Champion': '冠军',
    'Monsters': '怪物',
    'Pit Boss': 'Boss',
    'Quantity': '数量',
    'Ability': '能力',
    'Defence': '防御',
    'Seconds': '秒',
    'Chance': '几率',
    'Damage': '伤害',
    'Max FP': '最高蓝量',
    'Max HP': '最高血量',
    'Normal': '普通',
    'Rental': '限时',
    'Search': '搜索',
    'Weapon': '武器',
    'Armor': '防具',
    'Dodge': '回避',
    'Grade': '级别',
    'Items': '物品',
    'Range': '射程',
    'Store': '仓库',
    'Trade': '交易',
    'Code': '代码',
    'Drop': '丢弃',
    'Loot': '掉落',
    'Name': '名称',
    'Race': '种族',
    'Sell': '贩卖',
    'Ace': '王牌',
    'Any': '任意',
    'Map': '地图',
    'HP': '血量',
  }
  var characterSkills = {
    'Close combat': '近战技能',
    'Range combat': '远战技能',
    'Expert': '中级熟练度',
    'Basic': '初级熟练度',
    'Elite': '高级熟练度',
  }
  var characterForce = {
    'Expert': '中级熟练度',
    'Basic': '初级熟练度',
    'Earth': '土属性',
    'Elite': '高级熟练度',
    'Water': '水属性',
    'Dark': '暗属性',
    'Fire': '火属性',
    'Holy': '圣属性',
    'Wind': '风属性',

  }

  var PassSecurity = {
    'For security reasons, you must verify your existing password before you may set a new password.': '出于安全原因，在设置新密码之前，必须先验证现有密码',
    'Email confirmation, Backup codes': '需用邮箱验证',
    'Entering a password is required.': '必填',
    'Logout from all devices': '注销所有设备',
    'Your existing password': '当前密码',
    'Two-step verification': '两步验证',
    'Confirm new password': '确认新密码',
    'New password': '新密码',
    'Disabled': '已关闭',
    'Enabled': '已开启',
  }
  var twostep_label = {
    'Password': '密码',
    'Username': '用户名',
  }
  var twostep_tip = {
    'These codes can be used to log in if you don\'t have access to other verification methods. Keep these codes in a safe and secure place.': '如果您无法使用其他验证方法，可以使用这些代码登录。请将这些代码妥善保管',
    'An email containing a single-use code has been sent to the address linked to this account. Please enter that code to continue.': '一封包含有一次性使用代码的电子邮件已发送至注册此帐户的邮箱, 请输入该代码以继续',
    'This will send a code via email to verify your login. Other two-step verification methods should be chosen over this if possible.': '通过电子邮件发送验证码',
    'This allows you to generate a verification code using an app on your phone.': '允许使用手机上的应用程序生成验证码',
    'To access this page, you must first confirm your password': '要访问此页面，必须先确认密码',
    'Verification code via app': '通过应用程序生成验证码',
    'Email confirmation code': '验证码',
    'Email confirmation': '电子邮件确认',
    'Backup codes': '备份代码',
  }
  var twostep_btn = {
    'Disable two-step verification': '关闭两步验证',
    'Stop trusting this device': '不再信任此设备',
    'Confirm regeneration': '确认重新生成',
    'Confirm': '确认',
    'Disable': '关闭',
    'Change': '更改',
    'Delete': '删除',
    'Enable': '开启',
    'Manage': '管理',
    'Save': '保存',
  }


  //=====================================================================SECTION Main logic====================================================================================================================================================================================
  if (window.location.href.includes("cerberus-games")) {
    // Code specific to cerberus-games
    ReplaceStrings("p-navEl ", navigator);
    // Create a new text node with your desired text
    const textNode = document.createTextNode('by你给龙打油');
    // Create a new <div> element to contain the text
    const textContainer = document.createElement('div');
    textContainer.style.position = 'fixed';
    textContainer.style.bottom = '20px';
    textContainer.style.right = '20px';
    textContainer.style.color = 'rgba(255, 255, 255, 0.3)';
    textContainer.style.fontSize = '18px';
    textContainer.style.fontFamily = 'Arial, sans-serif';
    textContainer.appendChild(textNode);
    document.body.appendChild(textContainer);
  }

  function checkElement() {
    var element = document.querySelector('.listPlain');
    if (element) {
      ReplaceStrings("tabPanes", tabPanes);
      clearInterval(interval);
    }
  }

  // Call the function initially
  checkElement();

  // Set interval to repeatedly check every 1000 milliseconds
  var interval = setInterval(checkElement, 1000);


  switch (true) {
    case url === "https://cerberus-games.com" || url === "https://cerberus-games.com/":
      // Code specific to cerberus-games.com
      ReplaceStrings("node-body", forum_title);
      ReplaceStrings("block", block);
      break;
    case url.startsWith("https://cerberus-games.com/marketplace/items") ||
    url === "https://cerberus-games.com/marketplace" ||
    url === "https://cerberus-games.com/marketplace/":
      // Code specific to marketplace/items
      ReplaceStrings("upgrade", upgrade);
      ReplaceStrings("level", level);
      ReplaceStrings("ability", ability);
      ReplaceStrings("grant", grant);
      // Select all links with the class '.bottom a'
      var links = document.querySelectorAll('.bottom a');

      // Loop through each link
      links.forEach(function (link) {
        // Add event listener for mouseover event
        link.addEventListener('mouseover', function (event) {
          // Create a popup element
          var popup = document.createElement('div');
          popup.className = 'popup';
          popup.textContent = '搜索同款';

          // Position the popup above the link
          var rect = link.getBoundingClientRect();
          popup.style.position = 'fixed';
          popup.style.top = (rect.top + 35) + 'px'; // Adjust as needed
          popup.style.left = (rect.left + 40) + 'px';

          // Add background to the Chinese text
          popup.style.backgroundColor = '#000000'; // Example background color
          popup.style.padding = '10px'; // Adjust padding as needed
          popup.style.borderRadius = '10px'; // Adjust border radius as needed

          // Add the popup to the document body
          document.body.appendChild(popup);
        });

        // Add event listener for mouseout event to remove the popup
        link.addEventListener('mouseout', function () {
          // Remove the popup when the mouse leaves the link
          var popup = document.querySelector('.popup');
          if (popup) {
            popup.parentNode.removeChild(popup);
          }
        });
      });

      break;
    case url.startsWith("https://cerberus-games.com/marketplace/characters/info"):
      // Code specific to marketplace/history
      ReplaceStrings("characterSkills", characterSkills);
      ReplaceStrings("characterForce", characterForce);
      break;
    case url.startsWith("https://cerberus-games.com/marketplace/characters"):
      // Code specific to marketplace/characters
      ReplaceStrings("charClass", charClass);
      ReplaceStrings("ptBlock", ptBlock);
      ReplaceStrings("characterCardSpecPt", characterCardSpecPt);
      // Select all elements with the class '.faIcon.RT-button'
      var buttons = document.querySelectorAll('.faIcon.RT-button');

      // Loop through each button
      buttons.forEach(function (button) {
        // Add event listener for mouseover event
        button.addEventListener('mouseover', function (event) {
          // Create a popup element
          var popup = document.createElement('div');
          popup.className = 'popup';
          popup.textContent = '查看详情';

          // Position the popup above the button
          var rect = button.getBoundingClientRect();
          popup.style.position = 'fixed';
          popup.style.top = (rect.top + 35) + 'px'; // Adjust as needed
          popup.style.left = (rect.left + 40) + 'px';

          // Add background to the Chinese text
          popup.style.backgroundColor = '#000000'; // Example background color
          popup.style.padding = '10px'; // Adjust padding as needed
          popup.style.borderRadius = '10px'; // Adjust border radius as needed

          // Add the popup to the document body
          document.body.appendChild(popup);
        });

        // Add event listener for mouseout event to remove the popup
        button.addEventListener('mouseout', function () {
          // Remove the popup when the mouse leaves the button
          var popup = document.querySelector('.popup');
          if (popup) {
            popup.parentNode.removeChild(popup);
          }
        });
      });
      break;
    case url.startsWith("https://cerberus-games.com/marketplace/storage"):
      // Code specific to marketplace/storage
      ReplaceStrings("charClass", charClass);
      ReplaceStrings("upgrade", upgrade);
      ReplaceStrings("level", level);
      ReplaceStrings("ability", ability);
      ReplaceStrings("grant", grant);
      ReplaceStrings("storageCardDetails", storageCardDetails);
      if (url === "https://cerberus-games.com/marketplace/storage/items" ||
        url === "https://cerberus-games.com/marketplace/storage/items/" ||
        url === "https://cerberus-games.com/marketplace/storage/characters" ||
        url === "https://cerberus-games.com/marketplace/storage/characters/") {
        // Call the function to convert Moscow time to Beijing time and update all elements' content
        convertAndReplaceMoscowTimeWithBeijingTime();
      }
      break;
    case url.startsWith("https://cerberus-games.com/marketplace/history"):
      // Code specific to marketplace/history
      ReplaceStrings("itemActionType", itemActionType);
      ReplaceStrings("upgrade", upgrade);
      break;
    case url.startsWith("https://cerberus-games.com/members/token"):
      // Code specific to members/token
      ReplaceStrings("block-body", formInfoRow);
      ReplaceStrings("formSubmitRow-controls", formSubmitRow_controls);
      break;
    case url.startsWith("https://cerberus-games.com/members/pc"):
      // Code specific to members/pc
      ReplaceStrings("p-body-pageContent", pc_body_content);
      break;
    case url.startsWith("https://cerberus-games.com/members/addprem"):
      // Code specific to members/addprem
      ReplaceStrings("formRow", AddPrem);
      for (let i = 0; i < 3; i++) {
        ReplaceDroplistStrings('prem_id', option_AddPrem);
      }
      break;
    case url.startsWith("https://cerberus-games.com/kb"):
      // Code specific to cerberus-games.com/kb
      ReplaceStrings("block", mobinfo_block);
      break;
    case url.startsWith("https://cerberus-games.com/account/security"):
      // Code specific to cerberus-games.com/account/security
      ReplaceStrings("formRow-label", PassSecurity);
      ReplaceStrings("formRow--button", PassSecurity);
      ReplaceStrings("formRow-explain", PassSecurity);
      ReplaceStrings("meterBarLabel", PassSecurity);
      break;
    case url.startsWith("https://cerberus-games.com/account/two-step"):
      // Code specific to account/two-step
      ReplaceStrings("formRow-label", twostep_label);
      ReplaceStrings("block-row--separated", twostep_tip);
      if (url.startsWith("https://cerberus-games.com/account/two-step/email/enable")) {

        ReplaceStrings("block-body", twostep_tip);

      }
      break;
    default:
      // Default case if none of the above conditions are met
  }

  switch (true) {
    case url.includes("cerberus-games.com/market"):
      // Code specific to cerberus-games
      ReplaceStrings("categories", categories);
      ReplaceStrings("LTRB-button", LTRB_button);
      ReplaceStrings("LBRT-button", LBRT_button);
      ReplacePlaceholders("filters", ph_filters);
      ReplaceDroplistStrings('sort', option_sort);
      ReplaceDroplistStrings('sort', option_sort2);
      ReplaceDroplistStrings('isActive', option_isActive);
      ReplaceDroplistStrings('type', option_type);
      ReplaceDroplistStrings('subtype', option_subtype);
      ReplaceDroplistStrings('race', option_race);
      ReplaceDroplistStrings('grade', option_grade);
      ReplaceDroplistStrings('class', option_class);
      ReplaceStrings("price", price);
      ReplaceStrings("p-title ", p_title);
      break;
    case url.includes("cerberus-games.com/account") ||
    url.includes("cerberus-games.com/members") ||
    url.includes("cerberus-games.com/payout"):
      // Code specific to cerberus-games.com/account
      ReplaceStrings("p-body-sideNavContent", tabPanes);
      ReplaceStrings("button-text", twostep_btn);
      break;
    default:
      // Default case if URL does not match any specific condition
      break;
  }
  //console.clear();
})();