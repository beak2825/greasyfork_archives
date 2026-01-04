// ==UserScript==
// @name        网页文本转链接
// @description 高性能文本转链接方案，支持动态内容
// @version     1.0
// @author      WJ
// @match       *://*/*
// @license     MIT
// @grant       none
// @run-at      document-idle
// @namespace   https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/541057/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/541057/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(() => {
  // 1. URL 正则
  const tlds = [
    'app','aero','aer','art','asia','beer','biz','cat','cc','chat','ci','cloud',
    'club','cn','com','cool','coop','co','dev','edu','email','fit','fun','gov',
    'group','hk','host','icu','info','ink','int','io','jobs','kim','love','ltd',
    'luxe','me','mil','mobi','moe','museum','name','net','nl','network','one',
    'online','org','plus','post','press','pro','red','ren','run','ru','shop',
    'site','si','space','store','tech','tel','top','travel','tv','tw','uk','us',
    'video','vip','wang','website','wiki','wml','work','ws','xin','xyz','yoga','zone'
  ].join('|');
  const urlRegex = new RegExp(
    String.raw`(?:(?:https?:\/\/)|(?:www\.|wap\.))[\w.:/?=%&#@+~-]{1,50}\.[\w]{2,15}\b[\w.:/?=%&#@+~-]*|`+
    String.raw`(?<!(https?:|@)\S*)\b[\w:.-]{1,50}\.(?:${tlds})\b[\w.:/?=%&#@+~-]*`,
    'gi'
  );

  // 2. 检查节点是否需处理
  const guard = root => root && !root.closest?.(`
    :is(a,applet,area,button,canvas,code,cite,embed,frame,frameset,head,
    iframe,img,input,map,meta,noscript,object,option,pre,script,select,style,svg,textarea),
    [contenteditable],.WJ_modal,.ace_editor,.CodeMirror,.monaco-editor,.cm-editor`);

  // 3. 处理节点
  const guardok = root => {
    const walker = document.createTreeWalker(root, 4, {
      acceptNode: n => guard(n.parentElement) ? 1 : 2
    });
    const tasks = [];
    for (let node; (node = walker.nextNode());) {
      const raw = node.textContent ?? '';
      const replaced = raw.replace(urlRegex, m =>
        `<a style="text-decoration:underline" href="${m.startsWith('http')?m:'https://'+m}">${m}</a>`);
      raw !== replaced && tasks.push({ node, replaced });
    }
    tasks.forEach(({ node, replaced }) =>
      node.replaceWith(document.createRange().createContextualFragment(replaced))
    );
  };

  // 4. 初始化
  setTimeout(() => {
    const io = new IntersectionObserver(en =>
      en.forEach(({ isIntersecting, target }) =>
        isIntersecting && (io.unobserve(target), requestIdleCallback?.(() => guardok(target), { timeout: 1000 }))
    ));
    const mo = new MutationObserver(mu =>
      mu.forEach(({ addedNodes }) =>
        addedNodes.forEach(no => no.nodeType === 1 && guard(no) && io.observe(no))
    )).observe(document.body, { childList: true, subtree: true });
    [...document.body.children].forEach(el => guard(el) && io.observe(el));
  }, 1000);
})();
