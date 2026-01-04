// ==UserScript==
// @name         pt-adoption
// @namespace    https://pthome.net/
// @version      1.0.0
// @description  当前做种中增加认领
// @author       Yunfly
// @match        https://pthome.net/userdetails.php?id=*
// @match        https://hdsky.me/userdetails.php?id=*
// @match        https://pt.btschool.club/userdetails.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424505/pt-adoption.user.js
// @updateURL https://update.greasyfork.org/scripts/424505/pt-adoption.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function processResponse(xhr) {
    console.log(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
    }
  }
  function change(uid, torrentid) {
    let uri = location.origin;
    // 初始化XMLHttpRequest对象
    const xmlrequest = new XMLHttpRequest();
    // 设置请求响应的URL
    // 设置处理响应的回调函数
    xmlrequest.onreadystatechange = function() {
      if (xmlrequest.readyState == 4 && xmlrequest.status == 200) {
        const msg = JSON.parse(xmlrequest.responseText);

        if (location.origin === 'https://pthome.net') {
          alert(msg.messsage);
        }

        if (location.origin === 'https://hdsky.me') {

          if (msg.success == "added") {
            alert("认领种子成功");
            window.location.reload();
          }
          else if (msg.success == "deleted") {
            alert("取消认领成功");
            window.location.reload();
          }
          else if (msg.success == "maxreach") {
            alert("认领种子失败,您已达到最大认领数量。");
          }
          else {
            alert("失败");
          }
        }

      }

    };

    // 设置以POST方式发送请求，并打开连接
    if (uri === 'https://pthome.net') {
      uri = `https://pthome.net/claim.php?act=add&tid=${torrentid}`
    } else {
      uri = `${uri}/adoption.php?uid=${uid}&torrentid=${torrentid}&action=add`
    }
    xmlrequest.open("POST", uri, true);
    // 设置POST请求的请求头
    xmlrequest.setRequestHeader("Content-Type"
      , "application/x-www-form-urlencoded");
    // 发送请求
    // xmlrequest.send(`uid=${uid}&torrentid=${torrentid}&action=add`);
    xmlrequest.send(null)
  }
  function addBtn() {
    setTimeout(function() {

      let ka1 = document.getElementById("ka1")

      var btn = document.createElement("BUTTON");
      var t = document.createTextNode("CLICK ME");
      btn.appendChild(t);
      btn.addEventListener('click', function() {
        console.log(this)
      })
      ka1.childNodes[3].firstChild.insertBefore(btn, ka1.childNodes[3].firstChild.firstChild)
    }, 2000)
    this.removeEventListener('click', addBtn)

  }
  function addDomfunction() {
    setTimeout(function() {
      [...id.childNodes[3].firstChild.children].forEach((x, index) => {
        if (index === 0) {
          x.innerHTML += `<td align="center" class="colhead"><div  style="width: max-content">种子认领</div></td>`
          return
        }
        var btn = document.createElement("a");
        var tr = document.createElement("TD");

        var t = document.createTextNode("种子认领");
        btn.appendChild(t);
        btn.addEventListener('click', function() {
          const uid = location.href.match(/id=([0-9]+)/)[1];
          const torrentid = this.parentNode.parentNode.childNodes[2].innerHTML.match(/details.php\?id=([0-9]+)&/)[1]

          if (location.origin === 'https://pt.btschool.club') {
            window.open(`/viewclaims.php?add_torrent_id=${torrentid}`);
          }
          change(uid, torrentid)
        })
        btn.style.width = 'max-content'
        btn.style.cursor = 'pointer'

        tr.appendChild(btn)
        x.appendChild(tr)
      })

    }, 1)
    this.removeEventListener('click', addDomfunction)
  }

  let id = document.getElementById("ka1")
  let pica1 = document.getElementById("pica1").parentElement

  pica1.addEventListener('click', addDomfunction)
})();