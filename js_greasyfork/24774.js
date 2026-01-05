// ==UserScript==
// @name        Персональный wordstat
// @namespace   cust_ws
// @author	Wasily Gerlahk
// @include     *wordstat.yandex.ru*
// @version     2016.11.28
// @description:en wordstat helper
// @grant       none
// @description wordstat helper
// @downloadURL https://update.greasyfork.org/scripts/24774/%D0%9F%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20wordstat.user.js
// @updateURL https://update.greasyfork.org/scripts/24774/%D0%9F%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20wordstat.meta.js
// ==/UserScript==

(function(){
  
  if(self.name!==top.name){
    return ;
  }
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(addElements);
  var added_sign_class = 'added_minus_x';
  var doObserver = function() {
    observer.observe(contentBlock.get(0), {childList: true, subtree: true});
  };
  var contentBlock = $('.b-wordstat-content');
  var item_wrapper = '.b-word-statistics__td-phrase';
  function addElements(){
    var additional_class = 'x-w-reaady';
    var wrapper = $('.b-word-statistics__including-phrases')
    var ready = (function(){
      return wrapper.hasClass(additional_class);
    })()
    $(item_wrapper).css({'position':'relative'});
    wrapper.addClass(additional_class);
    if(ready){
      return ;
    }
	var phrases = $('.b-word-statistics__including-phrases .b-phrase-link__link');
    if (phrases.length) {
      $('.b-word-statistics__including-phrases .b-phrase-link__link').each(function(){
        var text = this.innerHTML.split(' ');
        
        text = $(text).map(function(){
          var str_text = this.toString();
          if(str_text.indexOf('+')===0){
            //console.log(this)
            return str_text;
          }
          return str_text = ' <span class="added_sign_class">&mdash;</span>' + '<span>' + str_text + '</span>';
          console.log(str_text)
        })
        
        text = Array.from(text).join(' ');
        var item = $('<a>').attr('href','https://wordstat.yandex.ru/#!/?words=').addClass('added_span_x').html(text)
          .css({position:'absolute',top:0,left:25, cursor:'pointer'})
          .insertAfter($(this).parent());
        $('<span/>').attr('data-new-tab',true)
          .css({
            color: '#944',
            fontWeight: 'bolder',
            fontSize: 'larger',
           })
          .html(' &rarrpl;').appendTo(item);
        $(this).parent().parent().height(item.height())
        $(this).css('opacity',0)
      })
    }
  }
  
  $('body').on('click', '.added_span_x', function(ev){
    var $t = $(ev.target);
    if($t.hasClass('added_sign_class')){
       $('.b-form-input__input').val($('.b-form-input__input').val()+' -'+$t.next().text())
    } else if($t.attr('data-new-tab')){
      var minusWords = (function(search){
        var s_words = search.split(' '),
            a_words = [];
        $(s_words).each(function(){
          if( this.indexOf('-') === 0 ){
             a_words.push(this);
           }
        });
        s_words = a_words.join(' ');
        return ' ' + s_words;
      })($('.b-form-input__input').val());
      var search_url = $(this).prev().children().first().attr('href');
      search_url += encodeURIComponent(minusWords);
      window.open(search_url);
    } else{
      var elem = $(this).prev().children().first();
      $('.b-form-input__input').val(elem.text())
      setTimeout(function(){
               $('.b-search.i-bem.b-search_js_inited').submit();
           },500);
    }
    //console.log($t.parent().prev())
    ev.preventDefault();
    ev.stopPropagation();
    //return false;
  })
  
  addElements();
  doObserver();
  
  
  
})()