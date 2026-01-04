// ==UserScript==
// @name        首页一键拉黑up主bilibili.com
// @description 我明明都点了不喜欢了还给我不停推那些搔首弄姿的臭娘们？那就对不起了，在首页up主昵称前面增加拉黑按钮，一键拉黑。
// @match       https://bilibili.com/
// @match       https://www.bilibili.com/
// @icon        https://www.bilibili.com/favicon.ico
// @version     25.02.11
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @namespace   https://space.bilibili.com/474516472?spm_id_from=namespace
// @author      https://space.bilibili.com/474516472?spm_id_from=author
// @supportURL  https://space.bilibili.com/474516472?spm_id_from=supportURL
// @homepageURL https://space.bilibili.com/474516472?spm_id_from=homepageURL
// @require     https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license     MIT
//
// @downloadURL https://update.greasyfork.org/scripts/526549/%E9%A6%96%E9%A1%B5%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91up%E4%B8%BBbilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/526549/%E9%A6%96%E9%A1%B5%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91up%E4%B8%BBbilibilicom.meta.js
// ==/UserScript==
(function() {
  $(function() {
    console.log('run toblack')
    /*
     * $('.bpx-player-video-wrap video')
     */
    const menuctl = ({initValue= 0})=>{
      let total = initValue
      const currentName = ()=> "去管理黑名单 --（ " + (total<1 ? "请留意黑名单数量 ）" : `总共：${total} ）`)
      const register = ()=> {
        GM_registerMenuCommand(currentName(), () => {
          window.open('https://account.bilibili.com/account/blacklist', '_blank');
        });
      }
      const ctl = {
        get total() { return total; },
        set total(newValue) {
          if (newValue == total) return;
          GM_unregisterMenuCommand(currentName());
          total = newValue;
          register();
        },
      };
      return ctl
    }
    const menu = menuctl({initValue: 0})
    unsafeWindow.tools_toblack = (uid) => {
      $('div.uid_'+uid).remove()
      fetch("https://api.bilibili.com/x/relation/modify", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          'fid': uid,
          'act': 5,
          're_src': 11,
          'gaia_source': 'web_main',
          'csrf': getCookie('bili_jct'),
        })
      }).then(res=>{
        //res.json().then(data=>{console.log(data)})https://account.bilibili.com/account/blacklist
      })
      try{
        fetch("https://api.bilibili.com/x/relation/blacks?re_version=0&pn=1&ps=20&jsonp=jsonp&web_location=333.33", {
          method: "GET",
          credentials: 'include',
        }).then(res=> {
          res.json().then(data=>{
            if(data.code == 0){
              menu.total = data.data.total
            }
          })
        })
      }catch(err){}
    }
    // 监听首页加载
    const observer = new MutationObserver(function (mutationsList, observer) {
      $('.container>div').each((index, item)=>{
        if(typeof $(item).data('toblack') != 'undefined') return ;
        const url = $(item).find('.bili-video-card__info--owner').attr('href')
        if(typeof url != 'undefined'){
          const uid = url.substr(url.lastIndexOf('/')+1)
          $(item).find('.bili-video-card__info--bottom').prepend(`
            <a class="bili-video-card__info--icon-text" style="color: red;" onclick="tools_toblack('${uid}')">拉黑</a>
          `)
          $(item).data('toblack', uid).addClass('uid_'+uid)
        }else{
          $(item).data('toblack', 'none')
        }
      })
    });
    const _ = setInterval(()=>{
      if($('.container').length > 0){
        clearInterval(_)
        observer.observe($('.container').get(0), { childList: true });
        console.log('ready')
        $('.container').append(`<!---->`)
        menu.total = -1
      }
    }, 100)
  })
})()