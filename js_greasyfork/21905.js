// ==UserScript==
// @name       nyaa preview script
// @namespace  http://www.nyaa.se/
// @version    0.59
// @description  nyaa list preview script
// @include     http*://*.nyaa.*/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant      none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/21905/nyaa%20preview%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/21905/nyaa%20preview%20script.meta.js
// ==/UserScript==

var nyaaDomain = window.location.hostname.indexOf("sukebei") > -1 ? "sukebei" : "normal";
var nyaaType = "preload";
var nyaaImgWidthCheck = true;
var nyaaImgWidth = 480;
var nyaaImgLoad = true;
var nyaaPageTab = true;
var nyaaPreview = true;

var imgThumbLoad = true;
var nyaaImgObj = new Image();
var overData = {};
var overPos = {x:0,y:0};
var overInterval = null;
var nyaaListData = [];
var nyaaTableList = null;
$(function() {
    var getTable = $("table.tlist");
    
    //init
    $("head").append('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css">' +
                     '<style>.viewdescription img{max-width:' + nyaaImgWidth + 'px}#popup_nyaa_setup{display:none;position:fixed;right:5px;top:5px;padding:10px;width:260px;border:1px solid #000;border-radius:4px;box-shadow:0 0 4px rgba(0,0,0,0.4);background:#fff;z-index:1010}' +
                     '#popup_nyaa_setup .btn_close{display:block;position:absolute;right:0;top:0;width:30px;height:30px;line-height:30px;text-align:center;font-size:16px;color:#000}' +
                     '#btn_nyaa_setup{display:block;position:fixed;right:5px;top:5px;width:28px;height:28px;line-height:28px;text-align:center;font-size:16px;color:#000;border:1px solid #000;border-radius:4px;background:#fff;z-index:1000}' +
                     '#popup_nyaa_setup .input_box{height:24px}#popup_nyaa_setup .input_box .label, #popup_nyaa_setup .input_box .toggle_box{display:block;position:relative;float:left;margin:0 10px 0 0;padding:0;height:24px;line-height:24px;font-size:13px;color:#bbb}' +
                     '#popup_nyaa_setup .toggle_box input{position:absolute;left:-10000px;top:-10000px}#popup_nyaa_setup .toggle_box i{display:inline-block;margin:-1px 6px 0 0;vertical-align:middle;font-size:20px;color:#60b0f0}#popup_nyaa_setup .toggle_box .fa-toggle-on{display:none}#popup_nyaa_setup .toggle_box input:checked + i{display:none}#popup_nyaa_setup .toggle_box input:checked + i + i{display:inline-block}#popup_nyaa_setup .toggle_box input:checked + i + i + span{color:#333;font-weight:700}' +
                     '#popup_nyaa_setup .desc_box p{display:none;margin:0;padding:0 0 0 5px;line-height:18px;font-size:12px;color:#666}#popup_nyaa_setup .desc_box .on{display:block}' +
                     '#popup_nyaa_setup .input_text{float:left;padding:0 5px;margin:0 3px 0 5px;width:40px;height:22px;text-align:right;font-size:12px;color:#333;border:1px solid #ccc;border-radius:3px}#popup_nyaa_setup .unit{float:left;height:24px;line-height:24px;font-size:13px;color:#666}' +
                     'tr.tlistrow:not(.preview_box):hover td{filter:alpha(opacity=80);opacity:0.8;background-color:#ddd}tr.trusted.tlistrow:not(.preview_box):hover td{filter:alpha(opacity=80);opacity:0.8;background-color:#72c586}#popup_view{display:none;position:absolute;left:-10000px;top:0;z-index:1000;border:2px solid #000;border-radius:3px;background:#fff}#popup_view img{display:block;width:320px}#popup_view p{margin:0;padding:5px;font-size:12px;color:#000}#popup_view span{margin-right:4px;font-size:16px;color:#d9534f}' +
                     '.nyaa_prevlist td{padding:2px}.nyaa_prevlist td p{margin:0;padding:2px 5px;color:#fff;font-size:12px;background-color:#a50c0c}.nyaa_prevlist td i{margin-right:4px;font-size:14px}' +
                     '#popup_preview_msg{position:fixed;left:50%;top:40px;margin-left:-300px;padding:10px;font-size:13px;color:#000;border:2px solid #000;border-radius:3px;background:#fff;z-index:500}' +
                     '</style>');
        
    $('<div id="popup_nyaa_setup"><a href="#" title="냐토렌트 유저스크립트 설정 닫기" class="btn_close"><i class="fa fa-times" aria-hidden="true"></i></a>' +
      '<div class="input_box toggle_type"><label class="toggle_box"><input type="radio" name="toggle_type" value="preload" checked="checked" class="radio"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>내용 불러오기</span></label><label class="toggle_box"><input type="radio" name="toggle_type" value="mouseover" class="radio"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>마우스 오버</span></label></div>' +
      '<div class="desc_box desc_type" style="margin-bottom:8px"><p class="desc on">- 리스트 하단에 상세 내용 표시 (스크롤 기준)</p><p class="desc">- 리스트에 마우스 오버시 썸네일 이미지 표시</p></div>' +
      '<div class="input_box toggle_preload"><label title="내용 불러오기시 표시되는 이미지의 최대 넓이 설정" class="toggle_box"><input type="checkbox" checked="checked" class="check"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>이미지 최대 넓이</span></label><input type="text" id="nyaa_img_width" class="input_text" value="480"><span class="unit">px</span></div>' +      
      '<div class="input_box toggle_original"><label title="썸네일의 원본 이미지 불러오기" class="toggle_box"><input type="checkbox" checked="checked" class="check"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>원본 이미지 불러오기</span></label></div>' +      
      '<div class="desc_box desc_original"><p class="desc">- 일부 썸네일 이미지에 한해서 가능하며, <br> &nbsp; 문제가 생길 경우 사용을 중지해주세요.</p></div>' +
      '<div class="input_box toggle_tab"><label title="상세 페이지 새 탭으로 열기" class="toggle_box"><input type="checkbox" checked="checked" class="check"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>상세 페이지 새 탭으로 열기</span></label></div>' +
      '<div class="input_box toggle_preview"><label title="이전에 읽은 위치 표시" class="toggle_box"><input type="checkbox" checked="checked" class="check"><i class="fa fa-toggle-off" aria-hidden="true"></i><i class="fa fa-toggle-on" aria-hidden="true"></i><span>이전에 읽은 위치 표시</span></label></div>' +
      '</div><a href="#" id="btn_nyaa_setup" title="냐토렌트 유저스크립트 설정 열기"><i class="fa fa-cog" aria-hidden="true"></i></a>').appendTo("body");
    
    if(getTable.hasClass("previewload") || getTable.hasClass("previewover")) {
        $("body").append("<div id='popup_preview_msg'>이전 유저스크립트를 사용중입니다. 이전에 설치한 유저스크립트를 사용 중지 해주시거나 삭제해주세요.</div>");
        $("#popup_preview_msg").on("click",function() {
            $("#popup_preview_msg").stop(true,true).fadeOut(300);
        });        
    }
    
    //팝업
    $("#btn_nyaa_setup").on("click", function() {
        $("#popup_nyaa_setup").stop(true,true).fadeIn(300);
        return false;
    });
    $("#popup_nyaa_setup .btn_close").on("click", function() {
        $("#popup_nyaa_setup").stop(true,true).fadeOut(300);
        return false;
    });
    
    //설정
    var nyaaSaveCheck = true;
    function nyaaSave() {
        if(!nyaaSaveCheck) return;
        nyaaType = $("#popup_nyaa_setup .toggle_type .radio:checked").val();
        nyaaImgWidthCheck = $("#popup_nyaa_setup .toggle_preload .check").is(":checked");
        nyaaImgWidth = $("#nyaa_img_width").val();
        if(nyaaImgWidth == "" || isNaN(nyaaImgWidth)) {
            nyaaImgWidth = 480;
            $("#nyaa_img_width").val(nyaaImgWidth);
        }
        $("head").append('<style>.viewdescription img{max-width:' + nyaaImgWidth + 'px}');
        nyaaImgLoad = $("#popup_nyaa_setup .toggle_original .check").is(":checked");
        nyaaPageTab = $("#popup_nyaa_setup .toggle_tab .check").is(":checked");
        nyaaPreview = $("#popup_nyaa_setup .toggle_preview .check").is(":checked");
        var nyaaSetupArray = [nyaaType,nyaaImgWidthCheck,nyaaImgWidth,nyaaImgLoad,nyaaPageTab,nyaaPreview,"","","","","",""];
        setCookie("nyaasetup",nyaaSetupArray.join("|^"),365);                
    }
    $("#popup_nyaa_setup .toggle_type .radio").on("change", function() {
        $("#popup_nyaa_setup .desc_type p").removeClass("on").eq(this.value == "preload" ? 0 : 1).addClass("on");        
    });
    $("#popup_nyaa_setup .toggle_original .check").on("change", function() {
        $("#popup_nyaa_setup .desc_type p").removeClass("on").eq(this.value == "preload" ? 0 : 1).addClass("on");
        if(this.checked) $("#popup_nyaa_setup .desc_original p").addClass("on");
        else $("#popup_nyaa_setup .desc_original p").removeClass("on");        
    });
    $("#popup_nyaa_setup input").on("change", function() {
        nyaaSave();
    });
    
    //저장
    var getNyaaSetup = getCookie("nyaasetup");
    if(getNyaaSetup && getNyaaSetup != "") {
        var nyaaSetup = getNyaaSetup.split("|^");
        nyaaSaveCheck = false;
        $("#popup_nyaa_setup .toggle_type .radio[value='" + nyaaSetup[0] + "']").prop("checked",true).trigger("change");
        $("#popup_nyaa_setup .toggle_preload .check").prop("checked",nyaaSetup[1].toString() == "true").trigger("change");
        $("#nyaa_img_width").val(nyaaSetup[2]);
        $("#popup_nyaa_setup .toggle_original .check").prop("checked",nyaaSetup[3].toString() == "true").trigger("change");
        $("#popup_nyaa_setup .toggle_tab .check").prop("checked",nyaaSetup[4].toString() == "true").trigger("change");
        $("#popup_nyaa_setup .toggle_preview .check").prop("checked",nyaaSetup[5].toString() == "true" || (nyaaSetup[5].toString() == "" && nyaaPreview)).trigger("change");
        nyaaSaveCheck = true;
        nyaaSave();
    }
    
    
    //리스트일 경우
    if(getTable.length > 0) {
        getTable.addClass("previewload previewover");
        
        //이전 페이지 표시
        nyaaListPage("load");
        
        //mouselover
        var nyaaBodyEvent = null;
        $("body").on("mousemove", function(e) {
            overPos.x = e.pageX;
            overPos.y = e.pageY;
            nyaaBodyEvent = e;
        });
        getTable.find("tr.tlistrow td.tlistname").hover(
            function() {
                clearTimeout(overInterval);
                nyaaImgObj.onload = function() {};
                imgThumbLoad = false;
                $("#popup_view").hide();
                if(nyaaType == "mouseover") {
                    overInterval = setTimeout(function() {
                        var getTarget = $(nyaaBodyEvent.target);
                        var targetCheck = false;
                        
                        if(getTarget.length > 0) {
                            if(getTarget.hasClass("tlistname")) targetCheck = true;
                            else {
                                getTarget = getTarget.closest(".tlistname");
                                if(getTarget.length > 0) targetCheck = true;
                            }
                        }
                        if(targetCheck) nyaaMouseLoad(getTarget);
                    },100);            
                }
            },
            function() {
                clearTimeout(overInterval);
                if(nyaaType == "mouseover") {
                    overInterval = setTimeout(function() {
                        $("#popup_view").stop(true,true).fadeOut(200);
                    },300);            
                }            
            }            
        );

        //preload
        nyaaTableList = getTable.find("tr.tlistrow");
        var preloadScrollInterval = null;
        var preloadResizeInterval = null;
        $(window).on("scroll", function() {
            clearTimeout(preloadScrollInterval);        
            preloadScrollInterval = setTimeout(function() {
                preloadScroll();
            }, 100);
        }).on("resize", function() {
            clearTimeout(preloadResizeInterval);        
            preloadResizeInterval = setTimeout(function() {
                nyaaPageHeight = $(window).height();
            }, 100);
        });

        nyaaPageHeight = $(window).height();
        preloadScroll();
        
        if(nyaaPageTab) {
            getTable.find("tr.tlistrow td.tlistname a").attr("target","_blank");
        }
        
        getTable.find("tr.tlistrow td.tlistdownload a").attr("target","_blank");        
    }
    else if($(".viewdescription").length > 0) {
        var getPreviewBox = $(".viewdescription");
        getPreviewBox.find("a").attr("target","_blank");
        if(nyaaImgLoad) {
            getPreviewBox.find("img").each(function() {
                var getImgEle = $(this);
                var getImgSrc = getImgEle.attr("src");
                var getSrc = previewOriginalLoad(getImgEle);

                if(getSrc != "") {
                    var imgObj = new Image();
                    imgObj.onload = function() {
                        getImgEle.attr("src",getSrc).closest("a").attr("href",getSrc);
                    };
                    imgObj.src = getSrc;
                }
            });
        }
    }
});

