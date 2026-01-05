// ==UserScript==
// @name PTLightBoxThief
// @include     http://*pussytorrents*/torrents/browse*
// @version     5.0.1
// @description shows the pictures in the browse page so you don't have to open the torrent details pages.
// @namespace http://www.example.com
// @downloadURL https://update.greasyfork.org/scripts/4708/PTLightBoxThief.user.js
// @updateURL https://update.greasyfork.org/scripts/4708/PTLightBoxThief.meta.js
// ==/UserScript==

function getComments(torrentID, page) {
    $.post("/comments/"+torrentID, { page: page},
        function(data) {
            $('#comments').html(data);
        }
    );
}
$(document).ready(function() {
    $('#fileselectbutton').click(function(e){
        $('#file').trigger('click');
    });

    $('#file').change(function(e){
        var val = $(this).val();

        var file = val.split(/[\\/]/);

        $('#filename').val(file[file.length-1]);
    });

    // Change hash for page-reload
    $('.nav-tabs a').on('shown', function (e) {
        window.location.hash = e.target.hash;
    })

    $('#tTabs').bind('show', function (e) {
        var now_tab = e.target // activated tab
        var url = $(now_tab).data('ajax');

        if (url) {
            // get the div's id
            var divid = $(now_tab).attr('href').substr(1);

            var torrentid = $(now_tab).data('torrentid');

            $.get(url, { torrentID: torrentid},
                function(data) {
                    $("#"+divid).html(data);
                });
        }
    });

    $('.nav-tabs li a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('.tab-content > .tab-pane.active').jScrollPane();
    });

    //**** FUNCTION TO CORRECTLY LINK TO ALL TABS ***//
    // Javascript to enable link to tab
    var url = document.location.toString();
    if (url.match('#')) {
      
        $('.nav-tabs a[href="#'+url.split('#')[1]+'"]').tab('show') ;
    }

    $('.lightbox').lightbox();

    $("#newImageForm").ajaxForm({
        dataType: 'json',
        beforeSubmit: function() {
            $('#newImageButton').addClass("disabled");
            return true;
        },
        success: function(data) {
            $('#newImageForm').resetForm();
            $('#newImageButton').button("reset");
            $("#newImage").collapse('hide');
            $("#torrentImages").empty();
            if (data.length > 0) {
                $.each(data, function(key, item) {
                    $('<a href="'+item.noresizeUrl+'" class="lightbox" rel="imagegroup" data-image-id="'+item.imageID+'"><img src="'+item.thumbUrl+'" class="img-polaroid"></a>').appendTo("#torrentImages");
                });
            }
            else {
                $("#torrentImages").append('<div class="alert">There are no covers or screens uploaded yet for this torrent.</div>');
            }
        }
    });

    $("#reportTorrentButton").live("click", function() {
        var torrentid = $(this).data("torrentid");

        bootbox.dialog("<textarea style='width: 500px;' id='report_torrent' rows=4 placeholder='Please write a detailed explanation. False reports may result in a ban.'></textarea>", [{
            "label" : "Submit Report",
            "class" : "btn-success",
            "callback": function() {
                var reason = $("#report_torrent").val();
                $.post("/torrents/torrent/report", { torrent_id: torrentid, reason: reason},
                    function(data) {
                        $("#updateDiv").html(data);
                    }
                );
            }
        },{
            "label" : "Cancel",
            "class" : "btn",
            "callback": function() {
            }
        }]);
    });

    $('#newCommentForm').submit(function() {
        var torrentid = $(this).data("torrentid")
        // submit the form
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function () {
                $("#newCommentButton").button('loading');
            },
            success: function() {

                getComments(torrentid, "1");
                $("#newCommentButton").button('reset');
                $("#newComment").collapse('hide');
            },
            target: "#updateDiv"
        });

        // return false to prevent normal browser submit and page navigation
        return false;
    });

    $(".deleteCommentButton").live("click", function() {
        var commentid = $(this).data("commentid");
        var torrentid = $(this).data("torrentid");
        var page = $(this).data("page");
        bootbox.confirm("Are you sure you want to delete this comment?", function(result) {
            if (result) {
                $(this).button("load");
                $.post("/torrents/comments/delete", { commentID: commentid},
                    function(data) {
                        getComments(torrentid, page);
                        $("#updateDiv").html(data);
                    }
                );
            }
        });
    });

    $(".reportCommentButton").live("click", function() {
        var commentid = $(this).data("commentid");
        var torrentid = $(this).data("torrentid");
        var reportButton = $(this);
        reportButton.button("loading");
        bootbox.confirm("Are you sure you want to report this comment?", function(result) {
            if (result) {
                $.post("/torrents/comments/report", { comment_id: commentid},
                    function(data) {
                        $("#updateDiv").html(data);
                        reportButton.button("reset");
                    }
                );
            } else {
                reportButton.button("reset");
            }
        });
    });

    $(".editCommentButton").live("click", function() {
        var commentid = $(this).data("commentid");
        var page = $(this).data("page");
        var torrentid = $(this).data("torrentid");
        var editbutton = $(this);

        editbutton.button("loading");

        $.get("/torrents/comments/loadcomment", { commentID: commentid},
            function(data) {
                bootbox.dialog("<textarea style='width: 500px;' id='new_comments' rows=4>"+data+"</textarea>", [{
                    "label" : "Edit Comment",
                    "class" : "btn-success",
                    "callback": function() {
                        var newcomments = $("#new_comments").val();
                        $.post("/torrents/comments/edit", { commentID: commentid, comments: newcomments},
                            function(data) {
                                getComments(torrentid, page);
                                $("#updateDiv").html(data);
                            }
                        );
                    }
                },{
                    "label" : "Cancel",
                    "class" : "btn",
                    "callback": function() {
                            editbutton.button("reset");
                    }
                }]);
            }
        );

    });







});

