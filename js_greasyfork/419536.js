// ==UserScript==
// @name        dcDel
// @namespace   Violentmonkey Scripts
// @match       https://gall.dcinside.com/mgallery/board/lists*
// @grant       none
// @version     0.2.4
// @author      -
// @description 2021. 1. 2. 오후 9:43:11
// @downloadURL https://update.greasyfork.org/scripts/419536/dcDel.user.js
// @updateURL https://update.greasyfork.org/scripts/419536/dcDel.meta.js
// ==/UserScript==

var colg = $("colgroup")[0].children[0], th = $("thead")[0].children[0].children[0];
if(colg.getAttribute('style') == 'width:25px') {
  colg.remove();
  th.remove();
}

var issue = $(".ub-content");
for(var i=0; i<issue.length; i++) {
  if(issue[i].getAttribute('data-no') == null) {
    issue[i].remove();
  }
}

var submit_button = $('#avoid_pop').find('button')[0];
var ElementPointNo_Click = null;

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
    
    ElementPointNo_Click = ElementPointNo;
    
    $('#avoid_pop').attr('style', 'left: '+x+'px; top: '+y+'px; position: fixed;');
    //$($('#avoid_pop').find('button')[0]).attr('onclick', "avoid_submit_dcDel($('#avoid_pop'), "+ElementPointNo+")");
    $($('#avoid_pop').find('button')[0]).attr('onclick', "");
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

$(submit_button).click(function(e) {
  var cancelReturn;
  if(ElementPointNo_Click != null) {
    cancelReturn = avoid_submit_dcDel($('#avoid_pop'), ElementPointNo_Click);
    //console.log(cancelReturn);
    if(cancelReturn != 'cancel') ElementPointNo_Click = null;
    //ElementPointNo_Click = null;
    //$('#avoid_pop').hide();
    return;
  }
});

$(document).click(function(e){
  if($('#avoid_pop')[0].getAttribute('style').indexOf('none') == -1) {
    if(ElementPointNo_Click == null) {
      $('#avoid_pop').hide();
    }
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
  
  
  
  
  
  function avoid_submit_dcDel(elm, no, is_cmt) {
	var parent = null;
	var allVals = Array();
    var chk = $('input[name="chk_article[]"]:checked');
    var avoid_hour = $(':radio[name="avoid_hour"]:checked', elm).val();
    var avoid_reason = $(':radio[name="avoid_reason"]:checked', elm).val();
    var avoid_reason_txt = '';
    var del_chk = 0;

    var is_list = chk.length && (typeof(no) == 'undefined' || !no);
    var is_view = typeof(no) != 'undefined' && no > 0 && (typeof(is_cmt) == 'undefined' || !is_cmt);
    var is_comment = chk.length && typeof(no) != 'undefined' && no > 0 && typeof(is_cmt) != 'undefined' && is_cmt;
    
    if(is_comment || is_list) {
    	parent = no;
    	
	    chk.each(function() {
	    	var n_no = $(this).closest('tr, .cmt_info , .reply_info').attr('data-no');
	    	allVals.push(n_no);
	    });
    }
	else if(is_view) {
		allVals.push(no);
	}
    else {
    	alert("게시물을 선택해주세요.");
        return 'cancel';
    }
    
    if(typeof avoid_hour == 'undefined'){
        alert('차단 기간을 선택해주세요.');
        return 'cancel';
    }
    
    if(typeof avoid_reason == 'undefined'){
        alert('차단 사유를 선택하거나 직접 입력해주세요.');
        return 'cancel';
    }
    
    if(avoid_reason == '0') {
        avoid_reason_txt = $(".reason_input", elm).val();
        
        if(avoid_reason_txt == ''){
            alert('차단 사유를 입력해주세요!');
            return 'cancel';
        }
    }
        
    if($("input:checkbox[name='avoid_del']").is(":checked")) {
    	del_chk = 1;
    	
    	if(chk.length > 1) {
	        chk.each(function() {
	        	var data_type = $(this).closest('tr').attr('data-type');
	        	if(data_type == 'icon_notice' || data_type == 'icon_recomimg') {
	        		del_chk = false;
	        	}
	        });
    	}
    	
    	if(del_chk === false) {
    		alert('개념글 또는 공지가 포함된 경우 1개씩만 삭제가 가능합니다.');
    		return;
    	}
    }
    
    $.ajax({
        type : "POST",
        url : "/ajax/"+ get_gall_type_name() +"_manager_board_ajax/update_avoid_list",
        data : { ci_t : get_cookie('ci_c'), id: $.getURLParam('id'), nos : allVals, parent: parent, avoid_hour : avoid_hour, avoid_reason : avoid_reason, avoid_reason_txt : avoid_reason_txt, del_chk : del_chk ,_GALLTYPE_: _GALLERY_TYPE_ },
		dataType : 'json',
        cache : false,
        async : false,
        success : function(ajaxData) {
        	if(typeof(ajaxData.msg) != 'undefined' && ajaxData.msg) {
				alert(ajaxData.msg);
			}
        	
        	if(del_chk == 1) {
        		if($.getURLParam('no')) {
        			if(parent) {
        				$('.btn_cmt_refresh').click();
        			}
        			else {
        				location.href = location.href.replace('view', 'lists').replace(/&no=[0-9]+/, '');
        			}
        		} 
        		else {
        			//location.reload(true);
        		}
        	}
        	
        	//$(elm).hide();
        	$(':radio:checked', elm).prop('checked', false);
        	$(':text', elm).val('');
        	
        	if(chk.length) {
        		$(chk).prop('checked', false);
        		$("#comment_chk_all").prop('checked', false);
        	}
        	
        	if(ajaxData.avoid == 'T') {
        		//console.log('차단');
        		avoid_hour_set();
        	}
        },
        error : function(ajaxData) {
           alert('시스템 오류로 작업이 중지되었습니다. 잠시 후 다시 이용해 주세요.');
        }
    });
}
