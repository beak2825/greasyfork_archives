// ==UserScript==
// @name        ib-happyforme-name
// @namespace   happyforme
// @description 大虫换名
// @include     http://cells.happyfor.me/agar.html*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24405/ib-happyforme-name.user.js
// @updateURL https://update.greasyfork.org/scripts/24405/ib-happyforme-name.meta.js
// ==/UserScript==

!(function(window, $){


  var nickInput = $('#nick');
  var btnSubmit = $('#playBtn');
  var gameCanvas = $('canvas');
  var chatBox = $('#chat_textbox');

  var conf = {
    def: '', // 默认名称
    seed: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    max: 10,
    run: false,
    process: null,
    isTyping: false
  };

  gameCanvas.bind('focus', function(){
    conf.isTyping = false;
  });

  chatBox.bind('blur', function(){
    conf.isTyping = false;
  });

  chatBox.bind('focus', function(){
    conf.isTyping = true;
  });

  function genName(){
    var res = [];
    for (var i=conf.max; i-->0;) {
      var rand = Math.floor(Math.random()*((conf.seed.length-1)-0)+0);
      res.push(conf.seed[rand]);
    }
    return res.join('');
  }

  function exec(){
       if (!conf.run) {
         console.log(conf.process);
         if (conf.process)
           window.clearInterval(conf.process);
         setNick(conf.def);
         return false;
       }

    // console.log(conf.run);
    conf.process = window.setInterval(function(){
       var name = genName();
       setNick(name);
    }, 500);
  }

  function setNick(name) {
      nickInput.val(name);
      btnSubmit.click();
  }

  $(window).bind('keydown', function(e){
    if (conf.isTyping)
      return;

    switch(e.keyCode) {
        // z
        case 90:
          conf.run = !conf.run;
          exec();
          break;
    }
  });

  setNick(conf.def);

})(window, jQuery);