/*global $:false */
/*global GM_addStyle:false */
/*global document:false */
/*sglobal console:false */
/*global window:false */

if ( GM_addScript === undefined) {
    var GM_addScript = function(p) {
		var scr = document.createElement('script');
	    scr.type = "text/javascript";
	    if (typeof(p) == "string") {
            scr.src  = p;
        } else {
            scr.textContent = '(' + p.toString() + ')();';
        }
        document.head.appendChild(scr);
	
        return scr;
    };
}

$.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};



var maxImagesPerTorrent = 10;
var thumbWidthMax = 350;
var thumbHeightMax = 350;

var totalImgCounter = 0;

var scrollPosition = $('body').scrollTop();
var lastRow = $('tr');
var lastElement = $('a');

var dataImageIDs = [];

var newClick = function(){
  var wheight = $(window).height();
  if(scrollPosition !== null){
    $("body").animate({ scrollTop:  scrollPosition - $(window).height() / 2 + 50});
  }
};



function showImages() {
  // var image = new Image();
  // image.src = "http://pussytorrents.org/templates/pt_default/images/jquery-lightbox-theme.png";
  $("#torrenttable td.name").each(function() {


    var td = $(this),
			container = $(document.createElement("tr")),
			aUrl = td.find("a").attr("href"),
            imgCounter = 0;
    $.ajax({
      url: aUrl,
      datatype: 'xml' 
      }).done(function(data) {

        container.css( "text-align", "center");
        var thumbTD = $(document.createElement("td")),
                closestTR = td.closest('tr');
        thumbTD.css( "text-align", "center");
        thumbTD.attr('colspan','8');
        var imgHref = $(data).find(".lightbox").each(function() {
          if(imgCounter >= maxImagesPerTorrent) {

            thumbTD.append("... ");
            container.append(thumbTD); 
            container.addClass("thumbRow");
            container.insertAfter(closestTR);                     
            return;
          }
          var that = this;
          var imgSrc = $(this).find("img").attr("src");
          var aHref = $(this).attr("href");
          var dataImageID = $(this).attr("data-image-id");
          var a = $(document.createElement("a"));
          a.attr("href", aHref);
          a.attr("data-image-id", dataImageID||totalImgCounter);
          a.addClass("lightbox");
          a.attr('rel', 'imagegroup');
          a.css("margin","0 5px 0 20px");
          a.css("padding","0");
          a.css("display","inline-block");
          
          a.on('click',function(){
            $(".lastClicked").removeClass("lastClicked");
              a.children().each(function(){
                $(this).addClass("recentlyClicked").addClass("lastClicked");
              });
            lastRow = $(closestTR);
            scrollPosition = null;
            // $(closestTR).addClass("recentlyClicked").addClass("lastClicked");
            if(Storage!==undefined){
              localStorage.setItem($(that).attr("data-image-id"),true);
            }
          });
    
          var img = $(document.createElement("img"));
          img.attr("src", imgSrc);
          //img.addClass('img-polaroid');
          img.css("display","inline-block");

          a.append(img);

        
          thumbTD.append(a);
          container.append(thumbTD);

          container.addClass("thumbRow");
          container.insertAfter(closestTR);

          imgCounter++;
          totalImgCounter++;
          if(Storage!==undefined){
            if(localStorage.getItem(dataImageID)){
                $('[data-image-id='+dataImageID+']').children('img').each(function(){
                    $(this).addClass("recentlyClicked");
				});                
            }
          }
        });
        
      $('a .lightbox').lightbox({fixedNavigation:false});
      $('a .lightbox').css("max-width", thumbWidthMax+"px");
      $('a .lightbox').css("max-height",thumbHeightMax+"px");
      $('a .lightbox').css("margin","3px 0px 0px 10px");
      $('a .lightbox img').css("margin","0");
      $('a .lightbox img').each(function() {

          var ratio = 0;  // Used for aspect ratio
          var width = $(this).width();    // Current image width
          var height = $(this).height();  // Current image height

          // Check if the current width is larger than the max
          if(width > thumbWidthMax){
              ratio = thumbWidthMax / width;   // get ratio for scaling image
              $(this).css("width", thumbWidthMax); // Set new width
              $(this).css("height", height * ratio);  // Scale height based on ratio
              height = height * ratio;    // Reset height to match scaled image
          }

          var imgWidth = $(this).width();    // Current image width
          var imgHeight = $(this).height();  // Current image height

          // Check if current height is larger than max
          if(imgHeight > thumbHeightMax){
              ratio = thumbHeightMax / imgHeight; // get ratio for scaling image
              $(this).css("height", thumbHeightMax);   // Set new height
              $(this).css("width", imgWidth * ratio);    // Scale width based on ratio
              imgWidth = imgWidth * ratio;    // Reset width to match scaled image
          }
        });
     });
  });  
}



