// ==UserScript==
// @name        腾讯云CSIG直播弹幕小助手 - csig.lexiangla.com
// @namespace   Violentmonkey Scripts
// @match       https://csig.lexiangla.com/lives/*
// @grant       none
// @version     1.1
// @author      -
// @description 2022/1/21 下午3:48:44
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438916/%E8%85%BE%E8%AE%AF%E4%BA%91CSIG%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%B0%8F%E5%8A%A9%E6%89%8B%20-%20csiglexianglacom.user.js
// @updateURL https://update.greasyfork.org/scripts/438916/%E8%85%BE%E8%AE%AF%E4%BA%91CSIG%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%B0%8F%E5%8A%A9%E6%89%8B%20-%20csiglexianglacom.meta.js
// ==/UserScript==

  setTimeout(function(){
    console.clear();
    console.log('弹幕小助手已启动！')
    setInterval(function(){
      var choujiang = $('div.lottery-modal-tojoined-rule-list-content')
      if (!!choujiang[0]) {
        // if(!!sendInt) clearInterval(sendInt);
        if(!!choujiangInt) return;
        $('div.lottery-modal-tojoined-button').click();
        
        var inputBox = $('input.webim-comment-input'); 
        var btn = $('span.webim-comment-btn'); 
        var choujiangInt = setInterval(function(){
          $('div.heart-beating-warp').hide(); 
          $('i.svg-sprite-icon').addClass('icon-face-active'); 
          btn.show();
          var txt = choujiang[0].outerText.split("：")[1];
          console.log('抽奖口令：' + txt);
          inputBox.val(txt); 
          inputBox[0].dispatchEvent(new Event('input')); 
          btn.click();
          console.log('已发送:', inputBox.val());
          inputBox.val('');
          setTimeout(function(){
            btn.hide();
            $('i.svg-sprite-icon').removeClass('icon-face-active'); 
            $('div.heart-beating-warp').show(); 
          }, 1000);
        }, 3000);
      } else {
        if(!!choujiangInt) clearInterval(choujiangInt);
        // if(!!sendInt) return;
        // var inputBox = $('input.webim-comment-input'); 
        // var btn = $('span.webim-comment-btn'); 
        // var sendInt = setInterval(function(){
        //   $('div.heart-beating-warp').hide(); 
        //   $('i.svg-sprite-icon').addClass('icon-face-active'); 
        //   btn.show();
        //   inputBox.val('加油！666'); 
        //   inputBox[0].dispatchEvent(new Event('input')); 
        //   btn.click();
        //   console.log('已发送:', inputBox.val());
        //   inputBox.val('');
        //   setTimeout(function(){
        //     btn.hide();
        //     $('i.svg-sprite-icon').removeClass('icon-face-active'); 
        //     $('div.heart-beating-warp').show(); 
        //   }, 1000);
        // }, 30000);
      }
    }, 1000);
    
  }, 5000);