var nyaaPageHeight = 0;
var nyaaPageMargin = 150;
var nyaaListData = [];
var nyaaListInterval = null;
var nyaaListDelay = 200;
function preloadScroll() {
    var getScrollTop = $(window).scrollTop();
    if(nyaaType == "preload") {
        clearTimeout(nyaaListInterval);
        nyaaListData = [];
        nyaaTableList.each(function() {
            var getList = $(this);
            if(getList.offset().top > getScrollTop && getList.offset().top < getScrollTop + nyaaPageHeight + nyaaPageMargin) {
                if(!$(this).hasClass("loaded")) {
                    nyaaListData.push(getList);
                }
                else nyaaListPage("save",getList);
            }
        });
        
        if(nyaaListData.length > 0) nyaaPageLoad(-1);
    }
    else if(nyaaType == "mouseover") {
        nyaaTableList.each(function() {
            var getList = $(this);
            if(getList.offset().top > getScrollTop && getList.offset().top < getScrollTop + nyaaPageHeight) {                
                nyaaListPage("save",getList);                
            }
        });
    }
}

function nyaaPageLoad(idx) {
    var getIdx = idx + 1;
    if(nyaaListData[getIdx] != undefined) {
        var getData = nyaaListData[getIdx];
        var getUrl = getData.find("td.tlistname a").attr("href");
        if(getUrl != "") {
            $.ajax({
                type: "POST",
                url:getUrl,
                dataType:"html",
                success:function(data) {
                    if(getData.hasClass("loaded")) return;
                    getData.addClass("loaded");
                    var getDesc = $(data).find(".viewdescription");
                    if(getDesc.length > 0) {
                        var getPreviewBox = $("<tr class='tlistrow preview_box'><td colspan='8' style='padding:5px' class='viewdescription'></td></tr>").insertAfter(getData);
                        getPreviewBox.find("td").html(getDesc.html());
                        getPreviewBox.find("a").attr("target","_blank");
                        if(nyaaImgLoad) {
                            getPreviewBox.find("img").eq(0).each(function() {
                                var getImgEle = $(this);
                                var getImgSrc = getImgEle.attr("src");
                                var getSrc = previewOriginalLoad(getImgEle);
                                
                                if(getSrc != "") {
                                    var imgObj = new Image();
                                    imgObj.onload = function() {
                                        getImgEle.attr("src",getSrc).closest("a").attr("href",getSrc);
                                    };
                                    imgObj.src = getSrc;
                                }
                            });
                        }
                    }
                }
            });
        }
        
        nyaaListInterval = setTimeout(function() {
            nyaaPageLoad(getIdx);
        }, nyaaListDelay);
    }
}


