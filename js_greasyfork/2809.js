// ==UserScript==
// @name        Auto save for OurCoders
// @namespace   http://lovearia.me
// @include     http://ourcoders.com/*
// @version     0.0.5
// @grant       none
// @description none
// @downloadURL https://update.greasyfork.org/scripts/2809/Auto%20save%20for%20OurCoders.user.js
// @updateURL https://update.greasyfork.org/scripts/2809/Auto%20save%20for%20OurCoders.meta.js
// ==/UserScript==

$(document).ready(function(){

  var my_pathname_match_list = [];//{{{
  var save_frequency = 3000;

  my_pathname_match_list.push({
    name : 'new thread',
    match : /\/thread\/new\/?/,
    selector_list : ['#wmd-input', '#title'],
    clear_list : ['#newform']
  });

  my_pathname_match_list.push({
    name : 'comment for thread',
    match : /\/thread\/show\/\d+\/?/,
    selector_list : ['#wmd-input'],
    clear_list : ['#newreplyform']
  });//}}}

  var AutoSave = function(s_l, c_l, f, p){//{{{
    var change_signal = false;

    var selector_list = s_l;
    var clear_list = c_l;
    var frequency = f;
    var prefix = p;

    var save = function(){
      selector_list.forEach(function(item){
        if($(item).val())
          localStorage.setItem(p+item, $(item).val());
        else
          localStorage.removeItem(p+item);

        console.log(item, ' saved in ', p+item)
        change_signal = false;
      });
    };

    var clear = function(){
      selector_list.forEach(function(item){
        localStorage.removeItem(p+item);
        console.log(item, ' remove form ', p+item)
        change_signal = false;
      });
    };

    var init = function(){
      selector_list.forEach(function(item){
        $(item).change(function(){
          change_signal = true;
          console.log(item, 'changed');
        });

        var content = localStorage.getItem(p+item);
        if(content)
          $(item).val(content);
      });

      clear_list.forEach(function(item){
        $(item).submit(function(){
          clear();
        });
      });
      console.log('init');

    };

    this.start = function(){
      init();
      setInterval(function(){
        if(change_signal)
          save();
      }, f);
    };

  };//}}}

  var distributor = function(p_m_l){//{{{
    var pathname_match_list = p_m_l;

    pathname_match_list.forEach(function(item){

      if(location.pathname.match(item.match)){
        var as = new AutoSave(item.selector_list, item.clear_list, save_frequency, location.pathname);
        as.start();
        console.log(item);
      }
      else{
        return;
      }

    });
  }//}}}

  distributor(my_pathname_match_list);

});


//(function(){
    //var change = false;
    //var title = $('#title');
    //var input = $('#wmd-input');
    //var form = $('#newform');

    //(function(){
        //if(localStorage.input_cache){
            //input.val(localStorage.input_cache);
            //title.val(localStorage.title_cache);
        //}
        //input.after('<p id="is_save" style="background: none repeat scroll 0% 0% rgba(205, 251, 196, 1);"></p>');
    //})();

    //var is_save = $('#is_save');

    //var save = function(){
       //localStorage.input_cache = input.val();
       //localStorage.title_cache = title.val();

       //var d = new Date();
       //var d_s = d.toLocaleTimeString();
       //is_save.html('latest saved at '+d_s);
       //is_save.animate({opacity:'0.6'});
       //is_save.animate({opacity:'1'});
    //}

    //input.change(function(){
        //change = true;
    //});

    //title.change(function(){
        //change = true;
    //});

    //form.submit(function(){});

    //setInterval(function(){
        //if (change){
            //save();
            //change = false;
        //}

    //}, 10000);

//})();
