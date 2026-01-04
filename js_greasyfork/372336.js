// ==UserScript==
// @name        tame CivilServant
// @namespace   Vionlentmonkey
// @match       http://2.20.105.80/*
// @version     0.11.0
// @description at the end of with it.
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/372336/tame%20CivilServant.user.js
// @updateURL https://update.greasyfork.org/scripts/372336/tame%20CivilServant.meta.js
// ==/UserScript==

const windowCSS = `
#Cfg {
  height: auto;
  background-color: lightblue;
}
#Cfg .reset_holder {
  float: left;
  position: relative;
  bottom: -1em;
}
#Cfg .saveclose_buttons {
  margin: 1em;
}
`;

/**
 * 打开设置选项
 */
const openCfg = () => {
  // 避免在包含框架的页面打开造成多个设置界面重叠
  if (window.top === window.self) {
    GM_config.open();
  }
};

GM_config.init({
  id: 'Cfg',
  title: '⚙个性化设置⚙',
  fields: {
    default_users: {
      section: ['登录信息', '用户名 自定义帐号 不得均为空。'],
      label: '用户名。此处对应默认密码，一个一行。',
      labelPos: 'left',
      type: 'textarea',
      default: '',
    },
    default_password: {
      label: '默认密码',
      labelPos: 'right',
      type: 'password',
      default: '888888',
    },
    custom_accounts: {
      label: '自定义帐号。以 用户名:密码 的形式保存，如 zs:333 <换行> ml:666，一个一行。',
      labelPos: 'left',
      type: 'textarea',
      default: '',
    },
    auto_logout: {
      label: '自动退出。单帐号可考虑关闭此选项。',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
    signin_end_local: {
      section: [
        '自动签到结束时间设置',
        '服务器时间与本地时间有落差。超出设置时段将不再自动登录，避免一直自动运行干扰其他事项。',
      ],
      label: '结束自动签到本地时间',
      labelPos: 'right',
      type: 'text',
      default: '09:02:00',
    },
    signin_end_server: {
      label: '结束自动签到服务器时间',
      labelPos: 'right',
      type: 'text',
      default: '09:00:59',
    },
    signoff_begin_local: {
      section: ['自动签退开始时间设置', '签退时会同时判断服务器时间和本地时间'],
      label: '开始自动签退本地时间',
      labelPos: 'right',
      type: 'text',
      default: '16:58:00',
    },
    signoff_begin_server: {
      label: '开始自动签退服务器时间',
      labelPos: 'right',
      type: 'text',
      default: '17:00:01',
    },
    debug: {
      section: ['开发者选项', '⚠随意修改，后果自负❗'],
      label: '调试',
      labelPos: 'right',
      type: 'checkbox',
      default: false,
    },
    random_range: {
      label: '签到随机延迟范围(s)。在极值间取一个随机数。数值之间以空格区隔。',
      labelPos: 'right',
      type: 'text',
      default: '0 3',
    },
    protocol: {
      label: '协议',
      labelPos: 'right',
      type: 'text',
      default: 'http:',
    },
    host: {
      label: '域名或IP',
      labelPos: 'right',
      type: 'text',
      default: '2.20.105.80',
    },
    mainpath: {
      label: '路径',
      labelPos: 'right',
      type: 'text',
      default: '/civilservant/manager/',
    },
    loginpath: {
      label: '登录地址',
      labelPos: 'right',
      type: 'text',
      default: 'login.aspx',
    },
    defaultpath: {
      label: '默认界面',
      labelPos: 'right',
      type: 'text',
      default: 'default.aspx',
    },
    logoutpath: {
      label: '退出地址',
      labelPos: 'right',
      type: 'text',
      default: 'loginout.aspx',
    },
  },
  css: windowCSS,
  events: {
    save: () => {
      GM_config.close();
      location.reload(true);
    },
  },
});

/**
 * 创建设置按钮
 * @param {Element} parent_node
 */
const addSettingButton = (parent_node) => {
  setting_button = document.createElement('button');
  setting_button.id = 'setting';
  setting_button.textContent = '⚙个性化设置⚙';
  setting_button.onclick = openCfg;
  parent_node.appendChild(setting_button);
};

// 得出一个延迟随机数
const random_range = GM_config.get('random_range').split(/\s+/).map(Number);
const max = Math.max(...random_range);
const min = Math.min(...random_range);
// 直接以毫秒为单位
const random_wait = 1000 * (Math.random() * (max - min) + min);

const protocol = GM_config.get('protocol');
const host = GM_config.get('host');
const mainpath = GM_config.get('mainpath');
const loginpath = mainpath + GM_config.get('loginpath');
const defaultpath = mainpath + GM_config.get('defaultpath');
const logoutpath = mainpath + GM_config.get('logoutpath');

const now = new Date();
const year = String(now.getFullYear());
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const today = `${year}-${month}-${day}`;

const signin_end_local = GM_config.get('signin_end_local');
const signin_end_server = GM_config.get('signin_end_server');
const today_signin_end_local = `${today}T${signin_end_local}`;
const today_signin_end_server = `${today}T${signin_end_server}`;

const signoff_begin_local = GM_config.get('signoff_begin_local');
const signoff_begin_server = GM_config.get('signoff_begin_server');
const today_signoff_begin_local = `${today}T${signoff_begin_local}`;
const today_signoff_begin_server = `${today}T${signoff_begin_server}`;

const default_users = GM_config.get('default_users').trim();
const default_password = GM_config.get('default_password');
const custom_accounts = GM_config.get('custom_accounts').trim();
const total_users = (default_users + ' ' + custom_accounts).trim().split(/\s+/);
const auto_logout = GM_config.get('auto_logout');

// 执行模式
let purpose;
// 距离签退时间
let deadline = 0;
const inAutoTime = () => {
  if (Date.now() <= Date.parse(`${today}T${signin_end_local}`)) {
    // 签到模式
    purpose = `${today}_signin`;
    return true;
  } else if (Date.now() >= Date.parse(today_signoff_begin_local)) {
    // 签退模式
    purpose = `${today}_signoff`;
    return true;
  } else if (GM_config.get('debug')) {
    // 调试模式
    purpose = `${today}_debug`;
    deadline = Date.parse(today_signoff_begin_local) - Date.now();
    return true;
  } else {
    // 不予执行
    return false;
  }
};

// 登录页面，拼写忽大忽小 http://2.20.105.80/CivilServant/Manager/Login.aspx
if (location.pathname.toLocaleLowerCase().startsWith(loginpath)) {
  // 已 trim() 故可依此判断未输入数据
  if (total_users[0] === '') {
    openCfg();
    return;
  }
  addSettingButton(document.getElementById('UpdatePanel2'));
  console.log(inAutoTime());
  if (!inAutoTime()) return;
  console.log(purpose);
  let tempUsers = JSON.parse(localStorage.getItem(purpose));
  console.log(tempUsers);
  if (tempUsers === null || tempUsers === undefined) {
    localStorage.setItem(purpose, JSON.stringify(total_users));
    // 更新数据
    tempUsers = JSON.parse(localStorage.getItem(purpose));
    console.log(tempUsers);
    location.reload();
  } else if (purpose.endsWith('_debug') && tempUsers.length === 0) {
    console.log(`签退还有${deadline / 1000 / 60 / 60}小时，到时将自动刷新本页面。`);
    setTimeout(() => {
      location.reload();
    }, deadline);
  } else {
    if (tempUsers.length === 0) return;
    const theUser = tempUsers.shift();
    console.log(theUser);
    localStorage.setItem(purpose, JSON.stringify(tempUsers));
    const autoLogin = (theUser) => {
      if (theUser.includes(':')) {
        document.getElementById('LoginName').value = theUser.split(':')[0];
        document.getElementById('LoginPass').value = theUser.split(':')[1];
      } else if (theUser.includes('：')) {
        document.getElementById('LoginName').value = theUser.split('：')[0];
        document.getElementById('LoginPass').value = theUser.split('：')[1];
      } else {
        document.getElementById('LoginName').value = theUser;
        document.getElementById('LoginPass').value = default_password;
      }
      document.getElementById('ImageButton1').click();
    };
    // 签到延迟
    if (purpose.endsWith('_signin') && theUser !== total_users[0]) {
      console.log(random_wait);
      setTimeout(() => {
        autoLogin(theUser);
      }, random_wait);
    } else {
      autoLogin(theUser);
    }
  }
}

// 确认登录 http://2.20.105.80/CivilServant/Manager/Messages.aspx?OPID=24174
if (location.search.startsWith('?OPID=')) {
  document.getElementById('Message_Button0').click();
}

// 自动签到签退退出
if (location.pathname.toLocaleLowerCase().startsWith(defaultpath)) {
  const autoSign = () => {
    const mainFrame = document.getElementById('mainFrame').contentWindow.document;
    // 不跨域
    const ServerTime = mainFrame.getElementById('ServerTime').textContent;
    const now_server_time = `${today}T${ServerTime}`;
    console.log('当前服务器时间为：' + now_server_time);
    // 签到按钮及登记时间
    const loginButton = mainFrame.getElementById('ctl00_PageBody_Button1');
    const loginText = mainFrame.getElementById('ctl00_PageBody_LabelSignFact1').textContent;
    // 签退按钮及登记时间
    const logoutButton = mainFrame.getElementById('ctl00_PageBody_Button2');
    const logoutText = mainFrame.getElementById('ctl00_PageBody_LabelSignFact2').textContent;

    if (Date.parse(now_server_time) <= Date.parse(today_signin_end_server)) {
      console.log(localStorage.getItem(`${today}_signin`));
      // 避免签到完成后不能提前进入工作模式
      if (JSON.parse(localStorage.getItem(`${today}_signin`)).length === 0) return;
      console.log('模拟手动签到');
      loginButton.click();
      // 若无状态判断将会快速跳出而失败
      if (!loginText.includes('正常')) return;
      if (!auto_logout) return;
      location.pathname = logoutpath;
    } else if (Date.parse(now_server_time) > Date.parse(today_signoff_begin_server)) {
      // 显示的服务器时间可能比真实的服务器时间还要快一秒，所以 >= 可能造成提前一秒早退。
      console.log('模拟手动签退');
      logoutButton.click();
      // 若无状态判断将会快速跳出而失败
      if (logoutText.includes('早退')) {
        // 一旦早退需要刷新一次才能实现补签
        location.reload();
      } else if (logoutText.includes('正常')) {
        if (!auto_logout) return;
        // 防止5点以后加班不能
        if (
          // 可能以调试模式进入等待，第一个签退完成后还没有注册签退模式
          localStorage.getItem(`${today}_signoff`) === undefined ||
          localStorage.getItem(`${today}_signoff`) === null ||
          JSON.parse(localStorage.getItem(`${today}_signoff`)).length > 0
        ) {
          location.pathname = logoutpath;
        }
      }
    } else {
      console.log('认真工作');
      console.log(
        `距离签退还有${
          (Date.parse(today_signoff_begin_server) - Date.parse(now_server_time)) / 1000 / 60 / 60
        }小时`
      );
      //location.pathname = logoutpath;
    }
  };
  // 可能 iframe 载入较慢，不定期执行很大概率卡住
  setInterval(autoSign, 1000);
}

if (location.pathname.toLowerCase().includes('signin.aspx')) {
  window.confirm = (message) => {
    // 确定要签退吗？
    console.log(message);
    if (message !== '确定要签退吗？') return;
    const ServerTime = document.getElementById('ServerTime').textContent;
    const now_server_time = `${today}T${ServerTime}`;
    console.log('当前服务器时间为：' + now_server_time);
    if (Date.parse(now_server_time) > Date.parse(today_signoff_begin_server)) {
      console.log('确定');
      return true;
    } else {
      console.log('取消');
      return false;
    }
  };
}