function nyaaMouseLoad(target) {
    var getUrl = $(target).find("a").attr("href");
    if(getUrl != "") {
        if($("#popup_view").length == 0) $("body").append("<div id='popup_view'></div>");
        
        if(overData[getUrl] == undefined) {
            $.ajax({
                type: "POST",
                url:getUrl,
                dataType:"html",
                success:function(data) {
                    var getDesc = $(data).find(".viewdescription");
                    if(getDesc.find("img").length > 0) {
                        var getImgEle = getDesc.find("img").eq(0);
                        var getImgSrc = getImgEle.attr("src");
                        var getSrc = previewOriginalLoad(getImgEle);
                        
                        overData[getUrl] = [getImgSrc,getSrc];
                        previewShow(getImgSrc,getSrc);
                    }
                    else previewNo();
                }
            });
        }
        else previewShow(overData[getUrl][0], overData[getUrl][1]);        
    }
}

function previewShow(small,big) {
    var getScrollTop = $(window).scrollTop();
    var getShowTop = overPos.y - 240;
    if(getShowTop - getScrollTop < 0) getShowTop += (getScrollTop - getShowTop + 20);
    $("#popup_view").html("<img src='" + small  + "' alt=''>").stop(true,true).css({ left:overPos.x + 60, top:getShowTop }).fadeIn(200);
    
    if(big != "") {
        imgThumbLoad = true;
        nyaaImgObj.onload = function() {
            if(imgThumbLoad && nyaaImgLoad) $("#popup_view img").attr("src",big);
        };
        nyaaImgObj.src = big;                                     
    } 
}
function previewNo() {
    $("#popup_view").css({ left:overPos.x + 60, top:overPos.y - 40 }).html("<p><span><i class='fa fa-ban' aria-hidden='true'></i></span>이미지 없음</p>").fadeIn(200);
}

