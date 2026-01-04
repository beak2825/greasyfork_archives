// ==UserScript==
// @name           DLSite Title & Tag Unmasker
// @description    Effortlessly unmask hidden titles and tags.
// @description:ja DLSiteの規制された単語の復元を試みる
// @author         Ginoa AI
// @namespace      https://greasyfork.org/ja/users/119008-ginoaai
// @version        1.4.2
// @match          https://www.dlsite.com/pro/work/=/product_id/*
// @match          https://www.dlsite.com/pro-touch/work/=/product_id/*
// @match          https://www.dlsite.com/maniax/work/=/product_id/*
// @match          https://www.dlsite.com/maniax-touch/work/=/product_id/*
// @match          https://www.dlsite.com/books/work/=/product_id/*
// @match          https://www.dlsite.com/books-touch/work/=/product_id/*
// @match          https://www.dlsite.com/home/work/=/product_id/*
// @match          https://www.dlsite.com/home-touch/work/=/product_id/*
// @icon           https://pbs.twimg.com/profile_images/1648150443522940932/4TTHKbGo_400x400.png
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491218/DLSite%20Title%20%20Tag%20Unmasker.user.js
// @updateURL https://update.greasyfork.org/scripts/491218/DLSite%20Title%20%20Tag%20Unmasker.meta.js
// ==/UserScript==



function LoadWait() {
  if ( !document.querySelectorAll('h1[id="work_name"]')[0].textContent ) {
    setTimeout( LoadWait, 100 );
    return;
  } else {
    try{
      if ( contents ) {
        var work_name = contents.detail[0].name;
        document.querySelector('h1[id="work_name"]').innerText = work_name;
      }
    } catch(e) {
      GetTitle(location.href.replace(/.*?_id\/(.+?)\..+/g, "$1"));
    }
    MainProcess();
  }
}
LoadWait();

async function GetTitle(id) {
  var work_name = JSON.parse(await makeGetRequest("https://www.dlsite.com/maniax/api/=/product.json?keyword_work_name=" + id));
  document.querySelector('h1[id="work_name"]').innerText = work_name[0].work_name;
}

function MainProcess() {
  try { document.querySelector('a[href*="/fsr/=/genre/525/from/work.genre"]').innerText = "メスガキ"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/113/from/work.genre"]').innerText = "レイプ"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/207/from/work.genre"]').innerText = "ロリ"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/531/from/work.genre"]').innerText = "ロリババア"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/151/from/work.genre"]').innerText = "監禁"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/154/from/work.genre"]').innerText = "鬼畜"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/115/from/work.genre"]').innerText = "逆レイプ"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/114/from/work.genre"]').innerText = "強制/無理矢理"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/120/from/work.genre"]').innerText = "近親相姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/201/from/work.genre"]').innerText = "拷問"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/157/from/work.genre"]').innerText = "催眠"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/163/from/work.genre"]').innerText = "獣姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/326/from/work.genre"]').innerText = "洗脳"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/139/from/work.genre"]').innerText = "痴漢"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/140/from/work.genre"]').innerText = "調教"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/147/from/work.genre"]').innerText = "奴隷"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/134/from/work.genre"]').innerText = "陵辱"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/121/from/work.genre"]').innerText = "輪姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/490/from/work.genre"]').innerText = "蟲姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/465/from/work.genre"]').innerText = "モブ姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/324/from/work.genre"]').innerText = "異種姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/164/from/work.genre"]').innerText = "機械姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/495/from/work.genre"]').innerText = "睡眠姦"; } catch (e) {}
  try { document.querySelector('a[href*="/fsr/=/genre/314/from/work.genre"]').innerText = "催眠音声"; } catch (e) {}
}

function makeGetRequest(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      onload: function(response) {
        resolve(response.responseText);
      }
    });
  });
}