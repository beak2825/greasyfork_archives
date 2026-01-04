// ==UserScript==
// @name Metart customization
// @namespace Adults
// @description Add bottom pagination of Metart
// @icon https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8cEM8UZttEqT61FhHPsEOeBFwEsBgp4b5Dg&usqp=CAU
// @run-at document-start
// @match *://*members.metartvip.com/movies*
// @grant none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/377064/Metart%20customization.user.js
// @updateURL https://update.greasyfork.org/scripts/377064/Metart%20customization.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(event) {
    $('a:not(.pagination_link)').prop('target', '_blank');
    $('.pagination').find('a').removeAttr('target');
    var modelNames = $('.update_information_model_name');
    modelNames.children('.model_featuring').hide();
    modelNames.children('a').css({'font-size': '13px', 'font-style': 'italic'});
    modelNames.show();
  
    $('.display_gallery_cell_movie').show();
  
    //$('#recent_container').show();
  
    //$('.options_container').css({'padding-bottom': '90px'}).show();
  
  
    $(".updates_area").append($(".archive_pagination").clone()[0]);
  
    $('.display_gallery_cell_movie').each(function () {
        var parentEl = $(this).closest('td'),
            infor = $(this).children('a').text().toLowerCase(),
            timeFilter = infor.split(' - ')[1].split(':')[0] < 15,
            boyFilter = infor.indexOf('boy') !== -1,
            girlToGirlFilter = infor.indexOf('girl-girl') !== -1,
            soloFilter = infor.indexOf('solo') !== -1,
            lesToGirlFilter = infor.indexOf('les') !== -1;
      
        if (girlToGirlFilter || soloFilter || lesToGirlFilter) {
            parentEl.hide();
        } else if (boyFilter) {
            return true;
        } else if (timeFilter) {
            //parentEl.css({'background': 'darkgray'});
        }
    });
  
  
    if (!localStorage.getItem('metart_female_models')) {
        showLoadingIcon();
        [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach(function (letter) {
            $.ajax({
                url: "http://members.metartvip.com/models/all/" + letter
            }).done(function (response) {
                var names = localStorage.getItem('metart_female_models');
                names = names ? names.split(',') : [];
                $(response).find(".update_information_model_name").each(function (i, name) {
                    names.push($(name).text().toLowerCase());
                });
                localStorage.setItem('metart_female_models', names);

                if (letter === "Z") {
                    hideUnwantedVideos();
                }
            })
        });
    } else {
        hideUnwantedVideos();
    }

    
    function hideUnwantedVideos() {
        var femaleModels = localStorage.getItem('metart_female_models');
        if (femaleModels) {
            femaleModels = femaleModels.split(',');
            var displayVideos = [];
            var hiddenVideos = [];
            $('.updates_table tr').each(function () {
                $(this).find('.gallery_image_cell_container').each(function () {
                    let modelNames = $(this).children('a').attr('href').split('/')[4].replace(/-/gi, ' ').split(' and ');
                    let thumbnailEl = $(this).find('a > img');
                    let femaleModelCnt = 0;
                    modelNames.forEach(function (modelName) {
                        if (femaleModels.indexOf(modelName) !== -1) {
                            femaleModelCnt++;
                        }
                    });

                    if (modelNames && (modelNames.length < 2 || femaleModelCnt === modelNames.length)) {
                        thumbnailEl.hide();
                        $(this).closest('td').css({'background': 'darkgray'});
                        hiddenVideos.push($(this).closest('td')[0].outerHTML);
                    } else {
                        let videoId = thumbnailEl.attr('src').split('/')[8];
                        let downloadHdVideoUrl = `http://members.metartvip.com/helper/movie.f4v?movie=${videoId}&resolution=high&format=mp4&method=download`;
                        $(this).closest('td').find('.update_information_model_name')
                            .append(`<br><a class="download_displayed_video" href="${downloadHdVideoUrl}" target="_blank" style="font-size: 14px;">&lt;&lt;Download 720p&gt;&gt;</a>`);
                        displayVideos.push($(this).closest('td')[0].outerHTML);
                    }
                });
            });

            var videos = displayVideos.concat(hiddenVideos);
            $('.updates_table tr').each(function (rowIndex) {
                var columnIndex = 4 * rowIndex;
                $(this).html(videos.slice(columnIndex, Math.min(columnIndex + 4, videos.length)).join(''));
            });
        }
      
        
        if ($('.download_displayed_video').length) {
            $('.updates_area').prepend('<button id="download_all_displayed_videos">Download All</button>')
            $('#download_all_displayed_videos').on('click', function () {
                $('.download_displayed_video').each(function () {
                    $(this)[0].click();
                });
            });
        }

        previewThumbnails();
        hideLoadingIcon();
    }

    function showLoadingIcon() {
        var loadingIcon = `
        <div id="cover-spin"></div>
        <style>
        #cover-spin {
            position:fixed;
            width:100%;
            left:0;right:0;top:0;bottom:0;
            background-color: rgba(255,255,255,0.7);
            z-index:9999;
            display:none;
        }

        @-webkit-keyframes spin {
            from {-webkit-transform:rotate(0deg);}
            to {-webkit-transform:rotate(360deg);}
        }

        @keyframes spin {
            from {transform:rotate(0deg);}
            to {transform:rotate(360deg);}
        }

        #cover-spin::after {
            content:'';
            display:block;
            position:absolute;
            left:48%;top:40%;
            width:40px;height:40px;
            border-style:solid;
            border-color:black;
            border-top-color:transparent;
            border-width: 4px;
            border-radius:50%;
            -webkit-animation: spin .8s linear infinite;
            animation: spin .8s linear infinite;
        };
        </style>
        `;

        if (!$('#cover-spin').length) {
            $('body').append(loadingIcon);
        }

        $('#cover-spin').show();
    }

    function hideLoadingIcon() {
        $('#cover-spin').hide();
    }
  
    if (!$('.paginate_left_arrow').children('a.arrow_disabled').length) {
        var leftArrowPaginate = $('.paginate_left_arrow').html();
        var floatingLeftArrowPaginate = `
            <div class="paginate_left_arrow" id="floating_left_paginate" style="
                    position: fixed;
                    top: 50%;
                    left: 10%;
                ">
            </div>
            `;
        $('.pad_wrapper').prepend(floatingLeftArrowPaginate);
        $('#floating_left_paginate').html(leftArrowPaginate);
    }

    if (!$('.paginate_right_arrow').children('a.arrow_disabled').length) {
        var rightArrowPaginate = $('.paginate_right_arrow').html();
        var floatingRightArrowPaginate = `
            <div class="paginate_right_arrow" id="floating_right_paginate" style="
                position: fixed;
                top: 50%;
                right: 10%;
            ">
            </div>
        `;
        $('.pad_wrapper').prepend(floatingRightArrowPaginate);
        $('#floating_right_paginate').html(rightArrowPaginate);
    }
    
    $(window).load(function() {
      //$("html, body").animate({ scrollTop: $(document).height() - $(".footer").height() - 650 }, 1000);
    });
  
    /**
     * Restore preview event: https://static.metartnetwork.com/view/js/main.js
     */
    function previewThumbnails() {
        var spriteMouseTimeout;

        jQuery('.gallery_image_cell_container').hover(function() {
            var spriteContext = this;
            spriteMouseTimeout = setTimeout(function() {
                if(jQuery(window).width() >= 769) {
                    jQuery(spriteContext).children('.sprite').css('background-image', jQuery(spriteContext).children('.sprite').attr('style-load'));
                    jQuery(spriteContext).children('.sprite').show('600');
                }
            }, 300);
        }, function() {
            clearTimeout(spriteMouseTimeout);
            jQuery(this).children('.sprite').hide('600');
        });

        jQuery('.custom-trending-image').hover(function() {
            var spriteContext = this;
            spriteMouseTimeout = setTimeout(function() {
                if(jQuery(window).width() >= 769) {
                    jQuery(this).children('.sprite').css('background-image', jQuery(this).children('.sprite').attr('style-load'));
                    jQuery(this).children('.sprite').show('600');
                }
            }, 500);
        }, function() {
            clearTimeout(spriteMouseTimeout);
            jQuery(this).children('.sprite').hide('600');
        });

        jQuery('.sprite').hover(function() {
            jQuery(this).css('background-image', jQuery(this).attr('style-load'));
            jQuery(this).show();
            var spriteOffset = jQuery(this).offset();
            var spriteWidth = jQuery(this).css('width');
            jQuery(this).mousemove(function(event) {
                var mouseX = Math.ceil(((event.pageX - spriteOffset.left) / 317) * 48) - 1;
                var backgroundPosition = 178 * mouseX;
                jQuery(this).css('background-position', '0 -' + backgroundPosition + 'px');
            });
        });
    }
});