var grabThumbnails = function(){

  maxImagesPerTorrent = 10;
  thumbWidthMax = 350;
  thumbHeightMax = 350;

  totalImgCounter = 0;

  scrollPosition = $('body').scrollTop();
  lastRow = $('tr');
  lastElement = $('a');

  dataImageIDs = [];
  // GM_addScript('http://www.pussytorrents.org/templates/pt_default/js/torrents/torrent/torrent.js');

  if ($('#torrenttable') === undefined) {
       throw "no #torrenttable";
   }
   showImages();
   
  $('.jquery-lightbox-overlay').click(function(){newClick();});
  $('.jquery-lightbox-button-close').click(function(){newClick();});

  $('.jquery-lightbox-button-max').click(function(){
     scrollPosition = $(lastRow).offset().top;
  });

  $('.jquery-lightbox-button-left').click(function(){
    if( $(".jquery-lightbox-background img").attr('src') !== undefined) {
      $('a[data-image-id]').each(function(){
        dataImageIDs.push($(this).attr('data-image-id'));
      });
      var lastLastElement = $("a:has(img[src$='"+$(".jquery-lightbox-background img").attr('src').replace('noresize','thumb')+"'])");    
      var lastElementIndex = dataImageIDs.indexOf(lastLastElement.attr("data-image-id"))-1;
      var lastElement = $("a[data-image-id='"+dataImageIDs[lastElementIndex]+"']");

      $(".lastClicked").removeClass("lastClicked");
      lastElement.children('img').each(function(){
          $(this).addClass("recentlyClicked").addClass("lastClicked");
      });

      var closestTR =  $("tr:has(a[data-image-id='"+dataImageIDs[lastElementIndex]+"'])");
      lastRow = $(closestTR).prev('tr');
     // $(closestTR).addClass("recentlyClicked").addClass("lastClicked");

      var wheight = $(window).height();
      if($(lastRow).offset().top !== undefined){
        $("body").animate({ scrollTop:  $(lastRow).offset().top - $(window).height() / 2 + $(closestTR).height()});
      }

      scrollPosition = null;
      if(Storage!==undefined){
        localStorage.setItem($(lastElement).attr("data-image-id"),true);
      }
    }
  });
};
$(document).ready(function() {
    grabThumbnails();
});

$('.jquery-lightbox-button-right').click(function(){
    if($(".jquery-lightbox-background img").attr('src')!==undefined){
        $('a[data-image-id]').each(function(){
            dataImageIDs.push($(this).attr('data-image-id'));
        });
        var lastLastElement = $("a:has(img[src$='"+$(".jquery-lightbox-background img").attr('src').replace('noresize','thumb')+"'])");
        
        var lastElementIndex = dataImageIDs.indexOf(lastLastElement.attr("data-image-id"))+1;
        var lastElement = $("a[data-image-id='"+dataImageIDs[lastElementIndex]+"']");
        
        $(".lastClicked").removeClass("lastClicked");
        lastElement.children('img').each(function(){
            $(this).addClass("recentlyClicked").addClass("lastClicked");
        });
        
        var closestTR =  $("tr:has(a[data-image-id='"+dataImageIDs[lastElementIndex]+"'])");
        lastRow = $(closestTR).prev('tr');
        //$(closestTR).addClass("recentlyClicked").addClass("lastClicked");
        
        var wheight = $(window).height();
        if($(lastRow).offset().top !== undefined){ 
            $("body").animate({ scrollTop:  $(lastRow).offset().top - $(window).height() / 2 + $(closestTR).height()});
        }
        scrollPosition = null;
        if(Storage!==undefined){
            localStorage.setItem($(lastElement).attr("data-image-id"),true);
        }
    }
});


$('#torrenttable tbody tr').die ("click");
$('#torrenttable tbody .even, #torrenttable tbody tr.odd').live ("click", function() {
    var rowCount;
    if ( $(this).hasClass('row_selected') ) {
        $(this).removeClass('row_selected');
        rowCount = $('.row_selected').size();
        $(".rowCount").text('('+rowCount+')');
        if (rowCount === 0){
            $(".rowCount").text('');
        }
    }
    else {
        $(this).addClass('row_selected');
        rowCount = $('.row_selected').size();
        $(".rowCount").text('('+rowCount+')');
    }
});




var oldJQueryGet = $.get;
$.get = function(url,options, callback) {
  if(url.indexOf("/torrents/browse") === 0) {
    oldJQueryGet(url,options,function(data) {
      callback(data);
      showImages();
    });
  }
  else {
    oldJQueryGet(url,options,callback);
  }
}