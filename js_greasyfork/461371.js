// ==UserScript==
// @name         万群引擎文案转链
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  万群引擎文案转链,一键转链拷贝
// @author       大龙
// @match        *://www.wanqunyinqing.com
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @require     https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://unpkg.com/axios/dist/axios.min.js
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/461371/%E4%B8%87%E7%BE%A4%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%88%E8%BD%AC%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461371/%E4%B8%87%E7%BE%A4%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%88%E8%BD%AC%E9%93%BE.meta.js
// ==/UserScript==
function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
GM_addStyle ( `
    .goods-card .cov-success{
     color:#74c321;
    }
` );
GM_addStyle ( `
    .goods-card .cov-fail{
     color:red;
    }
` );
GM_addStyle ( `
    .goods-card .link{
     position: relative;
    }
` );

GM_addStyle ( `
    .cov-copy{
     background:rgba(0,0,0,0.5);
     transition: all 0.25s 0.5s;
     color:#fff;
     display:flex;
     justify-content: center;
     align-items: center;
         position: absolute;
         width:100%;
         height:100%;
     top:0;
     left:0;
    }
` );

GM_addStyle ( `
.goods-card .link:hover .cov-copy.hide{
     top:0;
    }
` );
GM_addStyle ( `
.goods-card .link .cov-copy.hide{
     top:100%;
    }
` );
(function() {
    'use strict';
    const ClipboardJS = window.ClipboardJS;
    console.log('爱淘金1');
    const covLink = (param) => new Promise(succ => axios.post('https://app.df0535.cn/v1/app/good/newClip', param).then( (response) => succ(response.data))
  .catch(function (error) {
    console.log(error);
        succ()
  }))

    const body = $('body');
    const copydoms = $(`<div id="copydoms"></div>`).appendTo(body)
    const checkUserInfo = () => new Promise(succ => {
            let code = localStorage.getItem('atj_code')
     if(code) {
         const userid= localStorage.getItem('atj_user_id')
         if(userid) return succ(userid)
      }
      code = prompt("请输入您爱淘金邀请码",code||'');
      if(!code) return succ(0);
      localStorage.setItem('atj_code',code)
      axios.post('https://app.df0535.cn/v2/App/User/codeCovId', {code}).then( (response) => {
        const res = response.data
        if(res.info&&res.info.ok) {
            localStorage.setItem('atj_user_id',res.data||'')
         return succ(res.data)
        }
          alert(res.info.message)
      })
      .catch(function (error) {
          console.log(error);
          succ()
      });

        })
    body.on('mouseup','.goods-card .info .el-button', function() {

        // 判断是否完成用户绑定
       checkUserInfo().then(__user_id => {
           console.log('__user_id',__user_id)
           if(!__user_id) {
               return
           }

           console.log('this',this)
        const btn = $(this);
        const parents = btn.parents('.info').find('.link');
        if(parents.hasClass('cov-ok')) {
            const clipboard = new ClipboardJS(this);
            const span = btn.find('span')
            clipboard.on("success", (e) => {
                console.log('success', e)
                span.text('复制成功')
                const timer = setTimeout(() => span.text('复制文案'),3000);
                e.clearSelection();
                clipboard.destroy()
            });
            clipboard.on("error", (e) => {
                console.log('error', e)
                span.text('复制失败')
                e.clearSelection();
                clipboard.destroy()
            });
         return;
        }
        const itemArr = []
        parents.find('span.hover-underline').each(function(index,item) {
         // console.log('index',index,'item',item)
            itemArr.push($(item)) ;
        })
        if(itemArr.length==0) return;
        const tip = $(`<div class='cov-copy'>正在转链...</div>`).appendTo(parents)
        const pa = []
        for(const item of itemArr) {
            const p = covLink({content:item.text(),__user_id}).then(res => {
                if(res.info&&res.info.ok) {
                  item.text(res.data.buy_url).addClass('cov-success')
                } else {
                  item.addClass('cov-fail')
                }
            })
         pa.push(p)
        }

        Promise.all(pa).then(() => {
         parents.addClass('cov-ok')
        btn.attr('data-clipboard-text',parents.text());
        tip.text('转链完毕,点击复制').attr('data-clipboard-text',parents.text()).mouseup(function() {
             const clipboard = new ClipboardJS(this);
             console.log('clipboard', clipboard)
            clipboard.on("success", (e) => {
                console.log('success', e)
                tip.text('复制成功').addClass('hide')
                const timer = setTimeout(() => tip.text('转链完毕,点击复制'),3000);
                e.clearSelection();
                clipboard.destroy()
            });
            clipboard.on("error", (e) => {
                console.log('error', e)
                tip.text('复制失败,请重试!')
                e.clearSelection();
                clipboard.destroy()
            });
        });
       })
        })
    })
    // Your code here...
})();