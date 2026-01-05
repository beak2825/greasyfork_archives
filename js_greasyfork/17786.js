// ==UserScript==
// @name        taobao
// @namespace   taobao
// @include     https://*tmall.com*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @version     2
// @grant       none
// @description none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/17786/taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/17786/taobao.meta.js
// ==/UserScript==
//main
//check page status
if ('interactive' == document.readyState) {
} else {
  alert('Перезагрузите страницу (document.readyState: ' + document.readyState + ')');
}
//check redystate event

document.onreadystatechange = function () {
  if (document.readyState == 'complete' || true ) {
    console.log('readyState=' + document.readyState);
    var originalTitle = document.title;
    //     jQuery('#J_LinkBuy').show().parent('div').show().parent('div').show();
    //     buy_div.removeClass('tb-hidden').parent('div').show();
    var maxTime = 600000; // 2 seconds
    var time = 0;
    //detecting visibility
    var interval = setInterval(function () {
      if (jQuery('#J_LinkBuy').is(':visible')) {
        // visible, do something
        //         alert('visible');
        ByuBtnClick(document.getElementById('J_LinkBuy'));
        clearInterval(interval);
        time += 100;
      } else {
        if (time > maxTime) {
          // still hidden, after 2 seconds, stop checking
          clearInterval(interval);
          return;
        }
        // not visible yet, do something

        document.title = (maxTime - time) / 1000 + originalTitle;
        time += 100;
      }
    }, 100);
    //click function
    function ByuBtnClick(elem) {
      //       var buy_div = jQuery('.tb-btn-buy');
      //       var buy_div_text = buy_div.children('a').text();
      //       var buy_div_text = elem.text();
      //       elem.text(buy_div_text + '(Купить)') [0].click();
      //       buy_div.children('a').text(buy_div_text + '(Купить)');
      //       buy_div.children('a') [0].click();
      console.log('click');
      elem.click();
      elem.style.background= "blue"
    }
    //for BRONE click
    //     Jquery('#J_Go')[0].click();

    document.getElementById('J_Go').click();
  }
}
