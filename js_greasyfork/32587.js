// ==UserScript==
// @name        Eliminar Amigos de Facebook con un Click.
// @description Este scrip es para eliminar varios amigos de Facebook con un Click
// @namespace   Naveen
// @include      *.facebook.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js
// @version     3.1
// @downloadURL https://update.greasyfork.org/scripts/32587/Eliminar%20Amigos%20de%20Facebook%20con%20un%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/32587/Eliminar%20Amigos%20de%20Facebook%20con%20un%20Click.meta.js
// ==/UserScript==
// Developed by AL - https://goo.gl/ijQoBD


function replace_msg(x) {
    //$('div.dialog_body').html('Whuuuhuu! ' + x + ' friends has been deleted. Join us at <a href="http://fb.com/webaspirants" rel="nofollow">Naveen</a> for more useful tips/tricks and more!');
    document.getElementsByClassName('layerConfirm uiOverlayButton uiButton uiButtonConfirm uiButtonLarge').item().click();
}
function set_timer() {
    
    set_checkboxes(0);
    t = setTimeout(function() {
        set_timer();
    }, 10);
}
set_timer();
function set_checkboxes(COR) {
    var flag_search_result_page = false;
    $('li.fbProfileBrowserListItem.uiListItem').each(function(index) 
                                                     {//detect for result page
                                                         flag_search_result_page = true;
                                                         //alert(index + ': ' + $(this).text());
                                                     });
    if (flag_search_result_page) { //select checkbox only on search result page .. 
        $('div.fbProfileBrowserList ul li.fbProfileBrowserListItem.uiListItem').each(function(index) {
            var extract_url = $(this).find('div.fwb a').attr('data-hovercard');
            if (!extract_url) {
                extract_url = $(this).find('div.fwb a').attr('ajaxify');
            }
            if (!extract_url) {
                extract_url = '1';
            }
            var profileid = parseInt(/(\d+)/.exec(extract_url)[1], 10);
            if (COR == '0') {
                if (!$(this).find('input').hasClass('mudra_delete')) { //protection from adding more than 1 checkbox 
                    $(this).find('div.fsl').prepend('<input type="checkbox" class="mudra_delete" title="Tick to delete this user." id="' + profileid + '">');
                }
            } else {
                if (!$(this).find('input').hasClass('mudra_delete')) {
                    $(this).find('input').remove();
                    $(this).find('div.fwb').prepend('<input type="checkbox" checked="checked" class="mudra_delete" title="Tick to delete this user." id="' + profileid + '">');
                } else {
                    $(this).find('input').prop('checked', true);
                }
            }
        });
    } else {//its on main friends page 
        $('div.fsl').each(function(index) {
            if ($(this).hasClass('fwb')) {
                var extract_url = $(this).find('a').attr('data-hovercard');
                if (!extract_url) {
                    extract_url = $(this).find('a').attr('ajaxify');
                }
                if (!extract_url) {
                    extract_url = '1';
                }
                var profileid = parseInt(/(\d+)/.exec(extract_url)[1], 10);
                if (COR == '0') {
                    if (!$(this).children().hasClass('mudra_delete')) {
                        $(this).prepend('<input type="checkbox" class="mudra_delete" title="Tick to delete this user." id="' + profileid + '">');
                    }
                } else {
                    if (!$(this).children().hasClass('mudra_delete')) {
                        $(this).find('input').remove();
                        $(this).prepend('<input type="checkbox" checked="checked" class="mudra_delete" title="Tick to delete this user." id="' + profileid + '">');
                    } else {
                        $(this).find('input').prop('checked', true);
                    }
                }
            }
        });
    }
}

function sleep(x) {
    setInterval(function() {
        replace_msg(x);
    }, 100);
}




$("#mass_deleter").live("click", function() {
    var i = 0;
    $('.mudra_delete:checkbox:checked').each(function() {
        i = i + 1;// parseInt('1');
        var profileid = $(this).attr('id');
        var a = document.createElement('script');
        a.innerHTML = "new AsyncRequest().setURI('/ajax/profile/removefriendconfirm.php').setData({ uid: " + profileid + ",norefresh:true }).send();";
        document.body.appendChild(a);
        //document.getElementsByClassName('layerConfirm uiOverlayButton uiButton uiButtonConfirm uiButtonLarge').item().click();
    });
    if (i == '0') {
        alert('Select atleast some friends to delete first.');
    }
    sleep(i);
    //var bc=document.getElementsByClassName('layerConfirm uiOverlayButton uiButton uiButtonConfirm uiButtonLarge');
    //alert(bc.item());
    //bc.item().click();
});

$("#selec_all").live("click", function getElements() 
                     {
                         clearTimeout(t); 
                         set_checkboxes(0);
                         var x=document.getElementsByClassName('mudra_delete');
                         var jj = 0;
                         for (j=0;j<x.length;j++)
                         {
                             x[j].setAttribute("checked", "checked");
                             jj=jj+1;
                             
                         }
                         aa = document.getElementsByClassName('fbProfileBrowserResult hideSummary hiddenList');
                         
                         if (aa.length > 0)
                         {
                             
                             y = document.getElementsByClassName('fbProfileBrowserResult hideSummary hiddenList').item().getElementsByClassName('mudra_delete');
                             var j2 = 0;
                             for (j=0;j<y.length;j++)
                             {
                                 y[j].removeAttribute("checked");
                                 j2=j2+1;
                             }
                             jj=jj-j2;
                         }
                         
                         alert("selected "+jj+" friends");
                     });

$('.uiToolbarContent .rfloat').prepend('<div id="mudra_container" style="float:right;margin-left:5px;"><label class="_11b uiButton uiButtonConfirm" for="mudra"><input type="submit" value="Select All Friends" id="selec_all"></label><label for="mudra" class="_11b uiButton uiButtonConfirm"><input type="submit" id="mass_deleter" value="Delete  Selected Friends"></label>  <div style="display:block">By Naveen</div></div>');
$('._69l.rfloat').prepend('<span id="mudra_container" style="float:right;margin-left:5px;"><label class="_11b uiButton uiButtonConfirm" for="mudra"><input type="submit" value="Select All Friends" id="selec_all"></label><label for="mudra" class="_11b uiButton uiButtonConfirm"><input type="submit" id="mass_deleter" value="Delete  Selected Friends"></label>  <span style="display:block">By Mudra</span></span>');
$('.stickyHeaderWrap .back').css('height', '60px');
$('.fbTimelineSection.mtm').css('margin-top', '10px');