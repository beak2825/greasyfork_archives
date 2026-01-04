// ==UserScript==
// @name BS + FA in Studio
// @namespace Script Runner Pro
// @match https://studio.extend.uq.edu.au/*
// @grant none
// @description UQ LearnX Studio with Bootstrap + Font Awesome and make Publish/Preview/View Live Buttons Scroll with you
// @version 1.47
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456866/BS%20%2B%20FA%20in%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/456866/BS%20%2B%20FA%20in%20Studio.meta.js
// ==/UserScript==

window.addEventListener('load',function(){
    if($('span.course-title').text() == '[MEDI7100] Foundations of Medicine (St Lucia). Semester 1, 2023'|| $('span.course-title').text() == '[MEDI7200] Developing Skills in Medicine (St Lucia). Semester 1, 2024'){
        console.log('This is MEDI7100');
        $('head').prepend('<script src="https://uq-itali.github.io/uqlearnx/medi7100/copycodemedi7100.js"></script>');
        $('head').prepend('<link rel="stylesheet" href="https://uq-itali.github.io/uqlearnx/medi7100/bootstrap-5.2.1-dist/css/bootstrap.css">');
        $('head').prepend('<link rel="stylesheet" href="https://uq-itali.github.io/fontawesome-v6.1.1-free/css/all.css",">');
        $('head').prepend('<link rel="stylesheet" href="https://uq-itali.github.io/uqlearnx/medi7100/css/customStyles.css">');
        $('body').append('<iframe src="https://uq-itali.github.io/uqlearnx/medi7100codecentre.html" id="codeCentre" class="position-fixed top-50 start-50 translate-middle d-none fade border border-dark border-3 rounded" style="z-index: 5000;" width="75%" height="70%"></iframe>\n<button class="btn btn-primary position-fixed top-0 start-0 m-2" id="codeCentreToggle" style="z-index: 1301;">Show Code Centre <i class="fa-solid fa-eye-slash"></i></button>')
        $('#codeCentreToggle').on('click', function(){
            if($('iframe#codeCentre').hasClass('d-none') == true){
                $("i", this).toggleClass('fa-eye-slash fa-eye');
                $(this).html('Hide Code Centre <i class="fa-solid fa-eye"></i>')
                $('iframe#codeCentre').removeClass('d-none');
                setTimeout(function(){
                    $('iframe#codeCentre').toggleClass('show');
                }, 200)
            }
            else if($('iframe#codeCentre').hasClass('d-none') == false){
                $("i", this).toggleClass('fa-eye fa-eye-slash');
                $(this).html('Show Code Centre <i class="fa-solid fa-eye-slash"></i>')
                $('iframe#codeCentre').toggleClass('show');
                setTimeout(function(){
                    $('iframe#codeCentre').addClass('d-none');
                }, 200)
            }
        })
        $('li.action-item').first().prepend('<a href="https://uq-itali.github.io/uqlearnx/medi7100codecentre.html" class="me-3 button button-view action-button medi7100cclink" aria-disabled="false" rel="noopener external" title="Open MEDI7100 Code Centre" target="_blank"><span class="action-button-text">Open MEDI7100 Code Centre</span></a>');
        var jumpSlice = window.location.href.slice(51);
        var courseSlice = window.location.href.slice(51,73);
        var viewLiveLink = 'https://learnx.uq.edu.au/courses/course-v1:'+courseSlice+'/jump_to/block-v1:'+jumpSlice;
        var previewLink = 'https://preview.learnx.uq.edu.au/courses/course-v1:'+courseSlice+'/jump_to/block-v1:'+jumpSlice;
        var viewLiveBtn = '<a href="" target="_blank" class="btn btn-primary d-block w-100 addViewLiveBtn mt-3">View Live</a>';
        var previewBtn = '<a href="" target="_blank" class="btn btn-primary d-block w-100 addPreviewBtn">Preview</a>';
        $('.unit-location').after(previewBtn);
        $('.addPreviewBtn').after(viewLiveBtn);
        $('.addViewLiveBtn').attr('href',viewLiveLink);
        $('.addPreviewBtn').attr('href',previewLink);
        $( window ).scroll(function() {
            var scroll = $(window).scrollTop();
            if(scroll >= '200'){
                $('.content-supplementary').css({'position':'fixed','right':'50px','top': '50px'});
                $('#sequence-nav').css({'position':'fixed', 'bottom' : '30px', 'z-index':'1001', 'width' : '74.46809%'});
            }
            else{
                $('.content-supplementary').removeAttr("style");
                $('#sequence-nav').removeAttr("style");
            }
        });
        var jumpToID = $('#unit-location-id-input').text();
        var headerTitle = $('h1.page-header-title span.title-value').text();
        var jumpToLink = '<div><a href="/jump_to_id/' + jumpToID + '" title="Jump to Link" target="_top">' + headerTitle + '</a></div>';
        $('#unit-location-id-input').after('<div class="badge btn text-bg-primary copyJumpLink d-block mx-auto w-50">Copy jump link</div>');
        var $tempBadge = $('<input>');
        $('.copyJumpLink').on('click', function (){
            var $copyJumpLink = $(this);
            var $jumpLinkHTML = $(jumpToLink).html();
            var $copyJumpLinkHTML = $(this).html();
            $('body').append($tempBadge);
            $tempBadge.val($jumpLinkHTML).select();
            document.execCommand('copy');
            $tempBadge.remove();
            $copyJumpLink.html('<span style="color: var(--bs-bg-color) !important" class="fa fa-check"></span> Jump link copied');
            window.setTimeout(function () {
                $copyJumpLink.html($copyJumpLinkHTML);
            }, 2000);
        });
    }
    else{
        console.log('not MEDI7100');
    }
});