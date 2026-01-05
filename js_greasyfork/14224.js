
var acfix_setScroll = false;

(function() {
    setInterval(doFix, 200);
})();

function fixScroll() {
  $('.right_-main').css("position", "relative");
  $('#area-title-view').css('position', 'relative');
/*
  $('#txt-title-view').css('margin-top', '0');
  $('#article-mainer #title_1 #txt-info-title').css('display', 'none');
  $('#article-mainer #title_2').css('display', 'block').css('margin-top', 0);
  $('#article-mainer #title_2').insertBefore($('#txt-title-view'));
  $('#article-mainer #title_1').insertBefore($('#txt-title-view'));
  $('#article-mainer #title_1').css('margin', 0).css('position', 'absolute').css('right', 0);
*/
}

function processDuplicateQuotes() {
    $('.item-quote-hidden').toArray().forEach(function(q) {
        var c = $(q).children();
        if ($(q).attr('acfixCommentToggleProcessed') != '1') {
            var id;
            $(c).toArray().forEach(function(p) {
                if ($(p).hasClass("acfixCommentTooggle") == false) {
                    $(p).css('display', 'none');
                    id = $(p).attr('id');
                }
            });
            $(q).append($("<div class='acfixCommentTooggle' onclick=\"javascript:acfix_toggleDuplicateQuotes(this)\">显示隐藏楼层</div>"));
            $(q).attr('acfixCommentToggleProcessed', '1');
        }
    });
}

function acfix_toggleDuplicateQuotes(e) {
    if ($(e).html() == '显示隐藏楼层') {
        $(e).prev().css('display', 'block');
        $(e).html('隐藏重复楼层');
    } else {
        $(e).prev().css('display', 'none');
        $(e).html('显示隐藏楼层');
    }
}

function doFix() {
  try{
    if (document.getElementById('article-mainer') != null) {
      fixScroll();
      if (acfix_setScroll == false && document.getElementsByClassName('right_-main') != null) {
          $(window).on('scroll', fixScroll);
//          acfix_setScroll = true;
      }
      $('#article-mainer').css('width', '1032px');
      $('#article-mainer .right_').css('width', '220px');
      $('#article-mainer>.left_').css('width', '800px');
      $('#article-mainer>.left_ #area-title-view').css('width', '800px');
      $('.right_-main .divtop').css('width', '220px').css('margin-left', 0).css('height', 'auto');
      $('.right_-main .divtop').append("<span class=\"clearfix\"></span>");
      $('.right_-main .divtop>.left_').css('margin-left', '0px').css('width', '60px');
      $('.right_-main .divtop .right').css('width', '190px').css('margin-left', 0);
      $('.right_-main .divtop>.right_').css('margin-left', '10px');
      $('.right_-main .divtop .divtop_bottom').css('width', '188px').css('font-size', '12px');
      $('.right_-main .divmiddle').css('width', '220px').css('margin-left', 0);
      $('.right_-main .divmiddle .div_right').css('display', 'none');
      $('.right_-main .divmiddle .div_left').css('width', '100%');
      $('.right_-main .divmiddle .div_left .div_left_top').css('margin-left', 0);
      $('.right_-main .divmiddle .div_left .div_left_top .img2').css('display', 'none');
      $('.right_-main .divmiddle .div_left .div_left_bottom_left').css('width', '140px');
      $('.right_-main .divmiddle .div_left .div_left_bottom_left .radio_').css('margin-left', '10px');
      $('.right_-main .right_ .bottom_').css("font-size", "12px");
      $('.right_-main .right_').css("width", "130px");
      $('.right_-main .divbottom').css('width', '220px').css('padding', '10px 0').css('margin', 0);
      $('.right_-main .divbottom .sharetofrend').css('width', '150px').css('margin-right', 0);
    }

    if (document.getElementById('area-comment') != null) {
      $('.author-comment.top .name').css("color", "#aaa");
      $('.item-comment.item-comment-quote .author-comment').css("float", "right");
      $('.item-comment.item-comment-quote .author-comment.top').css("display", "block").css("float", "none");
      $('.item-comment.item-comment-quote .author-comment.top .time_').css("display", "none");
      $(".item-comment.item-comment-quote").toArray().forEach(function(q){
          c = $(q).children();
          var t,m;
          if (c.size() == 4) {
              t = c[1];
              m = c[3];
          } else if (c.size() == 3) {
              t = c[0];
              m = c[2];
          }
          if ($(t).hasClass("top")) {
              $(t).insertAfter(m);
          }
      });
      $('#area-comment').css('width', '1032px').css('left', '0px').css('margin', '0 auto');
      $('#area-editor').css('width', '990px').css('left', '10px').css('margin', '0 auto');
      $('#btn-top-shortcut').css('left', '1240px');
      $('.item-comment').css('padding-bottom', "0px");
      processDuplicateQuotes();
    }
  } catch (e) {
  }
}