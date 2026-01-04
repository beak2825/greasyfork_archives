// ==UserScript==
// @name        dcDel(confirm)
// @namespace   Violentmonkey Scripts
// @match       https://gall.dcinside.com/mgallery/board/lists*
// @grant       none
// @version     0.2.1
// @author      -
// @description 2021. 1. 2. 오후 9:43:11
// @downloadURL https://update.greasyfork.org/scripts/422582/dcDel%28confirm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422582/dcDel%28confirm%29.meta.js
// ==/UserScript==
var colg = $("colgroup")[0].children[0], th = $("thead")[0].children[0].children[0];
if(colg.getAttribute('style') == 'width:3%') {
  colg.remove();
  th.remove();
}

var issue = $(".ub-content");
for(var i=0; i<issue.length; i++) {
  if(issue[i].getAttribute('data-no') == null) {
    issue[i].remove();
  }
}

$(document).on("contextmenu",function(e){
	var ElementPoint, ClosestPoint, ElementPointNo = null;
  ElementPoint = fromPoint(e);
  ClosestPoint = $(ElementPoint).closest("tr")[0];
  
  if(ClosestPoint != undefined) ElementPointNo = ClosestPoint.getAttribute('data-no');
  
  if($(ElementPoint).parent()[0].classList[0] == "nickname") {
    var x, y;
    var nickName = ElementPoint.innerText;
    var nickTd = $(ElementPoint).parent().parent();
    var uid = nickTd[0].getAttribute('data-uid');
    
    if(uid != "") {
      nickName = nickName+'('+uid+')';
    }
    else {
      nickName = nickName+'('+nickTd[0].getAttribute('data-ip')+')';
    }
    
    x = e.pageX - document.scrollingElement.scrollLeft;
    y = e.pageY - document.scrollingElement.scrollTop;
    
    $('#avoid_pop').attr('style', 'left: '+x+'px; top: '+y+'px; position: fixed;');
    $($('#avoid_pop').find('button')[0]).attr('onclick', "avoid_submit($('#avoid_pop'), "+ElementPointNo+")");
    $('#avoid_pop').find('h3')[0].innerText = nickName+' 차단';
    return false;
  }
  
  if(ElementPointNo != null) {
    var delCon = confirm("정말로 삭제하시겠습니까?\n제목: "+ClosestPoint.innerHTML.split("</em>")[1].split("</a>")[0]);
    if(delCon == true) del_custom(ElementPointNo);
    return false;
  }
  else if(ElementPoint.getAttribute('class') == 'btn_write sp_img' || ElementPoint.getAttribute('class') == 'btn_blue write') {
    window.open('https://gall.dcinside.com/mgallery/board/write/?id='+getParameterByName('id'), '_blank').focus();
  }
  else if(ElementPoint.getAttribute('class') == 'sp_img btn_useradmin_go') {
    window.open('https://gall.dcinside.com/mgallery/management?id='+getParameterByName('id'), '_blank').focus();
  }
  //window.location.href
});

$(document).click(function(e){
  if($('#avoid_pop')[0].getAttribute('style').indexOf('display: none;') != -1) {
    return;
  }
  
  if($('#ks-config')[0].getAttribute('class') != 'ks-active') {
    var ElementPoint, ClosestPoint, ElementPointNo = null;
    ElementPoint = fromPoint(e);
    ClosestPoint = $(ElementPoint).closest("tr")[0];

    if(ClosestPoint != undefined) ElementPointNo = ClosestPoint.getAttribute('data-no');

    if(ElementPointNo != null) {
      var goURL;
      if($(ElementPoint).prop('tagName') == 'A') {
        goURL = ElementPoint.getAttribute('href');
      }
      else {
        goURL = $($(ElementPoint).closest("tr").children()[2]).children()[0].getAttribute('href');
      }
      window.open(goURL, '_blank').focus();
      return false;
    }
  }
});

function fromPoint(e) {
  var x, y;
  x = e.pageX - document.scrollingElement.scrollLeft;
  y = e.pageY - document.scrollingElement.scrollTop;
  
  return document.elementFromPoint(x, y);
}

function del_custom(no) {
  var allVals = Array();
    
  allVals.push(no);

  if(true){

      $.ajax({
          type : "POST",
          url : "/ajax/"+ get_gall_type_name() +"_manager_board_ajax/delete_list",
          data : { 'ci_t': get_cookie('ci_c'), 'id': $.getURLParam('id'), 'nos': allVals ,_GALLTYPE_: _GALLERY_TYPE_ },
      dataType : 'json',
          cache : false,
          async : false,
          success : function(ajaxData) {
        if(typeof(ajaxData.msg) != 'undefined' && ajaxData.msg) {
           //alert(ajaxData.msg);
        }

        if(ajaxData.result == "success") {
          //location.reload(true);
        }
          },
          error : function(data) {
             alert('시스템 오류로 작업이 중지되었습니다. 잠시 후 다시 이용해 주세요.');
          }
      });
  }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}






var target = $('.gall_list').children()[3];
var observer = new MutationObserver(function(mutations) { mutations.forEach(function(mutation) { autoDel(); }); }); 
var config = { childList: true }; 
observer.observe(target, config);

setTimeout(function() {
  newNav();
}, 1000);


function newNav() {
  $("<h2 class='ks-config-item'>정규표현식</h2><div class='ks-config-item ks-config-key'><textarea id='inPattern' style='width: 500px; height: 500px;'></textarea></div>").appendTo($($('#ks-config').children()[0]));
}

function autoDel() {
  var wordPattern = $('#inPattern')[0].value.split('\n');
  var list = $('.gall_tit');
  
  for(var i=0; i<list.length; i++) {
    var tit = $(list[i]).children()[0].innerHTML.split('</em>')[1];
    var dataNo = $(list[i]).parent()[0].getAttribute('data-no');
    if($(list[i]).parent()[0].getAttribute('class').indexOf('ks-deleted') != -1) {
      continue;
    }
    for(var j=0; j<wordPattern.length; j++) {
      var temp = eval('/'+wordPattern[j]+'/');
      if(temp == undefined) break;
      if(temp.test(tit) == true) {
        console.log('「'+tit+'」게시글이 정규표현식에 따라 삭제되었습니다.');
        del_custom(dataNo);
        break;
      }
    }
  }
}