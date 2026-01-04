// ==UserScript==
// @name 康文署活動助手
// @description 使用康文署網站查看活動更為方便，去除已過期或已滿人的活動，下一頁時不去除舊資料
// @namespace lcsdactivityhelper
// @version 0.2
// @match *://www.lcsd.gov.hk/clpss/tc/search/leisure/srchCommRecretSprtProgsForm.do*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/388806/%E5%BA%B7%E6%96%87%E7%BD%B2%E6%B4%BB%E5%8B%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388806/%E5%BA%B7%E6%96%87%E7%BD%B2%E6%B4%BB%E5%8B%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//
$('#submitBtn').on('click', function() {
    $("#pageSearchResult").empty();
});
$('#searchForm').off().submit(function( event ) {
    event.preventDefault();
    var _timestamp = $.now();
    proccessingRequestTimeStamp = _timestamp;
    var valueMonth = $('#month').find(":selected").val();
    var valueSubMonth ="";
    if(valueMonth=='101')
    {
        $('#monthTag').remove();
        $("#month option").each(function(){
            var val_subMonth=$(this).val();
            if(val_subMonth.indexOf('-') >= 0)
            {
                valueSubMonth=val_subMonth;
            }
        });
        $('#sub_month').val(valueSubMonth);
    }
    else
    {
        $('#sub_month').val('');
    }

    // $("#searchResult").empty().addClass("loading");
    // Get some values from elements on the page:
    var frm = this;
    var url = frm.action;
    var trim_word = $("#keyword").val().trim();
    $("#keyword").val(trim_word);
    var frmData = {};
    var re = new RegExp("(\<\/script\>)");
    //var values={};
    if ($('#month').prop('disabled'))
    {
        $('#month').removeAttr('disabled');
    }

    $.each($(this).serializeArray(), function(i, field) {
        if(document.getElementById("langToTranslate").value=="sc"){
            frmData[field.name] = Traditionalized(escapeHtml(field.value));
        }else{
            frmData[field.name] = escapeHtml(field.value);
        }
    });
    var newPath = window.location.pathname.split("/").pop() + "?" + $.param(frmData);
    window.history.pushState(null, null, newPath);
    // Send the data using post
    var posting = $.post(url, frmData);
    // Put the results 
    posting.done(function( data ) {
        if(document.getElementById("pageSearchResult")){
            var content = $(data).find( "#pageSearchResult" );
            content.children().each(function () {
                document.getElementById("pageSearchResult").append(this)
            });
            var nav = $(data).find('[aria-label="Page navigation"]');
            $('[aria-label="Page navigation"]').empty().append(nav)
        } else {
            var content = $(data).find( "#searchResult" );
            if($('#enrolDate').val().trim()!=""){
                $("#month").prop('disabled', true);
            }
            if(proccessingRequestTimeStamp == _timestamp){
                $( "#searchResult" ).removeClass("loading").append(data);
                $('#DesktopViewBtn2').css('display', 'none');
                $('#ListViewLabel2').css('display', 'none');
                $("#DesktopViewBtn2").attr('value', 'clicked');
                $('#MobileViewBtn2').css('display', 'block');
                $('#GridViewLabel2').css('display', 'block');
                scrollVal = $("#searchResult").position().top;
            }
        }
        $("#pageSearchResult").children().each(function () {
            vtd=$(this).children().eq(6)
            text = vtd.text()
            if (text==="已截止報名"){
                this.remove()
            } else {
                text = text.split("(")[1].slice(0,-1)
                if (text==="0"){
                    this.remove()
                }
            }
        });
    });
});
