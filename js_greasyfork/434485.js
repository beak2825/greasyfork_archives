// ==UserScript==
// @name         二师抢课题用
// @namespace    二师抢课题用
// @version      1
// @description  二师抢课题用-自用
// @author       柳江南
// @match        http://jwc.cque.edu.cn/jsxsd/bysj/xsxt.do
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434485/%E4%BA%8C%E5%B8%88%E6%8A%A2%E8%AF%BE%E9%A2%98%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/434485/%E4%BA%8C%E5%B8%88%E6%8A%A2%E8%AF%BE%E9%A2%98%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".Nsb_r_title").append('------填好要监测的选题名称或者指导教师即可');
    let mp3 = new Audio('https://m3.8js.net/2043/161204431655356.mp3')

    let has = Number($(".Nsb_r_list_fy3").text().replace(' ', '').split('页')[1].split('条')[0])
    if (has != 0) {
      mp3.play()
      let i = 0
      setInterval(()=>{
        if(i % 2 == 0) {
          $("body").css({"background": "#f7cac7", "transition": "all 1s"})
        } else {
          $("body").css({"background": "#ddedfb", "transition": "all 1s"})
        }
        i++
      },1000);
    } else {
      setTimeout(() => {
          $("#btcx").click()
      }, 2000)
    }


})();