// ==UserScript==
// @name         IconfontR
// @namespace    https://maqib.cn/
// @version      0.3
// @description  在 Iconfont 可以直接复制 React component
// @author       #前端公众号：JS酷
// @match        https://www.iconfont.cn/*
// @icon         https://img.alicdn.com/imgextra/i2/O1CN01ZyAlrn1MwaMhqz36G_!!6000000001499-73-tps-64-64.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447288/IconfontR.user.js
// @updateURL https://update.greasyfork.org/scripts/447288/IconfontR.meta.js
// ==/UserScript==

;(function () {
var toast = (content,time) => {
  	return new Promise((resolve,reject) => {
        let elAlertMsg = document.querySelector("#fehelper_alertmsg");
        if (!elAlertMsg) {
            let elWrapper = document.createElement('div');
            elWrapper.innerHTML = '<div id="fehelper_alertmsg" style="position:fixed;top:100px;left:0;right:0;z-index:1000;display:flex">' +
                '<p style="background:#4caf50;display:inline-block;color:#fff;text-align:center;' +
                'padding:10px 10px;margin:0 auto;font-size:14px;border-radius:4px;">' + content + '</p></div>';
            elAlertMsg = elWrapper.childNodes[0];
            document.body.appendChild(elAlertMsg);
        } else {
            elAlertMsg.querySelector('p').innerHTML = content;
            elAlertMsg.style.display = 'flex';
        }

      	window.setTimeout(function () {
            elAlertMsg.style.display = 'none';
          	resolve && resolve();
        }, time || 1000);
    });
};  

  async function fetchsvgr(code) {
   return await fetch('https://api.react-svgr.com/api/svgr', {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        options: {
          icon: false,
          native: false,
          typescript: false,
          ref: false,
          memo: false,
          titleProp: false,
          expandProps: 'end',
          replaceAttrValues: {},
          svgProps: {},
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeTitle: false,
                  },
                },
              },
            ],
          },
          prettier: true,
          prettierConfig: {
            semi: false,
          },
        },
      }),
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    }).then((res) => res.json())
  }

  // 处理样式
  const style = `.page-manage-project .project-iconlist .block-icon-list li.cover .icon-cover-unfreeze, .page-manage-project .project-iconlist .block-icon-list li:hover .icon-cover-unfreeze,
  .block-icon-list li:hover .icon-cover {
      display: grid!important;
    }
    .page-manage-project .project-iconlist .block-icon-list li .icon-cover {
        grid-template-rows: repeat(3, minmax(0, 1fr));
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    .block-icon-list li .icon-cover {
      grid-template-rows: repeat(2, minmax(0, 1fr));
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .block-icon-list li .icon-cover .cover-item{
        width:auto;
    }
    .page-manage-project .project-iconlist .block-icon-list li .icon-cover .cover-code{
        height: auto;
      line-height: 40px;
    }
    .block-icon-list li .icon-cover .cover-item-line {
      height: auto;
      line-height: 52.5px;
    }`


  const styleEl = document.createElement('style')
  styleEl.textContent = style
  document.head.appendChild(styleEl)

  function addCopybtn() {
    console.log([...document.querySelectorAll('.icon-cover')])
    ;[...document.querySelectorAll('.icon-cover')].forEach((item) => {
      const span = document.createElement('span')
      span.title='复制 React component'
      span.className = 'cover-item iconfont cover-item-line icon-fuzhidaima'

      span.onclick = async () => {
        const svg = `<svg width="128" height="128" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${
          item.parentNode.querySelector('svg').innerHTML
        }</svg>`
        console.log('svg',svg)
        try {
          const res = await fetchsvgr(svg)

          navigator.clipboard.writeText(res.output)
          toast('复制成功！',2000)
          console.log('React component 复制成功！')
        } catch (error) {
          console.log('请求服务出错')
          toast('请求服务出错',2000)
        }
      }
      item.appendChild(span)
    })

  }
  window.onpopstate = function(event) {
    addCopybtn()
  };

    let href=window.location.href
  document.addEventListener('click',(e)=>{
      setTimeout(() => {
        if(window.location.href!==href){
            addCopybtn()
            href=window.location.href
          }
      }, 500);
  })


  setTimeout(() => {
    addCopybtn()

  }, 1000)

  // Your code here...
})()
