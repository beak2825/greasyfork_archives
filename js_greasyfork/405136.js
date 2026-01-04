// ==UserScript==
// @name        Greasyfork-Admin-User-Panel
// @namespace   Greasyfork-Admin-User-Panel
// @match       https://greasyfork.org/*/users/*
// @grant       none
// @version     1.1
// @author      Mach6
// @description Delete all comments of a user
// @downloadURL https://update.greasyfork.org/scripts/405136/Greasyfork-Admin-User-Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/405136/Greasyfork-Admin-User-Panel.meta.js
// ==/UserScript==
(() => {
  const deleteAllDiscussion = async () => {
    const nodeAllActivity = document.evaluate('//a[contains(text(),"See all user")] | //a[contains(text(),"查看所有用户活动")] ',document,document,XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    const html = await (await fetch(nodeAllActivity.href, {credentials: 'include'})).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const links = [].map.call(doc.querySelectorAll('.discussion-title'), (a)=>a.href);

    links.forEach(async (l) => {
      const html = await (await fetch(l, {credentials: 'include'})).text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const token = doc.querySelector("meta[name=csrf-token]").content;

      const formData = new FormData();
      formData.append("authenticity_token", token);
      formData.append("_method", 'DELETE');

      const html2 = await (
              await fetch(l, {
                credentials: "include",
                method: "POST",
                body: formData
              })
            ).text();
      return html2;
    });
  };

  const panelUI = () => {
    const btnDeleteAll = document.createElement("BUTTON");
    btnDeleteAll.innerHTML ='Delete All Comments';
    btnDeleteAll.setAttribute('id', 'delete-all-comments'); 
    btnDeleteAll.onclick = () => {
      deleteAllDiscussion().then(() => {alert('Done');document.location.reload()});
    }
    const nodeAllActivity = document.evaluate('//a[contains(text(),"See all user")] | //a[contains(text(),"查看所有用户活动")] ',document,document,XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    if (!nodeAllActivity) {
      btnDeleteAll.disabled = true;
    }

    const section = document.createElement('SECTION');
    section.setAttribute('id', 'mypanel');
    section.appendChild(btnDeleteAll);

    const h3 = document.createElement('H3')
    h3.appendChild(document.createTextNode("Enhanced control panel"));
    const head = document.createElement('HEADER');
    head.appendChild(h3);

    const myPanel = document.createElement('SECTION')
    myPanel.appendChild(head);
    myPanel.appendChild(section);
    myPanel.setAttribute('id','enhanced-control-panel');

    return myPanel;
  };

  var modPanel = document.getElementById('moderator-user-control-panel');
  modPanel.parentNode.insertBefore(panelUI(), modPanel)
})();