//계정 js 불러오게 바꾸기
var previewOriginalLoad = function(target) {
    var getSrc = "";
    var getImgEle = $(target);
    var getImgSrc = getImgEle.attr("src");

    if(getImgSrc.indexOf("pixsense") > -1) getSrc = getImgSrc.replace("upload/small-","upload/");                                    
    else if(getImgSrc.indexOf("upload/small") > -1) getSrc = getImgSrc.replace("upload/small","upload/big");                                    
    else if(getImgSrc.indexOf("images/small") > -1) getSrc = getImgSrc.replace("images/small","images/big");                                    
    else if(getImgSrc.indexOf("imgtrex") > -1) getSrc = getImgSrc.replace("_t.jpg",".jpg").replace("_t.png",".png");                                    
    else if(getImgSrc.indexOf("imgclick") > -1) getSrc = getImgSrc.replace("_t.jpg",".jpg").replace("_t.png",".png");                                    
    else if(getImgSrc.indexOf("javtotal") > -1) getSrc = getImgSrc.replace("_thumb","");                                    
    else if(getImgSrc.indexOf("imgdream") > -1) getSrc = getImgSrc.replace("_thumb","");      
    else if(getImgSrc.indexOf("imgchili") > -1) {
        var getImgArray = getImgSrc.split(".")[0].split("//")[1] + ".";
        getSrc = getImgSrc.replace(getImgArray,getImgArray.replace("t","i"));
    }
    else if(getImgSrc.indexOf("ironimg") > -1) {
        var getSrcValue = getImgSrc.split("/t/")[1].split("/")[0];
        if(getImgSrc.indexOf(".png") > -1) getSrc = getImgSrc.replace("ironimg.net", "i" + getSrcValue + ".ironimg.net").replace("/t/" + getSrcValue + "/","/i/").replace(".png","") + ".png";                                        
        else getSrc = getImgSrc.replace("ironimg.net", "i" + getSrcValue + ".ironimg.net").replace("/t/" + getSrcValue + "/","/i/").replace(".jpg","") + ".jpg";                                        
    }                         
    else if(getImgSrc.indexOf("imagetwist") > -1) {
        var getImgValue = getImgSrc.replace("/th/","/i/").substring(0, getImgSrc.lastIndexOf("/"));
        var getLinkValue = getImgEle.parent().attr("href").split(".com/")[1];                                    
        var getLinkArray = getLinkValue.split("/");
        if(getLinkArray[1].indexOf(".jpg") > -1) getSrc = getImgValue + getLinkArray[0] + ".jpg/" + getLinkArray[1];                                    
        else if(getLinkArray[1].indexOf(".png") > -1) getSrc = getImgValue + getLinkArray[0] + ".png/" + getLinkArray[1];                                    
    }                                           

    return getSrc;
};

