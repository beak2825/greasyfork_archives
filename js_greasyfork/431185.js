// ==UserScript==
// @name         网易云下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网易云音乐下载
// @author       You
// @match        *://music.163.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431185/%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/431185/%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

; (() => {
  let flag;
  let timer = null;

  const down = () => {
    // console.clear();
    let dom = document.getElementById('downloadMusic')
    if (dom) return;
    const iframe = document.getElementById('g_iframe')?.contentWindow?.document || top.frames[0];
    const table = iframe.body.querySelectorAll('.m-table')[0]
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.rows);
    flag = true;
    clearTimeout(timer);
    const style = document.createElement('style');
    style.innerHTML = `
    tr .left{
      padding: 0;
    }
    tr .left .hd {
      text-align: center;
    }
    #downloadMusic{
      cursor: pointer;
    }
    #downloadMusic:hover{
      text-decoration: underline;
      color: blue;
    }
    `;
    iframe.head.appendChild(style);
    rows.forEach(row => {
      const playBox = row.cells[0].children[0];
      const span = document.createElement('span');
      span.id = 'downloadMusic';

      const musicName = row.cells[1].innerHTML.match(/(?<=title=")[^"]+/)[0].replaceAll('&nbsp;', ' ');
      let id = row.cells[1].innerHTML.match(/(?<=song\?id\=)\d+/)[0]

      span.setAttribute('data', id)

      span.setAttribute('musicName', musicName);
      span.innerHTML = '下载';

      playBox.appendChild(span);

    })

    tBody.addEventListener('click', (e) => {
      const target = e.target || e.srcElement;
      if (target.id === 'downloadMusic') {

        $.ajax(`/song/media/outer/url?id=${target.getAttribute('data')}`, {
          xhrFields: { responseType: "blob" },
          success(data) {
            try {
              const a = document.createElement('a');
              a.download = target.getAttribute('musicName');
              a.href = URL.createObjectURL(data);
              a.click();
              setTimeout(() => {
                a.remove();
              }, 1000);

            } catch (e) {
              target.innerHTML = '失败';
            }
          }
        })
      }
    })
  }

  function fn() {
    clearTimeout(timer);
    if (!flag) {

      try { down() } catch { }

      clearTimeout(timer);
      let dom = document.getElementById('downloadMusic')
      if (!dom) timer = setTimeout(fn, 2000)
    } else {
      flag = true;
    }
  }

  window.addEventListener('load', () => {
    const iframe = top.document.getElementById('g_iframe')?.contentWindow?.document || top.frames[0];
    const search = location.search.match(/id=\d+/)
    if(search){
      const box = iframe.getElementsByClassName('hd')[0]
      const id = search[0].replace('id=','')
      let div = document.createElement('div')
      div.innerHTML = '下载'
      div.style.cssText = `
      float: right;
      cursor: pointer;
      position: relative;
      top: -2em;
      font-size: 18px;
      border: 1px solid #ccc;
      padding: 2px 10px;
      border-radius: 5px;
      transition: all .5s;
      `
      div.onmouseenter = function(){
        this.style.background = 'pink'
        this.style.color = '#fff'
      }
      div.onmouseleave = function(){
        this.style.background = '#fff'
        this.style.color = '#000'
      }
      div.onclick = function(){
        $.ajax(`/song/media/outer/url?id=${id}`, {
          xhrFields: { responseType: "blob" },
          success(data) {
            try {
              const a = document.createElement('a');
              a.download = box.getElementsByTagName('em')[0].innerText;
              a.href = URL.createObjectURL(data);
              a.click();
              setTimeout(() => {
                a.remove();
              }, 1000);

            } catch (e) {
              div.innerHTML = '失败';
            }
          }
        })
      }
      box.appendChild(div)
      return;
    }

    let dom = document.getElementById('downloadMusic')
    if (!dom) fn();
    window.addEventListener('hashchange', () => {
      let [timer1,timer2,timer3,timer4] = [null,null,null,null]
      const change = () => {
        let dom = document.getElementById('downloadMusic')
        console.log(dom);
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
        if (!dom) {
          flag = false;
          fn();
        }
      }
      timer1 = setTimeout(change, 1500)
      timer2 = setTimeout(change, 3000)
      timer3 =setTimeout(change, 5000)
      timer4 =setTimeout(change, 1000)
    })
    
  });

})()
