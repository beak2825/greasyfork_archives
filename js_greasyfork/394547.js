// ==UserScript==
// @name         NotionChinese
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Notion Sinicization
// @author       Leon
// @match        *://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394547/NotionChinese.user.js
// @updateURL https://update.greasyfork.org/scripts/394547/NotionChinese.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function I18N() {
    this.lang = 'en';
  }

  I18N.prototype.install = function(langName, keymap){
    if (this[langName] === undefined) {
      this[langName] = keymap;
    }
  };

  const I18n = new I18N();

  I18n.install('zh', {
    // 左边栏
    'Create or Join Workspace': '创建或加入工作区',
    'Log Out (': '注销 (',
    'Quick Find': '快速查找',
    'All Updates': '所有的更新',
    'Followed': '已关注',
    'Mentions': '提到我的',
    'Open notifications settings': '打开消息设置',
    'Settings & Members': '设置 & 成员',
    'Templates': '模板',
    'Import': '导入',
    'Trash': '垃圾桶',
    'New Page': '新建页面',

    // 右边栏顶栏
    'Share': '分享',
    'Updates': '更新',
    'Favorite': '喜欢',

    // 块选项
    'Add Icon': '添加图标',
    'Add Cover': '添加封面',
    'Add Discussion': '添加议题',
    'Drag': '拖动',
    'Click': '点击',
    'to move': '来移动行',
    'to open menu': '打开菜单',
    'to add a block below': '在下方添加一个编辑块',
    'Rename, delete, and more...': '重命名，删除，及更多...',
    'Change icon': '改变图标',
    'Delete': '删除',
    'Duplicate': '重复',
    'Turn Into': '换成',
    'Copy Link': '复制链接',
    'Rename': '重命名',
    'Move To': '移动到',
    'Comment': '评论',
    'Color': '颜色',

    // 设置
    // 设置 => 我的账户
    'Me': '我',
    'My Account': '我的账户',
    'Changes to account settings will apply to all of your workspaces.': '帐户设置的更改将应用于您的所有工作区。',
    'Learn more.': '了解更多',
    'Photo': '相片',
    'Upload Photo': '上传相片',
    'Personal Info': '个人信息',
    'Email': '邮箱',
    'Change Email': '更改邮箱',
    'Given Name': '名',
    'Family Name': '姓',
    'Password': '密码',
    'You can set a permanent password if you don\'t want to use temporary login codes.': '如果您不想使用临时登录码，则可以设置永久密码。',
    'Change Password': '更改密码',
    'Remove Password': '移除密码',
    'Calendar Setting': '日历设置',
    'Start week on Monday': '一周从星期一开始',
    'This will change how all calendars in your app look.': '这将会更改您应用中所有日历的外观。',
    'Danger Zone': '危险部分',
    'Delete My Account': '删除我的账户',
    'Update': '更新',
    'Cancel': '取消',
    // 设置 => 通知
    'My Notifications': '通知',
    'Learn about mobile and desktop notifications.': '了解有关手机和桌面通知的消息。',
    'Mobile Push Notifications': '向手机推送通知',
    'Receive push notifications on mentions and comments immediately via your mobile apps.': '立即通过您的移动应用接收有关提及和评论的推送通知。',
    'Email Notifications': '邮件通知',
    'Receive email updates on mentions, comments, and edit digests for all the pages you have followed.': '接收有关您关注的所有页面的提及，评论和编辑摘要的电子邮件更新。',
    'My Connected Apps': '已关联的应用',
    'Earn Credit': '赚取积分',
    'Settings': '设置',
    'Members': '成员',
    'Upgrade': '升级',
    'Security & SAML': '安全 & SAML',
    'Dark Mode': '深色模式',
    'Workspace': '工作空间',
    'Name': '名称',
    'You can use your name or the name of your team. Keep it simple.': '您可以使用您的名字或团队的名字，来保持简单化。',
    'Icon': '图标',
    'Upload an image or pick an emoji. It will show up in your sidebar and notifications.': '上传图片或选择表情符号。 它将显示在侧边栏和通知中。',
    'Domain': '域名',
    'Share the link ': '分享这个链接 ',
    ' to add anyone with an allowed email domain to your workspace.': ' 来添加任何来自该域下拥有邮箱账号的用户到你的工作空间',
    'Allowed Email Domains': '允许的电子邮箱域',
    'Anyone with email addresses at these domains can automatically join your workspace.': '在这些域中拥有电子邮件地址的任何人都可以自动加入您的工作区。',
    'Export': '导出',
    'Export Entire Workspace': '导出整个工作区',
    'Learn about exporting workspaces.': '了解更多关于导出工作空间',
    'Delete Entire Workspace': '删除整个工作区',
    'Learn about deleting workspaces.': '了解更多关于删除工作区',

    // 新建页面
    'Open as Page': '作为页面打开',
    'Navigate to this page': '导航到这个页面',
    'Add to': '添加到',
    'Press Enter': '按下 Enter 键',
    ' to continue with an empty page': '以空白页继续',
    ', or&nbsp;pick a template': '，或者选择一个模板',
    ' (↑↓ to select)': ' (↑↓ 键选择)',
    'Empty With Icon': '空白有图标',
    'Empty': '空白',
    'Database': '数据库',

    'Small Text': '小文字'
  });



  const NotionApp = window.document.getElementById('notion-app');

  function getTextNode(node) {
    const sentences = [];

    const _getTextNode = function(node) {
      for (let childNode of node.childNodes) {
        if (childNode instanceof window.Text) {
          if (childNode.data.replace(/[' ']*/, '')) {
            sentences.push(childNode);
          }
        } else if (childNode.placeholder) {

        }
        _getTextNode(childNode);
      }
    };
    _getTextNode(node);
    return sentences;
  }

  function translate(node) {
    const sentences = getTextNode(node);
    for (let text of sentences) {
      const string = text.data;
      if (I18n.zh[string]) {
        text.parentNode.replaceChild(new window.Text(I18n.zh[string]), text);
      }
    }
  }

  setTimeout(() => {
    window.requestIdleCallback(() => {
      translate(NotionApp);

      const observer = new MutationObserver(function(mutationsList) {
        return window.requestIdleCallback(function() {
          mutationsList = mutationsList.filter(MutationRecord => {
            return MutationRecord.addedNodes.length !== 0;
          }).map(MutationRecord => {
            return MutationRecord.addedNodes;
          });

          for (let nodeList of mutationsList) {
            for (let node of nodeList) {
              translate(node);
            }
          }
        });
      });

      observer.observe(NotionApp, {
        childList: true,
        subtree: true
      });
    });
  });
})();
