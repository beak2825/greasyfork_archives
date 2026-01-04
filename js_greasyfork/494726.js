// ==UserScript==
// @name        头条搜索跳过app下载(自动展开)
// @namespace   Violentmonkey Scripts
// @match        *://m.toutiao.com/*
// @match        *://www.toutiao.com/article/*
// @match        *://z.toutiao.com/*
// @match        *://article.zlink.toutiao.com/*
// @grant       none
// @version     2.3
// @author      Ling
// @description 2025/6/19 16:41:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494726/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BF%87app%E4%B8%8B%E8%BD%BD%28%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494726/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BF%87app%E4%B8%8B%E8%BD%BD%28%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%29.meta.js
// ==/UserScript==
(async function() {

  const config = {
        maxRetry: 50,
        baseDelay: 300,
        logPrefix: '[头条优化]'
    };
  var constantVar1='JUTHx';
  var constantVar2='J4dQM';
  var count=0;
  var url = window.location.href;
  var seachUrl=window.location.pathname;
  var domain = window.location.hostname;

  console.log('seachUrl:'+url);

  // 智能点击器（带延时重试）
    const smartClick = async (selector, type) => {
        for (let i = 0; i < config.maxRetry; i++) {
            const target = document.querySelector(selector);
            if (target) {
                target.click();
                console.log(`${config.logPrefix} ${type}按钮点击成功`);
                return true;
            }
            await new Promise(r => setTimeout(r, config.baseDelay));
        }
        console.warn(`${config.logPrefix} ${type}按钮未找到`);
        return false;
    };

  //获取路径名
  var urlpath=seachUrl.substring(1,seachUrl.length);
  console.log('urlpath:'+urlpath);
  if(constantVar1===urlpath||constantVar2===urlpath){//判断是否属于链接跳转
     // let turnUrl=getQueryVariable("h5_url");//取H5链接;
     let turnUrl=getH5Url();
     var decUrl =decodeURIComponent(turnUrl);
     //alert('解析结束！！！')
     location.href=decUrl;
     return; // 跳转后不再执行后续代码
  }else{


        // 第二阶段：设备自适应点击
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const expandBtn = isMobile ? '.toggle-button' : '.expand-button';

        await smartClick(expandBtn, '展开');
        await smartClick('.button.cancel, .dialog-close', '取消弹窗');
        await smartClick('.button.cancel, .dialog-close', '取消弹窗');

  }


  function getH5Url() {
     let h5_url=window.location.search.substring(1);
     let turnUrl2=getQueryVariable(h5_url,"h5_url");
    console.log("取h5_url:"+turnUrl2);
     if(turnUrl2===false){//解析scheme H5链接;
       turnUrl2=getQueryVariable(h5_url,"scheme");
       console.log("取scheme:"+turnUrl2);
       turnUrl2=decodeURIComponent(turnUrl2);
       console.log("scheme解码后:"+turnUrl2);
       let turnArray=turnUrl2.split("?");
       console.log("scheme分割为数组:"+turnArray);
       let paramUrl=turnArray[turnArray.length-1];
       console.log("scheme参数链接:"+paramUrl);
       turnUrl2=getQueryVariable(paramUrl,"launch_log_extra");
       console.log("解析scheme的H5链接:"+turnUrl2);
       turnUrl2=decodeURIComponent(turnUrl2);
       //取h5链接

       let paramArray=turnUrl2.split(",");
       let h5Url=paramArray[0].substring(15,paramArray[0].length-1);
       let h5UrlArray=h5Url.split("?");
       h5Url=getQueryVariable(h5UrlArray[1],"h5_url")
       console.log("取文章链接:"+h5Url);
       turnUrl2=h5Url;

     }

    console.log("解析的H5链接:"+turnUrl2);

    return turnUrl2;

  }
function getQueryVariable(v1,variable) {
  var query = v1; var vars = query.split("&"); for (var i=0;i<vars.length;i++) { var pair = vars[i].split("="); if(pair[0] == variable){return pair[1];}
} return(false);
}
})();