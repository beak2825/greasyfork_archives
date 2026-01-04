// ==UserScript==
// @name 自动拉黑华为用户
// @description 一入泥潭深似海，满城尽是菊家军。余承东是天上父，任正非是地上神。老师教你爱祖国，外野孝子爱华为。你给华为智商税，华为给你增智慧。华为好呀华为美，华为用户全拉黑。
// @namespace huawei-ptsd
// @match *://bbs.saraba1st.com/2b/thread-*
// @grant none
// @run-at document-end
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/383521/%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91%E5%8D%8E%E4%B8%BA%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/383521/%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91%E5%8D%8E%E4%B8%BA%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
async function getFormHash() {
  let res = await fetch('https://bbs.saraba1st.com/2b/home.php?mod=space&do=friend&view=blacklist'),
      html = await res.text(),
      parser = new DOMParser(),
      doc = parser.parseFromString(html, 'text/html'),
      formHashInput = doc.querySelector('form[name=blackform] input[name=formhash]'),
      formHash = formHashInput.value;
  return formHash;
}

async function addBlacklist(username) {
  let formHash = await getFormHash(),
      res = await fetch('https://bbs.saraba1st.com/2b/home.php?mod=spacecp&ac=friend&op=blacklist&start=', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          body: `username=${encodeURIComponent(username)}&blacklistsubmit_btn=true&blacklistsubmit=true&formhash=${formHash}`,
      }),
      html = await res.text();
  return html.includes('操作成功');
}

function isHuaweiUser(text) {
  return [
      /—— 来自 HUAWEI .+, Android .+$/, // S1Next-鹅版
      /----发送自 HUAWEI .+,Android .+$/ // Stage1 App For Android
  ].some(re => re.test(text));
}

~async function() {
  let huaweiPosts = Array.from(document.querySelectorAll('#postlist > [id^=post_]:not([style])')).filter(
      postElement => {
          return isHuaweiUser(postElement.querySelector('[id^=postmessage_]').textContent);
      })

  for (let postElement of huaweiPosts) {
      postElement.style.display = 'none';
  }

  let unblockedHuaweiUsers = Array.from(
      new Set(
          huaweiPosts.map(
              postElement => {
                  return postElement.querySelector('.authi .xw1').textContent;
              })
          )
      );

  for (let username of unblockedHuaweiUsers) {
      await addBlacklist(username);
  }
}();