//이전에 봤던곳 표시
var getToday = new Date();
var nyaaToday = getToday.getFullYear() + "" + (getToday.getMonth()+1) + "" + getToday.getDate();
var nyaaPrevPage = getCookie(nyaaDomain + "_nyaaprevpage");
var nyaaPageVal = nyaaPrevPage.split(",");
function nyaaListPage(type,list) {
    if(!nyaaPreview) return;
    if(type == "load") {        
        //링크 찾기
        var getFirstPage = $("table.tlist td.tlistname").eq(0).find("a").attr("href").split("tid=")[1];
        var getPrevArray = nyaaPageVal;
        $.each(getPrevArray,function(key, value) {                
            var getPrevList = $("table.tlist td.tlistname a[href*='" + value + "']");
            //if(key > 0 && getFirstPage != value && getPrevList.length > 0) {
            if(getPrevList.length > 0) {
                $("<tr class='nyaa_prevlist'><td colspan='8'><p><i class='fa fa-arrow-down' aria-hidden='true'></i>이전에 여기까지 읽음</p></td></tr>").insertBefore(getPrevList.closest("tr"));
            }
        });
            
        if(getPrevArray.length > 0 && parseInt(getPrevArray[0],10) < parseInt(getFirstPage,10)) {
            nyaaListPageSave(getPrevArray, getFirstPage);            
        }
    }
    else if(type == "save") {
        var getListNumber = list.find("td.tlistname a").attr("href").split("tid=")[1];
        if(getListNumber != "" && !isNaN(getListNumber)) {
            var getPrevArray = nyaaPageVal;
            if(getPrevArray.length == 0 || parseInt(getPrevArray[0],10) < parseInt(getListNumber,10)) {
                nyaaListPageSave(getPrevArray, getListNumber);
            }
        }
    }
}

function nyaaListPageSave(data, list) {
    if(data.length > 6) {
        data.pop();
    }
    data.unshift(list);
    nyaaPageVal = data;
    setCookie(nyaaDomain + "_nyaaprevpage",data.join(","),365);
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}